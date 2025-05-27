export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  stock: number;
  esPopular: boolean;
  idCategoria: number;
  nombreCategoria: string;
  especificaciones?: Record<string, any>;
  fechaCreacion?: Date;
}

export class ProductoModel implements Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  stock: number;
  esPopular: boolean;
  idCategoria: number;
  nombreCategoria: string;
  especificaciones: Record<string, any>;
  fechaCreacion: Date;

  constructor(data: Partial<Producto> = {}) {
    this.id = data.id || 0;
    this.nombre = data.nombre || '';
    this.descripcion = data.descripcion || '';
    this.precio = data.precio || 0;
    this.imagenUrl = data.imagenUrl || '/assets/default-product.jpg';
    this.stock = data.stock || 0;
    this.esPopular = data.esPopular || false;
    this.idCategoria = data.idCategoria || 0;
    this.nombreCategoria = data.nombreCategoria || '';
    this.especificaciones = this.parseEspecificaciones(data.especificaciones);
    this.fechaCreacion = data.fechaCreacion ? new Date(data.fechaCreacion) : new Date();
  }

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


  get precioFormateado(): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(this.precio);
  }

  get disponible(): boolean {
    return this.stock > 0;
  }

  get esNuevo(): boolean {
    const fechaCreacion = this.fechaCreacion ? new Date(this.fechaCreacion) : new Date();
    const diferenciaDias = (new Date().getTime() - fechaCreacion.getTime()) / (1000 * 3600 * 24);
    return diferenciaDias < 30; // Considerar nuevo si tiene menos de 30 días
  }
}
