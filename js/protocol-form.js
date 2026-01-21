// =========================
// PROTOCOL FORM SYSTEM
// Einsatzprotokoll-Formular mit Auto-Fill
// =========================

const ProtocolForm = {
    currentCall: null,
    formData: {},
    keywordsData: null,

    /**
     * Initialisiert Protocol Form
     */
    async initialize() {
        console.log('📋 Protocol Form initialisiert');
        
        // Lade Keywords
        await this.loadKeywords();
        
        // Setup Event Listeners
        this.setupEventListeners();
    },

    /**
     * Lädt Keywords aus JSON
     */
    async loadKeywords() {
        try {
            const response = await fetch('js/keywords.json');
            this.keywordsData = await response.json();
            console.log('✅ Keywords geladen:', Object.keys(this.keywordsData).length + ' Kategorien');
        } catch (error) {
            console.error('❌ Fehler beim Laden der Keywords:', error);
        }
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

        // Keyword Dropdown Change
        const keywordSelect = document.getElementById('keyword-select');
        if (keywordSelect) {
            keywordSelect.addEventListener('change', (e) => {
                this.onKeywordChange(e.target.value);
            });
        }
    },

    /**
     * Zeigt Formular für Anruf
     */
    showForm(callData) {
        this.currentCall = callData;
        this.formData = {};

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
        }

        console.groupEnd();
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

            <div class="form-group">
                <label for="keyword-select">Stichwort *</label>
                ${this.renderKeywordDropdown()}
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
     * Rendert Keyword Dropdown (hierarchisch)
     */
    renderKeywordDropdown() {
        if (!this.keywordsData) {
            return '<select id="keyword-select" class="form-control"><option>Lade Keywords...</option></select>';
        }

        const categoryNames = {
            'abdomen': '🫃 Abdomen',
            'atmung': '💨 Atmung',
            'gynaekologie': '👶 Gynäkologie',
            'herz_kreislauf': '❤️ Herz-Kreislauf',
            'hno': '👃 HNO',
            'intoxikationen': '☠️ Intoxikationen',
            'krankentransport': '🚐 Krankentransport',
            'neurologie': '🧠 Neurologie',
            'psychiatrie': '🧘 Psychiatrie',
            'sonderlagen': '🚨 Sonderlagen',
            'sonstige': '📋 Sonstige',
            'stoffwechsel': '🔬 Stoffwechsel',
            'thermische_schaeden': '🌡️ Thermische Schäden',
            'trauma': '🩹 Trauma/Verletzungen',
            'unfaelle': '🚗 Unfälle',
            'urologie': '🏥 Urologie'
        };

        let html = '<select id="keyword-select" class="form-control" required>';
        html += '<option value="">Bitte wählen...</option>';

        Object.entries(this.keywordsData).forEach(([category, keywords]) => {
            const categoryName = categoryNames[category] || category;
            html += `<optgroup label="${categoryName}">`;
            
            keywords.forEach(kw => {
                const selected = this.formData.stichwort === kw.stichwort ? 'selected' : '';
                html += `<option value="${kw.stichwort}" ${selected}>${kw.stichwort}</option>`;
            });
            
            html += '</optgroup>';
        });

        html += '</select>';
        return html;
    },

    /**
     * Keyword wurde geändert
     */
    onKeywordChange(stichwort) {
        this.formData.stichwort = stichwort;
        console.log('🏷️ Stichwort gewählt:', stichwort);
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

        // Stichwort-Vorschlag (nur einmal)
        if (!this.formData.stichwort && callData.einsatz.stichwort_vorschlag) {
            this.formData.stichwort = callData.einsatz.stichwort_vorschlag;
            const keywordSelect = document.getElementById('keyword-select');
            if (keywordSelect) keywordSelect.value = this.formData.stichwort;
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
        this.formData.stichwort = document.getElementById('keyword-select')?.value || '';
        this.formData.ort = document.getElementById('location-input')?.value || '';
        this.formData.meldebild = document.getElementById('meldebild-input')?.value || '';
        this.formData.verletzte_gesamt = parseInt(document.getElementById('casualties-total')?.value || 0);
        this.formData.verletzte_schwer = parseInt(document.getElementById('casualties-severe')?.value || 0);
        this.formData.verletzte_leicht = parseInt(document.getElementById('casualties-light')?.value || 0);
        this.formData.besonderheiten = document.getElementById('special-notes-input')?.value || '';
        this.formData.melder_name = document.getElementById('caller-name-input')?.value || '';
        this.formData.melder_telefon = document.getElementById('caller-phone-input')?.value || '';
    },

    /**
     * Validiert Formular
     */
    validateForm() {
        const errors = [];

        if (!this.formData.stichwort) errors.push('- Stichwort fehlt');
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
