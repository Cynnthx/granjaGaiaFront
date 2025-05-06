import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { NgIf } from '@angular/common';
import { ActualizarHeaderService } from '../services/actualizar-header.service';

interface CustomJwtPayload {
  userId: string;
  rol: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private actualizar: ActualizarHeaderService
  ) {
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
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.usuario));

            // const decodedToken = jwtDecode<CustomJwtPayload>(response.token);
            // const role = decodedToken.rol.toLowerCase();


            //REDIRIGIR A PERFIL CLIENTE, NO FUNCIONA
            this.actualizar.triggerRefreshHeader();
            this.router.navigate(['/cliente']);
          }
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = 'Email o contraseña incorrectos. Por favor, inténtelo de nuevo.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }
}
