import { Component, OnInit } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class InscripcionComponent implements OnInit {
  evento: any = null;
  loading = true;
  error: string | null = null;
  submitting = false;
  eventoId?: number; // Añadido para almacenar el ID del evento

  // Formulario actualizado
  formularioInscripcion = {
    nombre: '',
    email: '',
    telefono: '',
    cantidadPersonas: 1
  };

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && !isNaN(+id)) {
      this.eventoId = +id;
      this.cargarEvento(this.eventoId);
    } else {
      this.error = 'No se ha especificado un evento válido';
      this.loading = false;
      this.router.navigate(['/events']); // Redirige si no hay ID válido
    }
  }

  cargarEvento(eventoId: number): void {
    this.eventoService.getEventoPorId(eventoId).subscribe({
      next: (evento: any) => {
        this.evento = evento;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar el evento:', err);
        this.error = 'No se pudo cargar el evento. Intente más tarde.';
        this.loading = false;
      }
    });
  }

  formatearFecha(fechaString: string): string {
    const fecha = new Date(fechaString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', options);
  }

  inscribirme(): void {
    if (!this.evento) return;

    // Validación mejorada
    if (!this.formularioInscripcion.nombre ||
      !this.formularioInscripcion.email ||
      !this.formularioInscripcion.cantidadPersonas) {
      this.error = 'Por favor complete todos los campos obligatorios';
      return;
    }

    this.submitting = true;
    this.error = null;

    // Aquí deberías implementar:
    // 1. Lógica para obtener/crear el cliente (y obtener su ID)
    // 2. Luego hacer la inscripción

    // Ejemplo de navegación a confirmación (ajusta según tu flujo)
    this.router.navigate(['/confirmacion-inscripcion', this.eventoId], {
      state: {
        evento: this.evento,
        datosInscripcion: this.formularioInscripcion
      }
    });
  }
}
