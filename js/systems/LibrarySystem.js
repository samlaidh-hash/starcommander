/**
 * Star Sea - Library System
 * Displays faction information, ships, and special abilities
 */

class LibrarySystem {
    constructor() {
        this.factionData = this.initializeFactionData();
        this.setupEventListeners();
    }

    initializeFactionData() {
        return {
            federation: {
                name: 'FEDERATION',
                color: '#00aaff',
                background: 'The United Federation of Planets was founded in 2161, uniting Earth, Vulcan, Andoria, and Tellar in a common cause. Federation ships embody the principles of exploration, diplomacy, and defense. Their technology emphasizes reliability and versatility over specialization, making Federation vessels adaptable to any situation.',
                description: 'The United Federation represents the standard of spacefaring civilization. Federation ships are well-balanced, reliable vessels equipped with continuous beam weapons and dual torpedo launchers. They excel in sustained combat and tactical flexibility.',
                shipClasses: {
                    DD: {
                        name: 'Destroyer',
                        weapons: [
                            'Forward Beam Battery (270° arc)',
                            'Dual Torpedo Launcher (3 loaded, 30 stored)'
                        ],
                        special: 'Dual 90-degree torpedo arcs (forward and aft) with improved durability.'
                    },
                    CL: {
                        name: 'Light Cruiser',
                        weapons: [
                            'Forward Beam Battery (270° arc)',
                            'Dual Torpedo Launcher (4 loaded, 40 stored)'
                        ],
                        special: 'Dual 90-degree torpedo arcs with cruiser endurance.'
                    },
                    CA: {
                        name: 'Heavy Cruiser',
                        weapons: [
                            'Forward Beam Battery (270° arc)',
                            'Aft Beam Battery (270° arc)',
                            'Dual Torpedo Launcher (5 loaded, 50 stored)'
                        ],
                        special: 'Dual 90-degree torpedo arcs and flagship-grade systems.'
                    },
                    BB: {
                        name: 'Battle Cruiser',
                        weapons: [
                            'Port Forward Beam Array (270° arc)',
                            'Starboard Forward Beam Array (270° arc)',
                            'Aft Beam Array (270° arc)',
                            'Dual Torpedo Launcher (7 loaded, 70 stored)'
                        ],
                        special: 'Multiple beam arrays and heavy torpedo complement.'
                    }
                },
                specialAbilities: [
                    {
                        name: 'Continuous Beam Weapons',
                        description: 'Beam weapons can fire continuously, draining energy while active. Maximum 5 seconds firing duration with cooldown equal to fire duration.'
                    },
                    {
                        name: 'Dual Torpedo Arcs',
                        description: 'Torpedo launchers can fire both forward and aft, providing tactical flexibility in combat.'
                    }
                ]
            },
            trigon: {
                name: 'TRIGON EMPIRE',
                color: '#ff4400',
                background: 'The Trigon Empire is a militaristic power that values honor and combat prowess above all else. Their society is built on a warrior caste system, and their ships reflect this philosophy with aggressive designs and forward-mounted weaponry. Trigon vessels prioritize speed and firepower over defensive capabilities.',
                description: 'The Trigon Empire favors aggressive, close-range combat. Their ships are equipped with powerful disruptor weapons mounted on wing positions, designed for devastating forward assaults.',
                shipClasses: {
                    DD: {
                        name: 'Destroyer',
                        weapons: [
                            'Port Wing Disruptor (120° arc)',
                            'Starboard Wing Disruptor (120° arc)'
                        ],
                        special: 'Wing-mounted disruptors for aggressive forward attacks.'
                    },
                    CL: {
                        name: 'Light Cruiser',
                        weapons: [
                            'Port Wing Disruptor (120° arc)',
                            'Starboard Wing Disruptor (120° arc)'
                        ],
                        special: 'Enhanced disruptor arrays with improved range.'
                    },
                    CA: {
                        name: 'Heavy Cruiser',
                        weapons: [
                            'Nose Disruptor Cannon (120° arc)',
                            'Port Wing Disruptor (120° arc)',
                            'Starboard Wing Disruptor (120° arc)'
                        ],
                        special: 'Triple disruptor configuration for maximum firepower.'
                    },
                    BB: {
                        name: 'Battle Cruiser',
                        weapons: [
                            'Nose Disruptor Cannon (120° arc)',
                            'Port Wing Forward Disruptor (120° arc)',
                            'Starboard Wing Forward Disruptor (120° arc)',
                            'Port Wing Aft Disruptor (120° arc)',
                            'Starboard Wing Aft Disruptor (120° arc)'
                        ],
                        special: 'Five disruptor mounts providing comprehensive coverage.'
                    }
                },
                specialAbilities: [
                    {
                        name: 'Disruptor Weapons',
                        description: 'High-damage disruptor weapons with narrow firing arcs, optimized for forward assaults.'
                    },
                    {
                        name: 'Wing-Mounted Design',
                        description: 'Weapons are positioned on ship wings, providing unique firing angles and tactical positioning.'
                    }
                ]
            },
            scintilian: {
                name: 'SCINTILIAN COALITION',
                color: '#ffaa00',
                background: 'The Scintilian Coalition represents a union of species that have mastered biological and energy-based technologies. Their ships feature organic, flowing designs that integrate living components with advanced technology. Scintilian vessels are known for their rapid-fire pulse weapons and devastating plasma torpedoes.',
                description: 'The Scintilian Coalition employs advanced pulse beam technology and plasma torpedoes. Their ships feature distinctive organic designs with head-mounted pulse beams and neck-mounted plasma launchers.',
                shipClasses: {
                    DD: {
                        name: 'Destroyer',
                        weapons: [
                            'Head Pulse Beam (270° arc, 0.5s cooldown)',
                            'Neck Plasma Launcher (90° arc)'
                        ],
                        special: 'Rapid-fire pulse beams with plasma support.'
                    },
                    CL: {
                        name: 'Light Cruiser',
                        weapons: [
                            'Head Pulse Beam (270° arc, 0.5s cooldown)',
                            'Neck Plasma Launcher (90° arc)',
                            'Aft Plasma Launcher (90° arc)'
                        ],
                        special: 'Dual plasma launchers for forward and aft coverage.'
                    },
                    CA: {
                        name: 'Heavy Cruiser',
                        weapons: [
                            'Head Pulse Beam (270° arc, 0.5s cooldown)',
                            'Port Wing Pulse Beam (270° arc, 0.5s cooldown)',
                            'Starboard Wing Pulse Beam (270° arc, 0.5s cooldown)',
                            'Neck Plasma Launcher (90° arc)'
                        ],
                        special: 'Triple pulse beam configuration with plasma support.'
                    },
                    BB: {
                        name: 'Battle Cruiser',
                        weapons: [
                            'Head Pulse Beam (270° arc, 0.5s cooldown)',
                            'Port Wing Outer Pulse Beam (270° arc, 0.5s cooldown)',
                            'Starboard Wing Outer Pulse Beam (270° arc, 0.5s cooldown)',
                            'Port Wing Inner Pulse Beam (270° arc, 0.5s cooldown)',
                            'Starboard Wing Inner Pulse Beam (270° arc, 0.5s cooldown)',
                            'Neck Plasma Launcher (90° arc)',
                            'Center Aft Plasma Launcher (90° arc)'
                        ],
                        special: 'Five pulse beams and dual plasma launchers for overwhelming firepower.'
                    }
                },
                specialAbilities: [
                    {
                        name: 'Pulse Beam Technology',
                        description: 'Rapid-fire pulse beams with 0.5 second cooldown, providing sustained damage output.'
                    },
                    {
                        name: 'Plasma Torpedoes',
                        description: 'High-damage plasma torpedoes with homing capabilities and area effect damage.'
                    }
                ]
            },
            dhojan: {
                name: 'DHOJAN',
                color: '#aa00aa',
                background: 'The Dhojan are a mysterious, highly advanced civilization that has mastered quantum physics and energy manipulation. Their technology operates on principles that other factions barely understand. Dhojan ships can phase through space, redirect energy attacks, and employ weapons that ignore conventional defenses.',
                description: 'The Dhojan are an advanced faction with quantum technology and energy manipulation systems. Their ships feature quantum drives for instant teleportation, energy shields that redirect damage, and advanced sensor arrays.',
                shipClasses: {
                    DD: {
                        name: 'Destroyer',
                        weapons: [
                            'Quantum Torpedo (shield penetration, 300 range)',
                            'Disruptor Beam (shield drain, 150 range)',
                            'Plasma Cannon (area damage, 200 range)'
                        ],
                        special: 'Advanced quantum and energy weapons.'
                    },
                    CL: {
                        name: 'Light Cruiser',
                        weapons: [
                            'Quantum Torpedo (shield penetration, 300 range)',
                            'Disruptor Beam (shield drain, 150 range)',
                            'Plasma Cannon (area damage, 200 range)'
                        ],
                        special: 'Enhanced quantum systems with improved range.'
                    },
                    CA: {
                        name: 'Heavy Cruiser',
                        weapons: [
                            'Quantum Torpedo (shield penetration, 300 range)',
                            'Disruptor Beam (shield drain, 150 range)',
                            'Plasma Cannon (area damage, 200 range)'
                        ],
                        special: 'Heavy quantum weapon arrays.'
                    },
                    BB: {
                        name: 'Battle Cruiser',
                        weapons: [
                            'Quantum Torpedo (shield penetration, 300 range)',
                            'Disruptor Beam (shield drain, 150 range)',
                            'Plasma Cannon (area damage, 200 range)'
                        ],
                        special: 'Maximum quantum firepower and system redundancy.'
                    }
                },
                specialAbilities: [
                    {
                        name: 'Quantum Drive',
                        description: 'Instant teleportation to any location within 300 range. 30 second cooldown. Allows tactical repositioning and escape from dangerous situations.'
                    },
                    {
                        name: 'Energy Shield',
                        description: 'Absorbs 30% of incoming damage and redirects 150% of absorbed damage to the nearest enemy within 100 range. Provides both defense and counter-attack capability.'
                    },
                    {
                        name: 'Advanced Sensors',
                        description: 'Extended sensor range (400), 20% accuracy bonus, and can detect cloaked ships. Provides superior battlefield awareness.'
                    },
                    {
                        name: 'Quantum Torpedo',
                        description: 'Torpedoes that phase through shields, ignoring shield protection entirely. 5 second cooldown.'
                    },
                    {
                        name: 'Disruptor Beam',
                        description: 'Beam weapon that drains 0.5 shield per second in addition to damage. 2 second cooldown.'
                    },
                    {
                        name: 'Plasma Cannon',
                        description: 'Area damage weapon with 50 blast radius. 8 second cooldown.'
                    }
                ]
            },
            commonwealth: {
                name: 'COMMONWEALTH',
                color: '#00aa00',
                background: 'The Commonwealth is a defensive alliance of worlds that prioritize protection and stability. Their technology focuses on laser-based systems that excel at both offense and defense. Commonwealth ships are known for their ability to reflect incoming beam attacks and their precision targeting systems.',
                description: 'The Commonwealth specializes in laser-based weaponry and defensive systems. Their ships feature laser batteries, laser shields that reflect beam weapons, and advanced targeting systems.',
                shipClasses: {
                    DD: {
                        name: 'Destroyer',
                        weapons: [
                            'Laser Cannon (continuous fire, 250 range)',
                            'Laser Torpedo (shield penetration, 300 range)',
                            'Laser Beam Array (5 beams, 30° spread, 200 range)'
                        ],
                        special: 'Laser weapon systems with shield penetration.'
                    },
                    CL: {
                        name: 'Light Cruiser',
                        weapons: [
                            'Laser Cannon (continuous fire, 250 range)',
                            'Laser Torpedo (shield penetration, 300 range)',
                            'Laser Beam Array (5 beams, 30° spread, 200 range)'
                        ],
                        special: 'Enhanced laser arrays with improved range.'
                    },
                    CA: {
                        name: 'Heavy Cruiser',
                        weapons: [
                            'Laser Cannon (continuous fire, 250 range)',
                            'Laser Torpedo (shield penetration, 300 range)',
                            'Laser Beam Array (5 beams, 30° spread, 200 range)'
                        ],
                        special: 'Heavy laser weapon systems.'
                    },
                    BB: {
                        name: 'Battle Cruiser',
                        weapons: [
                            'Laser Cannon (continuous fire, 250 range)',
                            'Laser Torpedo (shield penetration, 300 range)',
                            'Laser Beam Array (5 beams, 30° spread, 200 range)'
                        ],
                        special: 'Maximum laser firepower and system redundancy.'
                    }
                },
                specialAbilities: [
                    {
                        name: 'Laser Shield',
                        description: '60% chance to reflect beam weapons back at enemies. Reflected damage is 50% of original. Provides powerful defensive capability against beam-focused enemies.'
                    },
                    {
                        name: 'Laser Targeting System',
                        description: '30% accuracy bonus and 20% range bonus for all laser weapons. Provides superior combat effectiveness.'
                    },
                    {
                        name: 'Laser Battery',
                        description: '10 firing points with 0.2 second shot interval. 4 second recharge time. Provides sustained firepower.'
                    },
                    {
                        name: 'Laser Torpedo',
                        description: 'Torpedoes that penetrate shields, ignoring shield protection. 4 second cooldown.'
                    },
                    {
                        name: 'Laser Beam Array',
                        description: 'Fires 5 beams in a 30-degree spread pattern. 6 second cooldown. Excellent for area coverage.'
                    }
                ]
            },
            andromedan: {
                name: 'ANDROMEDAN',
                color: '#00aaff',
                background: 'The Andromedans are enigmatic beings from the Andromeda Galaxy who have perfected stealth and phase-shifting technologies. Their ships can become completely invisible, phase through matter, and employ weapons that bypass all conventional defenses. Andromedan tactics emphasize surprise and surgical strikes.',
                description: 'The Andromedans are masters of stealth and phase technology. Their ships can cloak, phase shift for temporary invulnerability, and employ phase weapons that ignore shields and hull.',
                shipClasses: {
                    DD: {
                        name: 'Destroyer',
                        weapons: [
                            'Phase Torpedo (shield & hull penetration, 350 range)',
                            'Disruptor Pulse (area effect, 60 radius, 180 range)',
                            'Phase Beam (shield penetration, 220 range)'
                        ],
                        special: 'Phase weapons and stealth systems.'
                    },
                    CL: {
                        name: 'Light Cruiser',
                        weapons: [
                            'Phase Torpedo (shield & hull penetration, 350 range)',
                            'Disruptor Pulse (area effect, 60 radius, 180 range)',
                            'Phase Beam (shield penetration, 220 range)'
                        ],
                        special: 'Enhanced phase systems with improved range.'
                    },
                    CA: {
                        name: 'Heavy Cruiser',
                        weapons: [
                            'Phase Torpedo (shield & hull penetration, 350 range)',
                            'Disruptor Pulse (area effect, 60 radius, 180 range)',
                            'Phase Beam (shield penetration, 220 range)'
                        ],
                        special: 'Heavy phase weapon arrays.'
                    },
                    BB: {
                        name: 'Battle Cruiser',
                        weapons: [
                            'Phase Torpedo (shield & hull penetration, 350 range)',
                            'Disruptor Pulse (area effect, 60 radius, 180 range)',
                            'Phase Beam (shield penetration, 220 range)'
                        ],
                        special: 'Maximum phase firepower and system redundancy.'
                    }
                },
                specialAbilities: [
                    {
                        name: 'Cloaking Device',
                        description: 'Renders ship invisible to enemies. Drains 0.5 energy per second while active. 10 second cooldown after deactivating. Allows stealthy movement and surprise attacks.'
                    },
                    {
                        name: 'Phase Shift',
                        description: 'Makes ship completely invulnerable for 2 seconds. 30 second cooldown. Perfect for escaping dangerous situations or tanking heavy damage.'
                    },
                    {
                        name: 'Sensor Jammer',
                        description: 'Reduces enemy accuracy by 70% within 200 range. Provides defensive advantage in close combat.'
                    },
                    {
                        name: 'Phase Torpedo',
                        description: 'Torpedoes that phase through both shields and hull, dealing damage directly. 6 second cooldown.'
                    },
                    {
                        name: 'Disruptor Pulse',
                        description: 'Area effect weapon with 60 blast radius. 4 second cooldown.'
                    },
                    {
                        name: 'Phase Beam',
                        description: 'Beam weapon that ignores shields. 3 second cooldown.'
                    }
                ]
            },
            pirate: {
                name: 'PIRATE CLANS',
                color: '#ff0000',
                background: 'The Pirate Clans are loose confederations of raiders, smugglers, and outcasts who operate outside the law. Their ships are cobbled together from salvaged military vessels and modified civilian craft. Pirates favor hit-and-run tactics and unpredictable weapon combinations that make them dangerous despite their lack of standardization.',
                description: 'Pirate ships are modified civilian vessels and captured military ships. They employ mixed weapon systems and unconventional tactics, making them unpredictable opponents.',
                shipClasses: {
                    DD: {
                        name: 'Destroyer',
                        weapons: [
                            'Mixed weapon loadouts',
                            'Variable torpedo configurations'
                        ],
                        special: 'Unpredictable weapon combinations.'
                    },
                    CL: {
                        name: 'Light Cruiser',
                        weapons: [
                            'Mixed weapon loadouts',
                            'Variable torpedo configurations'
                        ],
                        special: 'Enhanced mixed weapon systems.'
                    },
                    CA: {
                        name: 'Heavy Cruiser',
                        weapons: [
                            'Mixed weapon loadouts',
                            'Variable torpedo configurations'
                        ],
                        special: 'Heavy mixed weapon arrays.'
                    },
                    BB: {
                        name: 'Battle Cruiser',
                        weapons: [
                            'Mixed weapon loadouts',
                            'Variable torpedo configurations'
                        ],
                        special: 'Maximum mixed firepower.'
                    }
                },
                specialAbilities: [
                    {
                        name: 'Unpredictable Loadouts',
                        description: 'Pirate ships can have various weapon combinations, making them difficult to counter.'
                    },
                    {
                        name: 'Hit-and-Run Tactics',
                        description: 'Pirates favor quick strikes and rapid disengagement.'
                    }
                ]
            },
            'ship-systems': {
                name: 'SHIP SYSTEMS',
                color: '#0f0',
                description: 'All ships contain various internal systems that can be damaged in combat. System damage affects ship performance.',
                systems: [
                    {
                        name: 'Impulse Engines',
                        description: 'Controls ship movement speed and acceleration. When damaged, maximum speed and acceleration are reduced proportionally. Destroyed systems reduce speed to 50% of normal.',
                        effects: 'Affects MAX_SPEED and ACCELERATION multipliers'
                    },
                    {
                        name: 'Warp Nacelles',
                        description: 'Enables tactical warp jumps and affects warp charge rate. Damaged nacelles reduce warp charge speed. Destroyed nacelles prevent tactical warp entirely.',
                        effects: 'Affects WARP_CHARGE_RATE multiplier'
                    },
                    {
                        name: 'Sensor Array',
                        description: 'Provides detection range and targeting accuracy. Damaged sensors reduce detection radius and increase weapon spread. Destroyed sensors reduce detection to 50% and add significant spread.',
                        effects: 'Affects DETECTION_RADIUS and weapon accuracy'
                    },
                    {
                        name: 'Command & Control (C&C)',
                        description: 'Coordinates ship operations. Damaged C&C can cause control glitches (random movements). Destroyed C&C causes frequent control malfunctions.',
                        effects: 'Can cause random control glitches when damaged'
                    },
                    {
                        name: 'Weapons Bay',
                        description: 'Stores torpedoes, mines, decoys, shuttles, fighters, and other deployables. Damaged bays reduce reload speed. Destroyed bays prevent reloading entirely.',
                        effects: 'Affects torpedo/mine/deployable reload speed'
                    },
                    {
                        name: 'Main Power',
                        description: 'CRITICAL SYSTEM - Powers all ship systems. Destroyed power core causes ship destruction. Damaged power reduces efficiency of all systems.',
                        effects: 'Affects all systems - ship destroyed if destroyed'
                    },
                    {
                        name: 'Shield Generator',
                        description: 'Generates and maintains shield protection. Damaged generators reduce shield strength and recovery rate. Destroyed generators disable shields completely.',
                        effects: 'Affects shield strength and recovery rate'
                    },
                    {
                        name: 'Hull',
                        description: 'Ship structural integrity. Hull damage occurs when shields are down or when taking overflow damage. Hull at 0 HP destroys the ship.',
                        effects: 'Ship destroyed at 0 HP'
                    }
                ]
            },
            'weapons': {
                name: 'WEAPONS',
                color: '#ff6600',
                description: 'Various weapon types available across different factions.',
                weaponTypes: [
                    {
                        name: 'Continuous Beam',
                        faction: 'Federation',
                        description: 'Beam weapons that can fire continuously for up to 5 seconds, draining energy while active. Cooldown equals fire duration. High sustained damage.',
                        stats: 'Damage: 1 per hit, Range: 500px, Arc: 270°'
                    },
                    {
                        name: 'Disruptor',
                        faction: 'Trigon',
                        description: 'High-damage energy weapons with narrow firing arcs. Optimized for forward assaults. Faster projectile speed than beams.',
                        stats: 'Damage: 2 per hit, Range: 500px, Arc: 120°, Speed: 975px/s'
                    },
                    {
                        name: 'Pulse Beam',
                        faction: 'Scintilian',
                        description: 'Rapid-fire beam weapons with 0.5 second cooldown. Provides sustained damage output with quick firing cycles.',
                        stats: 'Damage: 0.5 per hit, Range: 500px, Arc: 270°, Cooldown: 0.5s'
                    },
                    {
                        name: 'Torpedo',
                        faction: 'Federation, Pirate',
                        description: 'Guided projectiles with homing capability when locked onto targets. High damage, slow speed. Can be fired forward or aft.',
                        stats: 'Damage: 8 per hit, Range: 500px, Speed: 487px/s, Blast Radius: 18px'
                    },
                    {
                        name: 'Plasma Torpedo',
                        faction: 'Scintilian',
                        description: 'High-damage plasma torpedoes with homing capabilities and area effect damage. More powerful than standard torpedoes.',
                        stats: 'Damage: 10 per hit, Range: 500px, Area Effect: Yes'
                    },
                    {
                        name: 'Quantum Torpedo',
                        faction: 'Dhojan',
                        description: 'Torpedoes that phase through shields, ignoring shield protection entirely. Bypasses defensive systems.',
                        stats: 'Damage: 8 per hit, Range: 300px, Shield Penetration: Yes'
                    },
                    {
                        name: 'Phase Torpedo',
                        faction: 'Andromedan',
                        description: 'Torpedoes that phase through both shields and hull, dealing damage directly to internal systems.',
                        stats: 'Damage: 8 per hit, Range: 350px, Shield & Hull Penetration: Yes'
                    },
                    {
                        name: 'Laser Battery',
                        faction: 'Commonwealth',
                        description: 'Multiple firing points with rapid shot intervals. Provides sustained firepower with 10 firing points.',
                        stats: 'Damage: 1 per hit, Range: 250px, Shot Interval: 0.2s, Firing Points: 10'
                    }
                ]
            },
            'consumables': {
                name: 'CONSUMABLES',
                color: '#00ffff',
                description: 'Mission loadout items that can be used during combat. Activated via F1-F6 hotkeys.',
                consumables: [
                    {
                        name: 'Extra Torpedoes (F1)',
                        description: 'Adds +10 torpedoes to storage capacity. Instant effect. Useful for extended engagements.',
                        effect: '+10 torpedo storage'
                    },
                    {
                        name: 'Extra Decoys (F2)',
                        description: 'Adds +3 decoy countermeasures. Decoys confuse enemy targeting systems.',
                        effect: '+3 decoys'
                    },
                    {
                        name: 'Extra Mines (F3)',
                        description: 'Adds +3 mines to bay storage. Mines deploy behind ship and detonate on contact.',
                        effect: '+3 mines'
                    },
                    {
                        name: 'Hull Repair Kit (F5)',
                        description: 'Instantly repairs +50 hull points. Critical for survival in extended combat.',
                        effect: '+50 HP instant heal'
                    },
                    {
                        name: 'Energy Cells (F6)',
                        description: 'Increases weapon damage by +20% for 60 seconds. Provides temporary combat boost.',
                        effect: '+20% weapon damage for 60 seconds'
                    }
                ]
            }
        };
    }

