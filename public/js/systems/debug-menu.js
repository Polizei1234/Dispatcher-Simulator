// =========================
// DEBUG-MENÜ SYSTEM v1.2 - BUG FIX: Toggle Logic
// Erweiterte Debug-Funktionen für Entwickler
// ✅ FIX: Test-Einsatz startet jetzt Anruf über CallSystem
// ✅✅✅ BUG FIX v1.2: Menü öffnet jetzt beim ERSTEN Klick!
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
        this.performanceMonitor = new PerformanceMonitor();
        window.performanceMonitor = this.performanceMonitor;
    }

    /**
     * Toggle Debug-Menü
     * ✅✅✅ BUG FIX v1.2: Menu wird SOFORT erstellt beim ersten Toggle!
     */
    toggle() {
        const menu = document.getElementById('debug-menu');
        
        // ✅ FIX: Wenn Menü NICHT existiert, erstelle es UND zeige es an!
        if (!menu) {
            console.log('🔧 Debug-Menü existiert noch nicht - erstelle es...');
            this.create();
            this.isVisible = true; // 🔥 WICHTIG: Setze auf true!
            this.update();
            console.log('✅ Debug-Menü erstellt und angezeigt!');
            return;
        }
        
        // Menü existiert bereits - toggle Sichtbarkeit
        this.isVisible = !this.isVisible;
        menu.style.display = this.isVisible ? 'block' : 'none';
        
        if (this.isVisible) {
            this.update();
        }
        
        console.log(`🔧 Debug-Menü ${this.isVisible ? 'geöffnet' : 'geschlossen'}`);
    }

    /**
     * Erstellt Debug-Menü HTML
     */
    create() {
        const menu = document.createElement('div');
        menu.id = 'debug-menu';
        menu.className = 'debug-menu';
        menu.style.display = 'block'; // 🔥 WICHTIG: Sofort sichtbar!
        menu.innerHTML = `
            <div class="debug-header">
                <h3>🐛 Debug-Menü</h3>
                <button onclick="debugMenu.toggle()" class="btn-close">×</button>
            </div>
            
            <div class="debug-tabs">
                <button class="debug-tab active" onclick="debugMenu.showTab('stats')">📊 Stats</button>
                <button class="debug-tab" onclick="debugMenu.showTab('performance')">⚡ Performance</button>
                <button class="debug-tab" onclick="debugMenu.showTab('vehicles')">🚑 Fahrzeuge</button>
                <button class="debug-tab" onclick="debugMenu.showTab('incidents')">🚨 Einsätze</button>
                <button class="debug-tab" onclick="debugMenu.showTab('logs')">📝 Logs</button>
                <button class="debug-tab" onclick="debugMenu.showTab('actions')">⚡ Aktionen</button>
            </div>
            
            <div class="debug-content">
                <div id="debug-tab-stats" class="debug-tab-content active"></div>
                <div id="debug-tab-performance" class="debug-tab-content"></div>
                <div id="debug-tab-vehicles" class="debug-tab-content"></div>
                <div id="debug-tab-incidents" class="debug-tab-content"></div>
                <div id="debug-tab-logs" class="debug-tab-content"></div>
                <div id="debug-tab-actions" class="debug-tab-content"></div>
            </div>
        `;
        
        document.body.appendChild(menu);
        this.addStyles();
        
        console.log('✅ Debug-Menü HTML erstellt und in DOM eingefügt');
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
        this.updateTab('performance');
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
            case 'performance':
                container.innerHTML = this.renderPerformance();
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

    renderPerformance() {
        const { fps, memory, entities } = this.performanceMonitor;
        return `
            <div class="debug-section">
                <h4>⚡ Performance</h4>
                <div class="debug-stat">
                    <span>FPS:</span>
                    <span>${fps}</span>
                </div>
                <div class="debug-stat">
                    <span>Memory:</span>
                    <span>${memory} MB</span>
                </div>
                <div class="debug-stat">
                    <span>Entities:</span>
                    <span>${entities}</span>
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
                    <button class="btn-debug" onclick="debugMenu.createTestIncident()">📞 Test-Anruf starten</button>
                    <button class="btn-debug" onclick="debugMenu.createMassIncidents()">📞 5 Anrufe starten</button>
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

    /**
     * ✅ FIX: Erstellt Test-ANRUF statt fertigen Einsatz
     */
    async createTestIncident() {
        if (!game) {
            this.log('incidents', 'Kein Spiel aktiv!', 'error');
            return;
        }
        
        // Prüfe ob CallSystem verfügbar
        if (typeof CallSystem === 'undefined') {
            this.log('incidents', '❌ CallSystem nicht verfügbar!', 'error');
            alert('❌ CallSystem nicht verfügbar. Bitte Seite neu laden.');
            return;
        }
        
        try {
            this.log('incidents', '📞 Starte Test-Anruf...');
            
            // Nutze CallSystem für eingehenden Anruf
            await CallSystem.generateIncomingCall();
            
            this.log('incidents', '✅ Test-Anruf erfolgreich gestartet!');
            
            // Wechsle zum Notruf-Tab wenn möglich
            if (typeof switchTab === 'function') {
                switchTab('call');
            }
            
        } catch (error) {
            this.log('incidents', `❌ Fehler beim Test-Anruf: ${error.message}`, 'error');
            console.error('Debug Test-Anruf Fehler:', error);
            alert(`❌ Fehler beim Test-Anruf:\n${error.message}`);
        }
        
        this.update();
    }

    /**
     * Erstellt mehrere Test-Anrufe
     */
    async createMassIncidents() {
        this.log('incidents', '📞 Starte 5 Test-Anrufe...');
        
        for (let i = 0; i < 5; i++) {
            await this.createTestIncident();
            // Kurze Pause zwischen Anrufen
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        this.log('incidents', '✅ 5 Test-Anrufe gestartet!');
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
                overflow-y: auto;\n                padding: 15px;\n            }\n            \n            .debug-tab-content {\n                display: none;\n            }\n            \n            .debug-tab-content.active {\n                display: block;\n            }\n            \n            .debug-section {\n                margin-bottom: 20px;\n                padding: 15px;\n                background: rgba(45, 55, 72, 0.5);\n                border-radius: 8px;\n            }\n            \n            .debug-section h4 {\n                margin: 0 0 10px 0;\n                color: #3182ce;\n                font-size: 1em;\n            }\n            \n            .debug-stat {\n                display: flex;\n                justify-content: space-between;\n                padding: 5px 0;\n                color: #a0aec0;\n                border-bottom: 1px solid rgba(255,255,255,0.1);\n            }\n            \n            .debug-stat:last-child {\n                border-bottom: none;\n            }\n            \n            .debug-vehicle-card, .debug-incident-card {\n                background: rgba(45, 55, 72, 0.5);\n                padding: 12px;\n                margin-bottom: 10px;\n                border-radius: 8px;\n            }\n            \n            .debug-vehicle-header, .debug-incident-header {\n                display: flex;\n                justify-content: space-between;\n                margin-bottom: 8px;\n                color: #fff;\n            }\n            \n            .debug-vehicle-info, .debug-incident-info {\n                font-size: 0.9em;\n                color: #a0aec0;\n                margin-bottom: 8px;\n            }\n            \n            .debug-vehicle-actions, .debug-incident-actions {\n                display: flex;\n                gap: 5px;\n            }\n            \n            .btn-debug-small {\n                padding: 4px 8px;\n                background: #3182ce;\n                color: white;\n                border: none;\n                border-radius: 4px;\n                cursor: pointer;\n                font-size: 0.8em;\n            }\n            \n            .btn-debug-small:hover {\n                background: #2563eb;\n            }\n            \n            .btn-debug {\n                width: 100%;\n                padding: 10px;\n                margin: 5px 0;\n                background: #3182ce;\n                color: white;\n                border: none;\n                border-radius: 6px;\n                cursor: pointer;\n            }\n            \n            .btn-debug:hover {\n                background: #2563eb;\n            }\n            \n            .debug-actions-grid {\n                display: grid;\n                gap: 15px;\n            }\n            \n            .debug-action-section h4 {\n                margin: 0 0 10px 0;\n                color: #3182ce;\n            }\n            \n            .debug-log-list {\n                max-height: 400px;\n                overflow-y: auto;\n            }\n            \n            .debug-log-entry {\n                padding: 8px;\n                margin-bottom: 5px;\n                background: rgba(45, 55, 72, 0.5);\n                border-radius: 4px;\n                font-size: 0.85em;\n                border-left: 3px solid #3182ce;\n            }\n            \n            .debug-log-time {\n                color: #666;\n                margin-right: 8px;\n            }\n            \n            .debug-log-category {\n                color: #3182ce;\n                margin-right: 8px;\n                font-weight: bold;\n            }\n            \n            .debug-log-message {\n                color: #a0aec0;\n            }\n        `;\n        document.head.appendChild(style);\n    }\n}\n\n// Globale Instanz\nconst debugMenu = new DebugMenu();\n\n// Keyboard Shortcut: Strg + Shift + D\ndocument.addEventListener('keydown', (e) => {\n    if (e.ctrlKey && e.shiftKey && e.key === 'D') {\n        e.preventDefault();\n        debugMenu.toggle();\n    }\n});\n\nconsole.log('✅ Debug-Menü v1.2 geladen - Drücke Strg+Shift+D zum Öffnen');\nconsole.log('✅✅✅ BUG FIX: Menü öffnet jetzt beim ERSTEN Klick!');\n\nif (typeof window !== 'undefined') {\n    window.debugMenu = debugMenu;\n}