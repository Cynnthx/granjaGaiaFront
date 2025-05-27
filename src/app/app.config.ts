import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // ✅ Importación necesaria
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Configuración de Zone.js
    provideRouter(routes), // Configuración de rutas
    provideHttpClient(),   // ✅ Habilita HttpClient para toda la aplicación
  ]
};
