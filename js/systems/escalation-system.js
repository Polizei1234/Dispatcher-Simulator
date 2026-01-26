// =========================
// ESCALATION SYSTEM v2.0
// PHASE 2 - COMPOSITION SYSTEM INTEGRATION
// Nutzt komponierte Schemas für intelligente Eskalationen
// =========================

/**
 * ESCALATION SYSTEM v2.0
 * 
 * 🆕 NEU IN v2.0:
 * - Nutzt schema.escalation aus Severity Bases
 * - Eskalation: MINOR → MODERATE → CRITICAL
 * - Re-komponiert Schema bei Eskalation
 * - Berücksichtigt Modifier-Effekte
 * - Komplikationen aus Modifiers
 * - Event-System für Eskalations-Trigger
 * 
 * WORKFLOW:
 * 1. Incident wird erstellt mit compositionInfo
 * 2. System prüft schema.escalation.probability
 * 3. Bei Eskalation: Re-komponiere mit neuem Severity
 * 4. Update Incident mit neuen Schema-Eigenschaften
 * 5. Benachrichtige UI
 * 
 * VORTEILE:
 * - Keine festen Regeln mehr (RD 1 → RD 2)
 * - Dynamisch basierend auf Severity
 * - Konsistent mit Composition System
 * - Modifier beeinflussen Eskalation
 */

class EscalationSystem {
    constructor() {
        this.activeEscalations = new Map();
        this.complicationTimers = new Map();
        
        console.log('🚨 Escalation System v2.0 initialisiert');
        console.log('   ✅ Nutzt Composition System');
    }
    
    /**
     * 🆕 Startet Eskalations-Überwachung für Einsatz
     */
    monitorIncident(incident) {
        // Prüfe ob Incident komponiert wurde
        if (!incident.compositionInfo || !incident.composedSchema) {
            console.warn(`⚠️ ${incident.id}: Kein composedSchema, nutze Legacy-Modus`);
            return this.monitorLegacyIncident(incident);
        }
        
        const schema = incident.composedSchema;
        const compositionInfo = incident.compositionInfo;
        
        console.group(`🔍 Monitor Incident: ${incident.id}`);
        console.log(`Severity: ${compositionInfo.severity}`);
        console.log(`Type: ${compositionInfo.type}`);
        console.log(`Modifiers: ${compositionInfo.modifiers.join(', ') || 'Keine'}`);
        
        // CRITICAL hat keine Eskalation, nur Komplikationen
        if (compositionInfo.severity === 'CRITICAL') {
            console.log('⚠️ CRITICAL - Prüfe Komplikationen statt Eskalation');
            this.monitorComplications(incident, schema);
            console.groupEnd();
            return;
        }
        
        // Prüfe Eskalations-Wahrscheinlichkeit
        if (!schema.escalation) {
            console.log('ℹ️ Keine Eskalations-Daten im Schema');
            console.groupEnd();
            return;
        }
        
        // Berücksichtige Modifier-Effekte
        let probability = schema.escalation.probability;
        
        // Modifier können Eskalation wahrscheinlicher machen
        if (compositionInfo.modifiers.length > 0 && window.INCIDENT_MODIFIERS) {
            compositionInfo.modifiers.forEach(modId => {
                const modifier = window.INCIDENT_MODIFIERS[modId];
                if (modifier?.effects?.escalationModifier) {
                    probability *= modifier.effects.escalationModifier;
                }
            });
        }
        
        console.log(`Eskalations-Chance: ${(probability * 100).toFixed(1)}%`);
        
        // Prüfe Wahrscheinlichkeit
        if (Math.random() > probability) {
            console.log('✅ Keine Eskalation (Zufall)');
            console.groupEnd();
            return;
        }
        
        // Berechne Zeitpunkt der Eskalation
        const timeWindow = schema.escalation.timeWindow;
        const delayMinutes = timeWindow.min + 
            Math.random() * (timeWindow.max - timeWindow.min);
        const delayMs = delayMinutes * 60 * 1000;
        
        console.log(`⚠️ Eskalation geplant in ${delayMinutes.toFixed(1)} Min`);
        console.log(`Ziel-Severity: ${schema.escalation.newLevel}`);
        console.groupEnd();
        
        // Setze Timer
        const escalationTimer = setTimeout(() => {
            this.executeEscalation(incident);
        }, delayMs);
        
        this.activeEscalations.set(incident.id, {
            incident: incident,
            timer: escalationTimer,
            targetSeverity: schema.escalation.newLevel,
            reason: this.selectEscalationReason(schema.escalation)
        });
    }
    
