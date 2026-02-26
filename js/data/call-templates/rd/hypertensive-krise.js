// =========================================================================================
// TEMPLATE: HYPERTENSIVE KRISE
// Beschreibung: Akut lebensbedrohlich hoher Blutdruck
// =========================================================================================

export const HYPERTENSIVE_KRISE_TEMPLATE = {
    id: 'hypertensive_krise',
    kategorie: 'rd',
    stichwort: 'Hypertensive Krise',
    weight: 2,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.30,
                speech_pattern: 'besorgt',
                variations: [
                    'Ich habe wahnsinnige Kopfschmerzen und mein Blutdruck ist extrem hoch!',
                    'Mir ist schwindlig und ich sehe Doppelbilder, mein RR ist 220!',
                    'Ich habe Nasenbluten und starke Kopfschmerzen!',
                    'Mein Blutdruckmessgerät zeigt 240 zu 130!'
                ]
            },
            angehöriger: {
                probability: 0.60,
                speech_pattern: 'besorgt',
                variations: [
                    'Mein Mann hat extremen Blutdruck und starke Kopfschmerzen!',
                    'Sie hat 230/120 gemessen und ist verwirrt!',
                    'Er hat Brustschmerzen und der Blutdruck ist viel zu hoch!',
                    'Sie klagt über Sehstörungen, der Blutdruck ist extrem!'
                ]
            },
            pflegepersonal: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Patient mit hypertensiver Krise, RR 240/130, Kopfschmerzen.',
                    'Bewohnerin mit entgleistem Blutdruck, 220/110, verwirrt.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.52 },
            female: { probability: 0.48 }
        },
        alter: {
            distribution: 'normal',
            mean: 62,
            stddev: 12,
            min: 35,
            max: 85
        },
        bewusstsein: {
            wach: { probability: 0.75 },
            verwirrt: { probability: 0.20 },
            bewusstlos: { probability: 0.05 }
        }
    },
    
    blutdruck: {
        schweregrad: {
            notfall: {
                probability: 0.40,
                werte: '180-220 / 110-130',
                organschäden: 'keine akuten'
            },
            krise: {
                probability: 0.60,
                werte: '> 220 / > 130',
                organschäden: 'akut drohend/vorhanden'
            }
        }
    },
    
    symptome: {
        hauptsymptome: {
            kopfschmerzen: { probability: 0.85 },
            schwindel: { probability: 0.70 },
            übelkeit: { probability: 0.60 }
        },
        organschäden: {
            sehstörungen: { probability: 0.35 },
            brustschmerz: { probability: 0.30 },
            dyspnoe: { probability: 0.25 },
            neurologisch: { probability: 0.20 },
            nasenbluten: { probability: 0.15 }
        }
    },
    
    ursachen: {
        medikamente_abgesetzt: { probability: 0.30 },
        stress: { probability: 0.25 },
        nierenerkrankung: { probability: 0.15 },
        unbekannt: { probability: 0.30 }
    },
    
    locations: {
        zuhause: { probability: 0.75, address_types: ['residential'] },
        öffentlich: { probability: 0.15, address_types: ['public_place'] },
        pflegeheim: { probability: 0.10, address_types: ['care_home'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.20,
            triggers: ['organschäden', 'neurologisch', 'lungenödem']
        }
    },
    
    eskalation: {
        schlaganfall: {
            probability: 0.10,
            announcement: 'Er kann plötzlich nicht mehr sprechen!',
            template_change: 'schlaganfall'
        },
        herzinfarkt: {
            probability: 0.08,
            announcement: 'Jetzt hat sie starke Brustschmerzen!',
            template_change: 'herzinfarkt'
        },
        lungenödem: {
            probability: 0.05,
            announcement: 'Er bekommt keine Luft mehr!'
        }
    }
};

export default HYPERTENSIVE_KRISE_TEMPLATE;