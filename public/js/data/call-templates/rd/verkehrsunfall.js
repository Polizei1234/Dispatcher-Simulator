// =========================================================================================
// VERKEHRSUNFALL TEMPLATE V2.0 - Von Bagatelle bis MANV
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const VERKEHRSUNFALL_TEMPLATE = {
    
    id: 'verkehrsunfall',
    kategorie: 'rd',
    stichwort: 'Verkehrsunfall',
    weight: 3,
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            zeuge_aufgeregt: {
                probability: 0.35,
                speech_pattern: 'aufgeregt, hektisch',
                variations: [
                    'Hier war ein Unfall!',
                    'Zwei Autos sind zusammengestoßen!',
                    'Hier ist jemand verunglückt!',
                    'Unfall auf der {Straße}!',
                    'Es hat gekracht!'
                ]
            },
            
            zeuge_ruhig: {
                probability: 0.25,
                speech_pattern: 'kontrolliert, gibt infos',
                variations: [
                    'Es gab einen Verkehrsunfall',
                    'Unfall mit Verletzten',
                    'Kollision zweier Fahrzeuge',
                    'Hier ist ein Unfall passiert'
                ],
                info: 'Gibt oft bessere Lageinformationen'
            },
            
            beteiligter_leicht_verletzt: {
                probability: 0.2,
                speech_pattern: 'geschockt, verwirrt',
                variations: [
                    'Ich hatte einen Unfall...',
                    'Jemand ist in mich reingefahren',
                    'Wir hatten einen Crash',
                    'Ich wurde angefahren'
                ],
                effects: {
                    subjektive_darstellung: 0.8,
                    unterschätzt_eigene_verletzungen: 0.6,
                    adrenalinspiegel_hoch: 0.9
                }
            },
            
            beteiligter_unbeteiligt: {
                probability: 0.15,
                speech_pattern: 'besorgt um andere',
                variations: [
                    'Ich bin okay, aber der andere ist verletzt!',
                    'Mir geht es gut, aber im anderen Auto...',
                    'Ich bin unverletzt, aber der Motorradfahrer...'
                ]
            },
            
            polizei_vor_ort: {
                probability: 0.05,
                speech_pattern: 'professionell, klare infos',
                variations: [
                    'Polizei vor Ort, VU mit Verletzten',
                    'Streife meldet VU mit {x} Verletzten',
                    'Polizei, wir haben hier einen VU'
                ],
                effects: {
                    lage_gesichert: 1.0,
                    genaue_infos: 0.9,
                    verkehr_geregelt: 0.8
                }
            }
        },
        
        dynamik: {
            weitere_verletzte_entdeckt: {
                probability: 0.15,
                trigger_time: { min: 60, max: 180 },
                change: 'Es sind noch mehr Verletzte! Im anderen Auto liegt noch jemand!',
                effects: {
                    rtw_zusatz: 0.9,
                    manv_evtl: 0.3
                }
            },
            
            patient_verschlechtert_sich: {
                probability: 0.1,
                trigger_time: { min: 120, max: 300 },
                change: 'Der Zustand wird schlechter! Atmet schwer!',
                effects: {
                    nef_wahrscheinlich: 0.8,
                    innere_blutung_möglich: 0.6
                }
            },
            
            verkehr_staut_sich: {
                probability: 0.3,
                trigger_time: { min: 180, max: 480 },
                info: 'Verkehr staut sich massiv',
                effects: {
                    anfahrt_erschwert: 0.7,
                    polizei_verkehrsregelung: 0.8
                }
            },
            
            fahrzeug_fängt_feuer: {
                probability: 0.03,
                trigger_time: { min: 120, max: 300 },
                change: 'FEUER! Das Auto brennt!',
                effects: {
                    feuerwehr_sofort: 1.0,
                    evakuierung_schnell: 1.0,
                    kritisch: 1.0
                },
                funkspruch: 'EILIG! Fahrzeugbrand, FW sofort!'
            }
        },
        
        beziehung: {
            augenzeuge: { probability: 0.6, emotional_distanz: 'mittel' },
            ersthelfer: { probability: 0.25, emotional_belastung: 'hoch', info: 'Hilft aktiv' },
            angehöriger_im_auto: { probability: 0.1, emotional_belastung: 'sehr_hoch' },
            polizei: { probability: 0.05, professionell: 1.0 }
        }
    },
    
    // ========================================
    // 🚗 UNFALLART & MECHANIK
    // ========================================
    unfallart: {
        auffahrunfall: {
            probability: 0.35,
            beschreibung: 'Aufgefahren',
            variations: [
                'von hinten aufgefahren',
                'Auffahrunfall',
                'hat nicht mehr gebremst',
                'aufgefahren beim Bremsen'
            ],
            geschwindigkeit: { mean: 30, range: [10, 80] },
            verletzungen: {
                hws: 0.7,  // Schleudertrauma
                leicht: 0.2,
                mittel: 0.1
            },
            mechanik: 'Beschleunigungs-Verzögerungs-Trauma'
        },
        
        seitenkollision: {
            probability: 0.2,
            beschreibung: 'Seitlich zusammengestoßen',
            variations: [
                'seitlich gekracht',
                'von der Seite erwischt',
                'an Kreuzung zusammengestoßen',
                'T-Bone Crash'
            ],
            geschwindigkeit: { mean: 40, range: [20, 80] },
            verletzungen: {
                leicht: 0.3,
                mittel: 0.5,
                schwer: 0.2
            },
            location: 'Kreuzung/Einmündung',
            mechanik: 'Seitlicher Aufprall - hohe Verletzungsgefahr'
        },
        
        frontalzusammenstoß: {
            probability: 0.08,
            beschreibung: 'Frontal kollidiert',
            variations: [
                'frontal zusammengestoßen',
                'frontal gekracht',
                'sind frontal ineinander',
                'frontal kollidiert'
            ],
            geschwindigkeit: { mean: 60, range: [30, 120] },
            verletzungen: {
                mittel: 0.3,
                schwer: 0.5,
                kritisch: 0.2
            },
            kritisch: 1.0,
            info: 'Höchste Verletzungsgefahr!',
            mechanik: 'Frontalaufprall - extreme Dezeleration'
        },
        
        alleinunfall: {
            probability: 0.15,
            beschreibung: 'Alleinunfall',
            variations: [
                'von der Straße abgekommen',
                'gegen Baum gefahren',
                'gegen Leitplanke',
                'Auto überschlagen',
                'in Graben gefahren'
            ],
            ursachen: {
                zu_schnell: 0.3,
                aquaplaning: 0.15,
                eingeschlafen: 0.15,
                tier: 0.1,
                medizinisches_problem: 0.15,
                ablenkung: 0.15
            },
            verletzungen_variabel: 1.0,
            medizinische_ursache_prüfen: 0.15
        },
        
        fussgänger_angefahren: {
            probability: 0.1,
            beschreibung: 'Fußgänger/Radfahrer angefahren',
            variations: [
                'Fußgänger überfahren',
                'Radfahrer angefahren',
                'Person von Auto erfasst',
                'Kind angefahren'
            ],
            geschwindigkeit: { mean: 35, range: [10, 80] },
            verletzungen: {
                mittel: 0.3,
                schwer: 0.5,
                kritisch: 0.2
            },
            besonders_kritisch: 1.0,
            info: 'Ungeschützte Verkehrsteilnehmer!',
            mechanik: 'Anprall-Schleuder-Überschlag',
            kinder_betroffen: 0.2
        },
        
        motorrad_unfall: {
            probability: 0.08,
            beschreibung: 'Motorradunfall',
            variations: [
                'Motorrad gestürzt',
                'Motorradfahrer verunglückt',
                'Biker hingefallen',
                'Motorrad ausgerutscht'
            ],
            verletzungen: {
                mittel: 0.3,
                schwer: 0.5,
                kritisch: 0.2
            },
            schutzkleidung: {
                gut: { probability: 0.6, verletzungen_reduziert: 0.5 },
                schlecht: { probability: 0.4, verletzungen_schlimmer: 0.8 }
            },
            info: 'Oft schwere Verletzungen!',
            mechanik: 'Hohe kinetische Energie, ungeschützt'
        },
        
        parkplatz_unfall: {
            probability: 0.04,
            beschreibung: 'Unfall auf Parkplatz',
            variations: [
                'auf Parkplatz zusammengestoßen',
                'beim Einparken',
                'beim Ausparken erwischt'
            ],
            geschwindigkeit: { mean: 10, range: [5, 20] },
            verletzungen: {
                keine: 0.6,
                leicht: 0.35,
                mittel: 0.05
            },
            bagatell_potential: 0.8
        }
    },
    
    // ========================================
    // 🩹 VERLETZUNGEN & TRAUMA
    // ========================================
    verletzungen: {
        keine_sichtbar: {
            probability: 0.2,
            info: 'Keine äußerlich sichtbaren Verletzungen',
            aber_schmerzen: 0.7,
            kontrolle_trotzdem: 1.0,
            warnung: 'Innere Verletzungen möglich!'
        },
        
        hws_schleudertrauma: {
            probability: 0.35,
            variations: [
                'Nackenschmerzen',
                'Kopf tut weh',
                'Hals steif',
                'kann Kopf nicht bewegen'
            ],
            severity: {
                leicht: 0.7,
                mittel: 0.25,
                schwer: 0.05
            },
            info: 'Häufigste Verletzung bei Auffahrunfall',
            hws_sicherung_immer: 1.0
        },
        
        kopf: {
            probability: 0.25,
            types: {
                platzwunde: {
                    probability: 0.4,
                    variations: ['Platzwunde am Kopf', 'Kopf blutet', 'Stirn aufgeplatzt'],
                    ursache: 'Aufprall auf Lenkrad/Scheibe',
                    blutung_oft_stark: 0.7
                },
                gehirnerschütterung: {
                    probability: 0.4,
                    indicators: [
                        'kurz bewusstlos',
                        'verwirrt',
                        'erinnert sich nicht',
                        'übel',
                        'schwindelig'
                    ],
                    beobachtung_24h_nötig: 1.0
                },
                schädel_hirn_trauma: {
                    probability: 0.2,
                    severity: 'schwer',
                    bewusstlos: 0.7,
                    kritisch: 1.0,
                    nef_zwingend: 1.0
                }
            }
        },
        
        thorax: {
            probability: 0.2,
            types: {
                rippenfraktur: {
                    probability: 0.6,
                    variations: [
                        'Schmerzen beim Atmen',
                        'Rippen tun weh',
                        'Brust schmerzt',
                        'kann nicht tief atmen'
                    ],
                    ursache: 'Lenkrad, Gurt',
                    pneumothorax_risiko: 0.2
                },
                lungenkontusion: {
                    probability: 0.3,
                    atemnot: 0.8,
                    kritisch: 0.6,
                    verschlechterung_nach_stunden: 0.5
                },
                herzkontusion: {
                    probability: 0.1,
                    kritisch: 1.0,
                    rhythmusstörungen: 0.7,
                    monitoring_zwingend: 1.0
                }
            }
        },
        
        abdomen: {
            probability: 0.15,
            types: {
                bauchschmerzen: {
                    probability: 0.5,
                    innere_blutung_möglich: 0.4,
                    verschlechterung_schleichend: 0.6
                },
                milzruptur: {
                    probability: 0.3,
                    kritisch: 1.0,
                    schock: 0.8,
                    zweizeitige_ruptur_möglich: 0.3
                },
                leberruptur: {
                    probability: 0.2,
                    kritisch: 1.0,
                    hoher_blutverlust: 0.9
                }
            },
            info: 'Innere Verletzungen - nicht sichtbar!',
            warnung: 'Patient MUSS abgeklärt werden!'
        },
        
        wirbelsäule: {
            probability: 0.12,
            types: {
                bws_lws_schmerzen: {
                    probability: 0.6,
                    variations: ['Rückenschmerzen', 'Rücken tut weh', 'Kreuz schmerzt']
                },
                wirbelkörperfraktur: {
                    probability: 0.3,
                    immobilisation_nötig: 1.0,
                    bewegung_vermeiden: 1.0
                },
                rückenmarksverletzung: {
                    probability: 0.1,
                    lähmungen: 0.9,
                    kritisch: 1.0,
                    trauma_center_zwingend: 1.0
                }
            },
            hws_immer_sichern: 1.0,
            spinal_board_bei_verdacht: 1.0
        },
        
        extremitäten: {
            probability: 0.3,
            locations: {
                arme: {
                    probability: 0.4,
                    fraktur: 0.5,
                    meist_nicht_kritisch: 0.9
                },
                beine: {
                    probability: 0.4,
                    fraktur: 0.6,
                    femurfraktur: 0.2,  // Besonders kritisch
                    femur_blutverlust_hoch: 0.8
                },
                becken: {
                    probability: 0.2,
                    kritisch: 1.0,
                    hoher_blutverlust: 0.8,
                    schock_wahrscheinlich: 0.7,
                    trauma_center: 1.0
                }
            }
        },
        
        schnittwunden: {
            probability: 0.3,
            variations: [
                'Schnittwunden von Glassplittern',
                'von Scheibe geschnitten',
                'blutet aus Wunden',
                'Glas im Gesicht'
            ],
            meist_nicht_kritisch: 0.9,
            aber_sieht_dramatisch_aus: 0.7
        },
        
        verbrennungen: {
            probability: 0.03,
            ursache: 'Airbag-Verbrennung',
            meist_leicht: 0.9,
            locations: ['Gesicht', 'Unterarme', 'Hände']
        },
        
        eingeklemmt: {
            probability: 0.1,
            variations: [
                'eingeklemmt im Fahrzeug',
                'kommt nicht raus',
                'Beine eingeklemmt',
                'Tür ist zu, kommt nicht raus',
                'Dashboard drückt auf Beine'
            ],
            feuerwehr_zwingend: 1.0,
            zeitverzögerung: 1.0,
            crush_syndrom_risiko: 0.3,
            dauer: { min: 15, max: 90 },  // Minuten für Befreiung
            info: 'Feuerwehr zur Befreiung!',
            funkspruch: '{callsign}, Person eingeklemmt, FW zur technischen Rettung, kommen.'
        }
    },
    
    // ========================================
    // 👥 PATIENTEN-ANZAHL & MANV
    // ========================================
    patienten: {
        ein_patient: {
            probability: 0.5,
            info: 'Ein Verletzter'
        },
        
        zwei_patienten: {
            probability: 0.3,
            info: 'Zwei Verletzte',
            rtw_zusatz_wahrscheinlich: 0.6
        },
        
        drei_plus: {
            probability: 0.15,
            anzahl: { min: 3, max: 6 },
            info: 'Mehrere Verletzte',
            rtw_zusatz: 1.0,
            manv_evtl: 0.3,
            orgl_informieren: 0.8
        },
        
        massenanfall: {
            probability: 0.05,
            anzahl: { min: 7, max: 20 },
            info: 'MANV - Massenanfall von Verletzten',
            sonderalarmierung: 1.0,
            orgl: 1.0,
            lna: 1.0,
            siehe: 'special.manv'
        }
    },
    
    // ========================================
    // 🚗 FAHRZEUGE
    // ========================================
    fahrzeuge: {
        pkw: {
            probability: 0.75,
            beteiligt: { min: 1, max: 3 },
            modern: {
                probability: 0.6,
                airbag: 0.9,
                esp: 0.8,
                verletzungen_reduziert: 0.5
            },
            alt: {
                probability: 0.4,
                weniger_sicherheit: 1.0,
                verletzungen_schwerer: 0.3
            }
        },
        
        motorrad: {
            probability: 0.1,
            siehe: 'unfallart.motorrad_unfall',
            verletzungen_oft_schwer: 0.7
        },
        
        lkw_beteiligt: {
            probability: 0.08,
            variations: [
                'LKW beteiligt',
                'mit Lastwagen',
                'Sattelzug beteiligt'
            ],
            verletzungen_oft_schwerer: 0.8,
            gefahrgut_möglich: 0.1,
            feuerwehr_prüfung: 0.5
        },
        
        fussgänger_radfahrer: {
            probability: 0.07,
            siehe: 'unfallart.fussgänger_angefahren',
            besonders_kritisch: 1.0
        }
    },
    
    // ========================================
    // 🏥 MEDIZINISCH
    // ========================================
    medizinisch: {
        schweregrad: {
            bagatelle: {
                probability: 0.25,
                info: 'Keine oder leichte Verletzungen',
                ktw_oft_ausreichend: 0.5,
                aber_kontrolle_wichtig: 1.0
            },
            
            leicht_verletzt: {
                probability: 0.35,
                info: 'Leichte bis mittlere Verletzungen',
                rtw_ausreichend: 1.0
            },
            
            schwer_verletzt: {
                probability: 0.25,
                info: 'Schwere Verletzungen',
                nef_empfohlen: 0.8,
                rth_evtl: 0.3,
                trauma_center: 0.6
            },
            
            kritisch_polytrauma: {
                probability: 0.15,
                info: 'Lebensgefahr, Polytrauma',
                nef_zwingend: 1.0,
                rth_empfohlen: 0.6,
                trauma_center: 1.0,
                schockraum_voranmeldung: 1.0
            }
        },
        
        bewusstsein: {
            wach_ansprechbar: { probability: 0.65 },
            benommen_verwirrt: { 
                probability: 0.2,
                sht_verdacht: 0.8
            },
            somnolent: { 
                probability: 0.1,
                kritisch: 0.8
            },
            bewusstlos: {
                probability: 0.05,
                upgrade_stichwort: 'Bewusstlosigkeit',
                kritisch: 1.0,
                nef_zwingend: 1.0
            }
        },
        
        schock: {
            probability: 0.2,
            ursachen: {
                blutverlust: 0.6,
                schmerz: 0.3,
                psychisch: 0.1
            },
            kritisch: 0.7,
            volumengabe_nötig: 0.9
        },
        
        airbag_ausgelöst: {
            probability: 0.5,
            modern_cars: 0.8,
            effects: {
                verletzungen_reduziert: 0.6,
                aber_verbrennungen: 0.1,
                zeichen_schwerer_aufprall: 1.0
            },
            info: 'Airbag = hohe Energie!'
        },
        
        gurt_getragen: {
            probability: 0.85,
            effects: {
                verletzungen_deutlich_reduziert: 0.7,
                überlebenschance_höher: 0.9
            },
            ohne_gurt: {
                probability: 0.15,
                verletzungen_viel_schwerer: 0.9,
                durch_scheibe: 0.3,
                oft_tödlich: 0.4
            }
        }
    },
    
    // ========================================
    // 🏠 UMGEBUNG & LAGE
    // ========================================
    umgebung: {
        ort: {
            innerorts: {
                probability: 0.5,
                geschwindigkeit: { mean: 40, max: 70 },
                zeugen: { min: 2, max: 10 },
                hilfe_schnell_da: 0.8
            },
            
            außerorts_landstraße: {
                probability: 0.3,
                geschwindigkeit: { mean: 80, max: 120 },
                verletzungen_schwerer: 0.7,
                anfahrt_länger: 0.6,
                weniger_zeugen: 0.7
            },
            
            autobahn: {
                probability: 0.15,
                geschwindigkeit: { mean: 120, max: 200 },
                verletzungen_oft_kritisch: 0.8,
                verkehrssicherung_komplex: 1.0,
                polizei_zwingend: 1.0,
                feuerwehr_absicherung: 0.9,
                kilometerangabe: 1.0,
                fahrtrichtung: 1.0,
                rettungsgasse_problem: 0.4
            },
            
            parkplatz: {
                probability: 0.05,
                siehe: 'unfallart.parkplatz_unfall',
                meist_harmlos: 0.8
            }
        },
        
        wetter: {
            trocken_gut: { probability: 0.6 },
            
            regen_nass: {
                probability: 0.25,
                unfallursache_oft: 0.4,
                rutschig: 1.0,
                aquaplaning: 0.3,
                arbeiten_erschwert: 0.5
            },
            
            schnee_eis: {
                probability: 0.1,
                unfallursache_sehr_oft: 0.7,
                anfahrt_erschwert: 0.8,
                mehrere_unfälle_wahrscheinlich: 0.6
            },
            
            nebel: {
                probability: 0.05,
                sicht_schlecht: 1.0,
                orientierung_schwierig: 0.6,
                weitere_unfälle_risiko: 0.5
            }
        },
        
        tageszeit: {
            tag: {
                probability: 0.65,
                sicht_gut: 1.0,
                arbeiten_einfacher: 1.0
            },
            
            dämmerung: {
                probability: 0.15,
                sicht_eingeschränkt: 0.8,
                wildwechsel_häufig: 0.4
            },
            
            nacht: {
                probability: 0.2,
                sicht_schlecht: 1.0,
                beleuchtung_nötig: 1.0,
                arbeiten_erschwert: 0.7,
                alkohol_häufiger: 0.4
            }
        },
        
        fahrzeugzustand: {
            stark_beschädigt: {
                probability: 0.4,
                variations: [
                    'total zerstört',
                    'stark deformiert',
                    'Totalschaden',
                    'völlig hinüber'
                ],
                verletzungen_wahrscheinlicher: 0.8,
                hohe_energie: 1.0
            },
            
            mittel_beschädigt: {
                probability: 0.4,
                variations: ['erheblicher Schaden', 'stark beschädigt']
            },
            
            leicht_beschädigt: {
                probability: 0.2,
                variations: ['Blechschaden', 'Delle', 'Kratzer'],
                bagatell_wahrscheinlich: 0.7
            }
        },
        
        verkehr: {
            verkehrsbehinderung: {
                probability: 0.8,
                variations: [
                    'Straße blockiert',
                    'Fahrbahn gesperrt',
                    'Verkehr staut sich',
                    'alles steht'
                ],
                polizei_für_regelung: 0.9,
                umleitung_nötig: 0.6
            },
            
            betriebsstoffe_ausgelaufen: {
                probability: 0.3,
                variations: [
                    'Öl läuft aus',
                    'Benzin auf Fahrbahn',
                    'Betriebsstoffe ausgelaufen',
                    'alles voll Öl'
                ],
                feuerwehr_für_reinigung: 0.8,
                rutschgefahr: 1.0
            }
        },
        
        // Feature 14: Tiere
        tiere: {
            wildunfall: {
                probability: 0.05,
                condition: 'außerorts',
                types: ['Reh', 'Wildschwein', 'Fuchs'],
                tier_tot: 0.7,
                tier_verletzt_gefährlich: 0.2,
                jäger_informieren: 0.8
            }
        },
        
        // Feature 15: Technik
        technik: {
            türen_verklemmt: {
                probability: 0.2,
                effects: {
                    feuerwehr_öffnung: 0.9,
                    zeitverzögerung: 1.0
                },
                info: 'Türen gehen nicht auf'
            },
            
            batterie_beschädigt: {
                probability: 0.05,
                effects: {
                    brandgefahr: 0.6,
                    elektrik_defekt: 1.0
                },
                bei_elektroauto_kritisch: 1.0
            }
        },
        
        // Feature 16: Geografie
        geografie: {
            bergung_schwierig: {
                probability: 0.05,
                scenarios: {
                    graben: {
                        probability: 0.4,
                        info: 'Auto im Graben',
                        feuerwehr_bergung: 1.0
                    },
                    böschung: {
                        probability: 0.3,
                        info: 'Böschung hinunter',
                        absturzgefahr: 0.8
                    },
                    wald: {
                        probability: 0.2,
                        info: 'Im Wald/zwischen Bäumen',
                        zugang_schwierig: 1.0
                    },
                    wasser: {
                        probability: 0.1,
                        info: 'Im Wasser/Bach',
                        kritisch: 1.0,
                        taucher_evtl: 0.6
                    }
                }
            }
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK
    // ========================================
    sozial: {
        // Feature 17: Zeugen & Ersthelfer
        angehörige: {
            zeugen_gaffer: {
                probability: 0.6,
                variations: [
                    'viele Schaulustige',
                    'Leute stehen rum',
                    'Gaffer behindern',
                    'viele filmen mit Handy'
                ],
                polizei_für_absperrung: 0.7,
                handy_videos_problematisch: 0.8
            },
            
            ersthelfer_vor_ort: {
                probability: 0.5,
                variations: [
                    'Leute helfen schon',
                    'Ersthelfer vor Ort',
                    'jemand leistet erste Hilfe',
                    'Sanitäter zufällig da'
                ],
                positiv: 1.0,
                patient_versorgt: 0.6,
                info_von_ersthelfer: 0.8
            },
            
            traumatisierte_zeugen: {
                probability: 0.3,
                variations: [
                    'Zeugen sind völlig durch den Wind',
                    'Leute stehen unter Schock',
                    'jemand weint',
                    'Kind hat alles gesehen'
                ],
                betreuung_nötig: 0.8,
                kinder_besonders_betroffen: 0.4
            }
        },
        
        // Beteiligte
        beteiligte: {
            kooperativ: { probability: 0.6 },
            
            streiten: {
                probability: 0.2,
                variations: [
                    'streiten sich',
                    'Schuldfrage wird diskutiert',
                    'werden handgreiflich',
                    'beschuldigen sich gegenseitig'
                ],
                polizei_evtl: 0.6,
                behandlung_erschwert: 0.4
            },
            
            unter_schock: {
                probability: 0.15,
                variations: [
                    'steht unter Schock',
                    'völlig aufgelöst',
                    'weint',
                    'zittert am ganzen Körper'
                ],
                betreuung_nötig: 0.8,
                notfallseelsorge_evtl: 0.3
            },
            
            aggressiv: {
                probability: 0.05,
                variations: [
                    'aggressiv',
                    'schreit rum',
                    'droht',
                    'völlig außer sich'
                ],
                polizei_nötig: 0.9,
                gefahr_für_crew: 0.6
            }
        },
        
        kinder_beteiligt: {
            probability: 0.15,
            variations: [
                'Kinder im Auto',
                'Kind verletzt',
                'Baby im Kindersitz',
                'Schulbus beteiligt'
            ],
            besondere_betreuung: 1.0,
            emotional_belastend: 1.0,
            eltern_außer_sich: 0.9
        },
        
        // Feature 19: Soziale Aspekte
        notlage: {
            fahrerflucht_verdacht: {
                probability: 0.05,
                variations: [
                    'Fahrer ist geflüchtet',
                    'hat sich aus dem Staub gemacht',
                    'einer ist abgehauen'
                ],
                polizei_fahndung: 1.0,
                zeugen_beschreibung: 0.7
            }
        }
    },
    
    // ========================================
    // ⚠️ GEFAHREN-SITUATIONEN
    // ========================================
    gefahren: {
        // Feature 20: Feuer & Explosion
        gewalt: {
            fahrzeugbrand: {
                probability: 0.05,
                variations: [
                    'Fahrzeug brennt!',
                    'Feuer!',
                    'Auto steht in Flammen!',
                    'Es brennt!'
                ],
                feuerwehr_sofort: 1.0,
                nicht_nähern: 1.0,
                kritisch: 1.0,
                evakuierung_schnell: 1.0,
                explosionsgefahr: 0.4
            },
            
            brandgefahr: {
                probability: 0.1,
                variations: [
                    'raucht',
                    'riecht nach Benzin',
                    'Qualm kommt raus',
                    'komische Geräusche'
                ],
                feuerwehr_vorsichtshalber: 0.8,
                batterie_abklemmen: 0.7
            },
            
            elektroauto_brand: {
                probability: 0.02,
                info: 'Elektroauto brennt - besondere Gefahr!',
                feuerwehr_mit_spezialausrüstung: 1.0,
                löschen_sehr_schwierig: 1.0,
                großer_abstand: 1.0,
                wiederentzündung_möglich: 0.8
            }
        },
        
        // Chemische Gefahren
        chemie: {
            gefahrgut: {
                probability: 0.02,
                condition: 'lkw_beteiligt',
                variations: [
                    'Gefahrgut-LKW',
                    'orangene Warntafeln',
                    'Chemikalien',
                    'Tanklaster'
                ],
                feuerwehr_mit_gefahrgut_zug: 1.0,
                abstand_halten: 1.0,
                evakuierung_evtl: 0.5,
                messgerät_nötig: 1.0
            },
            
            kraftstoff_ausgelaufen: {
                probability: 0.15,
                info: 'Kraftstoff läuft aus',
                feuerwehr_binden: 0.8,
                funkenbildung_vermeiden: 1.0,
                rauchen_verboten: 1.0
            }
        },
        
        // Feature 21: Strukturelle Gefahren
        selbstgefährdung: {
            einsturzgefahr: {
                probability: 0.02,
                variations: [
                    'gegen Hauswand gefahren',
                    'Gebäude beschädigt',
                    'Mauer wackelt'
                ],
                feuerwehr_statiker: 1.0,
                nicht_nähern: 1.0,
                evakuierung: 0.7
            },
            
            stromunfall: {
                probability: 0.01,
                variations: [
                    'in Strommast gefahren',
                    'Oberleitung beschädigt',
                    'Kabel hängen runter'
                ],
                stromversorger: 1.0,
                nicht_nähern: 1.0,
                lebensgefahr: 1.0
            },
            
            weiterer_unfall_droht: {
                probability: 0.15,
                condition: 'autobahn_oder_landstraße',
                info: 'Gefahr weiterer Auffahrunfall',
                absicherung_zwingend: 1.0,
                polizei_verkehrssicherung: 1.0
            }
        },
        
        // Feature 22: Medizinische Gefahren
        infektion: {
            blutexposition: {
                probability: 0.3,
                info: 'Viel Blut, Schutz beachten',
                handschuhe_zwingend: 1.0
            }
        },
        
        // Spezielle VU-Gefahren
        vu_spezifisch: {
            crush_syndrom: {
                probability: 0.08,
                condition: 'eingeklemmt',
                trigger_time: { min: 30, max: 120 },
                info: 'Patient länger eingeklemmt - Crush-Syndrom droht!',
                komplikationen: {
                    hyperkaliämie: 0.7,
                    nierenversagen: 0.6,
                    herzstillstand_bei_befreiung: 0.4
                },
                vorlauf_zwingend: 1.0,
                nef_zwingend: 1.0,
                info_text: 'Bei Befreiung Kaliumfreisetzung möglich!'
            },
            
            innere_blutung: {
                probability: 0.15,
                indicators: [
                    'Zustand verschlechtert sich schleichend',
                    'Blass und kaltschweißig',
                    'Puls steigt',
                    'Blutdruck fällt'
                ],
                kritisch: 1.0,
                schock_wahrscheinlich: 0.8,
                zeitfaktor_wichtig: 1.0
            }
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        stadtstraße: {
            probability: 0.35,
            address_types: ['road', 'street'],
            kreuzung_oft: 0.6,
            ampel: 0.5
        },
        
        landstraße: {
            probability: 0.25,
            address_types: ['road'],
            ortsbeschreibung_wichtig: 1.0,
            anfahrt_länger: 0.6,
            kilometer_angabe: 0.8
        },
        
        autobahn: {
            probability: 0.15,
            address_types: ['motorway'],
            kilometerangabe: 1.0,
            fahrtrichtung_wichtig: 1.0,
            siehe: 'umgebung.ort.autobahn'
        },
        
        bundesstraße: {
            probability: 0.15,
            address_types: ['primary'],
            verkehr_oft_stark: 0.7
        },
        
        parkplatz: {
            probability: 0.08,
            address_types: ['parking'],
            siehe: 'unfallart.parkplatz_unfall'
        },
        
        wohngebiet: {
            probability: 0.02,
            address_types: ['residential'],
            geschwindigkeit_niedrig: 1.0,
            tempo_30: 1.0
        }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN
    // ========================================
    nachforderungen: {
        nef: {
            probability: 0.4,
            trigger_time: 'oft_von_anfang_an',
            reasons: [
                'Schwere Verletzungen',
                'Eingeklemmte Person',
                'Bewusstloser Patient',
                'Polytrauma',
                'Vital gefährdet'
            ],
            funkspruch: '{callsign}, schwerer VU, benötigen NEF, kommen.'
        },
        
        rtw_zusatz: {
            probability: 0.45,
            trigger_time: { min: 60, max: 240 },
            reasons: {
                mehrere_verletzte: 0.7,
                schwerer_als_gedacht: 0.2,
                weitere_person_entdeckt: 0.1
            },
            funkspruch: '{callsign}, benötigen weiteren RTW, {anzahl} Verletzte, kommen.'
        },
        
        feuerwehr: {
            probability: 0.6,
            trigger_time: 'meist_von_anfang_an',
            reasons: {
                befreiung: {
                    probability: 0.3,
                    funkspruch: '{callsign}, Person eingeklemmt, FW zur technischen Rettung, kommen.',
                    gerät_nötig: ['Spreizer', 'Schere', 'Rettungszylinder']
                },
                verkehrssicherung: {
                    probability: 0.4,
                    funkspruch: '{callsign}, VU auf {straße}, FW zur Verkehrssicherung, kommen.'
                },
                betriebsstoffe: {
                    probability: 0.2,
                    funkspruch: '{callsign}, Betriebsstoffe ausgelaufen, FW zur Reinigung, kommen.'
                },
                brand: {
                    probability: 0.1,
                    funkspruch: 'EILIG! Fahrzeugbrand, FW sofort!'
                }
            }
        },
        
        polizei: {
            probability: 0.95,
            trigger_time: 'meist_von_anfang_an',
            reasons: {
                unfallaufnahme: 1.0,
                verkehrsregelung: 0.8,
                personalienfeststellung: 1.0,
                sperrung: 0.6
            },
            info: 'Bei VU fast immer Polizei!'
        },
        
        rth: {
            probability: 0.15,
            trigger_time: { min: 120, max: 360 },
            reasons: [
                'Polytrauma',
                'Langer Anfahrtsweg',
                'Zeitkritisch',
                'Trauma-Center erforderlich',
                'Schwer eingeklemmt'
            ],
            funkspruch: '{callsign}, benötigen RTH, Patient polytraumatisiert, kommen.'
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        // Feature 33: Verschlechterung
        verschlechterung: {
            patient_dekompensiert: {
                probability: 0.15,
                trigger_time: { min: 180, max: 480 },
                changes: [
                    'innere Blutung',
                    'Schock entwickelt sich',
                    'Bewusstsein trübt sich ein',
                    'Atmung wird schlechter'
                ],
                kritisch: 1.0,
                nef_jetzt_nötig: 0.9
            },
            
            weitere_verletzte: {
                probability: 0.15,
                siehe: 'anrufer.dynamik.weitere_verletzte_entdeckt'
            },
            
            zweizeitige_milzruptur: {
                probability: 0.05,
                trigger_time: { min: 360, max: 720 },
                info: 'Patient war stabil, jetzt plötzlich Schock!',
                kritisch: 1.0,
                innere_blutung: 1.0
            }
        },
        
        // Feature 34: Komplikationen
        komplikationen: {
            befreiung_dauert: {
                probability: 0.2,
                condition: 'eingeklemmt',
                trigger_time: { min: 300, max: 1200 },
                info: 'Technische Rettung dauert lange',
                crush_syndrom_risiko: 0.4,
                nef_zwingend: 1.0
            },
            
            brand_entwickelt_sich: {
                probability: 0.03,
                trigger_time: { min: 120, max: 300 },
                changes: 'Fahrzeug fängt Feuer!',
                kritisch: 1.0,
                evakuierung_schnell: 1.0,
                feuerwehr_eilig: 1.0
            },
            
            weiterer_auffahrunfall: {
                probability: 0.1,
                trigger_time: { min: 180, max: 600 },
                info: 'Weiterer Unfall an Unfallstelle!',
                rtw_zusatz: 1.0,
                polizei_verstärkung: 1.0
            }
        },
        
        // Feature 35: Besserung
        besserung: {
            harmloser_als_gedacht: {
                probability: 0.2,
                funkspruch: '{callsign}, Lage harmloser als gemeldet, nur Blechschaden, kommen.',
                ktw_reicht: 0.6,
                nef_abbestellen: 0.4
            }
        }
    },
    
    // ========================================
    // 🏥 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.4,
            feuerwehr: 0.6,
            polizei: 0.95,
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'polytrauma_oder_kritisch',
                hospitals: ['klinikum_ludwigsburg', 'katharinenhospital_stuttgart'],
                reason: 'Überregionales Traumazentrum',
                schockraum: 1.0,
                voranmeldung_zwingend: 1.0
            },
            
            priorität_2: {
                condition: 'schwere_verletzungen',
                hospitals: ['rems_murr_klinikum_winnenden', 'klinikum_ludwigsburg'],
                reason: 'Unfallchirurgie mit CT'
            },
            
            priorität_3: {
                condition: 'leichte_verletzungen',
                hospitals: ['nächstgelegenes'],
                reason: 'Abklärung ausreichend'
            }
        },
        
        voranmeldung: {
            bei_schweren_verletzungen: 1.0,
            schockraum_alarmierung: 0.6,
            infos: [
                'Unfallhergang',
                'Geschwindigkeit geschätzt',
                'Verletzungsmuster',
                'Eingeklemmt gewesen?',
                'Vitalparameter',
                'Gurt getragen?',
                'Airbag ausgelöst?',
                'Deformation Fahrzeug'
            ]
        }
    },
    
    // ========================================
    // 📊 PROTOKOLL & BEWERTUNG
    // ========================================
    protokoll: {
        tracked_data: {
            unfallhergang: 'FROM_CALL',
            patientenanzahl: 'FROM_CALL',
            eingeklemmt: 'FROM_CALL',
            fahrzeuge_disponiert: 'FROM_DISPOSITION',
            feuerwehr_nachgefordert: 'FROM_RADIO',
            polizei_informiert: 'FROM_DISPOSITION',
            golden_hour_eingehalten: 'CALCULATED',
            trauma_center_bei_polytrauma: 'FROM_DISPOSITION',
            outcome: 'FROM_SIMULATION'
        },
        
        bewertung: {
            kriterien: {
                polizei_disponiert: {
                    wichtig: 'hoch',
                    info: 'Bei VU fast immer Polizei nötig!',
                    fehlt_oft: 1.0
                },
                
                feuerwehr_bei_einklemmung: {
                    wichtig: 'kritisch',
                    info: 'Eingeklemmt = Feuerwehr ZWINGEND!',
                    ohne_lebensbedrohlich: 1.0
                },
                
                golden_hour: {
                    target: 60,
                    max_acceptable: 90,
                    unit: 'Minuten bis Klinik',
                    bei_polytrauma_kritisch: 1.0
                },
                
                trauma_center_auswahl: {
                    condition: 'polytrauma',
                    zwingend: 1.0,
                    info: 'Polytrauma MUSS in Traumazentrum!'
                },
                
                nef_bei_schweren_verletzungen: {
                    wichtig: 'hoch',
                    indicators: [
                        'Bewusstlos',
                        'Eingeklemmt',
                        'Vital gefährdet',
                        'Polytrauma'
                    ]
                },
                
                mehrere_rtw_bei_vielen_verletzten: {
                    wichtig: 'mittel',
                    regel: 'Ein RTW pro Patient',
                    ausnahme: 'Leicht Verletzte zusammen'
                }
            },
            
            kritische_fehler: [
                'Polizei nicht disponiert',
                'Feuerwehr bei Einklemmung vergessen',
                'Polytrauma nicht ins Traumazentrum',
                'NEF bei vitaler Gefährdung vergessen',
                'Golden Hour massiv überschritten'
            ],
            
            häufige_fehler: [
                'Bei VU keine Polizei disponiert (95% brauchen Polizei!)',
                'Feuerwehr zu spät nachgefordert',
                'Nur ein RTW bei mehreren Verletzten'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'VU mit {anzahl} beteiligten Fahrzeugen, {anzahl} Verletzte',
            'Verkehrsunfall auf {straße}, Patient eingeklemmt, technische Rettung läuft',
            'VU Autobahn, schwer verletzter Patient, Rettungsgasse funktioniert nicht',
            'Auffahrunfall, HWS-Trauma vermutet, Patient ansprechbar',
            'VU mit Motorrad, Patient schwer verletzt, NEF vor Ort',
            'Frontalzusammenstoß, hohe Energie, Polytrauma wahrscheinlich',
            'VU Fußgänger angefahren, Patient vital gefährdet',
            'VU mit eingeklemmter Person, Feuerwehr befreit noch, Crash-Syndrom möglich'
        ],
        
        nachforderungen: [
            'Benötigen FW zur Befreiung, Person eingeklemmt!',
            'Zweiter RTW erforderlich, weitere Verletzte entdeckt!',
            'RTH angefordert, Polytrauma, lange Anfahrt!',
            'Benötigen Polizei zur Verkehrsregelung, Chaos hier!',
            'LNA angefordert, MANV mit {anzahl} Verletzten!'
        ],
        
        besonderheiten_vu: [
            'Airbag ausgelöst, hohe Energie',
            'Kein Gurt getragen, durch Scheibe',
            'Fahrzeug stark deformiert',
            'Patient war längere Zeit eingeklemmt',
            'Betriebsstoffe ausgelaufen',
            'Rettungskarte nicht vorhanden'
        ]
    },
    
    // ========================================
    // 🎭 SPECIAL - VU-SPEZIFISCH
    // ========================================
    special: {
        // MANV-Prozeduren
        manv: {
            trigger: 'patienten.massenanfall',
            probability: 0.05,
            
            alarmierung: {
                stichwort: 'MANV',
                orgl: 1.0,
                lna: 1.0,
                grtw: 1.0,
                rtw_anzahl: { min: 3, max: 10 },
                nef_anzahl: { min: 1, max: 3 }
            },
            
            sichtung: {
                system: 'START-Schema oder mSTaRT',
                kategorien: {
                    t1_rot: { info: 'Vital gefährdet, sofort', priority: 1 },
                    t2_gelb: { info: 'Schwer verletzt, aufgeschoben', priority: 2 },
                    t3_grün: { info: 'Leicht verletzt, spätversorgung', priority: 3 },
                    t4_blau: { info: 'Ohne Überlebenschance', priority: 4 },
                    t5_schwarz: { info: 'Verstorben', priority: 5 }
                }
            },
            
            ablauf: [
                'MANV ausgerufen',
                'LNA übernimmt Einsatzleitung',
                'ORGL koordiniert',
                'Sichtung durch LNA',
                'Abarbeitung nach Priorität',
                'Dokumentation Patient/Ziel-KH'
            ],
            
            funkspruch: 'MANV {ort}, geschätzt {anzahl} Verletzte, LNA und ORGL angefordert, beginnen mit Sichtung, kommen.'
        },
        
        // Rettungskarten-System
        rettungskarte: {
            probability: 0.3,
            
            vorhanden: {
                probability: 0.3,
                info: 'Rettungskarte in Sonnenblende',
                vorteile: {
                    batterie_position_bekannt: 1.0,
                    schnittstellein_markiert: 1.0,
                    airbags_position: 1.0,
                    befreiung_schneller: 0.5
                }
            },
            
            nicht_vorhanden: {
                probability: 0.7,
                info: 'Keine Rettungskarte',
                nachteile: {
                    befreiung_dauert_länger: 0.3,
                    risiko_batterie_durchtrennen: 0.2
                }
            }
        },
        
        // Alkohol & Drogen
        alkohol_drogen: {
            probability: 0.15,
            variations: [
                'Fahrer riecht nach Alkohol',
                'betrunken',
                'Hinweise auf Drogenkonsum',
                'lallende Sprache',
                'Bierdosen im Auto'
            ],
            polizei_blutprobe: 0.9,
            rechtliche_konsequenzen: 1.0,
            unfallursache_wahrscheinlich: 0.8
        },
        
        // Dashcam & Dokumentation
        dashcam_aufnahme: {
            probability: 0.1,
            info: 'Zeuge hat Dashcam-Aufnahme',
            polizei_interesse: 0.9,
            unfallhergang_klar: 0.8
        },
        
        // Rettungsgasse
        rettungsgasse: {
            problem: {
                probability: 0.4,
                condition: 'autobahn',
                variations: [
                    'keine Rettungsgasse',
                    'Anfahrt blockiert',
                    'kommen nicht durch',
                    'müssen uns durchschlängeln'
                ],
                zeitverzögerung: 0.8,
                polizei_räumen_lassen: 0.6,
                frustration_crew: 1.0
            },
            
            gut_funktioniert: {
                probability: 0.6,
                info: 'Rettungsgasse funktioniert',
                schnelle_anfahrt: 1.0,
                positiv: 1.0
            }
        },
        
        // Unfallanalyse
        unfallmechanik_analyse: {
            info: 'Für Klinik wichtig: Unfallmechanik',
            
            wichtige_infos: [
                'Geschwindigkeit geschätzt',
                'Aufprallart (frontal, seitlich, Heck)',
                'Deformation Fahrzeug (stark/mittel/leicht)',
                'Airbag ausgelöst?',
                'Gurt getragen?',
                'Eingeklemmt gewesen?',
                'Dauer bis Befreiung',
                'Bewusstlosigkeit?'
            ],
            
            kinetische_energie: {
                30_kmh: 'Niedrige Energie',
                50_kmh: 'Mittlere Energie',
                80_kmh: 'Hohe Energie',
                über_100_kmh: 'Sehr hohe Energie - schwere Verletzungen wahrscheinlich'
            }
        },
        
        // Psychische Belastung
        psychische_belastung: {
            ersthelfer_traumatisiert: {
                probability: 0.2,
                manifestationen: [
                    'Ersthelfer weint',
                    'Zittern, Schock',
                    'Hat Reanimation durchgeführt',
                    'Fühlt sich schuldig'
                ],
                notfallseelsorge: 0.6,
                betreuung_wichtig: 1.0
            },
            
            crew_belastung: {
                probability: 0.15,
                trigger: [
                    'Kinder betroffen',
                    'Schwerste Verletzungen',
                    'Tod vor Ort',
                    'Lange Einklemmung'
                ],
                nachbesprechung_wichtig: 1.0,
                supervision_anbieten: 0.8
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VERKEHRSUNFALL_TEMPLATE };
}
