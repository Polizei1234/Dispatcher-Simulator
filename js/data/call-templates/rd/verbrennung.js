// =========================================================================================
// TEMPLATE: VERBRENNUNG / VERBRÜHUNG
// Beschreibung: Thermische Verletzungen - Grad I bis III
// =========================================================================================

export const VERBRENNUNG_TEMPLATE = {
    id: 'verbrennung',
    kategorie: 'rd',
    stichwort: 'Verbrennung / Verbrühung',
    weight: 2,
    
    anrufer: {
        typen: {
            patient_selbst: {
                probability: 0.25,
                speech_pattern: 'schmerzgeplagt',
                variations: [
                    '*weint* Ich habe mich verbrannt! Es tut so weh!',
                    'Ich habe heißes Wasser übergeschüttet bekommen!',
                    'Ich habe mich an der Herdplatte verbrannt!'
                ]
            },
            angehöriger_panisch: {
                probability: 0.50,
                speech_pattern: 'panisch',
                variations: [
                    'Mein Kind hat sich mit heißem Wasser verbrüht!',
                    'Er hat sich schwer verbrannt! Die Haut löst sich ab!',
                    'Sie hat kochendes Wasser übergeschüttet bekommen!',
                    'Grillunfall! Er steht in Flammen!'
                ],
                background_sounds: ['crying', 'screaming']
            },
            zeuge: {
                probability: 0.15,
                speech_pattern: 'aufgeregt',
                variations: [
                    'Jemand hat sich schwer verbrannt!',
                    'Brand! Person schwer verletzt!',
                    'Explosion! Jemand mit Verbrennungen!'
                ]
            },
            feuerwehr: {
                probability: 0.10,
                speech_pattern: 'professionell',
                variations: [
                    'Feuerwehr vor Ort, Person mit Verbrennungen Grad 2-3.',
                    'Brand gelöscht, Patient mit ca. 30% Verbrennungen.'
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
            peak1: { mean: 4, stddev: 3, weight: 0.2 },
            peak2: { mean: 42, stddev: 20, weight: 0.8 },
            min: 1,
            max: 85
        },
        bewusstsein: {
            wach: { probability: 0.85 },
            verwirrt: { probability: 0.10 },
            bewusstlos: { probability: 0.05 }
        }
    },
    
    verbrennungsgrad: {
        grad_1: {
            probability: 0.35,
            severity: 'leicht',
            symptome: 'Rötung, Schmerzen',
            beispiel: 'Sonnenbrand'
        },
        grad_2a: {
            probability: 0.30,
            severity: 'mittel',
            symptome: 'Blasen, starke Schmerzen',
            heilung: 'ohne_narben'
        },
        grad_2b: {
            probability: 0.20,
            severity: 'mittel-schwer',
            symptome: 'Tiefrote Blasen, Schmerzen',
            heilung: 'mit_narben'
        },
        grad_3: {
            probability: 0.12,
            severity: 'schwer',
            symptome: 'Weiß/schwarz, keine Schmerzen',
            details: 'Alle Hautschichten betroffen'
        },
        grad_4: {
            probability: 0.03,
            severity: 'kritisch',
            symptome: 'Verkohlung',
            details: 'Muskeln/Knochen betroffen'
        }
    },
    
    körperoberfläche: {
        unter_10_prozent: {
            probability: 0.50,
            severity: 'leicht-mittel'
        },
        10_20_prozent: {
            probability: 0.25,
            severity: 'mittel-schwer'
        },
        20_40_prozent: {
            probability: 0.15,
            severity: 'schwer',
            verbrennungszentrum: true
        },
        ueber_40_prozent: {
            probability: 0.10,
            severity: 'kritisch',
            verbrennungszentrum: true,
            lebensbedrohlich: true
        }
    },
    
    ursache: {
        verbrühung: {
            probability: 0.45,
            details: 'Heißes Wasser, Tee, Suppe',
            häufig_bei: 'Kindern'
        },
        kontakt: {
            probability: 0.25,
            details: 'Herdplatte, Bügeleisen, Ofen'
        },
        flamme: {
            probability: 0.15,
            details: 'Grill, Feuer, Explosion',
            oft_inhalation: true
        },
        chemisch: {
            probability: 0.08,
            details: 'Säuren, Laugen',
            spülung: 'wichtig'
        },
        elektrisch: {
            probability: 0.05,
            details: 'Strom',
            herz_monitoring: 'erforderlich'
        },
        andere: {
            probability: 0.02
        }
    },
    
    lokalisation: {
        extremitäten: { probability: 0.50 },
        rumpf: { probability: 0.30 },
        kopf_hals: { probability: 0.15 },
        genital: { probability: 0.05 }
    },
    
    besondere_lokalisationen: {
        gesicht: {
            probability: 0.12,
            note: 'Inhalationstrauma-Risiko, Verbrennungszentrum'
        },
        hände: {
            probability: 0.20,
            note: 'Funktionserhalt wichtig'
        },
        genital: {
            probability: 0.05,
            note: 'Verbrennungszentrum'
        },
        zirkulär: {
            probability: 0.08,
            note: 'Kompartmentsyndrom-Risiko'
        }
    },
    
    locations: {
        zuhause: { probability: 0.70, address_types: ['residential'] },
        arbeitsplatz: { probability: 0.15, address_types: ['industrial', 'commercial'] },
        öffentlich: { probability: 0.10, address_types: ['public_place'] },
        brandstelle: { probability: 0.05, address_types: ['fire'] }
    },
    
    komplikationen: {
        inhalationstrauma: {
            probability: 0.15,
            bei: 'Flammenverbrennung in geschlossenen Räumen',
            severity: 'kritisch'
        },
        schock: {
            probability: 0.20,
            bei: 'große Körperoberfläche'
        },
        infektion: {
            probability: 0.30,
            zeitverzögert: true
        },
        kompartmentsyndrom: {
            probability: 0.08,
            bei: 'zirkuläre Verbrennungen'
        }
    },
    
    disposition: {
        base_recommendation: { rtw: 1, nef: 0, ktw: 0 },
        nef_indikation: {
            probability: 0.25,
            triggers: ['große_fläche', 'inhalationstrauma', 'schock', 'kind']
        },
        verbrennungszentrum: {
            probability: 0.30,
            indikationen: [
                'grad_3',
                '>10%_grad_2',
                'gesicht_hände_genital',
                'inhalationstrauma',
                'kinder'
            ]
        },
        feuerwehr: {
            probability: 0.20,
            bei: 'brand_im_gebäude'
        }
    },
    
    erstmaßnahmen: {
        kühlung: {
            probability: 0.70,
            details: 'Lauwarmes Wasser, max 10-15min'
        },
        ablöschen: {
            probability: 0.20,
            bei: 'brennende_kleidung'
        },
        abdeckung: {
            probability: 0.40,
            details: 'Sterile Tücher'
        }
    },
    
    zeitfaktoren: {
        tageszeit_modifikator: {
            mittag_abend: 1.3,
            andere: 0.9
        },
        saison: {
            sommer: 1.2,
            winter: 0.9
        }
    },
    
    lernziele: [
        'Verbrennungsgrad einschätzen',
        'Körperoberfläche abschätzen (Neunerregel)',
        'Verbrennungszentrum-Kriterien',
        'Inhalationstrauma erkennen',
        'Kühlung als Erstmaßnahme'
    ]
};

export default VERBRENNUNG_TEMPLATE;