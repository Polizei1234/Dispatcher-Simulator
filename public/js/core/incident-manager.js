// =========================
// INCIDENT MANAGER v1.0
// Sichere Einsatzabschluss-Verwaltung
// =========================

const IncidentManager = {
    /**
     * ✅ PHASE 2 FIX 2: Schließt einen Einsatz sicher ab
     * - Stoppt alle zugewiesenen Fahrzeuge
     * - Setzt Status zurück
     * - Schickt Fahrzeuge zur Wache
     * - Entfernt Routen
     */
    completeIncident(incidentId) {
        console.group('🏁 EINSATZ ABSCHLIESSEN');
        console.log(`📋 Einsatz-ID: ${incidentId}`);

        // Finde Einsatz
        const incident = GAME_DATA.incidents.find(i => i.id === incidentId || i.nummer === incidentId);
        
        if (!incident) {
            console.error(`❌ Einsatz ${incidentId} nicht gefunden!`);
            console.groupEnd();
            return false;
        }

        console.log(`✅ Einsatz gefunden: ${incident.stichwort || incident.title}`);
        console.log(`📍 Ort: ${incident.ort || incident.location}`);

        // Finde alle zugewiesenen Fahrzeuge
        const assignedVehicleIds = incident.assignedVehicles || [];
        console.log(`🚑 Zugewiesene Fahrzeuge: ${assignedVehicleIds.length}`);

        if (assignedVehicleIds.length === 0) {
            console.warn('⚠️ Keine Fahrzeuge zugewiesen');
        }

        // Bearbeite jedes Fahrzeug
        assignedVehicleIds.forEach(vehicleId => {
            this.handleVehicleOnIncidentCompletion(vehicleId, incidentId);
        });

        // Markiere Einsatz als abgeschlossen
        incident.status = 'completed';
        incident.completed = true;
        incident.completedAt = new Date().toISOString();

        console.log('✅ Einsatz erfolgreich abgeschlossen');
        console.groupEnd();

        // Funkspruch
        if (typeof addRadioMessage === 'function') {
            addRadioMessage('Leitstelle', `Einsatz ${incident.nummer || incidentId} abgeschlossen - Fahrzeuge kehren zurück`);
        }

        // Update UI
        if (typeof UI !== 'undefined' && UI.updateIncidentList) {
            UI.updateIncidentList();
        }

        return true;
    },

    /**
     * ✅ Behandelt einzelnes Fahrzeug beim Einsatzabschluss
     */
    handleVehicleOnIncidentCompletion(vehicleId, incidentId) {
        console.group(`🚑 Verarbeite Fahrzeug ${vehicleId}`);

        const vehicle = GAME_DATA.vehicles.find(v => v.id === vehicleId);
        
        if (!vehicle) {
            console.error(`❌ Fahrzeug ${vehicleId} nicht gefunden!`);
            console.groupEnd();
            return;
        }

        console.log(`📌 Fahrzeug: ${vehicle.callsign}`);
        console.log(`📊 Aktueller Status: ${vehicle.status}`);
        console.log(`🎯 FMS Status: ${vehicle.currentStatus || 'unbekannt'}`);

        // 1. Stoppe aktive Bewegung
        if (typeof VehicleMovement !== 'undefined' && VehicleMovement.movingVehicles) {
            const movement = VehicleMovement.movingVehicles[vehicleId];
            
            if (movement) {
                console.log(`🛑 Stoppe aktive Bewegung...`);
                console.log(`   Phase: ${movement.phase}`);
                console.log(`   Ziel: ${movement.incidentId}`);
                
                // Entferne aus movingVehicles
                delete VehicleMovement.movingVehicles[vehicleId];
                
                // Entferne Route von Karte
                VehicleMovement.removeVehicleRoute(vehicleId);
                
                // Lösche Arrival-Tracking
                delete VehicleMovement.arrivalReported[`${vehicleId}_to_scene`];
                delete VehicleMovement.arrivalReported[`${vehicleId}_to_hospital`];
                delete VehicleMovement.arrivalReported[`${vehicleId}_returning`];
                
                console.log('✅ Bewegung gestoppt');
            } else {
                console.log('ℹ️ Fahrzeug war nicht in Bewegung');
            }
        }

        // 2. Prüfe, ob Fahrzeug wirklich zu DIESEM Einsatz gehört
        if (vehicle.incident && vehicle.incident !== incidentId) {
            console.warn(`⚠️ Fahrzeug gehört zu anderem Einsatz: ${vehicle.incident}`);
            console.groupEnd();
            return;
        }

        // 3. Setze Fahrzeugstatus zurück
        const oldStatus = vehicle.status;
        
        // Sicherer Status-Reset basierend auf aktuellem Zustand
        switch (oldStatus) {
            case 'preparing':
            case 'dispatched':
            case 'on-scene':
            case 'transporting':
            case 'at-hospital':
            case 'returning':
                console.log(`🔄 Status-Änderung: ${oldStatus} → returning`);
                vehicle.status = 'returning';
                vehicle.targetLocation = null;
                
                // Setze FMS Status 1 (Einrücken)
                if (typeof VehicleMovement !== 'undefined' && VehicleMovement.setVehicleStatus) {
                    VehicleMovement.setVehicleStatus(vehicle, 1, true);
                }
                break;
                
            case 'available':
                console.log('✅ Fahrzeug bereits verfügbar');
                break;
                
            default:
                console.warn(`⚠️ Unbekannter Status: ${oldStatus}`);
                vehicle.status = 'available';
        }

        // 4. Entferne Einsatz-Referenz
        vehicle.incident = null;

        // 5. Schicke Fahrzeug zurück zur Wache (nur wenn nicht bereits verfügbar)
        if (oldStatus !== 'available' && vehicle.status === 'returning') {
            const station = STATIONS[vehicle.station];
            
            if (station) {
                console.log(`🏠 Sende Fahrzeug zur Wache: ${station.name}`);
                
                // Nutze VehicleMovement.dispatchVehicle mit Phase 'returning'
                if (typeof VehicleMovement !== 'undefined' && VehicleMovement.dispatchVehicle) {
                    setTimeout(() => {
                        VehicleMovement.dispatchVehicle(
                            vehicleId,
                            { lat: station.position[0], lon: station.position[1] },
                            null, // Kein Einsatz mehr
                            { skipRadio: true, phase: 'returning' }
                        );
                    }, 1000); // Kurze Verzögerung für saubere Verarbeitung
                    
                    console.log('✅ Rückkehr zur Wache initiiert');
                } else {
                    console.error('❌ VehicleMovement.dispatchVehicle nicht verfügbar');
                    // Fallback: Setze direkt auf verfügbar
                    vehicle.status = 'available';
                    vehicle.position = station.position;
                }
            } else {
                console.error(`❌ Wache ${vehicle.station} nicht gefunden`);
                vehicle.status = 'available';
            }
        }

        console.log('✅ Fahrzeug verarbeitet');
        console.groupEnd();
    },

    /**
     * ✅ Prüft ob ein Einsatz sicher abgeschlossen werden kann
     */
    canCompleteIncident(incidentId) {
        const incident = GAME_DATA.incidents.find(i => i.id === incidentId || i.nummer === incidentId);
        
        if (!incident) {
            return { canComplete: false, reason: 'Einsatz nicht gefunden' };
        }

        if (incident.status === 'completed') {
            return { canComplete: false, reason: 'Einsatz bereits abgeschlossen' };
        }

        // Prüfe ob Fahrzeuge noch aktiv unterwegs sind
        const assignedVehicleIds = incident.assignedVehicles || [];
        const activeVehicles = assignedVehicleIds.filter(vid => {
            const vehicle = GAME_DATA.vehicles.find(v => v.id === vid);
            return vehicle && vehicle.status !== 'available' && vehicle.status !== 'returning';
        });

        if (activeVehicles.length > 0) {
            return {
                canComplete: true,
                warning: `${activeVehicles.length} Fahrzeug(e) sind noch aktiv. Wirklich abschließen?`
            };
        }

        return { canComplete: true };
    },

    /**
     * ✅ Zeigt Einsatzabschluss-Dialog mit Warnung
     */
    showCompleteIncidentDialog(incidentId) {
        const check = this.canCompleteIncident(incidentId);
        
        if (!check.canComplete) {
            alert(`❌ Einsatz kann nicht abgeschlossen werden:\n${check.reason}`);
            return;
        }

        let message = `Einsatz ${incidentId} abschließen?`;
        if (check.warning) {
            message += `\n\n⚠️ WARNUNG:\n${check.warning}`;
        }

        if (confirm(message)) {
            this.completeIncident(incidentId);
        }
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.IncidentManager = IncidentManager;
    console.log('✅ Incident Manager v1.0 geladen - Sicherer Einsatzabschluss');
}