// =========================
// UI RADIO SYSTEM v2.0
// + Integration mit radio-system.js
// + Groq-basierte intelligente Antworten
// + Automatische Status-Updates
// =========================

/**
 * Aktualisiert Fahrzeug-Dropdown für Funkkommunikation
 */
function updateRadioVehicleDropdown() {
    const dropdown = document.getElementById('radio-vehicle-dropdown');
    if (!dropdown) return;
    
    // Behalte aktuelle Auswahl
    const currentValue = dropdown.value;
    
    const vehicles = game?.vehicles || [];
    // Filtere Fahrzeuge: owned UND nicht Status 2 (Sprechwunsch)
    const availableVehicles = vehicles.filter(v => v.owned && v.status !== 2);
    
    dropdown.innerHTML = '<option value="">-- Fahrzeug wählen --</option>';
    
    availableVehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.id;
        
        const statusInfo = CONFIG.FMS_STATUS[vehicle.status] || { name: 'Unbekannt' };
        option.textContent = `${vehicle.callsign} - ${vehicle.type} - Status ${vehicle.status} (${statusInfo.name})`;
        
        dropdown.appendChild(option);
    });
    
    // Setze Auswahl zurück wenn noch verfügbar
    if (currentValue && availableVehicles.find(v => v.id === currentValue)) {
        dropdown.value = currentValue;
        radioSystem.selectVehicle(currentValue);
    } else if (radioSystem.selectedVehicleId) {
        // Fahrzeug nicht mehr verfügbar (z.B. Status 2)
        radioSystem.selectVehicle(null);
    }
}

/**
 * Wählt Fahrzeug aus Dropdown für Funkkommunikation
 */
function selectVehicleFromDropdown() {
    const dropdown = document.getElementById('radio-vehicle-dropdown');
    if (!dropdown) return;
    
    const vehicleId = dropdown.value;
    
    if (vehicleId) {
        radioSystem.selectVehicle(vehicleId);
        const vehicle = game.vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            console.log(`📻 Fahrzeug ausgewählt: ${vehicle.callsign}`);
        }
    } else {
        radioSystem.selectVehicle(null);
    }
}

/**
 * Sendet Funkspruch an ausgewähltes Fahrzeug
 */
async function sendRadioToVehicle() {
    const input = document.getElementById('radio-vehicle-message-input');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) {
        showNotification('⚠️ Bitte geben Sie eine Nachricht ein!', 'warning');
        return;
    }
    
    // Verwende RadioSystem für intelligente Antworten
    await radioSystem.sendRadioToVehicle(message);
    
    // Leere Eingabefeld
    input.value = '';
    input.focus();
}

/**
 * Sendet allgemeinen Funkspruch (an alle)
 */
function sendRadioMessage() {
    const input = document.getElementById('radio-message-input');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) {
        showNotification('⚠️ Bitte geben Sie eine Nachricht ein!', 'warning');
        return;
    }
    
    // Sende als Leitstelle an alle
    addRadioMessage('Leitstelle', `Durchsage an alle: ${message}`, 'dispatcher');
    
    // Leere Eingabefeld
    input.value = '';
    input.focus();
    
    console.log(`📻 Funkspruch gesendet: ${message}`);
}

/**
 * Fügt Nachricht zum Funkverkehr hinzu
 * @param {string} sender - Absender (z.B. Rufzeichen oder "Leitstelle")
 * @param {string} message - Nachricht
 * @param {string} type - Typ: 'dispatcher', 'vehicle', 'vehicle-auto', 'error'
 */
function addRadioMessage(sender, message, type = 'system') {
    const container = document.getElementById('radio-feed-full');
    if (!container) return;

    // Blockiere reine System-Nachrichten
    if (type === 'system') {
        return;
    }

    const timestamp = getGameTimestamp();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `radio-message radio-${type}`;
    
    // Icons und Farben basierend auf Typ
    let icon = '📻';
    let color = '#17a2b8';
    
    switch(type) {
        case 'dispatcher':
            icon = '👨‍💻';
            color = '#17a2b8';
            break;
        case 'vehicle':
            icon = '🚑';
            color = '#28a745';
            break;
        case 'vehicle-auto':
            icon = '🔔';
            color = '#ffc107';
            break;
        case 'error':
            icon = '⚠️';
            color = '#dc3545';
            break;
    }
    
    msgDiv.style.cssText = `
        border-left: 4px solid ${color};
        background: ${color}15;
        padding: 10px 12px;
        margin-bottom: 8px;
        border-radius: 4px;
    `;
    
    msgDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #666; font-size: 0.85em;">[${timestamp}]</span>
            <span style="font-size: 1.2em;">${icon}</span>
            <span style="font-weight: 600; color: ${color};">${sender}:</span>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;

    // Limitiere auf 100 Einträge
    while (container.children.length > 100) {
        container.removeChild(container.firstChild);
    }
}

/**
 * Hilfsfunktion: Aktueller Game-Zeitstempel
 */
function getGameTimestamp() {
    if (typeof IncidentNumbering !== 'undefined' && IncidentNumbering.getCurrentTimestamp) {
        return IncidentNumbering.getCurrentTimestamp();
    }
    return new Date().toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}

/**
 * Zeigt Benachrichtigung an
 */
function showNotification(message, type = 'info') {
    if (typeof NotificationSystem !== 'undefined' && NotificationSystem.show) {
        NotificationSystem.show(message, type);
    } else {
        alert(message);
    }
}

// Exportiere Funktionen
if (typeof window !== 'undefined') {
    window.updateRadioVehicleDropdown = updateRadioVehicleDropdown;
    window.selectVehicleFromDropdown = selectVehicleFromDropdown;
    window.sendRadioToVehicle = sendRadioToVehicle;
    window.sendRadioMessage = sendRadioMessage;
    window.addRadioMessage = addRadioMessage;
    
    console.log('✅ UI Radio System v2.0 geladen');
}