import { CanMatchFn } from '@angular/router';
import { Router } from '@angular/router';

import { inject } from '@angular/core';
import { ConexionSupabaseService } from '../services/conexionSupabase/conexion-supabase.service';

export const authGuard: CanMatchFn = async (route, segments) => {
  const db = inject(ConexionSupabaseService);
  const router = inject(Router);
  
  const { data: { session } } = await db.cliente.auth.getSession();
  
  if (session)
      return true

  return router.navigate(['auth/login']);
};
