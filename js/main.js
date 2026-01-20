// =========================
// HAUPTPROGRAMM
// =========================

// Globale Variablen
let map = null;

// Initialisierung nach DOM-Laden
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dispatcher Simulator geladen');
    
    // Prüfe ob gespeicherter Spielstand existiert
    checkSavedGame();
});

function checkSavedGame() {
    // Später: Lade gespeicherten Spielstand
    // Für jetzt: Zeige Willkommensbildschirm
}

function startNewGame() {
    console.log('Starte neues Spiel');
    
    // Verstecke Willkommensbildschirm
    document.getElementById('welcome-screen').classList.remove('active');
    
    // Zeige Spielcontainer
    document.getElementById('game-container').classList.remove('hidden');
    
    // Initialisiere Spiel
    game = new Game();
    game.init();
    
    // Initialisiere Karte
    initMap();
    
    // Initialisiere UI
    updateUI();
    updateVehicleList();
    updateIncidentList();
    
    // Begrüßungsnachricht
    addRadioMessage('System', 'Willkommen bei der ILS Waiblingen! Viel Erfolg beim Disponieren.');
}

function startTutorial() {
    console.log('Starte Tutorial');
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('tutorial-overlay').classList.add('active');
    initTutorial();
}

function showSettings() {
    console.log('Öffne Einstellungen');
    document.getElementById('settings-overlay').classList.add('active');
    
    // Lade aktuelle Einstellungen
    if (game) {
        document.getElementById('game-speed').value = game.gameSpeed;
        document.getElementById('api-key').value = game.apiKey;
        document.getElementById('sound-enabled').checked = game.soundEnabled;
    } else {
        // Lade aus localStorage
        const saved = localStorage.getItem('dispatcher-settings');
        if (saved) {
            const settings = JSON.parse(saved);
            document.getElementById('game-speed').value = settings.gameSpeed || 5;
            document.getElementById('api-key').value = settings.apiKey || '';
            document.getElementById('sound-enabled').checked = settings.soundEnabled !== false;
        }
    }
}

function closeSettings() {
    document.getElementById('settings-overlay').classList.remove('active');
}

function saveSettings() {
    const gameSpeed = parseInt(document.getElementById('game-speed').value);
    const apiKey = document.getElementById('api-key').value;
    const soundEnabled = document.getElementById('sound-enabled').checked;
    
    if (game) {
        game.gameSpeed = gameSpeed;
        game.apiKey = apiKey;
        game.soundEnabled = soundEnabled;
        game.saveSettings();
        
        // Update UI
        document.getElementById('game-speed-indicator').textContent = gameSpeed + 'x';
    } else {
        // Speichere für späteren Spielstart
        const settings = {
            gameSpeed: gameSpeed,
            apiKey: apiKey,
            soundEnabled: soundEnabled
        };
        localStorage.setItem('dispatcher-settings', JSON.stringify(settings));
    }
    
    alert('Einstellungen gespeichert!');
    closeSettings();
}

function updateGameSpeed() {
    if (game) {
        game.gameSpeed = parseInt(document.getElementById('game-speed').value);
        document.getElementById('game-speed-indicator').textContent = game.gameSpeed + 'x';
    }
}

function updateUI() {
    if (game) {
        game.updateUI();
    }
}

function updateVehicleList() {
    if (!game) return;
    
    const container = document.getElementById('vehicle-list');
    container.innerHTML = '';
    
    // Filtere Fahrzeuge nach aktuellem Tab
    const activeTab = document.querySelector('.tab-btn.active');
    let vehicleType = 'rtw';
    if (activeTab) {
        vehicleType = activeTab.textContent.toLowerCase();
    }
    
    let filteredVehicles = game.vehicles.filter(v => v.owned);
    
    if (vehicleType === 'rtw/nef') {
        filteredVehicles = filteredVehicles.filter(v => v.type === 'RTW' || v.type === 'NEF');
    } else if (vehicleType === 'ktw') {
        filteredVehicles = filteredVehicles.filter(v => v.type === 'KTW');
    } else if (vehicleType === 'feuerwehr') {
        filteredVehicles = filteredVehicles.filter(v => v.type.includes('LF') || v.type.includes('DLK') || v.type.includes('TLF'));
    } else if (vehicleType === 'polizei') {
        filteredVehicles = filteredVehicles.filter(v => v.type.includes('FuStW') || v.type.includes('Streifenwagen'));
    }
    
    if (filteredVehicles.length === 0) {
        container.innerHTML = '<p class="no-data">Keine Fahrzeuge vorhanden</p>';
        return;
    }
    
    filteredVehicles.forEach(vehicle => {
        const div = document.createElement('div');
        div.className = 'vehicle-item';
        div.onclick = () => selectVehicleForDispatch(vehicle.id);
        
        let statusClass = 'available';
        let statusText = 'Verfügbar';
        
        if (vehicle.status === 'dispatched') {
            statusClass = 'dispatched';
            statusText = 'Alarmiert';
        } else if (vehicle.status === 'on-scene') {
            statusClass = 'on-scene';
            statusText = 'Vor Ort';
        } else if (vehicle.status === 'unavailable') {
            statusClass = 'unavailable';
            statusText = 'Nicht verfügbar';
        }
        
        div.innerHTML = `
            <div class="vehicle-info">
                <div class="vehicle-callsign">${vehicle.callsign}</div>
                <div class="vehicle-type">${vehicle.type}</div>
            </div>
            <span class="vehicle-status ${statusClass}">${statusText}</span>
        `;
        
        container.appendChild(div);
    });
}

