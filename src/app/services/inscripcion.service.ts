// inscripcion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private apiUrl = 'http://localhost:8080/api/inscripciones-eventos';

  constructor(private http: HttpClient) {}

  inscribirClienteEnEvento(clienteId: number, eventoId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/cliente/${clienteId}/evento/${eventoId}`,
      {}
    );
  }
}
