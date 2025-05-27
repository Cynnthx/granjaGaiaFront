import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private authService: AuthService
  ) {}

  // Obtiene la lista de todos los usuarios
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.errorHandler.handleError));
  }

  // Actualiza el estado de un usuario (activo o inactivo)
  updateUserStatus(userId: number, active: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${userId}/status`, { active }, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.errorHandler.handleError));
  }

  // Obtiene estadísticas generales del sistema
  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estadisticas`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.errorHandler.handleError));
  }
}
