/**
 * Star Sea - Grav Beam Weapon Component (Dhojan)
 * Continuous beam, 25% damage, ignores shields/reflector shields but not power absorbers
 */

class GravBeam extends ContinuousBeam {
    constructor(config) {
        super(config);
        // 25% damage
        this.damage = (config.damage || CONFIG.BEAM_DAMAGE) * 0.25;
        this.damagePerSecond = 0.5; // 0.5 DPS (25% of normal 2 DPS)
        this.ignoresShields = true; // Ignores shields and reflector shields
        this.ignoresPowerAbsorbers = false; // Does NOT ignore power absorbers
    }

    fire(ship, targetX, targetY, currentTime) {
        if (!this.isFiring) return null;

        // Use the FIXED start point, NOT recalculated position
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
            sourceWeapon: this,
            ignoresShields: true, // Flag for engine to handle
            ignoresReflectorShields: true,
            ignoresPowerAbsorbers: false
        });

        return projectile;
    }
}

