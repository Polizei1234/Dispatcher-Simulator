// =========================
// HAUPTSTEUERUNG v4.15 - GAME-TIMER + WEATHER + CALL-TEMPLATES!
// + ✅ VehicleMovement.initialize() wird jetzt aufgerufen
// + ✅ Fahrzeuge fahren wieder los!
// + ✅✅✅ PHASE 3.1.1 v4.12: CONDITIONAL UI UPDATES (-80% DOM Operations!)
// + 🐛 FIX v4.13: Game Loop stoppt bei Pause (CPU-Savings!)
// + 🐛 FIX v4.13: Null-Checks in updateUI (keine Runtime-Errors!)
// + 🔧 FIX v4.14: RadioSystem wird in initializeNewSystems() initialisiert
// + 🌦️⏰📞 FIX v4.15: Game-Timer + Weather + Call-Template-Mapper Integration!
// =========================

let gamePaused = false;
let gameTickCounter = 0;

// ⏰ ZENTRALES ZEITSYSTEM - Wird von game.js genutzt!
window.GameTime = {
    simulated: new Date(),    // Uhrzeit für Anzeige (z.B. "16:42:35")
    elapsed: 0,               // Verstrichene Spielzeit in ms (für Einsatz-Timing)
    speed: 1, // Default 1x (Echtzeit)
    lastTick: Date.now(),
    pausedAt: null,           // 🐛 FIX: Timestamp für Pause-Berechnung
    
    // Hilfsfunktionen
    tick: function(deltaMs) {
        const gameMs = deltaMs * this.speed;
        this.elapsed += gameMs;
        this.simulated = new Date(this.simulated.getTime() + gameMs);
    },
    
    reset: function() {
        // ✅ FIXED: Starte mit aktueller Uhrzeit statt 08:00
        this.simulated = new Date();
        this.elapsed = 0;
        this.speed = CONFIG?.GAME_SPEED?.DEFAULT || 1;
        this.lastTick = Date.now();
        this.pausedAt = null;
        const timeStr = this.simulated.toLocaleTimeString('de-DE');
        console.log(`⏰ Zeit gestartet mit aktueller Uhrzeit: ${timeStr}`);
        
        // ✅ UPDATE SPEED DISPLAY
        updateSpeedDisplay();
    },
    
    updateSpeed: function(newSpeed) {
        this.speed = newSpeed;
        if (typeof CONFIG !== 'undefined') {
            CONFIG.GAME_SPEED = newSpeed;
        }
        console.log(`⏱️ Geschwindigkeit: ${newSpeed}x`);
        
        // ✅ UPDATE SPEED DISPLAY
        updateSpeedDisplay();
        
        // Fire event
        window.dispatchEvent(new CustomEvent('gameSpeedChanged', { detail: { speed: newSpeed } }));
    }
};

// ✅✅✅ PHASE 3.1.1: UI UPDATE TRACKER
const UIUpdateTracker = {
    lastVehicleCount: 0,
    lastAvailableCount: 0,
    lastIncidentCount: 0,
    lastTimeString: '',
    lastSpeedMultiplier: 1,
    vehicleListUpdatePending: false,
    
    // Debounced Vehicle List Update
    scheduleVehicleListUpdate() {
        if (this.vehicleListUpdatePending) return;
        
        this.vehicleListUpdatePending = true;
        setTimeout(() => {
            if (typeof UI !== 'undefined' && UI.updateVehicleList) {
                UI.updateVehicleList();
            }
            this.vehicleListUpdatePending = false;
        }, 500); // Debounce 500ms
    },
    
    // Prüfe ob Vehicle Count sich geändert hat
    hasVehicleCountChanged(ownedCount, availableCount) {
        if (this.lastVehicleCount !== ownedCount || this.lastAvailableCount !== availableCount) {
            this.lastVehicleCount = ownedCount;
            this.lastAvailableCount = availableCount;
            return true;
        }
        return false;
    },
    
    // Prüfe ob Incident Count sich geändert hat
    hasIncidentCountChanged(count) {
        if (this.lastIncidentCount !== count) {
            this.lastIncidentCount = count;
            return true;
        }
        return false;
    },
    
    // Prüfe ob Zeit sich geändert hat (Sekunde)
    hasTimeChanged(timeString) {
        if (this.lastTimeString !== timeString) {
            this.lastTimeString = timeString;
            return true;
        }
        return false;
    },
    
    // Prüfe ob Speed sich geändert hat
    hasSpeedChanged(speed) {
        if (this.lastSpeedMultiplier !== speed) {
            this.lastSpeedMultiplier = speed;
            return true;
        }
        return false;
    },
    
    reset() {
        this.lastVehicleCount = 0;
        this.lastAvailableCount = 0;
        this.lastIncidentCount = 0;
        this.lastTimeString = '';
        this.lastSpeedMultiplier = 1;
        this.vehicleListUpdatePending = false;
        console.log('📊 UI Update Tracker zurückgesetzt');
    }
};

