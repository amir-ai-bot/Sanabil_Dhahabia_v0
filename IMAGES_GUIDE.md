📸 GUIDE D'AJOUT D'IMAGES POUR LES PRODUITS
════════════════════════════════════════════════════════════════════

## OPTION 1: Via l'interface d'administration (RECOMMANDÉ)

1. Ouvrez l'application: http://localhost:49574
2. Connectez-vous en tant qu'admin:
   - Email: admin@sanabel.com
   - Mot de passe: Admin123!

3. Allez à: Admin > Gestion des Produits

4. Pour chaque produit:
   - Cliquez sur "Modifier"
   - Deux options pour ajouter une image:
   
   a) URL directe (Pexels/Unsplash):
      - Collez une URL HTTPS: https://images.pexels.com/...
      
   b) Téléverser un fichier local:
      - Cliquez sur "Téléverser un fichier local"
      - Sélectionnez un fichier image (JPG, PNG, GIF, WebP)
      - L'image sera uploadée et enregistrée

5. Cliquez sur "Mettre à jour"

## OPTION 2: SQL (Via phpMyAdmin ou MySQL Workbench)

1. Ouvrez phpMyAdmin: http://localhost/phpmyadmin

2. Importez le fichier SQL: backend/update_product_images.sql
   
   OU exécutez manuellement les requêtes SQL pour chaque catégorie

3. Les images Pexels (gratuites) seront ajoutées automatiquement

## OPTION 3: Script PHP (Si PHP est installé)

1. Ouvrez un terminal PowerShell dans le dossier backend:
   cd "c:\Users\HAMAD\Downloads\Projet hamad\Projet hamad\backend"

2. Exécutez:
   php add_images_to_products.php

3. Le script ajoutera les images Pexels à tous les produits

## SOURCES D'IMAGES GRATUITES

✓ Pexels: https://www.pexels.com
✓ Unsplash: https://unsplash.com
✓ Pixabay: https://pixabay.com
✓ Freepik: https://www.freepik.com (gratuit limité)

## FORMATS ACCEPTÉS

✓ JPEG (.jpg, .jpeg)
✓ PNG (.png)
✓ GIF (.gif)
✓ WebP (.webp)

Taille max: 5 MB par image

## STRUCTURE DES IMAGES LOCALES

Les images téléversées sont sauvegardées dans:
backend/public/images/

Exemple:
- backend/public/images/product_1.jpg
- backend/public/images/seed_tomato.png

## AFFICHAGE DES IMAGES

Les images s'affichent dans:

1. Page d'accueil: Section "Produits en vedette"
2. Catalogue: Grille de tous les produits
3. Détail produit: Grande image + info produit
4. Admin: Miniatures dans le tableau produits

════════════════════════════════════════════════════════════════════
