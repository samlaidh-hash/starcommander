/**
 * Star Sea - Laser Cannon Entity
 * Commonwealth continuous fire laser weapon
 */

class LaserCannon extends BeamProjectile {
    constructor(config) {
        super(config);
        this.projectileType = 'laser_cannon';
        this.color = '#00aa00'; // Green for Commonwealth
        this.width = 2.5;
        this.continuousFire = config.continuousFire || true;
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
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = this.width * 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();

        // Draw middle layer
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = this.width * 2.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();

        // Draw bright green core
        ctx.strokeStyle = '#00ff00';
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = this.width * 0.8;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#00ff00';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();

        ctx.restore();
    }
}

