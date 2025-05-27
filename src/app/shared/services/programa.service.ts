import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Programa {
  id: number;
  nombre: string;
  descripcion?: string;
  estado?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {
  private apiUrl = `${environment.apiUrl}/programas`;

  constructor(private http: HttpClient) {}

  getProgramas(): Observable<Programa[]> {
    return this.http.get<Programa[]>(this.apiUrl);
  }

  getPrograma(id: number): Observable<Programa> {
    return this.http.get<Programa>(`${this.apiUrl}/${id}`);
  }

  createPrograma(programa: Partial<Programa>): Observable<Programa> {
    return this.http.post<Programa>(this.apiUrl, programa);
  }

  updatePrograma(id: number, programa: Partial<Programa>): Observable<Programa> {
    return this.http.put<Programa>(`${this.apiUrl}/${id}`, programa);
  }

  deletePrograma(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
