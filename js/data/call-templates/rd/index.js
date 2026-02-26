// =========================================================================================
// RD TEMPLATES INDEX - Zentraler Export aller Rettungsdienst-Templates
// =========================================================================================

// Import aller Templates
import { HERZINFARKT_TEMPLATE } from './herzinfarkt.js';
import { SCHLAGANFALL_TEMPLATE } from './schlaganfall.js';
import { BEWUSSTLOSIGKEIT_TEMPLATE } from './bewusstlosigkeit.js';
import { STURZ_TEMPLATE } from './sturz.js';
import { SYNKOPE_TEMPLATE } from './synkope.js';
import { VERKEHRSUNFALL_TEMPLATE } from './verkehrsunfall.js';
import { ASTHMA_TEMPLATE } from './asthma.js';
import { KRAMPFANFALL_TEMPLATE } from './krampfanfall.js';
import { GEBURT_TEMPLATE } from './geburt.js';
import { REANIMATION_TEMPLATE } from './reanimation.js';

// =========================================================================================
// TEMPLATE REGISTRY
// =========================================================================================

export const RD_TEMPLATES = {
    // Kardiovaskuläre Notfälle
    herzinfarkt: HERZINFARKT_TEMPLATE,
    schlaganfall: SCHLAGANFALL_TEMPLATE,
    synkope: SYNKOPE_TEMPLATE,
    reanimation: REANIMATION_TEMPLATE,
    
    // Bewusstseinsstörungen
    bewusstlosigkeit: BEWUSSTLOSIGKEIT_TEMPLATE,
    krampfanfall: KRAMPFANFALL_TEMPLATE,
    
    // Traumatologie
    sturz: STURZ_TEMPLATE,
    verkehrsunfall: VERKEHRSUNFALL_TEMPLATE,
    
    // Respiratorische Notfälle
    asthma: ASTHMA_TEMPLATE,
    
    // Geburtshilfe
    geburt: GEBURT_TEMPLATE
};

// =========================================================================================
// TEMPLATE METADATA
// =========================================================================================

export const TEMPLATE_METADATA = {
    version: '1.0.0',
    created: '2026-01-23',
    total_templates: Object.keys(RD_TEMPLATES).length,
    
    categories: {
        kardiovaskulär: ['herzinfarkt', 'schlaganfall', 'synkope', 'reanimation'],
        bewusstsein: ['bewusstlosigkeit', 'krampfanfall'],
        trauma: ['sturz', 'verkehrsunfall'],
        respiratorisch: ['asthma'],
        geburtshilfe: ['geburt']
    },
    
    severity_levels: {
        kritisch: ['reanimation', 'herzinfarkt', 'schlaganfall'],
        schwer: ['verkehrsunfall', 'krampfanfall', 'asthma'],
        mittel: ['bewusstlosigkeit', 'synkope', 'sturz'],
        variabel: ['geburt']
    },
    
    weights: {
        herzinfarkt: 4,
        schlaganfall: 3,
        bewusstlosigkeit: 3,
        sturz: 4,
        synkope: 3,
        verkehrsunfall: 3,
        asthma: 3,
        krampfanfall: 2,
        geburt: 1,
        reanimation: 2
    },
    
    total_weight: 28
};

// =========================================================================================
// HELPER FUNCTIONS
// =========================================================================================

/**
 * Gibt alle Template-IDs zurück
 */
export function getAllTemplateIds() {
    return Object.keys(RD_TEMPLATES);
}

/**
 * Gibt ein Template anhand der ID zurück
 */
export function getTemplateById(id) {
    const template = RD_TEMPLATES[id];
    if (!template) {
        console.warn(`Template '${id}' nicht gefunden`);
        return null;
    }
    return template;
}

/**
 * Gibt alle Templates einer Kategorie zurück
 */
export function getTemplatesByCategory(category) {
    const templateIds = TEMPLATE_METADATA.categories[category];
    if (!templateIds) {
        console.warn(`Kategorie '${category}' nicht gefunden`);
        return [];
    }
    return templateIds.map(id => RD_TEMPLATES[id]).filter(t => t !== null);
}

/**
 * Gibt alle Templates nach Schweregrad zurück
 */
export function getTemplatesBySeverity(severity) {
    const templateIds = TEMPLATE_METADATA.severity_levels[severity];
    if (!templateIds) {
        console.warn(`Schweregrad '${severity}' nicht gefunden`);
        return [];
    }
    return templateIds.map(id => RD_TEMPLATES[id]).filter(t => t !== null);
}

/**
 * Validiert ob ein Template alle erforderlichen Felder hat
 */
export function validateTemplate(template) {
    const required_fields = [
        'id',
        'kategorie',
        'stichwort',
        'weight',
        'anrufer',
        'patient',
        'locations'
    ];
    
    const missing = required_fields.filter(field => !template[field]);
    
    if (missing.length > 0) {
        console.error(`Template '${template.id}' fehlen Felder:`, missing);
        return false;
    }
    
    return true;
}

/**
 * Validiert alle Templates
 */
export function validateAllTemplates() {
    const results = {};
    let allValid = true;
    
    for (const [id, template] of Object.entries(RD_TEMPLATES)) {
        const isValid = validateTemplate(template);
        results[id] = isValid;
        if (!isValid) allValid = false;
    }
    
    return {
        allValid,
        results,
        summary: {
            total: Object.keys(results).length,
            valid: Object.values(results).filter(v => v).length,
            invalid: Object.values(results).filter(v => !v).length
        }
    };
}

/**
 * Gibt Template-Statistiken zurück
 */
export function getTemplateStats() {
    const templates = Object.values(RD_TEMPLATES);
    
    return {
        total: templates.length,
        categories: Object.keys(TEMPLATE_METADATA.categories).length,
        total_weight: TEMPLATE_METADATA.total_weight,
        average_weight: TEMPLATE_METADATA.total_weight / templates.length,
        templates_by_category: Object.fromEntries(
            Object.entries(TEMPLATE_METADATA.categories).map(
                ([cat, ids]) => [cat, ids.length]
            )
        )
    };
}

// =========================================================================================
// EXPORTS
// =========================================================================================

export default RD_TEMPLATES;

// Node.js Export für Kompatibilität
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RD_TEMPLATES,
        TEMPLATE_METADATA,
        getAllTemplateIds,
        getTemplateById,
        getTemplatesByCategory,
        getTemplatesBySeverity,
        validateTemplate,
        validateAllTemplates,
        getTemplateStats
    };
}
