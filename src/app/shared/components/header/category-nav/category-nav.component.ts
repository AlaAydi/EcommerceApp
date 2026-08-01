import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { CategoryType } from '../../../../core/models/product.model';

@Component({
  selector: 'app-category-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="category-nav-scroll">
      <div class="category-pills">
        <button
          *ngFor="let cat of categories()"
          (click)="selectCategory(cat.id)"
          class="cat-pill"
          [class.active]="currentCategory() === cat.id"
        >
          <i class="ph {{ cat.icon }} cat-icon"></i>
          <span>{{ cat.name }}</span>
          <span class="cat-count">{{ cat.count }}</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .category-nav-scroll {
      width: 100%;
      overflow-x: auto;
      padding: 0.5rem 0;
      scrollbar-width: none;
    }
    .category-nav-scroll::-webkit-scrollbar {
      display: none;
    }
    .category-pills {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      white-space: nowrap;
    }
    .cat-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.1rem;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      color: var(--text-muted);
      font-size: 0.85rem;
      font-weight: 600;
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-xs);
    }
    .cat-pill:hover {
      background: var(--bg-surface-secondary);
      border-color: var(--border-strong);
      color: var(--text-main);
      transform: translateY(-1px);
    }
    .cat-pill.active {
      background: var(--accent-primary-light);
      border-color: rgba(79, 70, 229, 0.4);
      color: var(--accent-primary);
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15);
    }
    .cat-icon {
      font-size: 1.1rem;
    }
    .cat-count {
      background: rgba(15, 23, 42, 0.06);
      padding: 0.1rem 0.4rem;
      border-radius: var(--radius-full);
      font-size: 0.72rem;
      font-weight: 700;
    }
    .cat-pill.active .cat-count {
      background: var(--accent-primary);
      color: white;
    }
  `]
})
export class CategoryNavComponent {
  private productService = inject(ProductService);

  categories = this.productService.categories;
  currentCategory = () => this.productService.filters().category;

  selectCategory(id: string) {
    this.productService.updateFilter({ category: id as CategoryType });
  }
}

