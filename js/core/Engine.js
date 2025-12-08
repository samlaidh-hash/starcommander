const SHIP_CLASS_LABELS = {
    DD: "Destroyer",
    CL: "Light Cruiser",
    CA: "Heavy Cruiser",
    BB: "Battle Cruiser"
};

const FACTION_DISPLAY_NAMES = {
    PLAYER: "Federation",
    FEDERATION: "Federation",
    TRIGON: "Trigon Empire",
    SCINTILIAN: "Scintilian Coalition",
    PIRATE: "Pirate Clans"
};

const PLAYER_SHIP_BASE_OPTIONS = [
    {
        id: "FED_DD",
        faction: "PLAYER",
        shipClass: "DD",
        name: "USS Defiant",
        label: "Federation Destroyer (DD)",
        description: "Escort destroyer with reinforced torpedo pod.",
        torpedo: { loaded: 3, stored: 30, hp: 6, summary: "Dual forward and aft 90-degree arcs" },
        special: "Dual 90-degree torpedo arcs and improved durability."
    },
    {
        id: "FED_CL",
        faction: "PLAYER",
        shipClass: "CL",
        name: "USS Reliant",
        label: "Federation Light Cruiser (CL)",
        description: "Balanced cruiser with strong beams and dual arcs.",
        torpedo: { loaded: 4, stored: 40, hp: 8, summary: "Dual forward and aft 90-degree arcs" },
        special: "Dual 90-degree torpedo arcs with cruiser endurance."
    },
    {
        id: "FED_CA",
        faction: "PLAYER",
        shipClass: "CA",
        name: "USS Enterprise",
        label: "Federation Heavy Cruiser (CA)",
        description: "Galaxy-class heavy cruiser ready for any engagement.",
        torpedo: { loaded: 5, stored: 50, hp: 10, summary: "Dual forward and aft 90-degree arcs" },
        special: "Dual 90-degree torpedo arcs and flagship-grade systems."
    },
    {
        id: "FED_BB",
        faction: "PLAYER",
        shipClass: "BB",
        name: "USS Odyssey",
        label: "Federation Battle Cruiser (BB)",
        description: "Heavy hitter with the largest torpedo magazine.",
        torpedo: { loaded: 7, stored: 70, hp: 14, summary: "Dual forward and aft 90-degree arcs" },
        special: "Maximum-capacity dual torpedo arcs."
    },
    {
        id: "TRI_DD",
        faction: "TRIGON",
        shipClass: "DD",
        name: "IKS K'Tinga",
        label: "Trigon Destroyer (DD)",
        description: "Destroyer that doubles down on disruptor firepower.",
        torpedo: { summary: "No torpedoes; disruptor cannons only" },
        special: "Twin disruptor mounts with +20% turn rate."
    },
    {
        id: "TRI_CL",
        faction: "TRIGON",
        shipClass: "CL",
        name: "IKS Vor'ta",
        label: "Trigon Light Cruiser (CL)",
        description: "Forward-swept cruiser built for relentless disruptor volleys.",
        torpedo: { summary: "No torpedoes; disruptor cannons only" },
        special: "Wide disruptor arcs and +20% turn rate."
    },
    {
        id: "TRI_CA",
        faction: "TRIGON",
        shipClass: "CA",
        name: "IKS Negh'var",
        label: "Trigon Heavy Cruiser (CA)",
        description: "Heavy cruiser with disruptor lattices covering the bow.",
        torpedo: { summary: "No torpedoes; disruptor cannons only" },
        special: "Heavy disruptor banks and +20% turn rate."
    },
    {
        id: "TRI_BB",
        faction: "TRIGON",
        shipClass: "BB",
        name: "IKS Vengeance",
        label: "Trigon Battle Cruiser (BB)",
        description: "Battlecruiser with disruptor coverage fore and aft.",
        torpedo: { summary: "No torpedoes; disruptor cannons only" },
        special: "Forward and aft disruptors with +20% turn rate."
    },
    {
        id: "SCI_DD",
        faction: "SCINTILIAN",
        shipClass: "DD",
        name: "IRW Valdore",
        label: "Scintilian Destroyer (DD)",
        description: "Destroyer that wields chargeable plasma torpedoes.",
        torpedo: { loaded: 1, stored: 0, hp: 4, summary: "Plasma torpedo launcher (forward 90-degree arc)" },
        special: "Cloaking device and charge-to-fire plasma torpedoes."
    },
    {
        id: "SCI_CL",
        faction: "SCINTILIAN",
        shipClass: "CL",
        name: "IRW Khazara",
        label: "Scintilian Light Cruiser (CL)",
        description: "Cruiser with forward and aft plasma launchers.",
        torpedo: { loaded: 1, stored: 0, hp: 4, summary: "Plasma torpedoes fore and aft (90-degree arcs)" },
        special: "Cloaking device with dual plasma arcs."
    },
    {
        id: "SCI_CA",
        faction: "SCINTILIAN",
        shipClass: "CA",
        name: "IRW Haakona",
        label: "Scintilian Heavy Cruiser (CA)",
        description: "Heavy cruiser fielding cloaked plasma strikes.",
        torpedo: { loaded: 1, stored: 0, hp: 4, summary: "Plasma torpedoes fore and aft (90-degree arcs)" },
        special: "Cloaking device with heavy plasma salvos."
    },
    {
        id: "SCI_BB",
        faction: "SCINTILIAN",
        shipClass: "BB",
        name: "IRW Praetor",
        label: "Scintilian Battle Cruiser (BB)",
        description: "Flagship battlecruiser that rains plasma under cloak.",
        torpedo: { loaded: 1, stored: 0, hp: 4, summary: "Plasma torpedoes fore and aft (90-degree arcs)" },
        special: "Cloaking device with dual plasma bombardment."
    },
    {
        id: "PIR_DD",
        faction: "PIRATE",
        shipClass: "DD",
        name: "ITS Corsair",
        label: "Pirate Destroyer (DD)",
        description: "Hybrid destroyer with aft torpedo pod for ambushes.",
        torpedo: { loaded: 4, stored: 20, hp: 4, summary: "Aft 90-degree arc (standard torpedo)" },
        special: "Aft-launched torpedoes paired with salvaged disruptor."
    },
    {
        id: "PIR_CL",
        faction: "PIRATE",
        shipClass: "CL",
        name: "ITS Tempest",
        label: "Pirate Light Cruiser (CL)",
        description: "Pirate cruiser with pulse beams and forward torpedo rack.",
        torpedo: { loaded: 4, stored: 20, hp: 4, summary: "Forward 90-degree arc (standard torpedo)" },
        special: "Pirate-modified pulse beams and torpedoes."
    },
    {
        id: "PIR_CA",
        faction: "PIRATE",
        shipClass: "CA",
        name: "ITS Wraith",
        label: "Pirate Heavy Cruiser (CA)",
        description: "Heavy pirate ship mounting a stolen plasma launcher.",
        torpedo: { loaded: 1, stored: 0, hp: 4, summary: "Plasma torpedo launcher (aft 90-degree arc)" },
        special: "Hybrid Federation beam with black-market plasma."
    },
    {
        id: "PIR_BB",
        faction: "PIRATE",
        shipClass: "BB",
        name: "ITS Tyrant",
        label: "Pirate Battle Cruiser (BB)",
        description: "Heaviest pirate hull wielding disruptor and plasma tech.",
        torpedo: { loaded: 1, stored: 0, hp: 4, summary: "Plasma torpedo launcher (aft 90-degree arc)" },
        special: "Disruptor cannon paired with stolen plasma warheads."
    },
    {
        id: "DHO_DD",
        faction: "DHOJAN",
        shipClass: "DD",
        name: "Dhojan Destroyer",
        label: "Dhojan Destroyer (DD)",
        description: "Advanced destroyer with quantum technology and energy shields.",
        torpedo: { loaded: 3, stored: 30, hp: 6, summary: "Quantum torpedo launcher" },
        special: "Quantum drive, energy shield, advanced sensors. G key: Quantum Drive."
    },
    {
        id: "DHO_CL",
        faction: "DHOJAN",
        shipClass: "CL",
        name: "Dhojan Light Cruiser",
        label: "Dhojan Light Cruiser (CL)",
        description: "Balanced cruiser with quantum systems and energy manipulation.",
        torpedo: { loaded: 4, stored: 40, hp: 8, summary: "Quantum torpedo launcher" },
        special: "Quantum drive, energy shield, advanced sensors. G key: Quantum Drive."
    },
    {
        id: "DHO_CA",
        faction: "DHOJAN",
        shipClass: "CA",
        name: "Dhojan Heavy Cruiser",
        label: "Dhojan Heavy Cruiser (CA)",
        description: "Heavy cruiser with enhanced quantum capabilities.",
        torpedo: { loaded: 5, stored: 50, hp: 10, summary: "Quantum torpedo launcher" },
        special: "Quantum drive, energy shield, advanced sensors. G key: Quantum Drive."
    },
    {
        id: "DHO_BB",
        faction: "DHOJAN",
        shipClass: "BB",
        name: "Dhojan Battle Cruiser",
        label: "Dhojan Battle Cruiser (BB)",
        description: "Flagship battlecruiser with maximum quantum firepower.",
        torpedo: { loaded: 7, stored: 70, hp: 14, summary: "Quantum torpedo launcher" },
        special: "Quantum drive, energy shield, advanced sensors. G key: Quantum Drive."
    },
    {
        id: "COM_DD",
        faction: "COMMONWEALTH",
        shipClass: "DD",
        name: "Commonwealth Destroyer",
        label: "Commonwealth Destroyer (DD)",
        description: "Laser-equipped destroyer with shield reflection technology.",
        torpedo: { loaded: 3, stored: 30, hp: 6, summary: "Laser torpedo launcher" },
        special: "Laser weapons, laser shield reflection, laser targeting. All beam types reflected."
    },
    {
        id: "COM_CL",
        faction: "COMMONWEALTH",
        shipClass: "CL",
        name: "Commonwealth Light Cruiser",
        label: "Commonwealth Light Cruiser (CL)",
        description: "Balanced cruiser with laser battery systems.",
        torpedo: { loaded: 4, stored: 40, hp: 8, summary: "Laser torpedo launcher" },
        special: "Laser weapons, laser shield reflection, laser targeting. All beam types reflected."
    },
    {
        id: "COM_CA",
        faction: "COMMONWEALTH",
        shipClass: "CA",
        name: "Commonwealth Heavy Cruiser",
        label: "Commonwealth Heavy Cruiser (CA)",
        description: "Heavy cruiser with advanced laser arrays.",
        torpedo: { loaded: 5, stored: 50, hp: 10, summary: "Laser torpedo launcher" },
        special: "Laser weapons, laser shield reflection, laser targeting. All beam types reflected."
    },
    {
        id: "COM_BB",
        faction: "COMMONWEALTH",
        shipClass: "BB",
        name: "Commonwealth Battle Cruiser",
        label: "Commonwealth Battle Cruiser (BB)",
        description: "Flagship battlecruiser with maximum laser firepower.",
        torpedo: { loaded: 7, stored: 70, hp: 14, summary: "Laser torpedo launcher" },
        special: "Laser weapons, laser shield reflection, laser targeting. All beam types reflected."
    },
    {
        id: "AND_DD",
        faction: "ANDROMEDAN",
        shipClass: "DD",
        name: "Andromedan Destroyer",
        label: "Andromedan Destroyer (DD)",
        description: "Stealth destroyer with phase technology and cloaking.",
        torpedo: { loaded: 3, stored: 30, hp: 6, summary: "Phase torpedo launcher" },
        special: "Cloaking device, phase shift, sensor jammer. K key: Cloak, P key: Phase Shift."
    },
    {
        id: "AND_CL",
        faction: "ANDROMEDAN",
        shipClass: "CL",
        name: "Andromedan Light Cruiser",
        label: "Andromedan Light Cruiser (CL)",
        description: "Balanced cruiser with enhanced stealth systems.",
        torpedo: { loaded: 4, stored: 40, hp: 8, summary: "Phase torpedo launcher" },
        special: "Cloaking device, phase shift, sensor jammer. K key: Cloak, P key: Phase Shift."
    },
    {
        id: "AND_CA",
        faction: "ANDROMEDAN",
        shipClass: "CA",
        name: "Andromedan Heavy Cruiser",
        label: "Andromedan Heavy Cruiser (CA)",
        description: "Heavy cruiser with advanced phase weaponry.",
        torpedo: { loaded: 5, stored: 50, hp: 10, summary: "Phase torpedo launcher" },
        special: "Cloaking device, phase shift, sensor jammer. K key: Cloak, P key: Phase Shift."
    },
    {
        id: "AND_BB",
        faction: "ANDROMEDAN",
        shipClass: "BB",
        name: "Andromedan Battle Cruiser",
        label: "Andromedan Battle Cruiser (BB)",
        description: "Flagship battlecruiser with maximum phase capabilities.",
        torpedo: { loaded: 7, stored: 70, hp: 14, summary: "Phase torpedo launcher" },
        special: "Cloaking device, phase shift, sensor jammer. K key: Cloak, P key: Phase Shift."
    }
];
/**
 * Star Sea - Game Engine
 * Main game engine that coordinates all systems
 */

