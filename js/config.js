// =========================
// KONFIGURATION
// =========================

const CONFIG = {
    // Karteneinstellungen
    MAP_CENTER: [48.8309415, 9.3256194], // Waiblingen
    MAP_ZOOM: 11,
    MAP_MIN_ZOOM: 9,
    MAP_MAX_ZOOM: 18,
    
    // Spieleinstellungen
    GAME_MODE: 'career', // 'career' oder 'free'
    GAME_SPEED: 5, // Zeitfaktor (1 = Echtzeit, 5 = 5x schneller)
    START_CREDITS: 50000,
    
    // Einsatzgenerierung
    INCIDENT_SPAWN_MIN: 120, // Sekunden (Spielzeit)
    INCIDENT_SPAWN_MAX: 300,
    
    // Fahrzeugkosten
    VEHICLE_COSTS: {
        'RTW': 120000,
        'NEF': 150000,
        'KTW': 60000,
        'Kdow': 80000,
        'GW-San': 100000
    },
    
    // Einnahmen pro Einsatz
    INCIDENT_REWARDS: {
        'medical_emergency': 500,
        'traffic_accident': 800,
        'fire': 1000,
        'patient_transport': 300
    },
    
    // FMS Status (Funkmeldesystem - angepasst)
    FMS_STATUS: {
        0: { name: 'Priorisierter Sprechwunsch', color: '#8b4513', icon: '🟤' },  // Braun
        1: { name: 'Einsatzbereit über Funk', color: '#28a745', icon: '🟢' },   // Grün
        2: { name: 'Einsatzbereit auf Wache', color: '#1e7e34', icon: '🟢' },    // Dunkelgrün
        3: { name: 'Einsatzauftrag übernommen', color: '#ffc107', icon: '🟡' }, // Gelb
        4: { name: 'Ankunft am Einsatzort', color: '#fd7e14', icon: '🟠' },      // Orange
        5: { name: 'Sprechwunsch', color: '#17a2b8', icon: '🔵' },               // Cyan
        6: { name: 'Nicht einsatzbereit', color: '#000000', icon: '⚫' },            // Schwarz
        7: { name: 'Patient aufgenommen', color: '#e83e8c', icon: '🟣' },        // Pink
        8: { name: 'Krankenhausdesinfektion', color: '#6f42c1', icon: '🟣' }    // Lila
    },
    
    // Groq AI
    GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
    GROQ_MODEL: 'llama-3.3-70b-versatile'
};

// Spielmodus festlegen
function setGameMode(mode) {
    CONFIG.GAME_MODE = mode;
    console.log(`🎮 Spielmodus: ${mode}`);
}

// Spielgeschwindigkeit ändern
function setGameSpeed(speed) {
    CONFIG.GAME_SPEED = speed;
    console.log(`⏱️ Spielgeschwindigkeit: ${speed}x`);
}