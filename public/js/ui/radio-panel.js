import cleanupManager from '../core/cleanup-manager.js';

// =========================
// RADIO PANEL UI v2.0.0
// Benutzerinterface für das Funksystem (refactored as a class)
// =========================

class RadioPanel {
    constructor(radioSystem) {
        this.radioSystem = radioSystem;
        this.panelElement = null;
        this.currentChannel = 'rettungsdienst';
        this.isMinimized = false;
        this.isVisible = false;
        this.logUpdateTimeout = null;
        this.initialized = false;
    }

    /**
     * Initialisierung
     */
    initialize() {
        if (this.initialized) {
            console.warn('⚠️ RadioUI bereits initialisiert');
            return;
        }
        
        console.log('📺 RadioUI v2.0.0 initialisiert');
        
        this.createPanel();
        this.attachEventListeners();
        this.updateAll();
        this.initialized = true;
        
        console.log('✅ RadioUI vollständig initialisiert');
    }

    /**
     * 🔧 v1.1.0: Debounced Log Update (max 1x pro 100ms)
     */
    scheduleLogUpdate() {
        if (this.logUpdateTimeout) {
            clearTimeout(this.logUpdateTimeout);
        }
        
        this.logUpdateTimeout = cleanupManager.setTimeout('radio-panel',() => {
            this.updateLog();
            this.logUpdateTimeout = null;
        }, 100);
    }

