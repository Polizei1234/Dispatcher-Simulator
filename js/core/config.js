// =========================
// CONFIG v6.1.6 - FINAL
// Global game configuration
// =========================

const CONFIG = {
    VERSION: '6.1.6',
    BUILD_DATE: '25.01.2026 - 21:16',
    
    // Game Settings
    GAME_SPEED: 1.0,
    INCIDENT_FREQUENCY: 120000, // 2 Minuten
    
    // Map Settings
    MAP_CENTER: [48.95, 9.30],
    MAP_ZOOM: 11,
    
    // API Keys (werden in Settings gesetzt)
    GROQ_API_KEY: null,
    
    // Feature Flags
    FEATURES: {
        AI_INCIDENTS: true,
        AI_CALLS: true,
        WEATHER: true,
        RADIO: true,
        DEBUG_MENU: true
    }
};

if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

console.log(`✅ Config v${CONFIG.VERSION} geladen (${CONFIG.BUILD_DATE})`);