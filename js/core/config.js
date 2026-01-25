// =========================
// CONFIG v6.1.8 - FINAL + FMS_STATUS
// Global game configuration
// + ✅ FIX: FMS_STATUS Definition hinzugefügt
// + ✅ VERSION Manager zentralisiert
// =========================

const CONFIG = {
    VERSION: '6.1.8',
    BUILD_DATE: '25.01.2026 - 22:02',
    
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
    },
    
    // ✅ FMS Status Definitionen
    FMS_STATUS: {
        0: { name: 'Notruf/Hilferuf', color: '#dc3545', icon: '⚠️' },
        1: { name: 'Einsatzbereit über Funk', color: '#28a745', icon: '🟢' },
        2: { name: 'Einsatzbereit auf Wache', color: '#28a745', icon: '🟢' },
        3: { name: 'Einsatz übernommen', color: '#ffc107', icon: '🟡' },
        4: { name: 'Anfahrt Einsatzstelle', color: '#fd7e14', icon: '🟠' },
        5: { name: 'Ankunft Einsatzstelle', color: '#dc3545', icon: '🔴' },
        6: { name: 'Sprechwunsch', color: '#6c757d', icon: '⚪' },
        7: { name: 'Patient aufgenommen', color: '#17a2b8', icon: '🔵' },
        8: { name: 'Anfahrt Krankenhaus', color: '#007bff', icon: '🔵' },
        9: { name: 'Ankunft Krankenhaus', color: '#6f42c1', icon: '🟣' },
        'C': { name: 'Status C', color: '#dc3545', icon: '🛑' }
    },
    
    // ✅ VERSION Manager - zentrale Version-Verwaltung
    getVersionedUrl: function(path) {
        return `${path}?v=${this.VERSION}`;
    }
};

if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

console.log(`✅ Config v${CONFIG.VERSION} geladen (${CONFIG.BUILD_DATE})`);
console.log('✅ FIX: FMS_STATUS Definitionen hinzugefügt');
console.log('✅ FIX: VERSION Manager zentralisiert');
