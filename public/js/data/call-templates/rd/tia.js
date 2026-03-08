// =========================================================================================
// TEMPLATE: TIA (TRANSITORISCHE ISCHÄMISCHE ATTACKE)
// Beschreibung: "Mini-Schlaganfall" - Symptome bilden sich zurück, aber Warnsignal
// =========================================================================================

export const TIA_TEMPLATE = {
    id: 'tia',
    kategorie: 'rd',
    stichwort: 'TIA / Transitorische ischämische Attacke',
    weight: 2,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.25,
                speech_pattern: 'besorgt',
                variations: [
                    'Ich hatte gerade so komische Ausfälle, jetzt geht es wieder.',
                    'Mein Arm war plötzlich taub, jetzt ist es fast weg.',
                    'Ich konnte kurz nicht richtig sprechen, das ist sehr beunruhigend.',
                    'Ich hatte Seh- störungen, jetzt sehe ich wieder normal.'
                ]
            },
            angehöriger_besorgt: {
                probability: 0.60,
                speech_pattern: 'besorgt',
                variations: [
                    'Mein Mann konnte plötzlich nicht mehr sprechen! Jetzt geht es wieder.',
                    'Sie hatte einen komischen Anfall, ihr Gesicht war schief!',
                    'Er konnte seinen Arm nicht bewegen, jetzt geht es schon besser.',
                    'Sie war verwirrt und konnte nicht sprechen, das war sehr beunruhigend!'
                ]
            },
            angehöriger_entwarnt: {
                probability: 0.10,
                speech_pattern: 'unsicher',
                variations: [
                    'Es ist jetzt wieder vorbei, aber es war schon komisch...',
                    'Sollen wir trotzdem den Rettungsdienst rufen? Es geht ihr wieder gut.',
                    'Muss das untersucht werden? Die Symptome sind weg.'
                ]
            },
            zeuge: {
                probability: 0.05,
                speech_pattern: 'unsicher',
                variations: [
                    'Jemand hatte hier einen Anfall, jetzt geht es wieder.',
                    'Eine Person war kurz sehr komisch, sprach wirr.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.55 },
            female: { probability: 0.45 }
        },
        alter: {
            distribution: 'normal',
            mean: 68,
            stddev: 12,
            min: 50,
            max: 90
        },
        bewusstsein: {
            wach: { probability: 0.95 },
            verwirrt: { probability: 0.05 }
        }
    },
    
    symptome: {
        neurologische_ausfälle: {
            hemiparese: {
                probability: 0.50,
                details: 'Armschwäche, Beinschwäche'
            },
            aphasie: {
                probability: 0.40,
                details: 'Sprachstörung'
            },
            taubheitsgefühl: {
                probability: 0.45,
                details: 'Einseitig'
            },
            sehstörung: {
                probability: 0.30,
                details: 'Doppelbilder, Gesichtsfeldausfall'
            },
            schwindel: {
                probability: 0.35
            },
            koordinationsstörung: {
                probability: 0.25
            }
        },
        
        status_bei_anruf: {
            komplett_zurückgebildet: { probability: 0.30 },
            deutlich_besser: { probability: 0.50 },
            noch_leichte_symptome: { probability: 0.15 },
            noch_ausgeprägt: { probability: 0.05 }
        }
    },
    
    besonderheiten: {
        symptom_dauer: {
            unter_5min: { probability: 0.40 },
            5_15min: { probability: 0.35 },
            15_60min: { probability: 0.20 },
            über_60min: { probability: 0.05 }
        },
        
        risikofaktoren: {
            hypertonie: { probability: 0.70 },
            diabetes: { probability: 0.40 },
            vorhofflimmern: { probability: 0.30 },
            rauchen: { probability: 0.35 },
            hyperlipidämie: { probability: 0.50 },
            früherer_schlaganfall: { probability: 0.25 }
        },
        
        frühere_tia: {
            probability: 0.30,
            note: 'Erhöhtes Schlaganfall-Risiko'
        }
    },
    
    locations: {
        zuhause: { probability: 0.70, address_types: ['residential'] },
        öffentlich: { probability: 0.20, address_types: ['public_place'] },
        pflegeheim: { probability: 0.10, address_types: ['care_home'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        zielklinik: {
            stroke_unit: { 
                probability: 1.0,
                note: 'Auch bei TIA immer Stroke Unit!'
            }
        },
        dringlichkeit: {
            note: 'TIA ist Notfall! Hohes Risiko für Schlaganfall innerhalb 48h',
            transport_verzögerung: 'nicht akzeptabel'
        }
    },
    
    eskalation: {
        progression_zum_schlaganfall: {
            probability: 0.15,
            announcement: 'Die Symptome kommen wieder! Es wird schlimmer!',
            template_change: 'schlaganfall'
        },
        komplett_zurückgebildet: {
            probability: 0.40,
            announcement: 'Jetzt ist alles wieder normal.',
            note: 'Trotzdem transport zur Abklärung!'
        }
    },
    
    zeitfaktoren: {
        zeitfenster: {
            akut_unter_1h: { probability: 0.60 },
            1_6h: { probability: 0.30 },
            über_6h: { probability: 0.10 }
        },
        tageszeit_modifikator: {
            morgen: 1.3,
            tag: 1.0,
            abend: 1.0,
            nacht: 0.8
        }
    },
    
    lernziele: [
        'TIA als Notfall erkennen',
        'Auch bei Rückbildung immer Stroke Unit',
        'FAST-Schema anwenden',
        'Hohes Schlaganfall-Risiko kommunizieren',
        'Keine Bagatellisierung trotz Besserung'
    ],
    
    fallstricke: [
        'Unterscheidung TIA vs. kompletter Schlaganfall schwierig',
        'Patient will oft nicht fahren wenn Symptome weg',
        'Hohes Risiko für Schlaganfall in nächsten Stunden/Tagen',
        'Transport auch bei kompletter Rückbildung zwingend'
    ]
};

export default TIA_TEMPLATE;
