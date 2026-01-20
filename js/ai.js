class AIManager {
    constructor(game) {
        this.game = game;
        this.apiKey = ''; // Will be set by user
        this.currentConversation = [];
    }

    async startPhoneCall(incident) {
        this.currentConversation = [];
        
        // Generate caller persona and situation
        const callerInfo = await this.generateCallerPersona(incident);
        
        this.game.showModal('phone-modal');
        this.setupPhoneInterface(incident, callerInfo);
        
        // Initial caller message
        const initialMessage = await this.generateCallerMessage(incident, callerInfo, 'initial');
        this.addConversationMessage(initialMessage, 'caller');
    }

    async generateCallerPersona(incident) {
        // Simplified version - in production use Perplexity API
        const personas = [
            { name: 'Max Mustermann', age: 45, emotion: 'panicked', relationship: 'self' },
            { name: 'Anna Schmidt', age: 32, emotion: 'worried', relationship: 'bystander' },
            { name: 'Hans Müller', age: 67, emotion: 'calm', relationship: 'patient' }
        ];
        
        return personas[Math.floor(Math.random() * personas.length)];
    }

    async generateCallerMessage(incident, callerInfo, context) {
        if (!this.apiKey) {
            // Fallback to template-based responses
            return this.getTemplateResponse(incident, callerInfo, context);
        }

        try {
            const prompt = this.buildPrompt(incident, callerInfo, context);
            const response = await this.callPerplexityAPI(prompt);
            return response;
        } catch (error) {
            console.error('AI API Error:', error);
            return this.getTemplateResponse(incident, callerInfo, context);
        }
    }

    getTemplateResponse(incident, callerInfo, context) {
        const templates = {
            'initial': [
                `Hallo, hier spricht ${callerInfo.name}. Es ist ein Notfall! ${incident.description}`,
                `Schnell, bitte helfen Sie! ${incident.description}`,
                `Guten Tag, ich brauche dringend Hilfe. ${incident.description}`
            ],
            'location': [
                `Wir sind in ${incident.location}.`,
                `Der Einsatzort ist ${incident.location}.`
            ],
            'patient': [
                `Die Person ist bei Bewusstsein und hat Schmerzen.`,
                `Der Patient ist ansprechbar aber verletzt.`,
                `Es geht der Person nicht gut.`
            ],
            'details': [
                `Ich glaube es ist ernst. Bitte kommen Sie schnell!`,
                `Die Situation ist kritisch!`,
                `Wir brauchen sofort Hilfe!`
            ]
        };

        const options = templates[context] || templates['details'];
        return options[Math.floor(Math.random() * options.length)];
    }

    buildPrompt(incident, callerInfo, context) {
        return `Du bist ${callerInfo.name}, ${callerInfo.age} Jahre alt, und rufst gerade beim Notruf an.
        
Einsatzsituation: ${incident.description}
Ort: ${incident.location}
Deine Emotion: ${callerInfo.emotion}
Deine Rolle: ${callerInfo.relationship}

Kontext der Frage: ${context}

Antworte als diese Person in 1-2 kurzen, realistischen Sätzen auf Deutsch. Sei ${callerInfo.emotion}.`;
    }

    async callPerplexityAPI(prompt) {
        if (!this.apiKey) {
            throw new Error('No API key set');
        }

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'sonar',
                messages: [
                    { role: 'system', content: 'Du bist ein realistischer Notrufer in einer Notfallsituation.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 150,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    setupPhoneInterface(incident, callerInfo) {
        const container = document.getElementById('phone-conversation');
        container.innerHTML = '';

        const quickResponses = [
            { text: 'Wo genau ist der Einsatzort?', context: 'location' },
            { text: 'Was ist genau passiert?', context: 'details' },
            { text: 'Wie geht es der betroffenen Person?', context: 'patient' },
            { text: 'Ist die Person ansprechbar?', context: 'consciousness' },
            { text: 'Wie viele Personen sind betroffen?', context: 'count' },
            { text: 'Gespräch beenden', context: 'end' }
        ];

        const buttonsContainer = document.getElementById('quick-response-buttons');
        buttonsContainer.innerHTML = quickResponses.map(response => `
            <button onclick="game.aiManager.handleQuickResponse('${response.context}', '${response.text}', '${incident.id}')">
                ${response.text}
            </button>
        `).join('');
    }

    async handleQuickResponse(context, questionText, incidentId) {
        const incident = this.game.incidents.find(i => i.id === incidentId);
        if (!incident) return;

        // Add dispatcher question
        this.addConversationMessage(questionText, 'dispatcher');
        this.game.addPhoneMessage(questionText, 'dispatcher');

        if (context === 'end') {
            this.endPhoneCall(incident);
            return;
        }

        // Generate and add caller response
        const callerInfo = { name: 'Anrufer', age: 30, emotion: 'worried', relationship: 'bystander' };
        const response = await this.generateCallerMessage(incident, callerInfo, context);
        
        setTimeout(() => {
            this.addConversationMessage(response, 'caller');
            this.game.addPhoneMessage(response, 'caller');
        }, 1000);
    }

    addConversationMessage(text, sender) {
        const container = document.getElementById('phone-conversation');
        const messageDiv = document.createElement('div');
        messageDiv.className = `conversation-message ${sender}`;
        messageDiv.textContent = text;
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;

        this.currentConversation.push({ sender, text, time: Date.now() });
    }

    endPhoneCall(incident) {
        this.addConversationMessage('Gespräch beendet. Hilfe ist unterwegs!', 'system');
        this.game.addLogMessage(`Notrufgespräch beendet - ${incident.keyword} - ${incident.location}`);
        
        setTimeout(() => {
            this.game.closeAllModals();
            this.game.showDispatchModal(incident);
        }, 1500);
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('perplexity_api_key', key);
    }

    loadApiKey() {
        const stored = localStorage.getItem('perplexity_api_key');
        if (stored) {
            this.apiKey = stored;
        }
    }
}

export { AIManager };