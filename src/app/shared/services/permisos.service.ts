import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Permiso {
  id: number;
  nombre: string;
  descripcion: string;
  ruta?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private apiUrl = `${environment.apiUrl}/permissions`;

  constructor(private http: HttpClient) {}

  getPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.apiUrl);
  }

  getPermiso(id: number): Observable<Permiso> {
    return this.http.get<Permiso>(`${this.apiUrl}/${id}`);
  }

  createPermiso(permiso: Partial<Permiso>): Observable<Permiso> {
    return this.http.post<Permiso>(this.apiUrl, permiso);
  }

  updatePermiso(id: number, permiso: Partial<Permiso>): Observable<Permiso> {
    return this.http.put<Permiso>(`${this.apiUrl}/${id}`, permiso);
  }

  deletePermiso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
