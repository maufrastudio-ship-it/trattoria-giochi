// Array di "immagini" (usiamo emoji per non dover caricare file pesanti)
const emojis = ['', '🍝', '🍷', '🍅', '🧀', '🌿'];
const cards = [...emojis, ...emojis]; // Doppio per fare le coppie
let flippedCards = [];
let matchedPairs = 0;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function initGame() {
    const board = document.getElementById('game-board');
    if (!board) return; // Se non siamo nella pagina memory, esci

    board.innerHTML = '';
    const shuffledCards = shuffle(cards);

    shuffledCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card-memory');
        card.dataset.value = emoji;
        card.dataset.index = index;
        card.textContent = '?'; // Retro della carta
        
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        card.textContent = card.dataset.value; // Mostra l'emoji
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
        // Match trovato!
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === emojis.length) {
            setTimeout(() => alert("Bravo! Hai trovato tutte le coppie! "), 500);
        }
    } else {
        // Nessun match, rigira dopo un attimo
        setTimeout(() => {
            card1.classList.remove('flipped');
            card1.textContent = '?';
            card2.classList.remove('flipped');
            card2.textContent = '?';
            flippedCards = [];
        }, 1000);
    }
}

// Avvia il gioco se siamo nella pagina giusta
window.onload = initGame;