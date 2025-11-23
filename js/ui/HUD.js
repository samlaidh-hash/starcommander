/**
 * Star Sea - HUD Manager
 * Updates HUD elements based on game state
 */

class HUD {
    constructor() {
        this.uiRenderer = new UIRenderer();
        this.lastUpdate = 0;
        this.updateInterval = 100; // Update every 100ms

        // Initialize keyboard panel toggle
        this.initKeyboardPanel();
    }

    /**
     * Initialize keyboard reference panel toggle functionality
     */
    initKeyboardPanel() {
        const toggleButton = document.getElementById('keyboard-panel-toggle');
        const panel = document.getElementById('keyboard-panel');

        if (!toggleButton || !panel) {
            console.warn('Keyboard panel elements not found');
            return;
        }

        // Toggle panel visibility on button click
        toggleButton.addEventListener('click', () => {
            panel.classList.toggle('show');
        });

        // Close panel when clicking outside (optional enhancement)
        document.addEventListener('click', (e) => {
            // If click is outside panel and toggle button, close panel
            if (!panel.contains(e.target) && !toggleButton.contains(e.target)) {
                panel.classList.remove('show');
            }
        });
    }

    update(playerShip, entities = [], selectedTarget = null) {
        const now = performance.now();
        if (now - this.lastUpdate < this.updateInterval) return;
        this.lastUpdate = now;

        if (!playerShip) return;

        this.playerShip = playerShip; // Store reference for updateTargetInfo distance calc

        this.updateShipHeader(playerShip);

        // Update shields
        this.updateShields(playerShip);

        // Update energy blocks (replaces system damage display)
        this.updateEnergyBlocks(playerShip);
        
        // Update throttle display
        this.updateThrottle(playerShip);


        // Update countermeasures
        this.updateCountermeasures(playerShip);

        // Update consumables
        this.updateConsumables(playerShip);

        // Update warp charge
        this.updateWarpCharge(playerShip);

        // Update boost status
        this.updateBoostStatus(playerShip);

        // Update ping status
        this.updatePingStatus();

        // Update speed bar
        this.updateSpeedBar(playerShip);

        // Update target info (TAB-selected target)
        this.updateTargetInfo(selectedTarget);

        // Update minimap
        let detectionRadius = CONFIG.DETECTION_RADIUS_CA_PIXELS;
        const detectionKey = `DETECTION_RADIUS_${playerShip.shipClass}_PIXELS`;
        if (typeof CONFIG !== 'undefined' && CONFIG[detectionKey] !== undefined) {
            detectionRadius = CONFIG[detectionKey];
        }
        const camera = window.game ? window.game.camera : null;
        this.uiRenderer.renderMinimap(playerShip, entities, detectionRadius, camera);
    }

    updateShipHeader(ship) {
        if (!this.shipHeaderElement || !ship) return;
        const classLabel = HUD.CLASS_LABELS[ship.shipClass] || ship.shipClass;
        const factionLabel = HUD.FACTION_LABELS[ship.faction] || ship.faction;
        const shipName = ship.name || `${factionLabel} ${classLabel}`;
        this.shipHeaderElement.textContent = `${shipName} - ${factionLabel} ${classLabel}`;
    }
    updateShields(ship) {
        // Unified shield system - single shield indicator
        if (!ship || !ship.shields) {
            // Update all quadrant bars to 0 for compatibility
            this.updateBar('shield-fore', 0);
            this.updateBar('shield-port', 0);
            this.updateBar('shield-starboard', 0);
            this.updateBar('shield-aft', 0);
            return;
        }

        // Unified shield - show same value on all quadrants for compatibility
        const shieldPercent = ship.shields.getPercentage();
        const isUp = ship.shields.isUp();
        
        this.updateBar('shield-fore', shieldPercent);
        this.updateBar('shield-port', shieldPercent);
        this.updateBar('shield-starboard', shieldPercent);
        this.updateBar('shield-aft', shieldPercent);
        
        // Update shield status indicator (if exists)
        const shieldStatusElement = document.getElementById('shield-status');
        if (shieldStatusElement) {
            shieldStatusElement.textContent = isUp ? 'UP' : 'DOWN';
            shieldStatusElement.style.color = isUp ? '#0f0' : '#f00';
        }
    }
    
