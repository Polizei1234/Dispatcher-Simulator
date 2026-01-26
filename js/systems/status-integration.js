// =========================
// STATUS INTEGRATION v1.0
// Verbindet Unified Status System mit Fahrzeugbewegungen
// Ersetzt alte Status-Systeme (status-0-5-system.js)
// =========================

/**
 * Initialisiert Status-Integration
 */
function initStatusIntegration() {
    if (!window.unifiedStatusSystem) {
        console.error('❌ Unified Status System nicht gefunden!');
        return;
    }

    console.log('🔗 Status-Integration wird initialisiert...');

    // Hook in Vehicle Movement System
    hookVehicleMovement();

    // Hook in Incident Assignment
    hookIncidentAssignment();

    // Zufällige Status 5 Anfragen
    startRandomStatus5Generator();

    console.log('✅ Status-Integration aktiv');
}

/**
 * Verbindet mit Fahrzeugbewegung für automatische Statuswechsel
 */
function hookVehicleMovement() {
    // Überwache Fahrzeugstatus-Änderungen
    if (!game || !game.vehicles) return;

    // Original-Funktionen erweitern
    const originalDispatchVehicle = window.dispatchVehicleToIncident;
    if (originalDispatchVehicle) {
        window.dispatchVehicleToIncident = function(vehicleId, incidentId) {
            // Original-Funktion ausführen
            const result = originalDispatchVehicle.call(this, vehicleId, incidentId);

            // Status-Änderungen auslösen
            const incident = game.incidents.find(i => i.id === incidentId);
            if (incident) {
                // Status 2→3: Einsatz übernommen
                unifiedStatusSystem.onIncidentAssigned(vehicleId, incident);

                // Status 3→4: Anfahrt (nach 500ms)
                setTimeout(() => {
                    unifiedStatusSystem.onDepartingToIncident(vehicleId, incident);
                }, 500);
            }

            return result;
        };
    }

    // Fahrzeug erreicht Einsatzstelle
    const originalArriveAtScene = window.onVehicleArrivedAtScene;
    if (originalArriveAtScene) {
        window.onVehicleArrivedAtScene = function(vehicleId) {
            // Status 4→6: Vor Ort
            unifiedStatusSystem.onArrivedAtScene(vehicleId);

            // Original-Funktion ausführen
            return originalArriveAtScene.call(this, vehicleId);
        };
    }

    // Patient aufgenommen
    const originalLoadPatient = window.onPatientLoaded;
    if (originalLoadPatient) {
        window.onPatientLoaded = function(vehicleId) {
            // Status 6→7: Patient an Bord
            unifiedStatusSystem.onPatientLoaded(vehicleId);

            // Original-Funktion ausführen
            return originalLoadPatient.call(this, vehicleId);
        };
    }

    // Anfahrt Krankenhaus
    const originalDepartToHospital = window.onVehicleDepartToHospital;
    if (originalDepartToHospital) {
        window.onVehicleDepartToHospital = function(vehicleId, hospital) {
            // Status 7→8: Transport
            unifiedStatusSystem.onDepartingToHospital(vehicleId, hospital);

            // Original-Funktion ausführen
            return originalDepartToHospital.call(this, vehicleId, hospital);
        };
    }

    // Zurück zur Wache
    const originalReturnToStation = window.onVehicleReturnedToStation;
    if (originalReturnToStation) {
        window.onVehicleReturnedToStation = function(vehicleId) {
            // Status 8→2: Einsatzbereit auf Wache
            unifiedStatusSystem.onReturnedToStation(vehicleId);

            // Original-Funktion ausführen
            return originalReturnToStation.call(this, vehicleId);
        };
    }

    console.log('✅ Vehicle Movement Hooks installiert');
}

/**
 * Verbindet mit Incident Assignment
 */
function hookIncidentAssignment() {
    // Wenn Fahrzeug Einsatz zugewiesen bekommt, setze Status 3
    const originalAssignVehicle = window.assignVehicleToIncident;
    if (originalAssignVehicle) {
        window.assignVehicleToIncident = function(vehicleId, incidentId) {
            const result = originalAssignVehicle.call(this, vehicleId, incidentId);

            const incident = game.incidents.find(i => i.id === incidentId);
            if (incident) {
                unifiedStatusSystem.onIncidentAssigned(vehicleId, incident);
            }

            return result;
        };
    }

    console.log('✅ Incident Assignment Hooks installiert');
}

/**
 * Startet Generator für zufällige Status 5 Anfragen
 */
function startRandomStatus5Generator() {
    setInterval(() => {
        if (!game || !game.vehicles || !game.isPaused) return;

        // Prüfe jedes Fahrzeug
        for (const vehicle of game.vehicles) {
            // Nur aktive Fahrzeuge (nicht auf Wache)
            if (vehicle.currentStatus < 3) continue;

            // Zufällige Chance: 2% pro Check
            if (Math.random() > 0.02) continue;

            // Nicht wenn bereits auf Sprechfreigabe wartet
            if (unifiedStatusSystem.isWaitingForPermission(vehicle.id)) continue;

            // Sende Status 5
            unifiedStatusSystem.triggerRandomStatus5(vehicle.id);

            console.log(`📡 Zufälliger Status 5 ausgelöst: ${vehicle.callsign}`);
        }
    }, 30000); // Alle 30 Sekunden prüfen

    console.log('✅ Random Status 5 Generator gestartet (alle 30s)');
}

/**
 * MANUELLE TRIGGER-FUNKTIONEN für UI/Events
 */

/**
 * Löst manuell Status 5 (Sprechwunsch) aus
 * @param {string} vehicleId - Fahrzeug-ID
 */
