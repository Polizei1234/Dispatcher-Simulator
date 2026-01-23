// =========================
// SPIEL-LOGIK MIT GROQ AI & NEUES CALL SYSTEM
// Nutzt window.GameTime aus main.js!
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
        
        // Initialisiere Fahrzeuge
        this.vehicles.forEach(v => {
            if (!v.currentStatus) {
                v.currentStatus = 1; // ✅ FIX: Status 1 = Einsatzbereit auf Wache (nicht Status 2 = Sprechwunsch)
            }
            if (!v.position && STATIONS[v.station]) {
                v.position = STATIONS[v.station].position;
            }
            // ✅ FIX: Initialisiere status Property für Kompatibilität
            if (!v.status) {
                v.status = v.currentStatus;
            }
        });
        
        // Nächster Anruf (nutzt GameTime.elapsed)
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
        // Nutze ZENTRALES Zeitsystem (window.GameTime aus main.js)
        const currentGameTime = window.GameTime.elapsed;
        
        // Spawne neue Einsätze wenn Spielzeit erreicht ist
        if (currentGameTime >= this.nextIncidentGameTime) {
            console.log(`🚨 Generiere neuen Anruf... (Spielzeit: ${Math.round(currentGameTime/1000)}s)`);
            
            // NEUE METHODE: Nutze CallSystem
            if (typeof CallSystem !== 'undefined') {
                await CallSystem.generateIncomingCall();
            } else {
                console.warn('⚠️ CallSystem nicht gefunden');
            }
            
            // Setze nächsten Einsatz als absolute Spielzeit
            const nextInterval = this.getRandomIncidentInterval();
            this.nextIncidentGameTime = currentGameTime + nextInterval;
            
            const realTimeUntilNext = nextInterval / window.GameTime.speed;
            console.log(`✅ Nächster Anruf in ${Math.round(nextInterval/1000)}s Spielzeit = ${Math.round(realTimeUntilNext/1000)}s Echtzeit (@${window.GameTime.speed}x)`);
        }
        
        // Verdiene Geld für abgeschlossene Einsätze (Karrieremodus)
        if (CONFIG.GAME_MODE === 'career') {
            this.incidents.filter(i => i.status === 'completed' && !i.rewarded).forEach(incident => {
                const reward = this.calculateReward(incident.keyword || incident.stichwort);
                this.money += reward;
                incident.rewarded = true;
                if (typeof addRadioMessage !== 'undefined') {
                    addRadioMessage('System', `€ ${reward} für ${incident.keyword || incident.stichwort} erhalten`, 'system');
                }
                const creditsEl = document.getElementById('credits');
                if (creditsEl) {
                    creditsEl.textContent = this.money.toLocaleString();
                }
            });
        }
    }
    
    calculateReward(keyword) {
        const rewards = {
            'Herzinfarkt': 800,
            'Schlaganfall': 900,
            'Verkehrsunfall': 1000,
            'Sturz': 500,
            'Atemnot': 700,
            'Bewusstlosigkeit': 800
        };
        return rewards[keyword] || 500;
    }
    
    dispatchVehicle(vehicleId, incidentId) {
        const vehicle = this.vehicles.find(v => v.id === vehicleId);
        const incident = this.incidents.find(i => i.id === incidentId);
        
        if (!vehicle || !incident) {
            console.warn('⚠️ dispatchVehicle: Fahrzeug oder Einsatz nicht gefunden');
            return;
        }
        
        // ✅ FIX: Prüfe ob Fahrzeug verfügbar (Status 1 oder 3)
        if (vehicle.status !== 1 && vehicle.status !== 3) {
            console.warn(`⚠️ ${vehicle.callsign} nicht verfügbar (Status ${vehicle.status})`);
            return;
        }
        
        vehicle.status = 4; // FMS 4: Anfahrt
        vehicle.currentStatus = 4;
        vehicle.targetIncident = incidentId;
        
        if (!incident.assignedVehicles) incident.assignedVehicles = [];
        incident.assignedVehicles.push(vehicleId);
        
        console.log(`🚑 ${vehicle.callsign} disponiert zu ${incidentId}`);
    }
}

let game = null;