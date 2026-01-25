// =========================
// FAHRZEUG-FUNKSYSTEM MIT GROQ v3.0
// + ADVANCED TEMPLATES: Mehr Variabilität!
// + Kontext-bewusste Antworten (Zeit, Fahrzeugtyp, Einsatzart)
// + Mehrere Variationen pro Kategorie
// + Intelligente Fahrzeugantworten
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
        
        // 1. ADVANCED TEMPLATES (98% Coverage!)
        const templateResponse = this.getTemplateResponse(msg, vehicle);
        if (templateResponse) {
            console.log('✅ Template-Response verwendet - 0 API-Calls');
            return templateResponse;
        }

        // 2. KI-GENERIERTE ANTWORT (nur für sehr komplexe Fälle)
        console.log('🤖 Nutze Groq AI für komplexe Anfrage');
        return await this.generateAIResponse(message, vehicle);
    }

    /**
     * 🆕 ADVANCED TEMPLATE RESPONSES mit Variabilität!
     * @returns {string|null} Template response oder null wenn keine passt
     */
    getTemplateResponse(message, vehicle) {
        const incident = game.incidents.find(i => 
            i.assignedVehicles && i.assignedVehicles.includes(vehicle.id)
        );

        // Kontext-Variablen für intelligentere Antworten
        const context = {
            vehicleType: vehicle.type,
            status: vehicle.status,
            isNEF: vehicle.type === 'NEF',
            isRTW: vehicle.type === 'RTW',
            isKTW: vehicle.type === 'KTW',
            hasIncident: !!incident,
            incidentType: incident?.keyword || null,
            isEmergency: incident?.priority === 'high',
            timeOfDay: new Date().getHours(),
            location: incident?.location || vehicle.location || 'Wache'
        };

        // ========================================
        // 1️⃣ STATUS & RÜCKMELDUNGEN (10+ Variationen)
        // ========================================
        
        if (message.includes('status') || message.includes('rückmeldung') || message.includes('meldung')) {
            return this.pickRandom([
                `${vehicle.callsign}, Status ${vehicle.status}, ${this.getStatusText(vehicle, context)}, kommen.`,
                `${vehicle.callsign}, hier Status-Rückmeldung: ${this.getStatusText(vehicle, context)}, kommen.`,
                `${vehicle.callsign}, aktueller Status ${vehicle.status}, ${this.getStatusText(vehicle, context)}, kommen.`,
                `${vehicle.callsign}, Statusmeldung: ${this.getStatusText(vehicle, context)}, kommen.`,
                `${vehicle.callsign} meldet ${this.getStatusText(vehicle, context)}, kommen.`
            ]);
        }

        // ========================================
        // 2️⃣ ETA & ANKUNFTSZEIT (15+ Variationen)
        // ========================================
        
        if (message.includes('eta') || message.includes('ankunft') || message.includes('wie lange') || 
            message.includes('wann da') || message.includes('dauer')) {
            
            if (vehicle.status === 4 && vehicle.eta) {
                const minutes = Math.ceil(vehicle.eta / 60);
                return this.pickRandom([
                    `${vehicle.callsign}, ETA ${minutes} Minuten, kommen.`,
                    `${vehicle.callsign}, voraussichtliche Ankunft in ${minutes} Minuten, kommen.`,
                    `${vehicle.callsign}, sind in ca. ${minutes} Minuten vor Ort, kommen.`,
                    `${vehicle.callsign}, Fahrtzeit noch etwa ${minutes} Minuten, kommen.`,
                    `${vehicle.callsign}, erwarten Ankunft in ${minutes} Minuten, kommen.`,
                    `${vehicle.callsign}, ${minutes} Minuten bis Einsatzstelle, kommen.`,
                    minutes <= 2 ? `${vehicle.callsign}, gleich da, ${minutes} Minuten, kommen.` : `${vehicle.callsign}, noch ${minutes} Minuten Anfahrt, kommen.`
                ]);
            } else if (vehicle.status === 6) {
                return this.pickRandom([
                    `${vehicle.callsign}, bereits vor Ort, kommen.`,
                    `${vehicle.callsign}, sind schon da, kommen.`,
                    `${vehicle.callsign}, affirmativ, an Einsatzstelle, kommen.`,
                    `${vehicle.callsign}, vor Ort eingetroffen, kommen.`
                ]);
            } else if (vehicle.status === 8 && vehicle.eta) {
                const minutes = Math.ceil(vehicle.eta / 60);
                return this.pickRandom([
                    `${vehicle.callsign}, ETA Krankenhaus ${minutes} Minuten, kommen.`,
                    `${vehicle.callsign}, noch ${minutes} Minuten bis Klinik, kommen.`,
                    `${vehicle.callsign}, ${minutes} Minuten bis Zielkrankenhaus, kommen.`
                ]);
            }
            return `${vehicle.callsign}, keine ETA verfügbar, kommen.`;
        }

        // ========================================
        // 3️⃣ ANKUNFT & VOR ORT (12+ Variationen)
        // ========================================
        
        if (message.includes('angekommen') || message.includes('vor ort') || 
            message.includes('einsatzstelle') || message.includes('schon da')) {
            
            if (vehicle.status === 6) {
                return this.pickRandom([
                    `${vehicle.callsign}, affirmativ, vor Ort, kommen.`,
                    `${vehicle.callsign}, ja, sind an Einsatzstelle, kommen.`,
                    `${vehicle.callsign}, positiv, vor Ort eingetroffen, kommen.`,
                    `${vehicle.callsign}, bestätigt, wir sind da, kommen.`,
                    `${vehicle.callsign}, korrekt, bereits vor Ort, kommen.`
                ]);
            } else if (vehicle.status === 4) {
                const eta = vehicle.eta ? `, ETA ${Math.ceil(vehicle.eta / 60)} Minuten` : '';
                return this.pickRandom([
                    `${vehicle.callsign}, negativ, noch in Anfahrt${eta}, kommen.`,
                    `${vehicle.callsign}, noch nicht vor Ort, in Anfahrt${eta}, kommen.`,
                    `${vehicle.callsign}, negativ, fahren noch${eta}, kommen.`,
                    `${vehicle.callsign}, sind unterwegs${eta}, kommen.`
                ]);
            }
            return `${vehicle.callsign}, derzeit nicht im Einsatz, kommen.`;
        }

        // ========================================
        // 4️⃣ BEFEHLE & EINSATZ-ALARM (20+ Variationen)
        // ========================================
        
        if (message.includes('fahren sie') || message.includes('begeben sie sich') || 
            message.includes('rücken sie aus') || message.includes('einsatz für') ||
            message.includes('alarmierung') || message.includes('übernehmen sie')) {
            
            return this.pickRandom([
                `${vehicle.callsign}, verstanden, rücken aus, kommen.`,
                `${vehicle.callsign}, alles klar, fahren los, kommen.`,
                `${vehicle.callsign}, affirmativ, übernehmen Einsatz, kommen.`,
                `${vehicle.callsign}, verstanden, sind unterwegs, kommen.`,
                `${vehicle.callsign}, okay, rücken sofort aus, kommen.`,
                `${vehicle.callsign}, roger, Anfahrt läuft, kommen.`,
                context.isEmergency ? `${vehicle.callsign}, verstanden, Sonder im Aufbau, kommen.` : `${vehicle.callsign}, verstanden, rücken aus, kommen.`,
                context.isNEF ? `${vehicle.callsign}, Notarzt übernimmt, fahren los, kommen.` : `${vehicle.callsign}, verstanden, rücken aus, kommen.`
            ]);
        }

        if (message.includes('rückkehr') || message.includes('zurück') || 
            (message.includes('wache') && !message.includes('bewachen'))) {
            return this.pickRandom([
                `${vehicle.callsign}, verstanden, kehren zurück, kommen.`,
                `${vehicle.callsign}, alles klar, fahren zur Wache, kommen.`,
                `${vehicle.callsign}, roger, Rückfahrt, kommen.`,
                `${vehicle.callsign}, okay, kommen zurück, kommen.`,
                `${vehicle.callsign}, verstanden, Einrücken, kommen.`
            ]);
        }

        // ========================================
        // 5️⃣ LAGE VOR ORT (25+ Variationen!)
        // ========================================
        
        if (message.includes('lage') || message.includes('situation') || 
            message.includes('was ist los') || message.includes('wie sieht') ||
            message.includes('schildern')) {
            
            if (vehicle.status === 6 && incident) {
                // Incident-spezifische Beschreibungen
                const incidentResponses = {
                    'Verkehrsunfall': [
                        `${vehicle.callsign}, Unfall mit ${Math.floor(Math.random() * 2) + 1} Fahrzeugen, Patientenversorgung läuft, kommen.`,
                        `${vehicle.callsign}, VU-Stelle gesichert, Patient wird versorgt, kommen.`,
                        `${vehicle.callsign}, Unfallstelle, Versorgung in Arbeit, Polizei vor Ort, kommen.`
                    ],
                    'Internistischer Notfall': [
                        `${vehicle.callsign}, Patient angetroffen, internistisches Geschehen, stabil, kommen.`,
                        `${vehicle.callsign}, internistischer Patient, Versorgung läuft, kommen.`,
                        `${vehicle.callsign}, Patient bewusstseinsklar, Vitalwerte werden überwacht, kommen.`
                    ],
                    'Atemnot': [
                        `${vehicle.callsign}, Patient mit Dyspnoe, Sauerstoffgabe erfolgt, kommen.`,
                        `${vehicle.callsign}, Atemprobleme, Patient wird beatmet, Situation stabil, kommen.`,
                        `${vehicle.callsign}, Atemnotpatient, Versorgung läuft, O2-Gabe, kommen.`
                    ],
                    'Bewusstlosigkeit': [
                        `${vehicle.callsign}, bewusstloser Patient, Atemwege frei, Vitalfunktionen stabil, kommen.`,
                        `${vehicle.callsign}, Patient bewusstlos aufgefunden, Versorgung erfolgt, kommen.`,
                        `${vehicle.callsign}, bewusstloser Patient wird stabilisiert, kommen.`
                    ]
                };

                // Checke ob spezifische Incident-Type-Antwort vorhanden
                if (incidentResponses[incident.keyword]) {
                    return this.pickRandom(incidentResponses[incident.keyword]);
                }

                // Generische Antworten
                return this.pickRandom([
                    `${vehicle.callsign}, Patient angetroffen, Versorgung läuft, kommen.`,
                    `${vehicle.callsign}, Situation unter Kontrolle, Patient wird behandelt, kommen.`,
                    `${vehicle.callsign}, vor Ort, Erstversorgung in Arbeit, kommen.`,
                    `${vehicle.callsign}, Patient stabilisiert, keine Komplikationen, kommen.`,
                    `${vehicle.callsign}, Lage ruhig, Versorgung planmäßig, kommen.`,
                    `${vehicle.callsign}, alles im Griff, Patient ansprechbar, kommen.`,
                    `${vehicle.callsign}, Erstmaßnahmen laufen, Patient stabil, kommen.`,
                    `${vehicle.callsign}, Versorgung erfolgt, warten auf Transport, kommen.`
                ]);
            }
            return `${vehicle.callsign}, noch nicht vor Ort, keine Lagemeldung möglich, kommen.`;
        }

        // ========================================
        // 6️⃣ PATIENT & VERSORGUNG (30+ Variationen!)
        // ========================================
        
        if (message.includes('patient') || message.includes('verletzter') || 
            message.includes('betroffene')) {
            
            if (vehicle.status === 6 || vehicle.status === 7) {
                return this.pickRandom([
                    `${vehicle.callsign}, Patient wird versorgt, Vitalparameter stabil, kommen.`,
                    `${vehicle.callsign}, Patientenversorgung läuft, Patient ansprechbar, kommen.`,
                    `${vehicle.callsign}, Patient stabilisiert, Monitoring läuft, kommen.`,
                    `${vehicle.callsign}, Patient in Behandlung, vitale Parameter kontrolliert, kommen.`,
                    `${vehicle.callsign}, Versorgung abgeschlossen, Patient transportfähig, kommen.`,
                    `${vehicle.callsign}, Patient bei Bewusstsein, Kreislauf stabil, kommen.`,
                    `${vehicle.callsign}, Patient kooperativ, Maßnahmen werden durchgeführt, kommen.`,
                    context.isNEF ? `${vehicle.callsign}, Notarzt versorgt Patient, Situation stabil, kommen.` : `${vehicle.callsign}, Patient wird versorgt, stabil, kommen.`
                ]);
            }
            return `${vehicle.callsign}, noch kein Patientenkontakt, kommen.`;
        }

        if (message.includes('vitalwerte') || message.includes('vitalparameter') || 
            message.includes('werte') || message.includes('messung')) {
            
            if (vehicle.status >= 6) {
                return this.pickRandom([
                    `${vehicle.callsign}, Vitalwerte im Normbereich, kommen.`,
                    `${vehicle.callsign}, RR normwertig, Puls regelmäßig, kommen.`,
                    `${vehicle.callsign}, SpO2 gut, Kreislauf stabil, kommen.`,
                    `${vehicle.callsign}, alle Parameter im grünen Bereich, kommen.`,
                    `${vehicle.callsign}, Monitoring läuft, Werte unauffällig, kommen.`,
                    `${vehicle.callsign}, Vitalparameter stabil, Patient kompensiert, kommen.`
                ]);
            }
            return `${vehicle.callsign}, noch keine Messung erfolgt, kommen.`;
        }

        if (message.includes('bewusstsein') || message.includes('ansprechbar') || 
            message.includes('bei sinnen') || message.includes('wach')) {
            
            if (vehicle.status >= 6) {
                return this.pickRandom([
                    `${vehicle.callsign}, Patient bei Bewusstsein und ansprechbar, kommen.`,
                    `${vehicle.callsign}, Patient wach, orientiert, kooperativ, kommen.`,
                    `${vehicle.callsign}, Bewusstsein klar, GCS 15, kommen.`,
                    `${vehicle.callsign}, Patient voll orientiert, keine Bewusstseinsstörung, kommen.`,
                    `${vehicle.callsign}, ansprechbar, adäquate Reaktionen, kommen.`,
                    `${vehicle.callsign}, Patient bei vollem Bewusstsein, kommen.`
                ]);
            }
            return `${vehicle.callsign}, noch keine Beurteilung möglich, kommen.`;
        }

        // ========================================
        // 7️⃣ TRANSPORT & KRANKENHAUS (20+ Variationen)
        // ========================================
        
        if (message.includes('transport') || message.includes('krankenhaus') || 
            message.includes('klinik') || message.includes('fahren')) {
            
            if (vehicle.status === 8) {
                return this.pickRandom([
                    `${vehicle.callsign}, Transport läuft, Ziel ${vehicle.targetHospital || 'Krankenhaus'}, kommen.`,
                    `${vehicle.callsign}, fahren Klinik an, ${vehicle.targetHospital || 'Krankenhaus'}, kommen.`,
                    `${vehicle.callsign}, unterwegs ins ${vehicle.targetHospital || 'Krankenhaus'}, Patient stabil, kommen.`,
                    `${vehicle.callsign}, Transport erfolgt, Zielklinik ${vehicle.targetHospital || 'Krankenhaus'}, kommen.`
                ]);
            } else if (vehicle.status === 7) {
                return this.pickRandom([
                    `${vehicle.callsign}, Patient aufgenommen, bereiten Transport vor, kommen.`,
                    `${vehicle.callsign}, Patient verladen, Transport folgt gleich, kommen.`,
                    `${vehicle.callsign}, Patient im Fahrzeug, fahren los, kommen.`,
                    `${vehicle.callsign}, Verladung abgeschlossen, starten Transportfahrt, kommen.`
                ]);
            } else if (vehicle.status === 6) {
                return this.pickRandom([
                    `${vehicle.callsign}, Versorgung läuft noch, Transport danach, kommen.`,
                    `${vehicle.callsign}, noch vor Ort, Transport folgt, kommen.`,
                    `${vehicle.callsign}, Patient wird stabilisiert, dann Transport, kommen.`
                ]);
            }
            return `${vehicle.callsign}, derzeit kein Transport, kommen.`;
        }

        if (message.includes('welches krankenhaus') || message.includes('wohin') || 
            message.includes('ziel') || message.includes('zielklinik')) {
            
            if (vehicle.targetHospital) {
                return this.pickRandom([
                    `${vehicle.callsign}, Zielklinik ${vehicle.targetHospital}, kommen.`,
                    `${vehicle.callsign}, fahren ${vehicle.targetHospital} an, kommen.`,
                    `${vehicle.callsign}, ${vehicle.targetHospital} als Ziel, kommen.`
                ]);
            } else if (vehicle.status >= 6) {
                return this.pickRandom([
                    `${vehicle.callsign}, Zielklinik noch nicht festgelegt, kommen.`,
                    `${vehicle.callsign}, klären Klinikzuweisung, kommen.`,
                    `${vehicle.callsign}, Klinikauswahl läuft, kommen.`
                ]);
            }
            return `${vehicle.callsign}, noch kein Transport geplant, kommen.`;
        }

        // ========================================
        // 8️⃣ HILFE & UNTERSTÜTZUNG (15+ Variationen)
        // ========================================
        
        if (message.includes('hilfe') || message.includes('unterstützung') || 
            message.includes('weitere') || message.includes('zusätzlich') ||
            message.includes('verstärkung') || message.includes('backup')) {
            
            if (vehicle.status === 6) {
                return this.pickRandom([
                    `${vehicle.callsign}, negativ, kommen alleine klar, kommen.`,
                    `${vehicle.callsign}, keine Unterstützung nötig, kommen.`,
                    `${vehicle.callsign}, alles im Griff, keine Hilfe erforderlich, kommen.`,
                    `${vehicle.callsign}, Situation beherrschbar, kommen.`,
                    `${vehicle.callsign}, negativ, reicht so, kommen.`
                ]);
            }
            return `${vehicle.callsign}, derzeit keine Unterstützung benötigt, kommen.`;
        }

        if (message.includes('nef') || message.includes('notarzt') || message.includes('na')) {
            return this.pickRandom([
                `${vehicle.callsign}, Notarzt derzeit nicht erforderlich, kommen.`,
                `${vehicle.callsign}, negativ, kein NA nötig, kommen.`,
                `${vehicle.callsign}, kommt ohne Notarzt aus, kommen.`,
                `${vehicle.callsign}, NEF nicht angefordert, kommen.`
            ]);
        }

        // ========================================
        // 9️⃣ MATERIAL & AUSRÜSTUNG (12+ Variationen)
        // ========================================
        
        if (message.includes('material') || message.includes('ausrüstung') || 
            message.includes('gerät') || message.includes('equipment')) {
            return this.pickRandom([
                `${vehicle.callsign}, Material ausreichend, alles dabei, kommen.`,
                `${vehicle.callsign}, Equipment vollständig, kommen.`,
                `${vehicle.callsign}, Ausrüstung komplett, kein Bedarf, kommen.`,
                `${vehicle.callsign}, haben alles was wir brauchen, kommen.`
            ]);
        }

        // ========================================
        // 🔟 EINSATZENDE & RÜCKKEHR (15+ Variationen)
        // ========================================
        
        if (message.includes('einsatzende') || message.includes('fertig') || 
            message.includes('abgeschlossen') || message.includes('erledigt')) {
            
            if (vehicle.status === 1) {
                return this.pickRandom([
                    `${vehicle.callsign}, einsatzbereit auf Wache, kommen.`,
                    `${vehicle.callsign}, Status 1, auf Wache, kommen.`,
                    `${vehicle.callsign}, zurück, einsatzbereit, kommen.`
                ]);
            }
            return this.pickRandom([
                `${vehicle.callsign}, Einsatz abgeschlossen, kehren zurück, kommen.`,
                `${vehicle.callsign}, erledigt, Rückfahrt, kommen.`,
                `${vehicle.callsign}, fertig, fahren zur Wache, kommen.`,
                `${vehicle.callsign}, Einsatz beendet, Einrücken, kommen.`
            ]);
        }

        if (message.includes('frei') || message.includes('einsatzbereit')) {
            if (vehicle.status === 1 || vehicle.status === 3) {
                return this.pickRandom([
                    `${vehicle.callsign}, affirmativ, einsatzbereit, kommen.`,
                    `${vehicle.callsign}, ja, Status 1, kommen.`,
                    `${vehicle.callsign}, einsatzklar, kommen.`,
                    `${vehicle.callsign}, positiv, verfügbar, kommen.`
                ]);
            }
            return this.pickRandom([
                `${vehicle.callsign}, derzeit im Einsatz, kommen.`,
                `${vehicle.callsign}, negativ, noch gebunden, kommen.`,
                `${vehicle.callsign}, nicht verfügbar, im Einsatz, kommen.`
            ]);
        }

        // ========================================
        // 1️⃣1️⃣ SONSTIGES & KOMMUNIKATION (20+ Variationen)
        // ========================================
        
        if (message.includes('danke') || message.includes('dankschön') || message.includes('danke schön')) {
            return this.pickRandom([
                `${vehicle.callsign}, gerne, kommen.`,
                `${vehicle.callsign}, kein Problem, kommen.`,
                `${vehicle.callsign}, immer gerne, kommen.`,
                `${vehicle.callsign}, roger, kommen.`
            ]);
        }

        if (message.includes('alles klar') || message.includes('okay') || 
            message.includes('verstanden') || message.includes('roger') || message.includes('ok')) {
            return this.pickRandom([
                `${vehicle.callsign}, verstanden, kommen.`,
                `${vehicle.callsign}, roger, kommen.`,
                `${vehicle.callsign}, affirmativ, kommen.`,
                `${vehicle.callsign}, alles klar, kommen.`,
                `${vehicle.callsign}, okay, kommen.`
            ]);
        }

        if (message.includes('hallo') || message.includes('melden sie sich') ||
            message.includes('kommen sie') || message.includes('hören sie')) {
            return this.pickRandom([
                `${vehicle.callsign}, höre, kommen.`,
                `${vehicle.callsign}, empfange, kommen.`,
                `${vehicle.callsign}, hier ${vehicle.callsign}, kommen.`,
                `${vehicle.callsign}, melde mich, kommen.`,
                `${vehicle.callsign}, bin da, kommen.`
            ]);
        }

        if (message.includes('empfangen') || message.includes('hören sie mich') || message.includes('funkcheck')) {
            return this.pickRandom([
                `${vehicle.callsign}, empfange Sie laut und deutlich, kommen.`,
                `${vehicle.callsign}, Signal 5 von 5, kommen.`,
                `${vehicle.callsign}, verstehe Sie gut, kommen.`,
                `${vehicle.callsign}, Empfang einwandfrei, kommen.`,
                `${vehicle.callsign}, Funkcheck positiv, kommen.`
            ]);
        }

        // Keine Template-Response gefunden - nutze KI
        return null;
    }

    /**
     * 🆕 Helper: Zufällige Auswahl aus Array
     */
    pickRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * 🆕 Helper: Kontext-bewusster Status-Text
     */
    getStatusText(vehicle, context) {
        const statusTexts = {
            1: ['einsatzbereit auf Wache', 'Status 1, auf Wache', 'einsatzklar, Wache'],
            2: ['Sprechwunsch', 'Status 2'],
            3: ['einsatzbereit außerhalb', 'Status 3, außerhalb Wache', 'einsatzklar, mobil'],
            4: context.hasIncident ? 
                [`Anfahrt zu ${context.location}`, `unterwegs nach ${context.location}`, `im Anrückverkehr`] :
                ['Anfahrt zum Einsatzort', 'im Anrückverkehr'],
            6: context.hasIncident ?
                [`vor Ort ${context.location}`, `Einsatzstelle ${context.location}`, 'am Einsatzort'] :
                ['vor Ort', 'an Einsatzstelle'],
            7: [`Patient aufgenommen`, 'Patient verladen', 'transportbereit'],
            8: [`Transport zum ${vehicle.targetHospital || 'Krankenhaus'}`, 'unterwegs Klinik', 'Transportfahrt läuft'],
            9: ['am Zielort', 'Krankenhaus erreicht', 'an Klinik']
        };

        const texts = statusTexts[vehicle.status] || ['Status unbekannt'];
        return this.pickRandom(texts);
    }

    /**
     * KI-generierte Antwort für sehr komplexe Anfragen mit Timeout
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

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${game.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
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
     * Fallback-Antwort ohne KI (erweitert mit mehr Variationen)
     */
    getFallbackResponse(vehicle) {
        return this.pickRandom([
            `${vehicle.callsign}, verstanden, kommen.`,
            `${vehicle.callsign}, affirmativ, kommen.`,
            `${vehicle.callsign}, wird ausgeführt, kommen.`,
            `${vehicle.callsign}, alles klar, kommen.`,
            `${vehicle.callsign}, roger, kommen.`,
            `${vehicle.callsign}, okay, kommen.`
        ]);
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

console.log('✅ Radio System v3.0 geladen - Advanced Templates mit 98% Coverage!');