    /**
     * 🆕 Überwacht Komplikationen bei CRITICAL
     */
    monitorComplications(incident, schema) {
        if (!schema.complications || schema.complications.length === 0) {
            console.log('ℹ️ Keine Komplikationen definiert');
            return;
        }
        
        schema.complications.forEach((complication, index) => {
            if (Math.random() < complication.probability) {
                const delayMinutes = 3 + Math.random() * 10; // 3-13 Min
                const delayMs = delayMinutes * 60 * 1000;
                
                console.log(`⚠️ Komplikation geplant: ${complication.type} in ${delayMinutes.toFixed(1)} Min`);
                
                const timer = setTimeout(() => {
                    this.executeComplication(incident, complication);
                }, delayMs);
                
                this.complicationTimers.set(`${incident.id}_${index}`, timer);
            }
        });
    }
    
    /**
     * 🆕 Führt Eskalation aus
     */
    executeEscalation(incident) {
        if (incident.completed) {
            console.log(`ℹ️ ${incident.id}: Bereits abgeschlossen, keine Eskalation`);
            return;
        }
        
        const escalation = this.activeEscalations.get(incident.id);
        if (!escalation) return;
        
        const oldSeverity = incident.compositionInfo.severity;
        const newSeverity = escalation.targetSeverity;
        const oldKeyword = incident.stichwort;
        
        console.group(`🚨 ESKALATION: ${incident.id}`);
        console.log(`${oldSeverity} → ${newSeverity}`);
        console.log(`Grund: ${escalation.reason}`);
        
        // 🆕 RE-KOMPONIERE mit neuem Severity
        if (window.incidentComposer && window.incidentComposer.loaded) {
            const newSchema = window.incidentComposer.compose(
                newSeverity,
                incident.compositionInfo.type,
                incident.compositionInfo.modifiers
            );
            
            if (newSchema) {
                // Update Incident mit neuem Schema
                this.updateIncidentFromSchema(incident, newSchema, escalation.reason);
                console.log(`✅ Schema re-komponiert: ${incident.stichwort}`);
            } else {
                console.error('❌ Re-Komposition fehlgeschlagen');
            }
        } else {
            console.error('❌ incidentComposer nicht verfügbar');
        }
        
        console.groupEnd();
        
        // Cleanup
        this.activeEscalations.delete(incident.id);
        
        // 🆕 Bei MODERATE → CRITICAL: Überwache Komplikationen
        if (newSeverity === 'CRITICAL' && incident.composedSchema) {
            this.monitorComplications(incident, incident.composedSchema);
        }
    }
    
    /**
     * 🆕 Führt Komplikation aus
     */
    executeComplication(incident, complication) {
        if (incident.completed) return;
        
        console.warn(`⚠️ KOMPLIKATION: ${incident.id}`);
        console.warn(`   Type: ${complication.type}`);
        console.warn(`   Effekt: ${complication.effect}`);
        
        // Speichere Komplikation
        if (!incident.complications) {
            incident.complications = [];
        }
        incident.complications.push({
            type: complication.type,
            effect: complication.effect,
            timestamp: Date.now()
        });
        
        // Benachrichtige UI
        if (window.notificationSystem) {
            window.notificationSystem.showComplication(incident, complication);
        }
        
        // Update UI
        if (window.updateIncidentUI) {
            window.updateIncidentUI();
        }
    }
    
    /**
     * 🆕 Updated Incident mit neuem Schema
     */
    updateIncidentFromSchema(incident, newSchema, reason) {
        const oldKeyword = incident.stichwort;
        
        // Update Basis-Properties
        incident.stichwort = newSchema.stichwort;
        incident.keyword = newSchema.stichwort;
        incident.name = newSchema.name;
        incident.priority = newSchema.priority;
        
        // Update Composition Info
        incident.compositionInfo = newSchema.compositionInfo;
        incident.composedSchema = newSchema;
        
        // Markiere als eskaliert
        incident.eskaliert = true;
        incident.eskalierungsgrund = reason;
        incident.eskaliert_von = oldKeyword;
        incident.eskaliert_zu = newSchema.stichwort;
        
        // Update Fahrzeuge
        incident.benoetigte_fahrzeuge = this.convertVehiclesToObject(newSchema.vehicles);
        
        // Verlängere Dauer
        const durationIncrease = Math.floor(
            newSchema.duration.min * 0.3 + Math.random() * 20
        );
        incident.einsatzdauer_minuten += durationIncrease;
        
        console.log(`   ${oldKeyword} → ${newSchema.stichwort}`);
        console.log(`   Neue Fahrzeuge: ${JSON.stringify(incident.benoetigte_fahrzeuge)}`);
        console.log(`   Dauer +${durationIncrease} Min`);
        
        // Benachrichtige UI
        if (window.notificationSystem) {
            window.notificationSystem.showEscalation(
                incident, 
                oldKeyword, 
                newSchema.stichwort, 
                reason
            );
        }
        
        // Update Incident List UI
        if (window.updateIncidentUI) {
            window.updateIncidentUI();
        }
    }
    
