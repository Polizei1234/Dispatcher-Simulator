// =========================
// VEHICLE ANALYZER
// Analysiert automatisch verfügbare Fahrzeuge
// =========================

const VehicleAnalyzer = {
    availableTypes: new Set(),
    vehiclesByType: {},
    vehiclesByStatus: {},

    /**
     * Initialisiert Analyzer und scannt alle Fahrzeuge
     */
    initialize() {
        console.group('🚑 VEHICLE ANALYZER INIT');
        
        this.availableTypes.clear();
        this.vehiclesByType = {};
        this.vehiclesByStatus = {};

        // Scanne alle owned Fahrzeuge
        const ownedVehicles = VEHICLES.filter(v => v.owned);
        
        ownedVehicles.forEach(vehicle => {
            // Typ erfassen
            this.availableTypes.add(vehicle.type);
            
            // Nach Typ gruppieren
            if (!this.vehiclesByType[vehicle.type]) {
                this.vehiclesByType[vehicle.type] = [];
            }
            this.vehiclesByType[vehicle.type].push(vehicle);
            
            // Nach Status gruppieren
            const status = this.getFMSStatus(vehicle);
            if (!this.vehiclesByStatus[status]) {
                this.vehiclesByStatus[status] = [];
            }
            this.vehiclesByStatus[status].push(vehicle);
        });

        console.log('📊 Verfügbare Fahrzeugtypen:', Array.from(this.availableTypes));
        console.log('📈 Fahrzeuge pro Typ:', Object.entries(this.vehiclesByType).map(([type, vehicles]) => `${type}: ${vehicles.length}`));
        console.log('✅ Analyzer initialisiert');
        console.groupEnd();
    },

    /**
     * Gibt alle verfügbaren Fahrzeugtypen zurück
     */
    getAvailableTypes() {
        return Array.from(this.availableTypes);
    },

    /**
     * Gibt alle Fahrzeuge eines bestimmten Typs zurück
     */
    getVehiclesByType(type) {
        return this.vehiclesByType[type] || [];
    },

    /**
     * Ermittelt FMS-Status eines Fahrzeugs
     */
    getFMSStatus(vehicle) {
        // Wenn Fahrzeug aktuellen Status hat, verwenden
        if (vehicle.currentStatus) {
            return vehicle.currentStatus;
        }
        
        // Sonst basierend auf status ermitteln
        if (vehicle.status === 'available') return '2'; // Auf Wache
        if (vehicle.status === 'dispatched') return '3'; // Fährt zum Einsatz
        if (vehicle.status === 'on-scene') return '4'; // Am Einsatzort
        if (vehicle.status === 'to-hospital') return '7'; // Patient an Bord
        if (vehicle.status === 'at-hospital') return '6'; // Am Zielort
        if (vehicle.status === 'unavailable') return 'E'; // Nicht einsatzbereit
        
        return '2'; // Default: Auf Wache
    },

    /**
     * Findet beste verfügbare Fahrzeuge für Einsatz
     * @param {Object} location - {lat, lon}
     * @param {Array} requiredTypes - z.B. ['RTW', 'NEF']
     * @returns {Array} Sortierte Fahrzeugvorschläge
     */
    findBestVehicles(location, requiredTypes) {
        console.group('🔍 FINDING BEST VEHICLES');
        console.log('📍 Einsatzort:', location);
        console.log('🚑 Benötigt:', requiredTypes);

        const suggestions = {};

        requiredTypes.forEach(type => {
            const vehicles = this.getVehiclesByType(type);
            if (vehicles.length === 0) {
                console.warn(`⚠️ Kein ${type} verfügbar!`);
                suggestions[type] = [];
                return;
            }

            // Berechne für jedes Fahrzeug: Verfügbarkeit, Entfernung, ETA
            const scored = vehicles.map(vehicle => {
                const status = this.getFMSStatus(vehicle);
                const score = this.calculateAvailabilityScore(status);
                const distance = this.calculateDistance(vehicle.position, [location.lat, location.lon]);
                const eta = this.calculateETA(status, distance);

                return {
                    vehicle,
                    status,
                    score,
                    distance,
                    eta
                };
            });

            // Sortiere nach ETA (schnellster zuerst)
            scored.sort((a, b) => a.eta - b.eta);

            suggestions[type] = scored;
            
            console.log(`✅ ${type}: ${scored.length} Fahrzeuge gefunden, bester ETA: ${scored[0].eta} Min`);
        });

        console.groupEnd();
        return suggestions;
    },

    /**
     * Berechnet Verfügbarkeits-Score (höher = besser verfügbar)
     */
    calculateAvailabilityScore(status) {
        const scores = {
            '1': 100,  // Über Funk - sofort
            '8': 95,   // Am Standort - sofort  
            '2': 90,   // Auf Wache - +2 Min
            '7': 60,   // Patient an Bord - bald
            '6': 50,   // Am Krankenhaus - bald
            '4': 30,   // Am Einsatzort - später
            '3': 0,    // Fährt zum Einsatz - NICHT verfügbar
            'E': 0     // Nicht einsatzbereit - NICHT verfügbar
        };
        return scores[status] || 0;
    },

    /**
     * Berechnet Entfernung zwischen zwei Punkten (Luftlinie in km)
     */
    calculateDistance(pos1, pos2) {
        const R = 6371; // Erdradius in km
        const dLat = this.toRad(pos2[0] - pos1[0]);
        const dLon = this.toRad(pos2[1] - pos1[1]);
        const lat1 = this.toRad(pos1[0]);
        const lat2 = this.toRad(pos2[0]);

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    toRad(degrees) {
        return degrees * Math.PI / 180;
    },

    /**
     * Berechnet geschätzte Ankunftszeit (ETA) in Minuten
     */
    calculateETA(status, distance) {
        let baseTime = 0;
        
        // Ausrückzeit je nach Status
        switch(status) {
            case '1': // Über Funk
            case '8': // Am Standort
                baseTime = 0; // Sofort los
                break;
            case '2': // Auf Wache
                baseTime = 2; // 2 Min Ausrückzeit
                break;
            case '7': // Patient an Bord
                baseTime = 15; // Geschätzt 15 Min bis frei
                break;
            case '6': // Am Krankenhaus
                baseTime = 10; // Geschätzt 10 Min bis frei
                break;
            case '4': // Am Einsatzort
                baseTime = 30; // Geschätzt 30 Min bis frei
                break;
            case '3': // Fährt zum Einsatz
            case 'E': // Nicht einsatzbereit
                return 999; // Praktisch nicht verfügbar
        }

        // Fahrzeit: 60 km/h Durchschnitt mit Sondersignal
        const travelTime = (distance / 60) * 60; // in Minuten
        
        return Math.round(baseTime + travelTime);
    },

    /**
     * Update nach Einsatzänderungen
     */
    refresh() {
        this.initialize();
    }
};

// Auto-Initialize bei Laden
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        if (typeof VEHICLES !== 'undefined') {
            VehicleAnalyzer.initialize();
        }
    });
}
