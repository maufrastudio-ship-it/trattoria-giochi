// quiz.js - Quiz di Cucina

const questions = [
    {
        question: "Qual è l'ingrediente principale della Carbonara?",
        answers: ["Panna", "Uova", "Pomodoro", "Piselli"],
        correct: 1
    },
    {
        question: "Quale città ha dato i natali alla Pizza Margherita?",
        answers: ["Roma", "Milano", "Napoli", "Bologna"],
        correct: 2
    },
    {
        question: "Cosa significa 'al dente' per la pasta?",
        answers: ["Cotta poco", "Cotta perfettamente", "Bruciata", "Cruda"],
        correct: 1
    },
    {
        question: "Quale formaggio si usa sulla Pizza Margherita?",
        answers: ["Gorgonzola", "Mozzarella", "Parmigiano", "Pecorino"],
        correct: 1
    },
    {
        question: "Quanto tempo cuoce la pasta in acqua bollente?",
        answers: ["2 minuti", "10-12 minuti", "30 minuti", "1 ora"],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;

function loadQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('question').textContent = 
        `Domanda ${currentQuestion + 1} di ${questions.length}: ${q.question}`;
    
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    
    q.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-start';
        btn.style.margin = '10px';
        btn.style.width = '80%';
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(index);
        answersDiv.appendChild(btn);
    });
    
    document.getElementById('score').textContent = `Punti: ${score}`;
}

function checkAnswer(selectedIndex) {
    const correct = questions[currentQuestion].correct;
    
    if (selectedIndex === correct) {
        score++;
        document.getElementById('score').textContent = `Punti: ${score} ✓`;
    } else {
        document.getElementById('score').textContent = `Punti: ${score} ✗`;
    }
    
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        setTimeout(loadQuestion, 500);
    } else {
        setTimeout(showFinalScore, 500);
    }
}

function showFinalScore() {
    document.getElementById('question').textContent = 'Quiz completato!';
    document.getElementById('answers').innerHTML = '';
    document.getElementById('score').textContent = 
        `Hai fatto ${score} su ${questions.length}! ${score >= 3 ? '🎉 Bravo!' : ' Riprova!'}`;
}

loadQuestion();