/**
 * ✅ FIX: Aktualisiert Spielgeschwindigkeit-Anzeige im UI
 */
function updateSpeedDisplay() {
    const speedMultiplier = window.GameTime ? window.GameTime.speed : (CONFIG?.GAME_SPEED?.DEFAULT || 1);
    
    // ✅✅✅ PHASE 3.1.1: Nur updaten wenn sich geändert hat
    if (!UIUpdateTracker.hasSpeedChanged(speedMultiplier)) {
        return;
    }
    
    const indicator = document.getElementById('game-speed-indicator');
    if (indicator) {
        indicator.textContent = `${speedMultiplier}x`;
    }
}

// 🎮 GAME_DATA Global (für CallSystem & VehicleMovement)
window.GAME_DATA = {
    vehicles: [],
    incidents: [],
    stations: {}
};

// 🆕 NEUE GLOBALE SYSTEME
window.gameTimer = null;              // ⏰ Game-Timer
window.gameWeatherSystem = null;      // 🌦️ Weather-System
window.gameCallTemplateMapper = null; // 📞 Call-Template-Mapper
window.gameAIGenerator = null;
window.gameMissionTimer = null;
window.gameEscalationSystem = null;

function showCareerComingSoon() {
    alert('🔒 Karrieremodus kommt bald!\n\nDiese Funktion ist noch in Entwicklung.\nStarte vorerst das Freie Spiel mit allen Fahrzeugen!');
}

function startNewGame(mode) {
    console.log(`🎮 Starte neues Spiel: ${mode}`);
    console.log(`⏱️ Spielgeschwindigkeit: ${CONFIG.GAME_SPEED?.DEFAULT || 1}x`);
    
    // Setze Spielmodus
    CONFIG.GAME_MODE = mode;
    
    // Initialisiere Fahrzeuge
    initializeVehicles();
    console.log(`🚑 ${VEHICLES.length} Fahrzeuge initialisiert`);
    console.log(`🚑 ${VEHICLES.filter(v => v.owned).length} Fahrzeuge verfügbar`);
    
    // Erstelle Spiel
    game = new Game();
    
    // Initialisiere GAME_DATA global
    window.GAME_DATA.vehicles = game.vehicles;
    window.GAME_DATA.incidents = game.incidents;
    window.GAME_DATA.stations = game.stations;
    console.log('✅ GAME_DATA initialisiert');
    
    // 🆕 INITIALISIERE NEUE SYSTEME
    initializeNewSystems();
    
    // Lade gespeicherte Einstellungen
    loadSettings();
    
    // Initialisiere Karte
    initMap();
    
    // Verstecke Willkommensbildschirm
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('game-container').classList.remove('hidden');
    
    // Reset zentrales Zeitsystem
    GameTime.reset();
    gamePaused = false;
    gameTickCounter = 0;
    
    // ✅✅✅ PHASE 3.1.1: Reset UI Tracker
    UIUpdateTracker.reset();
    
    // ✅ Initial Speed Display Update
    updateSpeedDisplay();
    
    // Update UI
    updateUI();
    
    // Starte Game Loop
    console.log('🔄 Starte Game Loop...');
    startGameLoop();
    
    console.log('✅ Spiel gestartet - Funkverkehr bereit');
}

