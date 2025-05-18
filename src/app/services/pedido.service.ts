import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { AuthService } from './auth.service';

// Interfaz para definir la estructura de Pedido
export interface PedidoDTO {
  id: number | null;
  fecha: string;
  estado: string;
  total: number;
  usuarioId: number;
  nombreUsuario: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/api/pedidos';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private authService: AuthService
  ) {}

  // Crea un nuevo pedido
  crearPedido(clienteId: number): Observable<PedidoDTO> {
    return this.http.post<PedidoDTO>(`${this.apiUrl}/cliente/${clienteId}`, {}, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.errorHandler.handleError));
  }

  // Obtiene la lista de pedidos realizados por el usuario
  getMisPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.errorHandler.handleError));
  }

  // Obtiene los detalles de un pedido específico por su ID
  getDetallesPedido(pedidoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${pedidoId}/detalles`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.errorHandler.handleError));
  }
}
