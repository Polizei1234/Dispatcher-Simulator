// =========================
// EINSATZGENERIERUNG MIT AI v3.0 - COMPOSITION SYSTEM INTEGRATION!
// Nutzt neuen AIIncidentGenerator mit Composition System
// Legacy-Fallback nutzt jetzt auch Composition System!
// =========================

// ℹ️ LEGACY: Alte Einsatz-Keywords für Fallback - JETZT MIT COMPOSITION DATA!
const KEYWORDS_BW = {
    'RD 1': {
        name: 'Rettungsdienst 1',
        description: 'Internistischer Notfall',
        required: ['RTW'],
        // 🎯 v3.0: Composition Data
        compositionData: {
            severity: 'MINOR',
            type: 'medical',
            modifiers: []
        }
    },
    'RD 2': {
        name: 'Rettungsdienst 2',
        description: 'Schwerer internistischer Notfall',
        required: ['RTW', 'NEF'],
        // 🎯 v3.0: Composition Data
        compositionData: {
            severity: 'MODERATE',
            type: 'medical',
            modifiers: ['elderly', 'multiple_symptoms']
        }
    },
    'RD 3': {
        name: 'Rettungsdienst 3',
        description: 'Lebensbedrohlicher Notfall',
        required: ['RTW', 'NEF'],
        // 🎯 v3.0: Composition Data
        compositionData: {
            severity: 'CRITICAL',
            type: 'medical',
            modifiers: ['unconscious', 'cardiac_emergency']
        }
    },
    'VU': {
        name: 'Verkehrsunfall',
        description: 'Verkehrsunfall mit Verletzten',
        required: ['RTW'],
        // 🎯 v3.0: Composition Data
        compositionData: {
            severity: 'MINOR',
            type: 'trauma',
            modifiers: ['traffic_accident']
        }
    },
    'VU P': {
        name: 'Verkehrsunfall Person eingeklemmt',
        description: 'Verkehrsunfall mit eingeklemmter Person',
        required: ['RTW', 'NEF'],
        // 🎯 v3.0: Composition Data
        compositionData: {
            severity: 'CRITICAL',
            type: 'trauma',
            modifiers: ['trapped', 'traffic_accident', 'multi_vehicle']
        }
    },
    'THL 1': {
        name: 'Technische Hilfeleistung klein',
        description: 'Kleinere technische Hilfeleistung',
        required: [],
        // 🎯 v3.0: Composition Data
        compositionData: {
            severity: 'MINOR',
            type: 'medical',
            modifiers: ['assistance_needed']
        }
    },
    'THL 2': {
        name: 'Technische Hilfeleistung groß',
        description: 'Größere technische Hilfeleistung',
        required: [],
        // 🎯 v3.0: Composition Data
        compositionData: {
            severity: 'MODERATE',
            type: 'medical',
            modifiers: ['trapped', 'complex_extraction']
        }
    },
    'B 1': {
        name: 'Brand klein',
        description: 'Kleinbrand',
        required: [],
        // 🎯 v3.0: Composition Data
        compositionData: {
            severity: 'MINOR',
            type: 'trauma',
            modifiers: ['smoke_inhalation']
        }
    },
    'B 2': {
        name: 'Brand mittel',
        description: 'Mittlerer Brand',
        required: [],
        // 🎯 v3.0: Composition Data
        compositionData: {
            severity: 'MODERATE',
            type: 'trauma',
            modifiers: ['smoke_inhalation', 'burns']
        }
    },
    'B 3': {
        name: 'Brand groß',
        description: 'Großbrand',
        required: [],
        // 🎯 v3.0: Composition Data
        compositionData: {
            severity: 'CRITICAL',
            type: 'trauma',
            modifiers: ['smoke_inhalation', 'burns', 'multi_casualty']
        }
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
                console.log(`🎯 Severity: ${incident.compositionInfo?.severity}`);
                console.log(`🧱 Type: ${incident.compositionInfo?.type}`);
                console.log(`🔧 Modifiers: ${incident.compositionInfo?.modifiers?.join(', ') || 'Keine'}`);
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
    
    // Fallback: Alte Methode - JETZT MIT COMPOSITION SYSTEM!
    const fallbackIncident = await generateLegacyIncident(ownedVehicles, apiKey);
    console.groupEnd();
    return fallbackIncident;
}

/**
 * 🎯 v3.0: Legacy Fallback-Methode - NUTZT JETZT COMPOSITION SYSTEM!
 */
async function generateLegacyIncident(ownedVehicles, apiKey) {
    console.log('🔄 Nutze Legacy-Generierung MIT Composition System');
    
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
    
    console.log(`🎯 Ausgewähltes Keyword: ${keyword}`);
    console.log(`🎯 Severity: ${keywordInfo.compositionData.severity}`);
    console.log(`🧱 Type: ${keywordInfo.compositionData.type}`);
    
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
    
    // 🎯 v3.0: Nutze Composition System!
    const compositionInfo = keywordInfo.compositionData;
    
    // 🎯 Komponiere Schema mit Composition System
    let composedSchema = null;
    if (window.INCIDENT_COMPOSITION_SYSTEM) {
        composedSchema = window.INCIDENT_COMPOSITION_SYSTEM.compose(
            compositionInfo.severity,
            compositionInfo.type,
            compositionInfo.modifiers
        );
        console.log('✅ Schema komponiert mit Composition System');
    } else {
        console.warn('⚠️ INCIDENT_COMPOSITION_SYSTEM nicht verfügbar - nutze Fallback-Schema');
        composedSchema = createFallbackSchema(compositionInfo);
    }
    
    const incident = {
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
        
        // 🎯 v3.0: COMPOSITION INFO - KRITISCH!
        compositionInfo: compositionInfo,
        composedSchema: composedSchema,
        
        // Einsatzdetails
        anrufer_typ: 'Unbekannt',
        anzahl_patienten: composedSchema?.patient?.count || 1,
        schweregrad: mapSeverityToOld(compositionInfo.severity),
        besonderheiten: compositionInfo.modifiers.join(', ') || null,
        
        // Einsatzdauer & Transport
        einsatzdauer_minuten: composedSchema?.timing?.duration_minutes || 25,
        transport_notwendig: composedSchema?.transport?.required || false,
        zielkrankenhaus: null,
        
        // Benötigte Fahrzeuge - aus Schema
        benoetigte_fahrzeuge: composedSchema?.resources?.vehicles || {
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
    
    console.log(`✅ Legacy-Einsatz generiert mit Composition System: ${incident.id}`);
    return incident;
}

/**
 * 🎯 v3.0: Mapper von neuem Severity zu altem Format
 */
function mapSeverityToOld(severity) {
    const mapping = {
        'MINOR': 'niedrig',
        'MODERATE': 'mittel',
        'CRITICAL': 'hoch'
    };
    return mapping[severity] || 'mittel';
}

/**
 * 🎯 v3.0: Fallback-Schema wenn Composition System nicht verfügbar
 */
function createFallbackSchema(compositionInfo) {
    const schemas = {
        'MINOR': {
            resources: { vehicles: { RTW: 1, NEF: 0, KTW: 0 } },
            timing: { duration_minutes: 20 },
            transport: { required: true },
            patient: { count: 1 },
            escalation: { probability: 0.1 }
        },
        'MODERATE': {
            resources: { vehicles: { RTW: 1, NEF: 1, KTW: 0 } },
            timing: { duration_minutes: 30 },
            transport: { required: true },
            patient: { count: 1 },
            escalation: { probability: 0.3, newLevel: 'CRITICAL', timeWindow: { min: 5, max: 15 } }
        },
        'CRITICAL': {
            resources: { vehicles: { RTW: 1, NEF: 1, KTW: 0 } },
            timing: { duration_minutes: 45 },
            transport: { required: true },
            patient: { count: 1 },
            // CRITICAL hat keine Eskalation, nur Komplikationen
            complications: { probability: 0.4 }
        }
    };
    
    return schemas[compositionInfo.severity] || schemas['MINOR'];
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

console.log('✅ Incidents.js v3.0 geladen (Composition System Integration!)');