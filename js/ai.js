// =========================
// KI-TELEFONSYSTEM MIT GROQ
// =========================

let currentCall = null;
let conversationHistory = [];
let aiCallCount = 0;
let lastAiCallReset = Date.now();

function showIncomingCallNotification(incident) {
    const callList = document.getElementById('call-list');
    if (!callList) return;
    
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
    if (game) game.acceptCall(incidentId);
    
    const callList = document.getElementById('call-list');
    if (callList) callList.innerHTML = '<p class="no-data">Keine eingehenden Anrufe</p>';
}

function showCallDialog(incident) {
    currentCall = incident;
    conversationHistory = [];
    
    const dialog = document.getElementById('call-dialog');
    const conversation = document.getElementById('call-conversation');
    const responses = document.querySelector('.call-responses');
    
    conversation.innerHTML = '';
    responses.innerHTML = '';
    
    dialog.style.display = 'block';
    dialog.style.top = '100px';
    dialog.style.left = '100px';
    
    addCallMessage('Disponent', 'Notruf 112, wo genau ist der Notfall?', 'dispatcher');
    conversationHistory.push({ role: 'assistant', content: 'Notruf 112, wo genau ist der Notfall?' });
    
    setTimeout(() => {
        addCallMessage('Anrufer', incident.initialMessage, 'caller');
        conversationHistory.push({ role: 'user', content: incident.initialMessage });
        showCallResponses(incident);
    }, 1000);
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
    responses.innerHTML = `
        <input type="text" id="custom-message-input" placeholder="Eigene Nachricht..." 
            style="width: 100%; padding: 8px; border: 2px solid #2d3748; border-radius: 6px; background: #0f1419; color: white; margin-bottom: 10px;"
            onkeypress="if(event.key==='Enter') sendCustomMessage()">
        <button class="btn btn-primary btn-small" onclick="sendCustomMessage()" style="width: 100%; margin-bottom: 10px;">
            <i class="fas fa-paper-plane"></i> Senden
        </button>
    `;
    
    const suggestions = getContextualSuggestions(incident);
    suggestions.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'response-btn';
        btn.textContent = s;
        btn.onclick = () => askQuestion(s, incident);
        responses.appendChild(btn);
    });
    
    if (incident.conversationState.locationKnown) {
        const createBtn = document.createElement('button');
        createBtn.className = 'btn btn-success';
        createBtn.style.marginTop = '15px';
        createBtn.innerHTML = '<i class="fas fa-check"></i> Einsatz erstellen';
        createBtn.onclick = () => createIncidentFromCall(incident);
        responses.appendChild(createBtn);
    }
}

function getContextualSuggestions(incident) {
    const suggestions = [];
    
    if (!incident.conversationState.locationKnown) {
        suggestions.push('Wo genau befinden Sie sich?');
        suggestions.push('Welche Straße?');
    }
    
    if (!incident.conversationState.detailsKnown) {
        suggestions.push('Was ist passiert?');
    }
    
    if (incident.keyword.includes('RD') && !incident.conversationState.symptomsKnown) {
        suggestions.push('Ist die Person ansprechbar?');
        suggestions.push('Atmet die Person?');
    }
    
    suggestions.push('Bleiben Sie am Telefon.');
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
    
    const simpleAnswer = generateSimpleResponse(question, incident);
    
    if (simpleAnswer) {
        setTimeout(() => {
            addCallMessage('Anrufer', simpleAnswer, 'caller');
            conversationHistory.push({ role: 'user', content: simpleAnswer });
            updateConversationState(question, incident);
            showCallResponses(incident);
        }, 800);
    } else {
        const aiAnswer = await generateAIResponse(question, incident);
        setTimeout(() => {
            addCallMessage('Anrufer', aiAnswer, 'caller');
            conversationHistory.push({ role: 'user', content: aiAnswer });
            showCallResponses(incident);
        }, 1200);
    }
}

function generateSimpleResponse(question, incident) {
    const q = question.toLowerCase();
    
    if (q.includes('wo') || q.includes('adresse') || q.includes('straße')) {
        return incident.actualLocation;
    }
    if (q.includes('passiert')) {
        return incident.fullDetails.description;
    }
    if (q.includes('ansprechbar')) {
        return incident.fullDetails.conscious ? 'Ja, bei Bewusstsein.' : 'Nein, reagiert nicht!';
    }
    if (q.includes('atmet')) {
        return incident.fullDetails.breathing ? 'Ja, atmet.' : 'Keine Atmung!';
    }
    if (q.includes('alt')) {
        return incident.fullDetails.age || 'Weiß ich nicht genau...';
    }
    
    return null;
}

async function generateAIResponse(question, incident) {
    if (!game || !game.apiKey) {
        return 'Bitte schicken Sie schnell jemanden!';
    }
    
    try {
        const response = await fetch(CONFIG.GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${game.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: CONFIG.GROQ_MODEL,
                messages: [
                    { role: 'system', content: `Du bist ein aufgeregter Notrufer. Situation: ${incident.fullDetails.description}. Ort: ${incident.actualLocation}. Antworte kurz (max 2 Sätze) und leicht gestresst.` },
                    ...conversationHistory.slice(-6),
                    { role: 'user', content: question }
                ],
                temperature: 0.8,
                max_tokens: 80
            })
        });
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Groq API Fehler:', error);
        return 'Bitte beeilen Sie sich!';
    }
}

function updateConversationState(question, incident) {
    const q = question.toLowerCase();
    
    if (q.includes('wo') || q.includes('adresse') || q.includes('straße')) {
        incident.conversationState.locationKnown = true;
        incident.location = incident.actualLocation;
    }
    if (q.includes('passiert')) {
        incident.conversationState.detailsKnown = true;
        incident.description = incident.fullDetails.description;
    }
    if (q.includes('alt')) {
        incident.conversationState.ageKnown = true;
    }
    if (q.includes('ansprechbar') || q.includes('atmet')) {
        incident.conversationState.symptomsKnown = true;
    }
}

function createIncidentFromCall(incident) {
    document.getElementById('call-dialog').style.display = 'none';
    incident.status = 'new';
    
    addRadioMessage('Leitstelle', `Einsatz erfasst: ${incident.keyword}`);
    updateIncidentList();
    updateMap();
    selectIncident(incident.id);
}