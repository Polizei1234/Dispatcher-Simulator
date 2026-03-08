// =========================================================================================
// TEMPLATE: UNTERKÜHLUNG / HYPOTHERMIE
// Beschreibung: Gefährlich niedrige Körpertemperatur
// =========================================================================================

export const UNTERKUEHLUNG_TEMPLATE = {
    id: 'unterkuehlung',
    kategorie: 'rd',
    stichwort: 'Unterkühlung / Hypothermie',
    weight: 1,
    
    anrufer: {
        typen: {
            zeuge: {
                probability: 0.50,
                speech_pattern: 'besorgt',
                variations: [
                    'Jemand liegt hier draußen im Schnee!',
                    'Eine Person liegt seit Stunden im Freien!',
                    'Jemand ist erfroren hier!',
                    'Ein Obdachloser reagiert nicht mehr!'
                ]
            },
            angehöriger: {
                probability: 0.25,
                speech_pattern: 'sehr_besorgt',
                variations: [
                    'Mein Vater war stundenlang in der Kälte!',
                    'Sie ist gestürzt und lag die ganze Nacht draußen!',
                    'Er ist total unterkühlt!'
                ]
            },
            polizei: {
                probability: 0.15,
                speech_pattern: 'professionell',
                variations: [
                    'Polizei, stark unterkühlte Person aufgefunden.',
                    'Person im Freien, mutmaßlich seit Stunden, unterkühlt.'
                ]
            },
            bergwacht: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Bergwacht, Wanderer mit Hypothermie, Bergung läuft.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.68 },
            female: { probability: 0.32 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 45, stddev: 15, weight: 0.4 },
            peak2: { mean: 75, stddev: 10, weight: 0.6 },
            min: 20,
            max: 95
        },
        bewusstsein: {
            wach_zittrig: { probability: 0.30 },
            apathisch: { probability: 0.35 },
            bewusstlos: { probability: 0.35 }
        }
    },
    
    schweregrad: {
        leicht: {
            probability: 0.30,
            temperatur: '32-35°C',
            symptome: ['zittern', 'blässe', 'verwirrtheit_leicht']
        },
        mittel: {
            probability: 0.40,
            temperatur: '28-32°C',
            symptome: ['kein_zittern_mehr', 'bewusstseinstrübung', 'muskelsteife'],
            paradoxes_ausziehen: { probability: 0.30 }
        },
        schwer: {
            probability: 0.25,
            temperatur: '24-28°C',
            symptome: ['bewusstlosigkeit', 'starre_pupillen', 'kaum_puls'],
            scheintot: true
        },
        kritisch: {
            probability: 0.05,
            temperatur: '<24°C',
            symptome: ['keine_vitalzeichen', 'herzstillstand'],
            reanimation: 'erforderlich'
        }
    },
    
    symptome: {
        frühstadium: {
            zittern: { probability: 0.80 },
            blässe: { probability: 0.85 },
            kalte_haut: { probability: 0.95 },
            verwirrtheit: { probability: 0.50 }
        },
        fortgeschritten: {
            kein_zittern: { probability: 0.70 },
            muskelsteife: { probability: 0.65 },
            verlangsamte_atmung: { probability: 0.75 },
            bradykardie: { probability: 0.80 },
            bewusstseinsstörung: { probability: 0.85 }
        },
        paradoxe_reaktionen: {
            ausziehen: { probability: 0.25, note: 'Paradoxes Entkleiden' },
            vergraben: { probability: 0.10, note: 'Terminal burrowing' }
        }
    },
    
    ursache: {
        exposition: {
            probability: 0.50,
            szenarien: ['obdachlos', 'sturz_im_freien', 'verirrter_wanderer']
        },
        alter_immobilität: {
            probability: 0.25,
            details: 'Ältere Person gestürzt, lange gelegen'
        },
        alkohol_drogen: {
            probability: 0.15,
            note: 'Verminderte Thermoregulation'
        },
        bergunfall: {
            probability: 0.08
        },
        andere: {
            probability: 0.02
        }
    },
    
    risikofaktoren: {
        hohes_alter: { probability: 0.50 },
        alkoholintoxikation: { probability: 0.30 },
        obdachlosigkeit: { probability: 0.25 },
        demenz: { probability: 0.20 },
        medikamente: { probability: 0.15 },
        erschöpfung: { probability: 0.20 }
    },
    
    locations: {
        im_freien_stadt: { probability: 0.40, address_types: ['street', 'park'] },
        wald_natur: { probability: 0.25, address_types: ['forest', 'mountain'] },
        wohnung_unbeheizt: { probability: 0.20, address_types: ['residential'] },
        gewässer: { probability: 0.10, address_types: ['lake', 'river'] },
        andere: { probability: 0.05 }
    },
    
    komplikationen: {
        herzrhythmusstörung: {
            probability: 0.40,
            types: ['vorhofflimmern', 'kammerflimmern'],
            bei_erwärmung: 'Gefahr!'
        },
        erfrierungen: {
            probability: 0.60,
            lokalisation: ['finger', 'zehen', 'nase', 'ohren']
        },
        rhabdomyolyse: {
            probability: 0.20,
            bei: 'lange_immobilisation'
        },
        pneumonie: {
            probability: 0.30
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.50,
            triggers: ['schwere_hypothermie', 'bewusstlosigkeit', 'herzrhythmusstörung']
        },
        bergwacht_bergrettung: {
            probability: 0.15,
            bei: 'bergunfall'
        },
        zielklinik: {
            standard: { probability: 0.40 },
            intensivstation: { probability: 0.50 },
            herz_lungen_maschine: { probability: 0.10, bei: 'schwerste_hypothermie' }
        }
    },
    
    behandlung_besonderheiten: {
        vorsichtige_bewegung: {
            note: 'Kammerflimmern-Risiko bei ruckartiger Bewegung!',
            kritisch: true
        },
        langsame_erwärmung: {
            note: 'Nicht zu schnell erwärmen',
            afterdrop: 'Gefahr durch kaltes Blut aus Peripherie'
        },
        reanimation: {
            note: 'Nicht tot bis warm und tot',
            regel: 'Reanimation bis Körpertemperatur >32°C'
        },
        kein_aufstellen: {
            note: 'Liegend transportieren',
            grund: 'Bergungstod vermeiden'
        }
    },
    
    eskalation: {
        kammerflimmern: {
            probability: 0.15,
            announcement: 'Kein Puls mehr! Herzstillstand!',
            bei: 'zu_schneller_erwärmung_oder_bewegung'
        },
        scheintot: {
            probability: 0.10,
            note: 'Keine Vitalzeichen tastbar',
            trotzdem: 'Reanimation!'
        },
        erfrierungen_entdeckt: {
            probability: 0.40,
            announcement: 'Die Finger sind ganz schwarz!'
        }
    },
    
    zeitfaktoren: {
        jahreszeit: {
            winter: 4.0,
            herbst_frühling: 1.5,
            sommer: 0.1
        },
        tageszeit: {
            nacht_morgen: 1.5,
            tag: 0.8
        },
        wetter: {
            schnee: 2.0,
            regen_wind: 1.5,
            trocken: 1.0
        }
    },
    
    lernziele: [
        'Hypothermie-Grade kennen',
        'Vorsichtige Bewegung (Kammerflimmern!)',
        'Langsame Erwärmung',
        '"Nicht tot bis warm und tot"',
        'Paradoxe Symptome',
        'Bergungstod vermeiden'
    ]
};

export default UNTERKUEHLUNG_TEMPLATE;