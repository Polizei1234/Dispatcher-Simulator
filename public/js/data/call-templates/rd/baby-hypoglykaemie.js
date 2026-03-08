// =========================================================================================
// TEMPLATE: UNTERZUCKERUNG BEIM BABY/SÄUGLING
// Beschreibung: Hypoglykämie bei Neugeborenen - zeitkritisch
// =========================================================================================

export const BABY_HYPOGLYKAEMIE_TEMPLATE = {
    id: 'baby_hypoglykaemie',
    kategorie: 'rd',
    stichwort: 'Unterzuckerung Baby/Säugling',
    weight: 1,
    
    anrufer: {
        typen: {
            mutter_panisch: {
                probability: 0.70,
                speech_pattern: 'extrem_panisch',
                variations: [
                    'Mein Baby reagiert nicht richtig! Es ist so schlaff!',
                    'Sie trinkt nicht und ist ganz apathisch!',
                    'Mein Neugeborenes zittert am ganzen Körper!',
                    'Das Baby ist ganz blass und trinkt nicht mehr!',
                    'Er ist erst eine Woche alt und reagiert kaum!'
                ],
                background_sounds: ['baby_crying_weak', 'panic']
            },
            vater: {
                probability: 0.20,
                speech_pattern: 'sehr_besorgt',
                variations: [
                    'Unsere Tochter ist ganz schlapp, erst 3 Tage alt!',
                    'Das Baby wirkt leblos!'
                ]
            },
            hebamme: {
                probability: 0.08,
                speech_pattern: 'professionell',
                variations: [
                    'Hebamme hier, Neugeborenes mit V.a. Hypoglykämie, trinkt nicht.',
                    'Säugling 5 Tage alt, Hypoglykämie-Symptome, bitte RTW.'
                ]
            },
            kinderarzt: {
                probability: 0.02,
                speech_pattern: 'ärztlich',
                variations: [
                    'Kinderarzt, Säugling mit Hypoglykämie, Transport dringend.'
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
            distribution: 'uniform',
            min: 0,
            max: 3,
            einheit: 'monate',
            note: 'Meist erste Lebenstage/-wochen'
        },
        zustand: {
            apathisch: { probability: 0.40 },
            zittrig: { probability: 0.35 },
            schlaff: { probability: 0.25 }
        }
    },
    
    symptome: {
        neurologisch: {
            apathie: { probability: 0.70 },
            trinkschwäche: { probability: 0.80 },
            zittern_tremor: { probability: 0.60 },
            krampfanfall: { probability: 0.20 },
            schlaffe_muskulatur: { probability: 0.50 }
        },
        allgemein: {
            blässe: { probability: 0.65 },
            schwitzen: { probability: 0.45 },
            hypothermie: { probability: 0.40 },
            schwaches_schreien: { probability: 0.60 }
        },
        atmung: {
            apnoe_phasen: { probability: 0.30 },
            unregelmäßig: { probability: 0.40 }
        }
    },
    
    risikofaktoren: {
        frühgeburt: {
            probability: 0.30,
            note: 'Geringe Glykogenreserven'
        },
        diabetes_mutter: {
            probability: 0.25,
            note: 'Hyperinsulinismus'
        },
        mangelernährung: {
            probability: 0.20,
            ursachen: ['stillprobleme', 'zu_wenig_milch']
        },
        sepsis: {
            probability: 0.10,
            severity: 'kritisch'
        },
        klein_für_gestationsalter: {
            probability: 0.10
        },
        andere: {
            probability: 0.05
        }
    },
    
    schweregrad: {
        leicht: {
            probability: 0.30,
            bz: '40-50 mg/dl',
            symptome: 'leichte_trinkschwäche'
        },
        mittel: {
            probability: 0.45,
            bz: '30-40 mg/dl',
            symptome: 'apathie_zittern'
        },
        schwer: {
            probability: 0.25,
            bz: '<30 mg/dl',
            symptome: 'krampf_bewusstlosigkeit',
            hirnschaden_risiko: true
        }
    },
    
    locations: {
        zuhause: { probability: 0.85, address_types: ['residential'] },
        kinderarztpraxis: { probability: 0.10, address_types: ['medical'] },
        andere: { probability: 0.05 }
    },
    
    besonderheiten: {
        erstgeburt: {
            probability: 0.60,
            note: 'Eltern unerfahren, große Sorge'
        },
        stillprobleme: {
            probability: 0.50,
            details: 'Baby nimmt Brust nicht, zu wenig Milch'
        },
        gewichtsverlust: {
            probability: 0.40,
            note: '>10% nach Geburt'
        },
        neugeborenen_gelbsucht: {
            probability: 0.30,
            koexistiert: 'oft'
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.20,
            triggers: ['krampfanfall', 'apnoe', 'bewusstlosigkeit', 'kritisch']
        },
        baby_notarzt_wagen: {
            probability: 0.40,
            optimal: 'Bei Verfügbarkeit'
        },
        zielklinik: {
            kinderklinik: { probability: 0.90 },
            perinatalzentrum: { probability: 0.10, bei: 'frühgeburt' }
        }
    },
    
    transport_besonderheiten: {
        wärmeerhalt: {
            note: 'Wärmematte, Decken',
            kritisch: 'Neugeborene kühlen schnell aus'
        },
        eltern_begleitung: {
            probability: 1.0,
            note: 'Mutter mitfahren, Stillen ermöglichen'
        },
        glukose_gabe: {
            note: 'Rettungsdienst i.v. oder Glukosegel oral',
            zeitkritisch: true
        }
    },
    
    eskalation: {
        krampfanfall: {
            probability: 0.15,
            announcement: 'Das Baby krampft jetzt!'
        },
        apnoe: {
            probability: 0.10,
            announcement: 'Es atmet nicht mehr richtig!'
        },
        besserung_durch_nahrung: {
            probability: 0.20,
            announcement: 'Nach dem Stillen geht es besser!',
            note: 'Trotzdem Transport zur Abklärung'
        }
    },
    
    komplikationen: {
        hirnschädigung: {
            probability: 0.05,
            bei: 'schwere_langdauernde_hypoglykämie',
            langzeitfolgen: 'möglich'
        },
        rezidiv: {
            probability: 0.30,
            note: 'Wiederholte Episoden'
        }
    },
    
    lernziele: [
        'Hypoglykämie beim Baby erkennen',
        'Zeitkritisches Handeln',
        'Kinderklinik als Ziel',
        'Besondere Vorsicht bei Neugeborenen',
        'Eltern beruhigen und aufklären'
    ]
};

export default BABY_HYPOGLYKAEMIE_TEMPLATE;