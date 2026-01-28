// =========================
// UNIFIED STATUS SYSTEM v2.4.0 - PRODUCTION-READY
// Das EINZIGE Status-System - Fusioniert aus allen alten Systemen
// + Status 0: NUR für Notfälle der Besatzung
// + Status 5: Für alle Anfragen Fahrzeug→Leitstelle
// + Visuelle Status-Kästchen mit Farbcodierung
// + Korrekte Workflow-Logik (Status 5/0 = Sprechwunsch)
// + ✅ Funkverkehr-Logging mit Uhrzeit im Tab "Funkverkehr"
// + 🔧 v2.2: Robustes Vehicle-Finding (game.vehicles || GAME_DATA.vehicles)
// + 🔥 v2.3: Nutzt oldStatus-Parameter statt vehicle.currentStatus!
// + 🔥 v2.3.3: Verbessertes Format - Funkrufname ZUERST!
// + 🚀 v2.4.0: EVENT-BASIERTES SYSTEM + Production-Ready!
// =========================

class UnifiedStatusSystem {
    constructor() {
        this.pendingTransmissions = new Map();
        this.waitingForPermission = new Map();
        this.isRadioSystemReady = false;
        this.messageQueue = [];
        
        console.log('📡 Unified Status System v2.4.0 initialisiert');
        console.log('🚀 EVENT-BASIERTES SYSTEM - Keine Retries mehr!');
        console.log('🔧 Robustes Vehicle-Finding: game.vehicles || GAME_DATA.vehicles');
        console.log('🔥 Nutzt oldStatus-Parameter für korrektes Logging!');
        console.log('🔥 PRODUCTION: Test-Nachrichten deaktiviert!');
        
        // 🚀 EVENT-BASIERT: Warte auf Radio-System
        this.waitForRadioSystem();
    }

    /**
     * 🚀 EVENT-BASIERT: Wartet auf Radio-System statt Retry-Loop
     */
    waitForRadioSystem() {
        // Prüfe ob bereits verfügbar
        if (typeof addRadioMessage === 'function') {
            this.onRadioSystemReady();
            return;
        }
        
        // Höre auf Custom-Event
        document.addEventListener('radioSystemReady', () => {
            this.onRadioSystemReady();
        });
        
        // Fallback: Polling mit Timeout (max 5 Sekunden)
        let attempts = 0;
        const maxAttempts = 50;
        const pollInterval = setInterval(() => {
            attempts++;
            
            if (typeof addRadioMessage === 'function') {
                clearInterval(pollInterval);
                this.onRadioSystemReady();
            } else if (attempts >= maxAttempts) {
                clearInterval(pollInterval);
                console.warn('⚠️ Radio-System nicht verfügbar nach 5 Sekunden - Logging deaktiviert');
            }
        }, 100);
    }

    /**
     * 🚀 Callback wenn Radio-System bereit ist
     */
    onRadioSystemReady() {
        this.isRadioSystemReady = true;
        console.log('✅ Radio-System bereit - Status-Logging aktiviert!');
        
        // Arbeite Message-Queue ab
        if (this.messageQueue.length > 0) {
            console.log(`📦 Arbeite ${this.messageQueue.length} wartende Nachrichten ab...`);
            this.messageQueue.forEach(msg => {
                this.logStatusToRadioImmediate(msg.callsign, msg.oldStatus, msg.newStatus, msg.additionalText);
            });
            this.messageQueue = [];
        }
    }

    /**
     * 🔧 ROBUST: Findet Fahrzeug-Array
     */
    getVehicles() {
        if (typeof game !== 'undefined' && game.vehicles) {
            return game.vehicles;
        }
        if (typeof GAME_DATA !== 'undefined' && GAME_DATA.vehicles) {
            return GAME_DATA.vehicles;
        }
        console.error('❌ Keine Fahrzeug-Daten gefunden!');
        return [];
    }

    STATUS_COLORS = {
        0: '#ff4444',
        1: '#90ee90',
        2: '#006400',
        3: '#ffa500',
        4: '#8b0000',
        5: '#ff6666',
        6: '#808080',
        7: '#ffb6c1',
        8: '#9370db',
        'C': '#666666'
    };

