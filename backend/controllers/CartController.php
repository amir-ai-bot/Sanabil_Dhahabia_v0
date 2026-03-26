<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Notifier.php';

class CartController {
    private $db;
    private $connection;

    public function __construct() {
        $this->db = new Database();
        $this->connection = $this->db->connect();
    }

    // Récupérer le panier d'un utilisateur
    public function getCart($userId) {
        try {
            $query = "SELECT 
                        c.id as cartId,
                        ci.id as itemId,
                        p.id as productId,
                        p.name,
                        p.price,
                        p.image,
                        ci.quantity
                      FROM cart c
                      LEFT JOIN cart_items ci ON c.id = ci.cartId
                      LEFT JOIN products p ON ci.productId = p.id
                      WHERE c.userId = :userId
                      ORDER BY ci.addedAt DESC";
            
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'data' => $items,
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

    // Ajouter un article au panier
    public function addToCart() {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->userId) || !isset($data->productId) || !isset($data->quantity)) {
            return [
                'success' => false,
                'message' => 'Données invalides',
                'code' => 400
            ];
        }

        try {
            // Vérifier que le produit existe et a du stock
            $checkQuery = "SELECT stock FROM products WHERE id = :productId";
            $checkStmt = $this->connection->prepare($checkQuery);
            $checkStmt->bindParam(':productId', $data->productId);
            $checkStmt->execute();
            $product = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if (!$product || $product['stock'] < $data->quantity) {
                return [
                    'success' => false,
                    'message' => 'Stock insuffisant',
                    'code' => 400
                ];
            }

            // Obtenir ou créer le panier
            $cartQuery = "SELECT id FROM cart WHERE userId = :userId";
            $cartStmt = $this->connection->prepare($cartQuery);
            $cartStmt->bindParam(':userId', $data->userId);
            $cartStmt->execute();
            $cart = $cartStmt->fetch(PDO::FETCH_ASSOC);

            if (!$cart) {
                $createQuery = "INSERT INTO cart (userId, totalItems, totalPrice) VALUES (:userId, 0, 0)";
                $createStmt = $this->connection->prepare($createQuery);
                $createStmt->bindParam(':userId', $data->userId);
                $createStmt->execute();
                $cartId = $this->connection->lastInsertId();
            } else {
                $cartId = $cart['id'];
            }

            // Vérifier si le produit existe déjà dans le panier
            $itemQuery = "SELECT id, quantity FROM cart_items WHERE cartId = :cartId AND productId = :productId";
            $itemStmt = $this->connection->prepare($itemQuery);
            $itemStmt->bindParam(':cartId', $cartId);
            $itemStmt->bindParam(':productId', $data->productId);
            $itemStmt->execute();
            $item = $itemStmt->fetch(PDO::FETCH_ASSOC);

            if ($item) {
                // Mettre à jour la quantité
                $updateQuery = "UPDATE cart_items SET quantity = quantity + :quantity WHERE id = :itemId";
                $updateStmt = $this->connection->prepare($updateQuery);
                $updateStmt->bindParam(':quantity', $data->quantity);
                $updateStmt->bindParam(':itemId', $item['id']);
                $updateStmt->execute();
            } else {
                // Ajouter un nouvel article
                $addQuery = "INSERT INTO cart_items (cartId, productId, quantity) VALUES (:cartId, :productId, :quantity)";
                $addStmt = $this->connection->prepare($addQuery);
                $addStmt->bindParam(':cartId', $cartId);
                $addStmt->bindParam(':productId', $data->productId);
                $addStmt->bindParam(':quantity', $data->quantity);
                $addStmt->execute();
            }

            // notify user and audit
            Notifier::createNotification($data->userId, 'Panier mis à jour', 'Un article a été ajouté/mis à jour dans votre panier', null, $data->productId);
            Notifier::createAuditLog($data->userId, 'add_to_cart', 'cart_item', null, null, $data);

            return [
                'success' => true,
                'message' => 'Article ajouté au panier',
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

    // Vider le panier d'un utilisateur
    public function clearCart($userId) {
        try {
            // Supprimer les articles du panier
            $query = "DELETE FROM cart_items WHERE cartId IN (SELECT id FROM cart WHERE userId = :userId)";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();

            // Réinitialiser le panier
            $resetQuery = "UPDATE cart SET totalItems = 0, totalPrice = 0 WHERE userId = :userId";
            $resetStmt = $this->connection->prepare($resetQuery);
            $resetStmt->bindParam(':userId', $userId);
            $resetStmt->execute();

            return [
                'success' => true,
                'message' => 'Panier vidé avec succès',
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

    // Supprimer un article du panier
    public function removeFromCart() {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->cartItemId)) {
            return [
                'success' => false,
                'message' => 'ID d\'article requis',
                'code' => 400
            ];
        }

        try {
            $query = "DELETE FROM cart_items WHERE id = :itemId";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':itemId', $data->cartItemId);
            $stmt->execute();

            return [
                'success' => true,
                'message' => 'Article supprimé du panier',
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

    // Mettre à jour la quantité d'un article
    public function updateQuantity() {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->cartItemId) || !isset($data->quantity)) {
            return [
                'success' => false,
                'message' => 'Données invalides',
                'code' => 400
            ];
        }

        try {
            if ($data->quantity <= 0) {
                // Supprimer l'article si quantité <= 0
                return $this->removeFromCart();
            }

            $query = "UPDATE cart_items SET quantity = :quantity WHERE id = :itemId";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':quantity', $data->quantity);
            $stmt->bindParam(':itemId', $data->cartItemId);
            $stmt->execute();

            return [
                'success' => true,
                'message' => 'Quantité mise à jour',
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
