<?php
session_start();
require 'db.php';

$userId = $_SESSION['user_id'] ?? 0;
if (!$userId) {
    die(json_encode(["success" => false]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $note = htmlspecialchars($data['note'] ?? '', ENT_QUOTES, 'UTF-8');
    if ($note) {
        $stmt = $pdo->prepare("INSERT INTO notes (user_id, content) VALUES (?, ?)");
        $stmt->execute([$userId, $note]);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $noteId = $data['noteId'] ?? 0;
    $newContent = htmlspecialchars($data['newContent'] ?? '', ENT_QUOTES, 'UTF-8');
    if ($noteId && $newContent) {
        $stmt = $pdo->prepare("UPDATE notes SET content = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$newContent, $noteId, $userId]);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $noteId = $data['noteId'] ?? 0;
    if ($noteId) {
        $stmt = $pdo->prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
        $stmt->execute([$noteId, $userId]);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
} else {
    $stmt = $pdo->prepare("SELECT id, content FROM notes WHERE user_id = ? ORDER BY id DESC");
    $stmt->execute([$userId]);
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["notes" => $notes]);
}
