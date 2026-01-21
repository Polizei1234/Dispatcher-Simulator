// =========================
// VEHICLE MOVEMENT SYSTEM v5.0 - ALL BUGS FIXED
// + Memory Leak Fix
// + Route-Caching
// + Routing Error Handler
// + Anti-Spam für Funksprüche
// + Batch Map Updates
// =========================

const VehicleMovement = {
    movingVehicles: {},
    updateInterval: null,
    SPEED_KMH: 60,
    UPDATE_INTERVAL_MS: 100,
    lastStatusReports: {},
    arrivalReported: {},
    routingControls: {},
    routeCache: {}, // 🚀 NEU: Route-Cache
    pendingMapUpdates: [], // 🚀 NEU: Batch-Updates

    initialize() {
        console.log('🚑 Vehicle Movement System v5.0 initialisiert');
        console.log('✅ Alle Bugs gefixt');
        this.startUpdateLoop();
    },

    startUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            this.updateAllVehicles();
            this.processBatchMapUpdates(); // 🚀 Batch-Update
        }, this.UPDATE_INTERVAL_MS);
    },

    // 🚀 FIX #1, #2, #4, #7: Komplett überarbeitete dispatchVehicle Methode
    async dispatchVehicle(vehicleId, targetCoords, incidentId, options = {}) {
        const { skipRadio = false, phase = 'to_scene' } = options;
        
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

        // 🚀 FIX #1: Entferne alte Routing Controls (Memory Leak Fix)
        if (this.routingControls[vehicleId]) {
            try {
                map.removeControl(this.routingControls[vehicleId]);
                delete this.routingControls[vehicleId];
                console.log(`🗑️ Alte Route für ${vehicle.callsign} entfernt`);
            } catch (e) {
                console.warn('⚠️ Konnte Routing Control nicht entfernen:', e);
            }
        }

        const startPos = vehicle.position || station.position;
        console.log(`🚑 ${vehicle.callsign} fährt von [${startPos}] nach [${targetCoords.lat}, ${targetCoords.lon}]`);

        vehicle.status = phase === 'to_scene' ? 'dispatched' : phase === 'to_hospital' ? 'transporting' : 'returning';
        vehicle.incident = incidentId;
        vehicle.position = [startPos[0], startPos[1]];
        vehicle.targetLocation = [targetCoords.lat, targetCoords.lon];

        // 🚀 FIX #8: Route-Cache prüfen
        const cacheKey = `${startPos[0]}_${startPos[1]}_${targetCoords.lat}_${targetCoords.lon}`;
        if (this.routeCache[cacheKey]) {
            console.log(`📦 Cache-Hit für Route ${cacheKey.substring(0, 20)}...`);
            const cached = this.routeCache[cacheKey];
            
            this.movingVehicles[vehicleId] = {
                vehicle: vehicle,
                routeCoords: cached.coords,
                currentIndex: 0,
                incidentId: incidentId,
                phase: phase,
                startTime: Date.now(),
                totalTime: cached.time * 1000,
                distanceKm: cached.distance,
                eta: Math.ceil(cached.time / 60)
            };
            
            // 🚀 FIX #4: Nur Funkspruch bei Initial-Alarm
            if (!skipRadio && phase === 'to_scene') {
                const message = `${vehicle.callsign} alarmiert - ${cached.distance} km, ETA ${Math.ceil(cached.time / 60)} min`;
                if (typeof addRadioMessage === 'function') {
                    addRadioMessage(message, 'dispatcher', '#17a2b8');
                }
            }
            return;
        }

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
                show: false,
                createMarker: () => null,
                lineOptions: {
                    styles: [
                        { color: phase === 'returning' ? '#28a745' : '#17a2b8', weight: 4, opacity: 0.8, dashArray: '10, 5' }
                    ]
                },
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1'
                })
            })
            .on('routesfound', (e) => {
                const route = e.routes[0];
                const distanceKm = (route.summary.totalDistance / 1000).toFixed(1);
                const timeMin = Math.ceil(route.summary.totalTime / 60);
                
                console.log(`✅ Route berechnet: ${distanceKm} km, ETA ${timeMin} min`);
                
                // 🚀 FIX #8: Route cachen
                const routeCoords = route.coordinates.map(c => ({ lat: c.lat, lon: c.lng }));
                this.routeCache[cacheKey] = {
                    coords: routeCoords,
                    distance: distanceKm,
                    time: route.summary.totalTime
                };
                
                // 🚀 FIX #4: Nur Funkspruch bei Initial-Alarm
                if (!skipRadio && phase === 'to_scene') {
                    const message = `${vehicle.callsign} alarmiert - ${distanceKm} km, ETA ${timeMin} min`;
                    if (typeof addRadioMessage === 'function') {
                        addRadioMessage(message, 'dispatcher', '#17a2b8');
                    }
                }
                
                this.movingVehicles[vehicleId] = {
                    vehicle: vehicle,
                    routeCoords: routeCoords,
                    currentIndex: 0,
                    incidentId: incidentId,
                    phase: phase,
                    startTime: Date.now(),
                    totalTime: route.summary.totalTime * 1000,
                    distanceKm: distanceKm,
                    eta: timeMin
                };
            })
            // 🚀 FIX #7: Routing Error Handler
            .on('routingerror', (e) => {
                console.error('❌ Routing Error:', e.error);
                console.log('🔄 Fallback zu Luftlinie');
                
                // Fallback zu Luftlinie
                this.dispatchVehicleFallback(vehicle, startPos, targetCoords, incidentId, phase);
            })
            .addTo(map);
            
            this.routingControls[vehicleId] = routingControl;
            
        } else {
            console.warn('⚠️ Leaflet Routing Machine nicht verfügbar, nutze Luftlinie');
            this.dispatchVehicleFallback(vehicle, startPos, targetCoords, incidentId, phase);
        }
    },

    // Fallback ohne Routing
    dispatchVehicleFallback(vehicle, startPos, targetCoords, incidentId, phase = 'to_scene') {
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
            phase: phase,
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

        // Route-basierte Bewegung
        if (movement.routeCoords) {
            const elapsed = Date.now() - movement.startTime;
            const progress = Math.min(elapsed / movement.totalTime, 1);
            
            const targetIndex = Math.floor(progress * (movement.routeCoords.length - 1));
            movement.currentIndex = targetIndex;
            
            if (targetIndex < movement.routeCoords.length) {
                const coord = movement.routeCoords[targetIndex];
                vehicle.position = [coord.lat, coord.lon];
            }
            
            // 🚀 FIX #9: Batch Map Update
            this.pendingMapUpdates.push(vehicle);
            
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

            this.pendingMapUpdates.push(vehicle);

            if (progress >= 1) {
                this.handleArrival(vehicleId);
            }
        }
    },

    // 🚀 FIX #9: Batch Map Updates (Performance)
    processBatchMapUpdates() {
        if (this.pendingMapUpdates.length === 0) return;
        
        if (typeof updateVehicleOnMap === 'function') {
            this.pendingMapUpdates.forEach(vehicle => {
                updateVehicleOnMap(vehicle);
            });
        }
        
        this.pendingMapUpdates = [];
    },

    handleArrival(vehicleId) {
        const movement = this.movingVehicles[vehicleId];
        if (!movement) return;

        const { vehicle, phase } = movement;
        
        // Anti-Spam
        const arrivalKey = `${vehicleId}_${phase}`;
        if (this.arrivalReported[arrivalKey]) {
            return;
        }
        this.arrivalReported[arrivalKey] = true;

        console.log(`✅ ${vehicle.callsign} angekommen (Phase: ${phase})`);

        // 🚀 FIX #12: Cleanup Routing Control bei Ankunft
        if (this.routingControls[vehicleId]) {
            try {
                map.removeControl(this.routingControls[vehicleId]);
                delete this.routingControls[vehicleId];
            } catch (e) {
                console.warn('⚠️ Konnte Routing Control nicht entfernen:', e);
            }
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
                
                // Cleanup arrival flags
                delete this.arrivalReported[`${vehicleId}_to_scene`];
                delete this.arrivalReported[`${vehicleId}_to_hospital`];
                delete this.arrivalReported[`${vehicleId}_returning`];

                if (typeof clearVehicleRoute === 'function') {
                    clearVehicleRoute(vehicleId);
                }
                break;
        }
    },

    // 🚀 FIX #2, #4: Verbesserte startTransport (kein neuer Funkspruch)
    startTransport(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        this.setVehicleStatus(vehicle, 7, true);
        vehicle.status = 'transporting';

        const hospitalCoords = this.findNearestHospital(vehicle.position);
        console.log(`🏥 ${vehicle.callsign} fährt ins Krankenhaus`);

        // 🚀 FIX: skipRadio = true, phase = 'to_hospital'
        this.dispatchVehicle(vehicleId, { lat: hospitalCoords[0], lon: hospitalCoords[1] }, vehicle.incident, {
            skipRadio: true,
            phase: 'to_hospital'
        });
    },

    // 🚀 FIX #2, #4: Verbesserte returnToStation (kein neuer Funkspruch)
    returnToStation(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        this.setVehicleStatus(vehicle, 1, true);
        vehicle.status = 'returning';

        const station = STATIONS[vehicle.station];
        if (!station) return;

        console.log(`🏠 ${vehicle.callsign} kehrt zur Wache zurück`);

        // 🚀 FIX: skipRadio = true, phase = 'returning'
        this.dispatchVehicle(vehicleId, { lat: station.position[0], lon: station.position[1] }, vehicle.incident, {
            skipRadio: true,
            phase: 'returning'
        });
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