// =========================
// INCIDENT TYPES v1.0
// EINSATZARTEN-DEFINITIONEN
// =========================

/**
 * INCIDENT TYPES
 * 
 * Definiert die verschiedenen Einsatzarten mit ihren spezifischen Eigenschaften.
 * Diese werden mit SEVERITY_BASES kombiniert um vollständige Einsätze zu erstellen.
 * 
 * KATEGORIEN:
 * - MEDICAL: Allgemeine medizinische Notfälle
 * - TRAFFIC: Verkehrsunfälle
 * - BIRTH: Geburten
 * - PEDIATRIC: Kindernotfälle
 * - PSYCHIATRIC: Psychiatrische Notfälle
 * - DROWNING: Ertrinkungsunfälle
 * - POISONING: Vergiftungen
 * - ALLERGIC: Allergische Reaktionen
 * 
 * VERWENDUNG:
 * IncidentComposer kombiniert Severity + Type + Modifiers = Vollständiger Einsatz
 */

const INCIDENT_TYPES = {
    
    // ==============================================
    // MEDICAL - Allgemeine medizinische Notfälle
    // ==============================================
    
    MEDICAL: {
        id: 'MEDICAL',
        name: 'Medizinischer Notfall',
        category: 'medical',
        organization: 'rettungsdienst',
        
        description: 'Allgemeine internistische oder traumatische Notfälle ohne Spezialcharakter',
        
        // Keyword-Mapping
        keywords: {
            MINOR: 'RD 1',
            MODERATE: 'RD 2',
            CRITICAL: 'RD 3'
        },
        
        // Gesprächs-spezifische Kategorien
        questionCategories: [
            'vital_signs',
            'symptoms',
            'medical_history',
            'medications',
            'onset_time'
        ],
        
        // Pflichtfragen
        requiredQuestions: [
            'consciousness',
            'breathing'
        ],
        
        // Kritische Symptome
        criticalSymptoms: [
            'unconscious',
            'not_breathing',
            'chest_pain',
            'severe_bleeding'
        ],
        
        // Häufige Beschwerden nach Schweregrad
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
                'herzinfarkt_verdacht',
                'schlaganfall_verdacht',
                'schwere_atemnot',
                'brustschmerzen',
                'bewusstseinsstörung',
                'krampfanfall',
                'lungenembolie_verdacht'
            ],
            CRITICAL: [
                'herzstillstand',
                'reanimation',
                'bewusstlos_keine_atmung',
                'schock',
                'schwerste_blutung'
            ]
        },
        
        // Typische Orte
        locations: ['wohnung', 'arbeitsplatz', 'öffentlich', 'straße', 'geschäft'],
        
        // Anrufer-Typen
        callerTypes: ['patient', 'spouse', 'family', 'colleague', 'witness', 'neighbor'],
        
        // Emotions-Varianten
        emotionVariants: ['sachlich', 'besorgt', 'panisch', 'verzweifelt', 'verwirrt']
    },
    
    // ==============================================
    // TRAFFIC - Verkehrsunfälle
    // ==============================================
    
    TRAFFIC: {
        id: 'TRAFFIC',
        name: 'Verkehrsunfall',
        category: 'traffic_accident',
        organization: 'rettungsdienst',
        
        description: 'Verkehrsunfälle mit Verletzten. Polizei wird automatisch alarmiert.',
        
        keywords: {
            MINOR: 'VU',
            MODERATE: 'VU',
            CRITICAL: 'VU P'
        },
        
        questionCategories: [
            'vital_signs',
            'accident_details',
            'vehicle_count',
            'entrapment',
            'traffic_situation',
            'hazards'
        ],
        
        requiredQuestions: [
            'consciousness',
            'breathing',
            'vehicle_count',
            'anyone_trapped',
            'traffic_blocked'
        ],
        
        criticalSymptoms: [
            'unconscious',
            'not_breathing',
            'trapped',
            'fire',
            'fuel_leaking'
        ],
        
        commonConditions: {
            MINOR: [
                'leichte_verletzung',
                'prellung',
                'schnittwunde',
                'schock_leicht'
            ],
            MODERATE: [
                'kopfverletzung',
                'fraktur_verdacht',
                'mehrere_verletzungen',
                'schock'
            ],
            CRITICAL: [
                'polytrauma',
                'eingeklemmt',
                'bewusstlos',
                'schwerste_verletzungen'
            ]
        },
        
        locations: ['stadtstraße', 'landstraße', 'autobahn', 'kreuzung', 'parkplatz'],
        
        callerTypes: ['driver', 'passenger', 'witness', 'other_driver'],
        
        emotionVariants: ['geschockt', 'panisch', 'sachlich', 'aufgeregt', 'verwirrt'],
        
        // VU-Spezifische Features
        specialFeatures: [
            'scene_safety_critical',
            'traffic_control_needed',
            'police_notification_auto'
        ]
    },
    
    // ==============================================
    // BIRTH - Geburten
    // ==============================================
    
    BIRTH: {
        id: 'BIRTH',
        name: 'Geburt',
        category: 'birth',
        organization: 'rettungsdienst',
        
        description: 'Geburt steht bevor oder ist im Gange. Spezielle Anleitung erforderlich.',
        
        keywords: {
            MODERATE: 'Geburt',
            CRITICAL: 'Geburt Notfall'
        },
        
        questionCategories: [
            'contractions',
            'urge_to_push',
            'baby_visible',
            'complications',
            'previous_births',
            'due_date'
        ],
        
        requiredQuestions: [
            'contractions_interval',
            'urge_to_push',
            'baby_visible',
            'water_broken',
            'bleeding'
        ],
        
        criticalSymptoms: [
            'baby_coming_now',
            'baby_visible',
            'cord_around_neck',
            'breech_position',
            'heavy_bleeding'
        ],
        
        commonConditions: {
            MODERATE: [
                'wehen_regelmäßig',
                'blasensprung',
                'geburt_in_1-2h'
            ],
            CRITICAL: [
                'pressdrang',
                'kopf_sichtbar',
                'geburt_unmittelbar',
                'zwillinge',
                'komplikationen'
            ]
        },
        
        locations: ['wohnung', 'auto', 'öffentlich', 'arbeitsplatz'],
        
        callerTypes: ['spouse', 'partner', 'mother', 'family'],
        
        emotionVariants: ['panisch', 'aufgeregt', 'verzweifelt', 'gestresst'],
        
        specialFeatures: [
            'two_patients',
            'instructions_critical',
            'time_unpredictable',
            'midwife_request'
        ]
    },
    
    // ==============================================
    // PEDIATRIC - Kindernotfälle
    // ==============================================
    
    PEDIATRIC: {
        id: 'PEDIATRIC',
        name: 'Kindernotfall',
        category: 'pediatric',
        organization: 'rettungsdienst',
        
        description: 'Notfälle bei Kindern (0-14 Jahre). Eltern oft extrem panisch.',
        
        keywords: {
            MINOR: 'Kinder 1',
            MODERATE: 'Kinder 2',
            CRITICAL: 'Kinder 3'
        },
        
        questionCategories: [
            'vital_signs_pediatric',
            'symptoms',
            'age_weight',
            'previous_illnesses',
            'fever',
            'parent_observations'
        ],
        
        requiredQuestions: [
            'child_age',
            'consciousness',
            'breathing',
            'fever_how_high',
            'skin_color'
        ],
        
        criticalSymptoms: [
            'not_breathing',
            'unconscious',
            'seizure',
            'blue_lips',
            'extreme_lethargy'
        ],
        
        commonConditions: {
            MINOR: [
                'fieber',
                'bauchschmerzen',
                'erbrechen',
                'sturz_leicht',
                'ausschlag'
            ],
            MODERATE: [
                'fieberkrampf',
                'pseudokrupp',
                'atemnot',
                'dehydrierung',
                'sturz_kopf'
            ],
            CRITICAL: [
                'reanimation_kind',
                'bewusstlos',
                'schwere_atemnot',
                'anaphylaxie',
                'meningitis_verdacht'
            ]
        },
        
        locations: ['wohnung', 'schule', 'kindergarten', 'spielplatz', 'öffentlich'],
        
        callerTypes: ['mother', 'father', 'parent', 'teacher', 'caregiver', 'witness'],
        
        emotionVariants: ['extreme_panik', 'verzweifelt', 'weinend', 'hilflos', 'sehr_besorgt'],
        
        specialFeatures: [
            'parent_panic_high',
            'vital_signs_different',
            'weight_based_medication',
            'pediatric_hospital_preferred'
        ]
    },
    
    // ==============================================
    // PSYCHIATRIC - Psychiatrische Notfälle
    // ==============================================
    
    PSYCHIATRIC: {
        id: 'PSYCHIATRIC',
        name: 'Psychiatrischer Notfall',
        category: 'psychiatric',
        organization: 'rettungsdienst',
        
        description: 'Psychische Krisen, Suizidversuche, Fremdgefährdung. Oft Polizei erforderlich.',
        
        keywords: {
            MINOR: 'Psych 1',
            MODERATE: 'Psych 2',
            CRITICAL: 'Psych 3'
        },
        
        questionCategories: [
            'mental_state',
            'suicide_risk',
            'aggression',
            'substance_use',
            'previous_episodes',
            'danger_assessment'
        ],
        
        requiredQuestions: [
            'suicidal_thoughts',
            'self_harm',
            'aggressive_behavior',
            'under_influence',
            'weapons_present'
        ],
        
        criticalSymptoms: [
            'suicide_attempt',
            'violent',
            'weapon_present',
            'threat_to_others'
        ],
        
        commonConditions: {
            MINOR: [
                'panikattacke',
                'angststörung',
                'depression',
                'hyperventilation'
            ],
            MODERATE: [
                'suizidgedanken',
                'selbstverletzung',
                'psychose',
                'verwirrtheit'
            ],
            CRITICAL: [
                'suizidversuch',
                'fremdgefährdung',
                'aggressive_psychose',
                'waffe_vorhanden'
            ]
        },
        
        locations: ['wohnung', 'öffentlich', 'brücke', 'bahngleise', 'hochhaus'],
        
        callerTypes: ['witness', 'family', 'friend', 'neighbor', 'police'],
        
        emotionVariants: ['besorgt', 'verständnisvoll', 'verängstigt', 'sachlich'],
        
        specialFeatures: [
            'police_often_needed',
            'crisis_intervention',
            'involuntary_commitment_possible',
            'deescalation_critical',
            'long_scene_time'
        ]
    },
    
    // ==============================================
    // DROWNING - Ertrinkungsunfälle
    // ==============================================
    
    DROWNING: {
        id: 'DROWNING',
        name: 'Ertrinkungsunfall',
        category: 'drowning',
        organization: 'rettungsdienst',
        
        description: 'Person aus Wasser gerettet oder noch im Wasser. Unterkühlung beachten!',
        
        keywords: {
            MODERATE: 'Ertrinken',
            CRITICAL: 'Ertrinken kritisch'
        },
        
        questionCategories: [
            'drowning_details',
            'time_underwater',
            'water_type',
            'rescue_status',
            'hypothermia',
            'vital_signs'
        ],
        
        requiredQuestions: [
            'still_in_water',
            'time_underwater',
            'consciousness',
            'breathing',
            'water_temperature'
        ],
        
        criticalSymptoms: [
            'not_breathing',
            'unconscious',
            'blue_skin',
            'very_cold',
            'no_pulse'
        ],
        
        commonConditions: {
            MODERATE: [
                'wasser_eingeatmet',
                'hustet_wasser',
                'unterkühlt',
                'erschöpft'
            ],
            CRITICAL: [
                'bewusstlos',
                'keine_atmung',
                'reanimation',
                'schwere_unterkühlung'
            ]
        },
        
        locations: ['see', 'fluss', 'schwimmbad', 'meer', 'teich', 'badewanne'],
        
        callerTypes: ['witness', 'lifeguard', 'swimmer', 'family'],
        
        emotionVariants: ['panisch', 'geschockt', 'verzweifelt'],
        
        specialFeatures: [
            'water_rescue_needed',
            'hypothermia_treatment',
            'salt_vs_fresh_water',
            'dlrg_coordination'
        ]
    },
    
    // ==============================================
    // POISONING - Vergiftungen
    // ==============================================
    
    POISONING: {
        id: 'POISONING',
        name: 'Vergiftung',
        category: 'poisoning',
        organization: 'rettungsdienst',
        
        description: 'Einnahme giftiger Substanzen. Giftinformationszentrum konsultieren!',
        
        keywords: {
            MINOR: 'Vergiftung',
            MODERATE: 'Vergiftung schwer',
            CRITICAL: 'Vergiftung kritisch'
        },
        
        questionCategories: [
            'substance_details',
            'amount_ingested',
            'time_of_ingestion',
            'symptoms',
            'vital_signs',
            'container_available'
        ],
        
        requiredQuestions: [
            'what_substance',
            'how_much',
            'when',
            'consciousness',
            'vomiting',
            'packaging_available'
        ],
        
        criticalSymptoms: [
            'unconscious',
            'seizures',
            'difficulty_breathing',
            'severe_vomiting'
        ],
        
        commonConditions: {
            MINOR: [
                'übelkeit',
                'erbrechen',
                'bauchschmerzen',
                'leichter_schwindel'
            ],
            MODERATE: [
                'bewusstseinsstörung',
                'krämpfe',
                'atemnot',
                'starkes_erbrechen'
            ],
            CRITICAL: [
                'bewusstlos',
                'krampfanfall',
                'atemstillstand',
                'schock'
            ]
        },
        
        locations: ['wohnung', 'arbeitsplatz', 'garten', 'öffentlich'],
        
        callerTypes: ['parent', 'spouse', 'witness', 'patient', 'caregiver'],
        
        emotionVariants: ['panisch', 'verzweifelt', 'schuldgefühle', 'besorgt'],
        
        specialFeatures: [
            'poison_control_consultation',
            'bring_container',
            'do_not_induce_vomiting',
            'substance_specific_treatment'
        ]
    },
    
    // ==============================================
    // ALLERGIC - Allergische Reaktionen
    // ==============================================
    
    ALLERGIC: {
        id: 'ALLERGIC',
        name: 'Allergische Reaktion',
        category: 'allergic_reaction',
        organization: 'rettungsdienst',
        
        description: 'Allergische Reaktion bis Anaphylaxie. Zeitkritisch! Adrenalin-Pen?',
        
        keywords: {
            MODERATE: 'Allergie',
            CRITICAL: 'Anaphylaxie'
        },
        
        questionCategories: [
            'allergen',
            'reaction_severity',
            'epipen_available',
            'vital_signs',
            'breathing',
            'swelling'
        ],
        
        requiredQuestions: [
            'what_allergen',
            'breathing_difficulty',
            'tongue_swelling',
            'epipen_available',
            'epipen_used',
            'skin_reaction'
        ],
        
        criticalSymptoms: [
            'difficulty_breathing',
            'tongue_swelling',
            'throat_closing',
            'loss_of_consciousness',
            'shock'
        ],
        
        commonConditions: {
            MODERATE: [
                'hautausschlag',
                'schwellung',
                'juckreiz',
                'leichte_atemnot'
            ],
            CRITICAL: [
                'anaphylaxie',
                'zungenschwellung',
                'atemnot_schwer',
                'kreislaufschock'
            ]
        },
        
        locations: ['restaurant', 'wohnung', 'öffentlich', 'natur', 'arbeitsplatz'],
        
        callerTypes: ['patient', 'companion', 'family', 'witness'],
        
        emotionVariants: ['panisch', 'sehr_besorgt', 'aufgeregt'],
        
        specialFeatures: [
            'time_critical',
            'epipen_instruction',
            'rapid_deterioration_possible',
            'allergy_specialist_followup'
        ]
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
 * Wählt zufälligen Incident-Type (optional gewichtet)
 */
function getRandomIncidentType(weights = null) {
    const types = Object.keys(INCIDENT_TYPES);
    
    if (!weights) {
        // Gleichverteilt
        return types[Math.floor(Math.random() * types.length)];
    }
    
    // Gewichtet
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [type, weight] of Object.entries(weights)) {
        cumulative += weight;
        if (rand <= cumulative) {
            return type;
        }
    }
    
    return types[0]; // Fallback
}

/**
 * Gibt Keyword für Type + Severity zurück
 */
function getKeywordForIncident(typeId, severity) {
    const type = INCIDENT_TYPES[typeId];
    if (!type || !type.keywords) return null;
    
    return type.keywords[severity] || null;
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
    getKeywordForIncident
};

console.log('🎭 Incident Types v1.0 geladen');
console.log(`   ✅ ${getAllIncidentTypes().length} Einsatzarten: ${getAllIncidentTypes().join(', ')}`);
console.log('   📊 MEDICAL, TRAFFIC, BIRTH, PEDIATRIC, PSYCHIATRIC, DROWNING, POISONING, ALLERGIC');