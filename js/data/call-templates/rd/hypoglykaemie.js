// =========================================================================================
// TEMPLATE: HYPOGLYKÄMIE (UNTERZUCKER)
// Beschreibung: Unterzuckerung bei Diabetikern - schnelle Hilfe erforderlich
// =========================================================================================

export const HYPOGLYKAEMIE_TEMPLATE = {
    id: 'hypoglykaemie',
    kategorie: 'rd',
    stichwort: 'Hypoglykämie / Unterzucker',
    weight: 3,
    
    anrufer: {
        typen: {
            angehöriger_erfahren: {
                probability: 0.45,
                speech_pattern: 'besorgt_sachlich',
                variations: [
                    'Mein Mann ist Diabetiker, er hat eine Unterzuckerung!',
                    'Sie ist verwirrt und schwitzt stark - das ist Unterzucker!',
                    'Er reagiert nicht richtig, ich denke es ist eine Hypo.',
                    'Meine Frau hat Unterzucker, ich kriege sie nicht wach!'
                ]
            },
            angehöriger_unsicher: {
                probability: 0.30,
                speech_pattern: 'panisch',
                variations: [
                    'Sie redet wirr und schwitzt! Was ist das?!',
                    'Er ist so komisch, ganz verwirrt! Ich hab Angst!',
                    'Sie zittert am ganzen Körper und ist nicht ansprechbar!'
                ]
            },
            arbeitskollege: {
                probability: 0.15,
                speech_pattern: 'unsicher',
                variations: [
                    'Meine Kollegin ist plötzlich umgekippt, sie ist Diabetikerin.',
                    'Er ist verwirrt und schwitzt stark, er hat Diabetes.'
                ]
            },
            pflegepersonal: {
                probability: 0.08,
                speech_pattern: 'professionell',
                variations: [
                    'Diabetiker mit Hypoglykämie, BZ 32, bewusstlos.',
                    'Bewohnerin mit schwerem Unterzucker, nicht ansprechbar.'
                ]
            },
            zeuge: {
                probability: 0.02,
                speech_pattern: 'unsicher',
                variations: [
                    'Jemand liegt hier verwirrt am Boden!',
                    'Eine Person ist kollabiert und zittert!'
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
            distribution: 'bimodal',
            peak1: { mean: 35, stddev: 15, weight: 0.3 },
            peak2: { mean: 65, stddev: 12, weight: 0.7 },
            min: 18,
            max: 90
        },
        bewusstsein: {
            wach_verwirrt: { probability: 0.30 },
            somnolent: { probability: 0.35 },
            bewusstlos: { probability: 0.30 },
            krampfend: { probability: 0.05 }
        }
    },
    
    symptome: {
        hauptsymptome: {
            schweißausbruch: { probability: 0.90 },
            verwirrtheit: { probability: 0.75 },
            bewusstseinsstörung: { probability: 0.65 }
        },
        begleitsymptome: {
            zittern: { probability: 0.70 },
            blässe: { probability: 0.60 },
            tachykardie: { probability: 0.80 },
            aggressivität: { probability: 0.20 },
            heißhunger: { probability: 0.25 },
            kopfschmerzen: { probability: 0.30 }
        }
    },
    
    ursachen: {
        insulin_überdosierung: {
            probability: 0.40,
            details: 'Zu viel gespritzt'
        },
        mahlzeit_ausgelassen: {
            probability: 0.30,
            details: 'Vergessen zu essen'
        },
        ungewohnte_anstrengung: {
            probability: 0.15,
            details: 'Sport, Arbeit'
        },
        medikamentenfehler: {
            probability: 0.10,
            details: 'Falsche Dosis, verwechselt'
        },
        andere: {
            probability: 0.05
        }
    },
    
    locations: {
        zuhause: { probability: 0.55, address_types: ['residential'] },
        arbeitsplatz: { probability: 0.20, address_types: ['office', 'commercial'] },
        pflegeheim: { probability: 0.15, address_types: ['care_home'] },
        öffentlich: { probability: 0.10, address_types: ['street', 'shop'] }
    },
    
    massnahmen: {
        ersthelfer: {
            zucker_gegeben: {
                probability: 0.40,
                erfolg: {
                    schnelle_besserung: 0.70,
                    keine_besserung: 0.30
                }
            },
            traubenzucker: { probability: 0.30 },
            saft_getrunken: { probability: 0.20 },
            nichts_unternommen: { probability: 0.10 }
        },
        rtw: {
            blutzucker_messung: { probability: 1.0 },
            glukose_iv: { probability: 0.70 },
            glukagon: { probability: 0.15 }
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        outcome: {
            schnelle_besserung: {
                probability: 0.60,
                transport: 'optional'
            },
            transport_erforderlich: {
                probability: 0.35
            },
            kritisch: {
                probability: 0.05,
                nef: true
            }
        }
    },
    
    zeitfaktoren: {
        tageszeit_modifikator: {
            morgen_06_10: 1.3,
            mittag_12_14: 0.8,
            abend_18_20: 1.2,
            nacht: 1.4
        }
    },
    
    eskalation: {
        krampfanfall: {
            probability: 0.08,
            announcement: 'Jetzt krampft er!'
        },
        bewusstlosigkeit: {
            probability: 0.15,
            announcement: 'Sie wird bewusstlos!'
        },
        schnelle_besserung: {
            probability: 0.25,
            announcement: 'Es geht ihm wieder besser, der Zucker wirkt!'
        }
    },
    
    lernziele: [
        'Schnelle Erkennung der Hypoglykämie',
        'Differenzierung zu anderen Bewusstseinsstörungen',
        'Zeitkritisches Handeln',
        'Anleitung zur Ersten Hilfe'
    ]
};

export default HYPOGLYKAEMIE_TEMPLATE;
