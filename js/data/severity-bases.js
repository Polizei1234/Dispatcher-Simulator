// =========================
// SEVERITY BASES v1.0
// SCHWERGRAD-BASIS-TEMPLATES
// =========================

/**
 * SEVERITY BASES
 * 
 * Definiert die 3 Basis-Schweregrade für alle Einsatztypen.
 * Diese werden mit INCIDENT_TYPES kombiniert um vollständige Einsätze zu erstellen.
 * 
 * PHILOSOPHIE:
 * - MINOR = Leichte Einsätze, kein NEF, geringe Dringlichkeit
 * - MODERATE = Mittelschwere Einsätze, NEF erforderlich, hohe Dringlichkeit
 * - CRITICAL = Lebensbedrohliche Einsätze, maximale Ressourcen, höchste Dringlichkeit
 * 
 * VERWENDUNG:
 * IncidentComposer kombiniert Severity + Type + Modifiers = Vollständiger Einsatz
 */

const SEVERITY_BASES = {
    
    // ==============================================
    // MINOR - Leichte Einsätze
    // ==============================================
    
    MINOR: {
        name: 'Minor',
        description: 'Leichte Notfälle ohne akute Lebensbedrohung',
        
        // Basis-Eigenschaften
        priority: 3,                    // Niedrigste Priorität
        subcategory: 'minor',
        
        // Standard-Fahrzeuge
        vehicles: {
            required: [
                { type: 'RTW', count: 1, mandatory: true }
            ],
            optional: [
                { type: 'KTW', count: 1, condition: 'very_minor' }
            ]
        },
        
        // Eskalation
        escalation: {
            possible: true,
            canEscalateTo: ['MODERATE', 'CRITICAL'],
            probability: 0.15,          // 15% Chance
            timeWindow: { min: 5, max: 15 }
        },
        
        // Gesprächs-Charakteristik
        conversation: {
            initialPanicLevel: 'medium',
            allowAIDeviation: true,
            panicRange: ['low', 'medium', 'high'],
            instructionsNeeded: false,
            phoneStayRequired: false
        },
        
        // Einsatzdauer
        duration: {
            min: 15,
            max: 30,
            aiVariance: 0.2,            // ±20% Varianz
            modifiers: {
                night: 1.1,
                bad_weather: 1.2,
                remote_location: 1.3,
                elderly_patient: 1.15
            }
        },
        
        // Transport
        transport: {
            probability: 0.8,           // 80% brauchen Transport
            urgency: 'normal',
            hospitalType: 'any',
            preNotification: false
        },
        
        // Patient-Charakteristik
        patientProfile: {
            ageRange: { min: 18, max: 85 },
            criticalityLevel: 'low'
        }
    },
    
    // ==============================================
    // MODERATE - Mittelschwere Einsätze
    // ==============================================
    
    MODERATE: {
        name: 'Moderate',
        description: 'Schwere Notfälle mit potentieller Lebensbedrohung',
        
        priority: 2,
        subcategory: 'moderate',
        
        vehicles: {
            required: [
                { type: 'RTW', count: 1, mandatory: true },
                { type: 'NEF', count: 1, mandatory: true }
            ],
            optional: [
                { type: 'RTW', count: 1, condition: 'backup_needed' }
            ]
        },
        
        escalation: {
            possible: true,
            canEscalateTo: ['CRITICAL'],
            probability: 0.10,
            timeWindow: { min: 3, max: 10 }
        },
        
        conversation: {
            initialPanicLevel: 'high',
            allowAIDeviation: true,
            panicRange: ['medium', 'high', 'extreme'],
            instructionsNeeded: true,   // Oft Anleitung nötig
            phoneStayRequired: true     // Am Telefon bleiben!
        },
        
        duration: {
            min: 25,
            max: 45,
            aiVariance: 0.2,
            modifiers: {
                night: 1.1,
                bad_weather: 1.2,
                remote_location: 1.3,
                difficult_access: 1.25,
                time_critical: 1.3
            }
        },
        
        transport: {
            probability: 0.95,          // Fast immer Transport
            urgency: 'urgent',
            hospitalType: 'appropriate', // Stroke Center, Cardiac Center, etc.
            preNotification: true       // Klinik vorwarnen
        },
        
        patientProfile: {
            ageRange: { min: 35, max: 90 },
            criticalityLevel: 'moderate'
        }
    },
    
    // ==============================================
    // CRITICAL - Kritische Einsätze
    // ==============================================
    
    CRITICAL: {
        name: 'Critical',
        description: 'Akut lebensbedrohliche Notfälle mit höchster Dringlichkeit',
        
        priority: 1,                    // Höchste Priorität!
        subcategory: 'critical',
        
        vehicles: {
            required: [
                { type: 'RTW', count: 1, mandatory: true },
                { type: 'NEF', count: 1, mandatory: true }
            ],
            optional: [
                { type: 'RTW', count: 1, condition: 'multiple_patients' },
                { type: 'RTH', count: 1, condition: 'remote_or_time_critical' }
            ]
        },
        
        escalation: {
            possible: false,            // Bereits höchste Stufe!
            complications: [
                {
                    event: 'patient_deteriorates',
                    probability: 0.3,
                    trigger: 'on_arrival',
                    impact: 'extended_scene_time'
                },
                {
                    event: 'additional_complications',
                    probability: 0.2,
                    trigger: 'after_5_minutes',
                    impact: 'request_backup'
                }
            ]
        },
        
        conversation: {
            initialPanicLevel: 'extreme',
            allowAIDeviation: false,    // Bleibt extrem!
            panicRange: ['extreme'],
            instructionsNeeded: true,   // CPR, Erste Hilfe, etc.
            phoneStayRequired: true     // Unbedingt am Telefon!
        },
        
        duration: {
            min: 35,
            max: 90,
            aiVariance: 0.3,            // Hohe Varianz
            modifiers: {
                cpr_ongoing: 1.5,
                difficult_access: 1.3,
                weather_extreme: 1.2,
                multiple_patients: 1.4,
                trapped: 1.6
            }
        },
        
        transport: {
            probability: 1.0,           // IMMER Transport (oder Tod)
            urgency: 'critical',
            hospitalType: 'trauma_center', // Bestmögliche Klinik!
            preNotification: true,
            specialPrep: true           // Schockraum vorbereiten!
        },
        
        patientProfile: {
            ageRange: { min: 0, max: 100 }, // Alle Altersgruppen
            criticalityLevel: 'critical'
        }
    }
};

