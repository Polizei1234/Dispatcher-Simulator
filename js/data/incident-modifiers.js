// =========================
// INCIDENT MODIFIERS v1.0
// EINSATZ-MODIFIKATOREN
// =========================

/**
 * INCIDENT MODIFIERS
 * 
 * Definiert wiederverwendbare Modifikatoren die Einsätze verändern können.
 * Diese werden optional zu Severity + Type hinzugefügt.
 * 
 * MODIFIERS:
 * - ENTRAPMENT: Person eingeklemmt (VU, Arbeitsunfall, Einsturz)
 * - MULTI_PATIENT: Mehrere Verletzte (VU, Unfall, MANV-Vorstufe)
 * - HAZMAT: Gefahrgut vorhanden (VU, Industrieunfall)
 * - FIRE: Brand entwickelt sich (VU, Gebäude)
 * - DIFFICULT_ACCESS: Zugang erschwert (Bergung, abgelegener Ort)
 * 
 * VERWENDUNG:
 * IncidentComposer wendet Modifiers auf Basis-Incident an
 */

const INCIDENT_MODIFIERS = {
    
    // ==============================================
    // ENTRAPMENT - Person eingeklemmt
    // ==============================================
    
    ENTRAPMENT: {
        id: 'ENTRAPMENT',
        name: 'Eingeklemmt',
        description: 'Person ist eingeklemmt und muss befreit werden',
        
        // Auswirkungen
        effects: {
            // Verlängert Einsatzdauer
            durationMultiplier: 1.5,
            durationAdd: 15,  // +15 Min
            
            // Zusätzliche Fahrzeuge
            vehicleAdd: [
                // Hinweis: FW-Fahrzeuge sind Platzhalter für später!
                // { type: 'LF', count: 1 },
                // { type: 'RW', count: 1 }
            ],
            
            // Zusätzliche Fragen
            questionAdd: [
                'entrapment_details',
                'vehicle_stability',
                'visible_injuries',
                'conscious_trapped_person'
            ],
            
            // Erhöht Eskalations-Wahrscheinlichkeit
            escalationModifier: 1.3,
            
            // Erhöht Panic Level
            panicModifier: 1.2
        },
        
        // Anwendbar auf
        applicableTo: ['TRAFFIC', 'MEDICAL'],
        
        // Spezielle Features
        specialFeatures: [
            'technical_rescue_needed',
            'fire_brigade_required',
            'pain_management_critical',
            'long_scene_time'
        ],
        
        // Komplikationen
        complications: [
            {
                event: 'vehicle_unstable',
                probability: 0.2,
                impact: 'additional_stabilization_needed'
            },
            {
                event: 'patient_deteriorates',
                probability: 0.3,
                impact: 'urgent_extraction'
            }
        ]
    },
    
    // ==============================================
    // MULTI_PATIENT - Mehrere Verletzte
    // ==============================================
    
    MULTI_PATIENT: {
        id: 'MULTI_PATIENT',
        name: 'Mehrere Verletzte',
        description: 'Mehr als 2 Personen verletzt (noch kein MANV)',
        
        effects: {
            durationMultiplier: 1.3,
            durationAdd: 10,
            
            vehicleAdd: [
                { type: 'RTW', count: 1 }  // Zusätzlicher RTW
            ],
            
            questionAdd: [
                'patient_count',
                'triage_needed',
                'most_critical',
                'all_accounted_for'
            ],
            
            escalationModifier: 1.4,
            panicModifier: 1.3
        },
        
        applicableTo: ['TRAFFIC', 'MEDICAL', 'DROWNING'],
        
        specialFeatures: [
            'triage_required',
            'coordination_complex',
            'multiple_transports',
            'manv_threshold'
        ],
        
        complications: [
            {
                event: 'more_patients_found',
                probability: 0.25,
                impact: 'escalate_to_manv'
            },
            {
                event: 'critical_patient_identified',
                probability: 0.35,
                impact: 'priority_change'
            }
        ]
    },
    
    // ==============================================
    // HAZMAT - Gefahrgut
    // ==============================================
    
    HAZMAT: {
        id: 'HAZMAT',
        name: 'Gefahrgut',
        description: 'Gefährliche Stoffe ausgetreten oder beteiligt',
        
        effects: {
            durationMultiplier: 1.6,
            durationAdd: 20,
            
            vehicleAdd: [
                // Platzhalter für FW-Fahrzeuge
                // { type: 'GW_Gefahrgut', count: 1 },
                // { type: 'LF', count: 1 }
            ],
            
            questionAdd: [
                'substance_type',
                'leaking',
                'contamination',
                'safety_distance',
                'wind_direction'
            ],
            
            escalationModifier: 1.8,
            panicModifier: 1.4
        },
        
        applicableTo: ['TRAFFIC', 'MEDICAL'],
        
        specialFeatures: [
            'hazmat_team_required',
            'decontamination_needed',
            'evacuation_possible',
            'specialized_hospital',
            'safety_zones'
        ],
        
        complications: [
            {
                event: 'contamination_spreads',
                probability: 0.3,
                impact: 'evacuation_needed'
            },
            {
                event: 'substance_ignites',
                probability: 0.15,
                impact: 'fire_added'
            }
        ]
    },
    
    // ==============================================
    // FIRE - Brand
    // ==============================================
    
    FIRE: {
        id: 'FIRE',
        name: 'Brand',
        description: 'Feuer ist ausgebrochen oder droht auszubrechen',
        
        effects: {
            durationMultiplier: 1.4,
            durationAdd: 15,
            
            vehicleAdd: [
                // Platzhalter für FW
                // { type: 'LF', count: 1 },
                // { type: 'DLK', count: 1 }
            ],
            
            questionAdd: [
                'fire_size',
                'smoke',
                'people_trapped',
                'fire_spreading',
                'explosions'
            ],
            
            escalationModifier: 2.0,  // Sehr hohe Eskalations-Gefahr!
            panicModifier: 1.5
        },
        
        applicableTo: ['TRAFFIC', 'MEDICAL'],
        
        specialFeatures: [
            'fire_brigade_priority',
            'rescue_after_fire_control',
            'burn_injuries',
            'smoke_inhalation',
            'evacuation_needed'
        ],
        
        complications: [
            {
                event: 'fire_spreads_rapidly',
                probability: 0.4,
                impact: 'immediate_evacuation'
            },
            {
                event: 'explosion',
                probability: 0.2,
                impact: 'additional_casualties'
            },
            {
                event: 'structure_collapse',
                probability: 0.15,
                impact: 'rescue_impossible'
            }
        ]
    },
    
    // ==============================================
    // DIFFICULT_ACCESS - Zugang erschwert
    // ==============================================
    
    DIFFICULT_ACCESS: {
        id: 'DIFFICULT_ACCESS',
        name: 'Erschwerter Zugang',
        description: 'Einsatzort schwer erreichbar (Berg, Wald, Keller, etc.)',
        
        effects: {
            durationMultiplier: 1.4,
            durationAdd: 20,
            
            vehicleAdd: [
                // Evt. RTH
                { type: 'RTH', count: 1, condition: 'very_remote' }
            ],
            
            questionAdd: [
                'exact_location',
                'access_route',
                'terrain',
                'landmarks',
                'walking_distance'
            ],
            
            escalationModifier: 1.2,
            panicModifier: 1.1
        },
        
        applicableTo: ['MEDICAL', 'TRAFFIC', 'DROWNING', 'PSYCHIATRIC'],
        
        specialFeatures: [
            'special_equipment_needed',
            'longer_approach',
            'helicopter_consideration',
            'mountain_rescue',
            'navigation_difficult'
        ],
        
        complications: [
            {
                event: 'weather_worsens',
                probability: 0.25,
                impact: 'helicopter_impossible'
            },
            {
                event: 'wrong_location',
                probability: 0.2,
                impact: 'significant_delay'
            },
            {
                event: 'additional_hazards',
                probability: 0.15,
                impact: 'specialized_rescue_needed'
            }
        ]
    }
};

