<?php
require_once 'config.php';
require_once 'classes.php';
require_once 'auth.php';

try {
    $db = new Database();
    $auth = new Auth($db);

    $stats = $db->getStats();
    echo json_encode($stats, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>