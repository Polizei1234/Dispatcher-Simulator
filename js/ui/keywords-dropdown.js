// =========================
// KEYWORDS DROPDOWN SYSTEM v1.0
// Autocomplete Dropdowns für Einsatzstichwörter
// =========================

const KeywordsDropdown = {
    priorityKeywords: [],
    detailKeywords: [],
    
    async initialize() {
        console.log('📝 Keywords Dropdown System wird initialisiert...');
        await this.loadKeywords();
        console.log('✅ Keywords geladen:', {
            priority: this.priorityKeywords.length,
            detail: this.detailKeywords.length
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
        } catch (error) {
            console.error('❌ Fehler beim Laden der Keywords:', error);
        }
    },

    createDropdown(inputId, keywords, placeholder, onSelect) {
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
                const keyword = k.keyword.toLowerCase();
                const category = k.category ? k.category.toLowerCase() : '';
                const description = k.description ? k.description.toLowerCase() : '';
                
                return keyword.includes(searchTerm) || 
                       category.includes(searchTerm) || 
                       description.includes(searchTerm);
            });

            if (filtered.length === 0) {
                dropdown.innerHTML = '<div class="dropdown-item no-results">Keine Ergebnisse gefunden</div>';
                dropdown.style.display = 'block';
                return;
            }

            // Ergebnisse anzeigen
            dropdown.innerHTML = filtered.slice(0, 10).map(k => `
                <div class="dropdown-item" data-keyword="${k.keyword}">
                    <div class="dropdown-item-title">${k.keyword}</div>
                    <div class="dropdown-item-category">${k.category || ''}</div>
                    <div class="dropdown-item-description">${k.description || ''}</div>
                </div>
            `).join('');

            dropdown.style.display = 'block';

            // Click Events für Items
            dropdown.querySelectorAll('.dropdown-item:not(.no-results)').forEach(item => {
                item.addEventListener('click', () => {
                    const keyword = item.getAttribute('data-keyword');
                    const keywordData = keywords.find(k => k.keyword === keyword);
                    
                    input.value = keyword;
                    dropdown.style.display = 'none';
                    
                    if (onSelect) {
                        onSelect(keywordData);
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
            onSelect
        );
    },

    initializeDetailDropdown(inputId, onSelect) {
        this.createDropdown(
            inputId,
            this.detailKeywords,
            'z.B. VU, Herzinfarkt, Geburt',
            onSelect
        );
    },

    // Helper: Hole Keyword-Daten
    getPriorityKeyword(keyword) {
        return this.priorityKeywords.find(k => k.keyword === keyword);
    },

    getDetailKeyword(keyword) {
        return this.detailKeywords.find(k => k.keyword === keyword);
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