// =========================
// UNIFIED STATUS SYSTEM v2.3.3 - IMPROVED RADIO LOGGING FORMAT
// Das EINZIGE Status-System - Fusioniert aus allen alten Systemen
// + Status 0: NUR für Notfälle der Besatzung
// + Status 5: Für alle Anfragen Fahrzeug→Leitstelle
// + Visuelle Status-Kästchen mit Farbcodierung
// + Korrekte Workflow-Logik (Status 5/0 = Sprechwunsch)
// + ✅ Funkverkehr-Logging mit Uhrzeit im Tab "Funkverkehr"
// + ✅ TEST: Sendet Demo-Nachricht beim Laden
// + 🔧 v2.2: Robustes Vehicle-Finding (game.vehicles || GAME_DATA.vehicles)
// + 🔥 v2.3: Nutzt oldStatus-Parameter statt vehicle.currentStatus!
// + 🔥 v2.3.1: Verbesserte logStatusToRadio() mit Debug!
// + 🔥 v2.3.2: Wartet auf addRadioMessage() mit Retry!
// + 🔥 v2.3.3: VERBESSERTES FORMAT - Funkrufname ZUERST, dann Status-Kästchen!
// =========================

class UnifiedStatusSystem {
    constructor() {
        this.pendingTransmissions = new Map();
        this.waitingForPermission = new Map();
        
        console.log('📡 Unified Status System v2.3.3 initialisiert');
        console.log('🔧 Robustes Vehicle-Finding: game.vehicles || GAME_DATA.vehicles');
        console.log('🔥 Nutzt oldStatus-Parameter für korrektes Logging!');
        console.log('🔥 Wartet auf addRadioMessage() mit Retry-Logik!');
        console.log('🔥 NEUES FORMAT: Funkrufname → Status-Kästchen → Text');
        
        // ✅ TEST: Sende Demo-Nachricht nach 2 Sekunden (damit radio-feed.js geladen ist)
        setTimeout(() => this.sendTestMessage(), 2000);
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
     * ✅ TEST-FUNKTION: Sendet Demo-Nachricht
     */
    sendTestMessage() {
        if (typeof addRadioMessage !== 'undefined') {
            console.log('🎭 Sende Test-Nachricht ins Radio-System...');
            
            // Test 1: Normale Textnachricht
            addRadioMessage('System', 'Unified Status System v2.3.3 geladen und bereit!', 'system', false);
            
            // Test 2: Status-Änderung mit Kästchen - NEUES FORMAT
            setTimeout(() => {
                const transition = this.createStatusTransition(2, 4);
                const timestamp = new Date().toLocaleTimeString('de-DE');
                const messageHTML = `Florian WN 1-83-1: ${transition} <span style="margin-left: 8px; color: #a0aec0; font-style: italic;">Anfahrt zur Einsatzstelle</span>`;
                addRadioMessage('Florian WN 1-83-1', messageHTML, 'status-change', true);
            }, 1000);
            
            // Test 3: Sprechwunsch
            setTimeout(() => {
                const badge = this.createStatusBadge(5);
                const messageHTML = `Florian WN 1-47-1: ${badge} <span style="margin-left: 8px; color: #fc8181; font-weight: bold;">Sprechwunsch</span>`;
                addRadioMessage('Florian WN 1-47-1', messageHTML, 'status-5-request', true);
            }, 2000);
            
            console.log('✅ Test-Nachrichten gesendet!');
        } else {
            console.warn('⚠️ addRadioMessage() nicht verfügbar - Radio-System noch nicht geladen');
        }
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
     * 🔥 v2.3.3: VERBESSERTES FORMAT!
     * Format: FUNKRUFNAME: [Status-Alt → Status-Neu] Status-Text
     */
    async logStatusToRadio(callsign, oldStatus, newStatus, additionalText = '', retryCount = 0) {
        const MAX_RETRIES = 10;
        const RETRY_DELAY_MS = 100;
        
        console.log('🎯 logStatusToRadio() START');
        console.log(`   Callsign: ${callsign}`);
        console.log(`   Status: ${oldStatus} → ${newStatus}`);
        console.log(`   Retry: ${retryCount}/${MAX_RETRIES}`);
        
        // 🔥 PRÜFE ob addRadioMessage verfügbar ist
        if (typeof addRadioMessage === 'undefined' || typeof addRadioMessage !== 'function') {
            if (retryCount < MAX_RETRIES) {
                console.warn(`⏳ addRadioMessage() noch nicht verfügbar - Retry ${retryCount + 1}/${MAX_RETRIES} in ${RETRY_DELAY_MS}ms...`);
                setTimeout(() => {
                    this.logStatusToRadio(callsign, oldStatus, newStatus, additionalText, retryCount + 1);
                }, RETRY_DELAY_MS);
                return;
            } else {
                console.error('❌ addRadioMessage() nicht verfügbar nach 10 Retries!');
                console.error(`   typeof addRadioMessage: ${typeof addRadioMessage}`);
                return;
            }
        }
        
        console.log('✅ addRadioMessage() verfügbar!');
        
        // Erstelle Status-Übergang (farbige Kästchen mit Pfeil)
        const transition = this.createStatusTransition(oldStatus, newStatus);
        console.log(`   Transition HTML erstellt`);
        
        // Hole Status-Text aus CONFIG (falls verfügbar)
        let statusText = additionalText;
        if (!statusText && typeof CONFIG !== 'undefined' && CONFIG.getFMSStatus) {
            const statusInfo = CONFIG.getFMSStatus(newStatus);
            statusText = statusInfo ? statusInfo.name : `Status ${newStatus}`;
            console.log(`   Status-Text aus CONFIG: "${statusText}"`);
        } else if (!statusText) {
            statusText = `Status ${newStatus}`;
            console.log(`   Fallback Status-Text: "${statusText}"`);
        }
        
        // 🔥 NEUES FORMAT: Funkrufname: [Alt → Neu] Status-Text
        const messageHTML = `${callsign}: ${transition} <span style="margin-left: 8px; color: #a0aec0; font-style: italic;">${statusText}</span>`;
        
        console.log(`   messageHTML: ${messageHTML.substring(0, 100)}...`);
        
        try {
            // Sende Nachricht an Radio-System
            addRadioMessage(callsign, messageHTML, 'status-change', true);
            console.log(`📻✅ [${callsign}] Status ${oldStatus}→${newStatus} GELOGGT!`);
        } catch (error) {
            console.error('❌ FEHLER beim Aufruf von addRadioMessage():', error);
            console.error('   Stacktrace:', error.stack);
        }
        
        console.log('🎯 logStatusToRadio() ENDE');
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
        
        // 🔥 NEUES FORMAT: Funkrufname: [Badge] Sprechwunsch
        const messageHTML = `${vehicle.callsign}: ${badge} <span style="margin-left: 8px; color: #fc8181; font-weight: bold;">Sprechwunsch</span>`;
        
        if (typeof addRadioMessage !== 'undefined') {
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
        
        // 🔥 NEUES FORMAT: Funkrufname: [Badge] NOTFALL BESATZUNG!
        const messageHTML = `${vehicle.callsign}: ${badge} <span style="margin-left: 8px; color: #fc8181; font-weight: bold; text-transform: uppercase;">NOTFALL BESATZUNG!</span>`;
        
        if (typeof addRadioMessage !== 'undefined') {
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

        if (typeof addRadioMessage !== 'undefined') {
            addRadioMessage('Leitstelle', `An ${vehicle.callsign}: <strong style="color: #48bb78; font-size: 18px;">J</strong> - Kommen, sprechen Sie.`, 'dispatcher');
        }

        setTimeout(() => {
            if (typeof addRadioMessage !== 'undefined') {
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
     * 🔥 v2.3 FIX: Nutzt oldStatusOverride-Parameter!
     * @param {string} vehicleId - Fahrzeug-ID
     * @param {number} newStatus - Neuer Status
     * @param {number|undefined} oldStatusOverride - EXPLIZITER alter Status (wenn vom Caller übergeben)
     */
    changeVehicleStatus(vehicleId, newStatus, oldStatusOverride = undefined) {
        console.log(`🔄 changeVehicleStatus() aufgerufen: ${vehicleId} -> Status ${newStatus}, oldOverride: ${oldStatusOverride}`);
        
        const vehicles = this.getVehicles();
        const vehicle = vehicles.find(v => v.id === vehicleId);
        
        if (!vehicle) {
            console.error(`❌ Fahrzeug ${vehicleId} nicht gefunden!`);
            console.log(`📋 Verfügbare Fahrzeuge: ${vehicles.length}`);
            return;
        }

        // 🔥 v2.3 FIX: Nutze oldStatusOverride wenn vorhanden, sonst vehicle.currentStatus
        const oldStatus = oldStatusOverride !== undefined ? oldStatusOverride : vehicle.currentStatus;
        
        console.log(`🔍 oldStatus bestimmt: ${oldStatus} (Override: ${oldStatusOverride !== undefined ? 'JA' : 'NEIN'}`);

        if (oldStatus === newStatus) {
            console.log(`⏭️ Status gleich geblieben (${newStatus}), überspringe Logging`);
            return;
        }

        // Status ist BEREITS vom Caller geändert worden - wir loggen nur!
        console.log(`✅ Status-Wechsel erkannt: ${vehicle.callsign} ${oldStatus}→${newStatus}`);

        // ✅ Logge Status-Änderung im Funkverkehr
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

console.log('✅ Unified Status System v2.3.3 geladen');
console.log('✅ Status 0: NUR Notfälle der Besatzung');
console.log('✅ Status 5: Sprechwunsch mit "J"-Workflow');
console.log('✅ Visuelle Status-Badges mit Farbcodierung');
console.log('✅ Funkverkehr-Logging mit Uhrzeit aktiviert');
console.log('🔧 Robustes Vehicle-Finding aktiviert');
console.log('🔥 Nutzt oldStatus-Parameter für korrektes Logging!');
console.log('🔥 Wartet auf addRadioMessage() mit Retry-Logik!');
console.log('🔥 NEUES FORMAT: Funkrufname → Status-Kästchen → Text!');
console.log('🎭 Test-Nachrichten werden in 2 Sekunden gesendet...');
