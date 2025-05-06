import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  // Datos para el mapa (coordenadas ficticias cerca de Bolonia, Cádiz)
  mapLocation = {
    lat: 36.0845,
    lng: -5.7766,
    zoom: 14,
    markerText: 'Granja Gaia'
  };

  // Datos de contacto
  contactInfo = {
    phone: '+34 612 345 678',
    address: 'Cerca de Bolonia, Cádiz'
  };

  // Método para abrir el mapa en Google Maps
  openGoogleMaps() {
    const url = `https://www.google.com/maps?q=${this.mapLocation.lat},${this.mapLocation.lng}`;
    window.open(url, '_blank');
  }

  // Método para llamar por teléfono (en dispositivos móviles)
  callPhone() {
    window.location.href = `tel:${this.contactInfo.phone}`;
  }
}
