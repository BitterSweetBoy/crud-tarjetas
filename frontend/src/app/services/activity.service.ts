import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CardLog } from '../interfaces/activityDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.API_URL}/activity`;

  getRecentActivity(
    page: number = 1,
    limit: number = 10
  ): Observable<CardLog> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<CardLog>(`${this.baseUrl}/recent`, { params });
  }


  getActivityByEntity(
    entityType: string,
    entityId: string,
  ): Observable<CardLog> {
    return this.http.get<CardLog>(`${this.baseUrl}/${entityType}/${entityId}`,
    );
  }

}
