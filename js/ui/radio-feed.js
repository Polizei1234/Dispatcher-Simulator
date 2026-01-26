// =========================
// RADIO FEED SYSTEM v1.0
// Komplettes Funk-Interface mit UI
// =========================

class RadioFeed {
    constructor() {
        this.messages = [];
        this.maxMessages = 100;
        this.soundEnabled = true;
        this.autoScroll = true;
        
        this.initializeUI();
        console.log('📡 Radio Feed System initialisiert');
    }
    
    /**
     * Initialisiert das Radio-Feed UI
     */
    initializeUI() {
        // Prüfe ob Container existiert
        let radioContainer = document.getElementById('radio-feed-container');
        
        if (!radioContainer) {
            // Erstelle Radio-Feed Container
            radioContainer = document.createElement('div');
            radioContainer.id = 'radio-feed-container';
            radioContainer.className = 'radio-feed-container';
            radioContainer.innerHTML = `
                <div class="radio-feed-header">
                    <h3>📡 Funkverkehr</h3>
                    <div class="radio-controls">
                        <button id="radio-clear-btn" class="btn btn-sm btn-secondary" title="Funkprotokoll löschen">
                            🗑️ Löschen
                        </button>
                        <button id="radio-sound-toggle" class="btn btn-sm btn-secondary" title="Funktöne an/aus">
                            🔊
                        </button>
                        <button id="radio-autoscroll-toggle" class="btn btn-sm btn-secondary active" title="Auto-Scroll an/aus">
                            📜
                        </button>
                    </div>
                </div>
                <div class="radio-feed" id="radio-feed">
                    <div class="radio-message system">
                        <span class="radio-time">--:--:--</span>
                        <span class="radio-sender">System</span>
                        <span class="radio-content">Funkverkehr gestartet</span>
                    </div>
                </div>
                <div class="radio-input-section">
                    <select id="radio-vehicle-select" class="form-control">
                        <option value="">Fahrzeug wählen...</option>
                    </select>
                    <div class="radio-input-wrapper">
                        <input type="text" id="radio-input" class="form-control" placeholder="Funkspruch eingeben..." disabled>
                        <button id="radio-send-btn" class="btn btn-primary" disabled>
                            📡 Senden
                        </button>
                    </div>
                    <div class="radio-quick-commands">
                        <button class="radio-quick-btn" data-command="status">Status</button>
                        <button class="radio-quick-btn" data-command="eta">ETA</button>
                        <button class="radio-quick-btn" data-command="lage">Lage</button>
                        <button class="radio-quick-btn" data-command="verstanden">Verstanden</button>
                    </div>
                </div>
            `;
            
            // Füge zu Sidebar hinzu (oder erstelle eigene Sektion)
            const sidebar = document.querySelector('.sidebar') || document.body;
            sidebar.appendChild(radioContainer);
        }
        
        // Event Listeners
        this.attachEventListeners();
        
        // Update Fahrzeug-Dropdown
        this.updateVehicleDropdown();
    }
    
