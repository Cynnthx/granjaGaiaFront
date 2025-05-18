import { Component, OnInit } from '@angular/core';
import { CarritoService, DetallesPedidoDTO } from '../services/carrito.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-detalles-pedido-carrito',
  templateUrl: './detalles-pedido-carrito.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class DetallesPedidoCarritoComponent implements OnInit {
  detallesPedido: DetallesPedidoDTO[] = [];
  totalCarrito: number = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.cargarDetallesPedido();
  }

  cargarDetallesPedido(): void {
    this.carritoService.obtenerDetalles().subscribe({
      next: (detalles) => {
        this.detallesPedido = detalles;
        this.calcularTotal();
      },
      error: (err) => console.error('Error al cargar detalles del pedido', err)
    });
  }

  calcularTotal(): void {
    this.totalCarrito = this.detallesPedido.reduce((acc, item) => acc + item.total, 0);
  }

  eliminarDetalle(id: number): void {
    this.carritoService.eliminarDetalle(id).subscribe({
      next: () => {
        this.detallesPedido = this.detallesPedido.filter(item => item.id !== id);
        this.calcularTotal();
      },
      error: (err) => console.error('Error al eliminar detalle', err)
    });
  }

  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito().subscribe({
      next: () => {
        this.detallesPedido = [];
        this.totalCarrito = 0;
      },
      error: (err) => console.error('Error al vaciar carrito', err)
    });
  }
}
