// =========================================================================================
// ANGINA PECTORIS TEMPLATE
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const ANGINA_PECTORIS_TEMPLATE = {
    
    id: 'angina_pectoris',
    kategorie: 'rd',
    stichwort: 'Angina Pectoris / Brustschmerzen',
    weight: 2,
    
    // ========================================
    // 📞 ANRUFER-SYSTEM
    // ========================================
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.5,
                age_group: 'senior',
                characteristics: {
                    kennt_krankheit: 0.8,
                    hat_nitro_spray: 0.7,
                    besorgt_aber_ruhig: 0.6
                }
            },
            ehepartner: {
                probability: 0.35,
                characteristics: {
                    besorgt: 0.8,
                    kennt_vorgeschichte: 0.9
                }
            },
            angehöriger: { probability: 0.1 },
            arbeitskollege: { probability: 0.05 }
        },
        
        beziehung: {
            variations: [
                'Mein Mann hat wieder Brustschmerzen',
                'Meine Frau greift sich ans Herz',
                'Ich habe starke Brustschmerzen',
                'Die Schmerzen kommen wieder'
            ]
        }
    },
    
    // ========================================
    // 👤 PATIENT
    // ========================================
    patient: {
        geschlecht: { male: 0.65, female: 0.35 },
        alter: {
            distribution: 'normal',
            mean: 68,
            stddev: 10,
            min: 45,
            max: 90
        },
        
        soziales_umfeld: {
            allein: { probability: 0.2 },
            mit_partner: { probability: 0.6 },
            mit_familie: { probability: 0.2 }
        }
    },
    
    // ========================================
    // 🔬 SYMPTOME
    // ========================================
    symptome: {
        brustschmerz: {
            probability: 0.95,
            intensität: {
                distribution: [0.3, 0.5, 0.2],  // leicht, mittel, stark
                description: ['drückend', 'einengend', 'brennend']
            },
            variations: [
                'hat Schmerzen in der Brust',
                'fasst sich an die Brust',
                'klagt über Brustenge',
                'das Herz drückt so',
                'ein Engegefühl in der Brust',
                'die Brust tut weh'
            ],
            ausstrahlung: {
                probability: 0.6,
                locations: {
                    linker_arm: 0.5,
                    kiefer: 0.2,
                    rücken: 0.2,
                    oberbauch: 0.1
                }
            }
        },
        
        atemnot: {
            probability: 0.5,
            variations: [
                'bekommt schlecht Luft',
                'ist kurzatmig',
                'kann nicht richtig atmen',
                'atmet schwer'
            ]
        },
        
        schwitzen: {
            probability: 0.4,
            variations: [
                'schwitzt stark',
                'ist verschwitzt',
                'der Schweiß läuft {ihm/ihr} runter'
            ]
        },
        
        angst: {
            probability: 0.6,
            variations: [
                'hat Angst',
                'ist verängstigt',
                'macht sich Sorgen',
                'hat Todesangst'
            ]
        },
        
        übelkeit: {
            probability: 0.3,
            variations: [
                '{ihm/ihr} ist übel',
                'muss sich übergeben',
                'klagt über Übelkeit'
            ]
        }
    },
    
    // ========================================
    // 🏥 MEDIZINISCH
    // ========================================
    medizinisch: {
        vorgeschichte: {
            bekannte_khe: {
                probability: 0.85,
                info: 'Patient hat bekannte koronare Herzerkrankung'
            },
            
            vorangegangene_infarkte: {
                probability: 0.4,
                anzahl: { min: 1, max: 3 }
            },
            
            stents: {
                probability: 0.5,
                info: 'Patient hat Stents'
            },
            
            bypass_op: {
                probability: 0.2,
                info: 'Patient hatte Bypass-OP'
            }
        },
        
        medikamente: {
            nitro_spray: {
                probability: 0.75,
                genommen: {
                    probability: 0.8,
                    wirkung: {
                        geholfen: 0.4,
                        nicht_geholfen: 0.6
                    }
                },
                info: 'Patient hat Nitro-Spray genommen'
            },
            
            herz_medikamente: {
                probability: 0.9,
                types: ['Betablocker', 'ACE-Hemmer', 'ASS', 'Statin']
            }
        },
        
        mehrfacherkrankungen: {
            probability: 0.8,
            kombinationen: {
                diabetes: { probability: 0.4 },
                hypertonie: { probability: 0.7 },
                copd: { probability: 0.3 },
                adipositas: { probability: 0.4 }
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
                stockwerke: {
                    distribution: [0.4, 0.3, 0.2, 0.1],
                    effects: { zeitaufwand_hoch: 1.0 }
                }
            }
        }
    },
    
    // ========================================
    // 🗺️ LOCATIONS
    // ========================================
    locations: {
        wohnhaus: {
            probability: 0.75,
            variations: ['zu Hause', 'in der Wohnung', 'im Schlafzimmer']
        },
        
        arbeitsplatz: {
            probability: 0.1,
            time_dependent: [7, 18]
        },
        
        arztpraxis: {
            probability: 0.05,
            info: 'In der Hausarztpraxis, Arzt hat Notruf abgesetzt'
        },
        
        öffentlich_straße: {
            probability: 0.05
        },
        
        andere: { probability: 0.05 }
    },
    
    // ========================================
    // 🚑 NACHFORDERUNGEN
    // ========================================
    nachforderungen: {
        nef: {
            probability: 0.25,
            trigger_time: { min: 180, max: 360 },
            reasons: [
                'Patient instabiler als gedacht',
                'Verdacht auf Herzinfarkt',
                'EKG auffällig'
            ]
        }
    },
    
    // ========================================
    // ⚡ ESKALATION
    // ========================================
    eskalation: {
        verschlechterung: {
            zu_herzinfarkt: {
                probability: 0.15,
                trigger_time: { min: 120, max: 480 },
                upgrade_stichwort: 'Herzinfarkt',
                nef_jetzt_nötig: 1.0,
                anrufer_info: 'Die Schmerzen werden viel schlimmer! {Er/Sie} greift sich ans Herz!'
            }
        },
        
        besserung: {
            probability: 0.3,
            trigger_time: { min: 180, max: 400 },
            outcomes: {
                nitro_wirkt: {
                    probability: 0.6,
                    info: 'Nitro-Spray wirkt, Besserung'
                },
                spontan_besser: {
                    probability: 0.4,
                    info: 'Schmerzen lassen nach'
                }
            }
        }
    },
    
    // ========================================
    // 🏥 DISPOSITION
    // ========================================
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0,
            ktw: 0
        },
        
        adjustments: {
            if_verschlechterung: { nef: '=1' },
            if_besserung: { ktw: '=1', rtw: '-1' }
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'herzkatheterlabor_bereitschaft',
                hospitals: ['rems_murr_klinikum_winnenden', 'klinikum_ludwigsburg'],
                reason: 'Bei Verdacht auf Infarkt'
            },
            priorität_2: {
                condition: 'kardiologie',
                selection: 'by_specialization'
            }
        }
    },
    
    // ========================================
    // 📻 FUNKSPRÜCHE
    // ========================================
    funksprüche: {
        lagemeldungen: [
            'Patient mit thorakalen Beschwerden, bekannte KHK',
            'Angina-Pectoris-Anfall, Patient ansprechbar',
            'Brustschmerzen, Nitro gegeben, Besserung',
            'Thorakale Beschwerden, EKG wird geschrieben'
        ]
    },
    
    // ========================================
    // 🎭 SPECIAL
    // ========================================
    special: {
        fehlalarm: {
            übertreibung: {
                probability: 0.2,
                realität: 'Weniger dramatisch als beschrieben'
            }
        },
        
        stammkunde: {
            probability: 0.15,
            info: 'Bekannter Patient mit häufigen Angina-Anfällen'
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ANGINA_PECTORIS_TEMPLATE };
}