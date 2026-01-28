// =========================
// RADIO CONTROLS v1.1 - OPTIMIERT
// Fahrzeug-Auswahl & Funkspruch-Steuerung
// (Umbenannt von radio-vehicle-control.js)
// =========================

class RadioVehicleControl {
    constructor() {
        this.selectedVehicleId = null;
        this.dropdownElement = null;
        this.messageInput = null;
        this.vehicleInfoElement = null;
        
        this.initialize();
    }
    
    /**
     * Initialisiert Radio Control
     */
    initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    /**
     * Richtet UI-Elemente ein
     */
    setup() {
        this.dropdownElement = document.getElementById('radio-vehicle-dropdown');
        this.messageInput = document.getElementById('radio-vehicle-message-input');
        this.vehicleInfoElement = document.getElementById('selected-vehicle-info');
        
        if (!this.dropdownElement || !this.messageInput) {
            console.warn('⚠️ Radio Control UI-Elemente nicht gefunden');
            return;
        }
        
        // Initial Update
        this.updateVehicleDropdown();
        
        // Update bei Fahrzeug-Änderungen
        if (window.game) {
            setInterval(() => {
                if (window.game && window.game.vehicles) {
                    this.updateVehicleDropdown();
                }
            }, 5000); // Update alle 5 Sekunden
        }
        
        console.log('✅ Radio Controls v1.1 initialisiert');
    }
    
    /**
     * Aktualisiert Fahrzeug-Dropdown
     */
    updateVehicleDropdown() {
        if (!this.dropdownElement || !window.game || !window.game.vehicles) return;
        
        const currentValue = this.dropdownElement.value;
        this.dropdownElement.innerHTML = '<option value="">-- Fahrzeug wählen --</option>';
        
        // Filtere verfügbare Fahrzeuge
        const availableVehicles = window.game.vehicles.filter(v => {
            if (!v.owned) return false;
            const statusInfo = window.CONFIG ? window.CONFIG.getFMSStatus(v.currentStatus) : null;
            return statusInfo ? statusInfo.canBeContacted : true;
        });
        
        // Gruppiere nach Typ
        const grouped = {};
        availableVehicles.forEach(v => {
            if (!grouped[v.type]) grouped[v.type] = [];
            grouped[v.type].push(v);
        });
        
        // Erstelle Options mit Gruppen
        Object.keys(grouped).sort().forEach(type => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = `${type} (${grouped[type].length})`;
            
            grouped[type].forEach(vehicle => {
                const option = document.createElement('option');
                option.value = vehicle.id;
                
                const statusInfo = window.CONFIG ? window.CONFIG.getFMSStatus(vehicle.currentStatus) : null;
                const statusText = statusInfo ? statusInfo.shortName : `Status ${vehicle.currentStatus}`;
                const statusIcon = statusInfo ? statusInfo.icon : '📍';
                
                option.textContent = `${statusIcon} ${vehicle.callsign} - ${statusText}`;
                
                // Custom Style für Status
                if (statusInfo && statusInfo.color) {
                    option.style.color = statusInfo.color;
                    option.style.fontWeight = 'bold';
                }
                
                optgroup.appendChild(option);
            });
            
            this.dropdownElement.appendChild(optgroup);
        });
        
