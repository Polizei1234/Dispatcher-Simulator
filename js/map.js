// =========================
// KARTENMODUL
// Leaflet.js + OpenStreetMap
// =========================

let mapMarkers = {
    stations: [],
    vehicles: [],
    incidents: []
};

let vehicleIcons = {};

function initMap() {
    console.log('Initialisiere Karte...');
    
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map-Element nicht gefunden!');
        return;
    }
    
    try {
        map = L.map('map', {
            center: CONFIG.MAP_CENTER,
            zoom: CONFIG.MAP_ZOOM,
            zoomControl: true
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            minZoom: CONFIG.MAP_MIN_ZOOM,
            maxZoom: CONFIG.MAP_MAX_ZOOM
        }).addTo(map);
        
        setTimeout(() => {
            map.invalidateSize();
            console.log('Karte erfolgreich initialisiert');
        }, 100);
        
        showStationsOnMap();
        
    } catch (error) {
        console.error('Fehler beim Initialisieren der Karte:', error);
    }
}

function showStationsOnMap() {
    if (!game || !map) return;
    
    mapMarkers.stations.forEach(marker => map.removeLayer(marker));
    mapMarkers.stations = [];
    
    Object.values(game.stations).forEach(station => {
        const hasVehicles = game.vehicles.some(v => v.station === station.id && v.owned);
        if (!hasVehicles) return;
        
        // Verwende Emoji als Icon
        const emoji = station.icon || '🏥';
        
        const icon = L.divIcon({
            className: 'custom-station-marker',
            html: `<div style="font-size: 32px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${emoji}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
        
        const marker = L.marker(station.position, { icon: icon }).addTo(map);
        marker.bindPopup(`
            <strong>${station.name}</strong><br>
            ${station.organization}<br>
            <small>${station.address}</small><br>
            <small>Fahrzeuge: ${game.vehicles.filter(v => v.station === station.id && v.owned).length}</small>
        `);
        
        mapMarkers.stations.push(marker);
    });
}

function updateMap() {
    if (!game || !map) return;
    updateVehiclesOnMap();
    updateIncidentsOnMap();
}

function updateVehiclesOnMap() {
    if (!map) return;
    
    mapMarkers.vehicles.forEach(marker => map.removeLayer(marker));
    mapMarkers.vehicles = [];
    
    // Zeige alle Fahrzeuge (auch verfügbare an der Wache)
    game.vehicles.filter(v => v.owned).forEach(vehicle => {
        let emoji = '🚑'; // RTW
        let bgColor = '#c8102e';
        
        if (vehicle.type === 'NEF') {
            emoji = '🚑';
            bgColor = '#ffc107';
        } else if (vehicle.type === 'KTW') {
            emoji = '🚐';
            bgColor = '#2196f3';
        } else if (vehicle.type.includes('LF') || vehicle.type.includes('DLK') || vehicle.type.includes('TLF')) {
            emoji = '🚒';
            bgColor = '#ff5722';
        } else if (vehicle.type.includes('FuStW')) {
            emoji = '🚓';
            bgColor = '#2196f3';
        }
        
        // Zeige nur aktive Fahrzeuge auf der Karte fahrend
        if (vehicle.status !== 'available') {
            const callsignShort = vehicle.callsign.split(' ').slice(-2).join(' ');
            
            const icon = L.divIcon({
                className: 'vehicle-marker-active',
                html: `
                    <div style="display: flex; align-items: center; background: ${bgColor}; padding: 4px 8px; border-radius: 15px; box-shadow: 0 2px 6px rgba(0,0,0,0.4); border: 2px solid white;">
                        <span style="font-size: 16px; margin-right: 4px;">${emoji}</span>
                        <span style="color: white; font-size: 11px; font-weight: bold; white-space: nowrap;">${callsignShort}</span>
                    </div>
                `,
                iconSize: [100, 30],
                iconAnchor: [50, 15]
            });
            
            const marker = L.marker(vehicle.position, { icon: icon }).addTo(map);
            marker.bindPopup(`
                <strong>${vehicle.callsign}</strong><br>
                ${vehicle.type}<br>
                Status: ${getStatusText(vehicle.status)}<br>
                ${vehicle.totalDistance ? `Distanz: ${vehicle.totalDistance.toFixed(1)} km` : ''}
            `);
            
            mapMarkers.vehicles.push(marker);
        }
    });
}

function getStatusText(status) {
    switch(status) {
        case 'available': return 'Verfügbar';
        case 'dispatched': return 'Alarmiert - unterwegs';
        case 'on-scene': return 'Vor Ort';
        default: return status;
    }
}

function updateIncidentsOnMap() {
    if (!map) return;
    
    mapMarkers.incidents.forEach(marker => map.removeLayer(marker));
    mapMarkers.incidents = [];
    
    game.incidents.filter(i => i.status !== 'completed' && i.status !== 'incoming' && i.status !== 'in-call').forEach(incident => {
        const keywordInfo = KEYWORDS_BW[incident.keyword];
        const color = keywordInfo ? keywordInfo.color : '#dc3545';
        
        const icon = L.divIcon({
            className: 'incident-marker',
            html: `
                <div style="background: ${color}; color: white; padding: 8px; border-radius: 50%; font-size: 12px; font-weight: bold; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.4); border: 3px solid white;">
                    ${incident.keyword}
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        
        const marker = L.marker(incident.position, { icon: icon }).addTo(map);
        
        const assignedVehiclesText = incident.assignedVehicles && incident.assignedVehicles.length > 0
            ? `<br><small>Alarmiert: ${incident.assignedVehicles.length} Fahrzeug(e)</small>`
            : '<br><small style="color: #ffc107;">Noch keine Fahrzeuge alarmiert!</small>';
        
        marker.bindPopup(`
            <strong style="color: ${color};">${incident.keyword}</strong><br>
            ${incident.description || 'Details noch unklar'}<br>
            <small>${incident.location || 'Adresse wird ermittelt'}</small>
            ${assignedVehiclesText}
        `);
        
        marker.on('click', () => selectIncident(incident.id));
        
        mapMarkers.incidents.push(marker);
    });
}