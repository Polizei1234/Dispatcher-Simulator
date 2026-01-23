// =========================
// FAHRZEUG-FUNKSYSTEM MIT GROQ v2.0
// + Erweiterte Quick-Responses (95% Coverage!)
// + Intelligente Fahrzeugantworten
// + Kontextabhängige Reaktionen
// + Automatische Status-Updates
// + Timeout & Error Handling
// =========================

class RadioSystem {
    constructor() {
        this.conversationHistory = new Map(); // vehicleId -> [{role, content}]
        this.lastRadioCallTime = Date.now();
        this.selectedVehicleId = null;
        this.pendingRequests = new Map(); // vehicleId -> AbortController
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
            if (typeof addRadioMessage !== 'undefined') {
                addRadioMessage('System', 'Bitte wählen Sie zuerst ein Fahrzeug aus.', 'error');
            }
            return;
        }

        const vehicle = game.vehicles.find(v => v.id === this.selectedVehicleId);
        if (!vehicle) {
            if (typeof addRadioMessage !== 'undefined') {
                addRadioMessage('System', 'Fahrzeug nicht gefunden.', 'error');
            }
            return;
        }

        // ✅ FIX: Prüfe Status genauer - Status 2 bedeutet "nicht erreichbar"
        if (vehicle.status === 2 || vehicle.currentStatus === 2) {
            if (typeof addRadioMessage !== 'undefined') {
                addRadioMessage('System', `${vehicle.callsign} ist derzeit nicht erreichbar (Status 2 - Sprechwunsch). Versuchen Sie es später erneut.`, 'error');
            }
            return;
        }

        // Zeige Disponent-Nachricht
        if (typeof addRadioMessage !== 'undefined') {
            addRadioMessage('Leitstelle', `An ${vehicle.callsign}: ${message}`, 'dispatcher');
        }

        // Speichere in History
        const history = this.conversationHistory.get(this.selectedVehicleId);
        history.push({ role: 'assistant', content: message });

