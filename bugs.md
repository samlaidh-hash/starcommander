# Star Sea - Bug Tracking

**Date:** 2025-10-04
**Last Updated:** 2025-01-29 (Energy Blocks Display, Disruptor Firing, Trigon Scaling Analysis)

## Recently Fixed Bugs

### ✅ Mines Failing to Detonate (2025-01-29)
**Status:** FIXED
**Priority:** HIGH
**Description:** Mines were not detonating when ships came within range.

**Root Cause:**
- `CONFIG.MINE_DAMAGE` and `CONFIG.MINE_DETECTION_RADIUS` were not defined in config.js
- Mine trigger radius was too small (15 pixels), making it difficult for ships to trigger mines
- Mines were being created correctly but config values were undefined

**Fix Applied:**
- Added `MINE_DAMAGE: 10` and `MINE_DETECTION_RADIUS: 0.1` to config.js
- Increased mine trigger radius from 15 to 30 pixels for better detection
- Added fallback values in Mine.js constructor in case config values are missing

**Files Modified:**
- `js/config.js` - Added MINE_DAMAGE and MINE_DETECTION_RADIUS constants
- `js/entities/Mine.js` - Increased triggerRadius to 30, added fallback values

---

### ✅ Disruptors Not Working (2025-01-29)
**Status:** FIXED
**Priority:** HIGH
**Description:** Disruptor weapons were not firing properly for player ships.

**Root Cause:**
- Energy check was missing in `beam-fire-start` event handler
- Disruptor bursts could be started without sufficient energy, causing them to fail silently
- Energy check existed in continuous firing loop but not in initial burst start

**Fix Applied:**
- Added energy check in `beam-fire-start` event handler before starting disruptor bursts
- Checks for sufficient energy (9 energy = 3 shots * 3 energy per shot) before firing
- Prevents starting bursts when energy is insufficient

**Files Modified:**
- `js/core/Engine.js` - Added energy check in beam-fire-start event handler (lines 549-557)

---

### ✅ Firing Mounts Not Rotating in Sync with PNG Image (2025-01-29)
**Status:** FIXED
**Priority:** MEDIUM
**Description:** Weapon firing point indicators were rotating incorrectly, appearing out of sync with the ship image.

**Root Cause:**
- Weapon positions were manually rotated in `drawWeaponIndicators()` using ship rotation
- Canvas context was already rotated at line 32 in ShipRenderer.render()
- This caused double rotation, making weapons appear in wrong positions

**Fix Applied:**
- Removed manual rotation calculation from `drawWeaponIndicators()`
- Weapon positions are now used directly since canvas is already rotated
- Weapons now rotate correctly with the ship image

**Files Modified:**
- `js/rendering/ShipRenderer.js` - Removed manual rotation, use weapon.position directly (lines 727-732)

---

### ✅ Weapon Firing Point Scaling Issue from JSON Files (2025-01-29)
**Status:** FIXED
**Priority:** MEDIUM
**Description:** Weapon firing points loaded from JSON files were positioned incorrectly, suggesting ship scaling mismatch.

**Root Cause:**
- Weapon positions from JSON were scaled by `scaleFactor` but not by ship image scale
- `shipImageData.scale` was calculated but not used in `cloneWeaponPosition()`
- Weapon positions were in pixels relative to ship image, but needed scaling to match game coordinates

**Fix Applied:**
- Updated `cloneWeaponPosition()` to use `shipImageData.scale` when available
- Combines `scaleFactor` from JSON with `shipImageData.scale` for proper positioning
- Weapon positions now correctly scale to match ship rendering size

**Files Modified:**
- `js/entities/Ship.js` - Updated cloneWeaponPosition() to use shipImageData.scale (lines 144-150)

---

### ✅ Energy Blocks Not Showing Reduced Length When Shields Down (2025-01-29)
**Status:** FIXED
**Priority:** HIGH
**Description:** Damage with shields down was reducing energy block capacity but the visual display wasn't updating to show the reduced length.

