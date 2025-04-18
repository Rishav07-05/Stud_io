<?php
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "loggedIn" => false,
        "message" => "User not logged in"
    ]);
    exit();
}

// Return the logged-in user's details
echo json_encode([
    "loggedIn" => true,
    "user_id" => $_SESSION['user_id'],
    "name" => $_SESSION['user_name']
]);
exit();
