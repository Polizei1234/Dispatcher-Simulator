// =========================
// MANUAL INCIDENT CREATION v5.2
// + Klappbare Abschnitte im Einsatzprotokoll
// + Separates Fahrzeugauswahl-Modal
// + Status-Anzeige statt "Verfügbar"
// + Vollständiges Formular mit allen Feldern
// + ✅ PHASE 2 FIX: Meldebild NUR aus gestellten Fragen
// + ✅ PHASE 3.1: Gespräch bleibt offen, vollständiges Protokoll
// + ✅ v5.0: Keyword-Dropdowns für Stadtteil & Örtlichkeit (wie Stichwörter)
// + ✅ v5.1: Verstärkung anfordern Modus
// + ✅ v5.2: Custom PriorityDropdown statt native Select
// =========================

const ManualIncident = {
    selectedVehicles: [],
    modalOpen: false,
    vehicleModalOpen: false,
    inlineMode: false,
    reinforcementMode: false,
    currentIncident: null,
    selectedPriorityKeyword: null,
    selectedDetailKeyword: null,
    currentCallData: null,
    collapsedSections: {},
    answeredQuestions: {},

    initialize() {
        console.log('📝 Manual Incident System v5.2 initialisiert (Verstärkung + Custom Priority Dropdown)');
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
                    <h2><i class="fas fa-ambulance"></i> <span id="vehicle-modal-title">Fahrzeugdisposition</span></h2>
                    <button class="close-btn" onclick="ManualIncident.closeVehicleModal()">&times;</button>
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

    // ✅ NEU: Öffne Vehicle Modal für Verstärkung
    openVehicleModalForReinforcement(incident) {
        console.log('🚑 Verstärkung-Modus aktiviert für:', incident.id);
        
        this.reinforcementMode = true;
        this.currentIncident = incident;
        this.selectedVehicles = [];
        
        // Modal-Titel anpassen
        const title = document.getElementById('vehicle-modal-title');
        if (title) {
            title.innerHTML = '<i class="fas fa-plus-circle"></i> Verstärkung anfordern';
        }
        
        // Location setzen
        const locationSpan = document.getElementById('vehicle-modal-location');
        if (locationSpan) {
            locationSpan.innerHTML = `<strong>Einsatz:</strong> ${incident.stichwort} - ${incident.ort}`;
        }
        
        // Fahrzeuge laden (nur verfügbare)
        this.loadVehiclesInModal();
        
        // Modal öffnen
        this.vehicleModalOpen = true;
        const modal = document.getElementById('vehicle-selection-modal');
        if (modal) {
            modal.classList.add('active');
        }
        
        console.log('✅ Verstärkung-Modal geöffnet');
    },

    // 🚀 Inline-Modus für Notruf-Tab
    showInline(callData) {
        this.inlineMode = true;
        this.reinforcementMode = false;
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
                            <label>🏛️ Stadtteil/Ortsteil:</label>
                            <input type="text" id="inline-stadtteil" placeholder="z.B. Waiblingen, Fellbach" autocomplete="off">
                        </div>
                        <div class="form-group">
                            <label>Stockwerk/Lage:</label>
                            <input type="text" id="inline-stockwerk" placeholder="z.B. 3. OG links">
                        </div>
                        <div class="form-group">
                            <label>🏭 Besondere Örtlichkeit:</label>
                            <input type="text" id="inline-oertlichkeit" placeholder="z.B. Schule, Krankenhaus" autocomplete="off">
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

            <!-- ABSCHNITT 2: PATIENTENINFORMATIONEN -->
            <div class="protocol-section" style="margin-bottom: 15px;">
                <div class="section-header" onclick="ManualIncident.toggleSection('patient')" style="cursor: pointer; padding: 12px; background: var(--card-bg); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: var(--accent-color);"><i class="fas fa-user-injured"></i> Patienteninformationen</h4>
                    <i class="fas fa-chevron-right" id="icon-patient"></i>
                </div>
                <div class="section-content" id="section-patient" style="display: none; padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group">
                            <label>Geschlecht:</label>
                            <select id="inline-geschlecht">
                                <option value="">Unbekannt</option>
                                <option value="männlich">Männlich</option>
                                <option value="weiblich">Weiblich</option>
                                <option value="divers">Divers</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Alter (Jahre):</label>
                            <input type="number" id="inline-alter" placeholder="z.B. 45">
                        </div>
                        <div class="form-group">
                            <label>Bewusstseinszustand:</label>
                            <select id="inline-bewusstsein">
                                <option value="">Bitte wählen</option>
                                <option value="wach">Wach</option>
                                <option value="schläfrig">Schläfrig</option>
                                <option value="bewusstlos">Bewusstlos</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Atmung:</label>
                            <select id="inline-atmung">
                                <option value="">Bitte wählen</option>
                                <option value="normal">Normal</option>
                                <option value="erschwert">Erschwert</option>
                                <option value="keine">Keine Atmung</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ABSCHNITT 3: MEDIZINISCHE HISTORIE -->
            <div class="protocol-section" style="margin-bottom: 15px;">
                <div class="section-header" onclick="ManualIncident.toggleSection('medical')" style="cursor: pointer; padding: 12px; background: var(--card-bg); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: var(--accent-color);"><i class="fas fa-notes-medical"></i> Medizinische Historie</h4>
                    <i class="fas fa-chevron-right" id="icon-medical"></i>
                </div>
                <div class="section-content" id="section-medical" style="display: none; padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
                    <div class="form-group">
                        <label>Vorerkrankungen:</label>
                        <textarea id="inline-vorerkrankungen" rows="2" placeholder="z.B. Diabetes, Bluthochdruck"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Medikamente:</label>
                        <textarea id="inline-medikamente" rows="2" placeholder="z.B. Aspirin, Insulin"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Allergien:</label>
                        <input type="text" id="inline-allergien" placeholder="z.B. Penicillin, Bienenstiche">
                    </div>
                </div>
            </div>

            <!-- ABSCHNITT 4: SYMPTOME & VERLETZUNGEN -->
            <div class="protocol-section" style="margin-bottom: 15px;">
                <div class="section-header" onclick="ManualIncident.toggleSection('symptoms')" style="cursor: pointer; padding: 12px; background: var(--card-bg); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: var(--accent-color);"><i class="fas fa-heartbeat"></i> Symptome & Verletzungen</h4>
                    <i class="fas fa-chevron-right" id="icon-symptoms"></i>
                </div>
                <div class="section-content" id="section-symptoms" style="display: none; padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
                    <div class="form-group">
                        <label>Hauptbeschwerde:</label>
                        <textarea id="inline-hauptbeschwerde" rows="2" placeholder="z.B. Brustschmerzen, Atemnot"></textarea>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group">
                            <label>Schmerzstärke (0-10):</label>
                            <input type="number" id="inline-schmerzstaerke" min="0" max="10" placeholder="0-10">
                        </div>
                        <div class="form-group">
                            <label>Symptombeginn:</label>
                            <input type="text" id="inline-symptombeginn" placeholder="z.B. vor 30 Minuten">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Sichtbare Verletzungen:</label>
                        <textarea id="inline-verletzungen" rows="2" placeholder="z.B. Platzwunde am Kopf, Schürfwunden"></textarea>
                    </div>
                </div>
            </div>

            <!-- ABSCHNITT 5: UNFALL-DETAILS -->
            <div class="protocol-section" style="margin-bottom: 15px;">
                <div class="section-header" onclick="ManualIncident.toggleSection('accident')" style="cursor: pointer; padding: 12px; background: var(--card-bg); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: var(--accent-color);"><i class="fas fa-car-crash"></i> Unfall-Details</h4>
                    <i class="fas fa-chevron-right" id="icon-accident"></i>
                </div>
                <div class="section-content" id="section-accident" style="display: none; padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
                    <div class="form-group">
                        <label>Unfallhergang:</label>
                        <textarea id="inline-unfallhergang" rows="3" placeholder="Beschreibung des Unfalls"></textarea>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group">
                            <label>Anzahl Beteiligter:</label>
                            <input type="number" id="inline-beteiligte" min="1" placeholder="z.B. 2">
                        </div>
                        <div class="form-group">
                            <label>Anzahl Verletzter:</label>
                            <input type="number" id="inline-verletzte" min="0" placeholder="z.B. 1">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Eingeklemmte Person?</label>
                        <select id="inline-eingeklemmt">
                            <option value="nein">Nein</option>
                            <option value="ja">Ja</option>
                            <option value="unklar">Unklar</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- ABSCHNITT 6: GEFAHREN -->
            <div class="protocol-section" style="margin-bottom: 15px;">
                <div class="section-header" onclick="ManualIncident.toggleSection('hazards')" style="cursor: pointer; padding: 12px; background: var(--card-bg); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: var(--accent-color);"><i class="fas fa-exclamation-triangle"></i> Gefahren & Besonderheiten</h4>
                    <i class="fas fa-chevron-right" id="icon-hazards"></i>
                </div>
                <div class="section-content" id="section-hazards" style="display: none; padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group">
                            <label>Feuer:</label>
                            <select id="inline-feuer">
                                <option value="nein">Nein</option>
                                <option value="ja">Ja</option>
                                <option value="unklar">Unklar</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Gefahrstoffe:</label>
                            <select id="inline-gefahrstoffe">
                                <option value="nein">Nein</option>
                                <option value="ja">Ja</option>
                                <option value="unklar">Unklar</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Gewalt/Aggression:</label>
                            <select id="inline-gewalt">
                                <option value="nein">Nein</option>
                                <option value="ja">Ja</option>
                                <option value="unklar">Unklar</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Polizei angefordert:</label>
                            <select id="inline-polizei">
                                <option value="nein">Nein</option>
                                <option value="ja">Ja</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ABSCHNITT 7: ANRUFER-INFORMATIONEN -->
            <div class="protocol-section" style="margin-bottom: 15px;">
                <div class="section-header" onclick="ManualIncident.toggleSection('caller')" style="cursor: pointer; padding: 12px; background: var(--card-bg); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: var(--accent-color);"><i class="fas fa-phone"></i> Anrufer-Informationen</h4>
                    <i class="fas fa-chevron-right" id="icon-caller"></i>
                </div>
                <div class="section-content" id="section-caller" style="display: none; padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group">
                            <label>Name:</label>
                            <input type="text" id="inline-anrufer-name" placeholder="Name des Anrufers">
                        </div>
                        <div class="form-group">
                            <label>Telefonnummer:</label>
                            <input type="tel" id="inline-anrufer-tel" placeholder="Rückrufnummer">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Beziehung zum Patienten:</label>
                        <select id="inline-anrufer-beziehung">
                            <option value="">Bitte wählen</option>
                            <option value="selbst">Patient selbst</option>
                            <option value="angehoerig">Angehöriger</option>
                            <option value="zeuge">Zeuge</option>
                            <option value="ersthelfer">Ersthelfer</option>
                            <option value="sonstiges">Sonstiges</option>
                        </select>
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

            <!-- ABSCHNITT 9: NOTIZEN -->
            <div class="protocol-section" style="margin-bottom: 15px;">
                <div class="section-header" onclick="ManualIncident.toggleSection('notes')" style="cursor: pointer; padding: 12px; background: var(--card-bg); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: var(--accent-color);"><i class="fas fa-sticky-note"></i> Notizen</h4>
                    <i class="fas fa-chevron-right" id="icon-notes"></i>
                </div>
                <div class="section-content" id="section-notes" style="display: none; padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
                    <div class="form-group">
                        <label>Freie Notizen:</label>
                        <textarea id="inline-notizen" rows="4" placeholder="Zusätzliche Informationen..."></textarea>
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

        // ✅ Initialisiere Keyword-Dropdowns (inkl. Stadtteil & Örtlichkeit + PRIORITY)
        setTimeout(() => {
            this.initializeKeywordsDropdownsInline();
        }, 100);

        console.log('✅ Manual Incident Inline v5.2 angezeigt - Custom Priority Dropdown!');
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
        
        // Modal-Titel zurücksetzen (für normale Disposition)
        const title = document.getElementById('vehicle-modal-title');
        if (title && !this.reinforcementMode) {
            title.innerHTML = '<i class="fas fa-ambulance"></i> Fahrzeugdisposition';
        }
        
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
        this.reinforcementMode = false;
        this.currentIncident = null;
        
        const modal = document.getElementById('vehicle-selection-modal');
        if (modal) {
            modal.classList.remove('active');
        }
        console.log('🚑 Fahrzeugauswahl-Modal geschlossen');
    },

    confirmVehicleSelection() {
        if (this.reinforcementMode && this.currentIncident) {
            // ✅ Verstärkung-Modus: Fahrzeuge direkt zum Einsatz schicken
            this.dispatchReinforcement();
        } else {
            // Normal-Modus: Fahrzeuge nur auswählen
            this.updateSelectedVehiclesDisplay();
            this.updateUIInline();
        }
        
        this.closeVehicleModal();
        console.log('✅ Fahrzeugauswahl übernommen:', this.selectedVehicles);
    },

    dispatchReinforcement() {
        if (!this.currentIncident || this.selectedVehicles.length === 0) {
            console.error('❌ Kann Verstärkung nicht senden - Einsatz oder Fahrzeuge fehlen');
            return;
        }

        console.log(`🚑 Sende ${this.selectedVehicles.length} Verstärkung(en) zu Einsatz ${this.currentIncident.id}`);

        // Fahrzeuge zum Einsatz hinzufügen
        this.selectedVehicles.forEach(vId => {
            const vehicle = GAME_DATA.vehicles.find(v => v.id === vId);
            if (!vehicle) return;

            // Fahrzeug zum Einsatz assignen
            if (!this.currentIncident.vehicles.includes(vId)) {
                this.currentIncident.vehicles.push(vId);
            }
            if (!this.currentIncident.assignedVehicles) {
                this.currentIncident.assignedVehicles = [];
            }
            if (!this.currentIncident.assignedVehicles.includes(vId)) {
                this.currentIncident.assignedVehicles.push(vId);
            }

            // Fahrzeug disponieren
            vehicle.status = 'dispatched';
            vehicle.incident = this.currentIncident.id;
            vehicle.targetLocation = this.currentIncident.koordinaten;

            if (typeof VehicleMovement !== 'undefined' && VehicleMovement.dispatchVehicle) {
                VehicleMovement.dispatchVehicle(vId, this.currentIncident.koordinaten, this.currentIncident.id);
            }

            console.log(`✅ Verstärkung ${vehicle.callsign} alarmiert zu ${this.currentIncident.id}`);
        });

        // UI updaten
        if (typeof UI !== 'undefined' && UI.updateIncidentList) {
            UI.updateIncidentList();
            UI.selectIncident(this.currentIncident.id);
        }
        if (typeof updateUI === 'function') {
            updateUI();
        }

        // Bestätigung
        alert(`✅ ${this.selectedVehicles.length} Fahrzeug(e) als Verstärkung alarmiert!`);
        
        this.selectedVehicles = [];
    },

    loadVehiclesInModal() {
        const grid = document.getElementById('vehicle-modal-grid');
        if (!grid) return;

        const vehicleTypes = ['RTW', 'NEF', 'KTW', 'KDOW', 'GW-SAN'];
        grid.innerHTML = '';

        const targetCoords = this.reinforcementMode ? this.currentIncident?.koordinaten : this.currentCallData?.einsatz?.koordinaten;

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

    // ✅ INITIALISIERE ALLE KEYWORD-DROPDOWNS + PRIORITY
    initializeKeywordsDropdownsInline() {
        if (typeof KeywordsDropdown === 'undefined') {
            console.error('❌ KeywordsDropdown nicht geladen!');
            return;
        }

        if (typeof PriorityDropdown === 'undefined') {
            console.error('❌ PriorityDropdown nicht geladen!');
            return;
        }

        // 🆕 PRIORITY DROPDOWN (NEW!)
        PriorityDropdown.initialize('inline-priority', (priorityData) => {
            this.selectedPriorityKeyword = priorityData;
            console.log('✅ Priorität ausgewählt:', priorityData.keyword);
        });

        // Detail-Stichwort
        KeywordsDropdown.initializeDetailDropdown('inline-detail', (keywordData) => {
            this.selectedDetailKeyword = keywordData;
            console.log('✅ Detail-Stichwort ausgewählt:', keywordData.keyword);
        });

        // Stadtteil & Örtlichkeit
        KeywordsDropdown.initializeDistrictDropdown('inline-stadtteil', (districtData) => {
            console.log('✅ Stadtteil ausgewählt:', districtData.name, '-', districtData.category);
        });

        KeywordsDropdown.initializeLocationDropdown('inline-oertlichkeit', (locationData) => {
            console.log('✅ Örtlichkeit ausgewählt:', locationData.name, '-', locationData.category);
        });

        console.log('✅ Alle Dropdowns initialisiert (Priority + Keywords + Stadtteil + Örtlichkeit)');
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

        // ✅ PHASE 3.1: Gespräch bleibt offen
        console.log(`✅ Einsatz ${incident.id} erfolgreich erstellt und alarmiert!`);
        
        // Visual Feedback
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

console.log('✅ Manual Incident System v5.2 geladen (Verstärkung + Custom Priority Dropdown)');