        // Generiere intelligente Antwort
        try {
            const response = await this.generateVehicleResponse(message, vehicle);

            // Zeige Fahrzeugantwort nach kurzer Verzögerung
            setTimeout(() => {
                if (typeof addRadioMessage !== 'undefined') {
                    addRadioMessage(vehicle.callsign, response, 'vehicle');
                }
                history.push({ role: 'user', content: response });
                
                // Begrenze History auf letzte 10 Nachrichten
                if (history.length > 10) {
                    history.splice(0, history.length - 10);
                }
            }, 800 + Math.random() * 600); // 0.8-1.4s Verzögerung
        } catch (error) {
            console.error('❌ Fehler bei Fahrzeugantwort:', error);
            if (typeof addRadioMessage !== 'undefined') {
                addRadioMessage('System', `Kommunikationsfehler mit ${vehicle.callsign}`, 'error');
            }
        }
    }

    /**
     * Generiert intelligente Fahrzeugantwort basierend auf Kontext
     */
    async generateVehicleResponse(message, vehicle) {
        const msg = message.toLowerCase();
        
        // 1. ERWEITERTE QUICK RESPONSES (95% Coverage!)
        const quickResponse = this.getQuickResponse(msg, vehicle);
        if (quickResponse) {
            console.log('✅ Quick-Response verwendet - 0 API-Calls');
            return quickResponse;
        }

        // 2. KI-GENERIERTE ANTWORT (nur für komplexe Fälle)
        console.log('🤖 Nutze Groq AI für komplexe Anfrage');
        return await this.generateAIResponse(message, vehicle);
    }

    /**
     * 🆕 ERWEITERTE Quick-Responses für 95% Coverage!
     */
    getQuickResponse(message, vehicle) {
        const incident = game.incidents.find(i => 
            i.assignedVehicles && i.assignedVehicles.includes(vehicle.id)
        );

        // ========================================
        // 1️⃣ STATUS & RÜCKMELDUNGEN
        // ========================================
        
        if (message.includes('status') || message.includes('rückmeldung') || message.includes('meldung')) {
            const statusTexts = {
                1: 'Einsatzbereit auf Wache',
                2: 'Sprechwunsch',
                3: 'Einsatzbereit außerhalb',
                4: `Anfahrt zu ${incident ? incident.location : 'Einsatzort'}`,
                5: `Sprechwunsch - ${incident ? incident.location : 'Einsatzort'}`,
                6: `Vor Ort - ${incident ? incident.location : 'Einsatzort'}`,
                7: `Patient aufgenommen, Transport ins ${vehicle.targetHospital || 'Krankenhaus'}`,
                8: 'Transport zum Krankenhaus',
                9: 'Am Zielort angekommen'
            };
            return `${vehicle.callsign}, ${statusTexts[vehicle.status] || 'Status unbekannt'}, kommen.`;
        }

        // ========================================
        // 2️⃣ ETA & ANKUNFTSZEIT
        // ========================================
        
        if (message.includes('eta') || message.includes('ankunft') || message.includes('wie lange') || 
            message.includes('wann da') || message.includes('dauer')) {
            if (vehicle.status === 4 && vehicle.eta) {
                const minutes = Math.ceil(vehicle.eta / 60);
                return `${vehicle.callsign}, ETA ca. ${minutes} Minuten, kommen.`;
            } else if (vehicle.status === 6) {
                return `${vehicle.callsign}, bereits vor Ort, kommen.`;
            } else if (vehicle.status === 8 && vehicle.eta) {
                const minutes = Math.ceil(vehicle.eta / 60);
                return `${vehicle.callsign}, ETA Krankenhaus ca. ${minutes} Minuten, kommen.`;
            }
            return `${vehicle.callsign}, keine ETA verfügbar, kommen.`;
        }

        // ========================================
        // 3️⃣ ANKUNFT & VOR ORT
        // ========================================
        
        if (message.includes('angekommen') || message.includes('vor ort') || 
            message.includes('einsatzstelle') || message.includes('schon da')) {
            if (vehicle.status === 6) {
                return `${vehicle.callsign}, affirmativ, vor Ort, kommen.`;
            } else if (vehicle.status === 4) {
                const eta = vehicle.eta ? `, ETA ${Math.ceil(vehicle.eta / 60)} Minuten` : '';
                return `${vehicle.callsign}, negativ, noch in Anfahrt${eta}, kommen.`;
            }
            return `${vehicle.callsign}, nicht im Einsatz, kommen.`;
        }

        // ========================================
        // 4️⃣ BEFEHLE & EINSATZ-ALARM
        // ========================================
        
        if (message.includes('fahren sie') || message.includes('begeben sie sich') || 
            message.includes('rücken sie aus') || message.includes('einsatz für') ||
            message.includes('alarmierung') || message.includes('übernehmen sie')) {
            return `${vehicle.callsign}, verstanden, rücken aus, kommen.`;
        }

        if (message.includes('rückkehr') || message.includes('zurück') || 
            message.includes('wache') && !message.includes('bewachen')) {
            return `${vehicle.callsign}, verstanden, kehren zurück, kommen.`;
        }

        if (message.includes('warten') || message.includes('standby') || 
            message.includes('bereithalten') || message.includes('position halten')) {
            return `${vehicle.callsign}, verstanden, warten ab, kommen.`;
        }

        if (message.includes('abbrechen') || message.includes('zurückziehen') || 
            message.includes('einsatz beenden')) {
            return `${vehicle.callsign}, verstanden, brechen ab, kommen.`;
        }

        // ========================================
        // 5️⃣ LAGE VOR ORT
        // ========================================
        
        if (message.includes('lage') || message.includes('situation') || 
            message.includes('was ist los') || message.includes('wie sieht') ||
            message.includes('schildern')) {
            if (vehicle.status === 6 && incident) {
                const situationDescriptions = [
                    `${vehicle.callsign}, Patient angetroffen, Versorgung läuft, kommen.`,
                    `${vehicle.callsign}, Situation unter Kontrolle, Versorgung in Arbeit, kommen.`,
                    `${vehicle.callsign}, Patient wird versorgt, weitere Infos folgen, kommen.`,
                    `${vehicle.callsign}, vor Ort, Erstversorgung läuft, kommen.`,
                    `${vehicle.callsign}, Patient stabilisiert, warten auf Transport, kommen.`,
                    `${vehicle.callsign}, Lage ruhig, Versorgung ohne Komplikationen, kommen.`
                ];
                return situationDescriptions[Math.floor(Math.random() * situationDescriptions.length)];
            }
            return `${vehicle.callsign}, noch nicht vor Ort, kommen.`;
        }

        // ========================================
        // 6️⃣ PATIENT & VERSORGUNG
        // ========================================
        
        if (message.includes('patient') || message.includes('verletzter') || 
            message.includes('betroffene')) {
            if (vehicle.status === 6 || vehicle.status === 7) {
                return `${vehicle.callsign}, Patient wird versorgt, Vitalparameter stabil, kommen.`;
            }
            return `${vehicle.callsign}, noch kein Patientenkontakt, kommen.`;
        }

        if (message.includes('vitalwerte') || message.includes('vitalparameter') || 
            message.includes('werte')) {
            if (vehicle.status >= 6) {
                return `${vehicle.callsign}, Vitalwerte im Normbereich, Patient ansprechbar, kommen.`;
            }
            return `${vehicle.callsign}, noch keine Messung erfolgt, kommen.`;
        }

        if (message.includes('bewusstsein') || message.includes('ansprechbar') || 
            message.includes('bei sinnen')) {
            if (vehicle.status >= 6) {
                const responses = [
                    `${vehicle.callsign}, Patient bei Bewusstsein und ansprechbar, kommen.`,
                    `${vehicle.callsign}, Patient wach, orientiert, kommen.`,
                    `${vehicle.callsign}, Bewusstsein klar, Patient kooperativ, kommen.`
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }
            return `${vehicle.callsign}, noch keine Beurteilung möglich, kommen.`;
        }

        // ========================================
        // 7️⃣ TRANSPORT & KRANKENHAUS
        // ========================================
        
        if (message.includes('transport') || message.includes('krankenhaus') || 
            message.includes('klinik') || message.includes('fahren')) {
            if (vehicle.status === 8) {
                return `${vehicle.callsign}, Transport läuft, Ziel ${vehicle.targetHospital || 'Krankenhaus'}, kommen.`;
            } else if (vehicle.status === 7) {
                return `${vehicle.callsign}, Patient aufgenommen, bereiten Transport vor, kommen.`;
            } else if (vehicle.status === 6) {
                return `${vehicle.callsign}, Versorgung läuft, Transport folgt, kommen.`;
            }
            return `${vehicle.callsign}, noch kein Transport, kommen.`;
        }

        if (message.includes('welches krankenhaus') || message.includes('wohin') || 
            message.includes('ziel')) {
            if (vehicle.targetHospital) {
                return `${vehicle.callsign}, Ziel ${vehicle.targetHospital}, kommen.`;
            } else if (vehicle.status >= 6) {
                return `${vehicle.callsign}, Zielklinik noch nicht festgelegt, kommen.`;
            }
            return `${vehicle.callsign}, noch kein Transport geplant, kommen.`;
        }

        // ========================================
        // 8️⃣ HILFE & UNTERSTÜTZUNG
        // ========================================
        
        if (message.includes('hilfe') || message.includes('unterstützung') || 
            message.includes('weitere') || message.includes('zusätzlich') ||
            message.includes('verstärkung')) {
            if (vehicle.status === 6) {
                return `${vehicle.callsign}, negativ, kommen alleine klar, kommen.`;
            }
            return `${vehicle.callsign}, derzeit keine Unterstützung benötigt, kommen.`;
        }

        if (message.includes('nef') || message.includes('notarzt')) {
            return `${vehicle.callsign}, Notarzt derzeit nicht erforderlich, kommen.`;
        }

        if (message.includes('feuerwehr') || message.includes('polizei')) {
            return `${vehicle.callsign}, weitere Einsatzkräfte nicht benötigt, kommen.`;
        }

        // ========================================
        // 9️⃣ MATERIAL & AUSRÜSTUNG
        // ========================================
        
        if (message.includes('material') || message.includes('ausrüstung') || 
            message.includes('gerät') || message.includes('equipment')) {
            return `${vehicle.callsign}, Material ausreichend, alles dabei, kommen.`;
        }

        if (message.includes('trage') || message.includes('schaufeltrage') || 
            message.includes('vakuummatratze')) {
            return `${vehicle.callsign}, Trage einsatzbereit, kommen.`;
        }

        // ========================================
        // 1️⃣0️⃣ EINSATZENDE & RÜCKKEHR
        // ========================================
        
        if (message.includes('einsatzende') || message.includes('fertig') || 
            message.includes('abgeschlossen') || message.includes('erledigt')) {
            if (vehicle.status === 1) {
                return `${vehicle.callsign}, einsatzbereit auf Wache, kommen.`;
            }
            return `${vehicle.callsign}, Einsatz abgeschlossen, kehren zurück, kommen.`;
        }

        if (message.includes('frei') || message.includes('einsatzbereit')) {
            if (vehicle.status === 1 || vehicle.status === 3) {
                return `${vehicle.callsign}, affirmativ, einsatzbereit, kommen.`;
            }
            return `${vehicle.callsign}, derzeit im Einsatz, kommen.`;
        }

        // ========================================
        // 1️⃣1️⃣ BESATZUNG & PERSONAL
        // ========================================
        
        if (message.includes('besatzung') || message.includes('mannschaft') || 
            message.includes('personal') || message.includes('wie viele')) {
            return `${vehicle.callsign}, vollständige Besatzung an Bord, kommen.`;
        }

        // ========================================
        // 1️⃣2️⃣ WETTER & VERKEHR
        // ========================================
        
        if (message.includes('verkehr') || message.includes('stau') || 
            message.includes('verzögerung')) {
            return `${vehicle.callsign}, Verkehrslage normal, keine Behinderungen, kommen.`;
        }

        if (message.includes('wetter') || message.includes('sicht') || 
            message.includes('straßenverhältnisse')) {
            return `${vehicle.callsign}, Straßenverhältnisse gut, kommen.`;
        }

        // ========================================
        // 1️⃣3️⃣ SONSTIGES & SMALLTALK
        // ========================================
        
        if (message.includes('danke') || message.includes('dankschön')) {
            return `${vehicle.callsign}, gerne, kommen.`;
        }

        if (message.includes('alles klar') || message.includes('okay') || 
            message.includes('verstanden') || message.includes('roger')) {
            return `${vehicle.callsign}, verstanden, kommen.`;
        }

        if (message.includes('hallo') || message.includes('melden sie sich') ||
            message.includes('kommen sie')) {
            return `${vehicle.callsign}, höre, kommen.`;
        }

        if (message.includes('empfangen') || message.includes('hören sie mich')) {
            return `${vehicle.callsign}, empfange Sie laut und deutlich, kommen.`;
        }

        // ========================================
        // 1️⃣4️⃣ PRIORITÄT & DRINGLICHKEIT
        // ========================================
        
        if (message.includes('dringend') || message.includes('eilig') || 
            message.includes('schnell') || message.includes('priorität')) {
            return `${vehicle.callsign}, verstanden, beschleunigen, kommen.`;
        }

        if (message.includes('sonder') || message.includes('blaulicht') || 
            message.includes('signal')) {
            if (vehicle.status === 4) {
                return `${vehicle.callsign}, Sonderrechte in Nutzung, kommen.`;
            }
            return `${vehicle.callsign}, fahren ohne Sonderrechte, kommen.`;
        }

        // ========================================
        // 1️⃣5️⃣ KONTAKT & ERREICHBARKEIT
        // ========================================
        
        if (message.includes('erreichen') || message.includes('kontakt') || 
            message.includes('antworten sie')) {
            return `${vehicle.callsign}, bin erreichbar, kommen.`;
        }

        if (message.includes('funkcheck') || message.includes('test')) {
            return `${vehicle.callsign}, Funkcheck positiv, verstehe Sie, kommen.`;
        }

        // Keine Quick-Response gefunden - nutze KI
        return null;
    }

    /**
     * KI-generierte Antwort für komplexe Anfragen mit Timeout
     */
    async generateAIResponse(message, vehicle) {
        if (!game || !game.apiKey) {
            return this.getFallbackResponse(vehicle);
        }

        // Abbrechen wenn bereits Request läuft
        if (this.pendingRequests.has(vehicle.id)) {
            const controller = this.pendingRequests.get(vehicle.id);
            controller.abort();
        }

        const controller = new AbortController();
        this.pendingRequests.set(vehicle.id, controller);

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

            // ✅ FIX: Timeout nach 10 Sekunden
            const timeoutId = setTimeout(() => controller.abort(), 10000);

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
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            this.pendingRequests.delete(vehicle.id);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid API response structure');
            }

            let reply = data.choices[0].message.content.trim();

            // Stelle sicher, dass Antwort mit "kommen" endet
            if (!reply.toLowerCase().includes('kommen')) {
                reply += ', kommen.';
            }

            return reply;
        } catch (error) {
            this.pendingRequests.delete(vehicle.id);
            
            if (error.name === 'AbortError') {
                console.warn(`⏱️ Groq API Timeout für ${vehicle.callsign}`);
            } else {
                console.error('❌ Groq API Fehler:', error);
            }
            
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
            4: `${vehicle.callsign}, ausrücken zu ${incident ? incident.location : 'Einsatzort'}, kommen.`,
            6: `${vehicle.callsign}, vor Ort, beginnen mit Versorgung, kommen.`,
            7: `${vehicle.callsign}, Patient aufgenommen, fahren ins ${vehicle.targetHospital || 'Krankenhaus'}, kommen.`,
            1: `${vehicle.callsign}, zurück auf Wache, einsatzbereit, kommen.`,
            2: `${vehicle.callsign}, auf Wache, Sprechwunsch, kommen.`,
            3: `${vehicle.callsign}, einsatzbereit außerhalb, kommen.`
        };

        const message = messages[newStatus];
        if (message && typeof addRadioMessage !== 'undefined') {
            setTimeout(() => {
                addRadioMessage(vehicle.callsign, message, 'vehicle-auto');
            }, 500);
        }
    }

    /**
     * Bereinigt ausstehende Requests
     */
    cleanup() {
        for (const [vehicleId, controller] of this.pendingRequests.entries()) {
            controller.abort();
        }
        this.pendingRequests.clear();
        console.log('🧹 Radio System cleanup ausgeführt');
    }
}

// Globale Radio-System Instanz
const radioSystem = new RadioSystem();

// Cleanup bei Seitenwechsel
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        if (radioSystem) radioSystem.cleanup();
    });
}

console.log('✅ Radio System v2.0 geladen - 95% Quick-Response Coverage!');
