/**
 * Star Sea - Particle System
 * Handles visual effects like explosions, impacts, trails, and debris
 */

class Particle {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.vx = config.vx || 0;
        this.vy = config.vy || 0;
        this.size = config.size || 2;
        this.color = config.color || '#ffffff';
        this.alpha = config.alpha || 1.0;
        this.life = config.life || 1.0;
        this.maxLife = config.life || 1.0;
        this.decay = config.decay || 0.02;
        this.glow = config.glow || false;
        this.type = config.type || 'circle';
        this.rotation = config.rotation || 0;
        this.rotationSpeed = config.rotationSpeed || 0;
    }

    update(deltaTime) {
        // Update position
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Apply drag
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Update rotation
        this.rotation += this.rotationSpeed * deltaTime;

        // Decay life
        this.life -= this.decay * deltaTime;
        this.alpha = this.life / this.maxLife;

        return this.life > 0;
    }

    render(ctx, camera) {
        const screenPos = camera.worldToScreen(this.x, this.y);

        ctx.save();
        ctx.globalAlpha = this.alpha;

        if (this.glow) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        }

        ctx.fillStyle = this.color;

        if (this.type === 'circle') {
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, this.size * camera.zoom, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'square') {
            ctx.translate(screenPos.x, screenPos.y);
            ctx.rotate(this.rotation);
            const halfSize = this.size * camera.zoom;
            ctx.fillRect(-halfSize, -halfSize, halfSize * 2, halfSize * 2);
        }

        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 1000; // Reduced from 2000 for better performance
        this.screenShake = { x: 0, y: 0, intensity: 0, duration: 0 };
    }

    /**
     * Update all particles
     */
    update(deltaTime) {
        // Update particles
        this.particles = this.particles.filter(p => p.update(deltaTime));

        // Update screen shake
        if (this.screenShake.duration > 0) {
            this.screenShake.duration -= deltaTime;
            if (this.screenShake.duration <= 0) {
                this.screenShake.x = 0;
                this.screenShake.y = 0;
                this.screenShake.intensity = 0;
            } else {
                // Random shake based on intensity
                const intensity = this.screenShake.intensity * (this.screenShake.duration / 0.3);
                this.screenShake.x = (Math.random() - 0.5) * intensity;
                this.screenShake.y = (Math.random() - 0.5) * intensity;
            }
        }
    }

    /**
     * Render all particles
     */
    render(ctx, camera) {
        this.particles.forEach(p => p.render(ctx, camera));
    }

    /**
     * Create explosion effect
     */
    createExplosion(x, y, config = {}) {
        const particleCount = config.particleCount || 30;
        const size = config.size || 1.0;
        const color = config.color || '#ff6600';
        const speed = config.speed || 100;

        // Main explosion particles
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
            const velocity = speed * (0.5 + Math.random() * 0.5);

            this.addParticle(new Particle({
                x, y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: (2 + Math.random() * 3) * size,
                color: i % 3 === 0 ? '#ffaa00' : (i % 3 === 1 ? color : '#ff3300'),
                life: 0.5 + Math.random() * 0.5,
                decay: 0.8 + Math.random() * 0.4,
                glow: true,
                type: 'circle'
            }));
        }

        // Debris particles
        for (let i = 0; i < particleCount / 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = speed * 0.3 * Math.random();

            this.addParticle(new Particle({
                x, y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: (1 + Math.random() * 2) * size,
                color: '#666666',
                life: 1.0 + Math.random() * 0.5,
                decay: 0.3 + Math.random() * 0.2,
                glow: false,
                type: Math.random() > 0.5 ? 'circle' : 'square',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 5
            }));
        }

        // Central flash
        this.addParticle(new Particle({
            x, y,
            vx: 0, vy: 0,
            size: 20 * size,
            color: '#ffffff',
            life: 0.2,
            decay: 5,
            glow: true,
            type: 'circle'
        }));

        // Screen shake
        this.addScreenShake(10 * size, 0.3);
    }

    /**
     * Create impact effect (for weapon hits)
     */
    createImpact(x, y, angle, config = {}) {
        const particleCount = config.particleCount || 10;
        const color = config.color || '#00aaff';
        const size = config.size || 1.0;

        // Impact sparks in cone shape
        for (let i = 0; i < particleCount; i++) {
            const spreadAngle = angle + (Math.random() - 0.5) * Math.PI * 0.5;
            const velocity = 50 + Math.random() * 100;

            this.addParticle(new Particle({
                x, y,
                vx: Math.cos(spreadAngle) * velocity,
                vy: Math.sin(spreadAngle) * velocity,
                size: (1 + Math.random() * 2) * size,
                color: color,
                life: 0.3 + Math.random() * 0.3,
                decay: 1.5 + Math.random() * 0.5,
                glow: true,
                type: 'circle'
            }));
        }

        // Impact flash
        this.addParticle(new Particle({
            x, y,
            vx: 0, vy: 0,
            size: 8 * size,
            color: '#ffffff',
            life: 0.1,
            decay: 10,
            glow: true,
            type: 'circle'
        }));
    }

    /**
     * Create engine trail
     */
    createEngineTrail(x, y, angle, config = {}) {
        const color = config.color || '#4488ff';
        const size = config.size || 1.0;
        const intensity = config.intensity || 1.0;

        // Trail particles
        const particleCount = Math.floor(2 * intensity);
        for (let i = 0; i < particleCount; i++) {
            const spread = (Math.random() - 0.5) * 0.3;
            const backwardSpeed = -30 * intensity;

            this.addParticle(new Particle({
                x: x + (Math.random() - 0.5) * 5,
                y: y + (Math.random() - 0.5) * 5,
                vx: Math.cos(angle + spread) * backwardSpeed,
                vy: Math.sin(angle + spread) * backwardSpeed,
                size: (1 + Math.random()) * size,
                color: color,
                life: 0.3 + Math.random() * 0.2,
                decay: 2 + Math.random(),
                glow: true,
                type: 'circle'
            }));
        }
    }

    /**
     * Create warp effect
     */
    createWarpEffect(x, y, angle, config = {}) {
        const color = config.color || '#4488ff';
        const particleCount = 50;

        // Warp tunnel particles
        for (let i = 0; i < particleCount; i++) {
            const offset = (i / particleCount) * 200;
            const spreadAngle = angle + (Math.random() - 0.5) * 0.5;

            this.addParticle(new Particle({
                x: x + Math.cos(angle) * offset,
                y: y + Math.sin(angle) * offset,
                vx: Math.cos(spreadAngle) * 200,
                vy: Math.sin(spreadAngle) * 200,
                size: 2 + Math.random() * 3,
                color: color,
                life: 0.5 + Math.random() * 0.3,
                decay: 1.5,
                glow: true,
                type: 'circle'
            }));
        }

        // Central flash
        this.addParticle(new Particle({
            x, y,
            vx: 0, vy: 0,
            size: 30,
            color: '#ffffff',
            life: 0.3,
            decay: 3,
            glow: true,
            type: 'circle'
        }));
    }

    /**
     * Create shield impact effect
     */
    createShieldImpact(x, y, config = {}) {
        const color = config.color || '#00ffff';
        const particleCount = 15;

        // Shield ripple particles
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 80 + Math.random() * 40;

            this.addParticle(new Particle({
                x, y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: 2 + Math.random() * 2,
                color: color,
                life: 0.3 + Math.random() * 0.2,
                decay: 2,
                glow: true,
                type: 'circle'
            }));
        }

        // Central flash
        this.addParticle(new Particle({
            x, y,
            vx: 0, vy: 0,
            size: 15,
            color: color,
            life: 0.15,
            decay: 6,
            glow: true,
            type: 'circle'
        }));
    }

    /**
     * Create damage sparks (for critical systems)
     */
    createDamageSparks(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 30 + Math.random() * 50;

            this.addParticle(new Particle({
                x, y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: 1 + Math.random() * 2,
                color: '#ff9900',
                life: 0.5 + Math.random() * 0.5,
                decay: 1 + Math.random() * 0.5,
                glow: true,
                type: 'circle'
            }));
        }
    }

    /**
     * Create smoke trail effect (for damaged ships)
     */
    createSmokeTrail(x, y, angle, config = {}) {
        const particleCount = config.particleCount || 3;
        const intensity = config.intensity || 1.0;
        
        // Dark gray/black smoke particles
        for (let i = 0; i < particleCount; i++) {
            const spread = (Math.random() - 0.5) * 0.4;
            const backwardSpeed = -15 * intensity;
            const sideSpread = (Math.random() - 0.5) * 20;
            
            this.addParticle(new Particle({
                x: x + (Math.random() - 0.5) * 8,
                y: y + (Math.random() - 0.5) * 8,
                vx: Math.cos(angle + spread) * backwardSpeed + sideSpread * 0.3,
                vy: Math.sin(angle + spread) * backwardSpeed + sideSpread * 0.3,
                size: (2 + Math.random() * 3) * intensity,
                color: i % 2 === 0 ? '#333333' : '#222222',
                life: 1.0 + Math.random() * 0.5,
                decay: 0.4 + Math.random() * 0.2,
                glow: false,
                type: 'circle'
            }));
        }
    }

    /**
     * Create flame effect (for damaged ships)
     */
    createFlame(x, y, config = {}) {
        const intensity = config.intensity || 1.0;
        const particleCount = Math.floor(2 * intensity);
        
        // Orange/red/yellow flame particles
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 10 + Math.random() * 30;
            
            const colorChoices = ['#ff6600', '#ff3300', '#ff9900', '#ffaa00'];
            const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
            
            this.addParticle(new Particle({
                x: x + (Math.random() - 0.5) * 5,
                y: y + (Math.random() - 0.5) * 5,
                vx: Math.cos(angle) * velocity * 0.3,
                vy: Math.sin(angle) * velocity * 0.3 - 10, // Upward bias
                size: (1.5 + Math.random() * 2.5) * intensity,
                color: color,
                life: 0.3 + Math.random() * 0.3,
                decay: 2 + Math.random() * 1,
                glow: true,
                type: 'circle'
            }));
        }
    }

    /**
     * Create debris burst effect (for unshielded hull hits)
     */
    createDebrisBurst(x, y, config = {}) {
        const particleCount = config.particleCount || 20;
        const color = config.color || '#ff9900';

        // Metal debris particles (gray/brown chunks)
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 40 + Math.random() * 60;

            this.addParticle(new Particle({
                x, y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: 2 + Math.random() * 3,
                color: i % 3 === 0 ? '#999999' : (i % 3 === 1 ? '#666666' : '#cc6600'),
                life: 0.8 + Math.random() * 0.4,
                decay: 0.8 + Math.random() * 0.4,
                glow: false,
                type: Math.random() > 0.5 ? 'circle' : 'square',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 8
            }));
        }

        // Impact sparks (orange/yellow)
        for (let i = 0; i < particleCount / 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 70;

            this.addParticle(new Particle({
                x, y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: 1 + Math.random() * 2,
                color: i % 2 === 0 ? color : '#ffaa00',
                life: 0.4 + Math.random() * 0.3,
                decay: 1.5 + Math.random() * 0.5,
                glow: true,
                type: 'circle'
            }));
        }

        // Small impact flash
        this.addParticle(new Particle({
            x, y,
            vx: 0, vy: 0,
            size: 8,
            color: '#ffffff',
            life: 0.15,
            decay: 8,
            glow: true,
            type: 'circle'
        }));
    }

    /**
     * Create ship destruction explosion
     */
    createShipExplosion(x, y, shipSize, config = {}) {
        const color = config.color || '#ff6600';
        const particleCount = Math.floor(100 * (shipSize / 70)); // Scale particles with ship size
        const speed = 150;

        // Main explosion burst
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.8;
            const velocity = speed * (0.6 + Math.random() * 0.4);

            this.addParticle(new Particle({
                x, y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: (3 + Math.random() * 5) * (shipSize / 70),
                color: i % 4 === 0 ? '#ffffff' :
                       i % 4 === 1 ? '#ffaa00' :
                       i % 4 === 2 ? color : '#ff3300',
                life: 1.0 + Math.random() * 0.8,
                decay: 0.5 + Math.random() * 0.3,
                glow: true,
                type: 'circle'
            }));
        }

        // Debris cloud
        for (let i = 0; i < particleCount / 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = speed * 0.4 * Math.random();

            this.addParticle(new Particle({
                x: x + (Math.random() - 0.5) * shipSize * 0.5,
                y: y + (Math.random() - 0.5) * shipSize * 0.5,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: (2 + Math.random() * 4) * (shipSize / 70),
                color: i % 3 === 0 ? '#999999' : '#555555',
                life: 1.5 + Math.random() * 1.0,
                decay: 0.3 + Math.random() * 0.2,
                glow: false,
                type: Math.random() > 0.5 ? 'circle' : 'square',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 8
            }));
        }

        // Expanding shockwave particles
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const velocity = speed * 1.5;

            this.addParticle(new Particle({
                x, y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: (4 + Math.random() * 3) * (shipSize / 70),
                color: '#ffffff',
                life: 0.4 + Math.random() * 0.2,
                decay: 2.0,
                glow: true,
                type: 'circle'
            }));
        }

        // Central explosion flash
        this.addParticle(new Particle({
            x, y,
            vx: 0, vy: 0,
            size: 40 * (shipSize / 70),
            color: '#ffffff',
            life: 0.3,
            decay: 3,
            glow: true,
            type: 'circle'
        }));

        // Secondary flash (orange)
        this.addParticle(new Particle({
            x, y,
            vx: 0, vy: 0,
            size: 50 * (shipSize / 70),
            color: '#ff6600',
            life: 0.5,
            decay: 1.8,
            glow: true,
            type: 'circle'
        }));

        // Screen shake (scaled with ship size)
        this.addScreenShake(15 * (shipSize / 70), 0.5);
    }

    /**
     * Add particle to system
     */
    addParticle(particle) {
        // Limit max particles
        if (this.particles.length >= this.maxParticles) {
            this.particles.shift(); // Remove oldest particle
        }
        this.particles.push(particle);
    }

    /**
     * Add screen shake effect
     */
    addScreenShake(intensity, duration) {
        this.screenShake.intensity = Math.max(this.screenShake.intensity, intensity);
        this.screenShake.duration = Math.max(this.screenShake.duration, duration);
    }

    /**
     * Get screen shake offset
     */
    getScreenShake() {
        return {
            x: this.screenShake.x,
            y: this.screenShake.y
        };
    }

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
        this.screenShake = { x: 0, y: 0, intensity: 0, duration: 0 };
    }
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystem, Particle };
}
