# ✅ Checklist d'Intégration PHP

## 📋 Configuration Initiale

- [ ] **Base de Données**
  - [ ] MySQL installé et en cours d'exécution
  - [ ] Script `backend/database.sql` exécuté avec succès
  - [ ] Base de données `sanabel_dhahabia` créée
  - [ ] Tables créées avec données d'exemple

- [ ] **Paramètres de Connexion**
  - [ ] Modifier `backend/config/Database.php` avec vos identifiants
  - [ ] Tester la connexion à la base de données
  - [ ] Vérifier que les tables sont accessibles

## 🚀 Backend PHP

- [ ] **Démarrage du serveur**
  - [ ] PHP 7.4+ installé
  - [ ] Extension PDO activée
  - [ ] Exécuter: `cd backend && php -S localhost:8000`
  - [ ] Vérifier que le serveur démarre sans erreur
  - [ ] Accéder à `http://localhost:8000` pour voir la page d'accueil

- [ ] **API Endpoints**
  - [ ] Tester `/api/auth.php?action=login` avec Postman
  - [ ] Tester `/api/products.php` pour récupérer les produits
  - [ ] Tester `/api/orders.php?userId=1` pour les commandes
  - [ ] Vérifier les réponses JSON
  - [ ] Vérifier les codes HTTP (200, 201, 400, 404, 500)

## 🎨 Frontend Angular

- [ ] **Configuration HttpClient**
  - [ ] Importer `HttpClientModule` dans `main.ts`
  - [ ] Utiliser `provideHttpClient()` si Angular 17+
  - [ ] Compiler sans erreur

- [ ] **Services**
  - [ ] Créer `src/app/services/api.service.ts`
  - [ ] Mettre à jour `AuthService` pour utiliser `ApiService`
  - [ ] Mettre à jour `ProductService`
  - [ ] Mettre à jour `OrderService`

- [ ] **Configuration d'Environnement**
  - [ ] Créer `src/environments/environment.ts`
  - [ ] Définir `apiUrl = 'http://localhost:8000/backend/api'`
  - [ ] Importer et utiliser l'environnement

## 🧪 Tests

- [ ] **Tests avec Postman/Curl**
  ```bash
  # Login
  curl -X POST http://localhost:8000/backend/api/auth.php?action=login \
    -H "Content-Type: application/json" \
    -d '{"email":"stesanabeldhahabia@gmail.com","password":"admin123"}'
  
  # Récupérer les produits
  curl http://localhost:8000/backend/api/products.php
  ```

- [ ] **Tests dans Angular**
  - [ ] Tester login depuis un composant
  - [ ] Afficher les produits dans la catalogue
  - [ ] Créer une commande
  - [ ] Récupérer les commandes d'un utilisateur

- [ ] **Vérification des Erreurs**
  - [ ] Ouvrir la console du navigateur (F12)
  - [ ] Vérifier qu'il n'y a pas d'erreurs CORS
  - [ ] Vérifier les réponses réseau dans l'onglet Network
  - [ ] Vérifier les logs du serveur PHP

## 🔒 Sécurité

- [ ] **Validation des Entrées**
  - [ ] Valider tous les emails
  - [ ] Valider les mots de passe
  - [ ] Valider les prix et quantités

- [ ] **Mots de Passe (À faire)**
  - [ ] Remplacer le stockage en clair par `password_hash()`
  - [ ] Utiliser `password_verify()` au login
  - [ ] Supprimer les mots de passe des réponses

- [ ] **Authentification (À faire)**
  - [ ] Implémenter JWT tokens
  - [ ] Envoyer le token dans les headers
  - [ ] Valider le token avant chaque requête

- [ ] **CORS**
  - [ ] Vérifier que les headers CORS sont corrects
  - [ ] Limiter les origines autorisées en production

## 📚 Documentation

- [ ] Lire `PHP_INTEGRATION.md`
- [ ] Lire `NEXT_STEPS.md`
- [ ] Lire `INSTALLATION_PHP.md`
- [ ] Consulter les exemples dans `EXAMPLES.ts`

## 🐛 Dépannage

Si vous rencontrez des problèmes:

- [ ] **Erreur: "Connection refused"**
  - [ ] Vérifier que le serveur PHP est lancé
  - [ ] Vérifier le port (8000 par défaut)

- [ ] **Erreur CORS**
  - [ ] Les headers CORS sont configurés dans `backend/config/cors.php`
  - [ ] Vérifier que le frontend appelle le bon domaine

- [ ] **Erreur: "Table not found"**
  - [ ] Exécuter le script `database.sql`
  - [ ] Vérifier le nom de la base de données

- [ ] **Erreur 404**
  - [ ] Vérifier l'URL de l'API
  - [ ] Vérifier que le fichier API existe
  - [ ] Vérifier les paramètres GET

## 📱 Prochaines Étapes

Après la mise en place basique:

- [ ] Ajouter la pagination
- [ ] Implémenter JWT
- [ ] Ajouter la validation robuste
- [ ] Mettre en cache les produits
- [ ] Ajouter un système de notifications
- [ ] Upload d'images
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Déploiement en production

## ✨ Status

```
Créé par: GitHub Copilot
Date: Janvier 2026
Version: 1.0.0
Status: ✅ Prêt à utiliser
```

---

**Bon développement! 🚀**

Consultez les fichiers de documentation pour plus de détails.