    setupEventListeners() {
        // Faction tab switching
        document.querySelectorAll('.faction-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const faction = tab.dataset.faction;
                this.showFaction(faction);
            });
        });

        // Close button
        const closeBtn = document.getElementById('btn-library-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideLibrary();
            });
        }
    }

    showFaction(factionKey) {
        // Update active tab
        document.querySelectorAll('.faction-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.faction === factionKey) {
                tab.classList.add('active');
            }
        });

        // Get faction data
        const faction = this.factionData[factionKey];
        if (!faction) return;

        // Generate content based on type
        const content = document.getElementById('library-faction-content');
        if (factionKey === 'ship-systems') {
            content.innerHTML = this.generateSystemsHTML(faction);
        } else if (factionKey === 'weapons') {
            content.innerHTML = this.generateWeaponsHTML(faction);
        } else if (factionKey === 'consumables') {
            content.innerHTML = this.generateConsumablesHTML(faction);
        } else {
            content.innerHTML = this.generateFactionHTML(faction);
        }
    }

    generateFactionHTML(faction) {
        let html = `
            <div class="faction-content active">
                <h2 class="faction-title" style="color: ${faction.color}">${faction.name}</h2>
                ${faction.background ? `<div class="faction-background">${faction.background}</div>` : ''}
                <div class="faction-description">${faction.description}</div>
                <div class="faction-sections">
                    <div class="faction-section">
                        <h3>Ship Classes</h3>
                        <div class="ship-class-list">
        `;

        // Ship classes
        for (const [classKey, classData] of Object.entries(faction.shipClasses)) {
            html += `
                <div class="ship-class-item">
                    <h4>${classData.name} (${classKey})</h4>
                    <p><strong>Weapons:</strong></p>
                    <ul class="ability-list">
            `;
            classData.weapons.forEach(weapon => {
                html += `<li>${weapon}</li>`;
            });
            html += `
                    </ul>
                    <p><strong>Special:</strong> ${classData.special}</p>
                </div>
            `;
        }

        html += `
                        </div>
                    </div>
                    <div class="faction-section">
                        <h3>Special Abilities & Systems</h3>
                        <ul class="ability-list">
        `;

        // Special abilities
        faction.specialAbilities.forEach(ability => {
            html += `
                <li>
                    <strong>${ability.name}</strong>
                    ${ability.description}
                </li>
            `;
        });

        html += `
                        </ul>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateSystemsHTML(data) {
        let html = `
            <div class="faction-content active">
                <h2 class="faction-title" style="color: ${data.color}">${data.name}</h2>
                <div class="faction-description">${data.description}</div>
                <div class="faction-sections">
                    <div class="faction-section">
                        <h3>Internal Systems</h3>
                        <div class="ship-class-list">
        `;

        data.systems.forEach(system => {
            html += `
                <div class="ship-class-item">
                    <h4>${system.name}</h4>
                    <p>${system.description}</p>
                    <p><strong>Effects:</strong> ${system.effects}</p>
                </div>
            `;
        });

        html += `
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateWeaponsHTML(data) {
        let html = `
            <div class="faction-content active">
                <h2 class="faction-title" style="color: ${data.color}">${data.name}</h2>
                <div class="faction-description">${data.description}</div>
                <div class="faction-sections">
                    <div class="faction-section">
                        <h3>Weapon Types</h3>
                        <div class="ship-class-list">
        `;

        data.weaponTypes.forEach(weapon => {
            html += `
                <div class="ship-class-item">
                    <h4>${weapon.name} <span style="color: #888; font-size: 14px;">(${weapon.faction})</span></h4>
                    <p>${weapon.description}</p>
                    <p><strong>Stats:</strong> ${weapon.stats}</p>
                </div>
            `;
        });

        html += `
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateConsumablesHTML(data) {
        let html = `
            <div class="faction-content active">
                <h2 class="faction-title" style="color: ${data.color}">${data.name}</h2>
                <div class="faction-description">${data.description}</div>
                <div class="faction-sections">
                    <div class="faction-section">
                        <h3>Available Consumables</h3>
                        <div class="ship-class-list">
        `;

        data.consumables.forEach(consumable => {
            html += `
                <div class="ship-class-item">
                    <h4>${consumable.name}</h4>
                    <p>${consumable.description}</p>
                    <p><strong>Effect:</strong> ${consumable.effect}</p>
                </div>
            `;
        });

        html += `
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    showLibrary() {
        const libraryScreen = document.getElementById('library-screen');
        if (libraryScreen) {
            libraryScreen.classList.remove('hidden');
            // Show first faction by default
            this.showFaction('federation');
        }
    }

    hideLibrary() {
        const libraryScreen = document.getElementById('library-screen');
        if (libraryScreen) {
            libraryScreen.classList.add('hidden');
        }
    }
}

