// =========================================================================================
// TEMPLATE: ATEMNOT / DYSPNOE
// Beschreibung: Akute Atemnot unklarer Genese - kann viele Ursachen haben
// =========================================================================================

export const ATEMNOT_TEMPLATE = {
    id: 'atemnot',
    kategorie: 'rd',
    stichwort: 'Atemnot',
    weight: 4,  // Sehr häufig
    
    // =========================================================================================
    // ANRUFER-TYPEN
    // =========================================================================================
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.35,
                speech_pattern: 'atemlos',
                variations: [
                    'Ich... bekomme... keine Luft mehr!',
                    '*keuchend* Hilfe... ich... kann nicht... atmen...',
                    'Bitte... schnell... *röchelnd* keine Luft...',
                    'Ich... kriege... keinen Atem... *pfeifend*',
                    'Es... wird... immer enger... *hustet*',
                ],
                effects: {
                    breathing_sounds: true,
                    pauses: 'frequent',
                    volume: 'quiet'
                }
            },
            
            angehöriger_panisch: {
                probability: 0.40,
                speech_pattern: 'panisch',
                variations: [
                    'Mein Mann bekommt keine Luft mehr! Er wird ganz blau!',
                    'Sie ringt nach Luft! Bitte kommen Sie schnell!',
                    'Er atmet so komisch, ganz schnell und flach!',
                    'Sie hustet und bekommt keine Luft! Was soll ich tun?!',
                    'Sein Gesicht wird blau! Bitte helfen Sie!',
                    'Sie sagt, sie erstickt! Ich weiß nicht was ich machen soll!',
                ],
                background_sounds: ['patient_wheezing', 'coughing', 'gasping']
            },
            
            angehöriger_ruhig: {
                probability: 0.15,
                speech_pattern: 'besorgt',
                variations: [
                    'Meine Mutter hat Atemnot, sie ist Asthmatikerin.',
                    'Er hat Probleme beim Atmen, das kenne ich von ihm.',
                    'Sie bekommt schlecht Luft, hat aber ihr Spray genommen.',
                    'Er atmet sehr schwer und klagt über Brustenge.',
                ],
                background_sounds: ['heavy_breathing']
            },
            
            pflegepersonal: {
                probability: 0.08,
                speech_pattern: 'professionell',
                variations: [
                    'Patient mit akuter Dyspnoe, Sauerstoffsättigung bei 87%.',
                    'Bewohnerin hat zunehmende Atemnot, RR 140/90.',
                    'Patient hyperventiliert, SpO2 fällt, bekannte COPD.',
                    'Akute respiratorische Verschlechterung bei bekannter Herzinsuffizienz.',
                ],
                additional_info: {
                    vitals_available: true,
                    medical_history: true
                }
            },
            
            zeuge: {
                probability: 0.02,
                speech_pattern: 'unsicher',
                variations: [
                    'Da liegt jemand und bekommt keine Luft!',
                    'Ein Mann hier hustet ganz schlimm und atmet komisch!',
                    'Eine Frau hier sagt sie bekommt keine Luft mehr!',
                ]
            }
        },
        
        dynamik: {
            verschlechterung: {
                probability: 0.25,
                triggers: ['time_elapsed', 'exertion'],
                progression: [
                    '*im Hintergrund* Er wird noch blauer! Er sackt zusammen!',
                    'Es wird schlimmer! Sie bekommt gar keine Luft mehr!',
                    'Jetzt ist er bewusstlos geworden!',
                ]
            },
            
            besserung: {
                probability: 0.15,
                triggers: ['medication', 'position'],
                progression: [
                    'Das Spray scheint zu wirken, sie atmet etwas besser.',
                    'Ich habe ihn hingesetzt, das scheint zu helfen.',
                    'Es wird etwas besser, aber er braucht trotzdem Hilfe.',
                ]
            }
        }
    },
    
    // =========================================================================================
    // PATIENTEN-DATEN
    // =========================================================================================
    
    patient: {
        geschlecht: {
            male: { probability: 0.48 },
            female: { probability: 0.52 }
        },
        
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 35, stddev: 15, weight: 0.3 },  // Jüngere: Asthma, Panik
            peak2: { mean: 68, stddev: 12, weight: 0.7 },  // Ältere: Herzinsuff., COPD
            min: 18,
            max: 95
        },
        
        bewusstsein: {
            wach: { probability: 0.70 },
            somnolent: { probability: 0.15 },
            bewusstlos: { probability: 0.10 },
            verwirrt: { probability: 0.05 }
        },
        
        atmung: {
            tachypnoe: { probability: 0.50, details: '> 30/min' },
            normal_erschwert: { probability: 0.25 },
            pfeifend: { probability: 0.15, details: 'Giemen/Wheezing' },
            röchelnd: { probability: 0.08, details: 'Rasselgeräusche' },
            insuffizient: { probability: 0.02, details: 'Schnappatmung' }
        }
    },
    
    // =========================================================================================
    // URSACHEN & DIFFERENTIALDIAGNOSEN
    // =========================================================================================
    
    ursachen: {
        asthma_anfall: {
            probability: 0.20,
            indicators: ['pfeifende_atmung', 'bekannte_asthma', 'spray_verwendet'],
            severity: 'mittel-schwer'
        },
        
        copd_exazerbation: {
            probability: 0.18,
            indicators: ['raucher', 'bekannte_copd', 'produktiver_husten'],
            severity: 'mittel-schwer'
        },
        
        herzinsuffizienz: {
            probability: 0.15,
            indicators: ['orthopnoe', 'beinödeme', 'rasselnde_atmung'],
            severity: 'schwer',
            escalation: 'lungenoedem'
        },
        
        lungenembolie: {
            probability: 0.08,
            indicators: ['plötzlicher_beginn', 'thoraxschmerz', 'immobilisation'],
            severity: 'kritisch'
        },
        
        pneumonie: {
            probability: 0.12,
            indicators: ['fieber', 'husten', 'allgemeinsymptome'],
            severity: 'mittel'
        },
        
        hyperventilation: {
            probability: 0.15,
            indicators: ['jüngerer_patient', 'stress', 'kribbeln_händen'],
            severity: 'leicht',
            bagatell_potential: 0.3
        },
        
        anaphylaxie: {
            probability: 0.05,
            indicators: ['akuter_beginn', 'hautveränderungen', 'exposition'],
            severity: 'kritisch',
            escalation: 'schock'
        },
        
        pneumothorax: {
            probability: 0.04,
            indicators: ['einseitiger_thoraxschmerz', 'trauma_anamnese'],
            severity: 'schwer'
        },
        
        andere: {
            probability: 0.03,
            details: 'Fremdkörper, Tumor, metabolisch'
        }
    },
    
    // =========================================================================================
    // SYMPTOME & BEGLEITSYMPTOME
    // =========================================================================================
    
    symptome: {
        hauptsymptom: {
            atemnot_ruhe: { probability: 0.40 },
            atemnot_belastung: { probability: 0.30 },
            orthopnoe: { probability: 0.15, details: 'nur im Sitzen möglich' },
            erstickungsgefühl: { probability: 0.15 }
        },
        
        begleitsymptome: {
            husten: { 
                probability: 0.45,
                varianten: ['trocken', 'produktiv', 'bellend']
            },
            thoraxschmerz: { 
                probability: 0.30,
                details: 'kann auf kardiale/pulmonale Ursache hinweisen'
            },
            zyanose: { 
                probability: 0.20,
                details: 'bläuliche Verfärbung Lippen/Finger'
            },
            schwitzen: { probability: 0.35 },
            angst: { probability: 0.60 },
            schwindel: { probability: 0.25 },
            kribbeln: { 
                probability: 0.15,
                details: 'bei Hyperventilation'
            },
            ödeme: { 
                probability: 0.20,
                details: 'bei Herzinsuffizienz'
            },
            fieber: { probability: 0.15 }
        }
    },
    
    // =========================================================================================
    // LOCATIONS
    // =========================================================================================
    
    locations: {
        zuhause: {
            probability: 0.60,
            address_types: ['residential', 'apartment'],
            details: 'Meist nachts verschlechtert'
        },
        
        pflegeheim: {
            probability: 0.15,
            address_types: ['care_home'],
            additional_info: 'Bekannte Vorerkrankungen'
        },
        
        arbeitsplatz: {
            probability: 0.10,
            address_types: ['office', 'commercial'],
            triggers: ['stress', 'allergen_exposition']
        },
        
        öffentlich: {
            probability: 0.12,
            address_types: ['street', 'public_place', 'shop'],
            witnesses: true
        },
        
        arztpraxis: {
            probability: 0.03,
            address_types: ['medical'],
            details: 'Patient bereits beim Arzt'
        }
    },
    
    // =========================================================================================
    // MEDIZINISCHE MASSNAHMEN
    // =========================================================================================
    
    massnahmen: {
        ersthelfer: {
            fenster_öffnen: { probability: 0.40 },
            oberkörper_hoch: { probability: 0.35 },
            spray_gegeben: { probability: 0.25, note: 'bei bekannter Erkrankung' },
            beruhigen: { probability: 0.30 }
        },
        
        rtw: {
            sauerstoffgabe: { probability: 0.90 },
            monitoring: { probability: 1.0 },
            venöser_zugang: { probability: 0.70 },
            medikamente: {
                bronchodilatatoren: { probability: 0.35 },
                kortison: { probability: 0.25 },
                diuretika: { probability: 0.15 },
                adrenalin: { probability: 0.05 }
            }
        }
    },
    
    // =========================================================================================
    // DISPOSITION
    // =========================================================================================
    
    disposition: {
        base_recommendation: {
            rtw: 1,
            nef: 0,
            ktw: 0
        },
        
        nef_indikation: {
            probability: 0.15,
            triggers: [
                'spo2_unter_85',
                'bewusstlosigkeit',
                'zyanose',
                'respiratorische_erschöpfung',
                'anaphylaxie_verdacht'
            ]
        },
        
        zielklinik: {
            standard: { probability: 0.75 },
            stroke_unit: { probability: 0.0 },
            traumazentrum: { probability: 0.0 },
            intensivstation: { probability: 0.20 },
            spezial: { probability: 0.05, note: 'Pneumologie' }
        }
    },
    
    // =========================================================================================
    // ESKALATION & KOMPLIKATIONEN
    // =========================================================================================
    
    eskalation: {
        während_anruf: {
            bewusstlosigkeit: {
                probability: 0.08,
                announcement: 'Er ist jetzt bewusstlos geworden!',
                next_steps: 'Reanimationsbereitschaft'
            },
            
            extreme_zyanose: {
                probability: 0.12,
                announcement: 'Er wird immer blauer! Ich habe Angst!',
                severity_increase: true
            },
            
            panik_angehöriger: {
                probability: 0.15,
                effects: 'communication_difficult'
            }
        },
        
        während_einsatz: {
            reanimation: {
                probability: 0.03,
                triggers: ['atemstillstand', 'herz_kreislauf_stillstand']
            },
            
            intubation_erforderlich: {
                probability: 0.08,
                indicators: 'respiratorische_insuffizienz'
            },
            
            anaphylaktischer_schock: {
                probability: 0.02,
                rapid_progression: true
            }
        }
    },
    
    // =========================================================================================
    // FOLGEEINSÄTZE
    // =========================================================================================
    
    folgeeinsätze: {
        angehöriger_kollabiert: {
            probability: 0.05,
            reason: 'Überforderung, Panik',
            second_rtw: true
        },
        
        nef_nachalarmierung: {
            probability: 0.15,
            triggers: ['verschlechterung', 'kritische_vitalwerte']
        },
        
        tragehilfe_feuerwehr: {
            probability: 0.08,
            reasons: ['adipositas', 'kein_aufzug', 'enger_treppenhaus']
        }
    },
    
    // =========================================================================================
    // ZEITFAKTOREN
    // =========================================================================================
    
    zeitfaktoren: {
        tageszeit_modifikator: {
            nacht_02_06: 1.3,  // Orthopnoe, Herzinsuffizienz
            morgen_06_10: 1.2,  // COPD-Exazerbation
            tag_10_18: 0.9,
            abend_18_22: 1.0,
            nacht_22_02: 1.1
        },
        
        jahreszeit_modifikator: {
            winter: 1.4,    // Infekte, COPD
            frühling: 1.2,  // Allergien, Asthma
            sommer: 0.9,
            herbst: 1.1     // Infekte beginnen
        },
        
        wetter_einfluss: {
            kalt: 1.3,
            schwül: 1.2,
            pollenflug: 1.4,
            normal: 1.0
        }
    },
    
    // =========================================================================================
    // BESONDERHEITEN
    // =========================================================================================
    
    besonderheiten: {
        sprachbarriere: {
            probability: 0.12,
            effect: 'Anamnese erschwert'
        },
        
        vorerkrankungen: {
            copd: { probability: 0.25 },
            asthma: { probability: 0.20 },
            herzinsuffizienz: { probability: 0.18 },
            keine_bekannt: { probability: 0.37 }
        },
        
        medikamente_zuhause: {
            probability: 0.40,
            types: ['asthma_spray', 'sauerstoff', 'herzmedikamente']
        },
        
        raucher: {
            probability: 0.45,
            pack_years: 'variabel'
        }
    },
    
    // =========================================================================================
    // TRAINING & LERNZIELE
    // =========================================================================================
    
    lernziele: [
        'Differentialdiagnose bei Atemnot',
        'Priorisierung nach Schweregrad',
        'Gezielte Nachfrage nach Begleitsymptomen',
        'Erkennung kritischer Situationen',
        'Richtige Ressourcen-Disposition'
    ],
    
    fallstricke: [
        'Atemnot kann viele Ursachen haben',
        'Hyperventilation vs. echte respiratorische Insuffizienz',
        'Unterschätzung bei jüngeren Patienten',
        'Anaphylaxie-Gefahr bei akutem Beginn',
        'Lungenembolie oft übersehen'
    ]
};

// =========================================================================================
// EXPORT
// =========================================================================================

export default ATEMNOT_TEMPLATE;
