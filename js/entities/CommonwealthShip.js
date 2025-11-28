/**
 * Star Sea - Commonwealth Ship Entity
 * Advanced faction with laser-based weapons
 */

class CommonwealthShip extends Ship {
    constructor(config) {
        super(config);
        this.faction = 'COMMONWEALTH';
        this.laserSystems = this.initializeLaserSystems();
        // Old unique weapons removed - now using standard loadout system with quantumTorpedo and streakBeam
    }

    initializeLaserSystems() {
        return {
            // Laser battery with multiple firing points
            laserBattery: {
                firingPoints: 10,
                shotInterval: 0.2,
                rechargeTime: 4.0,
                damage: 1.5,
                range: 200,
                active: true
            },
            // Laser shield that reflects beam weapons
            laserShield: {
                reflectionChance: 0.6, // 60% chance to reflect
                reflectionDamage: 0.5, // 50% damage when reflected
                active: true
            },
            // Laser targeting system for improved accuracy
            laserTargeting: {
                accuracyBonus: 0.3, // 30% accuracy bonus
                rangeBonus: 0.2, // 20% range bonus
                active: true
            }
        };
    }

    // Old unique weapons removed - now using standard loadout system
    // quantumTorpedo and streakBeam are defined in WEAPON_BUILDERS

    update(deltaTime, currentTime) {
        super.update(deltaTime, currentTime);
        
        // Update laser systems
        this.updateLaserSystems(deltaTime, currentTime);
    }

    updateLaserSystems(deltaTime, currentTime) {
        // Update laser battery firing points
        if (this.laserSystems.laserBattery.active) {
            // This would be handled by the LaserBattery component
        }
    }


    takeDamage(damage, damageType = 'normal') {
        // Laser shield reflection
        if (this.laserSystems.laserShield.active && damageType === 'beam') {
            if (Math.random() < this.laserSystems.laserShield.reflectionChance) {
                // Reflect beam damage
                this.reflectBeamDamage(damage);
                return;
            }
        }

        // Apply damage normally
        super.takeDamage(damage, damageType);
    }

    reflectBeamDamage(damage) {
        // Find nearest enemy to reflect damage to
        let nearestEnemy = null;
        let nearestDistance = Infinity;

        for (const entity of window.game.entities) {
            if (entity.type === 'ship' && entity !== this && entity.active) {
                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance < nearestDistance && distance <= 200) { // 200 pixel range
                    nearestDistance = distance;
                    nearestEnemy = entity;
                }
            }
        }

        if (nearestEnemy) {
            const reflectedDamage = damage * this.laserSystems.laserShield.reflectionDamage;
            nearestEnemy.takeDamage(reflectedDamage, 'beam');
            eventBus.emit('laser-shield-reflect', { 
                source: this, 
                target: nearestEnemy, 
                damage: reflectedDamage 
            });
        }
    }

    getShipColor() {
        return '#00aa00'; // Green for Commonwealth ships
    }

    getShipVertices() {
        // Unique Commonwealth ship shape
        return [
            { x: 0, y: -10 },   // Nose
            { x: -5, y: -2 },   // Port wing
            { x: -8, y: 4 },    // Port wing tip
            { x: -3, y: 8 },    // Port rear
            { x: 0, y: 10 },    // Rear center
            { x: 3, y: 8 },     // Starboard rear
            { x: 8, y: 4 },     // Starboard wing tip
            { x: 5, y: -2 }     // Starboard wing
        ];
    }
}

