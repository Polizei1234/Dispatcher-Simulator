// =========================
// CENTRAL VERSION MANAGER v2.7
// SINGLE SOURCE OF TRUTH für Version
// ✅ v7.2.0: CSS-Reorganisation Phase 3 abgeschlossen!
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
    
    // ... (rest of version-config.js - JS_FILES etc. bleiben gleich) ...
};

if (typeof window !== 'undefined') {
    window.VERSION_CONFIG = VERSION_CONFIG;
}

console.log(`🚀 Central Version Manager v2.7 geladen - Version: ${VERSION_CONFIG.VERSION}`);
