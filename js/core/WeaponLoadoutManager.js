/**
 * Star Sea - Weapon Loadout Manager
 * Loads weapon configurations from JSON files that match PNG ship images
 */

class WeaponLoadoutManager {
    constructor() {
        this.loadouts = new Map();
        this.loadPromises = new Map();
    }

    /**
     * Get JSON file path for a ship's weapon loadout
     * @param {string} faction - Ship faction
     * @param {string} shipClass - Ship class (DD, CL, CA, BB)
     * @returns {string} Path to JSON file
     */
    getLoadoutPath(faction, shipClass) {
        const factionUpper = faction.toUpperCase();
        // Map ship class BB to BC for file naming (Battle Cruiser)
        const classForFile = shipClass === 'BB' ? 'BC' : shipClass;
        return `${factionUpper}_${classForFile}_weapons.json`;
    }

    /**
     * Load weapon loadout from JSON file
     * @param {string} faction - Ship faction
     * @param {string} shipClass - Ship class
     * @returns {Promise<Object|null>} Promise that resolves to loadout data or null if not found
     */
    async loadLoadout(faction, shipClass) {
        const path = this.getLoadoutPath(faction, shipClass);
        const cacheKey = `${faction}_${shipClass}`;

        // Return cached loadout if already loaded
        if (this.loadouts.has(cacheKey)) {
            return this.loadouts.get(cacheKey);
        }

        // Return existing promise if already loading
        if (this.loadPromises.has(cacheKey)) {
            return this.loadPromises.get(cacheKey);
        }

        // Create new load promise
        const promise = fetch(path)
            .then(response => {
                if (!response.ok) {
                    // File doesn't exist - return null (fallback to hardcoded loadouts)
                    return null;
                }
                return response.json();
            })
            .then(data => {
                this.loadouts.set(cacheKey, data);
                this.loadPromises.delete(cacheKey);
                return data;
            })
            .catch(error => {
                this.loadPromises.delete(cacheKey);
                // Silently handle errors - fallback to hardcoded loadouts
                console.warn(`Failed to load weapon loadout from ${path}, using default:`, error.message);
                return null;
            });

        this.loadPromises.set(cacheKey, promise);
        return promise;
    }

    /**
     * Get cached loadout (returns null if not loaded)
     * @param {string} faction - Ship faction
     * @param {string} shipClass - Ship class
     * @returns {Object|null} Cached loadout or null
     */
    getLoadout(faction, shipClass) {
        const cacheKey = `${faction}_${shipClass}`;
        return this.loadouts.get(cacheKey) || null;
    }

    /**
     * Preload all weapon loadouts
     * @returns {Promise<void>} Promise that resolves when all loadouts are loaded
     */
    async preloadAllLoadouts() {
        const factions = ['FEDERATION', 'TRIGON', 'SCINTILIAN', 'PIRATE', 'ANDROMEDAN', 'COMMONWEALTH', 'DHOJAN'];
        const classes = ['DD', 'CL', 'CA', 'BB'];
        const promises = [];

        for (const faction of factions) {
            for (const shipClass of classes) {
                // Loadouts are optional - fallback to hardcoded if JSON doesn't exist
                promises.push(this.loadLoadout(faction, shipClass).catch(() => {
                    // Silently handle missing JSON files
                }));
            }
        }

        await Promise.all(promises);
        console.log('All weapon loadouts preloaded');
    }
}

// Create global instance
window.weaponLoadoutManager = new WeaponLoadoutManager();

