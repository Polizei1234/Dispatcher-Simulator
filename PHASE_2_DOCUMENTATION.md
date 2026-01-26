# 📋 PHASE 2 DOCUMENTATION - INTEGRATION & CONVERSATION ENGINE

**Version:** 7.0.0  
**Datum:** 26. Januar 2026  
**Status:** 🚧 IN ARBEIT

---

## 📊 ÜBERSICHT

### **Phase 1 ✅ ABGESCHLOSSEN**
Kompositions-System für flexible, modulare Einsatzerstellung

### **Phase 2 🚧 AKTUELL**
Integration des Kompositions-Systems in bestehende Systeme

### **Phase 3 ⏳ GEPLANT**
Conversation Engine für dynamische Notruf-Gespräche

---

## ✅ PHASE 1 - ABGESCHLOSSEN (v7.0.0)

### **Erstellte Dateien:**

#### 1. **`js/data/severity-bases.js`** (3 Schweregrade)
- ✅ **MINOR** (Prio 3) - Leichte Notfälle
  - Beispiele: Leichte Verletzungen, Bauchschmerzen, Sturz ohne Bewusstlosigkeit
  - Fahrzeuge: 1 RTW
  - Dauer: 15-30 Min
  - Eskalation: 10% → MODERATE

- ✅ **MODERATE** (Prio 2) - Mittlere Notfälle
  - Beispiele: Atemnot, Brustschmerzen, Schlaganfall-Verdacht
  - Fahrzeuge: 1 RTW + 1 NEF
  - Dauer: 25-45 Min
  - Eskalation: 15% → CRITICAL

- ✅ **CRITICAL** (Prio 1) - Schwere/lebensbedrohliche Notfälle
  - Beispiele: Herzinfarkt, Bewusstlosigkeit, Reanimation
  - Fahrzeuge: 2 RTW + 1 NEF + 1 NAW
  - Dauer: 35-90 Min
  - Komplikationen statt Eskalation

**Struktur jedes Levels:**
```javascript
{
  name: "Minor",
  description: "Leichte Notfälle",
  priority: 3,
  vehicles: { required: [], optional: [] },
  escalation: { probability, triggers, newLevel },
  conversation: { panicLevel, phoneStayRequired, ... },
  duration: { min, max, modifiers },
  transport: { probability, urgency, hospitalType },
  patientProfile: { ageRange, commonConditions, ... }
}
```

#### 2. **`js/data/incident-types.js`** (8 Einsatzarten)
- ✅ **MEDICAL** - Medizinische Notfälle
- ✅ **TRAFFIC** - Verkehrsunfälle
- ✅ **BIRTH** - Geburten
- ✅ **PEDIATRIC** - Kindernotfälle
- ✅ **PSYCHIATRIC** - Psychiatrische Notfälle
- ✅ **DROWNING** - Ertrinkungsnotfälle
- ✅ **POISONING** - Vergiftungen
- ✅ **ALLERGIC** - Allergische Reaktionen

**Struktur jedes Types:**
```javascript
{
  id: "MEDICAL",
  name: "Medizinischer Notfall",
  category: "medical",
  organization: "Rettungsdienst",
  description: "...",
  keywords: { MINOR: "RD 1", MODERATE: "RD 2", CRITICAL: "RD 3" },
  questionCategories: ["vital_signs", "symptoms", ...],
  requiredQuestions: ["consciousness", "breathing"],
  criticalSymptoms: [...],
  commonConditions: { MINOR: [...], MODERATE: [...], CRITICAL: [...] },
  locations: [...],
  callerTypes: [...],
  emotionVariants: { MINOR: [...], MODERATE: [...], CRITICAL: [...] }
}
```

#### 3. **`js/data/incident-modifiers.js`** (5 Modifikatoren)
- ✅ **ENTRAPMENT** - Person eingeklemmt (+Feuerwehr, +Zeit)
- ✅ **MULTI_PATIENT** - Mehrere Verletzte (+Fahrzeuge)
- ✅ **HAZMAT** - Gefahrstoffe (+Spezialeinheiten)
- ✅ **FIRE** - Brand (+Feuerwehr)
- ✅ **DIFFICULT_ACCESS** - Schwieriger Zugang (+Zeit, +Spezialeinheiten)

