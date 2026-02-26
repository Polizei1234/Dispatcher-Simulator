// =========================
// INCIDENT TYPES v3.0 - MEGA UPDATE!
// 🎯 17 EINSATZTYPEN (vorher 8)
// 🕐 TAGESZEIT-ABHÄNGIGKEIT
// 🌦️ WETTER-ABHÄNGIGKEIT
// ⚖️ REALISTISCHE GEWICHTUNG
// =========================

/**
 * INCIDENT TYPES v3.0 - MEGA UPDATE!
 * 
 * NEU in v3.0:
 * - ✅ 9 neue Einsatztypen (gesamt 17 statt 8)
 * - ✅ Gewichtung nach Häufigkeit (weight)
 * - ✅ Tageszeit-Abhängigkeit (timeFactors)
 * - ✅ Wetter-Abhängigkeit (weatherFactors)
 * - ✅ Saisonale Faktoren (seasonalFactors)
 * 
 * KATEGORIEN:
 * 🚑 MEDICAL - Allgemeine medizinische Notfälle
 * 🚗 TRAFFIC - Verkehrsunfälle
 * 👶 BIRTH - Geburten
 * 👧 PEDIATRIC - Kindernotfälle
 * 🧠 PSYCHIATRIC - Psychiatrische Notfälle
 * 🌊 DROWNING - Ertrinkungsunfälle
 * 💊 POISONING - Vergiftungen
 * 🤧 ALLERGIC - Allergische Reaktionen
 * 🔥 BURNS - Verbrennungen (NEU)
 * 💔 CARDIAC - Herzerkrankungen (NEU)
 * 🧠 STROKE - Schlaganfall (NEU)
 * 🤕 FALLS - Stürze (NEU)
 * 🚧 WORKPLACE - Arbeitsunfälle (NEU)
 * 🦴 FRACTURES - Knochenbrüche (NEU)
 * 🫁 RESPIRATORY - Atemwegserkrankungen (NEU)
 * 🌡️ HEAT_EMERGENCY - Hitzschlag (NEU)
 * ❄️ HYPOTHERMIA - Unterkühlung (NEU)
 */

