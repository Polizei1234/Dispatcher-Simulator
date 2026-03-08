// =========================================================================================
// CALL TEMPLATES - GLOBALE KONFIGURATION
// Alle globalen Systeme, Generatoren und Wahrscheinlichkeiten
// =========================================================================================

export const GLOBAL_CONFIG = {
    
    // ========================================
    // 🗺️ REMS-MURR-KREIS BOUNDARIES
    // ========================================
    boundaries: {
        bbox: {
            north: 49.05,
            south: 48.75,
            west: 9.15,
            east: 9.60
        },
        center: {
            lat: 48.9,
            lon: 9.375
        }
    },
    
    // ========================================
    // 👤 NAMEN-GENERATOR
    // ========================================
    names: {
        male: {
            first: [
                'Thomas', 'Michael', 'Andreas', 'Peter', 'Wolfgang', 'Klaus', 'Jürgen', 'Dieter',
                'Uwe', 'Frank', 'Bernd', 'Hans', 'Ralf', 'Markus', 'Stefan', 'Christian',
                'Oliver', 'Daniel', 'Sebastian', 'Alexander', 'Matthias', 'Martin', 'Tobias',
                'Jan', 'Tim', 'Max', 'Felix', 'Lukas', 'Leon', 'Noah', 'Elias'
            ],
            last: [
                'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner',
                'Becker', 'Schulz', 'Hoffmann', 'Koch', 'Bauer', 'Richter', 'Klein',
                'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Krüger',
                'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmid', 'Winkler',
                'König', 'Walter', 'Maier', 'Huber', 'Kaiser'
            ]
        },
        female: {
            first: [
                'Maria', 'Anna', 'Elisabeth', 'Petra', 'Sabine', 'Monika', 'Gabriele', 'Andrea',
                'Ursula', 'Karin', 'Martina', 'Barbara', 'Claudia', 'Susanne', 'Birgit',
                'Julia', 'Sarah', 'Laura', 'Lisa', 'Katharina', 'Nicole', 'Sandra', 'Melanie',
                'Jennifer', 'Christina', 'Stefanie', 'Daniela', 'Anna', 'Sophie', 'Emma',
                'Mia', 'Hannah', 'Lena', 'Lea'
            ],
            last: [] // Nutzt männliche Nachnamen
        }
    },
    
    // ========================================
    // 📞 TELEFONNUMMERN-GENERATOR
    // ========================================
    phoneNumbers: {
        mobile: {
            prefixes: ['0151', '0152', '0157', '0159', '0160', '0170', '0171', '0172', '0173', '0174', '0175', '0176', '0177', '0178', '0179'],
            format: '{prefix} {4digits}'
        },
        landline: {
            prefixes: {
                waiblingen: '07151',
                winnenden: '07195',
                backnang: '07191',
                schorndorf: '07181',
                fellbach: '0711',
                weinstadt: '07151'
            },
            format: '{prefix} {6digits}'
        }
    },
    
    // ========================================
    // 🌤️ WETTER-SYSTEM (Feature 1)
    // ========================================
    weather: {
        // Aktuelle Wetterbedingungen mit Wahrscheinlichkeiten
        conditions: {
            normal: {
                probability: 0.7,
                effects: {}
            },
            hitze: {
                probability: 0.05, // Nur Sommer
                season_multiplier: { summer: 3.0, rest: 0.0 },
                temp_threshold: 30,
                effects: {
                    kreislauf_kollaps: 1.4,  // +40%
                    dehydrierung: 1.6,       // +60%
                    alte_menschen: 1.3       // +30%
                }
            },
            regen: {
                probability: 0.15,
                effects: {
                    rutschgefahr: 0.3,
                    längere_anfahrt: 0.2,
                    sturz_wahrscheinlich: 1.2
                }
            },
            schnee: {
                probability: 0.05,
                season_multiplier: { winter: 4.0, rest: 0.0 },
                effects: {
                    erschwerte_zufahrt: 0.6,
                    längere_anfahrt: 0.4,
                    sturz_wahrscheinlich: 1.5
                }
            },
            gewitter: {
                probability: 0.03,
                effects: {
                    stromschlag: 3.0,        // +200%
                    baum_sturz: 2.5,         // +150%
                    panik: 1.2               // +20%
                }
            },
            nebel: {
                probability: 0.05,
                effects: {
                    längere_anfahrt: 0.3,
                    verkehrsunfall: 1.3
                }
            }
        }
    },
    
    // ========================================
    // ⏰ ZEIT-SYSTEM
    // ========================================
    temporal: {
        // Tageszeiten
        dayPeriods: {
            nacht: {
                hours: [22, 23, 0, 1, 2, 3, 4, 5],
                einsatz_multiplier: 0.3,  // 30% weniger Einsätze
                effects: {
                    anrufer_verschlafen: 0.3,
                    dunkle_beleuchtung: 0.6,
                    nachbarn_stören: 0.4
                }
            },
            morgen: {
                hours: [6, 7, 8, 9],
                einsatz_multiplier: 1.0,
                effects: {
                    rush_hour: 0.7,
                    längere_anfahrt: 0.4
                }
            },
            vormittag: {
                hours: [10, 11, 12],
                einsatz_multiplier: 0.8
            },
            nachmittag: {
                hours: [13, 14, 15],
                einsatz_multiplier: 0.9
            },
            rush_hour_abend: {
                hours: [16, 17, 18, 19],
                einsatz_multiplier: 1.2,
                effects: {
                    verkehrsbehinderung: 0.7,
                    längere_anfahrt: 0.5
                }
            },
            abend: {
                hours: [20, 21],
                einsatz_multiplier: 0.7
            }
        },
        
        // Wochentage (Feature 31)
        weekdays: {
            weekday: {
                days: [1, 2, 3, 4, 5],
                einsatz_multiplier: 1.0,
                effects: {
                    arbeitsunfälle: 1.5
                }
            },
            wochenende: {
                days: [6, 0],
                einsatz_multiplier: 1.1,
                effects: {
                    sport_unfälle: 1.2,
                    alkohol_beteiligung: 1.3,
                    freizeitunfälle: 1.4
                }
            },
            feiertag: {
                special: true,
                einsatz_multiplier: 0.7,
                effects: {
                    hausarzt_nicht_erreichbar: 1.0,
                    verzögerte_hilfe: 0.4,
                    familienfeiern: 1.3
                }
            }
        },
        
        // Jahreszeiten (Feature 31)
        seasons: {
            winter: { months: [12, 1, 2] },
            frühling: { months: [3, 4, 5] },
            sommer: { months: [6, 7, 8] },
            herbst: { months: [9, 10, 11] }
        }
    },
    
    // ========================================
    // 🎭 SPECIAL EVENTS (Feature 30, 32)
    // ========================================
    specialEvents: {
        // Jährliche Events
        silvester: {
            date: '31.12',
            time_range: [18, 6],
            effects: {
                verbrennungen: 5.0,
                alkohol: 3.0,
                einsätze: 4.0
            }
        },
        weihnachten: {
            dates: ['24.12', '25.12', '26.12'],
            effects: {
                familienstreit: 2.0,
                einsamkeit: 1.5,
                herzinfarkt: 1.3
            }
        },
        
        // Regionale Events (Rems-Murr spezifisch)
        backnanger_strassenfest: {
            month: 6,
            duration_days: 3,
            effects: {
                alkohol: 2.5,
                schlägereien: 2.0,
                einsätze: 2.0
            }
        },
        waiblingen_altstadtfest: {
            month: 9,
            duration_days: 2,
            effects: {
                alkohol: 2.0,
                menschenmassen: 1.5
            }
        }
    },
    
    // ========================================
    // 🏥 KLINIKEN (Feature 53)
    // ========================================
    hospitals: {
        rems_murr_klinikum_winnenden: {
            name: 'Rems-Murr-Klinikum Winnenden',
            location: { lat: 48.8748, lon: 9.3997 },
            address: 'Am Jakobsweg 1, 71364 Winnenden',
            
            // Fachausrichtungen
            specializations: {
                notaufnahme: { available: true, capacity_max: 10 },
                stroke_unit: { available: true, capacity_max: 6 },
                herzkatheterlabor: { available: true, h24: true },
                chirurgie: { available: true, trauma_level: 2 },
                innere_medizin: { available: true },
                neurologie: { available: true },
                kinderklinik: { available: false }, // Nur Schorndorf!
                geburtshilfe: { available: true }
            },
            
            // Dynamische Kapazität (wird im Spiel berechnet)
            capacity: {
                current: 'DYNAMIC', // 0-10
                updates_every: 1800 // 30 Min
            },
            
            transport_times: {
                waiblingen: 8,
                winnenden: 3,
                backnang: 15,
                schorndorf: 12,
                fellbach: 12
            }
        },
        
        rems_murr_klinikum_schorndorf: {
            name: 'Rems-Murr-Klinikum Schorndorf',
            location: { lat: 48.8042, lon: 9.5286 },
            address: 'Schlichtener Str. 90, 73614 Schorndorf',
            
            specializations: {
                notaufnahme: { available: true, capacity_max: 8 },
                stroke_unit: { available: false }, // Nur Winnenden
                herzkatheterlabor: { available: false },
                chirurgie: { available: true, trauma_level: 2 },
                innere_medizin: { available: true },
                neurologie: { available: false },
                kinderklinik: { available: true }, // NUR hier!
                geburtshilfe: { available: true }
            },
            
            capacity: {
                current: 'DYNAMIC',
                updates_every: 1800
            },
            
            transport_times: {
                waiblingen: 12,
                winnenden: 10,
                backnang: 20,
                schorndorf: 3,
                fellbach: 18
            }
        },
        
        klinikum_ludwigsburg: {
            name: 'Klinikum Ludwigsburg',
            location: { lat: 48.8974, lon: 9.1913 },
            address: 'Posilipostraße 4, 71640 ludwigsburg',
            
            // Maximalversorger außerhalb RMK
            specializations: {
                notaufnahme: { available: true, capacity_max: 15 },
                stroke_unit: { available: true, capacity_max: 8 },
                herzkatheterlabor: { available: true, h24: true },
                chirurgie: { available: true, trauma_level: 1 }, // Überregional
                innere_medizin: { available: true },
                neurologie: { available: true },
                kinderklinik: { available: true },
                geburtshilfe: { available: true },
                schwerbrandverletzte: { available: true } // Spezialabteilung
            },
            
            capacity: {
                current: 'DYNAMIC',
                updates_every: 1800
            },
            
            transport_times: {
                waiblingen: 15,
                winnenden: 20,
                backnang: 25,
                schorndorf: 30,
                fellbach: 10
            }
        },
        
        katharinenhospital_stuttgart: {
            name: 'Katharinenhospital Stuttgart',
            location: { lat: 48.7758, lon: 9.1829 },
            address: 'Kriegsbergstraße 60, 70174 Stuttgart',
            
            // Maximalversorger
            specializations: {
                notaufnahme: { available: true, capacity_max: 20 },
                stroke_unit: { available: true, capacity_max: 12 },
                herzkatheterlabor: { available: true, h24: true },
                chirurgie: { available: true, trauma_level: 1 },
                innere_medizin: { available: true },
                neurologie: { available: true },
                neurochirurgie: { available: true }, // Spezialklinik
                kinderklinik: { available: true },
                geburtshilfe: { available: true }
            },
            
            capacity: {
                current: 'DYNAMIC',
                updates_every: 1800
            },
            
            transport_times: {
                waiblingen: 20,
                winnenden: 25,
                backnang: 30,
                schorndorf: 35,
                fellbach: 15
            }
        }
    },
    
    // ========================================
    // 🚑 FUNKSPRÜCHE (Feature 52)
    // ========================================
    radioMessages: {
        // Status-Meldungen
        status: {
            2: { // Auf Anfahrt
                templates: [
                    '{callsign}, Status 2, auf Anfahrt zum Einsatz, kommen.',
                    '{callsign}, Status 2, sind unterwegs, kommen.',
                    '{callsign}, wir fahren los, kommen.'
                ],
                delay: { min: 30, max: 90 } // Sekunden nach Alarmierung
            },
            3: { // Am Einsatzort
                templates: [
                    '{callsign}, Status 3, sind an der Einsatzstelle, kommen.',
                    '{callsign}, Status 3, am Einsatzort, kommen.',
                    '{callsign}, wir sind da, kommen.'
                ],
                delay: 'ARRIVAL_TIME'
            },
            4: { // Transport
                templates: [
                    '{callsign}, Status 4, Patient aufgenommen, Transport ins {hospital}, kommen.',
                    '{callsign}, Status 4, fahren {hospital} an, kommen.',
                    '{callsign}, wir transportieren nach {hospital}, kommen.'
                ],
                delay: { min: 300, max: 900 } // Nach Ankunft
            },
            1: { // Frei
                templates: [
                    '{callsign}, Status 1, Patient übergeben, sind wieder frei, kommen.',
                    '{callsign}, Status 1, zurück im Bereich, kommen.',
                    '{callsign}, frei für weitere Einsätze, kommen.'
                ],
                delay: { min: 600, max: 1200 } // Nach Transport
            }
        },
        
        // Lage-Meldungen vor Ort
        lageMeldung: {
            templates: [
                '{callsign}, Lage vor Ort: {situation}, kommen.',
                '{callsign}, wir haben hier {situation}, kommen.',
                '{callsign}, Lagemeldung: {situation}, kommen.'
            ],
            delay: { min: 120, max: 240 } // 2-4 Min nach Ankunft
        },
        
        // Nachforderungen (aus Templates)
        nachforderung: {
            templates: {
                nef: '{callsign}, benötigen Notarzt nach, Patient kritisch, kommen.',
                rtw: '{callsign}, benötigen zweiten RTW, weitere Person betroffen, kommen.',
                fw: '{callsign}, benötigen Feuerwehr, {reason}, kommen.',
                pol: '{callsign}, benötigen Polizei, {reason}, kommen.',
                rth: '{callsign}, benötigen RTH für Lufttransport, kommen.'
            }
        },
        
        // Rückmeldungen auf Anfragen
        rückmeldung: {
            eta: '{callsign}, ETA noch {minutes} Minuten, kommen.',
            status: '{callsign}, wir versorgen gerade, dauert noch, kommen.',
            problem: '{callsign}, haben ein Problem: {issue}, kommen.'
        }
    },
    
    // ========================================
    // 📊 EINSATZ-PROTOKOLL (Feature 45)
    // ========================================
    missionProtocol: {
        // Was wird dokumentiert
        fields: {
            timestamp_start: 'AUTOMATIC',
            timestamp_end: 'AUTOMATIC',
            caller: {
                name: 'FROM_TEMPLATE',
                phone: 'FROM_TEMPLATE',
                relation: 'FROM_TEMPLATE'
            },
            location: {
                address: 'FROM_GEOCODING',
                coordinates: 'FROM_GEOCODING',
                accessibility: 'FROM_TEMPLATE'
            },
            incident: {
                type: 'FROM_TEMPLATE',
                description: 'FROM_CALL',
                severity: 'CALCULATED'
            },
            disposition: {
                vehicles: [], // Alarmierte Fahrzeuge
                timestamps: {
                    alarm: 'AUTOMATIC',
                    arrival: 'FROM_RADIO',
                    transport: 'FROM_RADIO',
                    hospital: 'FROM_RADIO',
                    available: 'FROM_RADIO'
                }
            },
            additional_requests: [], // Nachforderungen
            outcome: {
                patient_condition: 'FROM_TEMPLATE',
                hospital: 'FROM_RADIO',
                transport_time: 'CALCULATED'
            },
            notes: [] // Besondere Vorkommnisse
        },
        
        // Bewertungskriterien für Review
        evaluation: {
            response_time: {
                excellent: 60,  // < 60 Sek
                good: 120,
                acceptable: 180,
                poor: 300
            },
            correct_vehicles: {
                // Wird pro Szenario berechnet
                check: 'COMPARE_WITH_RECOMMENDATION'
            },
            additional_requests_needed: {
                optimal: 0,
                acceptable: 1,
                poor: 2 // Mehr als 2 = falsche Erstdisposition
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GLOBAL_CONFIG };
}
