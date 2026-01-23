// =========================================================================================
// VERKEHRSUNFALL TEMPLATE - Vielfältige Szenarien von Bagatelle bis Polytrauma
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
                    'Unfall auf der {Straße}!'
                ]
            },
            
            zeuge_ruhig: {
                probability: 0.25,
                speech_pattern: 'kontrolliert, gibt infos',
                variations: [
                    'Es gab einen Verkehrsunfall',
                    'Unfall mit Verletzten',
                    'Kollision zweier Fahrzeuge'
                ],
                info: 'Gibt oft bessere Lageinformationen'
            },
            
            beteiligter_leicht_verletzt: {
                probability: 0.2,
                speech_pattern: 'geschockt, verwirrt',
                variations: [
                    'Ich hatte einen Unfall...',
                    'Jemand ist in mich reingefahren',
                    'Wir hatten einen Crash'
                ],
                effects: {
                    subjektive_darstellung: 0.8,
                    unterscheidet_eigene_verletzungen: 0.6
                }
            },
            
            beteiligter_unbeteiligt: {
                probability: 0.15,
                speech_pattern: 'besorgt um andere',
                variations: [
                    'Ich bin okay, aber der andere ist verletzt!',
                    'Mir geht es gut, aber im anderen Auto...'
                ]
            },
            
            polizei_vor_ort: {
                probability: 0.05,
                speech_pattern: 'professionell, klare infos',
                variations: [
                    'Polizei vor Ort, VU mit Verletzten',
                    'Streife meldet VU mit {x} Verletzten'
                ],
                effects: {
                    lage_gesichert: 1.0,
                    genaue_infos: 0.9
                }
            }
        },
        
        dynamik: {
            weitere_verletzte_entdeckt: {
                probability: 0.15,
                trigger_time: { min: 60, max: 180 },
                change: 'Es sind noch mehr Verletzte! Im anderen Auto liegt noch jemand!',
                effects: {
                    rtw_zusatz: 0.9
                }
            },
            
            patient_verschlechtert_sich: {
                probability: 0.1,
                trigger_time: { min: 120, max: 300 },
                change: 'Der Zustand wird schlechter!',
                effects: {
                    nef_wahrscheinlich: 0.8
                }
            },
            
            verkehr_staut_sich: {
                probability: 0.3,
                trigger_time: { min: 180, max: 480 },
                info: 'Verkehr staut sich massiv',
                effects: {
                    anfahrt_erschwert: 0.7
                }
            }
        }
    },
    
    // ========================================
    // 🚗 UNFALLART
    // ========================================
    unfallart: {
        auffahrunfall: {
            probability: 0.35,
            beschreibung: 'Aufgefahren',
            variations: [
                'von hinten aufgefahren',
                'Auffahrunfall',
                'hat nicht mehr gebremst'
            ],
            geschwindigkeit: { mean: 30, range: [10, 80] },
            verletzungen: {
                hws: 0.7,  // Schleudertrauma
                leicht: 0.2,
                mittel: 0.1
            }
        },
        
        seitenkollision: {
            probability: 0.2,
            beschreibung: 'Seitlich zusammengestoßen',
            variations: [
                'seitlich gekracht',
                'von der Seite erwischt',
                'an Kreuzung zusammengestoßen'
            ],
            geschwindigkeit: { mean: 40, range: [20, 80] },
            verletzungen: {
                leicht: 0.3,
                mittel: 0.5,
                schwer: 0.2
            },
            location: 'Kreuzung/Einmündung'
        },
        
        frontalzusammenstoß: {
            probability: 0.08,
            beschreibung: 'Frontal kollidiert',
            variations: [
                'frontal zusammengestoßen',
                'frontal gekracht',
                'sind frontal ineinander'
            ],
            geschwindigkeit: { mean: 60, range: [30, 120] },
            verletzungen: {
                mittel: 0.3,
                schwer: 0.5,
                kritisch: 0.2
            },
            kritisch: 1.0,
            info: 'Höchste Verletzungsgefahr!'
        },
        
        alleinunfall: {
            probability: 0.15,
            beschreibung: 'Alleinunfall',
            variations: [
                'von der Straße abgekommen',
                'gegen Baum gefahren',
                'gegen Leitplanke',
                'Auto überschlagen'
            ],
            ursachen: {
                zu_schnell: 0.3,
                aquaplaning: 0.15,
                eingeschlafen: 0.15,
                tier: 0.1,
                medizinisches_problem: 0.15,
                ablenkung: 0.15
            },
            verletzungen_variabel: 1.0
        },
        
        fussgänger_angefahren: {
            probability: 0.1,
            beschreibung: 'Fußgänger/Radfahrer angefahren',
            variations: [
                'Fußgänger überfahren',
                'Radfahrer angefahren',
                'Person von Auto erfasst'
            ],
            geschwindigkeit: { mean: 35, range: [10, 80] },
            verletzungen: {
                mittel: 0.3,
                schwer: 0.5,
                kritisch: 0.2
            },
            besonders_kritisch: 1.0,
            info: 'Ungeschützte Verkehrsteilnehmer!'
        },
        
        motorrad_unfall: {
            probability: 0.08,
            beschreibung: 'Motorradunfall',
            variations: [
                'Motorrad gestürzt',
                'Motorradfahrer verunglückt',
                'Biker hingefallen'
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
            info: 'Oft schwere Verletzungen!'
        },
        
        parkplatz_unfall: {
            probability: 0.04,
            beschreibung: 'Unfall auf Parkplatz',
            variations: [
                'auf Parkplatz zusammengestoßen',
                'beim Einparken'
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
    // 🩹 VERLETZUNGEN
    // ========================================
    verletzungen: {
        keine_sichtbar: {
            probability: 0.2,
            info: 'Keine äußerlich sichtbaren Verletzungen',
            aber_schmerzen: 0.7,
            kontrolle_trotzdem: 1.0
        },
        
        hws_schleudertrauma: {
            probability: 0.35,
            variations: [
                'Nackenschmerzen',
                'Kopf tut weh',
                'Hals steif'
            ],
            severity: {
                leicht: 0.7,
                mittel: 0.25,
                schwer: 0.05
            },
            info: 'Häufigste Verletzung bei Auffahrunfall'
        },
        
        kopf: {
            probability: 0.25,
            types: {
                platzwunde: {
                    probability: 0.4,
                    variations: ['Platzwunde am Kopf', 'Kopf blutet'],
                    ursache: 'Aufprall auf Lenkrad/Scheibe'
                },
                gehirnerschütterung: {
                    probability: 0.4,
                    indicators: [
                        'kurz bewusstlos',
                        'verwirrt',
                        'erinnert sich nicht',
                        'übel'
                    ]
                },
                schädel_hirn_trauma: {
                    probability: 0.2,
                    severity: 'schwer',
                    bewusstlos: 0.7,
                    kritisch: 1.0
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
                        'Brust schmerzt'
                    ],
                    ursache: 'Lenkrad, Gurt'
                },
                lungenkontusion: {
                    probability: 0.3,
                    atemnot: 0.8,
                    kritisch: 0.6
                },
                herzkontusion: {
                    probability: 0.1,
                    kritisch: 1.0,
                    rhythmusstörungen: 0.7
                }
            }
        },
        
        abdomen: {
            probability: 0.15,
            types: {
                bauchschmerzen: {
                    probability: 0.5,
                    innere_blutung_möglich: 0.4
                },
                milzruptur: {
                    probability: 0.3,
                    kritisch: 1.0,
                    schock: 0.8
                },
                leberruptur: {
                    probability: 0.2,
                    kritisch: 1.0
                }
            },
            info: 'Innere Verletzungen - nicht sichtbar!'
        },
        
        wirbelsäule: {
            probability: 0.12,
            types: {
                bws_lws_schmerzen: {
                    probability: 0.6,
                    variations: ['Rückenschmerzen', 'Rücken tut weh']
                },
                wirbelkörperfraktur: {
                    probability: 0.3,
                    immobilisation_nötig: 1.0
                },
                rückenmarksverletzung: {
                    probability: 0.1,
                    lähmungen: 0.9,
                    kritisch: 1.0
                }
            },
            hws_immer_sichern: 1.0
        },
        
        extremitäten: {
            probability: 0.3,
            locations: {
                arme: {
                    probability: 0.4,
                    fraktur: 0.5
                },
                beine: {
                    probability: 0.4,
                    fraktur: 0.6,
                    femurfraktur: 0.2  // Besonders kritisch
                },
                becken: {
                    probability: 0.2,
                    kritisch: 1.0,
                    hoher_blutverlust: 0.8
                }
            }
        },
        
        schnittwunden: {
            probability: 0.3,
            variations: [
                'Schnittwunden von Glassplittern',
                'von Scheibe geschnitten',
                'blutet aus Wunden'
            ],
            meist_nicht_kritisch: 0.9
        },
        
        verbrennungen: {
            probability: 0.03,
            ursache: 'Airbag-Verbrennung',
            meist_leicht: 0.9
        },
        
        eingeklemmt: {
            probability: 0.1,
            variations: [
                'eingeklemmt im Fahrzeug',
                'kommt nicht raus',
                'Beine eingeklemmt'
            ],
            feuerwehr_zwingend: 1.0,
            zeitverzögerung: 1.0,
            crush_syndrom_risiko: 0.3,
            info: 'Feuerwehr zur Befreiung!'
        }
    },
    
    // ========================================
    // 👥 PATIENTEN-ANZAHL
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
            manv_evtl: 0.3
        },
        
        massenanfall: {
            probability: 0.05,
            anzahl: { min: 7, max: 20 },
            info: 'MANV - Massenanfall von Verletzten',
            sonderalarmierung: 1.0,
            orgl: 1.0,
            siehe: 'manv_template'
        }
    },
    
    // ========================================
    // 🚗 FAHRZEUGE
    // ========================================
    fahrzeuge: {
        pkw: {
            probability: 0.75,
            beteiligt: { min: 1, max: 3 }
        },
        
        motorrad: {
            probability: 0.1,
            siehe: 'unfallart.motorrad_unfall'
        },
        
        lkw_beteiligt: {
            probability: 0.08,
            variations: [
                'LKW beteiligt',
                'mit Lastwagen'
            ],
            verletzungen_oft_schwerer: 0.8,
            gefahrgut_möglich: 0.1
        },
        
        fussgänger_radfahrer: {
            probability: 0.07,
            siehe: 'unfallart.fussgänger_angefahren'
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
                ktw_oft_ausreichend: 0.5
            },
            
            leicht_verletzt: {
                probability: 0.35,
                info: 'Leichte bis mittlere Verletzungen'
            },
            
            schwer_verletzt: {
                probability: 0.25,
                info: 'Schwere Verletzungen',
                nef_empfohlen: 0.8,
                rth_evtl: 0.3
            },
            
            kritisch_polytrauma: {
                probability: 0.15,
                info: 'Lebensgefahr, Polytrauma',
                nef_zwingend: 1.0,
                rth_empfohlen: 0.6,
                trauma_center: 1.0
            }
        },
        
        bewusstsein: {
            wach_ansprechbar: { probability: 0.65 },
            benommen_verwirrt: { probability: 0.2 },
            somnolent: { probability: 0.1 },
            bewusstlos: {
                probability: 0.05,
                upgrade_stichwort: 'Bewusstlosigkeit',
                kritisch: 1.0
            }
        },
        
        schock: {
            probability: 0.2,
            ursachen: {
                blutverlust: 0.6,
                schmerz: 0.3,
                psychisch: 0.1
            },
            kritisch: 0.7
        },
        
        airbag_ausgelöst: {
            probability: 0.5,
            modern_cars: 0.8,
            effects: {
                verletzungen_reduziert: 0.6,
                aber_verbrennungen: 0.1
            }
        },
        
        gurt_getragen: {
            probability: 0.85,
            effects: {
                verletzungen_deutlich_reduziert: 0.7
            },
            ohne_gurt: {
                probability: 0.15,
                verletzungen_viel_schwerer: 0.9,
                durch_scheibe: 0.3
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
                zeugen: { min: 2, max: 10 }
            },
            
            außerorts_landstraße: {
                probability: 0.3,
                geschwindigkeit: { mean: 80, max: 120 },
                verletzungen_schwerer: 0.7,
                anfahrt_länger: 0.6
            },
            
            autobahn: {
                probability: 0.15,
                geschwindigkeit: { mean: 120, max: 200 },
                verletzungen_oft_kritisch: 0.8,
                verkehrssicherung_komplex: 1.0,
                polizei_zwingend: 1.0,
                kilometerangabe: 1.0,
                fahrtrichtung: 1.0
            },
            
            parkplatz: {
                probability: 0.05,
                siehe: 'unfallart.parkplatz_unfall'
            }
        },
        
        wetter: {
            trocken_gut: { probability: 0.6 },
            
            regen_nass: {
                probability: 0.25,
                unfallursache_oft: 0.4,
                rutschig: 1.0
            },
            
            schnee_eis: {
                probability: 0.1,
                unfallursache_sehr_oft: 0.7,
                anfahrt_erschwert: 0.8
            },
            
            nebel: {
                probability: 0.05,
                sicht_schlecht: 1.0,
                orientierung_schwierig: 0.6
            }
        },
        
        tageszeit: {
            tag: {
                probability: 0.65,
                sicht_gut: 1.0
            },
            
            dämmerung: {
                probability: 0.15,
                sicht_eingeschränkt: 0.8
            },
            
            nacht: {
                probability: 0.2,
                sicht_schlecht: 1.0,
                beleuchtung_nötig: 1.0,
                arbeiten_erschwert: 0.7
            }
        },
        
        fahrzeugzustand: {
            stark_beschädigt: {
                probability: 0.4,
                variations: [
                    'total zerstört',
                    'stark deformiert',
                    'Totalschaden'
                ],
                verletzungen_wahrscheinlicher: 0.8
            },
            
            mittel_beschädigt: {
                probability: 0.4,
                variations: ['erheblicher Schaden']
            },
            
            leicht_beschädigt: {
                probability: 0.2,
                variations: ['Blechschaden', 'Delle'],
                bagatell_wahrscheinlich: 0.7
            }
        },
        
        verkehr: {
            verkehrsbehinderung: {
                probability: 0.8,
                variations: [
                    'Straße blockiert',
                    'Fahrbahn gesperrt',
                    'Verkehr staut sich'
                ],
                polizei_für_regelung: 0.9
            },
            
            betriebsstoffe_ausgelaufen: {
                probability: 0.3,
                variations: [
                    'Öl läuft aus',
                    'Benzin auf Fahrbahn',
                    'Betriebsstoffe ausgelaufen'
                ],
                feuerwehr_für_reinigung: 0.8
            }
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK
    // ========================================
    sozial: {
        zeugen: {
            viele_gaffer: {
                probability: 0.6,
                variations: [
                    'viele Schaulustige',
                    'Leute stehen rum',
                    'Gaffer behindern'
                ],
                polizei_für_absperrung: 0.7
            },
            
            ersthelfer: {
                probability: 0.5,
                variations: [
                    'Leute helfen schon',
                    'Ersthelfer vor Ort',
                    'jemand leistet erste Hilfe'
                ],
                positiv: 1.0
            }
        },
        
        beteiligte: {
            kooperativ: { probability: 0.6 },
            
            streiten: {
                probability: 0.2,
                variations: [
                    'streiten sich',
                    'Schuldfrage wird diskutiert',
                    'werden handgreiflich'
                ],
                polizei_evtl: 0.6
            },
            
            unter_schock: {
                probability: 0.15,
                variations: [
                    'steht unter Schock',
                    'völlig aufgelöst',
                    'weint'
                ],
                betreuung_nötig: 0.8
            },
            
            aggressiv: {
                probability: 0.05,
                variations: ['aggressiv', 'schreit rum'],
                polizei_nötig: 0.9
            }
        },
        
        kinder_beteiligt: {
            probability: 0.15,
            variations: [
                'Kinder im Auto',
                'Kind verletzt',
                'Baby im Kindersitz'
            ],
            besondere_betreuung: 1.0,
            emotional_belastend: 1.0
        }
    },
    
    // ========================================
    // ⚠️ GEFAHREN
    // ========================================
    gefahren: {
        fahrzeugbrand: {
            probability: 0.05,
            variations: [
                'Fahrzeug brennt!',
                'Feuer!',
                'Auto steht in Flammen!'
            ],
            feuerwehr_sofort: 1.0,
            nicht_nähern: 1.0,
            kritisch: 1.0
        },
        
        brandgefahr: {
            probability: 0.1,
            variations: [
                'raucht',
                'riecht nach Benzin',
                'Qualm kommt raus'
            ],
            feuerwehr_vorsichtshalber: 0.8
        },
        
        gefahrgut: {
            probability: 0.02,
            condition: 'lkw_beteiligt',
            variations: [
                'Gefahrgut-LKW',
                'orangene Warntafeln',
                'Chemikalien'
            ],
            feuerwehr_mit_gefahrgut_zug: 1.0,
            abstand_halten: 1.0,
            evakuierung_evtl: 0.5
        },
        
        einsturzgefahr: {
            probability: 0.02,
            variations: [
                'gegen Hauswand gefahren',
                'Gebäude beschädigt'
            ],
            feuerwehr_statiker: 1.0
        },
        
        stromunfall: {
            probability: 0.01,
            variations: [
                'in Strommast gefahren',
                'Oberleitung beschädigt'
            ],
            stromversorger: 1.0,
            nicht_nähern: 1.0
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        stadtstraße: {
            probability: 0.35,
            address_types: ['road', 'street'],
            kreuzung_oft: 0.6
        },
        
        landstraße: {
            probability: 0.25,
            address_types: ['road'],
            ortsbeschreibung_wichtig: 1.0,
            anfahrt_länger: 0.6
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
            geschwindigkeit_niedrig: 1.0
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
                'Polytrauma'
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
                    funkspruch: '{callsign}, Person eingeklemmt, FW zur Befreiung, kommen.'
                },
                verkehrssicherung: {
                    probability: 0.4,
                    funkspruch: '{callsign}, VU auf Autobahn, FW zur Verkehrssicherung, kommen.'
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
                personalienfeststellung: 1.0
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
                'Trauma-Center erforderlich'
            ],
            funkspruch: '{callsign}, benötigen RTH, Patient polytraumatisiert, kommen.'
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            patient_dekompensiert: {
                probability: 0.15,
                trigger_time: { min: 180, max: 480 },
                changes: ['innere Blutung', 'Schock entwickelt sich'],
                kritisch: 1.0
            },
            
            weitere_verletzte: {
                probability: 0.15,
                siehe: 'anrufer.dynamik.weitere_verletzte_entdeckt'
            }
        },
        
        komplikationen: {
            befreiung_dauert: {
                probability: 0.2,
                condition: 'eingeklemmt',
                trigger_time: { min: 300, max: 1200 },
                info: 'Technische Rettung dauert lange',
                crush_syndrom_risiko: 0.4
            },
            
            brand_entwickelt_sich: {
                probability: 0.03,
                trigger_time: { min: 120, max: 300 },
                changes: 'Fahrzeug fängt Feuer!',
                kritisch: 1.0,
                evakuierung_schnell: 1.0
            }
        },
        
        besserung: {
            harmloser_als_gedacht: {
                probability: 0.2,
                funkspruch: '{callsign}, Lage harmloser als gemeldet, nur Blechschaden, kommen.',
                ktw_reicht: 0.6
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
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'polytrauma_oder_kritisch',
                hospitals: ['klinikum_ludwigsburg', 'katharinenhospital_stuttgart'],
                reason: 'Überregionales Traumazentrum',
                schockraum: 1.0
            },
            
            priorität_2: {
                condition: 'schwere_verletzungen',
                hospitals: ['rems_murr_klinikum_winnenden', 'klinikum_ludwigsburg'],
                reason: 'Unfallchirurgie'
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
                'Vitalparameter',
                'Gurt getragen?',
                'Airbag ausgelöst?'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'VU mit {anzahl} beteiligten Fahrzeugen, {anzahl} Verletzte',
            'Verkehrsunfall auf {straße}, Patient eingeklemmt',
            'VU Autobahn, schwer verletzter Patient',
            'Auffahrunfall, HWS-Trauma vermutet',
            'VU mit Motorrad, Patient schwer verletzt'
        ],
        
        nachforderungen: [
            'Benötigen FW zur Befreiung, Person eingeklemmt!',
            'Zweiter RTW erforderlich, weitere Verletzte!',
            'RTH angefordert, Polytrauma!'
        ]
    },
    
    // ========================================
    // 📊 SPECIAL
    // ========================================
    special: {
        alkohol_drogen: {
            probability: 0.15,
            variations: [
                'Fahrer riecht nach Alkohol',
                'betrunken',
                'Hinweise auf Drogenkonsum'
            ],
            polizei_blutprobe: 0.9,
            rechtliche_konsequenzen: 1.0
        },
        
        fahrerflucht: {
            probability: 0.05,
            variations: [
                'Fahrer ist geflüchtet',
                'hat sich aus dem Staub gemacht'
            ],
            polizei_fahndung: 1.0
        },
        
        rettungsgasse: {
            problem: {
                probability: 0.4,
                condition: 'autobahn',
                variations: [
                    'keine Rettungsgasse',
                    'Anfahrt blockiert',
                    'kommen nicht durch'
                ],
                zeitverzögerung: 0.8
            }
        },
        
        dashcam_aufnahme: {
            probability: 0.1,
            info: 'Zeuge hat Dashcam-Aufnahme',
            polizei_interesse: 0.9
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VERKEHRSUNFALL_TEMPLATE };
}
