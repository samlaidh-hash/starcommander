/**
 * Star Sea - Consumable System
 * Manages mission loadout consumables and their activation
 *
 * Six consumable types:
 * 1. Extra Torpedoes - Adds +10 to torpedo storage
 * 2. Extra Decoys - Adds +3 decoys
 * 3. Extra Mines - Adds +3 mines
 * 4. Shield Boost - Adds +20% to all shield quadrants
 * 5. Hull Repair Kit - Instant heal +50 HP
 * 6. Energy Cells - +20% weapon damage for 60 seconds
 */

class ConsumableSystem {
    constructor(ship) {
        this.ship = ship;

        // Consumable inventory (loaded from mission briefing or default loadout)
        this.inventory = {
            extraTorpedoes: 0,    // Hotkey: 1
            extraDecoys: 0,       // Hotkey: 2
            extraMines: 0,        // Hotkey: 3
            hullRepairKit: 0,     // Hotkey: 4
            energyCells: 0,       // Hotkey: 5
            extraShuttles: 0,     // Hotkey: 6
            extraFighters: 0,     // Hotkey: 7
            extraBombers: 0,      // Hotkey: 8
            extraDrones: 0,       // Hotkey: 9
            extraProbes: 0        // Hotkey: 0
        };

        // Load default consumables for ship class
        this.loadDefaultConsumables();

        // Active effects (removed - energy cells are now instant)
        this.activeEffects = {};

        // Consumable definitions for display
        this.definitions = {
            extraTorpedoes: {
                name: 'Extra Torpedoes',
                description: '+10 Torpedo Storage',
                hotkey: '1',
                instant: true
            },
            extraDecoys: {
                name: 'Extra Decoys',
                description: '+3 Decoys',
                hotkey: '2',
                instant: true
            },
            extraMines: {
                name: 'Extra Mines',
                description: '+3 Mines',
                hotkey: '3',
                instant: true
            },
            hullRepairKit: {
                name: 'Hull Repair Kit',
                description: '+50 HP Instant',
                hotkey: '4',
                instant: true
            },
            energyCells: {
                name: 'Energy Cells',
                description: '+1 Full Energy Block (Instant)',
                hotkey: '5',
                instant: true
            },
            extraShuttles: {
                name: 'Extra Shuttles',
                description: '+1 Shuttle to Bay',
                hotkey: '7',
                instant: true
            },
            extraFighters: {
                name: 'Extra Fighters',
                description: '+1 Fighter to Bay',
                hotkey: '8',
                instant: true
            },
            extraDrones: {
                name: 'Extra Drones',
                description: '+1 Drone/Bomber to Bay',
                hotkey: '9',
                instant: true
            },
            extraProbes: {
                name: 'Extra Probes',
                description: '+1 Probe to Bay',
                hotkey: '0',
                instant: true
            }
        };
    }

    /**
     * Load default consumables based on ship class
     * Based on design document specifications
     */
    loadDefaultConsumables() {
        if (!this.ship) return;

        const shipClass = this.ship.shipClass || 'CA';

        // Get default loadout for this ship class
        const defaults = this.getDefaultLoadout(shipClass);

        // Set inventory to default values
        this.inventory.extraTorpedoes = defaults.extraTorpedoes;
        this.inventory.extraDecoys = defaults.extraDecoys;
        this.inventory.extraMines = defaults.extraMines;
        this.inventory.shieldBoost = defaults.shieldBoost;
        this.inventory.hullRepairKit = defaults.hullRepairKit;
        this.inventory.energyCells = defaults.energyCells;
        this.inventory.extraShuttles = defaults.extraShuttles;
        this.inventory.extraFighters = defaults.extraFighters;
        this.inventory.extraDrones = defaults.extraDrones;
        this.inventory.extraProbes = defaults.extraProbes;
    }

