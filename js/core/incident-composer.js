// =========================
// INCIDENT COMPOSER v1.0
// ZENTRALE KOMPOSITIONS-ENGINE
// =========================

/**
 * INCIDENT COMPOSER
 * 
 * Komponiert vollständige Einsätze aus:
 * - SEVERITY_BASES (Schweregrad)
 * - INCIDENT_TYPES (Einsatzart)
 * - INCIDENT_MODIFIERS (optionale Besonderheiten)
 * 
 * WORKFLOW:
 * 1. Wähle Severity (MINOR/MODERATE/CRITICAL)
 * 2. Wähle Type (MEDICAL/TRAFFIC/BIRTH/etc.)
 * 3. Optional: Wähle Modifiers (ENTRAPMENT/FIRE/etc.)
 * 4. Komponiere alles zu vollständigem Schema
 * 5. Nutze Schema für AI-Generator
 * 
 * VORTEIL:
 * 3 Severities × 8 Types × 5 Modifiers = 120 mögliche Kombinationen!
 * Aber nur 16 Definitionen nötig!
 */

class IncidentComposer {
    
    constructor() {
        this.severityBases = null;
        this.incidentTypes = null;
        this.modifiers = null;
        this.loaded = false;
        
        console.log('🎼 IncidentComposer initialisiert');
    }
    
    /**
     * Lädt alle benötigten Daten
     */
    loadData() {
        console.group('📦 Lade Kompositions-Daten');
        
        try {
            // Prüfe ob Daten verfügbar
            if (typeof SEVERITY_BASES === 'undefined') {
                throw new Error('SEVERITY_BASES nicht geladen!');
            }
            if (typeof INCIDENT_TYPES === 'undefined') {
                throw new Error('INCIDENT_TYPES nicht geladen!');
            }
            if (typeof INCIDENT_MODIFIERS === 'undefined') {
                throw new Error('INCIDENT_MODIFIERS nicht geladen!');
            }
            
            this.severityBases = SEVERITY_BASES;
            this.incidentTypes = INCIDENT_TYPES;
            this.modifiers = INCIDENT_MODIFIERS;
            this.loaded = true;
            
            console.log('✅ Severity Bases geladen:', Object.keys(this.severityBases).length);
            console.log('✅ Incident Types geladen:', Object.keys(this.incidentTypes).length);
            console.log('✅ Modifiers geladen:', Object.keys(this.modifiers).length);
            
            const combinations = 
                Object.keys(this.severityBases).length *
                Object.keys(this.incidentTypes).length *
                (Object.keys(this.modifiers).length + 1);  // +1 für "kein Modifier"
            
            console.log(`🎯 Mögliche Kombinationen: ${combinations}`);
            
        } catch (error) {
            console.error('❌ Fehler beim Laden:', error);
            this.loaded = false;
        }
        
        console.groupEnd();
        return this.loaded;
    }
    
    /**
     * Komponiert einen Einsatz
     * 
     * @param {string} severityLevel - MINOR, MODERATE oder CRITICAL
     * @param {string} typeId - MEDICAL, TRAFFIC, BIRTH, etc.
     * @param {Array<string>} modifierIds - Optional: ['ENTRAPMENT', 'FIRE']
     * @returns {Object} Vollständiges Incident-Schema
     */
    compose(severityLevel, typeId, modifierIds = []) {
        if (!this.loaded) {
            console.error('❌ Composer noch nicht geladen! Rufe loadData() auf.');
            return null;
        }
        
        console.group(`🎵 Komponiere: ${severityLevel} + ${typeId}`);
        
        try {
            // 1. Hole Basis-Daten
            const severity = this.severityBases[severityLevel];
            const type = this.incidentTypes[typeId];
            
            if (!severity) {
                throw new Error(`Severity '${severityLevel}' nicht gefunden`);
            }
            if (!type) {
                throw new Error(`Type '${typeId}' nicht gefunden`);
            }
            
            // 2. Starte mit Severity-Basis
            let schema = this.cloneDeep(severity);
            
            // 3. Merge Type-Eigenschaften
            schema = this.mergeType(schema, type, severityLevel);
            
            // 4. Wende Modifiers an
            for (const modifierId of modifierIds) {
                const modifier = this.modifiers[modifierId];
                if (modifier) {
                    schema = this.applyModifier(schema, modifier);
                    console.log(`  ⚙️ Modifier angewendet: ${modifierId}`);
                }
            }
            
            // 5. Generiere Identifikatoren
            schema.id = this.generateSchemaId(severityLevel, typeId, modifierIds);
            schema.stichwort = this.generateKeyword(typeId, severityLevel, modifierIds);
            schema.name = this.generateName(type, severity, modifierIds);
            
            // 6. Setze Metadaten
            schema.composed = true;
            schema.compositionInfo = {
                severity: severityLevel,
                type: typeId,
                modifiers: modifierIds,
                timestamp: Date.now()
            };
            
            console.log(`✅ Schema erstellt: ${schema.id} (${schema.stichwort})`);
            console.groupEnd();
            
            return schema;
            
        } catch (error) {
            console.error('❌ Kompositions-Fehler:', error);
            console.groupEnd();
            return null;
        }
    }
    
