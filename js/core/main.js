// =========================
// MAIN.JS v9.3.0 - ZENTRALER ENTRY POINT
// 🌉 EventBridge VOR allen Systemen!
// 🌦️⏰ Game-Timer, Weather-System, Call-Template-Mapper Integration
// 🔧 v9.3.1: Radio-System Init Fix (ist Objekt, nicht Konstruktor)
// =========================

console.log('📋 main.js v9.3.1 wird geladen...');

/**
 * 🔧 PHASE 1: GAME LOOP GLOBAL
 */
let gameLoopInterval = null;
let lastGameUpdateTime = Date.now();

/**
 * HAUPTINITIALISIERUNG - Wird nach DOM-Load aufgerufen
 */
async function initializeGame() {
    console.group('🎮 GAME INITIALIZATION');
    console.log('🚀 Starte Initialisierungssequenz...');
    
    try {
        // 🔧 1. SETTINGS MANAGER (ERSTE PRIORITÄT!)
        console.log('\n📝 PHASE 1: Settings Manager');
        if (typeof SettingsManager !== 'undefined') {
            await SettingsManager.loadSettings();
            console.log('✅ Settings Manager initialisiert');
        } else {
            console.error('❌ SettingsManager nicht gefunden!');
        }

        // 🌉 2. EVENTBRIDGE (ZWEITE PRIORITÄT - VOR ALLEN SYSTEMEN!)
        console.log('\n🌉 PHASE 2: EventBridge');
        if (typeof window.eventBridge !== 'undefined') {
            console.log('✅ EventBridge bereits initialisiert');
        } else {
            console.error('❌ EventBridge nicht gefunden - Systeme könnten nicht kommunizieren!');
        }

        // 🔧 3. CONFIG & DATA
        console.log('\n📊 PHASE 3: Config & Data');
        if (typeof config !== 'undefined') {
            console.log('✅ Config geladen');
        } else {
            console.error('❌ Config nicht gefunden!');
        }

        if (typeof DATA !== 'undefined') {
            console.log(`✅ DATA geladen (${DATA.wachen?.length || 0} Wachen, ${DATA.fahrzeuge?.length || 0} Fahrzeuge)`);
        } else {
            console.error('❌ DATA nicht gefunden!');
        }

        // 🌦️⏰ 4. NEUE SYSTEME (v9.3.0) - VOR Game-Init!
        console.log('\n🌦️⏰ PHASE 4: Zeit & Wetter Systeme');
        await initializeNewSystems();

        // 🔧 5. GAME CORE INITIALISIERUNG
        console.log('\n🎮 PHASE 5: Game Core');
        if (typeof game !== 'undefined' && game.initialize) {
            await game.initialize();
            console.log('✅ Game Core initialisiert');
        } else {
            console.error('❌ Game object nicht gefunden!');
        }

        // 🔧 6. LEAFLET MAP
        console.log('\n🗺️ PHASE 6: Leaflet Map');
        if (typeof L !== 'undefined') {
            await initializeMap();
            console.log('✅ Map initialisiert');
        } else {
            console.error('❌ Leaflet nicht geladen!');
        }

        // 🔧 7. UI & TABS
        console.log('\n🖥️ PHASE 7: UI & Tabs');
        if (typeof initializeTabs !== 'undefined') {
            initializeTabs();
            console.log('✅ Tabs initialisiert');
        }
        
        if (typeof UI !== 'undefined' && UI.initialize) {
            UI.initialize();
            console.log('✅ UI initialisiert');
        }

        // 🔧 8. RADIO SYSTEM - KRITISCH FÜR FUNKVERKEHR!
        console.log('\n📡 PHASE 8: Radio System');
        if (typeof RadioSystem !== 'undefined') {
            await RadioSystem.initialize();
            console.log('✅ Radio System initialisiert - Funkverkehr bereit!');
        } else {
            console.error('❌ RadioSystem nicht gefunden - Funkverkehr nicht verfügbar!');
        }

        // 🔧 9. RADIO UI - NACH RadioSystem!
        console.log('\n📻 PHASE 9: Radio UI');
        if (typeof RadioUI !== 'undefined' && RadioUI.initialize) {
            await RadioUI.initialize();
            console.log('✅ Radio UI initialisiert');
        } else {
            console.warn('⚠️ RadioUI nicht gefunden - Funkpanel nicht verfügbar');
        }

        // 🔧 10. CALL SYSTEM
        console.log('\n📞 PHASE 10: Call System');
        if (typeof CallSystem !== 'undefined' && CallSystem.initialize) {
            CallSystem.initialize();
            console.log('✅ Call System initialisiert');
        }

        // 🔧 11. AI SYSTEMS
        console.log('\n🤖 PHASE 11: AI Systems');
        if (typeof AIIncidentGenerator !== 'undefined' && AIIncidentGenerator.initialize) {
            AIIncidentGenerator.initialize();
            console.log('✅ AI Incident Generator initialisiert');
        }

        if (typeof EscalationSystem !== 'undefined' && EscalationSystem.initialize) {
            EscalationSystem.initialize();
            console.log('✅ Escalation System initialisiert');
        }

        // 🔧 12. DRAGGABLE UI
        console.log('\n🖱️ PHASE 12: Draggable UI');
        if (typeof initializeDraggable !== 'undefined') {
            initializeDraggable();
            console.log('✅ Draggable UI initialisiert');
        }

        // 🔧 13. DEBUG MENU
        console.log('\n🐛 PHASE 13: Debug Menu');
        if (typeof debugMenu !== 'undefined' && debugMenu.initialize) {
            debugMenu.initialize();
            console.log('✅ Debug Menu initialisiert');
        }

        // 🔧 14. VERSION BADGE UPDATE
        console.log('\n📦 PHASE 14: Version Badge');
        updateVersionBadge();

        console.log('\n✅✅✅ ALLE SYSTEME ERFOLGREICH INITIALISIERT! ✅✅✅');
        console.groupEnd();

    } catch (error) {
        console.error('❌ KRITISCHER FEHLER BEIM GAME-START:', error);
        console.groupEnd();
        
        // Zeige Fehler-Overlay
        showErrorOverlay('Initialisierungsfehler', error.message);
    }
}

