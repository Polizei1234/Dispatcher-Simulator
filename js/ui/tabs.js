// =========================
// TAB NAVIGATION & VEHICLE OVERVIEW v4.0
// ✅ Phase 3 Fix 1: Fahrzeuge nach Wachen gruppiert
// =========================

let currentTab = 'map';
let collapsedStations = new Set();

// Tab wechseln
function switchTab(tabName) {
    console.log(`🔄 Wechsle zu Tab: ${tabName}`);
    
    // Deaktiviere alle Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Aktiviere gewählten Tab
    const tabBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
        btn.getAttribute('onclick').includes(tabName)
    );
    if (tabBtn) tabBtn.classList.add('active');
    
    const tabContent = document.getElementById(`tab-${tabName}`);
    if (tabContent) tabContent.classList.add('active');
    
    currentTab = tabName;
    
    // Spezielle Aktionen für verschiedene Tabs
    if (tabName === 'map' && map) {
        setTimeout(() => map.invalidateSize(), 100);
    } else if (tabName === 'vehicles') {
        updateVehiclesOverview();
    } else if (tabName === 'incidents') {
        updateIncidentsOverview();
    } else if (tabName === 'radio') {
        syncRadioFeed();
    }
}

// ✅ PHASE 3 FIX 1: Fahrzeuge direkt nach Wachen gruppiert
function updateVehiclesOverview() {
    if (!game) return;
    
    const container = document.getElementById('vehicles-overview');
    if (!container) return;
    
    const ownedVehicles = game.vehicles.filter(v => v.owned);
    
    if (ownedVehicles.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #a0aec0;">
                <i class="fas fa-ambulance" style="font-size: 4em; margin-bottom: 20px; opacity: 0.3;"></i>
                <h2>Keine Fahrzeuge verfügbar</h2>
                <p>Kaufe Fahrzeuge im Shop, um loszulegen!</p>
            </div>
        `;
        return;
    }
    
    // ✅ NEU: Gruppiere Fahrzeuge direkt nach Wachen
    const stationGroups = {};
    
    ownedVehicles.forEach(vehicle => {
        const stationId = vehicle.station;
        if (!stationGroups[stationId]) {
            stationGroups[stationId] = [];
        }
        stationGroups[stationId].push(vehicle);
    });
    
    // Sortiere Wachen: Hauptamtliche zuerst, dann Ortsvereine
    const sortedStations = Object.keys(stationGroups).sort((a, b) => {
        const stationA = STATIONS[a];
        const stationB = STATIONS[b];
        
        if (!stationA || !stationB) return 0;
        
        // Hauptamtliche Wachen zuerst
        const isOvA = stationA.category === 'ortsverein';
        const isOvB = stationB.category === 'ortsverein';
        
        if (isOvA !== isOvB) {
            return isOvA ? 1 : -1; // Hauptamtliche (false) vor Ortsvereinen (true)
        }
        
        // Innerhalb Kategorie alphabetisch
        return stationA.name.localeCompare(stationB.name);
    });
    
    // Zähle verfügbare Fahrzeuge
    const totalVehicles = ownedVehicles.length;
    const availableVehicles = ownedVehicles.filter(v => v.status === 'available').length;
    
    // Header mit Statistik
    let html = `
        <div class="vehicles-header">
            <h2>🚑 Alle Fahrzeuge</h2>
            <div class="vehicles-stats">
                <div class="stat-item">
                    <span class="stat-value">${totalVehicles}</span>
                    <span class="stat-label">Gesamt</span>
                </div>
                <div class="stat-item" style="color: #28a745;">
                    <span class="stat-value">${availableVehicles}</span>
                    <span class="stat-label">Verfügbar</span>
                </div>
                <div class="stat-item" style="color: #dc3545;">
                    <span class="stat-value">${totalVehicles - availableVehicles}</span>
                    <span class="stat-label">Im Einsatz</span>
                </div>
            </div>
        </div>
    `;
    
    // Erstelle Wachen-Gruppen
    html += '<div class="stations-container">';
    
    sortedStations.forEach(stationId => {
        const station = STATIONS[stationId];
        if (!station) return;
        
        const vehicles = stationGroups[stationId];
        const isCollapsed = collapsedStations.has(stationId);
        
        // Icon basierend auf Kategorie
        let stationIcon = '🏥';
        let categoryBadge = '';
        
        if (station.category === 'ortsverein') {
            stationIcon = '🔴'; // Roter Kreis für OV
            categoryBadge = '<span style="background: #ffc107; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 0.75em; margin-left: 8px;">OV</span>';
        } else if (station.category === 'notarztwache') {
            stationIcon = '⚠️'; // Warnung für NEF-Wache
            categoryBadge = '<span style="background: #dc3545; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.75em; margin-left: 8px;">NEF</span>';
        } else {
            categoryBadge = '<span style="background: #17a2b8; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.75em; margin-left: 8px;">RW</span>';
        }
        
        // Zähle verfügbare Fahrzeuge dieser Wache
        const stationAvailable = vehicles.filter(v => v.status === 'available').length;
        const availabilityColor = stationAvailable === vehicles.length ? '#28a745' : 
                                  stationAvailable > 0 ? '#ffc107' : '#dc3545';
        
        html += `
            <div class="station-group-new">
                <div class="station-header-new" onclick="toggleStation('${stationId}')">
                    <div class="station-info">
                        <span class="station-icon">${stationIcon}</span>
                        <h3 class="station-name">
                            ${station.name}
                            ${categoryBadge}
                        </h3>
                    </div>
                    <div class="station-meta">
                        <span class="vehicle-count" style="color: ${availabilityColor};">
                            <i class="fas fa-ambulance"></i>
                            ${stationAvailable}/${vehicles.length}
                        </span>
                        <i class="fas fa-chevron-down collapse-icon ${isCollapsed ? '' : 'open'}" id="icon-${stationId}"></i>
                    </div>
                </div>
                <div class="station-vehicles-new ${isCollapsed ? '' : 'open'}" id="station-${stationId}">
                    ${vehicles.map(v => createVehicleCard(v)).join('')}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    container.innerHTML = html;
}

// ✅ FIXED: Funktion getFMSStatusNumber hinzugefügt
function getFMSStatusNumber(vehicle) {
    const status = vehicle.currentStatus || 2;
    
    // FMS-Status Nummern: 1-9 sind numerisch, 0 und C sind Buchstaben
    const statusMap = {
        1: 1,    // Einsatzbereit auf Wache
        2: 2,    // Einsatzbereit auf Wache
        3: 3,    // Einsatz übernommen
        4: 4,    // Am Einsatzort
        5: 5,    // Sprechwunsch
        6: 6,    // Nicht einsatzbereit
        7: 7,    // Patient aufgenommen
        8: 8,    // Am Zielort
        9: 9,    // Bereit am Standort
        0: '0',  // Notfall
        'C': 'C' // Status C
    };
    
    return statusMap[status] !== undefined ? statusMap[status] : status;
}

function createVehicleCard(vehicle) {
    const fms = getFMSStatus(vehicle);
    const fmsNumber = getFMSStatusNumber(vehicle);
    
    // Status Badge mit Zahl/Buchstabe
    const statusDisplay = typeof fmsNumber === 'number' ? fmsNumber : fmsNumber;
    
    return `
        <div class="vehicle-card" style="border-left-color: ${fms.color};">
            <div class="vehicle-info">
                <div class="status-badge" style="background: ${fms.color}; color: ${['#ffc107', '#fd7e14', '#28a745', '#1e7e34'].includes(fms.color) ? '#000' : '#fff'};">
                    <strong>${statusDisplay}</strong>
                </div>
                <div class="vehicle-details">
                    <div class="vehicle-name" title="${vehicle.callsign}">${getVehicleIcon(vehicle.type)} ${vehicle.callsign}</div>
                    <div class="vehicle-type" title="${fms.name}">${fms.name}</div>
                </div>
            </div>
            <div class="vehicle-actions">
                ${vehicle.status === 'available' ? `
                    <button class="btn btn-small btn-primary" onclick="selectVehicleForIncident('${vehicle.id}')" title="Alarmieren">
                        <i class="fas fa-bell"></i>
                    </button>
                ` : `
                    <button class="btn btn-small" disabled style="opacity: 0.5;" title="Im Einsatz">
                        <i class="fas fa-clock"></i>
                    </button>
                `}
            </div>
        </div>
    `;
}

function toggleStation(stationId) {
    const vehiclesDiv = document.getElementById(`station-${stationId}`);
    const icon = document.getElementById(`icon-${stationId}`);
    
    if (!vehiclesDiv || !icon) return;
    
    if (collapsedStations.has(stationId)) {
        collapsedStations.delete(stationId);
        vehiclesDiv.classList.add('open');
        icon.classList.add('open');
    } else {
        collapsedStations.add(stationId);
        vehiclesDiv.classList.remove('open');
        icon.classList.remove('open');
    }
}

// Einsätze-Übersicht
function updateIncidentsOverview() {
    if (!game) return;
    
    const container = document.getElementById('incidents-overview');
    if (!container) return;
    
    const activeIncidents = game.incidents.filter(i => i.status !== 'completed');
    
    if (activeIncidents.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #a0aec0;">
                <i class="fas fa-clipboard-list" style="font-size: 4em; margin-bottom: 20px; opacity: 0.3;"></i>
                <h2>Keine aktiven Einsätze</h2>
                <p>Alle ruhig in Waiblingen!</p>
            </div>
        `;
        return;
    }
    
    let html = '<div style="padding: 20px;">';
    activeIncidents.forEach(incident => {
        html += `
            <div class="panel" style="margin-bottom: 20px;">
                <div class="panel-header">
                    <h3>${getIncidentIcon(incident.type)} ${incident.title}</h3>
                </div>
                <div class="panel-content">
                    <p><strong>Ort:</strong> ${incident.location}</p>
                    <p><strong>Zeit:</strong> ${new Date(incident.timestamp).toLocaleTimeString('de-DE')}</p>
                    <p><strong>Status:</strong> ${incident.status}</p>
                    ${incident.assignedVehicles && incident.assignedVehicles.length > 0 ? `
                        <p><strong>Alarmierte Fahrzeuge:</strong></p>
                        <ul>
                            ${incident.assignedVehicles.map(vid => {
                                const v = game.vehicles.find(vehicle => vehicle.id === vid);
                                return v ? `<li>${v.callsign}</li>` : '';
                            }).join('')}
                        </ul>
                    ` : ''}
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

// Funkverkehr synchronisieren
function syncRadioFeed() {
    const mainFeed = document.getElementById('radio-feed');
    const fullFeed = document.getElementById('radio-feed-full');
    
    if (mainFeed && fullFeed) {
        fullFeed.innerHTML = mainFeed.innerHTML;
    }
}

// ✅ FIXED: tabName → currentTab
// Auto-Update wenn Tab aktiv
setInterval(() => {
    if (currentTab === 'vehicles') {
        updateVehiclesOverview();
    } else if (currentTab === 'incidents') {
        updateIncidentsOverview();
    } else if (currentTab === 'radio') {
        syncRadioFeed();
    }
}, 3000);

console.log('✅ Tabs v4.0 geladen - Fahrzeuge nach Wachen gruppiert');