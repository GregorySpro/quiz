<?php
$host = 'localhost';
$db = 'quiz';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $score = $_POST['score'];
    
    $stmt = $pdo->prepare("INSERT INTO scores (score) VALUES (:score)");
    $stmt->execute(['score' => $score]);

    echo "Score sauvegardé avec succès !";
} catch (PDOException $e) {
    echo "Erreur : " .$e->getMessage();
}
?>