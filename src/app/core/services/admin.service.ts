import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { UserOrder, UserProfile, UserRole } from '../models/user.model';
import { FirebaseService } from './firebase.service';
import { NotificationService } from './notification.service';
import { OrderEmailService } from './order-email.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private isAdminViewSignal = signal<boolean>(false);
  private ordersSignal = signal<UserOrder[]>([]);
  private usersSignal = signal<UserProfile[]>([]);
  private readonly usersStorageKey = 'aura_users';

  isAdminView = this.isAdminViewSignal.asReadonly();
  orders = this.ordersSignal.asReadonly();
  users = this.usersSignal.asReadonly();

  private firebaseService = inject(FirebaseService);
  private notify = inject(NotificationService);
  private orderEmailService = inject(OrderEmailService);

  constructor() {
    this.ensureDefaultAdminUser();
    this.loadOrdersAndUsers();
    window.addEventListener('storage', () => this.loadOrdersAndUsers());
    effect(() => {
      const currentUser = this.firebaseService.currentUser();
      if (currentUser) {
        this.upsertUser(currentUser, false);
      }
    });
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
      this.ordersSignal.set(Array.isArray(storedOrders) ? storedOrders.map(order => this.normalizeOrder(order)) : []);
      this.usersSignal.set(this.loadUsersFromStorage());
    } catch (e) {}
  }

  private ensureDefaultAdminUser() {
    const defaultAdmin: UserProfile = {
      uid: 'user_admin_1',
      email: 'admin@auraluxe.com',
      displayName: 'Administrateur Principal',
      role: 'admin',
      createdAt: '2026-01-10T10:00:00.000Z'
    };

    try {
      const existing = JSON.parse(localStorage.getItem(this.usersStorageKey) || '[]');
      const list = Array.isArray(existing) ? existing : [];
      const adminExists = list.some((user: Partial<UserProfile>) => (user.email || '').toLowerCase() === defaultAdmin.email.toLowerCase());

      if (!adminExists) {
        const next = [defaultAdmin, ...list];
        localStorage.setItem(this.usersStorageKey, JSON.stringify(next));
      }
    } catch (e) {
      localStorage.setItem(this.usersStorageKey, JSON.stringify([defaultAdmin]));
    }
  }

  private normalizeOrder(order: Partial<UserOrder>): UserOrder {
    const createdAt = order.createdAt || new Date().toISOString();
    const status = order.status || 'confirmed';
    const statusUpdatedAt = order.statusUpdatedAt || createdAt;
    return {
      id: order.id || 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      userId: order.userId || '',
      userEmail: order.userEmail || '',
      items: order.items || [],
      shippingDetails: order.shippingDetails || {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'France'
      },
      paymentMethod: order.paymentMethod || 'card',
      subtotal: order.subtotal || 0,
      discount: order.discount || 0,
      shippingFee: order.shippingFee || 0,
      grandTotal: order.grandTotal || 0,
      status,
      statusUpdatedAt,
      statusHistory: order.statusHistory?.length
        ? order.statusHistory
        : [{ status, at: statusUpdatedAt }],
      createdAt
    };
  }

  private loadUsersFromStorage(): UserProfile[] {
    const defaults: UserProfile[] = [
      {
        uid: 'user_admin_1',
        email: 'admin@auraluxe.com',
        displayName: 'Administrateur Principal',
        role: 'admin',
        createdAt: '2026-01-10T10:00:00.000Z'
      },
      {
        uid: 'user_client_1',
        email: 'sophie.martin@gmail.com',
        displayName: 'Sophie Martin',
        role: 'client',
        createdAt: '2026-06-14T14:30:00.000Z'
      },
      {
        uid: 'user_client_2',
        email: 'thomas.laurent@yahoo.fr',
        displayName: 'Thomas Laurent',
        role: 'client',
        createdAt: '2026-07-02T09:15:00.000Z'
      }
    ];

    try {
      const stored = JSON.parse(localStorage.getItem(this.usersStorageKey) || '[]');
      const normalized = Array.isArray(stored) && stored.length > 0 ? stored.map(user => this.normalizeUser(user)) : defaults;
      this.saveUsersToStorage(normalized);
      return normalized;
    } catch (e) {
      this.saveUsersToStorage(defaults);
      return defaults;
    }
  }

  private normalizeUser(user: Partial<UserProfile>): UserProfile {
    const email = user.email || '';
    return {
      uid: user.uid || 'user_' + Date.now(),
      email,
      displayName: user.displayName || email.split('@')[0] || 'Utilisateur',
      role: user.role || (email.toLowerCase().includes('admin') ? 'admin' : 'client'),
      createdAt: user.createdAt || new Date().toISOString(),
      photoURL: user.photoURL,
      phone: user.phone,
      address: user.address
    };
  }

  private saveUsersToStorage(users: UserProfile[]) {
    try {
      localStorage.setItem(this.usersStorageKey, JSON.stringify(users));
    } catch (e) {}
  }

  private upsertUser(user: UserProfile, persist = true) {
    const normalized = this.normalizeUser(user);
    this.usersSignal.update(list => {
      const exists = list.some(existing => existing.uid === normalized.uid || existing.email === normalized.email);
      const next = exists
        ? list.map(existing => existing.uid === normalized.uid || existing.email === normalized.email ? { ...existing, ...normalized } : existing)
        : [normalized, ...list];
      if (persist) {
        this.saveUsersToStorage(next);
      }
      return next;
    });
  }

  addUser(user: Omit<UserProfile, 'uid' | 'createdAt'>): UserProfile {
    const created = this.normalizeUser({
      ...user,
      uid: 'user_' + Date.now(),
      createdAt: new Date().toISOString()
    });
    this.usersSignal.update(list => {
      const next = [created, ...list];
      this.saveUsersToStorage(next);
      return next;
    });
    return created;
  }

  updateUser(uid: string, changes: Partial<UserProfile>) {
    this.usersSignal.update(list => {
      const next = list.map(user => user.uid === uid ? this.normalizeUser({ ...user, ...changes, uid }) : user);
      this.saveUsersToStorage(next);
      return next;
    });
  }

  deleteUser(uid: string) {
    this.usersSignal.update(list => {
      const next = list.filter(user => user.uid !== uid);
      this.saveUsersToStorage(next);
      return next;
    });
  }

  getRoleLabel(role: UserRole): string {
    return role === 'admin' ? 'ADMINISTRATEUR' : 'CLIENT';
  }

  getStatusLabel(status: UserOrder['status']): string {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'processing': return 'En préparation';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      default: return status;
    }
  }

  updateOrderStatus(orderId: string, newStatus: UserOrder['status']) {
    const updatedAt = new Date().toISOString();
    let updatedOrder: UserOrder | null = null;

    this.ordersSignal.update(list =>
      list.map(o => {
        if (o.id !== orderId) return o;

        updatedOrder = {
          ...o,
          status: newStatus,
          statusUpdatedAt: updatedAt,
          statusHistory: [
            ...(o.statusHistory || [{ status: o.status, at: o.statusUpdatedAt || o.createdAt }]),
            { status: newStatus, at: updatedAt }
          ]
        };

        return updatedOrder;
      })
    );

    try {
      const nextOrders = this.ordersSignal();
      localStorage.setItem('aura_orders', JSON.stringify(nextOrders));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'aura_orders',
        newValue: JSON.stringify(nextOrders)
      }));
    } catch (e) {}

    this.firebaseService.updateOrderStatus(orderId, newStatus).catch(() => {});

    if (updatedOrder) {
      this.orderEmailService.sendStatusUpdateEmail(updatedOrder).then(sent => {
        if (sent) {
          this.notify.info('Email envoyé', `Le client ${updatedOrder?.userEmail} a reçu la mise à jour de sa commande.`);
        }
      });

      const notification = {
        id: `order-${orderId}-${Date.now()}`,
        title: 'Commande mise à jour',
        message: `Votre commande ${orderId} est maintenant ${this.getStatusLabel(newStatus).toLowerCase()}.`,
        createdAt: new Date().toISOString()
      };

      const existingNotifications = JSON.parse(localStorage.getItem('aura_client_notifications') || '[]');
      const list = Array.isArray(existingNotifications) ? existingNotifications : [];
      list.push(notification);
      localStorage.setItem('aura_client_notifications', JSON.stringify(list));
    }

    this.notify.success('Statut mis à jour ! 🚚', `La commande ${orderId} est désormais "${newStatus}".`);
  }
}
