<?php
require 'db.php'; // Your DB connection file

header("Content-Type: application/json");

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$message = trim($data['message'] ?? '');

if (!$name || !$email || !$message) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit();
}

// Store the message in a contact_messages table
$stmt = $pdo->prepare("INSERT INTO contact_message (name, email, message) VALUES (?, ?, ?)");
if ($stmt->execute([$name, $email, $message])) {
    echo json_encode(["success" => true, "message" => "Message received!"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to send message."]);
}
