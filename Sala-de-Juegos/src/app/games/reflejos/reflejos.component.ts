import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFinJuegoComponent } from '../modal-fin-juego/modal-fin-juego.component';
import { Cronometro, CronometroService } from '../../services/cronometro/cronometro.service';
import { Subscription } from 'rxjs';
import { ConexionSupabaseService } from '../../services/conexionSupabase/conexion-supabase.service';
import { Score } from '../../components/scores/scores.component';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-viborita',
  standalone: false,
  templateUrl: './reflejos.component.html',
  styleUrl: './reflejos.component.scss'
})
export class ReflejosComponent implements OnInit, OnDestroy {
  puntos: number = 0;

  cronometroSubscription: Subscription | null = null;
  cronometro?: Cronometro;

  estado: 'inicio' | 'esperando' | 'activo' | 'resultado' = 'inicio';
  mensaje: string = 'Presioná "Comenzar" para iniciar';
  fallo: boolean = false;

  tiempoInicio: any; // para guardar el timeout
  temporizador: any; // para guardar el timeout

  intentos: number = 5;

  constructor(private router: Router, private modalService: NgbModal, private cronometroService: CronometroService, private db: ConexionSupabaseService, private usuario: UsuarioService) { }

  ngOnInit(): void {
    this.cronometroService.start();
    this.cronometroSubscription = this.cronometroService.cronometro.subscribe(c => {
      this.cronometro = c;
    });

    this.puntos = 0;
    this.intentos = 5;
    this.estado = 'inicio';
  }

  iniciarRonda() {
    // Esta funcion se va a ejecutar siempre que se quiera iniciar un intento, que el estado del boton sea inicio
    // Pone el estado en esperando, actualiza el mensaje y resetea el fallo
    this.estado = 'esperando';
    this.mensaje = 'Esperá la señal...';
    this.fallo = false;

    // Setea el tiempo que una vez cumplido se activa el boton
    const demora = Math.floor(Math.random() * 3000) + 2000;

    // Esto setea un timeout que va a cambiar el estado del boton a activo
    this.temporizador = setTimeout(() => {
      this.estado = 'activo';
      this.tiempoInicio = Date.now();
    }, demora);
  }

  manejarClick() {
    // Esta funcion se va a ejecutar cuando el estado sea distinto de inicio
    if (this.estado === 'esperando') {
      this.intentos--;
      // Si se le da mientras dice esperando se le va a restar un intento y sin sumar puntos
      clearTimeout(this.temporizador); // Se elimina el temporizador para que no haga ningun cambio sobre el boton
      this.estado = 'resultado'; // Al poner resultado se va a poner el boton de acierto o error y va a esperar a que le de denuevo, siendo ese estado comenzara otra ronda
      this.mensaje = '¡Demasiado rápido!';
      this.fallo = true;
    }
    else if (this.estado === 'activo') {
      this.intentos--;
      // Si el estado es activo cuando da al boton
      const tiempoReaccion = Date.now() - this.tiempoInicio; // Se evalua la hora actual menos el tiempo desde que el boton cambio a activo
      this.estado = 'resultado';
      this.fallo = false;

      if (tiempoReaccion < 300) this.puntos += 100;
      else if (tiempoReaccion < 600) this.puntos += 50;
      else this.puntos += 25;

      this.mensaje = `Tiempo de reacción: ${tiempoReaccion} ms`;
    }
    // Si es resultado, que sucede despues de acertar o perder una ronda, se le da a siguiente ronda
    else if (this.estado === 'resultado') this.iniciarRonda();
    

    if (this.intentos === 0)
      this.finalizarPartida(true);
  }

  finalizarPartida(victoria: boolean) {
    this.cronometroService.stop();

    this.mostrarModal('Puntos totales: ' + this.puntos);
    
    let score = new Score()
    score.usuario_id = this.usuario.data!.id;
    score.usuario_nombre = this.usuario.data!.nombre;
    score.game = 'reflejos';
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
