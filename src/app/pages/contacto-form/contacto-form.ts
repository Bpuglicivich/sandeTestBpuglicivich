import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Contacto } from '../../core/models/contacto.model';
import { Session } from '../../core/models/session.model';
import { BasePage } from '../../core/utils/base-page';
import { ContactosService } from '../../services/contactos';

@Component({
  selector: 'app-contacto-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './contacto-form.html',
  styleUrl: './contacto-form.css'
})
export class ContactoForm extends BasePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly contactosService = inject(ContactosService);

  readonly form = this.fb.group({
    rutContacto: ['', Validators.required],
    nombreContacto: ['', Validators.required],
    abreviacion: ['', Validators.required],
    telefono: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  sessionInfo: Session | null = null;
  mode: 'create' | 'edit' = 'create';
  contactoId: string | null = null;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    const session = this.getSessionOrRedirect();
    if (!session) {
      return;
    }

    this.sessionInfo = session;

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode = 'edit';
      this.contactoId = id;
      this.form.controls.rutContacto.disable();
      this.loadContacto(session.idUsuario, id);
    }
  }

  private loadContacto(idUsuario: string, idContacto: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.contactosService.getContacto(idUsuario, idContacto).subscribe({
      next: (contacto) => {
        if (!contacto) {
          this.errorMessage = 'No se encontro el contacto solicitado.';
          this.loading = false;
          return;
        }

        this.patchForm(contacto);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No fue posible cargar el contacto.';
      }
    });
  }

  private patchForm(contacto: Contacto): void {
    this.form.patchValue({
      rutContacto: contacto.rutContacto ?? '',
      nombreContacto: contacto.nombreContacto ?? '',
      abreviacion: contacto.abreviacion ?? '',
      telefono: contacto.telefono ?? '',
      email: contacto.email ?? ''
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const session = this.sessionInfo;
    if (!session) {
      return;
    }

    const values = this.form.getRawValue();

    this.loading = true;

    if (this.mode === 'create') {
      this.contactosService
        .crearContacto({
          idUsuario: session.idUsuario,
          idContacto: '0',
          rutContacto: values.rutContacto ?? '',
          nombreContacto: values.nombreContacto ?? '',
          abreviacion: values.abreviacion ?? '',
          telefono: values.telefono ?? '',
          email: values.email ?? ''
        })
        .subscribe({
          next: () => {
            this.loading = false;
            this.router.navigateByUrl('/contactos');
          },
          error: () => {
            this.loading = false;
            this.errorMessage = 'No fue posible crear el contacto.';
          }
        });

      return;
    }

    if (!this.contactoId) {
      this.loading = false;
      this.errorMessage = 'No se encontro el contacto a editar.';
      return;
    }

    this.contactosService
      .actualizarContacto({
        idUsuario: session.idUsuario,
        idContacto: this.contactoId,
        nombreContacto: values.nombreContacto ?? '',
        abreviacion: values.abreviacion ?? '',
        telefono: values.telefono ?? '',
        email: values.email ?? ''
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigateByUrl('/contactos');
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'No fue posible actualizar el contacto.';
        }
      });
  }
}
