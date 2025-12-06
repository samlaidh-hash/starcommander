/**
 * Star Sea - Plasma Torpedo Launcher (Scintilian faction)
 * 1 plasma torpedo per launcher with DP (Damage Potential) system
 */

class PlasmaTorpedo extends Weapon {
    constructor(config) {
        super(config);
        this.loaded = 1; // Only 1 plasma torp per launcher
        this.maxLoaded = 1;
        this.stored = 0; // No stored plasma torps (fired one at a time)
        this.speed = CONFIG.PLASMA_SPEED_CA; // 2/3 of normal torpedo speed
        this.lifetime = CONFIG.TORPEDO_LIFETIME;
        this.reloadDelay = CONFIG.TORPEDO_RELOAD_DELAY * 2; // 8 seconds (2x normal)
        this.reloadStartTime = 0;
        this.isReloading = false;
    }

    canFire(currentTime) {
        if (!super.canFire()) return false;
        return this.loaded > 0;
    }

    fire(ship, targetX, targetY, currentTime, lockOnTarget = null, chargeDamage = 0) {
        if (!this.canFire(currentTime)) return null;

        this.loaded = 0; // Fire the plasma torp
        this.lastFireTime = currentTime;

        // Start reload timer
        this.reloadStartTime = currentTime + this.reloadDelay;
        this.isReloading = false;

        // Use charged damage if provided, otherwise use default
        const damagePotential = chargeDamage > 0 ? chargeDamage : CONFIG.PLASMA_DAMAGE_POTENTIAL;

        // Calculate firing point offset from ship center (pass target for edge calculation)
        const firingPoint = this.calculateFiringPoint(ship, targetX, targetY);

        // Create plasma torpedo projectile
        const plasmaTorp = new PlasmaTorpedoProjectile({
            x: firingPoint.x,
            y: firingPoint.y,
            rotation: ship.rotation,
            targetX: targetX,
            targetY: targetY,
            damagePotential: damagePotential, // Use charged damage
            speed: this.speed,
            lifetime: this.lifetime,
            sourceShip: ship,
            lockOnTarget: lockOnTarget, // Auto-home to nearest target
            trackReticle: false // Torpedoes no longer track reticle
        });

        return plasmaTorp;
    }

    update(deltaTime, currentTime) {
        // Call parent auto-repair
        super.update(deltaTime, currentTime);

        // Handle reloading
        if (this.loaded < this.maxLoaded) {
            if (currentTime - this.lastFireTime >= this.reloadDelay) {
                if (!this.isReloading) {
                    this.isReloading = true;
                    this.reloadStartTime = currentTime;
                }

                // Reload 1 plasma torpedo after 8 seconds
                const timeSinceReloadStart = currentTime - this.reloadStartTime;
                if (timeSinceReloadStart >= 0) {
                    this.loaded = 1;
                    this.isReloading = false;
                }
            }
        } else {
            this.isReloading = false;
        }
    }

    getLoadedCount() {
        return this.loaded;
    }

    getStoredCount() {
        return 0; // No stored plasma torps
    }

    /**
     * Calculate plasma torpedo firing point from weapon mount position
     * @param {Ship} ship - The ship firing the torpedo
     * @param {number} targetX - Target X coordinate (optional, for edge calculation)
     * @param {number} targetY - Target Y coordinate (optional, for edge calculation)
     */
    calculateFiringPoint(ship, targetX = null, targetY = null) {
        // Get ship size for proper offset calculation
        const shipSize = ship.getShipSize ? ship.getShipSize() : 40;

        // If target is provided and ship has PNG, calculate edge point closest to target
        if (targetX !== null && targetY !== null && ship.hasPNGImage && ship.pngImageWidth && ship.pngImageHeight) {
            const worldRad = MathUtils.toRadians(ship.rotation);
            const worldCos = Math.cos(worldRad);
            const worldSin = Math.sin(worldRad);
            
            // Convert target to ship-local coordinates
            const relX = targetX - ship.x;
            const relY = targetY - ship.y;
            const localTargetX = relX * worldCos + relY * worldSin;
            const localTargetY = -relX * worldSin + relY * worldCos;
            
            // PNG image bounds in ship-local space (centered at origin)
            const halfWidth = ship.pngImageWidth / 2;
            const halfHeight = ship.pngImageHeight / 2;
            
            // Find closest point on PNG rectangle edge to target
            // Clamp target to rectangle bounds first
            const clampedX = Math.max(-halfWidth, Math.min(halfWidth, localTargetX));
            const clampedY = Math.max(-halfHeight, Math.min(halfHeight, localTargetY));
            
            // Determine which edge is closest
            const distToLeft = Math.abs(localTargetX - (-halfWidth));
            const distToRight = Math.abs(localTargetX - halfWidth);
            const distToTop = Math.abs(localTargetY - (-halfHeight));
            const distToBottom = Math.abs(localTargetY - halfHeight);
            
            const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
            
            let edgeX, edgeY;
            if (minDist === distToLeft) {
                // Left edge
                edgeX = -halfWidth;
                edgeY = clampedY;
            } else if (minDist === distToRight) {
                // Right edge
                edgeX = halfWidth;
                edgeY = clampedY;
            } else if (minDist === distToTop) {
                // Top edge (forward)
                edgeX = clampedX;
                edgeY = -halfHeight;
            } else {
                // Bottom edge (aft)
                edgeX = clampedX;
                edgeY = halfHeight;
            }
            
            // Add small offset outward from edge to clear image
            const offsetDist = 5; // Small offset to clear edge
            const dx = localTargetX - edgeX;
            const dy = localTargetY - edgeY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
                edgeX += (dx / dist) * offsetDist;
                edgeY += (dy / dist) * offsetDist;
            }
            
            // Convert back to world coordinates
            const worldX = ship.x + (edgeX * worldCos - edgeY * worldSin);
            const worldY = ship.y + (edgeX * worldSin + edgeY * worldCos);
            
            // Add velocity compensation for fast-moving ships
            const finalX = worldX + (ship.vx || 0) * 0.15;
            const finalY = worldY + (ship.vy || 0) * 0.15;
            
            return { x: finalX, y: finalY };
        }

        // Use weapon position if available
        if (this.position) {
            const worldRad = MathUtils.toRadians(ship.rotation);
            const worldCos = Math.cos(worldRad);
            const worldSin = Math.sin(worldRad);

            // Apply weapon mount position with additional forward offset to clear ship hull
            const forwardOffset = shipSize * 1.5; // 150% of ship size forward - prevents stuck torpedoes
            const totalX = this.position.x;
            const totalY = this.position.y - forwardOffset; // Negative Y = forward

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
