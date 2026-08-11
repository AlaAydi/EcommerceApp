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
          <span class="brand-name">JO</span>
          <span class="brand-sub">LUXE</span>
        </div>
        <p class="hero-copy">Créez un compte client pour enregistrer vos données, ou utilisez un compte administrateur pour gérer la plateforme.</p>
      </div>

      <div class="login-panel">
        <div class="login-card">
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
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f3f4f6;
      font-family: Inter, 'Segoe UI', sans-serif;
    }

    .login-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      background: linear-gradient(135deg, #07192b 0%, #07192b 48%, #f3f4f6 48%, #f3f4f6 100%);
      position: relative;
      overflow: hidden;
    }

    .login-page::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 20% 20%, rgba(124, 119, 255, 0.18), transparent 26%),
                  radial-gradient(circle at 80% 10%, rgba(255,255,255,0.14), transparent 22%);
      pointer-events: none;
      animation: glowShift 9s ease-in-out infinite alternate;
    }

    .login-hero {
      color: #edf3ff;
      padding: 4.5rem 3rem 4rem 4rem;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
      gap: 2rem;
      position: relative;
      z-index: 1;
      animation: fadeUp 0.8s ease-out both;
    }

    .login-brand {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
      line-height: 1;
      animation: floatBrand 5s ease-in-out infinite;
    }

    .brand-name {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: clamp(4.2rem, 5vw, 6rem);
      font-weight: 700;
      color: #f3f5f8;
      letter-spacing: -0.1em;
    }

    .brand-sub {
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: 0.35em;
      color: #dfeaff;
      text-transform: uppercase;
      padding-top: 0.8rem;
    }

    .hero-copy {
      max-width: 36rem;
      margin: 0;
      color: rgba(255,255,255,0.85);
      font-size: 1.04rem;
      line-height: 1.7;
      animation: fadeUp 0.9s ease-out 0.12s both;
    }

    .login-panel {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3.5rem 2rem;
      position: relative;
      z-index: 1;
    }

    .login-card {
      width: min(100%, 540px);
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(148, 163, 184, 0.18);
      box-shadow: 0 25px 60px rgba(15, 23, 42, 0.12);
      border-radius: 30px;
      padding: 2rem 2rem 1.5rem;
      position: relative;
      backdrop-filter: blur(12px);
      animation: cardLift 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }

    .login-card::before {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: 29px;
      background: linear-gradient(135deg, rgba(95,82,255,0.04), rgba(79,70,229,0.02), rgba(255,255,255,0));
      pointer-events: none;
    }

    .auth-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      padding: 0.35rem;
      background: #f3f4f6;
      border-radius: 999px;
      margin-bottom: 1.5rem;
      box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.06);
    }

    .tab-btn {
      border: none;
      border-radius: 999px;
      background: transparent;
      color: #475569;
      padding: 0.95rem 1rem;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }

    .tab-btn:hover {
      transform: translateY(-1px);
      color: #1f2937;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, #5f52ff, #3f36cb);
      color: #fff;
      box-shadow: 0 8px 18px rgba(95, 82, 255, 0.28);
    }

    .auth-form {
      display: grid;
      gap: 1.15rem;
      position: relative;
      z-index: 1;
    }

    .form-group {
      display: grid;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.95rem;
      font-weight: 700;
      color: #111827;
    }

    .form-input {
      width: 100%;
      border: 1px solid #dfe2ea;
      background: #fff;
      border-radius: 14px;
      padding: 1rem 1rem;
      font: inherit;
      color: #111827;
      transition: all 0.25s ease;
      box-shadow: 0 0 0 rgba(95, 82, 255, 0);
    }

    .form-input:focus {
      outline: none;
      border-color: rgba(95, 82, 255, 0.5);
      box-shadow: 0 0 0 3px rgba(95, 82, 255, 0.12);
      transform: translateY(-1px);
    }

    .submit-btn {
      width: 100%;
      margin-top: 0.5rem;
      border: none;
      border-radius: 999px;
      padding: 1rem 1.2rem;
      font-size: 1.05rem;
      font-weight: 700;
      cursor: pointer;
      background: linear-gradient(135deg, #5f52ff, #3f36cb);
      color: #fff;
      box-shadow: 0 12px 28px rgba(95, 82, 255, 0.28);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 18px 32px rgba(95, 82, 255, 0.3);
    }

    .helper-text {
      text-align: center;
      margin: 1.1rem 0 0;
      color: #475569;
      position: relative;
      z-index: 1;
    }

    .helper-text a {
      color: #1f2937;
      text-decoration: none;
      font-weight: 800;
      transition: color 0.2s ease;
    }

    .helper-text a:hover {
      color: #4f46e5;
    }

    @keyframes glowShift {
      0% { transform: scale(1); opacity: 0.7; }
      100% { transform: scale(1.08); opacity: 1; }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes cardLift {
      from { opacity: 0; transform: translateY(28px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes floatBrand {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    @media (max-width: 980px) {
      .login-page {
        grid-template-columns: 1fr;
        background: linear-gradient(180deg, #07192b 0%, #07192b 35%, #f3f4f6 35%, #f3f4f6 100%);
      }

      .login-hero {
        padding: 2.5rem 1.5rem 1.25rem;
        justify-content: flex-start;
        color: #111827;
      }

      .brand-name {
        color: #f5f7fb;
      }

      .brand-sub {
        color: #dfe7ff;
      }

      .hero-copy {
        color: rgba(255,255,255,0.82);
        max-width: 100%;
      }

      .login-panel {
        padding: 0 1rem 1.5rem;
      }

      .login-card {
        width: min(100%, 440px);
        padding: 1.15rem 0.95rem 1rem;
        border-radius: 24px;
      }

      .auth-tabs {
        gap: 0.5rem;
        padding: 0.3rem;
      }

      .tab-btn {
        padding: 0.85rem 0.6rem;
        font-size: 0.9rem;
      }

      .form-input {
        padding: 0.9rem 0.9rem;
      }
    }

    @media (max-width: 480px) {
      .login-page {
        min-height: 100vh;
      }

      .login-hero {
        padding: 2rem 1.1rem 0.8rem;
        gap: 1rem;
      }

      .brand-name {
        font-size: 3.4rem;
      }

      .brand-sub {
        letter-spacing: 0.2em;
        font-size: 0.9rem;
      }

      .hero-copy {
        font-size: 0.92rem;
        line-height: 1.6;
      }

      .login-panel {
        padding: 0.2rem 0.7rem 1.2rem;
      }

      .login-card {
        border-radius: 22px;
      }

      .submit-btn {
        padding: 0.92rem 1rem;
      }
    }
  `]
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notify = inject(NotificationService);

  mode: 'login' | 'register' = 'login';
  email = '';
  password = '';
  name = '';
  loading = false;

  private getReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (!returnUrl || returnUrl === '/login') {
      return '/';
    }
    return returnUrl;
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

      if (this.mode === 'register') {
        this.mode = 'login';
        this.name = '';
        this.email = '';
        this.password = '';
        await this.router.navigateByUrl('/login');
        return;
      }

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
