// =========================
// RADIO MESSAGES SYSTEM v4.0 - OPTIMIERT & UNIFIED
// Funkverkehr-Nachrichten mit Chat-Interface
// 
// ✅ Merge von: radio-feed.js + radio-ui-enhancements.js
// ✅ Eine einzige addRadioMessage() Funktion
// ✅ HTML-Support für Status-Badges
// ✅ J-Button für Sprechfreigabe
// ✅ Alle Styles integriert
// ✅ Sound-System
// =========================

console.log('%c📻 RADIO MESSAGES SYSTEM v4.0 WIRD GELADEN...', 'background: #3182ce; color: white; padding: 5px 10px; font-size: 14px; font-weight: bold;');

/**
 * RadioChatSystem - Zentrale Nachrichten-Verwaltung
 */
class RadioChatSystem {
    constructor() {
        this.messages = [];
        this.maxMessages = 200;
        this.chatContainer = null;
        this.isReady = false;
        
        console.log('📻 Radio Messages System v4.0 wird initialisiert...');
        this.init();
    }
    
    /**
     * Initialisierung
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupChat());
        } else {
            this.setupChat();
        }
        
        // Injiziere Styles
        this.injectStyles();
    }
    
    /**
     * Richtet Chat-Container ein
     */
    setupChat() {
        console.log('🔍 Suche #radio-feed-full Element...');
        
        this.chatContainer = document.getElementById('radio-feed-full');
        
        if (!this.chatContainer) {
            console.warn('⚠️ #radio-feed-full nicht gefunden - warte 1 Sekunde');
            setTimeout(() => this.setupChat(), 1000);
            return;
        }
        
        console.log('✅ #radio-feed-full gefunden!');
        
        // Leere Container
        this.chatContainer.innerHTML = '';
        this.chatContainer.style.display = 'flex';
        this.chatContainer.style.flexDirection = 'column';
        this.chatContainer.style.gap = '10px';
        
        this.isReady = true;
        console.log('%c✅ RADIO MESSAGES SYSTEM BEREIT!', 'background: #48bb78; color: white; padding: 5px 10px; font-size: 16px; font-weight: bold;');
    }
    
    /**
     * ✅ HAUPTFUNKTION: Fügt Nachricht zum Chat hinzu
     * @param {string} sender - Absender (Rufzeichen oder "Leitstelle")
     * @param {string} message - Nachricht (Text oder HTML)
     * @param {string} type - Nachrichtentyp
     * @param {boolean} isHTML - Wenn true, wird message als HTML gerendert
     */
    addMessage(sender, message, type = 'system', isHTML = false) {
        // Warte bis bereit
        if (!this.isReady) {
            console.warn('⚠️ Chat noch nicht bereit - warte...');
            setTimeout(() => this.addMessage(sender, message, type, isHTML), 100);
            return;
        }
        
        if (!this.chatContainer) {
            console.error('❌ Chat-Container nicht verfügbar');
            return;
        }
        
        // Erstelle Message-Element
        const messageEl = document.createElement('div');
        messageEl.className = 'radio-chat-message';
        
        // Farbe nach Typ
        const colors = {
            'dispatcher': '#17a2b8',
            'vehicle': '#28a745',
            'vehicle-auto': '#6c757d',
            'system': '#ffc107',
            'error': '#dc3545',
            'status-change': '#9370db',
            'status-5-request': '#ff6666',
            'status-0-emergency': '#ff4444'
        };
        const borderColor = colors[type] || '#3182ce';
        
        // Icons
        const icons = {
            'dispatcher': '📢',
            'vehicle': '🚑',
            'vehicle-auto': '📡',
            'system': 'ℹ️',
            'error': '⚠️',
            'status-change': '🔄',
            'status-5-request': '📞',
            'status-0-emergency': '🚨'
        };
        const icon = icons[type] || '💬';
        
        // Zeitstempel
        const timestamp = this.getTimestamp();
        
        // Animations-Klasse für wichtige Nachrichten
        let animClass = '';
        if (type === 'status-5-request') animClass = 'pulse-animation';
        if (type === 'status-0-emergency') animClass = 'emergency-animation';
        
        messageEl.className = `radio-chat-message ${animClass}`;
        messageEl.style.borderLeftColor = borderColor;
        
        // Header
        const header = document.createElement('div');
        header.className = 'radio-message-header';
        header.innerHTML = `
            <span class="radio-icon">${icon}</span>
            <span class="radio-sender" style="color: ${borderColor};">${this.escapeHTML(sender)}</span>
            <span class="radio-timestamp">${timestamp}</span>
        `;
        
        // Body
        const body = document.createElement('div');
        body.className = 'radio-message-body';
        
        if (isHTML) {
            body.innerHTML = message;
        } else {
            body.textContent = message;
        }
        
        messageEl.appendChild(header);
        messageEl.appendChild(body);
        
        // J-Button für Status 5/0
        if (type === 'status-5-request' || type === 'status-0-emergency') {
            const vehicleId = this.findVehicleIdByCallsign(sender);
            if (vehicleId) {
                const jButton = this.createJButton(vehicleId, type === 'status-0-emergency');
                messageEl.appendChild(jButton);
            }
        }
        
        // Hinzufügen
        this.chatContainer.appendChild(messageEl);
        
        // Speichern
        this.messages.push({
            sender,
            message,
            type,
            isHTML,
            timestamp: new Date()
        });
        
        // Limit
        if (this.messages.length > this.maxMessages) {
            this.messages.shift();
            const firstMsg = this.chatContainer.querySelector('.radio-chat-message');
            if (firstMsg) firstMsg.remove();
        }
        
        // Auto-Scroll
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        
        // Sound abspielen
        this.playSound(type);
    }
    
