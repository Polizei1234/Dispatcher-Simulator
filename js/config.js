// =========================
// KONFIGURATION
// =========================

const CONFIG = {
    // Karteneinstellungen
    MAP_CENTER: [48.951, 9.437],  // ILS Waiblingen
    MAP_ZOOM: 11,
    MAP_MIN_ZOOM: 9,
    MAP_MAX_ZOOM: 18,
    
    // Spieleinstellungen
    INCIDENT_SPAWN_MIN: 60000,    // Min 1 Minute
    INCIDENT_SPAWN_MAX: 180000,   // Max 3 Minuten
    SIMULATION_SPEED: 1,          // 1 = Echtzeit
    VEHICLE_SPEED_KMH: 80,        // Geschwindigkeit mit Sondersignal
    
    // KI-Einstellungen (Groq API)
    GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
    GROQ_MODEL: 'llama-3.3-70b-versatile',
    MAX_AI_CALLS_PER_MINUTE: 15,  // Groq Rate Limit beachten
    
    // Sounds
    SOUND_ENABLED: true
};

// Funkrufnamen nach Digitalfunkatlas BW 2023
// Quelle: Landesfeuerwehrschule Baden-Württemberg
// Rems-Murr-Kreis (WN)
const VEHICLE_RADIO_CALLSIGNS_BW = {
    // RETTUNGSDIENST - Organisation: DRK
    'RTW': { prefix: 'Florian', org: 'DRK', number: 83 },  // 83 = RTW
    'NEF': { prefix: 'Florian', org: 'DRK', number: 82 },  // 82 = NEF (KORRIGIERT!)
    'KTW': { prefix: 'Florian', org: 'DRK', number: 85 },  // 85 = KTW
    
    // FEUERWEHR - Organisation: FW
    'LF 10': { prefix: 'Florian', org: 'FW', number: 40 },    // 40 = LF 10
    'LF 20': { prefix: 'Florian', org: 'FW', number: 43 },    // 43 = LF 20
    'DLK 23': { prefix: 'Florian', org: 'FW', number: 33 },   // 33 = DLK
    'TLF 16': { prefix: 'Florian', org: 'FW', number: 26 },   // 26 = TLF
    'RW': { prefix: 'Florian', org: 'FW', number: 59 },       // 59 = Rüstwagen
    
    // POLIZEI - Anderes Schema
    'FuStW': { prefix: 'Pol', org: 'POL', number: 2 }  // 2/XX Format
};

function generateCallsign(type, station) {
    const template = VEHICLE_RADIO_CALLSIGNS_BW[type];
    if (!template) return `${station} ${type}`;
    
    // Polizei hat eigenes Format: 2/WN-1, 2/BK-1
    if (template.org === 'POL') {
        const stationCode = station.includes('Waiblingen') ? 'WN' : 
                           station.includes('Backnang') ? 'BK' : 
                           station.includes('Schorndorf') ? 'SDF' :
                           station.includes('Winnenden') ? 'WIN' : 'WN';
        return `${template.number}/${stationCode}-1`;
    }
    
    // Feuerwehr & Rettungsdienst: Florian STADT NUMMER/ZÄHLNUMMER
    const cityCode = station.includes('Waiblingen') ? 'Waiblingen' :
                     station.includes('Backnang') ? 'Backnang' :
                     station.includes('Schorndorf') ? 'Schorndorf' :
                     station.includes('Winnenden') ? 'Winnenden' :
                     station.includes('Fellbach') ? 'Fellbach' : 'Waiblingen';
    
    return `${template.prefix} ${cityCode} ${template.number}/1`;
}

// Stichwörter Baden-Württemberg (exakte Liste)
const KEYWORDS_BW = {
    // RETTUNGSDIENST
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
    
    // FEUER
    'B 1': {
        name: 'Kleinbrand',
        description: 'Kleinbrand (Mülleimer, Papierkorb)',
        color: '#ff5722',
        required: ['LF 10']
    },
    'B 2': {
        name: 'Mittelbrand',
        description: 'Mittelbrand (PKW, Container)',
        color: '#f44336',
        required: ['LF 10', 'LF 20'],
        optional: ['DLK 23']
    },
    'B 3': {
        name: 'Großbrand',
        description: 'Großbrand (Gebäude)',
        color: '#b71c1c',
        required: ['LF 10', 'LF 20', 'DLK 23', 'RW'],
        optional: ['TLF 16']
    },
    
    // TECHNISCHE HILFELEISTUNG
    'THL 1': {
        name: 'Einfache THL',
        description: 'Türöffnung, Tier in Notlage',
        color: '#ff9800',
        required: ['LF 10']
    },
    'THL 2': {
        name: 'Umfangreiche THL',
        description: 'Person in Aufzug, Baum auf Straße',
        color: '#f57c00',
        required: ['LF 10', 'RW']
    },
    'THL VU': {
        name: 'Technische Hilfeleistung Verkehrsunfall',
        description: 'Verkehrsunfall mit eingeklemmter Person',
        color: '#e65100',
        required: ['LF 10', 'RW', 'RTW', 'NEF']
    },
    
    // VERKEHRSUNFALL
    'VU': {
        name: 'Verkehrsunfall',
        description: 'Verkehrsunfall mit Verletzten',
        color: '#2196f3',
        required: ['RTW', 'FuStW'],
        optional: ['NEF']
    }
};