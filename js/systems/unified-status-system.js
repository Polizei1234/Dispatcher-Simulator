// =========================
// UNIFIED STATUS SYSTEM v1.0
// Fusioniertes System für FMS-Statusmeldungen
// + Status 0: NUR für Notfälle der Besatzung
// + Status 5: Für alle Anfragen Fahrzeug→Leitstelle
// + Visuelle Status-Kästchen mit Farbcodierung
// + Korrekte Workflow-Logik (Status 5/0 = Sprechwunsch)
// =========================

class UnifiedStatusSystem {
    constructor() {
        this.pendingTransmissions = new Map(); // vehicleId -> {type, oldStatus, newStatus, timestamp}
        this.waitingForPermission = new Map(); // vehicleId -> {type: 'status5' | 'status0', message, timestamp}
        
        console.log('📡 Unified Status System v1.0 initialisiert');
    }

    /**
     * STATUS-FARBEN basierend auf Anforderung
     */
    STATUS_COLORS = {
        0: '#ff4444',    // Helles Rot (Notfall Besatzung)
        1: '#90ee90',    // Hellgrün (Einsatzbereit über Funk)
        2: '#006400',    // Dunkelgrün (Einsatzbereit auf Wache)
        3: '#ffa500',    // Orange (Einsatz übernommen)
        4: '#8b0000',    // Dunkles Rot (Anfahrt Einsatzstelle)
        5: '#ff6666',    // Helles Rot (Sprechwunsch)
        6: '#808080',    // Grau (Ankunft Einsatzstelle)
        7: '#ffb6c1',    // Rosa (Patient aufgenommen)
        8: '#9370db',    // Lila (Anfahrt Krankenhaus)
        'C': '#666666'   // Dunkelgrau (Nicht einsatzbereit)
    };

    /**
     * Generiert HTML für Status-Badge
     * @param {number|string} status - Status-Code
     * @returns {string} HTML für Badge
     */
    createStatusBadge(status) {
        const color = this.STATUS_COLORS[status] || '#6c757d';
        return `<span class="status-badge" style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block; min-width: 28px; text-align: center;">${status}</span>`;
    }

    /**
     * Generiert HTML für Status-Transition (Alt → Neu)
     * @param {number|string} oldStatus - Alter Status
     * @param {number|string} newStatus - Neuer Status
     * @returns {string} HTML für Transition
     */
    createStatusTransition(oldStatus, newStatus) {
        const oldBadge = this.createStatusBadge(oldStatus);
        const newBadge = this.createStatusBadge(newStatus);
        const arrow = '<span style="margin: 0 8px; font-size: 16px;">→</span>';
        
        return `<div class="status-transition" style="display: inline-flex; align-items: center;">${oldBadge}${arrow}${newBadge}</div>`;
    }

    /**
     * Sendet Status-Meldung ins Funkfenster
     * @param {string} callsign - Fahrzeug-Rufzeichen
     * @param {number|string} oldStatus - Alter Status
     * @param {number|string} newStatus - Neuer Status
     * @param {string} additionalText - Optional: Zusatztext
     */
    sendStatusMessage(callsign, oldStatus, newStatus, additionalText = '') {
        const transition = this.createStatusTransition(oldStatus, newStatus);
        const statusInfo = CONFIG.getFMSStatus(newStatus);
        const text = additionalText || statusInfo.shortName;
        
        const messageHTML = `${callsign}: ${transition} <span style="margin-left: 8px; color: #6c757d;">${text}</span>`;
        
        if (typeof addRadioMessage !== 'undefined') {
            addRadioMessage(callsign, messageHTML, 'status-change', true); // true = isHTML
        }
        
        console.log(`📻 Status-Meldung: ${callsign} ${oldStatus}→${newStatus}`);
    }

    /**
     * Sendet Status 5 (Sprechwunsch) - NUR Badge ohne Pfeil
     * @param {string} vehicleId - Fahrzeug-ID
     * @param {string} message - Funkspruch nach "J"-Freigabe
     */
    sendStatus5Request(vehicleId, message = null) {
        const vehicle = game.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const oldStatus = vehicle.currentStatus;
        const badge = this.createStatusBadge(5);
        
        const messageHTML = `${vehicle.callsign}: ${badge} <span style="margin-left: 8px; color: #dc3545; font-weight: bold;">Sprechwunsch</span>`;
        
        if (typeof addRadioMessage !== 'undefined') {
            addRadioMessage(vehicle.callsign, messageHTML, 'status-5-request', true);
        }

        // Speichere für "J"-Workflow
        this.waitingForPermission.set(vehicleId, {
            type: 'status5',
            oldStatus,
            message: message || this.generateStatus5Message(vehicle),
            timestamp: Date.now()
        });

        // Setze temporär auf Status 5
        vehicle.currentStatus = 5;
        this.updateVehicleDisplay(vehicle);

        console.log(`📞 ${vehicle.callsign} meldet Sprechwunsch (Status 5)`);
    }

