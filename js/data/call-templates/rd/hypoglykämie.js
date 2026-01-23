// =========================================================================================
// HYPOGLYKÄMIE (UNTERZUCKER) TEMPLATE
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const HYPOGLYKÄMIE_TEMPLATE = {
    
    id: 'hypoglykämie',
    kategorie: 'rd',
    stichwort: 'Hypoglykämie / Unterzucker',
    weight: 3,
    
    anrufer: {
        typen: {
            angehöriger: {
                probability: 0.5,
                characteristics: {
                    kennt_diabetes: 0.9,
                    weiß_was_zu_tun_ist: 0.6
                }
            },
            patient_selbst: {
                probability: 0.2,
                characteristics: {
                    verwirrt: 0.6,
                    unkooperativ: 0.4
                }
            },
            zeuge: { probability: 0.15 },
            pfleger: {
                probability: 0.1,
                location_likely: 'pflegeheim'
            },
            arbeitskollege: { probability: 0.05 }
        },
        
        beziehung: {
            variations: [
                '{Er/Sie} ist ganz verwirrt',
                'Der Zucker ist bestimmt zu niedrig',
                '{Er/Sie} schwitzt und zittert',
                'Ich glaube {er/sie} hat Unterzucker',
                '{Er/Sie} ist nicht ansprechbar',
                '{Er/Sie} benimmt sich ganz komisch'
            ]
        }
    },
    
    patient: {
        geschlecht: { male: 0.52, female: 0.48 },
        alter: {
            distribution: 'normal',
            mean: 62,
            stddev: 18,
            min: 18,
            max: 95
        }
    },
    
    symptome: {
        schwitzen: {
            probability: 0.85,
            variations: [
                'schwitzt stark',
                'ist nass geschwitzt',
                'der Schweiß läuft {ihm/ihr} runter',
                'ist völlig verschwitzt'
            ]
        },
        
        zittern: {
            probability: 0.75,
            variations: [
                'zittert',
                'die Hände zittern',
                'zittert am ganzen Körper',
                'hat Zittern'
            ]
        },
        
        verwirrtheit: {
            probability: 0.7,
            severity: {
                leicht: 0.4,
                mittel: 0.4,
                schwer: 0.2
            },
            variations: [
                'ist verwirrt',
                'weiß nicht wo {er/sie} ist',
                'redet wirres Zeug',
                'erkennt mich nicht',
                'ist desorientiert'
            ]
        },
        
        bewusstseinsstörung: {
            probability: 0.4,
            levels: {
                somnolent: { probability: 0.5 },
                soporös: { probability: 0.3 },
                bewusstlos: { probability: 0.2 }
            },
            variations: [
                'reagiert kaum',
                'ist nicht richtig ansprechbar',
                'bewusstlos',
                'sehr schläfrig'
            ]
        },
        
        aggression: {
            probability: 0.25,
            variations: [
                'ist aggressiv',
                'wehrt sich',
                'will nichts essen',
                'schreit rum',
                'ist unkooperativ'
            ],
            polizei_evtl: 0.1
        },
        
        hunger: {
            probability: 0.5,
            variations: [
                'hat Heißhunger',
                'will unbedingt was essen',
                'klagt über Hunger'
            ]
        },
        
        herzrasen: {
            probability: 0.6,
            info: 'Herz rast, Tachykardie'
        },
        
        krampfanfall: {
            probability: 0.1,
            info: 'Hypoglykämischer Krampfanfall',
            upgrade_stichwort: 'Krampfanfall'
        }
    },
    
    medizinisch: {
        diabetes: {
            typ_1: {
                probability: 0.35,
                characteristics: {
                    jüngere_patienten: 0.7,
                    insulin: 1.0
                }
            },
            typ_2: {
                probability: 0.65,
                characteristics: {
                    ältere_patienten: 0.8,
                    tabletten: 0.6,
                    insulin: 0.4
                }
            }
        },
        
        blutzucker_messung: {
            vor_ort_gemessen: {
                probability: 0.4,
                werte: {
                    sehr_niedrig: { range: [20, 40], probability: 0.3 },
                    niedrig: { range: [40, 60], probability: 0.5 },
                    grenzwertig: { range: [60, 70], probability: 0.2 }
                },
                info: 'Angehöriger hat Blutzucker gemessen'
            }
        },
        
        ursachen: {
            zu_viel_insulin: { probability: 0.3 },
            mahlzeit_vergessen: { probability: 0.35 },
            mehr_aktivität_als_sonst: { probability: 0.15 },
            alkohol: { probability: 0.1 },
            medikamentenfehler: { probability: 0.05 },
            unklar: { probability: 0.05 }
        },
        
        selbstbehandlung_versucht: {
            probability: 0.5,
            methods: {
                traubenzucker: { probability: 0.5, erfolg: 0.6 },
                saft_getrunken: { probability: 0.3, erfolg: 0.5 },
                essen: { probability: 0.2, erfolg: 0.4 }
            }
        }
    },
    
    locations: {
        wohnhaus: { probability: 0.7 },
        pflegeheim: { probability: 0.15 },
        arbeitsplatz: { probability: 0.08 },
        öffentlich: { probability: 0.05 },
        andere: { probability: 0.02 }
    },
    
    nachforderungen: {
        nef: {
            probability: 0.15,
            trigger_time: { min: 180, max: 360 },
            reasons: {
                bewusstlos: 0.6,
                krampfanfall: 0.3,
                nicht_ansprechbar: 0.1
            }
        }
    },
    
    eskalation: {
        verschlechterung: {
            bewusstlos_werden: {
                probability: 0.1,
                trigger_time: { min: 120, max: 300 },
                nef_nötig: 1.0,
                anrufer_info: '{Er/Sie} reagiert jetzt gar nicht mehr!'
            },
            
            krampfanfall: {
                probability: 0.05,
                upgrade_stichwort: 'Krampfanfall'
            }
        },
        
        besserung: {
            probability: 0.6,
            trigger_time: { min: 180, max: 420 },
            outcomes: {
                schnelle_besserung_nach_glukose: {
                    probability: 0.8,
                    info: 'Nach Glukosegabe deutliche Besserung',
                    funkspruch: '{callsign}, nach Glukosegabe deutliche Besserung, Patient orientiert, kommen.'
                },
                langsame_erholung: {
                    probability: 0.2
                }
            }
        }
    },
    
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0,
            ktw: 0
        },
        
        adjustments: {
            if_schnelle_besserung: {
                transport_evtl_nicht_nötig: 0.3
            },
            if_bewusstlos: {
                nef: '=1'
            }
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'standard',
                selection: 'nächstgelegen',
                reason: 'Ursache abklären, Diabeteseinstellung prüfen'
            }
        }
    },
    
    funksprüche: {
        lagemeldungen: [
            'Patient mit Hypoglykämie, verwirrt aber ansprechbar',
            'Unterzucker, BZ bei {wert} mg/dl, Glukose gegeben',
            'Diabetischer Notfall, Patient nach Glukosegabe gebessert',
            'Hypoglykämie, Patient jetzt orientiert und stabil'
        ]
    },
    
    special: {
        fehlalarm: {
            transport_ablehnung: {
                probability: 0.25,
                condition: 'Nach Glukosegabe wieder fit',
                info: 'Patient lehnt Transport ab, fühlt sich wieder gut'
            }
        },
        
        stammkunde: {
            probability: 0.2,
            info: 'Bekannter Patient mit häufigen Hypoglykämien'
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HYPOGLYKÄMIE_TEMPLATE };
}