import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule,  ReactiveFormsModule],
  standalone: true,
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, contrasena } = this.loginForm.value;

      this.authService.login(email, contrasena).subscribe({

        next: (response) => {


          console.log("Respuesta:", response);
          localStorage.setItem('token', response.token);

          // Guardar el usuario en localStorage
          localStorage.setItem('usuarioId', String(response.usuarioId));

          const role = response.rol;
          console.log("Rol del usuario:", role);



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