    /**
     * Merged Type-Eigenschaften in Severity-Basis
     */
    mergeType(schema, type, severityLevel) {
        // Basis-Eigenschaften vom Type
        schema.category = type.category;
        schema.organization = type.organization;
        schema.description = type.description;
        
        // Gesprächs-Eigenschaften
        schema.questionCategories = [...type.questionCategories];
        schema.requiredQuestions = [...type.requiredQuestions];
        schema.criticalSymptoms = type.criticalSymptoms || [];
        
        // Conditions für aktuellen Severity-Level
        if (type.commonConditions && type.commonConditions[severityLevel]) {
            schema.commonConditions = type.commonConditions[severityLevel];
        }
        
        // Locations, Caller Types, Emotions
        schema.locations = type.locations || [];
        schema.callerTypes = type.callerTypes || [];
        schema.emotionVariants = type.emotionVariants || [];
        
        // Special Features
        schema.specialFeatures = type.specialFeatures || [];
        
        return schema;
    }
    
    /**
     * Wendet einen Modifier an
     */
    applyModifier(schema, modifier) {
        const effects = modifier.effects;
        
        // Dauer-Modifikation
        if (effects.durationMultiplier) {
            schema.duration.min = Math.round(schema.duration.min * effects.durationMultiplier);
            schema.duration.max = Math.round(schema.duration.max * effects.durationMultiplier);
        }
        if (effects.durationAdd) {
            schema.duration.min += effects.durationAdd;
            schema.duration.max += effects.durationAdd;
        }
        
        // Fahrzeuge hinzufügen
        if (effects.vehicleAdd && effects.vehicleAdd.length > 0) {
            schema.vehicles.optional = schema.vehicles.optional || [];
            schema.vehicles.optional.push(...effects.vehicleAdd);
        }
        
        // Fragen hinzufügen
        if (effects.questionAdd && effects.questionAdd.length > 0) {
            schema.questionCategories.push(...effects.questionAdd);
        }
        
        // Eskalation modifizieren
        if (effects.escalationModifier && schema.escalation) {
            schema.escalation.probability = Math.min(
                1.0,
                schema.escalation.probability * effects.escalationModifier
            );
        }
        
        // Panic-Level modifizieren
        if (effects.panicModifier) {
            schema.panicModified = effects.panicModifier;
        }
        
        // Special Features hinzufügen
        schema.specialFeatures = schema.specialFeatures || [];
        schema.specialFeatures.push(...modifier.specialFeatures);
        
        // Komplikationen hinzufügen
        if (modifier.complications) {
            schema.complications = schema.complications || [];
            schema.complications.push(...modifier.complications);
        }
        
        return schema;
    }
    
    /**
     * Generiert Schema-ID
     */
    generateSchemaId(severity, type, modifiers) {
        let id = `${type}_${severity}`;
        if (modifiers.length > 0) {
            id += '_' + modifiers.join('_');
        }
        return id;
    }
    
    /**
     * Generiert Keyword (für UI)
     */
    generateKeyword(typeId, severity, modifiers) {
        const type = this.incidentTypes[typeId];
        
        // Nutze Type-spezifisches Mapping
        if (type.keywords && type.keywords[severity]) {
            let keyword = type.keywords[severity];
            
            // Modifier-Suffixe
            if (modifiers.includes('ENTRAPMENT')) {
                keyword += ' P';  // z.B. "VU P"
            }
            
            return keyword;
        }
        
        // Fallback: Generisch
        return `${typeId} ${severity}`;
    }
    