    /**
     * Sendet Status 0 (NOTFALL der Besatzung) - NUR Badge ohne Pfeil
     * @param {string} vehicleId - Fahrzeug-ID
     * @param {string} emergencyReason - Grund für Notfall
     */
    sendStatus0Emergency(vehicleId, emergencyReason = 'Notlage!') {
        const vehicle = game.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const oldStatus = vehicle.currentStatus;
        const badge = this.createStatusBadge(0);
        
        const messageHTML = `${vehicle.callsign}: ${badge} <span style="margin-left: 8px; color: #dc3545; font-weight: bold; text-transform: uppercase;">NOTFALL BESATZUNG!</span>`;
        
        if (typeof addRadioMessage !== 'undefined') {
            addRadioMessage(vehicle.callsign, messageHTML, 'status-0-emergency', true);
            
            // Alarmton abspielen
            if (typeof playSound !== 'undefined') {
                playSound('emergency');
            }
        }

        // Speichere für "J"-Workflow
        this.waitingForPermission.set(vehicleId, {
            type: 'status0',
            oldStatus,
            message: emergencyReason,
            timestamp: Date.now()
        });

        // Setze temporär auf Status 0
        vehicle.currentStatus = 0;
        this.updateVehicleDisplay(vehicle);

        console.log(`🚨 ${vehicle.callsign} sendet NOTFALL (Status 0)!`);
    }

    /**
     * Spieler sendet "J" (Sprechaufforderung)
     * @param {string} vehicleId - Fahrzeug-ID
     */
    sendSprechfreigabe(vehicleId) {
        const request = this.waitingForPermission.get(vehicleId);
        if (!request) {
            console.warn('⚠️ Keine ausstehende Sprechwunsch/Notfall-Meldung für dieses Fahrzeug');
            return;
        }

        const vehicle = game.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        // Leitstelle sendet "J"
        if (typeof addRadioMessage !== 'undefined') {
            addRadioMessage('Leitstelle', `An ${vehicle.callsign}: <strong style="color: #28a745; font-size: 18px;">J</strong> - Kommen, sprechen Sie.`, 'dispatcher');
        }

        // Fahrzeug spricht nach kurzer Verzögerung
        setTimeout(() => {
            if (typeof addRadioMessage !== 'undefined') {
                addRadioMessage(vehicle.callsign, request.message, 'vehicle');
            }

            // Status zurücksetzen nach Funkspruch
            setTimeout(() => {
                vehicle.currentStatus = request.oldStatus;
                this.updateVehicleDisplay(vehicle);
                this.waitingForPermission.delete(vehicleId);
                
                console.log(`✅ ${vehicle.callsign} Status zurück auf ${request.oldStatus}`);
            }, 2000);
        }, 800);

        console.log(`📻 Sprechfreigabe erteilt an ${vehicle.callsign}`);
    }

    /**
     * Automatische Status-Änderung mit visueller Meldung
     * @param {string} vehicleId - Fahrzeug-ID
     * @param {number} newStatus - Neuer Status
     * @param {string} reason - Optional: Grund für Statuswechsel
     */
    changeVehicleStatus(vehicleId, newStatus, reason = '') {
        const vehicle = game.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const oldStatus = vehicle.currentStatus;

        // Keine Meldung wenn Status gleich bleibt
        if (oldStatus === newStatus) return;

        // Status aktualisieren
        vehicle.currentStatus = newStatus;

        // Visuelle Status-Meldung senden
        this.sendStatusMessage(vehicle.callsign, oldStatus, newStatus, reason);

        // UI aktualisieren
        this.updateVehicleDisplay(vehicle);

        console.log(`🔄 ${vehicle.callsign}: Status ${oldStatus}→${newStatus}`);
    }

    /**
     * Generiert Nachricht für Status 5 Sprechwunsch
     * @param {object} vehicle - Fahrzeug-Objekt
     * @returns {string} Funkspruch
     */
    generateStatus5Message(vehicle) {
        const incident = game.incidents.find(i => 
            i.assignedVehicles && i.assignedVehicles.includes(vehicle.id)
        );

        // Kontextabhängige Sprechwünsche
        const messages = {
            4: [ // Anfahrt
                `${vehicle.callsign}, können Sie uns die genaue Adresse nochmal durchgeben? Kommen.`,
                `${vehicle.callsign}, benötigen Rückfrage zur Zufahrt, kommen.`,
                `${vehicle.callsign}, ist die Einsatzstelle barrierefrei erreichbar? Kommen.`
            ],
            6: [ // Vor Ort
                `${vehicle.callsign}, Patient zeigt Symptome, benötigen Rücksprache mit NEF, kommen.`,
                `${vehicle.callsign}, benötigen Nachforderung weiterer Kräfte, kommen.`,
                `${vehicle.callsign}, Lage vor Ort unklar, benötigen weitere Informationen, kommen.`
            ],
            7: [ // Patient aufgenommen
                `${vehicle.callsign}, benötigen Zielkrankenhaus-Zuweisung, kommen.`,
                `${vehicle.callsign}, Patient instabil, welche Klinik ist am nächsten? Kommen.`
            ],
            8: [ // Transport
                `${vehicle.callsign}, Verkehrslage, benötigen alternative Route, kommen.`,
                `${vehicle.callsign}, Patientenzustand verschlechtert sich, benötigen Notarzt-Konsil, kommen.`
            ]
        };

        const statusMessages = messages[vehicle.currentStatus];
        if (statusMessages && statusMessages.length > 0) {
            return statusMessages[Math.floor(Math.random() * statusMessages.length)];
        }

        // Fallback
        return `${vehicle.callsign}, benötigen Rücksprache, kommen.`;
    }

