// =========================
// CONFIGURATION
// Zentrale Konfiguration für ILS-Simulator
// =========================

const CONFIG = {
    // =============================
    // API KEYS
    // =============================
    GROQ_API_KEY: '', // Wird aus localStorage geladen oder hier eingetragen

    // =============================
    // FMS STATUS CODES
    // =============================
    FMS_STATUS: {
        1: { name: 'Einsatzbereit über Funk', color: '#28a745', icon: '🟢' },
        2: { name: 'Einsatzbereit auf Wache', color: '#28a745', icon: '🏥' },
        3: { name: 'Einsatz übernommen', color: '#ffc107', icon: '🔴' },
        4: { name: 'Am Einsatzort', color: '#ff9800', icon: '🚨' },
        5: { name: 'Sprechwunsch', color: '#17a2b8', icon: '📡' },
        6: { name: 'Nicht einsatzbereit', color: '#6c757d', icon: '⚪' },
        7: { name: 'Patient aufgenommen', color: '#e83e8c', icon: '🩺' },
        8: { name: 'Am Zielort', color: '#9c27b0', icon: '🏥' },
        9: { name: 'Sondersignal', color: '#dc3545', icon: '🚨' }
    },

    // =============================
    // GAME SETTINGS
    // =============================
    GAME: {
        // Zeitraffer (1.0 = Echtzeit, 2.0 = doppelt so schnell)
        timeMultiplier: 1.0,

        // Schwierigkeitsgrad
        difficulty: 'normal', // 'easy', 'normal', 'hard', 'expert'

        // Anruf-Frequenz (Minuten zwischen Anrufen)
        callFrequency: {
            easy: 10,
            normal: 5,
            hard: 3,
            expert: 2
        },

        // Spielzeit-Start (Uhrzeit)
        startTime: '08:00:00',

        // Auto-Pause bei Anruf
        autoPauseOnCall: true,

        // Scoring aktiviert
        scoringEnabled: true,

        // Tutorial-Modus
        tutorialMode: false
    },

    // =============================
    // SIMULATION SETTINGS
    // =============================
    SIMULATION: {
        // Fahrzeug-Geschwindigkeiten (km/h)
        vehicleSpeeds: {
            default: 60,        // Durchschnitt mit Sondersignal
            city: 40,           // Innerorts
            highway: 100        // Autobahn
        },

        // Ausrückzeit (Sekunden)
        responseTime: {
            RTW: 120,           // 2 Minuten
            NEF: 90,            // 1.5 Minuten
            KTW: 180,           // 3 Minuten
            ITW: 150,           // 2.5 Minuten
            Kdow: 60            // 1 Minute
        },

        // Einsatz-Dauer (Minuten)
        incidentDuration: {
            min: 15,
            max: 60,
            average: 30
        },

        // FMS-Status Auto-Update
        autoFMSUpdate: true,
        fmsUpdateInterval: 5000 // 5 Sekunden
    },

    // =============================
    // MAP SETTINGS
    // =============================
    MAP: {
        // Startposition (Waiblingen)
        center: [48.8309415, 9.3256194],
        zoom: 11,

        // Karten-Style
        style: 'streets', // 'streets', 'satellite', 'dark'

        // Layer
        showVehicles: true,
        showStations: true,
        showIncidents: true,
        showHospitals: true,

        // Auto-Center auf aktiven Einsatz
        autoCenterOnIncident: true,

        // Routing-Service
        routingService: 'osrm' // 'osrm', 'graphhopper'
    },

    // =============================
    // UI SETTINGS
    // =============================
    UI: {
        // Sprache
        language: 'de',

        // Theme
        theme: 'dark', // 'light', 'dark', 'auto'

        // Sounds
        soundEnabled: true,
        soundVolume: 0.7,

        // Notifications
        notificationsEnabled: true,
        notificationDuration: 5000,

        // Klingelton-Dauer
        ringtoneMaxDuration: 30000, // 30 Sekunden

        // Animationen
        animationsEnabled: true,

        // Compact Mode (für kleinere Bildschirme)
        compactMode: false
    },

    // =============================
    // GROQ AI SETTINGS
    // =============================
    GROQ: {
        // Model
        model: 'llama-3.3-70b-versatile',

        // Temperature (0.0 - 1.0)
        temperature: 0.8,

        // Max Tokens
        maxTokens: 2000,

        // Timeout (ms)
        timeout: 30000,

        // Retry bei Fehler
        retryOnError: true,
        maxRetries: 3
    },

    // =============================
    // LOGGING & DEBUG
    // =============================
    DEBUG: {
        // Console Logging
        enabled: true,
        level: 'info', // 'debug', 'info', 'warn', 'error'

        // Performance Tracking
        trackPerformance: true,

        // API Calls loggen
        logAPICalls: true
    },

    // =============================
    // STATISTICS & ANALYTICS
    // =============================
    ANALYTICS: {
        // Lokale Statistiken speichern
        saveLocalStats: true,

        // Session-Tracking
        trackSessions: true,

        // Export-Format
        exportFormat: 'json' // 'json', 'csv'
    },

    // =============================
    // METHODS
    // =============================

    /**
     * Lädt Konfiguration aus LocalStorage
     */
    load() {
        console.group('⚙️ LOADING CONFIG');

        // Groq API Key
        const savedApiKey = localStorage.getItem('groq_api_key');
        if (savedApiKey) {
            this.GROQ_API_KEY = savedApiKey;
            console.log('✅ Groq API Key geladen');
        } else {
            console.warn('⚠️ Kein Groq API Key gefunden');
        }

        // Game Settings
        const savedDifficulty = localStorage.getItem('game_difficulty');
        if (savedDifficulty) {
            this.GAME.difficulty = savedDifficulty;
        }

        const savedTheme = localStorage.getItem('ui_theme');
        if (savedTheme) {
            this.UI.theme = savedTheme;
        }

        const savedSoundEnabled = localStorage.getItem('sound_enabled');
        if (savedSoundEnabled !== null) {
            this.UI.soundEnabled = savedSoundEnabled === 'true';
        }

        console.log('✅ Konfiguration geladen');
        console.groupEnd();
    },

    /**
     * Speichert Konfiguration in LocalStorage
     */
    save() {
        if (this.GROQ_API_KEY) {
            localStorage.setItem('groq_api_key', this.GROQ_API_KEY);
        }
        localStorage.setItem('game_difficulty', this.GAME.difficulty);
        localStorage.setItem('ui_theme', this.UI.theme);
        localStorage.setItem('sound_enabled', this.UI.soundEnabled.toString());

        console.log('✅ Konfiguration gespeichert');
    },

    /**
     * Setzt API Key
     */
    setApiKey(key) {
        this.GROQ_API_KEY = key;
        localStorage.setItem('groq_api_key', key);
        console.log('✅ Groq API Key gesetzt');
    },

    /**
     * Setzt Schwierigkeitsgrad
     */
    setDifficulty(level) {
        if (!['easy', 'normal', 'hard', 'expert'].includes(level)) {
            console.error('❌ Ungültiger Schwierigkeitsgrad:', level);
            return;
        }
        this.GAME.difficulty = level;
        this.save();
        console.log('✅ Schwierigkeitsgrad geändert:', level);
    },

    /**
     * Toggle Sound
     */
    toggleSound() {
        this.UI.soundEnabled = !this.UI.soundEnabled;
        this.save();
        return this.UI.soundEnabled;
    },

    /**
     * Setzt Theme
     */
    setTheme(theme) {
        if (!['light', 'dark', 'auto'].includes(theme)) {
            console.error('❌ Ungültiges Theme:', theme);
            return;
        }
        this.UI.theme = theme;
        this.save();
        this.applyTheme();
    },

    /**
     * Wendet Theme an
     */
    applyTheme() {
        document.body.className = `theme-${this.UI.theme}`;
        console.log('🎨 Theme angewendet:', this.UI.theme);
    },

    /**
     * Validiert Konfiguration
     */
    validate() {
        const errors = [];

        if (!this.GROQ_API_KEY) {
            errors.push('Kein Groq API Key konfiguriert');
        }

        if (errors.length > 0) {
            console.warn('⚠️ Konfigurations-Probleme:', errors);
            return false;
        }

        console.log('✅ Konfiguration valide');
        return true;
    },

    /**
     * Reset auf Standardwerte
     */
    reset() {
        if (!confirm('Möchten Sie die Konfiguration wirklich zurücksetzen?')) {
            return;
        }

        localStorage.removeItem('groq_api_key');
        localStorage.removeItem('game_difficulty');
        localStorage.removeItem('ui_theme');
        localStorage.removeItem('sound_enabled');

        // Seite neu laden um Defaults zu laden
        window.location.reload();
    },

    /**
     * Zeigt Konfigurations-UI
     */
    showSettingsUI() {
        console.log('⚙️ Settings UI wird geöffnet');
        // TODO: Settings Modal öffnen
    }
};

// Auto-Load bei Initialisierung
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        CONFIG.load();
        CONFIG.applyTheme();
    });
}