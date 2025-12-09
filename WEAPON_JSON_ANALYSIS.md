# Weapon JSON Files Analysis

## Current Status: ❌ JSON Files NOT Being Used

### Findings

1. **Weapon JSON files exist** but are **NOT loaded** by the game code
   - Files like `COMMONWEALTH_DD_weapons.json`, `ANDROMEDAN_CA_weapons.json`, etc. exist
   - `getShipLoadoutSpecs()` uses hardcoded `SHIP_WEAPON_LOADOUTS` object instead

2. **Ship Image Sizes** are determined from PNG image dimensions
   - `ShipRenderer.js` uses `img.naturalWidth` and `img.naturalHeight`
   - Scaled based on `CONFIG.SHIP_LENGTH_*` values
   - **NOT** using JSON `scaleFactor` field

3. **Firing Mount Locations** use hardcoded position keys
   - `SHIP_WEAPON_LOADOUTS` uses `positionKey` (e.g., `'forwardCenter'`)
   - Maps to hardcoded `WEAPON_POSITIONS` object
   - JSON files have explicit `position: { x, y }` coordinates that are **NOT used**

### JSON File Structure

```json
{
  "faction": "COMMONWEALTH",
  "shipClass": "DD",
  "scaleFactor": 1,  // ❌ NOT USED
  "weapons": [
    {
      "type": "continuousBeam",
      "position": { "x": 0, "y": -74 },  // ❌ NOT USED (uses positionKey instead)
      ...
    }
  ]
}
```

### Current Implementation

**Location:** `js/entities/Ship.js`

- `getShipLoadoutSpecs()` (line 260): Returns hardcoded loadouts from `SHIP_WEAPON_LOADOUTS`
- `buildWeaponFromSpec()` (line 159): Uses `positionKey` → `WEAPON_POSITIONS` mapping
- `cloneWeaponPosition()` (line 144): Supports explicit `position` but it's never provided from JSON

### What Should Happen

1. **Load JSON files** instead of using hardcoded `SHIP_WEAPON_LOADOUTS`
2. **Use JSON `position` coordinates** directly instead of `positionKey` mapping
3. **Use JSON `scaleFactor`** to scale weapon positions relative to ship image size
4. **Use ship image dimensions** from PNG to properly scale weapon mounts

### Recommendation

Implement JSON file loading system that:
- Fetches `{FACTION}_{SHIPCLASS}_weapons.json` files
- Uses explicit `position` coordinates from JSON
- Applies `scaleFactor` to position coordinates
- Scales positions based on actual PNG image dimensions



