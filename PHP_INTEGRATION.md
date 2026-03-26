# Intégration PHP - Guide Complet

## Vue d'ensemble
Ce projet a été configuré pour utiliser PHP comme backend. L'application Angular communique avec des APIs PHP via HTTP.

## Architecture

```
Projet hamad/
├── src/                    (Frontend Angular)
│   └── app/
│       ├── services/       (Services Angular qui appellent le backend PHP)
│       ├── components/
│       └── models/
├── backend/               (Backend PHP)
│   ├── api/              (Endpoints API)
│   │   ├── auth.php      (Gestion d'authentification)
│   │   ├── products.php  (Gestion des produits)
│   │   └── orders.php    (Gestion des commandes)
│   ├── controllers/      (Logique métier)
│   ├── config/           (Configuration)
│   └── database.sql      (Script SQL)
```

## Installation et Configuration

### Étape 1: Configuration de la base de données

1. **Créer la base de données**:
   - Ouvrez MySQL Workbench ou phpMyAdmin
   - Exécutez le script `backend/database.sql`

   Ou via la ligne de commande:
   ```bash
   mysql -u root -p < backend/database.sql
   ```

2. **Vérifier les paramètres de connexion** dans `backend/config/Database.php`:
   ```php
   private $host = 'localhost';
   private $db_name = 'sanabel_dhahabia';
   private $user = 'root';
   private $password = ''; // Ajoutez votre mot de passe ici
   ```

### Étape 2: Démarrer le serveur PHP

**Option 1: Serveur PHP intégré** (recommandé pour le développement)
```bash
cd backend
php -S localhost:8000
```

**Option 2: Apache/XAMPP**
- Placez le dossier dans `htdocs` (XAMPP) ou `www` (WAMP)
- Accédez via `http://localhost/Projet hamad/backend/api/`

### Étape 3: Configurer le frontend Angular

1. **Mettez à jour l'URL de l'API** si nécessaire dans `src/app/services/api.service.ts`:
   ```typescript
   private apiUrl = 'http://localhost:8000/backend/api';
   ```

2. **Importez HttpClientModule** dans `src/main.ts`:
   ```typescript
   import { HttpClientModule } from '@angular/common/http';

   bootstrapApplication(AppComponent, {
     providers: [
       provideRouter(routes),
       provideHttpClient()
     ]
   });
   ```

3. **Mettez à jour les services** pour utiliser ApiService:
   ```typescript
   constructor(private api: ApiService) {}

   login(credentials) {
     return this.api.login(credentials);
   }
   ```

## Structure des APIs

### Authentification

#### Login
```
POST /api/auth.php?action=login
Content-Type: application/json

{
  "email": "stesanabeldhahabia@gmail.com",
  "password": "admin123"
}

Response (200):
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "id": 1,
    "email": "stesanabeldhahabia@gmail.com",
    "firstName": "Admin",
    "lastName": "System",
    "role": "admin"
  }
}
```

#### Register
```
POST /api/auth.php?action=register
Content-Type: application/json

{
  "email": "newemail@example.com",
  "password": "password123",
  "firstName": "Jean",
  "lastName": "Dupont"
}

Response (201):
{
  "success": true,
  "message": "Inscription réussie"
}
```

### Produits

#### Récupérer tous les produits
```
GET /api/products.php

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Tracteur John Deere",
      "description": "Tracteur puissant 100 ch",
      "price": "50000.00",
      "stock": 5,
      ...
    }
  ]
}
```

#### Créer un produit
```
POST /api/products.php
Content-Type: application/json

{
  "name": "Nouveau Produit",
  "description": "Description du produit",
  "price": 1500,
  "categoryId": 1,
  "stock": 10
}

Response (201):
{
  "success": true,
  "id": 6
}
```

### Commandes

#### Créer une commande
```
POST /api/orders.php
Content-Type: application/json

{
  "userId": 2,
  "items": [
    {
      "product": { "id": 1, "price": 50000 },
      "quantity": 1
    }
  ],
  "shippingInfo": {
    "address": "123 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75000",
    "phone": "0123456789",
    "deliveryDistance": 50,
    "shippingCost": 100
  }
}

Response (201):
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "CMD-1234567890-5678"
  }
}
```

## Notes de sécurité

⚠️ **Important**: Cette implémentation est à des fins de démonstration. Pour la production:

1. **Hash des mots de passe**:
   ```php
   // Enregistrement
   $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
   
   // Vérification
   password_verify($password, $hashedPassword)
   ```

2. **Validation des entrées**:
   ```php
   $email = filter_var($data->email, FILTER_VALIDATE_EMAIL);
   ```

3. **Authentification JWT**:
   - Remplacez les sessions par JWT tokens
   - Envoyez le token dans les headers `Authorization: Bearer`

4. **HTTPS obligatoire** en production

5. **Rate limiting** sur les APIs

## Dépannage

### Erreur de connexion à la base de données
```
Vérifiez les paramètres dans backend/config/Database.php
```

### CORS erreur
```
Les headers CORS sont configurés dans backend/config/cors.php
```

### Produit non trouvé (404)
```
Assurez-vous que l'ID du produit existe dans la base de données
```

## Ressources
- [PHP Documentation](https://www.php.net/docs.php)
- [PDO Documentation](https://www.php.net/manual/en/book.pdo.php)
- [Angular HttpClient](https://angular.io/guide/http)
