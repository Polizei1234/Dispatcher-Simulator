// =========================
// VERSION MANAGER v1.2
// Automatisches Cache-Management bei neuen Versionen
// ✅ Version wird jetzt automatisch aus CONFIG.VERSION geladen!
// =========================

const VersionManager = {
    // ✅ Version wird dynamisch aus CONFIG geladen
    get CURRENT_VERSION() {
        // Falls CONFIG noch nicht geladen ist, Fallback
        return (typeof CONFIG !== 'undefined' && CONFIG.VERSION) ? CONFIG.VERSION : '5.0.2';
    },
    
    STORAGE_KEY: 'ils_waiblingen_version',

    initialize() {
        console.log('🔄 Version Manager v1.2 initialisiert');
        
        // Warte kurz bis CONFIG geladen ist
        if (typeof CONFIG === 'undefined') {
            console.log('⏳ Warte auf CONFIG...');
            setTimeout(() => this.checkVersion(), 100);
        } else {
            this.checkVersion();
        }
    },

    checkVersion() {
        const storedVersion = localStorage.getItem(this.STORAGE_KEY);
        const currentVersion = this.CURRENT_VERSION;
        
        console.log(`📦 Gespeicherte Version: ${storedVersion}`);
        console.log(`🆕 Aktuelle Version: ${currentVersion}`);

        if (!storedVersion) {
            // Erste Installation
            console.log('✨ Erste Installation erkannt');
            localStorage.setItem(this.STORAGE_KEY, currentVersion);
            this.showWelcomeMessage();
            return;
        }

        if (storedVersion !== currentVersion) {
            // Neue Version erkannt!
            console.log('🚀 NEUE VERSION ERKANNT!');
            console.log(`📤 Update von ${storedVersion} → ${currentVersion}`);
            
            this.clearCache();
            this.updateVersion();
            this.showUpdateNotification(storedVersion, currentVersion);
        } else {
            console.log('✅ Version ist aktuell');
        }
    },

    clearCache() {
        console.log('🧹 Lösche Cache...');
        
        // 1. LocalStorage bereinigen (außer wichtige Daten)
        const keysToKeep = [
            this.STORAGE_KEY,
            'groq_api_key',
            'groqApiKey',
            'game_speed',
            'sound_enabled',
            'vehicle_speed_multiplier',
            'incident_frequency',
            'notifications_enabled',
            'auto_zoom_enabled'
        ];

        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
            if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
                console.log(`  🗑️ Entfernt: ${key}`);
            }
        });

        // 2. SessionStorage komplett leeren
        sessionStorage.clear();
        console.log('  🗑️ SessionStorage geleert');

        // 3. Cache API leeren (für Service Worker)
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                    console.log(`  🗑️ Cache gelöscht: ${name}`);
                });
            });
        }

        console.log('✅ Cache erfolgreich geleert!');
    },

    updateVersion() {
        localStorage.setItem(this.STORAGE_KEY, this.CURRENT_VERSION);
        console.log(`✅ Version aktualisiert auf ${this.CURRENT_VERSION}`);
    },

    showUpdateNotification(oldVersion, newVersion) {
        // ✅ Release Notes für Version 5.0.2
        const releaseNotes = this.getReleaseNotes(newVersion);
        
        // Erstelle Update-Banner
        const banner = document.createElement('div');
        banner.id = 'update-notification';
        banner.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 25px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            max-width: 400px;
            animation: slideInRight 0.5s ease-out;
            font-family: Arial, sans-serif;
        `;

        banner.innerHTML = `
            <div style="display: flex; align-items: start; gap: 15px;">
                <div style="font-size: 32px;">🆕</div>
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">
                        Update auf v${newVersion}!
                    </h3>
                    <p style="margin: 0 0 8px 0; font-size: 14px; opacity: 0.9;">
                        Version <strong>${oldVersion}</strong> → <strong>${newVersion}</strong>
                    </p>
                    <div style="margin: 0; font-size: 13px; opacity: 0.8;">
                        ${releaseNotes}
                    </div>
                    <button onclick="VersionManager.closeNotification()" style="
                        margin-top: 12px;
                        padding: 8px 16px;
                        background: rgba(255,255,255,0.2);
                        border: 1px solid rgba(255,255,255,0.3);
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 600;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                        <i class="fas fa-check"></i> Verstanden
                    </button>
                </div>
                <button onclick="VersionManager.closeNotification()" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    opacity: 0.7;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    line-height: 1;
                " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                    ×
                </button>
            </div>
        `;

        // CSS Animation hinzufügen
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(banner);

        // Auto-Close nach 15 Sekunden
        setTimeout(() => {
            this.closeNotification();
        }, 15000);

        console.log('📢 Update-Benachrichtigung angezeigt');
    },
    
    // ✅ Release Notes für verschiedene Versionen
    getReleaseNotes(version) {
        const notes = {
            '5.0.2': `
                ✅ FMS-Status wird jetzt korrekt angezeigt<br>
                ✅ Fahrzeuge auf Wache sind unsichtbar<br>
                ✅ Status-Badges in Fahrzeug-Tab & Wachen<br>
                ✅ Farbcodierung funktioniert
            `,
            '5.0.1': `
                ✅ Fahrzeuge fahren jetzt los!<br>
                ✅ NEF bleibt am Einsatzort<br>
                ✅ RTW ohne Wartezeit<br>
                ✅ Krankenhäuser auf Karte
            `,
            '5.0.0': `
                ✅ Neues FMS-System<br>
                ✅ Radio-System verbessert<br>
                ✅ UI-Verbesserungen<br>
                ✅ Bug-Fixes
            `
        };
        
        return notes[version] || '✅ Diverse Verbesserungen und Bug-Fixes';
    },

    showWelcomeMessage() {
        console.log('👋 Zeige Willkommensnachricht für Erstinstallation');
        // Optional: Hier könnte eine Willkommensnachricht angezeigt werden
    },

    closeNotification() {
        const banner = document.getElementById('update-notification');
        if (banner) {
            banner.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    },

    // Manuelle Version-Check-Funktion (für Debugging)
    forceUpdate() {
        console.log('🔧 Erzwinge Update...');
        localStorage.removeItem(this.STORAGE_KEY);
        this.clearCache();
        window.location.reload();
    },

    // Version-Info für Console
    getInfo() {
        const currentVersion = this.CURRENT_VERSION;
        const storedVersion = localStorage.getItem(this.STORAGE_KEY);
        
        return {
            currentVersion: currentVersion,
            storedVersion: storedVersion,
            isUpToDate: storedVersion === currentVersion,
            source: 'CONFIG.VERSION'
        };
    }
};

// Auto-Initialize beim Laden der Seite (SEHR FRÜH!)
if (typeof window !== 'undefined') {
    // Sofort beim Script-Load ausführen
    VersionManager.initialize();
    
    // Auch für Console verfügbar machen
    window.VersionManager = VersionManager;
    
    // Debug-Befehle in Console verfügbar machen
    console.log('%c💡 Version Manager Befehle:', 'color: #2196F3; font-weight: bold; font-size: 14px;');
    console.log('%cVersionManager.getInfo()     - Zeigt Version-Informationen', 'color: #666;');
    console.log('%cVersionManager.forceUpdate() - Erzwingt Cache-Leerung & Reload', 'color: #666;');
}

console.log(`✅ Version Manager v1.2 geladen - Aktuelle Version: ${VersionManager.CURRENT_VERSION}`);
