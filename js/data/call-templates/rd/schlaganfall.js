// =========================================================================================
// SCHLAGANFALL TEMPLATE - Zeitkritischer neurologischer Notfall
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const SCHLAGANFALL_TEMPLATE = {
    
    id: 'schlaganfall',
    kategorie: 'rd',
    stichwort: 'Schlaganfall',
    weight: 3,
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            angehöriger_panisch: {
                probability: 0.45,
                speech_pattern: 'schnell, aufgeregt',
                variations: [
                    'Mein Mann redet so komisch!',
                    'Sie kann plötzlich nicht mehr sprechen!',
                    'Er bewegt die rechte Seite nicht mehr!',
                    'Hilfe, ich glaube das ist ein Schlaganfall!'
                ]
            },
            angehöriger_ruhig: {
                probability: 0.25,
                speech_pattern: 'kontrolliert, gibt klare Infos',
                variations: [
                    'Meine Frau zeigt Anzeichen eines Schlaganfalls',
                    'Ich habe den FAST-Test gemacht, positiv'
                ]
            },
            patient_selbst: {
                probability: 0.15,
                speech_pattern: 'verwaschen, undeutlich',
                variations: [
                    'Mir isch so schwindelig... kann nischt mehr richtig schprechen',
                    'Mein Arm... geht nischt mehr...'
                ],
                effects: {
                    sprachstörung_hörbar: 1.0,
                    kritischer: 0.8
                }
            },
            nachbar_zeuge: {
                probability: 0.08,
                speech_pattern: 'unsicher',
                variations: [
                    'Meine Nachbarin ist gestürzt und redet wirr',
                    'Ich hab ihn so komisch gesehen, er läuft schief'
                ]
            },
            pflegepersonal: {
                probability: 0.07,
                speech_pattern: 'professionell, medizinische Begriffe',
                variations: [
                    'Bewohner mit plötzlicher Hemiparese',
                    'Verdacht auf Apoplex, halbseitige Lähmung'
                ],
                location: 'pflegeheim'
            }
        },
        
        dynamik: {
            wird_panischer: {
                probability: 0.25,
                trigger_time: { min: 30, max: 120 },
                change: 'Patient wird schlechter, reagiert kaum noch!'
            },
            patient_übernimmt: {
                probability: 0.1,
                condition: 'patient_kann_noch_sprechen',
                speech_affected: 0.9
            }
        },
        
        beziehung: {
            ehepartner: { probability: 0.5 },
            kind: { probability: 0.25 },
            pflegekraft: { probability: 0.15 },
            nachbar: { probability: 0.05 },
            arbeitskollege: { probability: 0.05 }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.48,
            female: 0.52
        },
        
        alter: {
            distribution: 'normal',
            mean: 72,
            stddev: 12,
            min: 40,
            max: 95
        },
        
        risikoprofil: {
            raucher: { probability: 0.35 },
            bluthochdruck: { probability: 0.75 },
            diabetes: { probability: 0.4 },
            vorhofflimmern: { probability: 0.3 },
            übergewicht: { probability: 0.55 }
        }
    },
    
    // ========================================
    // 🩺 SYMPTOME (nach FAST-Schema)
    // ========================================
    symptome: {
        // Face (Gesicht)
        gesichtslähmung: {
            probability: 0.7,
            variations: [
                'das Gesicht hängt auf einer Seite',
                'kann nicht mehr richtig lächeln, {sein/ihr} Mund ist schief',
                'eine Gesichtshälfte ist gelähmt',
                'das Gesicht verzieht sich komisch'
            ],
            seite: {
                rechts: 0.5,
                links: 0.5
            }
        },
        
        // Arms (Arme)
        armlähmung: {
            probability: 0.8,
            variations: [
                'kann den Arm nicht mehr heben',
                'der Arm hängt einfach runter',
                'hat keine Kraft mehr im Arm',
                'der {rechte/linke} Arm geht nicht mehr'
            ],
            seite: {
                rechts: 0.5,
                links: 0.5
            },
            severity: {
                komplett: 0.6,
                teilweise: 0.4
            }
        },
        
        beinlähmung: {
            probability: 0.65,
            variations: [
                'kann das Bein nicht bewegen',
                'ist gestürzt, kommt nicht mehr hoch',
                'das Bein gibt nach',
                'kann nicht mehr stehen'
            ],
            kombiniert_mit_arm: 0.9
        },
        
        halbseitenlähmung: {
            probability: 0.7,
            variations: [
                'die ganze {rechte/linke} Seite ist gelähmt',
                'Arm und Bein auf einer Seite funktionieren nicht',
                'eine Körperhälfte reagiert nicht mehr'
            ]
        },
        
        // Speech (Sprache)
        sprachstörung: {
            probability: 0.75,
            types: {
                undeutlich: {
                    probability: 0.5,
                    variations: [
                        'redet total verwaschen',
                        'kann nicht mehr richtig sprechen',
                        'lallt wie betrunken',
                        'die Sprache ist so komisch'
                    ]
                },
                kann_nicht_sprechen: {
                    probability: 0.35,
                    variations: [
                        'kann gar nichts mehr sagen',
                        'macht nur noch Geräusche',
                        'bringt kein Wort raus'
                    ]
                },
                wortfindungsstörung: {
                    probability: 0.15,
                    variations: [
                        'sucht nach Worten, kann sie nicht finden',
                        'sagt falsche Wörter',
                        'redet wirres Zeug'
                    ]
                }
            }
        },
        
        // Time (Zeit) - Beginn
        zeitpunkt_bekannt: {
            probability: 0.8,
            variations: [
                'ist vor {zeit} Minuten passiert',
                'hat gerade eben angefangen',
                'ist beim Frühstück plötzlich umgekippt',
                'vor etwa {zeit} hat es angefangen'
            ],
            zeit_fenster: {
                unter_60min: 0.4,  // Golden Hour!
                60_180min: 0.35,
                über_180min: 0.25
            }
        },
        
        zeitpunkt_unbekannt: {
            probability: 0.2,
            variations: [
                'weiß nicht genau wann, hab {ihn/sie} so gefunden',
                'keine Ahnung, ist heute morgen schon komisch gewesen'
            ],
            effects: {
                lyse_schwieriger: 1.0
            }
        },
        
        // Weitere Symptome
        bewusstseinsstörung: {
            probability: 0.35,
            levels: {
                benommen: {
                    probability: 0.5,
                    variations: ['ist benommen', 'reagiert verzögert', 'ist verwirrt']
                },
                somnolent: {
                    probability: 0.3,
                    variations: ['schläft fast ein', 'kaum ansprechbar']
                },
                bewusstlos: {
                    probability: 0.2,
                    variations: ['ist bewusstlos', 'reagiert gar nicht mehr'],
                    upgrade_stichwort: 'Bewusstlosigkeit',
                    nef_zwingend: 1.0
                }
            }
        },
        
        kopfschmerzen: {
            probability: 0.25,
            severity: {
                stark: 0.6,
                vernichtend: 0.4  // Hinweis auf Hirnblutung
            },
            variations: [
                'hat extreme Kopfschmerzen',
                'schreit vor Kopfschmerzen',
                'hält sich den Kopf und stöhnt'
            ]
        },
        
        übelkeit_erbrechen: {
            probability: 0.3,
            variations: [
                'muss sich übergeben',
                'ist übel',
                'hat erbrochen'
            ]
        },
        
        schwindel: {
            probability: 0.5,
            variations: [
                'klagt über Schwindel',
                'alles dreht sich',
                'kann nicht gerade gehen'
            ]
        },
        
        sehstörungen: {
            probability: 0.25,
            types: {
                doppelbilder: 0.4,
                gesichtsfeldausfall: 0.4,
                verschwommen: 0.2
            },
            variations: [
                'sieht doppelt',
                'kann auf einem Auge nichts sehen',
                'sieht alles verschwommen'
            ]
        },
        
        sturz: {
            probability: 0.4,
            variations: [
                'ist gestürzt',
                'einfach umgekippt',
                'Beine haben nachgegeben'
            ],
            zusatzverletzungen: 0.3
        }
    },
    
    // ========================================
    // 🏥 MEDIZINISCH
    // ========================================
    medizinisch: {
        schlaganfall_typ: {
            ischämisch: {
                probability: 0.85,
                behandlung: 'Lyse möglich innerhalb 4.5h'
            },
            hämorrhagisch: {
                probability: 0.15,
                hinweise: ['vernichtende Kopfschmerzen', 'Marcumar-Patient'],
                behandlung: 'Neurochirurgie',
                kritischer: 1.0
            }
        },
        
        vorerkrankungen: {
            probability: 0.9,
            types: {
                hypertonie: { probability: 0.75, info: 'Bluthochdruck' },
                vorhofflimmern: { probability: 0.3, info: 'Herzrhythmusstörung' },
                diabetes: { probability: 0.4, info: 'Zuckerkrankheit' },
                früherer_schlaganfall: { probability: 0.15, info: 'Hatte schon mal einen Schlaganfall' },
                früherer_herzinfarkt: { probability: 0.2, info: 'Hatte Herzinfarkt' }
            }
        },
        
        medikamente: {
            blutverdünner: {
                probability: 0.5,
                types: {
                    marcumar: { probability: 0.4, wichtig: 'Blutungsrisiko!' },
                    eliquis: { probability: 0.3 },
                    aspirin: { probability: 0.3 }
                },
                effects: {
                    bei_blutung_kritisch: 1.0
                }
            },
            blutdrucksenker: { probability: 0.7 },
            diabetes_medikamente: { probability: 0.4 }
        },
        
        fast_test: {
            anrufer_kennt: {
                probability: 0.3,
                variations: [
                    'Ich hab den FAST-Test gemacht, alles positiv',
                    'Lächeln geht nicht, Arme gehen nicht, Sprechen geht nicht'
                ]
            }
        }
    },
    
    // ========================================
    // 🏠 UMGEBUNG
    // ========================================
    umgebung: {
        gebäude: {
            kein_aufzug: {
                probability: 0.15,
                stockwerke: {
                    distribution: [0.3, 0.3, 0.2, 0.15, 0.05]
                },
                funkspruch: '{callsign}, Patient im {floor} OG ohne Aufzug, Tragehilfe wahrscheinlich nötig, kommen.'
            },
            
            enge_treppe: {
                probability: 0.18,
                effects: {
                    tragetuch_nötig: 0.9,
                    zeitverzögerung: 1.0
                }
            }
        },
        
        technik: {
            tür_verschlossen: {
                probability: 0.08,
                reasons: {
                    patient_kann_nicht_öffnen: 0.7,
                    bewusstlos: 0.3
                },
                funkspruch: '{callsign}, Patient kann Tür nicht öffnen, benötigen FW zur Türöffnung, kommen.'
            }
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK
    // ========================================
    sozial: {
        angehörige: {
            sehr_besorgt: {
                probability: 0.6,
                manifestations: [
                    'weint',
                    'hat Angst um {ihn/sie}',
                    'fragt ständig nach',
                    'will unbedingt mitfahren'
                ]
            },
            
            wollen_mitfahren: {
                probability: 0.7,
                info: 'Können wir mit ins Krankenhaus?'
            },
            
            kennen_symptome: {
                probability: 0.25,
                info: 'Das ist doch ein Schlaganfall, oder? Ich hab davon gehört!'
            }
        },
        
        kultur: {
            sprachbarriere: {
                probability: 0.12,
                effects: {
                    anamnese_schwierig: 0.9,
                    familienmitglied_übersetzt: 0.7
                }
            }
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        wohnhaus: {
            probability: 0.70,
            address_types: ['residential', 'apartment'],
            variations: ['zu Hause', 'in der Wohnung', 'im Schlafzimmer', 'im Badezimmer']
        },
        
        pflegeheim: {
            probability: 0.15,
            address_types: ['nursing_home'],
            pfleger_vor_ort: 1.0,
            vorerkrankungen_dokumentiert: 0.9
        },
        
        arbeitsplatz: {
            probability: 0.08,
            address_types: ['commercial', 'office'],
            time_dependent: [7, 18],
            betriebssanitäter: 0.25
        },
        
        öffentlich: {
            probability: 0.05,
            address_types: ['street', 'park'],
            zeugen: { min: 1, max: 4 }
        },
        
        arztpraxis: {
            probability: 0.02,
            address_types: ['doctors'],
            arzt_vor_ort: 1.0,
            erstversorgung_bereits: 0.8
        }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN
    // ========================================
    nachforderungen: {
        nef: {
            probability: 0.25,
            trigger_time: { min: 120, max: 300 },
            reasons: [
                'Patient bewusstlos',
                'Vitalwerte kritisch',
                'Intubation erforderlich'
            ],
            funkspruch: '{callsign}, Patient bewusstlos, benötigen NEF, kommen.'
        },
        
        feuerwehr: {
            probability: 0.06,
            trigger_time: { min: 60, max: 180 },
            reasons: {
                türöffnung: { probability: 0.7 },
                tragehilfe: { probability: 0.3 }
            }
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            stufe_1: {
                probability: 0.2,
                trigger_time: { min: 120, max: 300 },
                changes: ['wird schläfriger', 'reagiert weniger'],
                anrufer_meldet_sich: 0.7
            },
            
            stufe_2_bewusstlos: {
                probability: 0.1,
                trigger_time: { min: 180, max: 360 },
                changes: ['ist jetzt bewusstlos', 'reagiert gar nicht mehr'],
                nef_sofort: 1.0,
                upgrade_stichwort: 'Bewusstlosigkeit'
            }
        },
        
        besserung: {
            tia_vermutet: {
                probability: 0.05,
                trigger_time: { min: 180, max: 420 },
                info: 'Symptome bilden sich zurück, TIA möglich',
                funkspruch: '{callsign}, Symptomatik rückläufig, Verdacht TIA, kommen.',
                trotzdem_transport: 1.0
            }
        }
    },
    
    // ========================================
    // 🏥 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.4,  // Oft schwer betroffen
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'stroke_unit_zwingend',
                hospitals: ['rems_murr_klinikum_winnenden', 'klinikum_ludwigsburg', 'katharinenhospital_stuttgart'],
                reason: 'Stroke Unit mit Lysemöglichkeit 24/7',
                zeitfenster_kritisch: {
                    unter_3h: 'Lyse möglich',
                    3_bis_4_5h: 'Lyse eventuell noch möglich',
                    über_4_5h: 'Thrombektomie möglich bis 6h'
                }
            },
            
            capacity_check: {
                if_full: 'select_next_stroke_unit',
                funkspruch: '{hospital} keine Stroke-Kapazität, fahren {alternative} an'
            }
        },
        
        voranmeldung: {
            zwingend: 1.0,
            infos: [
                'Verdacht Apoplex',
                'Symptombeginn: vor {zeit} Minuten',
                'FAST-Test positiv',
                'Marcumar: ja/nein',
                'Bewusstseinslage'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient mit akuter Hemiparese, Verdacht auf Apoplex',
            'FAST-Test positiv, Symptombeginn vor {zeit} Minuten',
            'Patient mit Sprachstörung und Lähmungserscheinungen',
            'Stroke-Verdacht, fahren Stroke Unit an',
            'Patient bewusstlos, neurologische Ausfälle'
        ],
        
        zeitkritisch: [
            'Zeit ist Hirn - schnellstmöglich',
            'Lysefenster beachten',
            'Symptombeginn dokumentiert'
        ]
    },
    
    // ========================================
    // 📊 SPEZIELLE HINWEISE
    // ========================================
    special: {
        zeitfenster: {
            golden_hour: {
                unter_1h: {
                    priority: 'höchste',
                    lyse_wahrscheinlich: 0.9
                },
                1_bis_3h: {
                    priority: 'hoch',
                    lyse_möglich: 0.8
                },
                3_bis_4_5h: {
                    priority: 'mittel',
                    lyse_grenzwertig: 0.4
                },
                über_4_5h: {
                    priority: 'normal',
                    thrombektomie_evtl: 0.3
                }
            }
        },
        
        mimics: {
            hypoglykämie: {
                probability: 0.02,
                info: 'Schlaganfall-Symptome durch Unterzucker',
                besserung_nach_glukose: 1.0
            },
            
            funktionell: {
                probability: 0.01,
                info: 'Psychogene Symptome',
                schwer_unterscheidbar: 1.0
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SCHLAGANFALL_TEMPLATE };
}
