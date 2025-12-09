/**
 * Star Sea - Input Manager
 * Handles keyboard and mouse input
 */

class InputManager {
    constructor() {
        this.keys = new Map();
        this.keysPressed = new Map(); // Single-frame key press detection
        this.shiftDown = false;
        this.ctrlDown = false;
        this.altDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseButtons = new Map();
        this.spacebarPressTime = 0;
        this.spacebarReleased = true;

        // Double-tap detection for boost
        this.lastKeyPressTimes = new Map(); // Track last press time for each key
        this.doubleTapThreshold = 300; // 300ms threshold for double-tap

        // Tactical warp state tracking
        this.tacticalWarpActive = false;
        this.tacticalWarpStartTime = 0;
        this.tacticalWarpCooldownEnd = 0;
        this.wKeyDoubleTapped = false; // Track if W was double-tapped
        this.wKeyHeld = false; // Track if W is currently held
        
        // Fast rotate state tracking (prevent multiple triggers while holding)
        this.fastRotateTriggered = new Set(); // Track which keys have triggered fast-rotate

        this.init();
    }

    init() {
        // Keyboard events
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Mouse events
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mouseup', (e) => this.onMouseUp(e));
        window.addEventListener('contextmenu', (e) => e.preventDefault());

        // Mouse wheel for zoom
        window.addEventListener('wheel', (e) => this.onMouseWheel(e), { passive: false });
    }

    onKeyDown(e) {
        const key = e.key.toLowerCase();

        // Track modifier key states
        if (e.key === 'Shift') {
            this.shiftDown = true;
        }
        if (e.key === 'Control') {
            this.ctrlDown = true;
        }
        if (e.key === 'Alt') {
            this.altDown = true;
        }

        // Only set keysPressed if key wasn't already down (single press detection)
        // IMPORTANT: Check key state BEFORE modifying it for double-tap detection
        const wasKeyAlreadyDown = this.keys.get(key) === true;
        
        if (!wasKeyAlreadyDown) {
            this.keysPressed.set(key, true);
        }

        this.keys.set(key, true);

        // Handle spacebar press timing for mine deployment
        if (e.key === ' ' && this.spacebarReleased) {
            this.spacebarPressTime = performance.now();
            this.spacebarReleased = false;
        }

        // Double-tap detection for special maneuvers (W, A, S, D keys)
        if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
            const currentTime = performance.now();
            const lastPressTime = this.lastKeyPressTimes.get(key) || 0;
            const timeSinceLastPress = currentTime - lastPressTime;

            if (timeSinceLastPress < this.doubleTapThreshold && !wasKeyAlreadyDown) {
                // Double-tap detected! (only if key wasn't already held)
                if (CONFIG.DEBUG_MODE) {
                    console.log(`🔵 Double-tap detected for key: ${key}, timeSinceLastPress: ${timeSinceLastPress}ms`);
                }
                if (key === 'w') {
                    // For W key: Mark as double-tapped, will activate tactical warp if held
                    this.wKeyDoubleTapped = true;
                    this.wKeyHeld = true;
                    if (CONFIG.DEBUG_MODE) {
                        console.log('🔵 W key double-tapped, waiting for hold to activate tactical warp');
                    }
                    // Don't emit burst-acceleration - tactical warp takes priority
                } else if (key === 's') {
                    if (CONFIG.DEBUG_MODE) {
                        console.log('🔵 S key double-tapped - emitting instant-stop');
                    }
                    eventBus.emit('instant-stop', { direction: key });
                } else if (key === 'a' || key === 'd') {
                    // Only trigger fast-rotate if it hasn't been triggered for this key yet
                    if (!this.fastRotateTriggered.has(key)) {
                        this.fastRotateTriggered.add(key);
                        if (CONFIG.DEBUG_MODE) {
                            console.log(`🔵 ${key.toUpperCase()} key double-tapped - emitting fast-rotate`);
                        }
                        eventBus.emit('fast-rotate', { direction: key });
                    } else {
                        if (CONFIG.DEBUG_MODE) {
                            console.log(`🔵 ${key.toUpperCase()} key double-tapped but already triggered`);
                        }
                    }
                }
                this.lastKeyPressTimes.set(key, 0); // Reset to prevent triple-tap
            } else {
                // Only update last press time if this is a new press (not a repeat)
                if (!wasKeyAlreadyDown) {
                    this.lastKeyPressTimes.set(key, currentTime);
                }
                // If W key is pressed but not double-tapped, track it
                if (key === 'w') {
                    this.wKeyHeld = true;
                    if (!wasKeyAlreadyDown) {
                        // First press, not a double-tap - only reset if not already double-tapped
                        // Don't reset wKeyDoubleTapped if it was already set (prevents reset on key repeat)
                        if (!this.wKeyDoubleTapped) {
                            this.wKeyDoubleTapped = false;
                        }
                    }
                }
            }
        }

        // Check for tactical warp activation (double-tap-and-hold W)
        // This fires on keydown when W is double-tapped and being held
        // IMPORTANT: Check this AFTER the double-tap detection above, but also check on every keydown
        // to catch the case where W is held after double-tap
        if (key === 'w') {
            // Ensure wKeyHeld is set when W is down
            if (!this.wKeyHeld) {
                this.wKeyHeld = true;
            }
            
            // If W was double-tapped and is being held, activate tactical warp
            if (this.wKeyDoubleTapped && this.wKeyHeld && !this.tacticalWarpActive) {
                if (CONFIG.DEBUG_MODE) {
                    console.log('🔵 Tactical warp activation check: doubleTapped=', this.wKeyDoubleTapped, 'held=', this.wKeyHeld, 'active=', this.tacticalWarpActive);
                }
                this.tacticalWarpActive = true;
                this.tacticalWarpStartTime = performance.now();
                if (CONFIG.DEBUG_MODE) {
                    console.log('🔵 Emitting tactical-warp-start event');
                }
                eventBus.emit('tactical-warp-start', { time: this.tacticalWarpStartTime });
            }
        }

