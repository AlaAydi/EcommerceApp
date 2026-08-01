import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../core/models/cart.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-item-row">
      <div class="item-image-box">
        <img [src]="item.product.images[0]" [alt]="item.product.name" />
        <span *ngIf="item.product.discountPercentage" class="item-discount-badge">
          -{{ item.product.discountPercentage }}%
        </span>
      </div>

      <div class="item-details">
        <h4 class="item-name">{{ item.product.name }}</h4>
        <p class="item-variants">
          <span *ngIf="item.selectedColor">{{ item.selectedColor.name }}</span>
          <span *ngIf="item.selectedColor && item.selectedSize"> · </span>
          <span *ngIf="item.selectedSize">{{ item.selectedSize }}</span>
        </p>
        <div class="item-price-line">
          <span class="item-price">{{ item.product.price | number:'1.2-2' }} €</span>
          <span *ngIf="item.product.originalPrice" class="item-orig-price">
            {{ item.product.originalPrice | number:'1.2-2' }} €
          </span>
        </div>

        <div class="item-bottom-actions">
          <div class="qty-mini-selector">
            <button class="qty-mini-btn" (click)="decreaseQty()">
              <i class="ph ph-minus"></i>
            </button>
            <span class="qty-mini-val">{{ item.quantity }}</span>
            <button class="qty-mini-btn" (click)="increaseQty()">
              <i class="ph ph-plus"></i>
            </button>
          </div>

          <span class="item-subtotal">{{ item.product.price * item.quantity | number:'1.2-2' }} €</span>

          <button class="remove-btn" (click)="remove.emit()" title="Retirer">
            <i class="ph ph-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-item-row {
      display: flex;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border-light);
      animation: fadeIn 0.3s ease-out;
    }
    .item-image-box {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
      overflow: hidden;
      flex-shrink: 0;
      background: var(--bg-surface-secondary);
    }
    .item-image-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .item-discount-badge {
      position: absolute;
      top: 4px;
      left: 4px;
      font-size: 0.62rem;
      font-weight: 800;
      background: var(--accent-rose);
      color: white;
      padding: 0.1rem 0.35rem;
      border-radius: var(--radius-full);
    }
    .item-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .item-name {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.3;
    }
    .item-variants {
      font-size: 0.75rem;
      color: var(--text-subtle);
    }
    .item-price-line {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
    }
    .item-price {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .item-orig-price {
      font-size: 0.75rem;
      text-decoration: line-through;
      color: var(--text-subtle);
    }
    .item-bottom-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.35rem;
    }
    .qty-mini-selector {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-sm);
      overflow: hidden;
      background: var(--bg-surface-secondary);
    }
    .qty-mini-btn {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      color: var(--text-muted);
      transition: all var(--transition-fast);
    }
    .qty-mini-btn:hover {
      background: var(--accent-primary-light);
      color: var(--accent-primary);
    }
    .qty-mini-val {
      width: 24px;
      text-align: center;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .item-subtotal {
      margin-left: auto;
      font-size: 0.9rem;
      font-weight: 800;
      color: var(--accent-primary);
    }
    .remove-btn {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-full);
      background: var(--bg-surface-secondary);
      border: 1px solid var(--border-light);
      color: var(--text-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      transition: all var(--transition-fast);
    }
    .remove-btn:hover {
      background: var(--accent-rose-light);
      color: var(--accent-rose);
      border-color: var(--accent-rose);
    }
  `]
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Input({ required: true }) index!: number;
  @Output() remove = new EventEmitter<void>();

  constructor(private cartService: CartService) {}

  increaseQty() {
    this.cartService.updateQuantity(this.index, this.item.quantity + 1);
  }

  decreaseQty() {
    this.cartService.updateQuantity(this.index, this.item.quantity - 1);
  }
}