**Struktur jedes Modifiers:**
```javascript
{
  id: "ENTRAPMENT",
  name: "Person eingeklemmt",
  description: "...",
  effects: {
    durationMultiplier: 1.8,
    vehicleAdd: ["LF", "RW", "DLK"],
    questionAdd: ["entrapment_details"],
    escalationModifier: 1.3,
    panicModifier: 1.5
  },
  applicableTo: ["TRAFFIC", "BIRTH"],
  specialFeatures: [...],
  complications: [{ type: "...", probability: 0.2 }]
}
```

#### 4. **`js/core/incident-composer.js`** (Kompositions-Engine)
**Hauptfunktionen:**
- ✅ `compose(severity, type, modifiers)` - Komponiert vollständigen Einsatz
- ✅ `composeRandom(weights)` - Zufälliger Einsatz mit Gewichtung
- ✅ `mergeType()` - Merged Type-Eigenschaften
- ✅ `applyModifier()` - Wendet Modifiers an
- ✅ `generateKeyword()` - Generiert Stichwörter (z.B. "VU P")
- ✅ `getAllCombinations()` - Zeigt alle 120+ Kombinationen

**Beispiel-Nutzung:**
```javascript
// VU mit Person eingeklemmt
const incident = incidentComposer.compose('CRITICAL', 'TRAFFIC', ['ENTRAPMENT']);

// Zufälliger Einsatz
const random = incidentComposer.composeRandom();
```

#### 5. **`js/data/conversation-pools.js`** (Fragen-Datenbank)
**15 Kategorien mit 50+ Fragen:**
- ✅ `vital_signs` - Bewusstsein, Atmung, Puls, Hautfarbe
- ✅ `symptoms` - Brustschmerzen, Atemnot, etc.
- ✅ `time_critical` - Seit wann Beschwerden?
- ✅ `medical_history` - Vorerkrankungen, Medikamente
- ✅ `accident_details` - Fahrzeuganzahl, Eingeklemmt?
- ✅ `entrapment_details` - Wo eingeklemmt? Fahrzeug stabil?
- ✅ `contractions` - Wehen-Abstände, Pressdrang
- ✅ `age_weight` - Alter des Kindes, Fieber
- ✅ `cpr_guidance` - Reanimations-Anleitung
- ✅ `mental_state` - Suizidgedanken, Aggression
- ✅ `substance_details` - Vergiftungs-Details
- ✅ `allergen` - Allergen, EpiPen vorhanden?
- ... und mehr

**Fragen-Struktur:**
```javascript
{
  id: "consciousness",
  question: "Ist die Person bei Bewusstsein?",
  questionVariants: ["Ist der Patient ansprechbar?", ...],
  answerOptions: [
    { value: "yes", text: "Ja, ansprechbar", critical: false },
    { value: "no", text: "Nein, bewusstlos", critical: true }
  ],
  critical: true,
  category: "vital",
  followUp: { "no": ["breathing", "pulse"] }
}
```

### **Statistiken Phase 1:**
- 📦 **5 neue Dateien** erstellt
- 🎯 **120+ Einsatz-Kombinationen** möglich
- 📉 **86% weniger Code** als separate Schemas
- ⚙️ **16 Definitionen** statt 120 einzelne Schemas
- 💬 **50+ Fragen** in 15 Kategorien
- ✅ **Version 7.0.0** deployed

---

## 🚧 PHASE 2 - IN ARBEIT (v7.1.0)

### **Ziel:**
Integration des Kompositions-Systems in bestehende Systeme

### **Teil 1: AI Generator Umbau** ⏳ IN ARBEIT

#### **Datei:** `js/systems/ai-incident-generator.js`

**Änderungen:**
1. ✅ Nutzt `incidentComposer.composeRandom()` statt feste Templates
2. ✅ Severity-Level intelligent wählen basierend auf:
   - Tageszeit (Nacht = mehr CRITICAL)
   - Wetter (Schnee/Eis = mehr TRAFFIC)
   - Zufall mit Gewichtung
