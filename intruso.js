// intruso.js - Cerca l'Intruso con 5 Livelli di difficoltà

const levels = [
    { id: 1, grid: 16, base: '🍕', intruder: '🥧', name: "Pizza vs Torta", time: null },
    { id: 2, grid: 25, base: '🍝', intruder: '🍜', name: "Spaghetti vs Ramen", time: null },
    { id: 3, grid: 36, base: '🍷', intruder: '🍺', name: "Vino vs Birra", time: 30 },
    { id: 4, grid: 49, base: '🍅', intruder: '🍎', name: "Pomodoro vs Mela", time: 25 },
    { id: 5, grid: 64, base: '🧀', intruder: '🧈', name: "Formaggio vs Burro", time: 20 }
];

let currentLevelIndex = 0;
let gridEl = document.getElementById('game-grid');
let timer = null;
let found = false;

function startLevel(index) {
    const level = levels[index];
    found = false;
    
    document.getElementById('level-display').textContent = `Livello ${level.id}: ${level.name}`;
    document.getElementById('instruction').textContent = `Trova il diverso tra ${level.grid} emoji!`;
    document.getElementById('status').textContent = '';
    gridEl.innerHTML = '';
    
    // Setup griglia CSS
    const cols = Math.sqrt(level.grid);
    gridEl.className = 'intruso-grid';
    gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    // Crea array con base e intruso
    let items = Array(level.grid).fill(level.base);
    const intruderPos = Math.floor(Math.random() * level.grid);
    items[intruderPos] = level.intruder;
    
    // Shuffle per rendere più difficile
    items = items.sort(() => Math.random() - 0.5);
    
    // Render
    items.forEach((emoji, i) => {
        const cell = document.createElement('div');
        cell.className = 'intruso-cell';
        cell.textContent = emoji;
        cell.dataset.isIntruder = (i === items.indexOf(level.intruder) && emoji === level.intruder) ? 'true' : 'false';
        
        cell.addEventListener('click', () => {
            if (found) return; // Già trovato
            
            if (cell.dataset.isIntruder === 'true') {
                // TROVATO!
                found = true;
                cell.classList.add('found');
                levelComplete();
            } else {
                // Errore - feedback visivo
                cell.style.backgroundColor = '#ffeaa7';
                setTimeout(() => {
                    if (!found) cell.style.backgroundColor = '#fff8e1';
                }, 300);
            }
        });
        gridEl.appendChild(cell);
    });
    
    // Timer per livelli difficili
    if (level.time) {
        let timeLeft = level.time;
        const timerEl = document.getElementById('timer-display');
        timerEl.textContent = `⏱️ ${timeLeft}s`;
        timerEl.style.display = 'inline';
        timerEl.className = 'timer-display';
        
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerEl.textContent = `⏱️ ${timeLeft}s`;
            if (timeLeft <= 5) {
                timerEl.classList.add('warning');
            }
            if (timeLeft <= 0) {
                clearInterval(timer);
                if (!found) {
                    document.getElementById('status').textContent = '⏰ Tempo scaduto! Riprova.';
                    gridEl.style.pointerEvents = 'none';
                }
            }
        }, 1000);
    } else {
        document.getElementById('timer-display').style.display = 'none';
    }
}

function levelComplete() {
    clearInterval(timer);
    if (currentLevelIndex < levels.length - 1) {
        document.getElementById('status').textContent = '🎉 Bravo! Prossimo livello...';
        setTimeout(() => {
            currentLevelIndex++;
            startLevel(currentLevelIndex);
        }, 1200);
    } else {
        document.getElementById('status').textContent = '🏆 Complimenti! Hai la vista della Nonna!';
        showCompletionModal();
    }
}

function showCompletionModal() {
    const modal = document.createElement('div');
    modal.className = 'completion-modal';
    modal.innerHTML = `
        <div class="completion-content">
            <div class="trophy">🧐</div>
            <h3>Occhio di Lince!</h3>
            <p>Hai trovato tutti gli intrusi!</p>
            <button class="btn-start" onclick="this.closest('.completion-modal').remove(); location.href='index.html'">🏠 Menu</button>
            <button class="btn-start" onclick="this.closest('.completion-modal').remove(); currentLevelIndex=0; startLevel(0);">🔄 Rigioca</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// Avvio
window.onload = () => startLevel(0);