function triggerManualStatus5(vehicleId) {
    if (!unifiedStatusSystem) {
        console.error('❌ Unified Status System nicht verfügbar');
        return;
    }

    unifiedStatusSystem.sendStatus5Request(vehicleId);
    console.log(`📞 Manueller Status 5 ausgelöst: ${vehicleId}`);
}

/**
 * Löst Status 0 (NOTFALL BESATZUNG) aus - NUR in echten Notfällen!
 * @param {string} vehicleId - Fahrzeug-ID
 * @param {string} reason - Grund für Notfall
 */
function triggerEmergencyStatus0(vehicleId, reason = 'Notlage der Besatzung!') {
    if (!unifiedStatusSystem) {
        console.error('❌ Unified Status System nicht verfügbar');
        return;
    }

    // WARNUNG: Nur für echte Notfälle!
    console.warn(`🚨 NOTFALL STATUS 0 AUSGELÖST: ${vehicleId}`);
    unifiedStatusSystem.sendStatus0Emergency(vehicleId, reason);
}

/**
 * Manueller Statuswechsel für Debug/Admin
 * @param {string} vehicleId - Fahrzeug-ID
 * @param {number} newStatus - Neuer Status (1-8, C)
 */
function forceStatusChange(vehicleId, newStatus) {
    if (!unifiedStatusSystem) {
        console.error('❌ Unified Status System nicht verfügbar');
        return;
    }

    unifiedStatusSystem.changeVehicleStatus(vehicleId, newStatus, 'Manuell gesetzt');
    console.log(`🔧 Manueller Statuswechsel: ${vehicleId} → ${newStatus}`);
}

/**
 * COMPATIBILITY LAYER für altes System
 */

// Alte status-0-5-system.js Funktionen ersetzen
if (window.status05System) {
    console.warn('⚠️ Altes status-0-5-system.js erkannt - wird durch Unified System ersetzt');
    
    // Alte Funktionen auf neue umleiten
    window.status05System.sendStatusRequest = function(vehicleId, type) {
        console.warn('⚠️ Deprecated: Nutze unifiedStatusSystem.sendStatus5Request()');
        triggerManualStatus5(vehicleId);
    };

    window.status05System.initiateVehicleRequest = function(vehicleId) {
        console.warn('⚠️ Deprecated: Nutze unifiedStatusSystem.sendStatus5Request()');
        triggerManualStatus5(vehicleId);
    };
}

// Alte radio-system.js Status-Updates ersetzen
if (window.radioSystem && window.radioSystem.sendAutoStatusUpdate) {
    const originalAutoUpdate = window.radioSystem.sendAutoStatusUpdate;
    window.radioSystem.sendAutoStatusUpdate = function(vehicle, newStatus, incident) {
        // Nutze neues System stattdessen
        if (unifiedStatusSystem) {
            unifiedStatusSystem.changeVehicleStatus(
                vehicle.id, 
                newStatus, 
                incident ? incident.location : ''
            );
        } else {
            // Fallback auf altes System
            originalAutoUpdate.call(this, vehicle, newStatus, incident);
        }
    };

    console.log('✅ Radio System Compatibility Layer aktiv');
}

/**
 * VEHICLE MOVEMENT EVENT LISTENERS
 * Falls keine Original-Funktionen existieren, erstelle Event-Listener
 */
function setupFallbackEventListeners() {
    if (!game || !game.eventBus) {
        console.warn('⚠️ Game EventBus nicht gefunden - Fallback Event-Listener werden genutzt');
        return;
    }

    // Einsatz zugewiesen
    game.eventBus.on('incident:assigned', (data) => {
        const { vehicleId, incident } = data;
        unifiedStatusSystem.onIncidentAssigned(vehicleId, incident);
    });

    // Anfahrt gestartet
    game.eventBus.on('vehicle:departing', (data) => {
        const { vehicleId, incident } = data;
        unifiedStatusSystem.onDepartingToIncident(vehicleId, incident);
    });

    // Einsatzstelle erreicht
    game.eventBus.on('vehicle:arrived:scene', (data) => {
        const { vehicleId } = data;
        unifiedStatusSystem.onArrivedAtScene(vehicleId);
    });

    // Patient geladen
    game.eventBus.on('vehicle:patient:loaded', (data) => {
        const { vehicleId } = data;
        unifiedStatusSystem.onPatientLoaded(vehicleId);
    });

    // Transport gestartet
    game.eventBus.on('vehicle:departing:hospital', (data) => {
        const { vehicleId, hospital } = data;
        unifiedStatusSystem.onDepartingToHospital(vehicleId, hospital);
    });

    // Zurück zur Wache
    game.eventBus.on('vehicle:returned:station', (data) => {
        const { vehicleId } = data;
        unifiedStatusSystem.onReturnedToStation(vehicleId);
    });

    console.log('✅ Fallback Event-Listener eingerichtet');
}

/**
 * Cleanup beim Beenden
 */
function cleanupStatusIntegration() {
    if (window.unifiedStatusSystem) {
        window.unifiedStatusSystem.cleanup();
    }
    console.log('🧹 Status Integration cleanup');
}

// Auto-Initialisierung
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initStatusIntegration();
        setupFallbackEventListeners();
    });
} else {
    initStatusIntegration();
    setupFallbackEventListeners();
}

// Cleanup bei Seitenwechsel
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanupStatusIntegration);

    // Globale Funktionen
    window.triggerManualStatus5 = triggerManualStatus5;
    window.triggerEmergencyStatus0 = triggerEmergencyStatus0;
    window.forceStatusChange = forceStatusChange;
}

console.log('✅ Status Integration v1.0 geladen');
console.log('✅ Ersetzt altes status-0-5-system.js');
console.log('✅ Automatische Status-Workflows aktiv');