    /**
     * Erstellt "J"-Button für Sprechfreigabe
     * @param {string} vehicleId - Fahrzeug-ID
     * @param {boolean} isEmergency - Ist Notfall?
     * @returns {HTMLElement} Button-Element
     */
    createJButton(vehicleId, isEmergency = false) {
        const button = document.createElement('button');
        button.className = 'j-button';
        button.textContent = 'J';
        button.title = 'Sprechfreigabe erteilen (Kommen, sprechen Sie)';
        
        if (isEmergency) {
            button.classList.add('j-button-emergency');
        }
        
        button.addEventListener('click', () => {
            // Sprechfreigabe erteilen
            if (window.unifiedStatusSystem) {
                window.unifiedStatusSystem.sendSprechfreigabe(vehicleId);
            }
            
            // Button deaktivieren
            button.disabled = true;
            button.textContent = '✓';
            button.classList.add('j-button-used');
            
            this.playSound('send');
        });
        
        return button;
    }
    
    /**
     * Findet Fahrzeug-ID anhand Callsign
     * @param {string} callsign - Rufzeichen
     * @returns {string|null} Fahrzeug-ID
     */
    findVehicleIdByCallsign(callsign) {
        if (!window.game || !window.game.vehicles) return null;
        const vehicle = window.game.vehicles.find(v => v.callsign === callsign);
        return vehicle ? vehicle.id : null;
    }
    
    /**
     * Spielt Radio-Sound ab
     * @param {string} type - Sound-Typ
     */
    playSound(type) {
        if (!window.game || !window.game.settings || !window.game.settings.soundEnabled) return;
        
        const sounds = {
            'dispatcher': 'radio-send.mp3',
            'vehicle': 'radio-receive.mp3',
            'vehicle-auto': 'radio-receive.mp3',
            'status-5-request': 'radio-beep.mp3',
            'status-0-emergency': 'emergency-alert.mp3',
            'send': 'radio-send.mp3'
        };
        
        const soundFile = sounds[type];
        if (!soundFile) return;
        
        try {
            const audio = new Audio(`sounds/${soundFile}`);
            audio.volume = 0.4;
            audio.play().catch(err => {
                // Sound-Fehler ignorieren (z.B. wenn Browser Autoplay blockt)
            });
        } catch (err) {
            // Stille Fehlerbehandlung
        }
    }
    
    /**
     * Löscht alle Nachrichten
     */
    clear() {
        if (this.chatContainer) {
            this.chatContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">Kein Funkverkehr</p>';
        }
        this.messages = [];
    }
    
