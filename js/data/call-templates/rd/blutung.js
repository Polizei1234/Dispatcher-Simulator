// =========================================================================================
// BLUTUNG TEMPLATE V2.0 - Extern, intern, GI, Schock!
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const BLUTUNG_TEMPLATE = {
    
    id: 'blutung',
    kategorie: 'rd',
    stichwort: 'Blutung',
    weight: 3,  // Häufig
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            patient_selbst_panisch: {
                probability: 0.25,
                speech_pattern: 'panisch, ängstlich',
                variations: [
                    'Ich blute stark! Es hört nicht auf!',
                    'Hilfe! Ich habe mich geschnitten und es blutet!',
                    'Ich habe Nasenbluten und bekomme es nicht gestoppt!',
                    'Ich erbreche Blut!'
                ],
                characteristics: {
                    selbst_betroffen: 1.0,
                    angst: 0.9
                }
            },
            
            angehöriger_unfall: {
                probability: 0.35,
                speech_pattern: 'aufgeregt, panisch',
                variations: [
                    'Mein Mann hat sich mit der Kreissäge verletzt! Es blutet stark!',
                    'Sie ist gestürzt und hat eine Platzwunde am Kopf!',
                    'Er hat sich in den Finger geschnitten, es blutet sehr!',
                    'Unfall! Es blutet überall!'
                ],
                characteristics: {
                    traumatische_blutung: 0.8,
                    sichtbare_blutung: 0.9
                },
                background_sounds: ['panicked_voices', 'crying']
            },
            
            angehöriger_gi_blutung: {
                probability: 0.15,
                speech_pattern: 'besorgt, erschrocken',
                variations: [
                    'Er erbricht Blut!',
                    'Sie hat schwarzen Stuhlgang!',
                    'Er hat Blut im Stuhl!',
                    'Sie erbricht etwas, das aussieht wie Kaffeesatz!'
                ],
                characteristics: {
                    gi_blutung: 0.9,
                    intern: 1.0
                }
            },
            
            angehöriger_gynäkologisch: {
                probability: 0.1,
                speech_pattern: 'besorgt',
                variations: [
                    'Sie blutet sehr stark vaginal!',
                    'Sie ist schwanger und blutet!',
                    'Starke Regelblutung, sie ist ganz blass!'
                ],
                characteristics: {
                    gynäkologisch: 1.0,
                    frau: 1.0
                }
            },
            
            zeuge_unfall: {
                probability: 0.1,
                speech_pattern: 'schockiert, aufgeregt',
                variations: [
                    'Jemand hat sich schwer verletzt! Überall Blut!',
                    'Arbeitsunfall! Starke Blutung!',
                    'Die Person blutet stark aus einer Wunde!'
                ],
                background_sounds: ['people_shouting', 'sirens']
            },
            
            polizei_feuerwehr: {
                probability: 0.05,
                speech_pattern: 'professionell',
                variations: [
                    'Polizei vor Ort, Person mit starker Blutung',
                    'Feuerwehr, Patient mit Schnittverletzung, aktive Blutung'
                ]
            }
        },
        
        dynamik: {
            verschlechterung_schock: {
                probability: 0.2,
                trigger_time: { min: 120, max: 300 },
                variations: [
                    'Er wird ganz blass!',
                    'Sie reagiert kaum noch!',
                    'Der Puls ist ganz schnell und schwach!'
                ],
                kritisch: 0.9
            },
            
            bewusstlosigkeit: {
                probability: 0.15,
                trigger_time: { min: 90, max: 240 },
                variations: [
                    'Er ist jetzt bewusstlos!',
                    'Sie reagiert nicht mehr!'
                ],
                lebensbedrohlich: 1.0
            },
            
            blutung_verstärkt: {
                probability: 0.1,
                trigger_time: { min: 60, max: 180 },
                variations: [
                    'Es blutet jetzt noch mehr!',
                    'Der Verband ist durchgeblutet!'
                ]
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
            distribution: 'uniform',
            min: 1,
            max: 90,
            
            risiko_gruppen: {
                kinder: {
                    range: [1, 15],
                    info: 'Kleinere Blutmenge → Schneller Schock'
                },
                ältere: {
                    range: [70, 90],
                    info: 'Oft Antikoagulation',
                    antikoagulation: 0.5
                }
            }
        },
        
        bewusstseinszustand: {
            wach_orientiert: {
                probability: 0.65,
                info: 'Bei geringem Blutverlust'
            },
            wach_verwirrt: {
                probability: 0.15,
                info: 'Bei mäßigem Blutverlust, Schock'
            },
            somnolent: {
                probability: 0.1,
                info: 'Bei schwerem Blutverlust',
                kritisch: 0.8
            },
            bewusstlos: {
                probability: 0.1,
                info: 'Bei massivem Blutverlust',
                lebensbedrohlich: 1.0
            }
        }
    },
    
    // ========================================
    // 🩸 BLUTUNGSARTEN
    // ========================================
    blutungsarten: {
        // EXTERNE BLUTUNGEN
        externe_blutung: {
            probability: 0.6,
            name: 'Externe Blutung (sichtbar)',
            
            ursachen: {
                schnittverletzung: {
                    probability: 0.35,
                    name: 'Schnittverletzung',
                    
                    details: {
                        küche: 0.4,
                        arbeit: 0.3,
                        glas: 0.2,
                        andere: 0.1
                    },
                    
                    schweregrade: {
                        oberflächlich: {
                            probability: 0.5,
                            blutung: 'Gering',
                            versorgung: 'Druckverband'
                        },
                        tief: {
                            probability: 0.4,
                            blutung: 'Mäßig bis stark',
                            gefäß_evtl: 0.3,
                            versorgung: 'Druckverband, evtl. chirurgisch'
                        },
                        gefäßverletzung: {
                            probability: 0.1,
                            blutung: 'Massiv',
                            arteriell_evtl: 0.4,
                            kritisch: 1.0
                        }
                    }
                },
                
                platzwunde: {
                    probability: 0.25,
                    name: 'Platzwunde',
                    
                    lokalisation: {
                        kopf: {
                            probability: 0.7,
                            info: 'Blutet oft stark (gute Durchblutung)'
                        },
                        andere: 0.3
                    },
                    
                    ursache: {
                        sturz: 0.6,
                        schlag: 0.3,
                        andere: 0.1
                    },
                    
                    versorgung: 'Kompression, evtl. Naht'
                },
                
                amputation: {
                    probability: 0.05,
                    name: 'Amputation/Abriss',
                    
                    arten: {
                        finger: 0.6,
                        hand: 0.2,
                        arm: 0.1,
                        andere: 0.1
                    },
                    
                    blutung: {
                        stark: 0.7,
                        mäßig: 0.3,
                        info: 'Gefäße ziehen sich oft zusammen'
                    },
                    
                    therapie: {
                        kompression: 1.0,
                        tourniquet_evtl: 0.4,
                        replantation_evtl: 0.6,
                        amputat_kühlen: 1.0
                    },
                    
                    kritisch: 0.8
                },
                
                schussverletzung: {
                    probability: 0.02,
                    name: 'Schussverletzung',
                    blutung: 'Oft massiv',
                    polizei: 1.0,
                    kritisch: 1.0
                },
                
                stichverletzung: {
                    probability: 0.05,
                    name: 'Stichverletzung',
                    blutung: 'Variabel',
                    intern_evtl: 0.5,
                    polizei: 0.8,
                    kritisch: 0.8
                },
                
                pfählungsverletzung: {
                    probability: 0.01,
                    name: 'Pfählung',
                    info: 'Gegenstand NICHT entfernen!',
                    blutung_nach_entfernung: 0.9,
                    kritisch: 1.0
                },
                
                andere: {
                    probability: 0.27,
                    name: 'Andere traumatische Blutungen'
                }
            },
            
            charakteristika: {
                arteriell: {
                    probability: 0.15,
                    name: 'Arterielle Blutung',
                    merkmale: {
                        hellrot: 1.0,
                        pulsierend: 0.9,
                        spritzend: 0.8
                    },
                    gefährlich: 1.0,
                    schneller_blutverlust: 1.0
                },
                
                venös: {
                    probability: 0.7,
                    name: 'Venöse Blutung',
                    merkmale: {
                        dunkelrot: 1.0,
                        fließend: 0.9,
                        nicht_pulsierend: 0.9
                    },
                    meist_kontrollierbar: 0.8
                },
                
                kapillär: {
                    probability: 0.15,
                    name: 'Kapilläre Blutung',
                    merkmale: 'Sickerblutung',
                    meist_harmlos: 0.9
                }
            }
        },
        
        // INTERNE BLUTUNGEN
        interne_blutung: {
            probability: 0.15,
            name: 'Interne Blutung (nicht sichtbar)',
            
            lokalisationen: {
                intraabdominal: {
                    probability: 0.5,
                    name: 'Intraabdominal (Bauchraum)',
                    
                    ursachen: {
                        trauma: 0.6,
                        spontan: 0.3,
                        iatrogen: 0.1
                    },
                    
                    organe: {
                        milz: 0.35,
                        leber: 0.3,
                        andere: 0.35
                    },
                    
                    symptome: {
                        bauchschmerzen: 0.8,
                        schock: 0.7,
                        abwehrspannung: 0.6,
                        blässe: 0.9
                    },
                    
                    kritisch: 1.0
                },
                
                intrathorakal: {
                    probability: 0.2,
                    name: 'Intrathorakal (Brustkorb)',
                    
                    ursachen: {
                        trauma: 0.8,
                        spontan: 0.2
                    },
                    
                    symptome: {
                        dyspnoe: 0.9,
                        schock: 0.8,
                        dämpfung: 0.7
                    },
                    
                    kritisch: 1.0
                },
                
                retroperitoneal: {
                    probability: 0.15,
                    name: 'Retroperitoneal',
                    oft_bei: 'Beckenfraktur',
                    symptome: 'Schock, Rückenschmerzen',
                    kritisch: 1.0
                },
                
                intrakraniell: {
                    probability: 0.1,
                    name: 'Intrakraniell (Gehirn)',
                    siehe: 'SHT-Template',
                    kritisch: 1.0
                },
                
                andere: {
                    probability: 0.05
                }
            },
            
            tückisch: 1.0,
            info: 'Nicht sichtbar → Oft unterschätzt!'
        },
        
        // GI-BLUTUNG
        gi_blutung: {
            probability: 0.15,
            name: 'Gastrointestinale Blutung',
            
            arten: {
                obere_gi_blutung: {
                    probability: 0.7,
                    name: 'Obere GI-Blutung (oberhalb Treitz-Band)',
                    
                    ursachen: {
                        ulkus: {
                            probability: 0.45,
                            name: 'Ulkus (Magen/Duodenum)',
                            risikofaktoren: ['NSAR', 'H. pylori', 'Stress']
                        },
                        varizenblutung: {
                            probability: 0.25,
                            name: 'Ösophagusvarizenblutung',
                            bei: 'Leberzirrhose',
                            massiv: 0.8,
                            kritisch: 1.0
                        },
                        mallory_weiss: {
                            probability: 0.15,
                            name: 'Mallory-Weiss-Syndrom',
                            nach: 'Starkem Erbrechen',
                            meist_selbstlimitierend: 0.7
                        },
                        andere: { probability: 0.15 }
                    },
                    
                    symptome: {
                        hämatemesis: {
                            probability: 0.7,
                            name: 'Hämatemesis (Bluterbrechen)',
                            arten: {
                                hellrot: 'Frisches Blut',
                                kaffeesatz: 'Angedautes Blut'
                            }
                        },
                        meläna: {
                            probability: 0.8,
                            name: 'Meläna (Teerstuhl)',
                            charakteristik: 'Schwarz, übelriechend'
                        },
                        schock: 0.5
                    }
                },
                
                untere_gi_blutung: {
                    probability: 0.3,
                    name: 'Untere GI-Blutung (unterhalb Treitz-Band)',
                    
                    ursachen: {
                        divertikulose: 0.35,
                        angiodysplasie: 0.2,
                        colitis: 0.2,
                        tumor: 0.15,
                        andere: 0.1
                    },
                    
                    symptome: {
                        hämatochezie: {
                            probability: 0.9,
                            name: 'Hämatochezie (Rotes Blut im Stuhl)'
                        },
                        schock_seltener: 0.2
                    }
                }
            },
            
            schweregrade: {
                leicht: {
                    probability: 0.5,
                    keine_schockzeichen: 1.0
                },
                mittel: {
                    probability: 0.3,
                    tachykardie: 0.8
                },
                schwer: {
                    probability: 0.2,
                    schock: 0.9,
                    kritisch: 1.0
                }
            }
        },
        
        // NASENBLUTEN
        nasenbluten: {
            probability: 0.06,
            name: 'Epistaxis (Nasenbluten)',
            
            arten: {
                anterior: {
                    probability: 0.9,
                    name: 'Anteriores Nasenbluten',
                    locus_kiesselbachi: 0.8,
                    meist_harmlos: 0.9,
                    selbstlimitierend_oft: 0.8
                },
                
                posterior: {
                    probability: 0.1,
                    name: 'Posteriores Nasenbluten',
                    schwerer: 1.0,
                    ältere_patienten: 0.7,
                    tamponade_oft: 0.8
                }
            },
            
            ursachen: {
                trauma: 0.3,
                spontan: 0.4,
                hypertonie: 0.2,
                antikoagulation: 0.1
            },
            
            erstmaßnahmen: {
                kopf_nach_vorne: 1.0,
                nasenflügel_komprimieren: 1.0,
                dauer: '10-15 Min',
                kälte_nacken: 0.6
            },
            
            meist_harmlos: 0.85
        },
        
        // GYNÄKOLOGISCHE BLUTUNG
        gynäkologische_blutung: {
            probability: 0.04,
            name: 'Gynäkologische Blutung',
            nur_frauen: 1.0,
            
            arten: {
                dysfunktionell: {
                    probability: 0.4,
                    name: 'Dysfunktionelle Blutung',
                    meist_harmlos: 0.7
                },
                
                schwangerschaft: {
                    probability: 0.3,
                    name: 'Schwangerschaftsblutung',
                    
                    differenzialdiagnosen: [
                        'Abort',
                        'Extrauteringravidität',
                        'Placenta praevia',
                        'Abruptio placentae'
                    ],
                    
                    kritisch_evtl: 0.6,
                    gynäkologie_zwingend: 1.0
                },
                
                postpartal: {
                    probability: 0.15,
                    name: 'Postpartale Blutung',
                    nach_geburt: 1.0,
                    massiv_evtl: 0.4,
                    kritisch: 0.7
                },
                
                andere: { probability: 0.15 }
            }
        }
    },
    
    // ========================================
    // 🩸 BLUTVERLUST & SCHOCK
    // ========================================
    blutverlust_schock: {
        info: 'Klassifikation nach Blutverlust',
        
        klasse_1: {
            name: 'Klasse I (Kompensiert)',
            blutverlust: '<750ml (<15%)',
            
            symptome: {
                keine_bis_minimal: 1.0,
                puls: 'Normal (<100/min)',
                rr: 'Normal',
                bewusstsein: 'Klar'
            },
            
            therapie: 'Meist keine Volumentherapie',
            prognose: 'Sehr gut'
        },
        
        klasse_2: {
            name: 'Klasse II (Leichter Schock)',
            blutverlust: '750-1500ml (15-30%)',
            
            symptome: {
                tachykardie: 0.9,
                puls: '100-120/min',
                rr: 'Normal bis leicht ↓',
                atemfrequenz: '↑ (20-30/min)',
                blässe: 0.7,
                unruhe: 0.6,
                bewusstsein: 'Klar bis leicht verwirrt'
            },
            
            therapie: 'Kristalloide',
            prognose: 'Gut'
        },
        
        klasse_3: {
            name: 'Klasse III (Mäßiger Schock)',
            blutverlust: '1500-2000ml (30-40%)',
            
            symptome: {
                tachykardie: 1.0,
                puls: '120-140/min',
                hypotonie: 0.8,
                rr: '↓↓',
                atemfrequenz: '↑↑ (30-40/min)',
                blässe: 0.9,
                kaltschweißig: 0.8,
                verwirrtheit: 0.8,
                oligurie: 0.7
            },
            
            therapie: 'Kristalloide + Transfusion',
            kritisch: 0.9
        },
        
        klasse_4: {
            name: 'Klasse IV (Schwerer Schock)',
            blutverlust: '>2000ml (>40%)',
            
            symptome: {
                tachykardie_extrem: 1.0,
                puls: '>140/min oder nicht tastbar',
                hypotonie_schwer: 1.0,
                rr: '↓↓↓ (<70 mmHg)',
                atemfrequenz: '>40/min oder agonal',
                bewusstlosigkeit: 0.9,
                anurie: 0.9,
                zyanose: 0.8
            },
            
            therapie: 'Massivtransfusion, OP',
            lebensbedrohlich: 1.0,
            mortalität_hoch: 0.7
        }
    },
    
    // ========================================
    // 🩹 ERSTVERSORGUNG
    // ========================================
    erstversorgung: {
        kompression: {
            name: 'Direkte Kompression',
            priority: 1,
            anwendung: 'Bei allen externen Blutungen',
            
            technik: {
                druck_direkt_auf_wunde: 1.0,
                material: 'Sterile Kompresse, notfalls sauber',
                dauer: 'Mindestens 10 Min',
                kein_nachschauen: 1.0
            },
            
            wirksamkeit: 0.9
        },
        
        druckverband: {
            name: 'Druckverband',
            
            indikation: {
                extremitätenblutung: 1.0,
                venöse_blutung: 1.0
            },
            
            technik: {
                kompresse_auf_wunde: 1.0,
                druckpolster: 1.0,
                fest_wickeln: 1.0,
                durchblutung_kontrollieren: 1.0
            },
            
            wirksamkeit: 0.85
        },
        
        tourniquet: {
            name: 'Tourniquet (Abbindung)',
            
            indikation: {
                lebensbedrohliche_extremitätenblutung: 1.0,
                kompression_ineffektiv: 1.0,
                amputation: 0.6,
                massivblutung: 1.0
            },
            
            kontraindikationen: [
                'Rumpfblutung',
                'Halsblutung'
            ],
            
            technik: {
                proximal_der_blutung: 1.0,
                fest_zuziehen: 1.0,
                bis_blutung_steht: 1.0,
                zeitpunkt_notieren: 1.0
            },
            
            cave: {
                gewebeschaden: 0.8,
                maximal_2h: 1.0,
                info: 'Leben vor Extremität!'
            },
            
            lebensrettend: 1.0,
            ultima_ratio: 1.0
        },
        
        hochlagern: {
            name: 'Hochlagern',
            bei: 'Extremitätenblutung',
            wirkung: 'Venöser Rückfluss ↓',
            ergänzung_zu_kompression: 1.0
        },
        
        schocklagerung: {
            name: 'Schocklagerung',
            bei: 'Schock',
            technik: 'Beine hoch, Kopf tief',
            cave_bei: 'Schädel-Hirn-Trauma'
        }
    },
    
    // ========================================
    // 💊 ANTIKOAGULATION
    // ========================================
    antikoagulation: {
        info: 'Erhöhtes Blutungsrisiko',
        
        medikamente: {
            marcumar: {
                name: 'Phenprocoumon (Marcumar)',
                typ: 'Vitamin-K-Antagonist',
                häufig: 0.6,
                reversibel_mit: 'Vitamin K, PPSB'
            },
            
            noak: {
                name: 'NOAK/DOAK (Neue orale Antikoagulanzien)',
                beispiele: ['Apixaban', 'Rivaroxaban', 'Dabigatran'],
                häufig: 0.3,
                reversibel_schwierig: 0.8
            },
            
            heparin: {
                name: 'Heparin',
                meist_klinik: 0.9,
                reversibel_mit: 'Protamin'
            },
            
            thrombozytenaggregationshemmer: {
                name: 'TAH (z.B. ASS, Clopidogrel)',
                häufig: 0.8,
                blutung_verstärkt: 0.7,
                nicht_reversibel: 1.0
            }
        },
        
        komplikationen: {
            spontanblutungen: 0.3,
            verstärkte_blutung_bei_trauma: 0.9,
            intrakranielle_blutung: 0.15
        },
        
        abfragen: 1.0
    },
    
    // ========================================
    // 🧬 GERINNUNGSSTÖRUNGEN
    // ========================================
    gerinnungsstörungen: {
        hämophilie: {
            name: 'Hämophilie',
            häufigkeit: 'Selten',
            patient_weiß_meist: 1.0,
            blutung_prolongiert: 1.0,
            faktorengabe_nötig: 1.0
        },
        
        von_willebrand: {
            name: 'Von-Willebrand-Syndrom',
            häufigste_vererbte_störung: 1.0,
            meist_mild: 0.7
        },
        
        andere: {
            leberzirrhose: 'Gerinnungsfaktoren ↓',
            niereninsuffizienz: 'Thrombozytenfunktion ↓'
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        zuhause: {
            probability: 0.6,
            address_types: ['residential', 'apartment']
        },
        
        arbeitsplatz: {
            probability: 0.2,
            address_types: ['industrial', 'commercial', 'office'],
            oft_schnittverletzungen: 0.7
        },
        
        öffentlich: {
            probability: 0.15,
            address_types: ['public_place', 'street']
        },
        
        unfallort: {
            probability: 0.05,
            address_types: ['accident_scene'],
            oft_trauma: 1.0
        }
    },
    
    // ========================================
    // 🚑 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.2,
            ktw: 0
        },
        
        nef_indikation: {
            probability: 0.2,
            
            kriterien: {
                massivblutung: 1.0,
                schock: 1.0,
                bewusstlosigkeit: 1.0,
                instabil: 1.0
            }
        },
        
        zielklinik: {
            traumazentrum: {
                bei: 'Schweres Trauma mit Blutung',
                probability: 0.15
            },
            
            klinik_mit_chirurgie: {
                bei: 'Chirurgisch versorgbare Blutung',
                probability: 0.5
            },
            
            klinik_mit_endoskopie: {
                bei: 'GI-Blutung',
                probability: 0.2
            },
            
            standard: {
                bei: 'Leichte Blutung',
                probability: 0.15
            }
        },
        
        feuerwehr: {
            probability: 0.1,
            bei: 'Einklemmung, technische Rettung'
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            schock_entwicklung: {
                probability: 0.2,
                trigger_time: { min: 120, max: 300 },
                change: 'Patient wird blass, unruhig, Puls schnell',
                kritisch: 1.0
            },
            
            bewusstlosigkeit: {
                probability: 0.15,
                trigger_time: { min: 90, max: 240 },
                change: 'Bewusstsein schwindet',
                lebensbedrohlich: 1.0
            },
            
            kreislaufstillstand: {
                probability: 0.05,
                trigger_time: { min: 180, max: 360 },
                change: 'Kein Puls mehr tastbar',
                reanimation: 1.0
            }
        }
    },
    
    // ========================================
    // 📊 PROTOKOLL & BEWERTUNG
    // ========================================
    protokoll: {
        tracked_data: {
            blutungsart_erfragt: 'FROM_CALL',
            lokalisation: 'FROM_CALL',
            menge_eingeschätzt: 'FROM_CALL',
            kompression_angewiesen: 'FROM_ASSESSMENT',
            schockzeichen_abgefragt: 'FROM_ASSESSMENT',
            antikoagulation_erfragt: 'FROM_ASSESSMENT'
        },
        
        bewertung: {
            kriterien: {
                blutungsart_identifiziert: {
                    wichtig: 'sehr_hoch',
                    info: 'Extern? Intern? GI?'
                },
                
                lokalisation_erfragt: {
                    wichtig: 'sehr_hoch',
                    info: 'Wo blutet es?'
                },
                
                menge_eingeschätzt: {
                    wichtig: 'hoch',
                    info: 'Stark? Mäßig?'
                },
                
                kompression_angewiesen: {
                    wichtig: 'kritisch',
                    info: 'Bei externen Blutungen!'
                },
                
                schockzeichen_abgefragt: {
                    wichtig: 'sehr_hoch',
                    info: 'Blass? Unruhig? Puls schnell?'
                },
                
                antikoagulation_erfragt: {
                    wichtig: 'hoch',
                    info: 'Marcumar? ASS?'
                },
                
                nef_bei_massivblutung: {
                    wichtig: 'kritisch',
                    info: 'Bei Schock NEF!'
                }
            },
            
            kritische_fehler: [
                'Blutungsart nicht identifiziert',
                'Keine Kompression bei externer Blutung',
                'Schock nicht erkannt',
                'Kein NEF bei Schock',
                'Lokalisation nicht erfragt'
            ],
            
            häufige_fehler: [
                'Blutverlust nicht eingeschätzt',
                'Antikoagulation nicht erfragt',
                'Tourniquet zu früh erwähnt',
                'Hochlagern vergessen'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient mit starker Blutung {lokalisation}',
            'Schnittverletzung, aktive Blutung',
            'GI-Blutung, Patient erbricht Blut',
            'Verdacht auf interne Blutung, Schockzeichen'
        ],
        
        voranmeldung: [
            '{hospital}, hier {callsign}',
            'Voranmeldung Blutung',
            '{geschlecht}, {alter} Jahre',
            'Blutung: {art}',
            'Lokalisation: {lokalisation}',
            'Schockzeichen: {ja/nein}',
            'RR {rr}, Puls {puls}',
            'Patient {bewusstseinszustand}',
            'ETA {eta} Minuten, kommen.'
        ]
    },
    
    // ========================================
    // 🎯 SPECIAL
    // ========================================
    special: {
        learning_points: [
            'Blutungsart identifizieren (extern/intern)',
            'Kompression = Goldstandard',
            'Tourniquet nur bei Lebensbedrohung',
            'Schockzeichen frühzeitig erkennen',
            'Antikoagulation erfragen',
            'GI-Blutung: Hämatemesis vs. Meläna',
            'Interne Blutung oft unterschätzt',
            'Arteriell: Hellrot, pulsierend, spritzend',
            'NEF bei Schock',
            'Leben vor Extremität (Tourniquet)'
        ],
        
        szenarien: {
            schnittverletzung_küche: {
                häufigkeit: 0.25,
                ablauf: [
                    'Beim Kochen in Finger geschnitten',
                    'Blutung venös, mäßig',
                    'Kompression, Druckverband',
                    'Chirurgische Versorgung evtl.'
                ]
            },
            
            varizenblutung: {
                häufigkeit: 0.05,
                ablauf: [
                    'Patient mit Leberzirrhose',
                    'Plötzlich massives Bluterbrechen',
                    'Schock',
                    'NEF, Endoskopie dringend'
                ]
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BLUTUNG_TEMPLATE };
}
