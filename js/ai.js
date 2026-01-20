// =========================
// KI-MODUL & TELEFON-SYSTEM
// Perplexity AI Integration + Interaktives Telefon
// =========================

let currentCall = null;
let conversationHistory = [];

function showIncomingCallNotification(incident) {
    const callList = document.getElementById('call-list');
    if (!callList) return;
    
    callList.innerHTML = `
        <div class="incoming-call blinking" onclick="acceptIncomingCall('${incident.id}')" style="cursor: pointer; padding: 15px; background: #dc3545; border-radius: 8px; margin: 10px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <i class="fas fa-phone-volume" style="font-size: 1.5em; margin-right: 10px;"></i>
                    <strong style="font-size: 1.1em;">NOTRUF 112</strong>
                </div>
                <button class="btn btn-success btn-small">Annehmen</button>
            </div>
            <p style="margin-top: 10px; font-size: 0.9em;">Anrufer: ${incident.caller}</p>
        </div>
    `;
    
    // Spiele Sound (optional)
    playSound('incoming-call');
}

function acceptIncomingCall(incidentId) {
    if (game) {
        game.acceptCall(incidentId);
    }
    
    // Leere Anrufliste
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
    conversationHistory.push({ role: 'dispatcher', message: 'Notruf 112, wo genau ist der Notfall?' });
    
    // Erste Meldung des Anrufers
    setTimeout(() => {
        addCallMessage('Anrufer', incident.initialMessage, 'caller');
        conversationHistory.push({ role: 'caller', message: incident.initialMessage });
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
            style="width: 100%; padding: 10px; border: 2px solid #2d3748; border-radius: 6px; background: #0f1419; color: white; margin-bottom: 5px;">
        <button class="btn btn-primary btn-small" onclick="sendCustomMessage()">
            <i class="fas fa-paper-plane"></i> Senden
        </button>
    `;
    responses.appendChild(inputContainer);
    
    // Textbausteine basierend auf Gesprächszustand
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
    
    // Einsatz erstellen Button (nur wenn genug Infos vorhanden)
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
        suggestions.push('Welche Beschwerden hat die Person?');
    }
    
    if (!incident.conversationState.ageKnown) {
        suggestions.push('Wie alt ist die Person ungefähr?');
    }
    
    suggestions.push('Bleiben Sie am Telefon, Hilfe ist unterwegs.');
    suggestions.push('Sind Sie selbst in Sicherheit?');
    
    return suggestions.slice(0, 4); // Max 4 Vorschläge
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
    conversationHistory.push({ role: 'dispatcher', message: question });
    
    // Simuliere Antwort basierend auf Frage
    setTimeout(() => {
        const answer = generateCallerResponse(question, incident);
        addCallMessage('Anrufer', answer, 'caller');
        conversationHistory.push({ role: 'caller', message: answer });
        
        // Aktualisiere Gesprächszustand
        updateConversationState(question, incident);
        
        // Aktualisiere Antwortmöglichkeiten
        showCallResponses(incident);
    }, 1500 + Math.random() * 1000);
}

function generateCallerResponse(question, incident) {
    const q = question.toLowerCase();
    
    // Adresse/Ort
    if (q.includes('wo') || q.includes('adresse') || q.includes('ort')) {
        return incident.actualLocation;
    }
    
    // Was ist passiert
    if (q.includes('passiert') || q.includes('situation')) {
        return incident.fullDetails.description || 'Wie am Anfang gesagt...';
    }
    
    // Ansprechbar
    if (q.includes('ansprechbar') || q.includes('bewusstsein')) {
        return incident.fullDetails.conscious ? 'Ja, die Person ist bei Bewusstsein.' : 'Nein, die Person reagiert nicht!';
    }
    
    // Atmung
    if (q.includes('atmet') || q.includes('atmung')) {
        return incident.fullDetails.breathing ? 'Ja, ich sehe Atmung.' : 'Ich weiß nicht... ich glaube ja?';
    }
    
    // Alter
    if (q.includes('alt') || q.includes('alter')) {
        return incident.fullDetails.age || 'Ca. 50 Jahre, schätze ich.';
    }
    
    // Verletzungen
    if (q.includes('verletz') || q.includes('beschwerden') || q.includes('symptome')) {
        return incident.fullDetails.injuries || incident.fullDetails.symptoms || 'Wie gesagt, es sieht ernst aus.';
    }
    
    // Anzahl Personen
    if (q.includes('wie viele') || q.includes('personen')) {
        return incident.fullDetails.injured || 'Eine Person.';
    }
    
    // Sicherheit
    if (q.includes('sicherheit')) {
        return 'Ja, ich bin in Sicherheit.';
    }
    
    // Bleiben Sie dran
    if (q.includes('bleiben') || q.includes('telefon')) {
        return 'Ja, ich bleibe hier. Bitte beeilen Sie sich!';
    }
    
    // Standard
    return 'Ja... bitte schicken Sie schnell jemanden!';
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
    
    if (q.includes('alt') || q.includes('alter')) {
        incident.conversationState.ageKnown = true;
    }
    
    if (q.includes('ansprechbar') || q.includes('atmet') || q.includes('verletz') || q.includes('symptome')) {
        incident.conversationState.symptomsKnown = true;
    }
}

function createIncidentFromCall(incident) {
    // Schließe Dialog
    document.getElementById('call-dialog').classList.remove('active');
    
    // Setze Status auf "new" damit es in der Einsatzliste erscheint
    incident.status = 'new';
    
    // Prüfe ob alle benötigten Fahrzeuge verfügbar sind
    const check = game.checkRequiredVehicles(incident.keyword);
    
    if (!check.hasAll) {
        const missingStr = check.missing.join(', ');
        alert(`WARNUNG: Nicht alle benötigten Fahrzeuge verfügbar!\n\nFehlend: ${missingStr}\n\nEmpfohlen: ${check.required.join(', ')}\n\nSie können den Einsatz trotzdem disponieren, aber möglicherweise reichen die Einsatzmittel nicht aus.`);
    }
    
    addRadioMessage('Leitstelle', `Neuer Einsatz erfasst: ${incident.keyword} - ${incident.description}`);
    updateIncidentList();
    updateMap();
    
    // Wähle Einsatz automatisch aus
    selectIncident(incident.id);
}

// KI-generierte Einsätze (optional, wenn API Key vorhanden)
async function generateIncidentWithAI() {
    if (!game || !game.apiKey) {
        return null;
    }
    
    try {
        const prompt = `Generiere einen realistischen Notruf für die ILS Waiblingen (Rems-Murr-Kreis, Baden-Württemberg).
        
Gib zurück (nur JSON):
{
  "keyword": "RD 1/RD 2/B 1/B 2/B 3/THL 1/THL 2/THL VU/VU",
  "initialMessage": "Erste kurze Meldung des Anrufers (panisch, unklar)",
  "location": "Straße Hausnummer, Stadt im Rems-Murr-Kreis",
  "caller": "Wer ruft an",
  "description": "Kurze Beschreibung"
}`;
        
        const response = await fetch(CONFIG.PERPLEXITY_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${game.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: CONFIG.PERPLEXITY_MODEL,
                messages: [
                    { role: 'system', content: 'Du bist ein Notruf-Simulator. Antworte nur mit JSON.' },
                    { role: 'user', content: prompt }
                ]
            })
        });
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        return null;
    } catch (error) {
        console.error('AI Fehler:', error);
        return null;
    }
}