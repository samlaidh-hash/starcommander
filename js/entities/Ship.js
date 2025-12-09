/**
 * Star Sea - Ship Entity
 */

const WEAPON_POSITIONS = {
    forwardCenter: { x: 0, y: -30 },
    forwardPort: { x: -6, y: -14 },
    forwardStarboard: { x: 6, y: -14 },
    aftCenter: { x: 0, y: 70 },
    forwardTorpPort: { x: -3, y: -12 },
    forwardTorpStarboard: { x: 3, y: -12 },
    dualTorpCenter: { x: 0, y: -10 },
    aftTorpPort: { x: -3, y: 12 },
    aftTorpStarboard: { x: 3, y: 12 },
    disruptorPort: { x: -7, y: -13 },
    disruptorStarboard: { x: 7, y: -13 },
    // Trigon-specific positions (scaled by size, on wings)
    trigonWingPortFwd: { x: -0.6, y: -0.25, scaled: true },      // Left wing forward
    trigonWingStarboardFwd: { x: 0.6, y: -0.25, scaled: true },  // Right wing forward
    trigonWingPortAft: { x: -0.5, y: 0.35, scaled: true },       // Left wing aft
    trigonWingStarboardAft: { x: 0.5, y: 0.35, scaled: true },   // Right wing aft
    trigonNose: { x: 0, y: -0.8, scaled: true },                 // Nose position
    trigonCenterAft: { x: 0, y: 0.9, scaled: true },             // Center aft position
    // Scintilian-specific positions (scaled by size, on wings and body)
    scintilianHead: { x: 0, y: -0.75, scaled: true },            // Command head position
    scintilianNeck: { x: 0, y: -0.2, scaled: true },             // Neck centerline
    scintilianWingPortOuter: { x: -0.7, y: 0.6, scaled: true },  // Left wing outer
    scintilianWingStarboardOuter: { x: 0.7, y: 0.6, scaled: true }, // Right wing outer
    scintilianWingPortInner: { x: -0.3, y: 0.15, scaled: true }, // Left wing inner
    scintilianWingStarboardInner: { x: 0.3, y: 0.15, scaled: true }, // Right wing inner
    scintilianCenterAft: { x: 0, y: 0.75, scaled: true },        // Center aft position
    // Pirate-specific positions (scaled by size, cross-shaped layout)
    pirateUpperStabilizer: { x: 0, y: -0.8, scaled: true },      // Upper weapon mount
    pirateLowerStabilizer: { x: 0, y: 0.8, scaled: true },       // Lower weapon mount
    pirateWingPortTip: { x: -0.85, y: 0, scaled: true },         // Left wing tip
    pirateWingStarboardTip: { x: 0.85, y: 0, scaled: true },     // Right wing tip
    pirateWingPortInner: { x: -0.4, y: 0, scaled: true },        // Left wing inner
    pirateWingStarboardInner: { x: 0.4, y: 0, scaled: true },    // Right wing inner
    pirateCentralPod: { x: 0, y: 0, scaled: true }               // Central pod
};

