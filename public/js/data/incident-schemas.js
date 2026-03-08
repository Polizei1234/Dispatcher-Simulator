// =========================
// INCIDENT SCHEMA REGISTRY v1.0
// ZENTRALE DEFINITIONS-QUELLE FÜR ALLE EINSATZTYPEN
// =========================

/**
 * INCIDENT SCHEMAS - Das zentrale "Lexikon"
 * 
 * Jedes Schema definiert ALLE Eigenschaften eines Einsatztyps an EINER Stelle.
 * Alle Systeme (AI Generator, Escalation, Conversation, etc.) nutzen diese Schemas.
 * 
 * ARCHITEKTUR:
 * - RD 1-3: Medizinische Notfälle (egal ob Unfall, Krankheit, etc.)
 * - MANV 1-5: Massenanfall von Verletzten (mehrere Patienten)
 * - Später: B (Brand), THL (Technische Hilfe), etc.
 * 
 * VORTEILE:
 * - Single Source of Truth (keine Duplikate)
 * - Einfach zu erweitern (neue Schemas hinzufügen)
 * - Konsistent (alle Systeme nutzen gleiche Daten)
 * - Wartbar (Änderungen an einer Stelle)
 */

const INCIDENT_SCHEMAS = {
    
    // ==============================================
    // RETTUNGSDIENST - STUFE 1 (Leichte Notfälle)
    // ==============================================
    
    'RD_1': {
        // === GRUNDINFORMATIONEN ===
        id: 'RD_1',
        stichwort: 'RD 1',
        name: 'Rettungsdienst 1 - Internistischer/Leichter Notfall',
        category: 'medical',           // medical, trauma, fire, technical, police
        subcategory: 'minor',           // minor, moderate, critical
        priority: 3,                    // 1=höchste, 3=niedrigste Priorität
        organization: 'rettungsdienst', // rettungsdienst, feuerwehr, polizei
        
        description: 'Leichte medizinische Notfälle ohne akute Lebensbedrohung. Umfasst internistische Beschwerden, leichte Verletzungen, unkritische Unfälle.',
        
        // === FAHRZEUG-ANFORDERUNGEN ===
        vehicles: {
            required: [
                { type: 'RTW', count: 1, mandatory: true }
            ],
            optional: [
                { type: 'KTW', count: 1, condition: 'minor_injury_only' }
            ]
        },
        
        // === ESKALATIONS-REGELN ===
        escalation: {
            possible: true,
            canEscalateTo: ['RD_2', 'RD_3'],
            probability: 0.15,              // 15% Chance
            timeWindow: { min: 5, max: 15 }, // 5-15 Min nach Einsatzbeginn
            reasons: [
                'Zustand des Patienten hat sich verschlechtert',
                'Patient wird bewusstlos',
                'Atmung setzt aus',
                'Herzrhythmusstörungen erkannt',
                'Allergische Reaktion entwickelt sich',
                'Blutzucker entgleist'
            ]
        },
        
        // === GESPRÄCHS-RICHTLINIEN ===
        conversation: {
            initialPanicLevel: 'medium',        // low, medium, high, extreme
            allowAIDeviation: true,             // AI darf Panic-Level anpassen
            panicRange: ['low', 'medium', 'high'], // Erlaubte Werte
            
            // Welche Fragen-Kategorien sind relevant?
            questionCategories: [
                'vital_signs',      // Bewusstsein, Atmung, Kreislauf
                'symptoms',         // Symptome erfragen
                'medical_history',  // Vorerkrankungen
                'medications'       // Medikamente
            ],
            
            // Pflicht-Fragen (müssen gestellt werden)
            requiredQuestions: [
                'consciousness',    // "Ist Patient bei Bewusstsein?"
                'breathing'         // "Atmet der Patient normal?"
            ],
            
            // Kritische Symptome (erfordern sofortige Rückfragen)
            criticalSymptoms: [],
            
            // Benötigt Patient Anleitung? (z.B. stabile Seitenlage)
            instructionsNeeded: false,
            
            // Muss Anrufer am Telefon bleiben?
            phoneStayRequired: false
        },
        
        // === EINSATZDAUER ===
        duration: {
            min: 15,
            max: 30,
            aiVariance: 0.2,  // AI darf ±20% abweichen
            
            // Faktoren die Dauer beeinflussen
            modifiers: {
                night: 1.1,           // +10% nachts
                bad_weather: 1.2,     // +20% bei schlechtem Wetter
                remote_location: 1.3, // +30% abgelegener Ort
                elderly_patient: 1.15 // +15% älterer Patient
            }
        },
        
        // === TRANSPORT ===
        transport: {
            probability: 0.8,        // 80% brauchen Transport
            urgency: 'normal',       // normal, urgent, critical
            hospitalType: 'any',     // any, appropriate, specialized, trauma_center
            preNotification: false   // Klinik vorab informieren?
        },
        
        // === PATIENTEN-PROFILE ===
        patientProfiles: {
            ageRange: { min: 18, max: 85 },
            
            // Häufige Beschwerden bei RD 1
            commonConditions: [
                'bauchschmerzen',
                'übelkeit_erbrechen',
                'kopfschmerzen',
                'rückenschmerzen',
                'fieber',
                'schwindel',
                'leichte_verletzung',
                'sturz_ohne_schwere_verletzung',
                'prellung_kontusion',
                'schnittwunde',
                'nasenbluten',
                'hyperventilation'
            ],
            
            // Risikofaktoren
            riskFactors: []
        },
        
        // === SZENARIO-TEMPLATES (für AI-Variabilität) ===
        scenarioTemplates: [
            {
                condition: 'bauchschmerzen',
                callerTypes: ['patient', 'spouse', 'family'],
                emotionVariants: ['besorgt', 'sachlich', 'leicht_panisch'],
                locations: ['wohnung', 'arbeitsplatz', 'öffentlich']
            },
            {
                condition: 'sturz_leicht',
                callerTypes: ['patient', 'neighbor', 'witness'],
                emotionVariants: ['verwirrt', 'sachlich', 'hilfsbereit'],
                locations: ['wohnung', 'treppenhaus', 'gehweg']
            },
            {
                condition: 'verkehrsunfall_leicht',
                callerTypes: ['driver', 'witness', 'passenger'],
                emotionVariants: ['geschockt', 'sachlich', 'aufgeregt'],
                locations: ['stadtstraße', 'parkplatz', 'kreuzung']
            }
        ]
    },
    
    // ==============================================
    // RETTUNGSDIENST - STUFE 2 (Mittlere Notfälle)
    // ==============================================
    
    'RD_2': {
        id: 'RD_2',
        stichwort: 'RD 2',
        name: 'Rettungsdienst 2 - Schwerer internistischer Notfall',
        category: 'medical',
        subcategory: 'moderate',
        priority: 2,
        organization: 'rettungsdienst',
        
        description: 'Schwere medizinische Notfälle mit potentieller Lebensbedrohung. Notarzt erforderlich. Umfasst Herzinfarkt, Schlaganfall, schwere Atemnot, etc.',
        
        vehicles: {
            required: [
                { type: 'RTW', count: 1, mandatory: true },
                { type: 'NEF', count: 1, mandatory: true }
            ],
            optional: []
        },
        
        escalation: {
            possible: true,
            canEscalateTo: ['RD_3'],
            probability: 0.10,  // 10% Chance
            timeWindow: { min: 3, max: 10 },
            reasons: [
                'Reanimationspflichtigkeit eingetreten',
                'Kreislaufstillstand',
                'Massiver Blutverlust',
                'Bewusstseinsverlust mit Atemstillstand',
                'Schwere allergische Reaktion (Anaphylaxie)',
                'Polytrauma erkannt'
            ]
        },
        
        conversation: {
            initialPanicLevel: 'high',
            allowAIDeviation: true,
            panicRange: ['medium', 'high', 'extreme'],
            
            questionCategories: [
                'vital_signs',
                'symptoms',
                'time_critical',    // Wann begannen Symptome?
                'medical_history',
                'medications'
            ],
            
            requiredQuestions: [
                'consciousness',
                'breathing',
                'chest_pain',       // Brustschmerzen?
                'onset_time'        // Seit wann?
            ],
            
            criticalSymptoms: [
                'chest_pain',
                'difficulty_breathing',
                'stroke_signs',
                'severe_bleeding',
                'seizure'
            ],
            
            instructionsNeeded: true,  // Evt. Lagerung, Beruhigung
            phoneStayRequired: true    // Bei Bewusstsein bleiben!
        },
        
        duration: {
            min: 25,
            max: 45,
            aiVariance: 0.2,
            modifiers: {
                night: 1.1,
                bad_weather: 1.2,
                remote_location: 1.3,
                cardiac_event: 1.3,      // +30% bei Herzereignis
                stroke_suspected: 1.4    // +40% bei Schlaganfall-Verdacht
            }
        },
        
        transport: {
            probability: 0.95,  // Fast immer Transport
            urgency: 'urgent',
            hospitalType: 'appropriate', // Stroke Center, Cardiac Center, etc.
            preNotification: true        // Klinik vorbereiten!
        },
        
        patientProfiles: {
            ageRange: { min: 35, max: 90 },
            commonConditions: [
                'herzinfarkt_verdacht',
                'schlaganfall_verdacht',
                'schwere_atemnot',
                'brustschmerzen',
                'bewusstseinsstörung',
                'krampfanfall',
                'schwere_allergische_reaktion',
                'lungenembolie_verdacht',
                'aorten_dissektion_verdacht',
                'verkehrsunfall_mittelschwer',
                'sturz_mit_kopfverletzung'
            ],
            riskFactors: [
                'bluthochdruck',
                'diabetes',
                'herzerkrankung_bekannt',
                'raucher',
                'übergewicht'
            ]
        },
        
        scenarioTemplates: [
            {
                condition: 'brustschmerzen_herzinfarkt',
                callerTypes: ['spouse', 'family', 'colleague'],
                emotionVariants: ['panisch', 'sehr_besorgt', 'verzweifelt'],
                locations: ['wohnung', 'arbeitsplatz', 'restaurant']
            },
            {
                condition: 'schlaganfall_symptome',
                callerTypes: ['spouse', 'family', 'caregiver'],
                emotionVariants: ['verwirrt', 'panisch', 'hilflos'],
                locations: ['wohnung', 'pflegeheim', 'öffentlich']
            },
            {
                condition: 'verkehrsunfall_schwer',
                callerTypes: ['witness', 'driver', 'passenger'],
                emotionVariants: ['schockiert', 'panisch', 'aufgeregt'],
                locations: ['landstraße', 'autobahn', 'kreuzung']
            }
        ]
    },
    
    // ==============================================
    // RETTUNGSDIENST - STUFE 3 (Kritische Notfälle)
    // ==============================================
    
    'RD_3': {
        id: 'RD_3',
        stichwort: 'RD 3',
        name: 'Rettungsdienst 3 - Lebensbedrohlicher Notfall',
        category: 'medical',
        subcategory: 'critical',
        priority: 1,
        organization: 'rettungsdienst',
        
        description: 'Akut lebensbedrohliche Notfälle. Reanimation, schwerste Verletzungen, Polytrauma. Höchste Dringlichkeit!',
        
        vehicles: {
            required: [
                { type: 'RTW', count: 1, mandatory: true },
                { type: 'NEF', count: 1, mandatory: true }
            ],
            optional: [
                { type: 'RTW', count: 1, condition: 'multiple_patients' },
                { type: 'RTH', count: 1, condition: 'remote_or_critical' }
            ]
        },
        
        escalation: {
            possible: false,  // Bereits höchste Stufe!
            
            // Aber Komplikationen möglich
            complications: [
                {
                    event: 'cardiac_arrest',
                    probability: 0.3,
                    trigger: 'on_arrival',
                    impact: 'extended_scene_time'
                },
                {
                    event: 'additional_patient_found',
                    probability: 0.15,
                    trigger: 'after_5_minutes',
                    impact: 'request_backup'
                },
                {
                    event: 'difficult_access',
                    probability: 0.2,
                    trigger: 'on_arrival',
                    impact: 'delay_treatment'
                }
            ]
        },
        
        conversation: {
            initialPanicLevel: 'extreme',
            allowAIDeviation: false,  // Bleibt extrem!
            panicRange: ['extreme'],
            
            questionCategories: [
                'vital_signs',
                'cpr_guidance',        // Reanimations-Anleitung!
                'time_critical',
                'bystander_support'    // Gibt es Helfer?
            ],
            
            requiredQuestions: [
                'consciousness',
                'breathing',
                'pulse',
                'cpr_started'          // Läuft Reanimation?
            ],
            
            criticalSymptoms: [
                'unconscious',
                'not_breathing',
                'no_pulse',
                'severe_trauma',
                'massive_bleeding'
            ],
            
            instructionsNeeded: true,   // CPR-Anleitung MUSS gegeben werden!
            phoneStayRequired: true     // Bis RTW eintrifft!
        },
        
        duration: {
            min: 35,
            max: 90,
            aiVariance: 0.3,  // Hohe Varianz bei kritischen Fällen
            modifiers: {
                cpr_ongoing: 1.5,         // +50% bei Reanimation
                difficult_access: 1.3,
                weather_extreme: 1.2,
                multiple_patients: 1.4,
                trapped: 1.6              // +60% wenn eingeklemmt
            }
        },
        
        transport: {
            probability: 1.0,  // IMMER Transport (oder Tod)
            urgency: 'critical',
            hospitalType: 'trauma_center', // Bestmögliche Klinik!
            preNotification: true          // Schockraum-Team aktivieren!
        },
        
        patientProfiles: {
            ageRange: { min: 18, max: 95 },
            commonConditions: [
                'herzstillstand',
                'reanimation',
                'schweres_polytrauma',
                'schwerste_blutung',
                'schwerste_atemnot',
                'bewusstlos_nicht_ansprechbar',
                'schock',
                'verkehrsunfall_schwerst',
                'absturz',
                'amputation',
                'penetrierendes_trauma'
            ],
            riskFactors: [
                'herzerkrankung',
                'mehrfach_medikation',
                'hohes_alter',
                'vorheriger_herzinfarkt'
            ]
        },
        
        scenarioTemplates: [
            {
                condition: 'herzstillstand_reanimation',
                callerTypes: ['spouse', 'family', 'bystander'],
                emotionVariants: ['extreme_panik', 'weinend', 'schockiert'],
                locations: ['wohnung', 'straße', 'arbeitsplatz']
            },
            {
                condition: 'bewusstlos_keine_atmung',
                callerTypes: ['spouse', 'family', 'witness'],
                emotionVariants: ['panisch', 'verzweifelt', 'hilflos'],
                locations: ['wohnung', 'öffentlich', 'sport']
            },
            {
                condition: 'verkehrsunfall_polytrauma',
                callerTypes: ['witness', 'bystander', 'other_driver'],
                emotionVariants: ['schockiert', 'panisch', 'verzweifelt'],
                locations: ['autobahn', 'landstraße', 'kreuzung']
            }
        ]
    },
    
    // ==============================================
    // MANV 1 - Massenanfall von Verletzten (5-10 Patienten)
    // ==============================================
    
    'MANV_1': {
        id: 'MANV_1',
        stichwort: 'MANV 1',
        name: 'Massenanfall von Verletzten - Stufe 1',
        category: 'mass_casualty',
        subcategory: 'minor',
        priority: 1,
        organization: 'rettungsdienst',
        
        description: 'Kleinerer Massenanfall mit 5-10 Verletzten. Erfordert koordinierte Rettung aber keine überregionale Unterstützung.',
        
        vehicles: {
            required: [
                { type: 'RTW', count: 2, mandatory: true },
                { type: 'NEF', count: 1, mandatory: true }
            ],
            optional: [
                { type: 'RTW', count: 2, condition: 'more_injured' },
                { type: 'KTW', count: 2, condition: 'minor_injuries' },
                { type: 'ELW', count: 1, condition: 'coordination_needed' }
            ]
        },
        
        escalation: {
            possible: true,
            canEscalateTo: ['MANV_2', 'MANV_3'],
            probability: 0.25,
            timeWindow: { min: 2, max: 10 },
            reasons: [
                'Mehr Verletzte als zunächst gemeldet',
                'Schwerere Verletzungen als erwartet',
                'Weitere Gefahr erkannt (Einsturz, Explosion)',
                'Zugang erschwert - mehr Ressourcen nötig',
                'Kritisch Verletzte identifiziert'
            ]
        },
        
        conversation: {
            initialPanicLevel: 'high',
            allowAIDeviation: true,
            panicRange: ['high', 'extreme'],
            
            questionCategories: [
                'number_of_injured',
                'injury_severity',
                'incident_type',
                'hazards',
                'access'
            ],
            
            requiredQuestions: [
                'number_of_injured',
                'incident_type',
                'critical_patients',
                'safe_for_rescue'
            ],
            
            criticalSymptoms: [
                'multiple_critical',
                'ongoing_danger',
                'trapped_victims'
            ],
            
            instructionsNeeded: false,
            phoneStayRequired: true
        },
        
        duration: {
            min: 45,
            max: 120,
            aiVariance: 0.3,
            modifiers: {
                difficult_access: 1.4,
                triage_needed: 1.3,
                multiple_transports: 1.5
            }
        },
        
        transport: {
            probability: 1.0,
            urgency: 'urgent',
            hospitalType: 'multiple',  // Mehrere Kliniken!
            preNotification: true
        },
        
        patientProfiles: {
            ageRange: { min: 5, max: 90 },
            commonConditions: [
                'busunfall',
                'massenkarambolage',
                'gebäudeeinsturz_klein',
                'zugunfall',
                'explosion_klein',
                'amoklauf',
                'festivalunfall'
            ],
            riskFactors: []
        },
        
        scenarioTemplates: [
            {
                condition: 'busunfall',
                callerTypes: ['witness', 'driver', 'passenger'],
                emotionVariants: ['panisch', 'schockiert', 'verzweifelt'],
                locations: ['autobahn', 'landstraße', 'stadt']
            }
        ]
    },
    
    // ==============================================
    // MANV 2 (10-20 Patienten)
    // ==============================================
    
    'MANV_2': {
        id: 'MANV_2',
        stichwort: 'MANV 2',
        name: 'Massenanfall von Verletzten - Stufe 2',
        category: 'mass_casualty',
        subcategory: 'moderate',
        priority: 1,
        organization: 'rettungsdienst',
        
        description: 'Mittlerer Massenanfall mit 10-20 Verletzten. Erfordert Organisatorischen Leiter und koordinierte Sichtung.',
        
        vehicles: {
            required: [
                { type: 'RTW', count: 4, mandatory: true },
                { type: 'NEF', count: 2, mandatory: true },
                { type: 'ELW', count: 1, mandatory: true }
            ],
            optional: [
                { type: 'RTW', count: 3, condition: 'more_injured' },
                { type: 'KTW', count: 3, condition: 'minor_injuries' },
                { type: 'RTH', count: 1, condition: 'critical_patients' }
            ]
        },
        
        escalation: {
            possible: true,
            canEscalateTo: ['MANV_3', 'MANV_4'],
            probability: 0.20,
            timeWindow: { min: 5, max: 15 },
            reasons: [
                'Deutlich mehr Verletzte entdeckt',
                'Lage verschärft sich',
                'Sekundärereignis (Nachbeben, weitere Explosion)',
                'Zugangsprobleme größer als erwartet'
            ]
        },
        
        conversation: {
            initialPanicLevel: 'extreme',
            allowAIDeviation: false,
            panicRange: ['extreme'],
            
            questionCategories: [
                'number_of_injured',
                'injury_severity',
                'incident_type',
                'hazards',
                'access',
                'organization_needed'
            ],
            
            requiredQuestions: [
                'number_of_injured',
                'incident_type',
                'critical_patients',
                'safe_for_rescue',
                'access_routes'
            ],
            
            criticalSymptoms: [
                'many_critical',
                'ongoing_danger',
                'trapped_multiple'
            ],
            
            instructionsNeeded: false,
            phoneStayRequired: true
        },
        
        duration: {
            min: 90,
            max: 240,
            aiVariance: 0.4,
            modifiers: {
                triage_extensive: 1.5,
                difficult_terrain: 1.4,
                weather_bad: 1.3
            }
        },
        
        transport: {
            probability: 1.0,
            urgency: 'critical',
            hospitalType: 'multiple_regional',
            preNotification: true
        },
        
        patientProfiles: {
            ageRange: { min: 0, max: 95 },
            commonConditions: [
                'massenkarambolage_groß',
                'zugunglück',
                'gebäudeeinsturz',
                'explosion_mittel',
                'terroranschlag',
                'großveranstaltung_unfall'
            ],
            riskFactors: []
        },
        
        scenarioTemplates: [
            {
                condition: 'massenkarambolage',
                callerTypes: ['witness', 'involved_driver'],
                emotionVariants: ['extreme_panik', 'schockiert', 'überfordert'],
                locations: ['autobahn', 'nebel', 'glatteis']
            }
        ]
    },
    
    // ==============================================
    // MANV 3 (20-50 Patienten)
    // ==============================================
    
    'MANV_3': {
        id: 'MANV_3',
        stichwort: 'MANV 3',
        name: 'Massenanfall von Verletzten - Stufe 3',
        category: 'mass_casualty',
        subcategory: 'major',
        priority: 1,
        organization: 'rettungsdienst',
        
        description: 'Großer Massenanfall mit 20-50 Verletzten. Überregionale Unterstützung erforderlich.',
        
        vehicles: {
            required: [
                { type: 'RTW', count: 8, mandatory: true },
                { type: 'NEF', count: 3, mandatory: true },
                { type: 'ELW', count: 2, mandatory: true }
            ],
            optional: [
                { type: 'RTW', count: 10, condition: 'more_injured' },
                { type: 'KTW', count: 5, condition: 'minor_injuries' },
                { type: 'RTH', count: 2, condition: 'critical_or_remote' },
                { type: 'GW_San', count: 2, condition: 'treatment_area_needed' }
            ]
        },
        
        escalation: {
            possible: true,
            canEscalateTo: ['MANV_4', 'MANV_5'],
            probability: 0.15,
            timeWindow: { min: 10, max: 30 },
            reasons: [
                'Katastrophale Ausmaße erkennbar',
                'Über 50 Verletzte bestätigt',
                'Infrastruktur zusammengebrochen',
                'Weitere Schadensereignisse'
            ]
        },
        
        conversation: {
            initialPanicLevel: 'extreme',
            allowAIDeviation: false,
            panicRange: ['extreme'],
            
            questionCategories: [
                'incident_scale',
                'number_estimate',
                'critical_count',
                'infrastructure',
                'hazards'
            ],
            
            requiredQuestions: [
                'incident_type',
                'estimated_injured',
                'deaths_suspected',
                'access_possible',
                'ongoing_danger'
            ],
            
            criticalSymptoms: [
                'catastrophic_scale',
                'many_dead',
                'infrastructure_collapse'
            ],
            
            instructionsNeeded: false,
            phoneStayRequired: true
        },
        
        duration: {
            min: 180,
            max: 480,
            aiVariance: 0.5,
            modifiers: {
                organization_complex: 1.6,
                rescue_difficult: 1.5,
                many_critical: 1.4
            }
        },
        
        transport: {
            probability: 1.0,
            urgency: 'critical',
            hospitalType: 'regional_wide',
            preNotification: true
        },
        
        patientProfiles: {
            ageRange: { min: 0, max: 100 },
            commonConditions: [
                'zugunglück_schwer',
                'flugzeugabsturz',
                'gebäudeeinsturz_groß',
                'explosion_groß',
                'terroranschlag_groß',
                'naturkatastrophe'
            ],
            riskFactors: []
        },
        
        scenarioTemplates: [
            {
                condition: 'zugunglück',
                callerTypes: ['witness', 'passenger', 'emergency_services'],
                emotionVariants: ['schockiert', 'überfordert', 'verzweifelt'],
                locations: ['bahnstrecke', 'bahnhof', 'tunnel']
            }
        ]
    },
    
    // ==============================================
    // MANV 4 (50-100 Patienten)
    // ==============================================
    
    'MANV_4': {
        id: 'MANV_4',
        stichwort: 'MANV 4',
        name: 'Massenanfall von Verletzten - Stufe 4',
        category: 'mass_casualty',
        subcategory: 'catastrophic',
        priority: 1,
        organization: 'rettungsdienst',
        
        description: 'Katastrophaler Massenanfall mit 50-100 Verletzten. Landesweite Unterstützung erforderlich.',
        
        vehicles: {
            required: [
                { type: 'RTW', count: 15, mandatory: true },
                { type: 'NEF', count: 5, mandatory: true },
                { type: 'ELW', count: 3, mandatory: true },
                { type: 'GW_San', count: 3, mandatory: true }
            ],
            optional: [
                { type: 'RTW', count: 20, condition: 'all_available' },
                { type: 'KTW', count: 10, condition: 'all_available' },
                { type: 'RTH', count: 3, condition: 'available' }
            ]
        },
        
        escalation: {
            possible: true,
            canEscalateTo: ['MANV_5'],
            probability: 0.10,
            timeWindow: { min: 20, max: 60 },
            reasons: [
                'Über 100 Verletzte bestätigt',
                'Katastrophenalarm ausgelöst',
                'Bundesweite Hilfe erforderlich'
            ]
        },
        
        conversation: {
            initialPanicLevel: 'extreme',
            allowAIDeviation: false,
            panicRange: ['extreme'],
            
            questionCategories: [
                'catastrophe_scale',
                'mass_casualties',
                'infrastructure_status',
                'immediate_needs'
            ],
            
            requiredQuestions: [
                'incident_type',
                'estimated_scale',
                'critical_infrastructure',
                'immediate_dangers'
            ],
            
            criticalSymptoms: [
                'mass_casualties',
                'infrastructure_destroyed',
                'ongoing_catastrophe'
            ],
            
            instructionsNeeded: false,
            phoneStayRequired: true
        },
        
        duration: {
            min: 360,
            max: 720,
            aiVariance: 0.6,
            modifiers: {
                catastrophic_scale: 2.0
            }
        },
        
        transport: {
            probability: 1.0,
            urgency: 'critical',
            hospitalType: 'nationwide',
            preNotification: true
        },
        
        patientProfiles: {
            ageRange: { min: 0, max: 100 },
            commonConditions: [
                'terroranschlag_massiv',
                'flugzeugabsturz_groß',
                'erdbeben',
                'industrieunfall_katastrophal'
            ],
            riskFactors: []
        },
        
        scenarioTemplates: [
            {
                condition: 'katastrophe',
                callerTypes: ['emergency_services', 'government', 'witness'],
                emotionVariants: ['professionell_alarmiert', 'schockiert'],
                locations: ['großstadt', 'industriegebiet', 'flughafen']
            }
        ]
    },
    
    // ==============================================
    // MANV 5 (>100 Patienten)
    // ==============================================
    
    'MANV_5': {
        id: 'MANV_5',
        stichwort: 'MANV 5',
        name: 'Massenanfall von Verletzten - Stufe 5',
        category: 'mass_casualty',
        subcategory: 'catastrophic_extreme',
        priority: 1,
        organization: 'rettungsdienst',
        
        description: 'Extremer Massenanfall mit über 100 Verletzten. Nationale Katastrophe. Bundesweite Koordination.',
        
        vehicles: {
            required: [
                { type: 'RTW', count: 30, mandatory: true },
                { type: 'NEF', count: 10, mandatory: true },
                { type: 'ELW', count: 5, mandatory: true },
                { type: 'GW_San', count: 5, mandatory: true }
            ],
            optional: [
                { type: 'RTW', count: 50, condition: 'nationwide_request' },
                { type: 'KTW', count: 20, condition: 'nationwide_request' },
                { type: 'RTH', count: 5, condition: 'available' }
            ]
        },
        
        escalation: {
            possible: false,  // Höchste Stufe!
            complications: [
                {
                    event: 'infrastructure_collapse',
                    probability: 0.5,
                    trigger: 'ongoing',
                    impact: 'massive_coordination_needed'
                }
            ]
        },
        
        conversation: {
            initialPanicLevel: 'extreme',
            allowAIDeviation: false,
            panicRange: ['extreme'],
            
            questionCategories: [
                'national_catastrophe',
                'mass_scale',
                'infrastructure',
                'coordination'
            ],
            
            requiredQuestions: [
                'incident_type',
                'estimated_casualties',
                'infrastructure_status',
                'government_contacted'
            ],
            
            criticalSymptoms: [
                'national_emergency',
                'hundreds_injured',
                'system_overwhelmed'
            ],
            
            instructionsNeeded: false,
            phoneStayRequired: true
        },
        
        duration: {
            min: 720,
            max: 1440,
            aiVariance: 1.0,
            modifiers: {
                national_scale: 3.0
            }
        },
        
        transport: {
            probability: 1.0,
            urgency: 'critical',
            hospitalType: 'nationwide_international',
            preNotification: true
        },
        
        patientProfiles: {
            ageRange: { min: 0, max: 100 },
            commonConditions: [
                'terroranschlag_national',
                'naturkatastrophe_extrem',
                'industrieunfall_national',
                'kriegsereignis'
            ],
            riskFactors: []
        },
        
        scenarioTemplates: [
            {
                condition: 'nationale_katastrophe',
                callerTypes: ['government', 'emergency_coordination'],
                emotionVariants: ['professionell_kritisch'],
                locations: ['großstadt', 'region', 'land']
            }
        ]
    }
};

