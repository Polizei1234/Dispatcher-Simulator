// =========================
// KONFIGURATION
// ILS Waiblingen Dispatcher Simulator
// =========================

const CONFIG = {
    // Spieleinstellungen
    INITIAL_CREDITS: 50000,
    STARTING_STATION: 'backnang',
    
    // Zeiteinstellungen
    DEFAULT_GAME_SPEED: 5,
    TIME_UPDATE_INTERVAL: 1000, // ms
    
    // Einsatzgenerierung
    INCIDENT_GENERATION_INTERVAL: 120000, // 2 Minuten (in Spielzeit)
    MIN_INCIDENT_INTERVAL: 60000, // 1 Minute
    MAX_INCIDENT_INTERVAL: 300000, // 5 Minuten
    
    // Fahrzeugeinstellungen
    VEHICLE_SPEED_NORMAL: 50, // km/h
    VEHICLE_SPEED_SONDERSIGNAL: 80, // km/h
    VEHICLE_UPDATE_INTERVAL: 2000, // Fahrzeugposition alle 2 Sekunden aktualisieren
    
    // Karteneinstellungen
    MAP_CENTER: [48.9458, 9.4325], // Backnang (Startstation)
    MAP_ZOOM: 12,
    MAP_MIN_ZOOM: 9,
    MAP_MAX_ZOOM: 18,
    
    // Credits pro Einsatz
    CREDITS_PER_INCIDENT: {
        'RD 1': 150,
        'RD 2': 300,
        'B 1': 200,
        'B 2': 400,
        'B 3': 600,
        'B 4': 800,
        'THL 1': 250,
        'THL 2': 350,
        'THL 3': 500,
        'VU': 200
    },
    
    // Fahrzeugpreise
    VEHICLE_PRICES: {
        'RTW': 195000,
        'NEF': 120000,
        'KTW': 80000,
        'LF 10': 350000,
        'LF 20': 450000,
        'DLK 23': 800000,
        'TLF': 500000,
        'RW': 400000,
        'Streifenwagen': 50000,
        'FuStW': 45000
    },
    
    // API Einstellungen
    PERPLEXITY_API_URL: 'https://api.perplexity.ai/chat/completions',
    PERPLEXITY_MODEL: 'sonar',
    
    // OpenRouteService für Routing (kostenlos, kein API Key nötig für geringe Nutzung)
    ROUTING_ENABLED: true,
    
    // Sound
    SOUND_ENABLED: true,
    
    // Tutorial
    TUTORIAL_ENABLED: true
};

// Baden-Württemberg Stichwort-System
const KEYWORDS_BW = {
    // Rettungsdienst
    'RD 1': {
        name: 'RD 1',
        description: 'Rettungsdiensteinsatz ohne Notarzt',
        vehicles: ['RTW'],
        color: '#ffc107'
    },
    'RD 2': {
        name: 'RD 2',
        description: 'Rettungsdiensteinsatz mit Notarzt',
        vehicles: ['RTW', 'NEF'],
        color: '#dc3545'
    },
    
    // Brand
    'B 1': {
        name: 'B 1',
        description: 'Kleinbrand',
        vehicles: ['LF 10'],
        color: '#ff5722'
    },
    'B 2': {
        name: 'B 2',
        description: 'Mittelbrand',
        vehicles: ['LF 10', 'LF 20', 'DLK 23'],
        color: '#ff5722'
    },
    'B 3': {
        name: 'B 3',
        description: 'Großbrand',
        vehicles: ['LF 10', 'LF 20', 'DLK 23', 'TLF'],
        color: '#d32f2f'
    },
    
    // Technische Hilfeleistung
    'THL 1': {
        name: 'THL 1',
        description: 'TH-Einsatz klein',
        vehicles: ['LF 10'],
        color: '#2196f3'
    },
    'THL 2': {
        name: 'THL 2',
        description: 'TH-Einsatz mittel',
        vehicles: ['LF 10', 'RW'],
        color: '#2196f3'
    },
    'THL VU': {
        name: 'THL VU',
        description: 'Verkehrsunfall mit eingeklemmten Personen',
        vehicles: ['LF 10', 'RW', 'RTW', 'NEF'],
        color: '#ff9800'
    },
    
    // Sonstige
    'VU': {
        name: 'VU',
        description: 'Verkehrsunfall',
        vehicles: ['RTW'],
        color: '#ff9800'
    },
    'MANV': {
        name: 'MANV',
        description: 'Massenanfall von Verletzten',
        vehicles: ['RTW', 'RTW', 'NEF', 'NEF', 'LF 10'],
        color: '#9c27b0'
    }
};

// Funkrufnamen nach Landesfeuerwehrschule BW
// Quelle: https://www.lfs-bw.de
const CALLSIGN_PATTERNS_BW = {
    // Rettungsdienst (Florian + Ort + Fahrzeugkennung)
    'RTW': (city, number) => `Florian ${city} ${83}/${number}`, // 83 = RTW
    'NEF': (city, number) => `Florian ${city} ${97}/${number}`, // 97 = NEF
    'KTW': (city, number) => `Florian ${city} ${85}/${number}`, // 85 = KTW
    
    // Feuerwehr
    'LF 10': (city, number) => `Florian ${city} ${40}/${number}`, // 40 = LF
    'LF 20': (city, number) => `Florian ${city} ${43}/${number}`, // 43 = LF 20
    'DLK 23': (city, number) => `Florian ${city} ${33}/${number}`, // 33 = DLK
    'TLF': (city, number) => `Florian ${city} ${26}/${number}`, // 26 = TLF
    'RW': (city, number) => `Florian ${city} ${58}/${number}`, // 58 = RW
    
    // Polizei (andere Nomenklatur)
    'FuStW': (city, number) => `2/${city.substring(0, 2).toUpperCase()}-${number}` // z.B. 2/WN-1
};

// Export für andere Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, KEYWORDS_BW, CALLSIGN_PATTERNS_BW };
}