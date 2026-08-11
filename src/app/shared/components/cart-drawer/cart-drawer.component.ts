import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, CartItemComponent],
  animations: [
    trigger('drawerOverlay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('drawerSlide', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('350ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('280ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ],
  template: `
    <div *ngIf="isOpen()" class="drawer-overlay" @drawerOverlay (click)="close()">
      <aside class="drawer-panel" @drawerSlide (click)="$event.stopPropagation()">
        <div class="drawer-header">
          <div class="drawer-title">
            <i class="ph ph-shopping-bag"></i>
            <h3>Mon Panier</h3>
            <span class="drawer-count badge-chip badge-indigo">{{ itemCount() }}</span>
          </div>
          <button class="drawer-close" (click)="close()">
            <i class="ph ph-x"></i>
          </button>
        </div>

        <div class="shipping-progress-section" *ngIf="items().length > 0">
          <div class="shipping-info" *ngIf="amountNeeded() > 0">
            <i class="ph ph-truck"></i>
            <span>Plus que <strong>{{ amountNeeded() | number:'1.2-2' }} €</strong> pour la livraison offerte !</span>
          </div>
          <div class="shipping-info achieved" *ngIf="amountNeeded() === 0">
            <i class="ph ph-check-circle"></i>
            <span><strong>Félicitations !</strong> Votre livraison est offerte 🎉</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" [style.width.%]="freeShippingProgress()"></div>
          </div>
        </div>

        <div class="drawer-body">
          <div *ngIf="items().length === 0" class="empty-cart">
            <i class="ph ph-shopping-bag-open empty-icon"></i>
            <h4>Votre panier est vide</h4>
            <p>Découvrez nos produits d'exception et laissez-vous tenter !</p>
            <button class="btn-primary" (click)="close()">
              <i class="ph ph-storefront"></i> Explorer la Boutique
            </button>
          </div>

          <div *ngIf="items().length > 0" class="items-list">
            <app-cart-item
              *ngFor="let item of items(); let i = index"
              [item]="item"
              [index]="i"
              (remove)="removeItem(i)"
            ></app-cart-item>
          </div>
        </div>

        <div *ngIf="items().length > 0" class="drawer-footer">
          <div class="coupon-section">
            <div *ngIf="!activeCoupon()" class="coupon-input-row">
              <input
                type="text"
                [(ngModel)]="couponCode"
                placeholder="Code Promo (ex: AURA10)"
                class="coupon-input"
              />
              <button class="coupon-apply-btn" (click)="applyCoupon()">Appliquer</button>
            </div>
            <div *ngIf="activeCoupon()" class="coupon-active">
              <span class="badge-chip badge-emerald">
                <i class="ph ph-ticket"></i> {{ activeCoupon()!.code }} (-{{ activeCoupon()!.discountPercentage }}%)
              </span>
              <button class="coupon-remove" (click)="removeCoupon()">
                <i class="ph ph-x"></i>
              </button>
            </div>
          </div>

          <div class="totals-block">
            <div class="total-line">
              <span>Sous-total</span>
              <span>{{ subtotal() | number:'1.2-2' }} €</span>
            </div>
            <div *ngIf="discount() > 0" class="total-line discount-line">
              <span>Réduction</span>
              <span>- {{ discount() | number:'1.2-2' }} €</span>
            </div>
            <div class="total-line">
              <span>Livraison</span>
              <span>{{ shippingFee() === 0 ? 'Offerte' : (shippingFee() | number:'1.2-2') + ' €' }}</span>
            </div>
            <div class="total-line grand-total">
              <span>Total</span>
              <span>{{ grandTotal() | number:'1.2-2' }} €</span>
            </div>
          </div>

          <button class="btn-primary checkout-btn" (click)="goCheckout()">
            <i class="ph ph-lock-simple"></i>
            Passer la commande
          </button>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .drawer-overlay {
      position: fixed;
      inset: 0;
      z-index: 150;
      background: rgba(15, 23, 42, 0.3);
      backdrop-filter: blur(4px);
    }
    .drawer-panel {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 420px;
      max-width: 92vw;
      background: var(--bg-surface);
      box-shadow: -8px 0 32px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
    }

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }
    .drawer-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .drawer-title i {
      font-size: 1.3rem;
      color: var(--accent-primary);
    }
    .drawer-title h3 {
      font-size: 1.1rem;
      font-weight: 700;
    }
    .drawer-count {
      font-size: 0.72rem;
    }
    .drawer-close {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: var(--bg-surface-secondary);
      border: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: 1.1rem;
      transition: all var(--transition-fast);
    }
    .drawer-close:hover {
      background: var(--accent-rose-light);
      color: var(--accent-rose);
    }

    .shipping-progress-section {
      padding: 0.75rem 1.5rem;
      background: var(--bg-surface-secondary);
      border-bottom: 1px solid var(--border-light);
    }
    .shipping-info {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }
    .shipping-info i {
      font-size: 1.1rem;
      color: var(--accent-primary);
    }
    .shipping-info.achieved {
      color: var(--accent-emerald);
    }
    .shipping-info.achieved i {
      color: var(--accent-emerald);
    }
    .progress-bar-track {
      width: 100%;
      height: 6px;
      background: var(--bg-surface-tertiary);
      border-radius: var(--radius-full);
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--accent-gradient);
      border-radius: var(--radius-full);
      transition: width 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem 1.5rem;
    }
    .empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 3rem 1rem;
      gap: 0.75rem;
      color: var(--text-muted);
    }
    .empty-icon {
      font-size: 3rem;
      color: var(--text-subtle);
    }
    .empty-cart h4 {
      font-size: 1.1rem;
      color: var(--text-main);
    }

    .drawer-footer {
      padding: 1rem 1.5rem 1.25rem;
      border-top: 1px solid var(--border-light);
      background: var(--bg-surface);
    }
    .coupon-section {
      margin-bottom: 0.75rem;
    }
    .coupon-input-row {
      display: flex;
      gap: 0.5rem;
    }
    .coupon-input {
      flex: 1;
      padding: 0.55rem 0.85rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-light);
      background: var(--bg-surface-secondary);
      font-family: inherit;
      font-size: 0.85rem;
      outline: none;
    }
    .coupon-input:focus {
      border-color: var(--accent-primary);
    }
    .coupon-apply-btn {
      padding: 0.55rem 1rem;
      border-radius: var(--radius-sm);
      background: var(--accent-primary-light);
      color: var(--accent-primary);
      font-weight: 700;
      font-size: 0.82rem;
      border: 1px solid rgba(79, 70, 229, 0.2);
      transition: all var(--transition-fast);
    }
    .coupon-apply-btn:hover {
      background: var(--accent-primary);
      color: white;
    }
    .coupon-active {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .coupon-remove {
      width: 24px;
      height: 24px;
      border-radius: var(--radius-full);
      background: var(--bg-surface-secondary);
      color: var(--text-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      transition: all var(--transition-fast);
    }
    .coupon-remove:hover {
      background: var(--accent-rose-light);
      color: var(--accent-rose);
    }

    .totals-block {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }
    .total-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.88rem;
      color: var(--text-muted);
    }
    .discount-line {
      color: var(--accent-emerald);
      font-weight: 600;
    }
    .grand-total {
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-light);
      margin-top: 0.25rem;
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--text-main);
    }
    .checkout-btn {
      width: 100%;
      justify-content: center;
      padding: 0.9rem;
      font-size: 1rem;
    }
  `]
})
export class CartDrawerComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isOpen = this.cartService.isOpen;
  items = this.cartService.items;
  itemCount = this.cartService.itemCount;
  subtotal = this.cartService.subtotal;
  discount = this.cartService.discountAmount;
  shippingFee = this.cartService.shippingFee;
  grandTotal = this.cartService.grandTotal;
  freeShippingProgress = this.cartService.freeShippingProgress;
  amountNeeded = this.cartService.amountNeededForFreeShipping;
  activeCoupon = this.cartService.coupon;

  couponCode = '';
  showCheckout = false;

  close() {
    this.cartService.closeDrawer();
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
  }

  applyCoupon() {
    if (this.couponCode.trim()) {
      this.cartService.applyCoupon(this.couponCode);
      this.couponCode = '';
    }
  }

  removeCoupon() {
    this.cartService.removeCoupon();
  }

  goCheckout() {
    if (!this.authService.currentUser()) {
      this.close();
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/?checkout=1' } });
      return;
    }

    this.close();
    window.dispatchEvent(new CustomEvent('openCheckout'));
  }
}

