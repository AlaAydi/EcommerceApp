import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { CategoryNavComponent } from './category-nav/category-nav.component';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, CategoryNavComponent],
  template: `
    <div class="announcement-bar">
      <div class="container-xl ann-content">
        <span class="ann-badge">Nouveau</span>
        <p class="ann-text">⚡ Édition Spéciale Light Lux : <strong>-10% extra</strong> avec le code <span class="coupon-code">AURA10</span></p>
        <span class="ann-link">Livraison offerte dès 150€</span>
      </div>
    </div>

    <header class="main-header" [class.is-scrolled]="isScrolled">
      <div class="container-xl header-inner">
        <a href="javascript:void(0)" (click)="goHome()" class="brand-logo">
          <span class="serif-title brand-name">JO</span>
          <span class="brand-sub">LUXE</span>
          <span class="brand-dot"></span>
        </a>

        <div class="header-search">
          <app-search-bar></app-search-bar>
        </div>

        <div class="header-actions">
          <button class="action-btn" (click)="openWishlist()" title="Liste de souhaits">
            <i class="ph ph-heart action-icon"></i>
            <span *ngIf="wishlistCount() > 0" class="badge-count badge-heart">
              {{ wishlistCount() }}
            </span>
          </button>

          <button class="action-btn cart-trigger" (click)="openCart()" title="Voir le panier">
            <i class="ph ph-shopping-bag action-icon"></i>
            <span *ngIf="cartCount() > 0" class="badge-count badge-cart pulse-badge-active">
              {{ cartCount() }}
            </span>
          </button>

          <div class="user-profile-badge" title="Mon Compte">
            <i class="ph ph-user action-icon"></i>
          </div>
        </div>
      </div>

      <div class="header-categories-bar">
        <div class="container-xl">
          <app-category-nav></app-category-nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .announcement-bar {
      background: var(--accent-gradient);
      color: white;
      font-size: 0.8rem;
      padding: 0.45rem 0;
    }
    .ann-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .ann-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-full);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .ann-text {
      margin: 0;
    }
    .coupon-code {
      background: rgba(255, 255, 255, 0.25);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      font-weight: 800;
      letter-spacing: 0.05em;
    }
    .ann-link {
      font-weight: 600;
      opacity: 0.9;
    }
    
    .main-header {
      position: sticky;
      top: 0;
      z-index: 90;
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-light);
      transition: all var(--transition-normal);
    }
    .main-header.is-scrolled {
      box-shadow: var(--shadow-md);
      background: rgba(255, 255, 255, 0.92);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      padding-top: 0.85rem;
      padding-bottom: 0.85rem;
    }

    .brand-logo {
      display: inline-flex;
      align-items: baseline;
      gap: 0.25rem;
      position: relative;
    }
    .brand-name {
      font-size: 1.65rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: var(--text-main);
    }
    .brand-sub {
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.25em;
      color: var(--accent-primary);
    }
    .brand-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent-emerald);
      display: inline-block;
      margin-left: 2px;
    }

    .header-search {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .action-btn, .user-profile-badge {
      position: relative;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-main);
      box-shadow: var(--shadow-xs);
      transition: all var(--transition-normal);
      cursor: pointer;
    }

    .action-btn:hover, .user-profile-badge:hover {
      background: var(--accent-primary-light);
      color: var(--accent-primary);
      border-color: rgba(79, 70, 229, 0.3);
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 1.35rem;
    }

    .badge-count {
      position: absolute;
      top: -3px;
      right: -3px;
      min-width: 20px;
      height: 20px;
      border-radius: var(--radius-full);
      font-size: 0.7rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      border: 2px solid var(--bg-surface);
      color: white;
    }

    .badge-cart {
      background: var(--accent-gradient);
    }

    .badge-heart {
      background: var(--accent-rose);
    }

    .header-categories-bar {
      border-top: 1px solid rgba(226, 232, 240, 0.6);
      background: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
      .ann-link, .header-search {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private productService = inject(ProductService);

  isScrolled = false;

  cartCount = this.cartService.itemCount;
  wishlistCount = this.wishlistService.count;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  openCart() {
    this.cartService.openDrawer();
  }

  openWishlist() {
  }

  goHome() {
    this.productService.setSelectedProduct(null);
    this.productService.resetFilters();
  }
}
