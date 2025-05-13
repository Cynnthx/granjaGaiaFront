import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) {}

  // Obtener perfil del cliente
  getMiPerfil(): Observable<any> {

    const clienteId = localStorage.getItem('usuarioId');


    return this.http.get<any>(`${this.apiUrl}/usuario/${clienteId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.errorHandler.handleError));
  }

  // Actualizar perfil
  actualizarPerfil(cliente: any): Observable<any> {
    const clienteId = this.authService.getCurrentUser()?.id;
    return this.http.put(`${this.apiUrl}/${clienteId}`, cliente, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.errorHandler.handleError));
  }

  // Subir foto de perfil
  subirFotoPerfil(imagen: File): Observable<any> {
    const clienteId = this.authService.getCurrentUser()?.id;
    const formData = new FormData();
    formData.append('imagen', imagen);

    return this.http.post(`${this.apiUrl}/${clienteId}/foto-perfil`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    }).pipe(catchError(this.errorHandler.handleError));
  }
}
