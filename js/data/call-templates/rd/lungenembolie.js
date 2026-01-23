// =========================================================================================
// TEMPLATE: LUNGENEMBOLIE
// Beschreibung: Blutgerinnsel in Lungenarterie - lebensbedrohlich
// =========================================================================================

export const LUNGENEMBOLIE_TEMPLATE = {
    id: 'lungenembolie',
    kategorie: 'rd',
    stichwort: 'Lungenembolie',
    weight: 1,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.20,
                speech_pattern: 'atemlos',
                variations: [
                    '*keuchend* Ich... bekomme... plötzlich... keine... Luft!',
                    'Meine... Brust... tut... weh... beim... Atmen...'
                ]
            },
            angehöriger_panisch: {
                probability: 0.60,
                speech_pattern: 'panisch',
                variations: [
                    'Er bekommt plötzlich keine Luft mehr und hat Brustschmerzen!',
                    'Sie ringt nach Luft und hat Angst zu sterben!',
                    'Er ist gerade zusammengebrochen und bekommt keine Luft!',
                    'Sie hatte eine OP und bekommt jetzt plötzlich keine Luft!'
                ]
            },
            pflegepersonal: {
                probability: 0.15,
                speech_pattern: 'professionell',
                variations: [
                    'Patient post-OP mit akuter Dyspnoe, V.a. Lungenembolie.',
                    'Bewohnerin mit plötzlicher Atemnot, Thoraxschmerz, SpO2 85%.'
                ]
            },
            hausarzt: {
                probability: 0.05,
                speech_pattern: 'ärztlich',
                variations: [
                    'Ich habe Patientin mit hochgradigem V.a. Lungenembolie, sofort RTW.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.45 },
            female: { probability: 0.55 }
        },
        alter: {
            distribution: 'normal',
            mean: 64,
            stddev: 15,
            min: 25,
            max: 90
        },
        bewusstsein: {
            wach: { probability: 0.70 },
            verwirrt: { probability: 0.20 },
            bewusstlos: { probability: 0.10 }
        }
    },
    
    symptome: {
        hauptsymptome: {
            akute_dyspnoe: { probability: 0.95 },
            thoraxschmerz: { probability: 0.70 },
            plötzlicher_beginn: { probability: 0.90 }
        },
        begleitsymptome: {
            tachypnoe: { probability: 0.90 },
            tachykardie: { probability: 0.85 },
            angst: { probability: 0.80 },
            husten: { probability: 0.40 },
            hämoptyse: { probability: 0.15 },
            zyanose: { probability: 0.30 },
            synkope: { probability: 0.20 }
        }
    },
    
    risikofaktoren: {
        immobilisation: {
            probability: 0.40,
            details: 'Bettlägerigkeit, Gipsverband, lange Reise'
        },
        operation: {
            probability: 0.35,
            details: 'Besonders orthopädisch, abdominal'
        },
        thrombose_anamnese: {
            probability: 0.25
        },
        malignome: {
            probability: 0.20
        },
        kontrazeptiva: {
            probability: 0.15,
            nur_frauen: true
        },
        adipositas: {
            probability: 0.25
        },
        andere: {
            probability: 0.10
        }
    },
    
    schweregrad: {
        klein_subsegmental: {
            probability: 0.20,
            severity: 'leicht-mittel',
            hämodynamik: 'stabil'
        },
        mittelgroß: {
            probability: 0.50,
            severity: 'mittel-schwer',
            hämodynamik: 'meist_stabil'
        },
        groß_massiv: {
            probability: 0.30,
            severity: 'kritisch',
            hämodynamik: 'instabil',
            schock_gefahr: true
        }
    },
    
    locations: {
        zuhause: { probability: 0.50, address_types: ['residential'] },
        krankenhaus: { probability: 0.20, address_types: ['hospital'] },
        pflegeheim: { probability: 0.20, address_types: ['care_home'] },
        öffentlich: { probability: 0.10, address_types: ['public_place'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 1, ktw: 0 },
        nef_indikation: {
            probability: 0.60,
            triggers: ['instabilität', 'schock', 'massive_embolie']
        },
        zielklinik: {
            intensivstation: { probability: 0.50 },
            standard_monitored: { probability: 0.50 }
        }
    },
    
    eskalation: {
        schock: {
            probability: 0.20,
            announcement: 'Der Blutdruck fällt! Er wird ganz blass!'
        },
        reanimation: {
            probability: 0.08,
            announcement: 'Er reagiert nicht mehr!'
        }
    },
    
    lernziele: [
        'Lungenembolie als Notfall erkennen',
        'Risikofaktoren erfragen',
        'Hohe NEF-Indikation',
        'Zeitkritische Behandlung'
    ]
};

export default LUNGENEMBOLIE_TEMPLATE;