const INCIDENT_TYPES = {
    
    // ==============================================
    // 🚑 MEDICAL - Allgemeine medizinische Notfälle
    // ==============================================
    
    MEDICAL: {
        id: 'MEDICAL',
        name: 'Medizinischer Notfall',
        category: 'medical',
        organization: 'rettungsdienst',
        
        description: 'Allgemeine internistische oder traumatische Notfälle ohne Spezialcharakter',
        
        // 🎯 v3.0: GEWICHTUNG (10 = sehr häufig, 1 = sehr selten)
        weight: 8,  // Häufigster Einsatztyp
        
        // 🕐 v3.0: TAGESZEIT-FAKTOREN (Multiplikator pro Stunde)
        timeFactors: {
            night: 1.3,     // 22-06 Uhr: Mehr Notfälle nachts
            morning: 1.1,   // 06-12 Uhr: Leicht erhöht
            afternoon: 1.0, // 12-18 Uhr: Normal
            evening: 1.2    // 18-22 Uhr: Erhöht
        },
        
        // 🌦️ v3.0: WETTER-FAKTOREN
        weatherFactors: {
            storm: 0.9,     // Bei Sturm weniger Menschen unterwegs
            rain: 1.0,      // Neutral
            snow: 1.1,      // Mehr Stürze/Unfälle
            heat: 1.2,      // Mehr Kreislaufprobleme
            cold: 1.1       // Mehr Herzinfarkte
        },
        
        // 📅 v3.0: SAISONALE FAKTOREN
        seasonalFactors: {
            winter: 1.2,    // Mehr Erkältungen, Herzinfarkte
            spring: 1.0,
            summer: 0.9,    // Weniger internistische Notfälle
            autumn: 1.0
        },
        
        keywords: {
            MINOR: 'RD 1',
            MODERATE: 'RD 2',
            CRITICAL: 'RD 3'
        },
        
        compositionTemplates: {
            MINOR: {
                severity: 'MINOR',
                type: 'medical',
                modifiers: []
            },
            MODERATE: {
                severity: 'MODERATE',
                type: 'medical',
                modifiers: ['elderly', 'multiple_symptoms']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'medical',
                modifiers: ['unconscious', 'cardiac_emergency']
            }
        },
        
        questionCategories: [
            'vital_signs',
            'symptoms',
            'medical_history',
            'medications',
            'onset_time'
        ],
        
        requiredQuestions: [
            'consciousness',
            'breathing'
        ],
        
        criticalSymptoms: [
            'unconscious',
            'not_breathing',
            'chest_pain',
            'severe_bleeding'
        ],
        
        commonConditions: {
            MINOR: [
                'bauchschmerzen',
                'übelkeit_erbrechen',
                'kopfschmerzen',
                'rückenschmerzen',
                'fieber',
                'schwindel',
                'leichte_verletzung',
                'prellung'
            ],
            MODERATE: [
                'bewusstseinsstörung',
                'krampfanfall'
            ],
            CRITICAL: [
                'reanimation',
                'bewusstlos_keine_atmung',
                'schock',
                'schwerste_blutung'
            ]
        },
        
        locations: ['wohnung', 'arbeitsplatz', 'öffentlich', 'straße', 'geschäft'],
        callerTypes: ['patient', 'spouse', 'family', 'colleague', 'witness', 'neighbor'],
        emotionVariants: ['sachlich', 'besorgt', 'panisch', 'verzweifelt', 'verwirrt']
    },
    
    // ==============================================
    // 💔 CARDIAC - Herzerkrankungen (NEU!)
    // ==============================================
    
    CARDIAC: {
        id: 'CARDIAC',
        name: 'Herznotfall',
        category: 'cardiac',
        organization: 'rettungsdienst',
        
        description: 'Herzinfarkt, Angina Pectoris, Herzrhythmusstörungen',
        
        weight: 5,  // Häufig!
        
        timeFactors: {
            night: 1.4,     // Herzinfarkte oft nachts/früh morgens
            morning: 1.5,   // Peak-Zeit für Herzinfarkte!
            afternoon: 0.9,
            evening: 1.1
        },
        
        weatherFactors: {
            storm: 1.2,     // Stress durch Sturm
            cold: 1.5,      // Kälte = mehr Herzinfarkte!
            heat: 1.3,      // Hitze belastet Herz
            snow: 1.2       // Schnee schippen = Herzinfarkt-Risiko
        },
        
        seasonalFactors: {
            winter: 1.4,    // Deutlich mehr Herzinfarkte im Winter
            spring: 1.0,
            summer: 0.9,
            autumn: 1.1
        },
        
        keywords: {
            MINOR: 'RD 2',
            MODERATE: 'RD 2',
            CRITICAL: 'RD 3'
        },
        
        compositionTemplates: {
            MINOR: {
                severity: 'MINOR',
                type: 'medical',
                modifiers: ['chest_pain', 'cardiac']
            },
            MODERATE: {
                severity: 'MODERATE',
                type: 'medical',
                modifiers: ['chest_pain', 'cardiac_emergency', 'elderly']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'medical',
                modifiers: ['cardiac_arrest', 'unconscious', 'resuscitation']
            }
        },
        
        questionCategories: ['vital_signs', 'chest_pain', 'radiation', 'previous_cardiac'],
        requiredQuestions: ['consciousness', 'breathing', 'chest_pain_characteristics'],
        criticalSymptoms: ['cardiac_arrest', 'unconscious', 'severe_chest_pain'],
        
        commonConditions: {
            MINOR: ['angina_pectoris', 'herzrhythmusstörung'],
            MODERATE: ['herzinfarkt_verdacht', 'schwere_angina'],
            CRITICAL: ['herzinfarkt', 'herzstillstand', 'ventrikuläre_tachykardie']
        },
        
        locations: ['wohnung', 'arbeitsplatz', 'straße', 'pflegeheim'],
        callerTypes: ['spouse', 'colleague', 'witness', 'patient'],
        emotionVariants: ['panisch', 'sehr_besorgt', 'verzweifelt']
    },
    
    // ==============================================
    // 🧠 STROKE - Schlaganfall (NEU!)
    // ==============================================
    
    STROKE: {
        id: 'STROKE',
        name: 'Schlaganfall',
        category: 'stroke',
        organization: 'rettungsdienst',
        
        description: 'Schlaganfall, TIA - Stroke Unit erforderlich',
        
        weight: 4,  // Häufig und zeitkritisch
        
        timeFactors: {
            night: 1.3,
            morning: 1.4,   // Peak morgens
            afternoon: 0.9,
            evening: 1.0
        },
        
        weatherFactors: {
            cold: 1.2,
            heat: 1.3,      // Dehydrierung erhöht Risiko
            storm: 1.1
        },
        
        seasonalFactors: {
            winter: 1.2,
            spring: 1.0,
            summer: 1.1,    // Dehydrierung
            autumn: 1.0
        },
        
        keywords: {
            MODERATE: 'RD 2',
            CRITICAL: 'RD 3'
        },
        
        compositionTemplates: {
            MODERATE: {
                severity: 'MODERATE',
                type: 'medical',
                modifiers: ['stroke', 'time_critical', 'neurological']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'medical',
                modifiers: ['stroke', 'unconscious', 'time_critical', 'life_threatening']
            }
        },
        
        questionCategories: ['vital_signs', 'fast_test', 'symptom_onset', 'neurological'],
        requiredQuestions: ['consciousness', 'speech', 'face_drooping', 'arm_weakness', 'time_onset'],
        criticalSymptoms: ['unconscious', 'facial_droop', 'arm_weakness', 'speech_difficulty'],
        
        commonConditions: {
            MODERATE: ['tia', 'ischämischer_schlaganfall'],
            CRITICAL: ['schwerer_schlaganfall', 'blutung', 'bewusstlos']
        },
        
        locations: ['wohnung', 'pflegeheim', 'arbeitsplatz'],
        callerTypes: ['spouse', 'family', 'caregiver', 'colleague'],
        emotionVariants: ['besorgt', 'panisch', 'verzweifelt']
    },
    
    // ==============================================
    // 🚗 TRAFFIC - Verkehrsunfälle
    // ==============================================
    
    TRAFFIC: {
        id: 'TRAFFIC',
        name: 'Verkehrsunfall',
        category: 'traffic_accident',
        organization: 'rettungsdienst',
        
        description: 'Verkehrsunfälle mit Verletzten. Polizei wird automatisch alarmiert.',
        
        weight: 6,  // Sehr häufig
        
        timeFactors: {
            night: 0.7,     // Weniger Verkehr nachts
            morning: 1.5,   // Berufsverkehr!
            afternoon: 1.3, // Nachmittagsverkehr
            evening: 1.4    // Feierabendverkehr!
        },
        
        weatherFactors: {
            storm: 1.5,     // Viel mehr Unfälle bei Sturm
            rain: 1.8,      // Regen = mehr Unfälle!
            snow: 2.0,      // Schnee/Eis = deutlich mehr Unfälle
            fog: 1.6,       // Nebel = gefährlich
            ice: 2.2        // Glatteis = sehr gefährlich
        },
        
        seasonalFactors: {
            winter: 1.5,    // Mehr Unfälle im Winter
            spring: 1.1,
            summer: 0.9,    // Weniger Unfälle im Sommer
            autumn: 1.2     // Laub, Nässe
        },
        
        keywords: {
            MINOR: 'VU',
            MODERATE: 'VU',
            CRITICAL: 'VU P'
        },
        
        compositionTemplates: {
            MINOR: {
                severity: 'MINOR',
                type: 'trauma',
                modifiers: ['traffic_accident']
            },
            MODERATE: {
                severity: 'MODERATE',
                type: 'trauma',
                modifiers: ['traffic_accident', 'multi_vehicle', 'head_injury']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'trauma',
                modifiers: ['trapped', 'traffic_accident', 'multi_vehicle', 'life_threatening']
            }
        },
        
        questionCategories: ['vital_signs', 'accident_details', 'vehicle_count', 'entrapment', 'traffic_situation', 'hazards'],
        requiredQuestions: ['consciousness', 'breathing', 'vehicle_count', 'anyone_trapped', 'traffic_blocked'],
        criticalSymptoms: ['unconscious', 'not_breathing', 'trapped', 'fire', 'fuel_leaking'],
        
        commonConditions: {
            MINOR: ['leichte_verletzung', 'prellung', 'schnittwunde', 'schock_leicht'],
            MODERATE: ['kopfverletzung', 'fraktur_verdacht', 'mehrere_verletzungen', 'schock'],
            CRITICAL: ['polytrauma', 'eingeklemmt', 'bewusstlos', 'schwerste_verletzungen']
        },
        
        locations: ['stadtstraße', 'landstraße', 'autobahn', 'kreuzung', 'parkplatz'],
        callerTypes: ['driver', 'passenger', 'witness', 'other_driver'],
        emotionVariants: ['geschockt', 'panisch', 'sachlich', 'aufgeregt', 'verwirrt'],
        
        specialFeatures: ['scene_safety_critical', 'traffic_control_needed', 'police_notification_auto']
    },
    
    // ==============================================
    // 🤕 FALLS - Stürze (NEU! - SEHR HÄUFIG)
    // ==============================================
    
    FALLS: {
        id: 'FALLS',
        name: 'Sturz',
        category: 'falls',
        organization: 'rettungsdienst',
        
        description: 'Stürze in Wohnung, Treppe, aus Höhe',
        
        weight: 9,  // SEHR häufig! Besonders bei älteren Menschen
        
        timeFactors: {
            night: 1.5,     // Nachts aufs Klo = Sturzgefahr
            morning: 1.2,   // Morgens aufstehen
            afternoon: 1.0,
            evening: 1.1
        },
        
        weatherFactors: {
            snow: 2.5,      // Schnee/Eis = viele Stürze!
            ice: 3.0,       // Glatteis = extrem viele Stürze
            rain: 1.4,      // Nasse Wege
            storm: 1.2
        },
        
        seasonalFactors: {
            winter: 2.0,    // Winter = deutlich mehr Stürze
            spring: 1.0,
            summer: 0.8,
            autumn: 1.3     // Laub = rutschig
        },
        
        keywords: {
            MINOR: 'RD 1',
            MODERATE: 'RD 2',
            CRITICAL: 'RD 3'
        },
        
        compositionTemplates: {
            MINOR: {
                severity: 'MINOR',
                type: 'trauma',
                modifiers: ['fall', 'minor_injury']
            },
            MODERATE: {
                severity: 'MODERATE',
                type: 'trauma',
                modifiers: ['fall', 'head_injury', 'elderly']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'trauma',
                modifiers: ['fall', 'head_injury', 'unconscious', 'height']
            }
        },
        
        questionCategories: ['vital_signs', 'fall_height', 'head_impact', 'elderly', 'mobility'],
        requiredQuestions: ['consciousness', 'head_hit', 'can_move', 'height'],
        criticalSymptoms: ['unconscious', 'head_injury', 'neck_pain', 'unable_to_move'],
        
        commonConditions: {
            MINOR: ['prellung', 'schürfwunde', 'verstauchung'],
            MODERATE: ['fraktur_verdacht', 'kopfverletzung', 'rückenschmerzen'],
            CRITICAL: ['sht', 'wirbelsäulenverletzung', 'beckenfraktur', 'polytrauma']
        },
        
        locations: ['wohnung', 'treppe', 'badezimmer', 'straße', 'arbeitsplatz'],
        callerTypes: ['patient', 'spouse', 'neighbor', 'witness', 'caregiver'],
        emotionVariants: ['besorgt', 'panisch', 'sachlich']
    },
    
    // ==============================================
    // 🫁 RESPIRATORY - Atemwegserkrankungen (NEU!)
    // ==============================================
    
    RESPIRATORY: {
        id: 'RESPIRATORY',
        name: 'Atemwegsnotfall',
        category: 'respiratory',
        organization: 'rettungsdienst',
        
        description: 'Asthma, COPD, Atemnot',
        
        weight: 6,  // Häufig
        
        timeFactors: {
            night: 1.4,     // Asthma oft nachts schlimmer
            morning: 1.2,
            afternoon: 1.0,
            evening: 1.1
        },
        
        weatherFactors: {
            cold: 1.5,      // Kälte verschlimmert COPD
            fog: 1.3,       // Nebel/Feuchtigkeit
            heat: 1.2,      // Hitze = Atemnot
            storm: 1.1      // Luftdruckänderung
        },
        
        seasonalFactors: {
            winter: 1.5,    // Erkältung verschlimmert Asthma
            spring: 1.4,    // Pollen = Asthma
            summer: 1.0,
            autumn: 1.2
        },
        
        keywords: {
            MINOR: 'RD 1',
            MODERATE: 'RD 2',
            CRITICAL: 'RD 3'
        },
        
        compositionTemplates: {
            MINOR: {
                severity: 'MINOR',
                type: 'medical',
                modifiers: ['respiratory', 'dyspnea']
            },
            MODERATE: {
                severity: 'MODERATE',
                type: 'medical',
                modifiers: ['respiratory', 'severe_dyspnea', 'asthma']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'medical',
                modifiers: ['respiratory_failure', 'unconscious', 'life_threatening']
            }
        },
        
        questionCategories: ['vital_signs', 'breathing', 'previous_respiratory', 'medications', 'oxygen'],
        requiredQuestions: ['consciousness', 'breathing_difficulty', 'speaking_possible', 'inhalers_used'],
        criticalSymptoms: ['severe_dyspnea', 'cyanosis', 'confusion', 'exhaustion'],
        
        commonConditions: {
            MINOR: ['leichte_atemnot', 'asthma_mild'],
            MODERATE: ['asthma_anfall', 'copd_exazerbation', 'schwere_atemnot'],
            CRITICAL: ['asthma_status', 'atemversagen', 'bewusstlos']
        },
        
        locations: ['wohnung', 'arbeitsplatz', 'öffentlich'],
        callerTypes: ['patient', 'family', 'colleague', 'witness'],
        emotionVariants: ['panisch', 'sehr_besorgt', 'patient_kann_kaum_sprechen']
    },
    
    // ==============================================
    // 🔥 BURNS - Verbrennungen (NEU!)
    // ==============================================
    
    BURNS: {
        id: 'BURNS',
        name: 'Verbrennung',
        category: 'burns',
        organization: 'rettungsdienst',
        
        description: 'Verbrennungen, Verbrühungen',
        
        weight: 3,  // Mittel-selten
        
        timeFactors: {
            morning: 1.2,   // Kaffee/Kochen
            afternoon: 1.1,
            evening: 1.3,   // Kochen
            night: 0.8
        },
        
        weatherFactors: {
            heat: 1.2,      // Grillen im Sommer
            storm: 0.9
        },
        
        seasonalFactors: {
            winter: 0.9,
            spring: 1.0,
            summer: 1.4,    // Grill-Unfälle!
            autumn: 1.1
        },
        
        keywords: {
            MINOR: 'RD 1',
            MODERATE: 'RD 2',
            CRITICAL: 'RD 3'
        },
        
        compositionTemplates: {
            MINOR: {
                severity: 'MINOR',
                type: 'trauma',
                modifiers: ['burns', 'minor_burn']
            },
            MODERATE: {
                severity: 'MODERATE',
                type: 'trauma',
                modifiers: ['burns', 'second_degree', 'pain']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'trauma',
                modifiers: ['burns', 'extensive', 'smoke_inhalation', 'life_threatening']
            }
        },
        
        questionCategories: ['vital_signs', 'burn_area', 'burn_depth', 'cause', 'smoke_inhalation'],
        requiredQuestions: ['consciousness', 'breathing', 'burn_percentage', 'burn_location'],
        criticalSymptoms: ['extensive_burns', 'face_burns', 'smoke_inhalation', 'shock'],
        
        commonConditions: {
            MINOR: ['verbrennung_1grad', 'kleine_fläche'],
            MODERATE: ['verbrennung_2grad', 'mittlere_fläche'],
            CRITICAL: ['verbrennung_3grad', 'große_fläche', 'rauchgasvergiftung']
        },
        
        locations: ['küche', 'arbeitsplatz', 'garten', 'wohnung'],
        callerTypes: ['patient', 'family', 'witness', 'colleague'],
        emotionVariants: ['panisch', 'geschockt', 'schmerz']
    },
    
    // ==============================================
    // 🚧 WORKPLACE - Arbeitsunfälle (NEU!)
    // ==============================================
    
    WORKPLACE: {
        id: 'WORKPLACE',
        name: 'Arbeitsunfall',
        category: 'workplace_accident',
        organization: 'rettungsdienst',
        
        description: 'Arbeitsunfälle, Maschinenverletzungen',
        
        weight: 4,  // Häufig
        
        timeFactors: {
            morning: 1.4,   // Arbeitszeit
            afternoon: 1.5, // Hauptarbeitszeit
            evening: 0.7,   // Feierabend
            night: 0.3      // Wenig Arbeitsunfälle nachts
        },
        
        weatherFactors: {
            heat: 1.2,      // Hitze = Unaufmerksamkeit
            storm: 0.8      // Baustellen geschlossen
        },
        
        seasonalFactors: {
            winter: 0.9,
            spring: 1.1,
            summer: 1.2,    // Mehr Bauarbeiten
            autumn: 1.0
        },
        
        keywords: {
            MINOR: 'RD 1',
            MODERATE: 'RD 2',
            CRITICAL: 'RD 3'
        },
        
        compositionTemplates: {
            MINOR: {
                severity: 'MINOR',
                type: 'trauma',
                modifiers: ['workplace', 'minor_injury']
            },
            MODERATE: {
                severity: 'MODERATE',
                type: 'trauma',
                modifiers: ['workplace', 'machinery', 'laceration']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'trauma',
                modifiers: ['workplace', 'crushing', 'amputation', 'life_threatening']
            }
        },
        
        questionCategories: ['vital_signs', 'injury_type', 'machinery', 'chemicals', 'safety'],
        requiredQuestions: ['consciousness', 'injury_location', 'bleeding', 'trapped'],
        criticalSymptoms: ['severe_bleeding', 'amputation', 'crushing', 'chemical_exposure'],
        
        commonConditions: {
            MINOR: ['schnittwunde', 'prellung', 'verstauchung'],
            MODERATE: ['tiefe_schnittwunde', 'fraktur', 'quetschung'],
            CRITICAL: ['amputation', 'schwerste_quetschung', 'mehrfachverletzung']
        },
        
        locations: ['baustelle', 'fabrik', 'werkstatt', 'lager'],
        callerTypes: ['colleague', 'supervisor', 'safety_officer'],
        emotionVariants: ['geschockt', 'sachlich', 'panisch']
    },
    
    // ==============================================
    // 🦴 FRACTURES - Knochenbrüche (NEU!)
    // ==============================================
    
    FRACTURES: {
        id: 'FRACTURES',
        name: 'Fraktur',
        category: 'fracture',
        organization: 'rettungsdienst',
        
        description: 'Knochenbrüche ohne Sturz',
        
        weight: 5,  // Häufig
        
        timeFactors: {
            morning: 1.1,
            afternoon: 1.3, // Sport, Aktivitäten
            evening: 1.2,
            night: 0.8
        },
        
        weatherFactors: {
            snow: 1.8,      // Mehr Frakturen bei Schnee
            ice: 2.0,       // Glatteis = viele Frakturen
            rain: 1.2
        },
        
        seasonalFactors: {
            winter: 1.6,    // Winter = mehr Frakturen
            spring: 1.1,
            summer: 1.0,
            autumn: 1.2
        },
        
        keywords: {
            MINOR: 'RD 1',
            MODERATE: 'RD 2',
            CRITICAL: 'RD 2'
        },
        
        compositionTemplates: {
            MINOR: {
                severity: 'MINOR',
                type: 'trauma',
                modifiers: ['fracture', 'minor']
            },
            MODERATE: {
                severity: 'MODERATE',
                type: 'trauma',
                modifiers: ['fracture', 'displaced', 'pain']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'trauma',
                modifiers: ['fracture', 'open', 'multiple', 'severe_pain']
            }
        },
        
        questionCategories: ['vital_signs', 'fracture_location', 'deformity', 'mobility', 'pain'],
        requiredQuestions: ['consciousness', 'location', 'can_move', 'visible_deformity'],
        criticalSymptoms: ['open_fracture', 'severe_deformity', 'circulation_loss', 'shock'],
        
        commonConditions: {
            MINOR: ['geschlossene_fraktur', 'finger', 'zeh'],
            MODERATE: ['arm_fraktur', 'bein_fraktur', 'rippen_fraktur'],
            CRITICAL: ['offene_fraktur', 'oberschenkel_fraktur', 'beckenfraktur']
        },
        
        locations: ['wohnung', 'straße', 'sport', 'arbeitsplatz'],
        callerTypes: ['patient', 'witness', 'family', 'coach'],
        emotionVariants: ['schmerz', 'sachlich', 'besorgt']
    },
    
    // ==============================================
    // 👶 BIRTH - Geburten
    // ==============================================
    
    BIRTH: {
        id: 'BIRTH',
        name: 'Geburt',
        category: 'birth',
        organization: 'rettungsdienst',
        
        description: 'Geburt steht bevor oder ist im Gange. Spezielle Anleitung erforderlich.',
        
        weight: 2,  // Selten
        
        timeFactors: {
            night: 1.3,     // Wehen oft nachts
            morning: 1.2,
            afternoon: 1.0,
            evening: 1.1
        },
        
        weatherFactors: {
            storm: 1.2      // Wetterumschwung kann Wehen auslösen
        },
        
        seasonalFactors: {
            winter: 1.0,
            spring: 1.1,
            summer: 1.0,
            autumn: 1.0
        },
        
        keywords: {
            MODERATE: 'Geburt',
            CRITICAL: 'Geburt Notfall'
        },
        
        compositionTemplates: {
            MODERATE: {
                severity: 'MODERATE',
                type: 'medical',
                modifiers: ['birth', 'time_critical']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'medical',
                modifiers: ['birth', 'imminent', 'complications', 'time_critical']
            }
        },
        
        questionCategories: ['contractions', 'urge_to_push', 'baby_visible', 'complications', 'previous_births', 'due_date'],
        requiredQuestions: ['contractions_interval', 'urge_to_push', 'baby_visible', 'water_broken', 'bleeding'],
        criticalSymptoms: ['baby_coming_now', 'baby_visible', 'cord_around_neck', 'breech_position', 'heavy_bleeding'],
        
        commonConditions: {
            MODERATE: ['wehen_regelmäßig', 'blasensprung', 'geburt_in_1-2h'],
            CRITICAL: ['pressdrang', 'kopf_sichtbar', 'geburt_unmittelbar', 'zwillinge', 'komplikationen']
        },
        
        locations: ['wohnung', 'auto', 'öffentlich', 'arbeitsplatz'],
        callerTypes: ['spouse', 'partner', 'mother', 'family'],
        emotionVariants: ['panisch', 'aufgeregt', 'verzweifelt', 'gestresst'],
        
        specialFeatures: ['two_patients', 'instructions_critical', 'time_unpredictable', 'midwife_request']
    },
    
    // ==============================================
    // 👧 PEDIATRIC - Kindernotfälle
    // ==============================================
    
    PEDIATRIC: {
        id: 'PEDIATRIC',
        name: 'Kindernotfall',
        category: 'pediatric',
        organization: 'rettungsdienst',
        
        description: 'Notfälle bei Kindern (0-14 Jahre). Eltern oft extrem panisch.',
        
        weight: 5,  // Häufig
        
        timeFactors: {
            morning: 1.2,   // Kita, Schule
            afternoon: 1.4, // Spielen
            evening: 1.3,   // Fieberkrämpfe abends
            night: 1.1      // Fieber nachts
        },
        
        weatherFactors: {
            cold: 1.3,      // Erkältungen
            heat: 1.2       // Dehydrierung
        },
        
        seasonalFactors: {
            winter: 1.5,    // Mehr Infektionen
            spring: 1.1,
            summer: 0.9,
            autumn: 1.3     // Schulbeginn = Infektionen
        },
        
        keywords: {
            MINOR: 'Kinder 1',
            MODERATE: 'Kinder 2',
            CRITICAL: 'Kinder 3'
        },
        
        compositionTemplates: {
            MINOR: {
                severity: 'MINOR',
                type: 'medical',
                modifiers: ['pediatric']
            },
            MODERATE: {
                severity: 'MODERATE',
                type: 'medical',
                modifiers: ['pediatric', 'fever', 'respiratory']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'medical',
                modifiers: ['pediatric', 'unconscious', 'respiratory_failure', 'life_threatening']
            }
        },
        
        questionCategories: ['vital_signs_pediatric', 'symptoms', 'age_weight', 'previous_illnesses', 'fever', 'parent_observations'],
        requiredQuestions: ['child_age', 'consciousness', 'breathing', 'fever_how_high', 'skin_color'],
        criticalSymptoms: ['not_breathing', 'unconscious', 'seizure', 'blue_lips', 'extreme_lethargy'],
        
        commonConditions: {
            MINOR: ['fieber', 'bauchschmerzen', 'erbrechen', 'sturz_leicht', 'ausschlag'],
            MODERATE: ['fieberkrampf', 'pseudokrupp', 'atemnot', 'dehydrierung', 'sturz_kopf'],
            CRITICAL: ['reanimation_kind', 'bewusstlos', 'schwere_atemnot', 'anaphylaxie', 'meningitis_verdacht']
        },
        
        locations: ['wohnung', 'schule', 'kindergarten', 'spielplatz', 'öffentlich'],
        callerTypes: ['mother', 'father', 'parent', 'teacher', 'caregiver', 'witness'],
        emotionVariants: ['extreme_panik', 'verzweifelt', 'weinend', 'hilflos', 'sehr_besorgt'],
        
        specialFeatures: ['parent_panic_high', 'vital_signs_different', 'weight_based_medication', 'pediatric_hospital_preferred']
    },
    
    // ==============================================
    // 🧠 PSYCHIATRIC - Psychiatrische Notfälle
    // ==============================================
    
    PSYCHIATRIC: {
        id: 'PSYCHIATRIC',
        name: 'Psychiatrischer Notfall',
        category: 'psychiatric',
        organization: 'rettungsdienst',
        
        description: 'Psychische Krisen, Suizidversuche, Fremdgefährdung. Oft Polizei erforderlich.',
        
        weight: 4,  // Häufig
        
        timeFactors: {
            night: 1.4,     // Mehr psychische Krisen nachts
            morning: 0.9,
            afternoon: 1.0,
            evening: 1.3
        },
        
        weatherFactors: {
            storm: 1.2,     // Wetterumschwung beeinflusst Psyche
            dark: 1.3       // Dunkelheit = mehr Krisen
        },
        
        seasonalFactors: {
            winter: 1.3,    // Winterdepression
            spring: 1.0,
            summer: 0.9,
            autumn: 1.2     // Herbstdepression
        },
        
        keywords: {
            MINOR: 'Psych 1',
            MODERATE: 'Psych 2',
            CRITICAL: 'Psych 3'
        },
        
        compositionTemplates: {
            MINOR: {
                severity: 'MINOR',
                type: 'medical',
                modifiers: ['psychiatric', 'anxiety']
            },
            MODERATE: {
                severity: 'MODERATE',
                type: 'medical',
                modifiers: ['psychiatric', 'suicidal', 'crisis']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'medical',
                modifiers: ['psychiatric', 'suicide_attempt', 'violent', 'police_needed']
            }
        },
        
        questionCategories: ['mental_state', 'suicide_risk', 'aggression', 'substance_use', 'previous_episodes', 'danger_assessment'],
        requiredQuestions: ['suicidal_thoughts', 'self_harm', 'aggressive_behavior', 'under_influence', 'weapons_present'],
        criticalSymptoms: ['suicide_attempt', 'violent', 'weapon_present', 'threat_to_others'],
        
        commonConditions: {
            MINOR: ['panikattacke', 'angststörung', 'depression', 'hyperventilation'],
            MODERATE: ['suizidgedanken', 'selbstverletzung', 'psychose', 'verwirrtheit'],
            CRITICAL: ['suizidversuch', 'fremdgefährdung', 'aggressive_psychose', 'waffe_vorhanden']
        },
        
        locations: ['wohnung', 'öffentlich', 'brücke', 'bahngleise', 'hochhaus'],
        callerTypes: ['witness', 'family', 'friend', 'neighbor', 'police'],
        emotionVariants: ['besorgt', 'verständnisvoll', 'verängstigt', 'sachlich'],
        
        specialFeatures: ['police_often_needed', 'crisis_intervention', 'involuntary_commitment_possible', 'deescalation_critical', 'long_scene_time']
    },
    
    // ==============================================
    // 🌊 DROWNING - Ertrinkungsunfälle
    // ==============================================
    
    DROWNING: {
        id: 'DROWNING',
        name: 'Ertrinkungsunfall',
        category: 'drowning',
        organization: 'rettungsdienst',
        
        description: 'Person aus Wasser gerettet oder noch im Wasser. Unterkühlung beachten!',
        
        weight: 1,  // Selten
        
        timeFactors: {
            morning: 0.8,
            afternoon: 1.5, // Baden am Nachmittag
            evening: 1.2,
            night: 0.5
        },
        
        weatherFactors: {
            heat: 2.0,      // Hitze = mehr Menschen im Wasser
            cold: 0.3,      // Kälte = kaum Badende
            storm: 0.5      // Sturm = Badeverbote
        },
        
        seasonalFactors: {
            winter: 0.2,    // Fast keine Badeunfälle
            spring: 0.8,
            summer: 3.0,    // Hauptsaison!
            autumn: 0.6
        },
        
        keywords: {
            MODERATE: 'Ertrinken',
            CRITICAL: 'Ertrinken kritisch'
        },
        
        compositionTemplates: {
            MODERATE: {
                severity: 'MODERATE',
                type: 'trauma',
                modifiers: ['drowning', 'hypothermia', 'water_rescue']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'trauma',
                modifiers: ['drowning', 'unconscious', 'hypothermia', 'resuscitation', 'water_rescue']
            }
        },
        
        questionCategories: ['drowning_details', 'time_underwater', 'water_type', 'rescue_status', 'hypothermia', 'vital_signs'],
        requiredQuestions: ['still_in_water', 'time_underwater', 'consciousness', 'breathing', 'water_temperature'],
        criticalSymptoms: ['not_breathing', 'unconscious', 'blue_skin', 'very_cold', 'no_pulse'],
        
        commonConditions: {
            MODERATE: ['wasser_eingeatmet', 'hustet_wasser', 'unterkühlt', 'erschöpft'],
            CRITICAL: ['bewusstlos', 'keine_atmung', 'reanimation', 'schwere_unterkühlung']
        },
        
        locations: ['see', 'fluss', 'schwimmbad', 'meer', 'teich', 'badewanne'],
        callerTypes: ['witness', 'lifeguard', 'swimmer', 'family'],
        emotionVariants: ['panisch', 'geschockt', 'verzweifelt'],
        
        specialFeatures: ['water_rescue_needed', 'hypothermia_treatment', 'salt_vs_fresh_water', 'dlrg_coordination']
    },
    
    // ==============================================
    // 💊 POISONING - Vergiftungen
    // ==============================================
    
    POISONING: {
        id: 'POISONING',
        name: 'Vergiftung',
        category: 'poisoning',
        organization: 'rettungsdienst',
        
        description: 'Einnahme giftiger Substanzen. Giftinformationszentrum konsultieren!',
        
        weight: 3,  // Mittel-selten
        
        timeFactors: {
            morning: 1.0,
            afternoon: 1.2,
            evening: 1.3,   // Alkohol-Intoxikationen
            night: 1.1
        },
        
        weatherFactors: {},
        
        seasonalFactors: {
            winter: 1.0,
            spring: 1.1,    // Gartenarbeit = Pflanzenschutzmittel
            summer: 1.2,    // Pilze, Pflanzen
            autumn: 1.3     // Pilzsaison!
        },
        
        keywords: {
            MINOR: 'Vergiftung',
            MODERATE: 'Vergiftung schwer',
            CRITICAL: 'Vergiftung kritisch'
        },
        
        compositionTemplates: {
            MINOR: {
                severity: 'MINOR',
                type: 'medical',
                modifiers: ['poisoning', 'nausea']
            },
            MODERATE: {
                severity: 'MODERATE',
                type: 'medical',
                modifiers: ['poisoning', 'vomiting', 'altered_consciousness']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'medical',
                modifiers: ['poisoning', 'unconscious', 'seizures', 'life_threatening']
            }
        },
        
        questionCategories: ['substance_details', 'amount_ingested', 'time_of_ingestion', 'symptoms', 'vital_signs', 'container_available'],
        requiredQuestions: ['what_substance', 'how_much', 'when', 'consciousness', 'vomiting', 'packaging_available'],
        criticalSymptoms: ['unconscious', 'seizures', 'difficulty_breathing', 'severe_vomiting'],
        
        commonConditions: {
            MINOR: ['übelkeit', 'erbrechen', 'bauchschmerzen', 'leichter_schwindel'],
            MODERATE: ['bewusstseinsstörung', 'krämpfe', 'atemnot', 'starkes_erbrechen'],
            CRITICAL: ['bewusstlos', 'krampfanfall', 'atemstillstand', 'schock']
        },
        
        locations: ['wohnung', 'arbeitsplatz', 'garten', 'öffentlich'],
        callerTypes: ['parent', 'spouse', 'witness', 'patient', 'caregiver'],
        emotionVariants: ['panisch', 'verzweifelt', 'schuldgefühle', 'besorgt'],
        
        specialFeatures: ['poison_control_consultation', 'bring_container', 'do_not_induce_vomiting', 'substance_specific_treatment']
    },
    
    // ==============================================
    // 🤧 ALLERGIC - Allergische Reaktionen
    // ==============================================
    
    ALLERGIC: {
        id: 'ALLERGIC',
        name: 'Allergische Reaktion',
        category: 'allergic_reaction',
        organization: 'rettungsdienst',
        
        description: 'Allergische Reaktion bis Anaphylaxie. Zeitkritisch! Adrenalin-Pen?',
        
        weight: 3,  // Mittel-selten
        
        timeFactors: {
            morning: 1.1,
            afternoon: 1.3, // Essen, draußen
            evening: 1.2,   // Essen
            night: 0.9
        },
        
        weatherFactors: {
            heat: 1.2,      // Insektenstiche
            storm: 0.9
        },
        
        seasonalFactors: {
            winter: 0.8,
            spring: 1.5,    // Pollen!
            summer: 1.4,    // Insekten, Pollen
            autumn: 1.0
        },
        
        keywords: {
            MODERATE: 'Allergie',
            CRITICAL: 'Anaphylaxie'
        },
        
        compositionTemplates: {
            MODERATE: {
                severity: 'MODERATE',
                type: 'medical',
                modifiers: ['allergic_reaction', 'swelling', 'time_critical']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'medical',
                modifiers: ['anaphylaxis', 'respiratory_distress', 'shock', 'time_critical', 'life_threatening']
            }
        },
        
        questionCategories: ['allergen', 'reaction_severity', 'epipen_available', 'vital_signs', 'breathing', 'swelling'],
        requiredQuestions: ['what_allergen', 'breathing_difficulty', 'tongue_swelling', 'epipen_available', 'epipen_used', 'skin_reaction'],
        criticalSymptoms: ['difficulty_breathing', 'tongue_swelling', 'throat_closing', 'loss_of_consciousness', 'shock'],
        
        commonConditions: {
            MODERATE: ['hautausschlag', 'schwellung', 'juckreiz', 'leichte_atemnot'],
            CRITICAL: ['anaphylaxie', 'zungenschwellung', 'atemnot_schwer', 'kreislaufschock']
        },
        
        locations: ['restaurant', 'wohnung', 'öffentlich', 'natur', 'arbeitsplatz'],
        callerTypes: ['patient', 'companion', 'family', 'witness'],
        emotionVariants: ['panisch', 'sehr_besorgt', 'aufgeregt'],
        
        specialFeatures: ['time_critical', 'epipen_instruction', 'rapid_deterioration_possible', 'allergy_specialist_followup']
    },
    
    // ==============================================
    // 🌡️ HEAT_EMERGENCY - Hitzschlag (NEU!)
    // ==============================================
    
    HEAT_EMERGENCY: {
        id: 'HEAT_EMERGENCY',
        name: 'Hitzschlag',
        category: 'heat_emergency',
        organization: 'rettungsdienst',
        
        description: 'Hitzschlag, Hitzeerschöpfung',
        
        weight: 2,  // Selten, aber in Hitzeperioden häufig
        
        timeFactors: {
            morning: 0.8,
            afternoon: 2.0, // Hauptzeit für Hitzschlag
            evening: 1.2,
            night: 0.5
        },
        
        weatherFactors: {
            heat: 5.0,      // Bei Hitze SEHR häufig!
            extreme_heat: 10.0 // Hitzewelle = sehr viele Fälle
        },
        
        seasonalFactors: {
            winter: 0.0,    // Kein Hitzschlag im Winter
            spring: 0.5,
            summer: 5.0,    // Hauptsaison!
            autumn: 0.8
        },
        
        keywords: {
            MODERATE: 'RD 2',
            CRITICAL: 'RD 3'
        },
        
        compositionTemplates: {
            MODERATE: {
                severity: 'MODERATE',
                type: 'medical',
                modifiers: ['heat_exhaustion', 'dehydration']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'medical',
                modifiers: ['heat_stroke', 'unconscious', 'life_threatening']
            }
        },
        
        questionCategories: ['vital_signs', 'temperature', 'sun_exposure', 'hydration', 'consciousness'],
        requiredQuestions: ['consciousness', 'breathing', 'skin_condition', 'sweating', 'time_in_heat'],
        criticalSymptoms: ['unconscious', 'confusion', 'seizures', 'hot_dry_skin'],
        
        commonConditions: {
            MODERATE: ['hitzeerschöpfung', 'dehydrierung', 'schwäche'],
            CRITICAL: ['hitzschlag', 'bewusstlos', 'krampfanfall']
        },
        
        locations: ['straße', 'baustelle', 'sport', 'öffentlich', 'auto'],
        callerTypes: ['witness', 'family', 'colleague', 'passerby'],
        emotionVariants: ['besorgt', 'panisch', 'sachlich']
    },
    
    // ==============================================
    // ❄️ HYPOTHERMIA - Unterkühlung (NEU!)
    // ==============================================
    
    HYPOTHERMIA: {
        id: 'HYPOTHERMIA',
        name: 'Unterkühlung',
        category: 'hypothermia',
        organization: 'rettungsdienst',
        
        description: 'Unterkühlung, Erfrierung',
        
        weight: 2,  // Selten, aber im Winter häufiger
        
        timeFactors: {
            morning: 1.2,
            afternoon: 0.8,
            evening: 1.1,
            night: 1.5      // Nachts kälter
        },
        
        weatherFactors: {
            cold: 3.0,      // Kälte = Unterkühlung
            extreme_cold: 5.0, // Extreme Kälte = sehr häufig
            snow: 2.0,
            ice: 2.5
        },
        
        seasonalFactors: {
            winter: 5.0,    // Hauptsaison!
            spring: 1.0,
            summer: 0.2,    // Fast keine Unterkühlungen
            autumn: 1.5
        },
        
        keywords: {
            MODERATE: 'RD 2',
            CRITICAL: 'RD 3'
        },
        
        compositionTemplates: {
            MODERATE: {
                severity: 'MODERATE',
                type: 'medical',
                modifiers: ['hypothermia', 'exposure']
            },
            CRITICAL: {
                severity: 'CRITICAL',
                type: 'medical',
                modifiers: ['hypothermia', 'unconscious', 'life_threatening', 'cardiac_risk']
            }
        },
        
        questionCategories: ['vital_signs', 'temperature', 'exposure_time', 'wet_clothing', 'consciousness'],
        requiredQuestions: ['consciousness', 'breathing', 'shivering', 'time_exposed', 'wet'],
        criticalSymptoms: ['unconscious', 'not_shivering', 'rigid', 'slow_pulse'],
        
        commonConditions: {
            MODERATE: ['leichte_unterkühlung', 'zittern', 'verwirrtheit'],
            CRITICAL: ['schwere_unterkühlung', 'bewusstlos', 'herzstillstand']
        },
        
        locations: ['straße', 'wald', 'park', 'obdachlos', 'wohnung'],
        callerTypes: ['witness', 'passerby', 'family', 'neighbor'],
        emotionVariants: ['besorgt', 'sachlich', 'geschockt']
    }
};

