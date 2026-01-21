// =========================
// EMERGENCY CALL SYSTEM v2.3
// Mit Sidebar + Tab statt Popup
// =========================

const CallSystem = {
    activeCall: null,
    callQueue: [],
    isGenerating: false,
    ringtoneAudio: null,
    callHistory: [],
    selectedVehicles: [],

    initialize() {
        console.log('📞 Call System v2.3 initialisiert');
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
        
        // Zeige in Sidebar "Eingehende Anrufe"
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

        // Blinkender Tab-Button
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

        // Entferne aus Sidebar
        const callList = document.getElementById('call-list');
        if (callList) {
            callList.innerHTML = '<p class="no-data">Gespräch läuft...</p>';
        }

        // Entferne Blinken
        const callTabBtn = document.getElementById('call-tab-btn');
        if (callTabBtn) {
            callTabBtn.classList.remove('blinking');
        }

        // Wechsle zu Notruf-Tab
        if (typeof switchTab === 'function') {
            switchTab('call');
        }

        // Zeige Gespräch
        this.showCallInTab();
    },

    showCallInTab() {
        const noActive = document.getElementById('call-no-active');
        const active = document.getElementById('call-active');
        
        if (noActive) noActive.style.display = 'none';
        if (active) active.style.display = 'block';

        // Fülle Dialog mit Content
        this.populateCallDialog();
    },

    populateCallDialog() {
        const messagesContainer = document.getElementById('caller-messages');
        const questionsContainer = document.getElementById('question-buttons');
        const protocolContainer = document.getElementById('protocol-form-content');

        if (!messagesContainer || !questionsContainer || !protocolContainer) return;

        // Initial Begrüßung
        messagesContainer.innerHTML = `
            <div class="msg-dispatcher">
                <strong>👨‍💻 Sie:</strong> Notruf Feuerwehr und Rettungsdienst, wo ist der Notfallort?
            </div>
        `;

        // Antwort nach 1 Sekunde
        setTimeout(() => {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'msg-caller';
            msgDiv.innerHTML = `${this.getEmotionIcon()} <span class="typing"></span>`;
            messagesContainer.appendChild(msgDiv);

            this.typeText(msgDiv.querySelector('.typing'), this.activeCall.antworten.ort);
        }, 1000);

        // Frage-Buttons
        this.initQuestionButtons(questionsContainer);

        // Protokoll-Formular
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
            
            <div id="inline-vehicle-selection">
                <h5>🚑 Fahrzeuge disponieren</h5>
                <div id="vehicle-grid"></div>
                <button class="btn btn-success" onclick="CallSystem.alarmSelectedVehicles()" id="alarm-btn" disabled>
                    <i class="fas fa-bell"></i> ALARMIEREN
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

        const empfehlung = this.activeCall.empfehlung;
        
        // ZEIGE ALLE FAHRZEUGTYPEN!
        const vehicleTypes = ['RTW', 'NEF', 'KTW', 'KDOW', 'GW-SAN'];
        
        vehicleTypes.forEach(type => {
            const count = empfehlung[type.toLowerCase()] || 0;
            this.addVehicleTypeToGrid(grid, type, count);
        });
    },

    addVehicleTypeToGrid(grid, type, count) {
        // Hole ALLE verfügbaren Fahrzeuge dieses Typs
        const vehicles = GAME_DATA.vehicles.filter(v => {
            // Prüfe verschiedene Schreibweisen
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
            <h6>${type} (${count > 0 ? count + 'x empfohlen' : 'optional'})</h6>
            <div class="vehicle-cards">
                ${vehicles.map(v => `
                    <div class="vehicle-card" data-id="${v.id}" onclick="CallSystem.toggleVehicle('${v.id}')">
                        <div class="vehicle-icon">🚑</div>
                        <div class="vehicle-name">${v.name || v.callsign}</div>
                        <div class="vehicle-station">${v.station || 'Wache'}</div>
                    </div>
                `).join('')}
            </div>
        `;
        grid.appendChild(typeDiv);
    },

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

        const btn = document.getElementById('alarm-btn');
        if (btn) btn.disabled = this.selectedVehicles.length === 0;
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
            vehicles: this.selectedVehicles,
            zeitstempel: IncidentNumbering.getCurrentTimestamp()
        };

        // Add to GAME_DATA
        if (!GAME_DATA.incidents) {
            GAME_DATA.incidents = [];
        }
        GAME_DATA.incidents.push(incident);

        // Add to map
        if (typeof addIncidentToMap === 'function') {
            addIncidentToMap(incident);
        }

        // Dispatch vehicles
        this.selectedVehicles.forEach(vId => {
            const vehicle = GAME_DATA.vehicles.find(v => v.id === vId);
            if (vehicle) {
                vehicle.status = 'dispatched';
                vehicle.incident = incident.id;
                vehicle.targetLocation = incident.koordinaten;

                // Start movement
                if (typeof VehicleMovement !== 'undefined') {
                    VehicleMovement.dispatchVehicle(vId, incident.koordinaten, incident.id);
                }
            }
        });

        // Update UI
        if (typeof UI !== 'undefined' && UI.updateIncidentList) {
            UI.updateIncidentList();
        }

        // Radio message
        this.sendRadioMessage(incident);

        this.hangUp();
    },

    sendRadioMessage(incident) {
        const msg = `Florian Leitstelle an ${incident.vehicles.length} Fahrzeug(e): ${incident.stichwort}, ${incident.ort}. Kommen!`;
        
        if (typeof addRadioMessage === 'function') {
            addRadioMessage('Leitstelle', msg);
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
        
        // Zurück zur leeren Ansicht
        const noActive = document.getElementById('call-no-active');
        const active = document.getElementById('call-active');
        
        if (noActive) noActive.style.display = 'block';
        if (active) active.style.display = 'none';

        // Sidebar zurücksetzen
        const callList = document.getElementById('call-list');
        if (callList) {
            callList.innerHTML = '<p class="no-data">Keine eingehenden Anrufe</p>';
        }

        // Wechsle zurück zur Karte
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