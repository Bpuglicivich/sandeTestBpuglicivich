import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { ContactoForm } from './pages/contacto-form/contacto-form';
import { ContactosList } from './pages/contactos-list/contactos-list';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'contactos', canActivate: [authGuard], component: ContactosList },
  {
    path: 'contactos/nuevo',
    canActivate: [authGuard],
    data: { profiles: ['1', '2'] },
    component: ContactoForm
  },
  {
    path: 'contactos/:id/editar',
    canActivate: [authGuard],
    data: { profiles: ['1', '2'] },
    component: ContactoForm
  },
  { path: '**', redirectTo: 'login' }
];