        eventBus.emit('keydown', { key: key, event: e });
    }

    onKeyUp(e) {
        const key = e.key.toLowerCase();

        // Track modifier key states
        if (e.key === 'Shift') {
            this.shiftDown = false;
        }
        if (e.key === 'Control') {
            this.ctrlDown = false;
        }
        if (e.key === 'Alt') {
            this.altDown = false;
        }

        this.keys.set(key, false);

        // Handle W key release for tactical warp
        if (key === 'w') {
            this.wKeyHeld = false;
            if (this.tacticalWarpActive) {
                // End tactical warp
                const warpDuration = (performance.now() - this.tacticalWarpStartTime) / 1000; // Duration in seconds
                this.tacticalWarpActive = false;
                this.wKeyDoubleTapped = false;
                eventBus.emit('tactical-warp-end', { duration: warpDuration });
            } else if (this.wKeyDoubleTapped) {
                // W was double-tapped but released before tactical warp activated
                // Fall back to burst acceleration
                this.wKeyDoubleTapped = false;
                eventBus.emit('burst-acceleration', { direction: 'w' });
            }
        }
        
        // Reset fast-rotate trigger when key is released
        if (key === 'a' || key === 'd') {
            this.fastRotateTriggered.delete(key);
        }

        // Handle spacebar - now used for shield toggle (single press)
        // Decoys moved to C key, mines to E key
        if (e.key === ' ') {
            this.spacebarReleased = true;
            // Shield toggle handled in Engine.js keydown listener
        }

        // C key for decoy deployment
        if (e.key === 'c' || e.key === 'C') {
            eventBus.emit('deploy-decoy');
        }

        // M key for mine deployment (with modifiers for variants)
        if (e.key === 'm' || e.key === 'M') {
            if (e.shiftKey) {
                eventBus.emit('deploy-mine', { mineType: 'captor' });
            } else if (e.altKey) {
                eventBus.emit('deploy-mine', { mineType: 'phaser' });
            } else if (e.ctrlKey) {
                eventBus.emit('deploy-mine', { mineType: 'transporter' });
            } else {
                eventBus.emit('deploy-mine', { mineType: 'standard' });
            }
        }

        // R key for torpedo type cycling
        if (e.key === 'r' || e.key === 'R') {
            eventBus.emit('cycle-torpedo-type');
        }

        // I key for interceptor deployment
        if (e.key === 'i' || e.key === 'I') {
            eventBus.emit('deploy-interceptor');
        }

        eventBus.emit('keyup', { key: e.key.toLowerCase(), event: e });
    }

    onMouseMove(e) {
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();

        // Calculate mouse position relative to CSS-scaled canvas
        const cssX = e.clientX - rect.left;
        const cssY = e.clientY - rect.top;

        // CRITICAL FIX: Scale mouse coordinates from CSS size to actual canvas dimensions
        // Canvas has actual size (canvas.width x canvas.height) but is rendered at CSS size (rect.width x rect.height)
        // Camera uses actual canvas size for transforms, so we must scale mouse coords to match
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        this.mouseX = cssX * scaleX;
        this.mouseY = cssY * scaleY;

        // Update reticle position - use CSS coordinates for DOM positioning
        const reticle = document.getElementById('reticle');
        if (reticle) {
            reticle.style.left = (rect.left + cssX) + 'px';
            reticle.style.top = (rect.top + cssY) + 'px';
        }

        eventBus.emit('mousemove', { x: this.mouseX, y: this.mouseY, event: e });
    }

    onMouseDown(e) {
        this.mouseButtons.set(e.button, true);

        if (e.button === 0) { // Left click - start beam hold-to-fire
            eventBus.emit('beam-fire-start', { x: this.mouseX, y: this.mouseY });
        } else if (e.button === 2) { // Right click - start torpedo charge/fire
            eventBus.emit('torpedo-fire-start', { x: this.mouseX, y: this.mouseY });
        }

        eventBus.emit('mousedown', { button: e.button, x: this.mouseX, y: this.mouseY, event: e });
    }

    onMouseUp(e) {
        this.mouseButtons.set(e.button, false);

        if (e.button === 0) { // Left mouse release - stop beam firing
            eventBus.emit('beam-fire-stop', { x: this.mouseX, y: this.mouseY });
        } else if (e.button === 2) { // Right mouse release - release torpedo/plasma
            eventBus.emit('torpedo-fire-release', { x: this.mouseX, y: this.mouseY });
        }

        eventBus.emit('mouseup', { button: e.button, x: this.mouseX, y: this.mouseY, event: e });
    }

    onMouseWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 1 : -1; // 1 = zoom out, -1 = zoom in
        eventBus.emit('mouse-wheel', { delta, event: e });
    }

    isKeyDown(key) {
        return this.keys.get(key.toLowerCase()) || false;
    }

    isKeyPressed(key) {
        // Returns true only on the frame the key was first pressed
        return this.keysPressed.get(key.toLowerCase()) || false;
    }

    isShiftDown() {
        return this.shiftDown;
    }

    isCtrlDown() {
        return this.ctrlDown;
    }

    isAltDown() {
        return this.altDown;
    }

    clearPressedKeys() {
        // Call this at the end of each frame to reset single-press detection
        this.keysPressed.clear();
    }

    isMouseButtonDown(button) {
        return this.mouseButtons.get(button) || false;
    }

    getMousePosition() {
        return { x: this.mouseX, y: this.mouseY };
    }
}
