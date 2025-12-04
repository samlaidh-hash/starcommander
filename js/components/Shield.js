/**
 * Star Sea - Unified Shield Component
 * Single shield for whole ship, toggles with space bar
 * Drains energy while up, damage drains energy
 */

class ShieldSystem {
    constructor(config) {
        this.active = false; // Shield up/down state
        this.maxStrength = config.maxStrength || 50; // Base shield strength
        this.currentStrength = this.maxStrength; // Current shield strength
        this.energyDrainRate = 0.9; // Energy per second while shield is up (reduced 70% from 3)
        this.damageToEnergyRatio = 0.5; // Damage drains this much energy (damage * ratio)
        this.lastHitTime = 0;
        this.hitFlashAlpha = 0; // Visual flash on hit (0-1)
        this.hitFlashDuration = 0.3; // Flash duration in seconds
    }

    /**
     * Toggle shield on/off
     * @param {Ship} ship - Ship instance to check for tactical warp
     */
    toggle(ship = null) {
        // Cannot raise shields during tactical warp
        if (ship && ship.tacticalWarpActive && !this.active) {
            // Trying to raise shields during tactical warp - deny
            return false;
        }
        this.active = !this.active;
        return this.active;
    }

    /**
     * Check if shield is up
     */
    isUp() {
        return this.active;
    }

    /**
     * Apply damage - if shield is up, damage drains energy and reduces shield strength
     * Returns remaining damage after shield absorbs it
     */
    applyDamage(damage, currentTime, ship = null) {
        if (!this.active) {
            // Shield down - all damage passes through
            return damage;
        }

        // Shield up - absorb damage
        const absorbed = Math.min(damage, this.currentStrength);
        this.currentStrength -= absorbed;
        this.lastHitTime = currentTime;
        
        // Visual flash effect
        this.hitFlashAlpha = 1.0;

        // Damage drains energy from ship
        if (ship && ship.energy) {
            const energyDrain = damage * this.damageToEnergyRatio;
            ship.energy.drainEnergy(energyDrain, 0);
        }

        // Return overflow damage (damage that exceeds shield strength)
        return damage - absorbed;
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
            }
        }

        // Update hit flash effect (fade out)
        if (this.hitFlashAlpha > 0) {
            this.hitFlashAlpha = Math.max(0, this.hitFlashAlpha - deltaTime / this.hitFlashDuration);
        }

        // Shield strength recovery (if not active, slowly recover)
        if (!this.active && this.currentStrength < this.maxStrength) {
            this.currentStrength = Math.min(this.maxStrength, this.currentStrength + CONFIG.SHIELD_RECOVERY_RATE * deltaTime);
        }
    }

    /**
     * Get shield percentage (0-1)
     */
    getPercentage() {
        return this.maxStrength > 0 ? this.currentStrength / this.maxStrength : 0;
    }

}
