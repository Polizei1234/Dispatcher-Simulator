// =========================
// UI SYSTEM - Updated v3.1
// Fixed Radio Messages with Colors
// + Incident Manager Integration
// =========================

const UI = {
    updateIncidentList() {
        const container = document.getElementById('incident-list');
        if (!container) return;

        const incidents = GAME_DATA?.incidents || [];
        const activeIncidents = incidents.filter(i => !i.completed && i.status !== 'completed');
        const badge = document.getElementById('incident-count');
        
        if (badge) {
            badge.textContent = activeIncidents.length;
        }

        if (activeIncidents.length === 0) {
            container.innerHTML = '<p class="no-data">Keine aktiven Einsätze</p>';
            return;
        }

        container.innerHTML = activeIncidents.map(incident => `
            <div class="incident-item" onclick="UI.selectIncident('${incident.id}')">
                <div class="incident-header">
                    <span class="incident-badge">🚨</span>
                    <span class="incident-number">${incident.id || incident.nummer}</span>
                </div>
                <div class="incident-keyword">${incident.stichwort}</div>
                <div class="incident-location">📍 ${incident.ort}</div>
                <div class="incident-time">🕒 ${incident.zeitstempel}</div>
                <div class="incident-vehicles">
                    ${(incident.vehicles || incident.assignedVehicles || []).map(vId => {
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
        const incident = GAME_DATA.incidents.find(i => i.id === incidentId || i.nummer === incidentId);
        if (!incident) return;

        const detailsContainer = document.getElementById('incident-details');
        if (!detailsContainer) return;

        const vehicleIds = incident.vehicles || incident.assignedVehicles || [];
        const assignedVehicles = vehicleIds.map(vId => {
            const v = GAME_DATA.vehicles.find(vehicle => vehicle.id === vId);
            if (!v) return null;
            const fms = this.getFMSStatus(v);
            return { vehicle: v, fms: fms };
        }).filter(Boolean);

        detailsContainer.innerHTML = `
            <div class="incident-details-content">
                <div class="detail-header">
                    <h3>🚨 ${incident.stichwort}</h3>
                    <span class="incident-badge-large">${incident.id || incident.nummer}</span>
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
                        ${assignedVehicles.length > 0 ? assignedVehicles.map(({ vehicle, fms }) => `
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
                        `).join('') : '<p style="color: #888; font-style: italic;">Noch keine Fahrzeuge alarmiert</p>'}
                    </div>
                </div>

                <div class="detail-actions">
                    <button class="btn btn-danger" onclick="UI.closeIncident('${incident.id || incident.nummer}')">
                        <i class="fas fa-flag-checkered"></i> Einsatz abschließen
                    </button>
                </div>
            </div>
        `;

        if (typeof map !== 'undefined' && incident.koordinaten) {
            map.setView([incident.koordinaten.lat, incident.koordinaten.lon], 15);
        }
    },

    /**
     * ✅ PHASE 2 FIX 2: Nutzt jetzt IncidentManager für sicheren Abschluss
     */
    closeIncident(incidentId) {
        console.log(`📋 UI: Einsatzabschluss angefordert für ${incidentId}`);
        
        // ✅ Nutze den neuen IncidentManager mit Sicherheits-Dialog
        if (typeof IncidentManager !== 'undefined' && IncidentManager.showCompleteIncidentDialog) {
            IncidentManager.showCompleteIncidentDialog(incidentId);
        } else {
            console.error('❌ IncidentManager nicht verfügbar - Fallback zu alter Methode');
            this.closeIncidentFallback(incidentId);
        }
    },

    /**
     * ⚠️ FALLBACK: Alte Methode (sollte nicht mehr benutzt werden)
     */
    closeIncidentFallback(incidentId) {
        const index = GAME_DATA.incidents.findIndex(i => i.id === incidentId || i.nummer === incidentId);
        if (index === -1) return;

        const incident = GAME_DATA.incidents[index];
        
        if (typeof removeIncidentFromMap === 'function') {
            removeIncidentFromMap(incidentId);
        }

        GAME_DATA.incidents.splice(index, 1);

        const vehicleIds = incident.vehicles || incident.assignedVehicles || [];
        vehicleIds.forEach(vId => {
            const vehicle = GAME_DATA.vehicles.find(v => v.id === vId);
            if (vehicle) {
                vehicle.status = 'available';
                vehicle.currentStatus = 2;
                vehicle.incident = null;
            }
        });

        this.updateIncidentList();
        document.getElementById('incident-details').innerHTML = '<p class="no-data">Wählen Sie einen Einsatz aus</p>';

        console.log(`✅ Einsatz ${incidentId} abgeschlossen (Fallback)`);
    },

    getFMSStatus(vehicle) {
        const fmsCode = vehicle.currentStatus || 2;
        return CONFIG.FMS_STATUS[fmsCode] || {
            name: 'Unbekannt',n            color: '#6c757d',
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