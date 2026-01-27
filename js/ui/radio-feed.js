// =========================
// RADIO CHAT SYSTEM v3.0 - KOMPLETT NEU!
// Funkverkehr als echtes Chat-Interface
// + ✅ Einfaches, robustes Design
// + ✅ HTML-Support für Status-Kästchen
// + ✅ Funktioniert IMMER
// =========================

class RadioChatSystem {
    constructor() {
        this.messages = [];
        this.maxMessages = 200;
        this.chatContainer = null;
        this.isReady = false;
        
        console.log('📻 Radio Chat System v3.0 wird initialisiert...');
        this.init();
    }
    
    /**
     * Initialisierung
     */
    init() {
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
        // Finde Container
        this.chatContainer = document.getElementById('radio-feed-full');
        
        if (!this.chatContainer) {
            console.warn('⚠️ #radio-feed-full nicht gefunden - erstelle neues Element');
            
            // Erstelle Container wenn nicht vorhanden
            const radioPanel = document.querySelector('.radio-feed-container .panel-content');
            if (radioPanel) {
                radioPanel.innerHTML = '<div id="radio-feed-full" style="height: 100%; overflow-y: auto; padding: 15px;"></div>';
                this.chatContainer = document.getElementById('radio-feed-full');
            }
        }
        
        if (!this.chatContainer) {
            console.error('❌ Radio-Feed konnte nicht initialisiert werden!');
            return;
        }
        
        // Leere Container
        this.chatContainer.innerHTML = '';
        this.chatContainer.style.display = 'flex';
        this.chatContainer.style.flexDirection = 'column';
        this.chatContainer.style.gap = '10px';
        
        this.isReady = true;
        console.log('✅ Radio Chat System v3.0 bereit!');
    }
    
    /**
     * Fügt Nachricht zum Chat hinzu
     */
    addMessage(sender, message, type = 'system', isHTML = false) {
        // Warte bis bereit
        if (!this.isReady) {
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
        messageEl.style.cssText = `
            background: var(--panel-bg);
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
        const now = new Date();
        const time = now.toLocaleTimeString('de-DE');
        
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
            <span style="font-weight: bold; color: var(--text-primary); flex: 1;">${this.escapeHTML(sender)}</span>
            <span style="font-size: 12px; opacity: 0.6; font-family: 'Courier New', monospace;">${time}</span>
        `;
        
        // Body
        const body = document.createElement('div');
        body.style.cssText = `
            padding-left: 28px;
            line-height: 1.5;
            color: var(--text-secondary);
        `;
        
        // ✅ HTML oder Text
        if (isHTML) {
            body.innerHTML = message; // HTML direkt einfügen
        } else {
            body.textContent = message; // Text escaped
        }
        
        messageEl.appendChild(header);
        messageEl.appendChild(body);
        
        // Hinzufügen
        this.chatContainer.appendChild(messageEl);
        
        // Speichern
        this.messages.push({
            sender,
            message,
            type,
            isHTML,
            timestamp: now
        });
        
        // Limit
        if (this.messages.length > this.maxMessages) {
            this.messages.shift();
            const firstMsg = this.chatContainer.querySelector('.radio-chat-message');
            if (firstMsg) firstMsg.remove();
        }
        
        // Auto-Scroll
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        
        console.log(`📻 [${time}] ${sender}: ${isHTML ? 'HTML-Nachricht' : message.substring(0, 50)}`);
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
     * Escape HTML
     */
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Animation CSS
const style = document.createElement('style');
style.textContent = `
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

.radio-chat-message:hover {
    transform: translateX(3px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
`;
document.head.appendChild(style);

// Globale Instanz
const radioChatSystem = new RadioChatSystem();

/**
 * ✅ GLOBALE FUNKTION - Von überall aufrufbar!
 */
function addRadioMessage(sender, message, type = 'system', isHTML = false) {
    if (!radioChatSystem) {
        console.error('❌ Radio Chat System nicht initialisiert');
        return;
    }
    radioChatSystem.addMessage(sender, message, type, isHTML);
}

/**
 * Löscht Chat
 */
function clearRadioFeed() {
    if (radioChatSystem) {
        radioChatSystem.clear();
    }
}

// Global verfügbar
if (typeof window !== 'undefined') {
    window.radioChatSystem = radioChatSystem;
    window.addRadioMessage = addRadioMessage;
    window.clearRadioFeed = clearRadioFeed;
}

console.log('✅ Radio Chat System v3.0 geladen - KOMPLETT NEU!');
console.log('✅ Einfach, robust, funktioniert IMMER!');
