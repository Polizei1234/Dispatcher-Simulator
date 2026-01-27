# 📁 Restructuring Plan - Dispatcher-Simulator

> **Erstellt:** 27. Januar 2026  
> **Status:** 🟡 In Planung  
> **Priorität:** Hoch

---

## 🎯 Ziele

1. **Reduzierung von Code-Duplikaten** (2 kritische Fälle gefunden)
2. **Verbesserung der Dokumentations-Organisation** (19 MD-Dateien im Root)
3. **Optimierung der CSS-Struktur** (14 CSS-Dateien)
4. **Bereinigung von Build-Artefakten** aus Git-Tracking
5. **Einführung einer Test-Struktur**

---

## 🚨 Phase 1: Kritische Duplikate beheben (SOFORT)

### Problem 1: `debug-menu.js` Duplikat

**Dateien:**
- ✅ `js/systems/debug-menu.js` (25 KB) - **BEHALTEN**
- ❌ `js/utils/debug-menu.js` (13 KB) - **LÖSCHEN**

**Grund:** Die System-Version ist größer und vollständiger. Die Utils-Version ist veraltet.

**Aktion:**
```bash
git rm js/utils/debug-menu.js
git commit -m "remove: Duplikat debug-menu.js aus utils/ (veraltet)"
```

### Problem 2: `notification-system.js` Duplikat

**Dateien:**
- ✅ `js/systems/notification-system.js` (14 KB) - **BEHALTEN**
- ❌ `js/utils/notification-system.js` (5 KB) - **LÖSCHEN**

**Grund:** Die System-Version ist umfangreicher und wird im Vehicle-Movement genutzt.

**Aktion:**
```bash
git rm js/utils/notification-system.js
git commit -m "remove: Duplikat notification-system.js aus utils/ (veraltet)"
```

**⚠️ WICHTIG:** Prüfe, ob die Utils-Versionen irgendwo importiert werden!

---

## 📚 Phase 2: Dokumentations-Reorganisation

### Vorher (19 Dateien im Root):
```
.
├── ARCHITECTURE.md
├── BUGFIXES.md
├── BUILD_SYSTEM.md
├── CACHE_CLEAR.md
├── CHANGELOG.md
├── COMMITS_v6.2.0.md
├── CRITICAL_BUGFIXES.md
├── FINAL_STATUS_v5.0.0.md
├── ICON_SYSTEM_v6.0.0.md
├── INTEGRATION_GUIDE.md
├── MIGRATION_GUIDE.md
├── PHASE_2_DOCUMENTATION.md
├── RADIO_SYSTEM_COMPLETE.md
├── README.md
├── RELEASE_NOTES_v6.0.0.md
├── RELEASE_NOTES_v6.1.0.md
├── RELEASE_NOTES_v6.2.0.md
├── RELEASE_NOTES_v6.3.0.md
├── ROADMAP.md
└── UNIFIED_STATUS_SYSTEM.md
```

### Nachher (Strukturiert):
```
.
├── README.md                        # Haupt-Readme (bleibt)
├── CHANGELOG.md                     # Changelog (bleibt)
├── ROADMAP.md                       # Roadmap (bleibt)
└── docs/
    ├── README.md                    # Dokumentations-Index
    ├── technical/
    │   ├── ARCHITECTURE.md
    │   ├── BUILD_SYSTEM.md
    │   ├── CACHE_CLEAR.md
    │   └── UNIFIED_STATUS_SYSTEM.md
    ├── systems/
    │   ├── ICON_SYSTEM_v6.0.0.md
    │   ├── RADIO_SYSTEM_COMPLETE.md
    │   └── PHASE_2_DOCUMENTATION.md
    ├── guides/
    │   ├── INTEGRATION_GUIDE.md
    │   └── MIGRATION_GUIDE.md
    ├── releases/
    │   ├── RELEASE_NOTES_v6.0.0.md
    │   ├── RELEASE_NOTES_v6.1.0.md
    │   ├── RELEASE_NOTES_v6.2.0.md
    │   ├── RELEASE_NOTES_v6.3.0.md
    │   ├── COMMITS_v6.2.0.md
    │   └── FINAL_STATUS_v5.0.0.md
    └── bugfixes/
        ├── BUGFIXES.md
        └── CRITICAL_BUGFIXES.md
```

**Migration-Script:**
```bash
#!/bin/bash
# Erstelle Ordner-Struktur
mkdir -p docs/{technical,systems,guides,releases,bugfixes}

# Verschiebe Dateien
git mv ARCHITECTURE.md docs/technical/
git mv BUILD_SYSTEM.md docs/technical/
git mv CACHE_CLEAR.md docs/technical/
git mv UNIFIED_STATUS_SYSTEM.md docs/technical/

git mv ICON_SYSTEM_v6.0.0.md docs/systems/
git mv RADIO_SYSTEM_COMPLETE.md docs/systems/
git mv PHASE_2_DOCUMENTATION.md docs/systems/

git mv INTEGRATION_GUIDE.md docs/guides/
git mv MIGRATION_GUIDE.md docs/guides/

git mv RELEASE_NOTES_*.md docs/releases/
git mv COMMITS_v6.2.0.md docs/releases/
git mv FINAL_STATUS_v5.0.0.md docs/releases/

git mv BUGFIXES.md docs/bugfixes/
git mv CRITICAL_BUGFIXES.md docs/bugfixes/

git commit -m "refactor: Reorganisiere Dokumentation in docs/ Struktur"
```

