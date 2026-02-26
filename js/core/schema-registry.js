// =========================
// SCHEMA REGISTRY v1.0
// ZENTRALE SCHEMA-VERWALTUNG
// =========================

/**
 * SchemaRegistry
 * 
 * Zentrales System zum Laden, Validieren und Bereitstellen von Incident Schemas.
 * Alle Systeme nutzen die Registry um auf Schema-Daten zuzugreifen.
 * 
 * FUNKTIONEN:
 * - Schemas laden und cachen
 * - Schemas validieren
 * - Schemas nach Kriterien filtern
 * - Kontext-basierte Schema-Auswahl
 * - Integration mit bestehenden Systemen
 */

class SchemaRegistry {
    constructor() {
        this.schemas = new Map();
        this.loaded = false;
        this.loadErrors = [];
        
        console.log('📋 SchemaRegistry initialisiert');
    }
    
    /**
     * Lädt alle Schemas aus INCIDENT_SCHEMAS
     */
    loadSchemas() {
        console.group('📚 Lade Incident Schemas');
        
        try {
            if (typeof INCIDENT_SCHEMAS === 'undefined') {
                throw new Error('INCIDENT_SCHEMAS nicht gefunden! Ist incident-schemas.js geladen?');
            }
            
            let loadedCount = 0;
            let errorCount = 0;
            
            // Lade jedes Schema
            for (const [id, schema] of Object.entries(INCIDENT_SCHEMAS)) {
                try {
                    // Validiere Schema
                    if (this.validateSchema(schema)) {
                        this.schemas.set(id, schema);
                        loadedCount++;
                        console.log(`  ✅ ${id}: ${schema.name}`);
                    } else {
                        errorCount++;
                        this.loadErrors.push(`Schema ${id} ungültig`);
                        console.error(`  ❌ ${id}: Validierung fehlgeschlagen`);
                    }
                } catch (error) {
                    errorCount++;
                    this.loadErrors.push(`Fehler bei ${id}: ${error.message}`);
                    console.error(`  ❌ ${id}:`, error);
                }
            }
            
            this.loaded = true;
            
            console.log(`\n🎯 Zusammenfassung:`);
            console.log(`   Geladen: ${loadedCount}`);
            console.log(`   Fehler: ${errorCount}`);
            
            if (loadedCount > 0) {
                this.logStatistics();
            }
            
        } catch (error) {
            console.error('❌ Kritischer Fehler beim Laden der Schemas:', error);
            this.loadErrors.push(error.message);
        }
        
        console.groupEnd();
        return this.loaded;
    }
    
    /**
     * Validiert ein Schema (erweiterte Validierung)
     */
    validateSchema(schema) {
        // Pflichtfelder
        const required = [
            'id', 'stichwort', 'name', 'category', 'subcategory',
            'priority', 'organization', 'vehicles', 'duration', 'transport'
        ];
        
        for (const field of required) {
            if (!schema[field]) {
                console.error(`  ⚠️ Fehlendes Feld: ${field}`);
                return false;
            }
        }
        
        // Validiere vehicles structure
        if (!schema.vehicles.required || !Array.isArray(schema.vehicles.required)) {
            console.error('  ⚠️ vehicles.required muss ein Array sein');
            return false;
        }
        
        // Validiere duration
        if (!schema.duration.min || !schema.duration.max) {
            console.error('  ⚠️ duration.min und duration.max erforderlich');
            return false;
        }
        
        // Validiere priority (1-3)
        if (schema.priority < 1 || schema.priority > 3) {
            console.error('  ⚠️ priority muss 1-3 sein');
            return false;
        }
        
        return true;
    }
    
    /**
     * Gibt ein Schema anhand der ID zurück
     */
    getSchema(id) {
        if (!this.loaded) {
            console.warn('⚠️ Schemas noch nicht geladen! Rufe loadSchemas() auf.');
            return null;
        }
        
        const schema = this.schemas.get(id);
        
        if (!schema) {
            console.warn(`⚠️ Schema '${id}' nicht gefunden`);
        }
        
        return schema || null;
    }
    
