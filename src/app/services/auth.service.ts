import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ErrorHandlerService } from './error-handler.service';
import { ActualizarHeaderService } from './actualizar-header.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private actualizarHeader: ActualizarHeaderService
  ) {}

  login(email: string, contrasena: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, contrasena })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.usuario));
          this.actualizarHeader.triggerRefreshHeader();

          console.log('Token recibido:', response.token);
        }),
        catchError(this.errorHandler.handleError)
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro/cliente`, userData)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Has salido de tu cuenta correctamente',
      icon: 'success',
      confirmButtonText: 'OK',
      background: '#F9F4E3',
      color: '#7A6448'
    });
    this.actualizarHeader.triggerRefreshHeader();
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }
}
