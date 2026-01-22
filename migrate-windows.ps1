# DISPATCHER SIMULATOR - WINDOWS MIGRATION v5.0.0

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   DISPATCHER SIMULATOR - MIGRATION v5.0.0     " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "js")) {
    Write-Host "ERROR: js folder not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Project folder found" -ForegroundColor Green
Write-Host ""

function Move-FileWithProgress {
    param($source, $destination)
    
    if (Test-Path $source) {
        $destDir = Split-Path $destination -Parent
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Move-Item -Path $source -Destination $destination -Force
        Write-Host "  OK: $source -> $destination" -ForegroundColor Gray
        return 1
    } else {
        Write-Host "  SKIP: $source (not found)" -ForegroundColor DarkGray
        return 0
    }
}

$totalMoved = 0

Write-Host "Phase 1/5: Core Files" -ForegroundColor Blue
$totalMoved += Move-FileWithProgress "js\config.js" "js\core\config.js"
$totalMoved += Move-FileWithProgress "js\bridge.js" "js\core\bridge.js"
Write-Host ""

Write-Host "Phase 2/5: Systems" -ForegroundColor Red
$totalMoved += Move-FileWithProgress "js\vehicle-movement.js" "js\systems\vehicle-movement.js"
$totalMoved += Move-FileWithProgress "js\call-system.js" "js\systems\call-system.js"
$totalMoved += Move-FileWithProgress "js\ai-incident-generator.js" "js\systems\ai-incident-generator.js"
$totalMoved += Move-FileWithProgress "js\escalation-system.js" "js\systems\escalation-system.js"
$totalMoved += Move-FileWithProgress "js\weather-system.js" "js\systems\weather-system.js"
$totalMoved += Move-FileWithProgress "js\mission-timer.js" "js\systems\mission-timer.js"
$totalMoved += Move-FileWithProgress "js\groq-validator.js" "js\systems\groq-validator.js"
Write-Host ""

Write-Host "Phase 3/5: UI Components" -ForegroundColor Yellow
$totalMoved += Move-FileWithProgress "js\tabs.js" "js\ui\tabs.js"
$totalMoved += Move-FileWithProgress "js\ui.js" "js\ui\ui.js"
$totalMoved += Move-FileWithProgress "js\ui-helpers.js" "js\ui\ui-helpers.js"
$totalMoved += Move-FileWithProgress "js\assignment-ui.js" "js\ui\assignment-ui.js"
$totalMoved += Move-FileWithProgress "js\manual-incident.js" "js\ui\manual-incident.js"
$totalMoved += Move-FileWithProgress "js\protocol-form.js" "js\ui\protocol-form.js"
$totalMoved += Move-FileWithProgress "js\keywords-dropdown.js" "js\ui\keywords-dropdown.js"
$totalMoved += Move-FileWithProgress "js\draggable.js" "js\ui\draggable.js"
Write-Host ""

Write-Host "Phase 4/5: Data Files" -ForegroundColor Green
$totalMoved += Move-FileWithProgress "js\data.js" "js\data\data.js"
$totalMoved += Move-FileWithProgress "js\hospitals.js" "js\data\hospitals.js"
$totalMoved += Move-FileWithProgress "js\fms-codes.json" "js\data\fms-codes.json"
$totalMoved += Move-FileWithProgress "js\incidents.js" "js\data\incidents.js"
Write-Host ""

Write-Host "Phase 5/5: Utils" -ForegroundColor Magenta
$totalMoved += Move-FileWithProgress "js\notification-system.js" "js\utils\notification-system.js"
$totalMoved += Move-FileWithProgress "js\scoring-system.js" "js\utils\scoring-system.js"
$totalMoved += Move-FileWithProgress "js\incident-numbering.js" "js\utils\incident-numbering.js"
$totalMoved += Move-FileWithProgress "js\location-generator.js" "js\utils\location-generator.js"
$totalMoved += Move-FileWithProgress "js\address-service.js" "js\utils\address-service.js"
$totalMoved += Move-FileWithProgress "js\vehicle-analyzer.js" "js\utils\vehicle-analyzer.js"
$totalMoved += Move-FileWithProgress "js\version-manager.js" "js\utils\version-manager.js"
$totalMoved += Move-FileWithProgress "js\tutorial.js" "js\utils\tutorial.js"
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "           MIGRATION COMPLETE!                  " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files moved: $totalMoved" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open GitHub Desktop" -ForegroundColor White
Write-Host "2. Commit with: refactor: Complete folder structure migration to v5.0.0" -ForegroundColor White
Write-Host "3. Push to origin/main" -ForegroundColor White
Write-Host ""
Write-Host "DONE! Press any key..." -ForegroundColor Green
Read-Host
