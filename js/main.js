/**
 * Star Sea - Main Entry Point
 * Initialize and start the game
 */

// Load weapon JSON files automatically
async function loadWeaponJSONFiles() {
    const factions = ['FEDERATION', 'TRIGON', 'SCINTILIAN'];
    const shipClasses = ['DD', 'CL', 'CA', 'BC', 'BB'];
    const loaded = [];
    
    for (const faction of factions) {
        for (const shipClass of shipClasses) {
            const filename = `${faction}_${shipClass}_weapons.json`;
            try {
                const response = await fetch(filename);
                if (response.ok) {
                    const data = await response.json();
                    if (window.loadCustomWeaponLoadout) {
                        window.loadCustomWeaponLoadout(data);
                        loaded.push(filename);
                    }
                }
            } catch (error) {
                // File doesn't exist - this is expected for some combinations
            }
        }
    }
    
    if (loaded.length > 0) {
        console.log(`Loaded ${loaded.length} weapon JSON files:`, loaded);
    }
}

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', async () => {
    console.log('Star Sea - Initializing...');

    // Load weapon JSON files before creating engine
    await loadWeaponJSONFiles();

    // Initialize reticle with 4 radial lines
    const reticle = document.getElementById('reticle');
    if (reticle) {
        // Add left radial line
        const leftLine = document.createElement('div');
        leftLine.className = 'reticle-line left';
        reticle.appendChild(leftLine);

        // Add right radial line
        const rightLine = document.createElement('div');
        rightLine.className = 'reticle-line right';
        reticle.appendChild(rightLine);
    }

    // Create game engine
    const engine = new Engine();

    // Start the game loop (menu will be shown first)
    engine.start();

    console.log('Star Sea - Ready!');

    // Make engine globally accessible for debugging and testing
    window.game = engine;
});
