import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-hero">
        <div class="login-brand">
          <span class="serif-title brand-name">JO</span>
          <span class="brand-sub">LUXE</span>
        </div>
        <h1>Accès sécurisé à la boutique et à l'administration</h1>
        <p>Créez un compte client pour enregistrer vos données, ou utilisez un compte administrateur pour gérer la plateforme.</p>

      </div>

      <div class="login-card glass-card">
        <div class="auth-tabs">
          <button class="tab-btn" [class.active]="mode === 'login'" (click)="mode = 'login'">Connexion</button>
          <button class="tab-btn" [class.active]="mode === 'register'" (click)="mode = 'register'">Inscription</button>
        </div>

        <form class="auth-form" (ngSubmit)="submit()">
          <div class="form-group" *ngIf="mode === 'register'">
            <label>Nom complet</label>
            <input [(ngModel)]="name" name="name" type="text" class="form-input" placeholder="Ex: Sophie Martin" required />
          </div>

          <div class="form-group">
            <label>Adresse email</label>
            <input [(ngModel)]="email" name="email" type="email" class="form-input" placeholder="nom@exemple.com" required />
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input [(ngModel)]="password" name="password" type="password" class="form-input" placeholder="••••••••" required />
          </div>

          <button class="btn-primary submit-btn" type="submit" [disabled]="loading">
            {{ loading ? 'Traitement...' : (mode === 'login' ? 'Se connecter' : 'Créer mon compte') }}
          </button>
        </form>

        <p class="helper-text">
          <a href="/">Retour à la boutique</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .login-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      background: linear-gradient(135deg, #0f172a 0%, #111827 45%, #f8fafc 45%, #f8fafc 100%);
    }
    .login-hero {
      color: white;
      padding: 4rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1.25rem;
    }
    .login-brand { display: flex; align-items: baseline; gap: 0.25rem; }
    .brand-name { font-size: 3rem; font-weight: 800; letter-spacing: 0.08em; }
    .brand-sub { font-size: 1rem; font-weight: 800; letter-spacing: 0.3em; color: #93c5fd; }
    .login-hero h1 { font-size: clamp(2rem, 4vw, 4.2rem); line-height: 1.05; margin: 0; max-width: 12ch; }
    .login-hero p { max-width: 54ch; color: rgba(255,255,255,0.82); font-size: 1.02rem; }
    .demo-credentials {
      display: grid;
      gap: 0.35rem;
      padding: 1rem 1.15rem;
      border-radius: 18px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      max-width: 320px;
    }
    .demo-label { text-transform: uppercase; letter-spacing: .14em; font-size: .72rem; color: #cbd5e1; }
    .login-card {
      margin: auto 4rem auto 0;
      padding: 2rem;
      border-radius: 24px;
      background: rgba(255,255,255,0.9);
      box-shadow: 0 30px 60px rgba(15,23,42,.18);
      align-self: center;
    }
    .auth-tabs { display: flex; gap: .5rem; margin-bottom: 1.25rem; }
    .tab-btn {
      flex: 1;
      border: 1px solid var(--border-light);
      background: white;
      padding: .8rem 1rem;
      border-radius: 999px;
      font-weight: 700;
      cursor: pointer;
    }
    .tab-btn.active { background: var(--accent-primary); color: white; border-color: var(--accent-primary); }
    .auth-form { display: grid; gap: 1rem; }
    .form-group { display: grid; gap: .35rem; }
    .form-group label { font-size: .85rem; font-weight: 700; color: var(--text-main); }
    .form-input {
      width: 100%;
      padding: .85rem 1rem;
      border-radius: 14px;
      border: 1px solid var(--border-medium);
      background: white;
      font: inherit;
    }
    .submit-btn { width: 100%; margin-top: .35rem; }
    .helper-text { margin-top: 1rem; text-align: center; }
    .helper-text a { color: var(--accent-primary); font-weight: 700; text-decoration: none; }
    @media (max-width: 960px) {
      .login-page { grid-template-columns: 1fr; background: #f8fafc; }
      .login-hero { padding: 2rem 1.5rem; color: var(--text-main); }
      .login-hero p { color: var(--text-muted); }
      .demo-credentials { background: white; color: var(--text-main); border-color: var(--border-light); }
      .login-card { margin: 0 1.5rem 2rem; }
    }
  `]
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notify = inject(NotificationService);

  mode: 'login' | 'register' = 'login';
  email = 'aydiala@gmail.com';
  password = '12345678';
  name = '';
  loading = false;

  private getReturnUrl(): string {
    return this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  }

  async submit() {
    if (!this.email || !this.password) return;
    if (this.mode === 'register' && !this.name) {
      this.notify.warning('Nom requis', 'Veuillez saisir votre nom complet.');
      return;
    }

    this.loading = true;
    try {
      const ok = this.mode === 'login'
        ? await this.authService.login(this.email, this.password)
        : await this.authService.register(this.email, this.password, this.name);

      if (!ok) return;

      const user = this.authService.currentUser();
      if (user?.role === 'admin') {
        await this.router.navigateByUrl('/admin');
        return;
      }

      await this.router.navigateByUrl(this.getReturnUrl());
    } finally {
      this.loading = false;
    }
  }
}
