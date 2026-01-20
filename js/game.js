// =========================
// SPIELLOGIK
// =========================

class Game {
    constructor() {
        this.credits = CONFIG.INITIAL_CREDITS;
        this.gameTime = new Date();
        this.gameSpeed = CONFIG.DEFAULT_GAME_SPEED;
        this.running = false;
        this.incidents = [];
        this.vehicles = [];
        this.stations = {};
        this.selectedIncident = null;
        this.apiKey = '';
        this.soundEnabled = CONFIG.SOUND_ENABLED;
        this.pendingCall = null; // Wartender Anruf
        
        this.incidentCounter = 0;
        this.lastIncidentTime = Date.now();
        
        this.vehicleUpdateInterval = null;
    }
    
    init() {
        this.loadSettings();
        this.initializeStations();
        document.getElementById('game-speed-indicator').textContent = this.gameSpeed + 'x';
        this.start();
    }
    
    initializeStations() {
        this.stations = JSON.parse(JSON.stringify(STATIONS));
        
        const startStation = this.stations[CONFIG.STARTING_STATION];
        if (startStation) {
            this.vehicles = startStation.vehicles.map(v => ({
                ...v,
                station: startStation.id,
                position: [...startStation.position],
                homePosition: [...startStation.position],
                owned: true,
                route: null,
                routeProgress: 0
            }));
            
            console.log('Startfahrzeuge geladen:', this.vehicles.length);
        }
    }
    
    start() {
        this.running = true;
        console.log('Spiel gestartet');
        this.gameLoop();
        this.incidentGenerationLoop();
        this.startVehicleUpdates();
    }
    
    startVehicleUpdates() {
        this.vehicleUpdateInterval = setInterval(() => {
            this.updateVehiclePositions();
        }, CONFIG.VEHICLE_UPDATE_INTERVAL);
    }
    
    updateVehiclePositions() {
        this.vehicles.forEach(vehicle => {
            if (vehicle.route && vehicle.status === 'dispatched') {
                // Berechne Fortschritt basierend auf Geschwindigkeit und Zeit
                const speedFactor = (CONFIG.VEHICLE_SPEED_SONDERSIGNAL / 3600) * (CONFIG.VEHICLE_UPDATE_INTERVAL / 1000) * this.gameSpeed;
                vehicle.routeProgress += speedFactor / vehicle.totalDistance;
                
                if (vehicle.routeProgress >= 1) {
                    // Ziel erreicht
                    vehicle.routeProgress = 1;
                    vehicle.position = [...vehicle.targetPosition];
                    vehicle.status = 'on-scene';
                    addRadioMessage(vehicle.callsign, `${vehicle.callsign} vor Ort`, 'incoming');
                    
                    // Starte Einsatzzeit
                    this.startIncidentWork(vehicle);
                } else {
                    // Interpoliere Position entlang der Route
                    if (vehicle.route && vehicle.route.length > 1) {
                        const segmentIndex = Math.floor(vehicle.routeProgress * (vehicle.route.length - 1));
                        const segment = vehicle.route[segmentIndex];
                        vehicle.position = segment || vehicle.position;
                    }
                }
            }
        });
        
        updateMap();
        updateVehicleList();
    }
    
    startIncidentWork(vehicle) {
        const workTime = 1200000 / this.gameSpeed; // 20 Minuten in Spielzeit
        
        setTimeout(() => {
            vehicle.status = 'available';
            vehicle.assignedIncident = null;
            vehicle.route = null;
            vehicle.routeProgress = 0;
            
            // Fahrzeug zurück zur Wache
            vehicle.position = [...vehicle.homePosition];
            
            addRadioMessage(vehicle.callsign, `${vehicle.callsign} Einsatz abgeschlossen, wieder frei`, 'incoming');
            
            // Einsatz abschließen
            const incident = this.incidents.find(i => i.assignedVehicles && i.assignedVehicles.includes(vehicle.id));
            if (incident) {
                incident.status = 'completed';
                const reward = CONFIG.CREDITS_PER_INCIDENT[incident.keyword] || 100;
                this.credits += reward;
            }
            
            updateUI();
            updateVehicleList();
            updateIncidentList();
            updateMap();
        }, workTime);
    }
    
    gameLoop() {
        if (!this.running) return;
        this.gameTime = new Date(this.gameTime.getTime() + (1000 * this.gameSpeed));
        this.updateUI();
        setTimeout(() => this.gameLoop(), CONFIG.TIME_UPDATE_INTERVAL);
    }
    
    incidentGenerationLoop() {
        if (!this.running) return;
        
        const now = Date.now();
        const timeSinceLastIncident = now - this.lastIncidentTime;
        
        if (timeSinceLastIncident > CONFIG.MIN_INCIDENT_INTERVAL) {
            const randomChance = Math.random();
            if (randomChance < 0.4) {
                this.generateIncident();
                this.lastIncidentTime = now;
            }
        }
        
        setTimeout(() => this.incidentGenerationLoop(), 20000);
    }
    
