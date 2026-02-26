// =========================================================================================
// BRUSTSCHMERZEN TEMPLATE V2.0 - Viele Differentialdiagnosen, zeitkritisch!
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const BRUSTSCHMERZEN_TEMPLATE = {
    
    id: 'brustschmerzen',
    kategorie: 'rd',
    stichwort: 'Brustschmerzen',
    weight: 5,  // Sehr häufig!
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            patient_selbst_panisch: {
                probability: 0.4,
                speech_pattern: 'ängstlich, kurzatmig',
                variations: [
                    'Ich hab starke Schmerzen in der Brust!',
                    'Mein Herz! Ich glaube, ich bekomme einen Herzinfarkt!',
                    'Die Brust tut so weh, ich krieg keine Luft!',
                    'Hilfe! Ich hab so Druck auf der Brust!'
                ],
                characteristics: {
                    todesangst: 0.7,
                    kurzatmig_beim_sprechen: 0.6,
                    unterbricht_sich: 0.5
                },
                info: 'Typisch bei akutem Koronarsyndrom'
            },
            
            patient_selbst_ruhig: {
                probability: 0.2,
                speech_pattern: 'kontrolliert, beschreibt genau',
                variations: [
                    'Ich habe Schmerzen in der Brust seit einer Stunde',
                    'Ich bin Herzpatient, ich kenne das',
                    'Die Schmerzen strahlen in den Arm aus',
                    'Ich hab schon ein Nitro genommen'
                ],
                characteristics: {
                    kennt_herzerkrankung: 0.8,
                    hat_nitro_dabei: 0.7,
                    beschreibt_detailliert: 0.9
                }
            },
            
            angehöriger_besorgt: {
                probability: 0.3,
                speech_pattern: 'besorgt, aber informativ',
                variations: [
                    'Mein Mann hat starke Brustschmerzen!',
                    'Sie fasst sich an die Brust und schwitzt!',
                    'Er sieht ganz schlecht aus und klagt über Schmerzen!',
                    'Sie sagt, es drückt auf der Brust!'
                ],
                characteristics: {
                    kann_patient_beobachten: 1.0,
                    beschreibt_symptome: 0.9
                }
            },
            
            angehöriger_panisch: {
                probability: 0.08,
                speech_pattern: 'hysterisch, unklar',
                variations: [
                    'Er liegt da und greift sich ans Herz!',
                    'Sie wird ganz blass! Schnell!',
                    'Ich glaube, er stirbt!'
                ],
                characteristics: {
                    schwer_zu_beruhigen: 0.8,
                    übertreibt_evtl: 0.4
                }
            },
            
            zeuge: {
                probability: 0.02,
                speech_pattern: 'unsicher, keine Vorgeschichte',
                variations: [
                    'Hier fasst sich jemand an die Brust',
                    'Eine Person hat Schmerzen, ich kenne sie nicht'
                ]
            }
        },
        
        dynamik: {
            verschlechterung: {
                probability: 0.2,
                trigger_time: { min: 60, max: 240 },
                variations: [
                    'Die Schmerzen werden immer schlimmer!',
                    'Er wird bewusstlos!',
                    'Sie reagiert nicht mehr!',
                    'Er atmet ganz komisch!'
                ],
                effects: {
                    bewusstlosigkeit: 0.3,
                    reanimationspflichtig: 0.1,
                    zunehmende_atemnot: 0.6
                }
            },
            
            besserung: {
                probability: 0.15,
                trigger_time: { min: 120, max: 360 },
                variations: [
                    'Es wird langsam besser',
                    'Das Nitro wirkt',
                    'Die Schmerzen lassen nach'
                ],
                effects: {
                    transport_trotzdem_nötig: 0.95
                }
            }
        },
        
        erste_hilfe_bereits: {
            nitro_genommen: {
                probability: 0.25,
                condition: 'herzpatient_bekannt',
                erfolg: 0.6,
                info: 'Patient hat Nitro-Spray dabei'
            },
            aspirin_genommen: {
                probability: 0.15,
                condition: 'verdacht_herzinfarkt',
                info: 'Laienreanimationskurs oder Vorwissen'
            },
            hingelegt: {
                probability: 0.6,
                info: 'Patient liegt bereits'
            },
            fenster_geöffnet: {
                probability: 0.4,
                info: 'Für frische Luft'
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.65,  // Männer häufiger betroffen
            female: 0.35
        },
        
        alter: {
            distribution: 'age_dependent_risk',
            ranges: {
                jung: {
                    range: [25, 45],
                    probability: 0.15,
                    typical_causes: ['Muskuloskeletal', 'Psychogen', 'Pneumothorax'],
                    acs_risiko: 0.05
                },
                mittleres_alter: {
                    range: [45, 65],
                    probability: 0.35,
                    typical_causes: ['ACS', 'Angina', 'Lungenembolie'],
                    acs_risiko: 0.35
                },
                älter: {
                    range: [65, 85],
                    probability: 0.4,
                    typical_causes: ['ACS', 'Aortendissektion', 'Herzinsuffizienz'],
                    acs_risiko: 0.5
                },
                hochbetagt: {
                    range: [85, 95],
                    probability: 0.1,
                    atypische_symptome_häufig: 0.6,
                    acs_risiko: 0.4
                }
            }
        },
        
        bewusstseinszustand: {
            wach_und_orientiert: {
                probability: 0.75,
                info: 'Kann Schmerzen beschreiben'
            },
            unruhig_ängstlich: {
                probability: 0.15,
                info: 'Todesangst, kann sich nicht beruhigen'
            },
            verwirrt: {
                probability: 0.05,
                info: 'Besonders bei älteren Patienten'
            },
            bewusstlos: {
                probability: 0.05,
                kritisch: 1.0,
                upgrade_stichwort: 'Reanimation'
            }
        }
    },
    
    // ========================================
    // 💔 DIFFERENTIALDIAGNOSEN
    // ========================================
    differentialdiagnosen: {
        // KARDIAL
        stemi: {
            probability: 0.15,
            name: 'ST-Hebungs-Infarkt',
            zeitkritisch: 1.0,
            door_to_balloon: '<90 Min',
            characteristics: {
                schmerz_intensität: 'sehr stark',
                dauer: '>20 Minuten',
                ausstrahlung: 'linker Arm, Kiefer, Rücken',
                nitro_wirkt_nicht: 0.9,
                vegetative_symptome: 0.9,
                todesangst: 0.8
            },
            symptome: {
                vernichtungsschmerz: 0.8,
                schwitzen: 0.85,
                übelkeit: 0.6,
                atemnot: 0.7,
                todesangst: 0.8
            },
            ziel_klinik: 'Herzkatheter-Labor',
            nef_zwingend: 1.0,
            prognose: {
                gut_bei_schneller_behandlung: 0.7,
                komplikationen: 0.3
            }
        },
        
        nstemi: {
            probability: 0.18,
            name: 'Nicht-ST-Hebungs-Infarkt',
            zeitkritisch: 0.8,
            characteristics: {
                schmerz_intensität: 'stark bis mittel',
                dauer: 'variabel, oft >20 Min',
                belastungsabhängig_evtl: 0.4,
                nitro_wirkt_manchmal: 0.5
            },
            symptome: {
                druck_engegefühl: 0.9,
                schwitzen: 0.6,
                übelkeit: 0.4,
                atemnot: 0.5
            },
            ziel_klinik: 'Chest Pain Unit',
            prognose: {
                gut: 0.8,
                überwachung_nötig: 1.0
            }
        },
        
        instabile_angina: {
            probability: 0.12,
            name: 'Instabile Angina pectoris',
            characteristics: {
                schmerz_intensität: 'mittel bis stark',
                neu_aufgetreten_oder_zunehmend: 1.0,
                ruhe_angina: 0.6,
                nitro_wirkt_verzögert: 0.7
            },
            risiko_für_infarkt: 0.8,
            überwachung_zwingend: 1.0
        },
        
        stabile_angina: {
            probability: 0.08,
            name: 'Stabile Angina pectoris',
            characteristics: {
                belastungsabhängig: 1.0,
                vorhersehbar: 0.9,
                nitro_wirkt_gut: 0.9,
                bessert_in_ruhe: 0.9
            },
            bekannte_khk_meist: 0.9
        },
        
        aortendissektion: {
            probability: 0.02,
            name: 'Aortendissektion',
            hochkritisch: 1.0,
            letalität_hoch: 1.0,
            characteristics: {
                plötzlicher_vernichtungsschmerz: 0.9,
                reißend_zerreißend: 0.8,
                wandert_in_rücken: 0.7,
                blutdruckdifferenz_arme: 0.6,
                pulsdefizit: 0.5
            },
            symptome: {
                schmerz_zwischen_schulterblättern: 0.8,
                blässe: 0.7,
                schock: 0.5
            },
            nef_zwingend: 1.0,
            ziel_klinik: 'Gefäßchirurgie',
            info: 'Extrem zeitkritisch!'
        },
        
        lungenembolie: {
            probability: 0.06,
            name: 'Lungenembolie',
            zeitkritisch: 0.9,
            characteristics: {
                plötzlicher_beginn: 0.8,
                atemabhängig: 0.7,
                atemnot_im_vordergrund: 0.9,
                schmerz_stechend: 0.6
            },
            risikofaktoren: {
                immobilisation: 0.4,
                op_kürzlich: 0.3,
                lange_reise: 0.2,
                thrombose_bekannt: 0.15,
                onkologie: 0.1
            },
            symptome: {
                atemnot: 0.95,
                tachykardie: 0.8,
                husten_evtl_blutig: 0.3,
                angst: 0.7
            },
            kritisch_wenn_massiv: 0.3
        },
        
        // PULMONAL
        pneumothorax: {
            probability: 0.03,
            name: 'Pneumothorax',
            characteristics: {
                plötzlicher_stechender_schmerz: 0.9,
                einseitig: 0.9,
                atemabhängig: 0.95,
                atemnot: 0.85
            },
            risikofaktoren: {
                groß_schlank_jung: 0.6,
                copd: 0.3,
                trauma: 0.1
            },
            spannungspneu: {
                probability: 0.1,
                lebensbedrohlich: 1.0,
                schock: 0.8
            }
        },
        
        pneumonie: {
            probability: 0.05,
            name: 'Pneumonie',
            characteristics: {
                schmerz_atemabhängig: 0.8,
                fieber: 0.8,
                husten: 0.9,
                auswurf: 0.7
            },
            meist_vorgeschichte_mit_infekt: 0.8
        },
        
        perikarditis: {
            probability: 0.03,
            name: 'Herzbeutelentzündung',
            characteristics: {
                schmerz_atemabhängig: 0.9,
                besser_beim_vorbeugen: 0.7,
                schlechter_beim_liegen: 0.8,
                stechend: 0.8
            },
            oft_nach_infekt: 0.7
        },
        
        // GASTROINTESTINAL
        reflux_ösophagus: {
            probability: 0.12,
            name: 'Reflux / Ösophagitis',
            characteristics: {
                brennend: 0.8,
                nach_essen: 0.7,
                sodbrennen: 0.9,
                saures_aufstoßen: 0.8
            },
            verwechslung_mit_herzinfarkt: 0.4,
            nicht_unterscheidbar_präklinisch: 0.6
        },
        
        // MUSKULOSKELETAL
        muskuloskeletal: {
            probability: 0.1,
            name: 'Muskuloskelettale Schmerzen',
            characteristics: {
                bewegungsabhängig: 0.9,
                druckschmerz: 0.8,
                oberflächlich: 0.7,
                scharf_stechend: 0.7
            },
            oft_bei_jüngeren: 0.7,
            harmlos_aber_schmerzhaft: 1.0
        },
        
        // PSYCHOGEN
        psychogen: {
            probability: 0.06,
            name: 'Psychogene Beschwerden',
            characteristics: {
                atypisch: 0.8,
                stress_angst: 0.9,
                hyperventilation_evtl: 0.5,
                diffus: 0.7
            },
            jüngere_patienten: 0.7,
            ausschlussdiagnose: 1.0,
            trotzdem_abklären: 1.0
        }
    },
    
    // ========================================
    // 🩺 SCHMERZCHARAKTERISIERUNG (OPQRST)
    // ========================================
    schmerzcharakterisierung: {
        onset: {
            plötzlich: {
                probability: 0.4,
                ddx: ['STEMI', 'Aortendissektion', 'Lungenembolie', 'Pneumothorax'],
                info: 'Kritische Diagnosen wahrscheinlicher'
            },
            allmählich: {
                probability: 0.3,
                ddx: ['Angina', 'Pneumonie', 'Reflux']
            },
            schleichend: {
                probability: 0.3,
                ddx: ['Stabile Angina', 'Muskuloskeletal']
            }
        },
        
        provocation: {
            belastung: {
                probability: 0.35,
                ddx: ['Angina pectoris', 'Herzinsuffizienz']
            },
            atmung: {
                probability: 0.2,
                ddx: ['Pneumothorax', 'Pneumonie', 'Perikarditis', 'Muskuloskeletal']
            },
            essen: {
                probability: 0.1,
                ddx: ['Reflux', 'Ösophagitis']
            },
            bewegung: {
                probability: 0.15,
                ddx: ['Muskuloskeletal']
            },
            ruhe: {
                probability: 0.2,
                ddx: ['STEMI', 'Instabile Angina'],
                info: 'Ruhe-Angina = instabil!'
            }
        },
        
        quality: {
            drückend_engegefühl: {
                probability: 0.35,
                variations: [
                    'Druckgefühl',
                    'Engegefühl',
                    'Wie ein Schraubstock',
                    'Als ob etwas auf der Brust liegt',
                    'Elefant auf der Brust'
                ],
                ddx: ['ACS', 'Angina']
            },
            stechend: {
                probability: 0.25,
                variations: [
                    'Stechend',
                    'Messerstich',
                    'Scharf'
                ],
                ddx: ['Pneumothorax', 'Perikarditis', 'Muskuloskeletal']
            },
            brennend: {
                probability: 0.15,
                variations: ['Brennend', 'Wie Feuer'],
                ddx: ['Reflux', 'Ösophagitis']
            },
            reißend: {
                probability: 0.05,
                variations: ['Reißend', 'Zerreißend'],
                ddx: ['Aortendissektion'],
                hochkritisch: 1.0
            },
            dumpf: {
                probability: 0.2,
                variations: ['Dumpf', 'Schwer zu beschreiben'],
                ddx: ['Diverse', 'Unspezifisch']
            }
        },
        
        radiation: {
            linker_arm: {
                probability: 0.35,
                ddx: ['ACS', 'Angina'],
                info: 'Klassisches Zeichen'
            },
            beide_arme: {
                probability: 0.15,
                ddx: ['ACS'],
                schwerer_infarkt_evtl: 0.6
            },
            kiefer_hals: {
                probability: 0.2,
                ddx: ['ACS', 'Angina']
            },
            rücken_zwischen_schulterblättern: {
                probability: 0.15,
                ddx: ['Aortendissektion', 'ACS']
            },
            oberbauch: {
                probability: 0.1,
                ddx: ['Hinterwandinfarkt', 'Reflux']
            },
            keine: {
                probability: 0.05,
                info: 'Unspezifisch'
            }
        },
        
        severity: {
            scale_1_10: {
                leicht: { range: [1, 3], probability: 0.1 },
                mittel: { range: [4, 6], probability: 0.3 },
                stark: { range: [7, 9], probability: 0.4 },
                vernichtend: { range: [10, 10], probability: 0.2, info: 'STEMI, Aortendissektion' }
            }
        },
        
        time: {
            akut: {
                range: [0, 30],
                unit: 'Minuten',
                probability: 0.3,
                info: 'Sehr akut'
            },
            subakut: {
                range: [30, 240],
                unit: 'Minuten',
                probability: 0.4
            },
            länger: {
                range: [4, 24],
                unit: 'Stunden',
                probability: 0.2
            },
            chronisch: {
                range: [1, 7],
                unit: 'Tage',
                probability: 0.1,
                trotzdem_abklären: 1.0
            }
        }
    },
    
    // ========================================
    // 🩺 BEGLEITSYMPTOME
    // ========================================
    begleitsymptome: {
        vegetativ: {
            schwitzen: {
                probability: 0.6,
                variations: [
                    'schwitzt stark',
                    'Kaltschweiß',
                    'nassgeschwitzt'
                ],
                ddx: ['STEMI', 'instabile Angina']
            },
            übelkeit: {
                probability: 0.45,
                ddx: ['ACS', 'besonders Hinterwandinfarkt']
            },
            erbrechen: {
                probability: 0.2,
                ddx: ['ACS', 'Hinterwandinfarkt']
            },
            blässe: {
                probability: 0.5,
                info: 'Zeichen der Sympathikusaktivierung'
            }
        },
        
        kardiopulmonal: {
            atemnot: {
                probability: 0.6,
                severity: {
                    leicht: 0.3,
                    mittel: 0.5,
                    schwer: 0.2
                },
                ddx: ['ACS', 'Lungenembolie', 'Herzinsuffizienz', 'Pneumothorax']
            },
            herzrasen: {
                probability: 0.4,
                info: 'Tachykardie als Kompensation oder Arrhythmie'
            },
            schwindel: {
                probability: 0.3,
                ddx: ['Rhythmusstörung', 'Hypotonie', 'ACS']
            },
            synkope: {
                probability: 0.05,
                kritisch: 0.8,
                ddx: ['Massives ACS', 'Lungenembolie', 'Aortendissektion']
            }
        },
        
        psychisch: {
            todesangst: {
                probability: 0.4,
                variations: [
                    'hat Todesangst',
                    'denkt, er stirbt',
                    'große Angst'
                ],
                ddx: ['STEMI', 'Lungenembolie'],
                info: 'Ernstzunehmendes Symptom!'
            },
            unruhe: {
                probability: 0.5,
                variations: ['unruhig', 'kann nicht stillsitzen', 'hin und her']
            }
        }
    },
    
    // ========================================
    // 🧬 RISIKOFAKTOREN
    // ========================================
    risikofaktoren: {
        kardiovaskulär: {
            bekannte_khk: {
                probability: 0.3,
                risiko_erhöht: 3.0,
                info: 'Wichtigster Prädiktor'
            },
            früher_infarkt: {
                probability: 0.2,
                risiko_erhöht: 4.0,
                info: 'Sehr hohes Risiko'
            },
            diabetes: {
                probability: 0.25,
                risiko_erhöht: 2.5,
                atypische_symptome_häufiger: 0.4
            },
            hypertonie: {
                probability: 0.5,
                risiko_erhöht: 1.8
            },
            rauchen: {
                probability: 0.35,
                risiko_erhöht: 2.5,
                info: 'Besonders bei jüngeren'
            },
            hyperlipidämie: {
                probability: 0.4,
                risiko_erhöht: 2.0
            },
            familiäre_belastung: {
                probability: 0.3,
                risiko_erhöht: 1.8,
                besonders_wenn_jung: 0.7
            },
            adipositas: {
                probability: 0.35,
                risiko_erhöht: 1.5
            }
        },
        
        geschlechtsunterschiede: {
            männer: {
                typische_symptome_häufiger: 0.75,
                früher_betroffen: 0.8,
                info: 'Klassische Präsentation'
            },
            frauen: {
                atypische_symptome_häufiger: 0.5,
                variations: [
                    'Übelkeit prominent',
                    'Rückenschmerzen',
                    'Müdigkeit',
                    'Kurzatmigkeit ohne Schmerz'
                ],
                oft_übersehen: 0.3,
                info: 'Höhere Aufmerksamkeit nötig!'
            }
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        zuhause_ruhe: {
            probability: 0.5,
            info: 'Häufigster Ort'
        },
        arbeitsplatz: {
            probability: 0.2,
            stress_als_trigger: 0.6
        },
        öffentlich: {
            probability: 0.15,
            erschwerte_bedingungen: 0.7
        },
        sport: {
            probability: 0.1,
            belastungs_acs: 0.8
        },
        auto: {
            probability: 0.05,
            gefährlich: 0.9
        }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN
    // ========================================
    nachforderungen: {
        nef: {
            probability: 0.5,
            trigger_time: { min: 0, max: 120 },
            reasons: {
                verdacht_stemi: {
                    probability: 0.4,
                    funkspruch: '{callsign}, V.a. STEMI, benötigen NEF für Voranmeldung Herzkatheter, kommen.'
                },
                vital_instabil: {
                    probability: 0.3,
                    funkspruch: '{callsign}, Patient instabil, RR niedrig, benötigen NEF, kommen.'
                },
                reanimation: {
                    probability: 0.1,
                    funkspruch: '{callsign}, Reanimation, kommen!'
                },
                rhythmusstörung: {
                    probability: 0.1
                },
                komplikationen: {
                    probability: 0.1
                }
            }
        },
        
        zweiter_rtw: {
            probability: 0.05,
            reasons: ['Enge Verhältnisse', 'Komplexe Rettung', 'Personalverstärkung']
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            zunehmende_schmerzen: {
                probability: 0.15,
                trigger_time: { min: 60, max: 180 },
                change: 'Die Schmerzen werden immer schlimmer!',
                therapieversagen: 0.7
            },
            
            rhythmusstörung: {
                probability: 0.12,
                trigger_time: { min: 90, max: 240 },
                types: {
                    ventrikuläre_tachykardie: 0.4,
                    kammerflimmern: 0.3,
                    bradykardie: 0.2,
                    asystolie: 0.1
                },
                reanimation_evtl: 0.4
            },
            
            kardiogener_schock: {
                probability: 0.08,
                trigger_time: { min: 120, max: 300 },
                change: 'Patient wird immer schwächer, RR fällt!',
                kritisch: 1.0
            },
            
            bewusstlosigkeit: {
                probability: 0.1,
                trigger_time: { min: 90, max: 240 },
                change: 'Patient reagiert nicht mehr!',
                reanimationspflichtigkeit_prüfen: 1.0
            },
            
            lungenödem: {
                probability: 0.08,
                trigger_time: { min: 180, max: 360 },
                change: 'Patient bekommt keine Luft mehr, brodelt!',
                kritisch: 0.9
            }
        },
        
        besserung: {
            schmerzen_nachlassend: {
                probability: 0.3,
                trigger_time: { min: 180, max: 420 },
                outcomes: {
                    nach_nitro: {
                        probability: 0.6,
                        info: 'Nitro wirkt - evtl. Angina'
                    },
                    spontan: {
                        probability: 0.3,
                        transport_trotzdem: 1.0
                    },
                    nach_morphin: {
                        probability: 0.1
                    }
                }
            }
        },
        
        komplikationen: {
            kammerflimmern: {
                probability: 0.08,
                info: 'Häufigste Todesursache bei STEMI',
                reanimation: 1.0
            },
            mechanische_komplikationen: {
                probability: 0.02,
                types: ['Papillarmuskelabriss', 'Septumruptur', 'Wandruptur'],
                kritisch: 1.0
            }
        }
    },
    
    // ========================================
    // 🏥 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.5,
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1_stemi: {
                condition: 'STEMI im EKG',
                hospitals: ['Herzkatheter-Labor 24/7'],
                reason: 'PCI < 90 Min',
                voranmeldung_zwingend: 1.0,
                zeitkritisch: 1.0,
                info: 'Door-to-Balloon-Time!'
            },
            priorität_2_nstemi: {
                condition: 'V.a. ACS ohne ST-Hebung',
                hospitals: ['Chest Pain Unit', 'Innere mit Überwachung'],
                reason: 'Troponin, EKG-Monitoring'
            },
            priorität_3_unklare_thoraxschmerzen: {
                condition: 'Unklare Genese',
                hospitals: ['Nächstgelegen mit Innerer'],
                reason: 'Ausschlussdiagnostik'
            }
        },
        
        transport: {
            liegend: {
                probability: 0.8,
                oberkörper_hoch: 0.6
            },
            sitzend: {
                probability: 0.2,
                condition: 'Bei Atemnot besser'
            },
            sauerstoff: {
                probability: 0.6,
                indikation: 'SpO2 < 94% oder Atemnot'
            },
            monitoring: {
                ekg: 1.0,
                rr: 1.0,
                spo2: 1.0
            }
        },
        
        voranmeldung: {
            bei_stemi: {
                probability: 1.0,
                inhalte: [
                    'STEMI-Verdacht',
                    'EKG-Befund',
                    'Vitalparameter',
                    'Symptombeginn',
                    'ETA'
                ],
                info: 'Katheter-Team aktivieren!'
            },
            bei_instabilität: {
                probability: 0.8
            }
        }
    },
    
    // ========================================
    // 📊 PROTOKOLL & BEWERTUNG
    // ========================================
    protokoll: {
        tracked_data: {
            schmerz_charakteristik: 'FROM_CALL',
            ausstrahlung: 'FROM_CALL',
            dauer: 'FROM_CALL',
            begleitsymptome: 'FROM_CALL',
            risikofaktoren: 'FROM_CALL',
            nef_disponiert: 'FROM_DISPOSITION',
            outcome: 'FROM_SIMULATION'
        },
        
        bewertung: {
            kriterien: {
                opqrst_abgefragt: {
                    wichtig: 'sehr_hoch',
                    info: 'Strukturierte Schmerzanamnese essentiell',
                    punkte: [
                        'Onset - Beginn?',
                        'Provocation - Auslöser?',
                        'Quality - Qualität?',
                        'Radiation - Ausstrahlung?',
                        'Severity - Stärke?',
                        'Time - Seit wann?'
                    ]
                },
                
                risikofaktoren_erfragt: {
                    wichtig: 'hoch',
                    info: 'Wichtig für Risikostratifizierung',
                    faktoren: [
                        'Bekannte KHK?',
                        'Früherer Infarkt?',
                        'Diabetes?',
                        'Rauchen?'
                    ]
                },
                
                zeitkritische_diagnosen_erwogen: {
                    wichtig: 'kritisch',
                    info: 'STEMI, Aortendissektion, Lungenembolie',
                    bei_hinweisen_nef: 1.0
                },
                
                nef_richtig_disponiert: {
                    wichtig: 'sehr_hoch',
                    info: 'Bei V.a. ACS fast immer NEF'
                },
                
                richtige_klinik: {
                    wichtig: 'kritisch',
                    info: 'STEMI = Herzkatheter-Labor!'
                }
            },
            
            kritische_fehler: [
                'STEMI nicht erkannt',
                'Aortendissektion übersehen',
                'Kein NEF bei V.a. STEMI',
                'Falsche Zielklinik bei STEMI',
                'Zeitverlust durch unstrukturierte Anamnese'
            ],
            
            häufige_fehler: [
                'OPQRST nicht vollständig',
                'Risikofaktoren nicht erfragt',
                'Ausstrahlung nicht erfragt',
                'Begleitsymptome unzureichend erfragt',
                'Bei Frauen atypische Symptome nicht erkannt'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient mit akuten Thoraxschmerzen, V.a. ACS, Vitaldaten stabil',
            'V.a. STEMI, Patient mit Vernichtungsschmerz, NEF vor Ort',
            'Thoraxschmerzen seit 2 Stunden, Nitro gegeben, Besserung',
            'Akute Brustschmerzen, Ausstrahlung linker Arm, vegetative Begleitsymptome'
        ],
        
        voranmeldung_stemi: [
            '{hospital}, hier {callsign}, STEMI-Voranmeldung',
            'Männlich, {alter} Jahre, akute Thoraxschmerzen seit {dauer}',
            'EKG: ST-Hebungen in {ableitungen}',
            'RR {systolisch}/{diastolisch}, HF {herzfrequenz}, SpO2 {sauerstoff}%',
            'ETA {eta} Minuten, bitte Katheter-Team aktivieren, kommen.'
        ],
        
        komplikationen: [
            '{callsign}, Patient entwickelt Rhythmusstörung, kommen',
            '{callsign}, Patient bewusstlos, beginnen Reanimation, kommen',
            '{callsign}, Vitaldaten verschlechtern sich, RR fällt, kommen'
        ]
    },
    
    // ========================================
    // 🎯 SPECIAL - THORAXSCHMERZ-SPEZIFISCH
    // ========================================
    special: {
        // Typische Szenarien
        szenarien: {
            klassischer_stemi: {
                verlauf: [
                    'Vernichtungsschmerz',
                    'Ausstrahlung linker Arm',
                    'Schwitzen, Übelkeit',
                    'Todesangst',
                    'EKG: ST-Hebungen',
                    'Herzkatheter-Labor < 90 Min'
                ],
                häufigkeit: 0.15,
                zeitkritisch: 1.0,
                prognose: 'gut bei schneller PCI'
            },
            
            atypischer_infarkt_frauen: {
                verlauf: [
                    'Übelkeit prominent',
                    'Rückenschmerzen',
                    'Müdigkeit',
                    'Kurzatmigkeit',
                    'Oft unterschätzt!'
                ],
                häufigkeit: 0.08,
                gefahr_der_fehleinschätzung: 0.5
            },
            
            stille_ischämie_diabetiker: {
                verlauf: [
                    'Atemnot ohne Schmerz',
                    'Schwäche',
                    'Verwirrtheit',
                    'Diabetische Neuropathie'
                ],
                häufigkeit: 0.05,
                oft_übersehen: 0.6
            },
            
            aortendissektion_drama: {
                verlauf: [
                    'Plötzlicher Vernichtungsschmerz',
                    'Zwischen Schulterblättern',
                    'Reißend, wandernd',
                    'Hochkritisch!'
                ],
                häufigkeit: 0.02,
                letalität: 0.8,
                zeitkritisch: 1.0
            },
            
            panikattacke_vs_herzinfarkt: {
                info: 'Schwer zu unterscheiden präklinisch!',
                gemeinsam: ['Brustenge', 'Atemnot', 'Angst', 'Schwitzen'],
                unterschiede: [
                    'Panik: meist jünger, Hyperventilation',
                    'Infarkt: Risikofaktoren, Ausstrahlung'
                ],
                regel: 'IMMER wie Infarkt behandeln!',
                ausschluss_nur_in_klinik: 1.0
            }
        },
        
        // Fehlerquellen
        fehlerquellen: {
            atypische_präsentation: {
                probability: 0.25,
                groups: ['Frauen', 'Diabetiker', 'Ältere'],
                info: 'Hohe Wachsamkeit nötig!'
            },
            bagatellisierung: {
                probability: 0.15,
                info: 'Patient spielt Symptome runter',
                gefährlich: 0.8
            },
            fokus_auf_reflux: {
                probability: 0.1,
                info: 'Reflux und Infarkt nicht unterscheidbar!',
                immer_abklären: 1.0
            }
        },
        
        // Time-critical Pathways
        zeitfenster: {
            stemi: {
                golden_hour: '<90 Min Door-to-Balloon',
                jede_minute_zählt: 1.0,
                voranmeldung_beschleunigt: 0.3,
                info: 'Zeit = Myokard!'
            },
            aortendissektion: {
                sofortige_diagnose: 1.0,
                gefäßchirurgie_zwingend: 1.0
            },
            lungenembolie: {
                bei_instabilität_lysetherapie: 1.0
            }
        },
        
        // Learning Points
        learning_points: [
            'OPQRST strukturiert abfragen',
            'Bei V.a. ACS immer NEF disponieren',
            'Frauen und Diabetiker: Atypische Symptome beachten!',
            'STEMI = Herzkatheter-Labor voranmelden',
            'Reißender Schmerz zwischen Schulterblättern = Aortendissektion',
            'Reflux und Infarkt nicht unterscheidbar - immer abklären',
            'Zeit = Myokard - schnell handeln!'
        ]
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BRUSTSCHMERZEN_TEMPLATE };
}
