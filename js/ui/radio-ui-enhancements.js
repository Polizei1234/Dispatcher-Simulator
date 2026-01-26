// =========================
// RADIO UI ENHANCEMENTS v1.0
// UI-Erweiterungen für Status-System
// + Visuelle Status-Badges im Funkfenster
// + "J"-Button für Sprechfreigabe
// + HTML-Support in Radio-Nachrichten
// =========================

/**
 * Erweiterte addRadioMessage Funktion mit HTML-Support
 * @param {string} sender - Absender (Callsign oder 'Leitstelle')
 * @param {string} message - Nachricht (kann HTML enthalten)
 * @param {string} type - Nachrichtentyp ('dispatcher', 'vehicle', 'status-change', etc.)
 * @param {boolean} isHTML - Wenn true, wird message als HTML gerendert
 */
function addRadioMessage(sender, message, type = 'info', isHTML = false) {
    const radioLog = document.getElementById('radio-log');
    if (!radioLog) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `radio-message radio-message-${type}`;

    // Timestamp
    const timestamp = new Date().toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Sender-Style basierend auf Typ
    let senderClass = 'radio-sender';
    if (type === 'dispatcher') senderClass += ' radio-sender-dispatcher';
    if (type === 'vehicle' || type === 'vehicle-auto') senderClass += ' radio-sender-vehicle';
    if (type === 'status-change') senderClass += ' radio-sender-status';
    if (type.includes('status-0') || type.includes('status-5')) senderClass += ' radio-sender-urgent';

    // Nachricht zusammenbauen
    messageDiv.innerHTML = `
        <span class="radio-timestamp">${timestamp}</span>
        <span class="${senderClass}">${sender}:</span>
        ${isHTML ? message : `<span class="radio-text">${escapeHtml(message)}</span>`}
    `;

    // Für Status 5/0: Füge "J"-Button hinzu
    if (type === 'status-5-request' || type === 'status-0-emergency') {
        const vehicleId = findVehicleIdByCallsign(sender);
        if (vehicleId) {
            const jButton = createJButton(vehicleId);
            messageDiv.appendChild(jButton);
        }
    }

    radioLog.appendChild(messageDiv);

    // Auto-Scroll nach unten
    radioLog.scrollTop = radioLog.scrollHeight;

    // Sound abspielen
    if (type === 'status-0-emergency') {
        playRadioSound('emergency');
    } else if (type === 'status-5-request') {
        playRadioSound('status5');
    } else if (type === 'vehicle' || type === 'vehicle-auto') {
        playRadioSound('receive');
    } else if (type === 'dispatcher') {
        playRadioSound('send');
    }
}

/**
 * Erstellt "J"-Button für Sprechfreigabe
 * @param {string} vehicleId - Fahrzeug-ID
 * @returns {HTMLElement} Button-Element
 */
function createJButton(vehicleId) {
    const button = document.createElement('button');
    button.className = 'j-button';
    button.textContent = 'J';
    button.title = 'Sprechfreigabe erteilen (Kommen, sprechen Sie)';
    button.style.cssText = `
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

        // Sound abspielen
        playRadioSound('send');
    });

    return button;
}

/**
 * Findet Fahrzeug-ID anhand Callsign
 * @param {string} callsign - Rufzeichen
 * @returns {string|null} Fahrzeug-ID
 */
function findVehicleIdByCallsign(callsign) {
    if (!game || !game.vehicles) return null;
    
    const vehicle = game.vehicles.find(v => v.callsign === callsign);
    return vehicle ? vehicle.id : null;
}

/**
 * Spielt Radio-Sound ab
 * @param {string} type - Sound-Typ
 */
function playRadioSound(type) {
    if (!game || !game.settings || !game.settings.soundEnabled) return;

    const sounds = {
        'send': 'radio-send.mp3',
        'receive': 'radio-receive.mp3',
        'status5': 'radio-beep.mp3',
        'emergency': 'emergency-alert.mp3'
    };

    const soundFile = sounds[type];
    if (!soundFile) return;

    try {
        const audio = new Audio(`sounds/${soundFile}`);
        audio.volume = 0.4;
        audio.play().catch(err => {
            console.warn('⚠️ Sound konnte nicht abgespielt werden:', err);
        });
    } catch (err) {
        console.warn('⚠️ Sound-Fehler:', err);
    }
}

/**
 * Escaped HTML-Zeichen für sicheres Rendering
 * @param {string} text - Text mit potentiellem HTML
 * @returns {string} Escaped Text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Fügt CSS für Radio-UI hinzu
 */
function injectRadioStyles() {
    const styleId = 'radio-ui-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        /* Radio Message Styles */
        .radio-message {
            padding: 8px 12px;
            margin: 4px 0;
            border-left: 4px solid transparent;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            line-height: 1.6;
            transition: background 0.2s;
        }

        .radio-message:hover {
            background: rgba(255, 255, 255, 0.08);
        }

        .radio-message-dispatcher {
            border-left-color: #007bff;
        }

        .radio-message-vehicle,
        .radio-message-vehicle-auto {
            border-left-color: #28a745;
        }

        .radio-message-status-change {
            border-left-color: #ffc107;
            background: rgba(255, 193, 7, 0.1);
        }

        .radio-message-status-5-request {
            border-left-color: #ff6666;
            background: rgba(255, 102, 102, 0.15);
            animation: pulse 2s infinite;
        }

        .radio-message-status-0-emergency {
            border-left-color: #ff4444;
            background: rgba(255, 68, 68, 0.2);
            animation: emergency-pulse 1s infinite;
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

        .radio-timestamp {
            color: #6c757d;
            font-size: 0.85em;
            margin-right: 8px;
        }

        .radio-sender {
            font-weight: bold;
            margin-right: 6px;
        }

        .radio-sender-dispatcher {
            color: #007bff;
        }

        .radio-sender-vehicle {
            color: #28a745;
        }

        .radio-sender-status {
            color: #ffc107;
        }

        .radio-sender-urgent {
            color: #ff4444;
            animation: text-flash 1.5s infinite;
        }

        @keyframes text-flash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }

        .radio-text {
            color: #e0e0e0;
        }

        /* Status Badge Styles */
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

        /* J-Button Styles */
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

        /* Radio Log Container */
        #radio-log {
            height: 400px;
            overflow-y: auto;
            padding: 12px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            font-family: 'Courier New', monospace;
        }

        #radio-log::-webkit-scrollbar {
            width: 8px;
        }

        #radio-log::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
        }

        #radio-log::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
        }

        #radio-log::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }
    `;

    document.head.appendChild(style);
    console.log('✅ Radio UI Styles injiziert');
}

// Initialisierung beim Laden
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectRadioStyles);
} else {
    injectRadioStyles();
}

// Globale Funktionen verfügbar machen
if (typeof window !== 'undefined') {
    window.addRadioMessage = addRadioMessage;
    window.createJButton = createJButton;
    window.playRadioSound = playRadioSound;
}

console.log('✅ Radio UI Enhancements v1.0 geladen');
console.log('✅ HTML-Support für Status-Badges aktiv');
console.log('✅ "J"-Button für Sprechfreigabe integriert');