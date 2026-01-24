// =========================
// VERSION MANAGER v1.5
// Automatische Version-Synchronisation mit CONFIG
// FIXED: Async Loading + CONFIG Wait
// =========================

const VersionManager = {
    STORAGE_KEY: 'app_version',
    CURRENT_VERSION: null, // Wird aus CONFIG geladen
    
    /**
     * Initialisiert den Version Manager
     */
    async init() {
        console.log('🔄 Version Manager v1.5 initialisiert');
        
        // ✅ Warte auf CONFIG
        await this.waitForConfig();
        
        // Hole aktuelle Version aus CONFIG
        this.CURRENT_VERSION = CONFIG.VERSION;
        
        console.log(`✅ Version Manager v1.5 geladen - Aktuelle Version: ${this.CURRENT_VERSION}`);
        
        // Check ob Update nötig
        this.checkForUpdate();
    },
    
    /**
     * Wartet bis CONFIG geladen ist
     */
    async waitForConfig() {
        console.log('⏳ Warte auf CONFIG...');
        
        return new Promise((resolve) => {
            const checkConfig = () => {
                if (typeof CONFIG !== 'undefined' && CONFIG.VERSION) {
                    resolve();
                } else {
                    setTimeout(checkConfig, 50);
                }
            };
            checkConfig();
        });
    },
    
    /**
     * Prüft ob ein Update verfügbar ist
     */
    checkForUpdate() {
        const savedVersion = localStorage.getItem(this.STORAGE_KEY);
        
        console.log(`📦 Gespeicherte Version: ${savedVersion || 'keine'}`);
        console.log(`🆕 Aktuelle Version: ${this.CURRENT_VERSION}`);
        
        if (!savedVersion) {
            // Erste Installation
            this.saveVersion();
            console.log('✅ Erste Installation - Version gespeichert');
            return;
        }
        
        if (this.isNewerVersion(this.CURRENT_VERSION, savedVersion)) {
            console.log('🚀 NEUE VERSION ERKANNT!');
            console.log(`📤 Update von ${savedVersion} → ${this.CURRENT_VERSION}`);
            this.performUpdate(savedVersion);
        } else if (savedVersion !== this.CURRENT_VERSION) {
            console.log('⚠️ Versions-Mismatch - Sync wird durchgeführt');
            this.saveVersion();
        } else {
            console.log('✅ Version ist aktuell');
        }
    },
    
    /**
     * Vergleicht zwei Versionen (Semantic Versioning)
     * @param {string} newVer - Neue Version (z.B. "5.0.7")
     * @param {string} oldVer - Alte Version (z.B. "5.0.6")
     * @returns {boolean} true wenn newVer > oldVer
     */
    isNewerVersion(newVer, oldVer) {
        // Entferne 'v' falls vorhanden
        newVer = newVer.replace(/^v/, '');
        oldVer = oldVer.replace(/^v/, '');
        
        const newParts = newVer.split('.').map(Number);
        const oldParts = oldVer.split('.').map(Number);
        
        // Vergleiche Major.Minor.Patch
        for (let i = 0; i < Math.max(newParts.length, oldParts.length); i++) {
            const newPart = newParts[i] || 0;
            const oldPart = oldParts[i] || 0;
            
            if (newPart > oldPart) return true;
            if (newPart < oldPart) return false;
        }
        
        return false; // Versionen sind gleich
    },
    
    /**
     * Führt Update durch
     */
    async performUpdate(oldVersion) {
        try {
            console.log('🧹 Lösche Cache...');
            
            // Cache leeren
            await this.clearCache();
            
            console.log('✅ Cache erfolgreich geleert!');
            
            // Version speichern
            this.saveVersion();
            
            console.log(`✅ Version aktualisiert auf ${this.CURRENT_VERSION}`);
            
            // Update-Benachrichtigung anzeigen
            this.showUpdateNotification(oldVersion);
            
        } catch (error) {
            console.error('❌ Fehler beim Update:', error);
        }
    },
    
    /**
     * Leert Browser-Cache
     */
    async clearCache() {
        // LocalStorage Cache-Keys löschen (außer wichtige Daten)
        const keysToKeep = [
            'app_version',
            'groq_api_key',
            'game_difficulty',
            'ui_theme',
            'sound_enabled',
            'game_data',
            'user_settings'
        ];
        
        const keysToDelete = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!keysToKeep.includes(key)) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => {
            localStorage.removeItem(key);
            console.log(`  🗑️ Entfernt: ${key}`);
        });
        
        // SessionStorage leeren
        sessionStorage.clear();
        console.log('  🗑️ SessionStorage geleert');
        
        // Service Worker Cache leeren (falls vorhanden)
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(name => caches.delete(name))
            );
            console.log('  🗑️ Service Worker Caches geleert');
        }
    },
    
    /**
     * Speichert aktuelle Version
     */
    saveVersion() {
        localStorage.setItem(this.STORAGE_KEY, this.CURRENT_VERSION);
    },
    
    /**
     * Zeigt Update-Benachrichtigung
     */
    showUpdateNotification(oldVersion) {
        const changelog = this.getChangelog(oldVersion, this.CURRENT_VERSION);
        
        // Erstelle Notification
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <div class="update-header">
                    <span class="update-icon">🎉</span>
                    <h3>Update auf Version ${this.CURRENT_VERSION}</h3>
                </div>
                <div class="update-body">
                    <p><strong>Neu in dieser Version:</strong></p>
                    ${changelog}
                </div>
                <button class="update-close" onclick="this.parentElement.parentElement.remove()">
                    Verstanden
                </button>
            </div>
        `;
        
        // CSS für Notification
        const style = document.createElement('style');
        style.textContent = `
            .update-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                background: var(--card-bg, #2d3748);
                border: 2px solid var(--accent-color, #4299e1);
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .update-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .update-icon {
                font-size: 2em;
            }
            
            .update-header h3 {
                margin: 0;
                color: var(--text-primary, #fff);
            }
            
            .update-body {
                color: var(--text-secondary, #a0aec0);
                margin-bottom: 15px;
                line-height: 1.6;
            }
            
            .update-body ul {
                margin: 10px 0;
                padding-left: 20px;
            }
            
            .update-body li {
                margin: 5px 0;
            }
            
            .update-close {
                width: 100%;
                padding: 10px;
                background: var(--accent-color, #4299e1);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s;
            }
            
            .update-close:hover {
                background: var(--accent-hover, #3182ce);
                transform: translateY(-2px);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        console.log('📢 Update-Benachrichtigung angezeigt');
        
        // Auto-Close nach 30 Sekunden
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 30000);
    },
    
    /**
     * Generiert Changelog zwischen zwei Versionen
     */
    getChangelog(oldVersion, newVersion) {
        const changelogs = {
            '5.0.8': `
                <ul>
                    <li>🚨 Status 0: Notfall - Fahrzeuge können Hilfe anfordern</li>
                    <li>📡 Status 5: Sprechwunsch - Klinikzuweisung, Verstärkung, Infos, Material</li>
                    <li>✅ Fahrzeuge funken automatisch bei Bedarf an</li>
                    <li>🧹 "Allgemeiner Funkspruch" entfernt (unnötig)</li>
                    <li>🎯 Cleaner Funk-Interface nur mit Fahrzeug-Kommunikation</li>
                    <li>🎨 Prettier Radio UI mit Fahrzeug-Karten</li>
                    <li>✅ Status-Anzeige fixed (kein "undefined" mehr)</li>
                </ul>
            `,
            '5.0.7': `
                <ul>
                    <li>✅ Verstärkung anfordern: Zusätzliche Fahrzeuge zu laufenden Einsätzen schicken</li>
                    <li>✅ Stadtteil & Örtlichkeit Dropdowns mit Suchfunktion</li>
                    <li>✅ Typo-Fix: "Meldebild" korrekte Darstellung</li>
                    <li>✅ Automatische Version-Synchronisation</li>
                </ul>
            `,
            '5.0.6': `
                <ul>
                    <li>✅ Dropdown-System für Stadtteile & Örtlichkeiten</li>
                    <li>✅ 20 Stadtteile aus dem Rems-Murr-Kreis</li>
                    <li>✅ 24 besondere Örtlichkeiten kategorisiert</li>
                </ul>
            `,
            '5.0.5': `
                <ul>
                    <li>✅ Stichwort-Dropdown mit Live-Suche</li>
                    <li>✅ Intelligente Fahrzeugantworten im Funk</li>
                </ul>
            `
        };
        
        return changelogs[newVersion] || '<p>Verschiedene Verbesserungen und Bugfixes</p>';
    },
    
    /**
     * Erzwingt Update (manuell aufrufbar)
     */
    forceUpdate() {
        console.log('⚡ Erzwinge Update...');
        localStorage.removeItem(this.STORAGE_KEY);
        // Hard Reload mit Cache-Busting
        window.location.href = window.location.href.split('?')[0] + '?v=' + Date.now();
    },
    
    /**
     * Gibt Version-Info zurück
     */
    getInfo() {
        return {
            current: this.CURRENT_VERSION,
            saved: localStorage.getItem(this.STORAGE_KEY),
            buildDate: CONFIG.BUILD_DATE || 'unknown'
        };
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.VersionManager = VersionManager;
    
    // Initialisiere nach DOM-Load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            VersionManager.init();
        });
    } else {
        VersionManager.init();
    }
}

console.log('💡 Version Manager Befehle:');
console.log('VersionManager.getInfo()     - Zeigt Version-Informationen');
console.log('VersionManager.forceUpdate() - Erzwingt Cache-Leerung & Reload');

console.log('✅ Version Manager v1.5 bereit - Auto-Sync mit CONFIG.VERSION + Cache-Busting');
