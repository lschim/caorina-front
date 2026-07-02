import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './star-rating.html',
  styleUrls: ['./star-rating.css'],
})
export class StarRatingComponent {
  /** Stored value 0–10 (half-star = 1 unit). Display = value / 2. */
  @Input() value = 0;
  @Input() readonly = true;
  @Input() iconSize = 28;
  @Output() valueChange = new EventEmitter<number>();

  readonly positions = [1, 2, 3, 4, 5];
  hovered: number | null = null;

  get display(): number {
    return (this.hovered ?? this.value) / 2;
  }

  iconFor(pos: number): string {
    const d = this.display;
    if (d >= pos) return 'star';
    if (d >= pos - 0.5) return 'star_half';
    return 'star_border';
  }

  onHalf(pos: number) {
    if (!this.readonly) this.hovered = (pos - 1) * 2 + 1;
  }
  onFull(pos: number) {
    if (!this.readonly) this.hovered = pos * 2;
  }
  clearHover() {
    if (!this.readonly) this.hovered = null;
  }

  rateHalf(pos: number) {
    this.valueChange.emit((pos - 1) * 2 + 1);
  }
  rateFull(pos: number) {
    this.valueChange.emit(pos * 2);
  }
}
