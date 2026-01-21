// =========================
// SPIEL-LOGIK MIT GROQ AI & NEUES CALL SYSTEM
// =========================

class Game {
    constructor() {
        this.stations = STATIONS;
        this.vehicles = VEHICLES;
        this.incidents = [];
        this.selectedIncident = null;
        this.money = CONFIG.GAME_MODE === 'free' ? 999999999 : 50000;
        this.reputation = 100;
        this.apiKey = null;
        
        // Nutze ZENTRALES Zeitsystem!
        this.nextIncidentGameTime = this.getRandomIncidentInterval();
        
        console.log(`🎮 Game initialisiert | Nächster Einsatz bei ${Math.round(this.nextIncidentGameTime/1000)}s Spielzeit`);
    }
    
    getRandomIncidentInterval() {
        // Neuer Einsatz alle 60-180 Sekunden SPIELZEIT
        const minTime = 60000; // 60 Sekunden
        const maxTime = 180000; // 180 Sekunden (3 Minuten)
        const interval = minTime + Math.random() * (maxTime - minTime);
        
        console.log(`⏱️ Nächster Einsatz in ${Math.round(interval/1000)}s Spielzeit`);
        return interval;
    }
    
    async update() {
        // Nutze ZENTRALES Zeitsystem (window.GameTime)
        const currentGameTime = window.GameTime.elapsed;
        
        // Spawne neue Einsätze wenn Spielzeit erreicht ist
        if (currentGameTime >= this.nextIncidentGameTime) {
            console.log(`🚨 Generiere neuen Anruf... (Spielzeit: ${Math.round(currentGameTime/1000)}s)`);
            
            // NEUE METHODE: Nutze CallSystem statt altes generateIncidentWithAI
            if (typeof CallSystem !== 'undefined') {
                await CallSystem.generateIncomingCall();
            } else {
                // Fallback: Alte Methode
                const ownedVehicles = this.vehicles.filter(v => v.owned);
                const incident = await generateIncidentWithAI(ownedVehicles, this.apiKey);
                
                if (incident) {
                    this.incidents.push(incident);
                    showIncomingCallNotification(incident);
                    addRadioMessage('System', 'Neuer Notruf 112 eingegangen!');
                }
            }
            
            // Setze nächsten Einsatz als absolute Spielzeit
            const nextInterval = this.getRandomIncidentInterval();
            this.nextIncidentGameTime = currentGameTime + nextInterval;
            
            const realTimeUntilNext = nextInterval / window.GameTime.speed;
            console.log(`✅ Nächster Anruf in ${Math.round(nextInterval/1000)}s Spielzeit = ${Math.round(realTimeUntilNext/1000)}s Echtzeit (@${window.GameTime.speed}x)`);
        }
        
        // Update Fahrzeuge
        this.vehicles.forEach(vehicle => {
            if (vehicle.status === 'dispatched' && vehicle.route) {
                this.updateVehiclePosition(vehicle);
            }
        });
        
        // Verdiene Geld für abgeschlossene Einsätze (Karrieremodus)
        if (CONFIG.GAME_MODE === 'career') {
            this.incidents.filter(i => i.status === 'completed' && !i.rewarded).forEach(incident => {
                const reward = this.calculateReward(incident.keyword || incident.stichwort);
                this.money += reward;
                incident.rewarded = true;
                addRadioMessage('System', `€ ${reward} für ${incident.keyword || incident.stichwort} erhalten`);
                document.getElementById('credits').textContent = this.money.toLocaleString();
            });
        }
    }
    
    calculateReward(keyword) {
        const rewards = {
            'RD 1': 500,
            'RD 2': 800,
            'RD 3': 1000,
            'B 1': 300,
            'B 2': 600,
            'B 3': 1200,
            'THL 1': 400,
            'THL 2': 700,
            'VU P': 1000,
            'VU': 600
        };
        return rewards[keyword] || 500;
    }
    