    /**
     * Hole Zeitstempel
     */
    getTimestamp() {
        if (typeof window.IncidentNumbering !== 'undefined' && window.IncidentNumbering.getCurrentTimestamp) {
            return window.IncidentNumbering.getCurrentTimestamp();
        }
        return new Date().toLocaleTimeString('de-DE', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }
    
    /**
     * Escape HTML für sicheres Rendering
     */
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Injiziert alle benötigten Styles
     */
    injectStyles() {
        const styleId = 'radio-messages-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Radio Chat Message Base */
            .radio-chat-message {
                background: var(--panel-bg, #1a202c);
                border-left: 4px solid;
                border-radius: 8px;
                padding: 12px 15px;
                margin-bottom: 8px;
                transition: all 0.2s ease;
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            }
            
            .radio-chat-message:hover {
                transform: translateX(3px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }
            
            /* Animations */
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.8; }
            }
            
            @keyframes emergency-pulse {
                0%, 100% { 
                    background: rgba(255, 68, 68, 0.2);
                    border-left-color: #ff4444;
                }
                50% { 
                    background: rgba(255, 68, 68, 0.35);
                    border-left-color: #ff0000;
                }
            }
            
            .pulse-animation {
                animation: fadeIn 0.3s ease forwards, pulse 2s infinite;
            }
            
            .emergency-animation {
                animation: fadeIn 0.3s ease forwards, emergency-pulse 1s infinite;
            }
            
            /* Message Header */
            .radio-message-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 8px;
                font-size: 14px;
            }
            
            .radio-icon {
                font-size: 18px;
            }
            
            .radio-sender {
                font-weight: bold;
                flex: 1;
            }
            
            .radio-timestamp {
                font-size: 12px;
                opacity: 0.6;
                font-family: 'Courier New', monospace;
            }
            
            /* Message Body */
            .radio-message-body {
                padding-left: 28px;
                line-height: 1.5;
                color: var(--text-secondary, #cbd5e0);
            }
            
            /* Status Badges */
            .status-badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: bold;
                font-size: 14px;
                min-width: 28px;
                text-align: center;
                color: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            .status-transition {
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            
            /* J-Button für Sprechfreigabe */
            .j-button {
                margin-left: 12px;
                padding: 8px 20px;
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: bold;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            .j-button:hover:not(:disabled) {
                transform: scale(1.05);
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }
            
            .j-button-emergency {
                background: linear-gradient(135deg, #ff4444, #cc0000);
                animation: button-pulse 1.5s infinite;
            }
            
            @keyframes button-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .j-button-used,
            .j-button:disabled {
                background: #6c757d;
                cursor: not-allowed;
                opacity: 0.6;
                transform: scale(1) !important;
            }
            
            /* Radio Feed Container */
            #radio-feed-full {
                height: 400px;
                overflow-y: auto;
                padding: 12px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
            }
            
            #radio-feed-full::-webkit-scrollbar {
                width: 8px;
            }
            
            #radio-feed-full::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }
            
            #radio-feed-full::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 4px;
            }
            
            #radio-feed-full::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ Radio Messages Styles injiziert');
    }
}

// =============================
// GLOBALE INSTANZ & FUNKTIONEN
// =============================

const radioChatSystem = new RadioChatSystem();

/**
 * ✅ GLOBALE FUNKTION - Einzige addRadioMessage() im ganzen Projekt!
 * Von überall aufrufbar!
 * 
 * @param {string} sender - Absender (z.B. Rufzeichen oder "Leitstelle")
 * @param {string} message - Nachricht (Text oder HTML)
 * @param {string} type - Nachrichtentyp ('dispatcher', 'vehicle', 'status-change', etc.)
 * @param {boolean} isHTML - Wenn true, wird message als HTML gerendert
 */
function addRadioMessage(sender, message, type = 'system', isHTML = false) {
    if (!radioChatSystem) {
        console.error('❌ Radio Chat System nicht initialisiert');
        return;
    }
    radioChatSystem.addMessage(sender, message, type, isHTML);
}

/**
 * Löscht kompletten Funkverkehr
 */
function clearRadioFeed() {
    if (radioChatSystem) {
        radioChatSystem.clear();
    }
}

// Global verfügbar machen
if (typeof window !== 'undefined') {
    window.radioChatSystem = radioChatSystem;
    window.addRadioMessage = addRadioMessage;
    window.clearRadioFeed = clearRadioFeed;
}

console.log('%c✅ RADIO MESSAGES SYSTEM V4.0 GELADEN!', 'background: #48bb78; color: white; padding: 8px 15px; font-size: 16px; font-weight: bold;');
console.log('📻 Funktionen verfügbar: addRadioMessage(), clearRadioFeed()');
console.log('✅ HTML-Support, J-Button, Sounds & Animations aktiv');
