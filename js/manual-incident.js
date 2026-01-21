// =========================
// MANUAL INCIDENT CREATION v3.2
// + Entfernungsanzeige auch im Modal!
// + Live-Update beim Ort-Eingabe
// + showInline() für Notruf-Tab Integration
// =========================

const ManualIncident = {
    selectedVehicles: [],
    modalOpen: false,
    inlineMode: false,
    selectedPriorityKeyword: null,
    selectedDetailKeyword: null,
    currentCallData: null,
    modalCoordinates: null,

    initialize() {
        console.log('📝 Manual Incident System v3.2 initialisiert');
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
                                <small style="color: #888; font-size: 0.85em;">Adresse für Entfernungsberechnung</small>
                            </div>
                            <div class="form-group">
                                <label>Koordinaten (optional):</label>
                                <input type="text" id="manual-coords" placeholder="48.123, 9.456">
                                <button type="button" class="btn btn-small" onclick="ManualIncident.geocodeManualAddress()" style="margin-top: 5px;">
                                    <i class="fas fa-map-marker-alt"></i> Aus Ort ermitteln
                                </button>
                            </div>
                        </div>
                        <div class="form-group" style="margin-top: 10px;">
                            <label>Meldebild:</label>
                            <textarea id="manual-meldebild" rows="2" placeholder="Kurze Beschreibung des Einsatzes..."></textarea>
                        </div>
                    </div>

                    <!-- Fahrzeugauswahl -->
                    <div style="flex: 1; padding: 20px; overflow-y: auto;">
                        <h4 style="margin-bottom: 15px;">🚑 Fahrzeuge auswählen <small style="color: #888; font-weight: normal;">(sortiert nach Entfernung)</small></h4>
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
        this.modalCoordinates = null;
        this.inlineMode = false;
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

    // 🚀 NEU: Geocode aus Modal Adress-Feld
    async geocodeManualAddress() {
        const ortInput = document.getElementById('manual-ort');
        const coordsInput = document.getElementById('manual-coords');

        if (!ortInput || !coordsInput) return;

        const address = ortInput.value.trim();
        if (!address) {
            alert('⚠️ Bitte zuerst eine Adresse eingeben!');
            return;
        }

        console.log('🗺️ Geocoding:', address);
        const coords = await this.geocodeAddress(address);

        if (coords) {
            coordsInput.value = `${coords.lat}, ${coords.lon}`;
            this.modalCoordinates = coords;
            console.log('✅ Koordinaten ermittelt:', coords);
            
            // Fahrzeuge neu laden mit Entfernung
            this.loadVehicles();
        } else {
            alert('❌ Adresse konnte nicht gefunden werden!');
        }
    },

    // 🚀 Inline-Modus für Notruf-Tab
    showInline(callData) {
        this.inlineMode = true;
        this.currentCallData = callData;
        this.selectedVehicles = [];
        this.selectedPriorityKeyword = null;
        this.selectedDetailKeyword = null;

        const container = document.getElementById('manual-incident-inline-container');
        if (!container) {
            console.error('❌ manual-incident-inline-container nicht gefunden!');
            return;
        }

        const nummer = IncidentNumbering.generateNumber();

        container.innerHTML = `
            <h3 style="margin-bottom: 20px;"><i class="fas fa-file-medical"></i> Einsatzprotokoll</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div class="form-group">
                    <label>Einsatznummer:</label>
                    <input type="text" id="inline-nummer" value="${nummer}" readonly>
                </div>
                <div class="form-group">
                    <label>🚨 Prioritätsstufe (RD/MANV):</label>
                    <input type="text" id="inline-priority" placeholder="z.B. RD 2, MANV 1" autocomplete="off">
                    <small style="color: #888; font-size: 0.85em;">Grobes Einsatzstichwort</small>
                </div>
                <div class="form-group">
                    <label>💔 Detail-Stichwort:</label>
                    <input type="text" id="inline-detail" placeholder="z.B. VU, Herzinfarkt" autocomplete="off">
                    <small style="color: #888; font-size: 0.85em;">Detailliertes Stichwort</small>
                </div>
                <div class="form-group">
                    <label>Ort:</label>
                    <input type="text" id="inline-ort" value="${callData?.einsatz?.ort || ''}" readonly>
                </div>
            </div>
            
            <div class="form-group" style="margin-bottom: 20px;">
                <label>Meldebild:</label>
                <textarea id="inline-meldebild" rows="3" placeholder="Wird automatisch aus Anruf-Antworten erstellt..."></textarea>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px;">🚑 Fahrzeuge auswählen <small style="color: #888; font-weight: normal;">(sortiert nach Entfernung)</small></h4>
                <div id="inline-vehicle-grid" class="vehicle-cards-improved" style="max-height: 400px; overflow-y: auto;"></div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 2px solid var(--border-color);">
                <span style="color: var(--text-secondary);"><span id="inline-selected-count">0</span> Fahrzeug(e) ausgewählt</span>
                <button class="btn btn-success" id="inline-alarm-btn" onclick="ManualIncident.createIncidentInline()" disabled>
                    <i class="fas fa-bell"></i> ALARMIEREN
                </button>
            </div>
        `;

        // Lade Fahrzeuge für Inline
        this.loadVehiclesInline();

        // Initialisiere Keywords-Dropdowns
        setTimeout(() => {
            this.initializeKeywordsDropdownsInline();
        }, 100);

        console.log('✅ Manual Incident Inline angezeigt');
    },

    // Clear Inline Container
    clearInline() {
        const container = document.getElementById('manual-incident-inline-container');
        if (container) {
            container.innerHTML = '';
        }
        this.inlineMode = false;
        this.currentCallData = null;
        this.selectedVehicles = [];
    },

    // Update from Call Answer
    updateFromCallAnswer(key, answer, callData) {
        if (!this.inlineMode) return;

        const meldebildTextarea = document.getElementById('inline-meldebild');
        if (!meldebildTextarea) return;

        const parts = [];
        
        if (callData.antworten.was_passiert) {
            parts.push(callData.antworten.was_passiert);
        }
        if (callData.antworten.bewusstsein) {
            parts.push('Bewusstsein: ' + callData.antworten.bewusstsein);
        }
        if (callData.antworten.atmung) {
            parts.push('Atmung: ' + callData.antworten.atmung);
        }
        if (callData.antworten.blutung) {
            parts.push('Blutung: ' + callData.antworten.blutung);
        }

        meldebildTextarea.value = parts.join('. ') || 'Notfall';
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

    // Keywords Dropdowns für Inline
    initializeKeywordsDropdownsInline() {
        if (typeof KeywordsDropdown === 'undefined') {
            console.error('❌ KeywordsDropdown nicht geladen!');
            return;
        }

        // Prioritäts-Dropdown
        KeywordsDropdown.initializePriorityDropdown('inline-priority', (keywordData) => {
            this.selectedPriorityKeyword = keywordData;
            console.log('✅ Priorität ausgewählt:', keywordData.keyword);
            
            // Automatisch vorgeschlagene Fahrzeuge auswählen
            if (keywordData.suggestedVehicles && keywordData.suggestedVehicles.length > 0) {
                this.autoSelectVehiclesInline(keywordData.suggestedVehicles);
            }
        });

        // Detail-Dropdown
        KeywordsDropdown.initializeDetailDropdown('inline-detail', (keywordData) => {
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

    // Auto-Select für Inline
    autoSelectVehiclesInline(suggestedTypes) {
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
                const card = document.querySelector(`#inline-vehicle-grid .vehicle-card-large[data-id="${vehicle.id}"]`);
                if (card) {
                    card.classList.add('selected');
                }
            }
        });

        this.updateUIInline();
    },

    closeModal() {
        this.modalOpen = false;
        this.selectedVehicles = [];
        this.selectedPriorityKeyword = null;
        this.selectedDetailKeyword = null;
        this.modalCoordinates = null;

        const modal = document.getElementById('manual-incident-modal');
        if (modal) {
            modal.classList.remove('active');
        }

        console.log('📝 Manual Incident Modal geschlossen');
    },

    // 🚀 Load Vehicles mit Entfernungsanzeige (MODAL)
    loadVehicles() {
        const grid = document.getElementById('manual-vehicle-grid');
        if (!grid) return;

        const vehicleTypes = ['RTW', 'NEF', 'KTW', 'KDOW', 'GW-SAN'];
        grid.innerHTML = '';

        // Koordinaten aus Eingabefeld holen
        const coordsInput = document.getElementById('manual-coords');
        let targetCoords = this.modalCoordinates;
        
        if (!targetCoords && coordsInput && coordsInput.value.trim()) {
            const parts = coordsInput.value.split(',');
            if (parts.length === 2) {
                targetCoords = {
                    lat: parseFloat(parts[0].trim()),
                    lon: parseFloat(parts[1].trim())
                };
            }
        }

        vehicleTypes.forEach(type => {
            let vehicles = GAME_DATA.vehicles.filter(v => {
                const vType = v.type.toUpperCase();
                return (vType === type || vType.includes(type)) && 
                       v.status === 'available' && 
                       v.owned;
            });

            if (vehicles.length === 0) return;

            // 🚀 SORTIERE nach Entfernung (wenn Koordinaten vorhanden)
            if (typeof VehicleMovement !== 'undefined' && VehicleMovement.getDistanceToIncident && targetCoords) {
                vehicles = vehicles.map(v => {
                    const distInfo = VehicleMovement.getDistanceToIncident(v.station, targetCoords);
                    return {
                        ...v,
                        distance: distInfo ? parseFloat(distInfo.km) : 999,
                        distanceText: distInfo ? distInfo.text : null
                    };
                }).sort((a, b) => a.distance - b.distance);
            }

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
                            ${v.distanceText ? `<div class="vehicle-card-distance" style="font-size: 0.75em; color: #4CAF50; margin-top: 3px;">📍 ${v.distanceText}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
            grid.appendChild(section);
        });

        if (!targetCoords) {
            const hint = document.createElement('p');
            hint.style.cssText = 'color: #888; text-align: center; margin: 20px; font-size: 0.9em;';
            hint.innerHTML = '<i class="fas fa-info-circle"></i> Koordinaten eingeben oder "Aus Ort ermitteln" klicken, um Entfernungen zu sehen';
            grid.prepend(hint);
        }
    },

    // 🚀 Load Vehicles für Inline mit Entfernungsanzeige
    loadVehiclesInline() {
        const grid = document.getElementById('inline-vehicle-grid');
        if (!grid) return;

        const vehicleTypes = ['RTW', 'NEF', 'KTW', 'KDOW', 'GW-SAN'];
        grid.innerHTML = '';

        vehicleTypes.forEach(type => {
            let vehicles = GAME_DATA.vehicles.filter(v => {
                const vType = v.type.toUpperCase();
                return (vType === type || vType.includes(type)) && 
                       v.status === 'available' && 
                       v.owned;
            });

            if (vehicles.length === 0) return;

            // 🚀 SORTIERE nach Entfernung zum Einsatzort
            if (typeof VehicleMovement !== 'undefined' && VehicleMovement.getDistanceToIncident && 
                this.currentCallData?.einsatz?.koordinaten) {
                vehicles = vehicles.map(v => {
                    const distInfo = VehicleMovement.getDistanceToIncident(v.station, this.currentCallData.einsatz.koordinaten);
                    return {
                        ...v,
                        distance: distInfo ? parseFloat(distInfo.km) : 999,
                        distanceText: distInfo ? distInfo.text : 'Unbekannt'
                    };
                }).sort((a, b) => a.distance - b.distance);
            }

            const section = document.createElement('div');
            section.className = 'vehicle-type-section';
            section.innerHTML = `
                <h6 style="margin: 10px 0; color: #a0a0a0; font-size: 0.9em;">${type} - ${vehicles.length} verfügbar</h6>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; margin-bottom: 15px;">
                    ${vehicles.map(v => `
                        <div class="vehicle-card-large" data-id="${v.id}" onclick="ManualIncident.toggleVehicleInline('${v.id}')">
                            <div class="vehicle-card-icon">🚑</div>
                            <div class="vehicle-card-name" style="font-size: 0.85em;">${v.callsign || v.name}</div>
                            <div class="vehicle-card-station" style="font-size: 0.75em;">${v.station || 'Wache'}</div>
                            <div class="vehicle-card-type" style="font-size: 0.75em;">${v.type}</div>
                            ${v.distanceText ? `<div class="vehicle-card-distance" style="font-size: 0.75em; color: #4CAF50; margin-top: 3px;">📍 ${v.distanceText}</div>` : ''}
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

    // Toggle für Inline
    toggleVehicleInline(id) {
        const card = document.querySelector(`#inline-vehicle-grid .vehicle-card-large[data-id="${id}"]`);
        if (!card) return;

        if (this.selectedVehicles.includes(id)) {
            this.selectedVehicles = this.selectedVehicles.filter(v => v !== id);
            card.classList.remove('selected');
        } else {
            this.selectedVehicles.push(id);
            card.classList.add('selected');
        }

        this.updateUIInline();
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

    // Update UI für Inline
    updateUIInline() {
        const countSpan = document.getElementById('inline-selected-count');
        const alarmBtn = document.getElementById('inline-alarm-btn');

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
        let koordinaten = this.modalCoordinates;

        if (!koordinaten && coordsInput) {
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
        this.dispatchVehicles(incident);

        // Modal schließen
        this.closeModal();

        // Zur Karte wechseln
        if (typeof switchTab === 'function') {
            switchTab('map');
        }

        alert(`✅ Einsatz ${incident.id} erfolgreich erstellt!`);
    },

    // Create Incident Inline
    async createIncidentInline() {
        const priorityInput = document.getElementById('inline-priority').value.trim();
        const detailInput = document.getElementById('inline-detail').value.trim();
        const ort = document.getElementById('inline-ort').value.trim();
        const meldebild = document.getElementById('inline-meldebild').value.trim();

        // Validierung
        if (!priorityInput && !detailInput) {
            alert('⚠️ Bitte mindestens ein Stichwort (Priorität oder Detail) eingeben!');
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

        // Koordinaten aus CallData
        const koordinaten = this.currentCallData?.einsatz?.koordinaten;

        if (!koordinaten) {
            alert('⚠️ Koordinaten fehlen!');
            return;
        }

        // Erstelle Einsatz
        const incident = {
            id: document.getElementById('inline-nummer').value,
            stichwort: stichwort,
            priorityKeyword: priorityInput,
            detailKeyword: detailInput,
            ort: ort,
            meldebild: meldebild || 'Notruf 112',
            koordinaten: koordinaten,
            vehicles: [...this.selectedVehicles],
            zeitstempel: IncidentNumbering.getCurrentTimestamp(),
            status: 'active',
            completed: false
        };

        // Zu GAME_DATA hinzufügen
        if (!GAME_DATA.incidents.find(i => i.id === incident.id)) {
            GAME_DATA.incidents.push(incident);
            console.log('✅ Einsatz aus Notruf erstellt:', incident.id);
        }

        // Fahrzeuge disponieren
        this.dispatchVehicles(incident);

        // CallSystem beenden
        if (typeof CallSystem !== 'undefined' && CallSystem.hangUp) {
            CallSystem.hangUp();
        }

        // Zur Karte wechseln
        if (typeof switchTab === 'function') {
            switchTab('map');
        }

        alert(`✅ Einsatz ${incident.id} erfolgreich erstellt und alarmiert!`);
    },

    dispatchVehicles(incident) {
        this.selectedVehicles.forEach(vId => {
            const vehicle = GAME_DATA.vehicles.find(v => v.id === vId);
            if (vehicle) {
                vehicle.status = 'dispatched';
                vehicle.incident = incident.id;
                vehicle.targetLocation = incident.koordinaten;

                // VehicleMovement starten
                if (typeof VehicleMovement !== 'undefined' && VehicleMovement.dispatchVehicle) {
                    VehicleMovement.dispatchVehicle(vId, incident.koordinaten, incident.id);
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