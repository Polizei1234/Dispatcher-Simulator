// =========================
// KARTENLOGIK MIT PIXEL ART ICONS
// =========================

let map = null;
let stationMarkers = [];
let vehicleMarkers = [];
let stationsVisible = true;

function initMap() {
    if (map) {
        console.log('⚠️ Map already initialized');
        return;
    }
    
    console.log('🗺️ Initialisiere Karte...');
    
    map = L.map('map', {
        center: CONFIG.MAP_CENTER,
        zoom: CONFIG.MAP_ZOOM,
        minZoom: CONFIG.MAP_MIN_ZOOM,
        maxZoom: CONFIG.MAP_MAX_ZOOM
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19
    }).addTo(map);
    
    console.log('✅ Karte erstellt, erstelle Wachen-Marker...');
    createStationMarkers();
    
    console.log(`✅ ${stationMarkers.length} Wachen-Marker erstellt!`);
}

function createStationMarkers() {
    // Lösche alte Marker
    stationMarkers.forEach(m => {
        if (map.hasLayer(m)) {
            map.removeLayer(m);
        }
    });
    stationMarkers = [];
    
    let count = 0;
    Object.values(STATIONS).forEach(station => {
        const pos = station.position;
        
        // Validierung der Koordinaten
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
            
            marker.bindPopup(`
                <strong>${station.name}</strong><br>
                ${station.address}<br>
                <small>${station.category} (${station.type})</small>
            `);
            
            marker.addTo(map);
            stationMarkers.push(marker);
            count++;
        } catch (error) {
            console.error(`❌ Fehler beim Erstellen von Marker ${station.name}:`, error);
        }
    });
    
    console.log(`✅ ${count} von ${Object.keys(STATIONS).length} Wachen erfolgreich erstellt`);
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
            <!-- Schatten -->
            <ellipse cx="20" cy="38" rx="12" ry="3" fill="rgba(0,0,0,0.3)"/>
            
            <!-- Gebäude -->
            <rect x="10" y="18" width="20" height="20" fill="${color.primary}" stroke="#000" stroke-width="1.5"/>
            
            <!-- Dach -->
            <path d="M 8 18 L 20 10 L 32 18 Z" fill="${color.secondary}" stroke="#000" stroke-width="1.5"/>
            
            <!-- DRK Kreuz -->
            <rect x="17" y="24" width="6" height="10" fill="${color.cross}" stroke="#000" stroke-width="1"/>
            <rect x="14" y="27" width="12" height="4" fill="${color.cross}" stroke="#000" stroke-width="1"/>
            
            <!-- Tür -->
            <rect x="16" y="32" width="8" height="6" fill="#654321" stroke="#000" stroke-width="1"/>
            
            <!-- Fenster -->
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
            <!-- Schatten -->
            <ellipse cx="14" cy="26" rx="10" ry="2" fill="rgba(0,0,0,0.3)"/>
            
            <!-- Fahrzeugkörper -->
            <rect x="6" y="12" width="16" height="10" fill="${color}" stroke="#000" stroke-width="1.5" rx="1"/>
            
            <!-- Fahrerhaus -->
            <rect x="16" y="8" width="6" height="6" fill="${color}" stroke="#000" stroke-width="1.5" rx="1"/>
            
            <!-- Windschutzscheibe -->
            <rect x="17" y="9" width="4" height="3" fill="#87ceeb" stroke="#000" stroke-width="0.5"/>
            
            <!-- Seitenfenster -->
            <rect x="8" y="14" width="4" height="3" fill="#87ceeb" stroke="#000" stroke-width="0.5"/>
            
            <!-- Räder -->
            <circle cx="10" cy="22" r="2.5" fill="#000" stroke="#333" stroke-width="1"/>
            <circle cx="18" cy="22" r="2.5" fill="#000" stroke="#333" stroke-width="1"/>
            <circle cx="10" cy="22" r="1" fill="#666"/>
            <circle cx="18" cy="22" r="1" fill="#666"/>
            
            <!-- Blaulicht -->
            <rect x="11" y="6" width="3" height="2" fill="#0000ff" stroke="#000" stroke-width="0.5" rx="0.5">
                <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite"/>
            </rect>
            
            <!-- DRK Logo -->
            <rect x="13" y="15" width="2" height="4" fill="#fff"/>
            <rect x="12" y="16" width="4" height="2" fill="#fff"/>
        </svg>
    `;
}

function updateMap() {
    if (!map || !game) return;
    
    // Lösche alte Fahrzeugmarker
    vehicleMarkers.forEach(m => {
        if (map.hasLayer(m)) {
            map.removeLayer(m);
        }
    });
    vehicleMarkers = [];
    
    // Erstelle neue Fahrzeugmarker NUR für unterwegs/im Einsatz
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
            
            const statusText = {
                'available': 'Verfügbar',
                'dispatched': 'Unterwegs',
                'on-scene': 'Vor Ort'
            };
            
            marker.bindPopup(`
                <strong>${vehicle.name}</strong><br>
                Status: ${statusText[vehicle.status] || vehicle.status}<br>
                <small>${vehicle.type}</small>
            `);
            
            marker.addTo(map);
            vehicleMarkers.push(marker);
        } catch (error) {
            console.error(`❌ Fehler beim Erstellen von Fahrzeugmarker ${vehicle.name}:`, error);
        }
    });
}

function centerMap() {
    if (map) {
        map.setView(CONFIG.MAP_CENTER, CONFIG.MAP_ZOOM);
        console.log('📍 Karte zentriert auf Waiblingen');
    }
}