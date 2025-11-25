/**
 * Star Sea - Laser Beam Entity
 * Commonwealth beam weapon
 */

class LaserBeam extends BeamProjectile {
    constructor(config) {
        super(config);
        this.projectileType = 'laser_beam';
        this.color = '#00aa00'; // Green for Commonwealth
        this.width = 2;
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

        // Laser beam with green glow
        // Draw outer glow
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = this.width * 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();

        // Draw middle layer
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = this.width * 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();

        // Draw bright green core
        ctx.strokeStyle = '#00ff00';
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = this.width * 0.6;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#00ff00';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();

        ctx.restore();
    }
}

