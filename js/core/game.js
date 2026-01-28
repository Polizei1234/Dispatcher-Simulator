// =========================
// SPIEL-LOGIK MIT GROQ AI & NEUES CALL SYSTEM v5.0.4
// Nutzt window.GameTime aus main.js!
// ✅ FIX: vehicle.status als String für Karten-Kompatibilität
// ✅ v5.0.3: Nutzt VehicleMovement.setVehicleStatus() für Status-Änderungen
// ✅ v5.0.4: Radio-System Referenzen entfernt
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
        
        // Initialisiere Fahrzeuge mit korrektem Status
        this.initializeVehicles();
        
        // Nächster Anruf (nutzt GameTime.elapsed)
        this.nextIncidentGameTime = this.getRandomIncidentInterval();
        
        console.log(`🎮 Game v5.0.4 initialisiert | Nächster Einsatz bei ${Math.round(this.nextIncidentGameTime/1000)}s Spielzeit`);
    }
    
    /**
     * Initialisiert alle Fahrzeuge mit korrektem Status basierend auf Position
     */
    initializeVehicles() {
        this.vehicles.forEach(v => {
            // Setze Position auf Wache wenn nicht vorhanden
            if (!v.position && v.station && STATIONS[v.station]) {
                v.position = STATIONS[v.station].position;
            }
            
            // Prüfe ob Fahrzeug auf Wache steht
            const isOnStation = this.isVehicleOnStation(v);
            
            // ✅ FIX: Initialisiere status UND currentStatus korrekt
            if (!v.status || v.status === undefined) {
                // v.status als STRING für Karten-Kompatibilität!
                v.status = 'available';
            }
            
            if (!v.currentStatus && !v.status) {
                // ✅ Korrekte Status-Initialisierung
                if (isOnStation) {
                    v.currentStatus = 2; // FMS 2: Einsatzbereit auf Wache
                    v.status = 'available';
                } else {
                    v.currentStatus = 3; // FMS 3: Einsatzbereit außerhalb
                    v.status = 'available';
                }
            } else if (!v.currentStatus) {
                // Setze currentStatus wenn nur status vorhanden
                v.currentStatus = isOnStation ? 2 : 3;
            }
            
            // Logging nur für erste paar Fahrzeuge (zu viel Spam vermeiden)
            if (this.vehicles.indexOf(v) < 3) {
                console.log(`🚑 ${v.callsign}: status='${v.status}', currentStatus=${v.currentStatus}`);
            }
        });
        
        console.log(`✅ ${this.vehicles.length} Fahrzeuge initialisiert`);
    }
    
    /**
     * Prüft ob Fahrzeug auf seiner Wache steht
     */
    isVehicleOnStation(vehicle) {
        if (!vehicle.station || !vehicle.position) return false;
        
        const station = STATIONS[vehicle.station];
        if (!station || !station.position) return false;
        
        // Prüfe ob Position identisch ist (oder sehr nah)
        const distance = this.calculateDistance(
            vehicle.position[0], vehicle.position[1],
            station.position[0], station.position[1]
        );
        
        // Weniger als 100m = auf Wache
        return distance < 0.1; // ~100m in km
    }
    
    /**
     * Berechnet Entfernung zwischen zwei Punkten (Haversine)
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Erdradius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    getRandomIncidentInterval() {
        // Nutze Settings Manager für Einsatzfrequenz
        let incidentFrequency = 120; // Default: 2 Minuten
        if (typeof SettingsManager !== 'undefined') {
            incidentFrequency = SettingsManager.get('incidentFrequency') || 120;
        }
        
        const minTime = incidentFrequency * 0.75 * 1000; // -25%
        const maxTime = incidentFrequency * 1.25 * 1000; // +25%
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
                try {
                    await CallSystem.generateIncomingCall();
                } catch (error) {
                    console.error('❌ Fehler bei Anruf-Generierung:', error);
                }
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
                console.log(`💰 ${reward}€ für ${incident.keyword || incident.stichwort} erhalten`);
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
        
        // ✅ FIX: Prüfe ob Fahrzeug verfügbar
        if (vehicle.status !== 'available' && vehicle.status !== 'preparing') {
            console.warn(`⚠️ ${vehicle.callsign} nicht verfügbar (status='${vehicle.status}')`);
            return;
        }
        
        vehicle.status = 'dispatched'; // String-Status für Karte
        
        // ✅ v5.0.3 FIX: Nutze VehicleMovement.setVehicleStatus() statt direkter Zuweisung!
        if (typeof VehicleMovement !== 'undefined' && VehicleMovement.setVehicleStatus) {
            VehicleMovement.setVehicleStatus(vehicle, 4); // FMS 4: Anfahrt
            console.log(`✅ ${vehicle.callsign} Status über VehicleMovement.setVehicleStatus() gesetzt`);
        } else {
            // Fallback wenn VehicleMovement nicht verfügbar
            vehicle.currentStatus = 4;
            console.warn(`⚠️ VehicleMovement nicht verfügbar - Fallback zu direkter Zuweisung`);
        }
        
        vehicle.targetIncident = incidentId;
        
        if (!incident.assignedVehicles) incident.assignedVehicles = [];
        incident.assignedVehicles.push(vehicleId);
        
        console.log(`🚑 ${vehicle.callsign} disponiert zu ${incidentId}`);
    }
}

let game = null;