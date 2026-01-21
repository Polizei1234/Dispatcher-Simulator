// =========================
// HAUPTSTEUERUNG v3.7.0 - BUGFIXES
// =========================

let gamePaused = false;
let gameTickCounter = 0;

// ⏰ ZENTRALES ZEITSYSTEM - Wird von game.js genutzt!
window.GameTime = {
    simulated: new Date(),    // Uhrzeit für Anzeige (z.B. "16:42:35")
    elapsed: 0,               // Verstrichene Spielzeit in ms (für Einsatz-Timing)
    speed: 5, // Default 5x
    lastTick: Date.now(),
    
    // Hilfsfunktionen
    tick: function(deltaMs) {
        const gameMs = deltaMs * this.speed;
        this.elapsed += gameMs;
        this.simulated = new Date(this.simulated.getTime() + gameMs);
    },
    
    reset: function() {
        this.simulated = new Date();
        this.simulated.setHours(8, 0, 0, 0); // Start um 08:00
        this.elapsed = 0;
        this.speed = CONFIG?.GAME_SPEED || 5;
        this.lastTick = Date.now();
        console.log('⏰ Zeit zurückgesetzt auf 08:00:00');
    },
    
    updateSpeed: function(newSpeed) {
        this.speed = newSpeed;
        if (typeof CONFIG !== 'undefined') {
            CONFIG.GAME_SPEED = newSpeed;
        }
        console.log(`⏱️ Geschwindigkeit: ${newSpeed}x`);
    }
};

// 🎮 GAME_DATA Global (für CallSystem & VehicleMovement)
window.GAME_DATA = {
    vehicles: [],
    incidents: [],
    stations: {}
};

function showCareerComingSoon() {
    alert('🔒 Karrieremodus kommt bald!\n\nDiese Funktion ist noch in Entwicklung.\nStarte vorerst das Freie Spiel mit allen Fahrzeugen!');
}

function startNewGame(mode) {
    console.log(`🎮 Starte neues Spiel: ${mode}`);
    console.log(`⏱️ Spielgeschwindigkeit: ${CONFIG.GAME_SPEED}x`);
    
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
    
    // Update UI
    updateUI();
    
    // Starte Game Loop
    console.log('🔄 Starte Game Loop...');
    startGameLoop();
    
    addRadioMessage('System', `🚑 ILS Waiblingen - ${mode === 'free' ? 'Freies Spiel' : 'Karrieremodus'} gestartet`);
    addRadioMessage('System', `⏱️ Spielgeschwindigkeit: ${CONFIG.GAME_SPEED}x`);
    addRadioMessage('System', '🤖 Einsätze werden jetzt mit KI generiert');
}

function togglePause() {
    gamePaused = !gamePaused;
    
    const icon = document.getElementById('pause-icon');
    const btn = document.getElementById('pause-btn');
    
    if (gamePaused) {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        btn.title = 'Fortsetzen';
        btn.style.background = '#28a745';
        addRadioMessage('System', '⏸️ Spiel pausiert');
        console.log('⏸️ Spiel pausiert');
    } else {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        btn.title = 'Pausieren';
        btn.style.background = '';
        addRadioMessage('System', '▶️ Spiel fortgesetzt');
        console.log('▶️ Spiel fortgesetzt');
    }
}

let gameLoopInterval = null;

function startGameLoop() {
    if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
        console.log('🗑️ Alter Game Loop gestoppt');
    }
    
    console.log('🔄 Starte neuen Game Loop (1000ms Intervall)...');
    
    gameLoopInterval = setInterval(() => {
        gameTickCounter++;
        
        // Debug-Log alle 5 Sekunden
        if (gameTickCounter % 5 === 0) {
            console.log(`⏱️ Tick #${gameTickCounter} | Pause: ${gamePaused} | Einsätze: ${game?.incidents?.length || 0} | Speed: ${GameTime.speed}x | Spielzeit: ${Math.round(GameTime.elapsed/1000)}s`);
        }
        
        if (gamePaused) return;
        
        // Aktualisiere ZENTRALES Zeitsystem
        GameTime.tick(1000);
        
        if (game) {
            game.update();
        }
        
        updateUI();
        
    }, 1000);
    
    console.log('✅ Game Loop gestartet!');
}

