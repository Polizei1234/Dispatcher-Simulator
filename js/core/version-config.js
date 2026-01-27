// =========================
// CENTRAL VERSION MANAGER v2.6
// SINGLE SOURCE OF TRUTH für Version
// ✅ v7.2.0: Unified Status System - Alte Systeme entfernt!
// =========================

const VERSION_CONFIG = {
    // ✅ VERSION NUR HIER ÄNDERN!
    VERSION: '7.2.0',
    BUILD_DATE: new Date().toLocaleString('de-DE', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }),
    
    // ✅ FIX: Tracking für bereits geladene Scripts
    loadedScripts: new Set(),
    loadedCSS: new Set(),
    
    /**
     * Generiert versionierte URL für Cache-Busting
     * @param {string} path - Dateipfad
     * @returns {string} Versionierte URL
     */
    getVersionedUrl: function(path) {
        return `${path}?v=${this.VERSION}`;
    },
    
    /**
     * CSS-Dateien die geladen werden müssen
     * ✅ v7.2.0: Keine Änderungen
     */
    CSS_FILES: [
        'css/style.css',
        'css/theme-light.css',
        'css/map-icons.css',
        'css/draggable.css',
        'css/tabs.css',
        'css/call-system.css',
        'css/priority-dropdown.css',
        'css/universal-dropdown.css',
        'css/keywords-dropdown.css',
        'css/radio-tab.css',
        'css/radio.css'
    ],
    
    /**
     * JavaScript-Dateien in Ladereihenfolge
     * 
     * ✅ v7.0.0 (Phase 1): Kompositions-System
     *   - severity-bases.js, incident-types.js, incident-modifiers.js
     *   - incident-composer.js, conversation-pools.js
     * 
     * ✅ v7.1.0 (Phase 2): AI Integration & Dynamische Systeme
     *   - ai-incident-generator.js v3.0 (nutzt Composer)
     *   - escalation-system.js v2.0 (Schema-basiert)
     *   - conversation-engine.js v1.0 (dynamische Fragen)
     * 
     * ✅ v7.2.0 (Phase 3): Unified Status System
     *   - unified-status-system.js (EINZIGES Status-System!)
     *   - ❌ status-0-5-system.js ENTFERNT
     *   - ❌ status-integration.js ENTFERNT
     */
    JS_FILES: [
        // Core
        'js/systems/theme-manager.js',
        'js/core/config.js',
        'js/core/incident-manager.js',
        
        // Utils
        'js/utils/settings-manager.js',
        'js/utils/location-generator.js',
        'js/utils/incident-numbering.js',
        'js/utils/vehicle-analyzer.js',
        'js/utils/address-service.js',
        'js/utils/notification-system.js',
        'js/utils/scoring-system.js',
        'js/utils/tutorial.js',
        
        // 🆕 PHASE 1 (v7.0.0) - Kompositions-System
        'js/data/severity-bases.js',         // 3 Schweregrade: MINOR, MODERATE, CRITICAL
        'js/data/incident-types.js',         // 8 Einsatzarten: MEDICAL, TRAFFIC, BIRTH, etc.
        'js/data/incident-modifiers.js',     // 5 Modifikatoren: ENTRAPMENT, FIRE, etc.
        'js/core/incident-composer.js',      // Kompositions-Engine: 120+ Kombinationen
        'js/data/conversation-pools.js',     // 50+ Fragen-Templates
        
        // Data (NACH Kompositions-System!)
        'js/data/hospitals.js',
        'js/data/incidents.js',
        'js/data/data.js',
        
        // Systems
        'js/systems/weather-system.js',
        'js/systems/ai-incident-generator.js',   // 🆕 v7.1.0: Nutzt incident-composer!
        'js/systems/escalation-system.js',       // 🆕 v7.1.0: Schema-basierte Eskalation!
        'js/systems/groq-validator.js',
        'js/systems/call-system.js',
        'js/systems/conversation-engine.js',     // 🆕 v7.1.0: Dynamische Fragen & Follow-Ups!
        'js/systems/mission-timer.js',
        'js/systems/vehicle-movement.js',
        'js/systems/unified-status-system.js',   // ✅ v7.2.0: EINZIGES Status-System!
        'js/systems/radio-system.js',
        'js/systems/vehicle-radio-requests.js',
        
        // UI - Radio zuerst!
        'js/ui/radio-feed.js',
        'js/ui/radio-vehicle-control.js',
        'js/ui/ui-helpers.js',
        'js/ui/priority-dropdown.js',
        'js/ui/universal-dropdown.js',
        'js/ui/keywords-dropdown.js',
        'js/ui/protocol-form.js',
        'js/ui/assignment-ui.js',
        'js/ui/manual-incident.js',
        'js/ui/tabs.js',
        'js/ui/ui.js',
        'js/ui/draggable.js',
        'js/ui/ui-radio.js',
        'js/ui/radio-ui-enhancements.js',
        
        // Map & AI
        'js/map.js',
        'js/ai.js',
        
        // Core Game Logic
        'js/core/game.js',
        'js/core/main.js',
        'js/core/bridge.js',
        
        // Debug (last)
        'js/systems/debug-menu.js'
    ],
    
    /**
     * Externe Libraries (CDN)
     */
    EXTERNAL_LIBS: {
        css: [
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
            'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ],
        js: [
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
            'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js'
        ]
    },
    
    /**
     * ✅ FIX: Normalisiert URLs für Vergleich
     */
    normalizeUrl: function(url) {
        return url.split('?')[0].toLowerCase().trim();
    },
    
    /**
     * Lädt alle CSS-Dateien dynamisch
     * ✅ FIX: Verhindert doppeltes Laden
     */
    loadCSS: function() {
        // Externe CSS
        this.EXTERNAL_LIBS.css.forEach(url => {
            const normalized = this.normalizeUrl(url);
            if (this.loadedCSS.has(normalized)) {
                console.warn(`⚠️ CSS bereits geladen, überspringe: ${url}`);
                return;
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            document.head.appendChild(link);
            this.loadedCSS.add(normalized);
        });
        
        // Lokale CSS mit Versionierung
        this.CSS_FILES.forEach(path => {
            const normalized = this.normalizeUrl(path);
            if (this.loadedCSS.has(normalized)) {
                console.warn(`⚠️ CSS bereits geladen, überspringe: ${path}`);
                return;
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = this.getVersionedUrl(path);
            document.head.appendChild(link);
            this.loadedCSS.add(normalized);
        });
        
        console.log(`✅ ${this.CSS_FILES.length} CSS-Dateien geladen (v${this.VERSION})`);
    },
    
    /**
     * Lädt alle JavaScript-Dateien dynamisch und sequenziell
     */
    loadJS: async function() {
        try {
            // Externe JS
            for (const url of this.EXTERNAL_LIBS.js) {
                await this.loadScript(url, false);
            }
            
            // Lokale JS mit Versionierung
            for (const path of this.JS_FILES) {
                await this.loadScript(path, true);
            }
            
            console.log(`✅ ${this.JS_FILES.length} JS-Dateien erfolgreich geladen (v${this.VERSION})`);
        } catch (error) {
            console.error('❌ Fehler beim Laden der JS-Dateien:', error);
            throw error;
        }
    },
    
    /**
     * Lädt einzelnes Script asynchron
     */
    loadScript: function(path, addVersion = true) {
        return new Promise((resolve, reject) => {
            const normalized = this.normalizeUrl(path);
            
            if (this.loadedScripts.has(normalized)) {
                console.warn(`⚠️ Script bereits geladen, überspringe: ${path}`);
                resolve();
                return;
            }
            
            const existingScripts = Array.from(document.querySelectorAll('script'));
            const exists = existingScripts.some(script => {
                const scriptNormalized = this.normalizeUrl(script.src);
                return scriptNormalized === normalized;
            });
            
            if (exists) {
                console.warn(`⚠️ Script bereits im DOM, überspringe: ${path}`);
                this.loadedScripts.add(normalized);
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            const src = addVersion ? this.getVersionedUrl(path) : path;
            script.src = src;
            
            script.onload = () => {
                this.loadedScripts.add(normalized);
                console.log(`  ✓ Geladen: ${path}`);
                resolve();
            };
            
            script.onerror = (error) => {
                console.error(`  ✗ Fehler: ${path}`, error);
                reject(new Error(`Failed to load script: ${path}`));
            };
            
            document.body.appendChild(script);
        });
    },
    
    /**
     * Prüft auf Version-Update
     */
    checkForUpdate: function() {
        const STORAGE_KEY = 'app_version';
        const savedVersion = localStorage.getItem(STORAGE_KEY);
        
        if (!savedVersion) {
            localStorage.setItem(STORAGE_KEY, this.VERSION);
            console.log('📦 Erste Installation:', this.VERSION);
            return;
        }
        
        if (this.isNewerVersion(this.VERSION, savedVersion)) {
            console.log(`🚀 UPDATE: ${savedVersion} → ${this.VERSION}`);
            this.clearCache();
            localStorage.setItem(STORAGE_KEY, this.VERSION);
            this.showUpdateNotification(savedVersion);
        } else if (savedVersion === this.VERSION) {
            console.log('✅ Version aktuell:', this.VERSION);
        } else {
            console.log('⚠️ Version-Downgrade:', savedVersion, '→', this.VERSION);
            localStorage.setItem(STORAGE_KEY, this.VERSION);
        }
    },
    
    isNewerVersion: function(newVer, oldVer) {
        newVer = newVer.replace(/^v/, '');
        oldVer = oldVer.replace(/^v/, '');
        
        const newParts = newVer.split('.').map(Number);
        const oldParts = oldVer.split('.').map(Number);
        
        for (let i = 0; i < Math.max(newParts.length, oldParts.length); i++) {
            const newPart = newParts[i] || 0;
            const oldPart = oldParts[i] || 0;
            
            if (newPart > oldPart) return true;
            if (newPart < oldPart) return false;
        }
        
        return false;
    },
    
    clearCache: async function() {
        console.log('🧹 Cache wird geleert...');
        
        const keysToKeep = [
            'app_version',
            'groq_api_key',
            'game_difficulty',
            'dispatcher_theme',
            'ui_theme',
            'sound_enabled',
            'notifications_enabled',
            'auto_zoom_enabled',
            'game_speed',
            'vehicle_speed_multiplier',
            'incident_frequency',
            'user_settings'
        ];
        
        const keysToDelete = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!keysToKeep.includes(key)) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => localStorage.removeItem(key));
        sessionStorage.clear();
        
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        
        console.log('✅ Cache erfolgreich geleert');
    },
    
    showUpdateNotification: function(oldVersion) {
        if (document.readyState !== 'loading') {
            this._showNotification(oldVersion);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                this._showNotification(oldVersion);
            });
        }
    },
    
    _showNotification: function(oldVersion) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 450px;
            background: #2d3748;
            border: 2px solid #48bb78;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                <span style="font-size: 2em;">🧹</span>
                <h3 style="margin: 0; font-size: 1.2em;">Update auf v${this.VERSION}</h3>
            </div>
            <div style="margin-bottom: 15px; line-height: 1.6; color: #a0aec0;">
                <p><strong>📻 UNIFIED STATUS SYSTEM!</strong></p>
                <p style="margin: 8px 0; color: #cbd5e0;">✅ <strong>System-Konsolidierung:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px; font-size: 0.95em;">
                    <li>✅ <strong>Unified Status System v2.0</strong> - Ein einziges Status-System!</li>
                    <li>🗑️ <strong>Alte Systeme entfernt</strong> - status-0-5-system.js & status-integration.js</li>
                    <li>📻 <strong>Funkverkehr-Logging</strong> - Status-Änderungen mit Uhrzeit im Funk-Tab</li>
                    <li>🎲 <strong>Status-Kästchen</strong> - Visuelle Alt→Neu Transitionen</li>
                    <li>🚨 <strong>Status 0</strong> - NUR für Notfälle der Besatzung</li>
                    <li>📞 <strong>Status 5</strong> - Sprechwunsch mit "J"-Workflow</li>
                </ul>
                <div style="margin-top: 12px; padding: 10px; background: rgba(72, 187, 120, 0.1); border-left: 3px solid #48bb78; border-radius: 4px;">
                    <p style="margin: 0; font-size: 0.9em; color: #68d391;">
                        <strong>✨ Neu:</strong> Alle Status-Meldungen werden jetzt mit Uhrzeit und Kästchen im Funkverkehr geloggt!
                    </p>
                </div>
            </div>
            <button onclick="this.parentElement.remove()" style="
                width: 100%;
                padding: 10px;
                background: #48bb78;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 1em;
            ">Verstanden ✓</button>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 45000);
    },
    
    printInfo: function() {
        console.log('%c═══════════════════════════════════', 'color: #48bb78');
        console.log('%c🎮 Dispatcher Simulator', 'color: #48bb78; font-size: 1.5em; font-weight: bold');
        console.log('%c═══════════════════════════════════', 'color: #48bb78');
        console.log(`%c📦 Version: ${this.VERSION}`, 'color: #48bb78; font-weight: bold; font-size: 1.1em');
        console.log(`%c📅 Build: ${this.BUILD_DATE}`, 'color: #a0aec0');
        console.log(`%c📂 Dateien: ${this.JS_FILES.length} JS, ${this.CSS_FILES.length} CSS`, 'color: #a0aec0');
        console.log('%c', 'color: #a0aec0');
        console.log('%c🧹 NEU IN v7.2.0 - UNIFIED STATUS SYSTEM!', 'color: #fbbf24; font-weight: bold; font-size: 1.1em');
        console.log('%c   ✅ Unified Status System v2.0 - EINZIGES System!', 'color: #68d391');
        console.log('%c   🗑️ Alte Systeme entfernt (status-0-5, status-integration)', 'color: #68d391');
        console.log('%c   📻 Funkverkehr-Logging mit Uhrzeit', 'color: #68d391');
        console.log('%c   🎲 Status-Kästchen mit Alt→Neu Transitionen', 'color: #68d391');
        console.log('%c', 'color: #a0aec0');
        console.log('%c🆕 PHASE 2 (v7.1.0) - AI Integration:', 'color: #4299e1; font-weight: bold');
        console.log('%c   🤖 AI Generator v3.0 - Nutzt Composer', 'color: #a0aec0');
        console.log('%c   🚨 Escalation System v2.0 - Schema-basiert', 'color: #a0aec0');
        console.log('%c   💬 Conversation Engine v1.0 - Dynamische Fragen', 'color: #a0aec0');
        console.log('%c', 'color: #a0aec0');
        console.log('%c🆕 PHASE 1 (v7.0.0) - Kompositions-System:', 'color: #4299e1; font-weight: bold');
        console.log('%c   ⚖️ 3 Severity Bases (MINOR/MODERATE/CRITICAL)', 'color: #a0aec0');
        console.log('%c   🎭 8 Incident Types (MEDICAL/TRAFFIC/BIRTH/...)', 'color: #a0aec0');
        console.log('%c   ⚙️ 5 Modifiers (ENTRAPMENT/FIRE/...)', 'color: #a0aec0');
        console.log('%c   🎼 Incident Composer (120+ Kombinationen)', 'color: #a0aec0');
        console.log('%c   💬 Conversation Pools (50+ Fragen)', 'color: #a0aec0');
        console.log('%c═══════════════════════════════════', 'color: #48bb78');
    }
};

if (typeof window !== 'undefined') {
    window.VERSION_CONFIG = VERSION_CONFIG;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        VERSION_CONFIG.checkForUpdate();
        VERSION_CONFIG.printInfo();
    });
} else {
    VERSION_CONFIG.checkForUpdate();
    VERSION_CONFIG.printInfo();
}

console.log(`🚀 Central Version Manager v2.6 geladen - Version: ${VERSION_CONFIG.VERSION}`);
