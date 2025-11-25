/**
 * Star Sea - Mission UI Handler
 * Manages briefing and debriefing screens
 */

class MissionUI {
    constructor() {
        this.briefingScreen = document.getElementById('briefing-screen');
        this.debriefingScreen = document.getElementById('debriefing-screen');
        this.currentMission = null;
        this.playerShip = null;

        // Loadout system for consumables (all 11 types)
        this.loadout = {
            hullRepairKit: 0,
            energyCells: 0,
            extraTorpedoes: 0,
            extraDecoys: 0,
            extraMines: 0,
            shieldBoost: 0,
            extraShuttles: 0,
            extraFighters: 0,
            extraBombers: 0,
            extraDrones: 0,
            extraProbes: 0
        };
        this.bayMax = 10; // Default, will be updated from ship class

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Briefing screen buttons
        const acceptBtn = document.getElementById('btn-accept-mission');
        const declineBtn = document.getElementById('btn-decline-mission');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.onAcceptMission());
        }
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.onDeclineMission());
        }

        // Debriefing screen buttons
        const nextMissionBtn = document.getElementById('btn-next-mission');
        const returnBaseBtn = document.getElementById('btn-return-base');

        if (nextMissionBtn) {
            nextMissionBtn.addEventListener('click', () => this.onNextMission());
        }
        if (returnBaseBtn) {
            returnBaseBtn.addEventListener('click', () => this.onReturnToBase());
        }
    }

    /**
     * Show mission briefing
     * @param {Object} mission - Mission data from MISSIONS
     * @param {Object} playerShip - Player ship for bay capacity
     */
    showBriefing(mission, playerShip = null) {
        if (!mission || !this.briefingScreen) {
            console.log('MissionUI: Cannot show briefing - mission:', mission, 'screen:', this.briefingScreen);
            return;
        }

        console.log('MissionUI: Showing briefing for mission:', mission.id);
        this.currentMission = mission;
        this.playerShip = playerShip;

        // Populate briefing data
        const titleElement = document.getElementById('briefing-title');
        const sectorElement = document.getElementById('mission-sector');
        const missionNumberElement = document.getElementById('mission-number');
        const subtitleElement = document.getElementById('briefing-subtitle');
        const descriptionElement = document.getElementById('briefing-description');
        const officerElement = document.getElementById('briefing-officer-name');
        const objectivesList = document.getElementById('objectives-list');

        if (titleElement) titleElement.textContent = 'MISSION BRIEFING';
        if (sectorElement) sectorElement.textContent = `Sector: ${mission.sector || 'Unknown'}`;
        if (missionNumberElement) {
            const missionNum = mission.id.replace('mission-', '');
            missionNumberElement.textContent = `Mission ${parseInt(missionNum)}`;
        }
        if (subtitleElement) subtitleElement.textContent = mission.title;
        if (descriptionElement) descriptionElement.textContent = mission.briefing.text;
        if (officerElement) officerElement.textContent = mission.briefing.officer;

        // Populate objectives
        if (objectivesList) {
            objectivesList.innerHTML = '';
            for (const objective of mission.objectives) {
                const li = document.createElement('li');
                li.textContent = objective.description;
                if (objective.primary) {
                    li.classList.add('primary');
                }
                objectivesList.appendChild(li);
            }
        }

        // Setup loadout selection
        this.setupLoadoutSelection();

        // Show the screen
        this.briefingScreen.classList.remove('hidden');
        eventBus.emit('game-paused');
    }

    /**
     * Hide briefing screen
     */
    hideBriefing() {
        if (this.briefingScreen) {
            this.briefingScreen.classList.add('hidden');
        }
    }

    /**
     * Show mission debriefing
     * @param {Object} missionData - Mission result data from MissionManager
     */
    showDebriefing(missionData) {
        if (!missionData || !this.debriefingScreen) return;

        const { mission, result, objectives, time, enemiesDestroyed } = missionData;

        // Populate debriefing data
        const resultElement = document.getElementById('debriefing-result');
        const missionTitleElement = document.getElementById('debriefing-mission-title');
        const descriptionElement = document.getElementById('debriefing-description');
        const objectivesList = document.getElementById('debriefing-objectives-list');

        // Result header
        if (resultElement) {
            resultElement.textContent = result === 'victory' ? 'MISSION COMPLETE - VICTORY' : 'MISSION FAILED';
            resultElement.className = result; // Add victory/defeat class
        }

        // Mission title
        if (missionTitleElement) {
            missionTitleElement.textContent = mission.title;
        }

        // Debriefing text
        if (descriptionElement) {
            const debriefingText = result === 'victory'
                ? mission.debriefing.victory
                : mission.debriefing.defeat;
            descriptionElement.textContent = debriefingText;
        }

        // Statistics
        this.updateDebriefingStats(time, enemiesDestroyed, objectives);

        // Objectives list
        if (objectivesList) {
            objectivesList.innerHTML = '';
            for (const objective of objectives) {
                const li = document.createElement('li');
                li.textContent = objective.description;

                if (objective.primary) {
                    li.classList.add('primary');
                }
                if (objective.completed) {
                    li.classList.add('completed');
                } else if (objective.failed) {
                    li.classList.add('failed');
                }

                objectivesList.appendChild(li);
            }
        }

        // Show/hide next mission button based on result and next mission availability
        const nextMissionBtn = document.getElementById('btn-next-mission');
        if (nextMissionBtn) {
            if (result === 'victory' && mission.nextMission) {
                nextMissionBtn.style.display = 'block';
            } else {
                nextMissionBtn.style.display = 'none';
            }
        }

        // Show the screen
        this.debriefingScreen.classList.remove('hidden');
        eventBus.emit('game-paused');
    }

    /**
     * Update debriefing statistics
     */
    updateDebriefingStats(time, enemiesDestroyed, objectives) {
        // Format time
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const timeElement = document.getElementById('stat-time');
        const enemiesElement = document.getElementById('stat-enemies');
        const objectivesElement = document.getElementById('stat-objectives');

        if (timeElement) timeElement.textContent = timeString;
        if (enemiesElement) enemiesElement.textContent = enemiesDestroyed;

        if (objectivesElement) {
            const completed = objectives.filter(o => o.completed).length;
            const total = objectives.filter(o => o.primary).length;
            objectivesElement.textContent = `${completed}/${total}`;
        }
    }

    /**
     * Hide debriefing screen
     */
    hideDebriefing() {
        if (this.debriefingScreen) {
            this.debriefingScreen.classList.add('hidden');
        }
    }

    /**
     * Handle accept mission button
     */
    onAcceptMission() {
        console.log('MissionUI: Accept mission clicked for:', this.currentMission?.id);

        // Apply loadout to player ship
        if (this.playerShip && this.playerShip.consumables) {
            this.playerShip.consumables.loadFromMissionBriefing(this.loadout);
            console.log('MissionUI: Loaded consumables:', this.loadout);
        } else {
            console.warn('MissionUI: No consumables system on player ship');
        }

        this.hideBriefing();
        eventBus.emit('mission-accepted', { mission: this.currentMission });
        eventBus.emit('game-resumed');
    }

    /**
     * Handle decline mission button
     */
    onDeclineMission() {
        this.hideBriefing();
        eventBus.emit('mission-declined');
        eventBus.emit('game-resumed');
    }

    /**
     * Handle next mission button
     */
    onNextMission() {
        this.hideDebriefing();

        if (this.currentMission && this.currentMission.nextMission) {
            const nextMission = MISSIONS[this.currentMission.nextMission];
            if (nextMission) {
                eventBus.emit('load-next-mission', { missionId: this.currentMission.nextMission });
            }
        }

        eventBus.emit('game-resumed');
    }

    /**
     * Handle return to base button
     */
    onReturnToBase() {
        this.hideDebriefing();
        eventBus.emit('return-to-base');
        eventBus.emit('game-resumed');
    }

    /**
     * Setup loadout selection UI
     */
    setupLoadoutSelection() {
        // Get bay size from ship class or BaySystem
        if (window.game && window.game.baySystem) {
            this.bayMax = window.game.baySystem.maxBaySpace;
        } else if (this.playerShip && this.playerShip.shipClass) {
            // Get bay size from ship class (FG=2, DD=3, CL=4, CA=5, BC=6, BB=7, DN=8, SD=9)
            const bayByClass = {
                'FG': 2,
                'DD': 3,
                'CL': 4,
                'CS': 5, // Strike Cruiser same as CA
                'CA': 5,
                'BC': 6,
                'BB': 7,
                'DN': 8,
                'SD': 9
            };
            this.bayMax = bayByClass[this.playerShip.shipClass] || 5;
        } else {
            this.bayMax = 5; // Default bay capacity
        }

        // Load saved loadout from localStorage
        this.loadLoadout();

        // Attach event listeners to + and - buttons
        document.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.closest('.consumable-item').dataset.type;
                this.incrementConsumable(type);
            });
        });

        document.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.closest('.consumable-item').dataset.type;
                this.decrementConsumable(type);
            });
        });

        // Update display
        this.updateLoadoutDisplay();
    }

    /**
     * Increment consumable count
     */
    incrementConsumable(type) {
        const total = this.getTotalBayUsage();
        if (total < this.bayMax) {
            this.loadout[type]++;
            this.updateLoadoutDisplay();
            this.saveLoadout();
        }
    }

    /**
     * Decrement consumable count
     */
    decrementConsumable(type) {
        if (this.loadout[type] > 0) {
            this.loadout[type]--;
            this.updateLoadoutDisplay();
            this.saveLoadout();
        }
    }

    /**
     * Get total bay usage
     */
    getTotalBayUsage() {
        return Object.values(this.loadout).reduce((sum, count) => sum + count, 0);
    }

    /**
     * Get display name for consumable type
     */
    getConsumableDisplayName(type) {
        const names = {
            hullRepairKit: 'Hull Repair Kit',
            energyCells: 'Energy Cells',
            extraTorpedoes: 'Extra Torpedoes',
            extraDecoys: 'Extra Decoys',
            extraMines: 'Extra Mines',
            shieldBoost: 'Shield Boost',
            extraShuttles: 'Extra Shuttles',
            extraFighters: 'Extra Fighters',
            extraBombers: 'Extra Bombers',
            extraDrones: 'Extra Drones',
            extraProbes: 'Extra Probes'
        };
        return names[type] || type;
    }

    /**
     * Generate loadout summary text
     */
    generateLoadoutSummary() {
        const items = [];
        for (const [type, count] of Object.entries(this.loadout)) {
            if (count > 0) {
                const name = this.getConsumableDisplayName(type);
                items.push(`${count}x ${name}`);
            }
        }
        
        if (items.length === 0) {
            return 'None selected';
        }
        return items.join(', ');
    }

    /**
     * Update loadout display
     */
    updateLoadoutDisplay() {
        // Update bay capacity display
        const bayUsed = this.getTotalBayUsage();
        const bayUsedElement = document.getElementById('bay-used');
        const bayMaxElement = document.getElementById('bay-max');

        if (bayUsedElement) bayUsedElement.textContent = bayUsed;
        if (bayMaxElement) bayMaxElement.textContent = this.bayMax;

        // Update loadout summary
        const summaryTextElement = document.getElementById('loadout-summary-text');
        if (summaryTextElement) {
            summaryTextElement.textContent = this.generateLoadoutSummary();
        }

        // Update each consumable count display
        document.querySelectorAll('.consumable-item').forEach(item => {
            const type = item.dataset.type;
            const countElement = item.querySelector('.consumable-count');
            if (countElement && this.loadout[type] !== undefined) {
                countElement.textContent = this.loadout[type];
            }
        });

        // Disable + buttons if bay full
        const isFull = bayUsed >= this.bayMax;
        document.querySelectorAll('.btn-plus').forEach(btn => {
            btn.disabled = isFull;
        });
    }

    /**
     * Save loadout to localStorage
     */
    saveLoadout() {
        localStorage.setItem('starSea_loadout', JSON.stringify(this.loadout));
    }

    /**
     * Load loadout from localStorage
     */
    loadLoadout() {
        const saved = localStorage.getItem('starSea_loadout');
        if (saved) {
            try {
                this.loadout = JSON.parse(saved);
            } catch (e) {
                console.warn('MissionUI: Failed to parse saved loadout', e);
            }
        }
    }
}
