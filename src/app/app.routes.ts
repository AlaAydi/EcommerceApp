import { Routes } from '@angular/router';
import { ShopShellComponent } from './shop-shell.component';
import { LoginPageComponent } from './features/auth/login-page.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { adminGuard } from './auth.guard';
import { MyOrdersPageComponent } from './features/orders/my-orders-page.component';
import { OrderDetailPageComponent } from './features/orders/order-detail-page.component';
import { authRequiredGuard } from './auth-required.guard';

export const routes: Routes = [
	{ path: '', component: ShopShellComponent },
	{ path: 'login', component: LoginPageComponent },
	{ path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
	{ path: 'orders', component: MyOrdersPageComponent, canActivate: [authRequiredGuard] },
	{ path: 'orders/:orderId', component: OrderDetailPageComponent, canActivate: [authRequiredGuard] },
	{ path: '**', redirectTo: '' }
];