function updateIncidentList() {
    if (!game) return;
    
    const container = document.getElementById('incident-list');
    container.innerHTML = '';
    
    const activeIncidents = game.incidents.filter(i => i.status !== 'completed');
    
    if (activeIncidents.length === 0) {
        container.innerHTML = '<p class="no-data">Keine aktiven Einsätze</p>';
        return;
    }
    
    activeIncidents.forEach(incident => {
        const div = document.createElement('div');
        div.className = 'incident-item';
        if (game.selectedIncident && game.selectedIncident.id === incident.id) {
            div.classList.add('selected');
        }
        div.onclick = () => selectIncident(incident.id);
        
        const timeStr = incident.time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        
        div.innerHTML = `
            <div class="incident-header">
                <span class="incident-keyword">${incident.keyword}</span>
                <span class="incident-time">${timeStr}</span>
            </div>
            <div class="incident-location"><i class="fas fa-map-marker-alt"></i> ${incident.location}</div>
            <div class="incident-description">${incident.description}</div>
        `;
        
        container.appendChild(div);
    });
}

function selectIncident(incidentId) {
    if (!game) return;
    
    const incident = game.incidents.find(i => i.id === incidentId);
    if (!incident) return;
    
    game.selectedIncident = incident;
    updateIncidentList();
    showIncidentDetails(incident);
    
    // Zeige Einsatz auf Karte
    if (map && incident.position) {
        map.setView(incident.position, 14);
    }
}

function showIncidentDetails(incident) {
    const container = document.getElementById('incident-details');
    
    const timeStr = incident.time.toLocaleTimeString('de-DE');
    const keywordInfo = KEYWORDS_BW[incident.keyword];
    
    container.innerHTML = `
        <h4><span class="incident-keyword">${incident.keyword}</span></h4>
        <p><strong>Zeit:</strong> ${timeStr}</p>
        <p><strong>Ort:</strong> ${incident.location}</p>
        <p><strong>Meldung:</strong> ${incident.description}</p>
        ${incident.details ? `<p><strong>Details:</strong> ${incident.details}</p>` : ''}
        <p><strong>Empfohlene Fahrzeuge:</strong> ${keywordInfo ? keywordInfo.vehicles.join(', ') : 'N/A'}</p>
        <hr>
        <button class="btn btn-primary" onclick="showDispatchDialog('${incident.id}')">
            <i class="fas fa-truck-medical"></i> Einsatzmittel alarmieren
        </button>
    `;
}

function showDispatchDialog(incidentId) {
    const incident = game.incidents.find(i => i.id === incidentId);
    if (!incident) return;
    
    const modal = document.getElementById('dispatch-dialog');
    const content = document.getElementById('dispatch-content');
    
    const availableVehicles = game.vehicles.filter(v => v.status === 'available' && v.owned);
    
    content.innerHTML = `
        <h4>Verfügbare Fahrzeuge für Einsatz ${incident.keyword}</h4>
        <div id="dispatch-vehicle-list">
            ${availableVehicles.map(v => `
                <div class="vehicle-item" onclick="dispatchVehicleToIncident('${v.id}', '${incidentId}')" style="cursor: pointer;">
                    <div class="vehicle-info">
                        <div class="vehicle-callsign">${v.callsign}</div>
                        <div class="vehicle-type">${v.type}</div>
                    </div>
                    <button class="btn btn-small btn-success">Alarmieren</button>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.classList.add('active');
}

function closeDispatchDialog() {
    document.getElementById('dispatch-dialog').classList.remove('active');
}

function dispatchVehicleToIncident(vehicleId, incidentId) {
    if (game.dispatchVehicle(vehicleId, incidentId)) {
        closeDispatchDialog();
        updateVehicleList();
        updateIncidentList();
        updateMap();
    }
}

function selectVehicleForDispatch(vehicleId) {
    // Später: Fahrzeug für Disposition auswählen
}

function showVehicleTab(tabName) {
    // Update Tab-Buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update Fahrzeugliste
    updateVehicleList();
}

function addRadioMessage(callsign, message, type = 'incoming') {
    const container = document.getElementById('radio-log');
    const time = game ? game.gameTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    
    const div = document.createElement('div');
    div.className = `radio-message ${type}`;
    div.innerHTML = `
        <span class="radio-time">${time}</span>
        <span class="radio-callsign">${callsign}:</span>
        <span>${message}</span>
    `;
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function centerMap() {
    if (map) {
        map.setView(CONFIG.MAP_CENTER, CONFIG.MAP_ZOOM);
    }
}