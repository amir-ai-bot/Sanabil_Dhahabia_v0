<?php
// Configuration de la base de données
class Database {
    private $host = 'localhost';
    private $db_name = 'sanabel_dhahabia';
    private $user = 'root';
    private $password = '';
    private $connection;

    public function connect() {
        try {
            $this->connection = new PDO(
                'mysql:host=' . $this->host . ';dbname=' . $this->db_name . ';charset=utf8mb4',
                $this->user,
                $this->password
            );
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->exec("SET NAMES utf8mb4");
            return $this->connection;
        } catch (PDOException $e) {
            echo 'Erreur de connexion: ' . $e->getMessage();
            return null;
        }
    }
}
?>