    /**
     * Event Listeners für Radio-UI
     */
    attachEventListeners() {
        // Clear Button
        const clearBtn = document.getElementById('radio-clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFeed());
        }
        
        // Sound Toggle
        const soundBtn = document.getElementById('radio-sound-toggle');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => this.toggleSound());
        }
        
        // Auto-Scroll Toggle
        const scrollBtn = document.getElementById('radio-autoscroll-toggle');
        if (scrollBtn) {
            scrollBtn.addEventListener('click', () => this.toggleAutoScroll());
        }
        
        // Fahrzeug Selection
        const vehicleSelect = document.getElementById('radio-vehicle-select');
        if (vehicleSelect) {
            vehicleSelect.addEventListener('change', (e) => {
                const vehicleId = e.target.value;
                this.selectVehicle(vehicleId);
            });
        }
        
        // Send Button
        const sendBtn = document.getElementById('radio-send-btn');
        const input = document.getElementById('radio-input');
        
        if (sendBtn && input) {
            sendBtn.addEventListener('click', () => this.sendMessage());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
        
        // Quick Command Buttons
        document.querySelectorAll('.radio-quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const command = e.target.dataset.command;
                this.insertQuickCommand(command);
            });
        });
    }
    
    /**
     * Aktualisiert Fahrzeug-Dropdown
     */
    updateVehicleDropdown() {
        const select = document.getElementById('radio-vehicle-select');
        if (!select || !game || !game.vehicles) return;
        
        const currentValue = select.value;
        select.innerHTML = '<option value="">Fahrzeug wählen...</option>';
        
        game.vehicles
            .filter(v => v.owned)
            .forEach(vehicle => {
                const statusInfo = CONFIG.getFMSStatus(vehicle.currentStatus);
                const option = document.createElement('option');
                option.value = vehicle.id;
                option.textContent = `${vehicle.callsign} - ${statusInfo.shortName}`;
                option.style.color = statusInfo.color;
                
                if (!statusInfo.canBeContacted) {
                    option.disabled = true;
                    option.textContent += ' (nicht erreichbar)';
                }
                
                select.appendChild(option);
            });
        
        // Restore selection
        if (currentValue) {
            select.value = currentValue;
        }
    }
    
    /**
     * Wählt Fahrzeug für Funk aus
     */
    selectVehicle(vehicleId) {
        const input = document.getElementById('radio-input');
        const sendBtn = document.getElementById('radio-send-btn');
        
        if (vehicleId) {
            // Aktiviere Input
            if (input) input.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            
            // Setze Focus
            if (input) input.focus();
            
            // Benachrichtige Radio System
            if (typeof radioSystem !== 'undefined') {
                radioSystem.selectVehicle(vehicleId);
            }
        } else {
            // Deaktiviere Input
            if (input) {
                input.disabled = true;
                input.value = '';
            }
            if (sendBtn) sendBtn.disabled = true;
        }
    }
    
    /**
     * Sendet Funkspruch
     */
    async sendMessage() {
        const input = document.getElementById('radio-input');
        const select = document.getElementById('radio-vehicle-select');
        
        if (!input || !select) return;
        
        const message = input.value.trim();
        const vehicleId = select.value;
        
        if (!message || !vehicleId) return;
        
        // Sende über Radio System
        if (typeof radioSystem !== 'undefined') {
            await radioSystem.sendRadioToVehicle(message);
        }
        
        // Clear input
        input.value = '';
        input.focus();
    }
    
    /**
     * Fügt Quick Command ein
     */
    insertQuickCommand(command) {
        const input = document.getElementById('radio-input');
        if (!input) return;
        
        const commands = {
            'status': 'Bitte Status melden, kommen.',
            'eta': 'Bitte ETA durchgeben, kommen.',
            'lage': 'Bitte Lage vor Ort durchgeben, kommen.',
            'verstanden': 'Verstanden, kommen.'
        };
        
        input.value = commands[command] || '';
        input.focus();
    }
    
    /**
     * Fügt Nachricht zum Feed hinzu (HAUPTFUNKTION!)
     */
    addMessage(sender, content, type = 'vehicle', color = null) {
        const message = {
            id: Date.now() + Math.random(),
            sender: sender,
            content: content,
            type: type, // 'dispatcher', 'vehicle', 'vehicle-auto', 'system', 'error'
            timestamp: new Date(),
            color: color
        };
        
        this.messages.push(message);
        
        // Begrenze Nachrichtenanzahl
        if (this.messages.length > this.maxMessages) {
            this.messages.shift();
        }
        
        // Füge zu UI hinzu
        this.renderMessage(message);
        
        // Sound abspielen
        if (this.soundEnabled) {
            this.playMessageSound(type);
        }
        
        // Auto-Scroll
        if (this.autoScroll) {
            this.scrollToBottom();
        }
        
        return message;
    }
    
    /**
     * Rendert einzelne Nachricht im UI
     */
    renderMessage(message) {
        const feed = document.getElementById('radio-feed');
        if (!feed) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = `radio-message ${message.type}`;
        messageEl.dataset.messageId = message.id;
        
        if (message.color) {
            messageEl.style.borderLeftColor = message.color;
        }
        
        const time = this.formatTime(message.timestamp);
        
        messageEl.innerHTML = `
            <span class="radio-time">${time}</span>
            <span class="radio-sender">${message.sender}</span>
            <span class="radio-content">${this.escapeHtml(message.content)}</span>
        `;
        
        feed.appendChild(messageEl);
        
        // Animiere Einblendung
        setTimeout(() => messageEl.classList.add('visible'), 10);
    }
    
    /**
     * Formatiert Zeitstempel
     */
    formatTime(date) {
        return date.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    /**
     * Escaped HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Spielt Funk-Sound ab
     */
    playMessageSound(type) {
        if (!this.soundEnabled) return;
        
        // Versuche Sound abzuspielen
        try {
            const soundMap = {
                'dispatcher': 'sounds/radio-send.mp3',
                'vehicle': 'sounds/radio-receive.mp3',
                'vehicle-auto': 'sounds/radio-receive.mp3',
                'error': 'sounds/radio-error.mp3',
                'system': 'sounds/radio-beep.mp3'
            };
            
            const soundFile = soundMap[type];
            if (soundFile) {
                const audio = new Audio(soundFile);
                audio.volume = 0.3;
                audio.play().catch(err => {
                    // Silence errors (z.B. wenn Sounds nicht existieren)
                    console.debug('Sound konnte nicht abgespielt werden:', err);
                });
            }
        } catch (err) {
            console.debug('Sound-System nicht verfügbar:', err);
        }
    }
    
    /**
     * Scrollt zum Ende des Feeds
     */
    scrollToBottom() {
        const feed = document.getElementById('radio-feed');
        if (feed) {
            feed.scrollTop = feed.scrollHeight;
        }
    }
    
    /**
     * Löscht Feed
     */
    clearFeed() {
        if (!confirm('Funkprotokoll wirklich löschen?')) return;
        
        this.messages = [];
        const feed = document.getElementById('radio-feed');
        if (feed) {
            feed.innerHTML = `
                <div class="radio-message system">
                    <span class="radio-time">${this.formatTime(new Date())}</span>
                    <span class="radio-sender">System</span>
                    <span class="radio-content">Funkprotokoll gelöscht</span>
                </div>
            `;
        }
    }
    
    /**
     * Toggle Sound
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('radio-sound-toggle');
        if (btn) {
            btn.textContent = this.soundEnabled ? '🔊' : '🔇';
            btn.classList.toggle('active', this.soundEnabled);
        }
        
        this.addMessage('System', `Funktöne ${this.soundEnabled ? 'aktiviert' : 'deaktiviert'}`, 'system');
    }
    
    /**
     * Toggle Auto-Scroll
     */
    toggleAutoScroll() {
        this.autoScroll = !this.autoScroll;
        const btn = document.getElementById('radio-autoscroll-toggle');
        if (btn) {
            btn.classList.toggle('active', this.autoScroll);
        }
        
        this.addMessage('System', `Auto-Scroll ${this.autoScroll ? 'aktiviert' : 'deaktiviert'}`, 'system');
    }
    
    /**
     * Exportiert Funkprotokoll
     */
    exportLog() {
        const log = this.messages.map(m => {
            return `[${this.formatTime(m.timestamp)}] ${m.sender}: ${m.content}`;
        }).join('\n');
        
        const blob = new Blob([log], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `funkprotokoll_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    /**
     * Cleanup
     */
    cleanup() {
        this.messages = [];
        console.log('🧹 Radio Feed cleanup');
    }
}

// Globale Instanz
const radioFeed = new RadioFeed();

/**
 * GLOBALE FUNKTION - Wird von allen Systemen genutzt!
 */
function addRadioMessage(sender, content, type = 'vehicle', color = null) {
    if (radioFeed) {
        return radioFeed.addMessage(sender, content, type, color);
    } else {
        console.warn('⚠️ Radio Feed nicht initialisiert');
        console.log(`[${sender}] ${content}`);
    }
}

// Global verfügbar machen
if (typeof window !== 'undefined') {
    window.radioFeed = radioFeed;
    window.addRadioMessage = addRadioMessage;
    
    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (radioFeed) radioFeed.cleanup();
    });
}

console.log('✅ Radio Feed System geladen');
console.log('✅ addRadioMessage() global verfügbar');