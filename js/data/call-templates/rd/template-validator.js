// =========================================================================================
// TEMPLATE VALIDATOR - Validiert Template-Struktur und Datenintegrität
// =========================================================================================

import { RD_TEMPLATES } from './index.js';

// =========================================================================================
// VALIDIERUNGS-REGELN
// =========================================================================================

const VALIDATION_RULES = {
    // Pflichtfelder auf oberster Ebene
    requiredFields: [
        'id',
        'kategorie',
        'stichwort',
        'weight',
        'anrufer',
        'patient',
        'locations'
    ],
    
    // Erlaubte Kategorien
    validCategories: ['rd', 'polizei', 'feuerwehr'],
    
    // Gültige Weight-Range
    weightRange: { min: 1, max: 10 },
    
    // Anrufer muss haben
    anruferRequired: ['typen'],
    
    // Patient muss haben
    patientRequired: ['geschlecht', 'alter'],
    
    // Locations muss haben
    locationsRequired: true,  // Mindestens ein Eintrag
    
    // Probability-Felder müssen zwischen 0 und 1 sein
    probabilityRange: { min: 0, max: 1 }
};

// =========================================================================================
// HAUPT-VALIDIERUNG
// =========================================================================================

/**
 * Validiert ein einzelnes Template
 */
export function validateTemplate(template, templateId = null) {
    const errors = [];
    const warnings = [];
    
    const id = templateId || template.id || 'unknown';
    
    // 1. Pflichtfelder prüfen
    for (const field of VALIDATION_RULES.requiredFields) {
        if (!template[field]) {
            errors.push(`[${id}] Pflichtfeld fehlt: ${field}`);
        }
    }
    
    // 2. Kategorie prüfen
    if (template.kategorie && !VALIDATION_RULES.validCategories.includes(template.kategorie)) {
        errors.push(`[${id}] Ungültige Kategorie: ${template.kategorie}`);
    }
    
    // 3. Weight prüfen
    if (template.weight !== undefined) {
        const { min, max } = VALIDATION_RULES.weightRange;
        if (template.weight < min || template.weight > max) {
            warnings.push(`[${id}] Weight außerhalb empfohlener Range (${min}-${max}): ${template.weight}`);
        }
    }
    
    // 4. Anrufer-Struktur prüfen
    if (template.anrufer) {
        validateAnrufer(template.anrufer, id, errors, warnings);
    }
    
    // 5. Patient-Struktur prüfen
    if (template.patient) {
        validatePatient(template.patient, id, errors, warnings);
    }
    
    // 6. Locations prüfen
    if (template.locations) {
        validateLocations(template.locations, id, errors, warnings);
    }
    
    // 7. Wahrscheinlichkeiten prüfen
    validateProbabilities(template, id, errors, warnings);
    
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        templateId: id
    };
}

/**
 * Validiert alle Templates
 */
export function validateAllTemplates() {
    const results = {};
    let totalErrors = 0;
    let totalWarnings = 0;
    
    for (const [id, template] of Object.entries(RD_TEMPLATES)) {
        const result = validateTemplate(template, id);
        results[id] = result;
        totalErrors += result.errors.length;
        totalWarnings += result.warnings.length;
    }
    
    const allValid = Object.values(results).every(r => r.valid);
    
    return {
        allValid,
        totalTemplates: Object.keys(results).length,
        validTemplates: Object.values(results).filter(r => r.valid).length,
        invalidTemplates: Object.values(results).filter(r => !r.valid).length,
        totalErrors,
        totalWarnings,
        results
    };
}

// =========================================================================================
// SPEZIFISCHE VALIDIERUNGEN
// =========================================================================================

/**
 * Validiert Anrufer-Struktur
 */
