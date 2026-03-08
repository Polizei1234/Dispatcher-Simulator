// =========================================================================================
// TEMPLATE: LUNGENÖDEM (DEKOMPENSIERTE HERZINSUFFIZIENZ)
// Beschreibung: Akutes Lungenödem - "Wasser in der Lunge"
// =========================================================================================

export const LUNGENOEDEM_TEMPLATE = {
    id: 'lungenoedem',
    kategorie: 'rd',
    stichwort: 'Lungenödem / Dekompensierte Herzinsuffizienz',
    weight: 2,
    
    anrufer: {
        typen: {
            angehöriger_panisch: {
                probability: 0.65,
                speech_pattern: 'panisch',
                variations: [
                    'Sie bekommt keine Luft mehr und hustet Schaum!',
                    'Er ringt nach Luft! Es röchelt beim Atmen!',
                    'Sie erstickt! Sie ist ganz blau!',
                    'Er hustet rosa Schaum und bekommt keine Luft!'
                ],
                background_sounds: ['gurgling', 'gasping', 'coughing']
            },
            angehöriger: {
                probability: 0.25,
                speech_pattern: 'sehr_besorgt',
                variations: [
                    'Meine Frau ist Herzpatientin und bekommt schlecht Luft.',
                    'Er hat wieder Wasser in der Lunge, es wird schlimmer.'
                ]
            },
            pflegepersonal: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Patient mit akutem Lungenödem, SpO2 78%, Orthopnoe.',
                    'Bewohnerin mit dekompensierter Herzinsuffizienz, kritisch.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.54 },
            female: { probability: 0.46 }
        },
        alter: {
            distribution: 'normal',
            mean: 74,
            stddev: 10,
            min: 55,
            max: 95
        },
        bewusstsein: {
            wach_ängstlich: { probability: 0.60 },
            somnolent: { probability: 0.30 },
            bewusstlos: { probability: 0.10 }
        }
    },
    
    symptome: {
        hauptsymptome: {
            orthopnoe: { probability: 0.95 },
            rasselgeräusche: { probability: 0.90 },
            schaumiger_auswurf: { probability: 0.60 },
            zyanose: { probability: 0.50 }
        },
        begleitsymptome: {
            tachypnoe: { probability: 0.95 },
            tachykardie: { probability: 0.85 },
            angst: { probability: 0.90 },
            schwitzen: { probability: 0.70 },
            beinödeme: { probability: 0.75 }
        }
    },
    
    vorerkrankungen: {
        herzinsuffizienz: { probability: 0.90 },
        koronare_herzkrankheit: { probability: 0.60 },
        hypertonie: { probability: 0.80 },
        vorhofflimmern: { probability: 0.50 }
    },
    
    locations: {
        zuhause: { probability: 0.70, address_types: ['residential'] },
        pflegeheim: { probability: 0.25, address_types: ['care_home'] },
        öffentlich: { probability: 0.05, address_types: ['public_place'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 1, ktw: 0 },
        nef_indikation: {
            probability: 0.70,
            triggers: ['kritische_ateminsuffizienz', 'intubation_drohend']
        },
        zielklinik: {
            intensivstation: { probability: 0.80 },
            standard: { probability: 0.20 }
        }
    },
    
    eskalation: {
        reanimation: {
            probability: 0.08,
            announcement: 'Er reagiert nicht mehr!'
        },
        intubation: {
            probability: 0.15,
            note: 'Respiratorische Erschöpfung'
        }
    },
    
    zeitfaktoren: {
        tageszeit_modifikator: {
            nacht_02_06: 1.8,
            morgen: 1.2,
            tag: 0.9
        }
    }
};

export default LUNGENOEDEM_TEMPLATE;