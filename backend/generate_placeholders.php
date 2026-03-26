<?php
/**
 * Génère des images placeholder pour les produits sans image
 * - Crée `product_<id>.jpg` dans `backend/public/images/products`
 * - Copie aussi dans `C:\xampp\htdocs\sanabel-backend\public\images\products` si présent
 * - Met à jour le champ `products.image` avec le nom du fichier
 */
require_once __DIR__ . '/config/Database.php';

function createPlaceholderImage($filepath, $title) {
    $width = 800;
    $height = 600;
    $im = imagecreatetruecolor($width, $height);

    // Colors
    $bg = imagecolorallocate($im, 240, 240, 240);
    $textColor = imagecolorallocate($im, 80, 80, 80);
    $accent = imagecolorallocate($im, 200, 200, 200);

    // Fill background
    imagefilledrectangle($im, 0, 0, $width, $height, $bg);

    // Draw accent rectangle
    imagefilledrectangle($im, 0, $height - 120, $width, $height, $accent);

    // Title - center
    $font = 5; // built-in font
    $lines = wordwrap($title, 24, "\n");
    $y = 120;
    foreach (explode("\n", $lines) as $line) {
        $tw = imagefontwidth($font) * strlen($line);
        $tx = ($width - $tw) / 2;
        imagestring($im, $font, (int)$tx, $y, $line, $textColor);
        $y += imagefontheight($font) + 6;
    }

    // Small footer text
    $footer = "Produit";
    $fw = imagefontwidth(3) * strlen($footer);
    imagestring($im, 3, ($width - $fw) / 2, $height - 40, $footer, $textColor);

    // Save JPEG
    imagejpeg($im, $filepath, 85);
    imagedestroy($im);
}

try {
    $db = new Database();
    $pdo = $db->connect();
    if (!$pdo) throw new Exception('Connexion DB échouée');

    $imagesDir = __DIR__ . '/public/images/products';
    if (!is_dir($imagesDir)) mkdir($imagesDir, 0755, true);

    $xamppImagesDir = 'C:/xampp/htdocs/sanabel-backend/public/images/products';
    $haveXampp = is_dir($xamppImagesDir);
    if ($haveXampp && !is_dir($xamppImagesDir)) mkdir($xamppImagesDir, 0755, true);

    // Récupérer produits sans image
    $stmt = $pdo->query("SELECT id, name, image FROM products ORDER BY id");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $created = 0; $skipped = 0; $updated = 0;

    foreach ($products as $p) {
        $id = (int)$p['id'];
        $name = $p['name'] ?: "Produit $id";
        $current = $p['image'];
        $filename = "product_{$id}.jpg";
        $localPath = $imagesDir . '/' . $filename;

        if (!file_exists($localPath)) {
            createPlaceholderImage($localPath, $name);
            $created++;
        } else {
            $skipped++;
        }

        // Copy to XAMPP if present
        if ($haveXampp) {
            $dest = $xamppImagesDir . '/' . $filename;
            if (!file_exists($dest)) copy($localPath, $dest);
        }

        // Update DB if missing or different
        if (empty($current) || $current !== $filename) {
            $u = $pdo->prepare("UPDATE products SET image = ? WHERE id = ?");
            $u->execute([$filename, $id]);
            $updated++;
        }
    }

    echo "<pre>";
    echo "✅ Génération terminée.\n";
    echo "Créées: $created\n";
    echo "Existantes (sautées): $skipped\n";
    echo "Mis à jour en base: $updated\n";
    if ($haveXampp) echo "Copiées vers XAMPP: $xamppImagesDir\n";
    echo "</pre>";

} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage();
}
?>