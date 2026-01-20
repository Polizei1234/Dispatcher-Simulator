// =========================
// KI-MODUL
// Perplexity AI Integration
// =========================

async function generateIncidentWithAI() {
    if (!game || !game.apiKey) {
        console.log('Kein API Key - verwende vordefinierte Einsätze');
        return null;
    }
    
    try {
        const prompt = `Generiere einen realistischen Rettungsdienst- oder Feuerwehreinsatz für die ILS Waiblingen (Rems-Murr-Kreis, Baden-Württemberg).
        
Gib zurück (nur JSON, keine Erklärung):
{
  "keyword": "RD 1/RD 2/B 1/B 2/B 3/THL 1/THL 2/THL VU/VU",
  "description": "Kurze Beschreibung",
  "location": "Straße Hausnummer, Stadt im Rems-Murr-Kreis",
  "caller": "Wer ruft an",
  "details": "Detaillierte Schilderung"
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
                    {
                        role: 'system',
                        content: 'Du bist ein Einsatzgenerator für Rettungsleitstellen. Antworte nur mit JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Extrahiere JSON
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

function showCallDialog(incident) {
    const modal = document.getElementById('call-dialog');
    const conversation = document.getElementById('call-conversation');
    const responses = document.querySelector('.call-responses');
    
    conversation.innerHTML = '';
    responses.innerHTML = '';
    
    // Startmeldung
    addCallMessage('Anrufer', `Hallo, hier ist ein Notruf! ${incident.details}`, 'caller');
    
    // Zeige Antwortmöglichkeiten
    showCallResponses(incident);
    
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
    
    // Wähle passende Fragen
    const questions = DISPATCHER_PHRASES.slice(0, 3);
    
    questions.forEach(question => {
        const btn = document.createElement('button');
        btn.className = 'response-btn';
        btn.textContent = question;
        btn.onclick = () => askQuestion(question, incident);
        responses.appendChild(btn);
    });
    
    // Einsatz erstellen Button
    const createBtn = document.createElement('button');
    createBtn.className = 'btn btn-success';
    createBtn.style.marginTop = '10px';
    createBtn.innerHTML = '<i class="fas fa-check"></i> Einsatz erstellen';
    createBtn.onclick = () => createIncidentFromCall(incident);
    responses.appendChild(createBtn);
}

async function askQuestion(question, incident) {
    addCallMessage('Disponent', question, 'dispatcher');
    
    // Simuliere Antwort (ohne KI: vordefiniert)
    setTimeout(() => {
        let answer = 'Ja, genau.';
        
        if (question.includes('Einsatzort')) {
            answer = incident.location;
        } else if (question.includes('Personen')) {
            answer = 'Eine Person ist betroffen.';
        } else if (question.includes('ansprechbar')) {
            answer = incident.keyword === 'RD 2' ? 'Nein, nicht ansprechbar!' : 'Ja, die Person ist bei Bewusstsein.';
        } else if (question.includes('Atmet')) {
            answer = 'Ja, ich sehe Atmung.';
        }
        
        addCallMessage('Anrufer', answer, 'caller');
    }, 1000);
}

function createIncidentFromCall(incident) {
    // Schließe Dialog
    document.getElementById('call-dialog').classList.remove('active');
    
    // Füge Einsatz hinzu wenn noch nicht vorhanden
    const exists = game.incidents.find(i => i.id === incident.id);
    if (!exists) {
        game.incidents.push(incident);
    }
    
    addRadioMessage('Leitstelle', `Neuer Einsatz erfasst: ${incident.keyword} - ${incident.description}`);
    updateIncidentList();
    updateMap();
}