    updateEnergyBlocks(ship) {
        if (!ship || !ship.energy) return;
        
        const blockData = ship.energy.getBlockData();
        const container = document.getElementById('energy-blocks-container');
        
        if (!container) {
            // Create container if it doesn't exist
            const energyGroup = document.createElement('div');
            energyGroup.className = 'system-group';
            energyGroup.id = 'energy-blocks-group';
            energyGroup.innerHTML = `
                <div class="system-label">Energy Blocks</div>
                <div id="energy-blocks-container"></div>
            `;
            // Insert after shields, before hull
            const shieldsGroup = document.querySelector('.system-group');
            if (shieldsGroup && shieldsGroup.nextSibling) {
                shieldsGroup.parentNode.insertBefore(energyGroup, shieldsGroup.nextSibling);
            }
            return;
        }
        
        // Clear and rebuild energy blocks display
        container.innerHTML = '';
        
        for (let i = 0; i < blockData.length; i++) {
            const block = blockData[i];
            const blockElement = document.createElement('div');
            blockElement.className = 'energy-block';
            blockElement.innerHTML = `
                <div class="energy-block-label">Block ${i + 1}</div>
                <div class="energy-block-bar">
                    <div class="energy-block-fill" style="width: ${block.energyPercent * 100}%"></div>
                    <div class="energy-block-capacity" style="width: ${(block.currentLength / block.maxLength) * 100}%"></div>
                </div>
                <div class="energy-block-info">${Math.round(block.energy)}/${Math.round(block.currentLength)}</div>
            `;
            container.appendChild(blockElement);
        }
    }
    
    updateThrottle(ship) {
        if (!ship) return;
        
        const throttleElement = document.getElementById('throttle-display');
        const throttleBar = document.getElementById('throttle-bar-fill');
        
        if (throttleElement) {
            throttleElement.textContent = `${Math.round(ship.throttle * 100)}%`;
        }
        
        if (throttleBar) {
            throttleBar.style.width = `${ship.throttle * 100}%`;
            // Color based on throttle level
            if (ship.throttle > 0.5) {
                throttleBar.style.background = '#f00'; // Red when draining energy
            } else if (ship.throttle < 0.5) {
                throttleBar.style.background = '#0f0'; // Green when refilling
            } else {
                throttleBar.style.background = '#ff0'; // Yellow at 50%
            }
        }
    }


