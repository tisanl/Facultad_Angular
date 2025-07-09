import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario/usuario';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  nombre?: string;
  clave?: string;

  usuario: Usuario = new Usuario();

  @Output() valorRetornado = new EventEmitter<boolean>();

  validarIngreso() {
    if(this.usuario.nombre == this.nombre && this.usuario.clave == this.clave) 
      this.valorRetornado.emit(true)
    else
      this.valorRetornado.emit(false)
  }
}
