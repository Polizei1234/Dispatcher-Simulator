// =========================
// CALL TEMPLATE MAPPER v1.0
// Verknüpft incident-types.js mit call-templates (rd/)
// =========================

/**
 * Mapping: Incident-Type ID -> Call-Template IDs
 * 
 * Ein Incident-Type kann mehrere Call-Templates haben
 * Die Templates werden zufällig ausgewählt
 */
const INCIDENT_TO_TEMPLATE_MAPPING = {
    
    // MEDICAL -> Allgemeine medizinische Templates
    MEDICAL: [
        'bauchschmerzen',
        'bewusstlosigkeit-unklar',
        'blutung',
        'akutes-abdomen'
    ],
    
    // CARDIAC -> Herz-Templates
    CARDIAC: [
        'herzinfarkt',
        'angina-pectoris',
        'angina_pectoris',
        'brustschmerzen',
        'herzrhythmusstoerung'
    ],
    
    // STROKE -> Schlaganfall-Templates
    STROKE: [
        'schlaganfall',
        'bewusstlosigkeit-unklar'
    ],
    
    // TRAFFIC -> Verkehrsunfall (keine RD-Templates, aber trotzdem mappen)
    TRAFFIC: [
        'trauma',
        'blutung',
        'bewusstlosigkeit-unklar'
    ],
    
    // FALLS -> Sturz-Templates
    FALLS: [
        'sturz',
        'fraktur',
        'kopfverletzung',
        'bewusstlosigkeit-unklar'
    ],
    
    // RESPIRATORY -> Atemwegs-Templates
    RESPIRATORY: [
        'asthma',
        'atemnot',
        'copd',
        'aspiration'
    ],
    
    // BURNS -> Verbrennungs-Templates
    BURNS: [
        'verbrennung',
        'verbruehung'
    ],
    
    // WORKPLACE -> Arbeitsunfall-Templates
    WORKPLACE: [
        'arbeitsunfall',
        'blutung',
        'fraktur',
        'elektrounfall'
    ],
    
    // FRACTURES -> Fraktur-Templates
    FRACTURES: [
        'fraktur',
        'sturz'
    ],
    
    // BIRTH -> Geburts-Templates
    BIRTH: [
        'geburt'
    ],
    
    // PEDIATRIC -> Kinder-Templates
    PEDIATRIC: [
        'fieberkrampf',
        'baby-hypoglykaemie',
        'atemnot',
        'pseudokrupp'
    ],
    
    // PSYCHIATRIC -> Psychiatrie-Templates
    PSYCHIATRIC: [
        'suizidversuch',
        'psychiatrie',
        'verwirrtheit'
    ],
    
    // DROWNING -> Ertrinkungs-Templates
    DROWNING: [
        'ertrinken',
        'bewusstlosigkeit-unklar'
    ],
    
    // POISONING -> Vergiftungs-Templates
    POISONING: [
        'vergiftung',
        'medikamenten-intox',
        'drogen-intoxikation',
        'alkohol-intox',
        'co-vergiftung'
    ],
    
    // ALLERGIC -> Allergie-Templates
    ALLERGIC: [
        'anaphylaxie',
        'allergische-reaktion'
    ],
    
    // HEAT_EMERGENCY -> Hitze-Templates
    HEAT_EMERGENCY: [
        'hitzschlag',
        'kreislauf',
        'bewusstlosigkeit-unklar'
    ],
    
    // HYPOTHERMIA -> Unterkühlung-Templates
    HYPOTHERMIA: [
        'unterkuehlung',
        'erfrierung',
        'bewusstlosigkeit-unklar'
    ]
};

/**
 * Call Template Mapper
 */
class CallTemplateMapper {
    
    constructor() {
        this.mapping = INCIDENT_TO_TEMPLATE_MAPPING;
        this.loadedTemplates = new Map();
    }
    
    /**
     * Lädt Call-Template für Incident-Type
     * @param {string} incidentTypeId - ID des Incident-Types (z.B. 'CARDIAC')
     * @returns {Promise<object>} Call-Template
     */
    async getTemplateForIncident(incidentTypeId) {
        const templateIds = this.mapping[incidentTypeId];
        
        if (!templateIds || templateIds.length === 0) {
            console.warn(`⚠️ Keine Call-Templates für ${incidentTypeId}`);
            return null;
        }
        
        // Zufälliges Template auswählen
        const randomTemplateId = templateIds[Math.floor(Math.random() * templateIds.length)];
        
        // Template laden (falls noch nicht gecacht)
        if (!this.loadedTemplates.has(randomTemplateId)) {
            try {
                const template = await this.loadTemplate(randomTemplateId);
                this.loadedTemplates.set(randomTemplateId, template);
            } catch (error) {
                console.error(`❌ Fehler beim Laden von Template ${randomTemplateId}:`, error);
                return null;
            }
        }
        
        return this.loadedTemplates.get(randomTemplateId);
    }
    
    /**
     * Lädt Template-Datei
     */
    async loadTemplate(templateId) {
        const templatePath = `js/data/call-templates/rd/${templateId}.js`;
        
        try {
            // Dynamisch importieren
            const module = await import(`../../data/call-templates/rd/${templateId}.js`);
            
            // Extrahiere Template (unterschiedliche Export-Namen möglich)
            const templateKey = Object.keys(module).find(key => key.includes('TEMPLATE'));
            
            if (!templateKey) {
                throw new Error(`Template ${templateId} hat keinen TEMPLATE-Export`);
            }
            
            console.log(`📞 Call-Template geladen: ${templateId}`);
            return module[templateKey];
            
        } catch (error) {
            console.error(`❌ Template ${templateId} nicht gefunden oder Fehler:`, error);
            return null;
        }
    }
    
    /**
     * Gibt alle verfügbaren Template-IDs für einen Incident-Type zurück
     */
    getAvailableTemplates(incidentTypeId) {
        return this.mapping[incidentTypeId] || [];
    }
    
    /**
     * Prüft ob Template für Incident-Type existiert
     */
    hasTemplates(incidentTypeId) {
        const templates = this.mapping[incidentTypeId];
        return templates && templates.length > 0;
    }
    
    /**
     * Fügt neues Mapping hinzu
     */
    addMapping(incidentTypeId, templateIds) {
        if (!Array.isArray(templateIds)) {
            templateIds = [templateIds];
        }
        
        if (this.mapping[incidentTypeId]) {
            this.mapping[incidentTypeId].push(...templateIds);
        } else {
            this.mapping[incidentTypeId] = templateIds;
        }
        
        console.log(`✅ Mapping hinzugefügt: ${incidentTypeId} -> ${templateIds.join(', ')}`);
    }
    
    /**
     * Zeigt alle Mappings an (Debug)
     */
    showMappings() {
        console.log('📞 Call-Template Mappings:');
        Object.entries(this.mapping).forEach(([incidentType, templates]) => {
            console.log(`  ${incidentType}: ${templates.length} Templates`);
            console.log(`    -> ${templates.join(', ')}`);
        });
    }
}

// Globale Instanz
window.CallTemplateMapper = CallTemplateMapper;
window.INCIDENT_TO_TEMPLATE_MAPPING = INCIDENT_TO_TEMPLATE_MAPPING;

console.log('📞 Call Template Mapper v1.0 geladen');
console.log(`   ${Object.keys(INCIDENT_TO_TEMPLATE_MAPPING).length} Incident-Types gemappt`);

// Zeige Mappings beim Laden
if (window.location.search.includes('debug')) {
    const mapper = new CallTemplateMapper();
    mapper.showMappings();
}