// =========================================================================================
// TEMPLATE: SCHUSSVERLETZUNG
// Beschreibung: Schusswunde - schwerster Trauma-Notfall
// =========================================================================================

export const SCHUSSVERLETZUNG_TEMPLATE = {
    id: 'schussverletzung',
    kategorie: 'rd',
    stichwort: 'Schussverletzung',
    weight: 0.5,
    
    anrufer: {
        typen: {
            zeuge_extrem_panisch: {
                probability: 0.60,
                speech_pattern: 'extrem_panisch',
                variations: [
                    'Schüsse gefallen! Jemand liegt verletzt am Boden!',
                    'Jemand wurde angeschossen! Schnell!',
                    'Schießerei! Person schwer verletzt!',
                    'Ich höre Schüsse! Jemand schreit!'
                ],
                background_sounds: ['screaming', 'panic', 'sirens']
            },
            polizei: {
                probability: 0.35,
                speech_pattern: 'behördlich_dringend',
                variations: [
                    'Polizei, Schussverletzung, Patient kritisch, RTW/NEF sofort!',
                    'Einsatzstelle gesichert, Schusswunde Thorax, starke Blutung.',
                    'SEK-Einsatz, Verletzte Person, Schusswunde, Lage gesichert.'
                ]
            },
            opfer: {
                probability: 0.03,
                speech_pattern: 'kaum_verständlich',
                variations: [
                    '*röchelt* Ich... wurde... angeschossen... *schwach*'
                ]
            },
            jäger: {
                probability: 0.02,
                speech_pattern: 'schockiert',
                variations: [
                    'Jagdunfall! Jemand wurde versehentlich getroffen!'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.85 },
            female: { probability: 0.15 }
        },
        alter: {
            distribution: 'normal',
            mean: 35,
            stddev: 14,
            min: 18,
            max: 65
        },
        bewusstsein: {
            wach: { probability: 0.30 },
            verwirrt: { probability: 0.25 },
            bewusstlos: { probability: 0.45 }
        }
    },
    
    schusswaffe_typ: {
        handfeuerwaffe: {
            probability: 0.70,
            kaliber: 'meist_klein-mittel',
            verletzung: 'variabel'
        },
        langwaffe_jagd: {
            probability: 0.25,
            kaliber: 'groß',
            verletzung: 'sehr_schwer'
        },
        schrotflinte: {
            probability: 0.05,
            verletzung: 'massiv',
            nähe: 'verwüstend'
        }
    },
    
    lokalisation: {
        thorax: {
            probability: 0.35,
            severity: 'kritisch',
            komplikationen: ['lunge', 'herz', 'große_gefäße', 'pneumothorax']
        },
        abdomen: {
            probability: 0.25,
            severity: 'kritisch',
            komplikationen: ['organverletzungen', 'innere_blutung', 'peritonitis']
        },
        kopf: {
            probability: 0.15,
            severity: 'meist_tödlich',
            überlebenschance: 'sehr_gering'
        },
        extremitäten: {
            probability: 0.20,
            severity: 'mittel-schwer',
            komplikationen: ['fraktur', 'gefäßverletzung', 'nervenverletzung']
        },
        hals: {
            probability: 0.05,
            severity: 'kritisch',
            komplikationen: ['gefäße', 'wirbelsäule', 'atemweg']
        }
    },
    
    geschoss: {
        durchschuss: {
            probability: 0.50,
            ein_ausschuss: true,
            details: 'Geschoss durchschlägt Körper'
        },
        steckschuss: {
            probability: 0.45,
            geschoss_im_körper: true,
            details: 'Geschoss verbleibt'
        },
        streifschuss: {
            probability: 0.05,
            severity: 'leicht',
            details: 'Tangential'
        }
    },
    
    komplikationen: {
        massivblutung: {
            probability: 0.60,
            externe_oder_interne: true
        },
        schock: {
            probability: 0.70,
            typ: 'hypovolämisch_traumatisch'
        },
        pneumothorax: {
            probability: 0.30,
            bei: 'Thoraxschuss'
        },
        hämatothorax: {
            probability: 0.25,
            bei: 'Thoraxschuss'
        },
        organzerstörung: {
            probability: 0.50
        },
        knochentrümmer: {
            probability: 0.40,
            zusätzliche_schädigung: true
        }
    },
    
    locations: {
        öffentlich: { probability: 0.40, address_types: ['street', 'public_place'] },
        wohnung: { probability: 0.35, address_types: ['residential'] },
        gewerbe: { probability: 0.15, address_types: ['commercial'] },
        wald_jagd: { probability: 0.05, address_types: ['forest'] },
        andere: { probability: 0.05 }
    },
    
    kontext: {
        kriminalität: { probability: 0.70 },
        jagdunfall: { probability: 0.10 },
        suizid_versuch: { probability: 0.10 },
        unfall: { probability: 0.05 },
        polizeieinsatz: { probability: 0.05 }
    },
    
    besonderheiten: {
        tatort_unsicher: {
            probability: 0.60,
            note: 'Schütze möglicherweise noch vor Ort!',
            gefahr: 'sehr_hoch'
        },
        mehrere_opfer: {
            probability: 0.25,
            manv: 'möglich'
        },
        täter_suizid: {
            probability: 0.10
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 2, nef: 1, ktw: 0 },
        nef_indikation: {
            probability: 1.0,
            zwingend: true
        },
        rth_indikation: {
            probability: 0.30,
            bei: 'kritisch_instabil_oder_ländlich'
        },
        polizei: {
            probability: 1.0,
            zwingend: true,
            sek_möglich: true,
            note: 'Lage MUSS gesichert sein!'
        },
        zielklinik: {
            traumazentrum: { probability: 1.0, stufe: 'überregional' }
        },
        eigensicherung: {
            note: 'NUR nach Polizei-Freigabe einfahren!',
            kritisch: 'Lebensgefahr für Rettungskräfte',
            sammelstelle: 'Außerhalb Gefahrenbereich'
        }
    },
    
    eskalation: {
        reanimation: {
            probability: 0.30,
            announcement: 'Patient reagiert nicht mehr! Keine Atmung!'
        },
        weitere_schüsse: {
            probability: 0.15,
            announcement: 'Weitere Schüsse! Schütze noch aktiv!',
            action: 'Rückzug_anordnen'
        },
        weitere_opfer: {
            probability: 0.25,
            announcement: 'Es gibt weitere Verletzte!'
        }
    },
    
    lernziele: [
        'Schussverletzung = Maximale Ressourcen',
        'EIGENSICHERUNG hat absoluten Vorrang',
        'Nur nach Polizei-Freigabe',
        'Traumazentrum zwingend',
        'MANV-Potential bedenken'
    ]
};

export default SCHUSSVERLETZUNG_TEMPLATE;