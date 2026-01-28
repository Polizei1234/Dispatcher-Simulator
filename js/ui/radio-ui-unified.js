// =========================
// RADIO UI UNIFIED v1.0
// 🔥 KONSOLIDIERT aus 4 separaten Dateien:
// - ui-radio.js
// - radio-ui-enhancements.js
// - radio-feed.js
// - radio-vehicle-control.js
// 
// ✅ EINE einheitliche addRadioMessage() Funktion
// ✅ Fahrzeug-Steuerung & Dropdown
// ✅ Status-Badges & J-Button
// ✅ HTML-Support für Nachrichten
// =========================

console.log('%c📻 RADIO UI UNIFIED wird geladen...', 'background: #3182ce; color: white; padding: 5px 10px; font-size: 14px; font-weight: bold;');

// =========================
// 1. RADIO CHAT SYSTEM
// =========================

class RadioChatSystem {
    constructor() {
        this.messages = [];
        this.maxMessages = 200;
        this.chatContainer = null;
        this.isReady = false;
        
        console.log('📻 Radio Chat System initialisiert...');
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
    }
    
    /**
     * Richtet Chat-Container ein
     */
    setupChat() {
        console.log('🔍 Suche #radio-feed-full Element...');
        
        this.chatContainer = document.getElementById('radio-feed-full');
        
        if (!this.chatContainer) {
            console.warn('⚠️ #radio-feed-full nicht gefunden - warte...');
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
        console.log('%c✅ RADIO CHAT BEREIT!', 'background: #48bb78; color: white; padding: 5px 10px; font-size: 14px; font-weight: bold;');
    }
    
    /**
     * ✅ ZENTRALE addMessage Funktion
     * @param {string} sender - Absender (z.B. Rufzeichen oder "Leitstelle")
     * @param {string} message - Nachricht (Text oder HTML)
     * @param {string} type - Typ: 'dispatcher', 'vehicle', 'status-change', 'status-5-request', 'status-0-emergency', etc.
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
        
        // Blockiere reine System-Nachrichten (optional)
        if (type === 'system' && message.includes('Status geändert')) {
            return; // Verhindere Spam
        }
        
        console.log(`💬 Nachricht: [${type}] ${sender}`);
        
        // Erstelle Message-Element
        const messageEl = document.createElement('div');
        messageEl.className = `radio-chat-message radio-message-${type}`;
        messageEl.style.cssText = `
            background: var(--panel-bg, #1a202c);
            border-left: 4px solid;
            border-radius: 8px;
            padding: 12px 15px;
            margin-bottom: 8px;
            transition: all 0.2s ease;
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;
        `;
        
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
        messageEl.style.borderLeftColor = colors[type] || '#3182ce';
        
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
        const timestamp = this.getGameTimestamp();
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            font-size: 14px;
        `;
        header.innerHTML = `
            <span style="font-size: 18px;">${icon}</span>
            <span style="font-weight: bold; color: var(--text-primary, white); flex: 1;">${this.escapeHTML(sender)}</span>
            <span style="font-size: 12px; opacity: 0.6; font-family: 'Courier New', monospace;">${timestamp}</span>
        `;
        
        // Body
        const body = document.createElement('div');
        body.style.cssText = `
            padding-left: 28px;
            line-height: 1.5;
            color: var(--text-secondary, #cbd5e0);
        `;
        
        // ✅ HTML oder Text
        if (isHTML) {
            body.innerHTML = message;
        } else {
            body.textContent = message;
        }
        
        messageEl.appendChild(header);
        messageEl.appendChild(body);
        
        // ✅ J-Button bei Status 5/0
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
        this.messages.push({ sender, message, type, isHTML, timestamp: new Date() });
        
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
     */
    createJButton(vehicleId, isEmergency = false) {
        const button = document.createElement('button');
        button.className = 'j-button';
        button.textContent = isEmergency ? '🚨 J' : 'J';
        button.title = 'Sprechfreigabe erteilen (Kommen, sprechen Sie)';
        button.style.cssText = `
            margin-left: 12px;
            padding: 6px 16px;
            background: ${isEmergency ? 'linear-gradient(135deg, #ff4444, #cc0000)' : 'linear-gradient(135deg, #28a745, #20c997)'};
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        });

        button.addEventListener('click', () => {
            // Sprechfreigabe erteilen
            if (window.unifiedStatusSystem) {
                window.unifiedStatusSystem.sendSprechfreigabe(vehicleId);
            }

            // Button deaktivieren
            button.disabled = true;
            button.style.background = '#6c757d';
            button.style.cursor = 'not-allowed';
            button.textContent = '✓';

            this.playSound('send');
        });

        return button;
    }
    
    /**
     * Findet Fahrzeug-ID anhand Callsign
     */
    findVehicleIdByCallsign(callsign) {
        if (!window.game || !window.game.vehicles) return null;
        const vehicle = window.game.vehicles.find(v => v.callsign === callsign);
        return vehicle ? vehicle.id : null;
    }
    
    /**
     * Spielt Radio-Sound ab
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
            audio.play().catch(err => console.warn('⚠️ Sound Error:', err));
        } catch (err) {
            console.warn('⚠️ Sound Error:', err);
        }
    }
    
    /**
     * Hilfsfunktion: Game-Zeitstempel
     */
    getGameTimestamp() {
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
     */
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
}

// =========================
// 2. RADIO VEHICLE CONTROL
// =========================

class RadioVehicleControl {
    constructor() {
        this.selectedVehicleId = null;
        this.dropdownElement = null;
        this.messageInput = null;
        this.vehicleInfoElement = null;
        
        this.initialize();
    }
    
    /**
     * Initialisiert Radio Control
     */
    initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    /**
     * Richtet UI-Elemente ein
     */
    setup() {
        this.dropdownElement = document.getElementById('radio-vehicle-dropdown');
        this.messageInput = document.getElementById('radio-vehicle-message-input');
        this.vehicleInfoElement = document.getElementById('selected-vehicle-info');
        
        if (!this.dropdownElement || !this.messageInput) {
            console.warn('⚠️ Radio Control UI-Elemente nicht gefunden');
            return;
        }
        
        // Initial Update
        this.updateVehicleDropdown();
        
        // Auto-Update alle 5 Sekunden
        setInterval(() => {
            if (window.game && window.game.vehicles) {
                this.updateVehicleDropdown();
            }
        }, 5000);
        
        console.log('✅ Radio Vehicle Control initialisiert');
    }
    
    /**
     * Aktualisiert Fahrzeug-Dropdown
     */
    updateVehicleDropdown() {
        if (!this.dropdownElement || !window.game || !window.game.vehicles) return;
        
        const currentValue = this.dropdownElement.value;
        this.dropdownElement.innerHTML = '<option value="">-- Fahrzeug wählen --</option>';
        
        // Filtere verfügbare Fahrzeuge (owned + kontaktierbar)
        const availableVehicles = window.game.vehicles.filter(v => {
            if (!v.owned) return false;
            const statusInfo = window.CONFIG ? window.CONFIG.getFMSStatus(v.currentStatus) : null;
            return statusInfo ? statusInfo.canBeContacted : true;
        });
        
        // Gruppiere nach Typ
        const grouped = {};
        availableVehicles.forEach(v => {
            if (!grouped[v.type]) grouped[v.type] = [];
            grouped[v.type].push(v);
        });
        
        // Erstelle Options mit Gruppen
        Object.keys(grouped).sort().forEach(type => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = `${type} (${grouped[type].length})`;
            
            grouped[type].forEach(vehicle => {
                const option = document.createElement('option');
                option.value = vehicle.id;
                
                const statusInfo = window.CONFIG ? window.CONFIG.getFMSStatus(vehicle.currentStatus) : null;
                const statusText = statusInfo ? statusInfo.shortName : `Status ${vehicle.currentStatus}`;
                const statusIcon = statusInfo ? statusInfo.icon : '📍';
                
                option.textContent = `${statusIcon} ${vehicle.callsign} - ${statusText}`;
                
                optgroup.appendChild(option);
            });
            
            this.dropdownElement.appendChild(optgroup);
        });
        
        // Restore Selection
        if (currentValue && availableVehicles.find(v => v.id === currentValue)) {
            this.dropdownElement.value = currentValue;
        } else if (this.selectedVehicleId) {
            this.selectedVehicleId = null;
            this.hideVehicleInfo();
        }
    }
    
    /**
     * Wählt Fahrzeug aus
     */
    selectVehicle(vehicleId) {
        if (!vehicleId) {
            this.selectedVehicleId = null;
            this.hideVehicleInfo();
            if (this.messageInput) this.messageInput.disabled = true;
            return;
        }
        
        const vehicle = window.game?.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            console.warn('⚠️ Fahrzeug nicht gefunden:', vehicleId);
            return;
        }
        
        this.selectedVehicleId = vehicleId;
        
        // Enable Input
        if (this.messageInput) {
            this.messageInput.disabled = false;
            this.messageInput.focus();
        }
        
        // Zeige Fahrzeuginfo
        this.showVehicleInfo(vehicle);
        
        // Notify Radio System
        if (window.radioSystem) {
            window.radioSystem.selectVehicle(vehicleId);
        }
        
        console.log(`📡 Fahrzeug ausgewählt: ${vehicle.callsign}`);
    }
    
    /**
     * Zeigt Fahrzeuginfo an
     */
    showVehicleInfo(vehicle) {
        if (!this.vehicleInfoElement) return;
        
        const statusInfo = window.CONFIG ? window.CONFIG.getFMSStatus(vehicle.currentStatus) : null;
        const incident = window.game?.incidents.find(i => 
            i.assignedVehicles && i.assignedVehicles.includes(vehicle.id)
        );
        
        this.vehicleInfoElement.innerHTML = `
            <div class="selected-vehicle-card" style="
                background: linear-gradient(135deg, rgba(49, 130, 206, 0.1) 0%, rgba(44, 82, 130, 0.1) 100%);
                border-left: 4px solid ${statusInfo?.color || '#3182ce'};
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
            ">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                    <span style="font-size: 32px;">${statusInfo?.icon || '🚑'}</span>
                    <div style="flex: 1;">
                        <h4 style="margin: 0; color: ${statusInfo?.color || '#3182ce'}; font-size: 18px;">
                            ${vehicle.callsign}
                        </h4>
                        <p style="margin: 4px 0 0 0; opacity: 0.8; font-size: 14px;">
                            ${vehicle.type}
                        </p>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                    <div>
                        <strong style="opacity: 0.7;">Status:</strong><br>
                        <span style="color: ${statusInfo?.color || '#fff'}; font-weight: bold;">
                            ${statusInfo?.name || 'Unbekannt'}
                        </span>
                    </div>
                    <div>
                        <strong style="opacity: 0.7;">Standort:</strong><br>
                        ${vehicle.location || vehicle.station || 'Unbekannt'}
                    </div>
                    ${incident ? `
                        <div style="grid-column: 1 / -1; margin-top: 5px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                            <strong style="opacity: 0.7;">Aktueller Einsatz:</strong><br>
                            <span style="color: #ffc107;">${incident.keyword}</span> - ${incident.location}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        this.vehicleInfoElement.style.display = 'block';
    }
    
    /**
     * Versteckt Fahrzeuginfo
     */
    hideVehicleInfo() {
        if (this.vehicleInfoElement) {
            this.vehicleInfoElement.style.display = 'none';
        }
    }
    
    /**
     * Sendet Nachricht an ausgewähltes Fahrzeug
     */
    async sendMessage() {
        if (!this.selectedVehicleId) {
            if (window.addRadioMessage) {
                window.addRadioMessage('System', 'Bitte wählen Sie zuerst ein Fahrzeug aus.', 'error');
            }
            return;
        }
        
        if (!this.messageInput || !this.messageInput.value.trim()) {
            if (window.addRadioMessage) {
                window.addRadioMessage('System', 'Bitte geben Sie eine Nachricht ein.', 'error');
            }
            return;
        }
        
        const message = this.messageInput.value.trim();
        
        // Sende via Radio System
        if (window.radioSystem) {
            await window.radioSystem.sendRadioToVehicle(message);
        } else {
            console.error('❌ Radio System nicht verfügbar');
            if (window.addRadioMessage) {
                window.addRadioMessage('System', 'Funk-System nicht verfügbar.', 'error');
            }
        }
        
        // Clear Input
        this.messageInput.value = '';
        this.messageInput.focus();
    }
    
    /**
     * Gibt ausgewähltes Fahrzeug zurück
     */
    getSelectedVehicle() {
        if (!this.selectedVehicleId || !window.game) return null;
        return window.game.vehicles.find(v => v.id === this.selectedVehicleId);
    }
}

// =========================
// 3. CSS STYLES
// =========================

function injectRadioStyles() {
    const styleId = 'radio-ui-unified-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        /* Radio Message Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .radio-chat-message:hover {
            transform: translateX(3px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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

        /* Emergency Pulse */
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

        .radio-message-status-0-emergency {
            animation: emergency-pulse 1s infinite;
        }

        /* Radio Feed Scrollbar */
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
    console.log('✅ Radio UI Styles geladen');
}

// =========================
// 4. INITIALISIERUNG
// =========================

// Inject Styles
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectRadioStyles);
} else {
    injectRadioStyles();
}

// Erstelle globale Instanzen
const radioChatSystem = new RadioChatSystem();
const radioVehicleControl = new RadioVehicleControl();

// =========================
// 5. GLOBALE FUNKTIONEN
// =========================

/**
 * ✅ ZENTRALE addRadioMessage Funktion
 * Von überall aufrufbar!
 */
function addRadioMessage(sender, message, type = 'system', isHTML = false) {
    if (radioChatSystem) {
        radioChatSystem.addMessage(sender, message, type, isHTML);
    } else {
        console.error('❌ Radio Chat System nicht initialisiert');
    }
}

/**
 * Löscht Chat
 */
function clearRadioFeed() {
    if (radioChatSystem) {
        radioChatSystem.clear();
    }
}

/**
 * Aktualisiert Fahrzeug-Dropdown
 */
function updateRadioVehicleDropdown() {
    if (radioVehicleControl) {
        radioVehicleControl.updateVehicleDropdown();
    }
}

/**
 * Wählt Fahrzeug aus Dropdown
 */
function selectVehicleFromDropdown() {
    const dropdown = document.getElementById('radio-vehicle-dropdown');
    if (dropdown && radioVehicleControl) {
        radioVehicleControl.selectVehicle(dropdown.value);
    }
}

/**
 * Sendet Nachricht an Fahrzeug
 */
function sendRadioToVehicle() {
    if (radioVehicleControl) {
        radioVehicleControl.sendMessage();
    }
}

/**
 * Sendet allgemeinen Funkspruch
 */
function sendRadioMessage() {
    const input = document.getElementById('radio-message-input');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) {
        addRadioMessage('System', 'Bitte geben Sie eine Nachricht ein!', 'error');
        return;
    }
    
    addRadioMessage('Leitstelle', `Durchsage an alle: ${message}`, 'dispatcher');
    
    input.value = '';
    input.focus();
    
    console.log(`📻 Funkspruch gesendet: ${message}`);
}

// =========================
// 6. GLOBAL VERFÜGBAR MACHEN
// =========================

if (typeof window !== 'undefined') {
    // Systeme
    window.radioChatSystem = radioChatSystem;
    window.radioVehicleControl = radioVehicleControl;
    
    // Funktionen
    window.addRadioMessage = addRadioMessage;
    window.clearRadioFeed = clearRadioFeed;
    window.updateRadioVehicleDropdown = updateRadioVehicleDropdown;
    window.selectVehicleFromDropdown = selectVehicleFromDropdown;
    window.sendRadioToVehicle = sendRadioToVehicle;
    window.sendRadioMessage = sendRadioMessage;
}

console.log('%c✅ RADIO UI UNIFIED V1.0 GELADEN!', 'background: #48bb78; color: white; padding: 8px 15px; font-size: 16px; font-weight: bold;');
console.log('📻 4 Dateien konsolidiert in 1');
console.log('✅ Keine Konflikte mehr!');
