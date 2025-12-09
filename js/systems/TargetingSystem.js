/**
 * Star Sea - Targeting System
 * Handles lock-on for torpedoes
 */

class TargetingSystem {
    constructor() {
        this.minLockTime = 3.0; // Minimum lock time (stable aim)
        this.maxLockTime = 5.0; // Maximum lock time (unstable aim)
        this.currentLockTime = 4.0; // Current adaptive lock time
        this.currentTarget = null;
        this.lockProgress = 0;
        this.driftTolerance = CONFIG.LOCK_ON_DRIFT_TOLERANCE; // 50 pixels
        this.isLocked = false;
        this.lastUpdateTime = 0;

        // Stability tracking for adaptive lock time
        this.lastReticleX = 0;
        this.lastReticleY = 0;
        this.reticleMovementSpeed = 0;

        // Lock loss tracking
        this.lockLossProgress = 0;
        this.lockLossTime = 2.5; // Base time to lose lock (2-3 seconds average)
        this.isLosingLock = false;
    }

    /**
     * Update targeting system
     */
    update(reticleX, reticleY, entities, camera, deltaTime) {
        const currentTime = performance.now() / 1000;

        // Validate inputs
        if (isNaN(reticleX) || isNaN(reticleY) || !camera || !entities) {
            if (CONFIG.DEBUG_MODE) {
                console.warn('⚠️ TargetingSystem.update: Invalid inputs', { reticleX, reticleY, camera: !!camera, entities: !!entities });
            }
            return;
        }

        // Convert screen coordinates to world coordinates
        const worldPos = camera.screenToWorld(reticleX, reticleY);
        
        if (!worldPos || isNaN(worldPos.x) || isNaN(worldPos.y)) {
            if (CONFIG.DEBUG_MODE) {
                console.warn('⚠️ TargetingSystem.update: Invalid world position', { reticleX, reticleY, worldPos });
            }
            return;
        }

        // Calculate reticle movement speed for stability tracking
        const reticleDist = MathUtils.distance(reticleX, reticleY, this.lastReticleX, this.lastReticleY);
        this.reticleMovementSpeed = reticleDist / (deltaTime || 0.016);
        this.lastReticleX = reticleX;
        this.lastReticleY = reticleY;

        // Find target under reticle
        const target = this.getTargetUnderReticle(worldPos.x, worldPos.y, entities);

        if (CONFIG.DEBUG_MODE) {
            if (target) {
                console.log(`🎯 Target under reticle: ${target.name || target.faction + ' ' + target.shipClass}, lockProgress: ${this.lockProgress.toFixed(2)}/${this.currentLockTime.toFixed(2)}`);
            } else if (this.currentTarget) {
                // Log when we have a target but reticle moved away
                const dist = MathUtils.distance(worldPos.x, worldPos.y, this.currentTarget.x, this.currentTarget.y);
                const baseRadius = this.currentTarget.radius || (this.currentTarget.getShipSize ? this.currentTarget.getShipSize() : 50) || 50;
                const detectionRadius = baseRadius * 6;
                console.log(`🎯 Reticle moved away from target: distance=${dist.toFixed(1)}, detectionRadius=${detectionRadius.toFixed(1)}`);
            }
        }

        if (target) {
            // Reset lock loss tracking when reticle is back on target
            this.isLosingLock = false;
            this.lockLossProgress = 0;

            if (this.currentTarget === target) {
                // Continue locking on same target
                // Adaptive lock time based on reticle stability
                // Movement < 20px/s = stable (3 seconds)
                // Movement > 100px/s = unstable (5 seconds)
                const stabilityFactor = Math.min(1, this.reticleMovementSpeed / 100);
                this.currentLockTime = this.minLockTime + (stabilityFactor * (this.maxLockTime - this.minLockTime));

                this.lockProgress += deltaTime;

                if (this.lockProgress >= this.currentLockTime && !this.isLocked) {
                    this.isLocked = true;
                    this.playLockSound();
                    eventBus.emit('lock-acquired', { target });
                    if (CONFIG.DEBUG_MODE) {
                        console.log('🔒 Lock acquired on target:', target.name || target.faction + ' ' + target.shipClass);
                    }
                }
            } else {
                // New target, reset lock
                this.currentTarget = target;
                this.lockProgress = 0;
                this.isLocked = false;
                this.currentLockTime = 4; // Start with neutral time
                eventBus.emit('lock-starting', { target });
            }
        } else {
            // No target under reticle
            if (this.currentTarget) {
                // Check if we're still close to the target (for locked targets)
                const distToTarget = MathUtils.distance(worldPos.x, worldPos.y, this.currentTarget.x, this.currentTarget.y);

                if (this.isLocked && distToTarget <= this.driftTolerance * 3) {
                    // Within tolerance range - start losing lock gradually
                    if (!this.isLosingLock) {
                        this.isLosingLock = true;
                        this.lockLossProgress = 0;
                        eventBus.emit('lock-degrading', { target: this.currentTarget });
                    }

                    // Calculate lock loss rate based on distance
                    // Closer = slower loss, further = faster loss
                    const distanceRatio = Math.min(1, distToTarget / (this.driftTolerance * 3));
                    const lockLossRate = 0.5 + (distanceRatio * 1.5); // 0.5x to 2.0x speed

                    this.lockLossProgress += deltaTime * lockLossRate;

                    if (this.lockLossProgress >= this.lockLossTime) {
                        // Lost lock after timeout
                        this.breakLock();
                    }
                } else {
                    // Too far or not locked - instant break
                    this.breakLock();
                }
            }
        }

        this.lastUpdateTime = currentTime;
    }

