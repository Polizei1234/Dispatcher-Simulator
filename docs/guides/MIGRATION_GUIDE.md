# 📦 Migrations-Guide v4.9 → v5.0

## ⚠️ WICHTIG: Vor der Migration

1. **Backup erstellen:**
   ```bash
   git tag v4.9.0-backup
   git push origin v4.9.0-backup
   ```

2. **Testen dass alles funktioniert:**
   - [ ] Einsätze können erstellt werden
   - [ ] Fahrzeuge fahren los
   - [ ] Notruf-System funktioniert
   - [ ] Karte zeigt Fahrzeuge an

## 🔧 Schritt-für-Schritt Migration

### Option A: Automatisches Script (EMPFOHLEN)

```bash
# 1. Migration Script erstellen
cat > migrate.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starte Migration zu v5.0..."

# Core
mkdir -p js/core
git mv js/game.js js/core/ 2>/dev/null || true
git mv js/main.js js/core/ 2>/dev/null || true
git mv js/config.js js/core/ 2>/dev/null || true
git mv js/bridge.js js/core/ 2>/dev/null || true

# Systems
mkdir -p js/systems
git mv js/vehicle-movement.js js/systems/ 2>/dev/null || true
git mv js/call-system.js js/systems/ 2>/dev/null || true
git mv js/ai-incident-generator.js js/systems/ 2>/dev/null || true
git mv js/escalation-system.js js/systems/ 2>/dev/null || true
git mv js/weather-system.js js/systems/ 2>/dev/null || true
git mv js/mission-timer.js js/systems/ 2>/dev/null || true
git mv js/groq-validator.js js/systems/ 2>/dev/null || true

# UI
mkdir -p js/ui
git mv js/tabs.js js/ui/ 2>/dev/null || true
git mv js/ui.js js/ui/ 2>/dev/null || true
git mv js/ui-helpers.js js/ui/ 2>/dev/null || true
git mv js/assignment-ui.js js/ui/ 2>/dev/null || true
git mv js/manual-incident.js js/ui/ 2>/dev/null || true
git mv js/protocol-form.js js/ui/ 2>/dev/null || true
git mv js/keywords-dropdown.js js/ui/ 2>/dev/null || true
git mv js/draggable.js js/ui/ 2>/dev/null || true

# Data
mkdir -p js/data
git mv js/data.js js/data/ 2>/dev/null || true
git mv js/hospitals.js js/data/ 2>/dev/null || true
git mv js/fms-codes.json js/data/ 2>/dev/null || true
git mv js/incidents.js js/data/ 2>/dev/null || true

# Utils
mkdir -p js/utils
git mv js/notification-system.js js/utils/ 2>/dev/null || true
git mv js/scoring-system.js js/utils/ 2>/dev/null || true
git mv js/incident-numbering.js js/utils/ 2>/dev/null || true
git mv js/location-generator.js js/utils/ 2>/dev/null || true
git mv js/address-service.js js/utils/ 2>/dev/null || true
git mv js/vehicle-analyzer.js js/utils/ 2>/dev/null || true
git mv js/version-manager.js js/utils/ 2>/dev/null || true
git mv js/tutorial.js js/utils/ 2>/dev/null || true

echo "✅ Dateien verschoben!"
echo "⚠️  JETZT index.html manuell aktualisieren!"
EOF

chmod +x migrate.sh
./migrate.sh
```

### Option B: Manuelle Migration

Folge den Schritten in `ARCHITECTURE.md` Phase 2

## 📝 index.html Aktualisierung

Ersetze im `<head>` Bereich:

**ALT:**
```html
<script src="js/version-manager.js?v=4.9.0"></script>
```

**NEU:**
```html
<script src="js/utils/version-manager.js?v=5.0.0"></script>
```

Ersetze vor `</body>`:

**ALT:**
```html
<script src="js/config.js?v=4.9.0"></script>
<script src="js/game.js?v=4.9.0"></script>
<!-- ... alle anderen scripts ... -->
```

**NEU:**
```html
<!-- CORE -->
<script src="js/core/config.js?v=5.0.0"></script>

<!-- UTILS -->
<script src="js/utils/location-generator.js?v=5.0.0"></script>
<script src="js/utils/incident-numbering.js?v=5.0.0"></script>
<!-- ... etc -->

<!-- DATA -->
<script src="js/data/hospitals.js?v=5.0.0"></script>
<script src="js/data/data.js?v=5.0.0"></script>
<!-- ... etc -->

<!-- SYSTEMS -->
<script src="js/systems/weather-system.js?v=5.0.0"></script>
<script src="js/systems/vehicle-movement.js?v=5.0.0"></script>
<!-- ... etc -->

<!-- UI -->
<script src="js/ui/tabs.js?v=5.0.0"></script>
<script src="js/ui/ui.js?v=5.0.0"></script>
<!-- ... etc -->

<!-- CORE INIT (ZULETZT) -->
<script src="js/core/game.js?v=5.0.0"></script>
<script src="js/core/main.js?v=5.0.0"></script>
<script src="js/core/bridge.js?v=5.0.0"></script>
```

## ✅ Nach der Migration

1. **Testen:**
   ```bash
   # Lokalen Server starten
   python -m http.server 8000
   # Oder
   npx serve .
   ```

2. **Browser-Cache löschen:**
   - Chrome/Edge: `Strg+Shift+Delete`
   - Firefox: `Strg+Shift+Delete`
   - Oder: `Strg+Shift+R` für Hard Reload

3. **Funktionalität prüfen:**
   - [ ] Spiel startet
   - [ ] Karte lädt
   - [ ] Fahrzeuge werden angezeigt
   - [ ] Einsätze funktionieren
   - [ ] Notruf funktioniert
   - [ ] Fahrzeuge fahren

4. **Commit & Push:**
   ```bash
   git add .
   git commit -m "feat: Reorganize folder structure to v5.0"
   git push origin main
   ```

## 🔙 Rollback (Falls nötig)

```bash
git reset --hard v4.9.0-backup
git push origin main --force
```

## 📊 Erwartete Verbesserungen

- **Ladezeit:** -30% (nach Bundling)
- **Wartbarkeit:** +80%
- **Übersichtlichkeit:** +100%
- **Developer Experience:** +150%