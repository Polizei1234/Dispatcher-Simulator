// =========================
// HAUPTMODUL - UI & PROTOKOLL
// =========================

function selectIncident(incidentId) {
    const incident = game.incidents.find(i => i.id === incidentId);
    if (!incident) return;
    
    game.selectedIncident = incident;
    
    // Zeige editierbares Protokoll
    const details = document.getElementById('incident-details');
    const keywordInfo = KEYWORDS_BW[incident.keyword];
    const color = keywordInfo ? keywordInfo.color : '#dc3545';
    
    details.innerHTML = `
        <div class="incident-header" style="background: ${color}; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h2 style="margin: 0; color: white;">${incident.keyword}</h2>
            <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.9);">
                ${keywordInfo ? keywordInfo.name : 'Einsatz'}
            </p>
        </div>
        
        <div class="protocol-section">
            <h3>Einsatzprotokoll</h3>
            
            <div class="form-group">
                <label>Einsatznummer:</label>
                <input type="text" value="${incident.id.toUpperCase()}" readonly class="form-control-readonly">
            </div>
            
            <div class="form-group">
                <label>Datum/Uhrzeit:</label>
                <input type="text" value="${new Date(incident.timestamp).toLocaleString('de-DE')}" readonly class="form-control-readonly">
            </div>
            
            <div class="form-group">
                <label>Stichwort:</label>
                <select id="protocol-keyword" class="form-control" onchange="updateProtocolField('keyword', this.value)">
                    ${Object.keys(KEYWORDS_BW).map(kw => 
                        `<option value="${kw}" ${kw === incident.keyword ? 'selected' : ''}>${kw} - ${KEYWORDS_BW[kw].name}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label>Einsatzort (Adresse): <button class="btn-small btn-primary" onclick="transferLocationFromCall()" title="Adresse aus Anruf übernehmen"><i class="fas fa-download"></i></button></label>
                <input type="text" id="protocol-location" value="${incident.location || 'Wird ermittelt...'}" class="form-control" onchange="updateProtocolField('location', this.value)">
            </div>
            
            <div class="form-group">
                <label>Melder/Anrufer:</label>
                <input type="text" id="protocol-caller" value="${incident.caller || 'Unbekannt'}" class="form-control" onchange="updateProtocolField('caller', this.value)">
            </div>
            
            <div class="form-group">
                <label>Meldung:</label>
                <textarea id="protocol-description" class="form-control" rows="3" onchange="updateProtocolField('description', this.value)">${incident.description || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label>Patient - Alter:</label>
                <input type="text" id="protocol-age" value="${incident.patientAge || ''}" class="form-control" onchange="updateProtocolField('patientAge', this.value)" placeholder="z.B. 45 Jahre">
            </div>
            
            <div class="form-group">
                <label>Patient - Geschlecht:</label>
                <select id="protocol-gender" class="form-control" onchange="updateProtocolField('patientGender', this.value)">
                    <option value="">Unbekannt</option>
                    <option value="Männlich" ${incident.patientGender === 'Männlich' ? 'selected' : ''}>Männlich</option>
                    <option value="Weiblich" ${incident.patientGender === 'Weiblich' ? 'selected' : ''}>Weiblich</option>
                    <option value="Divers" ${incident.patientGender === 'Divers' ? 'selected' : ''}>Divers</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Lage beim Eintreffen:</label>
                <textarea id="protocol-onscene" class="form-control" rows="2" onchange="updateProtocolField('onSceneSituation', this.value)" placeholder="Beschreibung der Lage vor Ort">${incident.onSceneSituation || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label>Maßnahmen:</label>
                <textarea id="protocol-measures" class="form-control" rows="3" onchange="updateProtocolField('measures', this.value)" placeholder="Durchgeführte Maßnahmen">${incident.measures || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label>Bemerkungen:</label>
                <textarea id="protocol-notes" class="form-control" rows="2" onchange="updateProtocolField('notes', this.value)" placeholder="Sonstige Bemerkungen">${incident.notes || ''}</textarea>
            </div>
        </div>
        
        <div class="vehicle-selection-section" style="margin-top: 20px;">
            <h3>Fahrzeugauswahl</h3>
            <div id="vehicle-selection-list"></div>
            <button class="btn btn-success" onclick="dispatchSelectedVehicles()" style="margin-top: 10px; width: 100%;">
                <i class="fas fa-broadcast-tower"></i> Ausgewählte Fahrzeuge alarmieren
            </button>
        </div>
        
        <div class="assigned-vehicles-section" style="margin-top: 20px;">
            <h3>Alarmierte Fahrzeuge</h3>
            <div id="assigned-vehicles-list">
                ${incident.assignedVehicles && incident.assignedVehicles.length > 0 ? 
                    incident.assignedVehicles.map(vId => {
                        const v = game.vehicles.find(vehicle => vehicle.id === vId);
                        return v ? `<p>✅ ${v.callsign} - ${v.status}</p>` : '';
                    }).join('') : '<p class="no-data">Noch keine Fahrzeuge alarmiert</p>'
                }
            </div>
        </div>
        
        <button class="btn btn-secondary" onclick="exportProtocol()" style="margin-top: 15px; width: 100%;">
            <i class="fas fa-file-download"></i> Protokoll exportieren (JSON)
        </button>
    `;
    
    updateVehicleSelectionList(incident);
}

function updateProtocolField(field, value) {
    if (!game.selectedIncident) return;
    game.selectedIncident[field] = value;
    console.log(`Protokoll aktualisiert: ${field} = ${value}`);
}

function transferLocationFromCall() {
    if (!game.selectedIncident || !game.selectedIncident.actualLocation) {
        alert('Keine Adresse aus dem Anruf verfügbar!');
        return;
    }
    
    const locationInput = document.getElementById('protocol-location');
    if (locationInput) {
        locationInput.value = game.selectedIncident.actualLocation;
        updateProtocolField('location', game.selectedIncident.actualLocation);
        alert('✅ Adresse aus Anruf übernommen!');
    }
}

function updateVehicleSelectionList(incident) {
    const container = document.getElementById('vehicle-selection-list');
    if (!container) return;
    
    const keywordInfo = KEYWORDS_BW[incident.keyword];
    const required = keywordInfo ? keywordInfo.required || [] : [];
    const optional = keywordInfo ? keywordInfo.optional || [] : [];
    
    const availableVehicles = game.vehicles.filter(v => v.owned && v.status === 'available');
    
    container.innerHTML = `
        <p style="margin-bottom: 10px; font-size: 0.9em; color: #a0a0a0;">
            <strong>Benötigt:</strong> ${required.join(', ') || 'Keine Vorgabe'}<br>
            <strong>Optional:</strong> ${optional.join(', ') || 'Keine'}
        </p>
        ${availableVehicles.map(v => `
            <label style="display: block; padding: 8px; margin: 5px 0; background: #1e2a38; border-radius: 6px; cursor: pointer;">
                <input type="checkbox" class="vehicle-checkbox" data-vehicle-id="${v.id}" 
                    ${required.includes(v.type) ? 'checked' : ''}>
                <strong>${v.callsign}</strong> (${v.type})
                <small style="color: #a0a0a0; margin-left: 10px;">${STATIONS[v.station].name}</small>
            </label>
        `).join('')}
    `;
}

function dispatchSelectedVehicles() {
    if (!game.selectedIncident) return;
    
    const checkboxes = document.querySelectorAll('.vehicle-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.dataset.vehicleId);
    
    if (selectedIds.length === 0) {
        alert('Bitte wähle mindestens ein Fahrzeug aus!');
        return;
    }
    
    selectedIds.forEach(vId => {
        game.dispatchVehicle(vId, game.selectedIncident.id);
    });
    
    alert(`✅ ${selectedIds.length} Fahrzeug(e) alarmiert!`);
    selectIncident(game.selectedIncident.id); // Refresh
}

function exportProtocol() {
    if (!game.selectedIncident) return;
    
    const protocol = {
        einsatznummer: game.selectedIncident.id,
        datum: new Date(game.selectedIncident.timestamp).toLocaleString('de-DE'),
        stichwort: game.selectedIncident.keyword,
        ort: game.selectedIncident.location,
        melder: game.selectedIncident.caller,
        meldung: game.selectedIncident.description,
        patient: {
            alter: game.selectedIncident.patientAge,
            geschlecht: game.selectedIncident.patientGender
        },
        lage: game.selectedIncident.onSceneSituation,
        massnahmen: game.selectedIncident.measures,
        bemerkungen: game.selectedIncident.notes,
        fahrzeuge: (game.selectedIncident.assignedVehicles || []).map(vId => {
            const v = game.vehicles.find(vehicle => vehicle.id === vId);
            return v ? v.callsign : vId;
        })
    };
    
    const blob = new Blob([JSON.stringify(protocol, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Einsatzprotokoll_${game.selectedIncident.id}.json`;
    a.click();
}

function updateIncidentList() {
    const list = document.getElementById('incident-list');
    if (!list) return;
    
    // Zeige nur Einsätze die NICHT mehr "incoming" oder "in-call" sind
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
                <small>${incident.description || 'Details noch unklar'}</small><br>
                <small style="color: #a0a0a0;">${incident.location || 'Adresse wird ermittelt'}</small>
            </div>
        `;
    }).join('');
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
                <strong>${v.callsign}</strong><br>
                <small>${v.type} - ${STATIONS[v.station].name}</small><br>
                <span style="color: ${statusColor}; font-size: 0.9em;">● ${statusText}</span>
            </div>
        `;
    }).join('');
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

function playSound(type) {
    if (!CONFIG.SOUND_ENABLED) return;
    // Placeholder für Sound-System
    console.log(`Sound: ${type}`);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initializeVehicles();
    game = new Game();
    initMap();
    
    setInterval(() => {
        if (game) {
            game.update();
            updateIncidentList();
            updateVehicleList();
            updateMap();
        }
    }, 2000);
});