---

## 🎨 Phase 3: CSS-Reorganisation

### Vorher (14 Dateien im Root):
```
css/
├── call-system.css
├── draggable.css
├── keywords-dropdown.css
├── layout.css
├── map-icons.css
├── priority-dropdown.css
├── radio-feed.css
├── radio-tab.css
├── radio.css
├── style.css
├── styles-bundle.css  ← Build-Artefakt!
├── tabs.css
├── theme-light.css
└── universal-dropdown.css
```

### Nachher (Strukturiert):
```
css/
├── style.css                        # Import-Datei (bleibt)
├── layout.css                       # Layout (bleibt)
├── components/
│   ├── dropdowns/
│   │   ├── keywords-dropdown.css
│   │   ├── priority-dropdown.css
│   │   └── universal-dropdown.css
│   ├── tabs.css
│   ├── draggable.css
│   └── call-system.css
├── radio/
│   ├── radio.css
│   ├── radio-feed.css
│   └── radio-tab.css
├── themes/
│   └── theme-light.css
└── map/
    └── map-icons.css
```

**⚠️ WICHTIG:** Nach Reorganisation müssen Import-Pfade in `style.css` und `index.html` angepasst werden!

---

## 🗑️ Phase 4: .gitignore verbessern

### Aktuelle .gitignore erweitern:
```gitignore
# Build-Artefakte (NEU)
js/main-bundle.js
js/main-bundle.js.map
css/styles-bundle.css
css/styles-bundle.css.map
dist/
build/

# Node-Module
node_modules/

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# Temporäre Dateien
*.tmp
*.bak
```

**Dann Bundle-Dateien aus Git entfernen:**
```bash
git rm --cached js/main-bundle.js
git rm --cached css/styles-bundle.css
git commit -m "chore: Entferne Build-Artefakte aus Git-Tracking"
```

---

## 🧪 Phase 5: Test-Struktur einführen

### Neue Struktur:
```
js/
├── core/
│   ├── __tests__/
│   │   ├── main.test.js
│   │   ├── game.test.js
│   │   └── bridge.test.js
│   └── ...
├── systems/
│   ├── __tests__/
│   │   ├── vehicle-movement.test.js
│   │   ├── unified-status-system.test.js
│   │   └── notification-system.test.js
│   └── ...
└── utils/
    ├── __tests__/
    │   └── ...
    └── ...
```

### Test-Setup (package.json):
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "@testing-library/jest-dom": "^6.0.0"
  }
}
```

### Prioritäre Tests:
1. **vehicle-movement.test.js** - Teste Bugfixes #1-5
2. **unified-status-system.test.js** - Teste FMS-Status-Änderungen
3. **notification-system.test.js** - Teste User-Notifications
4. **main.test.js** - Teste Game Loop & Pause

---

## 📊 Prioritäten-Matrix

| Phase | Priorität | Zeitaufwand | Risiko | Status |
|-------|-----------|-------------|--------|--------|
| **Phase 1: Duplikate** | 🔴 Kritisch | 10 min | Niedrig | ⏳ Ausstehend |
| **Phase 2: Docs** | 🟡 Mittel | 30 min | Niedrig | ⏳ Ausstehend |
| **Phase 3: CSS** | 🟢 Niedrig | 45 min | Mittel | ⏳ Ausstehend |
| **Phase 4: .gitignore** | 🟡 Mittel | 5 min | Niedrig | ⏳ Ausstehend |
| **Phase 5: Tests** | 🟢 Niedrig | 2h+ | Niedrig | ⏳ Ausstehend |

---

## ⚠️ Risiken & Vorsichtsmaßnahmen

### Risiko 1: Import-Pfade brechen
**Betroffene Phasen:** 2, 3  
**Lösung:** Nach Reorganisation vollständige Funktionstest durchführen

### Risiko 2: Bundle-Build bricht
**Betroffene Phasen:** 3, 4  
**Lösung:** `webpack.config.js` anpassen, Build-Test vor Commit

### Risiko 3: Duplikat-Löschung bricht Code
**Betroffene Phasen:** 1  
**Lösung:** Code-Suche nach Import-Statements:
```bash
grep -r "from.*debug-menu" js/
grep -r "from.*notification-system" js/
```

---

## ✅ Checkliste vor Start

- [ ] **Backup erstellen** (Git-Tag oder Branch)
- [ ] **Code-Suche** nach Duplikat-Importen
- [ ] **Build-Test** vor Änderungen
- [ ] **Test-Plan** für jede Phase
- [ ] **Rollback-Plan** vorbereitet

---

## 🚀 Umsetzungs-Reihenfolge

1. **Tag erstellen:** `git tag v7.4.2-pre-restructuring`
2. **Phase 1** ausführen (Duplikate)
3. **Build-Test**
4. **Phase 4** ausführen (.gitignore)
5. **Phase 2** ausführen (Docs)
6. **Phase 3** ausführen (CSS) - MIT Build-Anpassung
7. **Build-Test**
8. **Phase 5** planen (Tests)

---

## 📝 Nach Abschluss

- [ ] Dokumentation aktualisieren (README.md)
- [ ] CHANGELOG.md ergänzen
- [ ] Git-Tag erstellen: `v7.5.0-restructured`
- [ ] Dieses Dokument nach `docs/technical/` verschieben

---

**Geschätzte Gesamtdauer:** 3-4 Stunden  
**Empfohlener Zeitpunkt:** Ruhige Phase, keine parallelen Entwicklungen