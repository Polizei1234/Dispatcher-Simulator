// =========================
// RADIO MESSAGES SYSTEM v4.1 - EVENT-BASIERT
// Unified: Funkverkehr + UI-Enhancements
// + ✅ RadioChatSystem (Nachrichten-Management)
// + ✅ HTML-Support für Status-Badges
// + ✅ J-Button für Sprechfreigabe
// + ✅ Sound-System
// + ✅ Alle Styles integriert
// + 🚀 v4.1: Feuert 'radioSystemReady' Event!
// =========================

console.log('%c📻 RADIO MESSAGES SYSTEM v4.1 wird geladen...', 'background: #3182ce; color: white; padding: 5px 10px; font-size: 14px; font-weight: bold;');

/**
 * Radio Chat System - Verwaltet alle Funk-Nachrichten
 */
class RadioChatSystem {
    constructor() {
        this.messages = [];
        this.maxMessages = 200;
        this.chatContainer = null;
        this.isReady = false;
        
        console.log('📻 Radio Chat System v4.1 wird initialisiert...');
        this.init();
    }
    
    /**
     * Initialisierung
     */
    init() {
        // Injiziere Styles sofort
        this.injectStyles();
        
        // Warte auf DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupChat());
        } else {
            this.setupChat();
        }
    }
    
    /**
     * Richtet Chat-Container ein
     */
    setupChat() {
        console.log('🔍 Suche #radio-feed-full Element...');
        
        // Finde Container
        this.chatContainer = document.getElementById('radio-feed-full');
        
        if (!this.chatContainer) {
            console.warn('⚠️ #radio-feed-full nicht gefunden - warte 1 Sekunde');
            setTimeout(() => this.setupChat(), 1000);
            return;
        }
        
        console.log('✅ #radio-feed-full gefunden!');
        
        // Setup Container
        this.chatContainer.innerHTML = '';
        this.chatContainer.style.display = 'flex';
        this.chatContainer.style.flexDirection = 'column';
        this.chatContainer.style.gap = '10px';
        
        this.isReady = true;
        
        // 🚀 FEUERE CUSTOM-EVENT!
        document.dispatchEvent(new CustomEvent('radioSystemReady', {
            detail: { 
                version: '4.1',
                timestamp: Date.now()
            }
        }));
        
        console.log('%c✅ RADIO MESSAGES SYSTEM BEREIT!', 'background: #48bb78; color: white; padding: 5px 10px; font-size: 16px; font-weight: bold;');
        console.log('🚀 Custom-Event "radioSystemReady" gefeuert!');
    }
    
    /**
     * Fügt Nachricht zum Chat hinzu
     * @param {string} sender - Absender (Callsign oder 'Leitstelle')
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
        
        // Blockiere reine System-Nachrichten (außer errors)
        if (type === 'system' && !message.includes('✅') && !message.includes('⚠️')) {
            return;
        }
        
        // Erstelle Message-Element
        const messageEl = document.createElement('div');
        messageEl.className = `radio-message radio-message-${type}`;
        
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
        
        // Header
        const header = document.createElement('div');
        header.className = 'radio-message-header';
        header.innerHTML = `
            <span class="radio-icon">${icon}</span>
            <span class="radio-sender radio-sender-${type}">${this.escapeHTML(sender)}</span>
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
        
        messageEl.style.borderLeftColor = borderColor;
        messageEl.appendChild(header);
        messageEl.appendChild(body);
        
        // Füge J-Button hinzu für Status 5/0
        if (type === 'status-5-request' || type === 'status-0-emergency') {
            const vehicleId = this.findVehicleIdByCallsign(sender);
            if (vehicleId) {
                const jButton = this.createJButton(vehicleId, type === 'status-0-emergency');
                body.appendChild(jButton);
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
            const firstMsg = this.chatContainer.querySelector('.radio-message');
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
     * @param {boolean} isEmergency - Notfall-Button (rot)
     * @returns {HTMLElement} Button-Element
     */
    createJButton(vehicleId, isEmergency = false) {
        const button = document.createElement('button');
        button.className = 'j-button';
        button.textContent = 'J';
        button.title = 'Sprechfreigabe erteilen (Kommen, sprechen Sie)';
        
        if (isEmergency) {
            button.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
        }
        
        button.addEventListener('click', () => {
            // Sprechfreigabe erteilen
            if (window.unifiedStatusSystem) {
                window.unifiedStatusSystem.sendSprechfreigabe(vehicleId);
            } else {
                console.warn('⚠️ unifiedStatusSystem nicht gefunden');
            }
            
            // Button deaktivieren
            button.disabled = true;
            button.style.background = '#6c757d';
            button.style.cursor = 'not-allowed';
            button.textContent = '✓';
            
            // Sound
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
            'send': 'radio-send.mp3',
            'receive': 'radio-receive.mp3',
            'vehicle': 'radio-receive.mp3',
            'vehicle-auto': 'radio-receive.mp3',
            'dispatcher': 'radio-send.mp3',
            'status-5-request': 'radio-beep.mp3',
            'status-0-emergency': 'emergency-alert.mp3'
        };
        
        const soundFile = sounds[type];
        if (!soundFile) return;
        
        try {
            const audio = new Audio(`sounds/${soundFile}`);
            audio.volume = 0.4;
            audio.play().catch(err => {
                // Sound-Fehler ignorieren (häufig bei Browser-Autoplay-Policies)
            });
        } catch (err) {
            // Ignorieren
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
        console.log('🗑️ Radio-Feed geleert');
    }
    
    /**
     * Hole Zeitstempel
     * @returns {string} Formatierter Zeitstempel
     */
    getTimestamp() {
        if (typeof IncidentNumbering !== 'undefined' && IncidentNumbering.getCurrentTimestamp) {
            return IncidentNumbering.getCurrentTimestamp();
        }
        return new Date().toLocaleTimeString('de-DE', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }
    
    /**
     * Escape HTML
     * @param {string} text - Text
     * @returns {string} Escaped Text
     */
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Injiziert CSS-Styles für Radio-UI
     */
    injectStyles() {
        const styleId = 'radio-messages-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Radio Message Base Styles */
            .radio-message {
                background: var(--panel-bg, #1a202c);
                border-left: 4px solid;
                border-radius: 8px;
                padding: 12px 15px;
                margin-bottom: 8px;
                transition: all 0.2s ease;
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            }
            
            .radio-message:hover {
                transform: translateX(3px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
            
            .radio-sender-dispatcher { color: #17a2b8; }
            .radio-sender-vehicle { color: #28a745; }
            .radio-sender-vehicle-auto { color: #6c757d; }
            .radio-sender-system { color: #ffc107; }
            .radio-sender-error { color: #dc3545; }
            .radio-sender-status-change { color: #9370db; }
            .radio-sender-status-5-request { color: #ff6666; animation: text-flash 1.5s infinite; }
            .radio-sender-status-0-emergency { color: #ff4444; animation: text-flash 1s infinite; }
            
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
            
            /* Special Message Types */
            .radio-message-status-change {
                background: rgba(147, 112, 219, 0.1);
            }
            
            .radio-message-status-5-request {
                background: rgba(255, 102, 102, 0.15);
                animation: pulse 2s infinite;
            }
            
            .radio-message-status-0-emergency {
                background: rgba(255, 68, 68, 0.2);
                animation: emergency-pulse 1s infinite;
            }
            
            /* Status Badge */
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
            
            /* J-Button */
            .j-button {
                margin-left: 12px;
                padding: 6px 16px;
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
            
            .j-button:disabled {
                background: #6c757d;
                cursor: not-allowed;
                opacity: 0.6;
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
            
            @keyframes text-flash {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
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

// =========================
// GLOBALE INSTANZ & FUNKTIONEN
// =========================

const radioChatSystem = new RadioChatSystem();

/**
 * ✅ GLOBALE FUNKTION - Von überall aufrufbar!
 * @param {string} sender - Absender
 * @param {string} message - Nachricht
 * @param {string} type - Nachrichtentyp
 * @param {boolean} isHTML - HTML-Modus
 */
function addRadioMessage(sender, message, type = 'system', isHTML = false) {
    if (!radioChatSystem) {
        console.error('❌ Radio Chat System nicht initialisiert');
        return;
    }
    radioChatSystem.addMessage(sender, message, type, isHTML);
}

/**
 * Löscht Radio-Feed
 */
function clearRadioFeed() {
    if (radioChatSystem) {
        radioChatSystem.clear();
    }
}

/**
 * Spielt Radio-Sound ab
 * @param {string} type - Sound-Typ
 */
function playRadioSound(type) {
    if (radioChatSystem) {
        radioChatSystem.playSound(type);
    }
}

// Global verfügbar machen
if (typeof window !== 'undefined') {
    window.radioChatSystem = radioChatSystem;
    window.addRadioMessage = addRadioMessage;
    window.clearRadioFeed = clearRadioFeed;
    window.playRadioSound = playRadioSound;
}

console.log('%c✅ RADIO MESSAGES SYSTEM V4.1 GELADEN!', 'background: #48bb78; color: white; padding: 8px 15px; font-size: 16px; font-weight: bold;');
console.log('✅ Merged: radio-feed.js + radio-ui-enhancements.js');
console.log('✅ Features: Chat-System, HTML-Support, J-Button, Sounds, Styles');
console.log('🚀 Feuert Custom-Event "radioSystemReady" für andere Systeme!');
