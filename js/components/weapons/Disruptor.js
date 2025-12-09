/**
 * Star Sea - Disruptor Weapon (Trigon faction)
 *
 * ORIGINAL SPEC:
 * - Firing Arc: 120° forward arc
 * - Recharge Time: 2 seconds between shots (continuous fire)
 * - Damage: 2 dmg/hit
 * - Visual: Wave effect moving at 2x torpedo speed
 * - Lock-On: No lock-on capability
 */

class Disruptor extends Weapon {
    constructor(config) {
        super(config);
        this.range = config.range || CONFIG.BEAM_RANGE_PIXELS;
        this.speed = CONFIG.DISRUPTOR_SPEED; // 800 pixels/sec (2x torpedo speed)
        this.damage = CONFIG.DISRUPTOR_DAMAGE; // 2 damage per shot
        this.burstCount = CONFIG.DISRUPTOR_BURST_COUNT; // 3 shots
        this.burstDuration = CONFIG.DISRUPTOR_BURST_DURATION; // 1 second (not used for simultaneous firing)
        this.cooldown = CONFIG.DISRUPTOR_COOLDOWN; // 2 seconds between bursts
        this.lastFireTime = 0;
        this.isBursting = false;
        this.burstStartTime = 0;
        this.shotsFiredInBurst = 0;
        this.fixedTargetX = null; // Store target position when LMB clicked
        this.fixedTargetY = null;
        this.burstSpacing = 60; // 60 pixels spacing between bolts along line of fire
    }

    canFire(currentTime) {
        if (!this.isOperational()) return false;
        // Can fire if not in cooldown
        return currentTime - this.lastFireTime >= this.cooldown;
    }

    fire(ship, targetX, targetY, currentTime) {
        if (!this.canFire(currentTime)) return null;

        // Store fixed target position (reticle position when clicked)
        this.fixedTargetX = targetX;
        this.fixedTargetY = targetY;
        
        // Start burst - all shots fire simultaneously
        this.isBursting = true;
        this.burstStartTime = currentTime;
        this.shotsFiredInBurst = 0;
        this.lastFireTime = currentTime;

        return null; // Burst shots are handled in getDisruptorBurstShots()
    }

    update(deltaTime, currentTime) {
        // Call parent auto-repair
        super.update(deltaTime, currentTime);

        // Handle burst firing - for simultaneous firing, burst completes immediately after shots are created
        if (this.isBursting) {
            // Burst completes after all shots are fired (handled in getAllBurstShots)
            // Reset burst state if shots have been fired
            if (this.shotsFiredInBurst >= this.burstCount) {
                this.isBursting = false;
                this.fixedTargetX = null;
                this.fixedTargetY = null;
            }
        }

        // Ensure cooldown is respected - don't allow bursting during cooldown
        if (this.isBursting && !this.canFire(currentTime)) {
            // Cooldown started while bursting (shouldn't happen, but safety check)
            // Only stop if burst is complete (all shots fired)
            if (this.shotsFiredInBurst >= this.burstCount) {
                this.isBursting = false;
                this.fixedTargetX = null;
                this.fixedTargetY = null;
            }
        }
    }

    /**
     * Get all burst shots (fired simultaneously on LMB down)
     * Returns array of projectiles or null if burst is complete
     */
    getAllBurstShots(ship, currentTime) {
        if (!this.isBursting) return null;
        
        // Use fixed target position from when LMB was clicked
        if (this.fixedTargetX === null || this.fixedTargetY === null) {
            return null; // No target stored
        }
        
        // Fire all shots simultaneously on first call, then mark burst as complete
        if (this.shotsFiredInBurst > 0) {
            // Already fired all shots, mark burst complete
            this.isBursting = false;
            return null;
        }
        
        // Mark that we've fired all shots
        this.shotsFiredInBurst = this.burstCount;
        
        // Validate weapon position
        if (!this.position || typeof this.position.x !== 'number' || typeof this.position.y !== 'number' ||
            isNaN(this.position.x) || isNaN(this.position.y)) {
            console.warn('⚠️ Disruptor: Invalid weapon position:', this.position, 'weapon:', this.name);
            this.isBursting = false;
            return null;
        }
        
        // Validate ship position
        if (typeof ship.x !== 'number' || typeof ship.y !== 'number' ||
            isNaN(ship.x) || isNaN(ship.y)) {
            console.warn('⚠️ Disruptor: Invalid ship position:', { x: ship.x, y: ship.y });
            this.isBursting = false;
            return null;
        }
        
        // Calculate firing position (from weapon mount point)
        // Rotate weapon position around ship center (0, 0) by ship rotation
        const mountPoint = MathUtils.rotatePoint(
            this.position.x,
            this.position.y,
            0,  // center x (ship center)
            0,  // center y (ship center)
            ship.rotation
        );

        const baseFireX = ship.x + mountPoint.x;
        const baseFireY = ship.y + mountPoint.y;
        
        // Validate firing position
        if (isNaN(baseFireX) || isNaN(baseFireY)) {
            console.warn('⚠️ Disruptor: NaN firing position calculated:', {
                weaponPos: this.position,
                shipPos: { x: ship.x, y: ship.y },
                mountPoint,
                fireX: baseFireX, fireY: baseFireY
            });
            this.isBursting = false;
            return null;
        }

        // Calculate angle to target
        const baseAngle = MathUtils.angleBetween(baseFireX, baseFireY, this.fixedTargetX, this.fixedTargetY);
        
        // Calculate firing direction vector (along the line of fire)
        const fireVector = MathUtils.vectorFromAngle(baseAngle, 1);
        
        // Create all 3 projectiles with 40 pixel spacing along line of fire
        const projectiles = [];
        for (let i = 0; i < this.burstCount; i++) {
            // Offset along firing line: -40, 0, +40 pixels (for 3 shots)
            const offset = (i - 1) * this.burstSpacing; // -40, 0, +40
            const offsetX = baseFireX + fireVector.x * offset;
            const offsetY = baseFireY + fireVector.y * offset;
            
            // All bolts target the same point (fixed target from click)
            const angle = MathUtils.angleBetween(offsetX, offsetY, this.fixedTargetX, this.fixedTargetY);
            
            projectiles.push(new DisruptorProjectile({
                x: offsetX,
                y: offsetY,
                rotation: angle,
                damage: this.damage,
                range: this.range,
                speed: this.speed,
                sourceShip: ship
            }));
        }
        
        return projectiles;
    }

    /**
     * Legacy method for compatibility - now redirects to getAllBurstShots
     * @deprecated Use getAllBurstShots instead
     */
    getNextBurstShot(ship, targetX, targetY, currentTime) {
        // This method is no longer used for simultaneous firing
        // But kept for compatibility
        return null;
    }

    getCooldownPercentage(currentTime) {
        const timeSinceLastFire = currentTime - this.lastFireTime;
        return Math.min(timeSinceLastFire / this.cooldown, 1);
    }
}
