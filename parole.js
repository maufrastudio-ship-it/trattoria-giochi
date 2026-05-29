const words = ['PASTA', 'PIZZA', 'NONNA', 'FORNO', 'PANE', 'VINO'];
const gridSize = 6;
let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
let selectedCells = [];
let foundWords = [];

// Posizioni fisse per affidabilità mobile
const positions = {
    'PASTA': [{r:0,c:0},{r:0,c:1},{r:0,c:2},{r:0,c:3},{r:0,c:4}],
    'PIZZA': [{r:1,c:0},{r:1,c:1},{r:1,c:2},{r:1,c:3},{r:1,c:4}],
    'NONNA': [{r:2,c:0},{r:2,c:1},{r:2,c:2},{r:2,c:3},{r:2,c:4}],
    'FORNO': [{r:3,c:0},{r:3,c:1},{r:3,c:2},{r:3,c:3},{r:3,c:4}],
    'PANE':  [{r:4,c:0},{r:4,c:1},{r:4,c:2},{r:4,c:3}],
    'VINO':  [{r:5,c:0},{r:5,c:1},{r:5,c:2},{r:5,c:3}]
};

function init() {
    // Riempie griglia con lettere casuali
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for(let r=0; r<gridSize; r++) {
        for(let c=0; c<gridSize; c++) {
            grid[r][c] = letters[Math.floor(Math.random()*letters.length)];
        }
    }
    // Inserisce parole
    for(let word in positions) {
        positions[word].forEach((pos, i) => grid[pos.r][pos.c] = word[i]);
    }

    // Render lista parole
    const listEl = document.getElementById('wordList');
    words.forEach(w => {
        const span = document.createElement('span');
        span.className = 'word-item';
        span.textContent = w;
        span.dataset.word = w;
        listEl.appendChild(span);
    });

    // Render griglia
    const gridEl = document.getElementById('grid');
    for(let r=0; r<gridSize; r++) {
        for(let c=0; c<gridSize; c++) {
            const cell = document.createElement('div');
            cell.className = 'word-cell';
            cell.textContent = grid[r][c];
            cell.dataset.r = r; cell.dataset.c = c;
            cell.addEventListener('click', () => handleCellClick(cell, r, c));
            gridEl.appendChild(cell);
        }
    }
}

function handleCellClick(cell, r, c) {
    if(cell.classList.contains('found')) return;
    
    if(selectedCells.length === 0) {
        selectedCells.push({r, c, el: cell});
        cell.classList.add('selected');
    } else {
        const start = selectedCells[0];
        // Verifica se è una linea retta
        const dr = Math.sign(r - start.r);
        const dc = Math.sign(c - start.c);
        if(dr !== 0 || dc !== 0) {
            let currentR = start.r, currentC = start.c;
            let wordStr = '';
            let pathCells = [];
            
            while(currentR !== r || currentC !== c) {
                pathCells.push({r: currentR, c: currentC});
                wordStr += grid[currentR][currentC];
                currentR += dr; currentC += dc;
            }
            pathCells.push({r, c});
            wordStr += grid[r][c];

            const reversed = wordStr.split('').reverse().join('');
            if(words.includes(wordStr) || words.includes(reversed)) {
                const foundWord = words.includes(wordStr) ? wordStr : reversed;
                if(!foundWords.includes(foundWord)) {
                    foundWords.push(foundWord);
                    pathCells.forEach(p => {
                        const el = document.querySelector(`.word-cell[data-r="${p.r}"][data-c="${p.c}"]`);
                        el.classList.remove('selected');
                        el.classList.add('found');
                    });
                    document.querySelector(`.word-item[data-word="${foundWord}"]`).classList.add('found');
                    document.getElementById('status').textContent = `Trovato: ${foundWord}! `;
                }
            } else {
                document.getElementById('status').textContent = 'Non è una parola della lista. Riprova!';
            }
        }
        selectedCells.forEach(c => c.el.classList.remove('selected'));
        selectedCells = [];
    }
}

window.onload = init;