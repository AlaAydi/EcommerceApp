import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-success-modal.component.html',
  styleUrl: './order-success-modal.component.css'
})
export class OrderSuccessModalComponent {
  @Output() closeEvent = new EventEmitter<void>();

  orderNumber = Math.floor(100000 + Math.random() * 900000);

  close() {
    this.closeEvent.emit();
  }
}
