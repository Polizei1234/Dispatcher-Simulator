
/**
 * RadioSystem v2.2.0
 * Verwaltet automatische Funksprüche mit KI-Integration
 * 
 * CHANGELOG v2.2.0:
 * - ✅ EventBridge-Listener implementiert (15 Event-Typen)
 * - ✅ Bidirektionale Kommunikation komplett
 * - ✅ Automatische Funksprüche bei allen Events
 * 
 * @class RadioSystem
 */
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
        window.eventBridge.on('dispatch:vehicle_dispatched', (data) => {
            console.log('📡 RadioSystem: vehicle_dispatched Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'dispatch', {
                incident: data.incident,
                urgency: data.urgency
            });
        });
        
        // === 2. ARRIVAL EVENTS ===
        window.eventBridge.on('dispatch:vehicle_arrived', (data) => {
            console.log('📡 RadioSystem: vehicle_arrived Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'arrival', {
                incident: data.incident
            });
        });
        
        // === 3. ESKALATIONS-EVENTS ===
        window.eventBridge.on('escalation:started', (data) => {
            console.log('📡 RadioSystem: escalation_started Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'escalation_started', {
                incident: data.incident,
                oldSeverity: data.oldSeverity,
                newSeverity: data.newSeverity,
                reason: data.reason
            });
        });
        
        window.eventBridge.on('escalation:nef_required', (data) => {
            console.log('📡 RadioSystem: nef_required Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'request_nef', {
                incident: data.incident,
                urgency: data.urgency,
                needs_nef: true
            });
        });
        
        window.eventBridge.on('escalation:status_worsened', (data) => {
            console.log('📡 RadioSystem: status_worsened Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'critical_patient', {
                incident: data.incident,
                oldStatus: data.oldStatus,
                newStatus: data.newStatus
            });
        });
        
        window.eventBridge.on('escalation:critical', (data) => {
            console.log('📡 RadioSystem: escalation_critical Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'critical_patient', {
                incident: data.incident,
                severity: data.newSeverity
            });
        });
        
        // === 4. KOMPLIKATIONS-EVENTS ===
        window.eventBridge.on('incident:complication', (data) => {
            console.log('📡 RadioSystem: complication Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'patient_complications', {
                incident: data.incident,
                complication: data.complication
            });
        });
        
        window.eventBridge.on('medical:patient_critical', (data) => {
            console.log('📡 RadioSystem: patient_critical Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'critical_patient', {
                incident: data.incident,
                symptoms: data.symptoms
            });
        });
        
        window.eventBridge.on('medical:resuscitation', (data) => {
            console.log('📡 RadioSystem: resuscitation Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'critical_patient', {
                incident: data.incident,
                resuscitation: true
            });
        });
        
        // === 5. TRANSPORT-EVENTS ===
        window.eventBridge.on('transport:patient_loaded', (data) => {
            console.log('📡 RadioSystem: patient_loaded Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'patient_loaded', {
                incident: data.incident
            });
        });
        
        window.eventBridge.on('transport:hospital_arrival', (data) => {
            console.log('📡 RadioSystem: hospital_arrival Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'hospital_arrival', {
                incident: data.incident,
                hospital: data.hospital
            });
        });
        
        window.eventBridge.on('transport:delayed', (data) => {
            console.log('📡 RadioSystem: transport_delayed Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'transport_delay', {
                incident: data.incident,
                reason: data.reason
            });
        });
        
        // === 6. VEHICLE-EVENTS ===
        window.eventBridge.on('vehicle:back_available', (data) => {
            console.log('📡 RadioSystem: back_available Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'back_available', {
                previousIncident: data.previousIncident
            });
        });
        
        window.eventBridge.on('vehicle:break_start', (data) => {
            console.log('📡 RadioSystem: break_start Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'break_start', {
                duration: data.duration
            });
        });
        
        window.eventBridge.on('vehicle:shift_end', (data) => {
            console.log('📡 RadioSystem: shift_end Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'shift_end', {});
        });
        
        window.eventBridge.on('vehicle:maintenance_needed', (data) => {
            console.log('📡 RadioSystem: maintenance_needed Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'maintenance_needed', {
                reason: data.reason
            });
        });
        
        // === 7. DELAY-EVENTS ===
        window.eventBridge.on('incident:on_scene_delay', (data) => {
            console.log('📡 RadioSystem: on_scene_delay Event empfangen', data);
            this.sendAutomaticMessage(data.vehicle, 'on_scene_delay', {
                incident: data.incident,
                duration: data.duration
            });
        });
        
        console.log('✅ RadioSystem: EventBridge-Listener registriert (15 Event-Typen)');
    },

    // ... (rest of the file remains the same)
};
