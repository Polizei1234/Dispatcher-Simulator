// =========================
// HAUPTMODUL
// =========================

let clockInterval = null;

function selectIncident(incidentId) {
    const incident = game.incidents.find(i => i.id === incidentId);
    if (!incident) return;
    
    game.selectedIncident = incident;
    
    const details = document.getElementById('incident-details');
    const keywordInfo = KEYWORDS_BW[incident.keyword];
    const color = keywordInfo ? keywordInfo.color : '#dc3545';
    
    details.innerHTML = `
        <div class="incident-header" style="background: ${color}; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h2 style="margin: 0; color: white;">${incident.keyword}</h2>
            <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.9);">${keywordInfo ? keywordInfo.name : 'Einsatz'}</p>
        </div>
        
        <div class="form-group">
            <label>Einsatzort:</label>
            <input type="text" id="protocol-location" value="${incident.location || 'Wird ermittelt'}" class="form-control" onchange="updateProtocolField('location', this.value)">
            ${incident.actualLocation ? `<button class="btn btn-small btn-primary" onclick="transferLocationFromCall()" style="margin-top: 5px;"><i class="fas fa-download"></i> Adresse aus Anruf</button>` : ''}
        </div>
        
        <div class="form-group">
            <label>Meldung:</label>
            <textarea id="protocol-description" class="form-control" rows="3" onchange="updateProtocolField('description', this.value)">${incident.description || ''}</textarea>
        </div>
        
        <div class="form-group">
            <label>Patient - Alter:</label>
            <input type="text" id="protocol-age" value="${incident.patientAge || ''}" class="form-control" onchange="updateProtocolField('patientAge', this.value)">
        </div>
        
        <div class="vehicle-selection-section" style="margin-top: 20px;">
            <h3>Fahrzeugauswahl</h3>
            <div id="vehicle-selection-list"></div>
            <button class="btn btn-success" onclick="dispatchSelectedVehicles()" style="margin-top: 10px; width: 100%;">
                <i class="fas fa-broadcast-tower"></i> Alarmieren
            </button>
        </div>
        
        <div class="assigned-vehicles-section" style="margin-top: 20px;">
            <h3>Alarmierte Fahrzeuge</h3>
            <div id="assigned-vehicles-list">
                ${incident.assignedVehicles && incident.assignedVehicles.length > 0 ? 
                    incident.assignedVehicles.map(vId => {
                        const v = game.vehicles.find(vehicle => vehicle.id === vId);
                        return v ? `<p>✅ ${v.callsign} - ${v.status}</p>` : '';
                    }).join('') : '<p class="no-data">Noch keine Fahrzeuge</p>'
                }
            </div>
        </div>
    `;
    
    updateVehicleSelectionList(incident);
}

function updateProtocolField(field, value) {
    if (!game.selectedIncident) return;
    game.selectedIncident[field] = value;
}

function transferLocationFromCall() {
    if (!game.selectedIncident || !game.selectedIncident.actualLocation) {
        alert('Keine Adresse aus Anruf verfügbar!');
        return;
    }
    
    const locationInput = document.getElementById('protocol-location');
    if (locationInput) {
        locationInput.value = game.selectedIncident.actualLocation;
        updateProtocolField('location', game.selectedIncident.actualLocation);
        alert('✅ Adresse übernommen!');
    }
}

function updateVehicleSelectionList(incident) {
    const container = document.getElementById('vehicle-selection-list');
    if (!container) return;
    
    const keywordInfo = KEYWORDS_BW[incident.keyword];
    const required = keywordInfo ? keywordInfo.required || [] : [];
    
    const availableVehicles = game.vehicles.filter(v => v.owned && v.status === 'available');
    
    container.innerHTML = `
        <p style="margin-bottom: 10px; font-size: 0.9em; color: #a0a0a0;">
            <strong>Benötigt:</strong> ${required.join(', ') || 'Keine Vorgabe'}
        </p>
        ${availableVehicles.map(v => `
            <label style="display: block; padding: 8px; margin: 5px 0; background: #1e2a38; border-radius: 6px; cursor: pointer;">
                <input type="checkbox" class="vehicle-checkbox" data-vehicle-id="${v.id}" 
                    ${required.includes(v.type) ? 'checked' : ''}>
                ${getVehicleIcon(v.type)} <strong>${v.callsign}</strong>
                <small style="color: #a0a0a0;">${v.type}</small>
            </label>
        `).join('')}
    `;
}

