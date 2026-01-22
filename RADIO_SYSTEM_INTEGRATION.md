# Fahrzeug-Funksystem Integration - Anleitung

## Übersicht

Das neue intelligente Fahrzeug-Funksystem ermöglicht kontextabhängige Kommunikation mit Einsätzen mit Groq-KI-Integration.

## Neue Dateien

### 1. `js/systems/radio-system.js`
✅ **Bereits erstellt** - Kern des intelligenten Funksystems

**Features:**
- Kontextabhängige Fahrzeugantworten
- Groq API Integration für natürliche Dialoge
- Automatische Status-Updates
- Conversation History pro Fahrzeug
- Schnellantworten für Standard-Funksprüche

### 2. `js/ui/ui-radio.js`
✅ **Bereits erstellt** - UI-Funktionen für Funkkommunikation

**Features:**
- Fahrzeug-Dropdown Management
- Funkspruch-Eingabe und -Anzeige
- Integration mit radio-system.js
- Farbcodierte Nachrichten

## Integration in index.html

### Schritt 1: Skripte hinzufügen

Füge folgende Zeilen in der **🔴 SYSTEMS** Sektion der `index.html` hinzu (nach `call-system.js`):

```html
<!-- 🔴 SYSTEMS -->
<script src="js/systems/weather-system.js?v=5.0.0"></script>
<script src="js/systems/ai-incident-generator.js?v=5.0.0"></script>
<script src="js/systems/mission-timer.js?v=5.0.0"></script>
<script src="js/systems/escalation-system.js?v=5.0.0"></script>
<script src="js/systems/groq-validator.js?v=5.0.0"></script>
<script src="js/systems/call-system.js?v=5.0.0"></script>
<script src="js/systems/radio-system.js?v=5.0.0"></script>  <!-- ⭐ NEU -->
<script src="js/systems/vehicle-movement.js?v=5.0.0"></script>
```

### Schritt 2: UI-Radio Skript hinzufügen

Füge in der **🟡 UI** Sektion hinzu (nach `ui-helpers.js`):

```html
<!-- 🟡 UI -->
<script src="js/ui/ui-helpers.js?v=5.0.0"></script>
<script src="js/ui/ui-radio.js?v=5.0.0"></script>  <!-- ⭐ NEU -->
<script src="js/ui/keywords-dropdown.js?v=5.0.0"></script>
<!-- ... rest ... -->
```

## Verwendung

### Für Spieler

1. **Fahrzeug auswählen**: Im "Funkverkehr"-Tab aus Dropdown wählen
2. **Nachricht eingeben**: Funkspruch in Textfeld eingeben
3. **Senden**: Enter oder Button klicken
4. **Antwort erhalten**: Fahrzeug antwortet nach 0.8-1.4 Sekunden

### Beispiel-Funksprüche

**Status-Anfragen:**
- "Status melden"
- "Rückmeldung?"
- "Wie ist der Status?"

**ETA-Anfragen:**
- "ETA?"
- "Wie lange noch?"
- "Wann Ankunft?"

**Befehle:**
- "Fahren Sie zum Einsatzort"
- "Kehren Sie zur Wache zurück"
- "Warten Sie ab"

**Lage-Anfragen:**
- "Wie ist die Lage?"
- "Was ist die Situation?"
- "Lage vor Ort?"

## Automatische Status-Updates

Das System sendet automatisch Funkmeldungen bei Statusänderungen:

- **Status 4**: "[Rufzeichen], ausgerückt, fahren zu [Adresse], kommen."
- **Status 6**: "[Rufzeichen], vor Ort, beginnen mit Versorgung, kommen."
- **Status 7**: "[Rufzeichen], Patient aufgenommen, fahren ins [Krankenhaus], kommen."
- **Status 1**: "[Rufzeichen], zurück auf Wache, einsatzbereit, kommen."

## Integration in Game Logic

### Aufruf bei Statusänderungen

In `js/systems/vehicle-movement.js` oder wo Fahrzeugstatus geändert wird:

```javascript
function updateVehicleStatus(vehicleId, newStatus) {
    const vehicle = game.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;
    
    const incident = game.incidents.find(i => 
        i.assignedVehicles && i.assignedVehicles.includes(vehicleId)
    );
    
    vehicle.status = newStatus;
    
    // ⭐ Automatische Funkmeldung
    if (typeof radioSystem !== 'undefined') {
        radioSystem.sendAutoStatusUpdate(vehicle, newStatus, incident);
    }
    
    updateMap();
}
```

### Dropdown-Update bei Game-Loop

