// draw.js - Disegna il Piatto (Touch & Mouse optimized)

const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = '#d9534f';
let brushSize = 5;

// Impostazioni pennello
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = brushSize;
ctx.strokeStyle = currentColor;

// Gestione colori
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentColor = btn.dataset.color;
        ctx.strokeStyle = currentColor;
        // La gomma (bianca) è leggermente più spessa
        ctx.lineWidth = currentColor === '#fff' ? brushSize * 2 : brushSize;
    });
});

// Pulsante Cancella
document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Calcola coordinate corrette anche su schermi retina/mobile
function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
    };
}

// Inizia a disegnare
function startDrawing(e) {
    isDrawing = true;
    const pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;
    e.preventDefault(); // Previene scroll/zoom
}

// Disegna
function draw(e) {
    if (!isDrawing) return;
    const pos = getPos(e);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    lastX = pos.x;
    lastY = pos.y;
    e.preventDefault();
}

// Ferma disegno
function stopDrawing() {
    isDrawing = false;
}

// Eventi Mouse
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Eventi Touch (Smartphone/Tablet)
canvas.addEventListener('touchstart', startDrawing, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', stopDrawing);