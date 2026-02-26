// =========================================================================================
// TEMPLATE: COPD-EXAZERBATION
// Beschreibung: Akute Verschlechterung bei chronisch obstruktiver Lungenerkrankung
// =========================================================================================

export const COPD_TEMPLATE = {
    id: 'copd',
    kategorie: 'rd',
    stichwort: 'COPD-Exazerbation',
    weight: 3,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.25,
                speech_pattern: 'atemlos',
                variations: [
                    '*keuchend* Das... ist... schlimmer... als... sonst...',
                    'Meine... COPD... wird... nicht... besser... *hustet*',
                    '*pfeifend* Ich... brauche... Hilfe... bekomme... keine... Luft...'
                ]
            },
            angehöriger: {
                probability: 0.55,
                speech_pattern: 'besorgt',
                variations: [
                    'Er bekommt wieder schlecht Luft, viel schlechter als sonst.',
                    'Sie hustet grün-gelben Schleim und ringt nach Luft.',
                    'Es ist eine Exazerbation, das kenne ich. Aber diesmal ist es schlimmer.',
                    'Er hat Fieber und die Atemnot wird immer schlimmer.'
                ]
            },
            pflegepersonal: {
                probability: 0.20,
                speech_pattern: 'professionell',
                variations: [
                    'COPD-Patient mit akuter Exazerbation, SpO2 82%, Tachypnoe.',
                    'Bekannte COPD GOLD IV, zunehmende Dyspnoe seit 2 Tagen.',
                    'Patient mit produktivem Husten, Fieber, respiratorische Insuffizienz.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.58 },
            female: { probability: 0.42 }
        },
        alter: {
            distribution: 'normal',
            mean: 68,
            stddev: 10,
            min: 45,
            max: 90
        },
        bewusstsein: {
            wach: { probability: 0.70 },
            somnolent: { probability: 0.20 },
            bewusstlos: { probability: 0.10 }
        }
    },
    
    symptome: {
        hauptsymptome: {
            dyspnoe: { probability: 1.0 },
            husten_produktiv: { probability: 0.85 },
            sputum_verfärbt: { probability: 0.70 }
        },
        begleitsymptome: {
            fieber: { probability: 0.50 },
            zyanose: { probability: 0.35 },
            tachykardie: { probability: 0.60 },
            erschöpfung: { probability: 0.80 }
        }
    },
    
    locations: {
        zuhause: { probability: 0.60, address_types: ['residential'] },
        pflegeheim: { probability: 0.30, address_types: ['care_home'] },
        öffentlich: { probability: 0.10, address_types: ['public_place'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.20,
            triggers: ['spo2_unter_80', 'erschöpfung', 'bewusstseinsstörung']
        }
    },
    
    zeitfaktoren: {
        tageszeit_modifikator: {
            morgen_06_10: 1.4,
            nacht: 0.8
        },
        jahreszeit_modifikator: {
            winter: 1.5,
            herbst: 1.3
        }
    }
};

export default COPD_TEMPLATE;
