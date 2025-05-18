import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import {Router} from '@angular/router';
import {ErrorHandlerService} from './error-handler.service';
import {ActualizarHeaderService} from './actualizar-header.service';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';

interface LoginResponse {
  token: string;
  rol: string;
  usuarioId:number;
  clienteId:number | null;
}


interface CustomJwtPayload {
  userId: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private readonly userKey = 'auth_user';

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private actualizarHeader: ActualizarHeaderService
  ) {}

  login(email: string, contrasena: string): Observable<LoginResponse> {
    const body = { email, contrasena };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro/cliente`, userData)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        return decodedToken.rol;
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
    return null;
  }

  getCurrentUserId(): number | null {
    return localStorage.getItem('usuarioId') ? parseInt(localStorage.getItem('usuarioId')!, 10) : null;
  }

  getCurrentClienteId(): number | null {
    return localStorage.getItem('clienteId') ? parseInt(localStorage.getItem('clienteId')!, 10) : null;
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }


  getToken(): string | null {
    return localStorage.getItem('token');
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

}
