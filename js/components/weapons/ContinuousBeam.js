/**
 * Star Sea - Continuous Beam Weapon Component
 * Fires continuous beam for up to 3 seconds, DYNAMIC cooldown = firing duration
 * Damage: 1 per 0.5 seconds on target (2 DPS)
 *
 * DYNAMIC COOLDOWN: Cooldown time equals how long you fired
 * - Fire 1 sec = 1 sec cooldown
 * - Fire 3 sec = 3 sec cooldown
 *
 * FIXED START POINT: The beam originates from a fixed point on the weapon arc
 * (calculated when LMB is first pressed) and the endpoint follows the reticle.
 */

class ContinuousBeam extends BeamWeapon {
    constructor(config) {
        super(config);
        this.maxFiringDuration = 5; // seconds (increased from 3)
        this.damagePerSecond = 2; // 2 DPS (1 damage per 0.5s)
        this.damage = config.damage || CONFIG.BEAM_DAMAGE; // 1 damage per beam hit
        this.isFiring = false;
        this.firingStartTime = 0;
        this.firingDuration = 0; // Track how long we fired (DYNAMIC COOLDOWN = fire duration, max 5s)
        this.lastStopTime = 0;
        this.fixedStartPoint = null; // FIXED START POINT - calculated once when firing starts
        this.energyDrainRate = 8; // Energy per second while firing
    }

    canFire(currentTime, ship = null) {
        if (!super.canFire()) return false;

        // Apply crew skill tactical bonus to recharge (faster recharge)
        let effectiveRecharge = this.firingDuration; // DYNAMIC: Cooldown = firing duration
        if (ship && ship.crewSkills) {
            const bonuses = ship.crewSkills.getTacticalBonuses();
            effectiveRecharge = this.firingDuration / bonuses.rechargeMult;
        }

        // Check if still recharging
        if (this.lastStopTime > 0 && currentTime - this.lastStopTime < effectiveRecharge) {
            return false;
        }

        return true;
    }

    startFiring(currentTime, ship, targetX, targetY) {
        if (!this.canFire(currentTime, ship)) return false;

        // Calculate and store the FIXED starting point on the weapon arc
        // This point will NOT change for the duration of this firing session
        this.fixedStartPoint = this.calculateFiringPoint(ship, targetX, targetY);

        this.isFiring = true;
        this.firingStartTime = currentTime;
        return true;
    }

    stopFiring(currentTime) {
        if (!this.isFiring) return;

        // Calculate how long we actually fired (DYNAMIC COOLDOWN)
        this.firingDuration = currentTime - this.firingStartTime;

        this.isFiring = false;
        this.lastStopTime = currentTime;
        this.fixedStartPoint = null; // Clear fixed start point
    }

    fire(ship, targetX, targetY, currentTime) {
        if (!this.isFiring) return null;

        // Use the FIXED start point, NOT recalculated position
        // The endpoint (targetX, targetY) follows the reticle each frame
        const startPoint = this.fixedStartPoint || { x: ship.x, y: ship.y };

        return new BeamProjectile({
            x: startPoint.x,  // FIXED START POINT
            y: startPoint.y,  // FIXED START POINT
            rotation: ship.rotation,
            targetX: targetX, // FOLLOWS RETICLE
            targetY: targetY, // FOLLOWS RETICLE
            damage: this.damage,
            range: this.range,
            speed: this.speed,
            sourceShip: ship,
            sourceWeapon: this
        });
    }

    update(deltaTime, currentTime, ship = null) {
        super.update(deltaTime, currentTime);

        // Drain energy while firing
        if (this.isFiring && ship && ship.energy) {
            const energyDrained = ship.energy.drainEnergy(deltaTime * this.energyDrainRate, 0);
            // Stop firing if out of energy
            if (ship.energy.getTotalEnergy() <= 0) {
                this.stopFiring(currentTime);
            }
        }

        // Auto-stop firing after max duration
        if (this.isFiring) {
            const firingDuration = currentTime - this.firingStartTime;
            if (firingDuration >= this.maxFiringDuration) {
                this.stopFiring(currentTime);
            }
        }
    }

    getRechargePercentage(currentTime) {
        if (this.lastStopTime === 0) return 1;
        if (this.firingDuration === 0) return 1; // No previous firing
        const timeSinceStop = currentTime - this.lastStopTime;
        return Math.min(timeSinceStop / this.firingDuration, 1);
    }

    isRecharging(currentTime) {
        if (this.lastStopTime === 0) return false;
        if (this.firingDuration === 0) return false; // No previous firing
        return currentTime - this.lastStopTime < this.firingDuration;
    }
}