// 🆕 NEUE SYSTEME INITIALISIEREN
async function initializeNewSystems() {
    console.group('🆕 INITIALISIERE NEUE SYSTEME (v9.3.0)');
    
    try {
        // ⏰ 1. GAME-TIMER SYSTEM
        if (typeof GameTimer !== 'undefined') {
            window.gameTimer = new GameTimer();
            window.gameTimer.start();
            console.log('✅ Game-Timer initialisiert & gestartet');
        } else {
            console.warn('⚠️ GameTimer nicht gefunden');
        }
        
        // 🌦️ 2. WEATHER SYSTEM
        if (typeof WeatherSystem !== 'undefined') {
            window.gameWeatherSystem = new WeatherSystem();
            window.gameWeatherSystem.initialize();
            console.log('✅ Weather System initialisiert');
        } else {
            console.warn('⚠️ WeatherSystem nicht gefunden');
        }
        
        // 📞 3. CALL-TEMPLATE-MAPPER
        if (typeof CallTemplateMapper !== 'undefined') {
            window.gameCallTemplateMapper = new CallTemplateMapper();
            console.log('✅ Call-Template-Mapper initialisiert');
        } else {
            console.warn('⚠️ CallTemplateMapper nicht gefunden');
        }
        
        // 🤖 4. AI INCIDENT GENERATOR
        if (typeof AIIncidentGenerator !== 'undefined') {
            const apiKey = localStorage.getItem('groqApiKey') || CONFIG.GROQ_API_KEY || '';
            window.gameAIGenerator = new AIIncidentGenerator(apiKey);
            
            // 🔗 Verbinde mit Weather System
            if (window.gameWeatherSystem) {
                window.gameAIGenerator.setWeatherSystem(window.gameWeatherSystem);
                console.log('✅ AI Generator <-> Weather System verbunden');
            }
            
            // 🔗 Verbinde mit Game-Timer
            if (window.gameTimer) {
                window.gameAIGenerator.setGameTimer(window.gameTimer);
                console.log('✅ AI Generator <-> Game-Timer verbunden');
            }
            
            console.log('✅ AI Incident Generator initialisiert');
        } else {
            console.warn('⚠️ AIIncidentGenerator nicht gefunden');
        }
        
        // ⏱️ 5. MISSION TIMER
        if (typeof MissionTimer !== 'undefined') {
            window.gameMissionTimer = new MissionTimer();
            console.log('✅ Mission Timer initialisiert');
        } else {
            console.warn('⚠️ MissionTimer nicht gefunden');
        }
        
        // 😨 6. ESCALATION SYSTEM
        if (typeof EscalationSystem !== 'undefined') {
            window.gameEscalationSystem = new EscalationSystem();
            console.log('✅ Escalation System initialisiert');
        } else {
            console.warn('⚠️ EscalationSystem nicht gefunden');
        }
        
        // ✅ 7. VEHICLE MOVEMENT SYSTEM - KRITISCH!
        if (typeof VehicleMovement !== 'undefined') {
            VehicleMovement.initialize();
            console.log('✅ Vehicle Movement System initialisiert - Fahrzeuge können fahren!');
        } else {
            console.error('❌ VehicleMovement nicht gefunden - Fahrzeuge werden nicht fahren!');
        }
        
        // 🔧 8. RADIO SYSTEM - KRITISCH FÜR FUNKVERKEHR!
        if (typeof RadioSystem !== 'undefined') {
            await RadioSystem.initialize();
            console.log('✅ Radio System initialisiert - Funkverkehr bereit!');
        } else {
            console.error('❌ RadioSystem nicht gefunden - Funkverkehr nicht verfügbar!');
        }
        
        console.log('✅ Alle neuen Systeme erfolgreich initialisiert!');
        console.log('🌦️⏰📞 v9.3.0: Game-Timer + Weather + Call-Templates AKTIV!');
        
    } catch (error) {
        console.error('❌ Fehler beim Initialisieren neuer Systeme:', error);
    }
    
    console.groupEnd();
}

