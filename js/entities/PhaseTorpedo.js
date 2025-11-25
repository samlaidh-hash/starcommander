/**
 * Star Sea - Phase Torpedo Entity
 * Andromedan weapon that phases through shields and hull
 */

class PhaseTorpedo extends TorpedoProjectile {
    constructor(config) {
        super(config);
        this.type = 'phase_torpedo';
        this.shieldPenetration = config.shieldPenetration !== undefined ? config.shieldPenetration : true;
        this.hullPenetration = config.hullPenetration !== undefined ? config.hullPenetration : true;
        this.color = '#00aaff'; // Cyan for Andromedan
        this.radius = 5;
        this.phaseOffset = 0; // For phase animation
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Update phase animation
        this.phaseOffset = (this.phaseOffset || 0) + deltaTime * 10;
    }

    /**
     * Handle collision with target
     */
    onHit(target) {
        if (!target || !target.active) return;

        // Phase torpedo penetrates both shields and hull
        if (this.shieldPenetration && target.shields && target.shields.isUp()) {
            // Bypass shields
        }

        // Apply damage (bypasses shields)
        if (target.takeDamage) {
            target.takeDamage(this.damage, 'torpedo');
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

        // Phase torpedo with phase effect (flickering)
        const alpha = 0.5 + 0.5 * Math.sin(this.phaseOffset || 0);
        ctx.globalAlpha = alpha;
        
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw phase trail
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.globalAlpha = alpha * 0.6;
        ctx.beginPath();
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(-this.radius * 3, 0);
        ctx.stroke();

        ctx.globalAlpha = 1.0;
        ctx.restore();
    }
}

