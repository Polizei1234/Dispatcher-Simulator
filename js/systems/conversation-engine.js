// =========================
// CONVERSATION ENGINE v1.0
// PHASE 2 TEIL 3 - DYNAMISCHES FRAGEN-SYSTEM
// Nutzt CONVERSATION_POOLS für intelligente Gespräche
// =========================

/**
 * CONVERSATION ENGINE v1.0
 * 
 * 🆕 NEU IN v1.0:
 * - Nutzt CONVERSATION_POOLS aus Phase 1
 * - Dynamische Fragen basierend auf Incident Type
 * - Follow-Up Logik basierend auf Antworten
 * - Kritische Fragen priorisieren
 * - Antworten triggern Aktionen
 * - Integration mit bestehendem CallSystem
 * 
 * WORKFLOW:
 * 1. Incident wird erstellt mit composedSchema
 * 2. Engine initialisiert mit schema.questionCategories
 * 3. Required Questions werden als erste gestellt
 * 4. Follow-Ups basierend auf Antworten
 * 5. Kritische Antworten triggern sofortige Aktionen
 * 
 * INTEGRATION:
 * - Erweitert CallSystem (nicht ersetzt!)
 * - Nutzt existierende UI
 * - Kompatibel mit bestehenden Calls
 */

class ConversationEngine {
    constructor(incident) {
        this.incident = incident;
        this.schema = incident.composedSchema;
        this.questionQueue = [];
        this.askedQuestions = [];
        this.conversationState = {
            consciousness: null,
            breathing: null,
            criticalAnswers: []
        };
        
        console.log('💬 Conversation Engine initialisiert');
        console.log(`   Type: ${this.schema?.compositionInfo?.type || 'UNKNOWN'}`);
        
        this.initialize();
    }
    
    /**
     * Initialisiert Fragen-Queue
     */
    initialize() {
        if (!this.schema) {
            console.warn('⚠️ Kein Schema verfügbar, nutze Basis-Fragen');
            this.useBasicQuestions();
            return;
        }
        
        // Prüfe ob CONVERSATION_POOLS verfügbar
        if (!window.CONVERSATION_POOLS) {
            console.warn('⚠️ CONVERSATION_POOLS nicht geladen');
            this.useBasicQuestions();
            return;
        }
        
        console.group('📋 Initialisiere Fragen-Queue');
        
        // 1. Hole Required Questions (Priorität 1)
        if (this.schema.requiredQuestions) {
            this.schema.requiredQuestions.forEach(qId => {
                const question = this.findQuestionById(qId);
                if (question) {
                    this.questionQueue.push({
                        ...question,
                        priority: 1,
                        required: true
                    });
                    console.log(`✅ Required: ${question.question}`);
                }
            });
        }
        
        // 2. Hole Type-spezifische Fragen (Priorität 2)
        if (this.schema.questionCategories) {
            this.schema.questionCategories.forEach(category => {
                const questions = window.ConversationPoolUtils.getQuestionsByCategory(category);
                questions.forEach(q => {
                    // Verhindere Duplikate
                    if (!this.questionQueue.find(existing => existing.id === q.id)) {
                        this.questionQueue.push({
                            ...q,
                            priority: q.critical ? 2 : 3,
                            required: false
                        });
                        console.log(`💬 ${category}: ${q.question}`);
                    }
                });
            });
        }
        
        // 3. Sortiere nach Priorität
        this.questionQueue.sort((a, b) => a.priority - b.priority);
        
        console.log(`✅ ${this.questionQueue.length} Fragen in Queue`);
        console.groupEnd();
    }
    
    /**
     * Fallback: Basis-Fragen ohne Schema
     */
    useBasicQuestions() {
        this.questionQueue = [
            { id: 'location', question: 'Wo genau ist der Notfallort?', priority: 1 },
            { id: 'what_happened', question: 'Was ist genau passiert?', priority: 1 },
            { id: 'consciousness', question: 'Ist die Person bei Bewusstsein?', priority: 2 },
            { id: 'breathing', question: 'Atmet die Person normal?', priority: 2 }
        ];
    }
    
    /**
     * Findet Frage nach ID in CONVERSATION_POOLS
     */
    findQuestionById(questionId) {
        if (!window.ConversationPoolUtils) return null;
        return window.ConversationPoolUtils.getQuestionById(questionId);
    }
    
    /**
     * Gibt nächste Frage zurück
     */
    getNextQuestion() {
        // Prüfe Follow-Ups zuerst
        const followUp = this.getFollowUpQuestion();
        if (followUp) {
            console.log(`➡️ Follow-Up: ${followUp.question}`);
            return followUp;
        }
        
        // Hole nächste ungefragte Frage
        const nextQuestion = this.questionQueue.find(
            q => !this.askedQuestions.includes(q.id)
        );
        
        if (nextQuestion) {
            console.log(`❓ Nächste Frage: ${nextQuestion.question}`);
            return nextQuestion;
        }
        
        console.log('✅ Alle Fragen gestellt');
        return null;
    }
    
