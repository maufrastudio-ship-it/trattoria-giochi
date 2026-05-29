// quiz.js - Quiz con Round Finale

const questions = [
    // Round 1: Facile
    { q: "Qual è l'ingrediente principale della Carbonara?", a: ["Panna", "Uova", "Pomodoro"], c: 1, round: 1 },
    { q: "La pizza è originaria di...", a: ["Roma", "Napoli", "Milano"], c: 1, round: 1 },
    { q: "Cosa si mette sulla pasta al pomodoro?", a: ["Cioccolato", "Basilico", "Miele"], c: 1, round: 1 },
    { q: "Di che colore è la mozzarella?", a: ["Rosso", "Verde", "Bianco"], c: 2, round: 1 },
    
    // Round 2: Medio
    { q: "Quale formaggio è tipico della Carbonara?", a: ["Gorgonzola", "Pecorino", "Mozzarella"], c: 1, round: 2 },
    { q: "Il pesto è originario di...", a: ["Sicilia", "Liguria", "Toscana"], c: 1, round: 2 },
    { q: "La pasta 'al dente' significa...", a: ["Dura", "Perfetta", "Molle"], c: 1, round: 2 },
    
    // Round 3: Difficile (bonus)
    { q: "Quale regione produce il Parmigiano Reggiano?", a: ["Emilia", "Lombardia", "Veneto"], c: 0, round: 3 },
    { q: "Il tiramisù contiene...", a: ["Caffè", "Tè", "Cioccolato"], c: 0, round: 3 },
    { q: "Quale erba è nel pesto genovese?", a: ["Prezzemolo", "Basilico", "Rosmarino"], c: 1, round: 3 }
];

let currentQuestion = 0;
let score = 0;
let round = 1;

function loadQuestion() {
    // Filtra domande del round corrente
    const roundQuestions = questions.filter(q => q.round === round);
    const q = roundQuestions[currentQuestion];
    
    if (!q) {
        if (round < 3) {
            round++;
            currentQuestion = 0;
            document.getElementById('round-display').textContent = `Round ${round}`;
            document.getElementById('status').textContent = `🎉 Round ${round-1} completato!`;
            setTimeout(loadQuestion, 800);
            return;
        } else {
            endQuiz();
            return;
        }
    }
    
    document.getElementById('question').textContent = `${currentQuestion + 1}. ${q.q}`;
    
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    
    q.a.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-start';
        btn.style.margin = '8px';
        btn.style.width = '90%';
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(index, q.c);
        answersDiv.appendChild(btn);
    });
    
    document.getElementById('score').textContent = `Punti: ${score}`;
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        score++;
        document.getElementById('score').textContent = `Punti: ${score} ✓`;
    } else {
        document.getElementById('score').textContent = `Punti: ${score} ✗`;
    }
    
    currentQuestion++;
    setTimeout(loadQuestion, 400);
}

function endQuiz() {
    document.getElementById('question').textContent = 'Quiz completato!';
    document.getElementById('answers').innerHTML = '';
    
    let message = score >= 7 ? '🏆 Chef Esperto!' : score >= 4 ? '👍 Bravo!' : '🍝 Riprova!';
    document.getElementById('status').textContent = `${message} Hai fatto ${score}/10`;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    round = 1;
    document.getElementById('round-display').textContent = 'Round 1';
    document.getElementById('status').textContent = '';
    loadQuestion();
}

window.onload = loadQuestion;