import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventoService } from '../services/evento.service';
import {CommonModule} from '@angular/common';
import {Evento} from '../models/evento';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  events: Evento[] = [];
  @ViewChild('eventsCarousel') eventsCarousel!: ElementRef;

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.eventoService.getEventos().subscribe(eventos => {
      this.events = eventos;
    });
  }

  scrollEventsLeft(): void {
    this.eventsCarousel.nativeElement.scrollLeft -= 300;
  }

  scrollEventsRight(): void {
    this.eventsCarousel.nativeElement.scrollLeft += 300;
  }

  getEventImage(type?: string): string {
    // Aquí podrías poner lógica en base al tipo (cuando lo uses)
    return 'default-event.jpg';
  }

  getStars(rating: number): string {
    const fullStars = Math.round(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  }
}
