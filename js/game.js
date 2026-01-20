import { MapManager } from './map.js';
import { AIManager } from './ai.js';
import { IncidentManager } from './incidents.js';

class Game {
    constructor() {
        this.gameTime = new Date();
        this.timeSpeed = 10;
        this.credits = 10000;
        this.vehicles = [];
        this.stations = [];
        this.incidents = [];
        this.selectedVehicles = [];
        this.tutorialStep = 0;
        this.tutorialActive = false;
        
        this.mapManager = new MapManager(this);
        this.aiManager = new AIManager(this);
        this.incidentManager = new IncidentManager(this);
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.startGameLoop();
        this.mapManager.init();
        
        // Start with tutorial
        setTimeout(() => this.showTutorial(), 1000);
        
        // Start incident generation after tutorial
        setTimeout(() => {
            this.incidentManager.startGeneration();
        }, 5000);
    }

    async loadData() {
        try {
            const [stationsData, vehiclesData, keywordsData] = await Promise.all([
                fetch('data/stations.json').then(r => r.json()),
                fetch('data/vehicles.json').then(r => r.json()),
                fetch('data/keywords.json').then(r => r.json())
            ]);
            
            this.stations = stationsData;
            this.vehicleTypes = vehiclesData;
            this.keywords = keywordsData;
            
            // Start with one station (DRK Backnang)
            this.startStation = this.stations.find(s => s.name === 'DRK Rettungswache Backnang');
            
            // Initialize starter vehicles
            this.vehicles = [
                this.createVehicle('RTW', this.startStation, 'Florian Backnang 01/83-01'),
                this.createVehicle('KTW', this.startStation, 'Florian Backnang 01/19-01'),
                this.createVehicle('NEF', this.startStation, 'Florian Backnang 01/82-01')
            ];
            
            this.updateUI();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showNotification('Fehler beim Laden der Daten', 'error');
        }
    }

    createVehicle(type, station, callsign) {
        const vehicleType = this.vehicleTypes.rescue.find(v => v.type === type);
        return {
            id: Date.now() + Math.random(),
            callsign: callsign,
            type: type,
            name: vehicleType.name,
            station: station.name,
            position: station.position,
            status: 'available',
            incident: null,
            crew: vehicleType.crew,
            organization: station.organization
        };
    }

