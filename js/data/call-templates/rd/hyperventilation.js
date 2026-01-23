// =========================================================================================
// TEMPLATE: HYPERVENTILATION
// Beschreibung: Überatmung meist stressbedingt - Pfoten-Stellung typisch
// =========================================================================================

export const HYPERVENTILATION_TEMPLATE = {
    id: 'hyperventilation',
    kategorie: 'rd',
    stichwort: 'Hyperventilation',
    weight: 2,
    bagatell_potential: 0.6,
    
    anrufer: {
        typen: {
            patient_selbst_panisch: {
                probability: 0.40,
                speech_pattern: 'atemlos_panisch',
                variations: [
                    '*schnelles Atmen* Ich bekomme keine Luft! *hechelt*',
                    'Ich kriege keine Luft! Hilfe! *hyperventiliert*',
                    '*atmet schnell* Ich ersticke!',
                    'Meine Hände kribbeln! Ich kann nicht atmen!'
                ],
                background_sounds: ['heavy_breathing', 'panic']
            },
            angehöriger_besorgt: {
                probability: 0.50,
                speech_pattern: 'besorgt',
                variations: [
                    'Sie atmet ganz schnell und ihre Hände verkrampfen!',
                    'Er hyperventiliert! Seine Hände sind ganz steif!',
                    'Sie bekommt angeblich keine Luft und atmet ganz schnell!',
                    'Er atmet wie verrückt und seine Finger sind steif!'
                ]
            },
            zeuge: {
                probability: 0.08,
                speech_pattern: 'überfordert',
                variations: [
                    'Jemand hyperventiliert hier!'
                ]
            },
            lehrer_betreuer: {
                probability: 0.02,
                speech_pattern: 'sachlich',
                variations: [
                    'Schülerin hyperventiliert nach Stresssituation.'
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
            mean: 28,
            stddev: 12,
            min: 14,
            max: 65,
            note: 'Junge Erwachsene häufiger'
        },
        bewusstsein: {
            wach_panisch: { probability: 0.85 },
            benommen: { probability: 0.12 },
            bewusstlos: { probability: 0.03 }
        }
    },
    
    typische_symptome: {
        schnelle_atmung: { probability: 0.95 },
        pfoten_stellung: { probability: 0.70, note: 'Tetanie der Hände!' },
        kribbeln: { probability: 0.80 },
        schwindel: { probability: 0.75 },
        engegefühl_brust: { probability: 0.60 },
        angst: { probability: 0.90 },
        perioral_kribbeln: { probability: 0.50 }
    },
    
    auslöser: {
        psychisch: {
            probability: 0.70,
            beispiele: ['angst', 'stress', 'panikattacke', 'streit']
        },
        schmerz: {
            probability: 0.15
        },
        organisch: {
            probability: 0.10,
            beispiele: ['lungenembolie', 'herzinfarkt', 'asthma'],
            note: 'WICHTIG: Organische Ursachen ausschließen!'
        },
        andere: {
            probability: 0.05
        }
    },
    
    schweregrad: {
        leicht: {
            probability: 0.40,
            symptome: ['leichtes_kribbeln', 'etwas_schwindlig'],
            therapie: 'beruhigung_ausreichend'
        },
        mittel: {
            probability: 0.45,
            symptome: ['pfoten_stellung', 'starkes_kribbeln', 'schwindel'],
            therapie: 'rückatmung_beruhigung'
        },
        schwer: {
            probability: 0.15,
            symptome: ['tetanische_krämpfe', 'bewusstseinsstörung'],
            therapie: 'medikamentös'
        }
    },
    
    locations: {
        zuhause: { probability: 0.50, address_types: ['residential'] },
        öffentlich: { probability: 0.30, address_types: ['public_place'] },
        arbeitsplatz: { probability: 0.15, address_types: ['office'] },
        schule: { probability: 0.05, address_types: ['school'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        transport_notwendig: {
            ja: { probability: 0.50 },
            nein_nach_beruhigung: { probability: 0.50 }
        },
        zielklinik: {
            standard: { probability: 1.0 }
        }
    },
    
    behandlung: {
        beruhigung: {
            note: 'Wichtigste Maßnahme!',
            erklärung: 'Harmlos, nicht lebensbedrohlich'
        },
        rückatmung: {
            note: 'Tüte/Hände',
            wirkung: 'CO2-Rückatmung normalisiert pH'
        },
        medikamente: {
            bei_bedarf: 'Benzodiazepine',
            selten_notwendig: true
        }
    },
    
    differentialdiagnose: {
        wichtig: {
            note: 'Organische Ursachen ausschließen!',
            gefährlich: ['lungenembolie', 'herzinfarkt', 'pneumothorax', 'asthma_anfall']
        }
    },
    
    eskalation: {
        besserung: {
            probability: 0.70,
            announcement: 'Es geht schon besser... die Atmung wird ruhiger'
        },
        bewusstlosigkeit: {
            probability: 0.05,
            announcement: 'Sie wird bewusstlos!',
            note: 'Durch zerebrale Vasokonstriktion'
        },
        keine_besserung: {
            probability: 0.25,
            announcement: 'Es wird nicht besser!'
        }
    },
    
    lernziele: [
        'Hyperventilation erkennen',
        'Pfoten-Stellung typisch',
        'Meist psychogen',
        'Aber: Organische Ursachen ausschließen!',
        'Beruhigung zentral',
        'Oft kein Transport nötig'
    ]
};

export default HYPERVENTILATION_TEMPLATE;