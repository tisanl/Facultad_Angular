import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hijo2',
  templateUrl: './hijo2.component.html',
  styleUrls: ['./hijo2.component.scss']
})
export class Hijo2Component {

  datoHijo = "Dato hijo 2";
  @Output() onEnviarDato = new EventEmitter<any>();

  enviarDato() {
    this.onEnviarDato.emit(this.datoHijo);
  }

}