    updateCountermeasures(ship) {
        if (!ship) return;

        const decoyElement = document.getElementById('decoy-count');
        const mineElement = document.getElementById('mine-count');
        const captorMineElement = document.getElementById('captor-mine-count');
        const phaserMineElement = document.getElementById('phaser-mine-count');
        const transporterMineElement = document.getElementById('transporter-mine-count');
        const interceptorElement = document.getElementById('interceptor-count');
        const torpedoTypeElement = document.getElementById('torpedo-type');

        if (decoyElement) decoyElement.textContent = ship.decoys || 0;
        if (mineElement) mineElement.textContent = ship.mines || 0;
        if (captorMineElement) captorMineElement.textContent = ship.captorMines || 0;
        if (phaserMineElement) phaserMineElement.textContent = ship.phaserMines || 0;
        if (transporterMineElement) transporterMineElement.textContent = ship.transporterMines || 0;
        if (interceptorElement) interceptorElement.textContent = ship.interceptors || 0;

        // Update torpedo type indicator
        if (torpedoTypeElement) {
            const torpType = ship.selectedTorpedoType || 'standard';
            const torpTypeLabels = {
                'standard': 'STD',
                'heavy': 'HVY',
                'quantum': 'QTM',
                'gravity': 'GRV'
            };
            torpedoTypeElement.textContent = torpTypeLabels[torpType] || 'STD';
        }

        // Update shuttle/fighter/bomber counts from BaySystem
        if (window.game && window.game.baySystem) {
            const baySystem = window.game.baySystem;

            const shuttleCountElement = document.getElementById('shuttle-count');
            const shuttleMaxElement = document.getElementById('shuttle-max');
            const fighterCountElement = document.getElementById('fighter-count');
            const fighterMaxElement = document.getElementById('fighter-max');
            const bomberCountElement = document.getElementById('bomber-count');
            const bomberMaxElement = document.getElementById('bomber-max');
            const baySpaceElement = document.getElementById('bay-space');
            const bayMaxElement = document.getElementById('bay-max');

            if (shuttleCountElement) shuttleCountElement.textContent = baySystem.launchedShuttles.filter(s => s.active).length;
            if (fighterCountElement) fighterCountElement.textContent = baySystem.launchedFighters.filter(f => f.active).length;
            if (bomberCountElement) bomberCountElement.textContent = baySystem.launchedBombers.filter(b => b.active).length;
            if (baySpaceElement) baySpaceElement.textContent = baySystem.baySpace;
            if (bayMaxElement) bayMaxElement.textContent = baySystem.maxBaySpace;

            // Get max counts from default loadouts
            const faction = ship.faction || 'FEDERATION';
            const shipClass = ship.shipClass || 'CA';
            const loadout = baySystem.defaultLoadouts[faction]?.[shipClass] || { shuttles: 0, fighters: 0, bombers: 0 };

            if (shuttleMaxElement) shuttleMaxElement.textContent = loadout.shuttles || 0;
            if (fighterMaxElement) fighterMaxElement.textContent = loadout.fighters || 0;
            if (bomberMaxElement) bomberMaxElement.textContent = loadout.bombers || 0;
        }
    }

    updateConsumables(ship) {
        if (!ship || !ship.consumables) return;

        const consumables = ship.consumables.inventory;
        const activeEffects = ship.consumables.activeEffects;

        // Update consumable counts
        const torpedoesElement = document.getElementById('consumable-torpedoes');
        const decoysElement = document.getElementById('consumable-decoys');
        const minesElement = document.getElementById('consumable-mines');
        const shieldBoostElement = document.getElementById('consumable-shield-boost');
        const repairElement = document.getElementById('consumable-repair');
        const energyElement = document.getElementById('consumable-energy');
        const energyActiveElement = document.getElementById('consumable-energy-active');

        if (torpedoesElement) {
            torpedoesElement.textContent = consumables.extraTorpedoes || 0;
            torpedoesElement.classList.toggle('depleted', (consumables.extraTorpedoes || 0) === 0);
        }
        if (decoysElement) {
            decoysElement.textContent = consumables.extraDecoys || 0;
            decoysElement.classList.toggle('depleted', (consumables.extraDecoys || 0) === 0);
        }
        if (minesElement) {
            minesElement.textContent = consumables.extraMines || 0;
            minesElement.classList.toggle('depleted', (consumables.extraMines || 0) === 0);
        }
        if (shieldBoostElement) {
            shieldBoostElement.textContent = consumables.shieldBoost || 0;
            shieldBoostElement.classList.toggle('depleted', (consumables.shieldBoost || 0) === 0);
        }
        if (repairElement) {
            repairElement.textContent = consumables.hullRepairKit || 0;
            repairElement.classList.toggle('depleted', (consumables.hullRepairKit || 0) === 0);
        }
        if (energyElement) {
            energyElement.textContent = consumables.energyCells || 0;
            energyElement.classList.toggle('depleted', (consumables.energyCells || 0) === 0);
        }

        // Show/hide energy cells active indicator
        if (energyActiveElement) {
            const isActive = activeEffects.energyCells && activeEffects.energyCells.active;
            energyActiveElement.style.display = isActive ? 'inline' : 'none';
        }
    }