    /**
     * Prüft ob Fahrzeug auf Sprechfreigabe wartet
     * @param {string} vehicleId - Fahrzeug-ID
     * @returns {boolean} Wartet auf "J"
     */
    isWaitingForPermission(vehicleId) {
        return this.waitingForPermission.has(vehicleId);
    }

    /**
     * Holt alle Fahrzeuge die auf Sprechfreigabe warten
     * @returns {array} Fahrzeuge mit ausstehenden Sprechwünschen
     */
    getPendingTransmissions() {
        return Array.from(this.waitingForPermission.entries()).map(([vehicleId, request]) => {
            const vehicle = game.vehicles.find(v => v.id === vehicleId);
            return {
                vehicleId,
                vehicle,
                ...request
            };
        });
    }

    /**
     * Aktualisiert Fahrzeuganzeige (UI, Karte, etc.)
     * @param {object} vehicle - Fahrzeug-Objekt
     */
    updateVehicleDisplay(vehicle) {
        // Update Karten-Marker
        if (typeof updateVehicleMarkers === 'function') {
            updateVehicleMarkers();
        }

        // Update Vehicle-Liste
        if (typeof updateVehicleList === 'function') {
            updateVehicleList();
        }

        // Update Radio-Dropdown
        if (typeof updateRadioVehicleDropdown === 'function') {
            updateRadioVehicleDropdown();
        }
    }

    /**
     * Automatische Status-Workflows für Einsätze
     */
    
    /**
     * Status 2→3: Einsatz übernommen
     */
    onIncidentAssigned(vehicleId, incident) {
        this.changeVehicleStatus(vehicleId, 3, 'Einsatz übernommen');
    }

    /**
     * Status 3→4: Anfahrt zur Einsatzstelle
     */
    onDepartingToIncident(vehicleId, incident) {
        setTimeout(() => {
            this.changeVehicleStatus(vehicleId, 4, `Anfahrt nach ${incident.location}`);
        }, 500);
    }

    /**
     * Status 4→6: Ankunft Einsatzstelle
     */
    onArrivedAtScene(vehicleId) {
        this.changeVehicleStatus(vehicleId, 6, 'Vor Ort');
    }

    /**
     * Status 6→7: Patient aufgenommen
     */
    onPatientLoaded(vehicleId) {
        this.changeVehicleStatus(vehicleId, 7, 'Patient an Bord');
    }

    /**
     * Status 7→8: Anfahrt Krankenhaus
     */
    onDepartingToHospital(vehicleId, hospital) {
        this.changeVehicleStatus(vehicleId, 8, `Transport nach ${hospital}`);
    }

    /**
     * Status 8→2: Zurück zur Wache
     */
    onReturnedToStation(vehicleId) {
        this.changeVehicleStatus(vehicleId, 2, 'Einsatzbereit auf Wache');
    }

    /**
     * Zufällige Status 5 Anfragen während Einsatz (simuliert Besatzung)
     */
    triggerRandomStatus5(vehicleId) {
        const vehicle = game.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        // Nur während bestimmter Status sinnvoll
        const validStatusForRequests = [4, 6, 7, 8];
        if (!validStatusForRequests.includes(vehicle.currentStatus)) {
            return;
        }

        // Zufällige Chance (5%)
        if (Math.random() > 0.05) return;

        this.sendStatus5Request(vehicleId);
    }

    /**
     * Cleanup
     */
    cleanup() {
        this.pendingTransmissions.clear();
        this.waitingForPermission.clear();
        console.log('🧹 Unified Status System cleanup');
    }
}

// Globale Instanz
const unifiedStatusSystem = new UnifiedStatusSystem();

if (typeof window !== 'undefined') {
    window.unifiedStatusSystem = unifiedStatusSystem;
}

console.log('✅ Unified Status System v1.0 geladen');
console.log('✅ Status 0: NUR Notfälle der Besatzung');
console.log('✅ Status 5: Sprechwunsch mit "J"-Workflow');
console.log('✅ Visuelle Status-Badges mit Farbcodierung');