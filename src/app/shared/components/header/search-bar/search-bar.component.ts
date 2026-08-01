import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <div class="search-input-wrapper">
        <i class="ph ph-magnifying-glass search-icon"></i>
        <input
          type="text"
          [ngModel]="searchQuery()"
          (ngModelChange)="onQueryChange($event)"
          (focus)="isFocused.set(true)"
          (blur)="onBlur()"
          placeholder="Rechercher un produit (ex: Casque, Montre, Sac...)"
          class="search-input"
        />
        <button *ngIf="searchQuery()" (click)="clearSearch()" class="clear-btn" title="Effacer">
          <i class="ph ph-x"></i>
        </button>
      </div>

      <!-- Live Search Preview Results Dropdown -->
      <div *ngIf="isFocused() && searchQuery().trim().length > 0" class="search-results-dropdown animate-fade-in">
        <div *ngIf="searchResults().length === 0" class="no-results">
          <i class="ph ph-magnifying-glass-plus"></i>
          <p>Aucun produit trouvé pour "<strong>{{ searchQuery() }}</strong>"</p>
        </div>

        <div *ngIf="searchResults().length > 0" class="results-list">
          <div class="dropdown-header">
            <span>Résultats de recherche ({{ searchResults().length }})</span>
          </div>

          <div 
            *ngFor="let item of searchResults()" 
            class="result-item" 
            (mousedown)="selectProduct(item)"
          >
            <img [src]="item.images[0]" [alt]="item.name" class="result-img" />
            <div class="result-info">
              <h4 class="result-title">{{ item.name }}</h4>
              <span class="result-sub">{{ item.subtitle }}</span>
              <span class="result-price">{{ item.price | number:'1.2-2' }} €</span>
            </div>
            <button class="result-view-btn" (click)="$event.stopPropagation(); openQuickView(item)">
              <i class="ph ph-eye"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      position: relative;
      width: 100%;
      max-width: 480px;
    }
    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 14px;
      font-size: 1.2rem;
      color: var(--text-subtle);
    }
    .search-input {
      width: 100%;
      padding: 0.7rem 2.8rem 0.7rem 2.6rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-light);
      background: var(--bg-surface-secondary);
      color: var(--text-main);
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
      transition: all var(--transition-normal);
    }
    .search-input:focus {
      background: var(--bg-surface);
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    }
    .clear-btn {
      position: absolute;
      right: 12px;
      color: var(--text-subtle);
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color var(--transition-fast);
    }
    .clear-btn:hover {
      color: var(--accent-rose);
    }
    .search-results-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-xl);
      z-index: 100;
      max-height: 380px;
      overflow-y: auto;
    }
    .no-results {
      padding: 2rem 1rem;
      text-align: center;
      color: var(--text-muted);
    }
    .no-results i {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: var(--text-subtle);
    }
    .dropdown-header {
      padding: 0.6rem 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-subtle);
      border-bottom: 1px solid var(--border-light);
      background: var(--bg-primary);
    }
    .result-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-light);
      cursor: pointer;
      transition: background var(--transition-fast);
    }
    .result-item:hover {
      background: var(--accent-primary-light);
    }
    .result-img {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      border: 1px solid var(--border-light);
    }
    .result-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .result-title {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-main);
      margin: 0;
    }
    .result-sub {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .result-price {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--accent-primary);
      margin-top: 0.15rem;
    }
    .result-view-btn {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .result-view-btn:hover {
      background: var(--accent-primary);
      color: white;
    }
  `]
})
export class SearchBarComponent {
  searchQuery = signal<string>('');
  isFocused = signal<boolean>(false);

  searchResults = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return [];
    return this.productService.allProducts().filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 5);
  });

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  onQueryChange(val: string) {
    this.searchQuery.set(val);
    this.productService.updateFilter({ searchQuery: val });
  }

  clearSearch() {
    this.searchQuery.set('');
    this.productService.updateFilter({ searchQuery: '' });
  }

  onBlur() {
    setTimeout(() => this.isFocused.set(false), 200);
  }

  selectProduct(product: Product) {
    this.productService.setSelectedProduct(product);
    this.searchQuery.set('');
    this.isFocused.set(false);
  }

  openQuickView(product: Product) {
    this.cartService.openQuickView(product);
  }
}
