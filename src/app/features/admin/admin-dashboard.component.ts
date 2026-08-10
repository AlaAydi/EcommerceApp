import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { AdminService } from '../../core/services/admin.service';
import { NotificationService } from '../../core/services/notification.service';
import { Product, CategoryType } from '../../core/models/product.model';
import { UserOrder } from '../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-dashboard-wrapper">
      <!-- Admin Top Banner -->
      <div class="admin-header-bar">
        <div class="container-xl admin-bar-content">
          <div class="admin-brand">
            <span class="badge-admin">ADMINISTRATEUR</span>
            <h2>Espace Administration Aura Luxe</h2>
          </div>
          <button class="btn-secondary exit-admin-btn" (click)="exitAdmin()">
            <i class="ph ph-shopping-bag-open"></i>
            Retour à la boutique
          </button>
        </div>
      </div>

      <div class="container-xl admin-main">
        <!-- Sidebar Navigation Tabs -->
        <nav class="admin-nav-tabs">
          <button 
            class="nav-tab-btn" 
            [class.active]="activeTab === 'overview'" 
            (click)="activeTab = 'overview'"
          >
            <i class="ph ph-chart-line-up"></i> Vue d'ensemble
          </button>
          <button 
            class="nav-tab-btn" 
            [class.active]="activeTab === 'products'" 
            (click)="activeTab = 'products'"
          >
            <i class="ph ph-package"></i> Produits ({{ products().length }})
          </button>
          <button 
            class="nav-tab-btn" 
            [class.active]="activeTab === 'orders'" 
            (click)="activeTab = 'orders'"
          >
            <i class="ph ph-receipt"></i> Commandes ({{ orders().length }})
          </button>
          <button 
            class="nav-tab-btn" 
            [class.active]="activeTab === 'users'" 
            (click)="activeTab = 'users'"
          >
            <i class="ph ph-users"></i> Utilisateurs ({{ users().length }})
          </button>
        </nav>

        <!-- Tab Content Views -->

        <!-- TAB 1: OVERVIEW -->
        <div class="tab-pane" *ngIf="activeTab === 'overview'">
          <div class="metrics-grid">
            <div class="metric-card glass-card">
              <div class="metric-icon bg-indigo"><i class="ph ph-currency-eur"></i></div>
              <div class="metric-info">
                <span class="metric-label">Chiffre d'Affaires</span>
                <span class="metric-value">{{ totalRevenue | number:'1.2-2' }} €</span>
              </div>
            </div>
            <div class="metric-card glass-card">
              <div class="metric-icon bg-emerald"><i class="ph ph-shopping-cart-simple"></i></div>
              <div class="metric-info">
                <span class="metric-label">Commandes Passées</span>
                <span class="metric-value">{{ orders().length }}</span>
              </div>
            </div>
            <div class="metric-card glass-card">
              <div class="metric-icon bg-amber"><i class="ph ph-armchair"></i></div>
              <div class="metric-info">
                <span class="metric-label">Produits en Vente</span>
                <span class="metric-value">{{ products().length }}</span>
              </div>
            </div>
            <div class="metric-card glass-card">
              <div class="metric-icon bg-rose"><i class="ph ph-users-three"></i></div>
              <div class="metric-info">
                <span class="metric-label">Clients Inscrits</span>
                <span class="metric-value">{{ users().length }}</span>
              </div>
            </div>
          </div>

          <div class="overview-section glass-card">
            <h3>Dernières Commandes</h3>
            <div class="table-responsive" *ngIf="orders().length > 0">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>N° Commande</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Montant Total</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let ord of orders().slice(0, 5)">
                    <td class="font-bold">#{{ ord.id }}</td>
                    <td>{{ ord.shippingDetails.firstName }} {{ ord.shippingDetails.lastName }}</td>
                    <td>{{ ord.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td class="font-bold text-accent">{{ ord.grandTotal | number:'1.2-2' }} €</td>
                    <td>
                      <span class="status-badge" [ngClass]="ord.status">{{ getStatusLabel(ord.status) }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p *ngIf="orders().length === 0" class="empty-msg">Aucune commande enregistrée pour le moment.</p>
          </div>
        </div>

        <!-- TAB 2: PRODUCTS (CRUD) -->
        <div class="tab-pane" *ngIf="activeTab === 'products'">
          <div class="crud-toolbar">
            <div class="search-filter-group">
              <input 
                type="text" 
                class="admin-search-input" 
                placeholder="Rechercher un produit..." 
                [(ngModel)]="productSearch"
              />
              <select class="admin-select" [(ngModel)]="selectedCategory">
                <option value="all">Toutes les catégories</option>
                <option value="electronics">Électronique</option>
                <option value="fashion">Mode & Style</option>
                <option value="accessories">Accessoires Luxe</option>
                <option value="home">Maison & Design</option>
                <option value="beauty">Beauté & Soins</option>
              </select>
            </div>
            <button class="btn-primary" (click)="openAddProductModal()">
              <i class="ph ph-plus-circle"></i> Ajouter un Produit
            </button>
          </div>

          <div class="table-responsive glass-card">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Produit</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let prod of filteredProducts">
                  <td>
                    <img [src]="prod.images[0]" [alt]="prod.name" class="table-prod-img" />
                  </td>
                  <td>
                    <div class="prod-name-block">
                      <strong>{{ prod.name }}</strong>
                      <span class="text-subtle">{{ prod.subtitle }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="category-chip">{{ prod.category | uppercase }}</span>
                  </td>
                  <td class="font-bold">{{ prod.price | number:'1.2-2' }} €</td>
                  <td>
                    <span class="stock-badge" [class.in-stock]="prod.inStock" [class.out-stock]="!prod.inStock">
                      {{ prod.inStock ? 'En Stock' : 'Épuisé' }}
                    </span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="action-btn-sm edit" (click)="openEditProductModal(prod)" title="Éditer">
                        <i class="ph ph-pencil-simple"></i>
                      </button>
                      <button class="action-btn-sm delete" (click)="deleteProduct(prod)" title="Supprimer">
                        <i class="ph ph-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 3: ORDERS -->
        <div class="tab-pane" *ngIf="activeTab === 'orders'">
          <div class="table-responsive glass-card">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Client & E-mail</th>
                  <th>Articles</th>
                  <th>Montant</th>
                  <th>Changer Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ord of orders()">
                  <td class="font-bold">#{{ ord.id }}</td>
                  <td>
                    <strong>{{ ord.shippingDetails.firstName }} {{ ord.shippingDetails.lastName }}</strong>
                    <div class="text-subtle">{{ ord.userEmail }}</div>
                  </td>
                  <td>
                    <div class="order-items-summary">
                      <span *ngFor="let item of ord.items">
                        {{ item.quantity }}x {{ item.productName }}
                      </span>
                    </div>
                  </td>
                  <td class="font-bold text-accent">{{ ord.grandTotal | number:'1.2-2' }} €</td>
                  <td>
                    <select 
                      class="admin-select select-sm" 
                      [ngModel]="ord.status" 
                      (ngModelChange)="updateOrderStatus(ord.id, $event)"
                    >
                      <option value="confirmed">Confirmée</option>
                      <option value="processing">En préparation</option>
                      <option value="shipped">Expédiée</option>
                      <option value="delivered">Livrée</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 4: USERS -->
        <div class="tab-pane" *ngIf="activeTab === 'users'">
          <div class="table-responsive glass-card">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID Client</th>
                  <th>Nom Complet</th>
                  <th>Adresse E-mail</th>
                  <th>Date d'Inscription</th>
                  <th>Rôle</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let usr of users()">
                  <td class="text-subtle">{{ usr.uid.substring(0, 10) }}...</td>
                  <td class="font-bold">{{ usr.displayName }}</td>
                  <td>{{ usr.email }}</td>
                  <td>{{ usr.createdAt | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <span class="role-badge" [class.admin-role]="usr.email.includes('admin')">
                      {{ usr.email.includes('admin') ? 'ADMINISTRATEUR' : 'CLIENT' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- MODAL ADD / EDIT PRODUCT -->
      <div class="modal-backdrop" *ngIf="showProductModal" (click)="closeProductModal()">
        <div class="modal-card glass-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editMode ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit' }}</h3>
            <button class="close-btn" (click)="closeProductModal()"><i class="ph ph-x"></i></button>
          </div>

          <form (ngSubmit)="saveProduct()" class="product-form">
            <div class="form-row">
              <div class="form-group">
                <label>Nom du produit *</label>
                <input type="text" [(ngModel)]="prodForm.name" name="name" required class="form-input" />
              </div>
              <div class="form-group">
                <label>Sous-titre / Description courte *</label>
                <input type="text" [(ngModel)]="prodForm.subtitle" name="subtitle" required class="form-input" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Catégorie *</label>
                <select [(ngModel)]="prodForm.category" name="category" required class="form-input">
                  <option value="electronics">Électronique</option>
                  <option value="fashion">Mode & Style</option>
                  <option value="accessories">Accessoires Luxe</option>
                  <option value="home">Maison & Design</option>
                  <option value="beauty">Beauté & Soins</option>
                </select>
              </div>
              <div class="form-group">
                <label>Prix (€) *</label>
                <input type="number" [(ngModel)]="prodForm.price" name="price" required min="0" step="0.01" class="form-input" />
              </div>
            </div>

            <div class="form-group">
              <label>URL de l'image (Image principale) *</label>
              <input type="url" [(ngModel)]="prodForm.imageUrl" name="imageUrl" required class="form-input" placeholder="https://images.unsplash.com/..." />
            </div>

            <div class="form-group">
              <label>Description complète</label>
              <textarea [(ngModel)]="prodForm.description" name="description" rows="3" class="form-input"></textarea>
            </div>

            <div class="form-row checkbox-row">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="prodForm.inStock" name="inStock" /> En Stock
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="prodForm.isNew" name="isNew" /> Nouveau
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="prodForm.isBestSeller" name="isBestSeller" /> Best Seller
              </label>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-secondary" (click)="closeProductModal()">Annuler</button>
              <button type="submit" class="btn-primary">
                {{ editMode ? 'Sauvegarder les modifications' : 'Créer le produit' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard-wrapper {
      min-height: 100vh;
      background: var(--bg-primary);
      padding-bottom: 4rem;
    }

    .admin-header-bar {
      background: var(--text-main);
      color: white;
      padding: 1.25rem 0;
      box-shadow: var(--shadow-md);
    }
    .admin-bar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .badge-admin {
      background: var(--accent-gradient);
      color: white;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.08em;
    }
    .admin-brand h2 {
      color: white;
      font-size: 1.35rem;
      margin-top: 0.2rem;
    }

    .exit-admin-btn {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border-color: rgba(255, 255, 255, 0.25);
    }
    .exit-admin-btn:hover {
      background: white;
      color: var(--text-main);
    }

    .admin-main {
      margin-top: 2rem;
    }

    .admin-nav-tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 2px solid var(--border-light);
      margin-bottom: 2rem;
      overflow-x: auto;
    }

    .nav-tab-btn {
      padding: 0.75rem 1.25rem;
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--text-muted);
      border: none;
      background: transparent;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    .nav-tab-btn:hover {
      color: var(--accent-primary);
    }
    .nav-tab-btn.active {
      color: var(--accent-primary);
      border-bottom-color: var(--accent-primary);
    }

    /* Metrics */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .metric-icon {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      color: white;
    }
    .bg-indigo { background: var(--accent-gradient); }
    .bg-emerald { background: var(--accent-emerald); }
    .bg-amber { background: var(--accent-amber); }
    .bg-rose { background: var(--accent-rose); }

    .metric-info {
      display: flex;
      flex-direction: column;
    }
    .metric-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
    }
    .metric-value {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-main);
    }

    /* Toolbar */
    .crud-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .search-filter-group {
      display: flex;
      gap: 0.75rem;
      flex: 1;
      max-width: 600px;
    }
    .admin-search-input {
      flex: 1;
      padding: 0.65rem 1rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-medium);
      font-size: 0.88rem;
    }
    .admin-select {
      padding: 0.65rem 1rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-medium);
      font-size: 0.88rem;
      background: white;
    }

    /* Table */
    .table-responsive {
      overflow-x: auto;
      padding: 1rem;
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.88rem;
    }
    .admin-table th {
      padding: 0.85rem 1rem;
      background: var(--bg-surface-secondary);
      font-weight: 700;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-light);
    }
    .admin-table td {
      padding: 0.85rem 1rem;
      border-bottom: 1px solid var(--border-light);
      vertical-align: middle;
    }

    .table-prod-img {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: var(--radius-md);
    }

    .prod-name-block {
      display: flex;
      flex-direction: column;
    }

    .category-chip {
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--accent-primary);
      background: var(--accent-primary-light);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }

    .stock-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
    }
    .stock-badge.in-stock { background: var(--accent-emerald-light); color: var(--accent-emerald); }
    .stock-badge.out-stock { background: var(--accent-rose-light); color: var(--accent-rose); }

    .table-actions {
      display: flex;
      gap: 0.4rem;
    }
    .action-btn-sm {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .action-btn-sm.edit:hover { background: var(--accent-primary-light); color: var(--accent-primary); }
    .action-btn-sm.delete:hover { background: var(--accent-rose-light); color: var(--accent-rose); }

    /* Modals */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1200;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .modal-card {
      width: 100%;
      max-width: 600px;
      background: white;
      border-radius: var(--radius-xl);
      padding: 2rem;
      box-shadow: var(--shadow-xl);
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    .product-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .form-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .form-group label {
      font-size: 0.82rem;
      font-weight: 700;
    }
    .form-input {
      width: 100%;
      padding: 0.65rem 0.85rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-medium);
      font-size: 0.88rem;
    }
    .checkbox-row {
      display: flex;
      gap: 1.5rem;
    }
    .checkbox-label {
      font-size: 0.85rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .status-badge {
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      font-weight: 700;
      font-size: 0.75rem;
    }
    .status-badge.confirmed { background: #FEF3C7; color: #D97706; }
    .status-badge.processing { background: #E0F2FE; color: #0284C7; }
    .status-badge.shipped { background: #EEF2FF; color: #4F46E5; }
    .status-badge.delivered { background: #ECFDF5; color: #059669; }

    .role-badge {
      font-size: 0.7rem;
      font-weight: 800;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      background: var(--bg-surface-secondary);
      color: var(--text-muted);
    }
    .role-badge.admin-role {
      background: var(--accent-primary-light);
      color: var(--accent-primary);
    }
  `]
})
export class AdminDashboardComponent {
  private productService = inject(ProductService);
  private adminService = inject(AdminService);
  private notify = inject(NotificationService);

  activeTab: 'overview' | 'products' | 'orders' | 'users' = 'overview';
  productSearch = '';
  selectedCategory: CategoryType = 'all';

  products = this.productService.allProducts;
  orders = this.adminService.orders;
  users = this.adminService.users;

  showProductModal = false;
  editMode = false;
  editingProductId = '';

  prodForm = {
    name: '',
    subtitle: '',
    description: '',
    price: 0,
    category: 'electronics' as Product['category'],
    imageUrl: '',
    inStock: true,
    isNew: false,
    isBestSeller: false
  };

  get totalRevenue(): number {
    return this.orders().reduce((sum, ord) => sum + ord.grandTotal, 0);
  }

  get filteredProducts(): Product[] {
    return this.products().filter(p => {
      const matchesCat = this.selectedCategory === 'all' || p.category === this.selectedCategory;
      const matchesQuery = !this.productSearch || p.name.toLowerCase().includes(this.productSearch.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }

  exitAdmin() {
    this.adminService.setAdminView(false);
  }

  openAddProductModal() {
    this.editMode = false;
    this.editingProductId = '';
    this.prodForm = {
      name: '',
      subtitle: '',
      description: '',
      price: 99.00,
      category: 'electronics',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      inStock: true,
      isNew: true,
      isBestSeller: false
    };
    this.showProductModal = true;
  }

  openEditProductModal(prod: Product) {
    this.editMode = true;
    this.editingProductId = prod.id;
    this.prodForm = {
      name: prod.name,
      subtitle: prod.subtitle,
      description: prod.description,
      price: prod.price,
      category: prod.category,
      imageUrl: prod.images[0] || '',
      inStock: prod.inStock,
      isNew: !!prod.isNew,
      isBestSeller: !!prod.isBestSeller
    };
    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
  }

  saveProduct() {
    if (!this.prodForm.name || !this.prodForm.price || !this.prodForm.imageUrl) {
      this.notify.warning('Champs manquants', 'Veuillez remplir le nom, le prix et l\'image.');
      return;
    }

    if (this.editMode) {
      this.productService.updateProduct(this.editingProductId, {
        name: this.prodForm.name,
        subtitle: this.prodForm.subtitle,
        description: this.prodForm.description,
        price: this.prodForm.price,
        category: this.prodForm.category,
        images: [this.prodForm.imageUrl],
        inStock: this.prodForm.inStock,
        isNew: this.prodForm.isNew,
        isBestSeller: this.prodForm.isBestSeller
      });
      this.notify.success('Produit mis à jour ! ✏️', `${this.prodForm.name} a été modifié.`);
    } else {
      this.productService.addProduct({
        name: this.prodForm.name,
        subtitle: this.prodForm.subtitle,
        description: this.prodForm.description,
        price: this.prodForm.price,
        category: this.prodForm.category,
        images: [this.prodForm.imageUrl],
        rating: 5.0,
        reviewCount: 1,
        inStock: this.prodForm.inStock,
        isNew: this.prodForm.isNew,
        isBestSeller: this.prodForm.isBestSeller
      });
      this.notify.success('Produit ajouté ! 📦', `${this.prodForm.name} est maintenant disponible sur la boutique.`);
    }

    this.closeProductModal();
  }

  deleteProduct(prod: Product) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${prod.name}" ?`)) {
      this.productService.deleteProduct(prod.id);
      this.notify.info('Produit supprimé', `${prod.name} a été retiré du catalogue.`);
    }
  }

  updateOrderStatus(orderId: string, status: UserOrder['status']) {
    this.adminService.updateOrderStatus(orderId, status);
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
}
