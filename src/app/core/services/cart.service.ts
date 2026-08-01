import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Coupon } from '../models/cart.model';
import { Product } from '../models/product.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  private isDrawerOpen = signal<boolean>(false);
  private quickViewProduct = signal<Product | null>(null);
  private activeCoupon = signal<Coupon | null>(null);

  items = this.cartItems.asReadonly();
  isOpen = this.isDrawerOpen.asReadonly();
  quickProduct = this.quickViewProduct.asReadonly();
  coupon = this.activeCoupon.asReadonly();

  itemCount = computed(() => 
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  subtotal = computed(() => 
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  discountAmount = computed(() => {
    const coupon = this.activeCoupon();
    if (!coupon) return 0;
    return (this.subtotal() * coupon.discountPercentage) / 100;
  });

  freeShippingThreshold = 150; 

  freeShippingProgress = computed(() => {
    const sub = this.subtotal();
    if (sub >= this.freeShippingThreshold) return 100;
    return Math.min(100, Math.round((sub / this.freeShippingThreshold) * 100));
  });

  amountNeededForFreeShipping = computed(() => {
    const remaining = this.freeShippingThreshold - this.subtotal();
    return remaining > 0 ? remaining : 0;
  });

  shippingFee = computed(() => {
    if (this.cartItems().length === 0) return 0;
    return this.subtotal() >= this.freeShippingThreshold ? 0 : 9.90;
  });

  grandTotal = computed(() => {
    return Math.max(0, this.subtotal() - this.discountAmount() + this.shippingFee());
  });

  availableCoupons: Coupon[] = [
    { code: 'AURA10', discountPercentage: 10 },
    { code: 'LUXE20', discountPercentage: 20 },
    { code: 'VIP30', discountPercentage: 30 }
  ];

  constructor(private notify: NotificationService) {
    this.loadCart();
  }

  addToCart(product: Product, quantity = 1, selectedColor?: { name: string; hex: string }, selectedSize?: string) {
    this.cartItems.update(current => {
      const existingIndex = current.findIndex(item => 
        item.product.id === product.id && 
        item.selectedColor?.name === selectedColor?.name && 
        item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }

      return [...current, { product, quantity, selectedColor, selectedSize }];
    });

    this.notify.success('Ajouté au panier ! 🛍️', `${product.name} (${quantity}) a rejoint votre panier.`);
    this.saveCart();
  }

  updateQuantity(index: number, newQty: number) {
    if (newQty <= 0) {
      this.removeItem(index);
      return;
    }
    this.cartItems.update(current => {
      const updated = [...current];
      updated[index] = { ...updated[index], quantity: newQty };
      return updated;
    });
    this.saveCart();
  }

  removeItem(index: number) {
    const item = this.cartItems()[index];
    this.cartItems.update(current => current.filter((_, i) => i !== index));
    if (item) {
      this.notify.info('Produit retiré', `${item.product.name} à été retiré du panier.`);
    }
    this.saveCart();
  }

  clearCart() {
    this.cartItems.set([]);
    this.activeCoupon.set(null);
    this.saveCart();
  }

  applyCoupon(code: string): boolean {
    const cleanCode = code.trim().toUpperCase();
    const found = this.availableCoupons.find(c => c.code === cleanCode);

    if (found) {
      this.activeCoupon.set(found);
      this.notify.success('Code Promo Appliqué ! 🎉', `Remise de ${found.discountPercentage}% activée sur votre commande.`);
      return true;
    } else {
      this.notify.error('Code non valide', `Le code promo "${code}" n'existe pas ou a expiré.`);
      return false;
    }
  }

  removeCoupon() {
    this.activeCoupon.set(null);
    this.notify.info('Code retiré', 'La réduction a été supprimée.');
  }

  openDrawer() {
    this.isDrawerOpen.set(true);
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
  }

  toggleDrawer() {
    this.isDrawerOpen.update(state => !state);
  }

  openQuickView(product: Product) {
    this.quickViewProduct.set(product);
  }

  closeQuickView() {
    this.quickViewProduct.set(null);
  }

  private saveCart() {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(this.cartItems()));
    } catch (e) {}
  }

  private loadCart() {
    try {
      const stored = localStorage.getItem('aura_cart');
      if (stored) {
        this.cartItems.set(JSON.parse(stored));
      }
    } catch (e) {}
  }
}