    /**
     * Erstellt ein einzelnes Status-Badge
     * @param {number|string} status - Status-Code
     * @returns {string} HTML für Status-Badge
     */
    createStatusBadge(status) {
        const color = this.STATUS_COLORS[status] || '#6c757d';
        return `<span class="status-badge" style="background-color: ${color}; color: white; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 13px; display: inline-block; min-width: 32px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${status}</span>`;
    }

    /**
     * Erstellt Status-Übergang mit zwei Badges und Pfeil
     * @param {number|string} oldStatus - Alter Status
     * @param {number|string} newStatus - Neuer Status
     * @returns {string} HTML für Status-Übergang
     */
    createStatusTransition(oldStatus, newStatus) {
        const oldBadge = this.createStatusBadge(oldStatus);
        const newBadge = this.createStatusBadge(newStatus);
        const arrow = '<span style="margin: 0 6px; font-size: 16px; color: #a0aec0;">→</span>';
        
        return `<span class="status-transition" style="display: inline-flex; align-items: center; gap: 2px;">${oldBadge}${arrow}${newBadge}</span>`;
    }

    /**
     * 🚀 PRODUCTION-READY: Loggt Status ins Radio (mit Event-System)
     * Format: FUNKRUFNAME: [Status-Alt → Status-Neu] Status-Text
     */
    logStatusToRadio(callsign, oldStatus, newStatus, additionalText = '') {
        // Wenn Radio-System noch nicht bereit: In Queue packen
        if (!this.isRadioSystemReady) {
            this.messageQueue.push({ callsign, oldStatus, newStatus, additionalText });
            return;
        }
        
        this.logStatusToRadioImmediate(callsign, oldStatus, newStatus, additionalText);
    }

    /**
     * 🚀 Interne Funktion: Loggt sofort (wenn System bereit)
     */
    logStatusToRadioImmediate(callsign, oldStatus, newStatus, additionalText = '') {
        if (typeof addRadioMessage !== 'function') {
            console.warn('⚠️ addRadioMessage() nicht verfügbar - Nachricht verworfen');
            return;
        }
        
        // Erstelle Status-Übergang (farbige Kästchen mit Pfeil)
        const transition = this.createStatusTransition(oldStatus, newStatus);
        
        // Hole Status-Text aus CONFIG (falls verfügbar)
        let statusText = additionalText;
        if (!statusText && typeof CONFIG !== 'undefined' && CONFIG.getFMSStatus) {
            const statusInfo = CONFIG.getFMSStatus(newStatus);
            statusText = statusInfo ? statusInfo.name : `Status ${newStatus}`;
        } else if (!statusText) {
            statusText = `Status ${newStatus}`;
        }
        
        // 🔥 FORMAT: Funkrufname: [Alt → Neu] Status-Text
        const messageHTML = `${callsign}: ${transition} <span style="margin-left: 8px; color: #a0aec0; font-style: italic;">${statusText}</span>`;
        
        try {
            // Sende Nachricht an Radio-System
            addRadioMessage(callsign, messageHTML, 'status-change', true);
        } catch (error) {
            console.error('❌ FEHLER beim Aufruf von addRadioMessage():', error);
        }
    }

    sendStatusMessage(callsign, oldStatus, newStatus, additionalText = '') {
        this.logStatusToRadio(callsign, oldStatus, newStatus, additionalText);
    }

    /**
     * Sendet Status-5-Anfrage (Sprechwunsch)
     */
    sendStatus5Request(vehicleId, message = null) {
        const vehicles = this.getVehicles();
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            console.error(`❌ Fahrzeug ${vehicleId} nicht gefunden!`);
            return;
        }

        const oldStatus = vehicle.currentStatus;
        
        const badge = this.createStatusBadge(5);
        
        // 🔥 FORMAT: Funkrufname: [Badge] Sprechwunsch
        const messageHTML = `${vehicle.callsign}: ${badge} <span style="margin-left: 8px; color: #fc8181; font-weight: bold;">Sprechwunsch</span>`;
        
        if (this.isRadioSystemReady && typeof addRadioMessage === 'function') {
            addRadioMessage(vehicle.callsign, messageHTML, 'status-5-request', true);
        }

