# 📡 FUNKSYSTEM - Komplette Dokumentation

**Version:** RadioSystem v1.6.0 + RadioUI v1.3.0  
**Stand:** 30.01.2026  
**Autor:** Dispatcher Simulator Team

---

## 📖 Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Features & Funktionen](#features--funktionen)
3. [Integration mit Einsatzgenerierung](#integration-mit-einsatzgenerierung)
4. [FMS-Status-Synchronisation](#fms-status-synchronisation)
5. [Datenfluss-Diagramme](#datenfluss-diagramme)
6. [Technische Details](#technische-details)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Überblick

Das **Funksystem** ermöglicht realistische Funkkommunikation zwischen Leitstelle und Einsatzfahrzeugen mit KI-generierten Funksprüchen, FMS-Integration und kontextbasierter Kommunikation.

### Hauptkomponenten

| Komponente | Beschreibung | Datei |
|------------|--------------|-------|
| **RadioSystem** | Kern-Logik, FMS-Listener, Queue-Management | `js/systems/radio-system.js` |
| **RadioUI** | Benutzeroberfläche, Funkprotokoll, Bedienelemente | `js/ui/radio-ui.js` |
| **RadioGroq** | KI-Integration (Groq AI / Llama 3.3 70B) | `js/systems/radio-groq.js` |
| **VehicleMovement** | FMS-Status-Updates, Fahrzeugbewegung | `js/systems/vehicle-movement.js` |

---

## 🚀 Features & Funktionen

### 1. **FMS-Integration** ✅

- Automatische Erkennung von FMS-Statuswechseln (1-9)
- Triggert Funkverkehr basierend auf Status:
  - **FMS 3** (Einsatzfahrt) → Priorisierter Sprechwunsch
  - **FMS 4** (Am Einsatzort) → Optional: Lagemeldung
  - **FMS 7** (Patient aufgenommen) → Optional: Transportziel-Anfrage
- Zeigt alle Statusänderungen im Funkprotokoll

**Code-Beispiel:**
```javascript
// VehicleMovement setzt FMS-Status
VehicleMovement.setVehicleStatus(vehicle, 3);

// RadioSystem reagiert (falls integriert)
RadioSystem.handleFMSStatusChange(vehicle, 3, oldStatus);
```

---

### 2. **Warteschlangen-System** ✅

- Fahrzeuge können Sprechwunsch anmelden (FMS 5)
- **3 Prioritätsstufen:**
  - 🔴 **Hoch** (Weight: 100) - z.B. FMS 3 - Einsatzfahrt
  - 🟡 **Normal** (Weight: 50) - z.B. FMS 4 - Lagemeldung
  - 🔵 **Niedrig** (Weight: 10) - z.B. FMS 1
- Automatische Sortierung nach Priorität + Zeitstempel
- Sprecherlaubnis manuell erteilen über UI

**Funktionen:**
```javascript
RadioSystem.addToQueue(vehicle, priority, reason);
RadioSystem.grantSpeakPermission(vehicleId);
RadioSystem.removeFromQueue(vehicleId);
```

---

### 3. **KI-Generierte Funksprüche (RadioGroq)** 🤖

- **Automatische Fahrzeug-Antworten** mit Groq AI (Llama 3.3 70B)
- **5 Kontexttypen:**
  1. `sprechwunsch` - Normaler Sprechwunsch
  2. `sprechwunsch_priorisiert` - Dringender Sprechwunsch
  3. `lagemeldung` - Lagemeldung vom Einsatzort
  4. `transportziel_anfrage` - Krankenhaus-Anfrage
  5. `response_to_dispatch` - Antwort auf Leitstellen-Nachricht

- Berücksichtigt:
  - FMS-Status
  - Einsatzdaten (Stichwort, Meldebild, Adresse)
  - Position
  - Letzte Leitstellen-Nachricht

**Fallback:** Funktioniert auch ohne API-Key mit generischen Antworten

**Code-Beispiel:**
```javascript
const response = await RadioGroq.generateVehicleResponse(vehicle, {
    reason: 'lagemeldung',
    incident: incident,
    fmsCode: 4,
    lastDispatchMessage: "Status?"
});
// → "RTW 12/83-1 an Leitstelle, Patient bewusstlos, beginnen Reanimation, kommen"
```

---

### 4. **Funkkanäle** 📻

- **4 Kanäle:**
  - 🚑 **Rettungsdienst** (RTW, KTW, NEF)
  - 🚓 **Polizei** (FuStW, MTF)
  - 🚒 **Feuerwehr** (LF, DLK, TLF)
  - 🌐 **Gemeinsam** (alle Organisationen)
- Kanalbasierte Filterung im Protokoll
- Fahrzeugtyp-basierte Zuordnung

---

### 5. **Leitstellen-Kommunikation** 💬

#### Manuelle Nachrichten
```javascript
RadioSystem.sendDispatchMessage(vehicleId, "Fahrt Klinikum an");
```

#### Sammelruf
```javascript
RadioSystem.sendBroadcast('rettungsdienst', "Achtung alle RTW, Großschadenlage...");
// → Alle Fahrzeuge des Kanals quittieren automatisch
```

#### FMS-Codes senden
```javascript
RadioSystem.sendFMSCode(vehicle, 'J'); // Sprechaufforderung
```

---

### 6. **Radio-Panel (RadioUI)** 🖥️

- **Draggable & Minimierbar**
- **Kanal-Auswahl** mit Buttons
- **Live-Indikator** (pulsierend 🔴)
- **Warteschlangen-Anzeige** mit Badge
- Komplett über Header-Button steuerbar

**Features:**
- Position wird in `localStorage` gespeichert
- Animationen: `slideIn`, `pulse`
- Mobile-optimiert

---

### 7. **Funkprotokoll** 📜

- **Chronologische Anzeige** (neueste zuerst)
- **Farbcodierung:**
  - 🟢 Leitstelle → Fahrzeug (Grün `#28a745`)
  - 🟡 Fahrzeug → Leitstelle (Gelb `#ffc107`)
  - ⚪ Statusänderungen (Blau `#17a2b8`)
  - ⚫ Sammelruf (Grau `#6c757d`)
- **🤖 KI-Tag** bei AI-generierten Sprüchen
- **Timestamps** für jede Nachricht
- **Auto-Cleanup** (max. 100 Einträge)

**Code-Beispiel:**
```javascript
RadioSystem.addLogEntry({
    type: 'vehicle_to_dispatch',
    vehicle: vehicle,
    message: "RTW 12/83-1 an Leitstelle, FMS 2, kommen",
    direction: 'vehicle_to_dispatch',
    ai_generated: true
});
```

---

### 8. **Visuelle Funkspruch-Trennung** 🎨

**Seit v1.3.0:**
- **Callsign:** 🟡 **FETT** + **GELB** (#ffc107) + **UPPERCASE**
- **Trennzeichen:** →
- **Funkspruch:** 🔵 Hellblau (#64b5f6)
- Blaue Border-Linie links

**Beispiel:**
```
KDOW 1/10-1 → FMS 2, einsatzbereit auf Wache, kommen
   ^GELB^         ^BLAU^
   FETT           Normal
```

**CSS:**
```css
.log-message-callsign {
    font-weight: 700;
    font-size: 14px;
    color: #ffc107;
    text-transform: uppercase;
}

.log-message-text {
    color: #64b5f6;
    font-weight: 400;
}
```

---

### 9. **Nachricht senden** ✍️

- Fahrzeug-Auswahl (gruppiert nach Kanal)
- Textarea für Funkspruch
- **Strg+Enter** zum Senden
- Automatische Validierung
- XSS-Schutz (alle Inputs escaped)

**UI-Elemente:**
```html
<select id="radio-vehicle-select">
    <option value="">-- Fahrzeug wählen --</option>
    <optgroup label="🚑 Rettungsdienst">
        <option value="RTW_1">RTW 12/83-1 (Status 2)</option>
    </optgroup>
</select>
<textarea id="radio-message-input" placeholder="Funkspruch eingeben..."></textarea>
<button onclick="RadioUI.sendMessage()">Senden (Strg+Enter)</button>
```

---

### 10. **Sammelruf-Funktion** 📢

- Kanal-Auswahl
- Nachricht per Prompt eingeben
- Alle Fahrzeuge quittieren automatisch (1-4s Verzögerung)

**Beispiel:**
```javascript
RadioUI.sendBroadcast();
// Prompt: "Achtung alle RTW, Großschadenlage Autobahn A81"
// → RTW 12/83-1 von Leitstelle, verstanden, Ende
// → RTW 12/84-1 von Leitstelle, verstanden, Ende
```

---

### 11. **Funkdisziplin** 🎙️

**Seit v1.6.0:**
- **"Ende"-Erkennung:** Stoppt automatische Antworten
  - Erkennt: `"Ende"`, `"ende"`, `"ENDE"`, `"Ende."`, `"Aus"`
  - Nur am String-Ende

**"kommen"-Meldungen:** Erwarten Antwort

**Code-Beispiel:**
```javascript
RadioSystem.endsWithEnde(message);
// "Fahrt Klinikum an, Ende" → true (keine Antwort)
// "Fahrt Klinikum an, kommen" → false (Antwort generieren)
```

**Funktion:**
```javascript
endsWithEnde(message) {
    const normalized = message.trim().toLowerCase();
    return normalized.endsWith('ende') || 
           normalized.endsWith('ende.') ||
           normalized.endsWith('aus');
}
```

---

### 12. **Memory-Management** 🗑️

- **Auto-Cleanup** alle 60 Sekunden
- Max. 100 Log-Einträge (konfigurierbar)
- **Debounced UI-Updates** (max. 1x/100ms)
- **Memory-Leak-Prevention** bei FMS-Listenern

**Cleanup-Logik:**
```javascript
startLogCleanup() {
    this.logCleanupInterval = setInterval(() => {
        const maxEntries = this.config?.ui_settings?.max_log_entries || 100;
        if (this.log.length > maxEntries) {
            const removed = this.log.length - maxEntries;
            this.log = this.log.slice(0, maxEntries);
            console.log(`🗑️ Auto-Cleanup: ${removed} alte Log-Einträge entfernt`);
        }
    }, 60000);
}
```

---

### 13. **XSS-Protection** 🔒

- Alle User-Inputs werden escaped
- Keine `innerHTML`, nur `textContent`
- Sichere Funkspruch-Darstellung

**Parser-Funktion:**
```javascript
parseFunkspruch(message) {
    const match = message.match(/^([^,]+?)\s*(an|von)\s*Leitstelle[,:]?\s*(.*)$/i);
    
    if (match) {
        return {
            callsign: match[1].trim(),
            text: match[3].trim()
        };
    }
    
    const parts = message.split(/[,:]/, 2);
    return {
        callsign: parts[0].trim(),
        text: parts[1]?.trim() || ''
    };
}
```

---

### 14. **Fallback-Systeme** 🔄

- **Config-Fallback:** Funktioniert ohne `radio-config.json`
- **FMS-Fallback:** Funktioniert ohne `fms-codes.json`
- **AI-Fallback:** Generische Funksprüche ohne API-Key

**Fallback-Config:**
```javascript
getFallbackConfig() {
    return {
        "channels": {
            "rettungsdienst": {
                "name": "Rettungsdienst",
                "icon": "🚑",
                "vehicle_types": ["RTW", "KTW", "NEF"]
            }
            // ...
        },
        "fms_triggers": { /* ... */ }
    };
}
```

---

### 15. **Export-Funktion** 💾

- Funkprotokoll als **JSON** exportieren
- Felder: `timestamp`, `type`, `vehicle`, `message`, `direction`
- Download als `funkprotokoll_YYYY-MM-DD.json`

**Code:**
```javascript
exportLog() {
    const data = this.log.map(entry => ({
        timestamp: new Date(entry.timestamp).toISOString(),
        type: entry.type,
        vehicle: entry.vehicle?.callsign || 'Leitstelle',
        message: entry.message,
        direction: entry.direction
    }));

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    // ... Download-Trigger
}
```

---

### 16. **Kontextuelles Verständnis** 🧠

Jede Fahrzeug-Antwort berücksichtigt:

| Kontext | Quelle | Beispiel |
|---------|--------|----------|
| **FMS-Status** | `vehicle.currentStatus` | "FMS 4 am Einsatzort" |
| **Einsatz** | `GAME_DATA.incidents.find()` | "Herzinfarkt, Patient bewusstlos" |
| **Letzte Nachricht** | `lastDispatchMessages[vehicleId]` | "Status?" |
| **Position** | `vehicle.position` | "Nähe Musterstraße 12" |
| **Grund** | Parameter | "lagemeldung" |

**Context-Builder:**
```javascript
buildContext(vehicle, reason) {
    let incident = null;
    
    if (vehicle.incident) {
        incident = GAME_DATA.incidents.find(i => 
            i.assignedVehicles?.includes(vehicle.id) ||
            i.vehicles?.includes(vehicle.id) ||
            i.id === vehicle.incident
        );
    }

    return {
        incident: incident,
        position: vehicle.position,
        status: vehicle.currentStatus,
        reason: reason
    };
}
```

---

### 17. **Moderne UI** 🎨

- **Dark Theme** (Gradient #1a1a2e → #16213e)
- **Glassmorphism** (transparente Overlays)
- **Smooth Animations** (`slideIn`, `pulse`)
- **Responsive** (Mobile-optimiert)
- **Icons** für alles (Emojis)

**Design-Variablen:**
```css
:root {
    --radio-primary: #1a1a2e;
    --radio-secondary: #16213e;
    --radio-accent: #0f3460;
    --radio-highlight: #e94560;
    --radio-success: #28a745;
    --radio-warning: #ffc107;
}
```

---

### 18. **Accessibility** ♿

- Klare **Farbcodierung**
- **Große Buttons** (min. 40px)
- **Tooltips**
- **Keyboard-Shortcuts** (Strg+Enter)
- **Screen-Reader-freundlich**

---

### 19. **Event-Driven Architecture** ⚡

- `radioSystemReady` Event für UI-Init
- FMS-Listener auf `VehicleMovement`
- UI-Updates via Custom Events
- Robuste 3-fach Init-Strategie

**Init-Flow:**
```javascript
// 1. RadioSystem feuert Event
window.dispatchEvent(new CustomEvent('radioSystemReady', {
    detail: { version: '1.6.0', timestamp: Date.now() }
}));

// 2. RadioUI lauscht
window.addEventListener('radioSystemReady', (e) => {
    console.log('✅ RadioSystem bereit - initialisiere UI');
    RadioUI.initialize();
});
```

---

## 🔗 Integration mit Einsatzgenerierung

### ⚠️ Wichtig: Aktueller Status

Das **Funksystem ist NICHT mehr automatisch mit der Einsatzgenerierung integriert!**

In **VehicleMovement v8.0.0** wurde die Radio-Integration **vollständig entfernt**:
> "🔥 FIX v8.0.0: RADIO SYSTEM VOLLSTÄNDIG ENTFERNT!"

---

### 🔄 Alte Integration (vor v8.0.0)

Früher gab es eine **automatische FMS-zu-Funk-Kopplung**:

```javascript
// RadioSystem überwachte FMS-Statusänderungen
VehicleMovement.setVehicleStatus = (vehicle, fmsCode) => {
    const oldStatus = vehicle.currentStatus;
    
    // Original-Funktion
    originalSetStatus.call(VehicleMovement, vehicle, fmsCode);
    
    // Triggere Radio-Events
    RadioSystem.handleFMSStatusChange(vehicle, fmsCode, oldStatus);
};
```

**FMS-Trigger (alte Config):**
```json
{
  "fms_triggers": {
    "3": {
      "action": "add_to_queue",
      "priority": "high",
      "reason": "sprechwunsch_priorisiert"
    },
    "4": {
      "action": "optional_message",
      "manual_trigger": "lagemeldung"
    }
  }
}
```

---

### 📡 Aktuelle Integration (manuell)

**Integration erfolgt nur noch über manuelle Schnittstellen:**

#### 1. Einsatzkontext für Funksprüche

```javascript
buildContext(vehicle, reason) {
    let incident = null;
    
    // Finde zugewiesenen Einsatz über vehicle.incident
    if (vehicle.incident) {
        incident = GAME_DATA.incidents.find(i => 
            i.assignedVehicles?.includes(vehicle.id) ||
            i.vehicles?.includes(vehicle.id) ||
            i.id === vehicle.incident
        );
    }

    return {
        incident: incident,      // Einsatzdaten
        position: vehicle.position,
        status: vehicle.currentStatus,
        reason: reason
    };
}
```

**Kontext-Daten umfassen:**
- **Stichwort** (z.B. "Herzinfarkt")
- **Meldebild** (z.B. "Patient bewusstlos, Atemnot")
- **Adresse**
- **Zugewiesene Fahrzeuge**
- **Schweregrad**

---

#### 2. KI-Generierung mit Einsatzkontext

```javascript
// RadioGroq erhält Einsatz-Infos
const response = await RadioGroq.generateVehicleResponse(vehicle, {
    reason: reason,
    incident: context.incident,  // ← Einsatz-Objekt
    lastDispatchMessage: this.lastDispatchMessages[vehicle.id],
    fmsCode: vehicle.currentStatus
});
```

**Die KI nutzt:**
- **Stichwort** → "RTW 12/83-1, Einsatzfahrt zu Herzinfarkt"
- **Meldebild** → "Patient 65 Jahre, Thoraxschmerz, bewusstlos"
- **FMS-Status** → "Aktuell FMS 4 (am Einsatzort)"
- **Position** → "Nähe Musterstraße 12"

---

### 🔌 Datenfluss im Detail

```
┌─────────────────┐
│ GAME_DATA       │
│ .incidents []   │ ← Einsätze vom IncidentGenerator
│ .vehicles []    │ ← Fahrzeugdaten mit .incident Referenz
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ VehicleMovement                 │
│ - dispatchVehicle()             │ ← Weist Fahrzeug zu
│ - vehicle.incident = incidentId │ ← Verknüpfung!
│ - setVehicleStatus(FMS)         │ ← Nur Status-Update
└────────┬────────────────────────┘
         │
         │ (KEINE automatischen Radio-Trigger mehr!)
         │
         ▼
┌─────────────────────────────────┐
│ RadioSystem                     │
│ - buildContext(vehicle)         │ ← Holt Einsatz über vehicle.incident
│   └─ GAME_DATA.incidents.find()│
│ - generateVehicleResponse()     │ ← Nutzt Einsatz-Kontext
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ RadioGroq (KI)                  │
│ - Erhält Incident-Objekt        │
│ - Generiert kontextuelle Antwort│
│   mit Stichwort, Meldebild, etc.│
└─────────────────────────────────┘
```

---

### 📋 Integrationspunkte

| Punkt | Beschreibung | Status |
|-------|--------------|--------|
| **vehicle.incident** | Referenz-ID zum Einsatz | ✅ Aktiv |
| **GAME_DATA.incidents** | Globale Einsatzliste | ✅ Aktiv |
| **buildContext()** | Holt Einsatz für Funkspruch | ✅ Aktiv |
| **RadioGroq KI-Prompt** | Nutzt Einsatzdaten | ✅ Aktiv |
| **FMS-Listener** | Automatische Funk-Trigger | ❌ **ENTFERNT in v8.0.0** |
| **handleFMSStatusChange()** | Radio-Events bei FMS | ❌ **ENTFERNT in v8.0.0** |

---

### 🎯 Integration Schritt-für-Schritt

#### **Schritt 1: Einsatz wird generiert**
```javascript
// (IncidentGenerator)
const incident = {
    id: 'INC_001',
    stichwort: 'Herzinfarkt',
    meldebild: 'Patient 65J, Thoraxschmerz',
    location: [lat, lon],
    assignedVehicles: []
};
GAME_DATA.incidents.push(incident);
```

#### **Schritt 2: Fahrzeug wird alarmiert**
```javascript
// VehicleMovement
VehicleMovement.dispatchVehicle(vehicleId, coords, incidentId);

// Setzt Referenz
vehicle.incident = incidentId;  // ← VERKNÜPFUNG!
vehicle.currentStatus = 3;      // FMS 3 (Einsatzfahrt)
```

#### **Schritt 3: Funkspruch wird benötigt**
```javascript
// User klickt "Sprechen" in RadioUI
RadioUI.sendMessage(vehicleId, "Status?");

// RadioSystem holt Kontext
const context = RadioSystem.buildContext(vehicle, 'response_to_dispatch');

// Findet Einsatz über vehicle.incident
const incident = GAME_DATA.incidents.find(i => i.id === vehicle.incident);

// KI erhält ALLE Einsatz-Infos
const response = await RadioGroq.generateVehicleResponse(vehicle, {
    incident: incident,  // ← Stichwort, Meldebild, Adresse etc.
    fmsCode: 3,
    position: vehicle.position
});
```

#### **Schritt 4: KI-Antwort mit Einsatzkontext**
```
Prompt an Groq AI:
"Du bist RTW 12/83-1. Dein Einsatz:
- Stichwort: Herzinfarkt
- Meldebild: Patient 65J, Thoraxschmerz, bewusstlos
- Status: FMS 3 (Einsatzfahrt)
- Position: Nähe Musterstraße 12

Antworte auf Leitstelle..."

→ KI-Antwort: "RTW 12/83-1 an Leitstelle, ETA 8 Minuten, kommen"
```

---

### 🔍 Warum wurde die automatische Integration entfernt?

**Probleme mit der alten Integration:**

1. **Zu viele automatische Funksprüche** (bei jedem FMS-Wechsel)
2. **FMS-Listener Memory Leaks**
3. **Komplexe Abhängigkeiten** zwischen Systemen
4. **Performance-Probleme** durch Radio-Overhead

**Lösung:** Manuelle Steuerung über RadioUI + Kontext-Lookup bei Bedarf

---

### 💡 Vorteile der aktuellen Architektur

✅ **Entkopplung:** VehicleMovement läuft ohne Radio-Abhängigkeit

✅ **Performance:** Nur Funksprüche wenn nötig, nicht bei jedem FMS

✅ **Flexibilität:** User entscheidet wann kommuniziert wird

✅ **Context-Aware:** KI hat trotzdem vollen Einsatz-Zugriff

✅ **Memory-Safe:** Keine Listener-Leaks mehr

---

### 🚀 Zusammenfassung

| System | Rolle |
|--------|-------|
| **IncidentGenerator** | Erstellt Einsätze in `GAME_DATA.incidents` |
| **VehicleMovement** | Verknüpft `vehicle.incident = incidentId` |
| **RadioSystem** | Holt Einsatz via `buildContext()` bei Bedarf |
| **RadioGroq** | Generiert Antworten mit Einsatz-Kontext |
| **RadioUI** | User-Interface für manuelle Kommunikation |

**Die Integration ist LOSE gekoppelt über `vehicle.incident` und `GAME_DATA.incidents` - keine direkten Funktionsaufrufe mehr!**

---

## 📊 FMS-Status-Synchronisation

### 🔄 Wie Status-Updates fließen

```
┌──────────────────────────┐
│  VehicleMovement         │  ← Status wird hier GESETZT
│  setVehicleStatus()      │
└────────────┬─────────────┘
             │
             │ 1. Direkte Änderung
             ▼
┌──────────────────────────┐
│  vehicle.currentStatus   │  ← EINZIGE Datenquelle!
│  (in GAME_DATA.vehicles) │
└────────────┬─────────────┘
             │
             │ 2. UI-Update-Trigger
             ▼
┌──────────────────────────┐
│  UI.updateVehicleList()  │  ← Liest currentStatus
└────────────┬─────────────┘
             │
             ├─────────────────────────┐
             │                         │
             ▼                         ▼
┌──────────────────┐    ┌──────────────────────┐
│ Einsatz-Tab      │    │ Fahrzeuge-Tab (Karte)│
│ updateIncident   │    │ updateVehicleMarkers │
│ List()           │    │ updateVehicleOnMap() │
└──────────────────┘    └──────────────────────┘
```

---

### 1️⃣ Status wird gesetzt (VehicleMovement)

**Funktion: `setVehicleStatus()`**

```javascript
setVehicleStatus(vehicle, fmsCode) {
    const oldStatus = vehicle.currentStatus;
    
    console.log(`🔄 setVehicleStatus: ${vehicle.callsign} ${oldStatus} → ${fmsCode}`);

    // 🎯 EINZIGER Schreibzugriff auf Status!
    vehicle.currentStatus = fmsCode;

    // UI aktualisieren
    if (typeof UI !== 'undefined' && UI.updateVehicleList) {
        UI.updateVehicleList();  // ← Triggert Update!
    }
}
```

**Aufruforte:**
- `dispatchVehicle()` → FMS 3 (Einsatzfahrt)
- `handleArrival()` → FMS 4 (Am Einsatzort), FMS 8 (Transportfahrt), FMS 2 (Einsatzbereit)
- `completeTreatment()` → FMS 7 (Patient aufgenommen), FMS 1 (Rückfahrt)
- `closeIncidentFallback()` → FMS 2 (Einsatz abgeschlossen)

---

### 2️⃣ Einsatz-Tab liest Status

**Funktion: `UI.updateIncidentList()`**

```javascript
updateIncidentList() {
    const incidents = GAME_DATA?.incidents || [];
    
    container.innerHTML = activeIncidents.map(incident => `
        <div class="incident-vehicles">
            ${(incident.assignedVehicles || []).map(vId => {
                const v = GAME_DATA.vehicles.find(vehicle => vehicle.id === vId);
                if (!v) return '';
                
                const fms = this.getFMSStatus(v);  // ← Liest vehicle.currentStatus!
                
                return `<span class="vehicle-chip" 
                    style="background: ${fms.color}20; 
                           border-left: 3px solid ${fms.color};">
                    ${v.callsign}
                </span>`;
            }).join('')}
        </div>
    `).join('');
}
```

**Funktion: `UI.getFMSStatus()`**

```javascript
getFMSStatus(vehicle) {
    const fmsCode = vehicle.currentStatus || vehicle.status || 2;
    
    return CONFIG.FMS_STATUS[fmsCode] || {
        name: 'Unbekannt',
        color: '#6c757d',
        icon: '🚑'
    };
}
```

**Gelesene Daten:**
- `vehicle.currentStatus` (Priorität 1)
- `vehicle.status` (Fallback, veraltet)
- Default: `2` (Einsatzbereit auf Wache)

---

### 3️⃣ Einsatz-Details anzeigen

**Funktion: `UI.selectIncident()`**

```javascript
selectIncident(incidentId) {
    const incident = GAME_DATA.incidents.find(i => i.id === incidentId);
    const vehicleIds = incident.vehicles || incident.assignedVehicles || [];
    
    const assignedVehicles = vehicleIds.map(vId => {
        const v = GAME_DATA.vehicles.find(vehicle => vehicle.id === vId);
        if (!v) return null;
        
        const fms = this.getFMSStatus(v);  // ← Liest currentStatus!
        
        return { vehicle: v, fms: fms };
    }).filter(Boolean);

    // HTML-Rendering mit FMS-Status
    detailsContainer.innerHTML = `
        <div class="vehicle-detail-card" 
             style="border-left: 4px solid ${fms.color};">
            <div class="vehicle-detail-status" 
                 style="background: ${fms.color}20; 
                        color: ${fms.color};">
                <strong>Status ${vehicle.currentStatus || 2}</strong> 
                - ${fms.name}
            </div>
        </div>
    `;
}
```

---

### 4️⃣ Karte zeigt Status

**Funktion: `updateVehicleOnMap()`**

```javascript
updateVehicleOnMap(vehicle) {
    if (!map || !vehicle.position) return;

    // Fahrzeug in Wache (FMS 2) verstecken
    if (vehicle.currentStatus === 2 && vehicle.status === 'available') {
        if (vehicleMarkers[vehicle.id]) {
            map.removeLayer(vehicleMarkers[vehicle.id]);
            delete vehicleMarkers[vehicle.id];
        }
        return;
    }

    // Marker aktualisieren oder erstellen
    if (vehicleMarkers[vehicle.id]) {
        vehicleMarkers[vehicle.id].setLatLng([vehicle.position[0], vehicle.position[1]]);
        return;
    }

    // Neuer Marker (mit CACHED Icon!)
    const marker = L.marker([vehicle.position[0], vehicle.position[1]], {
        icon: L.divIcon({
            html: ICON_CACHE.getVehicleIcon(vehicle.type),
            className: 'vehicle-marker-moving'
        })
    });

    marker.addTo(map);
    vehicleMarkers[vehicle.id] = marker;
}
```

**Funktion: `getFMSStatus()` (in map.js)**

```javascript
function getFMSStatus(vehicle) {
    const fmsCode = vehicle.currentStatus || vehicle.status || 2;
    
    if (typeof CONFIG !== 'undefined' && 
        CONFIG.FMS_STATUS && 
        CONFIG.FMS_STATUS[fmsCode]) {
        return CONFIG.FMS_STATUS[fmsCode];
    }
    
    // Fallback-Status-Definition
    const fallbackStatus = {
        1: { name: 'Einsatzbereit über Funk', color: '#28a745', icon: '🟢' },
        2: { name: 'Einsatzbereit auf Wache', color: '#28a745', icon: '🟢' },
        3: { name: 'Einsatz übernommen', color: '#ffc107', icon: '🟡' },
        4: { name: 'Anfahrt Einsatzstelle', color: '#fd7e14', icon: '🟠' },
        5: { name: 'Ankunft Einsatzstelle', color: '#dc3545', icon: '🔴' }
        // ... weitere Status
    };
    
    return fallbackStatus[fmsCode] || {
        name: 'Unbekannt',
        color: '#6c757d',
        icon: '❓'
    };
}
```

**Popup-Content mit Status**

```javascript
function createVehiclePopupContent(vehicle) {
    const fms = getFMSStatus(vehicle);  // ← Liest currentStatus!
    const statusNumber = vehicle.currentStatus || vehicle.status || 2;
    
    return `
        <div style="background: ${fms.color}; color: white;">
            <strong>${fms.icon} ${vehicle.callsign}</strong>
        </div>
        <div style="background: rgba(0,0,0,0.2); 
                    border-left: 3px solid ${fms.color};">
            <strong style="color: ${fms.color};">
                Status ${statusNumber}
            </strong><br>
            <span style="color: ${fms.color};">${fms.name}</span>
        </div>
    `;
}
```

---

### 📋 Status-Konfiguration (CONFIG.FMS_STATUS)

**Alle FMS-Status-Definitionen:**

```javascript
CONFIG.FMS_STATUS = {
    1: { name: 'Einsatzbereit über Funk', color: '#28a745', icon: '🟢' },
    2: { name: 'Einsatzbereit auf Wache', color: '#28a745', icon: '🟢' },
    3: { name: 'Einsatz übernommen', color: '#ffc107', icon: '🟡' },
    4: { name: 'Anfahrt Einsatzstelle', color: '#fd7e14', icon: '🟠' },
    5: { name: 'Ankunft Einsatzstelle', color: '#dc3545', icon: '🔴' },
    6: { name: 'Sprechwunsch', color: '#6c757d', icon: '⚪' },
    7: { name: 'Patient aufgenommen', color: '#17a2b8', icon: '🔵' },
    8: { name: 'Anfahrt Krankenhaus', color: '#007bff', icon: '🔵' },
    9: { name: 'Ankunft Krankenhaus', color: '#6f42c1', icon: '🟣' },
    0: { name: 'Notruf/Hilferuf', color: '#dc3545', icon: '⚠️' },
    'C': { name: 'Status C', color: '#dc3545', icon: '🛑' }
};
```

**Jeder Status hat:**
- `name` → Textbeschreibung (z.B. "Einsatzfahrt")
- `color` → Hex-Farbe für UI (z.B. `#ffc107`)
- `icon` → Emoji (z.B. 🟡)

---

### 🔗 Zusammenfassung: Datenfluss

| Schritt | System | Funktion | Aktion |
|---------|--------|----------|--------|
| **1. Schreiben** | VehicleMovement | `setVehicleStatus()` | Setzt `vehicle.currentStatus` |
| **2. Trigger** | VehicleMovement | `UI.updateVehicleList()` | Benachrichtigt UI |
| **3. Lesen** | UI (Einsatz-Tab) | `getFMSStatus()` | Liest `currentStatus` + `CONFIG.FMS_STATUS` |
| **4. Rendern** | UI (Einsatz-Tab) | `updateIncidentList()` | Zeigt Farbe + Icon |
| **5. Details** | UI (Einsatz-Tab) | `selectIncident()` | Detailansicht mit Status |
| **6. Karte** | Map System | `updateVehicleOnMap()` | Aktualisiert Marker |
| **7. Popup** | Map System | `createVehiclePopupContent()` | Zeigt Status bei Klick |

---

### 🎯 Wichtige Erkenntnisse

✅ **Single Source of Truth:** `vehicle.currentStatus` ist DIE Status-Quelle

✅ **Kein Push-System:** UI pollt nicht, wird nur bei Änderung getriggert

✅ **Fallback-Logik:** Wenn `CONFIG.FMS_STATUS` fehlt, gibt's Fallback-Definitionen

✅ **Farbcodierung:** Jedes UI-Element nutzt `fms.color` für konsistente Darstellung

✅ **Icon-Cache:** Karten-Icons werden gecacht (90% weniger SVG-Generierung)

⚠️ **Veraltetes Feld:** `vehicle.status` existiert noch als Fallback, sollte aber NICHT mehr genutzt werden

---

**Die Einsatzgenerierung selbst schreibt KEINE Status - sie liest nur über `getFMSStatus()`!**

---

## 🎨 Datenfluss-Diagramme

### Kompletter System-Überblick

```
┌─────────────────────────────────────────────────────────────────┐
│                         GAME_DATA                               │
│  ┌───────────────┐           ┌────────────────┐                │
│  │ .incidents[]  │           │ .vehicles[]    │                │
│  │               │           │                │                │
│  │ - id          │◄──────────┤ - id           │                │
│  │ - stichwort   │           │ - callsign     │                │
│  │ - meldebild   │           │ - currentStatus│ ← Single Source│
│  │ - koordinaten │           │ - incident  ───┤   of Truth!    │
│  │ - assigned    │           │ - position     │                │
│  │   Vehicles[]  ├──────────►│ - station      │                │
│  └───────────────┘           └────────┬───────┘                │
└───────────────────────────────────────┼────────────────────────┘
                                        │
          ┌─────────────────────────────┼─────────────────────────┐
          │                             │                         │
          ▼                             ▼                         ▼
┌──────────────────┐         ┌──────────────────┐    ┌──────────────────┐
│ VehicleMovement  │         │ RadioSystem      │    │ UI + Map         │
│                  │         │                  │    │                  │
│ setVehicleStatus │────────►│ buildContext()   │    │ getFMSStatus()   │
│ (schreibt!)      │         │ (liest!)         │    │ (liest!)         │
│                  │         │                  │    │                  │
│ - dispatchVehicle│         │ generateResponse │    │ updateIncident   │
│ - handleArrival  │         │ sendDispatchMsg  │    │ List()           │
│ - completeTreat  │         │ addToQueue       │    │ updateVehicle    │
│                  │         │                  │    │ OnMap()          │
└──────────────────┘         └──────────┬───────┘    └──────────────────┘
                                        │
                                        ▼
                             ┌──────────────────┐
                             │ RadioGroq (KI)   │
                             │                  │
                             │ - Llama 3.3 70B  │
                             │ - Kontext-Aware  │
                             │ - Fallback-Mode  │
                             └──────────────────┘
```

---

### Funkspruch-Generierung Flow

```
┌──────────────┐
│ USER         │
│ "Status?"    │
└──────┬───────┘
       │
       ▼
┌─────────────────────────┐
│ RadioUI                 │
│ sendMessage()           │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ RadioSystem                         │
│ sendDispatchMessage(vehicleId, msg) │
└──────┬──────────────────────────────┘
       │
       ├─── 1. Speichert: lastDispatchMessages[vehicleId] = msg
       │
       ├─── 2. Prüft "Ende"?
       │    ├─ JA → STOP! (keine Antwort)
       │    └─ NEIN → weiter
       │
       ▼
┌─────────────────────────────────────┐
│ buildContext(vehicle, reason)       │
│                                     │
│ 1. Sucht in GAME_DATA.incidents:   │
│    incident.id === vehicle.incident │
│                                     │
│ 2. Sammelt Kontext:                │
│    - incident (Stichwort, Meldebild)│
│    - position                       │
│    - currentStatus                  │
│    - reason                         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ generateVehicleResponse()           │
│                                     │
│ Prüft: RadioGroq verfügbar?        │
│ ├─ JA → API-Call                   │
│ └─ NEIN → Fallback-Antwort         │
└──────┬──────────────────────────────┘
       │
       ├────── RadioGroq verfügbar ──────►┌──────────────────────┐
       │                                   │ RadioGroq            │
       │                                   │ generateVehicleResp  │
       │                                   │                      │
       │                                   │ Prompt:              │
       │                                   │ "Du bist RTW 12/83-1"│
       │                                   │ "Einsatz: Herzinfarkt│
       │                                   │  Patient 65J..."     │
       │                                   │ "Antworte..."        │
       │                                   └──────┬───────────────┘
       │                                          │
       │                                          ▼
       │                                   ┌──────────────────────┐
       │                                   │ Groq AI              │
       │                                   │ Llama 3.3 70B        │
       │                                   │ temp: 0.7            │
       │                                   └──────┬───────────────┘
       │                                          │
       │◄─────────────────────────────────────────┤
       │
       ▼
┌─────────────────────────────────────┐
│ Antwort:                            │
│ "RTW 12/83-1 an Leitstelle,        │
│  FMS 4 am Einsatzort,              │
│  Patient 65J mit Thoraxschmerz,    │
│  beginnen Reanimation, kommen"     │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ addLogEntry()                       │
│                                     │
│ type: 'vehicle_to_dispatch'        │
│ ai_generated: true                 │
│ message: [Antwort]                 │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ RadioUI                             │
│ updateLog()                         │
│                                     │
│ Zeigt Antwort mit:                 │
│ - 🤖 KI-Tag                        │
│ - Farbcodierung (GELB für Fzg)    │
│ - Timestamp                        │
│ - Callsign-Trennung                │
└─────────────────────────────────────┘
```

---

## 🛠️ Technische Details

### Datei-Struktur

```
js/
├── systems/
│   ├── radio-system.js        # Kern-Logik (v1.6.0)
│   ├── radio-groq.js          # KI-Integration
│   └── vehicle-movement.js    # FMS-Updates
├── ui/
│   ├── radio-ui.js            # Benutzeroberfläche (v1.3.0)
│   └── ui.js                  # Einsatz-Tab
├── data/
│   ├── radio-config.json      # Kanal + Trigger Config
│   └── fms-codes.json         # FMS-Definitionen
└── core/
    ├── main.js                # Init-System
    └── config.js              # FMS_STATUS Config
```

---

### Initialisierungs-Reihenfolge

```javascript
// 1. DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    
    // 2. Main.js initialisiert RadioSystem
    if (typeof RadioSystem !== 'undefined') {
        await RadioSystem.initialize();
        // → Lädt Configs, installiert FMS-Listener
    }
    
    // 3. RadioSystem feuert Event
    window.dispatchEvent(new CustomEvent('radioSystemReady', {
        detail: { version: '1.6.0' }
    }));
    
    // 4. RadioUI lauscht und initialisiert
    window.addEventListener('radioSystemReady', () => {
        if (typeof RadioUI !== 'undefined') {
            RadioUI.initialize();
            // → Erstellt UI, bindet Events
        }
    });
});
```

---

### Wichtige Variablen

**RadioSystem:**
```javascript
{
    config: Object,                    // Konfiguration
    log: Array,                        // Funkprotokoll (max 100)
    queue: Array,                      // Warteschlange
    channels: Object,                  // Kanäle
    fmsData: Object,                   // FMS-Codes
    lastDispatchMessages: Object,      // Letzte Nachrichten pro Fahrzeug
    fmsListenerInstalled: boolean,     // FMS-Listener aktiv?
    logCleanupInterval: Number         // Cleanup-Timer
}
```

**RadioUI:**
```javascript
{
    container: HTMLElement,            // Haupt-Container
    logContainer: HTMLElement,         // Protokoll-Container
    queueContainer: HTMLElement,       // Warteschlangen-Container
    currentChannel: String,            // Aktueller Kanal
    isMinimized: boolean,              // Minimiert?
    isDragging: boolean,               // Wird gedraggt?
    logUpdateScheduled: boolean,       // Debounce-Flag
    LOG_UPDATE_DEBOUNCE_MS: 100       // Debounce-Zeit
}
```

---

### Performance-Optimierungen

1. **Icon-Caching** (map.js)
   - 90% weniger SVG-Generierung
   - Icons werden beim Start gecacht
   - Wiederverwendung bei jedem Marker-Update

2. **Debounced UI-Updates** (radio-ui.js)
   - Max. 1 Update pro 100ms
   - Verhindert UI-Freeze bei vielen Log-Einträgen

3. **Auto-Cleanup** (radio-system.js)
   - Alle 60 Sekunden
   - Max. 100 Log-Einträge
   - Verhindert Memory-Leaks

4. **Smart Update Loop** (vehicle-movement.js)
   - Läuft nur wenn Fahrzeuge fahren
   - Schläft bei Idle
   - -30% CPU idle, -10% active

---

### API-Integration (Groq AI)

**Endpoint:**
```
POST https://api.groq.com/openai/v1/chat/completions
```

**Modell:**
```
llama-3.3-70b-versatile
```

**Parameter:**
```javascript
{
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 250,
    messages: [
        { role: 'system', content: 'Du bist ein Rettungssanitäter...' },
        { role: 'user', content: 'Melde dich bei Leitstelle...' }
    ]
}
```

**Error-Handling:**
- Retry bei 429 (Rate Limit)
- Timeout nach 10 Sekunden
- Fallback bei allen Fehlern

---

## 🐛 Troubleshooting

### Problem: Funksprüche werden nicht angezeigt

**Lösung:**
1. Prüfe ob RadioUI initialisiert ist:
   ```javascript
   console.log(typeof RadioUI); // sollte "object" sein
   ```

2. Prüfe RadioSystem:
   ```javascript
   console.log(RadioSystem.log.length); // Einträge vorhanden?
   ```

3. Prüfe Event-Listener:
   ```javascript
   window.dispatchEvent(new CustomEvent('radioSystemReady'));
   ```

---

### Problem: KI-Antworten funktionieren nicht

**Lösung:**
1. Prüfe API-Key:
   ```javascript
   console.log(localStorage.getItem('groqApiKey')); // Key vorhanden?
   ```

2. Prüfe RadioGroq:
   ```javascript
   console.log(typeof RadioGroq); // sollte "object" sein
   ```

3. Teste Fallback:
   ```javascript
   const response = RadioSystem.generateFallbackResponse(vehicle, 'sprechwunsch');
   console.log(response);
   ```

---

### Problem: FMS-Status wird nicht aktualisiert

**Lösung:**
1. Prüfe `vehicle.currentStatus`:
   ```javascript
   const vehicle = GAME_DATA.vehicles[0];
   console.log(vehicle.currentStatus); // Zahl zwischen 1-9?
   ```

2. Prüfe `setVehicleStatus`:
   ```javascript
   VehicleMovement.setVehicleStatus(vehicle, 3);
   console.log(vehicle.currentStatus); // sollte 3 sein
   ```

3. Prüfe CONFIG:
   ```javascript
   console.log(CONFIG.FMS_STATUS[3]); // sollte Object sein
   ```

---

### Problem: "Ende" wird nicht erkannt

**Lösung:**
1. Teste Funktion:
   ```javascript
   RadioSystem.endsWithEnde("Test, Ende"); // sollte true sein
   ```

2. Prüfe Nachricht:
   ```javascript
   const msg = "Fahrt Krankenhaus an, Ende";
   console.log(RadioSystem.endsWithEnde(msg)); // true?
   ```

3. Deaktiviere temporär:
   ```javascript
   // In sendDispatchMessage() auskommentieren:
   // if (this.endsWithEnde(message)) return;
   ```

---

### Problem: UI ist nicht draggable

**Lösung:**
1. Prüfe Container:
   ```javascript
   console.log(document.getElementById('radio-panel')); // vorhanden?
   ```

2. Prüfe Drag-Events:
   ```javascript
   const header = document.querySelector('.radio-header');
   console.log(header); // sollte Element sein
   ```

3. Position zurücksetzen:
   ```javascript
   localStorage.removeItem('radioPanelPosition');
   location.reload();
   ```

---

### Problem: Memory-Leak im Log

**Lösung:**
1. Prüfe Log-Größe:
   ```javascript
   console.log(RadioSystem.log.length); // > 100?
   ```

2. Manuelles Cleanup:
   ```javascript
   RadioSystem.clearLog();
   ```

3. Restart Cleanup:
   ```javascript
   RadioSystem.startLogCleanup();
   ```

---

## 📌 Best Practices

### ✅ DO's

- **Nutze `vehicle.currentStatus`** statt `vehicle.status`
- **Prüfe auf `undefined`** vor Zugriff auf `GAME_DATA`
- **Escape User-Inputs** mit `textContent` statt `innerHTML`
- **Nutze Fallbacks** für Config-Fehler
- **Debounce UI-Updates** bei vielen Änderungen
- **Cache wiederverwendbare Daten** (z.B. Icons)
- **Cleanup Timer** bei Component-Destroy

### ❌ DON'Ts

- **Schreibe NICHT direkt** in `GAME_DATA.vehicles[].currentStatus`
- **Nutze KEINE `innerHTML`** für User-Content
- **Erstelle KEINE Icons** in Update-Loops
- **Binde KEINE Events** mehrfach
- **Vergiss NICHT** `clearInterval()` bei Cleanup
- **Nutze KEINE alten Status-Felder** (`vehicle.status`)
- **Trigger NICHT** `updateVehicleList()` bei jedem Tick

---

## 🎓 Code-Beispiele

### Beispiel 1: Manueller Funkspruch senden

```javascript
// Wähle Fahrzeug
const vehicle = GAME_DATA.vehicles.find(v => v.callsign === 'RTW 12/83-1');

// Sende Nachricht
await RadioSystem.sendDispatchMessage(
    vehicle.id, 
    "Status? Kommen"
);

// Erwartete Antwort (KI):
// "RTW 12/83-1 an Leitstelle, FMS 4 am Einsatzort, 
//  Patient wird versorgt, kommen"
```

---

### Beispiel 2: Fahrzeug zur Queue hinzufügen

```javascript
const vehicle = GAME_DATA.vehicles[0];

// Manuell zur Queue
RadioSystem.addToQueue(vehicle, 'high', 'sprechwunsch_priorisiert');

// Sprecherlaubnis erteilen
await RadioSystem.grantSpeakPermission(vehicle.id);

// → Fahrzeug sendet automatisch Funkspruch
```

---

### Beispiel 3: FMS-Status manuell setzen

```javascript
const vehicle = GAME_DATA.vehicles[0];

// Setze Status
VehicleMovement.setVehicleStatus(vehicle, 4); // Am Einsatzort

// Prüfe Update
console.log(vehicle.currentStatus); // 4

// UI wird automatisch aktualisiert!
```

---

### Beispiel 4: Sammelruf senden

```javascript
// An alle Rettungsdienst-Fahrzeuge
RadioSystem.sendBroadcast(
    'rettungsdienst',
    'Achtung alle RTW, Großschadenlage A81, mehrere Verletzte'
);

// Alle RTW/NEF/KTW quittieren automatisch:
// "RTW 12/83-1 von Leitstelle, verstanden, Ende"
// "NEF 1/83-1 von Leitstelle, verstanden, Ende"
```

---

### Beispiel 5: Log exportieren

```javascript
// Export als JSON
RadioSystem.exportLog();

// Download-Datei: funkprotokoll_2026-01-30.json
/*
[
  {
    "timestamp": "2026-01-30T19:30:00.000Z",
    "type": "vehicle_to_dispatch",
    "vehicle": "RTW 12/83-1",
    "message": "RTW 12/83-1 an Leitstelle, FMS 4, kommen",
    "direction": "vehicle_to_dispatch"
  }
]
*/
```

---

## 📝 Changelog

### v1.6.0 (30.01.2026)
- ✅ **FUNKDISZIPLIN:** "Ende"-Erkennung stoppt Auto-Antworten
- ✅ Erkennt: `"Ende"`, `"ende"`, `"ENDE"`, `"Ende."`, `"Aus"`
- ✅ Funktion: `endsWithEnde(message)`

### v1.5.0 (29.01.2026)
- ✅ Auto-Init entfernt (wird von main.js aufgerufen)
- ✅ `radioSystemReady` Event für zuverlässige Init
- ✅ Fallback-Config ohne JSON-Dateien

### v1.4.0 (28.01.2026)
- ✅ Fallback-Konfigurationen
- ✅ Funktioniert ohne externe JSON
- ✅ Robuste Error-Handling

### v1.3.0 (27.01.2026)
- ✅ **Visuelle Funkspruch-Trennung**
- ✅ Callsign: FETT + GELB + UPPERCASE
- ✅ Funkspruch: Hellblau
- ✅ Trennzeichen: →

### v1.2.0 (26.01.2026)
- ✅ GAME_DATA Safety Checks
- ✅ Memory Leak Prevention
- ✅ Auto-Cleanup System

### v1.1.0 (25.01.2026)
- ✅ FMS-Listener wartet auf VehicleMovement
- ✅ Robuste Init-Strategie

### v1.0.0 (24.01.2026)
- ✅ Initiales Release
- ✅ Grundfunktionen
- ✅ KI-Integration

---

## 📞 Support

**Bei Problemen:**
1. Console-Logs prüfen (`F12`)
2. Version prüfen: `console.log(RadioSystem.version)`
3. Troubleshooting-Sektion checken
4. Issue auf GitHub erstellen

---

## 📄 Lizenz

Dispatcher Simulator - Internes Projekt

---

**Letztes Update:** 30.01.2026, 20:56 Uhr  
**Version:** RadioSystem v1.6.0 + RadioUI v1.3.0
