// =========================
// AI INCIDENT GENERATOR v1.0
// Intelligente Einsatzgenerierung mit Groq
// =========================

class AIIncidentGenerator {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.locationGenerator = new LocationGenerator();
        this.hospitalService = new HospitalService();
        this.weatherSystem = null; // Wird später gesetzt
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
        console.group('🚑 GENERIERE EINSATZ MIT GROQ AI');
        
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
            
            // 4. Erstelle Groq-Prompt
            const prompt = this.buildIncidentPrompt(
                location,
                timeString,
                timeOfDay.name,
                weather.name,
                availableVehicleTypes
            );
            
            // 5. Rufe Groq API auf
            const incidentData = await this.callGroqAPI(prompt);
            
            if (!incidentData) {
                console.error('❌ Groq API lieferte keine Daten');
                console.groupEnd();
                return this.createFallbackIncident(location, ownedVehicles);
            }
            
            // 6. Erstelle finalen Einsatz
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
     * Erstellt Groq-Prompt für Einsatzgenerierung
     */
    buildIncidentPrompt(location, time, timeOfDay, weather, availableVehicles) {
        return `Du bist ein realistischer Notruf-Generator für die Integrierte Leitstelle Rems-Murr-Kreis.

ERSTELLE EINEN REALISTISCHEN NOTRUF MIT FOLGENDEN RAHMENBEDINGUNGEN:

ORT: ${location.address}
Gemeinde: ${location.hotspot}
Koordinaten: [${location.lat.toFixed(6)}, ${location.lon.toFixed(6)}]

ZEIT: ${time} Uhr (${timeOfDay})
WETTER: ${weather}

VERFÜGBARE FAHRZEUGE: ${availableVehicles.join(', ')}

WICHTIGE VORGABEN:

1. STICHWORT:
   - Wähle passendes Stichwort: RD 1, RD 2, RD 3, VU, VU P, B 1, B 2, B 3, THL 1, THL 2
   - Berücksichtige Wetter (z.B. mehr Unfälle bei Regen/Schnee)
   - Berücksichtige Tageszeit (z.B. mehr RD-Einsätze nachts)

2. ORTSBESCHREIBUNG:
   - Sei SEHR spezifisch basierend auf der echten Adresse
   - Beispiele:
     * "Wohnung im 3. OG links"
     * "Auf der B14, Höhe Ausfahrt Winnenden"
     * "Bushaltestelle vor dem Rathaus"
     * "Waldweg 200m nach Wanderparkplatz"
     * "Industriehalle, Tor 3"
   - Mache es REALISTISCH zur Adresse passend

3. EINSATZDAUER:
   - Gib realistische Dauer in Minuten (15-120)
   - Berücksichtige:
     * Schweregrad des Notfalls
     * Anzahl Patienten/Betroffene
     * Komplexität (z.B. Reanimation = länger)
     * Verfügbarkeit benötigter Fahrzeuge
   - Wenn WENIGER Fahrzeuge als nötig: Dauer deutlich länger!

4. TRANSPORT:
   - true bei: schweren Verletzungen, Herzinfarkt, Schlaganfall, Bewusstlosigkeit
   - false bei: leichten Verletzungen, stabile Patienten, THL/Brand ohne Verletzte

5. BENÖTIGTE FAHRZEUGE:
   - RD 1: 1 RTW
   - RD 2/RD 3: 1 RTW + 1 NEF
   - VU: 1-2 RTW
   - VU P: 2 RTW + 1 NEF
   - Brand/THL: abhängig von Größe

6. MELDEBILD:
   - Erste aufgeregte, vage Meldung des Anrufers (10-20 Wörter)
   - Nutze Umgangssprache, Emotionen, Dialekt
   - Beispiele:
     * "Hilfe, mein Mann ist zusammengebrochen, er atmet ganz komisch!"
     * "Es hat gekracht auf der B14, es sind mehrere Autos beteiligt!"
     * "Hier brennt's, das ganze Dach steht in Flammen!"

ANTWORTE NUR ALS JSON (kein Text drumherum!):

{
  "stichwort": "RD 1" / "RD 2" / "RD 3" / "VU" / "VU P" / "B 1" / "B 2" / "B 3" / "THL 1" / "THL 2",
  "ortsbeschreibung": "Sehr spezifische Ortsbeschreibung basierend auf Adresse",
  "meldebild": "Erste aufgeregte Meldung des Anrufers",
  "anrufer_typ": "Angehöriger" / "Passant" / "Zeuge" / "Betroffener",
  "einsatzdauer_minuten": 15-120,
  "transport_notwendig": true/false,
  "anzahl_patienten": 1-5,
  "schweregrad": "leicht" / "mittel" / "schwer" / "lebensbedrohlich",
  "besonderheiten": "Optionale Besonderheiten (z.B. eingeklemmt, Reanimation, Chemikalien)",
  "benoetigte_fahrzeuge": {
    "RTW": 1,
    "NEF": 0,
    "KTW": 0
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
                            content: 'Du bist ein Experte für Rettungsdienst-Einsätze. Antworte NUR als JSON, kein Text drumherum.' 
                        },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 1.1,
                    max_tokens: 800,
                    response_format: { type: 'json_object' }
                })
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
            
            // Einsatzdetails
            anrufer_typ: aiData.anrufer_typ,
            anzahl_patienten: aiData.anzahl_patienten || 1,
            schweregrad: aiData.schweregrad,
            besonderheiten: aiData.besonderheiten,
            
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
        const keywords = ['RD 1', 'RD 2', 'VU', 'B 1', 'THL 1'];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        
        return {
            id: `E${Date.now().toString().slice(-8)}`,
            stichwort: keyword,
            keyword: keyword,
            ort: location.address,
            koordinaten: { lat: location.lat, lon: location.lon },
            position: [location.lat, location.lon],
            meldebild: 'Notfall - Details unklar',
            zeitstempel: new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'}),
            einsatzdauer_minuten: 25,
            transport_notwendig: Math.random() > 0.5,
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

console.log('🤖 AI Incident Generator geladen');