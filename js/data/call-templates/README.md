# 📝 CALL TEMPLATES - ANLEITUNG

## 🎯 ÜBERBLICK

Dieses Verzeichnis enthält alle Einsatz-Templates für den Dispatcher-Simulator. Jedes Template definiert einen spezifischen Einsatztyp mit allen seinen Variationen, Wahrscheinlichkeiten und dynamischen Elementen.

---

## 📁 STRUKTUR

```
call-templates/
├── _config.js              # Globale Konfiguration (Namen, Wetter, Kliniken, etc.)
├── README.md              # Diese Anleitung
├── rd/                    # Rettungsdienst-Templates
│   ├── herzinfarkt.js     # Vollständiges Beispiel mit allen Features
│   ├── schlaganfall.js
│   ├── reanimation.js
│   └── ...
├── fw/                    # Feuerwehr-Templates
│   ├── wohnungsbrand.js
│   └── ...
└── pol/                   # Polizei-Templates
    ├── einbruch.js
    └── ...
```

---

## ✨ FEATURES IM TEMPLATE-SYSTEM

### 👥 ANRUFER-SYSTEM (Features 6-8)
- **Feature 6:** Verschiedene Anrufer-Typen (Kind, Senior, Sanitäter, Betrunken, etc.)
- **Feature 7:** Anrufer-Zustand ändert sich dynamisch
- **Feature 8:** Mehrere Anrufer zum gleichen Einsatz

### 🏚️ UMGEBUNGS-FAKTOREN (Features 13-16)
- **Feature 13:** Gebäude-Herausforderungen (Aufzug, Treppen, Baustelle)
- **Feature 14:** Tiere vor Ort
- **Feature 15:** Technische Probleme (Tür verschlossen, Strom aus)
- **Feature 16:** Geografische Herausforderungen (Wald, Autobahn)

### 👪 SOZIALE DYNAMIK (Features 17-19)
- **Feature 17:** Angehörigen-Reaktionen
- **Feature 18:** Kulturelle/Religiöse Faktoren
- **Feature 19:** Soziale Notlage

### ⚠️ GEFAHREN (Features 20-23)
- **Feature 20:** Gewalt/Kriminalität
- **Feature 21:** Selbstgefährdung
- **Feature 22:** Infektionsgefahren
- **Feature 23:** Chemische Gefahren

### ⚡ DYNAMIK (Features 33-35)
- **Feature 33:** Verschlechterung während Anfahrt
- **Feature 34:** Überraschungen vor Ort
- **Feature 35:** Spontane Besserung

### 🎭 SPECIAL FEATURES (Features 28-32, 37-38)
- **Feature 28:** Parallel-Einsätze
- **Feature 29:** Fehlalarme & Bagatellen
- **Feature 30:** Großveranstaltungen
- **Feature 37:** Technik-Fehlalarme
- **Feature 38:** Stammkunden

### 🎮 GAMEPLAY FEATURES (Features 45, 52, 53)
- **Feature 45:** Einsatz-Protokoll
- **Feature 52:** Authentische Funksprüche
- **Feature 53:** Klinik-Auswahl mit Fachausrichtung

---

## 🛠️ NEUES TEMPLATE ERSTELLEN

### Schritt 1: Datei erstellen

Erstelle eine neue `.js`-Datei im passenden Verzeichnis:
- `rd/` für Rettungsdienst
- `fw/` für Feuerwehr  
- `pol/` für Polizei

Beispiel: `rd/schlaganfall.js`

### Schritt 2: Basis-Struktur kopieren

```javascript
import { GLOBAL_CONFIG } from '../_config.js';

export const DEIN_TEMPLATE = {
    
    // GRUND-INFORMATIONEN
    id: 'eindeutige_id',
    kategorie: 'rd',  // oder 'fw', 'pol'
    stichwort: 'Angezeigtes Stichwort',
    weight: 3,  // 1=selten, 3=mittel, 5=häufig
    
    // Hier die Sections hinzufügen...
};
```

### Schritt 3: Sections hinzufügen

