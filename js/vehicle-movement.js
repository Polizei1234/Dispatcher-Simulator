// =========================
// VEHICLE MOVEMENT SYSTEM v2.1
// FMS-Status Meldungen im Funk
// =========================

const VehicleMovement = {
    movingVehicles: {},
    updateInterval: null,
    SPEED_KMH: 60, // Durchschnittsgeschwindigkeit
    UPDATE_INTERVAL_MS: 100, // Update alle 100ms

    initialize() {
        console.log('🚑 Vehicle Movement System v2.1 initialisiert');
        this.startUpdateLoop();
    },

    startUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            this.updateAllVehicles();
        }, this.UPDATE_INTERVAL_MS);
    },

    /**
     * Startet Fahrt eines Fahrzeugs zu einem Ziel
     */
    dispatchVehicle(vehicleId, targetCoords, incidentId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            console.error(`❌ Fahrzeug ${vehicleId} nicht gefunden`);
            return;
        }

        // Startposition = Wache
        const station = STATIONS[vehicle.station];
        if (!station) {
            console.error(`❌ Wache ${vehicle.station} nicht gefunden`);
            return;
        }

        const startPos = station.position;
        console.log(`🚑 ${vehicle.callsign} fährt von [${startPos}] nach [${targetCoords.lat}, ${targetCoords.lon}]`);

        // FMS 3 - Einsatzfahrt (wird bereits beim Alarmieren gesendet)
        vehicle.currentStatus = 3;
        vehicle.status = 'dispatched';
        vehicle.incident = incidentId;
        vehicle.position = [startPos[0], startPos[1]];
        vehicle.targetLocation = [targetCoords.lat, targetCoords.lon];

        // Zeichne Route
        if (typeof drawVehicleRoute === 'function') {
            drawVehicleRoute(vehicleId, startPos, [targetCoords.lat, targetCoords.lon]);
        }

        // Setup movement
        this.movingVehicles[vehicleId] = {
            vehicle: vehicle,
            start: { lat: startPos[0], lon: startPos[1] },
            target: { lat: targetCoords.lat, lon: targetCoords.lon },
            current: { lat: startPos[0], lon: startPos[1] },
            incidentId: incidentId,
            phase: 'to_scene', // to_scene, on_scene, to_hospital, returning
            progress: 0,
            startTime: Date.now(),
            eta: this.calculateETA(startPos, [targetCoords.lat, targetCoords.lon])
        };
    },

    /**
     * Berechnet ETA in Minuten
     */
    calculateETA(from, to) {
        const distance = this.calculateDistance(from[0], from[1], to[0], to[1]);
        const timeHours = distance / this.SPEED_KMH;
        const timeMinutes = timeHours * 60;
        return Math.ceil(timeMinutes);
    },

    /**
     * Haversine Distanz in km
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Erdradius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    toRad(degrees) {
        return degrees * Math.PI / 180;
    },

    /**
     * Updated alle fahrenden Fahrzeuge
     */
    updateAllVehicles() {
        Object.keys(this.movingVehicles).forEach(vehicleId => {
            this.updateVehiclePosition(vehicleId);
        });
    },

    /**
     * Updated Position eines Fahrzeugs
     */
    updateVehiclePosition(vehicleId) {
        const movement = this.movingVehicles[vehicleId];
        if (!movement) return;

        const { start, target, vehicle, phase } = movement;

        // Berechne Fortschritt
        const totalDistance = this.calculateDistance(start.lat, start.lon, target.lat, target.lon);
        const timeElapsed = (Date.now() - movement.startTime) / 1000; // in Sekunden
        const distanceTraveled = (this.SPEED_KMH / 3600) * timeElapsed; // km

        const progress = Math.min(distanceTraveled / totalDistance, 1);
        movement.progress = progress;

        // Interpoliere Position
        const currentLat = start.lat + (target.lat - start.lat) * progress;
        const currentLon = start.lon + (target.lon - start.lon) * progress;

        movement.current = { lat: currentLat, lon: currentLon };
        vehicle.position = [currentLat, currentLon];

        // Update auf Karte
        if (typeof updateVehicleOnMap === 'function') {
            updateVehicleOnMap(vehicle);
        }

        // Ziel erreicht?
        if (progress >= 1) {
            this.handleArrival(vehicleId);
        }
    },

    /**
     * Fahrzeug ist angekommen
     */
    handleArrival(vehicleId) {
        const movement = this.movingVehicles[vehicleId];
        if (!movement) return;

        const { vehicle, phase, incidentId } = movement;

        console.log(`✅ ${vehicle.callsign} angekommen (Phase: ${phase})`);

        switch (phase) {
            case 'to_scene':
                // FMS 4 - Am Einsatzort
                this.setVehicleStatus(vehicle, 4);
                vehicle.status = 'on-scene';

                // Nach 2 Minuten: Transport starten
                setTimeout(() => {
                    this.startTransport(vehicleId);
                }, 2 * 60 * 1000);
                break;

            case 'to_hospital':
                // FMS 8 - Im Krankenhaus
                this.setVehicleStatus(vehicle, 8);
                vehicle.status = 'at-hospital';

                // Nach 5 Minuten: Zurück zur Wache
                setTimeout(() => {
                    this.returnToStation(vehicleId);
                }, 5 * 60 * 1000);
                break;

            case 'returning':
                // FMS 2 - Einsatzbereit auf Wache
                this.setVehicleStatus(vehicle, 2);
                vehicle.status = 'available';
                vehicle.targetLocation = null;
                vehicle.incident = null;

                // Cleanup
                delete this.movingVehicles[vehicleId];
                if (typeof clearVehicleRoute === 'function') {
                    clearVehicleRoute(vehicleId);
                }
                break;
        }
    },

    /**
     * Startet Transport ins Krankenhaus
     */
    startTransport(vehicleId) {
        const movement = this.movingVehicles[vehicleId];
        if (!movement) return;

        const { vehicle } = movement;

        // FMS 7 - Patient an Bord
        this.setVehicleStatus(vehicle, 7);
        vehicle.status = 'transporting';

        // Finde nächstes Krankenhaus (Placeholder)
        const hospitalCoords = this.findNearestHospital(vehicle.position);

        console.log(`🏥 ${vehicle.callsign} fährt ins Krankenhaus`);

        // Update movement
        movement.phase = 'to_hospital';
        movement.start = { lat: vehicle.position[0], lon: vehicle.position[1] };
        movement.target = { lat: hospitalCoords[0], lon: hospitalCoords[1] };
        movement.current = { lat: vehicle.position[0], lon: vehicle.position[1] };
        movement.progress = 0;
        movement.startTime = Date.now();

        // Zeichne neue Route
        if (typeof drawVehicleRoute === 'function') {
            drawVehicleRoute(vehicleId, vehicle.position, hospitalCoords);
        }
    },

    /**
     * Fahrzeug kehrt zur Wache zurück
     */
    returnToStation(vehicleId) {
        const movement = this.movingVehicles[vehicleId];
        if (!movement) return;

        const { vehicle } = movement;

        // FMS 1 - Einsatz erledigt, auf Rückfahrt
        this.setVehicleStatus(vehicle, 1);
        vehicle.status = 'returning';

        const station = STATIONS[vehicle.station];
        if (!station) return;

        console.log(`🏠 ${vehicle.callsign} kehrt zur Wache zurück`);

        // Update movement
        movement.phase = 'returning';
        movement.start = { lat: vehicle.position[0], lon: vehicle.position[1] };
        movement.target = { lat: station.position[0], lon: station.position[1] };
        movement.current = { lat: vehicle.position[0], lon: vehicle.position[1] };
        movement.progress = 0;
        movement.startTime = Date.now();

        // Zeichne neue Route
        if (typeof drawVehicleRoute === 'function') {
            drawVehicleRoute(vehicleId, vehicle.position, station.position);
        }
    },

    /**
     * Findet nächstes Krankenhaus
     */
    findNearestHospital(position) {
        // Placeholder: Klinikum Waiblingen
        return [48.8309, 9.3256];
    },

    /**
     * Setzt FMS Status und sendet Funkspruch
     */
    setVehicleStatus(vehicle, fmsCode) {
        vehicle.currentStatus = fmsCode;

        const fmsInfo = CONFIG.FMS_STATUS[fmsCode];
        if (!fmsInfo) return;

        console.log(`📻 ${vehicle.callsign} - Status ${fmsCode}: ${fmsInfo.name}`);

        // Immer Funkspruch senden
        const message = `Status ${fmsCode} - ${fmsInfo.name}`;
        if (typeof addRadioMessage === 'function') {
            addRadioMessage(vehicle.callsign, message);
        }

        // Update UI
        if (typeof UI !== 'undefined' && UI.updateVehicleList) {
            UI.updateVehicleList();
        }
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        VehicleMovement.initialize();
    });
}