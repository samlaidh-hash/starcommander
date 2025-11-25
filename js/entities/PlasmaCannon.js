/**
 * Star Sea - Plasma Cannon Entity
 * Dhojan area effect weapon
 */

class PlasmaCannon extends Projectile {
    constructor(config) {
        super(config);
        this.type = 'plasma_cannon';
        this.projectileType = 'area_effect';
        this.damage = config.damage || 3;
        this.blastRadius = config.blastRadius || 50;
        this.speed = config.speed || 120;
        this.sourceShip = config.sourceShip;
        this.targetX = config.targetX;
        this.targetY = config.targetY;
        this.color = '#aa00aa'; // Purple for Dhojan

        // Calculate initial velocity
        const angle = MathUtils.angleBetween(this.x, this.y, this.targetX, this.targetY);
        const vec = MathUtils.vectorFromAngle(angle, this.speed);
        this.vx = vec.x;
        this.vy = vec.y;
        this.rotation = angle;
    }

    update(deltaTime) {
        // Move projectile
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Check if reached target or lifetime expired
        const distanceToTarget = MathUtils.distance(this.x, this.y, this.targetX, this.targetY);
        if (distanceToTarget < 10) {
            this.explode();
        }

        super.update(deltaTime);
    }

    explode() {
        // Apply area damage to all entities within blast radius
        if (window.game && window.game.entities) {
            for (const entity of window.game.entities) {
                if (!entity.active) continue;
                if (entity === this.sourceShip) continue; // Don't damage self
                if (entity.type !== 'ship') continue;

                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance <= this.blastRadius) {
                    // Damage decreases with distance
                    const damageMultiplier = 1 - (distance / this.blastRadius);
                    const finalDamage = this.damage * damageMultiplier;
                    
                    if (entity.takeDamage) {
                        entity.takeDamage(finalDamage, 'area');
                    }
                }
            }
        }

        // Emit explosion event
        eventBus.emit('plasma-cannon-exploded', {
            x: this.x,
            y: this.y,
            blastRadius: this.blastRadius,
            damage: this.damage,
            sourceShip: this.sourceShip
        });

        this.destroy();
    }

    render(ctx, camera) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(MathUtils.toRadians(this.rotation));

        // Draw plasma cannon projectile
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff00ff';
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();

        // Draw plasma trail
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-7, 0);
        ctx.lineTo(-14, 0);
        ctx.stroke();

        ctx.restore();
    }
}

