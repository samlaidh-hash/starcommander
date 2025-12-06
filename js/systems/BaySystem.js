/**
 * Star Sea - Bay System
 * Manages shuttle and fighter/bomber launches, bay space limits
 */

class BaySystem {
    constructor() {
        this.playerShip = null;
        this.baySpace = 0;
        this.maxBaySpace = 0;
        this.launchedShuttles = [];
        this.launchedFighters = [];
        this.launchedBombers = [];
        this.launchedDrones = [];
        this.launchedProbes = [];
        this.defaultLoadouts = this.initializeDefaultLoadouts();
        
        // Launch cooldown system (4 seconds per bay)
        this.launchCooldowns = []; // Array of {bayIndex, endTime} for each bay
        this.launchCooldownDuration = 4.0; // 4 seconds cooldown per bay
    }

    init(playerShip) {
        this.playerShip = playerShip;
        this.maxBaySpace = this.calculateMaxBaySpace();
        this.baySpace = this.maxBaySpace;
        this.loadDefaultLoadout();
    }

    calculateMaxBaySpace() {
        // Bay space based on ship class
        // Design doc: FG=2, DD=3, CL=4, CS=5, CA=5, BC=6, BB=7, DN=8, SD=9
        const shipClass = this.playerShip.shipClass;
        switch (shipClass) {
            case 'FG': return 2; // Frigate - 2 bay spaces
            case 'DD': return 3; // Destroyer - 3 bay spaces
            case 'CL': return 4; // Light Cruiser - 4 bay spaces
            case 'CS': return 5; // Strike Cruiser - 5 bay spaces (same as CA)
            case 'CA': return 5; // Heavy Cruiser - 5 bay spaces
            case 'BC': return 6; // Battlecruiser - 6 bay spaces
            case 'BB': return 7; // Battleship - 7 bay spaces
            case 'DN': return 8; // Dreadnought - 8 bay spaces
            case 'SD': return 9; // Super Dreadnought - 9 bay spaces
            default: return 5; // Default to CA (Heavy Cruiser)
        }
    }

