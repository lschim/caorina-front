import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DrugCategory } from '../models/drug-category.model';
import { Drug } from '../models/drug.model';

@Injectable({ providedIn: 'root' })
export class DrugCategoryApi {
  private http = inject(HttpClient);

  getById(id: number) {
    return this.http.get<DrugCategory>(`${environment.apiBaseUrl}/api/drug-categories/${id}`);
  }

  getAll() {
    return this.http.get<DrugCategory[]>(`${environment.apiBaseUrl}/api/drug-categories`);
  }

  getDrugsOfCategory(categoryId: number) {
    return this.http.get<CategoryWithDrugs>(
      `${environment.apiBaseUrl}/api/drug-categories/${categoryId}/drugs`,
    );
  }
}
export interface CategoryWithDrugs {
  category: DrugCategory;
  drugs: Drug[];
}
