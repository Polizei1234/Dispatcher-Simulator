// =========================================================================================
// SYNKOPE/KOLLAPS TEMPLATE - Kurze Bewusstlosigkeit, viele mögliche Ursachen
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const SYNKOPE_TEMPLATE = {
    
    id: 'synkope',
    kategorie: 'rd',
    stichwort: 'Synkope / Kollaps',
    weight: 3,
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            zeuge_öffentlich: {
                probability: 0.35,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Hier ist jemand umgekippt!',
                    'Eine Person ist zusammengebrochen!',
                    'Jemand ist ohnmächtig geworden!',
                    'Ist einfach umgefallen!'
                ],
                location: 'öffentlich'
            },
            
            angehöriger: {
                probability: 0.3,
                speech_pattern: 'besorgt bis panisch',
                variations: [
                    'Mein Mann ist umgekippt!',
                    'Sie ist ohnmächtig geworden!',
                    'Er ist plötzlich zusammengesackt!',
                    'Sie ist bewusstlos!'
                ]
            },
            
            patient_selbst: {
                probability: 0.25,
                speech_pattern: 'verwirrt, schwach',
                variations: [
                    'Mir ist gerade schwarz vor Augen geworden',
                    'Ich bin umgekippt... weiß nicht was passiert ist',
                    'Mir wurde plötzlich schwindelig und dann... keine Ahnung',
                    'Bin wohl kurz weg gewesen'
                ],
                effects: {
                    erinnerungslücke: 0.8,
                    orientierungsstörung: 0.6
                }
            },
            
            arbeitskollege: {
                probability: 0.08,
                speech_pattern: 'sachlich aber besorgt',
                variations: [
                    'Kollegin ist umgekippt',
                    'Kollege zusammengebrochen'
                ],
                location: 'arbeitsplatz'
            },
            
            personal: {
                probability: 0.02,
                speech_pattern: 'professionell',
                variations: [
                    'Gast kollabiert',
                    'Kunde ohnmächtig geworden'
                ],
                location: ['restaurant', 'geschäft']
            }
        },
        
        dynamik: {
            patient_wieder_wach: {
                probability: 0.8,
                trigger_time: { min: 30, max: 180 },
                change: '{Er/Sie} ist wieder wach, aber noch verwirrt',
                info: 'Typisch bei Synkope'
            },
            
            bleibt_bewusstlos: {
                probability: 0.1,
                trigger_time: { min: 60, max: 240 },
                change: 'Ist immer noch bewusstlos!',
                effects: {
                    kritischer: 1.0,
                    upgrade_stichwort: 'Bewusstlosigkeit',
                    andere_ursache_wahrscheinlich: 0.9
                }
            },
            
            erneuter_kollaps: {
                probability: 0.05,
                trigger_time: { min: 180, max: 360 },
                change: 'Ist wieder umgekippt!',
                effects: {
                    herzrhythmusstörung_wahrscheinlich: 0.7
                }
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.45,
            female: 0.55
        },
        
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 25, stddev: 8, weight: 0.3 },   // Jüngere (vasovagal)
            peak2: { mean: 70, stddev: 12, weight: 0.7 },  // Ältere (kardial)
            min: 16,
            max: 95
        },
        
        zustand_aktuell: {
            wieder_wach: {
                probability: 0.7,
                variations: [
                    'ist wieder bei Bewusstsein',
                    'wieder wach aber verwirrt',
                    'wach geworden'
                ]
            },
            
            noch_benommen: {
                probability: 0.2,
                variations: [
                    'ist noch benommen',
                    'verwirrt',
                    'orientierungslos'
                ]
            },
            
            bewusstlos: {
                probability: 0.1,
                upgrade_stichwort: 'Bewusstlosigkeit',
                siehe: 'bewusstlosigkeit_template'
            }
        }
    },
    
    // ========================================
    // 💥 KOLLAPS-HERGANG
    // ========================================
    hergang: {
        plötzlich: {
            probability: 0.8,
            variations: [
                'ist einfach umgekippt',
                'ohne Vorwarnung zusammengebrochen',
                'plötzlich umgefallen',
                'auf einmal war {er/sie} am Boden'
            ],
            dauer_bewusstlosigkeit: {
                mean: 30,
                stddev: 20,
                min: 5,
                max: 120,
                unit: 'Sekunden'
            }
        },
        
        mit_vorwarnung: {
            probability: 0.2,
            prodromi: {
                schwindel: {
                    probability: 0.9,
                    variations: ['wurde schwindelig', 'alles drehte sich']
                },
                übelkeit: {
                    probability: 0.5,
                    variations: ['übel geworden', 'Brechreiz']
                },
                schwarzwerden: {
                    probability: 0.7,
                    variations: ['wurde schwarz vor Augen', 'Sehstörungen']
                },
                schwitzen: {
                    probability: 0.6,
                    variations: ['fing an zu schwitzen', 'Schwitzanfall']
                },
                schwächegefühl: {
                    probability: 0.5,
                    variations: ['Beine wurden weich', 'kraftlos']
                }
            },
            info: 'Typisch für vasovagale Synkope'
        },
        
        aufschlag: {
            hart_aufgeschlagen: {
                probability: 0.4,
                effects: {
                    verletzungen_wahrscheinlich: 0.8,
                    kopfverletzung: 0.5
                },
                variations: [
                    'ist hart aufgeschlagen',
                    'wie ein Sack umgefallen',
                    'konnte sich nicht abfangen'
                ]
            },
            
            konnte_abfangen: {
                probability: 0.3,
                effects: {
                    verletzungen_seltener: 1.0
                },
                variations: ['konnte sich noch etwas abstützen']
            },
            
            sanft: {
                probability: 0.3,
                variations: [
                    'ist langsam zusammengesackt',
                    'jemand hat {ihn/sie} aufgefangen'
                ],
                verletzungen_selten: 0.9
            }
        }
    },
    
    // ========================================
    // 🏥 URSACHEN
    // ========================================
    ursachen: {
        // Harmlose Ursachen
        vasovagale_synkope: {
            probability: 0.35,
            beschreibung: 'Reflex-Synkope, harmlos',
            alter_typisch: { mean: 25, range: [16, 50] },
            auslöser: {
                langes_stehen: {
                    probability: 0.3,
                    variations: ['stand lange', 'in Warteschlange']
                },
                hitze: {
                    probability: 0.2,
                    variations: ['war sehr heiß', 'in überfülltem Raum']
                },
                schmerz_schreck: {
                    probability: 0.15,
                    variations: ['nach Blutabnahme', 'Schmerz', 'Schreck']
                },
                emotionaler_stress: {
                    probability: 0.15,
                    variations: ['schlechte Nachricht', 'Aufregung']
                },
                husten_pressen: {
                    probability: 0.1,
                    variations: ['nach starkem Husten', 'beim Pressen']
                },
                ohne_auslöser: {
                    probability: 0.1
                }
            },
            prognose: 'gut',
            wiedererholung_schnell: 0.9
        },
        
        orthostatische_synkope: {
            probability: 0.25,
            beschreibung: 'Blutdruckabfall beim Aufstehen',
            situation: {
                aus_bett_aufgestanden: 0.4,
                von_stuhl_aufgestanden: 0.3,
                nach_langem_liegen: 0.2,
                andere: 0.1
            },
            variations: [
                'beim Aufstehen umgekippt',
                'wurde schwindelig als {er/sie} aufstand',
                'Kreislauf sackte ab'
            ],
            risikofaktoren: {
                medikamente: 0.6,
                dehydrierung: 0.4,
                alter: 0.7
            },
            info: 'Häufig bei Älteren mit Blutdruckmedikamenten'
        },
        
        // Potenziell gefährliche Ursachen
        herzrhythmusstörung: {
            probability: 0.15,
            beschreibung: 'Kardiale Synkope - ABKLÄRUNG WICHTIG!',
            types: {
                bradykardie: {
                    probability: 0.5,
                    info: 'Zu langsamer Herzschlag',
                    puls_niedrig: 1.0
                },
                tachykardie: {
                    probability: 0.5,
                    info: 'Zu schneller Herzschlag',
                    puls_hoch: 1.0
                }
            },
            warnsignale: [
                'plötzlich ohne Warnung',
                'bekannte Herzerkrankung',
                'Herzstolpern vorher',
                'Schrittmacher'
            ],
            kritisch: 0.8,
            nef_empfohlen: 0.7,
            info: 'Plötzlicher Herztod möglich!'
        },
        
        herzinfarkt: {
            probability: 0.05,
            beschreibung: 'Synkope als Herzinfarkt-Symptom',
            zusatzsymptome: {
                brustschmerzen: 0.6,
                schwitzen: 0.7,
                übelkeit: 0.5,
                atemnot: 0.4
            },
            upgrade_stichwort: 'Herzinfarkt',
            kritisch: 1.0,
            info: 'Kann einziges Symptom sein!'
        },
        
        lungenembolie: {
            probability: 0.02,
            beschreibung: 'Schwere Lungenembolie mit Kreislaufeinbruch',
            zusatzsymptome: {
                atemnot: 0.9,
                brustschmerzen: 0.6,
                todesangst: 0.7
            },
            risikofaktoren: [
                'nach OP',
                'nach langer Reise',
                'bekannte Thrombose'
            ],
            kritisch: 1.0
        },
        
        schlaganfall: {
            probability: 0.03,
            beschreibung: 'Hirnstamm-Infarkt',
            zusatzsymptome: {
                neurologische_ausfälle: 0.8,
                verwirrtheit_anh: 0.7
            },
            upgrade_stichwort: 'Schlaganfall'
        },
        
        hypoglykämie: {
            probability: 0.08,
            beschreibung: 'Unterzuckerung',
            patient_typ: 'Diabetiker',
            anzeichen: {
                schwitzen: 0.9,
                zittern: 0.7,
                verwirrtheit: 0.8,
                hunger: 0.6
            },
            besserung_nach_zucker: 0.9,
            info: 'Schnelle Besserung nach Traubenzucker möglich'
        },
        
        dehydrierung: {
            probability: 0.05,
            beschreibung: 'Flüssigkeitsmangel',
            risiko: {
                sommer: 0.7,
                nach_sport: 0.5,
                ältere: 0.8
            },
            variations: [
                'hat zu wenig getrunken',
                'war in der Hitze',
                'nach Sport'
            ]
        },
        
        krampfanfall: {
            probability: 0.02,
            beschreibung: 'Epileptischer Anfall mit Bewusstseinsverlust',
            post_iktal: {
                verwirrtheit: 1.0,
                erschöpfung: 1.0
            },
            zeugen_berichten: [
                'hat gezuckt',
                'hat gekrampft',
                'Schaum vor dem Mund'
            ],
            siehe: 'krampfanfall_template'
        }
    },
    
    // ========================================
    // 🩹 SYMPTOME & BEFUNDE
    // ========================================
    symptome: {
        vor_kollaps: {
            siehe: 'hergang.mit_vorwarnung.prodromi'
        },
        
        während_bewusstlosigkeit: {
            dauer: {
                kurz: {
                    probability: 0.8,
                    sekunden: { mean: 20, range: [5, 60] },
                    info: 'Typisch für Synkope'
                },
                lang: {
                    probability: 0.2,
                    minuten: { mean: 3, range: [1, 10] },
                    info: 'Eher andere Ursache'
                }
            },
            
            zuckungen: {
                probability: 0.15,
                variations: [
                    'hat kurz gezuckt',
                    'Arme haben gezappelt'
                ],
                info: 'Konvulsive Synkope - keine Epilepsie!'
            }
        },
        
        nach_aufwachen: {
            verwirrtheit: {
                probability: 0.6,
                dauer: { mean: 2, max: 10, unit: 'Minuten' },
                variations: [
                    'weiß nicht wo {er/sie} ist',
                    'verwirrt',
                    'orientierungslos'
                ]
            },
            
            schwäche: {
                probability: 0.7,
                variations: [
                    'fühlt sich schwach',
                    'kann noch nicht aufstehen',
                    'zittrig'
                ]
            },
            
            kopfschmerzen: {
                probability: 0.3,
                meist_durch: 'Aufschlag'
            },
            
            erinnerungslücke: {
                probability: 0.8,
                variations: [
                    'kann sich nicht erinnern',
                    'weiß nicht was passiert ist',
                    'alles schwarz'
                ]
            },
            
            schnelle_erholung: {
                probability: 0.6,
                info: 'Nach 5-10 Minuten wieder fit',
                gutes_zeichen: 1.0
            }
        },
        
        verletzungen: {
            keine: { probability: 0.4 },
            
            kopf: {
                probability: 0.35,
                types: {
                    platzwunde: 0.6,
                    beule: 0.3,
                    schürfwunde: 0.1
                },
                siehe: 'sturz_template.verletzungen.kopf'
            },
            
            sonstige: {
                probability: 0.25,
                types: ['Prellung', 'Schürfwunde', 'leichte Fraktur']
            }
        }
    },
    
    // ========================================
    // 🏥 MEDIZINISCH
    // ========================================
    medizinisch: {
        vorerkrankungen: {
            probability: 0.6,
            types: {
                herzerkrankungen: {
                    probability: 0.4,
                    warnsignal: 1.0,
                    abklärung_wichtig: 1.0
                },
                rhythmusstörungen: {
                    probability: 0.25,
                    kritisch: 0.8
                },
                diabetes: {
                    probability: 0.3,
                    hypoglykämie_möglich: 0.5
                },
                epilepsie: {
                    probability: 0.1,
                    krampfanfall_wahrscheinlich: 0.7
                },
                bluthochdruck: {
                    probability: 0.5
                }
            }
        },
        
        medikamente: {
            blutdrucksenker: {
                probability: 0.5,
                orthostatische_synkope_wahrscheinlicher: 0.8
            },
            
            herzmedikamente: {
                probability: 0.3,
                types: ['Betablocker', 'Antiarrhythmika']
            },
            
            diabetes_medikamente: {
                probability: 0.25,
                hypoglykämie_risiko: 0.6
            },
            
            schrittmacher: {
                probability: 0.08,
                defekt_möglich: 0.2,
                abklärung_nötig: 1.0
            }
        },
        
        vitalparameter: {
            normal: {
                probability: 0.5,
                info: 'Nach Synkope oft wieder stabil'
            },
            
            bradykardie: {
                probability: 0.2,
                puls: '< 50/min',
                hinweis: 'Herzrhythmusstörung'
            },
            
            tachykardie: {
                probability: 0.15,
                puls: '> 120/min',
                hinweis: 'Herzrhythmusstörung oder Volumenmangel'
            },
            
            hypotonie: {
                probability: 0.15,
                rr: '< 100/60 mmHg',
                hinweis: 'Orthostatische Dysregulation'
            }
        }
    },
    
    // ========================================
    // 🏠 UMGEBUNG & SITUATION
    // ========================================
    umgebung: {
        situation_bei_eintreffen: {
            liegt_noch_am_boden: {
                probability: 0.4,
                variations: [
                    'liegt noch da wo {er/sie} hingefallen ist',
                    'am Boden'
                ]
            },
            
            sitzt: {
                probability: 0.4,
                variations: [
                    'sitzt jetzt',
                    'auf Stuhl gesetzt worden',
                    'an Wand angelehnt'
                ]
            },
            
            steht_geht: {
                probability: 0.2,
                variations: ['ist schon wieder aufgestanden'],
                info: 'Will oft nach Hause, "alles okay"'
            }
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK
    // ========================================
    sozial: {
        patient_will_nicht_mitfahren: {
            probability: 0.3,
            variations: [
                'Das ist nicht nötig, mir geht es gut',
                'Ich muss zur Arbeit',
                'Ist schon mal passiert, kein Problem'
            ],
            überzeugungsarbeit_nötig: 0.8,
            info: 'Besonders jüngere Patienten'
        },
        
        zeugen_helfen: {
            probability: 0.6,
            condition: 'location_öffentlich',
            variations: [
                'Leute haben geholfen',
                'Jemand hat {ihn/sie} in stabile Seitenlage gebracht',
                'Passanten kümmern sich'
            ]
        },
        
        angehörige_besorgt: {
            probability: 0.5,
            variations: [
                'sehr besorgt',
                'hatte das noch nie',
                'was hat das zu bedeuten?'
            ]
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        öffentlich_straße: {
            probability: 0.25,
            address_types: ['street', 'pedestrian', 'square'],
            zeugen: { min: 2, max: 6 },
            ersthelfer_oft: 0.7
        },
        
        wohnhaus: {
            probability: 0.35,
            address_types: ['residential', 'apartment'],
            räume: {
                badezimmer: 0.3,
                schlafzimmer: 0.2,
                wohnzimmer: 0.3,
                flur: 0.2
            }
        },
        
        arbeitsplatz: {
            probability: 0.15,
            address_types: ['commercial', 'office'],
            betriebssanitäter_evtl: 0.3,
            time_dependent: [7, 18]
        },
        
        geschäft_restaurant: {
            probability: 0.12,
            address_types: ['shop', 'restaurant', 'retail'],
            personal_vor_ort: 0.9
        },
        
        fitnessstudio: {
            probability: 0.05,
            address_types: ['sports_centre'],
            nach_anstrengung: 0.8
        },
        
        verkehrsmittel: {
            probability: 0.05,
            types: ['Bus', 'Bahn', 'Zug'],
            access_manchmal_schwierig: 0.5
        },
        
        kirche_veranstaltung: {
            probability: 0.03,
            address_types: ['place_of_worship', 'events_venue'],
            auslöser_oft: 'langes Stehen, Hitze'
        }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN
    // ========================================
    nachforderungen: {
        nef: {
            probability: 0.1,
            trigger_time: { min: 120, max: 300 },
            reasons: [
                'Patient bleibt bewusstlos',
                'Herzrhythmusstörung',
                'Verdacht auf Herzinfarkt',
                'Wiederholter Kollaps'
            ],
            funkspruch: '{callsign}, Patient instabil, Herzrhythmusstörung vermutet, benötigen NEF.'
        },
        
        polizei: {
            probability: 0.05,
            condition: 'location_öffentlich',
            reasons: {
                verkehr_regeln: 0.8,
                personendaten_aufnehmen: 0.2
            }
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            bleibt_bewusstlos: {
                probability: 0.1,
                siehe: 'anrufer.dynamik.bleibt_bewusstlos'
            },
            
            erneuter_kollaps: {
                probability: 0.05,
                siehe: 'anrufer.dynamik.erneuter_kollaps'
            }
        },
        
        besserung: {
            schnelle_erholung: {
                probability: 0.6,
                trigger_time: { min: 60, max: 180 },
                funkspruch: '{callsign}, Patient erholt, Kreislauf stabil, kommen.',
                will_nicht_mitfahren: 0.4
            }
        },
        
        überraschungen: {
            war_herzinfarkt: {
                probability: 0.05,
                upgrade_stichwort: 'Herzinfarkt',
                funkspruch: '{callsign}, Verdacht auf Myokardinfarkt, EKG-Veränderungen, kommen.'
            },
            
            war_schlaganfall: {
                probability: 0.03,
                upgrade_stichwort: 'Schlaganfall',
                neurologische_ausfälle: 1.0
            }
        }
    },
    
    // ========================================
    // 🏥 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.1,
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'kardiale_ursache_vermutet',
                hospitals: ['klinikum_ludwigsburg', 'rems_murr_klinikum_winnenden', 'katharinenhospital_stuttgart'],
                reason: 'Kardiologie, Herzkatheterlabor, Schrittmacher-Ambulanz'
            },
            
            priorität_2: {
                condition: 'harmlose_synkope',
                hospitals: ['nächstgelegenes'],
                reason: 'Abklärung, Beobachtung'
            }
        },
        
        voranmeldung: {
            bei_herzproblem: 0.8,
            infos: [
                'Synkope',
                'Kardiale Ursache?',
                'Vorerkrankungen',
                'Aktuelle Vitalwerte'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient nach Synkope, wieder wach',
            'Kollaps, Patient wieder bei Bewusstsein',
            'Kurzzeitige Bewusstlosigkeit, jetzt stabil',
            'Synkope, kardiale Genese nicht ausgeschlossen',
            'Patient kollabiert, Vitalwerte stabil'
        ]
    },
    
    // ========================================
    // 📊 SPECIAL
    // ========================================
    special: {
        abgrenzung: {
            nicht_epilepsie: {
                info: 'Kurze Zuckungen bei Synkope normal, keine Epilepsie!',
                unterschied: 'Synkope: Sekunden, Epilepsie: Minuten'
            },
            
            nicht_herzinfarkt: {
                info: 'Aber Herzinfarkt kann als Synkope beginnen!',
                immer_abklären: 1.0
            }
        },
        
        transportverweigerung: {
            probability: 0.25,
            besonders_bei: 'jüngere Patienten, vasovagale Synkope',
            aufklärung_wichtig: 1.0,
            unterschrift_nötig: 1.0,
            info: 'Auch harmlose Synkope sollte abgeklärt werden!'
        },
        
        red_flags: {
            warnsignale: [
                'Herzerkrankung bekannt',
                'Plötzlich ohne Warnung',
                'Älter als 60',
                'Im Liegen kollabiert',
                'Brustschmerzen',
                'Herzklopfen vorher',
                'Familienanamnese plötzlicher Herztod'
            ],
            bei_warnsignalen: {
                kardiologie_zwingend: 1.0,
                nef_erwägen: 0.7
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SYNKOPE_TEMPLATE };
}
