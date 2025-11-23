/**
 * Star Sea - Automated Game Testing with Playwright
 * Tests gameplay, takes screenshots, and identifies issues
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testStarSea() {
    console.log('🚀 Launching Star Sea for automated testing...\n');

    // Create screenshots directory
    const screenshotDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
    }

    let browser;
    try {
        // Launch browser
        console.log('🌐 Launching browser...');
        browser = await chromium.launch({
            headless: true, // Run in headless mode for faster testing
            slowMo: 100 // Reduced delay for faster execution
        });
        console.log('✅ Browser launched successfully\n');
    } catch (error) {
        console.error('❌ Failed to launch browser:', error.message);
        console.error('💡 Try running: npx playwright install chromium');
        process.exit(1);
    }

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Enable console logging from the game
    page.on('console', msg => {
        const type = msg.type();
        if (type === 'error') {
            console.log(`❌ Console Error: ${msg.text()}`);
        }
    });

    try {
        // Step 1: Load the game
        console.log('📂 Loading index.html...');
        const indexPath = 'file://' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
        console.log('   Path:', indexPath);
        await page.goto(indexPath, { waitUntil: 'networkidle', timeout: 30000 });
        console.log('✅ Page loaded');
        await page.waitForTimeout(2000); // Wait for game initialization
        console.log('✅ Game initialized\n');

        await page.screenshot({
            path: path.join(screenshotDir, '01-main-menu.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Main Menu\n');

        // Step 2: Click "New Game"
        console.log('🎮 Clicking "New Game"...');
        await page.click('#btn-new-game');
        await page.waitForTimeout(1000);

        await page.screenshot({
            path: path.join(screenshotDir, '02-mission-briefing.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Mission Briefing\n');

        // Step 3: Accept Mission
        console.log('✔️ Accepting mission...');
        try {
            const acceptButton = await page.$('#btn-accept-mission');
            if (acceptButton) {
                await acceptButton.click();
                console.log('✅ Mission accepted');
                await page.waitForTimeout(3000); // Wait for mission to load
            } else {
                console.log('⚠️ Accept button not found, trying alternative...');
                // Try clicking by text or other selector
                await page.waitForTimeout(1000);
            }
        } catch (error) {
            console.log('⚠️ Error accepting mission:', error.message);
            console.log('   Continuing anyway...');
            await page.waitForTimeout(2000);
        }

        await page.screenshot({
            path: path.join(screenshotDir, '03-gameplay-initial.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Gameplay Initial State\n');

        // Step 4: Test W key (forward thrust)
        console.log('⌨️ Testing W key (forward thrust)...');
        await page.keyboard.down('w');
        await page.waitForTimeout(2000);
        await page.keyboard.up('w');

        await page.screenshot({
            path: path.join(screenshotDir, '04-after-thrust-w.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: After W thrust\n');

        // Step 5: Test A/D keys (rotation)
        console.log('⌨️ Testing D key (turn right)...');
        await page.keyboard.down('d');
        await page.waitForTimeout(1000);
        await page.keyboard.up('d');

        await page.screenshot({
            path: path.join(screenshotDir, '05-after-turn-d.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: After D turn\n');

        // Step 6: Test shield toggle (spacebar)
        console.log('🛡️ Testing shield toggle (spacebar)...');
        await page.keyboard.press(' ');
        await page.waitForTimeout(500);
        
        await page.screenshot({
            path: path.join(screenshotDir, '06-shield-toggle.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Shield toggle\n');

        // Step 7: Test weapon firing (left click - continuous beam)
        console.log('🔫 Testing beam weapons (left click - hold)...');
        await page.mouse.move(1200, 400); // Move cursor to upper right
        await page.mouse.down();
        await page.waitForTimeout(2000); // Hold for 2 seconds
        await page.mouse.up();
        await page.waitForTimeout(500);

        await page.screenshot({
            path: path.join(screenshotDir, '07-beam-fire.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Beam fire\n');

        // Step 8: Test torpedo firing (right click)
        console.log('🚀 Testing torpedoes (right click)...');
        await page.mouse.click(1200, 400, { button: 'right' });
        await page.waitForTimeout(500);

        await page.screenshot({
            path: path.join(screenshotDir, '08-torpedo-fire.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Torpedo fire\n');

        // Step 9: Test mine deployment (E key)
        console.log('💣 Testing mine deployment (E key)...');
        await page.keyboard.press('e');
        await page.waitForTimeout(500);

        await page.screenshot({
            path: path.join(screenshotDir, '09-mine-deploy.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Mine deployment\n');

        // Step 10: Observe HUD elements (energy blocks, throttle, shields)
        console.log('📊 Checking HUD elements...');

        const hudVisible = await page.evaluate(() => {
            const hud = document.getElementById('hud');
            const energyBlocks = document.getElementById('energy-blocks-container');
            const throttleDisplay = document.getElementById('throttle-display');
            const shieldStatus = document.getElementById('shield-status');
            const minimap = document.getElementById('minimap');

            return {
                hudExists: !!hud,
                hudVisible: hud ? hud.style.display !== 'none' : false,
                energyBlocksExists: !!energyBlocks,
                throttleDisplayExists: !!throttleDisplay,
                shieldStatusExists: !!shieldStatus,
                minimapExists: !!minimap
            };
        });

        console.log('HUD Elements:', hudVisible);

        await page.screenshot({
            path: path.join(screenshotDir, '10-hud-check.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: HUD check\n');

        // Step 11: Test throttle increments (W/S keys)
        console.log('⚡ Testing throttle system (W/S keys)...');
        // Press W multiple times to increase throttle
        for (let i = 0; i < 5; i++) {
            await page.keyboard.press('w');
            await page.waitForTimeout(200);
        }
        await page.waitForTimeout(1000);
        
        await page.screenshot({
            path: path.join(screenshotDir, '11-throttle-increase.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Throttle increase\n');

        // Step 12: Check ship visuals and damage effects
        console.log('🚢 Examining ship visuals...');
        await page.waitForTimeout(1000);

        await page.screenshot({
            path: path.join(screenshotDir, '12-ship-visuals.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Ship visuals\n');

        // Step 13: Check minimap
        console.log('🗺️ Examining minimap...');
        const minimapCanvas = await page.$('#minimap');
        if (minimapCanvas) {
            const minimapBox = await minimapCanvas.boundingBox();
            console.log('Minimap bounding box:', minimapBox);

            // Take close-up of minimap
            await page.screenshot({
                path: path.join(screenshotDir, '13-minimap-closeup.png'),
                clip: minimapBox
            });
            console.log('✅ Screenshot: Minimap close-up\n');
        }

        // Step 14: Extended play session with new features
        console.log('🎮 Extended gameplay test with new features...');

        // Test double-tap W (burst acceleration)
        console.log('⚡ Testing double-tap W (burst acceleration)...');
        await page.keyboard.press('w');
        await page.waitForTimeout(100);
        await page.keyboard.press('w');
        await page.waitForTimeout(1000);

        // Test double-tap A (fast rotation)
        console.log('🔄 Testing double-tap A (fast rotation)...');
        await page.keyboard.press('a');
        await page.waitForTimeout(100);
        await page.keyboard.press('a');
        await page.waitForTimeout(1000);

        // Move ship around
        await page.keyboard.down('w');
        await page.waitForTimeout(2000);
        await page.keyboard.up('w');

        await page.keyboard.down('a');
        await page.waitForTimeout(1000);
        await page.keyboard.up('a');

        // Fire continuous beam
        await page.mouse.move(800, 300);
        await page.mouse.down();
        await page.waitForTimeout(1500);
        await page.mouse.up();
        await page.waitForTimeout(500);

        // Fire torpedo
        await page.mouse.move(1100, 700);
        await page.mouse.click(1100, 700, { button: 'right' });
        await page.waitForTimeout(500);

        // Toggle shield again
        await page.keyboard.press(' ');
        await page.waitForTimeout(500);

        await page.screenshot({
            path: path.join(screenshotDir, '14-extended-gameplay.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Extended gameplay\n');

        // Step 15: Final state
        console.log('📸 Capturing final state...');
        await page.waitForTimeout(2000);

        await page.screenshot({
            path: path.join(screenshotDir, '15-final-state.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Final state\n');

        // Analyze game state
        console.log('\n📊 GAME STATE ANALYSIS:');
        const gameState = await page.evaluate(() => {
            const energyBlocks = document.getElementById('energy-blocks-container');
            const throttleDisplay = document.getElementById('throttle-display');
            const shieldStatus = document.getElementById('shield-status');
            
            return {
                canvasSize: {
                    width: document.getElementById('gameCanvas')?.width,
                    height: document.getElementById('gameCanvas')?.height
                },
                debugMode: typeof CONFIG !== 'undefined' ? CONFIG.DEBUG_MODE : 'unknown',
                hudPanels: {
                    energyBlocks: !!energyBlocks,
                    energyBlocksCount: energyBlocks ? energyBlocks.children.length : 0,
                    throttleDisplay: !!throttleDisplay,
                    throttleText: throttleDisplay ? throttleDisplay.textContent : 'N/A',
                    shieldStatus: !!shieldStatus,
                    shieldStatusText: shieldStatus ? shieldStatus.textContent : 'N/A',
                    minimap: !!document.getElementById('minimap')
                },
                playerShip: typeof window.game !== 'undefined' && window.game.playerShip ? {
                    hasEnergy: !!window.game.playerShip.energy,
                    energyBlocks: window.game.playerShip.energy ? window.game.playerShip.energy.blockCount : 0,
                    shieldsUp: window.game.playerShip.shields ? window.game.playerShip.shields.isUp() : false,
                    throttle: window.game.playerShip.throttle || 0
                } : null
            };
        });

        console.log(JSON.stringify(gameState, null, 2));
        console.log('\n✅ All screenshots saved to:', screenshotDir);
        console.log('\n🎮 Test complete!\n');

        // Close browser after completion
        await browser.close();

    } catch (error) {
        console.error('❌ Error during testing:', error);
        console.error(error.stack);
        try {
            await page.screenshot({
                path: path.join(screenshotDir, 'error-state.png'),
                fullPage: true
            });
        } catch (screenshotError) {
            console.error('❌ Failed to capture error screenshot:', screenshotError.message);
        }
    } finally {
        if (browser) {
            await browser.close();
            console.log('🔒 Browser closed');
        }
    }
}

// Run the test
testStarSea().catch(console.error);
