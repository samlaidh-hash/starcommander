/**
 * Star Sea - Shuttle Entity
 * 5 mission types: Attack, Defense, Wild Weasel, Suicide, Transport, Scan
 */

class Shuttle extends Entity {
    constructor(config) {
        super(config.x, config.y);
        this.type = 'shuttle';
        this.ownerShip = config.ownerShip;
        this.missionType = config.missionType || 'ATTACK';
        this.missionTarget = config.missionTarget || null;
        
        // Shuttle stats
        this.maxHp = 2;
        this.hp = 2;
        this.maxShield = 3;
        this.shield = 3;
        this.maxSpeed = this.ownerShip.maxSpeed * 0.5; // Half player speed
        this.acceleration = this.ownerShip.acceleration * 0.5;
        this.turnRate = this.ownerShip.turnRate * 1.5; // More maneuverable
        
        // Mission-specific properties
        this.missionData = this.initializeMissionData();
        this.missionComplete = false;
        this.returnToShip = false;
        this.landed = false;
        this.landingTime = 0;
        this.repairRate = 1; // 1 HP per minute when landed
        
        // Visual properties
        this.radius = 8;
        this.color = this.getShuttleColor();
        this.vertices = this.generateShuttleVertices();
        
        // AI behavior
        this.aiState = 'MISSION';
        this.target = null;
        this.lastStateChange = 0;
        this.weaponCooldown = 0;
        this.beamRange = CONFIG.BEAM_RANGE_PIXELS * 0.2; // 20% of ship beam range
        
        // Physics
        this.physicsWorld = config.physicsWorld;
        if (this.physicsWorld) {
            this.createPhysicsBody();
        }
    }

    initializeMissionData() {
        switch (this.missionType) {
            case 'ATTACK':
                return {
                    targetAcquired: false,
                    attackRange: 100,
                    lastAttackTime: 0
                };
            case 'DEFENSE':
                return {
                    patrolRadius: 150,
                    interceptRange: 80,
                    lastInterceptTime: 0
                };
            case 'WILD_WEASEL':
                return {
                    signalRange: 200,
                    signalStrength: 1.0,
                    lastSignalTime: 0
                };
            case 'SUICIDE':
                return {
                    targetAcquired: false,
                    rammingSpeed: this.maxSpeed * 1.5,
                    explosionDamage: 2
                };
            case 'TRANSPORT':
                return {
                    targetReached: false,
                    cargoDelivered: false,
                    transportTime: 0
                };
            case 'SCAN':
                return {
                    scanLocation: this.missionTarget,
                    scanComplete: false,
                    scanTime: 0,
                    scanDuration: 10 // 10 seconds to scan
                };
            default:
                return {};
        }
    }

    getShuttleColor() {
        switch (this.missionType) {
            case 'ATTACK': return '#ff4444';
            case 'DEFENSE': return '#4444ff';
            case 'WILD_WEASEL': return '#ffff44';
            case 'SUICIDE': return '#ff44ff';
            case 'TRANSPORT': return '#44ff44';
            case 'SCAN': return '#44ffff';
            default: return '#ffffff';
        }
    }

    generateShuttleVertices() {
        // Simple shuttle shape
        return [
            { x: 0, y: -8 },   // Nose
            { x: -4, y: 4 },   // Port wing
            { x: 4, y: 4 }     // Starboard wing
        ];
    }

    createPhysicsBody() {
        const body = this.physicsWorld.createCircleBody(this.x, this.y, this.radius, {
            type: 'dynamic',
            density: 0.5,
            restitution: 0.8,
            category: this.physicsWorld.CATEGORY.SHIP,
            mask: 0xFFFF
        });

        this.physicsComponent = new PhysicsComponent(this, body, this.physicsWorld);
    }

    update(deltaTime, currentTime, allEntities) {
        if (!this.active) return;

        // Sync position from physics
        if (this.physicsComponent) {
            this.physicsComponent.syncToEntity();
        }

        // Check if should return to ship (1 HP or less)
        if (this.hp <= 1 && !this.returnToShip) {
            this.returnToShip = true;
            this.aiState = 'RETURN';
            console.log(`Shuttle ${this.missionType} returning to ship (low HP)`);
        }

        // Handle landing and repair
        if (this.landed) {
            this.handleLanding(deltaTime, currentTime);
            return;
        }

        // Execute mission behavior
        this.executeMission(deltaTime, currentTime, allEntities);

        // Update shield recovery
        this.updateShieldRecovery(deltaTime, currentTime);

        // Update weapon cooldown
        if (this.weaponCooldown > 0) {
            this.weaponCooldown -= deltaTime;
        }
    }