    generateIncident() {
        const template = PREDEFINED_INCIDENTS[Math.floor(Math.random() * PREDEFINED_INCIDENTS.length)];
        
        const incident = {
            id: 'incident-' + (++this.incidentCounter),
            keyword: template.keyword,
            description: null, // Wird erst nach Gespräch bekannt
            location: null, // Wird erst nach Gespräch bekannt
            position: template.position,
            time: new Date(this.gameTime),
            status: 'incoming', // NEUER Status: incoming = Anruf wartet
            assignedVehicles: [],
            caller: template.caller,
            initialMessage: template.initialMessage,
            fullDetails: template.fullDetails,
            actualLocation: template.location,
            conversationState: {
                locationKnown: false,
                detailsKnown: false,
                ageKnown: false,
                symptomsKnown: false
            }
        };
        
        this.incidents.push(incident);
        this.pendingCall = incident;
        
        console.log('Neuer Anruf eingehend:', incident.keyword);
        
        // Zeige Anruf-Benachrichtigung
        showIncomingCallNotification(incident);
    }
    
    acceptCall(incidentId) {
        const incident = this.incidents.find(i => i.id === incidentId);
        if (!incident) return;
        
        incident.status = 'in-call';
        this.pendingCall = null;
        showCallDialog(incident);
    }
    
    checkRequiredVehicles(incidentKeyword) {
        const keywordInfo = KEYWORDS_BW[incidentKeyword];
        if (!keywordInfo) return { hasAll: true, missing: [] };
        
        const requiredTypes = keywordInfo.vehicles;
        const availableTypes = this.vehicles
            .filter(v => v.owned && v.status === 'available')
            .map(v => v.type);
        
        const missing = [];
        requiredTypes.forEach(reqType => {
            if (!availableTypes.includes(reqType)) {
                missing.push(reqType);
            }
        });
        
        return {
            hasAll: missing.length === 0,
            missing: missing,
            required: requiredTypes
        };
    }
    
    async dispatchVehicle(vehicleId, incidentId) {
        const vehicle = this.vehicles.find(v => v.id === vehicleId);
        const incident = this.incidents.find(i => i.id === incidentId);
        
        if (!vehicle || !incident) return false;
        
        if (vehicle.status !== 'available') {
            alert('Fahrzeug ist nicht verfügbar!');
            return false;
        }
        
        vehicle.status = 'dispatched';
        vehicle.assignedIncident = incidentId;
        vehicle.targetPosition = [...incident.position];
        incident.assignedVehicles.push(vehicleId);
        incident.status = 'dispatched';
        
        addRadioMessage('Leitstelle', 
            `${vehicle.callsign}, Einsatz ${incident.keyword} in ${incident.location}`, 
            'outgoing'
        );
        
        setTimeout(() => {
            addRadioMessage(vehicle.callsign, 
                `${vehicle.callsign} verstanden, rücken aus`, 
                'incoming'
            );
        }, 2000);
        
        // Berechne Route
        await this.calculateRoute(vehicle, incident.position);
        
        return true;
    }
    
    async calculateRoute(vehicle, targetPosition) {
        // Vereinfachte Route: Direkte Linie mit Wegpunkten
        const start = vehicle.position;
        const end = targetPosition;
        
        // Erstelle einfache Route mit 10 Zwischenpunkten
        const steps = 20;
        vehicle.route = [];
        
        for (let i = 0; i <= steps; i++) {
            const lat = start[0] + (end[0] - start[0]) * (i / steps);
            const lng = start[1] + (end[1] - start[1]) * (i / steps);
            vehicle.route.push([lat, lng]);
        }
        
        vehicle.routeProgress = 0;
        vehicle.totalDistance = this.calculateDistance(start, end);
        
        console.log(`Route berechnet für ${vehicle.callsign}: ${vehicle.totalDistance.toFixed(2)} km`);
    }
    
    calculateDistance(pos1, pos2) {
        const lat1 = pos1[0] * Math.PI / 180;
        const lat2 = pos2[0] * Math.PI / 180;
        const dLat = (pos2[0] - pos1[0]) * Math.PI / 180;
        const dLon = (pos2[1] - pos1[1]) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return 6371 * c;
    }
    
    updateUI() {
        const timeStr = this.gameTime.toLocaleTimeString('de-DE');
        const timeEl = document.getElementById('current-time');
        if (timeEl) timeEl.textContent = timeStr;
        
        const creditsEl = document.getElementById('credits');
        if (creditsEl) creditsEl.textContent = this.credits.toLocaleString();
        
        const activeVehicles = this.vehicles.filter(v => v.status !== 'available').length;
        const activeEl = document.getElementById('active-vehicles');
        const totalEl = document.getElementById('total-vehicles');
        if (activeEl) activeEl.textContent = activeVehicles;
        if (totalEl) totalEl.textContent = this.vehicles.length;
        
        const activeIncidents = this.incidents.filter(i => i.status !== 'completed' && i.status !== 'incoming').length;
        const incidentEl = document.getElementById('incident-count');
        if (incidentEl) incidentEl.textContent = activeIncidents;
    }
    
    saveSettings() {
        const settings = {
            gameSpeed: this.gameSpeed,
            apiKey: this.apiKey,
            soundEnabled: this.soundEnabled
        };
        localStorage.setItem('dispatcher-settings', JSON.stringify(settings));
        console.log('Einstellungen gespeichert:', settings);
    }
    
    loadSettings() {
        const saved = localStorage.getItem('dispatcher-settings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.gameSpeed = settings.gameSpeed || CONFIG.DEFAULT_GAME_SPEED;
            this.apiKey = settings.apiKey || '';
            this.soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
        }
    }
}

let game = null;