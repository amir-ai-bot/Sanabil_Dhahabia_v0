<?php
require_once __DIR__ . '/config/Database.php';

header('Content-Type: application/json; charset=utf-8');

$db = new Database();
$conn = $db->connect();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed']);
    exit;
}

try {
    $stmt = $conn->prepare('SELECT COUNT(*) as cnt FROM products');
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'products_count' => (int)$row['cnt']]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>
