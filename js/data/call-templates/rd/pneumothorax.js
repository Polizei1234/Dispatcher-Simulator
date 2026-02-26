// =========================================================================================
// TEMPLATE: PNEUMOTHORAX
// Beschreibung: Luft im Pleuraspalt - spontan oder nach Trauma
// =========================================================================================

export const PNEUMOTHORAX_TEMPLATE = {
    id: 'pneumothorax',
    kategorie: 'rd',
    stichwort: 'Pneumothorax',
    weight: 1,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.30,
                speech_pattern: 'atemlos',
                variations: [
                    'Ich bekomme plötzlich schlecht Luft und habe Schmerzen beim Atmen!',
                    'Meine Brust tut weh und ich bekomme keine Luft!',
                    'Ich hatte das schon mal - Pneumothorax! Es fühlt sich gleich an!'
                ]
            },
            angehöriger: {
                probability: 0.55,
                speech_pattern: 'besorgt',
                variations: [
                    'Er bekommt plötzlich keine Luft mehr nach einem Sturz!',
                    'Sie hat einseitige Brustschmerzen und Atemnot!',
                    'Er ist sehr groß und dünn und hat plötzlich Atemnot!'
                ]
            },
            pflegepersonal: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Patient mit V.a. Pneumothorax, einseitig aufgehobenes Atemgeräusch.',
                    'Bewohnerin mit plötzlicher Dyspnoe, asymmetrischer Thorax.'
                ]
            },
            zeuge: {
                probability: 0.05,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Jemand ist nach einem Unfall zusammengebrochen!'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.80 },
            female: { probability: 0.20 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 25, stddev: 8, weight: 0.6 },
            peak2: { mean: 65, stddev: 10, weight: 0.4 },
            min: 15,
            max: 85
        },
        bewusstsein: {
            wach: { probability: 0.90 },
            verwirrt: { probability: 0.08 },
            bewusstlos: { probability: 0.02 }
        }
    },
    
    typ: {
        spontan_primär: {
            probability: 0.50,
            details: 'Junge, große, schlanke Männer',
            severity: 'leicht-mittel'
        },
        spontan_sekundär: {
            probability: 0.30,
            details: 'Bei COPD, Asthma',
            severity: 'mittel-schwer'
        },
        traumatisch: {
            probability: 0.20,
            details: 'Nach Unfall, Rippenfraktur',
            severity: 'schwer'
        }
    },
    
    symptome: {
        hauptsymptome: {
            einseitiger_thoraxschmerz: { probability: 0.90 },
            dyspnoe: { probability: 0.85 },
            plötzlicher_beginn: { probability: 0.80 }
        },
        begleitsymptome: {
            tachypnoe: { probability: 0.70 },
            tachykardie: { probability: 0.60 },
            asymmetrischer_thorax: { probability: 0.40 },
            husten: { probability: 0.30 },
            hautblässe: { probability: 0.35 }
        }
    },
    
    schweregrad: {
        klein: {
            probability: 0.40,
            severity: 'leicht',
            details: '< 20%'
        },
        mittel: {
            probability: 0.35,
            severity: 'mittel',
            details: '20-50%'
        },
        groß: {
            probability: 0.20,
            severity: 'schwer',
            details: '> 50%'
        },
        spannungspneumothorax: {
            probability: 0.05,
            severity: 'kritisch',
            lebensbedrohlich: true
        }
    },
    
    locations: {
        zuhause: { probability: 0.50, address_types: ['residential'] },
        öffentlich: { probability: 0.25, address_types: ['street', 'sports'] },
        unfallstelle: { probability: 0.15, address_types: ['accident'] },
        pflegeheim: { probability: 0.10, address_types: ['care_home'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.15,
            triggers: ['spannungspneumothorax', 'trauma', 'instabilität']
        },
        zielklinik: {
            chirurgie: { probability: 0.70 },
            standard: { probability: 0.30 }
        }
    },
    
    eskalation: {
        spannungspneumothorax: {
            probability: 0.08,
            announcement: 'Er wird immer blauer! Die Atemnot wird schlimmer!',
            severity: 'kritisch'
        },
        schock: {
            probability: 0.05,
            announcement: 'Der Puls wird ganz schwach!'
        }
    },
    
    besonderheiten: {
        rezidiv: {
            probability: 0.30,
            note: 'Bereits früher Pneumothorax'
        },
        vorerkrankungen: {
            copd: { probability: 0.25 },
            asthma: { probability: 0.15 },
            marfan_syndrom: { probability: 0.02 }
        }
    }
};

export default PNEUMOTHORAX_TEMPLATE;