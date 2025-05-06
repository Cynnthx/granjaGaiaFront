// src/models/Pedido.ts

export interface Pedido {
  id?: number;                   // Opcional para nuevos pedidos
  fecha: Date | string;          // Puede ser Date o string ISO (ej: "2023-12-25T10:00:00")
  total: number;
  estado: string;                // Ej: "PENDIENTE", "ENVIADO", "ENTREGADO", "CANCELADO"
  clienteId: number;             // ID del cliente (en lugar del objeto completo)
  detalles?: DetallePedido[];    // Opcional: array de productos del pedido
}

// Opcional: Si necesitas una clase con métodos útiles
export class PedidoModel implements Pedido {
  id?: number;
  fecha: Date;
  total: number;
  estado: string;
  clienteId: number;
  detalles: DetallePedido[];

  constructor(data: Partial<Pedido> = {}) {
    this.id = data.id;
    this.fecha = data.fecha ? new Date(data.fecha) : new Date();
    this.total = data.total || 0;
    this.estado = data.estado || 'PENDIENTE';
    this.clienteId = data.clienteId || 0;
    this.detalles = data.detalles || [];
  }

  // Formatea la fecha como string local
  get fechaFormateada(): string {
    return this.fecha.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Calcula el total si no está definido
  calcularTotal(): number {
    if (this.total > 0) return this.total;
    return this.detalles.reduce((sum, detalle) => sum + (detalle.precio * detalle.cantidad), 0);
  }

  // Valida el pedido básico
  esValido(): boolean {
    return this.clienteId > 0 &&
      this.detalles.length > 0 &&
      ['PENDIENTE', 'ENVIADO', 'ENTREGADO', 'CANCELADO'].includes(this.estado);
  }
}

// Modelo para los detalles del pedido (productos)
export interface DetallePedido {
  id?: number;
  productoId: number;
  cantidad: number;
  precio: number;
  nombreProducto?: string;       // Opcional: para mostrar en listados
  imagenProducto?: string;       // Opcional: para mostrar en listados
}
