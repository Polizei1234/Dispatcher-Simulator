// =========================================================================================
// TEMPLATE: PANIKATTACKE
// Beschreibung: Akute Angstattacke - fühlt sich wie Herzinfarkt an
// =========================================================================================

export const PANIKATTACKE_TEMPLATE = {
    id: 'panikattacke',
    kategorie: 'rd',
    stichwort: 'Panikattacke',
    weight: 2,
    bagatell_potential: 0.5,
    
    anrufer: {
        typen: {
            patient_selbst_panisch: {
                probability: 0.50,
                speech_pattern: 'extrem_panisch',
                variations: [
                    'Ich sterbe! Mein Herz rast! Ich bekomme keine Luft!',
                    'Hilfe! Ich habe einen Herzinfarkt! Ich sterbe!',
                    'Ich kann nicht atmen! Mein Herz! Schnell!',
                    'Ich habe solche Angst! Mir wird schwindlig! Ich sterbe!'
                ],
                background_sounds: ['heavy_breathing', 'extreme_panic']
            },
            angehöriger_besorgt: {
                probability: 0.45,
                speech_pattern: 'besorgt',
                variations: [
                    'Sie hat extreme Angst und meint sie stirbt!',
                    'Er hat Todesangst! Sein Herz rast!',
                    'Sie ist völlig außer sich vor Angst!',
                    'Er hyperventiliert und hat Todesangst!'
                ]
            },
            zeuge: {
                probability: 0.05,
                speech_pattern: 'überfordert',
                variations: [
                    'Jemand hat hier eine Panikattacke!'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.35 },
            female: { probability: 0.65 }
        },
        alter: {
            distribution: 'normal',
            mean: 32,
            stddev: 12,
            min: 16,
            max: 60
        },
        bewusstsein: {
            wach_panisch: { probability: 0.95 },
            benommen: { probability: 0.05 }
        }
    },
    
    typische_symptome: {
        todesangst: { probability: 0.90, note: 'Charakteristisch!' },
        herzrasen: { probability: 0.85 },
        atemnot_gefühl: { probability: 0.80 },
        brustenge: { probability: 0.70 },
        schwindel: { probability: 0.75 },
        zittern: { probability: 0.70 },
        schwitzen: { probability: 0.65 },
        übelkeit: { probability: 0.50 },
        kribbeln: { probability: 0.60 },
        derealisierung: { probability: 0.50, note: 'Gefühl der Unwirklichkeit' }
    },
    
    anamnese: {
        erste_attacke: {
            probability: 0.30,
            note: 'Besonders dramatisch erlebt'
        },
        bekannte_panikstörung: {
            probability: 0.60,
            patient_weiß_es: true,
            trotzdem_angst: true
        },
        situativer_trigger: {
            probability: 0.40,
            beispiele: ['menschenmenge', 'enge_räume', 'stress']
        },
        spontan: {
            probability: 0.60
        }
    },
    
    auslöser: {
        stress: { probability: 0.35 },
        ausloeser_situation: { probability: 0.30 },
        spontan: { probability: 0.25 },
        andere: { probability: 0.10 }
    },
    
    locations: {
        zuhause: { probability: 0.50, address_types: ['residential'] },
        öffentlich: { probability: 0.30, address_types: ['public_place'] },
        arbeitsplatz: { probability: 0.15, address_types: ['office'] },
        verkehrsmittel: { probability: 0.05, address_types: ['transport'] }
    },
    
    dauer: {
        unter_10min: { probability: 0.40 },
        10_30min: { probability: 0.50 },
        ueber_30min: { probability: 0.10 }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        transport_notwendig: {
            ja_erste_attacke: { probability: 0.80 },
            ja_keine_besserung: { probability: 0.60 },
            nein_nach_beruhigung: { probability: 0.30 }
        },
        zielklinik: {
            standard: { probability: 0.90 },
            psychiatrie: { probability: 0.10 }
        }
    },
    
    behandlung: {
        beruhigung: {
            note: 'Zentral wichtig!',
            erklärung: 'Nicht lebensbedrohlich, geht vorüber',
            ruhe_ausstrahlen: true
        },
        atemtechnik: {
            note: 'Langsam und tief atmen',
            hilfreich: true
        },
        medikamente: {
            benzodiazepine: 'bei_bedarf',
            meist_nicht_nötig: true
        },
        organisch_ausschließen: {
            note: 'EKG, Vitalparameter!',
            wichtig: 'Herzinfarkt ausschließen'
        }
    },
    
    differentialdiagnose: {
        wichtig: {
            note: 'Organische Ursachen ausschließen!',
            gefährlich: ['herzinfarkt', 'lungenembolie', 'pneumothorax', 'arrhythmie'],
            regel: 'Bei erster Attacke immer abklären!'
        }
    },
    
    eskalation: {
        besserung_schnell: {
            probability: 0.60,
            announcement: 'Es wird schon besser... die Angst lässt nach',
            dauer: '10-20 Minuten'
        },
        keine_besserung: {
            probability: 0.30,
            announcement: 'Ich habe immer noch solche Angst!'
        },
        hyperventilation: {
            probability: 0.20,
            announcement: 'Die Atmung wird ganz schnell!'
        },
        verschlechterung: {
            probability: 0.05,
            announcement: 'Es wird schlimmer! Ich sterbe!'
        }
    },
    
    prognose: {
        akut: 'Geht vorüber, nicht gefährlich',
        langfristig: 'Panikstörung möglich, Therapie sinnvoll'
    },
    
    lernziele: [
        'Panikattacke erkennen',
        'Fühlt sich wie Herzinfarkt an',
        'Todesangst typisch',
        'Aber: Organische Ursachen ausschließen!',
        'Beruhigung zentral',
        'Meist selbstlimitierend'
    ]
};

export default PANIKATTACKE_TEMPLATE;