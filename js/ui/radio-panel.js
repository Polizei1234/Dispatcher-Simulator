// =========================
// RADIO PANEL UI v1.0.0
// Benutzerinterface für das Funksystem
// =========================

const RadioUI = {
    panelElement: null,
    currentChannel: 'rettungsdienst',
    isMinimized: false,

    /**
     * Initialisierung
     */
    initialize() {
        console.log('📺 RadioUI initialisiert');
        this.createPanel();
        this.attachEventListeners();
        this.updateAll();
    },

    /**
     * Erstellt das Radio-Panel
     */
    createPanel() {
        const panel = document.createElement('div');
        panel.id = 'radio-panel';
        panel.className = 'radio-panel';
        
        panel.innerHTML = `
            <div class="radio-panel-header">
                <div class="radio-panel-title">
                    <span class="radio-icon">📡</span>
                    <span>FUNKVERKEHR</span>
                    <span class="radio-status-indicator live">⚫ LIVE</span>
                </div>
                <div class="radio-panel-controls">
                    <button class="btn-icon" id="radio-minimize-btn" title="Minimieren">
                        <span>➖</span>
                    </button>
                    <button class="btn-icon" id="radio-close-btn" title="Schließen">
                        <span>❌</span>
                    </button>
                </div>
            </div>

            <div class="radio-panel-body">
                <!-- Kanal-Auswahl -->
                <div class="radio-channels" id="radio-channels">
                    <!-- Dynamisch generiert -->
                </div>

                <!-- Warteschlange -->
                <div class="radio-queue-section" id="radio-queue-section">
                    <div class="radio-queue-header">
                        <span>📥 WARTESCHLANGE</span>
                        <span class="queue-count" id="queue-count">0</span>
                    </div>
                    <div class="radio-queue-list" id="radio-queue-list">
                        <!-- Dynamisch generiert -->
                    </div>
                </div>

                <!-- Funkprotokoll -->
                <div class="radio-log-section">
                    <div class="radio-log-header">
                        <span>📋 FUNKPROTOKOLL</span>
                        <div class="radio-log-controls">
                            <button class="btn-small" id="radio-log-clear-btn" title="Protokoll löschen">
                                🗑️
                            </button>
                            <button class="btn-small" id="radio-log-export-btn" title="Exportieren">
                                💾
                            </button>
                        </div>
                    </div>
                    <div class="radio-log" id="radio-log">
                        <!-- Dynamisch generiert -->
                    </div>
                </div>

                <!-- Nachricht senden -->
                <div class="radio-send-section">
                    <div class="radio-send-header">
                        <span>📤 NACHRICHT SENDEN</span>
                    </div>
                    <div class="radio-send-form">
                        <div class="radio-form-row">
                            <label>An:</label>
                            <select id="radio-target-vehicle" class="radio-select">
                                <option value="">-- Fahrzeug auswählen --</option>
                            </select>
                        </div>
                        <div class="radio-form-row">
                            <label>Nachricht:</label>
                            <textarea id="radio-message-input" 
                                      class="radio-textarea" 
                                      placeholder="Funkspruch eingeben..."
                                      rows="3"></textarea>
                        </div>
                        <div class="radio-form-row">
                            <button id="radio-send-btn" class="btn btn-primary" disabled>
                                📡 SENDEN
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.panelElement = panel;

        // Generiere Kanal-Buttons
        this.generateChannelButtons();

        // Update Fahrzeug-Liste
        this.updateVehicleSelect();
    },

    /**
     * Generiert Kanal-Buttons
     */
    generateChannelButtons() {
        const container = document.getElementById('radio-channels');
        if (!container || !RadioSystem.channels) return;

        container.innerHTML = '';

        for (const [key, channel] of Object.entries(RadioSystem.channels)) {
            const button = document.createElement('button');
            button.className = 'radio-channel-btn';
            button.dataset.channel = key;
            button.innerHTML = `
                <span class="channel-icon">${channel.icon}</span>
                <span class="channel-name">${channel.name}</span>
            `;

            if (key === this.currentChannel) {
                button.classList.add('active');
            }

            button.addEventListener('click', () => {
                this.switchChannel(key);
            });

            container.appendChild(button);
        }
    },

    /**
     * Wechselt den Funkkanal
     */
    switchChannel(channel) {
        this.currentChannel = channel;
        console.log(`📻 Kanal gewechselt: ${channel}`);

        // Update aktiven Button
        document.querySelectorAll('.radio-channel-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.channel === channel) {
                btn.classList.add('active');
            }
        });

        // Update Log (gefiltert nach Kanal)
        this.updateLog();
    },

    /**
     * Update Fahrzeug-Auswahl
     */
    updateVehicleSelect() {
        const select = document.getElementById('radio-target-vehicle');
        if (!select) return;

        const currentValue = select.value;
        select.innerHTML = '<option value="">-- Fahrzeug auswählen --</option>';

        // Gruppiere nach Kanal
        const channelGroups = {};

        GAME_DATA.vehicles.forEach(vehicle => {
            const channel = RadioSystem.getChannelForVehicle(vehicle);
            if (!channelGroups[channel]) {
                channelGroups[channel] = [];
            }
            channelGroups[channel].push(vehicle);
        });

        // Erstelle Optgroups
        for (const [channelKey, vehicles] of Object.entries(channelGroups)) {
            const channel = RadioSystem.channels[channelKey];
            if (!channel) continue;

            const optgroup = document.createElement('optgroup');
            optgroup.label = `${channel.icon} ${channel.name}`;

            vehicles.forEach(vehicle => {
                const option = document.createElement('option');
                option.value = vehicle.id;
                option.textContent = `${vehicle.callsign} (${vehicle.type})`;
                optgroup.appendChild(option);
            });

            select.appendChild(optgroup);
        }

        // Restore vorherige Auswahl
        if (currentValue) {
            select.value = currentValue;
        }
    },

    /**
     * Event Listeners
     */
    attachEventListeners() {
        // Minimieren
        document.getElementById('radio-minimize-btn')?.addEventListener('click', () => {
            this.toggleMinimize();
        });

        // Schließen
        document.getElementById('radio-close-btn')?.addEventListener('click', () => {
            this.togglePanel();
        });

        // Senden-Button
        document.getElementById('radio-send-btn')?.addEventListener('click', () => {
            this.sendMessage();
        });

        // Input-Änderungen
        document.getElementById('radio-target-vehicle')?.addEventListener('change', () => {
            this.validateSendButton();
        });

        document.getElementById('radio-message-input')?.addEventListener('input', () => {
            this.validateSendButton();
        });

        // Enter zum Senden (Strg+Enter)
        document.getElementById('radio-message-input')?.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Log-Controls
        document.getElementById('radio-log-clear-btn')?.addEventListener('click', () => {
            if (confirm('Funkprotokoll wirklich löschen?')) {
                RadioSystem.clearLog();
            }
        });

        document.getElementById('radio-log-export-btn')?.addEventListener('click', () => {
            RadioSystem.exportLog();
        });
    },

    /**
     * Validiert Senden-Button
     */
    validateSendButton() {
        const vehicleSelect = document.getElementById('radio-target-vehicle');
        const messageInput = document.getElementById('radio-message-input');
        const sendBtn = document.getElementById('radio-send-btn');

        if (!vehicleSelect || !messageInput || !sendBtn) return;

        const hasVehicle = vehicleSelect.value !== '';
        const hasMessage = messageInput.value.trim().length > 0;

        sendBtn.disabled = !(hasVehicle && hasMessage);
    },

    /**
     * Sendet Nachricht
     */
    async sendMessage() {
        const vehicleSelect = document.getElementById('radio-target-vehicle');
        const messageInput = document.getElementById('radio-message-input');

        if (!vehicleSelect || !messageInput) return;

        const vehicleId = vehicleSelect.value;
        const message = messageInput.value.trim();

        if (!vehicleId || !message) return;

        // Sende über RadioSystem
        await RadioSystem.sendDispatchMessage(vehicleId, message);

        // Leere Eingabefeld
        messageInput.value = '';
        this.validateSendButton();

        console.log(`✅ Nachricht gesendet an ${vehicleId}`);
    },

    /**
     * Update Warteschlange
     */
    updateQueue() {
        const queueList = document.getElementById('radio-queue-list');
        const queueCount = document.getElementById('queue-count');
        const queueSection = document.getElementById('radio-queue-section');

        if (!queueList || !queueCount || !queueSection) return;

        const queue = RadioSystem.queue;

        queueCount.textContent = queue.length;

        // Zeige/Verstecke Sektion
        if (queue.length === 0) {
            queueSection.style.display = 'none';
            return;
        }

        queueSection.style.display = 'block';
        queueList.innerHTML = '';

        queue.forEach(entry => {
            const { vehicle, priority, reason, timestamp } = entry;
            const priorityInfo = RadioSystem.config.priority_levels[priority];

            const queueItem = document.createElement('div');
            queueItem.className = `radio-queue-item priority-${priority}`;
            queueItem.innerHTML = `
                <div class="queue-item-header">
                    <span class="priority-icon">${priorityInfo.icon}</span>
                    <span class="vehicle-callsign">${vehicle.callsign}</span>
                    <span class="priority-badge">${priorityInfo.name}</span>
                </div>
                <div class="queue-item-body">
                    <span class="queue-reason">${this.getReasonText(reason)}</span>
                    <span class="queue-time">${this.formatTime(timestamp)}</span>
                </div>
                <div class="queue-item-actions">
                    <button class="btn btn-small btn-success" 
                            onclick="RadioUI.grantPermission('${vehicle.id}')">
                        🗣️ Sprecherlaubnis erteilen
                    </button>
                </div>
            `;

            queueList.appendChild(queueItem);
        });
    },

    /**
     * Erteilt Sprecherlaubnis
     */
    async grantPermission(vehicleId) {
        await RadioSystem.grantSpeakPermission(vehicleId);
    },

    /**
     * Zeigt manuellen Trigger-Button
     */
    showManualTriggerButton(vehicle, triggerType) {
        // Füge temporären Button zum Log hinzu
        const logEntry = {
            type: 'manual_trigger',
            vehicle: vehicle,
            triggerType: triggerType,
            message: `${vehicle.callsign} kann ${this.getTriggerText(triggerType)} senden`
        };

        RadioSystem.addLogEntry(logEntry);
    },

    /**
     * Update Funkprotokoll
     */
    updateLog() {
        const logElement = document.getElementById('radio-log');
        if (!logElement) return;

        // Filtere nach aktuellem Kanal (nur für Fahrzeug-bezogene Einträge)
        const log = RadioSystem.getLog({ channel: this.currentChannel });

        if (log.length === 0) {
            logElement.innerHTML = '<div class="radio-log-empty">💭 Keine Funksprüche</div>';
            return;
        }

        logElement.innerHTML = '';

        log.forEach(entry => {
            const logItem = this.createLogItem(entry);
            logElement.appendChild(logItem);
        });

        // Auto-scroll nach unten (wenn aktiviert)
        if (RadioSystem.config?.ui_settings?.auto_scroll) {
            logElement.scrollTop = 0; // Scrollen nach oben da neueste zuerst
        }
    },

    /**
     * Erstellt Log-Item Element
     */
    createLogItem(entry) {
        const item = document.createElement('div');
        item.className = `radio-log-item ${entry.type}`;

        const time = this.formatTimestamp(entry.timestamp);
        
        let directionIcon = '';
        if (entry.direction === 'dispatch_to_vehicle') {
            directionIcon = '⬇️';
        } else if (entry.direction === 'vehicle_to_dispatch') {
            directionIcon = '⬆️';
        } else if (entry.direction === 'broadcast') {
            directionIcon = '📢';
        }

        let aiTag = '';
        if (entry.ai_generated) {
            aiTag = '<span class="ai-tag" title="Von KI generiert">🤖</span>';
        }

        let content = '';

        switch (entry.type) {
            case 'status_change':
                content = `
                    <div class="log-time">${time}</div>
                    <div class="log-content status-change">
                        ${entry.icon} ${entry.message}
                    </div>
                `;
                break;

            case 'dispatch_to_vehicle':
            case 'vehicle_to_dispatch':
                content = `
                    <div class="log-header">
                        <span class="log-time">${time}</span>
                        <span class="log-direction">${directionIcon}</span>
                        ${aiTag}
                    </div>
                    <div class="log-message">${entry.message}</div>
                `;
                break;

            case 'broadcast':
                content = `
                    <div class="log-time">${time}</div>
                    <div class="log-content broadcast">
                        ${entry.message}
                    </div>
                `;
                break;

            case 'queue_add':
                content = `
                    <div class="log-time">${time}</div>
                    <div class="log-content queue-info">
                        📥 ${entry.message}
                    </div>
                `;
                break;

            case 'manual_trigger':
                content = `
                    <div class="log-time">${time}</div>
                    <div class="log-content manual-trigger">
                        ${entry.message}
                        <button class="btn btn-small" 
                                onclick="RadioSystem.triggerManualVehicleMessage('${entry.vehicle.id}', '${entry.triggerType}')">
                            ${this.getTriggerText(entry.triggerType)}
                        </button>
                    </div>
                `;
                break;

            default:
                content = `
                    <div class="log-time">${time}</div>
                    <div class="log-content">${entry.message || ''}</div>
                `;
        }

        item.innerHTML = content;
        return item;
    },

    /**
     * Formatiert Zeitstempel
     */
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('de-DE', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    },

    /**
     * Formatiert Zeit seit
     */
    formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);

        if (seconds < 60) {
            return `${seconds}s`;
        }

        const minutes = Math.floor(seconds / 60);
        return `${minutes}m`;
    },

    /**
     * Text für Grund
     */
    getReasonText(reason) {
        const texts = {
            'sprechwunsch': 'Sprechwunsch',
            'sprechwunsch_priorisiert': 'Priorisierter Sprechwunsch',
            'lagemeldung': 'Lagemeldung',
            'transportziel_anfrage': 'Transportziel-Anfrage',
            'response_to_dispatch': 'Antwort auf Leitstelle'
        };
        return texts[reason] || reason;
    },

    /**
     * Text für Trigger
     */
    getTriggerText(triggerType) {
        const texts = {
            'lagemeldung': 'Lagemeldung anfordern',
            'transportziel_anfrage': 'Transportziel anfragen'
        };
        return texts[triggerType] || triggerType;
    },

    /**
     * Toggle Panel
     */
    togglePanel() {
        if (this.panelElement) {
            this.panelElement.classList.toggle('hidden');
        }
    },

    /**
     * Toggle Minimize
     */
    toggleMinimize() {
        if (this.panelElement) {
            this.panelElement.classList.toggle('minimized');
            this.isMinimized = !this.isMinimized;
            
            const btn = document.getElementById('radio-minimize-btn');
            if (btn) {
                btn.querySelector('span').textContent = this.isMinimized ? '➕' : '➖';
            }
        }
    },

    /**
     * Update alle UI-Komponenten
     */
    updateAll() {
        this.updateVehicleSelect();
        this.updateQueue();
        this.updateLog();
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Warte bis RadioSystem bereit ist
        setTimeout(() => {
            RadioUI.initialize();
            console.log('✅ RadioUI bereit');
        }, 500);
    });
}

console.log('✅ radio-panel.js geladen');
