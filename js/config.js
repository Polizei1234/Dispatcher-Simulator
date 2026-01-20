// =========================
// KONFIGURATION
// =========================

const CONFIG = {
    // Karteneinstellungen
    MAP_CENTER: [48.8315, 9.3159],  // Waiblingen (Startwache)
    MAP_ZOOM: 13,
    MAP_MIN_ZOOM: 10,
    MAP_MAX_ZOOM: 18,
    
    // Spieleinstellungen
    INCIDENT_SPAWN_MIN: 120000,   // Min 2 Minuten
    INCIDENT_SPAWN_MAX: 300000,   // Max 5 Minuten
    SIMULATION_SPEED: 5,          // Standard 5x
    VEHICLE_SPEED_KMH: 80,
    
    // KI-Einstellungen (Groq API)
    GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
    GROQ_MODEL: 'llama-3.3-70b-versatile',
    MAX_AI_CALLS_PER_MINUTE: 15,
    
    // Spielmodus
    GAME_MODE: 'career', // 'career' oder 'free'
    
    SOUND_ENABLED: true
};

// Funkrufnamen nach Digitalfunkatlas BW 2023 - KORREKT!
// Seite 8: Hilfsorganisationen haben EIGENE Präfixe!
const RADIO_CALLSIGN_PREFIXES_BW = {
    // RETTUNGSDIENST nach Organisation
    'DRK': 'Rotkreuz',        // Deutsches Rotes Kreuz
    'ASB': 'ASB',             // Arbeiter-Samariter-Bund
    'JUH': 'Johanniter',      // Johanniter-Unfall-Hilfe
    'MHD': 'Malteser',        // Malteser Hilfsdienst
    
    // FEUERWEHR
    'FW': 'Florian',
    
    // POLIZEI
    'POL': '2'  // Format: 2/WN-1
};

// Fahrzeugkennziffern nach Digitalfunkatlas
const VEHICLE_NUMBERS_BW = {
    // Rettungsdienst
    'RTW': 83,
    'NEF': 82,
    'KTW': 85,
    'NAW': 84,
    
    // Feuerwehr
    'LF 10': 40,
    'LF 20': 43,
    'DLK 23': 33,
    'TLF 16': 26,
    'RW': 59,
    'ELW': 10,
    
    // Polizei (anderes System)
    'FuStW': 2
};

function generateCallsign(type, station, organization) {
    const vehicleNumber = VEHICLE_NUMBERS_BW[type];
    
    // Polizei hat eigenes Format
    if (organization === 'POL') {
        const stationCode = station.includes('Waiblingen') ? 'WN' : 
                           station.includes('Backnang') ? 'BK' : 
                           station.includes('Winnenden') ? 'WIN' : 'WN';
        return `2/${stationCode}-1`;
    }
    
    // Rettungsdienst: Organisation bestimmt Präfix!
    if (['DRK', 'ASB', 'JUH', 'MHD'].includes(organization)) {
        const prefix = RADIO_CALLSIGN_PREFIXES_BW[organization];
        const cityCode = station.includes('Waiblingen') ? 'Waiblingen' :
                         station.includes('Backnang') ? 'Backnang' :
                         station.includes('Winnenden') ? 'Winnenden' :
                         station.includes('Schorndorf') ? 'Schorndorf' : 'Waiblingen';
        
        return `${prefix} ${cityCode} ${vehicleNumber}/1`;
    }
    
    // Feuerwehr: Florian
    if (organization === 'FW') {
        const prefix = RADIO_CALLSIGN_PREFIXES_BW['FW'];
        const cityCode = station.includes('Waiblingen') ? 'Waiblingen' :
                         station.includes('Backnang') ? 'Backnang' : 'Waiblingen';
        
        return `${prefix} ${cityCode} ${vehicleNumber}/1`;
    }
    
    return `${station} ${type}`;
}

// Stichworte Baden-Württemberg
const KEYWORDS_BW = {
    'RD 1': { 
        name: 'Notfalleinsatz',
        description: 'Akute Erkrankung oder Verletzung',
        color: '#c8102e',
        required: ['RTW'],
        optional: ['NEF']
    },
    'RD 2': {
        name: 'Notarzteinsatz',
        description: 'Lebensbedrohliche Erkrankung/Verletzung',
        color: '#dc143c',
        required: ['RTW', 'NEF']
    },
    'B 1': {
        name: 'Kleinbrand',
        description: 'Kleinbrand',
        color: '#ff5722',
        required: ['LF 10']
    },
    'B 2': {
        name: 'Mittelbrand',
        description: 'Mittelbrand',
        color: '#f44336',
        required: ['LF 10', 'LF 20'],
        optional: ['DLK 23']
    },
    'B 3': {
        name: 'Großbrand',
        description: 'Großbrand',
        color: '#b71c1c',
        required: ['LF 10', 'LF 20', 'DLK 23', 'RW'],
        optional: ['TLF 16']
    },
    'THL 1': {
        name: 'Einfache THL',
        description: 'Technische Hilfeleistung',
        color: '#ff9800',
        required: ['LF 10']
    },
    'THL 2': {
        name: 'Umfangreiche THL',
        description: 'Technische Hilfeleistung',
        color: '#f57c00',
        required: ['LF 10', 'RW']
    },
    'THL VU': {
        name: 'THL Verkehrsunfall',
        description: 'Verkehrsunfall mit Einklemmung',
        color: '#e65100',
        required: ['LF 10', 'RW', 'RTW', 'NEF']
    },
    'VU': {
        name: 'Verkehrsunfall',
        description: 'Verkehrsunfall mit Verletzten',
        color: '#2196f3',
        required: ['RTW', 'FuStW'],
        optional: ['NEF']
    }
};