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
    
    // FMS Status (Funkmeldesystem Baden-Württemberg)
    FMS_STATUS: {
        0: { name: 'Nicht einsatzbereit', color: '#6c757d', icon: '⚫' },
        1: { name: 'Einsatzbereit auf Funk', color: '#28a745', icon: '🟢' },
        2: { name: 'Einsatzbereit auf Wache', color: '#20c997', icon: '🟢' },
        3: { name: 'Einsatzauftrag übernommen', color: '#17a2b8', icon: '🔵' },
        4: { name: 'Ankunft am Einsatzort', color: '#ffc107', icon: '🟡' },
        5: { name: 'Patient aufgenommen', color: '#fd7e14', icon: '🟠' },
        6: { name: 'Verlässt Einsatzort', color: '#20c997', icon: '🟢' },
        7: { name: 'Ankunft Krankenhaus', color: '#e83e8c', icon: '🟣' },
        8: { name: 'Am Standort', color: '#6610f2', icon: '🟣' },
        9: { name: 'Sondersignal', color: '#dc3545', icon: '🔴' }
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