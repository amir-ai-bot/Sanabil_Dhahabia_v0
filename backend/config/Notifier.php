<?php
require_once __DIR__ . '/Database.php';

class Notifier {
    // default admin user id for system notifications
    public static $adminUserId = 1;

    public static function createNotification($userId, $title, $message, $relatedOrderId = null, $relatedProductId = null) {
        $db = new Database();
        $conn = $db->connect();

        if (!$conn) return false;

        try {
            $query = "INSERT INTO notifications (userId, title, message, relatedOrderId, relatedProductId, createdAt) VALUES (:userId, :title, :message, :relatedOrderId, :relatedProductId, NOW())";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':message', $message);
            $stmt->bindParam(':relatedOrderId', $relatedOrderId);
            $stmt->bindParam(':relatedProductId', $relatedProductId);
            $stmt->execute();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public static function createAuditLog($userId, $action, $entityType = null, $entityId = null, $oldValue = null, $newValue = null, $ipAddress = null) {
        $db = new Database();
        $conn = $db->connect();

        if (!$conn) return false;

        try {
            $query = "INSERT INTO audit_logs (userId, action, entityType, entityId, oldValue, newValue, ipAddress, createdAt) VALUES (:userId, :action, :entityType, :entityId, :oldValue, :newValue, :ipAddress, NOW())";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->bindParam(':action', $action);
            $stmt->bindParam(':entityType', $entityType);
            $stmt->bindParam(':entityId', $entityId);
            $oldJson = $oldValue ? json_encode($oldValue) : null;
            $newJson = $newValue ? json_encode($newValue) : null;
            $stmt->bindParam(':oldValue', $oldJson);
            $stmt->bindParam(':newValue', $newJson);
            $stmt->bindParam(':ipAddress', $ipAddress);
            $stmt->execute();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}
?>
