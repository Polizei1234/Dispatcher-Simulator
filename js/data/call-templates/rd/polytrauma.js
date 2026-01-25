// =========================================================================================
// POLYTRAUMA TEMPLATE V2.0 - Schwerster Notfall! Golden Hour! ABCDE!
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const POLYTRAUMA_TEMPLATE = {
    
    id: 'polytrauma',
    kategorie: 'rd',
    stichwort: 'Polytrauma - Mehrfachverletzung',
    weight: 1,  // Selten, aber KRITISCH!
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            zeuge_schockiert_panisch: {
                probability: 0.4,
                speech_pattern: 'schockiert, panisch, überwältigt',
                variations: [
                    'Es war ein schwerer Unfall! *schreit* Mehrere Verletzte!',
                    'Jemand liegt hier schwer verletzt! Überall Blut!',
                    'Oh Gott! Ein schlimmer Unfall! Bitte schnell!',
                    'Er bewegt sich nicht mehr! Ganz viel Blut!',
                    'Schrecklicher Unfall! Kommen Sie schnell!'
                ],
                characteristics: {
                    panisch: 0.9,
                    unsichere_angaben: 0.7,
                    überfordert: 0.8,
                    weint_evtl: 0.3
                },
                background_sounds: ['sirens', 'traffic', 'people_shouting', 'car_alarm']
            },
            
            zeuge_ersthelfer_versuch: {
                probability: 0.2,
                speech_pattern: 'aufgeregt, versucht zu helfen',
                variations: [
                    'Ich bin Ersthelfer am Unfallort, schwer verletzter Patient!',
                    'Schwerer Unfall! Ich versuche Erste Hilfe!',
                    'Der Patient blutet stark! Was soll ich tun?',
                    'Motorradunfall! Mehrere Verletzungen!'
                ],
                characteristics: {
                    versucht_zu_helfen: 0.9,
                    fragt_nach_anweisungen: 0.7
                }
            },
            
            polizei_vor_ort: {
                probability: 0.15,
                speech_pattern: 'professionell, präzise',
                variations: [
                    'Polizei vor Ort, schwerer VU mit Personenschaden, RTW und NEF dringend!',
                    'Verkehrsunfall mit Einklemmung, Feuerwehr bereits alarmiert',
                    'Schwerer Unfall, mindestens ein Schwerverletzter, Hubschrauber evtl. erforderlich'
                ],
                characteristics: {
                    strukturierte_meldung: 0.9,
                    lageeinschätzung: 0.9,
                    koordiniert_bereits: 0.7
                }
            },
            
            feuerwehr_vor_ort: {
                probability: 0.1,
                speech_pattern: 'behördlich, strukturiert',
                variations: [
                    'Feuerwehr vor Ort, Patient befreit, Polytrauma, NEF dringend erforderlich',
                    'Technische Rettung abgeschlossen, Schwerverletzte Person, benötigen Notarzt',
                    'Einklemmung gelöst, Patient kritisch, RTW und NEF angefordert'
                ],
                characteristics: {
                    hat_patient_gesichtet: 0.9,
                    technische_rettung: 0.8
                }
            },
            
            sanitaeter_vor_ort: {
                probability: 0.05,
                speech_pattern: 'medizinisch, fachlich',
                variations: [
                    'San-Helfer vor Ort, Polytrauma nach VU, Patient bewusstlos, benötigen NEF sofort',
                    'Patient mit multiplen Verletzungen, Schock, dringend Notarzt'
                ],
                characteristics: {
                    medizinische_einschätzung: 0.9,
                    vitalparameter_evtl: 0.6
                }
            },
            
            leitstellendisponent: {
                probability: 0.1,
                speech_pattern: 'disponierend',
                info: 'Weiterleitung aus anderer Leitstelle',
                variations: [
                    'ILS {Stadt}, schwerer VU auf {Straße}, mehrere RTW und NEF erforderlich',
                    'MANV-Lage, benötigen Unterstützung'
                ]
            }
        },
        
        dynamik: {
            weitere_verletzte_entdeckt: {
                probability: 0.25,
                trigger_time: { min: 30, max: 180 },
                variations: [
                    'Es gibt noch einen zweiten Verletzten!',
                    'Wir haben jetzt noch jemanden gefunden!',
                    'Hier liegt noch jemand!'
                ],
                effekt: 'zusätzliche_rtw_nötig'
            },
            
            reanimation: {
                probability: 0.15,
                trigger_time: { min: 60, max: 240 },
                variations: [
                    'Er reagiert jetzt gar nicht mehr!',
                    'Ich glaube, er atmet nicht mehr!',
                    'Kein Puls mehr spürbar!'
                ],
                kritisch: 1.0
            },
            
            brand: {
                probability: 0.08,
                trigger_time: { min: 0, max: 120 },
                variations: [
                    'Das Fahrzeug fängt Feuer!',
                    'Es brennt!',
                    'Rauch kommt aus dem Auto!'
                ],
                gefahr: 1.0,
                zusätzlich_feuerwehr: 1.0
            },
            
            einklemmung_schwieriger: {
                probability: 0.2,
                trigger_time: { min: 120, max: 360 },
                variations: [
                    'Die Rettung dauert länger als gedacht',
                    'Patient ist schwer eingeklemmt'
                ],
                info: 'Zeitverzögerung'
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.72,  // Männer häufiger bei schwerem Trauma
            female: 0.28
        },
        
        alter: {
            distribution: 'bimodal',
            info: 'Junge Erwachsene (risikoreich) & Ältere (schwerere Folgen)',
            peak1: {
                mean: 26,
                stddev: 8,
                weight: 0.5,
                info: 'Junge Männer, Motorrad, hohes Tempo'
            },
            peak2: {
                mean: 52,
                stddev: 15,
                weight: 0.5,
                info: 'Ältere, schwerere Verletzungen, schlechtere Prognose'
            },
            min: 16,
            max: 85
        },
        
        bewusstseinszustand: {
            wach_orientiert: {
                probability: 0.15,
                gcs: { min: 13, max: 15 },
                info: 'Trotzdem schwer verletzt möglich!'
            },
            somnolent_verwirrt: {
                probability: 0.2,
                gcs: { min: 9, max: 12 },
                info: 'SHT, Schock, Hypoxie'
            },
            soporös: {
                probability: 0.15,
                gcs: { min: 6, max: 8 },
                kritisch: 0.8
            },
            komatoese_bewusstlos: {
                probability: 0.5,
                gcs: { min: 3, max: 8 },
                kritisch: 1.0,
                intubation_meist: 0.9
            }
        },
        
        glasgow_coma_scale: {
            info: 'GCS wichtigster Prädiktor für SHT-Schwere',
            mild_sht: { gcs: [13, 15], probability: 0.15 },
            moderate_sht: { gcs: [9, 12], probability: 0.2 },
            severe_sht: { gcs: [3, 8], probability: 0.4, intubation: 1.0 },
            kein_sht: { probability: 0.25 }
        }
    },
    
    // ========================================
    // 🚗 UNFALLMECHANISMUS
    // ========================================
    unfallmechanismus: {
        verkehrsunfall_pkw: {
            probability: 0.35,
            severity: 'schwer',
            characteristics: {
                einklemmung: 0.4,
                frontal: 0.4,
                seitlich: 0.3,
                heck: 0.15,
                überschlag: 0.15
            },
            verletzungen: {
                kopf: 0.6,
                thorax: 0.7,
                abdomen: 0.5,
                becken: 0.4,
                extremitäten: 0.8
            },
            geschwindigkeit_meist_hoch: 0.7
        },
        
        motorradunfall: {
            probability: 0.25,
            severity: 'sehr_schwer',
            hochenergetisch: 1.0,
            characteristics: {
                geschleudert: 0.8,
                aufprall_auf_hindernis: 0.6,
                überrollt: 0.2
            },
            verletzungen: {
                schädel: 0.7,
                wirbelsäule: 0.5,
                thorax: 0.6,
                extremitäten: 0.9,
                offene_frakturen: 0.6
            },
            helm_status: {
                mit_helm: { probability: 0.7, protektiv: 0.6 },
                ohne_helm: { probability: 0.3, sht_schwerst: 0.9 }
            },
            prognose_schlecht: 0.6
        },
        
        fussgänger_angefahren: {
            probability: 0.15,
            severity: 'sehr_schwer',
            characteristics: {
                waddell_trias: 0.6,
                überrollt: 0.3,
                geschleudert: 0.7
            },
            verletzungen: {
                kopf: 0.8,
                thorax: 0.6,
                becken: 0.7,
                extremitäten: 0.9
            },
            kinder_und_ältere_häufiger: 0.6
        },
        
        sturz_grosse_hoehe: {
            probability: 0.15,
            severity: 'sehr_schwer',
            characteristics: {
                hoehe_3_meter: 0.6,
                hoehe_6_meter: 0.3,
                hoehe_10_meter: 0.1
            },
            verletzungen: {
                wirbelsäule: 0.7,
                becken: 0.6,
                extremitäten: 0.8,
                kalkaneus_fraktur: 0.4
            },
            ursachen: {
                arbeitsunfall: 0.4,
                suizidversuch: 0.3,
                unfallsturz: 0.3
            }
        },
        
        fahrradunfall_schwer: {
            probability: 0.05,
            severity: 'mittel_bis_schwer',
            verletzungen: {
                kopf: 0.7,
                gesicht: 0.6,
                extremitäten: 0.8
            }
        },
        
        verschuettung: {
            probability: 0.03,
            severity: 'schwerst',
            crush_syndrom: 0.8,
            kompartment: 0.6
        },
        
        explosion_trauma: {
            probability: 0.02,
            severity: 'schwerst',
            blast_injury: 1.0,
            verletzungen_komplex: 1.0
        }
    },
    
    // ========================================
    // 🩸 VERLETZUNGSMUSTER (nach Körperregion)
    // ========================================
    verletzungsmuster: {
        // SCHÄDEL-HIRN-TRAUMA (SHT)
        kopf_sht: {
            probability: 0.7,
            name: 'Schädel-Hirn-Trauma',
            
            schweregrade: {
                leichtes_sht: {
                    probability: 0.2,
                    gcs: [13, 15],
                    bewusstlosigkeit_kurz: 0.4,
                    amnesie: 0.6
                },
                mittelschweres_sht: {
                    probability: 0.3,
                    gcs: [9, 12],
                    bewusstlosigkeit: 0.7,
                    intubation_evtl: 0.5
                },
                schweres_sht: {
                    probability: 0.5,
                    gcs: [3, 8],
                    bewusstlos: 1.0,
                    intubation_zwingend: 0.9,
                    prognose_kritisch: 0.8
                }
            },
            
            verletzungen: {
                schädelfraktur: {
                    probability: 0.4,
                    types: {
                        schädelbasis: { probability: 0.3, liquorrhoe: 0.6 },
                        schädeldach: { probability: 0.5 },
                        impressionsfraktur: { probability: 0.2, op_meist: 0.8 }
                    }
                },
                intrakranielle_blutung: {
                    probability: 0.4,
                    types: {
                        epidurales_hämatom: { probability: 0.2, op_oft: 0.7 },
                        subdurales_hämatom: { probability: 0.5, prognose_schlecht: 0.6 },
                        subarachnoidalblutung: { probability: 0.2 },
                        intrazerebrale_blutung: { probability: 0.1, prognose_sehr_schlecht: 0.8 }
                    }
                },
                kontusion: {
                    probability: 0.6,
                    ödem: 0.7
                },
                diffuser_axonalschaden: {
                    probability: 0.15,
                    prognose_sehr_schlecht: 0.9
                }
            },
            
            klinische_zeichen: {
                bewusstlosigkeit: 0.8,
                pupillenstörung: 0.3,
                anisokorie: 0.2,
                lichtstarre: 0.15,
                cushing_reflex: 0.1,
                strecksynergismen: 0.2
            },
            
            intubationskriterien: {
                gcs_unter_9: 1.0,
                ateminsuffizienz: 1.0,
                aspiration_gefahr: 0.9,
                lange_transportzeit: 0.7
            }
        },
        
        // THORAXTRAUMA
        thorax: {
            probability: 0.75,
            name: 'Thoraxtrauma',
            
            verletzungen: {
                rippenserienfraktur: {
                    probability: 0.5,
                    definition: '3+ Rippen',
                    ateminsuffizienz: 0.6,
                    schmerzen_stark: 0.9
                },
                pneumothorax: {
                    probability: 0.4,
                    types: {
                        einfach: { probability: 0.5 },
                        spannungspneumothorax: { 
                            probability: 0.3, 
                            lebensbedrohlich: 1.0,
                            sofort_entlastung: 1.0
                        },
                        offen: { probability: 0.2, sofort_abdeckung: 1.0 }
                    }
                },
                hämatothorax: {
                    probability: 0.3,
                    massiv: { probability: 0.2, schock: 0.9 }
                },
                lungenkontusion: {
                    probability: 0.4,
                    ards_risiko: 0.5
                },
                instabiler_thorax: {
                    probability: 0.15,
                    paradoxe_atmung: 0.9,
                    beatmung_meist_nötig: 0.8
                },
                herzkontusion: {
                    probability: 0.15,
                    rhythmusstörung: 0.5
                },
                aortenruptur: {
                    probability: 0.05,
                    hochkritisch: 1.0,
                    letalität: 0.9,
                    meist_sofort_tödlich: 0.8
                },
                zwerchfellruptur: {
                    probability: 0.08
                }
            },
            
            klinische_zeichen: {
                atemnot: 0.8,
                tachypnoe: 0.8,
                hypoxie: 0.7,
                einseitig_abgeschwächtes_atemgeräusch: 0.5,
                hautemphysem: 0.2,
                prall_gespannte_halsvenen: 0.15
            }
        },
        
        // ABDOMINALTRAUMA
        abdomen: {
            probability: 0.6,
            name: 'Abdominaltrauma',
            
            verletzungen: {
                milzruptur: {
                    probability: 0.4,
                    häufigste_parenchymverletzung: 1.0,
                    blutung: 0.9,
                    op_oft: 0.6,
                    zweizeitige_ruptur: 0.1
                },
                leberruptur: {
                    probability: 0.35,
                    blutung_massiv: 0.7,
                    op_oft: 0.7
                },
                nierenruptur: {
                    probability: 0.15,
                    hämaturie: 0.9
                },
                pankreasruptur: {
                    probability: 0.08,
                    komplikationen: 0.9
                },
                darmruptur: {
                    probability: 0.2,
                    peritonitis: 0.8,
                    oft_übersehen: 0.4
                },
                mesenterialverletzung: {
                    probability: 0.15,
                    blutung: 0.7
                },
                retroperitoneales_hämatom: {
                    probability: 0.25,
                    aus_beckenfraktur: 0.6,
                    massivblutung: 0.5
                }
            },
            
            klinische_zeichen: {
                abwehrspannung: 0.6,
                druckschmerz: 0.8,
                prellmarken: 0.5,
                gurtmarke: 0.3,
                schock_zeichen: 0.5
            }
        },
        
        // BECKENFRAKTUR
        becken: {
            probability: 0.45,
            name: 'Beckenfraktur',
            
            types: {
                stabil: {
                    probability: 0.4,
                    info: 'Beckenring intakt',
                    blutung_gering: 0.9
                },
                instabil: {
                    probability: 0.6,
                    info: 'Beckenring unterbrochen',
                    massivblutung: 0.7,
                    schock: 0.8,
                    beckenzwinge_oder_tücher: 1.0,
                    op_oft: 0.8
                }
            },
            
            klassifikationen: {
                typ_a_stabil: { probability: 0.4 },
                typ_b_rotationsinstabil: { probability: 0.35 },
                typ_c_komplett_instabil: { probability: 0.25, schwerst: 1.0 }
            },
            
            begleitverletzungen: {
                harnblase: 0.2,
                harnröhre: 0.15,
                rektum: 0.05,
                gefäße: 0.4,
                nerven: 0.2
            },
            
            klinische_zeichen: {
                beinlängen_differenz: 0.4,
                rotation_aussen: 0.5,
                instabilität_tastbar: 0.6,
                hämatom: 0.7,
                schock: 0.5
            }
        },
        
        // WIRBELSÄULENTRAUMA
        wirbelsäule: {
            probability: 0.4,
            name: 'Wirbelsäulentrauma',
            
            lokalisation: {
                hws: {
                    probability: 0.5,
                    info: 'Halswirbelsäule',
                    immobilisation_zwingend: 1.0
                },
                bws: {
                    probability: 0.2,
                    info: 'Brustwirbelsäule'
                },
                lws: {
                    probability: 0.3,
                    info: 'Lendenwirbelsäule'
                }
            },
            
            verletzungen: {
                fraktur_ohne_neurologisches_defizit: {
                    probability: 0.6,
                    stabil_evtl: 0.5
                },
                fraktur_mit_rückenmarksverletzung: {
                    probability: 0.3,
                    hochkritisch: 1.0
                },
                querschnitt: {
                    probability: 0.15,
                    komplett: { probability: 0.4, prognose_sehr_schlecht: 0.9 },
                    inkomplett: { probability: 0.6, prognose_besser: 0.6 }
                },
                ligamentäre_verletzung: {
                    probability: 0.1
                }
            },
            
            klinische_zeichen: {
                lähmungen: 0.3,
                sensibilitätsstörung: 0.4,
                schmerz_bewegungseinschränkung: 0.8,
                neurogener_schock: 0.15,
                spinaler_schock: 0.1
            },
            
            immobilisation: {
                hws_immer: 1.0,
                vakuummatratze: 0.9,
                schaufeltrage: 0.9
            }
        },
        
        // EXTREMITÄTENTRAUMA
        extremitäten: {
            probability: 0.85,
            name: 'Extremitätenverletzungen',
            
            verletzungen: {
                mehrfachfrakturen: {
                    probability: 0.7,
                    definition: '2+ Frakturen',
                    schmerzen_stark: 0.9
                },
                offene_frakturen: {
                    probability: 0.4,
                    schweregrade: {
                        grad_1: { probability: 0.3 },
                        grad_2: { probability: 0.4 },
                        grad_3: { probability: 0.3, komplikationen: 0.8 }
                    },
                    infektion_risiko: 0.6,
                    antibiotika_früh: 1.0
                },
                geschlossene_frakturen: {
                    probability: 0.6
                },
                gefaessverletzung: {
                    probability: 0.2,
                    puls_distal_fehlt: 0.8,
                    ischämie: 0.7,
                    zeitkritisch: 1.0
                },
                nervenverletzung: {
                    probability: 0.15,
                    lähmung: 0.8,
                    sensibilität_gestört: 0.9
                },
                kompartmentsyndrom: {
                    probability: 0.12,
                    zeitkritisch: 1.0,
                    fasziotomie_evtl: 0.8,
                    p5: 'Pain, Pressure, Paresthesia, Paralysis, Pulselessness'
                },
                amputationsverletzung: {
                    probability: 0.08,
                    komplett: { probability: 0.4, replantation_evtl: 0.5 },
                    subtotal: { probability: 0.6 },
                    replantationszentrum: 0.8
                },
                luxation: {
                    probability: 0.2
                }
            }
        }
    },
    
    // ========================================
    // 🚨 KOMPLIKATIONEN
    // ========================================
    komplikationen: {
        // SCHOCK
        schock: {
            probability: 0.7,
            name: 'Schock',
            hochkritisch: 1.0,
            
            formen: {
                hypovolaemischer_schock: {
                    probability: 0.7,
                    ursache: 'Blutverlust',
                    häufigste_form: 1.0,
                    volumen_nötig: 1.0
                },
                neurogener_schock: {
                    probability: 0.15,
                    ursache: 'Rückenmarksverletzung',
                    bradykardie_evtl: 0.6,
                    warme_haut: 0.7
                },
                obstruktiver_schock: {
                    probability: 0.1,
                    ursache: 'Spannungspneumothorax, Herzbeuteltamponade',
                    sofort_entlastung: 1.0
                },
                traumatisch_hämorrhagischer_schock: {
                    probability: 0.05,
                    massivblutung: 1.0,
                    massivtransfusions_protokoll: 1.0
                }
            },
            
            stadien: {
                stadium_1: {
                    blutverlust: '<750ml (<15%)',
                    rr_normal: 0.9,
                    hf_leicht_erhöht: 0.6
                },
                stadium_2: {
                    blutverlust: '750-1500ml (15-30%)',
                    rr_leicht_niedrig: 0.7,
                    hf_erhöht: 0.9,
                    tachypnoe: 0.7
                },
                stadium_3: {
                    blutverlust: '1500-2000ml (30-40%)',
                    rr_niedrig: 0.9,
                    tachykardie: 1.0,
                    bewusstsein_eingetrübt: 0.7,
                    kritisch: 0.9
                },
                stadium_4: {
                    blutverlust: '>2000ml (>40%)',
                    rr_kritisch_niedrig: 1.0,
                    bewusstlos: 0.9,
                    lebensbedrohlich: 1.0
                }
            },
            
            zeichen: {
                tachykardie: 0.9,
                hypotonie: 0.8,
                blaesse: 0.9,
                kaltschweissig: 0.8,
                bewusstseinstrübung: 0.6,
                oligurie: 0.5
            }
        },
        
        // MASSIVBLUTUNG
        massivblutung: {
            probability: 0.5,
            definition: '>1500ml oder >30% Blutvolumen',
            hochkritisch: 1.0,
            
            quellen: {
                becken: { probability: 0.4, voluminös: 1.0 },
                thorax: { probability: 0.25 },
                abdomen: { probability: 0.3 },
                extremitäten: { probability: 0.05 }
            },
            
            management: {
                volumentherapie_restriktiv: 1.0,
                permissive_hypotension: 0.8,
                transfusion_früh: 0.9,
                tranexamsäure: 0.8,
                beckenzwinge_bei_becken: 1.0
            }
        },
        
        // ATEMINSUFFIZIENZ
        ateminsuffizienz: {
            probability: 0.45,
            
            ursachen: {
                sht_zentral: 0.3,
                thoraxtrauma: 0.4,
                aspiration: 0.15,
                pneumothorax: 0.15
            },
            
            intubation_oft: 0.7
        },
        
        // CRUSH-SYNDROM
        crush_syndrom: {
            probability: 0.1,
            name: 'Crush-Syndrom',
            
            definition: 'Langdauernde Kompression > 4h',
            
            pathophysiologie: {
                muskelzerfall: 1.0,
                myoglobin_freisetzung: 1.0,
                nierenversagen: 0.8,
                hyperkalämie: 0.9
            },
            
            klinisch: {
                geschwollene_extremität: 0.9,
                puls_distal_schwach: 0.8,
                dunkler_urin: 0.7,
                rhythmusstörung: 0.4
            },
            
            therapie: {
                volumen_früh_viel: 1.0,
                vor_befreiung_beginnen: 1.0,
                bikarbonat: 0.8,
                dialyse_evtl: 0.5
            },
            
            hochkritisch: 1.0
        },
        
        // HYPOTHERMIE
        hypothermie: {
            probability: 0.3,
            info: 'Traumapatienten kühlen schnell aus',
            
            ursachen: {
                schock: 0.6,
                volumengabe: 0.5,
                exposition: 0.8
            },
            
            todestrias: {
                name: 'Lethal Triad',
                komponenten: ['Hypothermie', 'Azidose', 'Koagulopathie'],
                letalität_hoch: 0.9
            },
            
            wärmeerhalt: {
                rettungsdecke: 1.0,
                warme_infusionen: 0.8,
                heizung_rtw: 1.0
            }
        },
        
        // KOAGULOPATHIE
        traumainduzierte_koagulopathie: {
            probability: 0.3,
            info: 'Gerinnungsstörung nach schwerem Trauma',
            
            ursachen: {
                hypothermie: 0.6,
                azidose: 0.6,
                hämodilution: 0.5,
                verbrauch: 0.7
            },
            
            therapie: {
                tranexamsäure_früh: 0.9,
                massivtransfusion: 0.8,
                gerinnungsfaktoren: 0.7
            }
        }
    },
    
    // ========================================
    // ⚡ GOLDEN HOUR
    // ========================================
    golden_hour: {
        definition: 'Zeitfenster 60 Min nach Trauma, in dem definitive Versorgung erfolgen sollte',
        kritisch: 1.0,
        
        konzept: {
            load_and_go: {
                priorität: 1.0,
                info: 'Minimale präklinische Zeit',
                on_scene_time: '<10 Min angestrebt',
                bei: ['Massivblutung', 'Instabil', 'Schock']
            },
            stay_and_play: {
                priorität: 0.2,
                info: 'Ausführliche Stabilisierung',
                nur_bei: 'Stabil + lange Transportzeit'
            }
        },
        
        maßnahmen_präklinisch: {
            essentiell: [
                'ABCDE-Schema',
                'Atemwegssicherung',
                'Blutungskontrolle',
                'Schockbekämpfung',
                'Immobilisation',
                'Schneller Transport'
            ],
            verzichtbar_wenn_zeitkritisch: [
                'Ausführliche Anamnese',
                'Aufwendige Diagnostik',
                'Perfekte Lagerung'
            ]
        },
        
        zeitmanagement: {
            unfallort: '0-10 Min',
            transport: '10-30 Min',
            schockraum: '30-60 Min',
            op_bei_bedarf: '60-90 Min'
        }
    },
    
    // ========================================
    // 🅰️ ABCDE-SCHEMA
    // ========================================
    abcde_schema: {
        info: 'Systematisches Assessment & Management',
        zwingend: 1.0,
        
        a_airway: {
            name: 'Atemweg',
            prioritaet: 1,
            
            assessment: {
                kann_sprechen: 'Atemweg frei',
                geräusche: 'Atemweg gefaehrdet',
                keine_atmung: 'Atemweg verlegt'
            },
            
            gefahren: {
                bewusstlosigkeit: 0.6,
                blut: 0.4,
                erbrochenes: 0.3,
                zähne_fremdkoerper: 0.2,
                schwellung: 0.1
            },
            
            massnahmen: [
                'Kopf überstrecken (cave HWS!)',
                'Esmarch-Handgriff',
                'Absaugen',
                'Guedel-/Wendl-Tubus',
                'Intubation bei GCS < 9'
            ]
        },
        
        b_breathing: {
            name: 'Atmung',
            prioritaet: 2,
            
            assessment: {
                atemfrequenz: 'Normal 12-20/Min',
                thoraxexkursion: 'Symmetrisch?',
                atemgeraeusche: 'Seitengleich?',
                spo2: '>94% angestrebt'
            },
            
            pathologien: {
                pneumothorax: 0.4,
                spannungspneumothorax: 0.15,
                hämatothorax: 0.3,
                lungenkontusion: 0.4,
                instabiler_thorax: 0.15
            },
            
            massnahmen: [
                'Sauerstoffgabe',
                'Beatmung bei Bedarf',
                'Entlastungspunktion bei Spannungspneu',
                'Thoraxdrainage',
                'Schmerztherapie'
            ]
        },
        
        c_circulation: {
            name: 'Kreislauf',
            prioritaet: 3,
            
            assessment: {
                puls: 'Frequenz, Qualität',
                blutdruck: 'Systolisch > 90 mmHg',
                rekapzeit: '< 2 Sek normal',
                hautkolorit: 'Blass = Schock'
            },
            
            blutungskontrolle: {
                external: {
                    direkte_kompression: 1.0,
                    druckverband: 0.9,
                    tourniquet: 0.15
                },
                internal: {
                    beckenzwinge: 0.4,
                    op: 0.8
                }
            },
            
            schocktherapie: {
                venenzugang: 1.0,
                volumen_restriktiv: 1.0,
                permissive_hypotension: 0.8,
                transfusion_bei_bedarf: 0.6,
                vasopressoren_selten: 0.1
            }
        },
        
        d_disability: {
            name: 'Neurologie',
            prioritaet: 4,
            
            assessment: {
                gcs: 'Glasgow Coma Scale',
                pupillen: 'Größe, Reaktion, Symmetrie',
                motorik: 'Spontan, gezielt, ungezielt',
                sensibilitaet: 'Berührung, Schmerz'
            },
            
            gcs_score: {
                eyes: [1, 4],
                verbal: [1, 5],
                motor: [1, 6],
                total: [3, 15]
            },
            
            kritische_befunde: {
                gcs_unter_9: 'Intubation',
                anisokorie: 'Hirndruck?',
                strecksynergismen: 'Mittelhirn',
                schlaffe_lähmung: 'Rückenmark?'
            }
        },
        
        e_exposure: {
            name: 'Exposition',
            prioritaet: 5,
            
            massnahmen: [
                'Patient vollständig entkleiden',
                'Alle Verletzungen inspizieren',
                'Rücken nicht vergessen',
                'Hypothermie vermeiden',
                'Rettungsdecke'
            ],
            
            cave: {
                hypothermie: 1.0,
                übersehene_verletzungen: 0.3
            }
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        unfallstelle_strasse: {
            probability: 0.5,
            address_types: ['street', 'road', 'intersection'],
            gefahren: ['Verkehr', 'Betriebsstoffe', 'weitere_fahrzeuge']
        },
        autobahn: {
            probability: 0.2,
            address_types: ['highway', 'autobahn'],
            schweregrad_höher: 0.8,
            absicherung_kritisch: 1.0
        },
        landstrasse: {
            probability: 0.15,
            address_types: ['rural', 'country_road'],
            rettungszeit_länger: 0.8,
            rth_häufiger: 0.6
        },
        baustelle: {
            probability: 0.08,
            address_types: ['construction'],
            crush_syndrom_häufiger: 0.5
        },
        andere: {
            probability: 0.07,
            address_types: ['industrial', 'public_place']
        }
    },
    
    // ========================================
    // 🚑 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 2,
            nef: 1,
            ktw: 0
        },
        
        nef_indikation: {
            probability: 1.0,
            zwingend: 1.0,
            grund: 'Polytrauma = immer NEF!'
        },
        
        rth_indikation: {
            probability: 0.35,
            
            kriterien: {
                ländliche_region: 0.6,
                lange_bodengebundene_rettungszeit: 0.7,
                kritisch_instabiler_patient: 0.8,
                traumazentrum_weit: 0.7,
                mehrere_schwerverletzte: 0.5
            },
            
            vorteile: {
                schneller_transport: 1.0,
                notarzt_vor_ort: 1.0,
                erweiterte_ausstattung: 0.8
            }
        },
        
        feuerwehr: {
            probability: 0.7,
            
            gruende: {
                technische_rettung: 0.5,
                einklemmung: 0.4,
                absicherung: 0.6,
                brand: 0.1,
                ausleuchtung: 0.4
            }
        },
        
        lna_indikation: {
            probability: 0.15,
            
            bei: {
                mehrere_schwerverletzte: 0.8,
                manv: 1.0,
                komplexe_lage: 0.5
            }
        },
        
        polizei: {
            probability: 0.9,
            
            aufgaben: [
                'Unfallaufnahme',
                'Absicherung',
                'Verkehrslenkung',
                'Ermittlungen'
            ]
        },
        
        zielklinik: {
            traumazentrum: {
                probability: 1.0,
                zwingend: 1.0,
                
                stufen: {
                    überregional: {
                        probability: 0.6,
                        info: 'Maximale Versorgung 24/7'
                    },
                    regional: {
                        probability: 0.3,
                        info: 'Wenn überregional zu weit'
                    },
                    lokal: {
                        probability: 0.1,
                        nur_notfall: 1.0
                    }
                },
                
                anforderungen: [
                    'Schockraum 24/7',
                    'CT sofort verfügbar',
                    'OP-Bereitschaft',
                    'Intensivstation',
                    'Alle Fachrichtungen'
                ]
            },
            
            voranmeldung: {
                zwingend: 1.0,
                info: 'Schockraum-Team aktivieren!',
                
                inhalte: [
                    'Unfallmechanismus',
                    'Verletzungsmuster',
                    'Vitalparameter',
                    'GCS',
                    'Maßnahmen',
                    'ETA'
                ]
            }
        }
    },
    
    // ========================================
    // 💡 MEHRVERLETZTE & TRIAGE
    // ========================================
    mehrverletzte: {
        probability: 0.25,
        info: 'Bei Unfall oft mehrere Patienten',
        
        szenarien: {
            zwei_patienten: {
                probability: 0.7,
                ressourcen: { rtw: 2, nef: 1 }
            },
            drei_bis_fünf_patienten: {
                probability: 0.25,
                manv: 0.8,
                lna: 1.0
            },
            mehr_als_fünf: {
                probability: 0.05,
                manv: 1.0,
                grossschadenslage_evtl: 0.5
            }
        },
        
        triage: {
            info: 'Sichtung nach Dringlichkeit',
            
            kategorien: {
                t1_rot_akut: {
                    beschreibung: 'Lebensbedrohlich, sofortige Behandlung',
                    beispiele: ['Massivblutung', 'Ateminsuffizienz', 'Schock']
                },
                t2_gelb_dringend: {
                    beschreibung: 'Schwer verletzt, aufgeschobene Behandlung',
                    beispiele: ['Stabile Frakturen', 'mittlere Verletzungen']
                },
                t3_gruen_später: {
                    beschreibung: 'Leicht verletzt',
                    beispiele: ['Prellungen', 'Schnittwunden']
                },
                t4_blau_abwartend: {
                    beschreibung: 'Sterbend, keine Überlebenschance',
                    palliativ: 1.0
                }
            }
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            reanimation: {
                probability: 0.15,
                trigger_time: { min: 60, max: 300 },
                change: 'Patient reagiert nicht mehr! Kein Puls!',
                cpr: 1.0
            },
            
            schock_dekompensiert: {
                probability: 0.2,
                trigger_time: { min: 90, max: 240 },
                change: 'RR fällt weiter! Patient wird immer blasser!',
                massivtransfusion: 0.8
            },
            
            spannungspneumothorax: {
                probability: 0.1,
                trigger_time: { min: 120, max: 300 },
                change: 'Patient bekommt keine Luft mehr! Halsvenen gestaut!',
                sofort_entlastung: 1.0
            },
            
            krampfanfall: {
                probability: 0.08,
                trigger_time: { min: 180, max: 420 },
                change: 'Patient krämpft!',
                hirndruck_evtl: 0.7
            }
        },
        
        komplikationen: {
            zweiter_patient: {
                probability: 0.25,
                trigger_time: { min: 60, max: 240 },
                change: 'Es gibt noch einen zweiten Verletzten!',
                zusätzlicher_rtw: 1.0
            },
            
            brand: {
                probability: 0.08,
                trigger_time: { min: 0, max: 120 },
                change: 'Das Fahrzeug brennt!',
                feuerwehr_dringend: 1.0,
                gefahr_hoch: 1.0
            },
            
            einklemmung_komplex: {
                probability: 0.2,
                trigger_time: { min: 180, max: 480 },
                info: 'Rettung dauert länger',
                rettungszeit_verlängert: 1.0
            },
            
            gefahrgut: {
                probability: 0.05,
                trigger_time: { min: 0, max: 90 },
                change: 'LKW mit Gefahrgut-Kennzeichnung!',
                spezialkräfte: 1.0,
                evakuierung_evtl: 0.7
            }
        }
    },
    
    // ========================================
    // 📊 PROTOKOLL & BEWERTUNG
    // ========================================
    protokoll: {
        tracked_data: {
            unfallmechanismus: 'FROM_CALL',
            verletzungsmuster: 'FROM_CALL',
            bewusstseinszustand: 'FROM_CALL',
            nef_disponiert: 'FROM_DISPOSITION',
            traumazentrum: 'FROM_DISPOSITION',
            outcome: 'FROM_SIMULATION'
        },
        
        bewertung: {
            kriterien: {
                polytrauma_erkannt: {
                    wichtig: 'kritisch',
                    info: 'Erkennen des Schweregrades essentiell!'
                },
                
                nef_sofort_disponiert: {
                    wichtig: 'kritisch',
                    info: 'Polytrauma = IMMER NEF!',
                    bei_nein_kritischer_fehler: 1.0
                },
                
                traumazentrum_angesteuert: {
                    wichtig: 'kritisch',
                    info: 'Nur Traumazentrum!',
                    bei_nein_kritischer_fehler: 1.0
                },
                
                rth_bei_bedarf: {
                    wichtig: 'hoch',
                    info: 'Bei ländlicher Region oder Instabilität'
                },
                
                feuerwehr_bei_einklemmung: {
                    wichtig: 'hoch',
                    info: 'Technische Rettung'
                },
                
                voranmeldung_schockraum: {
                    wichtig: 'sehr_hoch',
                    info: 'Team muss bereit sein!'
                },
                
                unfallmechanismus_erfragt: {
                    wichtig: 'sehr_hoch',
                    info: 'Wichtig für Verletzungsmuster!'
                },
                
                golden_hour_berücksichtigt: {
                    wichtig: 'hoch',
                    info: 'Zeitkritik kommunizieren!'
                },
                
                mehrverletzte_bedacht: {
                    wichtig: 'hoch',
                    info: 'Ausreichend Rettungsmittel?'
                }
            },
            
            kritische_fehler: [
                'Polytrauma nicht erkannt',
                'Kein NEF disponiert',
                'Kein Traumazentrum angesteuert',
                'Zeitverzögerung durch Fehleinschätzung',
                'Zweiten Patienten übersehen',
                'Keine Voranmeldung Schockraum'
            ],
            
            häufige_fehler: [
                'Unfallmechanismus nicht detailliert erfragt',
                'RTH nicht bedacht bei ländlicher Region',
                'Feuerwehr bei Einklemmung verzögert',
                'LNA bei Mehrverletzten nicht disponiert',
                'Golden Hour nicht kommuniziert'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Schwerer Verkehrsunfall, mindestens ein Schwerverletzter',
            'Polytrauma nach Motorradunfall, Patient bewusstlos',
            'PKW gegen Baum, Fahrer eingeklemmt, mehrere Verletzungen',
            'Hochenergetisches Trauma, Patient kritisch instabil',
            'Mehrere Verletzte nach VU, Triage erforderlich'
        ],
        
        voranmeldung_traumazentrum: [
            '{hospital}, hier {callsign}, Voranmeldung Polytrauma',
            '{geschlecht}, {alter} Jahre',
            'Unfallmechanismus: {mechanismus}',
            'Mehrfachverletzungen: Kopf, Thorax, Abdomen',
            'GCS {gcs}, RR {systolisch}/{diastolisch}, HF {herzfrequenz}',
            'Patient intubiert und beatmet',
            'Schock Stadium {stadium}',
            'ETA {eta} Minuten, Schockraum bitte vorbereiten, kommen.'
        ],
        
        komplikationen: [
            '{callsign}, Patient dekompensiert, Reanimation läuft, kommen',
            '{callsign}, zweiter Schwerverletzter aufgefunden, benötigen zweiten RTW, kommen',
            '{callsign}, Fahrzeug in Brand, Feuerwehr dringend, kommen'
        ]
    },
    
    // ========================================
    // 🎯 SPECIAL - POLYTRAUMA-SPEZIFISCH
    // ========================================
    special: {
        learning_points: [
            'Polytrauma = IMMER NEF disponieren!',
            'Nur Traumazentrum ansteuern!',
            'Golden Hour beachten - Zeit = Leben!',
            'ABCDE-Schema systematisch',
            'Bei Einklemmung Feuerwehr früh',
            'RTH bei ländlicher Region',
            'Schockraum-Voranmeldung zwingend!',
            'An zweiten Patienten denken!',
            'Load and Go bei Instabilität',
            'Unfallmechanismus = Schlüssel für Verletzungsmuster'
        ],
        
        szenarien: {
            klassischer_motorradunfall: {
                verlauf: [
                    'Hochgeschwindigkeits-Kollision',
                    'Geschleudert 20m',
                    'Bewusstlos, GCS 6',
                    'Schweres SHT + Thoraxtrauma',
                    'Intubation, Beatmung',
                    'RTH-Transport',
                    'Intensivstation'
                ],
                prognose: 'Guänstig bei schneller Versorgung'
            },
            
            pkw_einklemmung: {
                verlauf: [
                    'Frontalkollision',
                    'Eingeklemmt im Fahrzeug',
                    'Feuerwehr befreit nach 30 Min',
                    'Instabile Beckenfraktur',
                    'Hämorrhagischer Schock',
                    'Beckenzwinge, Volumen',
                    'Traumazentrum, Not-OP'
                ],
                golden_hour_kritisch: 1.0
            },
            
            fußgänger_drama: {
                verlauf: [
                    'Von PKW erfasst',
                    'Waddell-Trias',
                    'Kopf + Thorax + Becken',
                    'Bewusstlos, Schock',
                    'Massivblutung Becken',
                    'Reanimation vor Ort',
                    'Traumazentrum'
                ],
                prognose: 'Kritisch'
            }
        },
        
        kommunikation_angehoeriger: {
            info: 'Oft schockierte Zeugen',
            ansätze: [
                'Beruhigen',
                'Strukturiert erfragen',
                'Anweisungen geben (Druckverband etc.)',
                'Informieren über Rettungsmittel'
            ]
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { POLYTRAUMA_TEMPLATE };
}
