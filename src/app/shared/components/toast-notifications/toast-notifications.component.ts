import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toast-notifications',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('toastAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%) scale(0.9)' }),
        animate('350ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ opacity: 1, transform: 'translateX(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ opacity: 0, transform: 'translateX(60px) scale(0.9)' }))
      ])
    ])
  ],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toasts()" 
        class="toast-item glass-card"
        [class]="'toast-item glass-card toast-' + toast.type"
        @toastAnim
      >
        <div class="toast-icon-area">
          <i class="ph" [ngClass]="getIcon(toast.type)"></i>
        </div>
        <div class="toast-body">
          <strong class="toast-title">{{ toast.title }}</strong>
          <p class="toast-msg">{{ toast.message }}</p>
        </div>
        <button class="toast-dismiss" (click)="dismiss(toast.id)">
          <i class="ph ph-x"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 300;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 380px;
    }
    .toast-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-md);
      background: var(--bg-surface);
      box-shadow: var(--shadow-xl);
      border-left: 4px solid transparent;
    }
    .toast-success {
      border-left-color: var(--accent-emerald);
    }
    .toast-info {
      border-left-color: var(--accent-primary);
    }
    .toast-warning {
      border-left-color: var(--accent-amber);
    }
    .toast-error {
      border-left-color: var(--accent-rose);
    }
    .toast-icon-area {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
    }
    .toast-success .toast-icon-area {
      background: var(--accent-emerald-light);
      color: var(--accent-emerald);
    }
    .toast-info .toast-icon-area {
      background: var(--accent-primary-light);
      color: var(--accent-primary);
    }
    .toast-warning .toast-icon-area {
      background: var(--accent-amber-light);
      color: var(--accent-amber);
    }
    .toast-error .toast-icon-area {
      background: var(--accent-rose-light);
      color: var(--accent-rose);
    }
    .toast-body {
      flex: 1;
    }
    .toast-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-main);
      display: block;
    }
    .toast-msg {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin: 0.15rem 0 0;
      line-height: 1.4;
    }
    .toast-dismiss {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border-radius: var(--radius-full);
      background: transparent;
      color: var(--text-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      transition: all var(--transition-fast);
    }
    .toast-dismiss:hover {
      background: var(--bg-surface-secondary);
      color: var(--text-main);
    }
  `]
})
export class ToastNotificationsComponent {
  private notifyService = inject(NotificationService);

  toasts = this.notifyService.toasts;

  dismiss(id: string) {
    this.notifyService.remove(id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'ph-check-circle';
      case 'info': return 'ph-info';
      case 'warning': return 'ph-warning';
      case 'error': return 'ph-x-circle';
      default: return 'ph-info';
    }
  }
}

