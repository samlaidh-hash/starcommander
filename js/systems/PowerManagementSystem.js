/**
 * Star Sea - Power Management System
 * TAB cycling through 6 power modes with different performance trade-offs
 */

class PowerManagementSystem {
    constructor() {
        this.currentMode = 'BALANCED'; // Default mode
        this.playerShip = null;
        this.modes = {
            'BALANCED': {
                name: 'All Systems Balanced',
                speed: 1.0,
                turnRate: 1.0,
                shieldStrength: 1.0,
                shieldRecharge: 1.0,
                beamDamage: 1.0,
                beamRecharge: 1.0
            },
            'SPEED_FOCUS': {
                name: 'Speed Focus',
                speed: 2.0,
                turnRate: 2.0,
                shieldStrength: 0.5,
                shieldRecharge: 0.5,
                beamDamage: 1.0,
                beamRecharge: 1.0
            },
            'SHIELD_FOCUS': {
                name: 'Shield Focus',
                speed: 0.5,
                turnRate: 0.5,
                shieldStrength: 2.0,
                shieldRecharge: 2.0,
                beamDamage: 1.0,
                beamRecharge: 1.0
            },
            'BEAM_FOCUS': {
                name: 'Beam Focus',
                speed: 0.5,
                turnRate: 0.5,
                shieldStrength: 0.5,
                shieldRecharge: 0.5,
                beamDamage: 2.0,
                beamRecharge: 2.0
            },
            'BALANCED_SPEED': {
                name: 'Balanced Speed',
                speed: 1.5,
                turnRate: 1.5,
                shieldStrength: 1.0,
                shieldRecharge: 1.0,
                beamDamage: 0.5,
                beamRecharge: 0.5
            },
            'BALANCED_SHIELD': {
                name: 'Balanced Shield',
                speed: 1.0,
                turnRate: 1.0,
                shieldStrength: 1.0,
                shieldRecharge: 1.0,
                beamDamage: 0.5,
                beamRecharge: 0.5
            }
        };
        
        this.modeOrder = [
            'BALANCED',
            'SPEED_FOCUS', 
            'SHIELD_FOCUS',
            'BEAM_FOCUS',
            'BALANCED_SPEED',
            'BALANCED_SHIELD'
        ];
        
        this.currentModeIndex = 0;
        this.lastTabTime = 0;
        this.tabDelay = 2.0; // 2 seconds after last TAB press
        this.doubleTabTime = 0.5; // 0.5 seconds for double-tap detection
        
        // Store original values for restoration
        this.originalValues = {};
    }

    /**
     * Handle TAB key press
     */
    handleTabPress(currentTime) {
        const timeSinceLastTab = currentTime - this.lastTabTime;
        
        // Check for double-tap (reset to balanced)
        if (timeSinceLastTab < this.doubleTabTime) {
            this.resetToBalanced();
            this.lastTabTime = currentTime;
            return;
        }
        
        // Normal mode cycling
        this.cycleMode();
        this.lastTabTime = currentTime;
    }

    /**
     * Cycle to next power mode
     */
    cycleMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modeOrder.length;
        this.currentMode = this.modeOrder[this.currentModeIndex];
        
        eventBus.emit('power-mode-changed', { 
            mode: this.currentMode,
            modeName: this.modes[this.currentMode].name
        });
        
