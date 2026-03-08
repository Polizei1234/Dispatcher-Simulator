# 📋 FIREBASE STUDIO PROMPT 04: State-Manager Implementation

> **Copy-Paste this prompt into Firebase Studio - WICHTIGSTES FUNDAMENT!**

---

## 🎯 PROMPT START

```
ICH BIN EIN DISPATCHER SIMULATOR - WEB-BASIERTES RETTUNGSDIENST-SPIEL.

AKTUELLES PROBLEM:
State ist über viele globale Variablen verteilt:
- let vehicles = [];
- let incidents = [];
- let gameTime = {...};
- window.currentWeather = {...};

Das führt zu:
- Race Conditions bei asynchronen Updates
- Schwierige Debugging (kein Single Source of Truth)
- Inkonsistente Daten
- Keine History für Time-Travel Debugging

DEINE AUFGABE:
Implementiere einen zentralen State-Manager mit:
- Immutable Updates
- Subscription-System
- History für Debugging
- Nested Property Access

================================================================================
SCHRITT 1: State-Manager Klasse erstellen
================================================================================

ERSTELLE NEUE DATEI: js/core/state-manager.js

/**
 * StateManager - Zentraler State Store für die gesamte App
 * 
 * Features:
 * - Immutable State Updates
 * - Subscription System (Observer Pattern)
 * - History für Time-Travel Debugging
 * - Nested Property Access
 * - Import/Export für Save/Load
 */
class StateManager {
    constructor() {
        // Initialer State
        this.state = {
            // Fahrzeuge
            vehicles: new Map(), // vehicleId -> vehicle object
            
            // Einsätze
            incidents: new Map(), // incidentId -> incident object
            
            // Spielzeit
            gameTime: {
                current: new Date(),
                speed: 1, // 1x Echtzeit
                isPaused: false,
                startTime: new Date()
            },
            
            // Wetter
            weather: {
                condition: 'clear', // clear, rain, snow, fog, storm
                temperature: 20, // Celsius
                windSpeed: 0, // km/h
                visibility: 10, // km
                lastUpdate: new Date()
            },
            
            // Einstellungen
            settings: {
                maxConcurrentIncidents: 5,
                autoDispatch: false,
                soundEnabled: true,
                soundVolume: 0.7,
                mapZoom: 13,
                language: 'de',
                difficulty: 'medium' // easy, medium, hard
            },
            
            // Statistiken
            statistics: {
                totalIncidents: 0,
                completedIncidents: 0,
                failedIncidents: 0,
                avgResponseTime: 0, // Sekunden
                totalPlayTime: 0, // Sekunden
                scores: {
                    current: 0,
                    highscore: 0
                }
            },
            
            // UI State
            ui: {
                activePanel: null, // 'radio', 'incidents', 'settings', null
                selectedVehicle: null,
                selectedIncident: null,
                notifications: [],
                debugMode: false
            },
            
            // Radio System
            radio: {
                messages: [], // Array von Funkspruch-Objekten
                unreadCount: 0,
                selectedVehicle: null,
                autoSendEnabled: true
            },
            
            // Karte
            map: {
                center: { lat: 48.8295, lon: 9.3169 }, // Waiblingen
                zoom: 13,
                bounds: null,
                markers: new Map() // markerId -> marker object
            }
        };
        
        // Listener: path -> [callback functions]
        this.listeners = new Map();
        
        // History für Time-Travel Debugging
        this.history = [];
        this.maxHistorySize = 100; // Letzte 100 Änderungen
        
        // Performance
        this.batchUpdates = [];
        this.batchTimeout = null;
    }

    // ========================================
    // GETTER & SETTER
    // ========================================

    /**
     * Holt einen Wert aus dem State
     * @param {string} path - Pfad zum Wert (z.B. 'vehicles', 'gameTime.speed')
     * @returns {any} Der Wert am Pfad
     */
    getState(path) {
        if (!path || path === '') {
            return this.state;
        }
        
        return this.getNestedProperty(this.state, path);
    }

    /**
     * Setzt einen Wert im State (immutable!)
     * @param {string} path - Pfad zum Wert
     * @param {any} value - Neuer Wert
     * @param {string} action - Aktion für History (optional)
     */
    setState(path, value, action = 'UPDATE') {
        // Alten State für History speichern
        const oldValue = this.getState(path);
        const oldState = this.cloneState();
        
        // State updaten
        this.setNestedProperty(this.state, path, value);
        
        // History hinzufügen
        this.addToHistory({
            timestamp: Date.now(),
            action,
            path,
            oldValue: this.serialize(oldValue),
            newValue: this.serialize(value)
        });
        
        // Listener benachrichtigen
        this.notifyListeners(path, value, oldState);
    }

    /**
     * Batch-Update: Mehrere Updates gesammelt ausführen
     * Reduziert Anzahl der Listener-Calls
     */
    batchUpdate(updates) {
        const oldState = this.cloneState();
        
        updates.forEach(({ path, value, action }) => {
            this.setNestedProperty(this.state, path, value);
            
            this.addToHistory({
                timestamp: Date.now(),
                action: action || 'BATCH_UPDATE',
                path,
                oldValue: this.serialize(this.getNestedProperty(oldState, path)),
                newValue: this.serialize(value)
            });
        });
        
        // Alle Listener einmal benachrichtigen
        const affectedPaths = [...new Set(updates.map(u => u.path))];
        affectedPaths.forEach(path => {
            this.notifyListeners(path, this.getState(path), oldState);
        });
    }

    // ========================================
    // SUBSCRIPTION SYSTEM
    // ========================================

    /**
     * Registriere einen Listener für State-Änderungen
     * @param {string} path - Pfad zu beobachten (z.B. 'vehicles', 'gameTime.speed')
     * @param {Function} callback - Funktion die bei Änderung aufgerufen wird
     * @returns {Function} Unsubscribe-Funktion
     */
    subscribe(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, []);
        }
        
        this.listeners.get(path).push(callback);
        console.log(`📡 Subscribed to: ${path}`);
        
        // Initialer Call mit aktuellem Wert
        callback(this.getState(path), this.state);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(path);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                    console.log(`🚫 Unsubscribed from: ${path}`);
                }
            }
        };
    }

    /**
     * Benachrichtige alle Listener die von einer Änderung betroffen sind
     */
    notifyListeners(path, value, oldState) {
        // 1. Exakte Path-Listener
        if (this.listeners.has(path)) {
            this.listeners.get(path).forEach(callback => {
                try {
                    callback(value, oldState);
                } catch (error) {
                    console.error(`Error in listener for ${path}:`, error);
                }
            });
        }
        
        // 2. Wildcard-Listener (z.B. 'vehicles.*' hört auf alle vehicle Änderungen)
        const pathParts = path.split('.');
        for (let i = pathParts.length; i > 0; i--) {
            const wildcardPath = pathParts.slice(0, i).join('.') + '.*';
            if (this.listeners.has(wildcardPath)) {
                this.listeners.get(wildcardPath).forEach(callback => {
                    try {
                        callback(value, oldState);
                    } catch (error) {
                        console.error(`Error in wildcard listener for ${wildcardPath}:`, error);
                    }
                });
            }
        }
        
        // 3. Global-Listener ('*' hört auf ALLE Änderungen)
        if (this.listeners.has('*')) {
            this.listeners.get('*').forEach(callback => {
                try {
                    callback(this.state, oldState);
                } catch (error) {
                    console.error('Error in global listener:', error);
                }
            });
        }
    }

    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    /**
     * Holt verschachtelte Property
     * @example getNestedProperty({a: {b: {c: 5}}}, 'a.b.c') // returns 5
     */
    getNestedProperty(obj, path) {
        return path.split('.').reduce((acc, part) => {
            if (acc === null || acc === undefined) return undefined;
            return acc[part];
        }, obj);
    }

    /**
     * Setzt verschachtelte Property
     * @example setNestedProperty({a: {b: {}}}, 'a.b.c', 5) // {a: {b: {c: 5}}}
     */
    setNestedProperty(obj, path, value) {
        const parts = path.split('.');
        const last = parts.pop();
        const target = parts.reduce((acc, part) => {
            if (!acc[part]) acc[part] = {};
            return acc[part];
        }, obj);
        target[last] = value;
    }

    /**
     * Deep Clone des State
     */
    cloneState() {
        return JSON.parse(JSON.stringify(this.state, (key, value) => {
            // Maps zu Arrays konvertieren für JSON
            if (value instanceof Map) {
                return Array.from(value.entries());
            }
            return value;
        }));
    }

    /**
     * Serialisiert Werte für History
     */
    serialize(value) {
        if (value instanceof Map) {
            return Array.from(value.entries());
        }
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
    }

    // ========================================
    // HISTORY & DEBUGGING
    // ========================================

    /**
     * Fügt Eintrag zur History hinzu
     */
    addToHistory(entry) {
        this.history.push(entry);
        
        // History-Limit beachten
        if (this.history.length > this.maxHistorySize) {
            this.history.shift(); // Ältesten Eintrag entfernen
        }
    }

    /**
     * Holt History
     * @param {number} limit - Anzahl letzter Einträge (optional)
     */
    getHistory(limit = null) {
        if (limit) {
            return this.history.slice(-limit);
        }
        return this.history;
    }

    /**
     * Rückgängig machen (undo)
     * @param {number} steps - Anzahl Schritte zurück (default: 1)
     */
    undo(steps = 1) {
        if (this.history.length === 0) {
            console.warn('No history to undo');
            return;
        }
        
        for (let i = 0; i < steps && this.history.length > 0; i++) {
            const lastEntry = this.history.pop();
            
            // Alten Wert wiederherstellen
            this.setNestedProperty(this.state, lastEntry.path, lastEntry.oldValue);
            
            // Listener benachrichtigen
            this.notifyListeners(lastEntry.path, lastEntry.oldValue, this.state);
        }
        
        console.log(`↩️ Undo ${steps} step(s)`);
    }

    /**
     * Zeigt History in Console
     */
    printHistory(limit = 10) {
        console.group('📜 State History (last ' + limit + ' changes)');
        this.getHistory(limit).forEach((entry, index) => {
            console.log(`${index + 1}. [${entry.action}] ${entry.path}:`, {
                old: entry.oldValue,
                new: entry.newValue,
                time: new Date(entry.timestamp).toLocaleTimeString()
            });
        });
        console.groupEnd();
    }

    // ========================================
    // SAVE / LOAD
    // ========================================

    /**
     * Exportiert State als JSON
     */
    exportState() {
        return JSON.stringify(this.state, (key, value) => {
            if (value instanceof Map) {
                return {
                    dataType: 'Map',
                    value: Array.from(value.entries())
                };
            }
            return value;
        }, 2);
    }

    /**
     * Importiert State aus JSON
     */
    importState(jsonState) {
        try {
            const parsed = JSON.parse(jsonState, (key, value) => {
                // Maps wiederherstellen
                if (value && value.dataType === 'Map') {
                    return new Map(value.value);
                }
                return value;
            });
            
            this.state = parsed;
            
            // Alle Listener benachrichtigen
            this.notifyListeners('*', this.state, {});
            
            console.log('✅ State imported successfully');
        } catch (error) {
            console.error('Failed to import state:', error);
        }
    }

    /**
     * Reset State zu Initial-Werten
     */
    reset() {
        const oldState = this.cloneState();
        
        // Neuen State erstellen (Constructor logic wiederholen)
        this.state = new StateManager().state;
        
        // History leeren
        this.history = [];
        
        // Listener benachrichtigen
        this.notifyListeners('*', this.state, oldState);
        
        console.log('🔄 State reset to initial values');
    }

    // ========================================
    // DEBUG HELPERS
    // ========================================

    /**
     * Gibt Übersicht über State
     */
    getReport() {
        return {
            vehicles: this.state.vehicles.size,
            incidents: this.state.incidents.size,
            listeners: this.listeners.size,
            historySize: this.history.length,
            lastUpdate: this.history[this.history.length - 1]?.timestamp
        };
    }

    /**
     * Gibt kompletten State in Console aus
     */
    debug() {
        console.group('🔍 State Debug');
        console.log('State:', this.state);
        console.log('Listeners:', this.listeners);
        console.log('History:', this.history);
        console.log('Report:', this.getReport());
        console.groupEnd();
    }
}

// ========================================
// SINGLETON EXPORT
// ========================================

const gameState = new StateManager();

// Globaler Zugriff für Debugging
if (typeof window !== 'undefined') {
    window.gameState = gameState;
    console.log('📋 StateManager initialized');
    console.log('  • Debug: gameState.debug()');
    console.log('  • History: gameState.printHistory()');
    console.log('  • Export: gameState.exportState()');
}

export default gameState;

AM ENDE DER DATEI diese Zeilen hinzufügen.

================================================================================
SCHRITT 2: Integration in Main.js
================================================================================

DATEI: js/main.js

AM ANFANG importieren:
import gameState from './core/state-manager.js';

NACH der Initialisierung aller Systeme:

// State-Manager initialisieren
console.log('🚀 Initializing State-Manager...');

// Initial State setzen
gameState.setState('gameTime.startTime', new Date(), 'INIT');
gameState.setState('settings.language', 'de', 'INIT');

// Debug-Befehle registrieren
window.stateDebug = () => gameState.debug();
window.stateHistory = (limit = 10) => gameState.printHistory(limit);
window.stateExport = () => {
    const json = gameState.exportState();
    console.log(json);
    return json;
};

console.log('✅ State-Manager ready');
console.log('  Debug commands:');
console.log('  - stateDebug()');
console.log('  - stateHistory()');
console.log('  - stateExport()');

================================================================================
SCHRITT 3: Migration VehicleManager
================================================================================

DATEI: js/systems/vehicle-manager.js

IMPORT hinzufügen:
import gameState from '../core/state-manager.js';

VORHER (globale Variable):
let vehicles = [];

function addVehicle(vehicle) {
    vehicles.push(vehicle);
    updateUI();
}

NACHHER (State-Manager):

function addVehicle(vehicle) {
    const vehicles = gameState.getState('vehicles');
    vehicles.set(vehicle.id, vehicle);
    gameState.setState('vehicles', vehicles, 'ADD_VEHICLE');
}

// UI reagiert automatisch auf Änderungen
gameState.subscribe('vehicles', (vehicles) => {
    updateVehicleList(Array.from(vehicles.values()));
});

WICHTIG: Ersetze ALLE Zugriffe auf globale vehicles-Variable!

BEISPIELE:

// Fahrzeug holen
VORHER: const vehicle = vehicles.find(v => v.id === id);
NACHHER: const vehicle = gameState.getState('vehicles').get(id);

// Fahrzeug updaten
VORHER: 
  const v = vehicles.find(v => v.id === id);
  v.status = 'busy';
  
NACHHER:
  const vehicles = gameState.getState('vehicles');
  const vehicle = vehicles.get(id);
  vehicle.status = 'busy';
  gameState.setState('vehicles', vehicles, 'UPDATE_VEHICLE_STATUS');

// Alle Fahrzeuge iterieren
VORHER: vehicles.forEach(v => ...)
NACHHER: gameState.getState('vehicles').forEach(v => ...)

================================================================================
SCHRITT 4: Migration IncidentManager
================================================================================

DATEI: js/systems/incident-manager.js

GLEICHE PROZEDUR wie VehicleManager:

1. Import gameState
2. Ersetze globale incidents-Variable
3. Nutze gameState.getState('incidents')
4. Nutze gameState.setState('incidents', ...)
5. Subscribe auf Änderungen für UI-Updates

BEISPIEL:

function createIncident(data) {
    const incidents = gameState.getState('incidents');
    const newIncident = {
        id: generateId(),
        ...data,
        status: 'pending',
        createdAt: Date.now()
    };
    
    incidents.set(newIncident.id, newIncident);
    gameState.setState('incidents', incidents, 'CREATE_INCIDENT');
    
    return newIncident;
}

// UI Auto-Update
gameState.subscribe('incidents', (incidents) => {
    updateIncidentList(Array.from(incidents.values()));
});

================================================================================
SCHRITT 5: Migration GameTimer
================================================================================

DATEI: js/core/game-timer.js

IMPORT:
import gameState from './state-manager.js';

VORHER:
let currentTime = new Date();
let speed = 1;
let isPaused = false;

NACHHER:

function tick() {
    const gameTime = gameState.getState('gameTime');
    
    if (!gameTime.isPaused) {
        const newTime = new Date(gameTime.current.getTime() + (1000 * gameTime.speed));
        
        gameState.setState('gameTime.current', newTime, 'TICK');
    }
}

// UI hört auf Zeit-Änderungen
gameState.subscribe('gameTime.current', (time) => {
    updateClockDisplay(time);
});

function setSpeed(speed) {
    gameState.setState('gameTime.speed', speed, 'SET_SPEED');
}

function pause() {
    gameState.setState('gameTime.isPaused', true, 'PAUSE');
}

function resume() {
    gameState.setState('gameTime.isPaused', false, 'RESUME');
}

================================================================================
SCHRITT 6: Migration WeatherSystem
================================================================================

DATEI: js/systems/weather-system.js

IMPORT:
import gameState from '../core/state-manager.js';

function updateWeather(newWeather) {
    gameState.setState('weather', {
        ...newWeather,
        lastUpdate: new Date()
    }, 'UPDATE_WEATHER');
}

// UI reagiert auf Wetteränderungen
gameState.subscribe('weather', (weather) => {
    updateWeatherDisplay(weather);
    updateMapWeatherOverlay(weather);
});

// Wetter-Effekte auf Gameplay
gameState.subscribe('weather.condition', (condition) => {
    if (condition === 'rain') {
        // Fahrzeuge langsamer
        applySpeedModifier(0.8);
    } else if (condition === 'snow') {
        applySpeedModifier(0.6);
    }
});

================================================================================
SCHRITT 7: Migration UI-Komponenten
================================================================================

DATEIEN:
- js/ui/notification-system.js
- js/ui/radio-panel.js
- js/ui/incident-list.js
- js/ui/settings-panel.js

Für JEDE Komponente:

1. Import gameState
2. Ersetze lokale State-Variablen
3. Nutze gameState für Daten
4. Subscribe auf relevante Pfade

BEISPIEL NotificationSystem:

function showNotification(message, type) {
    const notifications = gameState.getState('ui.notifications');
    
    notifications.push({
        id: generateId(),
        message,
        type,
        timestamp: Date.now()
    });
    
    gameState.setState('ui.notifications', notifications, 'ADD_NOTIFICATION');
}

// UI Auto-Update
gameState.subscribe('ui.notifications', (notifications) => {
    renderNotifications(notifications);
});

================================================================================
SCHRITT 8: RadioSystem Integration
================================================================================

DATEI: js/systems/radio-system.js

IMPORT:
import gameState from '../core/state-manager.js';

function sendMessage(message) {
    const messages = gameState.getState('radio.messages');
    
    messages.push({
        id: generateId(),
        ...message,
        timestamp: Date.now()
    });
    
    gameState.batchUpdate([
        { path: 'radio.messages', value: messages, action: 'SEND_MESSAGE' },
        { path: 'radio.unreadCount', value: gameState.getState('radio.unreadCount') + 1, action: 'INCREMENT_UNREAD' }
    ]);
}

// UI reagiert
gameState.subscribe('radio.messages', (messages) => {
    updateRadioMessageList(messages);
});

gameState.subscribe('radio.unreadCount', (count) => {
    updateUnreadBadge(count);
});

================================================================================
SCHRITT 9: Settings Integration
================================================================================

DATEI: js/ui/settings-panel.js

function updateSetting(key, value) {
    gameState.setState(`settings.${key}`, value, 'UPDATE_SETTING');
    
    // Settings automatisch in LocalStorage speichern
    localStorage.setItem('gameSettings', gameState.exportState());
}

// Laden beim Start
function loadSettings() {
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
        gameState.importState(saved);
    }
}

// UI Bindings
gameState.subscribe('settings.soundVolume', (volume) => {
    updateVolumeSlider(volume);
    updateAudioVolume(volume);
});

gameState.subscribe('settings.mapZoom', (zoom) => {
    map.setZoom(zoom);
});

================================================================================
SCHRITT 10: Debug-Menu Integration
================================================================================

DATEI: js/ui/debug-menu.js

NEUEN BEREICH hinzufügen:

const stateSection = document.createElement('div');
stateSection.className = 'debug-section';
stateSection.innerHTML = `
    <h3>📋 State Management</h3>
    <div class="state-info">
        <p>Vehicles: <span id="state-vehicles">0</span></p>
        <p>Incidents: <span id="state-incidents">0</span></p>
        <p>Listeners: <span id="state-listeners">0</span></p>
        <p>History: <span id="state-history">0</span></p>
    </div>
    <button id="state-debug-btn">Show State</button>
    <button id="state-history-btn">Show History</button>
    <button id="state-export-btn">Export State</button>
    <button id="state-undo-btn">Undo Last Change</button>
