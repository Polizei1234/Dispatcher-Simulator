import cleanupManager from '../core/cleanup-manager.js';

// =========================
// RADIO SYSTEM v2.2.0 - EVENTBRIDGE INTEGRATION KOMPLETT!
// Funksystem mit FMS-Integration, Warteschlangen & GroqAI
// 🔧 v1.2.0: Kritische Fixes (GAME_DATA Safety, Memory Leak)
// 🔧 v1.1.0: FMS-Listener wartet auf VehicleMovement
// 🎯 v1.3.0: Ready-Event für zuverlässige Init
// 🔧 v1.4.0: Fallback-Config (funktioniert ohne JSON)
// 🔧 v1.5.0: Auto-Init entfernt (wird von main.js aufgerufen)
// 📡 v1.6.0: FUNKDISZIPLIN - Erkennt "Ende" & stoppt Auto-Antworten!
// 🤖 v2.0.0: AUTOMATISCHE FUNKSPRÜCHE bei Einsatzevents!
// ⏱️ v2.1.0: THROTTLING-SYSTEM gegen Funkspruch-Spam!
// 🌉 v2.2.0: EVENTBRIDGE-LISTENER - Bidirektionale Kommunikation!
// =========================

const RadioSystem = {
    config: null,
    log: [],
    queue: [],
    channels: {},
    fmsData: null,
    lastDispatchMessages: {},
    fmsListenerInstalled: false,
    eventBridgeListenersInstalled: false,
    logCleanupInterval: null,
    automaticMessagesConfig: null,
    
    // ⏱️ v2.1.0: Throttling-Variablen
    lastAutomaticMessage: 0,
    automaticMessagesQueue: [],
    
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
     * 🤖 v2.0.0: Fallback-Config für automatische Funksprüche
     */
    getFallbackAutomaticConfig() {
        return {
            "enabled": true,
            "triggers": {
                "dispatch": {
                    "enabled": true,
                    "delay_ms": 2000,
                    "vehicle_types": ["RTW", "NEF", "KTW"]
                },
                "arrival": {
                    "enabled": true,
                    "delay_ms": 3000,
                    "vehicle_types": ["RTW", "NEF", "KTW"]
                },
                "on_scene_delay": {
                    "enabled": true,
                    "delay_ms": 180000,
                    "only_critical": true,
                    "vehicle_types": ["RTW", "NEF"]
                },
                "patient_loaded": {
                    "enabled": true,
                    "delay_ms": 2000,
                    "vehicle_types": ["RTW", "KTW"]
                },
                "hospital_arrival": {
                    "enabled": true,
                    "delay_ms": 2000,
                    "vehicle_types": ["RTW", "KTW"]
                },
                "back_available": {
                    "enabled": true,
                    "delay_ms": 1000,
                    "vehicle_types": ["RTW", "NEF", "KTW"]
                },
                "request_nef": {
                    "enabled": true,
                    "delay_ms": 1000,
                    "vehicle_types": ["RTW", "KTW"]
                },
                "patient_complications": {
                    "enabled": true,
                    "delay_ms": 1500,
                    "vehicle_types": ["RTW", "NEF", "KTW"]
                },
                "critical_patient": {
                    "enabled": true,
                    "delay_ms": 1000,
                    "vehicle_types": ["RTW", "NEF"]
                },
                "transport_delay": {
                    "enabled": true,
                    "delay_ms": 2000,
                    "vehicle_types": ["RTW", "KTW"]
                }
            },
            "throttle": {
                "enabled": true,
                "min_delay_between_messages": 2000,
                "max_concurrent_messages": 3
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
        try {
            console.log('🎙️ RadioSystem wird initialisiert...');
            
            // Config laden
            await this.loadConfig();
            console.log('✅ RadioSystem Config geladen');
            
            // 🎯 NEU: EventBridge-Listener registrieren
            this.setupEventBridgeListeners();
            
            // Initialisiere Kanäle
            this.initializeChannels();

            // Event-Listener für FMS-Statusänderungen (warte auf VehicleMovement)
            this.setupFMSListener();

            // 🔧 v1.2.0: Auto-Cleanup für Memory Leak Prevention
            this.startLogCleanup();
            
            this.initialized = true;
            console.log('✅ RadioSystem erfolgreich initialisiert');
        } catch (error) {
            console.error('❌ RadioSystem Initialisierung fehlgeschlagen:', error);
            throw error;
        }
    },
    
    /**
     * 🎯 v2.2.0: Registriert EventBridge-Listener für automatische Funksprüche
     * 
     * Diese Methode verbindet das RadioSystem mit dem EventBridge.
     * Wenn Events gefeuert werden (z.B. von EscalationSystem), 
     * reagiert RadioSystem automatisch mit passenden Funksprüchen.
     */
    setupEventBridgeListeners() {
        // Safety-Check: EventBridge verfügbar?
        if (!window.eventBridge) {
            console.warn('⚠️ RadioSystem: EventBridge nicht verfügbar - Listener nicht registriert');
            return;
        }
        
        console.log('🌉 RadioSystem: Registriere EventBridge-Listener...');
        
        // === 1. DISPATCH EVENTS ===
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'dispatch:vehicle_dispatched', (data) => {
            console.log('📡 RadioSystem: vehicle_dispatched Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'dispatch', {
                incident: data.incident,
                urgency: data.urgency
            });
        });
        
        // === 2. ARRIVAL EVENTS ===
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'dispatch:vehicle_arrived', (data) => {
            console.log('📡 RadioSystem: vehicle_arrived Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'arrival', {
                incident: data.incident
            });
        });
        
        // === 3. ESKALATIONS-EVENTS ===
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'escalation:started', (data) => {
            console.log('📡 RadioSystem: escalation_started Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'escalation_started', {
                incident: data.incident,
                oldSeverity: data.oldSeverity,
                newSeverity: data.newSeverity,
                reason: data.reason
            });
        });
        
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'escalation:nef_required', (data) => {
            console.log('📡 RadioSystem: nef_required Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'request_nef', {
                incident: data.incident,
                urgency: data.urgency,
                needs_nef: true
            });
        });
        
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'escalation:status_worsened', (data) => {
            console.log('📡 RadioSystem: status_worsened Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'critical_patient', {
                incident: data.incident,
                oldStatus: data.oldStatus,
                newStatus: data.newStatus
            });
        });
        
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'escalation:critical', (data) => {
            console.log('📡 RadioSystem: escalation_critical Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'critical_patient', {
                incident: data.incident,
                severity: data.newSeverity
            });
        });
        
        // === 4. KOMPLIKATIONS-EVENTS ===
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'incident:complication', (data) => {
            console.log('📡 RadioSystem: complication Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'patient_complications', {
                incident: data.incident,
                complication: data.complication
            });
        });
        
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'medical:patient_critical', (data) => {
            console.log('📡 RadioSystem: patient_critical Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'critical_patient', {
                incident: data.incident,
                symptoms: data.symptoms
            });
        });
        
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'medical:resuscitation', (data) => {
            console.log('📡 RadioSystem: resuscitation Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'critical_patient', {
                incident: data.incident,
                resuscitation: true
            });
        });
        
        // === 5. TRANSPORT-EVENTS ===
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'transport:patient_loaded', (data) => {
            console.log('📡 RadioSystem: patient_loaded Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'patient_loaded', {
                incident: data.incident
            });
        });
        
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'transport:hospital_arrival', (data) => {
            console.log('📡 RadioSystem: hospital_arrival Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'hospital_arrival', {
                incident: data.incident,
                hospital: data.hospital
            });
        });
        
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'transport:delayed', (data) => {
            console.log('📡 RadioSystem: transport_delayed Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'transport_delay', {
                incident: data.incident,
                reason: data.reason
            });
        });
        
        // === 6. VEHICLE-EVENTS ===
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'vehicle:back_available', (data) => {
            console.log('📡 RadioSystem: back_available Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'back_available', {
                previousIncident: data.previousIncident
            });
        });
        
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'vehicle:break_start', (data) => {
            console.log('📡 RadioSystem: break_start Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'break_start', {
                duration: data.duration
            });
        });
        
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'vehicle:shift_end', (data) => {
            console.log('📡 RadioSystem: shift_end Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'shift_end', {});
        });
        
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'vehicle:maintenance_needed', (data) => {
            console.log('📡 RadioSystem: maintenance_needed Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'maintenance_needed', {
                reason: data.reason
            });
        });
        
        // === 7. DELAY-EVENTS ===
        cleanupManager.addEventListener('radio-system', window.eventBridge, 'incident:on_scene_delay', (data) => {
            console.log('📡 RadioSystem: on_scene_delay Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'on_scene_delay', {
                incident: data.incident,
                duration: data.duration
            });
        });
        
        console.log('✅ RadioSystem: EventBridge-Listener registriert (15 Event-Typen)');
    },

    /**
     * 🎯 v1.3.0: Feuere Ready-Event für RadioUI
     */
    fireReadyEvent() {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('radioSystemReady', {
                detail: {
                    version: '2.2.0',
                    channels: Object.keys(this.channels).length,
                    timestamp: Date.now(),
                    automaticMessages: this.automaticMessagesConfig?.enabled || false,
                    throttling: this.automaticMessagesConfig?.throttle?.enabled || false,
                    eventBridge: this.eventBridgeListenersInstalled
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
        
        this.logCleanupInterval = cleanupManager.setInterval('radio-system',() => {
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
            const checkInterval = cleanupManager.setInterval('radio-system',() => {
                if (typeof VehicleMovement !== 'undefined' && VehicleMovement.setVehicleStatus) {
                    clearInterval(checkInterval);
                    this.installFMSListener();
                }
            }, 100);
            
            // Timeout nach 10 Sekunden
            cleanupManager.setTimeout('radio-system',() => {
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
     * 🤖 v2.0.0 / ⏱️ v2.1.0: HAUPTFUNKTION - Sendet automatische Funksprüche bei Einsatzevents
     * 
     * @param {Object} vehicle - Das Fahrzeug-Objekt
     * @param {String} trigger - Event-Typ: 'dispatch', 'arrival', 'on_scene_delay', 'patient_loaded', 'hospital_arrival', 'back_available'
     * @param {Object} options - Zusätzliche Optionen (incident, urgency, etc.)
     */
    async sendAutomaticMessage(vehicle, trigger, options = {}) {
        console.group(`🤖 AUTOMATISCHER FUNKSPRUCH`);
        console.log(`📋 Fahrzeug: ${vehicle.callsign}`);
        console.log(`🎯 Trigger: ${trigger}`);
        console.log(`⚙️ Options:`, options);
        
        // Prüfe ob automatische Funksprüche aktiviert sind
        if (!this.automaticMessagesConfig?.enabled) {
            console.log('⚠️ Automatische Funksprüche deaktiviert');
            console.groupEnd();
            return;
        }
        
        // Prüfe ob dieser Trigger aktiviert ist
        const triggerConfig = this.automaticMessagesConfig.triggers[trigger];
        if (!triggerConfig || !triggerConfig.enabled) {
            console.log(`⚠️ Trigger "${trigger}" deaktiviert`);
            console.groupEnd();
            return;
        }
        
        // Prüfe ob Fahrzeugtyp erlaubt ist
        if (triggerConfig.vehicle_types && !triggerConfig.vehicle_types.includes(vehicle.type)) {
            console.log(`⚠️ Fahrzeugtyp ${vehicle.type} nicht für Trigger "${trigger}" konfiguriert`);
            console.groupEnd();
            return;
        }
        
        // ⏱️ v2.1.0: THROTTLING-SYSTEM
        if (this.automaticMessagesConfig.throttle?.enabled) {
            const now = Date.now();
            const lastMessage = this.lastAutomaticMessage || 0;
            const minDelay = this.automaticMessagesConfig.throttle.min_delay_between_messages || 2000;
            
            // Prüfe Min-Delay zwischen Funksprüchen
            if (now - lastMessage < minDelay) {
                const waitTime = minDelay - (now - lastMessage);
                console.log(`⏱️ Throttling: Warte ${waitTime}ms (Min-Delay)`);
                await new Promise(resolve => cleanupManager.setTimeout('radio-system', resolve, waitTime));
            }
            
            // Prüfe max concurrent messages in Queue
            const maxConcurrent = this.automaticMessagesConfig.throttle.max_concurrent_messages || 3;
            if (this.automaticMessagesQueue.length >= maxConcurrent) {
                console.log(`⏸️ Throttling: Queue voll (${this.automaticMessagesQueue.length}/${maxConcurrent})`);
                console.log(`   Warte auf freien Slot...`);
                
                // Warte bis Queue-Slot frei wird
                while (this.automaticMessagesQueue.length >= maxConcurrent) {
                    await new Promise(resolve => cleanupManager.setTimeout('radio-system', resolve, 500));
                }
                console.log(`✅ Throttling: Queue-Slot frei`);
            }
            
            // Füge zur Queue hinzu
            const queueEntry = {
                vehicle: vehicle.callsign,
                trigger: trigger,
                timestamp: Date.now()
            };
            this.automaticMessagesQueue.push(queueEntry);
            console.log(`📥 Throttling: In Queue (${this.automaticMessagesQueue.length}/${maxConcurrent})`);
            
            // Update Last-Message-Timestamp
            this.lastAutomaticMessage = Date.now();
        }
        
        // Verzögerung anwenden (Trigger-spezifisch)
        const delay = triggerConfig.delay_ms || 0;
        if (delay > 0) {
            console.log(`⏱️ Trigger-Verzögerung: ${delay}ms`);
            await new Promise(resolve => cleanupManager.setTimeout('radio-system', resolve, delay));
        }
        
        // Hole Einsatz-Kontext
        const context = this.buildContext(vehicle, trigger);
        context.incident = options.incident || context.incident;
        context.urgency = options.urgency || 'normal';
        context.needs_nef = options.needs_nef || false;
        
        // Generiere Funkspruch
        let message = '';
        
        // Prüfe ob RadioGroq verfügbar ist
        if (typeof RadioGroq !== 'undefined' && RadioGroq.generateAutomaticMessage) {
            try {
                console.log('🤖 Generiere KI-Funkspruch...');
                message = await RadioGroq.generateAutomaticMessage(vehicle, trigger, context);
                console.log(`✅ KI-Funkspruch: "${message}"`);
            } catch (error) {
                console.error('❌ Fehler bei KI-Generierung:', error);
                message = this.generateFallbackAutoMessage(vehicle, trigger, context);
                console.log(`🔄 Fallback-Funkspruch: "${message}"`);
            }
        } else {
            console.log('⚠️ RadioGroq nicht verfügbar - nutze Fallback');
            message = this.generateFallbackAutoMessage(vehicle, trigger, context);
            console.log(`🔄 Fallback-Funkspruch: "${message}"`);
        }
        
        // Füge zum Log hinzu
        this.addLogEntry({
            type: 'vehicle_to_dispatch',
            vehicle: vehicle,
            message: message,
            direction: 'vehicle_to_dispatch',
            ai_generated: typeof RadioGroq !== 'undefined',
            automatic: true,
            trigger: trigger
        });
        
        // ⏱️ v2.1.0: Entferne aus Throttling-Queue
        if (this.automaticMessagesConfig?.throttle?.enabled) {
            const index = this.automaticMessagesQueue.findIndex(e => 
                e.vehicle === vehicle.callsign && e.trigger === trigger
            );
            if (index !== -1) {
                this.automaticMessagesQueue.splice(index, 1);
                console.log(`📤 Throttling: Aus Queue entfernt (${this.automaticMessagesQueue.length} verbleibend)`);
            }
        }
        
        console.log('✅ Automatischer Funkspruch gesendet');
        console.groupEnd();
    },
    
    /**
     * 🤖 v2.0.0: Generiert Fallback-Funksprüche ohne KI
     */
    generateFallbackAutoMessage(vehicle, trigger, context) {
        const incident = context.incident;
        const stichwort = incident ? incident.stichwort : 'Einsatz';
        const ort = incident ? incident.ort : 'Einsatzort';
        
        const templates = {
            'dispatch': [
                `${vehicle.callsign} an Leitstelle, Einsatz ${stichwort} übernommen, rücken aus, kommen`,
                `${vehicle.callsign}, Einsatzauftrag erhalten, ausgerückt zu ${stichwort}, kommen`,
                `${vehicle.callsign} an Funkzentrale, sind ausgerückt, kommen`
            ],
            'arrival': [
                `${vehicle.callsign} an Leitstelle, am Einsatzort eingetroffen, beginnen mit der Versorgung, kommen`,
                `${vehicle.callsign}, sind vor Ort in ${ort}, Patient wird versorgt, kommen`,
                `${vehicle.callsign}, Ankunft Einsatzstelle, nehmen Versorgung auf, kommen`
            ],
            'on_scene_delay': [
                `${vehicle.callsign} an Leitstelle, Lagemeldung: Patient wird versorgt, Vitalparameter stabil, kommen`,
                `${vehicle.callsign}, Patient versorgt, Transportvorbereitung läuft, kommen`,
                `${vehicle.callsign} an Leitstelle, Versorgung läuft, noch vor Ort, kommen`
            ],
            'patient_loaded': [
                `${vehicle.callsign} an Leitstelle, Patient aufgenommen, beginnen Transport ins Klinikum, kommen`,
                `${vehicle.callsign}, Patient verladen, Transport zum Krankenhaus, kommen`,
                `${vehicle.callsign} an Leitstelle, sind transportbereit, Fahrt ins Krankenhaus, kommen`
            ],
            'hospital_arrival': [
                `${vehicle.callsign} an Leitstelle, am Krankenhaus eingetroffen, Patient wird übergeben, kommen`,
                `${vehicle.callsign}, Ankunft Klinikum, Patientenübergabe erfolgt gleich, kommen`,
                `${vehicle.callsign} an Leitstelle, am Zielkrankenhaus, übergeben Patient, Ende`
            ],
            'back_available': [
                `${vehicle.callsign} an Leitstelle, zurück auf Wache, wieder einsatzbereit, kommen`,
                `${vehicle.callsign}, sind auf Wache eingetroffen, Status 2, einsatzbereit, kommen`,
                `${vehicle.callsign} an Funkzentrale, Wache erreicht, sind wieder verfügbar, Ende`
            ],
            'request_nef': [
                `${vehicle.callsign} an Leitstelle, fordern dringend NEF nach, Patient kritisch, kommen`,
                `${vehicle.callsign}, benötigen NEF, Zustand hat sich verschlechtert, kommen`,
                `${vehicle.callsign} an Leitstelle, Anforderung NEF, Patient instabil, kommen`
            ],
            'patient_complications': [
                `${vehicle.callsign} an Leitstelle, Komplikationen bei Patient, Lagemeldung, kommen`,
                `${vehicle.callsign}, Patient hat Komplikationen, Versorgung läuft, kommen`,
                `${vehicle.callsign} an Leitstelle, Patientenzustand verschlechtert, kommen`
            ],
            'critical_patient': [
                `${vehicle.callsign} an Leitstelle, Patient kritisch, Notarzt erforderlich, kommen`,
                `${vehicle.callsign}, kritischer Patient, Vitalfunktionen instabil, kommen`,
                `${vehicle.callsign} an Leitstelle, Patient in kritischem Zustand, kommen`
            ],
            'transport_delay': [
                `${vehicle.callsign} an Leitstelle, Transport verzögert sich, kommen`,
                `${vehicle.callsign}, Verzögerung beim Transport, informiere gleich, kommen`,
                `${vehicle.callsign} an Leitstelle, benötigen mehr Zeit, kommen`
            ]
        };
        
        const messagesForTrigger = templates[trigger] || [`${vehicle.callsign} an Leitstelle, kommen`];
        const randomIndex = Math.floor(Math.random() * messagesForTrigger.length);
        
        return messagesForTrigger[randomIndex];
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
            cleanupManager.setTimeout('radio-system',() => {
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
            direction: entry.direction,
            automatic: entry.automatic || false,
            trigger: entry.trigger || null
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
    },
    
    destroy() {
        cleanupManager.cleanup('radio-system');
        console.log('✅ RadioSystem cleaned up');
    }
};

// 🔧 v1.5.0: KEIN AUTO-INIT MEHR! Wird von main.js in initializeNewSystems() aufgerufen
// Das löst das Problem, dass DOMContentLoaded zu früh feuert!

console.log('✅ radio-system.js v2.2.0 geladen');
console.log('🔧 Fallback-Config aktiviert - funktioniert ohne JSON-Dateien');
console.log('🎯 Ready-Event für zuverlässige RadioUI-Init');
console.log('🔧 v1.5.0: Wird von main.js initialisiert (kein Auto-Init)');
console.log('📡 v1.6.0: FUNKDISZIPLIN - Erkennt "Ende" & stoppt Auto-Antworten!');
console.log('🤖 v2.0.0: AUTOMATISCHE FUNKSPRÜCHE bei Einsatzevents!');
console.log('⏱️ v2.1.0: THROTTLING-SYSTEM gegen Funkspruch-Spam!');
console.log('🌉 v2.2.0: EVENTBRIDGE-LISTENER - Bidirektionale Kommunikation KOMPLETT!');
