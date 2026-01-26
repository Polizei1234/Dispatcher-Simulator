// =========================
// DEBUG-MENÜ SYSTEM v1.1
// Erweiterte Debug-Funktionen für Entwickler
// ✅ FIX: DebugMenu als Klasse exportiert
// =========================

class DebugMenu {
    constructor() {
        this.isVisible = false;
        this.logs = [];
        this.maxLogs = 100;
        this.filters = {
            game: true,
            vehicles: true,
            incidents: true,
            api: true,
            radio: true,
            errors: true
        };
    }

    /**
     * ✅ STATIC METHOD - Kann direkt aufgerufen werden
     */
    static toggle() {
        if (!window.debugMenu) {
            window.debugMenu = new DebugMenu();
        }
        window.debugMenu.toggle();
    }

    /**
     * Toggle Debug-Menü
     */
    toggle() {
        this.isVisible = !this.isVisible;
        const menu = document.getElementById('debug-menu');
        
        if (!menu) {
            this.create();
            this.isVisible = true;
        } else {
            menu.style.display = this.isVisible ? 'block' : 'none';
        }
        
        if (this.isVisible) {
            this.update();
        }
    }

    /**
     * Erstellt Debug-Menü HTML
     */
    create() {
        const menu = document.createElement('div');
        menu.id = 'debug-menu';
        menu.className = 'debug-menu';
        menu.innerHTML = `
            <div class="debug-header">
                <h3>🐛 Debug-Menü</h3>
                <button onclick="debugMenu.toggle()" class="btn-close">×</button>
            </div>
            
            <div class="debug-tabs">
                <button class="debug-tab active" onclick="debugMenu.showTab('stats')">📊 Stats</button>
                <button class="debug-tab" onclick="debugMenu.showTab('vehicles')">🚑 Fahrzeuge</button>
                <button class="debug-tab" onclick="debugMenu.showTab('incidents')">🚨 Einsätze</button>
                <button class="debug-tab" onclick="debugMenu.showTab('logs')">📝 Logs</button>
                <button class="debug-tab" onclick="debugMenu.showTab('actions')">⚡ Aktionen</button>
            </div>
            
            <div class="debug-content">
                <div id="debug-tab-stats" class="debug-tab-content active"></div>
                <div id="debug-tab-vehicles" class="debug-tab-content"></div>
                <div id="debug-tab-incidents" class="debug-tab-content"></div>
                <div id="debug-tab-logs" class="debug-tab-content"></div>
                <div id="debug-tab-actions" class="debug-tab-content"></div>
            </div>
        `;
        
        document.body.appendChild(menu);
        this.addStyles();
    }

    /**
     * Zeigt spezifischen Tab
     */
    showTab(tabName) {
        // Deaktiviere alle Tabs
        document.querySelectorAll('.debug-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.debug-tab-content').forEach(content => content.classList.remove('active'));
        
        // Aktiviere gewählten Tab
        event.target.classList.add('active');
        document.getElementById(`debug-tab-${tabName}`).classList.add('active');
        
        // Update Inhalt
        this.updateTab(tabName);
    }

    /**
     * Aktualisiert alle Tabs
     */
    update() {
        if (!this.isVisible) return;
        
        this.updateTab('stats');
        this.updateTab('vehicles');
        this.updateTab('incidents');
        this.updateTab('logs');
        this.updateTab('actions');
    }

    /**
     * Aktualisiert spezifischen Tab
     */
    updateTab(tabName) {
        const container = document.getElementById(`debug-tab-${tabName}`);
        if (!container) return;
        
        switch(tabName) {
            case 'stats':
                container.innerHTML = this.renderStats();
                break;
            case 'vehicles':
                container.innerHTML = this.renderVehicles();
                break;
            case 'incidents':
                container.innerHTML = this.renderIncidents();
                break;
            case 'logs':
                container.innerHTML = this.renderLogs();
                break;
            case 'actions':
                container.innerHTML = this.renderActions();
                break;
        }
    }

