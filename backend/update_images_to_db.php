<?php
/**
 * Script pour associer les images téléchargées aux produits
 */

require_once __DIR__ . '/config/Database.php';

try {
    $db = new Database();
    $pdo = $db->connect();
    
    if (!$pdo) {
        throw new Exception("Erreur de connexion à la base de données");
    }
    
    // Dossier des images
    $imagesDir = __DIR__ . '/public/images/products';
    
    echo "\n═══════════════════════════════════════════\n";
    echo "📸 Association des images aux produits\n";
    echo "═══════════════════════════════════════════\n\n";
    
    // Récupérer tous les produits
    $stmt = $pdo->query("SELECT id, name FROM products ORDER BY id");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Produits trouvés: " . count($products) . "\n\n";
    
    $updatedCount = 0;
    
    foreach ($products as $product) {
        $productId = $product['id'];
        $productName = $product['name'];
        $imageName = "product_$productId.jpg";
        $imagePath = $imagesDir . '/' . $imageName;
        $imageUrl = "/images/products/$imageName";
        
        // Vérifier si l'image existe
        if (file_exists($imagePath)) {
            // Mettre à jour le produit avec l'image
            $updateStmt = $pdo->prepare("UPDATE products SET image = ? WHERE id = ?");
            $updateStmt->execute([$imageUrl, $productId]);
            
            echo "✓ [$productId] $productName -> $imageName\n";
            $updatedCount++;
        } else {
            echo "✗ [$productId] $productName -> Image non trouvée\n";
        }
    }
    
    echo "\n═══════════════════════════════════════════\n";
    echo "Produits mis à jour: $updatedCount\n";
    echo "═══════════════════════════════════════════\n";
    
} catch (Exception $e) {
    echo "ERREUR: " . $e->getMessage() . "\n";
    exit(1);
}
?>
