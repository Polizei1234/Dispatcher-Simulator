// =========================================================================================
// TEMPLATE: MENINGITIS / ENZEPHALITIS
// Beschreibung: Hirnhautentzündung - potentiell lebensbedrohlich
// =========================================================================================

export const MENINGITIS_TEMPLATE = {
    id: 'meningitis',
    kategorie: 'rd',
    stichwort: 'Meningitis / Hirnhautentzündung',
    weight: 1,
    
    anrufer: {
        typen: {
            angehöriger_besorgt: {
                probability: 0.70,
                speech_pattern: 'sehr_besorgt',
                variations: [
                    'Sie hat starke Kopfschmerzen, hohes Fieber und Nackensteife!',
                    'Er ist verwirrt, hat Fieber und kann den Kopf nicht bewegen!',
                    'Meine Tochter hat extreme Kopfschmerzen und Lichtscheu!',
                    'Er hat einen steifen Nacken, Fieber und erbricht!'
                ]
            },
            patient_selbst: {
                probability: 0.15,
                speech_pattern: 'verwirrt_schwach',
                variations: [
                    'Ich habe die schlimmsten Kopfschmerzen meines Lebens...',
                    'Mir ist so schlecht, mein Nacken ist steif...'
                ]
            },
            pflegepersonal: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Verdacht auf Meningitis, Fieber 40°C, Nackensteife, Bewusstseinstrübung.',
                    'Patient mit meningitischem Syndrom, petechiale Blutungen.'
                ]
            },
            hausarzt: {
                probability: 0.05,
                speech_pattern: 'ärztlich',
                variations: [
                    'Ich habe einen Patienten mit Meningitis-Verdacht, Transport dringend.',
                    'Meningitisches Syndrom, bitte sofort RTW.'
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
            peak1: { mean: 8, stddev: 5, weight: 0.3 },
            peak2: { mean: 35, stddev: 20, weight: 0.7 },
            min: 1,
            max: 80
        },
        bewusstsein: {
            wach_verwirrt: { probability: 0.40 },
            somnolent: { probability: 0.35 },
            bewusstlos: { probability: 0.25 }
        }
    },
    
    symptome: {
        klassische_trias: {
            kopfschmerzen: { probability: 0.95 },
            nackensteife: { probability: 0.85 },
            fieber: { probability: 0.90 }
        },
        weitere_symptome: {
            übelkeit_erbrechen: { probability: 0.80 },
            lichtscheu: { probability: 0.70 },
            bewusstseinstrübung: { probability: 0.60 },
            verwirrtheit: { probability: 0.55 },
            krampfanfälle: { probability: 0.20 },
            petechien: { probability: 0.30 }
        }
    },
    
    schweregrad: {
        viral_milder: {
            probability: 0.40,
            severity: 'mittel',
            prognose: 'meist gut'
        },
        bakteriell_schwer: {
            probability: 0.50,
            severity: 'kritisch',
            prognose: 'ernst',
            antibiotika_zeitkritisch: true
        },
        fulminant: {
            probability: 0.10,
            severity: 'lebensbedrohlich',
            waterhouse_friderichsen: true
        }
    },
    
    locations: {
        zuhause: { probability: 0.75, address_types: ['residential'] },
        öffentlich: { probability: 0.10, address_types: ['public_place'] },
        arztpraxis: { probability: 0.10, address_types: ['medical'] },
        bildungseinrichtung: { probability: 0.05, address_types: ['school', 'university'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.40,
            triggers: ['bewusstlosigkeit', 'krampfanfälle', 'schock']
        },
        isolation: {
            erforderlich: true,
            note: 'Tröpfchenisolation bei bakterieller Meningitis'
        },
        zielklinik: {
            neurologie: { probability: 0.60 },
            intensivstation: { probability: 0.40 }
        }
    },
    
    eskalation: {
        krampfanfall: {
            probability: 0.15,
            announcement: 'Er krampft jetzt!'
        },
        schock: {
            probability: 0.10,
            announcement: 'Sie wird ganz blass und der Puls rast!',
            note: 'Waterhouse-Friderichsen-Syndrom'
        },
        bewusstlosigkeit: {
            probability: 0.20,
            announcement: 'Sie wird bewusstlos!'
        }
    },
    
    besonderheiten: {
        kontaktpersonen: {
            vorhanden: true,
            note: 'Prophylaxe erforderlich bei bakterieller Meningitis'
        },
        impfstatus: {
            ungeimpft: { probability: 0.60 },
            geimpft: { probability: 0.40 }
        }
    },
    
    lernziele: [
        'Meningitis-Leitsymptome erkennen',
        'Zeitkritisches Handeln',
        'Isolationsmaßnahmen beachten',
        'Gefahr für Kontaktpersonen'
    ]
};

export default MENINGITIS_TEMPLATE;