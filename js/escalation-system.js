// =========================
// ESCALATION SYSTEM v1.0
// Einsätze können sich verschlimmern
// =========================

class EscalationSystem {
    constructor() {
        this.activeEscalations = new Map();
        this.escalationRules = this.defineEscalationRules();
    }
    
    /**
     * Definiert Eskalations-Regeln
     */
    defineEscalationRules() {
        return {
            'RD 1': {
                canEscalateTo: ['RD 2', 'RD 3'],
                probability: 0.15, // 15% Chance
                timeWindow: { min: 5, max: 15 }, // 5-15 Minuten nach Einsatzbeginn
                reasons: [
                    'Zustand des Patienten hat sich verschlechtert',
                    'Patient wird bewusstlos',
                    'Atmung setzt aus',
                    'Herzrhythmusstörungen erkannt'
                ]
            },
            'RD 2': {
                canEscalateTo: ['RD 3'],
                probability: 0.10,
                timeWindow: { min: 3, max: 10 },
                reasons: [
                    'Reanimationspflichtigkeit',
                    'Kreislaufstillstand',
                    'Massiver Blutverlust'
                ]
            },
            'VU': {
                canEscalateTo: ['VU P'],
                probability: 0.12,
                timeWindow: { min: 2, max: 8 },
                reasons: [
                    'Weitere Person im Fahrzeug eingeklemmt entdeckt',
                    'Schwere Verletzungen festgestellt',
                    'Fahrzeug droht zu kippen'
                ]
            },
            'B 1': {
                canEscalateTo: ['B 2', 'B 3'],
                probability: 0.20,
                timeWindow: { min: 3, max: 12 },
                reasons: [
                    'Feuer breitet sich schnell aus',
                    'Gasflaschen entdeckt',
                    'Übergreifen auf Nachbargebäude',
                    'Person im Gebäude vermutet'
                ]
            },
            'B 2': {
                canEscalateTo: ['B 3'],
                probability: 0.15,
                timeWindow: { min: 5, max: 15 },
                reasons: [
                    'Feuer außer Kontrolle',
                    'Mehrere Gebäude betroffen',
                    'Einsturzgefahr'
                ]
            },
            'THL 1': {
                canEscalateTo: ['THL 2'],
                probability: 0.10,
                timeWindow: { min: 3, max: 10 },
                reasons: [
                    'Situation komplexer als erwartet',
                    'Zusätzliche Geräte benötigt',
                    'Weitere Personen betroffen'
                ]
            }
        };
    }
    
    /**
     * Startet Eskalations-Überwachung für Einsatz
     */
    monitorIncident(incident) {
        const rule = this.escalationRules[incident.stichwort];
        if (!rule) {
            console.log(`ℹ️ Keine Eskalations-Regel für ${incident.stichwort}`);
            return;
        }
        
        // Prüfe Wahrscheinlichkeit
        if (Math.random() > rule.probability) {
            console.log(`✅ ${incident.id}: Keine Eskalation (Zufall)`);
            return;
        }
        
        // Berechne zufälligen Zeitpunkt
        const delayMinutes = rule.timeWindow.min + 
            Math.random() * (rule.timeWindow.max - rule.timeWindow.min);
        const delayMs = delayMinutes * 60 * 1000;
        
        console.log(`⚠️ ${incident.id}: Eskalation geplant in ${delayMinutes.toFixed(1)} Min`);
        
        const escalationTimer = setTimeout(() => {
            this.escalateIncident(incident, rule);
        }, delayMs);
        
        this.activeEscalations.set(incident.id, {
            incident: incident,
            timer: escalationTimer,
            rule: rule
        });
    }
    
    /**
     * Eskaliert Einsatz
     */
    escalateIncident(incident, rule) {
        if (incident.completed) {
            console.log(`ℹ️ ${incident.id}: Bereits abgeschlossen, keine Eskalation`);
            return;
        }
        
        // Wähle neues Stichwort
        const newKeyword = rule.canEscalateTo[
            Math.floor(Math.random() * rule.canEscalateTo.length)
        ];
        
        const reason = rule.reasons[
            Math.floor(Math.random() * rule.reasons.length)
        ];
        
        const oldKeyword = incident.stichwort;
        incident.stichwort = newKeyword;
        incident.keyword = newKeyword;
        incident.eskaliert = true;
        incident.eskalierungsgrund = reason;
        
        console.warn(`🚨 ESKALATION: ${incident.id}`);
        console.warn(`   ${oldKeyword} → ${newKeyword}`);
        console.warn(`   Grund: ${reason}`);
        
        // Aktualisiere benötigte Fahrzeuge
        this.updateRequiredVehicles(incident, newKeyword);
        
        // Verlängere Einsatzdauer
        const durationIncrease = Math.floor(10 + Math.random() * 20); // +10-30 Min
        incident.einsatzdauer_minuten += durationIncrease;
        
        // Benachrichtige UI
        if (window.notificationSystem) {
            window.notificationSystem.showEscalation(incident, oldKeyword, newKeyword, reason);
        }
        
        // Update Incident List UI
        if (window.updateIncidentUI) {
            window.updateIncidentUI();
        }
        
        this.activeEscalations.delete(incident.id);
    }
    
    /**
     * Aktualisiert benötigte Fahrzeuge nach Eskalation
     */
    updateRequiredVehicles(incident, newKeyword) {
        const vehicleRequirements = {
            'RD 1': { RTW: 1, NEF: 0 },
            'RD 2': { RTW: 1, NEF: 1 },
            'RD 3': { RTW: 1, NEF: 1 },
            'VU': { RTW: 1, NEF: 0 },
            'VU P': { RTW: 2, NEF: 1 },
            'B 1': { RTW: 0, NEF: 0 },
            'B 2': { RTW: 1, NEF: 0 },
            'B 3': { RTW: 2, NEF: 1 },
            'THL 1': { RTW: 0, NEF: 0 },
            'THL 2': { RTW: 1, NEF: 0 }
        };
        
        incident.benoetigte_fahrzeuge = vehicleRequirements[newKeyword] || { RTW: 1, NEF: 0 };
        console.log(`   Neue Fahrzeuganforderung: ${JSON.stringify(incident.benoetigte_fahrzeuge)}`);
    }
    
    /**
     * Bricht Eskalation ab (z.B. wenn Einsatz vorzeitig beendet)
     */
    cancelEscalation(incidentId) {
        const escalation = this.activeEscalations.get(incidentId);
        if (escalation) {
            clearTimeout(escalation.timer);
            this.activeEscalations.delete(incidentId);
            console.log(`❌ Eskalation für ${incidentId} abgebrochen`);
        }
    }
    
    /**
     * Gibt alle geplanten Eskalationen zurück
     */
    getActiveEscalations() {
        return Array.from(this.activeEscalations.values());
    }
    
    /**
     * Stoppt alle Eskalationen
     */
    stopAll() {
        this.activeEscalations.forEach((escalation, incidentId) => {
            clearTimeout(escalation.timer);
        });
        this.activeEscalations.clear();
        console.log('❌ Alle Eskalationen gestoppt');
    }
}

// Globale Instanz
window.EscalationSystem = EscalationSystem;

console.log('🚨 Escalation System geladen');