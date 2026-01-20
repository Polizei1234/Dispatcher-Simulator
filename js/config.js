// =========================
// KONFIGURATION
// =========================

const CONFIG = {
    // Karteneinstellungen
    MAP_CENTER: [48.8309415, 9.3256194],  // RW1 Waiblingen
    MAP_ZOOM: 11,
    MAP_MIN_ZOOM: 9,
    MAP_MAX_ZOOM: 18,
    
    // Spieleinstellungen
    INCIDENT_SPAWN_MIN: 120000,
    INCIDENT_SPAWN_MAX: 300000,
    SIMULATION_SPEED: 5,
    VEHICLE_SPEED_KMH: 80,
    
    // KI-Einstellungen
    GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
    GROQ_MODEL: 'llama-3.3-70b-versatile',
    MAX_AI_CALLS_PER_MINUTE: 15,
    
    // Spielmodus
    GAME_MODE: 'career',
    
    SOUND_ENABLED: true
};

// Stichworte
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
    'VU': {
        name: 'Verkehrsunfall',
        description: 'Verkehrsunfall mit Verletzten',
        color: '#2196f3',
        required: ['RTW'],
        optional: ['NEF']
    }
};