    /**
     * 🔧 v1.1.0: XSS-sichere Text-Escape-Funktion
     */
    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') {
            return '';
        }
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * 🎨 v1.3.0: Parst Funkspruch und trennt Callsign vom Text
     * @returns {callsign: string, text: string}
     */
    parseFunkspruch(message) {
        if (!message || typeof message !== 'string') {
            return { callsign: '', text: message || '' };
        }

        // Regex: Sucht nach Callsign am Anfang (bis "an Leitstelle" oder "von Leitstelle")
        // Beispiel: "RTW 12/83-1 an Leitstelle, FMS 2, einsatzbereit, kommen"
        const match = message.match(/^([^,]+?)\s*(an|von)\s*Leitstelle[,:]?\s*(.*)$/i);
        
        if (match) {
            return {
                callsign: match[1].trim(),
                text: match[3].trim()
            };
        }

        // Fallback: Wenn kein Match, nimm ersten Teil bis Komma als Callsign
        const parts = message.split(',');
        if (parts.length > 1) {
            return {
                callsign: parts[0].trim(),
                text: parts.slice(1).join(',').trim()
            };
        }

        // Wenn nichts passt, gesamte Nachricht als Text
        return { callsign: '', text: message };
    }

    /**
     * Erstellt das Radio-Panel
     */
    createPanel() {
        const panel = document.createElement('div');
        panel.id = 'radio-panel';
        panel.className = 'radio-panel';
        
        // 🔧 v1.2.1: Standardmäßig versteckt
        panel.style.display = 'none';
        
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

                <!-- 🆕 v1.2.0: Sammelruf-Sektion -->
                <div class="radio-broadcast-section" style="margin-bottom: 15px; padding: 15px; background: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.3); border-radius: 8px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-weight: bold;">📢 SAMMELRUF</span>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <select id="broadcast-channel" class="radio-select" style="flex: 1;">
                            <!-- Dynamisch generiert -->
                        </select>
                        <button id="broadcast-btn" class="btn btn-warning" style="white-space: nowrap;">
                            📢 Senden
                        </button>
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

        // 🆕 v1.2.0: Generiere Broadcast-Kanal-Select
        this.generateBroadcastChannelSelect();

        // Update Fahrzeug-Liste
        this.updateVehicleSelect();
        
        console.log('✅ Radio Panel erstellt (standardmäßig versteckt)');
    }

    /**
     * Generiert Kanal-Buttons
     */
    generateChannelButtons() {
        const container = document.getElementById('radio-channels');
        if (!container || !this.radioSystem.channels) return;

        container.innerHTML = '';

        for (const [key, channel] of Object.entries(this.radioSystem.channels)) {
            const button = document.createElement('button');
            button.className = 'radio-channel-btn';
            button.dataset.channel = key;
            
            // 🔧 XSS-sicher: Verwende textContent
            const iconSpan = document.createElement('span');
            iconSpan.className = 'channel-icon';
            iconSpan.textContent = channel.icon;
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'channel-name';
            nameSpan.textContent = channel.name;
            
            button.appendChild(iconSpan);
            button.appendChild(nameSpan);

            if (key === this.currentChannel) {
                button.classList.add('active');
            }

            cleanupManager.addEventListener('radio-panel', button, 'click', () => {
                this.switchChannel(key);
            });

            container.appendChild(button);
        }
    }

    /**
     * 🆕 v1.2.0: Generiert Broadcast-Kanal-Select
     */
    generateBroadcastChannelSelect() {
        const select = document.getElementById('broadcast-channel');
        if (!select || !this.radioSystem.channels) return;

        select.innerHTML = '';

        for (const [key, channel] of Object.entries(this.radioSystem.channels)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `${channel.icon} ${channel.name}`;
            select.appendChild(option);
        }
    }

    /**
     * 🆕 v1.2.0: Zeigt Sammelruf-Dialog
     */
    showBroadcastDialog() {
        const channel = document.getElementById('broadcast-channel')?.value;
        if (!channel) {
            alert('Bitte Kanal auswählen');
            return;
        }

        const message = prompt(`Sammelruf an alle Fahrzeuge auf Kanal "${this.radioSystem.channels[channel].name}":\n\nNachricht eingeben:`);
        if (!message || message.trim() === '') {
            return;
        }

        this.radioSystem.sendBroadcast(channel, message.trim());
    }

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
    }

    /**
     * 🔧 v1.1.0: Update Fahrzeug-Auswahl (mit GAME_DATA Safety)
     */
    updateVehicleSelect() {
        const select = document.getElementById('radio-target-vehicle');
        if (!select) return;

        // 🔧 GAME_DATA Safety Check
        if (typeof GAME_DATA === 'undefined' || !GAME_DATA.vehicles) {
            console.warn('⚠️ GAME_DATA.vehicles nicht verfügbar');
            return;
        }

        const currentValue = select.value;
        select.innerHTML = '<option value="">-- Fahrzeug auswählen --</option>';

        // Gruppiere nach Kanal
        const channelGroups = {};

        GAME_DATA.vehicles.forEach(vehicle => {
            const channel = this.radioSystem.getChannelForVehicle(vehicle);
            if (!channelGroups[channel]) {
                channelGroups[channel] = [];
            }
            channelGroups[channel].push(vehicle);
        });

        // Erstelle Optgroups
        for (const [channelKey, vehicles] of Object.entries(channelGroups)) {
            const channel = this.radioSystem.channels[channelKey];
            if (!channel) continue;

            const optgroup = document.createElement('optgroup');
            optgroup.label = `${channel.icon} ${channel.name}`;

            vehicles.forEach(vehicle => {
                const option = document.createElement('option');
                option.value = vehicle.id;
                // 🔧 XSS-sicher: textContent verwenden
                option.textContent = `${vehicle.callsign} (${vehicle.type})`;
                optgroup.appendChild(option);
            });

            select.appendChild(optgroup);
        }

        // Restore vorherige Auswahl
        if (currentValue) {
            select.value = currentValue;
        }
    }

    /**
     * Event Listeners
     */
    attachEventListeners() {
        // Minimieren
        cleanupManager.addEventListener('radio-panel', document.getElementById('radio-minimize-btn'), 'click', () => {
            this.toggleMinimize();
        });

        // Schließen
        cleanupManager.addEventListener('radio-panel', document.getElementById('radio-close-btn'), 'click', () => {
            this.togglePanel();
        });

        // Senden-Button
        cleanupManager.addEventListener('radio-panel', document.getElementById('radio-send-btn'), 'click', () => {
            this.sendMessage();
        });

        // Broadcast-Button
        cleanupManager.addEventListener('radio-panel', document.getElementById('broadcast-btn'), 'click', () => {
            this.showBroadcastDialog();
        });

        // Input-Änderungen
        cleanupManager.addEventListener('radio-panel', document.getElementById('radio-target-vehicle'), 'change', () => {
            this.validateSendButton();
        });

        cleanupManager.addEventListener('radio-panel', document.getElementById('radio-message-input'), 'input', () => {
            this.validateSendButton();
        });

        // Enter zum Senden (Strg+Enter)
        cleanupManager.addEventListener('radio-panel', document.getElementById('radio-message-input'), 'keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Log-Controls
        cleanupManager.addEventListener('radio-panel', document.getElementById('radio-log-clear-btn'), 'click', () => {
            if (confirm('Funkprotokoll wirklich löschen?')) {
                this.radioSystem.clearLog();
            }
        });

        cleanupManager.addEventListener('radio-panel', document.getElementById('radio-log-export-btn'), 'click', () => {
            this.radioSystem.exportLog();
        });
    }

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
    }

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
        await this.radioSystem.sendDispatchMessage(vehicleId, message);

        // Leere Eingabefeld
        messageInput.value = '';
        this.validateSendButton();

        console.log(`✅ Nachricht gesendet an ${vehicleId}`);
    }

    /**
     * 🆕 v1.2.0: Update Warteschlange + Header Badge
     */
    updateQueue() {
        const queueList = document.getElementById('radio-queue-list');
        const queueCount = document.getElementById('queue-count');
        const queueSection = document.getElementById('radio-queue-section');

        if (!queueList || !queueCount || !queueSection) return;

        const queue = this.radioSystem.queue;

        queueCount.textContent = queue.length;

        // 🆕 v1.2.0: Update Header Badge
        this.updateHeaderBadge(queue.length);

        // Zeige/Verstecke Sektion
        if (queue.length === 0) {
            queueSection.style.display = 'none';
            return;
        }

        queueSection.style.display = 'block';
        queueList.innerHTML = '';

        queue.forEach(entry => {
            const { vehicle, priority, reason, timestamp } = entry;
            const priorityInfo = this.radioSystem.config.priority_levels[priority];

            const queueItem = document.createElement('div');
            queueItem.className = `radio-queue-item priority-${priority}`;
            
            // 🔧 XSS-sicher: createElement + textContent
            const header = document.createElement('div');
            header.className = 'queue-item-header';
            
            const prioIcon = document.createElement('span');
            prioIcon.className = 'priority-icon';
            prioIcon.textContent = priorityInfo.icon;
            
            const callsign = document.createElement('span');
            callsign.className = 'vehicle-callsign';
            callsign.textContent = vehicle.callsign;
            
            const badge = document.createElement('span');
            badge.className = 'priority-badge';
            badge.textContent = priorityInfo.name;
            
            header.appendChild(prioIcon);
            header.appendChild(callsign);
            header.appendChild(badge);
            
            const body = document.createElement('div');
            body.className = 'queue-item-body';
            
            const reasonSpan = document.createElement('span');
            reasonSpan.className = 'queue-reason';
            reasonSpan.textContent = this.getReasonText(reason);
            
            const timeSpan = document.createElement('span');
            timeSpan.className = 'queue-time';
            timeSpan.textContent = this.formatTime(timestamp);
            
            body.appendChild(reasonSpan);
            body.appendChild(timeSpan);
            
            const actions = document.createElement('div');
            actions.className = 'queue-item-actions';
            
            const btn = document.createElement('button');
            btn.className = 'btn btn-small btn-success';
            btn.textContent = '🗣️ Sprecherlaubnis erteilen';
            cleanupManager.addEventListener('radio-panel', btn, 'click', () => {
                this.grantPermission(vehicle.id);
            });
            
            actions.appendChild(btn);
            
            queueItem.appendChild(header);
            queueItem.appendChild(body);
            queueItem.appendChild(actions);
            
            queueList.appendChild(queueItem);
        });
    }

    /**
     * 🆕 v1.2.0: Aktualisiert Queue-Badge im Header
     */
    updateHeaderBadge(count) {
        const badge = document.getElementById('radio-queue-badge');
        if (!badge) return;

        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }

    /**
     * Erteilt Sprecherlaubnis
     */
    async grantPermission(vehicleId) {
        await this.radioSystem.grantSpeakPermission(vehicleId);
    }

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

        this.radioSystem.addLogEntry(logEntry);
    }

    /**
     * Update Funkprotokoll
     */
    updateLog() {
        const logElement = document.getElementById('radio-log');
        if (!logElement) return;

        // Filtere nach aktuellem Kanal (nur für Fahrzeug-bezogene Einträge)
        const log = this.radioSystem.getLog({ channel: this.currentChannel });

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
        if (this.radioSystem.config?.ui_settings?.auto_scroll) {
            logElement.scrollTop = 0; // Scrollen nach oben da neueste zuerst
        }
    }

    /**
     * ✨ v1.4.0: Erstellt Log-Item Element mit AUTO-Badge
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
            aiTag = '🤖';
        }

        // ✨ v1.4.0: AUTO-Badge für automatische Funksprüche
        let autoBadge = null;
        if (entry.automatic) {
            autoBadge = document.createElement('span');
            autoBadge.className = 'auto-badge';
            autoBadge.textContent = '[AUTO]';
            autoBadge.title = 'Automatisch generierter Funkspruch';
        }

        // 🔧 XSS-sicher: createElement + textContent statt innerHTML
        switch (entry.type) {
            case 'status_change':
                const timeDiv1 = document.createElement('div');
                timeDiv1.className = 'log-time';
                timeDiv1.textContent = time;
                
                const contentDiv1 = document.createElement('div');
                contentDiv1.className = 'log-content status-change';
                contentDiv1.textContent = `${entry.icon} ${entry.message}`;
                
                item.appendChild(timeDiv1);
                item.appendChild(contentDiv1);
                break;

            case 'dispatch_to_vehicle':
            case 'vehicle_to_dispatch':
                const header = document.createElement('div');
                header.className = 'log-header';
                
                const timeSpan = document.createElement('span');
                timeSpan.className = 'log-time';
                timeSpan.textContent = time;
                
                const dirSpan = document.createElement('span');
                dirSpan.className = 'log-direction';
                dirSpan.textContent = directionIcon;
                
                header.appendChild(timeSpan);
                header.appendChild(dirSpan);
                
                // ✨ v1.4.0: AUTO-Badge hinzufügen
                if (autoBadge) {
                    header.appendChild(autoBadge);
                }
                
                if (aiTag) {
                    const aiSpan = document.createElement('span');
                    aiSpan.className = 'ai-tag';
                    aiSpan.title = 'Von KI generiert';
                    aiSpan.textContent = aiTag;
                    header.appendChild(aiSpan);
                }
                
                // 🎨 v1.3.0: PARSE FUNKSPRUCH + VISUELL TRENNEN
                const messageDiv = document.createElement('div');
                messageDiv.className = 'log-message';
                
                const parsed = this.parseFunkspruch(entry.message);
                
                if (parsed.callsign) {
                    // Callsign FETT + GELB
                    const callsignSpan = document.createElement('span');
                    callsignSpan.className = 'log-message-callsign';
                    callsignSpan.textContent = parsed.callsign;
                    messageDiv.appendChild(callsignSpan);
                    
                    // Trennzeichen
                    const separator = document.createTextNode(' → ');
                    messageDiv.appendChild(separator);
                }
                
                // Funkspruch-Text BLAU
                const textSpan = document.createElement('span');
                textSpan.className = 'log-message-text';
                textSpan.textContent = parsed.text;
                messageDiv.appendChild(textSpan);
                
                item.appendChild(header);
                item.appendChild(messageDiv);
                break;

            case 'broadcast':
                const timeDiv2 = document.createElement('div');
                timeDiv2.className = 'log-time';
                timeDiv2.textContent = time;
                
                const contentDiv2 = document.createElement('div');
                contentDiv2.className = 'log-content broadcast';
                contentDiv2.textContent = entry.message || '';
                
                item.appendChild(timeDiv2);
                item.appendChild(contentDiv2);
                break;

            case 'queue_add':
                const timeDiv3 = document.createElement('div');
                timeDiv3.className = 'log-time';
                timeDiv3.textContent = time;
                
                const contentDiv3 = document.createElement('div');
                contentDiv3.className = 'log-content queue-info';
                contentDiv3.textContent = `📥 ${entry.message}`;
                
                item.appendChild(timeDiv3);
                item.appendChild(contentDiv3);
                break;

            case 'manual_trigger':
                const timeDiv4 = document.createElement('div');
                timeDiv4.className = 'log-time';
                timeDiv4.textContent = time;
                
                const contentDiv4 = document.createElement('div');
                contentDiv4.className = 'log-content manual-trigger';
                
                const messageText = document.createElement('span');
                messageText.textContent = entry.message || '';
                
                const triggerBtn = document.createElement('button');
                triggerBtn.className = 'btn btn-small';
                triggerBtn.textContent = this.getTriggerText(entry.triggerType);
                cleanupManager.addEventListener('radio-panel', triggerBtn, 'click', () => {
                    this.radioSystem.triggerManualVehicleMessage(entry.vehicle.id, entry.triggerType);
                });
                
                contentDiv4.appendChild(messageText);
                contentDiv4.appendChild(triggerBtn);
                
                item.appendChild(timeDiv4);
                item.appendChild(contentDiv4);
                break;

            default:
                const timeDiv5 = document.createElement('div');
                timeDiv5.className = 'log-time';
                timeDiv5.textContent = time;
                
                const contentDiv5 = document.createElement('div');
                contentDiv5.className = 'log-content';
                contentDiv5.textContent = entry.message || '';
                
                item.appendChild(timeDiv5);
                item.appendChild(contentDiv5);
        }

        return item;
    }

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
    }

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
    }

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
    }

    /**
     * Text für Trigger
     */
    getTriggerText(triggerType) {
        const texts = {
            'lagemeldung': 'Lagemeldung anfordern',
            'transportziel_anfrage': 'Transportziel anfragen'
        };
        return texts[triggerType] || triggerType;
    }

    /**
     * 🔧 v1.2.1: Toggle Panel (FIX: display statt classList)
     */
    togglePanel() {
        if (!this.panelElement) return;
        
        if (this.panelElement.style.display === 'none') {
            this.panelElement.style.display = 'block';
            this.isVisible = true;
            console.log('✅ Radio Panel geöffnet');
        } else {
            this.panelElement.style.display = 'none';
            this.isVisible = false;
            console.log('❌ Radio Panel geschlossen');
        }
    }

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
    }

    /**
     * Update alle UI-Komponenten
     */
    updateAll() {
        this.updateVehicleSelect();
        this.updateQueue();
        this.updateLog();
    },

    destroy() {
        cleanupManager.cleanup('radio-panel');
        console.log('✅ RadioPanel cleaned up');
    }
}

export default RadioPanel;
