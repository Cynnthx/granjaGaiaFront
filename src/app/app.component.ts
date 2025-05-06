import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactoComponent } from './contacto/contacto.component';
import { EventoComponent } from './evento/evento.component';
import {InscripcionComponent} from './inscripcion/inscripcion.component';
import {ClienteComponent} from './cliente/cliente.component';
import {EventoAdminComponent} from './evento-admin/evento-admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    // HomeComponent,
    CommonModule,
    ReactiveFormsModule,
    // LoginComponent,
    // RegisterComponent,
    // ContactoComponent,
    // EventoComponent,
    // InscripcionComponent,
    // ClienteComponent,
    // EventoAdminComponent,
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'GranjaGaia';

  constructor(private authService: AuthService) {}
}
