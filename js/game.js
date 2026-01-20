// =========================
// SPIEL-LOGIK
// =========================

class Game {
    constructor() {
        this.stations = STATIONS;
        this.vehicles = VEHICLES;
        this.incidents = [];
        this.selectedIncident = null;
        this.money = 50000;
        this.reputation = 100;
        this.apiKey = null;
        
        this.lastIncidentSpawn = Date.now();
        this.nextIncidentTime = this.getRandomIncidentTime();
    }
    
    getRandomIncidentTime() {
        return CONFIG.INCIDENT_SPAWN_MIN + 
               Math.random() * (CONFIG.INCIDENT_SPAWN_MAX - CONFIG.INCIDENT_SPAWN_MIN);
    }
    
    update() {
        const now = Date.now();
        
        // Spawne neue Einsätze (nur machbare!)
        if (now - this.lastIncidentSpawn > this.nextIncidentTime) {
            const incident = generateIncident(this.vehicles);
            if (incident) {
                this.incidents.push(incident);
                showIncomingCallNotification(incident);
                addRadioMessage('System', 'Neuer Notruf eingegangen!');
            }
            this.lastIncidentSpawn = now;
            this.nextIncidentTime = this.getRandomIncidentTime();
        }
        
        // Update Fahrzeuge
        this.vehicles.forEach(vehicle => {
            if (vehicle.status === 'dispatched' && vehicle.route) {
                this.updateVehiclePosition(vehicle);
            }
        });
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
        
        const missing = required.filter(reqType => {
            return !owned.some(v => v.type === reqType);
        });
        
        return {
            hasAll: missing.length === 0,
            required: required,
            missing: missing
        };
    }
    
    dispatchVehicle(vehicleId, incidentId) {
        const vehicle = this.vehicles.find(v => v.id === vehicleId);
        const incident = this.incidents.find(i => i.id === incidentId);
        
        if (!vehicle || !incident) return;
        if (vehicle.status !== 'available') {
            alert(`${vehicle.callsign} ist nicht verfügbar!`);
            return;
        }
        
        vehicle.status = 'dispatched';
        vehicle.targetIncident = incidentId;
        
        if (!incident.assignedVehicles) {
            incident.assignedVehicles = [];
        }
        incident.assignedVehicles.push(vehicleId);
        
        // Berechne Route
        const station = this.stations[vehicle.station];
        const start = station.position;
        const end = incident.position;
        
        vehicle.route = this.calculateRoute(start, end);
        vehicle.routeIndex = 0;
        vehicle.position = [...start];
        
        const distance = this.calculateDistance(start, end);
        const travelTime = (distance / CONFIG.VEHICLE_SPEED_KMH) * 60; // Minuten
        vehicle.eta = Date.now() + (travelTime * 60 * 1000);
        vehicle.totalDistance = distance;
        
        addRadioMessage('Leitstelle', `${vehicle.callsign} alarmiert zu ${incident.keyword}`);
        addRadioMessage(vehicle.callsign, 'Rückmeldung: Einsatz übernommen, rücke aus!');
    }
    
    calculateRoute(start, end) {
        // Einfache Interpolation in 20 Schritten für realistische Bewegung
        const steps = 20;
        const route = [];
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const lat = start[0] + (end[0] - start[0]) * t;
            const lon = start[1] + (end[1] - start[1]) * t;
            route.push([lat, lon]);
        }
        
        return route;
    }
    
    calculateDistance(pos1, pos2) {
        // Haversine-Formel für präzise Distanzberechnung
        const R = 6371; // Erdradius in km
        const dLat = (pos2[0] - pos1[0]) * Math.PI / 180;
        const dLon = (pos2[1] - pos1[1]) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(pos1[0] * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    updateVehiclePosition(vehicle) {
        if (!vehicle.route || vehicle.routeIndex >= vehicle.route.length) {
            // Ziel erreicht
            vehicle.status = 'on-scene';
            vehicle.position = vehicle.route[vehicle.route.length - 1];
            
            const incident = this.incidents.find(i => i.id === vehicle.targetIncident);
            if (incident) {
                addRadioMessage(vehicle.callsign, `Vor Ort am Einsatzort ${incident.keyword}`);
            }
            
            vehicle.route = null;
            vehicle.routeIndex = 0;
            return;
        }
        
        vehicle.position = vehicle.route[vehicle.routeIndex];
        vehicle.routeIndex++;
    }
    
    buyVehicle(vehicleIndex) {
        const vehicle = this.vehicles[vehicleIndex];
        if (!vehicle || vehicle.owned) return;
        
        if (this.money >= vehicle.cost) {
            this.money -= vehicle.cost;
            vehicle.owned = true;
            alert(`✅ ${vehicle.type} gekauft!`);
        } else {
            alert(`❌ Nicht genug Geld! Benötigt: €${vehicle.cost.toLocaleString()}`);
        }
    }
}

let game = null;
let map = null;