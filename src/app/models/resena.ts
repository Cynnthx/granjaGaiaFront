export interface Resena {
  id?: number;                // Opcional para nuevas reseñas
  resena: string;             // Texto de la reseña
  valoracion: number;         // Valoración (ej: 1-5 estrellas)
  fecha?: Date;               // Fecha automática (opcional en frontend)
  clienteId: number;          // ID del cliente que hizo la reseña
  eventoId: number;           // ID del evento reseñado
}

// Versión extendida con métodos útiles
export class ResenaModel implements Resena {
  id?: number;
  resena: string;
  valoracion: number;
  fecha: Date;
  clienteId: number;
  eventoId: number;

  constructor(data: Partial<Resena> = {}) {
    this.id = data.id;
    this.resena = data.resena || '';
    this.valoracion = data.valoracion || 0;
    this.fecha = data.fecha || new Date(); // Fecha actual por defecto
    this.clienteId = data.clienteId || 0;
    this.eventoId = data.eventoId || 0;
  }

  // Validación básica
  esValida(): boolean {
    return this.resena.length > 0 &&
      this.valoracion >= 1 &&
      this.valoracion <= 5 &&
      this.clienteId > 0 &&
      this.eventoId > 0;
  }

  // Para mostrar estrellas (opcional)
  get estrellas(): string {
    return '★'.repeat(this.valoracion) + '☆'.repeat(5 - this.valoracion);
  }
}
