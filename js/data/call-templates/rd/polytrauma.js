// =========================================================================================
// TEMPLATE: POLYTRAUMA
// Beschreibung: Mehrfachverletzung mehrerer Körperregionen - schwerster Notfall
// =========================================================================================

export const POLYTRAUMA_TEMPLATE = {
    id: 'polytrauma',
    kategorie: 'rd',
    stichwort: 'Polytrauma',
    weight: 1,
    
    anrufer: {
        typen: {
            zeuge_schockiert: {
                probability: 0.50,
                speech_pattern: 'schockiert_panisch',
                variations: [
                    'Es war ein schwerer Unfall! Mehrere Verletzte!',
                    'Jemand liegt hier schwer verletzt! Überall Blut!',
                    'Schlimmer Unfall! Person eingeklemmt!',
                    'Motorradunfall! Er bewegt sich nicht mehr!'
                ],
                background_sounds: ['sirens', 'traffic', 'people_shouting']
            },
            ersthelfer: {
                probability: 0.25,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Ich bin Ersthelfer am Unfallort, schwer verletzter Patient!',
                    'PKW gegen Baum, Fahrer eingeklemmt, nicht ansprechbar!',
                    'Schwerer Motorradunfall, mehrere Verletzungen!'
                ]
            },
            polizei: {
                probability: 0.15,
                speech_pattern: 'professionell',
                variations: [
                    'Polizei vor Ort, schwerer VU, RTW und NEF dringend!',
                    'Verkehrsunfall mit Einklemmung, Feuerwehr alarmiert.',
                    'Schwerer Unfall, mehrere Schwerverletzte.'
                ]
            },
            feuerwehr: {
                probability: 0.10,
                speech_pattern: 'behördlich',
                variations: [
                    'Feuerwehr vor Ort, Patient befreit, Polytrauma, NEF erforderlich.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.72 },
            female: { probability: 0.28 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 26, stddev: 8, weight: 0.5 },
            peak2: { mean: 48, stddev: 15, weight: 0.5 },
            min: 16,
            max: 75
        },
        bewusstsein: {
            wach: { probability: 0.20 },
            verwirrt: { probability: 0.15 },
            bewusstlos: { probability: 0.65 }
        }
    },
    
    unfallmechanismus: {
        verkehrsunfall_pkw: {
            probability: 0.40,
            severity: 'schwer',
            einklemmung: 0.40
        },
        motorradunfall: {
            probability: 0.25,
            severity: 'sehr_schwer',
            hochenergetisch: true
        },
        sturz_große_hoehe: {
            probability: 0.20,
            severity: 'sehr_schwer'
        },
        fussgänger_angefahren: {
            probability: 0.10,
            severity: 'schwer'
        },
        andere: {
            probability: 0.05
        }
    },
    
    verletzungsmuster: {
        schädel: {
            schweres_sht: { probability: 0.60 },
            schädelfraktur: { probability: 0.40 },
            intrakranielle_blutung: { probability: 0.35 }
        },
        thorax: {
            rippenserienfraktur: { probability: 0.50 },
            pneumothorax: { probability: 0.40 },
            hämatothorax: { probability: 0.30 },
            herzkontusion: { probability: 0.15 },
            aortenruptur: { probability: 0.05 }
        },
        abdomen: {
            milzruptur: { probability: 0.35 },
            leberruptur: { probability: 0.30 },
            nierenruptur: { probability: 0.15 },
            darmverletzung: { probability: 0.20 },
            retroperitoneales_hämatom: { probability: 0.25 }
        },
        becken: {
            instabile_beckenfraktur: { probability: 0.40 },
            blase_harnröhre: { probability: 0.15 }
        },
        wirbelsäule: {
            wirbelfraktur: { probability: 0.35 },
            rückenmarksverletzung: { probability: 0.20 },
            querschnitt: { probability: 0.10 }
        },
        extremitäten: {
            mehrfachfrakturen: { probability: 0.70 },
            offene_frakturen: { probability: 0.40 },
            gefäß_nerven_verletzung: { probability: 0.25 },
            amputationsverletzung: { probability: 0.08 }
        }
    },
    
    komplikationen: {
        schock: {
            probability: 0.70,
            typ: ['hypovolämisch', 'traumatisch']
        },
        massivblutung: {
            probability: 0.50,
            lokalisationen: ['becken', 'thorax', 'abdomen']
        },
        ateminsuffizienz: {
            probability: 0.45
        },
        crush_syndrom: {
            probability: 0.10
        }
    },
    
    locations: {
        unfallstelle_strasse: { probability: 0.60, address_types: ['street', 'highway'] },
        unfallstelle_land: { probability: 0.20, address_types: ['rural'] },
        baustelle: { probability: 0.10, address_types: ['construction'] },
        andere: { probability: 0.10 }
    },
    
    disposition: {
        base_recommendation: { rtw: 2, nef: 1, ktw: 0 },
        nef_indikation: {
            probability: 1.0,
            zwingend: true
        },
        rth_indikation: {
            probability: 0.40,
            triggers: ['ländlich', 'kritisch_instabil', 'lange_rettungszeit']
        },
        feuerwehr: {
            probability: 0.70,
            reasons: ['befreiung', 'einklemmung', 'absicherung']
        },
        lna_indikation: {
            probability: 0.20,
            bei: 'mehrere_verletzte'
        },
        zielklinik: {
            traumazentrum: { probability: 1.0, stufe: 'überregional' }
        }
    },
    
    eskalation: {
        reanimation: {
            probability: 0.20,
            announcement: 'Patient reagiert nicht mehr! Kein Puls!'
        },
        zweiter_patient: {
            probability: 0.30,
            announcement: 'Es gibt noch einen zweiten Verletzten!'
        },
        einklemmung_schwierig: {
            probability: 0.25,
            note: 'Rettung dauert länger'
        },
        brand: {
            probability: 0.08,
            announcement: 'Das Fahrzeug brennt!'
        }
    },
    
    besonderheiten: {
        einklemmung: {
            probability: 0.35,
            rettungszeit: 'verlängert'
        },
        gefahrenstelle: {
            probability: 0.50,
            absicherung: 'erforderlich'
        },
        mehrere_patienten: {
            probability: 0.30,
            manv: 'möglich'
        }
    },
    
    zeitfaktoren: {
        golden_hour: {
            note: 'Zeitfenster 60min kritisch',
            priorität: 'maximal'
        }
    },
    
    lernziele: [
        'Polytrauma erkennen',
        'Maximale Ressourcen-Anforderung',
        'Traumazentrum zwingend',
        'Zeitkritik kommunizieren',
        'Koordination mehrerer Rettungsmittel'
    ]
};

export default POLYTRAUMA_TEMPLATE;