# Unified Status System v1.0

## Überblick

Das **Unified Status System** fusioniert alle bisherigen Status- und Funksysteme zu einem einheitlichen, visuellen System mit farbcodierten Status-Badges und korrekten FMS-Workflows.

---

## 🎯 Hauptfunktionen

### 1️⃣ Visuelle Status-Badges
Alle Statusmeldungen werden als **farbcodierte Kästchen** im Funkfenster angezeigt:

| Status | Farbe | Bedeutung |
|--------|-------|----------|
| **0** | 🟥 Helles Rot (`#ff4444`) | **NOTFALL BESATZUNG** - NUR bei echten Notfällen! |
| **1** | 🟩 Hellgrün (`#90ee90`) | Einsatzbereit über Funk |
| **2** | 🟩 Dunkelgrün (`#006400`) | Einsatzbereit auf Wache |
| **3** | 🟧 Orange (`#ffa500`) | Einsatz übernommen |
| **4** | 🟥 Dunkles Rot (`#8b0000`) | Anfahrt Einsatzstelle |
| **5** | 🟥 Helles Rot (`#ff6666`) | **Sprechwunsch** (alle Anfragen Fahrzeug→Leitstelle) |
| **6** | ⬜ Grau (`#808080`) | Ankunft Einsatzstelle (Vor Ort) |
| **7** | 🟪 Rosa (`#ffb6c1`) | Patient aufgenommen |
| **8** | 🟪 Lila (`#9370db`) | Anfahrt Krankenhaus |
| **C** | ⬛ Dunkelgrau (`#666666`) | Nicht einsatzbereit |

**Status 9** wurde entfernt (nicht verwendet).

---

### 2️⃣ Status-Transitions

**Normale Statuswechsel** werden mit **Alt-Status → Neu-Status** angezeigt:

```
RTW 1/83-1: [2] → [3]  Einsatz übernommen
RTW 1/83-1: [3] → [4]  Anfahrt nach Hauptstraße 42
RTW 1/83-1: [4] → [6]  Vor Ort
```

**Beispiel im Funkfenster:**
- Dunkelgrünes Kästchen `[2]` → Pfeil → Oranges Kästchen `[3]`

---

### 3️⃣ Status 5 Workflow (Sprechwunsch)

Wenn ein Fahrzeug **Status 5** sendet:

1. **NUR das Status-Badge wird angezeigt** (kein Pfeil, kein alter Status)
   ```
   RTW 1/83-1: [5] Sprechwunsch
   ```

2. **"J"-Button erscheint** neben der Nachricht

3. **Spieler klickt "J"** (Sprechfreigabe)
   ```
   Leitstelle: An RTW 1/83-1: J - Kommen, sprechen Sie.
   ```

4. **Fahrzeug spricht** (nach 800ms Verzögerung)
   ```
   RTW 1/83-1: Benötigen Rücksprache zur Zufahrt, kommen.
   ```

5. **Status wird zurückgesetzt** (nach 2 Sekunden)

---

### 4️⃣ Status 0 Workflow (Notfall Besatzung)

**WICHTIG:** Status 0 ist **NUR für echte Notfälle der Besatzung!**
- Unfall des Rettungsfahrzeugs
- Übergriff auf Besatzung
- Medizinischer Notfall der Crew

Workflow identisch zu Status 5:

1. **NUR Status-Badge** (helles Rot, pulsierend)
   ```
   RTW 1/83-1: [0] NOTFALL BESATZUNG!
   ```

2. **Alarmton** wird abgespielt

3. **"J"-Button** für Sprechfreigabe

4. **Fahrzeug schildert Notlage** nach "J"

---

## 🔧 Technische Integration

### Neue Dateien

1. **`js/systems/unified-status-system.js`**
   - Kern-Logik für Status-Management
   - Visuelle Badge-Generierung
   - Status 0/5 Workflow-Handling

2. **`js/ui/radio-ui-enhancements.js`**
   - HTML-Support für `addRadioMessage()`
   - "J"-Button Implementierung
   - CSS-Styles für Badges und Animationen

3. **`js/systems/status-integration.js`**
   - Verbindet System mit Fahrzeugbewegungen
   - Hooks für automatische Statuswechsel
   - Compatibility Layer für alte Systeme

