/**
 * Star Sea - Asteroid Entity
 */

class Asteroid extends Entity {
    constructor(x, y, size, physicsWorld, vx = null, vy = null) {
        super(x, y);
        this.type = 'asteroid';
        this.size = size; // 'large', 'medium', 'small'
        this.physicsWorld = physicsWorld;

        // HP based on size
        const hpMap = { large: 12, medium: 8, small: 6 };
        this.maxHp = hpMap[size] || 8;
        this.hp = this.maxHp;

        // Tractor beam mass category
        const tractorMap = { large: 'DN', medium: 'BB', small: 'CL' };
        this.tractorSize = tractorMap[size] || 'BB';

        // Visuals
        this.radius = this.getRadius();
        this.vertices = this.generateVertices();
        this.rotationSpeed = MathUtils.random(-30, 30); // degrees per second

        // Physics
        this.createPhysicsBody();

        // Set initial velocity (use provided or random)
        if (vx !== null && vy !== null) {
            this.vx = vx;
            this.vy = vy;
            this.physicsComponent.setVelocity(vx, vy);
        } else {
            const speed = this.getSpeed();
            const angle = MathUtils.random(0, 360);
            const vec = MathUtils.vectorFromAngle(angle, speed);
            this.vx = vec.x;
            this.vy = vec.y;
            this.physicsComponent.setVelocity(vec.x, vec.y);
        }

        // Breaking
        this.shouldBreak = false;
        this.breakPosition = null;
        
        // Visual damage tracking
        this.damageFlashAlpha = 0; // Flash when hit
    }

    getRadius() {
        switch (this.size) {
            case 'large': return 40;
            case 'medium': return 25;
            case 'small': return 15;
            default: return 25;
        }
    }

    getSpeed() {
        switch (this.size) {
            case 'large': return CONFIG.ASTEROID_SPEED_LARGE;
            case 'medium': return CONFIG.ASTEROID_SPEED_MEDIUM;
            case 'small': return CONFIG.ASTEROID_SPEED_SMALL;
            default: return CONFIG.ASTEROID_SPEED_MEDIUM;
        }
    }

    generateVertices() {
        // Create irregular asteroid shape
        const vertices = [];
        const points = 8 + Math.floor(Math.random() * 4); // 8-11 points

        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const radiusVariation = this.radius * MathUtils.random(0.7, 1.0);
            vertices.push({
                x: Math.cos(angle) * radiusVariation,
                y: Math.sin(angle) * radiusVariation
            });
        }

        return vertices;
    }

    createPhysicsBody() {
        // Create simplified circular physics body
        const body = this.physicsWorld.createCircleBody(this.x, this.y, this.radius, {
            type: 'dynamic',
            density: 2.0,
            restitution: 0.8,
            category: this.physicsWorld.CATEGORY.ASTEROID,
            mask: 0xFFFF
        });

        this.physicsComponent = new PhysicsComponent(this, body, this.physicsWorld);
    }

    update(deltaTime) {
        // Ensure velocity persists (in case it was reset)
        const currentVel = this.physicsComponent.getVelocity();
        const speed = Math.sqrt(currentVel.x * currentVel.x + currentVel.y * currentVel.y);
        if (speed < 0.1) {
            // Velocity was lost, restore it
            const targetSpeed = this.getSpeed();
            const angle = MathUtils.random(0, 360);
            const vec = MathUtils.vectorFromAngle(angle, targetSpeed);
            this.physicsComponent.setVelocity(vec.x, vec.y);
        }

        // Sync position from physics
        this.physicsComponent.syncToEntity();

        // Rotate asteroid
        this.rotation += this.rotationSpeed * deltaTime;
        this.rotation = MathUtils.normalizeAngle(this.rotation);
        
        // Fade damage flash
        if (this.damageFlashAlpha > 0) {
            this.damageFlashAlpha = Math.max(0, this.damageFlashAlpha - deltaTime * 2); // Fade over 0.4 seconds
        }
    }

    /**
     * Take damage and split if HP reaches 0
     * @param {number} damage - Amount of damage
     * @param {object} impactPoint - {x, y} position of impact
     * @returns {Array|null} - Array of child asteroids/gravel cloud or null
     */
    takeDamage(damage, impactPoint) {
        this.hp -= damage;
        
        // Visual damage flash
        this.damageFlashAlpha = 0.8;

        if (this.hp <= 0) {
            this.breakPosition = impactPoint || { x: this.x, y: this.y };
            return this.split();
        }

        return null;
    }
    
    /**
     * Get damage percentage (0-1) for visual feedback
     */
    getDamagePercent() {
        return this.maxHp > 0 ? 1 - (this.hp / this.maxHp) : 0;
    }

    /**
     * Split asteroid into smaller pieces
     * @returns {Array} - Array of child asteroids or gravel cloud
     */
    split() {
        if (this.size === 'large') {
            // Split into 2 medium asteroids
            const fragments = [];
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy) * 1.3;

            for (let i = 0; i < 2; i++) {
                const angle = Math.random() * Math.PI * 2;
                const vx = this.vx + Math.cos(angle) * speed;
                const vy = this.vy + Math.sin(angle) * speed;
                const offsetAngle = angle + (i === 0 ? 0 : Math.PI);
                const offset = 20;

                fragments.push(new Asteroid(
                    this.breakPosition.x + Math.cos(offsetAngle) * offset,
                    this.breakPosition.y + Math.sin(offsetAngle) * offset,
                    'medium',
                    this.physicsWorld,
                    vx,
                    vy
                ));
            }

            return fragments;
        } else if (this.size === 'medium') {
            // Split into 2 small asteroids
            const fragments = [];
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy) * 1.3;

            for (let i = 0; i < 2; i++) {
                const angle = Math.random() * Math.PI * 2;
                const vx = this.vx + Math.cos(angle) * speed;
                const vy = this.vy + Math.sin(angle) * speed;
                const offsetAngle = angle + (i === 0 ? 0 : Math.PI);
                const offset = 15;

                fragments.push(new Asteroid(
                    this.breakPosition.x + Math.cos(offsetAngle) * offset,
                    this.breakPosition.y + Math.sin(offsetAngle) * offset,
                    'small',
                    this.physicsWorld,
                    vx,
                    vy
                ));
            }

            return fragments;
        } else {
            // Small asteroid - create gravel cloud
            return [new GravelCloud(
                this.breakPosition.x,
                this.breakPosition.y,
                this.vx,
                this.vy
            )];
        }
    }

    /**
     * Break asteroid into smaller pieces (legacy method for compatibility)
     * Now uses split() method internally
     */
    break() {
        if (!this.breakPosition) {
            this.breakPosition = { x: this.x, y: this.y };
        }

        const fragments = this.split();
        this.destroy();
        return fragments;
    }

    destroy() {
        super.destroy();
        if (this.physicsComponent) {
            this.physicsComponent.destroy();
        }
    }
}
