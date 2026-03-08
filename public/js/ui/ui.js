// =========================
// UI SYSTEM - v5.0 - ZENTRALE STATUS-FUNKTION
// ✅ All radio references removed
// ✅ Status-Logging via VehicleMovement
// ✅✅✅ v5.0: Nutzt VehicleStatusUtil (Single Source of Truth!)
// =========================

const UI = {
    updateIncidentList() {
        const container = document.getElementById('incident-list');
        if (!container) {
            console.warn('⚠️ Element nicht gefunden: incident-list');
            return;
        }

        const incidents = GAME_DATA?.incidents || [];
        const activeIncidents = incidents.filter(i => !i.completed && i.status !== 'completed');
        const badge = document.getElementById('incident-count');
        
        if (badge) {
            badge.textContent = activeIncidents.length;
        } else {
            console.warn('⚠️ Element nicht gefunden: incident-count');
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
                        // ✅✅✅ ZENTRALE STATUS-FUNKTION!
                        const fms = VehicleStatusUtil.getStatus(v);
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
        if (!detailsContainer) {
            console.warn('⚠️ Element nicht gefunden: incident-details');
            return;
        }

        const vehicleIds = incident.vehicles || incident.assignedVehicles || [];
        const assignedVehicles = vehicleIds.map(vId => {
            const v = GAME_DATA.vehicles.find(vehicle => vehicle.id === vId);
            if (!v) return null;
            // ✅✅✅ ZENTRALE STATUS-FUNKTION!
            const fms = VehicleStatusUtil.getStatus(v);
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
                    <h4>📏 Meldebild</h4>
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
                                    <strong>Status ${fms.code}</strong> - ${fms.name}
                                </div>
                            </div>
                        `).join('') : '<p style="color: #888; font-style: italic;">Noch keine Fahrzeuge alarmiert</p>'}
                    </div>
                </div>

                <div class="detail-actions" style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-primary" onclick="UI.requestReinforcement('${incident.id || incident.nummer}')" style="flex: 1;">
                        <i class="fas fa-plus-circle"></i> Verstärkung anfordern
                    </button>
                    <button class="btn btn-danger" onclick="UI.closeIncident('${incident.id || incident.nummer}')" style="flex: 1;">
                        <i class="fas fa-flag-checkered"></i> Einsatz abschließen
                    </button>
                </div>
            </div>
        `;

        if (typeof map !== 'undefined' && incident.koordinaten) {
            map.setView([incident.koordinaten.lat, incident.koordinaten.lon], 15);
        }
    },

    requestReinforcement(incidentId) {
        const incident = GAME_DATA.incidents.find(i => i.id === incidentId || i.nummer === incidentId);
        if (!incident) {
            console.error('❌ Einsatz nicht gefunden:', incidentId);
            return;
        }

        console.log(`🚑 Verstärkung angefordert für Einsatz: ${incidentId}`);

        if (typeof ManualIncident !== 'undefined' && ManualIncident.openVehicleModalForReinforcement) {
            ManualIncident.openVehicleModalForReinforcement(incident);
        } else {
            console.error('❌ ManualIncident.openVehicleModalForReinforcement nicht verfügbar');
        }
    },

    closeIncident(incidentId) {
        console.log(`📋 UI: Einsatzabschluss angefordert für ${incidentId}`);
        
        if (typeof IncidentManager !== 'undefined' && IncidentManager.showCompleteIncidentDialog) {
            IncidentManager.showCompleteIncidentDialog(incidentId);
        } else {
            console.error('❌ IncidentManager nicht verfügbar - Fallback zu alter Methode');
            this.closeIncidentFallback(incidentId);
        }
    },

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
                vehicle.incident = null;
                
                if (typeof VehicleMovement !== 'undefined' && VehicleMovement.setVehicleStatus) {
                    VehicleMovement.setVehicleStatus(vehicle, 2);
                    console.log(`✅ Status-Logging: ${vehicle.callsign} auf Status 2 gesetzt (Einsatzabschluss)`);
                } else {
                    vehicle.currentStatus = 2;
                    console.warn(`⚠️ VehicleMovement nicht verfügbar - direkte Zuweisung für ${vehicle.callsign}`);
                }
            }
        });

        this.updateIncidentList();
        const detailsContainer = document.getElementById('incident-details');
        if (detailsContainer) {
            detailsContainer.innerHTML = '<p class="no-data">Wählen Sie einen Einsatz aus</p>';
        } else {
            console.warn("⚠️ Element nicht gefunden: incident-details");
        }

        console.log(`✅ Einsatz ${incidentId} abgeschlossen (Fallback)`);
    },

    // ❌ ENTFERNT: Alte getFMSStatus() Funktion
    // ✅ Nutze stattdessen: VehicleStatusUtil.getStatus(vehicle)

    updateVehicleList() {
        if (typeof updateVehicleMarkers === 'function') {
            updateVehicleMarkers();
        }
    }
};

if (typeof window !== 'undefined') {
    window.UI = UI;
    console.log('✅ UI v5.0 geladen - Zentrale Status-Funktion aktiv!');
}