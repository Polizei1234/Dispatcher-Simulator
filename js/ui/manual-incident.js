// =========================
// MANUAL INCIDENT CREATION v4.2
// + Klappbare Abschnitte im Einsatzprotokoll
// + Separates Fahrzeugauswahl-Modal
// + Status-Anzeige statt "Verfügbar"
// + Vollständiges Formular mit allen Feldern
// + ✅ PHASE 2 FIX: Meldebild NUR aus gestellten Fragen
// + ✅ PHASE 3.1: Gespräch bleibt offen, Alarmierungs-Meldung entfernt
// =========================

const ManualIncident = {
    selectedVehicles: [],
    modalOpen: false,
    vehicleModalOpen: false,
    inlineMode: false,
    selectedPriorityKeyword: null,
    selectedDetailKeyword: null,
    currentCallData: null,
    collapsedSections: {},
    answeredQuestions: {},

    initialize() {
        console.log('📝 Manual Incident System v4.2 initialisiert (Phase 3.1)');
        this.createVehicleModalHTML();
        this.attachEventListeners();
    },

    createVehicleModalHTML() {
        const modal = document.createElement('div');
        modal.id = 'vehicle-selection-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 1000px; height: 80vh;">
                <div class="modal-header">
                    <h2><i class="fas fa-ambulance"></i> Fahrzeugdisposition</h2>
                    <button class="close-btn" onclick="ManualIncident.closeVehicleModal()">×</button>
                </div>
                <div class="modal-body" style="display: flex; flex-direction: column; height: calc(100% - 120px);">
                    <div style="padding: 15px; background: var(--card-bg); border-radius: 8px; margin-bottom: 15px;">
                        <div style="display: flex; align-items: center; gap: 10px; color: var(--text-secondary);">
                            <i class="fas fa-map-marker-alt"></i>
                            <span id="vehicle-modal-location">Einsatzort wird geladen...</span>
                        </div>
                    </div>
                    
                    <div style="flex: 1; overflow-y: auto; padding: 10px;">
                        <div id="vehicle-modal-grid"></div>
                    </div>
                </div>
                <div class="modal-footer" style="padding: 20px; border-top: 2px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="color: var(--text-secondary);">
                            <i class="fas fa-check-circle"></i> 
                            Ausgewählt: <span id="vehicle-modal-count">0</span> Fahrzeug(e)
                        </span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-secondary" onclick="ManualIncident.closeVehicleModal()">
                            <i class="fas fa-times"></i> Abbrechen
                        </button>
                        <button class="btn btn-success" onclick="ManualIncident.confirmVehicleSelection()">
                            <i class="fas fa-check"></i> Übernehmen
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    attachEventListeners() {
        const modal = document.getElementById('vehicle-selection-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeVehicleModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.vehicleModalOpen) {
                this.closeVehicleModal();
            }
        });
    },

    // 🚀 Inline-Modus für Notruf-Tab
    showInline(callData) {
        this.inlineMode = true;
        this.currentCallData = callData;
        this.selectedVehicles = [];
        this.selectedPriorityKeyword = null;
        this.selectedDetailKeyword = null;
        this.answeredQuestions = {};
        this.collapsedSections = {
            basis: false,
            patient: true,
            medical: true,
            symptoms: true,
            accident: true,
            hazards: true,
            caller: true,
            notes: true
        };

        const container = document.getElementById('manual-incident-inline-container');
        if (!container) {
            console.error('❌ manual-incident-inline-container nicht gefunden!');
            return;
        }

        const nummer = IncidentNumbering.generateNumber();

        container.innerHTML = `
            <h3 style="margin-bottom: 20px;"><i class="fas fa-file-medical"></i> Einsatzprotokoll</h3>
            
            <!-- ABSCHNITT 1: EINSATZINFORMATIONEN (BASIS) -->
            <div class="protocol-section" style="margin-bottom: 15px;">
                <div class="section-header" onclick="ManualIncident.toggleSection('basis')" style="cursor: pointer; padding: 12px; background: var(--card-bg); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: var(--accent-color);"><i class="fas fa-info-circle"></i> Einsatzinformationen</h4>
                    <i class="fas fa-chevron-down" id="icon-basis"></i>
                </div>
                <div class="section-content" id="section-basis" style="padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group">
                            <label>Einsatznummer:</label>
                            <input type="text" id="inline-nummer" value="${nummer}" readonly>
                        </div>
                        <div class="form-group">
                            <label>🚨 Prioritätsstufe (RD/MANV):</label>
                            <input type="text" id="inline-priority" placeholder="z.B. RD 2, MANV 1" autocomplete="off">
                        </div>
                        <div class="form-group">
                            <label>💔 Detail-Stichwort:</label>
                            <input type="text" id="inline-detail" placeholder="z.B. VU, Herzinfarkt" autocomplete="off">
                        </div>
                        <div class="form-group">
                            <label>Ort/Adresse:</label>
                            <input type="text" id="inline-ort" value="${callData?.einsatz?.ort || ''}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Stadtteil/Ortsteil:</label>
                            <select id="inline-stadtteil">
                                <option value="">Bitte wählen</option>
                                <option value="Waiblingen">Waiblingen</option>
                                <option value="Fellbach">Fellbach</option>
                                <option value="Schorndorf">Schorndorf</option>
                                <option value="Winnenden">Winnenden</option>
                                <option value="Backnang">Backnang</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Stockwerk/Lage:</label>
                            <input type="text" id="inline-stockwerk" placeholder="z.B. 3. OG links">
                        </div>
                        <div class="form-group">
                            <label>Besondere Örtlichkeit:</label>
                            <select id="inline-oertlichkeit">
                                <option value="">Keine Angabe</option>
                                <option value="Kindergarten">Kindergarten</option>
                                <option value="Schule">Schule</option>
                                <option value="Pflegeheim">Pflegeheim</option>
                                <option value="Krankenhaus">Krankenhaus</option>
                                <option value="Industrieanlage">Industrieanlage</option>
                                <option value="Öffentliches Gebäude">Öffentliches Gebäude</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Zufahrt/Erreichbarkeit:</label>
                            <input type="text" id="inline-zufahrt" placeholder="z.B. Hinterhof, Aufzug vorhanden">
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 10px;">
                        <label>Meldebild:</label>
                        <textarea id="inline-meldebild" rows="3" placeholder="Wird aus Anrufer-Antworten generiert..."></textarea>
                        <small style="color: var(--text-secondary); font-size: 0.85em; display: block; margin-top: 5px;">
                            ℹ️ Enthält nur die Informationen, die der Anrufer tatsächlich gegeben hat
                        </small>
                    </div>
                </div>
            </div>

            <!-- ABSCHNITT 8: EINSATZMITTEL -->
            <div class="protocol-section" style="margin-bottom: 15px;">
                <div class="section-header" style="padding: 12px; background: var(--card-bg); border-radius: 8px; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: var(--accent-color);"><i class="fas fa-ambulance"></i> Einsatzmittel</h4>
                </div>
                <div class="section-content" style="padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
                    <button class="btn btn-primary" onclick="ManualIncident.openVehicleModal()" style="width: 100%; margin-bottom: 12px;">
                        <i class="fas fa-plus-circle"></i> Fahrzeuge disponieren
                    </button>
                    <div id="inline-selected-vehicles" style="padding: 10px; background: var(--card-bg); border-radius: 8px; min-height: 40px;">
                        <div style="color: var(--text-secondary); font-size: 0.9em;">
                            <i class="fas fa-info-circle"></i> Noch keine Fahrzeuge ausgewählt
                        </div>
                    </div>
                </div>
            </div>

            <!-- FOOTER MIT ALARMIEREN BUTTON -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: var(--card-bg); border-radius: 8px; margin-top: 20px;">
                <div style="color: var(--text-secondary);">
                    <i class="fas fa-check-circle"></i> 
                    <span id="inline-selected-count">0</span> Fahrzeug(e) disponiert
                </div>
                <button class="btn btn-success btn-large" id="inline-alarm-btn" onclick="ManualIncident.createIncidentInline()" disabled>
                    <i class="fas fa-bell"></i> ALARMIEREN
                </button>
            </div>
        `;

        // Initialisiere Keywords-Dropdowns
        setTimeout(() => {
            this.initializeKeywordsDropdownsInline();
        }, 100);

        console.log('✅ Manual Incident Inline v4.2 angezeigt');
    },

    toggleSection(sectionName) {
        const content = document.getElementById(`section-${sectionName}`);
        const icon = document.getElementById(`icon-${sectionName}`);
        
        if (!content || !icon) return;

        const isCollapsed = content.style.display === 'none';
        
        if (isCollapsed) {
            content.style.display = 'block';
            icon.className = 'fas fa-chevron-down';
            this.collapsedSections[sectionName] = false;
        } else {
            content.style.display = 'none';
            icon.className = 'fas fa-chevron-right';
            this.collapsedSections[sectionName] = true;
        }
    },

    openVehicleModal() {
        this.vehicleModalOpen = true;
        
        // Location setzen
        const locationSpan = document.getElementById('vehicle-modal-location');
        if (locationSpan && this.currentCallData?.einsatz?.ort) {
            locationSpan.innerHTML = `<strong>Einsatzort:</strong> ${this.currentCallData.einsatz.ort}`;
        }

        // Fahrzeuge laden
        this.loadVehiclesInModal();

        // Modal anzeigen
        const modal = document.getElementById('vehicle-selection-modal');
        if (modal) {
            modal.classList.add('active');
        }

        console.log('🚑 Fahrzeugauswahl-Modal geöffnet');
    },

    closeVehicleModal() {
        this.vehicleModalOpen = false;
        const modal = document.getElementById('vehicle-selection-modal');
        if (modal) {
            modal.classList.remove('active');
        }
        console.log('🚑 Fahrzeugauswahl-Modal geschlossen');
    },

    confirmVehicleSelection() {
        this.closeVehicleModal();
        this.updateSelectedVehiclesDisplay();
        this.updateUIInline();
        console.log('✅ Fahrzeugauswahl übernommen:', this.selectedVehicles);
    },

    loadVehiclesInModal() {
        const grid = document.getElementById('vehicle-modal-grid');
        if (!grid) return;

        const vehicleTypes = ['RTW', 'NEF', 'KTW', 'KDOW', 'GW-SAN'];
        grid.innerHTML = '';

        const targetCoords = this.currentCallData?.einsatz?.koordinaten;

        vehicleTypes.forEach(type => {
            let vehicles = GAME_DATA.vehicles.filter(v => {
                const vType = v.type.toUpperCase();
                return (vType === type || vType.includes(type)) && v.owned;
            });

            if (vehicles.length === 0) return;

            // 🚀 SORTIERE nach Entfernung
            if (typeof VehicleMovement !== 'undefined' && VehicleMovement.getDistanceToIncident && targetCoords) {
                vehicles = vehicles.map(v => {
                    const distInfo = VehicleMovement.getDistanceToIncident(v.station, targetCoords);
                    return {
                        ...v,
                        distance: distInfo ? parseFloat(distInfo.km) : 999,
                        distanceKm: distInfo ? distInfo.km : '?',
                        distanceTime: distInfo ? distInfo.minutes : '?'
                    };
                }).sort((a, b) => a.distance - b.distance);
            }

            // Status-Map für Anzeige
            const statusMap = {
                'available': { text: 'Verfügbar', color: '#4CAF50', icon: 'check-circle' },
                'dispatched': { text: 'Alarmiert', color: '#FF9800', icon: 'bell' },
                'on_scene': { text: 'Vor Ort', color: '#2196F3', icon: 'map-marker-alt' },
                'returning': { text: 'Einrückend', color: '#9C27B0', icon: 'arrow-left' },
                'unavailable': { text: 'Nicht verfügbar', color: '#F44336', icon: 'times-circle' }
            };

            const availableCount = vehicles.filter(v => v.status === 'available').length;

            const section = document.createElement('div');
            section.className = 'vehicle-modal-section';
            section.style.marginBottom = '20px';
            
            section.innerHTML = `
                <div style="padding: 10px; background: var(--card-bg); border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <h5 style="margin: 0; color: var(--accent-color);">${type}</h5>
                    <span style="color: var(--text-secondary); font-size: 0.9em;">${availableCount} verfügbar / ${vehicles.length} gesamt</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px;">
                    ${vehicles.map(v => {
                        const isSelected = this.selectedVehicles.includes(v.id);
                        const statusInfo = statusMap[v.status] || statusMap['unavailable'];
                        const isDisabled = v.status !== 'available';
                        
                        return `
                            <div class="vehicle-modal-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" 
                                 data-id="${v.id}" 
                                 onclick="ManualIncident.toggleVehicleInModal('${v.id}')"
                                 style="position: relative; padding: 15px; background: var(--bg-secondary); border: 2px solid ${isSelected ? 'var(--accent-color)' : 'var(--border-color)'}; border-radius: 8px; cursor: ${isDisabled ? 'not-allowed' : 'pointer'}; opacity: ${isDisabled ? '0.6' : '1'}; transition: all 0.2s;">
                                ${isSelected ? '<div style="position: absolute; top: 8px; right: 8px; color: var(--accent-color); font-size: 1.2em;"><i class="fas fa-check-circle"></i></div>' : ''}
                                <div style="text-align: center; font-size: 2em; margin-bottom: 8px;">🚑</div>
                                <div style="font-weight: bold; text-align: center; margin-bottom: 5px;">${v.callsign || v.name}</div>
                                <div style="text-align: center; color: var(--text-secondary); font-size: 0.85em; margin-bottom: 8px;">${v.station || 'Wache'}</div>
                                <div style="text-align: center; color: var(--text-secondary); font-size: 0.85em; margin-bottom: 8px;">${v.type}</div>
                                ${v.distanceKm ? `
                                    <div style="text-align: center; color: #4CAF50; font-size: 0.85em; margin-bottom: 3px;">
                                        <i class="fas fa-route"></i> ${v.distanceKm} km
                                    </div>
                                    <div style="text-align: center; color: #4CAF50; font-size: 0.85em; margin-bottom: 8px;">
                                        <i class="fas fa-clock"></i> ca. ${v.distanceTime} Min
                                    </div>
                                ` : ''}
                                <div style="text-align: center; padding: 5px; background: ${statusInfo.color}22; border-radius: 5px; color: ${statusInfo.color}; font-size: 0.85em;">
                                    <i class="fas fa-${statusInfo.icon}"></i> ${statusInfo.text}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            
            grid.appendChild(section);
        });

        this.updateVehicleModalCount();
    },

    toggleVehicleInModal(id) {
        const vehicle = GAME_DATA.vehicles.find(v => v.id === id);
        if (!vehicle || vehicle.status !== 'available') {
            console.log('⚠️ Fahrzeug nicht verfügbar:', id);
            return;
        }

        const card = document.querySelector(`#vehicle-modal-grid .vehicle-modal-card[data-id="${id}"]`);
        if (!card) return;

        if (this.selectedVehicles.includes(id)) {
            this.selectedVehicles = this.selectedVehicles.filter(v => v !== id);
            card.classList.remove('selected');
            card.style.border = '2px solid var(--border-color)';
            const checkmark = card.querySelector('.fa-check-circle');
            if (checkmark) checkmark.parentElement.remove();
        } else {
            this.selectedVehicles.push(id);
            card.classList.add('selected');
            card.style.border = '2px solid var(--accent-color)';
            const checkmark = document.createElement('div');
            checkmark.style.cssText = 'position: absolute; top: 8px; right: 8px; color: var(--accent-color); font-size: 1.2em;';
            checkmark.innerHTML = '<i class="fas fa-check-circle"></i>';
            card.insertBefore(checkmark, card.firstChild);
        }

        this.updateVehicleModalCount();
    },

    updateVehicleModalCount() {
        const countSpan = document.getElementById('vehicle-modal-count');
        if (countSpan) {
            countSpan.textContent = this.selectedVehicles.length;
        }
    },

    updateSelectedVehiclesDisplay() {
        const container = document.getElementById('inline-selected-vehicles');
        if (!container) return;

        if (this.selectedVehicles.length === 0) {
            container.innerHTML = `
                <div style="color: var(--text-secondary); font-size: 0.9em;">
                    <i class="fas fa-info-circle"></i> Noch keine Fahrzeuge ausgewählt
                </div>
            `;
            return;
        }

        const vehiclesList = this.selectedVehicles.map(vId => {
            const vehicle = GAME_DATA.vehicles.find(v => v.id === vId);
            if (!vehicle) return '';
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: var(--bg-secondary); border-radius: 5px; margin-bottom: 5px;">
                    <span><i class="fas fa-ambulance"></i> ${vehicle.callsign || vehicle.name}</span>
                    <span style="color: var(--text-secondary); font-size: 0.85em;">${vehicle.type}</span>
                </div>
            `;
        }).join('');

        container.innerHTML = vehiclesList;
    },

    clearInline() {
        const container = document.getElementById('manual-incident-inline-container');
        if (container) {
            container.innerHTML = '';
        }
        this.inlineMode = false;
        this.currentCallData = null;
        this.selectedVehicles = [];
        this.answeredQuestions = {};
    },

    updateFromCallAnswer(key, answer, callData) {
        if (!this.inlineMode) return;

        this.answeredQuestions[key] = answer;
        console.log(`✅ Frage beantwortet: ${key} = ${answer}`);

        this.regenerateMeldebild();
    },

    regenerateMeldebild() {
        const meldebildTextarea = document.getElementById('inline-meldebild');
        if (!meldebildTextarea) return;

        const parts = [];
        const answers = this.answeredQuestions;

        if (answers.was_passiert) {
            parts.push(answers.was_passiert);
        }

        if (answers.bewusstsein) {
            parts.push(`Bewusstsein: ${answers.bewusstsein}`);
        }
        if (answers.atmung) {
            parts.push(`Atmung: ${answers.atmung}`);
        }
        if (answers.kreislauf) {
            parts.push(`Kreislauf: ${answers.kreislauf}`);
        }
        if (answers.blutung) {
            parts.push(`Blutung: ${answers.blutung}`);
        }
        if (answers.schmerzen) {
            parts.push(`Schmerzen: ${answers.schmerzen}`);
        }

        if (answers.wie_viele) {
            parts.push(`Anzahl: ${answers.wie_viele}`);
        }

        const medHistory = [];
        if (answers.vorerkrankungen) medHistory.push(`Vorerkr.: ${answers.vorerkrankungen}`);
        if (answers.diabetes) medHistory.push(`Diabetes: ${answers.diabetes}`);
        if (answers.epilepsie) medHistory.push(`Epilepsie: ${answers.epilepsie}`);
        if (answers.herzerkrankung) medHistory.push(`Herz: ${answers.herzerkrankung}`);
        if (medHistory.length > 0) {
            parts.push(medHistory.join(', '));
        }

        if (answers.sturz_hoehe) {
            parts.push(`Sturz: ${answers.sturz_hoehe}`);
        }
        if (answers.eingeklemmt) {
            parts.push(`Eingeklemmt: ${answers.eingeklemmt}`);
        }
        if (answers.airbag) {
            parts.push(`Airbag: ${answers.airbag}`);
        }

        const hazards = [];
        if (answers.feuer) hazards.push(`Feuer: ${answers.feuer}`);
        if (answers.gefahrstoffe) hazards.push(`Gefahrstoffe: ${answers.gefahrstoffe}`);
        if (answers.gewalt) hazards.push(`Gewalt: ${answers.gewalt}`);
        if (hazards.length > 0) {
            parts.push(hazards.join(', '));
        }

        if (answers.erreichbarkeit) {
            parts.push(`Zugang: ${answers.erreichbarkeit}`);
        }
        if (answers.stockwerk) {
            parts.push(`Stockwerk: ${answers.stockwerk}`);
        }

        const meldebild = parts.length > 0 ? parts.join('. ') + '.' : 'Notruf 112 - Details werden noch abgefragt';
        
        meldebildTextarea.value = meldebild;
        console.log(`✅ Meldebild aktualisiert mit ${Object.keys(answers).length} Antworten:`, meldebild);
    },

    initializeKeywordsDropdownsInline() {
        if (typeof KeywordsDropdown === 'undefined') {
            console.error('❌ KeywordsDropdown nicht geladen!');
            return;
        }

        KeywordsDropdown.initializePriorityDropdown('inline-priority', (keywordData) => {
            this.selectedPriorityKeyword = keywordData;
            console.log('✅ Priorität ausgewählt:', keywordData.keyword);
        });

        KeywordsDropdown.initializeDetailDropdown('inline-detail', (keywordData) => {
            this.selectedDetailKeyword = keywordData;
            console.log('✅ Detail-Stichwort ausgewählt:', keywordData.keyword);
        });
    },

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

    async createIncidentInline() {
        const priorityInput = document.getElementById('inline-priority').value.trim();
        const detailInput = document.getElementById('inline-detail').value.trim();
        const ort = document.getElementById('inline-ort').value.trim();
        const meldebild = document.getElementById('inline-meldebild').value.trim();

        if (!priorityInput && !detailInput) {
            alert('⚠️ Bitte mindestens ein Stichwort (Priorität oder Detail) eingeben!');
            return;
        }

        if (this.selectedVehicles.length === 0) {
            alert('⚠️ Bitte mindestens 1 Fahrzeug auswählen!');
            return;
        }

        const stichwortParts = [];
        if (priorityInput) stichwortParts.push(priorityInput);
        if (detailInput) stichwortParts.push(detailInput);
        const stichwort = stichwortParts.join(' - ');

        const koordinaten = this.currentCallData?.einsatz?.koordinaten;

        if (!koordinaten) {
            alert('⚠️ Koordinaten fehlen!');
            return;
        }

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

        if (!GAME_DATA.incidents.find(i => i.id === incident.id)) {
            GAME_DATA.incidents.push(incident);
            console.log('✅ Einsatz aus Notruf erstellt:', incident.id);
        }

        this.dispatchVehicles(incident);

        // ✅ PHASE 3.1 FIX 1: KEIN CallSystem.hangUp() mehr!
        // Gespräch bleibt offen, kann weitergeführt werden
        
        // NICHT mehr zur Map wechseln - bleib im Notruf-Tab
        // if (typeof switchTab === 'function') {
        //     switchTab('map');
        // }

        // Notification statt Alert
        console.log(`✅ Einsatz ${incident.id} erfolgreich erstellt und alarmiert!`);
        
        // Optional: Visual Feedback
        const alarmBtn = document.getElementById('inline-alarm-btn');
        if (alarmBtn) {
            const originalText = alarmBtn.innerHTML;
            alarmBtn.innerHTML = '<i class="fas fa-check"></i> ALARMIERT!';
            alarmBtn.style.background = '#28a745';
            alarmBtn.disabled = true;
            
            setTimeout(() => {
                alarmBtn.innerHTML = originalText;
                alarmBtn.style.background = '';
                alarmBtn.disabled = false;
            }, 2000);
        }
    },

    dispatchVehicles(incident) {
        this.selectedVehicles.forEach(vId => {
            const vehicle = GAME_DATA.vehicles.find(v => v.id === vId);
            if (vehicle) {
                vehicle.status = 'dispatched';
                vehicle.incident = incident.id;
                vehicle.targetLocation = incident.koordinaten;

                if (typeof VehicleMovement !== 'undefined' && VehicleMovement.dispatchVehicle) {
                    VehicleMovement.dispatchVehicle(vId, incident.koordinaten, incident.id);
                }
            }
        });

        // ✅ PHASE 3.1 FIX 2: KEINE Alarmierungs-Meldung mehr im Funk!
        // Alarmierung ist intern, kein Funkspruch nötig
        
        if (typeof updateUI === 'function') {
            updateUI();
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

console.log('✅ Manual Incident System v4.2 geladen (Phase 3.1 - Gespräch bleibt offen)');