// =========================
// HELPER FUNCTIONS
// =========================

/**
 * Gibt alle verfügbaren Severity-Level zurück
 */
function getAllSeverityLevels() {
    return Object.keys(SEVERITY_BASES);
}

/**
 * Gibt eine Severity-Basis zurück
 */
function getSeverityBase(level) {
    return SEVERITY_BASES[level] || null;
}

/**
 * Wählt zufälligen Severity-Level (gewichtet)
 */
function getRandomSeverityLevel(weights = { MINOR: 0.5, MODERATE: 0.35, CRITICAL: 0.15 }) {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [level, weight] of Object.entries(weights)) {
        cumulative += weight;
        if (rand <= cumulative) {
            return level;
        }
    }
    
    return 'MINOR'; // Fallback
}

/**
 * Validiert Severity-Basis
 */
function validateSeverityBase(base) {
    const required = ['name', 'priority', 'vehicles', 'duration', 'transport'];
    const missing = required.filter(field => !base[field]);
    
    if (missing.length > 0) {
        console.error(`❌ Severity-Base ungültig! Fehlende Felder: ${missing.join(', ')}`);
        return false;
    }
    
    // Validiere Priority
    if (base.priority < 1 || base.priority > 3) {
        console.error('❌ Priority muss 1-3 sein');
        return false;
    }
    
    return true;
}

// =========================
// EXPORT
// =========================

window.SEVERITY_BASES = SEVERITY_BASES;
window.SeverityUtils = {
    getAllSeverityLevels,
    getSeverityBase,
    getRandomSeverityLevel,
    validateSeverityBase
};

console.log('⚖️ Severity Bases v1.0 geladen');
console.log(`   ✅ ${getAllSeverityLevels().length} Schweregrade: ${getAllSeverityLevels().join(', ')}`);
console.log('   📊 MINOR (Prio 3) → MODERATE (Prio 2) → CRITICAL (Prio 1)');