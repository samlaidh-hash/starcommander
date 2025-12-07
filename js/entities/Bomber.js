/**
 * Star Sea - Bomber Entity
 * Slower than fighters, heavier punch, more shields/armor
 */

class Bomber extends Entity {
    constructor(config) {
        super(config.x, config.y);
        this.type = 'bomber';
        this.ownerShip = config.ownerShip;
        this.faction = config.faction || 'FEDERATION';
        this.mission = config.mission || 'ATTACK'; // Mission type: ATTACK, DEFENSE, PASSIVE, RECON

        // Bomber stats (slower, heavier punch, more shields/armor)
        this.maxHp = 3; // More armor than fighters
        this.hp = 3;
        this.maxShield = 2; // More shields than fighters
        this.shield = 2;
        this.maxSpeed = this.ownerShip.maxSpeed * 0.4; // Slower than fighters
        this.acceleration = this.ownerShip.acceleration * 0.6; // Less responsive
        this.turnRate = this.ownerShip.turnRate * 1.2; // Less maneuverable

        // Visual properties
        this.radius = 10;
        this.color = this.getBomberColor();
        this.vertices = this.generateBomberVertices();

        // AI behavior
        this.aiState = 'PATROL';
        this.target = null;
        this.lastStateChange = 0;
        this.weaponCooldown = 0;
        this.torpedoCooldown = 0;
        this.beamRange = CONFIG.BEAM_RANGE_PIXELS * 0.4; // 40% of ship beam range
        this.beamDamage = 1.0; // Full damage beams
        this.torpedoDamage = 2.0; // Heavy torpedo damage
        this.torpedoRange = 200; // Torpedo range

        // Physics
        this.physicsWorld = config.physicsWorld;
        if (this.physicsWorld) {
            this.createPhysicsBody();
        }
    }

    getBomberColor() {
        switch (this.faction) {
            case 'FEDERATION': return '#6666ff';
            case 'TRIGON': return '#ff6666';
            case 'SCINTILIAN': return '#66ff66';
            case 'PIRATE': return '#ffcc66';
            default: return '#cccccc';
        }
    }

    generateBomberVertices() {
        // Larger, bulkier bomber shape
        return [
            { x: 0, y: -8 },   // Nose
            { x: -5, y: 2 },   // Port wing
            { x: -3, y: 6 },   // Port wing tip
            { x: 3, y: 6 },    // Starboard wing tip
            { x: 5, y: 2 }     // Starboard wing
        ];
    }