Nutze `herzinfarkt.js` als vollständiges Beispiel! Kopiere relevante Sections:

```javascript
// ANRUFER-SYSTEM
anrufer: {
    typen: { /* siehe herzinfarkt.js */ },
    dynamik: { /* optional */ },
    mehrere_anrufer: { /* optional */ },
    beziehung: { /* anpassen */ }
},

// PATIENT
patient: {
    geschlecht: { male: 0.5, female: 0.5 },
    alter: { mean: 50, stddev: 15, min: 20, max: 90 },
    soziales_umfeld: { /* optional */ }
},

// SYMPTOME (anpassen!)
symptome: {
    hauptsymptom: {
        probability: 0.9,
        variations: ['Beschreibung 1', 'Beschreibung 2']
    },
    // weitere Symptome...
},

// MEDIZINISCH
medizinisch: {
    mehrfacherkrankungen: { /* optional */ },
    allergien: { /* optional */ },
    vorgeschichte: { /* anpassen */ }
},

// UMGEBUNG
umgebung: {
    gebäude: { /* optional */ },
    tiere: { /* optional */ },
    technik: { /* optional */ }
},

// LOCATIONS
locations: {
    wohnhaus: { probability: 0.7 },
    arbeitsplatz: { probability: 0.2 },
    // weitere...
},

// DISPOSITION
disposition: {
    base_recommendation: {
        rtw: 1,
        nef: 0,
        ktw: 0
    },
    klinik_auswahl: {
        // siehe herzinfarkt.js
    }
}
```

---

## 📊 WAHRSCHEINLICHKEITEN VERSTEHEN

### Probability-Werte (0.0 bis 1.0)

```javascript
probability: 0.01  // 1% Wahrscheinlichkeit
probability: 0.1   // 10%
probability: 0.5   // 50%
probability: 0.9   // 90%
probability: 1.0   // 100% (immer)
```

### Kombinierte Wahrscheinlichkeiten

```javascript
symptom_a: {
    probability: 0.8,  // 80% haben Symptom A
    mit_symptom_b: {
        probability: 0.5  // Von den 80% haben 50% auch Symptom B
                          // = 40% aller Fälle haben beide
    }
}
```

### Verteilungen (Distribution)

```javascript
alter: {
    distribution: 'normal',
    mean: 65,      // Durchschnittsalter
    stddev: 12,    // Standardabweichung
    min: 40,       // Minimum
    max: 90        // Maximum
}

// Beispiel Ausgaben:
// 68% der Fälle: 53-77 Jahre
// 95% der Fälle: 41-89 Jahre
```

---

## 🗣️ VARIATIONS SYSTEM

### Text-Variationen für Dynamik

```javascript
symptom: {
    variations: [
        'hat starke Schmerzen',
        'klagt über massive Schmerzen',
        'Schmerzen sind unerträglich',
        'hält sich die {location} und stöhnt'
    ]
}
```

### Platzhalter verwenden

```javascript
'{er/sie}'        // Wird ersetzt durch "er" oder "sie"
'{ihm/ihr}'       // "ihm" oder "ihr"
'{sein/ihr}'      // "sein" oder "ihre"
'{callsign}'      // RTW Rufname
'{hospital}'      // Zielklinik
'{anzahl}'        // Dynamische Zahl
```

---

## 🎯 EMPFEHLUNGEN FÜR REALISMUS

### 1. Nicht jedes Feature nutzen!

⚠️ **Wichtig:** Ein Template muss NICHT alle Features enthalten!

**Gut:**
```javascript
// Schlaganfall: Fokus auf neurologische Symptome
symptome: {
    sprachstörung: { probability: 0.8 },
    lähmung: { probability: 0.7 },
    bewusstlos: { probability: 0.3 }
}
```

**Schlecht:**
```javascript
// Zu viele Features = unübersichtlich
symptome: { /* 20 verschiedene Symptome */ }
umgebung: { /* alles mögliche */ }
gefahren: { /* alles dabei */ }
// etc...
```

