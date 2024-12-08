import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { Pokemon, PokemonRankInfoForEvolutions, Stats } from '../interfaces';

const SEARCH_TERM_KEY = 'searchTerm';
const IVS_KEY = 'ivs';
const RANK_INFOS_KEY = 'rankInfos';

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

    return this.httpClient
      .get<PokemonRankInfoForEvolutions>(`/api/get-ranks-for-iv-evolutions`, {
        headers,
        params,
      })
      .pipe(
        tap((rankInfo) => this.setRankInfoForEvolutionsCache(rankInfo)),
        catchError((err) => {
          localStorage.setItem(RANK_INFOS_KEY, '');
          throw err;
        })
      );
  }

  setRankInfoForEvolutionsCache(rankInfo: PokemonRankInfoForEvolutions): void {
    try {
      const serializedValue = JSON.stringify(rankInfo);
      localStorage.setItem(RANK_INFOS_KEY, serializedValue);
    } catch (error) {
      console.error('Error saving rankInfos to localStorage');
    }
  }

  getRankInfoForEvolutionsCache(): PokemonRankInfoForEvolutions | undefined {
    try {
      const serializedValue = localStorage.getItem(RANK_INFOS_KEY);
      if (!serializedValue) return undefined;
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error reading rankInfos from localStorage');
      return undefined;
    }
  }

  setSearchTermCache(searchTerm: string): void {
    try {
      const serializedValue = JSON.stringify(searchTerm);
      localStorage.setItem(SEARCH_TERM_KEY, serializedValue);
    } catch (error) {
      console.error('Error saving searchTerm to localStorage');
    }
  }

  getSearchTermCache(): string {
    try {
      const serializedValue = localStorage.getItem(SEARCH_TERM_KEY);
      if (!serializedValue) return '';
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error reading searchTerm from localStorage');
      return '';
    }
  }

  setIvsCache(ivs: { attack: number; defense: number; stamina: number }): void {
    // if one value is not set, then we should clear our results cache
    if (Object.values(ivs).some((v) => v === null || v === undefined))
      localStorage.setItem(RANK_INFOS_KEY, '');

    try {
      const serializedValue = JSON.stringify(ivs);
      localStorage.setItem(IVS_KEY, serializedValue);
    } catch (error) {
      console.error('Error saving IVS to localStorage');
    }
  }

  getIvsCache():
    | { attack: number; defense: number; stamina: number }
    | undefined {
    try {
      const serializedValue = localStorage.getItem(IVS_KEY);
      if (!serializedValue) return undefined;
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error reading ivs from localStorage');
      return undefined;
    }
  }

  clearRankServiceCache(): void {
    try {
      localStorage.setItem(RANK_INFOS_KEY, '');
      localStorage.setItem(SEARCH_TERM_KEY, '');
      localStorage.setItem(IVS_KEY, '');
    } catch (error) {
      console.error('Error clearing values from localStorage');
    }
  }
}
