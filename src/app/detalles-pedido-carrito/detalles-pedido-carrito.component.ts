import { Component, OnInit } from '@angular/core';
import { CarritoService, DetallesPedidoDTO } from '../services/carrito.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {Producto} from '../models/producto';

@Component({
  selector: 'app-detalles-pedido-carrito',
  templateUrl: './detalles-pedido-carrito.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class DetallesPedidoCarritoComponent implements OnInit {
  productosEnCarrito: DetallesPedidoDTO[] = [];
  totalCarrito: number = 0;
  productosComprar: any[] = [];
  mostrarToast = false;

  // Variables para el modal de pago
  isModalOpen: boolean = false;
  pasoActual: number = 1;
  metodoPagoSeleccionado: string = '';

  // Formularios para cada método de pago
  tarjetaForm: FormGroup;
  paypalForm: FormGroup;
  transferenciaForm: FormGroup;

  constructor(
    private carritoService: CarritoService,
    private fb: FormBuilder
  ) {
    // Inicializar formularios
    this.tarjetaForm = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      titular: ['', Validators.required],
      fecha: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });

    this.paypalForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.transferenciaForm = this.fb.group({
      banco: ['', Validators.required],
      cuenta: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarProductosComprar();
  }

  cargarProductos(): void {
    this.carritoService.obtenerDetalles().subscribe(
      (productos) => {
        console.log(productos);
        this.productosEnCarrito = productos;
        this.calcularTotal();
      },
      (error) => {
        console.error('Error al cargar los productos del carrito:', error);
      }
    );
  }

  cargarProductosComprar(): void {
    const data = localStorage.getItem('productosComprar');
    this.productosComprar = data ? JSON.parse(data) : [];
    this.calcularTotal(); // Añadido para calcular total al cargar
  }

  private actualizarProductosComprar(): void {
    this.guardarEnLocalStorage();
    this.calcularTotal();
  }

  private guardarEnLocalStorage(): void {
    localStorage.setItem('productosComprar', JSON.stringify(this.productosComprar));
  }

  calcularTotal(): void {
    const totalServicio = this.productosEnCarrito.reduce((sum, p) => sum + (p.total || 0), 0);
    const totalLocal = this.productosComprar.reduce((sum, p) => {
      const precio = Number(p.precioUnitario) || 0;
      const cantidad = Number(p.cantidad) || 0;
      return sum + (precio * cantidad);
    }, 0);
    this.totalCarrito = totalServicio + totalLocal;
    console.log('Total carrito:', this.totalCarrito);

  }

  aumentarCantidad(producto: DetallesPedidoDTO): void {
    producto.cantidad += 1;
    producto.total = producto.cantidad * producto.precioUnitario;
    this.calcularTotal();
    this.carritoService.actualizarDetalle(producto).subscribe();
  }

  disminuirCantidad(producto: DetallesPedidoDTO): void {
    if (producto.cantidad > 1) {
      producto.cantidad -= 1;
      producto.total = producto.cantidad * producto.precioUnitario;
      this.calcularTotal();
      this.carritoService.actualizarDetalle(producto).subscribe();
    }
  }

  incrementarCantidad(producto: any): void {
    producto.cantidad++;
    this.actualizarProductosComprar();
  }

  decrementarCantidad(producto: any): void {
    if (producto.cantidad > 1) {
      producto.cantidad--;
      this.actualizarProductosComprar();
    }
  }

  eliminarProducto(id: number | null): void {
    if (id !== null && id !== undefined) {
      this.productosEnCarrito = this.productosEnCarrito.filter(p => p.id !== id);
      this.calcularTotal();
      this.carritoService.eliminarDetalle(id).subscribe();
    }
  }

  eliminarProductoGuardado(producto: any): void {
    this.productosComprar = this.productosComprar.filter(p => p !== producto);
    this.actualizarProductosComprar();
    alert('Producto eliminado correctamente.');
  }

  vaciarCarrito(): void {
    const idcliente = localStorage.getItem('clienteId');
    if (idcliente === null) {
      alert('Por favor, inicia sesión o crea un nuevo pedido.');
      return;
    }
    localStorage.removeItem('productosComprar');
    this.productosComprar = [];
    this.calcularTotal();
    alert('Carrito vaciado correctamente.');
  }

  // Métodos para el modal de pago
  toggleModal(): void {
    this.isModalOpen = !this.isModalOpen;
    if (!this.isModalOpen) {
      this.resetearProcesoPago();
    }
  }

  siguientePaso(): void {
    if (this.pasoActual === 1 && !this.metodoPagoSeleccionado) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    if (this.pasoActual === 2 && !this.validarFormularioActual()) {
      return;
    }

    if (this.pasoActual < 3) {
      this.pasoActual++;
    } else {
      this.procesarPago();
    }
  }

  pasoAnterior(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  validarFormularioActual(): boolean {
    switch (this.metodoPagoSeleccionado) {
      case 'tarjeta':
        if (this.tarjetaForm.invalid) {
          this.tarjetaForm.markAllAsTouched();
          return false;
        }
        break;
      case 'paypal':
        if (this.paypalForm.invalid) {
          this.paypalForm.markAllAsTouched();
          return false;
        }
        break;
      case 'transferencia':
        if (this.transferenciaForm.invalid) {
          this.transferenciaForm.markAllAsTouched();
          return false;
        }
        break;
    }
    return true;
  }

  getFormGroup(metodo: string): FormGroup {
    switch (metodo) {
      case 'tarjeta': return this.tarjetaForm;
      case 'paypal': return this.paypalForm;
      case 'transferencia': return this.transferenciaForm;
      default: return this.fb.group({});
    }
  }

  procesarPago(): void {
    console.log('Procesando pago con:', this.metodoPagoSeleccionado);
    alert('Pago procesado con éxito!');
    this.vaciarCarrito();
    this.resetearProcesoPago();
    this.toggleModal();
  }

  resetearProcesoPago(): void {
    this.pasoActual = 1;
    this.metodoPagoSeleccionado = '';
    this.tarjetaForm.reset();
    this.paypalForm.reset();
    this.transferenciaForm.reset();
  }


}
