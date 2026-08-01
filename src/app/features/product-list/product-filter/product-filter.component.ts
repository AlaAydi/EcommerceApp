import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryType } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-panel glass-card">
      <div class="filter-header">
        <div class="filter-title">
          <i class="ph ph-sliders-horizontal"></i>
          <span>Filtres de recherche</span>
        </div>
        <button class="reset-btn" (click)="resetAll()" title="Réinitialiser les filtres">
          <i class="ph ph-arrow-counter-clockwise"></i> Réinitialiser
        </button>
      </div>

      <div class="filter-sections">
        <div class="filter-group">
          <label class="group-label">
            <span>Prix Maximum</span>
            <strong class="price-val">{{ maxPrice() }} €</strong>
          </label>
          <input 
            type="range" 
            min="50" 
            max="600" 
            step="10" 
            [ngModel]="maxPrice()"
            (ngModelChange)="onPriceChange($event)"
            class="range-slider"
          />
          <div class="range-labels">
            <span>50 €</span>
            <span>600 €</span>
          </div>
        </div>

        <div class="filter-group">
          <label class="group-label">Note Minimale</label>
          <div class="rating-pills">
            <button 
              *ngFor="let r of [0, 4, 4.5, 4.8]" 
              class="rating-pill"
              [class.active]="minRating() === r"
              (click)="onRatingChange(r)"
            >
              <i class="ph ph-star-fill" *ngIf="r > 0"></i>
              <span>{{ r === 0 ? 'Toutes' : r + '+' }}</span>
            </button>
          </div>
        </div>

        <!-- Sort By Dropdown -->
        <div class="filter-group">
          <label class="group-label">Trier par</label>
          <select 
            [ngModel]="sortBy()" 
            (ngModelChange)="onSortChange($event)" 
            class="sort-select"
          >
            <option value="featured">✨ En Vedette (Meilleures ventes)</option>
            <option value="price-low">📉 Prix : du + bas au + haut</option>
            <option value="price-high">📈 Prix : du + haut au + bas</option>
            <option value="rating">⭐ Mieux notés</option>
            <option value="newest">🔥 Nouveautés</option>
          </select>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-panel {
      padding: 1.25rem 1.5rem;
      margin-bottom: 2rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
    }
    .filter-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-light);
    }
    .filter-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 1rem;
      color: var(--text-main);
    }
    .filter-title i {
      color: var(--accent-primary);
      font-size: 1.2rem;
    }
    .reset-btn {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.3rem 0.7rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-light);
      background: var(--bg-surface-secondary);
      transition: all var(--transition-normal);
    }
    .reset-btn:hover {
      background: var(--accent-rose-light);
      color: var(--accent-rose);
      border-color: var(--accent-rose);
    }

    .filter-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .group-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-muted);
    }

    .price-val {
      color: var(--accent-primary);
      font-size: 0.95rem;
    }

    .range-slider {
      width: 100%;
      accent-color: var(--accent-primary);
      cursor: pointer;
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-subtle);
    }

    .rating-pills {
      display: flex;
      gap: 0.5rem;
    }

    .rating-pill {
      flex: 1;
      padding: 0.45rem 0.5rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
      background: var(--bg-surface-secondary);
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      transition: all var(--transition-normal);
    }

    .rating-pill i {
      color: var(--accent-amber);
    }

    .rating-pill.active {
      background: var(--accent-primary-light);
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }

    .sort-select {
      width: 100%;
      padding: 0.6rem 1rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
      background: var(--bg-surface-secondary);
      color: var(--text-main);
      font-family: inherit;
      font-size: 0.88rem;
      font-weight: 600;
      outline: none;
      cursor: pointer;
      transition: border-color var(--transition-normal);
    }

    .sort-select:focus {
      border-color: var(--accent-primary);
    }
  `]
})
export class ProductFilterComponent {
  private productService = inject(ProductService);

  maxPrice = () => this.productService.filters().maxPrice;
  minRating = () => this.productService.filters().minRating;
  sortBy = () => this.productService.filters().sortBy;

  onPriceChange(val: number) {
    this.productService.updateFilter({ maxPrice: val });
  }

  onRatingChange(val: number) {
    this.productService.updateFilter({ minRating: val });
  }

  onSortChange(val: any) {
    this.productService.updateFilter({ sortBy: val });
  }

  resetAll() {
    this.productService.resetFilters();
  }
}

