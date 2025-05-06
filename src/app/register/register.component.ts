import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      nickname: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Za-z]$/)]],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      fotoPerfil: [''],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('contrasena')?.value === form.get('confirmarContrasena')?.value
      ? null : { 'passwordMismatch': true };
  }

  onRegister() {
    if (this.registerForm.valid) {
      const formData = { ...this.registerForm.value };
      delete formData.confirmarContrasena;

      // Asegura incluir rol si es necesario
      formData.rol = 'cliente';

      this.authService.register(formData).subscribe({
        next: (res) => {
          console.log('Registro exitoso:', res);
          this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          this.errorMessage = err?.error?.mensaje || 'Error en el registro. Por favor, inténtalo de nuevo.';
        }
      });

    }
  }

}
