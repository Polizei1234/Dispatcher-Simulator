// =========================================================================================
// TEMPLATE: KREISLAUFKOLLAPS / SYNKOPE
// Beschreibung: Kurze Bewusstlosigkeit durch Kreislauf - meist harmlos
// =========================================================================================

export const KREISLAUFKOLLAPS_TEMPLATE = {
    id: 'kreislaufkollaps',
    kategorie: 'rd',
    stichwort: 'Kreislaufkollaps / Synkope',
    weight: 3,
    bagatell_potential: 0.5,
    
    anrufer: {
        typen: {
            zeuge: {
                probability: 0.45,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Jemand ist hier zusammengebrochen!',
                    'Eine Person ist umgekippt!',
                    'Jemand liegt hier am Boden!',
                    'Eine Frau ist ohnmächtig geworden!'
                ]
            },
            angehöriger: {
                probability: 0.30,
                speech_pattern: 'besorgt',
                variations: [
                    'Sie ist einfach umgekippt!',
                    'Er ist kurz bewusstlos geworden!',
                    'Sie ist zusammengesackt!',
                    'Er ist gestürzt und war kurz weg!'
                ]
            },
            patient_selbst: {
                probability: 0.20,
                speech_pattern: 'schwach_verwirrt',
                variations: [
                    'Mir ist gerade schwarz vor Augen geworden...',
                    'Ich bin umgekippt... mir ist schwindlig...',
                    'Ich war kurz weg...'
                ]
            },
            personal: {
                probability: 0.05,
                speech_pattern: 'professionell',
                variations: [
                    'Kundin mit Synkope, jetzt wieder wach.',
                    'Person kollabiert, kurzzeitig bewusstlos.'
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
            peak1: { mean: 25, stddev: 10, weight: 0.4 },
            peak2: { mean: 68, stddev: 12, weight: 0.6 },
            min: 14,
            max: 90
        },
        bewusstsein: {
            wieder_wach: { probability: 0.75 },
            verwirrt: { probability: 0.15 },
            noch_bewusstlos: { probability: 0.10 }
        }
    },
    
    synkopen_typ: {
        vasovagal: {
            probability: 0.50,
            ursachen: ['schreck', 'schmerz', 'anblick_blut', 'hitze', 'langes_stehen'],
            prodromalphase: true,
            prognose: 'harmlos'
        },
        orthostatisch: {
            probability: 0.25,
            ursachen: ['schnelles_aufstehen', 'dehydrierung', 'medikamente'],
            alter_gruppe: 'älter',
            prognose: 'meist_harmlos'
        },
        kardial: {
            probability: 0.15,
            ursachen: ['herzrhythmusstörung', 'stenose', 'herzinfarkt'],
            ohne_prodromalphase: true,
            prognose: 'ernst',
            red_flag: true
        },
        situativ: {
            probability: 0.05,
            ursachen: ['husten', 'miktion', 'defäkation'],
            prognose: 'harmlos'
        },
        andere: {
            probability: 0.05,
            ursachen: ['neurologisch', 'stoffwechsel']
        }
    },
    
    prodromalsymptome: {
        vorhanden: {
            probability: 0.60,
            symptome: {
                schwindel: { probability: 0.90 },
                übelkeit: { probability: 0.60 },
                schwitzen: { probability: 0.70 },
                schwarzwerden_vor_augen: { probability: 0.80 },
                ohrensausen: { probability: 0.50 }
            },
            note: 'Spricht für vasovagale Synkope'
        },
        keine: {
            probability: 0.40,
            note: 'Red Flag - kardiale Ursache?'
        }
    },
    
    auslöser: {
        langes_stehen: { probability: 0.20 },
        hitze: { probability: 0.15 },
        aufregung_schreck: { probability: 0.15 },
        blutentnahme_anblick: { probability: 0.10 },
        schnelles_aufstehen: { probability: 0.15 },
        schmerz: { probability: 0.08 },
        keine_erkennbar: { probability: 0.17 }
    },
    
    red_flags: {
        keine_prodromi: { probability: 0.40 },
        während_belastung: { probability: 0.15 },
        herzerkrankung_bekannt: { probability: 0.25 },
        familienanamnese_plötzlicher_tod: { probability: 0.05 },
        thoraxschmerz: { probability: 0.12 },
        palpitationen: { probability: 0.20 },
        hohes_alter: { probability: 0.30 }
    },
    
    verletzungen: {
        keine: { probability: 0.60 },
        leichte_prellungen: { probability: 0.25 },
        kopfplatzwunde: { probability: 0.10 },
        fraktur: { probability: 0.05 }
    },
    
    locations: {
        öffentlich: { probability: 0.45, address_types: ['street', 'shopping', 'public_place'] },
        zuhause: { probability: 0.35, address_types: ['residential'] },
        arbeitsplatz: { probability: 0.15, address_types: ['office', 'commercial'] },
        andere: { probability: 0.05 }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.10,
            triggers: ['kardiale_synkope', 'nicht_wieder_wach', 'thoraxschmerz']
        },
        transport_erforderlich: {
            ja: { probability: 0.70 },
            patient_lehnt_ab: { probability: 0.20 },
            nicht_nötig: { probability: 0.10 }
        },
        zielklinik: {
            standard: { probability: 0.85 },
            kardiologie: { probability: 0.15, bei: 'red_flags' }
        }
    },
    
    eskalation: {
        zweite_synkope: {
            probability: 0.10,
            announcement: 'Er ist schon wieder umgekippt!'
        },
        herzrhythmusstörung: {
            probability: 0.08,
            announcement: 'Das Herz schlägt ganz unregelmäßig!'
        },
        vollständige_erholung: {
            probability: 0.60,
            announcement: 'Es geht ihm wieder gut. Brauchen wir den Krankenwagen noch?'
        }
    },
    
    zeitfaktoren: {
        tageszeit_modifikator: {
            morgen_06_10: 1.3,
            mittag_heiß: 1.5,
            andere: 0.9
        },
        jahreszeit: {
            sommer: 1.3,
            andere: 0.9
        }
    },
    
    lernziele: [
        'Synkope vs. andere Bewusstlosigkeit',
        'Red Flags erkennen',
        'Kardiale vs. vasovagale Synkope',
        'Meist harmlos, aber Abklärung nötig',
        'Verletzungen durch Sturz beachten'
    ]
};

export default KREISLAUFKOLLAPS_TEMPLATE;