    /**
     * Find targetable entity under reticle
     */
    getTargetUnderReticle(worldX, worldY, entities) {
        for (const entity of entities) {
            if (!entity.active) continue;
            if (entity.type !== 'ship' && entity.type !== 'asteroid') continue;

            // Cannot target cloaked ships
            if (entity.type === 'ship' && entity.isCloaked && entity.isCloaked()) {
                continue;
            }

            // Check if reticle is within entity bounds (with generous detection radius)
            const distance = MathUtils.distance(worldX, worldY, entity.x, entity.y);
            const baseRadius = entity.radius || (entity.getShipSize ? entity.getShipSize() : 50) || 50;
            const detectionRadius = baseRadius * 6; // 6x the radius for easier targeting (increased from 4x)

            if (distance <= detectionRadius) {
                if (CONFIG.DEBUG_MODE) {
                    console.log(`🎯 Target detected: ${entity.name || entity.faction + ' ' + entity.shipClass}, distance: ${distance.toFixed(1)}, radius: ${detectionRadius.toFixed(1)}`);
                }
                return entity;
            }
        }
        return null;
    }

    /**
     * Break lock
     */
    breakLock() {
        // Always emit lock-broken to ensure UI classes are cleared
        // (even if currentTarget is null, we might have stale locking/locked classes)
        if (this.currentTarget || this.isLocked || this.lockProgress > 0) {
            eventBus.emit('lock-broken', { target: this.currentTarget });
        }
        this.currentTarget = null;
        this.lockProgress = 0;
        this.isLocked = false;
        this.isLosingLock = false;
        this.lockLossProgress = 0;
    }

    /**
     * Get lock progress (0-1)
     */
    getLockProgress() {
        return Math.min(1, this.lockProgress / this.currentLockTime);
    }

    /**
     * Get lock loss progress (0-1) - for UI feedback
     */
    getLockLossProgress() {
        return this.isLosingLock ? Math.min(1, this.lockLossProgress / this.lockLossTime) : 0;
    }

    /**
     * Get current locked target (or null)
     */
    getLockedTarget() {
        return this.isLocked ? this.currentTarget : null;
    }

    /**
     * Is currently locked
     */
    hasLock() {
        return this.isLocked;
    }

    /**
     * Is currently locking (but not yet locked)
     */
    isLocking() {
        return this.currentTarget !== null && !this.isLocked;
    }

    /**
     * Play lock-on sound
     */
    playLockSound() {
        // TODO: Audio system integration (Phase 7)
        console.log('Lock-on acquired!');
    }
}
