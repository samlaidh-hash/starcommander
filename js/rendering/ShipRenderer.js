/**
 * Star Sea - Ship Renderer
 * Renders ships as vector graphics with internal systems
 */

class ShipRenderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    render(ship) {
        if (!ship || !ship.active) return; // Safety check
        
        // Check if ship is cloaked
        const alpha = this.getVisibilityAlpha(ship);
        if (alpha <= 0) return; // Completely invisible, skip rendering

        this.ctx.save();

        // Apply cloaking alpha
        this.ctx.globalAlpha = alpha;

        // Draw tactical warp effects (if active)
        if (ship.tacticalWarpActive) {
            this.drawTacticalWarpEffects(ship);
        }

        // Translate to ship position
        this.ctx.translate(ship.x, ship.y);

        // Rotate to ship facing
        this.ctx.rotate(MathUtils.toRadians(ship.rotation));

        // Draw ship hull (with stretch effect if tactical warp active)
        this.drawHull(ship);

        // Draw visual damage effects (particle trails, flames, explosions)
        this.drawDamageEffects(ship);

        // Draw weapon firing points and indicators (if player ship)
        if (ship.isPlayer && ship.weaponPoints) {
            this.drawWeaponPoints(ship);
        }

        // Draw individual weapon firing point indicators (for all ships with energy-using weapons)
        if (ship.weapons && ship.weapons.length > 0) {
            this.drawWeaponIndicators(ship);
        }

        // Draw shields (only if not cloaked) - ALL SHIPS
        if (!ship.isCloaked()) {
            this.drawShields(ship);
        }

        // Draw special faction shields
        if (ship.faction === 'DHOJAN') {
            this.drawEnergyShield(ship);
        }
        if (ship.faction === 'COMMONWEALTH') {
            this.drawLaserShield(ship);
        }

        // Draw phase shift effects (if active)
        if (ship.faction === 'ANDROMEDAN') {
            this.drawPhaseShiftEffects(ship);
        }

        // Draw quantum drive effects (if recently used)
        if (ship.faction === 'DHOJAN') {
            this.drawQuantumDriveEffects(ship);
        }

        // Draw internal systems - ALL SHIPS (scaled down for enemies)
        if (ship.systems) {
            this.drawInternalSystems(ship);
        }

        // Damage flash effect removed - replaced with debris bursts and shield flares
        // (handled in Engine.js event handlers)

        this.ctx.restore();

        // HP bars removed - using internal system damage visualization instead

