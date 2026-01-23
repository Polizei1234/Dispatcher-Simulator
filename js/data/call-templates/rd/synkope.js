// =========================================================================================
// SYNKOPE / KOLLAPS TEMPLATE
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const SYNKOPE_TEMPLATE = {
    
    id: 'synkope',
    kategorie: 'rd',
    stichwort: 'Synkope / Kollaps',
    weight: 3,
    
    anrufer: {
        typen: {
            zeuge: { probability: 0.4 },
            angehöriger: { probability: 0.3 },
            patient_selbst: {
                probability: 0.2,
                characteristics: {
                    wieder_bei_bewusstsein: 0.9
                }
            },
            arbeitskollege: { probability: 0.1 }
        },
        
        beziehung: {
            variations: [
                '{Er/Sie} ist zusammengebrochen',
                '{Er/Sie} ist umgekippt',
                '{Er/Sie} ist ohnmächtig geworden',
                'ist einfach umgefallen',
                'liegt bewusstlos am Boden',
                'ist kollabiert'
            ]
        }
    },
    
    patient: {
        geschlecht: { male: 0.45, female: 0.55 },
        alter: {
            distribution: 'bimodal',
            peaks: [
                { mean: 25, stddev: 8, weight: 0.3 },  // Junge Erwachsene
                { mean: 70, stddev: 12, weight: 0.7 }  // Senioren
            ],
            min: 16,
            max: 95
        }
    },
    
    symptome: {
        bewusstseinsverlust: {
            probability: 0.9,
            dauer: {
                sekunden: { probability: 0.6, duration_range: [5, 30] },
                minuten: { probability: 0.3, duration_range: [60, 300] },
                noch_bewusstlos: { probability: 0.1 }
            },
            variations: [
                'war bewusstlos',
                'war kurz weg',
                'ist ohnmächtig geworden',
                'hat das Bewusstsein verloren'
            ]
        },
        
        jetzt_wieder_wach: {
            probability: 0.75,
            zustand: {
                orientiert: { probability: 0.5 },
                verwirrt: { probability: 0.4 },
                benommen: { probability: 0.1 }
            },
            variations: [
                'ist jetzt wieder wach',
                'ist wieder bei sich',
                'hat die Augen wieder auf',
                'ist wieder ansprechbar'
            ]
        },
        
        sturz: {
            probability: 0.8,
            verletzungen: {
                keine: { probability: 0.5 },
                platzwunde: { probability: 0.2 },
                prellung: { probability: 0.2 },
                fraktur: { probability: 0.1 }
            },
            variations: [
                'ist hingefallen',
                'auf den Boden geknallt',
                'unkontrolliert gestürzt',
                'mit dem Kopf aufgeschlagen'
            ]
        },
        
        prodromalsymptome: {
            probability: 0.6,
            symptoms: {
                schwindel: { probability: 0.7 },
                übelkeit: { probability: 0.4 },
                schwitzen: { probability: 0.5 },
                schwarz_vor_augen: { probability: 0.6 },
                herzrasen: { probability: 0.3 }
            },
            info: 'Patient spürte Symptome vor dem Kollaps'
        },
        
        nachher: {
            kopfschmerzen: { probability: 0.3 },
            verwirrtheit: { probability: 0.25 },
            müdigkeit: { probability: 0.5 },
            alles_gut: { probability: 0.3 }
        }
    },
    
    medizinisch: {
        ursachen: {
            vasovagal: {
                probability: 0.35,
                trigger: ['Schmerz', 'Schreck', 'langes Stehen', 'Hitze'],
                info: 'Klassische Ohnmacht, meist harmlos'
            },
            
            orthostatisch: {
                probability: 0.25,
                trigger: ['Schnell aufgestanden', 'Aus Bett aufgestanden'],
                info: 'Kreislaufregulationsstörung'
            },
            
            kardial: {
                probability: 0.2,
                types: {
                    rhythmusstörung: 0.6,
                    herzinfarkt: 0.2,
                    aortenstenose: 0.1,
                    lungenembolie: 0.1
                },
                info: 'ERNST! Kardiale Ursache',
                nef_nötig: 0.8
            },
            
            zerebral: {
                probability: 0.1,
                types: ['TIA', 'Schlaganfall', 'Epilepsie']
            },
            
            metabolisch: {
                probability: 0.05,
                types: ['Hypoglykämie', 'Dehydration']
            },
            
            unklar: { probability: 0.05 }
        },
        
        vorgeschichte: {
            frühere_synkopen: { probability: 0.3 },
            herzerkrankung: { probability: 0.25 },
            diabetes: { probability: 0.2 },
            bluthochdruck: { probability: 0.4 },
            medikamente: {
                blutdrucksenker: 0.3,
                betablocker: 0.2
            }
        }
    },
    
    umgebung: {
        situation: {
            beim_aufstehen: { probability: 0.2 },
            beim_sport: { probability: 0.1 },
            in_kirche_langes_stehen: { probability: 0.05 },
            nach_toilettengang: { probability: 0.1 },
            ohne_auslöser: { probability: 0.55 }
        }
    },
    
    locations: {
        wohnhaus: { probability: 0.5 },
        öffentlich_straße: { probability: 0.2 },
        arbeitsplatz: { probability: 0.15 },
        einkaufszentrum: { probability: 0.08 },
        kirche: { probability: 0.02 },
        andere: { probability: 0.05 }
    },
    
    nachforderungen: {
        nef: {
            probability: 0.15,
            trigger_time: { min: 180, max: 360 },
            reasons: {
                kardiale_ursache_vermutet: 0.6,
                noch_bewusstlos: 0.3,
                neurologische_ausfälle: 0.1
            }
        }
    },
    
    eskalation: {
        verschlechterung: {
            erneuter_kollaps: {
                probability: 0.1,
                trigger_time: { min: 120, max: 360 },
                upgrade_stichwort: 'Bewusstlosigkeit',
                anrufer_info: '{Er/Sie} ist schon wieder umgekippt!'
            },
            
            herzrhythmusstörung: {
                probability: 0.05,
                upgrade_stichwort: 'Herzrhythmusstörung',
                nef_nötig: 1.0
            }
        },
        
        besserung: {
            probability: 0.5,
            outcomes: {
                komplett_erholt: {
                    probability: 0.4,
                    transport_ablehnung_möglich: 0.3
                },
                stabil_aber_abklärung: {
                    probability: 0.6
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
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'kardiale_ursache',
                hospitals: ['rems_murr_klinikum_winnenden', 'klinikum_ludwigsburg'],
                reason: 'Kardiologie zur Abklärung'
            },
            priorität_2: {
                condition: 'standard',
                selection: 'nächstgelegen'
            }
        }
    },
    
    funksprüche: {
        lagemeldungen: [
            'Patient nach Synkope, jetzt wieder ansprechbar',
            'Kollaps, Patient orientiert, Vitalwerte stabil',
            'Synkope mit Sturz, Platzwunde am Kopf',
            'Kreislaufkollaps, Patient wieder bei Bewusstsein'
        ]
    },
    
    special: {
        fehlalarm: {
            übertreibung: {
                probability: 0.25,
                realität: 'Patient völlig fit, will nicht ins Krankenhaus'
            },
            
            transport_ablehnung: {
                probability: 0.2,
                info: 'Patient fühlt sich gut, lehnt Transport ab'
            }
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SYNKOPE_TEMPLATE };
}