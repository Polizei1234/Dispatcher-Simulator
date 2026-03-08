// =========================================================================================
// TEMPLATE: HERZRHYTHMUSSTÖRUNGEN
// Beschreibung: Unregelmäßiger Herzschlag - von harmlos bis lebensbedrohlich
// =========================================================================================

export const HERZRHYTHMUSSTOERUNG_TEMPLATE = {
    id: 'herzrhythmusstoerung',
    kategorie: 'rd',
    stichwort: 'Herzrhythmusstörung',
    weight: 2,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.45,
                speech_pattern: 'besorgt',
                variations: [
                    'Mein Herz schlägt total unregelmäßig und sehr schnell!',
                    'Ich habe Herzrasen und mir ist schwindlig!',
                    'Mein Herz stolpert die ganze Zeit!',
                    'Ich spüre mein Herz bis zum Hals schlagen!'
                ]
            },
            angehöriger: {
                probability: 0.45,
                speech_pattern: 'besorgt',
                variations: [
                    'Ihr Puls ist extrem schnell und unregelmäßig!',
                    'Sein Herz rast, er hat Angst!',
                    'Sie ist ganz blass und ihr Herz schlägt wie verrückt!',
                    'Er hat Vorhofflimmern und es geht ihm sehr schlecht!'
                ]
            },
            pflegepersonal: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Patient mit Tachykardie, Puls 180, unregelmäßig.',
                    'Bewohnerin mit Vorhofflimmern, hämodynamisch instabil.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.50 },
            female: { probability: 0.50 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 35, stddev: 12, weight: 0.25 },
            peak2: { mean: 70, stddev: 10, weight: 0.75 },
            min: 20,
            max: 90
        },
        bewusstsein: {
            wach: { probability: 0.80 },
            verwirrt: { probability: 0.15 },
            bewusstlos: { probability: 0.05 }
        }
    },
    
    rhythmusstörung_typ: {
        tachykard: {
            vorhofflimmern: { probability: 0.40 },
            supraventrikuläre_tachykardie: { probability: 0.20 },
            ventrikuläre_tachykardie: { probability: 0.10 }
        },
        bradykard: {
            av_block: { probability: 0.15 },
            sinusbradykardie: { probability: 0.10 }
        },
        andere: { probability: 0.05 }
    },
    
    symptome: {
        hauptsymptome: {
            palpitationen: { probability: 0.90 },
            herzrasen: { probability: 0.75 },
            unregelmäßig: { probability: 0.70 }
        },
        begleitsymptome: {
            schwindel: { probability: 0.60 },
            dyspnoe: { probability: 0.50 },
            thoraxschmerz: { probability: 0.35 },
            angst: { probability: 0.70 },
            synkope: { probability: 0.15 },
            schwäche: { probability: 0.50 }
        }
    },
    
    locations: {
        zuhause: { probability: 0.70, address_types: ['residential'] },
        öffentlich: { probability: 0.20, address_types: ['public_place'] },
        pflegeheim: { probability: 0.10, address_types: ['care_home'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.15,
            triggers: ['instabil', 'synkope', 'ventrikuläre_rhythmusstörung']
        }
    },
    
    eskalation: {
        synkope: {
            probability: 0.12,
            announcement: 'Er ist bewusstlos geworden!'
        },
        herzinfarkt: {
            probability: 0.08,
            announcement: 'Jetzt hat sie starke Brustschmerzen!'
        }
    }
};

export default HERZRHYTHMUSSTOERUNG_TEMPLATE;