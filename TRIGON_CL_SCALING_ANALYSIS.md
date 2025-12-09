# Trigon CL Weapon Scaling Analysis

## Current Implementation

**Trigon CL uses hardcoded weapon positions** (no JSON file exists):
- `positionKey: 'trigonWingPortFwd'` → `WEAPON_POSITIONS.trigonWingPortFwd`
- Position: `{ x: -0.6, y: -0.25, scaled: true }`
- Ship size (CL): `CONFIG.SHIP_LENGTH_CL = 60`

**Final weapon position calculation:**
```javascript
// In cloneWeaponPosition() when scaled: true
x: -0.6 * 60 = -36 pixels
y: -0.25 * 60 = -15 pixels
```

## Scaling Logic

1. **Hardcoded positions** (current for Trigon CL):
   - Uses `WEAPON_POSITIONS` with `scaled: true`
   - Multiplies by `shipSize` (60 for CL)
   - Result: `-36, -15` pixels

2. **JSON positions** (if JSON file existed):
   - Would use explicit `position: { x, y }` from JSON
   - Would apply `scaleFactor` from JSON (default: 1)
   - Would also apply `shipImageData.scale` if available
   - Formula: `x * scaleFactor * shipImageData.scale`

## Issue

**No Trigon CL JSON file exists**, so:
- Weapon positions use hardcoded `WEAPON_POSITIONS` values
- Scaling is based on `CONFIG.SHIP_LENGTH_CL` (60 pixels)
- No way to adjust scaling via JSON `scaleFactor`

## Recommendation

**Create `TRIGON_CL_weapons.json`** with:
- Explicit weapon positions matching hardcoded values
- `scaleFactor: 1` (or appropriate value)
- This would allow scaling adjustment via JSON

**Example JSON structure:**
```json
{
  "faction": "TRIGON",
  "shipClass": "CL",
  "scaleFactor": 1,
  "weapons": [
    {
      "type": "disruptor",
      "name": "Port Wing Disruptor",
      "arc": 120,
      "arcCenter": 0,
      "position": {
        "x": -0.6,
        "y": -0.25
      }
    },
    {
      "type": "disruptor",
      "name": "Starboard Wing Disruptor",
      "arc": 120,
      "arcCenter": 0,
      "position": {
        "x": 0.6,
        "y": -0.25
      }
    }
  ]
}
```

**With this JSON:**
- Positions would be: `-0.6 * 1 * shipImageData.scale` and `-0.25 * 1 * shipImageData.scale`
- `shipImageData.scale` = `shipSize / max(imageWidth, imageHeight) * 2`
- For CL: `60 / max(imageWidth, imageHeight) * 2`

## Current vs Expected

**Current (hardcoded):**
- Position: `-36, -15` pixels (fixed, based on ship size 60)

**If JSON existed with scaleFactor:**
- Position: `-0.6 * scaleFactor * shipImageData.scale`
- Would scale based on actual ship image dimensions

## Action Items

1. Check if Trigon CL ship image dimensions match expected scaling
2. Create `TRIGON_CL_weapons.json` if scaling needs adjustment
3. Verify weapon mount positions align with ship visual in-game

