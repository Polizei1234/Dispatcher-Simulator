// =========================
// DEBUG MENU v1.0
// + Öffnen mit Button oder Strg+D
// + Test-Befehle für Entwicklung
// + System-Statusübersicht
// =========================

const DebugMenu = {
    isOpen: false,
    overlay: null,

    initialize() {
        // Keyboard-Shortcut: Strg+D
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.toggle();
            }
        });

        // Erstelle Overlay
        this.createOverlay();
        console.log('🐛 Debug Menu v1.0 initialisiert (Strg+D oder Button)');
    },

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'debug-menu-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 10000;
            display: none;
            overflow-y: auto;
            padding: 20px;
        `;

        this.overlay.innerHTML = `
            <div style="max-width: 1000px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; padding: 30px; box-shadow: 0 10px 50px rgba(0,0,0,0.5);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 style="margin: 0; color: #4CAF50;">
                        <i class="fas fa-bug"></i> Debug-Menü
                        <span style="font-size: 0.6em; color: #888; margin-left: 10px;">v1.0</span>
                    </h2>
                    <button onclick="DebugMenu.toggle()" style="background: #dc3545; border: none; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">
                        <i class="fas fa-times"></i> Schließen
                    </button>
                </div>

                <!-- SYSTEM STATUS -->
                <div style="background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #17a2b8; margin-top: 0;">
                        <i class="fas fa-info-circle"></i> System-Status
                    </h3>
                    <div id="debug-system-status" style="font-family: monospace; font-size: 0.9em; color: #ccc;">
                        Lade...
                    </div>
                </div>

                <!-- SCHNELLAKTIONEN -->
                <div style="background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #ffc107; margin-top: 0;">
                        <i class="fas fa-bolt"></i> Schnellaktionen
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        <button onclick="DebugMenu.testNotruf()" class="debug-btn">
                            <i class="fas fa-phone"></i> Test-Notruf
                        </button>
                        <button onclick="DebugMenu.testFunkspruch()" class="debug-btn">
                            <i class="fas fa-walkie-talkie"></i> Test-Funkspruch
                        </button>
                        <button onclick="DebugMenu.clearRadio()" class="debug-btn">
                            <i class="fas fa-eraser"></i> Funkverkehr löschen
                        </button>
                        <button onclick="DebugMenu.setStatus1All()" class="debug-btn">
                            <i class="fas fa-home"></i> Alle Status 1
                        </button>
                        <button onclick="DebugMenu.toggleSpeed()" class="debug-btn">
                            <i class="fas fa-forward"></i> Geschwindigkeit
                        </button>
                        <button onclick="DebugMenu.spawnRandomIncident()" class="debug-btn">
                            <i class="fas fa-plus-circle"></i> Zufälliger Einsatz
                        </button>
                    </div>
                </div>

                <!-- FAHRZEUG-KONTROLLE -->
                <div style="background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #28a745; margin-top: 0;">
                        <i class="fas fa-ambulance"></i> Fahrzeug-Kontrolle
                    </h3>
                    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                        <select id="debug-vehicle-select" style="flex: 1; padding: 10px; background: #1a1a1a; color: #fff; border: 1px solid #555; border-radius: 5px;">
                            <option value="">-- Fahrzeug wählen --</option>
                        </select>
                        <select id="debug-status-select" style="padding: 10px; background: #1a1a1a; color: #fff; border: 1px solid #555; border-radius: 5px;">
                            <option value="1">Status 1</option>
                            <option value="2">Status 2</option>
                            <option value="3">Status 3</option>
                            <option value="4">Status 4</option>
                            <option value="5">Status 5</option>
                            <option value="6">Status 6</option>
                            <option value="7">Status 7</option>
                            <option value="8">Status 8</option>
                        </select>
                        <button onclick="DebugMenu.setVehicleStatus()" class="debug-btn">
                            <i class="fas fa-check"></i> Status setzen
                        </button>
                    </div>
                </div>

                <!-- CONSOLE LOG -->
                <div style="background: #2d2d2d; padding: 20px; border-radius: 8px;">
                    <h3 style="color: #dc3545; margin-top: 0;">
                        <i class="fas fa-terminal"></i> Console Log
                    </h3>
                    <div id="debug-console" style="background: #0d0d0d; padding: 15px; border-radius: 5px; height: 200px; overflow-y: auto; font-family: monospace; font-size: 0.85em; color: #0f0;">
                        Debug-Menü geöffnet...
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        // Style für Buttons
        const style = document.createElement('style');
        style.textContent = `
            .debug-btn {
                background: #3182ce;
                border: none;
                color: white;
                padding: 12px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }
            .debug-btn:hover {
                background: #2563eb;
                transform: translateY(-2px);
            }
            .debug-btn i {
                margin-right: 5px;
            }
        `;
        document.head.appendChild(style);
    },

    toggle() {
        this.isOpen = !this.isOpen;
        this.overlay.style.display = this.isOpen ? 'block' : 'none';

        if (this.isOpen) {
            this.updateStatus();
            this.populateVehicleSelect();
        }
    },

    updateStatus() {
        const statusDiv = document.getElementById('debug-system-status');
        if (!statusDiv) return;

        const gameData = window.game || {};
        const vehicles = gameData.vehicles || [];
        const incidents = gameData.incidents || [];

        const activeVehicles = vehicles.filter(v => v.status !== 1 && v.status !== 3);
        const availableVehicles = vehicles.filter(v => v.status === 1 || v.status === 3);

        statusDiv.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div>
                    <strong style="color: #4CAF50;">🚑 Fahrzeuge:</strong><br>
                    Total: ${vehicles.length}<br>
                    Im Einsatz: ${activeVehicles.length}<br>
                    Verfügbar: ${availableVehicles.length}
                </div>
                <div>
                    <strong style="color: #f44336;">🚨 Einsätze:</strong><br>
                    Aktiv: ${incidents.length}<br>
                    Spielzeit: ${gameData.gameTime || 0}s<br>
                    Speed: ${gameData.speed || 1}x
                </div>
                <div>
                    <strong style="color: #17a2b8;">📞 Call System:</strong><br>
                    Aktiver Anruf: ${CallSystem?.activeCall ? 'Ja' : 'Nein'}<br>
                    History: ${CallSystem?.callHistory?.length || 0}
                </div>
                <div>
                    <strong style="color: #ffc107;">📡 Radio System:</strong><br>
                    Ausgewählt: ${radioSystem?.selectedVehicleId || 'Keins'}<br>
                    Gespräche: ${radioSystem?.conversationHistory?.size || 0}
                </div>
            </div>
        `;
    },

    populateVehicleSelect() {
        const select = document.getElementById('debug-vehicle-select');
        if (!select) return;

        const vehicles = game?.vehicles || [];
        select.innerHTML = '<option value="">-- Fahrzeug wählen --</option>';

        vehicles.forEach(v => {
            const option = document.createElement('option');
            option.value = v.id;
            option.textContent = `${v.callsign} - ${v.type} (Status ${v.status})`;
            select.appendChild(option);
        });
    },

    log(message, type = 'info') {
        const consoleDiv = document.getElementById('debug-console');
        if (!consoleDiv) return;

        const colors = {
            info: '#0f0',
            warn: '#ff0',
            error: '#f00',
            success: '#0f0'
        };

        const timestamp = new Date().toLocaleTimeString('de-DE');
        const line = document.createElement('div');
        line.style.color = colors[type] || colors.info;
        line.textContent = `[${timestamp}] ${message}`;

        consoleDiv.appendChild(line);
        consoleDiv.scrollTop = consoleDiv.scrollHeight;

        // Limitiere auf 100 Zeilen
        while (consoleDiv.children.length > 100) {
            consoleDiv.removeChild(consoleDiv.firstChild);
        }
    },

    // === SCHNELLAKTIONEN ===

    testNotruf() {
        if (typeof CallSystem !== 'undefined') {
            CallSystem.generateIncomingCall();
            this.log('Test-Notruf generiert', 'success');
        } else {
            this.log('CallSystem nicht verfügbar!', 'error');
        }
    },

    testFunkspruch() {
        if (typeof addRadioMessage !== 'undefined') {
            addRadioMessage('Debug', 'Dies ist ein Test-Funkspruch', 'dispatcher');
            this.log('Test-Funkspruch gesendet', 'success');
        } else {
            this.log('addRadioMessage nicht verfügbar!', 'error');
        }
    },

    clearRadio() {
        const feed = document.getElementById('radio-feed-full');
        if (feed) {
            feed.innerHTML = '';
            this.log('Funkverkehr gelöscht', 'success');
        }
    },

    setStatus1All() {
        const vehicles = game?.vehicles || [];
        vehicles.forEach(v => {
            v.status = 1;
            v.assignedIncident = null;
        });
        this.log(`${vehicles.length} Fahrzeuge auf Status 1 gesetzt`, 'success');
        this.updateStatus();
    },

    toggleSpeed() {
        if (!game) return;
        const speeds = [1, 2, 5, 10, 30];
        const currentIndex = speeds.indexOf(game.speed || 1);
        const nextIndex = (currentIndex + 1) % speeds.length;
        game.speed = speeds[nextIndex];
        this.log(`Geschwindigkeit: ${game.speed}x`, 'success');
        this.updateStatus();
    },

    spawnRandomIncident() {
        if (typeof AIIncidentGenerator !== 'undefined' && AIIncidentGenerator.generateIncident) {
            AIIncidentGenerator.generateIncident();
            this.log('Zufälliger Einsatz generiert', 'success');
        } else {
            this.log('AIIncidentGenerator nicht verfügbar!', 'error');
        }
    },

    setVehicleStatus() {
        const vehicleId = document.getElementById('debug-vehicle-select')?.value;
        const status = parseInt(document.getElementById('debug-status-select')?.value);

        if (!vehicleId) {
            this.log('Bitte Fahrzeug wählen!', 'warn');
            return;
        }

        const vehicle = game?.vehicles?.find(v => v.id === vehicleId);
        if (vehicle) {
            vehicle.status = status;
            this.log(`${vehicle.callsign} auf Status ${status} gesetzt`, 'success');
            this.updateStatus();
            this.populateVehicleSelect();
        } else {
            this.log('Fahrzeug nicht gefunden!', 'error');
        }
    }
};

// Auto-Init wenn DOM ready
if (typeof window !== 'undefined') {
    window.DebugMenu = DebugMenu;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => DebugMenu.initialize());
    } else {
        DebugMenu.initialize();
    }
}

console.log('✅ Debug Menu v1.0 geladen');
