/**
 * Star Sea - Quantum Torpedo Launcher Component (Commonwealth)
 * 50% more damage than normal torpedoes, 75% speed
 */

class QuantumTorpedoLauncher extends TorpedoLauncher {
    constructor(config) {
        super(config);
        // 50% more damage
        this.damage = (config.damage || CONFIG.TORPEDO_DAMAGE) * 1.5;
        // 75% speed
        this.speed = (config.speed || CONFIG.TORPEDO_SPEED_CA) * 0.75;
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

        // Create quantum torpedo with modified stats
        const torpedo = new QuantumTorpedo({
            x: firingPoint.x,
            y: firingPoint.y,
            rotation: ship.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: this.damage, // 50% more damage
            blastRadius: this.blastRadius,
            speed: this.speed, // 75% speed
            lifetime: this.lifetime,
            sourceShip: ship,
            lockOnTarget: lockOnTarget,
            trackReticle: false
        });

        return torpedo;
    }
}