    createPhysicsBody() {
        const body = this.physicsWorld.createCircleBody(this.x, this.y, this.radius, {
            type: 'dynamic',
            density: 0.8,
            restitution: 0.7,
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

        // Execute AI behavior
        this.executeAI(deltaTime, currentTime, allEntities);

        // Update shield recovery
        this.updateShieldRecovery(deltaTime, currentTime);

        // Update weapon cooldowns
        if (this.weaponCooldown > 0) {
            this.weaponCooldown -= deltaTime;
        }
        if (this.torpedoCooldown > 0) {
            this.torpedoCooldown -= deltaTime;
        }
    }

    executeAI(deltaTime, currentTime, allEntities) {
        // Execute mission-specific behavior
        switch(this.mission) {
            case 'ATTACK':
                this.executeAttackMission(deltaTime, allEntities);
                break;
            case 'DEFENSE':
                this.executeDefenseMission(deltaTime, allEntities);
                break;
            case 'PASSIVE':
                this.executePassiveMission(deltaTime);
                break;
            case 'RECON':
                this.executeReconMission(deltaTime, allEntities);
                break;
            default:
                this.executeAttackMission(deltaTime, allEntities);
        }
    }

    executeAttackMission(deltaTime, allEntities) {
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
            // Attack enemy
            const angleToEnemy = MathUtils.angleBetween(this.x, this.y, nearestEnemy.x, nearestEnemy.y);
            this.turnTowardsAngle(angleToEnemy, deltaTime);
            this.applyThrust(1.0, deltaTime);

            // Fire beam if in range and in forward arc
            if (nearestDistance <= this.beamRange && this.weaponCooldown <= 0) {
                if (this.isTargetInForwardArc(nearestEnemy.x, nearestEnemy.y)) {
                    this.fireBeam(nearestEnemy.x, nearestEnemy.y);
                    this.weaponCooldown = 1.0; // Slower firing rate than fighters
                }
            }

            // Fire torpedo if in range and cooldown ready and in forward arc
            if (nearestDistance <= this.torpedoRange && this.torpedoCooldown <= 0) {
                if (this.isTargetInForwardArc(nearestEnemy.x, nearestEnemy.y)) {
                    this.fireTorpedo(nearestEnemy.x, nearestEnemy.y, nearestEnemy);
                    this.torpedoCooldown = 3.0; // 3 second torpedo cooldown
                }
            }
        } else {
            // Patrol around owner
            this.patrolAroundOwner(deltaTime);
        }
    }

    executeDefenseMission(deltaTime, allEntities) {
        // Heavy defense - focus on destroying torpedoes and bombers
        const ownerDistance = MathUtils.distance(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        const defenseRadius = 150;

        // Prioritize torpedoes, then shuttles/fighters, then ships
        let highestPriorityThreat = null;
        let highestPriority = -1;

        for (const entity of allEntities) {
            if (!entity.active) continue;

            let priority = -1;
            let isThreat = false;

            if (entity.type === 'torpedo' && entity.sourceShip !== this.ownerShip) {
                const threatToOwner = MathUtils.distance(entity.x, entity.y, this.ownerShip.x, this.ownerShip.y);
                if (threatToOwner < defenseRadius * 2) {
                    priority = 3; // Highest priority
                    isThreat = true;
                }
            } else if ((entity.type === 'shuttle' || entity.type === 'fighter') && entity.ownerShip !== this.ownerShip) {
                priority = 2;
                isThreat = true;
            } else if (entity.type === 'ship' && entity !== this.ownerShip) {
                const threatToOwner = MathUtils.distance(entity.x, entity.y, this.ownerShip.x, this.ownerShip.y);
                if (threatToOwner < defenseRadius) {
                    priority = 1;
                    isThreat = true;
                }
            }

            if (isThreat && priority > highestPriority) {
                highestPriority = priority;
                highestPriorityThreat = entity;
            }
        }

        if (highestPriorityThreat) {
            // Attack threat
            const distance = MathUtils.distance(this.x, this.y, highestPriorityThreat.x, highestPriorityThreat.y);
            const angleToThreat = MathUtils.angleBetween(this.x, this.y, highestPriorityThreat.x, highestPriorityThreat.y);
            this.turnTowardsAngle(angleToThreat, deltaTime);
            this.applyThrust(1.0, deltaTime);

            if (distance <= this.beamRange && this.weaponCooldown <= 0) {
                if (this.isTargetInForwardArc(highestPriorityThreat.x, highestPriorityThreat.y)) {
                    this.fireBeam(highestPriorityThreat.x, highestPriorityThreat.y);
                    this.weaponCooldown = 1.0;
                }
            }

            if (distance <= this.torpedoRange && this.torpedoCooldown <= 0 && highestPriorityThreat.type === 'ship') {
                if (this.isTargetInForwardArc(highestPriorityThreat.x, highestPriorityThreat.y)) {
                    this.fireTorpedo(highestPriorityThreat.x, highestPriorityThreat.y, highestPriorityThreat);
                    this.torpedoCooldown = 3.0;
                }
            }
        } else {
            // Patrol defensive position
            const angleToOwner = MathUtils.angleBetween(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
            const orbitAngle = angleToOwner + 60;
            this.turnTowardsAngle(orbitAngle, deltaTime);

            if (ownerDistance < defenseRadius * 0.7) {
                this.applyThrust(-0.2, deltaTime);
            } else if (ownerDistance > defenseRadius * 1.3) {
                this.applyThrust(0.7, deltaTime);
            } else {
                this.applyThrust(0.3, deltaTime);
            }
        }
    }

    executePassiveMission(deltaTime) {
        // Formation follow - heavy escort
        const angleToOwner = MathUtils.angleBetween(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        const distance = MathUtils.distance(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        const formationDistance = 60;

        if (distance > formationDistance) {
            this.turnTowardsAngle(angleToOwner, deltaTime);
            this.applyThrust(0.8, deltaTime);
        } else {
            const formationAngle = angleToOwner + 180; // Behind owner
            this.turnTowardsAngle(formationAngle, deltaTime);
            this.applyThrust(0.3, deltaTime);
        }
    }

    executeReconMission(deltaTime, allEntities) {
        // Scout and mark targets - stay at range
        const scoutDistance = 250;
        const distance = MathUtils.distance(this.x, this.y, this.ownerShip.x, this.ownerShip.y);

        // Find enemies to scan
        let nearestEnemy = null;
        let nearestDistance = Infinity;

        for (const entity of allEntities) {
            if (entity.type === 'ship' && entity !== this.ownerShip && entity.active) {
                const dist = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (dist < nearestDistance) {
                    nearestDistance = dist;
                    nearestEnemy = entity;
                }
            }
        }

        if (nearestEnemy && distance < scoutDistance) {
            // Keep distance from enemy while scanning
            const angleToEnemy = MathUtils.angleBetween(this.x, this.y, nearestEnemy.x, nearestEnemy.y);
            const scanDistance = 180;

            if (nearestDistance < scanDistance) {
                // Too close, back away
                this.turnTowardsAngle(angleToEnemy + 180, deltaTime);
                this.applyThrust(0.8, deltaTime);
            } else {
                // Circle at safe distance
                const circleAngle = angleToEnemy + 90;
                this.turnTowardsAngle(circleAngle, deltaTime);
                this.applyThrust(0.5, deltaTime);
            }
        } else {
            // Scout ahead of owner
            const scoutAngle = this.ownerShip.rotation;
            if (distance < scoutDistance) {
                this.turnTowardsAngle(scoutAngle, deltaTime);
                this.applyThrust(0.7, deltaTime);
            } else {
                // Slow patrol
                this.patrolAroundOwner(deltaTime);
            }
        }
    }

    patrolAroundOwner(deltaTime) {
        const angleToOwner = MathUtils.angleBetween(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        const patrolAngle = angleToOwner + 60; // Orbit 60 degrees offset
        this.turnTowardsAngle(patrolAngle, deltaTime);
        this.applyThrust(0.6, deltaTime);
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
            damage: this.beamDamage,
            range: this.beamRange,
            speed: CONFIG.BEAM_SPEED,
            sourceShip: this
        });

        eventBus.emit('bomber-fired-beam', { bomber: this, projectile: beam });
    }

    fireTorpedo(targetX, targetY, target) {
        // Create torpedo projectile
        const torpedo = new TorpedoProjectile({
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: this.torpedoDamage,
            blastRadius: CONFIG.TORPEDO_BLAST_RADIUS_PIXELS * 1.5,
            speed: CONFIG.TORPEDO_SPEED_MULTIPLIER * CONFIG.MAX_SPEED_CA * 0.8,
            lifetime: CONFIG.TORPEDO_LIFETIME * 1.2,
            sourceShip: this.ownerShip,
            lockOnTarget: target
        });

        eventBus.emit('bomber-fired-torpedo', { bomber: this, projectile: torpedo });
    }

    updateShieldRecovery(deltaTime, currentTime) {
        // Shield recovery after 1.5 seconds of no damage
        if (this.shield < this.maxShield) {
            this.shield = Math.min(this.maxShield, this.shield + deltaTime * 0.7);
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
}

