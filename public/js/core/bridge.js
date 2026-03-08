// =========================
// INTEGRATION BRIDGE
// Verbindet alte & neue Systeme nahtlos
// =========================

/**
 * Bridge zwischen CallSystem und bestehendem Game
 */
const SystemBridge = {

    /**
     * Initialisiert Bridge
     */
    initialize() {
        console.log('🌉 System Bridge initialisiert');
        
        // Warte bis Game geladen ist
        this.waitForGame();
        
        // Initialisiere neue Systeme
        this.initNewSystems();
        
        // Verbinde alte Funktionen mit neuen
        this.setupLegacyAdapters();
    },

    /**
     * Wartet auf Game-Objekt
     */
    waitForGame() {
        if (typeof game !== 'undefined' && game) {
            console.log('✅ Game gefunden, initialisiere VehicleAnalyzer');
            
            // VehicleAnalyzer mit echten Daten initialisieren
            if (typeof VehicleAnalyzer !== 'undefined') {
                // Warte kurz bis VEHICLES geladen ist
                setTimeout(() => {
                    if (typeof VEHICLES !== 'undefined') {
                        VehicleAnalyzer.initialize();
                    }
                }, 500);
            }
        } else {
            setTimeout(() => this.waitForGame(), 100);
        }
    },

    /**
     * Initialisiert neue Systeme
     */
    initNewSystems() {
        // Alle neuen Systeme sind bereits auto-initialized
        // Hier nur Verknüpfungen herstellen
        
        console.log('🔗 Verknüpfe Systeme...');
    },

    /**
     * Legacy-Adapter für alte Funktionen
     */
    setupLegacyAdapters() {
        // CallSystem Integration
        window.oldShowIncomingCallNotification = window.showIncomingCallNotification;
        
        window.showIncomingCallNotification = (incident) => {
            console.log('📞 Legacy Call abgefangen, leite zu CallSystem');
            
            // Konvertiere altes Format zu neuem
            if (typeof CallSystem !== 'undefined') {
                // Erstelle Call-Objekt im neuen Format
                const callData = this.convertLegacyIncident(incident);
                CallSystem.activeCall = callData;
                CallSystem.showIncomingCall(callData);
                CallSystem.startRinging();
            } else {
                // Fallback zur alten Methode
                if (window.oldShowIncomingCallNotification) {
                    window.oldShowIncomingCallNotification(incident);
                }
            }
        };

        // Funk-Integration
        window.oldAddRadioMessage = window.addRadioMessage;
        
        window.addRadioMessage = (sender, message) => {
            // Alte Funktion aufrufen
            if (window.oldAddRadioMessage) {
                window.oldAddRadioMessage(sender, message);
            }
            
            // Zusätzlich: Notifications für wichtige Meldungen
            if (typeof NotificationSystem !== 'undefined') {
                if (sender === 'System' || message.includes('Notruf')) {
                    // Nur wichtige System-Meldungen als Notification
                    // (nicht alles, sonst zu viel)
                }
            }
        };

        console.log('✅ Legacy-Adapter eingerichtet');
    },

    /**
     * Konvertiert altes Incident-Format zu neuem Call-Format
     */
    convertLegacyIncident(incident) {
        return {
            anrufer: {
                typ: 'augenzeuge',
                name: 'Anrufer',
                telefon: '0151-12345678',
                emotion: 'aufgeregt'
            },
            initial_meldung: incident.initialMessage || 'Es ist ein Notfall!',
            antworten: {
                wo: incident.actualLocation || incident.location || 'Unbekannt',
                was_passiert: incident.description || incident.fullDetails?.description || 'Notfall',
                verletzte: '1 Person',
                zustand: incident.fullDetails?.conscious ? 'Bei Bewusstsein' : 'Bewusstlos',
                gefahren: 'Keine besonderen Gefahren'
            },
            einsatz: {
                kategorie: this.guessCategory(incident.keyword),
                stichwort_vorschlag: incident.keyword,
                ort: incident.actualLocation || incident.location || 'Unbekannt',
                koordinaten: {
                    lat: incident.position ? incident.position[0] : 48.83,
                    lon: incident.position ? incident.position[1] : 9.32
                },
                meldebild: incident.description || 'Notfall',
                besonderheiten: '',
                verletzte: {
                    gesamt: 1,
                    schwer: 0,
                    leicht: 1
                }
            },
            fahrzeuge: {
                pflicht: this.guessRequiredVehicles(incident.keyword),
                optional: []
            }
        };
    },

    /**
     * Rät Kategorie basierend auf Keyword
     */
    guessCategory(keyword) {
        if (!keyword) return 'sonstige';
        
        if (keyword.includes('RD')) return 'herz_kreislauf';
        if (keyword.includes('VU')) return 'unfaelle';
        if (keyword.includes('THL')) return 'sonstige';
        if (keyword.includes('Brand')) return 'sonstige';
        
        return 'sonstige';
    },

    /**
     * Rät benötigte Fahrzeuge
     */
    guessRequiredVehicles(keyword) {
        const vehicles = [];
        
        if (keyword?.includes('RD 1')) {
            vehicles.push({ typ: 'RTW', grund: 'Rettungsdienstlicher Notfall' });
        } else if (keyword?.includes('RD 2') || keyword?.includes('RD 3')) {
            vehicles.push({ typ: 'RTW', grund: 'Rettungsdienstlicher Notfall' });
            vehicles.push({ typ: 'NEF', grund: 'Notarzt erforderlich' });
        } else if (keyword?.includes('VU')) {
            vehicles.push({ typ: 'RTW', grund: 'Verkehrsunfall' });
        } else {
            vehicles.push({ typ: 'RTW', grund: 'Notfall' });
        }
        
        return vehicles;
    },

    /**
     * Erstellt Incident aus neuem Call-Format
     */
    createIncidentFromCall(callData, incidentData) {
        // Incident im alten Format erstellen
        const incident = {
            id: incidentData.id || incidentData.nummer,
            nummer: incidentData.nummer,
            keyword: incidentData.stichwort,
            stichwort: incidentData.stichwort,
            location: incidentData.ort,
            actualLocation: incidentData.ort,
            position: [incidentData.koordinaten.lat, incidentData.koordinaten.lon],
            koordinaten: incidentData.koordinaten,
            description: incidentData.meldebild,
            meldebild: incidentData.meldebild,
            besonderheiten: incidentData.besonderheiten,
            status: 'new',
            assignedVehicles: [],
            validation: null,
            verletzte: incidentData.verletzte,
            melder: incidentData.melder,
            timestamp: incidentData.zeitstempel,
            erstelltAm: incidentData.erstelltAm
        };

        // Zum Game hinzufügen
        if (game && game.incidents) {
            game.incidents.push(incident);
            console.log('✅ Incident zu Game hinzugefügt:', incident.nummer);
        }

        // Update UI
        if (typeof updateIncidentList === 'function') {
            updateIncidentList();
        }
        if (typeof updateMap === 'function') {
            updateMap();
        }

        return incident;
    },

    /**
     * Alarmierung mit Validierung
     */
    async dispatchWithValidation(incident, vehicles) {
        console.log('🚨 Alarmiere Fahrzeuge mit Validierung...');
        
        // Fahrzeuge alarmieren (alte Methode)
        vehicles.forEach(vehicle => {
            if (game && typeof game.dispatchVehicle === 'function') {
                game.dispatchVehicle(vehicle.id, incident.id);
            }
        });

        // Validierung durchführen
        if (typeof GroqValidator !== 'undefined') {
            const validation = await GroqValidator.validateAssignment(incident, vehicles);
            incident.validation = validation;
        }
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Warte kurz bis alles geladen ist
        setTimeout(() => {
            SystemBridge.initialize();
        }, 1000);
    });
}

// Globale Helper-Funktionen
window.SystemBridge = SystemBridge;