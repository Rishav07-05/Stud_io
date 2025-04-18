<?php
$host = 'localhost';
$db   = 'study_room'; // your actual database name
$user = 'root';       // default user in XAMPP
$pass = '';           // default password is empty in XAMPP
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "DB connection failed: " . $e->getMessage()]);
    exit();
}
