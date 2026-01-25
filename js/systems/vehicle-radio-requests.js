// =========================
// FAHRZEUG FUNK-ANFRAGEN SYSTEM v1.1
// Status 0 (Notfall) & Status 5 (Sprechwunsch)
// + ✅ Nutzt CONFIG.RADIO Konstanten
// + ✅ Korrekte FMS-Status-Prüfung
// =========================

class VehicleRadioRequests {
    constructor() {
        this.activeRequests = new Map(); // vehicleId -> request
        this.requestTypes = {
            EMERGENCY: 'emergency',           // Status 0 - Notfall!
            HOSPITAL_ASSIGNMENT: 'hospital',  // Klinikzuweisung
            REINFORCEMENT: 'reinforcement',   // Verstärkung
            INFO_REQUEST: 'info',             // Zusatzinfos
            MATERIAL: 'material',             // Material nachfordern
            GENERAL: 'general'                // Allgemeine Rückfrage
        };
        
        // ✅ Nutze CONFIG statt Magic Numbers
        this.requestChance = CONFIG.RADIO.REQUEST_CHANCE;
        this.checkInterval = CONFIG.RADIO.CHECK_INTERVAL_MS;
        this.emergencyChance = CONFIG.RADIO.EMERGENCY_CHANCE;
        
        this.initializeSystem();
    }
    
    /**
     * Initialisiert das System
     */
    initializeSystem() {
        // Regelmäßige Checks ob Fahrzeuge anfunken wollen
        this.intervalId = setInterval(() => {
            this.checkVehicleRequests();
        }, this.checkInterval);
        
        console.log('📡 Vehicle Radio Requests System v1.1 initialisiert');
        console.log(`⏰ Check-Intervall: ${this.checkInterval/1000}s`);
        console.log(`🎲 Anfrage-Chance: ${this.requestChance * 100}%`);
        console.log(`🚨 Notfall-Chance: ${this.emergencyChance * 100}%`);
    }
    
    /**
     * Prüft regelmäßig ob Fahrzeuge anfunken möchten
     */
    checkVehicleRequests() {
        if (!game || !game.vehicles) return;
        
        const activeVehicles = game.vehicles.filter(v => {
            const statusInfo = CONFIG.getFMSStatus(v.currentStatus);
            return v.owned && 
                   statusInfo.canBeContacted &&
                   v.currentStatus !== 2 && // Nicht auf Wache
                   !this.activeRequests.has(v.id); // Noch keine offene Anfrage
        });
        
        activeVehicles.forEach(vehicle => {
            // Zufällige Chance ob Fahrzeug anfunkt
            if (Math.random() < this.requestChance) {
                this.generateVehicleRequest(vehicle);
            }
        });
    }
    
    /**
     * Generiert eine Fahrzeuganfrage basierend auf Status
     */
    generateVehicleRequest(vehicle) {
        const status = vehicle.currentStatus;
        const incident = this.getVehicleIncident(vehicle);
        
        let requestType;
        let message;
        let priority = 'normal';
        
        // Status 0: NOTFALL (sehr selten, kritische Situation)
        if (Math.random() < this.emergencyChance) {
            requestType = this.requestTypes.EMERGENCY;
            priority = 'emergency';
            message = this.generateEmergencyMessage(vehicle, incident);
        }
        // Status 7: Patient aufgenommen -> Klinikzuweisung
        else if (status === 7 && !vehicle.targetHospital) {
            requestType = this.requestTypes.HOSPITAL_ASSIGNMENT;
            message = `${vehicle.callsign}, Status 5, bitten um Klinikzuweisung, Patient stabilisiert und transportbereit, kommen.`;
        }
        // Status 6: Am Einsatzort -> Verschiedene Anfragen
        else if (status === 6) {
            const roll = Math.random();
            if (roll < 0.4) {
                // Verstärkung anfordern
                requestType = this.requestTypes.REINFORCEMENT;
                message = `${vehicle.callsign}, Status 5, benötigen Verstärkung am Einsatzort, ${this.getReinforcementReason()}, kommen.`;
            } else if (roll < 0.7) {
                // Zusätzliche Infos
                requestType = this.requestTypes.INFO_REQUEST;
                message = `${vehicle.callsign}, Status 5, ${this.getInfoRequest(incident)}, kommen.`;
            } else {
                // Material
                requestType = this.requestTypes.MATERIAL;
                message = `${vehicle.callsign}, Status 5, benötigen ${this.getMaterialRequest()}, kommen.`;
            }
        }
        // Status 4: Anfahrt -> Infos zur Lage
        else if (status === 4) {
            requestType = this.requestTypes.INFO_REQUEST;
            message = `${vehicle.callsign}, Status 5, ${this.getRouteQuestion(incident)}, kommen.`;
        }
        // Status 8: Transport -> Update/Rückfrage
        else if (status === 8) {
            requestType = this.requestTypes.GENERAL;
            message = `${vehicle.callsign}, Status 5, ${this.getTransportQuestion(vehicle)}, kommen.`;
        }
        // Sonstiges
        else {
            requestType = this.requestTypes.GENERAL;
            message = `${vehicle.callsign}, Status 5, ${this.getGeneralQuestion()}, kommen.`;
        }
        
        // Erstelle Anfrage
        const request = {
            id: `req_${Date.now()}_${vehicle.id}`,
            vehicleId: vehicle.id,
            vehicle: vehicle,
            type: requestType,
            message: message,
            priority: priority,
            timestamp: Date.now(),
            answered: false
        };
        
        this.activeRequests.set(vehicle.id, request);
        
        // Zeige Anfrage im Funk
        this.displayRequest(request);
        
        console.log(`📡 ${vehicle.callsign} funkte an: ${requestType} (${priority})`);
    }
    
