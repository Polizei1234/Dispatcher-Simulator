// =========================
// FAHRZEUG-FUNKSYSTEM MIT GROQ v1.0
// + Intelligente Fahrzeugantworten
// + Kontextabhängige Reaktionen
// + Automatische Status-Updates
// =========================

class RadioSystem {
    constructor() {
        this.conversationHistory = new Map(); // vehicleId -> [{role, content}]
        this.lastRadioCallTime = Date.now();
        this.selectedVehicleId = null;
    }

    /**
     * Wählt ein Fahrzeug für Funkkommunikation aus
     */
    selectVehicle(vehicleId) {
        this.selectedVehicleId = vehicleId;
        
        // Initialisiere Conversation History wenn nötig
        if (!this.conversationHistory.has(vehicleId)) {
            this.conversationHistory.set(vehicleId, []);
        }
    }

    /**
     * Sendet Funkspruch an ausgewähltes Fahrzeug
     */
    async sendRadioToVehicle(message) {
        if (!this.selectedVehicleId) {
            addRadioMessage('System', 'Bitte wählen Sie zuerst ein Fahrzeug aus.', 'error');
            return;
        }

        const vehicle = game.vehicles.find(v => v.id === this.selectedVehicleId);
        if (!vehicle) {
            addRadioMessage('System', 'Fahrzeug nicht gefunden.', 'error');
            return;
        }

        // Prüfe ob Fahrzeug funkbereit ist (nicht Status 2)
        if (vehicle.status === 2) {
            addRadioMessage('System', `${vehicle.callsign} ist nicht erreichbar (Status 2 - Sprechwunsch).`, 'error');
            return;
        }

        // Zeige Disponent-Nachricht
        addRadioMessage('Leitstelle', `An ${vehicle.callsign}: ${message}`, 'dispatcher');

        // Speichere in History
        const history = this.conversationHistory.get(this.selectedVehicleId);
        history.push({ role: 'assistant', content: message });

        // Generiere intelligente Antwort
        const response = await this.generateVehicleResponse(message, vehicle);

        // Zeige Fahrzeugantwort nach kurzer Verzögerung
        setTimeout(() => {
            addRadioMessage(vehicle.callsign, response, 'vehicle');
            history.push({ role: 'user', content: response });
            
            // Begrenze History auf letzte 10 Nachrichten
            if (history.length > 10) {
                history.splice(0, history.length - 10);
            }
        }, 800 + Math.random() * 600); // 0.8-1.4s Verzögerung
    }

    /**
     * Generiert intelligente Fahrzeugantwort basierend auf Kontext
     */
    async generateVehicleResponse(message, vehicle) {
        const msg = message.toLowerCase();
        
        // 1. DIREKTE FRAGEN/BEFEHLE (Schnelle Antworten ohne KI)
        const quickResponse = this.getQuickResponse(msg, vehicle);
        if (quickResponse) {
            return quickResponse;
        }

        // 2. KI-GENERIERTE ANTWORT (für komplexe Dialoge)
        return await this.generateAIResponse(message, vehicle);
    }

    /**
     * Schnelle vordefinierte Antworten für typische Funksprüche
     */
    getQuickResponse(message, vehicle) {
        const incident = game.incidents.find(i => 
            i.assignedVehicles && i.assignedVehicles.includes(vehicle.id)
        );

        // Status-Anfragen
        if (message.includes('status') || message.includes('rückmeldung')) {
            const statusTexts = {
                1: 'Einsatzbereit auf Wache',
                3: 'Einsatzbereit außerhalb',
                4: `Anfahrt zu ${incident ? incident.location : 'Einsatzort'}`,
                5: `Sprechwunsch - ${incident ? incident.location : 'Einsatzort'}`,
                6: `Vor Ort - ${incident ? incident.location : 'Einsatzort'}`,
                7: `Patient aufgenommen, Transport ins ${vehicle.targetHospital || 'Krankenhaus'}`,
                8: 'Transport zum Krankenhaus'
            };
            return `${vehicle.callsign}, ${statusTexts[vehicle.status] || 'Status unbekannt'}, kommen.`;
        }

        // ETA-Anfragen
        if (message.includes('eta') || message.includes('ankunft') || message.includes('wie lange')) {
            if (vehicle.status === 4 && vehicle.eta) {
                const minutes = Math.ceil(vehicle.eta / 60);
                return `${vehicle.callsign}, ETA ca. ${minutes} Minuten, kommen.`;
            } else if (vehicle.status === 6) {
                return `${vehicle.callsign}, bereits vor Ort, kommen.`;
            }
            return `${vehicle.callsign}, keine ETA verfügbar, kommen.`;
        }

        // Angekommen?
        if (message.includes('angekommen') || message.includes('vor ort')) {
            if (vehicle.status === 6) {
                return `${vehicle.callsign}, affirmativ, vor Ort, kommen.`;
            } else if (vehicle.status === 4) {
                return `${vehicle.callsign}, negativ, noch in Anfahrt, kommen.`;
            }
            return `${vehicle.callsign}, nicht im Einsatz, kommen.`;
        }

        // Bestätigungen von Befehlen
        if (message.includes('fahren sie') || message.includes('begeben sie sich') || message.includes('einsatz')) {
            return `${vehicle.callsign}, verstanden, rücken aus, kommen.`;
        }

        if (message.includes('rückkehr') || message.includes('zurück') || message.includes('wache')) {
            return `${vehicle.callsign}, verstanden, kehren zurück, kommen.`;
        }

        if (message.includes('warten') || message.includes('standby') || message.includes('bereithalten')) {
            return `${vehicle.callsign}, verstanden, warten ab, kommen.`;
        }

        // Lage vor Ort
        if (message.includes('lage') || message.includes('situation')) {
            if (vehicle.status === 6 && incident) {
                const situationDescriptions = [
                    `${vehicle.callsign}, Patient angetroffen, Versorgung läuft, kommen.`,
                    `${vehicle.callsign}, Situation unter Kontrolle, Versorgung in Arbeit, kommen.`,
                    `${vehicle.callsign}, Patient wird versorgt, weitere Infos folgen, kommen.`,
                    `${vehicle.callsign}, vor Ort, Erstversorgung läuft, kommen.`
                ];
                return situationDescriptions[Math.floor(Math.random() * situationDescriptions.length)];
            }
            return `${vehicle.callsign}, noch nicht vor Ort, kommen.`;
        }

        return null; // Keine Quick-Response gefunden
    }

