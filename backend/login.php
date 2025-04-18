<?php
session_start();
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    error_log("Email or password not provided.");
    echo json_encode(["success" => false, "message" => "Email and password are required."]);
    exit();
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    error_log("User authenticated successfully. User ID: " . $user['id']);
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];

    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "user_id" => $user['id'],
        "name" => $user['name']
    ]);
} else {
    error_log("Invalid login attempt for email: " . $email);
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
}
