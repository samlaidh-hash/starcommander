/**
 * Star Sea - State Manager
 * Manages game states (menu, playing, paused, etc.)
 */

class StateManager {
    constructor() {
        this.currentState = 'MAIN_MENU'; // MAIN_MENU, BRIEFING, PLAYING, PAUSED, DEBRIEFING
        this.previousState = null;
    }

    setState(newState) {
        this.previousState = this.currentState;
        this.currentState = newState;
        eventBus.emit('state-changed', { from: this.previousState, to: newState });
        this.updateUIVisibility();
    }

    getState() {
        return this.currentState;
    }

    isPlaying() {
        return this.currentState === 'PLAYING';
    }

    isPaused() {
        return this.currentState === 'PAUSED';
    }

    togglePause() {
        if (this.currentState === 'PLAYING') {
            this.setState('PAUSED');
        } else if (this.currentState === 'PAUSED') {
            this.setState('PLAYING');
        }
    }

    updateUIVisibility() {
        // Show/hide UI elements based on state
        const mainMenu = document.getElementById('main-menu');
        const pauseMenu = document.getElementById('pause-menu');
        const hud = document.getElementById('hud');

        // Hide all by default
        mainMenu.classList.add('hidden');
        pauseMenu.classList.add('hidden');
        if (hud) hud.style.display = 'none';

        // Show appropriate UI for current state
        switch (this.currentState) {
            case 'MAIN_MENU':
                mainMenu.classList.remove('hidden');
                break;
            case 'PLAYING':
                if (hud) hud.style.display = 'block';
                break;
            case 'PAUSED':
                if (hud) hud.style.display = 'block';
                pauseMenu.classList.remove('hidden');
                break;
            case 'BRIEFING':
                // Briefing screen visibility is handled by MissionUI
                // Game should be paused during briefing
                break;
            case 'DEBRIEFING':
                // TODO: Show debriefing screen
                break;
        }
    }
}