// =========================
// HELPER FUNCTIONS
// =========================

/**
 * Gibt alle verfügbaren Incident-Types zurück
 */
function getAllIncidentTypes() {
    return Object.keys(INCIDENT_TYPES);
}

/**
 * Gibt einen Incident-Type zurück
 */
function getIncidentType(typeId) {
    return INCIDENT_TYPES[typeId] || null;
}

/**
 * Gibt Incident-Types nach Kategorie zurück
 */
function getIncidentTypesByCategory(category) {
    return Object.values(INCIDENT_TYPES).filter(t => t.category === category);
}

/**
 * 🎯 v3.0: Gewichtete Zufallsauswahl mit Tageszeit & Wetter
 */
function getRandomIncidentType(currentHour = null, weatherCondition = null, season = null) {
    const types = Object.keys(INCIDENT_TYPES);
    
    // Berechne gewichtete Wahrscheinlichkeiten
    const weights = {};
    let totalWeight = 0;
    
    types.forEach(typeId => {
        const type = INCIDENT_TYPES[typeId];
        let weight = type.weight || 1;
        
        // 🕐 Tageszeit-Faktor
        if (currentHour !== null && type.timeFactors) {
            const timeOfDay = getTimeOfDay(currentHour);
            weight *= type.timeFactors[timeOfDay] || 1.0;
        }
        
        // 🌦️ Wetter-Faktor
        if (weatherCondition && type.weatherFactors) {
            weight *= type.weatherFactors[weatherCondition] || 1.0;
        }
        
        // 📅 Saison-Faktor
        if (season && type.seasonalFactors) {
            weight *= type.seasonalFactors[season] || 1.0;
        }
        
        weights[typeId] = weight;
        totalWeight += weight;
    });
    
    // Gewichtete Zufallsauswahl
    let random = Math.random() * totalWeight;
    
    for (const typeId of types) {
        random -= weights[typeId];
        if (random <= 0) {
            return typeId;
        }
    }
    
    return types[0]; // Fallback
}

