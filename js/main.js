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

    // Initialize AssetManager
    window.assetManager = new AssetManager();

    // Create game engine
    const engine = new Engine();

    // Start the game loop (menu will be shown first)
    engine.start();

    console.log('Star Sea - Ready!');

    // Make engine globally accessible for debugging and testing
    window.game = engine;
});
