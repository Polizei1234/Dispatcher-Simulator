// =========================
// EVENT BRIDGE v1.0
// Bidirektionale Kommunikation zwischen allen Systemen
// 🎉 Escalation ⇔ Radio ⇔ VehicleMovement ⇔ AI
// =========================

/**
 * EVENT BRIDGE v1.0
 * 
 * ZWECK:
 * - Systeme können miteinander "sprechen"
 * - Events lösen automatisch Funksprüche aus
 * - Realistische Kommunikation zwischen Fahrzeugen und Leitstelle
 * 
 * EVENTS:
 * 1. ESCALATION EVENTS:
 *    - escalation:started - Einsatz eskaliert
 *    - escalation:nef_required - NEF wird benötigt
 *    - escalation:backup_required - Verstärkung nötig
 *    - escalation:critical - Kritischer Zustand
 * 
 * 2. VEHICLE EVENTS:
 *    - vehicle:dispatch - Fahrzeug alarmiert
 *    - vehicle:arrival - Am Einsatzort
 *    - vehicle:departure - Verlässt Einsatzort
 *    - vehicle:hospital_arrival - Am Krankenhaus
 *    - vehicle:back_available - Einsatzbereit
 *    - vehicle:technical_problem - Technisches Problem
 * 
 * 3. INCIDENT EVENTS:
 *    - incident:created - Neuer Einsatz
 *    - incident:assigned - Fahrzeuge zugewiesen
 *    - incident:complication - Komplikation
 *    - incident:completed - Einsatz abgeschlossen
 *    - incident:canceled - Einsatz abgebrochen
 * 
 * 4. MEDICAL EVENTS:
 *    - medical:patient_critical - Patient kritisch
 *    - medical:resuscitation - Reanimation läuft
 *    - medical:stabilized - Patient stabilisiert
 *    - medical:deceased - Patient verstorben
 * 
 * WORKFLOW:
 * 1. System feuert Event: EventBridge.emit('escalation:nef_required', {...})
 * 2. EventBridge leitet an RadioSystem weiter
 * 3. RadioSystem generiert Funkspruch
 * 4. Funkspruch erscheint in UI
 * 5. Optional: KI antwortet automatisch
 */

class EventBridge {
    constructor() {
        this.listeners = new Map();
        this.eventLog = [];
        this.maxLogSize = 100;
        
        // Statistiken
        this.stats = {
            totalEvents: 0,
            eventsByType: {},
            radioMessagesTriggered: 0,
            lastEventTime: null
        };
        
        console.log('🌉 EventBridge v1.0 initialisiert');
        console.log('   ✅ Bidirektionale System-Kommunikation aktiv');
        
        this.setupDefaultListeners();
    }
    
