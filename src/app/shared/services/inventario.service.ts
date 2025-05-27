import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Inventario {
  id: number;
  nombre: string;
  descripcion?: string;
  cantidad: number;
  unidad_medida: string;
  categoria_id: number;
  precio_unitario: number;
  stock_minimo: number;
  stock_maximo: number;
  ubicacion?: string;
  activo: number;
  created_at?: string;
  updated_at?: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: number;
}

export interface KitInventario {
  id: number;
  nombre_kit: string;
  descripcion: string;
  cantidad_disponible: number;
  fecha_actualizacion: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = `${environment.apiUrl}/kit-inventories`;

  constructor(private http: HttpClient) {}

  // Obtener todos los items del inventario
  getInventario(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl);
  }

  // Obtener un item específico del inventario
  getItem(id: number): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo item en el inventario
  createItem(item: Partial<Inventario>): Observable<Inventario> {
    return this.http.post<Inventario>(this.apiUrl, item);
  }

  // Actualizar un item existente
  updateItem(id: number, item: Partial<Inventario>): Observable<Inventario> {
    return this.http.put<Inventario>(`${this.apiUrl}/${id}`, item);
  }

  // Eliminar un item
  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener todas las categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${environment.apiUrl}/categorias`);
  }

  // Obtener una categoría específica
  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${environment.apiUrl}/categorias/${id}`);
  }

  // Crear una nueva categoría
  createCategoria(categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(`${environment.apiUrl}/categorias`, categoria);
  }

  // Actualizar una categoría existente
  updateCategoria(id: number, categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.put<Categoria>(`${environment.apiUrl}/categorias/${id}`, categoria);
  }

  // Eliminar una categoría
  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/categorias/${id}`);
  }

  // Obtener items por categoría
  getItemsByCategoria(categoriaId: number): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.apiUrl}/categoria/${categoriaId}`);
  }

  // Obtener items con stock bajo
  getItemsStockBajo(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.apiUrl}/stock-bajo`);
  }

  // Obtener todos los kits de inventario
  getKits(): Observable<KitInventario[]> {
    return this.http.get<KitInventario[]>(`${environment.apiUrl}/kit-inventories`);
  }

  // Obtener un kit específico
  getKit(id: number): Observable<KitInventario> {
    return this.http.get<KitInventario>(`${environment.apiUrl}/kit-inventories/${id}`);
  }

  // Crear un nuevo kit
  createKit(kit: Partial<KitInventario>): Observable<KitInventario> {
    return this.http.post<KitInventario>(`${environment.apiUrl}/kit-inventories`, kit);
  }

  // Actualizar un kit existente
  updateKit(id: number, kit: Partial<KitInventario>): Observable<KitInventario> {
    return this.http.put<KitInventario>(`${environment.apiUrl}/kit-inventories/${id}`, kit);
  }

  // Eliminar un kit
  deleteKit(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/kit-inventories/${id}`);
  }
}
