import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

import { Contacto } from '../core/models/contacto.model';
import { BaseService } from '../core/utils/base-service';

export interface CrearContactoRequest {
  idUsuario: string;
  idContacto: string;
  rutContacto: string;
  nombreContacto: string;
  abreviacion: string;
  telefono: string;
  email: string;
}

export interface UpdateContactoRequest {
  idUsuario: string;
  idContacto: string;
  nombreContacto: string;
  abreviacion: string;
  telefono: string;
  email: string;
}

export interface DeleteContactoRequest {
  idUsuario: string;
  idContacto: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactosService extends BaseService {
  private readonly http = inject(HttpClient);

  listarContactos(idUsuario: string) {
    return this.http
      .get<Contacto[]>(this.buildUrl(`ListarContactos/${idUsuario}`))
      .pipe(map((response) => (Array.isArray(response) ? response : [])));
  }

  getContacto(idUsuario: string, idContacto: string) {
    const primaryUrl = this.buildUrl(`ListaContacto/${idUsuario}/${idContacto}`);
    const fallbackUrl = this.buildUrl(`ListarContactos/${idUsuario}/${idContacto}`);

    return this.http.get<Contacto[] | Contacto>(primaryUrl).pipe(
      map((response) => this.normalizeContacto(response)),
      catchError(() =>
        this.http.get<Contacto[] | Contacto>(fallbackUrl).pipe(
          map((response) => this.normalizeContacto(response)),
          catchError(() => of(null))
        )
      )
    );
  }

  crearContacto(payload: CrearContactoRequest) {
    return this.http.post(this.buildUrl('CreaContacto'), payload, {
      headers: this.jsonHeaders()
    });
  }

  actualizarContacto(payload: UpdateContactoRequest) {
    return this.http.post(this.buildUrl('UpdateContacto'), payload, {
      headers: this.jsonHeaders()
    });
  }

  eliminarContacto(payload: DeleteContactoRequest) {
    return this.http.post(this.buildUrl('DeleteContacto'), payload, {
      headers: this.jsonHeaders()
    });
  }

  private normalizeContacto(response: Contacto[] | Contacto): Contacto | null {
    if (Array.isArray(response)) {
      return response[0] ?? null;
    }

    return response ?? null;
  }
}