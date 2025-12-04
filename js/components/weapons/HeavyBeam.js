/**
 * Star Sea - Heavy Beam Weapon Component
 * Fires continuous heavy beam for up to 5 seconds, DYNAMIC cooldown = firing duration
 * Damage: 2 per 0.5 seconds on target (4 DPS) - twice the damage of standard beam
 * Energy: 16 per second while firing - twice the energy drain
 * Range: 1.5x the range of standard beam
 *
 * DYNAMIC COOLDOWN: Cooldown time equals how long you fired
 * - Fire 1 sec = 1 sec cooldown
 * - Fire 5 sec = 5 sec cooldown
 *
 * FIXED START POINT: The beam originates from a fixed point on the weapon arc
 * (calculated when LMB is first pressed) and the endpoint follows the reticle.
 */

class HeavyBeam extends ContinuousBeam {
    constructor(config) {
        super(config);
        // Override values for heavy beam: 2x damage, 2x energy, 1.5x range
        this.damagePerSecond = 4; // 4 DPS (2 damage per 0.5s) - twice standard beam
        this.damage = config.damage || (CONFIG.BEAM_DAMAGE * 2); // 2 damage per beam hit (twice standard)
        this.energyDrainRate = 4.8; // Energy per second while firing (reduced 70% from 16)
        // Range is 1.5x standard beam range
        this.range = config.range || (CONFIG.BEAM_RANGE_PIXELS * 1.5);
    }
}