3. ✅ Type-spezifische Groq-Prompts:
   - MEDICAL: Symptome, Vitalzeichen, Vorerkrankungen
   - TRAFFIC: Fahrzeuganzahl, Eingeklemmt, Straßenlage
   - BIRTH: Wehen, Pressdrang, Baby sichtbar
   - etc.
4. ✅ Modifier-Chance basierend auf Severity:
   - MINOR: 5% Chance
   - MODERATE: 15% Chance
   - CRITICAL: 30% Chance
5. ✅ Validation gegen komponiertes Schema

**Neue Funktionen:**
```javascript
class AIIncidentGenerator {
  // 🆕 Wählt Severity basierend auf Kontext
  selectSeverityLevel(timeOfDay, weather, random)
  
  // 🆕 Erstellt Type-spezifischen Prompt
  buildTypeSpecificPrompt(composedSchema, location, context)
  
  // 🆕 Validiert AI-Output gegen Schema
  validateAgainstSchema(aiData, composedSchema)
  
  // 🆕 Merged AI-Daten mit Schema
  mergeAIWithSchema(aiData, composedSchema, location)
}
```

**Vorher (alte Templates):**
```javascript
const templates = {
  'RD 1': { duration: 20, transport: true },
  'RD 2': { duration: 30, transport: true },
  // ... 50+ separate Schemas
}
```

**Nachher (Komposition):**
```javascript
const schema = incidentComposer.compose(
  severity,    // MINOR/MODERATE/CRITICAL
  type,        // MEDICAL/TRAFFIC/etc.
  modifiers    // ['ENTRAPMENT', 'FIRE']
);
```

---

### **Teil 2: Escalation System Umbau** ⏳ GEPLANT

#### **Datei:** `js/systems/escalation-system.js`

**Änderungen:**
1. ⏳ Nutzt `schema.escalation` aus Severity Base
2. ⏳ Eskalation: MINOR → MODERATE → CRITICAL
3. ⏳ Berücksichtigt Modifier-Effekte
4. ⏳ Komplikationen aus Modifier.complications
5. ⏳ Event-System für Eskalations-Trigger

**Neue Logik:**
```javascript
class EscalationSystem {
  // Prüft ob Eskalation eintritt
  checkEscalation(incident) {
    const schema = incident.compositionInfo;
    const escalation = schema.escalation;
    
    if (Math.random() < escalation.probability) {
      this.escalateIncident(incident, escalation.newLevel);
    }
  }
  
  // Eskaliert Einsatz zu neuem Level
  escalateIncident(incident, newLevel) {
    // Re-komponiere mit neuem Severity
    const newSchema = incidentComposer.compose(
      newLevel,
      incident.compositionInfo.type,
      incident.compositionInfo.modifiers
    );
    
    // Update Incident
    this.updateIncidentFromSchema(incident, newSchema);
  }
}
```

---

### **Teil 3: Call System Integration** ⏳ GEPLANT

#### **Datei:** `js/systems/call-system.js`

**Änderungen:**
1. ⏳ Nutzt `schema.conversation` für Gesprächs-Verhalten
2. ⏳ `panicLevel` steuert Anrufer-Emotion
3. ⏳ `phoneStayRequired` entscheidet ob Anleitung nötig
4. ⏳ Dynamische Fragen aus `schema.questionCategories`

---

## ⏳ PHASE 3 - GEPLANT (v8.0.0)

### **Ziel:**
Vollständige Conversation Engine mit dynamischen Notruf-Gesprächen

### **Neue Datei:** `js/systems/conversation-engine.js`

**Features:**
1. ⏳ Nutzt `CONVERSATION_POOLS` für Fragen
2. ⏳ Dynamischer Fragen-Flow basierend auf:
   - Incident Type (`questionCategories`)
   - Required Questions (`requiredQuestions`)
   - Follow-Up Logik (`followUp`)
   - Critical Symptoms (`criticalSymptoms`)
3. ⏳ Intelligent Question Selection:
   - Kritische Fragen zuerst
   - Follow-Ups basierend auf Antworten
   - Kontext-abhängige Fragen
4. ⏳ Answer Processing:
   - Trigger Actions bei kritischen Antworten
   - Update Incident Details
   - Eskalation wenn nötig
