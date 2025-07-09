import { TestBed } from '@angular/core/testing';

import { ConexionSupabaseService } from './conexion-supabase.service';

describe('ConexionSupabaseService', () => {
  let service: ConexionSupabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConexionSupabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
