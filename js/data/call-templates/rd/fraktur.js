// =========================================================================================
// TEMPLATE: FRAKTUR (KNOCHENBRUCH)
// Beschreibung: Knochenbrüche verschiedener Lokalisation - häufig bei Senioren
// =========================================================================================

export const FRAKTUR_TEMPLATE = {
    id: 'fraktur',
    kategorie: 'rd',
    stichwort: 'Fraktur / Knochenbruch',
    weight: 3,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.25,
                speech_pattern: 'schmerzgeplagt',
                variations: [
                    'Ich bin gestürzt, mein Arm tut wahnsinnig weh!',
                    'Ich glaube mein Bein ist gebrochen! *stöhnt*',
                    'Ich kann nicht aufstehen, es tut so weh!',
                    'Mein Handgelenk ist total geschwollen, ich kann es nicht bewegen!'
                ]
            },
            angehöriger: {
                probability: 0.50,
                speech_pattern: 'besorgt',
                variations: [
                    'Meine Mutter ist gestürzt, ich glaube ihre Hüfte ist gebrochen!',
                    'Er ist von der Leiter gefallen, sein Arm sieht schlimm aus!',
                    'Sie kann nicht aufstehen, sie hat furchtbare Schmerzen!',
                    'Mein Vater ist hingefallen, das Bein ist komisch verdreht!'
                ],
                background_sounds: ['patient_moaning']
            },
            pflegepersonal: {
                probability: 0.15,
                speech_pattern: 'professionell',
                variations: [
                    'Bewohnerin nach Sturz, Verdacht auf Schenkelhalsfraktur.',
                    'Patient mit offensichtlicher Unterarmfraktur nach Sturz.',
                    'Hüftfraktur-Verdacht, Patient immobil, starke Schmerzen.'
                ]
            },
            zeuge: {
                probability: 0.08,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Jemand ist gestürzt und schreit vor Schmerzen!',
                    'Eine Frau liegt hier, sie sagt ihr Bein ist gebrochen!'
                ]
            },
            arbeitskollege: {
                probability: 0.02,
                speech_pattern: 'sachlich',
                variations: [
                    'Arbeitsunfall, Kollege hat sich den Arm gebrochen.'
                ]
            }
        }
    },
    
    patient: {
        geschlecht: {
            male: { probability: 0.45 },
            female: { probability: 0.55 }
        },
        alter: {
            distribution: 'bimodal',
            peak1: { mean: 35, stddev: 15, weight: 0.3 },
            peak2: { mean: 75, stddev: 10, weight: 0.7 },
            min: 18,
            max: 95
        },
        bewusstsein: {
            wach: { probability: 0.90 },
            verwirrt: { probability: 0.08 },
            bewusstlos: { probability: 0.02 }
        }
    },
    
    fraktur_typ: {
        schenkelhalsfraktur: {
            probability: 0.30,
            alter: 'meist >70',
            severity: 'schwer',
            mobilität: 'keine'
        },
        unterarmfraktur: {
            probability: 0.25,
            severity: 'mittel',
            mobilität: 'eingeschränkt'
        },
        sprunggelenkfraktur: {
            probability: 0.15,
            severity: 'mittel',
            mobilität: 'keine'
        },
        radiusfraktur: {
            probability: 0.12,
            severity: 'leicht-mittel',
            häufig_bei: 'sturz_auf_hand'
        },
        rippenfraktur: {
            probability: 0.08,
            severity: 'mittel',
            atemabhängig: true
        },
        andere: {
            probability: 0.10,
            types: ['schlüsselbein', 'hand', 'fuß', 'oberschenkel']
        }
    },
    
    symptome: {
        hauptsymptome: {
            starke_schmerzen: { probability: 0.95 },
            schwellung: { probability: 0.85 },
            bewegungseinschränkung: { probability: 0.90 },
            fehlstellung: { probability: 0.30 }
        },
        begleitsymptome: {
            hämatom: { probability: 0.70 },
            krepitation: { probability: 0.25 },
            schockzeichen: { probability: 0.15 },
            wunde: { probability: 0.10 }
        }
    },
    
    unfallmechanismus: {
        sturz_ebenerdig: {
            probability: 0.50,
            details: 'Häuslicher Sturz, gestolpert'
        },
        sturz_höhe: {
            probability: 0.15,
            details: 'Leiter, Treppe'
        },
        sport: {
            probability: 0.10,
            details: 'Fußball, Ski, Fahrrad'
        },
        verkehrsunfall: {
            probability: 0.10,
            details: 'PKW, Motorrad, Fahrrad'
        },
        arbeitsunfall: {
            probability: 0.08,
            details: 'Baustelle, Betrieb'
        },
        andere: {
            probability: 0.07
        }
    },
    
    locations: {
        zuhause: { probability: 0.55, address_types: ['residential'] },
        pflegeheim: { probability: 0.20, address_types: ['care_home'] },
        öffentlich: { probability: 0.15, address_types: ['street', 'park'] },
        arbeitsplatz: { probability: 0.08, address_types: ['commercial', 'industrial'] },
        sport: { probability: 0.02, address_types: ['sports_facility'] }
    },
    
    komplikationen: {
        schock: {
            probability: 0.12,
            bei: 'großen Frakturen, Blutverlust'
        },
        kompartmentsyndrom: {
            probability: 0.03,
            zeitkritisch: true
        },
        offene_fraktur: {
            probability: 0.08,
            severity: 'schwer',
            infektionsgefahr: true
        },
        nervenschädigung: {
            probability: 0.05,
            symptome: 'Taubheit, Kribbeln'
        },
        gefäßverletzung: {
            probability: 0.02,
            puls_fehlt: true,
            kritisch: true
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.05,
            triggers: ['schock', 'mehrere_frakturen', 'offene_fraktur']
        },
        tragehilfe: {
            probability: 0.25,
            gründe: ['kein_aufzug', 'adipositas', 'enger_zugang']
        }
    },
    
    zeitfaktoren: {
        tageszeit_modifikator: {
            morgen_06_10: 1.2,
            tag: 1.0,
            abend: 0.9,
            nacht: 1.3
        },
        jahreszeit_modifikator: {
            winter: 1.5,
            sommer: 0.8
        },
        wetter_einfluss: {
            glatteis: 2.5,
            nässe: 1.3,
            normal: 1.0
        }
    },
    
    besonderheiten: {
        osteoporose: {
            probability: 0.40,
            alter_gruppe: '>70',
            note: 'Erhöhtes Frakturrisiko'
        },
        antikoagulation: {
            probability: 0.25,
            blutungsgefahr: 'erhöht'
        },
        demenz: {
            probability: 0.15,
            anamnese: 'erschwert'
        }
    }
};

export default FRAKTUR_TEMPLATE;
