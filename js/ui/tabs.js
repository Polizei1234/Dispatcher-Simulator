import VehicleStatusUtil from '../utils/vehicle-status.js';

class TabManager {
    constructor() {
        this.currentTab = 'map';
        this.collapsedStations = new Set();
        this.vehicleFilter = 'all';
        this.game = null;
        this.stations = null;

        console.log('✅ TabManager v7.0.0 constructed');
    }

    initialize(game, stations) {
        this.game = game;
        this.stations = stations;

        this.setupTabButtons();
        this.setupKeyboardShortcuts();
        this.startAutoUpdate();

        console.log('✅ TabManager initialized');
    }

    setupTabButtons() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return;
            }
            const tabMap = { '1': 'map', '2': 'vehicles', '3': 'incidents', '4': 'stats' };
            if (tabMap[e.key]) {
                e.preventDefault();
                this.switchTab(tabMap[e.key]);
            }
            if (this.currentTab === 'vehicles') {
                if (e.key === 'f' || e.key === 'F') {
                    e.preventDefault();
                    this.cycleFilter();
                } else if (e.key === 'c' || e.key === 'C') {
                    e.preventDefault();
                    this.toggleAllStations();
                }
            }
        });
    }

    switchTab(tabName) {
        console.log(`🔄 Switching to tab: ${tabName}`);
        this.currentTab = tabName;

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
        });

        if (tabName === 'map' && window.map) {
            setTimeout(() => window.map.invalidateSize(), 100);
        } else if (tabName === 'vehicles') {
            this.updateVehiclesOverview();
        } else if (tabName === 'incidents') {
            this.updateIncidentsOverview();
        }
    }

    updateVehiclesOverview() {
        if (!this.game) return;
        const container = document.getElementById('vehicles-overview');
        if (!container) return;

        const ownedVehicles = this.game.vehicles.filter(v => v.owned);
        if (ownedVehicles.length === 0) {
            container.innerHTML = `<div style="text-align: center; padding: 50px; color: #a0aec0;"><i class="fas fa-ambulance" style="font-size: 4em; margin-bottom: 20px; opacity: 0.3;"></i><h2>No vehicles available</h2><p>Buy vehicles in the shop to get started!</p></div>`;
            return;
        }

        let filteredVehicles = ownedVehicles;
        if (this.vehicleFilter === 'available') {
            filteredVehicles = ownedVehicles.filter(v => VehicleStatusUtil.isAvailable(v));
        } else if (this.vehicleFilter === 'inuse') {
            filteredVehicles = ownedVehicles.filter(v => VehicleStatusUtil.isOnMission(v));
        }

        const stationGroups = {};
        filteredVehicles.forEach(vehicle => {
            const stationId = vehicle.station;
            if (!stationGroups[stationId]) stationGroups[stationId] = [];
            stationGroups[stationId].push(vehicle);
        });

        const sortedStations = Object.keys(stationGroups).sort((a, b) => {
            const stationA = this.stations[a];
            const stationB = this.stations[b];
            if (!stationA || !stationB) return 0;
            const isOvA = stationA.category === 'ortsverein';
            const isOvB = stationB.category === 'ortsverein';
            if (isOvA !== isOvB) return isOvA ? 1 : -1;
            return stationA.name.localeCompare(stationB.name);
        });

        const totalVehicles = ownedVehicles.length;
        const availableVehicles = ownedVehicles.filter(v => VehicleStatusUtil.isAvailable(v)).length;

        let html = `
            <div class="vehicles-header-compact">
                <div class="header-row"><h2>🚑 Vehicles</h2><div class="quick-stats"><span class="stat" style="color: #28a745;">🟢 ${availableVehicles}</span><span class="stat" style="color: #dc3545;">🔴 ${totalVehicles - availableVehicles}</span><span class="stat" style="color: #6c757d;">📦 ${totalVehicles}</span></div></div>
                <div class="filter-row"><div class="filter-buttons">
                    <button class="filter-btn ${this.vehicleFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                    <button class="filter-btn ${this.vehicleFilter === 'available' ? 'active' : ''}" data-filter="available">Available</button>
                    <button class="filter-btn ${this.vehicleFilter === 'inuse' ? 'active' : ''}" data-filter="inuse">In Use</button>
                </div><div class="action-buttons"><button class="action-btn" id="toggle-stations-btn"><i class="fas fa-${this.collapsedStations.size > 0 ? 'expand' : 'compress'}-alt"></i></button></div></div>
                <div class="shortcuts-hint"><i class="fas fa-keyboard"></i><span>Shortcuts: <kbd>1-4</kbd> Tabs | <kbd>F</kbd> Filter | <kbd>C</kbd> Collapse</span></div>
            </div>
        `;

        html += '<div class="stations-container-compact">';
        sortedStations.forEach(stationId => {
            const station = this.stations[stationId];
            if (!station) return;
            const vehicles = stationGroups[stationId];
            const isCollapsed = this.collapsedStations.has(stationId);
            let stationIcon = '🏥';
            if (station.category === 'ortsverein') stationIcon = '🔴';
            else if (station.category === 'notarztwache') stationIcon = '⚠️';
            const stationAvailable = vehicles.filter(v => VehicleStatusUtil.isAvailable(v)).length;
            const availabilityColor = stationAvailable === vehicles.length ? '#28a745' : stationAvailable > 0 ? '#ffc107' : '#dc3545';

            html += `
                <div class="station-group-compact">
                    <div class="station-header-compact" data-station-id="${stationId}">
                        <span class="station-icon-compact">${stationIcon}</span><span class="station-name-compact">${station.name}</span><span class="station-count" style="color: ${availabilityColor};">${stationAvailable}/${vehicles.length}</span><i class="fas fa-chevron-down collapse-icon-compact ${isCollapsed ? '' : 'open'}"></i>
                    </div>
                    <div class="station-vehicles-compact ${isCollapsed ? '' : 'open'}">
                        ${vehicles.map(v => this.createCompactVehicleCard(v)).join('')}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;

        // Add event listeners after rendering
        container.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', (e) => this.setVehicleFilter(e.currentTarget.dataset.filter)));
        container.querySelector('#toggle-stations-btn').addEventListener('click', () => this.toggleAllStations());
        container.querySelectorAll('.station-header-compact').forEach(header => header.addEventListener('click', (e) => this.toggleStation(e.currentTarget.dataset.stationId)));
    }

    createCompactVehicleCard(vehicle) {
        const fms = VehicleStatusUtil.getStatus(vehicle);
        const isAvailable = VehicleStatusUtil.isAvailable(vehicle);
        const icon = this.getVehicleIconCompact(vehicle.type);
        return `
            <div class="vehicle-card-compact" style="border-left: 3px solid ${fms.color};">
                <div class="vehicle-info-compact">
                    <span class="vehicle-icon-compact">${icon}</span>
                    <div class="vehicle-text"><span class="vehicle-callsign">${vehicle.callsign}</span><span class="vehicle-status-text" style="color: ${fms.color};">Status ${fms.code}</span></div>
                </div>
                <div class="vehicle-actions-compact">
                    ${isAvailable ? `<button class="btn-icon-compact btn-primary" data-vehicle-id="${vehicle.id}" title="Alarm"><i class="fas fa-bell"></i></button>` : `<button class="btn-icon-compact" disabled style="opacity: 0.3;" title="In Use"><i class="fas fa-clock"></i></button>`}
                </div>
            </div>
        `;
    }

    setVehicleFilter(filter) {
        this.vehicleFilter = filter;
        this.updateVehiclesOverview();
    }

    toggleStation(stationId) {
        if (this.collapsedStations.has(stationId)) {
            this.collapsedStations.delete(stationId);
        } else {
            this.collapsedStations.add(stationId);
        }
        this.updateVehiclesOverview();
    }
    
    toggleAllStations() {
        if (this.collapsedStations.size > 0) {
            this.collapsedStations.clear();
        } else {
            const stationIds = new Set(this.game.vehicles.filter(v => v.owned).map(v => v.station));
            this.collapsedStations = new Set(stationIds);
        }
        this.updateVehiclesOverview();
    }

    updateIncidentsOverview() {
         if (!this.game) return;
        const container = document.getElementById('incidents-overview');
        if (!container) return;

        const activeIncidents = this.game.incidents.filter(i => i.status !== 'completed');
        if (activeIncidents.length === 0) {
            container.innerHTML = `<div style="text-align: center; padding: 50px; color: #a0aec0;"><i class="fas fa-clipboard-list" style="font-size: 4em; margin-bottom: 20px; opacity: 0.3;"></i><h2>No active incidents</h2><p>All quiet in Waiblingen!</p></div>`;
            return;
        }

        let html = '<div style="padding: 20px;">';
        activeIncidents.forEach(incident => {
            html += `
                <div class="panel" style="margin-bottom: 20px;">
                    <div class="panel-header"><h3>${this.getIncidentIcon(incident.type)} ${incident.title}</h3></div>
                    <div class="panel-content">
                        <p><strong>Location:</strong> ${incident.location}</p>
                        <p><strong>Time:</strong> ${new Date(incident.timestamp).toLocaleTimeString('de-DE')}</p>
                        <p><strong>Status:</strong> ${incident.status}</p>
                        ${incident.assignedVehicles && incident.assignedVehicles.length > 0 ? `<p><strong>Assigned Vehicles:</strong></p><ul>${incident.assignedVehicles.map(vid => { const v = this.game.vehicles.find(vehicle => vehicle.id === vid); return v ? `<li>${v.callsign}</li>` : ''; }).join('')}</ul>` : ''}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    startAutoUpdate() {
        setInterval(() => {
            if (this.currentTab === 'vehicles') {
                this.updateVehiclesOverview();
            } else if (this.currentTab === 'incidents') {
                this.updateIncidentsOverview();
            }
        }, 3000);
    }

    getVehicleIconCompact(type) {
        const icons = { 'RTW': '🚑', 'NEF': '⚕️', 'KTW': '🚐', 'Kdow': '🚨', 'GW-San': '🚚' };
        return icons[type] || '🚑';
    }

    getIncidentIcon(type) {
        const icons = { 'medical': '🆘', 'fire': '🔥', 'rescue': '🚨', 'accident': '🚗' };
        return icons[type] || '🚨';
    }
}

const tabManager = new TabManager();
export default tabManager;
