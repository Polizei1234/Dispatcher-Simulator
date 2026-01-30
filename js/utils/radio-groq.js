// =========================
// RADIO GROQ AI INTEGRATION v2.1
// Generiert realistische Fahrzeug-Funksprüche
// 🔧 v2.0: Automatischer API-Key Import aus localStorage & Settings
// 📡 v2.1: Verbesserte Funkdisziplin - KI beantwortet Fragen richtig!
// =========================

const RadioGroq = {
    config: null,
    apiKey: null,

    /**
     * Initialisierung
     */
    async initialize() {
        console.log('🤖 RadioGroq v2.1 initialisiert');
        
        // Lade Konfiguration
        try {
            const response = await fetch('js/data/radio-config.json');
            this.config = await response.json();
            console.log('✅ Radio-Config geladen');
        } catch (error) {
            console.warn('⚠️ Radio-Config nicht gefunden - nutze Defaults');
        }

        // 🔧 v2.0: Lade API-Key mit Fallback-Strategie
        this.loadApiKey();
    },

    /**
     * 🔧 v2.0: Lädt API-Key aus verschiedenen Quellen
     */
    loadApiKey() {
        // 1. Versuche localStorage
        this.apiKey = localStorage.getItem('groqApiKey');
        
        // 2. Versuche CONFIG.GROQ_API_KEY (falls gesetzt)
        if (!this.apiKey && typeof CONFIG !== 'undefined' && CONFIG.GROQ_API_KEY) {
            this.apiKey = CONFIG.GROQ_API_KEY;
            console.log('✅ API-Key aus CONFIG übernommen');
        }
        
        // 3. Versuche gameAIGenerator (falls bereits initialisiert)
        if (!this.apiKey && typeof window.gameAIGenerator !== 'undefined' && window.gameAIGenerator?.apiKey) {
            this.apiKey = window.gameAIGenerator.apiKey;
            console.log('✅ API-Key von AIIncidentGenerator übernommen');
        }
        
        if (this.apiKey) {
            console.log('✅ Groq API Key geladen - KI-Funksprüche aktiviert');
        } else {
            console.warn('⚠️ Kein Groq API Key gefunden - Funkspruch-Generierung nutzt Fallbacks');
            console.warn('💡 API-Key in Einstellungen setzen für KI-generierte Funksprüche');
        }
    },

    /**
     * 🔧 v2.0: Versucht API-Key nachzuladen (falls später gesetzt)
     */
    reloadApiKey() {
        const oldKey = this.apiKey;
        this.loadApiKey();
        
        if (this.apiKey !== oldKey) {
            console.log('🔄 API-Key neu geladen');
            return true;
        }
        return false;
    },

    /**
     * Generiert Fahrzeug-Antwort basierend auf Kontext
     */
    async generateVehicleResponse(vehicle, context) {
        // 🔧 v2.0: Versuche Key nochmal nachzuladen falls nicht vorhanden
        if (!this.apiKey) {
            this.reloadApiKey();
        }
        
        if (!this.apiKey) {
            console.warn('⚠️ Kein API Key - keine Funkspruch-Generierung möglich');
            return this.getFallbackResponse(vehicle, context);
        }

        try {
            console.log(`🤖 Generiere KI-Funkspruch für ${vehicle.callsign}...`);
            
            const prompt = this.buildPrompt(vehicle, context);
            const response = await this.callGroqAPI(prompt);
            
            console.log(`✅ KI-Funkspruch generiert: "${response}"`);
            return response;
            
        } catch (error) {
            console.error('❌ Fehler bei Funkspruch-Generierung:', error);
            return this.getFallbackResponse(vehicle, context);
        }
    },

    /**
     * 📡 v2.1: Verbesserte Prompt-Generierung mit besserer Funkdisziplin
     */
    buildPrompt(vehicle, context) {
        const { reason, incident, lastDispatchMessage, fmsCode } = context;

        // 📡 v2.1: FMS-Status-Namen hinzufügen
        const fmsStatusNames = {
            0: 'Notfall',
            1: 'Einsatzbereit auf Funkwache',
            2: 'Einsatzbereit auf Wache',
            3: 'Einsatzfahrt',
            4: 'Am Einsatzort',
            5: 'Sprechwunsch',
            6: 'Nicht einsatzbereit',
            7: 'Patient aufgenommen',
            8: 'Transportfahrt'
        };
        
        const currentStatusName = fmsStatusNames[fmsCode || vehicle.currentStatus] || 'Unbekannt';

        let basePrompt = `Du bist die Besatzung von ${vehicle.callsign}, einem ${vehicle.type} des Rettungsdienstes.

AKTUELLE SITUATION:
- Rufname: ${vehicle.callsign}
- Fahrzeugtyp: ${vehicle.type}
- FMS-Status: ${fmsCode || vehicle.currentStatus} (${currentStatusName})
`;

        if (incident) {
            basePrompt += `- Einsatz: ${incident.stichwort || 'Notfall'}
- Einsatzort: ${incident.adresse || 'Unbekannt'}
- Meldebild: ${incident.meldebild || 'Keine Details'}
`;
        }

        if (lastDispatchMessage) {
            basePrompt += `
📡 NACHRICHT VON LEITSTELLE:
"${lastDispatchMessage}"
`;
        }

        // Kontext-spezifische Anweisungen
        let contextInstructions = '';
        
        switch (reason) {
            case 'sprechwunsch':
            case 'sprechwunsch_priorisiert':
                contextInstructions = `
Du hast einen Sprechwunsch gemeldet. Die Leitstelle hat dir Sprecherlaubnis erteilt.
Grundsätzliche Möglichkeiten:
- Nachforderung weiterer Kräfte
- Rückfrage zu Einsatzdetails
- Transportziel-Anfrage
- Lagemeldung
- Technische Probleme

GENERIERE EINE PASSENDE FUNKMELDUNG basierend auf der aktuellen Situation.`;
                break;
                
            case 'lagemeldung':
                contextInstructions = `
Du bist gerade am Einsatzort eingetroffen (FMS 4).
GENERIERE EINE LAGEMELDUNG mit:
- Anzahl Patienten
- Erste Einschätzung der Lage
- Ob weitere Kräfte benötigt werden
- Was du jetzt machst (beginnen mit Versorgung)`;
                break;
                
            case 'transportziel_anfrage':
                contextInstructions = `
Du hast den Patienten aufgenommen (FMS 7).
GENERIERE EINE FUNKMELDUNG zur Transportziel-Anfrage mit:
- Patientenzustand (stabil/kritisch)
- Dringlichkeit
- Anfrage nach Transportziel`;
                break;
                
            case 'response_to_dispatch':
                // 📡 v2.1: VERBESSERTER PROMPT - BEANTWORTE FRAGEN!
                contextInstructions = `
Die Leitstelle hat dir eine Nachricht gesendet.

⚠️ WICHTIG - FUNKDISZIPLIN:
- Wenn die Leitstelle eine FRAGE stellt → BEANTWORTE sie präzise!
- Bei "Frage Status?" → Nenne deinen aktuellen FMS-Status und was du machst
- Bei "Wo seid ihr?" → Nenne deine Position
- Bei "Benötigt ihr Unterstützung?" → Antworte JA oder NEIN mit Begründung
- Bei Anweisungen → Quittiere mit "verstanden" und bestätige Ausführung

BEISPIELE:
- Frage: "Frage Status?" → "${vehicle.callsign} an Leitstelle, FMS ${fmsCode || vehicle.currentStatus}, ${currentStatusName}, kommen"
- Frage: "Benötigt ihr weitere Kräfte?" → "${vehicle.callsign} an Leitstelle, negativ, keine weiteren Kräfte erforderlich, kommen"
- Anweisung: "Fahrt Klinikum an" → "${vehicle.callsign} von Leitstelle, verstanden, fahren Klinikum an, Ende"

GENERIERE JETZT EINE ANGEMESSENE ANTWORT AUF DIE NACHRICHT DER LEITSTELLE!`;
                break;

            default:
                contextInstructions = `
GENERIERE EINE PASSENDE FUNKMELDUNG für die aktuelle Situation.`;
        }

        basePrompt += contextInstructions;

        basePrompt += `

FUNKSPRACHE-REGELN:
1. Beginne mit "${vehicle.callsign} an Leitstelle" (bei eigener Meldung) oder "${vehicle.callsign} von Leitstelle" (bei Quittierung)
2. Maximal 2-3 kurze Sätze
3. Verwende Funksprache: "kommen" (bei Fragen/Meldungen), "verstanden", "Ende" (bei Quittierung)
4. Professionell und sachlich
5. Keine Umgangssprache
6. Konkret und präzise
7. BEANTWORTE FRAGEN DIREKT - nicht nur quittieren!

BEISPIELE GUTER FUNKSPRÜCHE:
- "RTW 12/83-1 an Leitstelle, am Einsatzort eingetroffen, 1 Patient mit Atemnot angetroffen, beginnen mit Versorgung, kommen"
- "NEF 71/1 an Leitstelle, Patient stabil, benötigen Transportziel, kommen"
- "RTW 45/1 von Leitstelle, verstanden, fahren Klinikum Stuttgart an, Ende"
- "Kdow 1/10-1 an Leitstelle, FMS 2, einsatzbereit auf Wache, kommen"

GENERIERE NUR DEN FUNKSPRUCH ohne Erklärung oder Kommentar:`;

        return basePrompt;
    },

    /**
     * Ruft die Groq API auf
     */
    async callGroqAPI(prompt) {
        const settings = this.config?.groq_settings || {
            model: 'llama-3.3-70b-versatile',
            temperature: 0.4,
            max_tokens: 200,
            timeout_ms: 10000
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), settings.timeout_ms);

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: [
                        { 
                            role: 'system', 
                            content: '📡 Du bist eine professionelle Rettungsdienst-Besatzung mit perfekter Funkdisziplin. Generiere NUR den Funkspruch ohne Zusatztext. BEANTWORTE FRAGEN DIREKT!' 
                        },
                        { 
                            role: 'user', 
                            content: prompt 
                        }
                    ],
                    temperature: settings.temperature,
                    max_tokens: settings.max_tokens
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API Error ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            let funkspruch = data.choices[0].message.content.trim();

            // Entferne eventuell vorhandene Anführungszeichen
            funkspruch = funkspruch.replace(/^"|"$/g, '');

            return funkspruch;

        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    },

    /**
     * 📡 v2.1: Verbesserte Fallback-Funksprüche
     */
    getFallbackResponse(vehicle, context) {
        const { reason, fmsCode, lastDispatchMessage } = context;
        
        // 📡 v2.1: FMS-Status-Namen
        const fmsStatusNames = {
            0: 'Notfall',
            1: 'einsatzbereit auf Funkwache',
            2: 'einsatzbereit auf Wache',
            3: 'Einsatzfahrt',
            4: 'am Einsatzort',
            5: 'Sprechwunsch',
            6: 'nicht einsatzbereit',
            7: 'Patient aufgenommen',
            8: 'Transportfahrt'
        };
        
        const currentStatusName = fmsStatusNames[fmsCode || vehicle.currentStatus] || 'Status unbekannt';

        // 📡 v2.1: Intelligentere Fallbacks basierend auf Nachricht
        if (reason === 'response_to_dispatch' && lastDispatchMessage) {
            const msg = lastDispatchMessage.toLowerCase();
            
            // Status-Anfrage
            if (msg.includes('status') || msg.includes('fms')) {
                return `${vehicle.callsign} an Leitstelle, FMS ${fmsCode || vehicle.currentStatus}, ${currentStatusName}, kommen`;
            }
            
            // Positions-Anfrage
            if (msg.includes('wo') || msg.includes('position')) {
                return `${vehicle.callsign} an Leitstelle, befinden uns ${currentStatusName}, kommen`;
            }
            
            // Unterstützungs-Anfrage
            if (msg.includes('unterstützung') || msg.includes('kräfte') || msg.includes('hilfe')) {
                return `${vehicle.callsign} an Leitstelle, negativ, keine weiteren Kräfte erforderlich, kommen`;
            }
        }

        const fallbacks = {
            'sprechwunsch': `${vehicle.callsign} an Leitstelle, möchte mit der Leitstelle sprechen, kommen`,
            'sprechwunsch_priorisiert': `${vehicle.callsign} an Leitstelle, dringender Sprechwunsch, kommen`,
            'lagemeldung': `${vehicle.callsign} an Leitstelle, am Einsatzort eingetroffen, 1 Patient angetroffen, beginnen mit Versorgung, kommen`,
            'transportziel_anfrage': `${vehicle.callsign} an Leitstelle, Patient aufgenommen und stabil, benötigen Transportziel, kommen`,
            'response_to_dispatch': `${vehicle.callsign} von Leitstelle, verstanden, Ende`
        };

        return fallbacks[reason] || `${vehicle.callsign} an Leitstelle, verstanden, Ende`;
    },

    /**
     * Validiert ob API-Key vorhanden ist
     */
    isAvailable() {
        // 🔧 v2.0: Versuche nachladen falls nicht vorhanden
        if (!this.apiKey) {
            this.reloadApiKey();
        }
        return !!this.apiKey;
    },

    /**
     * Setzt einen neuen API-Key
     */
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('groqApiKey', key);
        console.log('✅ Groq API Key gesetzt');
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', async () => {
        await RadioGroq.initialize();
        console.log('✅ RadioGroq v2.1 bereit - Perfekte Funkdisziplin!');
    });
}

console.log('✅ radio-groq.js v2.1 geladen - Verbesserte Funkdisziplin!');
