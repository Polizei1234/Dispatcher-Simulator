// =========================================================================================
// TEMPLATE: PSEUDOKRUPP
// Beschreibung: Virale Kehlkopfentzündung bei Kleinkindern - bellender Husten
// =========================================================================================

export const PSEUDOKRUPP_TEMPLATE = {
    id: 'pseudokrupp',
    kategorie: 'rd',
    stichwort: 'Pseudokrupp',
    weight: 2,
    
    anrufer: {
        typen: {
            eltern_sehr_besorgt: {
                probability: 0.85,
                speech_pattern: 'sehr_besorgt_panisch',
                variations: [
                    'Mein Kind bekommt keine Luft! Es bellt wie ein Hund!',
                    'Mein Baby hat bellenden Husten und pfeift beim Einatmen!',
                    'Meine Tochter ringt nach Luft! Sie hat Krupp!',
                    'Er bekommt schlecht Luft und hustet ganz komisch!',
                    'Sie pfeift beim Atmen! Ich habe Angst!'
                ],
                background_sounds: ['child_coughing_barking', 'stridor', 'crying']
            },
            großeltern: {
                probability: 0.10,
                speech_pattern: 'besorgt',
                variations: [
                    'Das Enkelkind hustet bellend und bekommt schlecht Luft!'
                ]
            },
            erfahrene_eltern: {
                probability: 0.05,
                speech_pattern: 'sachlich_besorgt',
                variations: [
                    'Mein Sohn hat wieder Pseudokrupp, diesmal schlechter als sonst.',
                    'Krupp-Anfall, Kältetherapie hilft nicht.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.65 },
            female: { probability: 0.35 }
        },
        alter: {
            distribution: 'normal',
            mean: 2.5,
            stddev: 1.5,
            min: 0.5,
            max: 6,
            einheit: 'jahre',
            note: 'Typisch 6 Monate bis 6 Jahre'
        },
        zustand: {
            unruhig_ängstlich: { probability: 0.70 },
            apathisch: { probability: 0.20 },
            weint: { probability: 0.10 }
        }
    },
    
    schweregrad: {
        grad_1_leicht: {
            probability: 0.40,
            symptome: ['bellender_husten', 'kein_stridor_ruhe', 'keine_atemnot'],
            behandlung: 'ambulant_möglich'
        },
        grad_2_mittel: {
            probability: 0.40,
            symptome: ['stridor_ruhe', 'leichte_einziehungen', 'unruhe'],
            behandlung: 'klinik_empfohlen'
        },
        grad_3_schwer: {
            probability: 0.15,
            symptome: ['deutlicher_stridor', 'starke_einziehungen', 'angst', 'tachykardie'],
            behandlung: 'klinik_zwingend'
        },
        grad_4_kritisch: {
            probability: 0.05,
            symptome: ['extreme_atemnot', 'zyanose', 'apathie', 'erschöpfung'],
            intubation: 'evtl_erforderlich',
            severity: 'lebensbedrohlich'
        }
    },
    
    symptome: {
        typische_trias: {
            bellender_husten: { probability: 0.95 },
            inspiratorischer_stridor: { probability: 0.85 },
            heiserkeit: { probability: 0.90 }
        },
        atemnot_zeichen: {
            einziehungen: { probability: 0.70 },
            nasenflügeln: { probability: 0.60 },
            tachypnoe: { probability: 0.75 },
            unruhe: { probability: 0.80 }
        },
        schwere_zeichen: {
            zyanose: { probability: 0.10 },
            apathie: { probability: 0.08 },
            erschöpfung: { probability: 0.12 }
        },
        begleitsymptome: {
            fieber: { probability: 0.60 },
            schnupfen: { probability: 0.80 },
            erkaeltung_vorher: { probability: 0.90 }
        }
    },
    
    zeitfaktoren: {
        tageszeit: {
            nacht_20_04: 2.5,
            abend_18_22: 2.0,
            tag: 0.3,
            note: 'Typischerweise nachts schlimmer!'
        },
        jahreszeit: {
            herbst: 2.0,
            winter: 1.8,
            frühling: 1.0,
            sommer: 0.4
        },
        wetter: {
            feucht_kalt: 1.5,
            andere: 1.0
        }
    },
    
    besonderheiten: {
        wiederholte_episoden: {
            probability: 0.40,
            note: 'Viele Kinder haben mehrfache Krupp-Anfälle'
        },
        erste_episode: {
            probability: 0.60,
            eltern_sehr_beunruhigt: true
        },
        vorbehandlung_zuhause: {
            probability: 0.50,
            maßnahmen: ['kalte_luft', 'dampf', 'aufrechte_position']
        },
        viraler_infekt_vorher: {
            probability: 0.90,
            dauer: '1-3 Tage'
        }
    },
    
    locations: {
        zuhause: { probability: 0.95, address_types: ['residential'] },
        andere: { probability: 0.05 }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.08,
            triggers: ['grad_4', 'zyanose', 'erschöpfung', 'intubation_drohend']
        },
        zielklinik: {
            kinderklinik: { probability: 1.0 }
        },
        transport_erforderlich: {
            grad_3_4: { probability: 1.0 },
            grad_2: { probability: 0.80 },
            grad_1: { probability: 0.40 }
        }
    },
    
    behandlung: {
        kortison: {
            note: 'Rektal oder i.v., wirkt nach 30min',
            wichtig: 'Frühzeitige Gabe'
        },
        adrenalin_inhalation: {
            note: 'Bei schweren Fällen',
            wirkung: 'Sofort, aber kurz'
        },
        kalte_luft: {
            note: 'Kann helfen, Kind beruhigen',
            eltern_maßnahme: true
        },
        kind_beruhigen: {
            note: 'Aufregung verschlimmert!',
            wichtig: 'Eltern ruhig halten'
        }
    },
    
    differentialdiagnose: {
        epiglottitis: {
            note: 'LEBENSBEDROHLICH! Abgrenzung wichtig',
            unterschiede: 'Speichelfluss, Fieber >39°C, sehr krank'
        },
        fremdkörper: {
            note: 'Plötzlicher Beginn ohne Infekt'
        }
    },
    
    eskalation: {
        verschlechterung: {
            probability: 0.15,
            announcement: 'Es wird schlimmer! Er bekommt immer schlechter Luft!'
        },
        besserung_durch_kälte: {
            probability: 0.30,
            announcement: 'Draußen in der kühlen Luft geht es besser!',
            note: 'Trotzdem ärztliche Kontrolle'
        },
        erschöpfung: {
            probability: 0.08,
            announcement: 'Er wird ganz schläfrig und kämpft nicht mehr...',
            severity: 'kritisch'
        }
    },
    
    elternberatung: {
        beruhigung: 'Meist nicht lebensbedrohlich',
        maßnahmen: ['Kind beruhigen', 'aufrechte Position', 'frische Luft'],
        warnzeichen: ['Zyanose', 'Apathie', 'Trinkverweigerung'],
        wiederholung: 'Kann mehrfach auftreten'
    },
    
    lernziele: [
        'Pseudokrupp typische Symptome',
        'Nachts am schlimmsten',
        'Schweregrad-Einteilung',
        'Epiglottitis abgrenzen!',
        'Eltern beruhigen',
        'Kind ruhig halten wichtig'
    ]
};

export default PSEUDOKRUPP_TEMPLATE;