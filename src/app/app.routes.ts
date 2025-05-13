import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContactoComponent } from './contacto/contacto.component';
import { EventoComponent } from './evento/evento.component';
import { InscripcionComponent } from './inscripcion/inscripcion.component';
import { ClienteComponent } from './cliente/cliente.component';
import { EventoAdminComponent } from './evento-admin/evento-admin.component';
import { TiendaComponent } from './tienda/tienda.component';
import {CategoriaComponent} from './categoria/categoria.component';
import {TiendaAdminComponent} from './tienda-admin/tienda-admin.component';
// import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact', component: ContactoComponent },
  { path: 'events', component: EventoComponent },
  { path: 'adminevent', component: EventoAdminComponent },
  { path: 'inscripcion/:id', component: InscripcionComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'tienda', component: TiendaComponent },
  { path: 'categorias', component: CategoriaComponent },
  { path: 'admintienda', component: TiendaAdminComponent },

// { path: 'producto/:id', component: ProductoDetalleComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Ruta por defecto
  { path: '**', redirectTo: '/home' }
];
