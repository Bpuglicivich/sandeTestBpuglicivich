import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../services/auth';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const session = auth.getSession();

  if (!session) {
    return router.parseUrl('/login');
  }

  const allowedProfiles = route.data?.['profiles'] as string[] | undefined;
  if (allowedProfiles && !allowedProfiles.includes(session.perfil)) {
    return router.parseUrl('/contactos');
  }

  return true;
};