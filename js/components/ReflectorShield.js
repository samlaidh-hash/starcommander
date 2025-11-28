/**
 * Star Sea - Reflector Shield Component (Dhojan)
 * Like normal shields but:
 * - 20% more energy drain when hit
 * - 15% chance every 0.5 seconds (or per discrete hit) to reflect 50% damage back to firer
 * - Reflected damage travels back as projectile
 */

class ReflectorShieldSystem {
    constructor(config) {
        this.active = false; // Shield up/down state
        this.maxStrength = config.maxStrength || 50; // Base shield strength (not used, but kept for compatibility)
        this.currentStrength = this.maxStrength; // Not used for damage, but kept for compatibility
        this.energyDrainRate = 3; // Energy per second while shield is up (same as normal shields)
        this.damageToEnergyRatio = 0.6; // Damage drains this much energy (0.5 * 1.2 = 0.6, 20% more than normal)
        this.lastHitTime = 0;
        this.hitFlashAlpha = 0; // Visual flash on hit (0-1)
        this.hitFlashDuration = 0.3; // Flash duration in seconds
        
        // Reflection tracking
        this.reflectionChance = 0.15; // 15% chance
        this.reflectionCheckInterval = 0.5; // Check every 0.5 seconds for continuous beams
        this.lastReflectionCheck = 0;
        this.isReflecting = false; // Currently reflecting (prevents multiple reflections from same beam)
    }

    /**
     * Toggle shield on/off
     */
    toggle(ship = null) {
        // Cannot raise shields during tactical warp
        if (ship && ship.tacticalWarpActive && !this.active) {
            return false;
        }
        this.active = !this.active;
        this.isReflecting = false; // Reset reflection state
        return this.active;
    }

    /**
     * Check if shield is up
     */
    isUp() {
        return this.active;
    }

    /**
     * Apply damage - converts damage to energy drain, may reflect 50% back
     * @param {number} damage - Damage amount
     * @param {number} currentTime - Current game time
     * @param {Ship} ship - Ship instance
     * @param {Object} projectile - Projectile that hit (for reflection, optional)
     * @returns {number|Object} - Returns number for compatibility, or object if projectile provided
     */
    applyDamage(damage, currentTime, ship = null, projectile = null) {
        if (!this.active) {
            // Shield down - all damage passes through
            return projectile ? { remainingDamage: damage, reflected: false, reflectedDamage: 0 } : damage;
        }

        // Check for reflection (15% chance) - only for beam/energy weapons, not torpedoes
        let reflected = false;
        let reflectedDamage = 0;
        
        // Only reflect beam/energy weapons, not torpedoes
        const isBeamWeapon = projectile && (projectile.projectileType === 'beam' || 
                                             projectile.projectileType === 'disruptor');
        
        if (isBeamWeapon) {
            // For continuous beams: check every 0.5 seconds
            // For discrete hits: check on each hit
            const isContinuousBeam = projectile && projectile.sourceWeapon && 
                                      (projectile.sourceWeapon instanceof ContinuousBeam || 
                                       projectile.sourceWeapon instanceof GravBeam ||
                                       projectile.sourceWeapon instanceof TractorRepulsorBeam);
            
            if (isContinuousBeam) {
                // Continuous beam: check every 0.5 seconds
                if (currentTime - this.lastReflectionCheck >= this.reflectionCheckInterval) {
                    this.lastReflectionCheck = currentTime;
                    if (Math.random() < this.reflectionChance && !this.isReflecting) {
                        reflected = true;
                        reflectedDamage = damage * 0.5; // 50% reflected
                        this.isReflecting = true; // Prevent multiple reflections from same beam
                    }
                }
            } else {
                // Discrete hit: 15% chance per hit
                if (Math.random() < this.reflectionChance && !this.isReflecting) {
                    reflected = true;
                    reflectedDamage = damage * 0.5; // 50% reflected
                    this.isReflecting = true;
                }
            }

            // Reset reflection state if beam stopped
            if (projectile && !projectile.active) {
                this.isReflecting = false;
            }
        }

        this.lastHitTime = currentTime;
        this.hitFlashAlpha = 1.0;

        // Damage drains energy (20% more than normal shields)
        if (ship && ship.energy) {
            const energyDrain = damage * this.damageToEnergyRatio; // 0.6 instead of 0.5
            ship.energy.drainEnergy(energyDrain, 0);
        }

        // Return result - compatible with normal shield signature
        const remainingDamage = reflected ? damage * 0.5 : damage; // 50% still drains energy even if reflected
        
        // If projectile provided, return object for reflection handling
        if (projectile) {
            return { 
                remainingDamage: remainingDamage, 
                reflected: reflected, 
                reflectedDamage: reflectedDamage,
                projectile: projectile
            };
        }
        
        // Otherwise return number for compatibility
        return remainingDamage;
    }

    /**
     * Update shield system
     */
    update(deltaTime, currentTime, ship = null) {
        // Drain energy while shield is up
        if (this.active && ship && ship.energy) {
            const energyDrained = ship.energy.drainEnergy(this.energyDrainRate * deltaTime);
            // If out of energy, shield drops
            if (ship.energy.getTotalEnergy() <= 0) {
                this.active = false;
                this.isReflecting = false;
            }
        }

        // Update hit flash effect (fade out)
        if (this.hitFlashAlpha > 0) {
            this.hitFlashAlpha = Math.max(0, this.hitFlashAlpha - deltaTime / this.hitFlashDuration);
        }

        // Reset reflection state if enough time has passed (for continuous beams)
        if (this.isReflecting && currentTime - this.lastReflectionCheck >= this.reflectionCheckInterval * 2) {
            this.isReflecting = false;
        }
    }

    /**
     * Get shield percentage (for compatibility, always returns 1.0 since shields don't have strength)
     */
    getPercentage() {
        return this.active ? 1.0 : 0.0;
    }
}