    /**
     * Generiert Notfall-Nachricht (Status 0)
     */
    generateEmergencyMessage(vehicle, incident) {
        const emergencies = [
            `${vehicle.callsign}, STATUS 0! Crew in Gefahr, benötigen sofortige Unterstützung, kommen!`,
            `${vehicle.callsign}, STATUS 0! Aggressive Person am Einsatzort, benötigen Polizei, kommen!`,
            `${vehicle.callsign}, STATUS 0! Fahrzeug nicht mehr fahrbereit, benötigen Ersatzfahrzeug, kommen!`,
            `${vehicle.callsign}, STATUS 0! Situation eskaliert, benötigen sofort Unterstützung, kommen!`,
            `${vehicle.callsign}, STATUS 0! Mehrere Verletzte, benötigen dringend weitere RTW, kommen!`
        ];
        return emergencies[Math.floor(Math.random() * emergencies.length)];
    }
    
    /**
     * Verstärkungs-Gründe
     */
    getReinforcementReason() {
        const reasons = [
            'mehrere Verletzte als gemeldet',
            'Patient schwerer verletzt als angenommen',
            'zusätzliche Person aufgefunden',
            'komplexe Rettungssituation',
            'Notarzt erforderlich',
            'zweiter Patient im Gebäude'
        ];
        return reasons[Math.floor(Math.random() * reasons.length)];
    }
    
    /**
     * Info-Anfragen zum Einsatz
     */
    getInfoRequest(incident) {
        const questions = [
            'gibt es weitere Informationen zur Lage',
            'ist Zufahrt zum Objekt frei',
            'in welchem Stockwerk befindet sich der Patient',
            'ist ein Fahrstuhl vorhanden',
            'gibt es Gefahren am Einsatzort',
            'ist Polizei bereits vor Ort',
            'gibt es Ansprechpartner vor Ort',
            'wie lautet die genaue Hausnummer'
        ];
        return questions[Math.floor(Math.random() * questions.length)];
    }
    
    /**
     * Material-Anforderungen
     */
    getMaterialRequest() {
        const materials = [
            'Schaufeltrage',
            'Vakuummatratze',
            'zusätzliches Verbandmaterial',
            'Absauggerät',
            'Beatmungsbeutel',
            'Spineboard',
            'Tragetuchtrage'
        ];
        return materials[Math.floor(Math.random() * materials.length)];
    }
    
    /**
     * Fragen während Anfahrt
     */
    getRouteQuestion(incident) {
        const questions = [
            'bestätigen Sie Einsatzadresse',
            'gibt es Updates zur Lage',
            'ist weitere Rettungskraft alarmiert',
            'alternative Anfahrt möglich, Straße gesperrt',
            'sollen wir Sonderrechte nutzen',
            'Parkmöglichkeit am Einsatzort'
        ];
        return questions[Math.floor(Math.random() * questions.length)];
    }
    
    /**
     * Fragen während Transport
     */
    getTransportQuestion(vehicle) {
        const questions = [
            'bestätigen Sie Zielklinik ' + (vehicle.targetHospital || ''),
            'sollen wir Klinik voranmelden',
            'Patient stabil, vorraussichtliche Ankunft in 5 Minuten',
            'benötigen Koordinaten zur Klinik',
            'welchen Eingang sollen wir anfahren'
        ];
        return questions[Math.floor(Math.random() * questions.length)];
    }
    
    /**
     * Allgemeine Fragen
     */
    getGeneralQuestion() {
        const questions = [
            'gibt es weitere Aufträge',
            'sollen wir Position halten',
            'bestätigen Sie Einsatzauftrag',
            'sind wir als nächstes dran',
            'können wir pausieren',
            'Funkcheck, verstehen Sie uns'
        ];
        return questions[Math.floor(Math.random() * questions.length)];
    }
    