    updateWarpCharge(ship) {
        const fillElement = document.getElementById('warp-charge-fill');
        if (!fillElement || !ship || !ship.systems || !ship.systems.warp) return;

        const warpCharge = ship.systems.warp.warpCharge || 0;
        fillElement.style.width = `${warpCharge}%`;
    }

    updateBoostStatus(ship) {
        if (!ship) return;

        const boostGroup = document.getElementById('boost-status-group');
        const boostLabel = document.getElementById('boost-label');
        const boostFill = document.getElementById('boost-fill');

        if (!boostGroup || !boostLabel || !boostFill) return;

        if (ship.boostActive) {
            // Boost is active - show timer
            boostGroup.style.display = 'block';
            const currentTime = performance.now() / 1000;
            const elapsed = currentTime - ship.boostStartTime;
            const remaining = ship.boostDuration - elapsed;
            const percentage = (remaining / ship.boostDuration) * 100;

            boostLabel.textContent = 'BOOST';
            boostLabel.style.color = '#0ff'; // Cyan when active
            boostFill.style.width = `${Math.max(0, percentage)}%`;
            boostFill.style.background = 'linear-gradient(90deg, #0ff, #0af)';
        } else {
            // Boost is on cooldown or ready
            const cooldownRemaining = ship.getBoostCooldownRemaining();

            if (cooldownRemaining > 0) {
                // Show cooldown
                boostGroup.style.display = 'block';
                const cooldownPercentage = ((ship.boostCooldown - cooldownRemaining) / ship.boostCooldown) * 100;

                boostLabel.textContent = `COOLDOWN ${Math.ceil(cooldownRemaining)}s`;
                boostLabel.style.color = '#888'; // Gray when on cooldown
                boostFill.style.width = `${cooldownPercentage}%`;
                boostFill.style.background = 'linear-gradient(90deg, #444, #666)';
            } else {
                // Boost ready - hide indicator
                boostGroup.style.display = 'none';
            }
        }
    }

    updatePingStatus() {
        const pingSystem = window.game ? window.game.pingSystem : null;
        if (!pingSystem) return;

        const pingGroup = document.getElementById('ping-status-group');
        const pingLabel = document.getElementById('ping-label');
        const pingFill = document.getElementById('ping-fill');
        const pingText = document.getElementById('ping-text');

        if (!pingGroup || !pingLabel || !pingFill || !pingText) return;

        const status = pingSystem.getStatus();

        if (status.isActive) {
            // Ping is active - show active timer
            pingGroup.style.display = 'block';
            const remaining = Math.ceil(status.activeTimeRemaining);
            const percentage = (status.activeTimeRemaining / pingSystem.activeDuration) * 100;

            pingLabel.textContent = 'PING ACTIVE';
            pingLabel.style.color = '#00ffff';
            pingFill.style.width = `${Math.max(0, percentage)}%`;
            pingFill.className = 'active';
            pingText.textContent = `${remaining}s - Range x2`;
        } else if (status.isCooldown) {
            // Ping is on cooldown
            pingGroup.style.display = 'block';
            const remaining = Math.ceil(status.cooldownTimeRemaining);
            const percentage = status.cooldownProgress * 100;

            pingLabel.textContent = 'PING COOLDOWN';
            pingLabel.style.color = '#888888';
            pingFill.style.width = `${percentage}%`;
            pingFill.className = 'cooldown';
            pingText.textContent = `${remaining}s until ready`;
        } else {
            // Ping ready - hide indicator
            pingGroup.style.display = 'none';
        }
    }

