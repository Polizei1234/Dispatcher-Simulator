# Phase 3: CSS-Reorganisation - Finale Schritte

## ✅ Bereits erledigt:
- ✅ `css/components/.gitkeep` erstellt
- ✅ `css/components/call-system.css` verschoben
- ✅ `css/components/draggable.css` verschoben

---

## 🛠️ Verbleibende Schritte (Manuell in Git Bash):

### 1. Git Bash öffnen
```bash
# Im Projekt-Verzeichnis
cd C:/Users/janni/Documents/Development/Dispatcher-Simulator
```

### 2. Verbleibende Dateien verschieben

```bash
# Components
git mv css/tabs.css css/components/tabs.css

# Dropdowns (Ordner erstellen falls nötig)
mkdir -p css/components/dropdowns
git mv css/keywords-dropdown.css css/components/dropdowns/keywords-dropdown.css
git mv css/priority-dropdown.css css/components/dropdowns/priority-dropdown.css
git mv css/universal-dropdown.css css/components/dropdowns/universal-dropdown.css

# Radio (Ordner erstellen falls nötig)
mkdir -p css/radio
git mv css/radio.css css/radio/radio.css
git mv css/radio-tab.css css/radio/radio-tab.css
# Falls radio-feed.css existiert:
if [ -f css/radio-feed.css ]; then git mv css/radio-feed.css css/radio/radio-feed.css; fi

# Themes (Ordner erstellen falls nötig)
mkdir -p css/themes
git mv css/theme-light.css css/themes/theme-light.css

# Map (Ordner erstellen falls nötig)
mkdir -p css/map
git mv css/map-icons.css css/map/map-icons.css
```

### 3. version-config.js aktualisieren

Öffne `js/core/version-config.js` und ersetze den `CSS_FILES` Block:

```javascript
CSS_FILES: [
    'css/style.css',
    'css/layout.css',
    
    // Components
    'css/components/call-system.css',
    'css/components/draggable.css',
    'css/components/tabs.css',
    
    // Dropdowns
    'css/components/dropdowns/keywords-dropdown.css',
    'css/components/dropdowns/priority-dropdown.css',
    'css/components/dropdowns/universal-dropdown.css',
    
    // Radio
    'css/radio/radio.css',
    'css/radio/radio-feed.css',
    'css/radio/radio-tab.css',
    
    // Themes
    'css/themes/theme-light.css',
    
    // Map
    'css/map/map-icons.css'
],
```

### 4. Alte Dateien löschen (aus Root)

```bash
# Falls noch vorhanden, alte Dateien löschen
git rm css/call-system.css 2>/dev/null || true
git rm css/draggable.css 2>/dev/null || true
git rm css/tabs.css 2>/dev/null || true
git rm css/keywords-dropdown.css 2>/dev/null || true
git rm css/priority-dropdown.css 2>/dev/null || true
git rm css/universal-dropdown.css 2>/dev/null || true
git rm css/radio.css 2>/dev/null || true
git rm css/radio-tab.css 2>/dev/null || true
git rm css/theme-light.css 2>/dev/null || true
git rm css/map-icons.css 2>/dev/null || true
```

### 5. Commit & Push

```bash
git add .
git commit -m "refactor(css): Phase 3 abgeschlossen - CSS vollständig reorganisiert

Neue Struktur:
- css/components/ für UI-Komponenten
- css/components/dropdowns/ für alle Dropdowns
- css/radio/ für Radio-System
- css/themes/ für Themes
- css/map/ für Karten-Icons

Vorteile:
- Thematische Gruppierung
- Bessere Wartbarkeit
- Skalierbar für Zukunft"

git push origin main
```

---

## 🧪 Test-Checkliste

Nach dem Push:

1. **Browser öffnen** und Simulator laden
2. **Cache leeren**: `Strg + Shift + R` (mehrmals!)
3. **Browser-Konsole** öffnen (`F12`) und prüfen:
   - ✅ Keine 404-Fehler bei CSS-Dateien
   - ✅ Keine Parse-Errors

4. **Funktions-Test**:
   - [ ] Layout sieht normal aus
   - [ ] Alle Tabs funktionieren
   - [ ] Dropdowns öffnen sich (Stichworte, Priorität)
   - [ ] Karte zeigt Icons korrekt
   - [ ] Radio-Feed wird angezeigt
   - [ ] Drag & Drop funktioniert
   - [ ] Theme ist korrekt

---

## 🔙 Rollback (Falls nötig)

```bash
git reset --hard HEAD~5
git push origin main --force
```

---

## 🎯 Erwartete Endstruktur

```
css/
├── style.css
├── layout.css
├── styles-bundle.css (Build-Artefakt - Phase 4)
├── components/
│   ├── call-system.css
│   ├── draggable.css
│   ├── tabs.css
│   └── dropdowns/
│       ├── keywords-dropdown.css
│       ├── priority-dropdown.css
│       └── universal-dropdown.css
├── radio/
│   ├── radio.css
│   ├── radio-feed.css
│   └── radio-tab.css
├── themes/
│   └── theme-light.css
└── map/
    └── map-icons.css
```

---

## 🚀 Nächste Phase

Nach erfolgreicher Phase 3:
- **Phase 4**: .gitignore optimieren (`styles-bundle.css` ignorieren)
