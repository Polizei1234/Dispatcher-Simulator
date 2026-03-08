// =========================================================================================
// TEMPLATE: SCHÄDEL-HIRN-TRAUMA (SHT)
// Beschreibung: Kopfverletzung mit möglicher Hirnschädigung
// =========================================================================================

export const SHT_TEMPLATE = {
    id: 'sht',
    kategorie: 'rd',
    stichwort: 'Schädel-Hirn-Trauma',
    weight: 2,
    
    anrufer: {
        typen: {
            angehöriger_besorgt: {
                probability: 0.45,
                speech_pattern: 'besorgt',
                variations: [
                    'Er ist mit dem Kopf aufgeschlagen und ist jetzt verwirrt!',
                    'Sie hat eine Platzwunde am Kopf und erbricht!',
                    'Er ist bewusstlos nach einem Schlag auf den Kopf!',
                    'Sie ist gestürzt und hat stark am Kopf geblutet!'
                ]
            },
            zeuge: {
                probability: 0.30,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Jemand ist mit dem Kopf gegen die Windschutzscheibe geknallt!',
                    'Eine Person liegt hier bewusstlos, stark blutend am Kopf!',
                    'Er ist auf den Kopf gefallen, bewegt sich nicht mehr!'
                ]
            },
            patient_selbst: {
                probability: 0.15,
                speech_pattern: 'verwirrt',
                variations: [
                    'Ich bin gestürzt... mir ist schwindlig... *verwirrt*',
                    'Ich habe starke Kopfschmerzen nach dem Sturz...',
                    'Mir ist übel und alles dreht sich...'
                ]
            },
            pflegepersonal: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Patient mit SHT nach Sturz, bewusstlos, GCS 8.',
                    'Bewohnerin mit Kopfplatzwunde, zunehmend somnolent.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.65 },
            female: { probability: 0.35 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 28, stddev: 12, weight: 0.4 },
            peak2: { mean: 72, stddev: 10, weight: 0.6 },
            min: 1,
            max: 95
        },
        bewusstsein: {
            wach_orientiert: { probability: 0.30 },
            wach_verwirrt: { probability: 0.25 },
            somnolent: { probability: 0.25 },
            bewusstlos: { probability: 0.20 }
        }
    },
    
    schweregrad: {
        leicht_sht_1: {
            probability: 0.50,
            gcs: '13-15',
            bewusstlosigkeit: 'keine oder <1min',
            severity: 'leicht'
        },
        mittel_sht_2: {
            probability: 0.35,
            gcs: '9-12',
            bewusstlosigkeit: '1-30min',
            severity: 'mittel'
        },
        schwer_sht_3: {
            probability: 0.15,
            gcs: '3-8',
            bewusstlosigkeit: '>30min',
            severity: 'schwer'
        }
    },
    
    verletzungen: {
        kopfplatzwunde: { probability: 0.70 },
        schädelfraktur: { probability: 0.20 },
        epiduralhämatom: { probability: 0.08 },
        subduralhämatom: { probability: 0.12 },
        hirnkontusion: { probability: 0.25 },
        diffuser_axonalschaden: { probability: 0.05 }
    },
    
    symptome: {
        hauptsymptome: {
            bewusstseinsstörung: { probability: 0.70 },
            kopfschmerzen: { probability: 0.85 },
            amnesie: { probability: 0.60 }
        },
        begleitsymptome: {
            übelkeit_erbrechen: { probability: 0.55 },
            schwindel: { probability: 0.65 },
            sehstörungen: { probability: 0.30 },
            lähmungen: { probability: 0.15 },
            pupillenstörungen: { probability: 0.20 },
            krampfanfall: { probability: 0.10 }
        },
        warnzeichen: {
            zunehmende_bewusstseinstrübung: { probability: 0.15 },
            anisokorie: { probability: 0.12 },
            rezidivierendes_erbrechen: { probability: 0.20 }
        }
    },
    
    unfallmechanismus: {
        sturz: { probability: 0.50 },
        verkehrsunfall: { probability: 0.25 },
        gewalteinwirkung: { probability: 0.15 },
        sport: { probability: 0.08 },
        andere: { probability: 0.02 }
    },
    
    locations: {
        zuhause: { probability: 0.40, address_types: ['residential'] },
        unfallstelle: { probability: 0.30, address_types: ['street', 'accident'] },
        öffentlich: { probability: 0.20, address_types: ['public_place'] },
        pflegeheim: { probability: 0.10, address_types: ['care_home'] }
    },
    
    besonderheiten: {
        antikoagulation: {
            probability: 0.30,
            note: 'Erhöhtes Blutungsrisiko!',
            dringlichkeit: 'höher'
        },
        alkohol: {
            probability: 0.25,
            note: 'Diagnostik erschwert'
        },
        initial_interval: {
            probability: 0.10,
            note: 'Lucid interval bei Epiduralhämatom'
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.35,
            triggers: ['gcs_unter_9', 'bewusstlosigkeit', 'krampfanfall', 'pupillenstörung']
        },
        zielklinik: {
            traumazentrum: { probability: 0.60 },
            neurochirurgie: { probability: 0.30 },
            standard: { probability: 0.10 }
        }
    },
    
    eskalation: {
        verschlechterung: {
            probability: 0.15,
            announcement: 'Er wird immer schläfriger! Reagiert kaum noch!',
            note: 'Intrakranielle Blutung'
        },
        krampfanfall: {
            probability: 0.08,
            announcement: 'Er krampft jetzt!'
        },
        bewusstlosigkeit: {
            probability: 0.12,
            announcement: 'Jetzt ist sie bewusstlos geworden!'
        }
    },
    
    zeitfaktoren: {
        zeitpunkt: {
            sofort: { probability: 0.60 },
            verzögert_stunden: { probability: 0.30 },
            tage_später: { probability: 0.10 }
        }
    },
    
    lernziele: [
        'SHT-Schweregrad einschätzen',
        'Warnzeichen erkennen',
        'Antikoagulation als Risikofaktor',
        'Beobachtungsbedarf auch bei leichtem SHT'
    ]
};

export default SHT_TEMPLATE;