/**
 * Star Sea - Drone Entity
 * Trigon faction's answer to fighters - faster, lighter, electronic warfare capable
 * Specialty: Beam jamming - hits add cooldown delay to enemy ship weapons
 */

class Drone extends Entity {
    constructor(config) {
        super(config.x, config.y);
        this.type = 'drone';
        this.ownerShip = config.ownerShip;
        this.faction = config.faction || 'TRIGON';
        this.mission = config.mission || 'ATTACK'; // Mission type: ATTACK, DEFENSE, WILD_WEASEL

        // Drone stats (fast, fragile, electronic warfare)
        this.maxHp = 1;
        this.hp = 1;
        this.maxShield = 2;
        this.shield = 2;
        this.maxSpeed = this.ownerShip.maxSpeed * 0.9; // 90% - faster than fighter
        this.acceleration = this.ownerShip.acceleration * 1.3; // Very responsive
        this.turnRate = this.ownerShip.turnRate * 1.8; // Highly maneuverable

        // Visual properties (smallest craft)
        this.radius = 5;
        this.color = this.getDroneColor();
        this.vertices = this.generateDroneVertices();

        // AI behavior
        this.aiState = 'PATROL';
        this.target = null;
        this.lastStateChange = 0;
        this.weaponCooldown = 0;
        this.beamRange = CONFIG.BEAM_RANGE_PIXELS * 0.25; // 25% of ship beam range
        this.beamDamage = 0.5; // Weak damage
        this.beamCooldown = 0.5; // Fast firing rate

        // Special ability: Beam Jamming
        this.jammingPower = 0.3; // Adds 0.3s to target ship beam cooldown per hit

        // Physics
        this.physicsWorld = config.physicsWorld;
        if (this.physicsWorld) {
            this.createPhysicsBody();
        }
    }

    getDroneColor() {
        // Drones are typically Trigon (red/orange theme)
        switch (this.faction) {
            case 'TRIGON': return '#ff6600'; // Orange
            case 'FEDERATION': return '#00aaff'; // Cyan (if Federation uses drones)
            case 'SCINTILIAN': return '#88ff44'; // Lime
            case 'PIRATE': return '#cc6600'; // Dark orange
            default: return '#ff8800';
        }
    }

    generateDroneVertices() {
        // Small, compact drone shape (hexagonal)
        const r = this.radius;
        return [
            { x: 0, y: -r },        // Front point
            { x: r * 0.5, y: -r * 0.5 },
            { x: r * 0.5, y: r * 0.5 },
            { x: 0, y: r },         // Rear point
            { x: -r * 0.5, y: r * 0.5 },
            { x: -r * 0.5, y: -r * 0.5 }
        ];
    }

    update(deltaTime, currentTime, allEntities) {
        if (!this.active) return;

        // Update shield recovery
        this.updateShieldRecovery(deltaTime, currentTime);

        // Update weapon cooldown
        if (this.weaponCooldown > 0) {
            this.weaponCooldown -= deltaTime;
        }

        // Execute mission-based AI
        this.executeMission(deltaTime, currentTime, allEntities);

        // Call parent update for physics
        if (this.physicsBody) {
            super.update(deltaTime);
        }
    }

    executeMission(deltaTime, currentTime, allEntities) {
        switch (this.mission) {
            case 'ATTACK':
                this.executeAttackMission(deltaTime, currentTime, allEntities);
                break;
            case 'DEFENSE':
                this.executeDefenseMission(deltaTime, currentTime, allEntities);
                break;
            case 'WILD_WEASEL':
                this.executeWildWeaselMission(deltaTime, currentTime, allEntities);
                break;
            default:
                this.executeAttackMission(deltaTime, currentTime, allEntities);
        }
    }

