// =========================================================================================
// TEMPLATE: STURZ AUS HÖHE
// Beschreibung: Sturz von Leiter, Gerüst, etc. - Polytrauma-Potential
// =========================================================================================

export const STURZ_HOEHE_TEMPLATE = {
    id: 'sturz_hoehe',
    kategorie: 'rd',
    stichwort: 'Sturz aus Höhe',
    weight: 1,
    
    anrufer: {
        typen: {
            arbeitskollege: {
                probability: 0.40,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Kollege ist von der Leiter gefallen!',
                    'Jemand ist vom Gerüst gestürzt!',
                    'Er ist von der Treppe gefallen, liegt bewusstlos da!',
                    'Arbeitsunfall! Sturz aus circa 4 Meter Höhe!'
                ]
            },
            angehöriger: {
                probability: 0.35,
                speech_pattern: 'panisch',
                variations: [
                    'Mein Mann ist von der Leiter gefallen! Er bewegt sich nicht!',
                    'Sie ist vom Balkon gestürzt!',
                    'Er ist die Treppe runtergefallen und hat sich nicht mehr bewegt!'
                ],
                background_sounds: ['moaning', 'crying']
            },
            zeuge: {
                probability: 0.20,
                speech_pattern: 'schockiert',
                variations: [
                    'Jemand ist hier vom Dach gefallen!',
                    'Eine Person ist vom Balkon gestürzt!',
                    'Ich habe gesehen wie jemand von der Brücke gefallen ist!'
                ]
            },
            sicherheitsdienst: {
                probability: 0.05,
                speech_pattern: 'professionell',
                variations: [
                    'Sturz aus circa 3 Meter Höhe, Person bewusstlos.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.78 },
            female: { probability: 0.22 }
        },
        alter: {
            distribution: 'normal',
            mean: 42,
            stddev: 15,
            min: 18,
            max: 75
        },
        bewusstsein: {
            wach: { probability: 0.40 },
            verwirrt: { probability: 0.25 },
            bewusstlos: { probability: 0.35 }
        }
    },
    
    sturzhöhe: {
        unter_2m: {
            probability: 0.30,
            severity: 'leicht-mittel',
            beispiele: ['Treppe', 'niedrige Leiter']
        },
        2_4m: {
            probability: 0.40,
            severity: 'mittel-schwer',
            beispiele: ['Leiter', 'Balkon 1.OG']
        },
        4_8m: {
            probability: 0.20,
            severity: 'schwer',
            beispiele: ['Gerüst', 'Balkon 2.OG']
        },
        ueber_8m: {
            probability: 0.10,
            severity: 'kritisch',
            beispiele: ['Dach', 'höhere Stockwerke'],
            polytrauma_wahrscheinlich: true
        }
    },
    
    verletzungsmuster: {
        extremitäten: {
            frakturen: { probability: 0.70 },
            luxationen: { probability: 0.25 },
            prellungen: { probability: 0.80 }
        },
        wirbelsäule: {
            wirbelfraktur: { probability: 0.30 },
            rückenmarksverletzung: { probability: 0.10 }
        },
        schädel: {
            sht: { probability: 0.50 },
            schädelfraktur: { probability: 0.20 },
            intrakranielle_blutung: { probability: 0.15 }
        },
        thorax: {
            rippenfrakturen: { probability: 0.35 },
            pneumothorax: { probability: 0.15 },
            lungenkontusion: { probability: 0.20 }
        },
        abdomen: {
            organverletzungen: { probability: 0.20 },
            milzruptur: { probability: 0.08 },
            leberruptur: { probability: 0.06 }
        },
        becken: {
            beckenfraktur: { probability: 0.25 }
        }
    },
    
    symptome: {
        schmerzen: { probability: 0.85 },
        schockzeichen: { probability: 0.40 },
        deformitäten: { probability: 0.45 },
        offene_wunden: { probability: 0.35 },
        blutungen: { probability: 0.50 },
        lähmungen: { probability: 0.15 }
    },
    
    locations: {
        baustelle: { probability: 0.35, address_types: ['construction'] },
        privat_zuhause: { probability: 0.30, address_types: ['residential'] },
        betrieb: { probability: 0.20, address_types: ['commercial', 'industrial'] },
        öffentlich: { probability: 0.15, address_types: ['street', 'park'] }
    },
    
    umstände: {
        arbeitsunfall: { probability: 0.55 },
        hausunfall: { probability: 0.30 },
        suizidversuch: { probability: 0.05 },
        andere: { probability: 0.10 }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 1, ktw: 0 },
        nef_indikation: {
            probability: 0.70,
            triggers: ['hoehe_ueber_3m', 'bewusstlosigkeit', 'polytrauma']
        },
        rth_indikation: {
            probability: 0.15,
            triggers: ['hoehe_ueber_8m', 'kritisch', 'ländlich']
        },
        feuerwehr: {
            probability: 0.30,
            reasons: ['rettung', 'absturzsicherung', 'tragehilfe']
        },
        zielklinik: {
            traumazentrum: { probability: 0.80 },
            standard: { probability: 0.20 }
        }
    },
    
    eskalation: {
        schock: {
            probability: 0.20,
            announcement: 'Er wird ganz blass! Der Puls wird schwach!'
        },
        bewusstlosigkeit: {
            probability: 0.15,
            announcement: 'Jetzt ist er bewusstlos geworden!'
        },
        reanimation: {
            probability: 0.05,
            announcement: 'Er reagiert nicht mehr und atmet nicht!'
        }
    },
    
    besonderheiten: {
        arbeitsschutz: {
            probability: 0.40,
            note: 'Berufsgenossenschaft, Untersuchung'
        },
        polizei: {
            probability: 0.60,
            reasons: ['arbeitsunfall', 'fremdverschulden', 'suizidversuch']
        }
    },
    
    lernziele: [
        'Höhe als Trauma-Marker',
        'Polytrauma-Management',
        'Wirbelsäulen-Immobilisation',
        'Frühzeitige Nachforderung'
    ]
};

export default STURZ_HOEHE_TEMPLATE;