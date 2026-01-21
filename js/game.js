// =========================
// SPIEL-LOGIK - FIXED TIME SYSTEM
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
        this.paused = false;
        this.speed = 5; // Default 5x
        
        // ZEIT-SYSTEM (simpel)
        this.gameTime = new Date();
        this.gameTime.setHours(8, 0, 0, 0); // Start 08:00
        this.lastUpdate = Date.now();
        
        // Initialisiere Fahrzeuge
        this.vehicles.forEach(v => {
            if (!v.currentStatus) {
                v.currentStatus = 2; // Status 2: Auf Wache
            }
            if (!v.position) {
                const station = STATIONS[v.station];
                if (station) {
                    v.position = station.position;
                }
            }
        });
        
        // Nächster Anruf
        this.nextCallIn = this.getRandomCallInterval();
        
        console.log(`🎮 Game initialisiert | Nächster Anruf in ${this.nextCallIn}ms`);
        
        // Start Game Loop
        this.startGameLoop();
    }
    
    getRandomCallInterval() {
        // Alle 2-5 Minuten ein Anruf (in Echtzeit geteilt durch Speed)
        const minTime = 120000; // 2 Min
        const maxTime = 300000; // 5 Min
        const interval = minTime + Math.random() * (maxTime - minTime);
        return interval / this.speed; // Anpassen an Speed
    }
    
    startGameLoop() {
        this.gameInterval = setInterval(() => {
            if (!this.paused) {
                this.update();
            }
        }, 1000); // Update jede Sekunde
        
        console.log('⏱️ Game Loop gestartet');
    }
    
    async update() {
        const now = Date.now();
        const deltaMs = now - this.lastUpdate;
        this.lastUpdate = now;
        
        // Update Spielzeit
        const gameTimeDelta = deltaMs * this.speed;
        this.gameTime = new Date(this.gameTime.getTime() + gameTimeDelta);
        
        // Update UI Zeit
        this.updateTimeDisplay();
        
        // Check für neuen Anruf
        this.nextCallIn -= deltaMs;
        if (this.nextCallIn <= 0) {
            console.log('📞 Generiere neuen Anruf...');
            await this.generateCall();
            this.nextCallIn = this.getRandomCallInterval();
        }
        
        // Update Fahrzeuge (wird von VehicleMovement gehandelt)
        // Keine zusätzliche Logik nötig
    }
    
    updateTimeDisplay() {
        const timeEl = document.getElementById('current-time');
        if (timeEl) {
            const hours = String(this.gameTime.getHours()).padStart(2, '0');
            const minutes = String(this.gameTime.getMinutes()).padStart(2, '0');
            const seconds = String(this.gameTime.getSeconds()).padStart(2, '0');
            timeEl.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    
    async generateCall() {
        if (typeof CallSystem !== 'undefined') {
            await CallSystem.generateIncomingCall();
        } else {
            console.warn('⚠️ CallSystem nicht gefunden');
        }
    }
    
    setSpeed(newSpeed) {
        this.speed = newSpeed;
        console.log(`⏱️ Spielgeschwindigkeit: ${newSpeed}x`);
        
        const indicator = document.getElementById('game-speed-indicator');
        if (indicator) {
            indicator.textContent = `${newSpeed}x`;
        }
    }
    
    togglePause() {
        this.paused = !this.paused;
        console.log(this.paused ? '⏸️ Pausiert' : '▶️ Fortgesetzt');
        
        const icon = document.getElementById('pause-icon');
        if (icon) {
            icon.className = this.paused ? 'fas fa-play' : 'fas fa-pause';
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
        
        if (!vehicle || !incident || vehicle.status !== 'available') return;
        
        vehicle.status = 'dispatched';
        vehicle.currentStatus = 3; // FMS 3
        vehicle.targetIncident = incidentId;
        
        if (!incident.assignedVehicles) incident.assignedVehicles = [];
        incident.assignedVehicles.push(vehicleId);
        
        console.log(`🚑 ${vehicle.callsign} disponiert zu ${incidentId}`);
    }
}

let game = null;

// Global Functions
function togglePause() {
    if (game) {
        game.togglePause();
    }
}

function cycleGameSpeed() {
    if (!game) return;
    
    const speeds = [1, 2, 5, 10, 30];
    const currentIndex = speeds.indexOf(game.speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    game.setSpeed(speeds[nextIndex]);
}