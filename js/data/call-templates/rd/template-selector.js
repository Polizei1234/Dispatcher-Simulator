// =========================================================================================
// TEMPLATE SELECTOR - Wählt Templates basierend auf Gewichtung und Kriterien
// =========================================================================================

import { RD_TEMPLATES, TEMPLATE_METADATA } from './index.js';

// =========================================================================================
// HAUPTFUNKTION: TEMPLATE AUSWÄHLEN
// =========================================================================================

/**
 * Wählt ein zufälliges Template basierend auf Gewichtung
 * @param {Object} options - Optionen für die Auswahl
 * @returns {Object} - Ausgewähltes Template
 */
export function selectRandomTemplate(options = {}) {
    const {
        category = null,           // Bestimmte Kategorie wählen
        severity = null,           // Bestimmter Schweregrad
        excludeIds = [],           // IDs ausschließen
        timeOfDay = null,          // Tageszeit (0-23)
        dayOfWeek = null,          // Wochentag (0-6, 0=Sonntag)
        season = null,             // Jahreszeit
        weights = null             // Eigene Gewichtungen
    } = options;
    
    // Filter Templates
    let availableTemplates = Object.entries(RD_TEMPLATES)
        .filter(([id, template]) => {
            // Ausgeschlossene IDs
            if (excludeIds.includes(id)) return false;
            
            // Kategorie-Filter
            if (category) {
                const catTemplates = TEMPLATE_METADATA.categories[category];
                if (!catTemplates || !catTemplates.includes(id)) return false;
            }
            
            // Schweregrad-Filter
            if (severity) {
                const sevTemplates = TEMPLATE_METADATA.severity_levels[severity];
                if (!sevTemplates || !sevTemplates.includes(id)) return false;
            }
            
            return true;
        });
    
    if (availableTemplates.length === 0) {
        console.warn('Keine Templates nach Filter verfügbar, nutze alle');
        availableTemplates = Object.entries(RD_TEMPLATES);
    }
    
    // Gewichtungen anwenden
    const templateWeights = weights || TEMPLATE_METADATA.weights;
    
    // Zeitbasierte Gewichtungs-Modifikatoren
    const modifiedWeights = availableTemplates.map(([id, template]) => {
        let weight = templateWeights[id] || 1;
        
        // Tageszeit-Modifikatoren
        if (timeOfDay !== null) {
            weight *= getTimeOfDayModifier(id, timeOfDay);
        }
        
        // Wochentag-Modifikatoren
        if (dayOfWeek !== null) {
            weight *= getDayOfWeekModifier(id, dayOfWeek);
        }
        
        // Jahreszeit-Modifikatoren
        if (season !== null) {
            weight *= getSeasonModifier(id, season);
        }
        
        return { id, template, weight };
    });
    
    // Gewichtete Zufallsauswahl
    const selected = weightedRandomSelect(modifiedWeights);
    
    return {
        id: selected.id,
        template: selected.template,
        metadata: {
            originalWeight: templateWeights[selected.id],
            modifiedWeight: selected.weight,
            category: getCategoryForTemplate(selected.id),
            severity: getSeverityForTemplate(selected.id)
        }
    };
}

// =========================================================================================
// GEWICHTETE ZUFALLSAUSWAHL
// =========================================================================================

/**
 * Wählt zufällig basierend auf Gewichtungen
 */
function weightedRandomSelect(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
        random -= item.weight;
        if (random <= 0) {
            return item;
        }
    }
    
    // Fallback
    return items[items.length - 1];
}

// =========================================================================================
// ZEITBASIERTE MODIFIKATOREN
// =========================================================================================

/**
 * Tageszeit-Modifikator (0-23 Uhr)
 */
function getTimeOfDayModifier(templateId, hour) {
    const modifiers = {
        // Nacht (22-6 Uhr)
        herzinfarkt: hour >= 22 || hour < 6 ? 1.3 : 1.0,  // Häufiger nachts
        reanimation: hour >= 22 || hour < 6 ? 1.2 : 1.0,
        sturz: hour >= 22 || hour < 6 ? 1.4 : 1.0,        // Ältere nachts auf Toilette
        
        // Tag (6-22 Uhr)
        verkehrsunfall: hour >= 6 && hour < 22 ? 1.5 : 0.5,  // Tagsüber mehr Verkehr
        asthma: hour >= 6 && hour < 10 ? 1.3 : 1.0,          // Morgens häufiger
        
        // Arbeitszeit (7-18 Uhr)
        schlaganfall: hour >= 7 && hour < 18 ? 1.2 : 1.0,
        
        // Abend (18-23 Uhr)
        geburt: hour >= 18 && hour < 23 ? 1.3 : 1.0  // Geburten oft abends/nachts
    };
    
    return modifiers[templateId] || 1.0;
}

/**
 * Wochentag-Modifikator (0=Sonntag, 6=Samstag)
 */
