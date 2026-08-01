import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credit-card-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credit-card-preview.component.html',
  styleUrl: './credit-card-preview.component.css'
})
export class CreditCardPreviewComponent {
  @Input() cardNumber: string = '';
  @Input() holderName: string = '';
  @Input() expiryDate: string = '';
  @Input() cvc: string = '';
  @Input() isFlipped: boolean = false;

  get formattedCardNumber(): string {
    if (!this.cardNumber) return '';
    const clean = this.cardNumber.replace(/\s+/g, '');
    const parts = clean.match(/.{1,4}/g);
    return parts ? parts.join(' ') : this.cardNumber;
  }
}
