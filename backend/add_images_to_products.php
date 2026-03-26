<?php
/**
 * Script pour ajouter des images aux produits
 * Utilise des images publiques de stock images (Pixabay, Pexels)
 */

require_once 'config/Database.php';

$db = new Database();
$pdo = $db->connect();

// Images d'exemple par catégorie
$categoryImages = [
    1 => [  // Semences
        'https://images.pexels.com/photos/533446/pexels-photo-533446.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/2389141/pexels-photo-2389141.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3962288/pexels-photo-3962288.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5730428/pexels-photo-5730428.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    2 => [  // Outils
        'https://images.pexels.com/photos/3825440/pexels-photo-3825440.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3962287/pexels-photo-3962287.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/8534488/pexels-photo-8534488.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    3 => [  // Équipements
        'https://images.pexels.com/photos/3173043/pexels-photo-3173043.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/4503269/pexels-photo-4503269.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    4 => [  // Services
        'https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3962289/pexels-photo-3962289.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    5 => [  // Accessoires
        'https://images.pexels.com/photos/3825441/pexels-photo-3825441.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3962290/pexels-photo-3962290.jpeg?auto=compress&cs=tinysrgb&w=400',
    ]
];

echo "\n═══════════════════════════════════════════════════════════\n";
echo "📸 Attribution des images aux produits\n";
echo "═══════════════════════════════════════════════════════════\n\n";

try {
    // Récupérer tous les produits sans images
    $stmt = $pdo->query("SELECT id, name, categoryId FROM products WHERE image IS NULL OR image = '' ORDER BY id");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($products)) {
        echo "✓ Tous les produits ont déjà des images.\n";
        exit(0);
    }
    
    $successCount = 0;
    
    foreach ($products as $idx => $product) {
        $productId = $product['id'];
        $productName = $product['name'];
        $categoryId = $product['categoryId'];
        
        // Sélectionner une image pour cette catégorie
        $categoryImageList = isset($categoryImages[$categoryId]) ? $categoryImages[$categoryId] : $categoryImages[1];
        $imageUrl = $categoryImageList[$idx % count($categoryImageList)];
        
        // Mettre à jour
        $updateStmt = $pdo->prepare("UPDATE products SET image = ? WHERE id = ?");
        if ($updateStmt->execute([$imageUrl, $productId])) {
            echo "✓ " . str_pad($productName, 45) . " → Image ajoutée\n";
            $successCount++;
        } else {
            echo "✗ " . $productName . " → Erreur mise à jour\n";
        }
    }
    
    echo "\n═══════════════════════════════════════════════════════════\n";
    echo "✓ Images attribuées: $successCount produits\n";
    echo "═══════════════════════════════════════════════════════════\n\n";
    
} catch (Exception $e) {
    echo "ERREUR: " . $e->getMessage() . "\n";
    exit(1);
}
?>
