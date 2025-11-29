/**
 * Star Sea - Torpedo Launcher Component
 */

class TorpedoLauncher extends Weapon {
    constructor(config) {
        super(config);
        this.loaded = config.loaded || CONFIG.TORPEDO_LOADED;
        this.maxLoaded = config.maxLoaded || CONFIG.TORPEDO_LOADED;
        this.stored = config.stored || CONFIG.TORPEDO_STORED;
        this.blastRadius = config.blastRadius || CONFIG.TORPEDO_BLAST_RADIUS_PIXELS;
        this.speed = config.speed || CONFIG.TORPEDO_SPEED_CA;
        this.lifetime = CONFIG.TORPEDO_LIFETIME;
        this.reloadTime = CONFIG.TORPEDO_RELOAD_TIME; // 5 seconds to reload all 4
        this.reloadStartTime = 0;
        this.isReloading = false;
        this.damage = CONFIG.TORPEDO_DAMAGE;
    }

    canFire(currentTime) {
        if (!super.canFire()) return false;
        return this.loaded > 0;
    }

    fire(ship, targetX, targetY, currentTime, lockOnTarget = null) {
        if (!this.canFire(currentTime)) {
            if (CONFIG.DEBUG_MODE && ship.isPlayer) {
                console.log('Torpedo cannot fire:', {
                    disabled: this.disabled,
                    hp: this.hp,
                    loaded: this.loaded,
                    stored: this.stored
                });
            }
            return null;
        }

        this.loaded--;
        this.lastFireTime = currentTime;

        if (CONFIG.DEBUG_MODE && ship.isPlayer) {
            console.log('Torpedo fired!', {
                loaded: this.loaded,
                stored: this.stored
            });
        }

        // Start reload timer when we fire a torpedo and have stored ammo
        if (this.stored > 0 && !this.isReloading) {
            this.reloadStartTime = currentTime;
            this.isReloading = true;
        }

        // Calculate firing point offset from ship center
        const firingPoint = this.calculateFiringPoint(ship);

        // Determine torpedo type based on ship selection
        const torpedoType = ship.selectedTorpedoType || 'standard';
        let torpedo = null;

        switch (torpedoType) {
            case 'heavy':
                torpedo = new HeavyTorpedo({
                    x: firingPoint.x,
                    y: firingPoint.y,
                    rotation: ship.rotation,
                    targetX: targetX,
                    targetY: targetY,
                    damage: 3,
                    blastRadius: this.blastRadius * 1.5,
                    speed: this.speed * 0.8,
                    lifetime: this.lifetime * 1.2,
                    sourceShip: ship,
                    lockOnTarget: lockOnTarget,
                    trackReticle: false // Torpedoes no longer track reticle
                });
                break;

            case 'quantum':
                torpedo = new QuantumTorpedo({
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
                    trackReticle: false // Torpedoes no longer track reticle
                });
                break;

            case 'gravity':
                torpedo = new GravityTorpedo({
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
                    gravityWellDuration: 10.0,
                    gravityWellStrength: 0.3,
                    trackReticle: false // Torpedoes no longer track reticle
                });
                break;

            case 'standard':
            default:
                torpedo = new TorpedoProjectile({
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
                    trackReticle: false // Torpedoes no longer track reticle
                });
                break;
        }

        return torpedo;
    }

    update(deltaTime, currentTime) {
        // Call parent auto-repair
        super.update(deltaTime, currentTime);

        // Ensure currentTime is valid (fallback if not provided)
        if (!currentTime || currentTime === 0) {
            currentTime = performance.now() / 1000;
        }

        // Handle reloading - top-off system: reload ONE torpedo every 5 seconds until full
        if (this.isReloading && this.stored > 0 && this.loaded < this.maxLoaded) {
            const timeSinceReloadStart = currentTime - this.reloadStartTime;

            if (timeSinceReloadStart >= this.reloadTime) {
                // Reload ONE torpedo from storage
                this.loaded++;
                this.stored--;

                if (CONFIG.DEBUG_MODE) {
                    console.log('Torpedo reloaded:', {
                        loaded: this.loaded,
                        stored: this.stored,
                        timeSinceReloadStart: timeSinceReloadStart.toFixed(2)
                    });
                }

                // If still not full and have more stored, continue reloading
                if (this.loaded < this.maxLoaded && this.stored > 0) {
                    this.reloadStartTime = currentTime; // Reset timer for next torpedo
                } else {
                    this.isReloading = false; // Stop reloading when full or out of stored
                }
            }
        }
    }

    getLoadedCount() {
        return this.loaded;
    }

    getStoredCount() {
        return this.stored;
    }

    /**
     * Calculate torpedo firing point from weapon mount position
     */
    calculateFiringPoint(ship) {
        // Get ship size for proper offset calculation
        const shipSize = ship.getShipSize ? ship.getShipSize() : 40;

        // Use weapon position if available
        if (this.position) {
            const worldRad = MathUtils.toRadians(ship.rotation);
            const worldCos = Math.cos(worldRad);
            const worldSin = Math.sin(worldRad);

            // Apply weapon mount position with additional offset to clear ship hull
            const clearOffset = shipSize * 1.5; // 150% of ship size - prevents stuck torpedoes
            const totalX = this.position.x;
            // For forward weapons (negative Y), subtract offset to move forward
            // For aft weapons (positive Y), add offset to move backward
            const totalY = this.position.y < 0 
                ? this.position.y - clearOffset  // Forward: move further forward
                : this.position.y + clearOffset; // Aft: move further backward

            let worldX = ship.x + (totalX * worldCos - totalY * worldSin);
            let worldY = ship.y + (totalX * worldSin + totalY * worldCos);

            // Add velocity compensation for fast-moving ships
            worldX += (ship.vx || 0) * 0.15;
            worldY += (ship.vy || 0) * 0.15;

            return { x: worldX, y: worldY };
        }

        // Fallback: offset forward from ship center (large offset to clear ship)
        const offset = shipSize * 1.5; // 150% of ship size forward - prevents stuck torpedoes
        const worldRad = MathUtils.toRadians(ship.rotation);

        let x = ship.x + Math.sin(worldRad) * offset;
        let y = ship.y - Math.cos(worldRad) * offset;

        // Add velocity compensation for fast-moving ships
        x += (ship.vx || 0) * 0.15;
        y += (ship.vy || 0) * 0.15;

        return { x, y };
    }
}
