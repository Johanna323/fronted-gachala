import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Entrega {
  id: number;
  beneficiary_id: number;
  kit_id: number;
  fecha_entrega: string;
  funcionario_entrega: number;
  observaciones: string;
  estado: string;
  sector_id: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EntregasService {
  private apiUrl = `${environment.apiUrl}/deliveries`;

  constructor(private http: HttpClient) {}

  getEntregas(): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(this.apiUrl);
  }

  getEntrega(id: number): Observable<Entrega> {
    return this.http.get<Entrega>(`${this.apiUrl}/${id}`);
  }

  createEntrega(entrega: Partial<Entrega>): Observable<Entrega> {
    return this.http.post<Entrega>(this.apiUrl, entrega);
  }

  updateEntrega(id: number, entrega: Partial<Entrega>): Observable<Entrega> {
    return this.http.put<Entrega>(`${this.apiUrl}/${id}`, entrega);
  }

  deleteEntrega(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEntregasByUser(userId: number): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(`${this.apiUrl}/by-user/${userId}`);
  }
}
