/**
 * Star Sea - Tractor-Repulsor Beam Weapon Component (Andromedan)
 * Continuous beam, 50% damage, maintains target's relative position (tractor effect)
 * Only works on ships of same class or smaller
 */

class TractorRepulsorBeam extends ContinuousBeam {
    constructor(config) {
        super(config);
        // 50% damage
        this.damage = (config.damage || CONFIG.BEAM_DAMAGE) * 0.5;
        this.damagePerSecond = 1.0; // 1 DPS (50% of normal 2 DPS)
        this.tractoredTarget = null; // Currently tractored ship
        this.tractorRelativeX = 0; // Relative X position to maintain
        this.tractorRelativeY = 0; // Relative Y position to maintain
    }

    startFiring(currentTime, ship, targetX, targetY) {
        if (!this.canFire(currentTime, ship)) return false;

        // Check if target is a ship and can be tractored
        const targetEntity = this.findTargetAtPosition(ship, targetX, targetY);
        if (targetEntity && targetEntity.type === 'ship' && targetEntity !== ship) {
            // Check if target is same class or smaller
            if (this.canTractorShip(ship, targetEntity)) {
                this.tractoredTarget = targetEntity;
                // Calculate relative position to maintain
                this.tractorRelativeX = targetEntity.x - ship.x;
                this.tractorRelativeY = targetEntity.y - ship.y;
            }
        }

        // Calculate and store the FIXED starting point
        this.fixedStartPoint = this.calculateFiringPoint(ship, targetX, targetY);
        this.isFiring = true;
        this.firingStartTime = currentTime;
        return true;
    }

    stopFiring(currentTime) {
        if (!this.isFiring) return;

        // Release tractored target
        this.tractoredTarget = null;
        this.tractorRelativeX = 0;
        this.tractorRelativeY = 0;

        // Calculate how long we actually fired
        this.firingDuration = currentTime - this.firingStartTime;
        this.isFiring = false;
        this.lastStopTime = currentTime;
        this.fixedStartPoint = null;
    }

    /**
     * Check if a ship can be tractored (same class or smaller)
     * Ship class order: CT < DD < CL < CA < BC < BB < DN < SD
     */
    canTractorShip(firingShip, targetShip) {
        const classOrder = { 'CT': 0, 'DD': 1, 'CL': 2, 'CA': 3, 'BC': 4, 'BB': 5, 'DN': 6, 'SD': 7 };
        const firingClass = classOrder[firingShip.shipClass] || 1;
        const targetClass = classOrder[targetShip.shipClass] || 1;
        
        // Can tractor if target is same class or smaller (lower or equal order)
        return targetClass <= firingClass;
    }

    /**
     * Find entity at target position
     */
    findTargetAtPosition(ship, targetX, targetY) {
        // This will be called from the game engine with entity list
        // For now, return null - engine will handle finding target
        return null;
    }

    /**
     * Update tractor effect - maintains target's relative position
     */
    updateTractorEffect(ship, deltaTime) {
        if (!this.isFiring || !this.tractoredTarget || !this.tractoredTarget.active) {
            this.tractoredTarget = null;
            return;
        }

        // Calculate desired position to maintain relative location
        const desiredX = ship.x + this.tractorRelativeX;
        const desiredY = ship.y + this.tractorRelativeY;

        // Apply force to move target to desired position
        const dx = desiredX - this.tractoredTarget.x;
        const dy = desiredY - this.tractoredTarget.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
            // Apply tractor force (strong enough to maintain position)
            const force = Math.min(distance * 10, 200); // Cap force
            const angle = Math.atan2(dy, dx);
            
            if (this.tractoredTarget.physicsComponent) {
                // Apply physics force
                const forceVec = planck.Vec2(
                    Math.cos(angle) * force,
                    Math.sin(angle) * force
                );
                this.tractoredTarget.physicsComponent.body.applyForce(forceVec, this.tractoredTarget.physicsComponent.body.getWorldCenter());
            } else {
                // Apply direct velocity adjustment
                this.tractoredTarget.vx = (this.tractoredTarget.vx || 0) + Math.cos(angle) * force * deltaTime;
                this.tractoredTarget.vy = (this.tractoredTarget.vy || 0) + Math.sin(angle) * force * deltaTime;
            }
        }
    }

    fire(ship, targetX, targetY, currentTime) {
        if (!this.isFiring) return null;

        // Update relative position if target moved
        if (this.tractoredTarget && this.tractoredTarget.active) {
            this.tractorRelativeX = this.tractoredTarget.x - ship.x;
            this.tractorRelativeY = this.tractoredTarget.y - ship.y;
        }

        // Use the FIXED start point
        const startPoint = this.fixedStartPoint || { x: ship.x, y: ship.y };

        const projectile = new BeamProjectile({
            x: startPoint.x,
            y: startPoint.y,
            rotation: ship.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: this.damage,
            range: this.range,
            speed: this.speed,
            sourceShip: ship,
            sourceWeapon: this
        });

        return projectile;
    }

    update(deltaTime, currentTime, ship = null) {
        super.update(deltaTime, currentTime, ship);

        // Update tractor effect while firing
        if (this.isFiring && ship) {
            this.updateTractorEffect(ship, deltaTime);
        }
    }
}

