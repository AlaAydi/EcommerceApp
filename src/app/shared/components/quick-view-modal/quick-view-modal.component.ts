import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ProductService } from '../../../core/services/product.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Product } from '../../../core/models/product.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-quick-view-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  animations: [
    trigger('overlayAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('modalAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.92) translateY(20px)' }),
        animate('300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95) translateY(10px)' }))
      ])
    ])
  ],
  template: `
    <div *ngIf="product()" class="modal-overlay" @overlayAnim (click)="close()">
      <div class="modal-content glass-card" @modalAnim (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button class="modal-close-btn" (click)="close()">
          <i class="ph ph-x"></i>
        </button>

        <div class="modal-grid">
          <!-- Left: Image Gallery -->
          <div class="modal-gallery">
            <div class="main-image-container">
              <img [src]="selectedImage" [alt]="product()!.name" class="main-image" />
              <div *ngIf="product()!.discountPercentage" class="qv-badge badge-chip badge-rose">
                -{{ product()!.discountPercentage }}%
              </div>
            </div>
            <div class="thumb-row" *ngIf="product()!.images.length > 1">
              <button 
                *ngFor="let img of product()!.images; let i = index"
                class="thumb-btn"
                [class.active]="selectedImage === img"
                (click)="selectedImage = img"
              >
                <img [src]="img" [alt]="'Image ' + (i+1)" />
              </button>
            </div>
          </div>

          <!-- Right: Product Info -->
          <div class="modal-info">
            <span class="qv-category">{{ product()!.category | uppercase }}</span>
            <h2 class="qv-name serif-title">{{ product()!.name }}</h2>
            <p class="qv-subtitle">{{ product()!.subtitle }}</p>

            <app-star-rating [rating]="product()!.rating" [count]="product()!.reviewCount"></app-star-rating>

            <div class="qv-price-block">
              <span class="qv-price">{{ product()!.price | number:'1.2-2' }} €</span>
              <span *ngIf="product()!.originalPrice" class="qv-orig-price">
                {{ product()!.originalPrice | number:'1.2-2' }} €
              </span>
              <span *ngIf="product()!.discountPercentage" class="qv-saving">
                Économisez {{ (product()!.originalPrice! - product()!.price) | number:'1.2-2' }} €
              </span>
            </div>

            <p class="qv-description">{{ product()!.description }}</p>

            <!-- Color Picker -->
            <div *ngIf="product()!.colors && product()!.colors!.length > 0" class="qv-option-group">
              <label class="option-label">Couleur : <strong>{{ selectedColor?.name || 'Non sélectionnée' }}</strong></label>
              <div class="color-options">
                <button 
                  *ngFor="let c of product()!.colors" 
                  class="color-swatch"
                  [class.selected]="selectedColor?.hex === c.hex"
                  [style.background]="c.hex"
                  [title]="c.name"
                  (click)="selectedColor = c"
                >
                  <i *ngIf="selectedColor?.hex === c.hex" class="ph ph-check check-icon"></i>
                </button>
              </div>
            </div>

            <!-- Size Picker -->
            <div *ngIf="product()!.sizes && product()!.sizes!.length > 0" class="qv-option-group">
              <label class="option-label">Taille</label>
              <div class="size-options">
                <button 
                  *ngFor="let s of product()!.sizes" 
                  class="size-btn"
                  [class.selected]="selectedSize === s"
                  (click)="selectedSize = s"
                >
                  {{ s }}
                </button>
              </div>
            </div>

            <!-- Quantity + Add to Cart -->
            <div class="qv-actions">
              <div class="qty-selector">
                <button class="qty-btn" (click)="quantity > 1 && quantity = quantity - 1">
                  <i class="ph ph-minus"></i>
                </button>
                <span class="qty-val">{{ quantity }}</span>
                <button class="qty-btn" (click)="quantity = quantity + 1">
                  <i class="ph ph-plus"></i>
                </button>
              </div>

              <button class="btn-primary add-btn" (click)="addToCart()">
                <i class="ph ph-shopping-bag-open"></i>
                Ajouter au Panier
              </button>

              <button 
                class="btn-icon wishlist-qv"
                [class.active]="isWishlisted()"
                (click)="toggleWishlist()"
              >
                <i class="ph" [class.ph-heart-fill]="isWishlisted()" [class.ph-heart]="!isWishlisted()"></i>
              </button>
            </div>

            <button class="view-details-link" (click)="viewFull()">
              <i class="ph ph-arrow-right"></i>
              Voir la fiche produit complète
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 200;
      background: rgba(15, 23, 42, 0.35);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .modal-content {
      position: relative;
      max-width: 920px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      padding: 2rem;
    }
    .modal-close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 38px;
      height: 38px;
      border-radius: var(--radius-full);
      background: var(--bg-surface-secondary);
      border: 1px solid var(--border-light);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      z-index: 5;
      transition: all var(--transition-fast);
    }
    .modal-close-btn:hover {
      background: var(--accent-rose-light);
      color: var(--accent-rose);
    }

    .modal-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .modal-gallery {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .main-image-container {
      position: relative;
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--bg-surface-secondary);
      aspect-ratio: 1;
    }
    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .main-image:hover {
      transform: scale(1.05);
    }
    .qv-badge {
      position: absolute;
      top: 12px;
      left: 12px;
    }
    .thumb-row {
      display: flex;
      gap: 0.5rem;
    }
    .thumb-btn {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      border: 2px solid var(--border-light);
      padding: 0;
      background: none;
      cursor: pointer;
      transition: border-color var(--transition-fast);
    }
    .thumb-btn.active {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
    }
    .thumb-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .modal-info {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .qv-category {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: var(--accent-primary);
    }
    .qv-name {
      font-size: 1.55rem;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.3;
    }
    .qv-subtitle {
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .qv-price-block {
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
      flex-wrap: wrap;
      margin-top: 0.3rem;
    }
    .qv-price {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-main);
    }
    .qv-orig-price {
      font-size: 1rem;
      text-decoration: line-through;
      color: var(--text-subtle);
    }
    .qv-saving {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--accent-emerald);
      background: var(--accent-emerald-light);
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
    }
    .qv-description {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .qv-option-group {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }
    .option-label {
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .color-options {
      display: flex;
      gap: 0.5rem;
    }
    .color-swatch {
      position: relative;
      width: 34px;
      height: 34px;
      border-radius: var(--radius-full);
      border: 2px solid var(--border-light);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .color-swatch.selected {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }
    .check-icon {
      color: var(--text-main);
      font-size: 0.75rem;
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .size-options {
      display: flex;
      gap: 0.45rem;
    }
    .size-btn {
      padding: 0.4rem 0.9rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-light);
      background: var(--bg-surface-secondary);
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);
      transition: all var(--transition-normal);
    }
    .size-btn.selected {
      background: var(--accent-primary-light);
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }

    .qv-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .qty-selector {
      display: flex;
      align-items: center;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--bg-surface-secondary);
    }
    .qty-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      color: var(--text-muted);
      transition: all var(--transition-fast);
    }
    .qty-btn:hover {
      background: var(--accent-primary-light);
      color: var(--accent-primary);
    }
    .qty-val {
      width: 36px;
      text-align: center;
      font-size: 0.95rem;
      font-weight: 700;
    }
    .add-btn {
      flex: 1;
    }
    .wishlist-qv.active {
      background: var(--accent-rose-light);
      color: var(--accent-rose);
      border-color: var(--accent-rose);
    }

    .view-details-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--accent-primary);
      margin-top: 0.25rem;
      transition: gap var(--transition-normal);
    }
    .view-details-link:hover {
      gap: 0.8rem;
    }

    @media (max-width: 768px) {
      .modal-grid {
        grid-template-columns: 1fr;
      }
      .modal-content {
        padding: 1.25rem;
      }
    }
  `]
})
export class QuickViewModalComponent {
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private productService = inject(ProductService);

  product = this.cartService.quickProduct;
  selectedImage = '';
  selectedColor: { name: string; hex: string } | null = null;
  selectedSize: string | null = null;
  quantity = 1;

  ngDoCheck() {
    const p = this.product();
    if (p && !this.selectedImage) {
      this.selectedImage = p.images[0];
      this.selectedColor = p.colors?.[0] || null;
      this.selectedSize = p.sizes?.[0] || null;
    }
    if (!p) {
      this.selectedImage = '';
      this.selectedColor = null;
      this.selectedSize = null;
      this.quantity = 1;
    }
  }

  close() {
    this.cartService.closeQuickView();
  }

  addToCart() {
    const p = this.product();
    if (!p) return;
    this.cartService.addToCart(p, this.quantity, this.selectedColor ?? undefined, this.selectedSize ?? undefined);
    this.close();
  }

  isWishlisted(): boolean {
    const p = this.product();
    return p ? this.wishlistService.isWishlisted(p.id) : false;
  }

  toggleWishlist() {
    const p = this.product();
    if (p) this.wishlistService.toggle(p);
  }

  viewFull() {
    const p = this.product();
    if (p) {
      this.productService.setSelectedProduct(p);
      this.close();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

