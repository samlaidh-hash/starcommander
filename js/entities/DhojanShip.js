/**
 * Star Sea - Dhojan Ship Entity
 * Advanced faction with unique weapons and systems
 */

class DhojanShip extends Ship {
    constructor(config) {
        super(config);
        this.faction = 'DHOJAN';
        this.advancedSystems = this.initializeAdvancedSystems();
        // Old unique weapons removed - now using standard loadout system with gravBeam and gravityTorpedo
    }

    createShields() {
        // Dhojan ships use ReflectorShieldSystem instead of normal shields
        let maxStrength = 30; // Default (not used, but kept for compatibility)
        switch (this.shipClass) {
            case 'DD': maxStrength = 25; break;
            case 'CL': maxStrength = 35; break;
            case 'CA': maxStrength = 50; break;
            case 'BB': maxStrength = 70; break;
        }
        
        return new ReflectorShieldSystem({
            maxStrength: maxStrength
        });
    }

    initializeAdvancedSystems() {
        return {
            // Advanced sensor array with extended range
            advancedSensors: {
                range: 400, // Extended sensor range
                accuracy: 1.2, // 20% accuracy bonus
                stealthDetection: true, // Can detect cloaked ships
                active: true
            },
            // Quantum drive for instant teleportation
            quantumDrive: {
                range: 300,
                cooldown: 30.0, // 30 second cooldown
                lastUse: 0,
                lastUseTime: 0, // Track time for visual effects
                active: true
            },
            // Energy shield that absorbs and redirects damage
            energyShield: {
                absorptionRate: 0.3, // 30% damage absorption
                redirectDamage: 1.5, // 150% damage when redirected
                active: true
            }
        };
    }

    // Old unique weapons removed - now using standard loadout system
    // gravBeam and gravityTorpedo are defined in WEAPON_BUILDERS

    update(deltaTime, currentTime) {
        super.update(deltaTime, currentTime);
        
        // Update advanced systems
        this.updateAdvancedSystems(deltaTime, currentTime);
    }

    updateAdvancedSystems(deltaTime, currentTime) {
        // Update quantum drive cooldown
        if (this.advancedSystems.quantumDrive.lastUse > 0) {
            this.advancedSystems.quantumDrive.lastUse -= deltaTime;
        }
    }


    canUseQuantumDrive() {
        return this.advancedSystems.quantumDrive.active && 
               this.advancedSystems.quantumDrive.lastUse <= 0;
    }

    useQuantumDrive(targetX, targetY) {
        if (!this.canUseQuantumDrive()) return false;

        // Check if target is in range
        const distance = MathUtils.distance(this.x, this.y, targetX, targetY);
        if (distance > this.advancedSystems.quantumDrive.range) return false;

        // Teleport to target location
        this.x = targetX;
        this.y = targetY;
        
        // Update physics body position
        if (this.physicsComponent) {
            this.physicsComponent.body.setTransform(
                planck.Vec2(targetX, targetY),
                this.physicsComponent.body.getAngle()
            );
        }

        this.advancedSystems.quantumDrive.lastUse = this.advancedSystems.quantumDrive.cooldown;
        this.advancedSystems.quantumDrive.lastUseTime = performance.now() / 1000; // Track time for visual effects
        
        eventBus.emit('quantum-drive-used', { ship: this, newLocation: { x: targetX, y: targetY } });
        console.log('Quantum drive activated');
        
        return true;
    }


    takeDamage(damage, damageType = 'normal') {
        // Energy shield absorption
        if (this.advancedSystems.energyShield.active) {
            const absorbed = damage * this.advancedSystems.energyShield.absorptionRate;
            damage -= absorbed;
            
            // Redirect absorbed damage to nearby enemies
            this.redirectAbsorbedDamage(absorbed);
        }

        // Apply remaining damage
        super.takeDamage(damage, damageType);
    }

    redirectAbsorbedDamage(absorbedDamage) {
        const redirectDamage = absorbedDamage * this.advancedSystems.energyShield.redirectDamage;
        
        // Find nearest enemy
        let nearestEnemy = null;
        let nearestDistance = Infinity;

        for (const entity of window.game.entities) {
            if (entity.type === 'ship' && entity !== this && entity.active) {
                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance < nearestDistance && distance <= 100) { // 100 pixel range
                    nearestDistance = distance;
                    nearestEnemy = entity;
                }
            }
        }

        if (nearestEnemy) {
            nearestEnemy.takeDamage(redirectDamage);
            eventBus.emit('energy-shield-redirect', { 
                source: this, 
                target: nearestEnemy, 
                damage: redirectDamage 
            });
        }
    }

    getShipColor() {
        return '#aa00aa'; // Purple for Dhojan ships
    }

    getShipVertices() {
        // Unique Dhojan ship shape
        return [
            { x: 0, y: -15 },   // Nose
            { x: -8, y: -5 },    // Port wing
            { x: -12, y: 5 },   // Port wing tip
            { x: -6, y: 10 },   // Port rear
            { x: 6, y: 10 },    // Starboard rear
            { x: 12, y: 5 },    // Starboard wing tip
            { x: 8, y: -5 }     // Starboard wing
        ];
    }
}

