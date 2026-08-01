import { Injectable, signal } from '@angular/core';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  toasts = signal<ToastNotification[]>([]);

  show(notification: Omit<ToastNotification, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastNotification = {
      id,
      duration: 3500,
      ...notification
    };

    this.toasts.update(current => [...current, newToast]);

    if (newToast.duration) {
      setTimeout(() => {
        this.remove(id);
      }, newToast.duration);
    }
  }

  success(title: string, message: string) {
    this.show({ type: 'success', title, message });
  }

  info(title: string, message: string) {
    this.show({ type: 'info', title, message });
  }

  warning(title: string, message: string) {
    this.show({ type: 'warning', title, message });
  }

  error(title: string, message: string) {
    this.show({ type: 'error', title, message });
  }

  remove(id: string) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
