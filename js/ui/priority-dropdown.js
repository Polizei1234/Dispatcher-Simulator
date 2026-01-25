// =========================
// PRIORITY DROPDOWN v1.0
// Custom styled dropdown for Prioritätsstufe (RD/MANV)
// Beautiful design like Keywords Dropdown
// =========================

const PriorityDropdown = {
    priorityLevels: [
        { 
            id: 'rd0', 
            keyword: 'RD 0', 
            label: 'RD 0 - Rettungsdienst',
            description: 'Krankentransport ohne Sonderrechte - geplanter Transport ohne zeitkritische Notfallsituation',
            color: '#388e3c',
            icon: 'ambulance'
        },
        { 
            id: 'rd1', 
            keyword: 'RD 1', 
            label: 'RD 1 - Rettungsdienst',
            description: 'Rettungsdiensteinsatz mit Sonderrechten - verletzte oder erkrankte Person ohne Notarztindikation',
            color: '#1976d2',
            icon: 'ambulance'
        },
        { 
            id: 'rd2', 
            keyword: 'RD 2', 
            label: 'RD 2 - Rettungsdienst',
            description: 'Rettungsdiensteinsatz mit Notarzt - verletzte oder erkrankte Person mit Notarztindikation',
            color: '#f57c00',
            icon: 'user-md'
        },
        { 
            id: 'rd3', 
            keyword: 'RD 3', 
            label: 'RD 3 - Rettungsdienst',
            description: 'Rettungsdiensteinsatz mit erhöhtem Kräftebedarf - Einsatz mit zwei Rettungswagen und einem Notarzt',
            color: '#d32f2f',
            icon: 'exclamation-triangle'
        },
        { 
            id: 'manv1', 
            keyword: 'MANV 1', 
            label: 'MANV 1 - Massenanfall von Verletzten',
            description: '5-10 Verletzte - Organisatorischer Leiter Rettungsdienst',
            color: '#c62828',
            icon: 'users'
        },
        { 
            id: 'manv2', 
            keyword: 'MANV 2', 
            label: 'MANV 2 - Massenanfall von Verletzten',
            description: '11-25 Verletzte - Leitender Notarzt',
            color: '#b71c1c',
            icon: 'users'
        },
        { 
            id: 'manv3', 
            keyword: 'MANV 3', 
            label: 'MANV 3 - Massenanfall von Verletzten',
            description: '26-50 Verletzte - Technische Einsatzleitung',
            color: '#7f0000',
            icon: 'hospital'
        },
        { 
            id: 'manv4', 
            keyword: 'MANV 4', 
            label: 'MANV 4 - Massenanfall von Verletzten',
            description: '>50 Verletzte - Katastrophenfall',
            color: '#4a0000',
            icon: 'radiation'
        }
    ],

    activeDropdown: null,
    selectedCallback: null,

    initialize(inputId, onSelect) {
        const input = document.getElementById(inputId);
        if (!input) {
            console.error(`❌ Priority Input nicht gefunden: ${inputId}`);
            return;
        }

        this.selectedCallback = onSelect;

        // Wrapper für Dropdown erstellen
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        
        // Input ersetzen
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        // Event Listener
        input.addEventListener('focus', () => {
            this.showDropdown(input, wrapper);
        });

        input.addEventListener('input', () => {
            this.filterDropdown(input.value);
        });

        // Schließen bei Click außerhalb
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                this.hideDropdown();
            }
        });

        // Keyboard Navigation
        input.addEventListener('keydown', (e) => {
            this.handleKeyboard(e, input);
        });

        console.log(`✅ Priority Dropdown initialisiert für #${inputId}`);
    },

    showDropdown(input, wrapper) {
        // Entferne alte Dropdown
        this.hideDropdown();

        // Erstelle Dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'priority-dropdown';
        dropdown.id = 'priority-dropdown-active';

        this.priorityLevels.forEach((priority, index) => {
            const item = document.createElement('div');
            item.className = 'priority-item';
            item.dataset.index = index;
            item.dataset.keyword = priority.keyword;
            
            item.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-${priority.icon}" style="color: ${priority.color}; font-size: 1.2em; width: 30px; text-align: center;"></i>
                    <div style="flex: 1;">
                        <div style="font-weight: 700; color: ${priority.color}; font-size: 1.05em; margin-bottom: 3px;">
                            ${priority.label}
                        </div>
                        <div style="font-size: 0.85em; color: var(--text-muted); line-height: 1.3;">
                            ${priority.description}
                        </div>
                    </div>
                </div>
            `;

            item.addEventListener('click', () => {
                this.selectPriority(priority, input);
            });

            item.addEventListener('mouseenter', () => {
                this.highlightItem(item);
            });

            dropdown.appendChild(item);
        });

        wrapper.appendChild(dropdown);
        this.activeDropdown = dropdown;

        // Animation
        setTimeout(() => {
            dropdown.style.opacity = '1';
            dropdown.style.transform = 'translateY(0)';
        }, 10);
    },

    filterDropdown(query) {
        if (!this.activeDropdown) return;

        const items = this.activeDropdown.querySelectorAll('.priority-item');
        const lowerQuery = query.toLowerCase().trim();

        let visibleCount = 0;

        items.forEach(item => {
            const keyword = item.dataset.keyword.toLowerCase();
            const text = item.textContent.toLowerCase();

            if (!query || keyword.includes(lowerQuery) || text.includes(lowerQuery)) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // "Keine Ergebnisse" Nachricht
        let noResults = this.activeDropdown.querySelector('.priority-no-results');
        
        if (visibleCount === 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'priority-no-results';
                noResults.innerHTML = `
                    <i class="fas fa-search" style="font-size: 2em; opacity: 0.5; margin-bottom: 10px;"></i>
                    <div>Keine Prioritätsstufe gefunden</div>
                    <div style="font-size: 0.85em; color: var(--text-muted); margin-top: 5px;">Versuche: RD 1, RD 2, MANV 1, etc.</div>
                `;
                this.activeDropdown.appendChild(noResults);
            }
            noResults.style.display = 'block';
        } else if (noResults) {
            noResults.style.display = 'none';
        }
    },

    selectPriority(priority, input) {
        input.value = priority.keyword;
        
        // Callback aufrufen
        if (this.selectedCallback) {
            this.selectedCallback(priority);
        }

        // Visual Feedback
        input.style.borderColor = priority.color;
        input.style.color = priority.color;
        input.style.fontWeight = '700';

        setTimeout(() => {
            input.style.borderColor = '';
        }, 1000);

        this.hideDropdown();
        console.log(`✅ Priorität ausgewählt: ${priority.keyword}`);
    },

    highlightItem(item) {
        // Remove highlight from all items
        const items = this.activeDropdown.querySelectorAll('.priority-item');
        items.forEach(i => i.classList.remove('active'));
        
        // Add highlight to current item
        item.classList.add('active');
    },

    handleKeyboard(e, input) {
        if (!this.activeDropdown) return;

        const items = Array.from(this.activeDropdown.querySelectorAll('.priority-item')).filter(i => i.style.display !== 'none');
        if (items.length === 0) return;

        const currentActive = this.activeDropdown.querySelector('.priority-item.active');
        let currentIndex = currentActive ? items.indexOf(currentActive) : -1;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = (currentIndex + 1) % items.length;
                this.highlightItem(items[currentIndex]);
                items[currentIndex].scrollIntoView({ block: 'nearest' });
                break;

            case 'ArrowUp':
                e.preventDefault();
                currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                this.highlightItem(items[currentIndex]);
                items[currentIndex].scrollIntoView({ block: 'nearest' });
                break;

            case 'Enter':
                e.preventDefault();
                if (currentActive) {
                    const index = parseInt(currentActive.dataset.index);
                    this.selectPriority(this.priorityLevels[index], input);
                } else if (items.length === 1) {
                    // Auto-select wenn nur 1 Ergebnis
                    const index = parseInt(items[0].dataset.index);
                    this.selectPriority(this.priorityLevels[index], input);
                }
                break;

            case 'Escape':
                e.preventDefault();
                this.hideDropdown();
                input.blur();
                break;
        }
    },

    hideDropdown() {
        if (this.activeDropdown) {
            this.activeDropdown.style.opacity = '0';
            this.activeDropdown.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                if (this.activeDropdown) {
                    this.activeDropdown.remove();
                    this.activeDropdown = null;
                }
            }, 200);
        }
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.PriorityDropdown = PriorityDropdown;
}

console.log('✅ Priority Dropdown System v1.0 geladen');