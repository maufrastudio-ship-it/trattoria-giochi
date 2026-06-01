// coloring.js - Libro dei Colori con Flood Fill

const canvas = document.getElementById('colorCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const palette = document.querySelectorAll('.color-swatch');

let selectedColor = { r: 217, g: 83, b: 79 }; // Default rosso
let imageLoaded = false;

// Carica l'immagine
const img = new Image();
img.src = 'coloring-bg.png'; // Assicura che il file sia su GitHub con questo nome
img.onload = () => {
    // Adatta il canvas alla proporzione dell'immagine
    const aspectRatio = img.width / img.height;
    canvas.width = 800;
    canvas.height = 800 / aspectRatio;
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    imageLoaded = true;
};

// Gestione Palette
palette.forEach(swatch => {
    swatch.addEventListener('click', () => {
        palette.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        
        const rgb = swatch.dataset.color.split(',');
        selectedColor = {
            r: parseInt(rgb[0]),
            g: parseInt(rgb[1]),
            b: parseInt(rgb[2])
        };
    });
});

// Gestione Click/Tap sul Canvas
function handleColoring(e) {
    if (!imageLoaded) return;

    e.preventDefault();
    
    // Coordinate touch o mouse
    let clientX, clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    // Calcolo coordinate relative al canvas reale (non CSS)
    const x = Math.floor((clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((clientY - rect.top) * (canvas.height / rect.height));

    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
        floodFill(x, y, selectedColor);
    }
}

canvas.addEventListener('mousedown', handleColoring);
canvas.addEventListener('touchstart', handleColoring, { passive: false });

// Algoritmo Flood Fill (Secchiello)
function floodFill(startX, startY, fillColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Colore del pixel cliccato
    const startIdx = (startY * width + startX) * 4;
    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];

    // Se il colore è simile a quello di riempimento, non fare nulla
    if (startR === fillColor.r && startG === fillColor.g && startB === fillColor.b) return;

    // Tolleranza per i bordi sfumati (anti-aliasing)
    const tolerance = 40; 

    // Stack per evitare ricorsione infinita
    const stack = [[startX, startY]];

    while (stack.length) {
        const [x, y] = stack.pop();
        const idx = (y * width + x) * 4;

        // Controllo se il pixel corrente è simile al colore iniziale
        if (
            Math.abs(data[idx] - startR) <= tolerance &&
            Math.abs(data[idx + 1] - startG) <= tolerance &&
            Math.abs(data[idx + 2] - startB) <= tolerance
        ) {
            // Colora il pixel
            data[idx] = fillColor.r;
            data[idx + 1] = fillColor.g;
            data[idx + 2] = fillColor.b;
            data[idx + 3] = 255; // Alpha

            // Aggiungi vicini
            if (x > 0) stack.push([x - 1, y]);
            if (x < width - 1) stack.push([x + 1, y]);
            if (y > 0) stack.push([x, y - 1]);
            if (y < height - 1) stack.push([x, y + 1]);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function resetCanvas() {
    if(imageLoaded) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}