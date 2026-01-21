// =========================
// KARTENLOGIK MIT PIXEL ART ICONS
// =========================

let map = null;
let stationMarkers = [];
let vehicleMarkers = [];
let stationsVisible = true;
let stationsInitialized = false;

function initMap() {
    if (map) {
        console.log('⚠️ Map already initialized');
        return;
    }
    
    console.log('🗺️ Initialisiere Karte...');
    
    // WICHTIG: Nutze CONFIG.MAP statt CONFIG.MAP_CENTER
    const mapCenter = CONFIG.MAP?.center || [48.8309415, 9.3256194];
    const mapZoom = CONFIG.MAP?.zoom || 11;
    
    console.log('📍 Map Center:', mapCenter, 'Zoom:', mapZoom);
    
    map = L.map('map', {
        center: mapCenter,
        zoom: mapZoom,
        minZoom: 9,
        maxZoom: 18,
        closePopupOnClick: true
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19
    }).addTo(map);
    
    console.log('✅ Karte erstellt, erstelle Wachen-Marker...');
    createStationMarkers();
    stationsInitialized = true;
    
    console.log(`✅ ${stationMarkers.length} Wachen-Marker erstellt!`);
}

function getFMSStatus(vehicle) {
    // Prüfe zuerst ob vehicle.currentStatus existiert (neues System)
    if (vehicle.currentStatus && CONFIG.FMS_STATUS && CONFIG.FMS_STATUS[vehicle.currentStatus]) {
        return CONFIG.FMS_STATUS[vehicle.currentStatus];
    }
    
    // Fallback: Mappe Fahrzeugstatus auf FMS-Status
    const statusMap = {
        'available': 2,
        'dispatched': 3,
        'on-scene': 4,
        'transporting': 7,
        'at-hospital': 8,
        'returning': 1,
        'unavailable': 6
    };
    
    const fmsCode = statusMap[vehicle.status] || 2;
    
    // Double-Check: Gibt es CONFIG.FMS_STATUS?
    if (!CONFIG.FMS_STATUS || !CONFIG.FMS_STATUS[fmsCode]) {
        console.warn(`⚠️ FMS_STATUS nicht gefunden für Code ${fmsCode}, verwende Fallback`);
        return {
            name: vehicle.status || 'Unbekannt',
            color: '#6c757d',
            icon: '🚑'
        };
    }
    
    return CONFIG.FMS_STATUS[fmsCode];
}

function getFMSStatusNumber(vehicle) {
    if (vehicle.currentStatus) {
        return vehicle.currentStatus;
    }
    
    const statusMap = {
        'available': 2,
        'dispatched': 3,
        'on-scene': 4,
        'transporting': 7,
        'at-hospital': 8,
        'returning': 1,
        'unavailable': 6
    };
    return statusMap[vehicle.status] || 2;
}

function createStationMarkers() {
    if (stationsInitialized) {
        console.log('⚡ Wachen-Marker bereits erstellt, überspringe');
        return;
    }
    
    stationMarkers.forEach(m => {
        if (map.hasLayer(m)) {
            map.removeLayer(m);
        }
    });
    stationMarkers = [];
    
    let count = 0;
    Object.values(STATIONS).forEach(station => {
        const pos = station.position;
        
        if (!pos || pos.length !== 2 || isNaN(pos[0]) || isNaN(pos[1])) {
            console.error(`❌ Ungültige Position für ${station.name}:`, pos);
            return;
        }
        
        console.log(`📍 Erstelle Marker für ${station.name} bei [${pos[0]}, ${pos[1]}]`);
        
        const iconHtml = createStationPixelIcon(station.category);
        
        try {
            const marker = L.marker([pos[0], pos[1]], {
                icon: L.divIcon({
                    html: iconHtml,
                    className: 'station-marker',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                })
            });
            
            marker.on('click', function() {
                const popupContent = generateStationPopupContent(station);
                marker.bindPopup(popupContent, {
                    maxWidth: 350,
                    className: 'station-popup',
                    autoClose: false,
                    closeOnClick: false
                }).openPopup();
            });
            
            marker.addTo(map);
            stationMarkers.push(marker);
            count++;
        } catch (error) {
            console.error(`❌ Fehler beim Erstellen von Marker ${station.name}:`, error);
        }
    });
    
    console.log(`✅ ${count} von ${Object.keys(STATIONS).length} Wachen erfolgreich erstellt`);
}

