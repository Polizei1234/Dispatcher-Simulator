// =========================================================================================
// GEBURT TEMPLATE - Notfallgeburt außerklinisch
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const GEBURT_TEMPLATE = {
    
    id: 'geburt',
    kategorie: 'rd',
    stichwort: 'Geburt',
    weight: 1,
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            partner_aufgeregt: {
                probability: 0.5,
                speech_pattern: 'panisch, hektisch',
                variations: [
                    'Meine Frau bekommt das Baby!',
                    'Die Wehen kommen so schnell!',
                    'Es geht los! Das Baby kommt!',
                    'Sie bekommt das Kind JETZT!'
                ],
                effects: {
                    übertreibt_evtl: 0.3,
                    hilflos: 0.9
                }
            },
            
            schwangere_selbst: {
                probability: 0.25,
                speech_pattern: 'gepresst, atemlos',
                variations: [
                    'Das Baby... kommt... jetzt...',
                    'Ich... bekomme... mein Kind...',
                    'Die Wehen... ich muss pressen...'
                ],
                effects: {
                    hörbar_wehen: 0.9,
                    pressen_hörbar: 0.6
                }
            },
            
            angehörige: {
                probability: 0.15,
                speech_pattern: 'besorgt aber gefasster',
                variations: [
                    'Meine Tochter bekommt ihr Baby',
                    'Die Geburt geht zu schnell'
                ],
                mehr_erfahrung: 0.6
            },
            
            hebamme_zu_hause: {
                probability: 0.08,
                speech_pattern: 'professionell, klar',
                variations: [
                    'Hebamme hier, Komplikation bei Hausgeburt',
                    'Geburt läuft nicht normal, brauche Verstärkung'
                ],
                effects: {
                    komplikation_wahrscheinlich: 0.9,
                    genaue_infos: 1.0
                }
            },
            
            nachbar: {
                probability: 0.02,
                speech_pattern: 'unsicher, überfordert',
                variations: [
                    'Meine Nachbarin schreit, ich glaube sie bekommt ein Baby!',
                    'Hier schreit jemand, glaube Geburt'
                ],
                wenig_infos: 0.9
            }
        },
        
        dynamik: {
            pressdrang: {
                probability: 0.7,
                trigger_time: { min: 30, max: 120 },
                change: 'Sie muss pressen! Ich sehe den Kopf!',
                effects: {
                    geburt_unmittelbar: 1.0
                },
                info: 'Geburt steht unmittelbar bevor!'
            },
            
            baby_geboren: {
                probability: 0.3,
                trigger_time: { min: 120, max: 360 },
                change: 'Das Baby ist da!',
                effects: {
                    neue_phase: 1.0,
                    fokus_jetzt_baby: 1.0
                }
            },
            
            komplikation: {
                probability: 0.15,
                trigger_time: { min: 180, max: 480 },
                changes: [
                    'Es blutet sehr stark!',
                    'Das Baby schreit nicht!',
                    'Die Nabelschnur ist um den Hals!'
                ],
                effects: {
                    kritischer: 1.0,
                    nef_wahrscheinlich: 0.8
                }
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENTIN
    // ========================================
    patientin: {
        alter: {
            distribution: 'normal',
            mean: 30,
            stddev: 6,
            min: 16,
            max: 48
        },
        
        schwangerschaftswoche: {
            frühgeburt: {
                probability: 0.15,
                ssw: { mean: 34, range: [28, 36] },
                komplikationen_häufiger: 0.8,
                baby_bedürftig: 0.9,
                info: 'Vor SSW 37 = Frühgeburt'
            },
            
            termingerecht: {
                probability: 0.75,
                ssw: { mean: 40, range: [37, 41] },
                normal: 1.0
            },
            
            übertragen: {
                probability: 0.1,
                ssw: { mean: 42, range: [41, 43] },
                komplikationen_evtl: 0.5
            }
        },
        
        gravida_para: {
            erstgebärende: {
                probability: 0.4,
                info: 'Erste Geburt',
                geburt_meist_länger: 0.8,
                angst_größer: 0.8,
                variationen: ['erste Schwangerschaft', 'erstes Kind']
            },
            
            mehrgebärende: {
                probability: 0.6,
                info: 'Hatte schon Kinder',
                geburt_oft_schneller: 0.9,
                routine: 0.6,
                variationen: [
                    'zweites Kind',
                    'drittes Kind',
                    'hat schon {x} Kinder'
                ],
                sturzgeburt_wahrscheinlicher: 0.7
            }
        }
    },
    
    // ========================================
    // 👶 GEBURTSVERLAUF
    // ========================================
    geburtsverlauf: {
        phase: {
            eröffnungsphase: {
                probability: 0.3,
                beschreibung: 'Wehen regelmäßig, Muttermund öffnet sich',
                wehen: {
                    intervall: { mean: 5, range: [3, 10], unit: 'Minuten' },
                    dauer: { mean: 60, range: [40, 90], unit: 'Sekunden' }
                },
                zeit_bis_geburt: { mean: 120, range: [30, 360], unit: 'Minuten' },
                transport_meist_möglich: 0.9,
                info: 'Oft noch Zeit für Transport'
            },
            
            übergangsphase: {
                probability: 0.25,
                beschreibung: 'Muttermund fast vollständig, starke Wehen',
                wehen: {
                    intervall: { mean: 2, range: [1, 3], unit: 'Minuten' },
                    dauer: { mean: 90, range: [60, 120], unit: 'Sekunden' },
                    sehr_schmerzhaft: 1.0
                },
                zeit_bis_geburt: { mean: 30, range: [10, 90], unit: 'Minuten' },
                transport_fraglich: 0.5,
                info: 'Kritische Phase - Transport oder vor Ort?'
            },
            
            austreibungsphase: {
                probability: 0.4,
                beschreibung: 'Pressdrang, Baby kommt',
                pressdrang: 1.0,
                variations: [
                    'muss pressen',
                    'kann nicht anders',
                    'das Baby kommt'
                ],
                zeit_bis_geburt: { mean: 15, range: [2, 45], unit: 'Minuten' },
                transport_nicht_möglich: 0.9,
                geburt_vor_ort: 0.95,
                info: 'Geburt unmittelbar bevorstehenend!'
            },
            
            nachgeburtsphase: {
                probability: 0.05,
                beschreibung: 'Baby schon geboren, Plazenta kommt',
                baby_da: 1.0,
                plazenta_folgt: 1.0,
                zeit: { mean: 15, range: [5, 30], unit: 'Minuten' },
                info: 'Rettungsdienst kommt oft in dieser Phase an'
            }
        },
        
        geschwindigkeit: {
            normal: {
                probability: 0.6,
                info: 'Regelrechter Verlauf'
            },
            
            sturzgeburt: {
                probability: 0.3,
                beschreibung: 'Sehr schnelle Geburt unter 2 Stunden',
                variations: [
                    'ging alles so schnell',
                    'plötzlich war das Baby da',
                    'keine Zeit mehr'
                ],
                meist_bei: 'Mehrgebärende',
                überraschung: 0.9,
                baby_oft_schon_da: 0.4,
                info: 'Häufig bei außerklinischer Geburt!'
            },
            
            protrahiert: {
                probability: 0.1,
                beschreibung: 'Sehr lange Geburt',
                erschöpfung_mutter: 0.9,
                komplikationen_häufiger: 0.7
            }
        },
        
        besonderheiten: {
            blasensprung: {
                probability: 0.8,
                wann: {
                    vor_wehen: { probability: 0.3, info: 'Vorzeitiger Blasensprung' },
                    während_geburt: { probability: 0.6 },
                    nicht_bemerkt: { probability: 0.1 }
                },
                variations: [
                    'Fruchtblase ist geplatzt',
                    'Wasser ist weg',
                    'alles nass'
                ],
                fruchtwasser: {
                    klar: { probability: 0.8, gut: 1.0 },
                    grünlich: {
                        probability: 0.15,
                        info: 'Mekonium - Baby gestresst!',
                        vorsicht: 1.0
                    },
                    blutig: {
                        probability: 0.05,
                        kritisch: 0.8
                    }
                }
            },
            
            kopf_sichtbar: {
                probability: 0.3,
                variations: [
                    'Ich sehe den Kopf!',
                    'Der Kopf ist schon da!',
                    'Das Köpfchen kommt raus!'
                ],
                geburt_innerhalb_minuten: 0.95,
                transport_unmöglich: 1.0
            },
            
            nabelschnur_sichtbar: {
                probability: 0.05,
                variations: [
                    'Die Nabelschnur ist um den Hals!',
                    'Da ist eine Schnur!'
                ],
                kritisch: 0.6,
                anleitung_nötig: 1.0,
                info: 'Nabelschnurumschlingung - meist harmlos wenn locker'
            }
        }
    },
    
    // ========================================
    // 🏥 SYMPTOME & ZEICHEN
    // ========================================
    symptome: {
        wehen: {
            probability: 1.0,
            beschreibung: 'Regelmäßige, schmerzhafte Kontraktionen',
            hörbar: {
                probability: 0.8,
                variations: [
                    'schreit bei jeder Wehe',
                    'stöhnt',
                    'atmet heftig'
                ]
            },
            frequenz_siehe: 'geburtsverlauf.phase'
        },
        
        pressdrang: {
            probability: 0.5,
            variations: [
                'muss pressen',
                'ich kann nicht anders',
                'drang zu pressen'
            ],
            zeichen_für: 'Austreibungsphase',
            geburt_unmittelbar: 1.0
        },
        
        schmerzen: {
            probability: 1.0,
            severity: {
                erträglich: { probability: 0.2 },
                stark: { probability: 0.6 },
                unerträglich: { probability: 0.2 }
            },
            location: ['Unterbauch', 'Rücken']
        },
        
        blutung: {
            probability: 0.4,
            severity: {
                leicht: {
                    probability: 0.7,
                    info: 'Zeichnungsblutung - normal',
                    besorgniserregend: 0.1
                },
                mäßig: {
                    probability: 0.2,
                    evtl_komplikation: 0.4
                },
                stark: {
                    probability: 0.1,
                    variations: ['blutet stark', 'viel Blut'],
                    kritisch: 0.9,
                    mögliche_ursachen: [
                        'Plazentalösung',
                        'Plazenta praevia',
                        'Uterusruptur'
                    ]
                }
            }
        },
        
        angst_panik: {
            probability: 0.7,
            besonders_bei: 'Erstgebärende',
            variations: [
                'hat Angst',
                'ist in Panik',
                'totale Panik'
            ],
            beruhigung_wichtig: 1.0
        }
    },
    
    // ========================================
    // 👶 BABY
    // ========================================
    baby: {
        status_nach_geburt: {
            vital: {
                probability: 0.85,
                variations: [
                    'Baby schreit',
                    'atmet',
                    'ist rosa',
                    'bewegt sich'
                ],
                apgar_gut: 1.0
            },
            
            adaptation_verzögert: {
                probability: 0.1,
                variations: [
                    'atmet noch nicht richtig',
                    'ist noch blau',
                    'schreit nicht'
                ],
                maßnahmen_nötig: 1.0,
                meist_harmlos: 0.7
            },
            
            reanimationspflichtig: {
                probability: 0.05,
                variations: [
                    'Baby atmet nicht!',
                    'ist ganz blau!',
                    'bewegt sich nicht!'
                ],
                kritisch: 1.0,
                nef_zwingend: 1.0,
                telefonreanimation: 1.0
            }
        },
        
        nabelschnur: {
            pulsierend: {
                probability: 0.6,
                info: 'Sofort nach Geburt normal',
                nicht_durchtrennen: 1.0
            },
            
            nicht_mehr_pulsierend: {
                probability: 0.4,
                info: 'Nach einigen Minuten',
                durchtrennen_evtl: 0.5
            },
            
            umschlingung: {
                probability: 0.2,
                variations: ['um den Hals', 'um den Körper'],
                severity: {
                    locker: { probability: 0.8, harmlos: 1.0 },
                    eng: { probability: 0.2, problematisch: 0.7 }
                }
            }
        },
        
        plazenta: {
            noch_drin: {
                probability: 0.6,
                info: 'Kommt nach 5-30 Minuten',
                nicht_ziehen: 1.0
            },
            
            geboren: {
                probability: 0.4,
                mitnehmen: 1.0,
                kontrollieren: 'Vollständigkeit'
            }
        },
        
        frühgeburt_besonderheiten: {
            condition: 'ssw < 37',
            unterkühlung_gefahr: 0.9,
            atemprobleme_häufiger: 0.7,
            kinderarzt_nötig: 1.0,
            spezial_transport: 0.8
        }
    },
    
    // ========================================
    // 🏥 KOMPLIKATIONEN
    // ========================================
    komplikationen: {
        keine: {
            probability: 0.7,
            info: 'Normale Geburt'
        },
        
        postpartale_blutung: {
            probability: 0.15,
            beschreibung: 'Starke Blutung nach Geburt',
            variations: [
                'blutet sehr stark',
                'viel Blut',
                'hört nicht auf zu bluten'
            ],
            ursachen: {
                uterusatonie: {
                    probability: 0.7,
                    info: 'Gebärmutter zieht sich nicht zusammen',
                    fundus_massage: 1.0
                },
                riss: {
                    probability: 0.2,
                    info: 'Geburtsverletzung'
                },
                plazentarest: {
                    probability: 0.1,
                    info: 'Plazenta nicht vollständig'
                }
            },
            kritisch: 0.9,
            schock_risiko: 0.7
        },
        
        nabelschnurvorfall: {
            probability: 0.02,
            beschreibung: 'Nabelschnur vor dem Kopf',
            variations: ['Nabelschnur kommt zuerst raus'],
            kritisch: 1.0,
            baby_gefahr: 1.0,
            sofortmaßnahmen: 1.0,
            info: 'ABSOLUTER NOTFALL!'
        },
        
        schulterdystokie: {
            probability: 0.03,
            beschreibung: 'Schulter bleibt stecken',
            variations: [
                'Kopf ist da aber Rest kommt nicht',
                'Baby steckt fest'
            ],
            kritisch: 1.0,
            manöver_nötig: 1.0,
            zeit_kritisch: 1.0
        },
        
        placenta_praevia: {
            probability: 0.01,
            beschreibung: 'Plazenta vor Muttermund',
            starke_blutung: 1.0,
            kritisch: 1.0,
            meist_bekannt: 0.8,
            sectio_geplant: 0.9
        },
        
        zwillinge_überraschung: {
            probability: 0.01,
            beschreibung: 'Zweites Baby unerwartet',
            variations: [
                'Da kommt noch eins!',
                'Moment... es sind Zwillinge!'
                ],
            überraschung: 1.0,
            meist_bekannt_heute: 0.99,
            info: 'Sehr selten - Ultraschall verfügbar!'
        },
        
        steßlage: {
            probability: 0.02,
            beschreibung: 'Baby kommt mit Po zuerst',
            variations: ['kommt mit dem Po', 'liegt verkehrt herum'],
            schwieriger: 1.0,
            meist_bekannt: 0.9,
            sectio_empfohlen: 0.9
        },
        
        eklampsie: {
            probability: 0.01,
            beschreibung: 'Krampfanfall während Geburt',
            kritisch: 1.0,
            mutter_und_kind_gefahr: 1.0,
            nef_zwingend: 1.0
        }
    },
    
    // ========================================
    // 🏠 UMGEBUNG
    // ========================================
    umgebung: {
        ort: {
            wohnhaus: {
                probability: 0.75,
                address_types: ['residential', 'apartment'],
                räume: {
                    schlafzimmer: 0.5,
                    badezimmer: 0.3,
                    wohnzimmer: 0.15,
                    andere: 0.05
                },
                meist_günstig: 0.8
            },
            
            auto: {
                probability: 0.15,
                variations: [
                    'im Auto auf dem Weg ins Krankenhaus',
                    'auf Parkplatz',
                    'im Stau'
                ],
                beengt: 1.0,
                schwierig: 0.9
            },
            
            öffentlich: {
                probability: 0.08,
                address_types: ['street', 'shop', 'restaurant'],
                variations: [
                    'auf der Straße',
                    'im Geschäft',
                    'im Restaurant'
                ],
                zeugen: { min: 2, max: 10 },
                intimität_fehlt: 1.0
            },
            
            taxi: {
                probability: 0.02,
                variations: ['im Taxi'],
                fahrer_überfordert: 0.9
            }
        },
        
        bedingungen: {
            sauber: { probability: 0.6 },
            notdürftig: { probability: 0.3 },
            unhygienisch: {
                probability: 0.1,
                infektionsrisiko: 0.6
            }
        },
        
        vorbereitung: {
            handtücher_vorhanden: { probability: 0.8 },
            warm: { probability: 0.7 },
            hilfe_vor_ort: { probability: 0.9 }
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK
    // ========================================
    sozial: {
        partner: {
            anwesend: {
                probability: 0.8,
                zustand: {
                    hilfreich: { probability: 0.4 },
                    panisch: { probability: 0.4 },
                    ohnmächtig: { probability: 0.05, info: 'Klassiker!' },
                    überfordert: { probability: 0.15 }
                }
            },
            
            nicht_da: {
                probability: 0.2,
                alleine: 0.5,
                andere_helfen: 0.5
            }
        },
        
        erfahrung: {
            niemand_erfahren: {
                probability: 0.6,
                anleitung_nötig: 1.0,
                panik_größer: 0.8
            },
            
            hebamme_da: {
                probability: 0.05,
                siehe: 'anrufer.typen.hebamme_zu_hause',
                situation_kontrolliert: 0.9
            },
            
            mutter_erfahren: {
                probability: 0.1,
                hat_selbst_kinder: 1.0,
                kann_helfen: 0.8
            }
        },
        
        kinder_anwesend: {
            probability: 0.3,
            variations: [
                'Geschwister sind da',
                'andere Kinder im Raum'
            ],
            betreuung_nötig: 0.8,
            traumatisierung_möglich: 0.3
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        wohnung: {
            probability: 0.75,
            address_types: ['residential', 'apartment']
        },
        
        auto_parkplatz: {
            probability: 0.17,
            address_types: ['road', 'parking']
        },
        
        öffentlich: {
            probability: 0.08,
            address_types: ['street', 'shop', 'restaurant', 'station']
        }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN
    // ========================================
    nachforderungen: {
        nef: {
            probability: 0.15,
            trigger_time: { min: 120, max: 360 },
            reasons: [
                'Postpartale Blutung',
                'Baby reanimationspflichtig',
                'Eklampsie',
                'Schwere Komplikation',
                'Frühgeburt'
            ],
            funkspruch: '{callsign}, Komplikation bei Geburt, benötigen NEF, kommen.'
        },
        
        rtw_zusatz: {
            probability: 0.1,
            reasons: [
                'Zwillinge',
                'Mutter und Baby getrennt transportieren',
                'Weitere Komplikation'
            ]
        },
        
        kindernotarzt: {
            probability: 0.05,
            condition: 'frühgeburt_oder_baby_kritisch',
            info: 'Spezialisiert auf Neugeborene'
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        während_anfahrt: {
            baby_kommt: {
                probability: 0.3,
                trigger_time: { min: 120, max: 360 },
                change: 'Das Baby ist da!',
                telefonische_anleitung: 1.0
            },
            
            komplikation_entwickelt: {
                probability: 0.1,
                siehe: 'komplikationen'
            }
        },
        
        bei_eintreffen: {
            alles_erledigt: {
                probability: 0.3,
                info: 'Baby schon geboren, alles gut',
                nachsorge: 1.0
            },
            
            geburt_unmittelbar: {
                probability: 0.4,
                info: 'Geburt steht bevor',
                vor_ort_entbindung: 0.9
            },
            
            komplikation: {
                probability: 0.15,
                siehe: 'komplikationen'
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
        
        transport: {
            priorität_1: {
                condition: 'komplikation_oder_frühgeburt',
                hospitals: ['klinikum_ludwigsburg', 'katharinenhospital_stuttgart', 'rems_murr_klinikum_winnenden'],
                reason: 'Gebärstationen Level 1, Neugeborenen-Intensiv',
                spezial_transport_baby: 0.6
            },
            
            priorität_2: {
                condition: 'unkomplizierte_geburt',
                hospitals: ['nächste_geburtsklinik'],
                reason: 'Nachsorge, Überwachung'
            },
            
            mutter_baby_getrennt: {
                probability: 0.05,
                condition: 'baby_kritisch',
                baby_mit_nef: 1.0,
                mutter_mit_rtw: 1.0
            }
        },
        
        voranmeldung: {
            immer: 1.0,
            infos: [
                'Außerklinische Geburt',
                'Schwangerschaftswoche',
                'Gravida/Para',
                'Zustand Mutter',
                'Zustand Baby',
                'Komplikationen',
                'Plazenta geboren?'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Notfallgeburt, Geburt unmittelbar bevorstehend',
            'Außerklinische Geburt, Baby geboren, Mutter und Kind stabil',
            'Geburt, SSW {x}, Mutter und Kind wohlauf',
            'Sturzgeburt, Baby vital, Transport zur Nachsorge',
            'Geburt mit Komplikation, postpartale Blutung'
        ]
    },
    
    // ========================================
    // 📊 SPECIAL
    // ========================================
    special: {
        telefonische_anleitung: {
            wichtig: 1.0,
            themen: [
                'Beruhigen',
                'Position der Mutter',
                'Nicht pressen verhindern',
                'Baby auffangen',
                'Warm halten',
                'Nabelschnur nicht durchschneiden',
                'Atmung Baby prüfen'
            ]
        },
        
        mythen: {
            heißes_wasser: {
                info: 'Früher für Hygiene, heute nicht mehr nötig',
                aber: 'Warm halten wichtig!'
            },
            
            nabelschnur_sofort_durch: {
                info: 'NICHT sofort durchtrennen!',
                richtig: 'Warten oder pulsieren lassen'
            }
        },
        
        häufigkeit: {
            info: 'Nur ca. 1-2% aller Geburten außerklinisch',
            meist_nicht_geplant: 0.95,
            geplante_hausgeburt: 0.05
        },
        
        outcome: {
            meist_gut: 0.9,
            info: 'Wenn es so schnell geht, läuft meist alles gut',
            aber: 'Trotzdem Kontrolle wichtig!'
        },
        
        rechtliches: {
            geburtsurkunde: {
                info: 'Auch außerklinische Geburt melden',
                standesamt: 1.0
            },
            
            dokumentation: {
                wichtig: 1.0,
                details: [
                    'Geburtszeit',
                    'Geburtsort',
                    'Zustand bei Geburt',
                    'APGAR-Score',
                    'Gewicht (später)',
                    'Geschlecht'
                ]
            }
        },
        
        apgar_score: {
            info: 'Beurteilung Neugeborenes nach 1, 5, 10 Minuten',
            kriterien: [
                'Atmung',
                'Herzfrequenz',
                'Hautfarbe',
                'Muskeltonus',
                'Reflexe'
            ],
            wichtig_dokumentieren: 1.0
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GEBURT_TEMPLATE };
}
