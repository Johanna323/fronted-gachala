import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTiposDocumento(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipo-documentos`).pipe(
      map((data: any) => data.data)
    );
  }

  getGeneros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/generos`).pipe(
      map((data: any) => data.data)
    );
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      map((data: any) => data)
    );
  }

  createUser(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, payload);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  updateUser(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, payload);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // Asignar rol a usuario
  assignRole(id: number, roleId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, { role_id: roleId });
  }
}
