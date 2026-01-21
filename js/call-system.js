// =========================
// EMERGENCY CALL SYSTEM v2.5
// Realistic Caller Responses
// =========================

const CallSystem = {
    activeCall: null,
    callQueue: [],
    isGenerating: false,
    ringtoneAudio: null,
    callHistory: [],
    selectedVehicles: [],

    initialize() {
        console.log('📞 Call System v2.5 initialisiert');
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

WICHTIG FÜR ANTWORTEN:
- Kurz und bündig (2-8 Wörter)
- Umgangssprache verwenden
- Emotionen zeigen (Panik, Sorge, Verwirrung)
- Realistische Formulierungen wie "Ich weiß nicht genau", "Glaub schon", "Kann ich nicht sagen"
- Bei Unsicherheit: vage Antworten
- Keine medizinischen Fachbegriffe vom Anrufer

BEISPIELE FÜR GUTE ANTWORTEN:
❌ SCHLECHT: "Der Patient hat eine Tachykardie"
✅ GUT: "Sein Herz rast total!"

❌ SCHLECHT: "Ja, die Atmung ist regelrecht"
✅ GUT: "Ja, er atmet noch"

❌ SCHLECHT: "Keine Vorerkrankungen bekannt"
✅ GUT: "Weiß ich nicht" oder "Glaub nicht"

ANTWORTE NUR als JSON:
{
  "anrufer": {
    "name": "Vor- Nachname",
    "telefon": "0151-XXXXXXX",
    "emotion": "ruhig|aufgeregt|panisch|verwirrt"
  },
  "antworten": {
    "ort": "Genaue Adresse in Waiblingen/Winnenden/Schorndorf/Backnang/Fellbach",
    "was_passiert": "Kurze emotionale Beschreibung (max 10 Wörter)",
    "wie_viele": "Eine Person" oder "Zwei Personen" etc.,
    "bewusstsein": "Ja" / "Nein" / "Reagiert nicht mehr",
    "atmung": "Ja" / "Weiß nicht" / "Ganz schwach",
    "blutung": "Ja, stark" / "Ein bisschen" / "Nein",
    "schmerzen": "In der Brust" / "Überall" / "Weiß nicht",
    "vorerkrankungen": "Weiß ich nicht" / "Herz, glaub ich" / "Keine Ahnung",
    "medikamente": "Keine Ahnung" / "Irgendwelche Pillen" / "Weiß nicht",
    "allergien": "Weiß nicht" / "Glaub nicht" / "Keine",
    "schwangerschaft": "Nein" / "Weiß nicht",
    "diabetes": "Weiß nicht" / "Ja, hat er" / "Glaub nicht",
    "epilepsie": "Nein" / "Weiß nicht",
    "herzerkrankung": "Weiß nicht" / "Ja" / "Glaub schon",
    "sturz_hoehe": "Von der Treppe" / "Vielleicht 2 Meter" / "Weiß nicht",
    "aufprall": "Auf dem Boden" / "Mit dem Kopf" / "Weiß nicht",
    "eingeklemmt": "Ja!" / "Nein",
    "airbag": "Ja" / "Nein" / "Weiß nicht",
    "feuer": "Nein" / "Ja, es raucht!" / "Nein",
    "gefahrstoffe": "Nein" / "Weiß nicht",
    "waffe": "Nein",
    "gewalt": "Nein" / "Weiß nicht",
    "erreichbarkeit": "Ganz normal" / "Hinterhof" / "2. Stock",
    "stockwerk": "Erdgeschoss" / "3. Stock" / "Weiß nicht"
  },
  "einsatz": {
    "stichwort": "Passendes Stichwort",
    "ort": "Straße Nummer, Stadt (MUSS eine der genannten Städte sein!)",
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
        const apiKey = CONFIG.GROQ_API_KEY || localStorage.getItem('groq_api_key') || localStorage.getItem('groqApiKey');
        if (!apiKey) {
            console.error('❌ Kein Groq API Key gefunden');
            return null;
        }

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
        
        const callList = document.getElementById('call-list');
        if (!callList) {
            console.error('❌ call-list nicht gefunden');
            return;
        }

        callList.innerHTML = `
            <div class="incoming-call-card" style="padding: 15px; background: rgba(220, 53, 69, 0.2); border: 2px solid #dc3545; border-radius: 8px; cursor: pointer; animation: pulse 1.5s infinite;" onclick="CallSystem.answerCall()">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <i class="fas fa-phone-volume" style="font-size: 24px; color: #dc3545; margin-right: 10px;"></i>
                    <div>
                        <strong style="color: #dc3545; font-size: 1.1em;">EINGEHENDER NOTRUF 112</strong><br>
                        <span style="font-size: 0.9em; color: #999;">${callData.anrufer.telefon}</span>
                    </div>
                </div>
                <button class="btn btn-success" style="width: 100%; margin-top: 10px;" onclick="event.stopPropagation(); CallSystem.answerCall();">
                    <i class="fas fa-phone"></i> ANNEHMEN
                </button>
            </div>
        `;

        const callTabBtn = document.getElementById('call-tab-btn');
        if (callTabBtn) {
            callTabBtn.classList.add('blinking');
        }

        this.playRingtone();
        console.log('🚨 Incoming Call in Sidebar angezeigt');
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

        console.log('📞 Anruf angenommen - Wechsle zu Tab "Notruf"');
        this.stopRingtone();
        this.selectedVehicles = [];

        const callList = document.getElementById('call-list');
        if (callList) {
            callList.innerHTML = '<p class="no-data">Gespräch läuft...</p>';
        }

        const callTabBtn = document.getElementById('call-tab-btn');
        if (callTabBtn) {
            callTabBtn.classList.remove('blinking');
        }

        if (typeof switchTab === 'function') {
            switchTab('call');
        }

        this.showCallInTab();
    },

    showCallInTab() {
        const noActive = document.getElementById('call-no-active');
        const active = document.getElementById('call-active');
        
        if (noActive) noActive.style.display = 'none';
        if (active) active.style.display = 'block';

        this.populateCallDialog();
    },

    populateCallDialog() {
        const messagesContainer = document.getElementById('caller-messages');
        const questionsContainer = document.getElementById('question-buttons');
        const protocolContainer = document.getElementById('protocol-form-content');

        if (!messagesContainer || !questionsContainer || !protocolContainer) return;

        messagesContainer.innerHTML = `
            <div class="msg-dispatcher">
                <strong>👨‍💻 Sie:</strong> Notruf Feuerwehr und Rettungsdienst, wo ist der Notfallort?
            </div>
        `;

        setTimeout(() => {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'msg-caller';
            msgDiv.innerHTML = `${this.getEmotionIcon()} <span class="typing"></span>`;
            messagesContainer.appendChild(msgDiv);

            this.typeText(msgDiv.querySelector('.typing'), this.activeCall.antworten.ort);
        }, 1000);

        this.initQuestionButtons(questionsContainer);
        this.initProtocolForm(protocolContainer);
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

    initQuestionButtons(container) {
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

        container.innerHTML = categories.map(cat => `
            <div class="question-cat">
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
            </div>
        `).join('');
    },

    askQuestion(key, text) {
        const container = document.getElementById('caller-messages');
        
        const qDiv = document.createElement('div');
        qDiv.className = 'msg-dispatcher';
        qDiv.innerHTML = `<strong>👨‍💻 Sie:</strong> ${text}`;
        container.appendChild(qDiv);

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

    initProtocolForm(container) {
        container.innerHTML = `
            <div class="form-group">
                <label>Einsatznummer:</label>
                <input type="text" id="protocol-nummer" value="${IncidentNumbering.generateNumber()}" readonly>
            </div>
            <div class="form-group">
                <label>Stichwort:</label>
                <input type="text" id="stichwort-search" placeholder="Stichwort suchen...">
                <div id="stichwort-results" class="stichwort-dropdown"></div>
                <input type="hidden" id="protocol-stichwort">
            </div>
            <div class="form-group">
                <label>Ort:</label>
                <input type="text" id="protocol-ort" value="${this.activeCall.einsatz.ort}" readonly>
            </div>
            <div class="form-group">
                <label>Meldebild:</label>
                <textarea id="protocol-meldebild" rows="3" readonly>${this.activeCall.einsatz.meldebild}</textarea>
            </div>
            
            <div id="inline-vehicle-selection" style="margin-top: 20px;">
                <h5 style="margin-bottom: 15px;">🚑 Fahrzeuge disponieren</h5>
                <div id="vehicle-grid" style="max-height: 400px; overflow-y: auto; margin-bottom: 15px;"></div>
                <button class="btn btn-success" onclick="CallSystem.alarmSelectedVehicles()" id="alarm-btn" disabled style="width: 100%; padding: 15px; font-size: 1.1em;">
                    <i class="fas fa-bell"></i> ALARMIEREN (<span id="selected-count">0</span> Fahrzeuge)
                </button>
            </div>
        `;

        this.initStichwortSearch();
        this.initVehicleSelection();
    },

    initStichwortSearch() {
        const input = document.getElementById('stichwort-search');
        const results = document.getElementById('stichwort-results');
        const hidden = document.getElementById('protocol-stichwort');

        if (!input || !results || !hidden) return;

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

        const vehicleTypes = ['RTW', 'NEF', 'KTW', 'KDOW', 'GW-SAN'];
        
        vehicleTypes.forEach(type => {
            const count = this.activeCall.empfehlung[type.toLowerCase()] || 0;
            this.addVehicleTypeToGrid(grid, type, count);
        });
    },

    addVehicleTypeToGrid(grid, type, count) {
        const vehicles = GAME_DATA.vehicles.filter(v => {
            const vType = v.type.toUpperCase();
            const searchType = type.toUpperCase();
            return (vType === searchType || vType.includes(searchType)) && 
                   v.status === 'available' && 
                   v.owned;
        });

        if (vehicles.length === 0) return;

        const typeDiv = document.createElement('div');
        typeDiv.className = 'vehicle-type-section';
        typeDiv.innerHTML = `
            <h6 style="margin: 10px 0; color: #a0a0a0;">${type} (${count > 0 ? count + 'x empfohlen' : 'optional'}) - ${vehicles.length} verfügbar</h6>
            <div class="vehicle-cards-improved">
                ${vehicles.map(v => `
                    <div class="vehicle-card-large" data-id="${v.id}" onclick="CallSystem.toggleVehicle('${v.id}')">
                        <div class="vehicle-card-icon">🚑</div>
                        <div class="vehicle-card-name">${v.callsign || v.name}</div>
                        <div class="vehicle-card-station">${v.station || 'Wache'}</div>
                        <div class="vehicle-card-type">${v.type}</div>
                    </div>
                `).join('')}
            </div>
        `;
        grid.appendChild(typeDiv);
    },

    toggleVehicle(id) {
        const card = document.querySelector(`.vehicle-card-large[data-id="${id}"]`);
        if (!card) return;

        if (this.selectedVehicles.includes(id)) {
            this.selectedVehicles = this.selectedVehicles.filter(v => v !== id);
            card.classList.remove('selected');
        } else {
            this.selectedVehicles.push(id);
            card.classList.add('selected');
        }

        const btn = document.getElementById('alarm-btn');
        const countSpan = document.getElementById('selected-count');
        if (btn) btn.disabled = this.selectedVehicles.length === 0;
        if (countSpan) countSpan.textContent = this.selectedVehicles.length;
    },

    alarmSelectedVehicles() {
        if (this.selectedVehicles.length === 0) return;

        console.log('🚨 Alarmiere Fahrzeuge:', this.selectedVehicles);
        
        const incident = {
            id: document.getElementById('protocol-nummer').value,
            stichwort: document.getElementById('protocol-stichwort').value || 'Notfall',
            ort: document.getElementById('protocol-ort').value,
            meldebild: document.getElementById('protocol-meldebild').value,
            koordinaten: this.activeCall.einsatz.koordinaten,
            vehicles: [...this.selectedVehicles],
            zeitstempel: IncidentNumbering.getCurrentTimestamp(),
            status: 'active',
            completed: false
        };

        // NUR zu GAME_DATA hinzufügen (nicht doppelt!)
        if (!GAME_DATA.incidents.find(i => i.id === incident.id)) {
            GAME_DATA.incidents.push(incident);
            console.log('✅ Einsatz hinzugefügt:', incident.id);
        }

        // Fahrzeuge disponieren
        this.selectedVehicles.forEach(vId => {
            const vehicle = GAME_DATA.vehicles.find(v => v.id === vId);
            if (vehicle) {
                console.log(`🚑 Disponiere ${vehicle.callsign || vehicle.name}`);
                vehicle.status = 'dispatched';
                vehicle.incident = incident.id;
                vehicle.targetLocation = incident.koordinaten;

                // VehicleMovement starten
                if (typeof VehicleMovement !== 'undefined' && VehicleMovement.dispatchVehicle) {
                    console.log(`🛫 Starte Bewegung für ${vehicle.callsign}`);
                    VehicleMovement.dispatchVehicle(vId, incident.koordinaten, incident.id);
                } else {
                    console.warn('⚠️ VehicleMovement nicht verfügbar');
                }
            }
        });

        // Funkspruch
        const msg = `${incident.stichwort}, ${incident.ort}. ${incident.vehicles.length} Fahrzeug(e) alarmiert.`;
        if (typeof addRadioMessage === 'function') {
            addRadioMessage('Einsatz ' + incident.id, msg);
        }

        // UI aktualisieren
        if (typeof updateUI === 'function') {
            updateUI();
        }

        this.hangUp();
    },

    hangUp() {
        console.log('📞 Gespräch beendet');
        this.stopRingtone();
        
        if (this.activeCall) {
            this.callHistory.push(this.activeCall);
        }
        
        this.activeCall = null;
        this.selectedVehicles = [];
        
        const noActive = document.getElementById('call-no-active');
        const active = document.getElementById('call-active');
        
        if (noActive) noActive.style.display = 'block';
        if (active) active.style.display = 'none';

        const callList = document.getElementById('call-list');
        if (callList) {
            callList.innerHTML = '<p class="no-data">Keine eingehenden Anrufe</p>';
        }

        if (typeof switchTab === 'function') {
            switchTab('map');
        }
    }
};

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        CallSystem.initialize();
    });
}