        // Restore Selection
        if (currentValue && availableVehicles.find(v => v.id === currentValue)) {
            this.dropdownElement.value = currentValue;
        } else if (this.selectedVehicleId) {
            // Falls vorher ausgewähltes Fahrzeug nicht mehr verfügbar
            this.selectedVehicleId = null;
            this.hideVehicleInfo();
        }
    }
    
    /**
     * Wählt Fahrzeug aus Dropdown aus
     */
    selectVehicle(vehicleId) {
        if (!vehicleId) {
            this.selectedVehicleId = null;
            this.hideVehicleInfo();
            if (this.messageInput) this.messageInput.disabled = true;
            return;
        }
        
        const vehicle = window.game?.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            console.warn('⚠️ Fahrzeug nicht gefunden:', vehicleId);
            return;
        }
        
        this.selectedVehicleId = vehicleId;
        
        // Enable Input
        if (this.messageInput) {
            this.messageInput.disabled = false;
            this.messageInput.focus();
        }
        
        // Zeige Fahrzeuginfo
        this.showVehicleInfo(vehicle);
        
        // Notify Radio System
        if (window.radioSystem) {
            window.radioSystem.selectVehicle(vehicleId);
        }
        
        console.log(`📡 Fahrzeug ausgewählt: ${vehicle.callsign}`);
    }
    
    /**
     * Zeigt Fahrzeuginfo an
     */
    showVehicleInfo(vehicle) {
        if (!this.vehicleInfoElement) return;
        
        const statusInfo = window.CONFIG ? window.CONFIG.getFMSStatus(vehicle.currentStatus) : null;
        const incident = window.game?.incidents.find(i => 
            i.assignedVehicles && i.assignedVehicles.includes(vehicle.id)
        );
        
        this.vehicleInfoElement.innerHTML = `
            <div class="selected-vehicle-card" style="
                background: linear-gradient(135deg, rgba(49, 130, 206, 0.1) 0%, rgba(44, 82, 130, 0.1) 100%);
                border-left: 4px solid ${statusInfo?.color || '#3182ce'};
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
            ">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                    <span style="font-size: 32px;">${statusInfo?.icon || '🚑'}</span>
                    <div style="flex: 1;">
                        <h4 style="margin: 0; color: ${statusInfo?.color || '#3182ce'}; font-size: 18px;">
                            ${vehicle.callsign}
                        </h4>
                        <p style="margin: 4px 0 0 0; opacity: 0.8; font-size: 14px;">
                            ${vehicle.type}
                        </p>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                    <div>
                        <strong style="opacity: 0.7;">Status:</strong><br>
                        <span style="color: ${statusInfo?.color || '#fff'}; font-weight: bold;">
                            ${statusInfo?.name || 'Unbekannt'}
                        </span>
                    </div>
                    <div>
                        <strong style="opacity: 0.7;">Standort:</strong><br>
                        ${vehicle.location || vehicle.station || 'Unbekannt'}
                    </div>
                    ${incident ? `
                        <div style="grid-column: 1 / -1; margin-top: 5px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                            <strong style="opacity: 0.7;">Aktueller Einsatz:</strong><br>
                            <span style="color: #ffc107;">${incident.keyword}</span> - ${incident.location}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        this.vehicleInfoElement.style.display = 'block';
    }
    
    /**
     * Versteckt Fahrzeuginfo
     */
    hideVehicleInfo() {
        if (this.vehicleInfoElement) {
            this.vehicleInfoElement.style.display = 'none';
        }
    }
    
    /**
     * Sendet Nachricht an ausgewähltes Fahrzeug
     */
    async sendMessage() {
        if (!this.selectedVehicleId) {
            if (window.addRadioMessage) {
                window.addRadioMessage('System', 'Bitte wählen Sie zuerst ein Fahrzeug aus.', 'error');
            }
            return;
        }
        
        if (!this.messageInput || !this.messageInput.value.trim()) {
            if (window.addRadioMessage) {
                window.addRadioMessage('System', 'Bitte geben Sie eine Nachricht ein.', 'error');
            }
            return;
        }
        
        const message = this.messageInput.value.trim();
        
        // Sende via Radio System
        if (window.radioSystem) {
            await window.radioSystem.sendRadioToVehicle(message);
        } else {
            console.error('❌ Radio System nicht gefunden');
            if (window.addRadioMessage) {
                window.addRadioMessage('System', 'Funk-System nicht verfügbar.', 'error');
            }
        }
        
        // Clear Input
        this.messageInput.value = '';
        this.messageInput.focus();
    }
    
    /**
     * Gibt ausgewähltes Fahrzeug zurück
     */
    getSelectedVehicle() {
        if (!this.selectedVehicleId || !window.game) return null;
        return window.game.vehicles.find(v => v.id === this.selectedVehicleId);
    }
}

// Globale Instanz
const radioVehicleControl = new RadioVehicleControl();

/**
 * ✅ GLOBAL FUNCTIONS - Von HTML aufrufbar
 */
function selectVehicleFromDropdown() {
    const dropdown = document.getElementById('radio-vehicle-dropdown');
    if (dropdown && radioVehicleControl) {
        radioVehicleControl.selectVehicle(dropdown.value);
    }
}

function sendRadioToVehicle() {
    if (radioVehicleControl) {
        radioVehicleControl.sendMessage();
    }
}

function updateRadioVehicleDropdown() {
    if (radioVehicleControl) {
        radioVehicleControl.updateVehicleDropdown();
    }
}

// Global verfügbar machen
if (typeof window !== 'undefined') {
    window.radioVehicleControl = radioVehicleControl;
    window.selectVehicleFromDropdown = selectVehicleFromDropdown;
    window.sendRadioToVehicle = sendRadioToVehicle;
    window.updateRadioVehicleDropdown = updateRadioVehicleDropdown;
}

console.log('✅ Radio Controls v1.1 geladen (umbenannt von radio-vehicle-control.js)');
