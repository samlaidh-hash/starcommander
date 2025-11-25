/**
 * Star Sea - Phase Beam Entity
 * Andromedan beam weapon that ignores shields
 */

class PhaseBeam extends BeamProjectile {
    constructor(config) {
        super(config);
        this.projectileType = 'phase_beam';
        this.shieldPenetration = config.shieldPenetration !== undefined ? config.shieldPenetration : true;
        this.color = '#00aaff'; // Cyan for Andromedan
        this.width = 2.5;
        this.phaseOffset = 0; // For phase animation
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Update phase animation
        this.phaseOffset = (this.phaseOffset || 0) + deltaTime * 8;
    }

    /**
     * Handle collision with target
     */
    onHit(target) {
        if (!target || !target.active) return;

        // Phase beam penetrates shields
        if (this.shieldPenetration && target.shields && target.shields.isUp()) {
            // Bypass shields, apply damage directly
            if (target.takeDamage) {
                target.takeDamage(this.damage, 'beam');
            }
        } else {
            // Normal collision handling
            if (target.takeDamage) {
                target.takeDamage(this.damage, 'beam');
            }
        }

        // Mark as hit and destroy
        this.markAsHit(target);
        this.destroy();
    }

    render(ctx, camera) {
        if (!this.active) return;

        // Recalculate firing point from weapon band (moves with ship)
        let startX = this.firingPointX;
        let startY = this.firingPointY;

        if (this.sourceShip && this.sourceWeapon) {
            const firingPoint = this.sourceWeapon.calculateFiringPoint(this.sourceShip, this.targetX, this.targetY);
            startX = firingPoint.x;
            startY = firingPoint.y;
        }

        ctx.save();

        // Phase beam with phase effect (flickering cyan)
        const alpha = 0.6 + 0.4 * Math.sin(this.phaseOffset || 0);

        // Draw outer glow
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = alpha * 0.3;
        ctx.lineWidth = this.width * 4;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();

        // Draw middle layer
        ctx.globalAlpha = alpha * 0.7;
        ctx.lineWidth = this.width * 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();

        // Draw bright cyan core
        ctx.strokeStyle = '#00ffff';
        ctx.globalAlpha = alpha;
        ctx.lineWidth = this.width * 0.8;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();

        ctx.restore();
    }
}

