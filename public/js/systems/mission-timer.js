// =========================
// MISSION TIMER v1.0.1
// Dynamische Einsatzdauer & automatischer Transport
// ✅ FIX: HospitalService entfernt, nutzt window.HOSPITALS direkt
// =========================

class MissionTimer {
    constructor() {
        this.activeMissions = new Map();
        // ✅ FIX: Kein HospitalService mehr
    }
    
    /**
     * Startet Einsatz-Timer wenn Fahrzeug Status 4 erreicht
     */
    startMission(vehicleId, incident, assignedVehicles) {
        if (this.activeMissions.has(incident.id)) {
            console.log(`⏱️ Einsatz ${incident.id} bereits aktiv`);
            return;
        }
        
        // Berechne tatsächliche Einsatzdauer
        const duration = this.calculateMissionDuration(incident, assignedVehicles);
        
        const mission = {
            incidentId: incident.id,
            incident: incident,
            vehicleIds: assignedVehicles.map(v => v.id),
            startTime: Date.now(),
            plannedDuration: duration * 60 * 1000, // Minuten zu Millisekunden
            actualDuration: 0,
            status: 'active'
        };
        
        this.activeMissions.set(incident.id, mission);
        
        console.log(`⏱️ Einsatz ${incident.id} gestartet: ${duration} Minuten geplant`);
        console.log(`   Fahrzeuge: ${assignedVehicles.map(v => v.name).join(', ')}`);
        
        // Setze Timer für automatischen Abschluss
        setTimeout(() => {
            this.completeMission(incident.id);
        }, mission.plannedDuration);
    }
    
    /**
     * Berechnet Einsatzdauer basierend auf Einsatz UND verfügbaren Fahrzeugen
     */
    calculateMissionDuration(incident, assignedVehicles) {
        let baseDuration = incident.einsatzdauer_minuten || 25;
        
        // Faktor 1: Benötigte vs. vorhandene Fahrzeuge
        const required = incident.benoetigte_fahrzeuge || {};
        const assigned = this.countVehiclesByType(assignedVehicles);
        
        let vehicleDeficitMultiplier = 1.0;
        
        // Prüfe RTW
        if (required.RTW && assigned.RTW < required.RTW) {
            const deficit = required.RTW - assigned.RTW;
            vehicleDeficitMultiplier += deficit * 0.4; // +40% pro fehlendem RTW
            console.log(`⚠️ ${deficit} RTW fehlt → +${deficit * 40}% Zeit`);
        }
        
        // Prüfe NEF
        if (required.NEF && assigned.NEF < required.NEF) {
            vehicleDeficitMultiplier += 0.5; // +50% wenn NEF fehlt
            console.log('⚠️ NEF fehlt → +50% Zeit');
        }
        
        // Faktor 2: Schweregrad
        const severityMultipliers = {
            'leicht': 0.8,
            'mittel': 1.0,
            'schwer': 1.3,
            'lebensbedrohlich': 1.5
        };
        const severityMultiplier = severityMultipliers[incident.schweregrad] || 1.0;
        
        // Faktor 3: Anzahl Patienten
        const patientMultiplier = 1 + ((incident.anzahl_patienten - 1) * 0.25); // +25% pro zusätzlichem Patient
        
        // Faktor 4: Besonderheiten
        let specialMultiplier = 1.0;
        if (incident.besonderheiten) {
            const lower = incident.besonderheiten.toLowerCase();
            if (lower.includes('reanimation') || lower.includes('eingeklemmt')) {
                specialMultiplier = 1.5;
            } else if (lower.includes('schwierig') || lower.includes('bergung')) {
                specialMultiplier = 1.3;
            }
        }
        
        // Berechne finale Dauer
        const finalDuration = Math.round(
            baseDuration * 
            vehicleDeficitMultiplier * 
            severityMultiplier * 
            patientMultiplier * 
            specialMultiplier
        );
        
        console.log(`📈 Dauer-Berechnung:`);
        console.log(`   Basis: ${baseDuration} Min`);
        console.log(`   Fahrzeug-Defizit: x${vehicleDeficitMultiplier.toFixed(2)}`);
        console.log(`   Schweregrad: x${severityMultiplier.toFixed(2)}`);
        console.log(`   Patienten: x${patientMultiplier.toFixed(2)}`);
        console.log(`   Besonderheiten: x${specialMultiplier.toFixed(2)}`);
        console.log(`   → Final: ${finalDuration} Min`);
        
        return Math.max(10, Math.min(finalDuration, 180)); // Min 10, Max 180 Minuten
    }
    