/**
 * 🕐 v3.0: Hilfsfunktion für Tageszeit
 */
function getTimeOfDay(hour) {
    if (hour >= 22 || hour < 6) return 'night';
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
}

/**
 * 📅 v3.0: Hilfsfunktion für Jahreszeit
 */
function getCurrentSeason(month) {
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
}

/**
 * Gibt Keyword für Type + Severity zurück
 */
function getKeywordForIncident(typeId, severity) {
    const type = INCIDENT_TYPES[typeId];
    if (!type || !type.keywords) return null;
    
    return type.keywords[severity] || null;
}

/**
 * v2.0: Gibt Composition Template für Type + Severity zurück
 */
function getCompositionTemplate(typeId, severity) {
    const type = INCIDENT_TYPES[typeId];
    if (!type || !type.compositionTemplates) return null;
    
    return type.compositionTemplates[severity] || null;
}

/**
 * 🎯 v3.0: Wählt zufälligen Type + Severity mit Gewichtung
 */
function getRandomIncidentComposition(currentHour = null, weatherCondition = null, season = null) {
    // Wähle Type mit Gewichtung
    const typeId = getRandomIncidentType(currentHour, weatherCondition, season);
    const type = INCIDENT_TYPES[typeId];
    
    if (!type || !type.compositionTemplates) return null;
    
    // Wähle zufällige Severity aus verfügbaren
    const availableSeverities = Object.keys(type.compositionTemplates);
    if (availableSeverities.length === 0) return null;
    
    const severity = availableSeverities[Math.floor(Math.random() * availableSeverities.length)];
    
    return {
        typeId: typeId,
        typeName: type.name,
        severity: severity,
        composition: type.compositionTemplates[severity],
        keyword: type.keywords[severity],
        weight: type.weight
    };
}

