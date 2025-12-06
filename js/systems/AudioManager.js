// AudioManager - lightweight wrapper around HTMLAudioElement
class AudioManager {
    constructor() {
        this.enabled = (typeof AUDIO_CONFIG !== 'undefined') ? AUDIO_CONFIG.enabled : false;
        this.volumeMaster = (typeof AUDIO_CONFIG !== 'undefined') ? AUDIO_CONFIG.volumeMaster : 1.0;
        this.buffers = new Map();
        this.initialized = false;
        this.loopingInstances = new Map(); // Track looping sound instances
        this.lastPlayTime = new Map(); // Track last play time for each sound (for throttling)
        this.minPlayInterval = 0.05; // Minimum 50ms between same sound plays (prevents spam)
    }

    initialize() {
        // On first user interaction browsers allow audio playback
        if (this.initialized) return;
        this.initialized = true;

        if (!this.enabled) return;

        // Preload audio elements
        const sounds = (typeof AUDIO_CONFIG !== 'undefined' && AUDIO_CONFIG.sounds) ? AUDIO_CONFIG.sounds : {};
        for (const [name, cfg] of Object.entries(sounds)) {
            const audio = new Audio();
            audio.src = cfg.src;
            audio.preload = 'auto';
            audio.volume = this.volumeMaster * (cfg.volume || 1.0);
            this.buffers.set(name, audio);
        }
    }

    playSound(name, options = {}) {
        if (!this.enabled) return;
        // Don't play sounds if game is paused (check via global game reference)
        if (window.game && window.game.stateManager && !window.game.stateManager.isPlaying()) {
            return;
        }
        const audio = this.buffers.get(name);
        if (!audio) return;

        // Throttle rapid-fire sounds to prevent timing issues
        const now = performance.now() / 1000;
        const lastPlay = this.lastPlayTime.get(name) || 0;
        if (now - lastPlay < this.minPlayInterval && !options.allowOverlap) {
            return; // Skip if played too recently (unless overlap explicitly allowed)
        }
        this.lastPlayTime.set(name, now);

        // Clone to allow overlapping playback
        const instance = audio.cloneNode();
        const volume = options.volume !== undefined ? options.volume : (AUDIO_CONFIG.sounds[name]?.volume || 1.0);
        instance.volume = this.volumeMaster * volume;
        
        // Set currentTime to 0 to ensure consistent timing
        instance.currentTime = 0;
        
        instance.play().catch(() => {
            // Ignore play errors (e.g., not triggered by user gesture)
        });
    }

    /**
     * Start a looping sound (for continuous effects like beam firing)
     * @param {string} name - Sound name
     * @param {object} options - Playback options (volume, etc.)
     */
    startLoopingSound(name, options = {}) {
        if (!this.enabled) return;
        // Don't start looping sounds if game is paused
        if (window.game && window.game.stateManager && !window.game.stateManager.isPlaying()) {
            return;
        }

        // Stop existing instance if any
        this.stopLoopingSound(name);

        const audio = this.buffers.get(name);
        if (!audio) return;

        // Create looping instance
        const instance = audio.cloneNode();
        instance.loop = true;
        const volume = options.volume !== undefined ? options.volume : (AUDIO_CONFIG.sounds[name]?.volume || 1.0);
        instance.volume = this.volumeMaster * volume;
        
        // Reset playback position for consistent timing
        instance.currentTime = 0;

        this.loopingInstances.set(name, instance);

        instance.play().catch(() => {
            // Ignore play errors (e.g., not triggered by user gesture)
        });
    }

    /**
     * Stop a looping sound
     * @param {string} name - Sound name
     */
    stopLoopingSound(name) {
        const instance = this.loopingInstances.get(name);
        if (instance) {
            instance.pause();
            instance.currentTime = 0;
            this.loopingInstances.delete(name);
        }
    }

    /**
     * Check if a looping sound is currently playing
     * @param {string} name - Sound name
     * @returns {boolean}
     */
    isLoopingSound(name) {
        return this.loopingInstances.has(name);
    }

    /**
     * Pause all sounds (used when game is paused)
     */
    pauseAll() {
        // Pause all looping sounds
        for (const [name, instance] of this.loopingInstances.entries()) {
            instance.pause();
        }
    }

    /**
     * Resume all sounds (used when game is resumed)
     */
    resumeAll() {
        // Resume all looping sounds
        for (const [name, instance] of this.loopingInstances.entries()) {
            instance.play().catch(() => {
                // Ignore play errors
            });
        }
    }

    /**
     * Stop all sounds (used when game is paused or stopped)
     */
    stopAll() {
        // Stop all looping sounds
        for (const [name, instance] of this.loopingInstances.entries()) {
            instance.pause();
            instance.currentTime = 0;
        }
        this.loopingInstances.clear();
    }
}