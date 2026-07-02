import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugDetail } from '../core/models/drug.model';
import { DRUG_FLAVOR_LABELS } from '../core/i18n/drug-flavor.labels';
import { DRUG_MOVEMENT_LABELS } from '../core/i18n/drug-movement.labels';
import { DRUG_NATURE_LABELS } from '../core/i18n/drug-nature.labels';
import { ORGAN_LABELS } from '../core/i18n/organ.labels';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
} from '@angular/material/card';
import { StarRatingComponent } from './star-rating/star-rating';
import { DrugCategoryApi } from '../core/api/drug.api';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-drug-view',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, StarRatingComponent],
  templateUrl: './drug-view.html',
  styleUrls: ['./drug-view.css'],
})
export class DrugViewComponent {
  @Input({ required: true }) drug!: DrugDetail;

  private drugApi = inject(DrugCategoryApi);
  private authService = inject(AuthService);

  readonly isAdmin = computed(() => this.authService.userRole() === 'ADMIN');

  updateStars(stars: number) {
    this.drugApi.updateStars(this.drug.id, stars).subscribe({
      next: () => { this.drug.numberOfStars = stars; },
      error: (err) => console.error(err),
    });
  }

  readonly natureLabels = DRUG_NATURE_LABELS;

  get natureLabel(): string {
    return this.drug.nature ? DRUG_NATURE_LABELS[this.drug.nature] : '—';
  }

  get flavorsLabel(): string {
    return this.drug.flavors?.map(f => DRUG_FLAVOR_LABELS[f]).join(', ') || '—';
  }

  get movementsLabel(): string {
    return this.drug.movements?.map(m => DRUG_MOVEMENT_LABELS[m]).join(', ') || '—';
  }

  get tropismLabel(): string {
    return this.drug.tropism?.map(o => ORGAN_LABELS[o]).join(', ') || '—';
  }
}
