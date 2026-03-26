<?php
/**
 * API pour servir les images des produits
 * Accès: /api/image.php?id=1
 */

header('Content-Type: image/jpeg');
header('Cache-Control: public, max-age=31536000');
header('Access-Control-Allow-Origin: *');

$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if (!$id) {
    http_response_code(400);
    die('ID manquant');
}

$imageDir = __DIR__ . '/../public/images/products';
$imagePath = $imageDir . '/product_' . $id . '.jpg';

if (!file_exists($imagePath)) {
    // Retourner une image placeholder
    http_response_code(404);
    header('Content-Type: image/svg+xml');
    echo '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="#f0f0f0"/>
        <text x="200" y="200" font-size="20" fill="#999" text-anchor="middle" dominant-baseline="middle">
            Image non trouvée: ' . htmlspecialchars("product_$id.jpg") . '
        </text>
    </svg>';
    die();
}

// Servir l'image
readfile($imagePath);
?>
