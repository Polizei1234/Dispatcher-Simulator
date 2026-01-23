// =========================================================================================
// ATEMNOT TEMPLATE - Häufiger Notfall mit vielen möglichen Ursachen
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const ATEMNOT_TEMPLATE = {
    
    id: 'atemnot',
    kategorie: 'rd',
    stichwort: 'Atemnot',
    weight: 4,  // Sehr häufig!
    
    // ========================================
    // 📞 ANRUFER-VARIANZ
    // ========================================
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.35,
                speech_pattern: 'kurzatmig, spricht in kurzen Sätzen',
                variations: [
                    'Ich... bekomme... keine Luft...',
                    'Hilfe... ich... kann nicht... atmen...',
                    'Luft... bitte... schnell...'
                ],
                effects: {
                    hörbare_atemnot: 1.0,
                    angst_deutlich: 0.9,
                    sätze_unterbrochen: 1.0
                }
            },
            
            angehöriger_besorgt: {
                probability: 0.45,
                speech_pattern: 'besorgt, manchmal panisch',
                variations: [
                    'Mein Mann bekommt keine Luft mehr!',
                    'Sie ringt nach Luft!',
                    'Er kriegt keine Luft, wird ganz blau!',
                    'Sie atmet so schwer!'
                ]
            },
            
            angehöriger_gewohnt: {
                probability: 0.1,
                speech_pattern: 'ruhig, kennt Situation',
                variations: [
                    'Die Atemnot ist wieder schlimmer geworden',
                    'Er braucht wieder Sauerstoff',
                    'Wie immer bei {ihm/ihr}, aber diesmal schlimmer'
                ],
                info: 'Chronische Erkrankung bekannt'
            },
            
            pflegepersonal: {
                probability: 0.08,
                speech_pattern: 'professionell',
                variations: [
                    'Bewohner mit akuter Dyspnoe',
                    'Patient zunehmend dyspnoisch',
                    'SpO2 abfallend, Dyspnoe'
                ],
                location: 'pflegeheim'
            },
            
            zeuge: {
                probability: 0.02,
                speech_pattern: 'unsicher',
                variations: [
                    'Hier bekommt jemand keine Luft!',
                    'Die Person da atmet komisch!'
                ],
                location: 'öffentlich'
            }
        },
        
        dynamik: {
            patient_spricht_nicht_mehr: {
                probability: 0.2,
                trigger_time: { min: 60, max: 180 },
                change: 'Patient kann nicht mehr sprechen, nur noch nach Luft ringen',
                effects: {
                    kritischer: 1.0,
                    nef_wahrscheinlicher: 0.7
                }
            },
            
            wird_panischer: {
                probability: 0.3,
                trigger_time: { min: 30, max: 120 },
                change: 'Atemnot wird schlimmer! {Er/Sie} bekommt gar keine Luft mehr!'
            }
        }
    },
    
    // ========================================
    // 🧑 PATIENT
    // ========================================
    patient: {
        geschlecht: {
            male: 0.48,
            female: 0.52
        },
        
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 68, stddev: 12, weight: 0.65 },  // Ältere (COPD, Herzinsuffizienz)
            peak2: { mean: 45, stddev: 15, weight: 0.35 },  // Jüngere (Asthma, Lungenembolie)
            min: 18,
            max: 95
        },
        
        körperbau: {
            adipositas: {
                probability: 0.35,
                effects: {
                    atemnot_verstärkt: 0.8,
                    transport_erschwert: 0.6
                }
            }
        }
    },
    
    // ========================================
    // 🫁 SYMPTOME
    // ========================================
    symptome: {
        hauptsymptom_atemnot: {
            probability: 1.0,
            severity: {
                leicht: {
                    probability: 0.2,
                    variations: ['atmet etwas schwer', 'leichte Atemnot']
                },
                mittel: {
                    probability: 0.5,
                    variations: [
                        'bekommt schlecht Luft',
                        'ringt nach Luft',
                        'atmet sehr schwer'
                    ]
                },
                schwer: {
                    probability: 0.3,
                    variations: [
                        'bekommt fast keine Luft mehr',
                        'kann kaum noch atmen',
                        'schnappt nach Luft',
                        'kämpft um jeden Atemzug'
                    ],
                    nef_wahrscheinlich: 0.6
                }
            },
            
            beginn: {
                plötzlich: {
                    probability: 0.4,
                    variations: [
                        'kam ganz plötzlich',
                        'auf einmal keine Luft mehr',
                        'von jetzt auf gleich'
                    ],
                    ursachen_wahrscheinlich: ['Lungenembolie', 'Pneumothorax', 'allergische Reaktion']
                },
                schleichend: {
                    probability: 0.6,
                    variations: [
                        'wurde immer schlimmer',
                        'seit heute morgen schlechter',
                        'die letzten Stunden zugenommen'
                    ],
                    ursachen_wahrscheinlich: ['COPD-Exazerbation', 'Herzinsuffizienz', 'Pneumonie']
                }
            }
        },
        
        atemgeräusche: {
            giemen_pfeifen: {
                probability: 0.4,
                variations: [
                    'pfeift beim Atmen',
                    'die Lunge pfeift',
                    'macht komische Atemgeräusche'
                ],
                hinweis: 'Asthma oder COPD wahrscheinlich'
            },
            
            rasseln_brodeln: {
                probability: 0.25,
                variations: [
                    'rasselt in der Brust',
                    'brodelt beim Atmen',
                    'klingt als hätte {er/sie} Wasser in der Lunge'
                ],
                hinweis: 'Lungenödem wahrscheinlich'
            },
            
            stridor: {
                probability: 0.05,
                variations: [
                    'zieht die Luft mit Geräusch ein',
                    'komisches Einatmungsgeräusch'
                ],
                hinweis: 'Verlegung der oberen Atemwege'
            }
        },
        
        husten: {
            probability: 0.5,
            types: {
                trocken: {
                    probability: 0.4,
                    variations: ['hustet trocken', 'trockener Reizhusten']
                },
                produktiv: {
                    probability: 0.4,
                    variations: ['hustet Schleim', 'hustet gelb-grün'],
                    hinweis: 'Infekt wahrscheinlich'
                },
                blutig: {
                    probability: 0.2,
                    variations: ['hustet Blut', 'blutiger Auswurf'],
                    hinweis: 'Lungenembolie oder Tumor möglich',
                    kritisch: 1.0
                }
            }
        },
        
        brustschmerzen: {
            probability: 0.35,
            types: {
                stechend: {
                    probability: 0.5,
                    variations: [
                        'stechende Schmerzen in der Brust',
                        'sticht beim Atmen'
                    ],
                    hinweis: 'Lungenembolie oder Pneumothorax möglich'
                },
                druck: {
                    probability: 0.3,
                    variations: ['Druckgefühl auf der Brust', 'Enge in der Brust'],
                    hinweis: 'Herzinfarkt ausschließen!'
                },
                atemabhängig: {
                    probability: 0.2,
                    variations: ['Schmerzen beim Einatmen'],
                    hinweis: 'Rippenfellentzündung möglich'
                }
            }
        },
        
        zyanose: {
            probability: 0.3,
            variations: [
                'wird ganz blau',
                'Lippen sind blau',
                'läuft blau an',
                'sieht ganz blau aus'
            ],
            effects: {
                kritisch: 1.0,
                nef_wahrscheinlich: 0.8
            }
        },
        
        angst_panik: {
            probability: 0.7,
            variations: [
                'hat total Angst',
                'ist in Panik',
                '{Er/Sie} denkt {er/sie} stirbt jetzt',
                'schreit vor Angst'
            ],
            todesangst: {
                probability: 0.3,
                info: 'Klassisches Zeichen bei Lungenembolie'
            }
        },
        
        schwitzen: {
            probability: 0.5,
            variations: [
                'schwitzt stark',
                'ist schweißgebadet',
                'Schweiß läuft {ihm/ihr} runter'
            ]
        },
        
        erschöpfung: {
            probability: 0.6,
            variations: [
                'ist völlig erschöpft',
                'kann nicht mehr',
                'hat keine Kraft mehr zum Atmen'
            ],
            effects: {
                intubation_wahrscheinlicher: 0.4
            }
        },
        
        bewusstseinsstörung: {
            probability: 0.15,
            levels: {
                verwirrt: {
                    probability: 0.6,
                    variations: ['ist ganz verwirrt', 'redet wirr']
                },
                somnolent: {
                    probability: 0.3,
                    variations: ['wird schläfrig', 'kaum ansprechbar'],
                    kritisch: 1.0
                },
                bewusstlos: {
                    probability: 0.1,
                    upgrade_stichwort: 'Bewusstlosigkeit',
                    nef_zwingend: 1.0
                }
            }
        },
        
        orthopnoe: {
            probability: 0.4,
            variations: [
                'kann nur noch sitzen',
                'muss aufrecht sitzen',
                'geht nur im Sitzen'
            ],
            hinweis: 'Herzinsuffizienz wahrscheinlich'
        },
        
        beinödeme: {
            probability: 0.25,
            variations: [
                'hat geschwollene Beine',
                'dicke Beine',
                'Wasser in den Beinen'
            ],
            hinweis: 'Herzinsuffizienz'
        }
    },
    
    // ========================================
    // 🏥 MEDIZINISCH - MÖGLICHE URSACHEN
    // ========================================
    medizinisch: {
        wahrscheinliche_ursache: {
            copd_exazerbation: {
                probability: 0.25,
                indicators: ['Raucher', 'bekannte COPD', 'Giemen', 'langsamer Beginn'],
                medikamente: ['Inhalator', 'Cortison'],
                info: 'Häufigste Ursache bei Rauchern >60'
            },
            
            asthma_anfall: {
                probability: 0.15,
                indicators: ['jünger', 'bekanntes Asthma', 'Giemen', 'plötzlicher Beginn'],
                auslöser: ['Anstrengung', 'Allergen', 'Infekt'],
                medikamente: ['Spray vergessen', 'Spray hilft nicht']
            },
            
            herzinsuffizienz: {
                probability: 0.2,
                indicators: ['Orthopnoe', 'Beinödeme', 'Rasseln', 'bekannte Herzschwäche'],
                info: 'Linksherzinsuffizienz mit Lungenödem'
            },
            
            pneumonie: {
                probability: 0.15,
                indicators: ['Fieber', 'Husten produktiv', 'Schüttelfrost'],
                info: 'Lungenentzündung'
            },
            
            lungenembolie: {
                probability: 0.08,
                indicators: [
                    'plötzlicher Beginn',
                    'Todesangst',
                    'Brustschmerzen stechend',
                    'nach OP/langer Reise'
                ],
                risikofaktoren: ['Thrombose', 'OP kürzlich', 'lange Flugreise'],
                kritisch: 1.0,
                info: 'Lebensbedrohlich!'
            },
            
            pneumothorax: {
                probability: 0.03,
                indicators: [
                    'plötzlicher Beginn',
                    'einseitige Schmerzen',
                    'nach Trauma/spontan'
                ],
                info: 'Lunge kollabiert'
            },
            
            allergische_reaktion: {
                probability: 0.05,
                indicators: [
                    'plötzlicher Beginn',
                    'nach Essen/Medikament',
                    'Schwellung',
                    'Hautausschlag'
                ],
                kann_zu_anaphylaxie: 0.4
            },
            
            panikattacke: {
                probability: 0.05,
                indicators: [
                    'jünger',
                    'extreme Angst',
                    'Kribbeln',
                    'keine objektiven Zeichen'
                ],
                info: 'Hyperventilation, oft Fehlalarm'
            },
            
            herzinfarkt: {
                probability: 0.04,
                indicators: [
                    'Brustschmerzen',
                    'Risikofaktoren',
                    'Schwitzen'
                ],
                info: 'Atemnot kann Hauptsymptom sein!',
                kritisch: 1.0
            }
        },
        
        vorerkrankungen: {
            probability: 0.85,
            types: {
                copd: { probability: 0.35, info: 'Chronisch obstruktive Lungenerkrankung' },
                asthma: { probability: 0.2 },
                herzinsuffizienz: { probability: 0.25 },
                koronare_herzkrankheit: { probability: 0.15 },
                diabetes: { probability: 0.3 },
                raucher: { probability: 0.5 }
            }
        },
        
        medikamente: {
            atemwegs_medikamente: {
                probability: 0.6,
                types: {
                    inhalator: { probability: 0.7, variations: ['Spray', 'Dosieraerosol'] },
                    cortison: { probability: 0.4 },
                    sauerstoff_zuhause: { probability: 0.2 }
                }
            },
            
            herz_medikamente: {
                probability: 0.5,
                types: {
                    wassertabletten: { probability: 0.6 },
                    betablocker: { probability: 0.4 }
                }
            },
            
            medikament_vergessen: {
                probability: 0.15,
                info: 'Hat Medikamente nicht genommen'
            }
        },
        
        sauerstoffsättigung: {
            gut: {
                probability: 0.2,
                wert: '>94%',
                info: 'Trotz Atemnot okay'
            },
            mittel: {
                probability: 0.5,
                wert: '85-94%',
                info: 'Sauerstoff erforderlich'
            },
            kritisch: {
                probability: 0.3,
                wert: '<85%',
                info: 'Kritisch niedrig',
                nef_wahrscheinlich: 0.7
            }
        }
    },
    
    // ========================================
    // 🏠 UMGEBUNG
    // ========================================
    umgebung: {
        gebäude: {
            kein_aufzug: {
                probability: 0.15,
                effects: {
                    patient_kann_nicht_laufen: 0.9,
                    tragehilfe_wahrscheinlich: 0.7
                },
                funkspruch: '{callsign}, Patient mit Atemnot, kann nicht laufen, eventuell Tragehilfe nötig.'
            }
        },
        
        luft: {
            stickig: {
                probability: 0.2,
                variations: [
                    'Wohnung sehr stickig',
                    'keine frische Luft',
                    'fenster alle zu'
                ],
                info: 'Lüften verbessert oft Situation'
            },
            
            rauchig: {
                probability: 0.05,
                variations: ['stark verrauchte Wohnung'],
                hinweis: 'Starker Raucher'
            }
        }
    },
    
    // ========================================
    // 👥 SOZIALE DYNAMIK
    // ========================================
    sozial: {
        angehörige: {
            sehr_besorgt: {
                probability: 0.6,
                variations: [
                    'hat große Angst',
                    'macht sich Sorgen',
                    'befürchtet das Schlimmste'
                ]
            },
            
            gewohnt: {
                probability: 0.2,
                info: 'Kennt die Situation, passiert öfter',
                variations: [
                    'Das hatte {er/sie} schon öfter',
                    'Ist wie das letzte Mal'
                ]
            }
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
                schlafzimmer: 0.35,
                wohnzimmer: 0.4,
                badezimmer: 0.15,
                küche: 0.1
            }
        },
        
        pflegeheim: {
            probability: 0.12,
            address_types: ['nursing_home'],
            pfleger_vor_ort: 1.0,
            sauerstoff_meist_verfügbar: 0.9
        },
        
        arbeitsplatz: {
            probability: 0.08,
            address_types: ['commercial', 'office'],
            time_dependent: [7, 18]
        },
        
        öffentlich: {
            probability: 0.03,
            address_types: ['street', 'park'],
            zeugen: { min: 1, max: 4 }
        },
        
        arztpraxis: {
            probability: 0.02,
            address_types: ['doctors'],
            erstversorgung_läuft: 0.8
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
                'Patient kritisch dyspnoisch',
                'SpO2 trotz Sauerstoff niedrig',
                'Intubation eventuell erforderlich',
                'Bewusstseinstrübung'
            ],
            funkspruch: '{callsign}, Patient zunehmend erschöpft, benötigen NEF, kommen.'
        },
        
        feuerwehr: {
            probability: 0.08,
            reasons: {
                tragehilfe: { probability: 0.9 },
                türöffnung: { probability: 0.1 }
            }
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            stufe_1: {
                probability: 0.25,
                trigger_time: { min: 120, max: 300 },
                changes: ['Atemnot wird schlimmer', 'Patient immer erschöpfter'],
                nef_anforderung: 0.7
            },
            
            stufe_2_bewusstlos: {
                probability: 0.05,
                trigger_time: { min: 180, max: 420 },
                changes: ['Patient bewusstlos', 'Atemstillstand droht'],
                nef_sofort: 1.0,
                upgrade_stichwort: 'Bewusstlosigkeit'
            }
        },
        
        besserung: {
            spray_hilft: {
                probability: 0.15,
                trigger_time: { min: 120, max: 300 },
                info: 'Nach Spray-Gabe deutlich besser',
                funkspruch: '{callsign}, Patient stabilisiert, Spray hat geholfen, kommen.',
                transport_trotzdem: 0.9
            },
            
            sauerstoff_hilft: {
                probability: 0.2,
                trigger_time: { min: 180, max: 360 },
                info: 'Unter Sauerstoff gebessert'
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
                condition: 'kritisch_oder_lungenembolie',
                hospitals: ['klinikum_ludwigsburg', 'rems_murr_klinikum_winnenden', 'katharinenhospital_stuttgart'],
                reason: 'Intensivstation erforderlich'
            },
            
            priorität_2: {
                condition: 'stabil',
                hospitals: ['nächstgelegenes'],
                reason: 'Standardversorgung ausreichend'
            }
        },
        
        voranmeldung: {
            bei_kritik: 0.8,
            infos: [
                'Atemnot',
                'SpO2-Wert',
                'Vermutete Ursache',
                'Vitalparameter'
            ]
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient mit schwerer Dyspnoe',
            'Atemnot unklarer Genese, SpO2 niedrig',
            'Patient erschöpft, massive Atemnot',
            'Verdacht auf {Ursache}, Patient dyspnoisch',
            'Patient stabilisiert unter Sauerstoff'
        ]
    },
    
    // ========================================
    // 📊 SPECIAL
    // ========================================
    special: {
        verwechslungen: {
            mit_herzinfarkt: {
                probability: 0.15,
                info: 'Atemnot kann Hauptsymptom bei Herzinfarkt sein!'
            },
            
            mit_panikattacke: {
                probability: 0.08,
                info: 'Hyperventilation vs echte Atemnot schwer unterscheidbar',
                bagatell_potential: 0.5
            }
        },
        
        realismus: {
            chroniker: {
                probability: 0.4,
                info: 'Viele Patienten haben chronische Atemwegserkrankungen',
                wiederkehrer: 0.3
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ATEMNOT_TEMPLATE };
}