5. ⏳ AI-generierte Antworten:
   - Nutzt Groq für realistische Anrufer-Antworten
   - Berücksichtigt `emotionVariants` aus Type
   - Passt sich `panicLevel` an

**Klassen-Struktur:**
```javascript
class ConversationEngine {
  constructor(incidentSchema) {
    this.schema = incidentSchema;
    this.questionQueue = [];
    this.askedQuestions = [];
    this.conversationState = {};
  }
  
  // Initialisiert Fragen-Queue
  initializeQuestions() {
    // Hole Required Questions
    // Hole Type-spezifische Questions
    // Sortiere nach Kritikalität
  }
  
  // Gibt nächste Frage zurück
  getNextQuestion() {
    // Prüfe Follow-Ups
    // Prüfe kritische Fragen
    // Return nächste passende Frage
  }
  
  // Verarbeitet Antwort
  processAnswer(questionId, answer) {
    // Update Conversation State
    // Prüfe auf kritische Antworten
    // Trigger Follow-Ups
    // Update Incident wenn nötig
  }
  
  // Generiert AI-Antwort
  async generateCallerResponse(question, context) {
    // Nutzt Groq für realistische Antwort
    // Berücksichtigt Emotion, Panic Level, etc.
  }
}
```

**Beispiel-Flow:**
```javascript
// 1. Incident wird komponiert
const schema = incidentComposer.compose('CRITICAL', 'MEDICAL', []);

// 2. Conversation Engine wird initialisiert
const conversation = new ConversationEngine(schema);
conversation.initializeQuestions();

// 3. Fragen-Loop
while (!conversation.isComplete()) {
  const question = conversation.getNextQuestion();
  // Zeige Frage im UI
  
  const answer = await getUserAnswer(question);
  conversation.processAnswer(question.id, answer);
  
  // Bei kritischer Antwort: Sofortige Aktion
  if (answer.critical) {
    handleCriticalAnswer(answer);
  }
}

// 4. Gespräch abgeschlossen
const finalIncident = conversation.getFinalIncident();
```

---

## 📈 ROADMAP

### **v7.0.0 - ✅ ABGESCHLOSSEN**
- Phase 1: Kompositions-System

### **v7.1.0 - 🚧 IN ARBEIT**
- Phase 2 Teil 1: AI Generator Umbau
- Phase 2 Teil 2: Escalation System Umbau
- Phase 2 Teil 3: Call System Integration

### **v8.0.0 - ⏳ GEPLANT**
- Phase 3: Conversation Engine
- Vollständige Integration aller Systeme
- Testing & Bugfixes

### **v8.1.0 - ⏳ ZUKÜNFTIG**
- UI-Verbesserungen für Conversation System
- Erweiterte Fragen-Pools
- Mehr Incident Types (Intoxikation, Sturz, etc.)
- Mehr Modifiers (Höhe, Confined Space, etc.)

---

## 🎯 VORTEILE DES NEUEN SYSTEMS

### **Flexibilität:**
- ✅ 120+ Kombinationen aus nur 16 Definitionen
- ✅ Einfach erweiterbar (neuer Type = 3 neue Kombinationen)
- ✅ Modularer Aufbau

### **Wartbarkeit:**
- ✅ Zentrale Definitionen
- ✅ Keine Code-Duplikation
- ✅ Einfache Updates

### **Realismus:**
- ✅ Dynamische Fragen basierend auf Situation
- ✅ Realistische Eskalationen
- ✅ Kontext-abhängige Gespräche

### **Performance:**
- ✅ On-Demand Komposition
- ✅ Cached Schemas
- ✅ Effiziente Datenstrukturen

---

## 🧪 TESTING

### **Console-Tests für Phase 1:**
```javascript
// Test 1: Statistik anzeigen
incidentComposer.showStatistics()

// Test 2: VU mit Eingeklemmten
const vu = incidentComposer.compose('CRITICAL', 'TRAFFIC', ['ENTRAPMENT'])
console.log(vu)

// Test 3: Zufällig
const random = incidentComposer.composeRandom()
console.log(random)

// Test 4: Alle Kombinationen
const all = incidentComposer.getAllCombinations()
console.log(`Kombinationen: ${all.length}`)

// Test 5: Fragen abrufen
const vitalQuestions = ConversationPoolUtils.getQuestionsByCategory('vital_signs')
console.log(vitalQuestions)

// Test 6: Kritische Fragen
const critical = ConversationPoolUtils.getCriticalQuestions()
console.log(`Kritische Fragen: ${critical.length}`)
```

