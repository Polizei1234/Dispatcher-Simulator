// =========================
// THEME MANAGER v1.0
// Dark/Light Mode Toggle System
// =========================

class ThemeManager {
    constructor() {
        this.currentTheme = 'dark'; // Default theme
        this.STORAGE_KEY = 'dispatcher_theme';
        
        this.init();
    }
    
    /**
     * Initialisiert Theme-System
     */
    init() {
        console.log('🎨 Theme Manager initialisiert');
        
        // Lade gespeichertes Theme aus localStorage
        this.loadSavedTheme();
        
        // Wende Theme an
        this.applyTheme(this.currentTheme);
        
        // Setze Theme-Toggle in Einstellungen
        this.setupThemeToggle();
    }
    
    /**
     * Lädt gespeichertes Theme aus localStorage
     */
    loadSavedTheme() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
            this.currentTheme = savedTheme;
            console.log(`✅ Theme geladen: ${savedTheme}`);
        } else {
            console.log('ℹ️ Kein gespeichertes Theme gefunden, nutze Standard: dark');
        }
    }
    
    /**
     * Wendet Theme an (setzt data-theme Attribut)
     */
    applyTheme(theme) {
        console.log(`🎨 Wende Theme an: ${theme}`);
        
        // Setze data-theme Attribut auf HTML-Element
        document.documentElement.setAttribute('data-theme', theme);
        
        // Speichere in localStorage
        localStorage.setItem(this.STORAGE_KEY, theme);
        
        // Update currentTheme
        this.currentTheme = theme;
        
        // Update Toggle-Button (falls vorhanden)
        this.updateToggleButton();
    }
    
    /**
     * Wechselt zwischen Dark und Light Theme
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        
        console.log(`🔄 Theme gewechselt: ${this.currentTheme}`);
        
        // Animation für Feedback
        this.showThemeChangeAnimation();
    }
    
    /**
     * Gibt aktuelles Theme zurück
     */
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    /**
     * Setzt Theme explizit
     */
    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.applyTheme(theme);
        } else {
            console.warn('⚠️ Ungültiges Theme:', theme);
        }
    }
    
    /**
     * Setup Theme-Toggle in Einstellungen
     */
    setupThemeToggle() {
        const settingsContainer = document.querySelector('.settings-container');
        if (!settingsContainer) return;
        
        // Prüfe ob Theme-Auswahl schon existiert
        let themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            // Update bestehenden Select
            themeSelect.value = this.currentTheme;
            themeSelect.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
            return;
        }
        
        // Erstelle Theme-Einstellung (falls nicht vorhanden)
        const themeSettingHTML = `
            <div class="setting-item" id="theme-setting">
                <label for="theme-select">
                    <i class="fas fa-palette"></i> Design-Theme
                </label>
                <select id="theme-select" class="form-control">
                    <option value="dark">🌙 Dark Mode (Standard)</option>
                    <option value="light">☀️ Light Mode (Whitemode)</option>
                </select>
                <small style="color: var(--text-muted); margin-top: 6px; display: block;">
                    Wechsel zwischen dunklem und hellem Design
                </small>
            </div>
        `;
        
        // Füge nach Spielgeschwindigkeit ein
        const speedSetting = document.querySelector('.setting-item:has(#speedMultiplier)');
        if (speedSetting) {
            speedSetting.insertAdjacentHTML('afterend', themeSettingHTML);
        } else {
            // Füge am Ende der Einstellungen ein
            const lastSetting = settingsContainer.querySelector('.setting-item:last-of-type');
            if (lastSetting) {
                lastSetting.insertAdjacentHTML('afterend', themeSettingHTML);
            }
        }
        
        // Event Listener hinzufügen
        themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = this.currentTheme;
            themeSelect.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        }
    }
    
    /**
     * Update Toggle-Button Text/Icon
     */
    updateToggleButton() {
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = this.currentTheme;
        }
    }
    
    /**
     * Zeigt kurze Animation bei Theme-Wechsel
     */
    showThemeChangeAnimation() {
        // Erstelle temporäre Overlay-Animation
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${this.currentTheme === 'light' ? '#ffffff' : '#000000'};
            opacity: 0;
            pointer-events: none;
            z-index: 99999;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Fade in
        requestAnimationFrame(() => {
            overlay.style.opacity = '0.5';
        });
        
        // Fade out & remove
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        }, 150);
    }
    
    /**
     * Erstellt Theme-Toggle Button (optional, für Header)
     */
    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'btn btn-small theme-toggle-btn';
        button.innerHTML = this.currentTheme === 'dark' ? 
            '<i class="fas fa-sun"></i> Light Mode' : 
            '<i class="fas fa-moon"></i> Dark Mode';
        
        button.addEventListener('click', () => {
            this.toggleTheme();
            button.innerHTML = this.currentTheme === 'dark' ? 
                '<i class="fas fa-sun"></i> Light Mode' : 
                '<i class="fas fa-moon"></i> Dark Mode';
        });
        
        return button;
    }
    
    /**
     * Fügt Toggle-Button zum Header hinzu (optional)
     */
    addToggleButtonToHeader() {
        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            const toggleBtn = this.createToggleButton();
            headerRight.insertBefore(toggleBtn, headerRight.firstChild);
        }
    }
}

// Globale Instanz erstellen
window.themeManager = new ThemeManager();

console.log('🎨 Theme Manager v1.0 geladen');
