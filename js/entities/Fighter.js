/**
 * Star Sea - Fighter Entity
 * Fast, maneuverable, light weapons
 */

class Fighter extends Entity {
    constructor(config) {
        super(config.x, config.y);
        this.type = 'fighter';
        this.ownerShip = config.ownerShip;
        this.faction = config.faction || 'FEDERATION';
        this.mission = config.mission || 'ATTACK'; // Mission type: ATTACK, DEFENSE, PASSIVE, RECON

        // Fighter stats
        this.maxHp = 1;
        this.hp = 1;
        this.maxShield = 1;
        this.shield = 1;
        this.maxSpeed = this.ownerShip.maxSpeed * 0.8; // 80% of ship speed
        this.acceleration = this.ownerShip.acceleration * 1.2; // More responsive
        this.turnRate = this.ownerShip.turnRate * 2.0; // Much more maneuverable

        // Visual properties
        this.radius = 6;
        this.color = this.getFighterColor();
        this.vertices = this.generateFighterVertices();

        // AI behavior
        this.aiState = 'PATROL';
        this.target = null;
        this.lastStateChange = 0;
        this.weaponCooldown = 0;
        this.beamRange = CONFIG.BEAM_RANGE_PIXELS * 0.3; // 30% of ship beam range
        this.beamDamage = 0.5; // Half damage of ship beams

        // Special ability: Beam Jamming (like Drones)
        this.jammingPower = 0.3; // Adds 0.3s to target ship beam cooldown per hit

        // Physics
        this.physicsWorld = config.physicsWorld;
        if (this.physicsWorld) {
            this.createPhysicsBody();
        }
    }

    getFighterColor() {
        switch (this.faction) {
            case 'FEDERATION': return '#4444ff';
            case 'TRIGON': return '#ff4444';
            case 'SCINTILIAN': return '#44ff44';
            case 'PIRATE': return '#ffaa44';
            default: return '#ffffff';
        }
    }

    generateFighterVertices() {
        // Small, sleek fighter shape
        return [
            { x: 0, y: -6 },   // Nose
            { x: -3, y: 3 },   // Port wing
            { x: 3, y: 3 }     // Starboard wing
        ];
    }

