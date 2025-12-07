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

        // Generate content
        const content = document.getElementById('library-faction-content');
        content.innerHTML = this.generateFactionHTML(faction);
    }

    generateFactionHTML(faction) {
        let html = `
            <div class="faction-content active">
                <h2 class="faction-title" style="color: ${faction.color}">${faction.name}</h2>
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

    showLibrary() {
        const libraryScreen = document.getElementById('library-screen');
        const mainMenu = document.getElementById('main-menu');
        if (libraryScreen) {
            // Hide main menu and show library
            if (mainMenu) {
                mainMenu.classList.add('hidden');
            }
            libraryScreen.classList.remove('hidden');
            // Show first faction by default
            this.showFaction('federation');
        }
    }

    hideLibrary() {
        const libraryScreen = document.getElementById('library-screen');
        const mainMenu = document.getElementById('main-menu');
        if (libraryScreen) {
            libraryScreen.classList.add('hidden');
            // Show main menu again when closing library
            if (mainMenu) {
                mainMenu.classList.remove('hidden');
            }
        }
    }
}