function generateStationPopupContent(station) {
    const stationVehicles = VEHICLES.filter(v => v.station === station.id && v.owned);
    
    const categoryText = {
        'rettungswache': 'Rettungswache',
        'notarztwache': 'Notarztwache',
        'ortsverein': 'Ortsverein'
    }[station.category] || station.category;
    
    const typeText = {
        'hauptamt': 'Hauptamt',
        'ehrenamt': 'Ehrenamt'
    }[station.type] || station.type;
    
    let vehicleListHtml = '';
    if (stationVehicles.length > 0) {
        vehicleListHtml = `
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #555;">
                <strong>🚑 Fahrzeuge (${stationVehicles.length}):</strong><br>
                <div style="margin-top: 5px;">
                    ${stationVehicles.map(v => {
                        const fms = getFMSStatus(v);
                        const fmsNumber = getFMSStatusNumber(v);
                        return `
                            <div style="display: flex; align-items: center; margin: 3px 0; padding: 4px; background: rgba(0,0,0,0.2); border-radius: 4px; border-left: 3px solid ${fms.color};">
                                <span style="font-size: 0.9em; margin-right: 5px;">${fms.icon}</span>
                                <div style="flex: 1;">
                                    <div style="font-size: 0.85em; font-weight: bold;">${v.callsign}</div>
                                    <div style="font-size: 0.75em; color: ${fms.color};">
                                        <strong>Status ${fmsNumber}</strong> | ${fms.name}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    } else {
        vehicleListHtml = `
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #555;">
                <small style="color: #888;">Keine Fahrzeuge stationiert</small>
            </div>
        `;
    }
    
    return `
        <div style="min-width: 250px;">
            <strong style="font-size: 1.1em;">${station.name}</strong><br>
            <small style="color: #a0a0a0;">${station.address}</small><br>
            <div style="margin-top: 5px;">
                <span style="background: #2d3748; padding: 2px 6px; border-radius: 4px; font-size: 0.85em;">
                    ${categoryText}
                </span>
                <span style="background: #2d3748; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; margin-left: 5px;">
                    ${typeText}
                </span>
            </div>
            ${vehicleListHtml}
        </div>
    `;
}

function toggleStations() {
    stationsVisible = !stationsVisible;
    
    stationMarkers.forEach(marker => {
        if (stationsVisible) {
            if (!map.hasLayer(marker)) {
                map.addLayer(marker);
            }
        } else {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        }
    });
    
    console.log(`🏥 Wachen ${stationsVisible ? 'eingeblendet' : 'ausgeblendet'}`);
}

function createStationPixelIcon(category) {
    const colors = {
        'rettungswache': { primary: '#dc3545', secondary: '#a02830', cross: '#ffffff' },
        'notarztwache': { primary: '#ffc107', secondary: '#d4a006', cross: '#000000' },
        'ortsverein': { primary: '#ff6b6b', secondary: '#d45555', cross: '#ffffff' }
    };
    
    const color = colors[category] || colors['rettungswache'];
    
    return `
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="20" cy="38" rx="12" ry="3" fill="rgba(0,0,0,0.3)"/>
            <rect x="10" y="18" width="20" height="20" fill="${color.primary}" stroke="#000" stroke-width="1.5"/>
            <path d="M 8 18 L 20 10 L 32 18 Z" fill="${color.secondary}" stroke="#000" stroke-width="1.5"/>
            <rect x="17" y="24" width="6" height="10" fill="${color.cross}" stroke="#000" stroke-width="1"/>
            <rect x="14" y="27" width="12" height="4" fill="${color.cross}" stroke="#000" stroke-width="1"/>
            <rect x="16" y="32" width="8" height="6" fill="#654321" stroke="#000" stroke-width="1"/>
            <rect x="12" y="13" width="3" height="3" fill="#87ceeb" stroke="#000" stroke-width="0.5"/>
            <rect x="25" y="13" width="3" height="3" fill="#87ceeb" stroke="#000" stroke-width="0.5"/>
        </svg>
    `;
}

