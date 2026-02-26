# 📡 Radio-System Dokumentation

## Übersicht

Das Radio-System ist ein vollwertiges Funksystem mit KI-Integration für realistische Leitstellensimulation. Es ermöglicht bidirektionalen Funkverkehr zwischen Leitstelle und Fahrzeugen mit automatischen FMS-Status-Meldungen und KI-generierten Fahrzeug-Antworten.

---

## 🎯 Features

### 1. **Automatische FMS-Status-Meldungen**
- 🔄 Alle FMS-Statusänderungen werden automatisch im Funk protokolliert
- 📡 Integration mit `VehicleMovement.setVehicleStatus()`
- 🎯 Konfigurierbare Trigger für Status-basierte Aktionen

### 2. **Warteschlangen-System**
- 📥 Fahrzeuge können Sprechwünsche anmelden (FMS-Status 5)
- ⏫ Prioritäts-basierte Warteschlange (niedrig, normal, hoch)
- 🕔 Automatische Sortierung nach Priorität und Zeit

### 3. **KI-Integration (GroqAI)**
- 🤖 Realistische Fahrzeug-Antworten basierend auf Kontext
- 💬 Berücksichtigt Einsatzinformationen, Position, Status
- ⚙️ Fallback zu Standardantworten wenn KI nicht verfügbar

### 4. **Mehrkanalig**
- 📻 **Rettungsdienst** (RTW, NEF, KTW)
- 🚒 **Katastrophenschutz** (GW-San, Kdow)
- 📞 **Gemeinsamer Kanal** (alle Fahrzeuge)

### 5. **Funkprotokoll**
- 📋 Vollständiges Protokoll aller Funksprüche
- 🔍 Filterung nach Kanal, Fahrzeug, Typ
- 💾 Export als JSON
- 🗑️ Löschen-Funktion

---

## 📂 Dateistruktur

```
Dispatcher-Simulator/
├── js/
│   ├── data/
│   │   ├── radio-config.json      # Konfiguration (Kanäle, Trigger, Prioritäten)
│   │   └── fms-codes.json         # FMS-Code Definitionen
│   ├── systems/
│   │   └── radio-system.js        # Haupt-Logik
│   ├── ui/
│   │   └── radio-panel.js         # UI-Komponente
│   └── utils/
│       └── radio-groq.js          # GroqAI-Integration
├── css/
│   └── radio-panel.css          # Styling
└── docs/
    └── RADIO_SYSTEM.md          # Diese Dokumentation
```

---

## 🔧 Technische Details

### Initialisierung

Das Radio-System wird automatisch beim Laden initialisiert:

```javascript
// Auto-Initialize in radio-system.js
window.addEventListener('DOMContentLoaded', async () => {
    await RadioSystem.initialize();
});
```

**Ablauf:**
1. Lade `radio-config.json`
2. Lade `fms-codes.json`
3. Initialisiere Kanäle
4. Installiere FMS-Listener (wartet auf `VehicleMovement`)
5. RadioUI wird initialisiert

---

### FMS-Integration

Das System hookt sich in `VehicleMovement.setVehicleStatus()` ein:

```javascript
// Beispiel: FMS-Statuswechsel
VehicleMovement.setVehicleStatus(vehicle, 4); // "Am Einsatzort"

// Automatisch:
// 1. RadioSystem.handleFMSStatusChange() wird aufgerufen
// 2. Statusänderung wird im Log angezeigt
// 3. Trigger aus radio-config.json werden ausgewertet
// 4. Ggf. Fahrzeug zur Warteschlange hinzugefügt
```

---

### FMS-Trigger Konfiguration

**radio-config.json:**
```json
{
  "fms_triggers": {
    "3": {
      "action": "none",
      "description": "Ausgrückt (automatisch)"
    },
    "4": {
      "action": "optional_message",
      "manual_trigger": "lagemeldung",
      "description": "Am Einsatzort (Lagemeldung optional)"
    },
    "5": {
      "action": "add_to_queue",
      "priority": "normal",
      "reason": "sprechwunsch",
      "description": "Sprechwunsch"
    },
    "7": {
      "action": "optional_message",
      "manual_trigger": "transportziel_anfrage",
      "description": "Patient aufgenommen (Transportziel optional)"
    }
  }
}
```

**Aktionen:**
- `none`: Nur Status-Anzeige
- `add_to_queue`: Fahrzeug zur Warteschlange hinzufügen
- `optional_message`: Zeigt manuellen Button im UI

---

### Warteschlangen-System

**Prioritäten:**
```json
{
  "priority_levels": {
    "low": { "name": "Niedrig", "icon": "🟢", "weight": 30 },
    "normal": { "name": "Normal", "icon": "🟡", "weight": 50 },
    "high": { "name": "Hoch", "icon": "🔴", "weight": 80 }
  }
}
```