        console.log(`Power mode changed to: ${this.modes[this.currentMode].name}`);
    }

    /**
     * Reset to balanced mode (double-tap TAB)
     */
    resetToBalanced() {
        this.currentMode = 'BALANCED';
        this.currentModeIndex = 0;
        
        eventBus.emit('power-mode-reset', { 
            mode: this.currentMode,
            modeName: this.modes[this.currentMode].name
        });
        
        console.log('Power mode reset to: All Systems Balanced');
    }

    /**
     * Apply power mode effects to ship
     */
    applyModeEffects(ship) {
        const mode = this.modes[this.currentMode];
        
        // Store original values if not already stored
        if (!this.originalValues.maxSpeed) {
            this.originalValues.maxSpeed = ship.maxSpeed;
            this.originalValues.turnRate = ship.turnRate;
            this.originalValues.acceleration = ship.acceleration;
        }
        
        // Apply speed and turn rate modifiers
        ship.maxSpeed = this.originalValues.maxSpeed * mode.speed;
        ship.turnRate = this.originalValues.turnRate * mode.turnRate;
        ship.acceleration = this.originalValues.acceleration * mode.speed;
        
        // Apply shield modifiers
        if (ship.shields) {
            this.applyShieldModifiers(ship.shields, mode);
        }
        
        // Apply beam weapon modifiers
        if (ship.weapons) {
            this.applyWeaponModifiers(ship.weapons, mode);
        }
    }

    /**
     * Apply shield modifiers (unified shield system)
     */
    applyShieldModifiers(shieldSystem, mode) {
        if (!shieldSystem) return;
        
        // Store original max strength if not already stored
        if (!this.originalValues.shield_maxStrength) {
            this.originalValues.shield_maxStrength = shieldSystem.maxStrength;
        }
        
        // Apply shield strength modifier
        shieldSystem.maxStrength = this.originalValues.shield_maxStrength * mode.shieldStrength;
        shieldSystem.currentStrength = Math.min(shieldSystem.currentStrength, shieldSystem.maxStrength);
        
        // Note: Shield recharge rate is handled in ShieldSystem.update() via CONFIG.SHIELD_RECOVERY_RATE
    }

    /**
     * Apply weapon modifiers
     */
    applyWeaponModifiers(weapons, mode) {
        for (const weapon of weapons) {
            // Store original damage if not already stored
            const weaponKey = `weapon_${weapon.name}_damage`;
            if (!this.originalValues[weaponKey]) {
                this.originalValues[weaponKey] = weapon.damage;
            }
            
            // Apply damage modifier
            weapon.damage = this.originalValues[weaponKey] * mode.beamDamage;
            
            // Apply recharge rate modifier for beam weapons
            if (weapon.cooldown) {
                const cooldownKey = `weapon_${weapon.name}_cooldown`;
                if (!this.originalValues[cooldownKey]) {
                    this.originalValues[cooldownKey] = weapon.cooldown;
                }
                
                weapon.cooldown = this.originalValues[cooldownKey] / mode.beamRecharge;
            }
        }
    }

    /**
     * Update power management system
     */
    update(deltaTime, currentTime, ship) {
        // Check if we should reset to balanced mode (2 seconds after last TAB)
        if (currentTime - this.lastTabTime >= this.tabDelay && this.currentMode !== 'BALANCED') {
            this.resetToBalanced();
        }
        
        // Apply current mode effects
        this.applyModeEffects(ship);
    }

    /**
     * Get current mode information
     */
    getCurrentMode() {
        return {
            mode: this.currentMode,
            name: this.modes[this.currentMode].name,
            modifiers: this.modes[this.currentMode]
        };
    }

    init(playerShip) {
        this.playerShip = playerShip;
        eventBus.on('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(event) {
        if (event.key === 'tab' && this.playerShip) {
            this.cycleMode();
        }
    }

    /**
     * Get all available modes
     */
    getAllModes() {
        return Object.keys(this.modes).map(key => ({
            key: key,
            name: this.modes[key].name,
            modifiers: this.modes[key]
        }));
    }

    /**
     * Check if system is in balanced mode
     */
    isBalanced() {
        return this.currentMode === 'BALANCED';
    }

    /**
     * Get power mode status for UI
     */
    getStatus() {
        return {
            currentMode: this.currentMode,
            modeName: this.modes[this.currentMode].name,
            modifiers: this.modes[this.currentMode],
            timeSinceLastTab: performance.now() / 1000 - this.lastTabTime
        };
    }
}
