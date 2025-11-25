/**
 * Star Sea - Disruptor Beam Entity
 * Dhojan weapon that drains shields in addition to damage
 */

class DisruptorBeam extends BeamProjectile {
    constructor(config) {
        super(config);
        this.projectileType = 'disruptor_beam';
        this.shieldDrain = config.shieldDrain || 0.5; // Drains 0.5 shield per second
        this.color = '#aa00aa'; // Purple for Dhojan
        this.width = 3;
    }

    /**
     * Handle collision with target
     */
    onHit(target) {
        if (!target || !target.active) return;

        // Apply damage
        if (target.takeDamage) {
            target.takeDamage(this.damage, 'beam');
        }

        // Drain shields if target has shields
        if (target.shields && target.shields.isUp()) {
            const drainAmount = this.shieldDrain;
            target.shields.currentStrength = Math.max(0, target.shields.currentStrength - drainAmount);
            
            // Emit event for visual feedback
            eventBus.emit('shield-drained', {
                target: target,
                amount: drainAmount,
                source: this.sourceShip
            });
        }

        // Mark as hit and destroy
        this.markAsHit(target);
        this.destroy();
    }
}