    weaponCoversArc(weapon, arcCenter) {
        if (!weapon) return false;
        const centers = weapon.arcCenters && weapon.arcCenters.length > 0
            ? weapon.arcCenters
            : [weapon.arcCenter !== undefined ? weapon.arcCenter : 0];
        return centers.some(center => MathUtils.normalizeAngle(center) === arcCenter);
    }

    findLauncherForArc(launchers, arcCenter, exclude = null) {
        if (!launchers || launchers.length === 0) return null;
        for (const launcher of launchers) {
            if (exclude && launcher === exclude) continue;
            if (this.weaponCoversArc(launcher, arcCenter)) {
                return launcher;
            }
        }
        return null;
    }
    updateBar(elementId, percentage) {
        const element = document.querySelector(`#${elementId} .bar-fill`);
        if (element) {
            // Round to avoid floating point issues
            const roundedPercent = Math.round(percentage * 100);
            element.style.width = `${roundedPercent}%`;

            // Set color class based on charge state
            if (roundedPercent >= 100) {
                element.classList.add('charged');
                element.classList.remove('recharging');
            } else {
                element.classList.remove('charged');
                element.classList.add('recharging');
            }
        }
    }

    // REMOVED: updateTorpedoCount() - legacy method no longer used
    // REMOVED: updateWeaponHP() - legacy method no longer used
    // Weapons now use updateSystemHP() like all other systems
    updateSystemHP(systemName, current, max) {
        const systemItem = document.querySelector(`[data-system="${systemName}"]`);
        if (!systemItem) return;

        const hpFill = systemItem.querySelector('.hp-fill');
        if (hpFill) {
            const percentage = (current / max) * 100;
            hpFill.style.width = `${percentage}%`;
        }

        // Update visual state
        if (current === 0) {
            systemItem.classList.add('damaged');
            systemItem.classList.remove('warning');
        } else if (current <= max * 0.3) {
            systemItem.classList.add('warning');
            systemItem.classList.remove('damaged');
        } else {
            systemItem.classList.remove('damaged', 'warning');
        }
    }

    
    addCriticalMessage(message, duration = 5000) {
        const logElement = document.getElementById('log-messages');
        if (!logElement) return;

        const messageElement = document.createElement('div');
        messageElement.className = 'log-message';
        messageElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

        logElement.insertBefore(messageElement, logElement.firstChild);

        // Remove after duration
        setTimeout(() => {
            messageElement.classList.add('fading');
            setTimeout(() => messageElement.remove(), 500);
        }, duration);

        // Keep only last 5 messages
        while (logElement.children.length > 5) {
            logElement.lastChild.remove();
        }
    }

    /**
     * Show mission objectives panel
     */
    showObjectives() {
        const panel = document.getElementById('objectives-panel');
        if (panel) {
            panel.classList.add('active');
        }
    }

    /**
     * Hide mission objectives panel
     */
    hideObjectives() {
        const panel = document.getElementById('objectives-panel');
        if (panel) {
            panel.classList.remove('active');
        }
    }

    /**
     * Update mission objectives display
     * @param {Array} objectives - Array of objective objects from MissionManager
     */
    updateObjectives(objectives) {
        const display = document.getElementById('objectives-display');
        if (!display) return;

        // Clear existing objectives
        display.innerHTML = '';

        if (!objectives || objectives.length === 0) {
            this.hideObjectives();
            return;
        }

        this.showObjectives();

        // Create objective elements
        for (const objective of objectives) {
            const objectiveElement = document.createElement('div');
            objectiveElement.className = 'objective-item';
            objectiveElement.dataset.objectiveId = objective.id;

            // Add classes based on objective state
            if (objective.primary) {
                objectiveElement.classList.add('primary');
            }
            if (objective.completed) {
                objectiveElement.classList.add('completed');
            }
            if (objective.failed) {
                objectiveElement.classList.add('failed');
            }

            // Description
            const description = document.createElement('div');
            description.className = 'objective-description';
            description.textContent = objective.description;
            objectiveElement.appendChild(description);

            // Progress indicator (if applicable)
            if (!objective.completed && !objective.failed) {
                const progress = this.getObjectiveProgress(objective);
                if (progress !== null) {
                    const progressText = document.createElement('div');
                    progressText.className = 'objective-progress';
                    progressText.textContent = progress.text;
                    objectiveElement.appendChild(progressText);

                    // Progress bar (if percentage available)
                    if (progress.percentage !== null) {
                        const progressBar = document.createElement('div');
                        progressBar.className = 'objective-progress-bar';
                        const progressFill = document.createElement('div');
                        progressFill.className = 'objective-progress-fill';
                        progressFill.style.width = `${progress.percentage * 100}%`;
                        progressBar.appendChild(progressFill);
                        objectiveElement.appendChild(progressBar);
                    }
                }
            }

            display.appendChild(objectiveElement);
        }
    }

