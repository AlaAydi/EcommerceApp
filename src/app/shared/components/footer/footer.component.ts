import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="site-footer">
      <div class="container-xl footer-grid">
        <!-- Brand Column -->
        <div class="footer-col brand-col">
          <div class="footer-brand">
            <span class="serif-title footer-brand-name">AURA</span>
            <span class="footer-brand-sub">LUXE</span>
          </div>
          <p class="footer-brand-desc">
            Votre destination premium pour découvrir des produits d'exception. Qualité, élégance et innovation, au service de votre quotidien.
          </p>
          <div class="footer-socials">
            <a href="#" class="social-link" title="Instagram"><i class="ph ph-instagram-logo"></i></a>
            <a href="#" class="social-link" title="Twitter"><i class="ph ph-x-logo"></i></a>
            <a href="#" class="social-link" title="Facebook"><i class="ph ph-facebook-logo"></i></a>
            <a href="#" class="social-link" title="LinkedIn"><i class="ph ph-linkedin-logo"></i></a>
          </div>
        </div>

        <!-- Links Columns -->
        <div class="footer-col">
          <h4 class="footer-heading">Boutique</h4>
          <ul class="footer-links">
            <li><a href="#">Nouveautés</a></li>
            <li><a href="#">Collections</a></li>
            <li><a href="#">Best Sellers</a></li>
            <li><a href="#">Promotions</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 class="footer-heading">Service Client</h4>
          <ul class="footer-links">
            <li><a href="#">Centre d'aide</a></li>
            <li><a href="#">Suivi de commande</a></li>
            <li><a href="#">Retours & Échanges</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 class="footer-heading">À Propos</h4>
          <ul class="footer-links">
            <li><a href="#">Notre Histoire</a></li>
            <li><a href="#">Engagements RSE</a></li>
            <li><a href="#">Presse</a></li>
            <li><a href="#">Carrières</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container-xl footer-bottom-inner">
          <p class="copyright">© 2026 AURA LUXE. Tous droits réservés.</p>
          <div class="payment-icons">
            <span class="pay-icon">💳 Visa</span>
            <span class="pay-icon">💳 Mastercard</span>
            <span class="pay-icon">🍎 Apple Pay</span>
            <span class="pay-icon">🅿️ PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: var(--bg-surface);
      border-top: 1px solid var(--border-light);
      margin-top: 4rem;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 2.5rem;
      padding: 3rem 0 2rem;
    }
    .footer-brand {
      display: flex;
      align-items: baseline;
      gap: 0.2rem;
      margin-bottom: 0.75rem;
    }
    .footer-brand-name {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: var(--text-main);
    }
    .footer-brand-sub {
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.25em;
      color: var(--accent-primary);
    }
    .footer-brand-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    .footer-socials {
      display: flex;
      gap: 0.6rem;
    }
    .social-link {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-full);
      background: var(--bg-surface-secondary);
      border: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
      color: var(--text-muted);
      transition: all var(--transition-normal);
    }
    .social-link:hover {
      background: var(--accent-primary-light);
      color: var(--accent-primary);
      border-color: rgba(79, 70, 229, 0.3);
      transform: translateY(-2px);
    }

    .footer-heading {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 1rem;
    }
    .footer-links {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }
    .footer-links a {
      font-size: 0.85rem;
      color: var(--text-muted);
      transition: color var(--transition-fast);
    }
    .footer-links a:hover {
      color: var(--accent-primary);
    }

    .footer-bottom {
      border-top: 1px solid var(--border-light);
      padding: 1.25rem 0;
    }
    .footer-bottom-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .copyright {
      font-size: 0.8rem;
      color: var(--text-subtle);
    }
    .payment-icons {
      display: flex;
      gap: 1rem;
    }
    .pay-icon {
      font-size: 0.78rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
      .brand-col {
        grid-column: 1 / -1;
      }
      .footer-bottom-inner {
        flex-direction: column;
        gap: 0.75rem;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}