**Sortierung:**
1. Nach `weight` (höher = wichtiger)
2. Bei gleichem `weight` nach `timestamp` (älter = wichtiger)

**Code-Beispiel:**
```javascript
// Fahrzeug zur Queue hinzufügen
RadioSystem.addToQueue(vehicle, 'high', 'sprechwunsch_priorisiert');

// Sprecherlaubnis erteilen
RadioSystem.grantSpeakPermission(vehicleId);
```

---

### GroqAI-Integration

**Aktivierung:**
Groq API Key in den Einstellungen hinterlegen (kostenlos bei [console.groq.com](https://console.groq.com/keys))

**Funktionsweise:**
```javascript
// radio-groq.js
const response = await RadioGroq.generateVehicleResponse(vehicle, {
    reason: 'sprechwunsch',
    incident: incidentObject,
    lastDispatchMessage: 'Fahren Sie zur Einsatzstelle',
    fmsCode: 3
});
```

**Kontext für KI:**
- Fahrzeug-Rufzeichen (z.B. "Florian Waiblingen 44-1")
- Aktueller FMS-Status
- Einsatzinformationen (Stichwort, Adresse, Patient)
- Letzte Leitstellen-Nachricht
- Grund für Funkspruch

**Beispiel-Antworten:**
- 👨‍🚒 `"Florian Waiblingen 44-1, sind am Einsatzort, eine Person bewusstlos, Vitalfunktionen werden überprüft, NEF angefordert"`
- 🚑 `"RTW 71-83-1, Patient ist ansprechbar, stabile Vitalzeichen, Transport ins Rems-Murr-Klinikum Winnenden geplant"`

**Fallback:**
Wenn KI nicht verfügbar:
```javascript
// Standardantworten aus radio-system.js
const fallbackResponses = {
    'sprechwunsch': `${vehicle.callsign} von Leitstelle, verstanden, Ende`,
    'lagemeldung': `${vehicle.callsign}, Lage unverändert, Patient wird versorgt, Ende`,
    'transportziel_anfrage': `${vehicle.callsign}, bitte Transportziel durchgeben`
};
```

---

## 💻 API-Referenz

### RadioSystem

#### `initialize()`
Initialisiert das Radio-System.
```javascript
await RadioSystem.initialize();
```

#### `sendDispatchMessage(vehicleId, message)`
Sendet Funkspruch von Leitstelle an Fahrzeug.
```javascript
await RadioSystem.sendDispatchMessage('vehicle_001', 'Fahren Sie zur Einsatzstelle');
```

#### `addToQueue(vehicle, priority, reason)`
Fügt Fahrzeug zur Warteschlange hinzu.
```javascript
RadioSystem.addToQueue(vehicle, 'high', 'sprechwunsch');
```

#### `grantSpeakPermission(vehicleId)`
Erteilt Sprecherlaubnis aus Warteschlange.
```javascript
await RadioSystem.grantSpeakPermission('vehicle_001');
```

#### `sendBroadcast(channel, message)`
Sendet Sammelruf an Kanal.
```javascript
RadioSystem.sendBroadcast('rettungsdienst', 'Achtung alle Einheiten, Unwetterwarnung!');
```

#### `getLog(filter)`
Gibt Funkprotokoll zurück (optional gefiltert).
```javascript
const log = RadioSystem.getLog({ 
    channel: 'rettungsdienst',
    vehicleId: 'vehicle_001',
    type: 'vehicle_to_dispatch'
});
```

#### `clearLog()`
Löscht Funkprotokoll.
```javascript
RadioSystem.clearLog();
```

#### `exportLog()`
Exportiert Funkprotokoll als JSON.
```javascript
RadioSystem.exportLog();
```

---

### RadioUI

#### `updateQueue()`
Aktualisiert Warteschlangen-UI.
```javascript
RadioUI.updateQueue();
```

#### `updateLog()`
Aktualisiert Funkprotokoll-UI.
```javascript
RadioUI.updateLog();
```

#### `switchChannel(channel)`
Wechselt Funkkanal.
```javascript
RadioUI.switchChannel('katastrophenschutz');
```

#### `togglePanel()`
Zeigt/Versteckt Radio-Panel.
```javascript
RadioUI.togglePanel();
```

---

## 🎮 Benutzerführung

### 1. **Funkprotokoll ansehen**
- Panel rechts unten auf der Karte
- Zeigt alle Funksprüche und Statusänderungen
- Neueste zuerst

### 2. **Kanal wechseln**
- Kanal-Buttons oben im Panel
- Filter zeigt nur relevante Fahrzeuge

### 3. **Sprecherlaubnis erteilen**
- Warteschlange wird automatisch angezeigt
- Button "Sprecherlaubnis erteilen" klicken
- KI generiert Fahrzeug-Antwort

### 4. **Nachricht senden**
- Fahrzeug auswählen
- Nachricht eingeben
- "Senden" klicken (oder Strg+Enter)
- KI generiert automatisch Antwort

### 5. **Manuelle Meldung anfordern**
- Bei FMS 4/7 erscheinen Buttons
- "Lagemeldung anfordern" / "Transportziel anfragen"
- KI generiert kontextbezogene Antwort

---

## 🔍 Debugging

### Console-Logs

```javascript
// Alle Radio-Events werden geloggt:
📡 Radio System v1.1.0 initialisiert
✅ Radio-Config geladen
✅ FMS-Daten geladen
✅ FMS-Listener erfolgreich installiert
📻 FMS-Change: Florian Waiblingen 44-1 2 → 3
📥 Florian Waiblingen 44-1 zur Warteschlange hinzugefügt (normal)
🗣️ Sprecherlaubnis erteilt: Florian Waiblingen 44-1
🤖 Generiere Fahrzeug-Antwort für Florian Waiblingen 44-1...
✅ Fahrzeug-Antwort: "Florian Waiblingen 44-1, ..."
```

### Fehlerbehandlung

**Problem: FMS-Listener nicht installiert**
```
❌ VehicleMovement nicht gefunden - FMS-Integration fehlgeschlagen!
```
**Lösung:** Prüfe Ladereihenfolge in `version-config.js` (`radio-system.js` NACH `vehicle-movement.js`)

**Problem: GroqAI Fehler**
```
❌ Groq AI Fehler: API Error 401: Invalid API Key
```
**Lösung:** Prüfe API Key in Einstellungen

**Problem: Radio-Config nicht geladen**
```
❌ Fehler beim Laden der Radio-Config: 404
```
**Lösung:** Prüfe ob `js/data/radio-config.json` existiert

---

## ⚙️ Konfiguration

### radio-config.json anpassen

**Neue Priorität hinzufügen:**
```json
"priority_levels": {
  "critical": {
    "name": "Kritisch",
    "icon": "⚠️",
    "weight": 100
  }
}
```

**Neuen FMS-Trigger hinzufügen:**
```json
"fms_triggers": {
  "9": {
    "action": "add_to_queue",
    "priority": "high",
    "reason": "sonderfall",
    "description": "Sonderfall"
  }
}
```

**Neuen Kanal hinzufügen:**
```json
"channels": {
  "feuerwehr": {
    "name": "Feuerwehr",
    "icon": "🚒",
    "vehicle_types": ["LF", "DLK"],
    "frequency": "169.65"
  }
}
```

---

## 🐛 Bekannte Probleme

1. **Performance bei vielen Fahrzeugen**
   - Bei >50 Fahrzeugen kann Log langsam werden
   - Lösung: `max_log_entries` in Config reduzieren

2. **GroqAI Rate Limits**
   - Kostenlose API hat Limits
   - Lösung: Fallback-Antworten werden automatisch verwendet

3. **FMS-Listener Timing**
   - In seltenen Fällen installiert sich Listener zu spät
   - Lösung: Seite neu laden

---

## 🚀 Zukünftige Erweiterungen

### Geplant für v9.1.0
- [ ] 🎯 Interaktive Fahrzeug-Kontrolle über Funk
- [ ] 📣 Audio-Unterstützung (Text-to-Speech)
- [ ] 📊 Statistiken über Funkverkehr
- [ ] 🗓️ Zeitgesteuerte Sammelrufe

### Ideen für später
- [ ] 🎮 Multiplayer-Funk (mehrere Disponenten)
- [ ] 🔊 Geräuschkulisse (Sirenen, Funkrauschen)
- [ ] 📝 Vorlagen für häufige Funksprüche
- [ ] 📱 Mobile-Ansicht optimieren

---

## 📝 Changelog

### v1.1.0 (2026-01-29)
- 🔧 FMS-Listener wartet jetzt auf VehicleMovement
- ✅ Fallback-Antworten wenn KI nicht verfügbar
- 🐛 Fixes für Edge-Cases

### v1.0.0 (2026-01-29)
- 🎉 Initiales Release
- 📡 Vollwertiges Funksystem
- 🤖 GroqAI-Integration
- 📥 Warteschlangen-System
- 📋 Funkprotokoll

---

## 📚 Weitere Ressourcen

- [FMS-Codes Dokumentation](https://de.wikipedia.org/wiki/Funkmeldesystem)
- [GroqAI API Docs](https://console.groq.com/docs)
- [Dispatcher Simulator GitHub](https://github.com/Polizei1234/Dispatcher-Simulator)

---

**Erstellt:** 29.01.2026  
**Version:** 1.0  
**Autor:** Dispatcher Simulator Team