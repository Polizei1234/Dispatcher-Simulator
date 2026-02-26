// =========================
// PROTOCOL FORM SYSTEM v2.0
// Einsatzprotokoll-Formular mit Keywords-Dropdown Integration
// =========================

const ProtocolForm = {
    currentCall: null,
    formData: {},
    selectedPriorityKeyword: null,
    selectedDetailKeyword: null,

    /**
     * Initialisiert Protocol Form
     */
    async initialize() {
        console.log('📋 Protocol Form initialisiert');
        
        // Setup Event Listeners
        this.setupEventListeners();
    },

    /**
     * Event Listeners
     */
    setupEventListeners() {
        // Submit Button
        const submitBtn = document.getElementById('submit-protocol-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitProtocol());
        }
    },

    /**
     * Zeigt Formular für Anruf
     */
    showForm(callData) {
        this.currentCall = callData;
        this.formData = {};
        this.selectedPriorityKeyword = null;
        this.selectedDetailKeyword = null;

        console.group('📋 SHOWING PROTOCOL FORM');
        console.log('📞 Für Anruf:', callData.anrufer.name);

        // Erzeuge Einsatznummer und Zeitstempel
        const incident = IncidentNumbering.createIncidentBase();
        this.formData.nummer = incident.nummer;
        this.formData.zeitstempel = incident.zeitstempel;

        // Zeige Form
        const form = document.getElementById('protocol-form');
        if (form) {
            form.style.display = 'block';
            this.renderForm();
            
            // Initialisiere Keywords-Dropdowns nach Render
            setTimeout(() => {
                this.initializeKeywordsDropdowns();
            }, 100);
        }

        console.groupEnd();
    },

    /**
     * Initialisiert Keywords-Dropdowns
     */
    initializeKeywordsDropdowns() {
        if (typeof KeywordsDropdown === 'undefined') {
            console.error('❌ KeywordsDropdown nicht geladen!');
            return;
        }

        // Prioritäts-Dropdown
        KeywordsDropdown.initializePriorityDropdown('protocol-priority-input', (keywordData) => {
            this.selectedPriorityKeyword = keywordData;
            this.formData.priorityKeyword = keywordData.keyword;
            console.log('✅ Priorität gewählt:', keywordData.keyword);
        });

        // Detail-Dropdown
        KeywordsDropdown.initializeDetailDropdown('protocol-detail-input', (keywordData) => {
            this.selectedDetailKeyword = keywordData;
            this.formData.detailKeyword = keywordData.keyword;
            console.log('✅ Detail-Stichwort gewählt:', keywordData.keyword);
        });
    },

    /**
     * Rendert Formular
     */
    renderForm() {
        const container = document.getElementById('protocol-form-content');
        if (!container) return;

        container.innerHTML = `
            <div class="protocol-header">
                <div class="protocol-number">Einsatznummer: <strong>${this.formData.nummer}</strong></div>
                <div class="protocol-time">🕐 Uhrzeit: <strong>${this.formData.zeitstempel}</strong></div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="protocol-priority-input">🚨 Prioritätsstufe (RD/MANV) *</label>
                    <input type="text" 
                           id="protocol-priority-input" 
                           class="form-control" 
                           placeholder="z.B. RD 2, MANV 1"
                           autocomplete="off"
                           value="${this.formData.priorityKeyword || ''}">
                    <small style="color: #888; font-size: 0.85em;">Grobes Einsatzstichwort mit Durchsuchung</small>
                </div>
                <div class="form-group">
                    <label for="protocol-detail-input">💔 Detail-Stichwort *</label>
                    <input type="text" 
                           id="protocol-detail-input" 
                           class="form-control" 
                           placeholder="z.B. VU, Herzinfarkt, Geburt"
                           autocomplete="off"
                           value="${this.formData.detailKeyword || ''}">
                    <small style="color: #888; font-size: 0.85em;">Detailliertes medizinisches Stichwort</small>
                </div>
            </div>

            <div class="form-group">
                <label for="location-input">Ort *</label>
                <input type="text" 
                       id="location-input" 
                       class="form-control" 
                       placeholder="Straße, Hausnummer, Stadt"
                       value="${this.formData.ort || ''}">
            </div>

            <div class="form-group">
                <label for="meldebild-input">Meldebild *</label>
                <textarea id="meldebild-input" 
                          class="form-control" 
                          rows="4" 
                          placeholder="Was ist passiert? Beschreibung der Lage...">${this.formData.meldebild || ''}</textarea>
            </div>

            <div class="form-row">
                <div class="form-group form-group-small">
                    <label for="casualties-total">Anzahl Verletzte *</label>
                    <input type="number" 
                           id="casualties-total" 
                           class="form-control" 
                           min="0" 
                           value="${this.formData.verletzte_gesamt || 0}">
                </div>
                <div class="form-group form-group-small">
                    <label for="casualties-severe">Schwer</label>
                    <input type="number" 
                           id="casualties-severe" 
                           class="form-control" 
                           min="0" 
                           value="${this.formData.verletzte_schwer || 0}">
                </div>
                <div class="form-group form-group-small">
                    <label for="casualties-light">Leicht</label>
                    <input type="number" 
                           id="casualties-light" 
                           class="form-control" 
                           min="0" 
                           value="${this.formData.verletzte_leicht || 0}">
                </div>
            </div>

            <div class="form-group">
                <label for="special-notes-input">Besonderheiten</label>
                <textarea id="special-notes-input" 
                          class="form-control" 
                          rows="3" 
                          placeholder="Besondere Umstände, Gefahren, zusätzliche Informationen...">${this.formData.besonderheiten || ''}</textarea>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="caller-name-input">Melder *</label>
                    <input type="text" 
                           id="caller-name-input" 
                           class="form-control" 
                           placeholder="Name des Melders"
                           value="${this.formData.melder_name || ''}">
                </div>
                <div class="form-group">
                    <label for="caller-phone-input">Telefon</label>
                    <input type="text" 
                           id="caller-phone-input" 
                           class="form-control" 
                           placeholder="Telefonnummer"
                           value="${this.formData.melder_telefon || ''}">
                </div>
            </div>

            <div class="form-actions">
                <button id="submit-protocol-btn" class="btn btn-primary btn-large">
                    🚨 Einsatz erstellen & Alarmieren
                </button>
            </div>
        `;

        // Re-attach event listeners nach render
        this.setupEventListeners();
    },

    /**
     * Update Formular aus Anruf-Antwort
     */
    updateFromCallAnswer(key, answer, callData) {
        console.group('📝 UPDATING PROTOCOL FROM ANSWER');
        console.log('🔑 Key:', key);
        console.log('💬 Antwort:', answer);

        switch(key) {
            case 'wo':
                // Ort extrahieren
                this.formData.ort = callData.einsatz.ort;
                const locationInput = document.getElementById('location-input');
                if (locationInput) locationInput.value = this.formData.ort;
                break;

            case 'was_passiert':
                // Meldebild erweitern
                if (!this.formData.meldebild) {
                    this.formData.meldebild = callData.einsatz.meldebild;
                }
                const meldebildInput = document.getElementById('meldebild-input');
                if (meldebildInput) meldebildInput.value = this.formData.meldebild;
                break;

            case 'verletzte':
                // Verletzte eintragen
                this.formData.verletzte_gesamt = callData.einsatz.verletzte.gesamt;
                this.formData.verletzte_schwer = callData.einsatz.verletzte.schwer;
                this.formData.verletzte_leicht = callData.einsatz.verletzte.leicht;
                
                const totalInput = document.getElementById('casualties-total');
                const severeInput = document.getElementById('casualties-severe');
                const lightInput = document.getElementById('casualties-light');
                
                if (totalInput) totalInput.value = this.formData.verletzte_gesamt;
                if (severeInput) severeInput.value = this.formData.verletzte_schwer;
                if (lightInput) lightInput.value = this.formData.verletzte_leicht;
                break;

            case 'zustand':
            case 'gefahren':
                // Besonderheiten ergänzen
                if (!this.formData.besonderheiten) {
                    this.formData.besonderheiten = callData.einsatz.besonderheiten || '';
                }
                const specialInput = document.getElementById('special-notes-input');
                if (specialInput) specialInput.value = this.formData.besonderheiten;
                break;
        }

        // Melder-Daten immer aktuell halten
        this.formData.melder_name = callData.anrufer.name;
        this.formData.melder_telefon = callData.anrufer.telefon;
        
        const nameInput = document.getElementById('caller-name-input');
        const phoneInput = document.getElementById('caller-phone-input');
        if (nameInput) nameInput.value = this.formData.melder_name;
        if (phoneInput) phoneInput.value = this.formData.melder_telefon;

        // Stichwort-Vorschlag (versuche zu mappen)
        if (!this.formData.priorityKeyword && callData.einsatz.stichwort_vorschlag) {
            // Versuche Stichwort auf Priority/Detail zu mappen
            const vorschlag = callData.einsatz.stichwort_vorschlag;
            
            // Einfache Heuristik: Wenn es ein bekanntes Detail-Keyword ist
            const detailInput = document.getElementById('protocol-detail-input');
            if (detailInput) {
                detailInput.value = vorschlag;
                this.formData.detailKeyword = vorschlag;
            }
        }

        console.log('✅ Protokoll aktualisiert');
        console.groupEnd();
    },

    /**
     * Protokoll absenden
     */
    submitProtocol() {
        console.group('✅ SUBMITTING PROTOCOL');

        // Sammle aktuelle Formular-Daten
        this.collectFormData();

        // Validiere
        const validation = this.validateForm();
        if (!validation.valid) {
            alert('Bitte füllen Sie alle Pflichtfelder aus:\n' + validation.errors.join('\n'));
            console.warn('⚠️ Validierung fehlgeschlagen:', validation.errors);
            console.groupEnd();
            return;
        }

        console.log('📋 Protokoll vollständig:', this.formData);

        // Erstelle Einsatz-Objekt
        const incident = this.createIncidentObject();

        console.log('🚨 Einsatz erstellt:', incident);
        console.groupEnd();

        // Öffne Fahrzeugauswahl
        if (typeof AssignmentUI !== 'undefined') {
            AssignmentUI.showVehicleSelection(incident);
        }

        // Schließe Dialog
        CallSystem.hangUp();
    },

    /**
     * Sammelt aktuelle Formular-Daten
     */
    collectFormData() {
        this.formData.priorityKeyword = document.getElementById('protocol-priority-input')?.value || '';
        this.formData.detailKeyword = document.getElementById('protocol-detail-input')?.value || '';
        this.formData.ort = document.getElementById('location-input')?.value || '';
        this.formData.meldebild = document.getElementById('meldebild-input')?.value || '';
        this.formData.verletzte_gesamt = parseInt(document.getElementById('casualties-total')?.value || 0);
        this.formData.verletzte_schwer = parseInt(document.getElementById('casualties-severe')?.value || 0);
        this.formData.verletzte_leicht = parseInt(document.getElementById('casualties-light')?.value || 0);
        this.formData.besonderheiten = document.getElementById('special-notes-input')?.value || '';
        this.formData.melder_name = document.getElementById('caller-name-input')?.value || '';
        this.formData.melder_telefon = document.getElementById('caller-phone-input')?.value || '';
        
        // Kombiniere Stichwörter
        const stichwortParts = [];
        if (this.formData.priorityKeyword) stichwortParts.push(this.formData.priorityKeyword);
        if (this.formData.detailKeyword) stichwortParts.push(this.formData.detailKeyword);
        this.formData.stichwort = stichwortParts.join(' - ');
    },

    /**
     * Validiert Formular
     */
    validateForm() {
        const errors = [];

        if (!this.formData.priorityKeyword && !this.formData.detailKeyword) {
            errors.push('- Mindestens ein Stichwort (Priorität oder Detail) benötigt');
        }
        if (!this.formData.ort) errors.push('- Ort fehlt');
        if (!this.formData.meldebild) errors.push('- Meldebild fehlt');
        if (!this.formData.melder_name) errors.push('- Melder-Name fehlt');

        return {
            valid: errors.length === 0,
            errors
        };
    },

    /**
     * Erstellt Einsatz-Objekt
     */
    createIncidentObject() {
        return {
            id: this.formData.nummer,
            nummer: this.formData.nummer,
            zeitstempel: this.formData.zeitstempel,
            stichwort: this.formData.stichwort,
            priorityKeyword: this.formData.priorityKeyword,
            detailKeyword: this.formData.detailKeyword,
            ort: this.formData.ort,
            koordinaten: this.currentCall?.einsatz?.koordinaten || { lat: 48.83, lon: 9.32 },
            meldebild: this.formData.meldebild,
            verletzte: {
                gesamt: this.formData.verletzte_gesamt,
                schwer: this.formData.verletzte_schwer,
                leicht: this.formData.verletzte_leicht
            },
            besonderheiten: this.formData.besonderheiten,
            melder: {
                name: this.formData.melder_name,
                telefon: this.formData.melder_telefon
            },
            fahrzeuge_vorschlag: this.currentCall?.fahrzeuge || { pflicht: [], optional: [] },
            status: 'neu',
            erstelltAm: new Date().toISOString()
        };
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        ProtocolForm.initialize();
    });
}