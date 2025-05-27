export interface Evento {
  id?: number;          // Opcional para nuevos eventos
  nombre: string;
  descripcion: string;
  fecha: Date | string; // Acepta Date o string (como "2023-12-25")
  capacidad: number;
  precio: number;
  imagen?: string;
}

