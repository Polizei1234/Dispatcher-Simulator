// =========================================================================================
// TEMPLATE: PSYCHIATRISCHER NOTFALL
// Beschreibung: Psychische Ausnahmesituation - Eigen-/Fremdgefährdung
// =========================================================================================

export const PSYCHIATRISCHER_NOTFALL_TEMPLATE = {
    id: 'psychiatrischer_notfall',
    kategorie: 'rd',
    stichwort: 'Psychiatrischer Notfall',
    weight: 2,
    
    anrufer: {
        typen: {
            angehöriger_überfordert: {
                probability: 0.50,
                speech_pattern: 'verngstigt_ratlos',
                variations: [
                    'Mein Bruder flippt total aus! Er ist aggressiv!',
                    'Sie hat einen psychotischen Anfall! Sie rastet aus!',
                    'Er redet wirres Zeug und droht uns!',
                    'Sie ist völlig außer sich! Wir haben Angst!',
                    'Mein Sohn randaliert! Er ist psychisch krank!'
                ],
                background_sounds: ['yelling_distance', 'chaos', 'fear']
            },
            polizei: {
                probability: 0.30,
                speech_pattern: 'professionell_angespannt',
                variations: [
                    'Polizei, psychisch auffllige Person, aggressiv, RTW zur Untersttzung.',
                    'Person verwirrt, evtl. psychotisch, medizinische Beurteilung erforderlich.',
                    'Polizei vor Ort, randalierender Patient, Fixierung, ärztliche Begleitung nötig.'
                ]
            },
            nachbarn: {
                probability: 0.12,
                speech_pattern: 'besorgt_ngstlich',
                variations: [
                    'Der Nachbar schreit und randaliert seit Stunden!',
                    'Da nebenan ist jemand der schreit wirres Zeug!'
                ]
            },
            soziale_einrichtung: {
                probability: 0.08,
                speech_pattern: 'professionell',
                variations: [
                    'Betreutes Wohnen, Bewohner akut psychotisch, aggressiv.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.60 },
            female: { probability: 0.40 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 28, stddev: 10, weight: 0.4 },
            peak2: { mean: 45, stddev: 15, weight: 0.6 },
            min: 16,
            max: 75
        },
        zustand: {
            agitiert: { probability: 0.40 },
            aggressiv: { probability: 0.30 },
            wahnhaft: { probability: 0.20 },
            apathisch: { probability: 0.10 }
        }
    },
    
    störungsbilder: {
        akute_psychose: {
            probability: 0.35,
            symptome: ['wahn', 'halluzinationen', 'denkstörung']
        },
        manie: {
            probability: 0.15,
            symptome: ['enthemmung', 'übersteigertes_selbstwertgefühl', 'rededrang', 'risikobereitschaft']
        },
        schwere_depression_agitiert: {
            probability: 0.15,
            symptome: ['verzweiflung', 'unruhe', 'suizidalität']
        },
        intoxikation_drogen: {
            probability: 0.20,
            substanzen: ['amphetamine', 'kokain', 'cannabis_hochdosis', 'andere']
        },
        dekompensierte_grunderkrankung: {
            probability: 0.10,
            beispiele: ['schizophrenie', 'bipolare_störung', 'persönlichkeitsstörung']
        },
        andere: {
            probability: 0.05
        }
    },
    
    symptome: {
        verhalten: {
            aggressivität: { probability: 0.50 },
            agitation: { probability: 0.60 },
            enthemmung: { probability: 0.40 },
            selbstgefährdung: { probability: 0.30 },
            fremdgefährdung: { probability: 0.35 }
        },
        psychotisch: {
            wahn: { probability: 0.40 },
            halluzinationen: { probability: 0.35 },
            denkzerfahrenheit: { probability: 0.30 }
        },
        andere: {
            schreien: { probability: 0.50 },
            randalieren: { probability: 0.40 },
            bedrohung: { probability: 0.35 }
        }
    },
    
    gefhrdung: {
        eigenschutz_kritisch: {
            probability: 0.40,
            note: 'Polizei zwingend erforderlich!'
        },
        selbstgefährdung: {
            probability: 0.40,
            maßnahmen: 'Zwangseinweisung'
        },
        fremdgefährdung: {
            probability: 0.35,
            maßnahmen: 'Polizei_Zwangsmaßnahmen'
        },
        keine_akute_gefahr: {
            probability: 0.30,
            aber: 'Psychiatrische_Versorgung_nötig'
        }
    },
    
    anamnese: {
        bekannte_psychiatrische_erkrankung: { probability: 0.65 },
        medikamente_abgesetzt: { probability: 0.40 },
        substanzkonsum: { probability: 0.35 },
        vorherige_zwangseinweisungen: { probability: 0.30 },
        soziale_isolation: { probability: 0.50 }
    },
    
    locations: {
        zuhause: { probability: 0.60, address_types: ['residential'] },
        öffentlich: { probability: 0.25, address_types: ['street', 'public_place'] },
        einrichtung: { probability: 0.10, address_types: ['institutional'] },
        andere: { probability: 0.05 }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        polizei: {
            probability: 0.80,
            zwingend_bei: ['aggression', 'fremdgefährdung', 'zwangsmaßnahmen'],
            note: 'Eigenschutz!'
        },
        nef_indikation: {
            probability: 0.20,
            triggers: ['sedierung_erforderlich', 'kombinierte_somatische_gefahr']
        },
        zielklinik: {
            psychiatrie_geschlossen: { probability: 0.70 },
            psychiatrie_offen: { probability: 0.20 },
            erst_somatik: { probability: 0.10, bei: 'intoxikation_organisch' }
        },
        zwangseinweisung: {
            probability: 0.60,
            rechtsgrundlage: 'PsychKG',
            voraussetzungen: ['eigen_oder_fremdgefährdung', 'keine_einsichtsfähigkeit']
        }
    },
    
    besonderheiten: {
        fixierung_notwendig: {
            probability: 0.30,
            note: 'Nur mit Polizei!',
            ärztliche_anordnung: true
        },
        sedierung: {
            probability: 0.25,
            medikamente: ['benzodiazepine', 'neuroleptika'],
            nur_nach_ärztlicher_anordnung: true
        },
        patient_verweigert_behandlung: {
            probability: 0.70,
            zwang_bei_gefahr: 'erlaubt'
        },
        angehrige_traumatisiert: {
            probability: 0.60,
            betreuung: 'wichtig'
        }
    },
    
    eigenschutz: {
        niemals_alleine: {
            note: 'Immer Polizei dazu!',
            kritisch: true
        },
        fluchtweg_freihalten: {
            note: 'Immer Ausgang im Blick'
        },
        abstand_halten: {
            note: 'Mindestens 2 Meter'
        },
        keine_provokation: {
            note: 'Ruhig bleiben, deeskalieren'
        },
        waffen_gegenstände: {
            note: 'Auf Waffen achten!'
        }
    },
    
    kommunikation: {
        ruhig_bleiben: true,
        nicht_diskutieren: 'Bei Wahn nicht gegen argumentieren',
        keine_schnellen_bewegungen: true,
        empathie: 'Trotz allem Verständnis zeigen',
        klare_ansagen: 'Kurz und klar'
    },
    
    eskalation: {
        gewalt: {
            probability: 0.20,
            announcement: 'Er greift an! Polizei muss helfen!',
            severity: 'kritisch'
        },
        beruhigung: {
            probability: 0.35,
            announcement: 'Er wird ruhiger...'
        },
        flucht: {
            probability: 0.10,
            announcement: 'Er läuft weg!'
        },
        fixierung_notwendig: {
            probability: 0.25,
            announcement: 'Er muss fixiert werden!'
        }
    },
    
    lernziele: [
        'Eigenschutz hat oberste Prioritt!',
        'Polizei frühzeitig nachfordern',
        'Deeskalation versuchen',
        'Zwangseinweisung bei Gefhrdung',
        'Nicht diskutieren bei Wahn',
        'Empathie trotz schwierigem Verhalten'
    ]
};

export default PSYCHIATRISCHER_NOTFALL_TEMPLATE;