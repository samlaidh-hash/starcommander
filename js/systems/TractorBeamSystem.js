/**
 * Star Sea - Tractor Beam System
 * G key to pull target ship toward player using direct velocity manipulation
 * NO PHYSICS ENGINE - Direct velocity adjustment only
 */

class TractorBeamSystem {
    constructor(ship) {
        this.ship = ship;
        this.isActive = false;
        this.currentTarget = null;
        this.maxRange = 0; // Will be set based on ship length
        this.pullStrength = 0.15; // 15% of distance per frame
        this.beamAlpha = 0;
    }

    /**
     * Initialize system with ship reference
     */
    init(ship) {
        this.ship = ship;
    }

    /**
     * Activate tractor beam on nearest target
     */
    activate(entities, currentTime) {
        // Set range based on ship length
        this.maxRange = this.ship.length * 10;

        // Find nearest target within range
        this.currentTarget = this.findNearestTarget(entities);

        if (this.currentTarget) {
            this.isActive = true;
            this.beamAlpha = 0;

            // Play tractor beam sound
            if (window.audioManager) {
                window.audioManager.playSound('tractor_beam');
            }

            console.log(`Tractor beam activated on ${this.currentTarget.name || this.currentTarget.faction}`);
        } else {
            console.log('Tractor beam: No valid target in range');
        }
    }

    /**
     * Deactivate tractor beam
     */
    deactivate() {
        this.isActive = false;
        this.currentTarget = null;
        this.beamAlpha = 0;
    }

    /**
     * Find nearest valid target within range
     * Target must have fewer energy blocks (empty or full) than player ship
     */
    findNearestTarget(entities) {
        let nearest = null;
        let nearestDist = Infinity;
        
        // Get player ship energy block count
        const playerBlockCount = this.ship.energy ? this.ship.energy.blockCount : 0;

        for (const entity of entities) {
            if (!entity.active) continue;
            if (entity === this.ship) continue;
            if (entity.type !== 'ship') continue;
            if (entity.faction === this.ship.faction) continue; // Don't tractor allies
            if (!entity.energy) continue; // Must have energy system

            // Check if target has fewer energy blocks
            const targetBlockCount = entity.energy.blockCount;
            if (targetBlockCount >= playerBlockCount) continue; // Can only pin weaker ships

            const dx = entity.x - this.ship.x;
            const dy = entity.y - this.ship.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= this.maxRange && dist < nearestDist) {
                nearest = entity;
                nearestDist = dist;
            }
        }

        return nearest;
    }

    /**
     * Update tractor beam system
     * Drains energy constantly while active
     */
    update(deltaTime, entities, currentTime) {
        if (!this.isActive || !this.currentTarget) return;

        // Drain energy constantly while active
        if (this.ship.energy) {
            const energyDrainRate = 5; // Energy per second
            const energyDrained = this.ship.energy.drainEnergy(0, deltaTime * energyDrainRate);
            // If out of energy, tractor beam deactivates
            if (this.ship.energy.getTotalEnergy() <= 0) {
                this.deactivate();
                return;
            }
        }

        // Check if target is still valid
        if (!this.currentTarget.active) {
            this.deactivate();
            return;
        }

        // Calculate distance
        const dx = this.ship.x - this.currentTarget.x;
        const dy = this.ship.y - this.currentTarget.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Check if target is out of range
        if (dist > this.maxRange) {
            this.deactivate();
            return;
        }

        // Pin target - move it with player ship (strong pull)
        const pullForce = this.pullStrength * 2; // Stronger pull to pin target
        this.currentTarget.vx += (dx / dist) * pullForce * dist * deltaTime;
        this.currentTarget.vy += (dy / dist) * pullForce * dist * deltaTime;
        
        // Also match player ship velocity to keep target pinned
        if (this.ship.vx !== undefined && this.ship.vy !== undefined) {
            this.currentTarget.vx = this.ship.vx * 0.8; // Follow player movement
            this.currentTarget.vy = this.ship.vy * 0.8;
        }

        // Update visual effects
        this.beamAlpha += deltaTime * 3;
    }

    /**
     * Render tractor beam visual
     */
    render(ctx, camera) {
        if (!this.isActive || !this.currentTarget) return;

        const playerPos = camera.worldToScreen(this.ship.x, this.ship.y);
        const targetPos = camera.worldToScreen(this.currentTarget.x, this.currentTarget.y);

        ctx.save();

        // Draw pulsing beam
        const alpha = 0.6 + Math.sin(this.beamAlpha) * 0.3;
        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(playerPos.x, playerPos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.stroke();

        // Draw glow effect
        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha * 0.3})`;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(playerPos.x, playerPos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.stroke();

        ctx.restore();
    }

    /**
     * Get system status
     */
    getStatus() {
        return {
            active: this.isActive,
            target: this.currentTarget,
            range: this.maxRange
        };
    }
}
