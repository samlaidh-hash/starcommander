// Global game configuration constants

const CONFIG = {
    // Canvas and loop
    TARGET_FPS: 30,
    VELOCITY_ITERATIONS: 1,  // Reduced from 4 for performance (90ms→<20ms)
    POSITION_ITERATIONS: 1,  // Reduced from 2 for performance

    // Debug
    DEBUG_MODE: false,
    DEBUG_SHOW_ARCS: false,

    // Performance mode - simplified rendering
    PERFORMANCE_MODE: false, // Disabled - testing full graphics with physics off + reduced resolution

    // Emergency minimal mode - disables almost everything
    MINIMAL_MODE: false, // Disabled - performance mode should be enough

    // Binary search debugging - disable systems to find bottleneck
    DISABLE_AI: false,        // Tested - AI is fine (0ms)
    DISABLE_PHYSICS: true,    // Physics takes 90ms/frame = 11 FPS. Disabled for performance (Option A)
    DISABLE_COLLISIONS: false, // Re-enabled - test if collisions work without physics
    DISABLE_PARTICLES: false,  // Re-enabled

    // Colors
    COLOR_PLAYER: '#00ccff',
    COLOR_TRIGON: '#ff4444',
    COLOR_SCINTILIAN: '#00ff88',
    COLOR_PIRATE: '#ff8800',

    // Ship lengths (render scale baseline) - Only DD, CL, CA, BB
    SHIP_LENGTH_DD: 50,
    SHIP_LENGTH_CL: 60,
    SHIP_LENGTH_CA: 70,
    SHIP_LENGTH_BC: 80,  // Used for BB (Battle Cruiser)


    // Movement - Only DD, CL, CA, BB
    MAX_SPEED_DD: 390,
    MAX_SPEED_CL: 360,
    MAX_SPEED_CA: 330,
    MAX_SPEED_BC: 300,  // Used for BB

    ACCELERATION_DD: 42.5,
    ACCELERATION_CL: 40,
    ACCELERATION_CA: 37.5,
    ACCELERATION_BC: 35,  // Used for BB

    TURN_RATE_DD: 80,   // degrees per second
    TURN_RATE_CL: 70,
    TURN_RATE_CA: 60,
    TURN_RATE_BC: 50,   // Used for BB

    MAX_SPEED_TRIGON_MULTIPLIER: 1.1,
    TURN_RATE_TRIGON_MULTIPLIER: 1.2,

    // Shields
    SYSTEM_HP_SHIELD_GEN: 8, // generator HP baseline


    SHIELD_RECOVERY_DELAY: 10.0, // seconds without hits (increased from 5.0)
    SHIELD_RECOVERY_RATE: 1.0,   // points per second (reduced from 2.0)

    // Internal systems
    SYSTEM_HP_IMPULSE: 16,
    SYSTEM_HP_WARP: 20,
    SYSTEM_HP_SENSORS: 6,
    SYSTEM_HP_CNC: 6,
    SYSTEM_HP_BAY: 6,
    SYSTEM_HP_MAIN_POWER: 12,
    SYSTEM_HP_POWER: 12, // alias used in InternalSystems

    // Warp charging
    WARP_CHARGE_RATE: 60, // percent per second (affected by efficiency)

    // Weapons - Beams
    BEAM_SPEED: 5000,             // pixels per second (almost instant)
    BEAM_RANGE_PIXELS: 500,       // maximum range
    BEAM_DAMAGE: 1,               // damage per hit
    BEAM_COOLDOWN: 1.0,           // seconds between shots
    BEAM_LIFETIME: 0.1,           // seconds beam persists (reduced from 0.4)
    COLOR_BEAM_PROJECTILE: '#ff6633', // orangey-red
    COLOR_BEAM_SCINTILIAN: '#00ff88', // green (Scintilian faction)

    // Weapons - Torpedoes
    TORPEDO_SPEED_CA: 487,        // base speed for CA-class torpedoes (increased 50% from 325)
    TORPEDO_DAMAGE: 8,            // damage per torpedo
    TORPEDO_LOADED: 4,            // torpedoes loaded in launcher
    TORPEDO_STORED: 48,           // torpedoes in storage (tripled from 16)
    TORPEDO_BLAST_RADIUS_PIXELS: 18,
    TORPEDO_LIFETIME: 10,         // seconds before expiring
    TORPEDO_RELOAD_TIME: 5,       // seconds to reload all 4 torpedoes
    TORPEDO_SYSTEM_HIT_COUNT: 4,
    TORPEDO_TURN_RATE: 90,        // degrees per second - limited course change ability for homing
    COLOR_TORPEDO: '#ffaa00',     // orange

    // Weapons - Disruptors (Trigon)
    DISRUPTOR_SPEED: 975,         // 2x torpedo speed (increased 50% from 650)
    DISRUPTOR_DAMAGE: 2,          // 2 damage per hit
    COLOR_DISRUPTOR: '#4488ff',   // glowing blue

    // Weapons - Plasma Torpedoes (Scintilian)
    PLASMA_SPEED_CA: 326,         // 2/3 of normal torpedo speed (increased 50% from 217)
    PLASMA_DAMAGE_POTENTIAL: 30,  // starting DP
    PLASMA_DP_DECAY_PER_SECOND: 1, // DP lost per second
    COLOR_PLASMA: '#00ff88',      // green

    // Plasma charge (damage per second by class) - Only DD, CL, CA, BB
    PLASMA_MAX_CHARGE_TIME: 5, // seconds
    PLASMA_CHARGE_RATE_DD: 6,  // Use CL rate for DD
    PLASMA_CHARGE_RATE_CL: 7,
    PLASMA_CHARGE_RATE_CA: 8,
    PLASMA_CHARGE_RATE_BC: 9,  // Used for BB

    // Auto-repair
    AUTO_REPAIR_RATE: 0.03, // HP per second

    // Crew Skills
    CREW_SKILL_MIN: 1,
    CREW_SKILL_MAX: 10,
    CREW_SKILL_XP_PER_LEVEL: 100, // XP required per level

    // Countermeasures
    DECOY_COUNT: 6,
    MINE_COUNT: 6,
    DEPLOYMENT_COOLDOWN: 6.0, // seconds

    // Targeting
    LOCK_ON_DRIFT_TOLERANCE: 50, // pixels

    // Detection radius (pixels by class) - Only DD, CL, CA, BB
    DETECTION_RADIUS_DD_PIXELS: 9000,
    DETECTION_RADIUS_CL_PIXELS: 10000,
    DETECTION_RADIUS_CA_PIXELS: 11000,
    DETECTION_RADIUS_BC_PIXELS: 12000,  // Used for BB

    // Particles
    PARTICLE_COUNT_COLLAPSAR: 120,
    PARTICLE_COUNT_DUST: 80,

    // Audio
    AUDIO_ENABLED: true,
    AUDIO_VOLUME_MASTER: 0.8,

    // Cloak
    CLOAK_COOLDOWN: 30.0,   // seconds between toggles
    CLOAK_WEAPON_DELAY: 5.0, // seconds after decloak before firing

    // Transporter
    COLOR_TRANSPORTER_BEAM: '#00ffff',
    COLOR_TRANSPORTER_EFFECT: '#00ffff',

    // Torpedo speed multiplier
    TORPEDO_SPEED_MULTIPLIER: 1.2,

    // Interceptor missile
    COLOR_INTERCEPTOR_MISSILE: '#00ff00',

    // Streak Beam (Strike Cruiser weapon)
    STREAK_BEAM_RANGE: 500,        // Same as other beams
    STREAK_BEAM_DAMAGE: 1,         // 1 damage per streak
    STREAK_BEAM_COOLDOWN: 1.5,     // 1.5 seconds between firing sequences
    STREAK_BEAM_SHOT_INTERVAL: 0.2, // 0.2 seconds between the two shots
    COLOR_STREAK_BEAM: '#ff8833',  // Orange-red

    // Environmental Hazards - Planets
    PLANET_RADIUS: 200,                    // Base radius in pixels
    PLANET_GRAVITY_STRENGTH: 50000,        // Gravity force multiplier
    PLANET_GRAVITY_MAX_RANGE: 1500,        // Maximum gravity range in pixels
    PLANET_LANDING_SPEED: 50,              // Max speed for safe landing
    PLANET_BOUNCE_DAMAGE: 20,              // Damage for hitting too fast
    COLOR_PLANET: '#8B7355',               // Default brown/tan color

    // Environmental Hazards - Stars
    STAR_RADIUS: 150,                      // Star visual radius
    STAR_GRAVITY_STRENGTH: 80000,          // Stronger than planets
    STAR_GRAVITY_MAX_RANGE: 2000,          // Larger gravity range
    STAR_DAMAGE_RANGE: 500,                // Range where heat damage starts
    STAR_DAMAGE_PER_SECOND: 5,             // Heat damage per second
    COLOR_STAR: '#FFFF00',                 // Yellow

    // Environmental Hazards - Black Holes
    BLACKHOLE_EVENT_HORIZON: 100,          // Instant death radius
    BLACKHOLE_GRAVITY_STRENGTH: 150000,    // Extremely strong
    BLACKHOLE_GRAVITY_MAX_RANGE: 3000,     // Massive gravity range
    BLACKHOLE_ACCRETION_DISK_RADIUS: 300,  // Visual disk radius
    COLOR_BLACKHOLE: '#000000',            // Black

    // Environmental Hazards - Nebula
    NEBULA_RADIUS: 1500,                   // Nebula radius in pixels
    NEBULA_DRAG_COEFFICIENT: 0.3,          // Drag force multiplier
    NEBULA_SHIELD_INTERFERENCE: 0.5,       // Shields at 50% effectiveness
    NEBULA_SENSOR_INTERFERENCE: 0.1,       // Sensors at 10% effectiveness (90% reduction)
    NEBULA_BEAM_INTERFERENCE: 0.7,         // Beams at 70% accuracy
    NEBULA_TORPEDO_DRAG: 0.6,              // Torpedoes at 60% speed
    NEBULA_ALPHA: 0.3,                     // Visual transparency
    NEBULA_SENSOR_REDUCTION: 0.9,          // 90% sensor reduction
    NEBULA_ACCURACY_PENALTY: 100,          // ±100 pixel deviation
    COLOR_NEBULA: '#FF00FF'                // Magenta default
};