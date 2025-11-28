/**
 * Star Sea - Quantum Torpedo Entity
 * Phases through shields
 */

class QuantumTorpedo extends TorpedoProjectile {
    constructor(config) {
        super(config);
        this.type = 'quantum_torpedo';
        this.shieldPenetration = true; // Ignores shields
        this.color = CONFIG.COLOR_QUANTUM_TORPEDO || '#aa00aa';
        this.radius = 5;
        // Note: Damage and speed are set by QuantumTorpedoLauncher
        // (50% more damage, 75% speed)
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Quantum torpedo has special visual effects
        this.updateQuantumEffects(deltaTime);
    }

    updateQuantumEffects(deltaTime) {
        // Quantum torpedo phases in and out of reality
        this.quantumPhase = (this.quantumPhase || 0) + deltaTime * 10;
    }

    render(ctx, camera) {
        if (!this.active) return;

        // Note: Camera transform already applied, use world coords directly
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(MathUtils.toRadians(this.rotation));

        // Draw quantum torpedo with phase effect
        const alpha = 0.5 + 0.5 * Math.sin(this.quantumPhase || 0);
        ctx.globalAlpha = alpha;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw quantum trail
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(-this.radius * 2, 0);
        ctx.stroke();

        ctx.globalAlpha = 1.0;
        ctx.restore();
    }

    explode() {
        // Quantum torpedo creates a quantum explosion
        eventBus.emit('quantum-torpedo-exploded', {
            x: this.x,
            y: this.y,
            damage: this.damage,
            blastRadius: this.blastRadius,
            sourceShip: this.sourceShip
        });

        this.destroy();
    }
}

