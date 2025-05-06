import { Component, OnInit } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Evento } from '../models/evento'; // Solo la interfaz, ya sin EventoModel

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class EventoComponent implements OnInit {
  eventos: Evento[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private eventoService: EventoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar eventos:', err);
        this.error = 'No se pudieron cargar los eventos. Intente más tarde.';
        this.loading = false;
      }
    });
  }

  public formatearFecha(fechaString: string): string {
    const fecha = new Date(fechaString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    return fecha.toLocaleDateString('es-ES', options);
  }


  irAInscripcion(eventoId: number): void {
    this.router.navigate(['/inscripcion', eventoId]);
  }
}
