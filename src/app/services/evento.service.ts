import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import {Evento} from '../models/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = 'http://localhost:8080/api/eventos';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken'); // Asegúrate que coincide con donde guardas el token
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Métodos existentes (asegurar que todos incluyan los headers)
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/all`);
  }

  getEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`);
  }

  crearEvento(evento: Partial<Evento>): Observable<Evento> {
    return this.http.post<Evento>(
      `${this.apiUrl}/crear`,
      evento,
      { headers: this.getAuthHeaders() }
    );
  }

  editarEvento(id: number, evento: Partial<Evento>): Observable<Evento> {
    return this.http.put<Evento>(
      `${this.apiUrl}/editar/${id}`,
      evento,
      { headers: this.getAuthHeaders() }
    );
  }

  eliminarEvento(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
