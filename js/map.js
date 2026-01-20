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
                iconSize: [32, 32],
                iconAnchor: [16, 16]
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
        'rettungswache': '#dc3545',
        'notarztwache': '#ffc107',
        'ortsverein': '#ff0000'
    };
    
    const color = colors[category] || '#6c757d';
    const lightColor = lightenColor(color.replace('#', ''), 20);
    
    return `
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <!-- Pixel Art Gebäude -->
            <rect x="8" y="12" width="16" height="16" fill="${color}" stroke="#000" stroke-width="1"/>
            <rect x="8" y="8" width="16" height="4" fill="#${lightColor}" stroke="#000" stroke-width="1"/>
            <!-- Kreuz -->
            <rect x="14" y="16" width="4" height="8" fill="#fff"/>
            <rect x="12" y="18" width="8" height="4" fill="#fff"/>
            <!-- Fenster -->
            <rect x="10" y="10" width="2" height="2" fill="#add8e6"/>
            <rect x="20" y="10" width="2" height="2" fill="#add8e6"/>
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
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <!-- Pixel Art Fahrzeug -->
            <!-- Fahrzeugkörper -->
            <rect x="6" y="10" width="12" height="8" fill="${color}" stroke="#000" stroke-width="1"/>
            <!-- Fahrerhaus -->
            <rect x="14" y="8" width="4" height="4" fill="${color}" stroke="#000" stroke-width="1"/>
            <!-- Windschutzscheibe -->
            <rect x="15" y="9" width="2" height="2" fill="#add8e6"/>
            <!-- Räder -->
            <circle cx="9" cy="18" r="2" fill="#000"/>
            <circle cx="15" cy="18" r="2" fill="#000"/>
            <!-- Blaulicht -->
            <rect x="10" y="8" width="2" height="1" fill="#0000ff"/>
        </svg>
    `;
}

function updateMap() {
    // Lösche alte Fahrzeugmarker
    vehicleMarkers.forEach(m => map.removeLayer(m));
    vehicleMarkers = [];
    
    // Erstelle neue Fahrzeugmarker
    if (!game) return;
    
    game.vehicles.filter(v => v.owned).forEach(vehicle => {
        const iconHtml = createVehiclePixelIcon(vehicle.type);
        
        const marker = L.marker(vehicle.position, {
            icon: L.divIcon({
                html: iconHtml,
                className: 'vehicle-marker',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            })
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