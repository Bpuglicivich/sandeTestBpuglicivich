import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';
import { Session } from '../models/session.model';

export abstract class BasePage {
  protected readonly authService = inject(AuthService);
  protected readonly router = inject(Router);

  protected get session(): Session | null {
    return this.authService.getSession();
  }

  protected get perfil(): string | null {
    return this.session?.perfil ?? null;
  }

  protected hasPerfil(allowed: string[]): boolean {
    const perfil = this.perfil;
    return !!perfil && allowed.includes(perfil);
  }

  protected getSessionOrRedirect(): Session | null {
    const session = this.session;
    if (!session) {
      this.router.navigateByUrl('/login');
      return null;
    }
    return session;
  }
}