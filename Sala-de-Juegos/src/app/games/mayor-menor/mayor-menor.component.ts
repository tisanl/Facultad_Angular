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

export interface Baraja {
  succes: boolean;
  deck_id: string;
  cards: Array<Carta>;
  remaining: number;
}

export interface Carta {
  code: string,
  image: string,
  value: string,
  suit: string
}

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent implements OnInit, OnDestroy {
  cronometroSubscription: Subscription | null = null;
  cronometro?: Cronometro;

  baraja!: Baraja;

  cartaUrlVolteada?: string;
  cartaUrlPorVoltear?: string;
  cartaParteAtras: string = '../../../assets/mayor-menor-images/logo.png';

  cartaVolteadaIndex: number = 0;
  cartaPorVoltearIndex: number = 1;
  mostrarCartaVolteada: boolean = false;

  aciertos!: number;
  cartasRestantes!: number;

  seleccionado: boolean = false;
  resultado: string = "";

  puntos: number = 0;

  constructor(private router: Router, private modalService: NgbModal, private cronometroService: CronometroService, private http: SolicitudHttpService, private db: ConexionSupabaseService, private usuario: UsuarioService) { }

  ngOnInit(): void {
    this.cronometroService.start();
    this.cronometroSubscription = this.cronometroService.cronometro.subscribe(c => {
      this.cronometro = c;
    });

    this.puntos = 0;
    this.aciertos = 0;
    this.cartasRestantes = 51;

    this.http.getDeckCartas('new', 52).subscribe({
      next: (res: Baraja) => {
        this.baraja = res;
        this.dibujarCarta();
        console.log(this.baraja.cards)
      },
      error: (err: any) => {
        console.error('Error al obtener la baraja:', err);
      }
    });
  }

  get cartaVolteada(): Carta {
    return this.baraja.cards[this.cartaVolteadaIndex]
  }

  get cartaPorVoltear(): Carta {
    return this.baraja.cards[this.cartaPorVoltearIndex]
  }

  getValorCarta(carta: Carta): number {
    if (carta.value == 'ACE') return 1
    else if (carta.value == 'KING') return 13
    else if (carta.value == 'QUEEN') return 12
    else if (carta.value == 'JACK') return 11
    else return Number(carta.value)
  }

  dibujarCarta() {
    this.cartaUrlVolteada = this.cartaVolteada.image;
    if (this.mostrarCartaVolteada) {
      this.cartaUrlPorVoltear = this.cartaPorVoltear.image;
      this.mostrarCartaVolteada = false;
    }
    else
      this.cartaUrlPorVoltear = this.cartaParteAtras
  }

  siguienteRonda() {
    if (this.cartasRestantes == 0)
      this.finalizarPartida()
    this.seleccionado = false;
    this.cartaVolteadaIndex++;
    this.cartaPorVoltearIndex++;
    this.dibujarCarta()
    this.resultado = ""
  }

  evaluarCarta(seleccion: string) {
    this.seleccionado = true;
    this.mostrarCartaVolteada = true;
    this.dibujarCarta()

    if (this.getValorCarta(this.cartaPorVoltear) > this.getValorCarta(this.cartaVolteada)) this.resultado = 'mayor';
    else if (this.getValorCarta(this.cartaPorVoltear) < this.getValorCarta(this.cartaVolteada)) this.resultado = 'menor';
    else this.resultado = 'igual';

    if (seleccion == this.resultado) {
      this.aciertos++;
      this.puntos += 10;
    }

    this.cartasRestantes--;
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
    score.game = 'mayor-menor';
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
