// =========================================================================================
// TEMPLATE: VERWIRRTHEIT AKUT
// Beschreibung: Plötzliche Verwirrtheit / Delir - viele Ursachen
// =========================================================================================

export const VERWIRRTHEIT_TEMPLATE = {
    id: 'verwirrtheit',
    kategorie: 'rd',
    stichwort: 'Verwirrtheit akut',
    weight: 2,
    
    anrufer: {
        typen: {
            angehöriger_besorgt: {
                probability: 0.60,
                speech_pattern: 'besorgt_ratlos',
                variations: [
                    'Meine Mutter ist total verwirrt! Sie erkennt mich nicht!',
                    'Er weiß nicht wo er ist! Redet wirres Zeug!',
                    'Sie ist plötzlich ganz durcheinander!',
                    'Mein Vater ist verwirrt und aggressiv!'
                ]
            },
            pflegepersonal: {
                probability: 0.25,
                speech_pattern: 'professionell',
                variations: [
                    'Bewohnerin akut verwirrt, nicht ansprechbar.',
                    'Patient mit akutem Verwirrtheitszustand, unruhig.'
                ]
            },
            polizei: {
                probability: 0.12,
                speech_pattern: 'professionell',
                variations: [
                    'Polizei, Person verwirrt orientierungslos aufgefunden.',
                    'Verwirrte Person, aggressiv, medizinische Hilfe erforderlich.'
                ]
            },
            zeuge: {
                probability: 0.03,
                speech_pattern: 'unsicher',
                variations: [
                    'Hier läuft jemand verwirrt herum...'
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
            peak1: { mean: 35, stddev: 15, weight: 0.2 },
            peak2: { mean: 78, stddev: 10, weight: 0.8 },
            min: 18,
            max: 95,
            note: 'Ältere häufiger betroffen'
        },
        zustand: {
            desorientiert: { probability: 0.50 },
            agitiert: { probability: 0.30 },
            apathisch: { probability: 0.15 },
            aggressiv: { probability: 0.05 }
        }
    },
    
    ursachen: {
        infektion: {
            probability: 0.25,
            beispiele: ['harnwegsinfekt', 'pneumonie', 'sepsis'],
            bei_aelteren: 'häufig'
        },
        exsikkose: {
            probability: 0.18,
            bei_aelteren: 'häufig'
        },
        hypoglykämie: {
            probability: 0.12,
            bei_diabetikern: true
        },
        schlaganfall: {
            probability: 0.10,
            ernst: true
        },
        medikamente: {
            probability: 0.12,
            beispiele: ['überdosierung', 'wechselwirkung', 'entzug']
        },
        intoxikation: {
            probability: 0.08,
            substanzen: ['alkohol', 'drogen']
        },
        demenz_dekompensiert: {
            probability: 0.08
        },
        andere: {
            probability: 0.07
        }
    },
    
    symptome: {
        orientierungsstörung: {
            zeitlich: { probability: 0.80 },
            örtlich: { probability: 0.70 },
            situativ: { probability: 0.60 },
            zur_person: { probability: 0.30 }
        },
        verhalten: {
            unruhig: { probability: 0.50 },
            nesteln: { probability: 0.40 },
            weglauftendenz: { probability: 0.25 },
            aggressiv: { probability: 0.15 },
            apathisch: { probability: 0.20 }
        },
        wahrnehmung: {
            halluzinationen: { probability: 0.30 },
            wahn: { probability: 0.20 }
        }
    },
    
    locations: {
        zuhause: { probability: 0.50, address_types: ['residential'] },
        pflegeheim: { probability: 0.30, address_types: ['nursing_home'] },
        öffentlich: { probability: 0.15, address_types: ['street', 'public_place'] },
        andere: { probability: 0.05 }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.15,
            triggers: ['schlaganfall_verdacht', 'kritischer_zustand', 'hypoglykämie_schwer']
        },
        zielklinik: {
            standard: { probability: 0.85 },
            neurologie: { probability: 0.15 }
        }
    },
    
    lernziele: [
        'Akute Verwirrtheit = Symptom, nicht Diagnose',
        'Viele mögliche Ursachen',
        'Bei Älteren: Infekt/Exsikkose häufig',
        'Schlaganfall ausschließen!',
        'Patient-Handling oft schwierig'
    ]
};

export default VERWIRRTHEIT_TEMPLATE;