// 🐛 FIX #5: Verbesserte togglePause - Stoppt Game Loop komplett!
function togglePause() {
    gamePaused = !gamePaused;
    
    const icon = document.getElementById('pause-icon');
    const btn = document.getElementById('pause-btn');
    
    if (gamePaused) {
        // 🐛 FIX: Stoppe Game Loop bei Pause
        if (gameLoopInterval) {
            clearInterval(gameLoopInterval);
            gameLoopInterval = null;
            console.log('⏸️ Game Loop gestoppt (Pause)');
        }
        
        // 🐛 FIX: Speichere letzten Tick-Timestamp
        if (GameTime) {
            GameTime.pausedAt = Date.now();
        }
        
        // ⏰ Pausiere Game-Timer
        if (window.gameTimer) {
            window.gameTimer.pause();
        }
        
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        btn.title = 'Fortsetzen';
        btn.style.background = '#28a745';
        console.log('⏸️ Spiel pausiert');
        
    } else {
        // 🐛 FIX: Starte Game Loop bei Resume
        if (!gameLoopInterval) {
            // 🐛 FIX: Korrigiere Zeit-Offset
            if (GameTime && GameTime.pausedAt) {
                const pauseDuration = Date.now() - GameTime.pausedAt;
                console.log(`⏱️ Pause-Dauer: ${Math.round(pauseDuration/1000)}s (übersprungen)`);
                GameTime.lastTick = Date.now();  // Reset lastTick um Zeit-Sprung zu vermeiden
                delete GameTime.pausedAt;
            }
            
            startGameLoop();
            console.log('▶️ Game Loop neu gestartet');
        }
        
        // ⏰ Setze Game-Timer fort
        if (window.gameTimer) {
            window.gameTimer.resume();
        }
        
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        btn.title = 'Pausieren';
        btn.style.background = '';
        console.log('▶️ Spiel fortgesetzt');
    }
}

let gameLoopInterval = null;

// 🐛 FIX #5: Verbesserte startGameLoop - Doppel-Start Prevention!
function startGameLoop() {
    // 🐛 FIX: Doppel-Start Prevention
    if (gameLoopInterval) {
        console.warn('⚠️ Game Loop läuft bereits, überspringe Start');
        return;
    }
    
    // 🐛 FIX: Nur starten wenn nicht pausiert
    if (gamePaused) {
        console.log('⏸️ Game Loop Start übersprungen (Spiel ist pausiert)');
        return;
    }
    
    console.log('🔄 Starte Game Loop (1000ms Intervall)...');
    
    gameLoopInterval = setInterval(() => {
        gameTickCounter++;
        
        // 🐛 FIX: Zusätzliche Safety-Check (sollte nie eintreten)
        if (gamePaused) {
            console.error('❌ Game Loop läuft trotz Pause - stoppe!');
            clearInterval(gameLoopInterval);
            gameLoopInterval = null;
            return;
        }
        
        // ✅✅✅ PHASE 3.1.1: Reduziere Debug-Logs (nur alle 10s statt 5s)
        if (gameTickCounter % 10 === 0) {
            console.log(`⏱️ Tick #${gameTickCounter} | Einsätze: ${game?.incidents?.length || 0} | Speed: ${GameTime.speed}x | Spielzeit: ${Math.round(GameTime.elapsed/1000)}s`);
        }
        
        // Aktualisiere ZENTRALES Zeitsystem
        GameTime.tick(1000);
        
        // ⏰ Update Game-Timer
        if (window.gameTimer) {
            window.gameTimer.update(1000);
        }
        
        // 🌦️ Aktualisiere Weather System (Tageszeit)
        if (window.gameWeatherSystem) {
            const currentHour = window.gameTimer ? window.gameTimer.getHour() : GameTime.simulated.getHours();
            window.gameWeatherSystem.updateTimeOfDay(currentHour);
        }
        
        if (game) {
            game.update();
        }
        
        // ✅✅✅ PHASE 3.1.1: Conditional UI Update
        updateUI();
        
    }, 1000);
    
    console.log('✅ Game Loop gestartet!');
}

