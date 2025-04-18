<?php
session_start();
require 'db.php';

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit();
}

$userId = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

try {
    // Ensure $pdo is initialized
    if (!isset($pdo)) {
        throw new Exception("Database connection not initialized");
    }

    switch ($method) {
        case 'GET':
            $stmt = $pdo->prepare("SELECT * FROM flashcards WHERE user_id = ?");
            $stmt->execute([$userId]);
            $flashcards = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "success" => true,
                "flashcards" => $flashcards
            ]);
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);

            if (empty($input['question']) || empty($input['answer'])) {
                throw new Exception("Question and answer are required");
            }

            $stmt = $pdo->prepare("INSERT INTO flashcards (user_id, question, answer) VALUES (?, ?, ?)");
            $result = $stmt->execute([$userId, $input['question'], $input['answer']]);

            echo json_encode([
                "success" => true,
                "message" => "Flashcard saved successfully",
                "flashcard_id" => $pdo->lastInsertId()
            ]);
            break;

        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);

            if (empty($input['flashcard_id']) || empty($input['question']) || empty($input['answer'])) {
                throw new Exception("Flashcard ID, question, and answer are required");
            }

            $stmt = $pdo->prepare("UPDATE flashcards SET question = ?, answer = ? WHERE id = ? AND user_id = ?");
            $result = $stmt->execute([$input['question'], $input['answer'], $input['flashcard_id'], $userId]);

            if ($result) {
                echo json_encode([
                    "success" => true,
                    "message" => "Flashcard updated successfully"
                ]);
            } else {
                throw new Exception("Failed to update flashcard");
            }
            break;

        case 'DELETE':
            $input = json_decode(file_get_contents('php://input'), true);

            if (empty($input['flashcard_id'])) {
                throw new Exception("Flashcard ID is required");
            }

            $stmt = $pdo->prepare("DELETE FROM flashcards WHERE id = ? AND user_id = ?");
            $result = $stmt->execute([$input['flashcard_id'], $userId]);

            if ($result) {
                echo json_encode([
                    "success" => true,
                    "message" => "Flashcard deleted successfully"
                ]);
            } else {
                throw new Exception("Failed to delete flashcard");
            }
            break;

        default:
            throw new Exception("Invalid request method");
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
