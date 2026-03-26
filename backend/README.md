# Backend PHP - Sanabel Dhahabia

## Configuration

### Base de données
1. Créez une base de données MySQL nommée `sanabel_dhahabia`
2. Importez le fichier `database.sql` dans votre MySQL:
   ```
   mysql -u root -p sanabel_dhahabia < backend/database.sql
   ```

### Paramètres de connexion
Modifiez les paramètres dans `config/Database.php`:
- `host`: localhost (ou votre serveur)
- `db_name`: sanabel_dhahabia
- `user`: root
- `password`: (votre mot de passe)

## Structure des API

### Authentification
- `POST /api/auth.php?action=login` - Connexion
- `POST /api/auth.php?action=register` - Inscription
- `POST /api/auth.php?action=logout` - Déconnexion

### Produits
- `GET /api/products.php` - Récupérer tous les produits
- `GET /api/products.php?id=1` - Récupérer un produit
- `POST /api/products.php` - Créer un produit (admin)
- `PUT /api/products.php?id=1` - Mettre à jour un produit
- `DELETE /api/products.php?id=1` - Supprimer un produit

### Commandes
- `GET /api/orders.php?userId=1` - Récupérer les commandes d'un utilisateur
- `GET /api/orders.php?id=1` - Récupérer une commande spécifique
- `POST /api/orders.php` - Créer une commande
- `PUT /api/orders.php?id=1&action=status` - Mettre à jour le statut

## Utilisateurs de test

Email: `stesanabeldhahabia@gmail.com`
Mot de passe: `admin123`
Rôle: Admin

Email: `client@example.com`
Mot de passe: `client123`
Rôle: Client

## Exigences serveur
- PHP 7.4+
- MySQL 5.7+
- Extension PDO PHP
- Mod_rewrite Apache (optionnel)
