// =========================================================================================
// BAUCHSCHMERZEN TEMPLATE V2.0 - Viele DD, akutes Abdomen erkennen!
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const BAUCHSCHMERZEN_TEMPLATE = {
    
    id: 'bauchschmerzen',
    kategorie: 'rd',
    stichwort: 'Bauchschmerzen akut',
    weight: 3,  // Häufig!
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            patient_selbst_gequaält: {
                probability: 0.35,
                speech_pattern: 'gequaält, stöhnt',
                variations: [
                    'Ich habe starke Bauchschmerzen! *stöhnt*',
                    'Mein Bauch tut so weh... ich kann nicht mehr!',
                    'Es tut so weh im Bauch!',
                    'Ich hab Krämpfe! *stöhnt*',
                    'Der Bauch... ich halt das nicht aus!'
                ],
                characteristics: {
                    unterbricht_sich_vor_schmerz: 0.6,
                    stöhnt_hörbar: 0.7,
                    kurzatmig: 0.4
                }
            },
            
            patient_selbst_ruhig: {
                probability: 0.15,
                speech_pattern: 'beschreibt genau',
                variations: [
                    'Ich habe seit Stunden Bauchschmerzen',
                    'Die Schmerzen sind im rechten Unterbauch',
                    'Mir ist übel und der Bauch tut weh'
                ],
                characteristics: {
                    kann_genau_lokalisieren: 0.8,
                    beschreibt_detailliert: 0.9
                }
            },
            
            angehöriger_besorgt: {
                probability: 0.35,
                speech_pattern: 'besorgt, beobachtend',
                variations: [
                    'Meine Frau hat starke Bauchschmerzen und erbricht!',
                    'Er krümmt sich vor Schmerzen!',
                    'Sie fasst sich an den Bauch und weint!',
                    'Er liegt da und hält sich den Bauch!',
                    'Sie hat heftige Bauchkrämpfe!'
                ],
                characteristics: {
                    sieht_schmerzreaktion: 0.9,
                    beschreibt_begleitsymptome: 0.8
                }
            },
            
            angehöriger_kind: {
                probability: 0.08,
                speech_pattern: 'besorgt, elterlich',
                variations: [
                    'Mein Kind hat starke Bauchschmerzen!',
                    'Sie weint und fasst sich an den Bauch!',
                    'Er hat Bauchweh und Fieber!'
                ],
                condition: 'patient_kind',
                info: 'Eltern oft besorgter'
            },
            
            hausarzt_überweisung: {
                probability: 0.07,
                speech_pattern: 'ärztlich, präzise',
                variations: [
                    'Hausarzt Dr. {name}, Patient mit akutem Abdomen',
                    'V.a. Appendizitis, Transport dringend',
                    'Akute Cholezystitis, Chirurgie erforderlich',
                    'Akutes Abdomen, Abwehrspannung, bitte RTW'
                ],
                characteristics: {
                    verdachtsdiagnose_genannt: 0.9,
                    untersuchungsbefunde: 0.8
                }
            }
        },
        
        dynamik: {
            verschlechterung: {
                probability: 0.2,
                trigger_time: { min: 60, max: 240 },
                variations: [
                    'Die Schmerzen werden schlimmer!',
                    'Er ist jetzt ganz blass!',
                    'Sie reagiert kaum noch!',
                    'Der Bauch ist jetzt ganz hart!'
                ],
                effects: {
                    peritonismus: 0.4,
                    schock: 0.3,
                    bewusstlosigkeit: 0.1,
                    unstillbares_erbrechen: 0.2
                }
            },
            
            besserung: {
                probability: 0.1,
                trigger_time: { min: 180, max: 420 },
                variations: [
                    'Es wird etwas besser',
                    'Die Schmerzen lassen nach'
                ],
                info: 'Selten, Transport trotzdem nötig'
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.45,
            female: 0.55  // Frauen wegen gynäkologischer Ursachen etwas häufiger
        },
        
        alter: {
            distribution: 'age_dependent_causes',
            ranges: {
                kinder: {
                    range: [5, 15],
                    probability: 0.15,
                    typical_causes: ['Appendizitis', 'Gastroenteritis', 'Invagination'],
                    besonderheiten: 'Lokalisierung oft schwierig'
                },
                junge_erwachsene: {
                    range: [16, 35],
                    probability: 0.3,
                    typical_causes: ['Appendizitis', 'Gastroenteritis', 'Gynäkologisch', 'Nierensteine']
                },
                mittleres_alter: {
                    range: [36, 60],
                    probability: 0.35,
                    typical_causes: ['Gallensteine', 'Pankreatitis', 'Divertikulitis', 'Darmverschluss']
                },
                ältere: {
                    range: [61, 85],
                    probability: 0.2,
                    typical_causes: ['Darmverschluss', 'Divertikulitis', 'Mesenterialinfarkt', 'AAA'],
                    komplikationen_häufiger: 0.7
                }
            }
        },
        
        bewusstseinszustand: {
            wach_orientiert: {
                probability: 0.8,
                info: 'Kann Schmerzen lokalisieren'
            },
            unruhig_gequaält: {
                probability: 0.12,
                info: 'Vor Schmerzen unruhig, wälzt sich'
            },
            apathisch: {
                probability: 0.05,
                info: 'Bei schwerem Krankheitsbild',
                kritisch: 0.7
            },
            bewusstlos: {
                probability: 0.03,
                kritisch: 1.0,
                ursachen: ['Schock', 'Sepsis', 'AAA-Ruptur']
            }
        }
    },
    
    // ========================================
    // 🤰 DIFFERENTIALDIAGNOSEN
    // ========================================
    differentialdiagnosen: {
        // CHIRURGISCH - ZEITKRITISCH
        appendizitis: {
            probability: 0.15,
            name: 'Appendizitis (Blinddarmentzündung)',
            zeitkritisch: 0.8,
            characteristics: {
                beginn_periumbilikal: 0.7,
                wanderung_rechter_unterbauch: 0.8,
                mcburney_punkt: 0.9,
                klopfschmerz: 0.7,
                loslass_schmerz: 0.8
            },
            symptome: {
                übelkeit: 0.8,
                erbrechen: 0.6,
                fieber: 0.6,
                appetitlosigkeit: 0.9
            },
            alter_peak: [10, 30],
            komplikation_perforation: 0.15,
            op_zwingend: 1.0,
            info: 'Klassische Trias: Schmerz + Übelkeit + Fieber'
        },
        
        cholezystitis: {
            probability: 0.12,
            name: 'Gallenblasenentzündung',
            characteristics: {
                schmerz_rechter_oberbauch: 0.95,
                ausstrahlung_rechte_schulter: 0.6,
                murphy_zeichen: 0.8,
                nach_fettiger_mahlzeit: 0.7,
                kolikartig_oder_dauerschmerz: 0.8
            },
            symptome: {
                übelkeit: 0.9,
                erbrechen: 0.7,
                fieber: 0.6
            },
            risikofaktoren: {
                gallensteine_bekannt: 0.6,
                weiblich: 0.7,
                übergewicht: 0.6,
                '4_Fs': 'Female, Forty, Fair, Fat'
            },
            komplikation_perforation: 0.05,
            meist_op_nötig: 0.8
        },
        
        pankreatitis: {
            probability: 0.08,
            name: 'Bauchspeicheldrüsenentzündung',
            schwer: 1.0,
            characteristics: {
                schmerz_oberbauch_gürtelörmig: 0.8,
                ausstrahlung_rücken: 0.9,
                plötzlich_heftig: 0.8,
                besserung_beim_vorbeugen: 0.6
            },
            symptome: {
                übelkeit_erbrechen: 0.95,
                meteorismus: 0.7,
                schock: 0.3
            },
            ursachen: {
                alkohol: 0.35,
                gallensteine: 0.35,
                idiopathisch: 0.2,
                andere: 0.1
            },
            intensiv_oft_nötig: 0.5,
            letalität: 0.1,
            info: 'Sehr schmerzhaft, kann lebensbedrohlich sein!'
        },
        
        aaa_ruptur: {
            probability: 0.02,
            name: 'Aortenaneurysma-Ruptur',
            hochkritisch: 1.0,
            letalität: 0.8,
            characteristics: {
                plötzlicher_vernichtungsschmerz: 0.9,
                ausstrahlung_rücken_flanken: 0.8,
                pulsierende_masse: 0.7,
                schock: 0.8
            },
            alter_meist: '>65',
            risikofaktoren: {
                rauchen: 0.8,
                hypertonie: 0.7,
                männlich: 0.85
            },
            nef_zwingend: 1.0,
            sofort_op: 1.0,
            info: 'Extrem zeitkritisch!'
        },
        
        perforation: {
            probability: 0.05,
            name: 'Hohlorgan-Perforation',
            hochkritisch: 1.0,
            characteristics: {
                plötzlicher_schmerz: 0.9,
                bretthartes_abdomen: 0.9,
                peritonismus: 1.0,
                schock: 0.6
            },
            ursachen: {
                ulkus: 0.4,
                appendizitis: 0.2,
                divertikel: 0.2,
                tumor: 0.1,
                trauma: 0.1
            },
            sofort_op: 1.0
        },
        
        darmverschluss: {
            probability: 0.08,
            name: 'Ileus (Darmverschluss)',
            zeitkritisch: 0.9,
            characteristics: {
                kolikartige_schmerzen: 0.8,
                stuhl_windverhalt: 0.9,
                meteorismus: 0.9,
                hochgestellte_darmgeräusche_dann_stille: 0.7
            },
            symptome: {
                übelkeit_erbrechen: 0.95,
                erbrechen_kotig: 0.4,
                kein_stuhlgang: 0.9
            },
            ursachen: {
                verwachsungen: 0.4,
                tumor: 0.2,
                hernie: 0.15,
                andere: 0.25
            },
            meist_op_nötig: 0.8
        },
        
        // GYNÄKOLOGISCH
        extrauteringravidität: {
            probability: 0.04,
            name: 'Eileiterschwangerschaft',
            nur_frauen: 1.0,
            hochkritisch: 1.0,
            characteristics: {
                einseitiger_unterbauchschmerz: 0.8,
                ausgebliebene_periode: 0.8,
                schmierblutung: 0.6,
                bei_ruptur_schock: 0.9
            },
            alter_peak: [20, 35],
            risikofaktoren: {
                frühere_eug: 0.3,
                iud: 0.2,
                entzündungen: 0.3
            },
            ruptur: {
                probability: 0.3,
                lebensbedrohlich: 1.0,
                schock: 0.9
            },
            sofort_op: 1.0,
            info: 'Bei geschlechtsfähigen Frauen IMMER daran denken!'
        },
        
        ovarialtorsion: {
            probability: 0.03,
            name: 'Eierstockdrehung',
            nur_frauen: 1.0,
            zeitkritisch: 1.0,
            characteristics: {
                plötzlicher_stechender_schmerz: 0.9,
                einseitig_unterbauch: 0.95,
                übelkeit_erbrechen: 0.8,
                intermittierend_evtl: 0.4
            },
            jüngere_frauen: 0.7,
            sofort_op_nötig: 1.0,
            info: 'Zeitfenster 4-8h für Ovar-Erhalt!'
        },
        
        pelvic_inflammatory_disease: {
            probability: 0.05,
            name: 'Unterleibsentzündung (PID)',
            nur_frauen: 1.0,
            characteristics: {
                beidseitiger_unterbauchschmerz: 0.7,
                fieber: 0.6,
                ausfluss: 0.7,
                schmerzen_beim_geschlechtsverkehr: 0.6
            },
            meist_antibiotika: 0.9
        },
        
        // NEPHROLOGISCH
        nierensteine: {
            probability: 0.1,
            name: 'Nierenkolik',
            characteristics: {
                kolikartig_wellenhaft: 0.95,
                flanke_ausstrahlung_leiste: 0.9,
                sehr_stark: 0.9,
                unruhig_wälzt_sich: 0.9
            },
            symptome: {
                übelkeit: 0.8,
                blut_im_urin: 0.7,
                harndrang: 0.6
            },
            männer_häufiger: 0.7,
            meist_konservativ: 0.7,
            sehr_schmerzhaft: 1.0
        },
        
        pyelonephritis: {
            probability: 0.06,
            name: 'Nierenbeckenentzündung',
            characteristics: {
                flankenschmerz: 0.9,
                fieber_schüttelfrost: 0.9,
                klopfschmerz: 0.8
            },
            symptome: {
                dysurie: 0.8,
                pollakisurie: 0.7
            },
            frauen_häufiger: 0.8
        },
        
        // GASTROENTEROLOGISCH
        gastroenteritis: {
            probability: 0.15,
            name: 'Magen-Darm-Infekt',
            characteristics: {
                krampfartige_schmerzen: 0.8,
                diffus: 0.7,
                wellenförmig: 0.8
            },
            symptome: {
                durchfall: 0.95,
                erbrechen: 0.8,
                fieber: 0.5
            },
            meist_harmlos: 0.9,
            dehydratation_risiko: 0.3,
            info: 'Häufigste Ursache, meist selbstlimitierend'
        },
        
        divertikulitis: {
            probability: 0.08,
            name: 'Divertikelentzündung',
            characteristics: {
                linker_unterbauch: 0.8,
                dauerschmerz: 0.8,
                lokale_abwehrspannung: 0.7
            },
            symptome: {
                fieber: 0.6,
                verstopfung: 0.6,
                blut_im_stuhl_evtl: 0.2
            },
            ältere_patienten: 0.8,
            komplikation_perforation: 0.1
        },
        
        mesenterialinfarkt: {
            probability: 0.02,
            name: 'Darminfarkt',
            hochkritisch: 1.0,
            letalität: 0.7,
            characteristics: {
                plötzlicher_heftiger_schmerz: 0.8,
                misverhältnis_schmerz_befund: 0.9,
                blutige_durchfälle: 0.6
            },
            ältere_mit_vorhofsflimmern: 0.8,
            sofort_op: 1.0,
            info: 'Hohe Letalität!'
        }
    },
    
    // ========================================
    // 🖍️ SCHMERZLOKALISATION (9 Quadranten)
    // ========================================
    schmerzlokalisation: {
        rechter_oberbauch: {
            probability: 0.2,
            ddx: ['Cholezystitis', 'Gallensteine', 'Leberabszess', 'Hepatitis'],
            murphy_zeichen_prüfen: 1.0
        },
        
        epigastrium_mitte: {
            probability: 0.15,
            ddx: ['Pankreatitis', 'Ulkus', 'Gastritis', 'Myokardinfarkt'],
            info: 'CAVE: Hinterwandinfarkt!'
        },
        
        linker_oberbauch: {
            probability: 0.08,
            ddx: ['Milzinfarkt', 'Milzruptur', 'Pankreatitis']
        },
        
        rechte_flanke: {
            probability: 0.1,
            ddx: ['Nierensteine', 'Pyelonephritis', 'Appendizitis retrozoekal']
        },
        
        periumbilikal: {
            probability: 0.1,
            ddx: ['Frühe Appendizitis', 'Darmverschluss', 'Mesenterialinfarkt', 'AAA'],
            info: 'Appendizitis beginnt oft periumbilikal!'
        },
        
        linke_flanke: {
            probability: 0.08,
            ddx: ['Nierensteine', 'Pyelonephritis']
        },
        
        rechter_unterbauch: {
            probability: 0.2,
            ddx: ['Appendizitis', 'Ovarialzyste', 'Extrauteringravidität', 'Harnleiterstein'],
            mcburney_punkt: 1.0,
            info: 'Klassische Appendizitis-Lokalisation!'
        },
        
        suprapubisch_mitte: {
            probability: 0.05,
            ddx: ['Blasenentzündung', 'Harnverhalt', 'Uterus']
        },
        
        linker_unterbauch: {
            probability: 0.15,
            ddx: ['Divertikulitis', 'Ovarialzyste', 'Extrauteringravidität', 'Harnleiterstein'],
            info: 'Divertikulitis meist links!'
        },
        
        diffus_ganzer_bauch: {
            probability: 0.25,
            ddx: ['Gastroenteritis', 'Peritonitis', 'Darmverschluss'],
            info: 'Unspezifisch, breite DD'
        }
    },
    
    // ========================================
    // 🩺 SCHMERZCHARAKTER
    // ========================================
    schmerzcharakter: {
        kolikartig: {
            probability: 0.25,
            beschreibung: 'Wellenhaft, kommt und geht',
            variations: ['Wie Wehen', 'Kommt in Wellen', 'Krämpfe'],
            ddx: ['Nierensteine', 'Gallensteine', 'Darmverschluss'],
            patient_unruhig: 0.9
        },
        
        krampfartig: {
            probability: 0.25,
            beschreibung: 'Verkrampft, zusammenziehend',
            ddx: ['Gastroenteritis', 'Darmkrämpfe'],
            besserung_nach_stuhlgang_evtl: 0.4
        },
        
        stechend_scharf: {
            probability: 0.2,
            beschreibung: 'Messerstich, scharf',
            ddx: ['Perforation', 'Ovarialtorsion', 'Pneumothorax'],
            plötzlicher_beginn: 0.8
        },
        
        brennend: {
            probability: 0.1,
            beschreibung: 'Brennend',
            ddx: ['Gastritis', 'Ulkus', 'Reflux']
        },
        
        dumpf_drückend: {
            probability: 0.15,
            beschreibung: 'Dumpf, drückend',
            ddx: ['Appendizitis', 'Divertikulitis', 'Entzündungen'],
            dauerschmerz: 0.8
        },
        
        vernichtend: {
            probability: 0.05,
            beschreibung: 'Vernichtungsschmerz',
            ddx: ['AAA-Ruptur', 'Perforation', 'Mesenterialinfarkt', 'Pankreatitis'],
            hochkritisch: 1.0
        }
    },
    
    // ========================================
    // 🩺 BEGLEITSYMPTOME
    // ========================================
    begleitsymptome: {
        gastrointestinal: {
            übelkeit: {
                probability: 0.7,
                info: 'Sehr häufig bei abdominellen Beschwerden'
            },
            erbrechen: {
                probability: 0.5,
                types: {
                    galle: 0.3,
                    mageninhalt: 0.6,
                    kotig: { probability: 0.1, ddx: 'Darmverschluss', kritisch: 1.0 }
                }
            },
            durchfall: {
                probability: 0.35,
                types: {
                    wässrig: { probability: 0.6, ddx: 'Gastroenteritis' },
                    blutig: { probability: 0.2, ddx: 'Colitis, Divertikel', kritisch: 0.8 },
                    schleimig: { probability: 0.2, ddx: 'Entzündung' }
                }
            },
            verstopfung: {
                probability: 0.2,
                ddx: ['Darmverschluss', 'Obstipation']
            },
            meteorismus: {
                probability: 0.3,
                info: 'Aufgeblähter Bauch',
                ddx: ['Darmverschluss', 'Pankreatitis']
            },
            stuhl_windverhalt: {
                probability: 0.1,
                ddx: 'Darmverschluss',
                kritisch: 0.9
            }
        },
        
        systemisch: {
            fieber: {
                probability: 0.3,
                ranges: {
                    subfebril: { range: [37.5, 38.0], probability: 0.4 },
                    fieber: { range: [38.0, 39.5], probability: 0.5 },
                    hohes_fieber: { range: [39.5, 41.0], probability: 0.1, kritisch: 0.7 }
                },
                ddx: ['Appendizitis', 'Cholezystitis', 'Pyelonephritis', 'PID', 'Divertikulitis']
            },
            schüttelfrost: {
                probability: 0.15,
                ddx: ['Pyelonephritis', 'Sepsis', 'Cholangitis'],
                ernst: 0.8
            },
            schwäche: {
                probability: 0.4,
                bei_blutung_oder_sepsis: 0.8
            }
        },
        
        urogenital: {
            dysurie: {
                probability: 0.15,
                ddx: ['Harnwegsinfekt', 'Nierensteine']
            },
            blut_im_urin: {
                probability: 0.1,
                ddx: ['Nierensteine', 'Blasenkrebs', 'Trauma']
            },
            ausfluss: {
                probability: 0.08,
                nur_frauen: 1.0,
                ddx: ['PID', 'Vaginitis']
            }
        },
        
        gynäkologisch: {
            vaginale_blutung: {
                probability: 0.1,
                nur_frauen: 1.0,
                ddx: ['Extrauteringravidität', 'Abort', 'Zyklusstörung'],
                bei_schwangerschaft_kritisch: 0.9
            },
            ausgebliebene_periode: {
                probability: 0.08,
                nur_frauen: 1.0,
                schwangerschaftstest_wichtig: 1.0,
                ddx: 'Extrauteringravidität'
            }
        }
    },
    
    // ========================================
    // 🚨 AKUTES ABDOMEN & RED FLAGS
    // ========================================
    akutes_abdomen: {
        definition: 'Lebensbedrohlicher Zustand, sofortige chirurgische Abklärung!',
        
        leitsymptome: {
            abwehrspannung: {
                description: 'Bauchdecke gespannt, brettharte Abdominalmuskulatur',
                kritisch: 1.0,
                ddx: ['Perforation', 'Peritonitis']
            },
            loslass_schmerz: {
                description: 'Schmerz beim loslassen stärker als beim Drücken',
                info: 'Blumberg-Zeichen',
                peritonismus: 1.0
            },
            schock: {
                description: 'RR niedrig, Tachykardie, blass, kaltschweißig',
                lebensbedrohlich: 1.0,
                ursachen: ['AAA-Ruptur', 'Perforation', 'Blutung']
            },
            brettharter_bauch: {
                description: 'Défense musculäre',
                perforation_wahrscheinlich: 0.9
            }
        },
        
        red_flags: {
            plötzlicher_vernichtungsschmerz: {
                probability: 0.1,
                ddx: ['AAA-Ruptur', 'Perforation', 'Mesenterialinfarkt'],
                hochkritisch: 1.0
            },
            schock_zeichen: {
                probability: 0.08,
                lebensbedrohlich: 1.0
            },
            blutiges_erbrechen: {
                probability: 0.05,
                ddx: ['Ulkusblutung', 'Varizen'],
                kritisch: 0.9
            },
            blutige_stühle: {
                probability: 0.08,
                ddx: ['Divertikel', 'Colitis', 'Tumor', 'Mesenterialinfarkt'],
                kritisch: 0.8
            },
            ausgebliebene_periode_bei_schmerz: {
                probability: 0.06,
                nur_frauen: 1.0,
                eug_ausschliessen: 1.0
            },
            hohes_fieber_mit_schock: {
                probability: 0.05,
                sepsis: 0.9,
                kritisch: 1.0
            }
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        zuhause: {
            probability: 0.75,
            address_types: ['residential', 'apartment']
        },
        arbeitsplatz: {
            probability: 0.12,
            address_types: ['office', 'industrial']
        },
        öffentlich: {
            probability: 0.08,
            address_types: ['public_place', 'restaurant']
        },
        arztpraxis: {
            probability: 0.05,
            hausarzt_überweisung: 0.9
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
                akutes_abdomen: {
                    probability: 0.4,
                    funkspruch: '{callsign}, akutes Abdomen, Patient instabil, benötigen NEF, kommen.'
                },
                schock: {
                    probability: 0.3,
                    funkspruch: '{callsign}, Patient im Schock, RR abgefallen, NEF angefordert, kommen.'
                },
                aaa_verdacht: {
                    probability: 0.15,
                    funkspruch: '{callsign}, V.a. AAA-Ruptur, Patient kritisch, NEF dringend, kommen.'
                },
                bewusstlosigkeit: {
                    probability: 0.1
                },
                reanimation: {
                    probability: 0.05
                }
            }
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            peritonismus: {
                probability: 0.15,
                trigger_time: { min: 120, max: 360 },
                change: 'Der Bauch ist jetzt ganz hart!',
                info: 'Perforation/Peritonitis',
                akutes_abdomen: 1.0
            },
            
            schock: {
                probability: 0.1,
                trigger_time: { min: 90, max: 240 },
                change: 'Patient ist jetzt ganz blass und schwächlich!',
                kritisch: 1.0,
                ursachen: ['Blutung', 'Sepsis', 'AAA']
            },
            
            sepsis: {
                probability: 0.08,
                trigger_time: { min: 180, max: 480 },
                change: 'Hohes Fieber, Patient verwirrt!',
                kritisch: 1.0
            },
            
            bewusstlosigkeit: {
                probability: 0.05,
                trigger_time: { min: 120, max: 300 },
                change: 'Patient reagiert nicht mehr!',
                reanimation_evtl: 0.2
            }
        },
        
        besserung: {
            probability: 0.1,
            info: 'Selten bei akuten Bauchschmerzen',
            transport_trotzdem: 1.0
        },
        
        komplikationen: {
            perforation: {
                probability: 0.1,
                aus: ['Appendizitis', 'Divertikulitis', 'Ulkus'],
                peritonitis: 1.0,
                sofort_op: 1.0
            },
            blutung: {
                probability: 0.08,
                quellen: ['Ulkus', 'Varizen', 'AAA', 'Trauma', 'EUG'],
                schock: 0.7
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
            priorität_1_akutes_abdomen: {
                condition: 'Akutes Abdomen, Schock, AAA',
                hospitals: ['Chirurgie mit Gefäßchirurgie'],
                reason: 'Sofortige OP evtl. nötig',
                voranmeldung: 1.0
            },
            priorität_2_chirurgisch: {
                condition: 'V.a. Appendizitis, Cholezystitis, Ileus',
                hospitals: ['Chirurgie'],
                reason: 'OP wahrscheinlich'
            },
            priorität_3_gynäkologisch: {
                condition: 'Gynäkologischer Notfall',
                hospitals: ['Gynäkologie mit OP'],
                nur_frauen: 1.0
            },
            priorität_4_standard: {
                condition: 'Unklare Genese',
                hospitals: ['Nächstgelegen mit Chirurgie'],
                reason: 'Abklärung'
            }
        },
        
        transport: {
            lagerung: {
                rückenlage_beine_angewinkelt: {
                    probability: 0.7,
                    info: 'Bauchdeckenentspannung'
                },
                seitenlage: {
                    probability: 0.2,
                    bei_erbrechen: 1.0
                },
                schocklage: {
                    probability: 0.1,
                    bei_schock: 1.0
                }
            },
            nüchtern_halten: {
                probability: 1.0,
                info: 'NIL PER OS - wegen evtl. OP!'
            }
        },
        
        voranmeldung: {
            bei_akutem_abdomen: 1.0,
            bei_gyn_notfall: 0.9,
            inhalte: [
                'Schmerzlokalisation',
                'Schmerzcharakter',
                'Abwehrspannung?',
                'Vitalparameter',
                'Schwangerschaft?'
            ]
        }
    },
    
    // ========================================
    // 📊 PROTOKOLL & BEWERTUNG
    // ========================================
    protokoll: {
        tracked_data: {
            schmerzlokalisation: 'FROM_CALL',
            schmerzcharakter: 'FROM_CALL',
            dauer: 'FROM_CALL',
            begleitsymptome: 'FROM_CALL',
            akutes_abdomen_erkannt: 'FROM_ASSESSMENT',
            richtige_klinik: 'FROM_DISPOSITION',
            outcome: 'FROM_SIMULATION'
        },
        
        bewertung: {
            kriterien: {
                schmerzlokalisation_erfragt: {
                    wichtig: 'sehr_hoch',
                    info: 'Wo genau tut es weh? Wichtigste Frage!',
                    quadranten: 1.0
                },
                
                schmerzcharakter_erfragt: {
                    wichtig: 'hoch',
                    info: 'Kolikartig? Stechend? Krampfartig?'
                },
                
                begleitsymptome_abgefragt: {
                    wichtig: 'hoch',
                    fragen: [
                        'Übelkeit/Erbrechen?',
                        'Durchfall?',
                        'Fieber?',
                        'Blut im Stuhl?',
                        'Letzter Stuhlgang?'
                    ]
                },
                
                gyn_anamnese_bei_frauen: {
                    wichtig: 'kritisch',
                    info: 'Letzte Periode? Schwanger?',
                    eug_ausschliessen: 1.0
                },
                
                akutes_abdomen_erkannt: {
                    wichtig: 'kritisch',
                    info: 'Abwehrspannung? Brettharter Bauch? Schock?',
                    bei_ja_nef: 1.0
                },
                
                zeitkritische_diagnosen_erwogen: {
                    wichtig: 'kritisch',
                    diagnosen: ['AAA', 'Perforation', 'EUG', 'Mesenterialinfarkt']
                }
            },
            
            kritische_fehler: [
                'AAA-Ruptur nicht erkannt',
                'Akutes Abdomen übersehen',
                'Extrauteringravidität nicht bedacht',
                'Kein NEF bei akutem Abdomen',
                'Schmerzlokalisation nicht erfragt',
                'Bei Frauen keine gyn. Anamnese'
            ],
            
            häufige_fehler: [
                'Schmerzcharakter unzureichend',
                'Begleitsymptome nicht vollständig',
                'Letzte Periode nicht erfragt',
                'Stuhlgang nicht erfragt',
                'Fieber nicht erfragt'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient mit akuten Bauchschmerzen, Schmerzen {lokalisation}',
            'V.a. Appendizitis, Schmerzen rechter Unterbauch, McBurney-Punkt druckschmerzhaft',
            'Akutes Abdomen, Abwehrspannung, Patient instabil',
            'Bauchschmerzen mit Erbrechen, V.a. Gastroenteritis',
            'Kolikartige Schmerzen Flanke, V.a. Nierenkolik'
        ],
        
        voranmeldung_akutes_abdomen: [
            '{hospital}, hier {callsign}, Voranmeldung akutes Abdomen',
            '{geschlecht}, {alter} Jahre, akute Bauchschmerzen seit {dauer}',
            'Abwehrspannung, brettharter Bauch',
            'RR {systolisch}/{diastolisch}, HF {herzfrequenz}',
            'V.a. {diagnose}, chirurgische Abklärung dringend',
            'ETA {eta} Minuten, kommen.'
        ],
        
        komplikationen: [
            '{callsign}, Patient entwickelt Schock, RR fällt, kommen',
            '{callsign}, akutes Abdomen, Abwehrspannung, Patient kritisch, kommen'
        ]
    },
    
    // ========================================
    // 🎯 SPECIAL - BAUCHSCHMERZ-SPEZIFISCH
    // ========================================
    special: {
        szenarien: {
            klassische_appendizitis: {
                verlauf: [
                    'Schmerz beginnt periumbilikal',
                    'Wandert nach rechts unten',
                    'Übelkeit, Appetitlosigkeit',
                    'Fieber 38°C',
                    'McBurney-Punkt druckschmerzhaft',
                    'OP innerhalb 24h'
                ],
                häufigkeit: 0.15,
                prognose: 'gut bei rechtzeitiger OP'
            },
            
            aaa_ruptur_drama: {
                verlauf: [
                    'Plötzlicher Vernichtungsschmerz',
                    'Ausstrahlung Rücken',
                    'Schock',
                    'Pulsierende Masse tastbar',
                    'Sofort-OP',
                    'Letalität 80%'
                ],
                häufigkeit: 0.02,
                hochkritisch: 1.0
            },
            
            extrauteringravidität: {
                verlauf: [
                    'Junge Frau, Periode überfällig',
                    'Einseitige Unterbauchschmerzen',
                    'Schmierblutung',
                    'Bei Ruptur: Schock',
                    'Sofort-OP'
                ],
                häufigkeit: 0.04,
                nur_frauen: 1.0,
                info: 'IMMER bei geschlechtsfähigen Frauen daran denken!'
            },
            
            nierenkolik: {
                verlauf: [
                    'Wellenförmige Kolik',
                    'Flanke → Leiste',
                    'Patient unruhig, wälzt sich',
                    'Sehr schmerzhaft',
                    'Hämaturie',
                    'Meist konservativ'
                ],
                häufigkeit: 0.1,
                sehr_schmerzhaft: 1.0
            }
        },
        
        pädiatrie: {
            besonderheiten: [
                'Lokalisierung oft schwierig',
                'Invagination bei Säuglingen',
                'Appendizitis häufig bei Kindern',
                'Schneller krank, aber auch schneller gesund'
            ],
            kommunikation: [
                'Kind weint, fasst sich an Bauch',
                'Eltern oft besorgter als nötig',
                'Spielverhalten beobachten'
            ]
        },
        
        learning_points: [
            'Schmerzlokalisation = wichtigste Info!',
            'Bei Frauen IMMER gyn. Anamnese (Periode? Schwanger?)',
            'Akutes Abdomen = Abwehrspannung + Schock',
            'AAA-Ruptur = älterer Mann + Vernichtungsschmerz + Rückenschmerz',
            'Appendizitis beginnt periumbilikal, wandert rechts',
            'Nierenkolik = unruhig, wälzt sich',
            'Bei geschlechtsfähigen Frauen: EUG ausschließen!',
            'NIL PER OS - wegen evtl. OP!'
        ]
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BAUCHSCHMERZEN_TEMPLATE };
}
