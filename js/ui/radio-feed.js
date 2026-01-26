// =========================
// RADIO FEED UI v1.0
// Funkverkehr-Anzeige mit addRadioMessage()
// =========================

class RadioFeed {
    constructor() {
        this.messages = [];
        this.maxMessages = 100; // Max. Nachrichten im Feed
        this.feedElement = null;
        this.autoScroll = true;
        
        this.initializeFeed();
    }
    
    /**
     * Initialisiert Radio-Feed
     */
    initializeFeed() {
        // Warte bis DOM geladen ist
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupFeed());
        } else {
            this.setupFeed();
        }
    }
    
    /**
     * Richtet Feed-Element ein
     */
    setupFeed() {
        this.feedElement = document.getElementById('radio-feed-full');
        
        if (!this.feedElement) {
            console.warn('⚠️ Radio-Feed-Element nicht gefunden');
            return;
        }
        
        // Auto-Scroll-Handler
        this.feedElement.addEventListener('scroll', () => {
            const isScrolledToBottom = 
                this.feedElement.scrollHeight - this.feedElement.clientHeight <= 
                this.feedElement.scrollTop + 50;
            this.autoScroll = isScrolledToBottom;
        });
        
        console.log('✅ Radio Feed UI initialisiert');
    }
    
    /**
     * Fügt Nachricht zum Feed hinzu
     * @param {string} sender - Absender (z.B. "RTW 71/83-01" oder "Leitstelle")
     * @param {string} message - Nachricht
     * @param {string} type - Typ: 'dispatcher', 'vehicle', 'vehicle-auto', 'system', 'error'
     * @param {string} color - Optional: Custom Farbe
     */
    addMessage(sender, message, type = 'system', color = null) {
        const timestamp = new Date();
        const timeString = timestamp.toLocaleTimeString('de-DE');
        
        // Erstelle Message-Objekt
        const msg = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sender,
            message,
            type,
            color,
            timestamp
        };
        
        // Füge zu Messages hinzu
        this.messages.push(msg);
        
        // Begrenze Nachrichtenanzahl
        if (this.messages.length > this.maxMessages) {
            this.messages.shift();
        }
        
        // Render Message
        this.renderMessage(msg);
        
        // Auto-Scroll
        if (this.autoScroll && this.feedElement) {
            setTimeout(() => {
                this.feedElement.scrollTop = this.feedElement.scrollHeight;
            }, 50);
        }
        
        return msg.id;
    }
    
    /**
     * Rendert einzelne Nachricht
     */
    renderMessage(msg) {
        if (!this.feedElement) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `radio-message radio-message-${msg.type}`;
        messageDiv.id = msg.id;
        
        // Custom Color
        if (msg.color) {
            messageDiv.style.borderLeftColor = msg.color;
        }
        
        // Icon basierend auf Typ
        const icons = {
            'dispatcher': '📢',
            'vehicle': '🚑',
            'vehicle-auto': '📡',
            'system': 'ℹ️',
            'error': '⚠️'
        };
        const icon = icons[msg.type] || '💬';
        
        // Timestamp
        const timeString = msg.timestamp.toLocaleTimeString('de-DE');
        
        // HTML
        messageDiv.innerHTML = `
            <div class="radio-message-header">
                <span class="radio-message-icon">${icon}</span>
                <span class="radio-message-sender">${this.escapeHtml(msg.sender)}</span>
                <span class="radio-message-time">${timeString}</span>
            </div>
            <div class="radio-message-body">
                ${this.escapeHtml(msg.message)}
            </div>
        `;
        
        // Fade-in Animation
        messageDiv.style.opacity = '0';
        this.feedElement.appendChild(messageDiv);
        
        // Entferne älteste Nachricht wenn zu viele
        const allMessages = this.feedElement.querySelectorAll('.radio-message');
        if (allMessages.length > this.maxMessages) {
            allMessages[0].remove();
        }
        
        // Trigger Animation
        setTimeout(() => {
            messageDiv.style.opacity = '1';
        }, 10);
    }
    
    /**
     * Löscht alle Nachrichten
     */
    clear() {
        this.messages = [];
        if (this.feedElement) {
            this.feedElement.innerHTML = '<p class="no-data">Kein Funkverkehr</p>';
        }
    }
    
    /**
     * Escape HTML für Sicherheit
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Gibt alle Nachrichten zurück
     */
    getMessages() {
        return [...this.messages];
    }
}

// Globale Instanz
const radioFeed = new RadioFeed();

/**
 * ✅ GLOBAL FUNCTION - Von allen Systemen verwendbar!
 * Fügt Funkspruch zum Radio-Feed hinzu
 * @param {string} sender - Absender
 * @param {string} message - Nachricht
 * @param {string} type - Typ: 'dispatcher', 'vehicle', 'vehicle-auto', 'system', 'error'
 * @param {string} color - Optional: Custom Farbe
 */
function addRadioMessage(sender, message, type = 'system', color = null) {
    if (!radioFeed) {
        console.error('❌ Radio Feed nicht initialisiert');
        return null;
    }
    return radioFeed.addMessage(sender, message, type, color);
}

/**
 * Löscht Radio-Feed
 */
function clearRadioFeed() {
    if (radioFeed) {
        radioFeed.clear();
    }
}

// Global verfügbar machen
if (typeof window !== 'undefined') {
    window.radioFeed = radioFeed;
    window.addRadioMessage = addRadioMessage;
    window.clearRadioFeed = clearRadioFeed;
}

console.log('✅ Radio Feed UI geladen - addRadioMessage() global verfügbar');