    /**
     * Get progress information for an objective
     * @param {Object} objective - Objective object
     * @returns {Object|null} - Progress info with text and percentage
     */
    getObjectiveProgress(objective) {
        switch (objective.type) {
            case 'destroy':
                return {
                    text: `${objective.progress || 0} / ${objective.target}`,
                    percentage: (objective.progress || 0) / objective.target
                };

            case 'survive':
                const minutes = Math.floor(objective.progress / 60);
                const seconds = Math.floor(objective.progress % 60);
                const targetMinutes = Math.floor(objective.target / 60);
                const targetSeconds = Math.floor(objective.target % 60);
                return {
                    text: `${minutes}:${seconds.toString().padStart(2, '0')} / ${targetMinutes}:${targetSeconds.toString().padStart(2, '0')}`,
                    percentage: objective.progress / objective.target
                };

            case 'protect':
                return {
                    text: objective.progress > 0 ? 'Protected' : 'Failed',
                    percentage: null
                };

            case 'reach':
                const percent = Math.min(1, objective.progress || 0);
                return {
                    text: `${Math.round(percent * 100)}%`,
                    percentage: percent
                };

            case 'scan':
                const scanPercent = Math.min(1, objective.progress || 0);
                return {
                    text: `Scanning... ${Math.round(scanPercent * 100)}%`,
                    percentage: scanPercent
                };

            default:
                return null;
        }
    }

    updateSpeedBar(ship) {
        if (!ship) return;

        const forwardBar = document.getElementById('speed-bar-forward');
        const reverseBar = document.getElementById('speed-bar-reverse');

        if (!forwardBar || !reverseBar) return;

        // Calculate percentage of max speed
        if (ship.currentSpeed >= 0) {
            // Moving forward
            const forwardPercent = (ship.currentSpeed / ship.maxSpeed) * 100;
            forwardBar.style.width = `${forwardPercent}%`;
            reverseBar.style.width = '0%';
        } else {
            // Moving backward
            const reversePercent = (Math.abs(ship.currentSpeed) / ship.maxReverseSpeed) * 100;
            reverseBar.style.width = `${reversePercent}%`;
            forwardBar.style.width = '0%';
        }
    }

