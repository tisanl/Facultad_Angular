import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMsjErrorComponent } from '../../components/modal-msj-error/modal-msj-error.component';

import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private modalService: NgbModal, private usuario: UsuarioService) { }

  async login() {
    if (this.validarDatosIngreso()) {
      try {
        await this.usuario.login(this.email, this.password)
        this.goTo('home');
      }
      catch (e: any) {
        this.mostrarError(e.message);
      }
    }
  }

  validarDatosIngreso() {
    if (this.email == null) return false
    if (this.password == null) return false
    return true
  }

  mostrarError(mensaje: string) {
    const modalRef = this.modalService.open(ModalMsjErrorComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'custom-modal-style'
    });

    modalRef.componentInstance.titulo = 'Error en el Login';
    modalRef.componentInstance.mensaje = mensaje;
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  autocompletar() {
    this.email = 'santi.lopez8846@gmail.com'
    this.password = '123456'
  }
}
