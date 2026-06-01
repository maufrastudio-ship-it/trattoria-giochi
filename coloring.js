// coloring.js - Versione migliorata che blocca lo sfondo

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

// Gestione click/touch
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

    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
        // Ottieni il colore del pixel cliccato
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        
        // BLOCCA SFONDO BIANCO: se è troppo chiaro, non colorare
        if (pixel[0] > 240 && pixel[1] > 240 && pixel[2] > 240) {
            return; // È sfondo bianco, ignora
        }
        
        // BLOCCA LINEE NERE: se è troppo scuro, non colorare
        if (pixel[0] < 50 && pixel[1] < 50 && pixel[2] < 50) {
            return; // È linea del disegno, ignora
        }
        
        floodFill(x, y, selectedColor);
    }
}

canvas.addEventListener('mousedown', handleColoring);
canvas.addEventListener('touchstart', handleColoring, { passive: false });

// Flood Fill migliorato
function floodFill(startX, startY, fillColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const startIdx = (startY * width + startX) * 4;
    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];

    // Non colorare se è già quel colore
    if (startR === fillColor.r && startG === fillColor.g && startB === fillColor.b) return;
    
    // Non colorare se è bianco o nero
    if (startR > 240 || startR < 50) return;

    const tolerance = 60; // Tolleranza più alta per aree sfumate
    const stack = [[startX, startY]];
    let pixelsFilled = 0;
    const maxPixels = width * height * 0.3; // Limita a 30% del canvas

    while (stack.length && pixelsFilled < maxPixels) {
        const [x, y] = stack.pop();
        const idx = (y * width + x) * 4;

        if (
            Math.abs(data[idx] - startR) <= tolerance &&
            Math.abs(data[idx + 1] - startG) <= tolerance &&
            Math.abs(data[idx + 2] - startB) <= tolerance &&
            data[idx] > 50 && // Non superare linee nere
            data[idx] < 240   // Non colorare sfondo bianco
        ) {
            data[idx] = fillColor.r;
            data[idx + 1] = fillColor.g;
            data[idx + 2] = fillColor.b;
            data[idx + 3] = 255;
            pixelsFilled++;

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