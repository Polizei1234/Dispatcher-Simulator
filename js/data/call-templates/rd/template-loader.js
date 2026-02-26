// =========================================================================================
// TEMPLATE LOADER - Lädt und verarbeitet Templates zur Laufzeit
// =========================================================================================

import { RD_TEMPLATES } from './index.js';
import { selectRandomTemplate } from './template-selector.js';

// =========================================================================================
// TEMPLATE INSTANCE GENERATOR
// =========================================================================================

/**
 * Erstellt eine konkrete Instanz aus einem Template
 * @param {string} templateId - ID des Templates
 * @param {Object} options - Optionen für die Instanz-Generierung
 * @returns {Object} - Generierte Einsatz-Instanz
 */
export function generateCallInstance(templateId, options = {}) {
    const template = RD_TEMPLATES[templateId];
    
    if (!template) {
        throw new Error(`Template '${templateId}' nicht gefunden`);
    }
    
    const instance = {
        // Basis-Informationen
        id: generateCallId(),
        timestamp: new Date().toISOString(),
        templateId: templateId,
        stichwort: template.stichwort,
        kategorie: template.kategorie,
        
        // Generierte Daten
        anrufer: generateAnrufer(template.anrufer, options),
        patient: generatePatient(template.patient, options),
        location: generateLocation(template.locations, options),
        
        // Optionale Daten (falls im Template vorhanden)
        symptome: template.symptome ? selectFromProbabilities(template.symptome) : null,
        verletzungen: template.verletzungen ? selectFromProbabilities(template.verletzungen) : null,
        medizinisch: template.medizinisch ? selectFromProbabilities(template.medizinisch) : null,
        
        // Dynamik
        dynamik: template.anrufer?.dynamik || null,
        eskalation: template.eskalation || null,
        
        // Status
        status: 'pending',
        priority: determinePriority(template),
        
        // Metadaten
        metadata: {
            generatedAt: Date.now(),
            version: '1.0.0',
            options: options
        }
    };
    
    return instance;
}

/**
 * Generiert zufällige Einsatz-Instanz
 */
export function generateRandomCall(options = {}) {
    const selected = selectRandomTemplate(options);
    return generateCallInstance(selected.id, options);
}

// =========================================================================================
// GENERIERUNGS-FUNKTIONEN
// =========================================================================================

/**
 * Generiert eindeutige Call-ID
 */
function generateCallId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `RD-${timestamp}-${random}`;
}

/**
 * Generiert Anrufer-Daten
 */
function generateAnrufer(anruferTemplate, options) {
    if (!anruferTemplate?.typen) return null;
    
    const selectedType = selectFromProbabilities(anruferTemplate.typen);
    
    return {
        typ: selectedType.key,
        speechPattern: selectedType.value.speech_pattern,
        variation: selectRandom(selectedType.value.variations || ['Anruf...']),
        effects: selectedType.value.effects || null
    };
}

/**
 * Generiert Patienten-Daten
 */
function generatePatient(patientTemplate, options) {
    if (!patientTemplate) return null;
    
    return {
        geschlecht: selectFromProbabilities(patientTemplate.geschlecht),
        alter: generateAge(patientTemplate.alter),
        bewusstsein: patientTemplate.bewusstsein ? 
            selectFromProbabilities(patientTemplate.bewusstsein) : 'wach',
        atmung: patientTemplate.atmung ? 
            selectFromProbabilities(patientTemplate.atmung) : 'normal'
    };
}

/**
 * Generiert Alters-Wert basierend auf Verteilung
 */
