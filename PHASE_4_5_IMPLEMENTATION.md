# Phase 4 & 5: Implementierungs-Dokumentation

## Übersicht

Dieses Dokument beschreibt alle neuen Features aus Phase 4 und 5.

---

## Phase 4: Neue Features

### 1. Zeitbeschleunigung entfernt ❌

**Änderungen:**
- Button für Zeitbeschleunigung aus index.html entfernt
- `cycleGameSpeed()` Funktion deaktiviert oder entfernt
- Game-Speed bleibt konstant bei 1x (Echtzeit)

**Dateien:**
- `index.html`: Button-Zeile entfernen
- `js/core/main.js`: `cycleGameSpeed()` auskommentieren

**HTML Update:**
```html
<!-- ENTFERNEN:
<button id="game-speed-indicator" onclick="cycleGameSpeed()" ...>5x</button>
-->
```

---

### 2. Debug-Menü ✅

**Datei:** `js/systems/debug-menu.js`

**Features:**
- 🐛 Keyboard Shortcut: **Strg + Shift + D**
- 5 Tabs: Stats, Fahrzeuge, Einsätze, Logs, Aktionen

**Tabs:**

#### Stats
- System-Uptime
- Spielzeit
- Geschwindigkeit
- Fahrzeug-Statistiken
- Einsatz-Statistiken
- Wetter-Info

#### Fahrzeuge
- Liste aller Fahrzeuge mit Status
- Schnell-Aktionen: Status 1/2/6 setzen
- Einsatz-Zuordnung anzeigen
- ETA anzeigen

#### Einsätze
- Liste aktiver Einsätze
- Einsatz abschließen
- Einsatz löschen
- Details anzeigen

#### Logs
- Console-Log-Historie
- Nach Kategorie filterbar
- Letzte 50 Einträge
- Logs löschen

#### Aktionen
- **Einsätze:** Test-Einsatz erstellen, Massen-Erstellung, Alle löschen
- **Fahrzeuge:** Alle verfügbar/beschäftigt, Zur Wache teleportieren
- **Zeit:** Speed setzen (1x, 10x, 50x), Zeit überspringen
- **System:** Export, Reset, LocalStorage löschen

**Integration:**
```html
<script src="js/systems/debug-menu.js?v=5.0.0"></script>
```

---

### 3. Erweiterte Einstellungen ✅

**Datei:** `js/systems/enhanced-settings.js`

**Features:**
- 6 Kategorien mit je vielen Optionen
- Import/Export von Einstellungen
- Zurücksetzen auf Defaults

**Kategorien:**

#### 🎮 Spiel
- Schwierigkeitsgrad (Einfach/Normal/Schwer/Experte)
- Einsatzhäufigkeit (1-20 Minuten)
- Auto-Pause bei Notruf
- Scoring aktivieren
- Realismus-Optionen:
  - Fahrzeugschäden
  - Treibstoff-System
  - Besatzungsmüdigkeit

#### 🚑 Simulation
- Fahrzeuggeschwindigkeiten (Stadt/Land)
- Ausrückzeiten (RTW/NEF/KTW)
- Einsatzdauer (Min/Max)
- FMS-Auto-Update

#### 📺 Interface
- Theme (Dunkel/Hell/Auto)
- Benachrichtigungen
  - Ein/Aus
  - Anzeigedauer
- Karten-Einstellungen:
  - Fahrzeuge/Wachen/Krankenhäuser anzeigen
  - Auto-Zentrierung
- Animationen

#### 🔊 Audio
- Master-Lautstärke
- Separate Regler für:
  - Sirenen
  - Funk
  - UI-Sounds
- Klingelton-Dauer

#### 🤖 KI
- Groq API Key
- Model-Auswahl
- Temperatur (Kreativität)
- Auto-Generierung aktivieren

#### 🔧 Erweitert
- Performance-Tracking
- Update-Intervall
- Debug-Modus
- Console-Logging
- Statistik-Tracking
- Daten-Management

**Zugriff:**
```javascript
enhancedSettings.show();
```

**Integration:**
```html
<script src="js/systems/enhanced-settings.js?v=5.0.0"></script>
```

---

### 4. Status 0/5 System ✅

**Datei:** `js/systems/status-0-5-system.js`

