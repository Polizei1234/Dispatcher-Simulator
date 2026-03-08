// =========================================================================================
// TEMPLATE: SUIZIDVERSUCH
// Beschreibung: Selbsttötungsversuch - sensibel und kritisch
// =========================================================================================

export const SUIZIDVERSUCH_TEMPLATE = {
    id: 'suizidversuch',
    kategorie: 'rd',
    stichwort: 'Suizidversuch',
    weight: 1,
    
    anrufer: {
        typen: {
            angehöriger_verzweifelt: {
                probability: 0.50,
                speech_pattern: 'verzweifelt_weinend',
                variations: [
                    'Mein Sohn hat Tabletten genommen! Ganz viele!',
                    'Sie hat sich die Pulsadern aufgeschnitten! *weint*',
                    'Ich habe ihn gefunden... er hat sich erhängt...',
                    'Sie wollte sich umbringen! Sie hat Medikamente geschluckt!',
                    'Er hat einen Abschiedsbrief hinterlassen und ist weg!'
                ],
                background_sounds: ['crying', 'desperation']
            },
            patient_selbst_ambivalent: {
                probability: 0.20,
                speech_pattern: 'depressiv_leise',
                variations: [
                    'Ich habe Tabletten genommen... ich weiß nicht...',
                    'Ich habe etwas Dummes gemacht...',
                    'Ich brauche Hilfe... ich habe...'
                ]
            },
            freunde_mitbewohner: {
                probability: 0.15,
                speech_pattern: 'schockiert',
                variations: [
                    'Mein Mitbewohner hat sich etwas angetan!',
                    'Ich habe sie gefunden... sie hat sich geschnitten!'
                ]
            },
            polizei: {
                probability: 0.15,
                speech_pattern: 'professionell_ernst',
                variations: [
                    'Polizei, Suizidversuch, Person bewusstlos, Tabletten.',
                    'Person droht von Brücke zu springen, Kriseneinsatz läuft.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.55 },
            female: { probability: 0.45 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 22, stddev: 8, weight: 0.3 },
            peak2: { mean: 48, stddev: 18, weight: 0.7 },
            min: 14,
            max: 85
        },
        bewusstsein: {
            wach_kooperativ: { probability: 0.40 },
            wach_ablehnend: { probability: 0.20 },
            somnolent: { probability: 0.25 },
            bewusstlos: { probability: 0.15 }
        }
    },
    
    methode: {
        intoxikation: {
            probability: 0.50,
            medikamente: { probability: 0.80 },
            andere_substanzen: { probability: 0.20 }
        },
        schneiden: {
            probability: 0.25,
            lokalisation: ['handgelenke', 'unterarme'],
            schweregrad: 'variabel'
        },
        erhängen: {
            probability: 0.12,
            letalität: 'hoch'
        },
        sturz_höhe: {
            probability: 0.05,
            letalität: 'hoch'
        },
        andere: {
            probability: 0.08
        }
    },
    
    schweregrad: {
        leicht: {
            probability: 0.35,
            note: 'Eher "Hilferuf"',
            gefahr: 'gering',
            aber: 'ernst_nehmen!'
        },
        mittel: {
            probability: 0.40,
            gefahr: 'relevant',
            behandlung_erforderlich: true
        },
        schwer: {
            probability: 0.20,
            gefahr: 'lebensbedrohlich',
            intensiv_erforderlich: true
        },
        laufend: {
            probability: 0.05,
            note: 'Person droht zu springen etc.',
            polizei_verhandler: true,
            severity: 'kritisch'
        }
    },
    
    psychiatrische_anamnese: {
        bekannte_depression: { probability: 0.60 },
        vorherige_versuche: { probability: 0.40 },
        aktuelle_krise: { probability: 0.80 },
        substanzabhängigkeit: { probability: 0.30 },
        abschiedsbrief: { probability: 0.25 }
    },
    
    locations: {
        zuhause: { probability: 0.70, address_types: ['residential'] },
        öffentlich: { probability: 0.15, address_types: ['bridge', 'building', 'park'] },
        klinik_heim: { probability: 0.10, address_types: ['medical', 'institutional'] },
        andere: { probability: 0.05 }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.35,
            triggers: ['bewusstlosigkeit', 'schwere_intoxikation', 'reanimation', 'schwere_verletzung']
        },
        polizei: {
            probability: 0.70,
            gründe: ['eigenschutz', 'zwangsmaßnahme', 'kriseneinsatz']
        },
        zielklinik: {
            psychiatrie: { probability: 0.70 },
            intensiv_dann_psychiatrie: { probability: 0.20 },
            standard: { probability: 0.10 }
        },
        zwangseinweisung: {
            probability: 0.50,
            bei: 'akute_selbstgefährdung'
        }
    },
    
    besonderheiten: {
        patient_ablehnung: {
            probability: 0.40,
            note: 'Will keine Hilfe',
            aber: 'Zwang bei Selbstgefährdung'
        },
        aggression: {
            probability: 0.15,
            note: 'Gegen sich/andere',
            polizei: 'erforderlich'
        },
        abschiedsbrief: {
            probability: 0.25,
            note: 'Hinweis auf Planung'
        },
        anwesenheit_angehöriger: {
            probability: 0.60,
            betreuung: 'auch_für_Angehörige_wichtig'
        }
    },
    
    komplikationen: {
        bei_intoxikation: {
            bewusstlosigkeit: { probability: 0.40 },
            ateminsuffizienz: { probability: 0.20 },
            kreislaufversagen: { probability: 0.15 }
        },
        bei_schneiden: {
            relevanter_blutverlust: { probability: 0.30 }
        },
        bei_erhaengen: {
            hypoxischer_hirnschaden: { probability: 0.40 },
            tod: { probability: 0.30 }
        }
    },
    
    eskalation: {
        patient_aggressiv: {
            probability: 0.15,
            announcement: 'Er wird aggressiv! Er will nicht mitgehen!'
        },
        verschlechterung: {
            probability: 0.20,
            announcement: 'Sie wird bewusstlos!'
        },
        kooperativ: {
            probability: 0.50,
            announcement: 'Er kommt freiwillig mit...'
        },
        polizei_muss_helfen: {
            probability: 0.25,
            announcement: 'Er wehrt sich! Polizei muss helfen!'
        }
    },
    
    umgang: {
        empathie: {
            note: 'Nicht werten, Verständnis zeigen'
        },
        sicherheit: {
            note: 'Eigenschutz! Polizei frühzeitig',
            wichtig: 'Keine Waffen/Werkzeuge zugänglich'
        },
        keine_vorwürfe: {
            note: 'Keine Schuldzuweisungen'
        },
        psychiatrische_versorgung: {
            note: 'Zwingend erforderlich',
            auch_bei: 'scheinbar_leichten_fällen'
        }
    },
    
    lernziele: [
        'Suizidversuch ernst nehmen - immer!',
        'Eigenschutz (Polizei)',
        'Empathie, nicht werten',
        'Zwangseinweisung bei Selbstgefährdung',
        'Psychiatrie-Ziel',
        'Auch Angehörige betreuen'
    ]
};

export default SUIZIDVERSUCH_TEMPLATE;