    acceptCall(incidentId) {
        const incident = this.incidents.find(i => i.id === incidentId);
        if (!incident) return;
        
        incident.status = 'in-call';
        
        // Nutze neues CallSystem falls verfügbar
        if (typeof CallSystem !== 'undefined' && CallSystem.activeCall) {
            CallSystem.answerCall();
        } else {
            // Fallback: Alte Methode
            showCallDialog(incident);
        }
    }
    
    checkRequiredVehicles(keyword) {
        const keywordInfo = KEYWORDS_BW[keyword];
        if (!keywordInfo) return { hasAll: true, required: [], missing: [] };
        
        const required = keywordInfo.required || [];
        const owned = this.vehicles.filter(v => v.owned);
        
        const missing = required.filter(reqType => 
            !owned.some(v => v.type === reqType)
        );
        
        return {
            hasAll: missing.length === 0,
            required: required,
            missing: missing
        };
    }
    
    dispatchVehicle(vehicleId, incidentId) {
        const vehicle = this.vehicles.find(v => v.id === vehicleId);
        const incident = this.incidents.find(i => i.id === incidentId);
        
        if (!vehicle || !incident || vehicle.status !== 'available') return;
        
        vehicle.status = 'dispatched';
        vehicle.currentStatus = '3'; // FMS-Status
        vehicle.targetIncident = incidentId;
        
        if (!incident.assignedVehicles) incident.assignedVehicles = [];
        incident.assignedVehicles.push(vehicleId);
        
        const station = this.stations[vehicle.station];
        vehicle.route = this.calculateRoute(station.position, incident.position || incident.koordinaten);
        vehicle.routeIndex = 0;
        
        addRadioMessage('Leitstelle', `${vehicle.callsign} zu ${incident.keyword || incident.stichwort}`);
        addRadioMessage(vehicle.callsign, 'Einsatz übernommen, rücke aus!');
        
        // Benachrichtigung
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.vehicleDispatched(vehicle.name, incident.nummer || incident.id);
        }
    }
    
    calculateRoute(start, end) {
        // start/end können arrays oder objects sein
        const startPos = Array.isArray(start) ? start : [start.lat, start.lon];
        const endPos = Array.isArray(end) ? end : [end.lat, end.lon];
        
        const steps = 30;
        const route = [];
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            route.push([
                startPos[0] + (endPos[0] - startPos[0]) * t,
                startPos[1] + (endPos[1] - startPos[1]) * t
            ]);
        }
        return route;
    }
    
    updateVehiclePosition(vehicle) {
        if (!vehicle.route || vehicle.routeIndex >= vehicle.route.length) {
            vehicle.status = 'on-scene';
            vehicle.currentStatus = '4'; // FMS-Status: Am Einsatzort
            
            const incident = this.incidents.find(i => i.id === vehicle.targetIncident);
            if (incident) {
                addRadioMessage(vehicle.callsign, `Vor Ort am Einsatzort`);
                
                // Nach 2 Minuten SPIELZEIT: Einsatz abgeschlossen
                const completionTime = 120000; // 2 Minuten Spielzeit
                const realTimeDelay = completionTime / window.GameTime.speed;
                
                setTimeout(() => {
                    vehicle.status = 'available';
                    vehicle.currentStatus = '2'; // FMS-Status: Auf Wache
                    incident.status = 'completed';
                    addRadioMessage(vehicle.callsign, 'Einsatz beendet, Status 4');
                    
                    // Benachrichtigung
                    if (typeof NotificationSystem !== 'undefined') {
                        NotificationSystem.incidentCompleted(incident.nummer || incident.id);
                    }
                    
                    // Scoring
                    if (typeof ScoringSystem !== 'undefined' && incident.validation) {
                        ScoringSystem.scoreIncident(incident, incident.assignedVehicles, incident.validation);
                    }
                }, realTimeDelay);
            }
            vehicle.route = null;
            return;
        }
        
        vehicle.position = vehicle.route[vehicle.routeIndex];
        vehicle.routeIndex++;
    }
}

let game = null;