function validateAnrufer(anrufer, id, errors, warnings) {
    if (!anrufer.typen) {
        errors.push(`[${id}] Anrufer.typen fehlt`);
        return;
    }
    
    // Prüfe ob mindestens ein Typ vorhanden
    const types = Object.keys(anrufer.typen);
    if (types.length === 0) {
        errors.push(`[${id}] Anrufer.typen ist leer`);
    }
    
    // Prüfe jeden Typ
    let totalProbability = 0;
    for (const [typeName, typeData] of Object.entries(anrufer.typen)) {
        if (!typeData.probability) {
            warnings.push(`[${id}] Anrufer-Typ '${typeName}' hat keine probability`);
        } else {
            totalProbability += typeData.probability;
        }
        
        if (!typeData.speech_pattern) {
            warnings.push(`[${id}] Anrufer-Typ '${typeName}' hat kein speech_pattern`);
        }
        
        if (!typeData.variations || typeData.variations.length === 0) {
            warnings.push(`[${id}] Anrufer-Typ '${typeName}' hat keine variations`);
        }
    }
    
    // Wahrscheinlichkeiten sollten ungefähr 1.0 ergeben
    if (Math.abs(totalProbability - 1.0) > 0.1) {
        warnings.push(`[${id}] Anrufer-Typen Wahrscheinlichkeiten ergeben ${totalProbability.toFixed(2)}, sollte ~1.0 sein`);
    }
}

/**
 * Validiert Patient-Struktur
 */
function validatePatient(patient, id, errors, warnings) {
    // Geschlecht prüfen
    if (!patient.geschlecht) {
        errors.push(`[${id}] Patient.geschlecht fehlt`);
    } else {
        const total = (patient.geschlecht.male || 0) + (patient.geschlecht.female || 0);
        if (Math.abs(total - 1.0) > 0.01) {
            warnings.push(`[${id}] Patient.geschlecht Wahrscheinlichkeiten ergeben ${total.toFixed(2)}`);
        }
    }
    
    // Alter prüfen
    if (!patient.alter) {
        errors.push(`[${id}] Patient.alter fehlt`);
    } else {
        if (patient.alter.min !== undefined && patient.alter.max !== undefined) {
            if (patient.alter.min >= patient.alter.max) {
                errors.push(`[${id}] Patient.alter: min >= max`);
            }
        }
    }
}

/**
 * Validiert Locations-Struktur
 */
function validateLocations(locations, id, errors, warnings) {
    const locationTypes = Object.keys(locations);
    
    if (locationTypes.length === 0) {
        errors.push(`[${id}] Locations ist leer`);
        return;
    }
    
    // Prüfe Wahrscheinlichkeiten
    let totalProbability = 0;
    for (const [locName, locData] of Object.entries(locations)) {
        if (!locData.probability) {
            warnings.push(`[${id}] Location '${locName}' hat keine probability`);
        } else {
            totalProbability += locData.probability;
        }
        
        if (!locData.address_types || locData.address_types.length === 0) {
            warnings.push(`[${id}] Location '${locName}' hat keine address_types`);
        }
    }
    
    if (Math.abs(totalProbability - 1.0) > 0.1) {
        warnings.push(`[${id}] Locations Wahrscheinlichkeiten ergeben ${totalProbability.toFixed(2)}`);
    }
}

/**
 * Validiert alle Wahrscheinlichkeits-Felder rekursiv
 */
function validateProbabilities(obj, id, errors, warnings, path = '') {
    if (!obj || typeof obj !== 'object') return;
    
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (key === 'probability' && typeof value === 'number') {
            const { min, max } = VALIDATION_RULES.probabilityRange;
            if (value < min || value > max) {
                errors.push(`[${id}] Ungültige probability bei ${currentPath}: ${value}`);
            }
        }
        
        if (typeof value === 'object') {
            validateProbabilities(value, id, errors, warnings, currentPath);
        }
    }
}

// =========================================================================================
// KONSISTENZ-PRÜFUNGEN
// =========================================================================================

/**
 * Prüft Konsistenz zwischen Templates
 */