    /**
     * Zählt Fahrzeuge nach Typ
     */
    countVehiclesByType(vehicles) {
        const counts = { RTW: 0, NEF: 0, KTW: 0, Kdow: 0 };
        vehicles.forEach(v => {
            if (counts.hasOwnProperty(v.type)) {
                counts[v.type]++;
            }
        });
        return counts;
    }
    
    /**
     * Schließt Einsatz ab und startet Transport falls nötig
     */
    completeMission(incidentId) {
        const mission = this.activeMissions.get(incidentId);
        if (!mission) {
            console.log(`⚠️ Einsatz ${incidentId} nicht gefunden`);
            return;
        }
        
        const incident = mission.incident;
        
        console.log(`✅ Einsatz ${incidentId} abgeschlossen`);
        
        // Entscheide: Transport oder direkt Status 1?
        if (incident.transport_notwendig && incident.zielkrankenhaus) {
            // ✅ FIX: Hole Hospital-Daten direkt aus HOSPITALS
            const hospital = this.getHospitalData(incident.zielkrankenhaus);
            if (hospital) {
                console.log(`🏥 Transport notwendig → ${hospital.shortName}`);
                this.startTransport(mission, hospital);
            } else {
                console.warn(`⚠️ Krankenhaus nicht gefunden: ${incident.zielkrankenhaus}`);
                this.returnToStation(mission);
            }
        } else {
            console.log('🔙 Kein Transport nötig → zurück zur Wache');
            this.returnToStation(mission);
        }
        
        // Markiere Einsatz als abgeschlossen
        incident.completed = true;
        incident.endTime = Date.now();
        
        this.activeMissions.delete(incidentId);
    }
    
    /**
     * ✅ FIX: Hole Krankenhaus-Daten aus window.HOSPITALS
     */
    getHospitalData(hospitalNameOrId) {
        if (!window.HOSPITALS) {
            console.error('❌ HOSPITALS Datenbank nicht geladen!');
            return null;
        }
        
        // Versuche nach ID
        let hospital = window.HOSPITALS.findById(hospitalNameOrId);
        if (hospital) return hospital;
        
        // Versuche nach Name
        hospital = window.HOSPITALS.findByName(hospitalNameOrId);
        if (hospital) return hospital;
        
        // Fallback: Erstes Krankenhaus
        console.warn(`⚠️ Krankenhaus '${hospitalNameOrId}' nicht gefunden, nutze Fallback`);
        return window.HOSPITALS[0];
    }
    