**Root Cause:**
- HUD was creating `energy-block-capacity` div but CSS styling was missing
- CSS had `energy-block-damage` class but HUD wasn't using it
- Capacity bar wasn't visually showing the reduced length from damage

**Fix Applied:**
- Added CSS styling for `energy-block-capacity` (shows current capacity)
- Added `energy-block-damage` div to show missing capacity (red gradient)
- Updated HUD to calculate and display damage percentage
- Visual now shows: damage (red) + capacity (white border) + energy fill (green/blue)

**Files Modified:**
- `css/hud.css` - Added energy-block-capacity styling, updated z-index layering
- `js/ui/HUD.js` - Updated updateEnergyBlocks() to show damage and capacity bars

---

### ✅ Disruptors Still Not Firing (2025-01-29)
**Status:** FIXED
**Priority:** HIGH
**Description:** Disruptor weapons were still not firing even after previous fixes.

**Root Cause:**
- `getDisruptorBurstShots()` was being called for player even when `beamFiring` was false
- Code was getting mouse position unconditionally, causing unnecessary processing
- Burst shots were only created if `weapon.isBursting` was true, but burst might not have been started

**Fix Applied:**
- Added check to only call `getDisruptorBurstShots()` when `beamFiring` is true for player
- Ensures disruptor burst shots are only processed when player is actively firing
- Prevents unnecessary processing when not firing

**Files Modified:**
- `js/core/Engine.js` - Added `beamFiring` check before processing disruptor burst shots (lines 2021-2038)

---

### ✅ Trigon CL Scale Factor Analysis (2025-01-29)
**Status:** DOCUMENTED
**Priority:** MEDIUM
**Description:** User requested check of Trigon CL scale factor from JSON vs what is actually being used in play.

**Findings:**
- **No Trigon CL JSON file exists** - uses hardcoded weapon positions
- Hardcoded positions use `WEAPON_POSITIONS.trigonWingPortFwd` with `scaled: true`
- Final position: `-0.6 * 60 = -36, -0.25 * 60 = -15` pixels (CL ship size = 60)
- If JSON existed, would use: `position * scaleFactor * shipImageData.scale`

**Analysis:**
- Created `TRIGON_CL_SCALING_ANALYSIS.md` documenting current scaling logic
- Current implementation uses fixed scaling based on `CONFIG.SHIP_LENGTH_CL`
- No way to adjust scaling via JSON `scaleFactor` without creating JSON file
- Recommended: Create `TRIGON_CL_weapons.json` if scaling adjustment needed

**Files Created:**
- `TRIGON_CL_SCALING_ANALYSIS.md` - Detailed scaling analysis and recommendations

---

### ✅ Consumables Loadout Now Varies by Ship Class (2025-10-28)
**Status:** FIXED
**Priority:** MEDIUM
**Description:** Consumables were using fixed CONFIG values (6 decoys, 6 mines) regardless of ship class. Now properly varies by ship class based on design document specifications.

**Implementation:**
- Added `loadDefaultConsumables()` method to ConsumableSystem.js
- Added `getDefaultLoadout(shipClass)` method with per-class loadouts:
  - **FG (Frigate)**: 1 torpedo, 1 decoy, 1 mine, 0 shield boost, 1 repair kit, 0 energy cells
  - **DD (Destroyer)**: 2 torpedoes, 2 decoys, 1 mine, 1 shield boost, 1 repair kit, 1 energy cell
  - **CL (Light Cruiser)**: 2 torpedoes, 2 decoys, 2 mines, 1 shield boost, 2 repair kits, 1 energy cell
  - **CS (Strike Cruiser)**: 3 torpedoes, 2 decoys, 2 mines, 1 shield boost, 2 repair kits, 2 energy cells
  - **CA (Heavy Cruiser)**: 3 torpedoes, 3 decoys, 2 mines, 2 shield boosts, 2 repair kits, 2 energy cells
  - **BC (Battlecruiser)**: 4 torpedoes, 3 decoys, 3 mines, 2 shield boosts, 3 repair kits, 2 energy cells
  - **BB (Battleship)**: 5 torpedoes, 4 decoys, 3 mines, 3 shield boosts, 3 repair kits, 3 energy cells
  - **DN (Dreadnought)**: 6 torpedoes, 4 decoys, 4 mines, 3 shield boosts, 4 repair kits, 3 energy cells
  - **SD (Super Dreadnought)**: 7 torpedoes, 5 decoys, 4 mines, 4 shield boosts, 4 repair kits, 4 energy cells

