// =========================
// UNIFIED STATUS SYSTEM v2.2 - MIT ROBUSTEM VEHICLE-FINDING
// Das EINZIGE Status-System - Fusioniert aus allen alten Systemen
// + Status 0: NUR für Notfälle der Besatzung
// + Status 5: Für alle Anfragen Fahrzeug→Leitstelle
// + Visuelle Status-Kästchen mit Farbcodierung
// + Korrekte Workflow-Logik (Status 5/0 = Sprechwunsch)
// + ✅ Funkverkehr-Logging mit Uhrzeit im Tab "Funkverkehr"
// + ✅ TEST: Sendet Demo-Nachricht beim Laden
// + 🔧 v2.2: Robustes Vehicle-Finding (game.vehicles || GAME_DATA.vehicles)
// =========================

class UnifiedStatusSystem {
    constructor() {
        this.pendingTransmissions = new Map();
        this.waitingForPermission = new Map();
        
        console.log('📡 Unified Status System v2.2 initialisiert');
        console.log('🔧 Robustes Vehicle-Finding: game.vehicles || GAME_DATA.vehicles');
        
        // ✅ TEST: Sende Demo-Nachricht nach 2 Sekunden
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
            addRadioMessage('System', 'Unified Status System v2.2 geladen und bereit!', 'system', false);
            
            // Test 2: Status-Änderung mit Kästchen
            setTimeout(() => {
                const transition = this.createStatusTransition(2, 4);
                const messageHTML = `<span style="color: #6c757d; margin-right: 8px;">[10:00:00]</span> Florian WN 1-83-1: ${transition} <span style="margin-left: 8px; color: #6c757d;">Anfahrt nach Hauptstraße 42</span>`;
                addRadioMessage('Florian WN 1-83-1', messageHTML, 'status-change', true);
            }, 1000);
            
            // Test 3: Sprechwunsch
            setTimeout(() => {
                const badge = this.createStatusBadge(5);
                const messageHTML = `<span style="color: #6c757d; margin-right: 8px;">[10:05:30]</span> Florian WN 1-47-1: ${badge} <span style="margin-left: 8px; color: #dc3545; font-weight: bold;">Sprechwunsch</span>`;
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

    createStatusBadge(status) {
        const color = this.STATUS_COLORS[status] || '#6c757d';
        return `<span class="status-badge" style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block; min-width: 28px; text-align: center;">${status}</span>`;
    }

    createStatusTransition(oldStatus, newStatus) {
        const oldBadge = this.createStatusBadge(oldStatus);
        const newBadge = this.createStatusBadge(newStatus);
        const arrow = '<span style="margin: 0 8px; font-size: 16px;">→</span>';
        
        return `<div class="status-transition" style="display: inline-flex; align-items: center;">${oldBadge}${arrow}${newBadge}</div>`;
    }

    logStatusToRadio(callsign, oldStatus, newStatus, additionalText = '') {
        const timestamp = window.GameTime ? 
            window.GameTime.simulated.toLocaleTimeString('de-DE') : 
            new Date().toLocaleTimeString('de-DE');
        
        const transition = this.createStatusTransition(oldStatus, newStatus);
        
        // Versuche Status-Info zu holen
        let text = additionalText;
        if (!text && typeof CONFIG !== 'undefined' && CONFIG.getFMSStatus) {
            const statusInfo = CONFIG.getFMSStatus(newStatus);
            text = statusInfo ? statusInfo.shortName : `Status ${newStatus}`;
        }
        
        const messageHTML = `<span style="color: #6c757d; margin-right: 8px;">[${timestamp}]</span> ${callsign}: ${transition} <span style="margin-left: 8px; color: #6c757d;">${text}</span>`;
        
        if (typeof addRadioMessage !== 'undefined') {
            addRadioMessage(callsign, messageHTML, 'status-change', true);
            console.log(`📻✅ [${timestamp}] ${callsign}: Status ${oldStatus}→${newStatus} GELOGGT!`);
        } else {
            console.error('❌ addRadioMessage() nicht verfügbar!');
        }
    }

    sendStatusMessage(callsign, oldStatus, newStatus, additionalText = '') {
        this.logStatusToRadio(callsign, oldStatus, newStatus, additionalText);
    }

    sendStatus5Request(vehicleId, message = null) {
        const vehicles = this.getVehicles();
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            console.error(`❌ Fahrzeug ${vehicleId} nicht gefunden!`);
            return;
        }

        const oldStatus = vehicle.currentStatus;
        
        const timestamp = window.GameTime ? 
            window.GameTime.simulated.toLocaleTimeString('de-DE') : 
            new Date().toLocaleTimeString('de-DE');
        
        const badge = this.createStatusBadge(5);
        
        const messageHTML = `<span style="color: #6c757d; margin-right: 8px;">[${timestamp}]</span> ${vehicle.callsign}: ${badge} <span style="margin-left: 8px; color: #dc3545; font-weight: bold;">Sprechwunsch</span>`;
        
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

        console.log(`📞 [${timestamp}] ${vehicle.callsign} meldet Sprechwunsch (Status 5)`);
    }

    sendStatus0Emergency(vehicleId, emergencyReason = 'Notlage!') {
        const vehicles = this.getVehicles();
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            console.error(`❌ Fahrzeug ${vehicleId} nicht gefunden!`);
            return;
        }

        const oldStatus = vehicle.currentStatus;
        
        const timestamp = window.GameTime ? 
            window.GameTime.simulated.toLocaleTimeString('de-DE') : 
            new Date().toLocaleTimeString('de-DE');
        
        const badge = this.createStatusBadge(0);
        
        const messageHTML = `<span style="color: #6c757d; margin-right: 8px;">[${timestamp}]</span> ${vehicle.callsign}: ${badge} <span style="margin-left: 8px; color: #dc3545; font-weight: bold; text-transform: uppercase;">NOTFALL BESATZUNG!</span>`;
        
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

        console.log(`🚨 [${timestamp}] ${vehicle.callsign} sendet NOTFALL (Status 0)!`);
    }

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
            addRadioMessage('Leitstelle', `An ${vehicle.callsign}: <strong style="color: #28a745; font-size: 18px;">J</strong> - Kommen, sprechen Sie.`, 'dispatcher');
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
     * @param {string} vehicleId - Fahrzeug-ID
     * @param {number} newStatus - Neuer Status
     * @param {string} reason - Optional: Grund für Statuswechsel
     */
    changeVehicleStatus(vehicleId, newStatus, reason = '') {
        console.log(`🔄 changeVehicleStatus() aufgerufen: ${vehicleId} -> Status ${newStatus}`);
        
        const vehicles = this.getVehicles();
        const vehicle = vehicles.find(v => v.id === vehicleId);
        
        if (!vehicle) {
            console.error(`❌ Fahrzeug ${vehicleId} nicht gefunden!`);
            console.log(`📋 Verfügbare Fahrzeuge: ${vehicles.length}`);
            return;
        }

        const oldStatus = vehicle.currentStatus;

        if (oldStatus === newStatus) {
            console.log(`⏭️ Status gleich geblieben (${newStatus}), überspringe Logging`);
            return;
        }

        // Status aktualisieren
        vehicle.currentStatus = newStatus;
        console.log(`✅ Status aktualisiert: ${vehicle.callsign} ${oldStatus}→${newStatus}`);

        // ✅ Logge Status-Änderung im Funkverkehr mit Uhrzeit
        this.logStatusToRadio(vehicle.callsign, oldStatus, newStatus, reason);

        // UI aktualisieren
        this.updateVehicleDisplay(vehicle);
    }

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

    onIncidentAssigned(vehicleId, incident) {
        this.changeVehicleStatus(vehicleId, 3, 'Einsatz übernommen');
    }

    onDepartingToIncident(vehicleId, incident) {
        setTimeout(() => {
            this.changeVehicleStatus(vehicleId, 4, `Anfahrt nach ${incident.location}`);
        }, 500);
    }

    onArrivedAtScene(vehicleId) {
        this.changeVehicleStatus(vehicleId, 6, 'Vor Ort');
    }

    onPatientLoaded(vehicleId) {
        this.changeVehicleStatus(vehicleId, 7, 'Patient an Bord');
    }

    onDepartingToHospital(vehicleId, hospital) {
        this.changeVehicleStatus(vehicleId, 8, `Transport nach ${hospital}`);
    }

    onReturnedToStation(vehicleId) {
        this.changeVehicleStatus(vehicleId, 2, 'Einsatzbereit auf Wache');
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

console.log('✅ Unified Status System v2.2 geladen');
console.log('✅ Status 0: NUR Notfälle der Besatzung');
console.log('✅ Status 5: Sprechwunsch mit "J"-Workflow');
console.log('✅ Visuelle Status-Badges mit Farbcodierung');
console.log('✅ Funkverkehr-Logging mit Uhrzeit aktiviert');
console.log('🔧 Robustes Vehicle-Finding aktiviert');
console.log('🎭 Test-Nachrichten werden in 2 Sekunden gesendet...');
