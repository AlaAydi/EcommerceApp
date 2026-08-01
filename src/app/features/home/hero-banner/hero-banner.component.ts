import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { CategoryType } from '../../../core/models/product.model';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.css'
})
export class HeroBannerComponent {
  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  scrollToProducts() {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  selectCategory(category: string) {
    this.productService.updateFilter({ category: category as CategoryType });
    this.scrollToProducts();
  }

  quickAddFeatured() {
    const p = this.productService.getProductById('prod-1');
    if (p) {
      this.cartService.addToCart(p);
    }
  }
}
