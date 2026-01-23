// =========================================================================================
// REANIMATION TEMPLATE - Herz-Kreislauf-Stillstand
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const REANIMATION_TEMPLATE = {
    
    id: 'reanimation',
    kategorie: 'rd',
    stichwort: 'Reanimation',
    weight: 2,
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            angehöriger_panisch: {
                probability: 0.45,
                speech_pattern: 'panisch, schreiend, weinend',
                variations: [
                    '{Er/Sie} atmet nicht mehr!',
                    'Ich glaube {er/sie} ist tot!',
                    '{Er/Sie} reagiert nicht!',
                    'Bitte kommen Sie schnell, {er/sie} bewegt sich nicht mehr!',
                    'HELFEN SIE UNS!'
                ],
                effects: {
                    schwer_zu_beruhigen: 0.9,
                    anleitung_schwierig: 0.8,
                    emotional_zusammenbruch: 0.6
                }
            },
            
            zeuge_aufgeregt: {
                probability: 0.25,
                speech_pattern: 'aufgeregt aber kontrollierter',
                variations: [
                    'Hier liegt jemand bewusstlos!',
                    'Person reagiert nicht, atmet nicht!',
                    'Jemand ist zusammengebrochen!',
                    'Bewusstlose Person, keine Atmung!'
                ],
                location: 'öffentlich',
                kann_anleitung_folgen: 0.7
            },
            
            ersthelfer_erfahren: {
                probability: 0.15,
                speech_pattern: 'sachlich, gibt klare infos',
                variations: [
                    'Ersthelfer hier, bewusstlose Person ohne Atmung, beginne mit Reanimation',
                    'Patient in Herzstillstand, CPR läuft',
                    'Reanimation bereits gestartet'
                ],
                effects: {
                    reanimation_läuft: 0.9,
                    genaue_infos: 1.0,
                    wenig_anleitung_nötig: 0.9
                },
                überlebenschance_besser: 0.8
            },
            
            medizinisches_personal: {
                probability: 0.08,
                speech_pattern: 'professionell',
                variations: [
                    'Arztpraxis, Patient reanimationspflichtig',
                    'Pflegeheim, Bewohner in Herzstillstand',
                    'Zahnarzt hier, Patient kollabiert'
                ],
                effects: {
                    reanimation_läuft_professionell: 1.0,
                    defi_evtl_vorhanden: 0.6
                }
            },
            
            nachbar_unsicher: {
                probability: 0.05,
                speech_pattern: 'unsicher, zögernd',
                variations: [
                    'Mein Nachbar... ich glaube der ist... tot?',
                    'Komme nicht rein, aber sieht schlimm aus',
                    'Liegt da seit Stunden glaube ich'
                ],
                evtl_zu_spät: 0.8
            },
            
            kind: {
                probability: 0.02,
                speech_pattern: 'verstört, verwirrt',
                variations: [
                    'Mama wacht nicht auf!',
                    'Papa bewegt sich nicht mehr!'
                ],
                patient_age: { mean: 35, range: [25, 45] },
                sehr_belastend: 1.0,
                anleitung_sehr_schwierig: 0.9
            }
        },
        
        dynamik: {
            reanimation_gestartet: {
                probability: 0.4,
                trigger_time: { min: 30, max: 120 },
                change: 'Ich drücke jetzt auf die Brust!',
                effects: {
                    überlebenschance_steigt: 0.8
                },
                info: 'Jede Sekunde zählt!'
            },
            
            person_gibt_auf: {
                probability: 0.15,
                trigger_time: { min: 180, max: 480 },
                change: 'Ich kann nicht mehr... das bringt doch nichts...',
                effects: {
                    motivierung_nötig: 1.0
                },
                info: 'Anrufer erschöpft'
            },
            
            verschlechterung: {
                probability: 0.1,
                trigger_time: { min: 60, max: 240 },
                changes: [
                    'Wird ganz blau!',
                    'Das Gesicht verfärbt sich!',
                    'Ist ganz kalt!'
                ]
            },
            
            rosc: {
                probability: 0.15,
                trigger_time: { min: 240, max: 600 },
                change: '{Er/Sie} atmet wieder! Ich spüre einen Puls!',
                effects: {
                    erfolg: 1.0,
                    weiter_überwachen: 1.0
                },
                info: 'Return of spontaneous circulation'
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.6,
            female: 0.4
        },
        
        alter: {
            distribution: 'exponential_alt',
            mean: 68,
            stddev: 15,
            peak_range: [60, 80],
            min: 18,
            max: 95,
            info: 'Meist ältere Patienten'
        },
        
        bewusstsein: {
            bewusstlos: {
                probability: 1.0,
                keine_reaktion: 1.0
            }
        },
        
        atmung: {
            keine: {
                probability: 0.85,
                info: 'Atemstillstand'
            },
            
            schnappatmung: {
                probability: 0.15,
                beschreibung: 'Agonale Atmung',
                variations: [
                    'atmet ganz komisch',
                    'röchelt',
                    'schnappt nach Luft',
                    'atmet nur ganz flach'
                ],
                nicht_ausreichend: 1.0,
                reanimation_trotzdem: 1.0,
                info: 'Zählt nicht als normale Atmung!'
            }
        },
        
        kreislauf: {
            kein_puls: {
                probability: 1.0,
                info: 'Herz-Kreislauf-Stillstand'
            }
        },
        
        hautfarbe: {
            blass_grau: { probability: 0.5 },
            zyanotisch_blau: { probability: 0.4 },
            normal: { probability: 0.1, info: 'Ganz frisch' }
        }
    },
    
    // ========================================
    // 💔 URSACHEN
    // ========================================
    ursachen: {
        primär_kardial: {
            probability: 0.7,
            info: 'Herzursache - am häufigsten!',
            types: {
                herzinfarkt: {
                    probability: 0.6,
                    info: 'Akuter Myokardinfarkt',
                    vorher_evtl_schmerzen: 0.5
                },
                
                rhythmusstörung: {
                    probability: 0.25,
                    types: ['Kammerflimmern', 'Kammertachykardie'],
                    defi_indiziert: 1.0
                },
                
                herzinsuffizienz: {
                    probability: 0.1,
                    meist_bekannt: 0.9
                },
                
                andere: {
                    probability: 0.05,
                    examples: ['Myokarditis', 'Kardiomyopathie']
                }
            }
        },
        
        respiratorisch: {
            probability: 0.15,
            info: 'Atemstillstand führt zu Herzstillstand',
            types: {
                erstickung: {
                    probability: 0.3,
                    variations: ['verschluckt', 'Fremdkörper', 'erhängt']
                },
                
                ertrinken: {
                    probability: 0.2,
                    location: ['badewanne', 'pool', 'gewässer']
                },
                
                schweres_asthma: {
                    probability: 0.2,
                    siehe: 'asthma_template'
                },
                
                andere: {
                    probability: 0.3,
                    examples: ['Pneumonie', 'COPD-Exazerbation']
                }
            }
        },
        
        trauma: {
            probability: 0.05,
            types: {
                polytrauma: 0.5,
                schädel_hirn_trauma: 0.3,
                verblutung: 0.2
            },
            schlechte_prognose: 0.9
        },
        
        intoxikation: {
            probability: 0.04,
            types: {
                drogen: {
                    probability: 0.5,
                    examples: ['Heroin', 'Fentanyl', 'Kokain']
                },
                medikamente: {
                    probability: 0.3,
                    suizidversuch_evtl: 0.7
                },
                kohlenmonoxid: {
                    probability: 0.1,
                    gefahr_für_retter: 0.9
                },
                andere: {
                    probability: 0.1
                }
            }
        },
        
        elektrounfall: {
            probability: 0.02,
            variations: ['Stromschlag', 'Blitzschlag'],
            rhythmusstörung: 1.0
        },
        
        hypothermie: {
            probability: 0.01,
            info: 'Unterkühlung',
            reanimation_lange_fortsetzen: 1.0,
            motto: 'Nobody is dead until warm and dead'
        },
        
        andere: {
            probability: 0.03,
            examples: [
                'Lungenembolie',
                'Schlaganfall',
                'Anaphylaxie',
                'Elektrolytentgleisung'
            ]
        }
    },
    
    // ========================================
    // ⏱️ ZEITFAKTOREN
    // ========================================
    zeitfaktoren: {
        kollaps_zeitpunkt: {
            gerade_eben: {
                probability: 0.4,
                minuten: { max: 5 },
                prognose: 'gut',
                überleben_chance: 0.5
            },
            
            vor_kurzem: {
                probability: 0.3,
                minuten: { mean: 10, range: [5, 15] },
                prognose: 'mäßig',
                überleben_chance: 0.3
            },
            
            länger: {
                probability: 0.2,
                minuten: { mean: 20, range: [15, 30] },
                prognose: 'schlecht',
                überleben_chance: 0.1
            },
            
            unbekannt: {
                probability: 0.1,
                variations: [
                    'weiß nicht wann',
                    'habe {ihn/sie} so gefunden'
                ],
                prognose: 'sehr_unsicher'
            }
        },
        
        no_flow_time: {
            info: 'Zeit ohne Durchblutung',
            kritisch: {
                schwelle: '3-5 Minuten',
                danach: 'Hirnschädigung wahrscheinlich'
            }
        },
        
        low_flow_time: {
            info: 'Zeit mit Reanimation',
            besser_als_nichts: 1.0,
            etwa: '30% des normalen Blutflusses'
        }
    },
    
    // ========================================
    // 💔 REANIMATIONSMASSNAHMEN
    // ========================================
    reanimation: {
        laie_cpr: {
            läuft: {
                probability: 0.4,
                quality: {
                    gut: { probability: 0.3, überleben_chance_erhöht: 0.8 },
                    mäßig: { probability: 0.5 },
                    schlecht: { probability: 0.2, aber_besser_als_nichts: 1.0 }
                },
                info: 'Jede CPR besser als keine!'
            },
            
            läuft_nicht: {
                probability: 0.6,
                gründe: {
                    angst: { probability: 0.4 },
                    weiß_nicht_wie: { probability: 0.3 },
                    zu_spät: { probability: 0.15 },
                    alleine_überfordert: { probability: 0.15 }
                },
                anleitung_zwingend: 1.0
            }
        },
        
        telefonreanimation: {
            probability: 0.6,
            erfolg: {
                anleitung_geklappt: { probability: 0.6 },
                anrufer_macht_nicht_mit: { probability: 0.25 },
                zu_erschöpft: { probability: 0.15 }
            },
            kritisch_wichtig: 1.0,
            info: 'Überlebenswichtig!'
        },
        
        defi_vorhanden: {
            probability: 0.15,
            locations: [
                'Flughafen',
                'Bahnhof',
                'Einkaufszentrum',
                'Fitnessstudio',
                'Arztpraxis'
            ],
            verwendet: {
                probability: 0.7,
                überleben_chance_steigt: 0.9
            },
            info: 'AED massiv lebensrettend!'
        }
    },
    
    // ========================================
    // 🏥 MEDIZINISCH
    // ========================================
    medizinisch: {
        vorerkrankungen: {
            probability: 0.8,
            types: {
                koronare_herzkrankheit: {
                    probability: 0.6,
                    info: 'KHK - Hauptrisikofaktor'
                },
                
                herzinsuffizienz: {
                    probability: 0.4
                },
                
                diabetes: {
                    probability: 0.35
                },
                
                copd: {
                    probability: 0.25
                },
                
                früherer_herzinfarkt: {
                    probability: 0.3
                },
                
                bypass_operation: {
                    probability: 0.15
                },
                
                schrittmacher: {
                    probability: 0.1
                },
                
                defibrillator_implantiert: {
                    probability: 0.05,
                    hat_evtl_ausgelöst: 0.5
                }
            }
        },
        
        prodromalsymptome: {
            probability: 0.4,
            symptoms: {
                brustschmerzen_vorher: {
                    probability: 0.6,
                    dauer: { mean: 30, range: [10, 120], unit: 'Minuten' }
                },
                
                luftnot: {
                    probability: 0.4
                },
                
                übelkeit: {
                    probability: 0.3
                },
                
                schwindel: {
                    probability: 0.3
                },
                
                unwohl_vorher: {
                    probability: 0.5,
                    variations: [
                        'ging es vorher schon nicht gut',
                        'klagte über Unwohlsein'
                    ]
                }
            },
            info: 'Hinweise auf Ursache'
        },
        
        rhythmus: {
            kammerflimmern: {
                probability: 0.35,
                info: 'VF - Defibrillierbar!',
                überleben_chance: 0.4,
                früh_erwischt: 'gute Prognose'
            },
            
            kammertachykardie: {
                probability: 0.15,
                info: 'VT - Defibrillierbar!',
                überleben_chance: 0.35
            },
            
            asystolie: {
                probability: 0.35,
                info: 'Nulllinie - nicht defibrillierbar',
                überleben_chance: 0.05,
                prognose: 'sehr_schlecht',
                meist_zu_spät: 0.8
            },
            
            pea: {
                probability: 0.15,
                info: 'Pulslose elektrische Aktivität',
                überleben_chance: 0.1,
                ursache_suchen: 1.0
            }
        },
        
        todeszeichen: {
            sichere: {
                probability: 0.15,
                types: {
                    totenflecken: {
                        probability: 0.6,
                        variations: ['blaue Flecken', 'Verfarbungen'],
                        ab: '20-30 Minuten nach Tod'
                    },
                    
                    totenstarre: {
                        probability: 0.3,
                        ab: '2-4 Stunden nach Tod'
                    },
                    
                    verwesung: {
                        probability: 0.1,
                        geruch: 1.0,
                        eindeutig: 1.0
                    }
                },
                reanimation_nicht_beginnen: 1.0
            }
        }
    },
    
    // ========================================
    // 🏠 UMGEBUNG
    // ========================================
    umgebung: {
        ort: {
            wohnhaus: {
                probability: 0.6,
                address_types: ['residential', 'apartment'],
                räume: {
                    schlafzimmer: 0.4,
                    wohnzimmer: 0.3,
                    badezimmer: 0.2,
                    andere: 0.1
                },
                meist_morgens: 0.6
            },
            
            öffentlich: {
                probability: 0.25,
                address_types: ['street', 'shop', 'station', 'pedestrian'],
                zeugen: { min: 2, max: 15 },
                ersthelfer_evtl: 0.6,
                aed_evtl: 0.3
            },
            
            arbeitsplatz: {
                probability: 0.08,
                address_types: ['commercial', 'office', 'industrial'],
                betriebssanitäter_evtl: 0.3
            },
            
            pflegeheim: {
                probability: 0.05,
                address_types: ['nursing_home'],
                personal_professionell: 0.9,
                patientenverfügung_evtl: 0.7
            },
            
            arztpraxis: {
                probability: 0.02,
                address_types: ['doctors'],
                reanimation_läuft_professionell: 1.0,
                ausstattung_gut: 0.9
            }
        },
        
        platz: {
            genügend: { probability: 0.7 },
            beengt: {
                probability: 0.3,
                variations: [
                    'enger Raum',
                    'zwischen Möbeln',
                    'im Bett'
                ],
                erschwert_reanimation: 0.8
            }
        },
        
        boden: {
            hart_geeignet: { probability: 0.6 },
            weich_problematisch: {
                probability: 0.4,
                variations: ['im Bett', 'auf Sofa', 'auf Matratze'],
                umlagern_nötig: 1.0
            }
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK
    // ========================================
    sozial: {
        angehörige: {
            anwesend: {
                probability: 0.7,
                zustand: {
                    völlig_aufgelöst: {
                        probability: 0.5,
                        variations: [
                            'weint unkontrolliert',
                            'schreit',
                            'hysterisch'
                        ],
                        betreuung_nötig: 1.0
                    },
                    
                    schockiert_starr: {
                        probability: 0.3,
                        variations: ['steht nur da', 'wie gelähmt']
                    },
                    
                    hilft: {
                        probability: 0.15,
                        macht_reanimation: 0.8
                    },
                    
                    stört: {
                        probability: 0.05,
                        variations: [
                            'hält fest',
                            'will nicht loslassen',
                            'schreit Patient an'
                        ],
                        aus_raum_bringen: 0.8
                    }
                }
            },
            
            nicht_anwesend: {
                probability: 0.3,
                müssen_informiert_werden: 1.0,
                sehr_belastend: 1.0
            }
        },
        
        kinder_anwesend: {
            probability: 0.1,
            variations: ['Kinder sind da', 'Enkel im Raum'],
            aus_raum_bringen: 0.9,
            traumatisierungsgefahr: 1.0,
            betreuung_organisieren: 1.0
        },
        
        zuschauer_gaffer: {
            probability: 0.3,
            condition: 'location_öffentlich',
            variations: ['viele Schaulustige', 'Menge versammelt sich'],
            sichtschutz_wünschenswert: 1.0
        }
    },
    
    // ========================================
    // ⚠️ BESONDERHEITEN
    // ========================================
    besonderheiten: {
        patientenverfügung: {
            probability: 0.15,
            vorhanden: {
                probability: 0.6,
                keine_reanimation: 0.8,
                dilemma: 1.0,
                rechtlich_bindend: 1.0
            },
            
            nicht_auffindbar: {
                probability: 0.4,
                reanimation_starten: 1.0,
                im_zweifel_für_leben: 1.0
            }
        },
        
        dnr: {
            probability: 0.1,
            info: 'Do Not Resuscitate',
            meist_pflegeheim: 0.8,
            konflikt_evtl: 0.5
        },
        
        schwangerschaft: {
            probability: 0.01,
            info: 'Schwangere reanimieren',
            besonderheiten: [
                'Linksseitenlage',
                'Kaiserschnitt evtl.',
                'Zwei Leben retten!'
            ],
            kritisch: 1.0
        },
        
        implantate: {
            schrittmacher: {
                probability: 0.1,
                defi_elektroden_anders_platzieren: 0.8
            },
            
            icd: {
                probability: 0.05,
                info: 'Implantierbarer Cardioverter-Defibrillator',
                kann_auslösen: 0.5,
                vorsicht: 1.0
            }
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        wohnung: {
            probability: 0.6,
            address_types: ['residential', 'apartment']
        },
        
        öffentlich: {
            probability: 0.25,
            address_types: ['street', 'square', 'pedestrian', 'park']
        },
        
        geschäftlich: {
            probability: 0.1,
            address_types: ['commercial', 'office', 'shop', 'restaurant']
        },
        
        einrichtung: {
            probability: 0.05,
            address_types: ['nursing_home', 'hospital', 'doctors']
        }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN
    // ========================================
    nachforderungen: {
        nef: {
            probability: 1.0,
            trigger_time: 'sofort',
            info: 'Bei Reanimation IMMER NEF!',
            funkspruch: 'EILIG! Reanimation, NEF sofort!'
        },
        
        rtw_zusatz: {
            probability: 0.3,
            trigger_time: { min: 300, max: 600 },
            reasons: [
                'Reanimation dauert an',
                'Ablösung nötig',
                'ROSC aber kritisch'
            ]
        },
        
        rth: {
            probability: 0.1,
            condition: 'ländlich_oder_stau',
            info: 'Bei langer Anfahrt'
        },
        
        polizei: {
            probability: 0.3,
            reasons: {
                todesermittlung: 0.5,
                verkehr_regeln: 0.3,
                fremdverschulden_vermutet: 0.2
            }
        },
        
        notfallseelsorge: {
            probability: 0.4,
            für: 'Angehörige',
            besonders_bei: 'Tod eingetreten'
        }
    },
    
    // ========================================
    // ⚡ OUTCOME
    // ========================================
    outcome: {
        rosc: {
            probability: 0.25,
            info: 'Return of Spontaneous Circulation',
            variations: [
                'Herzschlag ist wieder da',
                'atmet wieder',
                'Puls tastbar'
            ],
            aber: {
                oft_instabil: 0.8,
                überwachung_intensiv: 1.0,
                später_versterben_evtl: 0.4
            }
        },
        
        erfolglose_reanimation: {
            probability: 0.7,
            nach: { mean: 30, range: [15, 60], unit: 'Minuten' },
            abbruch_durch_notarzt: 1.0,
            belastend_für_alle: 1.0
        },
        
        tot_bei_eintreffen: {
            probability: 0.05,
            todeszeichen_sicher: 1.0,
            reanimation_nicht_begonnen: 1.0
        },
        
        klinik: {
            intensivstation: {
                condition: 'rosc',
                probability: 1.0,
                kühlungstherapie_evtl: 0.7,
                prognose_unsicher: 1.0
            }
        },
        
        langzeitprognose: {
            überleben_1_monat: {
                probability: 0.15,
                info: 'Nur ca. 15% überleben langfristig'
            },
            
            ohne_hirnschäden: {
                probability: 0.1,
                info: 'Noch seltener ohne neurologische Schäden'
            },
            
            faktoren_für_erfolg: [
                'Kurze no-flow-time',
                'Schneller Beginn CPR',
                'Defibrillierbarer Rhythmus',
                'Junge Patienten',
                'Beobachteter Kollaps'
            ]
        }
    },
    
    // ========================================
    // 🏥 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 1.0,
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'rosc',
                hospitals: ['klinikum_ludwigsburg', 'katharinenhospital_stuttgart', 'rems_murr_klinikum_winnenden'],
                reason: 'Intensivstation, Herzkatheter-Bereitschaft, Kühlungstherapie',
                herzkatheterlabor: 0.8,
                voranmeldung_zwingend: 1.0
            }
        },
        
        transport: {
            bei_rosc: {
                schnellstmöglich: 1.0,
                stabilisierung_vorher: 1.0
            },
            
            bei_laufender_reanimation: {
                mechanische_reanimationshilfe: 0.7,
                lucas_system: 0.6
            }
        },
        
        abbruch: {
            kriterien: [
                'Asystolie über 20-30 Minuten',
                'Keine ROSC trotz ALS',
                'Sichere Todeszeichen',
                'Patientenverfügung'
            ],
            entscheidung_notarzt: 1.0
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Reanimation läuft, Patient in Asystolie',
            'CPR durch Laien, Patient weiterhin pulslos',
            'Defibrillation erfolgt, weiter Reanimation',
            'ROSC erreicht, Patient instabil',
            'Reanimation erfolglos, Patient verstorben'
        ]
    },
    
    // ========================================
    // 📊 SPECIAL
    // ========================================
    special: {
        telefonreanimation_ablauf: {
            schritte: [
                '1. Bewusstsein prüfen',
                '2. Atmung prüfen',
                '3. Notruf bestätigen',
                '4. Harte Unterlage',
                '5. Oberkörper frei',
                '6. Druckpunkt erklären',
                '7. 100-120/min drücken',
                '8. Tief und fest (5-6cm)',
                '9. Nicht aufhören!',
                '10. Motivieren'
            ],
            kritisch_wichtig: 1.0
        },
        
        überlebenskette: {
            glieder: [
                '1. Frühe Alarmierung',
                '2. Frühe CPR',
                '3. Frühe Defibrillation',
                '4. Frühe erweiterte Maßnahmen',
                '5. Postreanimationsbehandlung'
            ],
            info: 'Jedes Glied zählt!'
        },
        
        statistik: {
            häufigkeit: '50.000-75.000 Reanimationen/Jahr in Deutschland',
            überleben: 'Ca. 10-15% überleben bis Klinikentlassung',
            mit_laien_cpr: 'Überlebenschance verdoppelt bis verdreifacht',
            ohne_cpr: 'Pro Minute 10% weniger Überlebenschance'
        },
        
        mythen: {
            rippen_brechen: {
                info: 'Kann passieren, ist aber nicht schlimm',
                wichtiger: 'Durchblutung wiederherstellen'
            },
            
            mund_zu_mund: {
                info: 'Bei Laien nicht mehr zwingend',
                hands_only_cpr: 'Nur Drücken reicht!'
            },
            
            aufhören: {
                info: 'Nicht aufhören bis Rettungsdienst da!',
                auch_wenn: 'Anstrengend und hoffnungslos erscheint'
            }
        },
        
        psychologie: {
            für_helfer_belastend: 1.0,
            schuldgefühle_häufig: 0.8,
            auch_wenn_alles_richtig: 1.0,
            nachbesprechung_wichtig: 1.0,
            ptbs_möglich: 0.3
        },
        
        rechtliches: {
            unterlassene_hilfeleistung: {
                strafbar: 1.0,
                aber: 'Nur bei unterlassener Hilfe, nicht bei Fehler!'
            },
            
            haftung: {
                info: 'Ersthelfer sind geschützt',
                keine_haftung: 'Bei Hilfe in Not'
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { REANIMATION_TEMPLATE };
}
