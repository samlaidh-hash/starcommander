/**
 * Star Sea - Ship Factory
 * Creates appropriate ship class instances based on faction
 */

class ShipFactory {
    /**
     * Create a ship instance based on faction
     * @param {Object} config - Ship configuration
     * @returns {Ship} Ship instance (or specialized subclass)
     */
    static createShip(config) {
        const faction = config.faction || 'FEDERATION';

        switch (faction) {
            case 'DHOJAN':
                return new DhojanShip(config);
            case 'COMMONWEALTH':
                return new CommonwealthShip(config);
            case 'ANDROMEDAN':
                return new AndromedanShip(config);
            default:
                // Default to base Ship class for FEDERATION, TRIGON, SCINTILIAN, PIRATE, etc.
                return new Ship(config);
        }
    }
}

