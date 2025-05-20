import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../services/error-handler.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.component.html'
})
export class ClienteComponent implements OnInit {
  cliente: any = {};
  loading = false;
  error: string | null = null;
  editMode = false;

  constructor(
    private clienteService: ClienteService,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.clienteService.getMiPerfil().subscribe({
      next: (data) => {
        this.cliente = data;
        this.loading = false;
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
    this.router.navigate(['/login']);
  }
}
