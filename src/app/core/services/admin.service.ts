import { Injectable, signal, computed, inject } from '@angular/core';
import { UserOrder, UserProfile } from '../models/user.model';
import { FirebaseService } from './firebase.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private isAdminViewSignal = signal<boolean>(false);
  private ordersSignal = signal<UserOrder[]>([]);
  private usersSignal = signal<UserProfile[]>([]);

  isAdminView = this.isAdminViewSignal.asReadonly();
  orders = this.ordersSignal.asReadonly();
  users = this.usersSignal.asReadonly();

  private firebaseService = inject(FirebaseService);
  private notify = inject(NotificationService);

  constructor() {
    this.loadOrdersAndUsers();
  }

  toggleAdminView() {
    this.isAdminViewSignal.update(val => !val);
  }

  setAdminView(open: boolean) {
    this.isAdminViewSignal.set(open);
  }

  loadOrdersAndUsers() {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('aura_orders') || '[]');
      this.ordersSignal.set(storedOrders);

      const currentUser = this.firebaseService.currentUser();
      const demoUsers: UserProfile[] = [
        {
          uid: 'user_admin_1',
          email: 'admin@auraluxe.com',
          displayName: 'Administrateur Principal',
          createdAt: '2026-01-10T10:00:00.000Z'
        },
        {
          uid: 'user_client_1',
          email: 'sophie.martin@gmail.com',
          displayName: 'Sophie Martin',
          createdAt: '2026-06-14T14:30:00.000Z'
        },
        {
          uid: 'user_client_2',
          email: 'thomas.laurent@yahoo.fr',
          displayName: 'Thomas Laurent',
          createdAt: '2026-07-02T09:15:00.000Z'
        }
      ];

      if (currentUser && !demoUsers.some(u => u.email === currentUser.email)) {
        demoUsers.unshift(currentUser);
      }
      this.usersSignal.set(demoUsers);
    } catch (e) {}
  }

  updateOrderStatus(orderId: string, newStatus: UserOrder['status']) {
    this.ordersSignal.update(list => 
      list.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );
    try {
      localStorage.setItem('aura_orders', JSON.stringify(this.ordersSignal()));
    } catch (e) {}
    this.notify.success('Statut mis à jour ! 🚚', `La commande ${orderId} est désormais "${newStatus}".`);
  }
}
