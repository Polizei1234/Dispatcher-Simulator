// =========================
// HAUPTSTEUERUNG v3.6
// =========================

let gamePaused = false;
let gameTime = Date.now();
let gameTickCounter = 0;

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
    
    // Lade gespeicherte Einstellungen
    loadSettings();
    
    // Initialisiere Karte
    initMap();
    
    // Verstecke Willkommensbildschirm
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('game-container').classList.remove('hidden');
    
    // Setze Startzeit
    gameTime = Date.now();
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
            console.log(`⏱️ Game Loop Tick #${gameTickCounter} | Pausiert: ${gamePaused} | Einsätze: ${game?.incidents?.length || 0}`);
        }
        
        if (gamePaused) return;
        
        if (game) {
            game.update();
            updateUI();
        }
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
    
    // Update Zeit (immer, auch wenn pausiert, damit man sieht dass es läuft)
    const timeEl = document.getElementById('current-time');
    if (timeEl) {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString('de-DE');
    }
    
    // Update Einsatzliste
    updateIncidentList();
    
    // Update Karte
    if (map) {
        updateVehicleMarkers();
    }
}

function updateIncidentList() {
    if (!game) return;
    
    const container = document.getElementById('incident-list');
    const countBadge = document.getElementById('incident-count');
    
    if (!container || !countBadge) return;
    
    const activeIncidents = game.incidents.filter(i => i.status !== 'completed');
    countBadge.textContent = activeIncidents.length;
    
    if (activeIncidents.length === 0) {
        container.innerHTML = '<p class="no-data">Keine aktiven Einsätze</p>';
        return;
    }
    
    container.innerHTML = activeIncidents.map(incident => `
        <div class="incident-item ${game.selectedIncident?.id === incident.id ? 'selected' : ''}" 
             onclick="selectIncident('${incident.id}')">
            <div class="incident-header">
                <span class="incident-keyword">${incident.keyword}</span>
                <span class="incident-time">${new Date(incident.timestamp).toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'})}</span>
            </div>
            <div class="incident-title">${incident.title}</div>
            <div class="incident-location">📍 ${incident.location}</div>
        </div>
    `).join('');
}

function selectIncident(incidentId) {
    if (!game) return;
    
    const incident = game.incidents.find(i => i.id === incidentId);
    if (!incident) return;
    
    game.selectedIncident = incident;
    updateIncidentList();
    showIncidentDetails(incident);
    
    // Zentriere Karte auf Einsatz
    if (map && incident.position) {
        map.setView(incident.position, 15);
    }
}

function showIncidentDetails(incident) {
    const container = document.getElementById('incident-details');
    if (!container) return;
    
    const keywordData = KEYWORDS_BW[incident.keyword];
    
    container.innerHTML = `
        <h3>${incident.keyword}: ${incident.title}</h3>
        <p><strong>📍 Ort:</strong> ${incident.location}</p>
        <p><strong>⏰ Zeit:</strong> ${new Date(incident.timestamp).toLocaleTimeString('de-DE')}</p>
        <p><strong>🚨 Priorität:</strong> ${incident.priority}</p>
        
        ${keywordData ? `
            <h4>Benötigte Fahrzeuge:</h4>
            <ul>
                ${keywordData.required.map(type => `<li>${type}</li>`).join('')}
            </ul>
        ` : ''}
        
        ${incident.assignedVehicles && incident.assignedVehicles.length > 0 ? `
            <h4>Alarmierte Fahrzeuge:</h4>
            <ul>
                ${incident.assignedVehicles.map(vid => {
                    const v = game.vehicles.find(vehicle => vehicle.id === vid);
                    return v ? `<li>${v.callsign}</li>` : '';
                }).join('')}
            </ul>
        ` : ''}
        
        <div style="margin-top: 15px;">
            <button class="btn btn-primary" onclick="showVehicleSelection('${incident.id}')">
                <i class="fas fa-ambulance"></i> Fahrzeuge alarmieren
            </button>
        </div>
    `;
}

function showVehicleSelection(incidentId) {
    alert('🚑 Fahrzeugauswahl - In Entwicklung!\n\nKlicke auf der Karte auf Fahrzeuge oder nutze den Fahrzeuge-Tab.');
}