In `js/core/main.js` im Game-Loop:

```javascript
function gameLoop() {
    // ... existing code ...
    
    // Update Radio-Dropdown (entfernt Fahrzeuge mit Status 2)
    if (typeof updateRadioVehicleDropdown === 'function') {
        updateRadioVehicleDropdown();
    }
    
    // ... rest ...
}
```

## Groq API Konfiguration

Das System verwendet die gleiche Groq API wie das Telefonsystem:

- **API URL**: Aus `CONFIG.GROQ_API_URL`
- **Model**: Aus `CONFIG.GROQ_MODEL`
- **API Key**: Aus `game.apiKey` (gespeichert in Settings)

### Prompt-Struktur

```javascript
Systemprompt:
- Rufzeichen und Fahrzeugtyp
- Aktueller Status ("Anfahrt", "vor Ort", etc.)
- Einsatzinfos (falls zugewiesen)
- Funksprache-Regeln

User-Nachricht:
- Funkspruch vom Disponenten

Conversation History:
- Letzte 6 Nachrichten für Kontext
```

## Fehlerbehandlung

### Fallback ohne KI

Wenn Groq API nicht verfügbar:
- System verwendet vordefinierte Schnellantworten
- Fallback-Responses: "Verstanden, kommen", "Affirmativ, kommen", etc.

### Validierung

- Prüfung ob Fahrzeug ausgewählt
- Prüfung ob Nachricht nicht leer
- Prüfung ob Fahrzeug nicht Status 2 (Sprechwunsch)

## Styling

### Farbcodierung

- **Leitstelle**: Blau (`#17a2b8`)
- **Fahrzeug (Antwort)**: Grün (`#28a745`)
- **Fahrzeug (Auto)**: Gelb (`#ffc107`)
- **Fehler**: Rot (`#dc3545`)

### Message-Format

```
[12:34:56] 👨‍💻 Leitstelle: An Florian 1-44-1: Status melden
[12:34:57] 🚑 Florian 1-44-1: Kommen, Status 6 - Vor Ort im Einsatz
```

## Testing

### Testschritte

1. **Fahrzeug alarmieren**: Einsatz erstellen und Fahrzeug zuweisen
2. **Funkverkehr-Tab öffnen**: Fahrzeug sollte im Dropdown erscheinen
3. **Fahrzeug wählen**: Aus Dropdown auswählen
4. **Funkspruch senden**: "Status melden" eingeben und senden
5. **Antwort prüfen**: Nach 0.8-1.4s sollte Fahrzeug antworten
6. **Status ändern**: Fahrzeug manuell zu Status 6 setzen
7. **Auto-Update prüfen**: Automatische Funkmeldung sollte erscheinen

### Debug-Logs

Konsole prüfen:
```
📻 Fahrzeug ausgewählt: Florian 1-44-1
📻 Funkspruch an Florian 1-44-1 gesendet
✅ UI Radio System v2.0 geladen
```

## Troubleshooting

### Problem: Dropdown leer
**Lösung**: Prüfe ob Fahrzeuge `owned: true` haben und nicht Status 2

### Problem: Keine Antwort
**Lösung**: 
1. Groq API Key prüfen
2. Console auf Fehler prüfen
3. Fallback sollte funktionieren

### Problem: Fahrzeug verschwindet aus Dropdown
**Lösung**: Normal bei Status 2 (Sprechwunsch) - das ist Absicht

## Nächste Schritte (Optional)

### Erweiterungen

1. **Spracherkennung**: Web Speech API für Spracheingabe
2. **Audio-Ausgabe**: Text-to-Speech für Fahrzeugantworten
3. **Mehrfach-Auswahl**: Funkspruch an mehrere Fahrzeuge gleichzeitig
4. **Funkrufnamen**: Zusätzliche Rufnamen ("Alle RTWs", "Alle NEFs")
5. **Funkgruppen**: Vordefinierte Gruppen ("Zug 1", "Löschzug")

### Performance-Optimierung

- Rate Limiting für API-Calls
- Caching häufiger Antworten
- Batch-Processing bei mehreren Anfragen

## Changelog

### v1.0 (22.01.2026)
- ✅ Initiale Implementierung
- ✅ Groq API Integration
- ✅ Kontextabhängige Antworten
- ✅ Automatische Status-Updates
- ✅ Fahrzeug-Dropdown mit Filter
- ✅ Conversation History
- ✅ Fallback ohne KI

---

**Entwickelt für:** ILS Waiblingen - Dispatcher Simulator v5.0.0  
**Datum:** 22.01.2026  
**Autor:** AI Assistant