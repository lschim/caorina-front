import { HttpClient } from '@angular/common/http';
import { Drug, DrugDetail } from '../models/drug.model';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DrugCategoryApi {
  private http = inject(HttpClient);

  getById(id: number) {
    return this.http.get<DrugDetail>(`${environment.apiBaseUrl}/api/drugs/${id}`);
  }

  getAll() {
    return this.http.get<Drug[]>(`${environment.apiBaseUrl}/api/drugs`);
  }

  search(query: string) {
    return this.http.get<Drug[]>(`${environment.apiBaseUrl}/api/drugs`, {
      params: { search: query },
    });
  }

  updateStars(id: number, stars: number) {
    return this.http.patch<void>(`${environment.apiBaseUrl}/api/drugs/${id}/stars`, { stars });
  }
}
