import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { CardDto, PagedResponse } from '../interfaces/cardDTO';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.API_URL}/cards`;

  getCards(
    page: number = 1,
    limit: number = 10
  ): Observable<PagedResponse<CardDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PagedResponse<CardDto>>(this.baseUrl, { params });
  }

  createCard(data: { title: string; descriptions: string[] }): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  updateCard(
    id: string,
    data: { title: string; descriptions: string[] }
  ): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteCard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
