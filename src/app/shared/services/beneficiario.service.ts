import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Beneficiario {
  id: number;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  tipo_documento_id: number;
  numero_documento: string;
  fecha_nacimiento: string;
  genero_id: number;
  direccion: string;
  telefono: string;
  correo?: string;
  activo: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BeneficiarioService {
  private apiUrl = `${environment.apiUrl}/beneficiaries`;

  constructor(private http: HttpClient) {}

  // Obtener todos los beneficiarios
  getBeneficiarios(): Observable<Beneficiario[]> {
    return this.http.get<Beneficiario[]>(this.apiUrl);
  }

  // Obtener un beneficiario por ID
  getBeneficiario(id: number): Observable<Beneficiario> {
    return this.http.get<Beneficiario>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo beneficiario
  createBeneficiario(beneficiario: Partial<Beneficiario>): Observable<Beneficiario> {
    return this.http.post<Beneficiario>(this.apiUrl, beneficiario);
  }

  // Actualizar un beneficiario existente
  updateBeneficiario(id: number, beneficiario: Partial<Beneficiario>): Observable<Beneficiario> {
    return this.http.put<Beneficiario>(`${this.apiUrl}/${id}`, beneficiario);
  }

  // Eliminar un beneficiario
  deleteBeneficiario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener tipos de documento
  getTiposDocumento(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/tipos-documento`);
  }

  // Obtener géneros
  getGeneros(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/generos`);
  }
}