`;

debugPanel.appendChild(stateSection);

// Live-Updates
setInterval(() => {
    const report = gameState.getReport();
    document.getElementById('state-vehicles').textContent = report.vehicles;
    document.getElementById('state-incidents').textContent = report.incidents;
    document.getElementById('state-listeners').textContent = report.listeners;
    document.getElementById('state-history').textContent = report.historySize;
}, 1000);

// Button Events
document.getElementById('state-debug-btn').addEventListener('click', () => {
    gameState.debug();
});

document.getElementById('state-history-btn').addEventListener('click', () => {
    gameState.printHistory(20);
});

document.getElementById('state-export-btn').addEventListener('click', () => {
    const json = gameState.exportState();
    downloadJSON(json, 'game-state.json');
});

document.getElementById('state-undo-btn').addEventListener('click', () => {
    gameState.undo();
});

================================================================================
SCHRITT 11: Testing
================================================================================

1. STARTE die App
2. Öffne Console (F12)
3. TESTE State-Zugriffe:

// State lesen
gameState.getState('vehicles');
gameState.getState('gameTime.speed');

// State setzen
gameState.setState('gameTime.speed', 2);
gameState.setState('settings.soundEnabled', false);

// Subscribe testen
const unsub = gameState.subscribe('gameTime.current', (time) => {
    console.log('Time changed:', time);
});

// Später unsubscribe
unsub();

// History
gameState.printHistory();

// Undo
gameState.undo();

// Export/Import
const exported = gameState.exportState();
console.log(exported);
gameState.importState(exported);

4. PRÜFE Race Conditions:

// Schnelle Updates
for (let i = 0; i < 100; i++) {
    gameState.setState('gameTime.speed', i);
}

// Sollte keine Fehler werfen
// History sollte 100 Einträge haben

5. PRÜFE Subscriptions:

let callCount = 0;
gameState.subscribe('vehicles', () => {
    callCount++;
});

// Fahrzeug hinzufügen sollte Listener triggern
addVehicle({...});

console.log('Listener called:', callCount, 'times');
// Sollte 2 sein (1x initial, 1x bei add)

================================================================================
ERWARTETES ERGEBNIS:
================================================================================

✅ Zentraler State:
   - Alle Daten in einem Objekt
   - Single Source of Truth
   - Keine globalen Variablen mehr

✅ Immutable Updates:
   - Keine direkten Mutations
   - History funktioniert
   - Time-Travel Debugging möglich

✅ Reaktive UI:
   - UI updated automatisch bei State-Änderungen
   - Keine manuellen updateUI() Calls mehr
   - Loose Coupling

✅ Debugging:
   - State jederzeit inspizierbar
   - History zeigt alle Änderungen
   - Export/Import für Save/Load

✅ Performance:
   - Batch-Updates reduzieren Listener-Calls
   - Wildcard-Subscriptions möglich

================================================================================
FEHLER-BEHANDLUNG:
================================================================================

FALLS "Cannot read property ... of undefined":
→ Path ist falsch oder Property existiert nicht
→ gameState.debug() zeigen lassen

FALLS Listener nicht triggert:
→ Subscription-Path prüfen
→ setState() wird aufgerufen?

FALLS State nicht persistiert:
→ exportState() / importState() richtig genutzt?
→ LocalStorage vorhanden?

FALLS zu viele Listener-Calls:
→ batchUpdate() nutzen statt einzelne setState()

================================================================================
VERIFIZIERUNG:
================================================================================

Nach Implementierung prüfen:

1. ✅ Datei js/core/state-manager.js existiert
2. ✅ window.gameState verfügbar
3. ✅ Keine globalen Variablen mehr (vehicles, incidents, etc.)
4. ✅ Alle Systeme nutzen gameState
5. ✅ UI reagiert auf State-Änderungen
6. ✅ History funktioniert
7. ✅ Export/Import funktioniert
8. ✅ Undo funktioniert
9. ✅ Debug-Commands funktionieren
10. ✅ Performance ist gut (< 16ms Updates)

================================================================================
```

## 🎯 PROMPT ENDE

---

**Nächster Prompt:** PROMPT_05_PERFORMANCE_MONITOR.md

**Status:** ✅ Ready to copy-paste

**WICHTIG:** Dies ist das FUNDAMENT für alles weitere! Nimm dir Zeit für die Migration!