import { HttpHeaders } from '@angular/common/http';

export abstract class BaseService {
  protected readonly apiBase = '/taskfocus/maestros/api/Test';

  protected buildUrl(path: string): string {
    return `${this.apiBase}/${path}`;
  }

  protected jsonHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }
}
