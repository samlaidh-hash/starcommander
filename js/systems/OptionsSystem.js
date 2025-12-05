/**
 * Star Sea - Options System
 * Manages game options and settings
 */

class OptionsSystem {
    constructor() {
        this.settings = this.loadSettings();
        this.setupEventListeners();
        this.applySettings();
    }

    loadSettings() {
        const defaults = {
            masterVolume: 100,
            sfxVolume: 100,
            musicVolume: 100,
            targetFPS: 30,
            particlesEnabled: true,
            performanceMode: false,
            mouseSensitivity: 1.0,
            invertMouseY: false,
            autoSave: true,
            showTutorial: true,
            debugMode: false
        };

        try {
            const saved = localStorage.getItem('starSeaOptions');
            if (saved) {
                return { ...defaults, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Failed to load options:', e);
        }

        return defaults;
    }

    saveSettings() {
        try {
            localStorage.setItem('starSeaOptions', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('Failed to save options:', e);
        }
    }

    setupEventListeners() {
        // Volume sliders
        const masterVolume = document.getElementById('master-volume');
        const sfxVolume = document.getElementById('sfx-volume');
        const musicVolume = document.getElementById('music-volume');

        if (masterVolume) {
            masterVolume.value = this.settings.masterVolume;
            masterVolume.addEventListener('input', (e) => {
                this.settings.masterVolume = parseInt(e.target.value);
                document.getElementById('master-volume-value').textContent = this.settings.masterVolume + '%';
                this.applyAudioSettings();
            });
            document.getElementById('master-volume-value').textContent = this.settings.masterVolume + '%';
        }

        if (sfxVolume) {
            sfxVolume.value = this.settings.sfxVolume;
            sfxVolume.addEventListener('input', (e) => {
                this.settings.sfxVolume = parseInt(e.target.value);
                document.getElementById('sfx-volume-value').textContent = this.settings.sfxVolume + '%';
                this.applyAudioSettings();
            });
            document.getElementById('sfx-volume-value').textContent = this.settings.sfxVolume + '%';
        }

        if (musicVolume) {
            musicVolume.value = this.settings.musicVolume;
            musicVolume.addEventListener('input', (e) => {
                this.settings.musicVolume = parseInt(e.target.value);
                document.getElementById('music-volume-value').textContent = this.settings.musicVolume + '%';
                this.applyAudioSettings();
            });
            document.getElementById('music-volume-value').textContent = this.settings.musicVolume + '%';
        }

        // Target FPS
        const targetFPS = document.getElementById('target-fps');
        if (targetFPS) {
            targetFPS.value = this.settings.targetFPS;
            targetFPS.addEventListener('change', (e) => {
                this.settings.targetFPS = parseInt(e.target.value);
                this.applyGraphicsSettings();
            });
        }

        // Checkboxes
        const particlesEnabled = document.getElementById('particles-enabled');
        if (particlesEnabled) {
            particlesEnabled.checked = this.settings.particlesEnabled;
            particlesEnabled.addEventListener('change', (e) => {
                this.settings.particlesEnabled = e.target.checked;
            });
        }

        const performanceMode = document.getElementById('performance-mode');
        if (performanceMode) {
            performanceMode.checked = this.settings.performanceMode;
            performanceMode.addEventListener('change', (e) => {
                this.settings.performanceMode = e.target.checked;
                this.applyGraphicsSettings();
            });
        }

        const invertMouseY = document.getElementById('invert-mouse-y');
        if (invertMouseY) {
            invertMouseY.checked = this.settings.invertMouseY;
            invertMouseY.addEventListener('change', (e) => {
                this.settings.invertMouseY = e.target.checked;
            });
        }

        const autoSave = document.getElementById('auto-save');
        if (autoSave) {
            autoSave.checked = this.settings.autoSave;
            autoSave.addEventListener('change', (e) => {
                this.settings.autoSave = e.target.checked;
            });
        }

        const showTutorial = document.getElementById('show-tutorial');
        if (showTutorial) {
            showTutorial.checked = this.settings.showTutorial;
            showTutorial.addEventListener('change', (e) => {
                this.settings.showTutorial = e.target.checked;
            });
        }

        const debugMode = document.getElementById('debug-mode');
        if (debugMode) {
            debugMode.checked = this.settings.debugMode;
            debugMode.addEventListener('change', (e) => {
                this.settings.debugMode = e.target.checked;
                if (typeof CONFIG !== 'undefined') {
                    CONFIG.DEBUG_MODE = e.target.checked;
                }
            });
        }

        // Mouse sensitivity
        const mouseSensitivity = document.getElementById('mouse-sensitivity');
        if (mouseSensitivity) {
            mouseSensitivity.value = this.settings.mouseSensitivity;
            mouseSensitivity.addEventListener('input', (e) => {
                this.settings.mouseSensitivity = parseFloat(e.target.value);
                document.getElementById('mouse-sensitivity-value').textContent = this.settings.mouseSensitivity.toFixed(1);
            });
            document.getElementById('mouse-sensitivity-value').textContent = this.settings.mouseSensitivity.toFixed(1);
        }

        // Buttons
        const resetBtn = document.getElementById('btn-options-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetToDefaults());
        }

        const saveBtn = document.getElementById('btn-options-save');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSettings();
                this.hideOptions();
            });
        }

        const closeBtn = document.getElementById('btn-options-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.saveSettings();
                this.hideOptions();
            });
        }
    }

    applySettings() {
        this.applyAudioSettings();
        this.applyGraphicsSettings();
    }

    applyAudioSettings() {
        // Apply audio volume settings
        if (window.game && window.game.audioManager) {
            const masterVol = this.settings.masterVolume / 100;
            const sfxVol = (this.settings.sfxVolume / 100) * masterVol;
            const musicVol = (this.settings.musicVolume / 100) * masterVol;
            
            // Apply to audio manager if it has volume controls
            if (window.game.audioManager.setMasterVolume) {
                window.game.audioManager.setMasterVolume(masterVol);
            }
            if (window.game.audioManager.setSFXVolume) {
                window.game.audioManager.setSFXVolume(sfxVol);
            }
            if (window.game.audioManager.setMusicVolume) {
                window.game.audioManager.setMusicVolume(musicVol);
            }
        }
    }

    applyGraphicsSettings() {
        // Apply graphics settings
        if (typeof CONFIG !== 'undefined') {
            CONFIG.TARGET_FPS = this.settings.targetFPS;
            CONFIG.PERFORMANCE_MODE = this.settings.performanceMode;
        }
    }

    resetToDefaults() {
        if (confirm('Reset all options to defaults?')) {
            this.settings = {
                masterVolume: 100,
                sfxVolume: 100,
                musicVolume: 100,
                targetFPS: 30,
                particlesEnabled: true,
                performanceMode: false,
                mouseSensitivity: 1.0,
                invertMouseY: false,
                autoSave: true,
                showTutorial: true,
                debugMode: false
            };
            
            // Update UI
            document.getElementById('master-volume').value = 100;
            document.getElementById('master-volume-value').textContent = '100%';
            document.getElementById('sfx-volume').value = 100;
            document.getElementById('sfx-volume-value').textContent = '100%';
            document.getElementById('music-volume').value = 100;
            document.getElementById('music-volume-value').textContent = '100%';
            document.getElementById('target-fps').value = 30;
            document.getElementById('particles-enabled').checked = true;
            document.getElementById('performance-mode').checked = false;
            document.getElementById('mouse-sensitivity').value = 1.0;
            document.getElementById('mouse-sensitivity-value').textContent = '1.0';
            document.getElementById('invert-mouse-y').checked = false;
            document.getElementById('auto-save').checked = true;
            document.getElementById('show-tutorial').checked = true;
            document.getElementById('debug-mode').checked = false;
            
            this.applySettings();
        }
    }

    showOptions() {
        const optionsScreen = document.getElementById('options-screen');
        if (optionsScreen) {
            optionsScreen.classList.remove('hidden');
        }
    }

    hideOptions() {
        const optionsScreen = document.getElementById('options-screen');
        if (optionsScreen) {
            optionsScreen.classList.add('hidden');
        }
    }

    getSettings() {
        return this.settings;
    }
}

