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
        this.burstDuration = CONFIG.DISRUPTOR_BURST_DURATION; // 1 second
        this.cooldown = CONFIG.DISRUPTOR_COOLDOWN; // 2 seconds between bursts
        this.lastFireTime = 0;
        this.isBursting = false;
        this.burstStartTime = 0;
        this.shotsFiredInBurst = 0;
    }

    canFire(currentTime) {
        if (!this.isOperational()) return false;
        // Can fire if not in cooldown
        return currentTime - this.lastFireTime >= this.cooldown;
    }

    fire(ship, targetX, targetY, currentTime) {
        if (!this.canFire(currentTime)) return null;

        // Start burst
        this.isBursting = true;
        this.burstStartTime = currentTime;
        this.shotsFiredInBurst = 0;
        this.lastFireTime = currentTime;

        return null; // Burst shots are handled in update()
    }

    update(deltaTime, currentTime) {
        // Call parent auto-repair
        super.update(deltaTime, currentTime);

        // Handle burst firing
        if (this.isBursting) {
            const timeSinceBurstStart = currentTime - this.burstStartTime;

            // Check if burst is complete
            if (this.shotsFiredInBurst >= this.burstCount) {
                this.isBursting = false;
            } else if (timeSinceBurstStart >= this.burstDuration) {
                // Burst duration exceeded but not all shots fired - complete burst anyway
                this.isBursting = false;
            }
        }

        // Ensure cooldown is respected - don't allow bursting during cooldown
        if (this.isBursting && !this.canFire(currentTime)) {
            // Cooldown started while bursting (shouldn't happen, but safety check)
            // Only stop if burst is complete (all shots fired)
            if (this.shotsFiredInBurst >= this.burstCount) {
                this.isBursting = false;
            }
        }
    }

    /**
     * Get next shot time in current burst
     * Returns null if no shot should be fired
     */
    getNextBurstShot(ship, targetX, targetY, currentTime) {
        if (!this.isBursting) return null;

        const timeSinceBurstStart = currentTime - this.burstStartTime;
        const shotInterval = this.burstDuration / this.burstCount; // ~0.333 seconds between shots

        // Check if it's time for next shot
        const expectedShotTime = this.shotsFiredInBurst * shotInterval;
        if (timeSinceBurstStart >= expectedShotTime) {
            this.shotsFiredInBurst++;

            // Validate weapon position
            if (!this.position || typeof this.position.x !== 'number' || typeof this.position.y !== 'number' ||
                isNaN(this.position.x) || isNaN(this.position.y)) {
                console.warn('⚠️ Disruptor: Invalid weapon position:', this.position, 'weapon:', this.name);
                return null; // Can't fire without valid position
            }
            
            // Validate ship position
            if (typeof ship.x !== 'number' || typeof ship.y !== 'number' ||
                isNaN(ship.x) || isNaN(ship.y)) {
                console.warn('⚠️ Disruptor: Invalid ship position:', { x: ship.x, y: ship.y });
                return null; // Can't fire without valid ship position
            }
            
            // Calculate firing position (from weapon mount point)
            const mountPoint = MathUtils.rotatePoint(
                this.position.x,
                this.position.y,
                ship.rotation
            );

            const fireX = ship.x + mountPoint.x;
            const fireY = ship.y + mountPoint.y;
            
            // Validate firing position
            if (isNaN(fireX) || isNaN(fireY)) {
                console.warn('⚠️ Disruptor: NaN firing position calculated:', {
                    weaponPos: this.position,
                    shipPos: { x: ship.x, y: ship.y },
                    mountPoint,
                    fireX, fireY
                });
                return null; // Can't create projectile with invalid position
            }

            // Calculate angle to target
            const angle = MathUtils.angleBetween(fireX, fireY, targetX, targetY);

            // Create disruptor projectile (wave effect)
            return new DisruptorProjectile({
                x: fireX,
                y: fireY,
                rotation: angle,
                damage: this.damage,
                range: this.range,
                speed: this.speed,
                sourceShip: ship
            });
        }

        return null;
    }

    getCooldownPercentage(currentTime) {
        const timeSinceLastFire = currentTime - this.lastFireTime;
        return Math.min(timeSinceLastFire / this.cooldown, 1);
    }
}
