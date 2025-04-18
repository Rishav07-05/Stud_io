<?php
session_start();
require 'db.php';

header('Content-Type: application/json');

$userId = $_SESSION['user_id'] ?? 0;

if (!$userId) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT id, task FROM routine WHERE user_id = ?");
    $stmt->execute([$userId]);
    $routines = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'routines' => $routines]);
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $task = $data['task'] ?? '';
    if ($task) {
        $stmt = $pdo->prepare("INSERT INTO routine (user_id, task) VALUES (?, ?)");
        $stmt->execute([$userId, $task]);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No task provided']);
    }
} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? 0;
    $task = $data['task'] ?? '';
    $stmt = $pdo->prepare("UPDATE routine SET task = ? WHERE id = ? AND user_id = ?");
    $stmt->execute([$task, $id, $userId]);
    echo json_encode(['success' => true]);
} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? 0;
    $stmt = $pdo->prepare("DELETE FROM routine WHERE id = ? AND user_id = ?");
    $stmt->execute([$id, $userId]);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}
