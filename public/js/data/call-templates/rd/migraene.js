// =========================================================================================
// TEMPLATE: MIGRÄNE (SCHWERER ANFALL)
// Beschreibung: Schwerer Migräneanfall mit starken Kopfschmerzen
// =========================================================================================

export const MIGRAENE_TEMPLATE = {
    id: 'migraene',
    kategorie: 'rd',
    stichwort: 'Migräne-Anfall',
    weight: 2,
    bagatell_potential: 0.4,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.35,
                speech_pattern: 'gequält_leise',
                variations: [
                    '*flüstert* Ich habe unerträgliche Kopfschmerzen...',
                    'Ich halte die Schmerzen nicht mehr aus... *stöhnt*',
                    'Es ist eine schwere Migräne, nichts hilft...'
                ]
            },
            angehöriger: {
                probability: 0.60,
                speech_pattern: 'besorgt',
                variations: [
                    'Sie hat extreme Kopfschmerzen und erbricht ständig!',
                    'Er liegt im dunklen Zimmer, die Migräne ist sehr stark!',
                    'Sie hat schon ihre Medikamente genommen, es wird nicht besser!',
                    'Die Kopfschmerzen sind schlimmer als sonst bei ihrer Migräne!'
                ]
            },
            pflegepersonal: {
                probability: 0.05,
                speech_pattern: 'professionell',
                variations: [
                    'Patientin mit Status migraenosus, therapierefraktär.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.30 },
            female: { probability: 0.70 }
        },
        alter: {
            distribution: 'normal',
            mean: 38,
            stddev: 12,
            min: 18,
            max: 65
        },
        bewusstsein: {
            wach: { probability: 0.95 },
            verwirrt: { probability: 0.05 }
        }
    },
    
    symptome: {
        hauptsymptome: {
            einseitige_kopfschmerzen: { probability: 0.75 },
            pochend_pulsierend: { probability: 0.80 },
            sehr_starke_intensität: { probability: 0.90 }
        },
        begleitsymptome: {
            übelkeit: { probability: 0.85 },
            erbrechen: { probability: 0.70 },
            lichtscheu: { probability: 0.90 },
            lärmempfindlichkeit: { probability: 0.85 },
            geruchsempfindlichkeit: { probability: 0.50 }
        },
        aura: {
            vorhanden: { probability: 0.30 },
            sehstörungen: { probability: 0.25 },
            sensibilitätsstörungen: { probability: 0.15 }
        }
    },
    
    besonderheiten: {
        bekannte_migräne: {
            probability: 0.85,
            note: 'Patient kennt Symptomatik'
        },
        erste_migräne: {
            probability: 0.15,
            note: 'Differentialdiagnose wichtig'
        },
        medikamente_genommen: {
            probability: 0.80,
            wirkung: {
                keine: 0.60,
                unzureichend: 0.35,
                erbrochen: 0.05
            }
        },
        status_migraenosus: {
            probability: 0.10,
            note: 'Über 72h anhaltend'
        }
    },
    
    auslöser: {
        stress: { probability: 0.30 },
        hormonal: { probability: 0.25 },
        nahrungsmittel: { probability: 0.15 },
        wetter: { probability: 0.15 },
        schlafmangel: { probability: 0.10 },
        unbekannt: { probability: 0.05 }
    },
    
    locations: {
        zuhause: { probability: 0.85, address_types: ['residential'] },
        arbeitsplatz: { probability: 0.10, address_types: ['office'] },
        öffentlich: { probability: 0.05, address_types: ['public_place'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        transport: {
            erforderlich: { probability: 0.70 },
            optional: { probability: 0.30 }
        },
        zielklinik: {
            standard: { probability: 0.90 },
            neurologie: { probability: 0.10 }
        }
    },
    
    differentialdiagnose: {
        note: 'Bei erster Migräne oder atypischen Symptomen:',
        andere_ursachen: [
            'Subarachnoidalblutung',
            'Meningitis',
            'Hirntumor',
            'Schlaganfall'
        ]
    },
    
    zeitfaktoren: {
        dauer_vor_anruf: {
            stunden: { probability: 0.60 },
            tage: { probability: 0.30 },
            akut: { probability: 0.10 }
        }
    },
    
    lernziele: [
        'Migräne vs. gefährliche Kopfschmerzen',
        'Red Flags erkennen',
        'Bagatellisierung vermeiden',
        'Therapierefraktäre Fälle identifizieren'
    ]
};

export default MIGRAENE_TEMPLATE;