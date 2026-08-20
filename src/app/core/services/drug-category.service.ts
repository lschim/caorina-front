import { inject, Injectable, signal } from '@angular/core';
import { DrugCategory } from '../models/drug-category.model';
import { DrugCategoryApi } from '../api/drug-category.api';

@Injectable({ providedIn: 'root' })
export class DrugCategoryService {
  private drugCategoryApi = inject(DrugCategoryApi);

  private categories = signal<DrugCategory[]>([]);

  load() {
    this.drugCategoryApi.getAll().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error(err),
    });
  }

  get categoriesSignal() {
    return this.categories;
  }
}
