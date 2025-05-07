import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  productosPopulares: ProductoDTO[] = [];
  categorias: { id: number; nombre: string }[] = [];
  loading = false;
  error: string | null = null;

  filtro: FiltroProductoDTO = {
    orden: 'novedades'
  };

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductosPopulares();
    this.filtrarProductos();  // Cargar los productos inicialmente
  }

  cargarCategorias(): void {
    this.http.get<{ id: number; nombre: string }[]>(`${this.apiUrl}/categorias`)
      .subscribe({
        next: (categorias) => this.categorias = categorias,
        error: (err) => this.error = 'Error al cargar categorías'
      });
  }

  cargarProductosPopulares(): void {
    this.http.get<ProductoDTO[]>(`${this.apiUrl}/productos/populares`)
      .subscribe({
        next: (productos) => this.productosPopulares = productos,
        error: (err) => this.error = 'Error al cargar productos populares'
      });
  }

  filtrarProductos(): void {
    this.loading = true;
    this.error = null;

    const params: any = { ...this.filtro };

    // Asegúrate de solo enviar los filtros que no son undefined
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    this.http.get<ProductoDTO[]>(`${this.apiUrl}/productos/listar`, { params })
      .subscribe({
        next: (productos) => {
          this.productos = productos;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los productos';
          this.loading = false;
        }
      });
  }

  limpiarFiltros(): void {
    this.filtro = { orden: 'novedades' };
    this.filtrarProductos();  // Refiltrar con los filtros limpios
  }

  verDetalle(id: number): void {
    this.router.navigate([`/producto/${id}`]);
  }
}
