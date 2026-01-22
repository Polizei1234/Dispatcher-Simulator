// =========================
// EINSATZGENERIERUNG MIT AI v2.0
// Nutzt neuen AIIncidentGenerator
// =========================

// ℹ️ LEGACY: Alte Einsatz-Keywords für Fallback
const KEYWORDS_BW = {
    'RD 1': {
        name: 'Rettungsdienst 1',
        description: 'Internistischer Notfall',
        required: ['RTW']
    },
    'RD 2': {
        name: 'Rettungsdienst 2',
        description: 'Schwerer internistischer Notfall',
        required: ['RTW', 'NEF']
    },
    'RD 3': {
        name: 'Rettungsdienst 3',
        description: 'Lebensbedrohlicher Notfall',
        required: ['RTW', 'NEF']
    },
    'VU': {
        name: 'Verkehrsunfall',
        description: 'Verkehrsunfall mit Verletzten',
        required: ['RTW']
    },
    'VU P': {
        name: 'Verkehrsunfall Person eingeklemmt',
        description: 'Verkehrsunfall mit eingeklemmter Person',
        required: ['RTW', 'NEF']
    },
    'THL 1': {
        name: 'Technische Hilfeleistung klein',
        description: 'Kleinere technische Hilfeleistung',
        required: []
    },
    'THL 2': {
        name: 'Technische Hilfeleistung groß',
        description: 'Größere technische Hilfeleistung',
        required: []
    },
    'B 1': {
        name: 'Brand klein',
        description: 'Kleinbrand',
        required: []
    },
    'B 2': {
        name: 'Brand mittel',
        description: 'Mittlerer Brand',
        required: []
    },
    'B 3': {
        name: 'Brand groß',
        description: 'Großbrand',
        required: []
    }
};

/**
 * Hauptfunktion: Generiert Einsatz mit AI Incident Generator
 */
async function generateIncidentWithAI(ownedVehicles, apiKey) {
    console.group('🆕 GENERIERE EINSATZ');
    
    // Prüfe ob AI Generator verfügbar ist
    if (window.gameAIGenerator) {
        console.log('✅ Nutze AI Incident Generator');
        
        try {
            const incident = await window.gameAIGenerator.generateIncident(
                ownedVehicles,
                window.GameTime?.simulated || new Date()
            );
            
            if (incident) {
                console.log(`✅ AI Einsatz generiert: ${incident.stichwort} in ${incident.ort}`);
                console.groupEnd();
                
                // Starte Eskalations-Überwachung
                if (window.gameEscalationSystem) {
                    window.gameEscalationSystem.monitorIncident(incident);
                }
                
                return incident;
            }
            
        } catch (error) {
            console.error('❌ AI Generator Fehler:', error);
        }
    } else {
        console.warn('⚠️ AI Generator nicht verfügbar, nutze Fallback');
    }
    
    // Fallback: Alte Methode
    const fallbackIncident = await generateLegacyIncident(ownedVehicles, apiKey);
    console.groupEnd();
    return fallbackIncident;
}

/**
 * Legacy Fallback-Methode
 */
async function generateLegacyIncident(ownedVehicles, apiKey) {
    console.log('🔄 Nutze Legacy-Generierung');
    
    // Prüfe welche Keywords machbar sind
    const feasibleKeywords = Object.keys(KEYWORDS_BW).filter(keyword => {
        const keywordInfo = KEYWORDS_BW[keyword];
        if (!keywordInfo.required || keywordInfo.required.length === 0) return true;
        
        return keywordInfo.required.every(reqType => 
            ownedVehicles.some(v => v.type === reqType && v.owned)
        );
    });
    
    if (feasibleKeywords.length === 0) {
        console.warn('⚠️ Keine machbaren Einsätze!');
        return null;
    }
    
    const keyword = feasibleKeywords[Math.floor(Math.random() * feasibleKeywords.length)];
    const keywordInfo = KEYWORDS_BW[keyword];
    
    // Generiere zufällige Position in Waiblingen
    const centerLat = 48.8309;
    const centerLon = 9.3256;
    const randomLat = centerLat + (Math.random() - 0.5) * 0.02;
    const randomLon = centerLon + (Math.random() - 0.5) * 0.02;
    
    const location = {
        lat: randomLat,
        lon: randomLon,
        address: 'Waiblingen',
        hotspot: 'Waiblingen'
    };
    
    // Versuche Groq AI für Meldebild
    let initialMessage = `Notfall: ${keywordInfo.description}`;
    
    if (apiKey) {
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { 
                            role: 'system', 
                            content: 'Du bist ein deutscher Notruf-Generator. Erstelle eine kurze, aufgeregte Erstmeldung (max. 15 Wörter).'
                        },
                        { 
                            role: 'user', 
                            content: `Generiere Notruf für: ${keyword} - ${keywordInfo.description}` 
                        }
                    ],
                    temperature: 0.9,
                    max_tokens: 50
                })
            });
            
            const data = await response.json();
            initialMessage = data.choices[0].message.content.replace(/"/g, '');
            
        } catch (error) {
            console.warn('⚠️ Groq API für Meldebild fehlgeschlagen');
        }
    }
    
    return {
        id: `E${Date.now().toString().slice(-8)}`,
        stichwort: keyword,
        keyword: keyword,
        ort: location.address,
        location: location.address,
        koordinaten: { lat: location.lat, lon: location.lon },
        position: [location.lat, location.lon],
        meldebild: initialMessage,
        initialMessage: initialMessage,
        zeitstempel: new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'}),
        timestamp: Date.now(),
        
        // Einsatzdetails
        anrufer_typ: 'Unbekannt',
        anzahl_patienten: 1,
        schweregrad: 'mittel',
        besonderheiten: null,
        
        // Einsatzdauer & Transport
        einsatzdauer_minuten: 25,
        transport_notwendig: keyword.includes('RD') || keyword.includes('VU P'),
        zielkrankenhaus: null,
        
        // Benötigte Fahrzeuge
        benoetigte_fahrzeuge: {
            RTW: keywordInfo.required.includes('RTW') ? 1 : 0,
            NEF: keywordInfo.required.includes('NEF') ? 1 : 0,
            KTW: 0
        },
        assignedVehicles: [],
        
        // Status
        status: 'incoming',
        completed: false,
        startTime: null,
        endTime: null,
        
        // Anruf-Daten
        caller: 'Unbekannt',
        conversationState: {
            locationKnown: false,
            detailsKnown: false,
            symptomsKnown: false,
            ageKnown: false
        },
        conversationHistory: []
    };
}

/**
 * Wrapper-Funktion für Kompatibilität
 */
function createIncidentFromAI(keyword, keywordInfo, location, aiData) {
    console.warn('⚠️ createIncidentFromAI ist deprecated, nutze generateIncidentWithAI');
    return generateLegacyIncident(window.GAME_DATA?.vehicles || [], null);
}

function createFallbackIncident(keyword, keywordInfo, location) {
    console.warn('⚠️ createFallbackIncident ist deprecated, nutze generateIncidentWithAI');
    return generateLegacyIncident(window.GAME_DATA?.vehicles || [], null);
}

console.log('✅ Incidents.js v2.0 geladen (AI Integration)');