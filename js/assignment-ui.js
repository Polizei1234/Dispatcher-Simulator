// =========================
// ASSIGNMENT UI
// Fahrzeugauswahl-Interface mit ETA-Sortierung
// =========================

const AssignmentUI = {
    currentIncident: null,
    selectedVehicles: [],
    vehicleSuggestions: null,

    /**
     * Initialisiert Assignment UI
     */
    initialize() {
        console.log('🚑 Assignment UI initialisiert');
        this.setupEventListeners();
    },

    /**
     * Event Listeners
     */
    setupEventListeners() {
        const alarmBtn = document.getElementById('alarm-vehicles-btn');
        if (alarmBtn) {
            alarmBtn.addEventListener('click', () => this.alarmVehicles());
        }
    },

    /**
     * Zeigt Fahrzeugauswahl für Einsatz
     */
    showVehicleSelection(incident) {
        this.currentIncident = incident;
        this.selectedVehicles = [];

        console.group('🚑 VEHICLE SELECTION');
        console.log('🚨 Einsatz:', incident.nummer);
        console.log('🏷️ Stichwort:', incident.stichwort);

        // Hole Fahrzeugvorschläge
        const requiredTypes = this.extractRequiredVehicleTypes(incident);
        console.log('🚑 Benötigte Typen:', requiredTypes);

        // Finde beste Fahrzeuge
        this.vehicleSuggestions = VehicleAnalyzer.findBestVehicles(
            incident.koordinaten,
            requiredTypes
        );

        // Zeige UI
        this.renderVehicleSelection();

        console.groupEnd();
    },

    /**
     * Extrahiert benötigte Fahrzeugtypen aus Einsatz
     */
    extractRequiredVehicleTypes(incident) {
        const types = [];

        // Aus Groq-Vorschlag
        if (incident.fahrzeuge_vorschlag?.pflicht) {
            incident.fahrzeuge_vorschlag.pflicht.forEach(fz => {
                types.push(fz.typ);
            });
        }

        // Fallback: Mindestens RTW
        if (types.length === 0) {
            types.push('RTW');
        }

        return types;
    },

    /**
     * Rendert Fahrzeugauswahl
     */
    renderVehicleSelection() {
        const container = document.getElementById('vehicle-selection-container');
        if (!container) return;

        container.style.display = 'block';

        let html = `
            <div class="assignment-header">
                <h2>🚨 Einsatz ${this.currentIncident.nummer}</h2>
                <div class="incident-summary">
                    <div><strong>Stichwort:</strong> ${this.currentIncident.stichwort}</div>
                    <div><strong>Ort:</strong> ${this.currentIncident.ort}</div>
                </div>
            </div>

            <div class="assignment-recommendation">
                <h3>📊 Empfohlene Alarmierung:</h3>
                <div class="recommendation-list">
        `;

        // Zeige Empfehlungen aus Groq
        if (this.currentIncident.fahrzeuge_vorschlag) {
            const { pflicht, optional } = this.currentIncident.fahrzeuge_vorschlag;

            pflicht.forEach(fz => {
                html += `
                    <div class="recommendation-item required">
                        <span class="icon">✅</span>
                        <strong>${fz.typ}</strong> - ${fz.grund}
                    </div>
                `;
            });

            if (optional && optional.length > 0) {
                optional.forEach(fz => {
                    html += `
                        <div class="recommendation-item optional">
                            <span class="icon">○</span>
                            <strong>${fz.typ}</strong> - ${fz.grund} <em>(optional)</em>
                        </div>
                    `;
                });
            }
        }

        html += `
                </div>
            </div>

            <div class="vehicle-selection-panels">
        `;

        // Für jeden Fahrzeugtyp ein Panel
        Object.entries(this.vehicleSuggestions).forEach(([type, vehicles]) => {
            html += this.renderVehicleTypePanel(type, vehicles);
        });

        html += `
            </div>

            <div class="assignment-actions">
                <div class="selected-summary">
                    <strong>Ausgewählt:</strong> <span id="selected-count">0</span> Fahrzeuge
                </div>
                <button id="alarm-vehicles-btn" class="btn btn-danger btn-large">
                    🚨 Alarmieren
                </button>
            </div>
        `;

        container.innerHTML = html;

        // Re-attach event listeners
        this.setupVehicleClickListeners();
        this.setupEventListeners();
    },

    /**
     * Rendert Panel für einen Fahrzeugtyp
     */
    renderVehicleTypePanel(type, vehicles) {
        if (vehicles.length === 0) {
            return `
                <div class="vehicle-panel">
                    <h3>${type} auswählen</h3>
                    <div class="no-vehicles">⚠️ Kein ${type} verfügbar</div>
                </div>
            `;
        }

        let html = `
            <div class="vehicle-panel">
                <h3>${type} auswählen</h3>
                <div class="vehicle-list">
        `;

        vehicles.forEach(({ vehicle, status, distance, eta, score }) => {
            const statusInfo = this.getStatusInfo(status);
            const isAvailable = score > 0;
            const disabledClass = !isAvailable ? 'disabled' : '';

            html += `
                <div class="vehicle-item ${disabledClass}" 
                     data-vehicle-id="${vehicle.id}"
                     data-available="${isAvailable}">
                    <div class="vehicle-header">
                        <span class="vehicle-name">${vehicle.name}</span>
                        <span class="status-badge" style="background: ${statusInfo.color}">
                            ${statusInfo.icon} Status ${status}
                        </span>
                    </div>
                    <div class="vehicle-details">
                        <span class="detail">📍 ${distance.toFixed(1)} km</span>
                        <span class="detail">⏱️ ${eta} Min</span>
                        <span class="detail">${statusInfo.text}</span>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    },

    /**
     * Gibt Status-Info zurück
     */
    getStatusInfo(status) {
        const statusMap = {
            '1': { icon: '🟢', color: '#28a745', text: 'Unterwegs, sofort verfügbar' },
            '2': { icon: '🟢', color: '#1e7e34', text: 'Auf Wache, +2 Min' },
            '8': { icon: '🟣', color: '#6610f2', text: 'Am Standort' },
            '7': { icon: '🟣', color: '#e83e8c', text: 'Patient an Bord, ~15 Min' },
            '6': { icon: '🟣', color: '#6f42c1', text: 'Am Krankenhaus, ~10 Min' },
            '4': { icon: '🟠', color: '#fd7e14', text: 'Im Einsatz, ~30 Min' },
            '3': { icon: '🟡', color: '#ffc107', text: 'Fährt zu Einsatz - nicht verfügbar' },
            'E': { icon: '⚫', color: '#000000', text: 'Nicht einsatzbereit' }
        };

        return statusMap[status] || { icon: '●', color: '#6c757d', text: 'Unbekannt' };
    },

    /**
     * Setup Click Listener für Fahrzeuge
     */
    setupVehicleClickListeners() {
        const items = document.querySelectorAll('.vehicle-item');
        items.forEach(item => {
            if (item.dataset.available === 'true') {
                item.addEventListener('click', () => {
                    this.toggleVehicleSelection(item);
                });
            }
        });
    },

    /**
     * Togglet Fahrzeugauswahl
     */
    toggleVehicleSelection(element) {
        const vehicleId = element.dataset.vehicleId;
        const vehicle = VEHICLES.find(v => v.id === vehicleId);
        
        if (!vehicle) return;

        const isSelected = element.classList.contains('selected');

        if (isSelected) {
            // Abwählen
            element.classList.remove('selected');
            this.selectedVehicles = this.selectedVehicles.filter(v => v.id !== vehicleId);
            console.log('❌ Fahrzeug abgewählt:', vehicle.name);
        } else {
            // Auswählen
            element.classList.add('selected');
            this.selectedVehicles.push(vehicle);
            console.log('✅ Fahrzeug ausgewählt:', vehicle.name);
        }

        // Update Zähler
        const counter = document.getElementById('selected-count');
        if (counter) {
            counter.textContent = this.selectedVehicles.length;
        }
    },

    /**
     * Alarmiert ausgewählte Fahrzeuge
     */
    async alarmVehicles() {
        if (this.selectedVehicles.length === 0) {
            alert('Bitte wählen Sie mindestens ein Fahrzeug aus!');
            return;
        }

        console.group('🚨 ALARMING VEHICLES');
        console.log('👨‍🚒 Fahrzeuge:', this.selectedVehicles.map(v => v.name));
        console.log('🚨 Einsatz:', this.currentIncident.nummer);

        // Alarmierung durchführen
        this.selectedVehicles.forEach(vehicle => {
            this.dispatchVehicle(vehicle, this.currentIncident);
        });

        console.groupEnd();

        // Groq Validierung
        if (typeof GroqValidator !== 'undefined') {
            await GroqValidator.validateAssignment(
                this.currentIncident,
                this.selectedVehicles
            );
        }

        // Schließe UI
        this.closeVehicleSelection();
    },

    /**
     * Alarmiert einzelnes Fahrzeug
     */
    dispatchVehicle(vehicle, incident) {
        console.log(`📡 Alarmiere ${vehicle.name} zu Einsatz ${incident.nummer}`);

        // Setze Status auf "3" (Einsatzauftrag übernommen)
        vehicle.currentStatus = '3';
        vehicle.status = 'dispatched';
        vehicle.currentIncident = incident.id;

        // Funkspruch
        const funkspruch = `Florian Leitstelle an ${vehicle.name}: ${incident.stichwort}, ${incident.ort}. Kommen!`;
        console.log(`📡 Funkspruch: ${funkspruch}`);

        // TODO: Update Map, add to active incidents
        // Wird in main.js / incidents.js integriert
    },

    /**
     * Schließt Fahrzeugauswahl
     */
    closeVehicleSelection() {
        const container = document.getElementById('vehicle-selection-container');
        if (container) {
            container.style.display = 'none';
        }

        this.currentIncident = null;
        this.selectedVehicles = [];
        this.vehicleSuggestions = null;
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        AssignmentUI.initialize();
    });
}