    /**
     * Prüft ob Follow-Up-Frage nötig
     */
    getFollowUpQuestion() {
        // Durchsuche letzte Antworten nach Follow-Up-Triggers
        const lastAnswers = this.conversationState.criticalAnswers.slice(-3);
        
        for (const answer of lastAnswers) {
            const question = this.findQuestionById(answer.questionId);
            if (question?.followUp && question.followUp[answer.value]) {
                const followUpIds = question.followUp[answer.value];
                
                for (const followUpId of followUpIds) {
                    if (!this.askedQuestions.includes(followUpId)) {
                        return this.findQuestionById(followUpId);
                    }
                }
            }
        }
        
        return null;
    }
    
    /**
     * Verarbeitet Antwort
     */
    processAnswer(questionId, answer, answerValue = null) {
        console.group(`💬 Verarbeite Antwort: ${questionId}`);
        console.log(`Antwort: ${answer}`);
        
        // Markiere als gefragt
        if (!this.askedQuestions.includes(questionId)) {
            this.askedQuestions.push(questionId);
        }
        
        // Speichere im Conversation State
        this.conversationState[questionId] = answer;
        
        // Prüfe auf kritische Antwort
        const question = this.findQuestionById(questionId);
        if (question) {
            // Finde passende answerOption
            const answerOption = question.answerOptions?.find(
                opt => opt.value === answerValue || 
                       answer.toLowerCase().includes(opt.text.toLowerCase())
            );
            
            if (answerOption) {
                console.log(`Answer Option: ${answerOption.value} (critical: ${answerOption.critical})`);
                
                if (answerOption.critical) {
                    this.conversationState.criticalAnswers.push({
                        questionId: questionId,
                        value: answerOption.value,
                        text: answer
                    });
                    
                    console.warn(`⚠️ KRITISCHE ANTWORT erkannt!`);
                    this.handleCriticalAnswer(questionId, answerOption, answer);
                }
            }
        }
        
        console.groupEnd();
    }
    
    /**
     * Behandelt kritische Antwort
     */
    handleCriticalAnswer(questionId, answerOption, answer) {
        console.warn(`🚨 Kritische Situation: ${questionId} = ${answerOption.value}`);
        
        // Spezielle Aktionen basierend auf Frage
        switch (questionId) {
            case 'consciousness':
                if (answerOption.value === 'no') {
                    console.warn('⚠️ Patient bewusstlos - Höhere Priorität!');
                    this.upgradePriority();
                    // Trigger Follow-Up: breathing, pulse
                }
                break;
                
            case 'breathing':
                if (answerOption.value === 'no') {
                    console.warn('⚠️ Keine Atmung - REANIMATION!');
                    this.triggerCPRGuidance();
                }
                break;
                
            case 'chest_pain':
                if (answerOption.value === 'yes_severe') {
                    console.warn('⚠️ Starke Brustschmerzen - Herzinfarkt-Verdacht!');
                    this.upgradePriority();
                }
                break;
                
            case 'anyone_trapped':
                if (answerOption.value === 'yes') {
                    console.warn('⚠️ Person eingeklemmt - Feuerwehr!');
                    this.addModifier('ENTRAPMENT');
                }
                break;
        }
    }
    
    /**
     * Erhöht Priorität des Einsatzes
     */
    upgradePriority() {
        if (!this.incident || !this.incident.compositionInfo) return;
        
        const currentSeverity = this.incident.compositionInfo.severity;
        let newSeverity = null;
        
        if (currentSeverity === 'MINOR') {
            newSeverity = 'MODERATE';
        } else if (currentSeverity === 'MODERATE') {
            newSeverity = 'CRITICAL';
        }
        
        if (newSeverity && window.incidentComposer) {
            console.warn(`🔺 UPGRADE: ${currentSeverity} → ${newSeverity}`);
            
            const newSchema = window.incidentComposer.compose(
                newSeverity,
                this.incident.compositionInfo.type,
                this.incident.compositionInfo.modifiers
            );
            
            if (newSchema) {
                // Update Incident
                this.incident.stichwort = newSchema.stichwort;
                this.incident.keyword = newSchema.stichwort;
                this.incident.priority = newSchema.priority;
                this.incident.compositionInfo = newSchema.compositionInfo;
                this.incident.composedSchema = newSchema;
                
                // Benachrichtige UI
                if (window.notificationSystem) {
                    window.notificationSystem.show(
                        `⚠️ Einsatz hochgestuft: ${newSchema.stichwort}`,
                        'warning'
                    );
                }
            }
        }
    }
    
