// =========================================================================================
// TEMPLATE: ALLERGISCHE REAKTION
// Beschreibung: Allergische Reaktion - von leicht bis lebensbedrohlich (Anaphylaxie)
// =========================================================================================

export const ALLERGISCHE_REAKTION_TEMPLATE = {
    id: 'allergische_reaktion',
    kategorie: 'rd',
    stichwort: 'Allergische Reaktion',
    weight: 2,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.30,
                speech_pattern: 'besorgt',
                variations: [
                    'Ich habe einen Ausschlag bekommen und es juckt stark!',
                    'Mein Gesicht schwillt an! Ich bin Allergiker!',
                    'Ich bekomme schlecht Luft, ich glaube das ist eine Allergie!',
                    'Ich wurde gestochen und jetzt schwillt alles an!'
                ]
            },
            angehöriger_panisch: {
                probability: 0.50,
                speech_pattern: 'panisch',
                variations: [
                    'Meine Tochter bekommt keine Luft mehr! Sie ist allergisch!',
                    'Sein Gesicht schwillt total an! Er wurde von einer Wespe gestochen!',
                    'Sie kann kaum noch atmen! Das ist eine allergische Reaktion!',
                    'Er hat etwas gegessen und jetzt ist er ganz rot im Gesicht!'
                ]
            },
            angehöriger_ruhig: {
                probability: 0.15,
                speech_pattern: 'besorgt',
                variations: [
                    'Mein Sohn hat eine allergische Reaktion, er hat Ausschlag.',
                    'Sie ist Allergikerin und hat versehentlich Nüsse gegessen.',
                    'Er hat sein Notfallset dabei, aber es wird nicht besser.'
                ]
            },
            zeuge: {
                probability: 0.05,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Jemand hier im Restaurant bekommt keine Luft!',
                    'Eine Person ist hier kollabiert nach einem Insektenstich!'
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
            distribution: 'bimodal',
            peak1: { mean: 25, stddev: 12, weight: 0.4 },
            peak2: { mean: 45, stddev: 15, weight: 0.6 },
            min: 5,
            max: 80
        },
        bewusstsein: {
            wach: { probability: 0.80 },
            verwirrt: { probability: 0.12 },
            bewusstlos: { probability: 0.08 }
        }
    },
    
    schweregrad: {
        grad_1_leicht: {
            probability: 0.40,
            symptome: ['hautreaktion', 'juckreiz', 'nesselsucht'],
            severity: 'leicht'
        },
        grad_2_mittel: {
            probability: 0.30,
            symptome: ['hautreaktion', 'schwellung', 'gi_symptome'],
            severity: 'mittel'
        },
        grad_3_schwer: {
            probability: 0.20,
            symptome: ['atemnot', 'schwellung', 'kreislauf'],
            severity: 'schwer'
        },
        grad_4_anaphylaxie: {
            probability: 0.10,
            symptome: ['atemstillstand_drohend', 'schock'],
            severity: 'kritisch',
            lebensbedrohlich: true
        }
    },
    
    auslöser: {
        insektenstich: {
            probability: 0.35,
            types: ['wespe', 'biene', 'hornisse']
        },
        nahrungsmittel: {
            probability: 0.30,
            types: ['nüsse', 'meeresfrüchte', 'milch', 'eier']
        },
        medikamente: {
            probability: 0.20,
            types: ['antibiotika', 'schmerzmittel', 'kontrastmittel']
        },
        andere: {
            probability: 0.15,
            types: ['latex', 'tierhaare', 'pollen']
        }
    },
    
    symptome: {
        hautreaktionen: {
            nesselsucht: { probability: 0.70 },
            juckreiz: { probability: 0.85 },
            rötung: { probability: 0.80 },
            schwellung: { probability: 0.60 }
        },
        atemwege: {
            atemnot: { probability: 0.30 },
            stridor: { probability: 0.15 },
            heiserkeit: { probability: 0.20 },
            zungenschwellung: { probability: 0.12 }
        },
        kreislauf: {
            schwindel: { probability: 0.25 },
            tachykardie: { probability: 0.40 },
            blutdruckabfall: { probability: 0.20 },
            kollaps: { probability: 0.10 }
        },
        gastrointestinal: {
            übelkeit: { probability: 0.40 },
            erbrechen: { probability: 0.25 },
            durchfall: { probability: 0.20 },
            krämpfe: { probability: 0.15 }
        }
    },
    
    locations: {
        zuhause: { probability: 0.45, address_types: ['residential'] },
        öffentlich: { probability: 0.30, address_types: ['restaurant', 'park', 'street'] },
        arbeitsplatz: { probability: 0.15, address_types: ['office'] },
        arztpraxis: { probability: 0.10, address_types: ['medical'] }
    },
    
    besonderheiten: {
        bekannte_allergie: {
            probability: 0.60,
            notfallset: {
                vorhanden: 0.50,
                bereits_verwendet: 0.30
            }
        },
        erste_reaktion: {
            probability: 0.40,
            details: 'Keine bekannte Allergie'
        },
        antihistaminika_genommen: {
            probability: 0.30
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.25,
            triggers: ['grad_3_oder_4', 'atemnot', 'schock', 'keine_besserung']
        }
    },
    
    eskalation: {
        verschlechterung_anaphylaxie: {
            probability: 0.15,
            announcement: 'Die Schwellung wird schlimmer! Er bekommt kaum noch Luft!',
            severity: 'kritisch',
            nef: true
        },
        schock: {
            probability: 0.08,
            announcement: 'Sie wird ganz blass und kippt um!'
        },
        besserung: {
            probability: 0.20,
            announcement: 'Die Medikamente scheinen zu wirken, es wird besser.'
        }
    },
    
    zeitfaktoren: {
        reaktionszeit: {
            sofort_minuten: { probability: 0.60 },
            30_60min: { probability: 0.30 },
            stunden: { probability: 0.10 }
        },
        jahreszeit_modifikator: {
            sommer: 1.5,
            frühling: 1.2,
            herbst: 1.0,
            winter: 0.7
        }
    },
    
    lernziele: [
        'Schweregrad-Einschätzung nach Grad I-IV',
        'Zeitkritische Entscheidung bei Anaphylaxie',
        'Erfragung von Auslösern',
        'Notfallset-Verfügbarkeit prüfen'
    ]
};

export default ALLERGISCHE_REAKTION_TEMPLATE;
