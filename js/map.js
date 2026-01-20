// =========================
// KARTENMODUL
// Leaflet.js + OpenStreetMap
// =========================

let mapMarkers = {
    stations: [],
    vehicles: [],
    incidents: []
};

function initMap() {
    // Erstelle Karte
    map = L.map('map').setView(CONFIG.MAP_CENTER, CONFIG.MAP_ZOOM);
    
    // Füge OpenStreetMap Tiles hinzu
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: CONFIG.MAP_MIN_ZOOM,
        maxZoom: CONFIG.MAP_MAX_ZOOM
    }).addTo(map);
    
    // Zeige Wachen
    showStationsOnMap();
    
    console.log('Karte initialisiert');
}

function showStationsOnMap() {
    if (!game || !map) return;
    
    // Lösche alte Marker
    mapMarkers.stations.forEach(marker => map.removeLayer(marker));
    mapMarkers.stations = [];
    
    // Zeige nur eigene Wachen
    Object.values(game.stations).forEach(station => {
        // Prüfe ob Spieler Fahrzeuge in dieser Wache hat
        const hasVehicles = game.vehicles.some(v => v.station === station.id && v.owned);
        if (!hasVehicles) return;
        
        let iconUrl = 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png'; // Rettungswache
        
        if (station.type === 'feuerwehr') {
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png';
        } else if (station.type === 'polizei') {
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/2965/2965142.png';
        }
        
        const icon = L.icon({
            iconUrl: iconUrl,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
        
        const marker = L.marker(station.position, { icon: icon }).addTo(map);
        marker.bindPopup(`
            <strong>${station.name}</strong><br>
            ${station.organization}<br>
            <small>${station.address}</small>
        `);
        
        mapMarkers.stations.push(marker);
    });
}

function updateMap() {
    if (!game || !map) return;
    
    // Update Fahrzeuge
    updateVehiclesOnMap();
    
    // Update Einsätze
    updateIncidentsOnMap();
}

function updateVehiclesOnMap() {
    // Lösche alte Marker
    mapMarkers.vehicles.forEach(marker => map.removeLayer(marker));
    mapMarkers.vehicles = [];
    
    // Zeige nur aktive Fahrzeuge
    game.vehicles.filter(v => v.status !== 'available' && v.owned).forEach(vehicle => {
        const icon = L.divIcon({
            className: 'vehicle-marker',
            html: `<div style="background: #ffc107; color: #000; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold;">${vehicle.callsign.split(' ').pop()}</div>`,
            iconSize: [60, 20]
        });
        
        const marker = L.marker(vehicle.position, { icon: icon }).addTo(map);
        marker.bindPopup(`
            <strong>${vehicle.callsign}</strong><br>
            ${vehicle.type}<br>
            Status: ${vehicle.status === 'dispatched' ? 'Alarmiert' : 'Vor Ort'}
        `);
        
        mapMarkers.vehicles.push(marker);
    });
}

function updateIncidentsOnMap() {
    // Lösche alte Marker
    mapMarkers.incidents.forEach(marker => map.removeLayer(marker));
    mapMarkers.incidents = [];
    
    // Zeige aktive Einsätze
    game.incidents.filter(i => i.status !== 'completed').forEach(incident => {
        const icon = L.divIcon({
            className: 'incident-marker',
            html: `<div style="background: #dc3545; color: white; padding: 4px 8px; border-radius: 50%; font-size: 12px; font-weight: bold; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-exclamation"></i></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const marker = L.marker(incident.position, { icon: icon }).addTo(map);
        marker.bindPopup(`
            <strong>${incident.keyword}</strong><br>
            ${incident.description}<br>
            <small>${incident.location}</small>
        `);
        
        marker.on('click', () => selectIncident(incident.id));
        
        mapMarkers.incidents.push(marker);
    });
}