function createVehiclePixelIcon(type) {
    const colors = {
        'RTW': '#dc3545',
        'NEF': '#ffc107',
        'KTW': '#28a745',
        'Kdow': '#17a2b8',
        'GW-San': '#6c757d'
    };
    
    const color = colors[type] || '#007bff';
    
    return `
        <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="14" cy="26" rx="10" ry="2" fill="rgba(0,0,0,0.3)"/>
            <rect x="6" y="12" width="16" height="10" fill="${color}" stroke="#000" stroke-width="1.5" rx="1"/>
            <rect x="16" y="8" width="6" height="6" fill="${color}" stroke="#000" stroke-width="1.5" rx="1"/>
            <rect x="17" y="9" width="4" height="3" fill="#87ceeb" stroke="#000" stroke-width="0.5"/>
            <rect x="8" y="14" width="4" height="3" fill="#87ceeb" stroke="#000" stroke-width="0.5"/>
            <circle cx="10" cy="22" r="2.5" fill="#000" stroke="#333" stroke-width="1"/>
            <circle cx="18" cy="22" r="2.5" fill="#000" stroke="#333" stroke-width="1"/>
            <circle cx="10" cy="22" r="1" fill="#666"/>
            <circle cx="18" cy="22" r="1" fill="#666"/>
            <rect x="11" y="6" width="3" height="2" fill="#0000ff" stroke="#000" stroke-width="0.5" rx="0.5">
                <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite"/>
            </rect>
            <rect x="13" y="15" width="2" height="4" fill="#fff"/>
            <rect x="12" y="16" width="4" height="2" fill="#fff"/>
        </svg>
    `;
}

function updateMap() {
    if (!map || !game) return;
    
    vehicleMarkers.forEach(m => {
        if (map.hasLayer(m)) {
            map.removeLayer(m);
        }
    });
    vehicleMarkers = [];
    
    const activeVehicles = game.vehicles.filter(v => 
        v.owned && (v.status === 'dispatched' || v.status === 'on-scene')
    );
    
    activeVehicles.forEach(vehicle => {
        const pos = vehicle.position;
        
        if (!pos || pos.length !== 2 || isNaN(pos[0]) || isNaN(pos[1])) {
            console.warn(`⚠️ Ungültige Fahrzeugposition für ${vehicle.name}:`, pos);
            return;
        }
        
        const iconHtml = createVehiclePixelIcon(vehicle.type);
        
        try {
            const marker = L.marker([pos[0], pos[1]], {
                icon: L.divIcon({
                    html: iconHtml,
                    className: 'vehicle-marker',
                    iconSize: [28, 28],
                    iconAnchor: [14, 28]
                }),
                zIndexOffset: 1000
            });
            
            const fms = getFMSStatus(vehicle);
            const fmsNumber = getFMSStatusNumber(vehicle);
            
            marker.bindPopup(`
                <div style="min-width: 200px;">
                    <strong>${vehicle.name}</strong><br>
                    <div style="margin-top: 5px; padding: 5px; background: rgba(0,0,0,0.2); border-left: 3px solid ${fms.color}; border-radius: 4px;">
                        <span style="font-size: 1.2em;">${fms.icon}</span>
                        <strong style="color: ${fms.color}; margin-left: 5px;">Status ${fmsNumber}</strong>
                        <span style="color: ${fms.color};"> | ${fms.name}</span>
                    </div>
                    <small style="color: #a0a0a0; display: block; margin-top: 5px;">${vehicle.type}</small>
                </div>
            `, {
                autoClose: false,
                closeOnClick: false
            });
            
            marker.addTo(map);
            vehicleMarkers.push(marker);
        } catch (error) {
            console.error(`❌ Fehler beim Erstellen von Fahrzeugmarker ${vehicle.name}:`, error);
        }
    });
}

function updateVehicleMarkers() {
    updateMap();
}

function centerMap() {
    if (map) {
        const mapCenter = CONFIG.MAP?.center || [48.8309415, 9.3256194];
        const mapZoom = CONFIG.MAP?.zoom || 11;
        map.setView(mapCenter, mapZoom);
        console.log('📍 Karte zentriert auf Waiblingen');
    }
}

function addIncidentMarker(incident) {
    if (!map || !incident || !incident.position) return;
    
    console.log(`🚨 Erstelle Einsatz-Marker für ${incident.keyword} an ${incident.location}`);
    
    const marker = L.marker(incident.position, {
        icon: L.divIcon({
            html: '🚨',
            className: 'incident-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        zIndexOffset: 2000
    });
    
    marker.bindPopup(`
        <div style="min-width: 200px;">
            <strong style="color: #dc3545;">🚨 ${incident.keyword}</strong><br>
            <div style="font-size: 0.9em; margin-top: 5px;">${incident.title}</div>
            <div style="margin-top: 5px; color: #a0a0a0;">📍 ${incident.location}</div>
            <div style="margin-top: 5px;">
                <button class="btn btn-small btn-primary" onclick="selectIncident('${incident.id}')" style="font-size: 0.8em; padding: 4px 8px;">
                    Details anzeigen
                </button>
            </div>
        </div>
    `, {
        autoClose: false,
        closeOnClick: false
    });
    
    marker.addTo(map);
    marker.openPopup();
}