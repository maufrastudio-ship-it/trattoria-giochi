// coloring.js - Versione SEMPLIFICATA che funziona

const canvas = document.getElementById('colorCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const palette = document.querySelectorAll('.color-swatch');

let selectedColor = { r: 217, g: 83, b: 79 };
let imageLoaded = false;

// Carica immagine
const img = new Image();
img.crossOrigin = "Anonymous";
img.src = 'coloring-bg.png';

img.onload = () => {
    const aspectRatio = img.width / img.height;
    canvas.width = 800;
    canvas.height = 800 / aspectRatio;
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    imageLoaded = true;
};

// Selezione colore
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

// Gestione click
function handleColoring(e) {
    if (!imageLoaded) return;
    e.preventDefault();
    
    let clientX, clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((clientY - rect.top) * (canvas.height / rect.height));

    floodFill(x, y, selectedColor);
}

canvas.addEventListener('mousedown', handleColoring);
canvas.addEventListener('touchstart', handleColoring, { passive: false });

// Flood Fill SEMPLIFICATO
function floodFill(startX, startY, fillColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const startIdx = (startY * width + startX) * 4;
    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];

    // Non fare nulla se il colore è già quello selezionato
    if (Math.abs(startR - fillColor.r) < 10 && 
        Math.abs(startG - fillColor.g) < 10 && 
        Math.abs(startB - fillColor.b) < 10) {
        return;
    }

    // Non colorare le linee nere del disegno
    if (startR < 80 && startG < 80 && startB < 80) {
        return;
    }

    const stack = [[startX, startY]];
    const targetColor = { r: startR, g: startG, b: startB };
    const tolerance = 50;

    while (stack.length) {
        const [x, y] = stack.pop();
        const idx = (y * width + x) * 4;

        const currentR = data[idx];
        const currentG = data[idx + 1];
        const currentB = data[idx + 2];

        // Controlla se il pixel è simile al colore target
        const isSimilar = 
            Math.abs(currentR - targetColor.r) <= tolerance &&
            Math.abs(currentG - targetColor.g) <= tolerance &&
            Math.abs(currentB - targetColor.b) <= tolerance;

        // Non colorare linee nere
        const isBlackLine = currentR < 80 && currentG < 80 && currentB < 80;

        if (isSimilar && !isBlackLine) {
            data[idx] = fillColor.r;
            data[idx + 1] = fillColor.g;
            data[idx + 2] = fillColor.b;
            data[idx + 3] = 255;

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