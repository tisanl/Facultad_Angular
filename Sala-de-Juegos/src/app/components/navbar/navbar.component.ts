import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  nombre: string = '';

  constructor(private usuario: UsuarioService){
    if(this.usuario.data && this.usuario.data.nombre && this.usuario.data.apellido)
      this.nombre = this.usuario.data.apellido + ' ' + this.usuario.data.nombre
  }

}
