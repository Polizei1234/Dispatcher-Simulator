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
    
    // FMS Status (Funkmeldesystem) - OFFIZIELL für Feuerwehr & Rettungsdienst
    // Quelle: http://www.rettungsdienst.net/technik/bos/bo-fms
    
    // STATUS FAHRZEUG -> LEITSTELLE (0-9)
    FMS_STATUS: {
        0: { name: 'Fahrzeugstatus 0', color: '#6c757d', icon: '⚪', description: 'Nicht fest definiert' },
        1: { name: 'Einsatzbereit über Funk', color: '#28a745', icon: '🟢', description: 'Sprechwunsch oder Einsatzbereit über Funk' },
        2: { name: 'Einsatzbereit auf Wache', color: '#1e7e34', icon: '🟢', description: 'Ankunft auf Wache / Einsatzbereit' },
        3: { name: 'Einsatzauftrag übernommen', color: '#ffc107', icon: '🟡', description: 'Einsatz übernommen' },
        4: { name: 'Am Einsatzort', color: '#fd7e14', icon: '🟠', description: 'Ankunft Einsatzort' },
        5: { name: 'Sprechwunsch', color: '#17a2b8', icon: '🔵', description: 'Sprechwunsch (Fahrzeug möchte kommunizieren)' },
        6: { name: 'Nicht einsatzbereit', color: '#000000', icon: '⚫', description: 'Nicht Einsatzbereit' },
        7: { name: 'Patient aufgenommen', color: '#e83e8c', icon: '🟣', description: 'Patient aufgenommen / Transport' },
        8: { name: 'Am Zielort', color: '#6f42c1', icon: '🟣', description: 'Ankunft Ziel (Krankenhaus)' },
        9: { name: 'Sondersignal', color: '#dc3545', icon: '🔴', description: 'Sondersignal (Blaulicht + Martinshorn)' }
    },
    
    // STATUS LEITSTELLE -> FAHRZEUG (A-I)
    FMS_LEITSTELLE_STATUS: {
        'A': { name: 'Außer Dienst', color: '#6c757d', icon: '⚪', description: 'Fahrzeug außer Dienst stellen' },
        'B': { name: 'Bereitstellung', color: '#17a2b8', icon: '🔵', description: 'Bereitstellung an einem Ort' },
        'C': { name: 'Nicht vergeben', color: '#6c757d', icon: '⚪', description: 'Reserviert' },
        'D': { name: 'Dringende Sprechwunsch', color: '#dc3545', icon: '🔴', description: 'Sofort Sprechverbindung aufbauen' },
        'E': { name: 'Einsatzauftrag', color: '#ffc107', icon: '🟡', description: 'Einsatzauftrag folgt/liegt vor' },
        'F': { name: 'Fernmeldeverbindung', color: '#28a745', icon: '🟢', description: 'Über Telefon/Fax melden' },
        'G': { name: 'Geruf wird wiederholt', color: '#fd7e14', icon: '🟠', description: 'Funkruf wird wiederholt' },
        'H': { name: 'Heimkehr', color: '#1e7e34', icon: '🟢', description: 'Wache/Standort anfahren' },
        'I': { name: 'Individuell', color: '#6f42c1', icon: '🟣', description: 'Individuell definierbar' }
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