import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router, private usuario:UsuarioService) { 
  }

  logOut(){
    this.usuario.logout();
    this.goTo('auth/login');
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  
}
