export interface TokenAcceso {
  id?: number;                   // Opcional porque se asigna en el backend
  token: string;                 // Cadena del token JWT
  fechaCreacion: Date;           // Fecha de creación del token
  fechaExpiracion: Date;         // Fecha de expiración del token
  usuarioId: number;             // Solo guardamos el ID del usuario para evitar referencias circulares
}

// Opcional: Si necesitas una clase con métodos útiles
export class TokenAccesoModel implements TokenAcceso {
  id?: number;
  token: string;
  fechaCreacion: Date;
  fechaExpiracion: Date;
  usuarioId: number;

  constructor(data: Partial<TokenAcceso> = {}) {
    this.id = data.id;
    this.token = data.token || '';
    this.fechaCreacion = data.fechaCreacion || new Date();
    this.fechaExpiracion = data.fechaExpiracion || new Date();
    this.usuarioId = data.usuarioId || 0;
  }

  // Metodo para verificar si el token está expirado
  estaExpirado(): boolean {
    return new Date() > this.fechaExpiracion;
  }

  // Metodo para verificar si el token es válido
  esValido(): boolean {
    return !!this.token && !this.estaExpirado();
  }

  // Metodo toString similar al de Java
  toString(): string {
    return `TokenAcceso {
      id: ${this.id},
      token: '${this.token.substring(0, 10)}...', // Muestra solo los primeros 10 caracteres
      fechaCreacion: ${this.fechaCreacion},
      fechaExpiracion: ${this.fechaExpiracion},
      usuarioId: ${this.usuarioId}
    }`;
  }
}
