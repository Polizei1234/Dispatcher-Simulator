// =========================================================================================
// ASTHMA-ANFALL TEMPLATE - Akute Atemnot durch Bronchospasmus
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const ASTHMA_TEMPLATE = {
    
    id: 'asthma',
    kategorie: 'rd',
    stichwort: 'Asthma-Anfall',
    weight: 3,
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.35,
                speech_pattern: 'kurzatmig, pfeifend',
                variations: [
                    'Ich... bekomme... keine Luft...',
                    'Asthma-Anfall... Spray hilft nicht...',
                    'Kann nicht... atmen... brauche Hilfe...'
                ],
                effects: {
                    hörbare_atemnot: 1.0,
                    giemen_hörbar: 0.8,
                    kann_nicht_sprechen: 0.6
                }
            },
            
            angehöriger_besorgt: {
                probability: 0.45,
                speech_pattern: 'besorgt bis panisch',
                variations: [
                    'Mein Sohn bekommt keine Luft mehr!',
                    '{Er/Sie} hat einen Asthma-Anfall!',
                    'Das Spray hilft nicht!',
                    '{Er/Sie} ringt nach Luft!'
                ]
            },
            
            eltern_kind: {
                probability: 0.15,
                speech_pattern: 'sehr besorgt, oft erste Erfahrung',
                variations: [
                    'Mein Kind bekommt keine Luft!',
                    'Was soll ich tun? {Er/Sie} hustet so!',
                    'Das Asthma ist so schlimm!'
                ],
                patient_age: { mean: 8, range: [3, 16] }
            },
            
            lehrer_betreuer: {
                probability: 0.04,
                speech_pattern: 'sachlich aber besorgt',
                variations: [
                    'Schüler hat Asthma-Anfall',
                    'Kind in meiner Obhut mit Atemnot'
                ],
                location: ['schule', 'kindergarten']
            },
            
            zeuge: {
                probability: 0.01,
                speech_pattern: 'unsicher',
                variations: [
                    'Jemand bekommt hier keine Luft',
                    'Person hat Atemnot'
                ],
                location: 'öffentlich'
            }
        },
        
        dynamik: {
            wird_panischer: {
                probability: 0.3,
                trigger_time: { min: 30, max: 120 },
                change: 'Es wird schlimmer! {Er/Sie} bekommt gar keine Luft mehr!',
                effects: {
                    panik_verstärkt_atemnot: 0.9
                }
            },
            
            kann_nicht_mehr_sprechen: {
                probability: 0.2,
                trigger_time: { min: 60, max: 180 },
                change: 'Patient kann nicht mehr sprechen!',
                effects: {
                    kritischer: 1.0,
                    status_asthmaticus_wahrscheinlich: 0.7
                }
            },
            
            spray_hilft_nicht: {
                probability: 0.4,
                trigger_time: { min: 30, max: 90 },
                change: 'Das Spray hilft überhaupt nicht!',
                info: 'Typisch bei schwerem Anfall'
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.55,  // Jungen häufiger
            female: 0.45
        },
        
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 10, stddev: 5, weight: 0.4 },   // Kinder
            peak2: { mean: 35, stddev: 15, weight: 0.6 },  // Erwachsene
            min: 3,
            max: 75
        },
        
        bekanntes_asthma: {
            probability: 0.95,
            info: 'Fast immer bekannte Asthma-Diagnose'
        }
    },
    
    // ========================================
    // 🫁 SYMPTOME
    // ========================================
    symptome: {
        atemnot: {
            probability: 1.0,
            severity: {
                leicht: {
                    probability: 0.2,
                    variations: ['leichte Atemnot', 'etwas Probleme beim Atmen'],
                    kann_sprechen: 1.0
                },
                mittel: {
                    probability: 0.5,
                    variations: [
                        'deutliche Atemnot',
                        'bekommt schwer Luft',
                        'ringt nach Luft'
                    ],
                    spricht_in_wortfetzen: 0.8
                },
                schwer: {
                    probability: 0.3,
                    variations: [
                        'massive Atemnot',
                        'schnappt nach Luft',
                        'kann kaum noch atmen'
                    ],
                    kann_nicht_sprechen: 0.8,
                    kritisch: 0.9
                }
            }
        },
        
        giemen_pfeifen: {
            probability: 0.9,
            variations: [
                'pfeift beim Atmen',
                'die Lunge pfeift',
                'zieht pfeifend Luft',
                'Giemen hörbar'
            ],
            auch_am_telefon_hörbar: 0.6,
            info: 'Typisches Leitsymptom!'
        },
        
        exspiratorisch_verlängert: {
            probability: 0.85,
            beschreibung: 'Ausatmung verlängert und erschwert',
            variations: [
                'bekommt die Luft nicht raus',
                'Ausatmen ist schwer'
            ]
        },
        
        husten: {
            probability: 0.7,
            types: {
                trocken_reizend: {
                    probability: 0.6,
                    variations: ['trockener Reizhusten', 'hustet trocken']
                },
                produktiv: {
                    probability: 0.4,
                    variations: [
                        'hustet zähen Schleim',
                        'bekommt Schleim nicht raus'
                    ]
                }
            }
        },
        
        engegefühl_brust: {
            probability: 0.8,
            variations: [
                'Enge in der Brust',
                'Brust ist wie zugeschnürt',
                'kann die Brust nicht öffnen',
                'wie ein Band um die Brust'
            ]
        },
        
        angst_panik: {
            probability: 0.7,
            variations: [
                'hat Angst',
                'ist in Panik',
                'Todesangst'
            ],
            effects: {
                verschlimmert_atemnot: 0.9,
                beruhigung_wichtig: 1.0
            }
        },
        
        erschöpfung: {
            probability: 0.6,
            variations: [
                'ist erschöpft',
                'kann nicht mehr',
                'völlig entkräftet'
            ],
            severity: {
                leicht: 0.5,
                stark: 0.3,  // Warnsignal!
                kritisch: 0.2  // Atemmuskelversagen droht!
            },
            bei_starker_erschöpfung_kritisch: 1.0
        },
        
        zyanose: {
            probability: 0.25,
            variations: [
                'läuft blau an',
                'Lippen sind blau',
                'wird blau'
            ],
            kritisch: 1.0,
            nef_wahrscheinlich: 0.9
        },
        
        sprechdyspnoe: {
            probability: 0.6,
            variations: [
                'kann nur noch einzelne Worte sagen',
                'kann nicht mehr sprechen',
                'spricht in kurzen Fetzen'
            ],
            severity_indikator: 'mittel bis schwer'
        },
        
        sitzende_position: {
            probability: 0.85,
            variations: [
                'sitzt aufrecht',
                'kann nur sitzen',
                'lehnt sich nach vorne',
                'Kutschersitz'
            ],
            info: 'Typische Körperhaltung bei Atemnot'
        },
        
        atemhilfsmuskulatur: {
            probability: 0.5,
            beschreibung: 'Einsatz der Atemhilfsmuskulatur',
            variations: [
                'Rippen ziehen sich ein',
                'Hals angespannt',
                'atmet mit ganzer Kraft'
            ],
            schweregrad_indikator: 'schwer'
        },
        
        tachykardie: {
            probability: 0.8,
            puls: { mean: 120, range: [100, 160] },
            info: 'Schneller Puls durch Stress und Sauerstoffmangel'
        }
    },
    
    // ========================================
    // 🏥 AUSLÖSER
    // ========================================
    auslöser: {
        allergen: {
            probability: 0.3,
            types: {
                pollen: {
                    probability: 0.4,
                    seasonal: 'Frühling/Sommer',
                    variations: ['Pollenflug', 'Heuschnupfen']
                },
                tierhaare: {
                    probability: 0.2,
                    variations: ['war bei jemandem mit Katze', 'Hund im Raum']
                },
                hausstaubmilben: {
                    probability: 0.2,
                    variations: ['staubig', 'beim Staubsaugen']
                },
                schimmelpilze: {
                    probability: 0.1,
                    variations: ['feuchter Raum']
                },
                andere: {
                    probability: 0.1
                }
            }
        },
        
        infekt: {
            probability: 0.25,
            variations: [
                'ist erkältet',
                'hat Infekt',
                'hustet seit Tagen',
                'grippaler Infekt'
            ],
            info: 'Häufigster Auslöser!'
        },
        
        anstrengung: {
            probability: 0.15,
            variations: [
                'nach Sport',
                'beim Treppensteigen',
                'nach körperlicher Anstrengung',
                'beim Laufen'
            ],
            belastungsasthma: 1.0
        },
        
        kälte: {
            probability: 0.1,
            variations: [
                'kalte Luft eingeatmet',
                'war draußen in der Kälte'
            ],
            seasonal: 'Winter'
        },
        
        rauch_gerüche: {
            probability: 0.08,
            variations: [
                'Zigarettenrauch',
                'Parfüm',
                'starke Gerüche',
                'Abgase'
            ]
        },
        
        medikamente: {
            probability: 0.03,
            types: ['ASS', 'Betablocker', 'NSAR'],
            info: 'Arzneimittel-induziertes Asthma'
        },
        
        psychisch_stress: {
            probability: 0.05,
            variations: [
                'war aufgeregt',
                'hatte Stress',
                'Angst'
            ]
        },
        
        ohne_erkennbaren_auslöser: {
            probability: 0.04,
            info: 'Spontaner Anfall'
        }
    },
    
    // ========================================
    // 🏥 MEDIZINISCH
    // ========================================
    medizinisch: {
        schweregrad: {
            leicht: {
                probability: 0.25,
                kriterien: [
                    'Kann sprechen',
                    'Leichte Atemnot',
                    'SpO2 > 92%'
                ],
                spray_hilft_meist: 0.8
            },
            
            mittel: {
                probability: 0.5,
                kriterien: [
                    'Spricht in Wortfetzen',
                    'Deutliche Atemnot',
                    'SpO2 90-92%',
                    'Puls > 110'
                ],
                spray_hilft_teilweise: 0.4
            },
            
            schwer: {
                probability: 0.2,
                kriterien: [
                    'Kann nicht sprechen',
                    'Massive Atemnot',
                    'SpO2 < 90%',
                    'Puls > 120',
                    'Erschöpfung'
                ],
                spray_hilft_nicht: 0.9,
                nef_empfohlen: 0.8
            },
            
            status_asthmaticus: {
                probability: 0.05,
                kriterien: [
                    'Therapierefraktär',
                    'Extreme Atemnot',
                    'Bewusstseinstrübung',
                    'Silent Chest'
                ],
                kritisch: 1.0,
                nef_zwingend: 1.0,
                intubation_evtl: 0.6,
                info: 'Lebensbedrohlicher Zustand!'
            }
        },
        
        vorerkrankungen: {
            probability: 0.95,
            bekanntes_asthma: {
                probability: 0.95,
                dauer: {
                    seit_kindheit: 0.6,
                    seit_jahren: 0.3,
                    neu_diagnostiziert: 0.1
                }
            },
            
            allergien: {
                probability: 0.7,
                types: ['Pollen', 'Tierhaare', 'Hausstaubmilben', 'Nahrungsmittel']
            },
            
            neurodermitis: {
                probability: 0.3,
                info: 'Atopisches Ekzem - oft mit Asthma'
            }
        },
        
        medikamente: {
            notfallspray: {
                probability: 0.9,
                types: {
                    salbutamol: { probability: 0.7, name: 'Salbutamol (Ventolin)' },
                    andere_betamimetika: { probability: 0.3 }
                },
                verwendung: {
                    hilft_nicht: {
                        probability: 0.5,
                        variations: [
                            'Spray hilft nicht',
                            'hat mehrfach gesprüht, keine Besserung',
                            'wirkt nicht'
                        ],
                        indikator_schwere: 1.0
                    },
                    hilft_teilweise: {
                        probability: 0.3,
                        info: 'Kurze Besserung'
                    },
                    nicht_verfügbar: {
                        probability: 0.1,
                        variations: [
                            'Spray ist leer',
                            'hat es nicht dabei',
                            'vergessen'
                        ]
                    },
                    nicht_benutzt: {
                        probability: 0.1,
                        grund: 'weiß nicht wie, zu panisch'
                    }
                }
            },
            
            dauermedikation: {
                probability: 0.7,
                types: {
                    cortison_inhalativ: { probability: 0.8 },
                    ltra: { probability: 0.2, name: 'Montelukast' }
                },
                compliance: {
                    regelmäßig: 0.5,
                    unregelmäßig: 0.4,
                    abgesetzt: 0.1
                }
            },
            
            cortison_tabletten: {
                probability: 0.15,
                info: 'Schweres Asthma',
                für_notfall_zuhause: 0.5
            }
        },
        
        bisherige_verläufe: {
            erste_mal: {
                probability: 0.1,
                effects: {
                    angst_größer: 0.9
                }
            },
            
            gelegentlich: {
                probability: 0.6,
                info: 'Alle paar Monate'
            },
            
            häufig: {
                probability: 0.25,
                info: 'Mehrmals im Monat',
                kontrolle_unzureichend: 0.8
            },
            
            frühere_intubation: {
                probability: 0.05,
                info: 'Musste schon mal intubiert werden',
                risiko_patient: 1.0,
                besondere_vorsicht: 1.0
            }
        },
        
        peakflow: {
            hat_gerät: {
                probability: 0.3,
                wert_niedrig: {
                    probability: 0.8,
                    unter_50_prozent: 0.6,
                    info: 'Objektiver Schweregrad-Indikator'
                }
            }
        }
    },
    
    // ========================================
    // 🏠 UMGEBUNG
    // ========================================
    umgebung: {
        luftqualität: {
            stickig: {
                probability: 0.3,
                variations: [
                    'sehr stickig',
                    'schlechte Luft',
                    'keine frische Luft'
                ]
            },
            
            rauchig: {
                probability: 0.1,
                variations: ['verrauchter Raum'],
                verschlimmert: 0.9
            }
        },
        
        fenster_offen: {
            probability: 0.6,
            variations: [
                'haben Fenster aufgemacht',
                'frische Luft reingelassen'
            ],
            info: 'Instinktive Maßnahme'
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK
    // ========================================
    sozial: {
        angehörige: {
            sehr_besorgt: {
                probability: 0.7,
                besonders_bei: 'Kinder',
                variations: [
                    'hat große Angst',
                    'ist verzweifelt'
                ]
            },
            
            gewohnt: {
                probability: 0.2,
                variations: [
                    'kennt das schon',
                    'passiert öfter',
                    'weiß was zu tun ist'
                ],
                info: 'Bei häufigen Anfällen'
            },
            
            beruhigt_patient: {
                probability: 0.5,
                variations: [
                    'versucht zu beruhigen',
                    'redet beruhigend ein'
                ],
                positiv: 1.0
            }
        },
        
        schule_kindergarten: {
            probability: 0.08,
            location: ['schule', 'kindergarten'],
            notfallplan_vorhanden: 0.6,
            eltern_informiert: 0.9
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        wohnhaus: {
            probability: 0.75,
            address_types: ['residential', 'apartment'],
            räume: {
                wohnzimmer: 0.4,
                schlafzimmer: 0.3,
                küche: 0.2,
                andere: 0.1
            }
        },
        
        schule: {
            probability: 0.08,
            address_types: ['school'],
            time_dependent: [7, 16],
            sanitäter_evtl: 0.3
        },
        
        arbeitsplatz: {
            probability: 0.1,
            address_types: ['commercial', 'office'],
            time_dependent: [7, 18]
        },
        
        öffentlich: {
            probability: 0.05,
            address_types: ['street', 'park', 'shop'],
            zeugen: { min: 1, max: 4 }
        },
        
        arztpraxis: {
            probability: 0.02,
            address_types: ['doctors'],
            erstversorgung_läuft: 0.9
        }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN
    // ========================================
    nachforderungen: {
        nef: {
            probability: 0.2,
            trigger_time: { min: 120, max: 300 },
            reasons: [
                'Status asthmaticus',
                'Patient massiv erschöpft',
                'SpO2 kritisch niedrig',
                'Intubation evtl. erforderlich',
                'Bewusstseinstrübung'
            ],
            funkspruch: '{callsign}, Patient mit Status asthmaticus, benötigen NEF, kommen.'
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            status_asthmaticus: {
                probability: 0.08,
                trigger_time: { min: 180, max: 420 },
                changes: [
                    'Wird immer erschöpfter',
                    'Kaum noch Atemgeräusche',
                    'Silent Chest',
                    'Bewusstsein trübt sich'
                ],
                kritisch: 1.0,
                nef_sofort: 1.0,
                info: 'HÖCHSTE GEFAHR!'
            },
            
            erschöpfung_zunimmt: {
                probability: 0.15,
                trigger_time: { min: 120, max: 300 },
                changes: 'Patient wird immer erschöpfter',
                warnsignal: 1.0
            }
        },
        
        besserung: {
            spray_wirkt: {
                probability: 0.3,
                trigger_time: { min: 60, max: 180 },
                funkspruch: '{callsign}, Patient stabilisiert, Spray hat gewirkt, kommen.',
                transport_trotzdem: 0.9,
                info: 'Auch bei Besserung Kontrolle wichtig!'
            },
            
            unter_sauerstoff_besser: {
                probability: 0.4,
                trigger_time: { min: 180, max: 360 },
                info: 'Unter Sauerstoffgabe gebessert'
            }
        },
        
        komplikationen: {
            pneumothorax: {
                probability: 0.01,
                trigger_time: { min: 120, max: 300 },
                changes: 'Plötzlich einseitige Schmerzen, Zustand verschlechtert sich rapide',
                kritisch: 1.0,
                info: 'Seltene aber schwere Komplikation!'
            }
        }
    },
    
    // ========================================
    // 🏥 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.2,
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'schwerer_anfall_oder_status',
                hospitals: ['klinikum_ludwigsburg', 'rems_murr_klinikum_winnenden', 'katharinenhospital_stuttgart'],
                reason: 'Intensivstation für respiratorische Insuffizienz'
            },
            
            priorität_2: {
                condition: 'mittelschwer',
                hospitals: ['nächstgelegenes_mit_notaufnahme'],
                reason: 'Medikamentöse Therapie und Überwachung'
            },
            
            priorität_3: {
                condition: 'leicht_nach_besserung',
                hospitals: ['nächstgelegenes'],
                reason: 'Kontrolle und Anpassung Dauermedikation'
            }
        },
        
        voranmeldung: {
            bei_schweren_fällen: 0.8,
            infos: [
                'Asthma-Anfall',
                'Schweregrad',
                'SpO2-Wert',
                'Therapie bisher',
                'Besserung ja/nein'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient mit schwerem Asthma-Anfall',
            'Akuter Bronchospasmus, SpO2 {wert}%',
            'Asthmatiker mit massiver Dyspnoe',
            'Status asthmaticus, Patient erschöpft',
            'Asthma-Anfall, unter Therapie gebessert'
        ]
    },
    
    // ========================================
    // 📊 SPECIAL
    // ========================================
    special: {
        häufigkeit: {
            erste_anfall: { probability: 0.1 },
            gelegentlich: { probability: 0.6 },
            häufig: { probability: 0.25 },
            chronisch_schwer: { probability: 0.05 }
        },
        
        compliance_problem: {
            probability: 0.3,
            variations: [
                'nimmt Dauermedikation nicht regelmäßig',
                'hat Controller-Medikament abgesetzt',
                'nur Notfallspray, keine Dauertherapie'
            ],
            info: 'Häufige Ursache für schwere Anfälle'
        },
        
        unterscheidung: {
            nicht_copd: {
                info: 'Asthma: jüngere Patienten, anfallsartig, reversibel',
                aber: 'Überlappung möglich (ACOS)'
            },
            
            nicht_herzinsuffizienz: {
                info: 'Kardiales Asthma = Herzinsuffizienz!',
                verwechslungsgefahr: 'bei älteren Patienten'
            }
        },
        
        prävention: {
            auslöser_meiden: {
                info: 'Wichtigste Maßnahme',
                beispiele: ['Allergen-Karenz', 'Rauchstopp']
            },
            
            medikamentös: {
                info: 'Controller-Therapie wichtig',
                problem: 'Wird oft nicht genommen wenn es gut geht'
            }
        },
        
        realismus: {
            todesfälle: {
                probability: 0.001,
                info: 'Sehr selten, aber möglich',
                risikofaktoren: [
                    'Frühere Intubation',
                    'Häufige schwere Anfälle',
                    'Schlechte Compliance',
                    'Psychische Erkrankung'
                ]
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ASTHMA_TEMPLATE };
}
