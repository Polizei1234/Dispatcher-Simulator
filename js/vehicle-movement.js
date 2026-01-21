// =========================
// VEHICLE MOVEMENT SYSTEM
// Realistische Fahrzeugbewegung mit FMS-Status
// =========================

const VehicleMovement = {
    movingVehicles: {},
    updateInterval: null,

    initialize() {
        console.log('🚑 Vehicle Movement System initialisiert');
        this.startUpdateLoop();
    },

    startUpdateLoop() {
        if (this.updateInterval) return;
        
        // Update alle 1 Sekunde (Spielzeit)
        this.updateInterval = setInterval(() => {
            this.updateAllVehicles();
        }, 1000);
    },

    /**
     * Fahrzeug zu Einsatz schicken
     */
    dispatchVehicle(vehicleId, targetCoords, incidentId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            console.error('❌ Fahrzeug nicht gefunden:', vehicleId);
            return;
        }

        console.log(`🚨 Disponiere ${vehicle.name} zu Einsatz ${incidentId}`);

        // Get station position
        const station = Object.values(STATIONS).find(s => s.id === vehicle.station);
        if (!station) {
            console.error('❌ Wache nicht gefunden:', vehicle.station);
            return;
        }

        const startPos = station.position;
        const endPos = [targetCoords.lat, targetCoords.lon];

        // Berechne Route und ETA
        const distance = this.calculateDistance(startPos, endPos);
        const speed = 60; // km/h mit Sondersignal
        const eta = Math.ceil((distance / speed) * 60); // Minuten

        // Update Fahrzeug
        vehicle.status = 'dispatched';
        vehicle.currentStatus = 3; // FMS 3
        vehicle.position = [...startPos];
        vehicle.targetLocation = endPos;
        vehicle.incident = incidentId;
        vehicle.eta = eta;

        // Zeichne Route
        if (typeof drawVehicleRoute === 'function') {
            drawVehicleRoute(vehicleId, startPos, endPos);
        }

        // FMS 3 Meldung
        this.sendFMSMessage(vehicle, 3);

        // Tracking
        this.movingVehicles[vehicleId] = {
            startPos: startPos,
            endPos: endPos,
            currentPos: [...startPos],
            progress: 0,
            eta: eta,
            startTime: Date.now(),
            incidentId: incidentId
        };

        // Update Map
        if (typeof updateVehicleOnMap === 'function') {
            updateVehicleOnMap(vehicle);
        }
    },

    /**
     * Update alle bewegenden Fahrzeuge
     */
    updateAllVehicles() {
        const gameSpeed = game?.timeMultiplier || 1;
        
        Object.keys(this.movingVehicles).forEach(vehicleId => {
            this.updateVehiclePosition(vehicleId, gameSpeed);
        });
    },

    /**
     * Update einzelnes Fahrzeug
     */
    updateVehiclePosition(vehicleId, gameSpeed) {
        const movement = this.movingVehicles[vehicleId];
        if (!movement) return;

        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        // Berechne Fortschritt (1% pro Sekunde Spielzeit bei 1x Speed)
        const progressPerSecond = (1 / vehicle.eta) * gameSpeed; // % pro Sekunde
        movement.progress += progressPerSecond;

        if (movement.progress >= 1) {
            // Angekommen!
            this.vehicleArrived(vehicleId);
            return;
        }

        // Interpoliere Position
        const lat = movement.startPos[0] + (movement.endPos[0] - movement.startPos[0]) * movement.progress;
        const lon = movement.startPos[1] + (movement.endPos[1] - movement.startPos[1]) * movement.progress;

        vehicle.position = [lat, lon];
        movement.currentPos = [lat, lon];

        // Update Map
        if (typeof updateVehicleOnMap === 'function') {
            updateVehicleOnMap(vehicle);
        }
    },

    /**
     * Fahrzeug am Einsatzort angekommen
     */
    vehicleArrived(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const movement = this.movingVehicles[vehicleId];
        if (!movement) return;

        console.log(`✅ ${vehicle.name} am Einsatzort angekommen`);

        // Update Status
        vehicle.status = 'on-scene';
        vehicle.currentStatus = 4; // FMS 4
        vehicle.position = movement.endPos;

        // FMS 4 Meldung
        this.sendFMSMessage(vehicle, 4);

        // Remove from tracking
        delete this.movingVehicles[vehicleId];

        // Clear Route
        if (typeof clearVehicleRoute === 'function') {
            clearVehicleRoute(vehicleId);
        }

        // Update Map
        if (typeof updateVehicleOnMap === 'function') {
            updateVehicleOnMap(vehicle);
        }

        // Simuliere Einsatzabarbeitung (10-30 Minuten)
        const duration = (Math.random() * 20 + 10) * 60; // Sekunden
        setTimeout(() => {
            this.finishIncident(vehicleId);
        }, (duration / (game?.timeMultiplier || 1)) * 1000);
    },

    /**
     * Einsatz abgeschlossen
     */
    finishIncident(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        console.log(`✅ ${vehicle.name} Einsatz beendet`);

        // FMS 1 - Rückkehr
        vehicle.status = 'returning';
        vehicle.currentStatus = 1;
        this.sendFMSMessage(vehicle, 1);

        // Get station position
        const station = Object.values(STATIONS).find(s => s.id === vehicle.station);
        if (!station) return;

        const stationPos = station.position;
        const currentPos = vehicle.position;

        // Berechne Rückweg
        const distance = this.calculateDistance(currentPos, stationPos);
        const speed = 50; // km/h ohne Sondersignal
        const eta = Math.ceil((distance / speed) * 60);

        vehicle.targetLocation = stationPos;
        vehicle.eta = eta;

        // Tracking für Rückfahrt
        this.movingVehicles[vehicleId] = {
            startPos: currentPos,
            endPos: stationPos,
            currentPos: [...currentPos],
            progress: 0,
            eta: eta,
            startTime: Date.now(),
            returning: true
        };

        // Zeichne Route
        if (typeof drawVehicleRoute === 'function') {
            drawVehicleRoute(vehicleId, currentPos, stationPos);
        }
    },

    /**
     * Zurück auf Wache
     */
    returnToStation(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const station = Object.values(STATIONS).find(s => s.id === vehicle.station);
        if (!station) return;

        console.log(`🏥 ${vehicle.name} zurück auf Wache`);

        // FMS 2 - Einsatzbereit Wache
        vehicle.status = 'available';
        vehicle.currentStatus = 2;
        vehicle.position = station.position;
        vehicle.targetLocation = null;
        vehicle.incident = null;

        this.sendFMSMessage(vehicle, 2);

        // Remove tracking
        delete this.movingVehicles[vehicleId];

        // Clear Route
        if (typeof clearVehicleRoute === 'function') {
            clearVehicleRoute(vehicleId);
        }

        // Update Map
        if (typeof updateVehicleOnMap === 'function') {
            updateVehicleOnMap(vehicle);
        }
    },

    /**
     * Sende FMS-Statusmeldung im Funkverkehr
     */
    sendFMSMessage(vehicle, fmsCode) {
        if (!CONFIG.FMS_STATUS || !CONFIG.FMS_STATUS[fmsCode]) return;

        const fmsStatus = CONFIG.FMS_STATUS[fmsCode];
        const timestamp = IncidentNumbering.getCurrentTimestamp();

        const message = `[${timestamp}] ${vehicle.callsign}: Status ${fmsCode} - ${fmsStatus.name} ${fmsStatus.icon}`;

        // Add to radio log
        if (typeof addRadioMessage === 'function') {
            addRadioMessage(message, 'vehicle', fmsStatus.color);
        }

        console.log(`📡 FMS ${fmsCode}:`, vehicle.callsign, fmsStatus.name);
    },

    /**
     * Berechne Distanz zwischen zwei Punkten (Haversine)
     */
    calculateDistance(pos1, pos2) {
        const R = 6371; // Erdradius in km
        const lat1 = pos1[0] * Math.PI / 180;
        const lat2 = pos2[0] * Math.PI / 180;
        const deltaLat = (pos2[0] - pos1[0]) * Math.PI / 180;
        const deltaLon = (pos2[1] - pos1[1]) * Math.PI / 180;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distanz in km
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Warte bis GAME_DATA geladen ist
        const checkInterval = setInterval(() => {
            if (typeof GAME_DATA !== 'undefined' && typeof game !== 'undefined') {
                VehicleMovement.initialize();
                clearInterval(checkInterval);
            }
        }, 500);
    });
}