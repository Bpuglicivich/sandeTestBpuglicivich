import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { LoginResponse } from '../core/models/login-response.model';
import { Session } from '../core/models/session.model';
import { BaseService } from '../core/utils/base-service';
import { STORAGE_KEYS } from '../core/utils/storage-keys';
import { generateToken } from '../core/utils/token.util';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private readonly http = inject(HttpClient);

  login(usuario: string, clave: string) {
    const payload = { usuario, clave };

    return this.http
      .post<LoginResponse[]>(this.buildUrl('Login'), payload, {
        headers: this.jsonHeaders()
      })
      .pipe(
        map((response) => {
          const [first] = Array.isArray(response) ? response : [];
          if (!first) {
            throw new Error('Credenciales invalidas.');
          }

          const session: Session = {
            token: generateToken(),
            idUsuario: first.idUsuario,
            perfil: first.perfil,
            nombre: first.nombre,
            apellido: first.apellido
          };

          localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
          return session;
        })
      );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.session);
  }

  getSession(): Session | null {
    const raw = localStorage.getItem(STORAGE_KEYS.session);
    if (!raw) {
      return null;
    }

    try {
      const session = JSON.parse(raw) as Session;
      if (session?.token && session?.idUsuario && session?.perfil) {
        return session;
      }
    } catch {
      return null;
    }

    return null;
  }

  getToken(): string | null {
    return this.getSession()?.token ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