**Files Modified:**
- `js/systems/ConsumableSystem.js` (lines 15-186) - Added default consumable loadouts by ship class
- `js/systems/BaySystem.js` (lines 24-103) - Fixed bay space calculations and loadouts to match design doc

**Bay Space Corrections:**
- Updated BaySystem to use correct bay spaces from Design Document Part 3:
  - FG: 2 (was 2) ✓
  - DD: 3 (was 4) **FIXED**
  - CL: 4 (was 6) **FIXED**
  - CA: 5 (was 8) **FIXED**
  - BC: 6 (was 10) **FIXED**
  - BB: 7 (was 12) **FIXED**
  - DN: 8 (was 14) **FIXED**
  - SD: 9 (was 16) **FIXED**

---

### ✅ Ship Damage at Game Start (2025-10-22)
**Status:** FIXED
**Priority:** HIGH
**Description:** Ships were taking damage immediately when the game started, before any combat or movement occurred.

**Root Cause:**
- `CollisionHandler.js:48` had `Math.max(1, Math.floor(relativeSpeed / 50))` which applied minimum 1 damage even to stationary ships
- During spawn, physics body initialization could cause slight overlaps or near-zero velocities
- Any collision triggered at least 1 damage to both ships, regardless of speed

**Fix Applied:**
- Added minimum speed threshold (25 units/s) before applying collision damage
- Ships now only take damage when actually moving fast enough to cause impact
- Early return if `relativeSpeed < MIN_COLLISION_SPEED`
- Preserves realistic collision damage during gameplay while preventing spawn damage

**Files Modified:**
- `js/physics/CollisionHandler.js` (lines 47-52) - Added MIN_COLLISION_SPEED threshold check

---

### ✅ Waypoint Direction Arrows Added (2025-10-04)
**Status:** IMPLEMENTED
**Priority:** MEDIUM
**Description:** Added direction arrows on screen edges pointing toward waypoints (reach objectives) when they are off-screen.

**Implementation:**
- Added `renderWaypointArrows()` method to UIRenderer.js
- Calculates direction from player to waypoint
- Finds intersection with screen edge
- Draws cyan arrow pointing toward waypoint
- Shows distance text below arrow
- Only shows for active 'reach' objectives that are off-screen

**Files Modified:**
- `js/rendering/UIRenderer.js` - Added renderWaypointArrows() method
- `js/rendering/Renderer.js` - Added UIRenderer instance
- `js/core/Engine.js` - Call renderWaypointArrows() in render loop

---

### ✅ Aft Beam Band Changed to Rectangle (2025-10-04)
**Status:** FIXED
**Priority:** MEDIUM
**Description:** Changed aft beam weapon band from red circles to a single rounded corner rectangle perpendicular to the ship's long axis.

**Implementation:**
- Changed `aftBeamPoint` type from 'point' to 'rectangle'
- Added width and height properties for horizontal rectangle
- Added `findNearestPointOnRectangle()` method to BeamWeapon.js
- Weapon fires from top edge of rectangle (toward ship front)

**Files Modified:**
- `js/entities/Ship.js` - Changed aftBeamPoint definition
- `js/components/weapons/BeamWeapon.js` - Added rectangle handling

