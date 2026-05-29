const targets = document.querySelectorAll('.diff-target');
const statusEl = document.getElementById('diff-status');
let foundCount = 0;
const totalDiffs = 5;

targets.forEach(target => {
    const handleClick = () => {
        if (target.classList.contains('found')) return;
        
        target.classList.add('found');
        foundCount++;
        statusEl.textContent = `Trovate: ${foundCount}/${totalDiffs} 🔍`;
        
        if (foundCount === totalDiffs) {
            statusEl.textContent = 'Bravissimo! Hai trovato tutte le differenze! 🎉';
            targets.forEach(t => t.style.cursor = 'default');
        }
    };
    
    target.addEventListener('click', handleClick);
    target.addEventListener('touchstart', (e) => { e.preventDefault(); handleClick(); });
});