        this.waitingForPermission.set(vehicleId, {
            type: 'status5',
            oldStatus,
            message: message || this.generateStatus5Message(vehicle),
            timestamp: Date.now()
        });

        vehicle.currentStatus = 5;
        this.updateVehicleDisplay(vehicle);

        console.log(`📞 ${vehicle.callsign} meldet Sprechwunsch (Status 5)`);
    }

    /**
     * Sendet Status-0-Notfall (Besatzungsnotfall)
     */
    sendStatus0Emergency(vehicleId, emergencyReason = 'Notlage!') {
        const vehicles = this.getVehicles();
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            console.error(`❌ Fahrzeug ${vehicleId} nicht gefunden!`);
            return;
        }

        const oldStatus = vehicle.currentStatus;
        
        const badge = this.createStatusBadge(0);
        
        // 🔥 FORMAT: Funkrufname: [Badge] NOTFALL BESATZUNG!
        const messageHTML = `${vehicle.callsign}: ${badge} <span style="margin-left: 8px; color: #fc8181; font-weight: bold; text-transform: uppercase;">NOTFALL BESATZUNG!</span>`;
        
        if (this.isRadioSystemReady && typeof addRadioMessage === 'function') {
            addRadioMessage(vehicle.callsign, messageHTML, 'status-0-emergency', true);
            
            if (typeof playSound !== 'undefined') {
                playSound('emergency');
            }
        }

        this.waitingForPermission.set(vehicleId, {
            type: 'status0',
            oldStatus,
            message: emergencyReason,
            timestamp: Date.now()
        });

        vehicle.currentStatus = 0;
        this.updateVehicleDisplay(vehicle);

        console.log(`🚨 ${vehicle.callsign} sendet NOTFALL (Status 0)!`);
    }

    /**
     * Erteilt Sprechfreigabe ("J")
     */
    sendSprechfreigabe(vehicleId) {
        const request = this.waitingForPermission.get(vehicleId);
        if (!request) {
            console.warn('⚠️ Keine ausstehende Sprechwunsch/Notfall-Meldung für dieses Fahrzeug');
            return;
        }

        const vehicles = this.getVehicles();
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        if (this.isRadioSystemReady && typeof addRadioMessage === 'function') {
            addRadioMessage('Leitstelle', `An ${vehicle.callsign}: <strong style="color: #48bb78; font-size: 18px;">J</strong> - Kommen, sprechen Sie.`, 'dispatcher');
        }

        setTimeout(() => {
            if (this.isRadioSystemReady && typeof addRadioMessage === 'function') {
                addRadioMessage(vehicle.callsign, request.message, 'vehicle');
            }

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
     * 🎯 HAUPTFUNKTION: Automatische Status-Änderung mit Chat-Logging
     * @param {string} vehicleId - Fahrzeug-ID
     * @param {number} newStatus - Neuer Status
     * @param {number|undefined} oldStatusOverride - EXPLIZITER alter Status (wenn vom Caller übergeben)
     */
    changeVehicleStatus(vehicleId, newStatus, oldStatusOverride = undefined) {
        const vehicles = this.getVehicles();
        const vehicle = vehicles.find(v => v.id === vehicleId);
        
        if (!vehicle) {
            console.error(`❌ Fahrzeug ${vehicleId} nicht gefunden!`);
            return;
        }

        // Nutze oldStatusOverride wenn vorhanden, sonst vehicle.currentStatus
        const oldStatus = oldStatusOverride !== undefined ? oldStatusOverride : vehicle.currentStatus;

        if (oldStatus === newStatus) {
            return;
        }

        // Logge Status-Änderung im Funkverkehr
        this.logStatusToRadio(vehicle.callsign, oldStatus, newStatus, '');

        // UI aktualisieren
        this.updateVehicleDisplay(vehicle);
    }

    /**
     * Generiert realistische Status-5-Nachricht
     */
    generateStatus5Message(vehicle) {
        const vehicles = this.getVehicles();
        const incidents = typeof game !== 'undefined' && game.incidents ? game.incidents : 
                        (typeof GAME_DATA !== 'undefined' && GAME_DATA.incidents ? GAME_DATA.incidents : []);
        
        const incident = incidents.find(i => 
            i.assignedVehicles && i.assignedVehicles.includes(vehicle.id)
        );

        const messages = {
            4: [
                `${vehicle.callsign}, können Sie uns die genaue Adresse nochmal durchgeben? Kommen.`,
                `${vehicle.callsign}, benötigen Rückfrage zur Zufahrt, kommen.`,
                `${vehicle.callsign}, ist die Einsatzstelle barrierefrei erreichbar? Kommen.`
            ],
            6: [
                `${vehicle.callsign}, Patient zeigt Symptome, benötigen Rücksprache mit NEF, kommen.`,
                `${vehicle.callsign}, benötigen Nachforderung weiterer Kräfte, kommen.`,
                `${vehicle.callsign}, Lage vor Ort unklar, benötigen weitere Informationen, kommen.`
            ],
            7: [
                `${vehicle.callsign}, benötigen Zielkrankenhaus-Zuweisung, kommen.`,
                `${vehicle.callsign}, Patient instabil, welche Klinik ist am nächsten? Kommen.`
            ],
            8: [
                `${vehicle.callsign}, Verkehrslage, benötigen alternative Route, kommen.`,
                `${vehicle.callsign}, Patientenzustand verschlechtert sich, benötigen Notarzt-Konsil, kommen.`
            ]
        };

        const statusMessages = messages[vehicle.currentStatus];
        if (statusMessages && statusMessages.length > 0) {
            return statusMessages[Math.floor(Math.random() * statusMessages.length)];
        }

        return `${vehicle.callsign}, benötigen Rücksprache, kommen.`;
    }

    isWaitingForPermission(vehicleId) {
        return this.waitingForPermission.has(vehicleId);
    }

    getPendingTransmissions() {
        const vehicles = this.getVehicles();
        return Array.from(this.waitingForPermission.entries()).map(([vehicleId, request]) => {
            const vehicle = vehicles.find(v => v.id === vehicleId);
            return {
                vehicleId,
                vehicle,
                ...request
            };
        });
    }

    updateVehicleDisplay(vehicle) {
        if (typeof updateVehicleMarkers === 'function') {
            updateVehicleMarkers();
        }

        if (typeof updateVehicleList === 'function') {
            updateVehicleList();
        }

        if (typeof updateRadioVehicleDropdown === 'function') {
            updateRadioVehicleDropdown();
        }
    }

    // Event-Handler für Status-Änderungen
    onIncidentAssigned(vehicleId, incident) {
        this.changeVehicleStatus(vehicleId, 3, undefined);
    }

    onDepartingToIncident(vehicleId, incident) {
        setTimeout(() => {
            this.changeVehicleStatus(vehicleId, 4, undefined);
        }, 500);
    }

    onArrivedAtScene(vehicleId) {
        this.changeVehicleStatus(vehicleId, 6, undefined);
    }

    onPatientLoaded(vehicleId) {
        this.changeVehicleStatus(vehicleId, 7, undefined);
    }

    onDepartingToHospital(vehicleId, hospital) {
        this.changeVehicleStatus(vehicleId, 8, undefined);
    }

    onReturnedToStation(vehicleId) {
        this.changeVehicleStatus(vehicleId, 2, undefined);
    }

    triggerRandomStatus5(vehicleId) {
        const vehicles = this.getVehicles();
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const validStatusForRequests = [4, 6, 7, 8];
        if (!validStatusForRequests.includes(vehicle.currentStatus)) {
            return;
        }

        if (Math.random() > 0.05) return;

        this.sendStatus5Request(vehicleId);
    }

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
    window.UnifiedStatusSystem = UnifiedStatusSystem;
}

console.log('✅ Unified Status System v2.4.0 geladen');
console.log('✅ Status 0: NUR Notfälle der Besatzung');
console.log('✅ Status 5: Sprechwunsch mit "J"-Workflow');
console.log('✅ Visuelle Status-Badges mit Farbcodierung');
console.log('🚀 EVENT-BASIERTES SYSTEM - Production-Ready!');
console.log('🔧 Robustes Vehicle-Finding aktiviert');
console.log('🔥 OPTIMIERTES FORMAT: Funkrufname → Status-Kästchen → Text!');
