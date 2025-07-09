import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMsjErrorComponent } from '../../components/modal-msj-error/modal-msj-error.component';

import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario/usuario';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
  standalone: false
})
export class RegistroComponent {
  nombre!: string;
  apellido!: string;
  fecha_nacimiento!: Date;
  email: string = '';
  password: string = '';

  constructor(private router: Router, private modalService: NgbModal, private usuario: UsuarioService) { }

  async registrarUsuario() 
  {
    if (this.validarDatosRegistro()) 
    {
      let usuario = new Usuario()
      usuario.nombre = this.nombre
      usuario.apellido = this.apellido
      usuario.fecha_nacimiento = this.fecha_nacimiento
      usuario.email = this.email

      try {
        await this.usuario.registrar(usuario, this.password)
        this.goTo('auth/login');
      }
      catch (e: any) {
        this.mostrarError(e.message);
      }
    }
    else this.mostrarError('Hay datos incorrectos.');
  }

  validarDatosRegistro() {
    if (this.nombre != null) this.nombre = this.capitalizar(this.nombre);
    else return false

    if (this.apellido != null) this.apellido = this.capitalizar(this.apellido);
    else return false

    if (this.fecha_nacimiento == null) return false

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

    modalRef.componentInstance.titulo = 'Error en el Registro';
    modalRef.componentInstance.mensaje = mensaje;
  }

  capitalizar(texto: string) {
    return texto[0].toUpperCase() + texto.slice(1).toLowerCase();
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}

