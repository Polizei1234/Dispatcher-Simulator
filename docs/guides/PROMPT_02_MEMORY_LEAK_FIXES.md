# 🛠️ FIREBASE STUDIO PROMPT 02: Memory Leak Fixes

> **Copy-Paste this prompt into Firebase Studio**

---

## 🎯 PROMPT START

```
ICH BIN EIN DISPATCHER SIMULATOR - WEB-BASIERTES RETTUNGSDIENST-SPIEL.

AKTUELLES PROBLEM:
Memory Leaks durch Event-Listener ohne Cleanup. Bei langem Spielen steigt 
der Memory-Verbrauch kontinuierlich an und führt zu Performance-Problemen 
und eventuellen Crashes.

DEINE AUFGABE:
Implementiere ein umfassendes Cleanup-System für alle Event-Listener im Projekt.

================================================================================
SCHRITT 1: Cleanup-Manager Klasse erstellen
================================================================================

ERSTELLE NEUE DATEI: js/core/cleanup-manager.js

/**
 * CleanupManager - Zentrales Management für Event-Listener Cleanup
 * Verhindert Memory Leaks durch automatisches Tracking und Cleanup
 */
class CleanupManager {
    constructor() {
        this.listeners = new Map(); // componentId -> [listener objects]
        this.intervals = new Map(); // componentId -> [interval IDs]
        this.timeouts = new Map(); // componentId -> [timeout IDs]
    }

    /**
     * Registriere Event-Listener mit automatischem Tracking
     * @param {string} componentId - Eindeutige ID der Komponente (z.B. 'radio-system', 'vehicle-manager')
     * @param {HTMLElement|EventTarget} target - Element auf dem der Listener registriert wird
     * @param {string} event - Event-Name (z.B. 'click', 'change')
     * @param {Function} handler - Event-Handler Funktion
     * @param {Object} options - Event-Listener Optionen
     */
    addEventListener(componentId, target, event, handler, options = {}) {
        // Listener hinzufügen
        target.addEventListener(event, handler, options);
        
        // Für Cleanup tracken
        if (!this.listeners.has(componentId)) {
            this.listeners.set(componentId, []);
        }
        
        this.listeners.get(componentId).push({
            target,
            event,
            handler,
            options
        });
        
        console.log(`🔗 Listener registered: ${componentId} -> ${event}`);
    }

    /**
     * Registriere setInterval mit automatischem Tracking
     */
    setInterval(componentId, callback, delay) {
        const intervalId = setInterval(callback, delay);
        
        if (!this.intervals.has(componentId)) {
            this.intervals.set(componentId, []);
        }
        
        this.intervals.get(componentId).push(intervalId);
        console.log(`⏰ Interval registered: ${componentId} (${delay}ms)`);
        
        return intervalId;
    }

    /**
     * Registriere setTimeout mit automatischem Tracking
     */
    setTimeout(componentId, callback, delay) {
        const timeoutId = setTimeout(() => {
            callback();
            // Automatisch aus Tracking entfernen nach Ausführung
            this.removeTimeout(componentId, timeoutId);
        }, delay);
        
        if (!this.timeouts.has(componentId)) {
            this.timeouts.set(componentId, []);
        }
        
        this.timeouts.get(componentId).push(timeoutId);
        console.log(`⏱️ Timeout registered: ${componentId} (${delay}ms)`);
        
        return timeoutId;
    }

    /**
     * Cleanup einer spezifischen Komponente
     */
    cleanup(componentId) {
        let cleaned = 0;
        
        // Event-Listener cleanen
        if (this.listeners.has(componentId)) {
            const listeners = this.listeners.get(componentId);
            listeners.forEach(({ target, event, handler, options }) => {
                target.removeEventListener(event, handler, options);
                cleaned++;
            });
            this.listeners.delete(componentId);
        }
        
        // Intervals cleanen
        if (this.intervals.has(componentId)) {
            const intervals = this.intervals.get(componentId);
            intervals.forEach(id => clearInterval(id));
            cleaned += intervals.length;
            this.intervals.delete(componentId);
        }
        
        // Timeouts cleanen
        if (this.timeouts.has(componentId)) {
            const timeouts = this.timeouts.get(componentId);
            timeouts.forEach(id => clearTimeout(id));
            cleaned += timeouts.length;
            this.timeouts.delete(componentId);
        }
        
        if (cleaned > 0) {
            console.log(`✅ Cleanup completed: ${componentId} (${cleaned} items removed)`);
        }
    }

    /**
     * Cleanup ALLER Komponenten (z.B. beim Beenden des Spiels)
     */
    cleanupAll() {
        console.log('🧹 Starting global cleanup...');
        
        const components = [
            ...this.listeners.keys(),
            ...this.intervals.keys(),
            ...this.timeouts.keys()
        ];
        
        const uniqueComponents = [...new Set(components)];
        uniqueComponents.forEach(id => this.cleanup(id));
        
        console.log(`✅ Global cleanup completed: ${uniqueComponents.length} components cleaned`);
    }

    /**
     * Hilfsfunktion: Timeout aus Tracking entfernen
     */
    removeTimeout(componentId, timeoutId) {
        if (this.timeouts.has(componentId)) {
            const timeouts = this.timeouts.get(componentId);
            const index = timeouts.indexOf(timeoutId);
            if (index > -1) {
                timeouts.splice(index, 1);
            }
        }
    }

    /**
     * Debug: Zeige aktuell registrierte Listener
     */
    getReport() {
        const report = {
            listeners: {},
            intervals: {},
            timeouts: {},
            total: 0
        };
        
        this.listeners.forEach((list, id) => {
            report.listeners[id] = list.length;
            report.total += list.length;
        });
        
        this.intervals.forEach((list, id) => {
            report.intervals[id] = list.length;
            report.total += list.length;
        });
        
        this.timeouts.forEach((list, id) => {
            report.timeouts[id] = list.length;
            report.total += list.length;
        });
        
        return report;
    }
}

// Singleton Export
const cleanupManager = new CleanupManager();
export default cleanupManager;

// Globales Cleanup beim Seiten-Verlassen
window.addEventListener('beforeunload', () => {
    cleanupManager.cleanupAll();
});

AM ENDE DER DATEI diese Zeile hinzufügen.

================================================================================
SCHRITT 2: RadioSystem migrieren
================================================================================

DATEI: js/systems/radio-system.js

IMPORT am Anfang hinzufügen:
import cleanupManager from '../core/cleanup-manager.js';

SUCHE die initialize() Funktion und ERSETZE alle addEventListener Aufrufe:

VORHER:
this.elements.sendBtn.addEventListener('click', () => this.sendMessage());

NACHHER:
cleanupManager.addEventListener(
    'radio-system',
    this.elements.sendBtn,
    'click',
    () => this.sendMessage()
);

WICHTIG: Mache das für ALLE addEventListener in RadioSystem:
- sendBtn click
- messageInput keypress
- clearBtn click
- vehicleSelect change
- Alle EventBridge Listener

FINDE alle setInterval/setTimeout und ersetze:

VORHER:
this.updateInterval = setInterval(() => this.update(), 1000);

NACHHER:
this.updateInterval = cleanupManager.setInterval(
    'radio-system',
    () => this.update(),
    1000
);

AM ENDE der Klasse hinzufügen:

/**
 * Cleanup beim Zerstören der RadioSystem-Instanz
 */
destroy() {
    cleanupManager.cleanup('radio-system');
    console.log('✅ RadioSystem cleaned up');
}

================================================================================
SCHRITT 3: EscalationSystem migrieren
================================================================================

DATEI: js/systems/escalation-system.js

IMPORT hinzufügen:
import cleanupManager from '../core/cleanup-manager.js';

ERSETZE alle setInterval/setTimeout:

VORHER:
this.checkInterval = setInterval(() => this.checkForEscalations(), 30000);

NACHHER:
this.checkInterval = cleanupManager.setInterval(
    'escalation-system',
    () => this.checkForEscalations(),
    30000
);

AM ENDE der Klasse:

destroy() {
    cleanupManager.cleanup('escalation-system');
    console.log('✅ EscalationSystem cleaned up');
}

================================================================================
SCHRITT 4: VehicleManager migrieren
================================================================================

DATEI: js/systems/vehicle-manager.js

IMPORT hinzufügen:
import cleanupManager from '../core/cleanup-manager.js';

SUCHE alle addEventListener und ersetze mit cleanupManager:

cleanupManager.addEventListener(
    'vehicle-manager',
    element,
    'click',
    handler
);

FINDE die update-Loop und ersetze:

VORHER:
this.updateInterval = setInterval(() => {
    this.vehicles.forEach(v => v.update());
}, 100);

NACHHER:
this.updateInterval = cleanupManager.setInterval(
    'vehicle-manager',
    () => {
        this.vehicles.forEach(v => v.update());
    },
    100
);

AM ENDE:

destroy() {
    cleanupManager.cleanup('vehicle-manager');
    console.log('✅ VehicleManager cleaned up');
}

================================================================================
SCHRITT 5: IncidentManager migrieren
================================================================================

DATEI: js/systems/incident-manager.js

GLEICHE PROZEDUR:
1. Import hinzufügen
2. Alle addEventListener durch cleanupManager.addEventListener ersetzen
3. Alle setInterval/setTimeout durch cleanupManager Varianten ersetzen
4. destroy() Methode hinzufügen

Component-ID: 'incident-manager'

================================================================================
SCHRITT 6: MapSystem migrieren
================================================================================

DATEI: js/systems/map-system.js

Besonders wichtig für Leaflet-Map Events:

cleanupManager.addEventListener(
    'map-system',
    this.map,
    'click',
    (e) => this.handleMapClick(e)
);

cleanupManager.addEventListener(
    'map-system',
    this.map,
    'zoom',
    () => this.handleZoom()
);

Component-ID: 'map-system'

================================================================================
SCHRITT 7: UI-Komponenten migrieren
================================================================================

DATEIEN:
- js/ui/notification-system.js -> Component-ID: 'notification-system'
- js/ui/debug-menu.js -> Component-ID: 'debug-menu'
- js/ui/settings-panel.js -> Component-ID: 'settings-panel'
- js/ui/incident-list.js -> Component-ID: 'incident-list'

Für JEDE Datei:
1. Import cleanupManager
2. Alle addEventListener ersetzen
3. Alle setInterval/setTimeout ersetzen
4. destroy() Methode hinzufügen

================================================================================
SCHRITT 8: Game Timer migrieren
================================================================================

DATEI: js/core/game-timer.js

DIES IST KRITISCH - Timer läuft permanent!

IMPORT hinzufügen:
import cleanupManager from './cleanup-manager.js';

IN start() Methode:

VORHER:
this.intervalId = setInterval(() => {
    this.tick();
}, this.tickRate);

NACHHER:
this.intervalId = cleanupManager.setInterval(
    'game-timer',
    () => this.tick(),
    this.tickRate
);

IN stop() Methode HINZUFÜGEN:
cleanupManager.cleanup('game-timer');

================================================================================
SCHRITT 9: Main.js Integration
================================================================================

DATEI: js/main.js

AM ANFANG importieren:
import cleanupManager from './core/cleanup-manager.js';

NACH DER INITIALISIERUNG aller Systeme hinzufügen:

// Globales Cleanup beim Beenden
window.addEventListener('beforeunload', () => {
    console.log('🚨 App closing - triggering global cleanup...');
    cleanupManager.cleanupAll();
});

// Debug-Befehl für Konsole
window.cleanupReport = () => {
    const report = cleanupManager.getReport();
    console.table(report.listeners);
    console.table(report.intervals);
    console.table(report.timeouts);
    console.log(`Total tracked items: ${report.total}`);
};

console.log('🔗 CleanupManager active. Type "cleanupReport()" for status.');

================================================================================
SCHRITT 10: Debug-Menu Integration
================================================================================

DATEI: js/ui/debug-menu.js

IM Debug-Menü neuen Eintrag hinzufügen:

const memorySection = document.createElement('div');
memorySection.className = 'debug-section';
memorySection.innerHTML = `
    <h3>🧹 Memory Management</h3>
    <button id="cleanup-report-btn">Show Cleanup Report</button>
    <button id="force-cleanup-btn">Force Global Cleanup</button>
    <div id="cleanup-status"></div>