    initializeDefaultLoadouts() {
        // Default loadouts based on bay spaces
        // Design Doc: "Each ship gets 1 Shuttle and 1 Mine by default, randomise the other Bay slots"
        // Bay spaces: DD=4, CL=6, CA=8, BC=10 (FG, DN, SD not currently used)
        return {
            'FEDERATION': {
                'FG': { shuttles: 1, fighters: 0, bombers: 0 },  // 2 spaces: 1 shuttle, 1 free
                'DD': { shuttles: 1, fighters: 1, bombers: 0 },  // 3 spaces: 1 shuttle, 1 fighter, 1 free
                'CL': { shuttles: 2, fighters: 1, bombers: 0 },  // 4 spaces: 2 shuttles, 1 fighter, 1 free
                'CS': { shuttles: 2, fighters: 1, bombers: 1 },  // 5 spaces: 2 shuttles, 1 fighter, 1 bomber, 1 free
                'CA': { shuttles: 2, fighters: 1, bombers: 1 },  // 5 spaces: 2 shuttles, 1 fighter, 1 bomber, 1 free
                'BC': { shuttles: 2, fighters: 2, bombers: 1 },  // 6 spaces: 2 shuttles, 2 fighters, 1 bomber, 1 free
                'BB': { shuttles: 3, fighters: 2, bombers: 1 },  // 7 spaces: 3 shuttles, 2 fighters, 1 bomber, 1 free
                'DN': { shuttles: 3, fighters: 2, bombers: 2 },  // 8 spaces: 3 shuttles, 2 fighters, 2 bombers, 1 free
                'SD': { shuttles: 3, fighters: 3, bombers: 2 }   // 9 spaces: 3 shuttles, 3 fighters, 2 bombers, 1 free
            },
            'TRIGON': {
                'FG': { shuttles: 1, fighters: 1, bombers: 0 },  // 2 spaces: 1 drone, 1 fighter
                'DD': { shuttles: 1, fighters: 1, bombers: 0 },  // 3 spaces: 1 drone, 1 fighter, 1 free
                'CL': { shuttles: 2, fighters: 1, bombers: 0 },  // 4 spaces: 2 drones, 1 fighter, 1 free
                'CS': { shuttles: 2, fighters: 1, bombers: 1 },  // 5 spaces
                'CA': { shuttles: 2, fighters: 2, bombers: 1 },  // 5 spaces
                'BC': { shuttles: 2, fighters: 2, bombers: 1 },  // 6 spaces
                'BB': { shuttles: 3, fighters: 2, bombers: 1 },  // 7 spaces
                'DN': { shuttles: 3, fighters: 3, bombers: 1 },  // 8 spaces
                'SD': { shuttles: 3, fighters: 3, bombers: 2 }   // 9 spaces
            },
            'SCINTILIAN': {
                'FG': { shuttles: 0, fighters: 2, bombers: 0 },  // 2 spaces: 2 fighters (fighter-focused)
                'DD': { shuttles: 1, fighters: 2, bombers: 0 },  // 3 spaces
                'CL': { shuttles: 1, fighters: 2, bombers: 0 },  // 4 spaces
                'CS': { shuttles: 1, fighters: 2, bombers: 1 },  // 5 spaces
                'CA': { shuttles: 2, fighters: 2, bombers: 1 },  // 5 spaces
                'BC': { shuttles: 2, fighters: 3, bombers: 1 },  // 6 spaces
                'BB': { shuttles: 2, fighters: 3, bombers: 1 },  // 7 spaces
                'DN': { shuttles: 3, fighters: 3, bombers: 1 },  // 8 spaces
                'SD': { shuttles: 3, fighters: 3, bombers: 2 }   // 9 spaces
            },
            'PIRATE': {
                'FG': { shuttles: 1, fighters: 1, bombers: 0 },  // 2 spaces
                'DD': { shuttles: 1, fighters: 1, bombers: 0 },  // 3 spaces
                'CL': { shuttles: 2, fighters: 1, bombers: 0 },  // 4 spaces
                'CS': { shuttles: 2, fighters: 1, bombers: 1 },  // 5 spaces
                'CA': { shuttles: 2, fighters: 2, bombers: 1 },  // 5 spaces
                'BC': { shuttles: 2, fighters: 2, bombers: 1 },  // 6 spaces
                'BB': { shuttles: 3, fighters: 2, bombers: 1 },  // 7 spaces
                'DN': { shuttles: 3, fighters: 2, bombers: 2 },  // 8 spaces
                'SD': { shuttles: 3, fighters: 3, bombers: 2 }   // 9 spaces
            },
            'PLAYER': {
                'FG': { shuttles: 1, fighters: 0, bombers: 0 },
                'DD': { shuttles: 1, fighters: 1, bombers: 0 },
                'CL': { shuttles: 2, fighters: 1, bombers: 0 },
                'CS': { shuttles: 2, fighters: 1, bombers: 1 },
                'CA': { shuttles: 2, fighters: 1, bombers: 1 },
                'BC': { shuttles: 2, fighters: 2, bombers: 1 },
                'BB': { shuttles: 3, fighters: 2, bombers: 1 },
                'DN': { shuttles: 3, fighters: 2, bombers: 2 },
                'SD': { shuttles: 3, fighters: 3, bombers: 2 }
            }
        };
    }

    loadDefaultLoadout() {
        const faction = this.playerShip.faction;
        const shipClass = this.playerShip.shipClass;
        
        if (this.defaultLoadouts[faction] && this.defaultLoadouts[faction][shipClass]) {
            const loadout = this.defaultLoadouts[faction][shipClass];
            this.baySpace = this.maxBaySpace - this.calculateLoadoutSpace(loadout);
        }
    }

    calculateLoadoutSpace(loadout) {
        return (loadout.shuttles || 0) + (loadout.fighters || 0) + (loadout.bombers || 0);
    }

    /**
     * Get number of available bays (bays not on cooldown)
     */
    getAvailableBays(currentTime) {
        const totalBays = this.maxBaySpace;
        const onCooldown = this.launchCooldowns.filter(cd => currentTime < cd.endTime).length;
        return Math.max(0, totalBays - onCooldown);
    }

    /**
     * Check if any bay is available for launch
     */
    hasAvailableBay(currentTime) {
        return this.getAvailableBays(currentTime) > 0;
    }

    canLaunchShuttle(missionType, currentTime = null) {
        if (!this.baySpace >= 1) return false;
        if (currentTime === null) currentTime = performance.now() / 1000;
        return this.hasAvailableBay(currentTime);
    }

