import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-rating-container" [title]="rating + ' sur 5 étoiles'">
      <div class="stars">
        <i 
          *ngFor="let star of starsArray" 
          class="ph star-icon"
          [class.ph-star-fill]="star === 'full'"
          [class.ph-star-half-fill]="star === 'half'"
          [class.ph-star]="star === 'empty'"
          [class.filled]="star !== 'empty'"
        ></i>
      </div>
      <span *ngIf="showValue" class="rating-text">
        <strong>{{ rating | number:'1.1-1' }}</strong>
        <span *ngIf="count !== undefined" class="count-text">({{ count }})</span>
      </span>
    </div>
  `,
  styles: [`
    .star-rating-container {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .stars {
      display: flex;
      align-items: center;
      gap: 2px;
      color: #CBD5E1;
    }
    .star-icon {
      font-size: 0.95rem;
    }
    .star-icon.filled {
      color: var(--accent-amber);
    }
    .rating-text {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .count-text {
      color: var(--text-subtle);
      margin-left: 2px;
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 5;
  @Input() count?: number;
  @Input() showValue: boolean = true;

  get starsArray(): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    const fullStars = Math.floor(this.rating);
    const hasHalf = this.rating % 1 >= 0.4;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('full');
      } else if (i === fullStars && hasHalf) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }
}
