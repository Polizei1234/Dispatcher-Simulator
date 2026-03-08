# 🤖 AI-basiertes Incident-System - Master-Plan

> **Komplette Neugestaltung der Einsatzgenerierung mit intelligenter KI-Integration**

**Status:** 📋 Planung abgeschlossen - Bereit zur Umsetzung  
**Erstellt:** 08.03.2026  
**Priorität:** ⭐⭐⭐⭐⭐ KRITISCH

---

## 🎯 Vision & Ziele

### Das Problem

**Aktueller Zustand:**
- 📦 1.3 MB statische Templates (65+ Dateien)
- 🔁 Repetitive, vorhersehbare Einsätze
- 🛠️ Wartungs-Albtraum bei 80+ RD-Einsätzen
- ❌ Keine echte Varianz in Dialogen/Szenarien
- 📝 Tausende Zeilen manuell geschriebene Templates

### Die Vision

**Ziel:**
> Jeder Einsatz ist einzigartig. Die KI generiert komplett dynamisch:
> - Anrufer-Persönlichkeiten und Dialoge
> - Patienten-Details und Symptome
> - Intelligente Fahrzeug-Anforderungen
> - Realistische Funksprüche
> - Unvorhersehbare Komplikationen
> - Umgebungsfaktoren

**Kern-Anforderungen:**
1. ✅ **Unendliche Varianz** - Kein Einsatz gleicht dem anderen
2. ✅ **Intelligente Disposition** - KI entscheidet Fahrzeug-Bedarf dynamisch
3. ✅ **Realismus** - Medizinisch und BOS-korrekt
4. ✅ **Performance** - Schnelle Generierung (< 2s)
5. ✅ **Wartbar** - Keine tausende Zeilen Templates
6. ✅ **Offline-fähig** - Funktioniert ohne Cloud
7. ✅ **Skalierbar** - 80+ Einsatztypen einfach verwalten

---

## 🏗️ System-Architektur

### Drei-Schicht-Hybrid-System

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: Basis-Definitionen (~5 KB)                   │
│  ─────────────────────────────────────────              │
│  - 80 Einsatztypen (IDs, Kategorien, Keywords)         │
│  - Fahrzeugpool-Definitionen                            │
│  - BOS-Funkspruch-Regeln                                │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────┐
│  LAYER 2: KI-Generierung (Hybrid)                      │
│  ─────────────────────────────────                      │
│                                                          │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │ PRIMÄR:          │      │ FALLBACK:        │        │
│  │ Ollama (lokal)   │ ───> │ Gemini 2.0 Flash │        │
│  │                  │      │ (Cloud)          │        │
│  │ • Kostenlos      │      │ • 1500 req/Tag   │        │
│  │ • Offline        │      │ • Gute Qualität  │        │
│  │ • 0.3-1s Latenz  │      │ • 1-2s Latenz    │        │
│  │ • Unbegrenzt     │      │ • Backup         │        │
│  └──────────────────┘      └──────────────────┘        │
│                                                          │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────┐
│  LAYER 3: Validierung & Integration                     │
│  ─────────────────────────────────────                  │
│  - Plausibilitäts-Checks                                │
│  - Fahrzeugpool-Abgleich                                │
│  - BOS-Funkspruch-Formatierung                          │
│  - Notfall-Fallback (Simple Templates)                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🤖 KI-Auswahl & Begründung

### Primäres System: Ollama (Lokal)

**Technologie:** Ollama mit Llama 3.2 (1B/3B Modell)

**Warum Ollama?**
- ✅ **Kostenlos & Unbegrenzt**: Keine API-Kosten, keine Rate-Limits
- ✅ **Offline-fähig**: Funktioniert komplett ohne Internet
- ✅ **Schnell**: 0.3-1s Latenz (schneller als Cloud-APIs)
- ✅ **Privat**: Alle Daten bleiben auf User-PC
- ✅ **Konsistent**: Gleiches Modell = reproduzierbare Qualität
- ✅ **Web-kompatibel**: Web-App ruft localhost:11434 auf

**Hardware-Anforderungen:**
- 4-8 GB RAM
- ~2-4 GB Speicher für Modell (einmalig)
- Moderner CPU (i5/Ryzen 5 oder besser)

