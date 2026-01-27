# Phase 3: CSS-Reorganisation - Windows PowerShell Script
# Version: 1.2 (Simplified)
# Datum: 27. Januar 2026

$ErrorActionPreference = "Stop"

Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Phase 3: CSS-Reorganisation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n" -NoNewline

# Warnung
Write-Host "WARNUNG: Dieser Script wird:" -ForegroundColor Yellow
Write-Host "  1. CSS-Unterordner erstellen" -ForegroundColor White
Write-Host "  2. CSS-Dateien verschieben" -ForegroundColor White
Write-Host "  3. version-config.js aktualisieren" -ForegroundColor White
Write-Host "`n" -NoNewline

$confirmation = Read-Host "Fortfahren? (y/n)"
if ($confirmation -ne 'y') {
    Write-Host "Abgebrochen" -ForegroundColor Red
    exit 1
}

Write-Host "`n" -NoNewline
Write-Host "Erstelle Backup-Tag..." -ForegroundColor Yellow
$timestamp = [int][double]::Parse((Get-Date -UFormat %s))
git tag "v7.4.2-pre-css-$timestamp" 2>$null
Write-Host "Backup-Tag erstellt" -ForegroundColor Green

Write-Host "`n" -NoNewline
Write-Host "Step 1/4: Erstelle Ordnerstruktur..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "css/components/dropdowns" | Out-Null
New-Item -ItemType Directory -Force -Path "css/radio" | Out-Null
New-Item -ItemType Directory -Force -Path "css/themes" | Out-Null
New-Item -ItemType Directory -Force -Path "css/map" | Out-Null
Write-Host "Ordner erstellt" -ForegroundColor Green

Write-Host "`n" -NoNewline
Write-Host "Step 2/4: Verschiebe CSS-Dateien..." -ForegroundColor Cyan

# Components
Write-Host "  Components..." -ForegroundColor Gray
git mv css/call-system.css css/components/call-system.css 2>$null
git mv css/draggable.css css/components/draggable.css 2>$null
git mv css/tabs.css css/components/tabs.css 2>$null

# Dropdowns
Write-Host "  Dropdowns..." -ForegroundColor Gray
git mv css/keywords-dropdown.css css/components/dropdowns/keywords-dropdown.css 2>$null
git mv css/priority-dropdown.css css/components/dropdowns/priority-dropdown.css 2>$null
git mv css/universal-dropdown.css css/components/dropdowns/universal-dropdown.css 2>$null

# Radio
Write-Host "  Radio..." -ForegroundColor Gray
git mv css/radio.css css/radio/radio.css 2>$null
if (Test-Path "css/radio-feed.css") {
    git mv css/radio-feed.css css/radio/radio-feed.css 2>$null
}
git mv css/radio-tab.css css/radio/radio-tab.css 2>$null

# Themes
Write-Host "  Themes..." -ForegroundColor Gray
git mv css/theme-light.css css/themes/theme-light.css 2>$null

# Map
Write-Host "  Map..." -ForegroundColor Gray
git mv css/map-icons.css css/map/map-icons.css 2>$null

Write-Host "Dateien verschoben" -ForegroundColor Green

Write-Host "`n" -NoNewline
Write-Host "Step 3/4: Aktualisiere version-config.js..." -ForegroundColor Cyan

# Backup
Copy-Item "js/core/version-config.js" "js/core/version-config.js.backup"

# Lese Zeile für Zeile und ersetze
$lines = Get-Content "js/core/version-config.js"
$newLines = @()
$inCssBlock = $false
$blockAdded = $false

foreach ($line in $lines) {
    if ($line -match "^\s*CSS_FILES:") {
        $inCssBlock = $true
        # Füge neuen Block hinzu
        $newLines += "    CSS_FILES: ["
        $newLines += "        'css/style.css',"
        $newLines += "        'css/layout.css',"
        $newLines += "        "
        $newLines += "        // Components"
        $newLines += "        'css/components/call-system.css',"
        $newLines += "        'css/components/draggable.css',"
        $newLines += "        'css/components/tabs.css',"
        $newLines += "        "
        $newLines += "        // Dropdowns"
        $newLines += "        'css/components/dropdowns/keywords-dropdown.css',"
        $newLines += "        'css/components/dropdowns/priority-dropdown.css',"
        $newLines += "        'css/components/dropdowns/universal-dropdown.css',"
        $newLines += "        "
        $newLines += "        // Radio"
        $newLines += "        'css/radio/radio.css',"
        $newLines += "        'css/radio/radio-feed.css',"
        $newLines += "        'css/radio/radio-tab.css',"
        $newLines += "        "
        $newLines += "        // Themes"
        $newLines += "        'css/themes/theme-light.css',"
        $newLines += "        "
        $newLines += "        // Map"
        $newLines += "        'css/map/map-icons.css'"
        $newLines += "    ],"
        $blockAdded = $true
        continue
    }
    
    if ($inCssBlock -and $line -match "^\s*\],") {
        $inCssBlock = $false
        continue
    }
    
    if (-not $inCssBlock) {
        $newLines += $line
    }
}

# Schreibe zurück
$newLines | Set-Content "js/core/version-config.js" -Encoding UTF8

Write-Host "version-config.js aktualisiert" -ForegroundColor Green

Write-Host "`n" -NoNewline
Write-Host "Step 4/4: Erstelle Commit..." -ForegroundColor Cyan

git add .
git commit -m "refactor(css): Phase 3 - CSS-Reorganisation abgeschlossen

Neue Struktur:
- css/components/ fuer UI-Komponenten
- css/components/dropdowns/ fuer Dropdown-Styles
- css/radio/ fuer Radio-System
- css/themes/ fuer Themes
- css/map/ fuer Karten-Icons

Vorteile:
- Thematische Gruppierung
- Bessere Wartbarkeit
- Skalierbar"

Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Phase 3 ERFOLGREICH!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`n" -NoNewline

Write-Host "Naechste Schritte:" -ForegroundColor Cyan
Write-Host "  1. git push origin main" -ForegroundColor White
Write-Host "  2. Simulator oeffnen" -ForegroundColor White
Write-Host "  3. Browser-Cache leeren (Strg+Shift+R)" -ForegroundColor White
Write-Host "  4. Alles testen" -ForegroundColor White
Write-Host "`n" -NoNewline

Write-Host "Rollback falls noetig:" -ForegroundColor Yellow
Write-Host "  git reset --hard HEAD~1" -ForegroundColor White
Write-Host "`n" -NoNewline
