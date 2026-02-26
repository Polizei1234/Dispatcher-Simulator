// =========================================================================================
// TEMPLATE: MEDIKAMENTEN-INTOXIKATION
// Beschreibung: Überdosis Medikamente - häufig suizidal
// =========================================================================================

export const MEDIKAMENTEN_INTOXIKATION_TEMPLATE = {
    id: 'medikamenten_intoxikation',
    kategorie: 'rd',
    stichwort: 'Medikamenten-Intoxikation',
    weight: 2,
    
    anrufer: {
        typen: {
            angehöriger_verzweifelt: {
                probability: 0.55,
                speech_pattern: 'verzweifelt',
                variations: [
                    'Ich habe sie mit leeren Tablettenpackungen gefunden!',
                    'Er hat alle seine Tabletten auf einmal genommen!',
                    'Sie wollte sich etwas antun! Leere Medikamentenpackungen!',
                    'Ich glaube er hat seine Medikamente überdosiert!',
                    'Sie ist nicht ansprechbar! Überall leere Pillenpackungen!'
                ]
            },
            patient_selbst: {
                probability: 0.15,
                speech_pattern: 'schwach_bereut',
                variations: [
                    'Ich habe zu viele Tabletten genommen... *weint*',
                    'Ich bereue es... ich habe alle Tabletten geschluckt...',
                    'Ich habe einen Fehler gemacht... zu viele Medikamente...'
                ]
            },
            freund_besorgt: {
                probability: 0.20,
                speech_pattern: 'besorgt',
                variations: [
                    'Sie hat mir geschrieben dass sie Tabletten nimmt!',
                    'Er sagte er macht Schluss und hat Tabletten genommen!',
                    'Sie ist total schläfrig nach Tabletteneinnahme!'
                ]
            },
            pflegepersonal: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Patient mit Medikamentenüberdosis, somnolent.',
                    'Bewohnerin hat komplette Wochenration eingenommen.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.42 },
            female: { probability: 0.58 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 25, stddev: 10, weight: 0.4 },
            peak2: { mean: 55, stddev: 15, weight: 0.6 },
            min: 14,
            max: 85
        },
        bewusstsein: {
            wach: { probability: 0.35 },
            somnolent: { probability: 0.40 },
            bewusstlos: { probability: 0.25 }
        }
    },
    
    intention: {
        suizidversuch: {
            probability: 0.70,
            note: 'Vorsätzliche Überdosierung',
            psychiatrie_erforderlich: true
        },
        versehentlich: {
            probability: 0.20,
            note: 'Verwechslung, Demenz, Kind',
            examples: ['doppelt_genommen', 'verwechselt']
        },
        missbrauch: {
            probability: 0.10,
            note: 'Berauschende Wirkung gesucht'
        }
    },
    
    medikamententyp: {
        benzodiazepine: {
            probability: 0.30,
            substanzen: ['diazepam', 'lorazepam', 'tavor'],
            symptome: {
                somnolenz: { probability: 0.90 },
                atemdepression: { probability: 0.40 },
                hypotonie: { probability: 0.35 }
            },
            antidot: 'flumazenil'
        },
        antidepressiva: {
            probability: 0.25,
            substanzen: ['ssri', 'trizyklika'],
            symptome: {
                tachykardie: { probability: 0.70 },
                krampfanfall: { probability: 0.30 },
                verwirrtheit: { probability: 0.60 },
                qt_verlängerung: { probability: 0.40 }
            }
        },
        schmerzmittel: {
            probability: 0.20,
            substanzen: ['paracetamol', 'ibuprofen', 'opioide'],
            symptome: {
                übelkeit: { probability: 0.70 },
                lebertoxizität: { probability: 0.50, bei: 'paracetamol', verzögert: true },
                atemdepression: { probability: 0.60, bei: 'opioide' }
            }
        },
        neuroleptika: {
            probability: 0.10,
            symptome: {
                extrapyramidal: { probability: 0.50 },
                somnolenz: { probability: 0.70 },
                hypotonie: { probability: 0.60 }
            }
        },
        kardiovaskulär: {
            probability: 0.10,
            substanzen: ['betablocker', 'digitalis', 'blutdrucksenker'],
            symptome: {
                bradykardie: { probability: 0.80 },
                hypotonie: { probability: 0.85 },
                herzrhythmusstörung: { probability: 0.40 }
            },
            severity: 'potentiell_kritisch'
        },
        andere: {
            probability: 0.05
        }
    },
    
    symptome: {
        bewusstsein: {
            somnolenz: { probability: 0.60 },
            koma: { probability: 0.20 },
            verwirrtheit: { probability: 0.30 }
        },
        gastrointestinal: {
            übelkeit: { probability: 0.60 },
            erbrechen: { probability: 0.50 }
        },
        kreislauf: {
            tachykardie: { probability: 0.40 },
            bradykardie: { probability: 0.25 },
            hypotonie: { probability: 0.35 }
        },
        andere: {
            atemdepression: { probability: 0.30 },
            krampfanfall: { probability: 0.15 }
        }
    },
    
    locations: {
        zuhause: { probability: 0.80, address_types: ['residential'] },
        pflegeheim: { probability: 0.10, address_types: ['care_home'] },
        öffentlich: { probability: 0.10, address_types: ['public_place'] }
    },
    
    besonderheiten: {
        medikamente_identifizierbar: {
            probability: 0.70,
            note: 'Packungen vorhanden, Medikamente mitgeben!'
        },
        zeitpunkt_bekannt: {
            probability: 0.50,
            note: 'Wichtig für Therapie'
        },
        mischintoxikation: {
            probability: 0.40,
            kombiniert_mit: ['alkohol', 'andere_medikamente'],
            severity: 'erhöht'
        },
        abschiedsbrief: {
            probability: 0.25,
            bei: 'suizidversuch'
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.25,
            triggers: ['bewusstlosigkeit', 'ateminsuffizienz', 'herzrhythmusstörung', 'krampfanfall']
        },
        zielklinik: {
            standard_notaufnahme: { probability: 0.70 },
            psychiatrie: { probability: 0.20, bei: 'suizid_stabil' },
            intensiv: { probability: 0.10, bei: 'kritisch' }
        },
        polizei: {
            probability: 0.30,
            reasons: ['suizidgefährdung', 'selbstgefährdung', 'verweigerung']
        }
    },
    
    therapie_hinweise: {
        aktivkohle: {
            probability: 0.60,
            zeitfenster: 'erste_1_2_stunden'
        },
        magenspülung: {
            probability: 0.10,
            nur_früh: true
        }
    },
    
    eskalation: {
        krampfanfall: {
            probability: 0.12,
            announcement: 'Er krampft jetzt!'
        },
        atemstillstand: {
            probability: 0.08,
            announcement: 'Sie atmet nicht mehr!'
        },
        agitation: {
            probability: 0.15,
            announcement: 'Er wird aggressiv und will nicht ins Krankenhaus!'
        }
    },
    
    lernziele: [
        'Suizidversuch erkennen',
        'Medikamente identifizieren',
        'Psychiatrie bei Suizidalität',
        'Verzögerte Symptome (Paracetamol)',
        'Medikamentenpackungen mitgeben'
    ]
};

export default MEDIKAMENTEN_INTOXIKATION_TEMPLATE;