// ✅✅✅ PHASE 3.1.1: OPTIMIERTE updateUI - Nur Updates bei Änderungen!
// 🐛 FIX #4: Erweiterte Null-Checks!
function updateUI() {
    // 🐛 FIX #4: Erweiterte Validierung
    if (!game || !game.vehicles || !Array.isArray(game.vehicles)) {
        console.warn('⚠️ updateUI: Game oder Vehicles nicht bereit');
        return;
    }
    
    // 1. VEHICLE COUNTS - Nur bei Änderung updaten
    // 🐛 FIX #4: Safe array operations
    const ownedVehicles = game.vehicles.filter(v => v && v.owned) || [];
    const availableVehicles = ownedVehicles.filter(v => v && v.status === 'available') || [];
    
    if (UIUpdateTracker.hasVehicleCountChanged(ownedVehicles.length, availableVehicles.length)) {
        const totalEl = document.getElementById('total-vehicles');
        const activeEl = document.getElementById('active-vehicles');
        
        if (totalEl) totalEl.textContent = ownedVehicles.length;
        if (activeEl) activeEl.textContent = availableVehicles.length;
        
        // ✅✅✅ PHASE 3.1.1: Debounced Vehicle List Update
        UIUpdateTracker.scheduleVehicleListUpdate();
    }
    
    // 2. TIME DISPLAY - Nutze Game-Timer wenn verfügbar
    if (window.gameTimer) {
        const timeString = window.gameTimer.getTimeString();
        
        if (UIUpdateTracker.hasTimeChanged(timeString)) {
            const timeEl = document.getElementById('current-time');
            if (timeEl) {
                timeEl.textContent = timeString;
            }
        }
    } else if (GameTime && GameTime.simulated) {
        const hours = String(GameTime.simulated.getHours()).padStart(2, '0');
        const minutes = String(GameTime.simulated.getMinutes()).padStart(2, '0');
        const seconds = String(GameTime.simulated.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        
        if (UIUpdateTracker.hasTimeChanged(timeString)) {
            const timeEl = document.getElementById('current-time');
            if (timeEl) {
                timeEl.textContent = timeString;
            }
        }
    }
    
    // 3. SPEED DISPLAY - Nur bei Änderung updaten
    updateSpeedDisplay();
    
    // 4. WEATHER UI - Hat eigenes Tracking
    if (window.gameWeatherSystem) {
        window.gameWeatherSystem.updateUI();
    }
    
    // 5. INCIDENT LIST - Nur bei Änderung updaten
    // 🐛 FIX #4: Safe GAME_DATA Zugriff
    if (GAME_DATA && Array.isArray(GAME_DATA.incidents)) {
        const activeIncidents = GAME_DATA.incidents.filter(i => i && !i.completed) || [];
        
        if (UIUpdateTracker.hasIncidentCountChanged(activeIncidents.length)) {
            if (typeof UI !== 'undefined' && UI.updateIncidentList) {
                UI.updateIncidentList();
            } else {
                updateIncidentListFallback();
            }
        }
    } else {
        console.warn('⚠️ updateUI: GAME_DATA.incidents nicht verfügbar');
    }
    
    // 6. MAP - ✅✅✅ PHASE 3.1.1: Nur bei aktiven Fahrzeugen updaten
    // VehicleMovement handled jetzt Map-Updates via pendingMapUpdates
    // Kein ständiges updateVehicleMarkers() mehr nötig!
    
    // Nur bei neuen Einsatzmarkern updaten
    if (GAME_DATA && GAME_DATA.incidents && typeof addIncidentToMap === 'function') {
        GAME_DATA.incidents.forEach(incident => {
            if (incident && !incident.completed && !incidentMarkers[incident.id]) {
                addIncidentToMap(incident);
            }
        });
    }
}

// 🐛 FIX #4: Safe Fallback mit Null-Checks!
function updateIncidentListFallback() {
    if (!game) return;
    
    const container = document.getElementById('incident-list');
    const countBadge = document.getElementById('incident-count');
    
    if (!container || !countBadge) {
        console.warn('⚠️ Incident-List Container nicht gefunden');
        return;
    }
    
    // 🐛 FIX #4: Safe array access mit Nullish Coalescing
    const activeIncidents = (GAME_DATA?.incidents || []).filter(i => i && !i.completed);
    countBadge.textContent = activeIncidents.length;
    
    if (activeIncidents.length === 0) {
        container.innerHTML = '<p class="no-data">Keine aktiven Einsätze</p>';
        return;
    }
    
    // 🐛 FIX #4: Safe property access mit Nullish Coalescing
    container.innerHTML = activeIncidents.map(incident => {
        const id = incident?.id ?? 'unknown';
        const keyword = incident?.stichwort ?? incident?.keyword ?? 'Einsatz';
        const location = incident?.ort ?? incident?.location ?? 'Unbekannt';
        const time = incident?.zeitstempel ?? 'Keine Zeit';
        
        return `
            <div class="incident-item" onclick="selectIncident('${id}')">
                <div class="incident-header">
                    <span class="incident-badge">🚨</span>
                    <span class="incident-number">${id}</span>
                </div>
                <div class="incident-keyword">${keyword}</div>
                <div class="incident-location">📍 ${location}</div>
                <div class="incident-time">🕒 ${time}</div>
            </div>
        `;
    }).join('');
}

function selectIncident(incidentId) {
    if (!game) return;
    
    const incident = GAME_DATA.incidents.find(i => i.id === incidentId);
    if (!incident) return;
    
    game.selectedIncident = incident;
    
    // Zentriere Karte auf Einsatz
    if (typeof map !== 'undefined' && map && incident.koordinaten) {
        map.setView([incident.koordinaten.lat, incident.koordinaten.lon], 15);
    }
    
    console.log(`📍 Einsatz ausgewählt: ${incidentId}`);
}

function showSettings() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay) overlay.classList.add('active');
    
    // Lade aktuelle Einstellungen
    const speed = localStorage.getItem('gameSpeed') || '1';
    const apiKey = localStorage.getItem('groqApiKey') || '';
    const sound = localStorage.getItem('soundEnabled') !== 'false';
    
    const speedEl = document.getElementById('game-speed');
    const apiKeyEl = document.getElementById('groq-api-key');
    const soundEl = document.getElementById('sound-enabled');
    
    if (speedEl) speedEl.value = speed;
    if (apiKeyEl) apiKeyEl.value = apiKey;
    if (soundEl) soundEl.checked = sound;
}