    /**
     * Gibt alle Schemas zurück
     */
    getAllSchemas() {
        return Array.from(this.schemas.values());
    }
    
    /**
     * Filtert Schemas nach Kategorie
     */
    getSchemasByCategory(category) {
        return this.getAllSchemas().filter(s => s.category === category);
    }
    
    /**
     * Filtert Schemas nach Organisation
     */
    getSchemasByOrganization(org) {
        return this.getAllSchemas().filter(s => s.organization === org);
    }
    
    /**
     * Filtert Schemas nach Priorität
     */
    getSchemasByPriority(priority) {
        return this.getAllSchemas().filter(s => s.priority === priority);
    }
    
    /**
     * Filtert Schemas nach Subcategory
     */
    getSchemasBySubcategory(subcategory) {
        return this.getAllSchemas().filter(s => s.subcategory === subcategory);
    }
    
    /**
     * Wählt passendes Schema basierend auf Kontext
     * 
     * @param {Object} context - Kontext-Informationen
     * @param {Array} ownedVehicles - Verfügbare Fahrzeuge
     * @returns {Object|null} Passendes Schema oder null
     */
    selectSchemaByContext(context, ownedVehicles) {
        let candidates = this.getAllSchemas();
        
        // Filter nach verfügbaren Fahrzeugen
        candidates = candidates.filter(schema => {
            return this.canFulfillVehicleRequirements(schema, ownedVehicles);
        });
        
        if (candidates.length === 0) {
            console.warn('⚠️ Keine machbaren Schemas mit aktuellen Fahrzeugen');
            return null;
        }
        
        // Optional: Filter nach Zeit, Wetter, etc.
        if (context.timeOfDay === 'night') {
            // Nachts häufiger RD-Einsätze
            const nightPreferred = candidates.filter(s => 
                s.category === 'medical' && s.subcategory !== 'critical'
            );
            if (nightPreferred.length > 0) {
                candidates = nightPreferred;
            }
        }
        
        // Wähle zufällig aus Kandidaten
        return candidates[Math.floor(Math.random() * candidates.length)];
    }
    
    /**
     * Prüft ob die benötigten Fahrzeuge vorhanden sind
     */
    canFulfillVehicleRequirements(schema, ownedVehicles) {
        const required = schema.vehicles.required;
        
        for (const req of required) {
            if (!req.mandatory) continue;
            
            // Zähle verfügbare Fahrzeuge dieses Typs
            const available = ownedVehicles.filter(v => 
                v.type === req.type && 
                v.owned && 
                v.status === 'available'
            ).length;
            
            if (available < req.count) {
                return false;  // Nicht genügend Fahrzeuge
            }
        }
        
        return true;
    }
    
    /**
     * Gibt Schema-ID für ein Legacy-Keyword zurück (Kompatibilität)
     */
    getSchemaIdForKeyword(keyword) {
        // Mapping von alten Keywords zu Schema-IDs
        const mapping = {
            'RD 1': 'RD_1',
            'RD 2': 'RD_2',
            'RD 3': 'RD_3',
            'MANV 1': 'MANV_1',
            'MANV 2': 'MANV_2',
            'MANV 3': 'MANV_3',
            'MANV 4': 'MANV_4',
            'MANV 5': 'MANV_5',
            // Alte Keywords
            'VU': 'RD_2',      // VU wird zu RD 2 (Trauma)
            'VU P': 'RD_3',    // VU P wird zu RD 3 (schweres Trauma)
            'B 1': null,       // Noch nicht implementiert
            'B 2': null,
            'B 3': null,
            'THL 1': null,
            'THL 2': null
        };
        
        return mapping[keyword] || null;
    }
    
