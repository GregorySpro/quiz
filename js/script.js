let timer;
let timeLeft = 30;
let score = 0; // Pour garder une trace du score
let totalTime = 0; // Pour calculer le temps total de réponse
let questionCount = 0; // Compteur de questions posées
let askedQuestions = []; // Tableau pour stocker les IDs des questions posées
const totalQuestions = 25; // Nombre total de questions

function startTimer() {
    timeLeft = 30; // Réinitialiser le temps à chaque nouvelle question
    document.getElementById('timer').innerHTML = "Temps restant : " + timeLeft + "s"; // Afficher le temps initial
    timer = setInterval(function () {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Temps écoulé !");
            handleChoiceClick(-1); // Appel avec -1 pour indiquer que le temps est écoulé
        } else {
            document.getElementById('timer').innerHTML = "Temps restant : " + timeLeft + "s";
            timeLeft--;
        }
    }, 1000);
}

function fetchQuestion() {
    if (questionCount >= totalQuestions) {
        // Si toutes les questions ont été posées, terminer le quiz
        alert("Quiz terminé ! Votre score final est : " + score + "/" + totalQuestions);
        return; // Sortir de la fonction pour arrêter le quiz
    }

    fetch('../php/index.php')
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur HTTP : " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log("Données reçues :", data);

            if (data.error) {
                console.error("Erreur depuis PHP :", data.error);
                return;
            }

            // Vérifie si la question a déjà été posée
            if (askedQuestions.includes(data.id)) {
                // Re-fetch une nouvelle question
                fetchQuestion();
                return; // Sort de la fonction pour éviter d'afficher une question déjà posée
            }

            // Ajoute l'ID de la question à la liste des questions posées
            askedQuestions.push(data.id);

            // Affiche la question
            document.getElementById('question').innerHTML = data.question;

            // Affiche les choix de réponse
            const choices = document.querySelectorAll('.choice');
            choices[0].innerText = data.choice1;
            choices[1].innerText = data.choice2;
            choices[2].innerText = data.choice3;
            choices[3].innerText = data.choice4;

            // Ajoute des écouteurs d'événements aux choix
            choices.forEach((choice, index) => {
                choice.onclick = function() {
                    handleChoiceClick(index, data.correct);
                };
            });

            // Démarre le timer
            startTimer();
        })
        .catch(error => console.error("Erreur dans le fetch :", error));
}

function handleChoiceClick(selectedIndex, correctIndex) {
    clearInterval(timer); // Arrête le timer lorsque l'utilisateur sélectionne une réponse
    questionCount++; // Incrémente le compteur de questions

    // Vérifiez si la réponse sélectionnée est correcte
    if (selectedIndex === correctIndex) {
        score++; // Incrémente le score
        alert("Correct !");
    } else if (selectedIndex === -1) {
        alert("Temps écoulé !");
    } else {
        alert("Incorrect. La bonne réponse était choix " + (correctIndex + 1)); // Réponse incorrecte
    }

    // Enregistre le temps écoulé pour cette question
    totalTime += (30 - timeLeft); // Temps utilisé pour répondre

    // Afficher le score et le temps moyen après chaque question
    console.log("Score: " + score);
    if (questionCount > 0) {
        let averageTime = totalTime / questionCount;
        console.log("Temps moyen de réponse: " + averageTime.toFixed(2) + "s");
    }

    // Charger une nouvelle question après un délai
    setTimeout(fetchQuestion, 2000); // Attendre 2 secondes avant de charger une nouvelle question
}

// Charger la première question au démarrage
fetchQuestion();
