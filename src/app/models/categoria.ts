export interface Categoria {
  id?: number;          // Opcional para nuevas categorías
  nombre: string;
  descripcion: string;
}

// Versión extendida con métodos útiles
export class CategoriaModel implements Categoria {
  id?: number;
  nombre: string;
  descripcion: string;

  constructor(data: Partial<Categoria> = {}) {
    this.id = data.id;
    this.nombre = data.nombre || '';
    this.descripcion = data.descripcion || '';
  }

  // Validación básica
  esValida(): boolean {
    return this.nombre.length > 0 && this.descripcion.length > 0;
  }

  // Para mostrar en selects/dropdowns
  get label(): string {
    return this.nombre;
  }
}
