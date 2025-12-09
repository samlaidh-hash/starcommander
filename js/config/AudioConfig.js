// Simple audio mapping for game sounds
// RESTORED: 2025-10-27 TIER 3 Issue #11 - Audio system enabled with existing files
const AUDIO_CONFIG = {
    enabled: true, // ENABLED - mapped to existing audio files
    volumeMaster: 0.8,
    sounds: {
        // Beam weapons - using existing beam files
        'beam-fire':      { src: 'ASSETS/AUDIO/beam-fire.mp3', volume: 0.6 },
        'beam-hit':       { src: 'ASSETS/AUDIO/Fed-Beam.mp3', volume: 0.4 },
        'fed-beam':       { src: 'ASSETS/AUDIO/Fed-Beam.mp3', volume: 0.6 },
        'streak-beam':    { src: 'ASSETS/AUDIO/streak-beam.wav', volume: 0.6 },
        'disruptor-fire': { src: 'ASSETS/AUDIO/disruptor-fire.mp3', volume: 0.6 },
        'gatling-beam':   { src: 'ASSETS/AUDIO/gatling-beamer.wav', volume: 0.5 },

        // Torpedoes - using existing torpedo files
        'torpedo-fire':   { src: 'ASSETS/AUDIO/torpedo_fire.mp3', volume: 0.7 },
        'torpedo-explosion': { src: 'ASSETS/AUDIO/torpedo-explosion.mp3', volume: 0.8 },
        'pirate-torpedo': { src: 'ASSETS/AUDIO/pirate_torpedo.mp3', volume: 0.7 },

        // Plasma weapons
        'plasma-fire':    { src: 'ASSETS/AUDIO/plasma-fire.mp3', volume: 0.7 },
        'plasma-explosion': { src: 'ASSETS/AUDIO/torpedo-explosion.mp3', volume: 0.7 }, // Reuse torpedo explosion

        // Explosions - reuse torpedo explosion for all
        'explosion-small':  { src: 'ASSETS/AUDIO/torpedo-explosion.mp3', volume: 0.6 },
        'explosion-medium': { src: 'ASSETS/AUDIO/torpedo-explosion.mp3', volume: 0.75 },
        'explosion-large':  { src: 'ASSETS/AUDIO/torpedo-explosion.mp3', volume: 0.9 },

        // Damage sounds
        'shield-hit':     { src: 'ASSETS/AUDIO/shield-hit.mp3', volume: 0.6 },
        'hull-breach':    { src: 'ASSETS/AUDIO/hull-hit.wav', volume: 0.7 },
        'hull-hit':       { src: 'ASSETS/AUDIO/hull-hit.wav', volume: 0.6 },

        // Support systems
        'tractor-beam':   { src: 'ASSETS/AUDIO/tractor_beam.mp3', volume: 0.6 },
        'transporter':    { src: 'ASSETS/AUDIO/transporter.mp3', volume: 0.7 },
        'trigon-boarding': { src: 'ASSETS/AUDIO/trigon-boarding.mp3', volume: 0.7 },

        // Cloaking (if implemented)
        'cloak-on':       { src: 'ASSETS/AUDIO/cloak-on.wav', volume: 0.7 },
        'cloak-off':      { src: 'ASSETS/AUDIO/cloak-off.wav', volume: 0.7 },

        // UI sounds
        'objective-complete': { src: 'ASSETS/AUDIO/objective-complete.wav', volume: 0.8 },
        'lock-acquired':  { src: 'ASSETS/AUDIO/objective-complete.wav', volume: 0.7 }, // Reuse objective sound

        // Craft launches - reuse transporter sound
        'shuttle-launch': { src: 'ASSETS/AUDIO/transporter.mp3', volume: 0.6 },
        'fighter-launch': { src: 'ASSETS/AUDIO/transporter.mp3', volume: 0.6 },
        'bomber-launch':  { src: 'ASSETS/AUDIO/transporter.mp3', volume: 0.6 },

        // Boost - reuse beam sound
        'boost':          { src: 'ASSETS/AUDIO/streak-beam.wav', volume: 0.4 },

        // System damage - reuse hull hit
        'system-damage':  { src: 'ASSETS/AUDIO/hull-hit.wav', volume: 0.5 }

        // Note: alert-warning, decoy-deploy, mine-deploy files missing - events will be silent
    }
};