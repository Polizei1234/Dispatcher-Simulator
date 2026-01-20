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
    console.log('Initialisiere Karte...');
    
    // Warte kurz, bis das Map-Element sichtbar ist
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map-Element nicht gefunden!');
        return;
    }
    
    try {
        // Erstelle Karte
        map = L.map('map', {
            center: CONFIG.MAP_CENTER,
            zoom: CONFIG.MAP_ZOOM,
            zoomControl: true
        });
        
        // Füge OpenStreetMap Tiles hinzu
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: CONFIG.MAP_MIN_ZOOM,
            maxZoom: CONFIG.MAP_MAX_ZOOM
        }).addTo(map);
        
        // Wichtig: Karte neu rendern
        setTimeout(() => {
            map.invalidateSize();
            console.log('Karte erfolgreich initialisiert');
        }, 100);
        
        // Zeige Wachen
        showStationsOnMap();
        
    } catch (error) {
        console.error('Fehler beim Initialisieren der Karte:', error);
    }
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
        
        // Erstelle einfachen Marker (keine externen Icons wegen CORS)
        let markerColor = '#c8102e'; // Rot für Rettungswache
        
        if (station.type === 'feuerwehr') {
            markerColor = '#ff5722'; // Orange
        } else if (station.type === 'polizei') {
            markerColor = '#2196f3'; // Blau
        }
        
        const icon = L.divIcon({
            className: 'custom-station-marker',
            html: `<div style="background: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12]
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
    if (!map) return;
    
    // Lösche alte Marker
    mapMarkers.vehicles.forEach(marker => map.removeLayer(marker));
    mapMarkers.vehicles = [];
    
    // Zeige nur aktive Fahrzeuge
    game.vehicles.filter(v => v.status !== 'available' && v.owned).forEach(vehicle => {
        const icon = L.divIcon({
            className: 'vehicle-marker',
            html: `<div style="background: #ffc107; color: #000; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; white-space: nowrap;">${vehicle.callsign.split(' ').pop()}</div>`,
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
    if (!map) return;
    
    // Lösche alte Marker
    mapMarkers.incidents.forEach(marker => map.removeLayer(marker));
    mapMarkers.incidents = [];
    
    // Zeige aktive Einsätze
    game.incidents.filter(i => i.status !== 'completed').forEach(incident => {
        const icon = L.divIcon({
            className: 'incident-marker',
            html: `<div style="background: #dc3545; color: white; padding: 6px; border-radius: 50%; font-size: 14px; font-weight: bold; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">!</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
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