import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { BienvenidoComponent } from './components/bienvenido/bienvenido.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FormsModule,LoginComponent,ErrorComponent,BienvenidoComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Ejercicio 1
  titulo = 'Calcular edades';

  edadUno: string = "";
  edadDos: string = "";

  edadTotal: string = "";

  sumarEdades() {
    this.edadTotal = String(Number(this.edadUno) + Number(this.edadDos))
  }

  limpiarCuadrosTexto() {
    this.edadUno = "";
    this.edadDos = "";
    this.edadTotal = "";
  }

  // Ejercicio 2
  usuarioEncontrado?: boolean;

  recibirUsuario(valor: boolean) {
    this.usuarioEncontrado = valor;
  }


}
