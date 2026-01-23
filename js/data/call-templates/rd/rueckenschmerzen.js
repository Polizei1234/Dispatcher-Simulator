// =========================================================================================
// TEMPLATE: RÜCKENSCHMERZEN AKUT
// Beschreibung: Akute Rückenschmerzen - meist harmlos, Red Flags beachten
// =========================================================================================

export const RUECKENSCHMERZEN_TEMPLATE = {
    id: 'rueckenschmerzen',
    kategorie: 'rd',
    stichwort: 'Rückenschmerzen akut',
    weight: 2,
    bagatell_potential: 0.5,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.50,
                speech_pattern: 'gequält',
                variations: [
                    'Ich habe wahnsinnige Rückenschmerzen!',
                    'Mein Rücken! Ich kann mich nicht mehr bewegen!',
                    'Ich bin eingeklemmt! Hexenschuss!',
                    'Mein Rücken schmerzt so stark, ich komme nicht mehr hoch!'
                ]
            },
            angehöriger: {
                probability: 0.45,
                speech_pattern: 'besorgt',
                variations: [
                    'Er hat sich den Rücken verhoben und kann nicht mehr aufstehen!',
                    'Sie schreit vor Rückenschmerzen!',
                    'Er liegt am Boden, Rückenschmerzen, kann nicht aufstehen!'
                ]
            },
            hausarzt: {
                probability: 0.05,
                speech_pattern: 'ärztlich',
                variations: [
                    'Hausarzt, Patient mit akutem Rücken, V.a. Bandscheibenvorfall, Lähmungen.'
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
            distribution: 'normal',
            mean: 48,
            stddev: 15,
            min: 20,
            max: 80
        },
        bewusstsein: {
            wach: { probability: 0.98 },
            verwirrt: { probability: 0.02 }
        }
    },
    
    schmerzlokalisation: {
        lws: { probability: 0.70, note: 'Lendenwirbelsäule' },
        bws: { probability: 0.15, note: 'Brustwirbelsäule' },
        hws: { probability: 0.10, note: 'Halswirbelsäule' },
        diffus: { probability: 0.05 }
    },
    
    ursachen: {
        muskulär: {
            probability: 0.60,
            beispiele: ['verspannung', 'zerrung', 'hexenschuss'],
            prognose: 'harmlos'
        },
        bandscheibenvorfall: {
            probability: 0.20,
            symptome: ['ischialgie', 'ausstrahlung', 'lähmungen_möglich'],
            prognose: 'ernst'
        },
        wirbelkörperfraktur: {
            probability: 0.05,
            risiko: 'osteoporose_trauma',
            prognose: 'ernst'
        },
        andere_gefährlich: {
            probability: 0.05,
            beispiele: ['aortenaneurysma', 'nierenstein', 'tumor'],
            red_flags: true
        },
        andere_harmlos: {
            probability: 0.10
        }
    },
    
    red_flags: {
        lähmungen: { probability: 0.08 },
        reithosenanästhesie: { probability: 0.02 },
        blasen_darmstörung: { probability: 0.03 },
        nachts_schlimmer: { probability: 0.10 },
        gewichtsverlust: { probability: 0.05 },
        trauma: { probability: 0.12 },
        pulsierender_schmerz: { probability: 0.03 }
    },
    
    begleitsymptome: {
        ausstrahlung_bein: { probability: 0.35 },
        taubheitsgefühle: { probability: 0.20 },
        bewegungseinschränkung: { probability: 0.80 },
        muskelverspannung: { probability: 0.70 }
    },
    
    locations: {
        zuhause: { probability: 0.75, address_types: ['residential'] },
        arbeitsplatz: { probability: 0.15, address_types: ['office', 'commercial'] },
        andere: { probability: 0.10 }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.03,
            triggers: ['akute_querschnittslähmung', 'aortenaneurysma_ruptur']
        },
        transport_notwendig: {
            ja_red_flags: { probability: 1.0 },
            ja_starke_schmerzen: { probability: 0.70 },
            fraglich: { probability: 0.30 }
        },
        zielklinik: {
            standard: { probability: 0.85 },
            neurochirurgie: { probability: 0.15, bei: 'red_flags' }
        }
    },
    
    lernziele: [
        'Meist harmlos - muskuloskelettal',
        'Red Flags erkennen!',
        'Lähmungen = Notfall',
        'Schmerzen können extrem sein',
        'Transport oft schwierig (Lagerung)'
    ]
};

export default RUECKENSCHMERZEN_TEMPLATE;