import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { FirebaseService } from '../../core/services/firebase.service';
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
export class CheckoutComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() closeEvent = new EventEmitter<void>();

  private cartService = inject(CartService);
  private notify = inject(NotificationService);
  private firebaseService = inject(FirebaseService);

  step = 1;
  isCvcFocused = false;
  showSuccessModal = false;
  createdOrderId = '';
  isSubmitting = false;

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

  ngOnInit() {
    const user = this.firebaseService.currentUser();
    if (user) {
      if (user.displayName) {
        const parts = user.displayName.split(' ');
        this.details.firstName = parts[0] || '';
        this.details.lastName = parts.slice(1).join(' ') || '';
      }
      this.details.email = user.email || '';
    }
  }

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

  async submitOrder() {
    if (this.isSubmitting) return;

    if (this.details.paymentMethod === 'card') {
      if (!this.details.cardNumber || !this.details.cardExpiry || !this.details.cardCvc) {
        this.notify.warning('Paiement incomplet', 'Veuillez renseigner vos identifiants de carte bancaire.');
        return;
      }
    }

    this.isSubmitting = true;

    try {
      const user = this.firebaseService.currentUser();
      const orderPayload = {
        userId: user?.uid || 'guest_' + Date.now(),
        userEmail: this.details.email,
        items: this.items().map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          productPrice: i.product.price,
          quantity: i.quantity,
          selectedColor: i.selectedColor,
          selectedSize: i.selectedSize,
          image: i.product.images[0]
        })),
        shippingDetails: {
          firstName: this.details.firstName,
          lastName: this.details.lastName,
          email: this.details.email,
          phone: this.details.phone,
          address: this.details.address,
          city: this.details.city,
          postalCode: this.details.postalCode,
          country: this.details.country
        },
        paymentMethod: this.details.paymentMethod,
        subtotal: this.subtotal(),
        discount: this.discount(),
        shippingFee: this.shippingFee(),
        grandTotal: this.grandTotal(),
        status: 'confirmed' as const,
        createdAt: new Date().toISOString()
      };

      this.createdOrderId = await this.firebaseService.saveOrder(orderPayload);
      this.showSuccessModal = true;
      this.notify.success('Paiement en ligne accepté ! 💳', `Votre commande #${this.createdOrderId} a été enregistrée en base de données.`);
    } catch (e: any) {
      this.notify.error('Erreur de commande', 'Une erreur est survenue lors de la validation.');
    } finally {
      this.isSubmitting = false;
    }
  }

  onSuccessClosed() {
    this.showSuccessModal = false;
    this.cartService.clearCart();
    this.closeCheckout();
  }
}
