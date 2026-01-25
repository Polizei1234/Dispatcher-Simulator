// =========================================================================================
// INTOXIKATION TEMPLATE V2.0 - Vergiftungen, Antidote, Giftnotruf!
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const INTOXIKATION_TEMPLATE = {
    
    id: 'intoxikation',
    kategorie: 'rd',
    stichwort: 'Vergiftung / Intoxikation',
    weight: 2.5,  // Mittel-häufig
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            patient_selbst_verwirrt: {
                probability: 0.15,
                speech_pattern: 'verwirrt, lallend evtl.',
                variations: [
                    '*lallt* Ich hab... zu viele Tabletten genommen...',
                    'Mir ist schlecht... ich hab was genommen...',
                    'Ich glaube, ich hab mich vergiftet...'
                ],
                characteristics: {
                    sprachstörung_evtl: 0.6,
                    bewusstseinstrübung: 0.5
                }
            },
            
            angehöriger_panisch: {
                probability: 0.35,
                speech_pattern: 'panisch, verzweifelt',
                variations: [
                    'Mein Sohn reagiert nicht mehr! Ich hab leere Tablettenpackungen gefunden!',
                    'Sie hat sich mit Tabletten vergiftet!',
                    'Er ist bewusstlos! Ich glaube Drogenüberdosis!',
                    'Mein Kind hat Spülmittel getrunken!',
                    'Sie hat eine ganze Packung Schlafmittel genommen!'
                ],
                characteristics: {
                    leere_packungen_gefunden: 0.7,
                    suizidversuch_vermutet: 0.5
                },
                background_sounds: ['crying', 'panicked_voices']
            },
            
            angehöriger_kind: {
                probability: 0.2,
                speech_pattern: 'besorgt, ängstlich',
                variations: [
                    'Mein Kind hat Tabletten aus der Handtasche gegessen!',
                    'Er hat Putzmittel getrunken!',
                    'Sie hat im Garten Beeren gegessen!',
                    'Mein Baby hat eine Pflanze gegessen!'
                ],
                characteristics: {
                    kind_betroffen: 1.0,
                    unbeaufsichtigt_evtl: 0.7
                }
            },
            
            freunde_party: {
                probability: 0.15,
                speech_pattern: 'aufgeregt, evtl. selbst berauscht',
                variations: [
                    'Mein Kumpel kippt um! Ich glaube, er hat was genommen!',
                    'Sie reagiert nicht mehr! Wir waren auf einer Party!',
                    'Er hat zu viel getrunken und jetzt atmet er kaum noch!'
                ],
                characteristics: {
                    party_kontext: 0.9,
                    mehrere_substanzen_evtl: 0.6
                },
                background_sounds: ['music', 'people_talking']
            },
            
            zeuge_arbeit: {
                probability: 0.1,
                speech_pattern: 'besorgt, sachlich',
                variations: [
                    'Kollege in Lagerhalle bewusstlos, Gasentwicklung!',
                    'Arbeitsunfall, chemische Dämpfe eingeatmet!',
                    'Person hat versehentlich Chemikalie getrunken!'
                ],
                characteristics: {
                    arbeitsunfall: 0.9,
                    giftstoff_bekannt: 0.7
                }
            },
            
            polizei_vor_ort: {
                probability: 0.05,
                speech_pattern: 'professionell',
                variations: [
                    'Polizei vor Ort, bewusstlose Person, V.a. Drogenüberdosis',
                    'Verdacht auf Suizidversuch mit Medikamenten, Person somnolent'
                ]
            }
        },
        
        dynamik: {
            verschlechterung_bewusstsein: {
                probability: 0.25,
                trigger_time: { min: 120, max: 300 },
                variations: [
                    'Er reagiert jetzt gar nicht mehr!',
                    'Sie wird immer schläfriger!',
                    'Die Augen fallen ihm zu!'
                ],
                kritisch: 0.8
            },
            
            atemstörung: {
                probability: 0.15,
                trigger_time: { min: 90, max: 240 },
                variations: [
                    'Die Atmung wird ganz flach!',
                    'Er atmet kaum noch!',
                    'Sie schnappt nach Luft!'
                ],
                lebensbedrohlich: 1.0
            },
            
            krampfanfall: {
                probability: 0.1,
                trigger_time: { min: 60, max: 180 },
                variations: [
                    'Er krämpft jetzt!',
                    'Sie hat einen Anfall!'
                ],
                kritisch: 1.0
            },
            
            erbrechen: {
                probability: 0.3,
                trigger_time: { min: 30, max: 120 },
                variations: [
                    'Er erbricht jetzt!',
                    'Sie übergibt sich stark!'
                ]
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.52,
            female: 0.48
        },
        
        alter: {
            distribution: 'risk_groups',
            
            ranges: {
                kleinkinder: {
                    range: [1, 5],
                    probability: 0.15,
                    risiko: 'Akzidentelle Vergiftung',
                    häufig: 'Haushaltsmittel, Medikamente'
                },
                kinder: {
                    range: [6, 15],
                    probability: 0.08,
                    risiko: 'Experimentieren'
                },
                jugendliche: {
                    range: [16, 25],
                    probability: 0.25,
                    risiko: 'Drogen, Suizidversuche',
                    häufig: 'Drogen, Alkohol, Medikamente'
                },
                erwachsene: {
                    range: [26, 60],
                    probability: 0.35,
                    risiko: 'Suizidversuche, Drogen, Alkohol'
                },
                senioren: {
                    range: [61, 90],
                    probability: 0.17,
                    risiko: 'Medikamentenverwechslung, Suizid'
                }
            }
        },
        
        bewusstseinszustand: {
            wach_orientiert: {
                probability: 0.3,
                gcs: '15'
            },
            wach_verwirrt: {
                probability: 0.25,
                gcs: '13-14',
                desorientiert: 0.8
            },
            somnolent: {
                probability: 0.25,
                gcs: '9-12',
                erweckbar: 0.9,
                kritisch: 0.6
            },
            soporös: {
                probability: 0.12,
                gcs: '6-8',
                kaum_erweckbar: 0.9,
                intubation_evtl: 0.7,
                kritisch: 0.9
            },
            koma: {
                probability: 0.08,
                gcs: '3-5',
                nicht_erweckbar: 1.0,
                intubation_zwingend: 0.95,
                lebensbedrohlich: 1.0
            }
        }
    },
    
    // ========================================
    // 💊 INTOXIKATIONSARTEN
    // ========================================
    intoxikationsarten: {
        // MEDIKAMENTE
        medikamente: {
            probability: 0.35,
            name: 'Medikamentenüberdosis',
            
            substanzen: {
                benzodiazepine: {
                    probability: 0.25,
                    name: 'Benzodiazepine (Schlaf-/Beruhigungsmittel)',
                    beispiele: ['Valium', 'Tavor', 'Dormicum'],
                    
                    symptome: {
                        müdigkeit: 0.95,
                        schwindel: 0.8,
                        somnolenz: 0.7,
                        atemdepression: 0.4,
                        hypotonie: 0.5
                    },
                    
                    gefahr: {
                        bewusstlosigkeit: 0.6,
                        atemdepression_bei_hoher_dosis: 0.7
                    },
                    
                    antidot: {
                        name: 'Flumazenil (Anexate)',
                        indikation: 'Schwere Intoxikation mit Atemdepression',
                        cave: 'Krampfanfall-Risiko'
                    },
                    
                    therapie: 'Symptomatisch, Antidot selten',
                    prognose: 'Meist gut'
                },
                
                paracetamol: {
                    probability: 0.2,
                    name: 'Paracetamol',
                    
                    symptome: {
                        initial_symptomarm: 0.8,
                        übelkeit_erbrechen: 0.6,
                        bauchschmerzen: 0.5
                    },
                    
                    gefahr: {
                        leberversagen_verzögert: 0.7,
                        ab: '10-15g bei Erwachsenen',
                        zeitfenster: '24-72h'
                    },
                    
                    antidot: {
                        name: 'N-Acetylcystein (ACC, Fluimucil)',
                        zeitkritisch: 1.0,
                        wirksamkeit_abhängig_von_zeit: 1.0,
                        info: 'Je früher desto besser! <8h optimal'
                    },
                    
                    therapie: 'Antidot N-Acetylcystein, Klinik',
                    prognose: 'Gut bei früher Therapie',
                    tücken: 'Initial symptomarm!'
                },
                
                opioide_medikament: {
                    probability: 0.15,
                    name: 'Opioide/Opiate (Schmerzmittel)',
                    beispiele: ['Morphin', 'Fentanyl', 'Oxycodon', 'Tramadol'],
                    
                    symptome: {
                        müdigkeit: 0.9,
                        atemdepression: 0.8,
                        miosis: 0.9,
                        bewusstlosigkeit: 0.7
                    },
                    
                    trias: {
                        name: 'Opioid-Trias',
                        miosis: 1.0,
                        atemdepression: 1.0,
                        bewusstlosigkeit: 1.0
                    },
                    
                    antidot: {
                        name: 'Naloxon (Narcanti)',
                        wirkung_schnell: 1.0,
                        wirkdauer_kurz: 1.0,
                        wiederholung_evtl: 0.8
                    },
                    
                    lebensbedrohlich: 0.9,
                    therapie: 'Naloxon, Beatmung'
                },
                
                trizyklische_antidepressiva: {
                    probability: 0.12,
                    name: 'Trizyklische Antidepressiva',
                    beispiele: ['Amitriptylin', 'Doxepin'],
                    
                    symptome: {
                        verwirrtheit: 0.8,
                        tachykardie: 0.9,
                        mydriasis: 0.7,
                        mundtrockenheit: 0.8,
                        krampfanfälle: 0.4,
                        rhythmusstörungen: 0.6
                    },
                    
                    gefahr: {
                        herzrhythmusstörungen: 0.7,
                        krampfanfälle: 0.5
                    },
                    
                    therapie: 'Symptomatisch, EKG-Monitoring',
                    gefährlich: 1.0
                },
                
                ssri: {
                    probability: 0.1,
                    name: 'SSRI (Neuere Antidepressiva)',
                    beispiele: ['Citalopram', 'Sertralin'],
                    symptome: 'Übelkeit, Zittern, Unruhe',
                    therapie: 'Symptomatisch',
                    prognose: 'Meist gut'
                },
                
                betablocker: {
                    probability: 0.08,
                    name: 'Betablocker',
                    symptome: {
                        bradykardie: 0.9,
                        hypotonie: 0.8,
                        schwindel: 0.7
                    },
                    therapie: 'Atropin evtl., Klinik',
                    gefährlich: 0.7
                },
                
                andere: {
                    probability: 0.1,
                    name: 'Andere Medikamente'
                }
            },
            
            intention: {
                suizidversuch: {
                    probability: 0.6,
                    psychiatrie: 1.0
                },
                versehentlich: {
                    probability: 0.25,
                    bei_senioren_häufiger: 0.7
                },
                missbrauch: {
                    probability: 0.15
                }
            }
        },
        
        // DROGEN
        drogen: {
            probability: 0.25,
            name: 'Drogenintoxikation',
            
            substanzen: {
                opioide_heroin: {
                    probability: 0.35,
                    name: 'Opioide (Heroin, Fentanyl)',
                    
                    symptome: {
                        atemdepression: 0.9,
                        miosis: 0.95,
                        bewusstlosigkeit: 0.8,
                        zyanose: 0.6
                    },
                    
                    trias: 'Miosis + Atemdepression + Bewusstlosigkeit',
                    
                    antidot: {
                        name: 'Naloxon',
                        lebensrettend: 1.0,
                        wirkung_schnell: 1.0,
                        wirkdauer: '30-90 Min',
                        cave: 'Entzugssymptome, Wiederholung evtl.'
                    },
                    
                    lebensbedrohlich: 1.0,
                    häufig_letal: 0.3
                },
                
                kokain: {
                    probability: 0.15,
                    name: 'Kokain',
                    
                    symptome: {
                        tachykardie: 0.9,
                        hypertonie: 0.85,
                        unruhe: 0.9,
                        mydriasis: 0.8,
                        brustschmerzen: 0.5,
                        krampfanfälle: 0.3
                    },
                    
                    komplikationen: {
                        herzinfarkt: 0.2,
                        schlaganfall: 0.15,
                        krampfanfall: 0.3,
                        hyperthermie: 0.4
                    },
                    
                    therapie: 'Symptomatisch, Kühlung, Benzodiazepine',
                    gefährlich: 1.0
                },
                
                amphetamine: {
                    probability: 0.2,
                    name: 'Amphetamine (Speed, Crystal Meth, MDMA/Ecstasy)',
                    
                    symptome: {
                        unruhe: 0.9,
                        tachykardie: 0.9,
                        hypertonie: 0.8,
                        hyperthermie: 0.6,
                        mydriasis: 0.8,
                        kiefermahlen: 0.7
                    },
                    
                    komplikationen: {
                        hyperthermie: 0.5,
                        krampfanfälle: 0.3,
                        rhabdomyolyse: 0.2,
                        hyponatriämie_bei_mdma: 0.3
                    },
                    
                    therapie: 'Kühlung, Benzodiazepine, Flüssigkeit',
                    gefährlich: 0.8
                },
                
                cannabis: {
                    probability: 0.15,
                    name: 'Cannabis',
                    symptome: 'Angst, Tachykardie, Verwirrtheit',
                    meist_harmlos: 0.9,
                    therapie: 'Beruhigung, Beobachtung'
                },
                
                ghb_gbl: {
                    probability: 0.08,
                    name: 'GHB/GBL (Liquid Ecstasy, K.O.-Tropfen)',
                    
                    symptome: {
                        plötzliche_bewusstlosigkeit: 0.9,
                        atemdepression: 0.7,
                        erbrechen: 0.6,
                        kurze_wirkdauer: 0.8
                    },
                    
                    charakteristisch: 'Plötzliches Koma, dann schnelle Erholung',
                    therapie: 'Symptomatisch, meist kurze Dauer',
                    gefährlich: 0.8
                },
                
                nps: {
                    probability: 0.07,
                    name: 'Neue psychoaktive Substanzen ("Legal Highs")',
                    symptome: 'Sehr variabel, oft schwer',
                    unberechenbar: 1.0,
                    therapie: 'Symptomatisch',
                    gefährlich: 0.9
                }
            },
            
            mischkonsum: {
                probability: 0.5,
                name: 'Mischkonsum (Polyintoxikation)',
                häufig: ['Alkohol + Drogen', 'Mehrere Drogen'],
                gefährlicher: 1.0
            }
        },
        
        // ALKOHOL
        alkohol: {
            probability: 0.2,
            name: 'Alkoholintoxikation',
            
            stadien: {
                leicht: {
                    probability: 0.25,
                    promille: '0.5-1.5',
                    symptome: 'Euphorisiert, gesprächig',
                    meist_keine_behandlung: 0.9
                },
                
                mittel: {
                    probability: 0.35,
                    promille: '1.5-2.5',
                    symptome: {
                        lallende_sprache: 0.9,
                        gangunsicherheit: 0.9,
                        verwirrtheit: 0.7
                    },
                    ausnuechterung: 0.8
                },
                
                schwer: {
                    probability: 0.3,
                    promille: '2.5-4.0',
                    symptome: {
                        somnolenz: 0.8,
                        erbrechen: 0.7,
                        inkontinenz: 0.5,
                        hypoglykämie_risiko: 0.4
                    },
                    klinik: 0.9
                },
                
                lebensbedrohlich: {
                    probability: 0.1,
                    promille: '>4.0',
                    symptome: {
                        koma: 0.9,
                        atemdepression: 0.7,
                        aspiration_risiko: 0.8
                    },
                    intubation_evtl: 0.6,
                    mortalität: 0.3
                }
            },
            
            komplikationen: {
                hypoglykämie: 0.3,
                aspiration: 0.2,
                hypothermie: 0.25,
                trauma: 0.4
            },
            
            therapie: 'Symptomatisch, Glukose, Thiamin, Ausnuechterung'
        },
        
        // CO-INTOXIKATION
        co_intoxikation: {
            probability: 0.08,
            name: 'Kohlenmonoxid-Vergiftung',
            
            ursachen: {
                rauchgasinhalation: 0.5,
                defekte_heizung: 0.25,
                grill_in_wohnung: 0.15,
                auspuffgase: 0.1
            },
            
            symptome: {
                kopfschmerzen: 0.9,
                schwindel: 0.85,
                übelkeit: 0.8,
                verwirrtheit: 0.7,
                bewusstlosigkeit: 0.5
            },
            
            charakteristisch: {
                kirschrote_haut: 0.3,
                info: 'Selten! Mythos häufiger als Realität'
            },
            
            gefahr: {
                lebensbedrohlich: 0.8,
                langzeitschäden: 0.3,
                mehrere_personen_betroffen: 0.6
            },
            
            therapie: {
                o2_hochdosiert: 1.0,
                normobare_o2_therapie: 0.9,
                hyperbare_o2_therapie_evtl: 0.2
            },
            
            eigenschutz: 1.0
        },
        
        // HAUSHALTSMITTEL
        haushaltschemikalien: {
            probability: 0.07,
            name: 'Haushaltschemikalien',
            
            substanzen: {
                spülmittel_reiniger: {
                    probability: 0.4,
                    symptome: 'Übelkeit, Erbrechen, Reizung',
                    meist_harmlos: 0.7
                },
                
                säuren_laugen: {
                    probability: 0.3,
                    name: 'Säuren/Laugen (WC-Reiniger, Abflussreiniger)',
                    symptome: {
                        verätzungen: 1.0,
                        schmerzen: 0.9,
                        speichelfluss: 0.7
                    },
                    gefahr: 'Ösophagus-/Magenperforation',
                    gefährlich: 1.0
                },
                
                andere: { probability: 0.3 }
            },
            
            häufig_bei_kindern: 0.8,
            
            therapie: 'Giftnotruf! KEINE Neutralisation, KEIN Erbrechen'
        },
        
        // PESTIZIDE
        pestizide: {
            probability: 0.03,
            name: 'Pestizide/Insektizide',
            
            organophosphate: {
                symptome: {
                    salivation: 0.9,
                    miosis: 0.9,
                    schweiß: 0.8,
                    tränenfluss: 0.8,
                    bronchospasmus: 0.7
                },
                antidot: 'Atropin',
                gefährlich: 1.0
            },
            
            arbeitsunfall_häufig: 0.6
        },
        
        // PILZE & PFLANZEN
        pilze_pflanzen: {
            probability: 0.02,
            name: 'Pilze & Pflanzen',
            
            pilze: {
                probability: 0.7,
                symptome: 'Übelkeit, Erbrechen, Durchfall',
                latenz: 'Oft Stunden',
                giftnotruf: 1.0,
                identifikation_wichtig: 1.0
            },
            
            pflanzen: {
                probability: 0.3,
                beispiele: ['Engelstrompete', 'Tollkirsche', 'Eisenhut'],
                häufig_bei_kindern: 0.9
            }
        }
    },
    
    // ========================================
    // 💊 ANTIDOTE
    // ========================================
    antidote: {
        naloxon: {
            name: 'Naloxon (Narcanti)',
            indikation: 'Opioid-Intoxikation',
            
            eigenschaften: {
                wirkung_schnell: '1-2 Min',
                wirkdauer_kurz: '30-90 Min',
                wiederholung_oft_nötig: 0.8
            },
            
            dosierung: '0.4-2mg i.v./i.m./i.n.',
            
            cave: {
                entzugssymptome: 0.7,
                aggressivität: 0.4,
                info: 'Patient kann sehr unruhig werden!'
            },
            
            lebensrettend: 1.0
        },
        
        flumazenil: {
            name: 'Flumazenil (Anexate)',
            indikation: 'Benzodiazepin-Intoxikation',
            
            cave: {
                krampfanfall_risiko: 0.3,
                bei_mischintoxikation_gefährlich: 0.8,
                selten_eingesetzt: 0.7
            },
            
            info: 'Umstritten, nur bei reiner Benzo-Intoxikation'
        },
        
        n_acetylcystein: {
            name: 'N-Acetylcystein (ACC)',
            indikation: 'Paracetamol-Intoxikation',
            
            zeitfenster: {
                optimal: '<8h',
                wirksam: '<24h',
                je_früher_desto_besser: 1.0
            },
            
            info: 'Verhindert Leberversagen, zeitkritisch!'
        },
        
        atropin: {
            name: 'Atropin',
            indikation: 'Organophosphat-Vergiftung',
            wirkung: 'Parasympatholytikum'
        }
    },
    
    // ========================================
    // 🧠 TOXIKOLOGISCHE SYNDROME
    // ========================================
    toxikologische_syndrome: {
        info: 'Symptomgruppen helfen bei Identifikation',
        
        anticholinerges_syndrom: {
            name: 'Anticholinerges Syndrom',
            substanzen: ['Trizyklische Antidepressiva', 'Antihistaminika'],
            
            merksatz: {
                deutsch: 'Heiß wie ein Hase, blind wie eine Fledermaus, trocken wie ein Knochen, rot wie eine Bete, verrückt wie ein Hutmacher',
                symptome: {
                    hyperthermie: 1.0,
                    mydriasis: 1.0,
                    mundtrockenheit: 1.0,
                    hautrötung: 1.0,
                    verwirrtheit: 1.0
                }
            }
        },
        
        cholinerges_syndrom: {
            name: 'Cholinerges Syndrom',
            substanzen: ['Organophosphate', 'Insektizide'],
            
            merksatz: 'SLUD',
            symptome: {
                salivation: 1.0,
                lacrymation: 1.0,
                urination: 1.0,
                defecation: 1.0,
                miosis: 1.0
            }
        },
        
        sympathomimetisches_syndrom: {
            name: 'Sympathomimetisches Syndrom',
            substanzen: ['Kokain', 'Amphetamine'],
            
            symptome: {
                tachykardie: 1.0,
                hypertonie: 1.0,
                mydriasis: 1.0,
                hyperthermie: 0.8,
                unruhe: 1.0
            }
        },
        
        opiat_syndrom: {
            name: 'Opiat-Syndrom',
            
            trias: {
                miosis: 1.0,
                atemdepression: 1.0,
                bewusstlosigkeit: 1.0
            }
        }
    },
    
    // ========================================
    // 🧹 DEKONTAMINATION
    // ========================================
    dekontamination: {
        magenspülung: {
            früher_standard: 1.0,
            heute_selten: 1.0,
            nur_bei: 'Lebensbedrohlicher Intoxikation <1h',
            info: 'Kaum noch durchgeführt'
        },
        
        aktivkohle: {
            name: 'Aktivkohle (Carbo medicinalis)',
            wirkung: 'Bindet Gift im Magen-Darm-Trakt',
            
            indikation: {
                zeit: '<1-2h nach Ingestion',
                bei_giftigen_substanzen: 1.0
            },
            
            kontraindikationen: [
                'Bewusstlosigkeit ohne Intubation',
                'Verätzungen',
                'Kohlenwasserstoffe'
            ],
            
            dosierung: '1g/kg Körpergewicht',
            
            häufigkeit: 0.4
        },
        
        erbrechen_auslösen: {
            name: 'Erbrechen auslösen (Ipecacuanha)',
            heute: 'KONTRAINDIZIERT',
            info: 'Früher Standard, heute NICHT mehr!'
        }
    },
    
    // ========================================
    // 🧠 PSYCHIATRISCHE ASPEKTE
    // ========================================
    psychiatrische_aspekte: {
        suizidversuch: {
            probability: 0.5,
            
            charakteristika: {
                große_mengen: 0.8,
                abschiedsbrief_evtl: 0.2,
                vorgeschichte_oft: 0.6
            },
            
            weiteres_vorgehen: {
                psychiatrische_vorstellung: 1.0,
                zwangseinweisung_evtl: 0.4,
                krisenintervention: 1.0
            },
            
            wichtig: 'Nach Stabilisierung IMMER Psychiatrie!'
        },
        
        parasuizid: {
            probability: 0.2,
            name: 'Parasuizid ("Hilferuf")',
            charakteristika: 'Kleinere Mengen, Hilfe gerufen',
            trotzdem_ernst_nehmen: 1.0
        },
        
        akzidentell: {
            probability: 0.3,
            name: 'Versehentlich',
            häufig_bei: ['Kindern', 'Senioren', 'Verwechslung']
        }
    },
    
    // ========================================
    // ☎️ GIFTNOTRUF
    // ========================================
    giftnotruf: {
        indikation: {
            unbekannte_substanz: 1.0,
            spezielle_substanz: 1.0,
            therapie_unsicher: 1.0
        },
        
        informationen_bereithalten: [
            'Substanz/Produkt',
            'Menge',
            'Zeitpunkt',
            'Patient: Alter, Gewicht',
            'Symptome',
            'Maßnahmen bisher'
        ],
        
        deutschland: {
            berlin: '030 19240',
            bonn: '0228 19240',
            erfurt: '0361 730730',
            freiburg: '0761 19240',
            göttingen: '0551 19240',
            homburg: '06841 19240',
            mainz: '06131 19240',
            münchen: '089 19240',
            nürnberg: '0911 3982451'
        },
        
        österreich: '+43 1 406 43 43',
        schweiz: '145',
        
        wichtig: '24/7 erreichbar, kostenlos, kompetent'
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        zuhause: {
            probability: 0.65,
            address_types: ['residential', 'apartment']
        },
        
        party_club: {
            probability: 0.15,
            address_types: ['club', 'bar', 'party'],
            meist_drogen_alkohol: 0.9,
            nachtzeit: 0.8
        },
        
        öffentlich: {
            probability: 0.12,
            address_types: ['public_place', 'park', 'street'],
            oft_obdachlose: 0.4
        },
        
        arbeitsplatz: {
            probability: 0.05,
            address_types: ['industrial', 'office'],
            meist_chemikalien: 0.7
        },
        
        krankenhaus_psychiatrie: {
            probability: 0.03,
            address_types: ['hospital'],
            suizidversuch_station: 0.8
        }
    },
    
    // ========================================
    // 🚑 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.3,
            ktw: 0
        },
        
        nef_indikation: {
            probability: 0.3,
            
            kriterien: {
                bewusstlosigkeit: 1.0,
                atemdepression: 1.0,
                krampfanfall: 1.0,
                instabil: 1.0,
                antidot_erforderlich: 0.8
            }
        },
        
        zielklinik: {
            klinik_mit_intensivstation: {
                probability: 0.6,
                bei_schwerer_intoxikation: 1.0
            },
            
            klinik_mit_psychiatrie: {
                probability: 0.5,
                bei_suizidversuch: 1.0
            },
            
            standard: {
                probability: 0.3,
                bei_leichter_intoxikation: 1.0
            }
        },
        
        polizei: {
            probability: 0.3,
            bei: ['Drogen', 'Fremdgefährdung', 'Straftat']
        },
        
        notarzt_voranmeldung: {
            bei: ['Schwere Intoxikation', 'Antidot nötig', 'Intensiv'],
            wichtig: 0.8
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            bewusstlosigkeit: {
                probability: 0.25,
                trigger_time: { min: 120, max: 300 },
                change: 'Patient reagiert nicht mehr',
                gcs_sinkt: 1.0
            },
            
            atemstillstand: {
                probability: 0.1,
                trigger_time: { min: 90, max: 240 },
                change: 'Atmung setzt aus',
                reanimation: 1.0
            },
            
            krampfanfall: {
                probability: 0.1,
                trigger_time: { min: 60, max: 180 },
                change: 'Generalisierter Krampfanfall'
            }
        }
    },
    
    // ========================================
    // 📊 PROTOKOLL & BEWERTUNG
    // ========================================
    protokoll: {
        tracked_data: {
            substanz_erfragt: 'FROM_CALL',
            menge_erfragt: 'FROM_CALL',
            zeitpunkt_erfragt: 'FROM_CALL',
            bewusstseinszustand: 'FROM_ASSESSMENT',
            atmung_beurteilt: 'FROM_ASSESSMENT',
            antidot_erwähnt: 'FROM_DISPOSITION',
            giftnotruf_empfohlen: 'FROM_DISPOSITION'
        },
        
        bewertung: {
            kriterien: {
                substanz_erfragt: {
                    wichtig: 'kritisch',
                    info: 'Was wurde eingenommen?'
                },
                
                menge_erfragt: {
                    wichtig: 'sehr_hoch',
                    info: 'Wie viel? Wie viele Tabletten?'
                },
                
                zeitpunkt_erfragt: {
                    wichtig: 'sehr_hoch',
                    info: 'Wann eingenommen?'
                },
                
                bewusstsein_beurteilt: {
                    wichtig: 'kritisch',
                    info: 'GCS einschätzen!'
                },
                
                atmung_abgefragt: {
                    wichtig: 'kritisch',
                    info: 'Atemdepression?'
                },
                
                nef_bei_bewusstlosigkeit: {
                    wichtig: 'kritisch',
                    info: 'Bei GCS <9 NEF zwingend!'
                },
                
                giftnotruf_empfohlen: {
                    wichtig: 'hoch',
                    info: 'Bei unbekannter Substanz'
                },
                
                psychiatrie_erwähnt: {
                    wichtig: 'hoch',
                    info: 'Bei Suizidversuch'
                }
            },
            
            kritische_fehler: [
                'Substanz nicht erfragt',
                'Bewusstseinszustand nicht beurteilt',
                'Atmung nicht abgefragt',
                'Kein NEF bei Bewusstlosigkeit',
                'Zeitpunkt nicht erfragt'
            ],
            
            häufige_fehler: [
                'Menge nicht erfragt',
                'Intention nicht geklärt',
                'Giftnotruf nicht erwähnt',
                'Psychiatrie nicht angesprochen',
                'Antidot nicht erwähnt'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient mit V.a. Medikamentenüberdosis, somnolent',
            'Drogenintoxikation, Patient bewusstlos, V.a. Opioide',
            'Alkoholintoxikation, Patient aggressiv',
            'Kind mit Ingestion von Haushaltsmittel'
        ],
        
        voranmeldung: [
            '{hospital}, hier {callsign}',
            'Voranmeldung Intoxikation',
            '{geschlecht}, {alter} Jahre',
            'Substanz: {substanz}',
            'Menge: {menge}',
            'Zeitpunkt: vor {zeit}',
            'Patient {bewusstseinszustand}, GCS {gcs}',
            'V.a. Suizidversuch',
            'ETA {eta} Minuten, kommen.'
        ]
    },
    
    // ========================================
    // 🎯 SPECIAL
    // ========================================
    special: {
        learning_points: [
            'Substanz, Menge, Zeitpunkt erfragt?',
            'Bewusstseinszustand beurteilen (GCS)',
            'Atmung abfragen (Atemdepression?)',
            'Opioide: Naloxon lebensrettend',
            'Paracetamol: Zeitkritisch, ACC!',
            'Giftnotruf bei Unklarheit',
            'Suizidversuch → Psychiatrie',
            'NEF bei GCS <9',
            'KEIN Erbrechen auslösen!',
            'Opioid-Trias: Miosis + Atemdepression + Bewusstlosigkeit'
        ],
        
        szenarien: {
            heroin_ueberdosis: {
                häufigkeit: 0.15,
                ablauf: [
                    'Patient bewusstlos aufgefunden',
                    'Freunde berichten Heroinkonsum',
                    'Miosis, Atemdepression',
                    'GCS 4',
                    'Naloxon-Gabe',
                    'Schnelle Besserung',
                    'Cave: Entzug, Aggressivität'
                ]
            },
            
            suizidversuch_medikamente: {
                häufigkeit: 0.3,
                ablauf: [
                    'Angehöriger findet Patient',
                    'Leere Tablettenpackungen',
                    'Abschiedsbrief',
                    'Patient somnolent',
                    'Klinik + Psychiatrie'
                ]
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { INTOXIKATION_TEMPLATE };
}
