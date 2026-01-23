// =========================================================================================
// TEMPLATE: HITZSCHLAG / HYPERTHERMIE
// Beschreibung: Gefährlich erhöhte Körpertemperatur
// =========================================================================================

export const HITZSCHLAG_TEMPLATE = {
    id: 'hitzschlag',
    kategorie: 'rd',
    stichwort: 'Hitzschlag / Hyperthermie',
    weight: 1,
    
    anrufer: {
        typen: {
            zeuge_besorgt: {
                probability: 0.45,
                speech_pattern: 'besorgt',
                variations: [
                    'Jemand ist bei der Hitze zusammengebrochen!',
                    'Eine Person ist umgekippt, sie ist ganz heiß!',
                    'Jemand liegt hier bewusstlos in der Sonne!',
                    'Person kollabiert, extrem heiß und verwirrt!'
                ]
            },
            angehöriger_panisch: {
                probability: 0.35,
                speech_pattern: 'panisch',
                variations: [
                    'Mein Kind ist total überhitzt und reagiert nicht richtig!',
                    'Mein Vater ist verwirrt und glühend heiß!',
                    'Sie ist umgekippt bei der Hitze!',
                    'Er ist nach dem Sport zusammengebrochen!'
                ]
            },
            trainer_betreuer: {
                probability: 0.15,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Sportler kollabiert, Hitzschlag!',
                    'Jemand ist beim Training umgekippt, sehr heiß!'
                ]
            },
            pflegepersonal: {
                probability: 0.05,
                speech_pattern: 'professionell',
                variations: [
                    'Bewohner mit Hyperthermie, 41°C, verwirrt.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.58 },
            female: { probability: 0.42 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 8, stddev: 5, weight: 0.15 },
            peak2: { mean: 72, stddev: 12, weight: 0.55 },
            peak3: { mean: 28, stddev: 10, weight: 0.30 },
            min: 1,
            max: 95,
            note: 'Kinder, Ältere, Sportler'
        },
        bewusstsein: {
            wach_verwirrt: { probability: 0.40 },
            somnolent: { probability: 0.35 },
            bewusstlos: { probability: 0.25 }
        }
    },
    
    typ: {
        klassischer_hitzschlag: {
            probability: 0.60,
            population: 'ältere_menschen_kinder',
            ursache: 'passive_exposition',
            haut: 'heiß_trocken'
        },
        belastungshitzschlag: {
            probability: 0.40,
            population: 'junge_sportler_arbeiter',
            ursache: 'körperliche_anstrengung',
            haut: 'heiß_feucht_schwitzend'
        }
    },
    
    schweregrad: {
        hitzeerschoepfung: {
            probability: 0.30,
            temperatur: '37-40°C',
            symptome: ['schwäche', 'schwindel', 'übelkeit', 'schwitzen'],
            bewusstsein: 'erhalten',
            severity: 'leicht-mittel'
        },
        hitzschlag: {
            probability: 0.70,
            temperatur: '>40°C',
            symptome: ['bewusstseinstörung', 'kein_schwitzen', 'krämpfe'],
            lebensbedrohlich: true,
            severity: 'kritisch'
        }
    },
    
    symptome: {
        allgemein: {
            heiße_haut: { probability: 0.95 },
            hochroter_kopf: { probability: 0.80 },
            tachykardie: { probability: 0.90 },
            hypotonie: { probability: 0.60 }
        },
        zns: {
            verwirrtheit: { probability: 0.75 },
            agitation: { probability: 0.50 },
            krampfanfall: { probability: 0.20 },
            koma: { probability: 0.25 }
        },
        schwitzen: {
            kein_schwitzen: { probability: 0.60, bei: 'klassisch' },
            starkes_schwitzen: { probability: 0.40, bei: 'belastung' }
        },
        andere: {
            übelkeit_erbrechen: { probability: 0.60 },
            kopfschmerzen: { probability: 0.70 },
            schwindel: { probability: 0.75 },
            muskeln_schmerzen: { probability: 0.50 }
        }
    },
    
    risikofaktoren: {
        hohes_alter: { probability: 0.45 },
        säugling_kleinkind: { probability: 0.10 },
        vorerkrankungen: {
            herz_kreislauf: { probability: 0.35 },
            diabetes: { probability: 0.20 },
            adipositas: { probability: 0.30 }
        },
        medikamente: {
            diuretika: { probability: 0.25 },
            psychopharmaka: { probability: 0.15 }
        },
        körperliche_anstrengung: { probability: 0.40 },
        unzureichende_flüssigkeit: { probability: 0.70 }
    },
    
    locations: {
        im_freien: { probability: 0.50, address_types: ['street', 'park', 'sports'] },
        wohnung: { probability: 0.30, address_types: ['residential'], note: 'Dachgeschoss' },
        auto: { probability: 0.10, address_types: ['vehicle'], note: 'Kind im Auto!' },
        arbeitsplatz: { probability: 0.08, address_types: ['commercial'] },
        andere: { probability: 0.02 }
    },
    
    komplikationen: {
        multiorganversagen: {
            probability: 0.30,
            organe: ['gehirn', 'niere', 'leber', 'herz']
        },
        rhabdomyolyse: {
            probability: 0.25,
            nierenversagen_drohend: true
        },
        dic: {
            probability: 0.15,
            note: 'Disseminierte intravasale Gerinnung'
        },
        hirnoedem: {
            probability: 0.20
        },
        schock: {
            probability: 0.40
        }
    },
    
    besonderheiten: {
        kind_im_auto: {
            probability: 0.05,
            note: 'Kind in geschlossenem Auto vergessen',
            severity: 'kritisch',
            polizei: true,
            jugendamt: true
        },
        marathon_wettkampf: {
            probability: 0.10,
            note: 'Mehrere Betroffene möglich',
            manv_potential: true
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.40,
            triggers: ['bewusstlosigkeit', 'krampfanfall', 'kritischer_zustand']
        },
        zielklinik: {
            intensivstation: { probability: 0.60 },
            standard: { probability: 0.40 }
        }
    },
    
    behandlung: {
        kühlung_prioritaet: {
            note: 'Sofortige Kühlung lebensrettend!',
            maßnahmen: ['schatten', 'nasse_tücher', 'ventilation', 'infusion_kalt'],
            ziel: 'Temperatur <39°C'
        },
        flüssigkeit: {
            note: 'Vorsichtig bei Bewusstlosigkeit',
            i_v: 'meist_erforderlich'
        }
    },
    
    eskalation: {
        krampfanfall: {
            probability: 0.18,
            announcement: 'Er krampft jetzt!'
        },
        bewusstlosigkeit: {
            probability: 0.25,
            announcement: 'Sie wird bewusstlos!'
        },
        verbesserung_kühlung: {
            probability: 0.30,
            announcement: 'Nach der Kühlung geht es besser!'
        },
        kind_im_auto_tot: {
            probability: 0.02,
            bei: 'kind_im_auto',
            tragisch: true
        }
    },
    
    zeitfaktoren: {
        jahreszeit: {
            sommer_hitzewelle: 5.0,
            sommer_normal: 2.0,
            andere: 0.1
        },
        tageszeit: {
            mittag_14_17: 3.0,
            nachmittag: 2.0,
            andere: 0.5
        },
        temperatur: {
            ueber_35_grad: 4.0,
            30_35_grad: 2.0,
            unter_30: 0.5
        }
    },
    
    lernziele: [
        'Hitzschlag als Notfall erkennen',
        'Sofortige Kühlung = lebensrettend',
        'Risikogruppen kennen',
        'Kind im Auto = Notfall!',
        'ZNS-Symptome typisch',
        'Hitzeerschoepfung vs. Hitzschlag'
    ]
};

export default HITZSCHLAG_TEMPLATE;