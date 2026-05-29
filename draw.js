// draw.js - Disegna il Piatto con Template Sbloccabili

const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');

// Template disponibili
const templates = [
    { id: 1, name: "Pizza", emoji: "🍕", unlocked: true },
    { id: 2, name: "Pasta", emoji: "🍝", unlocked: false }
];

let isDrawing = false;
let lastX = 0, lastY = 0;
let currentColor = '#d9534f';
let brushSize = 5;
let currentTemplate = 1;

// Carica template completati dal localStorage
let completedTemplates = JSON.parse(localStorage.getItem('drawCompleted')) || [];

// Sblocca template in base ai completamenti
function updateUnlocked() {
    if (completedTemplates.includes(1)) {
        templates[1].unlocked = true;
    }
    renderTemplateSelector();
}

// Disegna la guida del template sul canvas
function drawTemplateGuide(templateId) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e0d0b0';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    if (templateId === 1) {
        // Guida Pizza: cerchio + spicchi
        ctx.beginPath();
        ctx.arc(170, 170, 100, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(170, 170);
            ctx.lineTo(170 + Math.cos(i * Math.PI/3) * 100, 170 + Math.sin(i * Math.PI/3) * 100);
            ctx.stroke();
        }
        // Testo guida
        ctx.setLineDash([]);
        ctx.fillStyle = '#8b5a2b';
        ctx.font = '14px Lato';
        ctx.fillText('Colora la pizza!', 120, 30);
        
    } else if (templateId === 2) {
        // Guida Pasta: piatto ovale + onde spaghetti
        ctx.beginPath();
        ctx.ellipse(170, 200, 120, 60, 0, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(100 + i*25, 180);
            ctx.bezierCurveTo(120 + i*25, 150, 140 + i*25, 210, 160 + i*25, 180);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.fillStyle = '#8b5a2b';
        ctx.font = '14px Lato';
        ctx.fillText('Colora la pasta!', 120, 30);
    }
    
    ctx.setLineDash([]);
}

// Renderizza i pulsanti dei template
function renderTemplateSelector() {
    const container = document.getElementById('template-selector');
    if (!container) return;
    
    container.innerHTML = '';
    
    templates.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'template-btn';
        if (!t.unlocked) btn.classList.add('locked');
        if (currentTemplate === t.id) btn.classList.add('active');
        
        btn.innerHTML = t.emoji + (t.unlocked ? '' : ' 🔒');
        btn.title = t.unlocked ? `Template: ${t.name}` : `Sblocca completando la Pizza!`;
        
        btn.onclick = () => {
            if (t.unlocked) {
                currentTemplate = t.id;
                document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                drawTemplateGuide(t.id);
                document.getElementById('status').textContent = `Stai disegnando: ${t.name} ${t.emoji}`;
            }
        };
        
        container.appendChild(btn);
    });
}

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
        ctx.lineWidth = currentColor === '#fff' ? brushSize * 2 : brushSize;
    });
});

// Pulsante Cancella
document.getElementById('clearBtn').addEventListener('click', () => {
    drawTemplateGuide(currentTemplate);
});

// Pulsante "Template Completato"
document.getElementById('completeBtn')?.addEventListener('click', () => {
    if (!completedTemplates.includes(currentTemplate)) {
        completedTemplates.push(currentTemplate);
        localStorage.setItem('drawCompleted', JSON.stringify(completedTemplates));
        updateUnlocked();
        
        const current = templates.find(t => t.id === currentTemplate);
        const next = templates.find(t => t.id === currentTemplate + 1);
        
        if (next && next.unlocked) {
            document.getElementById('status').textContent = `🎉 ${current.name} completata! Sbloccato: ${next.name} ${next.emoji}`;
        } else if (next) {
            document.getElementById('status').textContent = `🎉 ${current.name} completata! Continua a disegnare per sbloccare ${next.name}!`;
        } else {
            document.getElementById('status').textContent = '🏆 Hai completato tutti i template! Bravissimo!';
        }
    }
});

// Calcola coordinate corrette per touch/mouse
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
    e.preventDefault();
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

// Eventi Touch
canvas.addEventListener('touchstart', startDrawing, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', stopDrawing);

// Inizializzazione
window.onload = () => {
    updateUnlocked();
    drawTemplateGuide(1);
    document.getElementById('status').textContent = 'Colora la Pizza! 🍕';
};