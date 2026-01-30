// =========================
// RADIO SYSTEM v1.6.0
// Funksystem mit FMS-Integration, Warteschlangen & GroqAI
// 🔧 v1.2.0: Kritische Fixes (GAME_DATA Safety, Memory Leak)
// 🔧 v1.1.0: FMS-Listener wartet auf VehicleMovement
// 🎯 v1.3.0: Ready-Event für zuverlässige Init
// 🔧 v1.4.0: Fallback-Config (funktioniert ohne JSON)
// 🔧 v1.5.0: Auto-Init entfernt (wird von main.js aufgerufen)
// 📡 v1.6.0: FUNKDISZIPLIN - Erkennt "Ende" & stoppt Auto-Antworten!
// =========================

const RadioSystem = {
    config: null,
    log: [],
    queue: [],
    channels: {},
    fmsData: null,
    lastDispatchMessages: {},
    fmsListenerInstalled: false,
    logCleanupInterval: null,
    
    /**
     * 🔧 v1.4.0: Fallback-Konfiguration (falls JSON nicht lädt)
     */
    getFallbackConfig() {
        return {
            "channels": {
                "rettungsdienst": {
                    "name": "Rettungsdienst",
                    "icon": "🚑",
                    "vehicle_types": ["RTW", "KTW", "NEF"],
                    "description": "Einsatzkanal für Rettungswagen"
                },
                "polizei": {
                    "name": "Polizei",
                    "icon": "🚓",
                    "vehicle_types": ["FuStW", "MTF"],
                    "description": "Einsatzkanal für Polizeifahrzeuge"
                },
                "feuerwehr": {
                    "name": "Feuerwehr",
                    "icon": "🚒",
                    "vehicle_types": ["LF", "DLK", "TLF"],
                    "description": "Einsatzkanal für Feuerwehrfahrzeuge"
                },
                "gemeinsam": {
                    "name": "Gemeinsam",
                    "icon": "🌐",
                    "vehicle_types": [],
                    "description": "Kanal für alle Organisationen"
                }
            },
            "priority_levels": {
                "high": {
                    "name": "Hoch",
                    "icon": "⚠️",
                    "weight": 100,
                    "color": "#ff4444"
                },
                "normal": {
                    "name": "Normal",
                    "icon": "➡️",
                    "weight": 50,
                    "color": "#4444ff"
                },
                "low": {
                    "name": "Niedrig",
                    "icon": "ℹ️",
                    "weight": 10,
                    "color": "#888888"
                }
            },
            "fms_triggers": {
                "1": {
                    "action": "none",
                    "priority": "low",
                    "reason": "sprechwunsch"
                },
                "3": {
                    "action": "add_to_queue",
                    "priority": "high",
                    "reason": "sprechwunsch_priorisiert"
                },
                "4": {
                    "action": "optional_message",
                    "manual_trigger": "lagemeldung",
                    "priority": "normal",
                    "reason": "lagemeldung"
                },
                "7": {
                    "action": "none",
                    "priority": "normal"
                },
                "8": {
                    "action": "optional_message",
                    "manual_trigger": "transportziel_anfrage",
                    "priority": "normal",
                    "reason": "transportziel_anfrage"
                }
            },
            "ui_settings": {
                "max_log_entries": 100,
                "auto_scroll": true,
                "show_timestamps": true
            }
        };
    },
    
    /**
     * 🔧 v1.4.0: Fallback FMS-Daten
     */
    getFallbackFMS() {
        return {
            "vehicle_to_dispatch": {
                "codes": {
                    "1": { "name": "Einsatzbereit auf Funkwache", "icon": "🏠" },
                    "2": { "name": "Einsatzbereit auf Wache", "icon": "🏥" },
                    "3": { "name": "Einsatzfahrt", "icon": "🚑" },
                    "4": { "name": "Ankunft am Einsatzort", "icon": "🎯" },
                    "5": { "name": "Sprechwunsch", "icon": "📢" },
                    "6": { "name": "Nicht einsatzbereit", "icon": "⛔" },
                    "7": { "name": "Patient aufgenommen", "icon": "🤕" },
                    "8": { "name": "Transportfahrt", "icon": "🚑" },
                    "9": { "name": "Ankunft am Zielort", "icon": "🏥" }
                }
            },
            "dispatch_to_vehicle": {
                "codes": {
                    "A": { "name": "Sammelruf", "icon": "📢" },
                    "J": { "name": "Sprechaufforderung", "icon": "🗣️" }
                }
            }
        };
    },
    
    /**
     * 📡 v1.6.0: Prüft ob Nachricht mit "Ende" abschließt
     */
    endsWithEnde(message) {
        if (!message || typeof message !== 'string') {
            return false;
        }
        
        const normalized = message.trim().toLowerCase();
        
        // Verschiedene Ende-Varianten
        return normalized.endsWith('ende') || 
               normalized.endsWith('ende.') ||
               normalized.endsWith('aus');
    },
    
    /**
     * Initialisierung
     */
    async initialize() {
        console.log('📡 Radio System v1.6.0 initialisiert');
        
        // 🔧 v1.4.0: Lade Config mit Fallback
        try {
            const response = await fetch('js/data/radio-config.json');
            if (response.ok) {
                this.config = await response.json();
                console.log('✅ Radio-Config geladen');
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.warn('⚠️ Fehler beim Laden der Radio-Config:', error.message);
            console.log('🔄 Nutze Fallback-Config');
            this.config = this.getFallbackConfig();
        }

        // 🔧 v1.4.0: Lade FMS mit Fallback
        try {
            const response = await fetch('js/data/fms-codes.json');
            if (response.ok) {
                this.fmsData = await response.json();
                console.log('✅ FMS-Daten geladen');
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.warn('⚠️ Fehler beim Laden der FMS-Daten:', error.message);
            console.log('🔄 Nutze Fallback-FMS-Daten');
            this.fmsData = this.getFallbackFMS();
        }

        // Initialisiere Kanäle
        this.initializeChannels();

        // Event-Listener für FMS-Statusänderungen (warte auf VehicleMovement)
        this.setupFMSListener();

        // 🔧 v1.2.0: Auto-Cleanup für Memory Leak Prevention
        this.startLogCleanup();

        console.log('✅ Radio System bereit');
        console.log(`📻 Kanäle: ${Object.keys(this.channels).length}`);
        console.log('📡 v1.6.0: Funkdisziplin "Ende"-Erkennung aktiviert');
        
        // 🎯 v1.3.0: Feuere Ready-Event
        this.fireReadyEvent();
    },

    /**
     * 🎯 v1.3.0: Feuert Ready-Event für RadioUI
     */
    fireReadyEvent() {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('radioSystemReady', {
                detail: {
                    version: '1.6.0',
                    channels: Object.keys(this.channels).length,
                    timestamp: Date.now()
                }
            }));
            console.log('📡 radioSystemReady Event gefeuert');
        }
    },

    /**
     * 🔧 v1.2.0: Startet periodisches Log-Cleanup
     */
    startLogCleanup() {
        if (this.logCleanupInterval) {
            clearInterval(this.logCleanupInterval);
        }
        
        this.logCleanupInterval = setInterval(() => {
            const maxEntries = this.config?.ui_settings?.max_log_entries || 100;
            if (this.log.length > maxEntries) {
                const removed = this.log.length - maxEntries;
                this.log = this.log.slice(0, maxEntries);
                console.log(`🗑️ Auto-Cleanup: ${removed} alte Log-Einträge entfernt`);
            }
        }, 60000); // Alle 60 Sekunden
        
        console.log('✅ Log Auto-Cleanup aktiviert (60s Intervall)');
    },

    /**
     * Initialisiert die Funkkanäle
     */
    initializeChannels() {
        for (const [key, channel] of Object.entries(this.config.channels)) {
            this.channels[key] = {
                ...channel,
                active: true,
                messageCount: 0
            };
        }
    },

    /**
     * Setup FMS Status Change Listener
     * 🔧 Wartet auf VehicleMovement-Verfügbarkeit
     */
    setupFMSListener() {
        // Prüfe ob VehicleMovement bereits geladen ist
        if (typeof VehicleMovement !== 'undefined' && VehicleMovement.setVehicleStatus) {
            this.installFMSListener();
        } else {
            // Warte auf VehicleMovement
            console.log('⏳ Warte auf VehicleMovement...');
            const checkInterval = setInterval(() => {
                if (typeof VehicleMovement !== 'undefined' && VehicleMovement.setVehicleStatus) {
                    clearInterval(checkInterval);
                    this.installFMSListener();
                }
            }, 100);
            
            // Timeout nach 10 Sekunden
            setTimeout(() => {
                clearInterval(checkInterval);
                if (!this.fmsListenerInstalled) {
                    console.error('❌ VehicleMovement nicht gefunden - FMS-Integration fehlgeschlagen!');
                }
            }, 10000);
        }
    },

    /**
     * Installiert den FMS-Listener
     */
    installFMSListener() {
        if (this.fmsListenerInstalled) {
            console.warn('⚠️ FMS-Listener bereits installiert');
            return;
        }

        const originalSetStatus = VehicleMovement.setVehicleStatus;
        
        VehicleMovement.setVehicleStatus = (vehicle, fmsCode) => {
            const oldStatus = vehicle.currentStatus;
            
            // Rufe original Funktion auf
            originalSetStatus.call(VehicleMovement, vehicle, fmsCode);
            
            // Triggere Radio-Events
            RadioSystem.handleFMSStatusChange(vehicle, fmsCode, oldStatus);
        };
        
        this.fmsListenerInstalled = true;
        console.log('✅ FMS-Listener erfolgreich installiert');
    },

    /**
     * Behandelt FMS-Statusänderungen
     */
    handleFMSStatusChange(vehicle, newStatus, oldStatus) {
        console.log(`📻 FMS-Change: ${vehicle.callsign} ${oldStatus} → ${newStatus}`);

        // Zeige Statusänderung in UI
        this.showStatusChange(vehicle, oldStatus, newStatus);

        // Prüfe ob dieser Status einen Funk-Trigger hat
        const trigger = this.config.fms_triggers[newStatus.toString()];
        
        if (!trigger) {
            return;
        }

        // Führe entsprechende Aktion aus
        switch (trigger.action) {
            case 'add_to_queue':
                this.addToQueue(vehicle, trigger.priority, trigger.reason);
                break;
                
            case 'optional_message':
                // Nur manuell triggerbar, zeige Button in UI
                if (trigger.manual_trigger && typeof RadioUI !== 'undefined') {
                    RadioUI.showManualTriggerButton(vehicle, trigger.manual_trigger);
                }
                break;
                
            case 'none':
                // Nur Status-Anzeige, keine weitere Aktion
                break;
        }
    },

    /**
     * Zeigt Statusänderung in UI
     */
    showStatusChange(vehicle, oldStatus, newStatus) {
        const fmsInfo = this.fmsData?.vehicle_to_dispatch?.codes[newStatus];
        const icon = fmsInfo?.icon || '📡';
        const name = fmsInfo?.name || `Status ${newStatus}`;
        
        const message = `${icon} ${vehicle.callsign}: ${oldStatus} → ${newStatus} (${name})`;
        
        // Füge zum Log hinzu
        this.addLogEntry({
            type: 'status_change',
            vehicle: vehicle,
            oldStatus: oldStatus,
            newStatus: newStatus,
            message: message,
            icon: icon
        });

        // Zeige Notification (nur bei wichtigen Status)
        if ([3, 4, 7, 8].includes(newStatus) && typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.show(message, 'info');
        }
    },

    /**
     * Fügt Fahrzeug zur Warteschlange hinzu
     */
    addToQueue(vehicle, priority, reason) {
        // Prüfe ob bereits in Queue
        const existing = this.queue.find(q => q.vehicle.id === vehicle.id);
        if (existing) {
            console.log(`⚠️ ${vehicle.callsign} bereits in Warteschlange`);
            return;
        }

        const queueEntry = {
            vehicle: vehicle,
            priority: priority,
            reason: reason,
            timestamp: Date.now(),
            context: this.buildContext(vehicle, reason)
        };

        this.queue.push(queueEntry);
        
        // Sortiere Queue nach Priorität
        this.sortQueue();

        console.log(`📥 ${vehicle.callsign} zur Warteschlange hinzugefügt (${priority})`);

        // Update UI
        if (typeof RadioUI !== 'undefined') {
            RadioUI.updateQueue();
        }

        // Zeige Notification
        const priorityInfo = this.config.priority_levels[priority];
        const message = `${priorityInfo.icon} ${vehicle.callsign} möchte sprechen`;
        
        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.show(message, priority === 'high' ? 'warning' : 'info');
        }

        // Füge zum Log
        this.addLogEntry({
            type: 'queue_add',
            vehicle: vehicle,
            priority: priority,
            reason: reason,
            message: message
        });
    },

    /**
     * Sortiert Warteschlange nach Priorität
     */
    sortQueue() {
        this.queue.sort((a, b) => {
            const priorityA = this.config.priority_levels[a.priority]?.weight || 50;
            const priorityB = this.config.priority_levels[b.priority]?.weight || 50;
            
            if (priorityA !== priorityB) {
                return priorityB - priorityA; // Höhere Priorität zuerst
            }
            
            return a.timestamp - b.timestamp; // Ältere zuerst
        });
    },

    /**
     * Entfernt Fahrzeug aus Warteschlange
     */
    removeFromQueue(vehicleId) {
        const index = this.queue.findIndex(q => q.vehicle.id === vehicleId);
        if (index !== -1) {
            const removed = this.queue.splice(index, 1)[0];
            console.log(`📤 ${removed.vehicle.callsign} aus Warteschlange entfernt`);
            
            // Update UI
            if (typeof RadioUI !== 'undefined') {
                RadioUI.updateQueue();
            }
            
            return removed;
        }
        return null;
    },

    /**
     * Erteilt Sprecherlaubnis an Fahrzeug in Warteschlange
     */
    async grantSpeakPermission(vehicleId) {
        const queueEntry = this.removeFromQueue(vehicleId);
        if (!queueEntry) {
            console.error(`❌ Fahrzeug ${vehicleId} nicht in Warteschlange`);
            return;
        }

        const { vehicle, reason, context } = queueEntry;

        console.log(`🗣️ Sprecherlaubnis erteilt: ${vehicle.callsign}`);

        // Sende FMS J (Sprechaufforderung)
        this.sendFMSCode(vehicle, 'J');

        // Füge Leitstellen-Nachricht zum Log
        this.addLogEntry({
            type: 'dispatch_to_vehicle',
            vehicle: vehicle,
            message: `An ${vehicle.callsign}: Sie haben Sprecherlaubnis, kommen`,
            direction: 'dispatch_to_vehicle'
        });

        // Generiere Fahrzeug-Antwort mit GroqAI
        await this.generateAndSendVehicleResponse(vehicle, reason, context);
    },

    /**
     * Generiert und sendet Fahrzeug-Antwort
     */
    async generateAndSendVehicleResponse(vehicle, reason, context) {
        console.log(`🤖 Generiere Fahrzeug-Antwort für ${vehicle.callsign}...`);

        try {
            // Prüfe ob RadioGroq verfügbar ist
            if (typeof RadioGroq === 'undefined') {
                console.warn('⚠️ RadioGroq nicht verfügbar - nutze Fallback');
                const fallbackResponse = this.generateFallbackResponse(vehicle, reason);
                
                this.addLogEntry({
                    type: 'vehicle_to_dispatch',
                    vehicle: vehicle,
                    message: fallbackResponse,
                    direction: 'vehicle_to_dispatch',
                    ai_generated: false
                });
                
                return;
            }

            const response = await RadioGroq.generateVehicleResponse(vehicle, {
                reason: reason,
                incident: context.incident,
                lastDispatchMessage: this.lastDispatchMessages[vehicle.id],
                fmsCode: vehicle.currentStatus
            });

            // Füge Fahrzeug-Antwort zum Log
            this.addLogEntry({
                type: 'vehicle_to_dispatch',
                vehicle: vehicle,
                message: response,
                direction: 'vehicle_to_dispatch',
                ai_generated: true
            });

            console.log(`✅ Fahrzeug-Antwort: "${response}"`);

        } catch (error) {
            console.error('❌ Fehler bei Fahrzeug-Antwort:', error);
            
            // Fallback-Antwort
            const fallbackResponse = this.generateFallbackResponse(vehicle, reason);
            this.addLogEntry({
                type: 'vehicle_to_dispatch',
                vehicle: vehicle,
                message: fallbackResponse,
                direction: 'vehicle_to_dispatch',
                ai_generated: false
            });
        }
    },

    /**
     * Generiert Fallback-Antwort ohne KI
     */
    generateFallbackResponse(vehicle, reason) {
        const responses = {
            'sprechwunsch': `${vehicle.callsign} von Leitstelle, verstanden, Ende`,
            'sprechwunsch_priorisiert': `${vehicle.callsign}, Anfrage, kommen`,
            'lagemeldung': `${vehicle.callsign}, Lage unverändert, Patient wird versorgt, Ende`,
            'transportziel_anfrage': `${vehicle.callsign}, bitte Transportziel durchgeben`,
            'response_to_dispatch': `${vehicle.callsign} von Leitstelle, verstanden und übernommen, Ende`
        };
        
        return responses[reason] || `${vehicle.callsign} von Leitstelle, verstanden, Ende`;
    },

    /**
     * 📡 v1.6.0: Sendet Funkspruch von Leitstelle an Fahrzeug (mit "Ende"-Erkennung)
     */
    async sendDispatchMessage(vehicleId, message) {
        // 🔧 GAME_DATA Safety Check
        if (typeof GAME_DATA === 'undefined' || !GAME_DATA.vehicles) {
            console.error('❌ GAME_DATA nicht verfügbar');
            return;
        }

        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            console.error(`❌ Fahrzeug ${vehicleId} nicht gefunden`);
            return;
        }

        console.log(`📻 Leitstelle → ${vehicle.callsign}: "${message}"`);

        // Speichere letzte Nachricht
        this.lastDispatchMessages[vehicleId] = message;

        // Füge zum Log
        this.addLogEntry({
            type: 'dispatch_to_vehicle',
            vehicle: vehicle,
            message: `An ${vehicle.callsign}: ${message}`,
            direction: 'dispatch_to_vehicle'
        });

        // 📡 v1.6.0: Prüfe ob Nachricht mit "Ende" endet
        if (this.endsWithEnde(message)) {
            console.log('📡 Nachricht endet mit "Ende" - keine automatische Antwort');
            return; // STOPP! Keine weitere Kommunikation
        }

        // Generiere automatisch Fahrzeug-Antwort (nur wenn NICHT mit "Ende")
        const context = this.buildContext(vehicle, 'response_to_dispatch');
        await this.generateAndSendVehicleResponse(vehicle, 'response_to_dispatch', context);
    },

    /**
     * 🔧 v1.2.0: Triggert manuelle Fahrzeug-Meldung (mit GAME_DATA Safety)
     */
    async triggerManualVehicleMessage(vehicleId, triggerType) {
        // 🔧 GAME_DATA Safety Check
        if (typeof GAME_DATA === 'undefined' || !GAME_DATA.vehicles) {
            console.error('❌ GAME_DATA nicht verfügbar');
            return;
        }

        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            console.error(`❌ Fahrzeug ${vehicleId} nicht gefunden`);
            return;
        }

        console.log(`🔘 Manuelle Meldung angefordert: ${vehicle.callsign} - ${triggerType}`);

        const context = this.buildContext(vehicle, triggerType);
        await this.generateAndSendVehicleResponse(vehicle, triggerType, context);
    },

    /**
     * Sendet FMS-Code an Fahrzeug (simuliert)
     */
    sendFMSCode(vehicle, code) {
        console.log(`📡 Sende FMS ${code} an ${vehicle.callsign}`);
        
        const fmsInfo = this.fmsData?.dispatch_to_vehicle?.codes[code];
        if (fmsInfo) {
            const message = `FMS ${code}: ${fmsInfo.name}`;
            
            this.addLogEntry({
                type: 'fms_dispatch',
                vehicle: vehicle,
                fmsCode: code,
                message: message,
                direction: 'dispatch_to_vehicle'
            });
        }
    },

    /**
     * 🔧 v1.2.0: Sammelruf an alle Fahrzeuge eines Kanals (mit GAME_DATA Safety)
     */
    sendBroadcast(channel, message) {
        console.log(`📢 Sammelruf auf Kanal ${channel}: "${message}"`);

        // Sende FMS A (Sammelruf)
        this.addLogEntry({
            type: 'broadcast',
            channel: channel,
            message: `📢 SAMMELRUF an alle (${this.channels[channel].name}): ${message}`,
            direction: 'broadcast'
        });

        // 🔧 GAME_DATA Safety Check
        if (typeof GAME_DATA === 'undefined' || !GAME_DATA.vehicles) {
            console.warn('⚠️ GAME_DATA nicht verfügbar - Sammelruf nur protokolliert');
            return;
        }

        // Alle Fahrzeuge des Kanals müssen quittieren
        const channelVehicles = this.getVehiclesForChannel(channel);
        
        channelVehicles.forEach(vehicle => {
            // Füge Quittierungs-Aufforderung zum Log
            setTimeout(() => {
                this.addLogEntry({
                    type: 'vehicle_to_dispatch',
                    vehicle: vehicle,
                    message: `${vehicle.callsign} von Leitstelle, verstanden, Ende`,
                    direction: 'vehicle_to_dispatch',
                    ai_generated: false
                });
            }, Math.random() * 3000 + 1000); // Zufällige Verzögerung 1-4s
        });
    },

    /**
     * 🔧 v1.2.0: Gibt alle Fahrzeuge eines Kanals zurück (mit GAME_DATA Safety)
     */
    getVehiclesForChannel(channelKey) {
        const channel = this.channels[channelKey];
        if (!channel) return [];

        // 🔧 GAME_DATA Safety Check
        if (typeof GAME_DATA === 'undefined' || !GAME_DATA.vehicles) {
            console.warn('⚠️ GAME_DATA nicht verfügbar');
            return [];
        }

        return GAME_DATA.vehicles.filter(vehicle => {
            // Wenn Kanal vehicle_types definiert hat
            if (channel.vehicle_types && channel.vehicle_types.length > 0) {
                return channel.vehicle_types.includes(vehicle.type);
            }
            // Gemeinsamer Kanal: alle
            return true;
        });
    },

    /**
     * Ermittelt Kanal für Fahrzeug
     */
    getChannelForVehicle(vehicle) {
        for (const [key, channel] of Object.entries(this.channels)) {
            if (channel.vehicle_types && channel.vehicle_types.includes(vehicle.type)) {
                return key;
            }
        }
        return 'gemeinsam'; // Fallback
    },

    /**
     * 🔧 v1.2.0: Baut Kontext für Funkspruch-Generierung (mit GAME_DATA Safety)
     */
    buildContext(vehicle, reason) {
        let incident = null;
        
        // 🔧 GAME_DATA Safety Check
        if (typeof GAME_DATA === 'undefined' || !GAME_DATA.incidents) {
            console.warn('⚠️ GAME_DATA.incidents nicht verfügbar');
        } else if (vehicle.incident) {
            // Finde aktuellen Einsatz
            incident = GAME_DATA.incidents.find(i => 
                (i.assignedVehicles && i.assignedVehicles.includes(vehicle.id)) ||
                (i.vehicles && i.vehicles.includes(vehicle.id)) ||
                i.id === vehicle.incident
            );
        }

        return {
            incident: incident,
            position: vehicle.position,
            status: vehicle.currentStatus,
            reason: reason
        };
    },

    /**
     * Fügt Eintrag zum Funkprotokoll hinzu
     */
    addLogEntry(entry) {
        const logEntry = {
            id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            ...entry
        };

        this.log.unshift(logEntry); // Neueste zuerst

        // 🔧 v1.2.0: Sofortiges Cleanup wenn zu groß
        const maxEntries = this.config?.ui_settings?.max_log_entries || 100;
        if (this.log.length > maxEntries * 1.2) { // 20% Toleranz
            this.log = this.log.slice(0, maxEntries);
            console.log(`🗑️ Log-Cleanup: Auf ${maxEntries} Einträge reduziert`);
        }

        // Update UI (mit Debouncing in RadioUI)
        if (typeof RadioUI !== 'undefined' && RadioUI.scheduleLogUpdate) {
            RadioUI.scheduleLogUpdate();
        }
    },

    /**
     * Gibt Funkprotokoll zurück (optional gefiltert)
     * 🔧 v1.2.0: Optimierte Filterung ohne Array-Kopie
     */
    getLog(filter = {}) {
        return this.log.filter(entry => {
            // Channel-Filter
            if (filter.channel) {
                if (entry.vehicle) {
                    if (this.getChannelForVehicle(entry.vehicle) !== filter.channel) {
                        return false;
                    }
                } else if (entry.channel !== filter.channel) {
                    return false;
                }
            }

            // Vehicle-Filter
            if (filter.vehicleId && (!entry.vehicle || entry.vehicle.id !== filter.vehicleId)) {
                return false;
            }

            // Type-Filter
            if (filter.type && entry.type !== filter.type) {
                return false;
            }

            return true;
        });
    },

    /**
     * Löscht Funkprotokoll
     */
    clearLog() {
        this.log = [];
        console.log('🗑️ Funkprotokoll gelöscht');
        
        if (typeof RadioUI !== 'undefined' && RadioUI.updateLog) {
            RadioUI.updateLog();
        }
    },

    /**
     * Exportiert Funkprotokoll
     */
    exportLog() {
        const data = this.log.map(entry => ({
            timestamp: new Date(entry.timestamp).toISOString(),
            type: entry.type,
            vehicle: entry.vehicle?.callsign || 'Leitstelle',
            message: entry.message,
            direction: entry.direction
        }));

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `funkprotokoll_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        console.log('💾 Funkprotokoll exportiert');
    },

    /**
     * 🔧 v1.2.0: Cleanup-Funktion
     */
    cleanup() {
        if (this.logCleanupInterval) {
            clearInterval(this.logCleanupInterval);
            this.logCleanupInterval = null;
        }
        console.log('🗑️ Radio System cleanup ausgeführt');
    }
};

// 🔧 v1.5.0: KEIN AUTO-INIT MEHR! Wird von main.js in initializeNewSystems() aufgerufen
// Das löst das Problem, dass DOMContentLoaded zu früh feuert!

console.log('✅ radio-system.js v1.6.0 geladen');
console.log('🔧 Fallback-Config aktiviert - funktioniert ohne JSON-Dateien');
console.log('🎯 Ready-Event für zuverlässige RadioUI-Init');
console.log('🔧 v1.5.0: Wird von main.js initialisiert (kein Auto-Init)');
console.log('📡 v1.6.0: FUNKDISZIPLIN - Erkennt "Ende" & stoppt Auto-Antworten!');