    /**
     * Generiert lesbaren Namen
     */
    generateName(type, severity, modifiers) {
        let name = `${type.name} - ${severity.name}`;
        
        if (modifiers.length > 0) {
            const modNames = modifiers.map(m => this.modifiers[m].name);
            name += ` (${modNames.join(', ')})`;
        }
        
        return name;
    }
    
    /**
     * Zufälliger Einsatz (mit Gewichtung)
     */
    composeRandom(weights = null) {
        if (!this.loaded) {
            console.error('❌ Composer nicht geladen');
            return null;
        }
        
        // Default Gewichtung
        const defaultWeights = {
            severity: {
                MINOR: 0.5,
                MODERATE: 0.35,
                CRITICAL: 0.15
            },
            type: {
                MEDICAL: 0.40,
                TRAFFIC: 0.25,
                PEDIATRIC: 0.15,
                BIRTH: 0.05,
                PSYCHIATRIC: 0.05,
                DROWNING: 0.03,
                POISONING: 0.04,
                ALLERGIC: 0.03
            },
            modifierProbability: 0.2  // 20% Chance auf Modifier
        };
        
        const w = weights || defaultWeights;
        
        // Wähle Severity
        const severity = this.weightedRandom(w.severity);
        
        // Wähle Type
        const type = this.weightedRandom(w.type);
        
        // Wähle optional Modifier
        const modifiers = [];
        if (Math.random() < w.modifierProbability) {
            const applicableModifiers = Object.values(this.modifiers)
                .filter(m => m.applicableTo.includes(type))
                .map(m => m.id);
            
            if (applicableModifiers.length > 0) {
                const randomMod = applicableModifiers[
                    Math.floor(Math.random() * applicableModifiers.length)
                ];
                modifiers.push(randomMod);
            }
        }
        
        return this.compose(severity, type, modifiers);
    }
    
    /**
     * Zufällige Auswahl mit Gewichtung
     */
    weightedRandom(weights) {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [key, weight] of Object.entries(weights)) {
            cumulative += weight;
            if (rand <= cumulative) {
                return key;
            }
        }
        
        return Object.keys(weights)[0];
    }
    
    /**
     * Deep Clone Helper
     */
    cloneDeep(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    
    /**
     * Gibt alle möglichen Kombinationen zurück
     */
    getAllCombinations() {
        const combinations = [];
        
        for (const severity of Object.keys(this.severityBases)) {
            for (const type of Object.keys(this.incidentTypes)) {
                // Ohne Modifier
                combinations.push({ severity, type, modifiers: [] });
                
                // Mit je einem Modifier
                for (const modifier of Object.keys(this.modifiers)) {
                    const mod = this.modifiers[modifier];
                    if (mod.applicableTo.includes(type)) {
                        combinations.push({ severity, type, modifiers: [modifier] });
                    }
                }
            }
        }
        
        return combinations;
    }
    
    /**
     * Statistik-Output
     */
    showStatistics() {
        console.group('📊 Kompositions-Statistik');
        
        console.log(`Severities: ${Object.keys(this.severityBases).length}`);
        console.log(`Types: ${Object.keys(this.incidentTypes).length}`);
        console.log(`Modifiers: ${Object.keys(this.modifiers).length}`);
        
        const combos = this.getAllCombinations();
        console.log(`\nMögliche Kombinationen: ${combos.length}`);
        
        // Beispiele
        console.log('\n📌 Beispiele:');
        const examples = [
            this.compose('MINOR', 'MEDICAL', []),
            this.compose('CRITICAL', 'TRAFFIC', ['ENTRAPMENT']),
            this.compose('MODERATE', 'BIRTH', []),
            this.compose('MINOR', 'PEDIATRIC', [])
        ];
        
        examples.forEach(ex => {
            if (ex) {
                console.log(`  - ${ex.stichwort}: ${ex.name}`);
            }
        });
        
        console.groupEnd();
    }
}

// =========================
// GLOBALE INSTANZ
// =========================

window.incidentComposer = new IncidentComposer();

// Auto-Load wenn Daten verfügbar
if (typeof SEVERITY_BASES !== 'undefined' && 
    typeof INCIDENT_TYPES !== 'undefined' && 
    typeof INCIDENT_MODIFIERS !== 'undefined') {
    window.incidentComposer.loadData();
    window.incidentComposer.showStatistics();
} else {
    console.warn('⚠️ Kompositions-Daten noch nicht geladen. Rufe incidentComposer.loadData() manuell auf!');
}

console.log('✅ IncidentComposer v1.0 geladen');