# 🛒 EcommerceApp

Application e-commerce développée avec **Angular** et **Firebase**, comprenant deux espaces distincts : un espace **Administrateur** et un espace **Utilisateur**.

## 📋 Description

EcommerceApp est une plateforme de vente en ligne permettant aux utilisateurs de parcourir et acheter des produits, tandis que les administrateurs disposent d'un panneau de gestion complet pour gérer les produits et les utilisateurs de la plateforme.

## ✨ Fonctionnalités

### 👤 Espace Utilisateur
- Inscription et connexion (authentification Firebase)
- Consultation du catalogue de produits
- Recherche et filtrage des produits
- Ajout de produits au panier
- Gestion du panier (modification, suppression d'articles)
- Passage de commande
- Consultation du profil utilisateur

### 🔧 Espace Administrateur
- Authentification sécurisée (rôle admin)
- **Gestion des produits (CRUD)**
  - Ajouter un nouveau produit
  - Modifier un produit existant
  - Supprimer un produit
  - Consulter la liste des produits
- **Gestion des utilisateurs (CRUD)**
  - Ajouter un utilisateur
  - Modifier les informations d'un utilisateur
  - Supprimer un utilisateur
  - Consulter la liste des utilisateurs
- Tableau de bord administrateur

## 🛠️ Technologies utilisées

- **Frontend** : [Angular](https://angular.dev/) (v19)
- **Backend / Base de données** : [Firebase](https://firebase.google.com/)
  - Firebase Authentication (gestion des utilisateurs et des rôles)
  - Firestore Database (stockage des produits et des utilisateurs)
  - Firebase Hosting *(optionnel, pour le déploiement)*
- **Langage** : TypeScript
- **Style** : CSS / SCSS

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (v18 ou supérieur recommandé)
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)
- Un compte [Firebase](https://console.firebase.google.com/)

## 🚀 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/AlaAydi/EcommerceApp.git
   cd EcommerceApp
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer Firebase**

   Créez un projet sur la [console Firebase](https://console.firebase.google.com/), activez **Authentication** et **Firestore Database**, puis récupérez votre configuration Firebase et ajoutez-la dans le fichier d'environnement de votre projet (`src/environments/environment.ts`) :
   ```typescript
   export const environment = {
     production: false,
     firebaseConfig: {
       apiKey: "VOTRE_API_KEY",
       authDomain: "VOTRE_AUTH_DOMAIN",
       projectId: "VOTRE_PROJECT_ID",
       storageBucket: "VOTRE_STORAGE_BUCKET",
       messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
       appId: "VOTRE_APP_ID"
     }
   };
   ```

4. **Lancer le serveur de développement**
   ```bash
   ng serve
   ```

   Ouvrez votre navigateur à l'adresse `http://localhost:4200/`. L'application se recharge automatiquement à chaque modification des fichiers sources.

## 🏗️ Build

Pour générer une version de production de l'application :

```bash
ng build
```

Les fichiers compilés seront disponibles dans le dossier `dist/`.

## 🧪 Tests

Pour exécuter les tests unitaires (via [Karma](https://karma-runner.github.io)) :

```bash
ng test
```

## 📁 Structure du projet

```
EcommerceApp/
├── src/
│   ├── app/
│   │   ├── admin/          # Composants de l'espace administrateur
│   │   ├── user/           # Composants de l'espace utilisateur
│   │   ├── auth/           # Authentification (login, register)
│   │   ├── services/       # Services (produits, utilisateurs, panier...)
│   │   └── shared/         # Composants partagés
│   ├── environments/       # Configuration Firebase
│   └── assets/             # Images, styles, fichiers statiques
├── angular.json
├── package.json
└── README.md
```

## 👥 Rôles

| Rôle | Accès |
|------|-------|
| **Admin** | Gestion complète des produits et des utilisateurs (CRUD) |
| **User** | Consultation des produits, panier, commandes |

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
3. Commitez vos modifications (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Poussez la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👤 Auteur

**AlaAydi**
- GitHub : [@AlaAydi](https://github.com/AlaAydi)
