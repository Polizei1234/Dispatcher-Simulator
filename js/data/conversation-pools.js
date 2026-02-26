// =========================
// CONVERSATION POOLS v1.0
// FRAGEN-DATENBANK FÜR NOTRUFE
// =========================

/**
 * CONVERSATION POOLS
 * 
 * Definiert Fragen-Pools für verschiedene Kategorien.
 * Wird vom ConversationEngine-System genutzt (Phase 2).
 * 
 * KATEGORIEN:
 * - vital_signs: Vitalzeichen (Bewusstsein, Atmung, Puls)
 * - symptoms: Symptome
 * - medical_history: Krankengeschichte
 * - accident_details: Unfalldetails
 * - time_critical: Zeitkritische Fragen
 * - cpr_guidance: Reanimations-Anleitung
 * - ... und viele mehr
 * 
 * STRUKTUR PRO FRAGE:
 * - question: Die Frage selbst
 * - answerOptions: Mögliche Antworten
 * - critical: Ist die Frage zeitkritisch?
 * - followUp: Folge-Fragen basierend auf Antwort
 */

const CONVERSATION_POOLS = {
    
    // ==============================================
    // VITAL SIGNS - Vitalzeichen
    // ==============================================
    
    vital_signs: [
        {
            id: 'consciousness',
            question: 'Ist die Person bei Bewusstsein?',
            questionVariants: [
                'Ist der Patient ansprechbar?',
                'Reagiert die Person auf Ansprache?',
                'Ist er/sie wach?'
            ],
            answerOptions: [
                { value: 'yes', text: 'Ja, ansprechbar', critical: false },
                { value: 'confused', text: 'Verwirrt/desorientiert', critical: true },
                { value: 'no', text: 'Nein, bewusstlos', critical: true }
            ],
            critical: true,
            category: 'vital',
            followUp: {
                'no': ['breathing', 'pulse']
            }
        },
        {
            id: 'breathing',
            question: 'Atmet die Person normal?',
            questionVariants: [
                'Ist die Atmung regelmäßig?',
                'Kann er/sie normal atmen?',
                'Hören Sie Atemgeräusche?'
            ],
            answerOptions: [
                { value: 'yes', text: 'Ja, normal', critical: false },
                { value: 'difficult', text: 'Atemnot/erschwert', critical: true },
                { value: 'no', text: 'Nein, keine Atmung', critical: true }
            ],
            critical: true,
            category: 'vital',
            followUp: {
                'no': ['cpr_start_immediate']
            }
        },
        {
            id: 'pulse',
            question: 'Fühlen Sie einen Puls?',
            questionVariants: [
                'Können Sie den Puls spüren?',
                'Schlägt das Herz?'
            ],
            answerOptions: [
                { value: 'yes', text: 'Ja, Puls spürbar', critical: false },
                { value: 'weak', text: 'Sehr schwach', critical: true },
                { value: 'no', text: 'Nein, kein Puls', critical: true }
            ],
            critical: true,
            category: 'vital'
        },
        {
            id: 'skin_color',
            question: 'Wie sieht die Hautfarbe aus?',
            questionVariants: [
                'Ist die Person blass?',
                'Welche Farbe hat die Haut?'
            ],
            answerOptions: [
                { value: 'normal', text: 'Normal', critical: false },
                { value: 'pale', text: 'Blass', critical: true },
                { value: 'blue', text: 'Bläulich', critical: true },
                { value: 'red', text: 'Rötlich/überhitzt', critical: false }
            ],
            critical: false,
            category: 'vital'
        }
    ],
    
    // ==============================================
    // SYMPTOMS - Symptome
    // ==============================================
    
    symptoms: [
        {
            id: 'chest_pain',
            question: 'Hat der Patient Brustschmerzen?',
            questionVariants: [
                'Tut die Brust weh?',
                'Gibt es Schmerzen im Brustbereich?'
            ],
            answerOptions: [
                { value: 'yes_severe', text: 'Ja, starke Schmerzen', critical: true },
                { value: 'yes_mild', text: 'Ja, leichte Schmerzen', critical: false },
                { value: 'no', text: 'Nein', critical: false }
            ],
            critical: true,
            category: 'cardiac',
            followUp: {
                'yes_severe': ['pain_radiating', 'onset_time']
            }
        },
        {
            id: 'pain_radiating',
            question: 'Strahlen die Schmerzen aus?',
            questionVariants: [
                'Zieht der Schmerz irgendwohin?',
                'Spürt er/sie den Schmerz auch woanders?'
            ],
            answerOptions: [
                { value: 'arm', text: 'In den Arm', critical: true },
                { value: 'jaw', text: 'In den Kiefer', critical: true },
                { value: 'back', text: 'In den Rücken', critical: true },
                { value: 'no', text: 'Nein, nur Brust', critical: false }
            ],
            critical: true,
            category: 'cardiac'
        },
        {
            id: 'difficulty_breathing',
            question: 'Hat er/sie Atemnot?',
            questionVariants: [
                'Fällt das Atmen schwer?',
                'Ist die Atmung angestrengt?'
            ],
            answerOptions: [
                { value: 'severe', text: 'Ja, sehr schwer', critical: true },
                { value: 'moderate', text: 'Ja, etwas', critical: false },
                { value: 'no', text: 'Nein', critical: false }
            ],
            critical: true,
            category: 'respiratory'
        }
    ],
    
    // ==============================================
    // TIME CRITICAL - Zeitkritische Fragen
    // ==============================================
    
    time_critical: [
        {
            id: 'onset_time',
            question: 'Seit wann bestehen die Beschwerden?',
            questionVariants: [
                'Wann hat es angefangen?',
                'Wie lange geht das schon?'
            ],
            answerOptions: [
                { value: 'minutes', text: 'Seit wenigen Minuten', critical: true },
                { value: 'hours', text: 'Seit 1-2 Stunden', critical: false },
                { value: 'longer', text: 'Länger', critical: false }
            ],
            critical: true,
            category: 'time'
        }
    ],
    
    // ==============================================
    // MEDICAL HISTORY - Krankengeschichte
    // ==============================================
    
    medical_history: [
        {
            id: 'previous_conditions',
            question: 'Gibt es Vorerkrankungen?',
            questionVariants: [
                'Ist er/sie bereits krank?',
                'Bekannte Erkrankungen?'
            ],
            answerOptions: [
                { value: 'cardiac', text: 'Herzerkrankung', critical: true },
                { value: 'diabetes', text: 'Diabetes', critical: false },
                { value: 'asthma', text: 'Asthma', critical: false },
                { value: 'none', text: 'Keine bekannt', critical: false }
            ],
            critical: false,
            category: 'history'
        },
        {
            id: 'medications',
            question: 'Nimmt er/sie Medikamente?',
            questionVariants: [
                'Werden Tabletten genommen?',
                'Regelmäßige Medikation?'
            ],
            answerOptions: [
                { value: 'yes', text: 'Ja', critical: false },
                { value: 'no', text: 'Nein', critical: false },
                { value: 'unknown', text: 'Weiß nicht', critical: false }
            ],
            critical: false,
            category: 'history'
        }
    ],
    
    // ==============================================
    // ACCIDENT DETAILS - Unfalldetails (VU)
    // ==============================================
    
    accident_details: [
        {
            id: 'vehicle_count',
            question: 'Wie viele Fahrzeuge sind beteiligt?',
            questionVariants: [
                'Wie viele Autos waren am Unfall beteiligt?',
                'Anzahl der Fahrzeuge?'
            ],
            answerOptions: [
                { value: '1', text: 'Ein Fahrzeug', critical: false },
                { value: '2', text: 'Zwei Fahrzeuge', critical: false },
                { value: '3+', text: 'Drei oder mehr', critical: true }
            ],
            critical: false,
            category: 'traffic'
        },
        {
            id: 'anyone_trapped',
            question: 'Ist jemand eingeklemmt?',
            questionVariants: [
                'Ist eine Person im Fahrzeug eingeklemmt?',
                'Kann jemand nicht raus?'
            ],
            answerOptions: [
                { value: 'yes', text: 'Ja, eingeklemmt', critical: true },
                { value: 'no', text: 'Nein', critical: false }
            ],
            critical: true,
            category: 'traffic',
            followUp: {
                'yes': ['entrapment_details']
            }
        },
        {
            id: 'traffic_blocked',
            question: 'Ist die Straße blockiert?',
            questionVariants: [
                'Kann der Verkehr noch fließen?',
                'Ist die Fahrbahn frei?'
            ],
            answerOptions: [
                { value: 'yes_total', text: 'Ja, komplett blockiert', critical: false },
                { value: 'yes_partial', text: 'Teilweise', critical: false },
                { value: 'no', text: 'Nein, frei', critical: false }
            ],
            critical: false,
            category: 'traffic'
        }
    ],
    
    // ==============================================
    // ENTRAPMENT - Eingeklemmt-Details
    // ==============================================
    
    entrapment_details: [
        {
            id: 'entrapment_location',
            question: 'Wo ist die Person eingeklemmt?',
            questionVariants: [
                'Welcher Körperteil ist eingeklemmt?'
            ],
            answerOptions: [
                { value: 'legs', text: 'Beine', critical: true },
                { value: 'chest', text: 'Brustkorb', critical: true },
                { value: 'other', text: 'Anderes', critical: false }
            ],
            critical: true,
            category: 'entrapment'
        },
        {
            id: 'vehicle_stability',
            question: 'Ist das Fahrzeug stabil?',
            questionVariants: [
                'Steht das Auto sicher?',
                'Droht das Fahrzeug zu kippen?'
            ],
            answerOptions: [
                { value: 'stable', text: 'Ja, stabil', critical: false },
                { value: 'unstable', text: 'Nein, wackelt', critical: true },
                { value: 'overturned', text: 'Auf der Seite/Dach', critical: true }
            ],
            critical: true,
            category: 'entrapment'
        }
    ],
    
    // ==============================================
    // BIRTH - Geburts-Fragen
    // ==============================================
    
    contractions: [
        {
            id: 'contractions_interval',
            question: 'Wie oft kommen die Wehen?',
            questionVariants: [
                'Wie lange sind die Abstände zwischen den Wehen?',
                'Im welchem Abstand kommen die Wehen?'
            ],
            answerOptions: [
                { value: 'under_2min', text: 'Unter 2 Minuten', critical: true },
                { value: '2_5min', text: '2-5 Minuten', critical: true },
                { value: 'over_5min', text: 'Über 5 Minuten', critical: false }
            ],
            critical: true,
            category: 'birth'
        },
        {
            id: 'urge_to_push',
            question: 'Hat sie Pressdrang?',
            questionVariants: [
                'Möchte sie pressen?',
                'Spürt sie den Drang zu pressen?'
            ],
            answerOptions: [
                { value: 'yes', text: 'Ja, starker Pressdrang', critical: true },
                { value: 'no', text: 'Nein', critical: false }
            ],
            critical: true,
            category: 'birth',
            followUp: {
                'yes': ['baby_visible']
            }
        },
        {
            id: 'baby_visible',
            question: 'Ist das Baby schon sichtbar?',
            questionVariants: [
                'Sehen Sie schon den Kopf?',
                'Ist etwas vom Baby zu sehen?'
            ],
            answerOptions: [
                { value: 'yes', text: 'Ja, Kopf sichtbar', critical: true },
                { value: 'no', text: 'Nein', critical: false }
            ],
            critical: true,
            category: 'birth'
        }
    ],
    
    // ==============================================
    // PEDIATRIC - Kinder-spezifische Fragen
    // ==============================================
    
    age_weight: [
        {
            id: 'child_age',
            question: 'Wie alt ist das Kind?',
            questionVariants: [
                'Alter des Kindes?'
            ],
            answerOptions: [
                { value: 'infant', text: 'Säugling (unter 1 Jahr)', critical: true },
                { value: 'toddler', text: 'Kleinkind (1-3 Jahre)', critical: false },
                { value: 'child', text: 'Kind (4-12 Jahre)', critical: false },
                { value: 'teen', text: 'Jugendlich (13+)', critical: false }
            ],
            critical: true,
            category: 'pediatric'
        },
        {
            id: 'fever_how_high',
            question: 'Wie hoch ist das Fieber?',
            questionVariants: [
                'Welche Temperatur wurde gemessen?'
            ],
            answerOptions: [
                { value: 'under_38', text: 'Unter 38°C', critical: false },
                { value: '38_39', text: '38-39°C', critical: false },
                { value: 'over_39', text: 'Über 39°C', critical: true },
                { value: 'unknown', text: 'Nicht gemessen', critical: false }
            ],
            critical: false,
            category: 'pediatric'
        }
    ],
    
    // ==============================================
    // CPR GUIDANCE - Reanimations-Anleitung
    // ==============================================
    
    cpr_guidance: [
        {
            id: 'cpr_start_immediate',
            question: 'Ich leite Sie jetzt zur Wiederbelebung an. Legen Sie die Person flach auf den Rücken. Sind Sie bereit?',
            questionVariants: [
                'Wir beginnen jetzt mit der Reanimation. Können Sie das machen?'
            ],
            answerOptions: [
                { value: 'yes', text: 'Ja', critical: true },
                { value: 'help_available', text: 'Jemand anders hilft', critical: false }
            ],
            critical: true,
            category: 'cpr',
            instruction: true
        }
    ],
    
    // ==============================================
    // PSYCHIATRIC - Psychiatrie-Fragen
    // ==============================================
    
    mental_state: [
        {
            id: 'suicidal_thoughts',
            question: 'Hat die Person Suizidgedanken geäußert?',
            questionVariants: [
                'Hat er/sie davon gesprochen, sich etwas anzutun?'
            ],
            answerOptions: [
                { value: 'yes_immediate', text: 'Ja, akut gefährdet', critical: true },
                { value: 'yes_past', text: 'Ja, aber nicht akut', critical: false },
                { value: 'no', text: 'Nein', critical: false }
            ],
            critical: true,
            category: 'psychiatric'
        },
        {
            id: 'aggressive_behavior',
            question: 'Ist die Person aggressiv?',
            questionVariants: [
                'Verhält er/sie sich gewalttätig?',
                'Besteht Gefahr für andere?'
            ],
            answerOptions: [
                { value: 'yes', text: 'Ja, aggressiv', critical: true },
                { value: 'verbal', text: 'Verbal aggressiv', critical: false },
                { value: 'no', text: 'Nein', critical: false }
            ],
            critical: true,
            category: 'psychiatric'
        }
    ],
    
    // ==============================================
    // POISONING - Vergiftungs-Fragen
    // ==============================================
    
    substance_details: [
        {
            id: 'what_substance',
            question: 'Was wurde eingenommen?',
            questionVariants: [
                'Welche Substanz?',
                'Was hat er/sie geschluckt?'
            ],
            answerOptions: [
                { value: 'medication', text: 'Medikamente', critical: true },
                { value: 'cleaning', text: 'Reinigungsmittel', critical: true },
                { value: 'food', text: 'Lebensmittel', critical: false },
                { value: 'unknown', text: 'Unbekannt', critical: true }
            ],
            critical: true,
            category: 'poisoning'
        },
        {
            id: 'packaging_available',
            question: 'Ist die Verpackung noch da?',
            questionVariants: [
                'Können Sie die Packung/Flasche finden?'
            ],
            answerOptions: [
                { value: 'yes', text: 'Ja', critical: false },
                { value: 'no', text: 'Nein', critical: false }
            ],
            critical: false,
            category: 'poisoning',
            instruction: 'Bewahren Sie die Verpackung auf und geben Sie sie dem Rettungsdienst!'
        }
    ],
    
    // ==============================================
    // ALLERGIC - Allergie-Fragen
    // ==============================================
    
    allergen: [
        {
            id: 'what_allergen',
            question: 'Worauf reagiert er/sie allergisch?',
            questionVariants: [
                'Was hat die Reaktion ausgelöst?'
            ],
            answerOptions: [
                { value: 'food', text: 'Nahrungsmittel', critical: false },
                { value: 'insect', text: 'Insektenstich', critical: true },
                { value: 'medication', text: 'Medikament', critical: true },
                { value: 'unknown', text: 'Unbekannt', critical: false }
            ],
            critical: false,
            category: 'allergic'
        },
        {
            id: 'epipen_available',
            question: 'Ist ein Adrenalin-Pen (EpiPen) vorhanden?',
            questionVariants: [
                'Hat er/sie einen Notfall-Pen?'
            ],
            answerOptions: [
                { value: 'yes_used', text: 'Ja, wurde bereits verwendet', critical: false },
                { value: 'yes_not_used', text: 'Ja, noch nicht verwendet', critical: true },
                { value: 'no', text: 'Nein', critical: false }
            ],
            critical: true,
            category: 'allergic',
            followUp: {
                'yes_not_used': ['epipen_instruction']
            }
        }
    ]
};

