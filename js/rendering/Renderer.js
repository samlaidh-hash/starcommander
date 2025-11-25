// Top-level Renderer - orchestrates drawing of world and entities
class Renderer {
    constructor(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;
        this.shipRenderer = new ShipRenderer(ctx);
        this.uiRenderer = new UIRenderer();
        this.environmentRenderer = new EnvironmentRenderer(ctx);
    }

    render(entities, warpProgress = 0) {
        // Apply camera transform
        if (this.camera) {
            this.camera.applyTransform(this.ctx);
        }

        // Render star field background
        this.renderStarField();

        // Render entities
        this.renderEntities(entities);

        // Remove camera transform
        this.camera.removeTransform(this.ctx);
    }

    renderWithoutBackground(entities, warpProgress = 0) {
        // Apply camera transform
        if (this.camera) {
            this.camera.applyTransform(this.ctx);
        }

        // Render entities (starfield already rendered before camera transform)
        this.renderEntities(entities);

        // Remove camera transform
        this.camera.removeTransform(this.ctx);
    }

    renderEntities(entities) {
        if (!entities || entities.length === 0) {
            console.warn('Renderer: No entities to render');
            return;
        }
        for (const entity of entities) {
            if (!entity.active) continue;

            switch (entity.type) {
                case 'ship':
                    this.shipRenderer.render(entity);
                    break;
                case 'asteroid':
                case 'environment':
                    this.environmentRenderer.render(entity);
                    break;
                case 'projectile':
                    this.renderProjectile(entity);
                    break;
                case 'decoy':
                case 'mine':
                    this.renderSimpleMarker(entity);
                    break;
                default:
                    // Generic entity with render method
                    if (typeof entity.render === 'function') {
                        entity.render(this.ctx, this.camera);
                    } else {
                        this.renderGenericEntity(entity);
                    }
                    break;
            }
        }
    }

    renderProjectile(p) {
        // If projectile has custom render method, use it
        if (typeof p.render === 'function') {
            p.render(this.ctx, this.camera);
            return;
        }

        // Otherwise use generic circle rendering
        // Note: Camera transform already applied, use world coords directly
        this.ctx.save();
        this.ctx.fillStyle = (p.projectileType === 'plasma') ? '#00ff88'
                           : (p.projectileType === 'torpedo') ? '#ffaa00'
                           : (p.projectileType === 'disruptor') ? '#ff00ff'
                           : '#ff5555';

        // Make projectiles MUCH bigger so they're visible at reduced resolution
        const size = (p.projectileType === 'torpedo' || p.projectileType === 'plasma') ? 8 : 4;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        this.ctx.fill();

        // Add glow effect for torpedoes
        if (p.projectileType === 'torpedo' || p.projectileType === 'plasma') {
            this.ctx.globalAlpha = 0.5;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
        }

        this.ctx.restore();
    }

    renderSimpleMarker(e) {
        // Note: Camera transform already applied, use world coords directly
        this.ctx.save();
        this.ctx.strokeStyle = (e.type === 'decoy') ? '#00ffff' : '#ff9900';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(e.x, e.y, 6, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
    }

    renderGenericEntity(e) {
        // Note: Camera transform already applied, use world coords directly
        this.ctx.save();
        this.ctx.fillStyle = '#cccccc';
        const r = e.radius || 12;
        this.ctx.beginPath();
        this.ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    renderStarField() {
        // Simple, clean starfield with random-looking distribution
        this.ctx.save();
        this.ctx.fillStyle = '#ffffff';

        // Safety check for camera
        if (!this.camera || typeof this.camera.x !== 'number' || typeof this.camera.y !== 'number') {
            this.ctx.restore();
            return;
        }

        // Use camera position to create subtle parallax effect
        const offsetX = (this.camera.x || 0) * 0.05;
        const offsetY = (this.camera.y || 0) * 0.05;

        const cameraX = this.camera.x || 0;
        const cameraY = this.camera.y || 0;

        // Account for zoom - when zoomed out, viewport is larger in world coordinates
        const zoom = this.camera.zoom || 1.0;
        const cameraWidth = (this.camera.width || 1920) / zoom;
        const cameraHeight = (this.camera.height || 1080) / zoom;

        // Star distribution - larger cells, fewer stars
        const cellSize = 120;
        const startX = Math.floor((cameraX - cameraWidth/2 - 200) / cellSize) * cellSize;
        const startY = Math.floor((cameraY - cameraHeight/2 - 200) / cellSize) * cellSize;
        const endX = cameraX + cameraWidth/2 + 200;
        const endY = cameraY + cameraHeight/2 + 200;

        for (let x = startX; x < endX; x += cellSize) {
            for (let y = startY; y < endY; y += cellSize) {
                // Hash function for consistent pseudo-random placement
                const hash = Math.abs((x * 73856093) ^ (y * 19349663)) % 2147483647;

                // Only about 30% of cells get a star
                if (hash % 10 < 3) {
                    // Random offset within cell
                    const offsetInCellX = (hash % 1000) / 1000 * cellSize;
                    const offsetInCellY = ((hash >> 10) % 1000) / 1000 * cellSize;

                    const starX = x + offsetInCellX + offsetX;
                    const starY = y + offsetInCellY + offsetY;

                    // Simple size variation (mostly 1px, some 2px)
                    const size = (hash % 10 < 8) ? 1 : 2;

                    if (isFinite(starX) && isFinite(starY)) {
                        this.ctx.beginPath();
                        this.ctx.arc(starX, starY, size, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                }
            }
        }

        this.ctx.restore();
    }

    /**
     * Render ping wave effect
     * @param {Object} pingWaveData - { x, y, radius, maxRadius, alpha }
     */
    renderPingWave(pingWaveData) {
        if (!pingWaveData) return;

        // Apply camera transform
        if (this.camera) {
            this.camera.applyTransform(this.ctx);
        }

        this.ctx.save();

        // Cyan ping wave with glow effect
        this.ctx.globalAlpha = pingWaveData.alpha * 0.6;
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#00ffff';

        // Draw expanding circle
        this.ctx.beginPath();
        this.ctx.arc(pingWaveData.x, pingWaveData.y, pingWaveData.radius, 0, Math.PI * 2);
        this.ctx.stroke();

        // Draw inner glow ring
        this.ctx.globalAlpha = pingWaveData.alpha * 0.3;
        this.ctx.lineWidth = 8;
        this.ctx.shadowBlur = 25;
        this.ctx.beginPath();
        this.ctx.arc(pingWaveData.x, pingWaveData.y, pingWaveData.radius, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.restore();

        // Remove camera transform
        if (this.camera) {
            this.camera.removeTransform(this.ctx);
        }
    }
}