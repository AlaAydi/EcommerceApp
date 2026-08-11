import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CartDrawerComponent } from './shared/components/cart-drawer/cart-drawer.component';
import { WishlistDrawerComponent } from './shared/components/wishlist-drawer/wishlist-drawer.component';
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
  selector: 'app-shop-shell',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    CartDrawerComponent,
    WishlistDrawerComponent,
    RegisterSuccessModalComponent,
    QuickViewModalComponent,
    ToastNotificationsComponent,
    HomeComponent,
    ProductDetailComponent,
    CheckoutComponent,
    AdminDashboardComponent
  ],
  template: `
<!-- Main App Header -->
<app-header></app-header>

<!-- Dynamic Main View (Home Catalog OR Dedicated Product Detail Page OR Admin Dashboard) -->
<main class="main-content">
  <ng-container *ngIf="!isAdminView()">
    <app-home *ngIf="!selectedProduct()"></app-home>
    <app-product-detail *ngIf="selectedProduct()"></app-product-detail>
  </ng-container>

  <app-admin-dashboard *ngIf="isAdminView()"></app-admin-dashboard>
</main>

<!-- Footer -->
<app-footer *ngIf="!isAdminView()"></app-footer>

<!-- Floating & Modal Overlays -->
<app-cart-drawer></app-cart-drawer>
<app-wishlist-drawer></app-wishlist-drawer>
<app-register-success-modal></app-register-success-modal>
<app-quick-view-modal></app-quick-view-modal>
<app-checkout [isOpen]="isCheckoutOpen" (closeEvent)="isCheckoutOpen = false"></app-checkout>
<app-toast-notifications></app-toast-notifications>
  `,
  styleUrl: './app.component.css'
})
export class ShopShellComponent implements OnInit {
  private productService = inject(ProductService);
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);

  selectedProduct = this.productService.selectedProduct;
  isAdminView = this.adminService.isAdminView;
  isCheckoutOpen = false;

  ngOnInit() {
    window.addEventListener('openCheckout', () => {
      this.isCheckoutOpen = true;
    });

    this.route.queryParamMap.subscribe(params => {
      if (params.get('checkout') === '1') {
        this.isCheckoutOpen = true;
      }
    });
  }
}
