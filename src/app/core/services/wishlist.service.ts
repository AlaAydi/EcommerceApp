import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = signal<Product[]>([]);

  wishlist = this.wishlistItems.asReadonly();
  count = computed(() => this.wishlistItems().length);

  constructor(private notify: NotificationService) {
    this.loadFromStorage();
  }

  toggle(product: Product) {
    const exists = this.isWishlisted(product.id);
    if (exists) {
      this.wishlistItems.update(items => items.filter(p => p.id !== product.id));
      this.notify.info('Coup de cœur retiré', `${product.name} a été retiré de votre liste de souhaits.`);
    } else {
      this.wishlistItems.update(items => [...items, product]);
      this.notify.success('Coup de cœur ajouté ❤️', `${product.name} est enregistré dans vos favoris !`);
    }
    this.saveToStorage();
  }

  isWishlisted(productId: string): boolean {
    return this.wishlistItems().some(p => p.id === productId);
  }

  private saveToStorage() {
    try {
      localStorage.setItem('aura_wishlist', JSON.stringify(this.wishlistItems()));
    } catch (e) {}
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('aura_wishlist');
      if (stored) {
        this.wishlistItems.set(JSON.parse(stored));
      }
    } catch (e) {}
  }
}