### 2. Wahrscheinlichkeiten realistisch wählen

```javascript
// REALISMUS ✔️
brustschmerz: { probability: 0.95 }  // Fast immer bei Herzinfarkt
schwitzen: { probability: 0.85 }     // Sehr häufig
übelkeit: { probability: 0.4 }      // Manchmal

// UNREALISTISCH ❌
brustschmerz: { probability: 0.5 }   // Zu selten!
jedes_symptom: { probability: 1.0 }  // Zu vorhersehbar!
```

### 3. Variations für Abwechslung

Mindestens **3-5 Variationen** pro Symptom/Beschreibung:

```javascript
variations: [
    'fasst sich an die Brust',
    'hält sich die Brust',
    'greift sich ans Herz',
    'verkrampft sich und fasst sich an die Brust',
    'die Brust tut {ihm/ihr} höllisch weh'
]
```

### 4. Locations anpassen

Nicht jeder Einsatz passt überall:

```javascript
// Herzinfarkt: überall möglich
locations: {
    wohnhaus: { probability: 0.65 },
    arbeitsplatz: { probability: 0.15 },
    öffentlich: { probability: 0.1 }
}

// Arbeitsunfall: nur bestimmte Orte!
locations: {
    baustelle: { probability: 0.5 },
    fabrik: { probability: 0.3 },
    werkstatt: { probability: 0.2 }
}
```

---

## 💻 CODE-BEISPIELE

### Einfaches Template (Bagatell-Einsatz)

```javascript
export const NASENBLUTEN_TEMPLATE = {
    id: 'nasenbluten',
    kategorie: 'rd',
    stichwort: 'Nasenbluten',
    weight: 2,
    
    anrufer: {
        typen: {
            normal: { probability: 0.8 },
            kind: { probability: 0.2 }
        }
    },
    
    patient: {
        alter: { mean: 35, stddev: 20, min: 5, max: 80 }
    },
    
    symptome: {
        nasenbluten: {
            probability: 1.0,
            variations: [
                'blutet aus der Nase',
                'Nase blutet stark',
                'Nasenbluten hört nicht auf'
            ]
        }
    },
    
    disposition: {
        base_recommendation: {
            ktw: 1,  // Oft reicht KTW
            rtw: 0
        }
    },
    
    special: {
        fehlalarm: {
            übertreibung: { probability: 0.4 }  // Oft harmloser
        }
    }
};
```

### Komplexes Template (Schwerer Einsatz)

```javascript
export const POLYTRAUMA_TEMPLATE = {
    id: 'polytrauma',
    kategorie: 'rd',
    stichwort: 'Polytrauma',
    weight: 1,  // Selten!
    
    anrufer: {
        typen: {
            zeuge: { probability: 0.7 },
            sanitäter: { probability: 0.2 },
            polizei: { probability: 0.1 }
        }
    },
    
    patient: {
        alter: { mean: 35, stddev: 15, min: 16, max: 70 }
    },
    
    medizinisch: {
        mehrfacherkrankungen: {
            probability: 1.0,  // Immer mehrere Verletzungen!
            kombinationen: {
                kopf_und_thorax: { probability: 0.4 },
                extremitäten_und_wirbelsäule: { probability: 0.3 },
                innere_blutungen: { probability: 0.3 }
            }
        }
    },
    
    locations: {
        autobahn: { probability: 0.5 },
        baustelle: { probability: 0.3 },
        arbeitsplatz: { probability: 0.2 }
    },
    
    disposition: {
        base_recommendation: {
            rtw: 2,  // Zwei RTW!
            nef: 1,
            rth: 0.3  // Häufig RTH
        },
        klinik_auswahl: {
            priorität_1: {
                condition: 'trauma_center',
                hospitals: ['klinikum_ludwigsburg', 'katharinenhospital_stuttgart'],
                reason: 'Schwerstverletzte brauchen Traumazentrum'
            }
        }
    },
    
    nachforderungen: {
        feuerwehr: {
            probability: 0.8,  // Fast immer für Rettung
            reasons: { befreiung: 0.9 }
        },
        polizei: {
            probability: 0.9,  // Fast immer
            reasons: { verkehrsunfall: 1.0 }
        },
        rth: {
            probability: 0.4,
            reason: 'Schnelltransport nötig'
        }
    }
};
```

