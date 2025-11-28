/**
 * Star Sea - Power Absorber Component (Andromedan)
 * Replaces shields:
 * - Drains energy constantly when on (same rate as shields: 3 energy/sec)
 * - Damage adds energy instead of draining it (reverse of shields)
 * - If energy banks are full, damage bypasses and reduces energy bank length
 * - No maximum strength, always active when toggled on
 */

class PowerAbsorberSystem {
    constructor(config) {
        this.active = false; // Absorber on/off state
        this.energyDrainRate = 3; // Energy per second while absorber is on (same as shields)
        this.damageToEnergyRatio = 0.5; // Damage adds this much energy (reverse of shields)
        this.lastHitTime = 0;
        this.hitFlashAlpha = 0; // Visual flash on hit (0-1)
        this.hitFlashDuration = 0.3; // Flash duration in seconds
    }

    /**
     * Toggle absorber on/off
     */
    toggle(ship = null) {
        // Cannot raise absorber during tactical warp
        if (ship && ship.tacticalWarpActive && !this.active) {
            return false;
        }
        this.active = !this.active;
        return this.active;
    }

    /**
     * Check if absorber is up
     */
    isUp() {
        return this.active;
    }

    /**
     * Apply damage - adds energy if absorber is on, bypasses if energy full
     * Returns remaining damage after absorber processes it
     */
    applyDamage(damage, currentTime, ship = null) {
        if (!this.active) {
            // Absorber off - all damage passes through
            return damage;
        }

        if (!ship || !ship.energy) {
            return damage; // No energy system - damage passes through
        }

        this.lastHitTime = currentTime;
        this.hitFlashAlpha = 1.0;

        // Check if energy banks are full
        const currentEnergy = ship.energy.getTotalEnergy();
        const maxCapacity = ship.energy.getTotalCapacity();
        const energyPercent = maxCapacity > 0 ? currentEnergy / maxCapacity : 0;

        if (energyPercent >= 1.0) {
            // Energy banks full - damage bypasses absorber and hits ship directly
            // Damage reduces energy bank length (capacity)
            ship.energy.takeDamage(damage);
            return damage;
        }

        // Absorber active and energy not full - add energy from damage
        const energyAdded = damage * this.damageToEnergyRatio; // Reverse of shields
        ship.energy.refillEnergy(energyAdded);

        // All damage is absorbed (converted to energy)
        return 0;
    }

    /**
     * Update absorber system
     */
    update(deltaTime, currentTime, ship = null) {
        // Drain energy while absorber is on (constant drain, even at full power)
        if (this.active && ship && ship.energy) {
            const energyDrained = ship.energy.drainEnergy(this.energyDrainRate * deltaTime);
            // If out of energy, absorber turns off
            if (ship.energy.getTotalEnergy() <= 0) {
                this.active = false;
            }
        }

        // Update hit flash effect (fade out)
        if (this.hitFlashAlpha > 0) {
            this.hitFlashAlpha = Math.max(0, this.hitFlashAlpha - deltaTime / this.hitFlashDuration);
        }
    }

    /**
     * Get absorber percentage (for compatibility, always returns 1.0 when active)
     */
    getPercentage() {
        return this.active ? 1.0 : 0.0;
    }
}

