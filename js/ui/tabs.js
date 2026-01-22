// =========================
// TAB NAVIGATION & VEHICLE OVERVIEW
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

// Schnellnavigation zu Kategorie
function scrollToCategory(categoryKey) {
    const element = document.getElementById(`category-${categoryKey}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Fahrzeuge-Übersicht aktualisieren
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
    
    // Gruppiere Fahrzeuge nach Kategorie
    const categories = {
        'rettungsdienst': { name: 'Rettungsdienst', icon: '🚑', vehicles: [], color: '#dc3545' },
        'katastrophenschutz': { name: 'Katastrophenschutz', icon: '🚒', vehicles: [], color: '#ffc107' },
        'krankentransport': { name: 'Krankentransport', icon: '🚑', vehicles: [], color: '#28a745' }
    };
    
    ownedVehicles.forEach(vehicle => {
        // Prüfe ZUERST ob Fahrzeug zu einem Ortsverein gehört
        const station = STATIONS[vehicle.station];
        const isOrtsverein = station && station.category === 'ortsverein';
        
        // Kategorisiere Fahrzeug
        let category = 'rettungsdienst';
        
        // WICHTIG: Ortsverein-Check VOR Fahrzeugtyp-Check!
        if (isOrtsverein || vehicle.type === 'GW-San') {
            // Alle Ortsvereine UND GW-San gehören zum Katastrophenschutz
            category = 'katastrophenschutz';
        } else if (vehicle.type === 'KTW') {
            // Nur KTW von NICHT-Ortsvereinen sind Krankentransport
            category = 'krankentransport';
        }
        
        categories[category].vehicles.push(vehicle);
    });
    
    // Erstelle Schnellnavigation
    let quickNavHtml = '<div class="quick-nav">';
    Object.entries(categories).forEach(([catKey, catData]) => {
        if (catData.vehicles.length > 0) {
            quickNavHtml += `
                <button class="quick-nav-btn" onclick="scrollToCategory('${catKey}')">
                    <span>${catData.icon}</span>
                    <span>${catData.name}</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 10px;">${catData.vehicles.length}</span>
                </button>
            `;
        }
    });
    quickNavHtml += '</div>';
    
    // Erstelle Kategorien
    let categoriesHtml = '';
    
    Object.entries(categories).forEach(([catKey, catData]) => {
        if (catData.vehicles.length === 0) return;
        
        // Gruppiere nach Wachen
        const stationGroups = {};
        catData.vehicles.forEach(v => {
            if (!stationGroups[v.station]) {
                stationGroups[v.station] = [];
            }
            stationGroups[v.station].push(v);
        });
        
        categoriesHtml += `
            <div class="vehicle-category" id="category-${catKey}">
                <div class="category-header">
                    <h2>
                        <span>${catData.icon}</span>
                        ${catData.name}
                    </h2>
                    <span class="category-badge">${catData.vehicles.length} Fahrzeuge</span>
                </div>
                <div class="stations-grid">
                    ${Object.entries(stationGroups).map(([stationId, vehicles]) => {
                        const station = STATIONS[stationId];
                        if (!station) return '';
                        
                        const isCollapsed = collapsedStations.has(stationId);
                        
                        // Icon basierend auf Kategorie
                        let stationIcon = '🏥';
                        if (station.category === 'ortsverein') {
                            stationIcon = '🔴'; // Roter Kreis für OV
                        } else if (station.category === 'notarztwache') {
                            stationIcon = '⚠️'; // Warnung für NEF-Wache
                        }
                        
                        return `
                            <div class="station-group">
                                <div class="station-header" onclick="toggleStation('${stationId}')">
                                    <h3>
                                        ${stationIcon}
                                        ${station.name}
                                    </h3>
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <span class="station-badge">${vehicles.length} Fzg</span>
                                        <i class="fas fa-chevron-down collapse-icon ${isCollapsed ? '' : 'open'}" id="icon-${stationId}"></i>
                                    </div>
                                </div>
                                <div class="station-vehicles ${isCollapsed ? '' : 'open'}" id="station-${stationId}">
                                    ${vehicles.map(v => createVehicleCard(v)).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = quickNavHtml + categoriesHtml;
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

// Auto-Update wenn Tab aktiv
setInterval(() => {
    if (currentTab === 'vehicles') {
        updateVehiclesOverview();
    } else if (currentTab === 'incidents') {
        updateIncidentsOverview();
    } else if (tabName === 'radio') {
        syncRadioFeed();
    }
}, 3000);