    /**
     * Wählt Eskalationsgrund aus Schema
     */
    selectEscalationReason(escalation) {
        if (!escalation.triggers || escalation.triggers.length === 0) {
            return 'Zustand hat sich verschlechtert';
        }
        return escalation.triggers[
            Math.floor(Math.random() * escalation.triggers.length)
        ];
    }
    
    /**
     * Konvertiert Schema-Fahrzeuge zu Object-Format
     */
    convertVehiclesToObject(vehicles) {
        const result = {
            RTW: 0,
            NEF: 0,
            NAW: 0,
            KTW: 0
        };
        
        if (vehicles.required) {
            vehicles.required.forEach(v => {
                if (result.hasOwnProperty(v)) {
                    result[v]++;
                }
            });
        }
        
        if (vehicles.optional && Math.random() < 0.3) {
            const optional = vehicles.optional[
                Math.floor(Math.random() * vehicles.optional.length)
            ];
            if (result.hasOwnProperty(optional)) {
                result[optional]++;
            }
        }
        
        return result;
    }
    
    /**
     * ⚠️ LEGACY: Für alte Incidents ohne composedSchema
     */
    monitorLegacyIncident(incident) {
        console.warn(`⚠️ ${incident.id}: Nutze Legacy Escalation`);
        
        const legacyRules = {
            'RD 1': { to: ['RD 2', 'RD 3'], prob: 0.15, time: {min: 5, max: 15} },
            'RD 2': { to: ['RD 3'], prob: 0.10, time: {min: 3, max: 10} },
            'VU': { to: ['VU P'], prob: 0.12, time: {min: 2, max: 8} }
        };
        
        const rule = legacyRules[incident.stichwort];
        if (!rule || Math.random() > rule.prob) return;
        
        const delayMinutes = rule.time.min + Math.random() * (rule.time.max - rule.time.min);
        const delayMs = delayMinutes * 60 * 1000;
        
        const timer = setTimeout(() => {
            this.executeLegacyEscalation(incident, rule);
        }, delayMs);
        
        this.activeEscalations.set(incident.id, {
            incident: incident,
            timer: timer,
            legacy: true
        });
    }
    
    /**
     * ⚠️ LEGACY: Eskalation für alte Incidents
     */
    executeLegacyEscalation(incident, rule) {
        if (incident.completed) return;
        
        const newKeyword = rule.to[Math.floor(Math.random() * rule.to.length)];
        const oldKeyword = incident.stichwort;
        
        incident.stichwort = newKeyword;
        incident.keyword = newKeyword;
        incident.eskaliert = true;
        incident.eskalierungsgrund = 'Zustand hat sich verschlechtert';
        
        console.warn(`🚨 LEGACY ESKALATION: ${oldKeyword} → ${newKeyword}`);
        
        if (window.notificationSystem) {
            window.notificationSystem.showEscalation(
                incident, 
                oldKeyword, 
                newKeyword, 
                'Zustand hat sich verschlechtert'
            );
        }
        
        this.activeEscalations.delete(incident.id);
    }
    
    /**
     * Bricht Eskalation ab
     */
    cancelEscalation(incidentId) {
        const escalation = this.activeEscalations.get(incidentId);
        if (escalation) {
            clearTimeout(escalation.timer);
            this.activeEscalations.delete(incidentId);
            console.log(`❌ Eskalation für ${incidentId} abgebrochen`);
        }
        
        // Breche auch Komplikationen ab
        for (const [key, timer] of this.complicationTimers.entries()) {
            if (key.startsWith(incidentId)) {
                clearTimeout(timer);
                this.complicationTimers.delete(key);
            }
        }
    }
    
    /**
     * Gibt alle geplanten Eskalationen zurück
     */
    getActiveEscalations() {
        return Array.from(this.activeEscalations.values());
    }
    
    /**
     * Gibt Statistiken zurück
     */
    getStatistics() {
        return {
            activeEscalations: this.activeEscalations.size,
            activeComplications: this.complicationTimers.size
        };
    }
    
    /**
     * Stoppt alle Eskalationen
     */
    stopAll() {
        // Stoppe Eskalationen
        this.activeEscalations.forEach((escalation) => {
            clearTimeout(escalation.timer);
        });
        this.activeEscalations.clear();
        
        // Stoppe Komplikationen
        this.complicationTimers.forEach((timer) => {
            clearTimeout(timer);
        });
        this.complicationTimers.clear();
        
        console.log('❌ Alle Eskalationen & Komplikationen gestoppt');
    }
}

// Globale Instanz
window.EscalationSystem = EscalationSystem;

console.log('🚨 Escalation System v2.0 geladen - ✅ Composition System Integration!');
