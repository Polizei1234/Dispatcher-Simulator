// =========================================================================================
// TEMPLATE: ANGINA PECTORIS
// Beschreibung: Brustschmerzen durch Durchblutungsstörung - kann zu Herzinfarkt führen
// =========================================================================================

export const ANGINA_PECTORIS_TEMPLATE = {
    id: 'angina_pectoris',
    kategorie: 'rd',
    stichwort: 'Angina Pectoris',
    weight: 2,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.40,
                speech_pattern: 'besorgt',
                variations: [
                    'Ich habe wieder diese Brustschmerzen, wie neulich.',
                    'Es drückt in der Brust, das kenne ich schon.',
                    'Die Nitro-Kapsel hilft nicht richtig diesmal.',
                    'Ich habe Druck auf der Brust und bin kurzatmig.'
                ]
            },
            angehöriger: {
                probability: 0.50,
                speech_pattern: 'besorgt',
                variations: [
                    'Mein Mann hat seine bekannten Herzschmerzen, aber stärker.',
                    'Sie hat Brustschmerzen und Angst, sie ist Herzpatientin.',
                    'Er hat wieder Angina-Beschwerden, diesmal länger als sonst.',
                    'Ihre Herzschmerzen gehen nicht weg mit dem Spray!'
                ]
            },
            pflegepersonal: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Patient mit bekannter KHK, akute pectanginöse Beschwerden.',
                    'Bewohner klagt über thorakale Schmerzen, Nitro gegeben.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.65 },
            female: { probability: 0.35 }
        },
        alter: {
            distribution: 'normal',
            mean: 68,
            stddev: 10,
            min: 45,
            max: 90
        },
        bewusstsein: {
            wach: { probability: 0.95 },
            verwirrt: { probability: 0.05 }
        }
    },
    
    symptome: {
        brustschmerz: {
            retrosternal: { probability: 0.70 },
            linksthorakal: { probability: 0.25 },
            diffus: { probability: 0.05 }
        },
        charakteristik: {
            druck: { probability: 0.60 },
            enge: { probability: 0.30 },
            brennen: { probability: 0.10 }
        },
        ausstrahlung: {
            linker_arm: { probability: 0.40 },
            kiefer: { probability: 0.20 },
            rücken: { probability: 0.15 },
            keine: { probability: 0.25 }
        },
        begleitsymptome: {
            dyspnoe: { probability: 0.50 },
            schwitzen: { probability: 0.30 },
            angst: { probability: 0.40 },
            übelkeit: { probability: 0.20 }
        }
    },
    
    besonderheiten: {
        bekannte_khk: { probability: 0.80 },
        nitro_zuhause: { probability: 0.70 },
        nitro_genommen: {
            probability: 0.60,
            wirkung: {
                besserung: 0.40,
                keine_wirkung: 0.60
            }
        },
        vorheriger_infarkt: { probability: 0.35 },
        stents: { probability: 0.40 },
        bypass_op: { probability: 0.20 }
    },
    
    locations: {
        zuhause: { probability: 0.70, address_types: ['residential'] },
        öffentlich: { probability: 0.20, address_types: ['street', 'shop'] },
        pflegeheim: { probability: 0.10, address_types: ['care_home'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.10,
            triggers: ['keine_besserung_nitro', 'ekg_veränderungen', 'instabil']
        }
    },
    
    eskalation: {
        verschlechterung_infarkt: {
            probability: 0.20,
            announcement: 'Die Schmerzen werden stärker! Es wird nicht besser!',
            template_change: 'herzinfarkt'
        },
        besserung: {
            probability: 0.30,
            announcement: 'Es wird etwas besser nach der Nitro-Gabe.'
        }
    },
    
    zeitfaktoren: {
        tageszeit_modifikator: {
            morgen: 1.3,
            tag: 1.0,
            abend: 1.1,
            nacht: 1.2
        },
        auslöser: {
            belastung: { probability: 0.50 },
            stress: { probability: 0.25 },
            kälte: { probability: 0.15 },
            ruhe: { probability: 0.10 }
        }
    }
};

export default ANGINA_PECTORIS_TEMPLATE;
