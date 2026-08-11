import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { CategoryNavComponent } from './category-nav/category-nav.component';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, CategoryNavComponent],
  template: `


    <header class="main-header" [class.is-scrolled]="isScrolled">
      <div class="container-xl header-inner">
        <!-- Logo -->
        <a href="javascript:void(0)" (click)="goHome()" class="brand-logo">
          <span class="serif-title brand-name">JO</span>
          <span class="brand-sub">LUXE</span>
          <span class="brand-dot"></span>
        </a>

        <!-- Search Bar -->
        <div class="header-search">
          <app-search-bar></app-search-bar>
        </div>

        <!-- Action Icons -->
        <div class="header-actions">
          <!-- Wishlist Heart Button -->
          <button class="action-btn" (click)="openWishlist()" title="Liste de souhaits">
            <i class="ph ph-heart action-icon"></i>
            <span *ngIf="wishlistCount() > 0" class="badge-count badge-heart">
              {{ wishlistCount() }}
            </span>
          </button>

          <!-- Cart Button -->
          <button class="action-btn cart-trigger" (click)="openCart()" title="Voir le panier">
            <i class="ph ph-shopping-bag action-icon"></i>
            <span *ngIf="cartCount() > 0" class="badge-count badge-cart pulse-badge-active">
              {{ cartCount() }}
            </span>
          </button>

          <!-- User Account Badge / Dropdown -->
          <div class="user-menu-wrapper">
            <button
              class="action-btn user-profile-badge"
              [class.user-logged]="isLoggedIn()"
              (click)="handleUserClick()"
              title="Mon Compte / Admin"
            >
              <i class="ph" [class.ph-user]="!isLoggedIn()" [class.ph-user-check]="isLoggedIn()"></i>
            </button>

            <!-- Logged In User Dropdown -->
            <div class="user-dropdown" *ngIf="showUserMenu" (click)="$event.stopPropagation()">
              <div class="user-info">
                <span class="user-name">{{ currentUser()?.displayName || 'Client Aura' }}</span>
                <span class="user-email">{{ currentUser()?.email }}</span>
              </div>
              <div class="dropdown-divider"></div>
              <button *ngIf="currentUser()?.role === 'admin'" class="dropdown-item admin-item" (click)="openAdmin(); showUserMenu = false;">
                <i class="ph ph-shield-check"></i> Espace Administration
              </button>
              <button class="dropdown-item" (click)="openOrders(); showUserMenu = false;">
                <i class="ph ph-receipt"></i> Mes Commandes
              </button>
              <button class="dropdown-item" (click)="openWishlist(); showUserMenu = false;">
                <i class="ph ph-heart"></i> Mes Favoris ({{ wishlistCount() }})
              </button>
              <button class="dropdown-item" (click)="openCart(); showUserMenu = false;">
                <i class="ph ph-shopping-bag"></i> Mon Panier ({{ cartCount() }})
              </button>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout-item" (click)="logout()">
                <i class="ph ph-sign-out"></i> Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Navbar -->
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

    .action-btn {
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

    .action-btn:hover {
      background: var(--accent-primary-light);
      color: var(--accent-primary);
      border-color: rgba(79, 70, 229, 0.3);
      transform: translateY(-2px);
    }

    .action-btn.user-logged {
      background: var(--accent-primary-light);
      color: var(--accent-primary);
      border-color: var(--accent-primary);
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

    .user-menu-wrapper {
      position: relative;
    }

    .user-dropdown {
      position: absolute;
      top: 120%;
      right: 0;
      width: 230px;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--border-light);
      padding: 0.75rem 0;
      z-index: 100;
      animation: fadeIn 0.2s ease;
    }

    .user-info {
      padding: 0.5rem 1rem;
      display: flex;
      flex-direction: column;
    }
    .user-name {
      font-weight: 800;
      font-size: 0.9rem;
      color: var(--text-main);
    }
    .user-email {
      font-size: 0.75rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .dropdown-divider {
      height: 1px;
      background: var(--border-light);
      margin: 0.5rem 0;
    }

    .dropdown-item {
      width: 100%;
      padding: 0.55rem 1rem;
      border: none;
      background: transparent;
      text-align: left;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .dropdown-item:hover {
      background: var(--bg-surface-secondary);
      color: var(--accent-primary);
    }

    .dropdown-item.admin-item {
      color: var(--accent-primary);
      font-weight: 700;
      background: var(--accent-primary-light);
    }

    .dropdown-item.logout-item {
      color: var(--accent-rose);
    }
    .dropdown-item.logout-item:hover {
      background: var(--accent-rose-light);
    }

    .header-categories-bar {
      border-top: 1px solid rgba(226, 232, 240, 0.6);
      background: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
      .ann-link, .header-search {
        display: none;
      }
      .header-inner {
        padding-top: 0.6rem;
        padding-bottom: 0.6rem;
      }
    }
  `]
})
export class HeaderComponent {
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private adminService = inject(AdminService);
  private notify = inject(NotificationService);
  private router = inject(Router);

  isScrolled = false;
  showUserMenu = false;

  cartCount = this.cartService.itemCount;
  wishlistCount = this.wishlistService.count;
  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.showUserMenu = false;
    }
  }

  openCart() {
    this.cartService.openDrawer();
  }

  openWishlist() {
    this.wishlistService.openDrawer();
  }

  handleUserClick() {
    if (this.isLoggedIn()) {
      this.showUserMenu = !this.showUserMenu;
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  openAdmin() {
    if (this.currentUser()?.role !== 'admin') {
      this.notify.warning('Accès refusé', 'Ce compte n\'a pas les droits administrateur.');
      return;
    }
    this.showUserMenu = false;
    this.adminService.setAdminView(true);
    this.router.navigateByUrl('/admin');
  }

  openOrders() {
    this.showUserMenu = false;
    this.router.navigateByUrl('/orders');
  }

  logout() {
    this.showUserMenu = false;
    this.adminService.setAdminView(false);
    this.authService.logout();
  }

  goHome() {
    this.adminService.setAdminView(false);
    this.productService.setSelectedProduct(null);
    this.productService.resetFilters();
    this.router.navigateByUrl('/');
  }
}
