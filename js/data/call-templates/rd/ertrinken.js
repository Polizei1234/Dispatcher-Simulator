// =========================================================================================
// TEMPLATE: ERTRINKEN / BADEUNFALL
// Beschreibung: Person aus Wasser gerettet - Hypoxie-Gefahr
// =========================================================================================

export const ERTRINKEN_TEMPLATE = {
    id: 'ertrinken',
    kategorie: 'rd',
    stichwort: 'Ertrinken / Badeunfall',
    weight: 1,
    
    anrufer: {
        typen: {
            zeuge_panisch: {
                probability: 0.55,
                speech_pattern: 'extrem_panisch',
                variations: [
                    'Jemand ist im Wasser! Ertrinkt!',
                    'Person aus dem Wasser gezogen! Reagiert nicht!',
                    'Badeunfall! Kind im Schwimmbad untergegangen!',
                    'Jemand treibt bewusstlos im Wasser!',
                    'Er ist unter Wasser gewesen! Atmet nicht!'
                ],
                background_sounds: ['water', 'screaming', 'panic', 'children']
            },
            bademeister: {
                probability: 0.25,
                speech_pattern: 'professionell_dringend',
                variations: [
                    'Bademeister, Person aus Wasser gerettet, bewusstlos.',
                    'Badeunfall, Kind, Reanimation läuft, RTW dringend!',
                    'Ertrinkungsunfall, Person geborgen, nicht ansprechbar.'
                ]
            },
            wasserwacht_dlrg: {
                probability: 0.15,
                speech_pattern: 'professionell',
                variations: [
                    'DLRG, Ertrinkungsunfall, Patient versorgt, RTW erforderlich.',
                    'Wasserwacht, bewusstlose Person aus See gerettet.'
                ]
            },
            angehöriger: {
                probability: 0.05,
                speech_pattern: 'verzweifelt',
                variations: [
                    'Mein Kind! Es war unter Wasser! Es atmet nicht!'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.72 },
            female: { probability: 0.28 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 8, stddev: 5, weight: 0.35 },
            peak2: { mean: 45, stddev: 20, weight: 0.65 },
            min: 2,
            max: 80
        },
        bewusstsein: {
            wach_hustend: { probability: 0.30 },
            somnolent: { probability: 0.25 },
            bewusstlos: { probability: 0.35 },
            reanimation: { probability: 0.10 }
        }
    },
    
    schweregrad: {
        stufe_1_leicht: {
            probability: 0.25,
            symptome: ['wach', 'hustend', 'keine_aspiration'],
            note: 'Gerettet bevor untergegangen'
        },
        stufe_2_mittel: {
            probability: 0.30,
            symptome: ['hustend', 'atemnot', 'aspiration_wenig_wasser'],
            monitoring: 'erforderlich'
        },
        stufe_3_schwer: {
            probability: 0.25,
            symptome: ['bewusstlosigkeit', 'aspiration', 'lungenödem'],
            beatmung: 'oft_erforderlich'
        },
        stufe_4_kritisch: {
            probability: 0.15,
            symptome: ['atemstillstand', 'herzstillstand'],
            reanimation: true
        },
        stufe_5_tod: {
            probability: 0.05,
            längere_submersion: true
        }
    },
    
    wassertyp: {
        süßwasser: {
            probability: 0.70,
            orte: ['schwimmbad', 'see', 'fluss', 'badewanne']
        },
        salzwasser: {
            probability: 0.30,
            orte: ['meer', 'ostsee']
        }
    },
    
    locations: {
        schwimmbad: { probability: 0.35, address_types: ['pool'] },
        see: { probability: 0.25, address_types: ['lake'] },
        meer: { probability: 0.20, address_types: ['sea'] },
        fluss: { probability: 0.10, address_types: ['river'] },
        privat_pool_badewanne: { probability: 0.08, address_types: ['residential'] },
        andere: { probability: 0.02 }
    },
    
    ursache: {
        unfall_kind: {
            probability: 0.30,
            details: 'Unbeaufsichtigt, kann nicht schwimmen'
        },
        erschöpfung: {
            probability: 0.25,
            details: 'Überschätzung, Krämpfe'
        },
        medizinischer_notfall: {
            probability: 0.20,
            details: 'Herzinfarkt, Krampfanfall im Wasser'
        },
        alkohol_drogen: {
            probability: 0.15
        },
        sprung_ins_wasser: {
            probability: 0.05,
            zusätzlich: 'HWS-Trauma'
        },
        andere: {
            probability: 0.05
        }
    },
    
    submersionszeit: {
        unter_5min: {
            probability: 0.50,
            prognose: 'gut'
        },
        5_10min: {
            probability: 0.30,
            prognose: 'eingeschränkt'
        },
        über_10min: {
            probability: 0.15,
            prognose: 'schlecht'
        },
        unbekannt: {
            probability: 0.05
        }
    },
    
    komplikationen: {
        hypoxischer_hirnschaden: {
            probability: 0.20,
            bei: 'längere_submersion'
        },
        lungenödem: {
            probability: 0.40,
            verzögert: 'bis_24h'
        },
        hypothermie: {
            probability: 0.50,
            schutzfaktor: 'bei_kaltem_wasser'
        },
        aspirationspneumonie: {
            probability: 0.35,
            verzögert: true
        },
        hws_trauma: {
            probability: 0.08,
            bei: 'sprung_unfall'
        }
    },
    
    besonderheiten: {
        kaltwasser: {
            probability: 0.40,
            schutzeffekt: 'Tauchreflex bei Kindern',
            hypothermie: true,
            note: 'Längere Reanimation sinnvoll!'
        },
        trockenes_ertrinken: {
            probability: 0.10,
            details: 'Laryngospasmus, wenig Wasser aspiriert',
            note: 'Sekundäres Ertrinken bis 24h später'
        },
        rettung_bereits_erfolgt: {
            probability: 0.80,
            durch: ['bademeister', 'dlrg', 'ersthelfer', 'zeuge']
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 1, ktw: 0 },
        nef_indikation: {
            probability: 0.70,
            triggers: ['bewusstlosigkeit', 'ateminsuffizienz', 'reanimation']
        },
        rth_indikation: {
            probability: 0.20,
            bei: 'abgelegene_badestelle'
        },
        zielklinik: {
            intensivstation: { probability: 0.60 },
            standard: { probability: 0.40 }
        },
        überwachung: {
            note: 'ALLE Patienten 24h überwachen!',
            grund: 'Sekundäres Ertrinken'
        }
    },
    
    reanimation_besonderheiten: {
        note: 'Bei Hypothermie länger reanimieren!',
        regel: 'Nicht tot bis warm und tot',
        dauer: 'Bis Körpertemperatur >32°C'
    },
    
    eskalation: {
        lungenödem_entwickelt: {
            probability: 0.25,
            announcement: 'Er bekommt immer schlechter Luft! Es rasselt!'
        },
        bewusstlosigkeit: {
            probability: 0.20,
            announcement: 'Er wird bewusstlos!'
        },
        reanimation: {
            probability: 0.15,
            announcement: 'Er atmet nicht mehr! Kein Puls!'
        }
    },
    
    zeitfaktoren: {
        jahreszeit: {
            sommer: 3.5,
            frühling_herbst: 1.0,
            winter: 0.2
        },
        tageszeit: {
            nachmittag_14_18: 2.0,
            vormittag: 1.2,
            andere: 0.5
        }
    },
    
    lernziele: [
        'Ertrinken = immer ernst nehmen',
        'Sekundäres Ertrinken (24h)',
        'Kaltwasser = längere Reanimation',
        'ALLE zur Überwachung ins KH',
        'Tauchreflex bei Kindern',
        'Auch "gerettete" können nachträglich kritisch werden'
    ]
};

export default ERTRINKEN_TEMPLATE;