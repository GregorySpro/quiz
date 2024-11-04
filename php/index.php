<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');




    header('Content-Type: application/json');

    $host = 'localhost';
    $db = 'quiz';
    $user = 'root';
    $pass = '';

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo->query("SELECT * FROM questions ORDER BY RAND() LIMIT 1");
        $question = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode($question);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
?>
