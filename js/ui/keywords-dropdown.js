// =========================
// KEYWORDS DROPDOWN SYSTEM v3.0
// Wrapper für UniversalDropdown - Detail-Stichwörter, Stadtteile & Örtlichkeiten
// ✅ JETZT: Nutzt UniversalDropdown für konsistentes Design
// ✅ FIX: Checkmarks entfernt
// =========================

const KeywordsDropdown = {
    detailKeywords: [],
    districts: [],
    locations: [],
    
    async initialize() {
        console.log('📝 Keywords Dropdown System v3.0 wird initialisiert (UniversalDropdown-Wrapper)...');
        await this.loadKeywords();
        console.log('✅ Keywords geladen:', {
            detail: this.detailKeywords.length,
            districts: this.districts.length,
            locations: this.locations.length
        });
    },

    async loadKeywords() {
        try {
            // Lade Detail-Keywords
            const detailResponse = await fetch('js/data/detail-keywords.json');
            if (detailResponse.ok) {
                this.detailKeywords = await detailResponse.json();
            }

            // Lade Stadtteile
            const districtsResponse = await fetch('js/data/districts.json');
            if (districtsResponse.ok) {
                this.districts = await districtsResponse.json();
            }

            // Lade Örtlichkeiten
            const locationsResponse = await fetch('js/data/locations.json');
            if (locationsResponse.ok) {
                this.locations = await locationsResponse.json();
            }
        } catch (error) {
            console.error('❌ Fehler beim Laden der Keywords:', error);
        }
    },

    // ✅ Detail-Stichwort Dropdown (wie Priority)
    initializeDetailDropdown(inputId, onSelect) {
        if (typeof UniversalDropdown === 'undefined') {
            console.error('❌ UniversalDropdown nicht geladen!');
            return;
        }

        const options = this.detailKeywords.map(k => ({
            value: k.keyword,
            label: k.keyword,
            category: k.category,
            description: k.description,
            icon: k.icon || '🚑'
        }));

        UniversalDropdown.initialize(inputId, options, onSelect, {
            placeholder: 'z.B. VU, Herzinfarkt, Geburt',
            searchPlaceholder: 'Detail-Stichwort suchen...',
            noResultsText: 'Kein Stichwort gefunden',
            maxHeight: '400px'
        });

        console.log(`✅ Detail-Dropdown initialisiert für #${inputId} (${options.length} Optionen)`);
    },

    // 🏛️ Stadtteil Dropdown (wie Priority)
    initializeDistrictDropdown(inputId, onSelect) {
        if (typeof UniversalDropdown === 'undefined') {
            console.error('❌ UniversalDropdown nicht geladen!');
            return;
        }

        const options = this.districts.map(d => ({
            value: d.name,
            label: d.name,
            category: d.category,
            description: d.population ? `Einwohner: ${d.population}` : '',
            icon: '🏘️'
        }));

        UniversalDropdown.initialize(inputId, options, onSelect, {
            placeholder: 'z.B. Waiblingen, Fellbach',
            searchPlaceholder: 'Stadtteil suchen...',
            noResultsText: 'Kein Stadtteil gefunden',
            maxHeight: '400px'
        });

        console.log(`✅ Stadtteil-Dropdown initialisiert für #${inputId} (${options.length} Optionen)`);
    },

    // 🏭 Besondere Örtlichkeit Dropdown (wie Priority)
    initializeLocationDropdown(inputId, onSelect) {
        if (typeof UniversalDropdown === 'undefined') {
            console.error('❌ UniversalDropdown nicht geladen!');
            return;
        }

        const options = this.locations.map(l => ({
            value: l.name,
            label: l.name,
            category: l.category,
            description: l.description || '',
            icon: l.icon || '🏢'
        }));

        UniversalDropdown.initialize(inputId, options, onSelect, {
            placeholder: 'z.B. Schule, Krankenhaus',
            searchPlaceholder: 'Örtlichkeit suchen...',
            noResultsText: 'Keine Örtlichkeit gefunden',
            maxHeight: '400px'
        });

        console.log(`✅ Örtlichkeit-Dropdown initialisiert für #${inputId} (${options.length} Optionen)`);
    },

    // Helper: Hole Keyword-Daten
    getDetailKeyword(keyword) {
        return this.detailKeywords.find(k => k.keyword === keyword);
    },

    getDistrict(name) {
        return this.districts.find(d => d.name === name);
    },

    getLocation(name) {
        return this.locations.find(l => l.name === name);
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', async () => {
        await KeywordsDropdown.initialize();
    });

    window.KeywordsDropdown = KeywordsDropdown;
}

console.log('✅ Keywords Dropdown System v3.0 geladen (UniversalDropdown-Wrapper - Checkmarks entfernt)');