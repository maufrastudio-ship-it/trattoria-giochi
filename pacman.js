const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensioni cella
const CELL_SIZE = 20;
const COLS = 16;
const ROWS = 16;

// Mappa del gioco (0=vuoto, 1=muro, 2=spaghetti, 3=pomodoro)
const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,1,1,1,2,1,1,2,1],
    [1,2,1,1,2,1,1,1,1,1,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,2,1,1,1,0,1,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,0,0,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,2,2,1,1,2,1,1,2,1],
    [1,2,2,1,2,2,2,2,2,2,2,2,1,2,2,1],
    [1,1,2,1,2,1,2,1,1,2,1,2,1,2,1,1],
    [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Giocatore (forchetta)
let player = { x: 1, y: 1, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 } };

// Nemici (pomodori)
let enemies = [
    { x: 7, y: 7, dir: { x: 1, y: 0 }, color: '#d9534f' },
    { x: 8, y: 7, dir: { x: -1, y: 0 }, color: '#c9302c' }
];

let spaghettiCount = 0;
let score = 0;
let gameRunning = true;
let animationId;

// Conta gli spaghetti
function countSpaghetti() {
    spaghettiCount = 0;
    for (let row of map) {
        for (let cell of row) {
            if (cell === 2) spaghettiCount++;
        }
    }
}

// Disegna la mappa
function drawMap() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            
            if (map[row][col] === 1) {
                // Muro (legno)
                ctx.fillStyle = '#8b5a2b';
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                ctx.strokeStyle = '#6b4423';
                ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
            } else if (map[row][col] === 2) {
                // Spaghetti (gialli)
                ctx.fillStyle = '#f0e68c';
                ctx.beginPath();
                ctx.arc(x + CELL_SIZE/2, y + CELL_SIZE/2, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// Disegna il giocatore (forchetta)
function drawPlayer() {
    const x = player.x * CELL_SIZE + CELL_SIZE/2;
    const y = player.y * CELL_SIZE + CELL_SIZE/2;
    
    ctx.fillStyle = '#c0c0c0'; // Argento
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Rebbi della forchetta
    ctx.strokeStyle = '#a0a0a0';
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i*3, y - 5);
        ctx.lineTo(x + i*3, y - 10);
        ctx.stroke();
    }
}

// Disegna i nemici (pomodori)
function drawEnemies() {
    enemies.forEach(enemy => {
        const x = enemy.x * CELL_SIZE + CELL_SIZE/2;
        const y = enemy.y * CELL_SIZE + CELL_SIZE/2;
        
        // Pomodoro
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Faccina arrabbiata
        ctx.fillStyle = 'white';
        ctx.fillRect(x - 4, y - 2, 2, 2);
        ctx.fillRect(x + 2, y - 2, 2, 2);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 3, y + 3);
        ctx.lineTo(x + 3, y + 3);
        ctx.stroke();
    });
}

// Muovi il giocatore
function movePlayer() {
    // Prova a cambiare direzione
    const nextX = player.x + player.nextDir.x;
    const nextY = player.y + player.nextDir.y;
    
    if (map[nextY][nextX] !== 1) {
        player.dir = { ...player.nextDir };
    }
    
    // Muovi nella direzione corrente
    const newX = player.x + player.dir.x;
    const newY = player.y + player.dir.y;
    
    if (map[newY][newX] !== 1) {
        player.x = newX;
        player.y = newY;
        
        // Mangia spaghetti
        if (map[newY][newX] === 2) {
            map[newY][newX] = 0;
            score += 10;
            spaghettiCount--;
        }
    }
}

// Muovi i nemici (AI semplice)
function moveEnemies() {
    enemies.forEach(enemy => {
        const directions = [
            { x: 1, y: 0 }, { x: -1, y: 0 },
            { x: 0, y: 1 }, { x: 0, y: -1 }
        ];
        
        // Filtra direzioni valide
        const validDirs = directions.filter(dir => {
            const newX = enemy.x + dir.x;
            const newY = enemy.y + dir.y;
            return map[newY][newX] !== 1;
        });
        
        // Scegli direzione casuale valida
        if (validDirs.length > 0) {
            const randomDir = validDirs[Math.floor(Math.random() * validDirs.length)];
            enemy.x += randomDir.x;
            enemy.y += randomDir.y;
        }
        
        // Controlla collisione con giocatore
        if (enemy.x === player.x && enemy.y === player.y) {
            gameOver();
        }
    });
}

// Game Over
function gameOver() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#f0e68c';
    ctx.font = 'bold 24px Playfair Display';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', canvas.width/2, canvas.height/2 - 20);
    
    ctx.font = '16px Lato';
    ctx.fillText(`Punti: ${score}`, canvas.width/2, canvas.height/2 + 20);
    ctx.fillText('Tocca per ricominciare', canvas.width/2, canvas.height/2 + 50);
    
    canvas.addEventListener('click', initGame, { once: true });
}

// Vittoria
function victory() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#f0e68c';
    ctx.font = 'bold 24px Playfair Display';
    ctx.textAlign = 'center';
    ctx.fillText('BRAVO! 🎉', canvas.width/2, canvas.height/2 - 20);
    
    ctx.font = '16px Lato';
    ctx.fillText(`Punti: ${score}`, canvas.width/2, canvas.height/2 + 20);
    ctx.fillText('Hai mangiato tutti gli spaghetti!', canvas.width/2, canvas.height/2 + 50);
    
    canvas.addEventListener('click', initGame, { once: true });
}

// Loop principale
function gameLoop() {
    if (!gameRunning) return;
    
    // Pulisci canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Aggiorna
    movePlayer();
    moveEnemies();
    
    // Disegna
    drawMap();
    drawPlayer();
    drawEnemies();
    
    // Aggiorna punteggio
    document.getElementById('score').textContent = 
        `Punti: ${score} | Spaghetti rimasti: ${spaghettiCount}`;
    
    // Controlla vittoria
    if (spaghettiCount === 0) {
        victory();
        return;
    }
    
    animationId = requestAnimationFrame(gameLoop);
}

// Inizializza gioco
function initGame() {
    if (animationId) cancelAnimationFrame(animationId);
    
    // Reset player
    player = { x: 1, y: 1, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 } };
    
    // Reset nemici
    enemies = [
        { x: 7, y: 7, dir: { x: 1, y: 0 }, color: '#d9534f' },
        { x: 8, y: 7, dir: { x: -1, y: 0 }, color: '#c9302c' }
    ];
    
    // Reset punteggio
    score = 0;
    gameRunning = true;
    
    // Ricarica mappa (resetta spaghetti mangiati)
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (map[row][col] === 0 && !(row === 7 && col === 8) && !(row === 8 && col === 8)) {
                map[row][col] = 2;
            }
        }
    }
    
    countSpaghetti();
    gameLoop();
}

// Controlli tastiera
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp': player.nextDir = { x: 0, y: -1 }; break;
        case 'ArrowDown': player.nextDir = { x: 0, y: 1 }; break;
        case 'ArrowLeft': player.nextDir = { x: -1, y: 0 }; break;
        case 'ArrowRight': player.nextDir = { x: 1, y: 0 }; break;
    }
});

// Controlli touch (swipe)
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        // Orizzontale
        player.nextDir = { x: dx > 0 ? 1 : -1, y: 0 };
    } else {
        // Verticale
        player.nextDir = { x: 0, y: dy > 0 ? 1 : -1 };
    }
    
    touchStartX = 0;
    touchStartY = 0;
    e.preventDefault();
}, { passive: false });

// Avvia il gioco
initGame();