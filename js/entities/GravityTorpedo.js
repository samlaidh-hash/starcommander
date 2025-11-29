/**
 * Star Sea - Gravity Torpedo Entity
 * Creates temporary gravity wells on impact
 */

class GravityTorpedo extends TorpedoProjectile {
    constructor(config) {
        super(config);
        this.type = 'gravity_torpedo';
        this.gravityWellDuration = config.gravityWellDuration || 10.0;
        this.gravityWellStrength = config.gravityWellStrength || 0.3;
        this.color = CONFIG.COLOR_GRAVITY_TORPEDO || '#0066aa';
        this.radius = 6;
    }

    explode() {
        // Create gravity well on impact
        const gravityWell = new GravityWell({
            x: this.x,
            y: this.y,
            range: 100,
            strength: this.gravityWellStrength,
            duration: this.gravityWellDuration
        });

        eventBus.emit('gravity-torpedo-exploded', {
            x: this.x,
            y: this.y,
            damage: this.damage,
            blastRadius: this.blastRadius,
            gravityWell: gravityWell,
            sourceShip: this.sourceShip
        });

        this.destroy();
    }

    render(ctx, camera) {
        if (!this.active) return;

        // Note: Camera transform already applied, use world coords directly
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(MathUtils.toRadians(this.rotation));

        // Draw gravity torpedo
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw gravity field indicator
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw trail
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(-this.radius * 2, 0);
        ctx.stroke();

        ctx.restore();
    }
}

