import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { UserOrder } from '../../core/models/user.model';

@Component({
  selector: 'app-my-orders-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="orders-page">
      <div class="container-xl orders-layout">
        <div class="orders-hero glass-card">
          <p class="eyebrow">Suivi client</p>
          <h1>Mes commandes</h1>
          <p>Vous pouvez voir ici l'état actuel de chaque commande. Quand l'administration passe une commande en préparation ou en cours, le statut affiché ici se met à jour.</p>
          <a routerLink="/" class="btn-secondary">Retour à la boutique</a>
        </div>

        <div class="filter-bar glass-card">
          <button class="filter-pill" [class.active]="statusFilter() === 'all'" (click)="statusFilter.set('all')">Toutes ({{ orders().length }})</button>
          <button class="filter-pill" [class.active]="statusFilter() === 'in-progress'" (click)="statusFilter.set('in-progress')">En cours ({{ inProgressCount() }})</button>
          <button class="filter-pill" [class.active]="statusFilter() === 'delivered'" (click)="statusFilter.set('delivered')">Livrées ({{ deliveredCount() }})</button>
        </div>

        <div class="orders-list" *ngIf="filteredOrders().length > 0; else emptyState">
          <article class="order-card glass-card" *ngFor="let order of filteredOrders()">
            <div class="order-head">
              <div>
                <span class="order-number">#{{ order.id }}</span>
                <h3>{{ order.grandTotal | number:'1.2-2' }} €</h3>
              </div>
              <span class="status-badge" [ngClass]="order.status">{{ getStatusLabel(order.status) }}</span>
            </div>

            <div class="progress-wrap">
              <div class="progress-labels">
                <span>Suivi de traitement</span>
                <strong>{{ progressPercent(order) }}%</strong>
              </div>
              <div class="progress-track">
                <div class="progress-fill" [style.width.%]="progressPercent(order)"></div>
              </div>
            </div>

            <div class="status-track">
              <span class="status-step" [class.active]="isStatusReached(order, 'confirmed')">Confirmée</span>
              <span class="status-step" [class.active]="isStatusReached(order, 'processing')">Préparation</span>
              <span class="status-step" [class.active]="isStatusReached(order, 'shipped')">Expédition</span>
              <span class="status-step" [class.active]="isStatusReached(order, 'delivered')">Livrée</span>
            </div>

            <div class="order-meta">
              <span><strong>Commande passée:</strong> {{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
              <span *ngIf="order.statusUpdatedAt"><strong>Dernière mise à jour:</strong> {{ order.statusUpdatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>

            <div class="order-items">
              <div class="order-item" *ngFor="let item of order.items">
                <span>{{ item.quantity }}x {{ item.productName }}</span>
                <strong>{{ (item.productPrice * item.quantity) | number:'1.2-2' }} €</strong>
              </div>
            </div>

            <div class="order-actions">
              <a class="btn-secondary" [routerLink]="['/orders', order.id]">Voir le détail</a>
            </div>
          </article>
        </div>

        <ng-template #emptyState>
          <div class="empty-orders glass-card">
            <h3 *ngIf="orders().length === 0">Aucune commande enregistrée</h3>
            <h3 *ngIf="orders().length > 0">Aucun résultat pour ce filtre</h3>
            <p *ngIf="orders().length === 0">Faites votre inscription, ajoutez des articles au panier, puis validez votre paiement pour voir ici l'historique de vos commandes.</p>
            <p *ngIf="orders().length > 0">Essayez un autre filtre pour retrouver vos commandes.</p>
            <a routerLink="/" class="btn-primary">Commencer mes achats</a>
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styles: [`
    .orders-page { min-height: 100vh; padding: 3rem 0 4rem; background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%); }
    .orders-layout { display: grid; gap: 1.5rem; }
    .orders-hero { padding: 2rem; border-radius: 24px; }
    .eyebrow { text-transform: uppercase; letter-spacing: .14em; font-size: .75rem; font-weight: 800; color: var(--accent-primary); margin-bottom: .5rem; }
    .orders-hero h1 { font-size: clamp(2rem, 4vw, 3.2rem); margin: 0 0 .5rem; }
    .orders-hero p { max-width: 65ch; color: var(--text-muted); margin: 0 0 1rem; }
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: .6rem;
      padding: 1rem;
      border-radius: 20px;
    }
    .filter-pill {
      padding: .65rem 1rem;
      border-radius: 999px;
      border: 1px solid var(--border-light);
      background: white;
      color: var(--text-main);
      font-weight: 700;
      transition: all .2s ease;
    }
    .filter-pill.active {
      background: var(--accent-primary);
      color: white;
      border-color: var(--accent-primary);
      box-shadow: 0 12px 20px rgba(79, 70, 229, 0.18);
    }
    .orders-list { display: grid; gap: 1rem; }
    .order-card { padding: 1.5rem; border-radius: 22px; }
    .order-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
    .order-number { display: block; font-size: .78rem; letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: .2rem; }
    .order-head h3 { margin: 0; font-size: 1.3rem; }
    .status-badge { padding: .35rem .75rem; border-radius: 999px; font-weight: 800; font-size: .78rem; }
    .status-badge.confirmed { background: #FEF3C7; color: #D97706; }
    .status-badge.processing { background: #E0F2FE; color: #0284C7; }
    .status-badge.shipped { background: #EEF2FF; color: #4F46E5; }
    .status-badge.delivered { background: #ECFDF5; color: #059669; }
    .status-track {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .status-step {
      padding: 0.55rem 0.6rem;
      text-align: center;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--text-muted);
      background: var(--bg-surface-secondary);
      border: 1px solid var(--border-light);
    }
    .status-step.active {
      color: var(--accent-primary);
      background: var(--accent-primary-light);
      border-color: rgba(79, 70, 229, 0.18);
    }
    .progress-wrap {
      margin-bottom: 1rem;
    }
    .progress-labels {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-bottom: .4rem;
    }
    .progress-labels strong {
      color: var(--accent-primary);
      font-size: 0.88rem;
    }
    .progress-track {
      width: 100%;
      height: 10px;
      background: var(--bg-surface-secondary);
      border-radius: 999px;
      overflow: hidden;
      border: 1px solid var(--border-light);
    }
    .progress-fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-emerald) 100%);
      transition: width .65s cubic-bezier(.22, 1, .36, 1);
      position: relative;
      animation: progressPulse 2.2s ease-in-out infinite;
    }
    .progress-fill::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.35) 50%, rgba(255,255,255,0) 100%);
      animation: progressShine 1.6s linear infinite;
      transform: translateX(-100%);
    }
    .order-meta { display: flex; flex-wrap: wrap; gap: .8rem 1.25rem; font-size: .88rem; color: var(--text-muted); margin-bottom: 1rem; }
    .order-items { display: grid; gap: .6rem; }
    .order-item { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .75rem 0; border-top: 1px solid var(--border-light); }
    .order-actions { display: flex; justify-content: flex-end; margin-top: 1rem; }
    .empty-orders { padding: 2rem; text-align: center; border-radius: 22px; }
    .empty-orders h3 { margin-top: 0; }
    .empty-orders p { max-width: 60ch; margin: .5rem auto 1rem; color: var(--text-muted); }
    @keyframes progressShine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes progressPulse {
      0%, 100% { filter: saturate(1); }
      50% { filter: saturate(1.15); }
    }
  `]
})
export class MyOrdersPageComponent {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);
  private lastStatuses = new Map<string, UserOrder['status']>();
  statusFilter = signal<'all' | 'in-progress' | 'delivered'>('all');

  orders = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [] as UserOrder[];

    const storedOrders = JSON.parse(localStorage.getItem('aura_orders') || '[]');
    const allOrders = Array.isArray(storedOrders)
      ? storedOrders.map(order => this.adminService['normalizeOrder'](order))
      : this.adminService.orders();

    return allOrders.filter(order =>
      order.userId === user.uid || order.userEmail.toLowerCase() === user.email.toLowerCase()
    ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });

  filteredOrders = computed(() => {
    const list = this.orders();
    switch (this.statusFilter()) {
      case 'in-progress':
        return list.filter(order => order.status !== 'delivered');
      case 'delivered':
        return list.filter(order => order.status === 'delivered');
      default:
        return list;
    }
  });

  inProgressCount = computed(() => this.orders().filter(order => order.status !== 'delivered').length);
  deliveredCount = computed(() => this.orders().filter(order => order.status === 'delivered').length);

  constructor() {
    effect(() => {
      const currentOrders = this.orders();
      currentOrders.forEach(order => {
        const previousStatus = this.lastStatuses.get(order.id);
        if (previousStatus && previousStatus !== order.status) {
          this.notify.info(
            'Commande mise à jour',
            `Votre commande ${order.id} est maintenant ${this.getStatusLabel(order.status).toLowerCase()}.`
          );
        }
        this.lastStatuses.set(order.id, order.status);
      });
    });

    window.addEventListener('storage', () => {
      const list = JSON.parse(localStorage.getItem('aura_client_notifications') || '[]');
      const last = Array.isArray(list) ? list[list.length - 1] : null;
      if (last && last.message) {
        this.notify.info('Commande mise à jour', last.message);
      }
    });
  }

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
    const timeline = ['confirmed', 'processing', 'shipped', 'delivered'];
    return timeline.indexOf(order.status) >= timeline.indexOf(status);
  }

  progressPercent(order: UserOrder): number {
    switch (order.status) {
      case 'confirmed': return 25;
      case 'processing': return 55;
      case 'shipped': return 80;
      case 'delivered': return 100;
      default: return 0;
    }
  }
}