export function checkTemplateConsistency() {
    const issues = [];
    
    // 1. Prüfe auf doppelte IDs
    const ids = Object.keys(RD_TEMPLATES);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
        issues.push('Doppelte Template-IDs gefunden');
    }
    
    // 2. Prüfe auf doppelte Stichwort-Namen
    const stichwort = Object.values(RD_TEMPLATES).map(t => t.stichwort);
    const uniqueStichwort = new Set(stichwort);
    if (stichwort.length !== uniqueStichwort.size) {
        issues.push('Doppelte Stichwort-Namen gefunden');
    }
    
    // 3. Prüfe Weight-Verteilung
    const weights = Object.values(RD_TEMPLATES).map(t => t.weight);
    const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    
    if (maxWeight / minWeight > 10) {
        issues.push(`Sehr große Weight-Differenz: ${minWeight} - ${maxWeight}`);
    }
    
    return {
        consistent: issues.length === 0,
        issues,
        stats: {
            totalTemplates: ids.length,
            avgWeight: avgWeight.toFixed(2),
            weightRange: `${minWeight} - ${maxWeight}`
        }
    };
}

// =========================================================================================
// STATISTIK & REPORTING
// =========================================================================================

/**
 * Erstellt Validierungs-Report
 */
export function generateValidationReport() {
    const validation = validateAllTemplates();
    const consistency = checkTemplateConsistency();
    
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalTemplates: validation.totalTemplates,
            valid: validation.validTemplates,
            invalid: validation.invalidTemplates,
            errors: validation.totalErrors,
            warnings: validation.totalWarnings,
            consistent: consistency.consistent
        },
        validation,
        consistency
    };
    
    return report;
}

/**
 * Gibt formatierten Validierungs-Report aus
 */
export function printValidationReport() {
    const report = generateValidationReport();
    
    console.log('\n=== TEMPLATE VALIDATION REPORT ===\n');
    console.log(`Total Templates: ${report.summary.totalTemplates}`);
    console.log(`Valid: ${report.summary.valid}`);
    console.log(`Invalid: ${report.summary.invalid}`);
    console.log(`Total Errors: ${report.summary.errors}`);
    console.log(`Total Warnings: ${report.summary.warnings}`);
    console.log(`Consistent: ${report.summary.consistent}\n`);
    
    if (report.summary.errors > 0) {
        console.log('=== ERRORS ===\n');
        for (const [id, result] of Object.entries(report.validation.results)) {
            if (result.errors.length > 0) {
                console.log(`Template: ${id}`);
                result.errors.forEach(err => console.log(`  - ${err}`));
            }
        }
        console.log('');
    }
    
    if (report.summary.warnings > 0) {
        console.log('=== WARNINGS ===\n');
        for (const [id, result] of Object.entries(report.validation.results)) {
            if (result.warnings.length > 0) {
                console.log(`Template: ${id}`);
                result.warnings.forEach(warn => console.log(`  - ${warn}`));
            }
        }
        console.log('');
    }
    
    if (!report.consistency.consistent) {
        console.log('=== CONSISTENCY ISSUES ===\n');
        report.consistency.issues.forEach(issue => console.log(`  - ${issue}`));
        console.log('');
    }
    
    if (report.summary.errors === 0 && report.summary.warnings === 0 && report.consistency.consistent) {
        console.log('✅ Alle Templates sind valide!\n');
    }
    
    return report;
}

// =========================================================================================
// FIELD COVERAGE ANALYSIS
// =========================================================================================

/**
 * Analysiert welche optionalen Felder in Templates verwendet werden
 */
export function analyzeFieldCoverage() {
    const fields = {};
    
    function analyzeObject(obj, prefix = '') {
        for (const [key, value] of Object.entries(obj)) {
            const fieldPath = prefix ? `${prefix}.${key}` : key;
            fields[fieldPath] = (fields[fieldPath] || 0) + 1;
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                analyzeObject(value, fieldPath);
            }
        }
    }
    
    for (const template of Object.values(RD_TEMPLATES)) {
        analyzeObject(template);
    }
    
    const totalTemplates = Object.keys(RD_TEMPLATES).length;
    const coverage = {};
    
    for (const [field, count] of Object.entries(fields)) {
        coverage[field] = {
            count,
            percentage: ((count / totalTemplates) * 100).toFixed(1) + '%'
        };
    }
    
    return coverage;
}

// =========================================================================================
// EXPORTS
// =========================================================================================

export default validateTemplate;

// Node.js Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateTemplate,
        validateAllTemplates,
        checkTemplateConsistency,
        generateValidationReport,
        printValidationReport,
        analyzeFieldCoverage
    };
}
