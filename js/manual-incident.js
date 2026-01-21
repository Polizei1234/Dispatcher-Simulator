// =========================
// MANUAL INCIDENT CREATION v2.0
// Modal für manuelle Einsatzerstellung mit Keywords-Dropdown
// =========================

const ManualIncident = {
    selectedVehicles: [],
    modalOpen: false,
    selectedPriorityKeyword: null,
    selectedDetailKeyword: null,

    initialize() {
        console.log('📝 Manual Incident System initialisiert');
        this.createModalHTML();
        this.attachEventListeners();
    },

    createModalHTML() {
        const modal = document.createElement('div');
        modal.id = 'manual-incident-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 1200px; height: 85vh;">
                <div class="modal-header">
                    <h2><i class="fas fa-plus-circle"></i> Neuen Einsatz erstellen</h2>
                    <button class="close-btn" onclick="ManualIncident.closeModal()">×</button>
                </div>
                <div class="modal-body" style="display: flex; flex-direction: column; height: calc(100% - 120px);">
                    <!-- Einsatzdaten -->
                    <div style="padding: 20px; border-bottom: 2px solid var(--border-color);">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div class="form-group">
                                <label>Einsatznummer:</label>
                                <input type="text" id="manual-nummer" readonly>
                            </div>
                            <div class="form-group">
                                <label>🚨 Prioritätsstufe (RD/MANV):</label>
                                <input type="text" id="manual-priority" placeholder="z.B. RD 2, MANV 1" autocomplete="off">
                                <small style="color: #888; font-size: 0.85em;">Grobes Einsatzstichwort mit Durchsuchung</small>
                            </div>
                            <div class="form-group">
                                <label>💔 Detail-Stichwort:</label>
                                <input type="text" id="manual-detail" placeholder="z.B. VU, Herzinfarkt, Geburt" autocomplete="off">
                                <small style="color: #888; font-size: 0.85em;">Detailliertes medizinisches Stichwort</small>
                            </div>
                            <div class="form-group">
                                <label>Ort:</label>
                                <input type="text" id="manual-ort" placeholder="Straße Nummer, Stadt">
                            </div>
                            <div class="form-group">
                                <label>Koordinaten (optional):</label>
                                <input type="text" id="manual-coords" placeholder="48.123, 9.456">
                            </div>
                        </div>
                        <div class="form-group" style="margin-top: 10px;">
                            <label>Meldebild:</label>
                            <textarea id="manual-meldebild" rows="2" placeholder="Kurze Beschreibung des Einsatzes..."></textarea>
                        </div>
                    </div>

                    <!-- Fahrzeugauswahl -->
                    <div style="flex: 1; padding: 20px; overflow-y: auto;">
                        <h4 style="margin-bottom: 15px;">🚑 Fahrzeuge auswählen</h4>
                        <div id="manual-vehicle-grid" class="vehicle-cards-improved"></div>
                    </div>
                </div>
                <div class="modal-footer" style="padding: 20px; border-top: 2px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="color: var(--text-secondary);"><span id="manual-selected-count">0</span> Fahrzeug(e) ausgewählt</span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-secondary" onclick="ManualIncident.closeModal()">
                            <i class="fas fa-times"></i> Abbrechen
                        </button>
                        <button class="btn btn-success" id="manual-alarm-btn" onclick="ManualIncident.createIncident()" disabled>
                            <i class="fas fa-bell"></i> ALARMIEREN
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    attachEventListeners() {
        // Close on outside click
        const modal = document.getElementById('manual-incident-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOpen) {
                this.closeModal();
            }
        });
    },

    openModal() {
        this.selectedVehicles = [];
        this.selectedPriorityKeyword = null;
        this.selectedDetailKeyword = null;
        this.modalOpen = true;

        // Generiere Einsatznummer
        const nummer = IncidentNumbering.generateNumber();
        document.getElementById('manual-nummer').value = nummer;

        // Leere Felder
        document.getElementById('manual-priority').value = '';
        document.getElementById('manual-detail').value = '';
        document.getElementById('manual-ort').value = '';
        document.getElementById('manual-coords').value = '';
        document.getElementById('manual-meldebild').value = '';

        // Lade Fahrzeuge
        this.loadVehicles();

        // Show Modal
        const modal = document.getElementById('manual-incident-modal');
        if (modal) {
            modal.classList.add('active');
        }

        // Initialisiere Keywords-Dropdowns (nach Modal-Anzeige)
        setTimeout(() => {
            this.initializeKeywordsDropdowns();
        }, 100);

        console.log('📝 Manual Incident Modal geöffnet');
    },

    initializeKeywordsDropdowns() {
        if (typeof KeywordsDropdown === 'undefined') {
            console.error('❌ KeywordsDropdown nicht geladen!');
            return;
        }

        // Prioritäts-Dropdown
        KeywordsDropdown.initializePriorityDropdown('manual-priority', (keywordData) => {
            this.selectedPriorityKeyword = keywordData;
            console.log('✅ Priorität ausgewählt:', keywordData.keyword);
            
            // Automatisch vorgeschlagene Fahrzeuge auswählen (optional)
            if (keywordData.suggestedVehicles && keywordData.suggestedVehicles.length > 0) {
                this.autoSelectVehicles(keywordData.suggestedVehicles);
            }
        });

        // Detail-Dropdown
        KeywordsDropdown.initializeDetailDropdown('manual-detail', (keywordData) => {
            this.selectedDetailKeyword = keywordData;
            console.log('✅ Detail-Stichwort ausgewählt:', keywordData.keyword);
        });
    },

    autoSelectVehicles(suggestedTypes) {
        // Automatische Auswahl von Fahrzeugen basierend auf Vorschlägen
        const availableVehicles = GAME_DATA.vehicles.filter(v => 
            v.status === 'available' && v.owned
        );

        suggestedTypes.forEach(type => {
            const vehicle = availableVehicles.find(v => {
                const vType = v.type.toUpperCase();
                return (vType === type.toUpperCase() || vType.includes(type.toUpperCase())) &&
                       !this.selectedVehicles.includes(v.id);
            });

            if (vehicle) {
                this.selectedVehicles.push(vehicle.id);
                const card = document.querySelector(`#manual-vehicle-grid .vehicle-card-large[data-id="${vehicle.id}"]`);
                if (card) {
                    card.classList.add('selected');
                }
            }
        });

        this.updateUI();
    },

    closeModal() {
        this.modalOpen = false;
        this.selectedVehicles = [];
        this.selectedPriorityKeyword = null;
        this.selectedDetailKeyword = null;

        const modal = document.getElementById('manual-incident-modal');
        if (modal) {
            modal.classList.remove('active');
        }

        console.log('📝 Manual Incident Modal geschlossen');
    },

    loadVehicles() {
        const grid = document.getElementById('manual-vehicle-grid');
        if (!grid) return;

        const vehicleTypes = ['RTW', 'NEF', 'KTW', 'KDOW', 'GW-SAN'];
        grid.innerHTML = '';

        vehicleTypes.forEach(type => {
            const vehicles = GAME_DATA.vehicles.filter(v => {
                const vType = v.type.toUpperCase();
                return (vType === type || vType.includes(type)) && 
                       v.status === 'available' && 
                       v.owned;
            });

            if (vehicles.length === 0) return;

            const section = document.createElement('div');
            section.className = 'vehicle-type-section';
            section.innerHTML = `
                <h6 style="margin: 10px 0; color: #a0a0a0; font-size: 0.9em;">${type} - ${vehicles.length} verfügbar</h6>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; margin-bottom: 20px;">
                    ${vehicles.map(v => `
                        <div class="vehicle-card-large" data-id="${v.id}" onclick="ManualIncident.toggleVehicle('${v.id}')">
                            <div class="vehicle-card-icon">🚑</div>
                            <div class="vehicle-card-name">${v.callsign || v.name}</div>
                            <div class="vehicle-card-station">${v.station || 'Wache'}</div>
                            <div class="vehicle-card-type">${v.type}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            grid.appendChild(section);
        });
    },

    toggleVehicle(id) {
        const card = document.querySelector(`#manual-vehicle-grid .vehicle-card-large[data-id="${id}"]`);
        if (!card) return;

        if (this.selectedVehicles.includes(id)) {
            this.selectedVehicles = this.selectedVehicles.filter(v => v !== id);
            card.classList.remove('selected');
        } else {
            this.selectedVehicles.push(id);
            card.classList.add('selected');
        }

        this.updateUI();
    },

    updateUI() {
        const countSpan = document.getElementById('manual-selected-count');
        const alarmBtn = document.getElementById('manual-alarm-btn');

        if (countSpan) {
            countSpan.textContent = this.selectedVehicles.length;
        }

        if (alarmBtn) {
            alarmBtn.disabled = this.selectedVehicles.length === 0;
        }
    },

    async createIncident() {
        const priorityInput = document.getElementById('manual-priority').value.trim();
        const detailInput = document.getElementById('manual-detail').value.trim();
        const ort = document.getElementById('manual-ort').value.trim();
        const meldebild = document.getElementById('manual-meldebild').value.trim();
        const coordsInput = document.getElementById('manual-coords').value.trim();

        // Validierung
        if (!priorityInput && !detailInput) {
            alert('⚠️ Bitte mindestens ein Stichwort (Priorität oder Detail) eingeben!');
            return;
        }

        if (!ort) {
            alert('⚠️ Bitte Ort eingeben!');
            return;
        }

        if (this.selectedVehicles.length === 0) {
            alert('⚠️ Bitte mindestens 1 Fahrzeug auswählen!');
            return;
        }

        // Kombiniere Stichwörter
        const stichwortParts = [];
        if (priorityInput) stichwortParts.push(priorityInput);
        if (detailInput) stichwortParts.push(detailInput);
        const stichwort = stichwortParts.join(' - ');

        // Koordinaten parsen oder aus Ort ermitteln
        let koordinaten = null;

        if (coordsInput) {
            // Manuell eingegebene Koordinaten
            const parts = coordsInput.split(',');
            if (parts.length === 2) {
                koordinaten = {
                    lat: parseFloat(parts[0].trim()),
                    lon: parseFloat(parts[1].trim())
                };
            }
        }

        if (!koordinaten) {
            // Geocode Adresse
            console.log('🗺️ Geocoding Adresse:', ort);
            koordinaten = await this.geocodeAddress(ort);
        }

        if (!koordinaten) {
            alert('⚠️ Koordinaten konnten nicht ermittelt werden. Bitte manuell eingeben.');
            return;
        }

        // Erstelle Einsatz
        const incident = {
            id: document.getElementById('manual-nummer').value,
            stichwort: stichwort,
            priorityKeyword: priorityInput,
            detailKeyword: detailInput,
            ort: ort,
            meldebild: meldebild || 'Manuell erstellter Einsatz',
            koordinaten: koordinaten,
            vehicles: [...this.selectedVehicles],
            zeitstempel: IncidentNumbering.getCurrentTimestamp(),
            status: 'active',
            completed: false
        };

        // Zu GAME_DATA hinzufügen
        if (!GAME_DATA.incidents.find(i => i.id === incident.id)) {
            GAME_DATA.incidents.push(incident);
            console.log('✅ Manueller Einsatz erstellt:', incident.id);
        }

        // Fahrzeuge disponieren
        this.selectedVehicles.forEach(vId => {
            const vehicle = GAME_DATA.vehicles.find(v => v.id === vId);
            if (vehicle) {
                vehicle.status = 'dispatched';
                vehicle.incident = incident.id;
                vehicle.targetLocation = koordinaten;

                // VehicleMovement starten
                if (typeof VehicleMovement !== 'undefined' && VehicleMovement.dispatchVehicle) {
                    VehicleMovement.dispatchVehicle(vId, koordinaten, incident.id);
                }
            }
        });

        // Funkspruch
        const msg = `${incident.stichwort}, ${incident.ort}. ${incident.vehicles.length} Fahrzeug(e) alarmiert.`;
        if (typeof addRadioMessage === 'function') {
            addRadioMessage(msg, 'dispatcher');
        }

        // UI Update
        if (typeof updateUI === 'function') {
            updateUI();
        }

        // Modal schließen
        this.closeModal();

        // Zur Karte wechseln
        if (typeof switchTab === 'function') {
            switchTab('map');
        }

        alert(`✅ Einsatz ${incident.id} erfolgreich erstellt!`);
    },

    async geocodeAddress(address) {
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Rems-Murr-Kreis')}&limit=1`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'ILS-Waiblingen-Simulator/1.0'
                }
            });

            if (!response.ok) return null;

            const data = await response.json();
            if (data.length === 0) return null;

            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };
        } catch (error) {
            console.error('❌ Geocoding Fehler:', error);
            return null;
        }
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        ManualIncident.initialize();
    });

    window.ManualIncident = ManualIncident;
}