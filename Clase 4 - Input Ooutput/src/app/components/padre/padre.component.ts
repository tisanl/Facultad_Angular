import { Component } from '@angular/core';

@Component({
  selector: 'app-padre',
  templateUrl: './padre.component.html',
  styleUrls: ['./padre.component.scss']
})
export class PadreComponent {

  dato: string = "Dato del padre";
  dato2: number = 0;

  recibirDato(nuevoDato: string) {
    this.dato = nuevoDato;
  }

  recibirDato2(nuevoDato2: number) {
    this.dato2 = nuevoDato2;
  }
}