// =========================
// HELPER FUNCTIONS
// =========================

/**
 * Gibt alle verfügbaren Modifiers zurück
 */
function getAllModifiers() {
    return Object.keys(INCIDENT_MODIFIERS);
}

/**
 * Gibt einen Modifier zurück
 */
function getModifier(modifierId) {
    return INCIDENT_MODIFIERS[modifierId] || null;
}

/**
 * Gibt Modifiers die auf einen Type anwendbar sind
 */
function getApplicableModifiers(typeId) {
    return Object.values(INCIDENT_MODIFIERS).filter(m => 
        m.applicableTo.includes(typeId)
    );
}

/**
 * Wählt zufälligen Modifier (optional für bestimmten Type)
 */
function getRandomModifier(typeId = null, probability = 0.3) {
    // Prüfe ob überhaupt Modifier angewendet wird
    if (Math.random() > probability) {
        return null;
    }
    
    let candidates = Object.keys(INCIDENT_MODIFIERS);
    
    // Filter nach Type falls angegeben
    if (typeId) {
        candidates = getApplicableModifiers(typeId).map(m => m.id);
    }
    
    if (candidates.length === 0) return null;
    
    return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Wendet Modifier auf Incident-Eigenschaften an
 */
function applyModifier(incidentData, modifierId) {
    const modifier = INCIDENT_MODIFIERS[modifierId];
    if (!modifier) return incidentData;
    
    const modified = { ...incidentData };
    const effects = modifier.effects;
    
    // Dauer-Modifikation
    if (effects.durationMultiplier) {
        modified.duration = {
            min: Math.round(modified.duration.min * effects.durationMultiplier),
            max: Math.round(modified.duration.max * effects.durationMultiplier)
        };
    }
    if (effects.durationAdd) {
        modified.duration.min += effects.durationAdd;
        modified.duration.max += effects.durationAdd;
    }
    
    // Fahrzeug-Ergänzung
    if (effects.vehicleAdd && effects.vehicleAdd.length > 0) {
        modified.vehicles = modified.vehicles || { required: [], optional: [] };
        modified.vehicles.optional = [...modified.vehicles.optional, ...effects.vehicleAdd];
    }
    
    // Fragen-Ergänzung
    if (effects.questionAdd && effects.questionAdd.length > 0) {
        modified.questionCategories = [...modified.questionCategories, ...effects.questionAdd];
    }
    
    // Eskalations-Modifikation
    if (effects.escalationModifier && modified.escalation) {
        modified.escalation.probability *= effects.escalationModifier;
        // Cap bei 1.0
        modified.escalation.probability = Math.min(1.0, modified.escalation.probability);
    }
    
    // Panic-Modifikation
    if (effects.panicModifier && modified.conversation) {
        // Hier könnte man Panic-Level erhöhen
        // Z.B. 'medium' → 'high'
        modified.panicModified = true;
    }
    
    // Spezielle Features hinzufügen
    modified.specialFeatures = [
        ...(modified.specialFeatures || []),
        ...modifier.specialFeatures
    ];
    
    // Komplikationen hinzufügen
    if (modifier.complications) {
        modified.complications = [
            ...(modified.complications || []),
            ...modifier.complications
        ];
    }
    
    // Markiere welcher Modifier angewendet wurde
    modified.appliedModifiers = modified.appliedModifiers || [];
    modified.appliedModifiers.push(modifierId);
    
    return modified;
}

/**
 * Wendet mehrere Modifiers an
 */
function applyModifiers(incidentData, modifierIds) {
    let modified = { ...incidentData };
    
    for (const modifierId of modifierIds) {
        modified = applyModifier(modified, modifierId);
    }
    
    return modified;
}

// =========================
// EXPORT
// =========================

window.INCIDENT_MODIFIERS = INCIDENT_MODIFIERS;
window.ModifierUtils = {
    getAllModifiers,
    getModifier,
    getApplicableModifiers,
    getRandomModifier,
    applyModifier,
    applyModifiers
};

console.log('⚙️ Incident Modifiers v1.0 geladen');
console.log(`   ✅ ${getAllModifiers().length} Modifiers: ${getAllModifiers().join(', ')}`);
console.log('   🔧 ENTRAPMENT, MULTI_PATIENT, HAZMAT, FIRE, DIFFICULT_ACCESS');