// =========================
// EXPORT
// =========================

window.INCIDENT_TYPES = INCIDENT_TYPES;
window.IncidentTypeUtils = {
    getAllIncidentTypes,
    getIncidentType,
    getIncidentTypesByCategory,
    getRandomIncidentType,
    getKeywordForIncident,
    getCompositionTemplate,
    getRandomIncidentComposition,
    getTimeOfDay,
    getCurrentSeason
};

console.log('🎭 Incident Types v3.0 geladen (MEGA UPDATE!)');
console.log(`   🎯 ${getAllIncidentTypes().length} Einsatztypen (vorher 8, jetzt 17!)`);
console.log(`   📊 ${getAllIncidentTypes().join(', ')}`);
console.log('   ⚖️ Gewichtung aktiviert');
console.log('   🕐 Tageszeit-Abhängigkeit aktiviert');
console.log('   🌦️ Wetter-Abhängigkeit aktiviert');
console.log('   📅 Saisonale Faktoren aktiviert');

// v3.0: Validierung der Composition Templates
const validationResults = Object.entries(INCIDENT_TYPES).map(([id, type]) => {
    const templatesCount = type.compositionTemplates ? Object.keys(type.compositionTemplates).length : 0;
    return `${id}: ${templatesCount} Templates, Weight: ${type.weight}`;
});
console.log('   ✅ Composition Templates:', validationResults.join(', '));