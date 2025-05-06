export interface Producto {
  id?: number;                   // Opcional para nuevos productos
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  especificaciones?: Record<string, any>; // Objeto JSON dinámico
  stock: number;
  fechaCreacion?: Date;           // Opcional (se puede generar en frontend)
  esPopular?: boolean;            // Opcional (valor por defecto false)
  categoriaId: number;            // ID de la categoría (en lugar del objeto completo)
}

// Versión extendida con métodos útiles
export class ProductoModel implements Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  especificaciones: Record<string, any>;
  stock: number;
  fechaCreacion: Date;
  esPopular: boolean;
  categoriaId: number;

  constructor(data: Partial<Producto> = {}) {
    this.id = data.id;
    this.nombre = data.nombre || '';
    this.descripcion = data.descripcion || '';
    this.precio = data.precio || 0;
    this.imagenUrl = data.imagenUrl || '';
    this.especificaciones = this.parseEspecificaciones(data.especificaciones);
    this.stock = data.stock || 0;
    this.fechaCreacion = data.fechaCreacion || new Date();
    this.esPopular = data.esPopular || false;
    this.categoriaId = data.categoriaId || 0;
  }

  // Convierte especificaciones a objeto
  private parseEspecificaciones(especs?: string | Record<string, any>): Record<string, any> {
    if (!especs) return {};
    if (typeof especs === 'string') {
      try {
        return JSON.parse(especs);
      } catch {
        return {};
      }
    }
    return especs;
  }

  // Validación básica del producto
  esValido(): boolean {
    return this.nombre.length > 0 &&
      this.descripcion.length > 0 &&
      this.precio > 0 &&
      this.imagenUrl.length > 0 &&
      this.stock >= 0 &&
      this.categoriaId > 0;
  }

  // Formatea el precio (ej: $1,000.00)
  get precioFormateado(): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(this.precio);
  }

  // Verifica si está disponible (stock > 0)
  get disponible(): boolean {
    return this.stock > 0;
  }
}