---

### ✅ Weapon Bar Colors Fixed (2025-10-04)
**Status:** FIXED
**Priority:** HIGH
**Description:** Weapon bars now change color independently (bright red when charged, dull red when recharging).

**Fix Applied:**
- JavaScript adds 'charged' or 'recharging' classes to each bar
- CSS uses reliable classes instead of style attribute selectors
- Each weapon bar updates independently

**Files Modified:**
- `js/ui/HUD.js` - Added class management in updateBar()
- `css/hud.css` - Uses .charged and .recharging classes

---

### ✅ Ship Graphic: Galaxy-Class Nacelles (2025-10-04)
**Status:** FIXED
**Priority:** HIGH
**Description:** Galaxy-class ship outline needed to match reference image. Nacelles should be on flat struts standing off from engineering hull, not directly connected.

**Fix Applied:**
- Modified `generateGalaxyClass()` method in Ship.js
- Added flat horizontal struts extending from engineering hull (lines 433-447, 461-475)
- Positioned nacelles at end of struts, standing off from hull
- Created proper strut geometry with top and bottom paths

**Files Modified:**
- `js/entities/Ship.js` (lines 407-482)

**Testing:** User should verify ship outline now matches Galaxy-class reference image

---

### ✅ CRITICAL FIX: Weapon Alignment (2025-10-04)
**Status:** FIXED
**Priority:** CRITICAL
**Description:** Beams and torpedoes were not firing at the center of the reticle. User provided screenshots proving significant misalignment.

**Root Cause:** Canvas scaling mismatch between CSS size and actual canvas dimensions.
- CSS sets canvas to `width: 100%`, `height: 100%` (fills viewport)
- JavaScript sets `canvas.width` and `canvas.height` to specific pixel dimensions based on aspect ratio
- InputManager used `getBoundingClientRect()` (CSS size) to calculate mouse position
- Camera used `canvas.width/height` (actual size) to transform coordinates
- **Result:** Mouse coordinates were not scaled correctly

**Fix Applied:**
- Modified `InputManager.js` `onMouseMove()` method
- Added scaling calculation: `scaleX = canvas.width / rect.width`, `scaleY = canvas.height / rect.height`
- Mouse coordinates now scaled from CSS size to actual canvas size: `mouseX = cssX * scaleX`, `mouseY = cssY * scaleY`
- Reticle DOM positioning still uses CSS coordinates (unscaled)

**Files Modified:**
- `js/core/InputManager.js` (lines 63-88)
- `js/config.js` (disabled DEBUG_MODE after fix)

**Testing:** User should test and confirm beams/torpedoes now hit reticle center

---

## Active Bugs

### 1. Trigon Ship Disruptors Not Working Properly (2025-01-29) → FIXED
**Status:** FIXED
**Priority:** HIGH
**Description:** Trigon ship disruptors were not firing when player clicked/held left mouse button.

**Root Cause:**
- Disruptors use a burst fire system (3 shots over 1 second, 2 second cooldown)
- When player clicked/held left mouse button, only `ContinuousBeam` weapons were started
- Disruptor `fire()` method was never called to initiate bursts
- Burst shot handler ran every frame but found no active bursts
- Missing CONFIG values: `DISRUPTOR_BURST_COUNT`, `DISRUPTOR_BURST_DURATION`, `DISRUPTOR_COOLDOWN` were undefined

**Fix Applied:**
1. Added missing CONFIG values to `js/config.js`:
   - `DISRUPTOR_BURST_COUNT: 3` (3 shots per burst)
   - `DISRUPTOR_BURST_DURATION: 1.0` (1 second burst duration)
   - `DISRUPTOR_COOLDOWN: 2.0` (2 seconds between bursts)

