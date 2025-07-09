import { Component , Input} from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-msj-error',
  standalone: true,
  imports: [],
  templateUrl: './modal-msj-error.component.html',
  styleUrl: './modal-msj-error.component.scss'
})
export class ModalMsjErrorComponent {
  @Input() titulo: string = 'Error';
  @Input() mensaje: string = 'Error';

  constructor(private router: Router, public activeModal: NgbActiveModal) {}

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
