/**
 * Star Sea - Energy System Component
 * Replaces InternalSystems with energy block system
 */

class EnergySystem {
    constructor(shipClass) {
        // Energy blocks: DD=1, CL=2, CA=3, BB=4
        const blockCounts = {
            'DD': 1,
            'CL': 2,
            'CA': 3,
            'BB': 4
        };
        
        this.blockCount = blockCounts[shipClass] || 1;
        this.blocks = [];
        
        // Initialize blocks - each block has maxLength and currentLength
        // Block length represents capacity (damage reduces length)
        const baseBlockLength = 100; // Base capacity per block
        for (let i = 0; i < this.blockCount; i++) {
            this.blocks.push({
                maxLength: baseBlockLength,
                currentLength: baseBlockLength, // Current capacity
                energy: baseBlockLength, // Current energy (0 to currentLength)
                index: i
            });
        }
        
        // Energy drain/refill rates
        this.drainRate = 1.5; // Energy per second when draining (reduced 70% from 5)
        this.refillRate = 3; // Energy per second when refilling
    }
    
    /**
     * Get total current energy across all blocks
     */
    getTotalEnergy() {
        return this.blocks.reduce((sum, block) => sum + block.energy, 0);
    }
    
    /**
     * Get total max energy capacity (sum of all block lengths)
     */
    getTotalCapacity() {
        return this.blocks.reduce((sum, block) => sum + block.currentLength, 0);
    }
    
    /**
     * Get energy percentage (0-1)
     */
    getEnergyPercent() {
        const total = this.getTotalCapacity();
        if (total === 0) return 0;
        return this.getTotalEnergy() / total;
    }
    
    /**
     * Drain energy from blocks (top to bottom)
     * Returns amount actually drained
     */
    drainEnergy(amount, deltaTime = 0) {
        if (deltaTime > 0) {
            // Continuous drain over time
            amount = this.drainRate * deltaTime;
        }
        
        let remaining = amount;
        for (let i = 0; i < this.blocks.length && remaining > 0; i++) {
            const block = this.blocks[i];
            const drainFromBlock = Math.min(remaining, block.energy);
            block.energy -= drainFromBlock;
            remaining -= drainFromBlock;
        }
        
        return amount - remaining;
    }
    
    /**
     * Refill energy to blocks (bottom to top)
     * Returns amount actually refilled
     */
    refillEnergy(amount, deltaTime = 0) {
        if (deltaTime > 0) {
            // Continuous refill over time
            amount = this.refillRate * deltaTime;
        }
        
        let remaining = amount;
        // Refill from bottom block up
        for (let i = this.blocks.length - 1; i >= 0 && remaining > 0; i--) {
            const block = this.blocks[i];
            const needed = block.currentLength - block.energy;
            const refillToBlock = Math.min(remaining, needed);
            block.energy += refillToBlock;
            remaining -= refillToBlock;
        }
        
        return amount - remaining;
    }
    
    /**
     * Take damage - reduces block length (capacity)
     * Damage reduces length starting from top block
     */
    takeDamage(damage) {
        let remaining = damage;
        for (let i = 0; i < this.blocks.length && remaining > 0; i++) {
            const block = this.blocks[i];
            const damageToBlock = Math.min(remaining, block.currentLength);
            block.currentLength -= damageToBlock;
            // If block length reduced, also reduce energy if it exceeds new capacity
            if (block.energy > block.currentLength) {
                block.energy = block.currentLength;
            }
            remaining -= damageToBlock;
        }
    }
    
    /**
     * Get damage state for visual effects
     * Returns percentage of original capacity remaining
     */
    getDamageState() {
        const totalOriginal = this.blocks.reduce((sum, block) => sum + block.maxLength, 0);
        const totalCurrent = this.getTotalCapacity();
        if (totalOriginal === 0) return 1.0;
        return totalCurrent / totalOriginal;
    }
    
    /**
     * Check if ship is helpless (0 energy)
     */
    isHelpless() {
        return this.getTotalEnergy() <= 0;
    }
    
    /**
     * Check if ship is destroyed (0 block length)
     */
    isDestroyed() {
        return this.getTotalCapacity() <= 0;
    }
    
    /**
     * Update energy system
     */
    update(deltaTime) {
        // Energy updates happen externally based on throttle/actions
        // This method can be used for passive effects if needed
    }
    
    /**
     * Get block data for HUD rendering
     */
    getBlockData() {
        return this.blocks.map(block => ({
            maxLength: block.maxLength,
            currentLength: block.currentLength,
            energy: block.energy,
            energyPercent: block.currentLength > 0 ? block.energy / block.currentLength : 0
        }));
    }
}


