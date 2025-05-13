import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.component.html'
})
export class ClienteComponent implements OnInit {
  cliente: any = null;
  loading = true;
  error: string | null = null;
  editMode = false;
  fotoSeleccionada: File | null = null;
  vistaPreviaFoto: string | null = null;

  constructor(
    private clienteService: ClienteService,
    private errorHandler: ErrorHandlerService,
    private router: Router
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
    this.loading = true;

    // Primero subir la foto si hay una nueva
    if (this.fotoSeleccionada) {
      this.clienteService.subirFotoPerfil(this.fotoSeleccionada).subscribe({
        next: () => {
          // Después de subir la foto, actualizar el resto de datos
          this.actualizarDatosCliente();
        },
        error: (err) => {
          const errorMsg = this.errorHandler.handleError(err);
          this.error = typeof errorMsg === 'string' ? errorMsg : 'Ocurrió un error';
          this.loading = false;
        }
      });
    } else {
      this.actualizarDatosCliente();
    }
  }

  private actualizarDatosCliente(): void {
    this.clienteService.actualizarPerfil(this.cliente).subscribe({
      next: () => {
        this.editMode = false;
        this.loading = false;
        this.vistaPreviaFoto = null;
        this.fotoSeleccionada = null;
        this.cargarPerfil(); // Recargar datos actualizados
      },
      error: (err) => {
        const errorMsg = this.errorHandler.handleError(err);
        this.error = typeof errorMsg === 'string' ? errorMsg : 'Ocurrió un error';
        this.loading = false;
      }
    });
  }
}