    /**
     * Zeigt Anfrage im Funk an
     */
    displayRequest(request) {
        const { vehicle, message, priority } = request;
        
        // ✅ Nutze CONFIG für Farben
        const statusInfo = CONFIG.getFMSStatus(priority === 'emergency' ? 0 : 5);
        const color = statusInfo.color;
        
        // Zeige im Funk-Feed
        if (typeof addRadioMessage !== 'undefined') {
            addRadioMessage(vehicle.callsign, message, 'vehicle', color);
        }
        
        // Browser-Notification
        if (priority === 'emergency') {
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show(
                    `🚨 NOTFALL: ${vehicle.callsign}`,
                    message,
                    'error'
                );
            }
            
            // Sound abspielen (falls vorhanden)
            this.playAlertSound();
        } else {
            // Normale Notification
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show(
                    `📡 Sprechwunsch: ${vehicle.callsign}`,
                    'Fahrzeug möchte Leitstelle anfunken',
                    'info'
                );
            }
        }
        
        // Highlight im UI (falls vorhanden)
        this.highlightVehicleInUI(vehicle.id);
    }
    
    /**
     * Markiert Anfrage als beantwortet
     */
    answerRequest(vehicleId, response) {
        const request = this.activeRequests.get(vehicleId);
        if (!request) {
            console.warn('⚠️ Keine offene Anfrage für Fahrzeug:', vehicleId);
            return;
        }
        
        request.answered = true;
        request.response = response;
        request.answeredAt = Date.now();
        
        // Fahrzeug bestätigt
        const confirmations = [
            `${request.vehicle.callsign}, verstanden, danke, kommen.`,
            `${request.vehicle.callsign}, alles klar, kommen.`,
            `${request.vehicle.callsign}, roger, kommen.`,
            `${request.vehicle.callsign}, bestätigt, kommen.`
        ];
        
        const confirmation = confirmations[Math.floor(Math.random() * confirmations.length)];
        
        setTimeout(() => {
            if (typeof addRadioMessage !== 'undefined') {
                const statusInfo = CONFIG.getFMSStatus(2); // Status 2 = Grün
                addRadioMessage(request.vehicle.callsign, confirmation, 'vehicle', statusInfo.color);
            }
        }, 800);
        
        // Entferne nach 2 Sekunden
        setTimeout(() => {
            this.activeRequests.delete(vehicleId);
        }, 2000);
        
        console.log(`✅ Anfrage beantwortet: ${vehicleId}`);
    }
    
    /**
     * Automatische Antworten basierend auf Request-Typ
     */
    getAutoResponse(request) {
        const { type, vehicle } = request;
        
        switch(type) {
            case this.requestTypes.HOSPITAL_ASSIGNMENT:
                // Wähle nächstes verfügbares Krankenhaus
                const hospital = this.getNearestHospital(vehicle);
                vehicle.targetHospital = hospital;
                return `${vehicle.callsign}, fahren Sie Krankenhaus ${hospital}, kommen.`;
                
            case this.requestTypes.REINFORCEMENT:
                return `${vehicle.callsign}, Verstärkung ist alarmiert, ETA 5 Minuten, kommen.`;
                
            case this.requestTypes.INFO_REQUEST:
                return `${vehicle.callsign}, keine weiteren Informationen verfügbar, kommen.`;
                
            case this.requestTypes.MATERIAL:
                return `${vehicle.callsign}, Material wird mit zweitem RTW nachgeliefert, kommen.`;
                
            case this.requestTypes.EMERGENCY:
                return `${vehicle.callsign}, NOTFALL VERSTANDEN, Verstärkung und Polizei alarmiert, kommen!`;
                
            default:
                return `${vehicle.callsign}, verstanden, kommen.`;
        }
    }
    
    /**
     * Findet nächstes Krankenhaus
     */
    getNearestHospital(vehicle) {
        // TODO: Echte Distanzberechnung mit HOSPITALS Daten
        const hospitals = ['Winnenden', 'Schorndorf', 'Backnang'];
        return hospitals[Math.floor(Math.random() * hospitals.length)];
    }
    
    /**
     * Spielt Alert-Sound ab
     */
    playAlertSound() {
        // TODO: Echten Sound implementieren
        console.log('🔊 ALERT SOUND!');
    }
    
    /**
     * Markiert Fahrzeug im UI
     */
    highlightVehicleInUI(vehicleId) {
        // TODO: UI-Highlight implementieren
        console.log(`🔆 Highlight Fahrzeug: ${vehicleId}`);
    }
    
    /**
     * Hole Einsatz für Fahrzeug
     */
    getVehicleIncident(vehicle) {
        if (!game || !game.incidents) return null;
        return game.incidents.find(i => 
            i.assignedVehicles && i.assignedVehicles.includes(vehicle.id)
        );
    }
    
    /**
     * Gibt alle offenen Anfragen zurück
     */
    getActiveRequests() {
        return Array.from(this.activeRequests.values());
    }
    
    /**
     * Cleanup
     */
    cleanup() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.activeRequests.clear();
        console.log('🧹 Vehicle Radio Requests cleanup');
    }
}

// Globale Instanz
const vehicleRadioRequests = new VehicleRadioRequests();

// Cleanup bei Seitenwechsel
if (typeof window !== 'undefined') {
    window.vehicleRadioRequests = vehicleRadioRequests;
    window.addEventListener('beforeunload', () => {
        if (vehicleRadioRequests) vehicleRadioRequests.cleanup();
    });
}

console.log('✅ Vehicle Radio Requests System v1.1 geladen');
console.log(`✅ Nutzt CONFIG.RADIO Konstanten (Request-Chance: ${CONFIG.RADIO.REQUEST_CHANCE * 100}%)`);
