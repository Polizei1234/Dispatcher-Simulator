// =========================
// KEYWORDS DROPDOWN SYSTEM v2.0
// Autocomplete Dropdowns für Einsatzstichwörter, Stadtteile & Örtlichkeiten
// =========================

const KeywordsDropdown = {
    priorityKeywords: [],
    detailKeywords: [],
    districts: [],
    locations: [],
    
    async initialize() {
        console.log('📝 Keywords Dropdown System wird initialisiert...');
        await this.loadKeywords();
        console.log('✅ Keywords geladen:', {
            priority: this.priorityKeywords.length,
            detail: this.detailKeywords.length,
            districts: this.districts.length,
            locations: this.locations.length
        });
    },

    async loadKeywords() {
        try {
            // Lade Prioritäts-Keywords
            const priorityResponse = await fetch('js/data/priority-keywords.json');
            if (priorityResponse.ok) {
                this.priorityKeywords = await priorityResponse.json();
            }

            // Lade Detail-Keywords
            const detailResponse = await fetch('js/data/detail-keywords.json');
            if (detailResponse.ok) {
                this.detailKeywords = await detailResponse.json();
            }

            // 🆕 Lade Stadtteile
            const districtsResponse = await fetch('js/data/districts.json');
            if (districtsResponse.ok) {
                this.districts = await districtsResponse.json();
            }

            // 🆕 Lade Örtlichkeiten
            const locationsResponse = await fetch('js/data/locations.json');
            if (locationsResponse.ok) {
                this.locations = await locationsResponse.json();
            }
        } catch (error) {
            console.error('❌ Fehler beim Laden der Keywords:', error);
        }
    },

    createDropdown(inputId, keywords, placeholder, onSelect, keyField = 'keyword') {
        const input = document.getElementById(inputId);
        if (!input) {
            console.error(`❌ Input ${inputId} nicht gefunden`);
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'keyword-dropdown-wrapper';
        wrapper.style.position = 'relative';

        // Input ersetzen
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        // Dropdown-Liste erstellen
        const dropdown = document.createElement('div');
        dropdown.className = 'keyword-dropdown-list';
        dropdown.style.display = 'none';
        wrapper.appendChild(dropdown);

        // Input Events
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            // Filtern
            const filtered = keywords.filter(k => {
                const keyValue = k[keyField].toLowerCase();
                const category = k.category ? k.category.toLowerCase() : '';
                const description = k.description ? k.description.toLowerCase() : '';
                
                return keyValue.includes(searchTerm) || 
                       category.includes(searchTerm) || 
                       description.includes(searchTerm);
            });

            if (filtered.length === 0) {
                dropdown.innerHTML = '<div class="dropdown-item no-results">Keine Ergebnisse gefunden</div>';
                dropdown.style.display = 'block';
                return;
            }

            // Ergebnisse anzeigen
            dropdown.innerHTML = filtered.slice(0, 10).map(k => {
                const icon = k.icon ? k.icon + ' ' : '';
                return `
                    <div class="dropdown-item" data-value="${k[keyField]}">
                        <div class="dropdown-item-title">${icon}${k[keyField]}</div>
                        <div class="dropdown-item-category">${k.category || ''}</div>
                        <div class="dropdown-item-description">${k.description || k.population || ''}</div>
                    </div>
                `;
            }).join('');

            dropdown.style.display = 'block';

            // Click Events für Items
            dropdown.querySelectorAll('.dropdown-item:not(.no-results)').forEach(item => {
                item.addEventListener('click', () => {
                    const value = item.getAttribute('data-value');
                    const itemData = keywords.find(k => k[keyField] === value);
                    
                    input.value = value;
                    dropdown.style.display = 'none';
                    
                    if (onSelect) {
                        onSelect(itemData);
                    }
                });
            });
        });

        // Focus Event
        input.addEventListener('focus', (e) => {
            if (e.target.value.trim().length > 0) {
                const event = new Event('input', { bubbles: true });
                input.dispatchEvent(event);
            }
        });

        // Schließen bei Klick außerhalb
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        // ESC zum Schließen
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdown.style.display = 'none';
            }
        });
    },

    initializePriorityDropdown(inputId, onSelect) {
        this.createDropdown(
            inputId,
            this.priorityKeywords,
            'z.B. RD 2, MANV 1',
            onSelect,
            'keyword'
        );
    },

    initializeDetailDropdown(inputId, onSelect) {
        this.createDropdown(
            inputId,
            this.detailKeywords,
            'z.B. VU, Herzinfarkt, Geburt',
            onSelect,
            'keyword'
        );
    },

    // 🆕 NEU: Stadtteil-Dropdown
    initializeDistrictDropdown(inputId, onSelect) {
        this.createDropdown(
            inputId,
            this.districts,
            'z.B. Waiblingen, Fellbach',
            onSelect,
            'name'
        );
    },

    // 🆕 NEU: Örtlichkeits-Dropdown
    initializeLocationDropdown(inputId, onSelect) {
        this.createDropdown(
            inputId,
            this.locations,
            'z.B. Schule, Krankenhaus',
            onSelect,
            'name'
        );
    },

    // Helper: Hole Keyword-Daten
    getPriorityKeyword(keyword) {
        return this.priorityKeywords.find(k => k.keyword === keyword);
    },

    getDetailKeyword(keyword) {
        return this.detailKeywords.find(k => k.keyword === keyword);
    },

    getDistrict(name) {
        return this.districts.find(d => d.name === name);
    },

    getLocation(name) {
        return this.locations.find(l => l.name === name);
    },

    // Helper: Vorgeschlagene Fahrzeuge basierend auf Priorität
    getSuggestedVehicles(priorityKeyword) {
        const keyword = this.getPriorityKeyword(priorityKeyword);
        return keyword ? keyword.suggestedVehicles || [] : [];
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', async () => {
        await KeywordsDropdown.initialize();
    });

    window.KeywordsDropdown = KeywordsDropdown;
}