**Installation für User:**
1. Ollama herunterladen (https://ollama.ai)
2. Modell installieren: `ollama pull llama3.2:3b`
3. Fertig! Läuft automatisch im Hintergrund

---

### Fallback-System: Google Gemini 2.0 Flash

**Warum Gemini (NICHT Groq)?**

| Kriterium | Groq | Gemini 2.0 Flash | Entscheidung |
|-----------|------|------------------|---------------|
| **Latenz** | 0.76s | 1-2s | ⚖️ Ähnlich |
| **Kostenlos-Tier** | Begrenzt | 1500 req/Tag | ✅ Gemini |
| **Content-Qualität** | Mittelmäßig | Hoch für Narrative | ✅ Gemini |
| **Rate-Limits** | Streng | Großzügig | ✅ Gemini |
| **Dialog-Generation** | Schwächer | Stärker | ✅ Gemini |
| **Multimodal** | Nein | Ja (Audio/Bild) | ✅ Gemini |
| **Ökosystem** | Klein | Google-Infrastruktur | ✅ Gemini |

**Quellen:** [web:22][web:26][web:28][web:32]

**Gemini Free-Tier:**
- 1500 Requests pro Tag pro User
- 32K Context-Fenster
- Multimodal-fähig (zukünftige Features)
- Keine Kreditkarte nötig

---

### Warum NICHT Template-basiert?

**Problem bei 80+ Einsatztypen:**
```
80 Einsatztypen × 10 Varianten × 20 KB = 16 MB statischer Code
+ Unzählige Dialog-Bäume
+ Wartungs-Albtraum
+ Keine echte Varianz
```

**Mit KI:**
```
80 Einsatztypen × 1 Zeile Definition = 5 KB
KI generiert unendliche Variationen dynamisch
```

---

## 🎮 Was die KI generiert

### Komplettes Szenario pro Einsatz

#### 1. Einsatz-Basis
- **Einsatztyp** (aus 80 Typen)
- **Anzahl Patienten** (1-12+)
- **Schweregrade** pro Patient
- **Zeitpunkt** (Tageszeit-abhängig)
- **Wetter-Einfluss**

#### 2. Patienten-Details
- **Demografie**: Alter, Geschlecht, Name
- **Symptome**: Detailliert und realistisch
- **Bewusstseinslage**: GCS-Score
- **Vitalwerte**: RR, HF, SpO2, Temp
- **Vorerkrankungen**: Relevant für Behandlung
- **Medikation**: Aktuell eingenommen

#### 3. Anrufer-Persönlichkeit
- **Typ**: Augenzeuge, Angehöriger, Patient selbst
- **Emotionaler Zustand**: Panisch, besorgt, ruhig, verwirrt
- **Kommunikationsstil**: Klar, chaotisch, viele Details
- **Beziehung zum Patient**: Ehepartner, Kind, Fremd

#### 4. Telefon-Dialog (komplett einzigartig!)
- **Eröffnung**: Erster Satz des Anrufers
- **Symptombeschreibung**: In eigenen Worten
- **Antworten auf Fragen**: Kontextabhängig
- **Emotionale Entwicklung**: Beruhigung oder Eskalation
- **Unerwartete Infos**: Plötzliche Details

#### 5. Intelligente Fahrzeug-Disposition

**KI entscheidet dynamisch:**

**Beispiel 1 - Einzelner Herzinfarkt:**
```
1 Patient, kritisch instabil
→ KI fordert: NEF + RTW
```

**Beispiel 2 - Verkehrsunfall:**
```
3 Patienten (1 schwer, 2 leicht)
→ KI fordert: 1 NEF + 2 RTW + Feuerwehr (Rettung)
→ Nach 5 Min: Patient 3 verschlechtert sich
→ KI fordert nach: RTH (schnellster Transport)
```

**Beispiel 3 - MANV:**
```
12 Verletzte nach Busunfall
→ KI fordert: MANV-Alarm, 5 RTW, 2 NEF, LNA, OrgL
→ Nach Sichtung: Nur 4 tatsächlich verletzt
→ KI bestellt ab: 3 RTW, 1 NEF
```

#### 6. Umgebungsfaktoren
- **Location**: Wohnung, Straße, Arbeitsplatz, etc.
- **Zugang**: Stockwerk, Aufzug defekt, enge Treppe
- **Gefahren**: Hund, Gasgeruch, aggressive Angehörige
- **Besonderheiten**: Sprachbarriere, verwahrloste Wohnung

#### 7. Dynamische Komplikationen

**Während des Einsatzes:**
- Zustandsverschlechterung
- Weitere Patienten tauchen auf
- Technische Probleme (Tür verschlossen)
- Soziale Konflikte (aggressive Familie)
- Überraschungen (anderes Schadensbild)

#### 8. Realistische Funksprüche

**BOS-konform und kontextabhängig:**
- Statusmeldungen (1-8)
- Lagemeldungen
- Nachforderungen
- Klinik-Anmeldung
- Einsatzende

**Beispiel-Funkspruch (KI-generiert):**
```
"Florian Waiblingen 46/83-1 an Leitstelle, wir sind am 
Einsatzort, Status 3. Lage: Männlicher Patient, 68 Jahre, 
vermutlich Myokardinfarkt, instabil. Beginnen mit der 
Versorgung, fordern NEF nach. Kommen."
```

---

## 🔄 Workflow: Von User-Klick zu Einsatz

### 1. User startet neuen Einsatz
```
User klickt "Neuer Einsatz" → System wählt Einsatztyp
(zufällig gewichtet nach Tageszeit, Wetter, Statistik)
```

### 2. System prüft KI-Verfügbarkeit
```
┌─ Ollama läuft lokal?
│  ├─ JA → Nutze Ollama (bevorzugt)
│  └─ NEIN → Prüfe Internet
│      ├─ Online → Nutze Gemini
│      └─ Offline → Fallback Template
```

### 3. KI-Prompt wird erstellt
```
System erstellt intelligenten Prompt:
- Einsatztyp: "Herzinfarkt"
- Kontext: Tageszeit (14:30), Wetter (Regen), Waiblingen
- Anforderung: Generiere komplettes Szenario als JSON
```

### 4. KI generiert Szenario (1-2s)
```
KI analysiert und erstellt:
- 1 Patient, 67 Jahre, männlich
- Symptome: Starke Thoraxschmerzen, Dyspnoe, Diaphorese
- Anrufer: Ehefrau, 62, besorgt aber relativ ruhig
- Location: Wohnhaus, 3. OG, Aufzug funktioniert
- Fahrzeuge: NEF + RTW (kritischer Zustand)
- Dialog: Einzigartig, realistisch
```

### 5. Validierung & Anpassung
```
System prüft:
✓ Medizinisch plausibel?
✓ Fahrzeuge verfügbar im Pool?
✓ Funksprüche BOS-konform?
✓ Keine absurden Elemente?

→ Bei Problemen: Korrektur oder Neu-Generierung
```

### 6. Einsatz startet
```
📞 Notruf kommt rein mit einzigartigem Dialog
👤 Disponent spricht mit dynamischem Anrufer
🚑 Fahrzeuge werden disponiert (KI-Empfehlung)
📻 Realistische Funksprüche während Einsatz
⚠️ Unvorhersehbare Komplikationen möglich
```

---

## 📋 Layer 1: Basis-Definitionen

### Was WIR definieren (minimal!)

#### Einsatztypen-Liste (80 Einträge)

Jeder Einsatztyp hat nur:
- **ID**: z.B. `herzinfarkt`
- **Kategorie**: z.B. `kardiovaskulär`
- **Base-Priority**: z.B. `CRITICAL`
- **Keywords**: Für Auto-Erkennung
- **Typical-Vehicles**: Basis-Empfehlung (KI kann abweichen!)

**Größe:** ~5 KB für alle 80 Typen!

#### Fahrzeugpool
- RTW (4 Stück)
- KTW (2 Stück)
- NEF (1 Stück)
- NAW (1 Stück)
- RTH (1 Stück, bei Bedarf)

#### BOS-Funkspruch-Regeln
- Status-Codes (1-8)
- Standardphrasen
- Pflichtangaben (Callsign, Status, Location)

---

## 🔧 Layer 2: KI-Integration Details

### Ollama Setup

**Automatische Erkennung:**
```
Beim App-Start:
1. Prüfe: localhost:11434 erreichbar?
2. Prüfe: Modell llama3.2:3b vorhanden?
3. Status in UI anzeigen:
   ✅ "KI-Modus: Lokal (Ollama)"
   ⚠️ "KI-Modus: Cloud (Gemini)"
   ❌ "KI-Modus: Fallback (Templates)"
```

**User-Hinweis wenn Ollama fehlt:**
```
"🚀 Für beste Experience: Installiere Ollama!

✓ Unbegrenzte einzigartige Einsätze
✓ Funktioniert offline
✓ Kostenlos
✓ Schneller als Cloud

[Anleitung anzeigen] [Später]"
```

### Gemini Integration

**API-Setup:**
- User benötigt Google-API-Key (kostenlos)
- Wird in Settings gespeichert (verschlüsselt)
- Rate-Limit-Tracking (1500/Tag)

**Fallback-Logik:**
```
Wenn Ollama nicht verfügbar:
→ Prüfe: Gemini API-Key vorhanden?
→ Prüfe: Rate-Limit erreicht?
→ Nutze Gemini oder Fallback-Template
```

---

## 🎯 Layer 3: Validierung

### Plausibilitäts-Checks

**Medizinisch:**
- Symptome passen zu Diagnose?
- Vitalwerte realistisch?
- Medikation sinnvoll?

**Logistisch:**
- Fahrzeuge im Pool verfügbar?
- Disposition sinnvoll?
- Zeitangaben plausibel?

**BOS-konform:**
- Funksprüche korrekt formatiert?
- Status-Codes richtig verwendet?
- Pflichtangaben vorhanden?

**Bei Problemen:**
```
1. Versuche automatische Korrektur
2. Bei Fehlschlag: Neu-Generierung
3. Nach 3 Versuchen: Fallback-Template
```

---

## 📊 Vergleich: Alt vs. Neu

| Aspekt | Altes System | Neues KI-System | Verbesserung |
|--------|--------------|-----------------|---------------|
| **Dateigröße** | 1.3 MB Templates | 5 KB Definitionen | **-99.6%** |
| **Variationen** | 10-20 pro Typ | Unendlich | **∞** |
| **Wartung** | Tausende Zeilen | 80 Zeilen | **-99.9%** |
| **Realismus** | Repetitiv | Einzigartig | **+++** |
| **Disposition** | Statisch | Intelligent | **+++** |
| **Performance** | Instant | 1-2s | **-1-2s** |
| **Kosten** | $0 | $0 (Ollama) | **±0** |
| **Offline** | ✅ | ✅ (Ollama) | **✅** |

---

## ⚠️ Risiken & Mitigation

### Risiko 1: KI generiert Unsinn

**Wahrscheinlichkeit:** Mittel  
**Impact:** Mittel  

**Mitigation:**
- Layer 3 Validierung fängt meiste Fehler ab
- Bei 3 fehlgeschlagenen Versuchen: Template-Fallback
- User kann Einsatz neu generieren lassen
- Feedback-System: User meldet schlechte Generierungen

### Risiko 2: User hat kein Ollama

**Wahrscheinlichkeit:** Hoch (initial)  
**Impact:** Niedrig  

**Mitigation:**
- Gemini-Fallback funktioniert gut
- Template-Fallback als letzte Option
- Klare Anleitung zur Ollama-Installation
- In-App-Tutorial

### Risiko 3: Gemini Rate-Limit erreicht

**Wahrscheinlichkeit:** Niedrig (1500/Tag)  
**Impact:** Mittel  

**Mitigation:**
- Caching von generierten Einsätzen (20 Stück)
- Rate-Limit-Warnung bei 80%
- Automatischer Switch zu Templates
- Empfehlung: Ollama installieren

### Risiko 4: Performance-Probleme

**Wahrscheinlichkeit:** Niedrig  
**Impact:** Hoch  

**Mitigation:**
- Ollama läuft lokal → sehr schnell
- Timeout nach 5s → Fallback
- User kann KI-Modus deaktivieren
- Performance-Settings (Modell-Größe wählbar)

### Risiko 5: Medizinisch inkorrekt

**Wahrscheinlichkeit:** Niedrig  
**Impact:** Mittel (Lern-Tool!)  

**Mitigation:**
- KI-Prompt enthält medizinische Guidelines
- Validierung prüft Basis-Plausibilität
- Disclaimer: "Simulations-Tool, kein medizinisches Training"
- Community-Review für häufige Fehler

---

## 🚀 Implementierungs-Phasen

### Phase 1: Foundation (Woche 1)

**Ziele:**
- ✅ Basis-Definitionen erstellen (80 Einsatztypen)
- ✅ Ollama-Integration implementieren
- ✅ Gemini-Integration implementieren
- ✅ Fallback-System aufbauen

**Deliverables:**
- Einsatztypen-Datenbank (5 KB)
- KI-Connector (Ollama + Gemini)
- Settings-UI (KI-Modus wählen)

**Erfolgs-Kriterium:**
- Ein Einsatz kann per KI generiert werden

---

### Phase 2: KI-Prompts optimieren (Woche 2)

**Ziele:**
- ✅ Prompt-Templates verfeinern
- ✅ Output-Format standardisieren
- ✅ Validierungs-Logik implementieren
- ✅ Fehlerbehandlung robust machen

**Deliverables:**
- Optimierte Prompts für alle Kategorien
- JSON-Schema für KI-Output
- Validierungs-Engine

**Erfolgs-Kriterium:**
- 95% der generierten Einsätze sind plausibel

---

### Phase 3: Dynamische Features (Woche 3)

**Ziele:**
- ✅ Intelligente Fahrzeug-Disposition
- ✅ Dynamische Komplikationen
- ✅ Realistische Funksprüche
- ✅ Kontext-Awareness (Wetter, Zeit)

**Deliverables:**
- Disposition-Logic (KI-gesteuert)
- Komplikations-System
- Funkspruch-Generator

**Erfolgs-Kriterium:**
- Einsätze fühlen sich dynamisch und realistisch an

---

### Phase 4: UI/UX & Polish (Woche 4)

**Ziele:**
- ✅ Ollama-Setup-Assistent
- ✅ KI-Status-Anzeige
- ✅ Performance-Optimierung
- ✅ User-Feedback-System

**Deliverables:**
- Setup-Wizard für neue User
- Debug-Modus (KI-Output sehen)
- Performance-Monitoring

**Erfolgs-Kriterium:**
- Smooth User-Experience
- < 2s Generierungszeit

---

### Phase 5: Testing & Rollout (Woche 5)

**Ziele:**
- ✅ Umfangreiches Testing
- ✅ Community-Beta
- ✅ Dokumentation
- ✅ Migration alter Daten

**Deliverables:**
- Test-Suite (100+ generierte Einsätze)
- Beta-Feedback integriert
- User-Dokumentation

**Erfolgs-Kriterium:**
- System ist production-ready
- Alte Templates können archiviert werden

---

## 📈 Erfolgskriterien

### Quantitative Metriken

- ✅ **Code-Reduktion**: Von 1.3 MB auf < 50 KB (-96%)
- ✅ **Variations-Rate**: > 1000 einzigartige Einsätze möglich
- ✅ **Generierungszeit**: < 2s pro Einsatz
- ✅ **Plausibilitäts-Rate**: > 95% valide Szenarien
- ✅ **User-Adoption**: > 80% nutzen KI-Modus
- ✅ **Fehlerrate**: < 5% fehlerhafte Generierungen

### Qualitative Metriken

- ✅ User-Feedback: "Einsätze fühlen sich einzigartig an"
- ✅ Wartbarkeit: Neue Einsatztypen in < 5 Min hinzufügbar
- ✅ Realismus: Community bestätigt BOS-Konformität
- ✅ Performance: Gameplay fühlt sich flüssig an

---

## 🎮 User-Perspektive

### Setup-Experience

**Neuer User startet App:**

```
🎮 Willkommen beim Dispatcher-Simulator!

💡 Tipp: Für das beste Erlebnis empfehlen wir Ollama:

✓ Unendlich einzigartige Einsätze
✓ Funktioniert komplett offline
✓ Kostenlos und schnell
✓ Installation in 5 Minuten

[🚀 Ollama installieren] [⚡ Jetzt mit Cloud-KI starten]

Oder nutze den klassischen Modus (begrenzte Varianz)
```

### Gameplay-Experience

**User klickt "Neuer Einsatz":**

```
[1-2 Sekunden Generierung]

📞 Eingehender Notruf!

🗣️ "Hallo? Mein Mann... er hat so starke Schmerzen in der 
Brust! Er fasst sich immer ans Herz und sagt, er kriegt 
kaum Luft!"

[Disponent stellt Fragen - Dialog entwickelt sich einzigartig]

💬 "Wie alt ist Ihr Mann?"
🗣️ "67... wir wollten gerade spazieren gehen..."

💬 "Ist er bei Bewusstsein?"
🗣️ "Ja, aber er ist ganz blass und schwitzt stark!"

[KI empfiehlt intelligent:]
🚑 Empfohlene Disposition: NEF + RTW
📍 Musterstraße 15, 3. OG (Aufzug vorhanden)

[User disponiert Fahrzeuge]

📻 Funkspruch (automatisch generiert):
"Florian Waiblingen 46/83-1, Einsatz übernommen, 
Anfahrt zur Musterstraße 15, vermutlich Herzinfarkt, 
Status 7, kommen."

[5 Minuten später - unerwartete Komplikation:]
📞 Anruferin meldet sich erneut:
🗣️ "Er reagiert nicht mehr! Was soll ich tun?!"

[System schlägt Nachforderung vor:]
⚠️ Empfehlung: RTW zusätzlich für mögliche Reanimation?
```

---

## 🔮 Zukunfts-Features (Post-Launch)

### Phase 6: Advanced AI (Optional)

**Text-to-Speech Integration:**
- Anrufer-Stimmen generiert (verschiedene Emotionen)
- Realistischere Telefonate
- Accessibility-Feature

**Voice-to-Text:**
- User spricht Fragen ins Mikrofon
- KI reagiert auf gesprochene Anweisungen
- Immersiveres Erlebnis

**Multimodal:**
- KI generiert Szenenbilder
- Visuelle Darstellung des Einsatzortes
- Gemini 2.0 unterstützt dies bereits

**Lernende KI:**
- System lernt aus User-Entscheidungen
- Bessere Disposition-Empfehlungen über Zeit
- Personalisierte Schwierigkeitsgrade

---

## 📝 Offene Entscheidungen

### Zu klären vor Start:

- [ ] **Ollama als Pflicht oder Optional?**
  - Option A: Empfohlen, aber Gemini-Fallback
  - Option B: Pflicht für beste Experience
  - **Entscheidung:** Option A (Hybrid) ✅

- [ ] **Welches Ollama-Modell?**
  - llama3.2:1b (schnell, weniger akkurat)
  - llama3.2:3b (balanced) ← **Empfohlen**
  - llama3.2:7b (sehr gut, aber langsamer)

- [ ] **API-Key-Handling für Gemini?**
  - User muss eigenen Key holen (transparent)
  - Wir stellen Keys bereit (Kosten?)
  - **Empfehlung:** User-eigene Keys

- [ ] **Caching-Strategie?**
  - Wie viele Einsätze vorhalten? (20-50?)
  - Cache-Invalidierung nach wie vielen Tagen?
  - **Empfehlung:** 20 Einsätze, 24h TTL

- [ ] **Feedback-System?**
  - User kann Einsätze bewerten
  - Schlechte Generierungen melden
  - **Empfehlung:** Ja, einbauen

---

## 🎯 Nächste Schritte (Immediate)

### Diese Woche:

1. ✅ **Planung abgeschlossen** (dieses Dokument)
2. ⏳ **Phase 1 starten:**
   - Einsatztypen-Liste definieren (80 Typen)
   - Ollama lokal testen
   - Gemini API-Zugang einrichten
3. ⏳ **Erste Prompts schreiben:**
   - Template für Herzinfarkt
   - Template für Verkehrsunfall
   - Template für Reanimation
4. ⏳ **Proof of Concept:**
   - Ein komplett KI-generierter Einsatz
   - End-to-End-Test

### Nächste Woche:

- Phase 2: Alle 80 Einsatztypen
- Validierungs-System
- UI-Integration

---

## 📚 Technische Referenzen

### Ollama
- Website: https://ollama.ai
- Dokumentation: https://github.com/ollama/ollama
- Modelle: https://ollama.ai/library
- API-Docs: https://github.com/ollama/ollama/blob/main/docs/api.md

### Google Gemini
- Gemini API: https://ai.google.dev/
- Pricing: https://ai.google.dev/pricing
- Quickstart: https://ai.google.dev/tutorials/web_quickstart
- Rate-Limits: 1500 requests/day (free tier)

### Quellen
- [web:22] Top 5 Free AI APIs 2026
- [web:26] Groq vs OpenAI Performance
- [web:27] Offline AI with Ollama
- [web:28] AI RPG Dialogue Generators
- [web:30] OfflineAI GitHub
- [web:32] LLM Provider Comparison
- [web:33] Local AI Models Guide

---

## ✅ Zusammenfassung

**Problem gelöst:**
❌ 1.3 MB statische Templates  
❌ Repetitive Einsätze  
❌ Wartungs-Albtraum  

**Neue Lösung:**
✅ 5 KB Basis-Definitionen  
✅ Unendliche Varianz durch KI  
✅ Intelligente Disposition  
✅ Hybrid-System (Ollama + Gemini)  
✅ Offline-fähig  
✅ Kostenlos  

**Timeline:**
🗓️ 5 Wochen bis Production-Ready  
🎯 System ist skalierbar für 80+ Einsatztypen  
🚀 Zukünftige Features einfach integrierbar  

---

**Status:** 📋 Planung abgeschlossen - Ready to implement  
**Nächster Meilenstein:** Phase 1 Week 1 - Foundation  
**Verantwortlich:** @Polizei1234  
**Letzte Aktualisierung:** 08.03.2026, 21:08 CET