import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActualizarHeaderService {
  private actualizacionHeader = new Subject<void>();

  // Observable que los componentes pueden escuchar
  headerActualizado$ = this.actualizacionHeader.asObservable();

  // Metodo para notificar que se debe actualizar el header
  triggerRefreshHeader(): void {
    this.actualizacionHeader.next();
  }
}
