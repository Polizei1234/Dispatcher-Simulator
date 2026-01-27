# Phase 3: CSS-Reorganisation - Windows PowerShell Script
# Version: 1.1 (Fixed)
# Datum: 27. Januar 2026

$ErrorActionPreference = "Stop"

Write-Host "🎨 ============================================" -ForegroundColor Cyan
Write-Host "🎨 Phase 3: CSS-Reorganisation" -ForegroundColor Cyan
Write-Host "🎨 ============================================" -ForegroundColor Cyan
Write-Host ""

# ⚠️ WARNUNG
Write-Host "⚠️  WARNUNG: Dieser Script wird:" -ForegroundColor Yellow
Write-Host "   1. CSS-Unterordner erstellen"
Write-Host "   2. CSS-Dateien verschieben"
Write-Host "   3. version-config.js aktualisieren"
Write-Host ""

$confirmation = Read-Host "🤔 Fortfahren? (y/n)"
if ($confirmation -ne 'y') {
    Write-Host "❌ Abgebrochen" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "💾 Erstelle Backup-Tag..." -ForegroundColor Yellow
$timestamp = [int][double]::Parse((Get-Date -UFormat %s))
try {
    git tag "v7.4.2-pre-css-restructure-$timestamp" 2>$null
    Write-Host "✅ Backup-Tag erstellt" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backup-Tag konnte nicht erstellt werden (evtl. existiert bereits)" -ForegroundColor Yellow
}
Write-Host ""

# Schritt 1: Ordnerstruktur erstellen
Write-Host "Step 1/4: Erstelle Ordnerstruktur..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "css/components/dropdowns" | Out-Null
New-Item -ItemType Directory -Force -Path "css/radio" | Out-Null
New-Item -ItemType Directory -Force -Path "css/themes" | Out-Null
New-Item -ItemType Directory -Force -Path "css/map" | Out-Null
Write-Host "✅ Ordner erstellt" -ForegroundColor Green
Write-Host ""

# Schritt 2: Dateien verschieben
Write-Host "Step 2/4: Verschiebe CSS-Dateien..." -ForegroundColor Cyan

try {
    # Components
    Write-Host "  📦 Components..." -ForegroundColor Gray
    git mv css/call-system.css css/components/call-system.css
    git mv css/draggable.css css/components/draggable.css
    git mv css/tabs.css css/components/tabs.css

    # Dropdowns
    Write-Host "  🔽 Dropdowns..." -ForegroundColor Gray
    git mv css/keywords-dropdown.css css/components/dropdowns/keywords-dropdown.css
    git mv css/priority-dropdown.css css/components/dropdowns/priority-dropdown.css
    git mv css/universal-dropdown.css css/components/dropdowns/universal-dropdown.css

    # Radio
    Write-Host "  📻 Radio..." -ForegroundColor Gray
    git mv css/radio.css css/radio/radio.css
    if (Test-Path "css/radio-feed.css") {
        git mv css/radio-feed.css css/radio/radio-feed.css
    }
    git mv css/radio-tab.css css/radio/radio-tab.css

    # Themes
    Write-Host "  🎨 Themes..." -ForegroundColor Gray
    git mv css/theme-light.css css/themes/theme-light.css

    # Map
    Write-Host "  🗺️ Map..." -ForegroundColor Gray
    git mv css/map-icons.css css/map/map-icons.css

    Write-Host "✅ Dateien verschoben" -ForegroundColor Green
} catch {
    Write-Host "❌ Fehler beim Verschieben: $_" -ForegroundColor Red
    Write-Host "Rollback wird durchgeführt..." -ForegroundColor Yellow
    git reset --hard HEAD
    exit 1
}
Write-Host ""

# Schritt 3: version-config.js aktualisieren
Write-Host "Step 3/4: Aktualisiere version-config.js..." -ForegroundColor Cyan

try {
    # Backup der Original-Datei
    Copy-Item "js/core/version-config.js" "js/core/version-config.js.backup"

    # Lese die Datei
    $content = Get-Content "js/core/version-config.js" -Raw

    # Neues CSS_FILES Array (OHNE Kommentare im String)
    $newCssFiles = "    CSS_FILES: [`n" +
        "        'css/style.css',`n" +
        "        'css/layout.css',`n" +
        "        `n" +
        "        'css/components/call-system.css',`n" +
        "        'css/components/draggable.css',`n" +
        "        'css/components/tabs.css',`n" +
        "        `n" +
        "        'css/components/dropdowns/keywords-dropdown.css',`n" +
        "        'css/components/dropdowns/priority-dropdown.css',`n" +
        "        'css/components/dropdowns/universal-dropdown.css',`n" +
        "        `n" +
        "        'css/radio/radio.css',`n" +
        "        'css/radio/radio-feed.css',`n" +
        "        'css/radio/radio-tab.css',`n" +
        "        `n" +
        "        'css/themes/theme-light.css',`n" +
        "        `n" +
        "        'css/map/map-icons.css'`n" +
        "    ],"

    # Ersetze CSS_FILES Block (Regex mit Singleline mode)
    $pattern = '(?s)CSS_FILES: \[.*?\],'
    $content = $content -replace $pattern, $newCssFiles

    # Schreibe zurück
    Set-Content "js/core/version-config.js" -Value $content -NoNewline

    # Füge Kommentare manuell hinzu (separater Durchlauf)
    $content = Get-Content "js/core/version-config.js" -Raw
    $content = $content -replace "        'css/components/call-system.css',", "        // Components`n        'css/components/call-system.css',"
    $content = $content -replace "        'css/components/dropdowns/keywords-dropdown.css',", "        // Dropdowns`n        'css/components/dropdowns/keywords-dropdown.css',"
    $content = $content -replace "        'css/radio/radio.css',", "        // Radio`n        'css/radio/radio.css',"
    $content = $content -replace "        'css/themes/theme-light.css',", "        // Themes`n        'css/themes/theme-light.css',"
    $content = $content -replace "        'css/map/map-icons.css'", "        // Map`n        'css/map/map-icons.css'"
    Set-Content "js/core/version-config.js" -Value $content -NoNewline

    Write-Host "✅ version-config.js aktualisiert" -ForegroundColor Green
} catch {
    Write-Host "❌ Fehler beim Aktualisieren: $_" -ForegroundColor Red
    Write-Host "Rollback wird durchgeführt..." -ForegroundColor Yellow
    git reset --hard HEAD
    exit 1
}
Write-Host ""

# Schritt 4: Commit
Write-Host "Step 4/4: Erstelle Commit..." -ForegroundColor Cyan

try {
    git add .
    git commit -m "refactor(css): Phase 3 - CSS-Reorganisation abgeschlossen

Neue Struktur:
- css/components/ fuer UI-Komponenten (call-system, draggable, tabs)
- css/components/dropdowns/ fuer Dropdown-Styles
- css/radio/ fuer Radio-System-Styles
- css/themes/ fuer Theme-Dateien
- css/map/ fuer Karten-Icons

Vorteile:
- Thematische Gruppierung
- Einfachere Wartung
- Bessere Skalierbarkeit
- Kein visueller Unterschied"

    Write-Host ""
    Write-Host "✅✅✅ Phase 3 ERFOLGREICH! ✅✅✅" -ForegroundColor Green
    Write-Host ""
    Write-Host "👀 Naechste Schritte:" -ForegroundColor Cyan
    Write-Host "   1. git push origin main"
    Write-Host "   2. Simulator oeffnen und testen"
    Write-Host "   3. Browser-Cache leeren (Strg+Shift+R)"
    Write-Host "   4. Alle Features pruefen"
    Write-Host ""
    Write-Host "🔙 Rollback (falls noetig):" -ForegroundColor Yellow
    Write-Host "   git reset --hard HEAD~1"
    Write-Host ""
} catch {
    Write-Host "❌ Fehler beim Commit: $_" -ForegroundColor Red
    exit 1
}
