// =========================================================================================
// HYPOGLYKÄMIE TEMPLATE V2.0 - Unterzucker, häufig, dramatische Besserung möglich
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const HYPOGLYKÄMIE_TEMPLATE = {
    
    id: 'hypoglykämie',
    kategorie: 'rd',
    stichwort: 'Hypoglykämie / Unterzucker',
    weight: 3,  // Häufig!
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            angehöriger_erfahren: {
                probability: 0.4,
                speech_pattern: 'besorgt, aber kennt sich aus',
                variations: [
                    'Mein Mann hat Unterzucker, ich hab schon gemessen',
                    'Der Blutzucker ist bei {wert}, sie ist ganz verwirrt',
                    'Er hat Unterzucker, wir haben Traubenzucker gegeben',
                    'Sie schwitzt und zittert, der Zucker ist sicher niedrig'
                ],
                characteristics: {
                    kennt_diabetes: 0.95,
                    weiß_was_zu_tun_ist: 0.8,
                    bz_bereits_gemessen: 0.7,
                    erste_hilfe_versucht: 0.6
                },
                info: 'Hat Erfahrung mit Diabetes'
            },
            
            angehöriger_unerfahren: {
                probability: 0.25,
                speech_pattern: 'panisch, überfordert',
                variations: [
                    'Er benimmt sich ganz komisch!',
                    'Sie ist total verwirrt und schwitzt!',
                    'Ich glaube, das ist der Zucker!',
                    'Was soll ich machen?!'
                ],
                characteristics: {
                    weiß_nicht_was_los_ist: 0.7,
                    keine_maßnahmen_ergriffen: 0.8
                }
            },
            
            patient_selbst: {
                probability: 0.15,
                speech_pattern: 'verwirrt, unsicher, manchmal aggressiv',
                variations: [
                    'Mir ist komisch... ich glaub, ich brauch Zucker',
                    'Ich zitter so... und mir ist schwindelig',
                    'Mir geht\'s nicht gut, ich bin Diabetiker',
                    'Ich hab vergessen zu essen...'
                ],
                characteristics: {
                    verwirrt: 0.7,
                    unkooperativ: 0.3,
                    erkennt_selbst_hypo: 0.8
                },
                info: 'Meist leichtere Hypoglykämie wenn Patient noch anrufen kann'
            },
            
            zeuge_besorgt: {
                probability: 0.1,
                speech_pattern: 'unsicher, kennt Person nicht',
                variations: [
                    'Hier benimmt sich jemand ganz komisch',
                    'Eine Person ist verwirrt und schwitzt',
                    'Jemand liegt hier, reagiert komisch'
                ],
                info: 'Keine Infos zur Vorgeschichte',
                effects: {
                    diabetes_unbekannt: 0.8,
                    keine_erste_hilfe: 0.9
                }
            },
            
            pfleger: {
                probability: 0.08,
                speech_pattern: 'professionell',
                variations: [
                    'Bewohner mit Hypoglykämie, BZ bei {wert}',
                    'Unterzucker, haben bereits Traubenzucker gegeben',
                    'Diabetischer Notfall, Patient somnolent'
                ],
                location_likely: 'pflegeheim',
                characteristics: {
                    bz_gemessen: 1.0,
                    erste_hilfe_erfolgt: 0.9,
                    vorerkrankungen_bekannt: 1.0
                }
            },
            
            arbeitskollege: {
                probability: 0.02,
                speech_pattern: 'besorgt, manchmal unwissend',
                variations: [
                    'Mein Kollege ist plötzlich ganz verwirrt',
                    'Er ist Diabetiker und benimmt sich komisch'
                ],
                location: 'arbeitsplatz'
            }
        },
        
        dynamik: {
            verschlechterung: {
                probability: 0.15,
                trigger_time: { min: 60, max: 180 },
                variations: [
                    'Er reagiert jetzt gar nicht mehr!',
                    'Sie ist jetzt bewusstlos!',
                    'Es wird schlimmer!'
                ],
                effects: {
                    bewusstlosigkeit: 0.7,
                    krampfanfall: 0.2,
                    aggressivität: 0.1
                }
            },
            
            besserung_vor_eintreffen: {
                probability: 0.25,
                trigger_time: { min: 90, max: 240 },
                change: 'Es geht ihm schon besser, wir haben Traubenzucker gegeben',
                effects: {
                    transport_evtl_abgelehnt: 0.4,
                    nur_kontrolle_nötig: 0.6
                }
            }
        },
        
        erste_hilfe_bereits: {
            traubenzucker_gegeben: {
                probability: 0.4,
                erfolg: 0.7,
                info: 'Angehöriger hat bereits Traubenzucker gegeben'
            },
            saft_getrunken: {
                probability: 0.2,
                erfolg: 0.6
            },
            essen_versucht: {
                probability: 0.15,
                erfolg: 0.5,
                info: 'Langsamer als Glucose'
            },
            nichts_gemacht: {
                probability: 0.25,
                info: 'Keine Maßnahmen ergriffen'
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
            distribution: 'bimodal',
            peaks: [
                { age: 35, weight: 0.3 },  // Typ-1-Diabetiker, jünger
                { age: 70, weight: 0.5 }   // Typ-2-Diabetiker, älter
            ],
            min: 18,
            max: 95,
            info: 'Typ-1 jünger, Typ-2 älter'
        },
        
        diabetes_typ: {
            typ_1: {
                probability: 0.35,
                characteristics: {
                    jüngere_patienten: 0.7,
                    insulin_zwingend: 1.0,
                    oft_gut_geschult: 0.7,
                    hypo_wahrnehmung_oft_gut: 0.6
                },
                besonderheiten: {
                    seit_kindheit: 0.5,
                    autoimmun: 1.0,
                    absoluter_insulinmangel: 1.0
                }
            },
            typ_2: {
                probability: 0.65,
                characteristics: {
                    ältere_patienten: 0.8,
                    tabletten: 0.6,
                    insulin: 0.4,
                    übergewicht_häufig: 0.7
                },
                besonderheiten: {
                    relativer_insulinmangel: 1.0,
                    oft_begleiterkrankungen: 0.8
                }
            }
        },
        
        bewusstseinszustand: {
            orientiert_aber_symptomatisch: {
                probability: 0.35,
                info: 'Verwirrt, schwitzt, zittert, aber ansprechbar',
                orale_glucose_möglich: 1.0
            },
            verwirrt: {
                probability: 0.35,
                info: 'Desorientiert, unkooperativ',
                orale_glucose_schwierig: 0.7
            },
            somnolent: {
                probability: 0.15,
                info: 'Schläfrig, schwer erweckbar',
                glucose_iv_nötig: 1.0
            },
            bewusstlos: {
                probability: 0.15,
                info: 'Nicht ansprechbar',
                glucose_iv_zwingend: 1.0,
                kritisch: 1.0
            }
        }
    },
    
    // ========================================
    // 🩻 SYMPTOME
    // ========================================
    symptome: {
        // Autonome Symptome (Gegenregulation)
        autonome_symptome: {
            schwitzen: {
                probability: 0.85,
                variations: [
                    'schwitzt stark',
                    'ist nass geschwitzt',
                    'der Schweiß läuft runter',
                    'ist völlig verschwitzt',
                    'Kaltschweiß'
                ],
                info: 'Typisches Frühsymptom',
                warnsignal: 1.0
            },
            
            zittern: {
                probability: 0.75,
                variations: [
                    'zittert',
                    'die Hände zittern',
                    'zittert am ganzen Körper',
                    'hat Zittern',
                    'Tremor'
                ],
                info: 'Adrenalinausschüttung'
            },
            
            herzrasen: {
                probability: 0.7,
                variations: [
                    'Herz rast',
                    'Herzrasen',
                    'Herzklopfen',
                    'Tachykardie'
                ],
                hf: { min: 100, max: 140 }
            },
            
            hunger: {
                probability: 0.6,
                variations: [
                    'hat Heißhunger',
                    'will unbedingt was essen',
                    'klagt über Hunger',
                    'großer Appetit'
                ]
            },
            
            übelkeit: {
                probability: 0.4,
                variations: [
                    'Übelkeit',
                    'ist übel',
                    'muss sich übergeben'
                ]
            },
            
            blässe: {
                probability: 0.5,
                info: 'Blass, fahl'
            }
        },
        
        // Neuroglykopenische Symptome (Gehirn)
        neuroglykopenische_symptome: {
            verwirrtheit: {
                probability: 0.8,
                severity: {
                    leicht: {
                        probability: 0.35,
                        variations: [
                            'leicht verwirrt',
                            'durcheinander',
                            'unkonzentriert'
                        ]
                    },
                    mittel: {
                        probability: 0.4,
                        variations: [
                            'ist verwirrt',
                            'weiß nicht wo er ist',
                            'desorientiert',
                            'erkennt Angehörige nicht'
                        ]
                    },
                    schwer: {
                        probability: 0.25,
                        variations: [
                            'redet wirres Zeug',
                            'total verwirrt',
                            'nicht zu erreichen'
                        ]
                    }
                },
                info: 'Gehirn braucht Glucose!'
            },
            
            sprachstörung: {
                probability: 0.4,
                variations: [
                    'lallt',
                    'spricht undeutlich',
                    'verwaschene Sprache',
                    'kann nicht richtig sprechen'
                ],
                verwechslung_mit_schlaganfall: 0.3
            },
            
            sehstörung: {
                probability: 0.35,
                variations: [
                    'sieht Doppelbilder',
                    'verschwommenes Sehen',
                    'kann nicht richtig sehen'
                ]
            },
            
            koordinationsstörung: {
                probability: 0.4,
                variations: [
                    'torkelt',
                    'unsicher auf den Beinen',
                    'kann nicht gerade gehen'
                ],
                verwechslung_mit_alkohol: 0.4
            },
            
            kopfschmerzen: {
                probability: 0.3,
                variations: ['Kopfschmerzen', 'Kopf tut weh']
            },
            
            konzentrationsstörung: {
                probability: 0.6,
                variations: [
                    'kann sich nicht konzentrieren',
                    'ist verwirrt',
                    'denkt langsam'
                ]
            }
        },
        
        // Schwere Symptome
        schwere_symptome: {
            bewusstseinsstörung: {
                probability: 0.3,
                levels: {
                    somnolent: { 
                        probability: 0.5,
                        info: 'Schläfrig, erweckbar'
                    },
                    soporös: { 
                        probability: 0.3,
                        info: 'Nur auf Schmerzreiz erweckbar'
                    },
                    bewusstlos: { 
                        probability: 0.2,
                        info: 'Koma',
                        kritisch: 1.0
                    }
                }
            },
            
            krampfanfall: {
                probability: 0.1,
                info: 'Hypoglykämischer Krampfanfall',
                upgrade_stichwort: 'Krampfanfall',
                meist_generalisiert: 0.9,
                verwechslung_mit_epilepsie: 0.5
            },
            
            aggression: {
                probability: 0.25,
                variations: [
                    'ist aggressiv',
                    'wehrt sich',
                    'will nichts essen',
                    'schreit rum',
                    'ist unkooperativ',
                    'schlägt um sich'
                ],
                info: 'Gehirn mangelversorgt = Verhaltenänderung',
                polizei_evtl: 0.1,
                fixierung_schwierig: 0.6
            },
            
            fokale_neurologie: {
                probability: 0.05,
                variations: [
                    'eine Seite schwächer',
                    'Arm lähmt',
                    'hängt im Gesicht'
                ],
                info: 'Kann Schlaganfall vortäuschen!',
                verwechslung_schlaganfall: 0.9,
                reversibel_nach_glucose: 1.0
            }
        }
    },
    
    // ========================================
    // 💉 BLUTZUCKER & STADIEN
    // ========================================
    blutzucker: {
        schwellenwerte: {
            normal: { range: [70, 110], info: 'Normoglykämie' },
            grenzwertig: { range: [60, 70], info: 'Grenzbereich' },
            leichte_hypo: { range: [50, 60], info: 'Leichte Hypoglykämie' },
            mittlere_hypo: { range: [35, 50], info: 'Mittelschwere Hypoglykämie' },
            schwere_hypo: { range: [20, 35], info: 'Schwere Hypoglykämie' },
            kritisch: { range: [0, 20], info: 'Lebensbedrohlich', kritisch: 1.0 }
        },
        
        messung: {
            bereits_gemessen: {
                probability: 0.5,
                durch: {
                    angehöriger: 0.6,
                    patient_selbst: 0.25,
                    pfleger: 0.1,
                    zeuge: 0.05
                },
                werte_verteilung: {
                    unter_30: { probability: 0.2, kritisch: 1.0 },
                    '30_40': { probability: 0.25, schwer: 1.0 },
                    '40_50': { probability: 0.3, mittel: 1.0 },
                    '50_60': { probability: 0.2, leicht: 1.0 },
                    '60_70': { probability: 0.05, grenzwertig: 1.0 }
                }
            },
            nicht_gemessen: {
                probability: 0.5,
                gründe: [
                    'Kein Messgerät vorhanden',
                    'Weiß nicht wie',
                    'Patient nicht kooperativ',
                    'Keine Zeit'
                ]
            }
        },
        
        stadien: {
            stadium_1: {
                bz_range: [50, 60],
                symptome: ['Schwitzen', 'Zittern', 'Herzrasen', 'Hunger'],
                bewusstsein: 'klar',
                therapie: 'Orale Glucose',
                selbsthilfe_möglich: 1.0
            },
            stadium_2: {
                bz_range: [35, 50],
                symptome: ['Verwirrtheit', 'Sprachstörung', 'Koordinationsstörung'],
                bewusstsein: 'eingeschränkt',
                therapie: 'Glucose i.v. oder oral mit Hilfe',
                selbsthilfe_schwierig: 0.8
            },
            stadium_3: {
                bz_range: [0, 35],
                symptome: ['Bewusstlosigkeit', 'Krampfanfall', 'Koma'],
                bewusstsein: 'nicht ansprechbar',
                therapie: 'Glucose i.v. oder Glukagon i.m.',
                kritisch: 1.0,
                hirnschäden_möglich: 0.1
            }
        }
    },
    
    // ========================================
    // 💊 MEDIZINISCH & URSACHEN
    // ========================================
    medizinisch: {
        ursachen: {
            zu_viel_insulin: {
                probability: 0.3,
                details: {
                    dosierungsfehler: 0.4,
                    doppelt_gespritzt: 0.3,
                    falsche_insulinart: 0.2,
                    sprä-ess-abstand_falsch: 0.1
                },
                info: 'Häufigste Ursache'
            },
            
            mahlzeit_vergessen: {
                probability: 0.25,
                variations: [
                    'Hat nichts gegessen',
                    'Mahlzeit ausgelassen',
                    'Zu wenig gegessen'
                ]
            },
            
            mahlzeit_verzögert: {
                probability: 0.15,
                info: 'Insulin gespritzt, dann nicht rechtzeitig gegessen'
            },
            
            mehr_aktivität: {
                probability: 0.12,
                examples: [
                    'Spaziergang gemacht',
                    'Sport getrieben',
                    'Gartenarbeit',
                    'Mehr Bewegung als sonst'
                ],
                info: 'Muskelarbeit senkt BZ'
            },
            
            alkohol: {
                probability: 0.08,
                info: 'Alkohol hemmt Glukoneogenese',
                verwechslung_betrunken: 0.6,
                oft_verzögert: 0.7,
                oft_nachts: 0.8
            },
            
            medikamentenfehler: {
                probability: 0.05,
                types: {
                    tabletten_doppelt: 0.4,
                    falsche_dosis: 0.3,
                    neue_medikation: 0.2,
                    wechselwirkung: 0.1
                }
            },
            
            infektion: {
                probability: 0.03,
                info: 'Veränderter Insulinbedarf bei Infekt',
                meist_reduzierter_bedarf: 0.7
            },
            
            niereninsuffizienz: {
                probability: 0.02,
                info: 'Insulin wird langsamer abgebaut',
                chronische_probleme: 0.9
            }
        },
        
        insulin_typen: {
            langzeit: {
                probability: 0.6,
                names: ['Lantus', 'Tresiba', 'Levemir'],
                wirkdauer: '24h',
                hypo_meist_nachts: 0.7
            },
            kurzzeit: {
                probability: 0.8,
                names: ['Humalog', 'NovoRapid', 'Apidra'],
                wirkdauer: '4-6h',
                hypo_meist_1_3h_nach_spritzen: 0.8
            },
            mischinsulin: {
                probability: 0.3,
                names: ['NovoMix', 'Humalog Mix'],
                wirkdauer: 'gemischt'
            }
        },
        
        tabletten: {
            sulfonylharnstoffe: {
                probability: 0.25,
                names: ['Glimepirid', 'Glibenclamid'],
                hypo_risiko: 'hoch',
                oft_lang_anhaltend: 0.8,
                wiederholte_hypos: 0.6
            },
            metformin: {
                probability: 0.5,
                hypo_risiko: 'sehr gering',
                info: 'Alleine kein Hypo-Risiko'
            },
            dpp4_hemmer: {
                probability: 0.2,
                hypo_risiko: 'gering'
            },
            sglt2_hemmer: {
                probability: 0.15,
                hypo_risiko: 'gering'
            }
        },
        
        vorerkrankungen: {
            probability: 0.7,
            types: {
                niereninsuffizienz: {
                    probability: 0.4,
                    hypo_risiko_erhöht: 0.9,
                    dialyse: 0.3
                },
                herzinsuffizienz: {
                    probability: 0.3,
                    medikamente_viele: 0.8
                },
                neuropathie: {
                    probability: 0.35,
                    hypo_wahrnehmung_gestört: 0.7,
                    info: 'Spürt Symptome nicht!'
                },
                demenz: {
                    probability: 0.15,
                    medikamenten_fehler_häufig: 0.8,
                    selbstmanagement_schlecht: 0.9
                },
                alkoholismus: {
                    probability: 0.08,
                    hypo_risiko_sehr_hoch: 1.0
                }
            }
        },
        
        hypo_wahrnehmungsstörung: {
            probability: 0.25,
            info: 'Patient spürt Unterzucker nicht rechtzeitig',
            ursachen: {
                neuropathie: 0.4,
                lange_diabetesdauer: 0.3,
                häufige_hypos: 0.2,
                betablocker: 0.1
            },
            gefährlich: 1.0,
            keine_frühwarnzeichen: 1.0
        }
    },
    
    // ========================================
    // 🏠 UMGEBUNG & SITUATION
    // ========================================
    umgebung: {
        tageszeit: {
            morgens: {
                probability: 0.3,
                info: 'Nach nächtlicher Insulinwirkung',
                langzeit_insulin_ursache: 0.7
            },
            mittags: {
                probability: 0.25,
                info: 'Nach Mittagsinsulin'
            },
            abends: {
                probability: 0.25,
                info: 'Nach Abendinsulin'
            },
            nachts: {
                probability: 0.2,
                info: 'Oft unbemerkt lange',
                besonders_gefährlich: 0.8,
                langzeit_insulin: 0.8
            }
        },
        
        situation: {
            zuhause_ruhe: {
                probability: 0.5,
                schnelle_hilfe_meist: 0.8
            },
            zuhause_allein: {
                probability: 0.15,
                gefährlich: 0.8,
                hilfe_verzögert: 0.9
            },
            öffentlich: {
                probability: 0.15,
                variations: [
                    'Auf der Straße',
                    'Im Supermarkt',
                    'Im Bus',
                    'Im Restaurant'
                ],
                zeugen_vorhanden: 0.9,
                verwechslung_mit_alkohol: 0.5
            },
            arbeitsplatz: {
                probability: 0.1,
                ersthelfer_oft: 0.6
            },
            pflegeheim: {
                probability: 0.1,
                professionelle_hilfe: 1.0,
                regelmäßige_kontrollen: 0.9
            }
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK
    // ========================================
    sozial: {
        diabetes_management: {
            gut_geschult: {
                probability: 0.4,
                weiß_was_zu_tun: 0.9,
                bz_regelmäßig_gemessen: 0.8
            },
            mittel: {
                probability: 0.35,
                gelegentliche_probleme: 0.7
            },
            schlecht: {
                probability: 0.25,
                häufige_hypos: 0.8,
                schulung_nötig: 0.9,
                selbstgefährdung: 0.5
            }
        },
        
        unterstützung: {
            gut: {
                probability: 0.5,
                angehörige_helfen: 0.9,
                schnelle_reaktion: 0.8
            },
            mäßig: {
                probability: 0.3,
                allein_lebend: 0.6
            },
            keine: {
                probability: 0.2,
                gefährlich: 0.8,
                soziale_isolation: 0.7
            }
        },
        
        compliance: {
            gut: {
                probability: 0.5,
                regelmäßige_einnahme: 0.9
            },
            schlecht: {
                probability: 0.3,
                medikamente_unregelmäßig: 0.8,
                messungen_selten: 0.7
            },
            übertrieben: {
                probability: 0.2,
                zu_viel_insulin: 0.7,
                info: 'Zu strenge BZ-Kontrolle'
            }
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        wohnhaus: {
            probability: 0.65,
            address_types: ['residential', 'apartment'],
            angehörige_oft: 0.6
        },
        
        pflegeheim: {
            probability: 0.15,
            address_types: ['nursing_home'],
            professionelle_betreuung: 1.0,
            regelmäßige_kontrollen: 0.9
        },
        
        öffentlich: {
            probability: 0.1,
            address_types: ['street', 'public_place', 'commercial'],
            verwechslung_alkohol: 0.5,
            polizei_oft: 0.3
        },
        
        arbeitsplatz: {
            probability: 0.08,
            address_types: ['office', 'industrial'],
            betriebssanitäter_evtl: 0.3
        },
        
        auto: {
            probability: 0.02,
            gefährlich: 1.0,
            info: 'Hypo am Steuer = Unfall!',
            führerschein_thema: 0.8
        }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN
    // ========================================
    nachforderungen: {
        nef: {
            probability: 0.15,
            trigger_time: { min: 0, max: 180 },
            reasons: {
                bewusstlos: {
                    probability: 0.5,
                    funkspruch: '{callsign}, Patient bewusstlos, BZ {wert}, benötigen NEF für Glucose i.v., kommen.'
                },
                krampfanfall: {
                    probability: 0.3,
                    funkspruch: '{callsign}, hypoglykämischer Krampfanfall, NEF angefordert, kommen.'
                },
                nicht_ansprechbar: {
                    probability: 0.15
                },
                wiederholte_hypo: {
                    probability: 0.05,
                    info: 'BZ steigt nicht trotz Glucose'
                }
            }
        },
        
        polizei: {
            probability: 0.08,
            trigger_time: { min: 0, max: 120 },
            reasons: {
                aggression: {
                    probability: 0.6,
                    funkspruch: '{callsign}, Patient aggressiv und unkooperativ, Polizei zur Unterstützung, kommen.'
                },
                verwechslung_alkohol: {
                    probability: 0.3,
                    info: 'Öffentlich, wirkt betrunken'
                },
                verkehrsgefährdung: {
                    probability: 0.1,
                    info: 'Hypo am Steuer'
                }
            }
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            bewusstlos_werden: {
                probability: 0.12,
                trigger_time: { min: 60, max: 240 },
                change: 'Patient reagiert jetzt gar nicht mehr!',
                nef_nötig: 0.9,
                glucose_iv_zwingend: 1.0
            },
            
            krampfanfall: {
                probability: 0.08,
                trigger_time: { min: 90, max: 300 },
                change: 'Patient bekommt Krampfanfall!',
                upgrade_stichwort: 'Krampfanfall',
                meist_generalisiert: 0.9
            },
            
            zunehmende_aggression: {
                probability: 0.1,
                trigger_time: { min: 30, max: 120 },
                change: 'Patient wird immer aggressiver!',
                polizei_evtl: 0.4
            },
            
            erneute_hypo: {
                probability: 0.05,
                trigger_time: { min: 300, max: 600 },
                change: 'BZ fällt wieder ab!',
                info: 'Langwirksames Insulin noch aktiv',
                stationäre_aufnahme_nötig: 0.8
            }
        },
        
        besserung: {
            schnelle_besserung: {
                probability: 0.6,
                trigger_time: { min: 120, max: 300 },
                outcomes: {
                    nach_glucose_iv: {
                        probability: 0.7,
                        dauer: '2-5 Minuten',
                        dramatisch: 1.0,
                        funkspruch: '{callsign}, nach Glucose i.v.: Patient erwacht, orientiert, BZ steigt, kommen.',
                        info: 'Typischer Verlauf!'
                    },
                    nach_glucose_oral: {
                        probability: 0.2,
                        dauer: '10-20 Minuten',
                        langsamer: 1.0
                    },
                    nach_glukagon: {
                        probability: 0.1,
                        dauer: '10-15 Minuten'
                    }
                }
            },
            
            partielle_besserung: {
                probability: 0.25,
                info: 'Besser, aber noch nicht fit',
                transport_trotzdem: 1.0
            },
            
            keine_besserung: {
                probability: 0.05,
                info: 'Andere Ursache?',
                differentialdiagnose: [
                    'Schlaganfall',
                    'Intoxikation',
                    'Meningitis',
                    'Sepsis'
                ],
                kritisch: 1.0
            }
        },
        
        komplikationen: {
            aspiration: {
                probability: 0.05,
                condition: 'bewusstlos_und_erbrochen',
                kritisch: 1.0
            },
            hirnödem: {
                probability: 0.01,
                condition: 'sehr_lange_hypo',
                info: 'Bei sehr langer schwerer Hypo',
                bleibende_schäden_möglich: 0.5
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
        
        glucose_gabe: {
            oral: {
                indikation: 'Patient ansprechbar und schluckfähig',
                probability: 0.5,
                dosierung: '20-30g Glucose',
                formen: ['Traubenzucker', 'Glukoselösung', 'Süßgetränk'],
                wirkung: '10-20 Minuten',
                wiederholung_evtl: 0.3
            },
            intravenös: {
                indikation: 'Patient nicht ansprechbar oder nicht schluckfähig',
                probability: 0.3,
                dosierung: '40% Glucose 20-50ml i.v.',
                wirkung: '2-5 Minuten',
                dramatische_besserung: 0.9,
                info: 'Schnell und zuverlässig!'
            },
            glukagon: {
                indikation: 'Bewusstlos, kein Zugang',
                probability: 0.05,
                dosierung: '1mg i.m. oder s.c.',
                wirkung: '10-15 Minuten',
                übelkeit_häufig: 0.6,
                info: 'Alternative wenn kein i.v.-Zugang'
            },
            keine_nötig: {
                probability: 0.15,
                grund: 'Patient hat bereits selbst Glucose genommen und gebessert'
            }
        },
        
        transport: {
            ja: {
                probability: 0.75,
                gründe: [
                    'Ursache klären',
                    'Diabeteseinstellung prüfen',
                    'Wiederholte Hypo verhindern',
                    'Langwirksames Insulin noch aktiv'
                ]
            },
            nein_abgelehnt: {
                probability: 0.25,
                bedingungen: {
                    patient_vollständig_erholt: 1.0,
                    bz_stabil_über_80: 1.0,
                    ursache_klar: 0.8,
                    betreuung_vorhanden: 0.9,
                    patient_einwilligungsfähig: 1.0
                },
                dokumentation_wichtig: 1.0,
                info: 'AMA = Against Medical Advice',
                nachkontrolle_empfohlen: 1.0
            }
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'standard',
                hospitals: ['nächstgelegenes'],
                reason: 'Ursache abklären, Diabeteseinstellung optimieren'
            },
            priorität_2: {
                condition: 'wiederholte_hypos',
                hospitals: ['mit_diabetologie'],
                reason: 'Schulung, Therapieanpassung'
            }
        },
        
        voranmeldung: {
            bei_schwerer_hypo: 0.5,
            infos: [
                'BZ-Wert',
                'Bewusstseinszustand',
                'Glucose gegeben',
                'Reaktion auf Glucose',
                'Ursache wenn bekannt'
            ]
        }
    },
    
    // ========================================
    // 📊 PROTOKOLL & BEWERTUNG
    // ========================================
    protokoll: {
        tracked_data: {
            bz_wert: 'FROM_CALL',
            diabetes_bekannt: 'FROM_CALL',
            glucose_gegeben: 'FROM_DISPOSITION',
            besserung_eingetreten: 'FROM_SIMULATION',
            transport_erfolgt: 'FROM_DISPOSITION',
            outcome: 'FROM_SIMULATION'
        },
        
        bewertung: {
            kriterien: {
                bz_erfragt: {
                    wichtig: 'hoch',
                    info: 'BZ-Wert wenn möglich erfragen',
                    diagnosesicherung: 0.9
                },
                
                diabetes_abgeklärt: {
                    wichtig: 'hoch',
                    info: 'Ist Patient Diabetiker?',
                    wichtig_für_verdacht: 1.0
                },
                
                schnelle_hilfe: {
                    wichtig: 'hoch',
                    info: 'Bei Hypoglykämie zählt jede Minute',
                    hirnschäden_vermeiden: 1.0
                },
                
                glucose_richtig: {
                    wichtig: 'mittel',
                    info: 'Oral wenn möglich, i.v. wenn nötig'
                },
                
                transport_entscheidung: {
                    wichtig: 'mittel',
                    info: 'Auch bei Besserung Transport meist sinnvoll'
                }
            },
            
            kritische_fehler: [
                'Hypoglykämie nicht erkannt',
                'Mit Schlaganfall verwechselt',
                'Mit Alkoholintoxikation verwechselt',
                'Glucose zu spät gegeben',
                'Patient nach Besserung ohne Kontrolle entlassen'
            ],
            
            häufige_fehler: [
                'BZ-Wert nicht erfragt',
                'Diabetes-Status nicht geklärt',
                'Ursache nicht erfragt',
                'Transport nicht empfohlen trotz wiederholtem Hypo-Risiko'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient mit Hypoglykämie, BZ {wert}, verwirrt aber ansprechbar',
            'Diabetischer Notfall, BZ {wert}, Glucose oral gegeben',
            'Hypoglykämie, Patient bewusstlos, Glucose i.v. verabreicht',
            'Unterzucker, nach Glucose-Gabe deutliche Besserung, Patient orientiert',
            'BZ {wert}, Patient somnolent, Glucose i.v. läuft',
            'Hypoglykämischer Krampfanfall, Glucose verabreicht'
        ],
        
        besserung: [
            'Nach Glucose i.v.: Patient erwacht, orientiert, BZ steigt',
            'Deutliche Besserung nach Glukosegabe, Patient ansprechbar',
            'Patient stabilisiert, BZ jetzt {wert}, orientiert',
            'Schnelle Reaktion auf Glucose, Patient wieder fit'
        ],
        
        komplikationen: [
            'BZ steigt nicht trotz Glucose, weitere Gabe erforderlich',
            'Patient weiterhin bewusstlos trotz Glucose, NEF angefordert',
            'Erneuter BZ-Abfall, wiederholte Glucose-Gabe nötig'
        ]
    },
    
    // ========================================
    // 🎯 SPECIAL - HYPOGLYKÄMIE-SPEZIFISCH
    // ========================================
    special: {
        // Typische Szenarien
        szenarien: {
            klassische_hypo: {
                verlauf: [
                    'Patient verwirrt + schwitzend',
                    'BZ bei 35 mg/dl',
                    'Glucose i.v.',
                    'Nach 3 Min: Patient erwacht',
                    'Orientiert, erinnert sich nicht'
                ],
                häufigkeit: 0.5,
                prognose: 'sehr gut'
            },
            
            nächtliche_hypo: {
                verlauf: [
                    'Morgens nicht weckbar',
                    'Nass geschwitzt',
                    'BZ sehr niedrig',
                    'Langzeit-Insulin zu viel'
                ],
                häufigkeit: 0.2,
                gefährlich: 0.8
            },
            
            hypo_beim_autofahren: {
                verlauf: [
                    'Verwirrt am Steuer',
                    'Fährt Schlangenlinien',
                    'Polizei stoppt Fahrzeug',
                    'Verwechslung mit Alkohol'
                ],
                häufigkeit: 0.02,
                führerschein_problematik: 1.0,
                gefährlich: 1.0
            },
            
            wiederholte_hypo: {
                verlauf: [
                    'Schon 3. Hypo diese Woche',
                    'Diabetes schlecht eingestellt',
                    'Schulung nötig'
                ],
                häufigkeit: 0.15,
                stammkunde: 0.8
            }
        },
        
        // Verwechslungen
        verwechslungen: {
            mit_schlaganfall: {
                probability: 0.15,
                symptome_ähnlich: [
                    'Sprachstörung',
                    'Halbseitige Schwäche',
                    'Verwirrtheit'
                ],
                bz_messung_klärt: 1.0,
                reversibel_nach_glucose: 1.0
            },
            
            mit_alkohol: {
                probability: 0.25,
                symptome_ähnlich: [
                    'Torkelnd',
                    'Verwirrt',
                    'Aggressiv',
                    'Unkooperativ'
                ],
                polizei_bringt_oft: 0.4,
                bz_messung_essentiell: 1.0
            },
            
            mit_psychiatrie: {
                probability: 0.1,
                symptome: ['Aggression', 'Verwirrtheit'],
                bz_messen_wichtig: 1.0
            }
        },
        
        // Stammkunden
        stammkunde: {
            probability: 0.2,
            characteristics: {
                häufige_einsätze: 0.9,
                schlecht_eingestellt: 0.8,
                non_compliance: 0.6,
                soziale_probleme: 0.5
            },
            rettungsdienst_kennt_patient: 0.7,
            frustration_bei_crew: 0.4,
            trotzdem_ernst_nehmen: 1.0,
            schulung_dringend: 0.9
        },
        
        // Transport-Ablehnung
        transport_ablehnung: {
            probability: 0.25,
            gründe: [
                'Fühlt sich wieder gut',
                'Muss arbeiten',
                'Kennt das schon',
                'Kein Geld für Krankenhaus',
                'Termin'
            ],
            bedingungen_für_ablehnung: {
                patient_orientiert: 1.0,
                bz_stabil: 1.0,
                ursache_behoben: 0.8,
                betreuung_da: 0.9,
                aufklärung_erfolgt: 1.0
            },
            dokumentation: {
                ama_formular: 1.0,
                bz_wert: 1.0,
                aufklärung: 1.0,
                risiken_erklärt: 1.0
            },
            empfehlungen: [
                'Regelmäßig essen',
                'BZ-Kontrolle in 1h',
                'Bei erneuten Symptomen: 112',
                'Hausarzt kontaktieren'
            ]
        },
        
        // Prävention
        prävention: {
            schulung: {
                empfohlen: 1.0,
                inhalte: [
                    'Symptome erkennen',
                    'Selbstmessung',
                    'Richtige Insulindosierung',
                    'Verhalten bei Sport',
                    'Alkohol und BZ'
                ]
            },
            maßnahmen: [
                'Regelmäßige Mahlzeiten',
                'Traubenzucker immer dabei',
                'BZ vor Autofahrt prüfen',
                'Keine Übertherapie',
                'Angehörige schulen'
            ]
        },
        
        // Langzeit-Komplikationen
        komplikationen: {
            häufige_hypos: {
                effects: {
                    hypo_wahrnehmungsstörung: 0.7,
                    angst_vor_hypo: 0.5,
                    schlechtere_einstellung: 0.6
                }
            },
            schwere_hypos: {
                effects: {
                    hirnschäden_bei_langer_dauer: 0.1,
                    traumatisch_für_angehörige: 0.8
                }
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HYPOGLYKÄMIE_TEMPLATE };
}