### **Tests für Phase 2 (nach Umbau):**
```javascript
// Test 1: AI Generator nutzt Composer
const generator = new AIIncidentGenerator(apiKey)
const incident = await generator.generateIncident(vehicles, gameTime)
console.log('Komponiert:', incident.compositionInfo)

// Test 2: Escalation
escalationSystem.checkEscalation(incident)

// Test 3: Conversation
const conversation = new ConversationEngine(incident)
const nextQuestion = conversation.getNextQuestion()
console.log(nextQuestion)
```

---

## 📝 CHANGELOG

### **v7.0.0 - Phase 1 Release (26.01.2026)**
- ✅ Severity Bases System erstellt
- ✅ Incident Types System erstellt
- ✅ Incident Modifiers System erstellt
- ✅ Incident Composer implementiert
- ✅ Conversation Pools Datenbank erstellt
- ✅ Version Config aktualisiert
- ✅ Dokumentation erstellt

### **v7.1.0 - Phase 2 Release (geplant)**
- 🚧 AI Generator umgebaut
- ⏳ Escalation System umgebaut
- ⏳ Call System integriert

### **v8.0.0 - Phase 3 Release (geplant)**
- ⏳ Conversation Engine implementiert
- ⏳ Vollständige System-Integration
- ⏳ UI-Updates

---

## 👥 ENTWICKLER-NOTIZEN

### **Wichtige Konzepte:**

1. **Komposition statt Vererbung:**
   - Schemas werden zur Laufzeit zusammengesetzt
   - Keine festen Klassen-Hierarchien

2. **Daten-getrieben:**
   - Fragen aus Pools, nicht hart-codiert
   - Verhalten aus Schemas, nicht Logik

3. **Separation of Concerns:**
   - Daten (data/) definieren WAS
   - Core (core/) definiert WIE
   - Systems (systems/) nutzen beides

4. **Erweiterbarkeit:**
   - Neuer Type → `incident-types.js`
   - Neuer Modifier → `incident-modifiers.js`
   - Neue Fragen → `conversation-pools.js`
   - Kein Code-Change in Core nötig!

### **Best Practices:**

- ✅ Immer `incidentComposer.compose()` für Incidents nutzen
- ✅ Nie direkt auf alte `incidents.js` zugreifen
- ✅ Fragen aus `CONVERSATION_POOLS` laden
- ✅ Schemas validieren vor Nutzung
- ✅ Console-Logs für Debugging aktiv lassen

---

## 🔗 DATEI-ÜBERSICHT

### **Phase 1 - Kompositions-System:**
```
js/
├── data/
│   ├── severity-bases.js         # 3 Schweregrade
│   ├── incident-types.js         # 8 Einsatzarten
│   ├── incident-modifiers.js     # 5 Modifikatoren
│   └── conversation-pools.js     # 50+ Fragen
├── core/
│   └── incident-composer.js      # Kompositions-Engine
```

### **Phase 2 - Integration:**
```
js/
├── systems/
│   ├── ai-incident-generator.js  # 🚧 Nutzt Composer
│   ├── escalation-system.js      # ⏳ Nutzt Schema
│   └── call-system.js            # ⏳ Nutzt Conversation
```

### **Phase 3 - Conversation:**
```
js/
├── systems/
│   └── conversation-engine.js    # ⏳ NEU - Dynamische Gespräche
```

---

## 📧 KONTAKT & SUPPORT

Bei Fragen oder Problemen:
- 📂 GitHub Issues
- 💬 Discord (falls vorhanden)
- 📧 Developer Email

---

**Letzte Aktualisierung:** 26. Januar 2026, 22:17 CET  
**Version:** 7.0.0  
**Status:** Phase 1 ✅ | Phase 2 🚧 | Phase 3 ⏳
