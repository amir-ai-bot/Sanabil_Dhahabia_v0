<?php
/**
 * Script pour vérifier quels produits ont des images
 */

require_once __DIR__ . '/config/Database.php';

try {
    $db = new Database();
    $pdo = $db->connect();
    
    if (!$pdo) {
        echo "Erreur de connexion à la base de données\n";
        exit(1);
    }
    
    echo "\n═══════════════════════════════════════════\n";
    echo "Vérification des images en base de données\n";
    echo "═══════════════════════════════════════════\n\n";
    
    // Vérifier les produits
    $stmt = $pdo->query("SELECT id, name, image FROM products ORDER BY id LIMIT 30");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Produits trouvés: " . count($products) . "\n\n";
    
    $withImage = 0;
    $withoutImage = 0;
    
    foreach ($products as $product) {
        $status = !empty($product['image']) ? '✓' : '✗';
        $image = $product['image'] ?: '(aucune)';
        echo "[$status] ID {$product['id']} - {$product['name']} => $image\n";
        
        if (!empty($product['image'])) {
            $withImage++;
        } else {
            $withoutImage++;
        }
    }
    
    echo "\n═══════════════════════════════════════════\n";
    echo "Résumé:\n";
    echo "  Avec image: $withImage\n";
    echo "  Sans image: $withoutImage\n";
    echo "═══════════════════════════════════════════\n\n";
    
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
    exit(1);
}
?>
