/**
 * Star Sea - Math Utilities
 */

const MathUtils = {
    /**
     * Convert degrees to radians
     */
    toRadians(degrees) {
        return degrees * Math.PI / 180;
    },

    /**
     * Convert radians to degrees
     */
    toDegrees(radians) {
        return radians * 180 / Math.PI;
    },

    /**
     * Normalize angle to 0-360 range
     */
    normalizeAngle(angle) {
        while (angle < 0) angle += 360;
        while (angle >= 360) angle -= 360;
        return angle;
    },

    /**
     * Calculate distance between two points
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Calculate angle from point 1 to point 2 (in degrees, 0 = north/up)
     */
    angleBetween(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        let angle = Math.atan2(dx, -dy) * 180 / Math.PI;
        return this.normalizeAngle(angle);
    },

    /**
     * Calculate angle difference (shortest path)
     */
    angleDifference(angle1, angle2) {
        let diff = angle2 - angle1;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        return diff;
    },

    /**
     * Check if angle is within arc
     * @param {number} angle - Angle to check
     * @param {number} arcCenter - Center of arc (0 = ahead, 90 = right, 180 = behind, 270 = left)
     * @param {number} arcWidth - Width of arc in degrees
     */
    isInArc(angle, arcCenter, arcWidth) {
        const halfArc = arcWidth / 2;
        const diff = Math.abs(this.angleDifference(arcCenter, angle));
        return diff <= halfArc;
    },

    /**
     * Lerp (linear interpolation)
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    /**
     * Clamp value between min and max
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    /**
     * Random float between min and max
     */
    random(min, max) {
        return min + Math.random() * (max - min);
    },

    /**
     * Random integer between min and max (inclusive)
     */
    randomInt(min, max) {
        return Math.floor(this.random(min, max + 1));
    },

    /**
     * Calculate distance from a point to a line segment
     * @param {number} x1 - Line segment start X
     * @param {number} y1 - Line segment start Y
     * @param {number} x2 - Line segment end X
     * @param {number} y2 - Line segment end Y
     * @param {number} px - Point X
     * @param {number} py - Point Y
     * @returns {number} - Distance from point to line segment
     */
    distanceToLineSegment(x1, y1, x2, y2, px, py) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lengthSq = dx * dx + dy * dy;
        
        if (lengthSq === 0) {
            // Line segment is a point
            return this.distance(px, py, x1, y1);
        }
        
        // Calculate t (parameter along line segment, 0-1)
        const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSq));
        
        // Find closest point on line segment
        const closestX = x1 + t * dx;
        const closestY = y1 + t * dy;
        
        // Return distance from point to closest point on line segment
        return this.distance(px, py, closestX, closestY);
    },
    
    /**
     * Get point at distance and angle from origin
     */
    pointAtAngle(x, y, angle, distance) {
        const rad = this.toRadians(angle);
        return {
            x: x + Math.sin(rad) * distance,
            y: y - Math.cos(rad) * distance
        };
    },

    /**
     * Check if point is in circle
     */
    pointInCircle(px, py, cx, cy, radius) {
        return this.distance(px, py, cx, cy) <= radius;
    },

    /**
     * Get vector from angle and magnitude
     */
    vectorFromAngle(angle, magnitude) {
        const rad = this.toRadians(angle);
        return {
            x: Math.sin(rad) * magnitude,
            y: -Math.cos(rad) * magnitude
        };
    },

    /**
     * Get magnitude of vector
     */
    magnitude(vx, vy) {
        return Math.sqrt(vx * vx + vy * vy);
    },

    /**
     * Normalize vector
     */
    normalize(vx, vy) {
        const mag = this.magnitude(vx, vy);
        if (mag === 0) return { x: 0, y: 0 };
        return { x: vx / mag, y: vy / mag };
    },

    /**
     * Dot product
     */
    dot(v1x, v1y, v2x, v2y) {
        return v1x * v2x + v1y * v2y;
    },

    /**
     * Rotate point around origin
     */
    rotatePoint(x, y, cx, cy, angle) {
        const rad = this.toRadians(angle);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const dx = x - cx;
        const dy = y - cy;
        return {
            x: cx + dx * cos - dy * sin,
            y: cy + dx * sin + dy * cos
        };
    }
};
