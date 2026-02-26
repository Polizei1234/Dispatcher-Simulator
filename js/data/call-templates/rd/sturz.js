// =========================================================================================
// STURZ TEMPLATE V2.0 - Häufigster Rettungsdienst-Einsatz
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
                    'Sie ist ausgerutscht!',
                    'Hat sich die Hüfte gebrochen!'
                ]
            },
            
            patient_selbst: {
                probability: 0.25,
                speech_pattern: 'schmerzen, manchmal schwach',
                variations: [
                    'Ich bin gefallen... ich komme nicht mehr hoch',
                    'Bin gestürzt, kann nicht aufstehen',
                    'Mir ist schwindelig geworden und dann... bin ich gefallen',
                    'Ich liege am Boden'
                ],
                alter_meist_höher: 0.8,
                effects: {
                    lange_liegezeit_möglich: 0.4,
                    lebt_oft_allein: 0.8
                }
            },
            
            nachbar_hat_gehört: {
                probability: 0.15,
                speech_pattern: 'unsicher, zweite hand info',
                variations: [
                    'Ich hab einen lauten Knall gehört, meine Nachbarin antwortet nicht',
                    'Hab sie fallen gehört, sie ruft um Hilfe',
                    'Sie liegt am Boden, ich seh sie durchs Fenster',
                    'Ich höre Hilferufe aus der Wohnung nebenan'
                ],
                effects: {
                    genaue_infos_fehlen: 0.8,
                    tür_eventuell_verschlossen: 0.6,
                    feuerwehr_türöffnung_wahrscheinlich: 0.5
                }
            },
            
            pflegepersonal: {
                probability: 0.1,
                speech_pattern: 'professionell',
                variations: [
                    'Bewohnerin gestürzt, Verdacht auf Schenkelhalsfraktur',
                    'Patient nach Sturz, Hüftverletzung',
                    'Sturz im Badezimmer',
                    'Sturzprotokoll angelegt'
                ],
                location: 'pflegeheim',
                effects: {
                    infos_vollständig: 0.9,
                    vorerkrankungen_bekannt: 1.0,
                    dokumentation_vorhanden: 0.9
                }
            },
            
            hausnotruf: {
                probability: 0.05,
                speech_pattern: 'zentrale, hat patient am telefon',
                variations: [
                    'Hausnotruf ausgelöst, Patient gestürzt',
                    'Notrufsystem aktiviert, Sturz gemeldet',
                    'Hausnotrufalarm'
                ],
                info: 'Meist ältere Alleinlebende',
                effects: {
                    patient_allein: 0.95,
                    tür_eventuell_verschlossen: 0.3,
                    schlüssel_bei_nachbar: 0.6
                }
            }
        },
        
        dynamik: {
            schmerzen_werden_stärker: {
                probability: 0.2,
                trigger_time: { min: 60, max: 180 },
                change: 'Die Schmerzen werden immer schlimmer!',
                effects: {
                    fraktur_wahrscheinlicher: 0.7
                }
            },
            
            patient_wird_schwächer: {
                probability: 0.15,
                trigger_time: { min: 120, max: 300 },
                change: 'Patient wird kreislaufschwach',
                effects: {
                    schock_möglich: 0.4,
                    innere_blutung_möglich: 0.2
                }
            },
            
            kein_zugang_möglich: {
                probability: 0.12,
                trigger_time: { min: 30, max: 120 },
                change: 'Tür ist verschlossen, Patient kommt nicht ran!',
                effects: {
                    feuerwehr_zwingend: 1.0
                },
                funkspruch: '{callsign}, kein Zugang, FW zur Türöffnung erforderlich, kommen.'
            }
        },
        
        beziehung: {
            kind: { probability: 0.4, emotional_belastung: 'hoch' },
            ehepartner: { probability: 0.2, emotional_belastung: 'sehr_hoch' },
            pflegekraft: { probability: 0.15, professionell: 1.0 },
            nachbar: { probability: 0.15, emotional_distanz: 'mittel' },
            hausnotruf: { probability: 0.1, professionell: 1.0 }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.35,
            female: 0.65  // Frauen häufiger, besonders im Alter (Osteoporose)
        },
        
        alter: {
            distribution: 'skewed_old',
            mean: 78,
            stddev: 12,
            min: 20,
            max: 98,
            peak_age: 82,
            info: 'Typischer Senioren-Notfall'
        },
        
        risikofaktoren: {
            gangstörung: { 
                probability: 0.5,
                info: 'Unsicherer Gang erhöht Sturzrisiko'
            },
            sehschwäche: { 
                probability: 0.4,
                info: 'Stolperfallen werden übersehen'
            },
            schwindel_anamnese: { 
                probability: 0.35,
                info: 'Vorherige Schwindelattacken'
            },
            medikamente_viele: { 
                probability: 0.6,
                info: 'Polypharmazie erhöht Sturzrisiko'
            },
            frühere_stürze: { 
                probability: 0.4,
                info: 'Sturzanamnese positiv'
            },
            alleinlebend: {
                probability: 0.5,
                effects: {
                    liegezeit_oft_länger: 0.7,
                    hilfe_verzögert: 0.6
                }
            }
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
                'über die Türschwelle gestolpert',
                'über Hausschuhe gestolpert'
            ],
            objekte: ['Teppichkante', 'Kabel', 'Schuhe', 'Türschwelle', 'Haustier', 'Gehstock'],
            prävention: {
                stolperfallen_beseitigen: 1.0,
                beleuchtung_verbessern: 0.8
            }
        },
        
        ausgerutscht: {
            probability: 0.25,
            variations: [
                'im Badezimmer ausgerutscht',
                'auf nassem Boden ausgerutscht',
                'in der Dusche gestürzt',
                'auf Wasser ausgerutscht',
                'auf Seife ausgerutscht'
            ],
            location_meist: 'badezimmer',
            verletzungen_oft_schwerer: 0.6,
            info: 'Badezimmer = häufigster Sturzort',
            prävention: {
                antirutschmatten: 1.0,
                haltegriffe: 0.9
            }
        },
        
        schwindel_kollaps: {
            probability: 0.2,
            variations: [
                'wurde schwindelig und dann gestürzt',
                'ist einfach umgekippt',
                'wurde schwarz vor Augen',
                'Kreislauf wurde schwach',
                'mir wurde ganz komisch'
            ],
            ursachen: {
                orthostatische_dysregulation: {
                    probability: 0.4,
                    info: 'Zu schnell aufgestanden',
                    typical_situation: 'Nachts zur Toilette'
                },
                herzrhythmusstörung: {
                    probability: 0.2,
                    abklärung_ekg: 1.0,
                    info: 'Vorhofflimmern, Brady-/Tachykardie'
                },
                unterzucker: {
                    probability: 0.15,
                    bz_messung_wichtig: 1.0,
                    diabetiker: 0.9
                },
                medikamente: {
                    probability: 0.15,
                    types: ['Blutdrucksenker', 'Beruhigungsmittel']
                },
                schlaganfall: {
                    probability: 0.1,
                    upgrade_stichwort: 'Schlaganfall',
                    fast_test_durchführen: 1.0,
                    kritisch: 1.0
                }
            },
            abklärung_wichtig: 1.0,
            info: 'WARUM gestürzt? Ursache klären!'
        },
        
        kraft_nachgegeben: {
            probability: 0.15,
            variations: [
                'Beine haben einfach nachgegeben',
                'war zu schwach',
                'konnte sich nicht halten',
                'Knie weggerutscht'
            ],
            hinweis: 'Muskelschwäche, Alter, Sarkopenie',
            ursachen: {
                altersschwäche: 0.6,
                parkinson: 0.2,
                muskelerkrankung: 0.1,
                polyneuropathie: 0.1
            }
        },
        
        von_leiter_stuhl: {
            probability: 0.03,
            variations: [
                'von der Leiter gefallen',
                'vom Stuhl gestürzt',
                'wollte was aus dem Schrank holen',
                'von der Trittleiter gefallen'
            ],
            höhe: { mean: 1.5, max: 3 },
            verletzungen_schwerer: 0.8,
            info: 'Erhöhte Energie = schwerere Verletzungen'
        },
        
        treppe: {
            probability: 0.02,
            variations: [
                'die Treppe runtergestürzt',
                'mehrere Stufen gefallen',
                'Treppe runtergerutscht',
                'über mehrere Stufen gefallen'
            ],
            stufen: { min: 3, max: 15 },
            verletzungen_oft_multipel: 0.9,
            kopfverletzung_wahrscheinlich: 0.6,
            wirbelsäule_beachten: 1.0,
            kritisch: 0.8
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
            aber_schmerzen: 0.8,
            trotzdem_abklärung: 1.0,
            info: 'Frakturen können ohne äußere Zeichen vorliegen!'
        },
        
        hüfte: {
            probability: 0.35,
            severity: {
                prellung: {
                    probability: 0.3,
                    variations: ['Hüfte tut weh', 'schmerzt an der Hüfte', 'blaue Flecken an der Hüfte']
                },
                schenkelhalsfraktur: {
                    probability: 0.7,
                    variations: [
                        'kann das Bein nicht bewegen',
                        'Bein steht komisch',
                        'extreme Schmerzen in der Hüfte',
                        'Bein ist verkürzt und verdreht',
                        'Bein nach außen gedreht'
                    ],
                    klassisch: {
                        außenrotation: 0.9,
                        verkürzung: 0.8,
                        bewegung_unmöglich: 1.0,
                        axiale_stauchung_schmerzhaft: 0.9
                    },
                    transport_schwierig: 0.9,
                    schmerzmittel_zwingend: 1.0,
                    tragehilfe_fast_immer: 0.95,
                    op_erforderlich: 0.95,
                    mobilisation_unmöglich: 1.0,
                    info: 'Klassische Seniorenverletzung',
                    klinik: 'Unfallchirurgie mit OP-Bereitschaft'
                }
            },
            bei_osteoporose_wahrscheinlicher: 0.9
        },
        
        kopf: {
            probability: 0.25,
            types: {
                platzwunde: {
                    probability: 0.5,
                    variations: [
                        'blutet am Kopf',
                        'Platzwunde an der Stirn',
                        'Kopf blutet stark',
                        'große Wunde am Kopf'
                    ],
                    blutet_stark: 0.7,
                    nähen_meist: 0.8,
                    bei_blutverdünner_problematisch: 0.9
                },
                beule: {
                    probability: 0.3,
                    variations: ['dicke Beule', 'Schwellung am Kopf', 'Ei am Kopf']
                },
                gehirnerschütterung: {
                    probability: 0.2,
                    indicators: [
                        'kurz bewusstlos gewesen',
                        'verwirrt',
                        'erinnert sich nicht',
                        'übel',
                        'schwindelig'
                    ],
                    beobachtung_nötig: 1.0,
                    ct_oft: 0.6
                },
                subdurales_hämatom: {
                    probability: 0.05,
                    condition: 'blutverdünner',
                    kritisch: 1.0,
                    ct_zwingend: 1.0,
                    verschlechterung_schleichend: 0.8,
                    info: 'Bei Blutverdünner besonders gefährlich!'
                }
            },
            bei_blutverdünner_kritischer: 1.0
        },
        
        arm_hand: {
            probability: 0.2,
            types: {
                prellung: { 
                    probability: 0.4,
                    variations: ['Arm tut weh', 'Ellbogen angeschlagen']
                },
                fraktur: {
                    probability: 0.6,
                    locations: {
                        handgelenk: {
                            probability: 0.5,
                            name: 'Colles-Fraktur',
                            info: 'Klassische Abfangfraktur',
                            typisch_bei_sturz: 1.0
                        },
                        unterarm: {
                            probability: 0.3,
                            name: 'Radius-/Ulnafraktur'
                        },
                        oberarm: {
                            probability: 0.2,
                            name: 'Humerusfraktur',
                            bei_osteoporose: 0.8
                        }
                    },
                    variations: [
                        'Arm tut extrem weh',
                        'kann Arm nicht bewegen',
                        'Arm ist geschwollen',
                        'sieht komisch aus',
                        'Hand steht schief'
                    ],
                    fehlstellung_möglich: 0.4,
                    schiene_nötig: 0.9
                }
            },
            abfangen_typisch: 0.9,
            info: 'Sturzabwehr mit Hand'
        },
        
        rippen: {
            probability: 0.12,
            variations: [
                'Schmerzen beim Atmen',
                'Rippen tun weh',
                'Brust schmerzt',
                'kann nicht tief atmen'
            ],
            rippenfraktur_wahrscheinlich: 0.6,
            ältere_patienten_häufiger: 0.9,
            bei_osteoporose: 0.8,
            info: 'Ältere = Rippen brüchiger',
            komplikationen: {
                pneumothorax: 0.05,
                lungenkontusion: 0.1
            }
        },
        
        bein_fuß: {
            probability: 0.15,
            types: {
                prellung: { 
                    probability: 0.5,
                    variations: ['Knie gestoßen', 'Schienbein angeschlagen']
                },
                fraktur: {
                    probability: 0.4,
                    locations: ['Unterschenkel', 'Knöchel', 'Fuß', 'Wadenbein'],
                    mobilisation_unmöglich: 0.9
                },
                verstauchung: { 
                    probability: 0.1,
                    location: 'Sprunggelenk'
                }
            }
        },
        
        rücken: {
            probability: 0.18,
            types: {
                prellung: { 
                    probability: 0.6,
                    variations: ['Rücken tut weh', 'auf den Rücken gefallen']
                },
                wirbelkörperfraktur: {
                    probability: 0.3,
                    besonders_bei: 'Osteoporose',
                    oft_schleichend: 0.6,
                    vorsicht_wirbelsäule: 1.0,
                    immobilisation_bei_verdacht: 1.0,
                    info: 'Bei Osteoporose auch ohne großes Trauma!'
                },
                schmerzen: { 
                    probability: 0.1,
                    muskelverspannung: 0.8
                }
            },
            hws_immer_beachten: 1.0
        },
        
        schürfwunden: {
            probability: 0.4,
            variations: [
                'aufgeschürft',
                'Haut ist ab',
                'Schürfwunden an Armen',
                'Haut aufgerissen'
            ],
            meist_harmlos: 0.9,
            aber_blutung_bei_blutverdünner: 0.6
        },
        
        hämatome: {
            probability: 0.5,
            variations: [
                'hat blaue Flecken',
                'wird schon blau',
                'große Blutergüsse',
                'ganz bunt'
            ],
            bei_blutverdünner_ausgeprägt: 0.8,
            info: 'Große Hämatome bei Marcumar/Eliquis etc.'
        },
        
        becken: {
            probability: 0.05,
            kritisch: 0.9,
            verletzungen: {
                beckenfraktur: {
                    probability: 0.7,
                    schock_wahrscheinlich: 0.6,
                    blutverlust_hoch: 0.7,
                    transport_schwierig: 1.0,
                    trauma_center: 1.0
                },
                prellung: {
                    probability: 0.3
                }
            }
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
                'auf der Toilette',
                'beim Duschen'
            ],
            probleme: {
                nass: 0.6,
                eng: 0.8,
                patient_nackt_teilweise: 0.4,
                bergen_schwierig: 0.7
            },
            schamgefühl: 0.6,
            info: 'Häufigster Sturzort!',
            prävention: {
                haltegriffe: 1.0,
                antirutschmatte: 1.0,
                duschhocker: 0.8
            }
        },
        
        schlafzimmer: {
            probability: 0.25,
            variations: [
                'neben dem Bett',
                'beim Aufstehen aus dem Bett',
                'im Schlafzimmer',
                'nachts zur Toilette'
            ],
            zeit_meist: 'nachts oder morgens',
            ursache_oft: 'Orthostatische Dysregulation',
            prävention: {
                nachtlicht: 1.0,
                bett_niedriger: 0.6
            }
        },
        
        wohnzimmer: {
            probability: 0.2,
            variations: ['im Wohnzimmer', 'vor dem Sofa', 'auf dem Teppich'],
            stolperfallen_oft: 0.7
        },
        
        küche: {
            probability: 0.1,
            variations: ['in der Küche', 'vor dem Herd']
        },
        
        flur: {
            probability: 0.08,
            variations: ['im Flur', 'Gang', 'Hausflur'],
            teppich_oft_ursache: 0.6
        },
        
        treppe: {
            probability: 0.02,
            siehe: 'sturz_mechanismus.treppe',
            verletzungen_schwerer: 0.9
        }
    },
    
    // ========================================
    // ⏱️ LIEGEZEIT
    // ========================================
    liegezeit: {
        sofort_entdeckt: {
            probability: 0.4,
            dauer: '< 5 Minuten',
            angehöriger_dabei: 0.9,
            prognose_besser: 1.0
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
                dehydrierung: 0.4,
                angst_panik: 0.6
            },
            info: 'Ab 30 Min: Komplikationen drohen'
        },
        
        lang: {
            probability: 0.1,
            dauer: '> 2 Stunden',
            variations: [
                'liegt seit Stunden',
                'die ganze Nacht gelegen',
                'seit gestern',
                'lag die ganze Nacht am Boden'
            ],
            komplikationen: {
                unterkühlung: {
                    probability: 0.7,
                    effects: {
                        hypothermie: 0.5,
                        aufwärmen_langsam: 1.0
                    }
                },
                dekubitus: {
                    probability: 0.5,
                    locations: ['Ferse', 'Steiß', 'Ellbogen']
                },
                dehydrierung: {
                    probability: 0.8,
                    volumensubstitution: 1.0
                },
                nierenversagen_risiko: {
                    probability: 0.3,
                    rhabdomyolyse_möglich: 0.2
                },
                verwirrtheit: {
                    probability: 0.6,
                    delir: 0.3
                },
                crush_syndrom: {
                    probability: 0.1,
                    condition: 'sehr_lange_liegezeit',
                    kritisch: 1.0
                }
            },
            kritischer: 0.8,
            info: 'Lange Liegezeit = hohes Risiko!',
            nef_wahrscheinlicher: 0.3,
            stationäre_aufnahme_oft: 0.9
        }
    },
    
    // ========================================
    // 🏥 MEDIZINISCH
    // ========================================
    medizinisch: {
        vorerkrankungen: {
            probability: 0.85,
            types: {
                osteoporose: { 
                    probability: 0.5, 
                    info: 'Knochenbrüche wahrscheinlicher',
                    frakturrisiko_erhöht: 0.9,
                    wirbelkörper_auch_ohne_trauma: 0.3
                },
                herz_kreislauf: { 
                    probability: 0.6,
                    sturz_durch_rhythmusstörung: 0.2
                },
                diabetes: { 
                    probability: 0.3,
                    unterzucker_möglich: 0.3,
                    bz_messung_wichtig: 1.0
                },
                parkinson: { 
                    probability: 0.1, 
                    sturzrisiko_hoch: 1.0,
                    gangstörung: 1.0,
                    starre: 0.8
                },
                demenz: { 
                    probability: 0.2, 
                    sturzrisiko_hoch: 1.0,
                    orientierung_schlecht: 0.9,
                    kommunikation_erschwert: 0.8
                },
                sehstörungen: { 
                    probability: 0.4,
                    stolperfallen_übersehen: 1.0
                },
                polyneuropathie: {
                    probability: 0.15,
                    sensibilitätsstörung: 0.9,
                    taubheitsgefühl_füße: 0.8
                }
            }
        },
        
        medikamente: {
            blutverdünner: {
                probability: 0.4,
                types: ['Marcumar', 'Eliquis', 'Xarelto', 'Pradaxa', 'ASS', 'Plavix'],
                effects: {
                    blutung_wahrscheinlicher: 0.9,
                    hämatome_größer: 0.9,
                    kopfverletzung_kritischer: 1.0,
                    innere_blutungen_gefährlicher: 0.9
                },
                info: 'Bei Kopfverletzung besonders gefährlich!',
                ct_empfohlen_bei_kopftrauma: 1.0,
                klinik_voranmelden: 0.9
            },
            
            blutdrucksenker: {
                probability: 0.6,
                kann_schwindel_verursachen: 0.5,
                orthostatische_dysregulation: 0.6
            },
            
            beruhigungsmittel: {
                probability: 0.2,
                sturzrisiko_erhöht: 0.8,
                types: ['Tavor', 'Diazepam', 'Zolpidem'],
                gangstörung: 0.6
            },
            
            schmerzmittel: {
                probability: 0.4,
                oft_mehrere: 0.6
            },
            
            polypharmazie: {
                probability: 0.5,
                definition: '>5 Medikamente',
                sturzrisiko_deutlich_erhöht: 0.8
            }
        },
        
        vitalparameter: {
            meist_stabil: {
                probability: 0.7,
                info: 'Patient ansprechbar, Kreislauf okay'
            },
            
            schock: {
                probability: 0.15,
                ursachen: ['Blutverlust', 'Schmerz', 'Schreck', 'Lange Liegezeit'],
                info: 'Bei schweren Verletzungen',
                volumengabe: 0.9
            },
            
            bewusstlos: {
                probability: 0.05,
                upgrade_stichwort: 'Bewusstlosigkeit',
                ursachen: {
                    schlaganfall: 0.4,
                    herzinfarkt: 0.2,
                    kopfverletzung: 0.3,
                    sonstiges: 0.1
                },
                abklärung_schlaganfall: 1.0,
                nef_zwingend: 1.0
            },
            
            verwirrt: {
                probability: 0.2,
                ursachen: {
                    schlaganfall: 0.3,
                    demenz_vorbestehend: 0.4,
                    kopfverletzung: 0.2,
                    lange_liegezeit: 0.1
                },
                fast_test_evtl: 0.6
            }
        },
        
        schmerzen: {
            keine: { probability: 0.1 },
            leicht: { probability: 0.3 },
            mittel: { probability: 0.4 },
            stark: { 
                probability: 0.2,
                analgesie_zwingend: 1.0,
                nef_evtl: 0.4
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
                stockwerke: { min: 2, max: 4 },
                effects: {
                    patient_kann_nicht_laufen: 0.9,
                    tragehilfe_fast_immer: 0.95,
                    zeitaufwand_hoch: 1.0
                },
                funkspruch: '{callsign}, Sturz mit Hüftverletzung, {floor} OG ohne Aufzug, FW Tragehilfe erforderlich, kommen.',
                info: 'Tragehilfe = Feuerwehr!'
            },
            
            enge_verhältnisse: {
                probability: 0.3,
                variations: [
                    'sehr enge Wohnung',
                    'vollgestellt',
                    'schmale Gänge',
                    'viele Möbel im Weg'
                ],
                effects: {
                    bergen_schwierig: 0.8,
                    schaufeltrage_nötig: 0.6,
                    möbel_umräumen: 0.5
                }
            },
            
            schlechte_beleuchtung: {
                probability: 0.3,
                info: 'Sturzursache',
                prävention: 'Bessere Beleuchtung'
            }
        },
        
        technik: {
            tür_verschlossen: {
                probability: 0.15,
                reasons: {
                    patient_kommt_nicht_ran: 0.7,
                    nachbar_sieht_nur_durchs_fenster: 0.3
                },
                lösungen: {
                    schlüssel_bei_nachbar: 0.4,
                    hausnotruf_hinterlegt: 0.2,
                    feuerwehr_öffnung: 0.4
                },
                funkspruch: '{callsign}, kein Zugang, Patient liegt am Boden, FW zur Türöffnung, kommen.',
                zeitverzögerung: 1.0
            },
            
            hausnotruf_vorhanden: {
                probability: 0.15,
                hilfe_schneller: 0.9,
                schlüssel_hinterlegt_oft: 0.7
            }
        },
        
        zustand_wohnung: {
            normal: { probability: 0.6 },
            
            unordentlich: {
                probability: 0.25,
                info: 'Viele Stolperfallen',
                sturzrisiko_erhöht: 0.8
            },
            
            verwahrlost: {
                probability: 0.15,
                indicators: [
                    'sehr unordentlich',
                    'unhygienisch',
                    'viele Hindernisse',
                    'Müll überall',
                    'riecht unangenehm'
                ],
                effects: {
                    sozialamt_info: 0.7,
                    selbstversorgung_fraglich: 0.8,
                    nachbetreuung_dringend: 0.9,
                    entlassung_nach_hause_fraglich: 0.7
                },
                info: 'Messie-Syndrom oder Verwahrlosung'
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
                    nachbetreuung_problem: 0.8,
                    entlassung_schwierig: 0.6,
                    sturz_nicht_sofort_bemerkt: 0.8
                },
                info: 'Alleinsein = Risikofaktor'
            },
            
            mit_angehörigen: {
                probability: 0.35,
                sofort_gefunden: 0.9,
                betreuung_da: 0.8
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
                    'weint',
                    'ist aufgelöst'
                ]
            },
            
            schuldgefühle: {
                probability: 0.25,
                variations: [
                    'Ich hätte aufpassen müssen!',
                    'Das ist meine Schuld!',
                    'Ich war nur kurz weg!',
                    'Ich hätte da sein müssen!'
                ],
                betreuung_wichtig: 0.8
            },
            
            überfordert: {
                probability: 0.3,
                variations: [
                    'Ich kann das nicht mehr alleine',
                    'Das wird zu viel',
                    'Wie soll das weitergehen?'
                ],
                sozialberatung_anbieten: 0.8
            },
            
            wollen_mitfahren: {
                probability: 0.7,
                info: 'Können wir mit ins Krankenhaus?',
                meist_möglich: 0.8
            }
        },
        
        schamgefühl: {
            patient_schämt_sich: {
                probability: 0.3,
                reasons: [
                    'Im Badezimmer gestürzt (nackt)',
                    'Schämt sich für Wohnzustand',
                    'Will nicht als hilfsbedürftig gelten',
                    'Inkontinenz'
                ],
                einfühlsam_vorgehen: 1.0
            }
        },
        
        nachversorgung: {
            problem: {
                probability: 0.4,
                variations: [
                    'Patient lebt allein, kann nicht allein bleiben',
                    'Wer kümmert sich nach Entlassung?',
                    'Wohnung nicht barrierefrei',
                    'Keine Angehörigen in der Nähe'
                ],
                lösungen: {
                    pflegedienst: 0.5,
                    kurzzeitpflege: 0.3,
                    familienangehörige: 0.15,
                    pflegeheim: 0.05
                },
                sozialamt_kontakt: 0.6,
                sozialdienst_klinik: 0.8,
                info: 'Nachversorgung muss geklärt werden!'
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
            vorerkrankungen_bekannt: 1.0,
            medikamente_dokumentiert: 1.0,
            info: 'Professionelle Erstversorgung oft bereits erfolgt',
            besonderheiten: {
                häufige_stürze: 0.8,
                sturzprophylaxe_existiert: 0.9,
                dokumentation_wichtig: 1.0
            }
        },
        
        betreutes_wohnen: {
            probability: 0.08,
            address_types: ['residential'],
            hausnotruf_oft: 0.7,
            betreuung_vorhanden: 0.9
        },
        
        öffentlich: {
            probability: 0.02,
            address_types: ['street', 'pedestrian'],
            zeugen: { min: 1, max: 3 },
            siehe_auch: 'sturz_öffentlich_template',
            verletzungen_evtl_schwerer: 0.5
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
                    probability: 0.7,
                    condition: 'patient_kann_nicht_laufen_und_kein_aufzug',
                    funkspruch: '{callsign}, Patient kann nicht laufen, {floor} OG ohne Aufzug, benötigen FW Tragehilfe, kommen.',
                    info: 'Bei Hüftverletzung + kein Aufzug = Standard!',
                    zeitverzögerung: { min: 5, max: 15 }
                },
                türöffnung: {
                    probability: 0.3,
                    condition: 'tür_verschlossen',
                    funkspruch: '{callsign}, kein Zugang, Patient am Boden, FW zur Türöffnung, kommen.',
                    methoden: ['Tür aufbrechen', 'Fenster öffnen', 'Schlüsseldienst'],
                    zeitverzögerung: { min: 10, max: 30 }
                }
            },
            info: 'Feuerwehr bei Sturz oft nötig!'
        },
        
        nef: {
            probability: 0.05,
            trigger_time: { min: 120, max: 300 },
            reasons: [
                'Patient instabil',
                'Schwere Kopfverletzung',
                'Bewusstseinsstörung',
                'Starke Schmerzen, Analgesie nötig',
                'Patient dekompensiert'
            ],
            funkspruch: '{callsign}, Patient instabil, benötigen NEF, kommen.'
        },
        
        polizei: {
            probability: 0.02,
            reasons: [
                'Gewaltverdacht (bei Hämatomen)',
                'Verwahrlosung/Kindesmisshandlung',
                'Tür muss aufgebrochen werden'
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
                changes: ['Patient wird kreislaufschwach', 'Blutdruck fällt', 'Puls steigt'],
                ursachen: ['Innere Blutung', 'Schmerz', 'Lange Liegezeit'],
                nef_wahrscheinlich: 0.8
            },
            
            bewusstseinstrübung: {
                probability: 0.08,
                trigger_time: { min: 180, max: 480 },
                changes: ['Patient wird schläfrig', 'reagiert verzögert'],
                ursachen: {
                    subdurales_hämatom: 0.5,
                    schlaganfall: 0.3,
                    schock: 0.2
                },
                kritisch: 1.0,
                nef_zwingend: 1.0
            }
        },
        
        überraschungen: {
            schwerer_als_gedacht: {
                probability: 0.2,
                funkspruch: '{callsign}, Verletzungen schwerer als gemeldet, Verdacht auf {diagnose}, kommen.',
                examples: [
                    'Schenkelhalsfraktur',
                    'multiple Frakturen',
                    'schwere Kopfverletzung'
                ]
            },
            
            war_schlaganfall: {
                probability: 0.08,
                info: 'Sturz war Folge eines Schlaganfalls',
                upgrade_stichwort: 'Schlaganfall',
                neurologische_ausfälle: 0.9,
                indicators: [
                    'Gesichtslähmung',
                    'Armlähmung',
                    'Sprachstörung',
                    'Blickdeviation'
                ],
                fast_test_durchführen: 1.0,
                stroke_unit_zwingend: 1.0,
                time_is_brain: 1.0
            },
            
            war_herzinfarkt: {
                probability: 0.03,
                info: 'Sturz durch Herzinfarkt verursacht',
                upgrade_stichwort: 'Herzinfarkt',
                ekg_pathologisch: 0.8,
                nef_zwingend: 1.0
            },
            
            war_synkope: {
                probability: 0.15,
                info: 'Kurzzeitige Bewusstlosigkeit',
                abklärung_kardiologisch: 1.0,
                rhythmusstörung_wahrscheinlich: 0.5
            }
        },
        
        besserung: {
            nur_prellung: {
                probability: 0.15,
                funkspruch: '{callsign}, Patient stabilisiert, keine schweren Verletzungen, nur Prellungen, kommen.',
                transport_trotzdem: 0.9,
                info: 'Abklärung trotzdem wichtig!'
            },
            
            patient_kann_doch_laufen: {
                probability: 0.1,
                funkspruch: '{callsign}, Patient mobilisiert, kann mit Hilfe laufen, FW nicht mehr nötig, kommen.',
                feuerwehr_abbestellen: 0.9
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
            feuerwehr: 0.45,
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'schenkelhalsfraktur',
                hospitals: ['rems_murr_klinikum_winnenden', 'klinikum_ludwigsburg'],
                reason: 'Unfallchirurgie mit OP-Bereitschaft',
                op_meist_schnell: 0.9
            },
            
            priorität_2: {
                condition: 'kopfverletzung_mit_blutverdünner',
                hospitals: ['klinikum_ludwigsburg', 'katharinenhospital_stuttgart'],
                reason: 'CT verfügbar, Neurochirurgie',
                ct_zwingend: 1.0
            },
            
            priorität_3: {
                condition: 'leichte_verletzung',
                hospitals: ['nächstgelegenes'],
                reason: 'Abklärung und Schmerztherapie'
            }
        },
        
        voranmeldung: {
            bei_op_indikation: 0.8,
            bei_blutverdünner_kopftrauma: 1.0,
            infos: [
                'Sturzhergang',
                'Verdachtsdiagnose',
                'Blutverdünner ja/nein (welcher?)',
                'Vitalparameter',
                'Liegezeit',
                'Vorerkrankungen'
            ]
        },
        
        transport: {
            liegend: {
                probability: 0.7,
                reasons: ['Hüftverletzung', 'Schmerzen', 'Kreislauf']
            },
            sitzend: {
                probability: 0.3,
                condition: 'leichte_verletzung'
            }
        }
    },
    
    // ========================================
    // 📊 PROTOKOLL & BEWERTUNG
    // ========================================
    protokoll: {
        tracked_data: {
            sturzhergang: 'FROM_CALL',
            sturzursache: 'FROM_CALL',
            verletzungen: 'FROM_CALL',
            blutverdünner: 'FROM_CALL',
            tragehilfe_disponiert: 'FROM_DISPOSITION',
            feuerwehr_bei_bedarf: 'FROM_DISPOSITION',
            klinik_passend: 'FROM_DISPOSITION',
            outcome: 'FROM_SIMULATION'
        },
        
        bewertung: {
            kriterien: {
                feuerwehr_tragehilfe: {
                    wichtig: 'kritisch',
                    condition: 'patient_kann_nicht_laufen_und_kein_aufzug',
                    info: 'Hüftverletzung + kein Aufzug = FW!',
                    ohne_unmöglich: 1.0
                },
                
                feuerwehr_türöffnung: {
                    wichtig: 'kritisch',
                    condition: 'tür_verschlossen',
                    info: 'Patient am Boden, Tür zu = FW!',
                    zeitkritisch: 0.8
                },
                
                blutverdünner_erkannt: {
                    wichtig: 'hoch',
                    info: 'Bei Kopftrauma mit Blutverdünner: CT-Klinik!',
                    klinikauswahl_beeinflusst: 1.0
                },
                
                sturzursache_abgefragt: {
                    wichtig: 'mittel',
                    info: 'WARUM gestürzt? Schwindel/Synkope?',
                    wichtig_für_diagnose: 1.0
                },
                
                schlaganfall_erkannt: {
                    wichtig: 'kritisch',
                    condition: 'sturz_durch_schlaganfall',
                    info: 'Schlaganfall als Ursache = Stroke Unit!',
                    zeitkritisch: 1.0
                },
                
                soziale_situation_beachtet: {
                    wichtig: 'mittel',
                    info: 'Alleinlebend + kann nicht laufen = Nachversorgung?'
                }
            },
            
            kritische_fehler: [
                'Feuerwehr bei Tragehilfe-Bedarf nicht disponiert',
                'Feuerwehr bei Türöffnung vergessen',
                'Schlaganfall als Ursache nicht erkannt',
                'Blutverdünner + Kopftrauma nicht beachtet',
                'Patient mit Hüftverletzung in Klinik ohne Unfallchirurgie'
            ],
            
            häufige_fehler: [
                'Tragehilfe nicht rechtzeitig nachgefordert',
                'Sturzursache nicht erfragt',
                'Blutverdünner nicht dokumentiert',
                'Soziale Situation nicht beachtet'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient nach Sturz, Verdacht auf Schenkelhalsfraktur',
            'Sturz häuslich, Patient kann nicht aufstehen',
            'Sturz mit Hüftverletzung, {floor} OG, Tragehilfe erforderlich',
            'Patient gestürzt, {Alter} Jahre, Blutverdünner, Kopfplatzwunde',
            'Sturz im Bad, liegt seit Stunden',
            'Patient gestürzt, war schwindelig, Verdacht auf Synkope'
        ],
        
        nachforderungen: [
            'Benötigen FW Tragehilfe, {floor} OG ohne Aufzug, Schenkelhalsfraktur',
            'FW zur Türöffnung, Patient am Boden, kommt nicht ran',
            'NEF nachgefordert, Patient instabil',
            'Patient kann doch laufen, FW nicht mehr nötig'
        ],
        
        besonderheiten: [
            'Blutverdünner, Kopfverletzung, CT-fähige Klinik',
            'Lange Liegezeit, Unterkühlung, Dehydrierung',
            'Verdacht auf Schlaganfall als Sturzursache',
            'Soziale Situation kritisch, Nachversorgung fraglich'
        ]
    },
    
    // ========================================
    // 🎯 SPECIAL - STURZ-SPEZIFISCH
    // ========================================
    special: {
        // Geriatrisches Assessment
        geriatrie: {
            sturzrisiko_assessment: {
                probability: 0.4,
                condition: 'wiederholter_sturz',
                faktoren: [
                    'Gangstörung',
                    'Sehschwäche',
                    'Medikamente',
                    'Schwindel',
                    'Frühere Stürze',
                    'Wohnumfeld'
                ],
                empfehlung: 'Geriatrische Abklärung',
                sturzprophylaxe: 1.0
            },
            
            mobilität: {
                selbstständig: { probability: 0.4 },
                mit_hilfsmittel: { 
                    probability: 0.4,
                    types: ['Rollator', 'Gehstock', 'Krücken']
                },
                unselbstständig: { probability: 0.2 }
            }
        },
        
        // Nachbetreuung
        nachversorgung: {
            problem: {
                probability: 0.4,
                variations: [
                    'Patient lebt allein, kann nicht allein bleiben',
                    'Wer kümmert sich nach Entlassung?',
                    'Wohnung nicht barrierefrei',
                    'Keine Angehörigen'
                ],
                lösungen: {
                    pflegedienst: { 
                        probability: 0.5,
                        info: 'Ambulante Pflege'
                    },
                    kurzzeitpflege: { 
                        probability: 0.3,
                        info: 'Übergangsweise stationär'
                    },
                    reha: {
                        probability: 0.15,
                        info: 'Geriatrische Reha'
                    },
                    pflegeheim: { 
                        probability: 0.05,
                        info: 'Dauerhaft stationär'
                    }
                },
                kontakte: {
                    sozialdienst_klinik: 0.9,
                    pflegeberatung: 0.7,
                    sozialamt: 0.5
                },
                info: 'Sozialdienst Klinik einschalten!'
            }
        },
        
        // Sturzprophylaxe
        prävention: {
            stolperfallen_beseitigen: {
                probability: 0.5,
                examples: [
                    'Teppiche fixieren/entfernen',
                    'Kabel sichern',
                    'Schwellen beseitigen',
                    'Beleuchtung verbessern'
                ],
                empfehlung: 'Wohnraumanpassung'
            },
            
            hilfsmittel: {
                probability: 0.6,
                examples: [
                    'Haltegriffe Bad',
                    'Antirutschmatten',
                    'Duschhocker',
                    'Höheres Bett',
                    'Nachtlicht',
                    'Hausnotruf'
                ],
                beratung_empfohlen: 1.0
            },
            
            medikamentenreview: {
                probability: 0.5,
                info: 'Polypharmazie überprüfen',
                sturzfördernde_medikamente: [
                    'Beruhigungsmittel',
                    'Blutdrucksenker',
                    'Antidepressiva'
                ]
            }
        },
        
        // Häufigkeit
        häufigkeit: {
            erstmaliger_sturz: { 
                probability: 0.6,
                info: 'Erster dokumentierter Sturz'
            },
            wiederholter_sturz: { 
                probability: 0.4, 
                sturzrisiko_assessment: 1.0,
                info: 'Erhöhtes Risiko für weitere Stürze',
                prävention_wichtig: 1.0
            }
        },
        
        // Psychische Aspekte
        psychisch: {
            sturzangst: {
                probability: 0.3,
                effects: {
                    mobilität_reduziert: 0.7,
                    selbstständigkeit_vermindert: 0.6,
                    soziale_isolation: 0.5
                },
                teufelskreis: 'Angst → weniger Bewegung → Muskelabbau → höheres Sturzrisiko'
            }
        },
        
        // Dokumentation
        dokumentation: {
            sturzprotokoll: {
                probability: 0.3,
                condition: 'pflegeheim',
                inhalt: [
                    'Datum/Uhrzeit',
                    'Ort',
                    'Mechanismus',
                    'Verletzungen',
                    'Maßnahmen'
                ]
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { STURZ_TEMPLATE };
}