    setupEventListeners() {
        // Time speed control
        document.getElementById('time-speed').addEventListener('change', (e) => {
            this.timeSpeed = parseInt(e.target.value);
        });

        // Tutorial button
        document.getElementById('tutorial-btn').addEventListener('click', () => {
            this.showTutorial();
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.parentElement;
                parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateUI();
            });
        });

        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(`${tab}-tab`).classList.add('active');
            });
        });

        // Tutorial navigation
        document.getElementById('tutorial-next')?.addEventListener('click', () => {
            this.nextTutorialStep();
        });

        document.getElementById('tutorial-prev')?.addEventListener('click', () => {
            this.prevTutorialStep();
        });

        document.getElementById('tutorial-skip')?.addEventListener('click', () => {
            this.closeAllModals();
            this.tutorialActive = false;
        });
    }

    startGameLoop() {
        setInterval(() => {
            this.gameTime = new Date(this.gameTime.getTime() + 1000 * this.timeSpeed);
            this.updateGameTime();
            this.updateVehicles();
        }, 1000);

        setInterval(() => {
            this.updateUI();
        }, 5000);
    }

    updateGameTime() {
        const timeStr = this.gameTime.toLocaleTimeString('de-DE');
        document.getElementById('current-time').textContent = timeStr;
    }

    updateVehicles() {
        this.vehicles.forEach(vehicle => {
            if (vehicle.status === 'responding' || vehicle.status === 'returning') {
                this.mapManager.updateVehiclePosition(vehicle);
            }
        });
    }

    updateUI() {
        this.updateIncidentsList();
        this.updateVehiclesList();
        this.updateStatusBar();
    }

    updateStatusBar() {
        const activeIncidents = this.incidents.filter(i => i.status !== 'completed').length;
        const availableVehicles = this.vehicles.filter(v => v.status === 'available').length;
        
        document.getElementById('active-incidents').textContent = `Aktive Einsätze: ${activeIncidents}`;
        document.getElementById('available-vehicles').textContent = `Verfügbar: ${availableVehicles}`;
        document.getElementById('credits').textContent = `Credits: ${this.credits} €`;
    }

    updateIncidentsList() {
        const container = document.getElementById('incidents-list');
        const filter = document.querySelector('#incident-filter .filter-btn.active').dataset.filter;
        
        const filtered = this.incidents.filter(incident => {
            if (filter === 'all') return true;
            return incident.status === filter;
        });

        container.innerHTML = filtered.map(incident => `
            <div class="incident-card ${incident.status}" onclick="game.showIncidentDetails('${incident.id}')">
                <div class="incident-header">
                    <span class="incident-keyword">${incident.keyword}</span>
                    <span class="incident-time">${new Date(incident.time).toLocaleTimeString('de-DE')}</span>
                </div>
                <div class="incident-location">📍 ${incident.location}</div>
                <div class="incident-status">${this.getStatusText(incident.status)}</div>
            </div>
        `).join('');
    }

    updateVehiclesList() {
        const container = document.getElementById('vehicles-list');
        const filter = document.querySelector('#vehicle-filter .filter-btn.active').dataset.org;
        
        const filtered = this.vehicles.filter(vehicle => {
            if (filter === 'all') return true;
            const orgMap = { 'rd': 'Rettungsdienst', 'fw': 'Feuerwehr', 'pol': 'Polizei' };
            return vehicle.organization === orgMap[filter];
        });

        container.innerHTML = filtered.map(vehicle => `
            <div class="vehicle-card ${vehicle.status}" onclick="game.showVehicleDetails('${vehicle.id}')">
                <div class="vehicle-name">${vehicle.callsign}</div>
                <div class="vehicle-type">${vehicle.name}</div>
                <div class="vehicle-status ${vehicle.status}">${this.getVehicleStatusText(vehicle.status)}</div>
            </div>
        `).join('');
    }

    getStatusText(status) {
        const texts = {
            'new': 'Neu',
            'active': 'In Bearbeitung',
            'completed': 'Abgeschlossen'
        };
        return texts[status] || status;
    }

    getVehicleStatusText(status) {
        const texts = {
            'available': 'Verfügbar',
            'responding': 'Anfahrt',
            'on_scene': 'Vor Ort',
            'returning': 'Rückkehr',
            'unavailable': 'Nicht verfügbar'
        };
        return texts[status] || status;
    }

    showIncidentDetails(incidentId) {
        const incident = this.incidents.find(i => i.id === incidentId);
        if (!incident) return;

        const modal = document.getElementById('incident-modal');
        const body = document.getElementById('incident-modal-body');
        
        body.innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Stichwort:</span>
                <span class="detail-value">${incident.keyword}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Einsatzort:</span>
                <span class="detail-value">${incident.location}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Zeit:</span>
                <span class="detail-value">${new Date(incident.time).toLocaleString('de-DE')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Beschreibung:</span>
                <span class="detail-value">${incident.description}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Alarmierte Fahrzeuge:</span>
                <span class="detail-value">${incident.assignedVehicles?.length || 0}</span>
            </div>
        `;

        this.showModal('incident-modal');
        
        if (incident.status === 'new') {
            document.getElementById('incident-accept').onclick = () => {
                this.acceptIncident(incident);
            };
        }
    }

    showVehicleDetails(vehicleId) {
        const vehicle = this.vehicles.find(v => v.id == vehicleId);
        if (!vehicle) return;

        const panel = document.getElementById('detail-panel');
        const content = document.getElementById('detail-content');
        
        content.innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Rufzeichen:</span>
                <span class="detail-value">${vehicle.callsign}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Typ:</span>
                <span class="detail-value">${vehicle.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Wache:</span>
                <span class="detail-value">${vehicle.station}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">${this.getVehicleStatusText(vehicle.status)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Besatzung:</span>
                <span class="detail-value">${vehicle.crew} Personen</span>
            </div>
        `;

        panel.style.display = 'block';
    }

    async acceptIncident(incident) {
        this.closeAllModals();
        incident.status = 'active';
        
        // Show phone call
        await this.aiManager.startPhoneCall(incident);
        
        // After phone call, show dispatch modal
        this.showDispatchModal(incident);
    }

    showDispatchModal(incident) {
        const modal = document.getElementById('dispatch-modal');
        const suggestedList = document.getElementById('suggested-list');
        const dispatchList = document.getElementById('dispatch-vehicle-list');
        
        // Get suggested vehicles based on keyword
        const suggested = this.getSuggestedVehicles(incident.keyword);
        
        suggestedList.innerHTML = suggested.map(type => `
            <div style="padding: 5px; background: #0f3460; margin: 5px 0; border-radius: 4px;">
                ${type}
            </div>
        `).join('');

        // Show available vehicles
        const available = this.vehicles.filter(v => v.status === 'available');
        
        dispatchList.innerHTML = available.map(vehicle => `
            <div style="padding: 10px; background: #0f3460; margin: 5px 0; border-radius: 4px; cursor: pointer;"
                 onclick="game.toggleVehicleSelection('${vehicle.id}')" id="dispatch-${vehicle.id}">
                <input type="checkbox" id="check-${vehicle.id}" style="margin-right: 10px;">
                ${vehicle.callsign} - ${vehicle.name}
            </div>
        `).join('');

        this.showModal('dispatch-modal');
        
        document.getElementById('dispatch-confirm').onclick = () => {
            this.dispatchVehicles(incident);
        };
    }

    toggleVehicleSelection(vehicleId) {
        const checkbox = document.getElementById(`check-${vehicleId}`);
        checkbox.checked = !checkbox.checked;
        
        if (checkbox.checked) {
            if (!this.selectedVehicles.includes(vehicleId)) {
                this.selectedVehicles.push(vehicleId);
            }
        } else {
            this.selectedVehicles = this.selectedVehicles.filter(id => id !== vehicleId);
        }
    }

    dispatchVehicles(incident) {
        if (this.selectedVehicles.length === 0) {
            this.showNotification('Bitte wählen Sie mindestens ein Fahrzeug aus', 'warning');
            return;
        }

        this.selectedVehicles.forEach(vehicleId => {
            const vehicle = this.vehicles.find(v => v.id == vehicleId);
            if (vehicle) {
                vehicle.status = 'responding';
                vehicle.incident = incident.id;
                this.mapManager.dispatchVehicle(vehicle, incident.position);
                this.addRadioMessage(`${vehicle.callsign} - Alarmiert zu ${incident.keyword}, ${incident.location}`);
            }
        });

        incident.assignedVehicles = [...this.selectedVehicles];
        this.selectedVehicles = [];
        
        this.closeAllModals();
        this.showNotification(`${incident.assignedVehicles.length} Fahrzeug(e) alarmiert`, 'success');
        this.updateUI();
    }

    getSuggestedVehicles(keyword) {
        const keywordData = this.keywords.find(k => k.keyword === keyword);
        return keywordData ? keywordData.suggestedVehicles : ['RTW'];
    }

    addPhoneMessage(text, sender = 'caller') {
        const container = document.getElementById('phone-messages');
        const time = this.gameTime.toLocaleTimeString('de-DE');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'comm-message ' + (sender === 'caller' ? 'incoming' : 'outgoing');
        messageDiv.innerHTML = `
            <div class="comm-time">${time}</div>
            <div class="comm-text">${text}</div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    addRadioMessage(text) {
        const container = document.getElementById('radio-messages');
        const time = this.gameTime.toLocaleTimeString('de-DE');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'comm-message system';
        messageDiv.innerHTML = `
            <div class="comm-time">${time}</div>
            <div class="comm-text">${text}</div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    addLogMessage(text) {
        const container = document.getElementById('log-messages');
        const time = this.gameTime.toLocaleTimeString('de-DE');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'comm-message system';
        messageDiv.innerHTML = `
            <div class="comm-time">${time}</div>
            <div class="comm-text">${text}</div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    showNotification(text, type = 'info') {
        const container = document.getElementById('notification-container');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <strong>${type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</strong>
            ${text}
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showModal(modalId) {
        document.getElementById('modal-overlay').style.display = 'flex';
        document.getElementById(modalId).style.display = 'block';
    }

    closeAllModals() {
        document.getElementById('modal-overlay').style.display = 'none';
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    showTutorial() {
        this.tutorialActive = true;
        this.tutorialStep = 0;
        this.showTutorialStep();
    }

    showTutorialStep() {
        const steps = [
            {
                title: 'Willkommen beim Leitstellensimulator!',
                content: `
                    <p>Herzlich willkommen! In diesem Spiel übernimmst du die Rolle eines Disponenten auf der Integrierten Leitstelle Waiblingen.</p>
                    <p>Deine Aufgabe ist es, Notrufe entgegenzunehmen und die richtigen Einsatzmittel zu alarmieren.</p>
                `
            },
            {
                title: 'Die Spieloberfläche',
                content: `
                    <h3>Aufbau:</h3>
                    <ul>
                        <li><strong>Links:</strong> Einsatzliste mit allen aktiven und neuen Einsätzen</li>
                        <li><strong>Mitte:</strong> Karte mit Fahrzeugen und Einsatzorten</li>
                        <li><strong>Rechts:</strong> Fahrzeugliste und Details</li>
                        <li><strong>Unten:</strong> Kommunikation (Notruf, Funk, Protokoll)</li>
                    </ul>
                `
            },
            {
                title: 'Einsätze annehmen',
                content: `
                    <p>Wenn ein neuer Notruf eingeht, erscheint dieser in der Einsatzliste (links) mit orangem Rand.</p>
                    <p>Klicke auf den Einsatz, um Details zu sehen und das Notrufgespräch zu führen.</p>
                    <p>Stelle dem Anrufer Fragen mit den Schnellantworten!</p>
                `
            },
            {
                title: 'Fahrzeuge alarmieren',
                content: `
                    <p>Nach dem Notrufgespräch wählst du die passenden Fahrzeuge aus:</p>
                    <ul>
                        <li><strong>RTW:</strong> Rettungswagen für medizinische Notfälle</li>
                        <li><strong>NEF:</strong> Notarzteinsatzfahrzeug für schwere Fälle</li>
                        <li><strong>KTW:</strong> Krankentransportwagen für leichte Fälle</li>
                    </ul>
                    <p>Das System schlägt dir die richtige Alarmierung vor!</p>
                `
            },
            {
                title: 'Fahrzeuge & Wirtschaft',
                content: `
                    <p>Du startest mit 3 Fahrzeugen an der Wache Backnang.</p>
                    <p>Für erfolgreiche Einsätze erhältst du Credits, mit denen du weitere Fahrzeuge kaufen kannst.</p>
                    <p>Baue dein Rettungsdienstnetz im Rems-Murr-Kreis aus!</p>
                `
            },
            {
                title: 'Zeitsteuerung',
                content: `
                    <p>Oben rechts kannst du die Spielgeschwindigkeit einstellen (1x bis 60x).</p>
                    <p>Höhere Geschwindigkeit = mehr Einsätze pro Minute!</p>
                `
            },
            {
                title: 'Viel Erfolg!',
                content: `
                    <p>Das Tutorial ist abgeschlossen. Viel Erfolg beim Disponieren!</p>
                    <p>Du kannst das Tutorial jederzeit über den Button oben rechts erneut starten.</p>
                    <p><strong>Tipp:</strong> Achte auf die Stichwörter (z.B. RD 1, RD 2) - sie geben die Dringlichkeit an!</p>
                `
            }
        ];

        const step = steps[this.tutorialStep];
        const content = document.getElementById('tutorial-content');
        
        content.innerHTML = `
            <h3>${step.title}</h3>
            ${step.content}
            <p style="margin-top: 20px; color: #aaa;">Schritt ${this.tutorialStep + 1} von ${steps.length}</p>
        `;

        this.showModal('tutorial-modal');
        
        // Update buttons
        document.getElementById('tutorial-prev').disabled = this.tutorialStep === 0;
        document.getElementById('tutorial-next').textContent = 
            this.tutorialStep === steps.length - 1 ? 'Tutorial beenden' : 'Weiter ➡';
    }

    nextTutorialStep() {
        const maxSteps = 7;
        if (this.tutorialStep < maxSteps - 1) {
            this.tutorialStep++;
            this.showTutorialStep();
        } else {
            this.closeAllModals();
            this.tutorialActive = false;
        }
    }

    prevTutorialStep() {
        if (this.tutorialStep > 0) {
            this.tutorialStep--;
            this.showTutorialStep();
        }
    }
}

// Initialize game
window.game = new Game();

export { Game };