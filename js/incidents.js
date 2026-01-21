// =========================
// EINSATZGENERIERUNG MIT GROQ AI
// Realistische, zufällige Einsätze
// =========================

const INCIDENT_LOCATIONS_WAIBLINGEN = [
    { name: 'Bahnhofstraße 15, Waiblingen', pos: [48.8295, 9.3165] },
    { name: 'Korber Straße 32, Waiblingen', pos: [48.8340, 9.3180] },
    { name: 'Devizesstraße 8, Waiblingen', pos: [48.8312, 9.3142] },
    { name: 'Winnender Straße 51, Waiblingen', pos: [48.8350, 9.3210] },
    { name: 'Schorndorfer Straße 22, Waiblingen', pos: [48.8285, 9.3220] },
    { name: 'Ringstraße 45, Waiblingen', pos: [48.8290, 9.3100] },
    { name: 'Stuttgarter Straße 67, Waiblingen', pos: [48.8250, 9.3080] },
    { name: 'B29, Waiblingen Richtung Schorndorf', pos: [48.8270, 9.3350] },
    { name: 'Alte Bundesstraße 12, Waiblingen', pos: [48.8380, 9.3190] },
    { name: 'Industriestraße 8, Waiblingen', pos: [48.8305, 9.3250] }
];

// Einsatz-Keywords für Baden-Württemberg
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

async function generateIncidentWithAI(ownedVehicles, apiKey) {
    // Prüfe welche Keywords machbar sind
    const feasibleKeywords = Object.keys(KEYWORDS_BW).filter(keyword => {
        const keywordInfo = KEYWORDS_BW[keyword];
        if (!keywordInfo.required) return true;
        
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
    const location = INCIDENT_LOCATIONS_WAIBLINGEN[Math.floor(Math.random() * INCIDENT_LOCATIONS_WAIBLINGEN.length)];
    
    // Generiere mit Groq AI
    if (!apiKey) {
        // Fallback ohne AI
        return createFallbackIncident(keyword, keywordInfo, location);
    }
    
    try {
        const response = await fetch(CONFIG.GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: CONFIG.GROQ_MODEL,
                messages: [
                    { 
                        role: 'system', 
                        content: `Du bist ein deutscher Notruf-Generator für Rettungsleitstellen. Erstelle einen realistischen Notruf für Stichwort "${keyword}" (${keywordInfo.name}). Antworte NUR mit JSON im Format:
{
  "initialMessage": "Erste aufgeregte Meldung des Anrufers (1 Satz, vage)",
  "caller": "Art des Anrufers (z.B. Passant, Angehöriger, Zeuge)",
  "description": "Detaillierte Situationsbeschreibung (2-3 Sätze)",
  "age": "Alter der Person (z.B. 45 Jahre) oder null",
  "conscious": true/false,
  "breathing": true/false
}`
                    },
                    { role: 'user', content: `Generiere Notruf für: ${keyword}` }
                ],
                temperature: 0.9,
                max_tokens: 250
            })
        });
        
        const data = await response.json();
        const aiData = JSON.parse(data.choices[0].message.content);
        
        return createIncidentFromAI(keyword, keywordInfo, location, aiData);
        
    } catch (error) {
        console.error('❌ Groq API Fehler:', error);
        return createFallbackIncident(keyword, keywordInfo, location);
    }
}

function createIncidentFromAI(keyword, keywordInfo, location, aiData) {
    return {
        id: `incident_${Date.now()}`,
        keyword: keyword,
        initialMessage: aiData.initialMessage,
        actualLocation: location.name,
        position: location.pos,
        caller: aiData.caller,
        fullDetails: {
            description: aiData.description,
            conscious: aiData.conscious,
            breathing: aiData.breathing,
            age: aiData.age
        },
        location: null,
        description: null,
        patientAge: null,
        patientGender: null,
        onSceneSituation: null,
        measures: null,
        notes: null,
        status: 'incoming',
        assignedVehicles: [],
        timestamp: Date.now(),
        conversationState: {
            locationKnown: false,
            detailsKnown: false,
            symptomsKnown: false,
            ageKnown: false
        }
    };
}

function createFallbackIncident(keyword, keywordInfo, location) {
    const fallbackMessages = {
        'RD 1': 'Hilfe, hier ist jemand gestürzt!',
        'RD 2': 'Schnell, mein Mann atmet nicht richtig!',
        'RD 3': 'Bewusstlose Person, bitte schnell!',
        'B 1': 'Es brennt hier, ein Mülleimer!',
        'B 2': 'Ein Auto brennt!',
        'B 3': 'Feuer! Das ganze Gebäude steht in Flammen!',
        'THL 1': 'Hilfe, meine Katze sitzt auf dem Baum!',
        'THL 2': 'Ein Baum ist auf die Straße gestürzt!',
        'VU P': 'Schwerer Unfall, Person eingeklemmt!',
        'VU': 'Unfall, es gibt Verletzte!'
    };
    
    return {
        id: `incident_${Date.now()}`,
        keyword: keyword,
        initialMessage: fallbackMessages[keyword] || 'Notfall!',
        actualLocation: location.name,
        position: location.pos,
        caller: 'Unbekannt',
        fullDetails: {
            description: keywordInfo.description,
            conscious: true,
            breathing: true,
            age: null
        },
        location: null,
        description: null,
        patientAge: null,
        patientGender: null,
        onSceneSituation: null,
        measures: null,
        notes: null,
        status: 'incoming',
        assignedVehicles: [],
        timestamp: Date.now(),
        conversationState: {
            locationKnown: false,
            detailsKnown: false,
            symptomsKnown: false,
            ageKnown: false
        }
    };
}