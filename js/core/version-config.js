// =========================
// CENTRAL VERSION MANAGER v2.0
// SINGLE SOURCE OF TRUTH für Version
// Ersetzt dezentrale Versionspflege
// =========================

const VERSION_CONFIG = {
    // ✅ VERSION NUR HIER ÄNDERN!
    VERSION: '6.2.0',
    BUILD_DATE: new Date().toLocaleString('de-DE', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }),
    
    // ✅ FIX: Tracking für bereits geladene Scripts
    loadedScripts: new Set(),
    
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
     */
    CSS_FILES: [
        'css/style.css', // ✅ FIX: Entfernt Versionsnummer aus Dateiname
        'css/map-icons.css',
        'css/draggable.css',
        'css/tabs.css',
        'css/call-system.css',
        'css/priority-dropdown.css',
        'css/universal-dropdown.css',
        'css/keywords-dropdown.css',
        'css/radio-tab.css'
    ],
    
    /**
     * JavaScript-Dateien in Ladereihenfolge
     */
    JS_FILES: [
        // Core
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
        
        // Data
        'js/data/hospitals.js',
        'js/data/incidents.js',
        'js/data/data.js',
        
        // Systems
        'js/systems/weather-system.js',
        'js/systems/ai-incident-generator.js',
        'js/systems/mission-timer.js',
        'js/systems/escalation-system.js',
        'js/systems/groq-validator.js',
        'js/systems/call-system.js',
        'js/systems/vehicle-movement.js',
        'js/systems/radio-system.js',
        'js/systems/vehicle-radio-requests.js',
        
        // UI
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
        
        // Map & AI
        'js/map.js',
        'js/ai.js',
        
        // Core Game Logic
        'js/core/game.js',
        'js/core/main.js',
        'js/core/bridge.js',
        
        // Debug
        'js/utils/debug-menu.js'
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
     * Lädt alle CSS-Dateien dynamisch
     */
    loadCSS: function() {
        // Externe CSS
        this.EXTERNAL_LIBS.css.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            document.head.appendChild(link);
        });
        
        // Lokale CSS mit Versionierung
        this.CSS_FILES.forEach(path => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = this.getVersionedUrl(path);
            document.head.appendChild(link);
        });
        
        console.log(`✅ ${this.CSS_FILES.length} CSS-Dateien geladen (v${this.VERSION})`);
    },
    
    /**
     * Lädt alle JavaScript-Dateien dynamisch und sequenziell
     */
    loadJS: async function() {
        // Externe JS
        for (const url of this.EXTERNAL_LIBS.js) {
            await this.loadScript(url);
        }
        
        // Lokale JS mit Versionierung
        for (const path of this.JS_FILES) {
            await this.loadScript(this.getVersionedUrl(path));
        }
        
        console.log(`✅ ${this.JS_FILES.length} JS-Dateien geladen (v${this.VERSION})`);
    },
    
    /**
     * Lädt einzelnes Script asynchron
     * ✅ FIX: Verhindert doppeltes Laden
     */
    loadScript: function(src) {
        return new Promise((resolve, reject) => {
            // ✅ FIX: Prüfe ob bereits geladen
            const normalizedSrc = src.split('?')[0]; // Entferne Query-Parameter für Vergleich
            if (this.loadedScripts.has(normalizedSrc)) {
                console.warn(`⚠️ Script bereits geladen, überspringe: ${normalizedSrc}`);
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                this.loadedScripts.add(normalizedSrc);
                resolve();
            };
            script.onerror = () => reject(new Error(`Failed to load: ${src}`));
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
            // Erste Installation
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
    
    /**
     * Vergleicht Versionen (Semantic Versioning)
     */
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
    
    /**
     * Löscht Browser-Cache
     */
    clearCache: async function() {
        console.log('🧹 Cache wird geleert...');
        
        // Behalte wichtige Daten
        const keysToKeep = [
            'app_version',
            'groq_api_key',
            'game_difficulty',
            'ui_theme',
            'sound_enabled',
            'notifications_enabled',
            'auto_zoom_enabled',
            'game_speed',
            'vehicle_speed_multiplier',
            'incident_frequency',
            'user_settings'
        ];
        
        // LocalStorage aufräumen
        const keysToDelete = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!keysToKeep.includes(key)) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => localStorage.removeItem(key));
        console.log(`  🗑️ ${keysToDelete.length} LocalStorage Keys entfernt`);
        
        // SessionStorage
        sessionStorage.clear();
        console.log('  🗑️ SessionStorage geleert');
        
        // Service Worker Caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log(`  🗑️ ${cacheNames.length} Service Worker Caches geleert`);
        }
        
        console.log('✅ Cache erfolgreich geleert');
    },
    
    /**
     * Zeigt Update-Benachrichtigung
     */
    showUpdateNotification: function(oldVersion) {
        // Nur wenn DOM ready ist
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
            max-width: 400px;
            background: #2d3748;
            border: 2px solid #4299e1;
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
                <span style="font-size: 2em;">🎉</span>
                <h3 style="margin: 0; font-size: 1.2em;">Update auf v${this.VERSION}</h3>
            </div>
            <div style="margin-bottom: 15px; line-height: 1.6; color: #a0aec0;">
                <p><strong>Neu in dieser Version:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>✅ Zentrale Versionsverwaltung (nur 1 Stelle!)</li>
                    <li>✅ FMS-Status vereinheitlicht</li>
                    <li>✅ Funksystem-Bugs behoben</li>
                    <li>✅ Memory-Leaks gefixed</li>
                    <li>✅ Performance verbessert</li>
                    <li>✅ Doppeltes Script-Laden verhindert</li>
                </ul>
            </div>
            <button onclick="this.parentElement.remove()" style="
                width: 100%;
                padding: 10px;
                background: #4299e1;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 1em;
            ">Verstanden</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-Close nach 30 Sekunden
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 30000);
    },
    
    /**
     * Info für Konsole
     */
    printInfo: function() {
        console.log('%c═══════════════════════════════════', 'color: #4299e1');
        console.log('%c🎮 Dispatcher Simulator', 'color: #4299e1; font-size: 1.5em; font-weight: bold');
        console.log('%c═══════════════════════════════════', 'color: #4299e1');
        console.log(`%c📦 Version: ${this.VERSION}`, 'color: #48bb78; font-weight: bold');
        console.log(`%c📅 Build: ${this.BUILD_DATE}`, 'color: #a0aec0');
        console.log(`%c📂 Dateien: ${this.JS_FILES.length} JS, ${this.CSS_FILES.length} CSS`, 'color: #a0aec0');
        console.log('%c═══════════════════════════════════', 'color: #4299e1');
        console.log('%c💡 Befehle:', 'color: #ffc107; font-weight: bold');
        console.log('%c   VERSION_CONFIG.VERSION        ', 'color: #a0aec0');
        console.log('%c   VERSION_CONFIG.checkForUpdate()', 'color: #a0aec0');
        console.log('%c   VERSION_CONFIG.clearCache()   ', 'color: #a0aec0');
        console.log('%c═══════════════════════════════════', 'color: #4299e1');
    }
};

// Global verfügbar machen
if (typeof window !== 'undefined') {
    window.VERSION_CONFIG = VERSION_CONFIG;
}

// Auto-Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        VERSION_CONFIG.checkForUpdate();
        VERSION_CONFIG.printInfo();
    });
} else {
    VERSION_CONFIG.checkForUpdate();
    VERSION_CONFIG.printInfo();
}

console.log(`🚀 Central Version Manager v2.0 geladen - Version: ${VERSION_CONFIG.VERSION}`);
