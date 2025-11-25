/**
 * Star Sea - Laser Torpedo Entity
 * Commonwealth torpedo with shield penetration
 */

class LaserTorpedo extends TorpedoProjectile {
    constructor(config) {
        super(config);
        this.type = 'laser_torpedo';
        this.shieldPenetration = config.shieldPenetration !== undefined ? config.shieldPenetration : true;
        this.color = '#00aa00'; // Green for Commonwealth
        this.radius = 4;
    }

    /**
     * Handle collision with target
     */
    onHit(target) {
        if (!target || !target.active) return;

        // Laser torpedo penetrates shields
        if (this.shieldPenetration && target.shields && target.shields.isUp()) {
            // Bypass shields, apply damage directly
            if (target.takeDamage) {
                target.takeDamage(this.damage, 'torpedo');
            }
        } else {
            // Normal collision handling
            super.onHit(target);
        }

        // Mark as hit and destroy
        this.markAsHit(target);
        this.explode();
    }

    render(ctx, camera) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(MathUtils.toRadians(this.rotation));

        // Draw laser torpedo with green glow
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00ff00';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw laser trail
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(-this.radius * 3, 0);
        ctx.stroke();

        ctx.restore();
    }
}

