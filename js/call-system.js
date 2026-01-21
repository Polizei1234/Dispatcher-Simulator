// =========================
// EMERGENCY CALL SYSTEM v5.3
// + Integriert ManualIncident.showInline() im Notruf-Tab!
// + Anruf-Chat links, Manual Incident Formular rechts
// + Random Telefonnummern
// + Hotspot-System
// + Geocoding Cache
// =========================

const CallSystem = {
    activeCall: null,
    callQueue: [],
    isGenerating: false,
    ringtoneAudio: null,
    callHistory: [],
    askedQuestions: [],
    geocodeCache: {},
    lastGeocodeRequest: 0,

    HOTSPOT_ZONES: [
        { lat: 48.8309, lon: 9.3165, radius: 0.01, weight: 3, name: "Waiblingen Zentrum" },
        { lat: 48.8250, lon: 9.3200, radius: 0.008, weight: 2, name: "Waiblingen Süd" },
        { lat: 48.8109, lon: 9.2765, radius: 0.01, weight: 2, name: "Fellbach" },
        { lat: 48.8756, lon: 9.4003, radius: 0.012, weight: 3, name: "Winnenden" },
        { lat: 48.9467, lon: 9.4333, radius: 0.015, weight: 2, name: "Backnang" },
        { lat: 48.8070, lon: 9.5290, radius: 0.012, weight: 3, name: "Schorndorf" },
        { lat: 48.8483, lon: 9.3617, radius: 0.006, weight: 1, name: "Korb" },
        { lat: 48.8108, lon: 9.3826, radius: 0.01, weight: 2, name: "Weinstadt" },
        { lat: 48.8183, lon: 9.4000, radius: 0.008, weight: 1, name: "Remshalden" },
        { lat: 48.7950, lon: 9.3383, radius: 0.007, weight: 1, name: "Kernen" },
        { lat: 48.8983, lon: 9.3967, radius: 0.006, weight: 1, name: "Leutenbach" },
        { lat: 48.8767, lon: 9.3500, radius: 0.005, weight: 1, name: "Schwaikheim" }
    ],

    initialize() {
        console.log('📞 Call System v5.3 initialisiert');
        console.log('✅ Nutzt ManualIncident.showInline() im Notruf-Tab!');
        this.setupRingtone();
    },

    setupRingtone() {
        this.ringtoneAudio = new Audio('sounds/ringtone.mp3');
        this.ringtoneAudio.loop = true;
    },

    getRandomHotspot() {
        const totalWeight = this.HOTSPOT_ZONES.reduce((sum, zone) => sum + zone.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const zone of this.HOTSPOT_ZONES) {
            random -= zone.weight;
            if (random <= 0) {
                return zone;
            }
        }
        
        return this.HOTSPOT_ZONES[0];
    },

    generateRandomLocation() {
        const hotspot = this.getRandomHotspot();
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * hotspot.radius;
        const lat = hotspot.lat + (distance * Math.cos(angle));
        const lon = hotspot.lon + (distance * Math.sin(angle));
        
        console.log(`📍 Einsatz generiert in Hotspot: ${hotspot.name}`);
        
        return { lat: lat, lon: lon, hotspot: hotspot.name };
    },

    generatePhoneNumber() {
        const prefixes = ['0711', '07151', '07144', '07181', '07195'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const number = Math.floor(Math.random() * 9000000) + 1000000;
        const formatted = String(number).slice(0, 3) + ' ' + String(number).slice(3);
        return `${prefix} ${formatted}`;
    },

    async generateIncomingCall() {
        if (this.activeCall || this.isGenerating) {
            console.log('⚠️ Anruf wird übersprungen - Leitung besetzt');
            return;
        }

        this.isGenerating = true;
        console.group('📞 GENERATING CALL WITH GEOCODING');

        try {
            const location = this.generateRandomLocation();
            console.log('🗺️ Hole echte Adresse für Koordinaten:', location);
            const realAddress = await this.reverseGeocode(location.lat, location.lon);
            
            if (realAddress) {
                console.log('✅ Echte Adresse:', realAddress);
            } else {
                console.warn('⚠️ Geocoding fehlgeschlagen, nutze Hotspot-Name');
            }

            const callData = await this.createCallWithGroq(location, realAddress);
            if (!callData) {
                this.isGenerating = false;
                console.groupEnd();
                return;
            }

            callData.anrufer.telefon = this.generatePhoneNumber();
            callData.einsatz.koordinaten = { lat: location.lat, lon: location.lon };
            callData.einsatz.ort = realAddress || location.hotspot;
            callData.antworten.ort = realAddress || location.hotspot;

            this.showIncomingCallInSidebar(callData);
            console.groupEnd();
        } catch (error) {
            console.error('❌ Fehler:', error);
            console.groupEnd();
        } finally {
            this.isGenerating = false;
        }
    },

    async reverseGeocode(lat, lon, retries = 0) {
        const cacheKey = `${lat.toFixed(4)}_${lon.toFixed(4)}`;
        
        if (this.geocodeCache[cacheKey]) {
            console.log(`📦 Geocoding Cache-Hit: ${cacheKey}`);
            return this.geocodeCache[cacheKey];
        }
        
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastGeocodeRequest;
        if (timeSinceLastRequest < 1000) {
            const waitTime = 1000 - timeSinceLastRequest;
            console.log(`⏳ Warte ${waitTime}ms (Rate Limiting)`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        this.lastGeocodeRequest = Date.now();
        
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
            const response = await fetch(url, {
                headers: { 'User-Agent': 'ILS-Waiblingen-Simulator/1.0' }
            });

            if (response.status === 429) {
                if (retries < 3) {
                    const backoff = Math.pow(2, retries) * 1000;
                    console.warn(`⚠️ Nominatim 429 - Retry in ${backoff}ms (Versuch ${retries + 1}/3)`);
                    await new Promise(resolve => setTimeout(resolve, backoff));
                    return this.reverseGeocode(lat, lon, retries + 1);
                } else {
                    console.error('❌ Nominatim Rate Limit erreicht nach 3 Versuchen');
                    return null;
                }
            }

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
            
            const address = `${street} ${houseNumber}, ${city}`.trim();
            this.geocodeCache[cacheKey] = address;
            
            return address;
        } catch (error) {
            console.error('❌ Geocoding Fehler:', error);
            return null;
        }
    },

    async createCallWithGroq(location, address) {
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
Ort: ${address || location.hotspot}
SZENARIEN: ${scenarios.join(', ')}

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
    "telefon": "DUMMY",
    "emotion": "ruhig|aufgeregt|panisch|verwirrt"
  },
  "antworten": {
    "ort": "${address || location.hotspot}",
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
    "koordinaten": {"lat": ${location.lat}, "lon": ${location.lon}},
    "ort": "${address || location.hotspot}"
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

        if (!messagesContainer || !questionsContainer) return;

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
        
        // 🚀 NEU: Zeige ManualIncident inline rechts
        if (typeof ManualIncident !== 'undefined' && ManualIncident.showInline) {
            ManualIncident.showInline(this.activeCall);
        } else {
            console.error('❌ ManualIncident.showInline() nicht gefunden!');
        }
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

            // 🚀 NEU: Update ManualIncident-Formular
            if (typeof ManualIncident !== 'undefined' && ManualIncident.updateFromCallAnswer) {
                ManualIncident.updateFromCallAnswer(key, answer, this.activeCall);
            }
        }, 1000);
    },

    hangUp() {
        console.log('📞 Gespräch beendet');
        this.stopRingtone();
        
        if (this.activeCall) {
            this.callHistory.push(this.activeCall);
        }
        
        this.activeCall = null;
        this.askedQuestions = [];
        
        const noActive = document.getElementById('call-no-active');
        const active = document.getElementById('call-active');
        
        if (noActive) noActive.style.display = 'block';
        if (active) active.style.display = 'none';

        const callList = document.getElementById('call-list');
        if (callList) {
            callList.innerHTML = '<p class="no-data">Keine eingehenden Anrufe</p>';
        }

        // 🚀 NEU: Clear ManualIncident inline
        if (typeof ManualIncident !== 'undefined' && ManualIncident.clearInline) {
            ManualIncident.clearInline();
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