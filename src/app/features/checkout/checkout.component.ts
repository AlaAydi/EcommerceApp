import { Component, Input, Output, EventEmitter,  inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { CheckoutDetails } from '../../core/models/cart.model';
import { CheckoutStepperComponent } from './checkout-stepper/checkout-stepper.component';
import { CreditCardPreviewComponent } from './credit-card-preview/credit-card-preview.component';
import { OrderSuccessModalComponent } from './order-success-modal/order-success-modal.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CheckoutStepperComponent, 
    CreditCardPreviewComponent, 
    OrderSuccessModalComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  @Input() isOpen: boolean = false;
  @Output() closeEvent = new EventEmitter<void>();

  private cartService = inject(CartService);
  private notify = inject(NotificationService);

  step = 1;
  isCvcFocused = false;
  showSuccessModal = false;

  details: CheckoutDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardHolder: ''
  };

  items = this.cartService.items;
  itemCount = this.cartService.itemCount;
  subtotal = this.cartService.subtotal;
  discount = this.cartService.discountAmount;
  shippingFee = this.cartService.shippingFee;
  grandTotal = this.cartService.grandTotal;


  closeCheckout() {
    this.closeEvent.emit();
  }

  goToStep(newStep: number) {
    if (newStep === 2) {
      if (!this.details.firstName || !this.details.email || !this.details.address) {
        this.notify.warning('Champs requis', 'Veuillez remplir votre prénom, e-mail et adresse de livraison.');
        return;
      }
    }
    this.step = newStep;
  }

  submitOrder() {
    this.showSuccessModal = true;
    this.notify.success('Paiement accepté !', 'Votre commande a été traitée avec succès.');
  }

  onSuccessClosed() {
    this.showSuccessModal = false;
    this.cartService.clearCart();
    this.closeCheckout();
  }
}
