import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register-success-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-backdrop" *ngIf="isOpen()" (click)="close()">
      <div class="success-card glass-modal" (click)="$event.stopPropagation()">
        <div class="success-icon-container">
          <div class="pulse-ring"></div>
          <i class="ph ph-check-circle success-icon"></i>
        </div>

        <h2 class="serif-title success-title">Inscription Réussie ! 🎉</h2>
        <p class="success-message">
          Félicitations <strong>{{ userName() }}</strong>, votre compte client <strong>Aura Luxe</strong> a été créé avec succès.
        </p>

        <div class="success-features">
          <div class="feature-item">
            <i class="ph ph-heart heart-ic"></i>
            <span>Sauvegardez vos coups de cœur</span>
          </div>
          <div class="feature-item">
            <i class="ph ph-truck-check truck-ic"></i>
            <span>Suivez vos commandes en direct</span>
          </div>
          <div class="feature-item">
            <i class="ph ph-lightning spark-ic"></i>
            <span>Profitez des réductions exclusives</span>
          </div>
        </div>

        <button class="btn-primary start-shopping-btn" (click)="close()">
          Commencer mes achats
          <i class="ph ph-arrow-right"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .success-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1100;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.3s ease;
    }

    .success-card {
      width: 100%;
      max-width: 460px;
      background: rgba(255, 255, 255, 0.96);
      border-radius: var(--radius-xl);
      padding: 2.5rem 2rem;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.8);
      animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .success-icon-container {
      position: relative;
      width: 84px;
      height: 84px;
      margin: 0 auto 1.5rem auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pulse-ring {
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      background: var(--accent-emerald-light);
      animation: pulseScale 2s infinite ease-in-out;
    }

    .success-icon {
      font-size: 4.2rem;
      color: var(--accent-emerald);
      position: relative;
      z-index: 2;
    }

    .success-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 0.6rem;
    }

    .success-message {
      font-size: 0.95rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 1.75rem;
    }

    .success-features {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      background: var(--bg-surface-secondary);
      padding: 1rem 1.25rem;
      border-radius: var(--radius-lg);
      margin-bottom: 1.75rem;
      text-align: left;
      border: 1px solid var(--border-light);
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .heart-ic { color: var(--accent-rose); font-size: 1.2rem; }
    .truck-ic { color: var(--accent-primary); font-size: 1.2rem; }
    .spark-ic { color: var(--accent-amber); font-size: 1.2rem; }

    .start-shopping-btn {
      width: 100%;
      padding: 0.85rem;
      border-radius: var(--radius-full);
      font-size: 1rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.85) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes pulseScale {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.15); opacity: 0.9; }
    }
  `]
})
export class RegisterSuccessModalComponent {
  private authService = inject(AuthService);

  isOpen = this.authService.isRegisterSuccessOpen;
  userName = this.authService.registeredUserName;

  close() {
    this.authService.closeRegisterSuccessModal();
  }
}
