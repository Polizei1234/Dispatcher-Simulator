// =========================
// SPIEL-LOGIK MIT GROQ AI
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
        
        this.lastIncidentSpawn = Date.now();
        this.nextIncidentTime = this.getRandomIncidentTime();
        
        console.log(`🎮 Game initialisiert | Nächster Einsatz in ${Math.round(this.nextIncidentTime/1000/CONFIG.GAME_SPEED)}s Echtzeit`);
    }
    
    getRandomIncidentTime() {
        // Neuer Einsatz alle 60-180 Sekunden (Spielzeit)
        const minTime = 60000; // 60 Sekunden Spielzeit
        const maxTime = 180000; // 180 Sekunden Spielzeit (3 Minuten)
        const gameTime = minTime + Math.random() * (maxTime - minTime);
        
        // Konvertiere zu Echtzeit basierend auf Spielgeschwindigkeit
        const realTime = gameTime / CONFIG.GAME_SPEED;
        
        console.log(`⏱️ Nächster Einsatz: ${Math.round(gameTime/1000)}s Spielzeit = ${Math.round(realTime/1000)}s Echtzeit (${CONFIG.GAME_SPEED}x Speed)`);
        return realTime;
    }
    
    async update() {
        const now = Date.now();
        
        // Spawne neue Einsätze mit Groq AI
        if (now - this.lastIncidentSpawn >= this.nextIncidentTime) {
            console.log('🚨 Generiere neuen KI-Einsatz...');
            
            const ownedVehicles = this.vehicles.filter(v => v.owned);
            const incident = await generateIncidentWithAI(ownedVehicles, this.apiKey);
            
            if (incident) {
                this.incidents.push(incident);
                showIncomingCallNotification(incident);
                addRadioMessage('System', 'Neuer Notruf 112 eingegangen!');
                
                // Setze Timer für nächsten Einsatz
                this.lastIncidentSpawn = now;
                this.nextIncidentTime = this.getRandomIncidentTime();
                
                console.log(`✅ Einsatz erstellt: ${incident.keyword} | Nächster in ${Math.round(this.nextIncidentTime/1000)}s Echtzeit`);
            } else {
                console.warn('⚠️ KI-Einsatzgenerierung fehlgeschlagen, versuche später erneut');
                // Bei Fehler: Retry in 30 Sekunden
                this.lastIncidentSpawn = now;
                this.nextIncidentTime = 30000 / CONFIG.GAME_SPEED;
            }
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
                const reward = this.calculateReward(incident.keyword);
                this.money += reward;
                incident.rewarded = true;
                addRadioMessage('System', `€ ${reward} für ${incident.keyword} erhalten`);
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
        showCallDialog(incident);
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
        vehicle.targetIncident = incidentId;
        
        if (!incident.assignedVehicles) incident.assignedVehicles = [];
        incident.assignedVehicles.push(vehicleId);
        
        const station = this.stations[vehicle.station];
        vehicle.route = this.calculateRoute(station.position, incident.position);
        vehicle.routeIndex = 0;
        
        addRadioMessage('Leitstelle', `${vehicle.callsign} zu ${incident.keyword}`);
        addRadioMessage(vehicle.callsign, 'Einsatz übernommen, rücke aus!');
    }
    
    calculateRoute(start, end) {
        const steps = 30;
        const route = [];
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            route.push([
                start[0] + (end[0] - start[0]) * t,
                start[1] + (end[1] - start[1]) * t
            ]);
        }
        return route;
    }
    
    updateVehiclePosition(vehicle) {
        if (!vehicle.route || vehicle.routeIndex >= vehicle.route.length) {
            vehicle.status = 'on-scene';
            const incident = this.incidents.find(i => i.id === vehicle.targetIncident);
            if (incident) {
                addRadioMessage(vehicle.callsign, `Vor Ort am Einsatzort`);
                
                // Nach 2 Minuten: Einsatz abgeschlossen
                setTimeout(() => {
                    vehicle.status = 'available';
                    incident.status = 'completed';
                    addRadioMessage(vehicle.callsign, 'Einsatz beendet, Status 4');
                }, 120000 / CONFIG.GAME_SPEED);
            }
            vehicle.route = null;
            return;
        }
        
        vehicle.position = vehicle.route[vehicle.routeIndex];
        vehicle.routeIndex++;
    }
}

// KEIN let map = null; hier! Wird in map.js definiert
let game = null;