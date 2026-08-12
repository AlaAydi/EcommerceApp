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
        <div class="hero-badge"><span>✦</span> Boutique premium</div>

        <div class="login-brand">
          <span class="brand-name">JO</span>
          <span class="brand-sub">LUXE</span>
        </div>

        <h1>Accès sécurisé à la boutique et à l’administration</h1>
        <p class="hero-copy">Créez un compte client pour enregistrer vos données, ou utilisez un compte administrateur pour gérer la plateforme.</p>

        <div class="feature-list">
          <div class="feature-item"><span class="feature-icon">⚡</span> Commandes rapides</div>
          <div class="feature-item"><span class="feature-icon">🛡️</span> Paiement sécurisé</div>
          <div class="feature-item"><span class="feature-icon">✨</span> Expérience premium</div>
        </div>
      </div>

      <div class="login-panel">
        <div class="orb orb-one"></div>
        <div class="orb orb-two"></div>

        <div class="login-card">
          <div class="card-topbar">
            <div class="mini-avatar">✦</div>
            <span class="card-badge">JO LUXE</span>
          </div>

          <div class="auth-tabs">
            <button class="tab-btn" [class.active]="mode === 'login'" (click)="mode = 'login'">Connexion</button>
            <button class="tab-btn" [class.active]="mode === 'register'" (click)="mode = 'register'">Inscription</button>
          </div>

          <form class="auth-form" (ngSubmit)="submit()">
            <div class="form-group" *ngIf="mode === 'register'">
              <label>Nom complet</label>
              <div class="input-wrap">
                <span class="input-icon">👤</span>
                <input [(ngModel)]="name" name="name" type="text" class="form-input" placeholder="Ex: Sophie Martin" required />
              </div>
            </div>

            <div class="form-group">
              <label>Adresse email</label>
              <div class="input-wrap">
                <span class="input-icon">✉️</span>
                <input [(ngModel)]="email" name="email" type="email" class="form-input" placeholder="nom@exemple.com" required />
              </div>
            </div>

            <div class="form-group">
              <label>Mot de passe</label>
              <div class="input-wrap">
                <span class="input-icon">🔒</span>
                <input [(ngModel)]="password" name="password" type="password" class="form-input" placeholder="••••••••" required />
              </div>
            </div>

            <button class="btn-primary submit-btn" type="submit" [disabled]="loading">
              <span *ngIf="!loading">{{ mode === 'login' ? 'Se connecter' : 'Créer mon compte' }}</span>
              <span *ngIf="loading">Traitement...</span>
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
      background: #f4f5f7;
      font-family: Inter, 'Segoe UI', sans-serif;
    }

    .login-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1.18fr 0.82fr;
      background: linear-gradient(135deg, #061b2d 0%, #07192b 48%, #f2f4f7 48%, #f2f4f7 100%);
      position: relative;
      overflow: hidden;
    }

    .login-page::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 15% 20%, rgba(124, 119, 255, 0.22), transparent 25%),
        radial-gradient(circle at 80% 10%, rgba(255,255,255,0.16), transparent 20%);
      pointer-events: none;
      animation: glowShift 12s ease-in-out infinite alternate;
    }

    .login-hero {
      position: relative;
      z-index: 1;
      color: #edf3ff;
      padding: 4.5rem 3rem 4rem 4rem;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
      gap: 1.5rem;
      animation: fadeUp 0.8s ease-out both;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.7rem 1rem;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(8px);
      border-radius: 999px;
      font-size: 0.8rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.9);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
    }

    .login-brand {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
      line-height: 1;
      animation: floatBrand 6s ease-in-out infinite;
    }

    .brand-name {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: clamp(4.2rem, 5vw, 7rem);
      font-weight: 700;
      color: #f7f9fc;
      letter-spacing: -0.1em;
    }

    .brand-sub {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: 0.38em;
      color: #dfeaff;
      text-transform: uppercase;
      padding-top: 0.9rem;
    }

    .login-hero h1 {
      font-size: clamp(2.2rem, 3vw, 4rem);
      line-height: 1.08;
      margin: 0;
      max-width: 14ch;
      letter-spacing: -0.05em;
    }

    .hero-copy {
      max-width: 38rem;
      margin: 0;
      color: rgba(255,255,255,0.8);
      font-size: 1.08rem;
      line-height: 1.8;
    }

    .feature-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      margin-top: 0.7rem;
    }

    .feature-item {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.7rem 0.9rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 999px;
      color: rgba(255,255,255,0.9);
      font-size: 0.84rem;
      backdrop-filter: blur(8px);
    }

    .feature-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(95,82,255,0.35), rgba(59,130,246,0.25));
      box-shadow: 0 8px 20px rgba(95, 82, 255, 0.25);
    }

    .login-panel {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3.5rem 2rem;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(12px);
      opacity: 0.7;
      animation: orbFloat 10s ease-in-out infinite alternate;
    }

    .orb-one {
      width: 220px;
      height: 220px;
      right: 12%;
      top: 12%;
      background: rgba(96, 92, 255, 0.22);
    }

    .orb-two {
      width: 180px;
      height: 180px;
      left: 18%;
      bottom: 11%;
      background: rgba(79, 70, 229, 0.18);
      animation-delay: 1s;
    }

    .login-card {
      position: relative;
      width: min(100%, 540px);
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 30px;
      padding: 1.65rem 1.8rem 1.5rem;
      box-shadow: 0 30px 70px rgba(13, 19, 35, 0.16);
      backdrop-filter: blur(14px);
      animation: cardLift 0.9s cubic-bezier(0.18, 0.8, 0.22, 1) both;
    }

    .card-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.2rem;
    }

    .mini-avatar {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: linear-gradient(135deg, #5f52ff, #7c6cff);
      box-shadow: 0 12px 24px rgba(95,82,255,0.28);
      color: white;
      font-size: 1.1rem;
    }

    .card-badge {
      padding: 0.5rem 0.9rem;
      font-size: 0.78rem;
      border-radius: 999px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #4338ca;
      background: rgba(95,82,255,0.1);
      border: 1px solid rgba(95,82,255,0.12);
    }

    .auth-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      padding: 0.35rem;
      background: #f3f4f6;
      border-radius: 999px;
      margin-bottom: 1.4rem;
      box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.06);
    }

    .tab-btn {
      border: none;
      border-radius: 999px;
      background: transparent;
      color: #475569;
      padding: 0.9rem 0.8rem;
      font-weight: 700;
      font-size: 0.98rem;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, #5f52ff, #3f36cb);
      color: #fff;
      box-shadow: 0 10px 24px rgba(95, 82, 255, 0.28);
    }

    .auth-form {
      display: grid;
      gap: 1.1rem;
    }

    .form-group {
      display: grid;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.9rem;
      font-weight: 700;
      color: #111827;
    }

    .input-wrap {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      border: 1px solid #e2e8f0;
      background: rgba(255,255,255,0.9);
      border-radius: 16px;
      padding: 0.15rem 0.8rem;
      transition: all 0.25s ease;
      box-shadow: 0 0 0 rgba(95, 82, 255, 0);
    }

    .input-wrap:focus-within {
      border-color: rgba(95,82,255,0.45);
      box-shadow: 0 0 0 4px rgba(95,82,255,0.09);
      transform: translateY(-1px);
    }

    .input-icon {
      font-size: 1.1rem;
      filter: grayscale(0.2);
    }

    .form-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 0.9rem 0;
      font: inherit;
      color: #111827;
      outline: none;
    }

    .submit-btn {
      width: 100%;
      margin-top: 0.35rem;
      border: none;
      border-radius: 999px;
      padding: 1rem 1.2rem;
      font-size: 1.05rem;
      font-weight: 700;
      cursor: pointer;
      color: #fff;
      background: linear-gradient(135deg, #5f52ff, #3f36cb);
      box-shadow: 0 20px 32px rgba(95, 82, 255, 0.25);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 24px 34px rgba(95, 82, 255, 0.3);
    }

    .helper-text {
      margin: 1rem 0 0;
      text-align: center;
      color: #475569;
    }

    .helper-text a {
      font-weight: 800;
      color: #111827;
      text-decoration: none;
    }

    .helper-text a:hover {
      color: #4f46e5;
    }

    @keyframes glowShift {
      0% { transform: scale(1); opacity: 0.7; }
      100% { transform: scale(1.09); opacity: 1; }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes cardLift {
      from { opacity: 0; transform: translateY(24px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes floatBrand {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    @keyframes orbFloat {
      0% { transform: translate3d(0, 0, 0) scale(1); }
      100% { transform: translate3d(0, -18px, 0) scale(1.08); }
    }

    @media (max-width: 980px) {
      .login-page {
        grid-template-columns: 1fr;
        background: linear-gradient(180deg, #07192b 0%, #07192b 34%, #f2f4f7 34%, #f2f4f7 100%);
      }

      .login-hero {
        padding: 2.5rem 1.4rem 1rem;
      }

      .feature-list {
        gap: 0.55rem;
      }

      .login-panel {
        padding: 0 0.9rem 1.5rem;
      }

      .login-card {
        width: min(100%, 440px);
        padding: 1.1rem 0.9rem 1rem;
        border-radius: 24px;
      }
    }

    @media (max-width: 480px) {
      .hero-badge {
        letter-spacing: 0.08em;
        font-size: 0.72rem;
      }

      .brand-name {
        font-size: 3.4rem;
      }

      .brand-sub {
        letter-spacing: 0.2em;
        font-size: 0.9rem;
      }

      .login-hero h1 {
        font-size: 2rem;
      }

      .hero-copy {
        font-size: 0.92rem;
      }

      .feature-item {
        font-size: 0.76rem;
        padding: 0.6rem 0.7rem;
      }

      .submit-btn {
        padding: 0.95rem 1rem;
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