    /**
     * Erstellt Schema-basiertes Incident-Objekt
     */
    createIncidentFromSchema(schema, additionalData = {}) {
        const baseIncident = {
            id: `E${Date.now().toString().slice(-8)}`,
            schema_id: schema.id,  // WICHTIG: Referenz zum Schema!
            
            // Aus Schema
            stichwort: schema.stichwort,
            keyword: schema.stichwort,
            category: schema.category,
            priority: schema.priority,
            organization: schema.organization,
            
            benoetigte_fahrzeuge: this.extractVehicleRequirements(schema),
            
            einsatzdauer_minuten: this.calculateDuration(schema, additionalData.context),
            
            transport_notwendig: this.determineTransportNeed(schema),
            
            // Aus additionalData
            ...additionalData,
            
            // Status
            assignedVehicles: [],
            status: 'incoming',
            completed: false,
            startTime: null,
            endTime: null,
            
            // Timestamp
            timestamp: Date.now(),
            zeitstempel: new Date().toLocaleTimeString('de-DE', {
                hour: '2-digit', 
                minute: '2-digit'
            })
        };
        
        return baseIncident;
    }
    
    /**
     * Extrahiert Fahrzeug-Anforderungen aus Schema
     */
    extractVehicleRequirements(schema) {
        const requirements = {};
        
        for (const req of schema.vehicles.required) {
            requirements[req.type] = req.count;
        }
        
        return requirements;
    }
    
    /**
     * Berechnet Einsatzdauer basierend auf Schema und Kontext
     */
    calculateDuration(schema, context = {}) {
        let duration = schema.duration.min + 
            Math.random() * (schema.duration.max - schema.duration.min);
        
        // Wende Modifiers an
        if (schema.duration.modifiers && context) {
            if (context.timeOfDay === 'night' && schema.duration.modifiers.night) {
                duration *= schema.duration.modifiers.night;
            }
            if (context.weather === 'bad' && schema.duration.modifiers.bad_weather) {
                duration *= schema.duration.modifiers.bad_weather;
            }
            // ... weitere Modifiers
        }
        
        // AI Variance
        if (schema.duration.aiVariance) {
            const variance = 1 + (Math.random() - 0.5) * 2 * schema.duration.aiVariance;
            duration *= variance;
        }
        
        return Math.round(duration);
    }
    
    /**
     * Bestimmt ob Transport nötig ist
     */
    determineTransportNeed(schema) {
        return Math.random() < schema.transport.probability;
    }
    
    /**
     * Loggt Statistiken über geladene Schemas
     */
    logStatistics() {
        console.log(`\n📊 Schema-Statistiken:`);
        
        // Nach Kategorie
        const byCategory = {};
        this.getAllSchemas().forEach(s => {
            byCategory[s.category] = (byCategory[s.category] || 0) + 1;
        });
        console.log('  Kategorien:', byCategory);
        
        // Nach Organisation
        const byOrg = {};
        this.getAllSchemas().forEach(s => {
            byOrg[s.organization] = (byOrg[s.organization] || 0) + 1;
        });
        console.log('  Organisationen:', byOrg);
        
        // Nach Priorität
        const byPriority = {};
        this.getAllSchemas().forEach(s => {
            byPriority[`Prio ${s.priority}`] = (byPriority[`Prio ${s.priority}`] || 0) + 1;
        });
        console.log('  Prioritäten:', byPriority);
    }
    
    /**
     * Gibt Fehler beim Laden zurück
     */
    getLoadErrors() {
        return this.loadErrors;
    }
    
    /**
     * Prüft ob Registry bereit ist
     */
    isReady() {
        return this.loaded && this.schemas.size > 0;
    }
}

// =========================
// GLOBALE INSTANZ
// =========================

// Erstelle globale Registry
window.schemaRegistry = new SchemaRegistry();

// Auto-Load wenn incident-schemas.js bereits geladen
if (typeof INCIDENT_SCHEMAS !== 'undefined') {
    window.schemaRegistry.loadSchemas();
} else {
    console.warn('⚠️ incident-schemas.js noch nicht geladen. Rufe schemaRegistry.loadSchemas() manuell auf!');
}

console.log('✅ SchemaRegistry v1.0 geladen');