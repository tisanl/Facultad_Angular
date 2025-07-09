import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConexionSupabaseService } from '../../services/conexionSupabase/conexion-supabase.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMsjErrorComponent } from '../../components/modal-msj-error/modal-msj-error.component';

export class Encuesta {
  id?: string;
  created_at!: string;
  usuario_id!: string;
  nombre?: string;
  edad?: string;
  telefono?: string;
  juego_favorito?: string;
  juegos_agregar?: Array<string>;
  experiencia?: string;

  get fecha() {
    const normalizado = this.created_at.replace(/\.(\d{3})\d+/, '.$1');
    const fecha = new Date(normalizado);
    const dd = fecha.getDate().toString().padStart(2, '0');
    const mm = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = fecha.getFullYear().toString();
    return `${dd}/${mm}/${yyyy}`;
  }
}

@Component({
  selector: 'app-encuestas',
  imports: [NgIf, ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './encuestas.component.html',
  styleUrl: './encuestas.component.scss'
})
export class EncuestasComponent implements OnInit {

  public form!: FormGroup;

  constructor(private router: Router, private db: ConexionSupabaseService, private usuario: UsuarioService, private modalService: NgbModal) { }

  ngOnInit(): void {
    // Esto crea el form group, que contendra todos los elementos del formulario y sus validaciones
    this.form = new FormGroup({
      nombre: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]), // Recibe un validador, hay de distintos tipos
      edad: new FormControl("", [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(18), Validators.max(99)]), // Tambien puede recibir un array de Validators
      telefono: new FormControl("", [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      juegoFavorito: new FormControl('', Validators.required),
      tateti: new FormControl(false),
      memotest: new FormControl(false),
      piedraPapelTijera: new FormControl(false),
      experienciaUsuario: new FormControl('', Validators.required)
    }, this.validarCheckboxes())
  }

  get nombre() {
    return this.form.get('nombre');
  }
  get edad() {
    return this.form.get('edad');
  }
  get telefono() {
    return this.form.get('telefono');
  }
  get juegoFavorito() {
    return this.form.get('juegoFavorito');
  }
  get tateti() {
    return this.form.get('tateti');
  }
  get memotest() {
    return this.form.get('memotest');
  }
  get piedraPapelTijera() {
    return this.form.get('piedraPapelTijera');
  }
  get experienciaUsuario() {
    return this.form.get('experienciaUsuario');
  }

  async enviarForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let encuesta = new Encuesta()
    encuesta.usuario_id = this.usuario.data!.id;
    encuesta.nombre = this.nombre!.value;
    encuesta.edad = this.edad!.value;
    encuesta.telefono = this.telefono!.value;
    encuesta.juego_favorito = this.juegoFavorito!.value;
    encuesta.juegos_agregar = this.generarListaJuegos();
    encuesta.experiencia = this.experienciaUsuario!.value;
    this.form.reset();
    try
    {
      await this.guardarEncuesta(encuesta)
      this.mostrarMsj('Encuesta Registrada. Gracias por tus comentarios!')
    }
    catch(e: any){
      this.mostrarMsj(e.message)
    }
  }

  generarListaJuegos() {
    const seleccionados: string[] = [];

    if (this.tateti!.value)
      seleccionados.push('tateti');

    if (this.memotest!.value)
      seleccionados.push('memotest');

    if (this.piedraPapelTijera!.value)
      seleccionados.push('piedraPapelTijera');

    return seleccionados;
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  async guardarEncuesta(encuesta: Encuesta) {
    const { error } = await this.db.cliente.from('encuestas').insert([{
      usuario_id: encuesta.usuario_id, nombre: encuesta.nombre, edad: encuesta.edad, telefono: encuesta.telefono,
      juego_favorito: encuesta.juego_favorito, juegos_agregar: encuesta.juegos_agregar, experiencia: encuesta.experiencia
    }]);

    if (error)
      throw new Error('Problema accediendo a la base de datos');
  }

  validarCheckboxes(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {

      const tateti = formGroup.get('tateti');
      const memotest = formGroup.get('memotest');
      const piedraPapelTijera = formGroup.get('piedraPapelTijera');
      const respuestaError = { noMarcado: 'Ningun checkbox esta marcado' };

      if (tateti?.value === false && memotest?.value === false && piedraPapelTijera?.value === false) {
        formGroup.get('tateti')?.setErrors(respuestaError);
        formGroup.get('memotest')?.setErrors(respuestaError);
        formGroup.get('piedraPapelTijera')?.setErrors(respuestaError);
        return respuestaError;
      }
      else {
        formGroup.get('tateti')?.setErrors(null);
        formGroup.get('memotest')?.setErrors(null);
        formGroup.get('piedraPapelTijera')?.setErrors(null);
        return null;
      }
    };
  }

  mostrarMsj(mensaje: string) {
    const modalRef = this.modalService.open(ModalMsjErrorComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'custom-modal-style'
    });

    modalRef.componentInstance.titulo = 'Encuesta';
    modalRef.componentInstance.mensaje = mensaje;
  }
}
