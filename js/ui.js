// =========================
// UI SYSTEM - Updated v3.0
// Fixed Radio Messages with Colors
// =========================

const UI = {
    updateIncidentList() {
        const container = document.getElementById('incident-list');
        if (!container) return;

        const incidents = GAME_DATA?.incidents || [];
        const badge = document.getElementById('incident-count');
        
        if (badge) {
            badge.textContent = incidents.length;
        }

        if (incidents.length === 0) {
            container.innerHTML = '<p class="no-data">Keine aktiven Einsätze</p>';
            return;
        }

        container.innerHTML = incidents.map(incident => `
            <div class="incident-item" onclick="UI.selectIncident('${incident.id}')">
                <div class="incident-header">
                    <span class="incident-badge">🚨</span>
                    <span class="incident-number">${incident.id}</span>
                </div>
                <div class="incident-keyword">${incident.stichwort}</div>
                <div class="incident-location">📍 ${incident.ort}</div>
                <div class="incident-time">🕒 ${incident.zeitstempel}</div>
                <div class="incident-vehicles">
                    ${incident.vehicles.map(vId => {
                        const v = GAME_DATA.vehicles.find(vehicle => vehicle.id === vId);
                        if (!v) return '';
                        const fms = this.getFMSStatus(v);
                        return `<span class="vehicle-chip" style="background: ${fms.color}20; border-left: 3px solid ${fms.color};">${v.callsign}</span>`;
                    }).join('')}
                </div>
            </div>
        `).join('');
    },

    selectIncident(incidentId) {
        const incident = GAME_DATA.incidents.find(i => i.id === incidentId);
        if (!incident) return;

        const detailsContainer = document.getElementById('incident-details');
        if (!detailsContainer) return;

        const assignedVehicles = incident.vehicles.map(vId => {
            const v = GAME_DATA.vehicles.find(vehicle => vehicle.id === vId);
            if (!v) return null;
            const fms = this.getFMSStatus(v);
            return { vehicle: v, fms: fms };
        }).filter(Boolean);

        detailsContainer.innerHTML = `
            <div class="incident-details-content">
                <div class="detail-header">
                    <h3>🚨 ${incident.stichwort}</h3>
                    <span class="incident-badge-large">${incident.id}</span>
                </div>
                
                <div class="detail-section">
                    <h4>📍 Einsatzort</h4>
                    <p>${incident.ort}</p>
                </div>

                <div class="detail-section">
                    <h4>📝 Meldebild</h4>
                    <p>${incident.meldebild}</p>
                </div>

                <div class="detail-section">
                    <h4>🕒 Zeitstempel</h4>
                    <p>${incident.zeitstempel}</p>
                </div>

                <div class="detail-section">
                    <h4>🚑 Alarmierte Fahrzeuge (${assignedVehicles.length})</h4>
                    <div class="vehicle-list">
                        ${assignedVehicles.map(({ vehicle, fms }) => `
                            <div class="vehicle-detail-card" style="border-left: 4px solid ${fms.color};">
                                <div class="vehicle-detail-header">
                                    <span style="font-size: 1.5em;">${fms.icon}</span>
                                    <div>
                                        <div class="vehicle-detail-name">${vehicle.name}</div>
                                        <div class="vehicle-detail-callsign">${vehicle.callsign}</div>
                                    </div>
                                </div>
                                <div class="vehicle-detail-status" style="background: ${fms.color}20; color: ${fms.color};">
                                    <strong>Status ${vehicle.currentStatus || 2}</strong> - ${fms.name}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="detail-actions">
                    <button class="btn btn-danger" onclick="UI.closeIncident('${incident.id}')">
                        <i class="fas fa-check"></i> Einsatz abschließen
                    </button>
                </div>
            </div>
        `;

        if (typeof map !== 'undefined' && incident.koordinaten) {
            map.setView([incident.koordinaten.lat, incident.koordinaten.lon], 15);
        }
    },

    closeIncident(incidentId) {
        const index = GAME_DATA.incidents.findIndex(i => i.id === incidentId);
        if (index === -1) return;

        const incident = GAME_DATA.incidents[index];
        
        if (typeof removeIncidentFromMap === 'function') {
            removeIncidentFromMap(incidentId);
        }

        GAME_DATA.incidents.splice(index, 1);

        incident.vehicles.forEach(vId => {
            const vehicle = GAME_DATA.vehicles.find(v => v.id === vId);
            if (vehicle) {
                vehicle.status = 'available';
                vehicle.currentStatus = 2;
                vehicle.incident = null;
            }
        });

        this.updateIncidentList();
        document.getElementById('incident-details').innerHTML = '<p class="no-data">Wählen Sie einen Einsatz aus</p>';

        console.log(`✅ Einsatz ${incidentId} abgeschlossen`);
    },

    getFMSStatus(vehicle) {
        const fmsCode = vehicle.currentStatus || 2;
        return CONFIG.FMS_STATUS[fmsCode] || {
            name: 'Unbekannt',
            color: '#6c757d',
            icon: '🚑'
        };
    },

    updateVehicleList() {
        if (typeof updateVehicleMarkers === 'function') {
            updateVehicleMarkers();
        }
    }
};

// IMPROVED: Radio Messages mit Farben
function addRadioMessage(message, sender = 'system', color = null) {
    const container = document.getElementById('radio-feed-full');
    if (!container) return;

    // KEINE System-Meldungen!
    if (sender === 'system') {
        return; // Skip system messages
    }

    const timestamp = IncidentNumbering.getCurrentTimestamp();
    const senderIcons = {
        'dispatcher': '👨‍💻 Leitstelle',
        'vehicle': '🚑'
    };

    const icon = senderIcons[sender] || '📻';
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'radio-message';
    
    // Farbe für Status-Meldungen
    let style = '';
    if (color) {
        style = `border-left: 4px solid ${color}; background: ${color}15; padding-left: 12px;`;
    } else {
        style = 'border-left: 4px solid #17a2b8; padding-left: 12px;';
    }
    
    msgDiv.style.cssText = style + ' margin-bottom: 8px; padding: 10px; border-radius: 4px;';
    msgDiv.innerHTML = `
        <span style="color: #666; font-size: 0.85em; margin-right: 8px;">[${timestamp}]</span>
        <span style="margin-right: 8px; font-weight: 600;">${icon}</span>
        <span>${message}</span>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;

    while (container.children.length > 100) {
        container.removeChild(container.firstChild);
    }
}

if (typeof window !== 'undefined') {
    window.UI = UI;
    window.addRadioMessage = addRadioMessage;
}