    executeMission(deltaTime, currentTime, allEntities) {
        switch (this.missionType) {
            case 'ATTACK':
                this.executeAttackMission(deltaTime, currentTime, allEntities);
                break;
            case 'DEFENSE':
                this.executeDefenseMission(deltaTime, currentTime, allEntities);
                break;
            case 'WILD_WEASEL':
                this.executeWildWeaselMission(deltaTime, currentTime, allEntities);
                break;
            case 'SUICIDE':
                this.executeSuicideMission(deltaTime, currentTime, allEntities);
                break;
            case 'TRANSPORT':
                this.executeTransportMission(deltaTime, currentTime, allEntities);
                break;
            case 'SCAN':
                this.executeScanMission(deltaTime, currentTime, allEntities);
                break;
        }
    }

    executeAttackMission(deltaTime, currentTime, allEntities) {
        // Find nearest enemy
        let nearestEnemy = null;
        let nearestDistance = Infinity;

        for (const entity of allEntities) {
            if (entity.type === 'ship' && entity !== this.ownerShip && entity.active) {
                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestEnemy = entity;
                }
            }
        }

        if (nearestEnemy) {
            // Move towards enemy
            const angleToEnemy = MathUtils.angleBetween(this.x, this.y, nearestEnemy.x, nearestEnemy.y);
            this.turnTowardsAngle(angleToEnemy, deltaTime);
            this.applyThrust(1.0, deltaTime);

            // Fire at enemy if in range and in forward arc
            if (nearestDistance <= this.beamRange && this.weaponCooldown <= 0) {
                if (this.isTargetInForwardArc(nearestEnemy.x, nearestEnemy.y)) {
                    this.fireBeam(nearestEnemy.x, nearestEnemy.y);
                    this.weaponCooldown = 1.0; // 1 second cooldown
                }
            }
        } else {
            // No enemies, patrol around owner
            this.patrolAroundOwner(deltaTime);
        }
    }

    executeDefenseMission(deltaTime, currentTime, allEntities) {
        // Find torpedoes, shuttles, or ships to intercept
        let target = null;
        let targetDistance = Infinity;

        for (const entity of allEntities) {
            if (!entity.active) continue;

            let shouldIntercept = false;
            if (entity.type === 'torpedo' && entity.sourceShip !== this.ownerShip) {
                shouldIntercept = true;
            } else if (entity.type === 'shuttle' && entity.ownerShip !== this.ownerShip) {
                shouldIntercept = true;
            } else if (entity.type === 'ship' && entity !== this.ownerShip) {
                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance <= this.missionData.interceptRange) {
                    shouldIntercept = true;
                }
            }

            if (shouldIntercept) {
                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance < targetDistance) {
                    targetDistance = distance;
                    target = entity;
                }
            }
        }

        if (target) {
            // Intercept target
            const angleToTarget = MathUtils.angleBetween(this.x, this.y, target.x, target.y);
            this.turnTowardsAngle(angleToTarget, deltaTime);
            this.applyThrust(1.0, deltaTime);

            // Fire at target if in range and in forward arc
            if (targetDistance <= this.beamRange && this.weaponCooldown <= 0) {
                if (this.isTargetInForwardArc(target.x, target.y)) {
                    this.fireBeam(target.x, target.y);
                    this.weaponCooldown = 1.0;
                }
            }
        } else {
            // Patrol around owner
            this.patrolAroundOwner(deltaTime);
        }
    }

    executeWildWeaselMission(deltaTime, currentTime, allEntities) {
        // Fly away from owner ship
        const angleFromOwner = MathUtils.angleBetween(this.ownerShip.x, this.ownerShip.y, this.x, this.y);
        this.turnTowardsAngle(angleFromOwner, deltaTime);
        this.applyThrust(1.0, deltaTime);

        // Emit signal to attract torpedoes
        if (currentTime - this.missionData.lastSignalTime >= 0.5) {
            this.emitWildWeaselSignal(allEntities);
            this.missionData.lastSignalTime = currentTime;
        }
    }

    executeSuicideMission(deltaTime, currentTime, allEntities) {
        // Find nearest enemy
        let nearestEnemy = null;
        let nearestDistance = Infinity;

        for (const entity of allEntities) {
            if (entity.type === 'ship' && entity !== this.ownerShip && entity.active) {
                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestEnemy = entity;
                }
            }
        }

        if (nearestEnemy) {
            // Ram enemy at high speed
            const angleToEnemy = MathUtils.angleBetween(this.x, this.y, nearestEnemy.x, nearestEnemy.y);
            this.turnTowardsAngle(angleToEnemy, deltaTime);
            this.applyThrust(1.5, deltaTime); // Boost speed

            // Explode on contact
            if (nearestDistance <= this.radius + nearestEnemy.radius) {
                this.explodeAsHeavyTorpedoes(nearestEnemy);
            }
        } else {
            // Patrol around owner
            this.patrolAroundOwner(deltaTime);
        }
    }

    executeTransportMission(deltaTime, currentTime, allEntities) {
        if (!this.missionData.targetReached) {
            // Move to target location
            if (this.missionTarget) {
                const angleToTarget = MathUtils.angleBetween(this.x, this.y, this.missionTarget.x, this.missionTarget.y);
                this.turnTowardsAngle(angleToTarget, deltaTime);
                this.applyThrust(1.0, deltaTime);

                const distance = MathUtils.distance(this.x, this.y, this.missionTarget.x, this.missionTarget.y);
                if (distance <= 50) {
                    this.missionData.targetReached = true;
                    this.missionData.transportTime = currentTime;
                }
            }
        } else if (!this.missionData.cargoDelivered) {
            // Wait at target location
            this.missionData.transportTime += deltaTime;
            if (this.missionData.transportTime >= 5) { // 5 seconds at target
                this.missionData.cargoDelivered = true;
            }
        } else {
            // Return to owner
            this.returnToOwner(deltaTime);
        }
    }

    executeScanMission(deltaTime, currentTime, allEntities) {
        if (!this.missionData.scanComplete) {
            // Move to scan location
            if (this.missionData.scanLocation) {
                const angleToTarget = MathUtils.angleBetween(this.x, this.y, this.missionData.scanLocation.x, this.missionData.scanLocation.y);
                this.turnTowardsAngle(angleToTarget, deltaTime);
                this.applyThrust(1.0, deltaTime);

                const distance = MathUtils.distance(this.x, this.y, this.missionData.scanLocation.x, this.missionData.scanLocation.y);
                if (distance <= 50) {
                    // Start scanning
                    this.missionData.scanTime += deltaTime;
                    if (this.missionData.scanTime >= this.missionData.scanDuration) {
                        this.missionData.scanComplete = true;
                        console.log('Scan mission complete');
                    }
                }
            }
        } else {
            // Return to owner
            this.returnToOwner(deltaTime);
        }
    }

    patrolAroundOwner(deltaTime) {
        const angleToOwner = MathUtils.angleBetween(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        const patrolAngle = angleToOwner + 90; // Orbit 90 degrees offset
        this.turnTowardsAngle(patrolAngle, deltaTime);
        this.applyThrust(0.5, deltaTime);
    }

    returnToOwner(deltaTime) {
        const angleToOwner = MathUtils.angleBetween(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        this.turnTowardsAngle(angleToOwner, deltaTime);
        this.applyThrust(1.0, deltaTime);

        const distance = MathUtils.distance(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        if (distance <= 30) {
            this.land();
        }
    }

    turnTowardsAngle(targetAngle, deltaTime) {
        let angleDiff = targetAngle - this.rotation;
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;

        const turnSpeed = this.turnRate * deltaTime;
        if (Math.abs(angleDiff) < turnSpeed) {
            this.rotation = targetAngle;
        } else {
            this.rotation += Math.sign(angleDiff) * turnSpeed;
        }

        // Normalize rotation
        while (this.rotation >= 360) this.rotation -= 360;
        while (this.rotation < 0) this.rotation += 360;
    }

    applyThrust(thrustPercent, deltaTime) {
        if (!this.physicsComponent) return;

        const thrust = this.acceleration * thrustPercent;
        const thrustVec = MathUtils.vectorFromAngle(this.rotation, thrust);

        this.physicsComponent.body.applyForceToCenter(
            planck.Vec2(thrustVec.x, thrustVec.y)
        );
    }

    isTargetInForwardArc(targetX, targetY) {
        // Check if target is within 90° forward arc
        const angleToTarget = MathUtils.angleBetween(this.x, this.y, targetX, targetY);
        const angleDiff = MathUtils.normalizeAngle(angleToTarget - this.rotation);
        return Math.abs(angleDiff) <= 45; // 90° arc total (±45°)
    }

    fireBeam(targetX, targetY) {
        // Create beam projectile
        const beam = new BeamProjectile({
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: 1,
            range: this.beamRange,
            speed: CONFIG.BEAM_SPEED,
            sourceShip: this
        });

        eventBus.emit('shuttle-fired-beam', { shuttle: this, projectile: beam });
    }

    emitWildWeaselSignal(allEntities) {
        // Attract all torpedoes within signal range
        for (const entity of allEntities) {
            if (entity.type === 'torpedo' && entity.sourceShip !== this.ownerShip) {
                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance <= this.missionData.signalRange) {
                    // Redirect torpedo to shuttle
                    entity.lockOnTarget = this;
                    entity.targetX = this.x;
                    entity.targetY = this.y;
                }
            }
        }
    }

    explodeAsHeavyTorpedoes(target) {
        // Create 2 heavy torpedoes
        for (let i = 0; i < 2; i++) {
            const angle = MathUtils.random(0, 360);
            const offset = MathUtils.vectorFromAngle(angle, 20);
            
            const heavyTorp = new TorpedoProjectile({
                x: this.x + offset.x,
                y: this.y + offset.y,
                rotation: angle,
                targetX: target.x,
                targetY: target.y,
                damage: 2, // Heavy torpedo damage
                blastRadius: CONFIG.TORPEDO_BLAST_RADIUS_PIXELS * 2,
                speed: CONFIG.TORPEDO_SPEED_MULTIPLIER * CONFIG.MAX_SPEED_CA * 0.75,
                lifetime: CONFIG.TORPEDO_LIFETIME * 1.5,
                sourceShip: this.ownerShip,
                lockOnTarget: target
            });

            eventBus.emit('shuttle-exploded', { shuttle: this, projectile: heavyTorp });
        }

        this.destroy();
    }

    land() {
        this.landed = true;
        this.landingTime = performance.now() / 1000;
        this.returnToShip = false;
        this.missionComplete = true;
        
        eventBus.emit('shuttle-landed', { shuttle: this });
    }

    handleLanding(deltaTime, currentTime) {
        // Repair shuttle when landed
        if (this.hp < this.maxHp) {
            const repairAmount = this.repairRate * deltaTime / 60; // 1 HP per minute
            this.hp = Math.min(this.maxHp, this.hp + repairAmount);
        }

        // Restore shields
        if (this.shield < this.maxShield) {
            this.shield = Math.min(this.maxShield, this.shield + deltaTime);
        }
    }

    updateShieldRecovery(deltaTime, currentTime) {
        // Shield recovery after 2 seconds of no damage
        if (this.shield < this.maxShield) {
            this.shield = Math.min(this.maxShield, this.shield + deltaTime);
        }
    }

    takeDamage(damage) {
        // Apply to shields first
        if (this.shield > 0) {
            const shieldDamage = Math.min(damage, this.shield);
            this.shield -= shieldDamage;
            damage -= shieldDamage;
        }

        // Apply remaining damage to hull
        if (damage > 0) {
            this.hp -= damage;
            if (this.hp <= 0) {
                this.destroy();
            }
        }
    }

    getMissionStatus() {
        return {
            type: this.missionType,
            complete: this.missionComplete,
            landed: this.landed,
            hp: this.hp,
            maxHp: this.maxHp,
            shield: this.shield,
            maxShield: this.maxShield
        };
    }
}

