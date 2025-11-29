/**
 * Star Sea - Andromedan Ship Entity
 * Advanced faction with unique weapons and systems
 */

class AndromedanShip extends Ship {
    constructor(config) {
        super(config);
        this.faction = 'ANDROMEDAN';
        this.advancedSystems = this.initializeAdvancedSystems();
        this.uniqueWeapons = this.initializeUniqueWeapons();
    }

    initializeAdvancedSystems() {
        return {
            // Advanced cloaking system
            cloakingDevice: {
                active: false,
                energyDrain: 0.5, // Drains 0.5 energy per second while active
                cooldown: 10.0, // 10 second cooldown after deactivating
                lastUse: 0
            },
            // Phase shift for temporary invulnerability
            phaseShift: {
                duration: 2.0, // 2 seconds of invulnerability
                cooldown: 30.0, // 30 second cooldown
                lastUse: 0,
                active: false,
                activationTime: 0
            },
            // Advanced sensor jammer
            sensorJammer: {
                range: 200,
                effectiveness: 0.7, // 70% reduction in enemy accuracy
                active: true
            }
        };
    }

    initializeUniqueWeapons() {
        return {
            // Phase torpedo that phases through shields and hull
            phaseTorpedo: {
                damage: 2.5,
                shieldPenetration: true,
                hullPenetration: true, // Can pass through hull
                range: 350,
                speed: 220,
                cooldown: 6.0,
                lastFire: 0
            },
            // Disruptor pulse with area effect
            disruptorPulse: {
                damage: 2,
                blastRadius: 60,
                range: 180,
                cooldown: 4.0,
                lastFire: 0
            },
            // Phase beam that ignores shields
            phaseBeam: {
                damage: 1.8,
                shieldPenetration: true,
                range: 220,
                cooldown: 3.0,
                lastFire: 0
            }
        };
    }

    update(deltaTime, currentTime) {
        super.update(deltaTime, currentTime);
        
        // Update advanced systems
        this.updateAdvancedSystems(deltaTime, currentTime);
        
        // Update unique weapons
        this.updateUniqueWeapons(deltaTime, currentTime);
    }

    updateAdvancedSystems(deltaTime, currentTime) {
        // Update cloaking device
        if (this.advancedSystems.cloakingDevice.active) {
            // Cloaking drains energy
            if (this.energy) {
                this.energy.drain(this.advancedSystems.cloakingDevice.energyDrain * deltaTime);
            }
        }
        
        // Update phase shift
        if (this.advancedSystems.phaseShift.active) {
            const elapsed = currentTime - this.advancedSystems.phaseShift.activationTime;
            if (elapsed >= this.advancedSystems.phaseShift.duration) {
                this.advancedSystems.phaseShift.active = false;
                this.advancedSystems.phaseShift.lastUse = this.advancedSystems.phaseShift.cooldown;
            }
        }
        
        // Update cooldowns
        if (this.advancedSystems.cloakingDevice.lastUse > 0) {
            this.advancedSystems.cloakingDevice.lastUse -= deltaTime;
        }
        if (this.advancedSystems.phaseShift.lastUse > 0) {
            this.advancedSystems.phaseShift.lastUse -= deltaTime;
        }
    }

    updateUniqueWeapons(deltaTime, currentTime) {
        // Update weapon cooldowns
        for (const weapon of Object.values(this.uniqueWeapons)) {
            if (weapon.lastFire > 0) {
                weapon.lastFire -= deltaTime;
            }
        }
    }

    /**
     * Check if ship is cloaked (override to check advanced cloaking device)
     */
    isCloaked() {
        // Check both standard cloak system and Andromedan advanced cloaking device
        if (this.systems && this.systems.cloak && this.systems.cloak.cloaked) {
            return true;
        }
        return this.advancedSystems && this.advancedSystems.cloakingDevice && this.advancedSystems.cloakingDevice.active;
    }

    activateCloak() {
        if (this.advancedSystems.cloakingDevice.lastUse <= 0 && !this.advancedSystems.cloakingDevice.active) {
            this.advancedSystems.cloakingDevice.active = true;
            eventBus.emit('cloak-activated', { ship: this });
            return true;
        }
        return false;
    }

    deactivateCloak() {
        if (this.advancedSystems.cloakingDevice.active) {
            this.advancedSystems.cloakingDevice.active = false;
            this.advancedSystems.cloakingDevice.lastUse = this.advancedSystems.cloakingDevice.cooldown;
            eventBus.emit('cloak-deactivated', { ship: this });
            return true;
        }
        return false;
    }

    activatePhaseShift(currentTime) {
        if (this.advancedSystems.phaseShift.lastUse <= 0 && !this.advancedSystems.phaseShift.active) {
            this.advancedSystems.phaseShift.active = true;
            this.advancedSystems.phaseShift.activationTime = currentTime || (performance.now() / 1000);
            eventBus.emit('phase-shift-activated', { ship: this });
            return true;
        }
        return false;
    }

    firePhaseTorpedo(targetX, targetY) {
        const weapon = this.uniqueWeapons.phaseTorpedo;
        if (weapon.lastFire > 0) return null;

        const projectile = new PhaseTorpedo({
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: weapon.damage,
            shieldPenetration: weapon.shieldPenetration,
            hullPenetration: weapon.hullPenetration,
            range: weapon.range,
            speed: weapon.speed,
            sourceShip: this
        });

        weapon.lastFire = weapon.cooldown;
        return projectile;
    }

    fireDisruptorPulse(targetX, targetY) {
        const weapon = this.uniqueWeapons.disruptorPulse;
        if (weapon.lastFire > 0) return null;

        const projectile = new DisruptorPulse({
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: weapon.damage,
            blastRadius: weapon.blastRadius,
            range: weapon.range,
            sourceShip: this
        });

        weapon.lastFire = weapon.cooldown;
        return projectile;
    }

    firePhaseBeam(targetX, targetY) {
        const weapon = this.uniqueWeapons.phaseBeam;
        if (weapon.lastFire > 0) return null;

        const projectile = new PhaseBeam({
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: weapon.damage,
            shieldPenetration: weapon.shieldPenetration,
            range: weapon.range,
            sourceShip: this
        });

        weapon.lastFire = weapon.cooldown;
        return projectile;
    }

    takeDamage(damage, damageType = 'normal') {
        // Phase shift makes ship invulnerable
        if (this.advancedSystems.phaseShift.active) {
            eventBus.emit('phase-shift-blocked', { ship: this, damage: damage });
            return; // No damage taken
        }

        // Apply damage normally
        super.takeDamage(damage, damageType);
    }

    getShipColor() {
        return '#00aaff'; // Cyan for Andromedan ships
    }

    getShipVertices() {
        // Unique Andromedan ship shape
        return [
            { x: 0, y: -12 },   // Nose
            { x: -6, y: -4 },   // Port wing
            { x: -10, y: 3 },   // Port wing tip
            { x: -5, y: 8 },    // Port rear
            { x: 0, y: 12 },    // Rear center
            { x: 5, y: 8 },     // Starboard rear
            { x: 10, y: 3 },    // Starboard wing tip
            { x: 6, y: -4 }     // Starboard wing
        ];
    }
}

