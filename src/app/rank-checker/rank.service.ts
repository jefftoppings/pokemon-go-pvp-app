import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../interfaces';

const API_URL = 'https://pgo-pvp-jtoppings.koyeb.app';

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

    return this.httpClient.get<Pokemon[]>(`${API_URL}/api/search-pokemon`, {
      headers,
      params,
    });
  }
}
