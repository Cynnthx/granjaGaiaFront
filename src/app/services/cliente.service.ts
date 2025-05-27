import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
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


// Editar perfil
  editarPerfil(cliente: any) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.put(`${this.apiUrl}/${cliente.id}`, cliente, { headers });
  }



}
