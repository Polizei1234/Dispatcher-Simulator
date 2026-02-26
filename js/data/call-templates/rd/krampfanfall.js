// =========================================================================================
// KRAMPFANFALL TEMPLATE - Epileptischer Anfall und andere Krampfgeschehen
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const KRAMPFANFALL_TEMPLATE = {
    
    id: 'krampfanfall',
    kategorie: 'rd',
    stichwort: 'Krampfanfall',
    weight: 2,
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            zeuge_aufgeregt: {
                probability: 0.4,
                speech_pattern: 'aufgeregt, schockiert',
                variations: [
                    'Jemand hat einen Krampfanfall!',
                    'Hier krampft jemand!',
                    'Eine Person zuckt am ganzen Körper!',
                    'Epileptischer Anfall!'
                ],
                effects: {
                    dramatisiert_evtl: 0.5
                }
            },
            
            angehöriger_erfahren: {
                probability: 0.25,
                speech_pattern: 'besorgt aber sachlich',
                variations: [
                    'Mein Mann hat einen Anfall',
                    'Sie hat wieder gekrampft',
                    '{Er/Sie} hat einen epileptischen Anfall'
                ],
                info: 'Kennt die Erkrankung',
                weiß_was_zu_tun: 0.8
            },
            
            angehöriger_unerfahren: {
                probability: 0.2,
                speech_pattern: 'panisch, überfordert',
                variations: [
                    'Was soll ich tun?! {Er/Sie} krampft!',
                    'Ich habe so etwas noch nie gesehen!',
                    '{Er/Sie} verdreht die Augen und zuckt!'
                ],
                erste_erfahrung: 1.0
            },
            
            patient_nach_anfall: {
                probability: 0.1,
                speech_pattern: 'verwirrt, desorientiert',
                variations: [
                    'Ich... weiß nicht was passiert ist...',
                    'Mir wurde gesagt ich hatte einen Anfall',
                    'Bin wohl umgekippt... kann mich nicht erinnern'
                ],
                anfall_vorbei: 1.0,
                erinnerungslücke: 1.0
            },
            
            betreuer_einrichtung: {
                probability: 0.04,
                speech_pattern: 'professionell',
                variations: [
                    'Bewohner hat Krampfanfall',
                    'Patient krampft'
                ],
                location: ['pflegeheim', 'behinderteneinrichtung'],
                dokumentation_vorhanden: 0.9
            },
            
            polizei: {
                probability: 0.01,
                speech_pattern: 'sachlich',
                variations: ['Person mit Krampfanfall auf Straße'],
                location: 'öffentlich'
            }
        },
        
        dynamik: {
            anfall_vorbei: {
                probability: 0.6,
                trigger_time: { min: 30, max: 180 },
                change: 'Der Anfall ist vorbei, aber {er/sie} ist noch total verwirrt',
                info: 'Typischer Verlauf'
            },
            
            anfall_hält_an: {
                probability: 0.15,
                trigger_time: { min: 120, max: 300 },
                change: 'Der Anfall hört nicht auf!',
                effects: {
                    status_epilepticus: 1.0,
                    kritisch: 1.0,
                    nef_zwingend: 1.0
                },
                info: 'Ab 5 Minuten Status epilepticus!'
            },
            
            zweiter_anfall: {
                probability: 0.1,
                trigger_time: { min: 180, max: 480 },
                change: '{Er/Sie} krampft schon wieder!',
                effects: {
                    serienanfall: 1.0,
                    kritischer: 0.9
                }
            },
            
            verletzung_entdeckt: {
                probability: 0.2,
                trigger_time: { min: 60, max: 240 },
                change: '{Er/Sie} blutet! Hat sich wohl beim Sturz verletzt',
                siehe: 'verletzungen'
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.55,
            female: 0.45
        },
        
        alter: {
            distribution: 'wide',
            mean: 35,
            stddev: 20,
            min: 1,
            max: 85,
            info: 'Kann in jedem Alter auftreten'
        },
        
        bekannte_epilepsie: {
            probability: 0.7,
            info: 'Meist bekannte Grunderkrankung'
        }
    },
    
    // ========================================
    // 💥 ANFALLSTYP
    // ========================================
    anfallstyp: {
        generalisiert_tonisch_klonisch: {
            probability: 0.6,
            beschreibung: 'Grand Mal - klassischer großer Anfall',
            phasen: {
                tonische_phase: {
                    dauer: '10-20 Sekunden',
                    beschreibung: 'Versteifung',
                    variations: [
                        'Körper versteifte sich',
                        'wurde ganz steif',
                        'streckte sich durch'
                    ],
                    atmung_sistiert: 1.0,
                    zyanose: 0.8
                },
                
                klonische_phase: {
                    dauer: '30-90 Sekunden',
                    beschreibung: 'Rhythmisches Zucken',
                    variations: [
                        'zuckt am ganzen Körper',
                        'rhythmisches Zucken',
                        'Arme und Beine zucken',
                        'schüttelt sich'
                    }
                },
                
                postiktale_phase: {
                    dauer: '5-30 Minuten',
                    beschreibung: 'Danach',
                    symptoms: {
                        bewusstlos_schläfrig: 0.9,
                        verwirrt: 1.0,
                        erschöpft: 1.0,
                        orientierungslos: 0.9,
                        kopfschmerzen: 0.6,
                        muskelkater: 0.7
                    }
                }
            },
            
            begleitsymptome: {
                schaum_vor_mund: {
                    probability: 0.6,
                    variations: [
                        'Schaum vor dem Mund',
                        'speichelt stark'
                    ]
                },
                
                zungenbiss: {
                    probability: 0.4,
                    variations: [
                        'blutet aus dem Mund',
                        'hat sich auf die Zunge gebissen'
                    ],
                    typisch: 1.0
                },
                
                einnässen: {
                    probability: 0.3,
                    variations: [
                        'hat sich eingepinkelt',
                        'Hose ist nass'
                    ]
                },
                
                einkoten: {
                    probability: 0.1,
                    info: 'Seltener'
                },
                
                augen_verdrehen: {
                    probability: 0.8,
                    variations: [
                        'verdreht die Augen',
                        'Augen nach oben',
                        'weiße Augen'
                    ]
                },
                
                zyanose: {
                    probability: 0.6,
                    variations: [
                        'wird blau',
                        'läuft blau an'
                    ],
                    während_anfall: 1.0
                }
            },
            
            info: 'Häufigster und dramatischster Anfallstyp'
        },
        
        fokaler_anfall: {
            probability: 0.2,
            beschreibung: 'Teilanfall, lokalisiert',
            varianten: {
                motorisch: {
                    probability: 0.5,
                    variations: [
                        'Arm zuckt',
                        'eine Seite zuckt',
                        'nur Gesicht zuckt'
                    ],
                    bewusstsein_erhalten: 0.6
                },
                
                sensorisch: {
                    probability: 0.3,
                    variations: [
                        'nimmt komische Gerüche wahr',
                        'sieht Blitze',
                        'kribbeln'
                    ],
                    bewusstsein_meist_erhalten: 0.9
                },
                
                komplex: {
                    probability: 0.2,
                    variations: [
                        'macht merkwürdige Bewegungen',
                        'nestelt herum',
                        'schmatzt'
                    ],
                    bewusstsein_eingeschränkt: 0.8,
                    info: 'Automatismen'
                }
            },
            
            sekundär_generalisierend: {
                probability: 0.3,
                info: 'Beginnt fokal, wird dann generalisiert',
                wie_grand_mal_dann: 1.0
            }
        },
        
        absence: {
            probability: 0.05,
            beschreibung: 'Petit Mal - kurze Bewusstseinsstörung',
            dauer: '5-15 Sekunden',
            variations: [
                'starrt ins Leere',
                'kurz weg',
                'reagiert nicht'
            ],
            patient_alter: { mean: 8, range: [4, 14] },
            info: 'Vor allem bei Kindern',
            oft_nicht_erkannt: 0.7,
            selten_notfall: 1.0
        },
        
        fieberkrampf: {
            probability: 0.1,
            beschreibung: 'Bei Kindern mit hohem Fieber',
            patient_alter: { mean: 2, range: [0.5, 5] },
            fieber_hoch: { mean: 39.5, range: [38.5, 41] },
            variations: [
                'Kind hat gekrampft',
                'Fieberkrampf'
            ],
            meist_harmlos: 0.9,
            erste_mal_sehr_besorgniserregend: 1.0,
            info: 'Eltern in Panik!'
        },
        
        gelegenheitsanfall: {
            probability: 0.05,
            beschreibung: 'Durch akute Ursache ausgelöst',
            ursachen: [
                'Hypoglykämie',
                'Alkoholentzug',
                'Elektrolytentgleisung',
                'Schädel-Hirn-Trauma'
            ],
            keine_epilepsie: 1.0,
            ursache_behandeln: 1.0
        }
    },
    
    // ========================================
    // 🏥 HERGANG
    // ========================================
    hergang: {
        plötzlich: {
            probability: 0.7,
            variations: [
                'plötzlich umgefallen und gekrampft',
                'auf einmal am Boden',
                'ohne Vorwarnung'
            ]
        },
        
        mit_aura: {
            probability: 0.3,
            variations: [
                'sagte vorher dass {er/sie} was spürt',
                'wusste dass es kommt',
                'hatte Vorzeichen'
            ],
            symptome: [
                'komisches Gefühl',
                'Schwindel',
                'Gerüche',
                'Sehstörungen'
            ],
            konnte_sich_hinlegen: 0.4,
            info: 'Patient oft vorgewarnt'
        },
        
        während_aktivität: {
            probability: 0.3,
            activities: [
                'beim Essen',
                'beim Fernsehen',
                'beim Spazieren',
                'bei der Arbeit'
            ]
        },
        
        aus_schlaf: {
            probability: 0.1,
            variations: [
                'im Schlaf gekrampft',
                'nachts'
            ],
            oft_nicht_bemerkt: 0.6
        }
    },
    
    // ========================================
    // ⏱️ ZEITVERLAUF
    // ========================================
    zeitverlauf: {
        dauer_anfall: {
            kurz: {
                probability: 0.7,
                sekunden: { mean: 90, range: [30, 180] },
                info: 'Typischer Verlauf'
            },
            
            lang: {
                probability: 0.2,
                minuten: { mean: 4, range: [3, 8] },
                besorgniserregend: 0.8
            },
            
            status_epilepticus: {
                probability: 0.1,
                minuten: { min: 5, max: 30 },
                definition: 'Über 5 Minuten oder Serienanfall',
                kritisch: 1.0,
                nef_zwingend: 1.0,
                hirnschädigung_risiko: 0.7,
                info: 'NOTFALL!'
            }
        },
        
        bei_eintreffen: {
            anfall_vorbei: {
                probability: 0.7,
                patient_zustand: {
                    schläft: 0.4,
                    verwirrt: 0.5,
                    wieder_wach: 0.1
                }
            },
            
            noch_am_krampfen: {
                probability: 0.2,
                sofortmaßnahmen_nötig: 1.0
            },
            
            postiktal: {
                probability: 0.1,
                verwirrt_aggressiv: 0.3,
                schläfrig: 0.7
            }
        }
    },
    
    // ========================================
    // 🩹 VERLETZUNGEN
    // ========================================
    verletzungen: {
        keine: {
            probability: 0.4,
            info: 'Wenn jemand abgefangen oder weich gefallen'
        },
        
        zungenbiss: {
            probability: 0.4,
            siehe: 'anfallstyp.generalisiert_tonisch_klonisch.begleitsymptome.zungenbiss',
            severity: {
                leicht: 0.7,
                stark_blutet: 0.3
            }
        },
        
        sturzverletzung: {
            probability: 0.5,
            types: {
                kopf: {
                    probability: 0.6,
                    platzwunde: 0.5,
                    beule: 0.4,
                    schädel_hirn_trauma: 0.1
                },
                
                gesicht: {
                    probability: 0.3,
                    zahnschäden: 0.3,
                    nasenbeinbruch: 0.2
                },
                
                extremitäten: {
                    probability: 0.3,
                    frakturen: 0.2,
                    prellungen: 0.8
                },
                
                schulter: {
                    probability: 0.1,
                    luxation: 0.5,
                    info: 'Typische Anfallsverletzung'
                }
            }
        },
        
        verbrennungen: {
            probability: 0.05,
            ursachen: [
                'an Herdplatte gefallen',
                'heißes Getränk umgestoßen',
                'Zigarette'
            ]
        },
        
        aspiration: {
            probability: 0.03,
            variations: [
                'hat sich verschluckt',
                'Erbrochenes eingeatmet'
            ],
            kritisch: 0.8
        }
    },
    
    // ========================================
    // 🏥 MEDIZINISCH
    // ========================================
    medizinisch: {
        vorerkrankungen: {
            epilepsie_bekannt: {
                probability: 0.7,
                dauer: {
                    seit_kindheit: 0.4,
                    seit_jahren: 0.5,
                    neu_diagnostiziert: 0.1
                }
            },
            
            schädel_hirn_trauma_früher: {
                probability: 0.15,
                info: 'Symptomatische Epilepsie'
            },
            
            hirntumor: {
                probability: 0.05,
                kritisch: 0.9
            },
            
            schlaganfall_früher: {
                probability: 0.08,
                bei_älteren: 1.0
            }
        },
        
        medikamente: {
            antikonvulsiva: {
                probability: 0.65,
                types: [
                    'Valproat (Ergenyl)',
                    'Levetiracetam (Keppra)',
                    'Carbamazepin (Tegretal)',
                    'Lamotrigin (Lamictal)',
                    'Phenytoin (Phenhydan)'
                ],
                compliance: {
                    gut: {
                        probability: 0.5,
                        trotzdem_durchbruch: 0.3
                    },
                    schlecht: {
                        probability: 0.3,
                        variations: [
                            'nimmt Tabletten nicht regelmäßig',
                            'hat Medikamente abgesetzt',
                            'vergessen einzunehmen'
                        ],
                        hauptgrund_für_anfall: 0.9
                    },
                    leer: {
                        probability: 0.1,
                        variations: [
                            'Medikament ist aus',
                            'kein Rezept geholt'
                        ]
                    },
                    neu_eingestellt: {
                        probability: 0.1,
                        noch_nicht_wirksam: 0.7
                    }
                }
            },
            
            notfallmedikament: {
                probability: 0.3,
                types: {
                    diazepam_rektal: {
                        probability: 0.6,
                        name: 'Diazepam (Stesolid)',
                        anwendung: 'rektal'
                    },
                    midazolam_bukkal: {
                        probability: 0.3,
                        name: 'Buccolam',
                        anwendung: 'Wangentasche'
                    },
                    lorazepam: {
                        probability: 0.1
                    }
                },
                gegeben: {
                    probability: 0.4,
                    wirkt: 0.7,
                    info: 'Wenn Angehörige da und geübt'
                }
            }
        },
        
        auslöser: {
            medikamente_vergessen: {
                probability: 0.35,
                info: 'Häufigster Grund!',
                siehe: 'medikamente.antikonvulsiva.compliance.schlecht'
            },
            
            schlafmangel: {
                probability: 0.2,
                variations: [
                    'hat schlecht geschlafen',
                    'war die ganze Nacht wach',
                    'wenig Schlaf'
                ],
                info: 'Wichtiger Trigger!'
            },
            
            alkohol: {
                probability: 0.15,
                variations: [
                    'hatte getrunken',
                    'nach Alkoholkonsum'
                ],
                senkt_schwelle: 1.0
            },
            
            alkoholentzug: {
                probability: 0.05,
                variations: ['Entzugskrampf'],
                auch_ohne_epilepsie: 1.0,
                kritisch: 0.8
            },
            
            stress: {
                probability: 0.1,
                variations: ['war gestresst', 'Aufregung']
            },
            
            flickerlicht: {
                probability: 0.03,
                variations: [
                    'flackerndes Licht',
                    'Disco',
                    'Videospiel'
                ],
                photosensible_epilepsie: 1.0
            },
            
            fieber: {
                probability: 0.08,
                siehe: 'anfallstyp.fieberkrampf',
                vor_allem_kinder: 1.0
            },
            
            menstruation: {
                probability: 0.05,
                condition: 'female',
                info: 'Katameniale Epilepsie'
            },
            
            ohne_auslöser: {
                probability: 0.15,
                info: 'Spontan'
            }
        },
        
        bewusstsein_bei_eintreffen: {
            wach_orientiert: {
                probability: 0.2,
                info: 'Nach längerer Zeit'
            },
            
            schläfrig_verwirrt: {
                probability: 0.5,
                variations: [
                    'verwirrt',
                    'weiß nicht wo {er/sie} ist',
                    'schläfrig',
                    'dämmrig'
                ],
                typisch_postiktal: 1.0
            },
            
            tief_schläfrig: {
                probability: 0.2,
                variations: [
                    'schläft tief',
                    'nicht richtig weckbar'
                ]
            },
            
            bewusstlos: {
                probability: 0.1,
                kritischer: 0.8,
                mögliche_ursachen: [
                    'Status epilepticus',
                    'Schädel-Hirn-Trauma',
                    'Andere Ursache'
                ]
            }
        }
    },
    
    // ========================================
    // 🏠 UMGEBUNG
    // ========================================
    umgebung: {
        wo_passiert: {
            wohnhaus: {
                probability: 0.6,
                address_types: ['residential', 'apartment'],
                sicher: 1.0
            },
            
            öffentlich_straße: {
                probability: 0.2,
                address_types: ['street', 'pedestrian'],
                zeugen: { min: 2, max: 8 },
                verkehrsgefahr: 0.5
            },
            
            arbeitsplatz: {
                probability: 0.1,
                address_types: ['commercial', 'office'],
                kollegen_helfen: 0.8
            },
            
            geschäft: {
                probability: 0.05,
                address_types: ['shop', 'retail']
            },
            
            pflegeheim: {
                probability: 0.04,
                address_types: ['nursing_home'],
                personal_geübt: 0.9
            },
            
            gefährlich: {
                probability: 0.01,
                locations: [
                    'an Treppe',
                    'im Schwimmbad',
                    'beim Autofahren'
                ],
                zusätzliche_gefahren: 1.0
            }
        },
        
        sicherheit: {
            sicher_gelagert: {
                probability: 0.6,
                variations: [
                    'haben {ihn/sie} in stabile Seitenlage gebracht',
                    'liegt sicher'
                ]
            },
            
            gefahren_entfernt: {
                probability: 0.4,
                info: 'Möbel weggeräumt etc.'
            }
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK
    // ========================================
    sozial: {
        angehörige: {
            sehr_besorgt_erste_mal: {
                probability: 0.2,
                variations: [
                    'totale Panik',
                    'hat so etwas noch nie gesehen',
                    'dachte {er/sie} stirbt'
                ],
                aufklärung_nötig: 1.0
            },
            
            kennt_das: {
                probability: 0.5,
                variations: [
                    'passiert öfter',
                    'kennen wir schon',
                    'hat das immer mal wieder'
                ],
                sachlich: 0.8
            },
            
            ärgerlich: {
                probability: 0.1,
                variations: [
                    'hat wieder die Tabletten nicht genommen!',
                    'selber schuld'
                ],
                info: 'Bei wiederholter Non-Compliance'
            }
        },
        
        zeugen: {
            haben_geholfen: {
                probability: 0.6,
                variations: [
                    'Leute haben geholfen',
                    'Passanten kümmern sich'
                ]
            },
            
            falsche_maßnahmen: {
                probability: 0.2,
                variations: [
                    'jemand wollte etwas in den Mund stecken',
                    'haben versucht festzuhalten'
                ],
                info: 'Mythen über Erste Hilfe'
            }
        },
        
        patient_will_nicht_mit: {
            probability: 0.3,
            variations: [
                'passiert öfter, brauche nicht ins Krankenhaus',
                'geht mir wieder gut',
                'muss zur Arbeit'
            ],
            besonders_wenn_bekannte_epilepsie: 0.8,
            aufklärung_nötig: 0.8
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        wohnhaus: {
            probability: 0.6,
            address_types: ['residential', 'apartment']
        },
        
        öffentlich: {
            probability: 0.25,
            address_types: ['street', 'pedestrian', 'square', 'park']
        },
        
        arbeitsplatz: {
            probability: 0.1,
            address_types: ['commercial', 'office', 'industrial']
        },
        
        andere: {
            probability: 0.05,
            address_types: ['shop', 'restaurant', 'sports_centre']
        }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN
    // ========================================
    nachforderungen: {
        nef: {
            probability: 0.15,
            trigger_time: { min: 120, max: 360 },
            reasons: [
                'Status epilepticus',
                'Serienanfall',
                'Patient bleibt bewusstlos',
                'Schweres Schädel-Hirn-Trauma',
                'Atemstörung'
            ],
            funkspruch: '{callsign}, Status epilepticus, Anfall hält an, benötigen NEF!'
        },
        
        polizei: {
            probability: 0.05,
            condition: 'location_öffentlich',
            reasons: {
                verkehr_regeln: 0.7,
                aggressiver_patient: 0.3
            }
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            status_epilepticus: {
                probability: 0.1,
                siehe: 'zeitverlauf.dauer_anfall.status_epilepticus',
                kritisch: 1.0
            },
            
            serienanfall: {
                probability: 0.1,
                trigger_time: { min: 180, max: 480 },
                change: 'Schon wieder ein Anfall!',
                kritischer: 0.8
            },
            
            aspirationspneumonie: {
                probability: 0.03,
                trigger_time: { min: 240, max: 600 },
                change: 'Bekommt schlechter Luft, rasselnde Atmung',
                kritisch: 0.7
            }
        },
        
        besserung: {
            erholt_sich: {
                probability: 0.6,
                trigger_time: { min: 300, max: 600 },
                funkspruch: '{callsign}, Patient erholt, wieder orientiert, kommen.',
                transport_trotzdem: 0.9,
                info: 'Abklärung wichtig!'
            }
        },
        
        komplikationen: {
            andere_ursache: {
                probability: 0.05,
                möglich: [
                    'Schlaganfall',
                    'Hirnblutung',
                    'Hypoglykämie',
                    'Intoxikation'
                ],
                weitere_diagnostik: 1.0
            }
        }
    },
    
    // ========================================
    // 🏥 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.15,
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'erstmaliger_anfall_oder_status_oder_komplikationen',
                hospitals: ['klinikum_ludwigsburg', 'katharinenhospital_stuttgart', 'rems_murr_klinikum_winnenden'],
                reason: 'Neurologie, CT, ggf. Intensivstation',
                untersuchungen: ['CT', 'EEG', 'Labor']
            },
            
            priorität_2: {
                condition: 'bekannte_epilepsie_unkompliziert',
                hospitals: ['nächstgelegenes_mit_neurologie'],
                reason: 'Medikamentenspiegel-Kontrolle'
            },
            
            transportverweigerung: {
                probability: 0.25,
                condition: 'bekannte_epilepsie_patient_erholt',
                aber_empfehlung_transport: 1.0,
                aufklärung: [
                    'Ursache abklären',
                    'Medikamentenspiegel prüfen',
                    'Verletzungen ausschließen'
                ]
            }
        },
        
        voranmeldung: {
            bei_status_oder_komplikationen: 0.9,
            infos: [
                'Krampfanfall',
                'Bekannte Epilepsie?',
                'Anfallsdauer',
                'Status epilepticus?',
                'Medikamente gegeben?',
                'Bewusstseinslage'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient nach Krampfanfall, postiktal verwirrt',
            'Generalisierter Anfall, jetzt schläfrig',
            'Status epilepticus, Anfall hält an',
            'Erstmaliger Krampfanfall, Patient erholt sich',
            'Bekannte Epilepsie, typischer Anfall'
        ]
    },
    
    // ========================================
    // 📊 SPECIAL
    // ========================================
    special: {
        mythen: {
            nicht_festhalten: {
                info: 'Patient NICHT festhalten während Anfall!',
                richtig: 'Nur vor Verletzungen schützen'
            },
            
            nichts_in_mund: {
                info: 'NICHTS in den Mund stecken!',
                gefahr: 'Erstickung, Zahnschäden',
                richtig: 'Stabile Seitenlage nach Anfall'
            },
            
            zunge_verschlucken: {
                info: 'Zunge kann man NICHT verschlucken!',
                mythos: 'Weit verbreitet aber falsch'
            }
        },
        
        erste_hilfe: {
            während_anfall: [
                'Gefahren entfernen',
                'Kopf schützen',
                'Zeit stoppen',
                'NICHT festhalten',
                'NICHTS in Mund'
            ],
            
            nach_anfall: [
                'Stabile Seitenlage',
                'Beobachten',
                'Beruhigen',
                'Notarzt wenn > 5 Minuten'
            ]
        },
        
        notarzt_indikationen: [
            'Anfall länger als 5 Minuten',
            'Serienanfall',
            'Erstmaliger Anfall',
            'Schwere Verletzungen',
            'Patient bleibt bewusstlos',
            'Schwangere',
            'Diabetes-Patient'
        ],
        
        langzeitfolgen: {
            meist_keine: 0.9,
            bei_status_möglich: {
                hirnschädigung: 0.3,
                info: 'Deshalb Status = Notfall!'
            }
        },
        
        fahreignung: {
            info: 'Fahrverbot nach Anfall',
            dauer: 'Mindestens 3-12 Monate je nach Epilepsie-Typ',
            patient_aufklären: 1.0
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { KRAMPFANFALL_TEMPLATE };
}