    canLaunchFighter(currentTime = null) {
        if (!this.baySpace >= 1) return false;
        if (currentTime === null) currentTime = performance.now() / 1000;
        return this.hasAvailableBay(currentTime);
    }

    canLaunchBomber(currentTime = null) {
        if (!this.baySpace >= 2) return false; // Bombers take 2 bay spaces
        if (currentTime === null) currentTime = performance.now() / 1000;
        // Bombers need 2 available bays
        return this.getAvailableBays(currentTime) >= 2;
    }

    launchShuttle(missionType, target = null) {
        const currentTime = performance.now() / 1000;
        if (!this.canLaunchShuttle(missionType, currentTime)) {
            if (!this.hasAvailableBay(currentTime)) {
                console.log('All bays on cooldown (4s per bay)');
            } else {
                console.log('Not enough bay space to launch shuttle');
            }
            return null;
        }

        // Find an available bay and set cooldown
        const availableBay = this.findAvailableBay(currentTime);
        if (availableBay === -1) {
            console.log('No available bay for launch');
            return null;
        }

        // Calculate launch position (behind ship)
        const launchDistance = this.playerShip.radius + 20;
        const launchAngle = this.playerShip.rotation + 180; // Behind ship
        const launchX = this.playerShip.x + Math.cos(MathUtils.toRadians(launchAngle)) * launchDistance;
        const launchY = this.playerShip.y + Math.sin(MathUtils.toRadians(launchAngle)) * launchDistance;

        const shuttle = new Shuttle({
            x: launchX,
            y: launchY,
            ownerShip: this.playerShip,
            missionType: missionType,
            missionTarget: target,
            physicsWorld: this.playerShip.physicsWorld
        });

        // Apply Operations crew skill bonus to craft stats
        if (this.playerShip.crewSkills) {
            const bonuses = this.playerShip.crewSkills.getOperationsBonuses();
            shuttle.maxHp *= bonuses.craftEfficiencyMult;
            shuttle.hp *= bonuses.craftEfficiencyMult;
            shuttle.maxSpeed *= bonuses.craftEfficiencyMult;
            shuttle.acceleration *= bonuses.craftEfficiencyMult;
        }

        this.launchedShuttles.push(shuttle);
        this.baySpace -= 1;

        // Set cooldown for this bay (4 seconds)
        this.setBayCooldown(availableBay, currentTime);

        eventBus.emit('shuttle-launched', { shuttle: shuttle, missionType: missionType });
        return shuttle;
    }

    /**
     * Find an available bay index (not on cooldown)
     */
    findAvailableBay(currentTime) {
        // Find first bay not on cooldown
        for (let i = 0; i < this.maxBaySpace; i++) {
            const onCooldown = this.launchCooldowns.some(cd => cd.bayIndex === i && currentTime < cd.endTime);
            if (!onCooldown) {
                return i;
            }
        }
        return -1; // No available bay
    }

    /**
     * Set cooldown for a specific bay
     */
    setBayCooldown(bayIndex, currentTime) {
        // Remove existing cooldown for this bay
        this.launchCooldowns = this.launchCooldowns.filter(cd => cd.bayIndex !== bayIndex);
        // Add new cooldown
        this.launchCooldowns.push({
            bayIndex: bayIndex,
            endTime: currentTime + this.launchCooldownDuration
        });
    }

    /**
     * Update launch cooldowns (call each frame)
     */
    updateCooldowns(currentTime) {
        // Remove expired cooldowns
        this.launchCooldowns = this.launchCooldowns.filter(cd => currentTime < cd.endTime);
    }