    executeAttackMission(deltaTime, currentTime, allEntities) {
        // Find nearest enemy ship
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
                    this.fireBeam(nearestEnemy);
                    this.weaponCooldown = this.beamCooldown;
                }
            }
        } else {
            // No enemies, patrol around owner
            this.patrolAroundOwner(deltaTime);
        }
    }

    executeDefenseMission(deltaTime, currentTime, allEntities) {
        // Find nearest threat (prioritize torpedoes, then enemy craft, then ships)
        let target = null;
        let targetDistance = Infinity;

        for (const entity of allEntities) {
            if (!entity.active) continue;

            let shouldIntercept = false;
            if (entity.type === 'torpedo' && entity.sourceShip !== this.ownerShip) {
                shouldIntercept = true;
            } else if ((entity.type === 'fighter' || entity.type === 'bomber' || entity.type === 'drone') && entity.ownerShip !== this.ownerShip) {
                shouldIntercept = true;
            } else if (entity.type === 'ship' && entity !== this.ownerShip) {
                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance <= 100) { // Defensive range
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

            // Fire if in range and forward arc
            if (targetDistance <= this.beamRange && this.weaponCooldown <= 0) {
                if (this.isTargetInForwardArc(target.x, target.y)) {
                    this.fireBeam(target);
                    this.weaponCooldown = this.beamCooldown;
                }
            }
        } else {
            // Patrol near owner ship
            this.patrolAroundOwner(deltaTime);
        }
    }

    executeWildWeaselMission(deltaTime, currentTime, allEntities) {
        // Fly away from owner ship, emitting signals to attract torpedoes
        const angleAwayFromOwner = MathUtils.angleBetween(this.ownerShip.x, this.ownerShip.y, this.x, this.y);
        this.turnTowardsAngle(angleAwayFromOwner, deltaTime);
        this.applyThrust(1.0, deltaTime);

        // Attract nearby torpedoes (this would be handled by torpedo AI in a full implementation)
        // For now, just maintain high speed and distance
    }

    isTargetInForwardArc(targetX, targetY) {
        // Check if target is within 90° forward arc
        const angleToTarget = MathUtils.angleBetween(this.x, this.y, targetX, targetY);
        const angleDiff = MathUtils.normalizeAngle(angleToTarget - this.rotation);
        return Math.abs(angleDiff) <= 45; // 90° arc total (±45°)
    }

    fireBeam(target) {
        // Drone fires a weak beam with jamming effect
        // Note: Actual projectile creation would be handled by the game engine
        // Here we just apply the jamming effect if target is a ship

        if (target && target.type === 'ship') {
            // Apply beam jamming to target ship
            this.applyBeamJamming(target);
        }

        // Visual/audio feedback would be triggered here
        console.log(`Drone fired beam at ${target.type} (jamming applied)`);
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
                console.log('⚡ Ship beams jammed! (+0.3s cooldown)');
            }
        }
    }

    patrolAroundOwner(deltaTime) {
        if (!this.ownerShip) return;

        // Orbit around owner ship at 50-90 pixel radius
        const distance = MathUtils.distance(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        const patrolRadius = 70;

        if (distance < patrolRadius - 10) {
            // Too close, move away
            const angleAway = MathUtils.angleBetween(this.ownerShip.x, this.ownerShip.y, this.x, this.y);
            this.turnTowardsAngle(angleAway, deltaTime);
            this.applyThrust(0.5, deltaTime);
        } else if (distance > patrolRadius + 10) {
            // Too far, move closer
            const angleToOwner = MathUtils.angleBetween(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
            this.turnTowardsAngle(angleToOwner, deltaTime);
            this.applyThrust(1.0, deltaTime);
        } else {
            // At correct distance, orbit
            const angleToOwner = MathUtils.angleBetween(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
            const orbitAngle = angleToOwner + 90; // Perpendicular for circular orbit
            this.turnTowardsAngle(orbitAngle, deltaTime);
            this.applyThrust(0.7, deltaTime);
        }
    }

    turnTowardsAngle(targetAngle, deltaTime) {
        const angleDiff = MathUtils.normalizeAngle(targetAngle - this.rotation);
        const turnAmount = this.turnRate * deltaTime;

        if (Math.abs(angleDiff) < turnAmount) {
            this.rotation = targetAngle;
        } else if (angleDiff > 0) {
            this.rotation += turnAmount;
        } else {
            this.rotation -= turnAmount;
        }

        this.rotation = MathUtils.normalizeAngle(this.rotation);
    }

    applyThrust(power, deltaTime) {
        const thrustForce = this.acceleration * power;
        const thrustX = Math.cos(MathUtils.toRadians(this.rotation)) * thrustForce * deltaTime;
        const thrustY = Math.sin(MathUtils.toRadians(this.rotation)) * thrustForce * deltaTime;

        this.velocityX += thrustX;
        this.velocityY += thrustY;

        // Limit speed
        const speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.velocityX *= scale;
            this.velocityY *= scale;
        }
    }

    updateShieldRecovery(deltaTime, currentTime) {
        // Simple shield recharge: 1pt/second after 2 second no-hit period
        // (Full implementation would track lastHitTime)
        if (this.shield < this.maxShield) {
            this.shield = Math.min(this.maxShield, this.shield + deltaTime * 0.5);
        }
    }

    createPhysicsBody() {
        // Create physics body for collisions
        // (Implementation depends on physics system)
    }

    takeDamage(amount, source) {
        // Shields absorb damage first
        if (this.shield > 0) {
            this.shield -= amount;
            if (this.shield < 0) {
                this.hp += this.shield; // Overflow damage to HP
                this.shield = 0;
            }
        } else {
            this.hp -= amount;
        }

        // Destroy if HP depleted
        if (this.hp <= 0) {
            this.destroy();
        }
    }

    destroy() {
        this.active = false;
        // Explosion effect would be triggered here
        console.log('Drone destroyed');
    }
}
