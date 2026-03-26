<?php
/**
 * Vérifier combien de produits existent et quels manquent des images
 */

require_once __DIR__ . '/config/Database.php';

try {
    $db = new Database();
    $pdo = $db->connect();
    
    if (!$pdo) {
        echo "Erreur de connexion\n";
        exit(1);
    }
    
    // Compter les produits
    $countStmt = $pdo->query("SELECT COUNT(*) as total FROM products");
    $countResult = $countStmt->fetch(PDO::FETCH_ASSOC);
    $totalProducts = $countResult['total'];
    
    // Obtenir les produits sans image
    $missingStmt = $pdo->query("SELECT id, name FROM products WHERE image IS NULL OR image = '' ORDER BY id");
    $missingProducts = $missingStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Obtenir les produits avec image
    $withImageStmt = $pdo->query("SELECT COUNT(*) as total FROM products WHERE image IS NOT NULL AND image != ''");
    $withImageResult = $withImageStmt->fetch(PDO::FETCH_ASSOC);
    $productsWithImage = $withImageResult['total'];
    
    echo "\n═══════════════════════════════════════════\n";
    echo "📊 Diagnostic des images\n";
    echo "═══════════════════════════════════════════\n\n";
    
    echo "Total de produits: $totalProducts\n";
    echo "Produits avec image: $productsWithImage\n";
    echo "Produits SANS image: " . count($missingProducts) . "\n\n";
    
    if (!empty($missingProducts)) {
        echo "Produits manquant une image:\n";
        foreach ($missingProducts as $product) {
            echo "  ✗ ID {$product['id']}: {$product['name']}\n";
        }
        echo "\n";
    } else {
        echo "✓ Tous les produits ont une image!\n\n";
    }
    
    echo "═══════════════════════════════════════════\n";
    
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
    exit(1);
}
?>
