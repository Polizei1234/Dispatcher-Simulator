# 🔧 BUGFIXES & KNOWN ISSUES

## ✅ BEHOBENE FEHLER (v4.0.0)

### 1. ❌ `getFMSStatus` Error - **BEHOBEN**
**Problem:** `Cannot read properties of undefined (reading '3')`

**Ursache:** `vehicle.currentStatus` war nicht initialisiert

**Lösung:**
- `game.js` initialisiert jetzt `currentStatus = '2'` für alle Fahrzeuge
- `map.js` hat Fallback-Logik wenn `currentStatus` fehlt

```javascript
// In game.js Constructor:
this.vehicles.forEach(v => {
    if (!v.currentStatus) {
        v.currentStatus = '2'; // Status 2: Auf Wache
    }
});
```

---

## ⚠️ BEKANNTE PROBLEME

### 2. 🗺️ Karte wird nicht angezeigt
**Symptom:** Leerer grauer Bereich statt Karte, Fehler "Set map center and zoom first"

**Ursache:** `CONFIG.MAP_CENTER` oder `CONFIG.MAP_ZOOM` nicht definiert

**Lösung:** Prüfen in `js/config.js`:
```javascript
const CONFIG = {
    MAP_CENTER: [48.83, 9.32], // Waiblingen
    MAP_ZOOM: 11,
    MAP_MIN_ZOOM: 9,
    MAP_MAX_ZOOM: 18,
    // ...
};
```

**Workaround:** Seite neu laden (Ctrl+F5)

---

### 3. 📦 Missing Files
**Symptome:**
- `Failed to load resource: net::ERR_FILE_NOT_FOUND`
- `utils.js`, `extensionState.js`, `heuristicsRedefinitions.js`

**Ursache:** Browser-Extensions (z.B. Password Manager)

**Lösung:** Ignorieren - diese Fehler kommen von Extensions, nicht vom Simulator

---

### 4. 📢 `Unchecked runtime.lastError`
**Symptom:** `A listener indicated an asynchronous response...`

**Ursache:** Chrome Extension Communication

**Lösung:** Ignorieren - kein Einfluss auf Simulator

---

### 5. 🎮 Spielgeschwindigkeit "undefinedx"
**Symptom:** Anzeige zeigt "undefinedx" statt "1x"

**Ursache:** GameTime-System nicht synchron mit UI

**Lösung (Temporär):** Geschwindigkeit über Button ändern → Anzeige korrigiert sich

**TODO:** UI-Update in `main.js` fixen:
```javascript
// In startNewGame():
if (window.GameTime) {
    document.getElementById('game-speed-indicator').textContent = `${window.GameTime.speed}x`;
}
```

---

## 🛠️ DEBUGGING

### Console Commands

Testfunktionen in der Browser-Console:

```javascript
// 1. Teste CallSystem
CallSystem.generateIncomingCall();

// 2. Teste Fahrzeug-Analyzer
VehicleAnalyzer.findBestVehicles(
    {lat: 48.83, lon: 9.32}, 
    ['RTW']
);

// 3. Teste Notification
NotificationSystem.show('Test', 'info', 'Das ist ein Test');

// 4. Zeige Config
console.log(CONFIG);

// 5. Zeige Game State
console.log(game);

// 6. Teste Scoring
ScoringSystem.showPointsPopup({
    gesamt: 100,
    breakdown: {schnell: 50, korrekt: 30, vollständig: 20}
});
```

---

## 🔄 REFRESH STRATEGIE

Wenn Fehler auftreten:

1. **Hard Refresh:** `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)
2. **Cache leeren:**
   - Chrome: DevTools → Network → "Disable cache" aktivieren
   - Firefox: DevTools → Toolbox → "Disable HTTP Cache"
3. **Inkognito-Modus:** Testet ohne Extensions

---

## 📝 CHANGELOG

### v4.0.0 (2026-01-21)

**Neue Features:**
- ✨ CallSystem mit Groq AI Integration
- ✨ Intelligente Fahrzeugauswahl mit ETA
- ✨ Auto-Fill Einsatzprotokoll
- ✨ Post-Alarm Validierung
- ✨ Performance-Tracking & Scoring
- ✨ Notification-System

**Bugfixes:**
- ✅ getFMSStatus Error behoben
- ✅ vehicle.currentStatus initialisiert
- ✅ Map-Performance verbessert (Wachen nur 1x erstellen)

**Known Issues:**
- ⚠️ Spielgeschwindigkeit-Anzeige manchmal "undefined"
- ⚠️ Karte muss manchmal neu geladen werden

---

## 📞 SUPPORT

Bei Problemen:

1. **Browser-Console öffnen:** `F12` → Tab "Console"
2. **Fehler kopieren:** Rechtsklick auf Fehlermeldung → "Copy"
3. **Issue erstellen:** [GitHub Issues](https://github.com/Polizei1234/Dispatcher-Simulator/issues)

**Nützliche Infos für Issues:**
- Browser & Version
- Fehlermeldung aus Console
- Was hast du gemacht bevor der Fehler auftrat?
- Tritt der Fehler im Inkognito-Modus auch auf?

---

## ✅ SYSTEM-STATUS

```
✅ Call System       - Funktioniert
✅ Protocol Form     - Funktioniert
✅ Vehicle Analyzer  - Funktioniert
✅ Assignment UI     - Funktioniert
✅ Groq Validator    - Funktioniert
✅ Notification      - Funktioniert
✅ Scoring System    - Funktioniert
⚠️ Map Display      - Manchmal Reload nötig
⚠️ Speed Indicator  - Anzeige-Bug
✅ Bridge System     - Funktioniert
```

---

**Letzte Aktualisierung:** 21.01.2026