import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserOrder } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class OrderEmailService {
  async sendStatusUpdateEmail(order: UserOrder): Promise<boolean> {
    const config = environment.emailjs;

    if (!config?.serviceId || !config?.templateId || !config?.publicKey) {
      return false;
    }

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: config.serviceId,
          template_id: config.templateId,
          user_id: config.publicKey,
          template_params: {
            to_email: order.userEmail,
            to_name: `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`.trim() || order.userEmail,
            order_id: order.id,
            order_status: this.getStatusLabel(order.status),
            order_total: order.grandTotal.toFixed(2),
            status_updated_at: order.statusUpdatedAt || order.createdAt,
            order_url: `${window.location.origin}/orders/${order.id}`
          }
        })
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private getStatusLabel(status: UserOrder['status']): string {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'processing': return 'En préparation';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      default: return status;
    }
  }
}
