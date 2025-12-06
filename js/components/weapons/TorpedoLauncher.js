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

        // Calculate firing point offset from ship center (pass target for edge calculation)
        const firingPoint = this.calculateFiringPoint(ship, targetX, targetY);

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
     * Uses PNG image dimensions if available for accurate offsets
     * @param {Ship} ship - The ship firing the torpedo
     * @param {number} targetX - Target X coordinate (optional, for edge calculation)
     * @param {number} targetY - Target Y coordinate (optional, for edge calculation)
     */
    calculateFiringPoint(ship, targetX = null, targetY = null) {
        // Get ship size for proper offset calculation
        const shipSize = ship.getShipSize ? ship.getShipSize() : 40;

        // Use weapon position if available
        if (this.position) {
            const worldRad = MathUtils.toRadians(ship.rotation);
            const worldCos = Math.cos(worldRad);
            const worldSin = Math.sin(worldRad);

            // If target is provided and ship has PNG, calculate edge point closest to target
            if (targetX !== null && targetY !== null && ship.hasPNGImage && ship.pngImageWidth && ship.pngImageHeight) {
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
            
            // Fallback: Calculate offset based on PNG image dimensions if available
            let clearOffset;
            const isAft = this.position.y > 0;
            
            if (ship.hasPNGImage && ship.pngImageWidth && ship.pngImageHeight) {
                // Use PNG image dimensions for accurate offset
                // Offset should be enough to clear the image edge
                const imageLength = Math.max(ship.pngImageWidth, ship.pngImageHeight);
                if (isAft) {
                    // Aft weapons: offset to clear rear edge of image
                    clearOffset = imageLength * 0.6; // 60% of image length for aft
                } else {
                    // Forward weapons: offset to clear front edge of image
                    clearOffset = imageLength * 0.5; // 50% of image length for forward
                }
            } else {
                // Fallback to generic offsets
                clearOffset = isAft 
                    ? shipSize * 2.5  // 250% for aft weapons - larger clearance needed
                    : shipSize * 1.5; // 150% for forward weapons
            }
            
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

        // Fallback: offset forward from ship center
        let offset;
        if (ship.hasPNGImage && ship.pngImageWidth && ship.pngImageHeight) {
            // Use PNG image dimensions
            const imageLength = Math.max(ship.pngImageWidth, ship.pngImageHeight);
            offset = imageLength * 0.5; // 50% of image length
        } else {
            // Generic offset
            offset = shipSize * 1.5; // 150% of ship size forward
        }
        
        const worldRad = MathUtils.toRadians(ship.rotation);

        let x = ship.x + Math.sin(worldRad) * offset;
        let y = ship.y - Math.cos(worldRad) * offset;

        // Add velocity compensation for fast-moving ships
        x += (ship.vx || 0) * 0.15;
        y += (ship.vy || 0) * 0.15;

        return { x, y };
    }
}
