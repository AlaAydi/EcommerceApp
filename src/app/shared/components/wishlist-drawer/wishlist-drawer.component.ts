import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-wishlist-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Overlay Backdrop -->
    <div 
      class="drawer-backdrop" 
      *ngIf="isOpen()" 
      (click)="close()"
    ></div>

    <!-- Slide-over Drawer -->
    <aside class="wishlist-drawer glass-drawer" [class.open]="isOpen()">
      <!-- Header -->
      <div class="drawer-header">
        <div class="header-title">
          <i class="ph ph-heart-fill heart-icon"></i>
          <h3>Mes Favoris ({{ count() }})</h3>
        </div>
        <button class="close-btn" (click)="close()" title="Fermer">
          <i class="ph ph-x"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="drawer-body">
        <!-- Empty State -->
        <div class="empty-state" *ngIf="count() === 0">
          <div class="empty-icon-wrapper">
            <i class="ph ph-heart-break"></i>
          </div>
          <h4>Votre liste de favoris est vide</h4>
          <p>Explorez nos produits d'exception et cliquez sur le cœur pour les sauvegarder ici.</p>
          <button class="btn-primary" (click)="close()">
            Découvrir la collection
          </button>
        </div>

        <!-- Wishlist Item List -->
        <div class="wishlist-items" *ngIf="count() > 0">
          <div class="wishlist-item" *ngFor="let item of wishlist()">
            <img [src]="item.images[0]" [alt]="item.name" class="item-img" />
            
            <div class="item-details">
              <span class="item-category">{{ item.category | uppercase }}</span>
              <h4 class="item-name">{{ item.name }}</h4>
              <div class="item-price">{{ item.price | number:'1.2-2' }} €</div>
            </div>

            <div class="item-actions">
              <!-- Add single favorited item to cart -->
              <button 
                class="btn-action add-cart" 
                (click)="addToCart(item)" 
                title="Ajouter au Panier"
              >
                <i class="ph ph-shopping-bag-open"></i>
                <span class="action-label">Panier</span>
              </button>
              
              <!-- Remove from wishlist -->
              <button 
                class="btn-action remove" 
                (click)="removeItem(item)" 
                title="Retirer des favoris"
              >
                <i class="ph ph-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="drawer-footer" *ngIf="count() > 0">
        <button class="btn-primary btn-block add-all-btn" (click)="addAllToCart()">
          <i class="ph ph-shopping-bag"></i>
          Tout ajouter au Panier ({{ count() }})
        </button>
        <button class="btn-secondary btn-block clear-btn" (click)="clearAll()">
          Vider les favoris
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed;
      inset: 0;
      z-index: 990;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      animation: fadeIn 0.3s ease;
    }

    .wishlist-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      max-width: 440px;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(20px);
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .wishlist-drawer.open {
      transform: translateX(0);
    }

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }
    .header-title {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .heart-icon {
      color: var(--accent-rose);
      font-size: 1.35rem;
    }
    .header-title h3 {
      font-size: 1.15rem;
      font-weight: 800;
      margin: 0;
      color: var(--text-main);
    }

    .close-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--bg-surface-secondary);
      border: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }
    .close-btn:hover {
      background: var(--accent-rose-light);
      color: var(--accent-rose);
    }

    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      padding: 2rem 1rem;
    }
    .empty-icon-wrapper {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--accent-rose-light);
      color: var(--accent-rose);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      margin-bottom: 1.25rem;
    }
    .empty-state h4 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .empty-state p {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    .wishlist-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .wishlist-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem;
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-xs);
      transition: all 0.2s;
    }
    .wishlist-item:hover {
      box-shadow: var(--shadow-md);
      border-color: rgba(79, 70, 229, 0.2);
    }

    .item-img {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: var(--radius-md);
    }

    .item-details {
      flex: 1;
    }
    .item-category {
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--accent-primary);
      letter-spacing: 0.05em;
    }
    .item-name {
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0.15rem 0;
      line-height: 1.2;
    }
    .item-price {
      font-size: 0.95rem;
      font-weight: 800;
      color: var(--text-main);
    }

    .item-actions {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .btn-action {
      border: none;
      border-radius: var(--radius-md);
      padding: 0.4rem 0.65rem;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      transition: all 0.2s;
    }
    .btn-action.add-cart {
      background: var(--accent-primary-light);
      color: var(--accent-primary);
    }
    .btn-action.add-cart:hover {
      background: var(--accent-primary);
      color: white;
    }

    .btn-action.remove {
      background: var(--bg-surface-secondary);
      color: var(--text-muted);
    }
    .btn-action.remove:hover {
      background: var(--accent-rose-light);
      color: var(--accent-rose);
    }

    .drawer-footer {
      padding: 1.25rem 1.5rem;
      border-top: 1px solid var(--border-light);
      background: white;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .add-all-btn {
      padding: 0.85rem;
      border-radius: var(--radius-full);
      font-weight: 700;
      font-size: 0.92rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: var(--accent-gradient);
      color: white;
      border: none;
      box-shadow: var(--shadow-md);
      cursor: pointer;
      transition: all 0.2s;
    }
    .add-all-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .clear-btn {
      padding: 0.6rem;
      background: transparent;
      border: 1px dashed var(--border-medium);
      border-radius: var(--radius-full);
      color: var(--text-muted);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
    }
    .clear-btn:hover {
      color: var(--accent-rose);
      border-color: var(--accent-rose);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class WishlistDrawerComponent {
  private wishlistService = inject(WishlistService);

  isOpen = this.wishlistService.isDrawerOpen;
  wishlist = this.wishlistService.wishlist;
  count = this.wishlistService.count;

  close() {
    this.wishlistService.closeDrawer();
  }

  addToCart(product: Product) {
    this.wishlistService.addToCart(product);
  }

  removeItem(product: Product) {
    this.wishlistService.toggle(product);
  }

  addAllToCart() {
    this.wishlistService.addAllToCart();
  }

  clearAll() {
    this.wishlistService.clearWishlist();
  }
}
