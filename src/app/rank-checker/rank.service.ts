import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon, PokemonRankInfoForEvolutions, Stats } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class RankService {
  constructor(private httpClient: HttpClient) {}

  searchPokemon(searchTerm: string): Observable<Pokemon[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const params = new HttpParams().set('name', searchTerm).set('pageSize', 5);

    return this.httpClient.get<Pokemon[]>(`/api/search-pokemon`, {
      headers,
      params,
    });
  }

  getRankInfoForEvolutions(
    id: string,
    ivs: Stats
  ): Observable<PokemonRankInfoForEvolutions> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const params = new HttpParams()
      .set('id', id)
      .set('attack', ivs.atk)
      .set('defense', ivs.def)
      .set('stamina', ivs.hp);

    return this.httpClient.get<PokemonRankInfoForEvolutions>(
      `/api/get-ranks-for-iv-evolutions`,
      {
        headers,
        params,
      }
    );
  }
}
