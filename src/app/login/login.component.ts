import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {CommonModule} from '@angular/common';
import {PedidoService} from '../services/pedido.service';
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule,  ReactiveFormsModule],
  standalone: true,
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private pedidoService: PedidoService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, contrasena } = this.loginForm.value;

      this.authService.login(email, contrasena).subscribe({

        next: async (response) => {

          console.log("Respuesta:", response);
          localStorage.setItem('token', response.token);

          // Guardar el usuario en localStorage
          localStorage.setItem('usuarioId', String(response.usuarioId));

          // Guardar el clienteId en localStorage
          localStorage.setItem('clienteId', String(response.clienteId));


          // 🆕 Vaciar el carrito al iniciar sesión
          localStorage.removeItem('productosComprar');


          const role = response.rol;
          console.log("Rol del usuario:", role);

          if(response.clienteId != null){

            // Crear un nuevo pedido
            // const pedidoCreado = await lastValueFrom(this.pedidoService.crearPedido(response.clienteId));
            // localStorage.setItem('pedidoId', String(pedidoCreado.id));
          }


          if (role === 'admin') {
            this.router.navigate(['/adminevent']);
          } else if (role === 'cliente') {
            this.router.navigate(['/events']);
          } else {
            this.errorMessage = 'Rol desconocido, no se puede iniciar sesión.';
          }
        },
        error: (error) => {
          console.error("Error en la solicitud de login:", error);
          this.errorMessage = 'Email o contraseña incorrectos. Por favor, inténtelo de nuevo.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }
}
