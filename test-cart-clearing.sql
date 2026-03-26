-- ========================================
-- 🧪 Script SQL de Test: Vidage du Panier
-- ========================================

-- Configuration
SET @USER_ID = 1;

-- ==========================================
-- TEST 1: Voir le panier avant vidage
-- ==========================================
SELECT '=== AVANT VIDAGE ===' as 'Test 1';
SELECT 
    c.id as 'ID Panier',
    c.userId as 'User ID',
    COUNT(ci.id) as 'Nombre d\'articles',
    SUM(ci.quantity) as 'Quantité totale',
    c.totalPrice as 'Prix Total'
FROM cart c
LEFT JOIN cart_items ci ON c.id = ci.cartId
WHERE c.userId = @USER_ID
GROUP BY c.id, c.userId, c.totalPrice;

-- Détails des articles
SELECT 
    ci.id as 'Item ID',
    p.name as 'Produit',
    ci.quantity as 'Quantité',
    p.price as 'Prix unitaire',
    (p.price * ci.quantity) as 'Sous-total'
FROM cart_items ci
JOIN cart c ON c.id = ci.cartId
JOIN products p ON p.id = ci.productId
WHERE c.userId = @USER_ID;

-- ==========================================
-- TEST 2: Simuler l'ajout d'articles
-- ==========================================
-- (Commenté - exécuter manuellement si nécessaire)
/*
INSERT INTO cart_items (cartId, productId, quantity, addedAt)
SELECT c.id, 1, 2, NOW()
FROM cart c
WHERE c.userId = @USER_ID
AND NOT EXISTS (
    SELECT 1 FROM cart_items ci 
    WHERE ci.cartId = c.id AND ci.productId = 1
);

UPDATE cart 
SET totalPrice = totalPrice + (SELECT p.price * 2 FROM products p WHERE p.id = 1)
WHERE userId = @USER_ID;
*/

-- ==========================================
-- TEST 3: VIDER LE PANIER (SQL)
-- ==========================================
-- Supprimer les articles du panier
DELETE FROM cart_items 
WHERE cartId IN (
    SELECT id FROM cart WHERE userId = @USER_ID
);

-- Réinitialiser le panier
UPDATE cart 
SET totalItems = 0, totalPrice = 0 
WHERE userId = @USER_ID;

-- ==========================================
-- TEST 4: Voir le panier après vidage
-- ==========================================
SELECT '=== APRÈS VIDAGE ===' as 'Test 4';
SELECT 
    c.id as 'ID Panier',
    c.userId as 'User ID',
    COUNT(ci.id) as 'Nombre d\'articles',
    SUM(ci.quantity) as 'Quantité totale',
    c.totalPrice as 'Prix Total'
FROM cart c
LEFT JOIN cart_items ci ON c.id = ci.cartId
WHERE c.userId = @USER_ID
GROUP BY c.id, c.userId, c.totalPrice;

-- ==========================================
-- TEST 5: Vérifier les commandes de l'utilisateur
-- ==========================================
SELECT '=== COMMANDES DE L\'UTILISATEUR ===' as 'Test 5';
SELECT 
    o.id as 'ID Commande',
    o.orderNumber as 'Numéro',
    o.status as 'Statut',
    o.total as 'Total',
    o.createdAt as 'Date création'
FROM orders o
WHERE o.userId = @USER_ID
ORDER BY o.createdAt DESC;

-- Détails de la dernière commande
SELECT 
    oi.id as 'Item ID',
    p.name as 'Produit',
    oi.quantity as 'Quantité',
    oi.unitPrice as 'Prix unitaire',
    (oi.quantity * oi.unitPrice) as 'Sous-total'
FROM order_items oi
JOIN orders o ON o.id = oi.orderId
JOIN products p ON p.id = oi.productId
WHERE o.userId = @USER_ID
ORDER BY o.createdAt DESC
LIMIT 10;

-- ==========================================
-- TEST 6: Audit - Vérifier la synchronisation
-- ==========================================
SELECT '=== AUDIT ===' as 'Test 6';
SELECT 
    'Panier' as 'Type',
    COUNT(*) as 'Nombre d\'enregistrements'
FROM cart
WHERE userId = @USER_ID
UNION ALL
SELECT 
    'Articles du panier' as 'Type',
    COUNT(*) as 'Nombre d\'enregistrements'
FROM cart_items
WHERE cartId IN (SELECT id FROM cart WHERE userId = @USER_ID);

-- ==========================================
-- Résumé Final
-- ==========================================
SELECT '=== RÉSUMÉ ===' as 'Résultat';
SELECT 
    'Panier vidé: ' as 'Status',
    CASE 
        WHEN (SELECT COUNT(*) FROM cart_items WHERE cartId IN (SELECT id FROM cart WHERE userId = @USER_ID)) = 0 
        THEN '✅ OUI' 
        ELSE '❌ NON' 
    END as 'Valeur';

-- ==========================================
-- ROLLBACK (En cas d'erreur, décommenter)
-- ==========================================
-- ROLLBACK;
