# 🌾 SANABEL DHAHABIA - Guide d'Installation

## Installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Lancer l'application**
   ```bash
   npm start
   ```

3. **Accéder à l'application**
   - Ouvrir votre navigateur à l'adresse: `http://localhost:4200`

## Comptes de démonstration

### Administrateur
- **Email:** stesanabeldhahabia@gmail.com
- **Mot de passe:** admin123
- **Accès:** Tableau de bord administrateur, gestion des produits et commandes

### Client
- **Email:** client@example.com
- **Mot de passe:** client123
- **Accès:** Espace client, commandes personnelles

## Structure de l'application

### Pages Publiques
- `/` - Page d'accueil
- `/catalogue` - Catalogue de produits
- `/produit/:id` - Détail d'un produit
- `/panier` - Panier d'achat

### Authentification
- `/login` - Connexion
- `/register` - Inscription

### Espace Client
- `/client/dashboard` - Tableau de bord client
- `/client/commandes` - Historique des commandes

### Espace Administrateur
- `/admin/dashboard` - Tableau de bord admin
- `/admin/produits` - Gestion des produits
- `/admin/commandes` - Gestion des commandes

### Commandes
- `/commande` - Finalisation de la commande
- `/confirmation/:id` - Confirmation de commande

## Fonctionnalités

### ✅ Implémentées
- ✅ Pages publiques (accueil, catalogue, détail produit)
- ✅ Système de panier
- ✅ Processus de commande
- ✅ Authentification (connexion, inscription)
- ✅ Espace client (dashboard, historique)
- ✅ Espace administrateur (dashboard, gestion produits, gestion commandes)
- ✅ Thème Or & Vert personnalisé
- ✅ Interface entièrement en français

## Notes Techniques

- **Framework:** Angular 17 (standalone components)
- **Langage:** TypeScript
- **Stockage:** localStorage (pour démonstration)
- **Base de données:** Services mock (peut être remplacé par des appels HTTP)

## Prochaines étapes (optionnel)

Pour connecter à une vraie base de données:
1. Créer un backend API
2. Remplacer les services mock par des appels HTTP
3. Implémenter la gestion d'images upload
4. Ajouter la gestion de paiement
5. Ajouter les emails de confirmation

