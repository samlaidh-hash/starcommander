/**
 * Star Sea - Weapon Loadout Loader
 * Loads and caches weapon JSON files for ship loadouts
 */

class WeaponLoadoutLoader {
    constructor() {
        this.loadouts = new Map(); // Key: "faction_shipClass", Value: loadout data
        this.loadingPromises = new Map(); // Track loading promises to avoid duplicate loads
    }

    /**
     * Get weapon loadout (returns null if not loaded yet)
     * @param {string} faction - Faction name ('FEDERATION', 'COMMONWEALTH', etc.)
     * @param {string} shipClass - Ship class ('DD', 'CL', 'CA', etc.)
     * @returns {Object|null} - Loadout data or null if not loaded
     */
    getLoadout(faction, shipClass) {
        const key = `${faction}_${shipClass}`;
        return this.loadouts.get(key) || null;
    }

    /**
     * Load weapon loadout JSON file asynchronously
     * @param {string} faction - Faction name ('FEDERATION', 'COMMONWEALTH', etc.)
     * @param {string} shipClass - Ship class ('DD', 'CL', 'CA', etc.)
     * @returns {Promise<Object>} - Promise that resolves with loadout data
     */
    async loadLoadout(faction, shipClass) {
        const key = `${faction}_${shipClass}`;
        
        // Return existing loadout if already loaded
        const existing = this.loadouts.get(key);
        if (existing) {
            return Promise.resolve(existing);
        }

        // Return existing promise if already loading
        const existingPromise = this.loadingPromises.get(key);
        if (existingPromise) {
            return existingPromise;
        }

        // Create new loading promise
        const promise = (async () => {
            try {
                const filename = `${faction}_${shipClass}_weapons.json`;
                console.log(`📥 Loading weapon JSON: ${filename}`);
                const response = await fetch(filename);
                
                if (!response.ok) {
                    throw new Error(`Failed to load ${filename}: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log(`✅ Loaded JSON data for ${faction}_${shipClass}:`, data);
                
                // Validate data structure
                if (!data.weapons || !Array.isArray(data.weapons)) {
                    throw new Error(`Invalid loadout data in ${filename}: missing weapons array`);
                }
                
                // Store loaded data
                this.loadouts.set(key, data);
                console.log(`💾 Cached JSON loadout for ${faction}_${shipClass}`);
                
                return data;
            } catch (error) {
                console.warn(`❌ Failed to load weapon loadout ${faction}_${shipClass}:`, error.message || error);
                // Return null on error - will fall back to hardcoded loadouts
                return null;
            } finally {
                // Remove promise from loading map
                this.loadingPromises.delete(key);
            }
        })();

        // Store promise
        this.loadingPromises.set(key, promise);
        
        return promise;
    }

    /**
     * Preload all weapon loadouts for a faction
     * @param {string} faction - Faction name
     * @param {string[]} shipClasses - Array of ship classes to preload
     * @returns {Promise<void>}
     */
    async preloadFaction(faction, shipClasses = ['DD', 'CL', 'CA', 'BB']) {
        const promises = shipClasses.map(shipClass => this.loadLoadout(faction, shipClass));
        await Promise.allSettled(promises);
    }

    /**
     * Clear all cached loadouts
     */
    clear() {
        this.loadouts.clear();
        this.loadingPromises.clear();
    }
}

// Create global instance
window.weaponLoadoutLoader = new WeaponLoadoutLoader();


