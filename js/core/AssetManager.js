/**
 * Star Sea - Asset Manager
 * Loads and caches PNG images for ships
 */

class AssetManager {
    constructor() {
        this.images = new Map();
        this.loadPromises = new Map();
    }

    /**
     * Get image path for a ship
     * @param {string} faction - Ship faction
     * @param {string} shipClass - Ship class (DD, CL, CA, BB)
     * @returns {string} Path to image file
     */
    getImagePath(faction, shipClass) {
        const factionLower = faction.toLowerCase();
        const classNames = {
            'DD': 'dd',
            'CL': 'cl',
            'CA': 'ca',
            'BB': 'bc', // Battle Cruiser uses "bc" in file names
            'BC': 'bc'  // Battle Cruiser uses "bc" in file names
        };
        const className = classNames[shipClass] || 'dd';
        
        // Map faction names to image file names (all lowercase)
        const factionMap = {
            'federation': 'federation',
            'trigon': 'trigon',
            'scintilian': 'scintilian',
            'pirate': 'pirate',
            'andromedan': 'andromedan',
            'commonwealth': 'commonwealth',
            'dhojan': 'dhojan',
            'player': 'federation' // Player uses Federation ships
        };
        
        const factionName = factionMap[factionLower] || 'federation';
        
        // Get ship name based on class (matching actual file names)
        const shipNames = {
            'dd': factionName === 'federation' ? 'delta' :
                  factionName === 'trigon' ? 'sleet' :
                  factionName === 'scintilian' ? 'falcon' :
                  factionName === 'pirate' ? 'highwayman' :
                  factionName === 'andromedan' ? 'hoplite' :
                  factionName === 'commonwealth' ? 'county' :
                  factionName === 'dhojan' ? 'lieutenant' : 'delta',
            'cl': factionName === 'federation' ? 'star' :
                  factionName === 'trigon' ? 'hail' :
                  factionName === 'scintilian' ? 'hawk' :
                  factionName === 'pirate' ? 'bandit' :
                  factionName === 'andromedan' ? 'warrior' :
                  factionName === 'commonwealth' ? 'barony' :
                  factionName === 'dhojan' ? 'captain' : 'star',
            'ca': factionName === 'federation' ? 'nebula' :
                  factionName === 'trigon' ? 'lightning' :
                  factionName === 'scintilian' ? 'eagle' :
                  factionName === 'pirate' ? 'reaver' :
                  factionName === 'andromedan' ? 'knight' :
                  factionName === 'commonwealth' ? 'duchy' :
                  factionName === 'dhojan' ? 'major' : 'nebula',
            'bc': factionName === 'federation' ? 'galaxy' :
                  factionName === 'trigon' ? 'thunder' :
                  factionName === 'scintilian' ? 'condor' :
                  factionName === 'pirate' ? 'marauder' :
                  factionName === 'andromedan' ? 'gladiator' :
                  factionName === 'commonwealth' ? 'monarch' :
                  factionName === 'dhojan' ? 'general' : 'galaxy'
        };
        
        const shipName = shipNames[className] || 'delta';
        // File names are lowercase with spaces: "federation dd delta.png" or "federation bc galaxy.png"
        // Note: Path uses uppercase ASSETS to match GitHub repository structure
        return `ASSETS/IMAGES/${factionName} ${className} ${shipName}.png`;
    }

    /**
     * Load an image
     * @param {string} path - Path to image file
     * @returns {Promise<HTMLImageElement>} Promise that resolves to loaded image
     */
    loadImage(path) {
        // Return cached image if already loaded
        if (this.images.has(path)) {
            return Promise.resolve(this.images.get(path));
        }

        // Return existing promise if already loading
        if (this.loadPromises.has(path)) {
            return this.loadPromises.get(path);
        }

        // Create new load promise
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images.set(path, img);
                this.loadPromises.delete(path);
                resolve(img);
            };
            img.onerror = () => {
                this.loadPromises.delete(path);
                // Don't log warnings for missing images - they're optional
                // Ships will render without textures if images don't exist
                // Resolve with null instead of rejecting to prevent game-breaking errors
                resolve(null);
            };
            img.src = path;
        });

        this.loadPromises.set(path, promise);
        return promise;
    }

    /**
     * Load ship image
     * @param {string} faction - Ship faction
     * @param {string} shipClass - Ship class
     * @returns {Promise<HTMLImageElement>} Promise that resolves to loaded image
     */
    loadShipImage(faction, shipClass) {
        const path = this.getImagePath(faction, shipClass);
        return this.loadImage(path);
    }

    /**
     * Get cached image (returns null if not loaded)
     * @param {string} path - Path to image file
     * @returns {HTMLImageElement|null} Cached image or null
     */
    getImage(path) {
        return this.images.get(path) || null;
    }

    /**
     * Get cached ship image (returns null if not loaded)
     * @param {string} faction - Ship faction
     * @param {string} shipClass - Ship class
     * @returns {HTMLImageElement|null} Cached image or null
     */
    getShipImage(faction, shipClass) {
        const path = this.getImagePath(faction, shipClass);
        return this.getImage(path);
    }

    /**
     * Preload all ship images
     * @returns {Promise<void>} Promise that resolves when all images are loaded
     */
    async preloadAllShips() {
        // Preload all faction images (player ships use federation images, so we don't need to preload 'player' separately)
        const factions = ['federation', 'trigon', 'scintilian', 'pirate', 'andromedan', 'commonwealth', 'dhojan'];
        const classes = ['DD', 'CL', 'CA', 'BB'];
        const promises = [];

        for (const faction of factions) {
            for (const shipClass of classes) {
                // Images are optional - ships will render without textures if images don't exist
                promises.push(this.loadShipImage(faction, shipClass).catch(() => {
                    // Silently handle missing images - they're optional assets
                }));
            }
        }

        await Promise.all(promises);
        console.log('All ship images preloaded');
    }
}

// Create global instance
window.assetManager = new AssetManager();

