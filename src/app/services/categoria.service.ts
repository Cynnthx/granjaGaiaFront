import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para definir la estructura de Categoria
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root' // Esto asegura que el servicio esté disponible a nivel global
})
export class CategoriaService {
  private apiUrl = 'http://localhost:8080/api/categorias'; // URL del backend

  // Constructor con HttpClient para hacer las peticiones HTTP
  constructor(private http: HttpClient) {}

  // Metodo para obtener todas las categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  // Metodo para crear una nueva categoría
  crearCategoria(categoria: Omit<Categoria, 'id'>): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  // Metodo para eliminar una categoría por su id
  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Metodo para editar una categoría por su id
  editarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }
}
