// =========================
// STATUS 0/5 SYSTEM v1.0
// Fahrzeug-Rückmeldungen mit Status 0 und 5
// =========================

class Status05System {
    constructor() {
        this.pendingRequests = new Map(); // vehicleId -> {type, timestamp, incident}
        this.autoResponseDelay = 2000; // 2 Sekunden bis automatische Antwort
    }

    /**
     * Sendet Statusanfrage an Fahrzeug (Status 0)
     * @param {string} vehicleId - Fahrzeug-ID
     * @param {string} type - Anfrage-Typ: 'status', 'eta', 'situation', 'request'
     */
    async sendStatusRequest(vehicleId, type = 'status') {
        const vehicle = game.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            console.error('Fahrzeug nicht gefunden:', vehicleId);
            return;
        }

        // Prüfe ob Fahrzeug erreichbar ist
        if (vehicle.status === 2) {
            addRadioMessage('Leitstelle', `${vehicle.callsign} ist nicht erreichbar (Status 2).`, 'error');
            return;
        }

        // Sende Statusanfrage
        const requestMessages = {
            status: `${vehicle.callsign}, bitte Status melden, kommen.`,
            eta: `${vehicle.callsign}, bitte ETA durchgeben, kommen.`,
            situation: `${vehicle.callsign}, bitte Lage vor Ort durchgeben, kommen.`,
            request: `${vehicle.callsign}, bitte Rückmeldung, kommen.`
        };

        const message = requestMessages[type] || requestMessages.status;
        addRadioMessage('Leitstelle', message, 'dispatcher');

        // Setze Fahrzeug kurz auf Status 0 (Anfrage)
        const originalStatus = vehicle.status;
        vehicle.status = 0;
        this.updateVehicleDisplay(vehicle, 0);

        // Speichere Anfrage
        const incident = game.incidents.find(i => 
            i.assignedVehicles && i.assignedVehicles.includes(vehicleId)
        );

        this.pendingRequests.set(vehicleId, {
            type,
            timestamp: Date.now(),
            incident,
            originalStatus
        });

