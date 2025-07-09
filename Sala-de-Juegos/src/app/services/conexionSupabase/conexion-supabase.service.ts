import { Injectable } from '@angular/core';

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { environment } from '../../../environments/environment';
import { Score } from '../../components/scores/scores.component';

@Injectable({
  providedIn: 'root'
})
export class ConexionSupabaseService {
  private supabaseClient: SupabaseClient | null = null;

  constructor() {
    this.supabaseClient = createClient(environment.apiUrl, environment.publicAnonKey);
  }

  get cliente(): SupabaseClient {
    if (!this.supabaseClient) {
      throw new Error('SupabaseClient no fue inicializado correctamente');
    }
    return this.supabaseClient;
  }

  async guardarScore(score: Score) 
  {
    const { error } = await this.cliente.from('scores').insert([
      { usuario_id: score.usuario_id, usuario_nombre: score.usuario_nombre, game: score.game, points: score.points}]);

    if (error)
      throw new Error('Problema accediendo a la base de datos');
  }

}