    /**
     * Get default consumable loadout by ship class
     * Based on bay size and ship capabilities
     *
     * Formulas (where shipTier = 1 for FG, 2 for DD, etc.):
     * - extraTorpedoes: shipTier × 20
     * - extraDecoys: shipTier × 6
     * - extraShuttles: shipTier × 1
     * - extraFighters: shipTier × 1
     * - extraDrones: shipTier × 2
     * - extraProbes: shipTier × 3
     */
    getDefaultLoadout(shipClass) {
        // Default loadouts per ship class
        // Format: { extraTorpedoes, extraDecoys, extraMines, shieldBoost, hullRepairKit, energyCells, extraShuttles, extraFighters, extraDrones, extraProbes }
        const loadouts = {
            'FG': {
                extraTorpedoes: 20,   // Frigate (Tier 1): 1 × 20
                extraDecoys: 6,       // Tier 1: 1 × 6
                extraMines: 1,
                hullRepairKit: 1,
                energyCells: 0,
                extraShuttles: 1,     // Tier 1: 1 × 1
                extraFighters: 1,     // Tier 1: 1 × 1
                extraDrones: 2,       // Tier 1: 1 × 2
                extraProbes: 3        // Tier 1: 1 × 3
            },
            'DD': {
                extraTorpedoes: 40,   // Destroyer (Tier 2): 2 × 20
                extraDecoys: 12,      // Tier 2: 2 × 6
                extraMines: 1,
                shieldBoost: 1,
                hullRepairKit: 1,
                energyCells: 1,
                extraShuttles: 2,     // Tier 2: 2 × 1
                extraFighters: 2,     // Tier 2: 2 × 1
                extraDrones: 4,       // Tier 2: 2 × 2
                extraProbes: 6        // Tier 2: 2 × 3
            },
            'CL': {
                extraTorpedoes: 60,   // Light Cruiser (Tier 3): 3 × 20
                extraDecoys: 18,      // Tier 3: 3 × 6
                extraMines: 2,
                shieldBoost: 1,
                hullRepairKit: 2,
                energyCells: 1,
                extraShuttles: 3,     // Tier 3: 3 × 1
                extraFighters: 3,     // Tier 3: 3 × 1
                extraDrones: 6,       // Tier 3: 3 × 2
                extraProbes: 9        // Tier 3: 3 × 3
            },
            'CS': {
                extraTorpedoes: 80,   // Strike Cruiser (Tier 4): 4 × 20
                extraDecoys: 24,      // Tier 4: 4 × 6
                extraMines: 2,
                shieldBoost: 1,
                hullRepairKit: 2,
                energyCells: 2,
                extraShuttles: 4,     // Tier 4: 4 × 1
                extraFighters: 4,     // Tier 4: 4 × 1
                extraDrones: 8,       // Tier 4: 4 × 2
                extraProbes: 12       // Tier 4: 4 × 3
            },
            'CA': {
                extraTorpedoes: 100,  // Heavy Cruiser (Tier 5): 5 × 20
                extraDecoys: 30,      // Tier 5: 5 × 6
                extraMines: 2,
                shieldBoost: 2,
                hullRepairKit: 2,
                energyCells: 2,
                extraShuttles: 5,     // Tier 5: 5 × 1
                extraFighters: 5,     // Tier 5: 5 × 1
                extraDrones: 10,      // Tier 5: 5 × 2
                extraProbes: 15       // Tier 5: 5 × 3
            },
            'BC': {
                extraTorpedoes: 120,  // Battlecruiser (Tier 6): 6 × 20
                extraDecoys: 36,      // Tier 6: 6 × 6
                extraMines: 3,
                shieldBoost: 2,
                hullRepairKit: 3,
                energyCells: 2,
                extraShuttles: 6,     // Tier 6: 6 × 1
                extraFighters: 6,     // Tier 6: 6 × 1
                extraDrones: 12,      // Tier 6: 6 × 2
                extraProbes: 18       // Tier 6: 6 × 3
            },
            'BB': {
                extraTorpedoes: 140,  // Battleship (Tier 7): 7 × 20
                extraDecoys: 42,      // Tier 7: 7 × 6
                extraMines: 3,
                shieldBoost: 3,
                hullRepairKit: 3,
                energyCells: 3,
                extraShuttles: 7,     // Tier 7: 7 × 1
                extraFighters: 7,     // Tier 7: 7 × 1
                extraDrones: 14,      // Tier 7: 7 × 2
                extraProbes: 21       // Tier 7: 7 × 3
            },
            'DN': {
                extraTorpedoes: 160,  // Dreadnought (Tier 8): 8 × 20
                extraDecoys: 48,      // Tier 8: 8 × 6
                extraMines: 4,
                shieldBoost: 3,
                hullRepairKit: 4,
                energyCells: 3,
                extraShuttles: 8,     // Tier 8: 8 × 1
                extraFighters: 8,     // Tier 8: 8 × 1
                extraDrones: 16,      // Tier 8: 8 × 2
                extraProbes: 24       // Tier 8: 8 × 3
            },
            'SD': {
                extraTorpedoes: 180,  // Super Dreadnought (Tier 9): 9 × 20
                extraDecoys: 54,      // Tier 9: 9 × 6
                extraMines: 4,
                shieldBoost: 4,
                hullRepairKit: 4,
                energyCells: 4,
                extraShuttles: 9,     // Tier 9: 9 × 1
                extraFighters: 9,     // Tier 9: 9 × 1
                extraDrones: 18,      // Tier 9: 9 × 2
                extraProbes: 27       // Tier 9: 9 × 3
            }
        };

        return loadouts[shipClass] || loadouts['CA']; // Default to CA if class not found
    }

    /**
     * Add consumable to inventory (called from mission briefing)
     */
    addConsumable(type, count) {
        if (this.inventory.hasOwnProperty(type)) {
            this.inventory[type] += count;
            return true;
        }
        return false;
    }