/**
 * 🌦️⏰ v9.3.0: Initialisiert neue Systeme (Game-Timer, Weather, Call-Template-Mapper)
 */
async function initializeNewSystems() {
    console.group('🌦️⏰ NEUE SYSTEME INITIALISIERUNG');
    
    try {
        // 1️⃣ GAME TIMER - Zeitmanagement
        console.log('⏰ Initialisiere Game Timer...');
        if (typeof GameTimer !== 'undefined') {
            if (typeof window.GameTimer === 'undefined') {
                window.GameTimer = new GameTimer();
            }
            window.GameTimer.start();
            console.log(`✅ Game Timer gestartet: ${window.GameTimer.getFormattedTime()}`);
        } else {
            console.error('❌ GameTimer-Klasse nicht gefunden!');
        }

        // 2️⃣ WEATHER SYSTEM - Wetterbedingungen
        console.log('🌦️ Initialisiere Weather System...');
        if (typeof WeatherSystem !== 'undefined') {
            if (typeof window.weatherSystem === 'undefined') {
                window.weatherSystem = new WeatherSystem();
            }
            window.weatherSystem.initialize();
            console.log(`✅ Weather System initialisiert: ${window.weatherSystem.getCurrentWeather().name}`);
        } else {
            console.error('❌ WeatherSystem-Klasse nicht gefunden!');
        }

        // 3️⃣ CALL TEMPLATE MAPPER - Template-Integration
        console.log('📞 Initialisiere Call Template Mapper...');
        if (typeof CallTemplateMapper !== 'undefined') {
            if (typeof window.callTemplateMapper === 'undefined') {
                window.callTemplateMapper = new CallTemplateMapper();
            }
            console.log('✅ Call Template Mapper initialisiert');
        } else {
            console.error('❌ CallTemplateMapper-Klasse nicht gefunden!');
        }

        console.log('✅✅ ALLE NEUEN SYSTEME ERFOLGREICH INITIALISIERT! ✅✅');
        
    } catch (error) {
        console.error('❌ FEHLER BEI NEUEN SYSTEMEN:', error);
    }
    
    console.groupEnd();
}

