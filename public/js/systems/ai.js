// =========================
// KI-TELEFONSYSTEM MIT GROQ v2.0
// + ✅ Phase 3 FINAL: Natürliche emotionale Dialoge
// + Anrufer reagiert auf ALLE Aussagen
// + Emotionale Zustände (Panik, Angst, Beruhigung)
// + Realistische Gesprächsführung
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
    
    // ✅ Initiale Emotionszustände
    incident.emotionalState = incident.emotionalState || {
        panic: 8,        // 1-10, wie panisch ist der Anrufer
        calmness: 2,     // 1-10, wie ruhig ist der Anrufer
        cooperation: 7,  // 1-10, wie kooperativ ist der Anrufer
        turns: 0         // Zähler für Gesprächsrunden
    };
    
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
        btn.onclick = () => sendDispatcherMessage(s, incident);
        responses.appendChild(btn);
    });
    
    if (incident.conversationState.locationKnown && incident.conversationState.detailsKnown) {
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
    const state = incident.emotionalState;
    
    // ✅ Kontext-abhängige Vorschläge
    if (!incident.conversationState.locationKnown) {
        suggestions.push('Wo genau befinden Sie sich?');
        suggestions.push('Welche Straße?');
    }
    
    if (!incident.conversationState.detailsKnown) {
        suggestions.push('Was ist passiert?');
        suggestions.push('Beschreiben Sie die Situation.');
    }
    
    if (incident.keyword.includes('RD') && !incident.conversationState.symptomsKnown) {
        suggestions.push('Ist die Person ansprechbar?');
        suggestions.push('Atmet die Person?');
    }
    
    // ✅ Beruhigende Aussagen
    if (state.panic > 6) {
        suggestions.push('Bleiben Sie ruhig, Hilfe ist unterwegs.');
        suggestions.push('Ich verstehe. Atmen Sie tief durch.');
    }
    
    // ✅ Anweisungen
    if (incident.conversationState.locationKnown) {
        suggestions.push('Bleiben Sie am Telefon.');
        suggestions.push('Hilfe ist in wenigen Minuten bei Ihnen.');
    }
    
    return suggestions.slice(0, 5);
}

function sendCustomMessage() {
    const input = document.getElementById('custom-message-input');
    if (!input || !input.value.trim()) return;
    
    const message = input.value.trim();
    sendDispatcherMessage(message, currentCall);
    input.value = '';
}

// ✅ PHASE 3 FIX: Einheitliche Funktion für ALLE Disponent-Nachrichten
async function sendDispatcherMessage(message, incident) {
    addCallMessage('Disponent', message, 'dispatcher');
    conversationHistory.push({ role: 'assistant', content: message });
    
    // ✅ Erhöhe Turn-Counter
    incident.emotionalState.turns++;
    
    // ✅ Analysiere Nachricht und generiere passende Antwort
    const response = await generateIntelligentResponse(message, incident);
    
    setTimeout(() => {
        addCallMessage('Anrufer', response, 'caller');
        conversationHistory.push({ role: 'user', content: response });
        updateConversationState(message, response, incident);
        showCallResponses(incident);
    }, 800 + Math.random() * 400); // 0.8-1.2s Verzögerung
}

