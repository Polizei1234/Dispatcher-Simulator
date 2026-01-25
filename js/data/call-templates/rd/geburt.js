// =========================================================================================
// GEBURT TEMPLATE V2.0 - Notfallgeburt, APGAR, Neugeborenen-Reanimation!
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const GEBURT_TEMPLATE = {
    
    id: 'geburt',
    kategorie: 'rd',
    stichwort: 'Geburt / Notfallgeburt',
    weight: 1,  // Selten, aber WICHTIG
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            partner_extrem_panisch: {
                probability: 0.5,
                speech_pattern: 'extrem panisch, überfordert',
                variations: [
                    'Meine Frau bekommt das Baby! JETZT! Ich sehe den Kopf!',
                    'Die Wehen kommen im Minutentakt! Es geht los!',
                    'Sie presst schon! Das Baby kommt!',
                    'Hilfe! Die Fruchtblase ist geplatzt und sie muss pressen!',
                    'Das Baby ist DA! Es ist draußen! Was soll ich tun?!',
                    'Ich halte das Baby in den Händen! Hilfe!'
                ],
                characteristics: {
                    völlig_überfordert: 0.95,
                    keine_ahnung_was_tun: 0.9
                },
                background_sounds: ['woman_screaming', 'woman_moaning', 'panic']
            },
            
            schwangere_selbst_pressend: {
                probability: 0.25,
                speech_pattern: 'pressend, keuchend, schreiend',
                variations: [
                    '*keuchend* Das Baby kommt! *schreit* Ich muss pressen!',
                    '*presst* Ich... kann nicht... mehr... warten!',
                    'JETZT! Das Baby kommt JETZT!',
                    '*schreit* ES KOMMT! ES KOMMT!'
                ],
                characteristics: {
                    austreibungsphase: 0.9,
                    kann_kaum_sprechen: 0.8
                }
            },
            
            hebamme_professionell: {
                probability: 0.1,
                speech_pattern: 'professionell, aber dringend',
                variations: [
                    'Hebamme hier, Hausgeburt, Komplikation, RTW dringend!',
                    'Geburt im Gange, Nabelschnur um Hals, bitte schnell!',
                    'Sturzgeburt, Mutter blutet stark!',
                    'Schulterdystokie, brauche dringend Unterstützung!'
                ],
                characteristics: {
                    geplante_hausgeburt: 0.9,
                    komplikation_häufiger: 0.6
                }
            },
            
            zeuge_überfordert: {
                probability: 0.1,
                speech_pattern: 'überfordert, schockiert',
                variations: [
                    'Eine Frau bekommt hier ein Baby! Im Auto!',
                    'Jemand bekommt ein Baby auf der Straße!',
                    'Hier liegt eine Frau und schreit! Ich glaube, sie bekommt ein Baby!'
                ]
            },
            
            angehörige: {
                probability: 0.05,
                speech_pattern: 'besorgt, aufgeregt',
                variations: [
                    'Meine Tochter bekommt das Baby! Es geht zu schnell!',
                    'Sie ist schwanger und hat starke Schmerzen!'
                ]
            }
        },
        
        dynamik: {
            baby_geboren: {
                probability: 0.3,
                trigger_time: { min: 60, max: 180 },
                variations: [
                    'Das Baby ist da! Es ist raus!',
                    'Ich halte es in den Händen!',
                    'Es ist geboren!'
                ]
            },
            
            baby_atmet_nicht: {
                probability: 0.05,
                trigger_time: { min: 90, max: 240 },
                variations: [
                    'Das Baby atmet nicht!',
                    'Es bewegt sich nicht!',
                    'Es ist ganz blau!'
                ],
                kritisch: 1.0
            },
            
            starke_blutung: {
                probability: 0.1,
                trigger_time: { min: 120, max: 300 },
                variations: [
                    'Sie blutet sehr stark!',
                    'Da ist so viel Blut!'
                ],
                kritisch: 0.9
            },
            
            zwilling: {
                probability: 0.02,
                trigger_time: { min: 180, max: 360 },
                variations: [
                    'Da kommt noch ein Baby!',
                    'Es sind Zwillinge!'
                ],
                überraschung: 1.0
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENTIN
    // ========================================
    patient: {
        geschlecht: {
            female: 1.0  // Immer weiblich
        },
        
        alter: {
            distribution: 'normal',
            mean: 29,
            stddev: 6,
            min: 16,
            max: 45,
            
            risiko_gruppen: {
                teenager: {
                    range: [16, 19],
                    probability: 0.05,
                    risiko_erhöht: 0.6
                },
                optimal: {
                    range: [20, 35],
                    probability: 0.75,
                    risiko_normal: 1.0
                },
                spät: {
                    range: [36, 45],
                    probability: 0.2,
                    risiko_erhöht: 0.5
                }
            }
        },
        
        parität: {
            erstgebärende: {
                probability: 0.4,
                name: 'Primipara',
                geburtsdauer_länger: 1.0,
                sturzgeburt_seltener: 0.9
            },
            
            mehrgebärende: {
                probability: 0.6,
                name: 'Multipara',
                geburtsdauer_kürzer: 1.0,
                sturzgeburt_häufiger: 0.7
            }
        }
    },
    
    // ========================================
    // 👶 GEBURTSSTADIEN
    // ========================================
    geburtsstadien: {
        info: 'Geburtsphasen nach Friedman',
        
        eröffnungsphase: {
            probability: 0.3,
            name: 'Eröffnungsphase (1. Stadium)',
            
            charakteristika: {
                wehen: 'Regelmäßig alle 5-10 Min',
                muttermundöffnung: '0-10 cm',
                schmerzen: 'Zunehmend',
                pressdrang: 0.0
            },
            
            dauer: {
                erstgebärende: '8-14 Stunden',
                mehrgebärende: '5-8 Stunden'
            },
            
            transport: {
                möglich: 1.0,
                empfohlen: 1.0,
                zeit: 'Noch Stunden bis Geburt'
            },
            
            maßnahmen: [
                'Beruhigen',
                'Atmung anleiten',
                'Transport vorbereiten',
                'Geburtsklinik anfahren'
            ]
        },
        
        übergangsphase: {
            probability: 0.2,
            name: 'Übergangsphase',
            
            charakteristika: {
                wehen: 'Alle 2-3 Min, sehr stark',
                muttermundöffnung: '8-10 cm',
                schmerzen: 'Maximal',
                pressdrang_beginnend: 0.6
            },
            
            dauer: '30 Min - 2 Stunden',
            
            transport: {
                kritisch: 0.7,
                entscheidung_schwierig: 1.0
            },
            
            symptome: {
                zittern: 0.6,
                übelkeit: 0.5,
                erbrechen: 0.3,
                verzweiflung: 0.7
            }
        },
        
        austreibungsphase: {
            probability: 0.35,
            name: 'Austreibungsphase (2. Stadium)',
            
            charakteristika: {
                wehen: 'Alle 1-2 Min',
                muttermundöffnung: '10 cm (vollständig)',
                pressdrang: 1.0,
                kopf_sichtbar_evtl: 0.6
            },
            
            dauer: {
                erstgebärende: '1-2 Stunden',
                mehrgebärende: '20-60 Min'
            },
            
            transport: {
                nicht_empfohlen: 1.0,
                geburt_vorbereiten: 1.0,
                info: 'KEIN Transport mehr! Geburt steht unmittelbar bevor!'
            },
            
            zeichen: {
                starker_pressdrang: 1.0,
                stuhlgang_gefühl: 0.9,
                damm_wölbt_sich: 0.8,
                kopf_sichtbar: 0.6
            },
            
            geburtshilfe_erforderlich: 1.0
        },
        
        nachgeburtsphase: {
            probability: 0.15,
            name: 'Nachgeburtsphase (3. Stadium)',
            info: 'Baby bereits geboren',
            
            charakteristika: {
                baby_geboren: 1.0,
                plazenta_noch_drin: 1.0
            },
            
            dauer: '5-30 Min',
            
            zeichen_plazentageburt: {
                nabelschnur_verlängert_sich: 0.9,
                blutung: 0.8,
                wehe: 0.7
            },
            
            maßnahmen: [
                'Plazenta NICHT ziehen',
                'Spontane Geburt abwarten',
                'Plazenta mitnehmen (Inspektion Klinik)',
                'Mutter + Baby versorgen'
            ]
        }
    },
    
    // ========================================
    // 👶 GEBURTSABLAUF NORMAL
    // ========================================
    geburtsablauf_normal: {
        probability: 0.75,
        name: 'Spontangeburt (unkompliziert)',
        
        ablauf: [
            '1. Kopf wird sichtbar (Crowning)',
            '2. Kopf tritt aus (Kopfgeburt)',
            '3. Schultern drehen sich',
            '4. Körper folgt schnell',
            '5. Baby ist geboren'
        ],
        
        geburtshilfe: {
            hände_unter_kopf: 1.0,
            nicht_ziehen: 1.0,
            damm_unterstützen: 0.8,
            schultern_nacheinander: 1.0
        },
        
        dauer_austreibung: '10-60 Min',
        
        komplikationen_selten: 0.9
    },
    
    sturzgeburt: {
        probability: 0.15,
        name: 'Sturzgeburt',
        
        definition: 'Sehr schnelle Geburt <3 Stunden Gesamtdauer',
        
        charakteristika: {
            sehr_schnell: 1.0,
            kind_fällt_heraus: 0.8,
            meist_mehrgebärende: 0.8
        },
        
        risiken: {
            verletzung_baby: 0.3,
            dammriss_mutter: 0.6,
            unterkühlung_baby: 0.7
        },
        
        maßnahmen: [
            'Baby auffangen',
            'Sofort abtrocknen + wärmen',
            'Mutter auf Verletzungen prüfen'
        ]
    },
    
    // ========================================
    // ⚠️ KOMPLIKATIONEN
    // ========================================
    komplikationen: {
        // NABELSCHNUR
        nabelschnurumschlingung: {
            probability: 0.15,
            name: 'Nabelschnur um Hals',
            
            häufigkeit: '15-30% aller Geburten',
            
            meist_harmlos: 0.8,
            
            maßnahmen: {
                locker: {
                    probability: 0.7,
                    vorgehen: 'Über Kopf streifen'
                },
                straff: {
                    probability: 0.3,
                    vorgehen: 'Durchtrennen zwischen 2 Klemmen',
                    kritischer: 0.6
                }
            },
            
            zeichen: {
                nabelschnur_sichtbar: 0.9,
                baby_evtl_zyanotisch: 0.4
            }
        },
        
        nabelschnurvorfall: {
            probability: 0.02,
            name: 'Nabelschnurvorfall',
            
            definition: 'Nabelschnur vor dem Kind im Geburtskanal',
            
            HOCHKRITISCH: 1.0,
            
            gefahr: {
                kompression: 1.0,
                hypoxie_baby: 0.9
            },
            
            maßnahmen: [
                'Nabelschnur NICHT zurückdrängen',
                'Feucht halten',
                'Kindsteil zurückdrängen (Druck von Schnur nehmen)',
                'Mutter Knie-Brust-Lage',
                'SOFORT Klinik',
                'NEF',
                'Kaiserschnitt'
            ],
            
            notfall: 1.0
        },
        
        // LAGEANOMALIE
        beckenendlage: {
            probability: 0.05,
            name: 'Beckenendlage (BEL)',
            
            definition: 'Baby kommt mit Po/Füßen zuerst',
            
            häufigkeit: '3-5% bei Termin',
            
            formen: {
                reine_steßlage: 0.6,
                fußlage: 0.3,
                knielage: 0.1
            },
            
            risiken: {
                kopf_bleibt_stecken: 0.3,
                nabelschnurvorfall: 0.15,
                armvorfall: 0.2
            },
            
            maßnahmen: [
                'NICHT ziehen am Baby',
                'Spontane Geburt abwarten',
                'Hände weg vom Baby',
                'Erst bei Nabel eingreifen',
                'Arme lösen',
                'Kopf mit Veit-Smellie-Handgriff',
                'NEF',
                'Klinik'
            ],
            
            schwierig: 1.0,
            nef_zwingend: 0.9
        },
        
        schulterdystokie: {
            probability: 0.03,
            name: 'Schulterdystokie',
            
            definition: 'Schulter bleibt hinter Schambein hängen',
            
            NOTFALL: 1.0,
            
            risikofaktoren: {
                großes_baby: 0.7,
                diabetes_mutter: 0.5,
                übergewicht_mutter: 0.4
            },
            
            zeichen: {
                kopf_geboren: 1.0,
                schultern_kommen_nicht: 1.0,
                kopf_zieht_sich_zurück: 0.8,
                turtle_sign: 0.8
            },
            
            manöver: {
                mcroberts: {
                    name: 'McRoberts-Manöver',
                    beschreibung: 'Beine stark beugen, an Bauch ziehen',
                    erfolgsrate: 0.6
                },
                suprasymphysärer_druck: {
                    name: 'Suprasymphysärer Druck',
                    beschreibung: 'Druck über Schambein nach unten',
                    erfolgsrate: 0.3
                }
            },
            
            NIEMALS: 'Am Kopf ziehen! (Plexusschädigung!)',
            
            zeitkritisch: 1.0,
            nef_zwingend: 1.0
        },
        
        // MÜTTERLICHE KOMPLIKATIONEN
        postpartale_blutung: {
            probability: 0.1,
            name: 'Postpartale Blutung',
            
            definition: '>500ml Blutverlust',
            
            ursachen: {
                uterusatonie: {
                    probability: 0.7,
                    name: 'Gebärmutter zieht sich nicht zusammen'
                },
                geburtsverletzung: {
                    probability: 0.2,
                    name: 'Dammriss, Zervixriss'
                },
                plazentarest: {
                    probability: 0.1,
                    name: 'Plazenta nicht vollständig'
                }
            },
            
            maßnahmen: {
                uterusmassage: {
                    beschreibung: 'Fundus massieren (Handbreit unter Nabel)',
                    wirkung: 'Kontraktion anregen'
                },
                oxytocin: {
                    medikament: 'Oxytocin i.v.',
                    wirkung: 'Uteruskontraktion'
                },
                volumen: 1.0,
                transport_beschleunigen: 1.0
            },
            
            kritisch: 0.8
        },
        
        frühgeburt: {
            probability: 0.08,
            name: 'Frühgeburt',
            
            definition: '<37. SSW',
            
            kategorien: {
                moderat: {
                    ssw: '32-36',
                    probability: 0.6,
                    prognose: 'Meist gut'
                },
                sehr_früh: {
                    ssw: '28-31',
                    probability: 0.3,
                    prognose: 'Kritisch'
                },
                extrem_früh: {
                    ssw: '<28',
                    probability: 0.1,
                    prognose: 'Sehr kritisch'
                }
            },
            
            probleme: {
                unreife_lunge: 0.9,
                temperaturregulation: 0.9,
                infektion: 0.6,
                hypoglykämie: 0.5
            },
            
            maßnahmen: [
                'Wärmeerhalt KRITISCH',
                'Vorsichtig absaugen',
                'O2 bei Bedarf',
                'Perinatalzentrum',
                'NEF'
            ],
            
            perinatalzentrum: 1.0
        },
        
        mehrlingsgeburt: {
            probability: 0.02,
            name: 'Mehrlingsgeburt (Zwillinge)',
            
            meist_zwillinge: 0.98,
            
            besonderheiten: {
                zweites_baby_folgt: '5-30 Min später',
                ressourcen_verdoppeln: 1.0,
                zweiter_rtw_evtl: 0.6
            },
            
            komplikationen_häufiger: 0.7
        }
    },
    
    // ========================================
    // 👶 NEUGEBORENEN-VERSORGUNG
    // ========================================
    neugeborenen_versorgung: {
        info: 'Sofort nach Geburt',
        
        reihenfolge: [
            '1. Abtrocknen + Wärmen',
            '2. Absaugen (nur bei Bedarf)',
            '3. Stimulation',
            '4. APGAR (1/5/10 Min)',
            '5. Abnabeln',
            '6. Bonding'
        ],
        
        abtrocknen_wärmen: {
            priorität: 1,
            wichtigkeit: 'KRITISCH',
            
            vorgehen: {
                sofort_abtrocknen: 1.0,
                besonders_kopf: 1.0,
                auf_mutter_legen: 0.9,
                zudecken: 1.0
            },
            
            gefahr: {
                hypothermie: 0.8,
                info: 'Neugeborene kühlen SEHR schnell aus!'
            }
        },
        
        absaugen: {
            priorität: 2,
            nur_bei_bedarf: 1.0,
            
            indikation: {
                viel_fruchtwasser: 0.4,
                mekonium: 0.3,
                nicht_routinemäßig: 1.0
            },
            
            vorgehen: {
                erst_mund: 1.0,
                dann_nase: 1.0,
                vorsichtig: 1.0,
                cave_vagusreiz: 0.2
            }
        },
        
        stimulation: {
            priorität: 3,
            
            maßnahmen: [
                'Abtrocknen (stimuliert bereits)',
                'Rücken reiben',
                'Fußsohlen reiben'
            ],
            
            cave: 'Nicht schlagen!'
        },
        
        abnabeln: {
            priorität: 5,
            zeitpunkt: '1-3 Min nach Geburt',
            
            spätes_abnabeln: {
                vorteile: 'Mehr Blut für Baby',
                empfohlen: 0.8
            },
            
            vorgehen: {
                zwei_klemmen: 1.0,
                abstand_10_15_cm: 1.0,
                zwischen_klemmen_durchtrennen: 1.0,
                nicht_zu_nah_am_baby: 1.0
            },
            
            cave: 'Steril arbeiten'
        },
        
        bonding: {
            priorität: 6,
            wichtig: 1.0,
            
            vorgehen: {
                baby_auf_mutter: 0.9,
                hautkontakt: 1.0,
                stillen_evtl: 0.5
            },
            
            vorteile: [
                'Bindung',
                'Wärme',
                'Beruhigung',
                'Uteruskontraktion durch Stillen'
            ]
        }
    },
    
    // ========================================
    // 📊 APGAR-SCORE
    // ========================================
    apgar_score: {
        info: 'Beurteilung Neugeborenes nach 1, 5, 10 Min',
        
        zeitpunkte: {
            min_1: {
                info: 'Anpassung',
                wichtigkeit: 'Hoch'
            },
            min_5: {
                info: 'Stabilität',
                wichtigkeit: 'Sehr hoch'
            },
            min_10: {
                info: 'Bei niedrigen Werten',
                nur_bei_bedarf: 0.7
            }
        },
        
        kriterien: {
            appearance: {
                name: 'Aussehen (Hautfarbe)',
                punkte_0: 'Blau/blass',
                punkte_1: 'Körper rosa, Extremitäten blau',
                punkte_2: 'Komplett rosa'
            },
            
            pulse: {
                name: 'Puls (Herzfrequenz)',
                punkte_0: 'Kein Puls',
                punkte_1: '<100/Min',
                punkte_2: '>100/Min'
            },
            
            grimace: {
                name: 'Grimassieren (Reflexe)',
                punkte_0: 'Keine Reaktion',
                punkte_1: 'Grimassieren',
                punkte_2: 'Kräftiges Schreien'
            },
            
            activity: {
                name: 'Aktivität (Muskeltonus)',
                punkte_0: 'Schlaff',
                punkte_1: 'Etwas Beugung',
                punkte_2: 'Aktive Bewegung'
            },
            
            respiration: {
                name: 'Respiration (Atmung)',
                punkte_0: 'Keine Atmung',
                punkte_1: 'Langsam, unregelmäßig',
                punkte_2: 'Kräftig, schreit'
            }
        },
        
        bewertung: {
            gut: {
                punkte: '8-10',
                bedeutung: 'Gut adaptiert',
                häufigkeit: 0.9
            },
            
            mäßig: {
                punkte: '5-7',
                bedeutung: 'Leichte Depression',
                maßnahmen: 'Stimulation, O2',
                häufigkeit: 0.08
            },
            
            kritisch: {
                punkte: '0-4',
                bedeutung: 'Schwere Depression',
                maßnahmen: 'REANIMATION',
                häufigkeit: 0.02
            }
        }
    },
    
    // ========================================
    // 👶 NEUGEBORENEN-REANIMATION
    // ========================================
    neugeborenen_reanimation: {
        probability: 0.05,
        
        indikation: {
            keine_atmung: 1.0,
            hf_unter_100: 0.8,
            zyanose: 0.6,
            schlaff: 0.8
        },
        
        algorithmus: {
            schritt_1: {
                name: 'Initialmaßnahmen',
                maßnahmen: [
                    'Wärmen',
                    'Absaugen',
                    'Trocknen',
                    'Stimulieren'
                ],
                dauer: '30 Sekunden'
            },
            
            schritt_2: {
                name: 'Beatmung',
                indikation: 'Keine/insuffiziente Atmung ODER HF <100',
                vorgehen: {
                    frequenz: '40-60/Min',
                    druck: 'Vorsichtig (20-30 cmH2O)',
                    o2: 'Beginnen mit Raumluft',
                    dauer: '30 Sekunden'
                }
            },
            
            schritt_3: {
                name: 'Herzdruckmassage',
                indikation: 'HF <60/Min trotz Beatmung',
                technik: {
                    zwei_daumen: 'Bevorzugt',
                    tiefe: '1/3 Thoraxdurchmesser',
                    frequenz: '120/Min',
                    verhältnis: '3:1 (Kompression:Beatmung)'
                }
            },
            
            schritt_4: {
                name: 'Medikamente',
                indikation: 'HF <60/Min trotz HDM+Beatmung',
                adrenalin: {
                    dosis: '0,01-0,03 mg/kg',
                    weg: 'i.v. oder endotracheal'
                }
            }
        },
        
        besonderheiten: {
            beatmung_wichtigster: 1.0,
            info: 'Bei Neugeborenen ist Beatmung WICHTIGER als HDM!',
            grund: 'Meist Atemprobleme, nicht Herzprobleme'
        }
    },
    
    // ========================================
    // 🕹️ VITALPARAMETER NEUGEBORENES
    // ========================================
    vitalparameter_neugeborenes: {
        herzfrequenz: {
            normal: '120-160/Min',
            nach_geburt: 'Oft >160/Min (Stress)',
            kritisch: '<100/Min'
        },
        
        atemfrequenz: {
            normal: '40-60/Min',
            initial: 'Oft unregelmäßig'
        },
        
        temperatur: {
            normal: '36,5-37,5°C',
            hypothermie_gefahr: 0.8,
            info: 'Wärmeerhalt KRITISCH!'
        },
        
        blutzucker: {
            normal: '>45 mg/dl',
            hypoglykämie_bei_frühgeburt: 0.5
        },
        
        gewicht: {
            normal: '2500-4500g',
            durchschnitt: '3400g'
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        zuhause: {
            probability: 0.5,
            address_types: ['residential', 'apartment'],
            details: {
                geplante_hausgeburt: 0.2,
                ungeplant: 0.8
            }
        },
        
        auto: {
            probability: 0.25,
            address_types: ['vehicle', 'parking'],
            meist: 'Auf dem Weg zur Klinik'
        },
        
        öffentlich: {
            probability: 0.15,
            address_types: ['street', 'public_place', 'shop'],
            beispiele: ['Supermarkt', 'Bahnhof', 'Straße']
        },
        
        taxi: {
            probability: 0.1,
            address_types: ['vehicle'],
            taxifahrer_meist_panisch: 0.95
        }
    },
    
    // ========================================
    // 🚑 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.15,
            ktw: 0
        },
        
        nef_indikation: {
            probability: 0.15,
            
            kriterien: {
                komplikation: 1.0,
                starke_blutung: 1.0,
                baby_reanimation: 1.0,
                frühgeburt: 0.9,
                beckenendlage: 0.8,
                schulterdystokie: 1.0,
                nabelschnurvorfall: 1.0
            }
        },
        
        zweiter_rtw: {
            probability: 0.1,
            bei: ['Mehrlinge', 'Mutter UND Baby kritisch']
        },
        
        zielklinik: {
            geburtsklinik: {
                probability: 0.7,
                bei_unkompliziert: 1.0
            },
            
            perinatalzentrum: {
                probability: 0.3,
                indikationen: [
                    'Frühgeburt <32 SSW',
                    'Schwere Komplikationen',
                    'Mehrlinge',
                    'Baby reanimationspflichtig'
                ]
            }
        },
        
        transport: {
            beide_patienten: 1.0,
            info: 'Mutter UND Baby transportieren',
            bonding_ermöglichen: 0.9
        }
    },
    
    // ========================================
    // 📊 PROTOKOLL & BEWERTUNG
    // ========================================
    protokoll: {
        tracked_data: {
            geburtsstadium_erkannt: 'FROM_CALL',
            transport_entscheidung: 'FROM_ASSESSMENT',
            geburtshilfe_anleitung: 'FROM_DISPOSITION',
            komplikationen_erkannt: 'FROM_ASSESSMENT',
            nef_bei_bedarf: 'FROM_DISPOSITION'
        },
        
        bewertung: {
            kriterien: {
                geburtsstadium_erfragt: {
                    wichtig: 'kritisch',
                    info: 'Eröffnung oder Austreibung?'
                },
                
                pressdrang_abgefragt: {
                    wichtig: 'sehr_hoch',
                    info: 'Muss sie pressen? → KEIN Transport!'
                },
                
                kopf_sichtbar: {
                    wichtig: 'sehr_hoch',
                    info: 'Kopf zu sehen? → Geburt unmittelbar!'
                },
                
                transport_entscheidung_richtig: {
                    wichtig: 'kritisch',
                    info: 'Austreibung = KEIN Transport!'
                },
                
                geburtshilfe_angeleitet: {
                    wichtig: 'hoch',
                    info: 'Ruhe bewahren, Hände unter Kopf'
                },
                
                baby_versorgung_erklärt: {
                    wichtig: 'sehr_hoch',
                    info: 'Abtrocknen, Wärmen, Absaugen'
                },
                
                nef_bei_komplikation: {
                    wichtig: 'hoch',
                    info: 'Bei Blutung, Reanimation, Frühgeburt'
                },
                
                ruhe_ausgestrahlt: {
                    wichtig: 'sehr_hoch',
                    info: 'Disponent muss Ruhe bewahren!'
                }
            },
            
            kritische_fehler: [
                'Transport bei Austreibungsphase',
                'Geburtsstadium nicht erkannt',
                'Keine Geburtshilfe-Anleitung',
                'Baby-Versorgung nicht erklärt',
                'Kein NEF bei Komplikation',
                'Panik verbreitet'
            ],
            
            häufige_fehler: [
                'Pressdrang nicht erfragt',
                'Kopf sichtbar nicht gefragt',
                'Wärmeerhalt Baby nicht betont',
                'APGAR nicht erwähnt',
                'Plazenta vergessen'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Notfallgeburt, Austreibungsphase, Geburt steht unmittelbar bevor',
            'Geburt bereits erfolgt, Mutter und Kind stabil',
            'Geburt mit Komplikation, starke Blutung',
            'Frühgeburt, {ssw}. SSW, Perinatalzentrum erforderlich'
        ],
        
        voranmeldung: [
            '{hospital} Geburtsklinik, hier {callsign}',
            'Voranmeldung Notfallgeburt',
            'Patientin {alter} Jahre',
            'Geburt präklinisch erfolgt',
            'Mutter stabil/instabil',
            'Neugeborenes, APGAR {apgar}',
            'ETA {eta} Minuten, kommen.'
        ]
    },
    
    // ========================================
    // 🎯 SPECIAL
    // ========================================
    special: {
        learning_points: [
            'Geburtsstadium erkennen (Eröffnung vs. Austreibung)',
            'Pressdrang = KEIN Transport!',
            'Kopf sichtbar = Geburt unmittelbar',
            'Meist läuft alles gut - Ruhe bewahren',
            'Baby: Abtrocknen + Wärmen KRITISCH',
            'APGAR nach 1/5/10 Min',
            'NICHT am Baby ziehen',
            'Plazenta mitnehmen',
            'NEF bei Komplikationen',
            'Perinatalzentrum bei Frühgeburt'
        ],
        
        szenarien: {
            hausgeburt_unkompliziert: {
                häufigkeit: 0.5,
                ablauf: [
                    'Wehen alle 2 Min, Pressdrang',
                    'Kopf wird sichtbar',
                    'Geburtshilfe-Anleitung',
                    'Baby geboren, schreit sofort',
                    'APGAR 9/10/10',
                    'Plazenta nach 15 Min',
                    'Mutter und Kind stabil'
                ]
            },
            
            sturzgeburt_auto: {
                häufigkeit: 0.2,
                ablauf: [
                    'Auf dem Weg zur Klinik',
                    'Plötzlich starker Pressdrang',
                    'Baby kommt sehr schnell',
                    'Partner völlig überfordert',
                    'Baby unterkühlt',
                    'Sofort wärmen'
                ]
            }
        },
        
        wichtigste_botschaft: {
            text: 'DIE MEISTEN GEBURTEN LAUFEN GUT!',
            info: 'Disponent muss Ruhe bewahren und ausstrahlen',
            erfolgsrate_natur: 0.95
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GEBURT_TEMPLATE };
}
