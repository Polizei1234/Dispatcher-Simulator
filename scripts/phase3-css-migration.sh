#!/bin/bash
# Phase 3: CSS-Reorganisation - Automatisches Migrations-Script
# Version: 1.0
# Datum: 27. Januar 2026

set -e  # Stoppe bei Fehler

echo "🎨 ============================================="
echo "🎨 Phase 3: CSS-Reorganisation"
echo "🎨 ============================================="
echo ""

# Farben
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ⚠️ WARNUNG
echo -e "${YELLOW}⚠️  WARNUNG: Dieser Script wird:${NC}"
echo "   1. CSS-Unterordner erstellen"
echo "   2. CSS-Dateien verschieben"
echo "   3. version-config.js aktualisieren"
echo ""
read -p "🤔 Fortfahren? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Abgebrochen"
    exit 1
fi

echo ""
echo "💾 Erstelle Backup-Tag..."
git tag "v7.4.2-pre-css-restructure-$(date +%s)" 2>/dev/null || true
echo -e "${GREEN}✅ Backup-Tag erstellt${NC}"
echo ""

# Schritt 1: Ordnerstruktur erstellen
echo "Step 1/4: Erstelle Ordnerstruktur..."
mkdir -p css/components/dropdowns
mkdir -p css/radio
mkdir -p css/themes
mkdir -p css/map
echo -e "${GREEN}✅ Ordner erstellt${NC}"
echo ""

# Schritt 2: Dateien verschieben
echo "Step 2/4: Verschiebe CSS-Dateien..."

# Components
echo "  📦 Components..."
git mv css/call-system.css css/components/call-system.css
git mv css/draggable.css css/components/draggable.css
git mv css/tabs.css css/components/tabs.css

# Dropdowns
echo "  🔽 Dropdowns..."
git mv css/keywords-dropdown.css css/components/dropdowns/keywords-dropdown.css
git mv css/priority-dropdown.css css/components/dropdowns/priority-dropdown.css
git mv css/universal-dropdown.css css/components/dropdowns/universal-dropdown.css

# Radio
echo "  📻 Radio..."
git mv css/radio.css css/radio/radio.css
git mv css/radio-feed.css css/radio/radio-feed.css 2>/dev/null || true
git mv css/radio-tab.css css/radio/radio-tab.css

# Themes
echo "  🎨 Themes..."
git mv css/theme-light.css css/themes/theme-light.css

# Map
echo "  🗺️ Map..."
git mv css/map-icons.css css/map/map-icons.css

echo -e "${GREEN}✅ Dateien verschoben${NC}"
echo ""

# Schritt 3: version-config.js aktualisieren
echo "Step 3/4: Aktualisiere version-config.js..."

# Erstelle neue CSS_FILES Array
cat > /tmp/css-files-new.txt << 'EOF'
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
EOF

# Backup der Original-Datei
cp js/core/version-config.js js/core/version-config.js.backup

# Ersetze CSS_FILES Block
awk '
    /CSS_FILES: \[/ { 
        print "    CSS_FILES: ["
        print "        \047css/style.css\047,"
        print "        \047css/layout.css\047,"
        print "        "
        print "        // Components"
        print "        \047css/components/call-system.css\047,"
        print "        \047css/components/draggable.css\047,"
        print "        \047css/components/tabs.css\047,"
        print "        "
        print "        // Dropdowns"
        print "        \047css/components/dropdowns/keywords-dropdown.css\047,"
        print "        \047css/components/dropdowns/priority-dropdown.css\047,"
        print "        \047css/components/dropdowns/universal-dropdown.css\047,"
        print "        "
        print "        // Radio"
        print "        \047css/radio/radio.css\047,"
        print "        \047css/radio/radio-feed.css\047,"
        print "        \047css/radio/radio-tab.css\047,"
        print "        "
        print "        // Themes"
        print "        \047css/themes/theme-light.css\047,"
        print "        "
        print "        // Map"
        print "        \047css/map/map-icons.css\047"
        print "    ],"
        skip = 1
        next
    }
    skip && /],/ { skip = 0; next }
    !skip { print }
' js/core/version-config.js.backup > js/core/version-config.js

echo -e "${GREEN}✅ version-config.js aktualisiert${NC}"
echo ""

# Schritt 4: Commit
echo "Step 4/4: Erstelle Commit..."
git add .
git commit -m "refactor(css): Phase 3 - CSS-Reorganisation abgeschlossen

🎨 Neue Struktur:
- css/components/ für UI-Komponenten (call-system, draggable, tabs)
- css/components/dropdowns/ für Dropdown-Styles
- css/radio/ für Radio-System-Styles
- css/themes/ für Theme-Dateien
- css/map/ für Karten-Icons

✅ Vorteile:
- Thematische Gruppierung
- Einfachere Wartung
- Bessere Skalierbarkeit
- Kein visueller Unterschied"

echo ""
echo -e "${GREEN}✅✅✅ Phase 3 ERFOLGREICH! ✅✅✅${NC}"
echo ""
echo "👀 Nächste Schritte:"
echo "   1. Simulator öffnen und testen"
echo "   2. Browser-Cache leeren (Strg+Shift+R)"
echo "   3. Alle Features prüfen"
echo ""
echo "🔙 Rollback (falls nötig):"
echo "   git reset --hard HEAD~1"
echo ""
