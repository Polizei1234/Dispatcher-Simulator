// =========================
// KI-MODUL & TELEFON-SYSTEM
// Groq AI Integration + Interaktives Telefon
// =========================

let currentCall = null;
let conversationHistory = [];
let aiCallCount = 0;
let lastAiCallReset = Date.now();

function showIncomingCallNotification(incident) {
    const callList = document.getElementById('call-list');
    if (!callList) return;
    
    // KEINE Details vor Anrufannahme!
    callList.innerHTML = `
        <div class="incoming-call blinking" onclick="acceptIncomingCall('${incident.id}')" style="cursor: pointer; padding: 15px; background: #dc3545; border-radius: 8px; margin: 10px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <i class="fas fa-phone-volume" style="font-size: 1.5em; margin-right: 10px;"></i>
                    <strong style="font-size: 1.1em;">EINGEHENDER NOTRUF 112</strong>
                </div>
                <button class="btn btn-success btn-small">Annehmen</button>
            </div>
            <p style="margin-top: 10px; font-size: 0.9em; color: #ffeb3b;">Unbekannter Anrufer wartet...</p>
        </div>
    `;
    
    playSound('incoming-call');
}

function acceptIncomingCall(incidentId) {
    if (game) {
        game.acceptCall(incidentId);
    }
    
    const callList = document.getElementById('call-list');
    if (callList) {
        callList.innerHTML = '<p class="no-data">Keine eingehenden Anrufe</p>';
    }
}

function showCallDialog(incident) {
    currentCall = incident;
    conversationHistory = [];
    
    const modal = document.getElementById('call-dialog');
    const conversation = document.getElementById('call-conversation');
    const responses = document.querySelector('.call-responses');
    
    conversation.innerHTML = '';
    responses.innerHTML = '';
    
    // Begrüßung durch Dispatcher
    addCallMessage('Disponent', 'Notruf 112, wo genau ist der Notfall?', 'dispatcher');
    conversationHistory.push({ role: 'assistant', content: 'Notruf 112, wo genau ist der Notfall?' });
    
    // Erste vage Meldung des Anrufers
    setTimeout(() => {
        addCallMessage('Anrufer', incident.initialMessage, 'caller');
        conversationHistory.push({ role: 'user', content: incident.initialMessage });
        showCallResponses(incident);
    }, 1000);
    
    modal.classList.add('active');
}

function addCallMessage(speaker, message, type) {
    const conversation = document.getElementById('call-conversation');
    const div = document.createElement('div');
    div.className = `call-message ${type}`;
    div.innerHTML = `<strong>${speaker}:</strong> ${message}`;
    conversation.appendChild(div);
    conversation.scrollTop = conversation.scrollHeight;
}

function showCallResponses(incident) {
    const responses = document.querySelector('.call-responses');
    responses.innerHTML = '';
    
    // Eingabefeld für eigene Nachricht
    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = 'margin-bottom: 15px;';
    inputContainer.innerHTML = `
        <input type="text" id="custom-message-input" placeholder="Eigene Nachricht eingeben..." 
            style="width: 100%; padding: 10px; border: 2px solid #2d3748; border-radius: 6px; background: #0f1419; color: white; margin-bottom: 5px;"
            onkeypress="if(event.key==='Enter') sendCustomMessage()">
        <button class="btn btn-primary btn-small" onclick="sendCustomMessage()">
            <i class="fas fa-paper-plane"></i> Senden
        </button>
    `;
    responses.appendChild(inputContainer);
    
    // Textbausteine
    const suggestions = getContextualSuggestions(incident);
    
    const suggestionContainer = document.createElement('div');
    suggestionContainer.innerHTML = '<p style="margin: 10px 0; color: #a0a0a0; font-size: 0.9em;">Textbausteine:</p>';
    responses.appendChild(suggestionContainer);
    
    suggestions.forEach(suggestion => {
        const btn = document.createElement('button');
        btn.className = 'response-btn';
        btn.textContent = suggestion;
        btn.onclick = () => askQuestion(suggestion, incident);
        responses.appendChild(btn);
    });
    
    // Einsatz erstellen Button
    if (incident.conversationState.locationKnown) {
        const createBtn = document.createElement('button');
        createBtn.className = 'btn btn-success';
        createBtn.style.marginTop = '15px';
        createBtn.innerHTML = '<i class="fas fa-check"></i> Einsatz erstellen und disponieren';
        createBtn.onclick = () => createIncidentFromCall(incident);
        responses.appendChild(createBtn);
    }
}

function getContextualSuggestions(incident) {
    const suggestions = [];
    
    if (!incident.conversationState.locationKnown) {
        suggestions.push('Wo genau befinden Sie sich?');
        suggestions.push('Können Sie mir die genaue Adresse nennen?');
    }
    
    if (!incident.conversationState.detailsKnown) {
        suggestions.push('Was ist genau passiert?');
        suggestions.push('Können Sie die Situation genauer beschreiben?');
    }
    
    if (incident.keyword.includes('RD') && !incident.conversationState.symptomsKnown) {
        suggestions.push('Ist die Person ansprechbar?');
        suggestions.push('Atmet die Person normal?');
    }
    
    if (!incident.conversationState.ageKnown) {
        suggestions.push('Wie alt ist die Person ungefähr?');
    }
    
    suggestions.push('Bleiben Sie am Telefon, Hilfe ist unterwegs.');
    
    return suggestions.slice(0, 4);
}

