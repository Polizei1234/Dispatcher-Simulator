// =========================================================================================
// TEMPLATE: ALKOHOL-INTOXIKATION
// Beschreibung: Akute Alkoholvergiftung - von angetrunken bis bewusstlos
// =========================================================================================

export const ALKOHOL_INTOX_TEMPLATE = {
    id: 'alkohol_intox',
    kategorie: 'rd',
    stichwort: 'Alkohol-Intoxikation',
    weight: 4,
    
    anrufer: {
        typen: {
            zeuge: {
                probability: 0.40,
                speech_pattern: 'unsicher',
                variations: [
                    'Hier liegt jemand völlig betrunken, er reagiert nicht mehr!',
                    'Da liegt ein Betrunkener bewusstlos am Bahnhof.',
                    'Jemand ist hier im Park zusammengebrochen, riecht stark nach Alkohol.',
                    'Ein stark Alkoholisierter liegt vor unserem Laden.'
                ]
            },
            freunde: {
                probability: 0.30,
                speech_pattern: 'besorgt_angetrunken',
                variations: [
                    'Mein Kumpel hat zu viel getrunken, er wacht nicht mehr auf!',
                    'Wir waren feiern, sie reagiert nicht mehr! *lallt leicht*',
                    'Er hat viel zu viel getrunken, was sollen wir machen?',
                    'Sie hat sich übergeben und ist jetzt bewusstlos!'
                ],
                background_sounds: ['party_music', 'people_talking']
            },
            sicherheitsdienst: {
                probability: 0.15,
                speech_pattern: 'professionell',
                variations: [
                    'Stark alkoholisierte Person bewusstlos im Club.',
                    'Gast hat Alkoholvergiftung, nicht ansprechbar.',
                    'Betrunkener kollabiert auf Veranstaltung.'
                ]
            },
            polizei: {
                probability: 0.10,
                speech_pattern: 'behördlich',
                variations: [
                    'Polizei Backnang, wir haben einen bewusstlosen Betrunkenen.',
                    'Kollege vor Ort, Person stark alkoholisiert und nicht ansprechbar.',
                    'Hilflose Person aufgefunden, massiv alkoholisiert.'
                ]
            },
            angehöriger: {
                probability: 0.05,
                speech_pattern: 'verzweifelt',
                variations: [
                    'Mein Mann hat wieder getrunken, ich bekomme ihn nicht wach!',
                    'Mein Sohn liegt hier, er hat eine Flasche Vodka getrunken!'
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
            peak1: { mean: 22, stddev: 4, weight: 0.4 },
            peak2: { mean: 48, stddev: 12, weight: 0.6 },
            min: 16,
            max: 75
        },
        bewusstsein: {
            wach_aggressiv: { probability: 0.15 },
            wach_kooperativ: { probability: 0.10 },
            somnolent: { probability: 0.35 },
            bewusstlos: { probability: 0.40 }
        }
    },
    
    symptome: {
        hauptsymptome: {
            alkoholgeruch: { probability: 1.0 },
            bewusstseinsstörung: { probability: 0.75 },
            erbrechen: { probability: 0.60 }
        },
        begleitsymptome: {
            unterkühlung: { probability: 0.30 },
            verletzungen: { probability: 0.40 },
            aggressivität: { probability: 0.20 },
            inkontinenz: { probability: 0.25 }
        }
    },
    
    locations: {
        öffentlich: { probability: 0.45, address_types: ['street', 'park', 'station'] },
        veranstaltung: { probability: 0.25, address_types: ['event', 'club', 'bar'] },
        zuhause: { probability: 0.20, address_types: ['residential'] },
        bekannte_stelle: { probability: 0.10, address_types: ['homeless_spot'] }
    },
    
    besonderheiten: {
        stammkunde: {
            probability: 0.30,
            note: 'Bekannte Adresse/Person'
        },
        mischintoxikation: {
            probability: 0.25,
            substances: ['drogen', 'medikamente']
        },
        sturz_trauma: {
            probability: 0.35,
            injuries: ['kopfplatzwunde', 'prellungen']
        },
        unterkühlung: {
            probability: 0.20,
            season: 'winter'
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        polizei_erforderlich: {
            probability: 0.25,
            reasons: ['aggressivität', 'öffentliche_sicherheit']
        }
    },
    
    zeitfaktoren: {
        tageszeit_modifikator: {
            nacht_22_06: 2.5,
            abend_18_22: 1.8,
            tag: 0.5
        },
        wochentag_modifikator: {
            freitag: 1.5,
            samstag: 2.0,
            sonntag: 1.3
        },
        jahreszeit_modifikator: {
            winter: 1.2,
            karneval: 3.0,
            silvester: 4.0
        }
    },
    
    eskalation: {
        aggressivität: {
            probability: 0.20,
            announcement: 'Er wird jetzt aggressiv!',
            polizei: true
        },
        erbrechen_aspiration: {
            probability: 0.15,
            severity: 'kritisch'
        }
    }
};

export default ALKOHOL_INTOX_TEMPLATE;
