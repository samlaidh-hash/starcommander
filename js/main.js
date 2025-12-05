/**
 * Star Sea - Main Entry Point
 * Initialize and start the game
 */

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', () => {
    console.log('Star Sea - Initializing...');

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

    // Preload ship images and weapon loadouts
    Promise.all([
        window.assetManager ? window.assetManager.preloadAllShips().catch(err => {
            console.warn('⚠️ Some ship images failed to preload:', err);
        }) : Promise.resolve(),
        window.weaponLoadoutManager ? window.weaponLoadoutManager.preloadAllLoadouts().catch(err => {
            console.warn('⚠️ Some weapon loadouts failed to preload:', err);
        }) : Promise.resolve()
    ]).then(() => {
        console.log('✅ All ship images and weapon loadouts preloaded');
    });

    // Start the game loop (menu will be shown first)
    engine.start();

    console.log('Star Sea - Ready!');

    // Make engine globally accessible for debugging and testing
    window.game = engine;
});