4. **`js/core/config.js`** (v6.3.0)
   - Aktualisierte FMS-Status-Farben
   - Status 9 entfernt
   - Usage-Hinweise für Status 0 und 5

---

### Integration in `index.html`

Füge **nach** den bestehenden System-Scripten hinzu:

```html
<!-- Unified Status System -->
<script src="js/systems/unified-status-system.js"></script>
<script src="js/ui/radio-ui-enhancements.js"></script>
<script src="js/systems/status-integration.js"></script>
```

**Reihenfolge wichtig:**
1. Core-Systeme (game.js, config.js, etc.)
2. Vehicle Movement & Radio System
3. **Unified Status System** (neu)
4. **Radio UI Enhancements** (neu)
5. **Status Integration** (neu, muss als letztes!)

---

## 🛠️ API-Referenz

### UnifiedStatusSystem

#### Status-Änderungen

```javascript
// Normaler Statuswechsel
unifiedStatusSystem.changeVehicleStatus(vehicleId, newStatus, reason);

// Beispiel:
unifiedStatusSystem.changeVehicleStatus('rtw-1', 4, 'Anfahrt nach Berlin');
```

#### Status 5 (Sprechwunsch)

```javascript
// Fahrzeug sendet Sprechwunsch
unifiedStatusSystem.sendStatus5Request(vehicleId, message);

// Beispiel:
unifiedStatusSystem.sendStatus5Request('rtw-1', 'Benötigen Rückfrage zur Zufahrt, kommen.');
```

#### Status 0 (Notfall)

```javascript
// NOTFALL der Besatzung
unifiedStatusSystem.sendStatus0Emergency(vehicleId, reason);

// Beispiel:
unifiedStatusSystem.sendStatus0Emergency('rtw-1', 'Fahrzeug verunfallt, Besatzung verletzt!');
```

#### Sprechfreigabe erteilen

```javascript
// "J" senden (automatisch durch Button)
unifiedStatusSystem.sendSprechfreigabe(vehicleId);
```

#### Prüfungen

```javascript
// Wartet Fahrzeug auf Sprechfreigabe?
unifiedStatusSystem.isWaitingForPermission(vehicleId);

// Alle wartenden Fahrzeuge
const pending = unifiedStatusSystem.getPendingTransmissions();
```

---

### Automatische Workflows

Diese Funktionen werden **automatisch** von `status-integration.js` getriggert:

```javascript
// Status 2→3: Einsatz zugewiesen
unifiedStatusSystem.onIncidentAssigned(vehicleId, incident);

// Status 3→4: Abfahrt zur Einsatzstelle
unifiedStatusSystem.onDepartingToIncident(vehicleId, incident);

// Status 4→6: Ankunft Einsatzstelle
unifiedStatusSystem.onArrivedAtScene(vehicleId);

// Status 6→7: Patient aufgenommen
unifiedStatusSystem.onPatientLoaded(vehicleId);

// Status 7→8: Transport gestartet
unifiedStatusSystem.onDepartingToHospital(vehicleId, hospital);

// Status 8→2: Zurück zur Wache
unifiedStatusSystem.onReturnedToStation(vehicleId);
```

---

### Manuelle Trigger (für UI/Debug)

```javascript
// Manueller Status 5
triggerManualStatus5(vehicleId);

// Notfall Status 0 (Vorsicht!)
triggerEmergencyStatus0(vehicleId, reason);

// Erzwungener Statuswechsel (Admin/Debug)
forceStatusChange(vehicleId, newStatus);
```

---

## 🎨 UI-Anpassungen

### CSS-Klassen

```css
.radio-message-status-change   /* Normale Statuswechsel */
.radio-message-status-5-request /* Status 5 (pulsierend) */
.radio-message-status-0-emergency /* Status 0 (pulsierend, rot) */

.status-badge                  /* Status-Kästchen */
.status-transition             /* Alt→Neu Darstellung */
.j-button                      /* "J"-Button */
```

### Animationen

- **Status 5 Nachrichten:** Sanftes Pulsieren (2s Intervall)
- **Status 0 Nachrichten:** Intensives Pulsieren (1s Intervall, rot)
- **"J"-Button:** Hover-Effekt mit Vergrößerung

