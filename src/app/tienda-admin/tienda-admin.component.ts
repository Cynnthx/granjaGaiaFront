// src/app/tienda-admin/tienda-admin.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../services/categoria.service';
import {PedidoDTO, PedidoService} from '../services/pedido.service';  // ✅ Ruta corregida

interface ProductoDTO {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  stock: number;
  esPopular: boolean;
  idCategoria: number;
  nombreCategoria: string;
}

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-tienda-admin',
  templateUrl: './tienda-admin.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TiendaAdminComponent implements OnInit {
  productos: ProductoDTO[] = [];
  categorias: Categoria[] = [];
  pedidos: PedidoDTO[] = [];
  estados = ['pagado', 'enviado', 'completado'];
  loadingPedido = false;
  errorPedido : string | null = null;
  successMessagePedido: string | null = null;

  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Variables para el formulario
  mostrarFormulario = false;
  modoEdicion = false;
  productoActual: Partial<ProductoDTO> = {
    nombre: '',
    descripcion: '',
    precio: 0,
    imagenUrl: '',
    stock: 0,
    esPopular: false,
    idCategoria: 0
  };

  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private categoriaService: CategoriaService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
    this.cargarPedidos();
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        this.categorias = categorias;
        console.log('Categorías:', this.categorias);
      },
      error: (err: any) => {
        console.error('Error al cargar categorías:', err);
        this.error = 'Error al cargar categorías';
      }
    });
  }

  cargarProductos(): void {
    this.loading = true;
    this.http.get<ProductoDTO[]>(`${this.apiUrl}/productos/listar`)
      .subscribe({
        next: (productos) => {
          this.productos = productos;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los productos';
          console.error(err);
          this.loading = false;
        }
      });
  }

  cargarPedidos(): void{
    this.loadingPedido = true;

    this.pedidoService.getAllPedidos().subscribe({
      next: (pedidos: PedidoDTO[]) => {
        this.pedidos = pedidos;
        this.loadingPedido = false;
      },
      error: (err) => {
        this.errorPedido = 'Error al cargar los pedidos';
        console.error(err);
        this.loadingPedido = false;
      }
    });
  }

  nuevoProducto(): void {
    this.modoEdicion = false;
    this.productoActual = {
      nombre: '',
      descripcion: '',
      precio: 0,
      imagenUrl: '',
      stock: 0,
      esPopular: false,
      idCategoria: this.categorias[0]?.id || 0
    };
    this.mostrarFormulario = true;
    this.error = null;
    this.successMessage = null;
  }

  editarProducto(producto: ProductoDTO): void {
    this.modoEdicion = true;
    this.productoActual = { ...producto };
    this.mostrarFormulario = true;
    this.error = null;
    this.successMessage = null;
  }

  guardarProducto(): void {
    if (!this.validarProducto()) {
      return;
    }

    this.loading = true;
    const producto = { ...this.productoActual };

    if (this.modoEdicion) {
      // Edición
      this.http.put(`${this.apiUrl}/productos/${producto.id}`, producto)
        .subscribe({
          next: () => {
            this.successMessage = 'Producto actualizado correctamente';
            this.cargarProductos();
            this.cancelarEdicion();
          },
          error: (err) => {
            this.error = 'Error al actualizar el producto';
            console.error(err);
            this.loading = false;
          }
        });
    } else {
      // Creación
      this.http.post(`${this.apiUrl}/productos/crear`, producto)
        .subscribe({
          next: () => {
            this.successMessage = 'Producto creado correctamente';
            this.cargarProductos();
            this.cancelarEdicion();
          },
          error: (err) => {
            this.error = 'Error al crear el producto';
            console.error(err);
            this.loading = false;
          }
        });
    }
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.loading = true;
      this.http.delete(`${this.apiUrl}/productos/${id}`)
        .subscribe({
          next: () => {
            this.successMessage = 'Producto eliminado correctamente';
            this.cargarProductos();
          },
          error: (err) => {
            this.error = 'Error al eliminar el producto';
            console.error(err);
            this.loading = false;
          }
        });
    }
  }

  cancelarEdicion(): void {
    this.mostrarFormulario = false;
    this.productoActual = {
      nombre: '',
      descripcion: '',
      precio: 0,
      imagenUrl: '',
      stock: 0,
      esPopular: false,
      idCategoria: 0
    };
    this.loading = false;
  }

  validarProducto(): boolean {
    if (!this.productoActual.nombre || !this.productoActual.descripcion ||
      !this.productoActual.precio || !this.productoActual.imagenUrl ||
      !this.productoActual.idCategoria) {
      this.error = 'Todos los campos son obligatorios';
      return false;
    }

    if (this.productoActual.precio <= 0) {
      this.error = 'El precio debe ser mayor que cero';
      return false;
    }

    if (this.productoActual.stock !== undefined && this.productoActual.stock < 0) {
      this.error = 'El stock no puede ser negativo';
      return false;
    }

    this.error = null;
    return true;
  }

  cambiarEstadoPedido(pedido: PedidoDTO) {
    this.loadingPedido = true;
    this.errorPedido = null;
    this.successMessagePedido = null;

    this.pedidoService.actualizarEstadoPedido(pedido.id!, pedido.estado).subscribe({
      next: () => {
        this.successMessagePedido = 'Estado del pedido actualizado correctamente';
        this.cargarPedidos();
      },
      error: (err) => {
        this.errorPedido = 'Error al actualizar el estado del pedido';
        console.error(err);
        this.loadingPedido = false;
      }
    });
  }
}