    launchFighter() {
        const currentTime = performance.now() / 1000;
        if (!this.canLaunchFighter(currentTime)) {
            if (!this.hasAvailableBay(currentTime)) {
                console.log('All bays on cooldown (4s per bay)');
            } else {
                console.log('Not enough bay space to launch fighter');
            }
            return null;
        }

        // Find an available bay and set cooldown
        const availableBay = this.findAvailableBay(currentTime);
        if (availableBay === -1) {
            console.log('No available bay for launch');
            return null;
        }

        // Calculate launch position (port side of ship)
        const launchDistance = this.playerShip.radius + 15;
        const launchAngle = this.playerShip.rotation + 90; // Port side
        const launchX = this.playerShip.x + Math.cos(MathUtils.toRadians(launchAngle)) * launchDistance;
        const launchY = this.playerShip.y + Math.sin(MathUtils.toRadians(launchAngle)) * launchDistance;

        const fighter = new Fighter({
            x: launchX,
            y: launchY,
            ownerShip: this.playerShip,
            faction: this.playerShip.faction,
            physicsWorld: this.playerShip.physicsWorld
        });

        // Apply Operations crew skill bonus to craft stats
        if (this.playerShip.crewSkills) {
            const bonuses = this.playerShip.crewSkills.getOperationsBonuses();
            fighter.maxHp *= bonuses.craftEfficiencyMult;
            fighter.hp *= bonuses.craftEfficiencyMult;
            fighter.maxSpeed *= bonuses.craftEfficiencyMult;
            fighter.acceleration *= bonuses.craftEfficiencyMult;

            // Enhance weapon damage
            if (fighter.weapons) {
                for (const weapon of fighter.weapons) {
                    if (weapon.damage) {
                        weapon.damage *= bonuses.craftEfficiencyMult;
                    }
                }
            }
        }

        this.launchedFighters.push(fighter);
        this.baySpace -= 1;

        // Set cooldown for this bay (4 seconds)
        this.setBayCooldown(availableBay, currentTime);

        eventBus.emit('fighter-launched', { fighter: fighter });
        return fighter;
    }

    launchBomber() {
        const currentTime = performance.now() / 1000;
        if (!this.canLaunchBomber(currentTime)) {
            if (this.getAvailableBays(currentTime) < 2) {
                console.log('Not enough available bays (need 2, 4s cooldown per bay)');
            } else {
                console.log('Not enough bay space to launch bomber');
            }
            return null;
        }

        // Find two available bays and set cooldowns
        const bay1 = this.findAvailableBay(currentTime);
        if (bay1 === -1) {
            console.log('No available bay for bomber launch');
            return null;
        }
        let bay2 = -1;
        // Find a second available bay (different from bay1)
        for (let i = 0; i < this.maxBaySpace; i++) {
            if (i !== bay1) {
                const onCooldown = this.launchCooldowns.some(cd => cd.bayIndex === i && currentTime < cd.endTime);
                if (!onCooldown) {
                    bay2 = i;
                    break;
                }
            }
        }
        if (bay2 === -1) {
            console.log('Not enough available bays for bomber (need 2)');
            return null;
        }

        // Calculate launch position (starboard side of ship)
        const launchDistance = this.playerShip.radius + 15;
        const launchAngle = this.playerShip.rotation - 90; // Starboard side
        const launchX = this.playerShip.x + Math.cos(MathUtils.toRadians(launchAngle)) * launchDistance;
        const launchY = this.playerShip.y + Math.sin(MathUtils.toRadians(launchAngle)) * launchDistance;

        const bomber = new Bomber({
            x: launchX,
            y: launchY,
            ownerShip: this.playerShip,
            faction: this.playerShip.faction,
            physicsWorld: this.playerShip.physicsWorld
        });

        // Apply Operations crew skill bonus to craft stats
        if (this.playerShip.crewSkills) {
            const bonuses = this.playerShip.crewSkills.getOperationsBonuses();
            bomber.maxHp *= bonuses.craftEfficiencyMult;
            bomber.hp *= bonuses.craftEfficiencyMult;
            bomber.maxSpeed *= bonuses.craftEfficiencyMult;
            bomber.acceleration *= bonuses.craftEfficiencyMult;

            // Enhance weapon damage
            if (bomber.weapons) {
                for (const weapon of bomber.weapons) {
                    if (weapon.damage) {
                        weapon.damage *= bonuses.craftEfficiencyMult;
                    }
                }
            }
        }

        this.launchedBombers.push(bomber);
        this.baySpace -= 2; // Bombers take 2 bay spaces

        // Set cooldown for both bays (4 seconds each)
        this.setBayCooldown(bay1, currentTime);
        this.setBayCooldown(bay2, currentTime);

        eventBus.emit('bomber-launched', { bomber: bomber });
        return bomber;
    }

