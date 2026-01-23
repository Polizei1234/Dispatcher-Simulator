// =========================================================================================
// TEMPLATE: FIEBERKRAMPF
// Beschreibung: Krampfanfall bei fieberndem Kleinkind - meist harmlos aber dramatisch
// =========================================================================================

export const FIEBERKRAMPF_TEMPLATE = {
    id: 'fieberkrampf',
    kategorie: 'rd',
    stichwort: 'Fieberkrampf',
    weight: 2,
    
    anrufer: {
        typen: {
            eltern_extrem_panisch: {
                probability: 0.85,
                speech_pattern: 'extrem_panisch_verzweifelt',
                variations: [
                    'Mein Baby krampft! Es hat hohes Fieber und krampft!',
                    'Hilfe! Mein Kind hat einen Anfall! Es zuckt am ganzen Körper!',
                    'Sie ist ganz heiß und krampft jetzt! Was soll ich tun?!',
                    'Er verdreht die Augen und zuckt! Er hat Fieber!',
                    'Mein Kind stirbt! Es krampft! Schnell!'
                ],
                background_sounds: ['baby_crying', 'extreme_panic', 'parent_crying']
            },
            großeltern: {
                probability: 0.10,
                speech_pattern: 'panisch',
                variations: [
                    'Das Enkelkind hat Fieber und krampft!'
                ]
            },
            kita_personal: {
                probability: 0.05,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Ein Kind hat hier einen Fieberkrampf!'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.52 },
            female: { probability: 0.48 }
        },
        alter: {
            distribution: 'normal',
            mean: 20,
            stddev: 12,
            min: 6,
            max: 60,
            einheit: 'monate',
            note: 'Typisch 6 Monate bis 5 Jahre'
        },
        zustand_bei_anruf: {
            krampft_noch: { probability: 0.20 },
            krampf_gerade_vorbei: { probability: 0.60 },
            kind_wacht_auf: { probability: 0.20 }
        }
    },
    
    fieber: {
        temperatur: {
            38_5_bis_39: { probability: 0.30 },
            39_bis_40: { probability: 0.50 },
            ueber_40: { probability: 0.20 }
        },
        anstieg: {
            schnell: { probability: 0.80, note: 'Schneller Fieberanstieg typisch!' },
            langsam: { probability: 0.20 }
        },
        ursache: {
            viraler_infekt: { probability: 0.70 },
            otitis_media: { probability: 0.15 },
            harnwegsinfekt: { probability: 0.08 },
            andere: { probability: 0.07 }
        }
    },
    
    krampf_typ: {
        einfacher_fieberkrampf: {
            probability: 0.75,
            dauer: '<15min',
            generalisiert: true,
            einmalig: true,
            prognose: 'gut'
        },
        komplizierter_fieberkrampf: {
            probability: 0.25,
            charakteristika: ['dauer_>15min', 'fokal', 'mehrfach_24h', 'nachphase_>1h'],
            abklaerung_intensiver: true
        }
    },
    
    symptome: {
        waehrend_krampf: {
            bewusstlosigkeit: { probability: 0.90 },
            versteifen: { probability: 0.85 },
            zuckungen: { probability: 0.95 },
            augen_verdrehen: { probability: 0.80 },
            zyanose: { probability: 0.60 },
            schaum: { probability: 0.30 },
            einnässen: { probability: 0.20 }
        },
        nach_krampf: {
            schläfrigkeit: { probability: 0.90 },
            verwirrtheit: { probability: 0.60 },
            weinen: { probability: 0.70 },
            erschöpfung: { probability: 0.85 }
        }
    },
    
    anfallsdauer: {
        unter_5min: {
            probability: 0.70,
            note: 'Typisch und harmlos'
        },
        5_bis_15min: {
            probability: 0.20,
            note: 'Noch im Rahmen'
        },
        ueber_15min: {
            probability: 0.10,
            note: 'Komplizierter Fieberkrampf',
            therapie_erwägen: true
        }
    },
    
    wiederholung: {
        erstmaliger_fieberkrampf: {
            probability: 0.60,
            eltern_extrem_verängstigt: true
        },
        rezidiv: {
            probability: 0.40,
            eltern_kennen_es: true,
            trotzdem_beunruhigt: true
        }
    },
    
    familienanamnese: {
        fieberkrämpfe_familie: {
            probability: 0.30,
            note: 'Genetische Disposition'
        }
    },
    
    locations: {
        zuhause: { probability: 0.90, address_types: ['residential'] },
        kita: { probability: 0.08, address_types: ['kindergarten'] },
        andere: { probability: 0.02 }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.10,
            triggers: ['anhaltender_krampf', 'status_epilepticus', 'ateminsuffizienz']
        },
        zielklinik: {
            kinderklinik: { probability: 1.0 }
        },
        transport_erforderlich: {
            ja_erstmaliger: { probability: 0.90, bei: 'erstmaliger_fieberkrampf' },
            ja_komplizierter: { probability: 1.0, bei: 'kompliziert' },
            optional: { probability: 0.30, bei: 'bekannt_unkompliziert_kurz' }
        }
    },
    
    differentialdiagnose: {
        meningitis: {
            note: 'WICHTIG auszuschließen!',
            warnzeichen: ['nackensteife', 'petechien', 'schwer_krank'],
            bei_verdacht: 'sofort_klinik'
        },
        epilepsie: {
            note: 'Ohne Fieber',
            abgrenzung: 'Temperatur entscheidend'
        }
    },
    
    komplikationen: {
        status_epilepticus: {
            probability: 0.05,
            dauer: '>30min',
            severity: 'kritisch'
        },
        aspirationspneumonie: {
            probability: 0.03
        },
        langzeitfolgen: {
            probability: 0.01,
            note: 'Sehr selten bei einfachen Fieberkrämpfen'
        }
    },
    
    prognose: {
        wiederholungsrisiko: {
            probability: 0.30,
            note: '30% haben weiteren Fieberkrampf'
        },
        epilepsie_später: {
            probability: 0.02,
            erhöht_wenn: 'kompliziert_oder_familienanamnese'
        },
        meist_harmlos: {
            note: 'Keine Hirnschäden bei einfachen Fieberkrämpfen'
        }
    },
    
    eskalation: {
        krampf_hört_nicht_auf: {
            probability: 0.08,
            announcement: 'Es krampft jetzt seit 10 Minuten! Hört nicht auf!',
            severity: 'kritisch'
        },
        zweiter_krampf: {
            probability: 0.10,
            announcement: 'Es krampft schon wieder!'
        },
        kind_wacht_auf: {
            probability: 0.70,
            announcement: 'Er wacht auf... ist aber sehr müde und weinerlich'
        },
        fieber_sinkt: {
            probability: 0.40,
            announcement: 'Nach den fiebersenkenden Maßnahmen geht das Fieber runter'
        }
    },
    
    elternberatung: {
        beruhigung: {
            note: 'Fieberkrampf sieht dramatisch aus, ist aber meist harmlos',
            wichtig: 'Keine Hirnschäden'
        },
        maßnahmen: {
            während: ['seitenlage', 'zeit_stoppen', 'nichts_in_mund', 'nicht_festhalten'],
            danach: ['fieber_senken', 'ärztliche_kontrolle', 'ursache_klären']
        },
        prävention: {
            note: 'Frühzeitige Fiebersenkung kann helfen',
            aber: 'Nicht immer verhinderbar'
        },
        wiederholung: {
            risiko: '30%',
            notfallmedikament: 'Bei Bedarf vom Kinderarzt'
        }
    },
    
    zeitfaktoren: {
        jahreszeit: {
            winter: 1.8,
            herbst_frühling: 1.3,
            sommer: 0.6,
            note: 'Mehr Infekte im Winter'
        }
    },
    
    lernziele: [
        'Fieberkrampf erkennen',
        'Eltern intensiv beruhigen!',
        'Meist harmlos trotz dramatischem Aussehen',
        'Einfach vs. kompliziert',
        'Meningitis ausschließen!',
        'Fieber als Auslöser',
        'Wiederholungsrisiko 30%'
    ]
};

export default FIEBERKRAMPF_TEMPLATE;