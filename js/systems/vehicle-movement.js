// =========================
// VEHICLE MOVEMENT SYSTEM v7.5.2 - OLDSTATUS PARAMETER FIX
// + SMOOTH POSITION INTERPOLATION
// + 10 Sekunden Ausrückzeit
// + ✅ Routen verschwinden hinter Fahrzeugen (FIXED)
// + NEF bleibt am Einsatzort, nur RTW fährt ins KH
// + RTW ohne Wartezeit am Einsatzort
// + 130% Speed bei Sondersignal
// + ✅ PHASE 3.1: Alarmierungs-Meldungen entfernt, FMS-Updates gefixt
// + ✅ PHASE 3.2: Automatischer FMS-Wechsel nach Einsatzende
// + ✅ PHASE 3.2.1: Intelligente Maßnahmendauer je Einsatztyp
// + ✅ PHASE 3.2.2: Groq AI für dynamische Maßnahmendauer
// + ✅ FIX v7.2.1: Sichere FMS_STATUS Prüfung
// + ✅✅✅ PHASE 3.1.1 v7.3: SMART UPDATE LOOP (-30% CPU idle, -10% active!)
// + 📻 v7.4: Nutzt unified-status-system.js für Chat-Logging
// + 🐛 FIX v7.4.1: Memory Leak in arrivalReported & onSceneTimers behoben
// + 🐛 FIX v7.4.2: Robuste API-Fehlerbehandlung mit Retry-Logik
// + 🔥 FIX v7.5.0: ENTFERNT vehicle.status - NUR currentStatus!
// + 🔥 FIX v7.5.1: Status-Logging IMMER ausführen, auch wenn Status gleich!
// + 🔥 FIX v7.5.2: Übergebe oldStatus EXPLIZIT an changeVehicleStatus()!
// =========================

