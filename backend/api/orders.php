<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../controllers/OrderController.php';

$method = $_SERVER['REQUEST_METHOD'];
$orderController = new OrderController();

// Récupérer l'ID s'il existe
$id = isset($_GET['id']) ? $_GET['id'] : null;
$userId = isset($_GET['userId']) ? $_GET['userId'] : null;
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($method) {
    case 'GET':
        if ($id) {
            $response = $orderController->getOrderById($id);
        } elseif ($userId) {
            $response = $orderController->getUserOrders($userId);
        } else {
            // Admin: get all orders
            $response = $orderController->getAllOrders();
        }
        http_response_code($response['code']);
        echo json_encode($response);
        break;
    case 'POST':
        $response = $orderController->createOrder();
        http_response_code($response['code']);
        echo json_encode($response);
        break;
    case 'PUT':
        if ($id && $action === 'status') {
            $response = $orderController->updateOrderStatus($id);
            http_response_code($response['code']);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID et action requis']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
        break;
}
?>
