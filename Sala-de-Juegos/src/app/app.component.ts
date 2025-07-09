import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

import { NavbarComponent } from './components/navbar/navbar.component';
import { UsuarioService } from './services/usuario/usuario.service';
import { Subscription } from 'rxjs';
import { Usuario } from './models/usuario/usuario';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbModule, NgIf, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'Sala de Juegos';

  ingresoUsuario: boolean = false;

  private authSub!: Subscription;

  constructor(private router: Router, public usuario: UsuarioService) {
    this.authSub = this.usuario.session.subscribe((session: Usuario | null) => {
      this.ingresoUsuario = session !== null;
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}