// =========================
// EXPORT & VALIDATION
// =========================

/**
 * Gibt alle verfügbaren Schema-IDs zurück
 */
function getAllSchemaIds() {
    return Object.keys(INCIDENT_SCHEMAS);
}

/**
 * Gibt ein Schema anhand seiner ID zurück
 */
function getSchemaById(id) {
    return INCIDENT_SCHEMAS[id] || null;
}

/**
 * Gibt alle Schemas einer bestimmten Kategorie zurück
 */
function getSchemasByCategory(category) {
    return Object.values(INCIDENT_SCHEMAS).filter(
        schema => schema.category === category
    );
}

/**
 * Gibt alle Schemas einer bestimmten Organisation zurück
 */
function getSchemasByOrganization(org) {
    return Object.values(INCIDENT_SCHEMAS).filter(
        schema => schema.organization === org
    );
}

/**
 * Gibt alle Schemas einer bestimmten Priorität zurück
 */
function getSchemasByPriority(priority) {
    return Object.values(INCIDENT_SCHEMAS).filter(
        schema => schema.priority === priority
    );
}

/**
 * Validiert ein Schema (Basis-Check)
 */
function validateSchema(schema) {
    const required = ['id', 'stichwort', 'category', 'priority', 'organization', 'vehicles'];
    const missing = required.filter(field => !schema[field]);
    
    if (missing.length > 0) {
        console.error(`❌ Schema-Validierung fehlgeschlagen! Fehlende Felder: ${missing.join(', ')}`);
        return false;
    }
    
    return true;
}

// Globaler Export
window.INCIDENT_SCHEMAS = INCIDENT_SCHEMAS;
window.SchemaUtils = {
    getAllSchemaIds,
    getSchemaById,
    getSchemasByCategory,
    getSchemasByOrganization,
    getSchemasByPriority,
    validateSchema
};

console.log('📚 Incident Schemas v1.0 geladen');
console.log(`   ✅ ${getAllSchemaIds().length} Schemas verfügbar: ${getAllSchemaIds().join(', ')}`);
console.log('   📋 Kategorien: medical (RD 1-3), mass_casualty (MANV 1-5)');
console.log('   🚑 Bereit für AI-Generator, Escalation & Conversation Systems');