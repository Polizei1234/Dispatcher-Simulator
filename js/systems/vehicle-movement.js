// =========================
// VEHICLE MOVEMENT SYSTEM v7.0
// + SMOOTH POSITION INTERPOLATION
// + 10 Sekunden Ausrückzeit
// + ✅ Routen verschwinden hinter Fahrzeugen (FIXED)
// + NEF bleibt am Einsatzort, nur RTW fährt ins KH
// + RTW ohne Wartezeit am Einsatzort
// + 130% Speed bei Sondersignal
// + ✅ PHASE 3.1: Alarmierungs-Meldungen entfernt, FMS-Updates gefixt
// + ✅ PHASE 3.2: Automatischer FMS-Wechsel nach Einsatzende
// =========================

const VehicleMovement = {
    movingVehicles: {},
    updateInterval: null,
    SPEED_KMH: 60,
    EMERGENCY_SPEED_MULTIPLIER: 1.3,
    UPDATE_INTERVAL_MS: 100,
    DISPATCH_DELAY_MS: 10000, // ✅ 10 Sekunden Ausrückzeit
    lastStatusReports: {},
    arrivalReported: {},
    routingControls: {},
    routeCache: {},
    pendingMapUpdates: [],
    activeRouteLines: {}, // ✅ NEU: Speichert die Polylines
    onSceneTimers: {}, // ✅ PHASE 3.2: Timer für Einsatz-Maßnahmen

    // ✅ PHASE 3.2: Maßnahmenzeiten je Fahrzeugtyp (in Sekunden)
    TREATMENT_TIMES: {
        'RTW': { min: 180, max: 480 },      // 3-8 Minuten
        'NEF': { min: 300, max: 720 },      // 5-12 Minuten
        'KTW': { min: 120, max: 300 },      // 2-5 Minuten
        'Kdow': { min: 240, max: 420 },     // 4-7 Minuten
        'GW-San': { min: 180, max: 360 }    // 3-6 Minuten
    },

    initialize() {
        console.log('🚑 Vehicle Movement System v7.0 initialisiert');
        console.log('✅ Smooth Position Interpolation');
        console.log('✅ Ausrückzeit: 10 Sekunden');
        console.log('✅ Routen verschwinden hinter Fahrzeugen');
        console.log('✅ NEF bleibt am Einsatzort');
        console.log('✅ RTW ohne Wartezeit');
        console.log('✅ Phase 3.1: Alarmierungs-Meldungen entfernt, FMS-Updates gefixt');
        console.log('✅ Phase 3.2: Automatischer FMS-Wechsel nach Einsatzende');
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

    getSpeedForPhase(phase) {
        if (phase === 'to_scene' || phase === 'to_hospital') {
            return this.SPEED_KMH * this.EMERGENCY_SPEED_MULTIPLIER;
        }
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

        // ✅ Ausrückzeit nur bei to_scene
        if (phase === 'to_scene') {
            console.log(`⏱️ ${vehicle.callsign} - Ausrückzeit 10s...`);
            vehicle.status = 'preparing';
            
            // ✅ PHASE 3.1 FIX: Status 3 bei Alarmierung
            this.setVehicleStatus(vehicle, 3);
            
            setTimeout(() => {
                this.startDriving(vehicleId, targetCoords, incidentId, options);
            }, this.DISPATCH_DELAY_MS);
        } else {
            this.startDriving(vehicleId, targetCoords, incidentId, options);
        }
    },

    async startDriving(vehicleId, targetCoords, incidentId, options = {}) {
        const { skipRadio = false, phase = 'to_scene' } = options;
        
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const station = STATIONS[vehicle.station];
        if (!station) return;

        this.removeVehicleRoute(vehicleId);

        const startPos = vehicle.position || station.position;
        const speedKmh = this.getSpeedForPhase(phase);
        const speedIcon = phase === 'returning' ? '🏠' : '🚨';
        
        console.log(`${speedIcon} ${vehicle.callsign} fährt los von [${startPos}] nach [${targetCoords.lat}, ${targetCoords.lon}] mit ${speedKmh} km/h`);

        vehicle.status = phase === 'to_scene' ? 'dispatched' : phase === 'to_hospital' ? 'transporting' : 'returning';
        vehicle.incident = incidentId;
        vehicle.position = [startPos[0], startPos[1]];
        vehicle.targetLocation = [targetCoords.lat, targetCoords.lon];

        const cacheKey = `${startPos[0]}_${startPos[1]}_${targetCoords.lat}_${targetCoords.lon}_${phase}`;
        if (this.routeCache[cacheKey]) {
            console.log(`📦 Cache-Hit für Route`);
            const cached = this.routeCache[cacheKey];
            
            const adjustedTime = (cached.time * 1000) / this.EMERGENCY_SPEED_MULTIPLIER;
            const adjustedEta = Math.ceil(cached.time / 60 / this.EMERGENCY_SPEED_MULTIPLIER);
            
            this.movingVehicles[vehicleId] = {
                vehicle: vehicle,
                routeCoords: cached.coords,
                currentIndex: 0,
                currentSegmentProgress: 0,
                incidentId: incidentId,
                phase: phase,
                startTime: Date.now(),
                totalTime: phase === 'returning' ? cached.time * 1000 : adjustedTime,
                distanceKm: cached.distance,
                eta: phase === 'returning' ? Math.ceil(cached.time / 60) : adjustedEta
            };
            
            // ✅ NEU: Erstelle initiale Route-Linie
            this.createInitialRouteLine(vehicleId, cached.coords, phase);
            
            // ✅ PHASE 3.1 FIX: KEINE Alarmierungs-Meldung mehr!
            // if (!skipRadio && phase === 'to_scene') {
            //     const message = `${vehicle.callsign} alarmiert - ${cached.distance} km, ETA ${adjustedEta} min (Sondersignal)`;
            //     if (typeof addRadioMessage === 'function') {
            //         addRadioMessage(message, 'dispatcher', '#17a2b8');
            //     }
            // }
            return;
        }

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
                    styles: []
                },
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1',
                    timeout: 30000
                })
            })
            .on('routesfound', (e) => {
                const route = e.routes[0];
                const distanceKm = (route.summary.totalDistance / 1000).toFixed(1);
                
                const baseTimeMin = Math.ceil(route.summary.totalTime / 60);
                const adjustedTimeMin = phase === 'returning' ? baseTimeMin : Math.ceil(baseTimeMin / this.EMERGENCY_SPEED_MULTIPLIER);
                
                console.log(`✅ Route berechnet: ${distanceKm} km, ETA ${adjustedTimeMin} min ${phase === 'returning' ? '' : '(Sondersignal)'}`);
                
                const routeCoords = route.coordinates.map(c => ({ lat: c.lat, lon: c.lng }));
                this.routeCache[cacheKey] = {
                    coords: routeCoords,
                    distance: distanceKm,
                    time: route.summary.totalTime
                };
                
                // ✅ PHASE 3.1 FIX: KEINE Alarmierungs-Meldung mehr!
                // if (!skipRadio && phase === 'to_scene') {
                //     const message = `${vehicle.callsign} alarmiert - ${distanceKm} km, ETA ${adjustedTimeMin} min (Sondersignal)`;
                //     if (typeof addRadioMessage === 'function') {
                //         addRadioMessage(message, 'dispatcher', '#17a2b8');
                //     }
                // }
                
                const adjustedTotalTime = phase === 'returning' ? 
                    route.summary.totalTime * 1000 : 
                    (route.summary.totalTime * 1000) / this.EMERGENCY_SPEED_MULTIPLIER;
                
                this.movingVehicles[vehicleId] = {
                    vehicle: vehicle,
                    routeCoords: routeCoords,
                    currentIndex: 0,
                    currentSegmentProgress: 0,
                    incidentId: incidentId,
                    phase: phase,
                    startTime: Date.now(),
                    totalTime: adjustedTotalTime,
                    distanceKm: distanceKm,
                    eta: adjustedTimeMin
                };
                
                // ✅ NEU: Erstelle initiale Route-Linie
                this.createInitialRouteLine(vehicleId, routeCoords, phase);
            })
            .on('routingerror', (e) => {
                console.error('❌ Routing Error:', e.error);
                console.log('🔄 Fallback zu Luftlinie');
                this.dispatchVehicleFallback(vehicle, startPos, targetCoords, incidentId, phase);
            })
            .on('routingerror', (e) => {
                if (e.error && e.error.message && e.error.message.includes('timeout')) {
                    console.error('❌ Routing Timeout - Fallback zu Luftlinie');
                    this.dispatchVehicleFallback(vehicle, startPos, targetCoords, incidentId, phase);
                }
            })
            .addTo(map);
            
            this.routingControls[vehicleId] = routingControl;
            
            setTimeout(() => {
                if (!this.movingVehicles[vehicleId]) {
                    console.error('❌ Routing dauert zu lange - Fallback');
                    this.removeVehicleRoute(vehicleId);
                    this.dispatchVehicleFallback(vehicle, startPos, targetCoords, incidentId, phase);
                }
            }, 30000);
            
        } else {
            console.warn('⚠️ Leaflet Routing Machine nicht verfügbar, nutze Luftlinie');
            this.dispatchVehicleFallback(vehicle, startPos, targetCoords, incidentId, phase);
        }
    },

    // ✅ NEU: Erstelle initiale sichtbare Route-Linie
    createInitialRouteLine(vehicleId, routeCoords, phase) {
        if (!map || !routeCoords || routeCoords.length === 0) return;
        
        const color = phase === 'returning' ? '#28a745' : '#dc3545';
        const dashArray = phase === 'returning' ? '10, 5' : '5, 10';
        
        const latLngs = routeCoords.map(c => [c.lat, c.lon]);
        
        const routeLine = L.polyline(latLngs, {
            color: color,
            weight: 4,
            opacity: 0.7,
            dashArray: dashArray
        }).addTo(map);
        
        this.activeRouteLines[vehicleId] = routeLine;
        console.log(`✅ Route-Linie für ${vehicleId} erstellt`);
    },

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

        if (movement.routeCoords) {
            const elapsed = Date.now() - movement.startTime;
            const totalProgress = Math.min(elapsed / movement.totalTime, 1);
            
            const targetIndex = Math.floor(totalProgress * (movement.routeCoords.length - 1));
            
            if (targetIndex >= movement.routeCoords.length - 1) {
                const lastCoord = movement.routeCoords[movement.routeCoords.length - 1];
                vehicle.position = [lastCoord.lat, lastCoord.lon];
                this.pendingMapUpdates.push(vehicle);
                this.handleArrival(vehicleId);
                return;
            }
            
            const segmentProgress = (totalProgress * (movement.routeCoords.length - 1)) - targetIndex;
            
            const currentCoord = movement.routeCoords[targetIndex];
            const nextCoord = movement.routeCoords[targetIndex + 1];
            
            const interpolatedLat = currentCoord.lat + (nextCoord.lat - currentCoord.lat) * segmentProgress;
            const interpolatedLon = currentCoord.lon + (nextCoord.lon - currentCoord.lon) * segmentProgress;
            
            vehicle.position = [interpolatedLat, interpolatedLon];
            movement.currentIndex = targetIndex;
            movement.currentSegmentProgress = segmentProgress;
            
            // ✅ FIXED: Update Route hinter Fahrzeug
            this.updateRouteBehindVehicle(vehicleId, targetIndex);
            this.pendingMapUpdates.push(vehicle);
            
        } else {
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

    // ✅ FIXED: Route wird jetzt dynamisch aktualisiert
    updateRouteBehindVehicle(vehicleId, currentIndex) {
        const routeLine = this.activeRouteLines[vehicleId];
        const movement = this.movingVehicles[vehicleId];
        
        if (!routeLine || !movement || !movement.routeCoords) return;
        
        // Erstelle neue Route nur vom aktuellen Index bis zum Ende
        const remainingCoords = movement.routeCoords.slice(currentIndex);
        
        if (remainingCoords.length < 2) return;
        
        const latLngs = remainingCoords.map(c => [c.lat, c.lon]);
        
        // Update die Polyline mit den verbleibenden Koordinaten
        routeLine.setLatLngs(latLngs);
    },

    removeVehicleRoute(vehicleId) {
        // ✅ Lösche Routing Control
        if (this.routingControls[vehicleId]) {
            try {
                map.removeControl(this.routingControls[vehicleId]);
                delete this.routingControls[vehicleId];
            } catch (e) {
                console.warn('⚠️ Konnte Routing Control nicht entfernen:', e);
            }
        }
        
        // ✅ Lösche aktive Route-Linie
        if (this.activeRouteLines[vehicleId]) {
            try {
                map.removeLayer(this.activeRouteLines[vehicleId]);
                delete this.activeRouteLines[vehicleId];
                console.log(`🗑️ Route-Linie für ${vehicleId} entfernt`);
            } catch (e) {
                console.warn('⚠️ Konnte Route-Linie nicht entfernen:', e);
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
        
        const arrivalKey = `${vehicleId}_${phase}`;
        if (this.arrivalReported[arrivalKey]) {
            return;
        }
        this.arrivalReported[arrivalKey] = true;

        console.log(`✅ ${vehicle.callsign} angekommen (Phase: ${phase})`);

        this.removeVehicleRoute(vehicleId);

        switch (phase) {
            case 'to_scene':
                this.setVehicleStatus(vehicle, 4);
                vehicle.status = 'on-scene';
                delete this.movingVehicles[vehicleId];

                // ✅ PHASE 3.2: Automatische Maßnahmen-Timer
                this.startTreatmentTimer(vehicleId);
                break;

            case 'to_hospital':
                this.setVehicleStatus(vehicle, 8);
                vehicle.status = 'at-hospital';
                delete this.movingVehicles[vehicleId];

                setTimeout(() => {
                    this.returnToStation(vehicleId);
                }, 5 * 60 * 1000);
                break;

            case 'returning':
                this.setVehicleStatus(vehicle, 2);
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

    // ✅ PHASE 3.2: Starte automatischen Maßnahmen-Timer
    startTreatmentTimer(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        // Hole Maßnahmenzeit für Fahrzeugtyp
        const treatmentTime = this.TREATMENT_TIMES[vehicle.type] || this.TREATMENT_TIMES['RTW'];
        
        // Zufällige Zeit im Bereich
        const randomTime = Math.floor(
            Math.random() * (treatmentTime.max - treatmentTime.min) + treatmentTime.min
        );
        
        const timeInMinutes = (randomTime / 60).toFixed(1);
        
        console.log(`⏱️ ${vehicle.callsign} - Maßnahmen starten (${timeInMinutes} Min.)`);
        
        // Timer speichern
        this.onSceneTimers[vehicleId] = setTimeout(() => {
            this.completeTreatment(vehicleId);
        }, randomTime * 1000);
    },

    // ✅ PHASE 3.2: Maßnahmen abgeschlossen
    completeTreatment(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        console.log(`✅ ${vehicle.callsign} - Maßnahmen abgeschlossen`);
        
        delete this.onSceneTimers[vehicleId];

        // Entscheide basierend auf Fahrzeugtyp
        if (vehicle.type === 'RTW') {
            // RTW fährt mit Patient ins Krankenhaus
            console.log(`🏥 ${vehicle.callsign} (RTW) - Transport ins Krankenhaus`);
            this.startTransport(vehicleId);
        } else {
            // NEF, KTW, Kdow, etc. kehren zur Wache zurück
            console.log(`🏠 ${vehicle.callsign} (${vehicle.type}) - Rückfahrt zur Wache`);
            this.returnToStation(vehicleId);
        }
    },

    startTransport(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle || vehicle.type !== 'RTW') return;

        this.setVehicleStatus(vehicle, 7);
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

        this.setVehicleStatus(vehicle, 1);
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
        if (typeof HospitalService !== 'undefined' && typeof HOSPITALS !== 'undefined') {
            const service = new HospitalService();
            const nearest = service.selectNearestHospital(position);
            console.log(`🏥 Nächstes Krankenhaus: ${nearest.name}`);
            return nearest.position;
        }
        return [48.8700, 9.3922];
    },

    // ✅ PHASE 3.1 FIX: Status-Änderungen mit FMS-Farben
    setVehicleStatus(vehicle, fmsCode) {
        const oldStatus = vehicle.currentStatus;
        vehicle.currentStatus = fmsCode;

        // Nur senden wenn Status sich geändert hat
        if (oldStatus === fmsCode) {
            return;
        }

        const fmsInfo = CONFIG.FMS_STATUS[fmsCode];
        if (!fmsInfo) {
            console.warn(`⚠️ Unbekannter FMS-Status: ${fmsCode}`);
            return;
        }

        console.log(`📻 ${vehicle.callsign} - Status ${fmsCode}: ${fmsInfo.name}`);

        // ✅ PHASE 3.1 FIX: Sende mit FMS-Farbe!
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
        
        const eta = this.calculateETA(station.position, [incidentCoords.lat, incidentCoords.lon], 'to_scene');
        
        return {
            km: distance.toFixed(1),
            eta: eta,
            minutes: Math.ceil(eta)
        };
    }
};

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        VehicleMovement.initialize();
    });
}

console.log('✅ Vehicle Movement System v7.0 geladen - Phase 3.2 komplett!');