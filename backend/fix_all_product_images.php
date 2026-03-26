<?php
/**
 * Vérifier et corriger les images de tous les produits
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
    echo "Correction automatique des images\n";
    echo "═══════════════════════════════════════════\n\n";
    
    // Récupérer tous les produits
    $stmt = $pdo->query("SELECT id, name, image FROM products ORDER BY id");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $imagesDir = __DIR__ . '/public/images/products';
    
    echo "Produits trouvés: " . count($products) . "\n";
    echo "Dossier images: $imagesDir\n\n";
    
    $updateCount = 0;
    $alreadyOk = 0;
    
    foreach ($products as $product) {
        $productId = $product['id'];
        $imageName = "product_$productId.jpg";
        $imagePath = $imagesDir . '/' . $imageName;
        $currentImage = $product['image'];
        
        // Vérifier si l'image existe
        if (file_exists($imagePath)) {
            // L'image existe
            if (empty($currentImage) || $currentImage !== $imageName) {
                // Mettre à jour
                $updateStmt = $pdo->prepare("UPDATE products SET image = ? WHERE id = ?");
                $updateStmt->execute([$imageName, $productId]);
                
                echo "✓ [ID $productId] MISE À JOUR: $imageName\n";
                $updateCount++;
            } else {
                echo "✓ [ID $productId] OK: $imageName\n";
                $alreadyOk++;
            }
        } else {
            echo "✗ [ID $productId] MANQUANT: {$product['name']} (pas de $imageName)\n";
        }
    }
    
    echo "\n═══════════════════════════════════════════\n";
    echo "Résumé:\n";
    echo "  Mises à jour: $updateCount\n";
    echo "  Déjà corrects: $alreadyOk\n";
    echo "  Total: " . count($products) . "\n";
    echo "═══════════════════════════════════════════\n\n";
    
    // Afficher les images manquantes
    $missingImages = [];
    foreach ($products as $product) {
        $imagePath = $imagesDir . '/product_' . $product['id'] . '.jpg';
        if (!file_exists($imagePath)) {
            $missingImages[] = $product['id'];
        }
    }
    
    if (!empty($missingImages)) {
        echo "Images manquantes pour les produits: " . implode(', ', $missingImages) . "\n";
    } else {
        echo "✓ Toutes les images existent!\n";
    }
    
    echo "\n";
    
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
    exit(1);
}
?>
