// =========================
// VEHICLE MOVEMENT SYSTEM v4.8
// + Straßenrouting (Leaflet Routing Machine)
// + Entfernungsberechnung
// + Funkverkehr-Spam Fix
// =========================

const VehicleMovement = {
    movingVehicles: {},
    updateInterval: null,
    SPEED_KMH: 60,
    UPDATE_INTERVAL_MS: 100,
    lastStatusReports: {},
    arrivalReported: {},
    routingControls: {}, // 🚀 Speichere Routing Controls

    initialize() {
        console.log('🚑 Vehicle Movement System v4.8 initialisiert');
        console.log('🗺️ Leaflet Routing Machine aktiviert');
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

    // 🚀 NEUE METHODE: Routing mit Leaflet Routing Machine
    async dispatchVehicle(vehicleId, targetCoords, incidentId) {
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

        // ✅ FMS 3 - Einsatzfahrt
        this.setVehicleStatus(vehicle, 3, true);
        vehicle.status = 'dispatched';
        vehicle.incident = incidentId;
        vehicle.position = [startPos[0], startPos[1]];
        vehicle.targetLocation = [targetCoords.lat, targetCoords.lon];

        // 🚀 ROUTING MIT LEAFLET ROUTING MACHINE
        if (typeof L !== 'undefined' && L.Routing && map) {
            console.log('🗺️ Berechne Straßenroute...');
            
            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(startPos[0], startPos[1]),
                    L.latLng(targetCoords.lat, targetCoords.lon)
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                show: false, // Verstecke UI-Panel
                createMarker: () => null, // Keine Marker
                lineOptions: {
                    styles: [
                        { color: '#17a2b8', weight: 4, opacity: 0.8, dashArray: '10, 5' }
                    ]
                },
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1'
                })
            }).on('routesfound', (e) => {
                const route = e.routes[0];
                const distanceKm = (route.summary.totalDistance / 1000).toFixed(1);
                const timeMin = Math.ceil(route.summary.totalTime / 60);
                
                console.log(`✅ Route berechnet: ${distanceKm} km, ETA ${timeMin} min`);
                
                // 📻 Funkspruch mit Entfernung
                const message = `${vehicle.callsign} alarmiert - ${distanceKm} km, ETA ${timeMin} min`;
                if (typeof addRadioMessage === 'function') {
                    addRadioMessage(message, 'dispatcher', '#17a2b8');
                }
                
                // Speichere Route-Koordinaten für Animation
                const routeCoords = route.coordinates.map(c => ({ lat: c.lat, lon: c.lng }));
                
                this.movingVehicles[vehicleId] = {
                    vehicle: vehicle,
                    routeCoords: routeCoords,
                    currentIndex: 0,
                    incidentId: incidentId,
                    phase: 'to_scene',
                    startTime: Date.now(),
                    totalTime: route.summary.totalTime * 1000, // in ms
                    distanceKm: distanceKm,
                    eta: timeMin
                };
            }).addTo(map);
            
            // Speichere Control zum späteren Entfernen
            this.routingControls[vehicleId] = routingControl;
            
        } else {
            // Fallback: Luftlinie (falls LRM nicht verfügbar)
            console.warn('⚠️ Leaflet Routing Machine nicht verfügbar, nutze Luftlinie');
            this.dispatchVehicleFallback(vehicle, startPos, targetCoords, incidentId);
        }
    },

    // Fallback ohne Routing
    dispatchVehicleFallback(vehicle, startPos, targetCoords, incidentId) {
        if (typeof drawVehicleRoute === 'function') {
            drawVehicleRoute(vehicle.id, startPos, [targetCoords.lat, targetCoords.lon]);
        }

        const eta = this.calculateETA(startPos, [targetCoords.lat, targetCoords.lon]);
        
        this.movingVehicles[vehicle.id] = {
            vehicle: vehicle,
            start: { lat: startPos[0], lon: startPos[1] },
            target: { lat: targetCoords.lat, lon: targetCoords.lon },
            current: { lat: startPos[0], lon: startPos[1] },
            incidentId: incidentId,
            phase: 'to_scene',
            progress: 0,
            startTime: Date.now(),
            eta: eta
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

        const { vehicle } = movement;

        // 🚀 Route-basierte Bewegung (mit LRM)
        if (movement.routeCoords) {
            const elapsed = Date.now() - movement.startTime;
            const progress = Math.min(elapsed / movement.totalTime, 1);
            
            // Finde aktuellen Punkt auf Route
            const targetIndex = Math.floor(progress * (movement.routeCoords.length - 1));
            movement.currentIndex = targetIndex;
            
            if (targetIndex < movement.routeCoords.length) {
                const coord = movement.routeCoords[targetIndex];
                vehicle.position = [coord.lat, coord.lon];
            }
            
            if (typeof updateVehicleOnMap === 'function') {
                updateVehicleOnMap(vehicle);
            }
            
            if (progress >= 1) {
                this.handleArrival(vehicleId);
            }
        } else {
            // Fallback: Luftlinie
            const { start, target } = movement;
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
        }
    },

    handleArrival(vehicleId) {
        const movement = this.movingVehicles[vehicleId];
        if (!movement) return;

        const { vehicle, phase } = movement;
        
        // ✅ ANTI-SPAM
        const arrivalKey = `${vehicleId}_${phase}`;
        if (this.arrivalReported[arrivalKey]) {
            return;
        }
        this.arrivalReported[arrivalKey] = true;

        console.log(`✅ ${vehicle.callsign} angekommen (Phase: ${phase})`);

        // 🗺️ Entferne Routing Control
        if (this.routingControls[vehicleId]) {
            map.removeControl(this.routingControls[vehicleId]);
            delete this.routingControls[vehicleId];
        }

        switch (phase) {
            case 'to_scene':
                this.setVehicleStatus(vehicle, 4, true);
                vehicle.status = 'on-scene';
                delete this.movingVehicles[vehicleId];

                setTimeout(() => {
                    this.startTransport(vehicleId);
                }, 2 * 60 * 1000);
                break;

            case 'to_hospital':
                this.setVehicleStatus(vehicle, 8, true);
                vehicle.status = 'at-hospital';
                delete this.movingVehicles[vehicleId];

                setTimeout(() => {
                    this.returnToStation(vehicleId);
                }, 5 * 60 * 1000);
                break;

            case 'returning':
                this.setVehicleStatus(vehicle, 2, true);
                vehicle.status = 'available';
                vehicle.targetLocation = null;
                vehicle.incident = null;
                delete this.movingVehicles[vehicleId];
                
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

        this.setVehicleStatus(vehicle, 7, true);
        vehicle.status = 'transporting';

        const hospitalCoords = this.findNearestHospital(vehicle.position);
        console.log(`🏥 ${vehicle.callsign} fährt ins Krankenhaus`);

        // Nutze Routing auch für Krankenhaus
        this.dispatchVehicle(vehicleId, { lat: hospitalCoords[0], lon: hospitalCoords[1] }, vehicle.incident);
        
        // Override phase
        if (this.movingVehicles[vehicleId]) {
            this.movingVehicles[vehicleId].phase = 'to_hospital';
        }
    },

    returnToStation(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        this.setVehicleStatus(vehicle, 1, true);
        vehicle.status = 'returning';

        const station = STATIONS[vehicle.station];
        if (!station) return;

        console.log(`🏠 ${vehicle.callsign} kehrt zur Wache zurück`);

        // Nutze Routing auch für Rückfahrt
        this.dispatchVehicle(vehicleId, { lat: station.position[0], lon: station.position[1] }, vehicle.incident);
        
        // Override phase
        if (this.movingVehicles[vehicleId]) {
            this.movingVehicles[vehicleId].phase = 'returning';
        }
    },

    findNearestHospital(position) {
        return [48.8309, 9.3256]; // Klinikum Waiblingen
    },

    setVehicleStatus(vehicle, fmsCode, forceReport = false) {
        vehicle.currentStatus = fmsCode;

        const lastStatus = this.lastStatusReports[vehicle.id];
        if (!forceReport && lastStatus === fmsCode) {
            return;
        }

        this.lastStatusReports[vehicle.id] = fmsCode;

        const fmsInfo = CONFIG.FMS_STATUS[fmsCode];
        if (!fmsInfo) return;

        console.log(`📻 ${vehicle.callsign} - Status ${fmsCode}: ${fmsInfo.name}`);

        const message = `${vehicle.callsign} - Status ${fmsCode}: ${fmsInfo.name}`;
        if (typeof addRadioMessage === 'function') {
            addRadioMessage(message, 'vehicle', fmsInfo.color);
        }

        if (typeof UI !== 'undefined' && UI.updateVehicleList) {
            UI.updateVehicleList();
        }
    },

    // 🚀 NEUE METHODE: Berechne Entfernung zwischen zwei Punkten (für UI)
    getDistanceToIncident(vehicleStation, incidentCoords) {
        const station = STATIONS[vehicleStation];
        if (!station) return null;
        
        const distance = this.calculateDistance(
            station.position[0],
            station.position[1],
            incidentCoords.lat,
            incidentCoords.lon
        );
        
        return {
            km: distance.toFixed(1),
            eta: this.calculateETA(station.position, [incidentCoords.lat, incidentCoords.lon])
        };
    }
};

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        VehicleMovement.initialize();
    });
}