    launchDrone(missionType) {
        if (this.baySpace < 1) {
            console.log('Not enough bay space to launch drone');
            return null;
        }

        // Calculate launch position (front-port of ship, 45° offset)
        const launchDistance = this.playerShip.radius + 12;
        const launchAngle = this.playerShip.rotation + 45; // Front-port
        const launchX = this.playerShip.x + Math.cos(MathUtils.toRadians(launchAngle)) * launchDistance;
        const launchY = this.playerShip.y + Math.sin(MathUtils.toRadians(launchAngle)) * launchDistance;

        const drone = new Drone({
            x: launchX,
            y: launchY,
            ownerShip: this.playerShip,
            faction: this.playerShip.faction,
            mission: missionType,
            physicsWorld: this.playerShip.physicsWorld
        });

        this.launchedDrones.push(drone);
        this.baySpace -= 1;

        eventBus.emit('drone-launched', { drone: drone, missionType: missionType });
        return drone;
    }

    launchProbe(targetX, targetY) {
        if (this.baySpace < 1) {
            console.log('Not enough bay space to launch probe');
            return null;
        }

        // Calculate launch position (directly ahead of ship)
        const launchDistance = this.playerShip.radius + 10;
        const launchAngle = this.playerShip.rotation;
        const launchX = this.playerShip.x + Math.cos(MathUtils.toRadians(launchAngle)) * launchDistance;
        const launchY = this.playerShip.y + Math.sin(MathUtils.toRadians(launchAngle)) * launchDistance;

        const probe = new Probe({
            x: launchX,
            y: launchY,
            ownerShip: this.playerShip,
            targetX: targetX,
            targetY: targetY,
            physicsWorld: this.playerShip.physicsWorld
        });

        this.launchedProbes.push(probe);
        this.baySpace -= 1;

        eventBus.emit('probe-launched', { probe: probe, targetX: targetX, targetY: targetY });
        return probe;
    }

    recoverShuttle(shuttle) {
        const index = this.launchedShuttles.indexOf(shuttle);
        if (index !== -1) {
            this.launchedShuttles.splice(index, 1);
            this.baySpace += 1;
            eventBus.emit('shuttle-recovered', { shuttle: shuttle });
        }
    }

    recoverFighter(fighter) {
        const index = this.launchedFighters.indexOf(fighter);
        if (index !== -1) {
            this.launchedFighters.splice(index, 1);
            this.baySpace += 1;
            eventBus.emit('fighter-recovered', { fighter: fighter });
        }
    }

    recoverBomber(bomber) {
        const index = this.launchedBombers.indexOf(bomber);
        if (index !== -1) {
            this.launchedBombers.splice(index, 1);
            this.baySpace += 2; // Bombers take 2 bay spaces
            eventBus.emit('bomber-recovered', { bomber: bomber });
        }
    }

    update(deltaTime, currentTime, allEntities) {
        // Update launch cooldowns
        this.updateCooldowns(currentTime);

        // Update launched shuttles
        for (let i = this.launchedShuttles.length - 1; i >= 0; i--) {
            const shuttle = this.launchedShuttles[i];
            if (!shuttle.active) {
                this.recoverShuttle(shuttle);
            } else {
                shuttle.update(deltaTime, currentTime, allEntities);
            }
        }

        // Update launched fighters
        for (let i = this.launchedFighters.length - 1; i >= 0; i--) {
            const fighter = this.launchedFighters[i];
            if (!fighter.active) {
                this.recoverFighter(fighter);
            } else {
                fighter.update(deltaTime, currentTime, allEntities);
            }
        }

        // Update launched bombers
        for (let i = this.launchedBombers.length - 1; i >= 0; i--) {
            const bomber = this.launchedBombers[i];
            if (!bomber.active) {
                this.recoverBomber(bomber);
            } else {
                bomber.update(deltaTime, currentTime, allEntities);
            }
        }
    }

    getBayStatus() {
        return {
            baySpace: this.baySpace,
            maxBaySpace: this.maxBaySpace,
            launchedShuttles: this.launchedShuttles.length,
            launchedFighters: this.launchedFighters.length,
            launchedBombers: this.launchedBombers.length,
            canLaunchShuttle: this.canLaunchShuttle(),
            canLaunchFighter: this.canLaunchFighter(),
            canLaunchBomber: this.canLaunchBomber()
        };
    }

    getShuttleMissions() {
        return [
            'ATTACK',
            'DEFENSE', 
            'WILD_WEASEL',
            'SUICIDE',
            'TRANSPORT',
            'SCAN'
        ];
    }
}

