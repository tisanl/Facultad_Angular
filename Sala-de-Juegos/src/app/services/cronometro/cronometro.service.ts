import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription, Observable } from 'rxjs';

export interface Cronometro {
  segundos: number;
  minutos: number;
  formateado: string;
}

@Injectable({
  providedIn: 'root'
})
export class CronometroService implements OnDestroy {
  private contadorSegundos = 0;
  private suscripcionIntervalo: Subscription | null = null;
  private cronometroSubject = new BehaviorSubject<Cronometro>({
    segundos: 0,
    minutos: 0,
    formateado: '00:00'
  });

  get cronometro(): Observable<Cronometro> {
    return this.cronometroSubject.asObservable();
  }

  start(): void {
    this.stop();
    this.contadorSegundos = 0;
    this.emitirValor();
    this.suscripcionIntervalo = interval(1000).subscribe(() => {
      this.contadorSegundos++;
      this.emitirValor();
    });
  }

  stop(): void {
    this.suscripcionIntervalo?.unsubscribe();
    this.suscripcionIntervalo = null;
  }

  private emitirValor(): void {
    const minutos = Math.floor(this.contadorSegundos / 60);
    const segundos = this.contadorSegundos % 60;
    const formateado = minutos.toString().padStart(2, '0') + ':' + segundos.toString().padStart(2, '0');

    this.cronometroSubject.next({ segundos, minutos, formateado });
  }

  ngOnDestroy(): void {
    this.stop();
  }
}


/*
BehaviorSubject

Mantiene un valor interno
Desde su creación almacena siempre el “último” valor que recibió.

Requiere un valor inicial
Al instanciarlo debes darle un valor por defecto (por ejemplo 0 o cadena vacía).

Emite inmediatamente al suscribirse
Cualquier nuevo suscriptor recibe al instante ese valor interno, sin esperas.

Funciona como “almacén + flujo”

Como almacén: puedes consultar su valor actual (propiedad .value).

Como flujo: cuando haces .next(nuevoValor), notifica a todos los suscriptores.

*/
