import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DrugCategoryService } from '../core/services/drug-category.service';
import { DrugService } from '../core/services/drug.service';
import { DrugViewComponent } from '../drug-view/drug-view';
import { DrugPreview } from '../drug-preview/drug-preview';
import { DrugCategoryApi } from '../core/api/drug.api';
import { Drug, DrugDetail } from '../core/models/drug.model';
import { Subject, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-drugs-view',
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    DrugViewComponent,
    DrugPreview,
  ],
  templateUrl: './drugs-view.html',
  styleUrl: './drugs-view.css',
})
export class DrugsView implements OnInit {
  private drugCategoryService = inject(DrugCategoryService);
  private drugApi = inject(DrugCategoryApi);
  private destroyRef = inject(DestroyRef);
  drugService = inject(DrugService);

  selectedDrugId = signal<number | null>(null);
  selectedDrugDetail = signal<DrugDetail | null>(null);
  searchResults = signal<Drug[] | null>(null);

  categories = this.drugCategoryService.categoriesSignal;

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => {
        if (query.trim().length < 2) {
          this.searchResults.set(null);
          return;
        }
        this.drugApi.search(query).subscribe({
          next: (results) => this.searchResults.set(results),
          error: (err) => console.error(err),
        });
      });
  }

  ngOnInit() {
    this.drugCategoryService.load();
  }

  categoryName(categoryId: number | undefined): string {
    return this.categories().find((c) => c.id === categoryId)?.name ?? '';
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    if (!query.trim()) {
      this.searchResults.set(null);
      return;
    }
    this.searchSubject.next(query);
  }

  onOpenCategory(categoryId: number) {
    this.drugService.loadByCategory(categoryId);
  }

  toggleDrug(drugId: number) {
    if (this.selectedDrugId() === drugId) {
      this.selectedDrugId.set(null);
      this.selectedDrugDetail.set(null);
    } else {
      this.selectedDrugId.set(drugId);
      this.selectedDrugDetail.set(null);
      this.drugApi.getById(drugId).subscribe({
        next: (detail) => this.selectedDrugDetail.set(detail),
        error: (err) => console.error(err),
      });
    }
  }
}
