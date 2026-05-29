const buttons = document.querySelectorAll('.simon-btn');
const startBtn = document.getElementById('startBtn');
const statusEl = document.getElementById('simon-status');
const scoreEl = document.getElementById('simon-score');

let sequence = [];
let playerSequence = [];
let level = 0;
let isPlaying = false;
let canClick = false;

const colors = ['red', 'green', 'yellow', 'purple'];

startBtn.addEventListener('click', startGame);

buttons.forEach(btn => {
    btn.addEventListener('click', () => handlePlayerInput(btn.dataset.color));
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); handlePlayerInput(btn.dataset.color); });
});

function startGame() {
    sequence = [];
    playerSequence = [];
    level = 0;
    isPlaying = true;
    startBtn.style.display = 'none';
    nextLevel();
}

function nextLevel() {
    level++;
    playerSequence = [];
    scoreEl.textContent = `Livello: ${level}`;
    statusEl.textContent = 'Osserva la sequenza...';
    canClick = false;
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    playSequence();
}

async function playSequence() {
    for (let i = 0; i < sequence.length; i++) {
        await new Promise(res => setTimeout(res, 600 - (level * 20))); // Velocizza leggermente
        activateButton(sequence[i]);
        await new Promise(res => setTimeout(res, 300));
        deactivateButton(sequence[i]);
    }
    statusEl.textContent = 'Tocca i sapori nell\'ordine!';
    canClick = true;
}

function activateButton(color) {
    const btn = document.querySelector(`.simon-btn[data-color="${color}"]`);
    btn.classList.add('active');
}

function deactivateButton(color) {
    const btn = document.querySelector(`.simon-btn[data-color="${color}"]`);
    btn.classList.remove('active');
}

function handlePlayerInput(color) {
    if (!canClick || !isPlaying) return;
    
    activateButton(color);
    setTimeout(() => deactivateButton(color), 200);
    
    playerSequence.push(color);
    
    const currentStep = playerSequence.length - 1;
    if (playerSequence[currentStep] !== sequence[currentStep]) {
        gameOver();
        return;
    }
    
    if (playerSequence.length === sequence.length) {
        canClick = false;
        statusEl.textContent = 'Perfetto! 🎉';
        setTimeout(nextLevel, 1000);
    }
}

function gameOver() {
    isPlaying = false;
    canClick = false;
    statusEl.textContent = `Game Over! Hai raggiunto il livello ${level}.`;
    startBtn.textContent = '🔄 Riprova';
    startBtn.style.display = 'inline-block';
}