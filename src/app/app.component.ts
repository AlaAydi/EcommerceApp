import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CartDrawerComponent } from './shared/components/cart-drawer/cart-drawer.component';
import { QuickViewModalComponent } from './shared/components/quick-view-modal/quick-view-modal.component';
import { ToastNotificationsComponent } from './shared/components/toast-notifications/toast-notifications.component';
import { HomeComponent } from './features/home/home.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { ProductService } from './core/services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    CartDrawerComponent,
    QuickViewModalComponent,
    ToastNotificationsComponent,
    HomeComponent,
    ProductDetailComponent,
    CheckoutComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private productService = inject(ProductService);

  selectedProduct = this.productService.selectedProduct;
  isCheckoutOpen = false;

  ngOnInit() {
    window.addEventListener('openCheckout', () => {
      this.isCheckoutOpen = true;
    });
  }
}

