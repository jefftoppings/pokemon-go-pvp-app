import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon, PokemonRankInfoForEvolutions, Stats } from '../interfaces';

const SEARCH_TERM_KEY = 'searchTerm';
const IVS_KEY = 'ivs';

@Injectable({
  providedIn: 'root',
})
export class RankService {
  private httpClient = inject(HttpClient);

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

  setSearchTerm(searchTerm: string): void {
    try {
      const serializedValue = JSON.stringify(searchTerm);
      localStorage.setItem(SEARCH_TERM_KEY, serializedValue);
    } catch (error) {
      console.error('Error saving searchTerm to localStorage');
    }
  }

  getSearchTerm(): string {
    try {
      const serializedValue = localStorage.getItem(SEARCH_TERM_KEY);
      if (!serializedValue) return '';
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error reading searchTerm from localStorage');
      return '';
    }
  }

  setIvs(ivs: { attack: number; defense: number; stamina: number }): void {
    try {
      const serializedValue = JSON.stringify(ivs);
      localStorage.setItem(IVS_KEY, serializedValue);
    } catch (error) {
      console.error('Error saving IVS to localStorage');
    }
  }

  getIVS(): { attack: number; defense: number; stamina: number } | undefined {
    try {
      const serializedValue = localStorage.getItem(IVS_KEY);
      if (!serializedValue) return undefined;
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error reading ivs from localStorage');
      return undefined;
    }
  }
}
