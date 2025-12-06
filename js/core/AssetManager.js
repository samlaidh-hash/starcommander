/**
 * Star Sea - Asset Manager
 * Loads and manages ship PNG images
 */

class AssetManager {
    constructor() {
        this.shipImages = new Map(); // Key: "faction_shipClass", Value: HTMLImageElement
        this.loadingPromises = new Map(); // Track loading promises to avoid duplicate loads
    }

    /**
     * Get ship image (returns null if not loaded yet)
     * @param {string} faction - Lowercase faction name ('federation', 'trigon', 'scintilian', 'pirate')
     * @param {string} shipClass - Ship class ('DD', 'CL', 'CA', 'BC', etc.)
     * @returns {HTMLImageElement|null} - Image element or null if not loaded
     */
    getShipImage(faction, shipClass) {
        const key = `${faction}_${shipClass}`;
        return this.shipImages.get(key) || null;
    }

    /**
     * Load ship image asynchronously
     * @param {string} faction - Lowercase faction name
     * @param {string} shipClass - Ship class
     * @returns {Promise<HTMLImageElement>} - Promise that resolves when image loads
     */
    loadShipImage(faction, shipClass) {
        const key = `${faction}_${shipClass}`;
        
        // Return existing image if already loaded
        const existing = this.shipImages.get(key);
        if (existing && existing.complete && existing.naturalWidth > 0) {
            return Promise.resolve(existing);
        }

        // Return existing promise if already loading
        const existingPromise = this.loadingPromises.get(key);
        if (existingPromise) {
            return existingPromise;
        }

        // Create new loading promise
        const promise = new Promise((resolve, reject) => {
            // Map faction names to image directory names
            const factionMap = {
                'federation': 'federation',
                'trigon': 'trigon',
                'scintilian': 'scintilian',
                'pirate': 'pirate',
                'commonwealth': 'commonwealth',
                'andromedan': 'andromedan',
                'dhojan': 'dhojan'
            };

            const factionDir = factionMap[faction.toLowerCase()] || faction.toLowerCase();
            
            // Map ship classes to image file names
            const classMap = {
                'DD': 'dd',
                'CL': 'cl',
                'CA': 'ca',
                'BC': 'bc',
                'BB': 'bc', // Battleship uses BC image
                'DN': 'bc', // Dreadnought uses BC image
                'SD': 'bc'  // Super Dreadnought uses BC image
            };

            const classFile = classMap[shipClass] || shipClass.toLowerCase();
            
            // Construct image path: ASSETS/IMAGES/{faction} {class} {name}.png
            // Examples:
            // - federation ca nebula.png
            // - trigon dd sleet.png
            // - scintilian cl hawk.png
            // - pirate bc marauder.png
            
            // Try different naming patterns
            const possiblePaths = [
                `ASSETS/IMAGES/${factionDir} ${classFile} ${this.getShipName(factionDir, classFile)}.png`,
                `ASSETS/IMAGES/${factionDir}_${classFile}.png`,
                `ASSETS/IMAGES/${factionDir} ${classFile}.png`
            ];

            let image = new Image();
            let loaded = false;

            const tryLoad = (pathIndex) => {
                if (pathIndex >= possiblePaths.length) {
                    // All paths failed
                    this.loadingPromises.delete(key);
                    reject(new Error(`Could not load ship image for ${faction} ${shipClass}`));
                    return;
                }

                image.onload = () => {
                    if (!loaded) {
                        loaded = true;
                        this.shipImages.set(key, image);
                        this.loadingPromises.delete(key);
                        resolve(image);
                    }
                };

                image.onerror = () => {
                    // Try next path
                    tryLoad(pathIndex + 1);
                };

                image.src = possiblePaths[pathIndex];
            };

            tryLoad(0);
        });

        this.loadingPromises.set(key, promise);
        return promise;
    }

    /**
     * Get ship name for image file
     */
    getShipName(faction, shipClass) {
        const names = {
            'federation': { 'dd': 'delta', 'cl': 'star', 'ca': 'nebula', 'bc': 'galaxy' },
            'trigon': { 'dd': 'sleet', 'cl': 'hail', 'ca': 'lightning', 'bc': 'thunder' },
            'scintilian': { 'dd': 'falcon', 'cl': 'hawk', 'ca': 'eagle', 'bc': 'condor' },
            'pirate': { 'dd': 'highwayman', 'cl': 'bandit', 'ca': 'reaver', 'bc': 'marauder' },
            'commonwealth': { 'dd': 'county', 'cl': 'barony', 'ca': 'duchy', 'bc': 'monarch' },
            'andromedan': { 'dd': 'hoplite', 'cl': 'warrior', 'ca': 'major', 'bc': 'knight' },
            'dhojan': { 'dd': 'lieutenant', 'cl': 'captain', 'ca': 'major', 'bc': 'general' }
        };

        return names[faction]?.[shipClass] || 'unknown';
    }

    /**
     * Preload all ship images (optional, for faster initial loading)
     */
    preloadShipImages(factions = ['federation', 'trigon', 'scintilian', 'pirate'], shipClasses = ['DD', 'CL', 'CA', 'BC']) {
        const promises = [];
        for (const faction of factions) {
            for (const shipClass of shipClasses) {
                promises.push(this.loadShipImage(faction, shipClass).catch(() => {
                    // Ignore individual load failures
                }));
            }
        }
        return Promise.allSettled(promises);
    }
}