    /**
     * Startet Transport zum Krankenhaus
     */
    startTransport(mission, hospital) {
        // Finde RTW und NEF
        const rtws = mission.vehicleIds
            .map(id => window.GAME_DATA?.vehicles?.find(v => v.id === id))
            .filter(v => v && v.type === 'RTW');
        
        const nefs = mission.vehicleIds
            .map(id => window.GAME_DATA?.vehicles?.find(v => v.id === id))
            .filter(v => v && v.type === 'NEF');
        
        if (rtws.length === 0) {
            console.warn('⚠️ Kein RTW für Transport verfügbar');
            this.returnToStation(mission);
            return;
        }
        
        // RTW transportiert
        const rtw = rtws[0];
        console.log(`🚑 ${rtw.name} transportiert nach ${hospital.name}`);
        
        if (window.vehicleMovement) {
            // RTW: Status 7 (Patient aufgenommen) und zum Krankenhaus
            window.vehicleMovement.updateVehicleStatus(rtw.id, 7);
            window.vehicleMovement.moveVehicleToPosition(
                rtw.id,
                hospital.location, // ✅ FIX: Nutze hospital.location statt hospital.position
                () => {
                    console.log(`🏥 ${rtw.name} am Krankenhaus angekommen`);
                    window.vehicleMovement.updateVehicleStatus(rtw.id, 8);
                    
                    // Patient übergeben, zurück zur Wache
                    setTimeout(() => {
                        console.log(`✅ ${rtw.name} Patient übergeben`);
                        window.vehicleMovement.updateVehicleStatus(rtw.id, 1);
                        window.vehicleMovement.returnToBase(rtw.id);
                    }, 3 * 60 * 1000);
                }
            );
            
            // NEF begleitet bis Krankenhaus, dann zurück
            nefs.forEach(nef => {
                console.log(`🚑 ${nef.name} begleitet zum Krankenhaus`);
                window.vehicleMovement.updateVehicleStatus(nef.id, 7);
                window.vehicleMovement.moveVehicleToPosition(
                    nef.id,
                    hospital.location, // ✅ FIX: Nutze hospital.location
                    () => {
                        console.log(`🏥 ${nef.name} am Krankenhaus, fährt zurück`);
                        window.vehicleMovement.updateVehicleStatus(nef.id, 1);
                        window.vehicleMovement.returnToBase(nef.id);
                    }
                );
            });
            
            // Alle anderen Fahrzeuge (KTW, Kdow etc.) direkt zurück
            mission.vehicleIds.forEach(vehicleId => {
                const vehicle = window.GAME_DATA?.vehicles?.find(v => v.id === vehicleId);
                if (vehicle && vehicle.type !== 'RTW' && vehicle.type !== 'NEF') {
                    console.log(`🔙 ${vehicle.name} fährt zurück zur Wache`);
                    window.vehicleMovement.updateVehicleStatus(vehicle.id, 1);
                    window.vehicleMovement.returnToBase(vehicle.id);
                }
            });
        }
    }
    
    /**
     * Schickt alle Fahrzeuge zurück zur Wache
     */
    returnToStation(mission) {
        mission.vehicleIds.forEach(vehicleId => {
            const vehicle = window.GAME_DATA?.vehicles?.find(v => v.id === vehicleId);
            if (vehicle && window.vehicleMovement) {
                console.log(`🔙 ${vehicle.name} fährt zurück zur Wache`);
                window.vehicleMovement.updateVehicleStatus(vehicle.id, 1);
                window.vehicleMovement.returnToBase(vehicle.id);
            }
        });
    }
    
    /**
     * Gibt verbleibende Zeit für Einsatz zurück
     */
    getRemainingTime(incidentId) {
        const mission = this.activeMissions.get(incidentId);
        if (!mission) return null;
        
        const elapsed = Date.now() - mission.startTime;
        const remaining = mission.plannedDuration - elapsed;
        
        return Math.max(0, Math.ceil(remaining / 60000)); // In Minuten
    }
    
    /**
     * Gibt alle aktiven Einsätze zurück
     */
    getActiveMissions() {
        return Array.from(this.activeMissions.values());
    }
    
    /**
     * Bricht Einsatz ab (manuell)
     */
    cancelMission(incidentId) {
        const mission = this.activeMissions.get(incidentId);
        if (mission) {
            console.log(`❌ Einsatz ${incidentId} manuell abgebrochen`);
            this.returnToStation(mission);
            this.activeMissions.delete(incidentId);
        }
    }
}

// Globale Instanz
window.MissionTimer = MissionTimer;

console.log('⏱️ Mission Timer v1.0.1 geladen - ✅ HospitalService Fix!');
