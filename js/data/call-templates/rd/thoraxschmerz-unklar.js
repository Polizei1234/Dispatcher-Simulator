// =========================================================================================
// TEMPLATE: THORAXSCHMERZ (UNKLARE URSACHE)
// Beschreibung: Brustschmerzen ohne klare Diagnose - breites Spektrum
// =========================================================================================

export const THORAXSCHMERZ_UNKLAR_TEMPLATE = {
    id: 'thoraxschmerz_unklar',
    kategorie: 'rd',
    stichwort: 'Thoraxschmerz (unklare Ursache)',
    weight: 3,
    
    anrufer: {
        typen: {
            patient_selbst_besorgt: {
                probability: 0.50,
                speech_pattern: 'besorgt',
                variations: [
                    'Ich habe Brustschmerzen... ich weiß nicht was das ist...',
                    'Meine Brust tut weh, beim Atmen wird es schlimmer.',
                    'Ich habe ein Stechen in der Brust...',
                    'Es drückt auf der Brust, ich mache mir Sorgen.'
                ]
            },
            angehöriger: {
                probability: 0.40,
                speech_pattern: 'besorgt',
                variations: [
                    'Sie hat Schmerzen in der Brust und macht sich Sorgen.',
                    'Er klagt über Brustschmerzen, wir wollen sicher gehen.',
                    'Sie hat Schmerzen beim Atmen in der Brust.'
                ]
            },
            hausarzt: {
                probability: 0.10,
                speech_pattern: 'ärztlich',
                variations: [
                    'Hausarzt, Patient mit Thoraxschmerz, EKG unauffällig, zur Abklärung Transport.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.48 },
            female: { probability: 0.52 }
        },
        alter: {
            distribution: 'normal',
            mean: 52,
            stddev: 18,
            min: 20,
            max: 85
        },
        bewusstsein: {
            wach: { probability: 0.95 },
            verwirrt: { probability: 0.05 }
        }
    },
    
    schmerzcharakter: {
        stechend: { probability: 0.35 },
        drückend: { probability: 0.25 },
        brennend: { probability: 0.20 },
        ziehend: { probability: 0.15 },
        andere: { probability: 0.05 }
    },
    
    lokalisation: {
        links: { probability: 0.40 },
        mitte: { probability: 0.30 },
        rechts: { probability: 0.15 },
        diffus: { probability: 0.15 }
    },
    
    auslöser_verstärker: {
        atemabhängig: { probability: 0.40 },
        bewegungsabhängig: { probability: 0.30 },
        belastungsabhängig: { probability: 0.20 },
        spontan: { probability: 0.35 }
    },
    
    mögliche_ursachen: {
        muskuloskeletal: {
            probability: 0.35,
            beispiele: ['muskelverspannung', 'rippenprellung', 'interkostalneuralgie'],
            prognose: 'harmlos'
        },
        gastrointestinal: {
            probability: 0.20,
            beispiele: ['reflux', 'speiseröhrenkrampf', 'gastritis'],
            prognose: 'harmlos'
        },
        kardial: {
            probability: 0.15,
            beispiele: ['angina_pectoris', 'herzinfarkt_atypisch'],
            prognose: 'ernst',
            abklaerung_zwingend: true
        },
        pulmonal: {
            probability: 0.15,
            beispiele: ['pleuritis', 'pneumonie', 'lungenembolie'],
            prognose: 'ernst'
        },
        psychogen: {
            probability: 0.10,
            beispiele: ['panikattacke', 'angst', 'stress'],
            prognose: 'harmlos_aber_subjektiv_belastend'
        },
        andere: {
            probability: 0.05
        }
    },
    
    begleitsymptome: {
        atemnot: { probability: 0.30 },
        husten: { probability: 0.25 },
        übelkeit: { probability: 0.20 },
        schwitzen: { probability: 0.15 },
        schwindel: { probability: 0.20 },
        angst: { probability: 0.40 }
    },
    
    locations: {
        zuhause: { probability: 0.70, address_types: ['residential'] },
        arbeitsplatz: { probability: 0.15, address_types: ['office'] },
        arztpraxis: { probability: 0.10, address_types: ['medical'] },
        andere: { probability: 0.05 }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.10,
            triggers: ['verdacht_herzinfarkt', 'instabil', 'atemnot_schwer']
        },
        zielklinik: {
            standard: { probability: 0.80 },
            kardiologie: { probability: 0.20 }
        }
    },
    
    lernziele: [
        'Thoraxschmerz ernst nehmen',
        'Breites Spektrum von harmlos bis lebensbedrohlich',
        'EKG erforderlich',
        'Kardiale Ursache ausschließen'
    ]
};

export default THORAXSCHMERZ_UNKLAR_TEMPLATE;