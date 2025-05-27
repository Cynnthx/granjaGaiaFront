import {Producto} from './producto';

export interface DetallesPedido {
  id?: number;                   // Opcional para nuevos detalles
  cantidad: number;
  precioUnitario: number;
  productoId: number;            // ID del producto (en lugar del objeto completo)
  pedidoId?: number;             // Opcional (se asigna al guardar)

  // Campos opcionales para mostrar información (no vienen del backend)
  nombreProducto?: string;
  imagenProducto?: string;
  subtotal?: number;             // Calculado: cantidad * precioUnitario
}

// Versión extendida con métodos útiles
export class DetallesPedidoModel implements DetallesPedido {
  id?: number;
  cantidad: number;
  precioUnitario: number;
  productoId: number;
  pedidoId?: number;
  nombreProducto?: string;
  imagenProducto?: string;

  constructor(data: Partial<DetallesPedido> = {}) {
    this.id = data.id;
    this.cantidad = data.cantidad || 0;
    this.precioUnitario = data.precioUnitario || 0;
    this.productoId = data.productoId || 0;
    this.pedidoId = data.pedidoId;
    this.nombreProducto = data.nombreProducto;
    this.imagenProducto = data.imagenProducto;
  }

  // Calcula el subtotal automáticamente
  get subtotal(): number {
    return this.cantidad * this.precioUnitario;
  }

  // Valida que el detalle sea correcto
  esValido(): boolean {
    return this.productoId > 0 &&
      this.cantidad > 0 &&
      this.precioUnitario >= 0;
  }

  // Método para actualizar desde un producto
  actualizarDesdeProducto(producto: Producto): void {
    this.nombreProducto = producto.nombre;
    this.imagenProducto = producto.imagenUrl;
    this.precioUnitario = producto.precio; // Actualiza el precio por si cambió
  }
}
