import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-fin-juego',
  standalone: false,
  templateUrl: './modal-fin-juego.component.html',
  styleUrl: './modal-fin-juego.component.scss'
})
export class ModalFinJuegoComponent {
  @Input() titulo: string = 'Error';
  @Input() mensaje: string = 'Error';

  constructor(public activeModal: NgbActiveModal) {}

}
