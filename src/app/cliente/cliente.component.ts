import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import {AuthService} from '../services/auth.service';

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
  fotoSeleccionada: File | null = null;
  vistaPreviaFoto: string | null = null;
  editMode = false;

  constructor(
    private clienteService: ClienteService,
    private authService: AuthService,
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
      // error: (err) => {
      //   const errorMsg = this.errorHandler.handleError(err);
      //   this.error = typeof errorMsg === 'string' ? errorMsg : 'Ocurrió un error';
      //   this.loading = false;
      // }
    });
  }
  //
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fotoSeleccionada = file;

      // Crear vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.vistaPreviaFoto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // Resetear cambios al cancelar
      this.vistaPreviaFoto = null;
      this.fotoSeleccionada = null;
      this.cargarPerfil();
    }
  }

  guardarCambios(): void {
    // Verificar primero si tenemos un usuario autenticado
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.error = 'No se pudo identificar tu usuario. Por favor, vuelve a iniciar sesión.';
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.fotoSeleccionada) {
      this.subirFotoYActualizarDatos();
    } else {
      this.actualizarDatosCliente();
    }
  }

  private subirFotoYActualizarDatos(): void {
    if (!this.fotoSeleccionada) {
      this.actualizarDatosCliente();
      return;
    }

    this.clienteService.subirFotoPerfil(this.fotoSeleccionada).subscribe({
      next: () => this.actualizarDatosCliente(),
      error: (err) => this.handleError(err, 'Error al subir la foto')
    });
  }

  private actualizarDatosCliente(): void {
    // Verificar nuevamente el ID antes de actualizar
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.handleError(null, 'Sesión inválida. Vuelve a iniciar sesión.');
      return;
    }

    this.cliente.usuario = userId;

    this.clienteService.editarPerfil(this.cliente).subscribe({
      next: () => {
        this.loading = false;
        // Aquí podrías recargar los datos o mostrar un mensaje de éxito
        this.error = null;
      },
      error: (err) => this.handleError(err, 'Error al actualizar los datos')
    });
  }

  private handleError(error: any, defaultMessage: string): void {
    this.loading = false;
    this.error = error?.message || defaultMessage;
    console.error('Error:', error);
  }
}
