// =========================
// GROQ VALIDATOR
// Validiert Alarmierung und schlägt Nachforderungen vor
// =========================

const GroqValidator = {

    /**
     * Validiert Fahrzeugzuweisung nach Alarmierung
     */
    async validateAssignment(incident, assignedVehicles) {
        console.group('🤖 GROQ VALIDATION');
        console.log('🚨 Einsatz:', incident.nummer);
        console.log('🚑 Alarmiert:', assignedVehicles.map(v => v.type));

        try {
            const validation = await this.callGroqForValidation(incident, assignedVehicles);
            
            if (!validation) {
                console.warn('⚠️ Keine Validierung erhalten');
                console.groupEnd();
                return;
            }

            console.log('✅ Validierung erhalten:', validation.bewertung);

            // Wenn Nachforderung nötig
            if (validation.nachforderung_noetig) {
                this.showNachforderungPopup(incident, validation);
            } else {
                console.log('✅ Alarmierung vollständig');
            }

            console.groupEnd();

        } catch (error) {
            console.error('❌ Validierungs-Fehler:', error);
            console.groupEnd();
        }
    },

    /**
     * Ruft Groq für Validierung auf
     */
    async callGroqForValidation(incident, assignedVehicles) {
        const apiKey = CONFIG.GROQ_API_KEY || localStorage.getItem('groq_api_key');
        
        if (!apiKey) {
            console.error('❌ Kein Groq API Key');
            return null;
        }

        // Verfügbare Fahrzeugtypen
        const availableTypes = VehicleAnalyzer.getAvailableTypes();

        const prompt = `Du bist ein Experte für Rettungsdienst-Einsätze und Fahrzeugdisposition.

EINSATZ:
- Nummer: ${incident.nummer}
- Stichwort: ${incident.stichwort}
- Meldebild: ${incident.meldebild}
- Besonderheiten: ${incident.besonderheiten || 'keine'}
- Verletzte: ${incident.verletzte.gesamt} (Schwer: ${incident.verletzte.schwer}, Leicht: ${incident.verletzte.leicht})

ALARMIERTE FAHRZEUGE:
${assignedVehicles.map(v => `- ${v.type} (${v.name})`).join('\n')}

VERFÜGBARE FAHRZEUGTYPEN:
${availableTypes.join(', ')}

AUFGABE:
Prüfe, ob die alarmierten Fahrzeuge für diesen Einsatz ausreichen.
Beachte:
- Stichwort und Meldebild
- Besonderheiten (z.B. "eingeklemmt" = Feuerwehr nötig)
- Anzahl und Schwere der Verletzungen
- Medizinische Notwendigkeit (NEF bei lebensbedrohlichen Zuständen)

ANTWORTE als JSON:
{
  "bewertung": "vollstaendig|unvollstaendig|ueberdimensioniert",
  "nachforderung_noetig": true|false,
  "fehlende_ressourcen": [
    {
      "typ": "Fahrzeugtyp (z.B. NEF, FW-HLF)",
      "grund": "Begründung",
      "prioritaet": "kritisch|dringend|empfohlen"
    }
  ],
  "erklaerung": "Kurze Erklärung der Bewertung",
  "funkspruch": "Funkspruch für Nachforderung (falls nötig)"
}`;

        console.log('🤖 Sende Validierungs-Request...');
        const startTime = Date.now();

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'Du bist ein Experte für Rettungsdienst-Disposition. Antworte immer als valides JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000,
                response_format: { type: 'json_object' }
            })
        });

        const responseTime = Date.now() - startTime;
        console.log(`⏱️ Groq Response Time: ${responseTime}ms`);

        if (!response.ok) {
            throw new Error(`Groq API Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        return JSON.parse(content);
    },

    /**
     * Zeigt Nachforderungs-Popup
     */
    showNachforderungPopup(incident, validation) {
        console.log('⚠️ Zeige Nachforderungs-Popup');

        // Erstelle Popup
        const popup = document.createElement('div');
        popup.id = 'nachforderung-popup';
        popup.className = 'popup-overlay';

        let html = `
            <div class="popup-content nachforderung-content">
                <div class="popup-header">
                    <h2>⚠️ NACHFORDERUNG ERFORDERLICH</h2>
                </div>
                <div class="popup-body">
                    <div class="incident-info">
                        <strong>Einsatz:</strong> ${incident.nummer}<br>
                        <strong>Stichwort:</strong> ${incident.stichwort}
                    </div>

                    <div class="validation-explanation">
                        <p>${validation.erklaerung}</p>
                    </div>

                    <div class="missing-resources">
                        <h3>🚑 Fehlende Ressourcen:</h3>
        `;

        validation.fehlende_ressourcen.forEach(res => {
            const priorityClass = res.prioritaet === 'kritisch' ? 'critical' : 
                                 res.prioritaet === 'dringend' ? 'urgent' : 'recommended';
            const priorityIcon = res.prioritaet === 'kritisch' ? '🔴' :
                                res.prioritaet === 'dringend' ? '🟠' : '🟡';

            html += `
                <div class="resource-item ${priorityClass}">
                    <div class="resource-header">
                        <span class="priority-icon">${priorityIcon}</span>
                        <strong>${res.typ}</strong>
                        <span class="priority-badge">${res.prioritaet}</span>
                    </div>
                    <div class="resource-reason">${res.grund}</div>
                    <button class="btn btn-small btn-primary alarm-resource-btn" 
                            data-type="${res.typ}">
                        🚨 ${res.typ} nachalarmieren
                    </button>
                </div>
            `;
        });

        html += `
                    </div>

                    <div class="funkspruch-box">
                        <strong>📡 Funkspruch:</strong>
                        <p class="funkspruch">${validation.funkspruch}</p>
                    </div>
                </div>
                <div class="popup-footer">
                    <button class="btn btn-secondary" id="dismiss-nachforderung-btn">
                        Später entscheiden
                    </button>
                </div>
            </div>
        `;

        popup.innerHTML = html;
        document.body.appendChild(popup);

        // Event Listeners
        popup.querySelectorAll('.alarm-resource-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.alarmAdditionalResource(incident, type);
                popup.remove();
            });
        });

        document.getElementById('dismiss-nachforderung-btn')?.addEventListener('click', () => {
            popup.remove();
        });
    },

    /**
     * Alarmiert zusätzliche Ressource
     */
    alarmAdditionalResource(incident, type) {
        console.log(`🚨 Nachforderung: ${type} für Einsatz ${incident.nummer}`);

        // Finde bestes verfügbares Fahrzeug
        const suggestions = VehicleAnalyzer.findBestVehicles(
            incident.koordinaten,
            [type]
        );

        const vehicles = suggestions[type];
        if (!vehicles || vehicles.length === 0) {
            alert(`Kein ${type} verfügbar!`);
            return;
        }

        // Nehme bestes (erstes) Fahrzeug
        const best = vehicles[0];
        
        // Alarmiere
        if (typeof AssignmentUI !== 'undefined') {
            AssignmentUI.dispatchVehicle(best.vehicle, incident);
        }

        console.log(`✅ ${best.vehicle.name} nachalarmiert (ETA: ${best.eta} Min)`);

        // Zeige Benachrichtigung
        this.showNotification(`🚨 ${best.vehicle.name} wurde nachalarmiert`);
    },

    /**
     * Zeigt kurze Benachrichtigung
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Auto-Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        console.log('✅ Groq Validator bereit');
    });
}
