// =========================
// AI INCIDENT GENERATOR v3.1.0
// 🆙 VOLLSTÄNDIGE INTEGRATION: Weather + Timer + Call-Templates!
// PHASE 2 - COMPOSITION SYSTEM INTEGRATION
// Nutzt incident-composer.js für flexible Einsatzerstellung
// =========================

/**
 * AI INCIDENT GENERATOR v3.1.0
 * 
 * 🆙 NEU IN v3.1.0:
 * - ⏰ Game-Timer Integration (getGameTimer())
 * - 🌦️ Weather-System Integration (getWeatherContext())
 * - 📞 Call-Template-Mapper Integration (mapToTemplate())
 * - 📊 Kontext-basierte Einsatzhäufigkeit
 * - 🌙 Tageszeit-abhängige Einsatztypen
 * - ❄️ Wetterbedingte Einsätze (Glatteis, Sturm)
 * 
 * 🆕 NEU IN v3.0:
 * - Nutzt incidentComposer.compose() statt feste Templates
 * - Intelligente Severity-Auswahl basierend auf Kontext
 * - Type-spezifische Groq-Prompts
 * - Modifier-Chance basierend auf Severity
 * - Validation gegen komponierte Schemas
 * 
 * ✅ FIX v3.0.1:
 * - Entfernt HospitalService Dependency (nicht nötig)
 * - Hospital-Auswahl direkt aus HOSPITALS Datenbank
 * 
 * ✅ FIX v3.0.2:
 * - Verwendet hospital.location statt hospital.position
 * 
 * WORKFLOW:
 * 1. Wähle Severity (MINOR/MODERATE/CRITICAL) basierend auf:
 *    - Tageszeit (Nacht = mehr CRITICAL)
 *    - Wetter (Schnee = mehr TRAFFIC)
 *    - Zufall mit Gewichtung
 * 2. Wähle Type (MEDICAL/TRAFFIC/etc.)
 * 3. Optional: Wähle Modifier (ENTRAPMENT/FIRE/etc.)
 * 4. Komponiere Schema mit incidentComposer
 * 5. 🆙 Mappe zu Call-Template (wenn verfügbar)
 * 6. Erstelle Type-spezifischen Groq-Prompt
 * 7. Generiere Einsatz-Details mit AI
 * 8. Merge AI-Daten mit komponiertem Schema
 */

class AIIncidentGenerator {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.locationGenerator = new LocationGenerator();
        this.weatherSystem = null;
        this.gameTimer = null; // ⏰ NEU: Game-Timer Referenz
        this.callTemplateMapper = null; // 📞 NEU: Call-Template-Mapper Referenz
        