    /**
     * 🆕 Event feuern
     */
    emit(eventType, data = {}) {
        const event = {
            type: eventType,
            data: data,
            timestamp: Date.now(),
            id: this.generateEventId()
        };
        
        // Log Event
        this.logEvent(event);
        
        // Update Stats
        this.stats.totalEvents++;
        this.stats.eventsByType[eventType] = (this.stats.eventsByType[eventType] || 0) + 1;
        this.stats.lastEventTime = event.timestamp;
        
        console.log(`📡 EVENT: ${eventType}`, data);
        
        // Rufe Listener auf
        const listeners = this.listeners.get(eventType) || [];
        listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error(`❌ Fehler in Event Listener für ${eventType}:`, error);
            }
        });
        
        // Fire custom DOM event (für externe Systeme)
        window.dispatchEvent(new CustomEvent('game:event', {
            detail: event
        }));
    }
    
    /**
     * Event-Listener registrieren
     */
    on(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType).push(callback);
        
        console.log(`🔌 Listener registriert für: ${eventType}`);
    }
    
    /**
     * Event-Listener entfernen
     */
    off(eventType, callback) {
        const listeners = this.listeners.get(eventType);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
    
    /**
     * 🆕 Setup Default Listeners (Radio-Integration)
     */
    setupDefaultListeners() {
        // 1️⃣ ESCALATION EVENTS → FUNKSPRUCH
        this.on('escalation:nef_required', (event) => {
            this.handleNefRequest(event);
        });
        
        this.on('escalation:backup_required', (event) => {
            this.handleBackupRequest(event);
        });
        
        this.on('escalation:critical', (event) => {
            this.handleCriticalEscalation(event);
        });
        
        // 2️⃣ MEDICAL EVENTS → FUNKSPRUCH
        this.on('medical:patient_critical', (event) => {
            this.handlePatientCritical(event);
        });
        
        this.on('medical:resuscitation', (event) => {
            this.handleResuscitation(event);
        });
        
        this.on('medical:stabilized', (event) => {
            this.handlePatientStabilized(event);
        });
        
        // 3️⃣ INCIDENT EVENTS → FUNKSPRUCH
        this.on('incident:complication', (event) => {
            this.handleComplication(event);
        });
        
        this.on('incident:canceled', (event) => {
            this.handleIncidentCanceled(event);
        });
        
        // 4️⃣ VEHICLE EVENTS → FUNKSPRUCH (bereits implementiert in RadioSystem)
        // Diese werden von VehicleMovement direkt aufgerufen
        
        console.log('✅ Default Event Listeners registriert');
    }
    
    /**
     * 🚑 NEF-Anforderung
     */
    async handleNefRequest(event) {
        const { incident, vehicle, reason, urgency } = event.data;
        
        console.log(`🚑 NEF angefordert für ${incident.id}`);
        
        if (!window.RadioSystem) {
            console.warn('⚠️ RadioSystem nicht verfügbar');
            return;
        }
        
        // Sende automatischen Funkspruch
        try {
            await window.RadioSystem.sendAutomaticMessage(vehicle, 'nef_requested', {
                incident: incident,
                reason: reason || 'Patientenzustand verschlechtert',
                urgency: urgency || 'high'
            });
            
            this.stats.radioMessagesTriggered++;
        } catch (error) {
            console.error('❌ Fehler beim Senden des NEF-Funkspruchs:', error);
        }
    }
    
    /**
     * 🚨 Verstärkung anfordern
     */
    async handleBackupRequest(event) {
        const { incident, vehicle, reason, vehicleType } = event.data;
        
        console.log(`🚨 Verstärkung angefordert: ${vehicleType || 'RTW'}`);
        
        if (!window.RadioSystem) return;
        
        try {
            await window.RadioSystem.sendAutomaticMessage(vehicle, 'backup_requested', {
                incident: incident,
                reason: reason || 'Zusätzliche Ressourcen benötigt',
                vehicleType: vehicleType || 'RTW'
            });
            
            this.stats.radioMessagesTriggered++;
        } catch (error) {
            console.error('❌ Fehler beim Senden des Verstärkungs-Funkspruchs:', error);
        }
    }
    
    /**
     * ⚠️ Kritische Eskalation
     */
    async handleCriticalEscalation(event) {
        const { incident, vehicle, oldSeverity, newSeverity } = event.data;
        
        console.warn(`⚠️ Kritische Eskalation: ${oldSeverity} → ${newSeverity}`);
        
        if (!window.RadioSystem) return;
        
        try {
            await window.RadioSystem.sendAutomaticMessage(vehicle, 'status_worsened', {
                incident: incident,
                oldStatus: oldSeverity,
                newStatus: newSeverity,
                urgency: 'critical'
            });
            
            this.stats.radioMessagesTriggered++;
        } catch (error) {
            console.error('❌ Fehler beim Senden des Eskalations-Funkspruchs:', error);
        }
    }
    
    /**
     * 🤕 Patient kritisch
     */
    async handlePatientCritical(event) {
        const { incident, vehicle, symptoms } = event.data;
        
        console.warn(`🤕 Patient kritisch bei ${incident.id}`);
        
        if (!window.RadioSystem) return;
        
        try {
            await window.RadioSystem.sendAutomaticMessage(vehicle, 'patient_critical', {
                incident: incident,
                symptoms: symptoms || 'Kritischer Zustand',
                urgency: 'critical'
            });
            
            this.stats.radioMessagesTriggered++;
        } catch (error) {
            console.error('❌ Fehler beim Senden des Patienten-Funkspruchs:', error);
        }
    }
    
    /**
     * ❤️ Reanimation
     */
    async handleResuscitation(event) {
        const { incident, vehicle } = event.data;
        
        console.warn(`❤️ Reanimation bei ${incident.id}`);
        
        if (!window.RadioSystem) return;
        
        try {
            await window.RadioSystem.sendAutomaticMessage(vehicle, 'resuscitation', {
                incident: incident,
                urgency: 'critical'
            });
            
            this.stats.radioMessagesTriggered++;
        } catch (error) {
            console.error('❌ Fehler beim Senden des Reanimations-Funkspruchs:', error);
        }
    }
    
    /**
     * 💚 Patient stabilisiert
     */
    async handlePatientStabilized(event) {
        const { incident, vehicle } = event.data;
        
        console.log(`💚 Patient stabilisiert bei ${incident.id}`);
        
        if (!window.RadioSystem) return;
        
        try {
            await window.RadioSystem.sendAutomaticMessage(vehicle, 'patient_stabilized', {
                incident: incident
            });
            
            this.stats.radioMessagesTriggered++;
        } catch (error) {
            console.error('❌ Fehler beim Senden des Stabilisierungs-Funkspruchs:', error);
        }
    }
    
    /**
     * ⚠️ Komplikation
     */
    async handleComplication(event) {
        const { incident, vehicle, complication } = event.data;
        
        console.warn(`⚠️ Komplikation: ${complication.type}`);
        
        if (!window.RadioSystem) return;
        
        try {
            await window.RadioSystem.sendAutomaticMessage(vehicle, 'complication', {
                incident: incident,
                complicationType: complication.type,
                effect: complication.effect
            });
            
            this.stats.radioMessagesTriggered++;
        } catch (error) {
            console.error('❌ Fehler beim Senden des Komplikations-Funkspruchs:', error);
        }
    }
    
    /**
     * ❌ Einsatz abgebrochen
     */
    async handleIncidentCanceled(event) {
        const { incident, vehicle, reason } = event.data;
        
        console.log(`❌ Einsatz abgebrochen: ${incident.id}`);
        
        if (!window.RadioSystem) return;
        
        try {
            await window.RadioSystem.sendAutomaticMessage(vehicle, 'incident_canceled', {
                incident: incident,
                reason: reason || 'Einsatz wurde abgebrochen'
            });
            
            this.stats.radioMessagesTriggered++;
        } catch (error) {
            console.error('❌ Fehler beim Senden des Abbruch-Funkspruchs:', error);
        }
    }
    
    /**
     * Event loggen
     */
    logEvent(event) {
        this.eventLog.push(event);
        
        // Begrenze Log-Größe
        if (this.eventLog.length > this.maxLogSize) {
            this.eventLog.shift();
        }
    }
    
    /**
     * Event-ID generieren
     */
    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Event-Log abrufen
     */
    getEventLog(filter = null) {
        if (!filter) return this.eventLog;
        
        return this.eventLog.filter(event => {
            if (filter.type && event.type !== filter.type) return false;
            if (filter.since && event.timestamp < filter.since) return false;
            return true;
        });
    }
    
    /**
     * Statistiken abrufen
     */
    getStatistics() {
        return {
            ...this.stats,
            activeListeners: Array.from(this.listeners.keys()).length,
            eventLogSize: this.eventLog.length
        };
    }
    
    /**
     * Event-Log löschen
     */
    clearLog() {
        this.eventLog = [];
        console.log('🧹 Event-Log gelöscht');
    }
    
    /**
     * Alle Listener entfernen
     */
    removeAllListeners() {
        this.listeners.clear();
        console.log('❌ Alle Event Listeners entfernt');
    }
}

// Globale Instanz
if (typeof window !== 'undefined') {
    window.eventBridge = new EventBridge();
    window.EventBridge = EventBridge;
}

console.log('🌉 event-bridge.js v1.0 geladen - Bidirektionale System-Kommunikation!');
