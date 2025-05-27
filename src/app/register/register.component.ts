import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

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

  private esDniNieValido(dniNie: string): boolean {
    if (!dniNie) return false;

    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    dniNie = dniNie.toUpperCase().trim();

    // NIE
    if (/^[XYZ]\d{7}[A-Z]$/.test(dniNie)) {
      const letraInicial = dniNie.charAt(0);
      const numeroBase = {
        'X': '0',
        'Y': '1',
        'Z': '2'
      }[letraInicial] + dniNie.substring(1, 8);

      const resto = parseInt(numeroBase) % 23;
      return dniNie.charAt(8) === letras.charAt(resto);
    }

    // DNI
    if (/^\d{8}[A-Z]$/.test(dniNie)) {
      const numero = parseInt(dniNie.substring(0, 8));
      const resto = numero % 23;
      return dniNie.charAt(8) === letras.charAt(resto);
    }

    return false;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contrasena')?.value;
    const confirmPassword = form.get('confirmarContrasena')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onRegister() {
    if (!this.esDniNieValido(this.registerForm.value.dni)) {
      this.errorMessage = 'DNI o NIE incorrecto.';
      return;
    }

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
    } else {
      this.errorMessage = 'Por favor, completa correctamente todos los campos obligatorios.';
    }
  }
}