class Engine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Core systems
        this.inputManager = new InputManager();
        this.stateManager = new StateManager();
        this.camera = new Camera(this.canvas.width, this.canvas.height);
        this.renderer = new Renderer(this.ctx, this.camera);
        this.playerShipOptions = this.createPlayerShipOptions();
        this.playerShipSelection = null;
        this.playerShipSelectionId = null;
        this.shipSelectElement = null;
        this.shipSummaryElements = {};
        this.shipSelectionHighlightTimeout = null;
        this.hud = new HUD();

        // Performance tracking
        this.trailFrameCounter = 0;
        this.updateCounter = 0;
        this.lastUpdateTime = Date.now();

        // Weapon firing state
        this.beamFiring = false;
        this.torpedoCharging = false;
        this.plasmaChargeStart = 0;
        this.plasmaChargeDamage = 0;

        // Mission system
        this.missionManager = new MissionManager();
        this.missionUI = new MissionUI();

        // Save system
        this.saveManager = new SaveManager();

        // Progression system
        this.progressionManager = new ProgressionManager();

        // Particle system
        this.particleSystem = new ParticleSystem();

        // Audio system
        this.audioManager = new AudioManager();

        // Library system
        this.librarySystem = new LibrarySystem();

        // Advanced systems
        this.tractorBeamSystem = new TractorBeamSystem();
        this.powerManagementSystem = new PowerManagementSystem();
        this.baySystem = new BaySystem();
        this.transporterSystem = new TransporterSystem();
        this.pingSystem = new PingSystem();
        this.balanceSystem = new BalanceSystem();
        this.testingSystem = new TestingSystem();

        // Physics
        this.physicsWorld = new PhysicsWorld();
        this.collisionHandler = new CollisionHandler(this.physicsWorld);
        this.physicsWorld.setCollisionHandler(this.collisionHandler);

        // Game entities
        this.entities = [];
        this.playerShip = null;
        this.enemyShips = [];
        this.environmentalHazards = [];
        this.projectiles = [];
        this.selectedTarget = null; // TAB-selected target for tracking

        // Targeting system
        this.targetingSystem = new TargetingSystem();

        // Warp sequence
        this.warpingOut = false;
        this.warpSequenceTime = 0;
        this.warpSequenceDuration = 3; // 3 seconds

        // Game loop
        this.gameLoop = new GameLoop(
            (dt) => this.update(dt),
            (dt) => this.render(dt)
        );

        // Setup
        this.setupEventListeners();
        this.setupMenuButtons();
        this.setupGameEvents();
        this.setupShipSelectionUI();
    }

    resize() {
        // Set canvas to full window size (actual viewport)
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Also set CSS size to match (prevents scaling/borders)
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';

        // Update camera
        if (this.camera) {
            this.camera.width = this.canvas.width;
            this.camera.height = this.canvas.height;
        }
    }

    setupEventListeners() {
        // ESC to pause/unpause
        eventBus.on('keydown', (data) => {
            if (data.key === 'escape') {
                this.stateManager.togglePause();
            }
            // V key to initiate warp (when charged)
            if (data.key === 'v' && this.playerShip) {
                this.initiateWarp();
            }

            // TAB key to cycle targets
            if (data.key === 'tab' && this.playerShip && this.stateManager.isPlaying()) {
                this.cycleTarget();
            }
            
            // Space bar: Toggle shields
            if (data.key === ' ' && this.playerShip && this.stateManager.isPlaying()) {
                if (this.playerShip.shields) {
                    const shieldState = this.playerShip.shields.toggle(this.playerShip);
                    console.log(`Shields ${shieldState ? 'RAISED' : 'LOWERED'}`);
                    this.audioManager.playSound(shieldState ? 'shield-up' : 'shield-down');
                }
            }
            
            // E key: Drop mine
            if (data.key === 'e' || data.key === 'E') {
                if (this.playerShip && this.stateManager.isPlaying()) {
                    const mine = this.playerShip.deployMine('standard');
                    if (mine) {
                        this.entities.push(mine);
                        this.audioManager.playSound('mine-deploy');
                    }
                }
            }

            // NEW THROTTLE SYSTEM - W/S move caret left/right on speed bar
            // NOTE: Don't interfere with tactical warp (double-tap-and-hold W) or instant stop (double-tap S)
            if (this.playerShip && this.stateManager.isPlaying()) {
                const inputManager = this.inputManager;
                const CARET_MOVE_SPEED = 0.02; // 2% per key press

                // W key - move caret right (increase throttle toward forward)
                // Skip if this is a double-tap (tactical warp takes priority)
                if (data.key === 'w' && inputManager.keysPressed.get('w') && !inputManager.wKeyDoubleTapped) {
                    this.playerShip.throttleCaretPosition = Math.min(1.0, (this.playerShip.throttleCaretPosition || 0.5) + CARET_MOVE_SPEED);
                    // Convert caret position to throttle: right side (1.0) = 100%, center (0.5) = 0%, left (0.0) = -100%
                    if (this.playerShip.throttleCaretPosition >= 0.5) {
                        // Right side: 0% to 100% throttle
                        this.playerShip.throttle = (this.playerShip.throttleCaretPosition - 0.5) * 2; // 0.5->0, 1.0->1.0
                    } else {
                        // Left side: -100% to 0% throttle (max -50% speed)
                        this.playerShip.throttle = (this.playerShip.throttleCaretPosition - 0.5) * 2; // 0.0->-1.0, 0.5->0
                    }
                }

                // S key - move caret left (decrease throttle toward reverse)
                // Skip if this is a double-tap (instant stop takes priority)
                if (data.key === 's' && inputManager.keysPressed.get('s')) {
                    // Check if this was a double-tap (instant stop) - if so, skip throttle adjustment
                    const lastSPressTime = inputManager.lastKeyPressTimes.get('s');
                    // If lastSPressTime is 0, it means a double-tap was just detected (instant-stop triggered)
                    if (lastSPressTime !== 0) {
                        // Not a double-tap, adjust throttle
                        this.playerShip.throttleCaretPosition = Math.max(0.0, (this.playerShip.throttleCaretPosition || 0.5) - CARET_MOVE_SPEED);
                        // Convert caret position to throttle
                        if (this.playerShip.throttleCaretPosition >= 0.5) {
                            this.playerShip.throttle = (this.playerShip.throttleCaretPosition - 0.5) * 2;
                        } else {
                            this.playerShip.throttle = (this.playerShip.throttleCaretPosition - 0.5) * 2;
                        }
                    }
                    // If lastSPressTime is 0, skip throttle adjustment (double-tap detected = instant-stop)
                }

                // A/D keys - turn left/right (no energy cost for normal turns)
                if ((data.key === 'a' || data.key === 'd') && inputManager.keysPressed.get(data.key)) {
                    // Normal turning handled in update loop, no special action needed here
                }
            }

            // Consumable hotkeys (F1-F6) - keys 1-6 are used for bay operations
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            // F1-F6 for consumables
            const consumableKeyMap = {
                'f1': 'extraTorpedoes',
                'f2': 'extraDecoys',
                'f3': 'extraMines',
                'f5': 'hullRepairKit',
                'f6': 'energyCells'
            };

            if (consumableKeyMap[data.key]) {
                if (this.playerShip.consumables) {
                    this.playerShip.consumables.useConsumable(consumableKeyMap[data.key]);
                }
            }

            // G key: Dhojan Quantum Drive
            if (data.key === 'g' || data.key === 'G') {
                if (this.playerShip && this.stateManager.isPlaying() && this.playerShip.faction === 'DHOJAN') {
                    // Get mouse position in world coordinates
                    const mousePos = this.inputManager.getMousePosition();
                    const worldPos = this.camera.screenToWorld(mousePos.x, mousePos.y);
                    
                    if (this.playerShip.useQuantumDrive && this.playerShip.useQuantumDrive(worldPos.x, worldPos.y)) {
                        this.hud.addCriticalMessage('Quantum Drive activated!');
                        this.audioManager.playSound('boost');
                    } else {
                        this.hud.addCriticalMessage('Quantum Drive: Out of range or on cooldown');
                    }
                }
            }

            // K key: Andromedan Cloak Toggle
            if (data.key === 'k' || data.key === 'K') {
                if (this.playerShip && this.stateManager.isPlaying() && this.playerShip.faction === 'ANDROMEDAN') {
                    if (this.playerShip.activateCloak && this.playerShip.activateCloak()) {
                        this.hud.addCriticalMessage('Cloak activated');
                        this.audioManager.playSound('shield-up');
                    } else if (this.playerShip.deactivateCloak && this.playerShip.deactivateCloak()) {
                        this.hud.addCriticalMessage('Cloak deactivated');
                        this.audioManager.playSound('shield-down');
                    } else {
                        this.hud.addCriticalMessage('Cloak: On cooldown');
                    }
                }
            }

            // P key: Andromedan Phase Shift
            if (data.key === 'p' || data.key === 'P') {
                if (this.playerShip && this.stateManager.isPlaying() && this.playerShip.faction === 'ANDROMEDAN') {
                    const currentTime = performance.now() / 1000;
                    if (this.playerShip.activatePhaseShift && this.playerShip.activatePhaseShift(currentTime)) {
                        this.hud.addCriticalMessage('Phase Shift activated!');
                        this.audioManager.playSound('boost');
                    } else {
                        this.hud.addCriticalMessage('Phase Shift: On cooldown');
                    }
                }
            }
        });

        // Mouse wheel zoom
        eventBus.on('mouse-wheel', (data) => {
            this.camera.adjustZoom(data.delta);
        });

        // Weapon firing - new hold-to-fire system
        eventBus.on('beam-fire-start', (data) => {
            console.log('🔫 Beam fire START event received');
            // Check if briefing screen is visible
            const briefingScreen = document.getElementById('briefing-screen');
            if (briefingScreen && !briefingScreen.classList.contains('hidden')) {
                console.log('⚠️ Cannot fire: briefing screen is visible');
                return;
            }
            if (!this.stateManager.isPlaying() || !this.playerShip) {
                console.log('⚠️ Cannot fire: playing=' + this.stateManager.isPlaying() + ', hasShip=' + !!this.playerShip);
                return;
            }
            this.beamFiring = true;

            // Get mouse world position for fixed start point calculation
            const mousePos = this.inputManager.getMousePosition();
            const worldPos = this.camera.screenToWorld(mousePos.x, mousePos.y);
            const currentTime = performance.now() / 1000;

            // Start firing all continuous beam weapons with FIXED start points
            for (const weapon of this.playerShip.weapons) {
                if (weapon instanceof ContinuousBeam) {
                    weapon.startFiring(currentTime, this.playerShip, worldPos.x, worldPos.y);
                }
            }

            // Don't start sound here - let the update loop manage it based on actual firing
            // Sound will only play when beams are actually firing (projectiles created)

            console.log('✅ beamFiring set to TRUE with fixed start point');
        });

        eventBus.on('beam-fire-stop', (data) => {
            this.beamFiring = false;

            // Stop firing all continuous beam weapons
            if (this.playerShip) {
                const currentTime = performance.now() / 1000;
                for (const weapon of this.playerShip.weapons) {
                    if (weapon instanceof ContinuousBeam) {
                        weapon.stopFiring(currentTime);
                    }
                }
            }

            // Stop looping beam sound
            this.audioManager.stopLoopingSound('fed-beam');

            console.log('✅ beamFiring set to FALSE');
        });

        eventBus.on('torpedo-fire-start', (data) => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            // Check if player has plasma torpedoes (Scintilian)
            if (this.playerShip.faction === 'SCINTILIAN') {
                // Start charging plasma torpedo
                this.torpedoCharging = true;
                this.plasmaChargeStart = performance.now() / 1000;
                this.plasmaChargeDamage = 0;
            } else {
                // Standard torpedo - fire immediately on click
                const worldPos = this.camera.screenToWorld(data.x, data.y);
                const lockOnTarget = this.targetingSystem.getLockedTarget();
                if (CONFIG.DEBUG_MODE && lockOnTarget) {
                    console.log('🚀 Firing torpedo with lock-on target:', lockOnTarget.name || lockOnTarget.faction + ' ' + lockOnTarget.shipClass);
                }
                const projectiles = this.playerShip.fireTorpedoes(worldPos.x, worldPos.y, lockOnTarget);
                if (projectiles && projectiles.length > 0) {
                    this.projectiles.push(...projectiles);
                    this.entities.push(...projectiles);
                    this.audioManager.playSound('torpedo-fire');
                }
            }
        });

        eventBus.on('torpedo-fire-release', (data) => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            // Release plasma torpedo if charging
            if (this.torpedoCharging) {
                this.torpedoCharging = false;

                // Fire plasma torpedo with accumulated charge
                const worldPos = this.camera.screenToWorld(data.x, data.y);
                const nearestTarget = this.findNearestTargetToReticle(worldPos.x, worldPos.y);
                const projectiles = this.playerShip.firePlasma(worldPos.x, worldPos.y, nearestTarget, this.plasmaChargeDamage);
                if (projectiles && projectiles.length > 0) {
                    this.projectiles.push(...projectiles);
                    this.entities.push(...projectiles);
                    this.audioManager.playSound('plasma-fire');
                }

                this.plasmaChargeDamage = 0;
            }
        });

        // Decoy/mine deployment
        eventBus.on('deploy-decoy', () => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            const decoy = this.playerShip.deployDecoy();
            if (decoy) {
                this.entities.push(decoy);
                this.audioManager.playSound('decoy-deploy');
            }
        });

        eventBus.on('deploy-mine', (data) => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            const mineType = data && data.mineType ? data.mineType : 'standard';
            const mine = this.playerShip.deployMine(mineType);
            if (mine) {
                this.entities.push(mine);
                this.audioManager.playSound('mine-deploy');
            }
        });

        // Torpedo type cycling
        eventBus.on('cycle-torpedo-type', () => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            const newType = this.playerShip.cycleTorpedoType();
            console.log(`Torpedo type changed to: ${newType}`);
        });

        // Interceptor deployment
        eventBus.on('deploy-interceptor', () => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            const interceptor = this.playerShip.deployInterceptor();
            if (interceptor) {
                this.entities.push(interceptor);
                this.audioManager.playSound('torpedo-fire'); // Reuse torpedo sound for now
                console.log('Interceptor missile deployed');
            }
        });

        // Shuttle/Fighter/Bomber launches from BaySystem
        eventBus.on('shuttle-launched', (data) => {
            if (data.shuttle) {
                this.entities.push(data.shuttle);
                this.audioManager.playSound('shuttle-launch');
                console.log(`Shuttle launched on ${data.missionType} mission`);
            }
        });

        eventBus.on('fighter-launched', (data) => {
            if (data.fighter) {
                this.entities.push(data.fighter);
                this.audioManager.playSound('fighter-launch');
                console.log('Fighter launched');
            }
        });

        eventBus.on('bomber-launched', (data) => {
            if (data.bomber) {
                this.entities.push(data.bomber);
                this.audioManager.playSound('bomber-launch');
                console.log('Bomber launched');
            }
        });

        // Shuttle/Fighter/Bomber weapon firing events
        eventBus.on('shuttle-fired-beam', (data) => {
            if (data.projectile) {
                this.projectiles.push(data.projectile);
                this.entities.push(data.projectile);
                this.audioManager.playSound('beam-fire', { volume: 0.3 });
            }
        });

        eventBus.on('fighter-fired-beam', (data) => {
            if (data.projectile) {
                this.projectiles.push(data.projectile);
                this.entities.push(data.projectile);
                this.audioManager.playSound('beam-fire', { volume: 0.3 });
            }
        });

        eventBus.on('bomber-fired-beam', (data) => {
            if (data.projectile) {
                this.projectiles.push(data.projectile);
                this.entities.push(data.projectile);
                this.audioManager.playSound('beam-fire', { volume: 0.4 });
            }
        });

        eventBus.on('bomber-fired-torpedo', (data) => {
            if (data.projectile) {
                this.projectiles.push(data.projectile);
                this.entities.push(data.projectile);
                this.audioManager.playSound('torpedo-fire', { volume: 0.4 });
            }
        });

        // Double-tap W: Burst acceleration (2x max speed, then slow to normal, instant energy cost)
        eventBus.on('burst-acceleration', (data) => {
            if (!this.stateManager.isPlaying() || !this.playerShip || !this.playerShip.energy) return;
            
            // Check if ship has energy
            if (this.playerShip.energy.getTotalEnergy() <= 0) {
                console.log('Burst acceleration failed: No energy');
                return;
            }
            
            // Instant energy cost (drain a chunk)
            const energyCost = 20; // Adjust as needed for balance
            this.playerShip.energy.drainEnergy(energyCost);
            
            // Set burst speed (2x max speed)
            const burstSpeed = this.playerShip.maxSpeed * 2;
            this.playerShip.currentSpeed = burstSpeed;
            
            // Ship will slow back to normal via throttle system
            console.log(`Burst acceleration activated! Speed: ${burstSpeed.toFixed(0)}`);
            this.audioManager.playSound('boost');
        });
        
        // Double-tap S: Instant stop (instant energy cost)
        eventBus.on('instant-stop', (data) => {
            if (!this.stateManager.isPlaying() || !this.playerShip || !this.playerShip.energy) return;
            
            // Check if ship has energy
            if (this.playerShip.energy.getTotalEnergy() <= 0) {
                console.log('Instant stop failed: No energy');
                return;
            }
            
            // Instant energy cost
            const energyCost = 15; // Adjust as needed for balance
            this.playerShip.energy.drainEnergy(energyCost);
            
            // Instant stop
            this.playerShip.currentSpeed = 0;
            this.playerShip.throttle = 0;
            this.playerShip.targetSpeed = 0;
            
            console.log('Instant stop activated!');
            this.audioManager.playSound('boost');
        });
        
        // Double-tap A/D: Fast rotation (3-4x normal turn rate, instant energy cost)
        eventBus.on('fast-rotate', (data) => {
            if (!this.stateManager.isPlaying() || !this.playerShip || !this.playerShip.energy) return;
            
            // Check if ship has energy
            if (this.playerShip.energy.getTotalEnergy() <= 0) {
                console.log('Fast rotate failed: No energy');
                return;
            }
            
            // Instant energy cost
            const energyCost = 10; // Adjust as needed for balance
            this.playerShip.energy.drainEnergy(energyCost);
            
            // Activate fast rotation (3-4x normal)
            const fastRotateMultiplier = 3.5;
            this.playerShip.fastRotateActive = true;
            this.playerShip.fastRotateMultiplier = fastRotateMultiplier;
            this.playerShip.fastRotateEndTime = performance.now() / 1000 + 1.0; // 1 second duration
            
            console.log(`Fast rotation activated! (${fastRotateMultiplier}x turn rate)`);
            this.audioManager.playSound('boost');
        });

        // Tactical warp events (double-tap-and-hold W)
        eventBus.on('tactical-warp-start', (data) => {
            if (!this.stateManager.isPlaying() || !this.playerShip || !this.playerShip.energy) return;
            
            // Only allow for specific factions
            const allowedFactions = ['FEDERATION', 'SCINTILIAN', 'TRIGON', 'PIRATE', 'PLAYER'];
            if (!allowedFactions.includes(this.playerShip.faction)) {
                console.log('Tactical warp not available for this faction');
                return;
            }

            // Check cooldown
            const currentTime = performance.now() / 1000;
            if (currentTime < this.playerShip.tacticalWarpCooldownEnd) {
                const cooldownRemaining = this.playerShip.tacticalWarpCooldownEnd - currentTime;
                console.log(`Tactical warp on cooldown: ${cooldownRemaining.toFixed(1)}s remaining`);
                this.hud.addCriticalMessage(`Tactical Warp: ${cooldownRemaining.toFixed(1)}s cooldown`);
                return;
            }

            // Activate tactical warp
            if (this.playerShip.activateTacticalWarp(currentTime)) {
                console.log('Tactical warp activated!');
                this.audioManager.playSound('boost');
                this.hud.addCriticalMessage('TACTICAL WARP ENGAGED');
            }
        });

        eventBus.on('tactical-warp-end', (data) => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;
            
            const currentTime = performance.now() / 1000;
            this.playerShip.deactivateTacticalWarp(currentTime);
            
            const cooldownDuration = this.playerShip.tacticalWarpLastDuration * 5;
            console.log(`Tactical warp ended. Duration: ${this.playerShip.tacticalWarpLastDuration.toFixed(1)}s, Cooldown: ${cooldownDuration.toFixed(1)}s`);
            this.hud.addCriticalMessage(`Tactical Warp: ${cooldownDuration.toFixed(1)}s cooldown`);
            this.audioManager.playSound('boost');
        });

        eventBus.on('tactical-warp-ended-energy', (data) => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;
            
            const cooldownDuration = this.playerShip.tacticalWarpLastDuration * 5;
            console.log(`Tactical warp ended (energy depleted). Cooldown: ${cooldownDuration.toFixed(1)}s`);
            this.hud.addCriticalMessage(`Tactical Warp: Energy depleted. ${cooldownDuration.toFixed(1)}s cooldown`);
        });

        eventBus.on('tactical-warp-low-energy', (data) => {
            if (!this.stateManager.isPlaying()) return;
            this.hud.addCriticalMessage('WARNING: Tactical Warp energy low!');
        });

        eventBus.on('tactical-warp-low-energy-warning', (data) => {
            if (!this.stateManager.isPlaying()) return;
            this.hud.addCriticalMessage('WARNING: Low energy for Tactical Warp');
        });

        eventBus.on('tactical-warp-cooldown', (data) => {
            if (!this.stateManager.isPlaying()) return;
            this.hud.addCriticalMessage(`Tactical Warp: ${data.cooldownRemaining.toFixed(1)}s cooldown`);
        });

        // Lock-on events for reticle visuals
        eventBus.on('lock-acquired', (data) => {
            const reticle = document.getElementById('reticle');
            if (reticle) reticle.classList.add('locked');
            this.audioManager.playSound('lock-acquired');
        });

        eventBus.on('lock-starting', (data) => {
            const reticle = document.getElementById('reticle');
            if (reticle) {
                reticle.classList.remove('locked');
                reticle.classList.add('locking');
            }
        });

        eventBus.on('lock-degrading', (data) => {
            const reticle = document.getElementById('reticle');
            if (reticle) {
                reticle.classList.remove('locked', 'locking');
                reticle.classList.add('degrading');
            }
        });

        eventBus.on('lock-broken', (data) => {
            const reticle = document.getElementById('reticle');
            if (reticle) {
                reticle.classList.remove('locked', 'locking', 'degrading');
            }
        });
    }

    setupMenuButtons() {
        const bindClick = (id, handler) => {
            const el = document.getElementById(id);
            if (el) {
                // Remove any existing listeners by cloning and replacing
                const newEl = el.cloneNode(true);
                el.parentNode.replaceChild(newEl, el);
                newEl.addEventListener('click', handler);
            }
        };

        const highlightSelection = () => this.highlightShipSelectionPanel();
        const showOptions = () => {
            // For now, just highlight the ship selection panel
            // TODO: Create a proper options screen for game settings
            this.highlightShipSelectionPanel();
            // Also scroll to ship selection if needed
            const panel = document.getElementById('ship-selection-panel');
            if (panel) {
                panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        // Main menu
        bindClick('btn-new-game', () => this.startNewGame());
        bindClick('btn-load-game', () => this.loadSavedGame());
        bindClick('btn-library', () => this.showLibrary());
        bindClick('btn-options', showOptions);

        // Pause menu
        bindClick('btn-resume', () => this.stateManager.setState('PLAYING'));
        bindClick('btn-save', () => this.saveCurrentGame());
        bindClick('btn-load', () => this.loadSavedGame());
        bindClick('btn-options-pause', highlightSelection);
        bindClick('btn-main-menu', () => {
            if (confirm('Return to main menu? Unsaved progress will be lost.')) {
                this.stateManager.setState('MAIN_MENU');
            }
        });
    }

    setupGameEvents() {
        // Player damage
        eventBus.on('player-damage', (data) => {
            this.hud.addCriticalMessage(`Hull breach! ${Math.round(data.damage)} damage taken. HP: ${Math.round(data.hp)}`);
            this.audioManager.playSound('hull-breach');
        });

        // Shield hit
        eventBus.on('shield-hit', (data) => {
            this.hud.addCriticalMessage(`Shields absorbed ${Math.round(data.damage)} damage!`);
            // Shield impact effect (flare)
            if (data.point) {
                this.particleSystem.createShieldImpact(data.point.x || data.point.x, data.point.y || data.point.y, {
                    color: data.ship?.isPlayer ? '#00ffff' : '#ff6600'
                });
            } else if (data.position) {
                this.particleSystem.createShieldImpact(data.position.x, data.position.y, {
                    color: data.ship?.isPlayer ? '#00ffff' : '#ff6600'
                });
            }
            this.audioManager.playSound('shield-hit');
        });

        // System damage
        eventBus.on('system-damage', (data) => {
            const efficiency = Math.round((data.hp / data.maxHp) * 100);
            this.hud.addCriticalMessage(`${data.system} hit! ${Math.round(data.damage)} damage (${efficiency}% operational)`);

            // Damage sparks
            if (data.ship) {
                this.particleSystem.createDamageSparks(data.ship.x, data.ship.y, 3);
            }

            this.audioManager.playSound('system-damage');

            if (data.hp === 0) {
                this.hud.addCriticalMessage(`WARNING: ${data.system} DESTROYED!`);
                // More sparks for destroyed system
                if (data.ship) {
                    this.particleSystem.createDamageSparks(data.ship.x, data.ship.y, 8);
                }
                this.audioManager.playSound('alert-warning');
            }
        });

        // Control glitch from damaged C&C
        eventBus.on('control-glitch', () => {
            this.hud.addCriticalMessage('CONTROL SYSTEMS MALFUNCTION!');
        });

        // Player destroyed
        eventBus.on('player-destroyed', () => {
            this.hud.addCriticalMessage('SHIP DESTROYED!');

            // Create ship explosion first
            if (this.playerShip) {
                const shipSize = this.playerShip.getShipSize();
                this.particleSystem.createShipExplosion(
                    this.playerShip.x,
                    this.playerShip.y,
                    shipSize,
                    { color: this.playerShip.color }
                );
                this.audioManager.playSound('explosion-large');
            }

            // Show mission failed screen AFTER explosion (2 second delay)
            setTimeout(() => {
                alert('Game Over! Your ship was destroyed.');
                this.stateManager.setState('MAIN_MENU');
            }, 2000);
        });

        // Ship-asteroid collision
        eventBus.on('ship-asteroid-collision', (data) => {
            if (data.ship.isPlayer) {
                this.hud.addCriticalMessage(`Asteroid collision! Size: ${data.asteroid.size}`);
            }
        });

        // Ship destroyed by collapsar
        eventBus.on('ship-destroyed', (data) => {
            if (data.ship && data.ship.isPlayer && data.cause === 'collapsar') {
                this.hud.addCriticalMessage('PULLED INTO COLLAPSAR!');
            }
        });

        // AI weapon firing events
        eventBus.on('ai-fired-beams', (data) => {
            if (data.projectiles) {
                this.projectiles.push(...data.projectiles);
                this.entities.push(...data.projectiles);

                // Play appropriate weapon sound based on projectile type
                if (data.projectiles.length > 0) {
                    const projectileType = data.projectiles[0].projectileType;
                    if (projectileType === 'disruptor') {
                        // Play disruptor sound 3 times rapidly
                        this.audioManager.playSound('disruptor-fire', { volume: 0.5 });
                        setTimeout(() => this.audioManager.playSound('disruptor-fire', { volume: 0.5 }), 50);
                        setTimeout(() => this.audioManager.playSound('disruptor-fire', { volume: 0.5 }), 100);
                    } else {
                        this.audioManager.playSound('beam-fire', { volume: 0.5 });
                    }
                }
            }
        });

        eventBus.on('ai-fired-torpedoes', (data) => {
            if (data.projectiles) {
                this.projectiles.push(...data.projectiles);
                this.entities.push(...data.projectiles);

                // Play appropriate torpedo sound based on faction and type
                if (data.projectiles.length > 0) {
                    const projectileType = data.projectiles[0].projectileType;
                    if (projectileType === 'plasma') {
                        this.audioManager.playSound('plasma-fire', { volume: 0.5 });
                    } else {
                        // Check faction for torpedo sound
                        const isPirate = data.ship && data.ship.faction === 'PIRATE';
                        const soundName = isPirate ? 'pirate-torpedo' : 'torpedo-fire';
                        this.audioManager.playSound(soundName, { volume: 0.5 });
                    }
                }
            }
        });

        eventBus.on('ai-deploy-decoy', (data) => {
            if (data.ship) {
                const decoy = data.ship.deployDecoy();
                if (decoy) {
                    this.entities.push(decoy);
                }
            }
        });

        // Mission events
        eventBus.on('mission-accepted', (data) => {
            this.startMission(data.mission.id);
        });

        eventBus.on('mission-completed', (data) => {
            // Award mission rewards
            const rewards = this.progressionManager.awardMissionRewards(data);

            // Add rewards to debriefing data
            data.rewards = rewards;

            this.missionUI.showDebriefing(data);
        });

        eventBus.on('load-next-mission', (data) => {
            this.loadMission(data.missionId);
        });

        eventBus.on('objective-completed', (data) => {
            this.hud.addCriticalMessage(`Objective Complete: ${data.objective.description}`);
            this.audioManager.playSound('objective-complete');
        });

        eventBus.on('enemy-destroyed', (data) => {
            if (this.missionManager.missionActive) {
                this.missionManager.handleEnemyDestroyed(data.enemy);
            }
            // Create ship explosion
            if (data.enemy) {
                const shipSize = data.enemy.getShipSize ? data.enemy.getShipSize() : 70;
                this.particleSystem.createShipExplosion(
                    data.enemy.x,
                    data.enemy.y,
                    shipSize,
                    { color: data.enemy.color || '#ff6600' }
                );

                // Play appropriate explosion sound based on ship size
                const sizeRatio = shipSize / 70; // Normalize to CA class (70px)
                if (sizeRatio > 1.2) {
                    this.audioManager.playSound('explosion-large');
                } else if (sizeRatio > 0.8) {
                    this.audioManager.playSound('explosion-medium');
                } else {
                    this.audioManager.playSound('explosion-small');
                }
            }
        });

        // Mine detonation explosion effect
        eventBus.on('mine-detonated', (data) => {
            if (data.mine) {
                // Create explosion effect at mine position
                this.particleSystem.createExplosion(data.mine.x, data.mine.y, {
                    particleCount: 40,
                    size: 1.2,
                    color: data.mine.color || '#ff4400',
                    speed: 120
                });
                // Play explosion sound
                this.audioManager.playSound('explosion-medium');
            }
        });
    }

    createPlayerShipOptions() {
        const options = PLAYER_SHIP_BASE_OPTIONS.map((base) => {
            const option = { ...base };
            option.classLabel = SHIP_CLASS_LABELS[option.shipClass] || option.shipClass;
            option.factionLabel = FACTION_DISPLAY_NAMES[option.faction] || option.faction;
            const stats = this.getClassStats(option.shipClass);
            option.hull = stats.hull;
            option.speed = stats.speed;
            return option;
        });
        console.log('🚢 Player ship options created:', options.length, 'ships');
        console.log('Ship IDs:', options.map(o => o.id).join(', '));
        return options;
    }

    getClassStats(shipClass) {
        const fallback = { hull: undefined, speed: undefined };
        if (typeof CONFIG === 'undefined') {
            return fallback;
        }
        const hpKey = `SHIP_HP_${shipClass}`;
        const speedKey = `MAX_SPEED_${shipClass}`;
        return {
            hull: CONFIG[hpKey] !== undefined ? CONFIG[hpKey] : fallback.hull,
            speed: CONFIG[speedKey] !== undefined ? CONFIG[speedKey] : fallback.speed
        };
    }

    loadPlayerShipSelectionId() {
        try {
            return typeof window !== 'undefined' && window.localStorage
                ? localStorage.getItem('star-sea-player-ship')
                : null;
        } catch (error) {
            console.warn('Unable to load player ship selection', error);
            return null;
        }
    }

    savePlayerShipSelectionId(id) {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('star-sea-player-ship', id);
            }
        } catch (error) {
            console.warn('Unable to persist player ship selection', error);
        }
    }

    findPlayerShipOptionById(id) {
        if (!id) return null;
        return this.playerShipOptions.find(option => option.id === id) || null;
    }

    findPlayerShipOptionByShip(faction, shipClass) {
        if (!faction || !shipClass) return null;
        return this.playerShipOptions.find(option => option.faction === faction && option.shipClass === shipClass) || null;
    }

    applyPlayerShipOption(option, { skipSave = false, skipUI = false } = {}) {
        if (!option) return;
        this.playerShipSelection = { ...option };
        this.playerShipSelectionId = option.id;

        if (!skipUI && this.shipSelectElement) {
            this.shipSelectElement.value = option.id;
        }

        this.updateShipSelectionSummary(option);

        if (!skipSave) {
            this.savePlayerShipSelectionId(option.id);
        }

        if (!skipUI) {
            this.highlightShipSelectionPanel();
        }
    }



    setupShipSelectionUI() {
        const select = document.getElementById('player-ship-select');
        this.shipSummaryElements = {
            role: document.getElementById('ship-summary-role'),
            description: document.getElementById('ship-summary-description'),
            stats: document.getElementById('ship-summary-stats'),
            torpedoes: document.getElementById('ship-summary-torpedoes'),
            special: document.getElementById('ship-summary-special')
        };

        const storedId = this.loadPlayerShipSelectionId();
        let selectedOption = this.findPlayerShipOptionById(storedId) || this.playerShipOptions[0];
        this.applyPlayerShipOption(selectedOption, { skipSave: true, skipUI: true });

        if (!select) {
            this.savePlayerShipSelectionId(selectedOption.id);
            return;
        }

        this.shipSelectElement = select;
        select.innerHTML = '';
        console.log('📋 Populating ship dropdown with', this.playerShipOptions.length, 'ships:');
        for (const option of this.playerShipOptions) {
            console.log('  -', option.id, ':', option.label);
            const opt = document.createElement('option');
            opt.value = option.id;
            opt.textContent = option.label;
            select.appendChild(opt);
        }
        console.log('✅ Ship dropdown populated');

        select.value = selectedOption.id;
        this.updateShipSelectionSummary(selectedOption);
        this.savePlayerShipSelectionId(selectedOption.id);

        select.addEventListener('change', (event) => {
            const option = this.findPlayerShipOptionById(event.target.value);
            if (option) {
                this.applyPlayerShipOption(option);
                this.updateShipSelectionSummary(option);
            }
        });

        this.highlightShipSelectionPanel();
    }

    updateShipSelectionSummary(option) {
        if (!option || !this.shipSummaryElements) return;

        const { role, description, stats, torpedoes, special } = this.shipSummaryElements;

        if (role) {
            const shipName = option.name || option.label;
            role.textContent = `${shipName} - ${option.factionLabel} ${option.classLabel}`;
        }
        if (description) {
            description.textContent = option.description || '';
        }
        if (stats) {
            const hullText = option.hull !== undefined ? option.hull : '?';
            const speedText = option.speed !== undefined ? Math.round(option.speed) : '?';
            stats.textContent = `Hull ${hullText} HP | Max speed ${speedText}`;
        }
        if (torpedoes) {
            if (option.torpedo) {
                if (option.torpedo.loaded !== undefined && option.torpedo.stored !== undefined) {
                    let summary = `Torpedoes: ${option.torpedo.loaded} loaded / ${option.torpedo.stored} reserve`;
                    if (option.torpedo.summary) {
                        summary += ` | ${option.torpedo.summary}`;
                    }
                    torpedoes.textContent = summary;
                } else {
                    torpedoes.textContent = `Torpedoes: ${option.torpedo.summary || 'None'}`;
                }
            } else {
                torpedoes.textContent = 'Torpedoes: None';
            }
        }
        if (special) {
            if (option.special) {
                special.textContent = `Special: ${option.special}`;
                special.style.display = '';
            } else {
                special.textContent = '';
                special.style.display = 'none';
            }
        }
    }

    highlightShipSelectionPanel() {
        const panel = document.getElementById('ship-selection-panel');
        if (!panel) return;
        panel.classList.add('highlight');
        if (this.shipSelectionHighlightTimeout) {
            clearTimeout(this.shipSelectionHighlightTimeout);
        }
        this.shipSelectionHighlightTimeout = setTimeout(() => {
            panel.classList.remove('highlight');
        }, 800);
    }
    startNewGame() {
        try {
            console.log('🚀 Starting new game...');

            // Initialize audio on first interaction (required by browsers)
            this.audioManager.initialize();
            console.log('✅ Audio initialized');

            // Clear entities
            this.entities = [];
            this.enemyShips = [];
            this.environmentalHazards = [];
            this.projectiles = [];
            console.log('✅ Entities cleared');

            // Clear particle system
            this.particleSystem.clear();
            console.log('✅ Particle system cleared');

            const selectedOption = this.findPlayerShipOptionById(this.playerShipSelectionId) || this.playerShipOptions[0];
            console.log('✅ Selected ship option:', selectedOption);
            this.applyPlayerShipOption(selectedOption, { skipSave: false, skipUI: true });

            // Create player ship based on selection
            console.log('🚀 Creating player ship...');
            this.playerShip = ShipFactory.createShip({
                x: 0,
                y: 0,
                shipClass: selectedOption.shipClass,
                faction: selectedOption.faction,
                name: selectedOption.name,
                isPlayer: true,
                physicsWorld: this.physicsWorld
            });
            console.log('✅ Player ship created:', this.playerShip);

            this.entities.push(this.playerShip);
            console.log('✅ Player ship added to entities');

            // Initialize advanced systems
            console.log('🔧 Initializing advanced systems...');
            try {
                console.log('  → Initializing tractor beam system...');
                this.tractorBeamSystem.init(this.playerShip);
                console.log('  ✓ Tractor beam system initialized');

                console.log('  → Initializing power management system...');
                this.powerManagementSystem.init(this.playerShip);
                console.log('  ✓ Power management system initialized');

                console.log('  → Initializing bay system...');
                this.baySystem.init(this.playerShip);
                console.log('  ✓ Bay system initialized');

                console.log('  → Initializing transporter system...');
                this.transporterSystem.init(this.playerShip);
                console.log('  ✓ Transporter system initialized');

                console.log('  → Initializing ping system...');
                this.pingSystem.init(this.playerShip);
                console.log('  ✓ Ping system initialized');

                console.log('  → Initializing testing system...');
                this.testingSystem.init(this);
                console.log('  ✓ Testing system initialized');

                console.log('✅ Advanced systems initialized');
            } catch (error) {
                console.error('❌ ERROR during system initialization:', error);
                console.error('Error stack:', error.stack);
                throw error; // Re-throw to see full error in console
            }

            // Start game loop
            console.log('🎮 Starting game loop...');
            this.stateManager.setState('PLAYING');
            if (!this.gameLoop.running) {
                this.gameLoop.start();
            }
            console.log('✅ Game loop started');

            // Load first mission
            console.log('📋 Loading first mission...');
            this.loadMission('mission-01');
            console.log('✅ Mission loaded');

            // Spawn some test entities for immediate gameplay
            console.log('🌌 Spawning test environment...');
            this.spawnTestAsteroids();
            // TEMPORARILY DISABLED TO FIX NaN BUG
            // this.spawnPlanets(); // Spawn 2-3 planets
            // this.spawnStars(1); // Spawn 1 star
            // this.spawnBlackHoles(0.5, 1); // 50% chance of 1 black hole
            // this.spawnNebulas(); // Spawn 1-3 nebula regions
            this.spawnTestEnemies();
            console.log('✅ Test environment spawned');

            console.log('🎉 New game started successfully!');
        } catch (error) {
            console.error('❌ FATAL ERROR in startNewGame:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            alert('Failed to start new game. Check console for details.\nError: ' + error.message);
        }
    }
    spawnTestAsteroids() {
        // Spawn a few test asteroids around the player
        const asteroidConfigs = [
            { x: 300, y: 200, size: 'large' },
            { x: -400, y: -150, size: 'large' },
            { x: 500, y: -300, size: 'medium' },
            { x: -200, y: 400, size: 'medium' },
            { x: 150, y: -250, size: 'small' },
            { x: -350, y: 150, size: 'small' }
        ];

        for (const config of asteroidConfigs) {
            const asteroid = new Asteroid(config.x, config.y, config.size, this.physicsWorld);
            this.entities.push(asteroid);
        }
    }

    /**
     * Spawn an asteroid field (for mission generation)
     * @param {Object} fieldConfig - Configuration for the asteroid field
     * @param {Object} fieldConfig.center - {x, y} center position
     * @param {number} fieldConfig.radius - Radius of the field
     * @param {number} fieldConfig.density - Number of asteroids (10-50 recommended)
     * @param {Object} fieldConfig.sizeDistribution - {large: 0.2, medium: 0.5, small: 0.3}
     */
    spawnAsteroidField(fieldConfig) {
        const {
            center = { x: 0, y: 0 },
            radius = 2000,
            density = 20,
            sizeDistribution = { large: 0.2, medium: 0.5, small: 0.3 }
        } = fieldConfig;

        console.log(`🪨 Spawning asteroid field: ${density} asteroids, radius ${radius}px`);

        for (let i = 0; i < density; i++) {
            // Random position within radius
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.sqrt(Math.random()) * radius; // sqrt for uniform distribution
            const x = center.x + Math.cos(angle) * distance;
            const y = center.y + Math.sin(angle) * distance;

            // Determine size based on distribution
            const roll = Math.random();
            let size;
            if (roll < sizeDistribution.large) {
                size = 'large';
            } else if (roll < sizeDistribution.large + sizeDistribution.medium) {
                size = 'medium';
            } else {
                size = 'small';
            }

            const asteroid = new Asteroid(x, y, size, this.physicsWorld);
            this.entities.push(asteroid);
        }

        console.log(`✅ Asteroid field spawned: ${density} asteroids`);
    }

    /**
     * Spawn planets for mission environment
     * @param {number} count - Number of planets to spawn (default: 2-3)
     */
    spawnPlanets(count = null) {
        // Default to 2-3 planets if not specified
        if (count === null) {
            count = 2 + Math.floor(Math.random() * 2);
        }

        console.log(`🪐 Spawning ${count} planets...`);

        // Planet color variations
        const planetColors = [
            '#8B7355', // Brown/tan (default)
            '#4169E1', // Blue (water world)
            '#CD853F', // Orange/tan (desert)
            '#90EE90', // Light green (vegetation)
            '#A9A9A9', // Gray (rocky/barren)
            '#FF6347'  // Red (volcanic)
        ];

        const minDistance = 3000; // Minimum distance from center (player spawn)
        const maxDistance = 8000; // Maximum distance from center

        for (let i = 0; i < count; i++) {
            // Random position far from center
            const angle = Math.random() * Math.PI * 2;
            const distance = minDistance + Math.random() * (maxDistance - minDistance);
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            // Vary planet sizes
            const radiusVariation = 0.7 + Math.random() * 0.6; // 0.7x to 1.3x
            const radius = CONFIG.PLANET_RADIUS * radiusVariation;

            // Random color
            const color = planetColors[Math.floor(Math.random() * planetColors.length)];

            const planet = new Planet(x, y, {
                radius: radius,
                gravityStrength: CONFIG.PLANET_GRAVITY_STRENGTH,
                gravityMaxRange: CONFIG.PLANET_GRAVITY_MAX_RANGE,
                color: color
            });

            this.entities.push(planet);
        }

        console.log(`✅ Spawned ${count} planets`);
    }

    /**
     * Spawn stars for mission environment
     * @param {number} count - Number of stars to spawn (default: 1)
     */
    spawnStars(count = 1) {
        console.log(`⭐ Spawning ${count} star(s)...`);

        const minDistance = 4000; // Minimum distance from center (player spawn)
        const maxDistance = 10000; // Maximum distance from center

        for (let i = 0; i < count; i++) {
            // Random position far from center
            const angle = Math.random() * Math.PI * 2;
            const distance = minDistance + Math.random() * (maxDistance - minDistance);
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            const star = new Star(x, y);
            this.entities.push(star);
        }

        console.log(`✅ Spawned ${count} star(s)`);
    }

    /**
     * Spawn black holes for mission environment
     * @param {number} probability - Probability of spawning (0.0 to 1.0, default: 0.5)
     * @param {number} maxCount - Maximum black holes to spawn (default: 2)
     */
    spawnBlackHoles(probability = 0.5, maxCount = 2) {
        if (Math.random() > probability) {
            console.log('🕳️ No black holes spawned (random chance)');
            return;
        }

        const count = 1 + Math.floor(Math.random() * maxCount);
        console.log(`🕳️ Spawning ${count} black hole(s)...`);

        const minDistance = 5000; // Minimum distance from center
        const maxDistance = 12000; // Maximum distance from center

        for (let i = 0; i < count; i++) {
            // Random position very far from center
            const angle = Math.random() * Math.PI * 2;
            const distance = minDistance + Math.random() * (maxDistance - minDistance);
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            const blackHole = new BlackHole(x, y);
            this.entities.push(blackHole);
        }

        console.log(`✅ Spawned ${count} black hole(s)`);
    }

    /**
     * Spawn nebula regions for mission environment
     * @param {number} count - Number of nebula regions (default: 1-3)
     */
    spawnNebulas(count = null) {
        if (count === null) {
            count = 1 + Math.floor(Math.random() * 3); // 1-3 nebulas
        }

        console.log(`☁️ Spawning ${count} nebula region(s)...`);

        const nebulaColors = [
            '#FF00FF', // Magenta
            '#FF0088', // Pink
            '#8800FF', // Purple
            '#00FF88', // Cyan-green
            '#FF8800'  // Orange
        ];

        const minDistance = 2000; // Can be closer than other hazards
        const maxDistance = 8000;

        for (let i = 0; i < count; i++) {
            // Random position
            const angle = Math.random() * Math.PI * 2;
            const distance = minDistance + Math.random() * (maxDistance - minDistance);
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            // Large circular regions
            const radiusVariation = 0.8 + Math.random() * 0.8; // 0.8x to 1.6x
            const radius = CONFIG.NEBULA_RADIUS * radiusVariation;

            const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];

            const nebula = new Nebula(x, y, { radius: radius, color: color });
            this.entities.push(nebula);
        }

        console.log(`✅ Spawned ${count} nebula region(s)`);
    }

    /**
     * Apply environmental effects (gravity, damage, etc.) from planets, stars, black holes
     * @param {number} deltaTime - Time since last frame in seconds
     */
    applyEnvironmentalEffects(deltaTime) {
        // SAFETY: Skip if deltaTime is invalid
        if (!deltaTime || isNaN(deltaTime) || deltaTime <= 0 || deltaTime > 1) {
            return;
        }

        // Separate entities by type for efficient processing
        const planets = [];
        const stars = [];
        const blackHoles = [];
        const nebulas = [];
        const ships = [];

        for (const entity of this.entities) {
            if (!entity.active) continue;

            // SAFETY: Skip entities with invalid positions
            if (isNaN(entity.x) || isNaN(entity.y)) {
                console.error(`Entity ${entity.type} has invalid position, skipping:`, entity);
                continue;
            }

            switch (entity.type) {
                case 'planet':
                    planets.push(entity);
                    break;
                case 'star':
                    stars.push(entity);
                    break;
                case 'blackhole':
                    blackHoles.push(entity);
                    break;
                case 'nebula':
                    nebulas.push(entity);
                    break;
                case 'ship':
                    ships.push(entity);
                    break;
            }
        }

        // Apply planet gravity and check landing
        for (const planet of planets) {
            for (const ship of ships) {
                // SAFETY: Verify positions are valid before calculating gravity
                if (isNaN(planet.x) || isNaN(planet.y) || isNaN(ship.x) || isNaN(ship.y)) {
                    console.error('Invalid positions in planet gravity:', {planet: {x: planet.x, y: planet.y}, ship: {x: ship.x, y: ship.y}});
                    continue;
                }

                // Apply gravity
                const gravity = planet.applyGravity(ship);

                // SAFETY: Verify gravity values are valid
                if (isNaN(gravity.x) || isNaN(gravity.y)) {
                    console.error('Gravity calculation produced NaN:', {planet: {x: planet.x, y: planet.y}, ship: {x: ship.x, y: ship.y}, gravity});
                    continue;
                }

                if (gravity.x !== 0 || gravity.y !== 0) {
                    ship.vx += gravity.x * deltaTime;
                    ship.vy += gravity.y * deltaTime;

                    // SAFETY: Verify velocities are still valid after gravity
                    if (isNaN(ship.vx) || isNaN(ship.vy)) {
                        console.error('Ship velocity became NaN after gravity!', {vx: ship.vx, vy: ship.vy});
                        ship.vx = 0;
                        ship.vy = 0;
                    }

                    if (ship.physicsComponent) {
                        ship.physicsComponent.setVelocity(ship.vx, ship.vy);
                    }
                }

                // Check landing/collision
                const landingResult = planet.checkLanding(ship);
                if (landingResult === 'landed' && ship.isPlayer) {
                    // Player successfully landed - mission complete or disengagement
                    this.hud.addCriticalMessage('LANDED ON PLANET - MISSION DISENGAGED');
                } else if (landingResult === 'bounced') {
                    // Ship bounced off planet surface
                    if (ship.isPlayer) {
                        this.hud.addCriticalMessage(`PLANET COLLISION! -${CONFIG.PLANET_BOUNCE_DAMAGE} HP`);
                    }
                }
            }
        }

        // Apply star gravity and proximity damage
        for (const star of stars) {
            for (const ship of ships) {
                // Apply gravity (stronger than planets)
                const gravity = star.applyGravity(ship);
                if (gravity.x !== 0 || gravity.y !== 0) {
                    ship.vx += gravity.x * deltaTime;
                    ship.vy += gravity.y * deltaTime;
                    if (ship.physicsComponent) {
                        ship.physicsComponent.setVelocity(ship.vx, ship.vy);
                    }
                }

                // Apply heat damage if close
                const damage = star.applyProximityDamage(ship, deltaTime);
                if (damage > 0 && ship.isPlayer) {
                    this.hud.addCriticalMessage(`STAR HEAT DAMAGE! -${Math.round(damage)} HP`);
                }
            }
        }

        // Apply black hole gravity and check event horizon
        for (const blackHole of blackHoles) {
            for (const entity of this.entities) {
                if (!entity.active) continue;

                // Apply extreme gravity to all entities
                const gravity = blackHole.applyGravity(entity);
                if (gravity.x !== 0 || gravity.y !== 0) {
                    if (entity.type === 'ship' || entity.type === 'projectile') {
                        entity.vx += gravity.x * deltaTime;
                        entity.vy += gravity.y * deltaTime;
                        if (entity.physicsComponent) {
                            entity.physicsComponent.setVelocity(entity.vx, entity.vy);
                        }
                    }
                }

                // Check event horizon (instant death)
                const dx = blackHole.x - entity.x;
                const dy = blackHole.y - entity.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < blackHole.eventHorizon) {
                    entity.active = false;
                    if (entity.type === 'ship') {
                        if (entity.isPlayer) {
                            this.hud.addCriticalMessage('CROSSED EVENT HORIZON - SHIP DESTROYED');
                            // Trigger game over
                            setTimeout(() => {
                                this.stateManager.setState('game-over');
                            }, 2000);
                        } else {
                            console.log(`${entity.name || 'Ship'} destroyed by black hole`);
                        }
                    }
                }
            }
        }

        // Check nebula effects on ships
        for (const ship of ships) {
            ship.inNebula = false;

            for (const nebula of nebulas) {
                if (nebula.isInside(ship.x, ship.y)) {
                    ship.inNebula = true;
                    // Store nebula reference for weapon accuracy penalty
                    ship.currentNebula = nebula;
                    break;
                }
            }

            // Clear nebula reference if not inside any
            if (!ship.inNebula) {
                ship.currentNebula = null;
            }
        }
    }

    spawnTestEnemies() {
        // Spawn test enemy ships
        const enemyConfigs = [
            { x: -400, y: -300, shipClass: 'CL', faction: 'TRIGON', name: 'IKS Kahless' },
            { x: 500, y: 400, shipClass: 'CA', faction: 'SCINTILIAN', name: 'IRW Valdore' },
            { x: -600, y: 500, shipClass: 'FG', faction: 'PIRATE', name: 'ITS Raider' }
        ];

        for (const config of enemyConfigs) {
            const enemyShip = new Ship({
                x: config.x,
                y: config.y,
                shipClass: config.shipClass,
                faction: config.faction,
                name: config.name,
                isPlayer: false,
                physicsWorld: this.physicsWorld
            });

            // Create AI controller for enemy ship
            enemyShip.aiController = new AIController(enemyShip);

            this.entities.push(enemyShip);
            this.enemyShips.push(enemyShip);
        }
    }

    spawnTestEnvironment() {
        // Spawn a collapsar (black hole)
        const collapsar = new EnvironmentalHazard(600, -400, 'collapsar', { radius: 30 });
        this.entities.push(collapsar);
        this.environmentalHazards.push(collapsar);

        // Spawn a dust cloud
        const dustCloud = new EnvironmentalHazard(-500, 300, 'dust', { radius: 120 });
        this.entities.push(dustCloud);
        this.environmentalHazards.push(dustCloud);

        // Spawn a planet
        const planet = new EnvironmentalHazard(800, 600, 'planet', { radius: 180, color: '#4488cc' });
        this.entities.push(planet);
        this.environmentalHazards.push(planet);
    }

    update(deltaTime) {
        if (!this.stateManager.isPlaying()) return;

        // Watchdog: detect infinite loops
        this.updateCounter++;
        const updateStartTime = Date.now();
        const timeSinceLastUpdate = updateStartTime - this.lastUpdateTime;

        if (timeSinceLastUpdate > 100) { // Log if update takes > 100ms
            console.warn(`⚠️ Slow update detected! Counter: ${this.updateCounter}, Time: ${timeSinceLastUpdate}ms`);
        }

        // MINIMAL MODE - skip almost everything
        if (CONFIG.MINIMAL_MODE) {
            // Only update camera and basic player movement
            if (this.playerShip) {
                this.camera.follow(this.playerShip.x, this.playerShip.y);
                this.handlePlayerInput(deltaTime);
                this.playerShip.update(deltaTime);
            }

            this.lastUpdateTime = Date.now();
            const totalTime = this.lastUpdateTime - updateStartTime;
            if (this.updateCounter % 60 === 0) {
                console.log(`⚡ MINIMAL MODE UPDATE: ${totalTime}ms`);
            }
            return;
        }

        // Performance profiling markers
        const perf = {
            start: updateStartTime,
            camera: 0,
            input: 0,
            advancedSystems: 0,
            targeting: 0,
            beamFiring: 0,
            entities: 0,
            trails: 0,
            ai: 0,
            mission: 0,
            collisions: 0,
            physics: 0,
            particles: 0,
            hud: 0
        };

        try {
            // Update camera to follow player
            if (this.playerShip) {
                this.camera.follow(this.playerShip.x, this.playerShip.y);
            }
            perf.camera = Date.now() - perf.start;
        } catch (error) {
            console.error('Error in camera update:', error);
        }

        // Handle input for player ship
        const inputStart = Date.now();
        if (this.playerShip && !this.warpingOut) {
            this.handlePlayerInput(deltaTime);
        }
        perf.input = Date.now() - inputStart;
        perf.advancedSystems = this.lastAdvancedSystemsTime || 0;

        // Update warp sequence
        this.updateWarpSequence(deltaTime);

        // Update targeting system (disable during warp)
        if (!this.warpingOut) {
            const mousePos = this.inputManager.getMousePosition();
            this.targetingSystem.update(mousePos.x, mousePos.y, this.entities, this.camera, deltaTime);
        }
        perf.targeting = Date.now() - perf.start - perf.input;

        // Update ping system
        if (this.pingSystem) {
            this.pingSystem.update(deltaTime);
        }

        // Handle continuous beam firing
        const beamStart = Date.now();
        if (this.beamFiring && this.playerShip && !this.warpingOut) {
            const mousePos = this.inputManager.getMousePosition();
            const worldPos = this.camera.screenToWorld(mousePos.x, mousePos.y);
            const currentTime = performance.now() / 1000;

            // Drain energy while firing beams
            if (this.playerShip.energy) {
                const energyDrainRate = 8; // Energy per second per beam weapon
                const activeBeams = this.playerShip.weapons.filter(w => 
                    w instanceof ContinuousBeam && w.isFiring
                ).length;
                const totalDrain = energyDrainRate * activeBeams * deltaTime;
                this.playerShip.energy.drainEnergy(totalDrain);
                
                // Stop firing if out of energy
                if (this.playerShip.energy.getTotalEnergy() <= 0) {
                    this.beamFiring = false;
                    // Stop all beam weapons
                    for (const weapon of this.playerShip.weapons) {
                        if (weapon instanceof ContinuousBeam) {
                            weapon.stopFiring(currentTime);
                        }
                    }
                }
            }

            const projectiles = this.playerShip.fireContinuousBeams(worldPos.x, worldPos.y, currentTime);
            
            // Check if any beams are actually firing (projectiles created)
            const anyBeamsFiring = projectiles && projectiles.length > 0;
            
            // Manage sound based on whether beams are actually firing
            const isSoundPlaying = this.audioManager.isLoopingSound('fed-beam');
            
            if (anyBeamsFiring && !isSoundPlaying) {
                // Beams started firing - start sound
                this.audioManager.startLoopingSound('fed-beam', { volume: 0.5 });
            } else if (!anyBeamsFiring && isSoundPlaying) {
                // Beams stopped firing (reticle outside arc) - stop sound
                this.audioManager.stopLoopingSound('fed-beam');
            }
            
            if (projectiles && projectiles.length > 0) {
                this.projectiles.push(...projectiles);
                this.entities.push(...projectiles);
            }
        }
        perf.beamFiring = Date.now() - beamStart;

        // Handle streak beam second shots (for player and AI)
        for (const entity of this.entities) {
            if (entity.type === 'ship' && entity.active && entity.weapons) {
                const currentTime = performance.now() / 1000;

                for (const weapon of entity.weapons) {
                    if (weapon instanceof StreakBeam) {
                        const secondShot = weapon.getNextStreakShot(entity, currentTime);
                        if (secondShot) {
                            this.projectiles.push(secondShot);
                            this.entities.push(secondShot);
                            if (entity.isPlayer) {
                                this.audioManager.playSound('streak-beam');
                            }
                        }
                    }
                }
            }
        }

        // Handle disruptor burst shots (for player and AI)
        for (const entity of this.entities) {
            if (entity.type === 'ship' && entity.active) {
                // Get target (player targets mouse, AI targets their current target)
                let targetX, targetY;
                if (entity.isPlayer) {
                    const mousePos = this.inputManager.getMousePosition();
                    const worldPos = this.camera.screenToWorld(mousePos.x, mousePos.y);
                    targetX = worldPos.x;
                    targetY = worldPos.y;
                } else if (entity.target) {
                    targetX = entity.target.x;
                    targetY = entity.target.y;
                } else {
                    continue; // No target, skip
                }

                const burstShots = entity.getDisruptorBurstShots(targetX, targetY);
                if (burstShots && burstShots.length > 0) {
                    this.projectiles.push(...burstShots);
                    this.entities.push(...burstShots);
                    if (entity.isPlayer) {
                        // Play disruptor sound 3 times rapidly
                        this.audioManager.playSound('disruptor-fire');
                        setTimeout(() => this.audioManager.playSound('disruptor-fire'), 50);
                        setTimeout(() => this.audioManager.playSound('disruptor-fire'), 100);
                    }
                }
            }
        }

        // Handle plasma charge accumulation
        if (this.torpedoCharging && this.playerShip && !this.warpingOut) {
            const currentTime = performance.now() / 1000;
            const chargeTime = currentTime - this.plasmaChargeStart;

            // Get charge rate based on ship class
            let chargeRate = CONFIG.PLASMA_CHARGE_RATE_CA; // Default
            if (this.playerShip.shipClass === 'DD') chargeRate = CONFIG.PLASMA_CHARGE_RATE_DD || CONFIG.PLASMA_CHARGE_RATE_CL;
            else if (this.playerShip.shipClass === 'CL') chargeRate = CONFIG.PLASMA_CHARGE_RATE_CL;
            else if (this.playerShip.shipClass === 'BB') chargeRate = CONFIG.PLASMA_CHARGE_RATE_BC;

            // Calculate damage: damage/second * time, max 5 seconds
            const cappedTime = Math.min(chargeTime, CONFIG.PLASMA_MAX_CHARGE_TIME);
            this.plasmaChargeDamage = chargeRate * cappedTime;
        }

        // Update all entities
        const entitiesStart = Date.now();
        try {
            for (const entity of this.entities) {
                if (entity.update) {
                    // Pass entities array to entities that need it (like space stations for targeting)
                    // Most entities ignore the extra parameter
                    entity.update(deltaTime, this.entities);
                }
            }
        } catch (error) {
            console.error('Error updating entities:', error);
            // Note: entity variable is not accessible in catch block scope
        }
        perf.entities = Date.now() - entitiesStart;

        // Create engine trails for moving ships (throttled for performance)
        const trailsStart = Date.now();
        this.trailFrameCounter++;
        if (this.trailFrameCounter >= 5) { // Only create trails every 5th frame for better performance
            this.trailFrameCounter = 0;
            for (const entity of this.entities) {
                if (entity.type === 'ship' && entity.active) {
                    const speed = MathUtils.magnitude(entity.vx || 0, entity.vy || 0);
                    if (speed > 30) { // Only create trails when moving above threshold
                        const trailIntensity = Math.min(speed / 100, 1.0);
                        // Calculate trail position at rear of ship
                        const shipSize = entity.getShipSize ? entity.getShipSize() : 40;
                        const rearOffset = shipSize * 0.6;
                        const rearAngle = entity.rotation + Math.PI;
                        const trailX = entity.x + Math.cos(rearAngle) * rearOffset;
                        const trailY = entity.y + Math.sin(rearAngle) * rearOffset;

                        // Faction-specific trail colors
                        let trailColor = '#4488ff'; // Default blue
                        if (entity.faction === 'TRIGON') trailColor = '#ff4444';
                        if (entity.faction === 'SCINTILIAN') trailColor = '#00ff88';
                        if (entity.faction === 'PIRATE') trailColor = '#ff8800';

                        this.particleSystem.createEngineTrail(trailX, trailY, rearAngle, {
                            color: trailColor,
                            size: 1.2, // Increased from 0.8 for brighter exhaust
                            intensity: Math.min(trailIntensity * 1.5, 1.0) // Increased intensity for brighter exhaust
                        });
                    }
                }
            }
        }
        perf.trails = Date.now() - trailsStart;

        // Apply environmental hazards (gravity, damage, etc.)
        // TEMPORARILY DISABLED TO FIX NaN BUG
        // const environmentStart = Date.now();
        // this.applyEnvironmentalEffects(deltaTime);
        // perf.environment = Date.now() - environmentStart;

        // Update AI controllers
        const aiStart = Date.now();
        if (!CONFIG.DISABLE_AI) {
            try {
                const currentTime = performance.now() / 1000;
                for (const enemyShip of this.enemyShips) {
                    if (enemyShip.aiController && enemyShip.active) {
                        enemyShip.aiController.update(deltaTime, currentTime, this.playerShip, this.entities);
                    }
                }
            } catch (error) {
                console.error('Error in AI controller update:', error);
            }
        }
        perf.ai = Date.now() - aiStart;

        // Update mission system
        const missionStart = Date.now();
        if (this.missionManager.missionActive) {
            const gameState = {
                playerShip: this.playerShip,
                entities: this.entities,
                enemiesDestroyed: this.missionManager.enemiesDestroyed
            };
            this.missionManager.update(deltaTime, gameState);
        }
        perf.mission = Date.now() - missionStart;

        // Handle projectile collisions
        const collisionsStart = Date.now();
        if (!CONFIG.DISABLE_COLLISIONS) {
            try {
                this.handleProjectileCollisions();
            } catch (error) {
                console.error('Error in projectile collisions:', error);
            }

            // Handle decoy confusion
            try {
                this.handleDecoyConfusion();
            } catch (error) {
                console.error('Error in decoy confusion:', error);
            }

            // Handle mine triggers
            try {
                this.handleMineTriggers();
            } catch (error) {
                console.error('Error in mine triggers:', error);
            }
        }
        perf.collisions = Date.now() - collisionsStart;

        // Apply gravity from collapsars
        const physicsStart = Date.now();
        if (!CONFIG.DISABLE_PHYSICS) {
            for (const hazard of this.environmentalHazards) {
                if (hazard.type === 'collapsar' && hazard.applyGravity) {
                    hazard.applyGravity(this.entities, deltaTime);
                }
            }

            // Step physics simulation
            this.physicsWorld.step(deltaTime);

            // Handle asteroid breaking
            this.handleAsteroidBreaking();
        } else {
            // Simple ship collision detection (when physics disabled)
            this.handleSimpleShipCollisions();
        }

        // Remove destroyed entities (measure cleanup separately)
        const cleanupStart = Date.now();
        this.cleanupEntities();
        const cleanupTime = Date.now() - cleanupStart;
        perf.physics = Date.now() - physicsStart - cleanupTime; // Subtract cleanup time

        // Update particle system
        const particlesStart = Date.now();
        if (!CONFIG.DISABLE_PARTICLES) {
            this.particleSystem.update(deltaTime);
        }
        perf.particles = Date.now() - particlesStart;

        // Update HUD (start measurement)
        const hudStart = Date.now();
        this.hud.update(this.playerShip, this.entities, this.selectedTarget);

        // Update mission objectives in HUD
        if (this.missionManager.missionActive) {
            this.hud.updateObjectives(this.missionManager.objectives);
        } else {
            this.hud.hideObjectives();
        }

        // Update tooltip for hovered ship
        const mousePos = this.inputManager.getMousePosition();
        const worldPos = this.camera.screenToWorld(mousePos.x, mousePos.y);
        const hoveredShip = this.findShipAtPosition(worldPos.x, worldPos.y);
        this.hud.updateTooltip(mousePos.x, mousePos.y, hoveredShip);
        perf.hud = Date.now() - hudStart;

        // Clear single-press key detection for next frame
        this.inputManager.clearPressedKeys();

        // Log performance breakdown every 60 frames if slow
        this.lastUpdateTime = Date.now();
        const totalTime = this.lastUpdateTime - updateStartTime;

        if (this.updateCounter % 60 === 0) {
            // Show top 5 slowest systems
            const perfEntries = [
                ['camera', perf.camera],
                ['input', perf.input],
                ['advSys', perf.advancedSystems],
                ['target', perf.targeting],
                ['beam', perf.beamFiring],
                ['entities', perf.entities],
                ['trails', perf.trails],
                ['ai', perf.ai],
                ['mission', perf.mission],
                ['collisions', perf.collisions],
                ['physics', perf.physics],
                ['particles', perf.particles],
                ['hud', perf.hud]
            ].sort((a, b) => b[1] - a[1]);

            console.log(`🐌 TOTAL: ${totalTime}ms | TOP 5: ${perfEntries.slice(0, 5).map(([name, time]) => `${name}:${time}ms`).join(', ')}`);

            // Calculate unaccounted time
            const accountedTime = perf.camera + perf.input + perf.advancedSystems + perf.targeting + perf.beamFiring +
                                 perf.entities + perf.trails + perf.ai + perf.mission +
                                 perf.collisions + perf.physics + perf.particles + perf.hud;
            const unaccounted = totalTime - accountedTime;
            if (unaccounted > 50) {
                console.warn(`⚠️ UNACCOUNTED TIME: ${unaccounted}ms`);
            }
        }
    }

    handleProjectileCollisions() {
        const currentTime = performance.now() / 1000;

        for (const projectile of this.projectiles) {
            if (!projectile.active) continue;

            // Check collision with ships and asteroids
            for (const entity of this.entities) {
                if (!entity.active) continue;
                if (entity.type === 'projectile') continue; // Don't hit other projectiles
                if (projectile.hasHit(entity)) continue; // Already hit this entity

                // CRITICAL: Check source ship AFTER age check to see if we're hitting ourselves
                const projectileAge = currentTime - projectile.creationTime;
                const isSourceShip = (entity === projectile.sourceShip || entity.id === projectile.sourceShip?.id);

                if (isSourceShip) {
                    // Removed console.log for performance - was called every frame in collision loop
                    continue; // Don't hit source
                }

                // Short grace period to prevent spawn collision (50ms for beams, 250ms for torpedoes)
                const graceTime = (projectile.projectileType === 'beam') ? 0.05 : 0.25;
                if (projectileAge < graceTime) continue;

                // Check if projectile is close to entity
                const distance = MathUtils.distance(projectile.x, projectile.y, entity.x, entity.y);
                const hitRadius = entity.radius || entity.getShipSize?.() || 20;

                if (distance <= hitRadius) {
                    // Hit!
                    if (projectile.projectileType === 'beam' || projectile.projectileType === 'disruptor') {
                        // Beam/Disruptor hit - SYSTEM KILLERS (Shields → Single System → Hull overflow)
                        if (entity.type === 'ship' && entity.systems) {
                            // Convert to ship-local coordinates
                            const dx = projectile.x - entity.x;
                            const dy = projectile.y - entity.y;
                            const rad = MathUtils.toRadians(-entity.rotation);
                            const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
                            const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

                            // Shields absorb first (only if shields are active/up)
                            let remainingDamage = projectile.damage;
                            let shieldAbsorbed = false;
                            if (entity.shields && !entity.isCloaked() && entity.shields.active) {
                                const impactAngle = MathUtils.angleBetween(entity.x, entity.y, projectile.x, projectile.y);
                                const currentTime = performance.now() / 1000;
                                const beforeDamage = remainingDamage;
                                remainingDamage = entity.shields.applyDamage(entity.rotation, impactAngle, remainingDamage, currentTime);
                                shieldAbsorbed = (beforeDamage > remainingDamage);
                                
                                // Create shield flare effect when shield absorbs damage
                                if (shieldAbsorbed) {
                                    this.particleSystem.createShieldImpact(projectile.x, projectile.y, {
                                        color: entity.isPlayer ? '#00ffff' : '#ff6600'
                                    });
                                }
                            }

                            // Apply to single nearest system (overflow automatically goes to hull)
                            if (remainingDamage > 0) {
                                const systemDamage = entity.systems.applyDamageToNearestSystem(localX, localY, remainingDamage);
                                // Create debris burst effect when hull/system takes damage (unshielded hit)
                                if (!shieldAbsorbed) {
                                    this.particleSystem.createDebrisBurst(projectile.x, projectile.y, {
                                        particleCount: 15,
                                        color: '#ff9900'
                                    });
                                }

                                // Emit system damage event for player
                                if (entity.isPlayer && systemDamage.system) {
                                    eventBus.emit('system-damage', {
                                        system: systemDamage.system.name,
                                        damage: systemDamage.damage,
                                        hp: systemDamage.system.hp,
                                        maxHp: systemDamage.system.maxHp
                                    });
                                }
                            }

                            // Check if hull destroyed
                            if (entity.systems.hull.destroyed) {
                                entity.destroy();
                            }
                        } else {
                            // Not a ship - normal damage
                            if (entity.takeDamage) {
                                entity.takeDamage(projectile.damage, { x: projectile.x, y: projectile.y });
                            }
                        }

                        // Impact effect
                        const impactAngle = Math.atan2(projectile.vy, projectile.vx);
                        const color = projectile.projectileType === 'beam' ? '#00aaff' : '#ff00ff';
                        this.particleSystem.createImpact(projectile.x, projectile.y, impactAngle, {
                            color: color,
                            size: 0.8
                        });
                        this.audioManager.playSound('beam-hit');
                        projectile.destroy();
                    } else if (projectile.projectileType === 'torpedo') {
                        // Torpedo hit - HULL KILLERS (75% Hull/Shields + 25% Systems)
                        const impactAngle = MathUtils.angleBetween(entity.x, entity.y, projectile.x, projectile.y);

                        if (entity.type === 'ship' && entity.systems) {
                            // Convert contact point to ship-relative coordinates
                            const dx = projectile.x - entity.x;
                            const dy = projectile.y - entity.y;
                            const rad = MathUtils.toRadians(-entity.rotation);
                            const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
                            const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

                            // Shields absorb first
                            let remainingDamage = projectile.damage;
                            if (entity.shields && !entity.isCloaked()) {
                                const currentTime = performance.now() / 1000;
                                remainingDamage = entity.shields.applyDamage(entity.rotation, impactAngle, remainingDamage, currentTime);
                            }

                            // Apply to 2-3 systems (overflow automatically goes to hull)
                            if (remainingDamage > 0) {
                                const damagedSystems = entity.systems.applyTorpedoToMultipleSystems(localX, localY, remainingDamage);
                                entity.damageFlashAlpha = 0.8;

                                // Emit system damage events for player
                                if (entity.isPlayer) {
                                    for (const damageInfo of damagedSystems) {
                                        eventBus.emit('system-damage', {
                                            system: damageInfo.system.name,
                                            damage: damageInfo.damage,
                                            hp: damageInfo.system.hp,
                                            maxHp: damageInfo.system.maxHp
                                        });
                                    }
                                }
                            }

                            // Check if hull destroyed
                            if (entity.systems.hull.destroyed) {
                                entity.destroy();
                            }
                        } else {
                            // Not a ship or no systems - normal damage
                            if (entity.takeDamage) {
                                entity.takeDamage(projectile.damage, { x: projectile.x, y: projectile.y });
                            }
                        }

                        // Torpedo explosion
                        this.particleSystem.createExplosion(projectile.x, projectile.y, {
                            particleCount: 25,
                            size: 1.0,
                            color: '#ff6600',
                            speed: 120
                        });
                        this.audioManager.playSound('torpedo-explosion');

                        // Break asteroid if hit
                        if (entity.type === 'asteroid') {
                            entity.shouldBreak = true;
                            entity.breakPosition = { x: entity.x, y: entity.y };
                        }

                        projectile.destroy();
                    } else if (projectile.projectileType === 'plasma') {
                        // Plasma torpedo hit - apply full DP to shields, then blast to hull
                        if (entity.takeDamage) {
                            // Apply full DP as direct damage (shields absorb first)
                            entity.takeDamage(projectile.damagePotential, { x: projectile.x, y: projectile.y });
                        }

                        // Large plasma explosion
                        this.particleSystem.createExplosion(projectile.x, projectile.y, {
                            particleCount: 40,
                            size: 1.5,
                            color: '#00ff88',
                            speed: 150
                        });
                        this.audioManager.playSound('plasma-explosion');

                        // Apply blast damage to all entities in radius
                        const entitiesInBlast = projectile.getEntitiesInBlast(this.entities, entity);
                        for (const blastEntity of entitiesInBlast) {
                            if (blastEntity !== entity && blastEntity.takeDamage) {
                                // Blast damage applies to hull (bypasses shields)
                                const blastDamage = projectile.damagePotential * 0.5; // 50% to blast area
                                blastEntity.takeDamage(blastDamage, { x: projectile.x, y: projectile.y });
                            }
                        }

                        // Break asteroid if hit
                        if (entity.type === 'asteroid') {
                            entity.shouldBreak = true;
                            entity.breakPosition = { x: entity.x, y: entity.y };
                        }

                        projectile.destroy();
                    }

                    projectile.markAsHit(entity);
                }
            }
        }
    }

    handleDecoyConfusion() {
        const decoys = this.entities.filter(e => e.active && e.type === 'decoy');
        const torpedoes = this.projectiles.filter(p => p.active && p.projectileType === 'torpedo');

        for (const decoy of decoys) {
            for (const torpedo of torpedoes) {
                if (decoy.tryConfuseTorpedo(torpedo)) {
                    // Torpedo confused
                    eventBus.emit('torpedo-confused', { torpedo, decoy });
                }
            }
        }
    }

    handleMineTriggers() {
        const mines = this.entities.filter(e => e.active && e.type === 'mine');

        for (const mine of mines) {
            for (const entity of this.entities) {
                if (!entity.active) continue;
                if (entity.type !== 'ship') continue;

                if (mine.checkTrigger(entity)) {
                    mine.detonate(entity);
                }
            }
        }
    }

    handleSimpleShipCollisions() {
        // Simple distance-based ship collision (no physics engine needed)
        const ships = this.entities.filter(e => e.active && e.type === 'ship');
        const MIN_COLLISION_SPEED = 25; // Same as CollisionHandler

        for (let i = 0; i < ships.length; i++) {
            for (let j = i + 1; j < ships.length; j++) {
                const ship1 = ships[i];
                const ship2 = ships[j];

                // Calculate distance
                const dx = ship2.x - ship1.x;
                const dy = ship2.y - ship1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Calculate collision radii
                const radius1 = ship1.getShipSize ? ship1.getShipSize() * 0.5 : 20;
                const radius2 = ship2.getShipSize ? ship2.getShipSize() * 0.5 : 20;
                const collisionDistance = radius1 + radius2;

                // Check collision
                if (distance < collisionDistance && distance > 0) {
                    // Calculate relative velocity
                    const vx1 = ship1.vx || 0;
                    const vy1 = ship1.vy || 0;
                    const vx2 = ship2.vx || 0;
                    const vy2 = ship2.vy || 0;
                    const relativeSpeed = Math.sqrt((vx2 - vx1) ** 2 + (vy2 - vy1) ** 2);

                    // Only apply collision if ships are moving fast enough
                    if (relativeSpeed >= MIN_COLLISION_SPEED) {
                        // Calculate damage (1-10 HP based on speed)
                        const damage = Math.max(1, Math.floor(relativeSpeed / 50));

                        // Apply damage to both ships
                        if (ship1.systems?.hull) {
                            ship1.systems.hull.hp -= damage;
                            if (ship1.systems.hull.hp <= 0) {
                                ship1.systems.hull.destroyed = true;
                                ship1.destroy();
                            }
                        }
                        if (ship2.systems?.hull) {
                            ship2.systems.hull.hp -= damage;
                            if (ship2.systems.hull.hp <= 0) {
                                ship2.systems.hull.destroyed = true;
                                ship2.destroy();
                            }
                        }

                        // Simple bounce - push ships apart
                        const nx = dx / distance; // Normalized collision normal
                        const ny = dy / distance;
                        const pushDistance = (collisionDistance - distance) * 0.5;

                        ship1.x -= nx * pushDistance;
                        ship1.y -= ny * pushDistance;
                        ship2.x += nx * pushDistance;
                        ship2.y += ny * pushDistance;

                        // Reverse velocity components along collision normal
                        const bounceStrength = 0.5; // 50% bounce
                        const relativeVelocity = (vx2 - vx1) * nx + (vy2 - vy1) * ny;

                        if (ship1.vx !== undefined) {
                            ship1.vx += nx * relativeVelocity * bounceStrength;
                            ship1.vy += ny * relativeVelocity * bounceStrength;
                        }
                        if (ship2.vx !== undefined) {
                            ship2.vx -= nx * relativeVelocity * bounceStrength;
                            ship2.vy -= ny * relativeVelocity * bounceStrength;
                        }
                    }
                }
            }
        }
    }

    handleAsteroidBreaking() {
        const newAsteroids = [];

        for (const entity of this.entities) {
            if (entity.type === 'asteroid' && entity.shouldBreak) {
                const fragments = entity.break();
                newAsteroids.push(...fragments);
            }
        }

        // Add new asteroid fragments
        this.entities.push(...newAsteroids);
    }

    cleanupEntities() {
        // Clear selectedTarget if it becomes inactive
        if (this.selectedTarget && !this.selectedTarget.active) {
            this.selectedTarget = null;
        }

        this.entities = this.entities.filter(e => e.active);
        this.enemyShips = this.enemyShips.filter(e => e.active);
        this.environmentalHazards = this.environmentalHazards.filter(e => e.active);
        this.projectiles = this.projectiles.filter(p => p.active);
    }

    handlePlayerInput(deltaTime) {
        const ship = this.playerShip;

        // Movement (A/D for turning)
        // NOTE: W/S throttle adjustment now handled in keydown event listener (setupEventListeners)
        // Ship maintains speed automatically via updateThrottle() in Ship.update()
        const aPressed = this.inputManager.isKeyDown('a');
        const dPressed = this.inputManager.isKeyDown('d');

        if (aPressed) {
            ship.turn(-1, deltaTime);
        } else if (dPressed) {
            ship.turn(1, deltaTime);
        } else {
            // Stop rotation when no turn input
            ship.stopRotation();
        }

        // Advanced systems input
        this.handleAdvancedInput(deltaTime);
    }

    handleAdvancedInput(deltaTime) {
        const advStart = Date.now();
        const currentTime = performance.now() / 1000;

        // Tractor Beam (Q key) - hold to pin target with fewer energy blocks
        if (this.inputManager.isKeyDown('q')) {
            if (this.playerShip && this.playerShip.tractorBeam) {
                if (!this.playerShip.tractorBeam.isActive) {
                    this.playerShip.tractorBeam.activate(this.entities, currentTime);
                }
            }
        } else {
            // Release Q key deactivates tractor beam
            if (this.playerShip && this.playerShip.tractorBeam && this.playerShip.tractorBeam.isActive) {
                this.playerShip.tractorBeam.deactivate();
            }
        }

        // Transporter (T key) - toggle mode
        if (this.inputManager.isKeyPressed('t')) {
            if (this.playerShip && this.playerShip.transporter) {
                this.playerShip.transporter.toggle();
            }
        }

        // Target Selection (TAB key) - handled by event listener in setupEventListeners()

        // Bay System (1-6 keys for shuttles, 7-8 for fighters/bombers)
        this.handleBaySystemInput(currentTime);

        // Update tractor beam and transporter systems
        if (this.playerShip && this.playerShip.tractorBeam) {
            this.playerShip.tractorBeam.update(deltaTime, this.entities, currentTime);
        }
        if (this.playerShip && this.playerShip.transporter) {
            this.playerShip.transporter.update(deltaTime, this.entities, currentTime);
        }

        // Update other advanced systems
        this.powerManagementSystem.update(deltaTime, currentTime, this.playerShip);
        this.baySystem.update(deltaTime, currentTime, this.entities);
        // Note: balanceSystem disabled for performance - enable if needed for balancing

        // Store advanced systems time in a property we can access
        this.lastAdvancedSystemsTime = Date.now() - advStart;
    }

    handleBaySystemInput(currentTime) {
        // Initialize bay mission state if needed (separate state per craft type)
        if (!this.bayMissionState) {
            this.bayMissionState = {
                shuttle: {}, // Keys 1-6 alone
                fighter: {}, // CTRL + 1-6
                bomber: {},  // ALT + 1-6
                drone: {}    // SHIFT + 1-6
            };

            // Initialize each craft type's mission states
            for (const craftType of ['shuttle', 'fighter', 'bomber', 'drone']) {
                for (let i = 1; i <= 6; i++) {
                    this.bayMissionState[craftType][i] = {
                        mission: null,
                        missionIndex: 0
                    };
                }
            }
        }

        // Mission types per craft (from Option A)
        const missionsByType = {
            shuttle: ['ATTACK', 'DEFENSE', 'WILD_WEASEL', 'SUICIDE', 'SCAN', 'TRANSPORT'],
            fighter: ['ATTACK', 'DEFENSE', 'SCAN'],
            bomber: ['ATTACK', 'DEFENSE', 'SUICIDE'],
            drone: ['ATTACK', 'DEFENSE', 'WILD_WEASEL']
        };

        // Handle Keys 1-6 with modifiers
        for (let i = 1; i <= 6; i++) {
            const keyStr = i.toString();

            if (!this.inputManager.isKeyPressed(keyStr)) continue;

            // Determine craft type based on modifiers
            let craftType = null;
            let launchMethod = null;
            let craftName = null;

            if (this.inputManager.isShiftDown()) {
                // SHIFT + key = Drone
                craftType = 'drone';
                launchMethod = 'launchDrone';
                craftName = 'Drone';
            } else if (this.inputManager.isCtrlDown()) {
                // CTRL + key = Fighter
                craftType = 'fighter';
                launchMethod = 'launchFighter';
                craftName = 'Fighter';
            } else if (this.inputManager.isAltDown()) {
                // ALT + key = Bomber
                craftType = 'bomber';
                launchMethod = 'launchBomber';
                craftName = 'Bomber';
            } else {
                // No modifier = Shuttle
                craftType = 'shuttle';
                launchMethod = 'launchShuttle';
                craftName = 'Shuttle';
            }

            const state = this.bayMissionState[craftType][i];
            const missions = missionsByType[craftType];

            if (!state.mission) {
                // First press: Cycle mission
                state.missionIndex = (state.missionIndex) % missions.length;
                state.mission = missions[state.missionIndex];
                state.missionIndex++; // Prepare next mission for next cycle
                console.log(`${craftName} ${i}: Mission set to ${state.mission} (press again to launch)`);
            } else {
                // Second press: Launch craft with assigned mission
                let craft = null;

                // Launch the appropriate craft type
                if (this.baySystem[launchMethod]) {
                    craft = this.baySystem[launchMethod](state.mission);
                } else {
                    console.warn(`Bay system method ${launchMethod} not found`);
                }

                if (craft) {
                    this.entities.push(craft);
                    console.log(`Launched ${craftName} with ${state.mission} mission from slot ${i}`);
                } else {
                    console.warn(`Failed to launch ${craftName} - check bay space`);
                }

                // Reset mission state after launch
                state.mission = null;
            }
        }

        // L key: Launch probe towards reticle
        if (this.inputManager.isKeyPressed('l')) {
            const mousePos = this.inputManager.getMousePosition();
            const worldPos = this.camera.screenToWorld(mousePos.x, mousePos.y);

            if (this.baySystem.launchProbe) {
                const probe = this.baySystem.launchProbe(worldPos.x, worldPos.y);
                if (probe) {
                    this.entities.push(probe);
                    console.log('Launched probe towards reticle');
                } else {
                    console.warn('Failed to launch probe - check bay space');
                }
            } else {
                console.warn('Probe launch not yet implemented');
            }
        }

        // P key: Activate ping
        if (this.inputManager.isKeyPressed('p')) {
            if (this.pingSystem.activate()) {
                console.log('Ping activated - sensor range doubled for 20 seconds');
            } else if (this.pingSystem.isCooldown) {
                const remaining = Math.ceil(this.pingSystem.cooldownTimeRemaining);
                console.log(`Ping on cooldown - ${remaining}s remaining`);
            }
        }
    }

    /**
     * Cycle through enemy targets within detection range (TAB key)
     */
    cycleTarget() {
        if (!this.playerShip) return;

        // Get detection radius for player's ship class (with ping multiplier if active)
        let detectionRadius = CONFIG.DETECTION_RADIUS_CA_PIXELS;
        const detectionKey = `DETECTION_RADIUS_${this.playerShip.shipClass}_PIXELS`;
        if (CONFIG[detectionKey] !== undefined) {
            detectionRadius = CONFIG[detectionKey];
        }

        // Apply ping system multiplier if active
        if (this.pingSystem && this.pingSystem.isActive) {
            detectionRadius *= this.pingSystem.sensorRangeMultiplier;
        }

        // Filter for enemy ships within detection range
        const enemyTargets = this.entities.filter(entity => {
            if (!entity || !entity.active || entity.type !== 'ship') return false;
            if (entity === this.playerShip || entity.isPlayer) return false;
            if (entity.faction === 'PLAYER') return false;

            // Check distance
            const dx = entity.x - this.playerShip.x;
            const dy = entity.y - this.playerShip.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            return dist <= detectionRadius;
        });

        // Sort by distance (closest first)
        enemyTargets.sort((a, b) => {
            const distA = Math.sqrt(
                (a.x - this.playerShip.x) ** 2 + (a.y - this.playerShip.y) ** 2
            );
            const distB = Math.sqrt(
                (b.x - this.playerShip.x) ** 2 + (b.y - this.playerShip.y) ** 2
            );
            return distA - distB;
        });

        if (enemyTargets.length === 0) {
            this.selectedTarget = null;
            console.log('No targets within detection range');
            return;
        }

        // Find current target index
        let currentIndex = -1;
        if (this.selectedTarget) {
            currentIndex = enemyTargets.indexOf(this.selectedTarget);
        }

        // Cycle to next target (wrap around)
        const nextIndex = (currentIndex + 1) % enemyTargets.length;
        this.selectedTarget = enemyTargets[nextIndex];

        // Log selected target
        const factionLabel = FACTION_DISPLAY_NAMES[this.selectedTarget.faction] || this.selectedTarget.faction;
        const classLabel = SHIP_CLASS_LABELS[this.selectedTarget.shipClass] || this.selectedTarget.shipClass;
        console.log(`Target selected: ${factionLabel} ${classLabel}`);
    }

    initiateWarp() {
        if (!this.playerShip || !this.playerShip.systems || !this.playerShip.systems.warp) return;

        // Check if warp is ready
        if (!this.playerShip.systems.warp.canWarp()) {
            console.log('Warp drive not fully charged');
            return;
        }

        // Start warp sequence
        this.warpingOut = true;
        this.warpSequenceTime = 0;
        this.playerShip.systems.warp.initiateWarp();

        console.log('Warp sequence initiated');
    }

    updateWarpSequence(deltaTime) {
        if (!this.warpingOut) return;

        this.warpSequenceTime += deltaTime;
        const progress = this.warpSequenceTime / this.warpSequenceDuration;

        if (this.playerShip) {
            // Accelerate ship upward (in screen space, this is negative Y in world space)
            const warpAcceleration = 500 * progress;
            this.playerShip.y -= warpAcceleration * deltaTime;
        }

        // End sequence after duration
        if (this.warpSequenceTime >= this.warpSequenceDuration) {
            this.completeWarpSequence();
        }
    }

    completeWarpSequence() {
        this.warpingOut = false;
        this.warpSequenceTime = 0;

        // Show debriefing/end scenario screen
        if (this.missionManager && this.missionManager.currentMission) {
            this.missionManager.completeMission(true); // Success
            this.missionUI.showDebriefing(this.missionManager.getMissionStats());
        }
    }

    render(deltaTime) {
        // Allow rendering when PLAYING or PAUSED
        // Also allow rendering when BRIEFING is closed but state hasn't updated yet
        const currentState = this.stateManager.getState();
        const briefingScreen = document.getElementById('briefing-screen');
        const briefingVisible = briefingScreen && !briefingScreen.classList.contains('hidden');
        
        if (!this.stateManager.isPlaying() && !this.stateManager.isPaused()) {
            // Don't render if briefing screen is visible
            if (briefingVisible || currentState === 'BRIEFING') {
                return; // Don't render game when briefing is open
            }
            return; // Don't render game when in menu
        }

        const renderStart = Date.now();

        // ALWAYS log config status on first few frames to verify it loaded
        if (this.updateCounter <= 5) {
            console.log(`🎨 RENDER START - Frame ${this.updateCounter}: MINIMAL_MODE=${CONFIG.MINIMAL_MODE}, PERFORMANCE_MODE=${CONFIG.PERFORMANCE_MODE}`);
        }

        try {
            if (CONFIG.MINIMAL_MODE) {
                // ULTRA MINIMAL RENDERING - just a green square
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                // Draw player as green square in center
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(this.canvas.width / 2 - 10, this.canvas.height / 2 - 10, 20, 20);

                // Info
                this.ctx.fillStyle = '#0f0';
                this.ctx.font = '16px Arial';
                this.ctx.fillText('MINIMAL MODE - Press WASD to move', 10, 20);
                this.ctx.fillText(`Player: (${Math.round(this.playerShip?.x || 0)}, ${Math.round(this.playerShip?.y || 0)})`, 10, 40);

                const renderTime = Date.now() - renderStart;
                if (this.updateCounter % 60 === 0) {
                    console.log(`⚡ MINIMAL MODE RENDER: ${renderTime}ms`);
                }
                return;
            }

            if (CONFIG.PERFORMANCE_MODE) {
                // PERFORMANCE MODE: Simple rendering
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                // Camera transform
                this.ctx.save();
                this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
                this.ctx.scale(this.camera.zoom, this.camera.zoom);
                this.ctx.translate(-this.camera.x, -this.camera.y);

                // Draw simple shapes for entities
                for (const entity of this.entities) {
                    if (!entity.active) continue;

                    this.ctx.save();
                    this.ctx.translate(entity.x, entity.y);
                    if (entity.rotation !== undefined) {
                        this.ctx.rotate(entity.rotation);
                    }

                    // Color by type/faction
                    if (entity.isPlayer) {
                        this.ctx.fillStyle = '#00ff00';
                    } else if (entity.type === 'ship') {
                        if (entity.faction === 'TRIGON') this.ctx.fillStyle = '#ff4444';
                        else if (entity.faction === 'SCINTILIAN') this.ctx.fillStyle = '#00ff88';
                        else if (entity.faction === 'PIRATE') this.ctx.fillStyle = '#ff8800';
                        else this.ctx.fillStyle = '#ff0000';
                    } else if (entity.type === 'projectile') {
                        this.ctx.fillStyle = '#ffff00';
                    } else {
                        this.ctx.fillStyle = '#888888';
                    }

                    // Draw simple triangle pointing forward
                    const size = entity.getShipSize ? entity.getShipSize() / 2 : 10;
                    this.ctx.beginPath();
                    this.ctx.moveTo(size, 0);
                    this.ctx.lineTo(-size, -size/2);
                    this.ctx.lineTo(-size, size/2);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.restore();
                }

                this.ctx.restore();

                // Performance info
                this.ctx.fillStyle = '#0f0';
                this.ctx.font = '16px Arial';
                this.ctx.fillText('PERFORMANCE MODE - Simple Graphics', 10, 20);
                this.ctx.fillText(`FPS: ${Math.round(1000 / (deltaTime * 1000))}`, 10, 40);
                this.ctx.fillText(`Entities: ${this.entities.length}`, 10, 60);

            } else {
                // FULL RENDERING MODE
                // Clear canvas
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                // Apply screen shake
                const shake = this.particleSystem.getScreenShake();
                this.ctx.save();
                this.ctx.translate(shake.x, shake.y);

                // Calculate warp progress
                const warpProgress = this.warpingOut ? (this.warpSequenceTime / this.warpSequenceDuration) : 0;

                // Render game world
                // Debug: Log entity count and player position on first few frames
                if (this.updateCounter <= 10) {
                    console.log(`🎨 Rendering Frame ${this.updateCounter}: ${this.entities.length} entities, Player: (${Math.round(this.playerShip?.x || 0)}, ${Math.round(this.playerShip?.y || 0)}), Camera: (${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}), State: ${this.stateManager.getState()}`);
                    if (this.entities.length > 0) {
                        console.log(`   Entities:`, this.entities.map(e => `${e.type}@(${Math.round(e.x)},${Math.round(e.y)})`).join(', '));
                    }
                }
                this.renderer.render(this.entities, warpProgress);

                // Render ping wave effect (if active)
                if (this.pingSystem) {
                    const pingWaveData = this.pingSystem.getPingWaveData();
                    if (pingWaveData) {
                        this.renderer.renderPingWave(pingWaveData);
                    }
                }

                // Render particle effects
                this.particleSystem.render(this.ctx, this.camera);

                this.ctx.restore();

                // Render waypoint arrows (after screen shake is removed)
                if (this.missionManager.missionActive && this.playerShip) {
                    this.renderer.uiRenderer.renderWaypointArrows(
                        this.playerShip,
                        this.missionManager.objectives,
                        this.camera,
                        this.ctx
                    );
                }

                // Debug info
                if (CONFIG.DEBUG_MODE) {
                    this.renderDebugInfo();
                }
            }
        } catch (error) {
            console.error('ERROR IN RENDER:', error);
            console.error('Stack:', error.stack);
            // Draw error on screen
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = '20px Arial';
            this.ctx.fillText('RENDER ERROR - Check console', 50, 50);
        }

        // Always log render time to diagnose
        const renderTime = Date.now() - renderStart;
        if (this.updateCounter % 60 === 0) {
            console.log(`🎨 RENDER TIME: ${renderTime}ms | PERFORMANCE_MODE: ${CONFIG.PERFORMANCE_MODE}`);
        }
    }

    renderDebugInfo() {
        this.ctx.save();
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`FPS: ${this.gameLoop.getFPS()}`, 10, 20);
        this.ctx.fillText(`Entities: ${this.entities.length}`, 10, 35);
        if (this.playerShip) {
            this.ctx.fillText(`Player: (${Math.round(this.playerShip.x)}, ${Math.round(this.playerShip.y)})`, 10, 50);
            this.ctx.fillText(`Rotation: ${Math.round(this.playerShip.rotation)}°`, 10, 65);
            this.ctx.fillText(`Velocity: ${Math.round(MathUtils.magnitude(this.playerShip.vx, this.playerShip.vy))}`, 10, 80);
            this.ctx.fillText(`Mode: ${this.playerShip.movementMode}`, 10, 95);
        }
        this.ctx.restore();
    }

    /**
     * Load mission and show briefing
     * @param {string} missionId - Mission ID (e.g., 'mission-01')
     */
    loadMission(missionId) {
        const mission = MISSIONS[missionId];
        if (!mission) {
            console.error(`Mission ${missionId} not found`);
            return;
        }

        // Show mission briefing with player ship for loadout bay capacity
        this.missionUI.showBriefing(mission, this.playerShip);
    }

    /**
     * Start mission after briefing accepted
     * @param {string} missionId - Mission ID (e.g., 'mission-01')
     */
    startMission(missionId) {
        console.log('🎯 Starting mission:', missionId);

        try {
            // Start mission in MissionManager
            console.log('📋 Starting mission in MissionManager...');
            const success = this.missionManager.startMission(missionId);
            if (!success) {
                console.error(`Failed to start mission ${missionId}`);
                alert('Mission failed to start - check console');
                return;
            }
            console.log('✅ Mission started in MissionManager');

            // Apply upgrades to player ship
            if (this.playerShip && this.progressionManager) {
                console.log('🔧 Applying upgrades to player ship...');
                this.progressionManager.applyUpgradesToShip(this.playerShip);
                console.log('✅ Upgrades applied');
            } else {
                console.warn('⚠️ No player ship or progression manager');
            }

            // Clear existing entities (except player)
            console.log('🧹 Clearing existing entities...');
            this.entities = this.entities.filter(e => e.isPlayer);
            this.enemyShips = [];
            this.environmentalHazards = [];
            this.projectiles = [];
            console.log(`✅ Entities cleared. Remaining: ${this.entities.length}`);

            // Spawn mission entities
            const mission = MISSIONS[missionId];
            console.log('📦 Mission data:', mission);

            if (mission.enemies) {
                console.log(`🎭 Spawning ${mission.enemies.length} enemies...`);
                this.spawnMissionEnemies(mission.enemies);
                console.log(`✅ Enemies spawned. Total: ${this.enemyShips.length}`);
            } else {
                console.log('ℹ️ No enemies in this mission');
            }

            if (mission.entities) {
                console.log(`🏭 Spawning ${mission.entities.length} mission entities...`);
                this.spawnMissionEntities(mission.entities);
                console.log('✅ Mission entities spawned');
            } else {
                console.log('ℹ️ No mission entities');
            }

            console.log(`📊 Total entities after spawn: ${this.entities.length}`);

            // Show objectives panel
            console.log('📋 Showing objectives...');
            this.hud.showObjectives();
            this.hud.addCriticalMessage(`Mission Started: ${mission.title}`);
            console.log('✅ Mission start complete!');

            // Ensure game state is PLAYING after mission starts
            this.stateManager.setState('PLAYING');

        } catch (error) {
            console.error('❌ CRITICAL ERROR in startMission:', error);
            console.error('Stack trace:', error.stack);
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });

            // Try to recover by showing an error message
            if (this.hud && this.hud.addCriticalMessage) {
                this.hud.addCriticalMessage(`Mission failed to load: ${error.message}`);
            }
            alert(`Mission loading failed: ${error.message}\n\nCheck console for details.`);

            // Return to main menu
            this.stateManager.setState('MAIN_MENU');
        }
    }

    /**
     * Spawn enemy ships for mission
     * @param {Array} enemyConfigs - Array of enemy configurations
     */
    spawnMissionEnemies(enemyConfigs) {
        for (let i = 0; i < enemyConfigs.length; i++) {
            const config = enemyConfigs[i];
            
            try {
                const enemyShip = ShipFactory.createShip({
                    x: config.position.x,
                    y: config.position.y,
                    shipClass: config.class,
                    faction: config.faction,
                    isPlayer: false,
                    physicsWorld: this.physicsWorld
                });

                // Set cloak state if specified
                if (config.cloaked && enemyShip.systems?.cloak) {
                    enemyShip.systems.cloak.activate();
                }

                // Create AI controller for enemy ship
                enemyShip.aiController = new AIController(enemyShip);

                this.entities.push(enemyShip);
                this.enemyShips.push(enemyShip);
            } catch (error) {
                console.error(`❌ Error creating enemy ship ${i + 1}:`, error);
                throw error; // Re-throw to stop the freeze
            }
        }
    }

    /**
     * Spawn mission entities (stations, transports, etc.)
     * @param {Array} entityConfigs - Array of entity configurations
     */
    spawnMissionEntities(entityConfigs) {
        for (let i = 0; i < entityConfigs.length; i++) {
            const config = entityConfigs[i];
            
            try {
                let entity = null;

                switch (config.type) {
                    case 'civilian-transport':
                        entity = new CivilianTransport({
                            id: config.id,
                            x: config.position.x,
                            y: config.position.y,
                            hp: config.hp,
                            name: config.name
                        });
                        break;

                    case 'space-station':
                        entity = new SpaceStation({
                            id: config.id,
                            x: config.position.x,
                            y: config.position.y,
                            hp: config.hp,
                            radius: config.radius,
                            faction: config.faction,
                            hostile: config.hostile,
                            name: config.name
                        });
                        break;

                    case 'derelict':
                        entity = new Derelict({
                            id: config.id,
                            x: config.position.x,
                            y: config.position.y,
                            hp: config.hp,
                            radius: config.radius,
                            name: config.name
                        });
                        break;

                    case 'asteroid':
                        entity = new Asteroid(
                            config.position.x,
                            config.position.y,
                            config.size || 'medium',
                            this.physicsWorld,
                            config.velocity ? config.velocity.x : null,
                            config.velocity ? config.velocity.y : null
                        );
                        break;

                    case 'planet':
                        entity = new Planet(
                            config.position.x,
                            config.position.y,
                            {
                                radius: config.radius,
                                gravityStrength: config.gravityStrength,
                                gravityMaxRange: config.gravityMaxRange,
                                color: config.color
                            }
                        );
                        break;

                    case 'star':
                        entity = new Star(
                            config.position.x,
                            config.position.y,
                            {
                                radius: config.radius,
                                gravityStrength: config.gravityStrength,
                                damageRange: config.damageRange,
                                damagePerSecond: config.damagePerSecond
                            }
                        );
                        break;

                    case 'blackhole':
                        entity = new BlackHole(
                            config.position.x,
                            config.position.y,
                            {
                                eventHorizon: config.eventHorizon,
                                gravityStrength: config.gravityStrength,
                                gravityMaxRange: config.gravityMaxRange
                            }
                        );
                        break;

                    case 'nebula':
                        entity = new Nebula(
                            config.position.x,
                            config.position.y,
                            {
                                radius: config.radius || 1500,
                                color: config.color,
                                sensorInterference: config.sensorInterference,
                                beamInterference: config.beamInterference,
                                shieldInterference: config.shieldInterference
                            }
                        );
                        break;

                    default:
                        console.warn(`Unknown entity type: ${config.type}`);
                        break;
                }

                if (entity) {
                    this.entities.push(entity);
                }
            } catch (error) {
                console.error(`❌ Error creating entity ${i + 1}:`, error);
                throw error; // Re-throw to stop the freeze
            }
        }
    }

    /**
     * Save current game state
     */
    saveCurrentGame() {
        const gameState = {
            playerShip: this.playerShip,
            missionManager: this.missionManager,
            entities: this.entities
        };

        if (this.saveManager.saveGame(gameState)) {
            this.hud.addCriticalMessage('Game saved successfully');
        } else {
            this.hud.addCriticalMessage('ERROR: Failed to save game');
        }
    }

    /**
     * Load saved game
     */
    loadSavedGame() {
        const saveData = this.saveManager.loadGame();
        if (!saveData) {
            alert('No saved game found.');
            return;
        }

        // Clear current state
        this.entities = [];
        this.enemyShips = [];
        this.environmentalHazards = [];
        this.projectiles = [];

        const savedPlayer = saveData.player || {};
        const savedOption = this.findPlayerShipOptionByShip(savedPlayer.faction, savedPlayer.shipClass);
        const fallbackOption = this.findPlayerShipOptionById(this.playerShipSelectionId) || this.playerShipOptions[0];
        const selectedOption = savedOption || fallbackOption;
        this.applyPlayerShipOption(selectedOption, { skipSave: !savedOption, skipUI: false });

        this.playerShip = new Ship({
            x: savedPlayer.x || 0,
            y: savedPlayer.y || 0,
            shipClass: savedPlayer.shipClass || selectedOption.shipClass,
            faction: savedPlayer.faction || selectedOption.faction,
            name: savedPlayer.name || selectedOption.name,
            isPlayer: true,
            physicsWorld: this.physicsWorld
        });

        this.entities.push(this.playerShip);

        const gameState = {
            playerShip: this.playerShip,
            missionManager: this.missionManager,
            entities: this.entities
        };
        this.saveManager.restoreGameState(saveData, gameState);

        // Start game
        this.stateManager.setState('PLAYING');
        if (!this.gameLoop.running) {
            this.gameLoop.start();
        }

        // Load the saved mission
        if (saveData.campaign?.currentMissionId) {
            this.loadMission(saveData.campaign.currentMissionId);
        }

        this.hud.addCriticalMessage('Game loaded successfully');
    }

    /**
     * Find nearest targetable ship to reticle position (for plasma auto-homing)
     */
    findNearestTargetToReticle(reticleX, reticleY) {
        let nearestTarget = null;
        let nearestDistance = Infinity;

        for (const entity of this.entities) {
            if (!entity.active) continue;
            if (entity.type !== 'ship') continue;
            if (entity === this.playerShip) continue; // Don't target self
            if (entity.isCloaked && entity.isCloaked()) continue; // Skip cloaked ships

            const distance = MathUtils.distance(reticleX, reticleY, entity.x, entity.y);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestTarget = entity;
            }
        }

        return nearestTarget;
    }

    /**
     * Find ship at mouse position (for tooltip)
     */
    findShipAtPosition(worldX, worldY) {
        for (const entity of this.entities) {
            if (!entity.active) continue;
            if (entity.type !== 'ship') continue;

            const distance = MathUtils.distance(worldX, worldY, entity.x, entity.y);
            const shipSize = entity.getShipSize ? entity.getShipSize() : 40;

            if (distance <= shipSize / 2) {
                return entity;
            }
        }

        return null;
    }

    /**
     * Show library screen
     */
    showLibrary() {
        if (this.librarySystem) {
            this.librarySystem.showLibrary();
        }
    }

    start() {
        this.gameLoop.start();
    }
}








