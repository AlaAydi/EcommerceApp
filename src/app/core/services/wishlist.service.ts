import { Injectable, signal, computed, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { NotificationService } from './notification.service';
import { CartService } from './cart.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = signal<Product[]>([]);
  private isDrawerOpenSignal = signal<boolean>(false);

  wishlist = this.wishlistItems.asReadonly();
  count = computed(() => this.wishlistItems().length);
  isDrawerOpen = this.isDrawerOpenSignal.asReadonly();

  private notify = inject(NotificationService);
  private cartService = inject(CartService);
  private firebaseService = inject(FirebaseService);

  constructor() {
    this.loadFromStorage();
  }

  openDrawer() {
    this.isDrawerOpenSignal.set(true);
  }

  closeDrawer() {
    this.isDrawerOpenSignal.set(false);
  }

  toggleDrawer() {
    this.isDrawerOpenSignal.update(open => !open);
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
    this.saveAndSync();
  }

  isWishlisted(productId: string): boolean {
    return this.wishlistItems().some(p => p.id === productId);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  addAllToCart() {
    const items = this.wishlistItems();
    if (items.length === 0) {
      this.notify.warning('Favoris vides', 'Vous n\'avez aucun produit dans vos favoris.');
      return;
    }

    items.forEach(product => {
      this.cartService.addToCart(product);
    });

    this.notify.success('Favoris ajoutés au panier 🛍️', `${items.length} produit(s) favori(s) ont été ajoutés à votre panier.`);
    this.closeDrawer();
    this.cartService.openDrawer();
  }

  clearWishlist() {
    this.wishlistItems.set([]);
    this.saveAndSync();
    this.notify.info('Favoris vidés', 'Votre liste de favoris a été réinitialisée.');
  }

  private saveAndSync() {
    this.saveToStorage();
    const user = this.firebaseService.currentUser();
    if (user?.uid) {
      const ids = this.wishlistItems().map(item => item.id);
      this.firebaseService.syncWishlist(user.uid, ids);
    }
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
