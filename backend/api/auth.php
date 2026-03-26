<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../controllers/AuthController.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

$authController = new AuthController();

switch ($action) {
    case 'login':
        if ($method === 'POST') {
            $response = $authController->login();
            http_response_code($response['code']);
            echo json_encode($response);
        }
        break;
    case 'register':
        if ($method === 'POST') {
            $response = $authController->register();
            http_response_code($response['code']);
            echo json_encode($response);
        }
        break;
    case 'logout':
        if ($method === 'POST') {
            $response = $authController->logout();
            http_response_code($response['code']);
            echo json_encode($response);
        }
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Action non trouvée']);
        break;
}
?>
