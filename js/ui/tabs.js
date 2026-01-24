// =========================
// TAB NAVIGATION & VEHICLE OVERVIEW v5.0
// ✅ Phase 4: Kompakte UI mit Shortcuts
// ✅ Keyboard Shortcuts für Navigation
// ✅ Quick Filter für Fahrzeuge
// ✅ Kompakte Card-Darstellung
// =========================

let currentTab = 'map';
let collapsedStations = new Set();
let vehicleFilter = 'all'; // 'all', 'available', 'inuse'

// ✅ KEYBOARD SHORTCUTS
document.addEventListener('keydown', (e) => {
    // Nur wenn kein Input-Feld fokussiert ist
    if (document.activeElement.tagName === 'INPUT' || 
        document.activeElement.tagName === 'TEXTAREA') {
        return;
    }
    
    // Tab-Shortcuts (1-5)
    const tabMap = {
        '1': 'map',
        '2': 'vehicles',
        '3': 'incidents',
        '4': 'radio',
        '5': 'stats'
    };
    
    if (tabMap[e.key]) {
        e.preventDefault();
        switchTab(tabMap[e.key]);
        return;
    }
    
    // Filter-Shortcuts (nur im Fahrzeuge-Tab)
    if (currentTab === 'vehicles') {
        if (e.key === 'f' || e.key === 'F') {
            e.preventDefault();
            cycleFilter();
        } else if (e.key === 'c' || e.key === 'C') {
            e.preventDefault();
            toggleAllStations();
        }
    }
});

// ✅ Filter durchschalten
function cycleFilter() {
    const filters = ['all', 'available', 'inuse'];
    const currentIndex = filters.indexOf(vehicleFilter);
    vehicleFilter = filters[(currentIndex + 1) % filters.length];
    updateVehiclesOverview();
}

// ✅ Alle Wachen auf-/zuklappen
function toggleAllStations() {
    if (collapsedStations.size > 0) {
        // Alle öffnen
        collapsedStations.clear();
    } else {
        // Alle schließen
        if (game && game.vehicles) {
            const stationIds = new Set(game.vehicles.filter(v => v.owned).map(v => v.station));
            collapsedStations = new Set(stationIds);
        }
    }
    updateVehiclesOverview();
}

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
        if (typeof updateRadioVehicleDropdown === 'function') {
            updateRadioVehicleDropdown();
        }
    }
}

// ✅ FIX: Hole FMS Status (nutzt CONFIG.FMS_STATUS)
function getFMSStatus(vehicle) {
    const fmsCode = vehicle.currentStatus || vehicle.status || 2;
    
    // Hole FMS-Definition aus CONFIG
    if (typeof CONFIG !== 'undefined' && CONFIG.FMS_STATUS && CONFIG.FMS_STATUS[fmsCode]) {
        return CONFIG.FMS_STATUS[fmsCode];
    }
    
    // Fallback wenn CONFIG nicht verfügbar
    const fallbackStatus = {
        1: { name: 'Einsatzbereit über Funk', color: '#28a745', icon: '🟢' },
        2: { name: 'Einsatzbereit auf Wache', color: '#28a745', icon: '🟢' },
        3: { name: 'Einsatz übernommen', color: '#ffc107', icon: '🟡' },
        4: { name: 'Anfahrt Einsatzstelle', color: '#fd7e14', icon: '🟠' },
        5: { name: 'Ankunft Einsatzstelle', color: '#dc3545', icon: '🔴' },
        6: { name: 'Sprechwunsch', color: '#6c757d', icon: '⚪' },
        7: { name: 'Patient aufgenommen', color: '#17a2b8', icon: '🔵' },
        8: { name: 'Anfahrt Krankenhaus', color: '#007bff', icon: '🔵' },
        9: { name: 'Ankunft Krankenhaus', color: '#6f42c1', icon: '🟣' },
        0: { name: 'Notruf/Hilferuf', color: '#dc3545', icon: '⚠️' },
        'C': { name: 'Status C', color: '#dc3545', icon: '🛑' }
    };
    
    return fallbackStatus[fmsCode] || {
        name: 'Unbekannt',
        color: '#6c757d',
        icon: '❓'
    };
}

