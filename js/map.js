// =========================
// KARTENLOGIK MIT PIXEL ART ICONS
// =========================

let map = null;
let stationMarkers = [];
let vehicleMarkers = [];
let stationsVisible = true;

function initMap() {
    if (map) return;
    
    map = L.map('map', {
        center: CONFIG.MAP_CENTER,
        zoom: CONFIG.MAP_ZOOM,
        minZoom: CONFIG.MAP_MIN_ZOOM,
        maxZoom: CONFIG.MAP_MAX_ZOOM
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
    createStationMarkers();
}

function createStationMarkers() {
    Object.values(STATIONS).forEach(station => {
        const iconHtml = createStationPixelIcon(station.category);
        
        const marker = L.marker(station.position, {
            icon: L.divIcon({
                html: iconHtml,
                className: 'station-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            })
        }).addTo(map);
        
        marker.bindPopup(`
            <strong>${station.name}</strong><br>
            ${station.address}<br>
            <small>${station.category} (${station.type})</small>
        `);
        
        stationMarkers.push(marker);
    });
}

function toggleStations() {
    stationsVisible = !stationsVisible;
    
    stationMarkers.forEach(marker => {
        if (stationsVisible) {
            map.addLayer(marker);
        } else {
            map.removeLayer(marker);
        }
    });
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
    // Lösche alte Fahrzeugmarker
    vehicleMarkers.forEach(m => map.removeLayer(m));
    vehicleMarkers = [];
    
    // Erstelle neue Fahrzeugmarker NUR für unterwegs/im Einsatz
    if (!game) return;
    
    game.vehicles.filter(v => v.owned && (v.status === 'dispatched' || v.status === 'on-scene')).forEach(vehicle => {
        const iconHtml = createVehiclePixelIcon(vehicle.type);
        
        const marker = L.marker(vehicle.position, {
            icon: L.divIcon({
                html: iconHtml,
                className: 'vehicle-marker',
                iconSize: [28, 28],
                iconAnchor: [14, 28]
            }),
            zIndexOffset: 1000
        }).addTo(map);
        
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
        
        vehicleMarkers.push(marker);
    });
}

function centerMap() {
    if (map) {
        map.setView(CONFIG.MAP_CENTER, CONFIG.MAP_ZOOM);
    }
}

function lightenColor(hex, percent) {
    const num = parseInt(hex, 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}