function generateAge(alterConfig) {
    if (!alterConfig) return Math.floor(Math.random() * 70) + 18;
    
    const { distribution, mean, stddev, min, max } = alterConfig;
    
    if (distribution === 'normal') {
        // Normal-Verteilung
        let age = normalRandom(mean, stddev);
        age = Math.max(min || 0, Math.min(max || 100, Math.floor(age)));
        return age;
    }
    
    if (distribution === 'bimodal') {
        // Zwei Peaks
        const { peak1, peak2 } = alterConfig;
        const usePeak1 = Math.random() < (peak1.weight || 0.5);
        const peak = usePeak1 ? peak1 : peak2;
        let age = normalRandom(peak.mean, peak.stddev);
        age = Math.max(min || 0, Math.min(max || 100, Math.floor(age)));
        return age;
    }
    
    if (distribution === 'exponential_alt') {
        // Exponential für ältere Patienten
        const range = (alterConfig.peak_range || [60, 80]);
        if (Math.random() < 0.7) {
            return Math.floor(Math.random() * (range[1] - range[0])) + range[0];
        }
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    // Default: Uniform
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Normal-verteilte Zufallszahl (Box-Muller)
 */
function normalRandom(mean, stddev) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stddev + mean;
}

/**
 * Generiert Location-Daten
 */
function generateLocation(locationsTemplate, options) {
    if (!locationsTemplate) return null;
    
    const selectedLocation = selectFromProbabilities(locationsTemplate);
    
    return {
        typ: selectedLocation.key,
        addressTypes: selectedLocation.value.address_types || [],
        // Hier könnte später echte Adress-Generierung eingebaut werden
        address: generateDummyAddress(selectedLocation.value.address_types?.[0])
    };
}

/**
 * Generiert Dummy-Adresse (Platzhalter)
 */
function generateDummyAddress(type = 'residential') {
    const streets = ['Hauptstraße', 'Bahnhofstraße', 'Kirchstraße', 'Gartenstraße', 'Schulstraße'];
    const street = selectRandom(streets);
    const number = Math.floor(Math.random() * 150) + 1;
    const city = 'Backnang';
    const plz = '71522';
    
    return {
        street: `${street} ${number}`,
        city: city,
        plz: plz,
        full: `${street} ${number}, ${plz} ${city}`
    };
}

// =========================================================================================
// PRIORITÄT & DISPOSITION
// =========================================================================================

/**
 * Bestimmt Priorität des Einsatzes
 */
function determinePriority(template) {
    // Kritische Stichwort -> Prio 1
    const kritisch = ['reanimation', 'herzinfarkt', 'schlaganfall'];
    if (kritisch.includes(template.id)) {
        return 1;
    }
    
    // Schwere -> Prio 2
    const schwer = ['verkehrsunfall', 'krampfanfall', 'asthma'];
    if (schwer.includes(template.id)) {
        return 2;
    }
    
    // Rest -> Prio 3
    return 3;
}

/**
 * Bestimmt empfohlene Disposition
 */
export function getRecommendedDisposition(callInstance) {
    const template = RD_TEMPLATES[callInstance.templateId];
    
    if (!template?.disposition) {
        return {
            rtw: 1,
            nef: 0,
            ktw: 0
        };
    }
    
    return template.disposition.base_recommendation || {
        rtw: 1,
        nef: 0,
        ktw: 0
    };
}

// =========================================================================================
// HELPER FUNCTIONS
// =========================================================================================

/**
 * Wählt aus Objekt mit Wahrscheinlichkeiten
 */
function selectFromProbabilities(obj) {
    if (!obj || typeof obj !== 'object') return null;
    
    const entries = Object.entries(obj)
        .filter(([key, value]) => typeof value === 'object' && value.probability !== undefined);
    
    if (entries.length === 0) {
        // Keine Wahrscheinlichkeiten, wähle zufällig
        const keys = Object.keys(obj);
        const key = selectRandom(keys);
        return { key, value: obj[key] };
    }
    
    // Gewichtete Auswahl
    const totalProb = entries.reduce((sum, [, val]) => sum + (val.probability || 0), 0);
    let random = Math.random() * totalProb;
    
    for (const [key, value] of entries) {
        random -= value.probability;
        if (random <= 0) {
            return { key, value };
        }
    }
    
    // Fallback
    const [key, value] = entries[0];
    return { key, value };
}

/**
 * Wählt zufälliges Element aus Array
 */
function selectRandom(array) {
    if (!Array.isArray(array) || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

// =========================================================================================
// BATCH-GENERIERUNG
// =========================================================================================

/**
 * Generiert mehrere Einsätze
 */
export function generateMultipleCalls(count, options = {}) {
    const calls = [];
    
    for (let i = 0; i < count; i++) {
        try {
            const call = generateRandomCall(options);
            calls.push(call);
        } catch (error) {
            console.error(`Fehler bei Einsatz ${i + 1}:`, error);
        }
    }
    
    return calls;
}

/**
 * Generiert Einsätze für Zeitraum (Simulation)
 */
export function generateCallsForTimeRange(startHour, endHour, callsPerHour = 2, options = {}) {
    const calls = [];
    
    for (let hour = startHour; hour < endHour; hour++) {
        for (let i = 0; i < callsPerHour; i++) {
            const call = generateRandomCall({
                ...options,
                timeOfDay: hour
            });
            
            // Zeitstempel anpassen
            const date = new Date();
            date.setHours(hour);
            date.setMinutes(Math.floor(Math.random() * 60));
            call.timestamp = date.toISOString();
            
            calls.push(call);
        }
    }
    
    return calls.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
    );
}

// =========================================================================================
// SERIALISIERUNG
// =========================================================================================

/**
 * Konvertiert Call-Instanz zu JSON
 */
export function serializeCall(callInstance) {
    return JSON.stringify(callInstance, null, 2);
}

/**
 * Lädt Call-Instanz aus JSON
 */
export function deserializeCall(json) {
    try {
        return JSON.parse(json);
    } catch (error) {
        console.error('Fehler beim Deserialisieren:', error);
        return null;
    }
}

// =========================================================================================
// EXPORTS
// =========================================================================================

export default generateCallInstance;

// Node.js Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateCallInstance,
        generateRandomCall,
        generateMultipleCalls,
        generateCallsForTimeRange,
        getRecommendedDisposition,
        serializeCall,
        deserializeCall
    };
}
