import { Component } from '@angular/core';
import { FORMULAS_LABELS } from '../core/i18n/formulas.labels';

@Component({
  selector: 'app-formulas-view',
  imports: [],
  templateUrl: './formulas-view.html',
  styleUrl: './formulas-view.css',
})
export class FormulasView {
  readonly labels = FORMULAS_LABELS;
}