    /**
     * Rendert Statistiken
     */
    renderStats() {
        if (!game) return '<p>Kein Spiel aktiv</p>';
        
        const vehicles = game.vehicles || [];
        const incidents = game.incidents || [];
        const uptime = Math.floor((Date.now() - (game.startTime || Date.now())) / 1000);
        
        return `
            <div class="debug-section">
                <h4>⏱️ System</h4>
                <div class="debug-stat">
                    <span>Uptime:</span>
                    <span>${this.formatTime(uptime)}</span>
                </div>
                <div class="debug-stat">
                    <span>Spielzeit:</span>
                    <span>${GameTime.simulated.toLocaleTimeString('de-DE')}</span>
                </div>
                <div class="debug-stat">
                    <span>Geschwindigkeit:</span>
                    <span>${GameTime.speed}x</span>
                </div>
                <div class="debug-stat">
                    <span>Pausiert:</span>
                    <span>${gamePaused ? 'Ja' : 'Nein'}</span>
                </div>
            </div>
            
            <div class="debug-section">
                <h4>🚑 Fahrzeuge</h4>
                <div class="debug-stat">
                    <span>Gesamt:</span>
                    <span>${vehicles.length}</span>
                </div>
                <div class="debug-stat">
                    <span>Verfügbar:</span>
                    <span>${vehicles.filter(v => v.status === 1 || v.status === 2).length}</span>
                </div>
                <div class="debug-stat">
                    <span>Im Einsatz:</span>
                    <span>${vehicles.filter(v => v.status >= 3 && v.status <= 9).length}</span>
                </div>
                <div class="debug-stat">
                    <span>Status 2:</span>
                    <span>${vehicles.filter(v => v.status === 2).length}</span>
                </div>
            </div>
            
            <div class="debug-section">
                <h4>🚨 Einsätze</h4>
                <div class="debug-stat">
                    <span>Aktiv:</span>
                    <span>${incidents.filter(i => !i.completed).length}</span>
                </div>
                <div class="debug-stat">
                    <span>Abgeschlossen:</span>
                    <span>${incidents.filter(i => i.completed).length}</span>
                </div>
                <div class="debug-stat">
                    <span>Gesamt:</span>
                    <span>${incidents.length}</span>
                </div>
            </div>
            
            <div class="debug-section">
                <h4>🌡️ Wetter</h4>
                <div class="debug-stat">
                    <span>Bedingung:</span>
                    <span>${gameWeatherSystem?.currentWeather?.condition || 'Unbekannt'}</span>
                </div>
                <div class="debug-stat">
                    <span>Temperatur:</span>
                    <span>${gameWeatherSystem?.currentWeather?.temperature || 'N/A'}°C</span>
                </div>
            </div>
        `;
    }

