import { Injectable, signal } from '@angular/core';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc 
} from 'firebase/firestore';
import { UserProfile, UserOrder } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app!: FirebaseApp;
  public auth!: Auth;
  public db!: Firestore;

  currentUser = signal<UserProfile | null>(null);
  isLoading = signal<boolean>(true);
  authError = signal<string | null>(null);

  constructor() {
    try {
      if (!getApps().length) {
        this.app = initializeApp(environment.firebase);
      } else {
        this.app = getApp();
      }
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.listenToAuthChanges();
    } catch (e) {
      console.warn('Initialisation Firebase : Mode local activé', e);
      this.loadStoredUser();
    }
  }

  private listenToAuthChanges() {
    if (!this.auth) {
      this.loadStoredUser();
      return;
    }
    onAuthStateChanged(this.auth, async (user: FirebaseUser | null) => {
      if (user) {
        let profile = await this.getUserProfile(user.uid);
        if (!profile) {
          profile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'Client Aura',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString()
          };
          await this.saveUserProfile(profile);
        }
        this.currentUser.set(profile);
        localStorage.setItem('aura_user', JSON.stringify(profile));
      } else {
        this.loadStoredUser();
      }
      this.isLoading.set(false);
    });
  }

  private loadStoredUser() {
    const stored = localStorage.getItem('aura_user');
    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored));
      } catch (e) {
        this.currentUser.set(null);
      }
    } else {
      this.currentUser.set(null);
    }
    this.isLoading.set(false);
  }

  async signUp(email: string, pass: string, name: string): Promise<UserProfile> {
    this.authError.set(null);

    const isApiKeyPlaceholder = !environment.firebase.apiKey || environment.firebase.apiKey.includes('VOTRE_API_KEY');

    if (!isApiKeyPlaceholder && this.auth) {
      try {
        const res = await createUserWithEmailAndPassword(this.auth, email, pass);
        if (res.user) {
          await updateProfile(res.user, { displayName: name });
          const userProfile: UserProfile = {
            uid: res.user.uid,
            email: res.user.email || email,
            displayName: name,
            createdAt: new Date().toISOString()
          };
          await this.saveUserProfile(userProfile);
          this.currentUser.set(userProfile);
          localStorage.setItem('aura_user', JSON.stringify(userProfile));
          return userProfile;
        }
      } catch (err: any) {
        console.error('Firebase Auth SignUp Error:', err);
        
        // Si l'erreur est auth/operation-not-allowed ou clé invalide
        if (err.code === 'auth/operation-not-allowed') {
          // Créer l'utilisateur localement pour ne pas bloquer l'expérience et informer
          const message = this.formatAuthError(err.code);
          this.authError.set(message);
          throw new Error(message);
        }

        if (this.isNetworkOrKeyError(err)) {
          return this.createMockUser(email, name);
        }

        const message = this.formatAuthError(err.code || err.message);
        this.authError.set(message);
        throw new Error(message);
      }
    }

    return this.createMockUser(email, name);
  }

  async signIn(email: string, pass: string): Promise<UserProfile> {
    this.authError.set(null);

    const isApiKeyPlaceholder = !environment.firebase.apiKey || environment.firebase.apiKey.includes('VOTRE_API_KEY');

    if (!isApiKeyPlaceholder && this.auth) {
      try {
        const res = await signInWithEmailAndPassword(this.auth, email, pass);
        const profile = await this.getUserProfile(res.user.uid) || {
          uid: res.user.uid,
          email: res.user.email || email,
          displayName: res.user.displayName || email.split('@')[0],
          createdAt: new Date().toISOString()
        };
        this.currentUser.set(profile);
        localStorage.setItem('aura_user', JSON.stringify(profile));
        return profile;
      } catch (err: any) {
        console.error('Firebase Auth SignIn Error:', err);
        if (this.isNetworkOrKeyError(err)) {
          return this.loginMockUser(email);
        }
        const message = this.formatAuthError(err.code || err.message);
        this.authError.set(message);
        throw new Error(message);
      }
    }

    return this.loginMockUser(email);
  }

  private createMockUser(email: string, name: string): UserProfile {
    const mockUser: UserProfile = {
      uid: 'user_' + Date.now(),
      email: email,
      displayName: name,
      createdAt: new Date().toISOString()
    };
    this.currentUser.set(mockUser);
    localStorage.setItem('aura_user', JSON.stringify(mockUser));
    return mockUser;
  }

  private loginMockUser(email: string): UserProfile {
    const displayName = email.split('@')[0];
    const mockUser: UserProfile = {
      uid: 'user_' + Date.now(),
      email: email,
      displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      createdAt: new Date().toISOString()
    };
    this.currentUser.set(mockUser);
    localStorage.setItem('aura_user', JSON.stringify(mockUser));
    return mockUser;
  }

  private isNetworkOrKeyError(err: any): boolean {
    if (!err) return false;
    const code = err.code || '';
    const msg = err.message || '';
    return code === 'auth/api-key-not-valid' || 
           code === 'auth/invalid-api-key' || 
           code === 'auth/network-request-failed' ||
           msg.includes('API key') ||
           msg.includes('network');
  }

  async logout(): Promise<void> {
    if (this.auth) {
      try {
        await signOut(this.auth);
      } catch (e) {}
    }
    this.currentUser.set(null);
    localStorage.removeItem('aura_user');
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    if (this.db) {
      try {
        const userRef = doc(this.db, 'users', profile.uid);
        await setDoc(userRef, profile, { merge: true });
      } catch (e) {}
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (this.db) {
      try {
        const userRef = doc(this.db, 'users', uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          return snap.data() as UserProfile;
        }
      } catch (e) {}
    }
    return null;
  }

  async saveOrder(orderData: Omit<UserOrder, 'id'>): Promise<string> {
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const fullOrder: UserOrder = {
      ...orderData,
      id: orderId
    };

    if (this.db) {
      try {
        const ordersRef = collection(this.db, 'orders');
        await addDoc(ordersRef, fullOrder);
      } catch (e) {}
    }

    try {
      const existing = JSON.parse(localStorage.getItem('aura_orders') || '[]');
      existing.unshift(fullOrder);
      localStorage.setItem('aura_orders', JSON.stringify(existing));
    } catch (e) {}

    return orderId;
  }

  async syncWishlist(uid: string, wishlistIds: string[]): Promise<void> {
    if (this.db) {
      try {
        const userRef = doc(this.db, 'users', uid);
        await setDoc(userRef, { wishlist: wishlistIds }, { merge: true });
      } catch (e) {}
    }
  }

  private formatAuthError(code: string): string {
    switch (code) {
      case 'auth/operation-not-allowed':
        return 'L\'inscription par Email/Mot de passe n\'est pas activée dans votre Console Firebase. Allez sur console.firebase.google.com > Authentication > Sign-in method > Activez "Email/Mot de passe".';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.';
      case 'auth/email-already-in-use':
        return 'Cet email est déjà inscrit sur Firebase ! Cliquez sur "Se Connecter" pour vous connecter, ou utilisez une autre adresse email.';
      case 'auth/weak-password':
        return 'Le mot de passe est trop court (minimum 6 caractères).';
      case 'auth/invalid-email':
        return 'Adresse email invalide.';
      case 'auth/unauthorized-domain':
        return 'Ce domaine (localhost) n\'est pas autorisé dans votre Console Firebase > Authentication > Settings > Authorized Domains.';
      default:
        return `Erreur Firebase (${code || '400'}) : Vérifiez que l'authentification Email/Password est activée dans votre console Firebase.`;
    }
  }
}
