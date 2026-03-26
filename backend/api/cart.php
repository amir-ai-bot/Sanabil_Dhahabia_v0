<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/CartController.php';

$controller = new CartController();
$action = isset($_GET['action']) ? $_GET['action'] : null;

try {
    switch ($action) {
        case 'get':
            $userId = isset($_GET['userId']) ? $_GET['userId'] : null;
            if (!$userId) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'userId requis']);
                exit;
            }
            $response = $controller->getCart($userId);
            break;

        case 'add':
            $response = $controller->addToCart();
            break;

        case 'clear':
            $userId = isset($_GET['userId']) ? $_GET['userId'] : null;
            if (!$userId) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'userId requis']);
                exit;
            }
            $response = $controller->clearCart($userId);
            break;

        case 'remove':
            $response = $controller->removeFromCart();
            break;

        case 'update':
            $response = $controller->updateQuantity();
            break;

        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Action non valide']);
            exit;
    }

    http_response_code($response['code']);
    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
?>
