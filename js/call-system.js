// =========================
// EMERGENCY CALL SYSTEM v3.1
// Meldebild erst nach Fragen generieren
// =========================

const CallSystem = {
    activeCall: null,
    callQueue: [],
    isGenerating: false,
    ringtoneAudio: null,
    callHistory: [],
    selectedVehicles: [],
    askedQuestions: [],

    initialize() {
        console.log('📞 Call System v3.1 initialisiert');
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
        console.group('📞 GENERATING CALL WITH GEOCODING');

        try {
            const callData = await this.createCallWithGroq();
            if (!callData) {
                this.isGenerating = false;
                console.groupEnd();
                return;
            }

            // REVERSE GEOCODING: Koordinaten → Adresse
            console.log('🗺️ Hole echte Adresse für Koordinaten:', callData.einsatz.koordinaten);
            const realAddress = await this.reverseGeocode(callData.einsatz.koordinaten.lat, callData.einsatz.koordinaten.lon);
            
            if (realAddress) {
                console.log('✅ Echte Adresse:', realAddress);
                callData.einsatz.ort = realAddress;
                callData.antworten.ort = realAddress;
            } else {
                console.warn('⚠️ Geocoding fehlgeschlagen, nutze AI-Adresse');
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

    async reverseGeocode(lat, lon) {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'ILS-Waiblingen-Simulator/1.0'
                }
            });

            if (!response.ok) {
                console.error('❌ Nominatim Error:', response.status);
                return null;
            }

            const data = await response.json();
            
            if (!data || !data.address) {
                console.error('❌ Keine Adresse gefunden');
                return null;
            }

            const addr = data.address;
            const street = addr.road || addr.pedestrian || addr.footway || 'Unbekannte Straße';
            const houseNumber = addr.house_number || '';
            const city = addr.city || addr.town || addr.village || 'Waiblingen';
            
            return `${street} ${houseNumber}, ${city}`.trim();
        } catch (error) {
            console.error('❌ Geocoding Fehler:', error);
            return null;
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

        const prompt = `Erstelle einen realistischen Notruf für ILS Rems-Murr-Kreis.

Session: ${randomSeed}
Uhrzeit: ${currentTime} (${timeOfDay})
SZENARIEN: ${scenarios.join(', ')}

WICHTIG FÜR KOORDINATEN:
- Rems-Murr-Kreis: Latitude 48.8 - 49.0, Longitude 9.2 - 9.6
- Waiblingen: ~48.83, 9.32
- Backnang: ~48.95, 9.43
- Winnenden: ~48.88, 9.40
- Schorndorf: ~48.81, 9.53
- Fellbach: ~48.81, 9.27

WICHTIG FÜR ANRUFER-ANTWORTEN:
- Länge: 5-15 Wörter pro Antwort
- Umgangssprache und Dialekt erlaubt
- Emotionen zeigen (Panik, Sorge, Nervosität)
- Realistische Sätze wie:
  * "Ich weiß es nicht genau, aber..."
  * "Also... äh... ich glaub schon"
  * "Moment, ich schau nochmal... ja!"
  * "Kann ich nicht sagen, ich seh das nicht"
  * "Er sagt, es tut wahnsinnig weh"
  * "Die blutet ganz stark am Kopf"
- KEINE medizinischen Fachbegriffe!
- Bei Unsicherheit: vage bleiben
- Realistisch stocken/wiederholen

ANTWORTE NUR als JSON:
{
  "anrufer": {
    "name": "Vor- Nachname",
    "telefon": "0151-XXXXXXX",
    "emotion": "ruhig|aufgeregt|panisch|verwirrt"
  },
  "antworten": {
    "ort": "DUMMY",
    "was_passiert": "Längere emotionale Beschreibung (8-15 Wörter)",
    "wie_viele": "Eine Person" / "Zwei Leute" / "Drei oder vier, weiß nicht genau",
    "bewusstsein": "Ja, wach" / "Nein, reagiert nicht" / "Also... er macht die Augen auf, aber antwortet nicht richtig",
    "atmung": "Ja, atmet normal" / "Weiß nicht genau... scheint schwach zu sein" / "Ja, aber ganz schnell und flach",
    "blutung": "Ja, ganz stark am Kopf!" / "Ein bisschen, aber nicht viel" / "Nein, sehe keine",
    "schmerzen": "Sagt er hat wahnsinnige Schmerzen in der Brust" / "Am ganzen Körper" / "Weiß nicht, kann nicht sprechen",
    "vorerkrankungen": "Keine Ahnung, ich kenn den nicht" / "Der hat was am Herzen, glaub ich" / "Weiß ich nicht genau",
    "medikamente": "Keine Ahnung ehrlich" / "Ja, irgendwelche Pillen, weiß aber nicht was" / "Weiß nicht",
    "allergien": "Weiß ich nicht" / "Glaub nicht, aber sicher bin ich nicht" / "Keine, hat er gesagt",
    "schwangerschaft": "Nein" / "Weiß ich nicht" / "Glaub nicht",
    "diabetes": "Moment... ja, der ist Diabetiker!" / "Weiß nicht" / "Glaub schon, ja",
    "epilepsie": "Nein, glaub nicht" / "Weiß ich nicht",
    "herzerkrankung": "Ja, der hatte schon mal einen Infarkt!" / "Weiß nicht" / "Kann sein, bin nicht sicher",
    "sturz_hoehe": "Von der Leiter, vielleicht 3 Meter" / "Die ganze Treppe runter" / "Weiß nicht genau",
    "aufprall": "Mit dem Kopf auf den Boden" / "Auf die Seite" / "Weiß nicht, hab's nicht gesehen",
    "eingeklemmt": "Ja, zwischen den Autos!" / "Nein",
    "airbag": "Ja, ist raus" / "Nein" / "Weiß nicht",
    "feuer": "Nein" / "Ja, es raucht ganz stark!" / "Nein, kein Feuer",
    "gefahrstoffe": "Nein" / "Weiß nicht",
    "waffe": "Nein",
    "gewalt": "Nein" / "Weiß ich nicht",
    "erreichbarkeit": "Ganz normal von der Straße" / "Im Hinterhof, durch das Tor" / "Im 3. Stock, Aufzug geht",
    "stockwerk": "Erdgeschoss" / "4. Stock, links" / "Weiß nicht genau"
  },
  "einsatz": {
    "stichwort": "Passendes Stichwort (Herzinfarkt/Unfall/Sturz/etc.)",
    "koordinaten": {"lat": 48.XXX, "lon": 9.XXX}
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
                temperature: 1.2,
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
        this.askedQuestions = [];

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
        if (active) active.style.display = 'flex';

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

        if (!this.askedQuestions.includes(key)) {
            this.askedQuestions.push(key);
        }

        setTimeout(() => {
            const answer = this.activeCall.antworten[key] || 'Keine Angabe';
            const aDiv = document.createElement('div');
            aDiv.className = 'msg-caller';
            aDiv.innerHTML = `${this.getEmotionIcon()} <span class="typing"></span>`;
            container.appendChild(aDiv);

            this.typeText(aDiv.querySelector('.typing'), answer);
            container.scrollTop = container.scrollHeight;

            // Update Meldebild nach Fragen
            this.updateMeldebild();
        }, 1000);
    },

    updateMeldebild() {
        const meldebildTextarea = document.getElementById('protocol-meldebild');
        if (!meldebildTextarea) return;

        // Generiere Meldebild aus gestellten Fragen
        const parts = [];
        
        if (this.askedQuestions.includes('was_passiert')) {
            parts.push(this.activeCall.antworten.was_passiert);
        }
        if (this.askedQuestions.includes('bewusstsein')) {
            parts.push('Bewusstsein: ' + this.activeCall.antworten.bewusstsein);
        }
        if (this.askedQuestions.includes('atmung')) {
            parts.push('Atmung: ' + this.activeCall.antworten.atmung);
        }

        meldebildTextarea.value = parts.join('. ') || 'Notfall';
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
                <textarea id="protocol-meldebild" rows="3" readonly placeholder="Stellen Sie Fragen, um das Meldebild zu erstellen..."></textarea>
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
            meldebild: document.getElementById('protocol-meldebild').value || 'Notfall',
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

        // Funkspruch (NUR EINMAL!)
        const vehicleNames = this.selectedVehicles.map(vId => {
            const v = GAME_DATA.vehicles.find(vehicle => vehicle.id === vId);
            return v ? v.callsign : '';
        }).filter(Boolean).join(', ');

        const msg = `${incident.stichwort}, ${incident.ort} - Alarmiert: ${vehicleNames}`;
        if (typeof addRadioMessage === 'function') {
            addRadioMessage(msg, 'dispatcher');
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
        this.askedQuestions = [];
        
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