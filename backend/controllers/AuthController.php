<?php
require_once __DIR__ . '/../config/Database.php';

class AuthController {
    private $db;
    private $connection;

    public function __construct() {
        $this->db = new Database();
        $this->connection = $this->db->connect();
    }

    private function ensureConnection() {
        if (!$this->connection) {
            return [
                'success' => false,
                'message' => 'Impossible de se connecter à la base de données',
                'code' => 500
            ];
        }
        return null;
    }

    // Connexion utilisateur
    public function login() {
        $dbError = $this->ensureConnection();
        if ($dbError) {
            return $dbError;
        }

        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->email) || !isset($data->password)) {
            return [
                'success' => false,
                'message' => 'Email et mot de passe requis',
                'code' => 400
            ];
        }

        try {
            $query = "SELECT id, email, firstName, lastName, role FROM users WHERE email = :email AND password = :password";
            $stmt = $this->connection->prepare($query);
            
            $stmt->bindParam(':email', $data->email);
            $stmt->bindParam(':password', $data->password); // En production, utiliser password_hash et password_verify
            
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $_SESSION['user_id'] = $user['id'];
                return [
                    'success' => true,
                    'message' => 'Connexion réussie',
                    'data' => $user,
                    'code' => 200
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Email ou mot de passe incorrect',
                    'code' => 401
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

    // Inscription utilisateur
    public function register() {
        $dbError = $this->ensureConnection();
        if ($dbError) {
            return $dbError;
        }

        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->email) || !isset($data->password) || !isset($data->firstName) || !isset($data->lastName)) {
            return [
                'success' => false,
                'message' => 'Tous les champs sont requis',
                'code' => 400
            ];
        }

        try {
            // Vérifier si l'email existe déjà
            $checkQuery = "SELECT id FROM users WHERE email = :email";
            $checkStmt = $this->connection->prepare($checkQuery);
            $checkStmt->bindParam(':email', $data->email);
            $checkStmt->execute();

            if ($checkStmt->rowCount() > 0) {
                return [
                    'success' => false,
                    'message' => 'Cet email existe déjà',
                    'code' => 409
                ];
            }

            // Créer le nouvel utilisateur
            $query = "INSERT INTO users (email, password, firstName, lastName, role, createdAt) VALUES (:email, :password, :firstName, :lastName, :role, NOW())";
            $stmt = $this->connection->prepare($query);
            
            $stmt->bindParam(':email', $data->email);
            $stmt->bindParam(':password', $data->password);
            $stmt->bindParam(':firstName', $data->firstName);
            $stmt->bindParam(':lastName', $data->lastName);
            $role = 'client';
            $stmt->bindParam(':role', $role);

            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Inscription réussie',
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

    // Déconnexion
    public function logout() {
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_destroy();
        }
        return [
            'success' => true,
            'message' => 'Déconnecté',
            'code' => 200
        ];
    }
}
?>
