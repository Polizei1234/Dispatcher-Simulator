// =========================
// TAB NAVIGATION & VEHICLE OVERVIEW v6.1 - TAB-FIX
// ✅ Phase 4: Kompakte UI mit Shortcuts
// ✅ Keyboard Shortcuts für Navigation
// ✅ Quick Filter für Fahrzeuge
// ✅ Kompakte Card-Darstellung
// 🗑️ v5.1.0: Radio-Tab komplett entfernt
// ✅✅✅ v6.0: Nutzt VehicleStatusUtil (Single Source of Truth!)
// 🔧 v6.1: FIX - Tab-Switching funktioniert jetzt!
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
    
    // Tab-Shortcuts (1-4) - Radio entfernt
    const tabMap = {
        '1': 'map',
        '2': 'vehicles',
        '3': 'call'
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

// 🔧 v6.1: KOMPLETT ÜBERARBEITET - Tab wechseln
function switchTab(tabName) {
    console.log(`🔄 Wechsle zu Tab: ${tabName}`);
    
    // 1. Deaktiviere alle Tab-Buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 2. Deaktiviere alle Tab-Contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 3. Aktiviere den gewählten Tab-Button
    // Suche nach Button mit onclick="switchTab('tabName')"
    const allButtons = document.querySelectorAll('.tab-btn');
    for (const btn of allButtons) {
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${tabName}'`)) {
            btn.classList.add('active');
            console.log(`✅ Button aktiviert: ${tabName}`);
            break;
        }
    }
    
    // 4. Aktiviere den gewählten Tab-Content
    const tabContent = document.getElementById(`tab-${tabName}`);
    if (tabContent) {
        tabContent.classList.add('active');
        console.log(`✅ Content aktiviert: tab-${tabName}`);
    } else {
        console.error(`❌ Tab-Content nicht gefunden: tab-${tabName}`);
    }
    
    // 5. Update aktuellen Tab
    currentTab = tabName;
    
    // 6. Spezielle Aktionen für verschiedene Tabs
    if (tabName === 'map' && typeof map !== 'undefined') {
        setTimeout(() => {
            if (map.invalidateSize) {
                map.invalidateSize();
                console.log('✅ Map invalidateSize() ausgeführt');
            }
        }, 100);
    } else if (tabName === 'vehicles') {
        updateVehiclesOverview();
    } else if (tabName === 'call') {
        // Call-Tab hat eigene Logik in call-system.js
        console.log('📞 Call-Tab aktiviert');
    }
    
    console.log(`✅ Tab gewechselt zu: ${tabName}`);
}

// ❌ ENTFERNT: Alte getFMSStatus() Funktion
// ✅ Nutze stattdessen: VehicleStatusUtil.getStatus(vehicle)

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
    
    // ✅ Filter anwenden (mit VehicleStatusUtil!)
    let filteredVehicles = ownedVehicles;
    if (vehicleFilter === 'available') {
        filteredVehicles = ownedVehicles.filter(v => VehicleStatusUtil.isAvailable(v));
    } else if (vehicleFilter === 'inuse') {
        filteredVehicles = ownedVehicles.filter(v => VehicleStatusUtil.isOnMission(v));
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
    
    // Zähle verfügbare Fahrzeuge (mit VehicleStatusUtil!)
    const totalVehicles = ownedVehicles.length;
    const availableVehicles = ownedVehicles.filter(v => VehicleStatusUtil.isAvailable(v)).length;
    
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
                <span>Shortcuts: <kbd>1-3</kbd> Tabs | <kbd>F</kbd> Filter | <kbd>C</kbd> Auf/Zu</span>
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
        
        // Zähle verfügbare Fahrzeuge dieser Wache (mit VehicleStatusUtil!)
        const stationAvailable = vehicles.filter(v => VehicleStatusUtil.isAvailable(v)).length;
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
    // ✅✅✅ ZENTRALE STATUS-FUNKTION!
    const fms = VehicleStatusUtil.getStatus(vehicle);
    
    const isAvailable = VehicleStatusUtil.isAvailable(vehicle);
    
    // Kompaktes Icon
    const icon = getVehicleIconCompact(vehicle.type);
    
    return `
        <div class="vehicle-card-compact" style="border-left: 3px solid ${fms.color};">
            <div class="vehicle-info-compact">
                <span class="vehicle-icon-compact">${icon}</span>
                <div class="vehicle-text">
                    <span class="vehicle-callsign">${vehicle.callsign}</span>
                    <span class="vehicle-status-text" style="color: ${fms.color};">
                        Status ${fms.code}
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

// Einsätze-Übersicht (ENTFERNT - nicht mehr benötigt)

// Auto-Update wenn Tab aktiv (Radio entfernt)
setInterval(() => {
    if (currentTab === 'vehicles') {
        updateVehiclesOverview();
    }
}, 3000);

// 🔧 v6.1: Tab-Init Funktion
function initializeTabs() {
    console.log('🔧 Initialisiere Tabs...');
    
    // Setze initialen Tab
    switchTab('map');
    
    console.log('✅ Tabs initialisiert');
}

console.log('✅ Tabs v6.1 geladen - Tab-Switching FIX!');

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