    updateTooltip(mouseX, mouseY, hoveredShip) {
        const tooltip = document.getElementById('ship-tooltip');
        if (!tooltip) return;

        if (!hoveredShip || hoveredShip.isPlayer) {
            tooltip.style.display = 'none';
            return;
        }

        // Show tooltip near mouse
        tooltip.style.display = 'block';
        tooltip.style.left = (mouseX + 15) + 'px';
        tooltip.style.top = (mouseY + 15) + 'px';

        // Update header
        const header = tooltip.querySelector('.tooltip-header');
        const classLabel = HUD.CLASS_LABELS[hoveredShip.shipClass] || hoveredShip.shipClass;
        const factionLabel = HUD.FACTION_LABELS[hoveredShip.faction] || hoveredShip.faction;
        header.textContent = `${factionLabel} ${classLabel}`;

        // Update shields
        if (hoveredShip.shields) {
            const quadrants = hoveredShip.shields.getAllQuadrants();
            tooltip.querySelector('[data-shield="fore"]').textContent = `${Math.round(quadrants.fore.current)}/${quadrants.fore.max}`;
            tooltip.querySelector('[data-shield="port"]').textContent = `${Math.round(quadrants.port.current)}/${quadrants.port.max}`;
            tooltip.querySelector('[data-shield="starboard"]').textContent = `${Math.round(quadrants.starboard.current)}/${quadrants.starboard.max}`;
            tooltip.querySelector('[data-shield="aft"]').textContent = `${Math.round(quadrants.aft.current)}/${quadrants.aft.max}`;
        }

        // Update systems
        const systemsDiv = tooltip.querySelector('.tooltip-systems');
        if (hoveredShip.systems) {
            const systemsHTML = [];
            systemsHTML.push(`HP: ${Math.round(hoveredShip.systems.hull.hp)}/${hoveredShip.systems.hull.maxHp}`);
            systemsHTML.push(`Impulse: ${Math.round((hoveredShip.systems.impulse.hp / hoveredShip.systems.impulse.maxHp) * 100)}%`);
            systemsHTML.push(`Weapons: ${Math.round((hoveredShip.systems.power.hp / hoveredShip.systems.power.maxHp) * 100)}%`);
            systemsDiv.innerHTML = systemsHTML.join('<br>');
        }
    }

    /**
     * Update target info panel for TAB-selected target
     */
    updateTargetInfo(target) {
        const targetPanel = document.getElementById('target-info-panel');
        if (!targetPanel) return;

        if (!target || !target.active) {
            targetPanel.style.display = 'none';
            return;
        }

        targetPanel.style.display = 'block';

        // Update target name
        const targetName = document.getElementById('target-name');
        if (targetName) {
            const factionLabel = HUD.FACTION_LABELS[target.faction] || target.faction;
            const classLabel = HUD.CLASS_LABELS[target.shipClass] || target.shipClass;
            const name = target.name || `${factionLabel} ${classLabel}`;
            targetName.textContent = name;
        }

        // Update target shields
        const targetShields = document.getElementById('target-shields');
        if (targetShields && target.shields) {
            const shields = target.shields.getAllQuadrants();
            const totalCurrent = shields.fore.current + shields.aft.current +
                                shields.port.current + shields.starboard.current;
            const totalMax = shields.fore.max + shields.aft.max +
                            shields.port.max + shields.starboard.max;
            targetShields.textContent = `Shields: ${Math.round(totalCurrent)}/${Math.round(totalMax)}`;
        }

        // Update target hull
        const targetHull = document.getElementById('target-hull');
        if (targetHull && target.systems && target.systems.hull) {
            targetHull.textContent = `Hull: ${Math.round(target.systems.hull.hp)}/${target.systems.hull.maxHp}`;
        }

        // Update target distance
        const targetDistance = document.getElementById('target-distance');
        if (targetDistance && this.playerShip) {
            const dx = target.x - this.playerShip.x;
            const dy = target.y - this.playerShip.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const shipLengths = (dist / CONFIG.SHIP_LENGTH_CA).toFixed(1);
            targetDistance.textContent = `Distance: ${shipLengths} SL`;
        }
    }
}
HUD.CLASS_LABELS = {
    FG: 'Frigate',
    DD: 'Destroyer',
    CL: 'Light Cruiser',
    CA: 'Heavy Cruiser',
    BC: 'Battlecruiser'
};

HUD.FACTION_LABELS = {
    PLAYER: 'Federation',
    FEDERATION: 'Federation',
    TRIGON: 'Trigon Empire',
    SCINTILIAN: 'Scintilian Coalition',
    PIRATE: 'Pirate Clans'
};



