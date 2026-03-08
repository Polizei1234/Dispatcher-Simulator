// =========================================================================================
// BEWUSSTLOSIGKEIT TEMPLATE V2.0 - Unklare Ursache, kritischer Zustand
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const BEWUSSTLOSIGKEIT_UNKLAR_TEMPLATE = {
    
    id: 'bewusstlosigkeit_unklar',
    kategorie: 'rd',
    stichwort: 'Bewusstlosigkeit (unklare Ursache)',
    weight: 2,  // Kritisch, aber nicht extrem häufig
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            zeuge_panisch: {
                probability: 0.45,
                speech_pattern: 'panisch, aufgeregt',
                variations: [
                    'Jemand liegt hier bewusstlos!',
                    'Eine Person reagiert nicht!',
                    'Hilfe! Jemand ist bewusstlos!',
                    'Jemand liegt regungslos am Boden!',
                    'Hier liegt jemand, der bewegt sich nicht!',
                    'Eine Person ist zusammengebrochen!'
                ],
                info: 'Fremde Person, wenig Infos',
                effects: {
                    genaue_infos_fehlen: 0.9,
                    vorgeschichte_unbekannt: 0.95,
                    keine_atmungsprüfung: 0.6
                }
            },
            
            angehöriger_panisch: {
                probability: 0.35,
                speech_pattern: 'sehr_panisch, emotional',
                variations: [
                    'Mein Mann reagiert nicht mehr!',
                    'Sie ist bewusstlos! Ich bekomme sie nicht wach!',
                    'Er liegt am Boden und bewegt sich nicht!',
                    'Meine Frau wacht nicht auf!',
                    'Ich kann ihn nicht wecken!'
                ],
                info: 'Kennt Vorgeschichte',
                effects: {
                    vorerkrankungen_bekannt: 0.8,
                    medikamente_bekannt: 0.7,
                    sehr_emotional: 0.9
                }
            },
            
            polizei: {
                probability: 0.12,
                speech_pattern: 'professionell, strukturiert',
                variations: [
                    'Polizei, bewusstlose Person aufgefunden',
                    'Person auf offener Straße bewusstlos',
                    'Bewusstlose Person, Ursache unklar',
                    'Verdacht auf Intoxikation, Person nicht ansprechbar'
                ],
                info: 'Oft öffentliche Orte',
                effects: {
                    polizei_bereits_vor_ort: 1.0,
                    verkehrssicherung_erfolgt: 0.9,
                    intoxikation_wahrscheinlicher: 0.4
                }
            },
            
            sanitäter_vor_ort: {
                probability: 0.05,
                speech_pattern: 'professionell, medizinisch',
                variations: [
                    'Sanitäter vor Ort, Person bewusstlos, GCS 3',
                    'Ersthelfer hier, Patient nicht ansprechbar',
                    'Betriebssanitäter, bewusstlose Person'
                ],
                info: 'Erstversorgung bereits begonnen',
                effects: {
                    vitalparameter_bekannt: 0.8,
                    lagerung_erfolgt: 0.9,
                    professionelle_versorgung: 1.0
                }
            },
            
            passant_unsicher: {
                probability: 0.03,
                speech_pattern: 'unsicher, zögernd',
                variations: [
                    'Ich glaube, da liegt jemand... bewegt sich nicht',
                    'Ist die Person da tot oder bewusstlos?',
                    'Ich trau mich nicht näher ran'
                ],
                effects: {
                    keine_näheren_infos: 0.9,
                    kein_kontakt_zum_patienten: 0.8
                }
            }
        },
        
        dynamik: {
            atmung_verändert: {
                probability: 0.2,
                trigger_time: { min: 60, max: 180 },
                variations: [
                    'Die Atmung wird schwächer!',
                    'Er atmet ganz komisch!',
                    'Ich glaube, er atmet nicht mehr!'
                ],
                effects: {
                    reanimation_wahrscheinlich: 0.4,
                    kritischer: 1.0
                }
            },
            
            patient_wacht_auf: {
                probability: 0.25,
                trigger_time: { min: 30, max: 120 },
                variations: [
                    'Er wacht auf!',
                    'Sie bewegt sich!',
                    'Er öffnet die Augen!',
                    'Sie reagiert wieder!'
                ],
                effects: {
                    diagnose_erleichtert: 0.7,
                    transport_einfacher: 0.8
                }
            },
            
            krampfanfall_einsetzt: {
                probability: 0.15,
                trigger_time: { min: 60, max: 240 },
                change: 'Patient bekommt Krampfanfall!',
                effects: {
                    upgrade_stichwort: 'Krampfanfall',
                    verletzungsgefahr: 0.6
                }
            },
            
            erbrechen: {
                probability: 0.2,
                trigger_time: { min: 30, max: 180 },
                change: 'Patient erbricht!',
                effects: {
                    aspirationsgefahr: 1.0,
                    seitenlage_zwingend: 1.0,
                    absaugung_nötig: 0.8
                }
            }
        },
        
        atmungsprüfung: {
            wurde_geprüft: {
                probability: 0.4,
                results: {
                    atmet_normal: 0.6,
                    atmet_flach: 0.25,
                    atmet_nicht: 0.15
                }
            },
            wurde_nicht_geprüft: {
                probability: 0.6,
                info: 'Anrufer weiß nicht, wie man Atmung prüft',
                telefonanleitung_nötig: 1.0
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
            distribution: 'bimodal',
            peaks: [
                { age: 35, weight: 0.3 },  // Intoxikation, Trauma
                { age: 70, weight: 0.4 }   // Schlaganfall, Herzprobleme
            ],
            min: 16,
            max: 95,
            info: 'Zwei Altersgipfel: Jung (Intox) und Alt (Schlaganfall)'
        },
        
        bewusstseinszustand: {
            bewusstlos_keine_reaktion: {
                probability: 0.5,
                gcs: { min: 3, max: 6 },
                info: 'Tiefe Bewusstlosigkeit',
                kritisch: 1.0
            },
            bewusstlos_reaktion_auf_schmerz: {
                probability: 0.3,
                gcs: { min: 7, max: 10 },
                info: 'Mittlere Bewusstlosigkeit'
            },
            somnolent: {
                probability: 0.15,
                gcs: { min: 11, max: 13 },
                info: 'Schläfrig, aber erweckbar'
            },
            koma: {
                probability: 0.05,
                gcs: 3,
                info: 'Tiefes Koma',
                kritisch: 1.0,
                intubation_wahrscheinlich: 0.9
            }
        },
        
        glasgow_coma_scale: {
            augen: {
                spontan: { score: 4, probability: 0.1 },
                auf_ansprache: { score: 3, probability: 0.15 },
                auf_schmerz: { score: 2, probability: 0.4 },
                keine: { score: 1, probability: 0.35 }
            },
            verbal: {
                orientiert: { score: 5, probability: 0.05 },
                verwirrt: { score: 4, probability: 0.1 },
                unzusammenhängend: { score: 3, probability: 0.2 },
                unverständlich: { score: 2, probability: 0.3 },
                keine: { score: 1, probability: 0.35 }
            },
            motorik: {
                befolgt_aufforderung: { score: 6, probability: 0.05 },
                gezielte_abwehr: { score: 5, probability: 0.15 },
                ungezielte_abwehr: { score: 4, probability: 0.25 },
                beugesynergismen: { score: 3, probability: 0.2 },
                strecksynergismen: { score: 2, probability: 0.15 },
                keine: { score: 1, probability: 0.2 }
            },
            info: 'GCS 3-8 = kritisch, Intubation erwägen'
        }
    },
    
    // ========================================
    // 🔍 DIFFERENTIALDIAGNOSEN - Das Wichtigste!
    // ========================================
    ursachen: {
        synkope: {
            probability: 0.20,
            info: 'Kreislaufbedingte Bewusstlosigkeit, meist kurz',
            dauer: '< 2 Minuten meist',
            indicators: [
                'War kurz bewusstlos, jetzt wieder wach',
                'Ist einfach umgekippt',
                'Stand lange, dann zusammengebrochen'
            ],
            aufwachen_schnell: 0.8,
            prognose: 'meist gut',
            siehe_auch: 'synkope_template'
        },
        
        hypoglykämie: {
            probability: 0.18,
            info: 'Unterzuckerung, besonders Diabetiker',
            indicators: [
                'Hat Diabetes',
                'Ist Diabetiker',
                'Schwitzt stark',
                'War verwirrt, dann bewusstlos'
            ],
            diagnose: {
                bz_messung_zwingend: 1.0,
                schwelle: '< 50 mg/dl',
                behandlung: 'Glucose i.v. oder Glukagon i.m.'
            },
            aufwachen_nach_glucose: 0.9,
            schnelle_besserung_typisch: 1.0,
            info_crew: 'BZ sofort messen!'
        },
        
        intoxikation: {
            probability: 0.15,
            types: {
                alkohol: {
                    probability: 0.5,
                    indicators: ['Alkoholgeruch', 'Flaschen', 'Party'],
                    aspirationsgefahr: 0.7
                },
                drogen: {
                    probability: 0.3,
                    substances: ['Heroin', 'Amphetamine', 'GHB/GBL', 'Benzodiazepine'],
                    ateminsuffizienz_häufig: 0.6
                },
                medikamente: {
                    probability: 0.15,
                    oft_suizidversuch: 0.7,
                    psychiatrie_kontakt: 0.8
                },
                co_vergiftung: {
                    probability: 0.05,
                    gefahr_für_retter: 1.0,
                    mehrere_betroffene_möglich: 0.6
                }
            },
            diagnose: 'Anamnese, Spuren, Pupillen',
            giftnotruf_evtl: 0.3,
            psychiatrie_evtl: 0.4
        },
        
        schlaganfall: {
            probability: 0.15,
            info: 'Bewusstlosigkeit durch Hirnschädigung',
            indicators: [
                'Älterer Patient',
                'Halbseitenlähmung sichtbar',
                'Gesicht hängt',
                'Ungleiche Pupillen'
            ],
            fast_test: {
                face: 0.6,
                arms: 0.7,
                speech: 0.5,  // Kann man bei Bewusstlosigkeit nicht testen
                time: 1.0
            },
            stroke_unit_zwingend: 1.0,
            zeitkritisch: 1.0,
            prognose: 'abhängig von schneller Behandlung',
            siehe_auch: 'schlaganfall_template'
        },
        
        krampfanfall: {
            probability: 0.12,
            info: 'Postiktale Phase nach Krampfanfall',
            indicators: [
                'Hatte Krampfanfall',
                'Hat sich eingenässt',
                'Zungenbiss',
                'Verwirrt, dann bewusstlos'
            ],
            verletzungen_häufig: 0.5,
            aufwachen_meist: 0.85,
            dauer_bewusstlosigkeit: '5-30 Minuten',
            erneuter_anfall_möglich: 0.2,
            siehe_auch: 'krampfanfall_template'
        },
        
        herzrhythmusstörung: {
            probability: 0.08,
            types: {
                vt_vf: {
                    probability: 0.3,
                    info: 'Ventrikuläre Tachykardie/Flimmern',
                    reanimation_wahrscheinlich: 0.8
                },
                bradykardie: {
                    probability: 0.4,
                    info: 'Zu langsamer Herzschlag',
                    schrittmacher_evtl: 0.3
                },
                tachykardie: {
                    probability: 0.3,
                    info: 'Zu schneller Herzschlag'
                }
            },
            ekg_zwingend: 1.0,
            nef_fast_immer: 0.9
        },
        
        trauma: {
            probability: 0.05,
            info: 'Kopfverletzung, innere Blutung',
            indicators: [
                'Ist gefallen',
                'Wurde geschlagen',
                'Kopfwunde sichtbar',
                'Blut am Boden'
            ],
            diagnosen: {
                schädelhirntrauma: {
                    probability: 0.6,
                    ct_zwingend: 1.0,
                    hws_immobilisation: 0.8
                },
                innere_blutung: {
                    probability: 0.3,
                    schock_wahrscheinlich: 0.6
                },
                wirbelsäulenverletzung: {
                    probability: 0.1,
                    immobilisation_zwingend: 1.0
                }
            },
            polizei_oft_nötig: 0.6
        },
        
        hypoxie: {
            probability: 0.03,
            ursachen: {
                ertrinken: 0.2,
                erstickung: 0.3,
                co_vergiftung: 0.2,
                asthma_schwer: 0.15,
                lungenödem: 0.15
            },
            sauerstoff_zwingend: 1.0,
            intubation_häufig: 0.6,
            info: 'Sauerstoffmangel im Gehirn'
        },
        
        sepsis: {
            probability: 0.02,
            info: 'Blutvergiftung mit Bewusstseinsstörung',
            indicators: [
                'Fieber',
                'Schlechter Allgemeinzustand',
                'Vorerkrankung bekannt'
            ],
            kritisch: 1.0,
            antibiotika_schnell: 1.0
        },
        
        stoffwechselentgleisung: {
            probability: 0.015,
            types: {
                ketoazidose: 0.4,
                leberversagen: 0.3,
                nierenversagen: 0.2,
                elektrolytstörung: 0.1
            },
            labor_wichtig: 1.0
        },
        
        psychogen: {
            probability: 0.005,
            info: 'Psychogene Bewusstlosigkeit (sehr selten)',
            indicators: [
                'Augenlider flattern',
                'Widerstand bei Augenöffnung',
                'Normale Vitalparameter'
            ],
            organische_ursache_ausschließen: 1.0,
            info_crew: 'Trotzdem ernst nehmen!'
        }
    },
    
    // ========================================
    // 🫁 ATMUNG - KRITISCH!
    // ========================================
    atmung: {
        normal: {
            probability: 0.55,
            frequenz: { min: 12, max: 20 },
            spo2: { min: 94, max: 100 },
            info: 'Atmung ausreichend'
        },
        
        flach: {
            probability: 0.25,
            frequenz: { min: 8, max: 11 },
            spo2: { min: 85, max: 93 },
            info: 'Hypoventilation',
            sauerstoff_geben: 1.0,
            beatmung_evtl: 0.4
        },
        
        schnappatmung: {
            probability: 0.08,
            frequenz: { min: 2, max: 6 },
            spo2: { min: 60, max: 80 },
            info: 'Agonale Atmung - Reanimation vorbereiten!',
            kritisch: 1.0,
            reanimation_wahrscheinlich: 0.9
        },
        
        keine: {
            probability: 0.12,
            info: 'Atemstillstand',
            upgrade_stichwort: 'Reanimation',
            reanimation_sofort: 1.0,
            kritisch: 1.0
        },
        
        geräusche: {
            schnarchen: {
                probability: 0.3,
                info: 'Atemwegsverlegung durch Zunge',
                esmarch_handgriff: 1.0,
                guedel_tubus_evtl: 0.7
            },
            röcheln: {
                probability: 0.15,
                info: 'Sekret/Erbrochenes in Atemwegen',
                absaugen_zwingend: 1.0,
                aspirationsgefahr: 1.0
            },
            giemen: {
                probability: 0.05,
                info: 'Bronchospasmus',
                asthma_copd_wahrscheinlich: 0.8
            }
        }
    },
    
    // ========================================
    // 🩺 MEDIZINISCH
    // ========================================
    medizinisch: {
        vorerkrankungen: {
            probability: 0.7,
            types: {
                diabetes: {
                    probability: 0.4,
                    hypoglykämie_wahrscheinlich: 0.8,
                    bz_messen: 1.0
                },
                epilepsie: {
                    probability: 0.25,
                    krampfanfall_wahrscheinlich: 0.9,
                    medikamente_vergessen: 0.5
                },
                herzerkrankung: {
                    probability: 0.3,
                    rhythmusstörung_wahrscheinlich: 0.7
                },
                schlaganfall_früher: {
                    probability: 0.2,
                    erneuter_schlaganfall_wahrscheinlich: 0.6
                },
                niereninsuffizienz: {
                    probability: 0.15,
                    dialyse: 0.7
                },
                leberzirrhose: {
                    probability: 0.1,
                    hepatische_enzephalopathie: 0.8
                }
            }
        },
        
        medikamente: {
            probability: 0.65,
            types: {
                insulin: {
                    probability: 0.3,
                    hypoglykämie_risiko: 0.8
                },
                antiepileptika: {
                    probability: 0.2,
                    vergessen_einnahme: 0.5
                },
                antiarrhythmika: {
                    probability: 0.15
                },
                psychopharmaka: {
                    probability: 0.2,
                    intoxikation_möglich: 0.4
                },
                blutverdünner: {
                    probability: 0.25,
                    blutungsgefahr_erhöht: 0.9
                }
            }
        },
        
        vitalparameter: {
            kreislauf: {
                stabil: {
                    probability: 0.6,
                    rr_systolisch: { min: 110, max: 160 },
                    hf: { min: 60, max: 100 }
                },
                instabil: {
                    probability: 0.3,
                    rr_systolisch: { min: 70, max: 109 },
                    hf: { min: 40, max: 140 },
                    schock_möglich: 0.5
                },
                kritisch: {
                    probability: 0.1,
                    rr_systolisch: { min: 0, max: 69 },
                    reanimation_droht: 0.8
                }
            },
            
            temperatur: {
                normal: { probability: 0.7 },
                hypothermie: { 
                    probability: 0.1,
                    ursachen: ['Lange gelegen', 'Intoxikation', 'Winter']
                },
                fieber: { 
                    probability: 0.2,
                    ursachen: ['Sepsis', 'Meningitis', 'Infektion']
                }
            },
            
            pupillen: {
                isokor_normal: {
                    probability: 0.6,
                    info: 'Gleich groß, normal reaktiv'
                },
                isokor_eng: {
                    probability: 0.15,
                    ursachen: ['Opiate', 'Medikamente'],
                    intoxikation_wahrscheinlich: 0.8
                },
                isokor_weit: {
                    probability: 0.1,
                    ursachen: ['Amphetamine', 'Kokain', 'Atropin']
                },
                anisokor: {
                    probability: 0.1,
                    info: 'Unterschiedlich groß',
                    schlaganfall_wahrscheinlich: 0.6,
                    sht_wahrscheinlich: 0.3,
                    kritisch: 1.0
                },
                lichtstarr: {
                    probability: 0.05,
                    info: 'Reagieren nicht auf Licht',
                    hirnschädigung_wahrscheinlich: 0.9,
                    kritisch: 1.0
                }
            }
        },
        
        zusatzdiagnostik: {
            blutzucker: {
                zwingend: 1.0,
                info: 'Immer bei Bewusstlosigkeit messen!',
                dauer: '< 1 Minute'
            },
            ekg: {
                zwingend: 0.9,
                info: 'Rhythmusstörung ausschließen'
            },
            temperatur: {
                empfohlen: 0.7
            },
            neurologie: {
                fast_check: 0.8,
                pupillen: 1.0,
                motorik: 0.9,
                reflexe: 0.6
            }
        }
    },
    
    // ========================================
    // 🏠 UMGEBUNG
    // ========================================
    umgebung: {
        fundort: {
            wohnung_bett: {
                probability: 0.25,
                info: 'Patient im Bett aufgefunden',
                morgens_häufig: 0.7
            },
            wohnung_boden: {
                probability: 0.2,
                info: 'Am Boden liegend',
                sturzfolgen_möglich: 0.5
            },
            straße: {
                probability: 0.25,
                info: 'Öffentlicher Ort',
                polizei_oft: 0.7,
                zeugen: { min: 1, max: 5 },
                verkehrsgefahr: 0.6
            },
            arbeitsplatz: {
                probability: 0.1,
                info: 'Betrieblicher Notfall',
                ersthelfer_oft: 0.8
            },
            bad: {
                probability: 0.08,
                info: 'Im Badezimmer',
                tür_oft_verschlossen: 0.4,
                sturzgefahr: 0.6
            },
            auto: {
                probability: 0.07,
                info: 'Im Fahrzeug',
                co_vergiftung_möglich: 0.3,
                unfallursache_möglich: 0.4
            },
            sonstiges: {
                probability: 0.05
            }
        },
        
        lagerung: {
            rückenlage: {
                probability: 0.5,
                aspirationsgefahr: 0.7,
                seitenlage_empfohlen: 1.0
            },
            bauchlage: {
                probability: 0.1,
                atmung_behindert: 0.6,
                umdrehen_nötig: 1.0
            },
            seitenlage: {
                probability: 0.15,
                info: 'Optimal bei Bewusstlosigkeit',
                bereits_korrekt: 1.0
            },
            sitzend: {
                probability: 0.2,
                ort_meist: 'Stuhl, Auto',
                flachlagerung_empfohlen: 0.8
            },
            ungünstig: {
                probability: 0.05,
                variations: ['Treppe', 'Zwischen Möbeln', 'Beengt']
            }
        },
        
        gebäude: {
            zugang_schwierig: {
                probability: 0.15,
                reasons: {
                    tür_verschlossen: 0.6,
                    kein_aufzug: 0.3,
                    enge_treppen: 0.1
                },
                feuerwehr_evtl: 0.5
            }
        },
        
        gefahren: {
            verkehr: {
                probability: 0.2,
                condition: 'öffentlicher_ort',
                polizei_für_absicherung: 1.0
            },
            co_vergiftung: {
                probability: 0.02,
                indicators: ['Geschlossener Raum', 'Mehrere Betroffene', 'Winter'],
                eigenschutz: 1.0,
                feuerwehr_zwingend: 1.0
            },
            gewalt: {
                probability: 0.08,
                indicators: ['Verletzungen', 'Aggressive Umstehende'],
                polizei_zwingend: 1.0
            }
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK
    // ========================================
    sozial: {
        umstehende: {
            keine: {
                probability: 0.3,
                info: 'Patient allein aufgefunden',
                vorgeschichte_unklar: 1.0
            },
            angehörige: {
                probability: 0.35,
                emotional: 0.9,
                infos_vorhanden: 0.8,
                wollen_mitfahren: 0.8
            },
            zeugen: {
                probability: 0.25,
                anzahl: { min: 1, max: 8 },
                infos_bruchstückhaft: 0.7,
                gaffer_problem: 0.4
            },
            polizei: {
                probability: 0.1,
                bereits_vor_ort: 1.0,
                absicherung_erfolgt: 0.9
            }
        },
        
        ersthelfer: {
            vorhanden: {
                probability: 0.4,
                maßnahmen: {
                    seitenlage: 0.6,
                    ansprache: 0.9,
                    notruf: 1.0,
                    decke: 0.4
                },
                telefonreanimation_evtl: 0.15
            }
        },
        
        emotionale_belastung: {
            angehörige_panisch: {
                probability: 0.6,
                betreuung_nötig: 0.8
            },
            zeugen_schockiert: {
                probability: 0.3
            }
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        öffentlich: {
            probability: 0.3,
            address_types: ['street', 'pedestrian', 'public_place', 'park'],
            besonderheiten: {
                zeugen_vorhanden: 0.9,
                polizei_oft: 0.7,
                verkehrssicherung: 0.6,
                gaffer: 0.5
            }
        },
        
        wohnhaus: {
            probability: 0.55,
            address_types: ['residential', 'apartment'],
            besonderheiten: {
                vorgeschichte_eher_bekannt: 0.7,
                angehörige_oft: 0.6
            }
        },
        
        arbeitsplatz: {
            probability: 0.08,
            address_types: ['office', 'industrial', 'commercial'],
            besonderheiten: {
                betriebssanitäter_evtl: 0.4,
                ersthelfer_geschult: 0.7
            }
        },
        
        pflegeheim: {
            probability: 0.05,
            address_types: ['nursing_home'],
            besonderheiten: {
                personal_vor_ort: 1.0,
                vorerkrankungen_bekannt: 1.0,
                dnr_evtl_vorhanden: 0.3
            }
        },
        
        fahrzeug: {
            probability: 0.02,
            address_types: ['parking', 'street'],
            besonderheiten: {
                bergung_schwierig: 0.5,
                unfallursache_möglich: 0.4
            }
        }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN
    // ========================================
    nachforderungen: {
        nef: {
            probability: 0.8,
            trigger_time: { min: 0, max: 60 },
            reasons: [
                'Bewusstlosigkeit ungeklärter Ursache',
                'GCS < 9',
                'Atemwegssicherung nötig',
                'Instabile Vitalparameter',
                'Intubation erforderlich'
            ],
            funkspruch: '{callsign}, Patient bewusstlos, GCS {gcs}, benötigen NEF, kommen.',
            info: 'Bei Bewusstlosigkeit fast immer NEF!'
        },
        
        feuerwehr: {
            probability: 0.25,
            trigger_time: { min: 0, max: 120 },
            reasons: {
                türöffnung: {
                    probability: 0.5,
                    funkspruch: '{callsign}, kein Zugang, Patient bewusstlos, FW zur Türöffnung, kommen.'
                },
                co_verdacht: {
                    probability: 0.2,
                    funkspruch: '{callsign}, Verdacht CO-Vergiftung, FW zur Messung und Lüftung, kommen.',
                    eigenschutz: 1.0
                },
                tragehilfe: {
                    probability: 0.2,
                    condition: 'kein_aufzug'
                },
                befreiung: {
                    probability: 0.1,
                    ort: 'Fahrzeug, eingeklemmt'
                }
            }
        },
        
        polizei: {
            probability: 0.35,
            trigger_time: { min: 0, max: 60 },
            reasons: {
                verkehrssicherung: {
                    probability: 0.5,
                    condition: 'öffentlicher_ort'
                },
                gewalt_verdacht: {
                    probability: 0.2,
                    funkspruch: '{callsign}, Verdacht auf Fremdverschulden, Polizei angefordert, kommen.'
                },
                intoxikation: {
                    probability: 0.2,
                    drogen_verdacht: 0.8
                },
                unbekannte_person: {
                    probability: 0.1,
                    identität_klären: 1.0
                }
            }
        },
        
        rettungshubschrauber: {
            probability: 0.02,
            reasons: [
                'Polytrauma ländlich',
                'Zeitkritischer Schlaganfall, keine Stroke Unit nah'
            ]
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            reanimation: {
                probability: 0.12,
                trigger_time: { min: 60, max: 300 },
                changes: [
                    'Patient atmet nicht mehr!',
                    'Kein Puls mehr tastbar!',
                    'Patient wird blau!'
                ],
                upgrade_stichwort: 'Reanimation',
                kritisch: 1.0,
                funkspruch: '{callsign}, Patient reanimationspflichtig, beginnen mit CPR, kommen!'
            },
            
            aspiration: {
                probability: 0.15,
                trigger_time: { min: 30, max: 180 },
                change: 'Patient erbricht und aspiriert!',
                effects: {
                    absaugen_zwingend: 1.0,
                    intubation_wahrscheinlich: 0.6,
                    spo2_fällt: 0.9
                }
            },
            
            krampfanfall: {
                probability: 0.15,
                trigger_time: { min: 60, max: 240 },
                change: 'Patient bekommt Krampfanfall!',
                verletzungsgefahr: 0.5
            },
            
            agitation: {
                probability: 0.1,
                trigger_time: { min: 120, max: 300 },
                change: 'Patient wird unruhig und aggressiv!',
                intoxikation_wahrscheinlich: 0.7,
                fixierung_evtl: 0.4
            }
        },
        
        besserung: {
            erwacht_orientiert: {
                probability: 0.3,
                trigger_time: { min: 60, max: 180 },
                funkspruch: '{callsign}, Patient erwacht, orientiert, Vitalparameter stabil, kommen.',
                diagnose_erleichtert: 1.0,
                transport_einfacher: 0.9
            },
            
            erwacht_verwirrt: {
                probability: 0.25,
                trigger_time: { min: 90, max: 240 },
                change: 'Patient wacht auf, aber verwirrt',
                ursache_weiter_unklar: 0.7
            },
            
            glucose_wirkt: {
                probability: 0.15,
                condition: 'hypoglykämie',
                trigger_time: { min: 2, max: 5 },
                change: 'Nach Glucose-Gabe: Patient erwacht!',
                dramatische_besserung: 1.0,
                info: 'Typisch für Hypoglykämie'
            }
        },
        
        komplikationen: {
            hirnödem: {
                probability: 0.05,
                ursachen: ['Schlaganfall', 'SHT', 'Hypoxie'],
                verschlechterung_schleichend: 0.8,
                intubation_oft: 0.7
            },
            
            schock: {
                probability: 0.08,
                types: {
                    hypovolämisch: 0.4,
                    kardiogen: 0.3,
                    septisch: 0.2,
                    anaphylaktisch: 0.1
                },
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
            nef: 0.8,
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'schlaganfall_verdacht',
                hospitals: ['stroke_unit'],
                reason: 'Stroke Unit zwingend',
                zeitkritisch: 1.0
            },
            
            priorität_2: {
                condition: 'trauma_sht',
                hospitals: ['traumazentrum', 'neurochirurgie'],
                reason: 'CT und Neurochirurgie verfügbar'
            },
            
            priorität_3: {
                condition: 'intoxikation',
                hospitals: ['mit_intensivstation'],
                reason: 'Überwachung und evtl. Antidot',
                psychiatrie_evtl: 0.4
            },
            
            priorität_4: {
                condition: 'standard',
                hospitals: ['nächstgelegenes_mit_notaufnahme'],
                reason: 'Abklärung und Überwachung'
            }
        },
        
        transport: {
            intubiert: {
                probability: 0.15,
                beatmung: 1.0,
                nef_begleitung: 1.0
            },
            spontan_atmend: {
                probability: 0.7,
                seitenlage: 0.9,
                sauerstoff: 0.8
            },
            sitzend: {
                probability: 0.15,
                condition: 'aufgewacht_und_stabil'
            }
        },
        
        voranmeldung: {
            immer: 1.0,
            infos: [
                'Bewusstseinszustand (GCS)',
                'Verdachtsdiagnose',
                'Vitalparameter',
                'Intubiert ja/nein',
                'Begleiterkrankungen'
            ]
        }
    },
    
    // ========================================
    // 📊 PROTOKOLL & BEWERTUNG
    // ========================================
    protokoll: {
        tracked_data: {
            gcs_score: 'FROM_CALL',
            atmung_geprüft: 'FROM_CALL',
            blutzucker_gemessen: 'FROM_DISPOSITION',
            seitenlage_durchgeführt: 'FROM_DISPOSITION',
            nef_disponiert: 'FROM_DISPOSITION',
            ursache_erkannt: 'FROM_SIMULATION',
            outcome: 'FROM_SIMULATION'
        },
        
        bewertung: {
            kriterien: {
                atmung_sofort_geprüft: {
                    wichtig: 'kritisch',
                    info: 'Erste Frage: Atmet der Patient?',
                    ohne_lebensbedrohlich: 1.0
                },
                
                nef_disponiert: {
                    wichtig: 'hoch',
                    info: 'Bewusstlosigkeit = fast immer NEF',
                    ausnahme: 'Synkope mit schnellem Aufwachen'
                },
                
                blutzucker_erfragt: {
                    wichtig: 'hoch',
                    info: 'BZ-Messung gehört zur Basisdiagnostik',
                    hypoglykämie_häufig: 0.18
                },
                
                seitenlage_empfohlen: {
                    wichtig: 'hoch',
                    condition: 'bewusstlos_und_atmend',
                    info: 'Aspirationsschutz!'
                },
                
                schlaganfall_erwogen: {
                    wichtig: 'kritisch',
                    info: 'Bei älteren Patienten immer an Schlaganfall denken',
                    zeitkritisch: 1.0
                },
                
                intoxikation_erkannt: {
                    wichtig: 'mittel',
                    info: 'Hinweise auf Drogen/Alkohol?',
                    polizei_evtl: 0.3
                }
            },
            
            kritische_fehler: [
                'Atmung nicht geprüft',
                'NEF bei GCS < 9 nicht disponiert',
                'Schlaganfall nicht erkannt → falsche Klinik',
                'Rückenlage belassen bei Bewusstlosigkeit',
                'Reanimationspflichtigkeit nicht erkannt'
            ],
            
            häufige_fehler: [
                'Blutzucker nicht gemessen',
                'Ursache nicht systematisch gesucht',
                'Vorgeschichte nicht erfragt',
                'GCS nicht dokumentiert',
                'Seitenlage vergessen'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient bewusstlos, GCS {gcs}, Atmung vorhanden',
            'Bewusstlose Person, Ursache unklar, Atmung flach',
            'Patient nicht ansprechbar, BZ {wert}, Verdacht Hypoglykämie',
            'Bewusstlos nach Krampfanfall, postiktal',
            'Person bewusstlos, Verdacht Schlaganfall, halbseitige Lähmung',
            'Bewusstlosigkeit bei Intoxikation, Alkoholgeruch',
            'Patient somnolent, weckbar, BZ {wert}'
        ],
        
        nachforderungen: [
            'Benötigen NEF, Patient bewusstlos, GCS {gcs}, Intubation evtl. nötig',
            'FW zur Türöffnung, bewusstloser Patient, kein Zugang',
            'Polizei für Verkehrssicherung, Patient auf Fahrbahn',
            'Verdacht CO-Vergiftung, FW zur Messung angefordert'
        ],
        
        besonderheiten: [
            'Patient aspiriert, Absaugung läuft',
            'Nach Glucose-Gabe: Patient erwacht',
            'Atmung sistiert, beginnen mit Reanimation',
            'Pupillen anisokor, Verdacht Hirndruckerhöhung'
        ]
    },
    
    // ========================================
    // 🎯 SPECIAL - BEWUSSTLOSIGKEIT-SPEZIFISCH
    // ========================================
    special: {
        // ABCDE-Schema
        abcde_assessment: {
            airway: {
                frei: 0.6,
                verlegt: 0.25,
                nicht_gesichert: 0.15,
                maßnahmen: ['Esmarch', 'Guedel-Tubus', 'Absaugen', 'Intubation']
            },
            breathing: {
                siehe: 'atmung'
            },
            circulation: {
                siehe: 'medizinisch.vitalparameter.kreislauf'
            },
            disability: {
                siehe: 'patient.glasgow_coma_scale'
            },
            exposure: {
                verletzungen_suchen: 1.0,
                unterkühlung_vermeiden: 0.8
            }
        },
        
        // Atemwegsmanagement
        atemweg: {
            seitenlage: {
                indikation: 'Bewusstlos + atmend',
                schutz_vor_aspiration: 1.0,
                standard: 1.0
            },
            guedel_tubus: {
                indikation: 'GCS < 9, fehlender Würgereflex',
                probability: 0.3
            },
            larynxtubus: {
                indikation: 'Intubation nicht möglich',
                probability: 0.1
            },
            intubation: {
                indikation: 'GCS ≤ 8, Ateminsuffizienz',
                probability: 0.15,
                nur_nef: 1.0
            }
        },
        
        // Aufwach-Szenarien
        aufwachen: {
            schnell_orientiert: {
                probability: 0.3,
                ursachen: ['Synkope', 'Hypoglykämie nach Glucose'],
                dauer: '< 5 Minuten',
                prognose: 'gut'
            },
            langsam_verwirrt: {
                probability: 0.25,
                ursachen: ['Krampfanfall', 'Intoxikation'],
                dauer: '10-30 Minuten'
            },
            wacht_nicht_auf: {
                probability: 0.45,
                ursachen: ['Schlaganfall', 'SHT', 'schwere Intoxikation'],
                klinik_bewusstlos: 1.0,
                intensivstation: 0.9
            }
        },
        
        // Differentialdiagnostik-Algorithmus
        diagnostik_algorithmus: {
            schritt_1: {
                frage: 'Atmet der Patient?',
                nein: 'Reanimation',
                ja: 'Weiter zu Schritt 2'
            },
            schritt_2: {
                frage: 'Trauma/Unfall?',
                ja: 'SHT, Wirbelsäule beachten',
                nein: 'Weiter zu Schritt 3'
            },
            schritt_3: {
                frage: 'Blutzucker messen',
                niedrig: 'Hypoglykämie → Glucose',
                normal: 'Weiter zu Schritt 4'
            },
            schritt_4: {
                frage: 'Pupillen?',
                anisokor: 'Schlaganfall/SHT',
                eng: 'Intoxikation (Opiate)',
                weit: 'Intoxikation (Amphetamine)',
                normal: 'Weiter zu Schritt 5'
            },
            schritt_5: {
                frage: 'Neurologische Ausfälle?',
                ja: 'Schlaganfall → Stroke Unit',
                nein: 'Weitere Abklärung Klinik'
            }
        },
        
        // Typische Konstellationen
        konstellationen: {
            klassische_synkope: {
                merkmale: [
                    'Kurze Bewusstlosigkeit',
                    'Schnelles Aufwachen',
                    'Stand vorher lange',
                    'Keine Nachsymptome'
                ],
                prognose: 'meist gut'
            },
            
            hypo_beim_diabetiker: {
                merkmale: [
                    'Diabetiker',
                    'Schwitzen',
                    'BZ < 50 mg/dl',
                    'Erwacht nach Glucose'
                ],
                therapie: 'Glucose i.v.',
                prognose: 'gut bei schneller Behandlung'
            },
            
            schlaganfall_schwer: {
                merkmale: [
                    'Älterer Patient',
                    'Plötzlich bewusstlos',
                    'Halbseitenlähmung',
                    'Anisokor möglich'
                ],
                therapie: 'Stroke Unit sofort',
                zeitkritisch: 1.0
            },
            
            postiktal: {
                merkmale: [
                    'Krampfanfall beobachtet',
                    'Zungenbiss',
                    'Einnässen',
                    'Muskelkater'
                ],
                info: 'Nach Krampf normal',
                aufwachen_meist: 0.9
            },
            
            intoxikation_schwer: {
                merkmale: [
                    'Junger Patient',
                    'Party/Festival',
                    'Drogen/Alkohol',
                    'Flache Atmung'
                ],
                komplikation: 'Ateminsuffizienz',
                intubation_evtl: 0.4
            }
        },
        
        // Telefonreanimation bei Bewusstlosigkeit
        telefonreanimation: {
            bei_fehlender_atmung: 1.0,
            anleitung: [
                '1. Atmung prüfen',
                '2. Bei fehlender Atmung: Thoraxkompression',
                '3. Beatmung wenn möglich',
                '4. Bis RTW eintrifft'
            ]
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BEWUSSTLOSIGKEIT_UNKLAR_TEMPLATE };
}

export default BEWUSSTLOSIGKEIT_UNKLAR_TEMPLATE;