function sendCustomMessage() {
    const input = document.getElementById('custom-message-input');
    if (!input || !input.value.trim()) return;
    
    const message = input.value.trim();
    askQuestion(message, currentCall);
    input.value = '';
}

async function askQuestion(question, incident) {
    addCallMessage('Disponent', question, 'dispatcher');
    conversationHistory.push({ role: 'assistant', content: question });
    
    // Versuche erst einfache Pattern-Matching-Antwort
    const simpleAnswer = generateSimpleResponse(question, incident);
    
    if (simpleAnswer) {
        // Einfache Antwort gefunden
        setTimeout(() => {
            addCallMessage('Anrufer', simpleAnswer, 'caller');
            conversationHistory.push({ role: 'user', content: simpleAnswer });
            updateConversationState(question, incident);
            showCallResponses(incident);
        }, 1000 + Math.random() * 1000);
    } else {
        // Unerwartete Frage -> KI nutzen
        const aiAnswer = await generateAIResponse(question, incident);
        setTimeout(() => {
            addCallMessage('Anrufer', aiAnswer, 'caller');
            conversationHistory.push({ role: 'user', content: aiAnswer });
            showCallResponses(incident);
        }, 1500);
    }
}

function generateSimpleResponse(question, incident) {
    const q = question.toLowerCase();
    
    if (q.includes('wo') || q.includes('adresse') || q.includes('ort')) {
        return incident.actualLocation;
    }
    if (q.includes('passiert') || q.includes('situation')) {
        return incident.fullDetails.description || 'Wie ich sagte...';
    }
    if (q.includes('ansprechbar') || q.includes('bewusstsein')) {
        return incident.fullDetails.conscious ? 'Ja, die Person ist bei Bewusstsein.' : 'Nein, sie reagiert nicht!';
    }
    if (q.includes('atmet') || q.includes('atmung')) {
        return incident.fullDetails.breathing ? 'Ja, ich sehe Atmung.' : 'Ich weiß es nicht genau...';
    }
    if (q.includes('alt') || q.includes('alter')) {
        return incident.fullDetails.age || 'Schwer zu sagen, vielleicht 50?';
    }
    if (q.includes('sicherheit')) {
        return 'Ja, ich bin in Sicherheit.';
    }
    if (q.includes('bleiben') || q.includes('telefon')) {
        return 'Ja, ich bleibe hier!';
    }
    
    return null; // Keine einfache Antwort gefunden
}

async function generateAIResponse(question, incident) {
    // Rate Limiting
    const now = Date.now();
    if (now - lastAiCallReset > 60000) {
        aiCallCount = 0;
        lastAiCallReset = now;
    }
    
    if (aiCallCount >= CONFIG.MAX_AI_CALLS_PER_MINUTE) {
        return 'Entschuldigung, können Sie das wiederholen?';
    }
    
    if (!game || !game.apiKey) {
        return 'Ja... bitte schicken Sie schnell jemanden!';
    }
    
    try {
        aiCallCount++;
        
        const systemPrompt = `Du bist ein aufgeregter Notrufer in einer Notsituation (${incident.keyword}). 
Du hast bereits gemeldet: "${incident.initialMessage}"
Die Situation: ${incident.fullDetails.description || 'Notfall'}
Ort: ${incident.actualLocation}

Antworte kurz (max 2 Sätze), authentisch und leicht gestresst auf Fragen des Disponenten. Gib nur Infos die du wirklich weißt.`;
        
        const response = await fetch(CONFIG.GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${game.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: CONFIG.GROQ_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...conversationHistory.slice(-6),
                    { role: 'user', content: question }
                ],
                temperature: 0.8,
                max_tokens: 100
            })
        });
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
        
    } catch (error) {
        console.error('Groq API Fehler:', error);
        return 'Bitte beeilen Sie sich, ich habe Angst!';
    }
}

function updateConversationState(question, incident) {
    const q = question.toLowerCase();
    
    if (q.includes('wo') || q.includes('adresse') || q.includes('ort')) {
        incident.conversationState.locationKnown = true;
        incident.location = incident.actualLocation;
    }
    if (q.includes('passiert') || q.includes('situation')) {
        incident.conversationState.detailsKnown = true;
        incident.description = incident.fullDetails.description;
    }
    if (q.includes('alt')) {
        incident.conversationState.ageKnown = true;
    }
    if (q.includes('ansprechbar') || q.includes('atmet') || q.includes('verletz')) {
        incident.conversationState.symptomsKnown = true;
    }
}

function createIncidentFromCall(incident) {
    document.getElementById('call-dialog').classList.remove('active');
    
    incident.status = 'new';
    
    const check = game.checkRequiredVehicles(incident.keyword);
    
    if (!check.hasAll) {
        const missingStr = check.missing.join(', ');
        alert(`WARNUNG: Nicht alle benötigten Fahrzeuge verfügbar!\n\nFehlend: ${missingStr}\n\nEmpfohlen: ${check.required.join(', ')}`);
    }
    
    addRadioMessage('Leitstelle', `Neuer Einsatz erfasst: ${incident.keyword} - ${incident.description}`);
    updateIncidentList();
    updateMap();
    selectIncident(incident.id);
}