function selectVehicleForIncident(vehicleId) {
    if (!game || !game.selectedIncident) {
        alert('⚠️ Bitte wähle zuerst einen Einsatz aus!');
        return;
    }
    
    game.dispatchVehicle(vehicleId, game.selectedIncident.id);
    updateUI();
}

function showSettings() {
    document.getElementById('settings-overlay').classList.add('active');
    
    // Lade aktuelle Einstellungen
    const speed = localStorage.getItem('gameSpeed') || '5';
    const apiKey = localStorage.getItem('groqApiKey') || '';
    const sound = localStorage.getItem('soundEnabled') !== 'false';
    
    document.getElementById('game-speed').value = speed;
    document.getElementById('groq-api-key').value = apiKey;
    document.getElementById('sound-enabled').checked = sound;
}

function closeSettings() {
    document.getElementById('settings-overlay').classList.remove('active');
}

function saveSettings() {
    const speed = document.getElementById('game-speed').value;
    const apiKey = document.getElementById('groq-api-key').value;
    const sound = document.getElementById('sound-enabled').checked;
    
    localStorage.setItem('gameSpeed', speed);
    localStorage.setItem('groqApiKey', apiKey);
    localStorage.setItem('soundEnabled', sound);
    
    CONFIG.GAME_SPEED = parseInt(speed);
    if (game) game.apiKey = apiKey;
    
    document.getElementById('game-speed-indicator').textContent = speed + 'x';
    
    closeSettings();
    alert('✅ Einstellungen gespeichert!');
}

function loadSettings() {
    const speed = localStorage.getItem('gameSpeed');
    const apiKey = localStorage.getItem('groqApiKey');
    
    if (speed) {
        CONFIG.GAME_SPEED = parseInt(speed);
        const indicator = document.getElementById('game-speed-indicator');
        if (indicator) indicator.textContent = speed + 'x';
        console.log(`⚙️ Geschwindigkeit geladen: ${speed}x`);
    }
    
    if (apiKey && game) {
        game.apiKey = apiKey;
    }
}

function toggleAPIKeyVisibility() {
    const input = document.getElementById('groq-api-key');
    const icon = document.getElementById('api-key-toggle-icon');
    
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
    const currentIndex = speeds.indexOf(CONFIG.GAME_SPEED);
    const nextIndex = (currentIndex + 1) % speeds.length;
    
    CONFIG.GAME_SPEED = speeds[nextIndex];
    document.getElementById('game-speed-indicator').textContent = speeds[nextIndex] + 'x';
    localStorage.setItem('gameSpeed', speeds[nextIndex]);
    
    addRadioMessage('System', `⏱️ Spielgeschwindigkeit: ${speeds[nextIndex]}x`);
    console.log(`⏱️ Neue Geschwindigkeit: ${speeds[nextIndex]}x`);
}

function openShop() {
    alert('🛒 Shop - In Entwicklung!\n\nIm Freien Spiel sind bereits alle Fahrzeuge verfügbar.');
}

function startTutorial() {
    alert('🎓 Tutorial - In Entwicklung!\n\nStarte das Freie Spiel und probiere es einfach aus!');
}

// RADIO FEED
function addRadioMessage(sender, message) {
    const feed = document.getElementById('radio-feed');
    if (!feed) return;
    
    const time = new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    
    const entry = document.createElement('div');
    entry.className = 'radio-entry';
    entry.innerHTML = `
        <span class="radio-time">${time}</span>
        <strong>${sender}:</strong> ${message}
    `;
    
    feed.insertBefore(entry, feed.firstChild);
    
    // Limitiere auf 50 Einträge
    while (feed.children.length > 50) {
        feed.removeChild(feed.lastChild);
    }
}

// Initialisierung beim Laden
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ILS Waiblingen Simulator v3.6 geladen');
    console.log(`📍 ${Object.keys(STATIONS).length} Wachen verfügbar`);
    console.log(`🚑 ${VEHICLES_CATALOG.length} Fahrzeuge im Katalog`);
    console.log(`⏱️ Spielgeschwindigkeit: ${CONFIG.GAME_SPEED}x`);
});