function updateUI() {
    if (!game) return;
    
    // Zähle verfügbare Fahrzeuge
    const ownedVehicles = game.vehicles.filter(v => v.owned);
    const availableVehicles = ownedVehicles.filter(v => v.status === 'available');
    
    // Update Header
    const totalEl = document.getElementById('total-vehicles');
    const activeEl = document.getElementById('active-vehicles');
    
    if (totalEl) totalEl.textContent = ownedVehicles.length;
    if (activeEl) activeEl.textContent = availableVehicles.length;
    
    // Update Zeit aus ZENTRALEM System
    const timeEl = document.getElementById('current-time');
    if (timeEl && GameTime.simulated) {
        const hours = String(GameTime.simulated.getHours()).padStart(2, '0');
        const minutes = String(GameTime.simulated.getMinutes()).padStart(2, '0');
        const seconds = String(GameTime.simulated.getSeconds()).padStart(2, '0');
        timeEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // Update Einsatzliste (nur wenn UI.updateIncidentList existiert)
    if (typeof UI !== 'undefined' && UI.updateIncidentList) {
        UI.updateIncidentList();
    } else {
        updateIncidentListFallback();
    }
    
    // Update Karte
    if (typeof map !== 'undefined' && map && typeof updateVehicleMarkers === 'function') {
        updateVehicleMarkers();
    }
}

function updateIncidentListFallback() {
    if (!game) return;
    
    const container = document.getElementById('incident-list');
    const countBadge = document.getElementById('incident-count');
    
    if (!container || !countBadge) return;
    
    const activeIncidents = GAME_DATA.incidents.filter(i => !i.completed);
    countBadge.textContent = activeIncidents.length;
    
    if (activeIncidents.length === 0) {
        container.innerHTML = '<p class="no-data">Keine aktiven Einsätze</p>';
        return;
    }
    
    container.innerHTML = activeIncidents.map(incident => `
        <div class="incident-item" onclick="selectIncident('${incident.id}')">
            <div class="incident-header">
                <span class="incident-badge">🚨</span>
                <span class="incident-number">${incident.id}</span>
            </div>
            <div class="incident-keyword">${incident.stichwort || incident.keyword || 'Einsatz'}</div>
            <div class="incident-location">📍 ${incident.ort || incident.location || 'Unbekannt'}</div>
            <div class="incident-time">🕒 ${incident.zeitstempel || 'Keine Zeit'}</div>
        </div>
    `).join('');
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
    const speed = localStorage.getItem('gameSpeed') || '5';
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
    const speed = document.getElementById('game-speed')?.value || '5';
    const apiKey = document.getElementById('groq-api-key')?.value || '';
    const sound = document.getElementById('sound-enabled')?.checked || true;
    
    localStorage.setItem('gameSpeed', speed);
    localStorage.setItem('groqApiKey', apiKey);
    localStorage.setItem('soundEnabled', sound);
    
    // Update ZENTRALES Zeitsystem
    GameTime.updateSpeed(parseInt(speed));
    if (game) game.apiKey = apiKey;
    
    const indicator = document.getElementById('game-speed-indicator');
    if (indicator) indicator.textContent = speed + 'x';
    
    closeSettings();
    alert('✅ Einstellungen gespeichert!');
    
    addRadioMessage('System', `⏱️ Spielgeschwindigkeit: ${speed}x`);
    console.log(`⏱️ Neue Geschwindigkeit: ${speed}x`);
}

function loadSettings() {
    const speed = localStorage.getItem('gameSpeed');
    const apiKey = localStorage.getItem('groqApiKey');
    
    if (speed) {
        GameTime.updateSpeed(parseInt(speed));
        const indicator = document.getElementById('game-speed-indicator');
        if (indicator) indicator.textContent = speed + 'x';
        console.log(`⚙️ Geschwindigkeit geladen: ${speed}x`);
    }
    
    if (apiKey && game) {
        game.apiKey = apiKey;
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

function cycleGameSpeed() {
    const speeds = [1, 2, 5, 10, 30];
    const currentIndex = speeds.indexOf(GameTime.speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    
    // Update ZENTRALES Zeitsystem
    GameTime.updateSpeed(nextSpeed);
    
    const indicator = document.getElementById('game-speed-indicator');
    if (indicator) indicator.textContent = nextSpeed + 'x';
    
    localStorage.setItem('gameSpeed', nextSpeed);
    
    addRadioMessage('System', `⏱️ Spielgeschwindigkeit: ${nextSpeed}x`);
    console.log(`⏱️ Neue Geschwindigkeit: ${nextSpeed}x`);
}

function openShop() {
    alert('🛒️ Shop - In Entwicklung!\n\nIm Freien Spiel sind bereits alle Fahrzeuge verfügbar.');
}

function startTutorial() {
    alert('🎓 Tutorial - In Entwicklung!\n\nStarte das Freie Spiel und probiere es einfach aus!');
}

// RADIO FEED - KORRIGIERT!
function addRadioMessage(sender, message) {
    // Suche beide möglichen IDs
    let feed = document.getElementById('radio-feed-full');
    if (!feed) feed = document.getElementById('radio-feed');
    if (!feed) {
        console.warn('⚠️ Radio Feed Element nicht gefunden');
        return;
    }
    
    const time = GameTime.simulated ? 
        GameTime.simulated.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit', second: '2-digit'}) :
        new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    
    const entry = document.createElement('div');
    entry.className = 'radio-message';
    entry.innerHTML = `
        <span style="color: #666; font-size: 0.85em;">[${time}]</span>
        <strong style="margin: 0 5px;">${sender}:</strong>
        <span>${message}</span>
    `;
    
    feed.appendChild(entry);
    feed.scrollTop = feed.scrollHeight;
    
    // Limitiere auf 100 Einträge
    while (feed.children.length > 100) {
        feed.removeChild(feed.firstChild);
    }
}

// Initialisierung beim Laden
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ILS Waiblingen Simulator v3.7.0 geladen');
    
    if (typeof STATIONS !== 'undefined') {
        console.log(`🏥 ${Object.keys(STATIONS).length} Wachen verfügbar`);
    }
    
    if (typeof VEHICLES !== 'undefined') {
        console.log(`🚑 ${VEHICLES.length} Fahrzeuge im System`);
    }
    
    console.log(`⏱️ Spielgeschwindigkeit: ${GameTime.speed}x`);
});