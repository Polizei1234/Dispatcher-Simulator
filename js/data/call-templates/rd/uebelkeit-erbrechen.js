// =========================================================================================
// TEMPLATE: ÜBELKEIT / ERBRECHEN
// Beschreibung: Persistierendes Erbrechen - Exsikkose-Gefahr
// =========================================================================================

export const UEBELKEIT_ERBRECHEN_TEMPLATE = {
    id: 'uebelkeit_erbrechen',
    kategorie: 'rd',
    stichwort: 'Übelkeit / Erbrechen',
    weight: 2,
    bagatell_potential: 0.4,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.40,
                speech_pattern: 'schwach',
                variations: [
                    'Ich erbreche ständig und kann nichts bei mir behalten...',
                    'Mir ist so übel... ich erbreche seit Stunden...',
                    'Ich kann nicht aufhören zu erbrechen...'
                ]
            },
            angehöriger: {
                probability: 0.55,
                speech_pattern: 'besorgt',
                variations: [
                    'Sie erbricht ständig und ist ganz schwäch!',
                    'Er kann nichts bei sich behalten, erbricht alles!',
                    'Mein Kind erbricht ständig!',
                    'Sie ist total ausgetrocknet vom Erbrechen!'
                ]
            },
            pflegepersonal: {
                probability: 0.05,
                speech_pattern: 'professionell',
                variations: [
                    'Bewohnerin mit unstillbarem Erbrechen, exsikkiert.'
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
            distribution: 'bimodal',
            peak1: { mean: 8, stddev: 5, weight: 0.2 },
            peak2: { mean: 45, stddev: 20, weight: 0.8 },
            min: 1,
            max: 85
        },
        bewusstsein: {
            wach: { probability: 0.85 },
            apathisch: { probability: 0.12 },
            bewusstlos: { probability: 0.03 }
        }
    },
    
    ursachen: {
        gastroenteritis: { probability: 0.45 },
        lebensmittelvergiftung: { probability: 0.15 },
        schwangerschaft: { probability: 0.10, nur_frauen: true },
        medikamente: { probability: 0.08 },
        intoxikation: { probability: 0.05 },
        andere_erkrankung: { probability: 0.17 }
    },
    
    schweregrad: {
        leicht: {
            probability: 0.35,
            häufigkeit: 'gelegentlich',
            flüssigkeit: 'oral_möglich'
        },
        mittel: {
            probability: 0.45,
            häufigkeit: 'häufig',
            exsikkose: 'beginnend'
        },
        schwer: {
            probability: 0.20,
            häufigkeit: 'unstillbar',
            exsikkose: 'ausgeprägt',
            infusion_zwingend: true
        }
    },
    
    begleitsymptome: {
        durchfall: { probability: 0.60 },
        bauchschmerzen: { probability: 0.55 },
        fieber: { probability: 0.35 },
        kopfschmerzen: { probability: 0.40 },
        schwindel: { probability: 0.50 },
        schwäche: { probability: 0.70 }
    },
    
    exsikkose_zeichen: {
        mundtrockenheit: { probability: 0.60 },
        verminderte_urinproduktion: { probability: 0.50 },
        stehende_hautfalten: { probability: 0.30 },
        schwäche: { probability: 0.70 },
        verwirrtheit: { probability: 0.15 }
    },
    
    locations: {
        zuhause: { probability: 0.85, address_types: ['residential'] },
        öffentlich: { probability: 0.10, address_types: ['public_place'] },
        andere: { probability: 0.05 }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        transport_notwendig: {
            ja: { probability: 0.70 },
            fraglich: { probability: 0.30 }
        },
        zielklinik: {
            standard: { probability: 1.0 }
        }
    },
    
    lernziele: [
        'Exsikkose-Zeichen erkennen',
        'Schweregrad einschätzen',
        'Kinder und Ältere besonders gefährdet',
        'Häufig banal, aber manchmal kritisch'
    ]
};

export default UEBELKEIT_ERBRECHEN_TEMPLATE;