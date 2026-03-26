<?php
require_once __DIR__ . '/../config/Database.php';

// Server-Sent Events endpoint to stream notifications in real-time
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

set_time_limit(0);

$db = new Database();
$conn = $db->connect();

if (!$conn) {
    http_response_code(500);
    echo "event: error\n";
    echo "data: {\"message\": \"Unable to connect to database\"}\n\n";
    flush();
    exit;
}

$lastId = isset($_GET['lastId']) ? (int)$_GET['lastId'] : 0;

while (true) {
    // check for client disconnect
    if (connection_aborted()) break;

    $query = "SELECT * FROM notifications WHERE id > :lastId ORDER BY id ASC LIMIT 10";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':lastId', $lastId, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as $row) {
        $lastId = (int)$row['id'];
        $data = json_encode($row);
        echo "id: {$row['id']}\n";
        echo "data: {$data}\n\n";
        @ob_flush();
        @flush();
    }

    // heartbeat to keep connection alive
    echo ": heartbeat\n\n";
    @ob_flush();
    @flush();

    sleep(2);
}

?>