    /**
     * Use a consumable (called from hotkey press)
     */
    useConsumable(type) {
        // Check if we have any
        if (this.inventory[type] <= 0) {
            console.log(`No ${type} available`);
            return false;
        }

        // Decrement inventory
        this.inventory[type]--;

        // Apply effect based on type
        switch (type) {
            case 'extraTorpedoes':
                this.applyExtraTorpedoes();
                break;

            case 'extraDecoys':
                this.ship.decoys += 3;
                console.log(' +3 Decoys');
                break;

            case 'extraMines':
                this.ship.mines += 3;
                console.log(' +3 Mines');
                break;

            case 'hullRepairKit':
                this.applyHullRepair();
                break;

            case 'energyCells':
                this.applyEnergyCellBoost();
                break;

            case 'extraShuttles':
                console.log(' +1 Shuttle to Bay');
                // Note: Actual bay management handled by BaySystem
                break;

            case 'extraFighters':
                console.log(' +1 Fighter to Bay');
                // Note: Actual bay management handled by BaySystem
                break;

            case 'extraDrones':
                console.log(' +1 Drone to Bay');
                // Note: Actual bay management handled by BaySystem
                break;

            case 'extraProbes':
                console.log(' +1 Probe to Bay');
                // Note: Actual bay management handled by BaySystem
                break;

            default:
                console.warn(`Unknown consumable type: ${type}`);
                return false;
        }

        // Emit event for UI updates
        eventBus.emit('consumable-used', {
            ship: this.ship,
            type: type,
            remaining: this.inventory[type]
        });

        return true;
    }

    /**
     * Apply extra torpedoes to launcher
     */
    applyExtraTorpedoes() {
        const torpedoLaunchers = this.ship.getTorpedoLaunchers();
        if (torpedoLaunchers && torpedoLaunchers.length > 0) {
            torpedoLaunchers[0].stored += 10;
            console.log(' +10 Torpedoes');
        } else {
            console.warn('No torpedo launcher found');
        }
    }

    /**
     * Apply hull repair (+50 HP instant)
     */
    applyHullRepair() {
        if (this.ship.systems && this.ship.systems.hull) {
            const hullSystem = this.ship.systems.hull;
            const healAmount = 50;
            const actualHeal = Math.min(healAmount, hullSystem.maxHp - hullSystem.hp);
            hullSystem.hp = Math.min(hullSystem.hp + healAmount, hullSystem.maxHp);
            console.log(` Hull Repaired: +${actualHeal} HP`);
        }
    }

    /**
     * Activate energy cells (+20% damage for 60 seconds)
     */
    activateEnergyCells() {
        const currentTime = performance.now() / 1000;
        this.activeEffects.energyCells.active = true;
        this.activeEffects.energyCells.endTime = currentTime + this.activeEffects.energyCells.duration;
        console.log(' Energy Cells Active: +20% damage for 60s');
    }

    /**
     * Update active effects (call each frame)
     */
    update(currentTime) {
        // Check if energy cells expired
        if (this.activeEffects.energyCells.active) {
            if (currentTime > this.activeEffects.energyCells.endTime) {
                this.activeEffects.energyCells.active = false;
                console.log('� Energy Cells expired');

                eventBus.emit('consumable-expired', {
                    ship: this.ship,
                    type: 'energyCells'
                });
            }
        }
    }

    /**
     * Get damage multiplier (for weapon damage calculation)
     */
    getDamageMultiplier() {
        // Energy cells are now instant boost only, no damage multiplier
        return 1.0;
    }

    /**
     * Get remaining time for energy cells (for UI display)
     */
    getEnergyCellsTimeRemaining(currentTime) {
        // Energy cells are now instant boost only, no time remaining
        return 0;
    }

    /**
     * Check if a consumable type is available
     */
    hasConsumable(type) {
        return this.inventory[type] > 0;
    }

    /**
     * Get inventory summary for display
     */
    getInventorySummary() {
        return {
            extraTorpedoes: {
                count: this.inventory.extraTorpedoes,
                ...this.definitions.extraTorpedoes
            },
            extraDecoys: {
                count: this.inventory.extraDecoys,
                ...this.definitions.extraDecoys
            },
            extraMines: {
                count: this.inventory.extraMines,
                ...this.definitions.extraMines
            },
            hullRepairKit: {
                count: this.inventory.hullRepairKit,
                ...this.definitions.hullRepairKit
            },
            energyCells: {
                count: this.inventory.energyCells,
                ...this.definitions.energyCells
            },
            extraShuttles: {
                count: this.inventory.extraShuttles,
                ...this.definitions.extraShuttles
            },
            extraFighters: {
                count: this.inventory.extraFighters,
                ...this.definitions.extraFighters
            },
            extraDrones: {
                count: this.inventory.extraDrones,
                ...this.definitions.extraDrones
            },
            extraProbes: {
                count: this.inventory.extraProbes,
                ...this.definitions.extraProbes
            }
        };
    }

    /**
     * Load consumables from mission briefing selection
     */
    loadFromMissionBriefing(selection) {
        for (const type in selection) {
            if (this.inventory.hasOwnProperty(type)) {
                this.inventory[type] = selection[type] || 0;
            }
        }
    }

    /**
     * Clear all consumables (for mission reset)
     */
    clear() {
        for (const type in this.inventory) {
            this.inventory[type] = 0;
        }
        this.activeEffects.energyCells.active = false;
    }
}