// =========================
// HELPER FUNCTIONS
// =========================

/**
 * Gibt alle Fragen einer Kategorie zurück
 */
function getQuestionsByCategory(category) {
    return CONVERSATION_POOLS[category] || [];
}

/**
 * Gibt alle verfügbaren Kategorien zurück
 */
function getAllQuestionCategories() {
    return Object.keys(CONVERSATION_POOLS);
}

/**
 * Sucht eine spezifische Frage nach ID
 */
function getQuestionById(questionId) {
    for (const category of Object.values(CONVERSATION_POOLS)) {
        const question = category.find(q => q.id === questionId);
        if (question) return question;
    }
    return null;
}

/**
 * Gibt alle kritischen Fragen zurück
 */
function getCriticalQuestions() {
    const critical = [];
    for (const category of Object.values(CONVERSATION_POOLS)) {
        critical.push(...category.filter(q => q.critical));
    }
    return critical;
}

// =========================
// EXPORT
// =========================

window.CONVERSATION_POOLS = CONVERSATION_POOLS;
window.ConversationPoolUtils = {
    getQuestionsByCategory,
    getAllQuestionCategories,
    getQuestionById,
    getCriticalQuestions
};

console.log('💬 Conversation Pools v1.0 geladen');
console.log(`   ✅ ${getAllQuestionCategories().length} Kategorien`);
const totalQuestions = Object.values(CONVERSATION_POOLS).reduce((sum, cat) => sum + cat.length, 0);
console.log(`   ❓ ${totalQuestions} Fragen verfügbar`);
console.log(`   ⚠️ ${getCriticalQuestions().length} kritische Fragen`);