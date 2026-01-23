// =========================================================================================
// TEMPLATE: BEWUSSTLOSIGKEIT (UNKLARE URSACHE)
// Beschreibung: Person bewusstlos - Ursache unklar
// =========================================================================================

export const BEWUSSTLOSIGKEIT_UNKLAR_TEMPLATE = {
    id: 'bewusstlosigkeit_unklar',
    kategorie: 'rd',
    stichwort: 'Bewusstlosigkeit (unklare Ursache)',
    weight: 2,
    
    anrufer: {
        typen: {
            zeuge_panisch: {
                probability: 0.50,
                speech_pattern: 'panisch',
                variations: [
                    'Jemand liegt hier bewusstlos!',
                    'Eine Person reagiert nicht!',
                    'Hilfe! Jemand ist bewusstlos!',
                    'Jemand liegt regungslos am Boden!'
                ]
            },
            angehöriger_panisch: {
                probability: 0.40,
                speech_pattern: 'sehr_panisch',
                variations: [
                    'Mein Mann reagiert nicht mehr!',
                    'Sie ist bewusstlos! Ich bekomme sie nicht wach!',
                    'Er liegt am Boden und bewegt sich nicht!'
                ]
            },
            polizei: {
                probability: 0.08,
                speech_pattern: 'professionell',
                variations: [
                    'Polizei, bewusstlose Person aufgefunden.'
                ]
            },
            personal: {
                probability: 0.02,
                speech_pattern: 'sachlich',
                variations: [
                    'Person hier bewusstlos zusammengebrochen.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.55 },
            female: { probability: 0.45 }
        },
        alter: {
            distribution: 'uniform',
            min: 18,
            max: 85
        },
        zustand: {
            bewusstlos_atmend: { probability: 0.75 },
            bewusstlos_keine_atmung: { probability: 0.15 },
            somnolent: { probability: 0.10 }
        }
    },
    
    mögliche_ursachen: {
        synkope: { probability: 0.25 },
        hypoglykämie: { probability: 0.15 },
        intoxikation: { probability: 0.15 },
        schlaganfall: { probability: 0.12 },
        krampfanfall: { probability: 0.10 },
        herzrhythmusstörung: { probability: 0.08 },
        trauma: { probability: 0.08 },
        andere: { probability: 0.07 }
    },
    
    atmung: {
        normal: { probability: 0.65 },
        flach: { probability: 0.20 },
        schnappatmung: { probability: 0.08 },
        keine: { probability: 0.07 }
    },
    
    locations: {
        öffentlich: { probability: 0.45, address_types: ['street', 'public_place'] },
        zuhause: { probability: 0.40, address_types: ['residential'] },
        arbeitsplatz: { probability: 0.10, address_types: ['office'] },
        andere: { probability: 0.05 }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 1, ktw: 0 },
        nef_indikation: {
            probability: 0.80,
            triggers: ['bewusstlosigkeit_ungeklärt']
        },
        reanimation: {
            probability: 0.10,
            bei: 'keine_atmung'
        }
    },
    
    eskalation: {
        reanimation: {
            probability: 0.10,
            announcement: 'Er atmet nicht mehr!'
        },
        wacht_auf: {
            probability: 0.30,
            announcement: 'Sie wacht auf!'
        }
    },
    
    lernziele: [
        'Bewusstlosigkeit = potenziell kritisch',
        'Atmung prüfen!',
        'Viele mögliche Ursachen',
        'NEF häufig erforderlich'
    ]
};

export default BEWUSSTLOSIGKEIT_UNKLAR_TEMPLATE;