import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Sector {
  id: number;
  nombre: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SectoresService {
  private apiUrl = `${environment.apiUrl}/sectores`;

  constructor(private http: HttpClient) {}

  getSectores(): Observable<Sector[]> {
    return this.http.get<Sector[]>(this.apiUrl);
  }

  getSector(id: number): Observable<Sector> {
    return this.http.get<Sector>(`${this.apiUrl}/${id}`);
  }

  createSector(sector: Partial<Sector>): Observable<Sector> {
    return this.http.post<Sector>(this.apiUrl, sector);
  }

  updateSector(id: number, sector: Partial<Sector>): Observable<Sector> {
    return this.http.put<Sector>(`${this.apiUrl}/${id}`, sector);
  }

  deleteSector(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