---

## ✅ CHECKLISTE NEUES TEMPLATE

Bevor du ein Template als fertig markierst:

- [ ] **ID eindeutig** (nicht doppelt vergeben)
- [ ] **Kategorie korrekt** (rd/fw/pol)
- [ ] **Weight realistisch** (1-5)
- [ ] **Mindestens 3 Symptom-Variationen**
- [ ] **Wahrscheinlichkeiten ergeben Sinn** (addieren zu ~1.0 in Gruppen)
- [ ] **Locations passen zum Einsatz**
- [ ] **Disposition empfohlen** (welche Fahrzeuge?)
- [ ] **Klinik-Auswahl** für RD-Einsätze
- [ ] **Code getestet** (JavaScript-Syntax korrekt)
- [ ] **Export am Ende** (`module.exports`)

---

## 📚 WEITERE RESSOURCEN

### Dateien zum Studieren

1. **`_config.js`** - Globale Systeme verstehen
2. **`rd/herzinfarkt.js`** - Vollständiges Beispiel mit ALLEN Features
3. Weitere Templates in `rd/`, `fw/`, `pol/` als Inspiration

### Wichtige Konzepte

- **Wahrscheinlichkeits-Ketten:** Parent probability × Child probability = Finale Wahrscheinlichkeit
- **Mutual Exclusive:** Wenn Optionen sich ausschließen, müssen probabilities zusammen = 1.0 sein
- **Optional Features:** Nicht verwendete Features einfach weglassen (nicht auf 0 setzen)

### Testen

Templates werden vom Simulator automatisch geladen. Teste durch:
1. Simulator starten
2. Dein Template auswählen/triggern
3. Verschiedene Durchläufe machen (Variationen testen)
4. Wahrscheinlichkeiten beobachten

---

## ❓ HÄUFIGE FEHLER

### 1. Wahrscheinlichkeiten > 1.0

❌ **Falsch:**
```javascript
symptom_a: { probability: 1.2 }  // FEHLER!
```

✅ **Richtig:**
```javascript
symptom_a: { probability: 0.9 }  // Max 1.0
```

### 2. Probabilities addieren nicht zu 1.0

❌ **Falsch:**
```javascript
anrufer_typ: {
    normal: { probability: 0.5 },
    kind: { probability: 0.5 },
    senior: { probability: 0.5 }  // = 1.5 zusammen!
}
```

✅ **Richtig:**
```javascript
anrufer_typ: {
    normal: { probability: 0.5 },
    kind: { probability: 0.25 },
    senior: { probability: 0.25 }  // = 1.0 zusammen
}
```

### 3. Zu viele Features auf einmal

❌ **Falsch:** Alles aus `herzinfarkt.js` kopieren ohne Anpassung

✅ **Richtig:** Nur relevante Features für deinen Einsatz nutzen

### 4. Keine Variationen

❌ **Falsch:**
```javascript
variations: ['Patient hat Schmerzen']  // Langweilig!
```

✅ **Richtig:**
```javascript
variations: [
    'hat starke Schmerzen',
    'klagt über Schmerzen',
    'Schmerzen sind kaum auszuhalten',
    'stöhnt vor Schmerzen',
    'die Schmerzen sind unerträglich'
]
```

---

## 🚀 LOS GEHT'S!

1. Öffne `rd/herzinfarkt.js` als Referenz
2. Erstelle deine neue Template-Datei
3. Kopiere relevante Sections
4. Passe an deinen Einsatztyp an
5. Teste im Simulator
6. Verfeinere basierend auf Feedback

**Viel Erfolg beim Erstellen deines Templates!** 🚑🚒🚓

---

*Letzte Aktualisierung: Januar 2026*
*Version: 1.0 (Initial mit allen 36+ Features)*
