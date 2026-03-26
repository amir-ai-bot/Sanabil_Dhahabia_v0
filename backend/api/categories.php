<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/Database.php';

header('Content-Type: application/json; charset=utf-8');

$db = new Database();
$conn = $db->connect();

try {
    $query = "SELECT id, name, description, image, isActive FROM categories WHERE isActive = 1 ORDER BY displayOrder ASC, name ASC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $cats = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $cats,
        'code' => 200
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur serveur: ' . $e->getMessage(),
        'code' => 500
    ]);
}

?>
