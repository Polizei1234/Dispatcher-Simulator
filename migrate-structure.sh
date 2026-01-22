#!/bin/bash
# =====================================
# MIGRATION SCRIPT v5.0
# Verschiebt alle Dateien in neue Ordnerstruktur
# =====================================

set -e

echo "🚀 STARTE MIGRATION ZU v5.0..."
echo ""

# Backup Tag erstellen
echo "💾 Erstelle Backup-Tag..."
git tag v4.9.1-pre-migration
echo "✅ Backup erstellt: v4.9.1-pre-migration"
echo ""

# ======================
# 1. CORE FILES
# ======================
echo "🔵 Phase 1/5: Core Files"
mkdir -p js/core

if [ -f "js/main.js" ]; then
    git mv js/main.js js/core/main.js
    echo "  ✅ main.js verschoben"
fi

if [ -f "js/config.js" ]; then
    git mv js/config.js js/core/config.js
    echo "  ✅ config.js verschoben"
fi

if [ -f "js/bridge.js" ]; then
    git mv js/bridge.js js/core/bridge.js
    echo "  ✅ bridge.js verschoben"
fi

echo ""

# ======================
# 2. SYSTEMS
# ======================
echo "🔴 Phase 2/5: Systems"
mkdir -p js/systems

if [ -f "js/vehicle-movement.js" ]; then
    git mv js/vehicle-movement.js js/systems/vehicle-movement.js
    echo "  ✅ vehicle-movement.js verschoben"
fi

if [ -f "js/call-system.js" ]; then
    git mv js/call-system.js js/systems/call-system.js
    echo "  ✅ call-system.js verschoben"
fi

if [ -f "js/ai-incident-generator.js" ]; then
    git mv js/ai-incident-generator.js js/systems/ai-incident-generator.js
    echo "  ✅ ai-incident-generator.js verschoben"
fi

if [ -f "js/escalation-system.js" ]; then
    git mv js/escalation-system.js js/systems/escalation-system.js
    echo "  ✅ escalation-system.js verschoben"
fi

if [ -f "js/weather-system.js" ]; then
    git mv js/weather-system.js js/systems/weather-system.js
    echo "  ✅ weather-system.js verschoben"
fi

if [ -f "js/mission-timer.js" ]; then
    git mv js/mission-timer.js js/systems/mission-timer.js
    echo "  ✅ mission-timer.js verschoben"
fi

if [ -f "js/groq-validator.js" ]; then
    git mv js/groq-validator.js js/systems/groq-validator.js
    echo "  ✅ groq-validator.js verschoben"
fi

echo ""

# ======================
# 3. UI
# ======================
echo "🟡 Phase 3/5: UI Components"
mkdir -p js/ui

if [ -f "js/tabs.js" ]; then
    git mv js/tabs.js js/ui/tabs.js
    echo "  ✅ tabs.js verschoben"
fi

if [ -f "js/ui.js" ]; then
    git mv js/ui.js js/ui/ui.js
    echo "  ✅ ui.js verschoben"
fi

if [ -f "js/ui-helpers.js" ]; then
    git mv js/ui-helpers.js js/ui/ui-helpers.js
    echo "  ✅ ui-helpers.js verschoben"
fi

if [ -f "js/assignment-ui.js" ]; then
    git mv js/assignment-ui.js js/ui/assignment-ui.js
    echo "  ✅ assignment-ui.js verschoben"
fi

if [ -f "js/manual-incident.js" ]; then
    git mv js/manual-incident.js js/ui/manual-incident.js
    echo "  ✅ manual-incident.js verschoben"
fi

if [ -f "js/protocol-form.js" ]; then
    git mv js/protocol-form.js js/ui/protocol-form.js
    echo "  ✅ protocol-form.js verschoben"
fi

if [ -f "js/keywords-dropdown.js" ]; then
    git mv js/keywords-dropdown.js js/ui/keywords-dropdown.js
    echo "  ✅ keywords-dropdown.js verschoben"
fi

if [ -f "js/draggable.js" ]; then
    git mv js/draggable.js js/ui/draggable.js
    echo "  ✅ draggable.js verschoben"
fi

echo ""

# ======================
# 4. DATA
# ======================
echo "🟢 Phase 4/5: Data Files"
mkdir -p js/data

if [ -f "js/data.js" ]; then
    git mv js/data.js js/data/data.js
    echo "  ✅ data.js verschoben"
fi

if [ -f "js/hospitals.js" ]; then
    git mv js/hospitals.js js/data/hospitals.js
    echo "  ✅ hospitals.js verschoben"
fi

if [ -f "js/fms-codes.json" ]; then
    git mv js/fms-codes.json js/data/fms-codes.json
    echo "  ✅ fms-codes.json verschoben"
fi

if [ -f "js/incidents.js" ]; then
    git mv js/incidents.js js/data/incidents.js
    echo "  ✅ incidents.js verschoben"
fi

echo ""

# ======================
# 5. UTILS
# ======================
echo "🟪 Phase 5/5: Utils"
mkdir -p js/utils

if [ -f "js/notification-system.js" ]; then
    git mv js/notification-system.js js/utils/notification-system.js
    echo "  ✅ notification-system.js verschoben"
fi

if [ -f "js/scoring-system.js" ]; then
    git mv js/scoring-system.js js/utils/scoring-system.js
    echo "  ✅ scoring-system.js verschoben"
fi

if [ -f "js/incident-numbering.js" ]; then
    git mv js/incident-numbering.js js/utils/incident-numbering.js
    echo "  ✅ incident-numbering.js verschoben"
fi

if [ -f "js/location-generator.js" ]; then
    git mv js/location-generator.js js/utils/location-generator.js
    echo "  ✅ location-generator.js verschoben"
fi

if [ -f "js/address-service.js" ]; then
    git mv js/address-service.js js/utils/address-service.js
    echo "  ✅ address-service.js verschoben"
fi

if [ -f "js/vehicle-analyzer.js" ]; then
    git mv js/vehicle-analyzer.js js/utils/vehicle-analyzer.js
    echo "  ✅ vehicle-analyzer.js verschoben"
fi

if [ -f "js/version-manager.js" ]; then
    git mv js/version-manager.js js/utils/version-manager.js
    echo "  ✅ version-manager.js verschoben"
fi

if [ -f "js/tutorial.js" ]; then
    git mv js/tutorial.js js/utils/tutorial.js
    echo "  ✅ tutorial.js verschoben"
fi

echo ""
echo "✅ MIGRATION KOMPLETT!"
echo ""
echo "⚠️  NÄCHSTE SCHRITTE:"
echo "1. index.html aktualisieren (Script-Pfade anpassen)"
echo "2. Testen dass alles funktioniert"
echo "3. git add . && git commit -m 'refactor: Complete folder restructuring to v5.0'"
echo "4. git push origin main"
echo ""
echo "Bei Problemen: git reset --hard v4.9.1-pre-migration"
