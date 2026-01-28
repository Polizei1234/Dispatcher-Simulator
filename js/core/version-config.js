// =========================
// CENTRAL VERSION MANAGER v2.8.0
// SINGLE SOURCE OF TRUTH für Version
// ✅ v7.3.0: Radio-System optimiert! (4 Dateien → 2 Dateien)
// ✅ v7.2.0: CSS-Reorganisation Phase 3 abgeschlossen!
// ✅ v2.7.1: notification-system.js entfernt (existiert nicht)
// =========================

const VERSION_CONFIG = {
    // ✅ VERSION NUR HIER ÄNDERN!
    VERSION: '7.3.0',
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
     * ✅ v7.2.0: Komplett neue Struktur!
     */
    CSS_FILES: [
        'css/style.css',
        'css/layout.css',
        
        // Components
        'css/components/call-system.css',
        'css/components/draggable.css',
        'css/components/tabs.css',
        
        // Dropdowns
        'css/components/dropdowns/keywords-dropdown.css',
        'css/components/dropdowns/priority-dropdown.css',
        'css/components/dropdowns/universal-dropdown.css',
        
        // Radio
        'css/radio/radio.css',
        'css/radio/radio-feed.css',
        'css/radio/radio-tab.css',
        
        // Themes
        'css/themes/theme-light.css',
        
        // Map
        'css/map/map-icons.css'
    ],
    
    /**
     * JavaScript-Dateien in Ladereihenfolge
     * 
     * ✅ v7.3.0 (Phase 4): Radio-System Optimierung
     *   - radio-messages.js (merged: radio-feed.js + radio-ui-enhancements.js)
     *   - radio-controls.js (renamed: radio-vehicle-control.js)
     *   - Alte Dateien entfernt: ui-radio.js, radio-ui-enhancements.js, radio-feed.js, radio-vehicle-control.js
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
     * ✅ v7.2.0 (Phase 3): Unified Status System + CSS-Reorganisation
     *   - unified-status-system.js (EINZIGES Status-System!)
     *   - CSS-Struktur komplett neu organisiert
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
        'js/utils/scoring-system.js',
        'js/utils/tutorial.js',
        
        // 🆕 PHASE 1 (v7.0.0) - Kompositions-System
        'js/data/severity-bases.js',
        'js/data/incident-types.js',
        'js/data/incident-modifiers.js',
        'js/core/incident-composer.js',
        'js/data/conversation-pools.js',
        
        // Data (NACH Kompositions-System!)
        'js/data/hospitals.js',
        'js/data/incidents.js',
        'js/data/data.js',
        
        // Systems
        'js/systems/weather-system.js',
        'js/systems/ai-incident-generator.js',
        'js/systems/escalation-system.js',
        'js/systems/groq-validator.js',
        'js/systems/call-system.js',
        'js/systems/conversation-engine.js',
        'js/systems/mission-timer.js',
        'js/systems/vehicle-movement.js',
        'js/systems/unified-status-system.js',
        'js/systems/radio-system.js',
        'js/systems/vehicle-radio-requests.js',
        
        // 🔥 UI - OPTIMIERTES RADIO-SYSTEM (v7.3.0)
        'js/ui/radio-messages.js',      // ✅ NEU: Merged aus radio-feed.js + radio-ui-enhancements.js
        'js/ui/radio-controls.js',      // ✅ NEU: Umbenannt von radio-vehicle-control.js
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
                <span style="font-size: 2em;">📡</span>
                <h3 style="margin: 0; font-size: 1.2em;">Update auf v${this.VERSION}</h3>
            </div>
            <div style="margin-bottom: 15px; line-height: 1.6; color: #a0aec0;">
                <p><strong>🔥 RADIO-SYSTEM OPTIMIERT!</strong></p>
                <p style="margin: 8px 0; color: #cbd5e0;">✅ <strong>Konsolidierung:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px; font-size: 0.95em;">
                    <li>❌ <strong>4 alte Dateien entfernt</strong></li>
                    <li>✅ <strong>2 neue optimierte Dateien</strong></li>
                    <li>🔄 <strong>radio-messages.js</strong> - Chat-System</li>
                    <li>🎮 <strong>radio-controls.js</strong> - Fahrzeugsteuerung</li>
                    <li>🛡️ <strong>Keine Konflikte mehr!</strong></li>
                </ul>
                <div style="margin-top: 12px; padding: 10px; background: rgba(72, 187, 120, 0.1); border-left: 3px solid #48bb78; border-radius: 4px;">
                    <p style="margin: 0; font-size: 0.9em; color: #68d391;">
                        <strong>✨ Ergebnis:</strong> Sauberer Code, bessere Performance!
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
        console.log('%c🔥 NEU IN v7.3.0 - RADIO-SYSTEM OPTIMIERT!', 'color: #fbbf24; font-weight: bold; font-size: 1.1em');
        console.log('%c   ✅ 4 alte Dateien → 2 neue optimierte Dateien', 'color: #68d391');
        console.log('%c   📡 radio-messages.js - Unified Chat-System', 'color: #68d391');
        console.log('%c   🎮 radio-controls.js - Fahrzeugsteuerung', 'color: #68d391');
        console.log('%c   🛡️ Keine Funktionskonflikte mehr!', 'color: #68d391');
        console.log('%c', 'color: #a0aec0');
        console.log('%c📁 PHASE 3 (v7.2.0) - CSS-REORGANISATION:', 'color: #4299e1; font-weight: bold');
        console.log('%c   📂 Neue Ordnerstruktur: components/, radio/, themes/, map/', 'color: #a0aec0');
        console.log('%c   ✅ Alle CSS-Dateien thematisch gruppiert', 'color: #a0aec0');
        console.log('%c   🧹 Alte Root-Dateien entfernt', 'color: #a0aec0');
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

console.log(`🚀 Central Version Manager v2.8.0 geladen - Version: ${VERSION_CONFIG.VERSION}`);
