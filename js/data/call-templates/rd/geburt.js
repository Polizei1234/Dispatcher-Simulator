// =========================================================================================
// TEMPLATE: GEBURT / NOTFALLGEBURT
// Beschreibung: Geburt außerhalb der Klinik - meist komplikationslos
// =========================================================================================

export const GEBURT_TEMPLATE = {
    id: 'geburt',
    kategorie: 'rd',
    stichwort: 'Geburt / Notfallgeburt',
    weight: 1,
    
    anrufer: {
        typen: {
            partner_panisch: {
                probability: 0.50,
                speech_pattern: 'extrem_panisch',
                variations: [
                    'Meine Frau bekommt das Baby! JETZT! Ich sehe den Kopf!',
                    'Die Wehen kommen im Minutentakt! Es geht los!',
                    'Sie presst schon! Das Baby kommt!',
                    'Hilfe! Die Fruchtblase ist geplatzt und sie muss pressen!',
                    'Das Baby ist DA! Es ist draußen!'
                ],
                background_sounds: ['woman_screaming', 'moaning', 'panic']
            },
            schwangere_selbst: {
                probability: 0.30,
                speech_pattern: 'pressend_keuchend',
                variations: [
                    '*keuchend* Das Baby kommt! *schreit* Ich muss pressen!',
                    '*presst* Ich... kann nicht... mehr... warten!',
                    'JETZT! Das Baby kommt JETZT!'
                ]
            },
            hebamme: {
                probability: 0.10,
                speech_pattern: 'professionell_dringend',
                variations: [
                    'Hebamme hier, Hausgeburt, Komplikation, RTW dringend!',
                    'Geburt im Gange, Nabelschnur um Hals, bitte schnell!',
                    'Sturzgeburt, Mutter blutet stark!'
                ]
            },
            zeuge: {
                probability: 0.10,
                speech_pattern: 'überfordert',
                variations: [
                    'Eine Frau bekommt hier ein Baby! Im Auto!',
                    'Jemand bekommt ein Baby auf der Straße!'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            female: { probability: 1.0 }
        },
        alter: {
            distribution: 'normal',
            mean: 29,
            stddev: 6,
            min: 16,
            max: 45
        }
    },
    
    geburtsstadium: {
        eröffnungsphase: {
            probability: 0.30,
            wehen: 'regelmäßig_alle_5-10min',
            muttermundöffnung: '<10cm',
            zeit_bis_geburt: 'stunden',
            transport_möglich: true
        },
        austreibungsphase: {
            probability: 0.50,
            wehen: 'alle_1-2min',
            pressdrang: true,
            zeit_bis_geburt: 'minuten',
            transport_kritisch: true
        },
        kind_geboren: {
            probability: 0.20,
            baby_da: true,
            versorgung_erforderlich: true
        }
    },
    
    geburt_typ: {
        spontangeburt_normal: {
            probability: 0.75,
            komplikationen: 'minimal'
        },
        sturzgeburt: {
            probability: 0.15,
            details: 'Sehr schnell, Kind fällt heraus',
            verletzungsgefahr: 'baby'
        },
        kompliziert: {
            probability: 0.10,
            varianten: ['beckenendlage', 'nabelschnur', 'schulterdystokie']
        }
    },
    
    komplikationen: {
        nabelschnurumschlingung: {
            probability: 0.15,
            severity: 'mittel',
            action: 'Schnur lockern/durchtrennen'
        },
        starke_blutung: {
            probability: 0.10,
            ursachen: ['plazentalösung', 'geburtsverletzung'],
            severity: 'schwer'
        },
        beckenendlage: {
            probability: 0.05,
            severity: 'kritisch',
            geburtshilfe_schwierig: true
        },
        schulterdystokie: {
            probability: 0.03,
            severity: 'kritisch',
            schulter_eingeklemmt: true
        },
        frühgeburt: {
            probability: 0.08,
            vor_woche: 37,
            baby_unreif: true
        },
        mehrlingsgeburt: {
            probability: 0.02,
            note: 'Zwillinge!',
            ressourcen: 'verdoppeln'
        }
    },
    
    locations: {
        zuhause: { probability: 0.50, address_types: ['residential'] },
        auto: { probability: 0.25, address_types: ['vehicle'] },
        öffentlich: { probability: 0.15, address_types: ['street', 'public_place'] },
        taxi: { probability: 0.10, address_types: ['vehicle'] }
    },
    
    besonderheiten: {
        erstgebärende: {
            probability: 0.40,
            geburtsdauer: 'länger'
        },
        mehrgebärende: {
            probability: 0.60,
            geburtsdauer: 'kürzer',
            sturzgeburt_wahrscheinlicher: true
        },
        geplante_hausgeburt: {
            probability: 0.10,
            hebamme_vor_ort: 0.70
        },
        auf_weg_klinik: {
            probability: 0.40,
            note: 'Wollten es noch schaffen'
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.15,
            triggers: ['komplikation', 'blutung', 'baby_reanimation', 'frühgeburt']
        },
        zweiter_rtw: {
            probability: 0.10,
            bei: 'mehrlinge_oder_komplikationen'
        },
        zielklinik: {
            geburtsklinik: { probability: 0.85 },
            perinatalzentrum: { probability: 0.15, bei: 'frühgeburt_komplikation' }
        }
    },
    
    baby_versorgung: {
        absaugen: {
            note: 'Mund und Nase vorsichtig',
            nur_bei_bedarf: true
        },
        abnabeln: {
            note: 'Nach 1-3 Minuten',
            zwei_klemmen: true
        },
        wärmeerhalt: {
            note: 'Abtrocknen, warm halten',
            kritisch: 'Neugeborene kühlen schnell aus'
        },
        apgar_score: {
            note: '1min, 5min, 10min',
            dokumentation: true
        },
        bonding: {
            note: 'Hautkontakt Mutter-Kind wenn möglich'
        }
    },
    
    eskalation: {
        baby_reanimation: {
            probability: 0.05,
            announcement: 'Das Baby atmet nicht!',
            severity: 'kritisch'
        },
        starke_blutung_mutter: {
            probability: 0.12,
            announcement: 'Sie blutet sehr stark!'
        },
        zwilling_kommt: {
            probability: 0.02,
            announcement: 'Da kommt noch ein Baby!',
            überraschung: true
        },
        plazenta_kommt: {
            probability: 0.60,
            note: 'Nachgeburtsphase',
            normal: true
        }
    },
    
    zeitfaktoren: {
        tageszeit: {
            nacht: 1.3,
            tag: 0.9
        }
    },
    
    lernziele: [
        'Geburtsstadien erkennen',
        'Wann noch transportieren?',
        'Geburtshilfe leisten',
        'Baby-Erstversorgung',
        'Komplikationen erkennen',
        'Ruhe bewahren - meist läuft es gut!'
    ]
};

export default GEBURT_TEMPLATE;