---

## ♻️ Migration von alten Systemen

### Was wird ersetzt?

| Alt | Neu |
|-----|-----|
| `status-0-5-system.js` | `unified-status-system.js` |
| `radio-system.js` (Status-Teil) | `unified-status-system.js` |
| Manuelle Status-Updates | Automatische Workflows |
| Text-basierte Status | Visuelle Badges |

### Compatibility Layer

Alte Funktionen werden **automatisch umgeleitet**:

```javascript
// Alt (funktioniert weiterhin)
status05System.sendStatusRequest(vehicleId, 'status');

// Wird automatisch zu:
unifiedStatusSystem.sendStatus5Request(vehicleId);
```

### Empfehlung

1. **Alte Dateien können entfernt werden:**
   - `js/systems/status-0-5-system.js`

2. **Alte Referenzen ersetzen:**
   ```javascript
   // Alt
   status05System.sendStatusRequest(...);
   
   // Neu
   unifiedStatusSystem.sendStatus5Request(...);
   ```

3. **`radio-system.js` behalten** (für Funkgespräche), aber Status-Updates laufen über neues System

---

## 🐛 Debugging

### Console-Ausgaben

Das System loggt alle Aktionen:

```javascript
📡 Unified Status System v1.0 initialisiert
📻 Status-Meldung: RTW 1/83-1 2→3
📞 RTW 1/83-1 meldet Sprechwunsch (Status 5)
📻 Sprechfreigabe erteilt an RTW 1/83-1
✅ RTW 1/83-1 Status zurück auf 4
```

### Browser-Konsole

```javascript
// Alle wartenden Fahrzeuge
unifiedStatusSystem.getPendingTransmissions();

// Fahrzeug-Status prüfen
const vehicle = game.vehicles.find(v => v.callsign === 'RTW 1/83-1');
console.log(vehicle.currentStatus);

// Manueller Test
triggerManualStatus5('rtw-1');
```

---

## ✨ Beispiel-Workflow

### Kompletter Einsatzablauf

```
1. Wache (Status 2)
   [Dunkelgrünes Badge: 2]

2. Einsatz zugewiesen (Status 2→3)
   [2] → [3]
   "RTW 1/83-1: Einsatz übernommen"

3. Abfahrt (Status 3→4)
   [3] → [4]
   "RTW 1/83-1: Anfahrt nach Hauptstraße 42"

4. Sprechwunsch während Anfahrt (Status 5)
   [5] Sprechwunsch  [J-Button]
   
   Spieler klickt "J"
   
   "RTW 1/83-1: Benötigen genaue Adresse, Hausnummer nicht lesbar, kommen."
   
   Status zurück auf 4

5. Ankunft (Status 4→6)
   [4] → [6]
   "RTW 1/83-1: Vor Ort"

6. Patient geladen (Status 6→7)
   [6] → [7]
   "RTW 1/83-1: Patient an Bord"

7. Transport (Status 7→8)
   [7] → [8]
   "RTW 1/83-1: Transport nach Klinikum Stuttgart"

8. Zurück zur Wache (Status 8→2)
   [8] → [2]
   "RTW 1/83-1: Einsatzbereit auf Wache"
```

---

## 📝 Changelog

### v1.0 (2026-01-26)
- ✅ Unified Status System erstellt
- ✅ Visuelle Status-Badges mit korrekten Farben
- ✅ Status 0: NUR für Besatzungs-Notfälle
- ✅ Status 5: Alle Fahrzeug-Anfragen
- ✅ "J"-Button für Sprechfreigabe
- ✅ Status 9 entfernt
- ✅ Automatische Integration mit Fahrzeugbewegungen
- ✅ Compatibility Layer für alte Systeme
- ✅ CONFIG v6.3.0 aktualisiert

---

## 📞 Support

Bei Fragen oder Problemen:

1. **Console-Logs prüfen** (F12 in Browser)
2. **Fahrzeugstatus verifizieren:** `game.vehicles`
3. **Wartende Fahrzeuge:** `unifiedStatusSystem.getPendingTransmissions()`

**Entwickler:** traycedDevelopments  
**Version:** 1.0  
**Datum:** 26.01.2026