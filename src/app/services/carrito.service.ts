import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, pipe} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {ErrorHandlerService} from './error-handler.service';

export interface DetallesPedidoDTO {
  id: number | null;
  idProducto: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  imagen?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private apiUrl = 'http://localhost:8080/api/carrito';

  constructor(private http: HttpClient,
              private authService: AuthService,
              private errorHandler: ErrorHandlerService
  ) {}

  // Obtener todos los detalles del pedido
  obtenerDetalles(): Observable<DetallesPedidoDTO[]> {
    return this.http.get<DetallesPedidoDTO[]>(`${this.apiUrl}/detalle`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.errorHandler.handleError));
  }

  // Agregar un nuevo detalle al carrito
  agregarDetalle(detalle: DetallesPedidoDTO): Observable<DetallesPedidoDTO> {
    return this.http.post<DetallesPedidoDTO>(`${this.apiUrl}/pedido/${detalle.id}/producto/${detalle.idProducto}?cantidad=${detalle.cantidad}`, {}, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.errorHandler.handleError));
  }

// Actualizar un detalle del carrito
  actualizarDetalle(detalle: DetallesPedidoDTO): Observable<DetallesPedidoDTO> {
    return this.http.put<DetallesPedidoDTO>(`${this.apiUrl}/actualizar/${detalle.id}`, detalle, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.errorHandler.handleError));
  }

// Eliminar un detalle del carrito
  eliminarDetalle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/detalle/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.errorHandler.handleError));
  }


}
