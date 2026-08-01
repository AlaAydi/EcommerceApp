# 🛒 EcommerceApp

Application e-commerce développée avec **Angular 19**, utilisant des composants standalone modernes. Le projet couvre le parcours d'achat complet : découverte des produits, fiche produit détaillée, panier, wishlist et tunnel de commande.

## ✨ Fonctionnalités

- **Page d'accueil** : bannière héro et badges de confiance
- **Liste de produits** : filtrage des produits, cartes produit
- **Fiche produit** : galerie d'images, onglets d'information, système de notation par étoiles
- **Panier** : tiroir latéral (cart drawer), gestion des articles, service de panier dédié
- **Wishlist** : liste de souhaits persistée via un service dédié
- **Recherche & navigation** : barre de recherche, navigation par catégories dans le header
- **Tunnel de commande (checkout)** : stepper multi-étapes, aperçu de carte bancaire, modal de confirmation de commande
- **Notifications** : système de toasts pour les retours utilisateur

## 🧱 Stack technique

- [Angular](https://angular.dev/) 19 (composants standalone)
- TypeScript 5.7
- RxJS
- Karma / Jasmine pour les tests unitaires

## 📁 Structure du projet

```
src/app/
├── core/                     # Logique métier partagée
│   ├── models/                # Modèles (Product, Cart)
│   └── services/               # CartService, ProductService, WishlistService, NotificationService
├── features/                 # Modules fonctionnels (par page)
│   ├── home/                   # Page d'accueil (hero-banner, trust-badges)
│   ├── product-list/           # Liste de produits + filtres
│   ├── product-detail/         # Fiche produit (galerie, onglets)
│   └── checkout/                # Tunnel de commande (stepper, carte bancaire, succès)
└── shared/components/        # Composants réutilisables
    ├── header/ (search-bar, category-nav)
    ├── footer/
    ├── cart-drawer/ , cart-item/
    ├── product-card/
    ├── quick-view-modal/
    ├── star-rating/
    └── toast-notifications/
```

## 🚀 Installation

Prérequis : [Node.js](https://nodejs.org/) et [Angular CLI](https://angular.dev/tools/cli).

```bash
git clone https://github.com/AlaAydi/EcommerceApp.git
cd EcommerceApp
npm install
```

## 💻 Lancer le projet en local

```bash
ng serve
```

Ouvrez ensuite votre navigateur à l'adresse [http://localhost:4200](http://localhost:4200). L'application se recharge automatiquement à chaque modification du code source.

## 🏗️ Build

```bash
ng build
```

Les fichiers compilés sont générés dans le dossier `dist/`, optimisés pour la production par défaut.

## 🧪 Tests

Tests unitaires avec [Karma](https://karma-runner.github.io) :

```bash
ng test
```

## 🧩 Génération de composants

Grâce à l'Angular CLI :

```bash
ng generate component nom-du-composant
```

Pour voir toutes les commandes disponibles (components, directives, pipes...) :

```bash
ng generate --help
```

## 📚 Ressources

- [Documentation Angular](https://angular.dev/)
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)

## 👤 Auteur

**AlaAydi**

## 📄 Licence

Projet à but éducatif / personnel. Ajoutez une licence si vous souhaitez le publier officiellement.