function getDayOfWeekModifier(templateId, dayOfWeek) {
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const modifiers = {
        verkehrsunfall: isWeekend ? 1.3 : 1.0,      // Mehr Verkehr am Wochenende
        reanimation: isWeekend ? 1.2 : 1.0,         // Mehr Alkohol, spätere Entdeckung
        sturz: !isWeekend ? 1.2 : 1.0,              // Alleine zuhause unter der Woche
        herzinfarkt: dayOfWeek === 1 ? 1.4 : 1.0    // Montags häufiger (Stress)
    };
    
    return modifiers[templateId] || 1.0;
}

/**
 * Jahreszeit-Modifikator
 */
function getSeasonModifier(templateId, season) {
    const modifiers = {
        winter: {
            herzinfarkt: 1.3,      // Kälte belastet Herz
            schlaganfall: 1.2,
            sturz: 1.4,            // Glatteis
            asthma: 1.2,           // Kälteasthma
            reanimation: 1.2
        },
        spring: {
            asthma: 1.4,           // Pollenflug
            verkehrsunfall: 1.1    // Mehr Verkehr
        },
        summer: {
            verkehrsunfall: 1.3,   // Urlaubsverkehr
            synkope: 1.3,          // Hitze
            geburt: 1.1            // Leicht mehr Geburten
        },
        autumn: {
            asthma: 1.2,           // Infekte
            sturz: 1.1             // Laub, Rutschgefahr
        }
    };
    
    return modifiers[season]?.[templateId] || 1.0;
}

// =========================================================================================
// HELPER FUNCTIONS
// =========================================================================================

/**
 * Findet Kategorie für Template-ID
 */
function getCategoryForTemplate(templateId) {
    for (const [category, ids] of Object.entries(TEMPLATE_METADATA.categories)) {
        if (ids.includes(templateId)) return category;
    }
    return 'unknown';
}

/**
 * Findet Schweregrad für Template-ID
 */
function getSeverityForTemplate(templateId) {
    for (const [severity, ids] of Object.entries(TEMPLATE_METADATA.severity_levels)) {
        if (ids.includes(templateId)) return severity;
    }
    return 'unknown';
}

/**
 * Gibt aktuelle Jahreszeit zurück
 */
export function getCurrentSeason(date = new Date()) {
    const month = date.getMonth();
    
    if (month >= 2 && month <= 4) return 'spring';   // März-Mai
    if (month >= 5 && month <= 7) return 'summer';   // Juni-August
    if (month >= 8 && month <= 10) return 'autumn';  // September-November
    return 'winter';                                  // Dezember-Februar
}

// =========================================================================================
// SPEZIELLE AUSWAHLMETHODEN
// =========================================================================================

/**
 * Wählt Template für bestimmte Tageszeit
 */
export function selectTemplateForTime(hour = new Date().getHours(), options = {}) {
    return selectRandomTemplate({
        ...options,
        timeOfDay: hour
    });
}

/**
 * Wählt Template mit realistischen Zeitfaktoren
 */
export function selectRealisticTemplate(options = {}) {
    const now = new Date();
    
    return selectRandomTemplate({
        ...options,
        timeOfDay: now.getHours(),
        dayOfWeek: now.getDay(),
        season: getCurrentSeason(now)
    });
}

/**
 * Wählt Template aus bestimmter Kategorie
 */
export function selectFromCategory(category, options = {}) {
    return selectRandomTemplate({
        ...options,
        category
    });
}

/**
 * Wählt Template mit bestimmtem Schweregrad
 */
export function selectBySeverity(severity, options = {}) {
    return selectRandomTemplate({
        ...options,
        severity
    });
}

/**
 * Generiert eine Serie von Templates ohne Wiederholung
 */
export function generateTemplateSeries(count, options = {}) {
    const series = [];
    const excludeIds = [];
    
    for (let i = 0; i < count; i++) {
        const selected = selectRandomTemplate({
            ...options,
            excludeIds
        });
        
        series.push(selected);
        excludeIds.push(selected.id);
        
        // Wenn alle Templates genutzt, reset
        if (excludeIds.length >= Object.keys(RD_TEMPLATES).length) {
            excludeIds.length = 0;
        }
    }
    
    return series;
}

/**
 * Gibt Template-Statistiken für Zeitraum zurück
 */
export function getTemplateDistribution(options = {}, sampleSize = 1000) {
    const distribution = {};
    
    for (let i = 0; i < sampleSize; i++) {
        const selected = selectRandomTemplate(options);
        distribution[selected.id] = (distribution[selected.id] || 0) + 1;
    }
    
    // In Prozent umrechnen
    const percentages = {};
    for (const [id, count] of Object.entries(distribution)) {
        percentages[id] = ((count / sampleSize) * 100).toFixed(2) + '%';
    }
    
    return {
        counts: distribution,
        percentages,
        sampleSize
    };
}

// =========================================================================================
// EXPORTS
// =========================================================================================

export default selectRandomTemplate;

// Node.js Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectRandomTemplate,
        selectTemplateForTime,
        selectRealisticTemplate,
        selectFromCategory,
        selectBySeverity,
        generateTemplateSeries,
        getTemplateDistribution,
        getCurrentSeason
    };
}