const SHIP_WEAPON_LOADOUTS = {
    FEDERATION: {
        DD: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'dualTorpedo', name: 'Dual Torpedo Launcher (DD)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 6, loaded: 3, maxLoaded: 3 }
        ],
        CL: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'dualTorpedo', name: 'Dual Torpedo Launcher (CL)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 8, loaded: 4, maxLoaded: 4 }
        ],
        CA: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'continuousBeam', name: 'Aft Beam Battery', arc: 270, arcCenter: 180, positionKey: 'aftCenter' },
            { type: 'dualTorpedo', name: 'Dual Torpedo Launcher (CA)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 10, loaded: 5, maxLoaded: 5 }
        ],
        BB: [
            { type: 'continuousBeam', name: 'Port Forward Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardPort' },
            { type: 'continuousBeam', name: 'Starboard Forward Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardStarboard' },
            { type: 'continuousBeam', name: 'Aft Beam Array', arc: 270, arcCenter: 180, positionKey: 'aftCenter' },
            { type: 'dualTorpedo', name: 'Dual Torpedo Launcher (BB)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 14, loaded: 7, maxLoaded: 7 }
        ]
    },
    TRIGON: {
        DD: [
            { type: 'disruptor', name: 'Port Wing Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingPortFwd' },
            { type: 'disruptor', name: 'Starboard Wing Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingStarboardFwd' }
        ],
        CL: [
            { type: 'disruptor', name: 'Port Wing Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingPortFwd' },
            { type: 'disruptor', name: 'Starboard Wing Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingStarboardFwd' }
        ],
        CA: [
            { type: 'disruptor', name: 'Nose Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'trigonNose' },
            { type: 'disruptor', name: 'Port Wing Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingPortFwd' },
            { type: 'disruptor', name: 'Starboard Wing Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingStarboardFwd' }
        ],
        BB: [
            { type: 'disruptor', name: 'Nose Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'trigonNose' },
            { type: 'disruptor', name: 'Port Wing Fwd Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingPortFwd' },
            { type: 'disruptor', name: 'Starboard Wing Fwd Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingStarboardFwd' },
            { type: 'disruptor', name: 'Port Wing Aft Disruptor', arc: 120, arcCenter: 180, positionKey: 'trigonWingPortAft' },
            { type: 'disruptor', name: 'Starboard Wing Aft Disruptor', arc: 120, arcCenter: 180, positionKey: 'trigonWingStarboardAft' }
        ]
    },
    SCINTILIAN: {
        DD: [
            { type: 'pulseBeam', name: 'Head Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'scintilianHead', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Neck Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'scintilianNeck' }
        ],
        CL: [
            { type: 'pulseBeam', name: 'Head Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'scintilianHead', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Neck Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'scintilianNeck' },
            { type: 'plasma', name: 'Aft Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'scintilianCenterAft' }
        ],
        CA: [
            { type: 'pulseBeam', name: 'Head Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'scintilianHead', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Port Wing Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingPortInner', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Starboard Wing Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingStarboardInner', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Neck Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'scintilianNeck' },
            { type: 'plasma', name: 'Aft Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'scintilianCenterAft' }
        ],
        BB: [
            { type: 'pulseBeam', name: 'Head Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'scintilianHead', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Port Wing Inner Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingPortInner', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Starboard Wing Inner Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingStarboardInner', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Port Wing Outer Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingPortOuter', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Starboard Wing Outer Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingStarboardOuter', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Neck Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'scintilianNeck' },
            { type: 'plasma', name: 'Aft Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'scintilianCenterAft' }
        ]
    },
    // PIRATE loadouts removed - now generated randomly per-ship for variety
    DEFAULT: {
        DD: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Forward Torpedo Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' }
        ],
        CL: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' }
        ],
        CA: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Forward Torpedo Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' }
        ],
        BB: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Forward Torpedo Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' }
        ]
    }
};

const WEAPON_BUILDERS = {
    beam: spec => new BeamWeapon(spec),
    continuousBeam: spec => new ContinuousBeam(spec),
    pulseBeam: spec => new PulseBeam(spec),
    torpedo: spec => new TorpedoLauncher(spec),
    dualTorpedo: spec => new DualTorpedoLauncher(spec),
    plasma: spec => new PlasmaTorpedo(spec),
    disruptor: spec => new Disruptor(spec),
    streakBeam: spec => new StreakBeam(spec)
};

function cloneWeaponPosition(positionKey, explicitPosition, shipSize, scaleFactor = 1, shipImageData = null) {
    if (explicitPosition) {
        // Validate explicitPosition has valid numeric values
        if (typeof explicitPosition.x !== 'number' || typeof explicitPosition.y !== 'number' ||
            isNaN(explicitPosition.x) || isNaN(explicitPosition.y)) {
            console.warn('⚠️ Invalid explicitPosition in cloneWeaponPosition:', explicitPosition);
            return { x: 0, y: 0 }; // Fallback to origin
        }
        
        // Validate scaleFactor
        if (typeof scaleFactor !== 'number' || isNaN(scaleFactor)) {
            console.warn('⚠️ Invalid scaleFactor in cloneWeaponPosition:', scaleFactor);
            scaleFactor = 1; // Fallback to 1
        }
        
        // Apply scaleFactor to explicit positions from JSON
        // If shipImageData is provided, also scale by image scale to match ship rendering
        let finalScale = scaleFactor;
        if (shipImageData && shipImageData.scale) {
            // Validate shipImageData.scale
            if (typeof shipImageData.scale === 'number' && !isNaN(shipImageData.scale)) {
                // Scale weapon positions from JSON to match ship image scaling
                finalScale = scaleFactor * shipImageData.scale;
            } else {
                console.warn('⚠️ Invalid shipImageData.scale:', shipImageData.scale);
            }
        }
        
        const x = explicitPosition.x * finalScale;
        const y = explicitPosition.y * finalScale;
        
        // Validate final result
        if (isNaN(x) || isNaN(y)) {
            console.warn('⚠️ NaN result in cloneWeaponPosition:', {
                explicitPosition,
                scaleFactor,
                finalScale,
                shipImageData,
                x, y
            });
            return { x: 0, y: 0 }; // Fallback to origin
        }
        
        return { x, y };
    }
    if (positionKey && WEAPON_POSITIONS[positionKey]) {
        const base = WEAPON_POSITIONS[positionKey];
        // If scaled is true, multiply by ship size (for faction-specific positions)
        if (base.scaled && shipSize) {
            return { x: base.x * shipSize, y: base.y * shipSize };
        }
        return { x: base.x, y: base.y };
    }
    return undefined;
}

/**
 * Build weapon from spec with JSON scaling support
 * @param {Object} spec - Weapon specification
 * @param {number} shipSize - Ship size from getShipSize()
 * @param {Object} shipImageData - Ship image data {width, height, scale} (optional)
 * @returns {Weapon|null} - Constructed weapon or null
 */
function buildWeaponFromSpec(spec, shipSize, shipImageData = null) {
    const builder = WEAPON_BUILDERS[spec.type];
    if (!builder) {
        console.warn(`Unknown weapon type in loadout: ${spec.type}`);
        return null;
    }

    const { type, positionKey, position, _scaleFactor, ...rest } = spec;
    const config = { ...rest };
    
    // Use scaleFactor from JSON if available, otherwise default to 1
    const scaleFactor = _scaleFactor !== undefined ? _scaleFactor : 1;
    
    const finalPosition = cloneWeaponPosition(positionKey, position, shipSize, scaleFactor, shipImageData);
    if (finalPosition) {
        config.position = finalPosition;
    }

    if (config.arcCenter === undefined && spec.facing) {
        switch (spec.facing) {
            case 'aft':
                config.arcCenter = 180;
                break;
            case 'port':
                config.arcCenter = 270;
                break;
            case 'starboard':
                config.arcCenter = 90;
                break;
            default:
                config.arcCenter = 0;
        }
    }

    return builder(config);
}

function resolveLoadoutFaction(faction) {
    return faction === 'PLAYER' ? 'FEDERATION' : faction;
}

/**
 * Generate random pirate weapon loadout
 * Pirates get 1-2 weapon types chosen randomly from: beams, torpedoes, disruptors, plasma
 */
function generatePirateLoadout(shipClass) {
    const weaponTypes = ['continuousBeam', 'torpedo', 'disruptor', 'plasma'];
    const numWeapons = Math.random() < 0.5 ? 1 : 2; // 50% chance of 1 or 2 types

    // Randomly select weapon types
    const selectedTypes = [];
    const availableTypes = [...weaponTypes];
    for (let i = 0; i < numWeapons && availableTypes.length > 0; i++) {
        const index = Math.floor(Math.random() * availableTypes.length);
        selectedTypes.push(availableTypes[index]);
        availableTypes.splice(index, 1); // Remove to prevent duplicates
    }

    const loadout = [];

    // Add weapons based on selected types
    for (const type of selectedTypes) {
        switch (type) {
            case 'continuousBeam':
                loadout.push({
                    type: 'continuousBeam',
                    name: 'Salvaged Beam',
                    arc: 270,
                    arcCenter: 0,
                    positionKey: 'pirateUpperStabilizer'
                });
                break;
            case 'torpedo':
                loadout.push({
                    type: 'torpedo',
                    name: 'Jury-Rigged Torpedo',
                    arc: 90,
                    arcCenter: 180,
                    positionKey: 'pirateLowerStabilizer'
                });
                break;
            case 'disruptor':
                loadout.push({
                    type: 'disruptor',
                    name: 'Stolen Disruptor',
                    arc: 120,
                    arcCenter: 270,
                    positionKey: 'pirateWingPortInner'
                });
                break;
            case 'plasma':
                loadout.push({
                    type: 'plasma',
                    name: 'Black Market Plasma',
                    arc: 90,
                    arcCenter: 180,
                    positionKey: 'pirateLowerStabilizer'
                });
                break;
        }
    }

    return loadout;
}

/**
 * Get ship loadout specs - tries to load from JSON first, falls back to hardcoded
 * @param {string} faction - Faction name
 * @param {string} shipClass - Ship class
 * @returns {Promise<Array>|Array} - Array of weapon specs (async if loading JSON)
 */
async function getShipLoadoutSpecs(faction, shipClass) {
    // Pirates get random loadouts for variety
    if (faction === 'PIRATE') {
        return generatePirateLoadout(shipClass);
    }

    const factionKey = resolveLoadoutFaction(faction);
    
    // Try to load from JSON file
    if (window.weaponLoadoutLoader) {
        try {
            const loadoutData = await window.weaponLoadoutLoader.loadLoadout(factionKey, shipClass);
            if (loadoutData && loadoutData.weapons) {
                // Return weapons array with scaleFactor attached for later use
                return loadoutData.weapons.map(weapon => ({
                    ...weapon,
                    _scaleFactor: loadoutData.scaleFactor || 1,
                    _loadoutData: loadoutData
                }));
            }
        } catch (error) {
            console.warn(`Failed to load JSON loadout for ${factionKey}_${shipClass}, using fallback:`, error);
        }
    }

    // Fallback to hardcoded loadouts
    const factionLoadouts = SHIP_WEAPON_LOADOUTS[factionKey];
    if (factionLoadouts && factionLoadouts[shipClass]) {
        return factionLoadouts[shipClass];
    }
    const defaultLoadouts = SHIP_WEAPON_LOADOUTS.DEFAULT || {};
    return defaultLoadouts[shipClass] || [];
}
class Ship extends Entity {
    constructor(config) {
        super(config.x, config.y);
        this.type = 'ship';
        this.shipClass = config.shipClass; // 'FG', 'CL', 'CA', 'BC'
        this.faction = config.faction; // 'PLAYER', 'TRIGON', 'SCINTILIAN', 'PIRATE'
        this.isPlayer = config.isPlayer || false;
        this.physicsWorld = config.physicsWorld;

        // Visual effects
        this.damageFlashAlpha = 0;

        // Movement
        this.maxSpeed = this.getMaxSpeed();
        this.maxReverseSpeed = this.maxSpeed * 0.5; // Half of forward speed
        this.acceleration = this.getAcceleration();
        this.deceleration = this.acceleration; // Same as acceleration for natural slowdown
        this.reverseDeceleration = this.acceleration * 2; // 2x for S key quick stop
        this.turnRate = this.getTurnRate();
        this.currentSpeed = 0; // Current forward/reverse speed (-maxReverse to +maxSpeed)

        // Visual properties
        this.color = this.getColor();
        this.vertices = this.generateShipVertices();

        // Weapon firing points
        this.weaponPoints = this.generateWeaponPoints();

        // For HUD display
        this.name = config.name || this.generateShipName();

        // Create physics body if physics world provided
        if (this.physicsWorld) {
            this.createPhysicsBody();
        }

        // Countermeasures
        this.decoys = CONFIG.DECOY_COUNT;
        this.mines = CONFIG.MINE_COUNT;
        this.captorMines = CONFIG.CAPTOR_MINE_COUNT || 2;  // Variant mine: captures ships
        this.phaserMines = CONFIG.PHASER_MINE_COUNT || 2;   // Variant mine: area denial
        this.transporterMines = CONFIG.TRANSPORTER_MINE_COUNT || 2; // Variant mine: teleports ships
        this.interceptors = CONFIG.INTERCEPTOR_COUNT || 6;  // Anti-torpedo missiles
        this.lastDeploymentTime = 0;

        // Torpedo type selection
        this.selectedTorpedoType = 'standard'; // 'standard', 'heavy', 'quantum', 'gravity'
        this.torpedoTypes = ['standard', 'heavy', 'quantum', 'gravity'];

        // Boost system
        this.boostActive = false;
        this.boostDuration = 2.0; // 2 seconds
        this.boostMultiplier = 2.0; // 2x speed
        this.boostCooldown = 10.0; // 10 seconds cooldown
        this.boostStartTime = 0;
        this.lastBoostTime = -this.boostCooldown; // Allow boost immediately
        this.boostDirection = null; // 'w', 'a', 's', 'd'

        // Throttle system (NEW - caret-based)
        this.throttleCaretPosition = 0.5;  // 0.0 (left/reverse) to 1.0 (right/forward), 0.5 = center (stationary)
        this.throttle = 0;  // -1.0 to 1.0 (-100% reverse to +100% forward, derived from caret position)
        this.targetSpeed = 0;  // Speed ship is trying to reach based on throttle
        this.throttleBoost = {
            active: false,
            endTime: 0,
            duration: 3,  // 3 seconds
            amount: 50,   // +50 speed units
            rechargeDuration: 10  // 10 seconds
        };
        
        // Fast rotation system (double-tap A/D)
        this.fastRotateActive = false;
        this.fastRotateMultiplier = 1.0;
        this.fastRotateEndTime = 0;

        // Tactical warp system (double-tap-and-hold W)
        this.tacticalWarpActive = false;
        this.tacticalWarpSpeedMultiplier = 10;
        this.tacticalWarpEnergyDrainRate = {
            DD: 8,   // 8 energy/sec
            CL: 10,  // 10 energy/sec
            CA: 12,  // 12 energy/sec
            BB: 15   // 15 energy/sec
        };
        this.tacticalWarpStartTime = 0;
        this.tacticalWarpCooldownEnd = 0;
        this.tacticalWarpLastDuration = 0;

        // Energy System (replaces Internal Systems)
        // Only support DD, CL, CA, BB classes
        if (!['DD', 'CL', 'CA', 'BB'].includes(this.shipClass)) {
            console.warn(`Invalid ship class ${this.shipClass}, defaulting to DD`);
            this.shipClass = 'DD';
        }
        this.energy = new EnergySystem(this.shipClass);

        // Shields
        this.shields = this.createShields();

        // Weapons - initialize synchronously first, then load from JSON async
        this.weapons = this.createWeapons();
        this._initializeWeaponsFromJSON(); // Async JSON loading happens in background

        // Crew Skills System - affects ship performance
        this.crewSkills = new CrewSkillSystem(this);

        // Apply helm bonuses to movement stats (applied once at construction)
        const helmBonuses = this.crewSkills.getHelmBonuses();
        this.maxSpeed *= helmBonuses.speedMult;
        this.maxReverseSpeed *= helmBonuses.speedMult;
        this.acceleration *= helmBonuses.accelMult;
        this.deceleration *= helmBonuses.accelMult;
        this.reverseDeceleration *= helmBonuses.accelMult;
        this.turnRate *= helmBonuses.turnMult;

        // Consumables System - mission loadout items
        this.consumables = new ConsumableSystem(this);

        // Tractor Beam System - G key to pull targets
        this.tractorBeam = new TractorBeamSystem(this);

        // Transporter System - T key toggle for crew transport
        this.transporter = new TransporterSystem(this);
    }

    /**
     * Initialize weapons from JSON asynchronously (updates weapons if JSON available)
     * This runs in the background after synchronous initialization
     */
    async _initializeWeaponsFromJSON() {
        // Skip if pirates (they use random loadouts)
        if (this.faction === 'PIRATE') {
            return;
        }

        // Get ship image data for proper scaling
        let shipImageData = null;
        if (window.assetManager && this.faction && this.shipClass) {
            const normalizedFaction = typeof this.faction === 'string' ? this.faction.toLowerCase() : this.faction;
            const factionForImage = normalizedFaction === 'player' ? 'federation' : normalizedFaction;
            const img = window.assetManager.getShipImage(factionForImage, this.shipClass);
            
            if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                const shipSize = this.getShipSize();
                const scale = shipSize / Math.max(img.naturalWidth, img.naturalHeight) * 2;
                shipImageData = {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    scale: scale
                };
            } else {
                // Wait for image to load
                try {
                    await window.assetManager.loadShipImage(factionForImage, this.shipClass);
                    const loadedImg = window.assetManager.getShipImage(factionForImage, this.shipClass);
                    if (loadedImg && loadedImg.complete && loadedImg.naturalWidth > 0) {
                        const shipSize = this.getShipSize();
                        const scale = shipSize / Math.max(loadedImg.naturalWidth, loadedImg.naturalHeight) * 2;
                        shipImageData = {
                            width: loadedImg.naturalWidth,
                            height: loadedImg.naturalHeight,
                            scale: scale
                        };
                    }
                } catch (error) {
                    console.warn(`Failed to load ship image for ${factionForImage}_${this.shipClass}:`, error);
                }
            }
        }

        try {
            const specs = await getShipLoadoutSpecs(this.faction, this.shipClass);
            
            // Check if we got JSON data (has _scaleFactor property)
            // Also check if any weapon has explicit position (indicates JSON data)
            const hasJSONData = specs.length > 0 && (
                specs[0]._scaleFactor !== undefined || 
                specs.some(spec => spec.position && typeof spec.position === 'object')
            );
            
            if (hasJSONData) {
                console.log(`✅ Loaded JSON weapon loadout for ${this.faction}_${this.shipClass}`, specs);
                // Replace weapons with JSON-loaded ones
                const weapons = [];
                const shipSize = this.getShipSize();

                for (const spec of specs) {
                    const weapon = buildWeaponFromSpec(spec, shipSize, shipImageData);
                    if (weapon) {
                        weapons.push(weapon);
                    }
                }

                this.weapons = weapons;
                console.log(`✅ Replaced weapons with JSON-loaded weapons (${weapons.length} weapons)`);
            } else {
                console.log(`⚠️ No JSON data found for ${this.faction}_${this.shipClass}, using hardcoded loadout`);
            }
        } catch (error) {
            console.warn(`Failed to load JSON loadout for ${this.faction}_${this.shipClass}, using hardcoded:`, error);
            // Keep existing hardcoded weapons
        }
    }

    /**
     * Create weapons synchronously (uses hardcoded loadouts)
     * This is called immediately in constructor, then JSON loads async and updates if available
     */
    createWeapons() {
        const factionKey = resolveLoadoutFaction(this.faction);
        const factionLoadouts = SHIP_WEAPON_LOADOUTS[factionKey];
        let specs = [];
        
        if (factionLoadouts && factionLoadouts[this.shipClass]) {
            specs = factionLoadouts[this.shipClass];
        } else {
            const defaultLoadouts = SHIP_WEAPON_LOADOUTS.DEFAULT || {};
            specs = defaultLoadouts[this.shipClass] || [];
        }

        const weapons = [];
        const shipSize = this.getShipSize();

        for (const spec of specs) {
            const weapon = buildWeaponFromSpec(spec, shipSize);
            if (weapon) {
                weapons.push(weapon);
            }
        }

        return weapons;
    }

    createShields() {
        // Unified shield system - single shield for whole ship
        // Shield strength varies by ship class
        let maxStrength = 30; // Default
        switch (this.shipClass) {
            case 'DD': maxStrength = 25; break;
            case 'CL': maxStrength = 35; break;
            case 'CA': maxStrength = 50; break;
            case 'BB': maxStrength = 70; break;
        }
        
            return new ShieldSystem({
            maxStrength: maxStrength
        });
    }


    createPhysicsBody() {
        const size = this.getShipSize();

        // Create circular body for now (will refine with proper hull shape later)
        const body = this.physicsWorld.createCircleBody(this.x, this.y, size * 0.6, {
            type: 'dynamic',
            rotation: this.rotation,
            density: 1.5,
            restitution: 0.5,
            bullet: true, // Enable continuous collision detection
            category: this.physicsWorld.CATEGORY.SHIP,
            mask: 0xFFFF
        });

        this.physicsComponent = new PhysicsComponent(this, body, this.physicsWorld);
    }

    getShipHp() {
        switch (this.shipClass) {
            case 'FG': return CONFIG.SHIP_HP_FG;
            case 'DD': return CONFIG.SHIP_HP_DD;
            case 'CL': return CONFIG.SHIP_HP_CL;
            case 'CS': return CONFIG.SHIP_HP_CS;
            case 'CA': return CONFIG.SHIP_HP_CA;
            case 'BC': return CONFIG.SHIP_HP_BC;
            default: return CONFIG.SHIP_HP_CA;
        }
    }

    getMaxSpeed() {
        let speed;
        switch (this.shipClass) {
            case 'DD': speed = CONFIG.MAX_SPEED_DD; break;
            case 'CL': speed = CONFIG.MAX_SPEED_CL; break;
            case 'CA': speed = CONFIG.MAX_SPEED_CA; break;
            case 'BB': speed = CONFIG.MAX_SPEED_BC || CONFIG.MAX_SPEED_CA; break; // Use BC config for BB
            default: speed = CONFIG.MAX_SPEED_CA;
        }

        if (this.faction === 'TRIGON') {
            speed *= CONFIG.MAX_SPEED_TRIGON_MULTIPLIER;
        }

        // Tactical warp multiplies speed by 10x
        if (this.tacticalWarpActive) {
            speed *= this.tacticalWarpSpeedMultiplier;
        }

        return speed;
    }

    getAcceleration() {
        switch (this.shipClass) {
            case 'DD': return CONFIG.ACCELERATION_DD;
            case 'CL': return CONFIG.ACCELERATION_CL;
            case 'CA': return CONFIG.ACCELERATION_CA;
            case 'BB': return CONFIG.ACCELERATION_BC || CONFIG.ACCELERATION_CA; // Use BC config for BB
            default: return CONFIG.ACCELERATION_CA;
        }
    }

    getTurnRate() {
        let rate;
        switch (this.shipClass) {
            case 'DD': rate = CONFIG.TURN_RATE_DD; break;
            case 'CL': rate = CONFIG.TURN_RATE_CL; break;
            case 'CA': rate = CONFIG.TURN_RATE_CA; break;
            case 'BB': rate = CONFIG.TURN_RATE_BC || CONFIG.TURN_RATE_CA; break; // Use BC config for BB
            default: rate = CONFIG.TURN_RATE_CA;
        }

        if (this.faction === 'TRIGON') {
            rate *= CONFIG.TURN_RATE_TRIGON_MULTIPLIER;
        }

        return rate;
    }

    getColor() {
        switch (this.faction) {
            case 'PLAYER': return CONFIG.COLOR_PLAYER;
            case 'TRIGON': return CONFIG.COLOR_TRIGON;
            case 'SCINTILIAN': return CONFIG.COLOR_SCINTILIAN;
            case 'PIRATE': return CONFIG.COLOR_PIRATE;
            default: return '#ffffff';
        }
    }

    generateShipName() {
        const prefixes = ['USS', 'IKS', 'IRW', 'ITS'];
        const names = ['Enterprise', 'Defiant', 'Voyager', 'Discovery', 'Reliant', 'Excalibur'];
        const prefix = this.faction === 'PLAYER' ? 'USS' :
                      this.faction === 'TRIGON' ? 'IKS' :
                      this.faction === 'SCINTILIAN' ? 'IRW' :
                      'ITS';
        const name = names[Math.floor(Math.random() * names.length)];
        return `${prefix} ${name}`;
    }

    generateShipVertices() {
        // Generate ship outline based on class and faction
        // This is a simplified version - will be enhanced with proper ship designs

        const size = this.getShipSize();

        if (this.faction === 'PLAYER') {
            // Galaxy-class inspired (saucer + engineering hull + nacelles)
            return this.generateGalaxyClass(size);
        } else if (this.faction === 'TRIGON') {
            // D-7 inspired (command pod + neck + body + nacelles)
            return this.generateD7Class(size);
        } else if (this.faction === 'SCINTILIAN') {
            // Warbird inspired (saucer with forward-swept nacelles)
            return this.generateWarbirdClass(size);
        } else if (this.faction === 'PIRATE') {
            // Tholian inspired (asymmetrical diamond)
            return this.generateTholianClass(size);
        }

        // Fallback: simple triangle
        return [
            { x: 0, y: -size },
            { x: -size * 0.6, y: size },
            { x: size * 0.6, y: size }
        ];
    }

    getShipSize() {
        switch (this.shipClass) {
            case 'DD': return CONFIG.SHIP_LENGTH_DD;
            case 'CL': return CONFIG.SHIP_LENGTH_CL;
            case 'CA': return CONFIG.SHIP_LENGTH_CA;
            case 'BB': return CONFIG.SHIP_LENGTH_BC || CONFIG.SHIP_LENGTH_CA; // Use BC config for BB
            default: return CONFIG.SHIP_LENGTH_CA;
        }
    }

    generateGalaxyClass(size) {
        // Galaxy-class (USS Enterprise NCC-1701-D) with nacelles on struts
        const vertices = [];

        // SAUCER SECTION (large elliptical primary hull - dominates Galaxy-class)
        const saucerRadiusX = size * 0.75; // Wide saucer
        const saucerRadiusY = size * 0.65; // Less tall than wide
        const saucerY = -size * 0.35;

        // Full elliptical saucer (front and sides)
        for (let i = 0; i <= 16; i++) {
            const angle = Math.PI * 0.6 + (i / 16) * Math.PI * 1.8; // 108ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° to 432ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° arc (front and sides)
            vertices.push({
                x: Math.cos(angle) * saucerRadiusX,
                y: saucerY + Math.sin(angle) * saucerRadiusY
            });
        }

        // Right side - connect saucer to engineering hull
        const neckWidth = size * 0.12;
        vertices.push({ x: neckWidth, y: saucerY + saucerRadiusY * 0.6 });

        // Right side of engineering hull
        vertices.push({ x: size * 0.18, y: size * 0.25 });

        // RIGHT NACELLE STRUT (flat horizontal section extending from engineering hull)
        vertices.push({ x: size * 0.18, y: size * 0.4 }); // Strut connection point on hull
        vertices.push({ x: size * 0.35, y: size * 0.38 }); // Strut extends outward
        vertices.push({ x: size * 0.5, y: size * 0.36 });  // Strut continues

        // RIGHT NACELLE (positioned at end of strut, standing off from hull)
        vertices.push({ x: size * 0.52, y: size * 0.3 });  // Nacelle front outer edge
        vertices.push({ x: size * 0.82, y: size * 0.35 }); // Nacelle extends forward
        vertices.push({ x: size * 0.85, y: size * 0.75 }); // Nacelle main body
        vertices.push({ x: size * 0.78, y: size * 0.82 }); // Nacelle aft outer edge
        vertices.push({ x: size * 0.48, y: size * 0.77 }); // Nacelle aft inner edge

        // Strut return path (bottom of strut connecting nacelle back to hull)
        vertices.push({ x: size * 0.46, y: size * 0.72 }); // Strut bottom
        vertices.push({ x: size * 0.3, y: size * 0.7 });
        vertices.push({ x: size * 0.18, y: size * 0.68 }); // Strut connects back to hull

        // Continue engineering hull
        vertices.push({ x: size * 0.18, y: size * 0.9 });

        // Bottom of engineering hull
        vertices.push({ x: size * 0.1, y: size * 0.98 });
        vertices.push({ x: 0, y: size });
        vertices.push({ x: -size * 0.1, y: size * 0.98 });

        // Left side of engineering hull
        vertices.push({ x: -size * 0.18, y: size * 0.9 });
        vertices.push({ x: -size * 0.18, y: size * 0.68 }); // Strut connection

        // LEFT NACELLE STRUT (mirror of right)
        vertices.push({ x: -size * 0.3, y: size * 0.7 });
        vertices.push({ x: -size * 0.46, y: size * 0.72 });

        // LEFT NACELLE (mirror of right)
        vertices.push({ x: -size * 0.48, y: size * 0.77 }); // Nacelle aft inner edge
        vertices.push({ x: -size * 0.78, y: size * 0.82 }); // Nacelle aft outer edge
        vertices.push({ x: -size * 0.85, y: size * 0.75 }); // Nacelle main body
        vertices.push({ x: -size * 0.82, y: size * 0.35 }); // Nacelle extends forward
        vertices.push({ x: -size * 0.52, y: size * 0.3 });  // Nacelle front outer edge

        // Strut top (connecting nacelle to hull)
        vertices.push({ x: -size * 0.5, y: size * 0.36 });
        vertices.push({ x: -size * 0.35, y: size * 0.38 });
        vertices.push({ x: -size * 0.18, y: size * 0.4 });
        vertices.push({ x: -size * 0.18, y: size * 0.25 });

        // Left side - connect back to saucer
        vertices.push({ x: -neckWidth, y: saucerY + saucerRadiusY * 0.6 });

        return vertices;
    }

    generateD7Class(size) {
        // Trigon Bird-of-Prey design (based on user-provided silhouette)
        // Central command section with forward-swept angular wings
        const vertices = [];

        // FRONT TIP (nose of the ship)
        vertices.push({ x: 0, y: -size * 0.9 });

        // RIGHT SIDE OF CENTRAL COMMAND SECTION
        // Bridge/command pod detail (small notch)
        vertices.push({ x: size * 0.15, y: -size * 0.75 });
        vertices.push({ x: size * 0.2, y: -size * 0.7 });
        vertices.push({ x: size * 0.15, y: -size * 0.65 });

        // Central body continues down
        vertices.push({ x: size * 0.25, y: -size * 0.5 });

        // RIGHT WING ROOT (connection point)
        vertices.push({ x: size * 0.3, y: -size * 0.3 });

        // RIGHT WING - FORWARD SWEPT (distinctive angular shape)
        // Wing sweeps forward and outward
        vertices.push({ x: size * 0.5, y: -size * 0.35 }); // Wing extends forward
        vertices.push({ x: size * 0.7, y: -size * 0.25 }); // Wing tip forward position

        // Wing outer edge (angular facets)
        vertices.push({ x: size * 0.85, y: -size * 0.1 }); // Outer wing tip
        vertices.push({ x: size * 0.9, y: size * 0.1 });    // Wing maximum extent

        // Wing trailing edge (sweeps back to body)
        vertices.push({ x: size * 0.8, y: size * 0.3 });
        vertices.push({ x: size * 0.6, y: size * 0.45 });
        vertices.push({ x: size * 0.4, y: size * 0.55 });

        // RIGHT SIDE CENTRAL BODY (aft section)
        vertices.push({ x: size * 0.3, y: size * 0.65 });
        vertices.push({ x: size * 0.2, y: size * 0.8 });

        // AFT SECTION (engine/rear of ship)
        vertices.push({ x: size * 0.15, y: size * 0.95 });
        vertices.push({ x: 0, y: size * 1.0 }); // Aft centerline point
        vertices.push({ x: -size * 0.15, y: size * 0.95 });

        // LEFT SIDE CENTRAL BODY (aft section) - MIRROR OF RIGHT
        vertices.push({ x: -size * 0.2, y: size * 0.8 });
        vertices.push({ x: -size * 0.3, y: size * 0.65 });

        // LEFT WING - FORWARD SWEPT (mirror of right)
        // Wing trailing edge
        vertices.push({ x: -size * 0.4, y: size * 0.55 });
        vertices.push({ x: -size * 0.6, y: size * 0.45 });
        vertices.push({ x: -size * 0.8, y: size * 0.3 });

        // Wing outer edge
        vertices.push({ x: -size * 0.9, y: size * 0.1 });
        vertices.push({ x: -size * 0.85, y: -size * 0.1 });

        // Wing leading edge (forward sweep)
        vertices.push({ x: -size * 0.7, y: -size * 0.25 });
        vertices.push({ x: -size * 0.5, y: -size * 0.35 });

        // LEFT WING ROOT
        vertices.push({ x: -size * 0.3, y: -size * 0.3 });

        // LEFT SIDE OF CENTRAL COMMAND SECTION
        vertices.push({ x: -size * 0.25, y: -size * 0.5 });

        // Bridge/command pod detail (mirror)
        vertices.push({ x: -size * 0.15, y: -size * 0.65 });
        vertices.push({ x: -size * 0.2, y: -size * 0.7 });
        vertices.push({ x: -size * 0.15, y: -size * 0.75 });

        return vertices;
    }

    generateWarbirdClass(size) {
        // Scintilian Warbird design (based on user-provided silhouette)
        // Circular command section with large downward-swept wings (anchor shape)
        const vertices = [];

        // CIRCULAR COMMAND HEAD (top section)
        const headRadius = size * 0.3;
        const headCenterY = -size * 0.6;

        // Draw circular head (top half prominent, bottom connects to neck)
        for (let i = 0; i <= 10; i++) {
            const angle = Math.PI * 0.2 + (i / 10) * Math.PI * 0.6; // 36° to 144° arc
            vertices.push({
                x: Math.cos(angle) * headRadius,
                y: headCenterY + Math.sin(angle) * headRadius
            });
        }

        // RIGHT SIDE OF NECK (narrow vertical section)
        vertices.push({ x: size * 0.08, y: -size * 0.4 });
        vertices.push({ x: size * 0.08, y: -size * 0.1 });

        // RIGHT WING ROOT (where wing connects to body)
        vertices.push({ x: size * 0.15, y: 0 });

        // RIGHT WING - DOWNWARD SWEPT (large, elegant curve)
        // Wing sweeps down and out, then curves back
        vertices.push({ x: size * 0.3, y: size * 0.15 });   // Wing starts curving out
        vertices.push({ x: size * 0.5, y: size * 0.35 });   // Wing mid section
        vertices.push({ x: size * 0.7, y: size * 0.6 });    // Wing extends outward
        vertices.push({ x: size * 0.85, y: size * 0.8 });   // Wing tip outer edge

        // Wing curves back toward center (trailing edge)
        vertices.push({ x: size * 0.75, y: size * 0.95 });  // Wing curves back
        vertices.push({ x: size * 0.5, y: size * 1.0 });    // Wing inner edge

        // CENTER AFT SECTION (bottom of body between wings)
        vertices.push({ x: size * 0.2, y: size * 0.85 });
        vertices.push({ x: 0, y: size * 0.75 });            // Center bottom point
        vertices.push({ x: -size * 0.2, y: size * 0.85 });

        // LEFT WING - DOWNWARD SWEPT (mirror of right)
        // Inner edge
        vertices.push({ x: -size * 0.5, y: size * 1.0 });
        vertices.push({ x: -size * 0.75, y: size * 0.95 });

        // Wing outer edge
        vertices.push({ x: -size * 0.85, y: size * 0.8 });
        vertices.push({ x: -size * 0.7, y: size * 0.6 });
        vertices.push({ x: -size * 0.5, y: size * 0.35 });
        vertices.push({ x: -size * 0.3, y: size * 0.15 });

        // LEFT WING ROOT
        vertices.push({ x: -size * 0.15, y: 0 });

        // LEFT SIDE OF NECK
        vertices.push({ x: -size * 0.08, y: -size * 0.1 });
        vertices.push({ x: -size * 0.08, y: -size * 0.4 });

        // Return to head (completes the circle on the left side)
        // The loop will automatically close back to the first vertex

        return vertices;
    }

    generateTholianClass(size) {
        // Pirate ship design (based on user-provided silhouette)
        // Cross-shaped with central pod, wide horizontal wings, and vertical stabilizers
        const vertices = [];

        // UPPER VERTICAL STABILIZER (weapon mount)
        vertices.push({ x: 0, y: -size * 0.9 });           // Top point
        vertices.push({ x: size * 0.12, y: -size * 0.7 }); // Right side of stabilizer
        vertices.push({ x: size * 0.12, y: -size * 0.3 }); // Connect to central pod

        // RIGHT HORIZONTAL WING
        // Upper wing edge
        vertices.push({ x: size * 0.2, y: -size * 0.25 }); // Wing root upper
        vertices.push({ x: size * 0.4, y: -size * 0.2 });  // Wing extends out
        vertices.push({ x: size * 0.7, y: -size * 0.15 }); // Wing mid section
        vertices.push({ x: size * 0.9, y: -size * 0.1 });  // Wing tip leading edge

        // Right wing tip (rounded)
        vertices.push({ x: size * 0.95, y: 0 });           // Wing tip point

        // Lower wing edge
        vertices.push({ x: size * 0.9, y: size * 0.1 });   // Wing tip trailing edge
        vertices.push({ x: size * 0.7, y: size * 0.15 });  // Wing trailing mid
        vertices.push({ x: size * 0.4, y: size * 0.2 });   // Wing trailing inner
        vertices.push({ x: size * 0.2, y: size * 0.25 });  // Wing root lower

        // CENTRAL POD - RIGHT SIDE (circular section)
        vertices.push({ x: size * 0.15, y: size * 0.3 });  // Pod right upper

        // RIGHT SIDE OF LOWER STABILIZER
        vertices.push({ x: size * 0.12, y: size * 0.35 }); // Connect to lower stabilizer
        vertices.push({ x: size * 0.12, y: size * 0.7 });  // Lower stabilizer right

        // LOWER VERTICAL STABILIZER (weapon mount)
        vertices.push({ x: 0, y: size * 0.9 });            // Bottom point

        // LEFT SIDE OF LOWER STABILIZER
        vertices.push({ x: -size * 0.12, y: size * 0.7 }); // Lower stabilizer left
        vertices.push({ x: -size * 0.12, y: size * 0.35 });

        // CENTRAL POD - LEFT SIDE
        vertices.push({ x: -size * 0.15, y: size * 0.3 }); // Pod left lower

        // LEFT HORIZONTAL WING
        // Lower wing edge (mirror of right)
        vertices.push({ x: -size * 0.2, y: size * 0.25 });
        vertices.push({ x: -size * 0.4, y: size * 0.2 });
        vertices.push({ x: -size * 0.7, y: size * 0.15 });
        vertices.push({ x: -size * 0.9, y: size * 0.1 });

        // Left wing tip
        vertices.push({ x: -size * 0.95, y: 0 });

        // Upper wing edge
        vertices.push({ x: -size * 0.9, y: -size * 0.1 });
        vertices.push({ x: -size * 0.7, y: -size * 0.15 });
        vertices.push({ x: -size * 0.4, y: -size * 0.2 });
        vertices.push({ x: -size * 0.2, y: -size * 0.25 });

        // Connect back to upper stabilizer
        vertices.push({ x: -size * 0.12, y: -size * 0.3 });
        vertices.push({ x: -size * 0.12, y: -size * 0.7 });

        return vertices;
    }

    generateWeaponPoints() {
        const size = this.getShipSize();
        const points = {
            forwardBeamBand: null,
            aftBeamPoint: null,
            portBeamPoint: null,
            starboardBeamPoint: null,
            dualTorpedoPoint: null // Federation ships use dual mount launchers
        };

        if (this.faction === 'PLAYER' || this.faction === 'FEDERATION') {
            // Federation ships use forward beam band
            {
                // Other Federation ships (CA, BC, etc.) use forward/aft beam configuration
                const saucerRadius = size * 0.5; // Smaller radius to fit inside saucer
                const saucerCenterY = -size * 0.30; // Centered in saucer, moved down to match WEAPON_POSITIONS forwardCenter

                // Forward beam battery band (270° circular arc on saucer)
                points.forwardBeamBand = {
                    type: 'ellipse',
                    centerX: 0,
                    centerY: saucerCenterY,
                    radiusX: saucerRadius,
                    radiusY: saucerRadius, // Circular, not elliptical
                    startAngle: 180, // Left side
                    endAngle: 360,   // Right side (via top)
                    arcDegrees: 270
                };

                // Aft beam battery band (rounded rectangle perpendicular to ship axis)
                points.aftBeamPoint = {
                    type: 'rectangle',
                    x: 0,
                    y: size * 0.90, // Position at rear of engineering hull
                    width: size * 0.3, // Width perpendicular to ship axis
                    height: size * 0.08, // Height along ship axis
                    rotation: 0 // Perpendicular to long axis (horizontal)
                };
            }

            // Dual torpedo launcher (all Federation ships)
            points.dualTorpedoPoint = {
                type: 'point',
                x: 0,
                y: -20 // Dual torpedo launcher position
            };
        }
        // Add weapon points for other factions as needed

        return points;
    }

    thrust(direction, deltaTime) {
        // direction: 1 = forward, -1 = backward (reverse)
        // Apply boost multiplier if active
        const boostMultiplier = this.getBoostMultiplier();
        const effectiveAcceleration = this.acceleration * boostMultiplier;
        const effectiveMaxSpeed = this.maxSpeed * boostMultiplier;
        const effectiveMaxReverseSpeed = this.maxReverseSpeed * boostMultiplier;

        if (direction > 0) {
            // W key - accelerate forward
            this.currentSpeed += effectiveAcceleration * deltaTime;
            this.currentSpeed = Math.min(this.currentSpeed, effectiveMaxSpeed);
        } else if (direction < 0) {
            // S key - decelerate quickly, then reverse
            if (this.currentSpeed > 1.0) {
                // Currently moving forward - apply quick deceleration
                this.currentSpeed -= this.reverseDeceleration * deltaTime;
                this.currentSpeed = Math.max(this.currentSpeed, 0);
            } else if (this.currentSpeed >= -0.1 && this.currentSpeed <= 1.0) {
                // Near zero - accelerate backward gradually
                this.currentSpeed -= effectiveAcceleration * deltaTime;
                this.currentSpeed = Math.max(this.currentSpeed, -effectiveMaxReverseSpeed);
            } else {
                // Already reversing - continue accelerating backward
                this.currentSpeed -= effectiveAcceleration * deltaTime;
                this.currentSpeed = Math.max(this.currentSpeed, -effectiveMaxReverseSpeed);
            }
        }

        // Apply velocity based on current speed and facing direction
        if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
            const vec = MathUtils.vectorFromAngle(this.rotation, this.currentSpeed);
            this.physicsComponent.body.setLinearVelocity(planck.Vec2(vec.x, vec.y));
        } else {
            this.transform.setVelocityFromAngle(this.rotation, this.currentSpeed);
        }
    }

    // Natural deceleration when no thrust input
    applyDeceleration(deltaTime) {
        if (this.currentSpeed > 0) {
            // Slowing down from forward motion
            this.currentSpeed -= this.deceleration * deltaTime;
            this.currentSpeed = Math.max(this.currentSpeed, 0);
        } else if (this.currentSpeed < 0) {
            // Slowing down from reverse motion
            this.currentSpeed += this.deceleration * deltaTime;
            this.currentSpeed = Math.min(this.currentSpeed, 0);
        }

        // Apply velocity
        if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
            const vec = MathUtils.vectorFromAngle(this.rotation, this.currentSpeed);
            this.physicsComponent.body.setLinearVelocity(planck.Vec2(vec.x, vec.y));
        } else {
            this.transform.setVelocityFromAngle(this.rotation, this.currentSpeed);
        }
    }

    turn(direction, deltaTime) {
        // direction: 1 = right, -1 = left
        // Apply fast rotation multiplier if active
        let effectiveTurnRate = this.turnRate;
        const currentTime = performance.now() / 1000;
        
        if (this.fastRotateActive && currentTime < this.fastRotateEndTime) {
            effectiveTurnRate *= this.fastRotateMultiplier;
        } else if (this.fastRotateActive) {
            // Fast rotation expired
            this.fastRotateActive = false;
        }
        
        const degreesturned = effectiveTurnRate * deltaTime * direction;

        // Calculate speed reduction: 10% per 30 degrees
        const speedReduction = (Math.abs(degreesturned) / 30) * 0.10;
        const wasPositive = this.currentSpeed > 0;
        const wasNegative = this.currentSpeed < 0;

        this.currentSpeed *= (1 - speedReduction);

        // Safeguard: ensure turning doesn't flip the direction of movement
        if (wasPositive && this.currentSpeed < 0) this.currentSpeed = 0;
        if (wasNegative && this.currentSpeed > 0) this.currentSpeed = 0;

        if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
            // Apply torque via physics (use effective turn rate)
            const torque = effectiveTurnRate * direction * 10; // Scale for physics
            this.physicsComponent.body.applyTorque(torque);

            // Also directly set rotation for responsive feel
            this.rotation += degreesturned;
            this.rotation = MathUtils.normalizeAngle(this.rotation);
            this.physicsComponent.body.setAngle(MathUtils.toRadians(this.rotation));

            // Update velocity direction based on new facing
            const vec = MathUtils.vectorFromAngle(this.rotation, this.currentSpeed);
            this.physicsComponent.body.setLinearVelocity(planck.Vec2(vec.x, vec.y));
        } else {
            this.rotation += degreesturned;
            this.rotation = MathUtils.normalizeAngle(this.rotation);
            this.transform.setVelocityFromAngle(this.rotation, this.currentSpeed);
        }
    }

    stopRotation() {
        if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
            // Zero out angular velocity
            this.physicsComponent.body.setAngularVelocity(0);
        }
        // No action needed for non-physics mode (rotation handled directly)
    }

    /**
     * Update throttle system - ship maintains speed based on throttle setting
     * Called every frame from update()
     */
    updateThrottle(deltaTime) {
        // If transporter disabled, force target speed to 0
        if (this.transporterDisabled) {
            this.targetSpeed = 0;
            return; // Skip throttle calculations
        }

        // Calculate target speed from throttle (-1.0 to 1.0)
        // throttle > 0: forward speed (0% to 100% max speed)
        // throttle = 0: stationary
        // throttle < 0: reverse speed (0% to -50% max speed)
        // Use getMaxSpeed() to account for tactical warp multiplier
        const currentMaxSpeed = this.getMaxSpeed();
        const currentMaxReverseSpeed = currentMaxSpeed * 0.5; // Half of forward speed
        
        if (this.throttle >= 0) {
            this.targetSpeed = currentMaxSpeed * this.throttle; // Forward: 0 to maxSpeed
        } else {
            this.targetSpeed = currentMaxReverseSpeed * this.throttle; // Reverse: 0 to -50% maxSpeed (throttle is negative, so result is negative)
        }

        // Add boost if active
        const currentTime = performance.now() / 1000;
        if (this.throttleBoost.active && currentTime < this.throttleBoost.endTime) {
            this.targetSpeed += this.throttleBoost.amount;
        } else if (this.throttleBoost.active) {
            this.throttleBoost.active = false; // Boost expired
        }

        // Energy drain/refill based on ACTUAL SPEED (not throttle setting)
        // 0-33% max speed: constantly recharge energy
        // 67-100% max speed: constantly drain energy
        // 34-66%: energy not affected by speed
        if (this.energy) {
            // Calculate normalized speed (0 to 1.0, where 1.0 = maxSpeed)
            // Use getMaxSpeed() to account for tactical warp multiplier
            const currentMaxSpeed = this.getMaxSpeed();
            const normalizedSpeed = Math.abs(this.currentSpeed) / currentMaxSpeed;
            const SPEED_THRESHOLD_LOW = 0.33;  // 33% (below or equal = recharge)
            const SPEED_THRESHOLD_HIGH = 0.67; // 67% (above or equal = drain)
            
            if (normalizedSpeed <= SPEED_THRESHOLD_LOW) {
                // 0-33% speed: Recharge energy
                this.energy.refillEnergy(0, deltaTime);
            } else if (normalizedSpeed >= SPEED_THRESHOLD_HIGH) {
                // 67-100% speed: Drain energy
                this.energy.drainEnergy(0, deltaTime);
            }
            // 34-66%: No energy effect (energy remains unchanged)
        }

        // Accelerate/decelerate toward target speed
        const speedDiff = this.targetSpeed - this.currentSpeed;

        if (Math.abs(speedDiff) > 1) { // Only adjust if difference is significant
            if (speedDiff > 0) {
                // Accelerate toward target (forward or reducing reverse)
                const accel = this.acceleration * deltaTime;
                this.currentSpeed += accel;
                this.currentSpeed = Math.min(this.currentSpeed, this.targetSpeed);
            } else {
                // Decelerate toward target (reverse or reducing forward)
                const decel = this.deceleration * deltaTime;
                this.currentSpeed -= decel;
                this.currentSpeed = Math.max(this.currentSpeed, this.targetSpeed);
            }

            // Apply velocity based on current speed and facing direction
            if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
                const vec = MathUtils.vectorFromAngle(this.rotation, this.currentSpeed);
                this.physicsComponent.body.setLinearVelocity(planck.Vec2(vec.x, vec.y));
            } else {
                this.transform.setVelocityFromAngle(this.rotation, this.currentSpeed);
            }
        }
    }

    /**
     * Emergency stop - rapidly decelerate to zero and boost shields
     */
    emergencyStop() {
        const currentTime = performance.now() / 1000;

        // Set throttle to zero and reset caret position
        this.throttle = 0;
        this.throttleCaretPosition = 0.5; // Center position
        this.targetSpeed = 0;

        // Rapid deceleration (90% speed reduction)
        this.currentSpeed *= 0.1;

        // Apply velocity
        if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
            const vec = MathUtils.vectorFromAngle(this.rotation, this.currentSpeed);
            this.physicsComponent.body.setLinearVelocity(planck.Vec2(vec.x, vec.y));
        } else {
            this.transform.setVelocityFromAngle(this.rotation, this.currentSpeed);
        }

        // Shield boost for 7 seconds
        if (this.shields) {
            this.shields.applyEmergencyBoost(currentTime, 7);
        }

        eventBus.emit('emergency-stop', { ship: this });
    }

    update(deltaTime) {
        if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
            // Sync position from physics (only if physics is enabled)
            this.physicsComponent.syncToEntity();
            // Note: currentSpeed is maintained independently via thrust/deceleration/turn methods
            // We don't sync it from physics to avoid direction flip bugs when turning
        } else {
            // Fallback to non-physics movement (or when physics disabled)
            this.transform.updatePosition(deltaTime);
        }

        const currentTime = performance.now() / 1000;

        // Update energy system
        if (this.energy) {
            this.energy.update(deltaTime);
        }
        
        // Update visual damage effects (particle trails, flames, explosions)
        this.updateDamageEffects(deltaTime);
        
        // Update fast rotation expiration
        if (this.fastRotateActive && currentTime >= this.fastRotateEndTime) {
            this.fastRotateActive = false;
        }

        // Update throttle system (NEW - maintains speed automatically)
        this.updateThrottle(deltaTime);

        // Update boost system
        this.updateBoost(deltaTime, currentTime);

        // Update tactical warp system
        this.updateTacticalWarp(deltaTime, currentTime);

        // Update consumables (for active effect timers)
        if (this.consumables) {
            this.consumables.update(currentTime);
        }

        // Update damage flash effect (decay)
        if (this.damageFlashAlpha > 0) {
            this.damageFlashAlpha = Math.max(0, this.damageFlashAlpha - deltaTime * 3); // Fade over ~0.3 seconds
        }

        // Update shields
        if (this.shields) {
            this.shields.update(deltaTime, currentTime, this);
        }

        // Update weapons (for torpedo reloading, beam cooldowns, etc.)
        if (this.weapons) {
            for (const weapon of this.weapons) {
                weapon.update(deltaTime, currentTime, this);
            }
        }

        // Check if transporter disabled (temporary disable from boarding)
        if (this.transporterDisabled && this.transporterDisabledUntil) {
            if (currentTime >= this.transporterDisabledUntil) {
                // Re-enable ship
                this.transporterDisabled = false;
                this.transporterDisabledUntil = 0;
                if (this.weapons) {
                    for (const weapon of this.weapons) {
                        weapon.disabled = false;
                    }
                }
            } else {
                // Keep ship disabled
                if (this.weapons) {
                    for (const weapon of this.weapons) {
                        weapon.disabled = true;
                    }
                }
                this.targetSpeed = 0;
                this.currentSpeed *= 0.95; // Continue deceleration
            }
        }

    }

    /**
     * Check if ship can fire weapons (cloaking check, tactical warp check, transporter disable check)
     */
    canFireWeapons() {
        // Cannot fire weapons during tactical warp
        if (this.tacticalWarpActive) {
            return false;
        }

        // Cannot fire weapons if transporter disabled (boarding party disabled systems)
        if (this.transporterDisabled) {
            return false;
        }

        if (this.systems && this.systems.cloak) {
            const currentTime = performance.now() / 1000;
            return this.systems.cloak.canFireWeapons(currentTime);
        }
        return true; // Ships without cloak can always fire
    }

    /**
     * Check if ship is cloaked
     */
    isCloaked() {
        return this.systems && this.systems.cloak && this.systems.cloak.cloaked;
    }

    /**
     * Fire beam weapons at target
     */
    fireBeams(targetX, targetY, currentTime) {
        if (!this.canFireWeapons()) return [];

        // Use provided currentTime or get it now
        if (!currentTime) {
            currentTime = performance.now() / 1000;
        }

        // Apply nebula accuracy penalty if inside nebula
        if (this.inNebula && this.currentNebula) {
            const penalty = CONFIG.NEBULA_ACCURACY_PENALTY;
            targetX += (Math.random() - 0.5) * penalty * 2; // ±penalty pixels
            targetY += (Math.random() - 0.5) * penalty * 2;
        }

        const projectiles = [];

        // Calculate angle to target
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

        // DEBUG
        if (CONFIG.DEBUG_MODE && this.isPlayer) {
            console.log('Fire Beams - Angles:', {
                shipPos: { x: this.x.toFixed(1), y: this.y.toFixed(1) },
                targetPos: { x: targetX.toFixed(1), y: targetY.toFixed(1) },
                shipRotation: this.rotation.toFixed(1),
                targetAngle: targetAngle.toFixed(1),
                angleDiff: (targetAngle - this.rotation).toFixed(1)
            });
        }

        // Fire all beam weapons that have target in arc
        for (const weapon of this.weapons) {
            if (weapon instanceof BeamWeapon || weapon instanceof Disruptor || weapon instanceof PulseBeam) {
                if (weapon.isInArc(targetAngle, this.rotation)) {
                    const projectile = weapon.fire(this, targetX, targetY, currentTime);
                    if (projectile) {
                        // Apply consumable damage multiplier (energy cells)
                        if (this.consumables) {
                            projectile.damage *= this.consumables.getDamageMultiplier();
                        }
                        projectiles.push(projectile);
                    }
                }
            }
        }

        return projectiles;
    }

    /**
     * Fire continuous beam weapons at target
     * Called continuously while LMB is held
     */
    fireContinuousBeams(targetX, targetY, currentTime) {
        if (!this.canFireWeapons()) return [];

        // Apply nebula accuracy penalty if inside nebula
        if (this.inNebula && this.currentNebula) {
            const penalty = CONFIG.NEBULA_ACCURACY_PENALTY;
            targetX += (Math.random() - 0.5) * penalty * 2; // ±penalty pixels
            targetY += (Math.random() - 0.5) * penalty * 2;
        }

        const projectiles = [];
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

        // Fire all continuous beam weapons that are currently firing and in arc
        for (const weapon of this.weapons) {
            if (weapon instanceof ContinuousBeam && weapon.isFiring) {
                if (weapon.isInArc(targetAngle, this.rotation)) {
                    const projectile = weapon.fire(this, targetX, targetY, currentTime);
                    if (projectile) {
                        // Validate projectile has valid coordinates
                        if (isNaN(projectile.x) || isNaN(projectile.y) || 
                            projectile.targetX === undefined || projectile.targetY === undefined ||
                            isNaN(projectile.targetX) || isNaN(projectile.targetY)) {
                            console.warn('⚠️ Invalid beam projectile coordinates:', {
                                x: projectile.x, y: projectile.y,
                                targetX: projectile.targetX, targetY: projectile.targetY,
                                sourceShip: !!projectile.sourceShip, sourceWeapon: !!projectile.sourceWeapon
                            });
                            continue; // Skip invalid projectiles
                        }
                        // Apply consumable damage multiplier (energy cells)
                        if (this.consumables) {
                            projectile.damage *= this.consumables.getDamageMultiplier();
                        }
                        projectiles.push(projectile);
                    } else {
                        // Weapon is firing but fire() returned null
                        if (CONFIG.DEBUG_MODE) {
                            console.warn('⚠️ ContinuousBeam.fire() returned null', {
                                isFiring: weapon.isFiring,
                                fixedStartPoint: weapon.fixedStartPoint,
                                canFire: weapon.canFire(currentTime, this)
                            });
                        }
                    }
                } else {
                    // Weapon is firing but not in arc
                    if (CONFIG.DEBUG_MODE) {
                        console.log('⚠️ ContinuousBeam firing but not in arc', {
                            targetAngle, shipRotation: this.rotation,
                            weaponArc: weapon.arc, arcCenter: weapon.arcCenter
                        });
                    }
                }
            }
        }

        return projectiles;
    }

    /**
     * Fire torpedoes at target
     */
    fireTorpedoes(targetX, targetY, lockOnTarget = null) {
        if (!this.canFireWeapons()) {
            return [];
        }

        // Apply nebula accuracy penalty if inside nebula
        if (this.inNebula && this.currentNebula) {
            const penalty = CONFIG.NEBULA_ACCURACY_PENALTY;
            targetX += (Math.random() - 0.5) * penalty * 2; // ±penalty pixels
            targetY += (Math.random() - 0.5) * penalty * 2;
        }

        const currentTime = performance.now() / 1000;
        const projectiles = [];

        // Calculate angle to target
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

        // Fire all torpedo/plasma launchers that have target in arc
        for (const weapon of this.weapons) {
            if (weapon instanceof TorpedoLauncher || weapon instanceof DualTorpedoLauncher || weapon instanceof PlasmaTorpedo) {
                if (weapon.isInArc(targetAngle, this.rotation)) {
                    const projectile = weapon.fire(this, targetX, targetY, currentTime, lockOnTarget);
                    if (projectile) {
                        // Apply consumable damage multiplier (energy cells)
                        if (this.consumables) {
                            projectile.damage *= this.consumables.getDamageMultiplier();
                        }
                        projectiles.push(projectile);
                    }
                }
            }
        }

        return projectiles;
    }

    /**
     * Fire plasma torpedoes with charged damage
     */
    firePlasma(targetX, targetY, lockOnTarget, chargeDamage) {
        // Apply nebula accuracy penalty if inside nebula
        if (this.inNebula && this.currentNebula) {
            const penalty = CONFIG.NEBULA_ACCURACY_PENALTY;
            targetX += (Math.random() - 0.5) * penalty * 2; // ±penalty pixels
            targetY += (Math.random() - 0.5) * penalty * 2;
        }

        if (!this.canFireWeapons()) {
            if (CONFIG.DEBUG_MODE && this.isPlayer) {
                console.log('Cannot fire weapons - weapons disabled');
            }
            return [];
        }

        // Apply consumable damage multiplier to charge damage
        if (this.consumables) {
            chargeDamage *= this.consumables.getDamageMultiplier();
        }

        const currentTime = performance.now() / 1000;
        const projectiles = [];

        // Calculate angle to target
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

        // Fire all plasma torpedo launchers that have target in arc
        for (const weapon of this.weapons) {
            if (weapon instanceof PlasmaTorpedo) {
                if (weapon.isInArc(targetAngle, this.rotation)) {
                    const projectile = weapon.fire(this, targetX, targetY, currentTime, lockOnTarget, chargeDamage);
                    if (projectile) {
                        projectiles.push(projectile);
                    }
                }
            }
        }

        return projectiles;
    }

    /**
     * Get disruptor burst shots (called every frame during burst)
     * Now fires all shots simultaneously on LMB down
     */
    getDisruptorBurstShots(targetX, targetY) {
        if (!this.canFireWeapons()) return [];

        const currentTime = performance.now() / 1000;
        const projectiles = [];

        // Check all disruptors for burst shots
        // Only create shots if weapon is currently bursting (cooldown prevents starting new bursts)
        for (const weapon of this.weapons) {
            if (weapon instanceof Disruptor && weapon.isBursting) {
                // Get all shots simultaneously (fired on LMB down)
                const burstShots = weapon.getAllBurstShots(this, currentTime);
                if (burstShots && burstShots.length > 0) {
                    projectiles.push(...burstShots);
                }
            }
        }

        return projectiles;
    }

    /**
     * Deploy decoy
     */
    deployDecoy() {
        const currentTime = performance.now() / 1000;

        if (this.decoys <= 0) return null;
        if (currentTime - this.lastDeploymentTime < CONFIG.DEPLOYMENT_COOLDOWN) return null;

        this.decoys--;
        this.lastDeploymentTime = currentTime;

        // Create decoy at ship position
        const decoy = new Decoy(this.x, this.y);
        eventBus.emit('decoy-deployed', { ship: this });

        return decoy;
    }

    /**
     * Deploy mine (with variant types)
     * @param {string} mineType - 'standard', 'captor', 'phaser', or 'transporter'
     */
    deployMine(mineType = 'standard') {
        const currentTime = performance.now() / 1000;

        if (currentTime - this.lastDeploymentTime < CONFIG.DEPLOYMENT_COOLDOWN) return null;

        let mine = null;

        switch (mineType) {
            case 'captor':
                if (this.captorMines <= 0) return null;
                this.captorMines--;
                mine = new CaptorMine({
                    x: this.x,
                    y: this.y,
                    owner: this,
                    captureRange: 30,
                    captureDuration: 5.0
                });
                eventBus.emit('captor-mine-deployed', { ship: this });
                break;

            case 'phaser':
                if (this.phaserMines <= 0) return null;
                this.phaserMines--;
                mine = new PhaserMine({
                    x: this.x,
                    y: this.y,
                    owner: this,
                    phaserRange: 150,
                    phaserDamage: 1,
                    phaserCooldown: 2.0
                });
                eventBus.emit('phaser-mine-deployed', { ship: this });
                break;

            case 'transporter':
                if (this.transporterMines <= 0) return null;
                this.transporterMines--;
                mine = new TransporterMine({
                    x: this.x,
                    y: this.y,
                    owner: this,
                    transportRange: 40,
                    transportDuration: 3.0
                });
                eventBus.emit('transporter-mine-deployed', { ship: this });
                break;

            case 'standard':
            default:
                if (this.mines <= 0) return null;
                this.mines--;
                mine = new Mine(this.x, this.y, this);
                eventBus.emit('mine-deployed', { ship: this });
                break;
        }

        if (mine) {
            this.lastDeploymentTime = currentTime;
        }

        return mine;
    }

    /**
     * Get all beam weapons (including pulse beams)
     */
    getBeamWeapons() {
        return this.weapons.filter(w => w instanceof BeamWeapon || w instanceof PulseBeam);
    }

    /**
     * Get all torpedo launchers
     */
    getTorpedoLaunchers() {
        return this.weapons.filter(w => w instanceof TorpedoLauncher || w instanceof DualTorpedoLauncher || w instanceof PlasmaTorpedo);
    }

    /**
     * Cycle torpedo type selection
     */
    cycleTorpedoType() {
        const currentIndex = this.torpedoTypes.indexOf(this.selectedTorpedoType);
        const nextIndex = (currentIndex + 1) % this.torpedoTypes.length;
        this.selectedTorpedoType = this.torpedoTypes[nextIndex];

        eventBus.emit('torpedo-type-changed', {
            ship: this,
            torpedoType: this.selectedTorpedoType
        });

        return this.selectedTorpedoType;
    }

    /**
     * Deploy interceptor missile
     */
    deployInterceptor() {
        const currentTime = performance.now() / 1000;

        if (this.interceptors <= 0) return null;
        if (currentTime - this.lastDeploymentTime < CONFIG.DEPLOYMENT_COOLDOWN) return null;

        this.interceptors--;
        this.lastDeploymentTime = currentTime;

        // Get ship size for proper offset
        const shipSize = this.getShipSize();
        const offset = shipSize * 0.75;
        const worldRad = MathUtils.toRadians(this.rotation);

        // Create interceptor at ship position (forward offset)
        const interceptor = new InterceptorMissile({
            x: this.x + Math.sin(worldRad) * offset,
            y: this.y - Math.cos(worldRad) * offset,
            rotation: this.rotation,
            sourceShip: this,
            interceptRange: 200,
            speed: 300,
            lifetime: 15.0
        });

        eventBus.emit('interceptor-deployed', { ship: this });

        return interceptor;
    }

    /**
     * Activate boost
     */
    activateBoost(direction) {
        const currentTime = performance.now() / 1000;

        // Check if boost is on cooldown
        if (currentTime - this.lastBoostTime < this.boostCooldown) {
            const remainingCooldown = this.boostCooldown - (currentTime - this.lastBoostTime);
            console.log(`Boost on cooldown: ${remainingCooldown.toFixed(1)}s remaining`);
            return false;
        }

        // Check if systems are operational
        if (!this.systems || this.systems.power.hp <= 0) {
            console.log('Boost unavailable: Power system damaged');
            return false;
        }

        // Activate boost
        this.boostActive = true;
        this.boostStartTime = currentTime;
        this.boostDirection = direction;

        eventBus.emit('boost-started', { ship: this, direction: direction });
        console.log(`Boost activated! Direction: ${direction.toUpperCase()}`);

        return true;
    }

    /**
     * Update boost system
     */
    updateBoost(deltaTime, currentTime) {
        if (!this.boostActive) return;

        // Drain shields while boost is active (1 HP per second from all quadrants)
        if (this.shields) {
            const drainAmount = 1.0 * deltaTime; // 1 HP per second
            const quadrants = this.shields.getAllQuadrants();

            for (const quadrantName of ['fore', 'aft', 'port', 'starboard']) {
                const quadrant = quadrants[quadrantName];
                quadrant.current = Math.max(0, quadrant.current - drainAmount);

                // If any quadrant hits 0, deactivate boost
                if (quadrant.current <= 0) {
                    console.log(`Boost deactivated: ${quadrantName} shield depleted`);
                    this.deactivateBoost();
                    return;
                }
            }
        }

        // Check if boost duration has expired
        const boostElapsed = currentTime - this.boostStartTime;
        if (boostElapsed >= this.boostDuration) {
            this.deactivateBoost();
        }
    }

    /**
     * Deactivate boost
     */
    deactivateBoost() {
        if (!this.boostActive) return;

        const currentTime = performance.now() / 1000;
        this.boostActive = false;
        this.lastBoostTime = currentTime;
        this.boostDirection = null;

        eventBus.emit('boost-ended', { ship: this });
        console.log('Boost deactivated');
    }

    /**
     * Update tactical warp system
     */
    updateTacticalWarp(deltaTime, currentTime) {
        if (!this.tacticalWarpActive) return;

        // Get energy drain rate based on ship class
        const drainRate = this.tacticalWarpEnergyDrainRate[this.shipClass] || 10;
        
        // Drain energy
        if (this.energy) {
            const energyDrain = drainRate * deltaTime;
            this.energy.drain(energyDrain);
            
            // Warn when energy < 20%
            const energyPercent = this.energy.getTotalEnergy() / this.energy.getMaxEnergy();
            if (energyPercent < 0.2 && energyPercent > 0.19) {
                eventBus.emit('tactical-warp-low-energy', { ship: this, energyPercent: energyPercent });
            }
            
            // End warp if energy depleted
            if (this.energy.getTotalEnergy() <= 0) {
                const warpDuration = currentTime - this.tacticalWarpStartTime;
                this.tacticalWarpActive = false;
                this.tacticalWarpLastDuration = warpDuration;
                this.tacticalWarpCooldownEnd = currentTime + (warpDuration * 5); // 5x duration cooldown
                eventBus.emit('tactical-warp-ended-energy', { ship: this, duration: warpDuration });
            }
        }
    }

    /**
     * Activate tactical warp
     */
    activateTacticalWarp(currentTime) {
        // Check cooldown
        if (currentTime < this.tacticalWarpCooldownEnd) {
            const cooldownRemaining = this.tacticalWarpCooldownEnd - currentTime;
            eventBus.emit('tactical-warp-cooldown', { ship: this, cooldownRemaining: cooldownRemaining });
            return false;
        }

        // Check if ship has minimum energy (warning only, not required)
        if (this.energy) {
            const energyPercent = this.energy.getTotalEnergy() / this.energy.getMaxEnergy();
            if (energyPercent < 0.1) {
                eventBus.emit('tactical-warp-low-energy-warning', { ship: this, energyPercent: energyPercent });
            }
        }

        this.tacticalWarpActive = true;
        this.tacticalWarpStartTime = currentTime;
        return true;
    }

    /**
     * Deactivate tactical warp
     */
    deactivateTacticalWarp(currentTime) {
        if (!this.tacticalWarpActive) return;

        const warpDuration = currentTime - this.tacticalWarpStartTime;
        this.tacticalWarpActive = false;
        this.tacticalWarpLastDuration = warpDuration;
        this.tacticalWarpCooldownEnd = currentTime + (warpDuration * 5); // 5x duration cooldown
    }

    /**
     * Get boost multiplier for current movement
     */
    getBoostMultiplier() {
        return this.boostActive ? this.boostMultiplier : 1.0;
    }

    /**
     * Check if boost is available
     */
    canBoost() {
        const currentTime = performance.now() / 1000;
        return (currentTime - this.lastBoostTime >= this.boostCooldown) &&
               this.systems && this.systems.power.hp > 0;
    }

    /**
     * Get boost cooldown remaining
     */
    getBoostCooldownRemaining() {
        const currentTime = performance.now() / 1000;
        const remaining = this.boostCooldown - (currentTime - this.lastBoostTime);
        return Math.max(0, remaining);
    }

    /**
     * Check if shields are down (no shields or all shields at 0)
     */
    areShieldsDown(impactAngle, shipRotation) {
        if (!this.shields || this.isCloaked()) return true;

        // Check which shield facing is hit
        const relativeAngle = MathUtils.normalizeAngle(impactAngle - shipRotation);
        let facing = 'fore';

        if (relativeAngle >= 45 && relativeAngle < 135) {
            facing = 'starboard';
        } else if (relativeAngle >= 135 && relativeAngle < 225) {
            facing = 'aft';
        } else if (relativeAngle >= 225 && relativeAngle < 315) {
            facing = 'port';
        }

        // Check if that shield facing is down
        return this.shields[facing].hp <= 0;
    }

    /**
     * Take damage (collision damage only - projectile damage handled in Engine.js)
     */
    takeDamage(damage, contactPoint) {
        let remainingDamage = damage;
        const currentTime = performance.now() / 1000;

        // Notify cloaking device if hit while cloaked
        if (this.systems && this.systems.cloak) {
            this.systems.cloak.onHit(currentTime);
        }

        // Calculate impact angle if contact point provided
        // NO SHIELDS while cloaked or in nebula!
        let shieldAbsorbed = false;
        if (contactPoint && this.shields && this.shields.isUp() && !this.isCloaked() && !this.inNebula) {
            // Unified shield - doesn't care about angle
            const beforeDamage = remainingDamage;
            remainingDamage = this.shields.applyDamage(remainingDamage, currentTime, this);
            shieldAbsorbed = (beforeDamage > remainingDamage);

            if (this.isPlayer && remainingDamage < damage) {
                const shieldDamage = damage - remainingDamage;
                eventBus.emit('shield-hit', {
                    damage: shieldDamage,
                    overflow: remainingDamage,
                    point: contactPoint
                });
            }
        }

        // Apply remaining damage to energy blocks (reduces block length/capacity)
        if (remainingDamage > 0 && this.energy) {
            this.energy.takeDamage(remainingDamage);

            // Create debris burst effect when hull takes damage (unshielded hit)
            if (!shieldAbsorbed && contactPoint && window.game && window.game.particleSystem) {
                window.game.particleSystem.createDebrisBurst(contactPoint.x || this.x, contactPoint.y || this.y, {
                    particleCount: 15,
                    color: '#ff9900'
                });
            }

            if (this.isPlayer) {
                eventBus.emit('player-damage', {
                    damage: remainingDamage,
                    energyPercent: this.energy.getEnergyPercent(),
                    capacity: this.energy.getTotalCapacity(),
                    point: contactPoint
                });
            }
        }

        // Check if destroyed (0 energy block length)
        if (this.energy && this.energy.isDestroyed()) {
            this.destroy();
        }
        
    }

    destroy() {
        super.destroy();
        if (this.physicsComponent) {
            this.physicsComponent.destroy();
        }

        if (this.isPlayer) {
            eventBus.emit('player-destroyed');
        } else {
            // Emit enemy destroyed event for mission tracking
            eventBus.emit('enemy-destroyed', {
                enemy: this,
                faction: this.faction,
                shipClass: this.shipClass
            });
        }
    }

    /**
     * Update visual damage effects based on energy block state
     * 75%: Particle trails (smoke)
     * 50%: Flames onboard + particle trails
     * 25%: Flames + particle trails + random small explosions
     */
    updateDamageEffects(deltaTime) {
        if (!this.energy) return;
        
        const damageState = this.energy.getDamageState();
        const size = this.getShipSize();
        
        // Get particle system from global game instance
        const particleSystem = window.game ? window.game.particleSystem : null;
        if (!particleSystem) return;
        
        // Calculate ship rear position for particle trails
        const rearOffset = size * 0.6;
        const trailAngle = MathUtils.toRadians(this.rotation + 180);
        const trailX = this.x + Math.cos(trailAngle) * rearOffset;
        const trailY = this.y + Math.sin(trailAngle) * rearOffset;
        
        // Calculate ship velocity for trail positioning
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        
        // 75% or less: Continuous smoke trails
        if (damageState <= 0.75) {
            const smokeIntensity = 1.0 - (damageState / 0.75); // More smoke as damage increases
            // Create smoke trail particles more frequently
            if (Math.random() < smokeIntensity * 0.5) { // Up to 50% chance per frame
                particleSystem.createSmokeTrail(trailX, trailY, trailAngle, {
                    particleCount: Math.floor(2 + smokeIntensity * 2),
                    intensity: smokeIntensity
                });
            }
        }
        
        // 50% or less: Flames onboard + enhanced smoke trails
        if (damageState <= 0.50) {
            const flameIntensity = (0.50 - damageState) / 0.50; // 0 to 1
            
            // Create flames on ship (enhanced fire particles)
            const flameCount = Math.floor(flameIntensity * 4);
            
            for (let i = 0; i < flameCount; i++) {
                const offsetX = (Math.random() - 0.5) * size * 0.8;
                const offsetY = (Math.random() - 0.5) * size * 0.6;
                const flameX = this.x + Math.cos(MathUtils.toRadians(this.rotation)) * offsetX - Math.sin(MathUtils.toRadians(this.rotation)) * offsetY;
                const flameY = this.y + Math.sin(MathUtils.toRadians(this.rotation)) * offsetX + Math.cos(MathUtils.toRadians(this.rotation)) * offsetY;
                
                // More frequent flame particles
                if (Math.random() < 0.25) { // 25% chance per flame per frame
                    particleSystem.createFlame(flameX, flameY, {
                        intensity: flameIntensity
                    });
                }
            }
            
            // Enhanced smoke trails with occasional flame particles mixed in
            if (Math.random() < flameIntensity * 0.3) {
                particleSystem.createSmokeTrail(trailX, trailY, trailAngle, {
                    particleCount: Math.floor(3 + flameIntensity * 2),
                    intensity: flameIntensity
                });
            }
            
            // Add occasional flame particles to trail
            if (Math.random() < flameIntensity * 0.2) {
                particleSystem.createFlame(trailX, trailY, {
                    intensity: flameIntensity * 0.5
                });
            }
        }
        
        // 25% or less: Intense flames + heavy smoke trails + random small explosions
        if (damageState <= 0.25) {
            const criticalIntensity = (0.25 - damageState) / 0.25;
            
            // More intense flames
            const intenseFlameCount = Math.floor(criticalIntensity * 6);
            for (let i = 0; i < intenseFlameCount; i++) {
                const offsetX = (Math.random() - 0.5) * size * 0.9;
                const offsetY = (Math.random() - 0.5) * size * 0.7;
                const flameX = this.x + Math.cos(MathUtils.toRadians(this.rotation)) * offsetX - Math.sin(MathUtils.toRadians(this.rotation)) * offsetY;
                const flameY = this.y + Math.sin(MathUtils.toRadians(this.rotation)) * offsetX + Math.cos(MathUtils.toRadians(this.rotation)) * offsetY;
                
                if (Math.random() < 0.4) { // 40% chance per flame per frame
                    particleSystem.createFlame(flameX, flameY, {
                        intensity: criticalIntensity
                    });
                }
            }
            
            // Heavy smoke trails
            if (Math.random() < criticalIntensity * 0.6) {
                particleSystem.createSmokeTrail(trailX, trailY, trailAngle, {
                    particleCount: Math.floor(4 + criticalIntensity * 3),
                    intensity: criticalIntensity
                });
            }
            
            // Random small explosions
            if (Math.random() < 0.015) { // 1.5% chance per frame
                const explosionX = this.x + (Math.random() - 0.5) * size;
                const explosionY = this.y + (Math.random() - 0.5) * size;
                particleSystem.createExplosion(explosionX, explosionY, {
                    particleCount: 12,
                    size: 0.6,
                    color: '#ff3300',
                    speed: 60
                });
            }
        }
    }
}




