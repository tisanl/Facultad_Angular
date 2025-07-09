import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Baraja } from '../../games/mayor-menor/mayor-menor.component';
import { ApiResponseRickMorty, Personaje } from '../../games/preguntados/preguntados.component';

import { EMPTY } from 'rxjs';
import { expand, map, scan } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolicitudHttpService {

  constructor(private http: HttpClient) { }

  getDeckCartas(deck_id: string, count: number) {
    return this.http.get<Baraja>(`https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/`, {
      params:{count:count}
    });
  }

  getRickMortyPersonajes() {
    return this.getRickMortyFirstCall().pipe(
      expand(resp =>
        resp.info.next
          ? this.getRickMortyextPage(resp.info.next)
          : EMPTY
      ),
      // de cada respuesta toma solo resp.data[]
      map(resp => resp.results),
      // concatena cada trozo de data en un array único
      scan((all, pageData) => [...all, ...pageData], [] as Personaje[])
    );
  }

  getRickMortyFirstCall() {

    return this.http.get<ApiResponseRickMorty>('https://rickandmortyapi.com/api/character');
  }

  getRickMortyextPage(nextPageUrl: string){
    return this.http.get<ApiResponseRickMorty>(nextPageUrl);
  }
}
