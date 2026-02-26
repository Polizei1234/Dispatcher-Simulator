// =========================================================================================
// TEMPLATE: DROGEN-INTOXIKATION
// Beschreibung: Überdosis illegaler Drogen - vielfältige Symptome
// =========================================================================================

export const DROGEN_INTOXIKATION_TEMPLATE = {
    id: 'drogen_intoxikation',
    kategorie: 'rd',
    stichwort: 'Drogen-Intoxikation / Überdosis',
    weight: 2,
    
    anrufer: {
        typen: {
            freund_panisch: {
                probability: 0.50,
                speech_pattern: 'panisch_ängstlich',
                variations: [
                    'Mein Freund hat was genommen und reagiert nicht mehr!',
                    'Sie hat zu viel konsumiert! Sie atmet kaum noch!',
                    'Er hat irgendwas genommen und krampft jetzt!',
                    'Sie ist nach Drogenkonsum bewusstlos!'
                ],
                background_sounds: ['music', 'party', 'panic']
            },
            angehöriger: {
                probability: 0.25,
                speech_pattern: 'verzweifelt',
                variations: [
                    'Ich habe meinen Sohn bewusstlos gefunden! Ich glaube Drogen!',
                    'Meine Tochter liegt hier! Spritzen daneben!',
                    'Er atmet ganz flach! Ich weiß er nimmt Drogen!'
                ]
            },
            zeuge: {
                probability: 0.15,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Jemand liegt hier bewusstlos! Spritzen daneben!',
                    'Person auf Toilette zusammengebrochen!',
                    'Jemand hat Schaum vor dem Mund!'
                ]
            },
            polizei: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Polizei vor Ort, bewusstlose Person, V.a. Drogenintoxikation.',
                    'Drogenüberdosis, Patient nicht ansprechbar, Atemfrequenz niedrig.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.68 },
            female: { probability: 0.32 }
        },
        alter: {
            distribution: 'normal',
            mean: 28,
            stddev: 10,
            min: 15,
            max: 55
        },
        bewusstsein: {
            wach_agitiert: { probability: 0.25 },
            wach_apathisch: { probability: 0.15 },
            somnolent: { probability: 0.30 },
            bewusstlos: { probability: 0.30 }
        }
    },
    
    drogentyp: {
        opioide: {
            probability: 0.35,
            substanzen: ['heroin', 'fentanyl', 'oxycodon'],
            symptome: {
                atemdepression: { probability: 0.90 },
                miosis: { probability: 0.85 },
                bewusstlosigkeit: { probability: 0.70 },
                zyanose: { probability: 0.50 }
            },
            antidot: 'naloxon'
        },
        stimulanzien: {
            probability: 0.25,
            substanzen: ['kokain', 'amphetamin', 'mdma'],
            symptome: {
                tachykardie: { probability: 0.90 },
                hypertonie: { probability: 0.85 },
                agitation: { probability: 0.80 },
                hyperthermie: { probability: 0.60 },
                krampfanfall: { probability: 0.25 }
            }
        },
        cannabis: {
            probability: 0.15,
            symptome: {
                angst: { probability: 0.70 },
                tachykardie: { probability: 0.60 },
                verwirrtheit: { probability: 0.50 }
            },
            severity: 'meist_leicht'
        },
        synthetische: {
            probability: 0.15,
            substanzen: ['spice', 'k2', 'badesalze'],
            symptome: {
                agitation: { probability: 0.80 },
                psychose: { probability: 0.60 },
                krampfanfall: { probability: 0.40 },
                tachykardie: { probability: 0.85 }
            },
            unberechenbar: true
        },
        ghb_gbl: {
            probability: 0.05,
            symptome: {
                bewusstlosigkeit: { probability: 0.80 },
                atemdepression: { probability: 0.50 },
                bradykardie: { probability: 0.40 }
            }
        },
        mischkonsum: {
            probability: 0.05,
            note: 'Mehrere Substanzen',
            severity: 'besonders_gefährlich'
        }
    },
    
    komplikationen: {
        atemstillstand: {
            probability: 0.15,
            bei: 'opioide',
            severity: 'lebensbedrohlich'
        },
        krampfanfall: {
            probability: 0.20,
            bei: 'stimulanzien_synthetische'
        },
        herzinfarkt: {
            probability: 0.08,
            bei: 'kokain'
        },
        hyperthermie: {
            probability: 0.15,
            bei: 'mdma_amphetamin'
        },
        aspirationspneumonie: {
            probability: 0.10,
            bei: 'bewusstlosigkeit'
        }
    },
    
    locations: {
        wohnung: { probability: 0.45, address_types: ['residential'] },
        öffentliche_toilette: { probability: 0.20, address_types: ['public_toilet'] },
        club_party: { probability: 0.15, address_types: ['club', 'party'] },
        park_strasse: { probability: 0.15, address_types: ['park', 'street'] },
        andere: { probability: 0.05 }
    },
    
    besonderheiten: {
        drogenutensilien: {
            probability: 0.60,
            types: ['spritzen', 'pfeife', 'alufolie', 'pulver']
        },
        mehrere_personen: {
            probability: 0.25,
            note: 'Andere Konsumenten vor Ort',
            weitere_patienten_möglich: true
        },
        aggressivität: {
            probability: 0.30,
            bei: 'stimulanzien_synthetische',
            polizei_erforderlich: true
        },
        nadelverletzung_gefahr: {
            probability: 0.40,
            note: 'Eigenschutz! Handschuhe!'
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.30,
            triggers: ['bewusstlosigkeit', 'ateminsuffizienz', 'krampfanfall', 'instabil']
        },
        polizei: {
            probability: 0.60,
            reasons: ['aggressivität', 'illegale_substanzen', 'selbstgefährdung']
        }
    },
    
    eskalation: {
        atemstillstand: {
            probability: 0.15,
            announcement: 'Er atmet nicht mehr!',
            bei: 'opioide'
        },
        krampfanfall: {
            probability: 0.18,
            announcement: 'Sie krampft jetzt!',
            bei: 'stimulanzien'
        },
        aggressiv: {
            probability: 0.25,
            announcement: 'Er wird aggressiv! Ich habe Angst!',
            polizei_nachfordern: true
        },
        weiterer_patient: {
            probability: 0.15,
            announcement: 'Noch jemand liegt hier bewusstlos!'
        }
    },
    
    zeitfaktoren: {
        tageszeit_modifikator: {
            nacht_22_06: 2.0,
            abend_18_22: 1.5,
            tag: 0.6
        },
        wochentag: {
            wochenende: 1.8,
            werktags: 0.8
        }
    },
    
    lernziele: [
        'Verschiedene Drogentypen erkennen',
        'Opioid-Intoxikation (Naloxon)',
        'Eigenschutz (Nadeln, Aggression)',
        'Polizei bei Bedarf',
        'Mehrere Patienten möglich'
    ]
};

export default DROGEN_INTOXIKATION_TEMPLATE;