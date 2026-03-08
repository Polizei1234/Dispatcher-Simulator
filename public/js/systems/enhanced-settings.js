// =========================
// ERWEITERTE EINSTELLUNGEN v1.0
// Umfassendes Einstellungs-System
// =========================

class EnhancedSettings {
    constructor() {
        this.settings = this.loadSettings();
    }

    /**
     * Zeigt erweitertes Einstellungs-Menü
     */
    show() {
        const existing = document.getElementById('enhanced-settings-modal');
        if (existing) {
            existing.style.display = 'block';
            this.updateUI();
            return;
        }
        
        this.create();
    }

    /**
     * Erstellt Einstellungs-Modal
     */
    create() {
        const modal = document.createElement('div');
        modal.id = 'enhanced-settings-modal';
        modal.className = 'enhanced-settings-modal';
        modal.innerHTML = `
            <div class="enhanced-settings-container">
                <div class="enhanced-settings-header">
                    <h2>⚙️ Erweiterte Einstellungen</h2>
                    <button onclick="enhancedSettings.close()" class="btn-close">×</button>
                </div>
                
                <div class="enhanced-settings-tabs">
                    <button class="settings-tab active" onclick="enhancedSettings.switchTab('game')"> 🎮 Spiel</button>
                    <button class="settings-tab" onclick="enhancedSettings.switchTab('simulation')"> 🚑 Simulation</button>
                    <button class="settings-tab" onclick="enhancedSettings.switchTab('ui')"> 📺 Interface</button>
                    <button class="settings-tab" onclick="enhancedSettings.switchTab('audio')"> 🔊 Audio</button>
                    <button class="settings-tab" onclick="enhancedSettings.switchTab('ai')"> 🤖 KI</button>
                    <button class="settings-tab" onclick="enhancedSettings.switchTab('advanced')"> 🔧 Erweitert</button>
                </div>
                
                <div class="enhanced-settings-content">
                    <div id="settings-tab-game" class="settings-tab-content active"></div>
                    <div id="settings-tab-simulation" class="settings-tab-content"></div>
                    <div id="settings-tab-ui" class="settings-tab-content"></div>
                    <div id="settings-tab-audio" class="settings-tab-content"></div>
                    <div id="settings-tab-ai" class="settings-tab-content"></div>
                    <div id="settings-tab-advanced" class="settings-tab-content"></div>
                </div>
                
                <div class="enhanced-settings-footer">
                    <button class="btn btn-secondary" onclick="enhancedSettings.reset()">Zurücksetzen</button>
                    <button class="btn btn-success" onclick="enhancedSettings.save()">✔️ Speichern</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.addStyles();
        this.updateUI();
    }

    /**
     * Wechselt zwischen Tabs
     */
    switchTab(tabName) {
        // Deaktiviere alle
        document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
        
        // Aktiviere gewählten
        event.target.classList.add('active');
        document.getElementById(`settings-tab-${tabName}`).classList.add('active');
        
        this.renderTab(tabName);
    }

    /**
     * Aktualisiert UI mit aktuellen Einstellungen
     */
    updateUI() {
        this.renderTab('game');
    }

    /**
     * Rendert spezifischen Tab
     */
    renderTab(tabName) {
        const container = document.getElementById(`settings-tab-${tabName}`);
        if (!container) return;
        
        switch(tabName) {
            case 'game':
                container.innerHTML = this.renderGameSettings();
                break;
            case 'simulation':
                container.innerHTML = this.renderSimulationSettings();
                break;
            case 'ui':
                container.innerHTML = this.renderUISettings();
                break;
            case 'audio':
                container.innerHTML = this.renderAudioSettings();
                break;
            case 'ai':
                container.innerHTML = this.renderAISettings();
                break;
            case 'advanced':
                container.innerHTML = this.renderAdvancedSettings();
                break;
        }
    }

    renderGameSettings() {
        return `
            <div class="settings-section">
                <h3>Schwierigkeitsgrad</h3>
                <select id="difficulty" class="settings-input">
                    <option value="easy" ${this.settings.difficulty === 'easy' ? 'selected' : ''}>🟢 Einfach</option>
                    <option value="normal" ${this.settings.difficulty === 'normal' ? 'selected' : ''}>🟡 Normal</option>
                    <option value="hard" ${this.settings.difficulty === 'hard' ? 'selected' : ''}>🟠 Schwer</option>
                    <option value="expert" ${this.settings.difficulty === 'expert' ? 'selected' : ''}>🔴 Experte</option>
                </select>
                <small>Beeinflusst Einsatzhäufigkeit und Komplexität</small>
            </div>
            
            <div class="settings-section">
                <h3>Einsatzhäufigkeit</h3>
                <input type="range" id="incident-frequency" min="1" max="20" value="${this.settings.incidentFrequency}" class="settings-slider">
                <span id="incident-frequency-value">${this.settings.incidentFrequency} Minuten</span>
                <small>Durchschnittliche Zeit zwischen Einsätzen</small>
            </div>
            
            <div class="settings-section">
                <h3>Auto-Pause bei Notruf</h3>
                <label class="settings-checkbox">
                    <input type="checkbox" id="auto-pause" ${this.settings.autoPauseOnCall ? 'checked' : ''}>
                    <span>Spiel bei eingehendem Notruf automatisch pausieren</span>
                </label>
            </div>
            
            <div class="settings-section">
                <h3>Scoring</h3>
                <label class="settings-checkbox">
                    <input type="checkbox" id="scoring-enabled" ${this.settings.scoringEnabled ? 'checked' : ''}>
                    <span>Leistungsbewertung aktivieren</span>
                </label>
            </div>
            
            <div class="settings-section">
                <h3>Realismus</h3>
                <label class="settings-checkbox">
                    <input type="checkbox" id="realistic-damage" ${this.settings.realisticDamage ? 'checked' : ''}>
                    <span>Fahrzeugschäden bei Unfällen</span>
                </label>
                <label class="settings-checkbox">
                    <input type="checkbox" id="fuel-system" ${this.settings.fuelSystem ? 'checked' : ''}>
                    <span>Treibstoff-System</span>
                </label>
                <label class="settings-checkbox">
                    <input type="checkbox" id="crew-fatigue" ${this.settings.crewFatigue ? 'checked' : ''}>
                    <span>Besatzungsmüdigkeit</span>
                </label>
            </div>
        `;
    }

    renderSimulationSettings() {
        return `
            <div class="settings-section">
                <h3>Fahrzeuggeschwindigkeiten</h3>
                <div class="settings-group">
                    <label>Innerorts:</label>
                    <input type="number" id="speed-city" value="${this.settings.speedCity}" min="20" max="80" class="settings-input-small"> km/h
                </div>
                <div class="settings-group">
                    <label>Außerorts:</label>
                    <input type="number" id="speed-highway" value="${this.settings.speedHighway}" min="60" max="150" class="settings-input-small"> km/h
                </div>
            </div>
            
            <div class="settings-section">
                <h3>Ausrückzeiten (Sekunden)</h3>
                <div class="settings-group">
                    <label>RTW:</label>
                    <input type="number" id="response-rtw" value="${this.settings.responseTimeRTW}" min="30" max="300" class="settings-input-small"> Sekunden
                </div>
                <div class="settings-group">
                    <label>NEF:</label>
                    <input type="number" id="response-nef" value="${this.settings.responseTimeNEF}" min="30" max="300" class="settings-input-small"> Sekunden
                </div>
                <div class="settings-group">
                    <label>KTW:</label>
                    <input type="number" id="response-ktw" value="${this.settings.responseTimeKTW}" min="30" max="300" class="settings-input-small"> Sekunden
                </div>
            </div>
            
            <div class="settings-section">
                <h3>Einsatzdauer</h3>
                <div class="settings-group">
                    <label>Minimum:</label>
                    <input type="number" id="duration-min" value="${this.settings.durationMin}" min="5" max="60" class="settings-input-small"> Minuten
                </div>
                <div class="settings-group">
                    <label>Maximum:</label>
                    <input type="number" id="duration-max" value="${this.settings.durationMax}" min="10" max="180" class="settings-input-small"> Minuten
                </div>
            </div>
            
            <div class="settings-section">
                <h3>FMS-Auto-Update</h3>
                <label class="settings-checkbox">
                    <input type="checkbox" id="auto-fms" ${this.settings.autoFMSUpdate ? 'checked' : ''}>
                    <span>Automatische FMS-Statusänderungen</span>
                </label>
            </div>
        `;
    }

    renderUISettings() {
        return `
            <div class="settings-section">
                <h3>Theme</h3>
                <select id="theme" class="settings-input">
                    <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>🌙 Dunkel</option>
                    <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>☀️ Hell</option>
                    <option value="auto" ${this.settings.theme === 'auto' ? 'selected' : ''}>🔄 Automatisch</option>
                </select>
            </div>
            
            <div class="settings-section">
                <h3>Benachrichtigungen</h3>
                <label class="settings-checkbox">
                    <input type="checkbox" id="notifications-enabled" ${this.settings.notificationsEnabled ? 'checked' : ''}>
                    <span>Benachrichtigungen anzeigen</span>
                </label>
                <div class="settings-group">
                    <label>Anzeigedauer:</label>
                    <input type="number" id="notification-duration" value="${this.settings.notificationDuration / 1000}" min="1" max="10" class="settings-input-small"> Sekunden
                </div>
            </div>
            
            <div class="settings-section">
                <h3>Karte</h3>
                <label class="settings-checkbox">
                    <input type="checkbox" id="map-vehicles" ${this.settings.showVehicles ? 'checked' : ''}>
                    <span>Fahrzeuge anzeigen</span>
                </label>
                <label class="settings-checkbox">
                    <input type="checkbox" id="map-stations" ${this.settings.showStations ? 'checked' : ''}>
                    <span>Wachen anzeigen</span>
                </label>
                <label class="settings-checkbox">
                    <input type="checkbox" id="map-hospitals" ${this.settings.showHospitals ? 'checked' : ''}>
                    <span>Krankenhäuser anzeigen</span>
                </label>
                <label class="settings-checkbox">
                    <input type="checkbox" id="map-auto-center" ${this.settings.autoCenterOnIncident ? 'checked' : ''}>
                    <span>Automatisch auf Einsatz zentrieren</span>
                </label>
            </div>
            
            <div class="settings-section">
                <h3>Animationen</h3>
                <label class="settings-checkbox">
                    <input type="checkbox" id="animations-enabled" ${this.settings.animationsEnabled ? 'checked' : ''}>
                    <span>Animationen aktivieren</span>
                </label>
            </div>
        `;
    }

    renderAudioSettings() {
        return `
            <div class="settings-section">
                <h3>Sounds</h3>
                <label class="settings-checkbox">
                    <input type="checkbox" id="sound-enabled" ${this.settings.soundEnabled ? 'checked' : ''}>
                    <span>Sound aktivieren</span>
                </label>
            </div>
            
            <div class="settings-section">
                <h3>Lautstärke</h3>
                <div class="settings-group">
                    <label>Master:</label>
                    <input type="range" id="volume-master" min="0" max="100" value="${this.settings.volumeMaster}" class="settings-slider">
                    <span>${this.settings.volumeMaster}%</span>
                </div>
                <div class="settings-group">
                    <label>Sirenen:</label>
                    <input type="range" id="volume-sirens" min="0" max="100" value="${this.settings.volumeSirens}" class="settings-slider">
                    <span>${this.settings.volumeSirens}%</span>
                </div>
                <div class="settings-group">
                    <label>Funk:</label>
                    <input type="range" id="volume-radio" min="0" max="100" value="${this.settings.volumeRadio}" class="settings-slider">
                    <span>${this.settings.volumeRadio}%</span>
                </div>
                <div class="settings-group">
                    <label>UI-Sounds:</label>
                    <input type="range" id="volume-ui" min="0" max="100" value="${this.settings.volumeUI}" class="settings-slider">
                    <span>${this.settings.volumeUI}%</span>
                </div>
            </div>
            
            <div class="settings-section">
                <h3>Klingelton</h3>
                <div class="settings-group">
                    <label>Max. Dauer:</label>
                    <input type="number" id="ringtone-duration" value="${this.settings.ringtoneDuration / 1000}" min="5" max="60" class="settings-input-small"> Sekunden
                </div>
            </div>
        `;
    }

    renderAISettings() {
        return `
            <div class="settings-section">
                <h3>Groq API</h3>
                <div class="settings-group">
                    <label>API Key:</label>
                    <input type="password" id="groq-api-key" value="${this.settings.groqApiKey}" class="settings-input" placeholder="gsk_...">
                    <button onclick="enhancedSettings.toggleAPIKeyVisibility()" class="btn-small">👁️</button>
                </div>
                <small>🌐 Kostenlos bei <a href="https://console.groq.com/keys" target="_blank">console.groq.com/keys</a></small>
            </div>
            
            <div class="settings-section">
                <h3>KI-Model</h3>
                <select id="groq-model" class="settings-input">
                    <option value="llama-3.3-70b-versatile" ${this.settings.groqModel === 'llama-3.3-70b-versatile' ? 'selected' : ''}>Llama 3.3 70B (Empfohlen)</option>
                    <option value="llama-3.1-70b-versatile" ${this.settings.groqModel === 'llama-3.1-70b-versatile' ? 'selected' : ''}>Llama 3.1 70B</option>
                    <option value="mixtral-8x7b-32768" ${this.settings.groqModel === 'mixtral-8x7b-32768' ? 'selected' : ''}>Mixtral 8x7B</option>
                </select>
            </div>
            
            <div class="settings-section">
                <h3>Temperatur</h3>
                <input type="range" id="ai-temperature" min="0" max="100" value="${this.settings.aiTemperature * 100}" class="settings-slider">
                <span>${this.settings.aiTemperature.toFixed(1)}</span>
                <small>Höhere Werte = kreativer, niedrigere = präziser</small>
            </div>
            
            <div class="settings-section">
                <h3>Auto-Generierung</h3>
                <label class="settings-checkbox">
                    <input type="checkbox" id="ai-auto-incidents" ${this.settings.aiAutoIncidents ? 'checked' : ''}>
                    <span>Automatische KI-Einsatz-Generierung</span>
                </label>
            </div>
        `;
    }

    renderAdvancedSettings() {
        return `
            <div class="settings-section">
                <h3>Performance</h3>
                <label class="settings-checkbox">
                    <input type="checkbox" id="track-performance" ${this.settings.trackPerformance ? 'checked' : ''}>
                    <span>Performance-Tracking</span>
                </label>
                <div class="settings-group">
                    <label>Update-Intervall:</label>
                    <input type="number" id="update-interval" value="${this.settings.updateInterval}" min="500" max="5000" step="100" class="settings-input-small"> ms
                </div>
            </div>
            
            <div class="settings-section">
                <h3>Debug</h3>
                <label class="settings-checkbox">
                    <input type="checkbox" id="debug-mode" ${this.settings.debugMode ? 'checked' : ''}>
                    <span>Debug-Modus aktivieren</span>
                </label>
                <label class="settings-checkbox">
                    <input type="checkbox" id="console-logging" ${this.settings.consoleLogging ? 'checked' : ''}>
                    <span>Console-Logging</span>
                </label>
            </div>
            
            <div class="settings-section">
                <h3>Statistiken</h3>
                <label class="settings-checkbox">
                    <input type="checkbox" id="save-stats" ${this.settings.saveLocalStats ? 'checked' : ''}>
                    <span>Lokale Statistiken speichern</span>
                </label>
                <label class="settings-checkbox">
                    <input type="checkbox" id="track-sessions" ${this.settings.trackSessions ? 'checked' : ''}>
                    <span>Sessions tracken</span>
                </label>
            </div>
            
            <div class="settings-section">
                <h3>Daten</h3>
                <button class="btn btn-secondary" onclick="enhancedSettings.exportSettings()">Einstellungen exportieren</button>
                <button class="btn btn-secondary" onclick="enhancedSettings.importSettings()">Einstellungen importieren</button>
                <button class="btn btn-danger" onclick="enhancedSettings.clearAllData()">Alle Daten löschen</button>
            </div>
        `;
    }

    /**
     * Speichert Einstellungen
     */
    save() {
        // Game
        this.settings.difficulty = document.getElementById('difficulty')?.value || 'normal';
        this.settings.incidentFrequency = parseInt(document.getElementById('incident-frequency')?.value || 5);
        this.settings.autoPauseOnCall = document.getElementById('auto-pause')?.checked || false;
        this.settings.scoringEnabled = document.getElementById('scoring-enabled')?.checked || true;
        this.settings.realisticDamage = document.getElementById('realistic-damage')?.checked || false;
        this.settings.fuelSystem = document.getElementById('fuel-system')?.checked || false;
        this.settings.crewFatigue = document.getElementById('crew-fatigue')?.checked || false;
        
        // Simulation
        this.settings.speedCity = parseInt(document.getElementById('speed-city')?.value || 40);
        this.settings.speedHighway = parseInt(document.getElementById('speed-highway')?.value || 100);
        this.settings.responseTimeRTW = parseInt(document.getElementById('response-rtw')?.value || 120);
        this.settings.responseTimeNEF = parseInt(document.getElementById('response-nef')?.value || 90);
        this.settings.responseTimeKTW = parseInt(document.getElementById('response-ktw')?.value || 180);
        this.settings.durationMin = parseInt(document.getElementById('duration-min')?.value || 15);
        this.settings.durationMax = parseInt(document.getElementById('duration-max')?.value || 60);
        this.settings.autoFMSUpdate = document.getElementById('auto-fms')?.checked || true;
        
        // UI
        this.settings.theme = document.getElementById('theme')?.value || 'dark';
        this.settings.notificationsEnabled = document.getElementById('notifications-enabled')?.checked || true;
        this.settings.notificationDuration = parseInt(document.getElementById('notification-duration')?.value || 5) * 1000;
        this.settings.showVehicles = document.getElementById('map-vehicles')?.checked || true;
        this.settings.showStations = document.getElementById('map-stations')?.checked || true;
        this.settings.showHospitals = document.getElementById('map-hospitals')?.checked || true;
        this.settings.autoCenterOnIncident = document.getElementById('map-auto-center')?.checked || true;
        this.settings.animationsEnabled = document.getElementById('animations-enabled')?.checked || true;
        
        // Audio
        this.settings.soundEnabled = document.getElementById('sound-enabled')?.checked || true;
        this.settings.volumeMaster = parseInt(document.getElementById('volume-master')?.value || 70);
        this.settings.volumeSirens = parseInt(document.getElementById('volume-sirens')?.value || 70);
        this.settings.volumeRadio = parseInt(document.getElementById('volume-radio')?.value || 70);
        this.settings.volumeUI = parseInt(document.getElementById('volume-ui')?.value || 70);
        this.settings.ringtoneDuration = parseInt(document.getElementById('ringtone-duration')?.value || 30) * 1000;
        
        // AI
        this.settings.groqApiKey = document.getElementById('groq-api-key')?.value || '';
        this.settings.groqModel = document.getElementById('groq-model')?.value || 'llama-3.3-70b-versatile';
        this.settings.aiTemperature = parseInt(document.getElementById('ai-temperature')?.value || 80) / 100;
        this.settings.aiAutoIncidents = document.getElementById('ai-auto-incidents')?.checked || false;
        
        // Advanced
        this.settings.trackPerformance = document.getElementById('track-performance')?.checked || true;
        this.settings.updateInterval = parseInt(document.getElementById('update-interval')?.value || 1000);
        this.settings.debugMode = document.getElementById('debug-mode')?.checked || false;
        this.settings.consoleLogging = document.getElementById('console-logging')?.checked || true;
        this.settings.saveLocalStats = document.getElementById('save-stats')?.checked || true;
        this.settings.trackSessions = document.getElementById('track-sessions')?.checked || true;
        
        // Speichere in LocalStorage
        localStorage.setItem('enhancedSettings', JSON.stringify(this.settings));
        
        // Update Game-Konfiguration
        this.applySettings();
        
        alert('✅ Einstellungen gespeichert!');
        this.close();
    }

    /**
     * Lädt Einstellungen
     */
    loadSettings() {
        const saved = localStorage.getItem('enhancedSettings');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Defaults
        return {
            // Game
            difficulty: 'normal',
            incidentFrequency: 5,
            autoPauseOnCall: true,
            scoringEnabled: true,
            realisticDamage: false,
            fuelSystem: false,
            crewFatigue: false,
            
            // Simulation
            speedCity: 40,
            speedHighway: 100,
            responseTimeRTW: 120,
            responseTimeNEF: 90,
            responseTimeKTW: 180,
            durationMin: 15,
            durationMax: 60,
            autoFMSUpdate: true,
            
            // UI
            theme: 'dark',
            notificationsEnabled: true,
            notificationDuration: 5000,
            showVehicles: true,
            showStations: true,
            showHospitals: true,
            autoCenterOnIncident: true,
            animationsEnabled: true,
            
            // Audio
            soundEnabled: true,
            volumeMaster: 70,
            volumeSirens: 70,
            volumeRadio: 70,
            volumeUI: 70,
            ringtoneDuration: 30000,
            
            // AI
            groqApiKey: localStorage.getItem('groqApiKey') || '',
            groqModel: 'llama-3.3-70b-versatile',
            aiTemperature: 0.8,
            aiAutoIncidents: false,
            
            // Advanced
            trackPerformance: true,
            updateInterval: 1000,
            debugMode: false,
            consoleLogging: true,
            saveLocalStats: true,
            trackSessions: true
        };
    }

    /**
     * Wendet Einstellungen an
     */
    applySettings() {
        // Update CONFIG wenn verfügbar
        if (typeof CONFIG !== 'undefined') {
            CONFIG.GAME.difficulty = this.settings.difficulty;
            CONFIG.GAME.autoPauseOnCall = this.settings.autoPauseOnCall;
            CONFIG.GROQ_API_KEY = this.settings.groqApiKey;
            CONFIG.UI.theme = this.settings.theme;
            CONFIG.UI.soundEnabled = this.settings.soundEnabled;
        }
        
        // Update Game wenn verfügbar
        if (typeof game !== 'undefined' && game) {
            game.apiKey = this.settings.groqApiKey;
        }
        
        console.log('✅ Einstellungen angewendet');
    }

    /**
     * Zurücksetzen
     */
    reset() {
        if (!confirm('Möchten Sie alle Einstellungen zurücksetzen?')) return;
        
        localStorage.removeItem('enhancedSettings');
        this.settings = this.loadSettings();
        this.updateUI();
        alert('✅ Einstellungen zurückgesetzt!');
    }

    /**
     * Schließen
     */
    close() {
        const modal = document.getElementById('enhanced-settings-modal');
        if (modal) modal.style.display = 'none';
    }

    /**
     * Toggle API Key Sichtbarkeit
     */
    toggleAPIKeyVisibility() {
        const input = document.getElementById('groq-api-key');
        if (!input) return;
        
        input.type = input.type === 'password' ? 'text' : 'password';
    }

    /**
     * Exportiert Einstellungen
     */
    exportSettings() {
        const blob = new Blob([JSON.stringify(this.settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `settings-${Date.now()}.json`;
        a.click();
        alert('✅ Einstellungen exportiert!');
    }

    /**
     * Importiert Einstellungen
     */
    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    this.settings = JSON.parse(event.target.result);
                    this.save();
                    alert('✅ Einstellungen importiert!');
                } catch (error) {
                    alert('❌ Fehler beim Importieren!');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    /**
     * Löscht alle Daten
     */
    clearAllData() {
        if (!confirm('WARNUNG: Alle Daten werden gelöscht! Fortfahren?')) return;
        if (!confirm('Sind Sie WIRKLICH sicher?')) return;
        
        localStorage.clear();
        alert('✅ Alle Daten gelöscht. Seite wird neu geladen.');
        location.reload();
    }

    /**
     * Styles hinzufügen
     */
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .enhanced-settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            
            .enhanced-settings-container {
                width: 900px;
                max-width: 95vw;
                max-height: 90vh;
                background: #1a202c;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            
            .enhanced-settings-header {
                padding: 20px;
                background: #2d3748;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #3182ce;
            }
            
            .enhanced-settings-header h2 {
                margin: 0;
                color: #fff;
            }
            
            .enhanced-settings-tabs {
                display: flex;
                background: #2d3748;
                border-bottom: 1px solid #3182ce;
            }
            
            .settings-tab {
                flex: 1;
                padding: 12px;
                background: none;
                border: none;
                color: #a0aec0;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.2s;
            }
            
            .settings-tab:hover {
                background: #1a202c;
                color: #fff;
            }
            
            .settings-tab.active {
                color: #3182ce;
                border-bottom-color: #3182ce;
            }
            
            .enhanced-settings-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }
            
            .settings-tab-content {
                display: none;
            }
            
            .settings-tab-content.active {
                display: block;
            }
            
            .settings-section {
                margin-bottom: 25px;
                padding: 20px;
                background: rgba(45, 55, 72, 0.5);
                border-radius: 8px;
            }
            
            .settings-section h3 {
                margin: 0 0 15px 0;
                color: #3182ce;
                font-size: 1.1em;
            }
            
            .settings-section small {
                display: block;
                margin-top: 8px;
                color: #a0aec0;
                font-size: 0.85em;
            }
            
            .settings-input {
                width: 100%;
                padding: 10px;
                background: #0f1419;
                border: 2px solid #3182ce;
                border-radius: 6px;
                color: #fff;
                font-size: 1em;
            }
            
            .settings-input-small {
                width: 100px;
                padding: 8px;
                background: #0f1419;
                border: 2px solid #3182ce;
                border-radius: 6px;
                color: #fff;
            }
            
            .settings-slider {
                width: 100%;
                margin: 10px 0;
            }
            
            .settings-checkbox {
                display: flex;
                align-items: center;
                margin: 10px 0;
                cursor: pointer;
            }
            
            .settings-checkbox input {
                margin-right: 10px;
                width: 20px;
                height: 20px;
            }
            
            .settings-group {
                display: flex;
                align-items: center;
                gap: 10px;
                margin: 10px 0;
            }
            
            .settings-group label {
                min-width: 120px;
                color: #a0aec0;
            }
            
            .enhanced-settings-footer {
                padding: 20px;
                background: #2d3748;
                border-top: 2px solid #3182ce;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
        `;
        document.head.appendChild(style);
    }
}

const enhancedSettings = new EnhancedSettings();

if (typeof window !== 'undefined') {
    window.enhancedSettings = enhancedSettings;
}

console.log('✅ Erweiterte Einstellungen geladen');