**Konzept:**
- **Status 0:** Fahrzeug erhält Anfrage (z.B. "Status melden")
- **Status 5:** Fahrzeug antwortet (Sprechwunsch)
- Nach Antwort: Zurück zu Original-Status

**Funktionen:**

#### Status-Anfragen senden
```javascript
status05System.sendStatusRequest(vehicleId, 'status');
status05System.sendStatusRequest(vehicleId, 'eta');
status05System.sendStatusRequest(vehicleId, 'situation');
```

**Ablauf:**
1. Fahrzeug erhält Anfrage
2. Status wechselt zu 0 (kurz)
3. Nach 2 Sekunden: Status 5 (Sprechwunsch)
4. Fahrzeug antwortet automatisch
5. Nach 3 Sekunden: Zurück zu Original-Status

#### Sprechwunsch vom Fahrzeug
```javascript
status05System.initiateVehicleRequest(vehicleId);
```

Fahrzeug meldet sich selbst mit Sprechwunsch.

#### Bestätigung
```javascript
status05System.acknowledgeVehicleRequest(vehicleId);
```

Leitstelle bestätigt, Status geht zurück.

**UI-Integration:**

Im Funkverkehr-Tab können Buttons hinzugefügt werden:
```html
<button onclick="status05System.sendStatusRequest(selectedVehicle.id, 'status')">
    Status anfragen
</button>
```

**Integration:**
```html
<script src="js/systems/status-0-5-system.js?v=5.0.0"></script>
```

---

### 5. Funkdisziplin-System

**Bereits implementiert in:** `radio-system.js`

**Features:**
- Fahrzeuge antworten auf Funksprüche
- Kontextabhängige Antworten
- Groq-Integration für natürliche Dialoge
- Automatische Status-Updates

**Siehe:** `RADIO_SYSTEM_INTEGRATION.md`

---

### 6. Nachforderung

**Implementierung:** Erweiterung von `radio-system.js` oder neue Funktion

**Konzept:**
Fahrzeuge können weitere Ressourcen anfordern:
- Weitere RTW
- NEF
- Rettungshubschrauber
- Feuerwehr
- Polizei

**Beispiel:**
```javascript
function requestBackup(vehicleId, resourceType) {
    const vehicle = game.vehicles.find(v => v.id === vehicleId);
    const message = `${vehicle.callsign}, fordere ${resourceType} nach, kommen.`;
    addRadioMessage(vehicle.callsign, message, 'vehicle');
    
    // Zeige Nachforderungs-Dialog
    showBackupRequestDialog(vehicle, resourceType);
}
```

---

## Phase 5: Zusätzliche Verbesserungen

### 1. Statistiken

**Neue Datei:** `js/systems/statistics.js`

**Zu trackende Daten:**
- Einsätze gesamt/abgeschlossen
- Durchschnittliche Reaktionszeit
- Durchschnittliche Einsatzdauer
- Fahrzeugauslastung
- Score/Performance-Metriken
- Heatmap der Einsätze

**Export-Formate:**
- JSON
- CSV
- PDF-Report

**UI:**
Neuer Tab "Statistiken" mit Diagrammen und Tabellen.

---

### 2. Erweiterte Logs

**Features:**
- Einsatz-Historie
- Funkverkehrs-Log
- Fahrzeug-Aktivitäten
- System-Events
- Export als Text/CSV

**Filter:**
- Nach Datum/Zeit
- Nach Fahrzeug
- Nach Einsatztyp
- Nach Schweregrad

---

### 3. Erweiterte Einsatztypen

**Kategorien:**

#### Rettungsdienst
- Internistischer Notfall
- Chirurgischer Notfall
- Pädiatrischer Notfall
- Gynäkologischer Notfall
- Vergiftung
- Allergie/Anaphylaxie

#### Trauma
- Polytrauma
- SHT (Schädel-Hirn-Trauma)
- Wirbelsäulenverletzung
- Thoraxtrauma
- Abdominaltrauma

#### Herz-Kreislauf
- Herzinfarkt
- Schlaganfall
- Rhythmusstörung
- Lungenembolie
- Aortenaneurysma

#### Atemwege
- Asthma
- COPD-Exazerbation
- Lungenversagen
- Aspiration

