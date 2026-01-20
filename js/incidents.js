// =========================
// EINSATZGENERIERUNG
// Nur machbare Einsätze basierend auf verfügbaren Fahrzeugen
// =========================

const PREDEFINED_INCIDENTS = [
    {
        keyword: 'RD 1',
        initialMessage: 'Hier ist jemand gestürzt!',
        actualLocation: 'Grabenstraße 12, Backnang',
        position: [48.9461, 9.4321],
        caller: 'Passant',
        fullDetails: {
            description: 'Person nach Sturz mit Kopfplatzwunde',
            conscious: true,
            breathing: true,
            age: '62 Jahre',
            injuries: 'Kopfplatzwunde, Schmerzen im Handgelenk'
        }
    },
    {
        keyword: 'RD 2',
        initialMessage: 'Mein Vater... er atmet ganz komisch!',
        actualLocation: 'Bahnhofstraße 45, Waiblingen',
        position: [48.8315, 9.3159],
        caller: 'Angehöriger',
        fullDetails: {
            description: 'Männliche Person mit akuter Atemnot',
            conscious: true,
            breathing: false,
            age: '78 Jahre',
            injuries: 'Atemnot, Brustschmerzen, Zyanose'
        }
    },
    {
        keyword: 'B 1',
        initialMessage: 'Es brennt hier, irgendein Müll!',
        actualLocation: 'Schulstraße 8, Backnang',
        position: [48.9450, 9.4280],
        caller: 'Anwohner',
        fullDetails: {
            description: 'Brennender Müllcontainer',
            conscious: true,
            breathing: true
        }
    },
    {
        keyword: 'B 2',
        initialMessage: 'Ein Auto brennt auf dem Parkplatz!',
        actualLocation: 'Mayenner Straße 15, Waiblingen',
        position: [48.8305, 9.3145],
        caller: 'Zeuge',
        fullDetails: {
            description: 'PKW-Brand auf Parkplatz, Flammen sichtbar',
            conscious: true,
            breathing: true
        }
    },
    {
        keyword: 'THL 1',
        initialMessage: 'Meine Katze sitzt auf dem Baum fest!',
        actualLocation: 'Gartenstraße 22, Winnenden',
        position: [48.8758, 9.3991],
        caller: 'Bürger',
        fullDetails: {
            description: 'Katze in ca. 8m Höhe auf Baum',
            conscious: true,
            breathing: true
        }
    },
    {
        keyword: 'VU',
        initialMessage: 'Unfall! Zwei Autos!',
        actualLocation: 'B14, Backnang Richtung Waiblingen',
        position: [48.9400, 9.4100],
        caller: 'Unfallbeteiligter',
        fullDetails: {
            description: 'Verkehrsunfall 2 PKW, 1 Person leicht verletzt',
            conscious: true,
            breathing: true,
            injured: '1 Person'
        }
    }
];

function generateIncident(ownedVehicles) {
    // Prüfe welche Einsatzarten machbar sind
    const feasibleIncidents = PREDEFINED_INCIDENTS.filter(template => {
        const keywordInfo = KEYWORDS_BW[template.keyword];
        if (!keywordInfo || !keywordInfo.required) return true;
        
        // Prüfe ob ALLE benötigten Fahrzeugtypen verfügbar sind
        return keywordInfo.required.every(requiredType => {
            return ownedVehicles.some(v => v.type === requiredType && v.owned);
        });
    });
    
    if (feasibleIncidents.length === 0) {
        console.warn('Keine machbaren Einsätze verfügbar mit aktueller Fahrzeugflotte!');
        return null;
    }
    
    const template = feasibleIncidents[Math.floor(Math.random() * feasibleIncidents.length)];
    
    return {
        id: `incident_${Date.now()}`,
        keyword: template.keyword,
        initialMessage: template.initialMessage,
        actualLocation: template.actualLocation,
        position: template.position,
        caller: template.caller,
        fullDetails: template.fullDetails,
        
        // Protokollfelder
        location: null,  // Wird erst nach Anruf bekannt
        description: null,
        patientAge: null,
        patientGender: null,
        onSceneSituation: null,
        measures: null,
        notes: null,
        
        status: 'incoming',  // incoming -> in-call -> new -> dispatched -> on-scene -> completed
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