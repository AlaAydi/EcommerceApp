import { Injectable, signal, computed, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AdminService } from './admin.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseService = inject(FirebaseService);
  private adminService = inject(AdminService);
  private notify = inject(NotificationService);

  private isModalOpenSignal = signal<boolean>(false);
  private modalModeSignal = signal<'login' | 'register'>('login');
  private isRegisterSuccessSignal = signal<boolean>(false);
  private registeredUserNameSignal = signal<string>('');

  isModalOpen = this.isModalOpenSignal.asReadonly();
  modalMode = this.modalModeSignal.asReadonly();
  isRegisterSuccessOpen = this.isRegisterSuccessSignal.asReadonly();
  registeredUserName = this.registeredUserNameSignal.asReadonly();

  currentUser = this.firebaseService.currentUser;
  isLoggedIn = computed(() => !!this.currentUser());

  openModal(mode: 'login' | 'register' = 'login') {
    this.modalModeSignal.set(mode);
    this.isModalOpenSignal.set(true);
  }

  closeModal() {
    this.isModalOpenSignal.set(false);
  }

  setModalMode(mode: 'login' | 'register') {
    this.modalModeSignal.set(mode);
  }

  closeRegisterSuccessModal() {
    this.isRegisterSuccessSignal.set(false);
  }

  async login(email: string, pass: string): Promise<boolean> {
    try {
      const user = await this.firebaseService.signIn(email, pass);
      this.adminService.setAdminView(user.role === 'admin');
      this.notify.success('Bienvenue ! 👋', `Ravi de vous revoir, ${user.displayName}.`);
      this.closeModal();
      return true;
    } catch (err: any) {
      this.notify.error('Échec de la connexion', err.message || 'Email ou mot de passe incorrect.');
      return false;
    }
  }

  async register(email: string, pass: string, name: string): Promise<boolean> {
    try {
      const user = await this.firebaseService.signUp(email, pass, name);
      await this.firebaseService.logout();
      this.adminService.setAdminView(false);
      this.closeModal();
      this.registeredUserNameSignal.set(user.displayName || name);
      this.isRegisterSuccessSignal.set(true);
      return true;
    } catch (err: any) {
      this.notify.error('Échec de l\'inscription', err.message || 'Erreur lors de la création du compte.');
      return false;
    }
  }

  async logout(): Promise<void> {
    await this.firebaseService.logout();
    this.adminService.setAdminView(false);
    this.notify.info('Déconnexion', 'Vous avez été déconnecté de votre compte.');
  }
}