// ✅ KOMPAKTE FAHRZEUG-ÜBERSICHT
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
    
    // ✅ Filter anwenden
    let filteredVehicles = ownedVehicles;
    if (vehicleFilter === 'available') {
        filteredVehicles = ownedVehicles.filter(v => {
            const status = v.currentStatus || v.status || 2;
            return status === 1 || status === 2;
        });
    } else if (vehicleFilter === 'inuse') {
        filteredVehicles = ownedVehicles.filter(v => {
            const status = v.currentStatus || v.status || 2;
            return status !== 1 && status !== 2;
        });
    }
    
    // Gruppiere Fahrzeuge nach Wachen
    const stationGroups = {};
    
    filteredVehicles.forEach(vehicle => {
        const stationId = vehicle.station;
        if (!stationGroups[stationId]) {
            stationGroups[stationId] = [];
        }
        stationGroups[stationId].push(vehicle);
    });
    
    // Sortiere Wachen
    const sortedStations = Object.keys(stationGroups).sort((a, b) => {
        const stationA = STATIONS[a];
        const stationB = STATIONS[b];
        
        if (!stationA || !stationB) return 0;
        
        const isOvA = stationA.category === 'ortsverein';
        const isOvB = stationB.category === 'ortsverein';
        
        if (isOvA !== isOvB) {
            return isOvA ? 1 : -1;
        }
        
        return stationA.name.localeCompare(stationB.name);
    });
    
    // Zähle verfügbare Fahrzeuge
    const totalVehicles = ownedVehicles.length;
    const availableVehicles = ownedVehicles.filter(v => {
        const status = v.currentStatus || v.status || 2;
        return status === 2 || status === 1;
    }).length;
    
    // ✅ KOMPAKTER HEADER mit Filter-Buttons
    let html = `
        <div class="vehicles-header-compact">
            <div class="header-row">
                <h2>🚑 Fahrzeuge</h2>
                <div class="quick-stats">
                    <span class="stat" style="color: #28a745;">🟢 ${availableVehicles}</span>
                    <span class="stat" style="color: #dc3545;">🔴 ${totalVehicles - availableVehicles}</span>
                    <span class="stat" style="color: #6c757d;">📦 ${totalVehicles}</span>
                </div>
            </div>
            <div class="filter-row">
                <div class="filter-buttons">
                    <button class="filter-btn ${vehicleFilter === 'all' ? 'active' : ''}" onclick="setVehicleFilter('all')">
                        <i class="fas fa-list"></i> Alle
                    </button>
                    <button class="filter-btn ${vehicleFilter === 'available' ? 'active' : ''}" onclick="setVehicleFilter('available')">
                        <i class="fas fa-check-circle"></i> Verfügbar
                    </button>
                    <button class="filter-btn ${vehicleFilter === 'inuse' ? 'active' : ''}" onclick="setVehicleFilter('inuse')">
                        <i class="fas fa-clock"></i> Im Einsatz
                    </button>
                </div>
                <div class="action-buttons">
                    <button class="action-btn" onclick="toggleAllStations()" title="Alle auf-/zuklappen (C)">
                        <i class="fas fa-${collapsedStations.size > 0 ? 'expand' : 'compress'}-alt"></i>
                    </button>
                </div>
            </div>
            <div class="shortcuts-hint">
                <i class="fas fa-keyboard"></i> 
                <span>Shortcuts: <kbd>1-5</kbd> Tabs | <kbd>F</kbd> Filter | <kbd>C</kbd> Auf/Zu</span>
            </div>
        </div>
    `;
    
    // Erstelle Wachen-Gruppen
    html += '<div class="stations-container-compact">';
    
    sortedStations.forEach(stationId => {
        const station = STATIONS[stationId];
        if (!station) return;
        
        const vehicles = stationGroups[stationId];
        const isCollapsed = collapsedStations.has(stationId);
        
        // Kompaktes Station Icon
        let stationIcon = '🏥';
        if (station.category === 'ortsverein') {
            stationIcon = '🔴';
        } else if (station.category === 'notarztwache') {
            stationIcon = '⚠️';
        }
        
        // Zähle verfügbare Fahrzeuge dieser Wache
        const stationAvailable = vehicles.filter(v => {
            const status = v.currentStatus || v.status || 2;
            return status === 2 || status === 1;
        }).length;
        const availabilityColor = stationAvailable === vehicles.length ? '#28a745' : 
                                  stationAvailable > 0 ? '#ffc107' : '#dc3545';
        
        html += `
            <div class="station-group-compact">
                <div class="station-header-compact" onclick="toggleStation('${stationId}')">
                    <span class="station-icon-compact">${stationIcon}</span>
                    <span class="station-name-compact">${station.name}</span>
                    <span class="station-count" style="color: ${availabilityColor};">
                        ${stationAvailable}/${vehicles.length}
                    </span>
                    <i class="fas fa-chevron-down collapse-icon-compact ${isCollapsed ? '' : 'open'}" id="icon-${stationId}"></i>
                </div>
                <div class="station-vehicles-compact ${isCollapsed ? '' : 'open'}" id="station-${stationId}">
                    ${vehicles.map(v => createCompactVehicleCard(v)).join('')}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    container.innerHTML = html;
}

// ✅ KOMPAKTE FAHRZEUG-KARTE (40% weniger Höhe!)
function createCompactVehicleCard(vehicle) {
    const fms = getFMSStatus(vehicle);
    const fmsNumber = getFMSStatusNumber(vehicle);
    
    const statusDisplay = typeof fmsNumber === 'number' ? fmsNumber : fmsNumber;
    
    const isAvailable = (vehicle.currentStatus === 1 || vehicle.currentStatus === 2 || 
                         vehicle.status === 1 || vehicle.status === 2);
    
    // Kompaktes Icon
    const icon = getVehicleIconCompact(vehicle.type);
    
    return `
        <div class="vehicle-card-compact" style="border-left: 3px solid ${fms.color};">
            <div class="vehicle-info-compact">
                <span class="vehicle-icon-compact">${icon}</span>
                <div class="vehicle-text">
                    <span class="vehicle-callsign">${vehicle.callsign}</span>
                    <span class="vehicle-status-text" style="color: ${fms.color};">
                        Status ${statusDisplay}
                    </span>
                </div>
            </div>
            <div class="vehicle-actions-compact">
                ${isAvailable ? `
                    <button class="btn-icon-compact btn-primary" onclick="selectVehicleForIncident('${vehicle.id}')" title="Alarmieren">
                        <i class="fas fa-bell"></i>
                    </button>
                ` : `
                    <button class="btn-icon-compact" disabled style="opacity: 0.3;" title="Im Einsatz">
                        <i class="fas fa-clock"></i>
                    </button>
                `}
            </div>
        </div>
    `;
}

function setVehicleFilter(filter) {
    vehicleFilter = filter;
    updateVehiclesOverview();
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

function getFMSStatusNumber(vehicle) {
    const status = vehicle.currentStatus || vehicle.status || 2;
    
    const statusMap = {
        1: 1, 2: 2, 3: 3, 4: 4, 5: 5,
        6: 6, 7: 7, 8: 8, 9: 9,
        0: '0', 'C': 'C'
    };
    
    return statusMap[status] !== undefined ? statusMap[status] : status;
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
    } else if (currentTab === 'radio') {
        syncRadioFeed();
        if (typeof updateRadioVehicleDropdown === 'function') {
            updateRadioVehicleDropdown();
        }
    }
}, 3000);

console.log('✅ Tabs v5.0 geladen - Kompakte UI mit Shortcuts');

// Helper functions
function getVehicleIcon(type) {
    const icons = {
        'RTW': '🚑',
        'NEF': '🚑',
        'KTW': '🚐',
        'Kdow': '🚗',
        'GW-San': '🚚'
    };
    return icons[type] || '🚑';
}

function getVehicleIconCompact(type) {
    const icons = {
        'RTW': '🚑',
        'NEF': '⚕️',
        'KTW': '🚐',
        'Kdow': '🚨',
        'GW-San': '🚚'
    };
    return icons[type] || '🚑';
}

function getIncidentIcon(type) {
    const icons = {
        'medical': '🆘',
        'fire': '🔥',
        'rescue': '🚨',
        'accident': '🚗'
    };
    return icons[type] || '🚨';
}