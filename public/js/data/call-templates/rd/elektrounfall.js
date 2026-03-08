// =========================================================================================
// TEMPLATE: ELEKTROUNFALL / STROMUNFALL
// Beschreibung: Kontakt mit elektrischem Strom - vielfältige Verletzungen
// =========================================================================================

export const ELEKTROUNFALL_TEMPLATE = {
    id: 'elektrounfall',
    kategorie: 'rd',
    stichwort: 'Elektrounfall / Stromunfall',
    weight: 1,
    
    anrufer: {
        typen: {
            arbeitskollege: {
                probability: 0.45,
                speech_pattern: 'schockiert',
                variations: [
                    'Kollege hat einen Stromschlag bekommen!',
                    'Er hat Strom bekommen und ist bewusstlos!',
                    'Stromunfall! Er reagiert nicht mehr!',
                    'Er wurde weggeschleudert! Stromschlag!'
                ],
                background_sounds: ['alarm', 'shouting']
            },
            angehöriger_panisch: {
                probability: 0.30,
                speech_pattern: 'panisch',
                variations: [
                    'Mein Mann hat sich ans Kabel gefasst! Stromschlag!',
                    'Sie hat einen Stromschlag bekommen!',
                    'Er hat in die Steckdose gefasst!'
                ]
            },
            zeuge: {
                probability: 0.15,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Jemand wurde vom Strom getroffen!',
                    'Person liegt bewusstlos, Stromschlag!'
                ]
            },
            feuerwehr: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Feuerwehr vor Ort, Strom abgeschaltet, Patient mit Stromunfall.',
                    'Hochspannungsunfall, Person verletzt, Lage gesichert.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.85 },
            female: { probability: 0.15 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 6, stddev: 4, weight: 0.15 },
            peak2: { mean: 38, stddev: 14, weight: 0.85 },
            min: 2,
            max: 65
        },
        bewusstsein: {
            wach: { probability: 0.60 },
            verwirrt: { probability: 0.20 },
            bewusstlos: { probability: 0.20 }
        }
    },
    
    spannung: {
        niederspannung: {
            probability: 0.75,
            volt: '<1000V',
            beispiele: ['haushaltsstrom_230V', 'baustrom_400V'],
            severity: 'leicht-mittel'
        },
        hochspannung: {
            probability: 0.20,
            volt: '>1000V',
            beispiele: ['oberleitung', 'hochspannungsleitung'],
            severity: 'kritisch',
            verbrennungen_schwer: true
        },
        blitzschlag: {
            probability: 0.05,
            volt: 'millionen',
            severity: 'sehr_schwer',
            besonderheiten: true
        }
    },
    
    verletzungsmuster: {
        elektrische_verbrennung: {
            eintrittstelle: { probability: 0.70 },
            austrittsstelle: { probability: 0.60 },
            innere_verbrennung: { probability: 0.40, note: 'Muskel/Gewebe' }
        },
        kardial: {
            herzrhythmusstörung: { probability: 0.35 },
            kammerflimmern: { probability: 0.15 },
            asystolie: { probability: 0.10 },
            myokardschädigung: { probability: 0.25 }
        },
        neurologisch: {
            bewusstlosigkeit: { probability: 0.30 },
            krampfanfall: { probability: 0.15 },
            lähmungen: { probability: 0.12 },
            atemstillstand: { probability: 0.10 }
        },
        traumatisch: {
            sturz_nach_stromschlag: { probability: 0.40 },
            muskelriss: { probability: 0.20 },
            frakturen: { probability: 0.15 }
        }
    },
    
    schweregrad: {
        leicht: {
            probability: 0.45,
            symptome: ['schreck', 'leichte_verbrennung', 'muskelschmerz'],
            monitoring: 'erforderlich'
        },
        mittel: {
            probability: 0.35,
            symptome: ['bewusstseinsstörung', 'verbrennungen_grad_2'],
            klinik: 'erforderlich'
        },
        schwer: {
            probability: 0.15,
            symptome: ['herzrhythmusstörung', 'bewusstlosigkeit', 'schwere_verbrennung'],
            intensiv: true
        },
        kritisch: {
            probability: 0.05,
            symptome: ['reanimation', 'kammerflimmern'],
            überlebenschance: 'eingeschränkt'
        }
    },
    
    locations: {
        arbeitsplatz: { probability: 0.50, address_types: ['industrial', 'construction'] },
        zuhause: { probability: 0.30, address_types: ['residential'] },
        im_freien: { probability: 0.15, address_types: ['outdoor'] },
        andere: { probability: 0.05 }
    },
    
    besonderheiten: {
        stromkreis_unterbrochen: {
            probability: 0.70,
            note: 'Kontakt beendet'
        },
        noch_unter_strom: {
            probability: 0.30,
            note: 'GEFAHR! Feuerwehr/EVU erforderlich',
            eigenschutz: 'kritisch'
        },
        herzdurchströmung: {
            probability: 0.25,
            note: 'Hand zu Hand = gefährlich',
            severity: 'höher'
        },
        arbeitsunfall: {
            probability: 0.60,
            berufsgenossenschaft: true
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.35,
            triggers: ['hochspannung', 'herzrhythmusstörung', 'bewusstlosigkeit', 'reanimation']
        },
        feuerwehr: {
            probability: 0.50,
            reasons: ['strom_abschalten', 'gefahrenbereich', 'technische_rettung'],
            bei_hochspannung: { probability: 1.0 }
        },
        evu_energieversorger: {
            probability: 0.30,
            bei: 'hochspannung'
        },
        zielklinik: {
            standard: { probability: 0.50 },
            traumazentrum: { probability: 0.30, bei: 'schwer' },
            verbrennungszentrum: { probability: 0.20, bei: 'schwere_verbrennung' }
        },
        eigenschutz: {
            note: 'NICHT zum Patienten bei aktivem Strom!',
            abstand_hochspannung: '20m',
            kritisch: 'Lebensgefahr'
        }
    },
    
    monitoring: {
        ekg_überwachung: {
            probability: 1.0,
            dauer: 'mindestens_24h',
            note: 'Rhythmusstörungen können verzögert auftreten'
        }
    },
    
    eskalation: {
        kammerflimmern: {
            probability: 0.10,
            announcement: 'Er reagiert nicht! Kein Puls!'
        },
        herzrhythmusstörung: {
            probability: 0.15,
            announcement: 'Das Herz schlägt ganz unregelmäßig!'
        },
        noch_strom_aktiv: {
            probability: 0.20,
            announcement: 'Es knistert noch! Ich glaube es ist noch Strom drauf!',
            action: 'Abstand_halten'
        }
    },
    
    lernziele: [
        'Eigenschutz hat Priorität',
        'Nicht an Patient bei aktivem Strom',
        'Feuerwehr bei Hochspannung',
        'EKG-Monitoring immer',
        'Verzögerte Komplikationen möglich',
        'Innere Verletzungen bei unauffälliger Haut'
    ]
};

export default ELEKTROUNFALL_TEMPLATE;