        console.log('🤖 AI Incident Generator v3.1.0 initialisiert');
        console.log('   ✅ Nutzt Composition System');
        console.log('   🌦️ Weather-System Integration');
        console.log('   ⏰ Game-Timer Integration');
        console.log('   📞 Call-Template-Mapper Integration');
    }
    
    /**
     * Setzt Wettersystem-Referenz
     */
    setWeatherSystem(weatherSystem) {
        this.weatherSystem = weatherSystem;
        console.log('🌦️ Weather-System verbunden');
    }
    
    /**
     * ⏰ NEU: Setzt Game-Timer Referenz
     */
    setGameTimer(gameTimer) {
        this.gameTimer = gameTimer;
        console.log('⏰ Game-Timer verbunden');
    }
    
    /**
     * 📞 NEU: Setzt Call-Template-Mapper Referenz
     */
    setCallTemplateMapper(mapper) {
        this.callTemplateMapper = mapper;
        console.log('📞 Call-Template-Mapper verbunden');
    }
    
    /**
     * 🆕 HAUPT-FUNKTION: Generiert Einsatz mit Composition System
     */
    async generateIncident(ownedVehicles, gameTime) {
        console.group('🚑 GENERIERE EINSATZ MIT COMPOSITION SYSTEM v3.1.0');
        
        try {
            // 1. Prüfe ob Composer verfügbar
            if (!window.incidentComposer || !window.incidentComposer.loaded) {
                console.error('❌ incidentComposer nicht geladen!');
                console.groupEnd();
                return this.createFallbackIncident();
            }
            
            // 2. Generiere Ort
            const location = await this.locationGenerator.generateIncidentLocation();
            console.log(`📍 Ort: ${location.address}`);
            
            // 3. 🆙 Hole erweiterten Kontext (Zeit, Wetter, Game-Timer)
            const context = this.gatherContext(gameTime);
            console.log(`⏰ Zeit: ${context.timeString} (${context.timeOfDay.name})`);
            console.log(`🌦️ Wetter: ${context.weather.name}`);
            if (context.dayOfWeek) {
                console.log(`📅 Wochentag: ${context.dayOfWeek}`);
            }
            
            // 4. 🆕 Wähle Severity intelligent
            const severity = this.selectSeverityLevel(context);
            console.log(`⚖️ Severity: ${severity}`);
            
            // 5. 🆕 Wähle Type (gewichtet)
            const type = this.selectIncidentType(context, severity);
            console.log(`🎭 Type: ${type}`);
            
            // 6. 🆕 Optional: Wähle Modifier
            const modifiers = this.selectModifiers(type, severity, context);
            if (modifiers.length > 0) {
                console.log(`⚙️ Modifiers: ${modifiers.join(', ')}`);
            }
            
            // 7. 🆕 KOMPONIERE SCHEMA
            const schema = window.incidentComposer.compose(severity, type, modifiers);
            if (!schema) {
                console.error('❌ Schema-Komposition fehlgeschlagen');
                console.groupEnd();
                return this.createFallbackIncident();
            }
            console.log(`🎼 Schema komponiert: ${schema.stichwort}`);
            
            // 8. 📞 NEU: Mappe zu Call-Template (wenn verfügbar)
            let callTemplate = null;
            if (this.callTemplateMapper) {
                callTemplate = this.callTemplateMapper.mapToTemplate(severity, type, modifiers);
                if (callTemplate) {
                    console.log(`📞 Call-Template: ${callTemplate.templateName}`);
                }
            }
            
            // 9. Erstelle Type-spezifischen Groq-Prompt
            const prompt = this.buildTypeSpecificPrompt(schema, location, context, callTemplate);
            
            // 10. Rufe Groq API auf
            const aiData = await this.callGroqAPI(prompt);
            
            if (!aiData) {
                console.warn('⚠️ Groq API lieferte keine Daten, nutze Schema-Defaults');
                return this.createIncidentFromSchema(schema, location, context, {}, callTemplate);
            }
            
            // 11. 🆕 Merge AI-Daten mit Schema & Template
            const incident = this.mergeAIWithSchema(aiData, schema, location, context, callTemplate);
            
            console.log(`✅ Einsatz generiert: ${incident.stichwort}`);
            console.groupEnd();
            
            return incident;
            
        } catch (error) {
            console.error('❌ Fehler bei Einsatzgenerierung:', error);
            console.groupEnd();
            return this.createFallbackIncident();
        }
    }
    
    /**
     * 🆙 ERWEITERT: Sammelt Kontext-Daten (Zeit, Wetter, Game-Timer)
     */
    gatherContext(gameTime) {
        // ⏰ Nutze Game-Timer wenn verfügbar (sonst Fallback)
        let currentHour, currentMinute, dayOfWeek;
        
        if (this.gameTimer) {
            currentHour = this.gameTimer.getHour();
            currentMinute = this.gameTimer.getMinute();
            dayOfWeek = this.gameTimer.getDayOfWeek();
        } else if (gameTime) {
            currentHour = gameTime.getHours();
            currentMinute = gameTime.getMinutes();
            dayOfWeek = gameTime.toLocaleDateString('de-DE', { weekday: 'long' });
        } else {
            const now = new Date();
            currentHour = now.getHours();
            currentMinute = now.getMinutes();
            dayOfWeek = now.toLocaleDateString('de-DE', { weekday: 'long' });
        }
        
        const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        
        // 🌦️ Weather-System nutzen
        const weather = this.weatherSystem ? 
            this.weatherSystem.getCurrentWeather() : { name: 'Trocken', icon: '☀️' };
        const timeOfDay = this.weatherSystem ? 
            this.weatherSystem.getCurrentTimeOfDay() : { name: 'Tag' };
        
        return {
            currentHour,
            currentMinute,
            timeString,
            dayOfWeek,
            weather,
            timeOfDay,
            isWeekend: dayOfWeek === 'Samstag' || dayOfWeek === 'Sonntag',
            isNight: currentHour >= 22 || currentHour < 6,
            isRushHour: (currentHour >= 7 && currentHour <= 9) || (currentHour >= 16 && currentHour <= 19)
        };
    }
    
    /**
     * 🆙 ERWEITERT: Wählt Severity basierend auf erweiterten Kontext
     */
    selectSeverityLevel(context) {
        const weights = {
            MINOR: 0.5,
            MODERATE: 0.35,
            CRITICAL: 0.15
        };
        
        // 🌙 Nacht = mehr CRITICAL
        if (context.isNight) {
            weights.CRITICAL += 0.12;
            weights.MINOR -= 0.07;
            weights.MODERATE -= 0.05;
        }
        
        // 🚗 Rush-Hour = mehr MODERATE (Verkehr)
        if (context.isRushHour) {
            weights.MODERATE += 0.08;
            weights.MINOR -= 0.05;
            weights.CRITICAL -= 0.03;
        }
        
        // 🍻 Wochenende = andere Verteilung
        if (context.isWeekend) {
            weights.MODERATE += 0.05;
            weights.MINOR -= 0.05;
        }
        
        // ❄️ Schnee/Eis = mehr MODERATE/CRITICAL
        if (context.weather.name === 'Schnee' || context.weather.name === 'Eisregen') {
            weights.CRITICAL += 0.07;
            weights.MODERATE += 0.12;
            weights.MINOR -= 0.19;
        }
        
        // ⛈️ Gewitter = mehr CRITICAL
        if (context.weather.name === 'Gewitter') {
            weights.CRITICAL += 0.10;
            weights.MODERATE += 0.05;
            weights.MINOR -= 0.15;
        }
        
        // 🔥 Hitze-Welle (Sommer, Mittag-Nachmittag)
        if (context.currentHour >= 12 && context.currentHour <= 17) {
            weights.MODERATE += 0.05;
            weights.MINOR -= 0.05;
        }
        
        return this.weightedRandom(weights);
    }
    
    /**
     * 🆙 ERWEITERT: Wählt Incident Type (erweiterte Kontextabhängigkeit)
     */
    selectIncidentType(context, severity) {
        const weights = {
            MEDICAL: 0.40,
            TRAFFIC: 0.25,
            PEDIATRIC: 0.15,
            BIRTH: 0.05,
            PSYCHIATRIC: 0.05,
            DROWNING: 0.03,
            POISONING: 0.04,
            ALLERGIC: 0.03
        };
        
        // ❄️ Schnee/Eis = DEUTLICH mehr TRAFFIC
        if (context.weather.name === 'Schnee' || context.weather.name === 'Eisregen') {
            weights.TRAFFIC += 0.25;
            weights.MEDICAL -= 0.12;
            weights.PEDIATRIC -= 0.07;
            weights.BIRTH -= 0.06;
        }
        
        // 🌧️ Regen = mehr TRAFFIC
        if (context.weather.name === 'Regen') {
            weights.TRAFFIC += 0.12;
            weights.MEDICAL -= 0.06;
            weights.PEDIATRIC -= 0.06;
        }
        
        // ☀️ Hitze = mehr MEDICAL (Kreislauf)
        if (context.weather.name === 'Sonnig' && context.currentHour >= 12 && context.currentHour <= 18) {
            weights.MEDICAL += 0.12;
            weights.TRAFFIC -= 0.06;
            weights.PEDIATRIC -= 0.06;
        }
        
        // 🌙 Nacht = weniger BIRTH/PEDIATRIC, mehr PSYCHIATRIC
        if (context.isNight) {
            weights.MEDICAL += 0.08;
            weights.PSYCHIATRIC += 0.10;
            weights.BIRTH -= 0.08;
            weights.PEDIATRIC -= 0.10;
        }
        
        // 🚗 Rush-Hour = mehr TRAFFIC
        if (context.isRushHour) {
            weights.TRAFFIC += 0.15;
            weights.MEDICAL -= 0.08;
            weights.PEDIATRIC -= 0.07;
        }
        
        // 🍻 Wochenende Abend = mehr PSYCHIATRIC (Alkohol)
        if (context.isWeekend && context.currentHour >= 20) {
            weights.PSYCHIATRIC += 0.08;
            weights.MEDICAL -= 0.04;
            weights.TRAFFIC -= 0.04;
        }
        
        return this.weightedRandom(weights);
    }
    
    /**
     * 🆕 Wählt Modifiers (chance basierend auf Severity)
     */
    selectModifiers(type, severity, context) {
        const modifiers = [];
        
        // Modifier-Chance nach Severity
        const modifierChances = {
            MINOR: 0.05,      // 5%
            MODERATE: 0.15,   // 15%
            CRITICAL: 0.30    // 30%
        };
        
        const chance = modifierChances[severity] || 0.1;
        
        if (Math.random() >= chance) {
            return modifiers; // Kein Modifier
        }
        
        // Hole anwendbare Modifiers für diesen Type
        const applicableModifiers = [];
        
        if (window.INCIDENT_MODIFIERS) {
            for (const [id, modifier] of Object.entries(window.INCIDENT_MODIFIERS)) {
                if (modifier.applicableTo.includes(type)) {
                    applicableModifiers.push(id);
                }
            }
        }
        
        if (applicableModifiers.length === 0) {
            return modifiers;
        }
        
        // Wähle einen zufälligen Modifier
        const selectedModifier = applicableModifiers[
            Math.floor(Math.random() * applicableModifiers.length)
        ];
        
        modifiers.push(selectedModifier);
        
        return modifiers;
    }
    
    /**
     * 📞 ERWEITERT: Erstellt Type-spezifischen Groq-Prompt (mit Call-Template)
     */
    buildTypeSpecificPrompt(schema, location, context, callTemplate) {
        let basePrompt = `Du bist ein realistischer Notruf-Generator für die Integrierte Leitstelle Rems-Murr-Kreis.

ERSTELLE EINEN HOCHREALISTISCHEN NOTRUF:

RAHMENBEDINGUNGUNGEN:
Ort: ${location.address}
Gemeinde: ${location.hotspot}
Zeit: ${context.timeString} Uhr (${context.timeOfDay.name})
Wetter: ${context.weather.name}
Wochentag: ${context.dayOfWeek || 'Werktag'}

EINSATZ-SCHEMA:
Stichwort: ${schema.stichwort}
Type: ${schema.name}
Schweregrad: ${schema.compositionInfo.severity}
Modifiers: ${schema.compositionInfo.modifiers.join(', ') || 'Keine'}

`;

        // 📞 NEU: Füge Call-Template hinzu (wenn vorhanden)
        if (callTemplate) {
            basePrompt += `CALL-TEMPLATE GUIDANCE:
Template: ${callTemplate.templateName}
Description: ${callTemplate.description}
Key Questions: ${callTemplate.keyQuestions.join(', ')}

`;
        }

        // Type-spezifische Anweisungen
        const typeInstructions = this.getTypeSpecificInstructions(schema.compositionInfo.type, schema, context);
        
        const jsonFormat = `
ANTWORTE NUR ALS JSON (kein Text!):
{
  "ortsbeschreibung": "Spezifische Beschreibung passend zur Adresse (z.B. '3. OG links', 'Auf B14 Richtung Stuttgart')",
  "meldebild": "Erste aufgeregte/emotionale Meldung (15-30 Wörter)",
  "anrufer_typ": "${this.getCallerTypeExample(schema)}",
  "patient_alter": ${this.getAgeRange(schema)},
  "patient_geschlecht": "männlich/weiblich",
  "patient_vorerkrankungen": "Optional: z.B. Diabetes, Herzerkrankung",
  "besonderheiten": "${this.getSpecialFeaturesExample(schema)}"
}`;

        return basePrompt + typeInstructions + jsonFormat;
    }
    
    /**
     * 🆙 ERWEITERT: Type-spezifische Anweisungen (mit Kontext-Infos)
     */
    getTypeSpecificInstructions(type, schema, context) {
        const instructions = {
            MEDICAL: `
TYPE: MEDIZINISCHER NOTFALL

KONTEXT:
- Tageszeit: ${context.timeOfDay.name}
- Wetter: ${context.weather.name}
- Wochentag: ${context.dayOfWeek || 'Werktag'}

FOKUS AUF:
- Symptome: ${schema.criticalSymptoms ? schema.criticalSymptoms.join(', ') : 'Brustschmerzen, Atemnot, Schwindel'}
- Bewusstsein: Ansprechbar? Verwirrt? Bewusstlos?
- Atmung: Normal? Erschwert? Keine Atmung?
- Vorerkrankungen: Diabetes, Herzerkrankung, Asthma?
- Medikamente: Nimmt Patient regelmäßig Medikamente?

MELDEBILD-BEISPIELE:
- "Mein Mann hat plötzlich starke Brustschmerzen bekommen!"
- "Meine Mutter atmet ganz schwer und ist blass!"
- "Er ist einfach umgekippt, ich kriege ihn nicht wach!"
`,
            
            TRAFFIC: `
TYPE: VERKEHRSUNFALL

KONTEXT:
- Tageszeit: ${context.timeOfDay.name}
- Wetter: ${context.weather.name} ${context.weather.name === 'Schnee' || context.weather.name === 'Eisregen' ? '(GLATTEIS!)' : ''}
- Verkehrslage: ${context.isRushHour ? 'Rush-Hour!' : 'Normal'}

FOKUS AUF:
- Fahrzeuganzahl: Wie viele Fahrzeuge beteiligt?
- Verletzte: Wie viele Personen verletzt?
- Eingeklemmt: Ist jemand im Fahrzeug eingeklemmt? (falls Modifier ENTRAPMENT)
- Straßenlage: Welche Fahrbahn? Richtung?
- Verkehr: Ist die Straße blockiert?

MELDEBILD-BEISPIELE:
- "Hier ist ein Unfall passiert, zwei Autos sind zusammengestoßen!"
- "Bitte kommen Sie schnell, da ist jemand im Auto eingeklemmt!"
- "Auf der B14 Richtung Stuttgart, ein Auto liegt im Graben!"
`,
            
            BIRTH: `
TYPE: GEBURT

KONTEXT:
- Tageszeit: ${context.timeOfDay.name}
- Ort-Type: ${location.hotspot}

FOKUS AUF:
- Wehen: Wie oft kommen die Wehen? Abstände?
- Pressdrang: Hat die Frau Pressdrang?
- Baby sichtbar: Ist schon etwas vom Baby zu sehen?
- Fruchtblase: Ist die Fruchtblase geplatzt?
- Vorherige Geburten: Wie viele Kinder hat sie schon?

MELDEBILD-BEISPIELE:
- "Die Wehen kommen jetzt ganz schnell hintereinander!"
- "Meine Frau muss pressen, ich sehe schon den Kopf!"
- "Es geht los, das Baby kommt, was soll ich tun?!"
`,
            
            PEDIATRIC: `
TYPE: KINDERNOTFALL

KONTEXT:
- Tageszeit: ${context.timeOfDay.name}
- Wochentag: ${context.dayOfWeek || 'Werktag'}

FOKUS AUF:
- Alter: Wie alt ist das Kind? (Säugling/Kleinkind/Kind)
- Symptome: Fieber? Atemnot? Krampfanfall?
- Bewusstsein: Ist das Kind ansprechbar?
- Unfallhergang: Was ist passiert?
- Eltern-Panik: Eltern sind oft sehr aufgeregt!

MELDEBILD-BEISPIELE:
- "Mein Baby atmet so komisch und ist ganz heiß!"
- "Meine Tochter hatte gerade einen Krampfanfall!"
- "Er ist vom Klettengerüst gefallen und schreit nur noch!"
`,
            
            PSYCHIATRIC: `
TYPE: PSYCHIATRISCHER NOTFALL

KONTEXT:
- Tageszeit: ${context.timeOfDay.name}
- Wochenende: ${context.isWeekend ? 'JA (Alkohol?)' : 'Nein'}

FOKUS AUF:
- Suizidalität: Hat die Person Suizidgedanken geäußert?
- Aggression: Ist die Person aggressiv?
- Eigen-/Fremdgefährdung: Besteht Gefahr?
- Bekannte Erkrankung: Psychiatrische Vorerkrankung?
- Medikamente: Nimmt die Person Psychopharmaka?

MELDEBILD-BEISPIELE:
- "Mein Sohn redet wirres Zeug und will sich was antun!"
- "Die Frau schreit und schlägt um sich, wir haben Angst!"
- "Er hat gesagt er will nicht mehr leben..."
`,
            
            DROWNING: `
TYPE: ERTRINKUNGSNOTFALL

KONTEXT:
- Tageszeit: ${context.timeOfDay.name}
- Wetter: ${context.weather.name}

FOKUS AUF:
- Ort: See? Schwimmbad? Fluss?
- Gerettet: Wurde die Person schon aus dem Wasser geholt?
- Bewusstsein: Ist die Person ansprechbar?
- Atmung: Atmet die Person?
- Unterkühlung: Wie lange war die Person im Wasser?

MELDEBILD-BEISPIELE:
- "Am See, jemand ist untergegangen!"
- "Wir haben ihn rausgezogen, aber er atmet nicht!"
- "Im Schwimmbad, ein Kind ist bewusstlos!"
`,
            
            POISONING: `
TYPE: VERGIFTUNG

KONTEXT:
- Tageszeit: ${context.timeOfDay.name}

FOKUS AUF:
- Substanz: Was wurde eingenommen? Medikamente? Reinigungsmittel?
- Menge: Wie viel wurde eingenommen?
- Zeitpunkt: Wann wurde es eingenommen?
- Symptome: Übelkeit? Erbrechen? Bewusstlosigkeit?
- Verpackung: Ist die Verpackung noch da?

MELDEBILD-BEISPIELE:
- "Mein Kind hat Tabletten geschluckt!"
- "Er hat Reinigungsmittel getrunken, ich weiß nicht was ich tun soll!"
- "Sie hat ihre Medikamente alle auf einmal genommen!"
`,
            
            ALLERGIC: `
TYPE: ALLERGISCHE REAKTION

KONTEXT:
- Tageszeit: ${context.timeOfDay.name}
- Wetter: ${context.weather.name}

FOKUS AUF:
- Allergen: Worauf reagiert die Person? Nahrung? Insektenstich?
- Symptome: Schwellung? Atemnot? Ausschlag?
- Bekannte Allergie: War die Allergie bekannt?
- EpiPen: Ist ein Adrenalin-Pen vorhanden?
- Verschlechterung: Wird es schnell schlimmer?

MELDEBILD-BEISPIELE:
- "Sie wurde von einer Wespe gestochen und kriegt keine Luft mehr!"
- "Sein Gesicht schwillt total an nach dem Essen!"
- "Allergische Reaktion, wir haben einen EpiPen, sollen wir den benutzen?!"
`
        };
        
        return instructions[type] || instructions.MEDICAL;
    }
    
    /**
     * Beispiel Anrufer-Typ basierend auf Schema
     */
    getCallerTypeExample(schema) {
        if (schema.callerTypes && schema.callerTypes.length > 0) {
            return schema.callerTypes.join('/') + ' (wähle passend)';
        }
        return 'Angehöriger/Passant/Betroffener (wähle passend)';
    }
    
    /**
     * Alter-Range basierend auf Schema
     */
    getAgeRange(schema) {
        if (schema.patientProfile && schema.patientProfile.ageRange) {
            const range = schema.patientProfile.ageRange;
            return `${range.min}-${range.max}`;
        }
        return '5-100';
    }
    
    /**
     * Besonderheiten-Beispiele
     */
    getSpecialFeaturesExample(schema) {
        if (schema.specialFeatures && schema.specialFeatures.length > 0) {
            return schema.specialFeatures.slice(0, 3).join(', ');
        }
        return 'Optional: z.B. Reanimation, starke Blutung, Schockzustand';
    }
    
    /**
     * Ruft Groq API auf
     */
    async callGroqAPI(prompt) {
        if (!this.apiKey) {
            console.warn('⚠️ Kein Groq API Key vorhanden');
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
                    temperature: 1.2,
                    max_tokens: 800,
                    response_format: { type: 'json_object' }
                }),
                signal: AbortSignal.timeout(15000)
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
     * 🆙 ERWEITERT: Merged AI-Daten mit komponiertem Schema & Call-Template
     */
    mergeAIWithSchema(aiData, schema, location, context, callTemplate = null) {
        const incidentId = `E${Date.now().toString().slice(-8)}`;
        
        // ✅ FIX: Hospital direkt aus HOSPITALS wählen
        let targetHospital = null;
        if (schema.transport.probability > 0.5) {
            targetHospital = this.selectNearestHospital([location.lat, location.lon]);
        }
        
        const incident = {
            // IDs
            id: incidentId,
            
            // ✅ Aus Schema
            stichwort: schema.stichwort,
            keyword: schema.stichwort,
            name: schema.name,
            category: schema.category,
            organization: schema.organization,
            priority: schema.priority,
            
            // ✅ Ort (AI + Location)
            ort: `${aiData.ortsbeschreibung || location.address}, ${location.address}`,
            location: location.address,
            ortsbeschreibung: aiData.ortsbeschreibung || location.address,
            koordinaten: { lat: location.lat, lon: location.lon },
            position: [location.lat, location.lon],
            
            // ✅ Meldung (AI)
            meldebild: aiData.meldebild || 'Notruf eingegangen',
            initialMessage: aiData.meldebild || 'Notruf eingegangen',
            
            // ✅ Zeit
            zeitstempel: context.timeString,
            timestamp: Date.now(),
            
            // ✅ Patient (AI + Schema)
            anrufer_typ: aiData.anrufer_typ || this.selectRandomCallerType(schema),
            patient_alter: aiData.patient_alter || this.generateAge(schema),
            patient_geschlecht: aiData.patient_geschlecht || this.randomGender(),
            patient_vorerkrankungen: aiData.patient_vorerkrankungen || null,
            
            // ✅ Einsatz-Details (Schema)
            anzahl_patienten: 1,
            schweregrad: schema.compositionInfo.severity,
            besonderheiten: aiData.besonderheiten || schema.specialFeatures?.[0] || null,
            
            // ✅ Dauer & Transport (Schema)
            einsatzdauer_minuten: schema.duration.min + Math.floor(Math.random() * (schema.duration.max - schema.duration.min)),
            transport_notwendig: schema.transport.probability > 0.5,
            zielkrankenhaus: targetHospital,
            
            // ✅ Fahrzeuge (Schema)
            benoetigte_fahrzeuge: this.convertVehiclesToObject(schema.vehicles),
            assignedVehicles: [],
            
            // ✅ Status
            status: 'incoming',
            completed: false,
            startTime: null,
            endTime: null,
            
            // ✅ Conversation (Schema)
            caller: aiData.anrufer_typ || this.selectRandomCallerType(schema),
            conversationState: {
                locationKnown: true,
                detailsKnown: false,
                symptomsKnown: false,
                ageKnown: false
            },
            conversationHistory: [],
            
            // ✅ KOMPOSITIONS-INFO
            compositionInfo: schema.compositionInfo,
            composedSchema: schema
        };
        
        // 📞 NEU: Füge Call-Template hinzu (wenn vorhanden)
        if (callTemplate) {
            incident.callTemplate = {
                templateName: callTemplate.templateName,
                description: callTemplate.description,
                keyQuestions: callTemplate.keyQuestions,
                protocolSteps: callTemplate.protocolSteps
            };
        }
        
        return incident;
    }
    
    /**
     * ✅ FIX: Wählt nächstes Krankenhaus aus HOSPITALS
     * @returns {object|null} Hospital-Objekt mit .location Property
     */
    selectNearestHospital(position) {
        if (!window.HOSPITALS || HOSPITALS.length === 0) {
            console.warn('⚠️ HOSPITALS nicht verfügbar');
            return null;
        }
        
        // Nutze HOSPITALS.findNearest()
        const hospital = HOSPITALS.findNearest(position, { emergencyRoom: true });
        
        if (!hospital) {
            console.warn('⚠️ Kein Krankenhaus gefunden');
            return null;
        }
        
        console.log(`🏥 Krankenhaus gewählt: ${hospital.shortName}`);
        return hospital;
    }
    
    /**
     * Erstellt Incident direkt aus Schema (ohne AI)
     */
    createIncidentFromSchema(schema, location, context, aiData, callTemplate = null) {
        return this.mergeAIWithSchema(aiData, schema, location, context, callTemplate);
    }
    
    /**
     * Konvertiert Schema-Fahrzeuge zu Object-Format
     */
    convertVehiclesToObject(vehicles) {
        const result = {
            RTW: 0,
            NEF: 0,
            NAW: 0,
            KTW: 0
        };
        
        // Required Fahrzeuge
        if (vehicles.required) {
            vehicles.required.forEach(v => {
                if (result.hasOwnProperty(v)) {
                    result[v]++;
                }
            });
        }
        
        // Optional: 30% Chance
        if (vehicles.optional && Math.random() < 0.3) {
            const optional = vehicles.optional[Math.floor(Math.random() * vehicles.optional.length)];
            if (result.hasOwnProperty(optional)) {
                result[optional]++;
            }
        }
        
        return result;
    }
    
    /**
     * Wählt zufälligen Anrufer-Typ aus Schema
     */
    selectRandomCallerType(schema) {
        if (schema.callerTypes && schema.callerTypes.length > 0) {
            return schema.callerTypes[Math.floor(Math.random() * schema.callerTypes.length)];
        }
        return 'Angehöriger';
    }
    
    /**
     * Generiert Alter basierend auf Schema
     */
    generateAge(schema) {
        if (schema.patientProfile && schema.patientProfile.ageRange) {
            const range = schema.patientProfile.ageRange;
            return range.min + Math.floor(Math.random() * (range.max - range.min));
        }
        return 20 + Math.floor(Math.random() * 60);
    }
    
    /**
     * Zufälliges Geschlecht
     */
    randomGender() {
        return Math.random() < 0.5 ? 'männlich' : 'weiblich';
    }
    
    /**
     * Gewichtete Zufallsauswahl
     */
    weightedRandom(weights) {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [key, weight] of Object.entries(weights)) {
            cumulative += weight;
            if (rand <= cumulative) {
                return key;
            }
        }
        
        return Object.keys(weights)[0];
    }
    
    /**
     * Fallback wenn alles fehlschlägt
     */
    createFallbackIncident() {
        console.warn('⚠️ Erstelle Fallback-Einsatz');
        
        return {
            id: `E${Date.now().toString().slice(-8)}`,
            stichwort: 'RD 1',
            keyword: 'RD 1',
            name: 'Medizinischer Notfall - Minor',
            ort: 'Waiblingen, Bahnhofstraße',
            koordinaten: { lat: 48.8314, lon: 9.3177 },
            position: [48.8314, 9.3177],
            meldebild: 'Patient mit Bauchschmerzen',
            zeitstempel: new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'}),
            einsatzdauer_minuten: 20,
            transport_notwendig: true,
            benoetigte_fahrzeuge: { RTW: 1, NEF: 0, NAW: 0, KTW: 0 },
            assignedVehicles: [],
            status: 'incoming',
            completed: false,
            patient_alter: 45,
            patient_geschlecht: 'männlich',
            anrufer_typ: 'Angehöriger'
        };
    }
}

// Globale Instanz
window.AIIncidentGenerator = AIIncidentGenerator;

console.log('🤖 AI Incident Generator v3.1.0 geladen - ✅ VOLLSTÄNDIGE INTEGRATION: Weather + Timer + Call-Templates! 🌦️⏰📞');
