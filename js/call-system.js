// =========================
// EMERGENCY CALL SYSTEM
// Verwaltet eingehende Notrufe
// =========================

const CallSystem = {
    activeCall: null,
    callQueue: [],
    isRinging: false,
    isGenerating: false, // NEU: Verhindert doppelte Generierung
    ringtoneInterval: null,
    callHistory: [],

    /**
     * Initialisiert Call System
     */
    initialize() {
        console.log('📞 Call System initialisiert');
        this.setupEventListeners();
    },

    /**
     * Event Listeners
     */
    setupEventListeners() {
        // Answer Button
        const answerBtn = document.getElementById('answer-call-btn');
        if (answerBtn) {
            answerBtn.addEventListener('click', () => this.answerCall());
        }

        // Hang Up Button
        const hangupBtn = document.getElementById('hangup-call-btn');
        if (hangupBtn) {
            hangupBtn.addEventListener('click', () => this.hangUp());
        }
    },

    /**
     * Generiert neuen eingehenden Anruf
     */
    async generateIncomingCall() {
        // WICHTIG: Verhindere gleichzeitige/doppelte Generierung!
        if (this.activeCall || this.isRinging || this.isGenerating) {
            console.log('⚠️ Anruf wird übersprungen - Leitung besetzt oder Generierung läuft');
            return;
        }

        this.isGenerating = true; // Setze Flag
        console.group('📞 GENERATING INCOMING CALL');

        try {
            // Erstelle Groq-Request für kompletten Einsatz
            const callData = await this.createCallWithGroq();
            
            if (!callData) {
                console.error('❌ Groq konnte keinen Anruf erstellen');
                this.isGenerating = false;
                console.groupEnd();
                return;
            }

            // Call anzeigen
            this.showIncomingCall(callData);
            this.startRinging();

            console.log('✅ Anruf wird angezeigt');
            console.groupEnd();

        } catch (error) {
            console.error('❌ Fehler bei Anruf-Generierung:', error);
            console.groupEnd();
        } finally {
            this.isGenerating = false; // Zurücksetzen
        }
    },

    /**
     * Erstellt Anruf mit Groq API
     */
    async createCallWithGroq() {
        // Hole aktuelle Spielzeit
        const currentTime = IncidentNumbering.getCurrentTimestamp();
        const hour = parseInt(currentTime.split(':')[0]);
        
        // Bestimme Tageszeit für Kontext
        let timeOfDay = 'Tag';
        if (hour >= 22 || hour < 6) timeOfDay = 'Nacht';
        else if (hour >= 18) timeOfDay = 'Abend';
        else if (hour >= 6 && hour < 10) timeOfDay = 'Morgen';

        // Verfügbare Fahrzeugtypen
        const availableVehicles = VehicleAnalyzer.getAvailableTypes();

        // Erstelle Prompt für Groq
        const prompt = `Du bist ein Notrufsimulator für die Integrierte Leitstelle Rems-Murr-Kreis.

ERSTELLE einen realistischen Notruf mit folgenden Details:

KONTEXT:
- Ort: Rems-Murr-Kreis (Baden-Württemberg)
- Uhrzeit: ${currentTime} Uhr (${timeOfDay})
- Verfügbare Fahrzeuge: ${availableVehicles.join(', ')}

ANFORDERUNGEN:
1. Wähle ein realistisches Einsatzstichwort (z.B. Verkehrsunfall, Sturz, Herzinfarkt)
2. Erstelle ein Anrufer-Profil (Augenzeuge/Betroffener/Angehöriger)
3. Der Anrufer gibt zu Beginn nur MINIMALE Information ("Es gab einen Unfall!", "Mein Vater atmet nicht mehr!")
4. Erstelle realistische Antworten auf Standard-Fragen
5. Wähle einen Ort im Rems-Murr-Kreis (Stadt, Straße, Landmarke)
6. Koordinaten müssen in diesem Bereich liegen: Lat 48.7-49.1, Lon 9.2-9.7
7. WICHTIG: Erstelle VERSCHIEDENE Einsätze - keine Wiederholungen!

ANTWORTE als JSON:
{
  "anrufer": {
    "typ": "augenzeuge|betroffener|angehoeriger",
    "name": "Vorname Nachname",
    "telefon": "0151-12345678",
    "emotion": "ruhig|aufgeregt|panisch|verwirrt"
  },
  "initial_meldung": "Kurze, aufgeregte erste Meldung (1-2 Sätze)",
  "antworten": {
    "wo": "Antwort auf 'Wo befinden Sie sich?'",
    "was_passiert": "Antwort auf 'Was ist passiert?'",
    "verletzte": "Antwort auf 'Wie viele Personen?'",
    "zustand": "Antwort auf 'Ist jemand bewusstlos?'",
    "gefahren": "Antwort auf 'Gibt es Gefahren?'"
  },
  "einsatz": {
    "kategorie": "herz_kreislauf|trauma|unfaelle|atmung|etc",
    "stichwort_vorschlag": "Passendes Stichwort",
    "ort": "Straße/Adresse, Stadt",
    "koordinaten": {"lat": 48.xxx, "lon": 9.xxx},
    "meldebild": "Zusammenfassung für Protokoll (2-3 Sätze)",
    "besonderheiten": "Wichtige Hinweise",
    "verletzte": {"gesamt": 1, "schwer": 0, "leicht": 1}
  },
  "fahrzeuge": {
    "pflicht": [{"typ": "RTW", "grund": "..."}],
    "optional": [{"typ": "NEF", "grund": "..."}]
  }
}`;

        console.log('🤖 Sende Request an Groq...');
        
        try {
            const response = await this.callGroqAPI(prompt);
            console.log('✅ Groq Response empfangen');
            return response;
        } catch (error) {
            console.error('❌ Groq API Fehler:', error);
            return null;
        }
    },

    /**
     * Ruft Groq API auf
     */
    async callGroqAPI(prompt) {
        // Hole API Key aus Config
        const apiKey = CONFIG.GROQ_API_KEY || localStorage.getItem('groq_api_key');
        
        if (!apiKey) {
            console.error('❌ Kein Groq API Key gefunden');
            return null;
        }

        const startTime = Date.now();

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'Du bist ein Experte für Rettungsdienst-Notrufe. Antworte immer als valides JSON ohne zusätzlichen Text.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.9, // HÖHER für mehr Variation!
                max_tokens: 2000,
                response_format: { type: 'json_object' }
            })
        });

        const responseTime = Date.now() - startTime;
        console.log(`⏱️ Groq Response Time: ${responseTime}ms`);

        if (!response.ok) {
            throw new Error(`Groq API Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        return JSON.parse(content);
    },

    /**
     * Zeigt eingehenden Anruf an
     */
    showIncomingCall(callData) {
        this.activeCall = callData;
        
        // Zeige Incoming Call Popup
        const popup = document.getElementById('incoming-call-popup');
        if (popup) {
            popup.style.display = 'block';
            popup.classList.add('ringing');
        }

        console.log('📞 Anruf wird angezeigt:', callData.anrufer.name);
    },

    /**
     * Startet Klingelton
     */
    startRinging() {
        this.isRinging = true;
        
        // Visual feedback
        const popup = document.getElementById('incoming-call-popup');
        if (popup) {
            popup.classList.add('ringing');
        }

        // Optional: Audio abspielen (falls vorhanden)
        const audio = document.getElementById('ringtone-audio');
        if (audio) {
            audio.loop = true;
            audio.play().catch(e => console.log('Audio autoplay blockiert'));
        }

        console.log('🔔 Klingelton gestartet');
    },

    /**
     * Stoppt Klingelton
     */
    stopRinging() {
        this.isRinging = false;
        
        const popup = document.getElementById('incoming-call-popup');
        if (popup) {
            popup.classList.remove('ringing');
        }

        const audio = document.getElementById('ringtone-audio');
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        console.log('🔕 Klingelton gestoppt');
    },

    /**
     * Anruf annehmen
     */
    answerCall() {
        if (!this.activeCall) return;

        console.group('📞 CALL ANSWERED');
        console.log('📅 Zeit:', IncidentNumbering.getCurrentTimestamp());
        console.log('👤 Anrufer:', this.activeCall.anrufer.name);
        console.log('🎭 Emotion:', this.activeCall.anrufer.emotion);
        console.groupEnd();

        this.stopRinging();
        
        // Verstecke Incoming Call Popup
        const incomingPopup = document.getElementById('incoming-call-popup');
        if (incomingPopup) {
            incomingPopup.style.display = 'none';
        }

        // Zeige Call Dialog
        this.showCallDialog();
    },

    /**
     * Zeigt Call Dialog mit Fragen
     */
    showCallDialog() {
        const dialog = document.getElementById('call-dialog');
        if (!dialog) return;

        dialog.style.display = 'block';

        // Zeige initiale Meldung
        this.displayCallerMessage(this.activeCall.initial_meldung);

        // Zeige Fragen-Buttons
        this.showQuestionButtons();

        // Zeige Protokoll-Form (leer)
        this.showProtocolForm();
    },

    /**
     * Zeigt Anrufer-Nachricht mit Typing-Effekt
     */
    displayCallerMessage(message) {
        const container = document.getElementById('caller-messages');
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'caller-message';
        
        const emotionIcon = this.getEmotionIcon(this.activeCall.anrufer.emotion);
        messageDiv.innerHTML = `<span class="emotion-icon">${emotionIcon}</span><span class="message-text"></span>`;
        
        container.appendChild(messageDiv);

        // Typing effect
        const textSpan = messageDiv.querySelector('.message-text');
        this.typeText(textSpan, message, 30);

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    },

    /**
     * Typing Effekt
     */
    typeText(element, text, speed = 30) {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
            }
        }, speed);
    },

    /**
     * Emotion Icon
     */
    getEmotionIcon(emotion) {
        const icons = {
            'ruhig': '🗣️',
            'aufgeregt': '😰',
            'panisch': '😱',
            'verwirrt': '😕'
        };
        return icons[emotion] || '🗣️';
    },

    /**
     * Zeigt Fragen-Buttons
     */
    showQuestionButtons() {
        const container = document.getElementById('question-buttons');
        if (!container) return;

        container.innerHTML = '';

        const questions = [
            { id: 'wo', text: '📍 Wo befinden Sie sich genau?', key: 'wo' },
            { id: 'was', text: '🚗 Was ist passiert?', key: 'was_passiert' },
            { id: 'verletzte', text: '👥 Wie viele Personen sind betroffen?', key: 'verletzte' },
            { id: 'zustand', text: '🩺 Ist jemand bewusstlos?', key: 'zustand' },
            { id: 'gefahren', text: '⚠️ Gibt es Gefahren?', key: 'gefahren' }
        ];

        questions.forEach(q => {
            const btn = document.createElement('button');
            btn.className = 'question-btn';
            btn.innerHTML = q.text;
            btn.onclick = () => this.askQuestion(q.key, q.text);
            container.appendChild(btn);
        });
    },

    /**
     * Stellt Frage an Anrufer
     */
    askQuestion(key, questionText) {
        console.log(`❓ Frage gestellt: ${questionText}`);

        // Zeige Frage vom Disponenten
        this.displayDispatcherQuestion(questionText);

        // Hole Antwort
        const answer = this.activeCall.antworten[key];
        if (answer) {
            setTimeout(() => {
                this.displayCallerMessage(answer);
                // Update Protokoll basierend auf Antwort
                this.updateProtocolFromAnswer(key, answer);
            }, 1000);
        }
    },

    /**
     * Zeigt Dispatcher-Frage
     */
    displayDispatcherQuestion(question) {
        const container = document.getElementById('caller-messages');
        if (!container) return;

        const questionDiv = document.createElement('div');
        questionDiv.className = 'dispatcher-question';
        questionDiv.innerHTML = `<strong>Sie:</strong> ${question}`;
        container.appendChild(questionDiv);

        container.scrollTop = container.scrollHeight;
    },

    /**
     * Auflegen
     */
    hangUp() {
        console.log('📞 Anruf beendet');

        // Speichere in History
        if (this.activeCall) {
            this.callHistory.push({
                ...this.activeCall,
                endedAt: new Date().toISOString()
            });
        }

        this.activeCall = null;
        this.stopRinging();

        // Verstecke Dialog
        const dialog = document.getElementById('call-dialog');
        if (dialog) {
            dialog.style.display = 'none';
        }
    },

    /**
     * Update Protokoll aus Antwort
     */
    updateProtocolFromAnswer(key, answer) {
        // Wird in protocol-form.js implementiert
        if (typeof ProtocolForm !== 'undefined') {
            ProtocolForm.updateFromCallAnswer(key, answer, this.activeCall);
        }
    },

    /**
     * Zeigt Protokoll-Formular
     */
    showProtocolForm() {
        // Wird in protocol-form.js implementiert
        if (typeof ProtocolForm !== 'undefined') {
            ProtocolForm.showForm(this.activeCall);
        }
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        CallSystem.initialize();
    });
}