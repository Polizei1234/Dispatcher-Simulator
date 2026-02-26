// =========================================================================================
// TEMPLATE: HYPERGLYKÄMIE / DIABETISCHES KOMA
// Beschreibung: Überzuckerung bei Diabetikern - Ketoazidose
// =========================================================================================

export const HYPERGLYKAEMIE_TEMPLATE = {
    id: 'hyperglykaemie',
    kategorie: 'rd',
    stichwort: 'Hyperglykämie / Diabetisches Koma',
    weight: 2,
    
    anrufer: {
        typen: {
            angehöriger: {
                probability: 0.70,
                speech_pattern: 'besorgt',
                variations: [
                    'Mein Mann ist Diabetiker und sehr verwirrt!',
                    'Sie ist nicht ansprechbar, riecht komisch aus dem Mund!',
                    'Er hat viel getrunken und ist jetzt bewusstlos!',
                    'Sie atmet so komisch tief, ich bin sehr besorgt!'
                ]
            },
            pflegepersonal: {
                probability: 0.20,
                speech_pattern: 'professionell',
                variations: [
                    'Diabetiker mit Hyperglykämie, BZ über 500, Kußmaul-Atmung.',
                    'Bewohner mit diabetischer Ketoazidose, somnolent.'
                ]
            },
            patient_selbst: {
                probability: 0.05,
                speech_pattern: 'verwirrt',
                variations: [
                    'Mir ist sehr schlecht... ich habe Diabetes... *verwirrt*'
                ]
            },
            hausarzt: {
                probability: 0.05,
                speech_pattern: 'ärztlich',
                variations: [
                    'Patient mit entgleistem Diabetes, Ketoazidose, Transport dringend.'
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
            peak1: { mean: 25, stddev: 10, weight: 0.3 },
            peak2: { mean: 65, stddev: 12, weight: 0.7 },
            min: 10,
            max: 85
        },
        bewusstsein: {
            wach_verwirrt: { probability: 0.30 },
            somnolent: { probability: 0.40 },
            bewusstlos: { probability: 0.30 }
        }
    },
    
    typ: {
        ketoazidose: {
            probability: 0.70,
            diabetes_typ: 'meist Typ 1',
            severity: 'schwer'
        },
        hyperglykämisches_koma: {
            probability: 0.30,
            diabetes_typ: 'meist Typ 2',
            severity: 'kritisch'
        }
    },
    
    symptome: {
        hauptsymptome: {
            polydipsie: { probability: 0.80, details: 'Extremer Durst' },
            polyurie: { probability: 0.75, details: 'Viel Wasserlassen' },
            verwirrtheit: { probability: 0.70 },
            exsikkose: { probability: 0.85 }
        },
        ketoazidose_spezifisch: {
            kußmaul_atmung: { probability: 0.60, details: 'Tiefe, schnelle Atmung' },
            acetongeruch: { probability: 0.70, details: 'Obstartiger Mundgeruch' },
            übelkeit_erbrechen: { probability: 0.75 },
            bauchschmerzen: { probability: 0.50 }
        },
        allgemein: {
            schwäche: { probability: 0.85 },
            müdigkeit: { probability: 0.80 },
            sehstörungen: { probability: 0.40 }
        }
    },
    
    ursachen: {
        insulin_vergessen: {
            probability: 0.35,
            details: 'Nicht gespritzt'
        },
        infektion: {
            probability: 0.30,
            details: 'Erhöhter Insulinbedarf'
        },
        erstmanifestation: {
            probability: 0.20,
            details: 'Diabetes bisher unbekannt'
        },
        medikamentenfehler: {
            probability: 0.10
        },
        andere: {
            probability: 0.05
        }
    },
    
    locations: {
        zuhause: { probability: 0.75, address_types: ['residential'] },
        pflegeheim: { probability: 0.15, address_types: ['care_home'] },
        öffentlich: { probability: 0.10, address_types: ['public_place'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.25,
            triggers: ['bewusstlosigkeit', 'schock', 'kritische_werte']
        },
        zielklinik: {
            intensivstation: { probability: 0.40 },
            standard_monitored: { probability: 0.60 }
        }
    },
    
    komplikationen: {
        zerebralödem: {
            probability: 0.05,
            besonders_bei: 'Kindern',
            severity: 'lebensbedrohlich'
        },
        schock: {
            probability: 0.15,
            ursache: 'Exsikkose'
        },
        nierenversagen: {
            probability: 0.10
        }
    },
    
    zeitfaktoren: {
        entwicklung: {
            stunden_tage: { probability: 0.70 },
            tage_woche: { probability: 0.30 }
        }
    },
    
    lernziele: [
        'Hyperglykämie vs. Hypoglykämie',
        'Ketoazidose-Symptome erkennen',
        'Langsame Entwicklung vs. akute Hypo',
        'Kußmaul-Atmung als Warnsignal'
    ]
};

export default HYPERGLYKAEMIE_TEMPLATE;