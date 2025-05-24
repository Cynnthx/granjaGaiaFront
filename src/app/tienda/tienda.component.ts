import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService, Categoria } from '../services/categoria.service';
import { CarritoService, DetallesPedidoDTO } from '../services/carrito.service';

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
  idCategoria?: string;
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
  filtro: FiltroProductoDTO = {
    orden: 'novedades', idCategoria: '-1'
  };
  loading = false;
  error: string | null = null;

  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private categoriaService: CategoriaService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.filtrarProductos();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        this.categorias = categorias;
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
    console.log('Filtro actual:', this.filtro);
    const params: any = {
      ...this.filtro,
      idCategoria: this.filtro.idCategoria !== undefined && this.filtro.idCategoria !== "-1" ? +this.filtro.idCategoria : undefined,
      precioMin: this.filtro.precioMin !== undefined ? +this.filtro.precioMin : undefined,
      precioMax: this.filtro.precioMax !== undefined ? +this.filtro.precioMax : undefined,
      soloPopulares: this.filtro.soloPopulares ? true : undefined
    };

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

  agregarAlCarrito(producto: ProductoDTO): void {
    const idcliente = localStorage.getItem('clienteId');
    if (idcliente === null) {
      alert(' Por favor, inicia sesión o crea un nuevo pedido.');
      return;
    }

    // Verificar si el producto ya está en el carrito
    const detallePedido: DetallesPedidoDTO = {

      // id: localStorage.getItem('pedidoId') ? + pedidoId : null,
      id: null,
      idProducto: producto.id,
      nombreProducto: producto.nombre,
      cantidad: 1,
      precioUnitario: producto.precio,
      total: producto.precio,
      imagenUrl: producto.imagenUrl
    };
    console.log(producto)
    console.log(detallePedido)

    //Add a sesion la lista de productos que quiero comprar
    let productosComprar = JSON.parse(localStorage.getItem('productosComprar') || '[]');

    let productoExiste = productosComprar.filter((p:any)=> p.idProducto === detallePedido.idProducto);

    if (productoExiste.length > 0) {
      let productoExistente = productoExiste[0];
      productoExistente.cantidad += 1;
    }else {
      productosComprar.push(detallePedido);
    }


    localStorage.setItem('productosComprar', JSON.stringify(productosComprar));

      // Tu lógica actual para agregar al carrito
      alert('¡Producto añadido al carrito!');

    // this.carritoService.agregarDetalle(detallePedido).subscribe({
    //   next: () => {
    //     alert(`${producto.nombre} añadido al carrito`);
    //   },
    //   error: (err) => {
    //     console.error('Error al agregar al carrito', err);
    //     alert('Error al agregar al carrito');
    //   }
    // });
  }

}