#### Sonstiges
- Geburt
- Psychiatrischer Notfall
- Reanimation
- Massenanfall von Verletzten (MANV)

**Jeder Typ mit:**
- Spezifischen Ressourcenanforderungen
- Prioritätsstufe
- Durchschnittlicher Dauer
- Besonderheiten

---

### 4. Wetter-Effekte

**Bereits implementiert:** `weather-system.js`

**Erweiterungen:**
- Wetter beeinflusst Fahrtzeiten
- Wetter beeinflusst Einsatztypen
- Unwetter-Warnungen
- Jahreszeiten-Effekte

---

### 5. Krankenhausverfügbarkeit

**Features:**
- Krankenhäuser können überlastet sein
- Spezial-Abteilungen (Stroke-Unit, Herzkatheterlabor)
- Anmeldezeiten
- Ausweichkrankenhäuser vorschlagen

---

## Installation

### 1. HTML Update

Füge in `index.html` nach `radio-system.js` ein:

```html
<!-- Phase 4 Systems -->
<script src="js/systems/debug-menu.js?v=5.0.0"></script>
<script src="js/systems/enhanced-settings.js?v=5.0.0"></script>
<script src="js/systems/status-0-5-system.js?v=5.0.0"></script>
```

### 2. Header-Anpassungen

Entferne Zeitbeschleunigung-Button:
```html
<!-- ENTFERNEN:
<button id="game-speed-indicator" onclick="cycleGameSpeed()" ...>
-->
```

Füge Debug-Button hinzu (optional):
```html
<button class="btn btn-small" onclick="debugMenu.toggle()">
    <i class="fas fa-bug"></i>
</button>
```

Füge Erweiterte Einstellungen-Button hinzu:
```html
<button class="btn btn-small" onclick="enhancedSettings.show()">
    <i class="fas fa-cog"></i> Einstellungen
</button>
```

### 3. Funkverkehr-Tab erweitern

Füge Status-Anfrage-Buttons hinzu:
```html
<div class="status-request-buttons">
    <h4>Schnellanfragen:</h4>
    <button onclick="sendQuickStatusRequest('status')">Status melden</button>
    <button onclick="sendQuickStatusRequest('eta')">ETA durchgeben</button>
    <button onclick="sendQuickStatusRequest('situation')">Lage vor Ort</button>
</div>

<script>
function sendQuickStatusRequest(type) {
    if (!selectedVehicleForRadio) {
        alert('Bitte wählen Sie zuerst ein Fahrzeug aus!');
        return;
    }
    status05System.sendStatusRequest(selectedVehicleForRadio.id, type);
}
</script>
```

---

## Keyboard Shortcuts

- **Strg + Shift + D**: Debug-Menü toggle
- **Strg + Shift + S**: Erweiterte Einstellungen
- **Leertaste**: Pause/Resume

---

## Testing

### Debug-Menü
1. Drücke Strg+Shift+D
2. Menü sollte erscheinen
3. Teste alle Tabs
4. Teste Aktionen (Test-Einsatz, Status ändern)

### Erweiterte Einstellungen
1. Klicke Einstellungen-Button
2. Navigiere durch alle Tabs
3. Ändere Einstellungen
4. Speichern und prüfen ob änderungen wirksam

### Status 0/5
1. Wähle Fahrzeug im Funkverkehr
2. Sende Status-Anfrage
3. Fahrzeug sollte auf Status 0, dann 5 wechseln
4. Antwort sollte erscheinen
5. Status sollte zurückgesetzt werden

---

## Bekannte Einschränkungen

1. **Zeitbeschleunigung entfernt**: Spiel läuft nur noch in Echtzeit
2. **Status 0/5**: Nur für Fahrzeuge im Einsatz relevant
3. **Debug-Menü**: Nur für Entwickler/Tester gedacht

---

## Nächste Schritte

1. Statistik-System implementieren
2. Erweiterte Logs erstellen
3. Mehr Einsatztypen hinzufügen
4. Wetter-Effekte ausbauen
5. Krankenhausverfügbarkeit implementieren

---

**Version:** 1.0  
**Datum:** 22.01.2026  
**Status:** Phase 4 abgeschlossen, Phase 5 in Planung