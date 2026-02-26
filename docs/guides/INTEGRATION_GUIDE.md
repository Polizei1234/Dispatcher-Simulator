# 🚀 Quick Integration Guide - Unified Status System

## Schritt 1: Neue Dateien in `index.html` einbinden

Öffne deine `index.html` und füge die neuen Scripts **vor** dem `</body>`-Tag ein:

```html
<!-- Bestehende Scripts bleiben -->
<script src="js/core/config.js"></script>
<script src="js/core/game.js"></script>
<script src="js/systems/radio-system.js"></script>
<script src="js/systems/vehicle-movement.js"></script>

<!-- 🆕 NEU: Unified Status System -->
<script src="js/systems/unified-status-system.js"></script>
<script src="js/ui/radio-ui-enhancements.js"></script>
<script src="js/systems/status-integration.js"></script>

<!-- Main initialisiert alles -->
<script src="js/core/main.js"></script>
```

**Wichtig:** Die Reihenfolge muss stimmen!
1. Core-Dateien (config, game)
2. Systeme (radio, vehicle-movement)
3. **Unified Status System** (3 neue Dateien)
4. Main (zum Schluss)

---

## Schritt 2: Alte Dateien deaktivieren (optional)

Wenn du `status-0-5-system.js` verwendest, kannst du es **entfernen** oder auskommentieren:

```html
<!-- Alt - kann entfernt werden -->
<!-- <script src="js/systems/status-0-5-system.js"></script> -->
```

Das Unified System hat einen **Compatibility Layer**, der alte Funktionen automatisch umleitet.

---

## Schritt 3: HTML-Struktur prüfen

Stelle sicher, dass dein Funkfenster diese ID hat:

```html
<div id="radio-log" class="radio-container">
    <!-- Funknachrichten werden hier angezeigt -->
</div>
```

Falls du eine andere ID verwendest, passe `radio-ui-enhancements.js` an:

```javascript
// Zeile 11 ändern:
const radioLog = document.getElementById('DEINE-ID');
```

---

## Schritt 4: Teste das System

### Browser-Konsole öffnen (F12)

Du solltest diese Meldungen sehen:

```
✅ Config v6.3.0 geladen
✅ FMS_STATUS Farben aktualisiert
📡 Unified Status System v1.0 initialisiert
✅ Radio UI Enhancements v1.0 geladen
🔗 Status-Integration wird initialisiert...
✅ Status-Integration aktiv
```

### Test-Befehle in der Konsole

```javascript
// 1. Status-Änderung testen
const vehicle = game.vehicles[0];
unifiedStatusSystem.changeVehicleStatus(vehicle.id, 4, 'Test-Anfahrt');

// 2. Status 5 (Sprechwunsch) testen
unifiedStatusSystem.sendStatus5Request(vehicle.id);

// 3. Prüfe wartende Fahrzeuge
unifiedStatusSystem.getPendingTransmissions();
```

**Erwartetes Ergebnis:**
- Im Funkfenster erscheinen farbige Status-Badges
- Bei Status 5 erscheint ein grüner **"J"-Button**
- Nach Klick auf "J" antwortet das Fahrzeug

---

## Schritt 5: Fahrzeugbewegungen verbinden

### Wenn du bereits Fahrzeugbewegungen hast:

Das System hookt sich **automatisch** ein! Prüfe deine bestehenden Funktionen:

```javascript
// Deine Funktion:
function dispatchVehicleToIncident(vehicleId, incidentId) {
    // Dein Code...
    
    // Status-Updates erfolgen automatisch!
    // Status 2→3→4 werden automatisch gesendet
}
```

### Wenn du keine Fahrzeugbewegungen hast:

Nutze die **manuellen Trigger**:

```javascript
// Einsatz zugewiesen
const incident = game.incidents[0];
unifiedStatusSystem.onIncidentAssigned(vehicle.id, incident);

// Abfahrt
unifiedStatusSystem.onDepartingToIncident(vehicle.id, incident);

// Ankunft
unifiedStatusSystem.onArrivedAtScene(vehicle.id);

// Patient geladen
unifiedStatusSystem.onPatientLoaded(vehicle.id);

// Transport
unifiedStatusSystem.onDepartingToHospital(vehicle.id, 'Klinikum Stuttgart');

// Zurück zur Wache
unifiedStatusSystem.onReturnedToStation(vehicle.id);
```

---

## Schritt 6: "J"-Button Integration

Der "J"-Button erscheint **automatisch** bei Status 5 und Status 0.

### Manuell auslösen (für Tests):

