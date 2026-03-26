<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../controllers/ProductController.php';

$method = $_SERVER['REQUEST_METHOD'];
$productController = new ProductController();

// Récupérer l'ID s'il existe
$id = isset($_GET['id']) ? $_GET['id'] : null;

switch ($method) {
    case 'GET':
        if ($id) {
            $response = $productController->getProductById($id);
        } else {
            $response = $productController->getAllProducts();
        }
        http_response_code($response['code']);
        echo json_encode($response);
        break;
    case 'POST':
        $response = $productController->createProduct();
        http_response_code($response['code']);
        echo json_encode($response);
        break;
    case 'PUT':
        if ($id) {
            $response = $productController->updateProduct($id);
            http_response_code($response['code']);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID requis']);
        }
        break;
    case 'DELETE':
        if ($id) {
            $response = $productController->deleteProduct($id);
            http_response_code($response['code']);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID requis']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
        break;
}
?>
