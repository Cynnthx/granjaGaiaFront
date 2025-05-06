export interface InscripcionEvento {
  id?: number;                   // Opcional para nuevas inscripciones
  fechaInscripcion?: Date | string; // Puede ser Date o string ISO (se genera automáticamente)
  clienteId: number;             // ID del cliente
  eventoId: number;              // ID del evento
}

// Versión extendida con métodos útiles
export class InscripcionEventoModel implements InscripcionEvento {
  id?: number;
  fechaInscripcion: Date;
  clienteId: number;
  eventoId: number;

  constructor(data: Partial<InscripcionEvento> = {}) {
    this.id = data.id;
    this.fechaInscripcion = data.fechaInscripcion ? new Date(data.fechaInscripcion) : new Date();
    this.clienteId = data.clienteId || 0;
    this.eventoId = data.eventoId || 0;
  }

  // Formatea la fecha de inscripción
  get fechaInscripcionFormateada(): string {
    return this.fechaInscripcion.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Valida la inscripción
  esValida(): boolean {
    return this.clienteId > 0 && this.eventoId > 0;
  }
}
