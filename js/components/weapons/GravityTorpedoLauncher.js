/**
 * Star Sea - Gravity Torpedo Launcher Component (Dhojan)
 * 75% damage, 200px area effect (50% damage to secondary targets)
 */

class GravityTorpedoLauncher extends TorpedoLauncher {
    constructor(config) {
        super(config);
        // 75% damage
        this.damage = (config.damage || CONFIG.TORPEDO_DAMAGE) * 0.75;
        this.areaEffectRadius = 200; // 200 pixels area effect
    }

    fire(ship, targetX, targetY, currentTime, lockOnTarget = null) {
        if (!this.canFire(currentTime)) {
            return null;
        }

        this.loaded--;
        this.lastFireTime = currentTime;

        // Start reload timer when we fire a torpedo and have stored ammo
        if (this.stored > 0 && !this.isReloading) {
            this.reloadStartTime = currentTime;
            this.isReloading = true;
        }

        // Calculate firing point offset from ship center
        const firingPoint = this.calculateFiringPoint(ship);

        // Create gravity torpedo with modified stats
        const torpedo = new GravityTorpedo({
            x: firingPoint.x,
            y: firingPoint.y,
            rotation: ship.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: this.damage, // 75% damage
            blastRadius: this.blastRadius,
            speed: this.speed,
            lifetime: this.lifetime,
            sourceShip: ship,
            lockOnTarget: lockOnTarget,
            areaEffectRadius: this.areaEffectRadius, // 200px area effect
            areaEffectDamage: this.damage * 0.5, // 50% damage to secondary targets
            trackReticle: false
        });

        return torpedo;
    }
}

