<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Notifier.php';

class OrderController {
    private $db;
    private $connection;

    public function __construct() {
        $this->db = new Database();
        $this->connection = $this->db->connect();
    }

    // Créer une commande
    public function createOrder() {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->userId) || !isset($data->items) || !isset($data->shippingInfo)) {
            return [
                'success' => false,
                'message' => 'Données invalides',
                'code' => 400
            ];
        }

        try {
            // Commencer une transaction
            $this->connection->beginTransaction();

            $totalAmount = 0;
            foreach ($data->items as $item) {
                $totalAmount += ($item->product->price * $item->quantity);
            }
            $totalAmount += ($data->shippingInfo->shippingCost ?? 0);

            $orderNumber = 'CMD-' . time() . '-' . rand(1000, 9999);

            $query = "INSERT INTO orders (userId, orderNumber, totalAmount, shippingAddress, shippingCity, shippingPostalCode, shippingPhone, deliveryDistance, shippingCost, status, createdAt) 
                      VALUES (:userId, :orderNumber, :totalAmount, :shippingAddress, :shippingCity, :shippingPostalCode, :shippingPhone, :deliveryDistance, :shippingCost, :status, NOW())";
            $stmt = $this->connection->prepare($query);
            
            $stmt->bindParam(':userId', $data->userId);
            $stmt->bindParam(':orderNumber', $orderNumber);
            $stmt->bindParam(':totalAmount', $totalAmount);
            $stmt->bindParam(':shippingAddress', $data->shippingInfo->address);
            $stmt->bindParam(':shippingCity', $data->shippingInfo->city);
            $stmt->bindParam(':shippingPostalCode', $data->shippingInfo->postalCode);
            $stmt->bindParam(':shippingPhone', $data->shippingInfo->phone);
            $deliveryDistance = $data->shippingInfo->deliveryDistance ?? null;
            $stmt->bindParam(':deliveryDistance', $deliveryDistance);
            $shippingCost = $data->shippingInfo->shippingCost ?? 0;
            $stmt->bindParam(':shippingCost', $shippingCost);
            $status = 'PENDING';
            $stmt->bindParam(':status', $status);

            $stmt->execute();
            $orderId = $this->connection->lastInsertId();

            // Ajouter les articles de la commande
            $itemQuery = "INSERT INTO order_items (orderId, productId, quantity, unitPrice) VALUES (:orderId, :productId, :quantity, :unitPrice)";
            $itemStmt = $this->connection->prepare($itemQuery);

            foreach ($data->items as $item) {
                $itemStmt->bindParam(':orderId', $orderId);
                $itemStmt->bindParam(':productId', $item->product->id);
                $itemStmt->bindParam(':quantity', $item->quantity);
                $itemStmt->bindParam(':unitPrice', $item->product->price);
                $itemStmt->execute();
            }

            $this->connection->commit();

            // Notify admin and log audit
            Notifier::createNotification(Notifier::$adminUserId ?? 1, 'Nouvelle commande', 'Commande créée: ' . $orderNumber, $orderId, null);
            Notifier::createAuditLog($data->userId ?? null, 'create_order', 'order', $orderId, null, $data);

            return [
                'success' => true,
                'message' => 'Commande créée',
                'data' => [
                    'id' => $orderId,
                    'orderNumber' => $orderNumber
                ],
                'code' => 201
            ];
        } catch (Exception $e) {
            $this->connection->rollBack();
            return [
                'success' => false,
                'message' => 'Erreur serveur: ' . $e->getMessage(),
                'code' => 500
            ];
        }
    }

    // Récupérer les commandes d'un utilisateur
    public function getUserOrders($userId) {
        try {
            $query = "SELECT * FROM orders WHERE userId = :userId ORDER BY createdAt DESC";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'data' => $orders,
                'code' => 200
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erreur serveur: ' . $e->getMessage(),
                'code' => 500
            ];
        }
    }

    // Récupérer une commande par ID
    public function getOrderById($id) {
        try {
            $query = "SELECT * FROM orders WHERE id = :id";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $order = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($order) {
                // Récupérer les articles
                $itemQuery = "SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.productId = p.id WHERE oi.orderId = :orderId";
                $itemStmt = $this->connection->prepare($itemQuery);
                $itemStmt->bindParam(':orderId', $id);
                $itemStmt->execute();
                $order['items'] = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

                return [
                    'success' => true,
                    'data' => $order,
                    'code' => 200
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Commande non trouvée',
                    'code' => 404
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erreur serveur: ' . $e->getMessage(),
                'code' => 500
            ];
        }
    }

    // Mettre à jour le statut d'une commande
    public function updateOrderStatus($id) {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->status)) {
            return [
                'success' => false,
                'message' => 'Statut requis',
                'code' => 400
            ];
        }

        try {
            $query = "UPDATE orders SET status = :status WHERE id = :id";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':status', $data->status);

            if ($stmt->execute()) {
                // notify admin and audit
                Notifier::createNotification(Notifier::$adminUserId ?? 1, 'Statut commande', 'Commande ID ' . $id . ' statut: ' . $data->status, $id, null);
                Notifier::createAuditLog(null, 'update_order_status', 'order', $id, null, $data);
                return [
                    'success' => true,
                    'message' => 'Statut mis à jour',
                    'code' => 200
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erreur serveur: ' . $e->getMessage(),
                'code' => 500
            ];
        }
    }

    // Obtenir toutes les commandes (pour admin)
    public function getAllOrders() {
        try {
            $query = "SELECT o.*, u.firstName, u.lastName, u.email 
                      FROM orders o 
                      LEFT JOIN users u ON o.userId = u.id 
                      ORDER BY o.createdAt DESC";
            $stmt = $this->connection->prepare($query);
            $stmt->execute();
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'data' => $orders,
                'code' => 200
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erreur serveur: ' . $e->getMessage(),
                'code' => 500
            ];
        }
    }
}
?>
