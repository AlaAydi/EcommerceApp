import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { UserOrder } from '../../core/models/user.model';

@Component({
  selector: 'app-order-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="order-detail-page" *ngIf="order(); else missing">
      <div class="container-xl detail-shell">
        <a routerLink="/orders" class="back-link">← Retour à mes commandes</a>

        <div class="detail-grid">
          <article class="glass-card detail-main">
            <p class="eyebrow">Détail commande</p>
            <h1>#{{ order()!.id }}</h1>
            <div class="detail-status-row">
              <span class="status-badge" [ngClass]="order()!.status">{{ getStatusLabel(order()!.status) }}</span>
              <span class="status-updated" *ngIf="order()!.statusUpdatedAt">Mis à jour le {{ order()!.statusUpdatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>

            <div class="progress-rail">
              <div class="progress-step" [class.active]="isStatusReached(order()!, 'confirmed')">Confirmée</div>
              <div class="progress-step" [class.active]="isStatusReached(order()!, 'processing')">En préparation</div>
              <div class="progress-step" [class.active]="isStatusReached(order()!, 'shipped')">Expédiée</div>
              <div class="progress-step" [class.active]="isStatusReached(order()!, 'delivered')">Livrée</div>
            </div>

            <div class="timeline-card">
              <h3>Historique de statut</h3>
              <div class="timeline-item" *ngFor="let step of order()!.statusHistory || []">
                <span class="timeline-dot" [class.active]="step.status === order()!.status"></span>
                <div>
                  <strong>{{ getStatusLabel(step.status) }}</strong>
                  <div>{{ step.at | date:'dd/MM/yyyy HH:mm' }}</div>
                </div>
              </div>
            </div>
          </article>

          <aside class="glass-card detail-side">
            <h3>Récapitulatif</h3>
            <div class="summary-row">
              <span>Total</span>
              <strong>{{ order()!.grandTotal | number:'1.2-2' }} €</strong>
            </div>
            <div class="summary-row">
              <span>Paiement</span>
              <strong>{{ order()!.paymentMethod }}</strong>
            </div>
            <div class="summary-row">
              <span>Client</span>
              <strong>{{ order()!.shippingDetails.firstName }} {{ order()!.shippingDetails.lastName }}</strong>
            </div>
            <div class="summary-row">
              <span>Adresse</span>
              <strong>{{ order()!.shippingDetails.address }}, {{ order()!.shippingDetails.city }}</strong>
            </div>

            <div class="items-list">
              <h4>Articles</h4>
              <div class="item-row" *ngFor="let item of order()!.items">
                <span>{{ item.quantity }}x {{ item.productName }}</span>
                <strong>{{ (item.productPrice * item.quantity) | number:'1.2-2' }} €</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <ng-template #missing>
      <section class="order-detail-page">
        <div class="container-xl">
          <div class="glass-card missing-card">
            <h1>Commande introuvable</h1>
            <p>Cette commande n'existe pas ou ne vous appartient pas.</p>
            <a routerLink="/orders" class="btn-primary">Retour à mes commandes</a>
          </div>
        </div>
      </section>
    </ng-template>
  `,
  styles: [`
    .order-detail-page { min-height: 100vh; padding: 2rem 0 4rem; background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%); }
    .back-link { display: inline-flex; margin-bottom: 1rem; font-weight: 700; color: var(--accent-primary); }
    .detail-grid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.9fr); gap: 1.25rem; }
    .detail-main, .detail-side, .missing-card { padding: 1.75rem; border-radius: 24px; }
    .eyebrow { text-transform: uppercase; letter-spacing: .14em; font-size: .75rem; color: var(--accent-primary); font-weight: 800; }
    .detail-main h1 { margin: .25rem 0 1rem; font-size: clamp(2rem, 4vw, 3rem); }
    .detail-status-row { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem 1rem; margin-bottom: 1.25rem; }
    .status-badge { padding: .35rem .75rem; border-radius: 999px; font-weight: 800; font-size: .78rem; }
    .status-badge.confirmed { background: #FEF3C7; color: #D97706; }
    .status-badge.processing { background: #E0F2FE; color: #0284C7; }
    .status-badge.shipped { background: #EEF2FF; color: #4F46E5; }
    .status-badge.delivered { background: #ECFDF5; color: #059669; }
    .status-updated { color: var(--text-muted); font-size: .9rem; }
    .progress-rail { display: grid; grid-template-columns: repeat(4, 1fr); gap: .5rem; margin-bottom: 1.5rem; }
    .progress-step { padding: .7rem .5rem; text-align: center; border-radius: 999px; background: var(--bg-surface-secondary); color: var(--text-muted); font-weight: 700; font-size: .78rem; border: 1px solid var(--border-light); }
    .progress-step.active { background: var(--accent-primary-light); color: var(--accent-primary); border-color: rgba(79, 70, 229, .18); }
    .timeline-card { padding-top: .5rem; }
    .timeline-card h3, .detail-side h3, .items-list h4 { margin-top: 0; }
    .timeline-item { display: flex; gap: .75rem; padding: .75rem 0; border-top: 1px solid var(--border-light); }
    .timeline-dot { width: 12px; height: 12px; border-radius: 50%; margin-top: .35rem; background: var(--border-medium); }
    .timeline-dot.active { background: var(--accent-primary); box-shadow: 0 0 0 6px var(--accent-primary-light); }
    .timeline-item strong { display: block; }
    .timeline-item div div { color: var(--text-muted); font-size: .85rem; }
    .detail-side { display: grid; gap: 1rem; align-content: start; }
    .summary-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-bottom: .65rem; border-bottom: 1px solid var(--border-light); }
    .summary-row strong { text-align: right; }
    .items-list { display: grid; gap: .7rem; }
    .item-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-top: .6rem; border-top: 1px solid var(--border-light); }
    .missing-card { text-align: center; }
    @media (max-width: 960px) { .detail-grid { grid-template-columns: 1fr; } .progress-rail { grid-template-columns: 1fr 1fr; } }
  `]
})
export class OrderDetailPageComponent {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  order = computed(() => {
    const user = this.authService.currentUser();
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (!user || !orderId) return null;

    return this.adminService.orders().find(order =>
      order.id === orderId && (order.userId === user.uid || order.userEmail.toLowerCase() === user.email.toLowerCase())
    ) || null;
  });

  getStatusLabel(status: UserOrder['status']): string {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'processing': return 'En préparation';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      default: return status;
    }
  }

  isStatusReached(order: UserOrder, status: UserOrder['status']): boolean {
    const sequence: UserOrder['status'][] = ['confirmed', 'processing', 'shipped', 'delivered'];
    return sequence.indexOf(order.status) >= sequence.indexOf(status);
  }
}