function dispatchSelectedVehicles() {
    if (!game.selectedIncident) return;
    
    const checkboxes = document.querySelectorAll('.vehicle-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.dataset.vehicleId);
    
    if (selectedIds.length === 0) {
        alert('Bitte wähle mindestens ein Fahrzeug!');
        return;
    }
    
    selectedIds.forEach(vId => game.dispatchVehicle(vId, game.selectedIncident.id));
    
    alert(`✅ ${selectedIds.length} Fahrzeug(e) alarmiert!`);
    selectIncident(game.selectedIncident.id);
}

function updateIncidentList() {
    const list = document.getElementById('incident-list');
    if (!list) return;
    
    const activeIncidents = game.incidents.filter(i => 
        i.status !== 'incoming' && i.status !== 'in-call' && i.status !== 'completed'
    );
    
    if (activeIncidents.length === 0) {
        list.innerHTML = '<p class="no-data">Keine aktiven Einsätze</p>';
        return;
    }
    
    list.innerHTML = activeIncidents.map(incident => {
        const keywordInfo = KEYWORDS_BW[incident.keyword];
        const color = keywordInfo ? keywordInfo.color : '#dc3545';
        
        return `
            <div class="incident-item" onclick="selectIncident('${incident.id}')" 
                 style="border-left: 4px solid ${color}; cursor: pointer; padding: 10px; margin: 10px 0; background: #1e2a38; border-radius: 6px;">
                <strong>${incident.keyword}</strong><br>
                <small>${incident.description || 'Details unklar'}</small><br>
                <small style="color: #a0a0a0;">${incident.location || 'Adresse wird ermittelt'}</small>
            </div>
        `;
    }).join('');
    
    document.getElementById('incident-count').textContent = activeIncidents.length;
}

function updateVehicleList() {
    const list = document.getElementById('vehicle-list');
    if (!list) return;
    
    const ownedVehicles = game.vehicles.filter(v => v.owned);
    
    if (ownedVehicles.length === 0) {
        list.innerHTML = '<p class="no-data">Keine Fahrzeuge</p>';
        return;
    }
    
    list.innerHTML = ownedVehicles.map(v => {
        let statusColor = '#4caf50';
        let statusText = 'Verfügbar';
        
        if (v.status === 'dispatched') {
            statusColor = '#ff9800';
            statusText = 'Unterwegs';
        } else if (v.status === 'on-scene') {
            statusColor = '#2196f3';
            statusText = 'Vor Ort';
        }
        
        return `
            <div class="vehicle-item" style="padding: 10px; margin: 8px 0; background: #1e2a38; border-radius: 6px; border-left: 4px solid ${statusColor};">
                ${getVehicleIcon(v.type)} <strong>${v.name}</strong><br>
                <small>${v.type}</small><br>
                <span style="color: ${statusColor}; font-size: 0.9em;">● ${statusText}</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('active-vehicles').textContent = ownedVehicles.filter(v => v.status !== 'available').length;
    document.getElementById('total-vehicles').textContent = ownedVehicles.length;
}

function addRadioMessage(sender, message) {
    const feed = document.getElementById('radio-feed');
    if (!feed) return;
    
    const time = new Date().toLocaleTimeString('de-DE');
    const div = document.createElement('div');
    div.className = 'radio-message';
    div.innerHTML = `<small style="color: #888;">[${time}]</small> <strong>${sender}:</strong> ${message}`;
    feed.appendChild(div);
    feed.scrollTop = feed.scrollHeight;
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('de-DE');
    const clockElement = document.getElementById('current-time');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

function playSound(type) {
    if (!CONFIG.SOUND_ENABLED) return;
    console.log(`Sound: ${type}`);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing ILS Waiblingen v2.1...');
    initializeVehicles();
    game = new Game();
    
    // Initialisiere Karte
    if (typeof initMap === 'function') {
        initMap();
        console.log('✅ Karte initialisiert');
    } else {
        console.error('❌ initMap function not found!');
    }
    
    // Starte Uhr
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
    console.log('✅ Uhr gestartet');
    
    // Update-Loop
    setInterval(() => {
        if (game) {
            game.update();
            updateIncidentList();
            updateVehicleList();
            if (typeof updateMap === 'function') {
                updateMap();
            }
        }
    }, 2000);
    
    console.log('✅ Alle Systeme bereit!');
});