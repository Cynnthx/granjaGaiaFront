import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = this.getServerErrorMessage(error);
    }

    console.error(errorMessage);
    this.showUserFriendlyError(error);
    return throwError(() => new Error(errorMessage));
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return 'Solicitud incorrecta: ' + (error.error.message || error.message);
      case 401:
        return 'No autorizado. Por favor inicie sesión nuevamente.';
      case 403:
        return 'Acceso denegado. No tiene permisos para esta acción.';
      case 404:
        return 'Recurso no encontrado: ' + error.url;
      case 500:
        return 'Error interno del servidor. Por favor intente más tarde.';
      default:
        return `Error ${error.status}: ${error.message}`;
    }
  }

  private showUserFriendlyError(error: HttpErrorResponse): void {
    Swal.fire({
      title: 'Error',
      text: this.getServerErrorMessage(error),
      icon: 'error',
      confirmButtonText: 'Entendido',
      background: '#F9F4E3',
      color: '#7A6448'
    });
  }
}