function closeSettings() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay) overlay.classList.remove('active');
}

function saveSettings() {
    const speed = document.getElementById('game-speed')?.value || '1';
    const apiKey = document.getElementById('groq-api-key')?.value || '';
    const sound = document.getElementById('sound-enabled')?.checked || true;
    
    localStorage.setItem('gameSpeed', speed);
    localStorage.setItem('groqApiKey', apiKey);
    localStorage.setItem('soundEnabled', sound);
    
    // Update ZENTRALES Zeitsystem
    GameTime.updateSpeed(parseFloat(speed));
    if (game) game.apiKey = apiKey;
    
    // Update AI Generator mit neuem API Key
    if (window.gameAIGenerator) {
        window.gameAIGenerator.apiKey = apiKey;
    }
    
    closeSettings();
    alert('✅ Einstellungen gespeichert!');
    
    console.log(`⏱️ Neue Geschwindigkeit: ${speed}x`);
}

function loadSettings() {
    const speed = localStorage.getItem('gameSpeed');
    const apiKey = localStorage.getItem('groqApiKey');
    
    if (speed) {
        GameTime.updateSpeed(parseFloat(speed));
        console.log(`⚙️ Geschwindigkeit geladen: ${speed}x`);
    }
    
    if (apiKey) {
        if (game) game.apiKey = apiKey;
        if (window.gameAIGenerator) window.gameAIGenerator.apiKey = apiKey;
        console.log('✅ API Key geladen');
    }
}

function toggleAPIKeyVisibility() {
    const input = document.getElementById('groq-api-key');
    const icon = document.getElementById('api-key-toggle-icon');
    
    if (!input || !icon) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function openShop() {
    alert('🛍️ Shop - In Entwicklung!\n\nIm Freien Spiel sind bereits alle Fahrzeuge verfügbar.');
}

function startTutorial() {
    alert('🎓 Tutorial - In Entwicklung!\n\nStarte das Freie Spiel und probiere es einfach aus!');
}

// Initialisierung beim Laden
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ILS Waiblingen Simulator v4.15 geladen (GAME-TIMER + WEATHER + CALL-TEMPLATES!)');
    console.log('✅✅✅ PHASE 3.1.1: Optimierte UI Updates - Nur bei Änderungen!');
    console.log('🐛 FIX: Game Loop stoppt bei Pause - CPU-Savings!');
    console.log('🐛 FIX: Null-Checks in updateUI - keine Runtime-Errors!');
    console.log('🔧 FIX: RadioSystem wird in initializeNewSystems() initialisiert');
    console.log('🌦️⏰📞 v9.3.0: Game-Timer + Weather + Call-Templates Integration!');
    
    if (typeof STATIONS !== 'undefined') {
        console.log(`🏥 ${Object.keys(STATIONS).length} Wachen verfügbar`);
    }
    
    if (typeof VEHICLES !== 'undefined') {
        console.log(`🚑 ${VEHICLES.length} Fahrzeuge im System`);
    }
    
    console.log(`⏱️ Spielgeschwindigkeit: ${GameTime.speed}x`);
    
    // Listen for speed changes
    window.addEventListener('gameSpeedChanged', (e) => {
        console.log(`⏱️ Geschwindigkeit geändert: ${e.detail.speed}x`);
    });
});

console.log('✅✅✅ main.js v4.15 geladen - GAME-TIMER + WEATHER + CALL-TEMPLATES INTEGRATION! 🌦️⏰📞');