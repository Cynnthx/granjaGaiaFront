// src/app/tienda/tienda.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService, Categoria } from '../services/categoria.service';

// Interfaz para los productos
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

// Interfaz para los filtros
interface FiltroProductoDTO {
  idCategoria?: number;
  precioMin?: number;
  precioMax?: number;
  soloPopulares?: boolean;
  orden?: string;
}

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TiendaComponent implements OnInit {
  productos: ProductoDTO[] = [];
  categorias: Categoria[] = [];
  loading = false;
  error: string | null = null;

  filtro: FiltroProductoDTO = {
    orden: 'novedades'
  };

  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private categoriaService: CategoriaService // Inyectamos el servicio
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.filtrarProductos();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        this.categorias = categorias;
        console.log("Categorías cargadas:", categorias);
      },
      error: (err) => {
        this.error = 'Error al cargar categorías';
        console.error(err);
      }
    });
  }

  filtrarProductos(): void {
    this.loading = true;
    this.error = null;

    const params: any = {
      ...this.filtro,
      idCategoria: this.filtro.idCategoria !== undefined ? +this.filtro.idCategoria : undefined,
      precioMin: this.filtro.precioMin !== undefined ? +this.filtro.precioMin : undefined,
      precioMax: this.filtro.precioMax !== undefined ? +this.filtro.precioMax : undefined,
      soloPopulares: this.filtro.soloPopulares ? true : undefined
    };

    // Elimina parámetros undefined para evitar errores en el backend
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    this.http.get<ProductoDTO[]>(`${this.apiUrl}/productos/listar`, { params })
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

  limpiarFiltros(): void {
    this.filtro = { orden: 'novedades' };
    this.filtrarProductos();
  }

  verDetalle(id: number): void {
    this.router.navigate([`/producto/${id}`]);
  }
}
