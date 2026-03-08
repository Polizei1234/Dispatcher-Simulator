# 🎯 Incident System Redesign - Planungsdokument

> **Strukturierte Planung für die Migration vom Template-System zum AI-Hybrid-System**

**Status:** 🟡 Planungsphase  
**Erstellt:** 08.03.2026  
**Priorität:** ⭐⭐⭐⭐⭐ KRITISCH

---

## 📋 Inhaltsverzeichnis

1. [Problem-Analyse](#problem-analyse)
2. [Ziel-Definition](#ziel-definition)
3. [Architektur-Überblick](#architektur-überblick)
4. [Migrations-Optionen](#migrations-optionen)
5. [Empfohlener Ansatz](#empfohlener-ansatz)
6. [Implementierungs-Phasen](#implementierungs-phasen)
7. [Risiko-Analyse](#risiko-analyse)
8. [Entscheidungs-Matrix](#entscheidungs-matrix)

---

## 🔴 Problem-Analyse

### Aktueller Zustand

**Template-Verzeichnis:** `js/data/call-templates/rd/`

```
65 Template-Dateien
├─ herzinfarkt.js (28 KB)
├─ polytrauma.js (48 KB)
├─ verkehrsunfall.js (53 KB)
├─ sturz.js (50 KB)
├─ reanimation.js (30 KB)
├─ ... (60 weitere)
└─ GESAMT: ~1.3 MB
```

### Konkrete Probleme

#### 1. Ressourcen-Verschwendung
```javascript
// Jedes Template enthält riesige Conversation-Trees:
const template = {
  variants: [
    {
      callerDialogue: [
        { speaker: "Anrufer", text: "Hallo, mein Vater hat Brustschmerzen..." },
        { speaker: "Disponent", options: [...20 Möglichkeiten] },
        // ... 50+ weitere Dialog-Schritte
      ],
      symptoms: [...],
      escalationPaths: [...]
    },
    // ... 10+ weitere Varianten PRO Einsatztyp
  ]
};

// Problem: Alle werden geladen, aber nur 1 Variante wird genutzt
// 1.3 MB laden, nur ~20 KB verwenden = 98.5% Waste!
```

#### 2. Duplikate & Inkonsistenzen
```bash
angina-pectoris.js      # 4.7 KB
angina_pectoris.js      # 9.8 KB  <- DUPLIKAT!
hypoglykaemie.js        # 6.2 KB
hypoglykämie.js        # 43 KB   <- DUPLIKAT!
```

#### 3. Wartungs-Albtraum
- Änderung an Dialog-Logik? → 65 Dateien anpassen
- Neuer Einsatztyp? → Neue 30 KB Datei erstellen
- Fehler finden? → Durch 1.3 MB Code suchen

#### 4. Performance-Impact
```javascript
// Initial Load
Parsing 65 JS-Dateien: ~800ms
Memory Footprint: ~150 MB
Cache-Miss Rate: Hoch (Templates ändern sich oft)
```

#### 5. Fehlende Flexibilität
- Templates sind statisch → Immer gleiche Dialoge
- Keine Kontext-Awareness (Wetter, Tageszeit, etc.)
- Keine Lernfähigkeit

---

## 🎯 Ziel-Definition

### Haupt-Ziele

1. **Ressourcen-Reduktion**: Von 1.3 MB auf < 100 KB
2. **Dynamik**: Jeder Einsatz einzigartig
3. **Wartbarkeit**: Zentrale Konfiguration statt 65 Dateien
4. **Performance**: Schnellerer Load, weniger Memory
5. **Realismus**: Kontextabhängige Einsätze

### Erfolgs-Kriterien

| Metrik | Vorher | Ziel | Kritisch |
|--------|---------|------|----------|
| Template Size | 1.3 MB | < 100 KB | < 200 KB |
| Load Time | 800ms | < 200ms | < 400ms |
| Memory | 150 MB | < 80 MB | < 120 MB |
| Variationen | Fest (10-20) | Unbegrenzt | > 100 |
| Wartungsaufwand | Hoch | Minimal | Mittel |
| Realismus | Mittel | Hoch | Mittel |

### Non-Goals

❌ Bestehende Templates komplett löschen (ohne Fallback)  
❌ 100% AI-generiert (zu riskant)  
❌ Sofortige Migration (zu großer Umbau)  
❌ Backend-Requirement (muss client-side funktionieren)  

---

## 🏛️ Architektur-Überblick

### Neue 3-Schicht-Architektur

```
┌───────────────────────────────────┐
│  LAYER 1: Incident Schemas      │
│  (Minimale Basis-Definitionen)  │
│  Size: ~50 KB                   │
└────────────────┬──────────────────┘
                 │
┌────────────────┴──────────────────┐
│  LAYER 2: AI Generator          │
│  (Groq API + Context)           │
│  Size: ~30 KB Logic             │
└────────────────┬──────────────────┘
                 │
┌────────────────┴──────────────────┐
│  LAYER 3: Fallback Templates   │
│  (10 kritische Templates)       │
│  Size: ~200 KB                  │
└───────────────────────────────────┘

GESAMT: ~280 KB (vs. 1.3 MB = -78%)
```

### Layer 1: Incident Schemas

**Konzept:** Minimale Daten-Definition pro Einsatztyp

```javascript
// js/data/incident-schemas-v2.js
export const incidentSchemas = {
  'herzinfarkt': {
    // Basis-Info
    id: 'herzinfarkt',
    category: 'kardiovaskulär',
    priority: 'CRITICAL',
    
    // Fahrzeug-Anforderungen
    requiredVehicles: {
      mandatory: ['NEF', 'RTW'],
      optional: ['RTW2'],
      escalation: ['ITW'] // Bei Komplikationen
    },
    
    // Zeit-Parameter
    timing: {
      treatmentDuration: [15, 25], // Min/Max Minuten
      transportRequired: true,
      criticalTime: 8 // Golden Hour
    },
    
    // Symptom-Basis
    symptoms: {
      primary: ['brustschmerzen', 'atemnot', 'schwitzen'],
      secondary: ['uebelkeit', 'angst', 'schwaeche'],
      critical: ['bewusstlosigkeit', 'kreislaufstillstand']
    },
    
    // Keywords für Auto-Erkennung
    keywords: [
      'herz', 'brustschmerzen', 'engegefühl', 'herzinfarkt',
      'myokardinfarkt', 'angina', 'thoraxschmerz'
    ],
    
    // Kontext-Modifikatoren
    modifiers: {
      ageRisk: [50, 90], // Hohes Risiko in diesem Altersbereich
      timeOfDay: {
        morning: 1.3,   // 30% häufiger morgens
        evening: 1.0
      },
      weather: {
        cold: 1.2,      // 20% häufiger bei Kälte
        heat: 1.1
      }
    },
    
    // AI-Prompt Template
    aiPrompt: {
      base: "Generiere realistische Details für einen Herzinfarkt-Einsatz.",
      include: [
        "Alter und Geschlecht des Patienten",
        "Genaue Symptombeschreibung",
        "Vorerkrankungen",
        "Aktueller Zustand",
        "Umgebungssituation"
      ],
      style: "professionell, realistisch, medizinisch korrekt"
    }
  },
  
  'sturz': {
    id: 'sturz',
    category: 'trauma',
    priority: 'MEDIUM',
    
    requiredVehicles: {
      mandatory: ['RTW'],
      optional: [],
      escalation: ['NEF'] // Bei schweren Verletzungen
    },
    
    timing: {
      treatmentDuration: [10, 20],
      transportRequired: true,
      criticalTime: null
    },
    
    symptoms: {
      primary: ['schmerzen', 'bewegungseinschränkung'],
      secondary: ['schwellung', 'prellung', 'hämatom'],
      critical: ['bewusstlosigkeit', 'starke_blutung', 'schock']
    },
    
    keywords: [
      'sturz', 'gefallen', 'hingefallen', 'gestürzt',
      'treppe', 'ausgerutscht'
    ],
    
    modifiers: {
      ageRisk: [70, 100],
      timeOfDay: {
        night: 1.4 // Nachts häufiger (schlechte Sicht)
      },
      weather: {
        ice: 2.0,   // Doppelt so häufig bei Glatteis
        snow: 1.5,
        rain: 1.3
      },
      location: {
        'altenheim': 2.5,  // Sehr häufig in Altenheimen
        'treppe': 1.8
      }
    },
    
    aiPrompt: {
      base: "Generiere realistische Details für einen Sturz-Einsatz.",
      include: [
        "Sturzhöhe und -hergang",
        "Verletzungsmuster",
        "Patient kann sich bewegen?",
        "Bewusstseinslage",
        "Umgebungsgefahren"
      ],
      style: "detailliert, situationsbezogen"
    }
  },
  
  // ... 15-20 weitere Schemas (~2-3 KB pro Schema)
};

// Gesamt: ~50 KB statt 1.3 MB
```

### Layer 2: AI Generator

**Konzept:** Dynamische Einsatz-Generierung mit Kontext

```javascript
// js/systems/incident-generator-v2.js
import { incidentSchemas } from '../data/incident-schemas-v2.js';
import groqLimiter from '../utils/api-rate-limiter.js';
import gameState from '../core/state-manager.js';

class IncidentGeneratorV2 {
  constructor() {
    this.cache = new Map();
    this.cacheSize = 20; // Halte 20 generierte Einsätze im Cache
  }

  async generateIncident(type = null) {
    // 1. Wähle Einsatztyp
    const incidentType = type || this.selectWeightedType();
    const schema = incidentSchemas[incidentType];
    
    if (!schema) {
      console.error(`Unknown incident type: ${incidentType}`);
      return this.getFallbackIncident(incidentType);
    }
    
    // 2. Sammle Kontext
    const context = this.gatherContext(schema);
    
    // 3. Versuche AI-Generierung
    try {
      const aiIncident = await this.generateWithAI(schema, context);
      return this.enhanceIncident(aiIncident, schema, context);
    } catch (error) {
      console.warn('AI generation failed, using fallback:', error);
      return this.getFallbackIncident(incidentType);
    }
  }

  selectWeightedType() {
    const context = this.gatherGlobalContext();
    const weights = {};
    
    // Berechne Gewichtungen basierend auf Kontext
    Object.keys(incidentSchemas).forEach(type => {
      const schema = incidentSchemas[type];
      let weight = 1.0;
      
      // Zeit-Modifikatoren
      const hour = context.time.getHours();
      if (hour >= 6 && hour < 12 && schema.modifiers.timeOfDay?.morning) {
        weight *= schema.modifiers.timeOfDay.morning;
      }
      
      // Wetter-Modifikatoren
      const weather = context.weather.condition;
      if (schema.modifiers.weather?.[weather]) {
        weight *= schema.modifiers.weather[weather];
      }
      
      weights[type] = weight;
    });
    
    // Weighted Random Selection
    return this.weightedRandom(weights);
  }

  gatherContext(schema) {
    const state = gameState.getState('');
    
    return {
      // Spiel-Kontext
      gameTime: state.gameTime.current,
      weather: state.weather,
      
      // Verfügbare Ressourcen
      availableVehicles: this.getAvailableVehicles(),
      
      // Statistiken (für Varianz)
      recentIncidents: this.getRecentIncidentTypes(),
      
      // Geografischer Kontext
      hotspots: this.getIncidentHotspots(),
      
      // Schema-spezifisch
      schema: schema
    };
  }

  async generateWithAI(schema, context) {
    // Baue intelligenten Prompt
    const prompt = this.buildPrompt(schema, context);
    
    // Check Cache
    const cacheKey = this.getCacheKey(schema.id, context);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    // API Call (mit Rate Limiting)
    const response = await groqLimiter.request('/api/groq', {
      model: 'llama-3.3-70b-versatile',
      prompt: prompt,
      temperature: 0.8, // Höhere Varianz für Diversität
      max_tokens: 500
    });
    
    const incident = this.parseAIResponse(response, schema);
    
    // Cache speichern
    this.cache.set(cacheKey, incident);
    if (this.cache.size > this.cacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    return incident;
  }

  buildPrompt(schema, context) {
    return `
${schema.aiPrompt.base}

KONTEXT:
- Einsatztyp: ${schema.id}
- Uhrzeit: ${context.gameTime.toLocaleTimeString('de-DE')}
- Wetter: ${context.weather.condition}, ${context.weather.temperature}°C
- Ort: Waiblingen, ${this.selectLocation(schema, context)}

ERWARTETE DETAILS:
${schema.aiPrompt.include.map(i => `- ${i}`).join('\n')}

STIL: ${schema.aiPrompt.style}

GENERIERE (als JSON):
{
  "caller": {
    "name": "[Anrufername]",
    "relation": "[Beziehung zum Patienten]",
    "emotionalState": "[ruhig/aufgeregt/panisch]"
  },
  "patient": {
    "age": [Alter],
    "gender": "[m/w/d]",
    "consciousness": "[bei Bewusstsein/benommen/bewusstlos]",
    "symptoms": ["Symptom1", "Symptom2", ...]
  },
  "situation": {
    "description": "[Kurze Situationsbeschreibung]",
    "location": "[Genauer Ort]",
    "hazards": ["Gefahr1", ...] oder [],
    "witnesses": [Anzahl]
  },
  "initialDialogue": "[Erster Satz des Anrufers]"
}
    `.trim();
  }

  enhanceIncident(aiData, schema, context) {
    return {
      id: this.generateIncidentId(),
      type: schema.id,
      category: schema.category,
      priority: this.calculatePriority(schema, aiData),
      
      // AI-generierte Daten
      caller: aiData.caller,
      patient: aiData.patient,
      situation: aiData.situation,
      dialogue: aiData.initialDialogue,
      
      // Schema-basierte Daten
      requiredVehicles: schema.requiredVehicles,
      timing: schema.timing,
      
      // Kontext-Daten
      timestamp: context.gameTime,
      weather: context.weather,
      location: this.generateLocation(schema, context),
      
      // Status
      status: 'pending',
      assignedVehicles: [],
      createdAt: Date.now()
    };
  }

  getFallbackIncident(type) {
    // LAYER 3: Lade kritisches Fallback-Template
    return import(`./fallback-templates/${type}.js`)
      .then(module => module.default)
      .catch(() => this.getGenericFallback(type));
  }

  // ... Helper-Methoden
}

export default new IncidentGeneratorV2();
```

### Layer 3: Fallback Templates

**Konzept:** Nur 10 kritische Templates als Backup

```javascript
// js/data/fallback-templates/herzinfarkt.js
export default {
  variants: [
    // Nur 2-3 Varianten statt 10+
    {
      caller: { name: "Hans Müller", relation: "Patient", emotionalState: "besorgt" },
      patient: {
        age: 62,
        gender: "m",
        consciousness: "bei Bewusstsein",
        symptoms: ["brustschmerzen", "atemnot", "schwitzen"]
      },
      situation: {
        description: "Patient klagt über starke Brustschmerzen seit 20 Minuten",
        location: "Wohnung, 3. OG",
        hazards: [],
        witnesses: 1
      },
      dialogue: "Hallo, ich habe seit 20 Minuten starke Schmerzen in der Brust. Ich weiß nicht, was los ist."
    }
    // Weitere 1-2 Varianten
  ]
};

// Nur ~10 KB pro Template
// 10 Templates = 100 KB
```

---

## 🔀 Migrations-Optionen

### Option A: Radikaler Schnitt ⚠️

**Vorgehen:**
1. Alle 65 Templates löschen
2. Nur Schemas behalten
3. 100% AI-generiert

**Vorteile:**
- ✅ Maximale Ressourcen-Ersparnis (95%)
- ✅ Einfachste Architektur
- ✅ Höchste Flexibilität

**Nachteile:**
- ❌ **SEHR RISKANT**: Kein Fallback bei API-Ausfall
- ❌ Abhängig von externer API
- ❌ Schwer rückgängig zu machen

**Bewertung:** 🔴 **NICHT EMPFOHLEN**

---

### Option B: Hybrid-Ansatz ✅

**Vorgehen:**
1. 20 Schemas definieren
2. AI als primäre Quelle
3. 10 kritische Fallback-Templates
4. Alte Templates archivieren (nicht löschen)

**Vorteile:**
- ✅ **Sicher**: Fallback bei Problemen
- ✅ 80% Ressourcen-Ersparnis
- ✅ Hohe Flexibilität durch AI
- ✅ Schrittweise Migration möglich

**Nachteile:**
- 🟡 Komplexere Architektur
- 🟡 Fallback-Templates müssen gepflegt werden

**Bewertung:** 🟢 **EMPFOHLEN**

---

### Option C: Graduell 🔵

**Vorgehen:**
1. Parallel-System aufbauen
2. Templates bleiben aktiv
3. Langsam Templates durch Schemas ersetzen
4. Feature-Flag zum Umschalten

**Vorteile:**
- ✅ **Sehr sicher**: Jederzeit zurück schaltbar
- ✅ Kein Risiko
- ✅ Zeit für Tests

**Nachteile:**
- ❌ Langsam (mehrere Wochen)
- ❌ Doppelter Wartungsaufwand während Migration
- ❌ Nur 50% Ressourcen-Ersparnis initial

**Bewertung:** 🟡 **Für große Teams / Production**

---

## ✅ Empfohlener Ansatz: Option B (Hybrid)

### Begründung

1. **Sicherheit**: Fallbacks verhindern kompletten Ausfall
2. **Effizienz**: 80% Ersparnis ist ausreichend gut
3. **Flexibilität**: Best of Both Worlds
4. **Umsetzbar**: In 2-3 Wochen fertig

### Architektur-Entscheidungen

```javascript
// Entscheidungslogik
function getIncident(type) {
  // 1. Versuche AI (80% der Fälle)
  if (Math.random() < 0.8 && groqAvailable()) {
    return generateWithAI(type);
  }
  
  // 2. Fallback zu Template (20% + bei Fehler)
  return getFallbackTemplate(type);
}
```

### Welche Templates behalten?

**Kritische Top 10:**
1. ❤️ Herzinfarkt (häufig + kritisch)
2. 🧠 Reanimation (häufig + kritisch)
3. 🚑 Verkehrsunfall (sehr häufig)
4. 🤕 Schlaganfall (häufig + kritisch)
5. 🤢 Sturz (sehr häufig)
6. 🤧 Atemnot (häufig)
7. 🩸 Hypoglykämie (häufig)
8. 😵 Bewusstlosigkeit (häufig)
9. 🤕 Krampfanfall (häufig)
10. 👶 Geburt (selten aber komplex)

**Gesamt:** ~150-200 KB (vs. 1.3 MB vorher)

---

## 🛠️ Implementierungs-Phasen

### Phase 1: Vorbereitung (3 Tage)

**Tag 1: Analyse & Backup**
```bash
# Backup erstellen
git checkout -b feature/incident-system-v2
git tag backup-before-incident-migration

# Template-Analyse
node scripts/analyze-templates.js
# Output: Usage stats, Duplikate, Größen
```

**Tag 2: Schema-Extraktion**
```bash
# Script um Schemas aus Templates zu extrahieren
node scripts/extract-schemas.js
# Erstellt: js/data/incident-schemas-v2.js
```

**Tag 3: Top-10-Templates aufräumen**
```bash
# Duplikate entfernen
rm js/data/call-templates/rd/angina_pectoris.js
rm js/data/call-templates/rd/hypoglykämie.js

# Top 10 nach fallback-templates/ verschieben
mkdir -p js/data/fallback-templates
mv js/data/call-templates/rd/herzinfarkt.js js/data/fallback-templates/
# ... weitere 9
```

### Phase 2: Kern-Implementation (5 Tage)

**Tag 4-5: Schema System**
```javascript
// js/data/incident-schemas-v2.js erstellen
// 20 Schemas definieren
// Tests schreiben
```

**Tag 6-7: AI Generator V2**
```javascript
// js/systems/incident-generator-v2.js
// Mit Fallback-Logik
// Integration mit Rate-Limiter
```

**Tag 8: Fallback System**
```javascript
// js/systems/incident-fallback.js
// Template-Loader mit Lazy Loading
```

### Phase 3: Integration (4 Tage)

**Tag 9-10: Umstellung**
```javascript
// In game.js:
import IncidentGeneratorV2 from './systems/incident-generator-v2.js';

// Feature-Flag
const USE_V2_GENERATOR = true;

function generateIncident() {
  if (USE_V2_GENERATOR) {
    return IncidentGeneratorV2.generateIncident();
  } else {
    return oldGenerator.generate(); // Fallback
  }
}
```

**Tag 11: Testing**
- 50 Einsätze generieren und prüfen
- Performance-Tests
- Fallback-Tests (API offline simulieren)

**Tag 12: Cleanup**
```bash
# Alte Templates archivieren
mkdir -p archive/old-templates
mv js/data/call-templates/rd/* archive/old-templates/

# Dokumentation aktualisieren
```

### Phase 4: Rollout (2 Tage)

**Tag 13: Staging**
- Deploy auf Test-Branch
- Community-Testing
- Feedback sammeln

**Tag 14: Production**
```bash
git merge feature/incident-system-v2
git push origin main
git tag v2.1.0-new-incident-system
```

**GESAMT: 14 Tage (2 Wochen)**

---

## ⚠️ Risiko-Analyse

### Hohe Risiken

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| API-Ausfall während Spiel | Mittel | Hoch | Fallback-Templates + Cache |
| AI generiert unsinnige Daten | Niedrig | Mittel | Validierung + Schema-Checks |
| Performance schlechter als erwartet | Niedrig | Mittel | Performance-Tests vorher |
| Templates werden noch gebraucht | Niedrig | Niedrig | Archivieren statt löschen |

### Mittelhohe Risiken

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| User mögen AI-Einsätze nicht | Niedrig | Mittel | A/B-Testing, Feedback-Loop |
| Migration dauert länger | Mittel | Niedrig | Zeitpuffer einplanen |
| Bugs in neuer Logik | Mittel | Mittel | Umfangreiche Tests |

### Rollback-Plan

```javascript
// Sofortiger Rollback durch Feature-Flag
const USE_V2_GENERATOR = false; // Zurück zu alt

// Oder via Settings
if (gameState.getState('settings.useNewIncidentSystem') === false) {
  return oldGenerator.generate();
}
```

---

## 📋 Entscheidungs-Matrix

### Was muss entschieden werden?

#### 1. Migrations-Option
- [ ] Option A: Radikaler Schnitt (❌ nicht empfohlen)
- [x] **Option B: Hybrid-Ansatz (✅ empfohlen)**
- [ ] Option C: Graduell (für später)

#### 2. Welche Templates behalten?
- [x] **Top 10 kritische** (✅ empfohlen)
- [ ] Top 20 (zu viel)
- [ ] Top 5 (zu riskant)

#### 3. AI-Anteil
- [ ] 100% AI (zu riskant)
- [x] **80% AI, 20% Fallback** (✅ empfohlen)
- [ ] 50/50 (zu konservativ)

#### 4. Cache-Strategie
- [x] **20 Incidents cachen** (✅ empfohlen)
- [ ] 50 Incidents (zu viel Memory)
- [ ] Kein Cache (zu viele API-Calls)

#### 5. Zeitplan
- [ ] 1 Woche (zu schnell)
- [x] **2 Wochen** (✅ empfohlen)
- [ ] 4 Wochen (zu langsam)

---

## ✅ Nächste Schritte

### Vor Beginn klären:

1. ❓ **Sind wir uns über Option B (Hybrid) einig?**
2. ❓ **Sind die Top-10 Templates die richtigen?**
3. ❓ **Ist 2 Wochen Zeitplan realistisch?**
4. ❓ **Wer testet das System?**
5. ❓ **Feature-Flag oder direkter Switch?**

### Nach Bestätigung:

```bash
# 1. Branch erstellen
git checkout -b feature/incident-system-v2

# 2. Backup Tag setzen
git tag backup-before-incident-migration

# 3. Phase 1 starten
# ... siehe Implementierungs-Phasen oben
```

---

## 📝 Offene Fragen

- [ ] Sollen alte Templates gelöscht oder archiviert werden?
- [ ] Brauchen wir A/B-Testing (alte vs. neue Einsätze parallel)?
- [ ] Soll es eine UI-Option geben "Klassische Templates verwenden"?
- [ ] Wie kommunizieren wir die Änderung an User?
- [ ] Brauchen wir eine Migrations-Anleitung für Mods?

---

**Status:** 🟡 **Wartet auf Entscheidung**  
**Nächster Schritt:** Klärung der Entscheidungs-Matrix  
**Erstellt:** 08.03.2026  
**Letzte Aktualisierung:** 08.03.2026