// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { ErrorHandlerService } from './error-handler.service';
// import { AuthService } from './auth.service';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class ProductoService {
//   private apiUrl = 'http://localhost:8080/api/productos';
//
//   constructor(
//     private http: HttpClient,
//     private errorHandler: ErrorHandlerService,
//     private authService: AuthService
//   ) {}
//
//   // Obtiene la lista de todos los productos
//   getProductos(): Observable<any[]> {
//     return this.http.get<any[]>(this.apiUrl)
//       .pipe(catchError(this.errorHandler.handleError));
//   }
//
//   // Obtiene la lista de productos populares
//   getProductosPopulares(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/populares`)
//       .pipe(catchError(this.errorHandler.handleError));
//   }
//
//   // Obtiene un producto específico por su ID
//   getProductoById(id: number): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/${id}`)
//       .pipe(catchError(this.errorHandler.handleError));
//   }
//
//   // Crea un nuevo producto(admin)
//   crearProducto(producto: any): Observable<any> {
//     return this.http.post(this.apiUrl, producto, {
//       headers: this.authService.getAuthHeaders()
//     }).pipe(catchError(this.errorHandler.handleError));
//   }
//
//   // Actualiza un producto existente por su ID
//   actualizarProducto(id: number, producto: any): Observable<any> {
//     return this.http.put(`${this.apiUrl}/${id}`, producto, {
//       headers: this.authService.getAuthHeaders()
//     }).pipe(catchError(this.errorHandler.handleError));
//   }
//
//   // Elimina un producto por su ID
//   eliminarProducto(id: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${id}`, {
//       headers: this.authService.getAuthHeaders()
//     }).pipe(catchError(this.errorHandler.handleError));
//   }
// }
