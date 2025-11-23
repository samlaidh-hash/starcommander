/**
 * Star Sea - Base Projectile Entity
 */

class Projectile extends Entity {
    constructor(config) {
        super(config.x, config.y);
        this.type = 'projectile';
        this.projectileType = config.projectileType || 'beam';
        this.damage = config.damage || 1;
        this.sourceShip = config.sourceShip;
        this.lifetime = config.lifetime || 2;
        this.creationTime = performance.now() / 1000;
        this.hitTargets = new Set(); // Track what we've hit (for penetration/multi-hit logic)
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Check lifetime
        const currentTime = performance.now() / 1000;
        if (currentTime - this.creationTime >= this.lifetime) {
            this.destroy();
        }
    }

    hasHit(entity) {
        return this.hitTargets.has(entity.id);
    }

    markAsHit(entity) {
        this.hitTargets.add(entity.id);
    }
}


/**
 * Torpedo Projectile - Slower, homing capability
 */
class TorpedoProjectile extends Projectile {
    constructor(config) {
        super(config);
        this.projectileType = 'torpedo';
        this.speed = config.speed || CONFIG.TORPEDO_SPEED_CA;
        this.blastRadius = config.blastRadius;
        this.lifetime = config.lifetime || CONFIG.TORPEDO_LIFETIME;
        this.lockOnTarget = config.lockOnTarget; // Fire-and-forget target
        this.targetX = config.targetX;
        this.targetY = config.targetY;
        this.trackReticle = config.trackReticle || false; // Continuously track reticle position
        this.color = CONFIG.COLOR_TORPEDO;
        this.terminalHoming = false; // True after halfway point

        // Anti-torpedo defense tracking
        this.beamHitCount = 0; // Number of beam hits received
        this.hitsToDestroy = 1; // Standard torpedoes destroyed in 1 hit

        // Calculate initial velocity
        const angle = MathUtils.angleBetween(this.x, this.y, this.targetX, this.targetY);
        const vec = MathUtils.vectorFromAngle(angle, this.speed);
        this.vx = vec.x;
        this.vy = vec.y;
        this.rotation = angle;

        // Track distance to target at creation
        this.initialDistance = this.lockOnTarget ?
            MathUtils.distance(this.x, this.y, this.lockOnTarget.x, this.lockOnTarget.y) :
            MathUtils.distance(this.x, this.y, this.targetX, this.targetY);
    }

    update(deltaTime) {
        // Lock-on target mode - home towards entity
        if (this.lockOnTarget && this.lockOnTarget.active) {
            // Homing behavior
            const distanceToTarget = MathUtils.distance(this.x, this.y, this.lockOnTarget.x, this.lockOnTarget.y);

            // Check if past halfway point (terminal homing)
            if (distanceToTarget < this.initialDistance / 2) {
                this.terminalHoming = true;
            }

            // Check if target is within 90° forward arc
            const targetAngle = MathUtils.angleBetween(this.x, this.y, this.lockOnTarget.x, this.lockOnTarget.y);
            const angleDiff = Math.abs(MathUtils.normalizeAngle(targetAngle - this.rotation));
            const inArc = angleDiff <= 45 || angleDiff >= 315; // 90° forward arc (45° each side)

            // Home in on target if locked and in arc (or in terminal phase)
            if ((this.lockOnTarget && inArc) || this.terminalHoming) {
                const vec = MathUtils.vectorFromAngle(targetAngle, this.speed);
                this.vx = vec.x;
                this.vy = vec.y;
                this.rotation = targetAngle;
            } else if (this.lockOnTarget && !inArc && !this.terminalHoming) {
                // Lose lock if outside arc (unless in terminal phase)
                this.lockOnTarget = null;
            }
        }

        // Move torpedo
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        super.update(deltaTime);
    }

    /**
     * Get all entities in blast radius
     */
    getEntitiesInBlast(entities) {
        const entitiesHit = [];
        for (const entity of entities) {
            if (!entity.active) continue;
            if (entity === this.sourceShip) continue; // Don't hit source

            const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
            if (distance <= this.blastRadius) {
                entitiesHit.push(entity);
            }
        }
        return entitiesHit;
    }

    render(ctx, camera) {
        if (!this.active) return;

        // Note: Camera transform already applied, use world coords directly
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(MathUtils.toRadians(this.rotation));

        // Draw torpedo body with glow
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw torpedo trail
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 12);
        ctx.stroke();

        // Draw directional indicator
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(-3, -4);
        ctx.lineTo(3, -4);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    }
}

/**
 * Disruptor Projectile - Trigon faction weapon
 * Wave effect moving at 2x torpedo speed, 2 damage, no lock-on
 */
class DisruptorProjectile extends Projectile {
    constructor(config) {
        super(config);
        this.projectileType = 'disruptor';
        this.range = config.range || CONFIG.BEAM_RANGE_PIXELS;
        this.speed = config.speed || CONFIG.DISRUPTOR_SPEED; // 2x torpedo speed
        this.rotation = config.rotation || 0;
        this.startX = config.x;
        this.startY = config.y;
        this.color = CONFIG.COLOR_DISRUPTOR; // Magenta wave effect
        this.lifetime = 2; // 2 seconds max

        // Calculate velocity (straight line, no homing)
        const angle = this.rotation;
        const vec = MathUtils.vectorFromAngle(angle, this.speed);
        this.vx = vec.x;
        this.vy = vec.y;
    }

    update(deltaTime) {
        // Move disruptor
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Check if exceeded range
        const distanceTraveled = MathUtils.distance(this.startX, this.startY, this.x, this.y);
        if (distanceTraveled >= this.range) {
            this.destroy();
            return;
        }

        super.update(deltaTime);
    }

