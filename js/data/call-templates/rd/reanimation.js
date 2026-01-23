// =========================================================================================
// REANIMATION TEMPLATE
// =========================================================================================

import { GLOBAL_CONFIG } from '../_config.js';

export const REANIMATION_TEMPLATE = {
    
    id: 'reanimation',
    kategorie: 'rd',
    stichwort: 'Reanimation',
    weight: 2,
    
    anrufer: {
        typen: {
            angehöriger_panisch: {
                probability: 0.5,
                characteristics: {
                    hysterie: 0.8,
                    weint: 0.7,
                    schreit: 0.4,
                    schwer_zu_beruhigen: 0.9
                }
            },
            angehöriger_versucht_ruhe: {
                probability: 0.2,
                characteristics: {
                    versucht_anweisungen_zu_folgen: 0.8
                }
            },
            zeuge: {
                probability: 0.15,
                location_likely: 'öffentlich'
            },
            sanitäter: {
                probability: 0.1,
                characteristics: {
                    professionell: 1.0,
                    reanimation_läuft_bereits: 0.9
                }
            },
            pfleger: {
                probability: 0.05,
                location_likely: 'pflegeheim'
            }
        },
        
        beziehung: {
            variations: [
                '{Er/Sie} atmet nicht mehr!',
                'Ich glaube {er/sie} ist tot!',
                '{Er/Sie} reagiert nicht! Hilfe!',
                'Bitte kommen Sie schnell, {er/sie} ist bewusstlos!',
                '{Er/Sie} bewegt sich nicht mehr!',
                'Hilfe! {Er/Sie} atmet nicht!'
            ]
        },
        
        telefonreanimation: {
            probability: 0.7,
            outcomes: {
                anrufer_macht_mit: {
                    probability: 0.6,
                    quality: {
                        gut: 0.3,
                        mittel: 0.5,
                        schlecht: 0.2
                    }
                },
                anrufer_überfordert: {
                    probability: 0.3,
                    reasons: ['zu aufgeregt', 'körperlich nicht in der Lage', 'traut sich nicht']
                },
                bereits_laie_macht: {
                    probability: 0.1,
                    info: 'Andere Person macht bereits Wiederbelebung'
                }
            }
        }
    },
    
    patient: {
        geschlecht: { male: 0.6, female: 0.4 },
        alter: {
            distribution: 'normal',
            mean: 68,
            stddev: 15,
            min: 18,
            max: 95
        }
    },
    
    symptome: {
        bewusstlos: {
            probability: 1.0,
            variations: [
                'reagiert auf nichts',
                'ist bewusstlos',
                'liegt regungslos da',
                'rührt sich nicht'
            ]
        },
        
        keine_atmung: {
            probability: 1.0,
            variations: [
                'atmet nicht',
                'ich spüre keine Atmung',
                'die Brust hebt sich nicht',
                'keine Atmung vorhanden'
            ],
            
            schnappatmung: {
                probability: 0.3,
                info: 'Röchelt manchmal / Schnappatmung',
                erklärung_nötig: 1.0
            }
        },
        
        farbe: {
            blass: { probability: 0.5 },
            zyanotisch: { probability: 0.4 },
            grau: { probability: 0.1 }
        },
        
        ursache_bekannt: {
            probability: 0.4,
            causes: {
                herzinfarkt: { probability: 0.4 },
                kollaps: { probability: 0.3 },
                unfall: { probability: 0.2 },
                ertrinken: { probability: 0.05 },
                andere: { probability: 0.05 }
            }
        }
    },
    
    medizinisch: {
        vorgeschichte: {
            herzerkrankung: { probability: 0.6 },
            früherer_infarkt: { probability: 0.3 },
            diabetes: { probability: 0.35 },
            copd: { probability: 0.25 }
        },
        
        rhythmus_vor_ort: {
            vf_vtach: {
                probability: 0.3,
                defi_indikation: 1.0,
                info: 'Kammerflimmern / ventrikulare Tachykardie'
            },
            asystolie: {
                probability: 0.4,
                prognose: 'schlecht'
            },
            pea: {
                probability: 0.3,
                info: 'Pulslose elektrische Aktivität'
            }
        }
    },
    
    umgebung: {
        gebäude: {
            enge_räume: {
                probability: 0.2,
                locations: ['Badezimmer', 'Flur', 'schmales Zimmer'],
                effects: {
                    reanimation_erschwert: 0.8,
                    patient_muss_umgelagert_werden: 0.6
                }
            },
            
            kein_aufzug: {
                probability: 0.15,
                stockwerke: {
                    distribution: [0.2, 0.3, 0.25, 0.15, 0.1],
                    effects: {
                        tragehilfe_zwingend: 1.0,
                        fw_automatisch: 1.0
                    }
                },
                funkspruch: '{callsign}, Reanimation im {floor} OG ohne Aufzug, benötigen definitiv Tragehilfe, kommen.'
            },
            
            tür_verschlossen: {
                probability: 0.08,
                effects: {
                    feuerwehr_türöffnung_sofort: 1.0,
                    jede_minute_zählt: 1.0
                },
                funkspruch: 'ACHTUNG! Reanimation, kein Zugang, FW zur Türöffnung DRINGEND!'
            }
        }
    },
    
    sozial: {
        angehörige: {
            anwesend: {
                probability: 0.7,
                reactions: {
                    extrem_belastet: 0.8,
                    hysterisch: 0.4,
                    im_weg: 0.5,
                    hilft: 0.2
                }
            },
            
            patientenverfügung: {
                probability: 0.15,
                conflicts: {
                    reanimation_nicht_gewünscht: 0.6,
                    angehörige_wollen_trotzdem: 0.3
                },
                info: 'Patientenverfügung liegt vor'
            }
        }
    },
    
    locations: {
        wohnhaus: { probability: 0.65 },
        pflegeheim: { probability: 0.15 },
        öffentlich_straße: { probability: 0.1 },
        arbeitsplatz: { probability: 0.05 },
        arztpraxis: { probability: 0.03 },
        andere: { probability: 0.02 }
    },
    
    nachforderungen: {
        nef: {
            probability: 1.0,
            info: 'NEF wird IMMER nachalarmiert',
            trigger_time: { min: 0, max: 60 }
        },
        
        rtw_zusätzlich: {
            probability: 0.5,
            trigger_time: { min: 300, max: 600 },
            reasons: {
                ablösung: 0.5,
                zweiter_patient: 0.3,
                transport_unterstützung: 0.2
            },
            funkspruch: '{callsign}, benötigen zweiten RTW zur Ablösung, Reanimation läuft, kommen.'
        },
        
        feuerwehr: {
            probability: 0.6,
            reasons: {
                tragehilfe: 0.6,
                türöffnung: 0.3,
                zusätzliche_helfer: 0.1
            }
        },
        
        notarzt_zusätzlich: {
            probability: 0.1,
            condition: 'lange_reanimation',
            info: 'Zusätzlicher NA zur Unterstützung'
        }
    },
    
    eskalation: {
        rosc: {
            probability: 0.35,
            trigger_time: { min: 180, max: 900 },
            info: 'Return of Spontaneous Circulation',
            funkspruch: '{callsign}, ROSC erreicht, Patient hat wieder Kreislauf, kommen.',
            outcomes: {
                stabil: { probability: 0.3 },
                instabil: { probability: 0.7 }
            }
        },
        
        therapierefraktion: {
            probability: 0.4,
            trigger_time: { min: 1200, max: 1800 },
            info: 'Reanimation erfolglos, Abbruch',
            funkspruch: '{callsign}, Reanimation nach {dauer} Minuten erfolglos abgebrochen, kommen.'
        }
    },
    
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 1,
            ktw: 0
        },
        
        adjustments: {
            if_lange_reanimation: { rtw: '+1' }
        },
        
        klinik_auswahl: {
            priorität_1: {
                condition: 'post_rosc',
                hospitals: ['klinikum_ludwigsburg', 'katharinenhospital_stuttgart'],
                reason: 'Kühlungstherapie / Intensivstation'
            },
            priorität_2: {
                condition: 'nächstgelegenes_mit_intensiv',
                selection: 'by_distance'
            }
        }
    },
    
    funksprüche: {
        lagemeldungen: [
            'Reanimation läuft, Patient bewusstlos, keine Atmung',
            'CPR wird durchgeführt, {anzahl} Zyklus',
            'Reanimation, Defi eingesetzt, Rhythmuskontrolle',
            'Patient reanimationspflichtig, Notarzt vor Ort'
        ]
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { REANIMATION_TEMPLATE };
}