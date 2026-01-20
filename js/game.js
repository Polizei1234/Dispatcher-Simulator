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
        
        this.incidentCounter = 0;
        this.lastIncidentTime = Date.now();
    }
    
    init() {
        // Lade gespeicherte Einstellungen
        this.loadSettings();
        
        // Initialisiere Wachen basierend auf Startstation
        this.initializeStations();
        
        // Starte Spielschleife
        this.start();
    }
    
    initializeStations() {
        // Kopiere alle Stationen
        this.stations = JSON.parse(JSON.stringify(STATIONS));
        
        // Füge alle Fahrzeuge zur Fahrzeugliste hinzu
        this.vehicles = [];
        Object.values(this.stations).forEach(station => {
            station.vehicles.forEach(vehicle => {
                vehicle.station = station.id;
                vehicle.position = [...station.position];
                this.vehicles.push(vehicle);
            });
        });
        
        // Startfahrzeuge (nur von der Startstation)
        const startStation = this.stations[CONFIG.STARTING_STATION];
        if (startStation) {
            this.vehicles = startStation.vehicles.map(v => ({
                ...v,
                station: startStation.id,
                position: [...startStation.position],
                owned: true
            }));
        }
    }
    
    start() {
        this.running = true;
        this.gameLoop();
        this.incidentGenerationLoop();
    }
    
    gameLoop() {
        if (!this.running) return;
        
        // Update Spielzeit
        this.gameTime = new Date(this.gameTime.getTime() + (1000 * this.gameSpeed));
        
        // Update UI
        this.updateUI();
        
        // Nächster Frame
        setTimeout(() => this.gameLoop(), CONFIG.TIME_UPDATE_INTERVAL);
    }
    
    incidentGenerationLoop() {
        if (!this.running) return;
        
        const now = Date.now();
        const timeSinceLastIncident = now - this.lastIncidentTime;
        
        // Generiere neuen Einsatz wenn genug Zeit vergangen ist
        if (timeSinceLastIncident > CONFIG.MIN_INCIDENT_INTERVAL) {
            const randomChance = Math.random();
            if (randomChance < 0.3) { // 30% Chance pro Intervall
                this.generateIncident();
                this.lastIncidentTime = now;
            }
        }
        
        // Nächste Prüfung
        setTimeout(() => this.incidentGenerationLoop(), 30000); // Alle 30 Sekunden prüfen
    }
    
    generateIncident() {
        // Wähle zufälligen vordefinierten Einsatz
        const template = PREDEFINED_INCIDENTS[Math.floor(Math.random() * PREDEFINED_INCIDENTS.length)];
        
        const incident = {
            id: 'incident-' + (++this.incidentCounter),
            keyword: template.keyword,
            description: template.description,
            location: template.location,
            position: template.position,
            time: new Date(this.gameTime),
            status: 'new',
            assignedVehicles: [],
            caller: template.caller,
            details: template.details
        };
        
        this.incidents.push(incident);
        
        // Zeige Notruf-Dialog
        if (this.apiKey) {
            showCallDialog(incident);
        } else {
            // Ohne KI: Zeige einfach den Einsatz
            addRadioMessage('Leitstelle', `Neuer Einsatz: ${incident.keyword} - ${incident.description}`);
            updateIncidentList();
        }
    }
    
    dispatchVehicle(vehicleId, incidentId) {
        const vehicle = this.vehicles.find(v => v.id === vehicleId);
        const incident = this.incidents.find(i => i.id === incidentId);
        
        if (!vehicle || !incident) return false;
        
        if (vehicle.status !== 'available') {
            alert('Fahrzeug ist nicht verfügbar!');
            return false;
        }
        
        // Alarmiere Fahrzeug
        vehicle.status = 'dispatched';
        vehicle.assignedIncident = incidentId;
        incident.assignedVehicles.push(vehicleId);
        incident.status = 'dispatched';
        
        // Funkspruch
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
        
        // Simuliere Anfahrt
        this.simulateVehicleResponse(vehicle, incident);
        
        return true;
    }
    
    simulateVehicleResponse(vehicle, incident) {
        // Berechne Fahrtzeit (vereinfacht)
        const distance = this.calculateDistance(vehicle.position, incident.position);
        const travelTime = (distance / CONFIG.VEHICLE_SPEED_SONDERSIGNAL) * 3600000; // in ms
        
        // Fahrzeug zur Einsatzstelle
        setTimeout(() => {
            vehicle.status = 'on-scene';
            vehicle.position = [...incident.position];
            addRadioMessage(vehicle.callsign, `${vehicle.callsign} vor Ort`, 'incoming');
            updateVehicleList();
            updateMap();
        }, travelTime / this.gameSpeed);
        
        // Einsatz abarbeiten
        const workTime = 1200000; // 20 Minuten
        setTimeout(() => {
            vehicle.status = 'available';
            vehicle.assignedIncident = null;
            
            // Fahrzeug zurück zur Wache
            const station = this.stations[vehicle.station];
            vehicle.position = [...station.position];
            
            addRadioMessage(vehicle.callsign, `${vehicle.callsign} Einsatz abgeschlossen, wieder frei`, 'incoming');
            
            // Einsatz abschließen
            incident.status = 'completed';
            
            // Credits verdienen
            const reward = CONFIG.CREDITS_PER_INCIDENT[incident.keyword] || 100;
            this.credits += reward;
            
            updateUI();
            updateVehicleList();
            updateIncidentList();
            updateMap();
        }, (travelTime + workTime) / this.gameSpeed);
    }
    
    calculateDistance(pos1, pos2) {
        // Haversine Formel (vereinfacht)
        const lat1 = pos1[0] * Math.PI / 180;
        const lat2 = pos2[0] * Math.PI / 180;
        const dLat = (pos2[0] - pos1[0]) * Math.PI / 180;
        const dLon = (pos2[1] - pos1[1]) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = 6371 * c; // in km
        
        return distance;
    }
    
    buyVehicle(vehicleType, stationId) {
        const price = CONFIG.VEHICLE_PRICES[vehicleType];
        
        if (this.credits < price) {
            alert('Nicht genug Credits!');
            return false;
        }
        
        const station = this.stations[stationId];
        if (!station) {
            alert('Wache nicht gefunden!');
            return false;
        }
        
        // Erstelle neues Fahrzeug
        const newVehicle = {
            id: `${vehicleType.toLowerCase()}-${stationId}-${Date.now()}`,
            type: vehicleType,
            callsign: `Florian ${station.name} ${vehicleType}`,
            status: 'available',
            station: stationId,
            position: [...station.position],
            owned: true
        };
        
        this.vehicles.push(newVehicle);
        station.vehicles.push(newVehicle);
        this.credits -= price;
        
        alert(`${vehicleType} erfolgreich gekauft!`);
        updateUI();
        updateVehicleList();
        
        return true;
    }
    
    updateUI() {
        // Update Zeit
        const timeStr = this.gameTime.toLocaleTimeString('de-DE');
        document.getElementById('current-time').textContent = timeStr;
        
        // Update Credits
        document.getElementById('credits').textContent = this.credits.toLocaleString();
        
        // Update Fahrzeuge
        const activeVehicles = this.vehicles.filter(v => v.status !== 'available').length;
        document.getElementById('active-vehicles').textContent = activeVehicles;
        document.getElementById('total-vehicles').textContent = this.vehicles.length;
        
        // Update Einsatzzähler
        const activeIncidents = this.incidents.filter(i => i.status !== 'completed').length;
        document.getElementById('incident-count').textContent = activeIncidents;
    }
    
    saveSettings() {
        const settings = {
            gameSpeed: this.gameSpeed,
            apiKey: this.apiKey,
            soundEnabled: this.soundEnabled
        };
        localStorage.setItem('dispatcher-settings', JSON.stringify(settings));
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

// Globale Spielinstanz
let game = null;