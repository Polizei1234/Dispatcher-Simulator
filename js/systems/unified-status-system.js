// =========================
// UNIFIED STATUS SYSTEM v2.4.3 - PRODUCTION-READY
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
// + 🐛 v2.4.1: FIX - updateRadioVehicleDropdown nur wenn Element existiert
// + 🎯 v2.4.2: FIX - Fahrzeugnummern im Funk-Tab anzeigen!
// + ✅ v2.4.3: FIX - Status-Badges werden jetzt korrekt angezeigt!
// =========================

class UnifiedStatusSystem {
    constructor() {
        this.pendingTransmissions = new Map();
        this.waitingForPermission = new Map();
        this.isRadioSystemReady = false;
        this.messageQueue = [];
        
        console.log('📡 Unified Status System v2.4.3 initialisiert');
        console.log('🚀 EVENT-BASIERTES SYSTEM - Keine Retries mehr!');
        console.log('🔧 Robustes Vehicle-Finding: game.vehicles || GAME_DATA.vehicles');
        console.log('🔥 Nutzt oldStatus-Parameter für korrektes Logging!');
        console.log('🔥 PRODUCTION: Test-Nachrichten deaktiviert!');
        console.log('🐛 FIX: Prüft ob Dropdown existiert vor Update');
        console.log('🎯 FIX: Fahrzeugnummern werden jetzt im Funk-Tab angezeigt!');
        console.log('✅ FIX: Status-Badges werden jetzt korrekt im Body angezeigt!');
        
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
                this.logStatusToRadioImmediate(msg.displayCallsign, msg.oldStatus, msg.newStatus, msg.additionalText);
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

    /**
     * 🎯 Extrahiert vollständige Anzeige-Kennung aus Fahrzeugnamen
     * Format: "Nummer Rufname" (z.B. "4/82-1 Rotkreuz Rems Murr")
     * @param {Object} vehicle - Fahrzeug-Objekt
     * @returns {string} Vollständige Anzeige-Kennung
     */
    getDisplayCallsign(vehicle) {
        if (!vehicle) return 'Unbekannt';
        
        // Fahrzeugname enthält bereits die vollständige Kennung
        // z.B. "RTW Rotkreuz Rems Murr 1/83-2" oder "NEF Rotkreuz Rems Murr 4/82-1"
        const name = vehicle.name || vehicle.callsign || 'Unbekannt';
        
        // Extrahiere Nummer und Rufname
        // Muster: "Typ Organisation Nummer"
        // Wir wollen: "Nummer Rufname"
        const match = name.match(/([\d\/\-]+)\s*$/);
        
        if (match) {
            const number = match[1]; // z.B. "4/82-1"
            // Entferne den Fahrzeugtyp am Anfang (RTW, NEF, KTW, etc.)
            const withoutType = name.replace(/^(RTW|NEF|KTW|Kdow|GW-San)\s+/, '');
            // Entferne die Nummer am Ende
            const orgName = withoutType.replace(/\s+[\d\/\-]+\s*$/, '').trim();
            
            return `${number} ${orgName}`;
        }
        
        // Fallback: Verwende den vollständigen Namen
        return name;
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
     * Format:
     * - Sender (Header): Nur die Fahrzeugkennung
     * - Message (Body): Status-Übergang + Text
     */
    logStatusToRadio(displayCallsign, oldStatus, newStatus, additionalText = '') {
        // Wenn Radio-System noch nicht bereit: In Queue packen
        if (!this.isRadioSystemReady) {
            this.messageQueue.push({ displayCallsign, oldStatus, newStatus, additionalText });
            return;
        }
        
        this.logStatusToRadioImmediate(displayCallsign, oldStatus, newStatus, additionalText);
    }

    /**
     * 🚀 Interne Funktion: Loggt sofort (wenn System bereit)
     */
    logStatusToRadioImmediate(displayCallsign, oldStatus, newStatus, additionalText = '') {
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
        
        // ✅ KORRIGIERTES FORMAT:
        // - Sender: Nur Kennung (erscheint im Header)
        // - Message: Status-Badges + Text (erscheint im Body)
        const messageHTML = `${transition} <span style="margin-left: 8px; color: #cbd5e0;">${statusText}</span>`;
        
        try {
            // Sende Nachricht an Radio-System
            // Parameter: sender (Header), message (Body), type, isHTML
            addRadioMessage(displayCallsign, messageHTML, 'status-change', true);
        } catch (error) {
            console.error('❌ FEHLER beim Aufruf von addRadioMessage():', error);
        }
    }

    sendStatusMessage(vehicle, oldStatus, newStatus, additionalText = '') {
        const displayCallsign = this.getDisplayCallsign(vehicle);
        this.logStatusToRadio(displayCallsign, oldStatus, newStatus, additionalText);
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
        const displayCallsign = this.getDisplayCallsign(vehicle);
        
        const badge = this.createStatusBadge(5);
        
        // ✅ KORRIGIERTES FORMAT: Nur Badge + Text im Body
        const messageHTML = `${badge} <span style="margin-left: 8px; color: #fc8181; font-weight: bold;">Sprechwunsch</span>`;
        
        if (this.isRadioSystemReady && typeof addRadioMessage === 'function') {
            addRadioMessage(displayCallsign, messageHTML, 'status-5-request', true);
        }

        this.waitingForPermission.set(vehicleId, {
            type: 'status5',
            oldStatus,
            message: message || this.generateStatus5Message(vehicle),
            timestamp: Date.now()
        });

        vehicle.currentStatus = 5;
        this.updateVehicleDisplay(vehicle);

        console.log(`📞 ${displayCallsign} meldet Sprechwunsch (Status 5)`);
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
        const displayCallsign = this.getDisplayCallsign(vehicle);
        
        const badge = this.createStatusBadge(0);
        
        // ✅ KORRIGIERTES FORMAT: Nur Badge + Text im Body
        const messageHTML = `${badge} <span style="margin-left: 8px; color: #fc8181; font-weight: bold; text-transform: uppercase;">NOTFALL BESATZUNG!</span>`;
        
        if (this.isRadioSystemReady && typeof addRadioMessage === 'function') {
            addRadioMessage(displayCallsign, messageHTML, 'status-0-emergency', true);
            
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

        console.log(`🚨 ${displayCallsign} sendet NOTFALL (Status 0)!`);
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

        const displayCallsign = this.getDisplayCallsign(vehicle);

        if (this.isRadioSystemReady && typeof addRadioMessage === 'function') {
            addRadioMessage('Leitstelle', `An ${displayCallsign}: <strong style="color: #48bb78; font-size: 18px;">J</strong> - Kommen, sprechen Sie.`, 'dispatcher');
        }

        setTimeout(() => {
            if (this.isRadioSystemReady && typeof addRadioMessage === 'function') {
                addRadioMessage(displayCallsign, request.message, 'vehicle');
            }

            setTimeout(() => {
                vehicle.currentStatus = request.oldStatus;
                this.updateVehicleDisplay(vehicle);
                this.waitingForPermission.delete(vehicleId);
                
                console.log(`✅ ${displayCallsign} Status zurück auf ${request.oldStatus}`);
            }, 2000);
        }, 800);

        console.log(`📻 Sprechfreigabe erteilt an ${displayCallsign}`);
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

        // Hole vollständige Kennung
        const displayCallsign = this.getDisplayCallsign(vehicle);

        // Logge Status-Änderung im Funkverkehr
        this.logStatusToRadio(displayCallsign, oldStatus, newStatus, '');

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

        const displayCallsign = this.getDisplayCallsign(vehicle);

        const messages = {
            4: [
                `Können Sie uns die genaue Adresse nochmal durchgeben? Kommen.`,
                `Benötigen Rückfrage zur Zufahrt, kommen.`,
                `Ist die Einsatzstelle barrierefrei erreichbar? Kommen.`
            ],
            6: [
                `Patient zeigt Symptome, benötigen Rücksprache mit NEF, kommen.`,
                `Benötigen Nachforderung weiterer Kräfte, kommen.`,
                `Lage vor Ort unklar, benötigen weitere Informationen, kommen.`
            ],
            7: [
                `Benötigen Zielkrankenhaus-Zuweisung, kommen.`,
                `Patient instabil, welche Klinik ist am nächsten? Kommen.`
            ],
            8: [
                `Verkehrslage, benötigen alternative Route, kommen.`,
                `Patientenzustand verschlechtert sich, benötigen Notarzt-Konsil, kommen.`
            ]
        };

        const statusMessages = messages[vehicle.currentStatus];
        if (statusMessages && statusMessages.length > 0) {
            return statusMessages[Math.floor(Math.random() * statusMessages.length)];
        }

        return `Benötigen Rücksprache, kommen.`;
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

    /**
     * 🐛 FIX: Aktualisiert Vehicle-Display nur wenn Elemente existieren
     */
    updateVehicleDisplay(vehicle) {
        if (typeof updateVehicleMarkers === 'function') {
            updateVehicleMarkers();
        }

        if (typeof updateVehicleList === 'function') {
            updateVehicleList();
        }

        // 🐛 NUR wenn Dropdown existiert!
        if (typeof updateRadioVehicleDropdown === 'function') {
            const dropdown = document.getElementById('radio-vehicle-dropdown');
            if (dropdown) {
                updateRadioVehicleDropdown();
            }
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

console.log('✅ Unified Status System v2.4.3 geladen');
console.log('✅ Status 0: NUR Notfälle der Besatzung');
console.log('✅ Status 5: Sprechwunsch mit "J"-Workflow');
console.log('✅ Visuelle Status-Badges mit Farbcodierung');
console.log('🚀 EVENT-BASIERTES SYSTEM - Production-Ready!');
console.log('🔧 Robustes Vehicle-Finding aktiviert');
console.log('🎯 Fahrzeugnummern im Header, Status-Badges im Body!');
console.log('✅ FIX: Status-Änderungen werden jetzt korrekt angezeigt!');