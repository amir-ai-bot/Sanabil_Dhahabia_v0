<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Notifier.php';

class ProductController {
    private $db;
    private $connection;

    public function __construct() {
        $this->db = new Database();
        $this->connection = $this->db->connect();
    }

    // Récupérer tous les produits
    public function getAllProducts() {
        try {
            $query = "SELECT * FROM products ORDER BY name ASC";
            $stmt = $this->connection->prepare($query);
            $stmt->execute();
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'data' => $products,
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

    // Récupérer un produit par ID
    public function getProductById($id) {
        try {
            $query = "SELECT * FROM products WHERE id = :id";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $product = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($product) {
                return [
                    'success' => true,
                    'data' => $product,
                    'code' => 200
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Produit non trouvé',
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

    // Créer un produit (admin)
    public function createProduct() {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->name) || !isset($data->price) || !isset($data->description)) {
            return [
                'success' => false,
                'message' => 'Données invalides',
                'code' => 400
            ];
        }

        try {
            $query = "INSERT INTO products (name, description, price, image, categoryId, stock, createdAt) 
                      VALUES (:name, :description, :price, :image, :categoryId, :stock, NOW())";
            $stmt = $this->connection->prepare($query);
            
            $stmt->bindParam(':name', $data->name);
            $stmt->bindParam(':description', $data->description);
            $stmt->bindParam(':price', $data->price);
            $image = $data->image ?? null;
            $stmt->bindParam(':image', $image);
            $categoryId = $data->categoryId ?? null;
            $stmt->bindParam(':categoryId', $categoryId);
            $stock = $data->stock ?? 0;
            $stmt->bindParam(':stock', $stock);

            if ($stmt->execute()) {
                // notify admin and create audit log
                $newId = $this->connection->lastInsertId();
                Notifier::createNotification(Notifier::$adminUserId ?? 1, 'Nouveau produit', 'Un produit a été créé: ' . $data->name, null, $newId);
                Notifier::createAuditLog(null, 'create_product', 'product', $newId, null, $data);
                return [
                    'success' => true,
                    'message' => 'Produit créé avec succès',
                    'id' => $newId,
                    'code' => 201
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

    // Mettre à jour un produit
    public function updateProduct($id) {
        $data = json_decode(file_get_contents("php://input"));

        try {
            // fetch old product for audit
            $old = null;
            $fetchQuery = "SELECT * FROM products WHERE id = :id";
            $fetchStmt = $this->connection->prepare($fetchQuery);
            $fetchStmt->bindParam(':id', $id);
            $fetchStmt->execute();
            $old = $fetchStmt->fetch(PDO::FETCH_ASSOC);

            // Build dynamic query to update only provided fields
            $updates = [];
            $params = [':id' => $id];
            
            if (isset($data->name)) {
                $updates[] = "name = :name";
                $params[':name'] = $data->name;
            }
            if (isset($data->description)) {
                $updates[] = "description = :description";
                $params[':description'] = $data->description;
            }
            if (isset($data->price)) {
                $updates[] = "price = :price";
                $params[':price'] = $data->price;
            }
            if (isset($data->stock)) {
                $updates[] = "stock = :stock";
                $params[':stock'] = $data->stock;
            }
            if (isset($data->image)) {
                $updates[] = "image = :image";
                $params[':image'] = $data->image;
            }
            if (isset($data->categoryId)) {
                $updates[] = "categoryId = :categoryId";
                $params[':categoryId'] = $data->categoryId;
            }

            if (empty($updates)) {
                return [
                    'success' => false,
                    'message' => 'Aucun champ à mettre à jour',
                    'code' => 400
                ];
            }

            $query = "UPDATE products SET " . implode(", ", $updates) . " WHERE id = :id";
            $stmt = $this->connection->prepare($query);
            
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }

            if ($stmt->execute()) {
                Notifier::createNotification(Notifier::$adminUserId ?? 1, 'Produit modifié', 'Produit ID ' . $id . ' mis à jour', null, $id);
                Notifier::createAuditLog(null, 'update_product', 'product', $id, $old, $data);
                return [
                    'success' => true,
                    'message' => 'Produit mis à jour',
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

    // Supprimer un produit
    public function deleteProduct($id) {
        try {
            // fetch old product for audit
            $old = null;
            $fetchQuery = "SELECT * FROM products WHERE id = :id";
            $fetchStmt = $this->connection->prepare($fetchQuery);
            $fetchStmt->bindParam(':id', $id);
            $fetchStmt->execute();
            $old = $fetchStmt->fetch(PDO::FETCH_ASSOC);

            $query = "DELETE FROM products WHERE id = :id";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':id', $id);

            if ($stmt->execute()) {
                Notifier::createNotification(Notifier::$adminUserId ?? 1, 'Produit supprimé', 'Produit ID ' . $id . ' supprimé', null, $id);
                Notifier::createAuditLog(null, 'delete_product', 'product', $id, $old, null);
                return [
                    'success' => true,
                    'message' => 'Produit supprimé',
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
}
?>
