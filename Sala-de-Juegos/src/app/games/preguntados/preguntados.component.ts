import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFinJuegoComponent } from '../modal-fin-juego/modal-fin-juego.component';
import { Cronometro, CronometroService } from '../../services/cronometro/cronometro.service';
import { SolicitudHttpService } from '../../services/solicitud-http/solicitud-http.service';
import { Subscription } from 'rxjs';
import { Score } from '../../components/scores/scores.component';
import { ConexionSupabaseService } from '../../services/conexionSupabase/conexion-supabase.service';
import { UsuarioService } from '../../services/usuario/usuario.service';

export interface ApiResponseRickMorty {
  info: info,
  results: Array<Personaje>,
}

export interface info {
  count: number,
  pages: number,
  next: string,
  prev: string,
}

export interface Personaje {
  id: number,
  name: string,
  status: string,
  species: string,
  type: string,
  gender: string,
  origin: {
    name: string,
    url: string
  },
  location: {
    name: string,
    url: string,
  },
  image: string,
  episode: [
    string,
  ],
  url: string,
  created: string,
}

@Component({
  selector: 'app-preguntados',
  standalone: false,
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.scss'
})
export class PreguntadosComponent {
  cronometroSubscription: Subscription | null = null;
  cronometro?: Cronometro;

  personajes!: Array<Personaje>;

  personajeImagenUrl!: string;

  aciertos!: number;
  preguntasRestantes!: number;

  personajeSeleccionado!: Personaje;
  seleccionado: boolean = false;
  resultado: string = "";

  opcion1: string = "";
  opcion2: string = "";
  opcion3: string = "";
  opcion4: string = "";

  puntos: number = 0;

  constructor(private router: Router, private modalService: NgbModal, private cronometroService: CronometroService, private http: SolicitudHttpService, private db: ConexionSupabaseService, private usuario: UsuarioService) { }

  ngOnInit(): void {
    this.cronometroService.start();
    this.cronometroSubscription = this.cronometroService.cronometro.subscribe(c => {
      this.cronometro = c;
    });

    this.puntos = 0;
    this.aciertos = 0;
    this.preguntasRestantes = 10;

    if (!this.personajes)
      this.http.getRickMortyPersonajes().subscribe(personajes => {
        this.personajes = personajes;
        if (!this.personajeSeleccionado)
          this.siguienteRonda()
      });
    else this.siguienteRonda()
  }

  getPersonajeRandom() {
    let i = Math.floor(Math.random() * this.personajes.length);
    return this.personajes[i];
  }

  getNombrePersonajeRandom() {
    let i = Math.floor(Math.random() * this.personajes.length);
    return this.personajes[i].name;
  }

  siguienteRonda() {
    if (this.preguntasRestantes == 0) {
      this.finalizarPartida()
      return
    }

    this.personajeSeleccionado = this.getPersonajeRandom()
    let opciones = this.shuffle([this.getNombrePersonajeRandom(), this.getNombrePersonajeRandom(), this.getNombrePersonajeRandom(), this.personajeSeleccionado.name])
    this.opcion1 = opciones[0]
    this.opcion2 = opciones[1]
    this.opcion3 = opciones[2]
    this.opcion4 = opciones[3]
    this.personajeImagenUrl = this.personajeSeleccionado.image;
    this.resultado = '';
    this.seleccionado = false;
  }

  private shuffle(opciones: Array<string>) {
    for (let i = opciones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
    }
    return opciones;
  }

  evaluarRespuesta(seleccion: string) {
    this.seleccionado = true;

    this.resultado = this.personajeSeleccionado.name;

    if (this.personajeSeleccionado.name == seleccion){
      this.aciertos++;
      this.puntos += 10;
    }

    this.preguntasRestantes--;
    setTimeout(() => this.siguienteRonda(), 2000);
  }

  finalizarPartida() {
    this.cronometroService.stop();

    if (this.cronometro!.minutos < 1)
      this.puntos += 100;
    else if (this.cronometro!.minutos < 2)
      this.puntos += 50;
    else if (this.cronometro!.minutos < 3)
      this.puntos += 25;

    this.mostrarModal('Partida finalizada\nAciertos: ' + this.aciertos + '\nPuntos totales: ' + this.puntos);

    let score = new Score()
    score.usuario_id = this.usuario.data!.id;
    score.usuario_nombre = this.usuario.data!.nombre;
    score.game = 'preguntados';
    score.points = this.puntos;

    this.db.guardarScore(score)
  }

  mostrarModal(mensaje: string) {
    const modalRef = this.modalService.open(ModalFinJuegoComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'custom-modal-style'
    });

    modalRef.componentInstance.titulo = 'Fin del Juego';
    modalRef.componentInstance.mensaje = mensaje;

    modalRef.result
      .then((resultado) => {
        if (resultado == 'volverAJugar') this.ngOnInit()
        else if (resultado == 'volverAlMenu') this.goTo('games/menu')
      })
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  ngOnDestroy() {
    this.cronometroSubscription?.unsubscribe();
    this.cronometroService.stop();
  }
}