        // Warte auf Antwort (automatisch nach 2 Sekunden wenn nicht manuell)
        setTimeout(() => {
            if (this.pendingRequests.has(vehicleId)) {
                this.sendAutoResponse(vehicleId);
            }
        }, this.autoResponseDelay);
    }

    /**
     * Sendet automatische Antwort mit Status 5
     */
    async sendAutoResponse(vehicleId) {
        const request = this.pendingRequests.get(vehicleId);
        if (!request) return;

        const vehicle = game.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        // Setze Fahrzeug auf Status 5 (Sprechwunsch)
        vehicle.status = 5;
        this.updateVehicleDisplay(vehicle, 5);

        // Generiere kontextabhängige Antwort
        const response = await this.generateResponse(vehicle, request);

        // Sende Antwort
        setTimeout(() => {
            addRadioMessage(vehicle.callsign, response, 'vehicle');

            // Setze Status zurück nach 3 Sekunden
            setTimeout(() => {
                vehicle.status = request.originalStatus;
                this.updateVehicleDisplay(vehicle, request.originalStatus);
                this.pendingRequests.delete(vehicleId);
            }, 3000);
        }, 500);
    }

    /**
     * Generiert kontextabhängige Antwort
     */
    async generateResponse(vehicle, request) {
        const { type, incident } = request;
        const statusInfo = CONFIG.FMS_STATUS[request.originalStatus] || { name: 'Unbekannt' };

        switch(type) {
            case 'status':
                return `${vehicle.callsign}, Status ${request.originalStatus} - ${statusInfo.name}, kommen.`;

            case 'eta':
                if (vehicle.eta) {
                    const minutes = Math.ceil(vehicle.eta / 60);
                    return `${vehicle.callsign}, ETA ${minutes} Minuten, kommen.`;
                } else if (request.originalStatus === 6) {
                    return `${vehicle.callsign}, bereits vor Ort, kommen.`;
                } else {
                    return `${vehicle.callsign}, keine ETA verfügbar, kommen.`;
                }

            case 'situation':
                if (request.originalStatus === 6 && incident) {
                    const situations = [
                        `${vehicle.callsign}, Patient wird versorgt, weitere Details folgen, kommen.`,
                        `${vehicle.callsign}, Situation unter Kontrolle, Versorgung läuft, kommen.`,
                        `${vehicle.callsign}, vor Ort, Erstversorgung in Arbeit, kommen.`,
                        `${vehicle.callsign}, Patient angetroffen, beginnen mit Maßnahmen, kommen.`
                    ];
                    return situations[Math.floor(Math.random() * situations.length)];
                } else {
                    return `${vehicle.callsign}, noch nicht vor Ort, kommen.`;
                }

            case 'request':
            default:
                return `${vehicle.callsign}, kommen.`;
        }
    }

    /**
     * Manueller Sprechwunsch von Fahrzeug
     */
    initiateVehicleRequest(vehicleId) {
        const vehicle = game.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        // Setze auf Status 5
        const originalStatus = vehicle.status;
        vehicle.status = 5;
        this.updateVehicleDisplay(vehicle, 5);

        // Sende Sprechwunsch
        addRadioMessage(vehicle.callsign, `${vehicle.callsign} an Leitstelle, Sprechwunsch, kommen.`, 'vehicle');

        // Markiere als ausstehende Anfrage
        const incident = game.incidents.find(i => 
            i.assignedVehicles && i.assignedVehicles.includes(vehicleId)
        );

        this.pendingRequests.set(vehicleId, {
            type: 'vehicle-request',
            timestamp: Date.now(),
            incident,
            originalStatus
        });

        // Warte auf Rückmeldung durch Leitstelle
        // Status wird manuell durch acknowledgeVehicleRequest zurückgesetzt
    }

    /**
     * Bestätigt Sprechwunsch und setzt Status zurück
     */
    acknowledgeVehicleRequest(vehicleId) {
        const request = this.pendingRequests.get(vehicleId);
        if (!request) return;

        const vehicle = game.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        // Sende Bestätigung
        addRadioMessage('Leitstelle', `${vehicle.callsign}, kommen, höre.`, 'dispatcher');

        // Setze Status zurück nach kurzer Verzögerung
        setTimeout(() => {
            vehicle.status = request.originalStatus;
            this.updateVehicleDisplay(vehicle, request.originalStatus);
            this.pendingRequests.delete(vehicleId);
        }, 1000);
    }

    /**
     * Aktualisiert Fahrzeuganzeige
     */
    updateVehicleDisplay(vehicle, status) {
        // Update Karten-Marker
        if (typeof updateVehicleMarkers === 'function') {
            updateVehicleMarkers();
        }

        // Update UI
        if (typeof updateRadioVehicleDropdown === 'function') {
            updateRadioVehicleDropdown();
        }

        console.log(`📻 ${vehicle.callsign} Status: ${status}`);
    }

    /**
     * Prüft ob Fahrzeug Status-Anfrage ausstehend hat
     */
    hasPendingRequest(vehicleId) {
        return this.pendingRequests.has(vehicleId);
    }

    /**
     * Holt alle aussstehenden Anfragen
     */
    getPendingRequests() {
        return Array.from(this.pendingRequests.entries()).map(([vehicleId, request]) => {
            const vehicle = game.vehicles.find(v => v.id === vehicleId);
            return {
                vehicleId,
                vehicle,
                ...request
            };
        });
    }

    /**
     * Bricht Anfrage ab
     */
    cancelRequest(vehicleId) {
        const request = this.pendingRequests.get(vehicleId);
        if (!request) return;

        const vehicle = game.vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            vehicle.status = request.originalStatus;
            this.updateVehicleDisplay(vehicle, request.originalStatus);
        }

        this.pendingRequests.delete(vehicleId);
        console.log(`❌ Status-Anfrage abgebrochen: ${vehicle?.callsign}`);
    }
}

// Globale Instanz
const status05System = new Status05System();

if (typeof window !== 'undefined') {
    window.status05System = status05System;
}

console.log('✅ Status 0/5 System geladen');