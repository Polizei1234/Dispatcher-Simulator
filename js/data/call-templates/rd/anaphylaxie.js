// =========================================================================================
// TEMPLATE: ANAPHYLAKTISCHER SCHOCK
// Beschreibung: Schwerste allergische Reaktion - lebensbedrohlich
// =========================================================================================

export const ANAPHYLAXIE_TEMPLATE = {
    id: 'anaphylaxie',
    kategorie: 'rd',
    stichwort: 'Anaphylaktischer Schock',
    weight: 2,
    
    anrufer: {
        typen: {
            angehöriger_panisch: {
                probability: 0.70,
                speech_pattern: 'extrem_panisch',
                variations: [
                    'Sie bekommt keine Luft mehr! Ihr Gesicht schwillt an!',
                    'Er wurde gestochen und jetzt kollabiert er!',
                    'Sie ist allergisch und wird bewusstlos! Schnell!',
                    'Sein Hals schwillt zu! Er erstickt!'
                ],
                background_sounds: ['gasping', 'wheezing', 'panic']
            },
            zeuge: {
                probability: 0.20,
                speech_pattern: 'panisch',
                variations: [
                    'Jemand ist hier zusammengebrochen! Insektenstich!',
                    'Eine Person bekommt keine Luft mehr!'
                ]
            },
            patient_selbst: {
                probability: 0.05,
                speech_pattern: 'kaum_verständlich',
                variations: [
                    '*keuchend* Ich... bin... allergisch... EpiPen...'
                ]
            },
            sicherheitsdienst: {
                probability: 0.05,
                speech_pattern: 'professionell',
                variations: [
                    'Person mit anaphylaktischer Reaktion, bewusstlos, EpiPen gegeben.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.48 },
            female: { probability: 0.52 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 15, stddev: 8, weight: 0.3 },
            peak2: { mean: 40, stddev: 15, weight: 0.7 },
            min: 3,
            max: 75
        },
        bewusstsein: {
            wach_ängstlich: { probability: 0.40 },
            verwirrt: { probability: 0.30 },
            bewusstlos: { probability: 0.30 }
        }
    },
    
    symptome: {
        haut: {
            nesselsucht: { probability: 0.90 },
            juckreiz: { probability: 0.95 },
            angioödem: { probability: 0.70 },
            flush: { probability: 0.85 }
        },
        atemwege: {
            dyspnoe: { probability: 0.85 },
            stridor: { probability: 0.60 },
            zungenschwellung: { probability: 0.50 },
            kehlkopfödem: { probability: 0.40 }
        },
        kreislauf: {
            hypotonie: { probability: 0.80 },
            tachykardie: { probability: 0.90 },
            schock: { probability: 0.60 },
            synkope: { probability: 0.40 }
        },
        gastrointestinal: {
            übelkeit: { probability: 0.50 },
            erbrechen: { probability: 0.40 },
            durchfall: { probability: 0.30 },
            krämpfe: { probability: 0.35 }
        }
    },
    
    auslöser: {
        insektenstich: {
            probability: 0.40,
            types: ['wespe', 'biene', 'hornisse']
        },
        nahrungsmittel: {
            probability: 0.35,
            types: ['erdnüsse', 'nüsse', 'meeresfrüchte', 'eier']
        },
        medikamente: {
            probability: 0.20,
            types: ['antibiotika', 'schmerzmittel', 'kontrastmittel']
        },
        andere: {
            probability: 0.05,
            types: ['latex']
        }
    },
    
    schweregrad: {
        grad_3_schwer: {
            probability: 0.40,
            symptome: ['atemnot', 'hypotonie', 'bewusstseinstrübung']
        },
        grad_4_lebensbedrohlich: {
            probability: 0.60,
            symptome: ['atemstillstand_drohend', 'kreislaufstillstand_drohend']
        }
    },
    
    locations: {
        öffentlich: { probability: 0.40, address_types: ['park', 'restaurant', 'street'] },
        zuhause: { probability: 0.45, address_types: ['residential'] },
        arztpraxis: { probability: 0.10, address_types: ['medical'] },
        andere: { probability: 0.05 }
    },
    
    vorgeschichte: {
        bekannte_allergie: {
            probability: 0.70,
            notfallset: {
                vorhanden: 0.60,
                epipen_gegeben: 0.40
            }
        },
        erste_reaktion: {
            probability: 0.30
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 1, ktw: 0 },
        nef_indikation: {
            probability: 0.90,
            triggers: ['lebensbedrohung', 'atemweg_kompromittiert', 'schock']
        },
        zielklinik: {
            intensivstation: { probability: 0.70 },
            notaufnahme: { probability: 0.30 }
        }
    },
    
    eskalation: {
        reanimation: {
            probability: 0.15,
            announcement: 'Er reagiert nicht mehr! Er atmet nicht!'
        },
        intubation_erforderlich: {
            probability: 0.20,
            note: 'Atemweg gefährdet'
        },
        schnelle_besserung: {
            probability: 0.25,
            announcement: 'Das Adrenalin wirkt! Es wird besser!',
            note: 'Trotzdem Transport wegen biphasischer Reaktion'
        }
    },
    
    zeitfaktoren: {
        reaktionszeit: {
            minuten: { probability: 0.80 },
            unter_1h: { probability: 0.15 },
            stunden: { probability: 0.05 }
        },
        jahreszeit_modifikator: {
            sommer: 2.0,
            frühling: 1.5,
            herbst: 1.2,
            winter: 0.5
        }
    },
    
    lernziele: [
        'Anaphylaxie sofort erkennen',
        'Höchste Priorität - NEF',
        'EpiPen-Gabe anleiten',
        'Zeitkritisches Handeln',
        'Biphasische Reaktion beachten'
    ]
};

export default ANAPHYLAXIE_TEMPLATE;