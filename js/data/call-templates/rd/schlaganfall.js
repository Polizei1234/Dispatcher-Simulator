// =========================================================================================
// SCHLAGANFALL TEMPLATE
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const SCHLAGANFALL_TEMPLATE = {
    
    id: 'schlaganfall',
    kategorie: 'rd',
    stichwort: 'Schlaganfall',
    weight: 3,
    
    anrufer: {
        typen: {
            angehöriger: {
                probability: 0.6,
                characteristics: {
                    besorgt: 0.9,
                    bemerkt_symptome: 0.8
                }
            },
            zeuge: { probability: 0.2 },
            pfleger: {
                probability: 0.15,
                location_likely: 'pflegeheim'
            },
            patient_selbst: {
                probability: 0.05,
                characteristics: {
                    sprachstörung: 0.8,
                    schwer_verständlich: 0.9
                }
            }
        },
        
        beziehung: {
            variations: [
                'Mein Mann spricht so komisch',
                'Meine Frau kann den Arm nicht mehr bewegen',
                '{Er/Sie} hängt im Gesicht',
                'Ich glaube {er/sie} hat einen Schlaganfall',
                'Das Gesicht ist einseitig gelahmt',
                '{Er/Sie} kann nicht mehr richtig reden'
            ]
        }
    },
    
    patient: {
        geschlecht: { male: 0.55, female: 0.45 },
        alter: {
            distribution: 'normal',
            mean: 72,
            stddev: 12,
            min: 35,
            max: 95
        }
    },
    
    symptome: {
        sprachstörung: {
            probability: 0.75,
            variations: [
                'spricht verwaschen',
                'kann nicht mehr richtig sprechen',
                'lallt',
                'findet die Worte nicht',
                'Sprache ist undeutlich',
                'kann sich nicht ausdrücken'
            ],
            severity: {
                leicht: 0.3,
                mittel: 0.4,
                schwer: 0.3
            }
        },
        
        hemiparese: {
            probability: 0.8,
            seite: { links: 0.5, rechts: 0.5 },
            variations: [
                'kann den {linken/rechten} Arm nicht bewegen',
                'das {linke/rechte} Bein ist schwach',
                'eine Seite ist gelahmt',
                '{linker/rechter} Arm hängt herunter',
                'kann nicht mehr gehen'
            ]
        },
        
        fazialis_parese: {
            probability: 0.7,
            variations: [
                'das Gesicht hängt auf einer Seite',
                'der Mund ist schief',
                'kann nicht mehr richtig lächeln',
                'ein Mundwinkel hängt runter'
            ]
        },
        
        bewusstseinsstörung: {
            probability: 0.3,
            severity: {
                somnolent: 0.5,
                soporös: 0.3,
                bewusstlos: 0.2
            },
            variations: [
                'reagiert kaum noch',
                'ist ganz benommen',
                'nicht richtig ansprechbar',
                'bewusstlos'
            ]
        },
        
        schwindel: {
            probability: 0.4,
            variations: [
                'hat Schwindel',
                'kann nicht mehr stehen',
                'alles dreht sich'
            ]
        },
        
        kopfschmerzen: {
            probability: 0.35,
            variations: [
                'hat plötzliche starke Kopfschmerzen',
                'der Kopf tut {ihm/ihr} weh',
                'klagt über Kopfschmerzen'
            ]
        },
        
        sehstörungen: {
            probability: 0.25,
            variations: [
                'sieht doppelt',
                'kann auf einem Auge nicht mehr sehen',
                'hat Sehstörungen'
            ]
        },
        
        plötzlicher_beginn: {
            probability: 0.9,
            zeitpunkt: {
                vor_minuten: 0.5,
                vor_stunden: 0.4,
                nachts_bemerkt: 0.1
            },
            info: 'Symptome traten plötzlich auf'
        }
    },
    
    medizinisch: {
        vorgeschichte: {
            hypertonie: { probability: 0.75 },
            vorhofflimmern: { probability: 0.35 },
            diabetes: { probability: 0.4 },
            früherer_schlaganfall: { probability: 0.25 },
            frühere_tia: { probability: 0.15 }
        },
        
        medikamente: {
            blutverdünner: {
                probability: 0.5,
                types: ['Marcumar', 'Eliquis', 'Xarelto', 'ASS']
            }
        },
        
        zeitfenster_lyse: {
            innerhalb_45h: {
                probability: 0.6,
                info: 'ZEITKRITISCH! Lyse-Fenster!',
                stroke_unit_zwingend: 1.0
            },
            außerhalb: {
                probability: 0.4,
                info: 'Symptombeginn vor mehr als 4,5h'
            }
        }
    },
    
    umgebung: {
        gebäude: {
            kein_aufzug: {
                probability: 0.2,
                stockwerke: {
                    distribution: [0.3, 0.3, 0.2, 0.15, 0.05],
                    effects: {
                        zeitaufwand_hoch: 1.0,
                        tragehilfe_wahrscheinlich: 0.6
                    }
                }
            }
        }
    },
    
    sozial: {
        angehörige: {
            sehr_besorgt: {
                probability: 0.8,
                effects: {
                    viele_fragen: 0.9,
                    wollen_mitfahren: 0.7
                }
            }
        }
    },
    
    locations: {
        wohnhaus: { probability: 0.7 },
        pflegeheim: { probability: 0.2 },
        arbeitsplatz: { probability: 0.05 },
        öffentlich: { probability: 0.05 }
    },
    
    nachforderungen: {
        nef: {
            probability: 0.4,
            trigger_time: { min: 120, max: 300 },
            reasons: ['Patient kritischer', 'Bewusstlos', 'Atemweg gefährdet']
        },
        
        feuerwehr: {
            probability: 0.15,
            reasons: { tragehilfe: 0.7, türöffnung: 0.3 }
        }
    },
    
    eskalation: {
        verschlechterung: {
            stufe_2: {
                probability: 0.2,
                trigger_time: { min: 180, max: 420 },
                changes: ['Bewusstsein trübt sich ein', 'Zustand verschlechtert sich'],
                nef_jetzt_nötig: 1.0
            },
            
            aspiration: {
                probability: 0.05,
                info: 'Patient aspiriert, Atemweg gefährdet'
            }
        }
    },
    
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.4,
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'stroke_unit_zwingend',
                hospitals: ['rems_murr_klinikum_winnenden', 'klinikum_ludwigsburg', 'katharinenhospital_stuttgart'],
                reason: 'Stroke Unit mit Lyse-Möglichkeit ZWINGEND!'
            },
            
            zeitfaktor: {
                critical: true,
                info: 'TIME IS BRAIN - schnellstmöglicher Transport!'
            }
        }
    },
    
    funksprüche: {
        lagemeldungen: [
            'Patient mit akuter Hemiparese, V.a. Apoplex',
            'Schlaganfall-Verdacht, Sprach- und Bewegungsstörung',
            'Apoplex, innerhalb Lyse-Fenster, Stroke Unit anfahren',
            'Neurologischer Notfall, Patient halbseitig gelahmt'
        ]
    },
    
    special: {
        tia_statt_schlaganfall: {
            probability: 0.15,
            info: 'Symptome bessern sich schnell, war nur TIA',
            funkspruch: '{callsign}, Symptome bilden sich zurück, möglicherweise TIA, kommen.'
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SCHLAGANFALL_TEMPLATE };
}