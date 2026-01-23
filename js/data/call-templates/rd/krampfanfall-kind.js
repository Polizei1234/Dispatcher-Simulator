// =========================================================================================
// TEMPLATE: KRAMPFANFALL BEI KIND
// Beschreibung: Epileptischer Anfall oder symptomatisch bei Kindern
// =========================================================================================

export const KRAMPFANFALL_KIND_TEMPLATE = {
    id: 'krampfanfall_kind',
    kategorie: 'rd',
    stichwort: 'Krampfanfall Kind',
    weight: 2,
    
    anrufer: {
        typen: {
            eltern_extrem_panisch: {
                probability: 0.75,
                speech_pattern: 'extrem_panisch',
                variations: [
                    'Mein Kind krampft! Es zuckt am ganzen Körper!',
                    'Hilfe! Meine Tochter hat einen Anfall!',
                    'Mein Sohn krampft! Seine Augen sind verdreht!',
                    'Sie hört nicht auf zu krampfen! Schnell!',
                    'Er wird ganz steif und zuckt! Was soll ich tun?!'
                ],
                background_sounds: ['child_unconscious', 'panic', 'crying']
            },
            kita_schule: {
                probability: 0.15,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Ein Kind hat hier einen Krampfanfall!',
                    'Schüler krampft, bekannte Epilepsie.'
                ]
            },
            zeuge: {
                probability: 0.08,
                speech_pattern: 'überfordert',
                variations: [
                    'Ein Kind krampft hier!'
                ]
            },
            verwandte: {
                probability: 0.02,
                speech_pattern: 'panisch',
                variations: [
                    'Mein Enkel hat einen Anfall!'
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
            peak1: { mean: 2, stddev: 1.5, weight: 0.3 },
            peak2: { mean: 8, stddev: 4, weight: 0.7 },
            min: 0.5,
            max: 16,
            einheit: 'jahre'
        },
        zustand_bei_anruf: {
            krampft_noch: { probability: 0.30 },
            krampf_vorbei_bewusstlos: { probability: 0.40 },
            krampf_vorbei_wach: { probability: 0.25 },
            mehrfache_anfaelle: { probability: 0.05 }
        }
    },
    
    anfall_typ: {
        fieberkrampf: {
            probability: 0.35,
            note: 'Eigenes Template, hier nur wenn nicht erkannt',
            temperatur: '>38.5°C'
        },
        epilepsie_bekannt: {
            probability: 0.40,
            notfallmedikament: { probability: 0.70 },
            anfall_typisch: true
        },
        erstanfall: {
            probability: 0.20,
            note: 'Besonders beunruhigend für Eltern',
            abklaerung_zwingend: true
        },
        symptomatisch: {
            probability: 0.05,
            ursachen: ['infektion', 'trauma', 'intoxikation', 'stoffwechsel']
        }
    },
    
    anfallscharakter: {
        generalisiert_tonisch_klonisch: {
            probability: 0.70,
            symptome: ['bewusstlosigkeit', 'versteifen', 'rhythmisches_zucken', 'schaum'],
            dramatisch: true
        },
        fokal: {
            probability: 0.20,
            symptome: ['begrenzte_zuckungen', 'bewusstsein_eingeschränkt'],
            weniger_dramatisch: true
        },
        absence: {
            probability: 0.10,
            symptome: ['kurze_bewusstseinsaussetzer', 'starrer_blick'],
            oft_nicht_als_anfall_erkannt: true
        }
    },
    
    symptome: {
        während_anfall: {
            bewusstlosigkeit: { probability: 0.80 },
            verkrampfung: { probability: 0.85 },
            zuckungen: { probability: 0.90 },
            augen_verdrehen: { probability: 0.75 },
            schaum_vor_mund: { probability: 0.50 },
            zungenbiß: { probability: 0.30 },
            einnässen: { probability: 0.40 },
            zyanose: { probability: 0.60 }
        },
        nach_anfall: {
            müdigkeit: { probability: 0.90 },
            verwirrtheit: { probability: 0.70 },
            kopfschmerzen: { probability: 0.50 },
            muskelkater: { probability: 0.60 }
        }
    },
    
    anfallsdauer: {
        unter_2min: {
            probability: 0.60,
            note: 'Meist selbstlimitierend'
        },
        2_5min: {
            probability: 0.25,
            note: 'Länger, Medikamente erwägen'
        },
        ueber_5min: {
            probability: 0.10,
            note: 'Status epilepticus!',
            severity: 'kritisch'
        },
        rezidivierend: {
            probability: 0.05,
            note: 'Mehrere Anfälle hintereinander'
        }
    },
    
    locations: {
        zuhause: { probability: 0.70, address_types: ['residential'] },
        kita_schule: { probability: 0.20, address_types: ['school', 'kindergarten'] },
        öffentlich: { probability: 0.10, address_types: ['public_place'] }
    },
    
    besonderheiten: {
        notfallmedikament_vorhanden: {
            probability: 0.30,
            medikamente: ['diazepam-rektal', 'midazolam-bukkal'],
            gegeben: { probability: 0.60 }
        },
        bekannte_epilepsie: {
            probability: 0.40,
            anfallskalender: 'vorhanden',
            eltern_erfahren: true
        },
        erstanfall: {
            probability: 0.25,
            eltern_traumatisiert: true,
            umfassende_diagnostik: 'erforderlich'
        },
        auslöser: {
            fieber: { probability: 0.35 },
            medikamente_vergessen: { probability: 0.15 },
            schlafmangel: { probability: 0.10 },
            lichtreize: { probability: 0.05 },
            unbekannt: { probability: 0.35 }
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.20,
            triggers: ['status_epilepticus', 'mehrfache_anfälle', 'ateminsuffizienz', 'erstanfall_säugling']
        },
        zielklinik: {
            kinderklinik: { probability: 0.90 },
            standard: { probability: 0.10 }
        },
        transport_notwendig: {
            ja: { probability: 0.80 },
            nein_bekannte_epilepsie: { probability: 0.20, bei: 'typischer_kurzer_anfall' }
        }
    },
    
    eltern_beratung: {
        lagerung: 'Seitenlage nach Anfall',
        nicht_tun: ['mund_öffnen', 'festhalten', 'beatmen_während_anfall'],
        tun: ['zeit_stoppen', 'polstern', 'beobachten', 'ruhe_bewahren']
    },
    
    eskalation: {
        status_epilepticus: {
            probability: 0.12,
            announcement: 'Es hört nicht auf! Es sind schon 10 Minuten!',
            severity: 'kritisch'
        },
        zweiter_anfall: {
            probability: 0.15,
            announcement: 'Er krampft schon wieder!'
        },
        atemstillstand: {
            probability: 0.05,
            announcement: 'Er atmet nicht mehr richtig!'
        },
        anfall_vorbei_kind_wacht_auf: {
            probability: 0.50,
            announcement: 'Es ist vorbei, er wacht auf... aber ist noch sehr müde'
        }
    },
    
    lernziele: [
        'Krampfanfall bei Kind ernst nehmen',
        'Eltern beruhigen - meist ungefährlich',
        'Status epilepticus erkennen',
        'Erstanfall vs. bekannte Epilepsie',
        'Fieberkrampf abgrenzen',
        'Kinderklinik als Ziel'
    ]
};

export default KRAMPFANFALL_KIND_TEMPLATE;