/**
 * 📦 Aktualisiert Version Badge im Welcome Screen
 */
function updateVersionBadge() {
    if (typeof VERSION_CONFIG !== 'undefined') {
        const versionText = document.getElementById('version-text');
        const buildDate = document.getElementById('build-date');
        
        if (versionText) {
            versionText.textContent = `Version ${VERSION_CONFIG.VERSION}`;
        }
        
        if (buildDate) {
            buildDate.innerHTML = `<i class="fas fa-calendar-alt"></i> Build: ${VERSION_CONFIG.BUILD_DATE}`;
        }
        
        console.log(`📦 Version Badge aktualisiert: v${VERSION_CONFIG.VERSION}`);
    }
}

/**
 * 🗺️ Map Initialisierung
 */
async function initializeMap() {
    if (typeof mapInstance !== 'undefined' && mapInstance.initialize) {
        await mapInstance.initialize();
        console.log('✅ Map Instance initialisiert');
    } else {
        console.error('❌ mapInstance nicht gefunden!');
    }
}

/**
 * ❌ Zeigt Fehler-Overlay
 */
function showErrorOverlay(title, message) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay active';
    overlay.innerHTML = `
        <div class="error-container" style="max-width: 600px; padding: 40px; background: #1a1a1a; border: 2px solid #dc3545; border-radius: 12px;">
            <h2 style="color: #dc3545; margin-bottom: 20px;">
                <i class="fas fa-exclamation-triangle"></i> ${title}
            </h2>
            <p style="color: #ffffff; line-height: 1.6;">${message}</p>
            <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 20px;">
                <i class="fas fa-redo"></i> Seite neu laden
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
}

/**
 * 🎮 GAME LOOP - Zentrale Update-Schleife
 */
function startGameLoop() {
    if (gameLoopInterval) {
        console.warn('⚠️ Game Loop läuft bereits!');
        return;
    }

    console.log('🔄 Starte Game Loop...');
    
    gameLoopInterval = setInterval(() => {
        const now = Date.now();
        const deltaTime = (now - lastGameUpdateTime) / 1000; // in Sekunden
        lastGameUpdateTime = now;

        // 1. Update Game Timer (wenn vorhanden)
        if (typeof window.GameTimer !== 'undefined') {
            window.GameTimer.update();
        }

        // 2. Update Weather System (wenn vorhanden)
        if (typeof window.weatherSystem !== 'undefined') {
            const currentHour = window.GameTimer?.getCurrentHour() || 12;
            window.weatherSystem.updateTimeOfDay(currentHour);
        }

        // 3. Update Game Core
        if (typeof game !== 'undefined' && game.update) {
            game.update(deltaTime);
        }

        // 4. Update Vehicle Movement
        if (typeof VehicleMovement !== 'undefined' && VehicleMovement.update) {
            VehicleMovement.update(deltaTime);
        }

        // 5. Update Mission Timer
        if (typeof MissionTimer !== 'undefined' && MissionTimer.update) {
            MissionTimer.update();
        }

    }, 1000); // 1x pro Sekunde

    console.log('✅ Game Loop gestartet (1000ms Intervall)');
}

/**
 * 🛑 Stoppt Game Loop
 */
function stopGameLoop() {
    if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
        gameLoopInterval = null;
        console.log('🛑 Game Loop gestoppt');
    }
}

/**
 * ⏸️ Pause/Resume Toggle
 */
function togglePause() {
    if (typeof game !== 'undefined' && game.togglePause) {
        game.togglePause();
        
        const pauseIcon = document.getElementById('pause-icon');
        if (pauseIcon) {
            if (game.isPaused) {
                pauseIcon.className = 'fas fa-play';
                stopGameLoop();
            } else {
                pauseIcon.className = 'fas fa-pause';
                startGameLoop();
            }
        }
    }
}

/**
 * 🎯 Startet neues Spiel
 */
function startNewGame(mode) {
    console.log(`🎮 Starte neues Spiel: ${mode}`);
    
    // Verstecke Welcome Screen
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.classList.remove('active');
    }
    
    // Zeige Game Container
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.classList.remove('hidden');
    }
    
    // Initialisiere Game
    if (typeof game !== 'undefined' && game.start) {
        game.start(mode);
    }
    
    // Starte Game Loop
    startGameLoop();
    
    console.log('✅ Spiel gestartet!');
}

/**
 * 📚 Startet Tutorial
 */
function startTutorial() {
    console.log('📚 Tutorial wird gestartet...');
    if (typeof Tutorial !== 'undefined' && Tutorial.start) {
        Tutorial.start();
    } else {
        alert('Tutorial kommt bald!');
    }
}

/**
 * ⚙️ Zeigt Einstellungen
 */
function showSettings() {
    const settingsOverlay = document.getElementById('settings-overlay');
    if (settingsOverlay) {
        settingsOverlay.classList.add('active');
        
        // Lade aktuelle Einstellungen
        if (typeof SettingsManager !== 'undefined' && SettingsManager.loadSettingsToUI) {
            SettingsManager.loadSettingsToUI();
        }
    }
}

/**
 * ❌ Schließt Einstellungen
 */
function closeSettings() {
    const settingsOverlay = document.getElementById('settings-overlay');
    if (settingsOverlay) {
        settingsOverlay.classList.remove('active');
    }
}

/**
 * 💾 Speichert Einstellungen
 */
function saveSettings() {
    if (typeof SettingsManager !== 'undefined' && SettingsManager.saveSettingsFromUI) {
        SettingsManager.saveSettingsFromUI();
    }
    closeSettings();
}

/**
 * 👁️ Toggle API Key Visibility
 */
function toggleAPIKeyVisibility() {
    const input = document.getElementById('groq-api-key');
    const icon = document.getElementById('api-key-toggle-icon');
    
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
}

/**
 * 🏆 Karrieremodus Coming Soon
 */
function showCareerComingSoon() {
    alert('🏆 KARRIEREMODUS\n\nKommt bald!\n\nStarte mit wenigen Fahrzeugen und baue deine Flotte Schritt für Schritt auf. Verdiene Geld durch erfolgreiche Einsätze und erweitere deine Leitstelle!');
}

/**
 * 🛒 Öffnet Shop (Karrieremodus)
 */
function openShop() {
    alert('🛒 SHOP\n\nDer Shop ist Teil des Karrieremodus und kommt bald!\n\nHier kannst du dann neue Fahrzeuge kaufen, Wachen erweitern und Upgrades freischalten.');
}

/**
 * 🗺️ Zentriert Karte
 */
function centerMap() {
    if (typeof mapInstance !== 'undefined' && mapInstance.centerMap) {
        mapInstance.centerMap();
    }
}

/**
 * 🏥 Toggle Wachen-Anzeige
 */
function toggleStations() {
    if (typeof mapInstance !== 'undefined' && mapInstance.toggleStations) {
        mapInstance.toggleStations();
    }
}

/**
 * 📻 Toggle Radio Panel
 */
function toggleRadioPanel() {
    if (typeof RadioUI !== 'undefined' && RadioUI.toggle) {
        RadioUI.toggle();
    } else {
        console.error('❌ RadioUI nicht verfügbar!');
    }
}

/**
 * 🔄 Tab-Switching
 */
function switchTab(tabName) {
    if (typeof switchToTab !== 'undefined') {
        switchToTab(tabName);
    }
}

/**
 * 📋 DOMContentLoaded Event Handler
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📋 DOM Content Loaded - Starte Initialisierung...');
    
    // Warte kurz für externe Libraries
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Starte Initialisierung
    await initializeGame();
    
    console.log('✅ main.js Initialisierung abgeschlossen');
});

console.log('✅ main.js v9.3.1 geladen - 🔧 Radio-System Fix angewendet');