    /**
     * Fügt Modifier zum Einsatz hinzu
     */
    addModifier(modifierId) {
        if (!this.incident || !this.incident.compositionInfo) return;
        
        const modifiers = this.incident.compositionInfo.modifiers;
        if (modifiers.includes(modifierId)) {
            console.log(`ℹ️ Modifier ${modifierId} bereits vorhanden`);
            return;
        }
        
        console.warn(`➕ Füge Modifier hinzu: ${modifierId}`);
        modifiers.push(modifierId);
        
        // Re-komponiere
        if (window.incidentComposer) {
            const newSchema = window.incidentComposer.compose(
                this.incident.compositionInfo.severity,
                this.incident.compositionInfo.type,
                modifiers
            );
            
            if (newSchema) {
                this.incident.composedSchema = newSchema;
                this.incident.compositionInfo = newSchema.compositionInfo;
                
                // Benachrichtige UI
                if (window.notificationSystem) {
                    const modifier = window.INCIDENT_MODIFIERS?.[modifierId];
                    window.notificationSystem.show(
                        `⚠️ ${modifier?.name || modifierId} erkannt!`,
                        'warning'
                    );
                }
            }
        }
    }
    
    /**
     * Startet Reanimations-Anleitung
     */
    triggerCPRGuidance() {
        console.warn('💔 Starte Reanimations-Anleitung');
        
        // Finde CPR-Guidance Fragen
        if (window.CONVERSATION_POOLS?.cpr_guidance) {
            const cprQuestions = window.CONVERSATION_POOLS.cpr_guidance;
            
            // Füge CPR-Fragen an den Anfang der Queue
            cprQuestions.forEach(q => {
                if (!this.askedQuestions.includes(q.id)) {
                    this.questionQueue.unshift({
                        ...q,
                        priority: 0 // Höchste Priorität!
                    });
                }
            });
            
            console.log('✅ CPR-Fragen zur Queue hinzugefügt');
        }
    }
    
    /**
     * Prüft ob Gespräch komplett
     */
    isComplete() {
        // Mindestens Required Questions müssen gestellt sein
        if (this.schema?.requiredQuestions) {
            const requiredAsked = this.schema.requiredQuestions.every(
                qId => this.askedQuestions.includes(qId)
            );
            return requiredAsked;
        }
        
        // Fallback: Mind. 3 Fragen
        return this.askedQuestions.length >= 3;
    }
    
    /**
     * Gibt Conversation State zurück
     */
    getConversationState() {
        return {
            askedQuestions: this.askedQuestions,
            answers: this.conversationState,
            complete: this.isComplete(),
            criticalAnswers: this.conversationState.criticalAnswers
        };
    }
    
    /**
     * Gibt Statistiken zurück
     */
    getStatistics() {
        return {
            totalQuestions: this.questionQueue.length,
            askedQuestions: this.askedQuestions.length,
            remainingQuestions: this.questionQueue.length - this.askedQuestions.length,
            criticalAnswers: this.conversationState.criticalAnswers.length,
            isComplete: this.isComplete()
        };
    }
}

// =========================
// INTEGRATION MIT CALLSYSTEM
// =========================

/**
 * Erweitert CallSystem mit ConversationEngine
 */
if (typeof CallSystem !== 'undefined') {
    // Speichere Original-Methoden
    const originalAnswerCall = CallSystem.answerCall;
    const originalAskPredefinedQuestion = CallSystem.askPredefinedQuestion;
    
    // 🆕 Erweitere answerCall
    CallSystem.answerCall = function() {
        originalAnswerCall.call(this);
        
        // Initialisiere ConversationEngine wenn Schema verfügbar
        if (this.activeCall?.composedSchema) {
            console.log('🆕 Initialisiere ConversationEngine für Call');
            this.conversationEngine = new ConversationEngine(this.activeCall);
        } else {
            console.log('ℹ️ Kein Schema - nutze Standard-Fragen');
            this.conversationEngine = null;
        }
    };
    
    // 🆕 Erweitere askPredefinedQuestion
    CallSystem.askPredefinedQuestion = function(key, text) {
        originalAskPredefinedQuestion.call(this, key, text);
        
        // Verarbeite Antwort in ConversationEngine
        if (this.conversationEngine && this.activeCall) {
            setTimeout(() => {
                const answer = this.activeCall.antworten[key] || 'Keine Angabe';
                this.conversationEngine.processAnswer(key, answer);
                
                // Zeige nächste empfohlene Frage (optional)
                const nextQuestion = this.conversationEngine.getNextQuestion();
                if (nextQuestion && nextQuestion.critical) {
                    console.warn(`⚠️ Nächste kritische Frage: ${nextQuestion.question}`);
                    // Optional: Auto-highlight in UI
                }
            }, 1500);
        }
    };
    
    // 🆕 Neue Helper-Funktion: Zeige empfohlene nächste Frage
    CallSystem.getRecommendedNextQuestion = function() {
        if (!this.conversationEngine) return null;
        return this.conversationEngine.getNextQuestion();
    };
    
    // 🆕 Neue Helper-Funktion: Conversation Stats
    CallSystem.getConversationStats = function() {
        if (!this.conversationEngine) return null;
        return this.conversationEngine.getStatistics();
    };
    
    console.log('✅ CallSystem erfolgreich erweitert mit ConversationEngine');
}

// Globale Instanz
window.ConversationEngine = ConversationEngine;

console.log('💬 Conversation Engine v1.0 geladen - ✅ Integration mit CallSystem!');
