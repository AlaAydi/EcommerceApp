import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models/product.model';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { ProductGalleryComponent } from './product-gallery/product-gallery.component';
import { ProductTabsComponent } from './product-tabs/product-tabs.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule, 
    StarRatingComponent, 
    ProductGalleryComponent, 
    ProductTabsComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  selectedColor: { name: string; hex: string } | null = null;
  selectedSize: string | null = null;
  quantity = 1;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.product = this.productService.selectedProduct();
    if (this.product) {
      this.selectedColor = this.product.colors?.[0] || null;
      this.selectedSize = this.product.sizes?.[0] || null;
    }
  }

  goBack() {
    this.productService.setSelectedProduct(null);
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(
        this.product, 
        this.quantity, 
        this.selectedColor ?? undefined, 
        this.selectedSize ?? undefined
      );
    }
  }

  isWishlisted(): boolean {
    return this.product ? this.wishlistService.isWishlisted(this.product.id) : false;
  }

  toggleWishlist() {
    if (this.product) {
      this.wishlistService.toggle(this.product);
    }
  }
}
