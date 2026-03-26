<?php
/**
 * List image filenames in public/images/products for the admin image picker.
 * GET → JSON: { "data": ["product_1.jpg", "product_2.jpg", ...] }
 */

require_once __DIR__ . '/../config/cors.php';

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

$imagesDir = realpath(__DIR__ . '/../public/images/products');
if (!$imagesDir || !is_dir($imagesDir)) {
    echo json_encode(['success' => true, 'data' => []]);
    exit;
}

$allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$files = [];
foreach (scandir($imagesDir) as $name) {
    if ($name === '.' || $name === '..') continue;
    $path = $imagesDir . DIRECTORY_SEPARATOR . $name;
    if (!is_file($path)) continue;
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if (in_array($ext, $allowed, true)) {
        $files[] = $name;
    }
}
sort($files);

echo json_encode(['success' => true, 'data' => $files]);
