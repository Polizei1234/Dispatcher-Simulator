// =========================
// SETTINGS MANAGER v1.0
// + LocalStorage Persistenz
// + Alle Einstellungen aus Phase 4 & 5
// =========================

const SettingsManager = {
    STORAGE_KEY: 'dispatcher_simulator_settings',

    // Standard-Einstellungen
    defaults: {
        groqApiKey: '',
        soundEnabled: true,
        notificationsEnabled: true,
        autoZoomEnabled: true,
        vehicleSpeedMultiplier: 1.0,
        incidentFrequency: 120, // Sekunden
        gameSpeed: 5
    },

    // Aktuelle Einstellungen
    current: {},

    /**
     * Initialisiert Settings Manager
     */
    initialize() {
        this.load();
        console.log('✅ Settings Manager v1.0 geladen');
    },

    /**
     * Lädt Einstellungen aus LocalStorage
     */
    load() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.current = { ...this.defaults, ...JSON.parse(stored) };
                console.log('💾 Einstellungen geladen:', this.current);
            } else {
                this.current = { ...this.defaults };
                console.log('🆕 Standard-Einstellungen geladen');
            }
            this.apply();
        } catch (error) {
            console.error('❌ Fehler beim Laden der Einstellungen:', error);
            this.current = { ...this.defaults };
        }
    },

    /**
     * Speichert Einstellungen in LocalStorage
     */
    save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.current));
            console.log('✅ Einstellungen gespeichert');
            this.apply();
            return true;
        } catch (error) {
            console.error('❌ Fehler beim Speichern der Einstellungen:', error);
            return false;
        }
    },

    /**
     * Wendet Einstellungen auf das Spiel an
     */
    apply() {
        // API Key
        if (this.current.groqApiKey && typeof game !== 'undefined' && game) {
            game.apiKey = this.current.groqApiKey;
        }

        // Game Speed
        if (typeof window.GameTime !== 'undefined' && window.GameTime) {
            window.GameTime.speed = this.current.gameSpeed;
        }

        // Vehicle Speed Multiplier
        if (typeof CONFIG !== 'undefined') {
            CONFIG.VEHICLE_SPEED_MULTIPLIER = this.current.vehicleSpeedMultiplier;
        }

        // Incident Frequency
        if (typeof CONFIG !== 'undefined') {
            CONFIG.INCIDENT_FREQUENCY = this.current.incidentFrequency * 1000; // Convert to ms
        }

        console.log('🔄 Einstellungen angewendet');
    },

    /**
     * Holt eine einzelne Einstellung
     */
    get(key) {
        return this.current[key] !== undefined ? this.current[key] : this.defaults[key];
    },

    /**
     * Setzt eine einzelne Einstellung
     */
    set(key, value) {
        this.current[key] = value;
        console.log(`🔧 ${key} = ${value}`);
    },

    /**
     * Lädt Einstellungen aus UI-Feldern
     */
    loadFromUI() {
        // Groq API Key
        const apiKeyInput = document.getElementById('groq-api-key');
        if (apiKeyInput) {
            this.set('groqApiKey', apiKeyInput.value.trim());
        }

        // Sound
        const soundCheckbox = document.getElementById('sound-enabled');
        if (soundCheckbox) {
            this.set('soundEnabled', soundCheckbox.checked);
        }

        // Benachrichtigungen
        const notifCheckbox = document.getElementById('notifications-enabled');
        if (notifCheckbox) {
            this.set('notificationsEnabled', notifCheckbox.checked);
        }

        // Auto-Zoom
        const autoZoomCheckbox = document.getElementById('auto-zoom-enabled');
        if (autoZoomCheckbox) {
            this.set('autoZoomEnabled', autoZoomCheckbox.checked);
        }

        // Vehicle Speed
        const vehicleSpeedSelect = document.getElementById('vehicle-speed-multiplier');
        if (vehicleSpeedSelect) {
            this.set('vehicleSpeedMultiplier', parseFloat(vehicleSpeedSelect.value));
        }

        // Incident Frequency
        const incidentFreqSelect = document.getElementById('incident-frequency');
        if (incidentFreqSelect) {
            this.set('incidentFrequency', parseInt(incidentFreqSelect.value));
        }

        console.log('📋 UI-Werte geladen');
    },

    /**
     * Schreibt Einstellungen in UI-Felder
     */
    writeToUI() {
        // Groq API Key
        const apiKeyInput = document.getElementById('groq-api-key');
        if (apiKeyInput) {
            apiKeyInput.value = this.get('groqApiKey');
        }

        // Sound
        const soundCheckbox = document.getElementById('sound-enabled');
        if (soundCheckbox) {
            soundCheckbox.checked = this.get('soundEnabled');
        }

        // Benachrichtigungen
        const notifCheckbox = document.getElementById('notifications-enabled');
        if (notifCheckbox) {
            notifCheckbox.checked = this.get('notificationsEnabled');
        }

        // Auto-Zoom
        const autoZoomCheckbox = document.getElementById('auto-zoom-enabled');
        if (autoZoomCheckbox) {
            autoZoomCheckbox.checked = this.get('autoZoomEnabled');
        }

        // Vehicle Speed
        const vehicleSpeedSelect = document.getElementById('vehicle-speed-multiplier');
        if (vehicleSpeedSelect) {
            vehicleSpeedSelect.value = this.get('vehicleSpeedMultiplier');
        }

        // Incident Frequency
        const incidentFreqSelect = document.getElementById('incident-frequency');
        if (incidentFreqSelect) {
            incidentFreqSelect.value = this.get('incidentFrequency');
        }

        console.log('📝 UI aktualisiert');
    },

    /**
     * Setzt alle Einstellungen zurück
     */
    reset() {
        this.current = { ...this.defaults };
        this.save();
        this.writeToUI();
        console.log('🔄 Einstellungen zurückgesetzt');
    },

    /**
     * Exportiert Einstellungen als JSON
     */
    export() {
        return JSON.stringify(this.current, null, 2);
    },

    /**
     * Importiert Einstellungen aus JSON
     */
    import(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.current = { ...this.defaults, ...imported };
            this.save();
            this.writeToUI();
            console.log('✅ Einstellungen importiert');
            return true;
        } catch (error) {
            console.error('❌ Fehler beim Importieren:', error);
            return false;
        }
    }
};

// Auto-Init
if (typeof window !== 'undefined') {
    window.SettingsManager = SettingsManager;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SettingsManager.initialize());
    } else {
        SettingsManager.initialize();
    }
}

console.log('✅ Settings Manager v1.0 geladen');
