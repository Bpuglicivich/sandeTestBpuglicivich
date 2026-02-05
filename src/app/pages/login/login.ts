import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { BasePage } from '../../core/utils/base-page';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login extends BasePage implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    usuario: ['', Validators.required],
    clave: ['', Validators.required]
  });

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/contactos');
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { usuario, clave } = this.form.getRawValue();

    if (!usuario || !clave) {
      this.errorMessage = 'Usuario y clave son requeridos.';
      return;
    }

    this.loading = true;

    this.authService.login(usuario, clave).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/contactos');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.message ?? 'No fue posible iniciar sesion.';
      }
    });
  }
}
