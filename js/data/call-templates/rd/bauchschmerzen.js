// =========================================================================================
// TEMPLATE: BAUCHSCHMERZEN AKUT
// Beschreibung: Akute Abdominalschmerzen - vielfältige Ursachen
// =========================================================================================

export const BAUCHSCHMERZEN_TEMPLATE = {
    id: 'bauchschmerzen',
    kategorie: 'rd',
    stichwort: 'Bauchschmerzen akut',
    weight: 3,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.45,
                speech_pattern: 'gequält',
                variations: [
                    'Ich habe starke Bauchschmerzen!',
                    'Mein Bauch tut sehr weh... *stöhnt*',
                    'Ich habe Krämpfe im Bauch!',
                    'Es tut im Bauch so weh, ich halte es nicht aus!'
                ]
            },
            angehöriger: {
                probability: 0.45,
                speech_pattern: 'besorgt',
                variations: [
                    'Sie hat starke Bauchschmerzen und erbricht!',
                    'Er krümmt sich vor Schmerzen!',
                    'Sie hat heftige Bauchkrämpfe!',
                    'Mein Kind hat starke Bauchschmerzen!'
                ]
            },
            hausarzt: {
                probability: 0.10,
                speech_pattern: 'ärztlich',
                variations: [
                    'Hausarzt, Patient mit akutem Abdomen, V.a. Appendizitis, Transport dringend.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.45 },
            female: { probability: 0.55 }
        },
        alter: {
            distribution: 'uniform',
            min: 15,
            max: 75
        },
        bewusstsein: {
            wach: { probability: 0.90 },
            verwirrt: { probability: 0.08 },
            bewusstlos: { probability: 0.02 }
        }
    },
    
    schmerzcharakter: {
        krampfartig: { probability: 0.35 },
        stechend: { probability: 0.25 },
        dumpf: { probability: 0.20 },
        kolikartig: { probability: 0.15 },
        andere: { probability: 0.05 }
    },
    
    lokalisation: {
        unterbauch_rechts: { probability: 0.20, note: 'V.a. Appendizitis' },
        unterbauch_links: { probability: 0.15, note: 'V.a. Divertikulitis' },
        oberbauch_rechts: { probability: 0.15, note: 'V.a. Galle' },
        oberbauch_mitte: { probability: 0.15, note: 'V.a. Magen/Pankreas' },
        flanke: { probability: 0.10, note: 'V.a. Niere' },
        diffus: { probability: 0.25 }
    },
    
    mögliche_ursachen: {
        appendizitis: { probability: 0.15 },
        gastroenteritis: { probability: 0.20 },
        gallensteine: { probability: 0.10 },
        nierensteine: { probability: 0.08 },
        darmverschluss: { probability: 0.05 },
        divertikulitis: { probability: 0.08 },
        gynäkologisch: { probability: 0.10, nur_frauen: true },
        andere: { probability: 0.24 }
    },
    
    begleitsymptome: {
        übelkeit: { probability: 0.70 },
        erbrechen: { probability: 0.50 },
        durchfall: { probability: 0.35 },
        fieber: { probability: 0.30 },
        verstopfung: { probability: 0.20 },
        blut_stuhl: { probability: 0.10 }
    },
    
    locations: {
        zuhause: { probability: 0.80, address_types: ['residential'] },
        arbeitsplatz: { probability: 0.10, address_types: ['office'] },
        öffentlich: { probability: 0.10, address_types: ['public_place'] }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.05,
            triggers: ['schock', 'akutes_abdomen_kritisch', 'bewusstlosigkeit']
        },
        zielklinik: {
            chirurgie: { probability: 0.40 },
            standard: { probability: 0.60 }
        }
    },
    
    lernziele: [
        'Bauchschmerzen - viele Ursachen',
        'Akutes Abdomen erkennen',
        'Schmerzlokalisation wichtig',
        'Begleitsymptome erfragen'
    ]
};

export default BAUCHSCHMERZEN_TEMPLATE;