    /**
     * Rendert Fahrzeugübersicht
     */
    renderVehicles() {
        if (!game || !game.vehicles) return '<p>Keine Fahrzeuge</p>';
        
        const vehicles = game.vehicles.filter(v => v.owned);
        
        return `
            <div class="debug-vehicle-list">
                ${vehicles.map(v => {
                    const status = CONFIG.FMS_STATUS[v.status] || { name: 'Unbekannt', color: '#666' };
                    const incident = game.incidents.find(i => 
                        i.assignedVehicles && i.assignedVehicles.includes(v.id)
                    );
                    
                    return `
                        <div class="debug-vehicle-card" style="border-left: 4px solid ${status.color};">
                            <div class="debug-vehicle-header">
                                <strong>${v.callsign}</strong>
                                <span style="color: ${status.color};">Status ${v.status}</span>
                            </div>
                            <div class="debug-vehicle-info">
                                <div>Typ: ${v.type}</div>
                                <div>Wache: ${v.station}</div>
                                ${incident ? `<div>Einsatz: ${incident.id}</div>` : ''}
                                ${v.eta ? `<div>ETA: ${Math.ceil(v.eta / 60)}min</div>` : ''}
                            </div>
                            <div class="debug-vehicle-actions">
                                <button class="btn-debug-small" onclick="debugMenu.setVehicleStatus('${v.id}', 1)">Status 1</button>
                                <button class="btn-debug-small" onclick="debugMenu.setVehicleStatus('${v.id}', 2)">Status 2</button>
                                <button class="btn-debug-small" onclick="debugMenu.setVehicleStatus('${v.id}', 6)">Status 6</button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Rendert Einsatzübersicht
     */
    renderIncidents() {
        if (!game || !game.incidents) return '<p>Keine Einsätze</p>';
        
        const incidents = game.incidents.filter(i => !i.completed);
        
        if (incidents.length === 0) {
            return '<p>Keine aktiven Einsätze</p>';
        }
        
        return `
            <div class="debug-incident-list">
                ${incidents.map(i => `
                    <div class="debug-incident-card">
                        <div class="debug-incident-header">
                            <strong>${i.id}</strong>
                            <span>${i.stichwort || i.keyword}</span>
                        </div>
                        <div class="debug-incident-info">
                            <div>📍 ${i.ort || i.location}</div>
                            <div>🚑 ${(i.assignedVehicles || []).length} Fahrzeuge</div>
                            <div>⏱️ ${i.zeitstempel}</div>
                        </div>
                        <div class="debug-incident-actions">
                            <button class="btn-debug-small" onclick="debugMenu.completeIncident('${i.id}')">Abschließen</button>
                            <button class="btn-debug-small" onclick="debugMenu.deleteIncident('${i.id}')">Löschen</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Rendert Logs
     */
    renderLogs() {
        if (this.logs.length === 0) {
            return '<p>Keine Logs verfügbar</p>';
        }
        
        return `
            <div class="debug-log-controls">
                <button class="btn-debug-small" onclick="debugMenu.clearLogs()">Logs löschen</button>
            </div>
            <div class="debug-log-list">
                ${this.logs.slice(-50).reverse().map(log => `
                    <div class="debug-log-entry debug-log-${log.type}">
                        <span class="debug-log-time">${log.time}</span>
                        <span class="debug-log-category">[${log.category}]</span>
                        <span class="debug-log-message">${log.message}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Rendert Aktionen
     */
    renderActions() {
        return `
            <div class="debug-actions-grid">
                <div class="debug-action-section">
                    <h4>🚨 Einsätze</h4>
                    <button class="btn-debug" onclick="debugMenu.createTestIncident()">Test-Einsatz erstellen</button>
                    <button class="btn-debug" onclick="debugMenu.createMassIncidents()">5 Einsätze erstellen</button>
                    <button class="btn-debug" onclick="debugMenu.clearAllIncidents()">Alle Einsätze löschen</button>
                </div>
                
                <div class="debug-action-section">
                    <h4>🚑 Fahrzeuge</h4>
                    <button class="btn-debug" onclick="debugMenu.setAllVehiclesAvailable()">Alle verfügbar</button>
                    <button class="btn-debug" onclick="debugMenu.setAllVehiclesBusy()">Alle beschäftigt</button>
                    <button class="btn-debug" onclick="debugMenu.teleportAllToBase()">Alle zur Wache</button>
                </div>
                
                <div class="debug-action-section">
                    <h4>⏱️ Zeit</h4>
                    <button class="btn-debug" onclick="debugMenu.setTimeSpeed(1)">1x</button>
                    <button class="btn-debug" onclick="debugMenu.setTimeSpeed(10)">10x</button>
                    <button class="btn-debug" onclick="debugMenu.setTimeSpeed(50)">50x</button>
                    <button class="btn-debug" onclick="debugMenu.skipTime(3600)">+1 Stunde</button>
                </div>
                
                <div class="debug-action-section">
                    <h4>🔧 System</h4>
                    <button class="btn-debug" onclick="debugMenu.exportGameState()">Spielstand exportieren</button>
                    <button class="btn-debug" onclick="debugMenu.resetGame()">Spiel zurücksetzen</button>
                    <button class="btn-debug" onclick="debugMenu.clearLocalStorage()">LocalStorage löschen</button>
                </div>
            </div>
        `;
    }

    // =========================
    // AKTIONEN
    // =========================

    setVehicleStatus(vehicleId, status) {
        const vehicle = game.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;
        
        vehicle.status = status;
        this.log('vehicles', `Fahrzeug ${vehicle.callsign} auf Status ${status} gesetzt`);
        this.update();
    }

    completeIncident(incidentId) {
        const incident = game.incidents.find(i => i.id === incidentId);
        if (!incident) return;
        
        incident.completed = true;
        this.log('incidents', `Einsatz ${incidentId} abgeschlossen`);
        this.update();
    }

    deleteIncident(incidentId) {
        const index = game.incidents.findIndex(i => i.id === incidentId);
        if (index === -1) return;
        
        game.incidents.splice(index, 1);
        this.log('incidents', `Einsatz ${incidentId} gelöscht`);
        this.update();
    }

    createTestIncident() {
        if (!game) return;
        
        const testIncident = {
            id: `TEST-${Date.now()}`,
            stichwort: 'TEST-EINSATZ',
            ort: 'Test-Straße 123',
            meldebild: 'Debug-Test-Einsatz',
            zeitstempel: new Date().toLocaleTimeString('de-DE'),
            koordinaten: { lat: 48.8309415, lon: 9.3256194 },
            assignedVehicles: [],
            completed: false
        };
        
        game.incidents.push(testIncident);
        this.log('incidents', 'Test-Einsatz erstellt');
        this.update();
    }

    createMassIncidents() {
        for (let i = 0; i < 5; i++) {
            this.createTestIncident();
        }
    }

    clearAllIncidents() {
        if (!confirm('Alle Einsätze löschen?')) return;
        game.incidents = [];
        this.log('incidents', 'Alle Einsätze gelöscht');
        this.update();
    }

    setAllVehiclesAvailable() {
        game.vehicles.forEach(v => v.status = 2);
        this.log('vehicles', 'Alle Fahrzeuge auf Status 2 gesetzt');
        this.update();
    }

    setAllVehiclesBusy() {
        game.vehicles.forEach(v => v.status = 6);
        this.log('vehicles', 'Alle Fahrzeuge auf Status 6 gesetzt');
        this.update();
    }

    teleportAllToBase() {
        game.vehicles.forEach(v => {
            v.status = 2;
            v.incident = null;
        });
        this.log('vehicles', 'Alle Fahrzeuge zur Wache teleportiert');
        this.update();
    }

    setTimeSpeed(speed) {
        GameTime.updateSpeed(speed);
        this.log('game', `Geschwindigkeit auf ${speed}x gesetzt`);
        this.update();
    }

    skipTime(seconds) {
        GameTime.tick(seconds * 1000);
        this.log('game', `${seconds} Sekunden übersprungen`);
        this.update();
    }

    exportGameState() {
        const state = {
            time: GameTime.simulated,
            vehicles: game.vehicles,
            incidents: game.incidents
        };
        
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gamestate-${Date.now()}.json`;
        a.click();
        
        this.log('game', 'Spielstand exportiert');
    }

    resetGame() {
        if (!confirm('Spiel wirklich zurücksetzen?')) return;
        location.reload();
    }

    clearLocalStorage() {
        if (!confirm('LocalStorage wirklich löschen?')) return;
        localStorage.clear();
        this.log('game', 'LocalStorage gelöscht');
        alert('✅ LocalStorage gelöscht. Seite wird neu geladen.');
        location.reload();
    }

    clearLogs() {
        this.logs = [];
        this.update();
    }

    // =========================
    // HELPER
    // =========================

    log(category, message, type = 'info') {
        this.logs.push({
            time: new Date().toLocaleTimeString('de-DE'),
            category,
            message,
            type
        });
        
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        console.log(`[DEBUG:${category}] ${message}`);
    }

    formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .debug-menu {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 500px;
                max-height: 80vh;
                background: rgba(20, 20, 30, 0.98);
                border: 2px solid #3182ce;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                z-index: 10000;
                display: none;
                overflow: hidden;
            }
            
            .debug-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background: #2d3748;
                border-bottom: 2px solid #3182ce;
            }
            
            .debug-header h3 {
                margin: 0;
                color: #fff;
                font-size: 1.2em;
            }
            
            .btn-close {
                background: none;
                border: none;
                color: #fff;
                font-size: 1.5em;
                cursor: pointer;
                padding: 0 10px;
            }
            
            .debug-tabs {
                display: flex;
                background: #1a202c;
                border-bottom: 1px solid #3182ce;
            }
            
            .debug-tab {
                flex: 1;
                padding: 10px;
                background: none;
                border: none;
                color: #a0aec0;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.2s;
            }
            
            .debug-tab:hover {
                background: #2d3748;
                color: #fff;
            }
            
            .debug-tab.active {
                color: #3182ce;
                border-bottom-color: #3182ce;
            }
            
            .debug-content {
                max-height: calc(80vh - 150px);
                overflow-y: auto;
                padding: 15px;
            }
            
            .debug-tab-content {
                display: none;
            }
            
            .debug-tab-content.active {
                display: block;
            }
            
            .debug-section {
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(45, 55, 72, 0.5);
                border-radius: 8px;
            }
            
            .debug-section h4 {
                margin: 0 0 10px 0;
                color: #3182ce;
                font-size: 1em;
            }
            
            .debug-stat {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                color: #a0aec0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .debug-stat:last-child {
                border-bottom: none;
            }
            
            .debug-vehicle-card, .debug-incident-card {
                background: rgba(45, 55, 72, 0.5);
                padding: 12px;
                margin-bottom: 10px;
                border-radius: 8px;
            }
            
            .debug-vehicle-header, .debug-incident-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                color: #fff;
            }
            
            .debug-vehicle-info, .debug-incident-info {
                font-size: 0.9em;
                color: #a0aec0;
                margin-bottom: 8px;
            }
            
            .debug-vehicle-actions, .debug-incident-actions {
                display: flex;
                gap: 5px;
            }
            
            .btn-debug-small {
                padding: 4px 8px;
                background: #3182ce;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8em;
            }
            
            .btn-debug-small:hover {
                background: #2563eb;
            }
            
            .btn-debug {
                width: 100%;
                padding: 10px;
                margin: 5px 0;
                background: #3182ce;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
            }
            
            .btn-debug:hover {
                background: #2563eb;
            }
            
            .debug-actions-grid {
                display: grid;
                gap: 15px;
            }
            
            .debug-action-section h4 {
                margin: 0 0 10px 0;
                color: #3182ce;
            }
            
            .debug-log-list {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .debug-log-entry {
                padding: 8px;
                margin-bottom: 5px;
                background: rgba(45, 55, 72, 0.5);
                border-radius: 4px;
                font-size: 0.85em;
                border-left: 3px solid #3182ce;
            }
            
            .debug-log-time {
                color: #666;
                margin-right: 8px;
            }
            
            .debug-log-category {
                color: #3182ce;
                margin-right: 8px;
                font-weight: bold;
            }
            
            .debug-log-message {
                color: #a0aec0;
            }
        `;
        document.head.appendChild(style);
    }
}

// ✅ Erstelle globale Instanz SOFORT
if (typeof window !== 'undefined') {
    window.DebugMenu = DebugMenu; // Klasse exportieren
    window.debugMenu = new DebugMenu(); // Instanz erstellen
}

// Keyboard Shortcut: Strg + Shift + D
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        if (window.debugMenu) {
            window.debugMenu.toggle();
        }
    }
});

console.log('✅ Debug-Menü geladen - Drücke Strg+Shift+D zum Öffnen');
