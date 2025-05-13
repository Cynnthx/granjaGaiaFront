import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  token: string;
  rol: string;
  usuarioId:number;
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

  constructor(private http: HttpClient) {}

  login(email: string, contrasena: string): Observable<LoginResponse> {
    const body = { email, contrasena };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
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

  getCurrentUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
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
  }
}
