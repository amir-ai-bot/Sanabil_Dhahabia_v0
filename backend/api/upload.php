<?php
/**
 * Upload product images to local storage.
 * POST multipart/form-data with field "image" (file).
 * Saves to public/images/products/ with a safe filename.
 * Returns JSON: { success, path: '/images/products/...', message? }
 */

require_once __DIR__ . '/../config/cors.php';

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

$uploadDir = realpath(__DIR__ . '/../public/images/products');
if (!$uploadDir || !is_dir($uploadDir)) {
    $uploadDir = __DIR__ . '/../public/images/products';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $uploadDir = realpath($uploadDir);
}

$maxSize = 5 * 1024 * 1024; // 5 MB
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$allowedExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

if (!isset($_FILES['image']) || $_FILES['image']['error'] === UPLOAD_ERR_NO_FILE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Aucun fichier envoyé (attendu: champ "image")']);
    exit;
}

$file = $_FILES['image'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    $messages = [
        UPLOAD_ERR_INI_SIZE => 'Fichier trop volumineux (limite serveur)',
        UPLOAD_ERR_FORM_SIZE => 'Fichier trop volumineux',
        UPLOAD_ERR_PARTIAL => 'Téléchargement partiel',
        UPLOAD_ERR_NO_TMP_DIR => 'Dossier temporaire manquant',
        UPLOAD_ERR_CANT_WRITE => 'Impossible d\'écrire sur le disque',
        UPLOAD_ERR_EXTENSION => 'Extension refusée',
    ];
    $msg = $messages[$file['error']] ?? 'Erreur upload ' . $file['error'];
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $msg]);
    exit;
}

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Fichier trop volumineux (max 5 Mo)']);
    exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array(strtolower($mime), $allowedTypes, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Type de fichier non autorisé (jpg, png, gif, webp uniquement)']);
    exit;
}

$ext = match (strtolower($mime)) {
    'image/jpeg', 'image/jpg' => 'jpg',
    'image/png' => 'png',
    'image/gif' => 'gif',
    'image/webp' => 'webp',
    default => 'jpg',
};

$safeName = 'upload_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$destination = $uploadDir . DIRECTORY_SEPARATOR . $safeName;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Impossible d\'enregistrer le fichier']);
    exit;
}

if (PHP_OS_FAMILY !== 'Windows') {
    @chmod($destination, 0644);
}

$path = '/images/products/' . $safeName;
echo json_encode(['success' => true, 'path' => $path]);
