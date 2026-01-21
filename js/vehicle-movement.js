// =========================
// VEHICLE MOVEMENT SYSTEM v4.7
// + Funkverkehr-Spam Fix
// =========================

const VehicleMovement = {
    movingVehicles: {},
    updateInterval: null,
    SPEED_KMH: 60,
    UPDATE_INTERVAL_MS: 100,
    lastStatusReports: {}, // ✅ Track last status per vehicle
    arrivalReported: {},   // ✅ Track arrival reports to prevent spam

    initialize() {
        console.log('🚑 Vehicle Movement System v4.7 initialisiert');
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

    dispatchVehicle(vehicleId, targetCoords, incidentId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            console.error(`❌ Fahrzeug ${vehicleId} nicht gefunden`);
            return;
        }

        const station = STATIONS[vehicle.station];
        if (!station) {
            console.error(`❌ Wache ${vehicle.station} nicht gefunden`);
            return;
        }

        const startPos = station.position;
        console.log(`🚑 ${vehicle.callsign} fährt von [${startPos}] nach [${targetCoords.lat}, ${targetCoords.lon}]`);

        // ✅ FMS 3 - Einsatzfahrt (NUR EINMAL beim Start!)
        this.setVehicleStatus(vehicle, 3, true); // true = force report
        vehicle.status = 'dispatched';
        vehicle.incident = incidentId;
        vehicle.position = [startPos[0], startPos[1]];
        vehicle.targetLocation = [targetCoords.lat, targetCoords.lon];

        if (typeof drawVehicleRoute === 'function') {
            drawVehicleRoute(vehicleId, startPos, [targetCoords.lat, targetCoords.lon]);
        }

        this.movingVehicles[vehicleId] = {
            vehicle: vehicle,
            start: { lat: startPos[0], lon: startPos[1] },
            target: { lat: targetCoords.lat, lon: targetCoords.lon },
            current: { lat: startPos[0], lon: startPos[1] },
            incidentId: incidentId,
            phase: 'to_scene',
            progress: 0,
            startTime: Date.now(),
            eta: this.calculateETA(startPos, [targetCoords.lat, targetCoords.lon])
        };
    },

    calculateETA(from, to) {
        const distance = this.calculateDistance(from[0], from[1], to[0], to[1]);
        const timeHours = distance / this.SPEED_KMH;
        const timeMinutes = timeHours * 60;
        return Math.ceil(timeMinutes);
    },

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
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

    updateAllVehicles() {
        Object.keys(this.movingVehicles).forEach(vehicleId => {
            this.updateVehiclePosition(vehicleId);
        });
    },

    updateVehiclePosition(vehicleId) {
        const movement = this.movingVehicles[vehicleId];
        if (!movement) return;

        const { start, target, vehicle } = movement;

        const totalDistance = this.calculateDistance(start.lat, start.lon, target.lat, target.lon);
        const timeElapsed = (Date.now() - movement.startTime) / 1000;
        const distanceTraveled = (this.SPEED_KMH / 3600) * timeElapsed;

        const progress = Math.min(distanceTraveled / totalDistance, 1);
        movement.progress = progress;

        const currentLat = start.lat + (target.lat - start.lat) * progress;
        const currentLon = start.lon + (target.lon - start.lon) * progress;

        movement.current = { lat: currentLat, lon: currentLon };
        vehicle.position = [currentLat, currentLon];

        if (typeof updateVehicleOnMap === 'function') {
            updateVehicleOnMap(vehicle);
        }

        if (progress >= 1) {
            this.handleArrival(vehicleId);
        }
    },

    handleArrival(vehicleId) {
        const movement = this.movingVehicles[vehicleId];
        if (!movement) return;

        const { vehicle, phase } = movement;
        
        // ✅ ANTI-SPAM: Verhindere mehrfache Arrival-Reports
        const arrivalKey = `${vehicleId}_${phase}`;
        if (this.arrivalReported[arrivalKey]) {
            // Already reported, skip
            return;
        }
        this.arrivalReported[arrivalKey] = true;

        console.log(`✅ ${vehicle.callsign} angekommen (Phase: ${phase})`);

        switch (phase) {
            case 'to_scene':
                this.setVehicleStatus(vehicle, 4, true); // FMS 4 - Am Einsatzort
                vehicle.status = 'on-scene';

                // ✅ WICHTIG: Stoppe Bewegung komplett
                delete this.movingVehicles[vehicleId];

                // Start scene time
                setTimeout(() => {
                    this.startTransport(vehicleId);
                }, 2 * 60 * 1000);
                break;

            case 'to_hospital':
                this.setVehicleStatus(vehicle, 8, true); // FMS 8 - Im Krankenhaus
                vehicle.status = 'at-hospital';

                delete this.movingVehicles[vehicleId];

                setTimeout(() => {
                    this.returnToStation(vehicleId);
                }, 5 * 60 * 1000);
                break;

            case 'returning':
                this.setVehicleStatus(vehicle, 2, true); // FMS 2 - Einsatzbereit
                vehicle.status = 'available';
                vehicle.targetLocation = null;
                vehicle.incident = null;

                delete this.movingVehicles[vehicleId];
                
                // ✅ Reset arrival tracker
                delete this.arrivalReported[`${vehicleId}_to_scene`];
                delete this.arrivalReported[`${vehicleId}_to_hospital`];
                delete this.arrivalReported[`${vehicleId}_returning`];

                if (typeof clearVehicleRoute === 'function') {
                    clearVehicleRoute(vehicleId);
                }
                break;
        }
    },

    startTransport(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        this.setVehicleStatus(vehicle, 7, true); // FMS 7 - Patient an Bord
        vehicle.status = 'transporting';

        const hospitalCoords = this.findNearestHospital(vehicle.position);
        console.log(`🏥 ${vehicle.callsign} fährt ins Krankenhaus`);

        this.movingVehicles[vehicleId] = {
            vehicle: vehicle,
            phase: 'to_hospital',
            start: { lat: vehicle.position[0], lon: vehicle.position[1] },
            target: { lat: hospitalCoords[0], lon: hospitalCoords[1] },
            current: { lat: vehicle.position[0], lon: vehicle.position[1] },
            progress: 0,
            startTime: Date.now()
        };

        if (typeof drawVehicleRoute === 'function') {
            drawVehicleRoute(vehicleId, vehicle.position, hospitalCoords);
        }
    },

    returnToStation(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        this.setVehicleStatus(vehicle, 1, true); // FMS 1 - Einsatz erledigt
        vehicle.status = 'returning';

        const station = STATIONS[vehicle.station];
        if (!station) return;

        console.log(`🏠 ${vehicle.callsign} kehrt zur Wache zurück`);

        this.movingVehicles[vehicleId] = {
            vehicle: vehicle,
            phase: 'returning',
            start: { lat: vehicle.position[0], lon: vehicle.position[1] },
            target: { lat: station.position[0], lon: station.position[1] },
            current: { lat: vehicle.position[0], lon: vehicle.position[1] },
            progress: 0,
            startTime: Date.now()
        };

        if (typeof drawVehicleRoute === 'function') {
            drawVehicleRoute(vehicleId, vehicle.position, station.position);
        }
    },

    findNearestHospital(position) {
        return [48.8309, 9.3256]; // Klinikum Waiblingen
    },

    // ✅ ANTI-SPAM: Verhindere doppelte Status-Meldungen
    setVehicleStatus(vehicle, fmsCode, forceReport = false) {
        vehicle.currentStatus = fmsCode;

        // ✅ Verhindere doppelte Meldungen
        const lastStatus = this.lastStatusReports[vehicle.id];
        if (!forceReport && lastStatus === fmsCode) {
            return; // Skip duplicate
        }

        this.lastStatusReports[vehicle.id] = fmsCode;

        const fmsInfo = CONFIG.FMS_STATUS[fmsCode];
        if (!fmsInfo) return;

        console.log(`📻 ${vehicle.callsign} - Status ${fmsCode}: ${fmsInfo.name}`);

        // ✅ Funkspruch NUR EINMAL pro Status-Wechsel!
        const message = `${vehicle.callsign} - Status ${fmsCode}: ${fmsInfo.name}`;
        if (typeof addRadioMessage === 'function') {
            addRadioMessage(message, 'vehicle', fmsInfo.color);
        }

        if (typeof UI !== 'undefined' && UI.updateVehicleList) {
            UI.updateVehicleList();
        }
    }
};

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        VehicleMovement.initialize();
    });
}