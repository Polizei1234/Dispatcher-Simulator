// =========================
// UNIVERSAL DROPDOWN v1.2
// Schönes Custom Dropdown für:
// - Detail-Stichwort
// - Stadtteil
// - Besondere Örtlichkeit
// ✅ FIX: Callback gibt jetzt VALUE zurück, nicht ganzes Objekt!
// ✅ v1.2: Verhindert doppelte Event Listener beim Neuinitialisieren
// =========================

const UniversalDropdown = {
    activeDropdowns: new Map(),

    /**
     * Initialisiert ein Custom Dropdown
     * @param {string} inputId - ID des Input-Elements
     * @param {Array} items - Array von Items {keyword, label, description, category, icon, color}
     * @param {Function} onSelect - Callback bei Auswahl (bekommt nur VALUE als String!)
     * @param {Object} options - Zusätzliche Optionen
     */
    initialize(inputId, items, onSelect, options = {}) {
        const input = document.getElementById(inputId);
        if (!input) {
            console.error(`❌ Universal Dropdown: Input nicht gefunden: ${inputId}`);
            return;
        }

        // ✅ FIX: Cleanup wenn bereits initialisiert
        if (this.activeDropdowns.has(inputId)) {
            console.log(`♻️ Dropdown ${inputId} bereits initialisiert, cleanup...`);
            this.cleanup(inputId);
        }

        const config = {
            placeholder: options.placeholder || 'Eingabe...',
            searchFields: options.searchFields || ['keyword', 'label', 'description', 'category'],
            noResultsText: options.noResultsText || 'Keine Ergebnisse gefunden',
            icon: options.icon || 'search',
            keyField: options.keyField || 'keyword'
        };

        // ✅ FIX: Wrapper nur erstellen wenn nicht vorhanden
        let wrapper = input.parentElement;
        if (!wrapper || !wrapper.dataset.dropdownId) {
            wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.width = '100%';
            wrapper.dataset.dropdownId = inputId;
            
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
        }

        // ✅ FIX: Event Listener Funktionen speichern für späteres Cleanup
        const listeners = {
            focus: () => this.showDropdown(inputId),
            input: () => this.filterDropdown(inputId, input.value),
            keydown: (e) => this.handleKeyboard(inputId, e),
            documentClick: (e) => {
                if (!wrapper.contains(e.target)) {
                    this.hideDropdown(inputId);
                }
            }
        };

        this.activeDropdowns.set(inputId, {
            input,
            wrapper,
            items,
            onSelect,
            config,
            dropdownElement: null,
            listeners // ✅ Speichere Listener für Cleanup
        });

        this.attachEventListeners(inputId);

        console.log(`✅ Universal Dropdown initialisiert: ${inputId}`);
    },

    attachEventListeners(dropdownId) {
        const dropdown = this.activeDropdowns.get(dropdownId);
        if (!dropdown) return;

        const { input, listeners } = dropdown;

        // ✅ Attach Event Listeners
        input.addEventListener('focus', listeners.focus);
        input.addEventListener('input', listeners.input);
        input.addEventListener('keydown', listeners.keydown);
        document.addEventListener('click', listeners.documentClick);
    },

    // ✅ NEU: Cleanup Funktion
    cleanup(dropdownId) {
        const dropdown = this.activeDropdowns.get(dropdownId);
        if (!dropdown) return;

        const { input, listeners, dropdownElement } = dropdown;

        // Entferne Event Listeners
        if (listeners) {
            input.removeEventListener('focus', listeners.focus);
            input.removeEventListener('input', listeners.input);
            input.removeEventListener('keydown', listeners.keydown);
            document.removeEventListener('click', listeners.documentClick);
        }

        // Entferne Dropdown Element
        if (dropdownElement && dropdownElement.parentNode) {
            dropdownElement.remove();
        }

        console.log(`🗑️ Dropdown ${dropdownId} bereinigt`);
    },

    showDropdown(dropdownId) {
        const dropdown = this.activeDropdowns.get(dropdownId);
        if (!dropdown) return;

        this.hideDropdown(dropdownId);

        const { items, wrapper, config } = dropdown;

        const dropdownElement = document.createElement('div');
        dropdownElement.className = 'universal-dropdown';
        dropdownElement.id = `universal-dropdown-${dropdownId}`;

        items.forEach((item, index) => {
            const itemElement = this.createItemElement(item, index, config);
            
            itemElement.addEventListener('click', (e) => {
                e.stopPropagation(); // ✅ Verhindert dass document click das Dropdown schließt
                this.selectItem(dropdownId, item);
            });

            itemElement.addEventListener('mouseenter', () => {
                this.highlightItem(dropdownId, itemElement);
            });

            dropdownElement.appendChild(itemElement);
        });

        wrapper.appendChild(dropdownElement);
        dropdown.dropdownElement = dropdownElement;

        setTimeout(() => {
            dropdownElement.style.opacity = '1';
            dropdownElement.style.transform = 'translateY(0)';
        }, 10);
    },

    createItemElement(item, index, config) {
        const itemElement = document.createElement('div');
        itemElement.className = 'universal-dropdown-item';
        itemElement.dataset.index = index;
        itemElement.dataset.keyword = item[config.keyField] || item.keyword;

        const icon = item.icon || config.icon;
        const color = item.color || '#2196f3';
        const label = item.label || item[config.keyField] || item.keyword;
        const category = item.category || '';
        const description = item.description || '';

        itemElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas fa-${icon}" style="color: ${color}; font-size: 1.1em; width: 25px; text-align: center;"></i>
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                        <span style="font-weight: 600; color: var(--text); font-size: 0.95em;">${label}</span>
                        ${category ? `<span style="font-size: 0.75em; color: var(--text-muted); background: var(--bg-card); padding: 2px 6px; border-radius: 4px;">${category}</span>` : ''}
                    </div>
                    ${description ? `<div style="font-size: 0.8em; color: var(--text-muted); line-height: 1.3;">${description}</div>` : ''}
                </div>
            </div>
        `;

        return itemElement;
    },

    filterDropdown(dropdownId, query) {
        const dropdown = this.activeDropdowns.get(dropdownId);
        if (!dropdown || !dropdown.dropdownElement) return;

        const { dropdownElement, config } = dropdown;
        const items = dropdownElement.querySelectorAll('.universal-dropdown-item');
        const lowerQuery = query.toLowerCase().trim();

        let visibleCount = 0;

        items.forEach(item => {
            const itemData = dropdown.items[parseInt(item.dataset.index)];
            
            let matches = false;
            if (!query) {
                matches = true;
            } else {
                for (const field of config.searchFields) {
                    if (itemData[field] && itemData[field].toString().toLowerCase().includes(lowerQuery)) {
                        matches = true;
                        break;
                    }
                }
            }

            if (matches) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        let noResults = dropdownElement.querySelector('.universal-no-results');
        
        if (visibleCount === 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'universal-no-results';
                noResults.innerHTML = `
                    <i class="fas fa-search" style="font-size: 2em; opacity: 0.5; margin-bottom: 10px;"></i>
                    <div>${config.noResultsText}</div>
                    <div style="font-size: 0.85em; color: var(--text-muted); margin-top: 5px;">Versuche andere Suchbegriffe</div>
                `;
                dropdownElement.appendChild(noResults);
            }
            noResults.style.display = 'flex';
        } else if (noResults) {
            noResults.style.display = 'none';
        }
    },

    selectItem(dropdownId, item) {
        const dropdown = this.activeDropdowns.get(dropdownId);
        if (!dropdown) return;

        const { input, onSelect, config } = dropdown;
        
        // ✅ FIX: Extrahiere den VALUE als String
        const value = item[config.keyField] || item.keyword || item.value;

        input.value = value;

        // ✅ FIX: Callback bekommt jetzt nur den VALUE-String!
        if (onSelect) {
            onSelect(value);
        }

        // Visual Feedback
        if (item.color) {
            input.style.borderColor = item.color;
            setTimeout(() => {
                input.style.borderColor = '';
            }, 800);
        }

        this.hideDropdown(dropdownId);
        console.log(`✅ Item ausgewählt: ${value}`);
    },

    highlightItem(dropdownId, itemElement) {
        const dropdown = this.activeDropdowns.get(dropdownId);
        if (!dropdown || !dropdown.dropdownElement) return;

        const items = dropdown.dropdownElement.querySelectorAll('.universal-dropdown-item');
        items.forEach(i => i.classList.remove('active'));
        itemElement.classList.add('active');
    },

    handleKeyboard(dropdownId, e) {
        const dropdown = this.activeDropdowns.get(dropdownId);
        if (!dropdown || !dropdown.dropdownElement) return;

        const { dropdownElement, input } = dropdown;
        const items = Array.from(dropdownElement.querySelectorAll('.universal-dropdown-item')).filter(i => i.style.display !== 'none');
        if (items.length === 0) return;

        const currentActive = dropdownElement.querySelector('.universal-dropdown-item.active');
        let currentIndex = currentActive ? items.indexOf(currentActive) : -1;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = (currentIndex + 1) % items.length;
                this.highlightItem(dropdownId, items[currentIndex]);
                items[currentIndex].scrollIntoView({ block: 'nearest' });
                break;

            case 'ArrowUp':
                e.preventDefault();
                currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                this.highlightItem(dropdownId, items[currentIndex]);
                items[currentIndex].scrollIntoView({ block: 'nearest' });
                break;

            case 'Enter':
                e.preventDefault();
                if (currentActive) {
                    const index = parseInt(currentActive.dataset.index);
                    this.selectItem(dropdownId, dropdown.items[index]);
                } else if (items.length === 1) {
                    const index = parseInt(items[0].dataset.index);
                    this.selectItem(dropdownId, dropdown.items[index]);
                }
                break;

            case 'Escape':
                e.preventDefault();
                this.hideDropdown(dropdownId);
                input.blur();
                break;
        }
    },

    hideDropdown(dropdownId) {
        const dropdown = this.activeDropdowns.get(dropdownId);
        if (!dropdown || !dropdown.dropdownElement) return;

        const { dropdownElement } = dropdown;
        
        dropdownElement.style.opacity = '0';
        dropdownElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            if (dropdownElement && dropdownElement.parentNode) {
                dropdownElement.remove();
            }
            dropdown.dropdownElement = null;
        }, 200);
    },

    updateItems(dropdownId, newItems) {
        const dropdown = this.activeDropdowns.get(dropdownId);
        if (!dropdown) return;

        dropdown.items = newItems;
        
        if (dropdown.dropdownElement) {
            this.hideDropdown(dropdownId);
            this.showDropdown(dropdownId);
        }

        console.log(`✅ Dropdown-Items aktualisiert: ${dropdownId}`);
    },

    // ✅ NEU: Destroy Funktion für komplette Entfernung
    destroy(dropdownId) {
        this.cleanup(dropdownId);
        this.activeDropdowns.delete(dropdownId);
        console.log(`🗑️ Dropdown ${dropdownId} komplett entfernt`);
    }
};

if (typeof window !== 'undefined') {
    window.UniversalDropdown = UniversalDropdown;
}

console.log('✅ Universal Dropdown System v1.2 geladen (FIX: Verhindert doppelte Event Listener)');