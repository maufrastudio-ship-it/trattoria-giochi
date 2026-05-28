// pacman.js - Pac-Man Pasta (con controlli D-Pad)

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CELL_SIZE = 20;
const COLS = 16;
const ROWS = 16;

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

let player = { x: 1, y: 1, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 } };

let enemies = [
    { x: 7, y: 7, dir: { x: 1, y: 0 }, color: '#d9534f' },
    { x: 8, y: 7, dir: { x: -1, y: 0 }, color: '#c9302c' }
];

let spaghettiCount = 0;
let score = 0;
let gameRunning = true;
let animationId;

function countSpaghetti() {
    spaghettiCount = 0;
    for (let row of map) {
        for (let cell of row) {
            if (cell === 2) spaghettiCount++;
        }
    }
}

function drawMap() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            
            if (map[row][col] === 1) {
                ctx.fillStyle = '#8b5a2b';
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                ctx.strokeStyle = '#6b4423';
                ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
            } else if (map[row][col] === 2) {
                ctx.fillStyle = '#f0e68c';
                ctx.beginPath();
                ctx.arc(x + CELL_SIZE/2, y + CELL_SIZE/2, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawPlayer() {
    const x = player.x * CELL_SIZE + CELL_SIZE/2;
    const y = player.y * CELL_SIZE + CELL_SIZE/2;
    
    ctx.fillStyle = '#c0c0c0';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#a0a0a0';
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i*3, y - 5);
        ctx.lineTo(x + i*3, y - 10);
        ctx.stroke();
    }
}

function drawEnemies() {
    enemies.forEach(enemy => {
        const x = enemy.x * CELL_SIZE + CELL_SIZE/2;
        const y = enemy.y * CELL_SIZE + CELL_SIZE/2;
        
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        
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

function canMove(x, y) {
    return map[y][x] !== 1;
}

function movePlayer() {
    if (player.nextDir.x !== 0 || player.nextDir.y !== 0) {
        const nextX = player.x + player.nextDir.x;
        const nextY = player.y + player.nextDir.y;
        
        if (canMove(nextX, nextY)) {
            player.dir = { ...player.nextDir };
            player.nextDir = { x: 0, y: 0 };
        }
    }
    
    const newX = player.x + player.dir.x;
    const newY = player.y + player.dir.y;
    
    if (canMove(newX, newY)) {
        player.x = newX;
        player.y = newY;
        
        if (map[newY][newX] === 2) {
            map[newY][newX] = 0;
            score += 10;
            spaghettiCount--;
        }
    }
}

function moveEnemies() {
    enemies.forEach(enemy => {
        const directions = [
            { x: 1, y: 0 }, { x: -1, y: 0 },
            { x: 0, y: 1 }, { x: 0, y: -1 }
        ];
        
        const validDirs = directions.filter(dir => {
            const newX = enemy.x + dir.x;
            const newY = enemy.y + dir.y;
            return map[newY][newX] !== 1;
        });
        
        if (validDirs.length > 0) {
            const randomDir = validDirs[Math.floor(Math.random() * validDirs.length)];
            enemy.x += randomDir.x;
            enemy.y += randomDir.y;
        }
        
        if (enemy.x === player.x && enemy.y === player.y) {
            gameOver();
        }
    });
}

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

function gameLoop() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    movePlayer();
    moveEnemies();
    
    drawMap();
    drawPlayer();
    drawEnemies();
    
    document.getElementById('score').textContent = 
        `Punti: ${score} | Spaghetti rimasti: ${spaghettiCount}`;
    
    if (spaghettiCount === 0) {
        victory();
        return;
    }
    
    animationId = requestAnimationFrame(gameLoop);
}

function initGame() {
    if (animationId) cancelAnimationFrame(animationId);
    
    player = { x: 1, y: 1, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 } };
    
    enemies = [
        { x: 7, y: 7, dir: { x: 1, y: 0 }, color: '#d9534f' },
        { x: 8, y: 7, dir: { x: -1, y: 0 }, color: '#c9302c' }
    ];
    
    score = 0;
    gameRunning = true;
    
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
    e.preventDefault();
});

// ==========================================
// CONTROLLI D-PAD VIRTUALE (Pulsanti a schermo)
// ==========================================
document.querySelectorAll('.d-btn').forEach(btn => {
    const dir = btn.dataset.dir;
    
    const handlePress = (e) => {
        e.preventDefault();
        switch(dir) {
            case 'up':    player.nextDir = { x: 0, y: -1 }; break;
            case 'down':  player.nextDir = { x: 0, y: 1 };  break;
            case 'left':  player.nextDir = { x: -1, y: 0 }; break;
            case 'right': player.nextDir = { x: 1, y: 0 };  break;
        }
    };
    
    btn.addEventListener('touchstart', handlePress, { passive: false });
    btn.addEventListener('mousedown', handlePress);
});

// Avvia il gioco
initGame();