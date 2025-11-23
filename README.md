# Star Commander

A top-down space combat game featuring energy-based ship management, tactical combat, and dynamic environmental hazards.

## 🚀 Features

### Core Systems

- **Energy Block System**: Ships use energy blocks (1-4 based on class) instead of traditional HP
  - Destroyer (DD): 1 energy block
  - Light Cruiser (CL): 2 energy blocks
  - Heavy Cruiser (CA): 3 energy blocks
  - Battle Cruiser (BB): 4 energy blocks
  - Damage reduces block length (capacity), ship destroyed at 0 length

- **Throttle Management**: 10% increment throttle system
  - Throttle > 50%: Drains energy
  - Throttle = 50%: Energy unaffected
  - Throttle < 50%: Energy refills
  - W/S keys adjust throttle in 10% increments

- **Unified Shield System**: Single shield protecting entire ship
  - Spacebar toggles shields up/down
  - Drains energy while active
  - Damage while shields are up drains energy
  - Visual feedback: Faint ovoid that brightens on hit

### Combat Systems

- **Continuous Beam Weapons**: Hold LMB to fire continuously
  - Drains energy while firing
  - Maximum 5 seconds firing duration
  - Cooldown equals fire duration (max 5 seconds)
  - Beam banks don't change color (can fire continuously)

- **Torpedoes**: Right-click to fire
  - Limited ammunition (no energy drain)
  - Homing on target under reticle
  - Loses lock if target moves outside 90-degree forward arc
  - Faster and less maneuverable than plasma torpedoes

- **Mines**: E key to deploy
  - Visible to player, invisible to enemies
  - 2 torpedo hits worth of damage on collision
  - Limited number per ship

- **Tractor Beam**: Q key to activate
  - Pins ships with fewer energy blocks than your ship
  - Moves target ship with you
  - Drains energy constantly while active

### Special Maneuvers

- **Double-tap W**: Burst acceleration (up to 2x max speed)
  - Consumes chunk of energy
  
- **Double-tap S**: Instant stop
  - Consumes chunk of energy
  
- **Double-tap A/D**: Quick rotation (3-4x faster)
  - Consumes chunk of energy

### Visual Damage Effects

- **75% energy block length**: Particle trails (smoke)
- **50% energy block length**: Flames onboard + particle trails
- **25% energy block length**: Flames + particle trails + random small explosions

### Environmental Features

- **Asteroids**: Breakable obstacles with collision damage
- **Planets/Moons**: Gravity fields attract ships/torpedoes, slingshot mechanics
  - Massive damage and bounce on contact (if not destroyed)
- **Nebulae**: Dusty clouds with lightning
  - Shields do not work inside
  - All weapons suffer reduced effectiveness
- **Stars**: Gravity fields, damage to ships too close, instant destruction on contact

### Sensor System

- Long-range sensors show all other ships on minimap as green dots
- Detailed ship info displayed when within X distance

## 🎮 Controls

| Key | Action |
|-----|--------|
| **W** | Increase throttle (10% increments) |
| **S** | Decrease throttle (10% increments) |
| **A** | Turn left |
| **D** | Turn right |
| **W (double-tap)** | Burst acceleration |
| **S (double-tap)** | Instant stop |
| **A/D (double-tap)** | Fast rotation |
| **Left Mouse Button** | Fire continuous beams (hold) |
| **Right Mouse Button** | Fire torpedoes |
| **Spacebar** | Toggle shields |
| **E** | Deploy mine |
| **Q** | Toggle tractor beam |
| **ESC** | Pause/Unpause |

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (for testing with Playwright)
- A modern web browser (Chrome, Firefox, Edge, Safari)

### Running the Game

1. **Using a local server** (recommended):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Node.js
   npx http-server . -p 8000
   ```

2. **Open in browser**:
   - Navigate to `http://localhost:8000`
   - Click "New Game" to start

### Testing

Automated testing with Playwright:

```bash
# Install Playwright (first time only)
npm install
npx playwright install chromium

# Run tests
node test-game.js
```

Tests will generate screenshots in the `screenshots/` directory.

## 📁 Project Structure

```
star-commander/
├── index.html              # Main game file
├── css/                    # Stylesheets
│   ├── main.css
│   ├── hud.css
│   ├── menus.css
│   └── ui.css
├── js/
│   ├── config.js           # Game configuration
│   ├── main.js             # Entry point
│   ├── core/               # Core engine
│   │   ├── Engine.js
│   │   ├── InputManager.js
│   │   └── Camera.js
│   ├── entities/           # Game entities
│   │   ├── Ship.js
│   │   └── Projectile.js
│   ├── components/         # Entity components
│   │   ├── EnergySystem.js
│   │   ├── Shield.js
│   │   └── weapons/
│   ├── rendering/          # Renderers
│   │   ├── ShipRenderer.js
│   │   └── ParticleSystem.js
│   ├── ui/                 # UI managers
│   │   └── HUD.js
│   └── systems/            # Game systems
├── screenshots/            # Test screenshots
├── test-game.js           # Playwright test suite
└── package.json           # Node.js dependencies
```

## 🎯 Gameplay Mechanics

### Energy Management

Energy is the core resource in Star Commander. All actions consume energy:
- High throttle (>50%) drains energy
- Beam weapons drain energy while firing
- Shields drain energy while active
- Special maneuvers consume chunks of energy
- Tractor beam drains energy constantly

Manage your energy carefully - a ship with 0 energy is helpless, and a ship with 0 energy block length is destroyed.

### Ship Classes

- **Destroyer (DD)**: Fast, agile, 1 energy block
- **Light Cruiser (CL)**: Balanced, 2 energy blocks
- **Heavy Cruiser (CA)**: Powerful, 3 energy blocks
- **Battle Cruiser (BB)**: Most powerful, 4 energy blocks

### Combat Strategy

1. **Energy Management**: Keep throttle at 50% when not maneuvering to maintain energy
2. **Shield Timing**: Raise shields only when needed - they drain energy constantly
3. **Beam Duration**: Continuous beams are powerful but drain energy quickly
4. **Torpedo Conservation**: Limited ammunition - use wisely
5. **Special Maneuvers**: Powerful but expensive - use strategically

## 🔧 Development

### Tech Stack

- **HTML5 Canvas 2D** - Rendering
- **Vanilla JavaScript (ES6+)** - Game logic
- **planck.js** - Physics simulation
- **Playwright** - Automated testing

### Code Style

- Four-space indentation
- Semicolons required
- `const`/`let` instead of `var`
- Classes use PascalCase
- Functions use camelCase
- CSS selectors use kebab-case

## 📝 License

ISC License

## 🙏 Acknowledgments

Built as a rewrite of the Star Sea project with major gameplay improvements focusing on energy-based ship management and tactical combat.
