// =========================
// HAUPTSTEUERUNG MIT GROQ AI
// =========================

function showCareerComingSoon() {
    alert('🔒 Karrieremodus kommt bald!\n\nDiese Funktion ist noch in Entwicklung.\nStarte vorerst das Freie Spiel mit allen 90+ Fahrzeugen!');
}

function startNewGame(mode) {
    console.log(`🎮 Starte neues Spiel: ${mode}`);
    
    // Setze Spielmodus
    CONFIG.GAME_MODE = mode;
    
    // Initialisiere Fahrzeuge
    initializeVehicles();
    console.log(`🚑 ${VEHICLES.length} Fahrzeuge initialisiert`);
    
    // Erstelle Spiel
    game = new Game();
    
    // Lade gespeicherte Einstellungen
    loadSettings();
    
    // Initialisiere Karte
    initMap();
    
    // Verstecke Willkommensbildschirm
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('game-container').classList.remove('hidden');
    
    // Update UI
    updateUI();
    
    // Starte Game Loop
    startGameLoop();
    
    // Starte Einsatz-Generator
    startIncidentGenerator();
    
    addRadioMessage('System', `🚑 ILS Waiblingen - ${mode === 'free' ? 'Freies Spiel' : 'Karrieremodus'} gestartet`);
}

function startIncidentGenerator() {
    console.log('🚨 Starte Einsatz-Generator...');
    
    // Generiere ersten Einsatz nach 10 Sekunden
    setTimeout(() => {
        generateRandomIncident();
    }, 10000 / CONFIG.SIMULATION_SPEED);
    
    // Dann alle 2-5 Minuten
    setInterval(() => {
        const random = Math.random();
        if (random < 0.3) { // 30% Chance alle 2 Minuten
            generateRandomIncident();
        }
    }, 120000 / CONFIG.SIMULATION_SPEED);
}

function generateRandomIncident() {
    if (!game) return;
    
    console.log('🚨 Generiere neuen Einsatz...');
    
    // Wähle zufälliges Stichwort
    const keywords = Object.keys(KEYWORDS_BW);
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const keywordData = KEYWORDS_BW[keyword];
    
    // Zufällige Position im Rems-Murr-Kreis
    const center = [48.8309, 9.3256]; // Waiblingen
    const randomLat = center[0] + (Math.random() - 0.5) * 0.3;
    const randomLng = center[1] + (Math.random() - 0.5) * 0.3;
    
    // Zufällige Straße
    const streets = [
        'Hauptstraße', 'Bahnhofstraße', 'Schulstraße', 'Mühlweg',
        'Gartenstraße', 'Waldweg', 'Kirchplatz', 'Marktplatz'
    ];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const number = Math.floor(Math.random() * 100) + 1;
    
    const incident = {
        id: `INC_${Date.now()}`,
        keyword: keyword,
        title: keywordData.name,
        type: keyword.includes('B ') ? 'fire' : (keyword.includes('THL') ? 'technical' : 'medical'),
        location: `${street} ${number}, Waiblingen`,
        position: [randomLat, randomLng],
        timestamp: Date.now(),
        status: 'pending',
        priority: keywordData.priority || 'normal',
        assignedVehicles: [],
        description: `Einsatzstichwort: ${keyword} - ${keywordData.name}`
    };
    
    game.incidents.push(incident);
    
    // Zeige Notification
    addRadioMessage('System', `🚨 Neuer Einsatz: ${keyword} - ${incident.location}`);
    
    // Zeige auf Karte
    if (map) {
        addIncidentMarker(incident);
    }
    
    // Update UI
    updateIncidentList();
    
    console.log(`✅ Einsatz ${incident.id} erstellt: ${keyword}`);
}

let gameLoopInterval = null;

function startGameLoop() {
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    
    gameLoopInterval = setInterval(() => {
        if (game) {
            game.update();
            updateUI();
        }
    }, 1000);
}

function updateUI() {
    if (!game) return;
    
    // Zähle verfügbare Fahrzeuge
    const ownedVehicles = game.vehicles.filter(v => v.owned);
    const availableVehicles = ownedVehicles.filter(v => v.status === 'available');
    
    // Update Header
    document.getElementById('total-vehicles').textContent = ownedVehicles.length;
    document.getElementById('active-vehicles').textContent = availableVehicles.length;
    
    // Update Zeit
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleTimeString('de-DE');
    
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
    // Zeige Fahrzeug-Auswahl Dialog
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
    
    CONFIG.SIMULATION_SPEED = parseInt(speed);
    if (game) game.apiKey = apiKey;
    
    document.getElementById('game-speed-indicator').textContent = speed + 'x';
    
    closeSettings();
    alert('✅ Einstellungen gespeichert!');
}

function loadSettings() {
    const speed = localStorage.getItem('gameSpeed');
    const apiKey = localStorage.getItem('groqApiKey');
    
    if (speed) {
        CONFIG.SIMULATION_SPEED = parseInt(speed);
        document.getElementById('game-speed-indicator').textContent = speed + 'x';
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
    const currentIndex = speeds.indexOf(CONFIG.SIMULATION_SPEED);
    const nextIndex = (currentIndex + 1) % speeds.length;
    
    CONFIG.SIMULATION_SPEED = speeds[nextIndex];
    document.getElementById('game-speed-indicator').textContent = speeds[nextIndex] + 'x';
    localStorage.setItem('gameSpeed', speeds[nextIndex]);
}

function openShop() {
    alert('🛍️ Shop - In Entwicklung!\n\nIm Freien Spiel sind bereits alle Fahrzeuge verfügbar.');
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
    console.log('🚀 ILS Waiblingen Simulator geladen');
    console.log(`📍 ${Object.keys(STATIONS).length} Wachen verfügbar`);
    console.log(`🚑 ${VEHICLES_CATALOG.length} Fahrzeuge im Katalog`);
});