    /**
     * KI-generierte Antwort für komplexe Anfragen
     */
    async generateAIResponse(message, vehicle) {
        if (!game || !game.apiKey) {
            return this.getFallbackResponse(vehicle);
        }

        try {
            const incident = game.incidents.find(i => 
                i.assignedVehicles && i.assignedVehicles.includes(vehicle.id)
            );

            const statusDescription = this.getStatusDescription(vehicle.status);
            const incidentInfo = incident ? 
                `Einsatz: ${incident.keyword} - ${incident.description}\nOrt: ${incident.location}\nPriorität: ${incident.priority}` :
                'Derzeit kein Einsatz';

            const systemPrompt = `Du bist die Besatzung von ${vehicle.callsign}, einem ${vehicle.type}-Fahrzeug.

FAHRZEUGINFOS:
- Rufzeichen: ${vehicle.callsign}
- Typ: ${vehicle.type}
- Aktueller Status: ${statusDescription}
- Standort: ${vehicle.location || 'Wache'}

EINSATZINFOS:
${incidentInfo}

FUNKSPRACHE-REGELN:
1. Beende JEDE Nachricht mit "kommen"
2. Sei professionell und präzise
3. Verwende Funkjargon (affirmativ, negativ, verstanden, etc.)
4. Maximal 1-2 kurze Sätze
5. Beginne mit deinem Rufzeichen
6. Reagiere auf die Anfrage der Leitstelle
7. Gib konkrete Informationen wenn möglich

BEISPIELE:
- "${vehicle.callsign}, verstanden, rücken aus, kommen."
- "${vehicle.callsign}, vor Ort, Patient wird versorgt, kommen."
- "${vehicle.callsign}, ETA 5 Minuten, kommen."`;

            const history = this.conversationHistory.get(vehicle.id) || [];

            const response = await fetch(CONFIG.GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${game.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: CONFIG.GROQ_MODEL,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...history.slice(-6), // Letzte 6 Nachrichten für Kontext
                        { role: 'user', content: message }
                    ],
                    temperature: 0.7,
                    max_tokens: 80
                })
            });

            const data = await response.json();
            let reply = data.choices[0].message.content.trim();

            // Stelle sicher, dass Antwort mit "kommen" endet
            if (!reply.toLowerCase().includes('kommen')) {
                reply += ', kommen.';
            }

            return reply;
        } catch (error) {
            console.error('Groq API Fehler:', error);
            return this.getFallbackResponse(vehicle);
        }
    }

    /**
     * Fallback-Antwort ohne KI
     */
    getFallbackResponse(vehicle) {
        const responses = [
            `${vehicle.callsign}, verstanden, kommen.`,
            `${vehicle.callsign}, affirmativ, kommen.`,
            `${vehicle.callsign}, wird ausgeführt, kommen.`,
            `${vehicle.callsign}, alles klar, kommen.`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Status-Beschreibung für Kontext
     */
    getStatusDescription(status) {
        const descriptions = {
            1: 'Einsatzbereit auf Wache',
            2: 'Sprechwunsch',
            3: 'Einsatzbereit außerhalb der Wache',
            4: 'Anfahrt zum Einsatzort',
            5: 'Sprechwunsch am Einsatzort',
            6: 'Vor Ort im Einsatz',
            7: 'Patient aufgenommen',
            8: 'Transport zum Krankenhaus',
            9: 'Am Zielort angekommen'
        };
        return descriptions[status] || 'Status unbekannt';
    }

    /**
     * Automatische Status-Rückmeldungen bei Statusänderungen
     */
    sendAutoStatusUpdate(vehicle, newStatus, incident = null) {
        const messages = {
            4: `${vehicle.callsign}, ausgerückt, fahren zu ${incident ? incident.location : 'Einsatzort'}, kommen.`,
            6: `${vehicle.callsign}, vor Ort, beginnen mit Versorgung, kommen.`,
            7: `${vehicle.callsign}, Patient aufgenommen, fahren ins ${vehicle.targetHospital || 'Krankenhaus'}, kommen.`,
            1: `${vehicle.callsign}, zurück auf Wache, einsatzbereit, kommen.`,
            3: `${vehicle.callsign}, einsatzbereit außerhalb, kommen.`
        };

        const message = messages[newStatus];
        if (message) {
            setTimeout(() => {
                addRadioMessage(vehicle.callsign, message, 'vehicle-auto');
            }, 500);
        }
    }
}

// Globale Radio-System Instanz
const radioSystem = new RadioSystem();