import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { ConexionSupabaseService } from '../conexionSupabase/conexion-supabase.service';
import { Usuario } from '../../models/usuario/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private dataUser = new BehaviorSubject<Usuario | null>(null);
  public session = this.dataUser.asObservable();

  constructor(private db: ConexionSupabaseService) {
    this.initAuth();
  }

  private async initAuth() {
    const { data: { session } } = await this.db.cliente.auth.getSession();

    if(session !== null)
      this.dataUser.next(await this.getUsuarioId(session.user.id));
  }

  get data(): Usuario | null {
    return this.dataUser.value;
  }

  async registrar(usuario: Usuario, password: string) {
    const mailRegistrado = await this.emailYaRegistrado(usuario.email)
    if (mailRegistrado) throw new Error('Usuario ya registrado');

    const { data, error } = await this.db.cliente.auth.signUp({ email: usuario.email, password: password });

    if (error)
      switch (error.code) {
        case 'weak_password':
          throw new Error('La contraseña debe tener al menos 6 caracteres.');
        case 'validation_failed':
          throw new Error('El mail no es válido.');
        case 'over_email_send_rate_limit':
          throw new Error('Ha intentado muchas veces.\nIntente de nuevo más tarde');
        default:
          throw new Error('Ha ocurrido un error.\nIntente de nuevo más tarde');
      }

    usuario.id = data.user!.id
    await this.guardarBD(usuario)
  }

  private async guardarBD(usuario: Usuario) {
    const { error } = await this.db.cliente.from('usuarios')
      .insert([{ id: usuario.id, nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email, fecha_nacimiento: usuario.fecha_nacimiento }]);

    if (error)
      throw new Error('Problema accediendo a la base de datos');
  }

  async guardarLog() {
    const { error } = await this.db.cliente.from('log').insert([{ id_usuario: this.data!.id }]);

    if (error)
      throw new Error('Problema accediendo a la base de datos');
  }

  async emailYaRegistrado(email: string) {
    const { data, error } = await this.db.cliente.from('usuarios').select('id').eq('email', email).maybeSingle();

    if (error)
      throw new Error('Problema accediendo a la base de datos');

    else if (data === null)
      return false

    return true
  }

  async getUsuarioId(id: string) {
    const { data, error } = await this.db.cliente.from('usuarios').select('*').eq('id', id).single();

    if (error)
      throw new Error('Problema accediendo a la base de datos');

    else if (data === null)
      throw new Error('Usuario no encontrado');

    return Object.assign(new Usuario(), data);
  }

  async login(email: string, password: string) {
    const { data, error } = await this.db.cliente.auth.signInWithPassword({ email: email, password: password, });

    if (error)
      switch (error.code) {
        case 'validation_failed':
          throw new Error('El mail no es valido.')
        case 'invalid_credentials':
          throw new Error('El mail o la contraseña son incorrectos.')
        case 'email_not_confirmed':
          throw new Error('El mail no fue validado.')
        default:
          throw new Error('Ha ocurrido un error.\nIntente de nuevo más tarde');
      }

    this.dataUser.next(await this.getUsuarioId(data.user.id))

    await this.guardarLog()
  }

  async logout() {
    const { error } = await this.db.cliente.auth.signOut();
    console.log('Se cerro la sesion')

    if (error)
      throw new Error('Error al cerrar sesion');
      
    this.dataUser.next(null)
  }
}