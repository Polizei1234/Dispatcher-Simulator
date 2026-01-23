// =========================================================================================
// HERZINFARKT TEMPLATE
// Vollständiges Beispiel mit ALLEN 36+ Features als Vorlage für weitere Szenarien
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const HERZINFARKT_TEMPLATE = {
    
    // ========================================
    // 🆔 GRUND-INFORMATIONEN
    // ========================================
    id: 'herzinfarkt',
    kategorie: 'rd',
    stichwort: 'Herzinfarkt',
    weight: 3,  // Häufigkeit: 1=selten, 3=mittel, 5=häufig
    
    // ========================================
    // 📞 ANRUFER-VARIANZ (Features 6, 7, 8)
    // ========================================
    anrufer: {
        
        // Feature 6: Verschiedene Anrufer-Typen
        typen: {
            normal: {
                probability: 0.55,
                alter: { min: 25, max: 65 },
                emotion: {
                    panisch: 0.6,
                    aufgeregt: 0.3,
                    ruhig: 0.1
                },
                sprache: {
                    klar: 0.9,
                    dialekt: 0.1
                }
            },
            
            kind: {
                probability: 0.05,
                alter: { min: 6, max: 14 },
                emotion: {
                    panisch: 0.8,
                    aufgeregt: 0.15,
                    verwirrt: 0.05
                },
                effects: {
                    unsichere_angaben: 0.9,
                    weint: 0.4,
                    zittrige_stimme: 0.7
                },
                was_passiert_prefix: [
                    'Bitte helfen Sie! Mein Papa...',
                    'Mama geht es ganz schlecht! Sie...',
                    'Oma liegt auf dem Boden und...'
                ]
            },
            
            senior: {
                probability: 0.15,
                alter: { min: 65, max: 85 },
                emotion: {
                    verwirrt: 0.4,
                    ruhig: 0.4,
                    aufgeregt: 0.2
                },
                effects: {
                    hört_schlecht: 0.5,
                    wiederholt_fragen: 0.4,
                    verwechselt_infos: 0.3,
                    langsames_sprechen: 0.6
                },
                variations: [
                    'Ja, hören Sie, also mein Mann...',
                    'Wie bitte? Ach so, ja, also...'
                ]
            },
            
            sanitäter_off_duty: {
                probability: 0.03,
                alter: { min: 25, max: 55 },
                emotion: {
                    ruhig: 0.9,
                    aufgeregt: 0.1
                },
                effects: {
                    professionelle_beschreibung: 1.0,
                    fachbegriffe: 0.8,
                    vitalwerte_bekannt: 0.9
                },
                was_passiert_variations: [
                    'Patient männlich, circa 60 Jahre, akuter Thoraxschmerz mit Ausstrahlung in den linken Arm',
                    'Ich bin Rettungssanitäter, hier kollabierter Patient mit Verdacht auf Myokardinfarkt'
                ]
            },
            
            betrunken: {
                probability: 0.02,
                alter: { min: 25, max: 65 },
                emotion: {
                    aufgeregt: 0.6,
                    verwirrt: 0.3,
                    aggressiv: 0.1
                },
                effects: {
                    lallende_sprache: 0.8,
                    undeutliche_angaben: 0.9,
                    abschweifend: 0.7
                },
                was_passiert_prefix: [
                    'Äh... also hörn Se mal, da liegt einer...',
                    'Ich hab... hab grad getrunken, aber der Typ da...'
                ]
            },
            
            ausländer: {
                probability: 0.15,
                sprachen: {
                    türkisch_akzent: 0.4,
                    italienisch_akzent: 0.2,
                    polnisch_akzent: 0.2,
                    englisch: 0.15,
                    andere: 0.05
                },
                emotion: {
                    panisch: 0.5,
                    aufgeregt: 0.4,
                    verwirrt: 0.1
                },
                effects: {
                    sprachbarriere: 0.6,
                    missverständnisse: 0.5,
                    dolmetscher_nötig: 0.1
                },
                was_passiert_variations: [
                    'Hallo, bitte schnell kommen! Mein Mann... wie sagt man... Herz tut sehr weh!',
                    'Please help! My husband, he has... chest pain, very bad!'
                ]
            },
            
            nachbar: {
                probability: 0.05,
                emotion: {
                    aufgeregt: 0.6,
                    unsicher: 0.3,
                    ruhig: 0.1
                },
                effects: {
                    kennt_patient_wenig: 0.8,
                    keine_vorgeschichte_bekannt: 0.9,
                    unsichere_adresse: 0.3
                },
                was_passiert_prefix: [
                    'Ich bin der Nachbar, ich hab gehört wie mein Nachbar...',
                    'Ich wohne nebenan, da liegt jemand...'
                ]
            }
        },
        
        // Feature 7: Anrufer-Zustand ändert sich dynamisch
        dynamik: {
            wird_ohnmächtig: {
                probability: 0.02,
                trigger_time: { min: 120, max: 300 },
                trigger_phrases: [
                    'Mir wird ganz schwindelig...',
                    'Oh nein, mir ist auf einmal so schlecht...',
                    'Mir wird schwarz vor Augen...',
                    '[Stöhnen] Ich... ich kann nicht mehr...'
                ],
                effects: {
                    anruf_bricht_ab: 1.0,
                    rückruf_nötig: 0.8,
                    zweiter_patient: 1.0  // Anrufer wird selbst zum Patienten!
                }
            },
            
            panikattacke: {
                probability: 0.05,
                trigger_time: { min: 60, max: 180 },
                symptoms: [
                    'Ich kann nicht mehr... [hyperventiliert]',
                    'Ich krieg keine Luft mehr!',
                    'Das ist alles zu viel!'
                ],
                effects: {
                    schwer_zu_beruhigen: 0.9,
                    informationen_unklar: 0.7,
                    braucht_mehr_zeit: 1.0
                }
            },
            
            muss_reanimieren: {
                probability: 0.01,
                trigger_time: { min: 180, max: 400 },
                trigger_event: 'patient_wird_bewusstlos',
                phrases: [
                    'Oh Gott, er reagiert nicht mehr!',
                    'Er atmet nicht mehr! Was soll ich tun?!',
                    'Hilfe! Ich glaub der ist tot!'
                ],
                effects: {
                    telefonreanimation: 1.0,
                    sehr_panisch: 1.0,
                    upgrade_stichwort: 'Reanimation'
                }
            }
        },
        
        // Feature 8: Mehrere Anrufer zum gleichen Einsatz
        mehrere_anrufer: {
            probability: 0.05,
            anzahl: { min: 2, max: 3 },
            delay_between: { min: 30, max: 180 },
            
            variationen: {
                widersprüchlich: {
                    probability: 0.4,
                    example: 'Anrufer 1: "Er ist bewusstlos!" Anrufer 2: "Er redet noch, aber wirr."'
                },
                ergänzend: {
                    probability: 0.5,
                    example: 'Anrufer 2 gibt mehr Details zur Vorgeschichte'
                },
                panik: {
                    probability: 0.1,
                    example: 'Mehrere Leute rufen gleichzeitig an, totales Chaos'
                }
            }
        },
        
        // Beziehung zum Patienten (Feature 2: Soziales Umfeld)
        beziehung: {
            ehepartner: {
                probability: 0.5,
                kennt_vorgeschichte: 0.9,
                emotionale_bindung: 'sehr_hoch',
                variations: {
                    male_patient: ['mein Mann', 'mein Ehemann'],
                    female_patient: ['meine Frau', 'meine Ehefrau']
                }
            },
            kind: {
                probability: 0.2,
                kennt_vorgeschichte: 0.7,
                emotionale_bindung: 'sehr_hoch',
                variations: {
                    male_patient: ['mein Vater', 'mein Papa'],
                    female_patient: ['meine Mutter', 'meine Mama']
                }
            },
            nachbar: {
                probability: 0.15,
                kennt_vorgeschichte: 0.2,
                emotionale_bindung: 'niedrig',
                variations: ['mein Nachbar', 'der Nachbar von nebenan', 'jemand aus dem Haus']
            },
            kollege: {
                probability: 0.1,
                kennt_vorgeschichte: 0.3,
                emotionale_bindung: 'mittel',
                variations: ['ein Kollege', 'mein Arbeitskollege']
            },
            zeuge: {
                probability: 0.05,
                kennt_vorgeschichte: 0.0,
                emotionale_bindung: 'keine',
                variations: ['jemand auf der Straße', 'ein Mann', 'eine Frau']
            }
        }
    },
    
    // ========================================
    // 🧑‍⚕️ PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.65,   // Männer häufiger von Herzinfarkt betroffen
            female: 0.35
        },
        alter: {
            distribution: 'normal',
            mean: 65,
            stddev: 12,
            min: 40,
            max: 90
        },
        
        // Feature 2: Soziales Umfeld
        soziales_umfeld: {
            alleinlebend: {
                probability: 0.3,
                effects: {
                    später_entdeckt: 0.5,
                    nachbarn_rufen_an: 0.6,
                    keine_anamnese_möglich: 0.7,
                    einsamkeit: 0.6
                },
                impact_on_call: 'Nachbar findet bewusstlosen'
            },
            großfamilie: {
                probability: 0.2,
                effects: {
                    viele_aufgeregte_angehörige: 0.8,
                    chaos_vor_ort: 0.6,
                    mehrere_sprechen_durcheinander: 0.4
                },
                impact_on_call: 'Im Hintergrund viele Stimmen'
            },
            normal: {
                probability: 0.5,
                effects: {}
            }
        }
    },
    
    // ========================================
    // 💊 SYMPTOME (kombinierbar!)
    // ========================================
    symptome: {
        // Hauptsymptom
        brustschmerz: {
            probability: 0.95,
            intensität: {
                stark: { probability: 0.7, impact: 'sehr_dringlich' },
                mittel: { probability: 0.2, impact: 'dringlich' },
                leicht: { probability: 0.1, impact: 'normal' }
            },
            variations: [
                'fasst sich die ganze Zeit an die Brust',
                'hält sich die Brust und sagt, dass es richtig weh tut',
                'hat so starke Schmerzen in der Brust',
                'klagt über massive Brustschmerzen',
                'die Brust tut {ihm/ihr} höllisch weh',
                'verkrampft sich total, fasst sich an die Brust',
                'greift sich immer wieder ans Herz'
            ],
            beschreibungen: {
                brennend: ['brennt in der Brust', 'wie Feuer in der Brust'],
                drückend: ['drückt auf der Brust', 'wie ein Elefant auf der Brust'],
                stechend: ['sticht in der Brust', 'wie Messerstiche']
            }
        },
        
        // Ausstrahlungsschmerz
        ausstrahlung: {
            probability: 0.7,
            locations: {
                arm_links: {
                    probability: 0.6,
                    variations: [
                        'zieht bis in den linken Arm',
                        'der linke Arm tut auch weh',
                        'strahlt in den Arm aus',
                        'der Arm wird auch taub'
                    ]
                },
                kiefer: {
                    probability: 0.2,
                    variations: [
                        'der Kiefer tut auch weh',
                        'zieht bis in den Unterkiefer',
                        'Zahnschmerzen plötzlich'
                    ]
                },
                rücken: {
                    probability: 0.15,
                    variations: [
                        'der Rücken tut auch weh',
                        'zwischen den Schulterblättern'
                    ]
                },
                bauch: {
                    probability: 0.05,
                    variations: [
                        'der Oberbauch tut auch weh',
                        'wie Magenschmerzen'
                    ]
                }
            }
        },
        
        schwitzen: {
            probability: 0.85,
            variations: [
                'schwitzt wie verrückt',
                'ist total verschwitzt',
                'der Schweiß läuft {ihm/ihr} runter',
                'schwitzt ganz stark',
                'ist völlig nass geschwitzt',
                'die Kleidung ist durchgeschwitzt'
            ]
        },
        
        blässe: {
            probability: 0.75,
            variations: [
                'ist total blass',
                'ganz weiß im Gesicht',
                'sieht ganz bleich aus',
                'total fahl',
                'kreidebleich',
                'Gesichtsfarbe ganz grau'
            ]
        },
        
        atemnot: {
            probability: 0.6,
            variations: [
                'sagt, {er/sie} kriegt keine Luft',
                'kriegt schlecht Luft',
                'ringt nach Luft',
                'atmet ganz schwer',
                'kann kaum noch atmen',
                'schnauft wie verrückt'
            ]
        },
        
        übelkeit: {
            probability: 0.4,
            variations: [
                'ist {ihm/ihr} schlecht',
                'muss sich übergeben',
                'klagt über Übelkeit',
                'hat sich schon übergeben',
                'würgt die ganze Zeit'
            ]
        },
        
        angst: {
            probability: 0.8,
            variations: [
                'hat total Angst',
                'ist ganz panisch',
                'sagt, {er/sie} stirbt jetzt',
                'hat Todesangst',
                'glaubt {er/sie} muss sterben',
                'ist total verängstigt'
            ]
        },
        
        unruhe: {
            probability: 0.5,
            variations: [
                'ist total unruhig',
                'läuft hin und her',
                'kann nicht still sitzen',
                'wälzt sich herum'
            ]
        }
    },
    
    // ========================================
    // 🏥 MEDIZINISCHE KOMPLEXITÄT (Features 9-12)
    // ========================================
    medizinisch: {
        
        // Feature 9: Mehrfachverletzungen/Erkrankungen
        mehrfacherkrankungen: {
            probability: 0.3,
            kombinationen: {
                diabetes_und_herzinfarkt: {
                    probability: 0.4,
                    effects: {
                        komplikationen: 1.3,  // +30%
                        bewusstlos_wahrscheinlicher: 1.25
                    }
                },
                sturz_nach_herzinfarkt: {
                    probability: 0.3,
                    secondary_injury: ['Kopfplatzwunde', 'Rippenprellung', 'Armbruch'],
                    effects: {
                        zusätzliche_verletzung: 1.0,
                        behandlung_komplexer: 1.0
                    }
                },
                schlaganfall_und_herzinfarkt: {
                    probability: 0.1,
                    effects: {
                        sehr_kritisch: 1.0,
                        sofort_klinikum_stroke: 1.0
                    }
                }
            }
        },
        
        // Feature 10: Allergien
        allergien: {
            probability: 0.15,
            types: {
                medikamente: {
                    probability: 0.6,
                    common: ['Penicillin', 'ASS', 'Ibuprofen', 'Kontrastmittel'],
                    impact: 'wichtig_für_notarzt'
                },
                latex: {
                    probability: 0.3,
                    impact: 'latexfreie_handschuhe_nötig'
                },
                andere: {
                    probability: 0.1,
                    items: ['Pflaster', 'Jod', 'bestimmte Schmerzmittel']
                }
            },
            antwort_variations: [
                'Ja, allergisch gegen {allergen}',
                'Äh, ich glaub gegen {allergen}',
                'Weiß nicht genau, vielleicht {allergen}'
            ]
        },
        
        // Feature 11: Schwangerschaft
        schwangerschaft: {
            probability: 0.02,  // Nur bei weiblichen Patienten im richtigen Alter
            age_range: [18, 45],
            trimester: {
                first: { probability: 0.2, weeks: [1, 12] },
                second: { probability: 0.3, weeks: [13, 27] },
                third: { probability: 0.5, weeks: [28, 40] }
            },
            effects: {
                höhere_dringlichkeit: 1.0,
                spezielle_lagerung: 1.0,
                gynäkologie_informieren: 0.8
            },
            antworten: [
                'Ja, sie ist schwanger! {week} Woche!',
                'Sie ist im {trimester} Monat schwanger!',
                'Oh Gott, sie ist hochschwanger!'
            ]
        },
        
        // Feature 12: Pflegebedürftigkeit/Behinderung
        pflegebedürftigkeit: {
            probability: 0.1,
            types: {
                rollstuhlfahrer: {
                    probability: 0.4,
                    effects: {
                        transport_schwierig: 0.8,
                        rollstuhl_mitnehmen: 1.0,
                        tragehilfe_evtl_nötig: 0.3
                    },
                    info: 'Patient sitzt im Rollstuhl, können Sie den mitnehmen?'
                },
                bettlägerig: {
                    probability: 0.3,
                    effects: {
                        tragehilfe_nötig: 0.9,
                        schaufeltrage: 1.0,
                        zeitaufwand_höher: 1.0
                    },
                    info: 'Patient liegt im Bett, kann nicht aufstehen'
                },
                beatmungspatient: {
                    probability: 0.1,
                    effects: {
                        spezialausrüstung: 1.0,
                        nef_zwingend: 1.0,
                        zeitaufwand_hoch: 1.0
                    },
                    info: 'Patient ist beatmet, Beatmungsgerät läuft'
                },
                adipositas: {
                    probability: 0.2,
                    effects: {
                        tragehilfe_nötig: 0.9,
                        fw_für_tragehilfe: 0.5,
                        spezialtrage_evtl: 0.4
                    },
                    info: 'Patient ist sehr schwer, schätze über 150 Kilo'
                }
            }
        },
        
        // Feature 3: Dynamische Vorgeschichte
        vorgeschichte: {
            herzerkrankung: {
                probability: 0.6,
                kenntnis: {
                    bekannt: { probability: 0.7, responses: ['Ja, hatte schon mal einen Herzinfarkt', 'Ja, der hat was mit dem Herzen'] },
                    unsicher: { probability: 0.2, responses: ['Ich glaub schon', 'Äh, ich meine ja'] },
                    unbekannt: { probability: 0.1, responses: ['Weiß ich nicht', 'Keine Ahnung'] }
                }
            },
            
            medikamente: {
                probability: 0.7,
                types: {
                    blutdruck: { probability: 0.6, names: ['Blutdrucktabletten', 'Ramipril', 'Bisoprolol'] },
                    blutverdünner: { probability: 0.3, names: ['Marcumar', 'ASS', 'Blutverdünner'] },
                    herz: { probability: 0.4, names: ['Herztabletten', 'Digitalis'] },
                    unbekannt: { probability: 0.1, response: 'Weiß nicht welche' }
                },
                kenntnis: {
                    genau: 0.3,
                    ungefähr: 0.5,
                    keine_ahnung: 0.2
                }
            },
            
            diabetes: {
                probability: 0.3,
                kenntnis: {
                    bekannt: 0.5,
                    unsicher: 0.3,
                    unbekannt: 0.2
                },
                // Feature 3: Kombination verstärkt Komplikationen
                kombination_mit_herzinfarkt: {
                    effects: {
                        komplikationen: 1.3,
                        bewusstlos: 1.25,
                        unterzucker_möglich: 0.2
                    }
                }
            },
            
            bluthochdruck: {
                probability: 0.7,
                responses: ['Ja, hoher Blutdruck', 'Ja, Bluthochdruck', 'Weiß nicht genau']
            },
            
            raucher: {
                probability: 0.4,
                impact: 'risikofaktor'
            }
        }
    }