// =========================
// AI INCIDENT GENERATOR v2.0
// ADVANCED TEMPLATES & Variabilität
// Intelligente Einsatzgenerierung mit Groq
// =========================

class AIIncidentGenerator {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.locationGenerator = new LocationGenerator();
        this.hospitalService = new HospitalService();
        this.weatherSystem = null; // Wird später gesetzt
        
        // 🆕 NEUE TEMPLATE-KATEGORIEN
        this.incidentTemplates = this.initializeTemplates();
    }
    
    /**
     * 🆕 Initialisiert erweiterte Einsatz-Templates
     */
    initializeTemplates() {
        return {
            // ZEIT-BASIERT
            timeSpecific: {
                night: ['Sturzgeschehen', 'Atemnot', 'Brustschmerzen', 'Bewusstlosigkeit'],
                morning: ['Schlaganfall', 'Herzinfarkt', 'Diabetisches Koma'],
                afternoon: ['Arbeitsunfall', 'Verkehrsunfall', 'Sport-Verletzung'],
                evening: ['Häuslicher Unfall', 'Vergiftung', 'Alkoholintoxikation']
            },
            
            // WETTER-BASIERT
            weatherSpecific: {
                'Regen': ['Verkehrsunfall nasse Fahrbahn', 'Sturz bei Glätte', 'Fahrradunfall'],
                'Schnee': ['VU Winterglätte', 'Unterkühlung', 'Sturz auf Eis'],
                'Gewitter': ['Blitzschlag', 'Sturz durch Wind', 'Baum auf Person'],
                'Nebel': ['VU Sichtbehinderung', 'Orientierungslosigkeit'],
                'Hitze': ['Kreislaufkollaps', 'Sonnenstich', 'Dehydrierung']
            },
            
            // ORT-BASIERT
            locationSpecific: {
                'Wohnung': ['Häuslicher Sturz', 'Küchenunfall', 'Badezimmer-Sturz'],
                'Straße': ['Verkehrsunfall', 'Fußgänger angefahren', 'Fahrradunfall'],
                'Arbeitsplatz': ['Arbeitsunfall', 'Maschinenverletzung', 'Chemische Verletzung'],
                'Schule': ['Sportunfall', 'Allergische Reaktion', 'Asthmaanfall'],
                'Wald': ['Wanderunfall', 'Zeckenstich-Allergie', 'Pilzvergiftung'],
                'See': ['Badeunfall', 'Ertrinkungsgefahr', 'Tauchunfall']
            }
        };
    }
    
    /**
     * Setzt Wettersystem-Referenz
     */
    setWeatherSystem(weatherSystem) {
        this.weatherSystem = weatherSystem;
    }
    
    /**
     * Generiert komplett neuen Einsatz mit Groq AI
     */
    async generateIncident(ownedVehicles, gameTime) {
        console.group('🚑 GENERIERE EINSATZ MIT GROQ AI V2.0');
        
        try {
            // 1. Generiere zufälligen Ort im Rems-Murr-Kreis
            const location = await this.locationGenerator.generateIncidentLocation();
            console.log(`📍 Ort: ${location.address}`);
            
            // 2. Hole aktuelle Zeit und Wetter
            const currentHour = gameTime ? gameTime.getHours() : new Date().getHours();
            const currentMinute = gameTime ? gameTime.getMinutes() : new Date().getMinutes();
            const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
            
            const weather = this.weatherSystem ? this.weatherSystem.getCurrentWeather() : { name: 'Trocken' };
            const timeOfDay = this.weatherSystem ? this.weatherSystem.getCurrentTimeOfDay() : { name: 'Tag' };
            
            console.log(`⏰ Zeit: ${timeString} (${timeOfDay.name})`);
            console.log(`🌦️ Wetter: ${weather.name}`);
            
            // 3. Prüfe verfügbare Fahrzeugtypen
            const availableVehicleTypes = this.getAvailableVehicleTypes(ownedVehicles);
            console.log(`🚑 Verfügbare Fahrzeuge: ${availableVehicleTypes.join(', ')}`);
            
            // 🆕 4. Wähle kontext-passenden Einsatztyp
            const suggestedType = this.suggestIncidentType(timeOfDay.name, weather.name, location);
            console.log(`🎯 Vorgeschlagener Typ: ${suggestedType || 'Zufall'}`);
            
            // 5. Erstelle erweiterten Groq-Prompt
            const prompt = this.buildAdvancedIncidentPrompt(
                location,
                timeString,
                timeOfDay.name,
                weather.name,
                availableVehicleTypes,
                suggestedType
            );
            
            // 6. Rufe Groq API auf
            const incidentData = await this.callGroqAPI(prompt);
            
            if (!incidentData) {
                console.error('❌ Groq API lieferte keine Daten');
                console.groupEnd();
                return this.createFallbackIncident(location, ownedVehicles);
            }
            
            // 7. Erstelle finalen Einsatz
            const incident = this.createIncidentFromAI(incidentData, location, timeString);
            
            console.log(`✅ Einsatz generiert: ${incident.stichwort}`);
            console.groupEnd();
            
            return incident;
            
        } catch (error) {
            console.error('❌ Fehler bei Einsatzgenerierung:', error);
            console.groupEnd();
            return null;
        }
    }
    
    /**
     * 🆕 Schlägt passenden Einsatztyp basierend auf Kontext vor
     */
    suggestIncidentType(timeOfDay, weather, location) {
        const suggestions = [];
        
        // Zeit-basierte Vorschläge
        const timeKey = this.getTimeCategory(timeOfDay);
        if (this.incidentTemplates.timeSpecific[timeKey]) {
            suggestions.push(...this.incidentTemplates.timeSpecific[timeKey]);
        }
        
        // Wetter-basierte Vorschläge
        if (this.incidentTemplates.weatherSpecific[weather]) {
            suggestions.push(...this.incidentTemplates.weatherSpecific[weather]);
        }
        
        // Wähle zufälligen Vorschlag (falls vorhanden)
        return suggestions.length > 0 ? 
            suggestions[Math.floor(Math.random() * suggestions.length)] : null;
    }
    
    /**
     * Helper: Zeit-Kategorie ermitteln
     */
    getTimeCategory(timeOfDay) {
        const mapping = {
            'Nacht': 'night',
            'Morgen': 'morning',
            'Früher Morgen': 'morning',
            'Vormittag': 'morning',
            'Mittag': 'afternoon',
            'Nachmittag': 'afternoon',
            'Abend': 'evening',
            'Später Abend': 'evening'
        };
        return mapping[timeOfDay] || 'afternoon';
    }
    
    /**
     * 🆕 ERWEITETER Groq-Prompt mit mehr Details
     */
    buildAdvancedIncidentPrompt(location, time, timeOfDay, weather, availableVehicles, suggestedType) {
        const suggestion = suggestedType ? `
VORSCHLAG (passend zu Zeit/Wetter): ${suggestedType}` : '';
        
        return `Du bist ein realistischer Notruf-Generator für die Integrierte Leitstelle Rems-Murr-Kreis.

ERSTELLE EINEN HOCHREALISTISCHEN NOTRUF MIT FOLGENDEN RAHMENBEDINGUNGEN:

ORT: ${location.address}
Gemeinde: ${location.hotspot}
Koordinaten: [${location.lat.toFixed(6)}, ${location.lon.toFixed(6)}]

ZEIT: ${time} Uhr (${timeOfDay})
WETTER: ${weather}${suggestion}

VERFÜGBARE FAHRZEUGE: ${availableVehicles.join(', ')}

====================================
WICHTIGE VORGABEN (V2.0 - ERWEITERT):
====================================

1️⃣ STICHWORT:
   - Wähle PASSEND zu Zeit/Wetter/Ort:
     * RD 1: Leichte Notfälle (Bauchschmerzen, leichte Verletzung)
     * RD 2: Mittlere Notfälle (Atemnot, Brustschmerzen, Schlaganfall)
     * RD 3: Schwere Notfälle (Herzinfarkt, Bewusstlosigkeit, Reanimation)
     * VU: Verkehrsunfall leicht-mittel (1-2 Verletzte)
     * VU P: VU schwer (Eingeklemmt, mehrere Verletzte)
     * B 1: Kleinbrand (Mülltonne, Zimmer)
     * B 2: Mittelbrand (Wohnung, Garage)
     * B 3: Großbrand (Gebäude, mehrere Etagen)
     * THL 1: Kleine Hilfeleistung (Türöffnung, Tier gerettet)
     * THL 2: Große Hilfeleistung (Person eingeschlossen, Absturz)

2️⃣ ORTSBESCHREIBUNG:
   - SEHR SPEZIFISCH zur Adresse passend!
   - Nutze REALISTISCHE Details:
     * Wohnung: "3. OG links", "EG rechts, Hintereingang", "Dachgeschoss"
     * Straße: "Auf der B14, Fahrtrichtung Stuttgart", "Kreuzung Bahnhofstraße/Hauptstraße"
     * Gebäude: "Industriehalle Tor 3", "Rathaus, Sitzungssaal 2. Stock", "Turnhalle"
     * Natur: "Waldweg 500m nach Wanderparkplatz", "Uferweg am Rems, Höhe Brücke"
   - Mache es GLAUBWÜRDIG!

3️⃣ MELDEBILD:
   - 15-30 Wörter
   - Aufgeregt, emotional, authentisch
   - Schwaben-Dialekt-Einflüsse erlaubt!
   - VARIIERE stark:
     * Hysterisch: "Oh Gott oh Gott, er bewegt sich nicht mehr!"
     * Sachlich: "Ja hallo, hier ist ein Unfall passiert, wir brauchen einen Krankenwagen."
     * Verzweifelt: "Bitte helfen Sie, meine Mutter atmet ganz schwer!"
     * Verwirrt: "Äh, hier... ich weiß nicht was ich tun soll, der liegt da einfach!"

4️⃣ ANRUFER-TYP:
   - VARIIERE realistisch:
     * "Ehepartner" / "Tochter" / "Sohn" / "Mutter" / "Vater"
     * "Arbeitskollege" / "Chef" / "Mitschüler" / "Lehrer"
     * "Passant" / "Autofahrer" / "Zeuge"
     * "Betroffener selbst" / "Nachbar" / "Freund"

5️⃣ PATIENT-DETAILS:
   - Alter: Realistisch (z.B. Herzinfarkt = 50-80J, Sportunfall = 15-30J)
   - Geschlecht: männlich/weiblich (passe zu Szenario)
   - Vorerkrankungen: Optional (z.B. Diabetes, Herzerkrankung, Asthma)

6️⃣ EINSATZDAUER:
   - REALISTISCH nach Schweregrad:
     * RD 1: 15-30 Min
     * RD 2: 25-45 Min  
     * RD 3: 35-90 Min (Reanimation!)
     * VU: 20-40 Min
     * VU P: 45-120 Min (Rettung!)
     * B 1: 20-40 Min
     * B 2/3: 60-180 Min
     * THL 1: 15-30 Min
     * THL 2: 30-90 Min

7️⃣ TRANSPORT:
   - true: Schwere Verletzungen, Herzinfarkt, Schlaganfall, Bewusstlosigkeit
   - false: Leichte Verletzungen, stabile Patienten, Brand/THL ohne Verletzte

8️⃣ BESONDERHEITEN:
   - Nutze KREATIV:
     * "Reanimation läuft"
     * "Person eingeklemmt"
     * "Mehrere Verletzte"
     * "Starke Blutung"
     * "Bewusstlos"
     * "Allergische Reaktion"
     * "Atemstillstand"
     * "Schockzustand"
     * "Schwangerschaft"
     * "Kind betroffen"

9️⃣ BENÖTIGTE FAHRZEUGE:
   - RD 1: {"RTW": 1, "NEF": 0, "KTW": 0}
   - RD 2/RD 3: {"RTW": 1, "NEF": 1, "KTW": 0}
   - VU: {"RTW": 1-2, "NEF": 0, "KTW": 0}
   - VU P: {"RTW": 2, "NEF": 1, "KTW": 0}
   - Leichte Transporte: {"RTW": 0, "NEF": 0, "KTW": 1}

====================================
ANTWORTE NUR ALS JSON (kein Text!):
====================================

{
  "stichwort": "RD 1/RD 2/RD 3/VU/VU P/B 1/B 2/B 3/THL 1/THL 2",
  "ortsbeschreibung": "Sehr spezifische Beschreibung passend zur Adresse",
  "meldebild": "Erste aufgeregte/emotionale Meldung (15-30 Wörter)",
  "anrufer_typ": "Spezifischer Anrufer-Typ",
  "patient_alter": 5-100,
  "patient_geschlecht": "männlich"/"weiblich",
  "patient_vorerkrankungen": "Optional: z.B. Diabetes, Herzerkrankung",
  "einsatzdauer_minuten": 15-180,
  "transport_notwendig": true/false,
  "anzahl_patienten": 1-5,
  "schweregrad": "leicht"/"mittel"/"schwer"/"lebensbedrohlich",
  "besonderheiten": "Optional: z.B. Reanimation, eingeklemmt, starke Blutung",
  "benoetigte_fahrzeuge": {
    "RTW": 0-2,
    "NEF": 0-1,
    "KTW": 0-1
  }
}`;
    }
    
    /**
     * Ruft Groq API auf
     */
    async callGroqAPI(prompt) {
        if (!this.apiKey) {
            console.error('❌ Kein Groq API Key vorhanden');
            return null;
        }
        
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { 
                            role: 'system', 
                            content: 'Du bist ein Experte für Rettungsdienst-Einsätze. Erstelle REALISTISCHE und VARIIERENDE Notrufe. Antworte NUR als JSON, kein Text drumherum.' 
                        },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 1.2, // 🆕 Erhöht für mehr Variabilität!
                    max_tokens: 1000,
                    response_format: { type: 'json_object' }
                }),
                signal: AbortSignal.timeout(15000) // 15s Timeout
            });
            
            if (!response.ok) {
                console.error('❌ Groq API Fehler:', response.status);
                return null;
            }
            
            const data = await response.json();
            const content = data.choices[0].message.content;
            
            return JSON.parse(content);
            
        } catch (error) {
            console.error('❌ Groq API Call fehlgeschlagen:', error);
            return null;
        }
    }
    
    /**
     * Erstellt finalen Einsatz aus Groq-Daten
     */
    createIncidentFromAI(aiData, location, timeString) {
        const incidentId = `E${Date.now().toString().slice(-8)}`;
        
        return {
            id: incidentId,
            stichwort: aiData.stichwort,
            keyword: aiData.stichwort,
            ort: `${aiData.ortsbeschreibung}, ${location.address}`,
            location: location.address,
            ortsbeschreibung: aiData.ortsbeschreibung,
            koordinaten: {
                lat: location.lat,
                lon: location.lon
            },
            position: [location.lat, location.lon],
            meldebild: aiData.meldebild,
            initialMessage: aiData.meldebild,
            zeitstempel: timeString,
            timestamp: Date.now(),
            
            // 🆕 Erweiterte Einsatzdetails
            anrufer_typ: aiData.anrufer_typ,
            anzahl_patienten: aiData.anzahl_patienten || 1,
            schweregrad: aiData.schweregrad,
            besonderheiten: aiData.besonderheiten,
            
            // 🆕 Patient-Details
            patient_alter: aiData.patient_alter,
            patient_geschlecht: aiData.patient_geschlecht,
            patient_vorerkrankungen: aiData.patient_vorerkrankungen,
            
            // Einsatzdauer & Transport
            einsatzdauer_minuten: aiData.einsatzdauer_minuten,
            transport_notwendig: aiData.transport_notwendig,
            zielkrankenhaus: aiData.transport_notwendig ? 
                this.hospitalService.selectNearestHospital([location.lat, location.lon]) : null,
            
            // Benötigte Fahrzeuge
            benoetigte_fahrzeuge: aiData.benoetigte_fahrzeuge,
            assignedVehicles: [],
            
            // Status
            status: 'incoming',
            completed: false,
            startTime: null,
            endTime: null,
            
            // Anruf-Daten
            caller: aiData.anrufer_typ,
            conversationState: {
                locationKnown: false,
                detailsKnown: false,
                symptomsKnown: false,
                ageKnown: false
            },
            conversationHistory: []
        };
    }
    
    /**
     * Fallback-Einsatz wenn Groq fehlschlägt
     */
    createFallbackIncident(location, ownedVehicles) {
        const templates = [
            { keyword: 'RD 1', msg: 'Patient mit Bauchschmerzen', duration: 20, transport: true },
            { keyword: 'RD 2', msg: 'Person mit Atemnot', duration: 30, transport: true },
            { keyword: 'VU', msg: 'Verkehrsunfall mit Verletzten', duration: 35, transport: true },
            { keyword: 'B 1', msg: 'Kleinbrand in Wohnung', duration: 25, transport: false },
            { keyword: 'THL 1', msg: 'Türöffnung dringend', duration: 15, transport: false }
        ];
        
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        return {
            id: `E${Date.now().toString().slice(-8)}`,
            stichwort: template.keyword,
            keyword: template.keyword,
            ort: location.address,
            koordinaten: { lat: location.lat, lon: location.lon },
            position: [location.lat, location.lon],
            meldebild: template.msg,
            zeitstempel: new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'}),
            einsatzdauer_minuten: template.duration,
            transport_notwendig: template.transport,
            benoetigte_fahrzeuge: { RTW: 1, NEF: 0, KTW: 0 },
            assignedVehicles: [],
            status: 'incoming',
            completed: false
        };
    }
    
    /**
     * Ermittelt verfügbare Fahrzeugtypen
     */
    getAvailableVehicleTypes(vehicles) {
        const types = new Set();
        vehicles.forEach(v => {
            if (v.owned && v.status === 'available') {
                types.add(v.type);
            }
        });
        return Array.from(types);
    }
}

// Globale Instanz
window.AIIncidentGenerator = AIIncidentGenerator;

console.log('🤖 AI Incident Generator v2.0 geladen - Advanced Templates!');
