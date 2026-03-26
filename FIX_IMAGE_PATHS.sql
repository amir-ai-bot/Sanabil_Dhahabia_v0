-- Script pour vérifier et corriger les chemins des images

-- Vérifier les images actuelles
SELECT id, name, image FROM products WHERE image IS NOT NULL LIMIT 10;

-- Corriger les chemins (si c'est le chemin complet qu'il faut)
UPDATE products SET image = CONCAT('/sanabel-backend/public/images/products/product_', id, '.jpg') 
WHERE image LIKE '%product_%' OR image IS NULL;

-- Alternative: chemin relatif au serveur web
-- UPDATE products SET image = CONCAT('/images/products/product_', id, '.jpg') 
-- WHERE id > 0 AND id <= 24;
