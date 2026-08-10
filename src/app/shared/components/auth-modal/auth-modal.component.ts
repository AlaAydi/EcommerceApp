import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-backdrop" *ngIf="isOpen()" (click)="close()">
      <div class="auth-card glass-modal" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button class="close-btn" (click)="close()" title="Fermer">
          <i class="ph ph-x"></i>
        </button>

        <!-- Header -->
        <div class="auth-header">
          <div class="auth-brand">
            <span class="serif-title brand-name">JO</span>
            <span class="brand-sub">LUXE</span>
          </div>
          <p class="auth-subtitle">
            {{ mode() === 'login' ? 'Accédez à vos commandes et favoris' : 'Rejoignez la communauté Aura Luxe' }}
          </p>
        </div>

        <!-- Mode Toggle Tabs -->
        <div class="auth-tabs">
          <button 
            class="tab-btn" 
            [class.active]="mode() === 'login'" 
            (click)="setMode('login')"
          >
            Se Connecter
          </button>
          <button 
            class="tab-btn" 
            [class.active]="mode() === 'register'" 
            (click)="setMode('register')"
          >
            Créer un compte
          </button>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="auth-form">
          <!-- Full Name (Register Only) -->
          <div class="form-group" *ngIf="mode() === 'register'">
            <label class="form-label">Nom complet</label>
            <div class="input-wrapper">
              <i class="ph ph-user input-icon"></i>
              <input 
                type="text" 
                class="form-input" 
                [(ngModel)]="name" 
                name="name" 
                placeholder="Ex: Sophie Martin" 
                required
              />
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label class="form-label">Adresse E-mail</label>
            <div class="input-wrapper">
              <i class="ph ph-envelope-simple input-icon"></i>
              <input 
                type="email" 
                class="form-input" 
                [(ngModel)]="email" 
                name="email" 
                placeholder="nom@exemple.com" 
                required
              />
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <div class="input-wrapper">
              <i class="ph ph-lock-key input-icon"></i>
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                class="form-input" 
                [(ngModel)]="password" 
                name="password" 
                placeholder="••••••••" 
                required
              />
              <button 
                type="button" 
                class="toggle-pwd-btn" 
                (click)="showPassword = !showPassword"
              >
                <i class="ph" [class.ph-eye]="!showPassword" [class.ph-eye-slash]="showPassword"></i>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="submit-btn btn-primary" [disabled]="loading">
            <span *ngIf="!loading">
              {{ mode() === 'login' ? 'Connexion' : 'Créer mon compte' }}
            </span>
            <span *ngIf="loading" class="spinner-loader"></span>
          </button>
        </form>

        <!-- Footer -->
        <div class="auth-footer">
          <p *ngIf="mode() === 'login'">
            Pas encore de compte ? 
            <a href="javascript:void(0)" (click)="setMode('register')">Inscrivez-vous</a>
          </p>
          <p *ngIf="mode() === 'register'">
            Déjà inscrit ? 
            <a href="javascript:void(0)" (click)="setMode('login')">Connectez-vous</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.25s ease-out;
    }

    .auth-card {
      position: relative;
      width: 100%;
      max-width: 440px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: var(--radius-xl);
      padding: 2.25rem 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.8);
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .close-btn {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--bg-surface-secondary);
      border: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }
    .close-btn:hover {
      background: var(--accent-primary-light);
      color: var(--accent-primary);
      transform: rotate(90deg);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 1.75rem;
    }

    .auth-brand {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }
    .brand-name {
      font-size: 2.1rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: var(--text-main);
    }
    .brand-sub {
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 0.25em;
      color: var(--accent-primary);
    }

    .auth-subtitle {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin: 0;
    }

    .auth-tabs {
      display: flex;
      background: var(--bg-surface-secondary);
      padding: 4px;
      border-radius: var(--radius-full);
      margin-bottom: 1.5rem;
      border: 1px solid var(--border-light);
    }

    .tab-btn {
      flex: 1;
      padding: 0.6rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-muted);
      border: none;
      background: transparent;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn.active {
      background: white;
      color: var(--accent-primary);
      box-shadow: var(--shadow-sm);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .form-label {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      font-size: 1.15rem;
      color: var(--text-subtle);
      pointer-events: none;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.6rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-medium);
      background: white;
      font-size: 0.9rem;
      color: var(--text-main);
      transition: all 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    }

    .toggle-pwd-btn {
      position: absolute;
      right: 0.75rem;
      background: transparent;
      border: none;
      font-size: 1.15rem;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.25rem;
    }

    .submit-btn {
      margin-top: 0.5rem;
      width: 100%;
      padding: 0.85rem;
      border-radius: var(--radius-full);
      background: var(--accent-gradient);
      color: white;
      font-weight: 700;
      font-size: 0.95rem;
      border: none;
      box-shadow: var(--shadow-md);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner-loader {
      width: 20px;
      height: 20px;
      border: 2px solid white;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .auth-footer {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .auth-footer a {
      color: var(--accent-primary);
      font-weight: 700;
      text-decoration: none;
    }
    .auth-footer a:hover {
      text-decoration: underline;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class AuthModalComponent {
  private authService = inject(AuthService);

  isOpen = this.authService.isModalOpen;
  mode = this.authService.modalMode;

  email = '';
  password = '';
  name = '';
  showPassword = false;
  loading = false;

  close() {
    this.authService.closeModal();
  }

  setMode(mode: 'login' | 'register') {
    this.authService.setModalMode(mode);
  }

  async onSubmit() {
    if (!this.email || !this.password) return;
    if (this.mode() === 'register' && !this.name) return;

    this.loading = true;
    try {
      if (this.mode() === 'login') {
        await this.authService.login(this.email, this.password);
      } else {
        await this.authService.register(this.email, this.password, this.name);
      }
      this.email = '';
      this.password = '';
      this.name = '';
    } finally {
      this.loading = false;
    }
  }
}
