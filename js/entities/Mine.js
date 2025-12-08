/**
 * Star Sea - Mine Entity
 */

class Mine extends Entity {
    constructor(x, y, ownerShip) {
        super(x, y);
        this.type = 'mine';
        this.ownerShip = ownerShip;
        this.damage = CONFIG.MINE_DAMAGE || 10; // 10 damage (fallback if not defined)
        this.triggerRadius = 30; // Increased from 15 to 30 pixels for better detection
        this.detectionRadius = CONFIG.MINE_DETECTION_RADIUS || 0.1; // 10% of ship detection radius
        this.armed = false;
        this.armDelay = 0.5; // 0.5 second arm delay to prevent self-triggering
        this.creationTime = performance.now() / 1000;
        this.color = '#ff4400';
        this.blinkPhase = 0;
    }

    update(deltaTime) {
        const currentTime = performance.now() / 1000;

        // Arm mine after delay
        if (!this.armed && currentTime - this.creationTime >= this.armDelay) {
            this.armed = true;
        }

        // Blink animation
        this.blinkPhase += deltaTime * 5;
    }

    /**
     * Check if ship triggers mine
     */
    checkTrigger(ship) {
        if (!this.armed) return false;
        if (ship === this.ownerShip) return false; // Don't trigger on owner

        const distance = MathUtils.distance(this.x, this.y, ship.x, ship.y);
        return distance <= this.triggerRadius;
    }

    /**
     * Is visible to ship (within detection radius)
     */
    isVisibleTo(ship) {
        if (ship === this.ownerShip) return true; // Owner always sees own mines

        // Enemies can only detect mines at close range
        const distance = MathUtils.distance(this.x, this.y, ship.x, ship.y);
        const shipDetectionRadius = this.getShipDetectionRadius(ship);
        return distance <= shipDetectionRadius * this.detectionRadius;
    }

    getShipDetectionRadius(ship) {
        switch (ship.shipClass) {
            case 'FG': return CONFIG.DETECTION_RADIUS_FG * CONFIG.SHIP_LENGTH_CA;
            case 'CL': return CONFIG.DETECTION_RADIUS_CL * CONFIG.SHIP_LENGTH_CA;
            case 'CA': return CONFIG.DETECTION_RADIUS_CA * CONFIG.SHIP_LENGTH_CA;
            case 'BC': return CONFIG.DETECTION_RADIUS_BC * CONFIG.SHIP_LENGTH_CA;
            default: return CONFIG.DETECTION_RADIUS_CA * CONFIG.SHIP_LENGTH_CA;
        }
    }

    /**
     * Detonate mine
     */
    detonate(ship) {
        // Calculate which shield quadrant was hit
        const angle = MathUtils.angleBetween(ship.x, ship.y, this.x, this.y);
        const relativeAngle = MathUtils.angleDifference(ship.rotation, angle);

        // Apply damage
        if (ship.takeDamage) {
            ship.takeDamage(this.damage, { x: this.x, y: this.y });
        }

        eventBus.emit('mine-detonated', { mine: this, ship });

        this.destroy();
    }
}
