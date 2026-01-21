// =========================
// EMERGENCY CALL SYSTEM v2.0
// Anrufe jetzt in Sidebar mit Inline-Fahrzeugauswahl
// =========================

const CallSystem = {
    activeCall: null,
    callQueue: [],
    isGenerating: false,
    ringtoneAudio: null,
    callHistory: [],
    hasAskedLocation: false,
    currentProtocolSeparator: null,

    initialize() {
        console.log('📞 Call System v2.0 initialisiert');
        this.setupRingtone();
    },

    setupRingtone() {
        this.ringtoneAudio = new Audio('sounds/ringtone.mp3');
        this.ringtoneAudio.loop = true;
    },

    async generateIncomingCall() {
        if (this.activeCall || this.isGenerating) {
            console.log('⚠️ Anruf wird übersprungen - Leitung besetzt');
            return;
        }

        this.isGenerating = true;
        console.group('📞 GENERATING CALL');

        try {
            const callData = await this.createCallWithGroq();
            if (!callData) {
                this.isGenerating = false;
                console.groupEnd();
                return;
            }

            this.showIncomingCallInSidebar(callData);
            console.groupEnd();
        } catch (error) {
            console.error('❌ Fehler:', error);
            console.groupEnd();
        } finally {
            this.isGenerating = false;
        }
    },

    async createCallWithGroq() {
        const currentTime = IncidentNumbering.getCurrentTimestamp();
        const hour = parseInt(currentTime.split(':')[0]);
        
        let timeOfDay = 'Tag';
        if (hour >= 22 || hour < 6) timeOfDay = 'Nacht';
        else if (hour >= 18) timeOfDay = 'Abend';

        const randomSeed = Math.random().toString(36).substring(2, 15);
        const scenarios = this.getRandomScenarios();
        const locations = this.getRandomLocations();

        const prompt = `Erstelle einen realistischen Notruf für ILS Rems-Murr-Kreis.

Session: ${randomSeed}
Uhrzeit: ${currentTime} (${timeOfDay})
VORSCHLÄGE: ${scenarios.join(', ')}
ORTE: ${locations.join(', ')}

ANTWORTE NUR als JSON:
{
  "anrufer": {
    "name": "Vor- Nachname",
    "telefon": "0151-XXXXXXX",
    "emotion": "ruhig|aufgeregt|panisch|verwirrt"
  },
  "antworten": {
    "ort": "Genaue Adresse",
    "was_passiert": "Was ist passiert",
    "wie_viele": "Anzahl Betroffene",
    "bewusstsein": "Bewusstseinslage",
    "atmung": "Atmung",
    "blutung": "Blutungen",
    "schmerzen": "Schmerzen wo",
    "vorerkrankungen": "Bekannte Erkrankungen",
    "medikamente": "Medikamente",
    "allergien": "Allergien",
    "schwangerschaft": "Schwanger",
    "diabetes": "Diabetes",
    "epilepsie": "Epilepsie",
    "herzerkrankung": "Herzerkrankung",
    "sturz_hoehe": "Sturzhöhe",
    "aufprall": "Wo aufgeprallt",
    "eingeklemmt": "Eingeklemmt",
    "airbag": "Airbag ausgelöst",
    "feuer": "Feuer/Rauch",
    "gefahrstoffe": "Gefahrstoffe",
    "waffe": "Waffe",
    "gewalt": "Gewalt",
    "erreichbarkeit": "Anfahrt",
    "stockwerk": "Stockwerk/Aufzug"
  },
  "einsatz": {
    "stichwort": "Passendes Stichwort",
    "ort": "Straße, Stadt",
    "koordinaten": {"lat": 48.xxx, "lon": 9.xxx},
    "meldebild": "Zusammenfassung"
  },
  "empfehlung": {
    "rtw": 1,
    "nef": 0,
    "ktw": 0
  }
}`;

        try {
            const response = await this.callGroqAPI(prompt);
            return response;
        } catch (error) {
            console.error('❌ Groq Fehler:', error);
            return null;
        }
    },

    getRandomScenarios() {
        const all = [
            'Herzinfarkt', 'Verkehrsunfall', 'Sturz Treppe', 'Atemnot Kind',
            'Schlaganfall', 'Unterzuckerung', 'Allergie', 'Verbrennung',
            'Schnittverletzung', 'Bewusstlos', 'Krampfanfall', 'Ertrinken'
        ];
        return all.sort(() => 0.5 - Math.random()).slice(0, 3);
    },

    getRandomLocations() {
        const all = [
            'Hauptstraße, Waiblingen', 'Bahnhof Backnang', 'Sportplatz Winnenden',
            'Freibad Schorndorf', 'Industriegebiet Fellbach'
        ];
        return all.sort(() => 0.5 - Math.random()).slice(0, 2);
    },

    async callGroqAPI(prompt) {
        const apiKey = CONFIG.GROQ_API_KEY || localStorage.getItem('groq_api_key');
        if (!apiKey) return null;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'Antworte NUR als JSON ohne Text drumherum.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 1.0,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    },

    showIncomingCallInSidebar(callData) {
        this.activeCall = callData;
        
        const container = document.getElementById('call-list');
        if (!container) return;

        // Clear "no data"
        container.innerHTML = '';

        // Separator für neuen Anruf
        if (this.currentProtocolSeparator) {
            this.currentProtocolSeparator.remove();
        }

        const callDiv = document.createElement('div');
        callDiv.className = 'incoming-call-card';
        callDiv.innerHTML = `
            <div class="call-card-header">
                <span class="call-badge blinking">📞 NOTRUF 112</span>
                <button class="btn-answer" onclick="CallSystem.answerCall()">
                    <i class="fas fa-phone"></i> ANNEHMEN
                </button>
            </div>
            <div class="call-card-time">${IncidentNumbering.getCurrentTimestamp()}</div>
        `;

        container.appendChild(callDiv);
        this.playRingtone();
    },

    playRingtone() {
        if (this.ringtoneAudio) {
            this.ringtoneAudio.play().catch(e => console.log('Autoplay blockiert'));
        }
    },

    stopRingtone() {
        if (this.ringtoneAudio) {
            this.ringtoneAudio.pause();
            this.ringtoneAudio.currentTime = 0;
        }
    },

    answerCall() {
        if (!this.activeCall) return;

        console.log('📞 Anruf angenommen');
        this.stopRingtone();
        this.hasAskedLocation = false;

        const container = document.getElementById('call-list');
        container.innerHTML = '';

        // Separator für alten Anruf
        if (this.currentProtocolSeparator) {
            const separator = document.createElement('div');
            separator.className = 'protocol-separator';
            separator.innerHTML = '<hr><span>VORHERIGER EINSATZ</span><hr>';
            container.insertBefore(separator, container.firstChild);
        }

        this.currentProtocolSeparator = this.showCallInterface();
    },

    showCallInterface() {
        const container = document.getElementById('call-list');
        
        const interfaceDiv = document.createElement('div');
        interfaceDiv.className = 'call-interface';
        interfaceDiv.innerHTML = `
            <!-- Gesprächsprotokoll -->
            <div class="call-messages" id="call-messages">
                <div class="msg-dispatcher">
                    <strong>👨‍💻 Sie:</strong> Notruf Feuerwehr und Rettungsdienst, wo ist der Notfallort?
                </div>
            </div>

            <!-- Fragen-Kategorien -->
            <div class="question-panel">
                <h4>📝 Fragen stellen</h4>
                <div id="question-categories"></div>
            </div>

            <!-- Protokoll-Formular -->
            <div class="protocol-panel">
                <h4>📋 Einsatzprotokoll</h4>
                <div id="protocol-fields">
                    <div class="form-group">
                        <label>Einsatznummer:</label>
                        <input type="text" id="protocol-nummer" readonly>
                    </div>
                    <div class="form-group">
                        <label>Stichwort: <small>(Tippen zum Filtern)</small></label>
                        <input type="text" id="stichwort-search" placeholder="Stichwort suchen...">
                        <div id="stichwort-results" class="stichwort-dropdown"></div>
                        <input type="hidden" id="protocol-stichwort">
                    </div>
                    <div class="form-group">
                        <label>Ort:</label>
                        <input type="text" id="protocol-ort" readonly>
                    </div>
                    <div class="form-group">
                        <label>Meldebild:</label>
                        <textarea id="protocol-meldebild" rows="3" readonly></textarea>
                    </div>
                </div>

                <!-- INLINE FAHRZEUGAUSWAHL -->
                <div id="inline-vehicle-selection">
                    <h5>🚑 Fahrzeuge disponieren</h5>
                    <div id="vehicle-grid"></div>
                    <button class="btn btn-success" onclick="CallSystem.alarmSelectedVehicles()" id="alarm-btn" disabled>
                        <i class="fas fa-bell"></i> ALARMIEREN
                    </button>
                </div>
            </div>

            <button class="btn btn-danger" onclick="CallSystem.hangUp()">
                <i class="fas fa-phone-slash"></i> GESPRÄCH BEENDEN
            </button>
        `;

        container.appendChild(interfaceDiv);

        // Initialisiere Komponenten
        setTimeout(() => {
            this.displayCallerLocation();
            this.initQuestionCategories();
            this.initProtocolFields();
            this.initStichwortSearch();
            this.initVehicleSelection();
        }, 500);

        return interfaceDiv;
    },

    displayCallerLocation() {
        if (!this.activeCall) return;
        
        const container = document.getElementById('call-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg-caller';
        msgDiv.innerHTML = `${this.getEmotionIcon()} <span class="typing"></span>`;
        container.appendChild(msgDiv);

        const textSpan = msgDiv.querySelector('.typing');
        this.typeText(textSpan, this.activeCall.antworten.ort);

        // Update Protokoll
        document.getElementById('protocol-ort').value = this.activeCall.einsatz.ort;
        document.getElementById('protocol-meldebild').value = this.activeCall.einsatz.meldebild;
        document.getElementById('protocol-nummer').value = IncidentNumbering.generateNumber();
    },

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

    getEmotionIcon() {
        const icons = { 'ruhig': '🗣️', 'aufgeregt': '😰', 'panisch': '😱', 'verwirrt': '😕' };
        return icons[this.activeCall?.anrufer.emotion] || '🗣️';
    },

    initQuestionCategories() {
        const container = document.getElementById('question-categories');
        if (!container) return;

        const categories = [
            {
                name: '🚨 Situation',
                questions: [
                    { key: 'was_passiert', text: 'Was ist genau passiert?' },
                    { key: 'wie_viele', text: 'Wie viele Personen betroffen?' },
                    { key: 'gefahrstoffe', text: 'Gefahrstoffe/Chemikalien?' },
                    { key: 'feuer', text: 'Feuer oder Rauch vorhanden?' },
                    { key: 'gewalt', text: 'Gewalteinwirkung?' },
                    { key: 'waffe', text: 'Waffen im Spiel?' }
                ]
            },
            {
                name: '🩺 Patient',
                questions: [
                    { key: 'bewusstsein', text: 'Bei Bewusstsein?' },
                    { key: 'atmung', text: 'Normale Atmung?' },
                    { key: 'blutung', text: 'Blutungen?' },
                    { key: 'schmerzen', text: 'Wo Schmerzen?' }
                ]
            },
            {
                name: '💊 Medizinisch',
                questions: [
                    { key: 'vorerkrankungen', text: 'Vorerkrankungen?' },
                    { key: 'medikamente', text: 'Medikamente?' },
                    { key: 'allergien', text: 'Allergien?' },
                    { key: 'diabetes', text: 'Diabetes?' },
                    { key: 'epilepsie', text: 'Epilepsie?' },
                    { key: 'herzerkrankung', text: 'Herzerkrankung?' },
                    { key: 'schwangerschaft', text: 'Schwanger?' }
                ]
            },
            {
                name: '🚗 Unfall',
                questions: [
                    { key: 'sturz_hoehe', text: 'Sturzhöhe?' },
                    { key: 'aufprall', text: 'Wo aufgeprallt?' },
                    { key: 'eingeklemmt', text: 'Eingeklemmt?' },
                    { key: 'airbag', text: 'Airbag ausgelöst?' }
                ]
            },
            {
                name: '📍 Einsatzstelle',
                questions: [
                    { key: 'erreichbarkeit', text: 'Wie erreichen?' },
                    { key: 'stockwerk', text: 'Stockwerk/Aufzug?' }
                ]
            }
        ];

        categories.forEach(cat => {
            const catDiv = document.createElement('div');
            catDiv.className = 'question-cat';
            catDiv.innerHTML = `
                <div class="cat-header" onclick="this.nextElementSibling.classList.toggle('open')">
                    ${cat.name} <span class="arrow">▼</span>
                </div>
                <div class="cat-questions">
                    ${cat.questions.map(q => `
                        <button class="q-btn" onclick="CallSystem.askQuestion('${q.key}', '${q.text}')">
                            ${q.text}
                        </button>
                    `).join('')}
                </div>
            `;
            container.appendChild(catDiv);
        });
    },

    askQuestion(key, text) {
        const container = document.getElementById('call-messages');
        
        // Dispatcher Frage
        const qDiv = document.createElement('div');
        qDiv.className = 'msg-dispatcher';
        qDiv.innerHTML = `<strong>👨‍💻 Sie:</strong> ${text}`;
        container.appendChild(qDiv);

        // Antwort
        setTimeout(() => {
            const answer = this.activeCall.antworten[key] || 'Keine Angabe';
            const aDiv = document.createElement('div');
            aDiv.className = 'msg-caller';
            aDiv.innerHTML = `${this.getEmotionIcon()} <span class="typing"></span>`;
            container.appendChild(aDiv);

            this.typeText(aDiv.querySelector('.typing'), answer);
            container.scrollTop = container.scrollHeight;
        }, 1000);
    },

    initProtocolFields() {
        // Bereits in displayCallerLocation() gefüllt
    },

    initStichwortSearch() {
        const input = document.getElementById('stichwort-search');
        const results = document.getElementById('stichwort-results');
        const hidden = document.getElementById('protocol-stichwort');

        const stichworte = [
            'Herzinfarkt', 'Schlaganfall', 'Atemnot', 'Bewusstlosigkeit',
            'Verkehrsunfall', 'Sturz', 'Verbrennung', 'Vergiftung',
            'Allergie', 'Krampfanfall', 'Unterzuckerung', 'Badeunfall'
        ];

        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            results.innerHTML = '';

            if (query.length < 2) {
                results.style.display = 'none';
                return;
            }

            const filtered = stichworte.filter(s => s.toLowerCase().includes(query));
            
            if (filtered.length === 0) {
                results.style.display = 'none';
                return;
            }

            filtered.forEach(stichwort => {
                const item = document.createElement('div');
                item.className = 'stichwort-item';
                item.textContent = stichwort;
                item.onclick = () => {
                    input.value = stichwort;
                    hidden.value = stichwort;
                    results.style.display = 'none';
                };
                results.appendChild(item);
            });

            results.style.display = 'block';
        });
    },

    initVehicleSelection() {
        const grid = document.getElementById('vehicle-grid');
        if (!grid) return;

        const empfehlung = this.activeCall.empfehlung;
        
        // RTW Auswahl
        if (empfehlung.rtw > 0) {
            this.addVehicleTypeToGrid(grid, 'RTW', empfehlung.rtw);
        }
        if (empfehlung.nef > 0) {
            this.addVehicleTypeToGrid(grid, 'NEF', empfehlung.nef);
        }
        if (empfehlung.ktw > 0) {
            this.addVehicleTypeToGrid(grid, 'KTW', empfehlung.ktw);
        }
    },

    addVehicleTypeToGrid(grid, type, count) {
        const vehicles = GAME_DATA.vehicles.filter(v => 
            v.type === type && v.status === 'available'
        ).slice(0, 5); // Max 5 Vorschläge

        const typeDiv = document.createElement('div');
        typeDiv.className = 'vehicle-type-section';
        typeDiv.innerHTML = `
            <h6>${type} (${count}x empfohlen)</h6>
            <div class="vehicle-cards">
                ${vehicles.map(v => `
                    <div class="vehicle-card" data-id="${v.id}" onclick="CallSystem.toggleVehicle('${v.id}')">
                        <div class="vehicle-icon">🚑</div>
                        <div class="vehicle-name">${v.name}</div>
                        <div class="vehicle-eta">ETA: ${this.calculateETA(v)}min</div>
                    </div>
                `).join('')}
            </div>
        `;
        grid.appendChild(typeDiv);
    },

    selectedVehicles: [],

    toggleVehicle(id) {
        const card = document.querySelector(`.vehicle-card[data-id="${id}"]`);
        if (!card) return;

        if (this.selectedVehicles.includes(id)) {
            this.selectedVehicles = this.selectedVehicles.filter(v => v !== id);
            card.classList.remove('selected');
        } else {
            this.selectedVehicles.push(id);
            card.classList.add('selected');
        }

        document.getElementById('alarm-btn').disabled = this.selectedVehicles.length === 0;
    },

    calculateETA(vehicle) {
        // Placeholder - später mit echter Berechnung
        return Math.floor(Math.random() * 10) + 2;
    },

    alarmSelectedVehicles() {
        if (this.selectedVehicles.length === 0) return;

        console.log('🚨 Alarmiere Fahrzeuge:', this.selectedVehicles);
        
        // Erstelle Einsatz
        const incident = {
            id: document.getElementById('protocol-nummer').value,
            stichwort: document.getElementById('protocol-stichwort').value,
            ort: document.getElementById('protocol-ort').value,
            meldebild: document.getElementById('protocol-meldebild').value,
            koordinaten: this.activeCall.einsatz.koordinaten,
            vehicles: this.selectedVehicles,
            zeitstempel: IncidentNumbering.getCurrentTimestamp()
        };

        // Füge zu GAME_DATA.incidents hinzu
        if (typeof GAME_DATA !== 'undefined') {
            GAME_DATA.incidents.push(incident);
            
            // Update Fahrzeuge
            this.selectedVehicles.forEach(vId => {
                const vehicle = GAME_DATA.vehicles.find(v => v.id === vId);
                if (vehicle) {
                    vehicle.status = 'dispatched';
                    vehicle.incident = incident.id;
                    vehicle.targetLocation = incident.koordinaten;
                }
            });

            // Update UI
            if (typeof UI !== 'undefined') {
                UI.updateIncidentList();
            }

            // Funkspruch
            this.sendRadioMessage(incident);
        }

        this.hangUp();
    },

    sendRadioMessage(incident) {
        const msg = `Florian Leitstelle an ${incident.vehicles.length} Fahrzeug(e): ${incident.stichwort}, ${incident.ort}. Kommen!`;
        
        if (typeof addRadioMessage === 'function') {
            addRadioMessage(msg, 'dispatcher');
        }
    },

    hangUp() {
        console.log('📞 Gespräch beendet');
        this.stopRingtone();
        
        if (this.activeCall) {
            this.callHistory.push(this.activeCall);
        }
        
        this.activeCall = null;
        this.selectedVehicles = [];
        
        const container = document.getElementById('call-list');
        if (container.querySelector('.call-interface')) {
            // Zeige "Anruf beendet" Hinweis
            const endDiv = document.createElement('div');
            endDiv.className = 'call-ended';
            endDiv.innerHTML = '<i class="fas fa-check"></i> Einsatz disponiert';
            container.appendChild(endDiv);

            setTimeout(() => {
                container.innerHTML = '<p class="no-data">Keine eingehenden Anrufe</p>';
                this.currentProtocolSeparator = null;
            }, 3000);
        }
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        CallSystem.initialize();
    });
}