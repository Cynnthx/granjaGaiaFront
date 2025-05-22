import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../services/error-handler.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {PedidoDTO, PedidoService} from '../services/pedido.service';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.component.html'
})
export class ClienteComponent implements OnInit {
  cliente: any = {};
  pedidos: PedidoDTO[] = [];
  loading = false;
  error: string | null = null;
  editMode = false;

  constructor(
    private clienteService: ClienteService,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private http: HttpClient,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
    this.cargarPedidos();
  }


  cargarPedidos(): void {
    // if (!this.cliente?.id) {
    //   this.error = 'No se pudo obtener el ID del cliente';
    //   return;
    // }
    this.pedidoService.getMisPedidos(this.cliente.id).subscribe({
      next: (data: PedidoDTO[]) => {
        this.pedidos = data;
      },
      error: (err) => {
        this.errorHandler.handleError(err);
      }
    });
  }


  private esDniNieValido(dniNie: string): boolean {
    if (!dniNie) return false;

    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    dniNie = dniNie.toUpperCase().trim();

    // NIE
    if (/^[XYZ]\d{7}[A-Z]$/.test(dniNie)) {
      const letraInicial = dniNie.charAt(0);
      const numeroBase = {
        'X': '0',
        'Y': '1',
        'Z': '2'
      }[letraInicial] + dniNie.substring(1, 8);

      const resto = parseInt(numeroBase) % 23;
      return dniNie.charAt(8) === letras.charAt(resto);
    }

    // DNI
    if (/^\d{8}[A-Z]$/.test(dniNie)) {
      const numero = parseInt(dniNie.substring(0, 8));
      const resto = numero % 23;
      return dniNie.charAt(8) === letras.charAt(resto);
    }

    return false;
  }


  cargarPerfil(): void {
    this.clienteService.getMiPerfil().subscribe({
      next: (data) => {
        this.cliente = data;
        this.loading = false;

        //cargamos los pedidos de los clientes
        this.cargarPedidos();
      },
      error: (err) => {
        this.errorHandler.handleError(err);
        this.loading = false;
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.cargarPerfil();
    }
  }

  guardarCambios(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.error = 'No se pudo identificar tu usuario. Por favor, vuelve a iniciar sesión.';
      return;
    }


    if (!this.esDniNieValido(this.cliente.dni)) {
      this.error = 'DNI o NIE incorrecto.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.actualizarDatosCliente();
  }

  private actualizarDatosCliente(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.handleError(null, 'Sesión inválida. Vuelve a iniciar sesión.');
      return;
    }

    this.cliente.usuario = { id: userId };

    this.clienteService.editarPerfil(this.cliente).subscribe({
      next: () => {
        this.loading = false;
        this.error = null;
      },
      error: (err) => this.handleError(err, 'Error al actualizar los datos')
    });
  }

  private handleError(error: any, defaultMessage: string): void {
    this.loading = false;
    this.error = error?.message || defaultMessage;
    // console.error('Error:', error);
  }



  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('productosComprar');
    this.router.navigate(['/login']);
  }
}
