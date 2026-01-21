// =========================
// VEHICLE MOVEMENT SYSTEM v5.1
// + 130% Speed bei Sondersignal
// + Memory Leak Fix
// + Route-Caching
// + Routing Error Handler
// + Anti-Spam für Funksprüche
// + Batch Map Updates
// =========================

const VehicleMovement = {
    movingVehicles: {},
    updateInterval: null,
    SPEED_KMH: 60, // Basis-Geschwindigkeit
    EMERGENCY_SPEED_MULTIPLIER: 1.3, // 🚨 NEU: 30% schneller bei Sondersignal
    UPDATE_INTERVAL_MS: 100,
    lastStatusReports: {},
    arrivalReported: {},
    routingControls: {},
    routeCache: {},
    pendingMapUpdates: [],

    initialize() {
        console.log('🚑 Vehicle Movement System v5.1 initialisiert');
        console.log('✅ Alle Bugs gefixt');
        console.log('🚨 Sondersignal: 130% Geschwindigkeit');
        this.startUpdateLoop();
    },

    startUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            this.updateAllVehicles();
            this.processBatchMapUpdates();
        }, this.UPDATE_INTERVAL_MS);
    },

    // 🚨 NEU: Berechne aktuelle Geschwindigkeit basierend auf Phase
    getSpeedForPhase(phase) {
        // Sondersignal bei: to_scene (FMS 3) und to_hospital (FMS 7)
        if (phase === 'to_scene' || phase === 'to_hospital') {
            return this.SPEED_KMH * this.EMERGENCY_SPEED_MULTIPLIER;
        }
        // Normale Fahrt bei returning (FMS 1)
        return this.SPEED_KMH;
    },

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

        // Entferne alte Routing Controls (Memory Leak Fix)
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
        const speedKmh = this.getSpeedForPhase(phase);
        const speedIcon = phase === 'returning' ? '🏠' : '🚨';
        
        console.log(`${speedIcon} ${vehicle.callsign} fährt von [${startPos}] nach [${targetCoords.lat}, ${targetCoords.lon}] mit ${speedKmh} km/h`);

        vehicle.status = phase === 'to_scene' ? 'dispatched' : phase === 'to_hospital' ? 'transporting' : 'returning';
        vehicle.incident = incidentId;
        vehicle.position = [startPos[0], startPos[1]];
        vehicle.targetLocation = [targetCoords.lat, targetCoords.lon];

        // Route-Cache prüfen
        const cacheKey = `${startPos[0]}_${startPos[1]}_${targetCoords.lat}_${targetCoords.lon}_${phase}`;
        if (this.routeCache[cacheKey]) {
            console.log(`📦 Cache-Hit für Route ${cacheKey.substring(0, 20)}...`);
            const cached = this.routeCache[cacheKey];
            
            // 🚨 NEU: Berechne Zeit mit aktueller Geschwindigkeit
            const adjustedTime = (cached.time * 1000) / this.EMERGENCY_SPEED_MULTIPLIER;
            const adjustedEta = Math.ceil(cached.time / 60 / this.EMERGENCY_SPEED_MULTIPLIER);
            
            this.movingVehicles[vehicleId] = {
                vehicle: vehicle,
                routeCoords: cached.coords,
                currentIndex: 0,
                incidentId: incidentId,
                phase: phase,
                startTime: Date.now(),
                totalTime: phase === 'returning' ? cached.time * 1000 : adjustedTime,
                distanceKm: cached.distance,
                eta: phase === 'returning' ? Math.ceil(cached.time / 60) : adjustedEta
            };
            
            if (!skipRadio && phase === 'to_scene') {
                const message = `${vehicle.callsign} alarmiert - ${cached.distance} km, ETA ${adjustedEta} min (Sondersignal)`;
                if (typeof addRadioMessage === 'function') {
                    addRadioMessage(message, 'dispatcher', '#17a2b8');
                }
            }
            return;
        }

        // ROUTING MIT LEAFLET ROUTING MACHINE
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
                        { 
                            color: phase === 'returning' ? '#28a745' : '#dc3545', // Rot bei Sondersignal
                            weight: phase === 'returning' ? 3 : 5, // Dicker bei Sondersignal
                            opacity: 0.8, 
                            dashArray: phase === 'returning' ? '10, 5' : '5, 10' // Anderes Muster
                        }
                    ]
                },
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1'
                })
            })
            .on('routesfound', (e) => {
                const route = e.routes[0];
                const distanceKm = (route.summary.totalDistance / 1000).toFixed(1);
                
                // 🚨 NEU: ETA mit Geschwindigkeits-Multiplikator
                const baseTimeMin = Math.ceil(route.summary.totalTime / 60);
                const adjustedTimeMin = phase === 'returning' ? baseTimeMin : Math.ceil(baseTimeMin / this.EMERGENCY_SPEED_MULTIPLIER);
                
                console.log(`✅ Route berechnet: ${distanceKm} km, ETA ${adjustedTimeMin} min ${phase === 'returning' ? '' : '(Sondersignal)'}`);
                
                // Route cachen
                const routeCoords = route.coordinates.map(c => ({ lat: c.lat, lon: c.lng }));
                this.routeCache[cacheKey] = {
                    coords: routeCoords,
                    distance: distanceKm,
                    time: route.summary.totalTime
                };
                
                if (!skipRadio && phase === 'to_scene') {
                    const message = `${vehicle.callsign} alarmiert - ${distanceKm} km, ETA ${adjustedTimeMin} min (Sondersignal)`;
                    if (typeof addRadioMessage === 'function') {
                        addRadioMessage(message, 'dispatcher', '#17a2b8');
                    }
                }
                
                // 🚨 NEU: totalTime mit Geschwindigkeits-Multiplikator
                const adjustedTotalTime = phase === 'returning' ? 
                    route.summary.totalTime * 1000 : 
                    (route.summary.totalTime * 1000) / this.EMERGENCY_SPEED_MULTIPLIER;
                
                this.movingVehicles[vehicleId] = {
                    vehicle: vehicle,
                    routeCoords: routeCoords,
                    currentIndex: 0,
                    incidentId: incidentId,
                    phase: phase,
                    startTime: Date.now(),
                    totalTime: adjustedTotalTime,
                    distanceKm: distanceKm,
                    eta: adjustedTimeMin
                };
            })
            .on('routingerror', (e) => {
                console.error('❌ Routing Error:', e.error);
                console.log('🔄 Fallback zu Luftlinie');
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

        const eta = this.calculateETA(startPos, [targetCoords.lat, targetCoords.lon], phase);
        
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

    // 🚨 NEU: calculateETA mit Phase-Parameter
    calculateETA(from, to, phase = 'to_scene') {
        const distance = this.calculateDistance(from[0], from[1], to[0], to[1]);
        const speed = this.getSpeedForPhase(phase);
        const timeHours = distance / speed;
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
            
            this.pendingMapUpdates.push(vehicle);
            
            if (progress >= 1) {
                this.handleArrival(vehicleId);
            }
        } else {
            // Fallback: Luftlinie mit Geschwindigkeits-Multiplikator
            const { start, target, phase } = movement;
            const totalDistance = this.calculateDistance(start.lat, start.lon, target.lat, target.lon);
            const timeElapsed = (Date.now() - movement.startTime) / 1000;
            const speed = this.getSpeedForPhase(phase);
            const distanceTraveled = (speed / 3600) * timeElapsed;

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

        // Cleanup Routing Control bei Ankunft
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

    startTransport(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        this.setVehicleStatus(vehicle, 7, true);
        vehicle.status = 'transporting';

        const hospitalCoords = this.findNearestHospital(vehicle.position);
        console.log(`🏥 ${vehicle.callsign} fährt ins Krankenhaus`);

        this.dispatchVehicle(vehicleId, { lat: hospitalCoords[0], lon: hospitalCoords[1] }, vehicle.incident, {
            skipRadio: true,
            phase: 'to_hospital'
        });
    },

    returnToStation(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        this.setVehicleStatus(vehicle, 1, true);
        vehicle.status = 'returning';

        const station = STATIONS[vehicle.station];
        if (!station) return;

        console.log(`🏠 ${vehicle.callsign} kehrt zur Wache zurück`);

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

    // 🚨 NEU: getDistanceToIncident berücksichtigt jetzt Sondersignal
    getDistanceToIncident(vehicleStation, incidentCoords) {
        const station = STATIONS[vehicleStation];
        if (!station) return null;
        
        const distance = this.calculateDistance(
            station.position[0],
            station.position[1],
            incidentCoords.lat,
            incidentCoords.lon
        );
        
        // ETA mit Sondersignal (30% schneller)
        const eta = this.calculateETA(station.position, [incidentCoords.lat, incidentCoords.lon], 'to_scene');
        
        return {
            km: distance.toFixed(1),
            eta: eta
        };
    }
};

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        VehicleMovement.initialize();
    });
}