# Prochaines Étapes - Intégration PHP

## Tâches à effectuer

### 1. Configuration de la Base de Données ✓
- [x] Script SQL créé: `backend/database.sql`
- [ ] Exécuter le script SQL dans MySQL
- [ ] Vérifier les paramètres de connexion dans `backend/config/Database.php`

### 2. Démarrer le serveur PHP
```bash
# Naviguez au dossier backend
cd backend

# Démarrez le serveur PHP
php -S localhost:8000
```

Le serveur sera accessible à `http://localhost:8000`

### 3. Mettre à jour les Services Angular

Remplacez les services existants par les versions mises à jour:

```bash
# Sauvegardez les anciens fichiers
cp src/app/services/auth.service.ts src/app/services/auth.service.backup.ts
cp src/app/services/product.service.ts src/app/services/product.service.backup.ts
cp src/app/services/order.service.ts src/app/services/order.service.backup.ts

# Remplacez par les nouvelles versions
cp src/app/services/auth-updated.service.ts src/app/services/auth.service.ts
cp src/app/services/product-updated.service.ts src/app/services/product.service.ts
cp src/app/services/order-updated.service.ts src/app/services/order.service.ts
```

### 4. Ajouter HttpClientModule

Modifiez `src/main.ts`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
});
```

### 5. Tester les APIs

Utilisez curl ou Postman pour tester:

```bash
# Test de login
curl -X POST http://localhost:8000/backend/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{"email":"stesanabeldhahabia@gmail.com","password":"admin123"}'

# Test récupération des produits
curl http://localhost:8000/backend/api/products.php
```

### 6. Ajouter la Validation des Entrées

Dans `backend/controllers/AuthController.php`, ajoutez la validation:

```php
// Valider l'email
$email = filter_var($data->email, FILTER_VALIDATE_EMAIL);
if (!$email) {
    return ['success' => false, 'message' => 'Email invalide'];
}

// Valider le mot de passe
if (strlen($data->password) < 6) {
    return ['success' => false, 'message' => 'Mot de passe trop court'];
}
```

### 7. Sécuriser les Mots de Passe (IMPORTANT)

Remplacez le stockage en clair par du hachage:

```php
// Enregistrement
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Vérification au login
if (password_verify($data->password, $user['password'])) {
    // Mot de passe correct
}
```

### 8. Ajouter l'Authentification JWT (Optionnel)

Pour plus de sécurité, mettez en place JWT:
- Installez une librairie JWT PHP: `composer require firebase/php-jwt`
- Générez un token au login
- Validez le token dans les autres endpoints

### 9. Tests Angular

Testez l'intégration depuis Angular:

```typescript
// Dans un composant
constructor(private authService: AuthService) {}

login() {
  const credentials = {
    email: 'stesanabeldhahabia@gmail.com',
    password: 'admin123'
  };
  
  this.authService.login(credentials).subscribe(
    user => console.log('Login réussi:', user),
    error => console.error('Erreur login:', error)
  );
}
```

### 10. Déploiement

Pour la production:
- Hébergement avec support PHP (ex: OVH, 1&1, etc.)
- Changez les paramètres de connexion à la base de données
- Activez HTTPS
- Changez l'URL de l'API dans les paramètres d'environnement
- Mettez à jour le fichier `.env` avec les configurations sensibles

## Points de Contrôle

- [ ] Base de données créée avec succès
- [ ] Serveur PHP démarre sans erreur
- [ ] APIs répondent correctement aux requêtes
- [ ] Angular récupère les données du backend
- [ ] Authentification fonctionne
- [ ] CRUD produits fonctionne
- [ ] CRUD commandes fonctionne

## Fichiers modifiés

- ✓ `backend/` - Nouveau dossier avec implémentation PHP
- ✓ `backend/api/` - APIs REST
- ✓ `backend/controllers/` - Logique métier
- ✓ `backend/config/` - Configuration
- ✓ `src/app/services/api.service.ts` - Nouveau service pour communiquer avec PHP
- ✓ `src/app/services/auth-updated.service.ts` - Version mise à jour
- ✓ `src/app/services/product-updated.service.ts` - Version mise à jour
- ✓ `src/app/services/order-updated.service.ts` - Version mise à jour

## Support et Ressources

- PHP Documentation: https://www.php.net/docs.php
- PDO: https://www.php.net/manual/en/book.pdo.php
- Angular HttpClient: https://angular.io/guide/http
- MySQL: https://dev.mysql.com/doc/

## Aide et Troubleshooting

### Erreur de connexion DB
Vérifiez que MySQL est en cours d'exécution et que les identifiants sont corrects.

### CORS Error
Les headers CORS sont déjà configurés dans `backend/config/cors.php`.

### Port 8000 déjà utilisé
Utilisez un autre port: `php -S localhost:8001`

## Prochaines Améliorations

- [ ] Pagination des produits
- [ ] Filtrage par catégorie
- [ ] Système de panier persistant
- [ ] Notifications par email
- [ ] Exportation des commandes (PDF)
- [ ] Dashboard admin avancé
- [ ] Upload d'images pour les produits
- [ ] Système de notation
- [ ] Historique des modifications