    createPhysicsBody() {
        const body = this.physicsWorld.createCircleBody(this.x, this.y, this.radius, {
            type: 'dynamic',
            density: 0.3,
            restitution: 0.9,
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

        // Update weapon cooldown
        if (this.weaponCooldown > 0) {
            this.weaponCooldown -= deltaTime;
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

            // Fire at enemy if in range and in forward arc
            if (nearestDistance <= this.beamRange && this.weaponCooldown <= 0) {
                if (this.isTargetInForwardArc(nearestEnemy.x, nearestEnemy.y)) {
                    this.fireBeam(nearestEnemy.x, nearestEnemy.y, nearestEnemy);
                    this.weaponCooldown = 0.5; // Fast firing rate
                }
            }
        } else {
            // Patrol around owner
            this.patrolAroundOwner(deltaTime);
        }
    }

    executeDefenseMission(deltaTime, allEntities) {
        // Orbit owner ship and intercept threats
        const ownerDistance = MathUtils.distance(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        const defenseRadius = 100;

        // Find closest threat within defense radius
        let nearestThreat = null;
        let nearestThreatDistance = Infinity;

        for (const entity of allEntities) {
            if (!entity.active) continue;

            // Check for torpedoes or enemy ships near owner
            let isThreat = false;
            if (entity.type === 'torpedo' && entity.sourceShip !== this.ownerShip) {
                const threatToOwner = MathUtils.distance(entity.x, entity.y, this.ownerShip.x, this.ownerShip.y);
                if (threatToOwner < defenseRadius * 2) isThreat = true;
            } else if (entity.type === 'ship' && entity !== this.ownerShip) {
                const threatToOwner = MathUtils.distance(entity.x, entity.y, this.ownerShip.x, this.ownerShip.y);
                if (threatToOwner < defenseRadius) isThreat = true;
            }

            if (isThreat) {
                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance < nearestThreatDistance) {
                    nearestThreatDistance = distance;
                    nearestThreat = entity;
                }
            }
        }

        if (nearestThreat) {
            // Intercept threat
            const angleToThreat = MathUtils.angleBetween(this.x, this.y, nearestThreat.x, nearestThreat.y);
            this.turnTowardsAngle(angleToThreat, deltaTime);
            this.applyThrust(1.0, deltaTime);

            if (nearestThreatDistance <= this.beamRange && this.weaponCooldown <= 0) {
                if (this.isTargetInForwardArc(nearestThreat.x, nearestThreat.y)) {
                    this.fireBeam(nearestThreat.x, nearestThreat.y, nearestThreat);
                    this.weaponCooldown = 0.5;
                }
            }
        } else {
            // Orbit owner ship
            const angleToOwner = MathUtils.angleBetween(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
            const orbitAngle = angleToOwner + 90;
            this.turnTowardsAngle(orbitAngle, deltaTime);

            // Maintain orbit distance
            if (ownerDistance < defenseRadius * 0.8) {
                this.applyThrust(-0.3, deltaTime); // Back away
            } else if (ownerDistance > defenseRadius * 1.2) {
                this.applyThrust(0.8, deltaTime); // Move closer
            } else {
                this.applyThrust(0.4, deltaTime); // Maintain orbit
            }
        }
    }

    executePassiveMission(deltaTime) {
        // Formation follow - stay near owner, avoid combat
        const angleToOwner = MathUtils.angleBetween(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        const distance = MathUtils.distance(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        const formationDistance = 50;

        if (distance > formationDistance) {
            // Follow owner
            this.turnTowardsAngle(angleToOwner, deltaTime);
            this.applyThrust(0.7, deltaTime);
        } else {
            // Maintain position
            const formationAngle = angleToOwner + 120; // Offset position
            this.turnTowardsAngle(formationAngle, deltaTime);
            this.applyThrust(0.3, deltaTime);
        }
    }

    executeReconMission(deltaTime, allEntities) {
        // Scout ahead of owner ship
        const scoutDistance = 200;
        const angleToOwner = MathUtils.angleBetween(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        const scoutAngle = this.ownerShip.rotation; // Face where owner is facing
        const distance = MathUtils.distance(this.x, this.y, this.ownerShip.x, this.ownerShip.y);

        if (distance < scoutDistance) {
            // Move ahead of owner
            this.turnTowardsAngle(scoutAngle, deltaTime);
            this.applyThrust(0.8, deltaTime);
        } else {
            // Circle and scan
            const scanAngle = scoutAngle + (currentTime * 30) % 360; // Slow circle
            this.turnTowardsAngle(scanAngle, deltaTime);
            this.applyThrust(0.4, deltaTime);
        }
    }

    patrolAroundOwner(deltaTime) {
        const angleToOwner = MathUtils.angleBetween(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        const patrolAngle = angleToOwner + 45; // Orbit 45 degrees offset
        this.turnTowardsAngle(patrolAngle, deltaTime);
        this.applyThrust(0.7, deltaTime);
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

    fireBeam(targetX, targetY, target = null) {
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

        // Apply beam jamming if target is a ship
        if (target && target.type === 'ship') {
            this.applyBeamJamming(target);
        }

        eventBus.emit('fighter-fired-beam', { fighter: this, projectile: beam });
    }

    applyBeamJamming(targetShip) {
        // Add cooldown delay to target ship's beam weapons
        if (targetShip.weapons) {
            for (const weapon of targetShip.weapons) {
                if (weapon.type === 'beam' || weapon.weaponType === 'beam') {
                    // Add jamming delay to weapon cooldown
                    if (weapon.lastFireTime !== undefined) {
                        weapon.lastFireTime += this.jammingPower;
                    }
                }
            }
            // Visual feedback for jammed ship (could add indicator)
            if (targetShip.isPlayer) {
                console.log('⚡ Ship beams jammed by Fighter! (+0.3s cooldown)');
            }
        }
    }

    updateShieldRecovery(deltaTime, currentTime) {
        // Shield recovery after 1 second of no damage
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
}