```javascript
// Status 5 manuell auslösen
triggerManualStatus5(vehicle.id);

// Notfall Status 0 (VORSICHT - nur für Tests!)
triggerEmergencyStatus0(vehicle.id, 'Test-Notfall');
```

### Sprechfreigabe per Code:

```javascript
// Erteile Sprechfreigabe
unifiedStatusSystem.sendSprechfreigabe(vehicle.id);
```

---

## ⚠️ Fehlerbehebung

### Problem: Keine Status-Badges im Funkfenster

**Lösung:**
1. Prüfe Console auf Fehler (F12)
2. Stelle sicher, dass `addRadioMessage()` überschrieben wurde:
   ```javascript
   console.log(typeof addRadioMessage); // sollte "function" sein
   ```
3. Prüfe, ob `radio-ui-enhancements.js` geladen wurde

### Problem: "J"-Button funktioniert nicht

**Lösung:**
1. Prüfe ob Fahrzeug auf Sprechfreigabe wartet:
   ```javascript
   unifiedStatusSystem.isWaitingForPermission(vehicle.id);
   ```
2. Prüfe Console auf JavaScript-Fehler
3. Stelle sicher, dass `window.unifiedStatusSystem` existiert:
   ```javascript
   console.log(window.unifiedStatusSystem); // sollte Objekt sein
   ```

### Problem: Status-Änderungen werden nicht angezeigt

**Lösung:**
1. Prüfe ob `status-integration.js` geladen wurde
2. Prüfe ob Vehicle-Movement-Hooks installiert wurden:
   ```javascript
   // In Console sollte erscheinen:
   // ✅ Vehicle Movement Hooks installiert
   ```
3. Nutze manuellen Trigger:
   ```javascript
   unifiedStatusSystem.changeVehicleStatus(vehicle.id, 4);
   ```

### Problem: Alte Statusmeldungen erscheinen noch

**Lösung:**
1. Deaktiviere `status-0-5-system.js`
2. Leere Browser-Cache (Strg+Shift+R)
3. Prüfe ob Compatibility Layer aktiv ist:
   ```javascript
   // In Console sollte erscheinen:
   // ✅ Radio System Compatibility Layer aktiv
   ```

---

## 📝 Checkliste

- [ ] 3 neue Dateien in `index.html` eingebunden
- [ ] Reihenfolge der Scripts korrekt
- [ ] `id="radio-log"` im HTML vorhanden
- [ ] Browser-Cache geleert
- [ ] Console-Meldungen prüfen (F12)
- [ ] Test-Befehl ausgeführt
- [ ] Status-Badges erscheinen im Funkfenster
- [ ] "J"-Button funktioniert
- [ ] Alte `status-0-5-system.js` deaktiviert

---

## 🎯 Nächste Schritte

1. **Lies die vollständige Dokumentation:** [`UNIFIED_STATUS_SYSTEM.md`](UNIFIED_STATUS_SYSTEM.md)

2. **Passe Farben an (optional):**
   - Bearbeite `js/systems/unified-status-system.js`
   - Ändere `STATUS_COLORS` Objekt

3. **Eigene Status-Nachrichten:**
   - Bearbeite `generateStatus5Message()` in `unified-status-system.js`
   - Füge eigene Sprüche hinzu

4. **Zufällige Status 5 anpassen:**
   - Bearbeite `CONFIG.RADIO.REQUEST_CHANCE` in `config.js`
   - Standard: 2% (0.02)

5. **Notfall-Wahrscheinlichkeit ändern:**
   - Bearbeite `CONFIG.RADIO.EMERGENCY_CHANCE` in `config.js`
   - Standard: 0.1% (0.001) - SEHR SELTEN!

---

## 📞 Hilfe benötigt?

**Fragen? Probleme?**

1. Prüfe Console (F12) auf Fehler
2. Teste Beispiel-Befehle (siehe Schritt 4)
3. Lies [`UNIFIED_STATUS_SYSTEM.md`](UNIFIED_STATUS_SYSTEM.md)

**Entwickelt von:** traycedDevelopments  
**Version:** 1.0  
**Datum:** 26.01.2026

---

## ✨ Fertig!

Du hast erfolgreich das **Unified Status System** integriert! 

Deine Fahrzeuge senden jetzt:
- 🟩 Farbcodierte Status-Badges
- 📞 Status 5 mit "J"-Button
- 🚨 Status 0 für Notfälle
- 🔄 Automatische Status-Transitions

Viel Erfolg mit deinem Dispatcher-Simulator!