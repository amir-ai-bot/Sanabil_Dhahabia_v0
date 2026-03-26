-- ═══════════════════════════════════════════════════════════════════════════════
-- SCRIPT DE MISE À JOUR DES IMAGES DES PRODUITS
-- Ajoute des images Pexels à tous les produits
-- ═══════════════════════════════════════════════════════════════════════════════

USE sanabel_dhahabia;

-- Catégorie 1: Semences
UPDATE products SET image = 'https://images.pexels.com/photos/533446/pexels-photo-533446.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 1 AND (image IS NULL OR image = '') LIMIT 1;
UPDATE products SET image = 'https://images.pexels.com/photos/2389141/pexels-photo-2389141.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 1 AND (image IS NULL OR image = '') LIMIT 1;
UPDATE products SET image = 'https://images.pexels.com/photos/3962288/pexels-photo-3962288.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 1 AND (image IS NULL OR image = '') LIMIT 1;
UPDATE products SET image = 'https://images.pexels.com/photos/5730428/pexels-photo-5730428.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 1 AND (image IS NULL OR image = '') LIMIT 1;
UPDATE products SET image = 'https://images.pexels.com/photos/6118606/pexels-photo-6118606.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 1 AND (image IS NULL OR image = '');

-- Catégorie 2: Outils
UPDATE products SET image = 'https://images.pexels.com/photos/3825440/pexels-photo-3825440.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 2 AND (image IS NULL OR image = '') LIMIT 1;
UPDATE products SET image = 'https://images.pexels.com/photos/3962287/pexels-photo-3962287.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 2 AND (image IS NULL OR image = '') LIMIT 1;
UPDATE products SET image = 'https://images.pexels.com/photos/8534488/pexels-photo-8534488.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 2 AND (image IS NULL OR image = '') LIMIT 1;
UPDATE products SET image = 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 2 AND (image IS NULL OR image = '');

-- Catégorie 3: Équipements  
UPDATE products SET image = 'https://images.pexels.com/photos/3173043/pexels-photo-3173043.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 3 AND (image IS NULL OR image = '') LIMIT 1;
UPDATE products SET image = 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 3 AND (image IS NULL OR image = '') LIMIT 1;
UPDATE products SET image = 'https://images.pexels.com/photos/4503269/pexels-photo-4503269.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 3 AND (image IS NULL OR image = '') LIMIT 1;
UPDATE products SET image = 'https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 3 AND (image IS NULL OR image = '');

-- Catégorie 4: Services
UPDATE products SET image = 'https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 4 AND (image IS NULL OR image = '') LIMIT 1;
UPDATE products SET image = 'https://images.pexels.com/photos/3962289/pexels-photo-3962289.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 4 AND (image IS NULL OR image = '');

-- Catégorie 5: Accessoires
UPDATE products SET image = 'https://images.pexels.com/photos/3825441/pexels-photo-3825441.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 5 AND (image IS NULL OR image = '') LIMIT 1;
UPDATE products SET image = 'https://images.pexels.com/photos/3962290/pexels-photo-3962290.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE categoryId = 5 AND (image IS NULL OR image = '');

-- Pour tous les autres produits sans images, ajouter une image générique par catégorie
UPDATE products SET image = CASE 
    WHEN categoryId = 1 THEN 'https://images.pexels.com/photos/533446/pexels-photo-533446.jpeg?auto=compress&cs=tinysrgb&w=400'
    WHEN categoryId = 2 THEN 'https://images.pexels.com/photos/3825440/pexels-photo-3825440.jpeg?auto=compress&cs=tinysrgb&w=400'
    WHEN categoryId = 3 THEN 'https://images.pexels.com/photos/3173043/pexels-photo-3173043.jpeg?auto=compress&cs=tinysrgb&w=400'
    WHEN categoryId = 4 THEN 'https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg?auto=compress&cs=tinysrgb&w=400'
    WHEN categoryId = 5 THEN 'https://images.pexels.com/photos/3825441/pexels-photo-3825441.jpeg?auto=compress&cs=tinysrgb&w=400'
    ELSE 'https://images.pexels.com/photos/533446/pexels-photo-533446.jpeg?auto=compress&cs=tinysrgb&w=400'
END
WHERE image IS NULL OR image = '';

-- Vérification
SELECT 
    id, 
    name, 
    categoryId,
    CASE WHEN image IS NULL OR image = '' THEN 'NON' ELSE 'OUI' END as 'Image attribuée'
FROM products
ORDER BY categoryId, id;
