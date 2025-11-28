/**
 * Star Sea - Energy Torpedo Launcher Component (Andromedan)
 * Drains energy instead of using stored torpedoes
 * Energy cost based on continuous beam energy drain (8 energy/sec)
 */

class EnergyTorpedoLauncher extends TorpedoLauncher {
    constructor(config) {
        super(config);
        // Energy cost per torpedo added to ready rack
        // Based on continuous beam: 8 energy/sec, so 1 torpedo = ~10 energy (reasonable cost)
        this.energyCostPerTorpedo = config.energyCostPerTorpedo || 10;
    }

    canFire(currentTime, ship = null) {
        if (!super.canFire(currentTime)) return false;
        
        // Check if ship has enough energy to fire
        if (ship && ship.energy) {
            const totalEnergy = ship.energy.getTotalEnergy();
            if (totalEnergy < this.energyCostPerTorpedo) {
                return false; // Not enough energy
            }
        }
        
        return this.loaded > 0;
    }

    fire(ship, targetX, targetY, currentTime, lockOnTarget = null) {
        if (!this.canFire(currentTime, ship)) {
            return null;
        }

        // Drain energy instead of reducing stored count
        if (ship && ship.energy) {
            const energyDrained = ship.energy.drainEnergy(this.energyCostPerTorpedo, 0);
            if (energyDrained < this.energyCostPerTorpedo) {
                // Not enough energy to fire
                return null;
            }
        }

        this.loaded--;
        this.lastFireTime = currentTime;

        // Start reload timer - will drain energy to reload instead of using stored
        if (!this.isReloading) {
            this.reloadStartTime = currentTime;
            this.isReloading = true;
        }

        // Calculate firing point offset from ship center
        const firingPoint = this.calculateFiringPoint(ship);

        // Create standard torpedo projectile
        const torpedo = new TorpedoProjectile({
            x: firingPoint.x,
            y: firingPoint.y,
            rotation: ship.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: this.damage,
            blastRadius: this.blastRadius,
            speed: this.speed,
            lifetime: this.lifetime,
            sourceShip: ship,
            lockOnTarget: lockOnTarget,
            trackReticle: false
        });

        return torpedo;
    }

    update(deltaTime, currentTime, ship = null) {
        // Call parent auto-repair
        super.update(deltaTime, currentTime);

        // Handle reloading - drain energy to reload instead of using stored
        if (this.isReloading && this.loaded < this.maxLoaded) {
            const timeSinceReloadStart = currentTime - this.reloadStartTime;

            if (timeSinceReloadStart >= this.reloadTime) {
                // Check if ship has enough energy to reload
                if (ship && ship.energy) {
                    const totalEnergy = ship.energy.getTotalEnergy();
                    if (totalEnergy >= this.energyCostPerTorpedo) {
                        // Drain energy and reload ONE torpedo
                        const energyDrained = ship.energy.drainEnergy(this.energyCostPerTorpedo, 0);
                        if (energyDrained >= this.energyCostPerTorpedo) {
                            this.loaded++;
                        }
                    }
                }

                // If still not full, continue reloading
                if (this.loaded < this.maxLoaded) {
                    this.reloadStartTime = currentTime; // Reset timer for next torpedo
                } else {
                    this.isReloading = false; // Stop reloading when full
                }
            }
        }
    }
}

