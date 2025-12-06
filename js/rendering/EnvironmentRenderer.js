// EnvironmentRenderer - draws asteroids, hazards, planets, dust clouds
class EnvironmentRenderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    render(entity) {
        if (!entity || !entity.active) return; // Safety check
        
        if (entity.type === 'asteroid') {
            this.renderAsteroid(entity);
        } else if (entity instanceof EnvironmentalHazard || entity.type === 'environment') {
            this.renderHazard(entity);
        } else {
            // Fallback: simple circle
            this.ctx.save();
            this.ctx.fillStyle = '#888';
            this.ctx.beginPath();
            this.ctx.arc(entity.x, entity.y, (entity.radius || 20), 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    renderAsteroid(asteroid) {
        this.ctx.save();
        this.ctx.translate(asteroid.x, asteroid.y);
        this.ctx.rotate(MathUtils.toRadians(asteroid.rotation || 0));
        
        // Calculate damage percentage for visual feedback
        const damagePercent = asteroid.getDamagePercent ? asteroid.getDamagePercent() : 0;
        
        // Base color gets darker as damage increases
        const baseGray = 102; // #666666
        const darkGray = 40;  // Darker when damaged
        const grayValue = Math.floor(baseGray - (baseGray - darkGray) * damagePercent);
        const fillColor = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
        
        // Stroke color gets redder as damage increases
        const strokeGray = 153; // #999999
        const strokeRed = Math.floor(255 * damagePercent);
        const strokeColor = `rgb(${Math.min(255, strokeGray + strokeRed)}, ${strokeGray}, ${strokeGray})`;
        
        this.ctx.fillStyle = fillColor;
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 1 + damagePercent * 2; // Thicker stroke when damaged

        if (asteroid.vertices && asteroid.vertices.length > 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(asteroid.vertices[0].x, asteroid.vertices[0].y);
            for (let i = 1; i < asteroid.vertices.length; i++) {
                this.ctx.lineTo(asteroid.vertices[i].x, asteroid.vertices[i].y);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
            
            // Draw damage cracks when damaged
            if (damagePercent > 0.3) {
                this.drawDamageCracks(asteroid, damagePercent);
            }
        } else {
            // Simple circle
            const r = asteroid.radius || 20;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, r, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Draw damage cracks on circle when damaged
            if (damagePercent > 0.3) {
                this.drawDamageCracks(asteroid, damagePercent);
            }
        }
        
        // Draw damage flash if recently hit
        if (asteroid.damageFlashAlpha && asteroid.damageFlashAlpha > 0) {
            this.ctx.globalAlpha = asteroid.damageFlashAlpha;
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.lineWidth = 3;
            if (asteroid.vertices && asteroid.vertices.length > 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(asteroid.vertices[0].x, asteroid.vertices[0].y);
                for (let i = 1; i < asteroid.vertices.length; i++) {
                    this.ctx.lineTo(asteroid.vertices[i].x, asteroid.vertices[i].y);
                }
                this.ctx.closePath();
                this.ctx.stroke();
            } else {
                const r = asteroid.radius || 20;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, r, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            this.ctx.globalAlpha = 1.0;
        }
        
        // Draw HP bar above asteroid if damaged
        if (damagePercent > 0) {
            this.drawAsteroidHPBar(asteroid, damagePercent);
        }

        this.ctx.restore();
    }
    
    /**
     * Draw damage cracks on asteroid
     */
    drawDamageCracks(asteroid, damagePercent) {
        const crackCount = Math.floor(damagePercent * 5); // 0-5 cracks based on damage
        const radius = asteroid.radius || 20;
        
        this.ctx.strokeStyle = `rgba(100, 0, 0, ${0.3 + damagePercent * 0.5})`;
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < crackCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const startDist = radius * (0.3 + Math.random() * 0.3);
            const endDist = radius * (0.7 + Math.random() * 0.3);
            
            this.ctx.beginPath();
            this.ctx.moveTo(
                Math.cos(angle) * startDist,
                Math.sin(angle) * startDist
            );
            this.ctx.lineTo(
                Math.cos(angle) * endDist,
                Math.sin(angle) * endDist
            );
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw HP bar above asteroid
     */
    drawAsteroidHPBar(asteroid, damagePercent) {
        const radius = asteroid.radius || 20;
        const barWidth = radius * 2;
        const barHeight = 4;
        const barY = -radius - 10;
        
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);
        
        // HP fill (green to red based on damage)
        const hpPercent = 1 - damagePercent;
        const fillWidth = barWidth * hpPercent;
        const red = Math.floor(255 * damagePercent);
        const green = Math.floor(255 * hpPercent);
        this.ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
        this.ctx.fillRect(-barWidth / 2, barY, fillWidth, barHeight);
        
        // Border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(-barWidth / 2, barY, barWidth, barHeight);
    }

    renderHazard(hazard) {
        if (hazard.hazardType === 'planet') {
            this.renderPlanet(hazard);
        } else if (hazard.hazardType === 'dust') {
            this.renderDustCloud(hazard);
        } else if (hazard.hazardType === 'collapsar') {
            this.renderCollapsar(hazard);
        } else {
            // Generic
            this.ctx.save();
            this.ctx.fillStyle = hazard.color || '#444';
            this.ctx.beginPath();
            this.ctx.arc(hazard.x, hazard.y, (hazard.radius || 30), 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    renderPlanet(planet) {
        this.ctx.save();
        this.ctx.fillStyle = planet.color || '#8844aa';
        this.ctx.beginPath();
        this.ctx.arc(planet.x, planet.y, planet.radius || 150, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    renderDustCloud(cloud) {
        this.ctx.save();
        this.ctx.fillStyle = cloud.color || 'rgba(128,128,128,0.3)';
        this.ctx.beginPath();
        this.ctx.arc(cloud.x, cloud.y, cloud.radius || 100, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    renderCollapsar(collapsar) {
        // Draw event horizon
        this.ctx.save();
        const r = collapsar.radius || 30;
        const color = collapsar.eventHorizonColor || '#4400ff';
        const gradient = this.ctx.createRadialGradient(collapsar.x, collapsar.y, r * 0.6, collapsar.x, collapsar.y, r * 1.2);
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(0.7, color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(collapsar.x, collapsar.y, r * 1.2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
}