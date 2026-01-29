// =========================
// RADIO SYSTEM v1.0.0
// Funksystem mit FMS-Integration, Warteschlangen & GroqAI
// =========================

const RadioSystem = {
    config: null,
    log: [],
    queue: [],
    channels: {},
    fmsData: null,
    lastDispatchMessages: {},
    
    /**
     * Initialisierung
     */
    async initialize() {
        console.log('📡 Radio System v1.0.0 initialisiert');
        
        // Lade Konfiguration
        try {
            const response = await fetch('js/data/radio-config.json');
            this.config = await response.json();
            console.log('✅ Radio-Config geladen');
        } catch (error) {
            console.error('❌ Fehler beim Laden der Radio-Config:', error);
            return;
        }

        // Lade FMS-Daten
        try {
            const response = await fetch('js/data/fms-codes.json');
            this.fmsData = await response.json();
            console.log('✅ FMS-Daten geladen');
        } catch (error) {
            console.error('❌ Fehler beim Laden der FMS-Daten:', error);
        }

        // Initialisiere Kanäle
        this.initializeChannels();

        // Event-Listener für FMS-Statusänderungen
        this.setupFMSListener();

        console.log('✅ Radio System bereit');
        console.log(`📻 Kanäle: ${Object.keys(this.channels).length}`);
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
     */
    setupFMSListener() {
        // Hook in VehicleMovement.setVehicleStatus
        const originalSetStatus = VehicleMovement.setVehicleStatus;
        
        VehicleMovement.setVehicleStatus = (vehicle, fmsCode) => {
            const oldStatus = vehicle.currentStatus;
            
            // Rufe original Funktion auf
            originalSetStatus.call(VehicleMovement, vehicle, fmsCode);
            
            // Triggere Radio-Events
            this.handleFMSStatusChange(vehicle, fmsCode, oldStatus);
        };
        
        console.log('✅ FMS-Listener aktiviert');
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

        // Zeige Notification
        if (typeof window.notificationSystem !== 'undefined') {
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
        }
    },

    /**
     * Sendet Funkspruch von Leitstelle an Fahrzeug
     */
    async sendDispatchMessage(vehicleId, message) {
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

        // Generiere automatisch Fahrzeug-Antwort
        const context = this.buildContext(vehicle, 'response_to_dispatch');
        await this.generateAndSendVehicleResponse(vehicle, 'response_to_dispatch', context);
    },

    /**
     * Triggert manuelle Fahrzeug-Meldung (z.B. Lagemeldung)
     */
    async triggerManualVehicleMessage(vehicleId, triggerType) {
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
     * Sammelruf an alle Fahrzeuge eines Kanals
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
     * Gibt alle Fahrzeuge eines Kanals zurück
     */
    getVehiclesForChannel(channelKey) {
        const channel = this.channels[channelKey];
        if (!channel) return [];

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
     * Baut Kontext für Funkspruch-Generierung
     */
    buildContext(vehicle, reason) {
        let incident = null;
        
        // Finde aktuellen Einsatz
        if (vehicle.incident) {
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

        // Begrenze Log-Größe
        const maxEntries = this.config?.ui_settings?.max_log_entries || 100;
        if (this.log.length > maxEntries) {
            this.log = this.log.slice(0, maxEntries);
        }

        // Update UI
        if (typeof RadioUI !== 'undefined') {
            RadioUI.updateLog();
        }
    },

    /**
     * Gibt Funkprotokoll zurück (optional gefiltert)
     */
    getLog(filter = {}) {
        let filtered = [...this.log];

        if (filter.channel) {
            filtered = filtered.filter(entry => {
                if (entry.vehicle) {
                    return this.getChannelForVehicle(entry.vehicle) === filter.channel;
                }
                return entry.channel === filter.channel;
            });
        }

        if (filter.vehicleId) {
            filtered = filtered.filter(entry => 
                entry.vehicle && entry.vehicle.id === filter.vehicleId
            );
        }

        if (filter.type) {
            filtered = filtered.filter(entry => entry.type === filter.type);
        }

        return filtered;
    },

    /**
     * Löscht Funkprotokoll
     */
    clearLog() {
        this.log = [];
        console.log('🗑️ Funkprotokoll gelöscht');
        
        if (typeof RadioUI !== 'undefined') {
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
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', async () => {
        await RadioSystem.initialize();
        console.log('✅ RadioSystem bereit');
    });
}

console.log('✅ radio-system.js geladen');