const VehicleMovement = {
    movingVehicles: {},
    updateInterval: null,
    SPEED_KMH: 60,
    EMERGENCY_SPEED_MULTIPLIER: 1.3,
    UPDATE_INTERVAL_MS: 100,
    DISPATCH_DELAY_MS: 10000,
    lastStatusReports: {},
    arrivalReported: {},
    routingControls: {},
    routeCache: new Map(),
    MAX_CACHE_SIZE: 100,
    pendingMapUpdates: [],
    activeRouteLines: {},
    onSceneTimers: {},
    
    isLoopActive: false,
    idleCheckInterval: null,
    IDLE_CHECK_INTERVAL_MS: 5000,
    lastUpdateCount: 0,

    TREATMENT_TIMES: {
        'RTW': { min: 180, max: 480 },
        'NEF': { min: 300, max: 720 },
        'KTW': { min: 120, max: 300 },
        'Kdow': { min: 240, max: 420 },
        'GW-San': { min: 180, max: 360 }
    },

    INCIDENT_TREATMENT_TIMES: {
        'herzinfarkt': { min: 480, max: 900 },
        'herz': { min: 420, max: 780 },
        'cardiac': { min: 480, max: 900 },
        'reanimation': { min: 900, max: 1800 },
        'bewusstlos': { min: 360, max: 720 },
        'schlaganfall': { min: 360, max: 720 },
        'stroke': { min: 360, max: 720 },
        'krampfanfall': { min: 300, max: 600 },
        'verkehrsunfall': { min: 300, max: 600 },
        'vu p': { min: 900, max: 1500 },
        'eingeklemmt': { min: 900, max: 1500 },
        'sturz': { min: 240, max: 480 },
        'fraktur': { min: 300, max: 540 },
        'verletzung': { min: 240, max: 420 },
        'atemnot': { min: 300, max: 600 },
        'asthma': { min: 240, max: 480 },
        'erstickung': { min: 420, max: 780 },
        'bauchschmerzen': { min: 180, max: 420 },
        'übelkeit': { min: 120, max: 300 },
        'fieber': { min: 180, max: 360 },
        'diabetes': { min: 240, max: 480 },
        'vergiftung': { min: 300, max: 600 },
        'verbrennung': { min: 360, max: 660 },
        'blutung': { min: 300, max: 540 },
        'rd 1': { min: 180, max: 420 },
        'rd 2': { min: 360, max: 720 },
        'rd 3': { min: 480, max: 900 },
        'vu': { min: 300, max: 600 },
    },

    initialize() {
        console.log('🚑 Vehicle Movement System v7.5.2 initialisiert');
        console.log('✅ Smooth Position Interpolation');
        console.log('✅ Ausrückzeit: 10 Sekunden');
        console.log('✅ Routen verschwinden hinter Fahrzeugen');
        console.log('✅ NEF bleibt am Einsatzort');
        console.log('✅ RTW ohne Wartezeit');
        console.log('✅ Phase 3.1: Alarmierungs-Meldungen entfernt, FMS-Updates gefixt');
        console.log('✅ Phase 3.2: Automatischer FMS-Wechsel nach Einsatzende');
        console.log('✅ Phase 3.2.1: Intelligente Maßnahmendauer je Einsatztyp');
        console.log('✅ Phase 3.2.2: Groq AI für dynamische Maßnahmendauer');
        console.log('✅ FIX v7.2.1: Sichere FMS_STATUS Prüfung');
        console.log('✅✅✅ PHASE 3.1.1 v7.3: SMART UPDATE LOOP - Schläft wenn idle!');
        console.log('📻 v7.4: Nutzt unified-status-system.js für Chat-Logging!');
        console.log('🐛 FIX v7.4.1: Memory Leak behoben - arrivalReported & onSceneTimers cleanup!');
        console.log('🐛 FIX v7.4.2: Robuste API-Fehlerbehandlung mit Retry & Timeout!');
        console.log('🔥 FIX v7.5.0: ENTFERNT vehicle.status - NUR currentStatus!');
        console.log('🔥 FIX v7.5.1: Status-Logging IMMER ausführen - kein verschlucken mehr!');
        console.log('🔥 FIX v7.5.2: Übergebe oldStatus EXPLIZIT an changeVehicleStatus()!');
        
        this.startIdleCheck();
    },

    startIdleCheck() {
        if (this.idleCheckInterval) {
            clearInterval(this.idleCheckInterval);
        }
        
        console.log(`💤 Smart Idle Check gestartet (prüft alle ${this.IDLE_CHECK_INTERVAL_MS/1000}s)`);
        
        this.idleCheckInterval = setInterval(() => {
            const vehicleCount = Object.keys(this.movingVehicles).length;
            const timerCount = Object.keys(this.onSceneTimers).length;
            const hasPendingUpdates = this.pendingMapUpdates.length > 0;
            
            const needsLoop = vehicleCount > 0 || timerCount > 0 || hasPendingUpdates;
            
            if (needsLoop && !this.isLoopActive) {
                console.log(`⚡ Smart Loop: AKTIVIERE (${vehicleCount} Fahrzeuge fahren, ${timerCount} Timer)`);
                this.startUpdateLoop();
            } else if (!needsLoop && this.isLoopActive) {
                console.log(`💤 Smart Loop: DEAKTIVIERE (idle - keine Aktivität)`);
                this.stopUpdateLoop();
            }
            
            if (Date.now() % 30000 < this.IDLE_CHECK_INTERVAL_MS) {
                console.log(`📊 Smart Loop Status: ${this.isLoopActive ? 'AKTIV' : 'IDLE'} | Fahrzeuge: ${vehicleCount} | Timer: ${timerCount}`);
            }
        }, this.IDLE_CHECK_INTERVAL_MS);
    },

    startUpdateLoop() {
        if (this.updateInterval) {
            return;
        }
        
        this.isLoopActive = true;
        this.lastUpdateCount = 0;
        
        this.updateInterval = setInterval(() => {
            this.updateAllVehicles();
            this.processBatchMapUpdates();
            this.lastUpdateCount++;
            
            if (this.lastUpdateCount > 10 && 
                Object.keys(this.movingVehicles).length === 0 && 
                Object.keys(this.onSceneTimers).length === 0 &&
                this.pendingMapUpdates.length === 0) {
                console.log('💤 Smart Loop: Auto-Stop (10 leere Updates)');
                this.stopUpdateLoop();
            }
        }, this.UPDATE_INTERVAL_MS);
        
        console.log(`⚡ Update Loop GESTARTET (${this.UPDATE_INTERVAL_MS}ms Intervall)`);
    },
    
    stopUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            this.isLoopActive = false;
            console.log('🛑 Update Loop GESTOPPT (idle)');
        }
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

        if (phase === 'to_scene') {
            console.log(`⏱️ ${vehicle.callsign} - Ausrückzeit 10s...`);
            // 🔥 NUR currentStatus verwenden!
            this.setVehicleStatus(vehicle, 3);
            
            if (!this.isLoopActive) {
                this.startUpdateLoop();
            }
            
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

        // 🔥 KEIN vehicle.status mehr!
        vehicle.incident = incidentId;
        vehicle.position = [startPos[0], startPos[1]];
        vehicle.targetLocation = [targetCoords.lat, targetCoords.lon];

        const cacheKey = `${startPos[0]}_${startPos[1]}_${targetCoords.lat}_${targetCoords.lon}_${phase}`;
        if (this.routeCache.has(cacheKey)) {
            console.log(`📦 Cache-Hit für Route`);
            const cached = this.routeCache.get(cacheKey);
            
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
            
            this.createInitialRouteLine(vehicleId, cached.coords, phase);
            
            if (!this.isLoopActive) {
                this.startUpdateLoop();
            }
            
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
                
                this.addToCache(cacheKey, {
                    coords: routeCoords,
                    distance: distanceKm,
                    time: route.summary.totalTime
                });
                
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
                
                this.createInitialRouteLine(vehicleId, routeCoords, phase);
                
                if (!this.isLoopActive) {
                    this.startUpdateLoop();
                }
            })
            .on('routingerror', (e) => {
                console.error('❌ Routing Error:', e.error);
                console.log('🔄 Fallback zu Luftlinie');
                this.dispatchVehicleFallback(vehicle, startPos, targetCoords, incidentId, phase);
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
    
    addToCache(key, value) {
        if (this.routeCache.size >= this.MAX_CACHE_SIZE) {
            const firstKey = this.routeCache.keys().next().value;
            this.routeCache.delete(firstKey);
            console.log(`🗑️ Cache-Cleanup: Ältester Eintrag entfernt (${this.routeCache.size}/${this.MAX_CACHE_SIZE})`);
        }
        
        this.routeCache.set(key, value);
    },

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
        
        if (!this.isLoopActive) {
            this.startUpdateLoop();
        }
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
        if (Object.keys(this.movingVehicles).length === 0) {
            return;
        }
        
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

    updateRouteBehindVehicle(vehicleId, currentIndex) {
        const routeLine = this.activeRouteLines[vehicleId];
        const movement = this.movingVehicles[vehicleId];
        
        if (!routeLine || !movement || !movement.routeCoords) return;
        
        const remainingCoords = movement.routeCoords.slice(currentIndex);
        
        if (remainingCoords.length < 2) return;
        
        const latLngs = remainingCoords.map(c => [c.lat, c.lon]);
        routeLine.setLatLngs(latLngs);
    },

    removeVehicleRoute(vehicleId) {
        if (this.routingControls[vehicleId]) {
            try {
                map.removeControl(this.routingControls[vehicleId]);
                delete this.routingControls[vehicleId];
            } catch (e) {
                console.warn('⚠️ Konnte Routing Control nicht entfernen:', e);
            }
        }
        
        if (this.activeRouteLines[vehicleId]) {
            try {
                map.removeLayer(this.activeRouteLines[vehicleId]);
                delete this.activeRouteLines[vehicleId];
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
                delete this.movingVehicles[vehicleId];

                this.startTreatmentTimer(vehicleId);
                break;

            case 'to_hospital':
                this.setVehicleStatus(vehicle, 8);
                delete this.movingVehicles[vehicleId];

                setTimeout(() => {
                    this.returnToStation(vehicleId);
                }, 5 * 60 * 1000);
                break;

            case 'returning':
                this.setVehicleStatus(vehicle, 2);
                vehicle.targetLocation = null;
                vehicle.incident = null;
                delete this.movingVehicles[vehicleId];
                
                // 🐛 FIX: Memory Leak - Cleanup arrivalReported Keys
                delete this.arrivalReported[`${vehicleId}_to_scene`];
                delete this.arrivalReported[`${vehicleId}_to_hospital`];
                delete this.arrivalReported[`${vehicleId}_returning`];
                console.log(`🗑️ Cleanup: arrivalReported Keys für ${vehicle.callsign} entfernt`);
                
                // 🐛 FIX: Cleanup onSceneTimers falls noch vorhanden
                if (this.onSceneTimers[vehicleId]) {
                    clearTimeout(this.onSceneTimers[vehicleId]);
                    delete this.onSceneTimers[vehicleId];
                    console.log(`🗑️ Cleanup: onSceneTimer für ${vehicle.callsign} entfernt`);
                }

                if (typeof clearVehicleRoute === 'function') {
                    clearVehicleRoute(vehicleId);
                }
                break;
        }
    },

    async startTreatmentTimer(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const incident = GAME_DATA.incidents.find(i => 
            (i.assignedVehicles && i.assignedVehicles.includes(vehicleId)) ||
            (i.vehicles && i.vehicles.includes(vehicleId))
        );

        let treatmentTime = this.TREATMENT_TIMES[vehicle.type] || this.TREATMENT_TIMES['RTW'];
        let timeSource = `Fahrzeugtyp ${vehicle.type}`;

        if (incident) {
            console.log(`🤖 Starte Groq AI Analyse für Einsatz: ${incident.stichwort}`);
            
            const aiTime = await this.calculateTreatmentTimeWithAI(incident, vehicle);
            
            if (aiTime) {
                treatmentTime = aiTime.time;
                timeSource = aiTime.reason;
                console.log(`✅ Groq AI Ergebnis: ${aiTime.time.min/60}-${aiTime.time.max/60} Min`);
                console.log(`📝 Begründung: ${aiTime.reason}`);
            } else {
                console.log(`⚠️ Groq AI nicht verfügbar, nutze Keyword-Matching`);
                
                const keyword = (incident.stichwort || incident.keyword || '').toLowerCase();
                const description = (incident.meldebild || incident.description || '').toLowerCase();
                const combined = `${keyword} ${description}`;

                for (const [key, times] of Object.entries(this.INCIDENT_TREATMENT_TIMES)) {
                    if (combined.includes(key)) {
                        treatmentTime = times;
                        timeSource = `Einsatztyp "${key}"`;
                        break;
                    }
                }

                if (incident.schweregrad) {
                    const severity = incident.schweregrad.toLowerCase();
                    if (severity === 'schwer' || severity === 'kritisch') {
                        treatmentTime = {
                            min: Math.floor(treatmentTime.min * 1.3),
                            max: Math.floor(treatmentTime.max * 1.3)
                        };
                        timeSource += ` (${severity} +30%)`;
                    } else if (severity === 'leicht') {
                        treatmentTime = {
                            min: Math.floor(treatmentTime.min * 0.7),
                            max: Math.floor(treatmentTime.max * 0.7)
                        };
                        timeSource += ` (${severity} -30%)`;
                    }
                }
            }
        }
        
        const randomTime = Math.floor(
            Math.random() * (treatmentTime.max - treatmentTime.min) + treatmentTime.min
        );
        
        const timeInMinutes = (randomTime / 60).toFixed(1);
        
        console.log(`⏱️ ${vehicle.callsign} - Maßnahmen: ${timeInMinutes} Min (${timeSource})`);
        
        this.onSceneTimers[vehicleId] = setTimeout(() => {
            this.completeTreatment(vehicleId);
        }, randomTime * 1000);
        
        if (!this.isLoopActive) {
            this.startUpdateLoop();
        }
    },

    async calculateTreatmentTimeWithAI(incident, vehicle, retryCount = 0) {
        const MAX_RETRIES = 2;
        const RETRY_DELAY_MS = 1000;
        const API_TIMEOUT_MS = 10000;
        
        const apiKey = localStorage.getItem('groqApiKey');
        if (!apiKey) {
            console.log('ℹ️ Kein Groq API Key - nutze Fallback-Zeiten');
            return null;
        }

        try {
            const incidentInfo = {
                stichwort: incident.stichwort || incident.keyword || 'Unbekannt',
                meldebild: incident.meldebild || incident.description || 'Keine Details',
                schweregrad: incident.schweregrad || 'mittel',
                alter: incident.alter || incident.patient_age || 'unbekannt',
                geschlecht: incident.geschlecht || 'unbekannt',
                vitalzeichen: incident.vitalzeichen || {},
                symptome: incident.symptome || [],
                besonderheiten: incident.besonderheiten || 'keine',
                anzahl_patienten: incident.anzahl_patienten || 1,
                fahrzeugtyp: vehicle.type
            };

            const prompt = `Du bist ein erfahrener Notfallmediziner. Analysiere folgenden Rettungsdienst-Einsatz und bestimme die realistische Behandlungsdauer VOR ORT (nicht Transport!).

Einsatzdaten:
- Stichwort: ${incidentInfo.stichwort}
- Meldebild: ${incidentInfo.meldebild}
- Schweregrad: ${incidentInfo.schweregrad}
- Patient: ${incidentInfo.alter} Jahre, ${incidentInfo.geschlecht}
- Vitalzeichen: ${JSON.stringify(incidentInfo.vitalzeichen)}
- Symptome: ${incidentInfo.symptome.join(', ') || 'keine Angabe'}
- Besonderheiten: ${incidentInfo.besonderheiten}
- Anzahl Patienten: ${incidentInfo.anzahl_patienten}
- Fahrzeugtyp: ${incidentInfo.fahrzeugtyp}

Berücksichtige:
- Anamnese-Erhebung
- Vitalzeichen-Kontrolle
- Diagnostik vor Ort
- Stabilisierungsmaßnahmen
- Vorbereitung für Transport
- Dokumentation

Antworte NUR im folgenden JSON-Format (ohne Markdown!):
{
  "min_minuten": <Zahl>,
  "max_minuten": <Zahl>,
  "begruendung": "<Kurze medizinische Begründung>"
}`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: 'Du bist ein Notfallmediziner der realistische Behandlungszeiten bestimmt. Antworte NUR mit JSON, ohne Markdown!' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 300
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.error?.message || response.statusText;
                
                if (response.status === 401) {
                    console.error('❌ Ungültiger Groq API Key!');
                    this.notifyUser('⚠️ Groq API Key ungültig - bitte in Einstellungen prüfen', 'error');
                    return null;
                }
                
                if (response.status === 429) {
                    console.warn('⚠️ Groq Rate Limit erreicht');
                    if (retryCount < MAX_RETRIES) {
                        const delay = RETRY_DELAY_MS * (retryCount + 1);
                        console.log(`🔄 Retry ${retryCount + 1}/${MAX_RETRIES} in ${delay}ms...`);
                        await this.sleep(delay);
                        return this.calculateTreatmentTimeWithAI(incident, vehicle, retryCount + 1);
                    }
                }
                
                throw new Error(`API Error ${response.status}: ${errorMsg}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content.trim();

            let cleanContent = content;
            if (content.includes('```')) {
                cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            }

            const result = JSON.parse(cleanContent);

            return {
                time: {
                    min: result.min_minuten * 60,
                    max: result.max_minuten * 60
                },
                reason: `AI: ${result.begruendung}`
            };

        } catch (error) {
            if (error.name === 'AbortError') {
                console.error(`❌ Groq API Timeout (${API_TIMEOUT_MS/1000}s)`);
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                console.error('❌ Netzwerkfehler - keine Verbindung zu Groq API');
            } else if (error instanceof SyntaxError) {
                console.error('❌ JSON Parse Fehler - ungültige API-Antwort:', error.message);
            } else {
                console.error('❌ Groq AI Fehler:', error.message || error);
            }
            
            if (retryCount < MAX_RETRIES && !(error instanceof SyntaxError)) {
                const delay = RETRY_DELAY_MS * (retryCount + 1);
                console.log(`🔄 Retry ${retryCount + 1}/${MAX_RETRIES} in ${delay}ms...`);
                await this.sleep(delay);
                return this.calculateTreatmentTimeWithAI(incident, vehicle, retryCount + 1);
            }
            
            if (retryCount >= MAX_RETRIES) {
                this.notifyUser('⚠️ KI-Zeitberechnung fehlgeschlagen - nutze Standardzeiten', 'warning');
            }
            
            return null;
        }
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    notifyUser(message, type = 'info') {
        if (typeof window.notificationSystem !== 'undefined' && window.notificationSystem.show) {
            window.notificationSystem.show(message, type);
        } else {
            const emoji = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
            console.log(`${emoji} [${type.toUpperCase()}] ${message}`);
        }
    },

    completeTreatment(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        console.log(`✅ ${vehicle.callsign} - Maßnahmen abgeschlossen`);
        
        delete this.onSceneTimers[vehicleId];

        if (vehicle.type === 'RTW') {
            console.log(`🏥 ${vehicle.callsign} (RTW) - Transport ins Krankenhaus`);
            this.startTransport(vehicleId);
        } else {
            console.log(`🏠 ${vehicle.callsign} (${vehicle.type}) - Rückfahrt zur Wache`);
            this.returnToStation(vehicleId);
        }
    },

    startTransport(vehicleId) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle || vehicle.type !== 'RTW') return;

        this.setVehicleStatus(vehicle, 7);

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

        const station = STATIONS[vehicle.station];
        if (!station) return;

        console.log(`🏠 ${vehicle.callsign} kehrt zur Wache zurück`);

        this.dispatchVehicle(vehicleId, { lat: station.position[0], lon: station.position[1] }, vehicle.incident, {
            skipRadio: true,
            phase: 'returning'
        });
    },

    findNearestHospital(position) {
        if (typeof HOSPITALS !== 'undefined' && HOSPITALS.length > 0) {
            let nearest = HOSPITALS[0];
            let minDist = this.calculateDistance(position[0], position[1], nearest.location[0], nearest.location[1]);
            
            for (let i = 1; i < HOSPITALS.length; i++) {
                const dist = this.calculateDistance(position[0], position[1], HOSPITALS[i].location[0], HOSPITALS[i].location[1]);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = HOSPITALS[i];
                }
            }
            
            console.log(`🏥 Nächstes Krankenhaus: ${nearest.name}`);
            return nearest.location;
        }
        return [48.8700, 9.3922];
    },

    /**
     * 🔥 v7.5.2 FIX: Übergebe oldStatus EXPLIZIT!
     * DIESE Funktion MUSS für ALLE Status-Änderungen genutzt werden!
     */
    setVehicleStatus(vehicle, fmsCode) {
        // 🔥 FIX v7.5.2: Speichere oldStatus BEVOR vehicle.currentStatus geändert wird!
        const oldStatus = vehicle.currentStatus;
        
        console.log(`🔄 setVehicleStatus: ${vehicle.callsign} ${oldStatus} → ${fmsCode}`);

        // JETZT erst Status ändern
        vehicle.currentStatus = fmsCode;

        // 📻 NUTZE UNIFIED STATUS SYSTEM mit EXPLIZITEM oldStatus!
        if (typeof window.unifiedStatusSystem !== 'undefined' && window.unifiedStatusSystem.changeVehicleStatus) {
            console.log(`📻 Rufe unified-status-system.changeVehicleStatus(${vehicle.id}, ${fmsCode}, ${oldStatus})`);
            // 🔥 Übergebe oldStatus als DRITTEN Parameter!
            window.unifiedStatusSystem.changeVehicleStatus(vehicle.id, fmsCode, oldStatus);
        } else {
            console.warn('⚠️ unified-status-system nicht verfügbar, nutze Fallback');
            
            if (typeof CONFIG !== 'undefined' && CONFIG.FMS_STATUS) {
                const fmsInfo = CONFIG.FMS_STATUS[fmsCode];
                if (fmsInfo && typeof addRadioMessage === 'function') {
                    const message = `${vehicle.callsign} - Status ${fmsCode}: ${fmsInfo.name}`;
                    addRadioMessage(vehicle.callsign, message, 'vehicle', false);
                }
            }
        }

        // UI aktualisieren
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

console.log('✅✅✅ Vehicle Movement System v7.5.2 geladen - OLDSTATUS PARAMETER FIX! 🔥');