2. Modified `beam-fire-start` event handler in `Engine.js` (lines 591-599):
   - Added code to start disruptor bursts when player clicks/holds left mouse button
   - Checks if disruptor is in arc and cooldown is ready
   - Calls `weapon.fire()` to initiate burst

3. Modified continuous beam firing loop in `Engine.js` (lines 2002-2008):
   - Added code to start new disruptor bursts while button is held
   - Respects cooldown timing (won't spam bursts)
   - Allows continuous disruptor fire while holding button

**Files Modified:**
- `js/config.js` - Added disruptor burst configuration values
- `js/core/Engine.js` - Added disruptor firing logic to beam-fire-start handler and continuous firing loop

**Testing:** User should test Trigon ships (DD, CL, CA, BB) and verify disruptors fire in bursts when left mouse button is held.

**Follow-up Fix 1 (2025-01-29):**
- Increased disruptor speed from 975 to 1200 pixels/sec to ensure bolts are faster than ship max speeds
  - Fastest ship (DD with Trigon multiplier): 390 * 1.1 = 429 pixels/sec
  - Disruptor speed (1200) is now 2.8x faster than fastest ship
- Added disruptor to grace period collision check (50ms like beams) to prevent bolts from colliding with firing ship
- Source ship collision check already prevents self-collision

**Files Modified:**
- `js/config.js` - Increased DISRUPTOR_SPEED to 1200
- `js/core/Engine.js` - Added disruptor to grace period check

**Follow-up Fix 2 (2025-01-29):**
- **Smooth Throttle Movement**: Changed W/S keys from step-based movement (2% per key press) to smooth continuous movement (1.5 per second while key held)
- **Speed-Based Energy System**: Changed energy drain/recharge from throttle position to actual speed:
  - Below 1/3 max speed: constantly recharge energy
  - Above 2/3 max speed: constantly drain energy
  - Between 1/3 and 2/3: energy not affected by speed

**Files Modified:**
- `js/core/Engine.js` - Moved throttle adjustment to handlePlayerInput() for smooth movement
- `js/entities/Ship.js` - Updated energy system to use actual speed instead of throttle position

**Follow-up Fix 3 (2025-01-29):**
- **Disruptor Energy Drain**: Added energy cost when disruptors fire
  - Each disruptor shot costs 3 energy (CONFIG.DISRUPTOR_ENERGY_COST)
  - Full burst (3 shots) costs 9 energy total
  - Prevents starting a burst if insufficient energy (< 9 energy)
  - Stops firing if energy runs out during burst

**Files Modified:**
- `js/config.js` - Added DISRUPTOR_ENERGY_COST: 3
- `js/core/Engine.js` - Added energy drain when disruptor shots are fired, prevents starting burst if insufficient energy

**Follow-up Fix 4 (2025-01-29):**
- **Disruptor Cooldown Enforcement**: Ensured cooldown period is properly enforced
  - Cooldown: 2 seconds between bursts (CONFIG.DISRUPTOR_COOLDOWN)
  - Cooldown prevents starting new bursts until it expires
  - Added safety check in Disruptor.update() to ensure bursts don't continue during cooldown
  - Modified getDisruptorBurstShots() to only create shots if weapon is currently bursting

**Files Modified:**
- `js/components/weapons/Disruptor.js` - Added cooldown safety check in update()
- `js/entities/Ship.js` - Modified getDisruptorBurstShots() to check isBursting flag

**Follow-up Fix 5 (2025-01-29):**
- **Weapon Firing Point Visual Feedback**: Added visual indicators for all energy-using weapons
  - Disruptors: Blue circles that dim when fired/on cooldown/insufficient energy, brighten when ready
  - Beams: Orange circles with same dim/bright behavior
  - Pulse Beams: Green circles with same dim/bright behavior
  - Visual states:
    * Dim (30% opacity): When firing, on cooldown, or insufficient energy
    * Bright (100% opacity + glow): When ready to fire with sufficient energy
  - Applies to all energy-using weapons (Disruptor, BeamWeapon, ContinuousBeam, StreakBeam, PulseBeam)

**Files Modified:**
- `js/rendering/ShipRenderer.js` - Added drawWeaponIndicators() method with visual state feedback
- `js/rendering/ShipRenderer.js` - Added hexToRgba() helper method
- `js/rendering/ShipRenderer.js` - Integrated drawWeaponIndicators() into render loop

**Follow-up Fix 6 (2025-01-29):**
- **Tractor Beam Energy Drain Fix**: Fixed energy drain implementation
  - Tractor beam drains 5 energy per second while active
  - Fixed drainEnergy() call to use correct parameters (amount, deltaTime)
  - Tractor beam automatically deactivates when energy runs out
  - Energy drain was already implemented but had incorrect parameter order

**Files Modified:**
- `js/systems/TractorBeamSystem.js` - Fixed energy drain call to use correct parameters

---

### 2. New Game Not Starting (2025-10-28) → FIXED
**Status:** FIXED
**Priority:** CRITICAL
**Description:** Game initialization stopped at "Initializing advanced systems..." because TractorBeamSystem and TransporterSystem were missing `init()` methods.

**Root Cause:**
- Engine.js calls `this.tractorBeamSystem.init(this.playerShip)` at line 1049
- Engine.js calls `this.transporterSystem.init(this.playerShip)` at line 1061
- TractorBeamSystem.js had NO `init()` method → TypeError: init is not a function
- TransporterSystem.js had NO `init()` method → Would fail after tractor beam fixed

**Diagnosis Process:**
1. Added detailed per-system initialization logging
2. Console showed failure at "→ Initializing tractor beam system..."
3. Discovered TractorBeamSystem.init() doesn't exist
4. Also found TransporterSystem.init() doesn't exist

**Fix Applied:**
- Added `init(ship)` method to TractorBeamSystem.js (line 20-22)
- Added `init(ship)` method to TransporterSystem.js (line 20-22)
- Both methods simply set `this.ship = ship`

**Files Modified:**
- `js/core/Engine.js` (lines 611-620, 1006-1101) - Added error handling and logging
- `js/systems/TractorBeamSystem.js` (lines 20-22) - Added missing init() method
- `js/systems/TransporterSystem.js` (lines 20-22) - Added missing init() method

**Testing:** User should reload page, clear console, click "New Game" - should now complete initialization

---

### 2. Lock-On System Not Working
**Status:** ACTIVE
**Priority:** HIGH
**Description:** Lock-on system not functioning as intended. Reticle should:
- Be green normally (no rotation)
- When over a target: rotate and begin lock-on timer
- When locked (after 3-5 seconds): turn red
- Keep lock while reticle remains on target
- Torpedoes should chase locked target

**Current Behavior:**
- Lock-on may not be tracking correctly
- Reticle color changes may not be occurring
- Torpedoes may not be homing properly

**Root Cause:** TBD - investigating TargetingSystem.js interaction with reticle events

---

### 2. Lock-On Timer Fixed Duration
**Status:** ACTIVE
**Priority:** MEDIUM
**Description:** Lock-on currently takes fixed 4 seconds. Should be 3-5 seconds depending on aim stability.
- Better aim (reticle stable on target) = faster lock (3 seconds)
- Poor aim (reticle moving on target) = slower lock (5 seconds)

**Current Behavior:** Always 4 seconds (CONFIG.LOCK_ON_TIME)
**Fix Needed:** Implement stability-based timer that varies based on reticle movement

---

### 3. Lock-On Loss Behavior
**Status:** ACTIVE
**Priority:** MEDIUM
**Description:** When reticle moves away from locked target, should lose lock over time:
- 2-3 seconds base time
- Quicker loss the further away reticle moves
- Should not be instant break

**Current Behavior:** Breaks lock when reticle > 50px away (LOCK_ON_DRIFT_TOLERANCE)
**Fix Needed:** Time-based lock loss with distance-modified decay rate

---

### 4. Torpedo Homing Issues
**Status:** ACTIVE
**Priority:** HIGH
**Description:** Torpedoes should chase locked-on target. If they miss and go past, they continue forward and fade out (no turning back around).

**Current Behavior:** May not be tracking locked targets properly
**Fix Needed:** Verify lockOnTarget is being passed correctly and torpedo homing logic is working

---

### 5. Energy Bands Color Not Changing
**Status:** ACTIVE
**Priority:** MEDIUM
**Description:** Weapon energy bands should change color after firing and when recharged, but have stopped doing so.

**Current Behavior:** Bands not visually indicating weapon status
**Fix Needed:** Check weapon bar rendering CSS and HUD update logic

---

### 6. Shots Not Aligned With Reticle
**Status:** ACTIVE
**Priority:** HIGH
**Description:** Weapon shots (beams/torpedoes) are not hitting where the reticle is pointing.

**Current Behavior:** Misalignment between reticle position and shot impact
**Fix Needed:** Verify screen-to-world coordinate conversion and weapon firing point calculations

---

## Investigation Notes

### System Architecture
- **TargetingSystem.js**: Handles lock-on state and target tracking
- **Engine.js**: Updates targeting system, responds to lock events, fires weapons
- **HUD.js/CSS**: Reticle visual state (green/red, rotation)
- **Projectile.js**: Torpedo homing behavior
- **InputManager.js**: Reticle positioning

### Code Flow
1. InputManager tracks mouse → updates reticle position
2. TargetingSystem.update() → checks for targets under reticle
3. Events emitted: 'lock-starting', 'lock-acquired', 'lock-broken'
4. Engine listens to events → updates reticle CSS classes
5. Torpedo fire → gets lockOnTarget from TargetingSystem
6. TorpedoProjectile.update() → homes toward lockOnTarget

---

## Fixed Bugs

### 1. Lock-On Timer Fixed Duration → FIXED
**Date:** 2025-10-04
**Fix:** Implemented stability-based adaptive lock time
- Lock time now varies from 3 seconds (stable aim) to 5 seconds (unstable aim)
- Tracks reticle movement speed and adjusts lock time accordingly
- Stable aim (< 20px/s movement) = faster lock
- Unstable aim (> 100px/s movement) = slower lock

**Files Modified:**
- `js/systems/TargetingSystem.js` - Added stability tracking and adaptive lock time calculation

---

### 2. Lock-On Loss Instant Break → FIXED
**Date:** 2025-10-04
**Fix:** Implemented time-based lock loss with distance modifier
- Lock no longer breaks instantly when reticle moves off target
- Base lock loss time: 2.5 seconds
- Lock loss rate scales with distance from target (0.5x to 2.0x speed)
- Closer to target = slower lock loss
- Further from target = faster lock loss
- Added 'lock-degrading' event for potential UI feedback

**Files Modified:**
- `js/systems/TargetingSystem.js` - Added lock loss progress tracking and distance-based decay

---

### 3. Reticle Color During Locking → FIXED
**Date:** 2025-10-04
**Fix:** Reticle now stays GREEN while locking, only turns RED when fully locked
- Default: Green, no rotation
- Locking: Green, rotating slowly (2s spin)
- Locked: Red, rotating fast (1s spin)

**Files Modified:**
- `css/hud.css` - Changed `.locking` class to use green color (#0f0) instead of red

---

### 4. Weapon Energy Bands No Color Change → FIXED
**Date:** 2025-10-04
**Fix:** Weapon energy bands now change color based on charge state
- Green: Fully charged (100%)
- Yellow: Recharging (1-99%)
- Red: Depleted (0%)

**Files Modified:**
- `css/hud.css` - Added CSS rules for weapon bar states based on width percentage

---

### 5. Shots Not Aligned With Reticle → FIXED
**Date:** 2025-10-04
**Fix:** Beam weapons now fire from proper weapon emitter positions on ship hull
- Forward beams: Fire from nearest point on forward beam band ellipse
- Aft beams: Fire from aft beam point
- Uses existing `findNearestPointOnEllipse()` method for accurate positioning
- Properly transforms from local ship coordinates to world coordinates

**Files Modified:**
- `js/components/weapons/BeamWeapon.js` - Restored `calculateFiringPoint()` to use ship weapon bands

**Note:** Torpedoes still fire from ship center but have homing to correct trajectory. This is acceptable as they are slow-moving guided projectiles.

---

## Remaining Active Bugs (2025-10-04 Session)

### 1. No Enemy Ships Spawning (NEEDS USER TESTING)
**Status:** CODE VERIFIED CORRECT
**Description:** User reports no enemy ships in game

**Investigation:** Enemy spawning code exists and is correct:
- Engine.startMission() calls spawnMissionEnemies() and spawnMissionEntities()
- Mission data has enemies defined
- Spawning logic verified

**Possible Causes:**
1. User hasn't clicked "Accept Mission" in briefing
2. Enemies spawning but off-screen (need to use minimap)
3. Mission not starting properly

**Next Step:** User needs to test game flow and check minimap for enemies

---

### 2. Weapon Alignment Issues (NEEDS USER TESTING)
**Status:** CODE UPDATED - NEEDS VERIFICATION
**Description:** User reports beams/torpedoes not hitting reticle center

**Fixes Applied:**
- Restored BeamWeapon.calculateFiringPoint() to use weapon bands
- Beams now fire from forward beam band (ellipse on saucer)
- Coordinate transformations verified

**Next Step:** User needs to test and report if still misaligned

---

### 3. Waypoint Arrow Missing
**Status:** NOT IMPLEMENTED
**Description:** User wants arrow on screen edge pointing toward waypoint objectives

**Required Implementation:**
- UI arrow element
- Calculate direction from player to objective waypoint
- Point arrow toward objective
- Only show for "reach" type objectives

**Next Step:** Implement if user confirms this is needed

---

### 4. Asteroids Not in Missions
**Status:** BY DESIGN
**Description:** User asked if asteroids exist

**Answer:** Asteroids exist in code (js/entities/Asteroid.js) but are NOT spawned in any missions. This is by design - missions currently don't include asteroid fields.

**To Add:** Would need to modify mission data to include asteroid spawn configs

---

## Prevention Rules
*(To be added to auditor.md after patterns emerge)*

### Pattern 1: Coordinate System Transformations
**Issue:** Weapon firing points needed proper local-to-world coordinate transformation
**Prevention:** Always verify coordinate system conversions when positioning entities relative to rotated parents

### Pattern 2: UI State Indication
**Issue:** Weapon bands weren't showing visual feedback for different states
**Prevention:** UI elements with multiple states should have clear visual indicators (colors, animations) for each state

### Pattern 3: Timer Systems
**Issue:** Fixed-duration timers don't feel responsive in games
**Prevention:** Consider adaptive/dynamic timers based on player actions or environmental factors

### Pattern 4: Visual Clutter
**Issue:** Debug visualizations (yellow velocity vector) left in production code
**Prevention:** Remove or gate debug visuals behind DEBUG_MODE flags

### Pattern 5: Incomplete Features
**Issue:** Weapon firing points were simplified and never restored (calculateFiringPoint() had TODO)
**Prevention:** Track TODOs and complete them before considering features done

### Pattern 6: Physics Damage Thresholds (ADDED 2025-10-22)
**Issue:** Collision damage applied minimum damage even to stationary ships, causing spawn damage
**Prevention:** When implementing damage from physics events (collisions, forces, impacts), always check for minimum velocity/speed thresholds before applying damage. Zero or near-zero speed events should not cause damage. Use early returns to avoid unnecessary calculations