    render(ctx, camera) {
        if (!this.active) return;

        // Note: Camera transform already applied, use world coords directly
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(MathUtils.toRadians(this.rotation));

        // Draw glowing blue bolt with strong glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;

        // Draw elongated bolt shape
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw bright core
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#aaccff';
        ctx.beginPath();
        ctx.ellipse(0, 0, 5, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw energy trail
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(-6, 0, 4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.restore();
    }
}

/**
 * Plasma Torpedo Projectile - Scintilian faction weapon
 * DP (Damage Potential) system with degrading blast radius
 */
class PlasmaTorpedoProjectile extends Projectile {
    constructor(config) {
        super(config);
        this.projectileType = 'plasma';
        this.speed = config.speed || CONFIG.PLASMA_SPEED_CA; // 2/3 of normal torpedo speed
        this.lifetime = config.lifetime || CONFIG.TORPEDO_LIFETIME;
        this.lockOnTarget = config.lockOnTarget; // Fire-and-forget target
        this.targetX = config.targetX;
        this.targetY = config.targetY;
        this.trackReticle = config.trackReticle || false; // Continuously track reticle position
        this.color = CONFIG.COLOR_PLASMA; // Green
        this.terminalHoming = false;

        // Damage Potential (DP) system
        this.damagePotential = config.damagePotential || CONFIG.PLASMA_DAMAGE_POTENTIAL; // Use charged damage if provided
        this.dpDecayRate = CONFIG.PLASMA_DP_DECAY_PER_SECOND; // DP lost per second of movement
        this.dpDecayPerHit = 5; // DP lost per beam hit (anti-torpedo defense)

        // Calculate initial velocity
        const angle = MathUtils.angleBetween(this.x, this.y, this.targetX, this.targetY);
        const vec = MathUtils.vectorFromAngle(angle, this.speed);
        this.vx = vec.x;
        this.vy = vec.y;
        this.rotation = angle;

        // Track distance to target at creation
        this.initialDistance = this.lockOnTarget ?
            MathUtils.distance(this.x, this.y, this.lockOnTarget.x, this.lockOnTarget.y) :
            MathUtils.distance(this.x, this.y, this.targetX, this.targetY);
    }

    update(deltaTime) {
        // Degrade DP over time
        this.damagePotential = Math.max(10, this.damagePotential - (this.dpDecayRate * deltaTime));

        // Lock-on target mode - home towards entity
        if (this.lockOnTarget && this.lockOnTarget.active) {
            const distanceToTarget = MathUtils.distance(this.x, this.y, this.lockOnTarget.x, this.lockOnTarget.y);

            if (distanceToTarget < this.initialDistance / 2) {
                this.terminalHoming = true;
            }

            if (this.lockOnTarget || this.terminalHoming) {
                const targetAngle = MathUtils.angleBetween(this.x, this.y, this.lockOnTarget.x, this.lockOnTarget.y);
                const vec = MathUtils.vectorFromAngle(targetAngle, this.speed);
                this.vx = vec.x;
                this.vy = vec.y;
                this.rotation = targetAngle;
            }
        }

        // Move plasma torpedo
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        super.update(deltaTime);
    }

    /**
     * Reduce DP when hit by weapons
     */
    takeDamage(damage) {
        this.damagePotential = Math.max(10, this.damagePotential - damage);
    }

    /**
     * Calculate blast radius based on DP and target size
     * At 30 DP: 150% of target longest dimension
     * At 10 DP: 50% of target longest dimension
     * Formula: Radius = (Target longest dimension) × (0.50 + (DP × 0.05))
     */
    getBlastRadius(target) {
        const targetSize = target.getShipSize ? target.getShipSize() : (target.radius || 50);
        const multiplier = 0.50 + (this.damagePotential * 0.05);
        return targetSize * multiplier;
    }

    /**
     * Get all entities in blast radius
     */
    getEntitiesInBlast(entities, hitTarget) {
        const blastRadius = this.getBlastRadius(hitTarget);
        const entitiesHit = [];

        for (const entity of entities) {
            if (!entity.active) continue;
            if (entity === this.sourceShip) continue; // Don't hit source

            const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
            if (distance <= blastRadius) {
                entitiesHit.push(entity);
            }
        }

        return entitiesHit;
    }

    /**
     * Render plasma torpedo with expanding/dimming effect
     */
    render(ctx, camera) {
        if (!this.active) return;

        // Calculate age and expansion
        const currentTime = performance.now() / 1000;
        const age = currentTime - this.creationTime;
        const agePercent = age / this.lifetime; // 0 to 1

        // Size expands over lifetime (starts at 2px, grows to 12px)
        const minSize = 2;
        const maxSize = 12;
        const size = minSize + (maxSize - minSize) * agePercent;

        // Brightness based on damage potential (higher DP = brighter)
        const dpPercent = (this.damagePotential - 10) / 20; // Normalize 10-30 to 0-1
        const baseBrightness = 0.4 + (dpPercent * 0.6); // 0.4 to 1.0

        // Dim as it ages (bright at start, dim at end)
        const ageDimming = 1.0 - (agePercent * 0.6); // 1.0 to 0.4
        const brightness = baseBrightness * ageDimming;

        // Note: Camera transform already applied, use world coords directly
        ctx.save();
        ctx.translate(this.x, this.y);

        // Outer glow (large, very transparent)
        ctx.globalAlpha = brightness * 0.2;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = size * 2;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Middle layer
        ctx.globalAlpha = brightness * 0.6;
        ctx.shadowBlur = size;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();

        // Bright core (white center, gets smaller relative to size as it expands)
        ctx.globalAlpha = brightness;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = size * 0.5;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.restore();
    }
}