        // Draw debug info
        if (CONFIG.DEBUG_MODE) {
            this.drawDebugInfo(ship);
        }
    }

    drawHPBar(ship) {
        const size = ship.getShipSize();
        const barWidth = size * 1.2;
        const barHeight = 4;
        const barY = -size - 25; // Above ship and torpedo indicators

        this.ctx.save();
        this.ctx.translate(ship.x, ship.y);

        // Background
        this.ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
        this.ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);

        // HP fill (from hull system)
        const hpPercent = ship.systems && ship.systems.hull ?
            (ship.systems.hull.hp / ship.systems.hull.maxHp) : 1.0;
        const fillWidth = barWidth * hpPercent;

        // Color based on HP
        let color;
        if (hpPercent > 0.6) {
            color = '#0f0'; // Green
        } else if (hpPercent > 0.3) {
            color = '#ff0'; // Yellow
        } else {
            color = '#f00'; // Red
        }

        this.ctx.fillStyle = color;
        this.ctx.fillRect(-barWidth / 2, barY, fillWidth, barHeight);

        // Border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(-barWidth / 2, barY, barWidth, barHeight);

        this.ctx.restore();
    }

    getVisibilityAlpha(ship) {
        if (ship.systems && ship.systems.cloak) {
            return ship.systems.cloak.getVisibilityAlpha();
        }
        return 1.0; // Fully visible
    }

    drawHull(ship) {
        const size = ship.getShipSize();
        
        // Try to load and draw PNG image first
        if (window.assetManager && ship.faction && ship.shipClass) {
            // Normalize faction name to handle case variations (AssetManager expects lowercase)
            // Map "player" to "federation" for image loading (player ships use Federation images)
            let normalizedFaction = typeof ship.faction === 'string' ? ship.faction.toLowerCase() : ship.faction;
            if (normalizedFaction === 'player') {
                normalizedFaction = 'federation';
            }
            const img = window.assetManager.getShipImage(normalizedFaction, ship.shipClass);
            
            // Check if image is loaded and ready
            if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                // Draw PNG image (rotation already applied in render() function)
                const imgWidth = img.naturalWidth;
                const imgHeight = img.naturalHeight;
                const scale = size / Math.max(imgWidth, imgHeight) * 2; // Scale to fit ship size
                
                // Store image dimensions on ship for hit detection and torpedo offsets
                ship.pngImageWidth = imgWidth * scale;
                ship.pngImageHeight = imgHeight * scale;
                ship.pngImageScale = scale;
                ship.hasPNGImage = true;
                
                this.ctx.drawImage(img, -imgWidth * scale / 2, -imgHeight * scale / 2, 
                                  imgWidth * scale, imgHeight * scale);
                
                // Draw engine glow at rear (if moving)
                const speed = Math.abs(ship.vx) + Math.abs(ship.vy);
                if (speed > 10) {
                    const glowIntensity = Math.min(speed / 100, 1.0);
                    const glowSize = 6 * glowIntensity;

                    // Create radial gradient for engine glow
                    const gradient = this.ctx.createRadialGradient(0, size, 0, 0, size, glowSize + 10);
                    gradient.addColorStop(0, `rgba(100, 150, 255, ${glowIntensity * 0.8})`);
                    gradient.addColorStop(0.5, `rgba(100, 150, 255, ${glowIntensity * 0.4})`);
                    gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');

                    this.ctx.fillStyle = gradient;
                    this.ctx.beginPath();
                    this.ctx.arc(0, size, glowSize + 10, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                return; // PNG drawn successfully, skip vector graphics
            } else {
                // Image not loaded yet, try to load it asynchronously
                window.assetManager.loadShipImage(normalizedFaction, ship.shipClass).catch(() => {
                    // Image load failed, will fall through to vector graphics
                });
            }
        }
        
        // Fallback to vector graphics if PNG not available
        ship.hasPNGImage = false; // Mark as no PNG image
        if (!ship.vertices || ship.vertices.length === 0) return;

        this.ctx.strokeStyle = ship.color;
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';

        // Draw hull polygon
        this.ctx.beginPath();
        this.ctx.moveTo(ship.vertices[0].x, ship.vertices[0].y);

        for (let i = 1; i < ship.vertices.length; i++) {
            this.ctx.lineTo(ship.vertices[i].x, ship.vertices[i].y);
        }

        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Forward indicator removed per user request

        // Draw engine glow at rear (if moving)
        const speed = Math.abs(ship.vx) + Math.abs(ship.vy);
        if (speed > 10) {
            const glowIntensity = Math.min(speed / 100, 1.0);
            const glowSize = 6 * glowIntensity;

            // Create radial gradient for engine glow
            const gradient = this.ctx.createRadialGradient(0, size, 0, 0, size, glowSize + 10);
            gradient.addColorStop(0, `rgba(100, 150, 255, ${glowIntensity * 0.8})`);
            gradient.addColorStop(0.5, `rgba(100, 150, 255, ${glowIntensity * 0.4})`);
            gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, size, glowSize + 10, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawWeaponPoints(ship) {
        const wp = ship.weaponPoints;

        this.ctx.save();

        // Draw forward beam battery band (red elliptical arc)
        if (wp.forwardBeamBand) {
            const band = wp.forwardBeamBand;

            // Check continuous beam weapon state (arcCenter = 0 for forward)
            const beamFiring = ship.isPlayer && this.isBeamWeaponFiring(ship, 0);
            const beamReady = ship.isPlayer && this.isBeamWeaponReady(ship, 0);
            const beamRecharging = ship.isPlayer && this.isBeamWeaponRecharging(ship, 0);

            if (beamFiring) {
                // Firing - medium red, no glow
                this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
                this.ctx.lineWidth = 3;
                this.ctx.shadowBlur = 0;
            } else if (beamReady) {
                // Ready - bright red with glow
                this.ctx.strokeStyle = 'rgba(255, 50, 50, 0.9)';
                this.ctx.lineWidth = 3;
                this.ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
                this.ctx.shadowBlur = 8;
            } else if (beamRecharging) {
                // Recharging - dull red, no glow
                this.ctx.strokeStyle = 'rgba(128, 0, 0, 0.6)';
                this.ctx.lineWidth = 2;
                this.ctx.shadowBlur = 0;
            } else {
                // Default/disabled - very dim
                this.ctx.strokeStyle = 'rgba(100, 0, 0, 0.4)';
                this.ctx.lineWidth = 2;
                this.ctx.shadowBlur = 0;
            }

            this.ctx.beginPath();
            this.ctx.ellipse(
                band.centerX,
                band.centerY,
                band.radiusX,
                band.radiusY,
                0, // rotation
                MathUtils.toRadians(band.startAngle),
                MathUtils.toRadians(band.endAngle)
            );
            this.ctx.stroke();

            // Reset shadow
            this.ctx.shadowBlur = 0;

            // Draw forward torpedo indicators (4 dots) between beam band and hull
            this.drawTorpedoIndicators(ship, 'forward', band);
        }

        // Draw aft beam battery (rounded rectangle or point)
        if (wp.aftBeamPoint) {
            const point = wp.aftBeamPoint;

            // Check continuous beam weapon state (arcCenter = 180 for aft)
            const beamFiring = ship.isPlayer && this.isBeamWeaponFiring(ship, 180);
            const beamReady = ship.isPlayer && this.isBeamWeaponReady(ship, 180);
            const beamRecharging = ship.isPlayer && this.isBeamWeaponRecharging(ship, 180);

            if (point.type === 'rectangle') {
                // Draw as rounded rectangle perpendicular to ship axis
                const halfWidth = point.width / 2;
                const halfHeight = point.height / 2;
                const cornerRadius = Math.min(halfWidth, halfHeight) * 0.3; // Rounded corners

                if (beamFiring) {
                    // Firing - medium red, no glow
                    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
                    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
                    this.ctx.shadowBlur = 0;
                    this.ctx.lineWidth = 3;
                } else if (beamReady) {
                    // Ready - bright red with glow
                    this.ctx.strokeStyle = 'rgba(255, 50, 50, 0.9)';
                    this.ctx.fillStyle = 'rgba(255, 50, 50, 0.5)';
                    this.ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
                    this.ctx.shadowBlur = 8;
                    this.ctx.lineWidth = 3;
                } else if (beamRecharging) {
                    // Recharging - dull red, no glow
                    this.ctx.strokeStyle = 'rgba(128, 0, 0, 0.6)';
                    this.ctx.fillStyle = 'rgba(128, 0, 0, 0.3)';
                    this.ctx.shadowBlur = 0;
                    this.ctx.lineWidth = 2;
                } else {
                    // Default/disabled - very dim
                    this.ctx.strokeStyle = 'rgba(100, 0, 0, 0.4)';
                    this.ctx.fillStyle = 'rgba(100, 0, 0, 0.2)';
                    this.ctx.shadowBlur = 0;
                    this.ctx.lineWidth = 2;
                }

                // Draw rounded rectangle
                this.ctx.beginPath();
                this.ctx.roundRect(
                    point.x - halfWidth,
                    point.y - halfHeight,
                    point.width,
                    point.height,
                    cornerRadius
                );
                this.ctx.fill();
                this.ctx.stroke();

                // Reset shadow
                this.ctx.shadowBlur = 0;
            } else {
                // Draw as point (legacy support)
                if (beamReady) {
                    this.ctx.strokeStyle = 'rgba(255, 50, 50, 0.9)';
                    this.ctx.fillStyle = 'rgba(255, 50, 50, 0.6)';
                    this.ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
                    this.ctx.shadowBlur = 6;
                } else {
                    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
                    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
                    this.ctx.shadowBlur = 0;
                }

                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                // Reset shadow
                this.ctx.shadowBlur = 0;

                // Draw aft beam arc indicator
                this.ctx.strokeStyle = beamReady ? 'rgba(255, 50, 50, 0.5)' : 'rgba(255, 0, 0, 0.3)';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }

        // Draw port beam firing point (Strike Cruiser)
        if (wp.portBeamPoint) {
            const point = wp.portBeamPoint;
            const beamReady = ship.isPlayer && this.isBeamWeaponReady(ship, 270); // arcCenter 270 = port

            if (beamReady) {
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
                this.ctx.strokeStyle = 'rgba(255, 50, 50, 0.9)';
                this.ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
                this.ctx.shadowBlur = 8;
            } else {
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
                this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
                this.ctx.shadowBlur = 0;
            }

            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }

        // Draw starboard beam firing point (Strike Cruiser)
        if (wp.starboardBeamPoint) {
            const point = wp.starboardBeamPoint;
            const beamReady = ship.isPlayer && this.isBeamWeaponReady(ship, 90); // arcCenter 90 = starboard

            if (beamReady) {
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
                this.ctx.strokeStyle = 'rgba(255, 50, 50, 0.9)';
                this.ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
                this.ctx.shadowBlur = 8;
            } else {
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
                this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
                this.ctx.shadowBlur = 0;
            }

            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }

        // Draw dual torpedo launcher firing point (orange circle)
        // Federation ships use a single dual-mount launcher that fires both forward and aft
        if (wp.dualTorpedoPoint) {
            const point = wp.dualTorpedoPoint;
            const torpReady = ship.isPlayer && this.isTorpedoReady(ship); // Check any torpedo launcher

            if (torpReady) {
                this.ctx.fillStyle = 'rgba(255, 165, 0, 0.7)';
                this.ctx.strokeStyle = 'rgba(255, 140, 0, 1.0)';
                this.ctx.shadowColor = 'rgba(255, 140, 0, 0.8)';
                this.ctx.shadowBlur = 8;
            } else {
                this.ctx.fillStyle = 'rgba(255, 165, 0, 0.4)';
                this.ctx.strokeStyle = 'rgba(255, 140, 0, 0.6)';
                this.ctx.shadowBlur = 0;
            }

            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }

        this.ctx.restore();
    }

    drawInternalSystems(ship) {
        const size = ship.getShipSize();
        const systems = ship.systems;

        // System label mapping
        const systemLabels = {
            sensors: 'S',
            cnc: 'C',
            impulse: 'I',
            warp: 'W',
            power: 'H', // Hull/Main Power
            bay: 'B',
            cloak: 'K'
        };

        // Define system positions inside ship hull (relative to center)
        // Galaxy-class layout: saucer systems forward, engineering aft
        const systemLayouts = {
            // Saucer section systems
            sensors: { x: 0, y: -size * 0.3, w: size * 0.3, h: size * 0.15 },
            cnc: { x: 0, y: -size * 0.1, w: size * 0.35, h: size * 0.15 },

            // Engineering section systems
            warp: { x: 0, y: size * 0.5, w: size * 0.25, h: size * 0.3 },
            impulse: { x: 0, y: size * 0.75, w: size * 0.2, h: size * 0.2 },
            power: { x: 0, y: size * 0.25, w: size * 0.2, h: size * 0.2 },
            bay: { x: 0, y: size * 0.05, w: size * 0.15, h: size * 0.15 }
        };

        // Add cloak if ship has it
        if (systems && systems.cloak) {
            systemLayouts.cloak = { x: 0, y: -size * 0.5, w: size * 0.2, h: size * 0.1 };
        }

        // Draw each system
        for (const [systemName, layout] of Object.entries(systemLayouts)) {
            if (!systems[systemName]) continue;

            const system = systems[systemName];
            const damagePercent = 1 - (system.hp / system.maxHp); // 0 = healthy, 1 = destroyed

            this.ctx.save();

            // Draw system box
            const x = layout.x - layout.w / 2;
            const y = layout.y - layout.h / 2;

            // Background (dark)
            this.ctx.fillStyle = 'rgba(20, 20, 40, 0.6)';
            this.ctx.fillRect(x, y, layout.w, layout.h);

            // Damage fill (red, from LEFT to RIGHT)
            if (damagePercent > 0) {
                const damageWidth = layout.w * damagePercent;

                // Red gradient (left to right, darker to brighter)
                const gradient = this.ctx.createLinearGradient(x, y, x + damageWidth, y);
                gradient.addColorStop(0, `rgba(255, 50, 50, ${0.3 + damagePercent * 0.5})`);
                gradient.addColorStop(1, `rgba(255, 0, 0, ${0.6 + damagePercent * 0.4})`);

                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x, y, damageWidth, layout.h);
            }

            // Border
            this.ctx.strokeStyle = ship.color;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, layout.w, layout.h);

            // Draw system letter label in center
            const label = systemLabels[systemName] || '?';
            this.ctx.fillStyle = '#0f0';
            this.ctx.font = `${layout.h * 0.6}px monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(label, layout.x, layout.y);

            this.ctx.restore();
        }
    }

    drawShields(ship) {
        if (!ship.shields || !ship.shields.isUp()) return;

        const size = ship.getShipSize();
        const shieldRadiusX = size * 1.3; // Horizontal radius (wider)
        const shieldRadiusY = size * 1.1; // Vertical radius (taller)
        
        // Base alpha (faint when not hit)
        let alpha = 0.15;
        
        // Brighten momentarily on hit
        if (ship.shields.hitFlashAlpha && ship.shields.hitFlashAlpha > 0) {
            alpha = 0.6 + (ship.shields.hitFlashAlpha * 0.4); // Bright flash on hit
        }

        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        
        // Draw faint ovoid shield
        this.ctx.strokeStyle = '#00ffff'; // Cyan
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = '#00ffff';
        
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, shieldRadiusX, shieldRadiusY, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Draw inner glow
        this.ctx.globalAlpha = alpha * 0.3;
        this.ctx.strokeStyle = '#00aaff';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, shieldRadiusX * 0.9, shieldRadiusY * 0.9, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    drawDebugInfo(ship) {
        this.ctx.save();

        // REMOVED: Yellow velocity vector line
        // User requested removal - was distracting visual element
        // (Velocity vector drawing commented out)

        // Draw firing arcs (if enabled)
        if (CONFIG.DEBUG_SHOW_ARCS) {
            this.drawFiringArcs(ship);
        }

        this.ctx.restore();
    }

    drawFiringArcs(ship) {
        this.ctx.save();
        this.ctx.translate(ship.x, ship.y);

        // Example: forward 270° arc
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, ship.getShipSize() * 2,
                    MathUtils.toRadians(ship.rotation - 135),
                    MathUtils.toRadians(ship.rotation + 135));
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Check if beam weapons are ready to fire (off cooldown)
     * @param {Ship} ship - The ship
     * @param {number} arcCenter - Optional arc center (0 for forward, 180 for aft). If not provided, checks any beam.
     */
    isBeamWeaponReady(ship, arcCenter = null) {
        if (!ship.weapons) return false;

        const currentTime = performance.now() / 1000;

        // Check specific arc or any beam weapon
        for (const weapon of ship.weapons) {
            if (weapon instanceof BeamWeapon || weapon instanceof PulseBeam) {
                // If arcCenter specified, only check that specific beam
                if (arcCenter !== null && weapon.arcCenter !== arcCenter) continue;

                // ContinuousBeam: check if NOT recharging
                if (weapon instanceof ContinuousBeam) {
                    if (!weapon.isRecharging(currentTime)) {
                        return true;
                    }
                } else if (weapon.canFire(currentTime)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if beam weapons are currently firing
     * @param {Ship} ship - The ship
     * @param {number} arcCenter - Optional arc center (0 for forward, 180 for aft)
     */
    isBeamWeaponFiring(ship, arcCenter = null) {
        if (!ship.weapons) return false;

        for (const weapon of ship.weapons) {
            if (weapon instanceof ContinuousBeam) {
                if (arcCenter !== null && weapon.arcCenter !== arcCenter) continue;
                if (weapon.isFiring) return true;
            }
        }

        return false;
    }

    /**
     * Check if beam weapons are recharging
     * @param {Ship} ship - The ship
     * @param {number} arcCenter - Optional arc center (0 for forward, 180 for aft)
     */
    isBeamWeaponRecharging(ship, arcCenter = null) {
        if (!ship.weapons) return false;

        const currentTime = performance.now() / 1000;

        for (const weapon of ship.weapons) {
            if (weapon instanceof ContinuousBeam) {
                if (arcCenter !== null && weapon.arcCenter !== arcCenter) continue;
                if (weapon.isRecharging(currentTime)) return true;
            }
        }

        return false;
    }

    /**
     * Check if torpedo launchers are ready to fire
     * @param {Ship} ship - The ship
     * @param {number} arcCenter - Optional arc center (0 for forward, 180 for aft)
     */
    isTorpedoReady(ship, arcCenter = null) {
        if (!ship.weapons) return false;

        const currentTime = performance.now() / 1000;

        // Check specific arc or any torpedo launcher
        for (const weapon of ship.weapons) {
            if (weapon instanceof TorpedoLauncher || weapon instanceof DualTorpedoLauncher || weapon instanceof PlasmaTorpedo) {
                // If arcCenter specified, only check that specific launcher
                if (arcCenter !== null) {
                    const centers = weapon.arcCenters && weapon.arcCenters.length > 0 ? weapon.arcCenters : [weapon.arcCenter !== undefined ? weapon.arcCenter : 0];
                    if (!centers.includes(arcCenter)) continue;
                }

                if (weapon.canFire(currentTime)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Draw individual weapon firing point indicators
     * Shows visual feedback: dim when fired, dim when insufficient energy, bright when ready
     * @param {Ship} ship - The ship
     */
    drawWeaponIndicators(ship) {
        if (!ship.weapons || ship.weapons.length === 0) return;

        const currentTime = performance.now() / 1000;
        this.ctx.save();

        for (const weapon of ship.weapons) {
            // Skip destroyed weapons
            if (!weapon || weapon.hp <= 0) continue;

            // Only draw indicators for energy-using weapons
            if (!(weapon instanceof Disruptor || 
                  weapon instanceof BeamWeapon || 
                  weapon instanceof ContinuousBeam ||
                  weapon instanceof StreakBeam ||
                  weapon instanceof PulseBeam)) {
                continue;
            }

            // Skip weapons without position
            if (!weapon.position) continue;

            // Use weapon position directly - canvas is already rotated at line 32
            // No need to manually rotate here (would cause double rotation)
            const wx = weapon.position.x;
            const wy = weapon.position.y;

            // Determine weapon state
            let isReady = false;
            let isFiring = false;
            let isOnCooldown = false;
            let hasInsufficientEnergy = false;
            let weaponColor = '#4169E1'; // Default blue for disruptors
            let shadowColor = '#1E90FF';

            // Check weapon type and state
            if (weapon instanceof Disruptor) {
                weaponColor = '#4169E1'; // Royal blue
                shadowColor = '#1E90FF'; // Dodger blue
                isReady = weapon.canFire(currentTime);
                isOnCooldown = !isReady && (currentTime - weapon.lastFireTime < weapon.cooldown);
                isFiring = weapon.isBursting;
                
                // Check energy (need 9 energy for full burst)
                const burstEnergyCost = CONFIG.DISRUPTOR_ENERGY_COST * CONFIG.DISRUPTOR_BURST_COUNT;
                if (ship.energy && ship.energy.getTotalEnergy() < burstEnergyCost) {
                    hasInsufficientEnergy = true;
                }
            } else if (weapon instanceof ContinuousBeam) {
                weaponColor = '#FFA500'; // Orange
                shadowColor = '#FF8C00'; // Dark orange
                isReady = !weapon.isRecharging(currentTime);
                isFiring = weapon.isFiring;
                isOnCooldown = weapon.isRecharging(currentTime);
                
                // Check energy (beams drain 8 energy/sec per weapon)
                if (ship.energy && ship.energy.getTotalEnergy() <= 0) {
                    hasInsufficientEnergy = true;
                }
            } else if (weapon instanceof BeamWeapon || weapon instanceof StreakBeam) {
                weaponColor = '#FFA500'; // Orange
                shadowColor = '#FF8C00'; // Dark orange
                isReady = weapon.canFire(currentTime);
                isOnCooldown = !isReady && weapon.getCooldownPercentage && weapon.getCooldownPercentage(currentTime) < 1;
                
                // Check energy
                if (ship.energy && ship.energy.getTotalEnergy() <= 0) {
                    hasInsufficientEnergy = true;
                }
            } else if (weapon instanceof PulseBeam) {
                weaponColor = '#00FF00'; // Green
                shadowColor = '#00CC00'; // Dark green
                isReady = weapon.canFire(currentTime);
                isOnCooldown = !isReady && weapon.getCooldownPercentage && weapon.getCooldownPercentage(currentTime) < 1;
                
                // Check energy
                if (ship.energy && ship.energy.getTotalEnergy() <= 0) {
                    hasInsufficientEnergy = true;
                }
            }

            // Determine visual state with hysteresis to prevent flickering
            // Use previous state if state is rapidly changing
            if (!weapon._indicatorState) {
                weapon._indicatorState = { opacity: 0.5, useGlow: false, lastUpdate: currentTime };
            }
            
            const stateAge = currentTime - weapon._indicatorState.lastUpdate;
            const minStateDuration = 0.05; // Minimum 50ms between state changes to prevent flicker
            
            let targetOpacity = 1.0;
            let targetUseGlow = false;
            
            if (isFiring || isOnCooldown || hasInsufficientEnergy) {
                // Dim when firing, on cooldown, or insufficient energy
                targetOpacity = 0.3; // Dim
                targetUseGlow = false;
            } else if (isReady) {
                // Bright when ready with sufficient energy
                targetOpacity = 1.0; // Full brightness
                targetUseGlow = true;
            } else {
                // Default state (shouldn't happen, but safety)
                targetOpacity = 0.5;
                targetUseGlow = false;
            }
            
            // Only update state if enough time has passed or state is stable
            if (stateAge >= minStateDuration || 
                (targetOpacity === weapon._indicatorState.opacity && targetUseGlow === weapon._indicatorState.useGlow)) {
                weapon._indicatorState.opacity = targetOpacity;
                weapon._indicatorState.useGlow = targetUseGlow;
                weapon._indicatorState.lastUpdate = currentTime;
            }
            
            const opacity = weapon._indicatorState.opacity;
            const useGlow = weapon._indicatorState.useGlow;

            // Draw weapon firing point circle
            const radius = 4;
            const fillColor = this.hexToRgba(weaponColor, opacity * 0.6);
            const strokeColor = this.hexToRgba(weaponColor, opacity * 0.9);

            this.ctx.fillStyle = fillColor;
            this.ctx.strokeStyle = strokeColor;
            this.ctx.lineWidth = 2;

            if (useGlow) {
                this.ctx.shadowColor = this.hexToRgba(shadowColor, 0.8);
                this.ctx.shadowBlur = 8;
            } else {
                this.ctx.shadowBlur = 0;
            }

            this.ctx.beginPath();
            this.ctx.arc(wx, wy, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();

            // Reset shadow
            this.ctx.shadowBlur = 0;
        }

        this.ctx.restore();
    }

    /**
     * Helper: Convert hex color to rgba string
     * @param {string} hex - Hex color (e.g., '#FFA500')
     * @param {number} alpha - Alpha value (0-1)
     * @returns {string} rgba string
     */
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    /**
     * Draw torpedo count indicators (4 orangey-yellow dots)
     * @param {Ship} ship - The ship
     * @param {string} facing - 'forward' or 'aft'
     * @param {Object} band - The beam band or point object (not used, kept for compatibility)
     */
    drawTorpedoIndicators(ship, facing, band) {
        if (!ship.weapons) return;

        // Find torpedo launcher for this facing
        let torpedoLauncher = null;
        const normalizeFacingAngle = (angle) => MathUtils.normalizeAngle(angle);

        for (const weapon of ship.weapons) {
            if (weapon instanceof TorpedoLauncher || weapon instanceof DualTorpedoLauncher || weapon instanceof PlasmaTorpedo) {
                const centers = weapon.arcCenters && weapon.arcCenters.length > 0 ? weapon.arcCenters : [weapon.arcCenter !== undefined ? weapon.arcCenter : 0];
                const hasForward = centers.some(center => normalizeFacingAngle(center) === 0);
                const hasAft = centers.some(center => normalizeFacingAngle(center) === 180);

                if ((facing === 'forward' && hasForward) || (facing === 'aft' && hasAft)) {
                    torpedoLauncher = weapon;
                    break;
                }
            }
        }

        if (!torpedoLauncher) return;

        const loaded = torpedoLauncher.getLoadedCount();
        const maxLoaded = torpedoLauncher.maxLoaded || 4;
        const size = ship.getShipSize();

        // Position dots at top (forward) or bottom (aft) of ship
        const dotRadius = 2; // Slightly larger
        const dotSpacing = 6;
        const totalWidth = (maxLoaded - 1) * dotSpacing;
        const startX = -totalWidth / 2; // Center horizontally

        // Y position: between beam band and hull for forward
        // Position further forward - halfway between band and ship nose
        let dotY;
        if (facing === 'forward') {
            // For forward facing: band is around centerY -15, radiusY ~8
            // Ship hull extends to about -size * 0.5
            // Position dots between the band's top edge and the hull
            const bandTopEdge = band ? (band.centerY - band.radiusY) : -15; // Top edge of beam band
            const shipNose = -size * 0.5; // Approximate nose position
            dotY = (bandTopEdge + shipNose) / 2; // Halfway between band and nose
        } else {
            // Aft position (keep original positioning for aft if needed)
            dotY = size * 0.4;
        }

        // Draw 4 dots
        for (let i = 0; i < maxLoaded; i++) {
            const dotX = startX + i * dotSpacing;

            if (i < loaded) {
                // Loaded torpedo - bright orangey-yellow
                this.ctx.fillStyle = 'rgba(255, 180, 0, 0.9)';
                this.ctx.strokeStyle = 'rgba(255, 140, 0, 1.0)';
            } else {
                // Empty slot - dim gray
                this.ctx.fillStyle = 'rgba(100, 100, 100, 0.4)';
                this.ctx.strokeStyle = 'rgba(80, 80, 80, 0.6)';
            }

            this.ctx.lineWidth = 0.8;
            this.ctx.beginPath();
            this.ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    /**
     * Draw visual damage effects based on energy block state
     * This method is called during rendering to draw visual indicators
     * Actual particle creation happens in Ship.update()
     */
    drawDamageEffects(ship) {
        if (!ship.energy) return;
        
        const damageState = ship.energy.getDamageState();
        const size = ship.getShipSize();
        const currentTime = performance.now() / 1000;
        
        // 75% or less: Draw smoke wisps on ship
        if (damageState <= 0.75) {
            const smokeIntensity = (0.75 - damageState) / 0.75;
            const smokeCount = Math.floor(smokeIntensity * 3);
            
            for (let i = 0; i < smokeCount; i++) {
                const offsetX = (Math.random() - 0.5) * size * 0.7;
                const offsetY = (Math.random() - 0.5) * size * 0.5;
                
                // Animated smoke wisp
                const animPhase = (currentTime * 2 + i) % (Math.PI * 2);
                const alpha = 0.3 + Math.sin(animPhase) * 0.2;
                const scale = 1.0 + Math.sin(animPhase * 1.5) * 0.3;
                
                this.ctx.save();
                this.ctx.globalAlpha = alpha * smokeIntensity;
                this.ctx.fillStyle = '#444444';
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = '#222222';
                
                // Draw wispy smoke cloud
                const wispSize = (3 + Math.random() * 2) * scale;
                this.ctx.beginPath();
                this.ctx.arc(offsetX, offsetY, wispSize, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Inner darker core
                this.ctx.globalAlpha = alpha * 0.5 * smokeIntensity;
                this.ctx.fillStyle = '#222222';
                this.ctx.beginPath();
                this.ctx.arc(offsetX, offsetY, wispSize * 0.6, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            }
        }
        
        // 50% or less: Draw enhanced flame indicators on ship
        if (damageState <= 0.50) {
            const flameIntensity = (0.50 - damageState) / 0.50; // 0 to 1
            const flameCount = Math.floor(flameIntensity * 6);
            
            for (let i = 0; i < flameCount; i++) {
                const offsetX = (Math.random() - 0.5) * size * 0.6;
                const offsetY = (Math.random() - 0.5) * size * 0.4;
                
                // Animated flame
                const animPhase = (currentTime * 3 + i) % (Math.PI * 2);
                const alpha = 0.7 + Math.sin(animPhase) * 0.3;
                const flicker = 0.8 + Math.sin(animPhase * 2) * 0.2;
                
                this.ctx.save();
                this.ctx.globalAlpha = alpha * flameIntensity;
                
                // Outer flame (orange/yellow)
                const outerSize = (3 + Math.random() * 2) * flicker;
                const gradient = this.ctx.createRadialGradient(offsetX, offsetY, 0, offsetX, offsetY, outerSize);
                gradient.addColorStop(0, '#ffaa00');
                gradient.addColorStop(0.5, '#ff6600');
                gradient.addColorStop(1, '#ff3300');
                
                this.ctx.fillStyle = gradient;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#ff3300';
                this.ctx.beginPath();
                this.ctx.arc(offsetX, offsetY, outerSize, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Inner core (bright white/yellow)
                const innerSize = outerSize * 0.4;
                const innerGradient = this.ctx.createRadialGradient(offsetX, offsetY, 0, offsetX, offsetY, innerSize);
                innerGradient.addColorStop(0, '#ffffff');
                innerGradient.addColorStop(1, '#ffaa00');
                
                this.ctx.globalAlpha = alpha * 0.9 * flameIntensity;
                this.ctx.fillStyle = innerGradient;
                this.ctx.beginPath();
                this.ctx.arc(offsetX, offsetY, innerSize, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            }
        }
        
        // 25% or less: Intense flames and sparks
        if (damageState <= 0.25) {
            const criticalIntensity = (0.25 - damageState) / 0.25;
            const sparkCount = Math.floor(criticalIntensity * 4);
            
            for (let i = 0; i < sparkCount; i++) {
                const offsetX = (Math.random() - 0.5) * size * 0.8;
                const offsetY = (Math.random() - 0.5) * size * 0.6;
                
                this.ctx.save();
                this.ctx.globalAlpha = 0.8 + Math.random() * 0.2;
                this.ctx.fillStyle = Math.random() > 0.5 ? '#ffff00' : '#ffaa00';
                this.ctx.shadowBlur = 6;
                this.ctx.shadowColor = '#ffaa00';
                this.ctx.beginPath();
                this.ctx.arc(offsetX, offsetY, 1 + Math.random(), 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        }
    }

    /**
     * Draw tactical warp visual effects
     */
    drawTacticalWarpEffects(ship) {
        if (!ship.tacticalWarpActive) return;

        this.ctx.save();
        this.ctx.translate(ship.x, ship.y);
        this.ctx.rotate(MathUtils.toRadians(ship.rotation));

        const size = ship.getShipSize();
        const velocityAngle = MathUtils.toRadians(ship.rotation);
        const speed = ship.currentSpeed || 0;

        // Draw warp trail particles (blue/cyan streaks behind ship)
        const trailLength = Math.min(speed * 0.1, 100); // Trail length based on speed
        const particleCount = Math.floor(trailLength / 5);

        for (let i = 0; i < particleCount; i++) {
            const distance = -trailLength + (i * 5);
            const offsetX = Math.cos(velocityAngle) * distance;
            const offsetY = Math.sin(velocityAngle) * distance;
            const spread = (Math.random() - 0.5) * size * 0.3;

            this.ctx.save();
            this.ctx.globalAlpha = 0.3 + (i / particleCount) * 0.5;
            this.ctx.strokeStyle = i % 2 === 0 ? '#00ffff' : '#0088ff';
            this.ctx.lineWidth = 2;
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = '#00ffff';
            this.ctx.beginPath();
            this.ctx.moveTo(offsetX, offsetY);
            this.ctx.lineTo(offsetX - Math.cos(velocityAngle) * 10, offsetY - Math.sin(velocityAngle) * 10);
            this.ctx.stroke();
            this.ctx.restore();
        }

        // Draw motion blur effect (stretched ship outline)
        this.ctx.save();
        this.ctx.globalAlpha = 0.2;
        this.ctx.fillStyle = ship.color || '#0f0';
        this.ctx.scale(1.0, 0.3); // Stretch vertically (along velocity)
        if (ship.vertices && ship.vertices.length > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(ship.vertices[0].x, ship.vertices[0].y);
            for (let i = 1; i < ship.vertices.length; i++) {
                this.ctx.lineTo(ship.vertices[i].x, ship.vertices[i].y);
            }
            this.ctx.closePath();
            this.ctx.fill();
        }
        this.ctx.restore();

        // Draw energy drain visual indicator (glowing ring)
        if (ship.energy) {
            const energyPercent = ship.energy.getTotalEnergy() / ship.energy.getMaxEnergy();
            this.ctx.save();
            this.ctx.globalAlpha = 0.4;
            this.ctx.strokeStyle = energyPercent < 0.2 ? '#ff0000' : '#00ffff';
            this.ctx.lineWidth = 3;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#00ffff';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();
        }

        this.ctx.restore();
    }

    /**
     * Draw quantum drive visual effects
     */
    drawQuantumDriveEffects(ship) {
        if (!ship || !ship.advancedSystems || !ship.advancedSystems.quantumDrive) return;

        // Check if quantum drive was recently used (within last 0.5 seconds)
        const currentTime = performance.now() / 1000;
        const qd = ship.advancedSystems.quantumDrive;
        const timeSinceUse = currentTime - (qd.lastUseTime || 0);
        
        if (timeSinceUse < 0.5 && timeSinceUse > 0) {
            // Draw flash/particle burst at ship location
            this.ctx.save();
            this.ctx.translate(ship.x, ship.y);
            
            const size = ship.getShipSize();
            const flashAlpha = 1 - (timeSinceUse / 0.5);
            
            // Draw flash burst
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
            gradient.addColorStop(0, `rgba(170, 0, 170, ${flashAlpha})`);
            gradient.addColorStop(0.5, `rgba(170, 0, 170, ${flashAlpha * 0.5})`);
            gradient.addColorStop(1, 'rgba(170, 0, 170, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw particles
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const distance = size * (1 + timeSinceUse * 2);
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                this.ctx.fillStyle = `rgba(170, 0, 170, ${flashAlpha})`;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        }
    }

    /**
     * Draw phase shift visual effects
     */
    drawPhaseShiftEffects(ship) {
        if (!ship || !ship.advancedSystems || !ship.advancedSystems.phaseShift) return;
        
        // Only draw effects when phase shift is actually active
        if (ship.advancedSystems.phaseShift.active) {
            const size = ship.getShipSize();
            
            // Make ship translucent (50% alpha)
            this.ctx.globalAlpha = 0.5;
            
            // Draw glowing outline (context already translated and rotated in render())
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 3;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#00ffff';
            
            if (ship.vertices && ship.vertices.length > 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(ship.vertices[0].x, ship.vertices[0].y);
                for (let i = 1; i < ship.vertices.length; i++) {
                    this.ctx.lineTo(ship.vertices[i].x, ship.vertices[i].y);
                }
                this.ctx.closePath();
                this.ctx.stroke();
            }
            
            // Draw particle effects around ship
            const particleCount = 6;
            for (let i = 0; i < particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2;
                const distance = size * 1.5;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                this.ctx.fillStyle = '#00ffff';
                this.ctx.globalAlpha = 0.6;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.globalAlpha = 1.0;
        }
    }

    /**
     * Draw energy shield visual indicator
     */
    drawEnergyShield(ship) {
        if (!ship || !ship.advancedSystems || !ship.advancedSystems.energyShield) return;
        
        // Context already translated and rotated in render() function
        const size = ship.getShipSize();
        
        // Draw energy shield ring
        this.ctx.strokeStyle = '#aa00aa';
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.6;
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = '#aa00aa';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1.0;
    }

    /**
     * Draw laser shield visual indicator
     */
    drawLaserShield(ship) {
        if (!ship || !ship.advancedSystems || !ship.advancedSystems.laserShield) return;
        
        // Context already translated and rotated in render() function
        const size = ship.getShipSize();
        
        // Draw laser shield ring
        this.ctx.strokeStyle = '#00aa00';
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.6;
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = '#00aa00';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1.0;
    }
}