`;

debugPanel.appendChild(memorySection);

// Event-Listener
document.getElementById('cleanup-report-btn').addEventListener('click', () => {
    const report = cleanupManager.getReport();
    const statusDiv = document.getElementById('cleanup-status');
    statusDiv.innerHTML = `
        <pre>${JSON.stringify(report, null, 2)}</pre>
    `;
});

document.getElementById('force-cleanup-btn').addEventListener('click', () => {
    if (confirm('Force cleanup? This may affect running systems!')) {
        cleanupManager.cleanupAll();
        alert('Cleanup completed!');
    }
});

================================================================================
SCHRITT 11: Testing
================================================================================

1. Öffne die App im Browser
2. Öffne Developer Tools (F12)
3. Wechsel zum "Memory" Tab
4. Mache einen Heap Snapshot (Baseline)
5. Spiele 10 Minuten:
   - Erstelle Einsätze
   - Disponiere Fahrzeuge
   - Sende Funksprüche
   - Öffne/Schließe Menus
6. Mache zweiten Heap Snapshot
7. Vergleiche: Memory sollte NICHT kontinuierlich wachsen

**In der Console testen:**

// Zeige Cleanup-Report
cleanupReport();

// Sollte alle registrierten Listener zeigen
// Keine "orphaned" Listener

**Memory Leak Test:**

// Vorher
const before = performance.memory.usedJSHeapSize;

// Aktivität simulieren (10x)
for (let i = 0; i < 10; i++) {
    // Einsatz erstellen & löschen
    // Fahrzeug disponieren & zurückkehren
}

// Nachher
const after = performance.memory.usedJSHeapSize;
const diff = (after - before) / 1024 / 1024;

console.log(`Memory difference: ${diff.toFixed(2)} MB`);
// Sollte < 5 MB sein!

================================================================================
ERWARTETES ERGEBNIS:
================================================================================

✅ Keine Memory Leaks mehr bei:
   - Event-Listenern
   - Intervals
   - Timeouts

✅ Memory-Verbrauch stabil:
   - Vorher: Kontinuierlicher Anstieg
   - Nachher: Stabil nach Initial-Load

✅ Debug-Transparenz:
   - cleanupReport() zeigt alle Listener
   - Einfaches Tracking
   - Force-Cleanup möglich

✅ Alle Systeme funktionieren weiterhin normal

================================================================================
FEHLER-BEHANDLUNG:
================================================================================

FALLS "CleanupManager is not defined":
→ Import vergessen in der Datei hinzufügen

FALLS Events nicht mehr funktionieren:
→ Prüfe ob addEventListener korrekt durch cleanupManager ersetzt wurde

FALLS Intervals stoppen:
→ Prüfe ob destroy() versehentlich aufgerufen wird

FALLS Memory immer noch wächst:
→ Prüfe ob ALLE Systeme migriert wurden
→ Nutze Chrome DevTools Memory Profiler

================================================================================
VERIFIZIERUNG:
================================================================================

Nach Implementierung prüfen:

1. ✅ Datei js/core/cleanup-manager.js existiert
2. ✅ Alle imports von cleanupManager vorhanden
3. ✅ Keine direkten addEventListener mehr (nur cleanupManager)
4. ✅ Keine direkten setInterval/setTimeout mehr (nur cleanupManager)
5. ✅ Alle Systeme haben destroy() Methode
6. ✅ window.cleanupReport() funktioniert
7. ✅ Debug-Menu hat Memory-Section
8. ✅ Memory-Test zeigt stabilen Verbrauch

================================================================================
```

## 🎯 PROMPT ENDE

---

**Nächster Prompt:** PROMPT_03_TEMPLATE_DUPLIKATE.md

**Status:** ✅ Ready to copy-paste