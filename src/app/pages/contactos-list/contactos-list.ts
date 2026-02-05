import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Contacto } from '../../core/models/contacto.model';
import { Session } from '../../core/models/session.model';
import { BasePage } from '../../core/utils/base-page';
import { ContactosService } from '../../services/contactos';

@Component({
  selector: 'app-contactos-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './contactos-list.html',
  styleUrl: './contactos-list.css'
})
export class ContactosList extends BasePage implements OnInit {
  private readonly contactosService = inject(ContactosService);

  contactos: Contacto[] = [];
  sessionInfo: Session | null = null;
  loading = false;
  errorMessage = '';

  canCreate = false;
  canEdit = false;
  canDelete = false;

  ngOnInit(): void {
    const session = this.getSessionOrRedirect();
    if (!session) {
      return;
    }

    this.sessionInfo = session;
    this.canCreate = this.hasPerfil(['1', '2']);
    this.canEdit = this.canCreate;
    this.canDelete = this.hasPerfil(['1']);

    this.loadContactos(session.idUsuario);
  }

  loadContactos(idUsuario: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.contactosService.listarContactos(idUsuario).subscribe({
      next: (contactos) => {
        this.contactos = contactos;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No fue posible cargar los contactos.';
      }
    });
  }

  onDelete(contacto: Contacto): void {
    const session = this.sessionInfo;
    if (!session) {
      return;
    }

    const confirmed = confirm(`Eliminar el contacto ${contacto.nombreContacto}?`);
    if (!confirmed) {
      return;
    }

    this.contactosService
      .eliminarContacto({
        idUsuario: session.idUsuario,
        idContacto: contacto.idContacto
      })
      .subscribe({
        next: () => this.loadContactos(session.idUsuario),
        error: () => {
          this.errorMessage = 'No fue posible eliminar el contacto.';
        }
      });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  trackById(index: number, contacto: Contacto): string {
    return contacto.idContacto ?? index.toString();
  }
}
