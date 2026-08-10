import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CartDrawerComponent } from './shared/components/cart-drawer/cart-drawer.component';
import { WishlistDrawerComponent } from './shared/components/wishlist-drawer/wishlist-drawer.component';
import { AuthModalComponent } from './shared/components/auth-modal/auth-modal.component';
import { RegisterSuccessModalComponent } from './shared/components/register-success-modal/register-success-modal.component';
import { QuickViewModalComponent } from './shared/components/quick-view-modal/quick-view-modal.component';
import { ToastNotificationsComponent } from './shared/components/toast-notifications/toast-notifications.component';
import { HomeComponent } from './features/home/home.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { ProductService } from './core/services/product.service';
import { AdminService } from './core/services/admin.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    CartDrawerComponent,
    WishlistDrawerComponent,
    AuthModalComponent,
    RegisterSuccessModalComponent,
    QuickViewModalComponent,
    ToastNotificationsComponent,
    HomeComponent,
    ProductDetailComponent,
    CheckoutComponent,
    AdminDashboardComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private productService = inject(ProductService);
  private adminService = inject(AdminService);

  selectedProduct = this.productService.selectedProduct;
  isAdminView = this.adminService.isAdminView;
  isCheckoutOpen = false;

  ngOnInit() {
    window.addEventListener('openCheckout', () => {
      this.isCheckoutOpen = true;
    });
  }
}
