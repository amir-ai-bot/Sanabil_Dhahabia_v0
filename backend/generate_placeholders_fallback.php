<?php
/**
 * Fallback: duplique `product_1.jpg` pour tous les produits manquants
 * et met à jour le champ `products.image`.
 */
require_once __DIR__ . '/config/Database.php';

try {
    $db = new Database();
    $pdo = $db->connect();
    if (!$pdo) throw new Exception('Connexion DB échouée');

    $imagesDir = __DIR__ . '/public/images/products';
    if (!is_dir($imagesDir)) mkdir($imagesDir, 0755, true);

    $source = $imagesDir . '/product_1.jpg';
    if (!file_exists($source)) throw new Exception('Fichier source product_1.jpg introuvable');

    $stmt = $pdo->query("SELECT id, name, image FROM products ORDER BY id");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $copied = 0; $updated = 0; $skipped = 0;

    foreach ($products as $p) {
        $id = (int)$p['id'];
        $filename = "product_{$id}.jpg";
        $path = $imagesDir . '/' . $filename;
        if (!file_exists($path)) {
            if (copy($source, $path)) {
                $copied++;
            }
        } else {
            $skipped++;
        }

        if (empty($p['image']) || $p['image'] !== $filename) {
            $u = $pdo->prepare("UPDATE products SET image = ? WHERE id = ?");
            $u->execute([$filename, $id]);
            $updated++;
        }
    }

    echo "<pre>";
    echo "Fallback duplication terminée.\n";
    echo "Copiés: $copied\n";
    echo "Déjà existants: $skipped\n";
    echo "Mis à jour DB: $updated\n";
    echo "</pre>";

} catch (Exception $e) {
    echo 'Erreur: ' . $e->getMessage();
}
?>