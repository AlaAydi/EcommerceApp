import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  template: `
    <div 
      class="product-card glass-card" 
      (mouseenter)="isHovered = true" 
      (mouseleave)="isHovered = false"
      (click)="viewDetails()"
    >
      <!-- Card Image Thumbnail Container -->
      <div class="card-image-wrapper">
        <img 
          [src]="isHovered && product.images.length > 1 ? product.images[1] : product.images[0]" 
          [alt]="product.name" 
          class="card-image"
        />

        <!-- Badges (New, Discount, BestSeller) -->
        <div class="card-badges">
          <span *ngIf="product.discountPercentage" class="badge-chip badge-rose">
            -{{ product.discountPercentage }}%
          </span>
          <span *ngIf="product.isNew && !product.discountPercentage" class="badge-chip badge-indigo">
            Nouveau
          </span>
          <span *ngIf="product.isBestSeller && !product.discountPercentage && !product.isNew" class="badge-chip badge-emerald">
            Best Seller
          </span>
        </div>

        <!-- Wishlist Button -->
        <button 
          class="wishlist-btn" 
          [class.active]="isWishlisted()" 
          (click)="$event.stopPropagation(); toggleWishlist()"
          title="Ajouter aux favoris"
        >
          <i class="ph" [class.ph-heart-fill]="isWishlisted()" [class.ph-heart]="!isWishlisted()"></i>
        </button>

        <!-- Hover Overlay Quick View Trigger -->
        <div class="card-overlay" [class.show]="isHovered">
          <button class="btn-quick-view" (click)="$event.stopPropagation(); openQuickView()">
            <i class="ph ph-eye"></i> Aperçu Rapide
          </button>
        </div>
      </div>

      <!-- Card Body Content -->
      <div class="card-body">
        <div class="card-category">{{ product.category | uppercase }}</div>
        
        <h3 class="card-title">{{ product.name }}</h3>
        <p class="card-subtitle">{{ product.subtitle }}</p>

        <!-- Star Rating -->
        <div class="card-rating">
          <app-star-rating [rating]="product.rating" [count]="product.reviewCount"></app-star-rating>
        </div>

        <!-- Price & Add to Cart -->
        <div class="card-footer">
          <div class="price-block">
            <span class="current-price">{{ product.price | number:'1.2-2' }} €</span>
            <span *ngIf="product.originalPrice" class="original-price">
              {{ product.originalPrice | number:'1.2-2' }} €
            </span>
          </div>

          <button 
            class="add-cart-btn" 
            (click)="$event.stopPropagation(); addToCart()" 
            title="Ajouter au Panier"
          >
            <i class="ph ph-shopping-bag-open"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      overflow: hidden;
      cursor: pointer;
      transition: all var(--transition-bounce);
    }
    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
      border-color: rgba(79, 70, 229, 0.25);
    }

    .card-image-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      background: var(--bg-surface-secondary);
    }
    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .product-card:hover .card-image {
      transform: scale(1.06);
    }

    .card-badges {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 5;
    }

    .wishlist-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(8px);
      border: 1px solid var(--border-light);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      z-index: 5;
      transition: all var(--transition-normal);
    }
    .wishlist-btn:hover {
      background: white;
      color: var(--accent-rose);
      transform: scale(1.1);
    }
    .wishlist-btn.active {
      background: var(--accent-rose-light);
      color: var(--accent-rose);
      border-color: var(--accent-rose);
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.2);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--transition-normal);
      z-index: 4;
    }
    .card-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }

    .btn-quick-view {
      background: white;
      color: var(--text-main);
      padding: 0.6rem 1.2rem;
      border-radius: var(--radius-full);
      font-weight: 700;
      font-size: 0.85rem;
      box-shadow: var(--shadow-md);
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transform: translateY(10px);
      transition: all var(--transition-normal);
    }
    .card-overlay.show .btn-quick-view {
      transform: translateY(0);
    }
    .btn-quick-view:hover {
      background: var(--accent-primary);
      color: white;
    }

    .card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .card-category {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: var(--accent-primary);
      margin-bottom: 0.35rem;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 0.25rem;
      line-height: 1.3;
    }

    .card-subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-rating {
      margin-bottom: 1rem;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-light);
    }

    .price-block {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }
    .current-price {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-main);
    }
    .original-price {
      font-size: 0.85rem;
      text-decoration: line-through;
      color: var(--text-subtle);
    }

    .add-cart-btn {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: var(--accent-primary-light);
      color: var(--accent-primary);
      border: 1px solid rgba(79, 70, 229, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
      transition: all var(--transition-bounce);
    }
    .add-cart-btn:hover {
      background: var(--accent-gradient);
      color: white;
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  isHovered = false;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private productService: ProductService
  ) {}

  isWishlisted(): boolean {
    return this.wishlistService.isWishlisted(this.product.id);
  }

  toggleWishlist() {
    this.wishlistService.toggle(this.product);
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }

  openQuickView() {
    this.cartService.openQuickView(this.product);
  }

  viewDetails() {
    this.productService.setSelectedProduct(this.product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
