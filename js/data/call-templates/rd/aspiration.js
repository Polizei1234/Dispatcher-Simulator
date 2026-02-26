// =========================================================================================
// TEMPLATE: ASPIRATION / VERSCHLUCKEN
// Beschreibung: Fremdkörper oder Nahrung in Atemwegen
// =========================================================================================

export const ASPIRATION_TEMPLATE = {
    id: 'aspiration',
    kategorie: 'rd',
    stichwort: 'Aspiration / Verschlucken',
    weight: 2,
    
    anrufer: {
        typen: {
            angehöriger_panisch: {
                probability: 0.60,
                speech_pattern: 'panisch',
                variations: [
                    'Er hat sich verschluckt und bekommt keine Luft mehr!',
                    'Sie hustet und würgt! Sie erstickt!',
                    'Er ist beim Essen zusammengebrochen!',
                    'Sie bekommt keine Luft, sie ist blau im Gesicht!'
                ],
                background_sounds: ['coughing', 'gasping', 'choking']
            },
            zeuge_restaurant: {
                probability: 0.20,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Jemand hat sich hier im Restaurant verschluckt!',
                    'Ein Gast bekommt keine Luft, er ist blau angelaufen!'
                ]
            },
            pflegepersonal: {
                probability: 0.15,
                speech_pattern: 'professionell',
                variations: [
                    'Bewohner mit Aspiration, Dyspnoe, Zyanose.',
                    'Patient hat aspiriert, nicht ansprechbar.'
                ]
            },
            angehöriger_nachträglich: {
                probability: 0.05,
                speech_pattern: 'besorgt',
                variations: [
                    'Sie hatte sich verschluckt, hustet jetzt ständig und bekommt Fieber.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.52 },
            female: { probability: 0.48 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 5, stddev: 3, weight: 0.15 },
            peak2: { mean: 75, stddev: 12, weight: 0.85 },
            min: 1,
            max: 95
        },
        bewusstsein: {
            wach_hustend: { probability: 0.50 },
            verwirrt: { probability: 0.25 },
            bewusstlos: { probability: 0.25 }
        }
    },
    
    aspiration_typ: {
        fremdkörper_akut: {
            probability: 0.40,
            severity: 'kritisch',
            details: 'Nahrung, Zahnprothese'
        },
        flüssigkeit: {
            probability: 0.30,
            severity: 'mittel-schwer',
            details: 'Getränk, Mageninhalt'
        },
        chronisch: {
            probability: 0.20,
            severity: 'mittel',
            details: 'Aspirationspneumonie'
        },
        kleinkind: {
            probability: 0.10,
            severity: 'variabel',
            details: 'Spielzeug, Münzen, Nüsse'
        }
    },
    
    symptome: {
        akut: {
            husten: { probability: 0.90 },
            würgen: { probability: 0.70 },
            dyspnoe: { probability: 0.85 },
            stridor: { probability: 0.40 },
            zyanose: { probability: 0.50 },
            aphonie: { probability: 0.30 }
        },
        schweregrad: {
            partielle_verlegung: {
                probability: 0.60,
                details: 'Hustet noch, bekommt etwas Luft'
            },
            komplette_verlegung: {
                probability: 0.40,
                details: 'Kein Husten mehr, bewusstlos drohend'
            }
        }
    },
    
    risikofaktoren: {
        schluckstörung: { probability: 0.50 },
        demenz: { probability: 0.40 },
        schlaganfall_anamnese: { probability: 0.35 },
        parkinson: { probability: 0.20 },
        alkohol: { probability: 0.15 },
        zahnprothese: { probability: 0.30 }
    },
    
    locations: {
        zuhause: { probability: 0.50, address_types: ['residential'] },
        pflegeheim: { probability: 0.30, address_types: ['care_home'] },
        restaurant: { probability: 0.15, address_types: ['restaurant'] },
        öffentlich: { probability: 0.05, address_types: ['public_place'] }
    },
    
    massnahmen: {
        heimlich_manöver: {
            probability: 0.30,
            erfolg: {
                fremdkörper_entfernt: 0.60,
                keine_wirkung: 0.40
            }
        },
        rückenklopfen: {
            probability: 0.40,
            erfolg: {
                abgehustet: 0.50,
                keine_wirkung: 0.50
            }
        },
        keine_maßnahmen: {
            probability: 0.30
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.30,
            triggers: ['bewusstlosigkeit', 'komplette_verlegung', 'reanimation']
        }
    },
    
    eskalation: {
        reanimation: {
            probability: 0.15,
            announcement: 'Er reagiert nicht mehr! Er atmet nicht!'
        },
        besserung: {
            probability: 0.25,
            announcement: 'Er hat es ausgehustet! Es geht ihm besser!'
        },
        pneumonie: {
            probability: 0.10,
            zeitverzögert: true,
            note: 'Aspirationspneumonie entwickelt sich'
        }
    },
    
    zeitfaktoren: {
        tageszeit_modifikator: {
            mittag_12_14: 1.5,
            abend_18_20: 1.8,
            andere: 0.8
        }
    },
    
    lernziele: [
        'Akute vs. chronische Aspiration',
        'Heimlich-Manöver anleiten',
        'Zeitkritisches Handeln',
        'Reanimationsbereitschaft'
    ]
};

export default ASPIRATION_TEMPLATE;