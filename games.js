// games.js - Memory con 2 livelli (semplice ma efficace)

const levels = [
    { pairs: 6, emojis: ['🍝','🍷','🍅','🧀','🌿','🍄'], name: "Principiante" },
    { pairs: 8, emojis: ['🍝','🍷','🍅','🧀','🌿','🍄','🍕','🥐'], name: "Esperto" }
];

let currentLevel = 0;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startLevel(levelIndex) {
    const level = levels[levelIndex];
    const board = document.getElementById('game-board');
    if (!board) return;
    
    flippedCards = [];
    matchedPairs = 0;
    
    // Prepara carte
    const selectedEmojis = level.emojis.slice(0, level.pairs);
    cards = [...selectedEmojis, ...selectedEmojis];
    cards = shuffle(cards);
    
    // Render griglia
    board.innerHTML = '';
    board.style.gridTemplateColumns = levelIndex === 0 ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)';
    
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card-memory');
        card.dataset.value = emoji;
        card.textContent = '?';
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });
    
    // UI
    document.getElementById('level-display').textContent = `Livello ${levelIndex + 1}: ${level.name}`;
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('status').textContent = '';
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.classList.add('flipped');
        card.textContent = card.dataset.value;
        flippedCards.push(card);
        if (flippedCards.length === 2) setTimeout(checkMatch, 400);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        const level = levels[currentLevel];
        if (matchedPairs === level.pairs) levelComplete();
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped'); card1.textContent = '?';
            card2.classList.remove('flipped'); card2.textContent = '?';
        }, 500);
    }
    flippedCards = [];
}

function levelComplete() {
    if (currentLevel < levels.length - 1) {
        document.getElementById('next-btn').style.display = 'inline-block';
        document.getElementById('status').textContent = '🎉 Bravo! Prossimo livello?';
    } else {
        document.getElementById('status').textContent = '🏆 Complimenti! Hai completato il Memory!';
    }
}

function nextLevel() {
    currentLevel++;
    startLevel(currentLevel);
}

function restartGame() {
    currentLevel = 0;
    startLevel(0);
    document.getElementById('status').textContent = '';
}

window.onload = () => startLevel(0);