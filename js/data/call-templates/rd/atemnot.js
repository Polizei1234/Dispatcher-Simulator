// =========================================================================================
// ATEMNOT TEMPLATE - Unklare Genese, vielfältige Ursachen
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const ATEMNOT_TEMPLATE = {
    
    id: 'atemnot',
    kategorie: 'rd',
    stichwort: 'Atemnot',
    weight: 4,
    
    anrufer: {
        typen: {
            angehöriger_besorgt: {
                probability: 0.5,
                speech_pattern: 'besorgt, aufgeregt',
                variations: [
                    'Er bekommt keine Luft mehr!',
                    'Sie kann nicht mehr atmen!',
                    'Hilfe, {er/sie} kriegt keine Luft!',
                    '{Er/Sie} schnappt nach Luft!'
                ]
            },
            
            patient_selbst: {
                probability: 0.35,
                speech_pattern: 'kurzatmig, spricht in kurzen Sätzen',
                variations: [
                    'Ich... bekomme... keine Luft...',
                    'Kann... nicht... atmen...',
                    'Hilfe... Atemnot...'
                ],
                effects: {
                    atemnot_hörbar: 1.0,
                    kritischer: 0.6
                }
            },
            
            nachbar: {
                probability: 0.08,
                speech_pattern: 'unsicher',
                variations: [
                    'Mein Nachbar hat angerufen, er bekommt keine Luft',
                    'Höre jemanden röcheln'
                ]
            },
            
            pflegepersonal: {
                probability: 0.07,
                speech_pattern: 'professionell',
                variations: [
                    'Bewohner mit akuter Dyspnoe',
                    'Patient hat Atemnot, Sauerstoffsättigung abgefallen'
                ],
                location: 'pflegeheim'
            }
        },
        
        dynamik: {
            wird_schlechter: {
                probability: 0.3,
                trigger_time: { min: 60, max: 180 },
                change: 'Atemnot wird schlimmer! {Er/Sie} kriegt kaum noch Luft!'
            },
            
            kann_nicht_mehr_sprechen: {
                probability: 0.15,
                trigger_time: { min: 90, max: 240 },
                change: '{Er/Sie} kann nicht mehr sprechen, nur noch röcheln!',
                upgrade_stichwort: 'Bewusstlosigkeit'
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: 0.52,
            female: 0.48
        },
        
        alter: {
            distribution: 'normal',
            mean: 65,
            stddev: 18,
            min: 20,
            max: 95
        }
    },
    
    symptome: {
        atemnot: {
            probability: 1.0,
            severity: {
                leicht: {
                    probability: 0.2,
                    variations: ['etwas kurzatmig', 'Luftnot bei Belastung']
                },
                mittel: {
                    probability: 0.5,
                    variations: ['hat Atemnot', 'bekommt schlecht Luft', 'ringt nach Luft']
                },
                schwer: {
                    probability: 0.3,
                    variations: ['schnappt nach Luft', 'kriegt gar keine Luft mehr', 'erstickt fast'],
                    nef_wahrscheinlich: 0.7
                }
            }
        },
        
        atemgeräusche: {
            giemen_pfeifen: {
                probability: 0.4,
                variations: ['pfeift beim Atmen', 'man hört ein Giemen'],
                hinweis: 'Asthma/COPD wahrscheinlich'
            },
            
            rasseln_brodeln: {
                probability: 0.25,
                variations: ['rasselt beim Atmen', 'hört sich feucht an', 'brodelt in der Lunge'],
                hinweis: 'Lungenödem/Pneumonie'
            },
            
            stridor: {
                probability: 0.05,
                variations: ['macht komische Geräusche beim Einatmen'],
                hinweis: 'Verlegung obere Atemwege'
            }
        },
        
        husten: {
            probability: 0.5,
            types: {
                trocken: { probability: 0.4 },
                produktiv: { probability: 0.4 },
                blutig: { probability: 0.2, kritisch: 1.0 }
            },
            variations: ['hustet stark', 'muss ständig husten', 'hustet Blut']
        },
        
        brustschmerzen: {
            probability: 0.3,
            variations: ['hat auch Schmerzen in der Brust', 'Brust tut weh'],
            differentialdiagnose: ['Herzinfarkt', 'Lungenembolie', 'Pneumothorax']
        },
        
        zyanose: {
            probability: 0.25,
            variations: ['Lippen sind blau', 'wird ganz blau im Gesicht', 'Finger sind blau'],
            severity: 'kritisch'
        },
        
        angst_panik: {
            probability: 0.6,
            variations: [
                'hat total Angst',
                'ist in Panik',
                'denkt {er/sie} stirbt',
                'hat Todesangst'
            ]
        },
        
        schwitzen: {
            probability: 0.4,
            variations: ['schwitzt stark', 'ist nass geschwitzt']
        },
        
        schwindel: {
            probability: 0.3,
            variations: ['ist schwindelig', 'alles dreht sich']
        },
        
        bewusstseinsstörung: {
            probability: 0.15,
            levels: {
                verwirrt: { probability: 0.6, variations: ['ist verwirrt', 'redet wirr'] },
                somnolent: { probability: 0.3, variations: ['wird schläfrig', 'reagiert kaum'] },
                bewusstlos: { probability: 0.1, variations: ['ist bewusstlos'], upgrade: 'Bewusstlosigkeit' }
            }
        }
    },
    
    ursachen: {
        asthma_anfall: {
            probability: 0.25,
            indicators: ['giemen', 'bekannter Asthmatiker', 'Spray hilft nicht'],
            medikamente: ['Salbutamol', 'Cortison']
        },
        
        copd_exazerbation: {
            probability: 0.2,
            indicators: ['bekannter COPD', 'älterer Patient', 'Raucher'],
            vorerkrankung: 1.0
        },
        
        herzinsuffizienz_lungenödem: {
            probability: 0.15,
            indicators: ['rasselnde Atmung', 'Herzerkrankung bekannt', 'Beinschweißung'],
            kritisch: 0.7
        },
        
        pneumonie: {
            probability: 0.15,
            indicators: ['Fieber', 'Husten', 'Auswurf'],
            dauer: 'mehrere Tage'
        },
        
        lungenembolie: {
            probability: 0.05,
            indicators: ['plötzliche Atemnot', 'Brustschmerz', 'nach OP/Flug'],
            kritisch: 0.9,
            nef_zwingend: 0.8
        },
        
        pneumothorax: {
            probability: 0.03,
            indicators: ['plötzlicher stechender Schmerz', 'einseitig'],
            kritisch: 0.8
        },
        
        hyperventilation_panik: {
            probability: 0.1,
            indicators: ['sehr aufgeregt', 'Kribbeln in Händen', 'Angst'],
            bagatell_potential: 0.6
        },
        
        aspiration: {
            probability: 0.03,
            indicators: ['beim Essen passiert', 'verschluckt'],
            akut: 1.0
        },
        
        anaphylaxie: {
            probability: 0.02,
            indicators: ['nach Insektenstich', 'nach Essen', 'Schwellung'],
            kritisch: 0.9,
            adrenalin_nötig: 1.0
        },
        
        herzinfarkt: {
            probability: 0.02,
            indicators: ['Brustschmerz', 'Übelkeit', 'Schwitzen'],
            kritisch: 0.9
        }
    },
    
    medizinisch: {
        vorerkrankungen: {
            probability: 0.85,
            types: {
                asthma: { probability: 0.3 },
                copd: { probability: 0.25 },
                herzinsuffizienz: { probability: 0.2 },
                koronare_herzkrankheit: { probability: 0.15 },
                lungenfibrose: { probability: 0.05 },
                lungenkrebs: { probability: 0.05 }
            }
        },
        
        medikamente: {
            atemwegs_medikamente: {
                probability: 0.5,
                types: ['Salbutamol-Spray', 'Cortison-Spray', 'Theophyllin']
            },
            herzmedikamente: { probability: 0.4 },
            sauerstoff_zuhause: { probability: 0.15 }
        },
        
        auslöser: {
            infektion: { probability: 0.35, info: 'Erkältung/Grippe' },
            allergie: { probability: 0.1, info: 'Pollen/Staub/Tiere' },
            anstrengung: { probability: 0.15, info: 'Körperliche Belastung' },
            stress: { probability: 0.1, info: 'Psychische Belastung' },
            spontan: { probability: 0.3, info: 'Ohne erkennbaren Auslöser' }
        }
    },
    
    umgebung: {
        gebäude: {
            kein_aufzug: {
                probability: 0.12,
                effects: {
                    patient_kann_nicht_laufen: 0.8,
                    tragehilfe_nötig: 0.6
                }
            }
        },
        
        luft_qualität: {
            stickig_schlecht: {
                probability: 0.2,
                variations: ['Luft ist sehr stickig', 'riecht nach Rauch', 'keine Fenster offen'],
                verbesserung_nach_lüften: 0.3
            },
            
            raucher_wohnung: {
                probability: 0.3,
                info: 'Starker Zigarettengeruch',
                verschlechterungsfaktor: 1.0
            }
        }
    },
    
    sozial: {
        angehörige: {
            sehr_besorgt: {
                probability: 0.7,
                manifestations: ['macht sich große Sorgen', 'hat Angst', 'weint']
            },
            
            kennen_erkrankung: {
                probability: 0.6,
                info: 'Wissen von Vorerkrankung, haben Medikamente gegeben'
            }
        }
    },
    
    locations: {
        wohnhaus: {
            probability: 0.75,
            address_types: ['residential', 'apartment']
        },
        
        pflegeheim: {
            probability: 0.12,
            address_types: ['nursing_home'],
            sauerstoff_vorhanden: 0.8
        },
        
        arbeitsplatz: {
            probability: 0.06,
            address_types: ['commercial', 'office']
        },
        
        öffentlich: {
            probability: 0.05,
            address_types: ['street', 'park']
        },
        
        arztpraxis: {
            probability: 0.02,
            address_types: ['doctors'],
            erstversorgung_läuft: 0.9
        }
    },
    
    nachforderungen: {
        nef: {
            probability: 0.3,
            trigger_time: { min: 120, max: 300 },
            reasons: ['Patient kritisch instabil', 'Intubation erforderlich', 'Sauerstoffsättigung kritisch'],
            funkspruch: '{callsign}, Patient mit schwerer Atemnot, benötigen NEF, kommen.'
        },
        
        feuerwehr: {
            probability: 0.04,
            reasons: {
                tragehilfe: { probability: 0.8 },
                türöffnung: { probability: 0.2 }
            }
        }
    },
    
    eskalation: {
        verschlechterung: {
            stufe_1: {
                probability: 0.25,
                trigger_time: { min: 120, max: 300 },
                changes: ['Atemnot wird schlimmer', 'Sauerstoffsättigung fällt']
            },
            
            stufe_2_bewusstlos: {
                probability: 0.1,
                trigger_time: { min: 180, max: 420 },
                changes: ['Patient bewusstlos', 'Keine ausreichende Atmung'],
                nef_sofort: 1.0,
                upgrade_stichwort: 'Bewusstlosigkeit'
            },
            
            stufe_3_reanimation: {
                probability: 0.03,
                trigger_time: { min: 240, max: 480 },
                changes: ['Atemstillstand', 'Keine Reaktion'],
                upgrade_stichwort: 'Reanimation'
            }
        },
        
        besserung: {
            medikamente_wirken: {
                probability: 0.2,
                trigger_time: { min: 180, max: 360 },
                info: 'Spray/Sauerstoff wirkt, Atemnot bessert sich',
                funkspruch: '{callsign}, Patient stabilisiert sich, Atemnot rückläufig, kommen.'
            }
        }
    },
    
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.3,
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'kritische_atemnot',
                hospitals: ['klinikum_ludwigsburg', 'rems_murr_klinikum_winnenden'],
                reason: 'Pneumologie/Intensivstation'
            },
            
            priorität_2: {
                condition: 'stabil',
                hospitals: ['nächstgelegenes'],
                reason: 'Standard-Versorgung ausreichend'
            }
        }
    },
    
    funksprüche: {
        lagemeldungen: [
            'Patient mit akuter Dyspnoe',
            'Atemnot bei bekanntem Asthma/COPD',
            'Patient ringt nach Luft, Sauerstoffgabe',
            'Schwere Atemnot, Patient zyanotisch',
            'Atemnot gebessert nach Medikamentengabe'
        ]
    },
    
    special: {
        differentialdiagnosen: {
            wichtig: [
                'Herzinfarkt ausschließen',
                'Lungenembolie bei Risikofaktoren',
                'Pneumothorax bei plötzlichem Beginn',
                'Anaphylaxie bei Allergiehinweisen'
            ]
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ATEMNOT_TEMPLATE };
}
