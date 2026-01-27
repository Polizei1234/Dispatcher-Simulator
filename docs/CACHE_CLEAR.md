# 🛠️ CACHE PROBLEM BEHEBEN

Wenn die Seite nicht korrekt lädt:

## 🔄 Cache leeren (Chrome/Edge)

1. **Strg + Shift + R** (Windows) oder **Cmd + Shift + R** (Mac)
2. Oder: **F12** → Rechtsklick auf Reload-Button → "Empty Cache and Hard Reload"
3. Oder: DevTools (F12) → Network Tab → "Disable cache" aktivieren

## 🧪 Inkognito-Modus

- **Strg + Shift + N** (Chrome/Edge)
- Öffne die Seite im Inkognito-Fenster

## 📋 Version prüfen

Alle Dateien haben jetzt `?v=2.0` Parameter:
- `js/config.js?v=2.0`
- `js/data.js?v=2.0`
- `js/map.js?v=2.0`
- etc.

Dies erzwingt das Neuladen aller JavaScript-Dateien!

## ✅ Funktioniert es?

Wenn die Karte sichtbar ist und keine Fehler in der Console (F12) sind:
- ✅ Cache erfolgreich geleert
- ✅ Neue Version geladen