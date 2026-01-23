// =========================================================================================
// STURZ TEMPLATE - Häufigster Notfall, besonders bei Senioren
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const STURZ_TEMPLATE = {
    
    id: 'sturz',
    kategorie: 'rd',
    stichwort: 'Sturz',
    weight: 4,  // Sehr häufig!
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            angehöriger_besorgt: {
                probability: 0.45,
                speech_pattern: 'besorgt',
                variations: [
                    'Meine Mutter ist gestürzt!',
                    'Mein Vater ist hingefallen!',
                    'Oma ist gestürzt und kommt nicht mehr hoch!',
                    'Sie ist ausgerutscht!'
                ]
            },
            
            patient_selbst: {
                probability: 0.25,
                speech_pattern: 'schmerzen, manchmal schwach',
                variations: [
                    'Ich bin gefallen... ich komme nicht mehr hoch',
                    'Bin gestürzt, kann nicht aufstehen',
                    'Mir ist schwindelig geworden und dann... bin ich gefallen'
                ],
                alter_meist_höher: 0.8
            },
            
            nachbar_hat_gehört: {
                probability: 0.15,
                speech_pattern: 'unsicher, zweite hand info',
                variations: [
                    'Ich hab einen lauten Knall gehört, meine Nachbarin antwortet nicht',
                    'Hab sie fallen gehört, sie ruft um Hilfe',
                    'Sie liegt am Boden, ich seh sie durchs Fenster'
                ],
                effects: {
                    genaue_infos_fehlen: 0.8,
                    tür_eventuell_verschlossen: 0.6
                }
            },
            
            pflegepersonal: {
                probability: 0.1,
                speech_pattern: 'professionell',
                variations: [
                    'Bewohnerin gestürzt, Verdacht auf Schenkelhalsfraktur',
                    'Patient nach Sturz, Hüftverletzung',
                    'Sturz im Badezimmer'
                ],
                location: 'pflegeheim'
            },
            
            hausnotruf: {
                probability: 0.05,
                speech_pattern: 'zentrale, hat patient am telefon',
                variations: [
                    'Hausnotruf ausgelöst, Patient gestürzt',
                    'Notrufsystem aktiviert, Sturz gemeldet'
                ],
                info: 'Meist ältere Alleinlebende'
            }
        },
        
        dynamik: {
            schmerzen_werden_stärker: {
                probability: 0.2,
                trigger_time: { min: 60, max: 180 },
                change: 'Die Schmerzen werden immer schlimmer!'
            },
            
            patient_wird_schwächer: {
                probability: 0.15,
                trigger_time: { min: 120, max: 300 },
                change: 'Patient wird kreislaufschwach',
                effects: {
                    schock_möglich: 0.4
                }
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.35,
            female: 0.65  // Frauen häufiger, besonders im Alter
        },
        
        alter: {
            distribution: 'skewed_old',
            mean: 78,
            stddev: 12,
            min: 20,
            max: 98,
            peak_age: 82
        },
        
        risikofaktoren: {
            gangstörung: { probability: 0.5 },
            sehschwäche: { probability: 0.4 },
            schwindel_anamnese: { probability: 0.35 },
            medikamente_viele: { probability: 0.6 },
            frühere_stürze: { probability: 0.4 }
        }
    },
    
    // ========================================
    // 💥 STURZ-MECHANISMUS
    // ========================================
    sturz_mechanismus: {
        gestolpert: {
            probability: 0.35,
            variations: [
                'über Teppich gestolpert',
                'über Kabel gefallen',
                'hat sich in etwas verheddert',
                'über die Türschwelle gestolpert'
            ],
            objekte: ['Teppichkante', 'Kabel', 'Schuhe', 'Türschwelle', 'Haustier']
        },
        
        ausgerutscht: {
            probability: 0.25,
            variations: [
                'im Badezimmer ausgerutscht',
                'auf nassem Boden ausgerutscht',
                'in der Dusche gestürzt',
                'auf Wasser ausgerutscht'
            ],
            location_meist: 'badezimmer',
            verletzungen_oft_schwerer: 0.6
        },
        
        schwindel_kollaps: {
            probability: 0.2,
            variations: [
                'wurde schwindelig und dann gestürzt',
                'ist einfach umgekippt',
                'wurde schwarz vor Augen',
                'Kreislauf wurde schwach'
            ],
            ursachen: {
                orthostatische_dysregulation: 0.4,
                herzrhythmusstörung: 0.2,
                unterzucker: 0.15,
                medikamente: 0.15,
                schlaganfall: 0.1
            },
            abklärung_wichtig: 1.0
        },
        
        kraft_nachgegeben: {
            probability: 0.15,
            variations: [
                'Beine haben einfach nachgegeben',
                'war zu schwach',
                'konnte sich nicht halten'
            ],
            hinweis: 'Muskelschwäche, Alter'
        },
        
        von_leiter_stuhl: {
            probability: 0.03,
            variations: [
                'von der Leiter gefallen',
                'vom Stuhl gestürzt',
                'wollte was aus dem Schrank holen'
            ],
            höhe: { mean: 1.5, max: 3 },
            verletzungen_schwerer: 0.8
        },
        
        treppe: {
            probability: 0.02,
            variations: [
                'die Treppe runtergestürzt',
                'mehrere Stufen gefallen'
            ],
            stufen: { min: 3, max: 15 },
            verletzungen_oft_multipel: 0.9,
            kopfverletzung_wahrscheinlich: 0.6
        }
    },
    
    // ========================================
    // 🩹 VERLETZUNGEN
    // ========================================
    verletzungen: {
        keine_sichtbar: {
            probability: 0.15,
            variations: [
                'sieht nichts Schlimmes',
                'keine offenen Wunden',
                'äußerlich okay'
            ],
            aber_schmerzen: 0.8
        },
        
        hüfte: {
            probability: 0.35,
            severity: {
                prellung: {
                    probability: 0.3,
                    variations: ['Hüfte tut weh', 'schmerzt an der Hüfte']
                },
                schenkelhalsfraktur: {
                    probability: 0.7,
                    variations: [
                        'kann das Bein nicht bewegen',
                        'Bein steht komisch',
                        'extreme Schmerzen in der Hüfte',
                        'Bein ist verkürzt und verdreht'
                    ],
                    klassisch: {
                        außenrotation: 0.9,
                        verkürzung: 0.8,
                        bewegung_unmöglich: 1.0
                    },
                    transport_schwierig: 0.9,
                    op_erforderlich: 0.95,
                    info: 'Klassische Seniorenverletzung'
                }
            }
        },
        
        kopf: {
            probability: 0.25,
            types: {
                platzwunde: {
                    probability: 0.5,
                    variations: [
                        'blutet am Kopf',
                        'Platzwunde an der Stirn',
                        'Kopf blutet stark'
                    ],
                    blutet_stark: 0.7
                },
                beule: {
                    probability: 0.3,
                    variations: ['dicke Beule', 'Schwellung am Kopf']
                },
                gehirnerschütterung: {
                    probability: 0.2,
                    indicators: [
                        'kurz bewusstlos gewesen',
                        'verwirrt',
                        'erinnert sich nicht',
                        'übel'
                    ],
                    beobachtung_nötig: 1.0
                }
            }
        },
        
        arm_hand: {
            probability: 0.2,
            types: {
                prellung: { probability: 0.4 },
                fraktur: {
                    probability: 0.6,
                    locations: {
                        handgelenk: 0.5,  // Colles-Fraktur
                        unterarm: 0.3,
                        oberarm: 0.2
                    },
                    variations: [
                        'Arm tut extrem weh',
                        'kann Arm nicht bewegen',
                        'Arm ist geschwollen',
                        'sieht komisch aus'
                    ]
                }
            },
            abfangen_typisch: 0.9
        },
        
        rippen: {
            probability: 0.12,
            variations: [
                'Schmerzen beim Atmen',
                'Rippen tun weh',
                'Brust schmerzt'
            ],
            rippenfraktur_wahrscheinlich: 0.6,
            ältere_patienten_häufiger: 0.9
        },
        
        bein_fuß: {
            probability: 0.15,
            types: {
                prellung: { probability: 0.5 },
                fraktur: {
                    probability: 0.4,
                    locations: ['Unterschenkel', 'Knöchel', 'Fuß']
                },
                verstauchung: { probability: 0.1 }
            }
        },
        
        rücken: {
            probability: 0.18,
            types: {
                prellung: { probability: 0.6 },
                wirbelkörperfraktur: {
                    probability: 0.3,
                    besonders_bei: 'Osteoporose',
                    vorsicht_wirbelsäule: 1.0
                },
                schmerzen: { probability: 0.1 }
            }
        },
        
        schürfwunden: {
            probability: 0.4,
            variations: [
                'aufgeschürft',
                'Haut ist ab',
                'Schürfwunden an Armen'
            ],
            meist_harmlos: 0.9
        },
        
        hämatome: {
            probability: 0.5,
            variations: [
                'hat blaue Flecken',
                'wird schon blau',
                'große Blutergüsse'
            ],
            bei_blutverdünner_ausgeprägt: 0.8
        }
    },
    
    // ========================================
    // 📍 STURZ-ORT
    // ========================================
    sturz_ort: {
        badezimmer: {
            probability: 0.35,
            variations: [
                'im Badezimmer',
                'in der Dusche',
                'vor dem Waschbecken',
                'auf der Toilette'
            ],
            probleme: {
                nass: 0.6,
                eng: 0.8,
                patient_nackt_teilweise: 0.4
            },
            schamgefühl: 0.6
        },
        
        schlafzimmer: {
            probability: 0.25,
            variations: [
                'neben dem Bett',
                'beim Aufstehen aus dem Bett',
                'im Schlafzimmer'
            ],
            zeit_meist: 'nachts oder morgens'
        },
        
        wohnzimmer: {
            probability: 0.2,
            variations: ['im Wohnzimmer', 'vor dem Sofa']
        },
        
        küche: {
            probability: 0.1,
            variations: ['in der Küche']
        },
        
        flur: {
            probability: 0.08,
            variations: ['im Flur', 'Gang']
        },
        
        treppe: {
            probability: 0.02,
            siehe: 'sturz_mechanismus.treppe'
        }
    },
    
    // ========================================
    // ⏱️ LIEGEZEIT
    // ========================================
    liegezeit: {
        sofort_entdeckt: {
            probability: 0.4,
            dauer: '< 5 Minuten',
            angehöriger_dabei: 0.9
        },
        
        kurz: {
            probability: 0.3,
            dauer: '5-30 Minuten',
            patient_konnte_anrufen: 0.7
        },
        
        mittel: {
            probability: 0.2,
            dauer: '30 Minuten - 2 Stunden',
            probleme: {
                unterkühlung_möglich: 0.3,
                dekubitus_beginn: 0.2,
                dehydrierung: 0.4
            }
        },
        
        lang: {
            probability: 0.1,
            dauer: '> 2 Stunden',
            variations: [
                'liegt seit Stunden',
                'die ganze Nacht gelegen',
                'seit gestern'
            ],
            komplikationen: {
                unterkühlung: 0.7,
                dekubitus: 0.5,
                dehydrierung: 0.8,
                nierenversagen_risiko: 0.3,
                verwirrtheit: 0.6
            },
            kritischer: 0.8,
            info: 'Lange Liegezeit = hohes Risiko!'
        }
    },
    
    // ========================================
    // 🏥 MEDIZINISCH
    // ========================================
    medizinisch: {
        vorerkrankungen: {
            probability: 0.85,
            types: {
                osteoporose: { probability: 0.5, info: 'Knochenbrüche wahrscheinlicher' },
                herz_kreislauf: { probability: 0.6 },
                diabetes: { probability: 0.3 },
                parkinson: { probability: 0.1, sturzrisiko_hoch: 1.0 },
                demenz: { probability: 0.2, sturzrisiko_hoch: 1.0 },
                sehstörungen: { probability: 0.4 }
            }
        },
        
        medikamente: {
            blutverdünner: {
                probability: 0.4,
                types: ['Marcumar', 'Eliquis', 'Xarelto', 'ASS'],
                effects: {
                    blutung_wahrscheinlicher: 0.9,
                    hämatome_größer: 0.9,
                    kopfverletzung_kritischer: 1.0
                },
                info: 'Bei Kopfverletzung besonders gefährlich!'
            },
            
            blutdrucksenker: {
                probability: 0.6,
                kann_schwindel_verursachen: 0.5
            },
            
            beruhigungsmittel: {
                probability: 0.2,
                sturzrisiko_erhöht: 0.8
            }
        },
        
        vitalparameter: {
            meist_stabil: {
                probability: 0.7,
                info: 'Patient ansprechbar, Kreislauf okay'
            },
            
            schock: {
                probability: 0.15,
                ursachen: ['Blutverlust', 'Schmerz', 'Schreck'],
                info: 'Bei schweren Verletzungen'
            },
            
            bewusstlos: {
                probability: 0.05,
                upgrade_stichwort: 'Bewusstlosigkeit',
                abklärung_schlaganfall: 1.0
            }
        }
    },
    
    // ========================================
    // 🏠 UMGEBUNG
    // ========================================
    umgebung: {
        gebäude: {
            kein_aufzug: {
                probability: 0.2,
                effects: {
                    patient_kann_nicht_laufen: 0.9,
                    tragehilfe_fast_immer: 0.95
                },
                funkspruch: '{callsign}, Sturz mit Hüftverletzung, {floor} OG ohne Aufzug, FW Tragehilfe erforderlich!'
            },
            
            enge_verhältnisse: {
                probability: 0.3,
                variations: [
                    'sehr enge Wohnung',
                    'vollgestellt',
                    'schmale Gänge'
                ],
                effects: {
                    bergen_schwierig: 0.8,
                    schaufeltrage_nötig: 0.6
                }
            }
        },
        
        technik: {
            tür_verschlossen: {
                probability: 0.15,
                reasons: {
                    patient_kommt_nicht_ran: 0.7,
                    nachbar_sieht_nur_durchs_fenster: 0.3
                },
                funkspruch: '{callsign}, kein Zugang, Patient liegt am Boden, FW zur Türöffnung!'
            }
        },
        
        zustand_wohnung: {
            normal: { probability: 0.6 },
            
            unordentlich: {
                probability: 0.25,
                info: 'Viele Stolperfallen'
            },
            
            verwahrlost: {
                probability: 0.15,
                indicators: [
                    'sehr unordentlich',
                    'unhygienisch',
                    'viele Hindernisse'
                ],
                effects: {
                    sozialamt_info: 0.7,
                    selbstversorgung_fraglich: 0.8
                }
            }
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK
    // ========================================
    sozial: {
        wohnsituation: {
            alleinlebend: {
                probability: 0.5,
                effects: {
                    liegezeit_oft_länger: 0.7,
                    nachbetreuung_problem: 0.8
                }
            },
            
            mit_angehörigen: {
                probability: 0.35,
                sofort_gefunden: 0.9
            },
            
            pflegeheim: {
                probability: 0.15,
                siehe: 'locations.pflegeheim'
            }
        },
        
        angehörige: {
            sehr_besorgt: {
                probability: 0.6,
                variations: [
                    'hat große Angst',
                    'macht sich Sorgen',
                    'weint'
                ]
            },
            
            schuldgefühle: {
                probability: 0.25,
                variations: [
                    'Ich hätte aufpassen müssen!',
                    'Das ist meine Schuld!',
                    'Ich war nur kurz weg!'
                ]
            },
            
            wollen_mitfahren: {
                probability: 0.7,
                info: 'Können wir mit ins Krankenhaus?'
            }
        },
        
        schamgefühl: {
            patient_schämt_sich: {
                probability: 0.3,
                reasons: [
                    'Im Badezimmer gestürzt (nackt)',
                    'Schämt sich für Wohnzustand',
                    'Will nicht als hilfsbedürftig gelten'
                ]
            }
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        wohnhaus: {
            probability: 0.75,
            address_types: ['residential', 'apartment'],
            siehe: 'sturz_ort'
        },
        
        pflegeheim: {
            probability: 0.15,
            address_types: ['nursing_home'],
            pfleger_vor_ort: 1.0,
            sturzprotokoll_vorhanden: 0.9,
            vorerkrankungen_bekannt: 1.0
        },
        
        betreutes_wohnen: {
            probability: 0.08,
            address_types: ['residential'],
            hausnotruf_oft: 0.7
        },
        
        öffentlich: {
            probability: 0.02,
            address_types: ['street', 'pedestrian'],
            zeugen: { min: 1, max: 3 },
            siehe_auch: 'sturz_öffentlich_template'
        }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN
    // ========================================
    nachforderungen: {
        feuerwehr: {
            probability: 0.45,
            trigger_time: { min: 0, max: 120 },
            reasons: {
                tragehilfe: {
                    probability: 0.8,
                    funkspruch: '{callsign}, Patient kann nicht laufen, {floor} OG, benötigen FW Tragehilfe, kommen.'
                },
                türöffnung: {
                    probability: 0.2,
                    funkspruch: '{callsign}, kein Zugang, Patient am Boden, FW zur Türöffnung, kommen.'
                }
            }
        },
        
        nef: {
            probability: 0.05,
            trigger_time: { min: 120, max: 300 },
            reasons: [
                'Patient instabil',
                'Schwere Kopfverletzung',
                'Bewusstseinsstörung'
            ]
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            schock: {
                probability: 0.1,
                trigger_time: { min: 120, max: 300 },
                changes: ['Patient wird kreislaufschwach', 'Blutdruck fällt'],
                ursachen: ['Innere Blutung', 'Schmerz']
            }
        },
        
        überraschungen: {
            schwerer_als_gedacht: {
                probability: 0.2,
                funkspruch: '{callsign}, Verletzungen schwerer als gemeldet, {details}, kommen.'
            },
            
            war_schlaganfall: {
                probability: 0.08,
                info: 'Sturz war Folge eines Schlaganfalls',
                upgrade_stichwort: 'Schlaganfall',
                neurologische_ausfälle: 0.9
            },
            
            war_herzinfarkt: {
                probability: 0.03,
                info: 'Sturz durch Herzinfarkt verursacht',
                upgrade_stichwort: 'Herzinfarkt'
            }
        },
        
        besserung: {
            nur_prellung: {
                probability: 0.15,
                funkspruch: '{callsign}, Patient stabilisiert, keine schweren Verletzungen, kommen.',
                transport_trotzdem: 0.9
            }
        }
    },
    
    // ========================================
    // 🏥 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.05,
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'schenkelhalsfraktur',
                hospitals: ['rems_murr_klinikum_winnenden', 'klinikum_ludwigsburg'],
                reason: 'Unfallchirurgie mit OP-Bereitschaft'
            },
            
            priorität_2: {
                condition: 'kopfverletzung_mit_blutverdünner',
                hospitals: ['klinikum_ludwigsburg', 'katharinenhospital_stuttgart'],
                reason: 'CT verfügbar, Neurochirurgie'
            },
            
            priorität_3: {
                condition: 'leichte_verletzung',
                hospitals: ['nächstgelegenes'],
                reason: 'Abklärung und Schmerztherapie'
            }
        },
        
        voranmeldung: {
            bei_op_indikation: 0.8,
            infos: [
                'Sturzhergang',
                'Verdachtsdiagnose',
                'Blutverdünner ja/nein',
                'Vitalparameter'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient nach Sturz, Verdacht auf {Verletzung}',
            'Sturz häuslich, Patient kann nicht aufstehen',
            'Sturz mit Hüftverletzung, Tragehilfe erforderlich',
            'Patient gestürzt, {Alter} Jahre, multiple Prellungen',
            'Sturz im Bad, Platzwunde am Kopf'
        ]
    },
    
    // ========================================
    // 📊 SPECIAL
    // ========================================
    special: {
        nachbetreuung: {
            problem: {
                probability: 0.4,
                variations: [
                    'Patient lebt allein, kann nicht allein bleiben',
                    'Wer kümmert sich nach Entlassung?',
                    'Wohnung nicht barrierefrei'
                ],
                sozialamt_kontakt: 0.6
            }
        },
        
        häufigkeit: {
            erstmaliger_sturz: { probability: 0.6 },
            wiederholter_sturz: { probability: 0.4, sturzrisiko_assessment: 1.0 }
        },
        
        prävention: {
            stolperfallen: {
                probability: 0.5,
                examples: ['Teppiche', 'Kabel', 'schlechte Beleuchtung']
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { STURZ_TEMPLATE };
}
