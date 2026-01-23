// =========================================================================================
// TEMPLATE: STICHVERLETZUNG
// Beschreibung: Messerstecherei - potentiell lebensbedrohlich
// =========================================================================================

export const STICHVERLETZUNG_TEMPLATE = {
    id: 'stichverletzung',
    kategorie: 'rd',
    stichwort: 'Stichverletzung',
    weight: 1,
    
    anrufer: {
        typen: {
            zeuge_schockiert: {
                probability: 0.50,
                speech_pattern: 'schockiert_panisch',
                variations: [
                    'Jemand wurde niedergestochen! Überall Blut!',
                    'Messerstecherei! Schnell!',
                    'Eine Person liegt hier blutend! Sie wurde gestochen!',
                    'Streit! Jemand hat ein Messer gezogen und zugestochen!'
                ],
                background_sounds: ['screaming', 'panic', 'crowd']
            },
            opfer_selbst: {
                probability: 0.15,
                speech_pattern: 'schwächer_werdend',
                variations: [
                    '*keuchend* Ich wurde gestochen... ich blute...',
                    'Hilfe... Messer... *schwach*'
                ]
            },
            angehöriger_panisch: {
                probability: 0.25,
                speech_pattern: 'extrem_panisch',
                variations: [
                    'Mein Sohn wurde abgestochen! Er blutet stark!',
                    'Sie wurde gestochen! Sie verliert viel Blut!',
                    'Er wurde in den Bauch gestochen!'
                ]
            },
            polizei: {
                probability: 0.10,
                speech_pattern: 'professionell_dringend',
                variations: [
                    'Polizei vor Ort, Stichverletzung Thorax, starke Blutung, RTW/NEF dringend!',
                    'Gewaltdelikt, Person mit multiplen Stichverletzungen, bewusstlos.'
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
            mean: 32,
            stddev: 12,
            min: 16,
            max: 60
        },
        bewusstsein: {
            wach: { probability: 0.50 },
            verwirrt: { probability: 0.30 },
            bewusstlos: { probability: 0.20 }
        }
    },
    
    anzahl_stiche: {
        einzeln: {
            probability: 0.40,
            severity: 'variabel'
        },
        mehrfach_2_5: {
            probability: 0.35,
            severity: 'schwer'
        },
        massiv_ueber_5: {
            probability: 0.25,
            severity: 'kritisch',
            lebensbedrohlich: true
        }
    },
    
    lokalisation: {
        thorax: {
            probability: 0.35,
            severity: 'kritisch',
            komplikationen: ['pneumothorax', 'hämatothorax', 'herzverletzung']
        },
        abdomen: {
            probability: 0.30,
            severity: 'schwer',
            komplikationen: ['organverletzung', 'peritonitis', 'innere_blutung']
        },
        hals: {
            probability: 0.10,
            severity: 'kritisch',
            komplikationen: ['gefäßverletzung', 'atemweg_kompromittiert']
        },
        extremitäten: {
            probability: 0.20,
            severity: 'leicht-mittel',
            komplikationen: ['gefäß_nerven_verletzung']
        },
        rücken: {
            probability: 0.05,
            severity: 'mittel-schwer',
            komplikationen: ['nierenverletzung', 'wirbelsäule']
        }
    },
    
    komplikationen: {
        schock_hypovolämisch: {
            probability: 0.45,
            ursache: 'Blutung'
        },
        pneumothorax: {
            probability: 0.20,
            bei: 'Thoraxstich'
        },
        herztamponade: {
            probability: 0.08,
            bei: 'Herznähe',
            severity: 'lebensbedrohlich'
        },
        innere_blutung: {
            probability: 0.40,
            oft: 'nicht_sofort_sichtbar'
        },
        luftembolie: {
            probability: 0.05,
            bei: 'große_venenverletzung'
        }
    },
    
    blutung: {
        stark_sichtbar: {
            probability: 0.50,
            details: 'Externe Blutung'
        },
        mäßig: {
            probability: 0.30,
            details: 'Kontrollierbar'
        },
        innere_nicht_sichtbar: {
            probability: 0.20,
            details: 'Schockzeichen ohne äußere Blutung',
            gefährlich: true
        }
    },
    
    locations: {
        öffentlich_strasse: { probability: 0.45, address_types: ['street', 'public_place'] },
        wohnung: { probability: 0.30, address_types: ['residential'] },
        kneipe_club: { probability: 0.15, address_types: ['bar', 'club'] },
        andere: { probability: 0.10 }
    },
    
    besonderheiten: {
        tatobjekt_steckt: {
            probability: 0.15,
            note: 'NICHT entfernen! Kann Blutung tamponieren',
            wichtig: 'In Klinik entfernen'
        },
        täter_situation: {
            täter_vor_ort: { probability: 0.20 },
            täter_flüchtig: { probability: 0.60 },
            unbekannt: { probability: 0.20 }
        },
        tatort_unsicher: {
            probability: 0.30,
            note: 'Polizei muss Lage sichern'
        },
        selbstverteidigung: {
            probability: 0.10
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 1, ktw: 0 },
        nef_indikation: {
            probability: 0.80,
            triggers: ['thorax_abdomen_hals', 'schock', 'bewusstlosigkeit']
        },
        polizei: {
            probability: 1.0,
            zwingend: true,
            reasons: ['gewaltdelikt', 'tatort', 'tätersuche', 'eigensicherung']
        },
        zielklinik: {
            traumazentrum: { probability: 0.90 },
            standard: { probability: 0.10 }
        },
        eigensicherung: {
            note: 'Erst nach Polizei-Freigabe zum Patienten!',
            wichtig: 'Eigenschutz hat Vorrang'
        }
    },
    
    eskalation: {
        schock: {
            probability: 0.30,
            announcement: 'Er wird immer blasser! Der Puls wird schwach!'
        },
        bewusstlosigkeit: {
            probability: 0.20,
            announcement: 'Sie ist jetzt bewusstlos geworden!'
        },
        reanimation: {
            probability: 0.10,
            announcement: 'Er reagiert nicht mehr! Kein Puls!'
        },
        zweites_opfer: {
            probability: 0.15,
            announcement: 'Es gibt noch eine zweite verletzte Person!'
        }
    },
    
    zeitfaktoren: {
        tageszeit_modifikator: {
            nacht_20_04: 2.5,
            abend_18_22: 1.8,
            tag: 0.6
        },
        wochentag: {
            wochenende: 1.8,
            werktags: 0.9
        }
    },
    
    lernziele: [
        'Stichverletzung als Trauma-Notfall',
        'Innere Verletzungen bedenken',
        'Polizei IMMER erforderlich',
        'Eigensicherung beachten',
        'Tatobjekt nicht entfernen'
    ]
};

export default STICHVERLETZUNG_TEMPLATE;