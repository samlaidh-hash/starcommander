# Star Sea - Session Memory: Major Rewrite Planning
**Date:** 2025-01-29
**Session:** Major Rewrite Discussion & Planning
**Status:** PLANNING PHASE

---

## Executive Summary

User has requested a major rewrite of the Star Sea game. This session is focused on understanding the scope and goals of the rewrite before making any changes.

---

## Current Project State

### Architecture Overview
- **Tech Stack:** HTML, CSS, JavaScript, Three.js, planck.js (Box2D)
- **Structure:** Modular design with HTML calling JS functions
- **Core Systems:**
  - Engine.js - Main game loop and system coordination
  - Physics system (planck.js integration)
  - Rendering system (Three.js + Canvas)
  - Combat systems (beams, torpedoes, shields)
  - Ship systems (internal systems, damage model)
  - Mission system
  - HUD/UI system
  - Audio system
  - Save/load system
  - Crew skill system

### File Structure
- `index.html` - Main game file
- `css/` - Stylesheets (main.css, hud.css, menus.css, ui.css)
- `js/` - Game code
  - `core/` - Engine services (Engine, Camera, InputManager, etc.)
  - `entities/` - Ship systems and game entities
  - `components/` - Ship subsystems (weapons, shields, physics)
  - `ui/` - HUD logic
  - `rendering/` - Canvas layers
  - `config/` - Shared data and configuration
  - `systems/` - Game systems (consumables, targeting, etc.)
  - `physics/` - Physics world and collision handling
  - `data/` - Mission data

### Current Features
- Multiple ship classes (FG, DD, CL, CS, CA, BC, BB, DN, SD)
- Multiple factions (Federation, Trigon, Scintilian, Pirate, Dhojan)
- Complex weapon systems (beams, torpedoes, various types)
- Shield system (4 quadrants)
- Internal ship systems with damage model
- Environmental entities (planets, stars, nebulas, asteroids, black holes)
- Mission system
- HUD with consumables display
- Minimap with filtering
- Physics-based movement (Newtonian/Non-Newtonian)
- Lock-on targeting system
- Consumables system (torpedoes, decoys, mines, shield boost, repair kits, energy cells)
- Crew skill system
- Audio system
- Save/load system

### Known Issues (from bugs.md)
- Lock-on system may have some issues
- Some weapon alignment issues (recently fixed)
- Various minor bugs documented

---

## Rewrite Planning Questions

### Scope Definition Needed
Before proceeding, need to clarify:
1. **What aspects need rewriting?**
   - Architecture/Code structure?
   - Specific game systems?
   - UI/UX?
   - Performance optimization?
   - Tech stack modernization?
   - Game mechanics changes?

2. **What are the goals?**
   - Better code organization?
   - Improved performance?
   - Easier maintenance?
   - New features?
   - Bug fixes?
   - Modernization?

3. **What should be preserved?**
   - Current game mechanics?
   - Visual design?
   - File structure?
   - Specific systems?

4. **What should be changed?**
   - Architecture patterns?
   - Data structures?
   - Rendering approach?
   - System interactions?

---

## Next Steps

1. **User Discussion** - Understand rewrite goals and scope
2. **Analysis** - Review current codebase for pain points
3. **Planning** - Create detailed rewrite plan
4. **Implementation** - Execute rewrite in phases
5. **Testing** - Verify functionality preserved/improved

---

## Session End
**Date:** 2025-01-29
**Status:** AWAITING USER INPUT
**Next:** Discuss rewrite scope and goals with user

