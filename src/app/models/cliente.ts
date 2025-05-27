export interface Cliente {
  id?: number;                   // Opcional para nuevos clientes
  nombre: string;
  apellidos: string;
  dni: string;
  fotoPerfil: string;            // URL de la imagen
  direccion: string;
  telefono: string;
  usuarioId: number;             // ID del usuario asociado (en lugar del objeto completo)
}

// Versión extendida con métodos útiles
export class ClienteModel implements Cliente {
  id?: number;
  nombre: string;
  apellidos: string;
  dni: string;
  fotoPerfil: string;
  direccion: string;
  telefono: string;
  usuarioId: number;

  constructor(data: Partial<Cliente> = {}) {
    this.id = data.id;
    this.nombre = data.nombre || '';
    this.apellidos = data.apellidos || '';
    this.dni = data.dni || '';
    this.fotoPerfil = data.fotoPerfil || '/img/perfil-default.jpg';
    this.direccion = data.direccion || '';
    this.telefono = data.telefono || '';
    this.usuarioId = data.usuarioId || 0;
  }

  // Nombre completo (nombre + apellidos)
  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellidos}`.trim();
  }

  // Validación básica
  esValido(): boolean {
    return this.nombre.length > 0 &&
      this.apellidos.length > 0 &&
      this.dni.length > 0 &&
      this.direccion.length > 0 &&
      this.telefono.length > 0 &&
      this.usuarioId > 0;
  }

  // Formatea el teléfono (ej: +34 123 456 789)
  get telefonoFormateado(): string {
    const num = this.telefono.replace(/\D/g, '');
    return `+${num.substring(0, 2)} ${num.substring(2, 5)} ${num.substring(5, 8)} ${num.substring(8)}`;
  }
}
