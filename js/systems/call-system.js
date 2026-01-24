// =========================
// EMERGENCY CALL SYSTEM v7.5
// + FIX: Abbruch-Logik bei mehrfachen Anrufen
// + Verhindert Überschreibung aktiver Calls
// + Verbesserte Queue-Verwaltung
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
    pendingGeneration: null, // ✅ NEU: AbortController für Anruf-Generierung
    
    // 🆕 RATE LIMITING
    lastGroqRequest: 0,
    minGroqDelay: 2000, // 2 Sekunden zwischen Groq-Calls
    groqRetries: 0,
    maxGroqRetries: 3,

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
        console.log('📞 Call System v7.5 initialisiert');
        console.log('✅ Vordefinierte Fragen = callData.antworten');
        console.log('✅ Custom Questions = Groq AI');
        console.log('✅ Rate Limiting aktiv');
        console.log('✅ Abbruch-Logik für Überlappung aktiviert');
        this.setupRingtone();
    },

    setupRingtone() {
        try {
            this.ringtoneAudio = new Audio('sounds/ringtone.mp3');
            this.ringtoneAudio.loop = true;
            
            // ✅ FIX: Prüfe ob Sound geladen werden kann
            this.ringtoneAudio.addEventListener('error', (e) => {
                console.warn('⚠️ Klingelton nicht gefunden - Stummschaltung aktiv');
                this.ringtoneAudio = null;
            });
        } catch (error) {
            console.warn('⚠️ Fehler beim Laden des Klingeltons:', error);
            this.ringtoneAudio = null;
        }
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
        // ✅ FIX: Prüfe ob bereits ein Anruf aktiv ist oder gerade generiert wird
        if (this.activeCall || this.isGenerating) {
            console.warn('⚠️ Anruf wird übersprungen - Leitung besetzt oder Generierung läuft');
            return;
        }

        // ✅ FIX: Breche vorherige Generierung ab falls noch laufend
        if (this.pendingGeneration) {
            console.log('🛑 Breche vorherige Anruf-Generierung ab');
            this.pendingGeneration.abort();
            this.pendingGeneration = null;
        }

        // Erstelle neuen AbortController
        this.pendingGeneration = new AbortController();
        const signal = this.pendingGeneration.signal;

        this.isGenerating = true;
        console.group('📞 GENERATING CALL WITH GEOCODING');

        try {
            // Prüfe ob abgebrochen
            if (signal.aborted) {
                throw new Error('Generation aborted');
            }

            const location = this.generateRandomLocation();
            console.log('🗺️ Hole echte Adresse für Koordinaten:', location);
            const realAddress = await this.reverseGeocode(location.lat, location.lon);
            
            // Prüfe erneut ob abgebrochen
            if (signal.aborted) {
                throw new Error('Generation aborted after geocode');
            }
            
            if (realAddress) {
                console.log('✅ Echte Adresse:', realAddress);
            } else {
                console.warn('⚠️ Geocoding fehlgeschlagen, nutze Hotspot-Name');
            }

            const callData = await this.createCallWithGroq(location, realAddress, signal);
            
            // Finale Prüfung vor Anzeige
            if (signal.aborted) {
                throw new Error('Generation aborted after call creation');
            }
            
            if (!callData) {
                const fallbackData = this.createFallbackCall(location, realAddress);
                this.showIncomingCallInSidebar(fallbackData);
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
            if (error.message === 'Generation aborted' || error.message.includes('aborted')) {
                console.log('⚠️ Anruf-Generierung wurde abgebrochen');
            } else {
                console.error('❌ Fehler:', error);
            }
            console.groupEnd();
        } finally {
            this.isGenerating = false;
            this.pendingGeneration = null;
        }
    },

    createFallbackCall(location, address) {
        const scenarios = [
            {
                stichwort: 'Herzinfarkt',
                was_passiert: 'Mein Mann hat plötzlich starke Schmerzen in der Brust und schwitzt ganz stark!',
                bewusstsein: 'Ja, er ist wach, aber er sieht ganz blass aus',
                atmung: 'Ja, er atmet, aber ganz schwer und schnell',
                rtw: 1, nef: 1
            },
            {
                stichwort: 'Sturz',
                was_passiert: 'Meine Oma ist die Treppe runtergefallen! Sie liegt jetzt unten und kann nicht aufstehen!',
                bewusstsein: 'Sie ist wach, aber total durcheinander',
                atmung: 'Ja, sie atmet normal',
                rtw: 1, nef: 0
            },
            {
                stichwort: 'Atemnot',
                was_passiert: 'Mein Kind kriegt keine Luft mehr! Das keucht total und wird schon blau!',
                bewusstsein: 'Ja, aber total panisch',
                atmung: 'Ganz schwer, ringt nach Luft',
                rtw: 1, nef: 1
            }
        ];
        
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        return {
            anrufer: {
                name: 'Max Mustermann',
                telefon: this.generatePhoneNumber(),
                emotion: 'aufgeregt'
            },
            antworten: {
                ort: address || location.hotspot,
                was_passiert: scenario.was_passiert,
                wie_viele: 'Eine Person',
                bewusstsein: scenario.bewusstsein,
                atmung: scenario.atmung,
                blutung: 'Keine sichtbare Blutung',
                schmerzen: 'Weiß ich nicht genau',
                vorerkrankungen: 'Weiß ich nicht',
                medikamente: 'Keine Ahnung',
                allergien: 'Weiß nicht',
                schwangerschaft: 'Nein',
                diabetes: 'Weiß nicht',
                epilepsie: 'Nein',
                herzerkrankung: 'Weiß nicht',
                sturz_hoehe: 'Normale Treppe',
                aufprall: 'Auf den Boden',
                eingeklemmt: 'Nein',
                airbag: 'Kein Unfall',
                feuer: 'Nein',
                gefahrstoffe: 'Nein',
                waffe: 'Nein',
                gewalt: 'Nein',
                erreichbarkeit: 'Von der Straße',
                stockwerk: 'Erdgeschoss'
            },
            einsatz: {
                stichwort: scenario.stichwort,
                koordinaten: { lat: location.lat, lon: location.lon },
                ort: address || location.hotspot
            },
            empfehlung: {
                rtw: scenario.rtw,
                nef: scenario.nef,
                ktw: 0
            }
        };
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
            console.log(`⏳ Warte ${waitTime}ms (Nominatim Rate Limiting)`);
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

    async createCallWithGroq(location, address, signal = null) {
        const now = Date.now();
        const timeSinceLastGroq = now - this.lastGroqRequest;
        
        if (timeSinceLastGroq < this.minGroqDelay) {
            const waitTime = this.minGroqDelay - timeSinceLastGroq;
            console.log(`⏳ Groq Rate Limiting: Warte ${waitTime}ms`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        // ✅ FIX: Prüfe Abort-Signal
        if (signal && signal.aborted) {
            throw new Error('Call creation aborted');
        }

        const currentTime = IncidentNumbering.getCurrentTimestamp();
        const hour = parseInt(currentTime.split(':')[0]);
        
        let timeOfDay = 'Tag';
        if (hour >= 22 || hour < 6) timeOfDay = 'Nacht';
        else if (hour >= 18) timeOfDay = 'Abend';

        const randomSeed = Math.random().toString(36).substring(2, 15);
        const scenarios = this.getRandomScenarios();

        const prompt = `Du bist ein KI-System das realistische deutsche Notrufe generiert.

📍 EINSATZDATEN:
Session: ${randomSeed}
Uhrzeit: ${currentTime} (${timeOfDay})
Ort: ${address || location.hotspot}
Mögliche Szenarien: ${scenarios.join(', ')}

⚠️ KRITISCH - REALISTISCHE ANTWORTEN:

1️⃣ "was_passiert" - ERSTE SPONTANE BESCHREIBUNG:
   📏 Länge: 10-20 Wörter (WICHTIG: Nicht zu kurz!)
   🎭 Emotional und aufgeregt
   ❌ NICHT: "Mein Onkel, plötzlich schlimme Brustschmerzen"
   ✅ SONDERN: "Oh Gott, mein Onkel! Der sitzt da und fasst sich die ganze Zeit an die Brust, der sieht total blass aus und schwitzt wie verrückt! Ich weiß nicht was ich machen soll!"

2️⃣ "bewusstsein" - BEWUSSTSEINSZUSTAND:
   📏 Länge: 8-15 Wörter
   🤔 Oft unsicher, beschreibend
   ✅ Beispiele: "Äh... ja, er macht die Augen auf, aber der redet total wirr und weiß nicht wo er ist"

3️⃣ "atmung" - ATMUNG:
   📏 Länge: 8-15 Wörter
   👀 Beobachtungen, nicht medizinisch
   ✅ Beispiele: "Also atmen tut er schon, aber ganz schnell und flach, als ob er keine Luft kriegt"

4️⃣ ALLE ANDEREN FRAGEN:
   📏 Länge: 5-12 Wörter
   🤷 Oft "Weiß ich nicht" oder vage

5️⃣ WICHTIGE REGELN:
   ❌ KEINE medizinischen Fachbegriffe
   ✅ Umgangssprache und Dialekt erlaubt
   ✅ Füllwörter nutzen ("also", "äh", "irgendwie")
   ✅ Emotionen zeigen

ANTWORTE NUR ALS JSON (ohne Markdown!):
{
  "anrufer": {
    "name": "Deutscher Vor- und Nachname",
    "telefon": "DUMMY",
    "emotion": "ruhig|aufgeregt|panisch|verwirrt"
  },
  "antworten": {
    "ort": "${address || location.hotspot}",
    "was_passiert": "10-20 Wörter, sehr emotional!",
    "wie_viele": "Eine Person",
    "bewusstsein": "8-15 Wörter",
    "atmung": "8-15 Wörter",
    "blutung": "5-12 Wörter",
    "schmerzen": "5-12 Wörter",
    "vorerkrankungen": "Oft 'Weiß ich nicht'",
    "medikamente": "Oft unsicher",
    "allergien": "Meist 'Weiß nicht'",
    "schwangerschaft": "Nein",
    "diabetes": "Weiß nicht",
    "epilepsie": "Nein",
    "herzerkrankung": "Weiß nicht",
    "sturz_hoehe": "Konkrete Angabe",
    "aufprall": "Beschreibung",
    "eingeklemmt": "Nein",
    "airbag": "Weiß nicht",
    "feuer": "Nein",
    "gefahrstoffe": "Nein",
    "waffe": "Nein",
    "gewalt": "Nein",
    "erreichbarkeit": "Von der Straße",
    "stockwerk": "Erdgeschoss"
  },
  "einsatz": {
    "stichwort": "Herzinfarkt|Verkehrsunfall|Sturz|etc.",
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
            this.lastGroqRequest = Date.now();
            const response = await this.callGroqAPI(prompt, signal);
            this.groqRetries = 0;
            return response;
        } catch (error) {
            // ✅ FIX: Unterscheide Abort von echtem Fehler
            if (error.message === 'Call creation aborted') {
                throw error; // Propagiere Abort nach oben
            }
            
            console.error('❌ Groq Fehler:', error);
            
            if (this.groqRetries < this.maxGroqRetries && error.message.includes('429')) {
                this.groqRetries++;
                const backoff = Math.pow(2, this.groqRetries) * 2000;
                console.warn(`🔄 Groq Retry ${this.groqRetries}/${this.maxGroqRetries} in ${backoff}ms`);
                await new Promise(resolve => setTimeout(resolve, backoff));
                return this.createCallWithGroq(location, address, signal);
            }
            
            this.groqRetries = 0;
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

    async callGroqAPI(prompt, signal = null) {
        const apiKey = CONFIG.GROQ_API_KEY || localStorage.getItem('groq_api_key') || localStorage.getItem('groqApiKey');
        if (!apiKey) {
            console.error('❌ Kein Groq API Key gefunden');
            throw new Error('Kein API Key');
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
                    { role: 'system', content: 'Du generierst realistische deutsche Notrufe. Antworte NUR als JSON ohne Markdown.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 1.3,
                response_format: { type: 'json_object' }
            }),
            signal: signal // ✅ FIX: Nutze Signal zum Abbrechen
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    },

    showIncomingCallInSidebar(callData) {
        // ✅ FIX: Doppelte Prüfung ob bereits ein Anruf aktiv ist
        if (this.activeCall) {
            console.warn('⚠️ Ignoriere neuen Anruf - bereits ein Anruf aktiv');
            return;
        }

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
            this.ringtoneAudio.play().catch(e => console.log('⚠️ Ringtone Autoplay blockiert oder Datei fehlt'));
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

        messagesContainer.innerHTML = '';
        this.startMinimalConversation(messagesContainer);
        this.initQuestionButtons(questionsContainer);
        
        if (typeof ManualIncident !== 'undefined' && ManualIncident.showInline) {
            ManualIncident.showInline(this.activeCall);
        } else {
            console.error('❌ ManualIncident.showInline() nicht gefunden!');
        }
    },

    startMinimalConversation(container) {
        this.addDispatcherMessage(container, 'Notruf Feuerwehr und Rettungsdienst, wo ist der Notfallort?');
        
        setTimeout(() => {
            this.addCallerMessage(container, this.activeCall.antworten.ort, 'ort');
            
            setTimeout(() => {
                console.log('✅ Ort erhalten - User kann jetzt selbst fragen!');
            }, 2000);
        }, 1000);
    },

    addDispatcherMessage(container, text) {
        const div = document.createElement('div');
        div.className = 'msg-dispatcher';
        div.innerHTML = `<strong>👨‍💻 Sie:</strong> ${text}`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    },

    addCallerMessage(container, text, updateKey = null) {
        const div = document.createElement('div');
        div.className = 'msg-caller';
        div.innerHTML = `${this.getEmotionIcon()} <span class="typing"></span>`;
        container.appendChild(div);

        this.typeText(div.querySelector('.typing'), text);
        container.scrollTop = container.scrollHeight;
        
        if (updateKey && typeof ManualIncident !== 'undefined' && ManualIncident.updateFromCallAnswer) {
            setTimeout(() => {
                ManualIncident.updateFromCallAnswer(updateKey, text, this.activeCall);
            }, text.length * 30 + 100);
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

        container.innerHTML = `
            <!-- 🆕 FREITEXTFELD -->
            <div style="margin-bottom: 20px; padding: 15px; background: rgba(33, 150, 243, 0.1); border: 2px solid #2196F3; border-radius: 8px;">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <i class="fas fa-keyboard" style="color: #2196F3; margin-right: 8px;"></i>
                    <strong style="color: #2196F3;">Eigene Frage stellen:</strong>
                </div>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="custom-question-input" placeholder="z.B. Haben Sie den Patienten bewegt?" 
                           style="flex: 1; padding: 10px; border: 1px solid #2196F3; border-radius: 5px; background: rgba(0,0,0,0.3); color: #fff;"
                           onkeypress="if(event.key === 'Enter') CallSystem.askCustomQuestion()">
                    <button class="btn btn-primary" onclick="CallSystem.askCustomQuestion()" style="white-space: nowrap;">
                        <i class="fas fa-paper-plane"></i> Fragen
                    </button>
                </div>
            </div>
            
            <!-- VORDEFINIERTE FRAGEN -->
            ${categories.map(cat => `
                <div class="question-cat">
                    <div class="cat-header" onclick="this.nextElementSibling.classList.toggle('open')">
                        ${cat.name} <span class="arrow">▼</span>
                    </div>
                    <div class="cat-questions">
                        ${cat.questions.map(q => `
                            <button class="q-btn" onclick="CallSystem.askPredefinedQuestion('${q.key}', '${q.text}')">
                                ${q.text}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        `;
    },

    // ✅ FIX: Neue Funktion für vordefinierte Fragen
    askPredefinedQuestion(key, text) {
        console.log(`❓ Vordefinierte Frage: ${key}`);
        
        const container = document.getElementById('caller-messages');
        
        // Zeige Frage
        const qDiv = document.createElement('div');
        qDiv.className = 'msg-dispatcher';
        qDiv.innerHTML = `<strong>👨‍💻 Sie:</strong> ${text}`;
        container.appendChild(qDiv);
        container.scrollTop = container.scrollHeight;

        // Markiere als gefragt
        if (!this.askedQuestions.includes(key)) {
            this.askedQuestions.push(key);
        }

        // ✅ NUTZE VORDEFINIERTE ANTWORT aus activeCall.antworten
        setTimeout(() => {
            const answer = this.activeCall.antworten[key] || 'Keine Angabe';
            console.log(`✅ Antwort aus callData: ${answer}`);
            
            const aDiv = document.createElement('div');
            aDiv.className = 'msg-caller';
            aDiv.innerHTML = `${this.getEmotionIcon()} <span class="typing"></span>`;
            container.appendChild(aDiv);

            this.typeText(aDiv.querySelector('.typing'), answer);
            container.scrollTop = container.scrollHeight;

            // Update Manual Incident Formular
            if (typeof ManualIncident !== 'undefined' && ManualIncident.updateFromCallAnswer) {
                setTimeout(() => {
                    ManualIncident.updateFromCallAnswer(key, answer, this.activeCall);
                }, answer.length * 30 + 100);
            }
        }, 1000);
    },

    // ✅ Custom Questions nutzen GROQ AI
    async askCustomQuestion() {
        const input = document.getElementById('custom-question-input');
        if (!input || !input.value.trim()) return;
        
        const question = input.value.trim();
        input.value = '';
        
        console.log(`❓ Custom Question: ${question}`);
        
        const container = document.getElementById('caller-messages');
        
        const qDiv = document.createElement('div');
        qDiv.className = 'msg-dispatcher';
        qDiv.innerHTML = `<strong>👨‍💻 Sie:</strong> ${question}`;
        container.appendChild(qDiv);
        container.scrollTop = container.scrollHeight;
        
        // Rate Limiting
        const now = Date.now();
        const timeSinceLastGroq = now - this.lastGroqRequest;
        if (timeSinceLastGroq < this.minGroqDelay) {
            const waitTime = this.minGroqDelay - timeSinceLastGroq;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        const apiKey = CONFIG.GROQ_API_KEY || localStorage.getItem('groq_api_key') || localStorage.getItem('groqApiKey');
        if (!apiKey) {
            this.showCallerAnswer('Tut mir leid, ich habe Sie nicht verstanden.');
            return;
        }
        
        try {
            const prompt = `Du bist ein Anrufer beim Notruf 112 in Deutschland.

Deine Situation:
${JSON.stringify(this.activeCall.antworten, null, 2)}

Deine Emotion: ${this.activeCall.anrufer.emotion}

Der Disponent fragt dich:
"${question}"

Antworte realistisch in 5-15 Wörtern mit:
- Umgangssprache ("nix", "net", "halt")
- Füllwörter ("äh", "also", "irgendwie")
- Emotionen (Angst, Sorge, Panik)
- Eventuell Unsicherheit
- KEINE medizinischen Fachbegriffe!

Antworte NUR mit der direkten Antwort, kein JSON.`;
            
            this.lastGroqRequest = Date.now();
            
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: 'Antworte als deutscher Notruf-Anrufer. NUR die direkte Antwort, kein JSON.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 1.2,
                    max_tokens: 100
                })
            });
            
            if (!response.ok) throw new Error('API Error');
            
            const data = await response.json();
            const answer = data.choices[0].message.content.replace(/"/g, '').trim();
            
            console.log(`✅ Groq Antwort: ${answer}`);
            this.showCallerAnswer(answer, 'custom_question', question);
            
        } catch (error) {
            console.error('❌ Fehler bei Custom Question:', error);
            this.showCallerAnswer('Äh... was haben Sie gesagt? Ich bin gerade etwas verwirrt...', 'custom_question', question);
        }
    },

    showCallerAnswer(answer, key = null, question = null) {
        const container = document.getElementById('caller-messages');
        
        setTimeout(() => {
            const aDiv = document.createElement('div');
            aDiv.className = 'msg-caller';
            aDiv.innerHTML = `${this.getEmotionIcon()} <span class="typing"></span>`;
            container.appendChild(aDiv);

            this.typeText(aDiv.querySelector('.typing'), answer);
            container.scrollTop = container.scrollHeight;
            
            if (key && typeof ManualIncident !== 'undefined' && ManualIncident.updateFromCallAnswer) {
                setTimeout(() => {
                    ManualIncident.updateFromCallAnswer(key, answer, this.activeCall);
                }, answer.length * 30 + 100);
            }
        }, 800);
    },

    hangUp() {
        console.log('📞 Gespräch beendet');
        this.stopRingtone();
        
        // ✅ FIX: Breche aktive Generierung ab falls vorhanden
        if (this.pendingGeneration) {
            this.pendingGeneration.abort();
            this.pendingGeneration = null;
        }
        
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

        if (typeof ManualIncident !== 'undefined' && ManualIncident.clearInline) {
            ManualIncident.clearInline();
        }

        if (typeof switchTab === 'function') {
            switchTab('map');
        }
    },

    // ✅ NEU: Cleanup-Methode
    cleanup() {
        if (this.pendingGeneration) {
            this.pendingGeneration.abort();
            this.pendingGeneration = null;
        }
        this.stopRingtone();
        console.log('🧹 Call System cleanup ausgeführt');
    }
};

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        CallSystem.initialize();
    });
    
    // Cleanup bei Seitenwechsel
    window.addEventListener('beforeunload', () => {
        if (CallSystem) CallSystem.cleanup();
    });
}

console.log('✅ Call System v7.5 geladen - FIX: Abbruch-Logik für mehrfache Anrufe');