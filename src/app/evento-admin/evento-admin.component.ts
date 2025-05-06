import { Component, OnInit } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/evento';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
