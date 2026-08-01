import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trust-badges',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trust-badges.component.html',
  styleUrl: './trust-badges.component.css'
})
export class TrustBadgesComponent {
  badges = [
    {
      icon: 'ph-truck',
      title: 'Livraison Gratuite',
      desc: 'Offerte dès 150€ d\'achat partout en Europe'
    },
    {
      icon: 'ph-shield-check',
      title: 'Paiement 100% Sécurisé',
      desc: 'Cryptage SSL 256-bits & Apple Pay / PayPal'
    },
    {
      icon: 'ph-arrow-counter-clockwise',
      title: 'Retours sous 30 Jours',
      desc: 'Échange ou remboursement sans justification'
    },
    {
      icon: 'ph-headset',
      title: 'Service Client Premium',
      desc: 'Conseillers dédiés disponibles 7j/7'
    }
  ];
}
