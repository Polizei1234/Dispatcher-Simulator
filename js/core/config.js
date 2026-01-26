// =========================
// CONFIG v6.3.0 - UNIFIED STATUS SYSTEM UPDATE
// Global game configuration
// + ✅ FMS_STATUS Farben angepasst (gemäß Anforderung)
// + ✅ Status 9 entfernt (nicht verwendet)
// + ✅ Status 0: NUR für Besatzungs-Notfälle
// + ✅ Status 5: Für alle Fahrzeug-Anfragen
// =========================

const CONFIG = {
    // Version wird zentral aus VERSION_CONFIG geladen
    get VERSION() {
        return window.VERSION_CONFIG ? window.VERSION_CONFIG.VERSION : '6.3.0';
    },
    get BUILD_DATE() {
        return window.VERSION_CONFIG ? window.VERSION_CONFIG.BUILD_DATE : new Date().toLocaleString('de-DE');
    },
    
    // ✅ GAME CONSTANTS - Keine Magic Numbers mehr!
    GAME_SPEED: {
        DEFAULT: 1.0,
        MIN: 0.5,
        MAX: 30,
        OPTIONS: [
            { value: 0.5, label: 'Sehr langsam (0.5x)' },
            { value: 0.75, label: 'Langsam (0.75x)' },
            { value: 1, label: 'Normal (1x - Echtzeit)' },
            { value: 2, label: 'Schnell (2x)' },
            { value: 5, label: 'Sehr schnell (5x)' },
            { value: 10, label: 'Extrem schnell (10x)' },
            { value: 30, label: 'Turbo (30x)' }
        ]
    },
    
    INCIDENT_FREQUENCY: {
        DEFAULT: 120,  // 2 Minuten in Sekunden
        MIN: 30,       // 30 Sekunden
        MAX: 300,      // 5 Minuten
        OPTIONS: [
            { value: 30, label: 'Sehr oft (30s)' },
            { value: 60, label: 'Oft (1 Min)' },
            { value: 120, label: 'Normal (2 Min)' },
            { value: 180, label: 'Selten (3 Min)' },
            { value: 300, label: 'Sehr selten (5 Min)' }
        ]
    },
    
    VEHICLE_SPEED: {
        DEFAULT: 1.0,
        OPTIONS: [
            { value: 0.5, label: 'Langsam (0.5x)' },
            { value: 1, label: 'Normal (1x)' },
            { value: 1.5, label: 'Schnell (1.5x)' },
            { value: 2, label: 'Sehr schnell (2x)' }
        ]
    },
    
    // Map Settings
    MAP: {
        CENTER: [48.95, 9.30],  // Rems-Murr-Kreis
        ZOOM: {
            DEFAULT: 11,
            MIN: 9,
            MAX: 18
        },
        STATION_DISTANCE_KM: 0.1,  // 100m = Fahrzeug gilt als "auf Wache"
        AUTO_ZOOM_TO_INCIDENT: true
    },
    
    // Radio System Constants
    RADIO: {
        REQUEST_CHANCE: 0.02,           // 2% Chance dass Fahrzeug Status 5 sendet
        CHECK_INTERVAL_MS: 30000,       // 30 Sekunden zwischen Checks
        EMERGENCY_CHANCE: 0.001,        // 0.1% Chance für Status 0 (SEHR SELTEN!)
        RESPONSE_DELAY_MIN_MS: 800,     // Min. Verzögerung bei Antwort
        RESPONSE_DELAY_MAX_MS: 1400,    // Max. Verzögerung bei Antwort
        CONVERSATION_HISTORY_LIMIT: 10, // Max. Nachrichten in History
        API_TIMEOUT_MS: 10000,          // 10 Sekunden Timeout für API-Calls
        TEMPLATE_COVERAGE: 0.98         // 98% Coverage durch Templates
    },
    
    // Game Mode
    GAME_MODE: 'free',  // 'free' oder 'career'
    
    // Starting Resources (Career Mode)
    CAREER: {
        STARTING_MONEY: 50000,
        STARTING_REPUTATION: 100,
        MONEY_PER_INCIDENT: {
            'Herzinfarkt': 800,
            'Schlaganfall': 900,
            'Verkehrsunfall': 1000,
            'Sturz': 500,
            'Atemnot': 700,
            'Bewusstlosigkeit': 800,
            'DEFAULT': 500
        }
    },
    
    // Free Mode
    FREE: {
        UNLIMITED_MONEY: 999999999
    },
    
    // API Keys (werden in Settings gesetzt)
    GROQ_API_KEY: null,
    
    // Feature Flags
    FEATURES: {
        AI_INCIDENTS: true,
        AI_CALLS: true,
        WEATHER: true,
        RADIO: true,
        DEBUG_MENU: true,
        CAREER_MODE: false  // Kommt bald!
    },
    
    // ✅ UNIFIED FMS STATUS DEFINITIONS
    // Farben gemäß Anforderung angepasst!
    FMS_STATUS: {
        0: { 
            name: 'Notruf Besatzung', 
            shortName: 'NOTFALL',
            color: '#ff4444',      // Helles Rot
            icon: '🚨',
            description: 'NOTFALL: Besatzung in Gefahr - NUR in echten Notfällen!',
            canBeContacted: true,
            priority: 'emergency',
            usage: 'NUR bei Notfällen der Besatzung (Unfall, Übergriff, medizinischer Notfall der Crew)'
        },
        1: { 
            name: 'Einsatzbereit über Funk', 
            shortName: 'EB Funk',
            color: '#90ee90',      // Hellgrün
            icon: '🔽',
            description: 'Fahrzeug einsatzbereit, außerhalb der Wache',
            canBeContacted: true,
            priority: 'normal'
        },
        2: { 
            name: 'Einsatzbereit auf Wache', 
            shortName: 'EB Wache',
            color: '#006400',      // Dunkelgrün
            icon: '🏠',
            description: 'Fahrzeug einsatzbereit auf Wache',
            canBeContacted: true,
            priority: 'normal'
        },
        3: { 
            name: 'Einsatz übernommen', 
            shortName: 'Alarmiert',
            color: '#ffa500',      // Orange
            icon: '🔔',
            description: 'Einsatz wurde angenommen, Vorbereitung läuft',
            canBeContacted: true,
            priority: 'normal'
        },
        4: { 
            name: 'Anfahrt Einsatzstelle', 
            shortName: 'Anfahrt',
            color: '#8b0000',      // Dunkles Rot
            icon: '🚑',
            description: 'Fahrzeug ist unterwegs zur Einsatzstelle',
            canBeContacted: true,
            priority: 'normal'
        },
        5: { 
            name: 'Sprechwunsch', 
            shortName: 'Sprechwunsch',
            color: '#ff6666',      // Helles Rot
            icon: '📞',
            description: 'Fahrzeug möchte Leitstelle kontaktieren',
            canBeContacted: true,
            priority: 'high',
            usage: 'Für ALLE Anfragen vom Fahrzeug an die Leitstelle (ETA, Lage, Rückfragen, etc.)'
        },
        6: { 
            name: 'Ankunft Einsatzstelle', 
            shortName: 'Vor Ort',
            color: '#808080',      // Grau
            icon: '📍',
            description: 'Fahrzeug ist an der Einsatzstelle eingetroffen',
            canBeContacted: true,
            priority: 'normal'
        },
        7: { 
            name: 'Patient aufgenommen', 
            shortName: 'Patient an Bord',
            color: '#ffb6c1',      // Rosa
            icon: '🩺',
            description: 'Patient wurde aufgenommen und verladen',
            canBeContacted: true,
            priority: 'normal'
        },
        8: { 
            name: 'Anfahrt Krankenhaus', 
            shortName: 'Transport',
            color: '#9370db',      // Lila
            icon: '🏥',
            description: 'Transportfahrt zum Krankenhaus',
            canBeContacted: true,
            priority: 'normal'
        },
        // Status 9 ENTFERNT (nicht verwendet)
        'C': { 
            name: 'Nicht Einsatzbereit', 
            shortName: 'Status C',
            color: '#666666',      // Dunkelgrau
            icon: '🚫',
            description: 'Fahrzeug nicht einsatzbereit (Werkstatt, Pause, etc.)',
            canBeContacted: false,
            priority: 'low'
        }
    },
    
    /**
     * Helper: Hole FMS-Status mit Fallback
     * @param {number|string} status - Status-Code
     * @returns {object} Status-Objekt
     */
    getFMSStatus: function(status) {
        // Konvertiere zu String falls nötig
        const statusKey = String(status);
        
        if (this.FMS_STATUS[statusKey]) {
            return this.FMS_STATUS[statusKey];
        }
        
        // Fallback
        console.warn(`⚠️ Unbekannter FMS-Status: ${status}`);
        return {
            name: 'Unbekannt',
            shortName: 'Unbekannt',
            color: '#6c757d',
            icon: '❔',
            description: 'Status unbekannt',
            canBeContacted: false,
            priority: 'low'
        };
    },
    
    /**
     * Helper: Prüfe ob Fahrzeug kontaktierbar ist
     * @param {number|string} status - Status-Code
     * @returns {boolean} Kann kontaktiert werden
     */
    canContactVehicle: function(status) {
        const statusInfo = this.getFMSStatus(status);
        return statusInfo.canBeContacted;
    },
    
    /**
     * Helper: Hole alle verfügbaren Status-Codes
     * @returns {array} Status-Codes
     */
    getAllStatusCodes: function() {
        return Object.keys(this.FMS_STATUS);
    },
    
    /**
     * Helper: Filtere Status nach Kontaktierbarkeit
     * @param {boolean} contactable - Nur kontaktierbare Status?
     * @returns {array} Gefilterte Status-Codes
     */
    getStatusByContactability: function(contactable = true) {
        return this.getAllStatusCodes().filter(code => {
            return this.FMS_STATUS[code].canBeContacted === contactable;
        });
    },
    
    // Legacy Kompatibilität
    getVersionedUrl: function(path) {
        return `${path}?v=${this.VERSION}`;
    }
};

// Global verfügbar machen
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    
    // Kompatibilität: Legacy getFMSStatus Funktion
    window.getFMSStatus = (status) => CONFIG.getFMSStatus(status);
}

console.log(`✅ Config v${CONFIG.VERSION} geladen (${CONFIG.BUILD_DATE})`);
console.log('✅ FMS_STATUS Farben aktualisiert (gemäß Anforderung)');
console.log('✅ Status 9 entfernt');
console.log('✅ Status 0: NUR für Besatzungs-Notfälle');
console.log('✅ Status 5: Für alle Fahrzeug-Anfragen');