// ✅ PHASE 3: INTELLIGENTE ANTWORT-GENERIERUNG
async function generateIntelligentResponse(dispatcherMessage, incident) {
    const msg = dispatcherMessage.toLowerCase();
    const state = incident.emotionalState;
    
    // ✅ 1. DIREKTE FAKTEN-FRAGEN (schnelle einfache Antworten)
    const factResponse = getFactBasedResponse(msg, incident);
    if (factResponse) {
        return factResponse;
    }
    
    // ✅ 2. BERUHIGENDE AUSSAGEN (emotionale Reaktion)
    if (msg.includes('ruhig') || msg.includes('hilfe') || msg.includes('unterwegs') || msg.includes('gleich da')) {
        // Anrufer beruhigt sich
        state.panic = Math.max(1, state.panic - 2);
        state.calmness = Math.min(10, state.calmness + 2);
        
        const responses = [
            'Okay... okay... Gott sei Dank.',
            'Danke... das hört sich gut an.',
            'Wie lange dauert das noch?',
            'Ich versuche ruhig zu bleiben...',
            'Bitte beeilen Sie sich!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // ✅ 3. ANWEISUNGEN (Bestätigungen)
    if (msg.includes('bleiben sie') || msg.includes('warten sie') || msg.includes('nicht auflegen')) {
        state.cooperation = Math.min(10, state.cooperation + 1);
        
        const responses = [
            'Ja, ich bleibe hier.',
            'Okay, ich warte.',
            'Verstanden.',
            'Ich bleibe am Telefon.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // ✅ 4. NEGATIV/HEKTISCHE AUSSAGEN (Anrufer wird nervöser)
    if (msg.includes('schnell') || msg.includes('beeilen') || msg.includes('sofort')) {
        state.panic = Math.min(10, state.panic + 1);
        
        const responses = [
            'Ja bitte! Es ist dringend!',
            'Wie lange dauert das denn noch?!',
            'Das geht doch nicht schneller?!',
            'Bitte machen Sie schnell!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // ✅ 5. ALLGEMEINE FRAGEN/AUSSAGEN (KI-generiert)
    return await generateAIResponse(dispatcherMessage, incident);
}

// ✅ Fakten-basierte Antworten (ohne KI)
function getFactBasedResponse(message, incident) {
    const msg = message.toLowerCase();
    
    // Ort/Adresse
    if (msg.includes('wo') || msg.includes('adresse') || msg.includes('straße') || msg.includes('standort')) {
        return incident.actualLocation;
    }
    
    // Was ist passiert
    if (msg.includes('was') && (msg.includes('passiert') || msg.includes('geschehen') || msg.includes('los'))) {
        return incident.fullDetails.description;
    }
    
    // Bewusstsein
    if (msg.includes('ansprechbar') || msg.includes('bewusstsein') || msg.includes('wach')) {
        return incident.fullDetails.conscious ? 'Ja, ist bei Bewusstsein!' : 'Nein, reagiert nicht mehr!';
    }
    
    // Atmung
    if (msg.includes('atmet') || msg.includes('atmung')) {
        return incident.fullDetails.breathing ? 'Ja, atmet noch.' : 'Nein, keine Atmung!';
    }
    
    // Alter
    if (msg.includes('alt') || msg.includes('alter')) {
        return incident.fullDetails.age || 'Weiß ich nicht genau... vielleicht Mitte 40?';
    }
    
    // Geschlecht
    if (msg.includes('männlich') || msg.includes('weiblich') || msg.includes('geschlecht')) {
        return incident.fullDetails.gender === 'm' ? 'Ein Mann.' : 'Eine Frau.';
    }
    
    // Name
    if (msg.includes('name') || msg.includes('heißt')) {
        const names = ['Michael', 'Thomas', 'Sandra', 'Julia', 'Peter', 'Maria'];
        return names[Math.floor(Math.random() * names.length)] + '... glaube ich.';
    }
    
    return null; // Keine Fakten-Antwort gefunden
}

// ✅ KI-generierte Antwort (für komplexe Dialoge)
async function generateAIResponse(message, incident) {
    if (!game || !game.apiKey) {
        return generateFallbackResponse(incident);
    }
    
    try {
        const state = incident.emotionalState;
        const emotionLevel = state.panic > 7 ? 'sehr aufgeregt und ängstlich' : 
                            state.panic > 4 ? 'gestresst aber noch ruhig' : 
                            'einigermaßen ruhig';
        
        const systemPrompt = `Du bist ein Notrufer in einer Notsituation.

Situation: ${incident.fullDetails.description}
Ort: ${incident.actualLocation}
Emotionaler Zustand: ${emotionLevel}
Gesprächsrunde: ${state.turns}

REGELN:
1. Antworte IMMER auf die Aussage/Frage des Disponenten
2. Reagiere emotional passend (Panik, Angst, Beruhigung)
3. Maximal 1-2 kurze Sätze
4. Sei realistisch - Menschen wiederholen sich unter Stress
5. Zeige Dankbarkeit bei Beruhigung
6. Werde nervös wenn es zu lange dauert`;
        
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
                    ...conversationHistory.slice(-8), // Letzte 8 Nachrichten für Kontext
                    { role: 'user', content: message }
                ],
                temperature: 0.9, // Höhere Temperatur = natürlicher
                max_tokens: 100
            })
        });
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Groq API Fehler:', error);
        return generateFallbackResponse(incident);
    }
}

// ✅ Fallback ohne KI
function generateFallbackResponse(incident) {
    const state = incident.emotionalState;
    
    if (state.panic > 7) {
        const responses = [
            'Bitte beeilen Sie sich!',
            'Es ist wirklich dringend!',
            'Wie lange dauert das noch?!',
            'Oh Gott, bitte machen Sie schnell!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else {
        const responses = [
            'Okay, verstanden.',
            'Ja, ich warte.',
            'Danke.',
            'Bitte beeilen Sie sich.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// ✅ Update Gesprächsstatus basierend auf Inhalt
function updateConversationState(dispatcherMsg, callerResponse, incident) {
    const dMsg = dispatcherMsg.toLowerCase();
    const cMsg = callerResponse.toLowerCase();
    
    // Ort erkannt
    if ((dMsg.includes('wo') || dMsg.includes('adresse')) && 
        (cMsg.includes('straße') || cMsg.includes(incident.actualLocation.toLowerCase()))) {
        incident.conversationState.locationKnown = true;
        incident.location = incident.actualLocation;
    }
    
    // Details erkannt
    if (dMsg.includes('passiert') || dMsg.includes('geschehen')) {
        incident.conversationState.detailsKnown = true;
        incident.description = incident.fullDetails.description;
    }
    
    // Alter erkannt
    if (dMsg.includes('alt')) {
        incident.conversationState.ageKnown = true;
    }
    
    // Symptome erkannt
    if (dMsg.includes('ansprechbar') || dMsg.includes('atmet')) {
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