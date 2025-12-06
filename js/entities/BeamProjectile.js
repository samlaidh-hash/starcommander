/**
 * Star Sea - Beam Projectile Entity
 * Fast, short-range beam weapon for shuttles and fighters
 */

class BeamProjectile extends Projectile {
    constructor(config) {
        super(config);
        // Don't override this.type - keep 'projectile' from parent so collision detection works
        this.projectileType = 'beam';
        this.damage = config.damage || 1;
        this.range = config.range || 100;
        this.speed = config.speed || CONFIG.BEAM_SPEED;
        this.lifetime = CONFIG.BEAM_LIFETIME; // Fixed lifetime for beam persistence

        // Set color based on faction
        if (config.sourceShip && config.sourceShip.faction === 'SCINTILIAN') {
            this.color = CONFIG.COLOR_BEAM_SCINTILIAN;
        } else {
            this.color = CONFIG.COLOR_BEAM_PROJECTILE;
        }

        this.width = 2;
        this.length = 8;

        // Store firing point (beam origin - moves with ship via weapon position calculation)
        this.firingPointX = this.x;
        this.firingPointY = this.y;

        // Store target position (beam endpoint - doesn't move)
        this.targetX = config.targetX;
        this.targetY = config.targetY;

        // Store reference to source ship and weapon for moving origin point
        this.sourceShip = config.sourceShip;
        this.sourceWeapon = config.sourceWeapon;

        // Calculate velocity toward target
        if (config.targetX !== undefined && config.targetY !== undefined) {
            const angle = MathUtils.angleBetween(this.x, this.y, config.targetX, config.targetY);
            const vec = MathUtils.vectorFromAngle(angle, this.speed);
            this.vx = vec.x;
            this.vy = vec.y;
            this.rotation = angle;
        }
    }

    update(deltaTime) {
        // Update last position BEFORE moving (for obstacle path checking)
        this.lastX = this.x;
        this.lastY = this.y;
        
        // Move the beam
        this.transform.updatePosition(deltaTime);
        
        // Sync transform position to entity position
        this.x = this.transform.x;
        this.y = this.transform.y;

        // Call parent for lifetime check
        super.update(deltaTime);
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

        // Note: Camera transform is already applied by Renderer, so use world coords directly
        ctx.save();

        if (this.isPlasmaBeam) {
            // Plasma beam: tight and bright near source, diffuses as it travels
            const beamLength = MathUtils.distance(startX, startY, this.targetX, this.targetY);

            // Create gradient from source to target
            const gradient = ctx.createLinearGradient(startX, startY, this.targetX, this.targetY);

            // Near source: tight and bright
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(0.3, this.color);
            // Far from source: diffused and dimmer
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0.2)');

            // Draw outer glow (widens with distance)
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = this.width * 6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(this.targetX, this.targetY);
            ctx.stroke();

            // Draw middle layer
            ctx.globalAlpha = 0.7;
            ctx.lineWidth = this.width * 3;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(this.targetX, this.targetY);
            ctx.stroke();

            // Draw bright white core (only bright near source)
            const coreGradient = ctx.createLinearGradient(startX, startY, this.targetX, this.targetY);
            coreGradient.addColorStop(0, '#ffffff');
            coreGradient.addColorStop(0.4, this.color);
            coreGradient.addColorStop(1, 'rgba(0, 255, 136, 0.1)');

            ctx.strokeStyle = coreGradient;
            ctx.globalAlpha = 1.0;
            ctx.lineWidth = this.width * 0.8;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(this.targetX, this.targetY);
            ctx.stroke();
        } else {
            // Standard beam with clear core/edge distinction
            // Draw outer glow (wide, semi-transparent)
            ctx.strokeStyle = this.color;
            ctx.globalAlpha = 0.2;
            ctx.lineWidth = this.width * 4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(this.targetX, this.targetY);
            ctx.stroke();

            // Draw middle layer (medium, more opaque)
            ctx.globalAlpha = 0.6;
            ctx.lineWidth = this.width * 2;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(this.targetX, this.targetY);
            ctx.stroke();

            // Draw bright white core
            ctx.strokeStyle = '#ffffff';
            ctx.globalAlpha = 1.0;
            ctx.lineWidth = this.width * 0.5;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(this.targetX, this.targetY);
            ctx.stroke();
        }

        ctx.restore();
    }
}

