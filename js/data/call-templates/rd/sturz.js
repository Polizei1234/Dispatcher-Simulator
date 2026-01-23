// =========================================================================================
// STURZ TEMPLATE - Häufigster RD-Einsatz, besonders bei Senioren
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const STURZ_TEMPLATE = {
    
    id: 'sturz',
    kategorie: 'rd',
    stichwort: 'Sturz',
    weight: 4,
    
    anrufer: {
        typen: {
            angehöriger: {
                probability: 0.45,
                speech_pattern: 'besorgt',
                variations: [
                    'Meine Mutter ist gestürzt!',
                    'Er ist hingefallen und kommt nicht mehr hoch!',
                    'Sie ist ausgerutscht!',
                    'Ist im Badezimmer ausgerutscht!'
                ]
            },
            
            patient_selbst: {
                probability: 0.25,
                speech_pattern: 'schmerzhaft, gestresst',
                variations: [
                    'Ich bin gestürzt, ich kann nicht aufstehen',
                    'Bin hingefallen, meine Hüfte tut so weh',
                    'Ich liege auf dem Boden, komme nicht hoch'
                ],
                effects: {
                    allein_zuhause: 0.8,
                    hilflos: 0.9
                }
            },
            
            nachbar: {
                probability: 0.15,
                speech_pattern: 'unsicher, hat geklopft gehört',
                variations: [
                    'Mein Nachbar hat um Hilfe gerufen, ist wohl gestürzt',
                    'Höre Hilferufe von nebenan',
                    'Nachbarin liegt am Boden, sehe es durchs Fenster'
                ],
                effects: {
                    zugang_evtl_problem: 0.6
                }
            },
            
            pflegepersonal: {
                probability: 0.12,
                speech_pattern: 'professionell',
                variations: [
                    'Bewohnerin ist gestürzt, Verdacht auf Hüftfraktur',
                    'Patient nach Sturz, kann Bein nicht bewegen'
                ],
                location: 'pflegeheim'
            },
            
            zeuge: {
                probability: 0.03,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Jemand ist gestürzt!',
                    'Eine ältere Dame ist hingefallen!',
                    'Hier ist jemand die Treppe runtergestürzt!'
                ],
                location: 'öffentlich'
            }
        },
        
        dynamik: {
            schmerzen_werden_schlimmer: {
                probability: 0.2,
                trigger_time: { min: 180, max: 360 },
                change: 'Die Schmerzen werden immer schlimmer!'
            }
        },
        
        zeitfaktor: {
            gerade_eben: { probability: 0.4, variations: ['ist gerade eben passiert', 'vor 5 Minuten'] },
            vor_stunden: { probability: 0.35, variations: ['liegt schon seit Stunden da', 'weiß nicht genau wann'] },
            über_nacht: { probability: 0.15, variations: ['liegt wohl schon die ganze Nacht da'], hypothermie_risiko: 0.7 },
            vor_tagen: { probability: 0.1, variations: ['ist vor ein paar Tagen passiert, geht aber nicht mehr'], bagatell: 0.4 }
        }
    },
    
    patient: {
        geschlecht: {
            male: 0.35,
            female: 0.65  // Frauen häufiger, besonders ältere
        },
        
        alter: {
            distribution: 'skewed_old',
            mean: 78,
            stddev: 12,
            min: 20,
            max: 102,
            peak_age: 82
        },
        
        mobilität: {
            selbstständig: { probability: 0.4 },
            mit_gehhilfe: { probability: 0.35, types: ['Rollator', 'Gehstock', 'Geh gestell'] },
            rollstuhl: { probability: 0.15 },
            bettlägerig: { probability: 0.1, sturz_aus_bett: 1.0 }
        }
    },
    
    sturz_mechanismus: {
        gestolpert: {
            probability: 0.4,
            variations: [
                'ist über Teppich gestolpert',
                'ist über eigene Füße gefallen',
                'über Kabel gestolpert',
                'über Schwelle gestolpert'
            ],
            ursachen: ['Teppichkante', 'Kabel', 'Schuhe', 'Haustier']
        },
        
        ausgerutscht: {
            probability: 0.25,
            variations: [
                'im Badezimmer ausgerutscht',
                'auf nasser Fliese ausgerutscht',
                'im Treppenhaus ausgerutscht'
            ],
            locations: ['Badezimmer', 'Küche', 'Treppenhaus'],
            schlimmer: 0.6
        },
        
        schwindel_kollaps: {
            probability: 0.15,
            variations: [
                'wurde schwindelig und ist umgekippt',
                'einfach umgekippt',
                'Beine haben nachgegeben'
            ],
            differentialdiagnose: ['Synkope', 'Schlaganfall', 'Herzrhythmusstörung'],
            abklärung_wichtig: 1.0
        },
        
        treppe: {
            probability: 0.12,
            variations: [
                'die Treppe runtergestürzt',
                'Treppe runtergefallen',
                'mehrere Stufen runter'
            ],
            schwere_verletzungen_wahrscheinlich: 0.7
        },
        
        aus_bett: {
            probability: 0.05,
            variations: ['aus dem Bett gefallen', 'beim Aufstehen aus Bett gestürzt'],
            nachts: 0.8
        },
        
        leiter: {
            probability: 0.02,
            variations: ['von Leiter gefallen', 'von Stuhl gefallen'],
            höhe: { min: 1, max: 3 },
            schwerer: 0.8
        },
        
        unklarer_mechanismus: {
            probability: 0.01,
            variations: ['weiß nicht mehr wie', 'kann sich nicht erinnern'],
            bewusstseinsverlust_möglich: 0.7
        }
    },
    
    verletzungen: {
        hüftfraktur: {
            probability: 0.25,
            variations: [
                'Hüfte tut höllisch weh',
                'kann das Bein nicht bewegen',
                'Bein liegt komisch',
                'Hüfte ist total schmerzhaft'
            ],
            severity: 'schwer',
            op_nötig: 0.95,
            alte_menschen: 0.9
        },
        
        armfraktur: {
            probability: 0.15,
            types: {
                handgelenk: { probability: 0.5, variations: ['Handgelenk gebrochen'] },
                unterarm: { probability: 0.3 },
                oberarm: { probability: 0.2 }
            },
            variations: ['Arm tut weh', 'hat sich abgestützt', 'Arm ist geschwollen']
        },
        
        kopfverletzung: {
            probability: 0.2,
            types: {
                platzwunde: { probability: 0.6, variations: ['Kopf blutet', 'Platzwunde am Kopf'] },
                schädel_hirn_trauma: { probability: 0.3, bewusstlosigkeit: 0.5 },
                gehirnerschütterung: { probability: 0.1 }
            },
            blutverdünner_kritisch: 0.8
        },
        
        rippenfraktur: {
            probability: 0.1,
            variations: ['Rippen tun weh beim Atmen', 'Brustkorb schmerzt'],
            atmung_schmerzhaft: 1.0
        },
        
        wirbelsäule: {
            probability: 0.05,
            types: {
                wirbelkörperfraktur: { probability: 0.7 },
                bandscheibenvorfall: { probability: 0.3 }
            },
            variations: ['Rücken tut extrem weh', 'kann sich nicht bewegen'],
            immobilisation_wichtig: 1.0
        },
        
        prellungen_schmerzen: {
            probability: 0.4,
            variations: [
                'hat Schmerzen aber nichts gebrochen',
                'alles tut weh',
                'blaue Flecken überall',
                'verprellt'
            ],
            bagatell_potential: 0.5
        },
        
        keine_sichtbare: {
            probability: 0.15,
            variations: ['scheint nichts gebrochen', 'kommt nur nicht hoch'],
            kann_trotzdem_schwer_sein: 0.3
        }
    },
    
    komplikationen: {
        kann_nicht_aufstehen: {
            probability: 0.7,
            variations: [
                'kommt nicht mehr hoch',
                'kann nicht aufstehen',
                'liegt am Boden',
                'ist zu schwach zum Aufstehen'
            ],
            gründe: ['Schmerzen', 'Schwäche', 'Angst', 'Fraktur']
        },
        
        lange_gelegen: {
            probability: 0.25,
            dauer: { min: 3, max: 24, unit: 'Stunden' },
            effects: {
                unterkühlung: 0.6,
                dehydrierung: 0.7,
                druckstellen: 0.4,
                verwirrtheit: 0.5
            },
            variations: ['liegt schon Stunden da', 'konnte niemanden erreichen']
        },
        
        blutverdünner: {
            probability: 0.4,
            types: ['Marcumar', 'Eliquis', 'Xarelto', 'ASS'],
            effects: {
                blutungsrisiko_erhöht: 1.0,
                kopfverletzung_kritischer: 0.9,
                ct_kontrolle_wichtig: 0.8
            },
            info: 'Nimmt Blutverdünner!'
        },
        
        hypothermie: {
            probability: 0.1,
            condition: 'lange_gelegen',
            variations: ['ist ganz kalt', 'zittert am ganzen Körper', 'unterkühlt'],
            kritisch: 0.7
        }
    },
    
    medizinisch: {
        vorerkrankungen: {
            probability: 0.9,
            types: {
                osteoporose: { probability: 0.5, frakturrisiko_erhöht: 1.0 },
                demenz: { probability: 0.3, sturzrisiko: 1.0 },
                parkinson: { probability: 0.15, sturzrisiko: 1.0 },
                schlaganfall_früher: { probability: 0.2, gehbehinderung: 0.8 },
                herzrhythmusstörungen: { probability: 0.25, synkopen: 0.6 },
                diabetes: { probability: 0.35, schwindel: 0.5 },
                sehschwäche: { probability: 0.6, sturzrisiko: 0.8 }
            }
        },
        
        medikamente: {
            blutverdünner: { probability: 0.4 },
            blutdrucksenker: { probability: 0.6, schwindel_risiko: 0.5 },
            schlafmittel: { probability: 0.2, sturzrisiko: 0.7 },
            beruhigungsmittel: { probability: 0.15, sturzrisiko: 0.7 }
        }
    },
    
    umgebung: {
        gebäude: {
            kein_aufzug: {
                probability: 0.2,
                effects: {
                    tragehilfe_fast_immer: 0.95,
                    feuerwehr_nötig: 0.7
                },
                funkspruch: '{callsign}, Patient nach Sturz im {floor} OG, kann nicht laufen, FW Tragehilfe, kommen.'
            },
            
            sehr_enge_wohnung: {
                probability: 0.2,
                variations: ['liegt zwischen Möbeln', 'sehr enge Wohnung', 'schwieriger Zugang'],
                effects: {
                    lagerung_schwierig: 0.8
                }
            }
        },
        
        technik: {
            tür_verschlossen: {
                probability: 0.2,
                reasons: {
                    patient_kann_nicht_zur_tür: 0.9,
                    bewusstlos: 0.1
                },
                effects: {
                    feuerwehr_sofort: 1.0
                },
                funkspruch: '{callsign}, Patient nach Sturz, kann Tür nicht öffnen, FW zur Türöffnung, kommen.'
            },
            
            hausnotruf: {
                probability: 0.15,
                info: 'Hat Hausnotruf gedrückt',
                schnellere_alarmierung: 1.0
            }
        }
    },
    
    sozial: {
        angehörige: {
            sehr_besorgt: {
                probability: 0.6,
                manifestations: ['macht sich Sorgen', 'hat Angst um Mutter/Vater']
            },
            
            schuldgefühle: {
                probability: 0.2,
                variations: [
                    'Hätte ich doch besser aufgepasst',
                    'Ich hab {ihn/sie} allein gelassen',
                    'Das ist meine Schuld'
                ]
            },
            
            überfordert: {
                probability: 0.3,
                info: 'Weiß nicht mehr weiter, passiert ständig',
                pflege_überfordert: 0.7
            }
        },
        
        soziale_situation: {
            allein_lebend: {
                probability: 0.5,
                effects: {
                    lange_gelegen_wahrscheinlicher: 0.8,
                    nachversorgung_problem: 0.6
                }
            },
            
            keine_angehörigen: {
                probability: 0.15,
                effects: {
                    sozialamt_evtl: 0.6,
                    pflegeheim_überlegung: 0.4
                }
            }
        }
    },
    
    locations: {
        wohnhaus: {
            probability: 0.75,
            address_types: ['residential', 'apartment'],
            räume: {
                badezimmer: 0.35,
                schlafzimmer: 0.2,
                wohnzimmer: 0.2,
                flur: 0.15,
                küche: 0.1
            }
        },
        
        pflegeheim: {
            probability: 0.15,
            address_types: ['nursing_home'],
            pfleger_vor_ort: 1.0,
            dokumentation_vorhanden: 0.9
        },
        
        öffentlich: {
            probability: 0.07,
            address_types: ['street', 'park', 'supermarket'],
            zeugen: { min: 1, max: 5 }
        },
        
        treppenhaus: {
            probability: 0.03,
            address_types: ['stairwell'],
            schwerer: 0.7
        }
    },
    
    nachforderungen: {
        feuerwehr: {
            probability: 0.5,
            trigger_time: { min: 0, max: 120 },
            reasons: {
                tragehilfe: { probability: 0.7, funkspruch: '{callsign}, Patient kann nicht laufen, benötigen FW Tragehilfe, kommen.' },
                türöffnung: { probability: 0.25, funkspruch: '{callsign}, kein Zugang, FW zur Türöffnung, kommen.' },
                patientenlift: { probability: 0.05, funkspruch: '{callsign}, adipöser Patient, benötigen FW mit Patientenlift, kommen.' }
            }
        },
        
        nef: {
            probability: 0.08,
            trigger_time: { min: 120, max: 300 },
            reasons: ['Bewusstlosigkeit', 'Vitalwerte kritisch', 'Polytrauma'],
            funkspruch: '{callsign}, Patient kritischer als gedacht, benötigen NEF, kommen.'
        }
    },
    
    eskalation: {
        verschlechterung: {
            verborgene_verletzungen: {
                probability: 0.1,
                trigger_time: { min: 180, max: 360 },
                types: ['innere Blutung', 'Milzriss', 'Leberruptur'],
                funkspruch: '{callsign}, Patient verschlechtert sich, Verdacht innere Verletzung, kommen.'
            }
        },
        
        besserung: {
            kann_doch_aufstehen: {
                probability: 0.15,
                trigger_time: { min: 120, max: 300 },
                info: 'Mit Hilfe kann Patient aufstehen',
                transport_vereinfacht: 1.0
            },
            
            lehnt_transport_ab: {
                probability: 0.1,
                condition: 'keine_schwere_verletzung',
                info: 'Patient will nicht ins Krankenhaus',
                unterschrift_nötig: 1.0
            }
        }
    },
    
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0.08,
            ktw: 0
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'hüftfraktur',
                hospitals: ['rems_murr_klinikum_winnenden', 'klinikum_ludwigsburg'],
                reason: 'Unfallchirurgie, OP-Möglichkeit'
            },
            
            priorität_2: {
                condition: 'kopfverletzung_blutverdünner',
                hospitals: ['klinikum_ludwigsburg', 'katharinenhospital_stuttgart'],
                reason: 'CT, Neurochirurgie'
            },
            
            priorität_3: {
                condition: 'leicht_verletzt',
                hospitals: ['nächstgelegenes'],
                reason: 'Standardversorgung'
            }
        }
    },
    
    funksprüche: {
        lagemeldungen: [
            'Patient nach häuslichem Sturz',
            'Sturz mit Verdacht auf Hüftfraktur',
            'Sturz, Patient liegt seit Stunden am Boden',
            'Sturz mit Kopfverletzung, Patient nimmt Blutverdünner',
            'Patient nach Sturz, kann nicht aufstehen'
        ]
    },
    
    special: {
        häufigkeit: {
            info: 'Häufigster RD-Einsatz bei älteren Menschen',
            wiederholungsgefahr: 0.6
        },
        
        prävention: {
            stolperfallen: ['Teppiche', 'Kabel', 'schlechte Beleuchtung'],
            empfehlungen: ['Hausnotruf', 'Gehhilfe', 'Wohnung anpassen']
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { STURZ_TEMPLATE };
}
