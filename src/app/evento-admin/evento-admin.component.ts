import { Component, OnInit } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/evento';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-evento-admin',
  templateUrl: './evento-admin.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class EventoAdminComponent implements OnInit {
  eventos: Evento[] = [];
  loading = true;
  error: string | null = null;

  modoFormulario = false;
  eventoEditando: Evento | null = null;

  errorMessage: string | null = null;
  isLoading = false;

  // Inicializamos con valores por defecto válidos
  nuevoEvento: Evento = this.getEventoVacio();

  constructor(
    private eventoService: EventoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.loading = true;
    this.eventoService.getEventos().subscribe({
      next: eventos => {
        this.eventos = eventos;
        this.loading = false;
      },
      error: err => {
        this.error = 'No se pudieron cargar los eventos.';
        this.loading = false;
      }
    });
  }


  crearEvento(): void {
    // Validación básica
    if (!this.nuevoEvento.nombre || !this.nuevoEvento.descripcion ||
      !this.nuevoEvento.fecha || !this.nuevoEvento.imagen) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    const capacidad = Number(this.nuevoEvento.capacidad);
    const precio = Number(this.nuevoEvento.precio);

    if (isNaN(capacidad) || capacidad <= 0) {
      this.errorMessage = 'La capacidad debe ser un número positivo';
      return;
    }

    if (isNaN(precio) || precio < 0) {
      this.errorMessage = 'El precio debe ser un número positivo o cero';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const datosEvento = {
      nombre: this.nuevoEvento.nombre.trim(),
      descripcion: this.nuevoEvento.descripcion.trim(),
      fecha: this.nuevoEvento.fecha,
      capacidad: capacidad,
      precio: precio,
      imagen: this.nuevoEvento.imagen.trim()
    };

    this.eventoService.crearEvento(datosEvento).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/eventos']);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Error al crear el evento';
      }
    });
  }



  abrirFormulario(evento?: Evento): void {
    this.modoFormulario = true;
    this.eventoEditando = evento || null;
    this.nuevoEvento = evento ? { ...evento } : this.getEventoVacio();
  }

  cerrarFormulario(): void {
    this.modoFormulario = false;
    this.nuevoEvento = this.getEventoVacio();
    this.eventoEditando = null;
  }

  guardarEvento(): void {
    if (this.eventoEditando && this.eventoEditando.id !== undefined) {
      // Editar evento
      this.eventoService.editarEvento(this.eventoEditando.id, this.nuevoEvento).subscribe({
        next: () => {
          this.cargarEventos();
          this.cerrarFormulario();
        },
        error: () => alert('Error al editar el evento')
      });
    } else {
      // Crear nuevo evento
      this.nuevoEvento.id = undefined;
      this.eventoService.crearEvento(this.nuevoEvento).subscribe({
        next: () => {
          this.cargarEventos();
          this.cerrarFormulario();
        },
        error: () => alert('Error al crear el evento')
      });
    }
  }
  eliminarEvento(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      this.eventoService.eliminarEvento(id).subscribe({
        next: () => this.cargarEventos(),
        error: () => alert('Error al eliminar el evento')
      });
    }
  }

  formatearFecha(fechaString: string | Date): string {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }


  // Función auxiliar para crear un objeto evento vacío
  private getEventoVacio(): Evento {
    return {
      id: 0,
      nombre: '',
      descripcion: '',
      fecha: '',
      capacidad: 0,
      precio: 0,
      imagen: ''
    };
  }
}
