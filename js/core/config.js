// =========================
// CONFIGURATION v6.1.5
// Zentrale Konfiguration für ILS-Simulator
// =========================

const CONFIG = {
    // =============================
    // ✅ VERSION (SINGLE SOURCE OF TRUTH!)
    // =============================
    VERSION: '6.1.5',
    BUILD_DATE: '2026-01-25',
    
    // ... rest stays the same ...
    GAME_MODE: 'free',
    GROQ_API_KEY: '',

    FMS_STATUS: {
        1: { name: 'Einsatzbereit über Funk', color: '#28a745', icon: '🟢' },
        2: { name: 'Einsatzbereit auf Wache', color: '#28a745', icon: '🏭' },
        3: { name: 'Einsatz übernommen', color: '#ffc107', icon: '🔴' },
        4: { name: 'Am Einsatzort', color: '#ff9800', icon: '🚨' },
        5: { name: 'Sprechwunsch', color: '#17a2b8', icon: '📡' },
        6: { name: 'Nicht einsatzbereit', color: '#6c757d', icon: '⚪' },
        7: { name: 'Patient aufgenommen', color: '#e83e8c', icon: '🩺' },
        8: { name: 'Am Zielort', color: '#9c27b0', icon: '🏭' },
        9: { name: 'Sondersignal', color: '#dc3545', icon: '🚨' }
    },

    GAME: {
        timeMultiplier: 1.0,
        difficulty: 'normal',
        callFrequency: { easy: 10, normal: 5, hard: 3, expert: 2 },
        startTime: '08:00:00',
        autoPauseOnCall: true,
        scoringEnabled: true,
        tutorialMode: false
    },

    SIMULATION: {
        vehicleSpeeds: { default: 60, city: 40, highway: 100 },
        responseTime: { RTW: 120, NEF: 90, KTW: 180, ITW: 150, Kdow: 60 },
        incidentDuration: { min: 15, max: 60, average: 30 },
        autoFMSUpdate: true,
        fmsUpdateInterval: 5000
    },

    MAP: {
        center: [48.8309415, 9.3256194],
        zoom: 11,
        style: 'streets',
        showVehicles: true,
        showStations: true,
        showIncidents: true,
        showHospitals: true,
        autoCenterOnIncident: true,
        routingService: 'osrm'
    },

    UI: {
        language: 'de',
        theme: 'dark',
        soundEnabled: true,
        soundVolume: 0.7,
        notificationsEnabled: true,
        notificationDuration: 5000,
        ringtoneMaxDuration: 30000,
        animationsEnabled: true,
        compactMode: false
    },

    GROQ: {
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8,
        maxTokens: 2000,
        timeout: 30000,
        retryOnError: true,
        maxRetries: 3
    },

    DEBUG: { enabled: true, level: 'info', trackPerformance: true, logAPICalls: true },
    ANALYTICS: { saveLocalStats: true, trackSessions: true, exportFormat: 'json' },

    load() {
        console.group('⚙️ LOADING CONFIG');
        const savedApiKey = localStorage.getItem('groq_api_key');
        if (savedApiKey) {
            this.GROQ_API_KEY = savedApiKey;
            console.log('✅ Groq API Key geladen');
        } else {
            console.warn('⚠️ Kein Groq API Key gefunden');
        }
        const savedDifficulty = localStorage.getItem('game_difficulty');
        if (savedDifficulty) this.GAME.difficulty = savedDifficulty;
        const savedTheme = localStorage.getItem('ui_theme');
        if (savedTheme) this.UI.theme = savedTheme;
        const savedSoundEnabled = localStorage.getItem('sound_enabled');
        if (savedSoundEnabled !== null) this.UI.soundEnabled = savedSoundEnabled === 'true';
        console.log('✅ Konfiguration geladen');
        console.log(`🆙 Version: ${this.VERSION} (Build: ${this.BUILD_DATE})`);
        console.groupEnd();
    },

    save() {
        if (this.GROQ_API_KEY) localStorage.setItem('groq_api_key', this.GROQ_API_KEY);
        localStorage.setItem('game_difficulty', this.GAME.difficulty);
        localStorage.setItem('ui_theme', this.UI.theme);
        localStorage.setItem('sound_enabled', this.UI.soundEnabled.toString());
        console.log('✅ Konfiguration gespeichert');
    },

    setApiKey(key) {
        this.GROQ_API_KEY = key;
        localStorage.setItem('groq_api_key', key);
        console.log('✅ Groq API Key gesetzt');
    },

    setDifficulty(level) {
        if (!['easy', 'normal', 'hard', 'expert'].includes(level)) {
            console.error('❌ Ungültiger Schwierigkeitsgrad:', level);
            return;
        }
        this.GAME.difficulty = level;
        this.save();
        console.log('✅ Schwierigkeitsgrad geändert:', level);
    },

    toggleSound() {
        this.UI.soundEnabled = !this.UI.soundEnabled;
        this.save();
        return this.UI.soundEnabled;
    },

    setTheme(theme) {
        if (!['light', 'dark', 'auto'].includes(theme)) {
            console.error('❌ Ungültiges Theme:', theme);
            return;
        }
        this.UI.theme = theme;
        this.save();
        this.applyTheme();
    },

    applyTheme() {
        document.body.className = `theme-${this.UI.theme}`;
        console.log('🎨 Theme angewendet:', this.UI.theme);
    },

    validate() {
        const errors = [];
        if (!this.GROQ_API_KEY) errors.push('Kein Groq API Key konfiguriert');
        if (errors.length > 0) {
            console.warn('⚠️ Konfigurations-Probleme:', errors);
            return false;
        }
        console.log('✅ Konfiguration valide');
        return true;
    },

    reset() {
        if (!confirm('Möchten Sie die Konfiguration wirklich zurücksetzen?')) return;
        localStorage.removeItem('groq_api_key');
        localStorage.removeItem('game_difficulty');
        localStorage.removeItem('ui_theme');
        localStorage.removeItem('sound_enabled');
        window.location.reload();
    },

    showSettingsUI() {
        console.log('⚙️ Settings UI wird geöffnet');
    },
    
    getVersion() {
        return {
            version: this.VERSION,
            buildDate: this.BUILD_DATE,
            mode: this.GAME_MODE
        };
    }
};

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        CONFIG.load();
        CONFIG.applyTheme();
    });
}